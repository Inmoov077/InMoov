// ============================================================
// InMoov — COMBINED Servo Controller (6 Servos, Both Dashboards)
// ============================================================
//
// Works with the InMoov Control Center dashboard (dashboard.html)
//   Head: Neck-rot, Eye, Jaw  +  Neck 3-axis: Rotation, Tilt, Roll
//
// ── PIN ASSIGNMENTS ──────────────────────────────────────────
//   Pin 3  → HEAD Neck rotation/tilt    (H command)
//   Pin 4  → HEAD Eye horizontal        (H command)
//   Pin 5  → HEAD Jaw open/close        (H command)
//   Pin 6  → NECK Rotation (pan L/R)    (N command)
//   Pin 7  → NECK Tilt (nod up/down)    (N command)
//   Pin 8  → NECK Roll (side-to-side)   (N command)
//
// ── SERIAL PROTOCOL (9600 baud) ──────────────────────────────
//   '?'                              → Handshake reply: "ARDUINO_OK"
//   'H,<neck>,<eye>,<jaw>\n'         → Set head servos (0–180°)
//   'N,<rot>,<tilt>,<roll>\n'        → Set neck servos (safe limits)
//   'S'                              → Emergency stop — center all 6
//   'R'                              → Read all current positions
//
// ── SAFE ANGLE LIMITS ────────────────────────────────────────
//   Head Neck : 0°  – 180° (full range)
//   Eye       : 0°  – 180° (full range)
//   Jaw       : 0°  – 180° (full range)
//   Neck Rot  : 30° – 150° (InMoov recommended)
//   Neck Tilt : 55° – 130° (InMoov recommended)
//   Neck Roll : 60° – 120° (InMoov recommended)
//
// ── EASING ───────────────────────────────────────────────────
//   Exponential smoothing on all axes for smooth, jerk-free motion.
//   Update loop runs at ~66 Hz (every 15 ms).
// ============================================================

#include <Servo.h>

// ── HEAD SERVO PINS ──
const int PIN_HEAD_NECK = 3;
const int PIN_HEAD_EYE  = 4;
const int PIN_HEAD_JAW  = 5;

// ── NECK SERVO PINS ──
const int PIN_NECK_ROT  = 6;
const int PIN_NECK_TILT = 7;
const int PIN_NECK_ROLL = 8;

// ── SERVO OBJECTS ──
Servo headNeckServo;
Servo headEyeServo;
Servo headJawServo;
Servo neckRotServo;
Servo neckTiltServo;
Servo neckRollServo;

// ── SAFE LIMITS (neck 3-axis only; head is full 0-180) ──
const int NECK_ROT_MIN  = 0,   NECK_ROT_MAX  = 180;
const int NECK_TILT_MIN = 0,   NECK_TILT_MAX = 180;
const int NECK_ROLL_MIN = 0,   NECK_ROLL_MAX = 180;

// ── TARGET POSITIONS ──
int targetHeadNeck = 85;
int targetHeadEye  = 90;
int targetHeadJaw  = 8;
int targetNeckRot  = 60;
int targetNeckTilt = 50;
int targetNeckRoll = 120;

// ── SMOOTHED (INTERPOLATED) POSITIONS ──
float curHeadNeck = 85.0;
float curHeadEye  = 90.0;
float curHeadJaw  = 8.0;
float curNeckRot  = 60.0;
float curNeckTilt = 50.0;
float curNeckRoll = 120.0;

// ── EASING FACTORS ──
// Lower  = smoother & slower movement
// Higher = snappier & faster movement
const float EASE_HEAD_NECK = 0.08;   // Neck-tilt: slow & smooth (heavy head)
const float EASE_HEAD_EYE  = 0.07;   // Eye: smooth gaze
const float EASE_HEAD_JAW  = 0.22;   // Jaw: responsive for speech sync
const float EASE_NECK_ROT  = 0.06;   // 3-axis rotation: controlled pan   
const float EASE_NECK_TILT = 0.05;   // 3-axis tilt: slowest (fights gravity)
const float EASE_NECK_ROLL = 0.07;   // 3-axis roll: medium side tilt

// ── DEAD ZONE: skip servo write if within this distance of target ──
const float DEAD_ZONE = 0.3;

// ── TIMING ──
unsigned long lastUpdate  = 0;
unsigned long lastFeedback = 0;
const unsigned long UPDATE_INTERVAL_MS   = 15;   // ~66 Hz servo update
const unsigned long FEEDBACK_INTERVAL_MS = 500;  // position broadcast

// ============================================================
void setup() {
  Serial.begin(9600);
  // !! CRITICAL: reduce timeout from default 1000ms to 50ms.
  // Without this, Serial.parseInt() blocks for 1 second waiting for
  // the 3rd value when commands arrive rapidly, causing the roll servo
  // to receive 0 (timeout return) and appear 'dead'.
  Serial.setTimeout(50);

  // Attach head servos (full 0-180 range)
  headNeckServo.attach(PIN_HEAD_NECK);
  headEyeServo.attach(PIN_HEAD_EYE);
  headJawServo.attach(PIN_HEAD_JAW);

  // Attach neck servos with µs safety limits (600=~0°, 2400=~180°)
  neckRotServo.attach(PIN_NECK_ROT,   600, 2400);
  neckTiltServo.attach(PIN_NECK_TILT, 600, 2400);
  neckRollServo.attach(PIN_NECK_ROLL, 600, 2400);

  // Move all to safe center positions
  headNeckServo.write(85);
  headEyeServo.write(90);
  headJawServo.write(8);
  neckRotServo.write(60);
  neckTiltServo.write(constrain(50, NECK_TILT_MIN, NECK_TILT_MAX));
  neckRollServo.write(120);

  delay(500);

  // Signal ready — accepted by ALL versions of the dashboard auto-detect
  Serial.println("ARDUINO_OK");
  Serial.println("NECK_READY");
}

// ============================================================
// Clamp helper
inline int safeClamp(int val, int lo, int hi) {
  return constrain(val, lo, hi);
}

// Center all servos immediately (no easing)
void centerAllNow() {
  targetHeadNeck = 85; curHeadNeck = 85; headNeckServo.write(85);
  targetHeadEye  = 90; curHeadEye  = 90; headEyeServo.write(90);
  targetHeadJaw  = 8;  curHeadJaw  = 8;  headJawServo.write(8);
  targetNeckRot  = 60; curNeckRot  = 60; neckRotServo.write(60);
  targetNeckTilt = 50; curNeckTilt = 50; neckTiltServo.write(safeClamp(50, NECK_TILT_MIN, NECK_TILT_MAX));
  targetNeckRoll = 120; curNeckRoll = 120; neckRollServo.write(120);
}

// ============================================================
void loop() {

  // ── 1. Parse Serial Commands ──────────────────────────────
  if (Serial.available() > 0) {
    char cmd = Serial.read();

    if (cmd == '?') {
      // Handshake — works with both dashboard auto-detects
      Serial.println("ARDUINO_OK");
      Serial.println("NECK_READY");

    } else if (cmd == 'H') {
      // Head command: H,<neck>,<eye>,<jaw>
      // Use readStringUntil+sscanf: atomic parse of all 3 values at once.
      // This prevents Serial.parseInt() timeout from zeroing the 3rd servo.
      String args = Serial.readStringUntil('\n');  // reads ",90,90,90"
      int n = 85, e = 90, j = 8;
      if (sscanf(args.c_str(), ",%d,%d,%d", &n, &e, &j) == 3) {
        if (n >= 0 && n <= 180) targetHeadNeck = n;
        if (e >= 0 && e <= 180) targetHeadEye  = e;
        if (j >= 0 && j <= 180) targetHeadJaw  = j;
      }

    } else if (cmd == 'N') {
      // Neck 3-axis: N,<rot>,<tilt>,<roll>
      // All 3 values parsed atomically — if any are missing, targets unchanged.
      String args = Serial.readStringUntil('\n');  // reads ",90,90,90"
      int r = targetNeckRot, t = targetNeckTilt, ro = targetNeckRoll;
      if (sscanf(args.c_str(), ",%d,%d,%d", &r, &t, &ro) == 3) {
        targetNeckRot  = safeClamp(r,  NECK_ROT_MIN,  NECK_ROT_MAX);
        targetNeckTilt = safeClamp(t,  NECK_TILT_MIN, NECK_TILT_MAX);
        targetNeckRoll = safeClamp(ro, NECK_ROLL_MIN, NECK_ROLL_MAX);
      }

    } else if (cmd == 'C') {
      // Combined 6-axis: C,<hn>,<he>,<hj>,<nr>,<nt>,<nro>
      String args = Serial.readStringUntil('\n');
      int hn = 85, he = 90, hj = 8, nr = targetNeckRot, nt = targetNeckTilt, nro = targetNeckRoll;
      if (sscanf(args.c_str(), ",%d,%d,%d,%d,%d,%d", &hn, &he, &hj, &nr, &nt, &nro) == 6) {
        if (hn >= 0 && hn <= 180) targetHeadNeck = hn;
        if (he >= 0 && he <= 180) targetHeadEye  = he;
        if (hj >= 0 && hj <= 180) targetHeadJaw  = hj;
        targetNeckRot  = safeClamp(nr,  NECK_ROT_MIN,  NECK_ROT_MAX);
        targetNeckTilt = safeClamp(nt,  NECK_TILT_MIN, NECK_TILT_MAX);
        targetNeckRoll = safeClamp(nro, NECK_ROLL_MIN, NECK_ROLL_MAX);
      }

    } else if (cmd == 'S') {
      // Emergency stop — center everything instantly
      centerAllNow();
      Serial.println("STOPPED");

    } else if (cmd == 'R') {
      // Report all current positions
      Serial.print("HEAD:");
      Serial.print((int)round(curHeadNeck)); Serial.print(",");
      Serial.print((int)round(curHeadEye));  Serial.print(",");
      Serial.println((int)round(curHeadJaw));
      Serial.print("NECK:");
      Serial.print((int)round(curNeckRot));  Serial.print(",");
      Serial.print((int)round(curNeckTilt)); Serial.print(",");
      Serial.println((int)round(curNeckRoll));
    }
  }

  // ── 2. Smooth Interpolation @ 66 Hz ───────────────────────
  unsigned long now = millis();
  if (now - lastUpdate >= UPDATE_INTERVAL_MS) {
    lastUpdate = now;

    // Head servos
    float errHN = targetHeadNeck - curHeadNeck;
    float errHE = targetHeadEye  - curHeadEye;
    float errHJ = targetHeadJaw  - curHeadJaw;
    if (abs(errHN) > DEAD_ZONE) curHeadNeck += errHN * EASE_HEAD_NECK;
    if (abs(errHE) > DEAD_ZONE) curHeadEye  += errHE * EASE_HEAD_EYE;
    if (abs(errHJ) > DEAD_ZONE) curHeadJaw  += errHJ * EASE_HEAD_JAW;

    headNeckServo.write(round(curHeadNeck));
    headEyeServo.write(round(curHeadEye));
    headJawServo.write(round(curHeadJaw));

    // Neck 3-axis servos
    float errNR  = targetNeckRot  - curNeckRot;
    float errNT  = targetNeckTilt - curNeckTilt;
    float errNRo = targetNeckRoll - curNeckRoll;
    if (abs(errNR)  > DEAD_ZONE) curNeckRot  += errNR  * EASE_NECK_ROT;
    if (abs(errNT)  > DEAD_ZONE) curNeckTilt += errNT  * EASE_NECK_TILT;
    if (abs(errNRo) > DEAD_ZONE) curNeckRoll += errNRo * EASE_NECK_ROLL;

    neckRotServo.write(round(curNeckRot));
    neckTiltServo.write(round(curNeckTilt));
    neckRollServo.write(round(curNeckRoll));
  }

  // ── 3. Periodic Position Broadcast (every 500ms) ──────────
  if (now - lastFeedback >= FEEDBACK_INTERVAL_MS) {
    lastFeedback = now;
    Serial.print("POS,");
    Serial.print((int)round(curHeadNeck)); Serial.print(",");
    Serial.print((int)round(curHeadEye));  Serial.print(",");
    Serial.print((int)round(curHeadJaw));  Serial.print(",");
    Serial.print((int)round(curNeckRot));  Serial.print(",");
    Serial.print((int)round(curNeckTilt)); Serial.print(",");
    Serial.println((int)round(curNeckRoll));
  }
}
