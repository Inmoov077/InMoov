import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export const MODEL_URL = '/models/space%20suit%20character%203d%20model.glb';

const HEAD_Y_THRESHOLD = 0.12;
const NECK_Y_THRESHOLD = 0.02;
export const LERP = 0.1;

export interface AngleState {
  headPan: number;
  eye: number;
  jaw: number;
  neckRot: number;
  neckTilt: number;
  neckRoll: number;
}

export interface ViewerScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  headGroup: THREE.Group | null;
  neckGroup: THREE.Group | null;
  resize: () => void;
  dispose: () => void;
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

export function lerpAngles(current: AngleState, target: AngleState, t: number): AngleState {
  const out = { ...current };
  for (const key of Object.keys(out) as (keyof AngleState)[]) {
    out[key] = current[key] + (target[key] - current[key]) * t;
  }
  return out;
}

export function applyAngles(
  headGroup: THREE.Group | null,
  neckGroup: THREE.Group | null,
  angles: AngleState,
) {
  const headPanRad = toRad(angles.headPan - 90);
  const eyeRad = toRad(angles.eye - 90);
  const jawRad = toRad(angles.jaw - 8);
  const neckRotRad = toRad(angles.neckRot - 90);
  const neckTiltRad = toRad(angles.neckTilt - 90);
  const neckRollRad = toRad(angles.neckRoll - 90);

  if (headGroup) {
    headGroup.rotation.order = 'YXZ';
    headGroup.rotation.y = -headPanRad;
    headGroup.rotation.x = eyeRad * 0.35 + jawRad * 0.25;
  }
  if (neckGroup) {
    neckGroup.rotation.order = 'YXZ';
    neckGroup.rotation.y = -neckRotRad;
    neckGroup.rotation.x = neckTiltRad;
    neckGroup.rotation.z = -neckRollRad;
  }
}

function enhanceMaterials(object: THREE.Object3D) {
  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((mat) => {
      if (!mat) return;
      if ('envMapIntensity' in mat) (mat as THREE.MeshStandardMaterial).envMapIntensity = 0.8;
      if ('metalness' in mat && (mat as THREE.MeshStandardMaterial).metalness > 0.9) {
        (mat as THREE.MeshStandardMaterial).metalness = 0.65;
      }
      mat.needsUpdate = true;
    });
  });
}

function frameCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  let dist = maxDim / (2 * Math.tan(fov / 2));
  dist *= 1.35;

  camera.position.set(center.x, center.y + size.y * 0.05, center.z + dist);
  camera.near = Math.max(0.01, dist / 100);
  camera.far = dist * 20;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = dist * 0.55;
  controls.maxDistance = dist * 2.2;
  controls.update();
}

export function createViewerScene(
  canvas: HTMLCanvasElement,
  container: HTMLElement,
): ViewerScene {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.22;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();

  const bgCanvas = document.createElement('canvas');
  bgCanvas.width = 2;
  bgCanvas.height = 512;
  const bgCtx = bgCanvas.getContext('2d');
  if (bgCtx) {
    const grad = bgCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#e8ddd0');
    grad.addColorStop(0.45, '#f5f0ea');
    grad.addColorStop(1, '#d4c8bc');
    bgCtx.fillStyle = grad;
    bgCtx.fillRect(0, 0, 2, 512);
  }
  const bgTexture = new THREE.CanvasTexture(bgCanvas);
  bgTexture.colorSpace = THREE.SRGBColorSpace;
  scene.background = bgTexture;
  scene.fog = new THREE.FogExp2(0xf0e8de, 0.05);

  const hemi = new THREE.HemisphereLight(0xf0f7ff, 0x8fa8be, 0.85);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xe8f0f8, 0.45);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff4e6, 2.0);
  keyLight.position.set(2.5, 4, 2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.bias = -0.0002;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8ecae6, 1.1);
  fillLight.position.set(-2.5, 1.5, -1);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xa8c4e0, 0.75);
  rimLight.position.set(0, 1, -3);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0xe8913a, 0.35, 6);
  accentLight.position.set(1.2, 0.8, 1.5);
  scene.add(accentLight);

  const grid = new THREE.GridHelper(3.2, 24, 0x7a94aa, 0xa8bccf);
  grid.position.y = -0.555;
  grid.material.opacity = 0.45;
  grid.material.transparent = true;
  scene.add(grid);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.62, 0.04, 48),
    new THREE.MeshStandardMaterial({
      color: 0xc9bfb2,
      metalness: 0.35,
      roughness: 0.55,
    }),
  );
  platform.position.y = -0.57;
  platform.receiveShadow = true;
  scene.add(platform);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.62, 0.012, 8, 64),
    new THREE.MeshStandardMaterial({
      color: 0xe85d4c,
      metalness: 0.5,
      roughness: 0.4,
      emissive: 0xc44a3a,
      emissiveIntensity: 0.25,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.548;
  scene.add(ring);

  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(0.7, 48),
    new THREE.MeshBasicMaterial({ color: 0xe85d4c, transparent: true, opacity: 0.15 }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -0.547;
  scene.add(glow);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.05, 100);
  camera.position.set(0, 0.25, 2.4);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minPolarAngle = Math.PI * 0.25;
  controls.maxPolarAngle = Math.PI * 0.72;
  controls.target.set(0, 0.15, 0);

  const resize = () => {
    const w = Math.max(container.clientWidth, 1);
    const h = Math.max(container.clientHeight, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(container);
  resize();

  return {
    renderer,
    scene,
    camera,
    controls,
    headGroup: null,
    neckGroup: null,
    resize,
    dispose: () => {
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    },
  };
}

export function loadRobotModel(scene: THREE.Scene, viewer: ViewerScene): Promise<void> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        const model = gltf.scene;
        enhanceMaterials(model);

        const parts: { child: THREE.Mesh; scaledCenterY: number; name: string }[] = [];
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const box = new THREE.Box3().setFromObject(mesh);
            const center = new THREE.Vector3();
            box.getCenter(center);
            parts.push({ child: mesh, scaledCenterY: center.y, name: mesh.name });
          }
        });

        parts.sort((a, b) => a.name.localeCompare(b.name));

        const allBox = new THREE.Box3().setFromObject(model);
        const allCenter = new THREE.Vector3();
        allBox.getCenter(allCenter);
        const allSize = new THREE.Vector3();
        allBox.getSize(allSize);
        const scale = 1.0 / Math.max(allSize.x, allSize.y, allSize.z);

        model.scale.setScalar(scale);
        model.position.sub(allCenter.multiplyScalar(scale));

        parts.forEach((p) => {
          const box = new THREE.Box3().setFromObject(p.child);
          const center = new THREE.Vector3();
          box.getCenter(center);
          p.scaledCenterY = center.y;
        });

        scene.add(model);

        const headMeshes = parts
          .filter((p) => p.scaledCenterY > HEAD_Y_THRESHOLD)
          .map((p) => p.child);
        const neckMeshes = parts
          .filter(
            (p) =>
              p.scaledCenterY > NECK_Y_THRESHOLD && p.scaledCenterY <= HEAD_Y_THRESHOLD,
          )
          .map((p) => p.child);

        const neckGroup = new THREE.Group();
        neckGroup.name = 'NECK_PIVOT';
        const headGroup = new THREE.Group();
        headGroup.name = 'HEAD_PIVOT';

        scene.add(neckGroup);
        neckGroup.add(headGroup);

        let neckAvgY = 0.1;
        if (neckMeshes.length > 0) {
          const neckBox = new THREE.Box3();
          neckMeshes.forEach((m) => neckBox.expandByObject(m));
          const nc = new THREE.Vector3();
          neckBox.getCenter(nc);
          neckAvgY = nc.y;
        }

        let headPivotY = 0.2;
        if (headMeshes.length > 0) {
          const headBox = new THREE.Box3();
          headMeshes.forEach((m) => headBox.expandByObject(m));
          headPivotY = headBox.min.y;
        }

        neckGroup.position.set(0, neckAvgY, 0);
        headGroup.position.set(0, headPivotY - neckAvgY, 0);

        headMeshes.forEach((mesh) => headGroup.attach(mesh));
        neckMeshes.forEach((mesh) => neckGroup.attach(mesh));

        viewer.headGroup = headGroup;
        viewer.neckGroup = neckGroup;

        frameCamera(viewer.camera, viewer.controls, model);
        viewer.resize();
        resolve();
      },
      undefined,
      (err) => reject(err),
    );
  });
}