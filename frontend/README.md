# InMoove Control Deck (frontend)

React + TypeScript + Vite UI for the InMoove humanoid control system.

## Scripts

```bash
npm install
npm run dev      # hot reload against Flask proxy
npm run build    # production bundle → dist/
npm run preview
npm run lint
```

## Pages

| Route | Purpose |
|-------|---------|
| `/` | Home / status |
| `/robot` | InMoove Studio body map |
| `/camera` | MediaPipe tracking + RealSense D455 presence |
| `/body` `/head` `/neck` | Axis control + 3D preview |
| `/presets` | Gesture library |
| `/chat` | AI conversation |
| `/settings` | COM port, pins, limits |
| `/mrl` `/mrl-live` | Core / live MRL-style panels |

## Stack

- React 19, React Router, Zustand
- Tailwind + Radix primitives
- Three.js + urdf-loader for full-body preview
- Framer Motion for transitions

API calls go to the Flask host (same origin in production; Vite proxy in dev).
