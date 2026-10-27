import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { buildPcBuild, buildNetwork, buildSecurity, buildPhoneInstall } from './props2.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

export const ACCENT = 0x2997ff;

/* ------------------------------------------------------------------ *
 *  Materials + small helpers
 * ------------------------------------------------------------------ */
export function createMaterials() {
  const metal = new THREE.MeshPhysicalMaterial({ color: 0xaeb2b9, metalness: 1, roughness: 0.34, clearcoat: 0.25, clearcoatRoughness: 0.4 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x0a0b0e, metalness: 0.6, roughness: 0.55 });
  const white = new THREE.MeshStandardMaterial({ color: 0xe7e9ee, metalness: 0.1, roughness: 0.45 });
  const graphite = new THREE.MeshStandardMaterial({ color: 0x2a2d33, metalness: 0.7, roughness: 0.4 });
  const accent = new THREE.MeshStandardMaterial({ color: 0x0b1626, emissive: ACCENT, emissiveIntensity: 1.4, metalness: 0, roughness: 0.4 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0a1424, metalness: 0.2, roughness: 0.08, clearcoat: 1, emissive: 0x0b2a55, emissiveIntensity: 0.5 });
  return { metal, dark, white, graphite, accent, glass };
}

const geoCache = new Map();
export function rb(w, h, d, r = 0.04) {
  const rad = Math.min(r, w * 0.5 - 1e-3, h * 0.5 - 1e-3, d * 0.5 - 1e-3);
  const key = [w, h, d, rad].join('|');
  if (!geoCache.has(key)) geoCache.set(key, new RoundedBoxGeometry(w, h, d, 3, rad));
  return geoCache.get(key);
}

export function tex(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

export const basic = (map) => new THREE.MeshBasicMaterial({ map, toneMapped: false });
export const plane = (w, h, map) => new THREE.Mesh(new THREE.PlaneGeometry(w, h), basic(map));
export const mesh = (geo, mat) => new THREE.Mesh(geo, mat);
export const glow = (hex, i = 1.6) => new THREE.MeshStandardMaterial({ color: 0x101216, emissive: hex, emissiveIntensity: i, roughness: 0.4 });
export const solid = (hex, rough = 0.45, metal = 0.2) => new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: metal });

/* ------------------------------------------------------------------ *
 *  Prop = a group of parts that fly in and snap together
 *  update(e): e=1 fully scattered (invisible), e=0 fully assembled
 * ------------------------------------------------------------------ */
export function makeProp(fit = 1) {
  const group = new THREE.Group();
  group.scale.setScalar(fit);
  const parts = [];
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function add(obj, pos, rot = [0, 0, 0], delay = 0, opts = {}) {
    obj.position.set(pos[0], pos[1], pos[2]);
    obj.rotation.set(rot[0], rot[1], rot[2]);
    const homeP = new THREE.Vector3(pos[0], pos[1], pos[2]);
    const dir = opts.dir
      ? new THREE.Vector3(...opts.dir)
      : new THREE.Vector3(pos[0] * 0.6 + (rnd() - 0.5) * 3, pos[1] * 0.6 + (rnd() - 0.25) * 3, (rnd() - 0.2) * 3 + 0.8);
    dir.normalize().multiplyScalar(opts.dist ?? 4.4);
    parts.push({
      obj,
      delay,
      homeP,
      fromP: homeP.clone().add(dir),
      homeR: [rot[0], rot[1], rot[2]],
      fromR: [rot[0] + (rnd() - 0.5) * 3.2, rot[1] + (rnd() - 0.5) * 3.2, rot[2] + (rnd() - 0.5) * 3.2],
      isStatic: !!opts.isStatic,
      fn: opts.fn,
    });
    group.add(obj);
    return obj;
  }

  function update(e) {
    const a = 1 - e;
    group.visible = a > 0.002;
    if (!group.visible) return;
    for (const p of parts) {
      const q = easeOut(clamp((a - p.delay * 0.5) / 0.5));
      if (p.fn) p.fn(q);
      if (p.isStatic) { p.obj.visible = q > 0.001; continue; }
      p.obj.visible = q > 0.004;
      p.obj.position.lerpVectors(p.fromP, p.homeP, q);
      p.obj.rotation.set(lerp(p.fromR[0], p.homeR[0], q), lerp(p.fromR[1], p.homeR[1], q), lerp(p.fromR[2], p.homeR[2], q));
      p.obj.scale.setScalar(0.35 + 0.65 * q);
    }
  }

  return { group, add, update, tick: null };
}

/* ------------------------------------------------------------------ *
 *  1. Workstation
 * ------------------------------------------------------------------ */
function buildWorkstation(M) {
  const P = makeProp(0.82);

  const screenTex = tex(1024, 600, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, '#0d2a5c'); bg.addColorStop(1, '#2997ff');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(255,255,255,0.9)'; roundRect(g, 70, 70, 440, 340, 18); g.fill();
    g.fillStyle = '#e8eef9'; g.fillRect(70, 70, 440, 44);
    ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(98 + i * 26, 92, 7, 0, 7); g.fill(); });
    g.fillStyle = '#2997ff'; for (let i = 0; i < 5; i++) { g.fillRect(100, 150 + i * 44, 120 + (i * 53) % 180, 14); }
    g.fillStyle = 'rgba(8,14,28,0.75)'; roundRect(g, 560, 120, 390, 250, 18); g.fill();
    g.strokeStyle = '#6fd0ff'; g.lineWidth = 6; g.beginPath(); g.moveTo(590, 330);
    [[650, 280], [710, 300], [780, 210], [850, 240], [920, 160]].forEach(([x, y]) => g.lineTo(x, y)); g.stroke();
    g.fillStyle = 'rgba(8,14,28,0.55)'; g.fillRect(0, h - 56, w, 56);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(34, h - 28, 11, 0, 7); g.fill();
  });
  const monitor = new THREE.Group();
  monitor.add(mesh(rb(2.7, 1.65, 0.09, 0.06), M.dark));
  const scr = plane(2.55, 1.5, screenTex); scr.position.z = 0.047; monitor.add(scr);
  P.add(monitor, [0.2, 0.55, 0], [0, 0, 0], 0.35);

  P.add(mesh(rb(0.22, 0.7, 0.1), M.graphite), [0.2, -0.5, -0.08], [0, 0, 0], 0.2);
  P.add(mesh(rb(1.1, 0.07, 0.7, 0.03), M.graphite), [0.2, -0.88, 0.05], [0, 0, 0], 0.1);

  const keysTex = tex(512, 160, (g, w, h) => {
    g.fillStyle = '#15171c'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2b2f37';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { roundRect(g, 14 + c * 35, 14 + r * 35, 30, 30, 5); g.fill(); }
  });
  const kb = new THREE.Group();
  kb.add(mesh(rb(1.9, 0.07, 0.6, 0.03), M.metal));
  const kbTop = plane(1.78, 0.5, keysTex); kbTop.rotation.x = -Math.PI / 2; kbTop.position.y = 0.037; kb.add(kbTop);
  P.add(kb, [0.2, -0.84, 1.15], [0.04, 0, 0], 0.7);

  P.add(mesh(rb(0.22, 0.09, 0.36, 0.08), M.metal), [1.55, -0.84, 1.15], [0, 0.2, 0], 0.85);

  const tower = new THREE.Group();
  tower.add(mesh(rb(0.75, 1.7, 1.35, 0.05), M.metal));
  const face = mesh(rb(0.7, 1.62, 0.04, 0.02), M.dark); face.position.z = 0.69; tower.add(face);
  const ring = mesh(new THREE.TorusGeometry(0.12, 0.025, 12, 32), glow(ACCENT, 2.2)); ring.position.set(0, 0.55, 0.72); tower.add(ring);
  for (let i = 0; i < 6; i++) { const v = mesh(new THREE.BoxGeometry(0.4, 0.02, 0.03), M.metal); v.position.set(0, -0.1 - i * 0.07, 0.72); tower.add(v); }
  P.add(tower, [-1.95, -0.03, -0.1], [0, 0.25, 0], 0.1);
  return P;
}

/* ------------------------------------------------------------------ *
 *  2. Server rack + cables that plug in
 * ------------------------------------------------------------------ */
function buildRack(M) {
  const P = makeProp(0.74);

  [[-1.2, -0.7], [1.2, -0.7], [-1.2, 0.7], [1.2, 0.7]].forEach(([x, z], i) => {
    P.add(mesh(rb(0.08, 3.7, 0.08, 0.02), M.graphite), [x, 0, z], [0, 0, 0], i * 0.04);
  });
  P.add(mesh(rb(2.7, 0.08, 1.6, 0.03), M.graphite), [0, 1.9, 0], [0, 0, 0], 0.1);
  P.add(mesh(rb(2.7, 0.08, 1.6, 0.03), M.graphite), [0, -1.9, 0], [0, 0, 0], 0.1);

  const unit = (h, ports, rows = 1, colorLed = true) => {
    const g = new THREE.Group();
    g.add(mesh(rb(2.3, h, 1.4, 0.04), M.metal));
    const f = mesh(rb(2.2, h - 0.08, 0.04, 0.015), M.dark); f.position.z = 0.71; g.add(f);
    const pg = new THREE.BoxGeometry(0.085, 0.07, 0.03);
    const led = glow(ACCENT, 2);
    for (let r = 0; r < rows; r++) {
      for (let i = 0; i < ports; i++) {
        const pt = mesh(pg, M.graphite);
        pt.position.set(-0.98 + i * (1.96 / Math.max(1, ports - 1)), (rows === 1 ? 0 : (r ? -0.07 : 0.07)), 0.735);
        g.add(pt);
        if (colorLed && i % 2 === 0) { const l = mesh(new THREE.BoxGeometry(0.03, 0.02, 0.02), led); l.position.set(pt.position.x, pt.position.y + 0.06, 0.74); g.add(l); }
      }
    }
    return g;
  };
  const ys = [1.35, 0.85, 0.3, -0.45, -1.3];
  P.add(unit(0.4, 12), [0, ys[0], 0], [0, 0, 0], 0.2);
  P.add(unit(0.4, 12), [0, ys[1], 0], [0, 0, 0], 0.3);
  P.add(unit(0.32, 12, 2, false), [0, ys[2], 0], [0, 0, 0], 0.4);
  const srv = unit(0.7, 6, 1);
  P.add(srv, [0, ys[3], 0], [0, 0, 0], 0.5);
  const ups = unit(0.75, 3, 1, false);
  P.add(ups, [0, ys[4], 0], [0, 0, 0], 0.6);

  const colors = [0x2997ff, 0xffc233, 0xf5f5f7, 0x30d158, 0xff6b6b, 0x2997ff];
  colors.forEach((c, i) => {
    const x = -0.85 + i * 0.34;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x, ys[0] + 0.02, 0.75),
      new THREE.Vector3(x, ys[0] + 0.02, 1.2),
      new THREE.Vector3(x + 0.12, ys[1] - 0.1, 1.45 + i * 0.05),
      new THREE.Vector3(x + 0.06, ys[2] + 0.1, 1.2),
      new THREE.Vector3(x + 0.06, ys[2] + 0.02, 0.75),
    ]);
    const geo = new THREE.TubeGeometry(curve, 56, 0.028, 8, false);
    const total = geo.index.count;
    const m = mesh(geo, solid(c, 0.5, 0.1));
    P.add(m, [0, 0, 0], [0, 0, 0], 0.78 + i * 0.04, {
      isStatic: true,
      fn: (q) => geo.setDrawRange(0, Math.floor((q * total) / 3) * 3),
    });
  });
  return P;
}

/* ------------------------------------------------------------------ *
 *  3. Microsoft 365 / security shield
 * ------------------------------------------------------------------ */
function buildShield(M) {
  const P = makeProp(0.86);
  const shape = (s) => {
    const sh = new THREE.Shape();
    sh.moveTo(0, 1.5 * s);
    sh.lineTo(1.2 * s, 1.1 * s);
    sh.lineTo(1.2 * s, 0.1 * s);
    sh.bezierCurveTo(1.2 * s, -0.7 * s, 0.6 * s, -1.2 * s, 0, -1.5 * s);
    sh.bezierCurveTo(-0.6 * s, -1.2 * s, -1.2 * s, -0.7 * s, -1.2 * s, 0.1 * s);
    sh.lineTo(-1.2 * s, 1.1 * s);
    sh.closePath();
    return sh;
  };
  const outer = new THREE.ExtrudeGeometry(shape(1), { depth: 0.28, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3, curveSegments: 24 });
  P.add(mesh(outer, M.metal), [0, 0, -0.14], [0, 0, 0], 0.0);
  const inner = new THREE.ExtrudeGeometry(shape(0.8), { depth: 0.1, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2, curveSegments: 24 });
  P.add(mesh(inner, M.dark), [0, 0, 0.22], [0, 0, 0], 0.25);

  const ck = new THREE.Shape();
  [[-0.62, 0.0], [-0.42, 0.2], [-0.17, -0.05], [0.4, 0.55], [0.6, 0.35], [-0.17, -0.45]].forEach(([x, y], i) => (i ? ck.lineTo(x, y) : ck.moveTo(x, y)));
  ck.closePath();
  P.add(mesh(new THREE.ExtrudeGeometry(ck, { depth: 0.1, bevelEnabled: false }), glow(ACCENT, 2.4)), [0, 0.05, 0.38], [0, 0, 0], 0.55);

  const headGeo = new THREE.SphereGeometry(0.09, 16, 16);
  const bodyGeo = new THREE.SphereGeometry(0.17, 16, 16);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.5;
    const card = new THREE.Group();
    card.add(mesh(rb(0.55, 0.55, 0.14, 0.14), M.graphite));
    const h = mesh(headGeo, glow(ACCENT, 1.6)); h.position.set(0, 0.09, 0.08); card.add(h);
    const b = mesh(bodyGeo, glow(ACCENT, 1.6)); b.scale.set(1, 0.55, 0.4); b.position.set(0, -0.12, 0.08); card.add(b);
    P.add(card, [Math.cos(a) * 2.1, Math.sin(a) * 1.75, 0.1], [0, 0, 0], 0.65 + i * 0.05);
  }
  return P;
}

/* ------------------------------------------------------------------ *
 *  4. CCTV camera + IP desk phone
 * ------------------------------------------------------------------ */
function buildCctv(M) {
  const P = makeProp(0.86);

  P.add(mesh(rb(1.0, 0.1, 0.8, 0.03), M.graphite), [0, 1.8, -0.2], [0, 0, 0], 0.0);
  P.add(mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 20), M.metal), [0, 1.5, -0.2], [0, 0, 0], 0.1);
  P.add(mesh(new THREE.SphereGeometry(0.16, 24, 24), M.metal), [0, 1.22, -0.2], [0, 0, 0], 0.15);

  const cam = new THREE.Group();
  const body = mesh(new THREE.CylinderGeometry(0.32, 0.32, 1.5, 40), M.white); body.rotation.x = Math.PI / 2; cam.add(body);
  const shield = mesh(rb(0.78, 0.05, 1.55, 0.02), M.white); shield.position.y = 0.34; cam.add(shield);
  const ring = mesh(new THREE.TorusGeometry(0.31, 0.04, 14, 40), M.graphite); ring.position.z = 0.75; cam.add(ring);
  const lens = mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.08, 36), M.glass); lens.rotation.x = Math.PI / 2; lens.position.z = 0.76; cam.add(lens);
  const iris = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.09, 24), M.dark); iris.rotation.x = Math.PI / 2; iris.position.z = 0.77; cam.add(iris);
  const rec = mesh(new THREE.SphereGeometry(0.035, 12, 12), glow(0xff3b30, 3)); rec.position.set(0.2, 0.23, 0.74); cam.add(rec);
  P.add(cam, [0, 0.85, 0.35], [0.14, -0.25, 0], 0.3);
  P.tick = (time) => { rec.material.emissiveIntensity = 1.2 + (Math.sin(time * 4) > 0 ? 2.5 : 0); };

  const keyTex = tex(256, 256, (g, w, h) => {
    g.fillStyle = '#12141a'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#e8ebf1';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.beginPath(); g.arc(60 + c * 68, 50 + r * 55, 17, 0, 7); g.fill(); }
  });
  const phone = new THREE.Group();
  phone.add(mesh(rb(1.8, 0.22, 1.25, 0.08), M.graphite));
  const pad = plane(0.95, 0.95, keyTex); pad.rotation.x = -Math.PI / 2; pad.position.set(0.3, 0.115, 0.1); phone.add(pad);
  const lcd = mesh(rb(0.55, 0.03, 0.4, 0.01), glow(ACCENT, 1.2)); lcd.position.set(-0.55, 0.115, -0.25); phone.add(lcd);
  P.add(phone, [0.35, -1.2, 0.8], [0.32, -0.3, 0], 0.6);
  const hs = mesh(rb(0.42, 0.26, 1.7, 0.12), M.metal);
  P.add(hs, [-1.0, -1.0, 0.7], [0.32, -0.3, 0], 0.75);
  return P;
}

/* ------------------------------------------------------------------ *
 *  5. Printer + ink cartridges
 * ------------------------------------------------------------------ */
function buildPrinter(M) {
  const P = makeProp(0.8);
  P.add(mesh(rb(3.0, 0.95, 1.9, 0.12), M.white), [0, -0.7, 0], [0, 0, 0], 0.0);
  P.add(mesh(rb(2.2, 0.04, 0.5, 0.01), M.dark), [0, -0.22, 0.1], [0, 0, 0], 0.15, { isStatic: true });

  const lid = new THREE.Group();
  const lidBody = mesh(rb(3.0, 0.16, 1.9, 0.08), M.white); lidBody.position.set(0, 0.08, 0.95); lid.add(lidBody);
  const glass = mesh(rb(2.7, 0.02, 1.6, 0.01), M.glass); glass.position.set(0, 0.17, 0.95); lid.add(glass);
  P.add(lid, [0, -0.22, -0.95], [-1.0, 0, 0], 0.3, { dir: [0, 1, -0.6] });

  P.add(mesh(rb(2.4, 0.06, 0.9, 0.02), M.metal), [0, -1.02, 1.3], [0.05, 0, 0], 0.4);
  const paper = mesh(new THREE.BoxGeometry(1.9, 0.02, 2.3), solid(0xffffff, 0.9, 0));
  P.add(paper, [0, -0.96, 1.55], [0.05, 0, 0], 0.5);
  P.add(mesh(new THREE.BoxGeometry(1.6, 0.02, 1.4), solid(0xfafafa, 0.9, 0)), [0, 0.15, -1.25], [-0.55, 0, 0], 0.45);

  const panelTex = tex(256, 96, (g, w, h) => {
    g.fillStyle = '#0a1830'; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2997ff'; g.fillRect(14, 16, 150, 12);
    g.fillStyle = '#6fd0ff'; g.fillRect(14, 40, 100, 10);
    g.fillStyle = '#fff'; g.beginPath(); g.arc(210, 48, 20, 0, 7); g.fill();
  });
  const panel = new THREE.Group();
  panel.add(mesh(rb(0.95, 0.1, 0.36, 0.04), M.dark));
  const pd = plane(0.82, 0.3, panelTex); pd.rotation.x = -Math.PI / 2; pd.position.y = 0.052; panel.add(pd);
  P.add(panel, [0.85, -0.2, 0.95], [-0.2, 0, 0], 0.55);

  [0x00b4ff, 0xff2d9a, 0xffd60a, 0x1a1b20].forEach((c, i) => {
    const cart = new THREE.Group();
    cart.add(mesh(rb(0.38, 0.6, 0.28, 0.06), solid(c, 0.35, 0.1)));
    const label = mesh(new THREE.BoxGeometry(0.26, 0.14, 0.01), solid(0xffffff, 0.6, 0)); label.position.set(0, 0.05, 0.145); cart.add(label);
    P.add(cart, [-0.78 + i * 0.52, 0.02, 0.1], [0, 0, 0], 0.7 + i * 0.07, { dir: [(i - 1.5) * 0.4, 1, 0.5], dist: 5 });
  });
  return P;
}

/* ------------------------------------------------------------------ *
 *  6. Phone + floating app layers (software / web)
 * ------------------------------------------------------------------ */
function buildSoftware(M) {
  const P = makeProp(0.82);

  const uiTex = tex(384, 800, (g, w, h) => {
    const bg = g.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, '#0e1d3a'); bg.addColorStop(1, '#050608');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = '#2997ff'; roundRect(g, 28, 80, 328, 130, 22); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.85)'; g.fillRect(48, 108, 140, 14); g.fillRect(48, 136, 90, 10);
    for (let i = 0; i < 4; i++) {
      g.fillStyle = 'rgba(255,255,255,0.08)'; roundRect(g, 28, 240 + i * 96, 328, 80, 18); g.fill();
      g.fillStyle = ['#2997ff', '#30d158', '#ffc233', '#ff6b6b'][i]; g.beginPath(); g.arc(70, 280 + i * 96, 20, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(110, 266 + i * 96, 150, 12); g.fillRect(110, 288 + i * 96, 90, 9);
    }
    g.fillStyle = '#fff'; roundRect(g, 140, 770, 104, 8, 4); g.fill();
  });
  const phone = new THREE.Group();
  phone.add(mesh(rb(1.55, 3.1, 0.14, 0.22), M.metal));
  const scr = plane(1.4, 2.95, uiTex); scr.position.z = 0.073; phone.add(scr);
  const pill = mesh(rb(0.4, 0.09, 0.02, 0.04), M.dark); pill.position.set(0, 1.35, 0.085); phone.add(pill);
  P.add(phone, [0, 0, 0], [0, -0.25, 0], 0.0);

  const code = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    const cols = ['#2997ff', '#30d158', '#ffc233', '#ff6b6b', '#c3a6ff'];
    for (let i = 0; i < 8; i++) {
      let x = 34 + (i % 3) * 30;
      for (let j = 0; j < 2 + (i % 3); j++) { const ww = 50 + ((i * 37 + j * 53) % 90); g.fillStyle = cols[(i + j) % 5]; roundRect(g, x, 34 + i * 28, ww, 12, 6); g.fill(); x += ww + 14; }
    }
  });
  const chart = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    const hs = [90, 150, 120, 190, 160, 220];
    hs.forEach((v, i) => { g.fillStyle = i === 5 ? '#2997ff' : 'rgba(111,208,255,0.35)'; roundRect(g, 40 + i * 74, h - 30 - v, 48, v, 8); g.fill(); });
  });
  const toggles = tex(512, 288, (g, w, h) => {
    g.fillStyle = '#0b0f19'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = 'rgba(255,255,255,0.7)'; g.fillRect(40, 56 + i * 76, 190 + i * 30, 14);
      g.fillStyle = i === 1 ? '#3a3f4a' : '#2997ff'; roundRect(g, 380, 40 + i * 76, 90, 46, 23); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(i === 1 ? 403 : 447, 63 + i * 76, 17, 0, 7); g.fill();
    }
  });
  const card = (t) => {
    const g = new THREE.Group();
    g.add(mesh(rb(1.9, 1.07, 0.05, 0.12), M.graphite));
    const p = plane(1.8, 1.0, t); p.position.z = 0.03; g.add(p);
    return g;
  };
  P.add(card(code), [1.9, 0.95, 0.5], [0, -0.35, 0.05], 0.45);
  P.add(card(chart), [-1.55, -0.2, 0.9], [0, 0.35, -0.04], 0.6);
  P.add(card(toggles), [1.75, -1.15, 1.1], [0, -0.3, 0.03], 0.75);
  return P;
}

/* ------------------------------------------------------------------ *
 *  7. Social media + ads: megaphone, heart, play, growth bars
 * ------------------------------------------------------------------ */
function buildSocial(M) {
  const P = makeProp(0.82);

  const mega = new THREE.Group();
  const cone = mesh(new THREE.CylinderGeometry(0.75, 0.22, 1.25, 40), M.white); cone.rotation.z = -Math.PI / 2; mega.add(cone);
  const rim = mesh(new THREE.TorusGeometry(0.75, 0.05, 14, 40), M.metal); rim.rotation.y = Math.PI / 2; rim.position.x = 0.62; mega.add(rim);
  const back = mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.4, 30), M.graphite); back.rotation.z = -Math.PI / 2; back.position.x = -0.78; mega.add(back);
  const handle = mesh(rb(0.22, 0.55, 0.22, 0.08), M.graphite); handle.position.set(-0.25, -0.62, 0); handle.rotation.z = 0.25; mega.add(handle);
  P.add(mega, [-0.9, 0.95, 0], [0, 0.3, 0.2], 0.0);

  [0, 1, 2].forEach((i) => {
    const arc = mesh(new THREE.TorusGeometry(0.55 + i * 0.32, 0.035, 10, 40, Math.PI * 0.7), glow(ACCENT, 2));
    arc.rotation.set(0, Math.PI / 2, -Math.PI * 0.35);
    P.add(arc, [-0.1 + i * 0.12, 1.1, 0.25], [0, 0.4, 0], 0.55 + i * 0.1, { dir: [1, 0.2, 0.2], dist: 2.5 });
  });

  const heartShape = new THREE.Shape();
  heartShape.moveTo(0, -0.5);
  heartShape.bezierCurveTo(-0.9, 0.1, -0.5, 0.75, 0, 0.35);
  heartShape.bezierCurveTo(0.5, 0.75, 0.9, 0.1, 0, -0.5);
  const heart = mesh(new THREE.ExtrudeGeometry(heartShape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 4, curveSegments: 24 }), glow(0xff3b7a, 1.7));
  P.add(heart, [1.75, 1.35, 0.2], [0, -0.3, 0.1], 0.35);

  const play = new THREE.Group();
  play.add(mesh(rb(1.15, 0.8, 0.14, 0.22), solid(0xe62d2d, 0.4, 0.1)));
  const tri = new THREE.Shape(); tri.moveTo(-0.14, -0.2); tri.lineTo(-0.14, 0.2); tri.lineTo(0.26, 0); tri.closePath();
  const t = mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.04, bevelEnabled: false }), solid(0xffffff, 0.4, 0)); t.position.z = 0.075; play.add(t);
  P.add(play, [1.7, 0.1, 0.6], [0, -0.35, -0.08], 0.5);

  P.add(mesh(rb(2.8, 0.07, 1.1, 0.03), M.graphite), [0, -1.55, 0.2], [0, 0, 0], 0.15);
  const heights = [0.5, 0.85, 1.15, 1.55, 2.0];
  heights.forEach((h, i) => {
    const g = new THREE.BoxGeometry(0.4, h, 0.4); g.translate(0, h / 2, 0);
    const m = i === 4 ? glow(ACCENT, 1.8) : solid(0x9ca3af, 0.3, 0.8);
    const bar = mesh(g, m);
    P.add(bar, [-0.95 + i * 0.5, -1.51, 0.2], [0, 0, 0], 0.55 + i * 0.07, { isStatic: true, fn: (q) => bar.scale.set(1, Math.max(q, 0.001), 1) });
  });
  const trend = new THREE.CatmullRomCurve3(heights.map((h, i) => new THREE.Vector3(-0.95 + i * 0.5, -1.51 + h + 0.25, 0.2)));
  const tg = new THREE.TubeGeometry(trend, 40, 0.03, 8, false);
  const tn = tg.index.count;
  P.add(mesh(tg, glow(0x30d158, 2)), [0, 0, 0], [0, 0, 0], 0.9, { isStatic: true, fn: (q) => tg.setDrawRange(0, Math.floor((q * tn) / 3) * 3) });
  return P;
}

export function buildProps() {
  const M = createMaterials();
  return [buildPcBuild(M), buildNetwork(M), buildShield(M), buildSecurity(M), buildPrinter(M), buildPhoneInstall(M), buildSocial(M)];
}
