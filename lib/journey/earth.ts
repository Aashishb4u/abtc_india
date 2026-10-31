import * as THREE from "three";
import { earthTexture, earthCloudsTexture, glowSprite } from "./textures";
import { starburstTexture, sunBloomTexture } from "./textures2";

/*
 * Photoreal Earth for the hero.
 *
 *  - ShaderMaterial globe: NASA Blue Marble day map + city-lights night map
 *    blended across a soft terminator with a warm twilight band, bump relief
 *    from the topology map, ocean sun-glint from the water mask, cloud shadows
 *    cast on the surface, and procedural micro-detail that fades in as the
 *    camera closes on India so the 4K map never looks blurry.
 *  - Separate cloud shell: sun-lit, with fbm detail layered over the cloud map.
 *  - Atmosphere: analytic ray/limb glow (blue core, cyan edge, orange at the
 *    terminator) — shaped like a real thin atmosphere, not a flat fresnel ring.
 *  - Sun starburst flare on the lit limb + dotted orbit rings with glowing nodes.
 */

/** Direction TOWARD the sun (world space). Upper-right, slightly in front. */
export const SUN_DIR = new THREE.Vector3(0.56, 0.42, 0.62).normalize();

const NOISE_GLSL = /* glsl */ `
float hash31(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash31(i), hash31(i + vec3(1,0,0)), f.x), mix(hash31(i + vec3(0,1,0)), hash31(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash31(i + vec3(0,0,1)), hash31(i + vec3(1,0,1)), f.x), mix(hash31(i + vec3(0,1,1)), hash31(i + vec3(1,1,1)), f.x), f.y),
    f.z);
}
float fbm(vec3 p){ float a = 0.5; float s = 0.0; for (int i = 0; i < 4; i++){ s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`;

const EARTH_VERT = /* glsl */ `
varying vec2 vUv;
varying vec3 vNW;
varying vec3 vPW;
varying vec3 vObj;
void main(){
  vUv = uv;
  vObj = position;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPW = wp.xyz;
  vNW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const EARTH_FRAG = /* glsl */ `
uniform sampler2D uDay;
uniform sampler2D uNight;
uniform sampler2D uSpec;
uniform sampler2D uBump;
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uCloudOff;
uniform float uDetail;
uniform float uBumpScale;
uniform float uNightGlow;
varying vec2 vUv;
varying vec3 vNW;
varying vec3 vPW;
varying vec3 vObj;
${NOISE_GLSL}

vec3 bumpNormal(vec3 p, vec3 n, float h, float s){
  vec3 sx = dFdx(p); vec3 sy = dFdy(p);
  vec3 r1 = cross(sy, n); vec3 r2 = cross(n, sx);
  float det = dot(sx, r1);
  vec3 grad = sign(det) * (dFdx(h) * r1 + dFdy(h) * r2);
  return normalize(abs(det) * n - grad * s);
}

void main(){
  vec3 N = normalize(vNW);
  vec3 V = normalize(cameraPosition - vPW);
  vec3 L = normalize(uSun);

  float hgt = texture2D(uBump, vUv).r;
  vec3 Nb = bumpNormal(vPW, N, hgt, uBumpScale);

  float ndlG = dot(N, L);
  float ndl = dot(Nb, L);
  float wm = texture2D(uSpec, vUv).r;                  // 1 = ocean

  // ---- day colour: gentle grade so it reads like a satellite photograph
  vec3 day = texture2D(uDay, vUv).rgb;
  float lum = dot(day, vec3(0.299, 0.587, 0.114));
  day = mix(vec3(lum), day, 1.14);
  day = pow(day, vec3(0.94));

  float dn = fbm(normalize(vObj) * 380.0);
  float dn2 = vnoise(normalize(vObj) * 1400.0);
  float land = 1.0 - wm;
  day *= 1.0 + ((dn - 0.5) * 0.62 + (dn2 - 0.5) * 0.3) * uDetail * (0.3 + 0.7 * land);

  // cloud shadows fall slightly down-sun of the clouds themselves
  float cSh = texture2D(uClouds, vUv + vec2(uCloudOff + 0.0014, -0.0009)).a;
  day *= 1.0 - 0.42 * smoothstep(0.1, 0.9, cSh);

  // ---- sunlight (wrapped diffuse so the terminator is soft, like real scattering)
  float wrap = clamp((ndl + 0.07) / 1.07, 0.0, 1.0);
  float diff = pow(wrap, 1.06);
  vec3 col = day * (0.012 + 1.32 * diff);

  // twilight: warm red-orange band hugging the terminator
  float tw = smoothstep(-0.1, 0.0, ndlG) * (1.0 - smoothstep(0.0, 0.18, ndlG));
  col += vec3(1.0, 0.5, 0.2) * tw * 0.07 * (0.2 + lum * 1.2);

  // ---- oceans: tight sun glint + broad sheen + fresnel sky reflection
  vec3 H = normalize(L + V);
  float nh = max(dot(Nb, H), 0.0);
  float sunUp = smoothstep(0.0, 0.18, ndlG);
  float glint = pow(nh, 1400.0) * 0.55 + pow(nh, 110.0) * 0.035;
  col += vec3(1.0, 0.93, 0.8) * glint * wm * sunUp;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
  col += vec3(0.1, 0.26, 0.6) * fres * (0.25 + 0.75 * wm) * 0.7 * sunUp;

  // ---- limb haze: the real planet washes toward blue at the edge
  float rim = pow(1.0 - max(dot(N, V), 0.0), 2.6);
  col = mix(col, col + vec3(0.2, 0.5, 1.0) * 0.55, rim * smoothstep(-0.3, 0.5, ndlG) * 0.75);

  // ---- city lights on the night side, dimmed under cloud
  float cl = texture2D(uClouds, vUv + vec2(uCloudOff, 0.0)).a;
  vec3 lights = texture2D(uNight, vUv).rgb;
  lights = pow(lights, vec3(0.85)) * vec3(1.45, 1.0, 0.62) * uNightGlow * (1.0 - 0.7 * smoothstep(0.1, 0.9, cl));
  float nightMask = 1.0 - smoothstep(-0.12, 0.12, ndlG);
  col += lights * nightMask;

  // faint airglow on the dark side so it never reads as a black cutout
  col += vec3(0.004, 0.011, 0.03) * nightMask * (0.3 + rim * 3.0);

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const CLOUD_FRAG = /* glsl */ `
uniform sampler2D uClouds;
uniform vec3 uSun;
uniform float uCloudOff;
uniform float uOpacity;
uniform float uTime;
varying vec2 vUv;
varying vec3 vNW;
varying vec3 vPW;
varying vec3 vObj;
${NOISE_GLSL}
void main(){
  vec3 N = normalize(vNW);
  vec3 V = normalize(cameraPosition - vPW);
  vec3 L = normalize(uSun);
  float c = texture2D(uClouds, vUv + vec2(uCloudOff, 0.0)).a;
  vec3 up = normalize(vObj);
  float f1 = fbm(up * 30.0 + vec3(uTime * 0.0035, 0.0, uTime * 0.002));
  float f2 = vnoise(up * 140.0);
  float dens = c * (0.58 + 0.78 * f1) + (f2 - 0.5) * 0.24 * c;
  dens = smoothstep(0.1, 0.78, dens);

  float ndl = dot(N, L);
  float lit = smoothstep(-0.14, 0.38, ndl);
  vec3 sunCol = mix(vec3(1.0, 0.58, 0.34), vec3(1.0, 0.985, 0.96), smoothstep(0.0, 0.4, ndl));
  // self-shadowing: thick cloud cores are a touch greyer, edges catch more light
  float core = smoothstep(0.55, 1.0, dens);
  vec3 col = sunCol * (0.022 + 1.02 * lit) * (1.0 - 0.2 * core);
  float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
  col += vec3(0.28, 0.52, 1.0) * rim * 0.3 * lit;

  float a = dens * uOpacity * (0.5 + 0.5 * lit);
  gl_FragColor = vec4(col, a);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const ATMO_VERT = /* glsl */ `
varying vec3 vPW;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPW = wp.xyz;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const ATMO_FRAG = /* glsl */ `
uniform vec3 uCenter;
uniform vec3 uSun;
uniform float uR;
uniform float uStrength;
varying vec3 vPW;
void main(){
  vec3 ro = cameraPosition;
  vec3 rd = normalize(vPW - ro);
  float tca = dot(uCenter - ro, rd);
  vec3 closest = ro + rd * tca;
  float x = length(closest - uCenter) / uR;      // 1.0 exactly at the limb
  float h = max(x - 1.0, 0.0);
  vec3 nrm = normalize(closest - uCenter);
  float sl = dot(nrm, normalize(uSun));
  float lit = smoothstep(-0.42, 0.5, sl);

  float core = exp(-h * 62.0);
  float halo = exp(-h * 13.0) * 0.2;
  vec3 deep = vec3(0.1, 0.34, 1.0);
  vec3 edge = vec3(0.5, 0.82, 1.0);
  vec3 col = mix(deep, edge, exp(-h * 70.0));
  float tw = exp(-pow(sl / 0.24, 2.0));
  col = mix(col, vec3(1.0, 0.52, 0.2), tw * 0.5 * exp(-h * 26.0));

  float a = (core * 1.1 + halo) * (0.18 + 0.82 * lit) * uStrength;
  gl_FragColor = vec4(col * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export interface EarthKit {
  /** Call every frame. f = float journey index, el = elapsed seconds. */
  update(el: number, f: number, camera: THREE.Camera): void;
  setVisible(v: boolean): void;
  setCloudOpacity(o: number): void;
  dispose(): void;
}

interface Opts {
  globe: THREE.Group; // rotated group at the globe centre; the kit adds earth + clouds to it
  scene: THREE.Scene;
  center: THREE.Vector3;
  radius: number;
  lowPower: boolean;
  maxAniso: number;
}

export function createEarthKit({ globe, scene, center, radius, lowPower, maxAniso }: Opts): EarthKit {
  const loader = new THREE.TextureLoader();
  const black = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
  black.needsUpdate = true;

  // placeholder visible for the first frames while the real maps stream in
  const placeholder = earthTexture(lowPower ? 1 : 2);
  const placeholderClouds = earthCloudsTexture();
  placeholderClouds.wrapS = THREE.RepeatWrapping;

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(o: T) => (disposables.push(o), o);

  const earthUniforms = {
    uDay: { value: placeholder as THREE.Texture },
    uNight: { value: black as THREE.Texture },
    uSpec: { value: black as THREE.Texture },
    uBump: { value: black as THREE.Texture },
    uClouds: { value: placeholderClouds as THREE.Texture },
    uSun: { value: SUN_DIR.clone() },
    uCloudOff: { value: 0 },
    uDetail: { value: 0.0 },
    uBumpScale: { value: 0.5 },
    uNightGlow: { value: 1.6 },
  };

  const configure = (t: THREE.Texture, srgb: boolean, repeatU = false) => {
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    if (repeatU) t.wrapS = THREE.RepeatWrapping;
    return t;
  };

  loader.load("/textures/earth/earth_day.jpg", (t) => {
    earthUniforms.uDay.value = configure(t, true);
    track(t);
  });
  loader.load("/textures/earth/earth_night.jpg", (t) => {
    earthUniforms.uNight.value = configure(t, true);
    track(t);
  });
  loader.load("/textures/earth/earth_water.png", (t) => {
    earthUniforms.uSpec.value = configure(t, false);
    track(t);
  });
  loader.load("/textures/earth/earth_topology.png", (t) => {
    earthUniforms.uBump.value = configure(t, false);
    track(t);
  });
  loader.load("/textures/earth/earth_clouds.png", (t) => {
    earthUniforms.uClouds.value = configure(t, false, true);
    track(t);
  });

  const earthMat = track(
    new THREE.ShaderMaterial({
      uniforms: earthUniforms,
      vertexShader: EARTH_VERT,
      fragmentShader: EARTH_FRAG,
    })
  );
  const earth = new THREE.Mesh(
    track(new THREE.SphereGeometry(radius, lowPower ? 96 : 192, lowPower ? 64 : 128)),
    earthMat
  );
  globe.add(earth);

  const cloudUniforms = {
    uClouds: earthUniforms.uClouds,
    uSun: earthUniforms.uSun,
    uCloudOff: earthUniforms.uCloudOff,
    uOpacity: { value: 0.95 },
    uTime: { value: 0 },
  };
  const cloudMat = track(
    new THREE.ShaderMaterial({
      uniforms: cloudUniforms,
      vertexShader: EARTH_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: true,
      depthWrite: false,
    })
  );
  const clouds = new THREE.Mesh(track(new THREE.SphereGeometry(radius * 1.009, lowPower ? 64 : 128, lowPower ? 48 : 96)), cloudMat);
  globe.add(clouds);

  // ---------- atmosphere + flare + rings (world-aligned, not tilted with the globe) ----------
  const halo = new THREE.Group();
  halo.position.copy(center);
  scene.add(halo);

  const atmoMat = track(
    new THREE.ShaderMaterial({
      uniforms: {
        uCenter: { value: center.clone() },
        uSun: earthUniforms.uSun,
        uR: { value: radius },
        uStrength: { value: 1 },
      },
      vertexShader: ATMO_VERT,
      fragmentShader: ATMO_FRAG,
      side: THREE.BackSide,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  halo.add(new THREE.Mesh(track(new THREE.SphereGeometry(radius * 1.12, 96, 64)), atmoMat));

  const burstTex = track(starburstTexture());
  const bloomTex = track(sunBloomTexture());
  const flare = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: burstTex, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  flare.renderOrder = 20;
  scene.add(flare);
  const bloom = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: bloomTex, transparent: true, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  bloom.renderOrder = 19;
  scene.add(bloom);

  // dotted orbit rings with travelling glow nodes
  const dotTex = track(glowSprite("190,225,255"));
  const nodeTex = track(glowSprite("90,190,255"));
  const ringDefs = [
    { r: 1.42, tiltX: 1.18, tiltZ: 0.32, speed: 0.07, nodes: 2 },
    { r: 1.78, tiltX: 0.9, tiltZ: -0.5, speed: -0.045, nodes: 2 },
    { r: 2.25, tiltX: 1.38, tiltZ: 0.12, speed: 0.03, nodes: 1 },
  ];
  const rings: { g: THREE.Group; nodes: { s: THREE.Sprite; ph: number }[]; speed: number; R: number }[] = [];
  for (const d of ringDefs) {
    const g = new THREE.Group();
    g.rotation.set(d.tiltX, 0, d.tiltZ);
    const R = radius * d.r;
    const count = lowPower ? 420 : 900;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * R;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = Math.sin(a) * R;
    }
    const geo = track(new THREE.BufferGeometry());
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dots = new THREE.Points(
      geo,
      track(
        new THREE.PointsMaterial({
          map: dotTex,
          size: 0.95,
          color: 0xd8ecff,
          transparent: true,
          opacity: 0.95,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    g.add(dots);
    const nodes: { s: THREE.Sprite; ph: number }[] = [];
    for (let i = 0; i < d.nodes; i++) {
      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({ map: nodeTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95 })
      );
      s.scale.set(3.4, 3.4, 1);
      g.add(s);
      nodes.push({ s, ph: (i / d.nodes) * Math.PI * 2 + d.r * 3 });
    }
    halo.add(g);
    rings.push({ g, nodes, speed: d.speed, R });
  }

  // ---------- per-frame ----------
  const view = new THREE.Vector3();
  const side = new THREE.Vector3();
  const tmp = new THREE.Vector3();

  function update(el: number, f: number, camera: THREE.Camera) {
    earthUniforms.uCloudOff.value = el * 0.00055;
    cloudUniforms.uTime.value = el;

    // micro-detail fades in as we descend toward India (4K map would blur otherwise)
    earthUniforms.uDetail.value = THREE.MathUtils.smoothstep(f, 0.55, 1.5);
    earthUniforms.uNightGlow.value = 1.6;
    // atmosphere thins out as we commit to the ground
    atmoMat.uniforms.uStrength.value = 1 - 0.55 * THREE.MathUtils.smoothstep(f, 1.2, 2.0);

    // sun flare rides the lit limb as seen from the camera
    view.copy(camera.position).sub(center).normalize();
    side.copy(SUN_DIR).addScaledVector(view, -SUN_DIR.dot(view));
    if (side.lengthSq() < 1e-4) side.set(1, 0, 0);
    side.normalize();
    const camDist = camera.position.distanceTo(center);
    flare.position.copy(center).addScaledVector(side, radius * 1.015);
    bloom.position.copy(flare.position);
    const k = camDist / 140;
    const fade = 1 - THREE.MathUtils.smoothstep(f, 0.35, 1.15);
    const pulse = 0.94 + 0.06 * Math.sin(el * 0.8);
    flare.scale.setScalar(36 * k * pulse);
    bloom.scale.setScalar(120 * k);
    flare.material.opacity = 0.95 * fade;
    bloom.material.opacity = 0.8 * fade;

    // orbit nodes
    for (const r of rings) {
      for (const n of r.nodes) {
        const a = n.ph + el * r.speed * 2.2;
        n.s.position.set(Math.cos(a) * r.R, 0, Math.sin(a) * r.R);
      }
      r.g.rotation.y = el * r.speed * 0.15;
    }
    const ringFade = 1 - THREE.MathUtils.smoothstep(f, 0.5, 1.3);
    for (const r of rings) {
      r.g.visible = ringFade > 0.01;
      for (const c of r.g.children) {
        const m = (c as THREE.Points | THREE.Sprite).material as THREE.Material & { opacity: number };
        if (c instanceof THREE.Points) m.opacity = 0.95 * ringFade;
        else m.opacity = 0.95 * ringFade;
      }
    }
    void tmp;
  }

  return {
    update,
    setVisible(v) {
      halo.visible = v;
      flare.visible = v;
      bloom.visible = v;
    },
    setCloudOpacity(o) {
      cloudUniforms.uOpacity.value = 0.95 * o;
    },
    dispose() {
      disposables.forEach((d) => d.dispose());
      scene.remove(halo, flare, bloom);
    },
  };
}
