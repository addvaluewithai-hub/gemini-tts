// Peek English · Short 01 · cold open (10 s). Night rooftop: the agent's flashlight finds Peek, he runs, leaps off
// the ledge expecting to float (slow motion over the city), gravity wins, he lands in a dumpster, Crowe: "Gotcha."
//
//  S1 0.0-1.6  ECU Peek hiding behind an AC unit; a flashlight sweeps his face; eyes snap open. "Oh no."
//  S2 1.6-4.4  low tracking shot, Peek runs at camera; the door bursts open behind him, Crowe backlit. "STOP!"
//  S3 4.4-5.2  low side angle: anticipation, hop onto the parapet, launch.
//  S4 5.2-7.4  slow motion orbit, arms spread over the city and the moon. "Relax... on my planet, we float."
//  S5 7.4-8.4  close: eyes open, look down, gulp; gravity: he drops, the camera whips down.
//  S6 8.4-9.3  top-down 12 m: he falls into the dumpster; impact flash, lid slams.
//  S7 9.3-10.0 low angle at the ledge: Crowe leans over, torch down, detector screaming. "Gotcha." Cut.
import * as THREE from "three";
import { makePeek } from "../lib/peek.js";
import { makeCrowe } from "../lib/crowe.js";
import { makeRooftop, DROP, LEDGE_Z, DUMPSTER } from "../lib/rooftop.js";
import { makePost } from "../lib/post.js";
import { seg, lerp, smooth, easeIn, easeOut, easeInOut, spring, noise1, clamp } from "../lib/util.js";

const FPS = 30, DUR = 10;

// slow-motion ramp: world time runs at 12% during the float
const rate = (t) => 1 - 0.88 * (smooth(seg(t, 5.0, 5.35)) - smooth(seg(t, 7.3, 7.55)));
const worldTimes = (() => { const a = [0]; const dt = 1 / 240; for (let i = 1; i <= DUR * 240 + 240; i++) a.push(a[i - 1] + rate(i * dt) * dt); return a; })();
const worldTime = (t) => worldTimes[Math.min(worldTimes.length - 1, Math.round(t * 240))];

// mouth movement from the voice envelope (out/s01-env.json, made by the audio step); fallback: speaking windows
let ENV = null;
const talk = (who, t, windows) => {
  if (ENV && ENV[who]) { const i = Math.round(t * ENV.fps); return clamp((ENV[who][i] || 0) * 1.4); }
  return windows.some(([a, b]) => t >= a && t <= b) ? 0.25 + 0.35 * Math.abs(Math.sin(t * 23)) : 0;
};

export default {
  width: 1080, height: 1920, fps: FPS, duration: DUR,
  async setup({ renderer, width, height, params }) {
    const OFF = new Set((params?.get('off') || '').split(','));
    try { ENV = await (await fetch("/out/s01-env.json")).json(); } catch { ENV = null; }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.05, 400);
    const set = makeRooftop(scene);
    const peek = makePeek(); scene.add(peek.root);
    const crowe = makeCrowe(); scene.add(crowe.root); scene.add(crowe.beamTarget);
    // a pink-violet rim light that follows Peek (cinema cheat so he reads against the night)
    const rim = new THREE.PointLight("#ff6fc4", 0.6, 3, 2); scene.add(rim);
    const faceFill = new THREE.PointLight("#bcd4ff", 0, 3, 2); scene.add(faceFill);
    const greenGlow = new THREE.PointLight("#46ff7a", 0, 2.5, 2); scene.add(greenGlow);
    const upLight = new THREE.PointLight("#ffb070", 0, 6, 2); scene.add(upLight);
    const post = makePost(renderer, scene, camera, { width, height, bloom: [0.85, 0.6, 0.78], dof: true });
    const shakeX = noise1(3), shakeY = noise1(4), shakeR = noise1(5);
    const v = new THREE.Vector3(), look = new THREE.Vector3();

    function placeCamera(pos, target, fov, { shake = 0, roll = 0, t = 0, focus = null, aperture = 0.003 } = {}) {
      camera.fov = fov; camera.updateProjectionMatrix();
      camera.position.copy(pos);
      camera.position.x += shakeX(t * 7) * shake; camera.position.y += shakeY(t * 7) * shake;
      camera.up.set(0, 1, 0); camera.lookAt(target);
      camera.rotateZ(roll + shakeR(t * 5) * shake * 0.6);
      if (post.bokeh) {
        post.bokeh.uniforms.focus.value = focus ?? camera.position.distanceTo(target);
        post.bokeh.uniforms.aperture.value = aperture;
        post.bokeh.uniforms.maxblur.value = 0.01;
      }
    }

    return {
      async frame(t) {
        const wt = worldTime(t);
        const g = post.grade;
        g.time.value = t; g.flash.value = 0; g.fade.value = 0; g.exposure.value = 1; g.vignette.value = 0.5; g.aberration.value = 0.0015;
        post.bloom.strength = 0.85;

        // ---------------- the door and Crowe
        const burst = 1.7;
        set.doorPivot.rotation.y = t < burst ? -0.35 : -0.35 - 1.6 * easeOut(seg(t, burst, burst + 0.18)) + spring(t - burst - 0.18, 14, 6) * 0.15;
        const doorOpen = t < burst ? 0.25 : 1;
        set.doorLight.intensity = 5 * doorOpen;
        set.shaftMat.opacity = 0.035 * doorOpen;
        let cPos, cPhase = wt * 11, cPose = {};
        if (t < 1.85) { cPos = new THREE.Vector3(-1.6, 0, -3.75); cPose = { torchAim: [Math.sin(t * 2.2) * 0.35 - 0.5, -0.05], detectorUp: 0.8 }; }
        else if (t < 9.3) {
          const k = seg(t, 1.85, 4.6), k2 = seg(t, 4.6, 9.3);
          cPos = new THREE.Vector3(lerp(-1.6, 0.2, k), 0, lerp(-3.4, 2.4, easeInOut(k)));
          if (k >= 1) cPos.set(lerp(0.2, 0.6, k2), 0, lerp(2.4, 3.45, k2));
          cPose = { run: 1, walkPhase: cPhase, torchAim: [-0.1, -0.15], detectorUp: 0.5 };
        } else {
          cPos = new THREE.Vector3(0.6, 0, 3.45);
          const k = easeOut(seg(t, 9.3, 9.65));
          cPose = { lean: 0.55 * k, headPitch: 0.6 * k, torchAim: [0, -0.9 * k], detectorUp: 0.9, walk: 1 - k, walkPhase: cPhase };
        }
        crowe.root.position.copy(cPos);
        crowe.root.rotation.y = t < 1.85 ? 0.35 : Math.atan2(0.6 - cPos.x, 3.6 - cPos.z) * 0.6;
        crowe.pose(cPose);
        crowe.screen.material.color.setHSL(0.36, 1, 0.45 + 0.25 * Math.max(0, Math.sin(t * (t > 9.3 ? 40 : 14))));

        // ---------------- Peek
        let pPos = new THREE.Vector3(1.2, 0, 0.15), pRotY = 0, pose = {};
        const runPh = wt * 15;
        if (t < 1.6) {
          const snap = seg(t, 0.85, 0.95);
          pose = { lid: lerp(0.62, 0.0, snap), wide: snap, look: [lerp(0.1, -0.85, snap), lerp(0.05, 0.25, snap)], brow: snap, browTilt: snap * 0.6,
            squash: 0.06, bob: -0.05, headYaw: lerp(0.15, -0.25, snap), smile: lerp(0.4, -0.4, snap),
            antenna: [0, -0.3 * snap + spring(t - 0.9, 18, 5) * 0.25], mouthOpen: talk("peek", t, [[1.0, 1.45]]) };
          pRotY = 0.25;
        } else if (t < 4.4) {
          const k = seg(t, 1.6, 4.4);
          pPos.set(lerp(1.2, 0.6, k), 0, lerp(0.15, 3.55, easeIn(Math.min(1, k * 1.25)) * 0.35 + k * 0.65));
          pose = { run: smooth(seg(t, 1.6, 1.85)), runPhase: runPh, wide: 0.7, lid: 0.05, look: [0, -0.1], brow: 0.8, browTilt: 0.5, smile: -0.5,
            mouthOpen: 0.15 + talk("peek", t, [[2.6, 4.3]]) * 0.6, headPitch: -0.1 };
        } else if (t < 5.2) {
          const k1 = seg(t, 4.4, 4.58), k2 = seg(t, 4.58, 4.8), k3 = seg(t, 4.85, 5.2);
          const hopY = Math.sin(k2 * Math.PI) * 0.35 + k2 * 0.51;
          pPos.set(0.6, k2 < 1 ? hopY : 0.51 + Math.sin(k3 * Math.PI * 0.5) * 0.5, lerp(3.55, 4.0, k2) + k3 * 0.6);
          pose = { squash: k1 < 1 ? Math.sin(k1 * Math.PI) * 0.18 : (k3 > 0 ? -0.08 : 0), run: 0.3 * (1 - k2), runPhase: runPh,
            armsOut: easeOut(k3), lid: lerp(0.1, 0.9, k3), wide: 0.6 * (1 - k3), smile: lerp(-0.2, 1, k3), legsTuck: k2 * (1 - k3) * 0.6 };
        } else if (t < 8.0) {
          // float (slow world time), then the realisation
          const k = seg(wt, worldTime(5.2), worldTime(8.0));
          pPos.set(0.6, 1.01 + Math.sin(k * Math.PI) * 0.12, 4.6 + k * 0.5);
          const realise = seg(t, 7.45, 7.55), down = seg(t, 7.7, 7.85);
          pose = { armsOut: 1 - realise * 0.3, lid: lerp(1, 0, realise), wide: realise, smile: lerp(1, -0.6, realise), look: [0, -down * 1.0],
            headPitch: down * 0.35, brow: realise, antenna: [0, -0.35 * (1 - realise) + realise * 0.4], legsTuck: 0.15,
            mouthOpen: talk("peek", t, [[5.4, 7.2]]) + (t > 7.85 ? 0.15 : 0), armsUp: realise * 0.2 };
        } else {
          // the fall: accelerate down into the dumpster
          const ft = t - 8.0, y0 = 1.13;
          const y = y0 - 0.5 * 26 * ft * ft;
          const landY = DUMPSTER.y + 1.05;
          const landed = y <= landY;
          const fall = clamp((y0 - y) / (y0 - landY));
          pPos.set(lerp(0.6, DUMPSTER.x, fall), Math.max(y, landY - 0.45 * seg(t, 8.98, 9.08)), lerp(5.1, DUMPSTER.z, fall));
          pose = { armsUp: landed ? 0 : 0.9, wide: 1, lid: 0, mouthOpen: landed ? 0 : 0.8, smile: -1, legsTuck: 0.3, antenna: [0.3 * Math.sin(t * 30), 0.6],
            squash: landed ? 0.3 * Math.exp(-(t - 8.98) * 8) : -0.1 };
          if (t > 9.1) pPos.y = landY - 0.6; // buried in the bags
        }
        if (t >= 5.2 && t < 8.0) pRotY = 0;
        peek.root.position.copy(pPos); peek.root.rotation.y = pRotY; peek.pose(pose);
        rim.position.set(pPos.x - 0.8, pPos.y + 1.2, pPos.z - 0.9); rim.intensity = 0.5;

        // dumpster lid: open until he lands, then slams
        set.lidPivot.rotation.x = t < 9.0 ? -1.9 : -1.9 + 1.9 * easeIn(seg(t, 9.0, 9.14)) - spring(t - 9.14, 20, 7) * 0.12;
        set.bags.forEach((b, i) => { b.scale.y = 0.7 * (1 - 0.3 * Math.exp(-(t - 8.98) * 6) * (t > 8.98 ? 1 : 0)); });

        // flashlight target
        if (t < 1.85) crowe.beamTarget.position.set(1.2 + Math.sin(t * 2.2 - 0.6) * 1.2, 0.75, 0.15);
        else if (t < 9.3) crowe.beamTarget.position.set(pPos.x, Math.max(0.6, pPos.y + 0.6), pPos.z);
        else crowe.beamTarget.position.set(DUMPSTER.x, DUMPSTER.y + 1, DUMPSTER.z);

        // ---------------- camera, per shot
        const face = new THREE.Vector3(pPos.x, pPos.y + 0.83, pPos.z);
        faceFill.intensity = 0; greenGlow.intensity = 0; upLight.intensity = 0;
        if (t < 1.6) {
          const k = seg(t, 0, 1.6);
          v.set(face.x + 0.08, face.y + 0.03, face.z + lerp(2.6, 1.9, easeInOut(k)) + (t > 0.9 ? -0.18 * easeOut(seg(t, 0.9, 1.05)) : 0));
          placeCamera(v, look.copy(face).add(new THREE.Vector3(0, -0.04, 0)), 22, { t, shake: 0.004, focus: v.distanceTo(face), aperture: 0.012 });
          faceFill.position.set(face.x + 0.4, face.y + 0.3, face.z + 0.6); faceFill.intensity = 0.25;
          g.vignette.value = 0.7; g.exposure.value = 0.95;
        } else if (t < 4.4) {
          const k = seg(t, 1.6, 4.4);
          const cz = pPos.z + lerp(2.6, 1.7, k), over = Math.max(0, cz - 3.75);
          v.set(pPos.x + 0.75 + over * 1.4, 0.6 + over * 0.5 + 0.04 * Math.sin(t * 9), Math.min(3.75, cz));
          placeCamera(v, look.set(pPos.x - 0.05, 0.72, pPos.z - 0.4), 50, { t, shake: 0.03, roll: -0.06, focus: v.distanceTo(pPos), aperture: 0.004 });
          g.flash.value = t > burst ? 0.35 * Math.exp(-(t - burst) * 10) : 0;
        } else if (t < 5.2) {
          const k = seg(t, 4.4, 5.2);
          v.set(2.4, 1.0, lerp(3.5, 4.1, k));
          placeCamera(v, look.set(pPos.x, pPos.y + 0.55, pPos.z), 42, { t, shake: 0.015, roll: 0.05, aperture: 0.004 });
        } else if (t < 7.4) {
          const k = seg(t, 5.2, 7.4);
          const a = lerp(-0.75, 0.65, easeInOut(k)), R = lerp(2.1, 1.6, k);
          v.set(pPos.x + Math.sin(a) * R, pPos.y + 0.25 + 0.15 * k, pPos.z + Math.cos(a) * R);
          placeCamera(v, look.set(pPos.x, pPos.y + 0.8, pPos.z), 46, { t, shake: 0.002, roll: Math.sin(k * Math.PI) * 0.08, aperture: 0.006 });
          post.bloom.strength = 1.1; g.split.value = 0.3;
        } else if (t < 8.4) {
          const drop = seg(t, 8.0, 8.4);
          v.set(0.8, 1.13 + 0.9, 5.1 + 1.25);
          const tgt = look.set(0.62, lerp(1.13 + 0.86, -2.5, easeIn(drop)), 5.1);
          placeCamera(v, tgt, lerp(34, 50, drop), { t, shake: 0.004 + drop * 0.05, aperture: 0.004 });
          faceFill.position.set(0.9, 2.3, 5.8); faceFill.intensity = 0.2;
          g.aberration.value = 0.0015 + drop * 0.01;
        } else if (t < 9.3) {
          const k = seg(t, 8.4, 9.3);
          v.set(DUMPSTER.x + 0.15, 1.6, DUMPSTER.z - 0.6);
          const hit = t > 8.98 ? Math.exp(-(t - 8.98) * 7) : 0;
          placeCamera(v, look.set(DUMPSTER.x, DUMPSTER.y + 1, DUMPSTER.z + 0.05), lerp(32, 26, k), { t, shake: 0.01 + hit * 0.12, aperture: 0.001 });
          g.flash.value = hit * 0.5;
        } else {
          const k = seg(t, 9.3, 10);
          v.set(0.45, lerp(0.95, 1.1, k), lerp(5.35, 5.05, easeOut(k)));
          placeCamera(v, look.set(0.6, 1.62, 3.95), lerp(44, 36, easeOut(k)), { t, shake: 0.006, roll: 0.12, aperture: 0.003 });
          g.fade.value = smooth(seg(t, 9.92, 10.0));
          greenGlow.position.set(0.4, 1.35, 4.25); greenGlow.intensity = 0.25 + 0.2 * Math.max(0, Math.sin(t * 40));
          upLight.position.set(0.9, 0.9, 4.8); upLight.intensity = 0.7;
          post.bloom.strength = 1.2;
        }

        if (OFF.has('beam')) crowe.beam.intensity = 0;
        if (OFF.has('rim')) rim.intensity = 0;
        if (OFF.has('door')) set.doorLight.intensity = 0;
        if (OFF.has('bloom')) post.bloom.strength = 0;
        if (OFF.has('lamp')) set.lamp.intensity = 0;
        if (OFF.has('crowe')) crowe.root.visible = false;
        if (OFF.has('peek')) peek.root.visible = false;
        set.updateRain(wt, camera, { speed: 9, streak: 0.06 + 0.25 * rate(t) });
        post.composer.render();
      },
    };
  },
};
