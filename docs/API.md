# REST API overview (InMoove)

Base URL: `http://localhost:5000`

## Core robot

| Area | Prefix |
|------|--------|
| Serial / connect | `/api/serial/*`, `/api/status` |
| Servos | `/api/servo/*` |
| InMoove Core | `/api/core/*` (legacy `/api/mrl/*`) |
| Chat / TTS | `/api/chat`, `/api/speak` |
| Calibration | `/api/calibration/*` |

## RealSense D455

See [REALSENSE.md](./REALSENSE.md) for full detail.

| Method | Path |
|--------|------|
| GET | `/api/realsense/devices` |
| GET | `/api/realsense/status` |
| POST | `/api/realsense/start` |
| POST | `/api/realsense/stop` |
| GET/POST | `/api/realsense/config` |
| POST | `/api/realsense/wake-now` |
| GET | `/api/realsense/stream` |
| GET | `/api/realsense/snapshot` |

All JSON responses should include an `ok` boolean when possible.
