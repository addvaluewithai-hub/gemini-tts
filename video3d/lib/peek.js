// PEEK in real 3D, built from primitives so he is the same in every Short.
// Design: brand/peek (pink pear head, small blue heavy-lidded eyes, nose bump, two front teeth, black wide-brim hat
// with a pink band and a PRESS card, two pink ball-tipped antennae, beige belted trench coat, red tie, black shoes).
// About 1.3 units tall. The origin is between his feet; he faces +z.
//
//   const peek = makePeek(); scene.add(peek.root);
//   peek.pose({ lid: 0.55, look: [0, 0], brow: 0, mouthOpen: 0, smile: 0.6, runPhase: 0, run: 0,
//               armsOut: 0, wide: 0, headYaw: 0, headPitch: 0, headRoll: 0, lean: 0, bob: 0, antenna: [0, 0] });
import * as THREE from "three";
import { lathe, smoothProfile, canvasTexture, noiseTexture, lerp } from "./util.js";

const PINK = "#ff4fa3";

function mats() {
  const fabricRough = noiseTexture({ seed: 11, lo: 0.7, hi: 0.95 });
  fabricRough.repeat.set(3, 3);
  const skinRough = noiseTexture({ seed: 12, lo: 0.32, hi: 0.5, blotches: 120 });
  return {
    skin: new THREE.MeshPhysicalMaterial({ color: PINK, roughness: 0.42, roughnessMap: skinRough, clearcoat: 0.25,
      clearcoatRoughness: 0.35, sheen: 0.6, sheenColor: new THREE.Color("#ffd0ea"), sheenRoughness: 0.5 }),
    lid: new THREE.MeshPhysicalMaterial({ color: "#ec3f92", roughness: 0.45, sheen: 0.5, sheenColor: new THREE.Color("#ffc4e2") }),
    dark: new THREE.MeshStandardMaterial({ color: "#5c0f37", roughness: 0.6 }),
    mouth: new THREE.MeshStandardMaterial({ color: "#3a0820", roughness: 0.7 }),
    white: new THREE.MeshPhysicalMaterial({ color: "#fbfbff", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05 }),
    tooth: new THREE.MeshPhysicalMaterial({ color: "#fffdf4", roughness: 0.25, clearcoat: 0.6 }),
    iris: new THREE.MeshPhysicalMaterial({ color: "#2f8fe0", roughness: 0.2, clearcoat: 1, emissive: "#0a2f66", emissiveIntensity: 0.25 }),
    pupil: new THREE.MeshStandardMaterial({ color: "#05070c", roughness: 0.2 }),
    glint: new THREE.MeshBasicMaterial({ color: "#ffffff" }),
    hat: new THREE.MeshPhysicalMaterial({ color: "#16161c", roughness: 0.8, sheen: 1, sheenColor: new THREE.Color("#4a4a5a"), sheenRoughness: 0.8 }),
    band: new THREE.MeshStandardMaterial({ color: "#ff3d9a", roughness: 0.5 }),
    coat: new THREE.MeshPhysicalMaterial({ color: "#c9a274", roughness: 0.9, roughnessMap: fabricRough, sheen: 0.6, sheenColor: new THREE.Color("#f3dcb8") }),
    coatDark: new THREE.MeshStandardMaterial({ color: "#a37d52", roughness: 0.9 }),
    gold: new THREE.MeshStandardMaterial({ color: "#e0b440", metalness: 1, roughness: 0.3 }),
    tie: new THREE.MeshStandardMaterial({ color: "#a3162b", roughness: 0.55 }),
    shirt: new THREE.MeshStandardMaterial({ color: "#2a2340", roughness: 0.7 }),
    shoe: new THREE.MeshPhysicalMaterial({ color: "#0d0d12", roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 }),
    leg: new THREE.MeshStandardMaterial({ color: "#151520", roughness: 0.7 }),
  };
}

function pressCard() {
  const tex = canvasTexture(256, 140, (g, w, h) => {
    g.fillStyle = "#f4ead0"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "#c9b98f"; g.lineWidth = 6; g.strokeRect(4, 4, w - 8, h - 8);
    g.fillStyle = "#1b1b1b"; g.font = "bold 74px Inter, Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText("PRESS", w / 2, h / 2 + 4);
  });
  return new THREE.MeshStandardMaterial({ map: tex, roughness: 0.8 });
}

const sph = (r, m, ws = 32, hs = 24) => new THREE.Mesh(new THREE.SphereGeometry(r, ws, hs), m);
const cap = (r, len, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 8, 16), m);

function eye(m, side) {
  const g = new THREE.Group();
  const ball = sph(0.068, m.white, 40, 30); g.add(ball);
  const look = new THREE.Group(); g.add(look);
  const iris = sph(0.036, m.iris, 32, 24); iris.scale.set(1, 1, 0.45); iris.position.z = 0.058; look.add(iris);
  const pupil = sph(0.018, m.pupil, 24, 16); pupil.scale.set(1, 1, 0.5); pupil.position.z = 0.0665; look.add(pupil);
  const glint = sph(0.0075, m.glint, 12, 8); glint.position.set(-0.012, 0.014, 0.071); look.add(glint);
  // Upper lid: a shell slightly bigger than the ball; rotating it about x closes the eye.
  const lidG = new THREE.Group(); g.add(lidG);
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.0745, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), m.lid);
  lidG.add(lid);
  const lidEdge = new THREE.Mesh(new THREE.TorusGeometry(0.0745, 0.006, 8, 48, Math.PI), m.dark);
  lidEdge.rotation.x = Math.PI / 2; lidEdge.rotation.z = Math.PI; lidG.add(lidEdge);
  const lower = new THREE.Group(); g.add(lower);
  const lowLid = new THREE.Mesh(new THREE.SphereGeometry(0.073, 32, 12, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28), m.lid);
  lower.add(lowLid);
  return { g, look, pupil, iris, lidG, lower, side };
}

export function makePeek() {
  const m = mats();
  const root = new THREE.Group(); root.name = "peek";
  const body = new THREE.Group(); root.add(body); // bobs and leans

  // --- coat
  const coatProfile = smoothProfile([[0.0, 0.095], [0.27, 0.10], [0.285, 0.15], [0.272, 0.27], [0.25, 0.38], [0.22, 0.47], [0.16, 0.545], [0.09, 0.58], [0.0, 0.585]], 50);
  const coat = new THREE.Mesh(lathe(coatProfile, 64), m.coat); coat.scale.z = 0.86; coat.castShadow = true; body.add(coat);
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.276, 0.012, 8, 64), m.coatDark); hem.rotation.x = Math.PI / 2; hem.position.y = 0.105; hem.scale.y = 0.86; body.add(hem);
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.275, 0.279, 0.05, 64, 1, true), m.coatDark); belt.position.y = 0.25; belt.scale.z = 0.87; body.add(belt);
  const buckle = new THREE.Group(); buckle.position.set(0, 0.25, 0.243); body.add(buckle);
  [[0, 0.022, 0.07, 0.012], [0, -0.022, 0.07, 0.012], [-0.03, 0, 0.012, 0.055], [0.03, 0, 0.012, 0.055]].forEach(([x, y, w, h]) => {
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), m.gold); b.position.set(x, y, 0); buckle.add(b);
  });
  for (const y of [0.34, 0.42]) { const bt = sph(0.012, m.coatDark, 12, 8); bt.position.set(0.05, y, 0.222 - (y - 0.34) * 0.35); body.add(bt); }
  for (const s of [-1, 1]) {
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.015), m.coatDark);
    pocket.position.set(s * 0.15, 0.17, 0.215); pocket.rotation.y = s * 0.45; body.add(pocket);
  }
  // collar and lapels, the shirt and the tie in the V
  const vee = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.13, 3), m.shirt); vee.rotation.z = Math.PI; vee.position.set(0, 0.5, 0.17); vee.scale.z = 0.3; body.add(vee);
  const tie = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 4), m.tie); tie.rotation.z = Math.PI; tie.position.set(0, 0.49, 0.19); tie.scale.z = 0.4; body.add(tie);
  for (const s of [-1, 1]) {
    const lap = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.16, 0.025), m.coat);
    lap.position.set(s * 0.065, 0.5, 0.175); lap.rotation.set(-0.35, s * 0.35, s * 0.45); lap.castShadow = true; body.add(lap);
  }
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.04, 12, 40), m.coat); collar.rotation.x = Math.PI / 2 - 0.15; collar.position.y = 0.56; collar.scale.y = 0.85; body.add(collar);

  // --- legs
  const legs = [-1, 1].map((s) => {
    const hip = new THREE.Group(); hip.position.set(s * 0.09, 0.15, 0); root.add(hip);
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.045, 0.11, 16), m.leg); leg.position.y = -0.055; hip.add(leg);
    const shoe = sph(0.07, m.shoe); shoe.scale.set(0.85, 0.55, 1.3); shoe.position.set(0, -0.11, 0.03); shoe.castShadow = true; hip.add(shoe);
    return hip;
  });

  // --- arms: shoulder -> elbow -> hand
  const arms = [-1, 1].map((s) => {
    const shoulder = new THREE.Group(); shoulder.position.set(s * 0.215, 0.47, 0); body.add(shoulder);
    const upper = cap(0.055, 0.14, m.coat); upper.position.y = -0.085; upper.castShadow = true; shoulder.add(upper);
    const elbow = new THREE.Group(); elbow.position.y = -0.17; shoulder.add(elbow);
    const fore = cap(0.05, 0.13, m.coat); fore.position.y = -0.075; fore.castShadow = true; elbow.add(fore);
    const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.012, 8, 24), m.coatDark); cuff.rotation.x = Math.PI / 2; cuff.position.y = -0.15; elbow.add(cuff);
    const hand = new THREE.Group(); hand.position.y = -0.19; elbow.add(hand);
    const palm = sph(0.05, m.skin); palm.scale.set(1, 0.9, 0.75); hand.add(palm);
    [-0.025, 0, 0.025].forEach((x, i) => { const f = cap(0.015, 0.035, m.skin); f.position.set(x, -0.05 - (i === 1 ? 0.005 : 0), 0.008); hand.add(f); });
    const thumb = cap(0.015, 0.03, m.skin); thumb.position.set(-s * 0.045, -0.01, 0.02); thumb.rotation.z = s * 0.9; hand.add(thumb);
    return { shoulder, elbow, hand, s };
  });

  // --- head (pivot at the neck)
  const neck = new THREE.Group(); neck.position.y = 0.53; body.add(neck);
  const head = new THREE.Group(); neck.add(head);
  const headProfile = smoothProfile([[0, 0], [0.17, 0.012], [0.275, 0.07], [0.312, 0.15], [0.295, 0.24], [0.235, 0.33], [0.195, 0.4], [0.155, 0.46], [0.07, 0.505], [0, 0.512]], 60);
  const skull = new THREE.Mesh(lathe(headProfile, 72), m.skin); skull.scale.z = 0.92; skull.castShadow = true; head.add(skull);
  // freckle spots, as in the drawings
  [[0.2, 0.36, 0.5], [0.23, 0.33, 0.62], [-0.21, 0.35, 0.55]].forEach(([x, y, a]) => {
    const d = sph(0.008, m.lid, 8, 6); d.position.set(x, y, Math.sqrt(Math.max(0, 0.235 ** 2 - x * x)) * 0.92 * 0.98); d.scale.z = 0.4; head.add(d);
  });
  const eyes = [-1, 1].map((s) => {
    const e = eye(m, s); e.g.position.set(s * 0.092, 0.3, 0.188); e.g.rotation.y = s * 0.22; head.add(e.g); return e;
  });
  const brows = eyes.map((e) => {
    const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.055, 0, 0), new THREE.Vector3(0, 0.018, 0.01), new THREE.Vector3(0.055, 0, 0));
    const b = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.009, 8), m.dark);
    const g = new THREE.Group(); g.add(b); g.position.set(e.g.position.x, 0.392, 0.205); g.rotation.y = e.side * 0.25; head.add(g); return g;
  });
  const nose = sph(0.04, m.skin); nose.position.set(0, 0.215, 0.262); head.add(nose);
  // mouth: a smile line, a dark opening for speech, two big teeth
  const mouth = new THREE.Group(); mouth.position.set(0, 0.13, 0.272); mouth.rotation.x = -0.3; head.add(mouth);
  const smileCurve = (k) => new THREE.QuadraticBezierCurve3(new THREE.Vector3(-0.1, 0.025 * k, -0.008), new THREE.Vector3(0, -0.035 * k, 0.03), new THREE.Vector3(0.1, 0.025 * k, -0.008));
  const smile = new THREE.Mesh(new THREE.TubeGeometry(smileCurve(1), 24, 0.009, 8), m.dark); mouth.add(smile);
  const opening = sph(0.06, m.mouth); opening.scale.set(1, 0.02, 0.25); opening.position.set(0, -0.02, 0.006); mouth.add(opening);
  const teeth = new THREE.Group(); teeth.position.set(0, -0.016, 0.016); mouth.add(teeth);
  [-1, 1].forEach((s) => { const t = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.034, 0.012), m.tooth); t.position.set(s * 0.0145, -0.012, 0); teeth.add(t); });

  // --- hat with band, PRESS card and antennae
  const hat = new THREE.Group(); hat.position.y = 0.42; hat.rotation.set(-0.06, 0, 0.05); head.add(hat);
  const crown = new THREE.Mesh(lathe(smoothProfile([[0.212, 0], [0.207, 0.08], [0.195, 0.15], [0.16, 0.2], [0.0, 0.212]], 30), 64), m.hat); crown.castShadow = true; hat.add(crown);
  const brim = new THREE.Mesh(lathe([[0.2, 0.012], [0.33, 0.0], [0.385, -0.006], [0.392, 0.004], [0.34, 0.016], [0.2, 0.026]], 72), m.hat); brim.castShadow = true; hat.add(brim);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.212, 0.214, 0.05, 64, 1, true), m.band); band.position.y = 0.045; hat.add(band);
  const card = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.055), pressCard()); card.position.set(0.09, 0.06, 0.196); card.rotation.set(-0.05, 0.42, -0.12); hat.add(card);
  const antennae = [-1, 1].map((s) => {
    const base = new THREE.Group(); base.position.set(s * 0.1, 0.15, 0); hat.add(base);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.05, 0.14, 0.0), new THREE.Vector3(s * 0.12, 0.3, 0.01)]);
    const stalk = new THREE.Mesh(new THREE.TubeGeometry(curve, 20, 0.011, 8), m.skin); base.add(stalk);
    const ball = sph(0.036, m.skin); ball.position.set(s * 0.125, 0.315, 0.01); base.add(ball);
    return base;
  });

  const rig = { root, body, neck, head, eyes, brows, mouth, smile, opening, teeth, hat, antennae, legs, arms, mats: m };

  rig.pose = (p = {}) => {
    const q = { lid: 0.55, look: [0, 0], brow: 0, browTilt: 0, mouthOpen: 0, smile: 0.6, runPhase: 0, run: 0, armsOut: 0, armsUp: 0,
      wide: 0, headYaw: 0, headPitch: 0, headRoll: 0, lean: 0, bob: 0, antenna: [0, 0], squash: 0, legsTuck: 0, ...p };
    // eyes: lid 0 = wide open, 1 = shut; "wide" also shrinks the pupils (fright)
    eyes.forEach((e) => {
      const lid = q.lidL !== undefined && e.side < 0 ? q.lidL : q.lidR !== undefined && e.side > 0 ? q.lidR : q.lid;
      e.lidG.rotation.x = lerp(-1.35, 1.55, lid);
      e.lower.rotation.x = lerp(0.05, -0.12, q.wide);
      e.look.rotation.set(-q.look[1] * 0.45, q.look[0] * 0.5, 0);
      const ps = lerp(1, 0.55, q.wide); e.pupil.scale.set(ps, ps, 0.5);
      e.g.scale.setScalar(1 + q.wide * 0.12);
    });
    brows.forEach((b, i) => { const s = i ? 1 : -1; b.position.y = 0.392 + q.brow * 0.035 + q.wide * 0.02; b.rotation.z = s * q.browTilt * 0.4; });
    // mouth
    const open = Math.max(0, q.mouthOpen);
    rig.opening.scale.set(lerp(0.75, 0.9, open), 0.02 + open * 0.6, 0.25);
    rig.opening.position.y = -0.02 - open * 0.02;
    rig.teeth.position.y = -0.016 + open * 0.004; rig.teeth.position.z = 0.016;
    rig.smile.scale.set(1, lerp(-0.6, 1.2, q.smile), 1);
    // head
    head.rotation.set(q.headPitch, q.headYaw, q.headRoll);
    // body: run cycle, lean, bob, squash
    const ph = q.runPhase, r = q.run;
    const lean = q.lean + r * 0.28, HIP = 0.15; // lean pivots at the hips
    body.rotation.x = lean;
    body.position.set(0, q.bob + r * Math.abs(Math.sin(ph)) * 0.06 + HIP * (1 - Math.cos(lean)), -HIP * Math.sin(lean));
    body.scale.set(1 + q.squash * 0.5, 1 - q.squash, 1 + q.squash * 0.5);
    legs.forEach((hip, i) => {
      const s = i ? 1 : -1;
      hip.rotation.x = r * Math.sin(ph + (i ? Math.PI : 0)) * 0.95 - q.legsTuck * 0.9;
      hip.position.y = 0.15 + r * Math.max(0, Math.sin(ph + (i ? Math.PI : 0))) * 0.04 + q.legsTuck * 0.06;
      hip.rotation.z = s * q.armsOut * 0.25;
    });
    arms.forEach((a, i) => {
      const swing = r * Math.sin(ph + (i ? 0 : Math.PI)) * 1.1;
      a.shoulder.rotation.x = -swing - q.armsUp * 2.6;
      a.shoulder.rotation.z = a.s * (0.22 + q.armsOut * 1.25);
      a.elbow.rotation.x = -(r * 1.3 + (1 - q.armsOut) * 0.1) * (1 - q.armsUp * 0.7);
      a.hand.rotation.y = a.s * q.armsOut * 0.6;
    });
    // antennae lag behind the motion (secondary action)
    antennae.forEach((b, i) => {
      const s = i ? 1 : -1;
      b.rotation.x = q.antenna[1] + r * Math.cos(ph * 2) * 0.18;
      b.rotation.z = s * q.wide * 0.25 + q.antenna[0];
    });
  };
  rig.pose();
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return rig;
}
