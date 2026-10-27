import * as THREE from 'three';
import { asset } from './assets.js';
import { roundRect } from './props.js';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (a, b, v) => { const x = clamp((v - a) / (b - a)); return x * x * (3 - 2 * x); };

/**
 * A real laptop that opens itself up for maintenance: RAM, the cooling fan, the
 * motherboard and a USB stick float out of it, hover, then slide back in while
 * the screen goes from "maintenance" to a boot sequence.
 * sep: 0 = assembled, 1 = fully apart. Loops on its own; scroll can force it apart.
 */
export function buildLaptop() {
  const group = new THREE.Group();
  const mats = new Set();
  let opacity = 1;
  const track = (g) => g.traverse((o) => {
    if (o.material) { o.material.transparent = true; o.material.opacity = opacity; mats.add(o.material); }
  });

  // live screen drawn onto the laptop's lid
  const cv = document.createElement('canvas');
  cv.width = 640; cv.height = 400;
  const g2 = cv.getContext('2d');
  const screenTex = new THREE.CanvasTexture(cv);
  screenTex.colorSpace = THREE.SRGBColorSpace;
  screenTex.anisotropy = 4;
  let lastK = -1;
  function drawScreen(time, sep, boot) {
    const k = Math.floor(time * 10);
    if (k === lastK) return;
    lastK = k;
    const g = g2;
    g.setTransform(0.8, 0, 0, 0.8, 0, 0);
    const w = 800, h = 500;
    if (sep > 0.04) {
      g.fillStyle = '#0a0713'; g.fillRect(0, 0, w, h);
      g.strokeStyle = 'rgba(255,255,255,0.12)'; g.lineWidth = 10; g.beginPath(); g.arc(w / 2, h / 2 - 20, 54, 0, 7); g.stroke();
      g.strokeStyle = '#ff4fa3'; g.lineCap = 'round'; g.beginPath(); g.arc(w / 2, h / 2 - 20, 54, time * 4, time * 4 + 1.6); g.stroke();
      g.fillStyle = 'rgba(255,255,255,0.85)'; g.font = '600 32px Inter, sans-serif'; g.textAlign = 'center'; g.fillText('Maintenance mode', w / 2, h / 2 + 92);
      g.fillStyle = 'rgba(255,255,255,0.45)'; g.font = '22px Inter, sans-serif'; g.fillText('upgrading RAM · cooling · board', w / 2, h / 2 + 130);
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
    screenTex.needsUpdate = true;
  }
  drawScreen(0, 0, 1);

  const laptop = asset('laptop', {
    size: 3.5,
    rot: [0, Math.PI / 2, 0],
    ownMaterials: true,
    prep(raw) {
      // the model's lid leans back ~25°; lay the screen texture over its inner face
      const th = Math.atan(0.051 / 0.11);
      const n = new THREE.Vector3(-Math.cos(th), Math.sin(th), 0);
      const u = new THREE.Vector3(Math.sin(th), Math.cos(th), 0);
      const x = new THREE.Vector3().crossVectors(u, n);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.115), new THREE.MeshBasicMaterial({ map: screenTex, toneMapped: false }));
      m.matrixAutoUpdate = false;
      m.matrix.makeBasis(x, u, n);
      m.matrix.setPosition(0.0925, 0.065, 0.0035);
      raw.add(m);
    },
    onLoad: track,
  });
  group.add(laptop);

  // parts that come out of the laptop
  const parts = [];
  const part = (name, size, rot, away, delay, spin, extra = {}) => {
    const holder = new THREE.Group();
    const a = asset(name, { size, rot, ownMaterials: true, onLoad: track, ...extra });
    holder.add(a);
    group.add(holder);
    parts.push({ holder, a, away: new THREE.Vector3(...away), home: new THREE.Vector3(0, 0.3, 0.2), delay, spin });
  };
  part('ram', 1.5, [0, 0, 0], [-3.4, 1.7, 1.4], 0.0, 0.7);
  part('ram', 1.5, [0, 0, 0], [-3.7, 0.5, 1.9], 0.12, -0.6);
  part('cooler', 1.1, [0.5, 0, 0], [3.4, 2.0, 1.2], 0.2, 1.0);
  part('motherboard', 1.6, [0.3, 0.6, 0.1], [3.5, -0.4, 1.8], 0.3, 0.5);
  part('usb', 1.2, [0.2, 0.4, 0], [-3.0, -1.2, 2.0], 0.4, 0.8);

  group.position.y = -0.3;
  group.scale.setScalar(0.82);

  const ease = (x) => 1 - Math.pow(1 - x, 3);
  const CYCLE = 13;
  const loopSep = (t) => (t < 1.5 ? 0 : t < 4 ? sm(1.5, 4, t) : t < 7 ? 1 : t < 9.5 ? 1 - sm(7, 9.5, t) : 0);

  function update(time, scrollSep = 0) {
    const t = (time + 5.8) % CYCLE;
    const sep = Math.max(loopSep(t), scrollSep);
    const boot = t >= 9.5 ? clamp((t - 9.5) / 1.8) : 1;
    parts.forEach((p, i) => {
      const q = ease(clamp((sep - p.delay * 0.35) / 0.65));
      p.holder.visible = q > 0.01;
      p.holder.position.lerpVectors(p.home, p.away, q);
      p.holder.position.y += Math.sin(time * 1.3 + i * 1.7) * 0.09 * q;
      p.holder.scale.setScalar(0.04 + 0.96 * q);
      p.holder.rotation.set(0.5 * q * p.spin, time * 0.5 * p.spin * q + q * 1.4, 0.3 * q * p.spin);
    });
    if (group.visible) drawScreen(time, sep, boot);
    return sep;
  }

  function setOpacity(o) {
    if (Math.abs(o - opacity) < 0.004) return;
    opacity = o;
    mats.forEach((m) => { m.opacity = o; });
    group.visible = o > 0.004;
  }

  return { group, update, setOpacity };
}
