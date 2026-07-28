# Demo operator quick card

1. `run.bat` or `python app.py` → open http://localhost:5000
2. Settings → connect serial (Arduino Mega)
3. Vision → Start D455 presence (optional)
4. Studio / Control → gestures and sliders
5. If person approaches chest camera ~5s → motors + hello

Troubleshooting:

- No camera listed → `python scripts/check_realsense.py`
- JSON errors → `python scripts/validate_shared_json.py`
- Paths → rebuild URDF via `scripts/compile_inmoov_ros_urdf.py`
