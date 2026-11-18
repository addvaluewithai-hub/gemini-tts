// Look-dev: Peek on a studio sweep, three-point light, turning; t picks the angle and the expression.
import * as THREE from "three";
import { makePeek } from "../lib/peek.js";
import { makeCrowe } from "../lib/crowe.js";
import { makePost } from "../lib/post.js";

export default {
  width: 1080, height: 1920, fps: 30, duration: 4,
  async setup({ renderer, width, height }) {
    const scene = new THREE.Scene(); scene.background = new THREE.Color("#1c2250");
    const camera = new THREE.PerspectiveCamera(30, width / height, 0.05, 100);
    const key = new THREE.DirectionalLight("#fff1e0", 2.6); key.position.set(2, 3, 3); key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048); key.shadow.bias = -0.0005; scene.add(key);
    const rim = new THREE.DirectionalLight("#7fd4ff", 2.2); rim.position.set(-2, 2, -3); scene.add(rim);
    const fill = new THREE.HemisphereLight("#bfc9ff", "#2a1530", 0.8); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(4, 64), new THREE.MeshStandardMaterial({ color: "#2a2f66", roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
    const peek = makePeek(); scene.add(peek.root);
    const crowe = makeCrowe(); scene.add(crowe.root); crowe.root.position.x = 0.75; crowe.beam.intensity = 0;
    const post = makePost(renderer, scene, camera, { width, height, bloom: [0.25, 0.4, 0.9] });
    post.grade.split.value = 0.05; post.grade.vignette.value = 0.3;
    return {
      frame(t) {
        const a = [0, 0.7, 1.57, 3.14][Math.floor(t) % 4];
        peek.root.rotation.y = a;
        const exprs = [{}, { wide: 1, lid: 0.0, mouthOpen: 0.7, brow: 1 }, { armsOut: 1, lid: 1, smile: 1 }, { run: 1, runPhase: 1.2 }];
        peek.pose(exprs[Math.floor(t) % 4]);
        crowe.root.rotation.y = a; crowe.pose({});
        camera.position.set(0.4, 1.1, 5.2); camera.lookAt(0.4, 1.0, 0);
        post.grade.time.value = t;
        post.composer.render();
      },
    };
  },
};
