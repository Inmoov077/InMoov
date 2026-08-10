# Walkthrough - Joint Limits & Arm Inversions Update

We have updated the joint limits and implemented the new joint inversion logic across the InMoov system.

## Changes Accomplished

### 1. Joint Limit Configurations Updated
The min/max safety limits for the left and right arms were adjusted:
* **Left Rotate:** `40` to `180`
* **Left Bicep (Elbow):** `0` to `80`
* **Left Shoulder:** `30` to `180`
* **Left Omoplate (Lift):** `10` to `60`
* **Right Rotate:** `40` to `180`
* **Right Bicep (Elbow):** `0` to `90`
* **Right Shoulder:** `30` to `180`
* **Right Omoplate (Lift):** `10` to `65`

These limits were updated in the source configurations:
* [extract_mrl_inmoov.py](file:///d:/Inmoove/Head/scripts/extract_mrl_inmoov.py#L423-L433)
* [server.py](file:///d:/Inmoove/Head/VDB%20(1)/VDB/server.py#L36-L54)
* [flag_wave_firmware.ino](file:///d:/Inmoove/Head/VDB%20(1)/VDB/flag_wave_firmware/flag_wave_firmware.ino#L57-L82)

### 2. Arm Inversion Logic Implemented
Joint angle inversions were added to:
* [app.py](file:///d:/Inmoove/Head/app.py): Applied to `set_servo_arm`, `set_servo_body` (batch update), and `_enable_all_motors` (rest pose initialization).
* [runtime.py](file:///d:/Inmoove/Head/inmoove_core/runtime.py): Applied to `arm_cmd` (keyframe animation) and `pack` (individual slider/command sending).

**Inversion Mapping Formula:** `output_angle = min_limit + max_limit - input_angle`.
* This formula ensures that when the input angle scales from `min` to `max`, the output scales from `max` to `min` safely without any out-of-bounds clipping.
* All arm joints are inverted except the **Right Omoplate (Right Lift)**, which remains non-inverted.

### 3. Regeneration & Frontend Build
* Ran the configuration extraction script to update `servo_config.json`, `servo_config.h`, and `servoConfig.ts`.
* Rebuilt the React frontend using `npm run build` in the `frontend` directory.

---

## Verification & Tests

We ran a Python test script [verify_limits_inversions.py](file:///C:/Users/Kapil%20Ranpariya/.gemini/antigravity-ide/brain/22209b69-31a4-46fb-8983-cb6e57a012c1/scratch/verify_limits_inversions.py) to test the joint range clamps and output values from both `app.py` and `inmoove_core/runtime.py`.

### Test Results
```
Starting verification tests...
[LEFT shoulder] Input: 30 -> Result: 180 | Expected: 180 PASSED
[LEFT shoulder] Input: 180 -> Result: 30 | Expected: 30 PASSED
[LEFT shoulder] Input: 90 -> Result: 120 | Expected: 120 PASSED
[LEFT shoulder] Input: 0 -> Result: 180 | Expected: 180 PASSED
[LEFT shoulder] Input: 200 -> Result: 30 | Expected: 30 PASSED
[LEFT lift] Input: 10 -> Result: 60 | Expected: 60 PASSED
[LEFT lift] Input: 60 -> Result: 10 | Expected: 10 PASSED
[LEFT lift] Input: 30 -> Result: 40 | Expected: 40 PASSED
[LEFT elbow] Input: 0 -> Result: 80 | Expected: 80 PASSED
[LEFT elbow] Input: 80 -> Result: 0 | Expected: 0 PASSED
[LEFT elbow] Input: 40 -> Result: 40 | Expected: 40 PASSED
[RIGHT shoulder] Input: 30 -> Result: 180 | Expected: 180 PASSED
[RIGHT shoulder] Input: 180 -> Result: 30 | Expected: 30 PASSED
[RIGHT lift] Input: 10 -> Result: 10 | Expected: 10 PASSED
[RIGHT lift] Input: 65 -> Result: 65 | Expected: 65 PASSED
[RIGHT lift] Input: 30 -> Result: 30 | Expected: 30 PASSED
[RIGHT lift] Input: 0 -> Result: 10 | Expected: 10 PASSED
[RIGHT lift] Input: 100 -> Result: 65 | Expected: 65 PASSED
[RIGHT elbow] Input: 0 -> Result: 90 | Expected: 90 PASSED
[RIGHT elbow] Input: 90 -> Result: 0 | Expected: 0 PASSED
[CORE l_shoulder] Input: 30 -> Result: 180 | Expected: 180 PASSED
[CORE r_lift] Input: 30 -> Result: 30 | Expected: 30 PASSED
All verification tests passed successfully!
```
