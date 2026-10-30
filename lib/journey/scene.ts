import * as THREE from "three";
import { JOURNEY_STOPS, progressToFloatIndex, type JourneyStop } from "./stops";
import {
  earthTexture,
  earthCloudsTexture,
  puneTerrainTexture,
  cloudPuffTexture,
  glowSprite,
  marbleFloorTexture,
  paverTexture,
  abtcSignTexture,
  sanctuarySealTexture,
  charterTexture,
  mirrorTexture,
} from "./textures";

/*
 * Scroll-driven cinematic journey:
 *   00 Earth in orbit  ->  01 India  ->  02 Pune close-up
 *   ->  03 dive through the clouds to the ABTC campus at night
 *   ->  04 inside the Master Aesthetic Sanctuary.
 *
 * World layout
 * ------------
 * The globe floats high above the "ground world": centre (0, 142, -6), radius 36.
 * It is rotated so Pune sits exactly on the lower-front point the camera
 * approaches. The campus + interior live around the origin (y = 0 ground).
 * A volumetric cloud deck (y 28..95) plus a camera-attached whiteout quad
 * hide the globe/ground swap during the descent, so the cut is invisible.
 */

const GLOBE_CENTER = new THREE.Vector3(0, 142, -6);
const GLOBE_R = 36;

// Brand palette
const COL = {
  navy: 0x17145b,
  midnight: 0x05033a,
  blue: 0x0799e8,
  iceBlue: 0x7ce0ff,
  gold: 0xffd97d,
  cream: 0xf4efe6,
  ice: 0xe7f1fc,
  wallIn: 0xeef2f8,
};

export interface JourneySceneOptions {
  onReady?: () => void;
  lowPower?: boolean;
}

export interface JourneyScene {
  /** 0..1 progress along the whole journey (smoothed internally). */
  setProgress: (p: number) => void;
  /** -1..1 pointer position for subtle parallax. */
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  dispose: () => void;
  stops: JourneyStop[];
}

// ---------- tiny helpers ----------

type V3 = [number, number, number];

function std(color: number, roughness = 0.7, metalness = 0, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
}

/** Box whose pos.y is its BOTTOM — easier for architecture. */
function box(parent: THREE.Object3D, size: V3, mat: THREE.Material, pos: V3, rotY = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  m.position.set(pos[0], pos[1] + size[1] / 2, pos[2]);
  m.rotation.y = rotY;
  parent.add(m);
  return m;
}

function cyl(parent: THREE.Object3D, rTop: number, rBot: number, h: number, mat: THREE.Material, pos: V3, seg = 16) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, h, seg), mat);
  m.position.set(pos[0], pos[1] + h / 2, pos[2]);
  parent.add(m);
  return m;
}

function group(parent: THREE.Object3D, pos: V3 = [0, 0, 0], rotY = 0) {
  const g = new THREE.Group();
  g.position.set(...pos);
  g.rotation.y = rotY;
  parent.add(g);
  return g;
}

const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Unit vector on the textured globe for a given lat/lon (matches equirect UV mapping). */
function latLonToUnit(lat: number, lon: number) {
  const la = (lat * Math.PI) / 180;
  const lo = (lon * Math.PI) / 180;
  return new THREE.Vector3(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
}

/** Orthonormal basis whose +Z is `f` and whose +Y is as close to world-up as possible. */
function alignedBasis(f: THREE.Vector3) {
  const up = new THREE.Vector3(0, 1, 0);
  const u = up.clone().addScaledVector(f, -up.dot(f)).normalize();
  const x = new THREE.Vector3().crossVectors(u, f).normalize();
  return new THREE.Matrix4().makeBasis(x, u, f);
}

// ---------- the scene ----------

export function createJourneyScene(canvas: HTMLCanvasElement, opts: JourneySceneOptions = {}): JourneyScene {
  const lowPower = !!opts.lowPower;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, powerPreference: "high-performance" });
  // Ultra-crisp output: supersample up to 3x on capable machines ("4K mode")
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(lowPower ? Math.min(dpr, 1.5) : Math.min(Math.max(dpr, 2), 3));
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x020514);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 900);
  scene.add(camera);

  // ===== Global lights =====
  scene.add(new THREE.HemisphereLight(0x9db9e8, 0x0a0f2e, 0.75));
  const moon = new THREE.DirectionalLight(0xbfd9ff, 1.25);
  moon.position.set(70, 120, 140);
  scene.add(moon);

  // ===== Starfield =====
  const starCount = lowPower ? 900 : 1700;
  const starGeo = new THREE.BufferGeometry();
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    // random directions on a big sphere around the whole journey
    const v = new THREE.Vector3().randomDirection().multiplyScalar(300 + Math.random() * 120);
    sp[i * 3] = v.x;
    sp[i * 3 + 1] = v.y + 90;
    sp[i * 3 + 2] = v.z;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const starTex = glowSprite("190,220,255");
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      map: starTex,
      size: 2.2,
      color: 0xcfe2ff,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
    })
  );
  scene.add(stars);

  // sparse layer of bigger, gold-tinted stars that twinkle
  const starBCount = lowPower ? 120 : 260;
  const starBGeo = new THREE.BufferGeometry();
  const sb = new Float32Array(starBCount * 3);
  for (let i = 0; i < starBCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(260 + Math.random() * 140);
    sb[i * 3] = v.x;
    sb[i * 3 + 1] = v.y + 90;
    sb[i * 3 + 2] = v.z;
  }
  starBGeo.setAttribute("position", new THREE.BufferAttribute(sb, 3));
  const starsBMat = new THREE.PointsMaterial({
    map: glowSprite("255,226,170"),
    size: 4.2,
    color: 0xffe2b0,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.7,
  });
  const starsB = new THREE.Points(starBGeo, starsBMat);
  scene.add(starsB);

  // deep-space nebulae behind the globe
  const nebulae: THREE.Sprite[] = [];
  const nebulaDefs: [string, V3, number, number][] = [
    ["60,100,255", [-160, 220, -280], 420, 0.14],
    ["140,70,255", [180, 90, -300], 360, 0.11],
    ["20,160,232", [40, 300, -260], 300, 0.12],
  ];
  for (const [col, pos, sc, op] of nebulaDefs) {
    const neb = new THREE.Sprite(
      new THREE.SpriteMaterial({ map: glowSprite(col), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: op })
    );
    neb.position.set(...pos);
    neb.scale.set(sc, sc * 0.72, 1);
    scene.add(neb);
    nebulae.push(neb);
  }

  // ===== Globe =====
  const globe = new THREE.Group();
  globe.position.copy(GLOBE_CENTER);
  scene.add(globe);

  const earthTex = earthTexture(lowPower ? 1 : 2);
  earthTex.anisotropy = maxAniso;
  const earthMat = new THREE.MeshStandardMaterial({
    map: earthTex,
    emissive: 0xffffff,
    emissiveMap: earthTex,
    emissiveIntensity: 0.55,
    roughness: 0.95,
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, lowPower ? 64 : 96, lowPower ? 48 : 64), earthMat);
  globe.add(earth);

  const cloudsTex = earthCloudsTexture();
  const orbitCloudsMat = new THREE.MeshStandardMaterial({
    map: cloudsTex,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    emissive: 0xffffff,
    emissiveMap: cloudsTex,
    emissiveIntensity: 0.25,
  });
  const orbitClouds = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.012, 48, 32), orbitCloudsMat);
  globe.add(orbitClouds);

  // Fresnel atmosphere halo
  const atmosMat = new THREE.ShaderMaterial({
    uniforms: { c: { value: new THREE.Color(0x3fb4ff) } },
    vertexShader: `
      varying vec3 vN; varying vec3 vP;
      void main() {
        vN = normalize(normalMatrix * normal);
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vP = mv.xyz;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform vec3 c; varying vec3 vN; varying vec3 vP;
      void main() {
        float f = pow(1.0 - abs(dot(normalize(vN), normalize(-vP))), 3.0);
        gl_FragColor = vec4(c, f * 0.85);
      }`,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const atmos = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.16, 48, 32), atmosMat);
  globe.add(atmos);

  // soft outer halo — a second, wider breath of atmosphere
  const atmosOuterMat = atmosMat.clone();
  atmosOuterMat.uniforms = { c: { value: new THREE.Color(0x1b63d6) } };
  const atmosOuter = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.34, 48, 32), atmosOuterMat);
  globe.add(atmosOuter);

  // --- Orient the globe so Pune faces the camera's approach path ---
  const puneLocal = latLonToUnit(18.5204, 73.8567);
  // direction (from globe centre) that the stop cameras fly toward
  const approach = new THREE.Vector3(0, 120.6, 24.2).sub(GLOBE_CENTER).normalize();
  const mLocal = alignedBasis(puneLocal);
  const mWorld = alignedBasis(approach);
  globe.quaternion.setFromRotationMatrix(mWorld.multiply(mLocal.invert()));

  // --- Pune terrain decal (fades in as we get close) ---
  const puneTex = puneTerrainTexture(lowPower ? 1 : 2);
  puneTex.anisotropy = maxAniso;
  const decalMat = new THREE.MeshBasicMaterial({
    map: puneTex,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const decal = new THREE.Mesh(new THREE.CircleGeometry(4.8, 64), decalMat);
  decal.position.copy(puneLocal).multiplyScalar(GLOBE_R * 1.004);
  decal.quaternion.setFromRotationMatrix(alignedBasis(puneLocal));
  decal.renderOrder = 2;
  globe.add(decal);

  // --- Pune beacon: pulsing ring + glow ---
  const beaconGlowTex = glowSprite("255,217,125");
  const beacon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: beaconGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 })
  );
  beacon.scale.set(3.4, 3.4, 1);
  beacon.position.copy(puneLocal).multiplyScalar(GLOBE_R * 1.006);
  globe.add(beacon);

  const ringMat = new THREE.MeshBasicMaterial({ color: COL.gold, transparent: true, opacity: 0.85, side: THREE.DoubleSide, depthWrite: false });
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 48), ringMat);
  ring.position.copy(puneLocal).multiplyScalar(GLOBE_R * 1.006);
  ring.quaternion.setFromRotationMatrix(alignedBasis(puneLocal));
  ring.renderOrder = 3;
  globe.add(ring);

  // --- Zurich -> Pune connection arc with a travelling pulse ---
  const zurichLocal = latLonToUnit(47.3769, 8.5417);
  const arcPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const v = zurichLocal
      .clone()
      .lerp(puneLocal, t)
      .normalize()
      .multiplyScalar(GLOBE_R * (1 + 0.17 * Math.sin(t * Math.PI)));
    arcPts.push(v);
  }
  const arcCurve = new THREE.CatmullRomCurve3(arcPts);
  const arc = new THREE.Mesh(
    new THREE.TubeGeometry(arcCurve, 64, 0.09, 6),
    new THREE.MeshBasicMaterial({ color: COL.gold, transparent: true, opacity: 0.75, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  globe.add(arc);
  const arcPulse = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: beaconGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  arcPulse.scale.set(2.6, 2.6, 1);
  globe.add(arcPulse);

  // --- Gold light pillar rising from Pune ---
  const beamMat = new THREE.MeshBasicMaterial({
    color: COL.gold,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.5, 8, 16, 1, true), beamMat);
  beam.position.copy(puneLocal).multiplyScalar(GLOBE_R + 3.6);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), puneLocal);
  globe.add(beam);

  // --- Little satellite gliding around the globe ---
  const sat = new THREE.Group();
  const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.4), std(0xd8e2f0, 0.4, 0.7));
  sat.add(satBody);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x0b2a66, emissive: 0x1450c8, emissiveIntensity: 0.9, roughness: 0.4 });
  for (const sx of [-1, 1]) {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.06, 1.1), panelMat);
    panel.position.x = sx * 2.2;
    sat.add(panel);
  }
  const satGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowSprite("180,220,255"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.5 })
  );
  satGlow.scale.set(3, 3, 1);
  sat.add(satGlow);
  scene.add(sat);

  // ===== Volumetric cloud deck (the descent) =====
  const deck = new THREE.Group();
  scene.add(deck);
  const puffTex = cloudPuffTexture();
  const puffTints: [number, number][] = [
    [0xffffff, 0.42],
    [0xf2f7ff, 0.62],
    [0xe3edfc, 0.82],
    [0xd4e2f6, 0.55],
  ];
  const puffMats = puffTints.map(
    ([color, o]) => new THREE.SpriteMaterial({ map: puffTex, color, transparent: true, opacity: o, depthWrite: false })
  );
  const puffCount = lowPower ? 34 : 104;
  const puffs: { s: THREE.Sprite; bx: number; seed: number }[] = [];
  for (let i = 0; i < puffCount; i++) {
    const s = new THREE.Sprite(puffMats[i % puffMats.length]);
    const y = 28 + Math.pow(Math.random(), 0.8) * 66; // denser lower-mid
    const x = (Math.random() - 0.5) * 95;
    const z = -6 + Math.random() * 54;
    const sc = 9 + Math.random() * 19;
    s.position.set(x, y, z);
    s.scale.set(sc, sc * (0.5 + Math.random() * 0.25), 1);
    deck.add(s);
    puffs.push({ s, bx: x, seed: Math.random() * 100 });
  }

  // Camera-attached whiteout quad — peaks mid-descent to hide the world swap
  const whiteMat = new THREE.MeshBasicMaterial({
    color: 0xe9f3fd,
    transparent: true,
    opacity: 0,
    depthTest: false,
    depthWrite: false,
  });
  const white = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), whiteMat);
  white.position.set(0, 0, -1.2);
  white.renderOrder = 999;
  white.visible = false;
  camera.add(white);

  // ===== Ground world: the ABTC campus at night =====
  const campus = new THREE.Group();
  scene.add(campus);

  const paver = paverTexture();
  paver.repeat.set(34, 22);
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(170, 110), std(0x9fb0c8, 0.95, 0, { map: paver }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0, 22);
  campus.add(plaza);

  const mats = {
    facade: std(0xdfe6f1, 0.85),
    facadeDark: std(0x1d2a52, 0.8),
    navy: std(COL.navy, 0.55),
    gold: std(0xc9a24d, 0.35, 0.65),
    goldGlow: new THREE.MeshStandardMaterial({ color: COL.gold, emissive: COL.gold, emissiveIntensity: 1.6 }),
    blueGlow: new THREE.MeshStandardMaterial({ color: COL.blue, emissive: COL.blue, emissiveIntensity: 1.3 }),
    windowLit: new THREE.MeshStandardMaterial({ color: 0xffdf9e, emissive: 0xffc46a, emissiveIntensity: 1.25 }),
    windowCool: new THREE.MeshStandardMaterial({ color: 0xa8d8ff, emissive: 0x6fb8ef, emissiveIntensity: 0.9 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xbcd8ea,
      roughness: 0.06,
      transparent: true,
      opacity: 0.22,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    trunk: std(0x5c4530, 0.9),
    leaf: std(0x2f7a46, 0.8),
    leafDark: std(0x1f5c33, 0.85),
    cityDark: std(0x0a1130, 0.9),
  };

  // --- Building shell (interior lives inside: x -11..11, z -10.5..6, h 4.2) ---
  const IH = 4.2;
  const bld = group(campus);
  const wallIn = std(COL.wallIn, 0.9);
  // front wall with 3.0m door opening (x -1.5..1.5)
  box(bld, [9.5, IH, 0.35], mats.facade, [-6.25, 0, 6]);
  box(bld, [9.5, IH, 0.35], mats.facade, [6.25, 0, 6]);
  box(bld, [3.0, IH - 3.1, 0.35], mats.facade, [0, 3.1, 6]);
  // sides + back
  box(bld, [0.35, IH, 16.9], mats.facade, [-11, 0, -2.25]);
  box(bld, [0.35, IH, 16.9], mats.facade, [11, 0, -2.25]);
  box(bld, [22.4, IH, 0.35], wallIn, [0, 0, -10.5]);
  // upper storey (solid) + roof — front face flush with the ground-floor wall
  box(bld, [23, 4.6, 16.85], mats.facade, [0, IH, -2.25]);
  box(bld, [23.6, 0.3, 17.6], mats.facadeDark, [0, IH + 4.6, -2.25]);
  // gold trims between floors and at the roofline
  box(bld, [23.2, 0.12, 0.12], mats.goldGlow, [0, IH + 0.02, 6.32]);
  box(bld, [23.2, 0.12, 0.12], mats.goldGlow, [0, IH + 4.52, 6.32]);

  // ground-floor windows, warm-lit, with navy frames
  for (const x of [-4.4, -8.1, 4.4, 8.1]) {
    box(bld, [2.3, 1.9, 0.1], mats.facadeDark, [x, 1.15, 6.14]);
    box(bld, [2.0, 1.6, 0.1], mats.windowLit, [x, 1.3, 6.17]);
  }
  // upper windows flanking the sign
  for (const x of [-9.6, -7.9, 7.9, 9.6]) {
    box(bld, [1.25, 1.7, 0.08], mats.windowCool, [x, IH + 1.7, 6.2]);
  }

  // --- Main sign ---
  const sign = abtcSignTexture();
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12.6, 3.15),
    new THREE.MeshStandardMaterial({ map: sign.tex, emissive: 0xffffff, emissiveMap: sign.tex, emissiveIntensity: 0.75, roughness: 0.6 })
  );
  signMesh.position.set(0, IH + 2.4, 6.46);
  campus.add(signMesh);
  box(campus, [13.1, 3.6, 0.12], mats.navy, [0, IH + 0.6, 6.3]);

  // --- Entrance: canopy, columns, pad, door ---
  box(bld, [7.2, 0.2, 2.8], mats.facadeDark, [0, 3.35, 7.3]);
  box(bld, [7.2, 0.07, 0.07], mats.goldGlow, [0, 3.32, 8.68]);
  for (const x of [-2.9, 2.9]) {
    cyl(bld, 0.26, 0.3, 3.35, mats.navy, [x, 0, 7.9], 18);
    cyl(bld, 0.34, 0.34, 0.12, mats.gold, [x, 3.23, 7.9], 18);
  }
  box(bld, [7.4, 0.09, 3.6], std(0xcfd8e6, 0.9), [0, 0, 7.6]);
  box(bld, [7.4, 0.05, 0.1], mats.goldGlow, [0, 0.07, 9.35]);

  // door frame
  box(bld, [0.14, 3.1, 0.3], mats.navy, [-1.5, 0, 6]);
  box(bld, [0.14, 3.1, 0.3], mats.navy, [1.5, 0, 6]);
  box(bld, [3.14, 0.14, 0.3], mats.navy, [0, 3.0, 6]);
  // glass double doors on pivots
  const makeLeaf = (hingeX: number, dir: 1 | -1) => {
    const pivot = group(bld, [hingeX, 0, 6]);
    box(pivot, [1.38, 2.86, 0.04], mats.glass, [dir * 0.72, 0.05, 0]);
    box(pivot, [1.44, 0.1, 0.07], mats.navy, [dir * 0.72, 0, 0]);
    box(pivot, [1.44, 0.1, 0.07], mats.navy, [dir * 0.72, 2.84, 0]);
    box(pivot, [0.07, 2.95, 0.07], mats.navy, [dir * 0.05, 0, 0]);
    box(pivot, [0.07, 2.95, 0.07], mats.navy, [dir * 1.4, 0, 0]);
    box(pivot, [0.05, 0.6, 0.09], mats.gold, [dir * 1.22, 1.15, 0.05]);
    return pivot;
  };
  const leafL = makeLeaf(-1.43, 1);
  const leafR = makeLeaf(1.43, -1);

  // --- Trees, planters, lamps ---
  const makeTree = (pos: V3, s = 1) => {
    const g = group(campus, pos);
    g.scale.setScalar(s);
    box(g, [1.0, 0.55, 1.0], mats.navy, [0, 0, 0]);
    box(g, [1.06, 0.07, 1.06], mats.gold, [0, 0.55, 0]);
    cyl(g, 0.09, 0.13, 1.4, mats.trunk, [0, 0.6, 0], 8);
    const geo = new THREE.IcosahedronGeometry(0.75, 1);
    for (let i = 0; i < 4; i++) {
      const b = new THREE.Mesh(geo, i % 2 ? mats.leaf : mats.leafDark);
      b.position.set((Math.random() - 0.5) * 0.7, 2.1 + (Math.random() - 0.4) * 0.7, (Math.random() - 0.5) * 0.7);
      b.scale.setScalar(0.72 + Math.random() * 0.5);
      g.add(b);
    }
    return g;
  };
  makeTree([-5.3, 0, 8.6], 1.05);
  makeTree([5.3, 0, 8.6], 1.05);
  makeTree([-9.8, 0, 10.5], 0.85);
  makeTree([9.8, 0, 10.5], 0.85);

  const lampGlowTex = glowSprite("255,200,120");
  const lampConeMat = new THREE.MeshBasicMaterial({
    color: 0xffd9a0,
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (const x of [-8, 8]) {
    cyl(campus, 0.06, 0.09, 4.4, mats.facadeDark, [x, 0, 13.5], 10);
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: lampGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    gl.position.set(x, 4.5, 13.5);
    gl.scale.set(2.6, 2.6, 1);
    campus.add(gl);
    // volumetric light cone falling onto the plaza
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.9, 4.4, 24, 1, true), lampConeMat);
    cone.position.set(x, 2.2, 13.5);
    campus.add(cone);
    const pl = new THREE.PointLight(0xffc37a, 9, 15, 1.6);
    pl.position.set(x, 4.3, 13.3);
    campus.add(pl);
  }
  // soft bloom halo behind the main sign
  const signHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: glowSprite("90,180,255"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.3 })
  );
  signHalo.position.set(0, IH + 2.4, 6.6);
  signHalo.scale.set(17, 6, 1);
  campus.add(signHalo);
  // warm spill from the entrance doors
  const doorHalo = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: lampGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 })
  );
  doorHalo.position.set(0, 1.6, 6.8);
  doorHalo.scale.set(5.5, 3.6, 1);
  campus.add(doorHalo);
  // entrance wash light
  const entLight = new THREE.PointLight(0xffe0ae, 7, 13, 1.7);
  entLight.position.set(0, 3.6, 8.6);
  campus.add(entLight);
  // sign wash
  const signLight = new THREE.PointLight(0xcfe8ff, 5, 12, 1.8);
  signLight.position.set(0, IH + 2.4, 9);
  campus.add(signLight);

  // --- Distant city silhouettes ---
  const cityWinGeo = new THREE.PlaneGeometry(0.55, 0.75);
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const citySpots: V3[] = [];
  for (let i = 0; i < 9; i++) citySpots.push([rand(-70, 70), 0, rand(-70, -44)]);
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) citySpots.push([side * rand(26, 62), 0, rand(-26, 8)]);
  for (const [cx, , cz] of citySpots) {
    if (Math.abs(cx) < 15 && cz > -40) continue;
    const w = rand(4.5, 8.5);
    const h = rand(7, 20);
    const d = rand(4.5, 8);
    box(campus, [w, h, d], mats.cityDark, [cx, 0, cz]);
    const winCount = 4 + ((Math.random() * 4) | 0);
    for (let k = 0; k < winCount; k++) {
      const win = new THREE.Mesh(cityWinGeo, Math.random() > 0.4 ? mats.windowLit : mats.windowCool);
      win.position.set(cx + rand(-w / 2 + 0.6, w / 2 - 0.6), rand(1.5, h - 1), cz + d / 2 + 0.02);
      campus.add(win);
    }
  }

  // ===== Interior: Master Aesthetic Sanctuary =====
  const hall = group(campus);

  const marble = marbleFloorTexture();
  marble.repeat.set(9, 7);
  const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(21.6, 16.3), std(0xffffff, 0.25, 0, { map: marble, envMapIntensity: 0.4 }));
  hallFloor.rotation.x = -Math.PI / 2;
  hallFloor.position.set(0, 0.02, -2.3);
  hall.add(hallFloor);

  // inner wall skins (so the inside is bright even though the shell is shared)
  box(hall, [0.1, IH, 16.4], wallIn, [-10.78, 0, -2.3]);
  box(hall, [0.1, IH, 16.4], wallIn, [10.78, 0, -2.3]);
  // navy wainscot
  box(hall, [0.12, 1.0, 16.4], mats.navy, [-10.76, 0, -2.3]);
  box(hall, [0.12, 1.0, 16.4], mats.navy, [10.76, 0, -2.3]);
  box(hall, [21.5, 1.0, 0.12], mats.navy, [0, 0, -10.28]);

  // ceiling + gold cove + downlights
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(21.6, 16.4), std(0xf6f8fb, 0.95));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, IH - 0.02, -2.3);
  hall.add(ceil);
  box(hall, [20.8, 0.06, 0.06], mats.goldGlow, [0, IH - 0.2, -10.1]);
  box(hall, [20.8, 0.06, 0.06], mats.goldGlow, [0, IH - 0.2, 5.6]);
  box(hall, [0.06, 0.06, 15.6], mats.goldGlow, [-10.5, IH - 0.2, -2.3]);
  box(hall, [0.06, 0.06, 15.6], mats.goldGlow, [10.5, IH - 0.2, -2.3]);
  const dlGeo = new THREE.CircleGeometry(0.14, 20);
  const dlMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff2d8, emissiveIntensity: 2.6 });
  const dlGlowMat = new THREE.SpriteMaterial({
    map: glowSprite("255,236,200"),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.4,
  });
  for (const x of [-6, 0, 6]) {
    for (const z of [-8, -4.5, -1, 2.5]) {
      const d = new THREE.Mesh(dlGeo, dlMat);
      d.rotation.x = Math.PI / 2;
      d.position.set(x, IH - 0.03, z);
      hall.add(d);
      const g = new THREE.Sprite(dlGlowMat);
      g.position.set(x, IH - 0.12, z);
      g.scale.set(1.1, 1.1, 1);
      hall.add(g);
    }
  }

  // drifting gold dust in the hall air
  const moteCount = lowPower ? 70 : 170;
  const moteGeo = new THREE.BufferGeometry();
  const mp = new Float32Array(moteCount * 3);
  for (let i = 0; i < moteCount; i++) {
    mp[i * 3] = (Math.random() - 0.5) * 19;
    mp[i * 3 + 1] = 0.3 + Math.random() * 3.4;
    mp[i * 3 + 2] = -10 + Math.random() * 15;
  }
  moteGeo.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  const motes = new THREE.Points(
    moteGeo,
    new THREE.PointsMaterial({
      map: glowSprite("255,220,150"),
      size: 0.055,
      color: 0xffe3b0,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.65,
    })
  );
  hall.add(motes);

  // back-wall seal plaque
  const seal = sanctuarySealTexture();
  const sealMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.4, 3.2),
    new THREE.MeshStandardMaterial({ map: seal.tex, emissive: 0xffffff, emissiveMap: seal.tex, emissiveIntensity: 0.6, roughness: 0.6 })
  );
  sealMesh.position.set(0, 2.25, -10.2);
  hall.add(sealMesh);
  box(hall, [6.8, 3.6, 0.1], mats.navy, [0, 0.45, -10.26]);
  box(hall, [6.9, 0.07, 0.14], mats.goldGlow, [0, 0.42, -10.2]);

  // framed charters on the side walls
  const charter = charterTexture();
  const charterMat = new THREE.MeshStandardMaterial({ map: charter, roughness: 0.7 });
  const charterGeo = new THREE.PlaneGeometry(1.15, 1.44);
  const charterFrameGeo = new THREE.BoxGeometry(0.06, 1.62, 1.33);
  for (const side of [-1, 1]) {
    for (const z of [-7.5, -4.5, -1.5]) {
      const fr = new THREE.Mesh(charterFrameGeo, mats.gold);
      fr.position.set(side * 10.68, 2.15, z);
      hall.add(fr);
      const ch = new THREE.Mesh(charterGeo, charterMat);
      ch.position.set(side * 10.62, 2.15, z);
      ch.rotation.y = side * -Math.PI / 2;
      hall.add(ch);
    }
  }

  // two mirror stations on the left wall
  const mirrorMat = new THREE.MeshStandardMaterial({ map: mirrorTexture(), roughness: 0.06, metalness: 0.15 });
  for (const z of [1.2, 3.6]) {
    const g = group(hall, [-10.6, 0, z], Math.PI / 2);
    box(g, [1.2, 1.6, 0.06], mats.gold, [0, 0.95, 0]);
    const mi = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 1.44), mirrorMat);
    mi.position.set(0, 1.73, 0.05);
    g.add(mi);
    box(g, [1.3, 0.07, 0.5], std(0xf2ead9, 0.5), [0, 0.86, 0.26]);
    box(g, [1.3, 0.04, 0.04], mats.goldGlow, [0, 2.62, 0.05]);
  }

  // treatment beds — two rows flanking the central aisle
  const bedBase = std(0xe9eef6, 0.6);
  const bedTop = std(0xf7f3ea, 0.5);
  const makeBed = (pos: V3, rotY: number) => {
    const g = group(hall, pos, rotY);
    box(g, [2.0, 0.55, 0.78], bedBase, [0, 0, 0]);
    box(g, [2.0, 0.05, 0.05], mats.goldGlow, [0, 0.28, 0.39]);
    box(g, [1.45, 0.14, 0.8], bedTop, [0.26, 0.55, 0]);
    const back = box(g, [0.72, 0.13, 0.8], bedTop, [-0.78, 0.72, 0]);
    back.rotation.z = -0.48;
    const towel = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.52, 14), std(0xffe9c4, 0.9));
    towel.rotation.x = Math.PI / 2;
    towel.position.set(0.88, 0.74, 0);
    g.add(towel);
    // magnifier lamp
    cyl(g, 0.12, 0.15, 0.04, mats.navy, [0.6, 0, 0.62], 14);
    cyl(g, 0.016, 0.016, 1.35, mats.gold, [0.6, 0.04, 0.62], 8);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.025, 8, 20), mats.goldGlow);
    halo.position.set(0.52, 1.42, 0.5);
    halo.rotation.x = -1.0;
    g.add(halo);
    return g;
  };
  makeBed([-4.2, 0, -3.2], 0.12);
  makeBed([-4.2, 0, -6.6], -0.08);
  makeBed([4.2, 0, -3.2], Math.PI - 0.12);
  makeBed([4.2, 0, -6.6], Math.PI + 0.08);

  // product shelf along the right wall with little bottles
  const shelfG = group(hall, [10.45, 0, 1.9], -Math.PI / 2);
  box(shelfG, [3.4, 0.08, 0.4], mats.navy, [0, 1.05, 0]);
  box(shelfG, [3.4, 0.08, 0.4], mats.navy, [0, 1.75, 0]);
  box(shelfG, [3.5, 0.04, 0.04], mats.goldGlow, [0, 1.0, 0.2]);
  const bottleCols = [std(0xffffff, 0.35), std(COL.blue, 0.4), std(0xd9b45e, 0.35, 0.4)];
  for (const y of [1.13, 1.83]) {
    for (let i = 0; i < 9; i++) {
      const r = 0.045 + Math.random() * 0.03;
      cyl(shelfG, r, r, 0.16 + Math.random() * 0.14, bottleCols[i % 3], [-1.5 + i * 0.36, y, (Math.random() - 0.5) * 0.14], 10);
    }
  }

  // central emblem rug
  const rug = new THREE.Mesh(new THREE.CircleGeometry(2.1, 48), std(COL.navy, 0.95));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.035, -4.6);
  hall.add(rug);
  const rugRing = new THREE.Mesh(new THREE.RingGeometry(1.75, 1.9, 48), new THREE.MeshStandardMaterial({ color: COL.gold, emissive: COL.gold, emissiveIntensity: 0.6 }));
  rugRing.rotation.x = -Math.PI / 2;
  rugRing.position.set(0, 0.04, -4.6);
  hall.add(rugRing);

  // interior lights
  for (const [x, z, i] of [
    [0, -2, 7],
    [-5.5, -6, 5.5],
    [5.5, -6, 5.5],
    [0, -8.8, 4],
  ] as const) {
    const pl = new THREE.PointLight(0xffe8c8, i, 13, 1.7);
    pl.position.set(x, IH - 0.5, z);
    campus.add(pl);
  }
  const sealBlue = new THREE.PointLight(0x4fb9ff, 3.5, 8, 1.8);
  sealBlue.position.set(0, 2.2, -8.6);
  campus.add(sealBlue);

  // Webfonts may land after first paint — redraw the text textures when ready.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready
      .then(() => {
        sign.redraw();
        seal.redraw();
      })
      .catch(() => {});
  }

  // ===== Camera path =====
  const stops = JOURNEY_STOPS;
  const n = stops.length - 1;
  const camPos = stops.map((s) => new THREE.Vector3(...s.cam));
  const camLook = stops.map((s) => new THREE.Vector3(...s.look));
  const fovs = stops.map((s) => s.fov ?? 46);

  let target = 0;
  let current = 0;
  let fovBoost = 0;
  let roll = 0;
  const pointer = new THREE.Vector2();
  const pointerSmooth = new THREE.Vector2();
  const tmpPos = new THREE.Vector3();
  const tmpLook = new THREE.Vector3();
  const prevPos = new THREE.Vector3(...stops[0].cam);
  const velV = new THREE.Vector3();
  const rightV = new THREE.Vector3();

  let poseFov = fovs[0];
  function poseAt(p: number) {
    // weighted segments: the final leg through the doors gets extra scroll room
    const f = Math.min(n - 1e-6, progressToFloatIndex(p));
    const i = Math.floor(f);
    // dwell at each stop: travel happens in the middle of each segment
    const t = easeInOut(smooth(0.12, 0.88, f - i));
    tmpPos.lerpVectors(camPos[i], camPos[i + 1], t);
    tmpLook.lerpVectors(camLook[i], camLook[i + 1], t);
    poseFov = fovs[i] + (fovs[i + 1] - fovs[i]) * t;
    return f;
  }

  // ===== Resize =====
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fovBoost = camera.aspect < 0.75 ? 16 : camera.aspect < 1.1 ? 8 : 0;
    camera.updateProjectionMatrix();
  }
  resize();

  // ===== Loop =====
  let lastT = performance.now();
  let el = 0;
  let raf = 0;
  let readySent = false;

  function tick() {
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.1);
    lastT = now;
    el += dt;

    // critically-damped-ish chase: this is what makes the travel feel human
    current += (target - current) * Math.min(1, dt * 4.2);
    if (Math.abs(target - current) < 1e-5) current = target;

    const f = poseAt(current);

    // pointer parallax scaled by distance so it feels equal at every altitude
    pointerSmooth.lerp(pointer, Math.min(1, dt * 3));
    const dist = tmpPos.distanceTo(tmpLook);
    tmpLook.x += pointerSmooth.x * dist * 0.016;
    tmpLook.y += pointerSmooth.y * dist * 0.01;
    // gentle idle float so resting frames still breathe
    tmpPos.y += Math.sin(el * 0.55) * dist * 0.0012;
    velV.subVectors(tmpPos, prevPos);
    prevPos.copy(tmpPos);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
    // cinematic banking: lean into lateral motion like a pilot would
    rightV.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const lateral = velV.dot(rightV) / Math.max(dt, 1e-3);
    const rollTarget = THREE.MathUtils.clamp(-lateral * 0.0035, -0.07, 0.07) - pointerSmooth.x * 0.012;
    roll += (rollTarget - roll) * Math.min(1, dt * 2.2);
    camera.rotateZ(roll);
    camera.fov = poseFov + fovBoost;
    camera.updateProjectionMatrix();
    // exposure warms up as we step inside
    renderer.toneMappingExposure = 1.03 + 0.13 * smooth(2.7, 3.7, f);

    // slow idle motion
    stars.rotation.y = el * 0.004;
    starsB.rotation.y = -el * 0.0028;
    starsBMat.opacity = 0.45 + 0.3 * Math.sin(el * 1.4);
    orbitClouds.rotation.y = el * 0.0045;
    for (let i = 0; i < nebulae.length; i++) {
      nebulae[i].material.opacity = nebulaDefs[i][3] * (0.8 + 0.25 * Math.sin(el * 0.3 + i * 2.1));
    }

    // satellite glides on an inclined orbit, fading away as we commit to India
    const sa = el * 0.1;
    sat.position.set(
      GLOBE_CENTER.x + Math.cos(sa) * GLOBE_R * 1.55,
      GLOBE_CENTER.y + Math.sin(sa * 0.8) * GLOBE_R * 0.42,
      GLOBE_CENTER.z + Math.sin(sa) * GLOBE_R * 1.55
    );
    sat.rotation.y = -sa + Math.PI / 2;
    sat.visible = globe.visible && f < 1.7;

    // Pune light pillar breathes as it comes alive
    beamMat.opacity = 0.42 * smooth(0.65, 1.3, f) * (1 - smooth(1.95, 2.35, f)) * (0.75 + 0.25 * Math.sin(el * 2.1));

    // Pune terrain + beacon reveal on approach
    decalMat.opacity = smooth(1.15, 1.85, f);
    const pulse = 1 + 0.35 * Math.sin(el * 2.4);
    beacon.material.opacity = (0.35 + 0.4 * Math.abs(Math.sin(el * 1.6))) * (1 - smooth(1.5, 2.0, f) * 0.7);
    ring.scale.setScalar(pulse);
    ringMat.opacity = 0.85 * (1.35 - pulse * 0.5);
    // arc fades away once we commit to India
    const arcVis = 1 - smooth(1.3, 1.9, f);
    (arc.material as THREE.MeshBasicMaterial).opacity = 0.75 * arcVis;
    arcPulse.material.opacity = arcVis;
    arcPulse.position.copy(arcCurve.getPoint((el * 0.1) % 1));
    // orbital cloud layer thins out for the Pune close-up
    orbitCloudsMat.opacity = 0.55 * (1 - smooth(1.2, 1.9, f));

    // cloud deck drift
    for (const p of puffs) {
      p.s.position.x = p.bx + Math.sin(el * 0.05 + p.seed) * 2.2;
    }

    // gold dust floats in the hall air
    motes.rotation.y = Math.sin(el * 0.06) * 0.02;
    motes.position.y = Math.sin(el * 0.3) * 0.07;

    // whiteout through the heart of the cloud deck (descent only)
    const cy = camera.position.y;
    const g = Math.exp(-Math.pow((cy - 60) / 17, 2));
    whiteMat.opacity = g * 0.96;
    white.visible = whiteMat.opacity > 0.01;

    // swap worlds behind the whiteout
    globe.visible = cy > 50;
    campus.visible = cy < 96;
    deck.visible = f > 1.5 && f < 3.2;

    // doors swing open as we arrive
    const open = easeInOut(smooth(3.04, 3.55, f));
    leafL.rotation.y = open * 1.5;
    leafR.rotation.y = -open * 1.5;

    renderer.render(scene, camera);
    if (!readySent) {
      readySent = true;
      opts.onReady?.();
    }
  }
  tick();

  return {
    stops,
    setProgress(p) {
      target = Math.min(1, Math.max(0, p));
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    resize,
    dispose() {
      cancelAnimationFrame(raf);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose?.();
      });
      renderer.dispose();
    },
  };
}
