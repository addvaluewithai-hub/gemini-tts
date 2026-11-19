// Film look: bloom, optional depth of field, then one grading pass (lift/gamma/gain tint, teal-and-pink split
// toning, vignette, chromatic aberration, film grain, flash and fade to black). Everything is a uniform the shot
// can drive per frame.
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { BokehPass } from "three/addons/postprocessing/BokehPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

const GradeShader = {
  uniforms: {
    tDiffuse: { value: null }, time: { value: 0 }, resolution: { value: new THREE.Vector2(1080, 1920) },
    vignette: { value: 0.45 }, grain: { value: 0.06 }, aberration: { value: 0.0015 },
    shadowTint: { value: new THREE.Color("#0e3a4a") }, highlightTint: { value: new THREE.Color("#ff9ad0") }, split: { value: 0.22 },
    exposure: { value: 1.0 }, contrast: { value: 1.08 }, saturation: { value: 1.08 }, flash: { value: 0 }, fade: { value: 0 },
  },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float time; uniform vec2 resolution;
    uniform float vignette, grain, aberration, split, exposure, contrast, saturation, flash, fade;
    uniform vec3 shadowTint, highlightTint; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898,78.233)) + time*61.7) * 43758.5453); }
    void main(){
      vec2 c = vUv - 0.5; float d = length(c * vec2(resolution.x/resolution.y, 1.0));
      vec2 off = c * aberration * (1.0 + d*2.0);
      vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
      col *= exposure;
      float l = dot(col, vec3(0.2126,0.7152,0.0722));
      col = mix(vec3(l), col, saturation);
      col = (col - 0.5) * contrast + 0.5;
      col += split * (shadowTint * (1.0 - smoothstep(0.0, 0.5, l)) * 0.35 + highlightTint * smoothstep(0.5, 1.0, l) * 0.18);
      col *= 1.0 - vignette * smoothstep(0.35, 0.95, d);
      col += (hash(vUv*resolution) - 0.5) * grain;
      col = mix(col, vec3(1.0), flash);
      col *= 1.0 - fade;
      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }`,
};

// Guards the bloom: a single NaN or huge specular pixel would otherwise be blurred over the whole frame.
const SanitizeShader = {
  uniforms: { tDiffuse: { value: null }, maxValue: { value: 6.0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float maxValue; varying vec2 vUv;
    void main(){ vec4 c = texture2D(tDiffuse, vUv);
      if (!(c.r == c.r) || !(c.g == c.g) || !(c.b == c.b) || c.r > 1e4 || c.g > 1e4 || c.b > 1e4) c = vec4(0.0, 0.0, 0.0, 1.0);
      c.rgb = min(c.rgb, vec3(maxValue)); gl_FragColor = c; }`,
};

export function makePost(renderer, scene, camera, { width, height, bloom = [0.7, 0.55, 0.82], dof = false } = {}) {
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  composer.addPass(new RenderPass(scene, camera));
  let bokeh = null;
  if (dof) {
    bokeh = new BokehPass(scene, camera, { focus: 3, aperture: 0.004, maxblur: 0.008 });
    composer.addPass(bokeh);
  }
  composer.addPass(new ShaderPass(SanitizeShader));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), ...bloom);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GradeShader);
  grade.uniforms.resolution.value.set(width, height);
  composer.addPass(grade);
  return { composer, grade: grade.uniforms, bloom: bloomPass, bokeh };
}
