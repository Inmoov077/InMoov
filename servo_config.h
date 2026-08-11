// Auto-generated from shared/servo_config.json by scripts/generate_servo_config_h.py
// Do not edit by hand — re-run the script after changing servo_config.json
#pragma once

#define SERVO_COUNT 36
#define FIRMWARE_VERSION "1.2.1"

// Index map:
//  0-2 head, 3-5 neck, 6-10 L arm, 11-15 R arm,
//  16-20 L hand, 21-25 R hand, 26-30 L leg, 31-35 R leg
// 0:head_neck, 1:head_eye, 2:head_jaw, 3:neck_rot, 4:neck_tilt, 5:neck_roll, 6:l_shoulder, 7:l_lift, 8:l_rotate, 9:l_elbow, 10:l_wrist, 11:r_shoulder, 12:r_lift, 13:r_rotate, 14:r_elbow, 15:r_wrist, 16:l_thumb, 17:l_index, 18:l_middle, 19:l_ring, 20:l_pinky, 21:r_thumb, 22:r_index, 23:r_middle, 24:r_ring, 25:r_pinky, 26:l_hip, 27:l_thigh, 28:l_knee, 29:l_ankle, 30:l_foot, 31:r_hip, 32:r_thigh, 33:r_knee, 34:r_ankle, 35:r_foot

const uint8_t SERVO_PINS[SERVO_COUNT] PROGMEM = {3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38};
const uint8_t SERVO_MIN[SERVO_COUNT] PROGMEM = {0, 60, 0, 0, 0, 60, 30, 15, 40, 0, 10, 30, 10, 40, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
const uint8_t SERVO_MAX[SERVO_COUNT] PROGMEM = {180, 120, 40, 180, 180, 130, 180, 65, 180, 52, 160, 180, 70, 180, 80, 160, 130, 130, 130, 130, 130, 130, 130, 130, 130, 130, 180, 180, 160, 180, 180, 180, 180, 160, 180, 180};
const uint8_t SERVO_REST[SERVO_COUNT] PROGMEM = {85, 90, 8, 60, 50, 120, 30, 15, 90, 0, 90, 30, 10, 90, 10, 90, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 90, 90, 10, 90, 90, 90, 90, 10, 90, 90};
const uint8_t SERVO_EASE[SERVO_COUNT] PROGMEM = {17, 17, 46, 17, 17, 17, 11, 11, 11, 11, 18, 11, 11, 11, 11, 18, 36, 36, 36, 36, 36, 36, 36, 36, 36, 36, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13};
const uint8_t SERVO_INVERT[SERVO_COUNT] PROGMEM = {0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};

#define PATTERN_COUNT 6

struct PatternStep {
  int8_t vals[6];  // head_neck, eye, jaw, rot, tilt, roll (-1 = skip)
  uint16_t holdMs;
};

struct PatternDef {
  const char* name;
  const PatternStep* steps;
  uint8_t stepCount;
};

const PatternStep PATTERN_NOD_STEPS[] PROGMEM = {
  {{85, 90, 8, 60, 80, 120}, 600},
  {{85, 90, 8, 60, 20, 120}, 600},
  {{85, 90, 8, 60, 50, 120}, 400},
};

const PatternStep PATTERN_SHAKE_STEPS[] PROGMEM = {
  {{85, 60, 8, 10, 50, 170}, 600},
  {{85, 120, 8, 110, 50, 70}, 600},
  {{85, 90, 8, 60, 50, 120}, 400},
};

const PatternStep PATTERN_YES_STEPS[] PROGMEM = {
  {{85, 90, 8, 60, 35, 120}, 400},
  {{85, 90, 8, 60, 70, 120}, 400},
  {{85, 90, 8, 60, 35, 120}, 400},
  {{85, 90, 8, 60, 50, 120}, 300},
};

const PatternStep PATTERN_NO_STEPS[] PROGMEM = {
  {{85, 60, 8, 25, 50, 150}, 400},
  {{85, 120, 8, 95, 50, 90}, 400},
  {{85, 60, 8, 25, 50, 150}, 400},
  {{85, 90, 8, 60, 50, 120}, 300},
};

const PatternStep PATTERN_BOW_STEPS[] PROGMEM = {
  {{85, 90, 8, 60, 50, 120}, 500},
  {{85, 90, 10, 60, 15, 120}, 1200},
  {{85, 90, 8, 60, 50, 120}, 500},
};

const PatternStep PATTERN_RELAX_STEPS[] PROGMEM = {
  {{85, 90, 8, 60, 50, 120}, 300},
};

const PatternDef PATTERNS[PATTERN_COUNT] PROGMEM = {
  {"nod", PATTERN_NOD_STEPS, 3},
  {"shake", PATTERN_SHAKE_STEPS, 3},
  {"yes", PATTERN_YES_STEPS, 4},
  {"no", PATTERN_NO_STEPS, 4},
  {"bow", PATTERN_BOW_STEPS, 3},
  {"relax", PATTERN_RELAX_STEPS, 1},
};
