import * as THREE from 'three';
import { makeProp, rb, tex, roundRect, plane, mesh, glow, solid, basic } from './props.js';

const VIOLET = 0x8b5cf6;
const MAGENTA = 0xff4fa3;
const TEAL = 0x2de2a6;
const AMBER = 0xffb020;
const ORANGE = 0xff7a3d;
const BLUE = 0x2997ff;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const sm = (a, b, v) => { const x = clamp01((v - a) / (b - a)); return x * x * (3 - 2 * x); };

/** A canvas texture that redraws itself a few times a second. */
function live(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  let last = -1;
  draw(g, w, h, 0);
  return {
    tex: t,
    update(time, fps = 12) {
      const k = Math.floor(time * fps);
      if (k === last) return;
      last = k;
      draw(g, w, h, time);
      t.needsUpdate = true;
    },
  };
}

/** A cable that draws itself from one end to the other as the prop assembles. */
function cable(P, pts, color, delay, r = 0.022) {
  const curve = new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve, 64, r, 8, false);
  const total = geo.index.count;
  P.add(mesh(geo, solid(color, 0.45, 0.1)), [0, 0, 0], [0, 0, 0], delay, {
    isStatic: true,
    fn: (q) => geo.setDrawRange(0, Math.floor((q * total) / 3) * 3),
  });
  return curve;
}

function plug(P, M, pos, delay, color = 0xd9dde4) {
  const g = new THREE.Group();
  g.add(mesh(rb(0.1, 0.07, 0.12, 0.015), solid(color, 0.3, 0.5)));
  P.add(g, pos, [0, 0, 0], delay, { isStatic: true });
}

/* ------------------------------------------------------------------ *
 *  1. PC build: parts slot into an open case, the glass closes, the
 *     monitor boots. Keyboard, mouse, headphones and a speaker join in.
 * ------------------------------------------------------------------ */
export function buildPcBuild(M) {
  const P = makeProp(0.8);
  const tx = -1.75;
  const fans = [];

  // case frame
  P.add(mesh(rb(2.0, 2.4, 0.06, 0.02), M.graphite), [tx, 0, -0.5], [0, 0, 0], 0.0);
  P.add(mesh(rb(2.0, 0.06, 1.1, 0.02), M.metal), [tx, -1.2, 0], [0, 0, 0], 0.02);
  P.add(mesh(rb(2.0, 0.06, 1.1, 0.02), M.metal), [tx, 1.2, 0], [0, 0, 0], 0.04);
  const front = new THREE.Group();
  front.add(mesh(rb(0.06, 2.4, 1.1, 0.02), M.metal));
  const stripe = mesh(new THREE.BoxGeometry(0.02, 1.8, 0.05), glow(VIOLET, 2.4)); stripe.position.set(-0.04, 0, 0.3); front.add(stripe);
  P.add(front, [tx - 1.0, 0, 0], [0, 0, 0], 0.06);
  P.add(mesh(rb(0.06, 2.4, 1.1, 0.02), M.metal), [tx + 1.0, 0, 0], [0, 0, 0], 0.08);

  // motherboard + chips
  const board = new THREE.Group();
  board.add(mesh(rb(1.45, 1.55, 0.04, 0.02), solid(0x0c3b2e, 0.5, 0.2)));
  const cpu = mesh(rb(0.34, 0.34, 0.03, 0.01), M.metal); cpu.position.set(0.0, 0.3, 0.035); board.add(cpu);
  const vrm = mesh(rb(1.1, 0.12, 0.08, 0.02), solid(0x2b2f37, 0.4, 0.8)); vrm.position.set(-0.05, 0.67, 0.05); board.add(vrm);
  for (let i = 0; i < 4; i++) { const c = mesh(rb(0.12, 0.12, 0.03, 0.01), M.dark); c.position.set(-0.5 + i * 0.16, -0.35, 0.03); board.add(c); }
  P.add(board, [tx + 0.1, 0.4, -0.42], [0, 0, 0], 0.18);

  // CPU cooler with a spinning RGB fan
  const cooler = new THREE.Group();
  cooler.add(mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.16, 36), M.dark));
  const ring = mesh(new THREE.TorusGeometry(0.3, 0.025, 10, 40), glow(MAGENTA, 2.6)); ring.position.z = 0.09; cooler.add(ring);
  const blades = new THREE.Group();
  for (let i = 0; i < 7; i++) { const b = mesh(new THREE.BoxGeometry(0.2, 0.06, 0.02), M.metal); b.position.set(0.15, 0, 0); const pv = new THREE.Group(); pv.rotation.z = (i / 7) * Math.PI * 2; pv.add(b); blades.add(pv); }
  blades.position.z = 0.1; cooler.add(blades); fans.push(blades);
  cooler.rotation.x = Math.PI / 2;
  const coolerWrap = new THREE.Group(); coolerWrap.add(cooler);
  P.add(coolerWrap, [tx + 0.1, 0.7, -0.25], [0, 0, 0], 0.3);

  // RAM sticks with light strips
  [0, 1].forEach((i) => {
    const ram = new THREE.Group();
    ram.add(mesh(rb(0.1, 0.78, 0.035, 0.01), solid(0x14213d, 0.4, 0.3)));
    const strip = mesh(new THREE.BoxGeometry(0.06, 0.7, 0.02), glow(i ? TEAL : MAGENTA, 2.2)); strip.position.z = 0.03; ram.add(strip);
    P.add(ram, [tx + 0.62 + i * 0.16, 0.95, -0.36], [0, 0, 0], 0.42 + i * 0.1, { dir: [1.2, 1.4, 1], dist: 4.2 });
  });

  // graphics card
  const gpu = new THREE.Group();
  gpu.add(mesh(rb(1.6, 0.34, 0.46, 0.05), M.graphite));
  [-0.5, 0, 0.5].forEach((x) => {
    const fan = new THREE.Group();
    fan.add(mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.03, 30), M.dark));
    const bl = new THREE.Group();
    for (let k = 0; k < 8; k++) { const b = mesh(new THREE.BoxGeometry(0.1, 0.03, 0.012), glow(TEAL, 1.8)); b.position.x = 0.055; const pv = new THREE.Group(); pv.rotation.z = (k / 8) * Math.PI * 2; pv.add(b); bl.add(pv); }
    bl.position.z = 0.02; fan.add(bl); fans.push(bl);
    fan.rotation.x = Math.PI / 2; const w = new THREE.Group(); w.add(fan); w.position.set(x, 0, 0.23); gpu.add(w);
  });
  const edge = mesh(new THREE.BoxGeometry(1.5, 0.02, 0.03), glow(AMBER, 2.4)); edge.position.set(0, 0.17, 0.2); gpu.add(edge);
  P.add(gpu, [tx + 0.0, -0.2, -0.1], [0, 0, 0], 0.55, { dir: [-1.2, -0.4, 1.4], dist: 4.6 });

  // power supply
  const psu = new THREE.Group();
  psu.add(mesh(rb(1.7, 0.55, 0.9, 0.04), M.graphite));
  const lab = mesh(new THREE.BoxGeometry(0.5, 0.03, 0.01), glow(TEAL, 1.8)); lab.position.set(0, 0, 0.46); psu.add(lab);
  P.add(psu, [tx + 0.0, -0.88, 0.0], [0, 0, 0], 0.15);

  // power cables
  cable(P, [[tx - 0.4, -0.7, 0.4], [tx - 0.65, -0.55, 0.52], [tx - 0.72, 0.0, 0.5], [tx - 0.55, 0.45, 0.2]], 0xffc233, 0.72);
  cable(P, [[tx + 0.4, -0.7, 0.45], [tx + 0.62, -0.5, 0.52], [tx + 0.65, -0.35, 0.3], [tx + 0.5, -0.22, 0.15]], 0x30d158, 0.78);

  // glass side panel closes last
  const glass = mesh(rb(2.0, 2.4, 0.04, 0.02), new THREE.MeshPhysicalMaterial({ color: 0x1a1030, metalness: 0.1, roughness: 0.05, clearcoat: 1, transparent: true, opacity: 0.12 }));
  P.add(glass, [tx, 0, 0.58], [0, 0, 0], 0.88, { dir: [0, 0.3, 3], dist: 3.6 });

  // monitor with a boot sequence
  const screen = live(768, 460, (g, w, h, time) => {
    const t = time % 8;
    if (t < 2.6) {
      g.fillStyle = '#05060a'; g.fillRect(0, 0, w, h);
      g.fillStyle = '#f3f4f6'; g.font = '700 54px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('TiTANiUM', w / 2, h / 2 - 20);
      g.fillStyle = 'rgba(255,255,255,0.14)'; roundRect(g, w / 2 - 170, h / 2 + 24, 340, 9, 4.5); g.fill();
      const grad = g.createLinearGradient(w / 2 - 170, 0, w / 2 + 170, 0); grad.addColorStop(0, '#8b5cf6'); grad.addColorStop(1, '#ff4fa3');
      g.fillStyle = grad; roundRect(g, w / 2 - 170, h / 2 + 24, 340 * sm(0, 2.4, t), 9, 4.5); g.fill();
    } else {
      const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#1b0f3d'); bg.addColorStop(0.55, '#5b2bd6'); bg.addColorStop(1, '#ff4fa3');
      g.fillStyle = bg; g.fillRect(0, 0, w, h);
      const k = sm(2.6, 3.4, t);
      g.globalAlpha = k; g.fillStyle = 'rgba(255,255,255,0.92)'; roundRect(g, 60, 60, 340, 250, 14); g.fill();
      g.fillStyle = '#e6e9f2'; g.fillRect(60, 60, 340, 34);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(82 + i * 20, 77, 6, 0, 7); g.fill(); });
      g.fillStyle = '#8b5cf6'; for (let i = 0; i < 5; i++) g.fillRect(84, 120 + i * 34, 100 + ((i * 47) % 150), 12);
      g.fillStyle = 'rgba(10,12,24,0.78)'; roundRect(g, 430, 110, 290, 200, 14); g.fill();
      g.strokeStyle = '#2de2a6'; g.lineWidth = 5; g.beginPath(); g.moveTo(450, 280);
      [[500, 230], [550, 250], [600, 180], [650, 200], [700, 140]].forEach(([x, y]) => g.lineTo(x, y)); g.stroke();
      g.globalAlpha = 1; g.fillStyle = 'rgba(8,10,20,0.6)'; g.fillRect(0, h - 44, w, 44);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(28, h - 22, 9, 0, 7); g.fill();
    }
  });
  const monitor = new THREE.Group();
  monitor.add(mesh(rb(2.4, 1.5, 0.08, 0.06), M.dark));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(2.28, 1.38), basic(screen.tex)); scr.position.z = 0.043; monitor.add(scr);
  const mx = 1.0;
  P.add(monitor, [mx, 0.6, -0.2], [0, 0, 0], 0.3);
  P.add(mesh(rb(0.2, 0.7, 0.1), M.graphite), [mx, -0.45, -0.28], [0, 0, 0], 0.22);
  P.add(mesh(rb(1.1, 0.06, 0.65, 0.03), M.graphite), [mx, -0.82, -0.12], [0, 0, 0], 0.18);

  // keyboard with a colour wave, mouse
  const keys = live(512, 170, (g, w, h, time) => {
    g.fillStyle = '#14161c'; g.fillRect(0, 0, w, h);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) {
      g.fillStyle = `hsl(${(c * 22 + time * 90) % 360} 80% ${46 + 12 * Math.sin(time * 3 + c * 0.6 + r)}%)`;
      roundRect(g, 14 + c * 35, 14 + r * 35, 30, 30, 5); g.fill();
    }
  });
  const kb = new THREE.Group();
  kb.add(mesh(rb(1.95, 0.07, 0.62, 0.03), M.dark));
  const kbTop = new THREE.Mesh(new THREE.PlaneGeometry(1.84, 0.54), basic(keys.tex)); kbTop.rotation.x = -Math.PI / 2; kbTop.position.y = 0.037; kb.add(kbTop);
  P.add(kb, [mx - 0.1, -0.9, 1.15], [0.05, 0, 0], 0.62);
  const mouse = new THREE.Group();
  mouse.add(mesh(rb(0.26, 0.1, 0.42, 0.12), M.white));
  const wheel = mesh(new THREE.BoxGeometry(0.03, 0.02, 0.1), glow(VIOLET, 2.4)); wheel.position.set(0, 0.052, -0.05); mouse.add(wheel);
  P.add(mouse, [mx + 1.45, -0.9, 1.15], [0, 0.25, 0], 0.72);

  // headphones
  const hp = new THREE.Group();
  const band = mesh(new THREE.TorusGeometry(0.42, 0.045, 12, 36, Math.PI), M.graphite); hp.add(band);
  [-0.42, 0.42].forEach((x) => { const cup = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 28), M.metal); cup.rotation.z = Math.PI / 2; cup.position.set(x, 0, 0); hp.add(cup); const pad = mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.05, 28), glow(MAGENTA, 0.8)); pad.rotation.z = Math.PI / 2; pad.position.set(x * 0.84, 0, 0); hp.add(pad); });
  P.add(hp, [mx + 2.15, -0.45, 0.8], [0, -0.45, 0], 0.8, { dir: [1.5, 1, 0.8], dist: 3.8 });

  // speaker
  const spk = new THREE.Group();
  spk.add(mesh(rb(0.62, 1.1, 0.5, 0.06), M.dark));
  const woofer = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 30), M.graphite); woofer.rotation.x = Math.PI / 2; woofer.position.set(0, -0.15, 0.26); spk.add(woofer);
  const tw = mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 24), glow(TEAL, 1.8)); tw.rotation.x = Math.PI / 2; tw.position.set(0, 0.3, 0.26); spk.add(tw);
  P.add(spk, [mx + 2.45, -0.3, -0.1], [0, -0.35, 0], 0.88, { dir: [2, 0.5, 1], dist: 3.8 });

  P.tick = (time) => {
    fans.forEach((f, i) => { f.rotation.z = time * (4 + i); });
    screen.update(time, 8);
    keys.update(time, 8);
  };
  return P;
}

/* ------------------------------------------------------------------ *
 *  2. Network: router + switch + firewall, patch cables plug in
 * ------------------------------------------------------------------ */
export function buildNetwork(M) {
  const P = makeProp(0.8);
  const leds = [];

  // router with antennas and wifi arcs
  const router = new THREE.Group();
  router.add(mesh(rb(2.0, 0.24, 1.1, 0.1), M.white));
  const strip = mesh(new THREE.BoxGeometry(1.2, 0.03, 0.02), glow(TEAL, 2.6)); strip.position.set(0, 0.0, 0.56); router.add(strip);
  [-0.8, -0.27, 0.27, 0.8].forEach((x, i) => {
    const a = mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.15, 12), M.dark);
    a.position.set(x, 0.62, -0.35); a.rotation.z = (i - 1.5) * -0.07; router.add(a);
    const tip = mesh(new THREE.SphereGeometry(0.05, 10, 10), glow(TEAL, 2)); tip.position.set(x + (i - 1.5) * -0.08, 1.2, -0.35); router.add(tip);
  });
  P.add(router, [-1.25, 1.25, 0.2], [0.05, 0.12, 0], 0.0);
  const arcs = [];
  [0, 1, 2].forEach((i) => {
    const arc = mesh(new THREE.TorusGeometry(0.5 + i * 0.35, 0.03, 8, 44, Math.PI * 0.6), glow(TEAL, 2));
    arc.rotation.z = Math.PI * 0.2; arcs.push(arc);
    P.add(arc, [-1.25, 1.95 + i * 0.02, 0.1], [0, 0, 0], 0.55 + i * 0.1, { dir: [0, 1.2, 0.2], dist: 2.4 });
  });

  // 16-port switch
  const sw = new THREE.Group();
  sw.add(mesh(rb(2.7, 0.3, 1.0, 0.05), M.metal));
  const face = mesh(rb(2.6, 0.24, 0.03, 0.01), M.dark); face.position.z = 0.51; sw.add(face);
  const pg = new THREE.BoxGeometry(0.1, 0.08, 0.04);
  for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) {
    const p = mesh(pg, M.graphite); p.position.set(-1.05 + i * 0.3, r ? -0.06 : 0.06, 0.52); sw.add(p);
    const l = mesh(new THREE.BoxGeometry(0.04, 0.025, 0.02), glow(i % 3 ? TEAL : AMBER, 2)); l.position.set(p.position.x, p.position.y + 0.055 * (r ? -1 : 1), 0.53); sw.add(l); leds.push(l);
  }
  P.add(sw, [1.05, 0.0, 0.3], [0.05, -0.1, 0], 0.2);

  // firewall
  const fw = new THREE.Group();
  fw.add(mesh(rb(2.1, 0.34, 1.0, 0.05), M.graphite));
  const emblem = tex(128, 128, (g, w, h) => {
    g.clearRect(0, 0, w, h);
    g.fillStyle = '#ff7a3d'; g.beginPath(); g.moveTo(64, 10); g.lineTo(112, 28); g.lineTo(108, 70); g.quadraticCurveTo(100, 105, 64, 120); g.quadraticCurveTo(28, 105, 20, 70); g.lineTo(16, 28); g.closePath(); g.fill();
    g.strokeStyle = '#1a0d08'; g.lineWidth = 11; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(42, 66); g.lineTo(58, 82); g.lineTo(88, 44); g.stroke();
  });
  const em = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.26), new THREE.MeshBasicMaterial({ map: emblem, transparent: true, toneMapped: false })); em.position.set(-0.8, 0, 0.51); fw.add(em);
  const bar = mesh(new THREE.BoxGeometry(1.0, 0.03, 0.02), glow(ORANGE, 2.8)); bar.position.set(0.2, 0.08, 0.51); fw.add(bar);
  for (let i = 0; i < 6; i++) { const p = mesh(pg, M.dark); p.position.set(-0.3 + i * 0.22, -0.07, 0.51); fw.add(p); }
  P.add(fw, [-1.15, -1.3, 0.4], [0.05, 0.12, 0], 0.4);

  // patch cables, each with plugs
  const C = [0xff7a3d, 0x2de2a6, 0xff4fa3, 0xffc233, 0x2997ff];
  cable(P, [[-1.7, 1.1, 0.76], [-1.9, 0.7, 1.5], [-0.5, 0.35, 1.5], [0.3, 0.1, 0.84]], C[0], 0.62);
  cable(P, [[-1.45, 1.1, 0.76], [-1.4, 0.55, 1.7], [0.0, 0.2, 1.7], [0.6, 0.1, 0.84]], C[1], 0.68);
  cable(P, [[0.9, -0.1, 0.84], [0.6, -0.5, 1.55], [-0.3, -0.9, 1.55], [-0.55, -1.2, 0.95]], C[2], 0.74);
  cable(P, [[1.2, -0.1, 0.84], [1.4, -0.6, 1.7], [0.2, -1.1, 1.7], [-0.25, -1.2, 0.95]], C[3], 0.8);
  cable(P, [[-1.9, -1.3, 0.95], [-2.4, -1.5, 1.3], [-2.9, -1.0, 0.8], [-3.1, -0.3, 0.2]], C[4], 0.86);
  [[0.3, 0.1, 0.86], [0.6, 0.1, 0.86], [-0.55, -1.2, 0.97], [-0.25, -1.2, 0.97], [-1.7, 1.1, 0.78], [-1.45, 1.1, 0.78]].forEach((p, i) => plug(P, M, p, 0.7 + i * 0.03));

  P.tick = (time) => {
    leds.forEach((l, i) => { l.material.emissiveIntensity = 0.5 + 2.4 * (Math.sin(time * (3 + (i % 4)) + i * 1.9) > 0.1 ? 1 : 0.1); });
    arcs.forEach((a, i) => { a.material.emissiveIntensity = 1 + 1.6 * Math.max(0, Math.sin(time * 3 - i * 0.9)); });
  };
  return P;
}

/* ------------------------------------------------------------------ *
 *  4. Cameras + NVR + monitor wall, with a field of view that calibrates
 * ------------------------------------------------------------------ */
export function buildSecurity(M) {
  const P = makeProp(0.8);

  // bullet camera on a bracket
  P.add(mesh(rb(0.9, 0.1, 0.7, 0.03), M.graphite), [-1.3, 1.95, -0.2], [0, 0, 0], 0.0);
  P.add(mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 20), M.metal), [-1.3, 1.7, -0.2], [0, 0, 0], 0.08);
  const cam = new THREE.Group();
  const body = mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.3, 40), M.white); body.rotation.x = Math.PI / 2; cam.add(body);
  const sh = mesh(rb(0.7, 0.05, 1.35, 0.02), M.white); sh.position.y = 0.3; cam.add(sh);
  const ring = mesh(new THREE.TorusGeometry(0.27, 0.04, 14, 40), M.graphite); ring.position.z = 0.65; cam.add(ring);
  const lens = mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.08, 36), M.glass); lens.rotation.x = Math.PI / 2; lens.position.z = 0.66; cam.add(lens);
  const rec = mesh(new THREE.SphereGeometry(0.035, 12, 12), glow(0xff3b30, 3)); rec.position.set(0.17, 0.2, 0.64); cam.add(rec);
  P.add(cam, [-1.3, 1.3, 0.3], [0.2, -0.3, 0], 0.18);

  // field-of-view cone that "calibrates"
  const cone = mesh(new THREE.ConeGeometry(1.0, 2.2, 28, 1, true), new THREE.MeshBasicMaterial({ color: TEAL, transparent: true, opacity: 0.12, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  cone.geometry.translate(0, -1.1, 0);
  const coneWrap = new THREE.Group(); cone.rotation.x = -Math.PI / 2 - 0.35; coneWrap.add(cone);
  P.add(coneWrap, [-1.0, 1.1, 1.0], [0, -0.3, 0], 0.7, { isStatic: true, fn: (q) => coneWrap.scale.setScalar(Math.max(0.001, q)) });

  // dome camera
  const dome = new THREE.Group();
  dome.add(mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.1, 40), M.white));
  const shell = mesh(new THREE.SphereGeometry(0.4, 32, 20, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhysicalMaterial({ color: 0x0a0e18, roughness: 0.05, metalness: 0.2, clearcoat: 1, transparent: true, opacity: 0.85 }));
  shell.position.y = -0.04; shell.rotation.x = Math.PI; dome.add(shell);
  const eye = mesh(new THREE.SphereGeometry(0.12, 18, 18), glow(BLUE, 2)); eye.position.set(0, -0.2, 0.1); dome.add(eye);
  for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; const l = mesh(new THREE.SphereGeometry(0.022, 8, 8), glow(0xff3b30, 2.4)); l.position.set(Math.cos(a) * 0.17, -0.2, Math.sin(a) * 0.17 + 0.1); dome.add(l); }
  P.add(dome, [1.7, 1.55, 0.2], [0.0, 0, 0], 0.32);

  // NVR
  const nvr = new THREE.Group();
  nvr.add(mesh(rb(2.5, 0.36, 1.15, 0.05), M.dark));
  const fa = mesh(rb(2.4, 0.3, 0.03, 0.01), M.graphite); fa.position.z = 0.59; nvr.add(fa);
  for (let i = 0; i < 4; i++) { const b = mesh(new THREE.BoxGeometry(0.5, 0.04, 0.02), M.metal); b.position.set(-0.7 + i * 0.55, 0.0, 0.61); nvr.add(b); }
  const pwr = mesh(new THREE.SphereGeometry(0.03, 10, 10), glow(0x30d158, 3)); pwr.position.set(1.08, 0.08, 0.62); nvr.add(pwr);
  const hdd = mesh(new THREE.BoxGeometry(0.36, 0.03, 0.02), glow(AMBER, 2.4)); hdd.position.set(0.8, -0.06, 0.62); nvr.add(hdd);
  P.add(nvr, [-0.4, -0.7, 0.4], [0.06, -0.12, 0], 0.5);

  // monitor wall with live-ish feeds
  const feeds = live(512, 320, (g, w, h, time) => {
    g.fillStyle = '#050608'; g.fillRect(0, 0, w, h);
    const cols = ['#173a58', '#21305a', '#13483f', '#3b2447'];
    for (let i = 0; i < 4; i++) {
      const x = (i % 2) * 256 + 4, y = Math.floor(i / 2) * 160 + 4;
      const gr = g.createLinearGradient(x, y, x + 248, y + 152); gr.addColorStop(0, cols[i]); gr.addColorStop(1, '#0a0d14');
      g.fillStyle = gr; g.fillRect(x, y, 248, 152);
      g.fillStyle = 'rgba(255,255,255,0.18)'; const px = x + 40 + ((Math.sin(time * 0.9 + i * 2) + 1) / 2) * 140; g.fillRect(px, y + 70, 16, 46); g.beginPath(); g.arc(px + 8, y + 62, 9, 0, 7); g.fill();
      g.fillStyle = '#ff3b30'; g.beginPath(); g.arc(x + 14, y + 14, 4 + (Math.sin(time * 4) > 0 ? 1 : 0), 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.font = '11px sans-serif'; g.fillText('CAM 0' + (i + 1), x + 24, y + 18);
      const sy = y + ((time * 60 + i * 40) % 152); g.fillStyle = 'rgba(111,208,255,0.12)'; g.fillRect(x, sy, 248, 5);
    }
  });
  const mon = new THREE.Group();
  mon.add(mesh(rb(1.95, 1.25, 0.07, 0.05), M.dark));
  const fs = new THREE.Mesh(new THREE.PlaneGeometry(1.85, 1.15), basic(feeds.tex)); fs.position.z = 0.04; mon.add(fs);
  P.add(mon, [1.75, -0.45, 0.2], [0, -0.2, 0], 0.62);

  // cables
  cable(P, [[-1.3, 1.1, 0.2], [-1.7, 0.4, 0.9], [-1.4, -0.3, 1.2], [-0.9, -0.6, 1.0]], 0xff6b5e, 0.78);
  cable(P, [[1.7, 1.25, 0.2], [1.5, 0.6, 1.0], [0.6, -0.3, 1.3], [0.3, -0.6, 1.0]], TEAL, 0.84);
  cable(P, [[0.7, -0.75, 1.0], [1.0, -1.2, 1.3], [1.4, -1.0, 0.9], [1.7, -0.9, 0.4]], VIOLET, 0.9);

  // small IP phone
  const keyTex = tex(256, 256, (g, w, h) => {
    g.fillStyle = '#12141a'; g.fillRect(0, 0, w, h); g.fillStyle = '#e8ebf1';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.beginPath(); g.arc(60 + c * 68, 50 + r * 55, 17, 0, 7); g.fill(); }
  });
  const ph = new THREE.Group();
  ph.add(mesh(rb(1.5, 0.2, 1.0, 0.07), M.graphite));
  const pad = plane(0.8, 0.8, keyTex); pad.rotation.x = -Math.PI / 2; pad.position.set(0.25, 0.105, 0.08); ph.add(pad);
  const lcd = mesh(rb(0.45, 0.03, 0.3, 0.01), glow(MAGENTA, 1.4)); lcd.position.set(-0.45, 0.105, -0.2); ph.add(lcd);
  P.add(ph, [-1.9, -1.85, 0.9], [0.3, -0.3, 0], 0.88);
  P.add(mesh(rb(0.34, 0.2, 1.4, 0.1), M.metal), [-2.65, -1.7, 0.85], [0.3, -0.3, 0], 0.94);

  P.tick = (time) => {
    rec.material.emissiveIntensity = 1.2 + (Math.sin(time * 4) > 0 ? 2.5 : 0);
    cone.material.opacity = 0.09 + 0.06 * (Math.sin(time * 2) * 0.5 + 0.5);
    feeds.update(time, 8);
  };
  return P;
}

/* ------------------------------------------------------------------ *
 *  6. Phone that installs software, app icons fly in
 * ------------------------------------------------------------------ */
export function buildPhoneInstall(M) {
  const P = makeProp(0.82);

  const APPS = ['#2997ff', '#30d158', '#ffc233', '#ff4fa3', '#8b5cf6', '#ff7a3d', '#2de2a6', '#ff3b30'];
  const ui = live(384, 800, (g, w, h, time) => {
    const t = time % 7;
    const bg = g.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#1a1040'); bg.addColorStop(1, '#050608');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    if (t < 3.6) {
      const p = sm(0.3, 3.4, t);
      g.fillStyle = '#fff'; g.font = '600 30px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('Installing', w / 2, 300);
      g.fillStyle = 'rgba(255,255,255,0.55)'; g.font = '22px Inter, sans-serif'; g.fillText(Math.round(p * 100) + '%', w / 2, 345);
      g.fillStyle = 'rgba(255,255,255,0.14)'; roundRect(g, 56, 380, 272, 12, 6); g.fill();
      const gr = g.createLinearGradient(56, 0, 328, 0); gr.addColorStop(0, '#8b5cf6'); gr.addColorStop(1, '#ff4fa3');
      g.fillStyle = gr; roundRect(g, 56, 380, Math.max(12, 272 * p), 12, 6); g.fill();
      g.fillStyle = APPS[4]; roundRect(g, w / 2 - 44, 170, 88, 88, 22); g.fill();
    } else {
      g.fillStyle = 'rgba(255,255,255,0.9)'; g.font = '600 24px Inter, sans-serif'; g.textAlign = 'left'; g.fillText('Ready', 36, 96);
      for (let i = 0; i < 8; i++) {
        const k = sm(3.7 + i * 0.12, 4.1 + i * 0.12, t);
        const cx = 70 + (i % 4) * 82, cy = 210 + Math.floor(i / 4) * 118;
        g.save(); g.translate(cx, cy); g.scale(k, k); g.fillStyle = APPS[i]; roundRect(g, -30, -30, 60, 60, 16); g.fill(); g.restore();
      }
      g.fillStyle = 'rgba(255,255,255,0.1)'; roundRect(g, 28, 470, 328, 96, 22); g.fill();
      g.fillStyle = '#30d158'; g.beginPath(); g.arc(76, 518, 20, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.75)'; g.fillRect(112, 502, 160, 12); g.fillRect(112, 526, 100, 9);
    }
    g.fillStyle = '#fff'; roundRect(g, 140, 770, 104, 8, 4); g.fill();
  });
  const phone = new THREE.Group();
  phone.add(mesh(rb(1.55, 3.1, 0.14, 0.22), M.metal));
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.95), basic(ui.tex)); scr.position.z = 0.073; phone.add(scr);
  const pill = mesh(rb(0.4, 0.09, 0.02, 0.04), M.dark); pill.position.set(0, 1.35, 0.085); phone.add(pill);
  P.add(phone, [0, 0, 0], [0, -0.25, 0], 0.0);

  // icons that fly in toward the phone
  [BLUE, TEAL, MAGENTA, AMBER].forEach((c, i) => {
    const icon = mesh(rb(0.42, 0.42, 0.08, 0.1), glow(c, 1.4));
    P.add(icon, [-2.1 + (i % 2) * 0.55, 1.2 - i * 0.55, 0.9], [0, 0.3, 0.1], 0.45 + i * 0.08, { dir: [-1.4, 0.4, 1], dist: 3.8 });
  });

  const code = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    const cols = ['#2997ff', '#30d158', '#ffc233', '#ff4fa3', '#c3a6ff'];
    for (let i = 0; i < 8; i++) { let x = 34 + (i % 3) * 30; for (let j = 0; j < 2 + (i % 3); j++) { const ww = 50 + ((i * 37 + j * 53) % 90); g.fillStyle = cols[(i + j) % 5]; roundRect(g, x, 34 + i * 28, ww, 12, 6); g.fill(); x += ww + 14; } }
  });
  const chart = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    [90, 150, 120, 190, 160, 220].forEach((v, i) => { g.fillStyle = i === 5 ? '#ff4fa3' : 'rgba(111,208,255,0.35)'; roundRect(g, 40 + i * 74, h - 30 - v, 48, v, 8); g.fill(); });
  });
  const toggles = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(40, 56 + i * 76, 190 + i * 30, 14);
      g.fillStyle = i === 1 ? '#3a3f4a' : '#30d158'; roundRect(g, 380, 40 + i * 76, 90, 46, 23); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(i === 1 ? 403 : 447, 63 + i * 76, 17, 0, 7); g.fill();
    }
  });
  const card = (t) => { const g = new THREE.Group(); g.add(mesh(rb(1.9, 1.07, 0.05, 0.12), M.graphite)); const p = plane(1.8, 1.0, t); p.position.z = 0.03; g.add(p); return g; };
  P.add(card(code), [1.9, 0.95, 0.5], [0, -0.35, 0.05], 0.45);
  P.add(card(chart), [-1.55, -0.6, 0.9], [0, 0.35, -0.04], 0.6);
  P.add(card(toggles), [1.75, -1.15, 1.1], [0, -0.3, 0.03], 0.75);

  P.tick = (time) => ui.update(time, 10);
  return P;
}
