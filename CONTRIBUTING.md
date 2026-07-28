# Contributing to InMoove

Thanks for helping improve the Marwadi University InMoove control stack.

## Dev setup

1. Python 3.11+ recommended
2. `pip install -r requirements.txt`
3. Optional vision: `pip install pyrealsense2 opencv-python`
4. Frontend: `cd frontend && npm install && npm run dev`
5. Backend: `python app.py` (port 5000)

## Guidelines

- Keep serial protocol compatible with `full_body_servo_control.ino`
- Prefer config in `shared/*.json` over hard-coded constants
- Do not commit `.env`, `node_modules/`, `frontend/dist/`, or `agent-tools/`
- For URDF changes, regenerate via scripts under `scripts/` when possible
- UI copy should stay concise for demo-floor operators

## Commit style

Use short imperative subjects with optional body explaining *why*.
