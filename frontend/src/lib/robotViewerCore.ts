import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import URDFLoader from 'urdf-loader';
import {
  applyRealisticInmoovMaterials,
  createFloorGrid,
  createStudioBackdrop,
  createWoodTable,
} from '@/lib/robotMaterials';
import { DEFAULT_ARM, DEFAULT_HAND, DEFAULT_LEG } from '@/lib/bodyConfig';
import {
  ELBOW_FLEX,
  EYES_PAN,
  EYES_TILT,
  HEAD_PAN,
  HEAD_ROLL,
  HEAD_TILT,
  JAW,
  L_SHOULDER_OUT,
  L_UPPER_ARM_ROLL,
  L_WRIST_ROLL,
  R_SHOULDER_OUT,
  R_UPPER_ARM_ROLL,
  R_WRIST_ROLL,
  SHOULDER_LIFT,
  THUMB,
  WAIST_PAN,
  WAIST_ROLL,
  HIP_PAN,
  HIP_LIFT,
  KNEE,
  ANKLE,
  FOOT_ROLL,
  fingerServoToRad,
  servoToJointRad,
} from '@/lib/inmoovJointMap';

/** Compiled from MyRobotLab/inmoov_ros xacro + procedural legs */
export const URDF_URL = '/models/inmoov/inmoov_full.urdf';
export const URDF_FALLBACK_URL = '/models/inmoov/inmoov_official.urdf';
export const MESH_PACKAGE = '/models/inmoov';
/** Frame lerp — higher = snappier live preview while dragging sliders */
export const LERP = 0.28;
/** Immediate blend when store changes (before next animation frame) */
export const STORE_SNAP_LERP = 0.55;

export interface CameraViewPreset {
  id: string;
  label: string;
  /** Orbit offset as fractions of fitted distance from robot center */
  offset: [number, number, number];
  targetLift?: number;
  padding?: number;
}

export const CAMERA_VIEWS: CameraViewPreset[] = [
  { id: 'full', label: 'Full body', offset: [0.18, 0.08, 0.95], padding: 2.05, targetLift: 0.08 },
  { id: 'front', label: 'Front', offset: [0.0, 0.1, 1.08], padding: 1.95, targetLift: 0.06 },
  { id: 'back', label: 'Back', offset: [0.0, 0.1, -1.08], padding: 1.95, targetLift: 0.06 },
  { id: 'left', label: 'Left', offset: [-1.08, 0.08, 0.05], padding: 1.95, targetLift: 0.05 },
  { id: 'right', label: 'Right', offset: [1.08, 0.08, 0.05], padding: 1.95, targetLift: 0.05 },
  { id: 'head', label: 'Head', offset: [0.12, 0.38, 0.52], targetLift: 0.42, padding: 1.25 },
  { id: 'hands', label: 'Hands', offset: [0.32, -0.12, 0.62], targetLift: -0.05, padding: 1.4 },
  { id: 'legs', label: 'Legs', offset: [0.15, -0.48, 0.72], targetLift: -0.38, padding: 1.55 },
  { id: 'top', label: 'Top', offset: [0.05, 1.15, 0.12], targetLift: 0.0, padding: 2.1 },
];

export interface AngleState {
  headPan: number;
  eye: number;
  jaw: number;
  neckRot: number;
  neckTilt: number;
  neckRoll: number;
  leftArm: { shoulder: number; lift: number; rotate: number; elbow: number; wrist: number };
  rightArm: { shoulder: number; lift: number; rotate: number; elbow: number; wrist: number };
  leftHand: { thumb: number; index: number; middle: number; ring: number; pinky: number };
  rightHand: { thumb: number; index: number; middle: number; ring: number; pinky: number };
  leftLeg: { hip: number; thigh: number; knee: number; ankle: number; foot: number };
  rightLeg: { hip: number; thigh: number; knee: number; ankle: number; foot: number };
}

/** Rest pose — matches bodyStore + servoStore defaults (0 rad on every URDF joint). */
export const DEFAULT_ANGLE_STATE: AngleState = {
  headPan: 85,
  eye: 90,
  jaw: 8,
  neckRot: 60,
  neckTilt: 50,
  neckRoll: 120,
  leftArm: { ...DEFAULT_ARM },
  rightArm: { ...DEFAULT_ARM },
  leftHand: { ...DEFAULT_HAND },
  rightHand: { ...DEFAULT_HAND },
  leftLeg: { ...DEFAULT_LEG },
  rightLeg: { ...DEFAULT_LEG },
};

export type UrdfRobot = THREE.Object3D & {
  joints?: Record<string, { setJointValue: (v: number) => boolean }>;
  setJointValue?: (name: string, ...angle: number[]) => boolean;
  setJointValues?: (values: Record<string, number>) => boolean;
  updateMatrixWorld: (force?: boolean) => void;
};

export interface RobotModel {
  kind: 'urdf' | 'glb';
  root: THREE.Object3D;
  urdf?: UrdfRobot;
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

function lerpGroup<T extends Record<string, number>>(current: T, target: T, t: number): T {
  const out = { ...current } as T;
  for (const key of Object.keys(out) as (keyof T & string)[]) {
    out[key] = (current[key] + (target[key] - current[key]) * t) as T[keyof T & string];
  }
  return out;
}

export function lerpAngles(current: AngleState, target: AngleState, t: number): AngleState {
  return {
    headPan: current.headPan + (target.headPan - current.headPan) * t,
    eye: current.eye + (target.eye - current.eye) * t,
    jaw: current.jaw + (target.jaw - current.jaw) * t,
    neckRot: current.neckRot + (target.neckRot - current.neckRot) * t,
    neckTilt: current.neckTilt + (target.neckTilt - current.neckTilt) * t,
    neckRoll: current.neckRoll + (target.neckRoll - current.neckRoll) * t,
    leftArm: lerpGroup(current.leftArm, target.leftArm, t),
    rightArm: lerpGroup(current.rightArm, target.rightArm, t),
    leftHand: lerpGroup(current.leftHand, target.leftHand, t),
    rightHand: lerpGroup(current.rightHand, target.rightHand, t),
    leftLeg: lerpGroup(current.leftLeg, target.leftLeg, t),
    rightLeg: lerpGroup(current.rightLeg, target.rightLeg, t),
  };
}

const REST = DEFAULT_ANGLE_STATE;

/** Map slider → joint rad relative to default pose (aligned at rest). */
function j(
  servo: number,
  range: Parameters<typeof servoToJointRad>[1],
  rest: number,
  servoMin = 0,
  servoMax = 180,
) {
  return servoToJointRad(servo, range, rest, servoMin, servoMax);
}

function buildJointValues(angles: AngleState): Record<string, number> {
  const la = angles.leftArm;
  const ra = angles.rightArm;
  const lh = angles.leftHand;
  const rh = angles.rightHand;
  const ll = angles.leftLeg;
  const rl = angles.rightLeg;
  return {
    head_pan_joint: j(angles.headPan, HEAD_PAN, REST.headPan),
    eyes_tilt_joint: j(angles.eye, EYES_TILT, REST.eye),
    eyes_pan_joint: j(angles.eye, EYES_PAN, REST.eye),
    jaw_joint: j(angles.jaw, JAW, REST.jaw, 0, 40),
    waist_pan_joint: j(angles.neckRot, WAIST_PAN, REST.neckRot),
    waist_roll_joint: j(angles.neckTilt, WAIST_ROLL, REST.neckTilt),
    head_tilt_joint: j(angles.neckTilt, HEAD_TILT, REST.neckTilt),
    head_roll_joint: j(angles.neckRoll, HEAD_ROLL, REST.neckRoll),
    l_shoulder_out_joint: j(la.shoulder, L_SHOULDER_OUT, REST.leftArm.shoulder),
    l_shoulder_lift_joint: j(la.lift, SHOULDER_LIFT, REST.leftArm.lift),
    l_upper_arm_roll_joint: j(la.rotate, L_UPPER_ARM_ROLL, REST.leftArm.rotate),
    l_elbow_flex_joint: j(la.elbow, ELBOW_FLEX, REST.leftArm.elbow),
    l_wrist_roll_joint: j(la.wrist, L_WRIST_ROLL, REST.leftArm.wrist),
    r_shoulder_out_joint: j(ra.shoulder, R_SHOULDER_OUT, REST.rightArm.shoulder),
    r_shoulder_lift_joint: j(ra.lift, SHOULDER_LIFT, REST.rightArm.lift),
    r_upper_arm_roll_joint: j(ra.rotate, R_UPPER_ARM_ROLL, REST.rightArm.rotate),
    r_elbow_flex_joint: j(ra.elbow, ELBOW_FLEX, REST.rightArm.elbow),
    r_wrist_roll_joint: j(ra.wrist, R_WRIST_ROLL, REST.rightArm.wrist),
    l_thumb_joint: fingerServoToRad(lh.thumb, THUMB, REST.leftHand.thumb),
    l_index_joint: fingerServoToRad(lh.index, undefined, REST.leftHand.index),
    l_middle_joint: fingerServoToRad(lh.middle, undefined, REST.leftHand.middle),
    l_ring_joint: fingerServoToRad(lh.ring, undefined, REST.leftHand.ring),
    l_pinky_joint: fingerServoToRad(lh.pinky, undefined, REST.leftHand.pinky),
    r_thumb_joint: fingerServoToRad(rh.thumb, THUMB, REST.rightHand.thumb),
    r_index_joint: fingerServoToRad(rh.index, undefined, REST.rightHand.index),
    r_middle_joint: fingerServoToRad(rh.middle, undefined, REST.rightHand.middle),
    r_ring_joint: fingerServoToRad(rh.ring, undefined, REST.rightHand.ring),
    r_pinky_joint: fingerServoToRad(rh.pinky, undefined, REST.rightHand.pinky),
    l_hip_pan_joint: j(ll.hip, HIP_PAN, REST.leftLeg.hip),
    l_hip_lift_joint: j(ll.thigh, HIP_LIFT, REST.leftLeg.thigh),
    l_knee_joint: j(ll.knee, KNEE, REST.leftLeg.knee, 0, 160),
    l_ankle_joint: j(ll.ankle, ANKLE, REST.leftLeg.ankle),
    l_foot_roll_joint: j(ll.foot, FOOT_ROLL, REST.leftLeg.foot),
    r_hip_pan_joint: j(rl.hip, HIP_PAN, REST.rightLeg.hip),
    r_hip_lift_joint: j(rl.thigh, HIP_LIFT, REST.rightLeg.thigh),
    r_knee_joint: j(rl.knee, KNEE, REST.rightLeg.knee, 0, 160),
    r_ankle_joint: j(rl.ankle, ANKLE, REST.rightLeg.ankle),
    r_foot_roll_joint: j(rl.foot, FOOT_ROLL, REST.rightLeg.foot),
  };
}

export function applyAngles(robot: RobotModel | null, angles: AngleState) {
  if (!robot) return;

  if (robot.kind === 'urdf') {
    const jointValues = buildJointValues(angles);
    const urdf = robot.urdf;
    if (urdf?.joints) {
      for (const [name, rad] of Object.entries(jointValues)) {
        const joint = urdf.joints[name] as { setJointValue?: (v: number) => boolean } | undefined;
        if (joint?.setJointValue) {
          joint.setJointValue(rad);
        } else if (urdf.setJointValue) {
          urdf.setJointValue(name, rad);
        }
      }
    } else if (robot.setJoint) {
      for (const [name, rad] of Object.entries(jointValues)) robot.setJoint(name, rad);
    } else {
      return;
    }
    urdf?.updateMatrixWorld?.(true);
    robot.root.updateMatrixWorld(true);
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
  applyRealisticInmoovMaterials(object);
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

export interface FrameMetrics {
  center: THREE.Vector3;
  size: THREE.Vector3;
  distance: number;
}

export function computeFrameMetrics(
  object: THREE.Object3D,
  cameraFov = 32,
  padding = 2.15,
): FrameMetrics {
  object.updateMatrixWorld(true);
  const box = robotBounds(object);
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box.getSize(size);
  box.getCenter(center);
  const maxDim = Math.max(size.x, size.y, size.z, 0.5);
  const fovRad = cameraFov * (Math.PI / 180);
  let distance = maxDim / (2 * Math.tan(fovRad / 2));
  distance *= padding;
  return { center, size, distance };
}

function frameCamera(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
  padding = 2.15,
  preset?: CameraViewPreset,
) {
  const { center, size, distance } = computeFrameMetrics(
    object,
    camera.fov,
    preset?.padding ?? padding,
  );
  const lift = preset?.targetLift ?? 0;
  const target = center.clone();
  target.y += size.y * lift;

  const off = preset?.offset ?? [0.22, 0.04, 0.92];
  camera.position.set(
    target.x + distance * off[0],
    target.y + distance * off[1],
    target.z + distance * off[2],
  );
  camera.near = Math.max(0.01, distance / 100);
  camera.far = distance * 40;
  camera.updateProjectionMatrix();

  controls.target.copy(target);
  controls.minDistance = distance * 0.25;
  controls.maxDistance = distance * 5;
  controls.update();
}

export function applyCameraView(
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls,
  object: THREE.Object3D,
  viewId: string,
) {
  const preset = CAMERA_VIEWS.find((v) => v.id === viewId) ?? CAMERA_VIEWS[0];
  frameCamera(camera, controls, object, preset.padding, preset);
}

function groundRobot(object: THREE.Object3D, floorY = 0) {
  object.updateMatrixWorld(true);
  const box = robotBounds(object);
  if (box.isEmpty()) return;
  object.position.y += floorY - box.min.y;
  object.updateMatrixWorld(true);
}

/** Center robot on X/Z so orbit target stays on the body. */
function centerRobotXZ(object: THREE.Object3D) {
  object.updateMatrixWorld(true);
  const box = robotBounds(object);
  if (box.isEmpty()) return;
  const center = new THREE.Vector3();
  box.getCenter(center);
  object.position.x -= center.x;
  object.position.z -= center.z;
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

  // Studio look — white wall + warm key light (matches inmoov.fr gallery photos)
  scene.background = new THREE.Color(0xf2f2f2);
  scene.fog = new THREE.FogExp2(0xf2f2f2, 0.012);

  scene.add(createStudioBackdrop());

  const hemi = new THREE.HemisphereLight(0xffffff, 0xc8c0b8, 1.0);
  scene.add(hemi);

  const ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.4);
  keyLight.position.set(1.8, 3.5, 2.2);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.bias = -0.0003;
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 12;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xe8eef8, 0.9);
  fillLight.position.set(-2.2, 2, 1.2);
  scene.add(fillLight);

  const backLight = new THREE.DirectionalLight(0xffffff, 0.45);
  backLight.position.set(0, 2, -2.5);
  scene.add(backLight);

  scene.add(createFloorGrid(3.2, 28));

  const table = createWoodTable(2.8, 2.0);
  scene.add(table);

  const axes = new THREE.AxesHelper(0.4);
  axes.position.set(-1.35, 0.02, -1.35);
  scene.add(axes);

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

function removeRobotWorld(scene: THREE.Scene) {
  const old = scene.getObjectByName('INMOOV_WORLD');
  if (old) scene.remove(old);
}

function countMeshes(root: THREE.Object3D) {
  let n = 0;
  root.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) n += 1;
  });
  return n;
}

function loadUrdfFrom(url: string, scene: THREE.Scene, viewer: ViewerScene): Promise<RobotModel> {
  return new Promise((resolve, reject) => {
    removeRobotWorld(scene);

    const world = new THREE.Group();
    world.name = 'INMOOV_WORLD';
    // ROS Z-up → Three.js Y-up (same as official urdf-viewer)
    world.rotation.x = -Math.PI / 2;
    scene.add(world);

    let robot: THREE.Object3D | null = null;
    let meshErrors = 0;
    const failedUrls: string[] = [];
    const manager = new THREE.LoadingManager();
    manager.onLoad = () => {
      if (!robot) {
        scene.remove(world);
        reject(new Error('URDF parsed but robot is null'));
        return;
      }
      const meshCount = countMeshes(robot);
      if (meshCount < 10) {
        scene.remove(world);
        reject(
          new Error(
            `Only ${meshCount} mesh(es) loaded${meshErrors ? ` (${meshErrors} failed)` : ''}. Check /models/ paths.`,
          ),
        );
        return;
      }
      if (meshErrors > 0) {
        console.warn(`[RobotViewer] ${meshErrors} mesh(s) failed:`, failedUrls.slice(0, 5));
      }
      enhanceMaterials(robot);
      centerRobotXZ(world);
      groundRobot(world, 0.02);
      frameCamera(viewer.camera, viewer.controls, world, 2.05, CAMERA_VIEWS[0]);
      viewer.resize();
      const urdfRobot = robot as UrdfRobot;
      for (const joint of Object.values(urdfRobot.joints ?? {})) {
        (joint as { ignoreLimits?: boolean }).ignoreLimits = true;
      }
      const warnedJoints = new Set<string>();
      const model: RobotModel = {
        kind: 'urdf',
        root: world,
        urdf: urdfRobot,
        setJoint: (name, radians) => {
          if (!urdfRobot.joints?.[name]) {
            if (!warnedJoints.has(name)) {
              warnedJoints.add(name);
              console.warn(`[RobotViewer] URDF joint not found: ${name}`);
            }
            return;
          }
          if (urdfRobot.setJointValue) {
            urdfRobot.setJointValue(name, radians);
          } else {
            urdfRobot.joints[name].setJointValue(radians);
          }
        },
        headGroup: robot.getObjectByName('head_link') ?? null,
        neckGroup: robot.getObjectByName('head_tilt_link') ?? null,
      };
      applyAngles(model, DEFAULT_ANGLE_STATE);
      console.info(`[RobotViewer] Loaded ${url} — ${meshCount} meshes, ${Object.keys(urdfRobot.joints ?? {}).length} joints`);
      resolve(model);
    };
    manager.onError = (u) => {
      meshErrors += 1;
      failedUrls.push(String(u));
      console.error('[RobotViewer] mesh load failed:', u);
    };
    const loader = new URDFLoader(manager);
    loader.packages = { inmoov_meshes: MESH_PACKAGE };
    loader.load(
      url,
      (model) => {
        robot = model;
        world.add(model);
      },
      undefined,
      (err) => {
        scene.remove(world);
        reject(err instanceof Error ? err : new Error(String(err)));
      },
    );
  });
}

export function loadRobotModel(scene: THREE.Scene, viewer: ViewerScene): Promise<void> {
  return loadUrdfFrom(URDF_URL, scene, viewer)
    .catch((err) => {
      console.warn('[RobotViewer] Full URDF failed, trying official upper-body:', err);
      return loadUrdfFrom(URDF_FALLBACK_URL, scene, viewer);
    })
    .then((robot) => {
      viewer.robot = robot;
      viewer.headGroup = robot.headGroup;
      viewer.neckGroup = robot.neckGroup;
    });
}