import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
const cache = new Map();

function load(name) {
  if (!cache.has(name)) {
    cache.set(name, new Promise((resolve) => {
      loader.load(`/models/${name}.glb`, (g) => resolve(g.scene), undefined, () => resolve(null));
    }));
  }
  return cache.get(name);
}

/**
 * A real 3D model, centred and scaled so its longest side equals `size`.
 * Returns a Group straight away; the model appears inside it once loaded.
 *   rot   – rotation applied to the raw model before measuring
 *   drop  – node names to remove (e.g. a floor plane that ships with the model)
 *   prep  – (rawScene) => void, run before measuring (add overlays in model units)
 *   onLoad – (group) => void
 */
export function asset(name, { size = 1, rot = [0, 0, 0], drop = [], prep, onLoad, ownMaterials = false } = {}) {
  const wrap = new THREE.Group();
  load(name).then((src) => {
    if (!src) return;
    const obj = src.clone(true);
    if (ownMaterials) obj.traverse((o) => { if (o.material) o.material = o.material.clone(); });
    drop.forEach((n) => { const t = obj.getObjectByName(n); if (t) t.removeFromParent(); });
    if (prep) prep(obj);
    const spin = new THREE.Group();
    spin.rotation.set(...rot);
    spin.add(obj);
    const holder = new THREE.Group();
    holder.add(spin);
    holder.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(holder);
    const c = box.getCenter(new THREE.Vector3());
    const s = box.getSize(new THREE.Vector3());
    spin.position.sub(c);
    holder.scale.setScalar(size / Math.max(s.x, s.y, s.z));
    wrap.add(holder);
    wrap.userData.size = s.clone().multiplyScalar(holder.scale.x);
    onLoad?.(wrap);
  });
  return wrap;
}
