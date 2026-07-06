// ============================================================
// InMoov — FULL BODY Servo Controller (Arduino Mega 2560)
// ============================================================
// Head (6) + Arms (10) + Hands (10) + Legs (10) = 36 servos
//
// Upload to Arduino Mega 2560. Uses same head protocol as
// combined_servo_control.ino plus body commands:
//
//   LA,<shoulder>,<lift>,<rotate>,<elbow>,<wrist>   Left arm
//   RA,<shoulder>,<lift>,<rotate>,<elbow>,<wrist>   Right arm
//   LH,<thumb>,<index>,<middle>,<ring>,<pinky>      Left hand
//   RH,<thumb>,<index>,<middle>,<ring>,<pinky>      Right hand
//   LL,<hip>,<thigh>,<knee>,<ankle>,<foot>          Left leg
//   RL,<hip>,<thigh>,<knee>,<ankle>,<foot>          Right leg
//
// Head/neck (unchanged):
//   H,<neck>,<eye>,<jaw>   N,<rot>,<tilt>,<roll>   C,<6 values>   S   R   ?
// ============================================================

#include <Servo.h>

// ── HEAD / NECK (pins 3–8) ──
const int PIN_HEAD_NECK = 3;
const int PIN_HEAD_EYE  = 4;
const int PIN_HEAD_JAW  = 5;
const int PIN_NECK_ROT  = 6;
const int PIN_NECK_TILT = 7;
const int PIN_NECK_ROLL = 8;

// ── LEFT ARM (pins 9–13) ──
const int PIN_L_SHOULDER = 9;
const int PIN_L_LIFT     = 10;
const int PIN_L_ROTATE   = 11;
const int PIN_L_ELBOW    = 12;
const int PIN_L_WRIST    = 13;

// ── RIGHT ARM (pins 14–18) ──
const int PIN_R_SHOULDER = 14;
const int PIN_R_LIFT     = 15;
const int PIN_R_ROTATE   = 16;
const int PIN_R_ELBOW    = 17;
const int PIN_R_WRIST    = 18;

// ── LEFT HAND (pins 19–23) ──
const int PIN_L_THUMB  = 19;
const int PIN_L_INDEX  = 20;
const int PIN_L_MIDDLE = 21;
const int PIN_L_RING   = 22;
const int PIN_L_PINKY  = 23;

// ── RIGHT HAND (pins 24–28) ──
const int PIN_R_THUMB  = 24;
const int PIN_R_INDEX  = 25;
const int PIN_R_MIDDLE = 26;
const int PIN_R_RING   = 27;
const int PIN_R_PINKY  = 28;

// ── LEFT LEG (pins 29–33) ──
const int PIN_L_HIP    = 29;
const int PIN_L_THIGH  = 30;
const int PIN_L_KNEE   = 31;
const int PIN_L_ANKLE  = 32;
const int PIN_L_FOOT   = 33;

// ── RIGHT LEG (pins 34–38) ──
const int PIN_R_HIP    = 34;
const int PIN_R_THIGH  = 35;
const int PIN_R_KNEE   = 36;
const int PIN_R_ANKLE  = 37;
const int PIN_R_FOOT   = 38;

Servo servos[36];
const int SERVO_PINS[36] = {
  PIN_HEAD_NECK, PIN_HEAD_EYE, PIN_HEAD_JAW, PIN_NECK_ROT, PIN_NECK_TILT, PIN_NECK_ROLL,
  PIN_L_SHOULDER, PIN_L_LIFT, PIN_L_ROTATE, PIN_L_ELBOW, PIN_L_WRIST,
  PIN_R_SHOULDER, PIN_R_LIFT, PIN_R_ROTATE, PIN_R_ELBOW, PIN_R_WRIST,
  PIN_L_THUMB, PIN_L_INDEX, PIN_L_MIDDLE, PIN_L_RING, PIN_L_PINKY,
  PIN_R_THUMB, PIN_R_INDEX, PIN_R_MIDDLE, PIN_R_RING, PIN_R_PINKY,
  PIN_L_HIP, PIN_L_THIGH, PIN_L_KNEE, PIN_L_ANKLE, PIN_L_FOOT,
  PIN_R_HIP, PIN_R_THIGH, PIN_R_KNEE, PIN_R_ANKLE, PIN_R_FOOT,
};

const int CENTER[36] = {
  85, 90, 8, 60, 50, 120,
  90, 45, 90, 90, 90,
  90, 45, 90, 90, 90,
  10, 10, 10, 10, 10,
  10, 10, 10, 10, 10,
  90, 90, 10, 90, 90,
  90, 90, 10, 90, 90,
};

int targets[36];
float current[36];

const float EASE = 0.08;
const float DEAD_ZONE = 0.3;
unsigned long lastUpdate = 0;
const unsigned long UPDATE_MS = 15;

inline int clamp180(int v, int hi = 180) {
  return constrain(v, 0, hi);
}

void setTargets(int start, int count, int vals[]) {
  for (int i = 0; i < count; i++) {
    targets[start + i] = clamp180(vals[i], (start + i == 28 || start + i == 33) ? 160 : 180);
  }
}

void centerAllNow() {
  for (int i = 0; i < 36; i++) {
    targets[i] = CENTER[i];
    current[i] = CENTER[i];
    servos[i].write(CENTER[i]);
  }
}

void parseFive(const char* args, int startIdx) {
  int v[5];
  if (sscanf(args, ",%d,%d,%d,%d,%d", &v[0], &v[1], &v[2], &v[3], &v[4]) == 5) {
    setTargets(startIdx, 5, v);
  }
}

void setup() {
  Serial.begin(9600);
  Serial.setTimeout(50);

  for (int i = 0; i < 36; i++) {
    servos[i].attach(SERVO_PINS[i], 600, 2400);
    targets[i] = CENTER[i];
    current[i] = CENTER[i];
    servos[i].write(CENTER[i]);
  }

  delay(500);
  Serial.println("ARDUINO_OK");
  Serial.println("NECK_READY");
  Serial.println("FULL_BODY_READY");
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    // LA/RA/LH/RH/LL/RL: second letter stays in buffer until readStringUntil
    String args = Serial.readStringUntil('\n');

    if (cmd == '?') {
      Serial.println("ARDUINO_OK");
      Serial.println("FULL_BODY_READY");
    } else if (cmd == 'H') {
      int n = 85, e = 90, j = 8;
      if (sscanf(args.c_str(), ",%d,%d,%d", &n, &e, &j) == 3) {
        int v[3] = { n, e, j };
        setTargets(0, 3, v);
      }
    } else if (cmd == 'N') {
      int r = targets[3], t = targets[4], ro = targets[5];
      if (sscanf(args.c_str(), ",%d,%d,%d", &r, &t, &ro) == 3) {
        int v[3] = { r, t, ro };
        setTargets(3, 3, v);
      }
    } else if (cmd == 'C') {
      int vals[6];
      if (sscanf(args.c_str(), ",%d,%d,%d,%d,%d,%d",
                 &vals[0], &vals[1], &vals[2], &vals[3], &vals[4], &vals[5]) == 6) {
        setTargets(0, 6, vals);
      }
    } else if (cmd == 'L' || cmd == 'R') {
      // Two-char commands: LA/RA/LH/RH/LL/RL — second char already in args[0]
      if (args.length() >= 2 && args.charAt(1) == ',') {
        char sub = args.charAt(0);
        const char* csv = args.c_str() + 1;
        if (cmd == 'L' && sub == 'A') parseFive(csv, 6);
        else if (cmd == 'R' && sub == 'A') parseFive(csv, 11);
        else if (cmd == 'L' && sub == 'H') parseFive(csv, 16);
        else if (cmd == 'R' && sub == 'H') parseFive(csv, 21);
        else if (cmd == 'L' && sub == 'L') parseFive(csv, 26);
        else if (cmd == 'R' && sub == 'L') parseFive(csv, 31);
      }
    } else if (cmd == 'S') {
      centerAllNow();
      Serial.println("STOPPED");
    }
  }

  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_MS) {
    lastUpdate = now;
    for (int i = 0; i < 36; i++) {
      float err = targets[i] - current[i];
      if (abs(err) > DEAD_ZONE) current[i] += err * EASE;
      servos[i].write(round(current[i]));
    }
  }
}