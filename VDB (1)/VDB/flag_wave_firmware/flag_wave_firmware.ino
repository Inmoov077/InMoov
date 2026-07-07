/*
 * ============================================================
 *  InMoov Upper Body — Movement Controller Firmware
 * ============================================================
 *  
 *  Hardware:
 *    - Arduino Mega 2560
 *    - 8x DS5160 60kg servos → Digital pins (configurable)
 *      Right arm: 23, 25, 27, 29  |  Left arm: 22, 24, 26, 28
 *    - PCA9685 16-ch PWM driver (I2C 0x40) → SCL/SDA
 *    - 12x MG996R servos → PCA9685 channels 0-11
 *      Right hand: ch 0-5  |  Left hand: ch 6-11
 *
 *  Serial: 115200 baud, newline-terminated commands
 *  
 *  SAFETY: All angles are hard-constrained. Motors CANNOT
 *  exceed their defined safe range, regardless of input.
 * ============================================================
 */

#include <Servo.h>
#include <Wire.h>
#include <Adafruit_PWMServoDriver.h>

// ===================== TOTAL SERVOS =====================
// Right arm: 0-3, Right hand: 4-9
// Left arm: 10-13, Left hand: 14-19
#define NUM_SERVOS 20

// ===================== DEFAULT PIN CONFIG =====================
// DS5160 pins (right arm odd, left arm even)
int pinShoulder_R  = 23;
int pinOmoplate_R  = 25;
int pinBicep_R     = 27;
int pinRotate_R    = 29;
int pinShoulder_L  = 22;
int pinOmoplate_L  = 24;
int pinBicep_L     = 26;
int pinRotate_L    = 28;

// PCA9685 channels
#define PCA_ADDR       0x40
int pcaCh[NUM_SERVOS] = {
  -1, -1, -1, -1,         // R arm (DS5160, not on PCA)
   0,  1,  2,  3,  4,  5, // R hand (PCA ch 0-5)
  -1, -1, -1, -1,         // L arm (DS5160, not on PCA)
   6,  7,  8,  9, 10, 11  // L hand (PCA ch 6-11)
};

// PCA9685 pulse range (12-bit, at 50Hz)
#define PCA_PULSE_MIN  102
#define PCA_PULSE_MAX  512
#define PCA_FREQ       50

// ===================== SAFE ANGLE LIMITS =====================
// {min, max, rest}
const int sLim[NUM_SERVOS][3] = {
  // Right arm
  {  0, 150, 30 },  // 0: R.Shoulder
  { 10,  70, 10 },  // 1: R.Omoplate
  {  0,  85,  5 },  // 2: R.Bicep
  { 40, 150, 90 },  // 3: R.Rotate
  // Right hand
  { 10, 180, 10 },  // 4: R.Thumb
  { 10, 180, 10 },  // 5: R.Index
  { 10, 180, 10 },  // 6: R.Middle
  { 10, 180, 10 },  // 7: R.Ring
  { 10, 180, 10 },  // 8: R.Pinky
  { 10, 160, 90 },  // 9: R.Wrist
  // Left arm
  {  0, 150, 30 },  // 10: L.Shoulder
  { 10,  70, 10 },  // 11: L.Omoplate
  {  0,  85,  5 },  // 12: L.Bicep
  { 40, 150, 90 },  // 13: L.Rotate
  // Left hand
  { 10, 180, 10 },  // 14: L.Thumb
  { 10, 180, 10 },  // 15: L.Index
  { 10, 180, 10 },  // 16: L.Middle
  { 10, 180, 10 },  // 17: L.Ring
  { 10, 180, 10 },  // 18: L.Pinky
  { 10, 160, 90 },  // 19: L.Wrist
};

const char* sName[NUM_SERVOS] = {
  "r_shoulder","r_omoplate","r_bicep","r_rotate",
  "r_thumb","r_index","r_middle","r_ring","r_pinky","r_wrist",
  "l_shoulder","l_omoplate","l_bicep","l_rotate",
  "l_thumb","l_index","l_middle","l_ring","l_pinky","l_wrist"
};

// ===================== OBJECTS =====================
Servo srvR[4]; // Right arm DS5160: shoulder, omoplate, bicep, rotate
Servo srvL[4]; // Left arm DS5160
Adafruit_PWMServoDriver pca = Adafruit_PWMServoDriver(PCA_ADDR);

// ===================== STATE =====================
int  curPos[NUM_SERVOS];
int  tgtPos[NUM_SERVOS];

// Body-part enable bitmask:
// bit 0 = R.Arm (servos 0-3)
// bit 1 = R.Hand (servos 4-9)
// bit 2 = L.Arm (servos 10-13)
// bit 3 = L.Hand (servos 14-19)
byte enableMask = 0x0F; // all enabled by default

// Wave animation
bool     waving       = false;
String   wavePat      = "gentle";
int      waveSpd      = 50;
int      waveAmp      = 50;
float    waveAngle    = 0.0;
unsigned long lastWaveMs = 0;

// Sequence state (for non-looping patterns like salute, gunshoot)
int      seqStep      = 0;
unsigned long seqStepMs = 0;

// Smooth movement
unsigned long lastMoveMs = 0;
const int MOVE_STEP_MS   = 15;

// Serial
String serialBuf = "";

// ===================== HELPER FUNCTIONS =====================

int safeAngle(int idx, int angle) {
  return constrain(angle, sLim[idx][0], sLim[idx][1]);
}

int angleToPulse(int angle) {
  return map(angle, 0, 180, PCA_PULSE_MIN, PCA_PULSE_MAX);
}

bool isPartEnabled(int idx) {
  if (idx < 4)  return (enableMask & 0x01); // R.Arm
  if (idx < 10) return (enableMask & 0x02); // R.Hand
  if (idx < 14) return (enableMask & 0x04); // L.Arm
  return (enableMask & 0x08);               // L.Hand
}

void writeServo(int idx, int angle) {
  angle = safeAngle(idx, angle);
  if (!isPartEnabled(idx)) return;
  
  if (idx < 4) {
    srvR[idx].write(angle);
  } else if (idx < 10) {
    pca.setPWM(pcaCh[idx], 0, angleToPulse(angle));
  } else if (idx < 14) {
    srvL[idx - 10].write(angle);
  } else {
    pca.setPWM(pcaCh[idx], 0, angleToPulse(angle));
  }
  curPos[idx] = angle;
}

void goHome() {
  for (int i = 0; i < NUM_SERVOS; i++) {
    tgtPos[i] = sLim[i][2];
  }
}

void goHomeImmediate() {
  for (int i = 0; i < NUM_SERVOS; i++) {
    tgtPos[i] = sLim[i][2];
    writeServo(i, sLim[i][2]);
  }
}

// Set target for both arms symmetrically
void setTargetMirror(int rIdx, int angle) {
  tgtPos[rIdx] = safeAngle(rIdx, angle);
  tgtPos[rIdx + 10] = safeAngle(rIdx + 10, angle);
}

void setTargetBoth(int rIdx, int rAngle, int lAngle) {
  tgtPos[rIdx] = safeAngle(rIdx, rAngle);
  tgtPos[rIdx + 10] = safeAngle(rIdx + 10, lAngle);
}

// ===================== SERIAL PROTOCOL =====================

int findServoIdx(String name) {
  name.trim();
  name.toLowerCase();
  for (int i = 0; i < NUM_SERVOS; i++) {
    if (name.equals(sName[i])) return i;
  }
  // Legacy names (backward compat)
  if (name == "shoulder")  return 0;
  if (name == "omoplate") return 1;
  if (name == "bicep")    return 2;
  if (name == "rotate")   return 3;
  if (name == "thumb")    return 4;
  if (name == "index")    return 5;
  if (name == "middle")   return 6;
  if (name == "ring")     return 7;
  if (name == "pinky")    return 8;
  if (name == "wrist")    return 9;
  return -1;
}

void sendStatus() {
  Serial.print("RSP:STATUS");
  for (int i = 0; i < NUM_SERVOS; i++) {
    Serial.print(":");
    Serial.print(sName[i]);
    Serial.print("=");
    Serial.print(curPos[i]);
  }
  Serial.print(":waving=");
  Serial.print(waving ? "1" : "0");
  Serial.print(":enable=");
  Serial.println(enableMask);
}

void processCmd(String cmd) {
  cmd.trim();
  if (cmd.length() == 0 || !cmd.startsWith("CMD:")) {
    Serial.println("RSP:ERR:Bad format");
    return;
  }
  cmd = cmd.substring(4);

  int c1 = cmd.indexOf(':');
  String action = (c1 == -1) ? cmd : cmd.substring(0, c1);
  String params = (c1 == -1) ? "" : cmd.substring(c1 + 1);
  action.toUpperCase();

  if (action == "MOVE") {
    int c = params.indexOf(':');
    if (c == -1) { Serial.println("RSP:ERR:MOVE needs name:angle"); return; }
    String nm = params.substring(0, c);
    int ang   = params.substring(c + 1).toInt();
    int idx   = findServoIdx(nm);
    if (idx == -1) { Serial.println("RSP:ERR:Unknown servo"); return; }
    ang = safeAngle(idx, ang);
    tgtPos[idx] = ang;
    Serial.print("RSP:OK:MOVE:");
    Serial.print(nm); Serial.print(":"); Serial.println(ang);

  } else if (action == "WAVE") {
    int c2 = params.indexOf(':');
    int c3 = params.indexOf(':', c2 + 1);
    if (c2 == -1 || c3 == -1) { Serial.println("RSP:ERR:WAVE needs pat:spd:amp"); return; }
    wavePat  = params.substring(0, c2);
    waveSpd  = constrain(params.substring(c2+1, c3).toInt(), 1, 100);
    waveAmp  = constrain(params.substring(c3+1).toInt(), 1, 100);
    wavePat.toLowerCase();
    preparePattern();
    waving    = true;
    waveAngle = 0;
    seqStep   = 0;
    seqStepMs = millis();
    lastWaveMs = millis();
    Serial.println("RSP:OK:WAVE:" + wavePat);

  } else if (action == "STOP") {
    waving = false;
    for (int i = 0; i < NUM_SERVOS; i++) tgtPos[i] = curPos[i];
    Serial.println("RSP:OK:STOP");

  } else if (action == "HOME") {
    waving = false;
    goHome();
    Serial.println("RSP:OK:HOME");

  } else if (action == "STATUS") {
    sendStatus();

  } else if (action == "GRIP") {
    int c = params.indexOf(':');
    int pct;
    int startIdx = 4;
    if (c != -1) {
      String side = params.substring(0, c);
      side.toLowerCase();
      pct = constrain(params.substring(c+1).toInt(), 0, 100);
      if (side == "left" || side == "l") {
        startIdx = 14;
      } else if (side == "both" || side == "b") {
        for (int i = 4; i <= 8; i++)
          tgtPos[i] = map(pct, 0, 100, sLim[i][0], sLim[i][1]);
        for (int i = 14; i <= 18; i++)
          tgtPos[i] = map(pct, 0, 100, sLim[i][0], sLim[i][1]);
        Serial.print("RSP:OK:GRIP:both:"); Serial.println(pct);
        return;
      }
    } else {
      pct = constrain(params.toInt(), 0, 100);
    }
    for (int i = startIdx; i <= startIdx + 4; i++) {
      tgtPos[i] = map(pct, 0, 100, sLim[i][0], sLim[i][1]);
    }
    Serial.print("RSP:OK:GRIP:"); Serial.println(pct);

  } else if (action == "ENABLE") {
    enableMask = (byte)constrain(params.toInt(), 0, 15);
    Serial.print("RSP:OK:ENABLE:"); Serial.println(enableMask);

  } else if (action == "SETPIN") {
    int c = params.indexOf(':');
    if (c == -1) { Serial.println("RSP:ERR:SETPIN needs name:pin"); return; }
    String nm  = params.substring(0, c);
    int newPin = params.substring(c + 1).toInt();
    int idx    = findServoIdx(nm);
    if (idx == -1) { Serial.println("RSP:ERR:Unknown servo"); return; }
    
    if (idx < 4) {
      srvR[idx].detach();
      switch(idx) {
        case 0: pinShoulder_R = newPin; break;
        case 1: pinOmoplate_R = newPin; break;
        case 2: pinBicep_R = newPin; break;
        case 3: pinRotate_R = newPin; break;
      }
      srvR[idx].attach(newPin);
      srvR[idx].write(curPos[idx]);
    } else if (idx >= 10 && idx < 14) {
      int li = idx - 10;
      srvL[li].detach();
      switch(li) {
        case 0: pinShoulder_L = newPin; break;
        case 1: pinOmoplate_L = newPin; break;
        case 2: pinBicep_L = newPin; break;
        case 3: pinRotate_L = newPin; break;
      }
      srvL[li].attach(newPin);
      srvL[li].write(curPos[idx]);
    } else {
      pcaCh[idx] = newPin;
    }
    Serial.print("RSP:OK:SETPIN:"); Serial.print(nm); Serial.print(":"); Serial.println(newPin);

  } else {
    Serial.println("RSP:ERR:Unknown action");
  }
}

// ===================== SMOOTH MOVEMENT =====================
void updateMovement() {
  for (int i = 0; i < NUM_SERVOS; i++) {
    if (!isPartEnabled(i)) continue;
    if (curPos[i] == tgtPos[i]) continue;
    int diff = tgtPos[i] - curPos[i];
    int step = (diff > 0) ? 1 : -1;
    if (abs(diff) > 20) step *= 3;
    else if (abs(diff) > 8) step *= 2;
    int np = curPos[i] + step;
    if ((step > 0 && np > tgtPos[i]) || (step < 0 && np < tgtPos[i])) np = tgtPos[i];
    writeServo(i, np);
  }
}

// ===================== PATTERN SETUP =====================
void preparePattern() {
  seqStep = 0;
  seqStepMs = millis();
  
  if (wavePat == "gentle" || wavePat == "vigorous" ||
      wavePat == "sideway" || wavePat == "figure8" ||
      wavePat == "pride") {
    // Flag-holding patterns: grip flag with right hand
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = map(80, 0, 100, sLim[i][0], sLim[i][1]);
    tgtPos[0] = safeAngle(0, 80);
    tgtPos[1] = safeAngle(1, 30);
    tgtPos[2] = safeAngle(2, 60);
    tgtPos[3] = safeAngle(3, 90);
    tgtPos[9] = safeAngle(9, 90);
  }
  else if (wavePat == "greeting") {
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = sLim[i][0];
    tgtPos[0] = safeAngle(0, 100);
    tgtPos[1] = safeAngle(1, 35);
    tgtPos[2] = safeAngle(2, 40);
    tgtPos[3] = safeAngle(3, 90);
    tgtPos[9] = safeAngle(9, 90);
  }
  else if (wavePat == "salute") {
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = sLim[i][1];
    tgtPos[0] = safeAngle(0, 140);
    tgtPos[1] = safeAngle(1, 10);
    tgtPos[2] = safeAngle(2, 80);
    tgtPos[3] = safeAngle(3, 90);
    tgtPos[9] = safeAngle(9, 90);
  }
  else if (wavePat == "celebrate") {
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = map(80, 0, 100, sLim[i][0], sLim[i][1]);
    for (int i = 14; i <= 18; i++)
      tgtPos[i] = sLim[i][1];
    setTargetMirror(0, 90);
    setTargetMirror(1, 25);
    setTargetMirror(2, 50);
    setTargetMirror(3, 90);
    tgtPos[9]  = safeAngle(9, 90);
    tgtPos[19] = safeAngle(19, 90);
  }
  else if (wavePat == "drstrange") {
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = sLim[i][0];
    for (int i = 14; i <= 18; i++)
      tgtPos[i] = sLim[i][0];
    setTargetMirror(0, 80);
    setTargetMirror(1, 40);
    setTargetMirror(2, 50);
    setTargetMirror(3, 90);
  }
  else if (wavePat == "gunshoot") {
    tgtPos[4] = sLim[4][0];
    tgtPos[5] = sLim[5][0];
    tgtPos[6] = sLim[6][0];
    tgtPos[7] = sLim[7][1];
    tgtPos[8] = sLim[8][1];
    tgtPos[9] = safeAngle(9, 90);
    tgtPos[14] = sLim[14][0];
    tgtPos[15] = sLim[15][0];
    tgtPos[16] = sLim[16][0];
    tgtPos[17] = sLim[17][1];
    tgtPos[18] = sLim[18][1];
    tgtPos[19] = safeAngle(19, 90);
    setTargetMirror(0, 70);
    setTargetMirror(1, 45);
    setTargetMirror(2, 30);
    setTargetMirror(3, 90);
  }
}

// ===================== WAVE UPDATE =====================
void updateWave() {
  unsigned long now = millis();
  int interval = map(waveSpd, 1, 100, 80, 12);
  if (now - lastWaveMs < (unsigned long)interval) return;
  lastWaveMs = now;

  float spd = map(waveSpd, 1, 100, 3, 18) / 100.0;
  waveAngle += spd;
  if (waveAngle > 6.2832) waveAngle -= 6.2832;

  float a = waveAmp / 100.0;

  if      (wavePat == "gentle")    patGentle(a);
  else if (wavePat == "vigorous")  patVigorous(a);
  else if (wavePat == "sideway")   patSideway(a);
  else if (wavePat == "figure8")   patFigure8(a);
  else if (wavePat == "greeting")  patGreeting(a);
  else if (wavePat == "salute")    patSalute(a);
  else if (wavePat == "pride")     patPride(a);
  else if (wavePat == "celebrate") patCelebrate(a);
  else if (wavePat == "drstrange") patDrStrange(a);
  else if (wavePat == "gunshoot")  patGunShoot(a);
  else                             patGentle(a);
}

// ===================== PATTERN IMPLEMENTATIONS =====================

void patGentle(float a) {
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(waveAngle) * 25.0 * a));
  tgtPos[1] = safeAngle(1, 30 + (int)(sin(waveAngle * 0.5) * 12.0 * a));
  tgtPos[2] = safeAngle(2, 60 + (int)(sin(waveAngle * 0.7) * 15.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(cos(waveAngle * 0.6) * 12.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(waveAngle * 1.5) * 30.0 * a));
}

void patVigorous(float a) {
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(waveAngle) * 35.0 * a));
  tgtPos[1] = safeAngle(1, 30 + (int)(sin(waveAngle * 0.6) * 15.0 * a));
  tgtPos[2] = safeAngle(2, 60 + (int)(sin(waveAngle * 0.8) * 20.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(cos(waveAngle * 0.7) * 20.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(waveAngle * 1.3) * 45.0 * a));
}

void patSideway(float a) {
  float slow = waveAngle * 0.4;
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(slow) * 30.0 * a));
  tgtPos[1] = safeAngle(1, 30 + (int)(cos(slow) * 18.0 * a));
  tgtPos[2] = safeAngle(2, 60 + (int)(sin(slow + 0.5) * 15.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(sin(slow + 0.78) * 25.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(slow) * 25.0 * a));
}

void patFigure8(float a) {
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(waveAngle * 2.0) * 20.0 * a));
  tgtPos[1] = safeAngle(1, 30 + (int)(cos(waveAngle) * 15.0 * a));
  tgtPos[2] = safeAngle(2, 60 + (int)(sin(waveAngle) * 18.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(cos(waveAngle) * 18.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(waveAngle) * 40.0 * a));
}

void patGreeting(float a) {
  tgtPos[0] = safeAngle(0, 110 + (int)(sin(waveAngle * 0.5) * 15.0 * a));
  tgtPos[1] = safeAngle(1, 35 + (int)(sin(waveAngle * 0.3) * 8.0 * a));
  tgtPos[2] = safeAngle(2, 45 + (int)(sin(waveAngle * 0.4) * 10.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(sin(waveAngle * 0.5) * 10.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(waveAngle * 1.8) * 40.0 * a));
  for (int i = 4; i <= 8; i++)
    tgtPos[i] = sLim[i][0];
}

void patSalute(float a) {
  unsigned long elapsed = millis() - seqStepMs;
  
  if (seqStep == 0) {
    tgtPos[0] = safeAngle(0, 140);
    tgtPos[1] = safeAngle(1, 10);
    tgtPos[2] = safeAngle(2, 80);
    tgtPos[3] = safeAngle(3, 90);
    tgtPos[9] = safeAngle(9, 90);
    for (int i = 4; i <= 8; i++)
      tgtPos[i] = sLim[i][1];
    if (elapsed > 2000) { seqStep = 1; seqStepMs = millis(); }
  }
  else if (seqStep == 1) {
    tgtPos[0] = safeAngle(0, 140 + (int)(sin(waveAngle * 0.3) * 3.0 * a));
    tgtPos[2] = safeAngle(2, 80 + (int)(sin(waveAngle * 0.3) * 2.0 * a));
    if (elapsed > 3000) { seqStep = 2; seqStepMs = millis(); }
  }
  else {
    goHome();
    if (elapsed > 2500) { seqStep = 0; seqStepMs = millis(); preparePattern(); }
  }
}

void patPride(float a) {
  float slow = waveAngle * 0.3;
  tgtPos[0] = safeAngle(0, 120 + (int)(sin(slow) * 20.0 * a));
  tgtPos[1] = safeAngle(1, 30 + (int)(sin(slow * 0.7) * 12.0 * a));
  tgtPos[2] = safeAngle(2, 55 + (int)(cos(slow) * 10.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(sin(slow + 1.0) * 20.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(slow * 0.5) * 15.0 * a));
}

void patCelebrate(float a) {
  float fast = waveAngle * 1.5;
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(fast) * 35.0 * a));
  tgtPos[2] = safeAngle(2, 50 + (int)(cos(fast) * 25.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(sin(fast * 0.5) * 15.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(fast * 1.2) * 30.0 * a));
  
  tgtPos[10] = safeAngle(10, 80 + (int)(sin(fast + 3.14) * 35.0 * a));
  tgtPos[12] = safeAngle(12, 50 + (int)(cos(fast + 3.14) * 25.0 * a));
  tgtPos[13] = safeAngle(13, 90 + (int)(sin(fast * 0.5 + 3.14) * 15.0 * a));
  tgtPos[19] = safeAngle(19, 90 + (int)(sin(fast * 1.2 + 3.14) * 30.0 * a));
  
  for (int i = 14; i <= 18; i++)
    tgtPos[i] = sLim[i][1];
}

void patDrStrange(float a) {
  float phase = waveAngle;
  
  tgtPos[0] = safeAngle(0, 80 + (int)(sin(phase) * 30.0 * a));
  tgtPos[1] = safeAngle(1, 40 + (int)(cos(phase) * 15.0 * a));
  tgtPos[2] = safeAngle(2, 50 + (int)(cos(phase) * 20.0 * a));
  tgtPos[3] = safeAngle(3, 90 + (int)(sin(phase) * 20.0 * a));
  tgtPos[9] = safeAngle(9, 90 + (int)(sin(phase * 2.5) * 50.0 * a));
  
  tgtPos[10] = safeAngle(10, 80 + (int)(sin(-phase) * 30.0 * a));
  tgtPos[11] = safeAngle(11, 40 + (int)(cos(-phase) * 15.0 * a));
  tgtPos[12] = safeAngle(12, 50 + (int)(cos(-phase) * 20.0 * a));
  tgtPos[13] = safeAngle(13, 90 + (int)(sin(-phase) * 20.0 * a));
  tgtPos[19] = safeAngle(19, 90 + (int)(sin(-phase * 2.5) * 50.0 * a));
  
  for (int i = 4; i <= 8; i++) tgtPos[i] = sLim[i][0];
  for (int i = 14; i <= 18; i++) tgtPos[i] = sLim[i][0];
}

void patGunShoot(float a) {
  unsigned long elapsed = millis() - seqStepMs;
  
  // Maintain gun finger pose throughout
  tgtPos[4] = sLim[4][0];   tgtPos[5] = sLim[5][0];
  tgtPos[6] = sLim[6][0];   tgtPos[7] = sLim[7][1];
  tgtPos[8] = sLim[8][1];
  tgtPos[14] = sLim[14][0]; tgtPos[15] = sLim[15][0];
  tgtPos[16] = sLim[16][0]; tgtPos[17] = sLim[17][1];
  tgtPos[18] = sLim[18][1];
  
  if (seqStep == 0) {
    // Aim forward
    setTargetMirror(0, 70);
    setTargetMirror(1, 45);
    setTargetMirror(2, 20);
    setTargetMirror(3, 90);
    tgtPos[9]  = safeAngle(9, 90);
    tgtPos[19] = safeAngle(19, 90);
    if (elapsed > 1200) { seqStep = 1; seqStepMs = millis(); }
  }
  else if (seqStep == 1) {
    // Hold aim with subtle tension
    float t = sin(waveAngle * 0.5) * 3.0 * a;
    setTargetBoth(0, 70 + (int)t, 70 + (int)t);
    setTargetBoth(2, 20 + (int)(t * 0.5), 20 + (int)(t * 0.5));
    if (elapsed > 800) { seqStep = 2; seqStepMs = millis(); }
  }
  else if (seqStep == 2) {
    // SHOOT! Recoil
    setTargetMirror(2, 70);
    setTargetMirror(0, 85);
    tgtPos[9]  = safeAngle(9, 130);
    tgtPos[19] = safeAngle(19, 130);
    if (elapsed > 400) { seqStep = 3; seqStepMs = millis(); }
  }
  else {
    // Return to aim
    setTargetMirror(0, 70);
    setTargetMirror(2, 20);
    tgtPos[9]  = safeAngle(9, 90);
    tgtPos[19] = safeAngle(19, 90);
    if (elapsed > 1000) { seqStep = 0; seqStepMs = millis(); }
  }
}

// ===================== SETUP & LOOP =====================
void setup() {
  Serial.begin(115200);
  while (!Serial) { ; }

  // Right arm DS5160 servos
  srvR[0].attach(pinShoulder_R);
  srvR[1].attach(pinOmoplate_R);
  srvR[2].attach(pinBicep_R);
  srvR[3].attach(pinRotate_R);

  // Left arm DS5160 servos
  srvL[0].attach(pinShoulder_L);
  srvL[1].attach(pinOmoplate_L);
  srvL[2].attach(pinBicep_L);
  srvL[3].attach(pinRotate_L);

  // PCA9685
  pca.begin();
  pca.setPWMFreq(PCA_FREQ);
  delay(10);

  // Initialize all servos to rest positions
  for (int i = 0; i < NUM_SERVOS; i++) {
    curPos[i] = sLim[i][2];
    tgtPos[i] = sLim[i][2];
    writeServo(i, sLim[i][2]);
    delay(30);
  }

  delay(400);
  Serial.println("RSP:READY:InMoov Upper Body Controller v2.0");
}

void loop() {
  // Serial input
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (serialBuf.length() > 0) {
        processCmd(serialBuf);
        serialBuf = "";
      }
    } else {
      serialBuf += c;
    }
  }

  // Smooth servo stepping
  unsigned long now = millis();
  if (now - lastMoveMs >= MOVE_STEP_MS) {
    lastMoveMs = now;
    updateMovement();
  }

  // Wave animation
  if (waving) updateWave();
}
