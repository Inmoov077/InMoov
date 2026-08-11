import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import URDFLoader from 'urdf-loader';
import {
  applyRealisticInmoovMaterials,
  createFloorGrid,
  createStudioBackdrop,
  createWoodTable,
} from '@/lib/robotMaterials';
import { DEFAULT_HAND } from '@/lib/bodyConfig';
import { servoByKey } from '@/lib/servoConfig';
import {
  ELBOW_FLEX,
  EYES_PAN,
  EYES_TILT,
  FINGER,
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
  type JointGoalRange,
  servoToUrdfRad,
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

function restOf(key: string, fallback: number): number {
  const n = Number(servoByKey(key)?.rest);
  return Number.isFinite(n) ? n : fallback;
}

function restHand(): { thumb: number; index: number; middle: number; ring: number; pinky: number } {
  return {
    thumb: restOf('l_thumb', DEFAULT_HAND.thumb),
    index: restOf('l_index', DEFAULT_HAND.index),
    middle: restOf('l_middle', DEFAULT_HAND.middle),
    ring: restOf('l_ring', DEFAULT_HAND.ring),
    pinky: restOf('l_pinky', DEFAULT_HAND.pinky),
  };
}

/**
 * Perfect default / neutral pose.
 * Must match restPose.ts + bodyStore init so 3D hands/arms open at sides.
 */
export const DEFAULT_ANGLE_STATE: AngleState = {
  headPan: restOf('head_neck', 85),
  eye: restOf('head_eye', 90),
  jaw: restOf('head_jaw', 8),
  neckRot: restOf('neck_rot', 60),
  neckTilt: restOf('neck_tilt', 50),
  neckRoll: restOf('neck_roll', 120),
  leftArm: {
    shoulder: restOf('l_shoulder', 30),
    lift: restOf('l_lift', 15),
    rotate: restOf('l_rotate', 90),
    elbow: restOf('l_elbow', 0),
    wrist: restOf('l_wrist', 90),
  },
  rightArm: {
    shoulder: restOf('r_shoulder', 30),
    lift: restOf('r_lift', 10),
    rotate: restOf('r_rotate', 90),
    elbow: restOf('r_elbow', 10),
    wrist: restOf('r_wrist', 90),
  },
  leftHand: restHand(),
  rightHand: restHand(),
  leftLeg: {
    hip: restOf('l_hip', 90),
    thigh: restOf('l_thigh', 90),
    knee: restOf('l_knee', 15),
    ankle: restOf('l_ankle', 90),
    foot: restOf('l_foot', 90),
  },
  rightLeg: {
    hip: restOf('r_hip', 90),
    thigh: restOf('r_thigh', 90),
    knee: restOf('r_knee', 15),
    ankle: restOf('r_ankle', 90),
    foot: restOf('r_foot', 90),
  },
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

/**
 * Map UI/hardware servo ° → URDF joint radians for the 3D mesh.
 *
 * Critical design (InMoov / urdf-loader):
 * - Mesh rest pose = joint value 0 (how the URDF is authored)
 * - So we map rest-relative:  jointRad = goal(servo) − goal(rest)
 * - Use each servo's real min/max from config so elbow 10→80 uses the FULL
 *   visual bend (not a tiny slice of a fake 0–180 range)
 *
 * Result: default pose looks normal again, and moves still use full joint travel.
 */
function mapJoint(
  servoDeg: number,
  range: JointGoalRange,
  servoKey?: string,
  fallbackMin = 0,
  fallbackMax = 180,
  fallbackRest?: number,
): number {
  let sMin = fallbackMin;
  let sMax = fallbackMax;
  let sRest = fallbackRest ?? (fallbackMin + fallbackMax) / 2;
  if (servoKey) {
    const s = servoByKey(servoKey);
    if (s) {
      if (Number.isFinite(s.min)) sMin = Number(s.min);
      if (Number.isFinite(s.max)) sMax = Number(s.max);
      if (Number.isFinite(s.rest)) sRest = Number(s.rest);
    }
  }
  if (sMax <= sMin) {
    sMin = fallbackMin;
    sMax = fallbackMax;
  }
  // Rest always inside walls
  sRest = Math.min(sMax, Math.max(sMin, sRest));
  const v = Math.min(sMax, Math.max(sMin, Number(servoDeg)));
  const safeV = Number.isFinite(v) ? v : sRest;
  // Rest-relative absolute goals → 0 rad at rest, full span at min/max
  return (
    servoToUrdfRad(safeV, range, sMin, sMax) - servoToUrdfRad(sRest, range, sMin, sMax)
  );
}

/**
 * Drive every finger segment so open → fist is obvious in 3D.
 * Values are rest-relative (0 at open rest).
 */
function fingerChain(
  side: 'l' | 'r',
  finger: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky',
  servo: number,
  servoKey: string,
  range: JointGoalRange = FINGER,
): Record<string, number> {
  const base = mapJoint(servo, range, servoKey, 10, 130, 10);
  // Multi-segment curl — proximal / distal track the main joint
  const proximal = base * 0.92;
  const distal = base * 0.82;
  const tip = base * 0.7;
  const out: Record<string, number> = {
    [`${side}_${finger}_joint`]: base,
    [`${side}_${finger}1_joint`]: proximal,
  };
  if (finger === 'thumb') {
    out[`${side}_thumb3_joint`] = distal;
  } else {
    out[`${side}_${finger}3_joint`] = distal;
  }
  if (finger === 'ring' || finger === 'pinky') {
    out[`${side}_${finger}4_joint`] = tip;
  }
  return out;
}

function buildJointValues(angles: AngleState): Record<string, number> {
  const la = angles.leftArm ?? DEFAULT_ANGLE_STATE.leftArm;
  const ra = angles.rightArm ?? DEFAULT_ANGLE_STATE.rightArm;
  const lh = angles.leftHand ?? DEFAULT_ANGLE_STATE.leftHand;
  const rh = angles.rightHand ?? DEFAULT_ANGLE_STATE.rightHand;
  const ll = angles.leftLeg ?? DEFAULT_ANGLE_STATE.leftLeg;
  const rl = angles.rightLeg ?? DEFAULT_ANGLE_STATE.rightLeg;

  return {
    // Head / neck / waist — rest-relative, full config range
    head_pan_joint: mapJoint(angles.headPan, HEAD_PAN, 'head_neck', 0, 180, 85),
    eyes_tilt_joint: mapJoint(angles.eye, EYES_TILT, 'head_eye', 60, 120, 90),
    eyes_pan_joint: mapJoint(angles.eye, EYES_PAN, 'head_eye', 60, 120, 90),
    jaw_joint: mapJoint(angles.jaw, JAW, 'head_jaw', 0, 40, 8),
    waist_pan_joint: mapJoint(angles.neckRot, WAIST_PAN, 'neck_rot', 0, 180, 60),
    waist_roll_joint: mapJoint(angles.neckTilt, WAIST_ROLL, 'neck_tilt', 0, 180, 50),
    head_tilt_joint: mapJoint(angles.neckTilt, HEAD_TILT, 'neck_tilt', 0, 180, 50),
    head_roll_joint: mapJoint(angles.neckRoll, HEAD_ROLL, 'neck_roll', 60, 130, 120),

    // Left arm — rest-relative + real min/max = correct default + full travel
    l_shoulder_out_joint: mapJoint(la.shoulder, L_SHOULDER_OUT, 'l_shoulder', 30, 180, 30),
    l_shoulder_lift_joint: mapJoint(la.lift, SHOULDER_LIFT, 'l_lift', 15, 65, 15),
    l_upper_arm_roll_joint: mapJoint(la.rotate, L_UPPER_ARM_ROLL, 'l_rotate', 40, 180, 90),
    l_elbow_flex_joint: mapJoint(la.elbow, ELBOW_FLEX, 'l_elbow', 0, 52, 0),
    l_wrist_roll_joint: mapJoint(la.wrist, L_WRIST_ROLL, 'l_wrist', 10, 160, 90),

    // Right arm
    r_shoulder_out_joint: mapJoint(ra.shoulder, R_SHOULDER_OUT, 'r_shoulder', 30, 180, 30),
    r_shoulder_lift_joint: mapJoint(ra.lift, SHOULDER_LIFT, 'r_lift', 10, 70, 10),
    r_upper_arm_roll_joint: mapJoint(ra.rotate, R_UPPER_ARM_ROLL, 'r_rotate', 40, 180, 90),
    r_elbow_flex_joint: mapJoint(ra.elbow, ELBOW_FLEX, 'r_elbow', 10, 80, 10),
    r_wrist_roll_joint: mapJoint(ra.wrist, R_WRIST_ROLL, 'r_wrist', 10, 160, 90),

    // Hands — multi-segment curl (0 at open rest)
    ...fingerChain('l', 'thumb', lh.thumb, 'l_thumb', THUMB),
    ...fingerChain('l', 'index', lh.index, 'l_index'),
    ...fingerChain('l', 'middle', lh.middle, 'l_middle'),
    ...fingerChain('l', 'ring', lh.ring, 'l_ring'),
    ...fingerChain('l', 'pinky', lh.pinky, 'l_pinky'),
    ...fingerChain('r', 'thumb', rh.thumb, 'r_thumb', THUMB),
    ...fingerChain('r', 'index', rh.index, 'r_index'),
    ...fingerChain('r', 'middle', rh.middle, 'r_middle'),
    ...fingerChain('r', 'ring', rh.ring, 'r_ring'),
    ...fingerChain('r', 'pinky', rh.pinky, 'r_pinky'),

    // Legs
    l_hip_pan_joint: mapJoint(ll.hip, HIP_PAN, 'l_hip', 0, 180, 90),
    l_hip_lift_joint: mapJoint(ll.thigh, HIP_LIFT, 'l_thigh', 0, 180, 90),
    l_knee_joint: mapJoint(ll.knee, KNEE, 'l_knee', 0, 160, 15),
    l_ankle_joint: mapJoint(ll.ankle, ANKLE, 'l_ankle', 0, 180, 90),
    l_foot_roll_joint: mapJoint(ll.foot, FOOT_ROLL, 'l_foot', 0, 180, 90),
    r_hip_pan_joint: mapJoint(rl.hip, HIP_PAN, 'r_hip', 0, 180, 90),
    r_hip_lift_joint: mapJoint(rl.thigh, HIP_LIFT, 'r_thigh', 0, 180, 90),
    r_knee_joint: mapJoint(rl.knee, KNEE, 'r_knee', 0, 160, 15),
    r_ankle_joint: mapJoint(rl.ankle, ANKLE, 'r_ankle', 0, 180, 90),
    r_foot_roll_joint: mapJoint(rl.foot, FOOT_ROLL, 'r_foot', 0, 180, 90),
  };
}

function forceIgnoreLimits(urdf: UrdfRobot | undefined): void {
  if (!urdf?.joints) return;
  for (const joint of Object.values(urdf.joints)) {
    const j = joint as { ignoreLimits?: boolean };
    j.ignoreLimits = true;
  }
}

export function applyAngles(robot: RobotModel | null, angles: AngleState) {
  if (!robot) return;

  if (robot.kind === 'urdf') {
    const jointValues = buildJointValues(angles);
    const urdf = robot.urdf;
    forceIgnoreLimits(urdf);

    // Prefer batched setJointValues (official urdf-loader API)
    if (urdf?.setJointValues) {
      urdf.setJointValues(jointValues);
    } else if (urdf?.joints) {
      for (const [name, rad] of Object.entries(jointValues)) {
        const joint = urdf.joints[name] as
          | { setJointValue?: (v: number) => boolean; ignoreLimits?: boolean }
          | undefined;
        if (joint) {
          joint.ignoreLimits = true;
          if (joint.setJointValue) {
            joint.setJointValue(rad);
            continue;
          }
        }
        if (urdf.setJointValue) {
          urdf.setJointValue(name, rad);
        } else if (robot.setJoint) {
          robot.setJoint(name, rad);
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