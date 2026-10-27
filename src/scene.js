import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

const SLABS = 5;
const ACCENT = new THREE.Color(0x2997ff);

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Titanium server-rack scene. One object, five layers (one per service group).
 * The page drives it by calling setPose({explode, ry, rx, x, y, s, o}) and setActive(i).
 */
export function createScene(canvas, { reducedMotion = false } = {}) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.2, 12);

  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6aa8ff, 1.2);
  rim.position.set(-5, 2, -4);
  scene.add(rim);

  const root = new THREE.Group();
  scene.add(root);
  const rack = new THREE.Group();
  root.add(rack);

  const bodyGeo = new RoundedBoxGeometry(3.0, 0.5, 1.9, 5, 0.07);
  const faceGeo = new RoundedBoxGeometry(2.84, 0.34, 0.04, 3, 0.015);
  const ledGeo = new THREE.BoxGeometry(0.06, 0.06, 0.03);
  const barGeo = new THREE.BoxGeometry(0.9, 0.035, 0.03);
  const ventGeo = new THREE.BoxGeometry(0.018, 0.2, 0.03);

  const metal = new THREE.MeshPhysicalMaterial({
    color: 0xaeb2b9,
    metalness: 1,
    roughness: 0.34,
    clearcoat: 0.25,
    clearcoatRoughness: 0.4,
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.6, roughness: 0.55 });

  const slabs = [];
  for (let i = 0; i < SLABS; i++) {
    const g = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, metal);
    g.add(body);

    const face = new THREE.Mesh(faceGeo, dark);
    face.position.z = 0.955;
    g.add(face);

    for (let v = 0; v < 18; v++) {
      const vent = new THREE.Mesh(ventGeo, metal);
      vent.position.set(0.15 + v * 0.045, 0, 0.975);
      g.add(vent);
    }

    // back panel: vents + ports so the rack reads as a real device from behind
    const back = new THREE.Mesh(faceGeo, dark);
    back.position.z = -0.955;
    g.add(back);
    for (let v = 0; v < 10; v++) {
      const vent = new THREE.Mesh(ventGeo, metal);
      vent.position.set(-1.1 + v * 0.045, 0, -0.975);
      g.add(vent);
    }
    for (let n = 0; n < 6; n++) {
      const port = new THREE.Mesh(ledGeo, dark);
      port.scale.set(1.6, 1.6, 1);
      port.position.set(0.1 + n * 0.17, 0, -0.978);
      g.add(port);
    }

    const ledMat = new THREE.MeshStandardMaterial({
      color: 0x111418,
      emissive: ACCENT,
      emissiveIntensity: 0.6,
      metalness: 0,
      roughness: 0.4,
    });
    for (let l = 0; l < 4; l++) {
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-1.28 + l * 0.12, 0.07, 0.98);
      g.add(led);
    }
    const bar = new THREE.Mesh(barGeo, ledMat);
    bar.position.set(-0.8, -0.07, 0.98);
    g.add(bar);

    rack.add(g);
    slabs.push({ group: g, ledMat, glow: 0.6, glowTarget: 0.6 });
  }

  // state: current (smoothed) vs target (driven by scroll)
  const cur = { explode: 0, ry: -0.7, rx: 0.28, x: 1.5, y: 0, s: 1, o: 1 };
  const tgt = { ...cur };
  let active = -1;
  let pointer = { x: 0, y: 0 };
  let w = 1, h = 1, narrow = false;
  let running = true;
  let t0 = performance.now();
  let last = t0;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    narrow = w < 820;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = narrow ? 15.5 : 12;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    last = performance.now();
    if (running) requestAnimationFrame(frame);
  });

  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);

    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const k = reducedMotion ? 1 : 1 - Math.exp(-dt * 6);

    for (const key in cur) cur[key] = lerp(cur[key], tgt[key], k);

    const time = (now - t0) / 1000;
    const idle = reducedMotion ? 0 : Math.sin(time * 0.5) * 0.05;
    const px = reducedMotion ? 0 : pointer.x * 0.12;
    const py = reducedMotion ? 0 : pointer.y * 0.06;

    root.position.set(narrow ? 0 : cur.x, cur.y + (narrow ? 2.4 : 0), 0);
    root.scale.setScalar(cur.s * (narrow ? 0.55 : 1));
    root.rotation.set(cur.rx + py, cur.ry + idle + px, 0);

    const spacing = lerp(0.62, 1.08, cur.explode);
    for (let i = 0; i < SLABS; i++) {
      const s = slabs[i];
      const centered = i - (SLABS - 1) / 2;
      s.group.position.y = -centered * spacing;
      s.group.position.x = Math.sin(centered * 1.1) * 0.22 * cur.explode;
      s.group.rotation.y = centered * 0.1 * cur.explode;

      s.glowTarget = i === active ? 6 : 0.45;
      s.glow = lerp(s.glow, s.glowTarget, k);
      const flicker = reducedMotion ? 0 : (Math.sin(time * 3 + i * 1.7) * 0.5 + 0.5) * 0.25;
      s.ledMat.emissiveIntensity = s.glow + flicker;
    }

    const alpha = THREE.MathUtils.clamp(cur.o * (narrow ? 0.55 : 1), 0, 1);
    canvas.style.opacity = alpha.toFixed(3);

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return {
    setPose(p) { Object.assign(tgt, p); },
    setActive(i) { active = i; },
    isNarrow: () => narrow,
  };
}
