# InMoov

Open-source InMoov humanoid robot **head control system** — Marwadi University Robotics & AI Club.

36-axis full-body servo control (head, neck, arms, hands, legs), unified web dashboard, AI conversation, offline voice Q&A, camera tracking, and 3D preview.

## Quick Start

```bash
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY
python app.py
```

Open **http://localhost:5000**

Or double-click `run.bat` on Windows.

## Hardware

1. Upload `full_body_servo_control.ino` to **Arduino Mega 2560** (uncomment `#define HEAD_ONLY` for 6-servo head-only on Uno)
2. Connect via USB (9600 baud)
3. Dashboard → **Settings** → Auto-Detect or select COM port

### Servo Pins

| Pin | Servo |
|-----|-------|
| 3 | Head Neck |
| 4 | Eye |
| 5 | Jaw |
| 6 | Neck Rotation |
| 7 | Neck Tilt |
| 8 | Neck Roll |

### Serial Protocol

| Command | Format |
|---------|--------|
| Handshake | `?` |
| Head | `H,<neck>,<eye>,<jaw>` |
| Neck | `N,<rot>,<tilt>,<roll>` |
| Combined | `C,<hn>,<he>,<hj>,<nr>,<nt>,<nro>` |
| Left arm | `LA,<shoulder>,<lift>,<rotate>,<elbow>,<wrist>` |
| Right arm | `RA,<shoulder>,<lift>,<rotate>,<elbow>,<wrist>` |
| Left hand | `LH,<thumb>,<index>,<middle>,<ring>,<pinky>` |
| Right hand | `RH,<thumb>,<index>,<middle>,<ring>,<pinky>` |
| Left leg | `LL,<hip>,<thigh>,<knee>,<ankle>,<foot>` |
| Right leg | `RL,<hip>,<thigh>,<knee>,<ankle>,<foot>` |
| Pattern | `G,<nod\|shake\|yes\|no\|bow\|relax>` |
| Pin remap | `W,<idx>,<pin>` |
| Dump config | `D` |
| Read positions | `R` |
| Stop | `S` |

## Dashboard Tabs

- **All 6 Servos** — head & neck control + 3D preview
- **Body** — arms (10), hands (10), legs (10) with live 3D sync
- **Head / Neck** — individual axis control
- **Camera Tracking** — MediaPipe face/hand tracking
- **AI Conversation** — Gemini / Ollama with mood expressions
- **Motion Presets** — nod, shake, dance, bow, etc.
- **Offline Q&A** — 52+ voice commands, no internet
- **Testing** — control each subsystem separately
- **Settings** — connection, limits, system info

## CLI Mode

```bash
python chat_cli.py
```

## Vector DB (RAG)

```bash
python vector_db.py index knowledge_base.txt
python vector_db.py search "robotics club"
```

## Project Structure

```
app.py                  Flask server
dashboard.html          Main control center UI
robot_viewer.js         Three.js 3D model viewer
chat_cli.py             Terminal conversation
vector_db.py            TF-IDF knowledge search
full_body_servo_control.ino  Arduino firmware (36 servos, MRL-derived config)
servo_config.h               Auto-generated pins/limits/patterns (do not edit)
shared/servo_config.json     Canonical servo map for firmware + dashboard
scripts/extract_mrl_inmoov.py  Regenerate from myrobotlab-1.1.1610
knowledge_base.txt      RAG content
requirements.txt        Python dependencies
```

## License

Built on the [InMoov](https://inmoov.fr/) open-source humanoid robot project.