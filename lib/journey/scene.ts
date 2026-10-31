import * as THREE from "three";
import { JOURNEY_STOPS, progressToFloatIndex, type JourneyStop } from "./stops";
import {
  puneTerrainTexture,
  cloudPuffTexture,
  glowSprite,
  paverTexture,
  abtcSignTexture,
  spaceSkyTexture,
  limestoneTexture,
  cityNightTexture,
} from "./textures";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { createEarthKit, SUN_DIR } from "./earth";
import { buildSanctuary } from "./sanctuary";

/*
 * Scroll-driven cinematic journey:
 *   00 Earth in orbit  ->  01 India  ->  02 Pune close-up
 *   ->  03 dive through the clouds to the ABTC campus at night
 *   ->  04 inside the Master Aesthetic Sanctuary.
 *
 * World layout
 * ------------
 * The globe floats high above the "ground world": centre (0, 142, -6), radius 48.
 * It is rotated so Pune sits exactly on the lower-front point the camera
 * approaches. The campus + interior live around the origin (y = 0 ground).
 * A volumetric cloud deck (y 28..95) plus a camera-attached whiteout quad
 * hide the globe/ground swap during the descent, so the cut is invisible.
 */

const GLOBE_CENTER = new THREE.Vector3(0, 142, -6);
const GLOBE_R = 48;

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
  // Crisp Retina output capped at 2x (1.5x on lowPower) for silky 60/120fps performance
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(Math.min(dpr, lowPower ? 1.5 : 2));
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Neutral tone mapping keeps skin/peach/gold colours true (ACES muddies pastels)
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 900);
  scene.add(camera);

  // Image-based lighting: gives glossy floor, gold, mirrors and lacquer real reflections.
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.1;

  // ===== Global lights =====
  const hemi = new THREE.HemisphereLight(0xe3e7ee, 0x12121c, 0.6);
  scene.add(hemi);
  // warm sun — the key light for the real Earth and the ground world
  const moon = new THREE.DirectionalLight(0xfff0da, 2.4);
  moon.position.set(70, 120, 140);
  scene.add(moon);
  // gentle neutral fill from the camera side so the planet's shadow half stays readable
  const fill = new THREE.DirectionalLight(0xd8dde4, 0.5);
  fill.position.set(-30, 170, 190);
  scene.add(fill);

  // ===== Deep space (photographic sky sphere + a few bright sparkle stars) =====
  const skyTex = spaceSkyTexture();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(420, 32, 24),
    new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, depthWrite: false })
  );
  sky.position.set(0, 90, 0);
  scene.add(sky);

  const starCount = lowPower ? 180 : 420;
  const starGeo = new THREE.BufferGeometry();
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(300 + Math.random() * 120);
    sp[i * 3] = v.x;
    sp[i * 3 + 1] = v.y + 90;
    sp[i * 3 + 2] = v.z;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const stars = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      map: glowSprite("255,248,236"),
      size: 1.2,
      color: 0xfff6ea,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.55,
    })
  );
  scene.add(stars);

  // ===== Globe =====
  const globe = new THREE.Group();
  globe.position.copy(GLOBE_CENTER);
  scene.add(globe);

  // Photoreal Earth (shader globe + clouds + atmosphere + sun flare + orbit rings)
  const earthKit = createEarthKit({ globe, scene, center: GLOBE_CENTER, radius: GLOBE_R, lowPower, maxAniso });

  // --- Orient the globe so Pune faces the camera's approach path ---
  const puneLocal = latLonToUnit(18.5204, 73.8567);
  // direction (from globe centre) that the stop cameras fly toward
  const approach = new THREE.Vector3(0, 114.2, 33.2).sub(GLOBE_CENTER).normalize();
  const mLocal = alignedBasis(puneLocal);
  const mWorld = alignedBasis(approach);
  globe.quaternion.setFromRotationMatrix(mWorld.multiply(mLocal.invert()));
  const globeBaseQ = globe.quaternion.clone();
  const introQ = new THREE.Quaternion();
  const introAxis = new THREE.Vector3(1, 0.18, 0).normalize();
  const introYaw = new THREE.Quaternion();
  const yAxis = new THREE.Vector3(0, 1, 0);
  const INTRO_TILT = 0.5;
  const INTRO_YAW = 0.55;

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

  // --- Pune pin: a tiny warm spark, no radar ring ---
  const beaconGlowTex = glowSprite("255,236,210");
  const beacon = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: beaconGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.22 })
  );
  beacon.scale.set(0.85, 0.85, 1);
  beacon.position.copy(puneLocal).multiplyScalar(GLOBE_R * 1.006);
  globe.add(beacon);

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
    new THREE.MeshBasicMaterial({ color: 0xc8b48a, transparent: true, opacity: 0.28, blending: THREE.AdditiveBlending, depthWrite: false })
  );
  globe.add(arc);
  const arcPulse = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: beaconGlowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
  );
  arcPulse.scale.set(1.1, 1.1, 1);
  globe.add(arcPulse);

  // --- Gold light pillar rising from Pune ---
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xe8d4a8,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.22, 5, 12, 1, true), beamMat);
  beam.position.copy(puneLocal).multiplyScalar(GLOBE_R + 2.4);
  beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), puneLocal);
  globe.add(beam);

  // ===== Volumetric cloud deck (the descent) =====
  const deck = new THREE.Group();
  scene.add(deck);
  const puffTex = cloudPuffTexture();
  const puffTints: [number, number][] = [
    [0xfffaf4, 0.55],
    [0xf4efe6, 0.7],
    [0xe8e2d6, 0.48],
    [0xddd6c8, 0.38],
  ];
  const puffMats = puffTints.map(
    ([color, o]) => new THREE.SpriteMaterial({ map: puffTex, color, transparent: true, opacity: o, depthWrite: false })
  );
  const puffCount = lowPower ? 50 : 160;
  const puffs: { s: THREE.Sprite; bx: number; seed: number }[] = [];
  for (let i = 0; i < puffCount; i++) {
    const s = new THREE.Sprite(puffMats[i % puffMats.length]);
    const y = 22 + Math.pow(Math.random(), 0.7) * 78;
    const x = (Math.random() - 0.5) * 110;
    const z = -18 + Math.random() * 70;
    const sc = 11 + Math.random() * 28;
    s.position.set(x, y, z);
    s.scale.set(sc, sc * (0.38 + Math.random() * 0.28), 1);
    deck.add(s);
    puffs.push({ s, bx: x, seed: Math.random() * 100 });
  }

  // Camera-attached whiteout quad — peaks mid-descent to hide the world swap
  const whiteMat = new THREE.MeshBasicMaterial({
    color: 0xf0ebe3,
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
  const plaza = new THREE.Mesh(new THREE.PlaneGeometry(170, 110), std(0xb3ac9d, 0.95, 0, { map: paver }));
  plaza.rotation.x = -Math.PI / 2;
  plaza.position.set(0, 0, 22);
  campus.add(plaza);

  const stoneMap = limestoneTexture(lowPower ? 1 : 2);
  stoneMap.anisotropy = maxAniso;
  stoneMap.repeat.set(4, 2);
  const stoneUpper = limestoneTexture(lowPower ? 1 : 2);
  stoneUpper.anisotropy = maxAniso;
  stoneUpper.repeat.set(5, 2);
  const mats = {
    facade: new THREE.MeshStandardMaterial({ map: stoneMap, color: 0xe6e0d4, roughness: 0.92, metalness: 0.02 }),
    facadeUpper: new THREE.MeshStandardMaterial({ map: stoneUpper, color: 0xefeae0, roughness: 0.88, metalness: 0.02 }),
    facadeDark: std(0x3a342c, 0.82),
    bronze: std(0x6a5a3e, 0.45, 0.55),
    navy: std(0x2c2a26, 0.55),
    graphite: std(0x2e2c28, 0.65, 0.25),
    gold: std(0xb89a5a, 0.4, 0.55),
    goldGlow: new THREE.MeshStandardMaterial({ color: 0xc4a56a, emissive: 0x8a7040, emissiveIntensity: 0.55 }),
    windowLit: new THREE.MeshStandardMaterial({
      color: 0x2a241c,
      emissive: 0xe8c48a,
      emissiveIntensity: 0.55,
      roughness: 0.18,
      metalness: 0.15,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x2c2824,
      roughness: 0.08,
      metalness: 0.25,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
    trunk: std(0x4a3828, 0.9),
    leaf: std(0x3a5c38, 0.85),
    leafDark: std(0x2a4428, 0.88),
    cityDark: std(0x1c1b18, 0.9),
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
  box(bld, [23, 4.6, 16.85], mats.facadeUpper, [0, IH, -2.25]);
  box(bld, [23.6, 0.3, 17.6], mats.facadeDark, [0, IH + 4.6, -2.25]);
  // stone cornice between floors and a parapet at the roofline
  box(bld, [23.5, 0.28, 0.55], mats.facade, [0, IH - 0.04, 6.22]);
  box(bld, [23.4, 0.55, 0.32], mats.facade, [0, IH + 4.55, 6.28]);
  // pilasters on the front facade
  for (const x of [-10.4, -6.6, 6.6, 10.4]) {
    box(bld, [0.42, IH + 4.6, 0.28], mats.facade, [x, 0, 6.22]);
  }

  // ground-floor windows, recessed, bronze frames, warm interior
  for (const x of [-4.4, -8.1, 4.4, 8.1]) {
    box(bld, [2.4, 2.05, 0.12], mats.bronze, [x, 1.05, 6.12]);
    box(bld, [2.05, 1.7, 0.06], mats.windowLit, [x, 1.22, 6.18]);
    box(bld, [2.5, 0.1, 0.22], mats.facade, [x, 1.0, 6.22]);
  }
  // upper windows flanking the sign
  for (const x of [-9.6, -7.9, 7.9, 9.6]) {
    box(bld, [1.35, 1.85, 0.1], mats.bronze, [x, IH + 1.55, 6.16]);
    box(bld, [1.12, 1.55, 0.06], mats.windowLit, [x, IH + 1.7, 6.2]);
  }

  // --- Main sign ---
  const sign = abtcSignTexture();
  const signMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(12.6, 3.15),
    new THREE.MeshStandardMaterial({ map: sign.tex, emissive: 0xffffff, emissiveMap: sign.tex, emissiveIntensity: 0.22, roughness: 0.55 })
  );
  signMesh.position.set(0, IH + 2.4, 6.46);
  campus.add(signMesh);
  box(campus, [13.1, 3.6, 0.12], mats.graphite, [0, IH + 0.6, 6.3]);

  // --- Entrance: canopy, columns, pad, door ---
  box(bld, [7.2, 0.22, 2.8], mats.facade, [0, 3.35, 7.3]);
  box(bld, [7.2, 0.06, 0.06], mats.bronze, [0, 3.32, 8.68]);
  for (const x of [-2.9, 2.9]) {
    cyl(bld, 0.28, 0.32, 3.35, mats.facade, [x, 0, 7.9], 18);
    cyl(bld, 0.36, 0.36, 0.12, mats.bronze, [x, 3.23, 7.9], 18);
  }
  box(bld, [7.4, 0.09, 3.6], std(0xc4b79a, 0.9), [0, 0, 7.6]);
  box(bld, [7.4, 0.04, 0.08], mats.bronze, [0, 0.07, 9.35]);

  // door frame
  box(bld, [0.14, 3.1, 0.3], mats.graphite, [-1.5, 0, 6]);
  box(bld, [0.14, 3.1, 0.3], mats.graphite, [1.5, 0, 6]);
  box(bld, [3.14, 0.14, 0.3], mats.graphite, [0, 3.0, 6]);
  // glass double doors on pivots
  const makeLeaf = (hingeX: number, dir: 1 | -1) => {
    const pivot = group(bld, [hingeX, 0, 6]);
    box(pivot, [1.38, 2.86, 0.04], mats.glass, [dir * 0.72, 0.05, 0]);
    box(pivot, [1.44, 0.1, 0.07], mats.graphite, [dir * 0.72, 0, 0]);
    box(pivot, [1.44, 0.1, 0.07], mats.graphite, [dir * 0.72, 2.84, 0]);
    box(pivot, [0.07, 2.95, 0.07], mats.graphite, [dir * 0.05, 0, 0]);
    box(pivot, [0.07, 2.95, 0.07], mats.graphite, [dir * 1.4, 0, 0]);
    box(pivot, [0.05, 0.6, 0.09], mats.gold, [dir * 1.22, 1.15, 0.05]);
    return pivot;
  };
  const leafL = makeLeaf(-1.43, 1);
  const leafR = makeLeaf(1.43, -1);

  // --- Trees, planters, lamps ---
  const makeTree = (pos: V3, s = 1) => {
    const g = group(campus, pos);
    g.scale.setScalar(s);
    box(g, [1.0, 0.55, 1.0], mats.graphite, [0, 0, 0]);
    box(g, [1.06, 0.07, 1.06], mats.gold, [0, 0.55, 0]);
    cyl(g, 0.09, 0.13, 1.4, mats.trunk, [0, 0.6, 0], 8);
    const geo = new THREE.IcosahedronGeometry(0.75, 1);
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(geo, i % 2 ? mats.leaf : mats.leafDark);
      b.position.set((Math.random() - 0.5) * 0.85, 1.9 + (Math.random() - 0.35) * 0.9, (Math.random() - 0.5) * 0.85);
      b.scale.setScalar(0.65 + Math.random() * 0.55);
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
    new THREE.SpriteMaterial({ map: glowSprite("255,224,170"), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.1 })
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
  const signLight = new THREE.PointLight(0xffe2c4, 3.2, 12, 1.8);
  signLight.position.set(0, IH + 2.4, 9);
  campus.add(signLight);

  // --- Distant city silhouettes ---
  const cityTexA = cityNightTexture(3);
  const cityTexB = cityNightTexture(11);
  cityTexA.anisotropy = maxAniso;
  cityTexB.anisotropy = maxAniso;
  const cityMatA = new THREE.MeshStandardMaterial({
    map: cityTexA,
    emissive: 0xffffff,
    emissiveMap: cityTexA,
    emissiveIntensity: 0.45,
    roughness: 0.9,
  });
  const cityMatB = new THREE.MeshStandardMaterial({
    map: cityTexB,
    emissive: 0xffffff,
    emissiveMap: cityTexB,
    emissiveIntensity: 0.4,
    roughness: 0.9,
  });
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const citySpots: V3[] = [];
  for (let i = 0; i < 11; i++) citySpots.push([rand(-70, 70), 0, rand(-70, -44)]);
  for (const side of [-1, 1]) for (let i = 0; i < 5; i++) citySpots.push([side * rand(26, 62), 0, rand(-26, 8)]);
  for (const [cx, , cz] of citySpots) {
    if (Math.abs(cx) < 15 && cz > -40) continue;
    const w = rand(5, 10);
    const h = rand(8, 24);
    const d = rand(5, 9);
    box(campus, [w, h, d], Math.random() > 0.5 ? cityMatA : cityMatB, [cx, 0, cz]);
  }

  // ===== Interior: Master Aesthetic Sanctuary (see sanctuary.ts) =====
  const sanctuary = buildSanctuary(campus, { maxAniso, lowPower });

  // Webfonts may land after first paint — redraw the text textures when ready.
  if (typeof document !== "undefined" && document.fonts?.ready) {
    document.fonts.ready
      .then(() => {
        sign.redraw();
        sanctuary.redraw();
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
  let currentVel = 0;
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
    const t = easeInOut(smooth(0.08, 0.92, f - i));
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

    // Critically-damped spring chase: responsive dolly acceleration and deceleration
    // tuned to match Lenis smooth scroll without sluggish rubber-banding
    {
      const om = 2 / 0.22;
      const x = om * dt;
      const ex = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
      const change = current - target;
      const temp = (currentVel + om * change) * dt;
      currentVel = (currentVel - om * temp) * ex;
      current = target + (change + temp) * ex;
      if (Math.abs(target - current) < 1e-5 && Math.abs(currentVel) < 1e-5) {
        current = target;
        currentVel = 0;
      }
    }

    const f = poseAt(current);

    // pointer parallax scaled by distance so it feels equal at every altitude
    pointerSmooth.lerp(pointer, Math.min(1, dt * 3.5));
    const dist = tmpPos.distanceTo(tmpLook);
    tmpLook.x += pointerSmooth.x * dist * 0.016;
    tmpLook.y += pointerSmooth.y * dist * 0.01;
    // portrait phones: pull back and centre the planet in the upper half (card sits below)
    const portrait = THREE.MathUtils.clamp((1.0 - camera.aspect) / 0.4, 0, 1) * (1 - smooth(0.0, 0.7, f));
    tmpPos.z += 62 * portrait;
    tmpLook.x += 8 * portrait;
    tmpLook.y -= 20 * portrait;
    // gentle idle float so resting frames still breathe
    tmpPos.y += Math.sin(el * 0.55) * dist * 0.0012;
    // inside the hall: a hint of human head-sway so it feels like standing there
    const insideAmt = smooth(3.3, 3.9, f);
    tmpPos.x += Math.sin(el * 0.42) * 0.012 * insideAmt;
    tmpPos.y += Math.sin(el * 0.83 + 1.1) * 0.006 * insideAmt;
    tmpLook.x += Math.sin(el * 0.31 + 0.6) * 0.04 * insideAmt;
    velV.subVectors(tmpPos, prevPos);
    prevPos.copy(tmpPos);
    camera.position.copy(tmpPos);
    camera.lookAt(tmpLook);
    // cinematic banking: lean into lateral motion smoothly
    rightV.set(1, 0, 0).applyQuaternion(camera.quaternion);
    const lateral = velV.dot(rightV) / Math.max(dt, 1e-3);
    const rollTarget = THREE.MathUtils.clamp(-lateral * 0.0025, -0.05, 0.05) - pointerSmooth.x * 0.01;
    roll += (rollTarget - roll) * Math.min(1, dt * 3.0);
    camera.rotateZ(roll);
    camera.fov = poseFov + fovBoost;
    camera.updateProjectionMatrix();
    // exposure warms up as we step inside
    // eye adaptation: step from the dark plaza into the bright hall, then settle
    renderer.toneMappingExposure = 1.0 + 0.12 * smooth(2.7, 3.3, f) - 0.3 * smooth(3.4, 4.0, f);
    scene.environmentIntensity = 0.1 + 0.26 * smooth(2.6, 3.4, f);

    // the strong sun exists for the real Earth — dim it on the ground so the
    // campus keeps its moody evening light from lamps and windows
    const groundMix = smooth(1.9, 2.6, f);
    moon.intensity = 2.4 - 1.95 * groundMix;
    fill.intensity = 0.5 - 0.44 * groundMix;
    hemi.intensity = 0.6 - 0.5 * groundMix;

    // slow idle motion
    stars.rotation.y = el * 0.003;
    sky.rotation.y = el * 0.0012;

    // the globe slowly turns into place: we open on the northern hemisphere, then
    // it rolls so India sits dead-centre by the time we begin the descent
    const introAmt = 1 - smooth(0.0, 1.0, f);
    introQ.setFromAxisAngle(introAxis, INTRO_TILT * introAmt + Math.sin(el * 0.08) * 0.01 * (1 - smooth(0.3, 1, f)));
    introYaw.setFromAxisAngle(yAxis, INTRO_YAW * introAmt);
    globe.quaternion.copy(introYaw).multiply(introQ).multiply(globeBaseQ);
    earthKit.update(el, f, camera);
    sanctuary.update(el, f);

    // Pune light pillar breathes as it comes alive
    beamMat.opacity = 0.08 * smooth(0.65, 1.3, f) * (1 - smooth(1.95, 2.35, f));

    // Pune terrain + tiny pin reveal on approach
    decalMat.opacity = smooth(1.15, 1.85, f);
    beacon.material.opacity = (0.12 + 0.08 * Math.abs(Math.sin(el * 1.2))) * (1 - smooth(1.5, 2.0, f) * 0.7);
    // arc fades away once we commit to India
    const arcVis = 1 - smooth(1.3, 1.9, f);
    (arc.material as THREE.MeshBasicMaterial).opacity = 0.22 * arcVis;
    arcPulse.material.opacity = 0.28 * arcVis;
    arcPulse.position.copy(arcCurve.getPoint((el * 0.1) % 1));
    // orbital cloud layer thins out for the Pune close-up
    earthKit.setCloudOpacity(1 - smooth(1.2, 1.9, f));

    // cloud deck drift
    for (const p of puffs) {
      p.s.position.x = p.bx + Math.sin(el * 0.05 + p.seed) * 2.2;
    }

    // whiteout through the heart of the cloud deck (descent only)
    const cy = camera.position.y;
    const g = Math.exp(-Math.pow((cy - 60) / 17, 2));
    whiteMat.opacity = g * 0.96;
    white.visible = whiteMat.opacity > 0.01;

    // swap worlds behind the whiteout
    globe.visible = cy > 50;
    campus.visible = cy < 96;
    deck.visible = f > 1.5 && f < 3.2;
    sky.visible = globe.visible;
    stars.visible = globe.visible;
    earthKit.setVisible(globe.visible);

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
      earthKit.dispose();
      sanctuary.dispose();
      envTex.dispose();
      pmrem.dispose();
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
