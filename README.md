# InMoove

Open-source **InMoov humanoid robot control system** — Marwadi University Robotics & AI Club.

36-axis full-body servo control, **InMoove Core** runtime (native — no external Java stack), web dashboard, AI conversation, offline voice Q&A, camera tracking, and 3D preview.

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
3. Dashboard → **Settings** → Auto-Detect or select COM port

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

- **Studio** (`/robot`) — body map, all servos, gestures, vision peer, runtime, script
- **Control / Body / Head / Neck** — direct axes + 3D preview
- **Moves** — gesture library
- **Vision** — MediaPipe face/hand tracking
- **Chat** — Gemini / Ollama + mood expressions
- **Voice** — offline commands
- **Calibration / Settings** — pins, limits, COM port

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
```

## CLI / RAG

```bash
python chat_cli.py
python vector_db.py index knowledge_base.txt
python vector_db.py search "robotics club"
```

## License

Built on the [InMoov](https://inmoov.fr/) open-source humanoid robot project.
