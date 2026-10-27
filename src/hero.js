import * as THREE from 'three';
import { createMaterials, rb, roundRect, mesh, glow, solid, basic } from './props.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };
const MAGENTA = 0xff4fa3;
const TEAL = 0x2de2a6;
const VIOLET = 0x8b5cf6;
const AMBER = 0xffb020;

/**
 * A laptop that opens itself up for maintenance: the keyboard deck lifts off, RAM,
 * SSD, fan and battery float out, then everything goes back and the screen boots.
 * sep: 0 = assembled, 1 = fully apart. Loops by itself; scroll can force it apart.
 */
export function buildLaptop() {
  const M = createMaterials();
  const group = new THREE.Group();
  const parts = [];
  const spinners = [];

  const part = (obj, home, dir, delay, spin = 0.5) => {
    obj.position.set(...home);
    group.add(obj);
    parts.push({ obj, home: new THREE.Vector3(...home), dir: new THREE.Vector3(...dir), delay, spin, rot0: obj.rotation.clone() });
    return obj;
  };

  // bottom case
  group.add(mesh(rb(3.3, 0.1, 2.3, 0.06), M.metal));
  const rim = mesh(new THREE.BoxGeometry(3.0, 0.012, 0.012), glow(VIOLET, 2.6)); rim.position.set(0, 0.052, 1.1); group.add(rim);

  // motherboard + CPU
  const board = new THREE.Group();
  board.add(mesh(rb(1.5, 0.035, 1.3, 0.02), solid(0x0c3b2e, 0.5, 0.2)));
  const cpu = mesh(rb(0.36, 0.05, 0.36, 0.012), M.metal); cpu.position.set(0, 0.04, 0); board.add(cpu);
  for (let i = 0; i < 5; i++) { const c = mesh(rb(0.14, 0.04, 0.14, 0.01), M.dark); c.position.set(-0.55 + i * 0.26, 0.035, 0.45); board.add(c); }
  part(board, [-0.7, 0.085, 0.0], [-0.4, 1.4, 0.1], 0.5, 0.25);

  // fan with glowing blades
  const fan = new THREE.Group();
  fan.add(mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.08, 36), M.dark));
  const ring = mesh(new THREE.TorusGeometry(0.37, 0.018, 8, 40), glow(MAGENTA, 2.6)); ring.rotation.x = Math.PI / 2; ring.position.y = 0.045; fan.add(ring);
  const blades = new THREE.Group();
  for (let i = 0; i < 7; i++) { const b = mesh(new THREE.BoxGeometry(0.22, 0.015, 0.07), M.metal); b.position.x = 0.16; const pv = new THREE.Group(); pv.rotation.y = (i / 7) * Math.PI * 2; pv.add(b); blades.add(pv); }
  blades.position.y = 0.05; fan.add(blades); spinners.push(blades);
  part(fan, [1.05, 0.1, -0.55], [2.0, 1.9, -0.9], 0.2, 0.3);

  // battery
  const bat = new THREE.Group();
  bat.add(mesh(rb(1.5, 0.07, 0.55, 0.03), M.graphite));
  const bs = mesh(new THREE.BoxGeometry(1.3, 0.012, 0.05), glow(TEAL, 2.2)); bs.position.y = 0.04; bat.add(bs);
  part(bat, [-0.1, 0.095, 0.82], [0.5, 1.2, 2.3], 0.1, 0.2);

  // RAM x2
  [0, 1].forEach((i) => {
    const ram = new THREE.Group();
    ram.add(mesh(rb(0.72, 0.028, 0.15, 0.01), solid(0x14213d, 0.4, 0.3)));
    for (let k = 0; k < 4; k++) { const c = mesh(new THREE.BoxGeometry(0.1, 0.02, 0.1), M.dark); c.position.set(-0.24 + k * 0.16, 0.022, 0); ram.add(c); }
    const st = mesh(new THREE.BoxGeometry(0.6, 0.01, 0.025), glow(i ? TEAL : MAGENTA, 2.4)); st.position.set(0, 0.03, 0.05); ram.add(st);
    part(ram, [0.95, 0.1 + i * 0.045, 0.35 + i * 0.0], [2.4, 1.0 + i * 0.7, 0.9 + i * 0.5], 0.3 + i * 0.1, 0.4);
  });

  // SSD
  const ssd = new THREE.Group();
  ssd.add(mesh(rb(0.62, 0.03, 0.2, 0.012), M.graphite));
  const lab = mesh(new THREE.BoxGeometry(0.4, 0.01, 0.1), glow(AMBER, 2.0)); lab.position.y = 0.02; ssd.add(lab);
  part(ssd, [0.2, 0.1, -0.85], [-1.2, 1.6, -1.7], 0.4, 0.5);

  // keyboard deck: lifts off, keys glow in a wave
  const keys = (() => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 267; const g = c.getContext('2d');
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    let last = -1;
    return {
      tex: t,
      update(time) {
        const k = Math.floor(time * 8); if (k === last) return; last = k;
        g.setTransform(512 / 768, 0, 0, 512 / 768, 0, 0);
        g.fillStyle = '#12141a'; g.fillRect(0, 0, 768, 400);
        for (let r = 0; r < 5; r++) for (let col = 0; col < 14; col++) {
          g.fillStyle = `hsl(${(col * 20 + time * 80) % 360} 75% ${34 + 14 * Math.sin(time * 3 + col * 0.5 + r)}%)`;
          roundRect(g, 18 + col * 52, 18 + r * 56, 46, 46, 8); g.fill();
        }
        g.fillStyle = 'rgba(255,255,255,0.06)'; roundRect(g, 250, 300, 270, 80, 12); g.fill();
        t.needsUpdate = true;
      },
    };
  })();
  keys.update(0);
  const deck = new THREE.Group();
  deck.add(mesh(rb(3.3, 0.07, 2.3, 0.05), M.graphite));
  const kt = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.55), basic(keys.tex)); kt.rotation.x = -Math.PI / 2; kt.position.set(0, 0.037, -0.25); deck.add(kt);
  const pad = mesh(rb(1.1, 0.012, 0.6, 0.03), solid(0x3a3d46, 0.3, 0.6)); pad.position.set(0, 0.04, 0.82); deck.add(pad);
  part(deck, [0, 0.19, 0], [0, 2.9, 1.2], 0.0, 0.15);

  // screws
  [[-1.55, -1.05], [1.55, -1.05], [-1.55, 1.05], [1.55, 1.05]].forEach(([x, z], i) => {
    const s = mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.05, 12), glow(AMBER, 2.2));
    part(s, [x, 0.24, z], [x * 0.5, 2.8, z * 0.8], 0.55 + i * 0.05, 1.5);
  });

  // lid + screen with boot sequence
  const screen = (() => {
    const c = document.createElement('canvas'); c.width = 640; c.height = 400; const g = c.getContext('2d');
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    let last = -1;
    return {
      tex: t,
      update(time, sep, boot) {
        const k = Math.floor(time * 10); if (k === last) return; last = k;
        g.setTransform(0.8, 0, 0, 0.8, 0, 0);
        const w = 800, h = 500;
        if (sep > 0.04) {
          g.fillStyle = '#0a0713'; g.fillRect(0, 0, w, h);
          g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h / 2 - 20, 54, 0, 7); g.stroke();
          g.strokeStyle = '#ff4fa3'; g.lineCap = 'round'; g.beginPath(); g.arc(w / 2, h / 2 - 20, 54, time * 4, time * 4 + 1.6); g.stroke();
          g.fillStyle = 'rgba(255,255,255,0.8)'; g.font = '600 30px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('Maintenance mode', w / 2, h / 2 + 90);
          g.fillStyle = 'rgba(255,255,255,0.45)'; g.font = '22px Inter, sans-serif'; g.fillText('upgrading RAM · SSD · cooling', w / 2, h / 2 + 128);
        } else if (boot < 1) {
          g.fillStyle = '#05060a'; g.fillRect(0, 0, w, h);
          g.fillStyle = '#f3f4f6'; g.font = '700 64px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('TiTANiUM', w / 2, h / 2 - 10);
          g.fillStyle = 'rgba(255,255,255,0.14)'; roundRect(g, w / 2 - 190, h / 2 + 34, 380, 10, 5); g.fill();
          const gr = g.createLinearGradient(w / 2 - 190, 0, w / 2 + 190, 0); gr.addColorStop(0, '#8b5cf6'); gr.addColorStop(1, '#ff4fa3');
          g.fillStyle = gr; roundRect(g, w / 2 - 190, h / 2 + 34, Math.max(10, 380 * boot), 10, 5); g.fill();
        } else {
          const bg = g.createLinearGradient(0, 0, w, h); bg.addColorStop(0, '#1b0f3d'); bg.addColorStop(0.55, '#5b2bd6'); bg.addColorStop(1, '#ff4fa3');
          g.fillStyle = bg; g.fillRect(0, 0, w, h);
          g.fillStyle = 'rgba(255,255,255,0.93)'; roundRect(g, 60, 60, 360, 270, 16); g.fill();
          g.fillStyle = '#e6e9f2'; g.fillRect(60, 60, 360, 36);
          ['#ff5f57', '#febc2e', '#28c840'].forEach((cc, i) => { g.fillStyle = cc; g.beginPath(); g.arc(84 + i * 22, 78, 6.5, 0, 7); g.fill(); });
          g.fillStyle = '#8b5cf6'; for (let i = 0; i < 5; i++) g.fillRect(86, 124 + i * 38, 110 + ((i * 53) % 170), 13);
          g.fillStyle = 'rgba(10,12,24,0.8)'; roundRect(g, 450, 110, 300, 220, 16); g.fill();
          g.strokeStyle = '#2de2a6'; g.lineWidth = 6; g.beginPath(); g.moveTo(474, 300);
          [[520, 250], [570, 270], [620, 200], [670, 220], [724, 150]].forEach(([x, y]) => g.lineTo(x, y)); g.stroke();
          g.fillStyle = 'rgba(8,10,20,0.6)'; g.fillRect(0, h - 48, w, 48);
          g.fillStyle = '#fff'; g.beginPath(); g.arc(30, h - 24, 10, 0, 7); g.fill();
        }
        t.needsUpdate = true;
      },
    };
  })();
  const lid = new THREE.Group();
  lid.add(mesh(rb(3.3, 2.2, 0.07, 0.05), M.metal).translateY(1.1));
  const bezel = mesh(rb(3.2, 2.1, 0.01, 0.04), M.dark); bezel.position.set(0, 1.1, 0.04); lid.add(bezel);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 1.88), basic(screen.tex)); scr.position.set(0, 1.1, 0.05); lid.add(scr);
  const logo = mesh(new THREE.CircleGeometry(0.1, 24), glow(VIOLET, 2.4)); logo.rotation.y = Math.PI; logo.position.set(0, 1.1, -0.05); lid.add(logo);
  lid.position.set(0, 0.1, -1.1);
  lid.rotation.x = -0.28;
  group.add(lid);

  group.position.y = -0.4;
  group.scale.setScalar(0.8);

  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const tmp = new THREE.Vector3();
  const CYCLE = 13;
  const loopSep = (t) => (t < 1.5 ? 0 : t < 4 ? sm(1.5, 4, t) : t < 7 ? 1 : t < 9.5 ? 1 - sm(7, 9.5, t) : 0);

  function update(time, scrollSep = 0) {
    const t = (time + 5.8) % CYCLE;
    const loop = loopSep(t);
    const sep = Math.max(loop, scrollSep);
    const boot = t >= 9.5 ? clamp((t - 9.5) / 1.8) : 1;
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const q = ease(clamp((sep - p.delay * 0.35) / 0.65));
      const bob = Math.sin(time * 1.4 + i * 1.3) * 0.07 * q;
      tmp.copy(p.dir).multiplyScalar(q);
      p.obj.position.set(p.home.x + tmp.x, p.home.y + tmp.y + bob, p.home.z + tmp.z);
      p.obj.rotation.set(p.rot0.x + q * p.spin * 0.6, p.rot0.y + q * p.spin * 0.9, p.rot0.z + q * p.spin * 0.3);
    }
    lid.rotation.x = -0.28 - 0.18 * sep;
    spinners.forEach((s) => { s.rotation.y = time * (3 + sep * 6); });
    if (group.visible) { keys.update(time); screen.update(time, sep, boot); }
    return sep;
  }

  const mats = new Set();
  group.traverse((o) => { if (o.material) { mats.add(o.material); o.material.transparent = true; } });
  let lastO = -1;
  function setOpacity(o) {
    if (Math.abs(o - lastO) < 0.004) return;
    lastO = o;
    mats.forEach((m) => { m.opacity = o; });
    group.visible = o > 0.004;
  }

  return { group, update, setOpacity };
}
