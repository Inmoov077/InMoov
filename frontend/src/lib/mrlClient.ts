const JSON_HEADERS = { 'Content-Type': 'application/json' };

export interface MrlStatus {
  ok: boolean;
  online: boolean;
  url: string;
  version?: string;
  serviceCount?: number;
  services?: string[];
  i01State?: string;
  error?: string;
}

export interface MrlServoState {
  service: string;
  getPin?: string | number;
  getMin?: number;
  getMax?: number;
  getRest?: number;
  getSpeed?: number;
  getPosition?: number | string | null;
  isAttached?: boolean;
  isSweeping?: boolean;
  ok?: boolean;
}

export interface MrlI01Servo {
  service: string;
  label: string;
  group: string;
}

export interface MrlGesture {
  id: string;
  mrlName: string;
  name: string;
  category: string;
  icon: string;
}

export interface MrlCallResult<T = unknown> {
  ok: boolean;
  status?: number;
  data?: T;
  error?: string;
}

async function parseJson<T>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

export async function getMrlStatus(): Promise<MrlStatus> {
  const res = await fetch('/api/core/status');
  return parseJson(res);
}

export async function getMrlServices() {
  const res = await fetch('/api/core/services');
  return parseJson<{ ok: boolean; services: string[]; grouped: Record<string, string[]>; count: number }>(res);
}

export async function getMrlI01Servos() {
  const res = await fetch('/api/core/robot/servos');
  return parseJson<{ ok: boolean; servos: MrlI01Servo[] }>(res);
}

export async function getMrlGestures() {
  const res = await fetch('/api/core/gestures');
  return parseJson<{ ok: boolean; gestures: MrlGesture[]; count: number }>(res);
}

export async function getMrlServoState(service: string): Promise<MrlServoState> {
  const res = await fetch(`/api/core/servo/${encodeURIComponent(service)}/state`);
  return parseJson(res);
}

export async function mrlCall<T = unknown>(
  service: string,
  method: string,
  ...args: (string | number)[]
): Promise<MrlCallResult<T>> {
  const base = `/api/core/call/${encodeURIComponent(service)}/${encodeURIComponent(method)}`;
  const path = args.length ? `${base}/${args.map(encodeURIComponent).join('/')}` : base;
  const res = await fetch(path);
  return parseJson(res);
}

export async function mrlExec(gesture: string) {
  const res = await fetch('/api/core/exec', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ gesture }),
  });
  return parseJson<{ ok: boolean; gesture: string; script: string; error?: string }>(res);
}

export async function mrlMoveTo(service: string, angle: number) {
  return mrlCall(service, 'moveTo', angle);
}

export async function mrlSetPin(service: string, pin: number) {
  return mrlCall(service, 'setPin', pin);
}

export async function mrlSetSpeed(service: string, speed: number) {
  return mrlCall(service, 'setSpeed', speed);
}

export async function mrlRest(service: string) {
  return mrlCall(service, 'rest');
}

export async function mrlSweep(service: string, enable: boolean) {
  return mrlCall(service, enable ? 'sweep' : 'stop');
}

export async function mrlAttach(service: string) {
  return mrlCall(service, 'attach');
}

export async function mrlDetach(service: string) {
  return mrlCall(service, 'detach');
}

export async function mrlEnable(service: string) {
  return mrlCall(service, 'enable');
}

export async function mrlDisable(service: string) {
  return mrlCall(service, 'disable');
}

export async function mrlSetInverted(service: string, inverted: boolean) {
  return mrlCall(service, 'setInverted', inverted ? 'true' : 'false');
}

export async function mrlSetLimits(service: string, min: number, max: number) {
  return mrlCall(service, 'setMinMax', min, max);
}

/** InMoove Core is always local — no external Web UI required. */
export const MRL_WEBUI_URL = '/robot';

export async function mrlStartPeer(peer: string) {
  const res = await fetch(`/api/core/robot/peer/startPeer/${encodeURIComponent(peer)}`, { method: 'POST' });
  return parseJson<{ ok: boolean; error?: string }>(res);
}

export async function mrlReleasePeer(peer: string) {
  const res = await fetch(`/api/core/robot/peer/releasePeer/${encodeURIComponent(peer)}`, { method: 'POST' });
  return parseJson<{ ok: boolean; error?: string }>(res);
}

export async function mrlSpeak(text: string) {
  const res = await fetch('/api/core/robot/speak', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ text }),
  });
  return parseJson<{ ok: boolean; error?: string }>(res);
}

export async function mrlPythonExec(script: string) {
  const res = await fetch('/api/core/script', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ script }),
  });
  return parseJson<{ ok: boolean; script: string; result?: unknown; error?: string }>(res);
}

export async function getMrlI01Config() {
  const res = await fetch('/api/core/robot/config');
  return parseJson<{ ok: boolean; data?: { peers?: Record<string, unknown> } }>(res);
}

export interface MrlPeer {
  name: string;
  label: string;
  type: string;
  autoStart: boolean;
  started: boolean;
  service: string;
}

export async function getMrlPeers() {
  const res = await fetch('/api/core/peers');
  return parseJson<{ ok: boolean; peers: MrlPeer[]; count: number }>(res);
}

export async function getMrlLifeStatus() {
  const res = await fetch('/api/core/life');
  return parseJson<{
    ok: boolean;
    lifeMode: string;
    state: string;
    actions: string[];
    log: string[];
    randomRunning: boolean;
  }>(res);
}

export async function mrlLifeAction(action: string) {
  const res = await fetch(`/api/core/life/${encodeURIComponent(action)}`, { method: 'POST' });
  return parseJson<{ ok: boolean; action?: string; error?: string; report?: unknown }>(res);
}

export async function mrlStopAll() {
  const res = await fetch('/api/core/stop', { method: 'POST' });
  return parseJson<{ ok: boolean }>(res);
}

export async function mrlRestAll() {
  const res = await fetch('/api/core/rest', { method: 'POST' });
  return parseJson<{ ok: boolean; action?: string }>(res);
}

export const MRL_BODY_PARTS = [
  { id: 'head', label: 'Head', services: ['i01.head'] },
  { id: 'leftArm', label: 'Left arm', services: ['i01.leftArm'] },
  { id: 'rightArm', label: 'Right arm', services: ['i01.rightArm'] },
  { id: 'torso', label: 'Torso', services: ['i01.torso'] },
  { id: 'brain', label: 'Brain / chat', services: ['i01.chatBot', 'i01.fsm'] },
  { id: 'opencv', label: 'OpenCV', services: ['i01.opencv'] },
  { id: 'audio', label: 'Audio', services: ['i01.audioPlayer'] },
] as const;