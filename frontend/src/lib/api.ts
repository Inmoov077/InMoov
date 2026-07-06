const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function getPorts() {
  const res = await fetch('/api/serial/ports');
  return res.json();
}

export async function connectPort(port: string) {
  const res = await fetch('/api/serial/connect', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ port }),
  });
  return res.json();
}

export async function disconnectPort() {
  const res = await fetch('/api/serial/disconnect', { method: 'POST' });
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