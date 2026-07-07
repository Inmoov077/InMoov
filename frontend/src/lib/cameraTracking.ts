/**
 * MediaPipe face + hand tracking — ported from dashboard.html.
 * Loads CDN scripts dynamically (same as MyRobotLab InMoov2 OpenCV tracking intent).
 */

const MEDIAPIPE_SCRIPTS = [
  'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js',
];

declare global {
  interface Window {
    FaceDetection?: new (opts: { locateFile: (f: string) => string }) => MediaPipeFaceDetection;
    Hands?: new (opts: { locateFile: (f: string) => string }) => MediaPipeHands;
    Camera?: new (
      video: HTMLVideoElement,
      opts: { onFrame: () => Promise<void>; width: number; height: number },
    ) => { start: () => Promise<void>; stop: () => Promise<void> };
  }
}

interface MediaPipeFaceDetection {
  setOptions: (o: { model: string; minDetectionConfidence: number }) => void;
  onResults: (cb: (r: FaceResults) => void) => void;
  send: (o: { image: HTMLVideoElement }) => Promise<void>;
}

interface MediaPipeHands {
  setOptions: (o: {
    maxNumHands: number;
    modelComplexity: number;
    minDetectionConfidence: number;
    minTrackingConfidence: number;
  }) => void;
  onResults: (cb: (r: HandsResults) => void) => void;
  send: (o: { image: HTMLVideoElement }) => Promise<void>;
}

export interface FaceResults {
  detections?: Array<{
    boundingBox: { xCenter: number; yCenter: number; width: number; height: number };
  }>;
}

export interface HandLandmark {
  x: number;
  y: number;
}

export interface HandsResults {
  multiHandLandmarks?: HandLandmark[][];
}

export interface GazeOptions {
  invertEye?: boolean;
  invertNeck?: boolean;
  faceFollowEnabled?: boolean;
  onGazeUpdate?: (eye: number, hneck: number) => void;
}

export interface CameraTrackerCallbacks {
  onFaceDetected?: (detected: boolean, box?: { x: number; y: number; w: number; h: number }) => void;
  onHandDetected?: (detected: boolean, landmarks?: HandLandmark[]) => void;
  onOpenHand?: () => void;
  onGaze?: GazeOptions['onGazeUpdate'];
}

let scriptsLoaded = false;

async function loadMediaPipeScripts(): Promise<void> {
  if (scriptsLoaded) return;
  for (const src of MEDIAPIPE_SCRIPTS) {
    await new Promise<void>((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const s = document.createElement('script');
      s.src = src;
      s.crossOrigin = 'anonymous';
      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(s);
    });
  }
  scriptsLoaded = true;
}

function isHandOpen(lm: HandLandmark[]): boolean {
  return (
    lm[8].y < lm[6].y &&
    lm[12].y < lm[10].y &&
    lm[16].y < lm[14].y &&
    lm[20].y < lm[18].y
  );
}

const HAND_CONNECTIONS: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [0, 17], [17, 18], [18, 19], [19, 20],
];

export function drawHandLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: HandLandmark[],
  width: number,
  height: number,
  color = '#e879a8',
): void {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (const [i1, i2] of HAND_CONNECTIONS) {
    const p1 = landmarks[i1];
    const p2 = landmarks[i2];
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height);
    ctx.lineTo(p2.x * width, p2.y * height);
    ctx.stroke();
  }
  for (const p of landmarks) {
    ctx.beginPath();
    ctx.arc(p.x * width, p.y * height, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawFaceBox(
  ctx: CanvasRenderingContext2D,
  box: { x: number; y: number; w: number; h: number },
  color = '#00e676',
): void {
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(box.x, box.y, box.w, box.h);
}

export class CameraTracker {
  private stream: MediaStream | null = null;
  private cameraHelper: { stop: () => Promise<void> } | null = null;
  private faceDetection: MediaPipeFaceDetection | null = null;
  private handsDetector: MediaPipeHands | null = null;
  private active = false;
  private smoothedFaceX = 0.5;
  private lastTrackTime = 0;
  private lastGreetTime = 0;
  private gazeOpts: GazeOptions = {};
  private callbacks: CameraTrackerCallbacks = {};
  private getHneck = () => 85;
  private getEye = () => 90;

  setGazeOptions(opts: GazeOptions) {
    this.gazeOpts = { ...this.gazeOpts, ...opts };
  }

  setServoReaders(readHneck: () => number, readEye: () => number) {
    this.getHneck = readHneck;
    this.getEye = readEye;
  }

  setCallbacks(cb: CameraTrackerCallbacks) {
    this.callbacks = cb;
  }

  isActive() {
    return this.active;
  }

  async start(video: HTMLVideoElement): Promise<void> {
    await loadMediaPipeScripts();
    if (!window.FaceDetection || !window.Hands || !window.Camera) {
      throw new Error('MediaPipe failed to initialize');
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480, facingMode: 'user' },
    });
    video.srcObject = this.stream;
    await video.play();

    if (!this.faceDetection) {
      this.faceDetection = new window.FaceDetection({
        locateFile: (f) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${f}`,
      });
      this.faceDetection.setOptions({ model: 'short', minDetectionConfidence: 0.5 });
      this.faceDetection.onResults((results) => this.handleFace(results, video));
    }

    if (!this.handsDetector) {
      this.handsDetector = new window.Hands({
        locateFile: (f) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
      });
      this.handsDetector.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      this.handsDetector.onResults((results) => this.handleHands(results, video));
    }

    const helper = new window.Camera(video, {
      onFrame: async () => {
        if (!this.active) return;
        await this.faceDetection?.send({ image: video });
        await this.handsDetector?.send({ image: video });
      },
      width: 640,
      height: 480,
    });

    this.cameraHelper = helper;
    this.active = true;
    await helper.start();
  }

  async stop(video: HTMLVideoElement): Promise<void> {
    this.active = false;
    if (this.cameraHelper) {
      try {
        await this.cameraHelper.stop();
      } catch {
        /* ignore */
      }
      this.cameraHelper = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((t) => t.stop());
      this.stream = null;
    }
    video.srcObject = null;
  }

  captureFrame(video: HTMLVideoElement, mirror = true): string | null {
    if (!this.active || video.readyState < 2) return null;
    try {
      const c = document.createElement('canvas');
      c.width = 480;
      c.height = 360;
      const ctx = c.getContext('2d');
      if (!ctx) return null;
      if (mirror) {
        ctx.translate(c.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, c.width, c.height);
      return c.toDataURL('image/jpeg', 0.75);
    } catch {
      return null;
    }
  }

  private handleFace(results: FaceResults, video: HTMLVideoElement) {
    if (!this.active) return;
    const canvas = video.nextElementSibling as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.detections?.length) {
      const bb = results.detections[0].boundingBox;
      const box = {
        x: bb.xCenter * canvas.width - (bb.width * canvas.width) / 2,
        y: bb.yCenter * canvas.height - (bb.height * canvas.height) / 2,
        w: bb.width * canvas.width,
        h: bb.height * canvas.height,
      };
      drawFaceBox(ctx, box);
      this.callbacks.onFaceDetected?.(true, box);

      this.smoothedFaceX = this.smoothedFaceX * 0.75 + bb.xCenter * 0.25;
      if (this.gazeOpts.faceFollowEnabled !== false) {
        this.handleGaze();
      }
    } else {
      this.callbacks.onFaceDetected?.(false);
    }
  }

  private handleGaze() {
    const now = Date.now();
    if (now - this.lastTrackTime < 120) return;
    if (window.speechSynthesis?.speaking) return;
    this.lastTrackTime = now;

    const invertEye = this.gazeOpts.invertEye ?? true;
    const invertNeck = this.gazeOpts.invertNeck ?? false;
    const faceX = this.smoothedFaceX;

    let targetEye = invertEye
      ? Math.round(90 - (0.5 - faceX) * 100)
      : Math.round(90 + (0.5 - faceX) * 100);
    targetEye = Math.max(45, Math.min(135, targetEye));

    let targetHneck = this.getHneck();
    const step = invertNeck ? -4 : 4;
    if (targetEye > 115) targetHneck += step;
    else if (targetEye < 65) targetHneck -= step;
    targetHneck = Math.max(35, Math.min(135, targetHneck));

    const eyeDiff = Math.abs(targetEye - this.getEye());
    const hneckDiff = Math.abs(targetHneck - this.getHneck());

    if (eyeDiff >= 2 || hneckDiff >= 2) {
      this.callbacks.onGaze?.(targetEye, targetHneck);
    }
  }

  private handleHands(results: HandsResults, video: HTMLVideoElement) {
    if (!this.active) return;
    const canvas = video.nextElementSibling as HTMLCanvasElement | null;

    if (results.multiHandLandmarks?.length) {
      const lm = results.multiHandLandmarks[0];
      this.callbacks.onHandDetected?.(true, lm);
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        drawHandLandmarks(ctx, lm, canvas.width, canvas.height);
      }
      if (isHandOpen(lm)) this.triggerOpenHand();
    } else {
      this.callbacks.onHandDetected?.(false);
    }
  }

  private triggerOpenHand() {
    const now = Date.now();
    if (now - this.lastGreetTime < 6000) return;
    if (window.speechSynthesis?.speaking) return;
    this.lastGreetTime = now;
    this.callbacks.onOpenHand?.();
  }
}