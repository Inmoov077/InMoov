import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import URDFLoader from 'urdf-loader';

export const URDF_URL = '/models/inmoov/inmoov.urdf';
export const MESH_PACKAGE = '/models/inmoov';
export const FALLBACK_MODEL_URL = '/models/space%20suit%20character%203d%20model.glb';

export const LERP = 0.1;

export interface AngleState {
  headPan: number;
  eye: number;
  jaw: number;
  neckRot: number;
  neckTilt: number;
  neckRoll: number;
}

export interface RobotModel {
  kind: 'urdf' | 'glb';
  root: THREE.Object3D;
  setJoint?: (name: string, radians: number) => void;
  headGroup: THREE.Object3D | null;
  neckGroup: THREE.Object3D | null;
}

export interface ViewerScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  headGroup: THREE.Object3D | null;
  neckGroup: THREE.Object3D | null;
  robot: RobotModel | null;
  resize: () => void;
  dispose: () => void;
}

function toRad(deg: number) {
  return deg * (Math.PI / 180);
}

function servoToRad(value: number, neutral = 90) {
  return toRad(value - neutral);
}

export function lerpAngles(current: AngleState, target: AngleState, t: number): AngleState {
  const out = { ...current };
  for (const key of Object.keys(out) as (keyof AngleState)[]) {
    out[key] = current[key] + (target[key] - current[key]) * t;
  }
  return out;
}

export function applyAngles(robot: RobotModel | null, angles: AngleState) {
  if (!robot) return;

  if (robot.kind === 'urdf' && robot.setJoint) {
    robot.setJoint('head_pan_joint', -servoToRad(angles.headPan));
    robot.setJoint('eyes_tilt_joint', servoToRad(angles.eye));
    robot.setJoint('eyes_pan_joint', servoToRad(angles.eye) * 0.35);
    robot.setJoint('jaw_joint', servoToRad(angles.jaw, 8));
    robot.setJoint('waist_pan_joint', -servoToRad(angles.neckRot));
    robot.setJoint('head_tilt_joint', servoToRad(angles.neckTilt));
    robot.setJoint('head_roll_joint', -servoToRad(angles.neckRoll));
    return;
  }

  const { headGroup, neckGroup } = robot;
  const headPanRad = servoToRad(angles.headPan);
  const eyeRad = servoToRad(angles.eye);
  const jawRad = servoToRad(angles.jaw, 8);
  const neckRotRad = servoToRad(angles.neckRot);
  const neckTiltRad = servoToRad(angles.neckTilt);
  const neckRollRad = servoToRad(angles.neckRoll);

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

function robotBounds(object: THREE.Object3D) {
  const box = new THREE.Box3();
  let hasVisual = false;
  object.traverse((child) => {
    const visual = child as THREE.Object3D & { isURDFVisual?: boolean };
    if (visual.isURDFVisual) {
      box.expandByObject(visual);
      hasVisual = true;
    }
  });
  if (!hasVisual) box.setFromObject(object);
  return box;
}

function frameCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
  padding = 2.15,
) {
  object.updateMatrixWorld(true);
  const box = robotBounds(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);

  const maxDim = Math.max(size.x, size.y, size.z, 0.5);
  const fov = camera.fov * (Math.PI / 180);
  let dist = maxDim / (2 * Math.tan(fov / 2));
  dist *= padding;

  camera.position.set(center.x + dist * 0.22, center.y + size.y * 0.04, center.z + dist * 0.92);
  camera.near = Math.max(0.01, dist / 100);
  camera.far = dist * 40;
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.minDistance = dist * 0.35;
  controls.maxDistance = dist * 4;
  controls.update();
}

function groundRobot(object: THREE.Object3D, floorY = 0) {
  object.updateMatrixWorld(true);
  const box = robotBounds(object);
  if (box.isEmpty()) return;
  object.position.y += floorY - box.min.y;
  object.updateMatrixWorld(true);
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
  scene.fog = new THREE.FogExp2(0xf0e8de, 0.018);

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

  const accentLight = new THREE.PointLight(0xe8913a, 0.35, 8);
  accentLight.position.set(1.2, 0.8, 1.5);
  scene.add(accentLight);

  const grid = new THREE.GridHelper(4.5, 28, 0x7a94aa, 0xa8bccf);
  grid.position.y = -0.02;
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  scene.add(grid);

  const platform = new THREE.Mesh(
    new THREE.CylinderGeometry(0.7, 0.78, 0.04, 48),
    new THREE.MeshStandardMaterial({
      color: 0xc9bfb2,
      metalness: 0.35,
      roughness: 0.55,
    }),
  );
  platform.position.y = -0.04;
  platform.receiveShadow = true;
  scene.add(platform);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.012, 8, 64),
    new THREE.MeshStandardMaterial({
      color: 0xe85d4c,
      metalness: 0.5,
      roughness: 0.4,
      emissive: 0xc44a3a,
      emissiveIntensity: 0.25,
    }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.018;
  scene.add(ring);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 300);
  camera.position.set(1.2, 1.05, 2.6);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = true;
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.minPolarAngle = Math.PI * 0.12;
  controls.maxPolarAngle = Math.PI * 0.88;
  controls.target.set(0, 0.85, 0);

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
    robot: null,
    resize,
    dispose: () => {
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
    },
  };
}

function loadUrdfRobot(scene: THREE.Scene, viewer: ViewerScene): Promise<RobotModel> {
  return new Promise((resolve, reject) => {
    const world = new THREE.Group();
    world.name = 'INMOOV_WORLD';
    world.rotation.x = -Math.PI / 2;
    scene.add(world);

    let robot: THREE.Object3D | null = null;
    const manager = new THREE.LoadingManager();

    manager.onLoad = () => {
      if (!robot) return;
      enhanceMaterials(robot);
      groundRobot(world, 0);
      frameCamera(viewer.camera, viewer.controls, world);
      viewer.resize();

      const urdfRobot = robot as THREE.Object3D & {
        joints?: Record<string, { setJointValue: (v: number) => void }>;
      };

      resolve({
        kind: 'urdf',
        root: world,
        setJoint: (name, radians) => {
          urdfRobot.joints?.[name]?.setJointValue(radians);
        },
        headGroup: robot.getObjectByName('head_link') ?? null,
        neckGroup: robot.getObjectByName('head_tilt_link') ?? null,
      });
    };

    manager.onError = (url) => {
      console.error('[RobotViewer] mesh load failed:', url);
    };

    const loader = new URDFLoader(manager);
    loader.packages = { inmoov_meshes: MESH_PACKAGE };
    loader.load(
      URDF_URL,
      (model) => {
        robot = model;
        world.add(model);
      },
      undefined,
      reject,
    );
  });
}

const HEAD_Y_THRESHOLD = 0.12;
const NECK_Y_THRESHOLD = 0.02;

function loadGlbRobot(scene: THREE.Scene): Promise<RobotModel> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      FALLBACK_MODEL_URL,
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

        resolve({
          kind: 'glb',
          root: model,
          headGroup,
          neckGroup,
        });
      },
      undefined,
      reject,
    );
  });
}

export function loadRobotModel(scene: THREE.Scene, viewer: ViewerScene): Promise<void> {
  return loadUrdfRobot(scene, viewer)
    .catch((err) => {
      console.warn('[RobotViewer] URDF failed, using fallback GLB:', err);
      return loadGlbRobot(scene);
    })
    .then((robot) => {
      viewer.robot = robot;
      viewer.headGroup = robot.headGroup;
      viewer.neckGroup = robot.neckGroup;
      if (robot.kind === 'glb') {
        frameCamera(viewer.camera, viewer.controls, robot.root);
        viewer.resize();
      }
    });
}