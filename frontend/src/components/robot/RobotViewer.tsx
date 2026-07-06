import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Box, Loader2 } from 'lucide-react';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';
import { applyAngles, createViewerScene, lerpAngles, loadRobotModel, LERP, type AngleState } from '@/lib/robotViewerCore';

export interface RobotViewerHandle {
  setAngles: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
}

function storeAngles(): AngleState {
  const s = useServoStore.getState();
  return { headPan: s.hneck, eye: s.eye, jaw: s.jaw, neckRot: s.rot, neckTilt: s.tilt, neckRoll: s.roll };
}

export const RobotViewer = forwardRef<RobotViewerHandle, { className?: string; syncStore?: boolean }>(
  function RobotViewer({ className, syncStore = true }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const initGuard = useRef(false);
    const targetRef = useRef(storeAngles());
    const currentRef = useRef({ ...targetRef.current });
    const readyRef = useRef(false);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

    const { hneck, eye, jaw, rot, tilt, roll } = useServoStore();

    const setAngles = (hp: number, e: number, j: number, nr: number, nt: number, nrl: number) => {
      targetRef.current = { headPan: hp ?? 90, eye: e ?? 90, jaw: j ?? 8, neckRot: nr ?? 90, neckTilt: nt ?? 90, neckRoll: nrl ?? 90 };
    };

    useImperativeHandle(ref, () => ({ setAngles }), []);
    useEffect(() => { if (syncStore) setAngles(hneck, eye, jaw, rot, tilt, roll); }, [syncStore, hneck, eye, jaw, rot, tilt, roll]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || initGuard.current) return;
      initGuard.current = true;

      const viewer = createViewerScene(canvas, container);
      let animId = 0;
      let cancelled = false;

      loadRobotModel(viewer.scene, viewer).then(() => {
        if (cancelled) return;
        readyRef.current = true;
        targetRef.current = storeAngles();
        currentRef.current = { ...targetRef.current };
        setStatus('ready');
        viewer.resize();
      }).catch(() => { if (!cancelled) setStatus('error'); });

      const animate = () => {
        animId = requestAnimationFrame(animate);
        currentRef.current = lerpAngles(currentRef.current, targetRef.current, LERP);
        if (readyRef.current) applyAngles(viewer.headGroup, viewer.neckGroup, currentRef.current);
        viewer.controls.update();
        viewer.renderer.render(viewer.scene, viewer.camera);
      };
      animate();

      return () => {
        cancelled = true;
        cancelAnimationFrame(animId);
        readyRef.current = false;
        initGuard.current = false;
        viewer.dispose();
      };
    }, []);

    return (
      <div ref={containerRef} className={cn('viewer-shell h-full min-h-[280px] w-full', className)}>
        <canvas ref={canvasRef} className="relative z-[1] block h-full w-full touch-none" />
        <div className="absolute left-4 top-4 z-[3] flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur-sm">
          <Box className="h-3.5 w-3.5 text-primary" /> 3D View
          {status === 'ready' && <span className="h-2 w-2 rounded-full bg-success animate-pulseDot" />}
        </div>
        {status === 'loading' && (
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 bg-viewer/80 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading model…</p>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-2 p-4 text-center">
            <p className="font-semibold text-destructive">Could not load 3D model</p>
            <p className="text-sm text-muted-foreground">Start Flask and check /models/</p>
          </div>
        )}
        {status === 'ready' && (
          <p className="absolute bottom-4 right-4 z-[3] rounded-full bg-card/90 px-3 py-1 text-xs text-muted-foreground shadow-soft">Drag to rotate</p>
        )}
      </div>
    );
  },
);