# InMoov

Open-source InMoov humanoid robot **head control system** — Marwadi University Robotics & AI Club.

6-axis servo control, unified web dashboard, AI conversation, offline voice Q&A, camera tracking, and 3D preview.

## Quick Start

```bash
pip install -r requirements.txt
cp .env.example .env   # add your GEMINI_API_KEY
python app.py
```

Open **http://localhost:5000**

Or double-click `run.bat` on Windows.

## Hardware

1. Upload `combined_servo_control.ino` to Arduino
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
| Stop | `S` |

## Dashboard Tabs

- **All 6 Servos** — unified control + 3D preview
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
combined_servo_control.ino   Arduino firmware
knowledge_base.txt      RAG content
requirements.txt        Python dependencies
```

## License

Built on the [InMoov](https://inmoov.fr/) open-source humanoid robot project.