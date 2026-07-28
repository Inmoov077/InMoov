# InMoove

Open-source **InMoov humanoid robot control system** â€” Marwadi University Robotics & AI Club.

36-axis full-body servo control, **InMoove Core** runtime (native â€” no external Java stack), web dashboard, AI conversation, offline voice Q&A, camera tracking, and 3D preview.

## Quick Start

```bash
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY
python app.py
```

Open **http://localhost:5000**

| Page | URL |
|------|-----|
| Home | http://localhost:5000/ |
| **InMoove Studio** | http://localhost:5000/robot |
| Features hub | http://localhost:5000/features |

Or double-click `run.bat` on Windows.

## InMoove Core

Native robot runtime embedded in this project (`inmoove_core/`):

- Always online when Flask is running (no port 8888, no external process)
- 136+ gestures from `shared/gestures.json`
- Servo peers, speech (TTS + jaw), safe script DSL
- Body-map assets under `inmoove_core/assets/`
- Serial bridge to Arduino firmware

API: `/api/core/*` (legacy `/api/mrl/*` aliases still work).

## Hardware

1. Upload `full_body_servo_control.ino` to **Arduino Mega 2560** (uncomment `#define HEAD_ONLY` for 6-servo head-only on Uno)
2. Connect via USB (9600 baud)
3. Dashboard â†’ **Settings** â†’ Auto-Detect or select COM port

### Serial Protocol

| Command | Format |
|---------|--------|
| Handshake | `?` |
| Head | `H,<neck>,<eye>,<jaw>` |
| Neck | `N,<rot>,<tilt>,<roll>` |
| Combined | `C,<hn>,<he>,<hj>,<nr>,<nt>,<nro>` |
| Left/right arm | `LA/RA,<5>` |
| Left/right hand | `LH/RH,<5>` |
| Left/right leg | `LL/RL,<5>` |
| Pattern | `G,<nod\|shake\|yes\|no\|bow\|relax>` |
| Stop | `S` |

## Dashboard

- **Studio** (`/robot`) â€” body map, all servos, gestures, vision peer, runtime, script
- **Control / Body / Head / Neck** â€” direct axes + 3D preview
- **Moves** â€” gesture library
- **Vision** â€” MediaPipe face/hand tracking
- **Chat** â€” Gemini / Ollama + mood expressions
- **Voice** â€” offline commands
- **Calibration / Settings** â€” pins, limits, COM port


## RealSense D455 Presence Wake

Chest-mounted **Intel RealSense D455** can wake the robot when a person stands in front for N seconds (default 5):

1. `pip install pyrealsense2 opencv-python`
2. Connect D455 over USB 3.x
3. Open **Vision** → start D455 presence guard
4. On wake: motors enable (`E,255`) + rest pose + spoken greeting

API surface: `/api/realsense/*` (devices, status, start, stop, config, stream, wake-now).

Default tuning lives in `shared/realsense_config.json`.
## Project Structure

```
app.py                     Flask + InMoove Core API
inmoove_core/              Native runtime (no external deps)
  assets/                  Body map, icons, expressions
  config/peers.json        Peer graph
  runtime.py               Servos, gestures, speech, script DSL
shared/gestures.json       Gesture keyframes
shared/servo_config.json   36-servo map
frontend/                  React control deck
full_body_servo_control.ino
models/inmoov/             URDF + STL meshes
docs/                      RealSense + API notes
scripts/check_realsense.py Camera diagnostics
```

## CLI / RAG

```bash
python chat_cli.py
python vector_db.py index knowledge_base.txt
python vector_db.py search "robotics club"
```

## License

Built on the [InMoov](https://inmoov.fr/) open-source humanoid robot project.


