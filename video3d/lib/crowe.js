// AGENT CROWE: the tall, lanky government agent who hunts Peek (approved look: long narrow face, oversized square
// jaw, grey-black hair, stubble, black aviators, coiled earpiece, black suit too short at the wrists, narrow tie,
// a clunky alien detector with a green screen). About 2 units tall; origin between his feet; faces +z.
// His right hand holds a flashlight with a real spotlight (crowe.beam), aimed by crowe.beamTarget.
import * as THREE from "three";
import { lathe, smoothProfile, noiseTexture, lerp } from "./util.js";

// A rounded box: a sphere pushed toward a cube (p < 1 = squarer), so jaws and hair read as cartoon forms.
function superEllipsoid(rx, ry, rz, p = 0.55, seg = 32) {
  const g = new THREE.SphereGeometry(1, seg, seg * 0.75);
  const pos = g.attributes.position; const v = new THREE.Vector3();
  const f = (x) => Math.sign(x) * Math.pow(Math.abs(x), p);
  for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); pos.setXYZ(i, f(v.x) * rx, f(v.y) * ry, f(v.z) * rz); }
  g.computeVertexNormals(); return g;
}

export function makeCrowe() {
  const stubble = noiseTexture({ seed: 21, lo: 0.55, hi: 0.95, blotches: 400 });
  const m = {
    skin: new THREE.MeshPhysicalMaterial({ color: "#e2ad8c", roughness: 0.55, sheen: 0.3, sheenColor: new THREE.Color("#ffd8c0") }),
    jaw: new THREE.MeshPhysicalMaterial({ color: "#c99a7f", roughness: 0.7, roughnessMap: stubble }),
    hair: new THREE.MeshStandardMaterial({ color: "#3c3f45", roughness: 0.75 }),
    suit: new THREE.MeshPhysicalMaterial({ color: "#121318", roughness: 0.6, sheen: 0.5, sheenColor: new THREE.Color("#3a3d48") }),
    shirt: new THREE.MeshStandardMaterial({ color: "#e9ecef", roughness: 0.6 }),
    tie: new THREE.MeshStandardMaterial({ color: "#08080a", roughness: 0.4 }),
    glass: new THREE.MeshPhysicalMaterial({ color: "#050608", roughness: 0.05, metalness: 0.4, clearcoat: 1 }),
    frame: new THREE.MeshStandardMaterial({ color: "#9aa0a8", metalness: 1, roughness: 0.25 }),
    shoe: new THREE.MeshPhysicalMaterial({ color: "#060608", roughness: 0.2, clearcoat: 1 }),
    device: new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.5, metalness: 0.3 }),
    screen: new THREE.MeshBasicMaterial({ color: "#46ff7a" }),
    lens: new THREE.MeshBasicMaterial({ color: "#fffbe8" }),
    coil: new THREE.MeshStandardMaterial({ color: "#c8ccd2", roughness: 0.3, transparent: true, opacity: 0.85 }),
  };
  const box = (w, h, d, mat) => new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  const cap = (r, l, mat) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 8, 16), mat);
  const root = new THREE.Group(); root.name = "crowe";
  const body = new THREE.Group(); root.add(body);

  // torso: narrow suit, slightly A-shaped
  const torso = new THREE.Mesh(lathe(smoothProfile([[0, 0.9], [0.17, 0.92], [0.16, 1.1], [0.19, 1.38], [0.21, 1.5], [0.1, 1.58], [0, 1.6]], 30), 40), m.suit);
  torso.scale.z = 0.62; body.add(torso);
  const shirtV = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.2, 3), m.shirt); shirtV.rotation.z = Math.PI; shirtV.position.set(0, 1.47, 0.115); shirtV.scale.z = 0.3; body.add(shirtV);
  const tie = box(0.03, 0.26, 0.01, m.tie); tie.position.set(0, 1.35, 0.125); tie.rotation.x = -0.08; body.add(tie);
  const neck = cap(0.06, 0.06, m.skin); neck.position.y = 1.6; body.add(neck);

  // legs
  const legs = [-1, 1].map((s) => {
    const hip = new THREE.Group(); hip.position.set(s * 0.085, 0.92, 0); root.add(hip);
    const thigh = cap(0.06, 0.38, m.suit); thigh.position.y = -0.23; hip.add(thigh);
    const knee = new THREE.Group(); knee.position.y = -0.46; hip.add(knee);
    const shin = cap(0.055, 0.34, m.suit); shin.position.y = -0.2; knee.add(shin);
    const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.07, 20, 14), m.shoe); shoe.scale.set(0.8, 0.5, 1.7); shoe.position.set(0, -0.44, 0.06); knee.add(shoe);
    return { hip, knee };
  });
  // arms
  const arms = [-1, 1].map((s) => {
    const shoulder = new THREE.Group(); shoulder.position.set(s * 0.2, 1.5, 0); body.add(shoulder);
    const upper = cap(0.05, 0.3, m.suit); upper.position.y = -0.17; shoulder.add(upper);
    const elbow = new THREE.Group(); elbow.position.y = -0.34; shoulder.add(elbow);
    const fore = cap(0.045, 0.26, m.suit); fore.position.y = -0.15; elbow.add(fore);
    const cuff = cap(0.04, 0.02, m.shirt); cuff.position.y = -0.3; elbow.add(cuff);
    const hand = new THREE.Group(); hand.position.y = -0.36; elbow.add(hand);
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), m.skin); palm.scale.set(0.8, 1.1, 0.6); hand.add(palm);
    return { shoulder, elbow, hand, s };
  });
  // flashlight in the right hand, detector in the left
  const torch = new THREE.Group(); torch.position.set(0, -0.04, 0.05); torch.rotation.x = -Math.PI / 2; arms[1].hand.add(torch);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.22, 16), m.device); tube.position.y = 0.06; torch.add(tube);
  const lensMesh = new THREE.Mesh(new THREE.CircleGeometry(0.03, 20), m.lens); lensMesh.position.y = 0.172; lensMesh.rotation.x = -Math.PI / 2; torch.add(lensMesh);
  const beam = new THREE.SpotLight("#f4f6ff", 6, 30, 0.3, 0.4, 2); beam.position.y = 0.18; beam.castShadow = true;
  beam.shadow.mapSize.set(1024, 1024); beam.shadow.bias = -0.0008; torch.add(beam);
  const beamTarget = new THREE.Object3D(); beam.target = beamTarget;
  const detector = new THREE.Group(); detector.position.set(0, -0.06, 0.06); arms[0].hand.add(detector);
  detector.add(box(0.09, 0.14, 0.05, m.device));
  const screen = box(0.065, 0.06, 0.005, m.screen); screen.position.set(0, 0.02, 0.027); detector.add(screen);
  const ant = cap(0.006, 0.1, m.device); ant.position.set(0.03, 0.12, 0); detector.add(ant);

  // head: long narrow face, big square jaw, hair, aviators, earpiece
  const neckPivot = new THREE.Group(); neckPivot.position.y = 1.57; body.add(neckPivot);
  const head = new THREE.Group(); neckPivot.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 24), m.skin); skull.scale.set(0.95, 1.3, 1.05); skull.position.y = 0.2; head.add(skull);
  const jaw = new THREE.Mesh(superEllipsoid(0.112, 0.085, 0.1, 0.5), m.jaw); jaw.position.set(0, 0.075, 0.02); head.add(jaw);
  const chin = new THREE.Mesh(superEllipsoid(0.07, 0.03, 0.05, 0.6), m.jaw); chin.position.set(0, 0.0, 0.065); head.add(chin);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.03, 16, 12), m.skin); nose.scale.set(0.8, 1.4, 1.2); nose.position.set(0, 0.18, 0.135); head.add(nose);
  const hair = new THREE.Mesh(superEllipsoid(0.125, 0.07, 0.13, 0.6), m.hair); hair.position.set(0, 0.33, -0.01); hair.rotation.set(-0.12, 0, 0.06); head.add(hair);
  const quiff = new THREE.Mesh(superEllipsoid(0.09, 0.035, 0.05, 0.7), m.hair); quiff.position.set(0.02, 0.37, 0.08); quiff.rotation.set(-0.3, 0, 0.15); head.add(quiff);
  [-1, 1].forEach((s) => { const side = new THREE.Mesh(superEllipsoid(0.02, 0.07, 0.07, 0.7), m.hair); side.position.set(s * 0.118, 0.25, -0.01); head.add(side); });
  [-1, 1].forEach((s) => { const brow = new THREE.Mesh(superEllipsoid(0.045, 0.011, 0.012, 0.7), m.hair); brow.position.set(s * 0.05, 0.262, 0.118); brow.rotation.z = -s * 0.12; head.add(brow); });
  const shades = new THREE.Group(); shades.position.set(0, 0.215, 0.125); head.add(shades);
  [-1, 1].forEach((s) => {
    const l = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 14), m.glass); l.scale.set(1.1, 0.8, 0.25); l.position.x = s * 0.05; shades.add(l);
    const arm = box(0.006, 0.006, 0.13, m.frame); arm.position.set(s * 0.1, 0.01, -0.07); shades.add(arm);
  });
  const bridge = box(0.03, 0.005, 0.005, m.frame); bridge.position.y = 0.015; shades.add(bridge);
  [-1, 1].forEach((s) => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 10), m.skin); ear.scale.set(0.4, 1, 0.7); ear.position.set(s * 0.115, 0.19, 0); head.add(ear); });
  const coilCurve = new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => new THREE.Vector3(0.12 + Math.cos(i * 1.2) * 0.008, 0.17 - i * 0.006, -0.01 + Math.sin(i * 1.2) * 0.008)));
  head.add(new THREE.Mesh(new THREE.TubeGeometry(coilCurve, 120, 0.003, 6), m.coil));

  const rig = { root, body, head, neckPivot, legs, arms, beam, beamTarget, screen, m };
  rig.pose = (p = {}) => {
    const q = { walkPhase: 0, walk: 0, run: 0, lean: 0, headYaw: 0, headPitch: 0, torchAim: [0.0, -0.3], detectorUp: 0.6, crouch: 0, ...p };
    const amt = Math.max(q.walk, q.run), stride = q.run ? 0.9 : 0.45;
    const a = q.lean + q.run * 0.22, HIP = 0.92; // lean pivots at the hips
    body.rotation.x = a;
    body.position.set(0, HIP * (1 - Math.cos(a)) + amt * Math.abs(Math.sin(q.walkPhase)) * 0.04 - q.crouch * 0.15, -HIP * Math.sin(a));
    legs.forEach((l, i) => {
      const ph = q.walkPhase + (i ? Math.PI : 0);
      l.hip.rotation.x = -amt * Math.sin(ph) * stride - q.crouch * 0.5;
      l.knee.rotation.x = amt * Math.max(0, -Math.cos(ph)) * stride * 1.3 + q.crouch;
    });
    // right arm points the torch; left arm holds the detector up
    const [ay, ap] = q.torchAim;
    arms[1].shoulder.rotation.set(-1.2 - ap, ay, -0.1);
    arms[1].elbow.rotation.x = -0.25;
    arms[0].shoulder.rotation.set(-q.detectorUp * 1.1 - (q.run ? Math.sin(q.walkPhase) * 0.6 : 0), 0, 0.12);
    arms[0].elbow.rotation.x = -q.detectorUp * 1.2;
    head.rotation.set(q.headPitch, q.headYaw, 0);
  };
  rig.pose();
  root.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return rig;
}
