import * as THREE from 'three';

/** Official inmoov_ros materials.urdf.xacro — tuned for white PLA gallery look */
const PALETTE = {
  /** cframe — structural frame (printed white PLA) */
  frame: { color: 0xf0eeea, roughness: 0.58, metalness: 0.03 },
  /** ccover — covers, face, skull, jaw */
  cover: { color: 0xf8f6f2, roughness: 0.52, metalness: 0.02 },
  /** ceyeball */
  eyeball: { color: 0xfafafa, roughness: 0.32, metalness: 0.02 },
  /** ciris — official blue */
  iris: { color: 0x4068e0, roughness: 0.28, metalness: 0.12 },
  /** cbase / ckinect / ccamera */
  base: { color: 0x141418, roughness: 0.42, metalness: 0.2 },
  /** Gazebo/Grey legs */
  grey: { color: 0xe0ded8, roughness: 0.55, metalness: 0.04 },
  /** joint servos / virtual neck pivot */
  joint: { color: 0x2a2a30, roughness: 0.4, metalness: 0.22 },
} as const;

function mat(opts: { color: number; roughness: number; metalness: number; emissive?: number; emissiveIntensity?: number }) {
  return new THREE.MeshStandardMaterial({
    color: opts.color,
    roughness: opts.roughness,
    metalness: opts.metalness,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 0,
  });
}

const CACHE = new Map<string, THREE.MeshStandardMaterial>();

function cached(key: string, factory: () => THREE.MeshStandardMaterial) {
  if (!CACHE.has(key)) CACHE.set(key, factory());
  return CACHE.get(key)!.clone();
}

function findLinkName(mesh: THREE.Object3D): string {
  let cur: THREE.Object3D | null = mesh;
  while (cur) {
    const named = cur as THREE.Object3D & { urdfName?: string; isURDFLink?: boolean };
    if (named.isURDFLink && named.urdfName) return named.urdfName;
    if (named.urdfName) return named.urdfName;
    cur = cur.parent;
  }
  return mesh.name ?? '';
}

function classifyByLink(linkName: string): THREE.MeshStandardMaterial {
  const n = linkName.toLowerCase();

  if (n.includes('iris')) {
    return cached('iris', () => mat({ ...PALETTE.iris, emissive: 0x1a3080, emissiveIntensity: 0.15 }));
  }
  if ((n.includes('eye') || n.includes('eyeball')) && !n.includes('support') && !n.includes('pan')) {
    return cached('eyeball', () => mat(PALETTE.eyeball));
  }
  if (n.includes('camera') || n.includes('kinect')) {
    return cached('base', () => mat({ ...PALETTE.base, emissive: 0x112244, emissiveIntensity: 0.2 }));
  }
  if (
    n.includes('cover') ||
    n.includes('bicepcover') ||
    n.includes('face') ||
    n.includes('skull') ||
    n.includes('jaw') ||
    n.includes('chestplate') ||
    n.includes('disk') ||
    n.includes('handcover')
  ) {
    return cached('cover', () => mat(PALETTE.cover));
  }
  if (
    n.includes('base_link') ||
    n.includes('pedestal') ||
    n.includes('foot_roll') ||
    n.includes('leg_foot')
  ) {
    return cached('base', () => mat(PALETTE.base));
  }
  if (n.includes('pelvis')) {
    return cached('grey', () => mat(PALETTE.grey));
  }
  if (
    n.includes('hip') ||
    n.includes('thigh') ||
    n.includes('knee') ||
    n.includes('ankle') ||
    n.includes('leg_hip') ||
    n.includes('leg_thigh') ||
    n.includes('leg_knee') ||
    n.includes('leg_ankle')
  ) {
    return cached('grey', () => mat(PALETTE.grey));
  }
  if (n.includes('shin') || n.includes('leg_shin')) {
    return cached('cover', () => mat(PALETTE.cover));
  }
  if (n.includes('tilt_link') || n.includes('shoulder_base') || n.includes('virtual')) {
    return cached('joint', () => mat(PALETTE.joint));
  }
  if (
    n.includes('thumb') ||
    n.includes('index') ||
    n.includes('middle') ||
    n.includes('ring') ||
    n.includes('pinky') ||
    n.includes('hand')
  ) {
    return cached('cover', () => mat(PALETTE.cover));
  }
  return cached('frame', () => mat(PALETTE.frame));
}

/** Apply official InMoov white-PLA gallery colors to every mesh. */
export function applyRealisticInmoovMaterials(root: THREE.Object3D) {
  root.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const linkName = findLinkName(mesh);
    const existing = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
    const m = Array.isArray(existing) ? existing[0] : existing;

    // Preserve only special URDF colors (iris blue, kinect black)
    const hex = m?.color?.getHex() ?? 0;
    const keepUrdf =
      hex === 0x4068e0 ||
      hex === 0x4069e0 ||
      (linkName.toLowerCase().includes('iris') && hex !== 0xffffff);

    if (keepUrdf && m) {
      const upgraded = m.clone();
      upgraded.roughness = 0.35;
      upgraded.metalness = 0.1;
      mesh.material = upgraded;
      return;
    }

    mesh.material = classifyByLink(linkName);
  });
}

export function createWoodTable(width = 2.4, depth = 1.6): THREE.Mesh {
  const geo = new THREE.BoxGeometry(width, 0.06, depth);
  const table = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({ color: 0xc8a878, roughness: 0.72, metalness: 0.02 }),
  );
  table.receiveShadow = true;
  table.position.y = -0.03;
  return table;
}

export function createFloorGrid(size = 3, divisions = 24): THREE.GridHelper {
  const grid = new THREE.GridHelper(size, divisions, 0xc8c4bc, 0xe0ddd6);
  grid.position.y = 0.001;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  return grid;
}

export function createStudioBackdrop(): THREE.Mesh {
  const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 4),
    new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.95, metalness: 0 }),
  );
  wall.position.set(0, 1.2, -1.8);
  wall.receiveShadow = true;
  return wall;
}