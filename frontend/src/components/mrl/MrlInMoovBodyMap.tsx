import { useEffect, useMemo, useRef, useState } from 'react';
import { MRL_ASSET, type InMoovPanel } from '@/lib/mrlInmoovConfig';
import { cn } from '@/lib/utils';

interface MrlInMoovBodyMapProps {
  activePanel: InMoovPanel;
  onSelect: (panel: InMoovPanel) => void;
  i01State?: string;
  className?: string;
  peersStarted?: Record<string, boolean>;
}

/** Exact MRL InMoov2 canvas */
const W = 620;
const H = 588;
const CX = 238;
const CY = 226;
const R = 215;
const START_DEG = 234.5;

/** Circular ring order — same as MyRobotLab InMoov2Gui.js */
const RING: { name: InMoovPanel; label: string }[] = [
  { name: 'brain', label: 'Brain' },
  { name: 'mouth', label: 'Mouth' },
  { name: 'head', label: 'Head' },
  { name: 'torso', label: 'Torso' },
  { name: 'extra', label: 'Extra' },
  { name: 'leg', label: 'Legs' },
  { name: 'sensor', label: 'Sensors' },
  { name: 'arm', label: 'Arms' },
  { name: 'hand', label: 'Hands' },
  { name: 'ear', label: 'Ear' },
];

/** Body glow overlays — pixel positions from InMoov2Gui.css */
const GLOWS: {
  id: string;
  panel: InMoovPanel;
  peer?: string;
  left: number;
  top: number;
  src: string;
}[] = [
  { id: 'head', panel: 'head', peer: 'head', left: 284, top: 145, src: 'headA_Activ.png' },
  { id: 'armR', panel: 'arm', peer: 'rightArm', left: 191, top: 183, src: 'armR_Activ.png' },
  { id: 'armL', panel: 'arm', peer: 'leftArm', left: 315, top: 183, src: 'armL_Activ.png' },
  { id: 'handR', panel: 'hand', peer: 'rightHand', left: 141, top: 199, src: 'handR_Activ.png' },
  { id: 'handL', panel: 'hand', peer: 'leftHand', left: 392, top: 199, src: 'handL_Activ.png' },
  { id: 'torso', panel: 'torso', peer: 'torso', left: 278, top: 216, src: 'torsoA_Activ.png' },
  { id: 'legR', panel: 'leg', peer: 'rightLeg', left: 275, top: 262, src: 'legR_Activ.png' },
  { id: 'legL', panel: 'leg', peer: 'leftLeg', left: 304, top: 262, src: 'legL_Activ.png' },
];

/** Larger invisible hit areas for easier body clicks (percent of canvas) */
const HIT_ZONES: { panel: InMoovPanel; left: string; top: string; width: string; height: string; label: string }[] = [
  { panel: 'head', left: '42%', top: '18%', width: '16%', height: '14%', label: 'Head' },
  { panel: 'torso', left: '40%', top: '34%', width: '20%', height: '16%', label: 'Torso' },
  { panel: 'arm', left: '28%', top: '28%', width: '14%', height: '22%', label: 'Right arm' },
  { panel: 'arm', left: '58%', top: '28%', width: '14%', height: '22%', label: 'Left arm' },
  { panel: 'hand', left: '18%', top: '32%', width: '12%', height: '14%', label: 'Right hand' },
  { panel: 'hand', left: '70%', top: '32%', width: '12%', height: '14%', label: 'Left hand' },
  { panel: 'leg', left: '40%', top: '50%', width: '10%', height: '22%', label: 'Right leg' },
  { panel: 'leg', left: '50%', top: '50%', width: '10%', height: '22%', label: 'Left leg' },
];

function ringPositions() {
  const dangle = (360 / RING.length) * (Math.PI / 180);
  let angle = START_DEG * (Math.PI / 180);
  return RING.map((item) => {
    angle += dangle;
    const x = Math.round(CX + R * Math.cos(angle));
    const y = Math.round(CY + R * Math.sin(angle));
    return { ...item, x, y };
  });
}

const RING_POS = ringPositions();

function asset(name: string) {
  return MRL_ASSET(`img/InMoov2/${name}`);
}

/**
 * Native InMoov2 body map — true 620×588 canvas scaled to fit (no iframe).
 * Ring icons + body hit zones + MRL glow overlays.
 */
export function MrlInMoovBodyMap({
  activePanel,
  onSelect,
  i01State,
  className,
  peersStarted = {},
}: MrlInMoovBodyMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hover, setHover] = useState<string | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = host;
      if (w < 10 || h < 10) return;
      // Fit entire canvas with a little padding
      const s = Math.min(w / W, h / H) * 0.98;
      setScale(Math.max(0.35, Math.min(s, 1.35)));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const statusLine = useMemo(() => {
    const labels: Partial<Record<InMoovPanel, string>> = {
      InMoov: 'Home',
      brain: 'Brain',
      mouth: 'Mouth',
      head: 'Head',
      torso: 'Torso',
      arm: 'Arms',
      hand: 'Hands',
      leg: 'Legs',
      ear: 'Ear',
      sensor: 'Sensors',
      extra: 'Extra',
      gestures: 'Gestures',
      runtime: 'Runtime',
    };
    return labels[activePanel] ?? activePanel;
  }, [activePanel]);

  return (
    <div className={cn('inmoov-map', className)}>
      <div ref={hostRef} className="inmoov-map-host">
        <div
          className="inmoov-map-scaler"
          style={{
            width: W * scale,
            height: H * scale,
          }}
        >
          <div
            className="inmoov-map-canvas"
            style={{
              width: W,
              height: H,
              transform: `scale(${scale})`,
            }}
            role="img"
            aria-label="InMoov body map"
          >
            {/* Background plate */}
            <img src={asset('background.png')} alt="" className="inmoov-map-bg" draggable={false} />

            {/* Large soft hit zones (body silhouette) */}
            {HIT_ZONES.map((z, i) => (
              <button
                key={`${z.panel}-${i}`}
                type="button"
                className={cn('inmoov-map-hit', activePanel === z.panel && 'is-active')}
                style={{ left: z.left, top: z.top, width: z.width, height: z.height }}
                title={z.label}
                aria-label={z.label}
                onClick={() => onSelect(z.panel)}
              />
            ))}

            {/* MRL body glows when selected or peer started */}
            {GLOWS.map((g) => {
              const on = activePanel === g.panel || (g.peer ? peersStarted[g.peer] : false);
              if (!on) return null;
              return (
                <button
                  key={g.id}
                  type="button"
                  className={cn('inmoov-map-glow', activePanel === g.panel && 'is-selected')}
                  style={{ left: g.left, top: g.top }}
                  title={g.panel}
                  onClick={() => onSelect(g.panel)}
                >
                  <img src={asset(g.src)} alt="" draggable={false} />
                </button>
              );
            })}

            {/* Center InMoov logo button */}
            <button
              type="button"
              className={cn('inmoov-map-center', activePanel === 'InMoov' && 'is-active')}
              style={{ left: 157, top: 150 }}
              title="InMoov home"
              onClick={() => onSelect('InMoov')}
              onMouseEnter={() => setHover('InMoov')}
              onMouseLeave={() => setHover(null)}
            >
              <img
                src={asset(
                  activePanel === 'InMoov'
                    ? 'InMoov_Activ.png'
                    : hover === 'InMoov'
                      ? 'InMoov_hover.png'
                      : 'InMoov_off.png',
                )}
                alt="InMoov"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = asset('InMoov_off.png');
                }}
              />
            </button>

            {/* Circular ring buttons */}
            {RING_POS.map((btn) => {
              const active = activePanel === btn.name;
              const isHover = hover === btn.name && !active;
              const file = active
                ? `${btn.name}_Activ.png`
                : isHover
                  ? `${btn.name}_hover.png`
                  : `${btn.name}_off.png`;

              return (
                <button
                  key={btn.name}
                  type="button"
                  className={cn('inmoov-map-ring', active && 'is-active')}
                  style={{ left: btn.x, top: btn.y }}
                  title={btn.label}
                  onClick={() => onSelect(btn.name)}
                  onMouseEnter={() => setHover(btn.name)}
                  onMouseLeave={() => setHover(null)}
                >
                  <img
                    src={asset(file)}
                    alt={btn.label}
                    draggable={false}
                    onError={(e) => {
                      e.currentTarget.src = asset(`${btn.name}_off.png`);
                    }}
                  />
                </button>
              );
            })}

            {/* MRL chrome labels (pixel positions) */}
            <button type="button" className="inmoov-map-label" style={{ left: 41, top: 28 }} onClick={() => onSelect('runtime')}>
              Runtime
            </button>
            <button type="button" className="inmoov-map-label" style={{ left: 41, top: 528 }} onClick={() => onSelect('InMoov')}>
              Intro
            </button>
            <button type="button" className="inmoov-map-label inmoov-map-label-gestures" style={{ left: 250, top: 528 }} onClick={() => onSelect('gestures')}>
              Gestures
            </button>
            <button
              type="button"
              className="inmoov-map-battery"
              style={{ left: 514, top: 511 }}
              title="Sensors"
              onClick={() => onSelect('sensor')}
            >
              <img src={asset('battery_Activ.png')} alt="battery" draggable={false} />
            </button>
          </div>
        </div>
      </div>

      <div className="inmoov-map-footer">
        <span className="inmoov-map-selected">
          <em>Selected</em> {statusLine}
        </span>
        {i01State && (
          <span className="inmoov-map-state">
            <em>i01</em> {i01State}
          </span>
        )}
        <span className="inmoov-map-hint">Click ring or body · controls open on the right</span>
      </div>
    </div>
  );
}
