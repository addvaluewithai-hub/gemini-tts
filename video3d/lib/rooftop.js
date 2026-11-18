// The rooftop set for the Peek cold opens: a wet flat roof (y = 0) with a parapet along z = 4, a stairwell hut with
// a metal door (light pouring out), a water tower, AC units, a night city of lit windows, a big moon, rain, and the
// alley 12 m below with a streetlamp and a dumpster (lid hinge animatable).
import * as THREE from "three";
import { rng, brickTexture, noiseTexture, windowsTexture, canvasTexture } from "./util.js";

export const DROP = 12;           // roof height above the alley
export const LEDGE_Z = 4;         // parapet line
export const DUMPSTER = new THREE.Vector3(0.4, -DROP, 6.6);

export function makeRooftop(scene, { seed = 4 } = {}) {
  const r = rng(seed);
  const world = new THREE.Group(); scene.add(world);
  scene.background = new THREE.Color("#06091a");
  scene.fog = new THREE.FogExp2("#0b1430", 0.028);

  // sky dome with a soft gradient, and the moon
  const sky = new THREE.Mesh(new THREE.SphereGeometry(180, 32, 16), new THREE.MeshBasicMaterial({ side: THREE.BackSide, fog: false,
    map: canvasTexture(16, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#020311"); gr.addColorStop(0.45, "#0a1233"); gr.addColorStop(0.55, "#2a1d4a"); gr.addColorStop(1, "#05060f"); g.fillStyle = gr; g.fillRect(0, 0, w, h); }) }));
  world.add(sky);
  const moonTex = canvasTexture(256, 256, (g, w, h) => {
    const gr = g.createRadialGradient(w * 0.45, h * 0.45, 10, w / 2, h / 2, w / 2); gr.addColorStop(0, "#fffbe9"); gr.addColorStop(1, "#d7d2c2");
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 2, 0, Math.PI * 2); g.fill();
    const rr = rng(77); for (let i = 0; i < 26; i++) { g.fillStyle = `rgba(150,145,130,${0.15 + rr() * 0.25})`; g.beginPath(); g.arc(30 + rr() * 196, 30 + rr() * 196, 4 + rr() * 22, 0, 7); g.fill(); }
  });
  const moon = new THREE.Mesh(new THREE.CircleGeometry(9, 48), new THREE.MeshBasicMaterial({ map: moonTex, fog: false, transparent: true }));
  moon.position.set(-14, 46, -95); moon.lookAt(0, 0, 0); world.add(moon);

  // the roof: wet concrete with puddles (rough/smooth patches)
  const roofRough = noiseTexture({ seed: 31, lo: 0.08, hi: 0.75, blotches: 260 }); roofRough.repeat.set(2, 2);
  const roofCol = noiseTexture({ seed: 32, lo: 0.18, hi: 0.32, blotches: 300 }); roofCol.colorSpace = THREE.SRGBColorSpace; roofCol.repeat.set(3, 3);
  const roofMat = new THREE.MeshPhysicalMaterial({ color: "#5b6070", map: roofCol, roughness: 1, roughnessMap: roofRough, clearcoat: 0.25, clearcoatRoughness: 0.3 });
  const roof = new THREE.Mesh(new THREE.BoxGeometry(12, 0.4, 14), roofMat); roof.position.set(0, -0.2, LEDGE_Z - 7); roof.receiveShadow = true; world.add(roof);

  // parapet along the edge (and the sides)
  const brick = brickTexture({ seed: 5 }); brick.repeat.set(6, 0.5);
  const brickMat = new THREE.MeshStandardMaterial({ map: brick, roughness: 0.85, color: "#c9a49a" });
  const capMat = new THREE.MeshStandardMaterial({ color: "#6d6f78", roughness: 0.5 });
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(12, 0.45, 0.3), brickMat); parapet.position.set(0, 0.225, LEDGE_Z); world.add(parapet);
  const capstone = new THREE.Mesh(new THREE.BoxGeometry(12.1, 0.06, 0.38), capMat); capstone.position.set(0, 0.48, LEDGE_Z); world.add(capstone);
  for (const x of [-6, 6]) { const side = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 14), brickMat); side.position.set(x, 0.225, LEDGE_Z - 7); world.add(side); }

  // building facade below the ledge, with windows
  const facadeBrick = brickTexture({ seed: 6, base: "#4a2822" }); facadeBrick.repeat.set(5, 6);
  const facade = new THREE.Mesh(new THREE.BoxGeometry(12, DROP, 0.4), new THREE.MeshStandardMaterial({ map: facadeBrick, roughness: 0.9 }));
  facade.position.set(0, -DROP / 2, LEDGE_Z + 0.05); world.add(facade);
  const winTex = windowsTexture({ seed: 8, lit: 0.35, cols: 5, rows: 4 });
  const wins = new THREE.Mesh(new THREE.PlaneGeometry(11, DROP - 2), new THREE.MeshBasicMaterial({ map: winTex, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.85 }));
  wins.position.set(0, -DROP / 2 - 0.5, LEDGE_Z + 0.26); world.add(wins);
  // fire escape zig-zag on the facade
  const iron = new THREE.MeshStandardMaterial({ color: "#1c1f26", roughness: 0.6, metalness: 0.6 });
  for (let k = 1; k <= 3; k++) {
    const y = -k * 3.2; const plat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.05, 0.9), iron); plat.position.set(-3.2, y, LEDGE_Z + 0.7); world.add(plat);
    const rail = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 0.03), iron); rail.position.set(-3.2, y + 0.9, LEDGE_Z + 1.12); world.add(rail);
  }

  // stairwell hut with a door that can open, and the light behind it
  const hut = new THREE.Group(); hut.position.set(-1.6, 0, -4.4); world.add(hut);
  const hutBrick = brickTexture({ seed: 7, base: "#55302a" }); hutBrick.repeat.set(2, 1.4);
  const hutMat = new THREE.MeshStandardMaterial({ map: hutBrick, roughness: 0.9 });
  const hutW = 2.4, hutH = 2.7, hutD = 2;
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(hutW, hutH, 0.2), hutMat); backWall.position.set(0, hutH / 2, -hutD / 2); hut.add(backWall);
  for (const s of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.2, hutH, hutD), hutMat); w.position.set(s * hutW / 2, hutH / 2, 0); hut.add(w); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(hutW + 0.2, 0.2, hutD + 0.2), capMat); top.position.y = hutH; hut.add(top);
  const frontL = new THREE.Mesh(new THREE.BoxGeometry(0.65, hutH, 0.2), hutMat); frontL.position.set(-0.85, hutH / 2, hutD / 2); hut.add(frontL);
  const frontR = frontL.clone(); frontR.position.x = 0.85; hut.add(frontR);
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 0.2), hutMat); lintel.position.set(0, hutH - 0.25, hutD / 2); hut.add(lintel);
  const glowWall = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.6), new THREE.MeshBasicMaterial({ color: "#fff6e6" })); glowWall.position.set(0, 1.3, -hutD / 2 + 0.11); hut.add(glowWall);
  const doorPivot = new THREE.Group(); doorPivot.position.set(-0.52, 0, hutD / 2 + 0.06); hut.add(doorPivot);
  const doorMat = new THREE.MeshStandardMaterial({ color: "#3b4a48", roughness: 0.45, metalness: 0.6 });
  const door = new THREE.Mesh(new THREE.BoxGeometry(1.04, 2.2, 0.06), doorMat); door.position.set(0.52, 1.1, 0); doorPivot.add(door);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), new THREE.MeshStandardMaterial({ color: "#c8c8c8", metalness: 1, roughness: 0.2 })); knob.position.set(0.95, 1.05, 0.06); doorPivot.add(knob);
  const doorLight = new THREE.SpotLight("#fff1dc", 0, 25, 0.75, 0.6, 2); doorLight.position.set(0, 1.6, 0.0); doorLight.castShadow = true;
  doorLight.shadow.mapSize.set(1024, 1024); doorLight.shadow.bias = -0.0006; hut.add(doorLight);
  const doorLightTarget = new THREE.Object3D(); doorLightTarget.position.set(0, 0, 8); hut.add(doorLightTarget); doorLight.target = doorLightTarget;
  // light shaft out of the door (additive cone, gives "volumetric" rays in rain)
  const shaftMat = new THREE.MeshBasicMaterial({ color: "#fff0d8", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.5, 3.2, 24, 1, true), shaftMat);
  shaft.rotation.x = Math.PI / 2 + 0.18; shaft.position.set(0, 0.95, hutD / 2 + 1.6); hut.add(shaft);

  // water tower and AC units
  const tower = new THREE.Group(); tower.position.set(3.2, 0, -5.2); world.add(tower);
  const wood = new THREE.MeshStandardMaterial({ color: "#4a3426", roughness: 0.9 });
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.3, 2.6, 24), wood); tank.position.y = 4.1; tower.add(tank);
  const roofCone = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.9, 24), iron); roofCone.position.y = 5.85; tower.add(roofCone);
  for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), iron); leg.position.set(x, 1.4, z); tower.add(leg); }
  const acMat = new THREE.MeshStandardMaterial({ color: "#8a8f99", roughness: 0.5, metalness: 0.5 });
  const acUnits = [[1.2, -0.6], [-3.6, 0.6], [2.6, 1.8]].map(([x, z], i) => {
    const ac = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.9), acMat); ac.position.set(x, 0.4, z); ac.rotation.y = i * 0.3; world.add(ac);
    const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.02, 20), iron); fan.position.set(x, 0.81, z); world.add(fan);
    return ac;
  });

  // the city: blocks of lit windows all around, fading in the fog
  const cityMats = [0, 1, 2, 3].map((i) => {
    const t = windowsTexture({ seed: 40 + i, lit: 0.3 + i * 0.07, cols: 8, rows: 20 });
    return new THREE.MeshStandardMaterial({ color: "#10131c", emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 1.6, roughness: 0.9 });
  });
  for (let i = 0; i < 110; i++) {
    const a = r() * Math.PI * 2, d = 18 + r() * 70;
    const x = Math.cos(a) * d, z = Math.sin(a) * d + 10;
    if (Math.abs(x) < 9 && z > -12 && z < 16) continue;
    const h = 6 + r() * 34, w = 4 + r() * 7;
    const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, w * (0.6 + r() * 0.8)), cityMats[i % 4]);
    b.position.set(x, -DROP + h / 2 - 2 + r() * 4, z); b.rotation.y = r() * 0.3; world.add(b);
  }
  // across the alley: the building opposite
  const opp = new THREE.Mesh(new THREE.BoxGeometry(14, DROP + 3, 2), new THREE.MeshStandardMaterial({ map: facadeBrick, roughness: 0.9, color: "#9a8a88" }));
  opp.position.set(0, -DROP / 2 + 1.5, LEDGE_Z + 6.6); world.add(opp);
  const oppWins = new THREE.Mesh(new THREE.PlaneGeometry(12, DROP), new THREE.MeshBasicMaterial({ map: windowsTexture({ seed: 12, lit: 0.4, cols: 6, rows: 5 }), transparent: true, blending: THREE.AdditiveBlending }));
  oppWins.position.set(0, -DROP / 2 + 1.5, LEDGE_Z + 5.59); oppWins.rotation.y = Math.PI; world.add(oppWins);

  // the alley below: wet cobbles, a streetlamp, the dumpster with bags
  const cob = noiseTexture({ seed: 51, lo: 0.1, hi: 0.6, blotches: 500 }); cob.repeat.set(4, 4);
  const alley = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.MeshPhysicalMaterial({ color: "#2b2f3a", roughness: 0.5, roughnessMap: cob, clearcoat: 0.8, clearcoatRoughness: 0.1 }));
  alley.rotation.x = -Math.PI / 2; alley.position.set(0, -DROP, LEDGE_Z + 2.8); alley.receiveShadow = true; world.add(alley);
  const lamp = new THREE.PointLight("#ffb46b", 30, 16, 1.6); lamp.position.set(2.2, -DROP + 3.6, LEDGE_Z + 2.9); world.add(lamp);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), new THREE.MeshBasicMaterial({ color: "#ffd59a" })); bulb.position.copy(lamp.position); world.add(bulb);
  const green = new THREE.MeshStandardMaterial({ color: "#1f5a36", roughness: 0.5, metalness: 0.4 });
  const dumpster = new THREE.Group(); dumpster.position.copy(DUMPSTER); world.add(dumpster);
  const bin = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 1.2), green); bin.position.y = 0.6; dumpster.add(bin);
  const inside = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.02, 1.06), new THREE.MeshStandardMaterial({ color: "#050505" })); inside.position.y = 1.19; dumpster.add(inside);
  const bagMat = new THREE.MeshPhysicalMaterial({ color: "#0a0a0c", roughness: 0.2, clearcoat: 1 });
  const bags = [[-0.5, 0.0], [0.3, 0.2], [0.6, -0.25], [-0.1, -0.2]].map(([x, z], i) => {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.38, 16, 12), bagMat); b.scale.set(1, 0.7, 0.9); b.position.set(x, 1.05, z); dumpster.add(b); return b;
  });
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, 1.2, -0.6); dumpster.add(lidPivot);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.04, 0.06, 1.24), green); lid.position.set(0, 0, 0.62); lidPivot.add(lid);

  // lights: moon key (cool), city fill, a hard rim from the door later
  const moonLight = new THREE.DirectionalLight("#9fb6ff", 0.9); moonLight.position.set(-6, 12, 10); moonLight.castShadow = true;
  moonLight.shadow.mapSize.set(2048, 2048); moonLight.shadow.camera.left = -8; moonLight.shadow.camera.right = 8; moonLight.shadow.camera.top = 8; moonLight.shadow.camera.bottom = -8; moonLight.shadow.bias = -0.0005;
  world.add(moonLight); world.add(moonLight.target);
  const hemi = new THREE.HemisphereLight("#3a4a8a", "#2a0f22", 0.6); world.add(hemi);

  // rain: streaks that fall in a box that follows the camera
  const N = 3500, rainGeo = new THREE.BufferGeometry(), rp = new Float32Array(N * 6), seeds = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { seeds[i * 3] = r(); seeds[i * 3 + 1] = r(); seeds[i * 3 + 2] = r(); }
  rainGeo.setAttribute("position", new THREE.BufferAttribute(rp, 3));
  const rain = new THREE.LineSegments(rainGeo, new THREE.LineBasicMaterial({ color: "#a9c4ff", transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }));
  rain.frustumCulled = false; world.add(rain);
  const updateRain = (worldTime, cam, { size = 9, speed = 9, streak = 0.28 } = {}) => {
    for (let i = 0; i < N; i++) {
      const sx = seeds[i * 3], sy = seeds[i * 3 + 1], sz = seeds[i * 3 + 2];
      const x = cam.position.x + (sx - 0.5) * size, z = cam.position.z + (sz - 0.5) * size;
      const yy = ((sy * size - worldTime * speed) % size + size) % size;
      const y = cam.position.y - size / 2 + yy;
      rp.set([x, y, z, x + 0.02, y + streak, z], i * 6);
    }
    rainGeo.attributes.position.needsUpdate = true;
  };

  return { world, roof, parapet, hut, doorPivot, doorLight, shaft, shaftMat, glowWall, tower, acUnits, moon, dumpster, lidPivot, bags, lamp, updateRain, moonLight };
}
