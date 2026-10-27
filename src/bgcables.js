import * as THREE from 'three';

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => 1 - Math.pow(1 - x, 3);
const easeIn = (x) => x * x * x;

const SPECS = [
  { c: 0xff7a3d, pts: [[-11, 3.6], [-6, 4.4], [-1, 2.2], [4, 3.9], [11, 2.6]], r: 0.05, period: 11, phase: 0 },
  { c: 0x2de2a6, pts: [[11, 1.2], [6, 0.2], [1, 1.6], [-4, -0.2], [-11, 0.8]], r: 0.045, period: 13, phase: 3.1 },
  { c: 0xff4fa3, pts: [[-11, -1.6], [-5, -0.4], [0, -2.2], [5, -0.9], [11, -2.4]], r: 0.05, period: 10, phase: 6.2 },
  { c: 0xffb020, pts: [[11, -3.8], [5, -4.6], [-1, -3.0], [-6, -4.2], [-11, -3.4]], r: 0.04, period: 12, phase: 1.7 },
  { c: 0x8b5cf6, pts: [[-11, 5.6], [-4, 6.4], [2, 5.0], [8, 6.2], [11, 5.4]], r: 0.045, period: 14, phase: 8.4 },
  { c: 0x2997ff, pts: [[9, 2.4], [3, 3.2], [-2, 1.0], [-7, 2.2], [-11, 1.6]], r: 0.038, period: 9.5, phase: 4.6 },
  { c: 0x30d158, pts: [[-11, -5.4], [-3, -6.2], [3, -4.8], [9, -5.9], [11, -5.0]], r: 0.04, period: 12.5, phase: 10.2 },
];

/** Long coloured cables behind everything: they pull in, carry a pulse of light, then unplug and retract. */
export function createBgCables() {
  const group = new THREE.Group();
  group.position.z = -5;
  const RAD = 6;
  const SEG = 140;
  const stride = RAD * 6;
  const plugGeo = new THREE.BoxGeometry(0.2, 0.13, 0.3);
  const plugMat = new THREE.MeshStandardMaterial({ color: 0xcdd2da, metalness: 0.9, roughness: 0.3 });

  const cables = SPECS.map((s, i) => {
    const curve = new THREE.CatmullRomCurve3(s.pts.map(([x, y], k) => new THREE.Vector3(x, y, Math.sin(k + i) * 0.6)));
    const geo = new THREE.TubeGeometry(curve, SEG, s.r, RAD, false);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0b0d12, emissive: s.c, emissiveIntensity: 0.9, roughness: 0.5, metalness: 0.1, transparent: true, opacity: 0.34 });
    const tube = new THREE.Mesh(geo, mat);
    const head = new THREE.Mesh(plugGeo, plugMat);
    const tail = new THREE.Mesh(plugGeo, plugMat);
    const tipMat = new THREE.MeshBasicMaterial({ color: s.c, toneMapped: false });
    const tipA = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.05, 0.05), tipMat); tipA.position.z = 0.17; head.add(tipA);
    const tipB = tipA.clone(); tail.add(tipB);
    const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(s.c).lerp(new THREE.Color(0xffffff), 0.55), toneMapped: false }));
    group.add(tube, head, tail, pulse);
    return { s, curve, geo, tube, head, tail, pulse, mat };
  });

  const p = new THREE.Vector3();
  const tg = new THREE.Vector3();

  function place(obj, curve, f) {
    curve.getPointAt(clamp(f), p);
    curve.getTangentAt(clamp(f), tg);
    obj.position.copy(p);
    obj.lookAt(p.x + tg.x, p.y + tg.y, p.z + tg.z);
  }

  function update(time, scroll, narrow) {
    group.position.y = Math.sin(scroll * 0.0007) * 1.6;
    group.scale.setScalar(narrow ? 0.62 : 1);
    cables.forEach((c, i) => {
      const u = (((time + c.s.phase) / c.s.period) % 1 + 1) % 1;
      let h = 1, t = 0;
      if (u < 0.3) h = ease(u / 0.3);
      else if (u > 0.68) t = easeIn((u - 0.68) / 0.32);
      const a = Math.round(t * (SEG - 1));
      const b = Math.max(a + 1, Math.round(h * (SEG - 1)));
      c.geo.setDrawRange(a * stride, (b - a) * stride);
      place(c.head, c.curve, h);
      place(c.tail, c.curve, t);
      c.head.visible = h > 0.01;
      c.tail.visible = t > 0.005 || u < 0.3;
      if (c.tail.visible && t <= 0.005) place(c.tail, c.curve, 0);
      const holding = u >= 0.2 && u <= 0.8;
      c.pulse.visible = holding;
      if (holding) place(c.pulse, c.curve, t + (h - t) * ((time * 0.22 + i * 0.37) % 1));
      c.mat.emissiveIntensity = 0.6 + 0.35 * Math.sin(time * 2 + i);
    });
  }

  return { group, update };
}
