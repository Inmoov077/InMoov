import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Box, ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useServoStore } from '@/store/servoStore';
import { cn } from '@/lib/utils';
import { useBodyStore } from '@/store/bodyStore';
import { FULL_BODY_POSES } from '@/lib/bodyConfig';
import { applyGalleryPose } from '@/lib/applyGalleryPose';
import { GALLERY_REFS } from '@/lib/inmoovGalleryRefs';
import {
  clearLiveRobot,
  nextLiveGeneration,
  setLiveRobot,
  setLiveRobotStatusListener,
  syncLiveRobot,
} from '@/lib/robotLiveController';
import { readStoreAngles } from '@/lib/robotStoreAngles';
import {
  applyCameraView,
  CAMERA_VIEWS,
  createViewerScene,
  loadRobotModel,
  type ViewerScene,
} from '@/lib/robotViewerCore';

export interface RobotViewerHandle {
  setAngles: (a: number, b: number, c: number, d: number, e: number, f: number) => void;
  setView: (viewId: string) => void;
}

export const RobotViewer = forwardRef<
  RobotViewerHandle,
  {
    className?: string;
    syncStore?: boolean;
    showGallery?: boolean;
    /**
     * Studio keeps full chrome (ROS badge, gallery, view chips).
     * Moves uses simple preview — no official ROS UI clutter.
     */
    variant?: 'studio' | 'moves';
  }
>(function RobotViewer({ className, syncStore = true, showGallery = false, variant = 'studio' }, ref) {
  const simple = variant === 'moves';
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<ViewerScene | null>(null);

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const [activeView, setActiveView] = useState('full');
  const hneck = useServoStore((s) => s.hneck);
  const [linked, setLinked] = useState(false);
  const setArm = useBodyStore((s) => s.setArm);
  const setHand = useBodyStore((s) => s.setHand);
  const setLeg = useBodyStore((s) => s.setLeg);
  const [meshCount, setMeshCount] = useState(0);
  const [jointCount, setJointCount] = useState(0);
  const [showRef, setShowRef] = useState(false);
  const [refIndex, setRefIndex] = useState(0);

  const activeRef = GALLERY_REFS[refIndex] ?? GALLERY_REFS[0];

  const setView = (viewId: string) => {
    const viewer = viewerRef.current;
    if (!viewer?.robot?.root) return;
    applyCameraView(viewer.camera, viewer.controls, viewer.robot.root, viewId);
    setActiveView(viewId);
    viewer.resize();
  };

  const setAngles = (hp: number, e: number, j: number, nr: number, nt: number, nrl: number) => {
    if (!syncStore) return;
    syncLiveRobot({
      ...readStoreAngles(),
      headPan: hp ?? 90,
      eye: e ?? 90,
      jaw: j ?? 8,
      neckRot: nr ?? 90,
      neckTilt: nt ?? 90,
      neckRoll: nrl ?? 90,
    });
  };

  useImperativeHandle(ref, () => ({ setAngles, setView }), [syncStore]);

  useEffect(() => {
    if (!syncStore) return;
    const unsubServo = useServoStore.subscribe(() => syncLiveRobot());
    const unsubBody = useBodyStore.subscribe(() => syncLiveRobot());
    return () => {
      unsubServo();
      unsubBody();
    };
  }, [syncStore]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const generation = nextLiveGeneration();
    const viewer = createViewerScene(canvas, container);
    viewerRef.current = viewer;
    let animId = 0;
    let cancelled = false;

    setLiveRobotStatusListener((ready) => {
      if (cancelled) return;
      setLinked(ready);
      if (ready) setStatus('ready');
    });

    loadRobotModel(viewer.scene, viewer)
      .then(() => {
        if (cancelled || !viewer.robot) return;
        setLiveRobot(viewer.robot, generation, viewer);
        let parts = 0;
        viewer.robot.root.traverse((child) => {
          if ((child as { isMesh?: boolean }).isMesh) parts += 1;
        });
        setMeshCount(parts);
        setJointCount(Object.keys(viewer.robot.urdf?.joints ?? {}).length);
        setStatus('ready');
        setView('full');
        viewer.resize();
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'URDF or mesh load failed');
          setStatus('error');
        }
      });

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const v = viewerRef.current;
      if (!v || cancelled) return;
      v.controls.update();
      v.renderer.render(v.scene, v.camera);
    };
    animate();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animId);
      clearLiveRobot(generation);
      setLiveRobotStatusListener(null);
      viewerRef.current = null;
      viewer.dispose();
    };
  }, []);

  return (
    <div className={cn('viewer-shell relative h-full min-h-[280px] w-full', className)}>
      <div
        ref={containerRef}
        className={cn('h-full w-full transition-all duration-300', showRef && showGallery ? 'lg:pr-[38%]' : '')}
      >
        <canvas ref={canvasRef} className="relative z-[1] block h-full w-full touch-none" />

        {/* Studio-only chrome (official ROS badge, gallery, views). Hidden on Moves. */}
        {!simple && (
          <div className="absolute left-4 top-4 z-[3] flex flex-col gap-2">
            <div className="flex items-center gap-2 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium shadow-soft backdrop-blur-sm">
              <Box className="h-3.5 w-3.5 text-primary" />
              Official inmoov_ros 3D
              {status === 'ready' && <span className="h-2 w-2 rounded-full bg-success animate-pulseDot" />}
            </div>
            {status === 'ready' && (
              <p
                className={cn(
                  'rounded-full px-3 py-1 text-[10px] shadow-soft backdrop-blur-sm',
                  linked ? 'bg-card/85 text-muted-foreground' : 'bg-destructive/15 font-medium text-destructive',
                )}
              >
                {meshCount} meshes · {jointCount} joints · head {Math.round(hneck)}° · {linked ? 'linked ✓' : 'NOT linked — reload page'}
              </p>
            )}
          </div>
        )}

        {!simple && status === 'ready' && (
          <div className="absolute right-4 top-4 z-[3] flex max-w-[200px] flex-col gap-1.5">
            <button
              type="button"
              onClick={() => {
                const s = readStoreAngles();
                syncLiveRobot({ ...s, headPan: s.headPan > 120 ? 20 : 160, neckRot: 30 });
                setTimeout(() => syncLiveRobot(readStoreAngles()), 600);
              }}
              className="rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium text-muted-foreground shadow-soft backdrop-blur-sm hover:bg-card hover:text-foreground"
            >
              Test 3D move
            </button>
            <div className="flex flex-wrap justify-end gap-1">
              {(Object.keys(FULL_BODY_POSES) as (keyof typeof FULL_BODY_POSES)[]).map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    const pose = FULL_BODY_POSES[name];
                    setArm('left', pose.leftArm, false);
                    setArm('right', pose.rightArm, false);
                    setHand('left', pose.leftHand, false);
                    setHand('right', pose.rightHand, false);
                    setLeg('left', pose.leftLeg, false);
                    setLeg('right', pose.rightLeg, false);
                    setView(name === 'squat' ? 'legs' : 'full');
                  }}
                  className="rounded-full bg-card/90 px-2.5 py-1 text-[10px] font-medium capitalize text-muted-foreground shadow-soft backdrop-blur-sm hover:bg-card hover:text-foreground"
                >
                  {name}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                applyGalleryPose(false);
                setView('full');
              }}
              className="flex items-center justify-end gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-medium text-primary-foreground shadow-soft"
            >
              <Sparkles className="h-3 w-3" /> Gallery pose
            </button>
            {showGallery && (
              <button
                type="button"
                onClick={() => setShowRef((v) => !v)}
                className={cn(
                  'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium shadow-soft backdrop-blur-sm',
                  showRef ? 'bg-primary text-primary-foreground' : 'bg-card/90 text-muted-foreground',
                )}
              >
                <ImageIcon className="h-3 w-3" /> Compare photo
              </button>
            )}
          </div>
        )}

        {!simple && status === 'ready' && (
          <div className="absolute bottom-4 left-4 right-4 z-[3] flex flex-wrap gap-1.5">
            {CAMERA_VIEWS.map((view) => (
              <button
                key={view.id}
                type="button"
                onClick={() => setView(view.id)}
                className={cn(
                  'rounded-full px-3 py-1 text-[11px] font-medium shadow-soft backdrop-blur-sm transition-colors',
                  activeView === view.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card/90 text-muted-foreground hover:bg-card hover:text-foreground',
                )}
              >
                {view.label}
              </button>
            ))}
          </div>
        )}

        {status === 'loading' && (
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 bg-viewer/80 backdrop-blur-sm">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {simple ? 'Loading preview…' : 'Building realistic InMoov preview…'}
            </p>
            {!simple && (
              <p className="text-xs text-muted-foreground">Head · hands · arms · legs · real movement</p>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="absolute inset-0 z-[3] flex flex-col items-center justify-center gap-3 p-4 text-center">
            <p className="font-semibold text-destructive">3D robot failed to load</p>
            <p className="max-w-sm text-sm text-muted-foreground">{loadError || 'URDF or STL meshes could not load'}</p>
            <button
              type="button"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
            {!simple && (
              <p className="text-xs text-muted-foreground">
                Run <code className="rounded bg-muted px-1">run.bat</code> then open /control
              </p>
            )}
          </div>
        )}
      </div>

      {!simple && showGallery && showRef && status === 'ready' && (
        <aside className="absolute bottom-0 right-0 top-0 z-[4] flex w-full flex-col border-l border-border/50 bg-card/95 backdrop-blur-md lg:w-[38%]">
          <div className="border-b border-border/50 p-3">
            <p className="font-display text-sm font-semibold">Reference — real InMoov build</p>
            <p className="text-[11px] text-muted-foreground">
              <a href="https://inmoov.fr/gallery-v2/" target="_blank" rel="noreferrer" className="underline">
                inmoov.fr/gallery-v2
              </a>
            </p>
          </div>
          <div className="relative flex-1 overflow-hidden p-3">
            <img
              src={activeRef.src}
              alt={activeRef.label}
              className="h-full w-full rounded-xl object-contain"
            />
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-border/50 p-2">
            {GALLERY_REFS.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setRefIndex(i)}
                className={cn(
                  'h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2',
                  refIndex === i ? 'border-primary' : 'border-transparent opacity-70',
                )}
              >
                <img src={item.src} alt={item.label} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <p className="px-3 pb-2 text-center text-[10px] text-muted-foreground">{activeRef.credit}</p>
        </aside>
      )}
    </div>
  );
});