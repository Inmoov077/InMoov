const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function getPorts() {
  const res = await fetch('/api/serial/ports');
  return res.json() as Promise<{
    ports: string[];
    details?: {
      device: string;
      description: string;
      manufacturer?: string;
      likely_arduino?: boolean;
      vid?: string;
      pid?: string;
    }[];
    current?: string | null;
    connected?: boolean;
    last_error?: string | null;
  }>;
}

export async function connectPort(port: string, force = true) {
  const res = await fetch('/api/serial/connect', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ port, force }),
  });
  return res.json();
}

export async function disconnectPort() {
  const res = await fetch('/api/serial/disconnect', { method: 'POST' });
  return res.json();
}

export async function forceReleasePort(port?: string) {
  const res = await fetch('/api/serial/force-release', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ port }),
  });
  return res.json();
}

export async function autoDetectPort() {
  const res = await fetch('/api/serial/autodetect', { method: 'POST' });
  return res.json();
}

export async function sendHead(neck: number, eye: number, jaw: number) {
  const res = await fetch('/api/servo/head', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ neck, eye, jaw }),
  });
  return res.json();
}

export async function sendNeck(rot: number, tilt: number, roll: number) {
  const res = await fetch('/api/servo/neck3', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ rot, tilt, roll }),
  });
  return res.json();
}

export async function sendCombined6(payload: {
  headNeck: number;
  headEye: number;
  headJaw: number;
  neckRot: number;
  neckTilt: number;
  neckRoll: number;
}) {
  const res = await fetch('/api/servo/combined6', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendArm(
  side: 'left' | 'right',
  arm: { shoulder: number; lift: number; rotate: number; elbow: number; wrist: number },
) {
  const res = await fetch('/api/servo/arm', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ side, ...arm }),
  });
  return res.json();
}

export async function sendHand(
  side: 'left' | 'right',
  hand: { thumb: number; index: number; middle: number; ring: number; pinky: number },
) {
  const res = await fetch('/api/servo/hand', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ side, ...hand }),
  });
  return res.json();
}

export async function sendLeg(
  side: 'left' | 'right',
  leg: { hip: number; thigh: number; knee: number; ankle: number; foot: number },
) {
  const res = await fetch('/api/servo/leg', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ side, ...leg }),
  });
  return res.json();
}

export async function sendFullBody(payload: {
  leftArm: { shoulder: number; lift: number; rotate: number; elbow: number; wrist: number };
  rightArm: { shoulder: number; lift: number; rotate: number; elbow: number; wrist: number };
  leftHand: { thumb: number; index: number; middle: number; ring: number; pinky: number };
  rightHand: { thumb: number; index: number; middle: number; ring: number; pinky: number };
  leftLeg: { hip: number; thigh: number; knee: number; ankle: number; foot: number };
  rightLeg: { hip: number; thigh: number; knee: number; ankle: number; foot: number };
}) {
  const res = await fetch('/api/servo/body', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function emergencyStop() {
  await fetch('/api/servo/neck3/stop', { method: 'POST' });
  await fetch('/api/scripts/stop', { method: 'POST' });
}

export async function sendRawSerial(cmd: string) {
  const res = await fetch('/api/serial/raw', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ cmd }),
  });
  return res.json();
}

export async function getConfig() {
  const res = await fetch('/api/config');
  return res.json();
}

export async function getServoConfig() {
  const res = await fetch('/api/servo/config');
  return res.json();
}

export async function runFirmwarePattern(name: string) {
  const res = await fetch('/api/servo/pattern', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ name }),
  });
  return res.json();
}

/** Intel RealSense D455 chest presence guard */
export interface RealSenseStatus {
  ok?: boolean;
  running?: boolean;
  device_connected?: boolean;
  device_name?: string;
  serial_number?: string;
  usb_type?: string;
  person_present?: boolean;
  presence_seconds?: number;
  presence_required?: number;
  progress?: number;
  awake?: boolean;
  last_wake_at?: number | null;
  last_greet_text?: string;
  last_error?: string;
  frames?: number;
  person_pixel_ratio?: number;
  median_distance_m?: number | null;
  waiting_for_leave?: boolean;
  has_frame?: boolean;
  config?: {
    presence_seconds?: number;
    min_distance_m?: number;
    max_distance_m?: number;
    greet_text?: string;
    greet_cooldown_s?: number;
    enable_motors_on_wake?: boolean;
  };
}

export async function realsenseDevices() {
  const res = await fetch('/api/realsense/devices');
  return res.json();
}

export async function realsenseStatus(): Promise<RealSenseStatus> {
  const res = await fetch('/api/realsense/status');
  return res.json();
}

export async function realsenseStart(config?: Record<string, unknown>) {
  const res = await fetch('/api/realsense/start', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(config || {}),
  });
  return res.json();
}

export async function realsenseStop() {
  const res = await fetch('/api/realsense/stop', { method: 'POST' });
  return res.json();
}

export async function realsenseWakeNow(greetText = 'Hello, how are you?') {
  const res = await fetch('/api/realsense/wake-now', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ greet_text: greetText, enable_motors: true }),
  });
  return res.json();
}

export async function realsenseConfig(patch?: Record<string, unknown>) {
  if (!patch) {
    const res = await fetch('/api/realsense/config');
    return res.json();
  }
  const res = await fetch('/api/realsense/config', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(patch),
  });
  return res.json();
}

export async function getServoPins() {
  const res = await fetch('/api/servo/pins');
  return res.json();
}

export async function saveServoPins(pins: Record<string, number>, applyToFirmware = true) {
  const res = await fetch('/api/servo/pins', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ pins, applyToFirmware }),
  });
  return res.json();
}

export async function setServoPin(key: string, pin: number) {
  const res = await fetch('/api/servo/pin', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ key, pin }),
  });
  return res.json();
}

/** 1:1 move a single servo by config key */
export async function moveServoByKey(key: string, angle: number) {
  const res = await fetch('/api/servo/move', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ key, angle }),
  });
  return res.json();
}

export async function getServoCalibration() {
  const res = await fetch('/api/servo/calibration');
  return res.json();
}

export async function saveServoCalibration(
  calibration: Record<string, { min?: number; max?: number; rest?: number }>,
  applyToFirmware = true,
) {
  const res = await fetch('/api/servo/calibration', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ calibration, applyToFirmware }),
  });
  return res.json();
}

export async function setServoLimits(key: string, limits: { min: number; max: number; rest: number }) {
  const res = await fetch('/api/servo/limits', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ key, ...limits }),
  });
  return res.json();
}

export async function sendGrip(side: 'L' | 'R' | 'B', percent: number) {
  const res = await fetch('/api/servo/grip', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ side, percent }),
  });
  return res.json();
}

export async function setBodyPartEnable(enabled: Record<string, boolean>) {
  const res = await fetch('/api/servo/enable', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ enabled }),
  });
  return res.json();
}

export async function getWavePatterns() {
  const res = await fetch('/api/servo/wave-patterns');
  return res.json();
}

export async function applyVdbPinProfile() {
  const res = await fetch('/api/servo/apply-vdb-pins', { method: 'POST' });
  return res.json();
}

export async function getStatus() {
  const res = await fetch('/api/status');
  return res.json();
}

export async function offlineSearch(query: string) {
  const res = await fetch('/api/offline/search', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ query }),
  });
  return res.json();
}

export async function offlineIndex(path: string) {
  const res = await fetch('/api/offline/index', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ path }),
  });
  return res.json();
}

export async function sendConversation(payload: {
  message: string;
  model_provider: string;
  image?: string;
  local_url?: string;
  language?: string;
  api_key?: string;
}) {
  const res = await fetch('/api/conversation', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });
  return res.json();
}