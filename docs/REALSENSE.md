# Intel RealSense D455 — Presence Wake

## Hardware

- Camera: Intel RealSense D455
- Mount: robot chest, facing outward
- USB: prefer USB 3.x (USB 2 works at lower FPS)

## Software

```bash
pip install pyrealsense2 opencv-python
```

Windows: install Intel RealSense SDK 2.0 runtime if the Python wheel cannot open the device.

## Behavior

1. Depth ROI (center of frame) looks for pixels between `min_distance_m` and `max_distance_m`.
2. When person-range pixel ratio exceeds threshold for `presence_seconds`, a **wake** fires.
3. Wake path:
   - Serial `E,255` (enable all body groups)
   - Combined rest pose for head/neck/arms/hands
   - Optional `G,relax`
   - TTS greeting (`greet_text`)
4. Cooldown + require-leave prevent spam greets.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/realsense/devices` | List connected RealSense devices |
| GET | `/api/realsense/status` | Live presence state |
| POST | `/api/realsense/start` | Start guard (optional config body) |
| POST | `/api/realsense/stop` | Stop pipeline |
| GET/POST | `/api/realsense/config` | Read/update tuning |
| POST | `/api/realsense/wake-now` | Manual motor+greet test |
| GET | `/api/realsense/stream?kind=color\|depth` | MJPEG preview |
| GET | `/api/realsense/snapshot` | Single JPEG |

## UI

Vision page (`/camera`): start/stop, greet text, presence seconds, color/depth stream, progress bar.
