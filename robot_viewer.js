/**
 * InMoov Robot 3D Viewer — robot_viewer.js
 * ==========================================
 * Loads the GLB model and provides a setAngles() API to animate
 * it in real-time based on servo commands from the dashboards.
 *
 * Architecture:
 *  - THREE.js + GLTFLoader via CDN (importmap)
 *  - The GLB uses generic part names (tripo_part_0..20) with no skeleton.
 *  - Parts are grouped by Y-position into:
 *       HEAD GROUP  (Y center > 0.19):  parts 2, 5, 8, 11, 17
 *       NECK GROUP  (Y center 0..0.19): parts 0, 1, 6, 9, 14, 19, 20
 *       BODY GROUP  (Y center < 0):     parts 3, 4, 7, 10, 12, 13, 15, 16, 18
 *
 * Servo → 3D mapping (90° = neutral/center):
 *   headPan   → headGroup.rotation.Y  (rotate whole head)
 *   eye       → (not separated in model, drives minor head tilt instead)
 *   jaw       → (not separated, drives small local tilt on top face part)
 *   neckRot   → neckGroup.rotation.Y  (neck rotation)
 *   neckTilt  → neckGroup.rotation.X  (nod forward/back)
 *   neckRoll  → neckGroup.rotation.Z  (side tilt)
 */

class RobotViewer {
  constructor(canvasId, modelUrl) {
    this.canvasId = canvasId;
    this.modelUrl = modelUrl || '/models/space%20suit%20character%203d%20model.glb';

    this.scene    = null;
    this.camera   = null;
    this.renderer = null;
    this.model    = null;
    this.ready    = false;
    this.animId   = null;

    // Grouped Three.js Object3D containers
    this.headGroup = null;
    this.neckGroup = null;
    this.bodyGroup = null;

    // Target angles (degrees, 90 = neutral)
    this.target = { headPan: 90, eye: 90, jaw: 90, neckRot: 90, neckTilt: 90, neckRoll: 90 };
    // Current (lerped) angles
    this.current = { headPan: 90, eye: 90, jaw: 90, neckRot: 90, neckTilt: 90, neckRoll: 90 };

    this.LERP = 0.08; // Smooth factor, matches Arduino easing

    this._init();
  }

  async _init() {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas) { console.error('[RobotViewer] Canvas not found:', this.canvasId); return; }

    // ─── Renderer ───────────────────────────────────────────────
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this._resize();
    window.addEventListener('resize', () => this._resize());

    // ─── Scene ──────────────────────────────────────────────────
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060a10);
    this.scene.fog = new THREE.Fog(0x060a10, 4, 14);

    // ─── Grid Floor ─────────────────────────────────────────────
    const grid = new THREE.GridHelper(4, 20, 0xe87b35, 0x1a2434);
    grid.position.y = -0.55;
    this.scene.add(grid);

    // ─── Lights ─────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0x99f6e4, 2.0);
    dirLight.position.set(2, 3, 2);
    dirLight.castShadow = true;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.4); // Cool cyan fill light
    fillLight.position.set(-2, 1, -1);
    this.scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfae8ff, 1.2); // Rich magenta rim light
    rimLight.position.set(0, -1, -3);
    this.scene.add(rimLight);

    // Ground glow
    const glowGeo = new THREE.CircleGeometry(0.8, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: 0x6366f1, transparent: true, opacity: 0.18 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = -0.549;
    this.scene.add(glow);

    // ─── Camera ─────────────────────────────────────────────────
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.camera.position.set(0, 0.3, 2.2);
    this.camera.lookAt(0, 0.1, 0);

    // ─── OrbitControls (optional mouse drag) ────────────────────
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enablePan = false;
      this.controls.minDistance = 1;
      this.controls.maxDistance = 5;
      this.controls.target.set(0, 0.2, 0);
      this.controls.update();
    }

    // ─── Load GLB ───────────────────────────────────────────────
    await this._loadModel();

    // ─── Start Loop ─────────────────────────────────────────────
    this._animate();
  }

  async _loadModel() {
    return new Promise((resolve, reject) => {
      const loader = new THREE.GLTFLoader();

      loader.load(
        this.modelUrl,
        (gltf) => {
          const model = gltf.scene;

          // ─── Analyse parts by vertical position ──────────────
          const HEAD_Y_THRESHOLD = 0.12;   // parts with centerY > this go into headGroup
          const NECK_Y_THRESHOLD = 0.02;  // parts with centerY > this (and <= HEAD) go into neckGroup

          // Create pivot groups
          this.bodyGroup = new THREE.Group();
          this.neckGroup = new THREE.Group();
          this.headGroup = new THREE.Group();

          // Log discovered parts
          console.group('[RobotViewer] GLB Part Analysis');

          const parts = [];
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;

              // Calculate world bounding box center
              const box = new THREE.Box3().setFromObject(child);
              const center = new THREE.Vector3();
              box.getCenter(center);
              parts.push({ child, centerY: center.y, name: child.name });
            }
          });

          // Sort by name for determinism
          parts.sort((a, b) => a.name.localeCompare(b.name));

          // Compute overall bounding box to normalise / scale
          const allBox = new THREE.Box3().setFromObject(model);
          const allCenter = new THREE.Vector3();
          allBox.getCenter(allCenter);
          const allSize = new THREE.Vector3();
          allBox.getSize(allSize);
          const scale = 1.0 / Math.max(allSize.x, allSize.y, allSize.z);

          // Scale and center the model
          model.scale.setScalar(scale);
          model.position.sub(allCenter.multiplyScalar(scale));

          // After scaling, re-measure parts
          parts.forEach(p => {
            const box = new THREE.Box3().setFromObject(p.child);
            const center = new THREE.Vector3();
            box.getCenter(center);
            p.scaledCenterY = center.y;
          });

          // Determine thresholds on scaled model
          const scaledHeadThreshold = HEAD_Y_THRESHOLD;
          const scaledNeckThreshold = NECK_Y_THRESHOLD;

          // Group assignment
          const headParts = [], neckParts = [], bodyParts = [];
          parts.forEach(p => {
            if (p.scaledCenterY > scaledHeadThreshold) {
              headParts.push(p.name);
            } else if (p.scaledCenterY > scaledNeckThreshold) {
              neckParts.push(p.name);
            } else {
              bodyParts.push(p.name);
            }
          });

          console.groupEnd();

          // Now add the model's children to groups
          // We need to clone/re-parent the mesh children
          // Actually easiest: add model to scene, then create wrapper groups

          this.scene.add(model);
          this.model = model;

          // Create pivot groups as empty objects positioned at group centers
          // HeadGroup pivot at top of neck, NeckGroup pivot at waist, BodyGroup at floor

          // Find centroid Y of head parts
          const headMeshes = parts.filter(p => p.scaledCenterY > scaledHeadThreshold).map(p => p.child);
          const neckMeshes = parts.filter(p => p.scaledCenterY > scaledNeckThreshold && p.scaledCenterY <= scaledHeadThreshold).map(p => p.child);

          // Head pivot
          this.headGroup = new THREE.Group();
          this.headGroup.name = 'HEAD_PIVOT';

          // Neck pivot
          this.neckGroup = new THREE.Group();
          this.neckGroup.name = 'NECK_PIVOT';

          // We'll add groups to scene and reparent meshes
          this.scene.add(this.neckGroup);
          this.neckGroup.add(this.headGroup);

          // Get neck pivot Y (average of neck part centers)
          let neckAvgY = 0.1;
          if (neckMeshes.length > 0) {
            const neckBox = new THREE.Box3();
            neckMeshes.forEach(m => neckBox.expandByObject(m));
            const nc = new THREE.Vector3();
            neckBox.getCenter(nc);
            neckAvgY = nc.y;
          }

          // Get head pivot Y (bottom of head parts)
          let headPivotY = 0.2;
          if (headMeshes.length > 0) {
            const headBox = new THREE.Box3();
            headMeshes.forEach(m => headBox.expandByObject(m));
            headPivotY = headBox.min.y; // pivot at bottom of head = neck joint
          }

          // Set pivot positions
          this.neckGroup.position.set(0, neckAvgY, 0);
          this.headGroup.position.set(0, headPivotY - neckAvgY, 0);

          // Reparent head meshes to headGroup, neck meshes to neckGroup
          headMeshes.forEach(mesh => {
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            mesh.getWorldPosition(worldPos);
            mesh.getWorldQuaternion(worldQuat);
            mesh.getWorldScale(worldScale);

            this.headGroup.attach(mesh);
          });

          neckMeshes.forEach(mesh => {
            this.neckGroup.attach(mesh);
          });

          this.ready = true;
          resolve();
        },
        undefined,
        (error) => {
          console.error('[RobotViewer] Error loading GLB:', error);
          reject(error);
        }
      );
    });
  }

  _resize() {
    const canvas = document.getElementById(this.canvasId);
    if (!canvas || !this.renderer) return;
    const parent = canvas.parentElement;
    const w = parent ? parent.clientWidth : canvas.clientWidth;
    const h = parent ? parent.clientHeight : canvas.clientHeight;
    this.renderer.setSize(w, h, false);
    if (this.camera) {
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }
  }

  /**
   * Set target servo angles (degrees, 90 = center/neutral).
   * Call this whenever a slider changes.
   */
  setAngles(headPan, eye, jaw, neckRot, neckTilt, neckRoll) {
    this.target.headPan  = headPan  ?? 90;
    this.target.eye      = eye      ?? 90;
    this.target.jaw      = jaw      ?? 90;
    this.target.neckRot  = neckRot  ?? 90;
    this.target.neckTilt = neckTilt ?? 90;
    this.target.neckRoll = neckRoll ?? 90;
  }

  _lerp(a, b, t) { return a + (b - a) * t; }

  _toRad(deg) { return deg * (Math.PI / 180); }

  _animate() {
    this.animId = requestAnimationFrame(() => this._animate());

    // Lerp current toward target (smooth easing)
    const L = this.LERP;
    for (const key of Object.keys(this.current)) {
      this.current[key] = this._lerp(this.current[key], this.target[key], L);
    }

    if (this.ready) {
      // Map servo angles (90=neutral) to radians
      const headPanRad  = this._toRad(this.current.headPan  - 90);
      const eyeRad      = this._toRad(this.current.eye      - 90);
      const jawRad      = this._toRad(this.current.jaw       - 90);
      const neckRotRad  = this._toRad(this.current.neckRot  - 90);
      const neckTiltRad = this._toRad(this.current.neckTilt - 90);
      const neckRollRad = this._toRad(this.current.neckRoll - 90);

      // Apply to groups
      if (this.headGroup) {
        this.headGroup.rotation.y = -headPanRad;   // pan left/right
        this.headGroup.rotation.x = eyeRad * 0.3;  // eye drives slight head tilt
      }

      if (this.neckGroup) {
        this.neckGroup.rotation.y = -neckRotRad;   // neck pan
        this.neckGroup.rotation.x = neckTiltRad;   // neck nod
        this.neckGroup.rotation.z = -neckRollRad;  // neck roll
      }
    }

    if (this.controls) this.controls.update();
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.renderer) this.renderer.dispose();
  }
}

// Export for global use
window.RobotViewer = RobotViewer;
