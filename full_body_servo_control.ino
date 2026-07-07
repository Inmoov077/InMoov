// ============================================================
// InMoov — FULL BODY Servo Controller (Arduino Mega 2560)
// ============================================================
// Single firmware for head+body. Pin map, limits, rest poses, and
// built-in patterns come from servo_config.h (generated from MRL 1.1.1610).
//
// Uncomment for head-only (6 servos) on Arduino Uno:
// #define HEAD_ONLY
//
// Serial protocol (9600 baud):
//   ?                         Handshake → ARDUINO_OK / FULL_BODY_READY
//   H,<neck>,<eye>,<jaw>      Head servos
//   N,<rot>,<tilt>,<roll>     Neck servos
//   C,<6 values>              Combined head+neck
//   LA/RA/LH/RH/LL/RL,<5>     Body groups
//   G,<pattern>               Run built-in pattern (nod, shake, yes, no, bow, relax)
//   X                         Abort running pattern
//   W,<idx>,<pin>             Reassign servo pin at runtime (0–35, pin 2–53)
//   U,<idx>,<min>,<max>,<rest> Update servo limits at runtime
//   K,<side>,<pct>            Grip fingers — side R/L/B, pct 0–100
//   E,<mask>                  Enable body groups (bitmask, default 255=all)
//   D                         Dump pin/limit/rest config
//   R                         Read all current positions
//   S                         Emergency stop — center all
// ============================================================

#include <Servo.h>
#include <avr/pgmspace.h>
#include "servo_config.h"

#ifndef HEAD_ONLY
#define ACTIVE_SERVOS SERVO_COUNT
#else
#define ACTIVE_SERVOS 6
#endif

Servo servos[SERVO_COUNT];
uint8_t pins[SERVO_COUNT];
uint8_t limMin[SERVO_COUNT];
uint8_t limMax[SERVO_COUNT];
uint8_t limRest[SERVO_COUNT];
byte enableMask = 0xFF;
int targets[SERVO_COUNT];
float current[SERVO_COUNT];

const float DEAD_ZONE = 0.3;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_MS = 15;
unsigned long lastFeedback = 0;
const unsigned long FEEDBACK_MS = 500;

// Pattern runner state
bool patternActive = false;
uint8_t patternIdx = 0;
uint8_t patternStep = 0;
unsigned long patternStepStart = 0;
bool patternTransitioning = false;
unsigned long patternTransStart = 0;
const unsigned long PATTERN_TRANS_MS = 400;
float patternFrom[6];
float patternTo[6];

uint8_t readPin(int i) { return pins[i]; }
uint8_t readMin(int i) { return limMin[i]; }
uint8_t readMax(int i) { return limMax[i]; }
uint8_t readRest(int i) { return limRest[i]; }
uint8_t readEaseByte(int i) { return pgm_read_byte(&SERVO_EASE[i]); }
float readEase(int i) { return readEaseByte(i) / 255.0f; }

bool isGroupEnabled(int idx) {
  if (idx < 3)  return enableMask & 0x01;
  if (idx < 6)  return enableMask & 0x02;
  if (idx < 11) return enableMask & 0x04;
  if (idx < 16) return enableMask & 0x08;
  if (idx < 21) return enableMask & 0x10;
  if (idx < 26) return enableMask & 0x20;
  if (idx < 31) return enableMask & 0x40;
  return enableMask & 0x80;
}

int clampServo(int idx, int v) {
  return constrain(v, readMin(idx), readMax(idx));
}

void applyGrip(char side, int pct) {
  pct = constrain(pct, 0, 100);
  int start = -1, end = -1;
  if (side == 'R' || side == 'r') { start = 21; end = 25; }
  else if (side == 'L' || side == 'l') { start = 16; end = 20; }
  else if (side == 'B' || side == 'b') { start = 16; end = 25; }
  if (start < 0) return;
  for (int i = start; i <= end; i++) {
    if (!isGroupEnabled(i)) continue;
    targets[i] = map(pct, 0, 100, readMin(i), readMax(i));
  }
}

void attachServo(int i) {
  if (i >= ACTIVE_SERVOS) return;
  servos[i].attach(pins[i], 600, 2400);
}

void detachServo(int i) {
  if (i < ACTIVE_SERVOS) servos[i].detach();
}

void setTarget(int idx, int v) {
  if (idx < 0 || idx >= ACTIVE_SERVOS || !isGroupEnabled(idx)) return;
  targets[idx] = clampServo(idx, v);
}

void setTargets(int start, int count, int vals[]) {
  for (int i = 0; i < count; i++) {
    setTarget(start + i, vals[i]);
  }
}

void centerAllNow() {
  patternActive = false;
  for (int i = 0; i < ACTIVE_SERVOS; i++) {
    targets[i] = readRest(i);
    current[i] = readRest(i);
    servos[i].write(readRest(i));
  }
}

void parseFive(const char* args, int startIdx) {
  int v[5];
  if (sscanf(args, ",%d,%d,%d,%d,%d", &v[0], &v[1], &v[2], &v[3], &v[4]) == 5) {
    setTargets(startIdx, 5, v);
  }
}

int findPattern(const char* name) {
  for (uint8_t i = 0; i < PATTERN_COUNT; i++) {
    PatternDef def;
    memcpy_P(&def, &PATTERNS[i], sizeof(def));
    if (strcasecmp_P(name, (PGM_P)def.name) == 0) return i;
  }
  return -1;
}

void startPattern(uint8_t idx) {
  patternActive = true;
  patternIdx = idx;
  patternStep = 0;
  patternStepStart = millis();
  patternTransitioning = true;
  patternTransStart = millis();
  for (int i = 0; i < 6; i++) {
    patternFrom[i] = current[i];
    patternTo[i] = current[i];
  }
}

void applyPatternStepTargets() {
  PatternDef def;
  memcpy_P(&def, &PATTERNS[patternIdx], sizeof(def));
  PatternStep step;
  memcpy_P(&step, &def.steps[patternStep], sizeof(step));
  for (int i = 0; i < 6; i++) {
    if (step.vals[i] >= 0) {
      setTarget(i, step.vals[i]);
      patternTo[i] = step.vals[i];
    }
  }
}

void updatePattern() {
  if (!patternActive) return;

  PatternDef def;
  memcpy_P(&def, &PATTERNS[patternIdx], sizeof(def));

  if (patternTransitioning) {
    float t = (float)(millis() - patternTransStart) / PATTERN_TRANS_MS;
    if (t >= 1.0f) {
      patternTransitioning = false;
      patternStepStart = millis();
      applyPatternStepTargets();
      return;
    }
    for (int i = 0; i < 6; i++) {
      if (patternTo[i] >= 0) {
        float v = patternFrom[i] + (patternTo[i] - patternFrom[i]) * t;
        setTarget(i, (int)round(v));
      }
    }
    return;
  }

  PatternStep step;
  memcpy_P(&step, &def.steps[patternStep], sizeof(step));
  if (millis() - patternStepStart >= step.holdMs) {
    patternStep++;
    if (patternStep >= def.stepCount) {
      patternActive = false;
      Serial.println(F("PATTERN_DONE"));
      return;
    }
    for (int i = 0; i < 6; i++) patternFrom[i] = current[i];
    patternTransitioning = true;
    patternTransStart = millis();
    applyPatternStepTargets();
  }
}

void dumpConfig() {
  Serial.println(F("CFG_BEGIN"));
  for (int i = 0; i < ACTIVE_SERVOS; i++) {
    Serial.print(F("S,"));
    Serial.print(i);
    Serial.print(F(","));
    Serial.print(pins[i]);
    Serial.print(F(","));
    Serial.print(readMin(i));
    Serial.print(F(","));
    Serial.print(readMax(i));
    Serial.print(F(","));
    Serial.println(readRest(i));
  }
  Serial.println(F("CFG_END"));
}

void reportPositions() {
  Serial.print(F("HEAD:"));
  Serial.print((int)round(current[0])); Serial.print(F(","));
  Serial.print((int)round(current[1])); Serial.print(F(","));
  Serial.println((int)round(current[2]));
  Serial.print(F("NECK:"));
  Serial.print((int)round(current[3])); Serial.print(F(","));
  Serial.print((int)round(current[4])); Serial.print(F(","));
  Serial.println((int)round(current[5]));
  if (ACTIVE_SERVOS > 6) {
    Serial.print(F("BODY:"));
    for (int i = 6; i < ACTIVE_SERVOS; i++) {
      if (i > 6) Serial.print(F(","));
      Serial.print((int)round(current[i]));
    }
    Serial.println();
  }
}

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(50);

  for (int i = 0; i < SERVO_COUNT; i++) {
    pins[i] = pgm_read_byte(&SERVO_PINS[i]);
    limMin[i] = pgm_read_byte(&SERVO_MIN[i]);
    limMax[i] = pgm_read_byte(&SERVO_MAX[i]);
    limRest[i] = pgm_read_byte(&SERVO_REST[i]);
  }

  for (int i = 0; i < ACTIVE_SERVOS; i++) {
    attachServo(i);
    targets[i] = readRest(i);
    current[i] = readRest(i);
    servos[i].write(readRest(i));
  }

  delay(500);
  Serial.println(F("ARDUINO_OK"));
  Serial.println(F("NECK_READY"));
#ifndef HEAD_ONLY
  Serial.println(F("FULL_BODY_READY"));
#endif
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    String args = Serial.readStringUntil('\n');

    if (cmd == '?') {
      Serial.println(F("ARDUINO_OK"));
#ifndef HEAD_ONLY
      Serial.println(F("FULL_BODY_READY"));
#else
      Serial.println(F("NECK_READY"));
#endif
    } else if (cmd == 'H') {
      patternActive = false;
      int n = readRest(0), e = readRest(1), j = readRest(2);
      if (sscanf(args.c_str(), ",%d,%d,%d", &n, &e, &j) == 3) {
        int v[3] = { n, e, j };
        setTargets(0, 3, v);
      }
    } else if (cmd == 'N') {
      patternActive = false;
      int r = targets[3], t = targets[4], ro = targets[5];
      if (sscanf(args.c_str(), ",%d,%d,%d", &r, &t, &ro) == 3) {
        int v[3] = { r, t, ro };
        setTargets(3, 3, v);
      }
    } else if (cmd == 'C') {
      patternActive = false;
      int vals[6];
      if (sscanf(args.c_str(), ",%d,%d,%d,%d,%d,%d",
                 &vals[0], &vals[1], &vals[2], &vals[3], &vals[4], &vals[5]) == 6) {
        setTargets(0, 6, vals);
      }
    } else if (cmd == 'L' || cmd == 'R') {
      patternActive = false;
      if (args.length() >= 2 && args.charAt(1) == ',') {
        char sub = args.charAt(0);
        const char* csv = args.c_str() + 1;
#ifndef HEAD_ONLY
        if (cmd == 'L' && sub == 'A') parseFive(csv, 6);
        else if (cmd == 'R' && sub == 'A') parseFive(csv, 11);
        else if (cmd == 'L' && sub == 'H') parseFive(csv, 16);
        else if (cmd == 'R' && sub == 'H') parseFive(csv, 21);
        else if (cmd == 'L' && sub == 'L') parseFive(csv, 26);
        else if (cmd == 'R' && sub == 'L') parseFive(csv, 31);
#endif
      }
    } else if (cmd == 'G') {
      args.trim();
      if (args.length() > 0) {
        int idx = findPattern(args.c_str());
        if (idx >= 0) {
          startPattern((uint8_t)idx);
          Serial.print(F("PATTERN_START,"));
          Serial.println(args);
        } else {
          Serial.println(F("PATTERN_UNKNOWN"));
        }
      }
    } else if (cmd == 'X') {
      patternActive = false;
      Serial.println(F("PATTERN_ABORT"));
    } else if (cmd == 'W') {
      int idx = -1, pin = -1;
      if (sscanf(args.c_str(), ",%d,%d", &idx, &pin) == 2) {
        if (idx >= 0 && idx < ACTIVE_SERVOS && pin >= 2 && pin <= 53) {
          detachServo(idx);
          pins[idx] = (uint8_t)pin;
          attachServo(idx);
          Serial.print(F("PIN_SET,"));
          Serial.print(idx);
          Serial.print(F(","));
          Serial.println(pin);
        }
      }
    } else if (cmd == 'U') {
      int idx = -1, mn = -1, mx = -1, rs = -1;
      if (sscanf(args.c_str(), ",%d,%d,%d,%d", &idx, &mn, &mx, &rs) == 4) {
        if (idx >= 0 && idx < ACTIVE_SERVOS && mn >= 0 && mx <= 180 && mn <= mx) {
          limMin[idx] = (uint8_t)mn;
          limMax[idx] = (uint8_t)mx;
          if (rs >= mn && rs <= mx) limRest[idx] = (uint8_t)rs;
          targets[idx] = clampServo(idx, targets[idx]);
          Serial.print(F("LIMIT_SET,"));
          Serial.print(idx);
          Serial.print(F(","));
          Serial.print(mn);
          Serial.print(F(","));
          Serial.print(mx);
          Serial.print(F(","));
          Serial.println(limRest[idx]);
        }
      }
    } else if (cmd == 'K') {
      args.trim();
      int c1 = args.indexOf(',');
      if (c1 > 0) {
        char side = args.charAt(0);
        int pct = args.substring(c1 + 1).toInt();
        applyGrip(side, pct);
        Serial.print(F("GRIP,"));
        Serial.print(side);
        Serial.print(F(","));
        Serial.println(pct);
      }
    } else if (cmd == 'E') {
      int mask = args.toInt();
      enableMask = (byte)constrain(mask, 0, 255);
      Serial.print(F("ENABLE,"));
      Serial.println(enableMask);
    } else if (cmd == 'D') {
      dumpConfig();
    } else if (cmd == 'R') {
      reportPositions();
    } else if (cmd == 'S') {
      centerAllNow();
      Serial.println(F("STOPPED"));
    }
  }

  updatePattern();

  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_MS) {
    lastUpdate = now;
    for (int i = 0; i < ACTIVE_SERVOS; i++) {
      if (!isGroupEnabled(i)) continue;
      float err = targets[i] - current[i];
      if (abs(err) > DEAD_ZONE) current[i] += err * readEase(i);
      current[i] = constrain(current[i], readMin(i), readMax(i));
      servos[i].write(round(current[i]));
    }
  }

  if (now - lastFeedback >= FEEDBACK_MS) {
    lastFeedback = now;
    Serial.print(F("POS,"));
    for (int i = 0; i < ACTIVE_SERVOS; i++) {
      if (i > 0) Serial.print(F(","));
      Serial.print((int)round(current[i]));
    }
    Serial.println();
  }
}