import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const loader = new STLLoader();
const meshes = ['l_hand.stl', 'leg_hip.stl', 'mid_stomach.stl'];

for (const name of meshes) {
  const path = join(ROOT, 'models', 'inmoov', 'meshes', name);
  if (!existsSync(path)) {
    console.log('MISSING', name);
    continue;
  }
  try {
    const buf = readFileSync(path);
    const geo = loader.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    geo.computeBoundingBox();
    const sz = new THREE.Vector3();
    geo.boundingBox.getSize(sz);
    console.log('OK', name, 'verts', geo.attributes.position.count, 'size', sz.toArray().map((v) => v.toFixed(1)).join('x'));
  } catch (e) {
    console.log('FAIL', name, e.message);
  }
}