import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildProps } from './props.js';
import { buildLaptop } from './hero.js';
import { createBgCables } from './bgcables.js';

const RIMS = [0x2997ff, 0x8b5cf6, 0xff4fa3, 0x2de2a6].map((c) => new THREE.Color(c));
const CHAPTER_RIM = [0x8b5cf6, 0x2de2a6, 0x2997ff, 0xff6b5e, 0xff4fa3, 0xb18cff, 0xffb020].map((c) => new THREE.Color(c));

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

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

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
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
  const hero = buildLaptop();
  root.add(hero.group);
  const bg = createBgCables();
  scene.add(bg.group);
  const rimTmp = new THREE.Color();

  // service props: assemble / disassemble on scroll
  const props = buildProps();
  const propsGroup = new THREE.Group();
  scene.add(propsGroup);
  props.forEach((p) => { propsGroup.add(p.group); p.group.visible = false; });
  const N = props.length;
  const svc = { cur: -1, tgt: -1, flip: 1 };
  let pulse = 0;

  // state: current (smoothed) vs target (driven by scroll)
  const cur = { explode: 0, ry: -0.7, rx: 0.28, x: 1.5, y: 0, s: 1, o: 1, h: 1 };
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, narrow ? 1.25 : 1.5));
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

    svc.cur = lerp(svc.cur, svc.tgt, reducedMotion ? 1 : 1 - Math.exp(-dt * 7));
    const f = svc.cur;
    const pw = smooth(0, 0.12, f) * (1 - smooth(N + 0.03, N + 0.15, f));

    root.position.set(narrow ? 0 : cur.x, cur.y + (narrow ? 2.4 : 0), 0);
    root.scale.setScalar(Math.max(0.0001, cur.s * (narrow ? 0.72 : 1) * (1 + 0.035 * pulse)));
    root.rotation.set(cur.rx + py, cur.ry + idle + px, 0);

    propsGroup.visible = pw > 0.001;
    if (propsGroup.visible) {
      propsGroup.position.set(narrow ? 0 : -2.45 * svc.flip, narrow ? 2.0 : 0, 0);
      propsGroup.scale.setScalar(narrow ? 0.66 : 1);
      propsGroup.rotation.set(0.22 + py, -0.3 * svc.flip + Math.sin(time * 0.45) * 0.14 + px, 0);
      for (let i = 0; i < N; i++) {
        const t = f - i;
        const e = t < 0 ? 1 : t < 0.5 ? 1 - smooth(0, 0.45, t) : smooth(0.8, 1.15, t);
        props[i].update(e);
        if (props[i].group.visible && props[i].tick) props[i].tick(time);
      }
    }

    hero.setOpacity(THREE.MathUtils.clamp(cur.o * (narrow ? lerp(0.22, 0.95, cur.h) : 1) * (1 - pw), 0, 1));
    hero.update(time, cur.explode);
    bg.update(time, window.scrollY, narrow);

    // rim light drifts through the palette, and follows the active service
    const hue = (time * 0.12) % RIMS.length;
    const i0 = Math.floor(hue), fr = hue - i0;
    rimTmp.copy(RIMS[i0]).lerp(RIMS[(i0 + 1) % RIMS.length], fr);
    if (pw > 0.01) {
      const ci = clamp(Math.round(f - 0.25), 0, N - 1);
      rimTmp.lerp(CHAPTER_RIM[ci], pw);
    }
    rim.color.copy(rimTmp);
    rim.intensity = 1.2 + 0.5 * pulse;

    renderer.render(scene, camera);
  }
  requestAnimationFrame(frame);

  return {
    setPose(p) { Object.assign(tgt, p); },
    setActive(i) { active = i; },
    setPulse(v) { pulse = v; },
    setServices(f, flip = 1) { svc.tgt = f; svc.flip = flip; },
    chapters: N,
    isNarrow: () => narrow,
  };
}
