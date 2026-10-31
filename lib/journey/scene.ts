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
  portraitArtTexture,
  conferenceScreenTexture,
  officeWallTextTexture,
  receptionMarbleTexture,
  loungeRugTexture,
  spaceSkyTexture,
  limestoneTexture,
  cityNightTexture,
} from "./textures";

/*
 * Scroll-driven cinematic journey:
 *   00 Earth in orbit  ->  01 India  ->  02 Pune close-up
 *   ->  03 dive through the clouds to the ABTC campus at night
 *   ->  04 inside the ABTC clinical training studio.
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
  wallIn: 0xffd8c8,
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
  setActive: (active: boolean) => void;
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
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !lowPower, powerPreference: lowPower ? "low-power" : "high-performance" });
  // Keep the cinematic scene crisp while avoiding oversized mobile framebuffers.
  const dpr = window.devicePixelRatio || 1;
  renderer.setPixelRatio(Math.min(dpr, lowPower ? 1.25 : 1.75));
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.05, 900);
  scene.add(camera);

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

  // Real satellite imagery (NASA Blue Marble day map, night city-lights,
  // topology bump, ocean specular mask). The procedural canvas texture only
  // stands in for the first few frames until the real maps stream in.
  const texLoader = new THREE.TextureLoader();
  const earthTex = earthTexture(lowPower ? 1 : 2);
  earthTex.anisotropy = maxAniso;
  const earthMat = new THREE.MeshPhongMaterial({
    map: earthTex,
    emissive: 0xffffff,
    emissiveMap: earthTex,
    emissiveIntensity: 0.5,
    specular: new THREE.Color(0x1c242c),
    shininess: 16,
  });
  texLoader.load("/textures/earth/earth_day.jpg", (day) => {
    day.colorSpace = THREE.SRGBColorSpace;
    day.anisotropy = maxAniso;
    earthMat.map = day;
    // self-glow drops away: the sun light does the work, night side stays dark
    earthMat.emissiveMap = null;
    earthMat.emissiveIntensity = 0;
    earthMat.needsUpdate = true;
    texLoader.load("/textures/earth/earth_night.jpg", (night) => {
      night.colorSpace = THREE.SRGBColorSpace;
      night.anisotropy = maxAniso;
      earthMat.emissiveMap = night;
      earthMat.emissiveIntensity = 1.15;
      earthMat.needsUpdate = true;
    });
  });
  texLoader.load("/textures/earth/earth_topology.png", (topo) => {
    topo.anisotropy = maxAniso;
    earthMat.bumpMap = topo;
    earthMat.bumpScale = 0.55;
    earthMat.needsUpdate = true;
  });
  texLoader.load("/textures/earth/earth_water.png", (water) => {
    water.anisotropy = maxAniso;
    earthMat.specularMap = water;
    earthMat.needsUpdate = true;
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
  texLoader.load("/textures/earth/earth_clouds.png", (cl) => {
    cl.colorSpace = THREE.SRGBColorSpace;
    cl.anisotropy = maxAniso;
    orbitCloudsMat.map = cl;
    orbitCloudsMat.emissiveMap = cl;
    orbitCloudsMat.emissiveIntensity = 0.12;
    orbitCloudsMat.needsUpdate = true;
  });
  const orbitClouds = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.012, 48, 32), orbitCloudsMat);
  globe.add(orbitClouds);

  // --- Orient the globe so Pune faces the camera's approach path ---
  const puneLocal = latLonToUnit(18.5204, 73.8567);
  // direction (from globe centre) that the stop cameras fly toward
  const approach = new THREE.Vector3(0, 114.2, 33.2).sub(GLOBE_CENTER).normalize();
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

  // --- Little satellite gliding around the globe ---
  const sat = new THREE.Group();
  const satBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 1.4), std(0xd8e2f0, 0.4, 0.7));
  sat.add(satBody);
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a1c20, emissive: 0x3a3e46, emissiveIntensity: 0.25, roughness: 0.4 });
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

  // Camera-attached atmospheric cloud mist — subtle softness during descent, never a solid whiteout
  const whiteMat = new THREE.MeshBasicMaterial({
    color: 0x98b8d8,
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
    navy: std(COL.navy, 0.55),
    graphite: std(0x11132f, 0.65, 0.25),
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
  const wallIn = std(COL.wallIn, 0.88);
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

  // ===== Interior: Master Aesthetic Sanctuary (Luxury Office Lobby) =====
  const hall = group(campus);
  const hallFill = new THREE.HemisphereLight(0xfff3e5, 0x5a483a, 0.45);
  hall.add(hallFill);

  // Polished ivory marble flooring with realistic gloss and reflection
  const marble = marbleFloorTexture();
  marble.repeat.set(9, 7);
  const hallFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(21.6, 16.3),
    new THREE.MeshStandardMaterial({
      map: marble,
      roughness: 0.22,
      metalness: 0.08,
      envMapIntensity: 0.5,
    })
  );
  hallFloor.rotation.x = -Math.PI / 2;
  hallFloor.position.set(0, 0.02, -2.3);
  hall.add(hallFloor);

  // Inner wall skins
  box(hall, [0.1, IH, 16.4], wallIn, [-10.78, 0, -2.3]);
  box(hall, [0.1, IH, 16.4], wallIn, [10.78, 0, -2.3]);

  // Warm skirting
  const warmSkirting = std(0xd3b4a0, 0.88);
  box(hall, [0.12, 0.42, 16.4], warmSkirting, [-10.76, 0, -2.3]);
  box(hall, [0.12, 0.42, 16.4], warmSkirting, [10.76, 0, -2.3]);
  box(hall, [21.5, 0.42, 0.12], warmSkirting, [0, 0, -10.28]);

  // Recessed coffered ceiling with warm gold perimeter cove lighting
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(21.6, 16.4), new THREE.MeshBasicMaterial({ color: 0xfff3e7 }));
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, IH - 0.02, -2.3);
  hall.add(ceil);

  // Perimeter cove LED glow strip
  box(hall, [20.8, 0.08, 0.08], mats.goldGlow, [0, IH - 0.18, -10.1]);
  box(hall, [20.8, 0.08, 0.08], mats.goldGlow, [0, IH - 0.18, 5.6]);
  box(hall, [0.08, 0.08, 15.6], mats.goldGlow, [-10.5, IH - 0.18, -2.3]);
  box(hall, [0.08, 0.08, 15.6], mats.goldGlow, [10.5, IH - 0.18, -2.3]);

  // Recessed architectural spot lights
  const dlGeo = new THREE.CircleGeometry(0.12, 16);
  const dlMat = new THREE.MeshStandardMaterial({ color: 0xfffaee, emissive: 0xffe9cc, emissiveIntensity: 1.4 });
  const dlGlowMat = new THREE.SpriteMaterial({
    map: glowSprite("255,236,200"),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    opacity: 0.18,
  });
  for (const x of [-7.5, -4.5, -1.5, 1.5, 4.5, 7.5]) {
    for (const z of [-8.5, -5.5, -2.5, 0.5, 3.5]) {
      const d = new THREE.Mesh(dlGeo, dlMat);
      d.rotation.x = Math.PI / 2;
      d.position.set(x, IH - 0.03, z);
      hall.add(d);
      const g = new THREE.Sprite(dlGlowMat);
      g.position.set(x, IH - 0.12, z);
      g.scale.set(0.65, 0.65, 1);
      hall.add(g);
    }
  }

  // Floating Grand Circular Halo Ring Chandelier in the center
  const haloGroup = group(hall, [0, 0, -1.2]);
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2 + Math.PI / 4;
    const cx = Math.cos(ang) * 2.1;
    const cz = Math.sin(ang) * 2.1;
    cyl(haloGroup, 0.008, 0.008, 0.45, mats.gold, [cx, 3.95, cz], 6);
  }
  const haloRingOuter = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.085, 12, 64), mats.gold);
  haloRingOuter.rotation.x = Math.PI / 2;
  haloRingOuter.position.y = 3.72;
  haloGroup.add(haloRingOuter);
  const haloRingInner = new THREE.Mesh(
    new THREE.TorusGeometry(1.94, 0.045, 10, 64),
    new THREE.MeshStandardMaterial({
      color: 0xffeed4,
      emissive: 0xffe0a8,
      emissiveIntensity: 1.8,
      roughness: 0.2,
    })
  );
  haloRingInner.rotation.x = Math.PI / 2;
  haloRingInner.position.y = 3.72;
  haloGroup.add(haloRingInner);
  const haloLight = new THREE.PointLight(0xffe8c8, 5.8, 14, 1.6);
  haloLight.position.set(0, 3.45, 0);
  haloGroup.add(haloLight);

  // Linear architectural pendant light bar above right workstations
  const linearLight = group(hall, [7.2, 3.65, -2.6]);
  box(linearLight, [3.2, 0.08, 0.08], mats.gold, [0, 0, 0]);
  box(linearLight, [3.1, 0.02, 0.06], mats.goldGlow, [0, -0.04, 0]);
  cyl(linearLight, 0.006, 0.006, 0.5, mats.gold, [-1.2, 0.25, 0], 6);
  cyl(linearLight, 0.006, 0.006, 0.5, mats.gold, [1.2, 0.25, 0], 6);

  // 1. Back Wall: Navy Blue Central Feature Wall + Gold Trim
  const seal = sanctuarySealTexture();
  const sealMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 3.8),
    new THREE.MeshStandardMaterial({
      map: seal.tex,
      emissive: 0xffffff,
      emissiveMap: seal.tex,
      emissiveIntensity: 0.52,
      roughness: 0.5,
    })
  );
  sealMesh.position.set(0, 2.3, -10.22);
  hall.add(sealMesh);
  box(hall, [7.32, 3.92, 0.06], mats.navy, [0, 0.36, -10.28]);
  box(hall, [7.34, 0.07, 0.08], mats.gold, [0, 0.36, -10.2]);
  box(hall, [7.34, 0.07, 0.08], mats.gold, [0, 4.22, -10.2]);
  box(hall, [0.07, 3.92, 0.08], mats.gold, [-3.64, 0.36, -10.2]);
  box(hall, [0.07, 3.92, 0.08], mats.gold, [3.64, 0.36, -10.2]);

  // Fluting: Vertical Warm Golden Oak Slats flanking the navy wall
  const oakSlat = std(0x916b47, 0.72);
  const slatSpacing = 0.16;
  for (let x = -3.8; x >= -10.4; x -= slatSpacing) {
    box(hall, [0.075, 3.82, 0.07], oakSlat, [x, 0.4, -10.28]);
  }
  for (let x = 3.8; x <= 10.4; x += slatSpacing) {
    box(hall, [0.075, 3.82, 0.07], oakSlat, [x, 0.4, -10.28]);
  }

  // Framed Aesthetic Beauty Portraits flanking the central wall
  const portraitL = portraitArtTexture(1);
  const portraitR = portraitArtTexture(2);
  const portraitMatL = new THREE.MeshStandardMaterial({ map: portraitL, roughness: 0.5, emissive: 0xffffff, emissiveMap: portraitL, emissiveIntensity: 0.25 });
  const portraitMatR = new THREE.MeshStandardMaterial({ map: portraitR, roughness: 0.5, emissive: 0xffffff, emissiveMap: portraitR, emissiveIntensity: 0.25 });

  const portGroupL = group(hall, [-6.6, 2.45, -10.2]);
  const pMeshL = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.72), portraitMatL);
  pMeshL.position.z = 0.04;
  portGroupL.add(pMeshL);
  box(portGroupL, [1.38, 1.8, 0.04], mats.gold, [0, -0.9, 0]);
  box(portGroupL, [1.44, 1.86, 0.02], mats.goldGlow, [0, -0.93, -0.02]);
  box(hall, [1.8, 0.85, 0.45], std(0x6e4e34, 0.7), [-6.6, 0.02, -10.05]);
  box(hall, [1.84, 0.04, 0.48], mats.gold, [-6.6, 0.87, -10.05]);

  const portGroupR = group(hall, [9.4, 2.45, -10.2]);
  const pMeshR = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.72), portraitMatR);
  pMeshR.position.z = 0.04;
  portGroupR.add(pMeshR);
  box(portGroupR, [1.38, 1.8, 0.04], mats.gold, [0, -0.9, 0]);
  box(portGroupR, [1.44, 1.86, 0.02], mats.goldGlow, [0, -0.93, -0.02]);
  box(hall, [1.8, 0.85, 0.45], std(0x6e4e34, 0.7), [9.4, 0.02, -10.05]);
  box(hall, [1.84, 0.04, 0.48], mats.gold, [9.4, 0.87, -10.05]);

  // 2. Central Long Luxury Reception Desk
  const desk = group(hall, [0, 0, -4.3]);
  const marbleDeskTex = receptionMarbleTexture();
  const marbleDeskMat = new THREE.MeshStandardMaterial({
    map: marbleDeskTex,
    roughness: 0.24,
    metalness: 0.06,
  });

  const deskWidth = 6.4;
  const deskHeight = 1.15;
  const deskDepth = 1.1;

  const frontPanel = new THREE.Mesh(new THREE.BoxGeometry(deskWidth, deskHeight - 0.08, 0.08), marbleDeskMat);
  frontPanel.position.set(0, deskHeight / 2 + 0.04, deskDepth / 2);
  desk.add(frontPanel);

  box(desk, [deskWidth - 0.1, 0.035, 0.04], mats.goldGlow, [0, deskHeight - 0.02, deskDepth / 2 + 0.03]);
  box(desk, [deskWidth - 0.2, 0.06, 0.06], mats.goldGlow, [0, 0.02, deskDepth / 2 - 0.06]);
  box(desk, [0.1, deskHeight, deskDepth + 0.04], mats.gold, [-deskWidth / 2 - 0.04, 0, 0]);
  box(desk, [0.1, deskHeight, deskDepth + 0.04], mats.gold, [deskWidth / 2 + 0.04, 0, 0]);

  const topStoneMat = std(0xfbfbf9, 0.2, 0.05);
  box(desk, [deskWidth + 0.2, 0.08, deskDepth + 0.12], topStoneMat, [0, deskHeight, 0]);
  box(desk, [deskWidth - 0.2, deskHeight - 0.1, 0.08], std(0x5a4230, 0.75), [0, 0, -deskDepth / 2]);
  box(desk, [deskWidth - 0.2, 0.06, deskDepth - 0.2], std(0x6e523c, 0.75), [0, 0.74, 0]);

  // Two sleek silver Apple iMac computers on the reception counter
  const imacMat = std(0xd8dce4, 0.25, 0.75);
  const imacScreenMat = std(0x181a20, 0.12, 0.2);
  const makeImac = (xPos: number) => {
    const imac = group(desk, [xPos, deskHeight + 0.08, 0.12]);
    box(imac, [0.22, 0.015, 0.18], imacMat, [0, 0, 0]);
    const neck = box(imac, [0.065, 0.24, 0.02], imacMat, [0, 0.01, -0.02]);
    neck.rotation.x = -0.15;
    const monitor = group(imac, [0, 0.28, 0]);
    monitor.rotation.x = -0.06;
    box(monitor, [0.65, 0.42, 0.025], imacMat, [0, 0, 0]);
    box(monitor, [0.61, 0.38, 0.005], imacScreenMat, [0, 0.015, 0.013]);
    box(imac, [0.32, 0.012, 0.12], imacMat, [0, 0, 0.24]);
    box(imac, [0.06, 0.018, 0.09], imacMat, [0.24, 0, 0.24]);
  };
  makeImac(-1.5);
  makeImac(1.5);

  // Floral vase on right of reception desk
  const vaseGroup = group(desk, [2.35, deskHeight + 0.08, 0.08]);
  cyl(vaseGroup, 0.14, 0.11, 0.36, std(0xffffff, 0.18, 0.1), [0, 0, 0], 16);
  const flowerWhite = std(0xfffbf2, 0.6);
  const stemGreen = std(0x526b42, 0.85);
  for (let i = 0; i < 9; i++) {
    const ang = (i / 9) * Math.PI * 2;
    const rad = 0.08 + (i % 3) * 0.05;
    const flX = Math.cos(ang) * rad;
    const flZ = Math.sin(ang) * rad;
    const flH = 0.36 + (i % 3) * 0.09;
    cyl(vaseGroup, 0.01, 0.01, flH, stemGreen, [flX, 0.15, flZ], 6);
    const flower = new THREE.Mesh(new THREE.DodecahedronGeometry(0.075, 0), flowerWhite);
    flower.position.set(flX * 1.3, flH + 0.16, flZ * 1.3);
    vaseGroup.add(flower);
  }

  // Reception chairs behind desk
  const chairMat = std(0x1a2138, 0.5, 0.2);
  const chromeMat = std(0xcccccc, 0.15, 0.85);
  const makeReceptionChair = (xPos: number) => {
    const chair = group(desk, [xPos, 0, -0.65]);
    cyl(chair, 0.26, 0.26, 0.06, chromeMat, [0, 0.08, 0], 12);
    cyl(chair, 0.035, 0.035, 0.38, chromeMat, [0, 0.12, 0], 8);
    box(chair, [0.54, 0.1, 0.52], chairMat, [0, 0.48, 0]);
    box(chair, [0.52, 0.58, 0.08], chairMat, [0, 0.56, -0.22]);
  };
  makeReceptionChair(-1.5);
  makeReceptionChair(1.5);

  // Tall planters flanking reception desk
  const planterMat = std(0xfbf8f4, 0.3, 0.05);
  const leafGreenA = std(0x426338, 0.85);
  const leafGreenB = std(0x5a7e4b, 0.85);
  const makeReceptionPlant = (x: number, z: number, scale = 1.0) => {
    const g = group(hall, [x, 0, z]);
    cyl(g, 0.38 * scale, 0.3 * scale, 0.82 * scale, planterMat, [0, 0, 0], 18);
    cyl(g, 0.32 * scale, 0.32 * scale, 0.08 * scale, mats.gold, [0, 0.78 * scale, 0], 18);
    cyl(g, 0.34 * scale, 0.34 * scale, 0.04 * scale, mats.trunk, [0, 0.79 * scale, 0], 12);
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.36 * scale, 0), i % 2 === 0 ? leafGreenA : leafGreenB);
      leaf.scale.set(0.65, 1.4, 0.22);
      leaf.position.set(Math.cos(ang) * 0.26 * scale, (1.1 + (i % 3) * 0.14) * scale, Math.sin(ang) * 0.26 * scale);
      leaf.rotation.z = Math.cos(ang) * 0.45;
      leaf.rotation.y = ang;
      g.add(leaf);
    }
  };
  makeReceptionPlant(-3.7, -4.3, 1.05);
  makeReceptionPlant(3.7, -4.3, 1.05);

  // 3. Foreground Waiting Lounge
  const loungeArea = group(hall, [0, 0, 0]);

  // Large plush oatmeal taupe textured rug
  const rugTex = loungeRugTexture();
  rugTex.repeat.set(2, 2);
  const rugMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.2, 4.4),
    new THREE.MeshStandardMaterial({
      map: rugTex,
      roughness: 0.88,
      metalness: 0.02,
    })
  );
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(2.4, 0.032, 1.6);
  loungeArea.add(rugMesh);

  // Curved Luxury Sofa
  const sofaGroup = group(loungeArea, [4.0, 0, 1.6], -0.2);
  const sofaFabric = std(0xf7f3ea, 0.72);
  const pillowPinkA = std(0xd48f93, 0.65);
  const pillowPinkB = std(0xc77f83, 0.65);

  box(sofaGroup, [1.4, 0.46, 0.95], sofaFabric, [-0.65, 0, 0]);
  box(sofaGroup, [1.4, 0.46, 0.95], sofaFabric, [0.65, 0, -0.06]);
  box(sofaGroup, [1.4, 0.44, 0.28], sofaFabric, [-0.65, 0.44, -0.34]);
  box(sofaGroup, [1.4, 0.44, 0.28], sofaFabric, [0.65, 0.44, -0.4]);
  box(sofaGroup, [0.24, 0.32, 0.95], sofaFabric, [-1.42, 0.36, 0]);
  box(sofaGroup, [0.24, 0.32, 0.95], sofaFabric, [1.42, 0.36, -0.06]);
  box(sofaGroup, [2.9, 0.05, 0.96], mats.gold, [0, 0.02, -0.03]);

  const makePillow = (parent: THREE.Object3D, pos: V3, rotY: number, mat: THREE.Material) => {
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.36, 0.16), mat);
    pil.position.set(...pos);
    pil.rotation.y = rotY;
    pil.rotation.x = 0.18;
    parent.add(pil);
  };
  makePillow(sofaGroup, [-1.0, 0.62, -0.15], 0.2, pillowPinkA);
  makePillow(sofaGroup, [0.0, 0.62, -0.18], -0.05, pillowPinkB);
  makePillow(sofaGroup, [0.95, 0.62, -0.22], -0.25, pillowPinkA);

  // Rounded Modern Lounge Armchair
  const armChairGroup = group(loungeArea, [1.15, 0, 1.25], 0.65);
  cyl(armChairGroup, 0.46, 0.48, 0.05, mats.gold, [0, 0.02, 0], 18);
  const seatCush = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.44, 18), sofaFabric);
  seatCush.position.set(0, 0.25, 0);
  armChairGroup.add(seatCush);
  const backGeo = new THREE.CylinderGeometry(0.52, 0.52, 0.44, 18, 1, false, -Math.PI * 0.75, Math.PI * 1.5);
  const backMesh = new THREE.Mesh(backGeo, sofaFabric);
  backMesh.position.set(0, 0.54, 0);
  armChairGroup.add(backMesh);
  makePillow(armChairGroup, [0, 0.58, -0.18], 0, pillowPinkA);

  // Circular Marble & Gold Coffee Table
  const tableGroup = group(loungeArea, [2.35, 0, 1.55]);
  const tableRadius = 0.78;
  const tableHeight = 0.44;

  const tableRingMat = mats.gold;
  for (const y of [0.03, tableHeight - 0.04]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(tableRadius * 0.95, 0.025, 8, 36), tableRingMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = y;
    tableGroup.add(ring);
  }
  for (let i = 0; i < 4; i++) {
    const ang = (i / 4) * Math.PI * 2;
    cyl(tableGroup, 0.02, 0.02, tableHeight - 0.06, tableRingMat, [Math.cos(ang) * tableRadius * 0.92, 0.04, Math.sin(ang) * tableRadius * 0.92], 8);
  }
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(tableRadius, tableRadius, 0.04, 32),
    new THREE.MeshStandardMaterial({
      map: marbleDeskTex,
      roughness: 0.2,
      metalness: 0.05,
    })
  );
  tableTop.position.y = tableHeight;
  tableGroup.add(tableTop);

  // Decor on Coffee Table
  cyl(tableGroup, 0.09, 0.07, 0.22, mats.glass, [-0.18, tableHeight + 0.02, -0.08], 14);
  for (let i = 0; i < 4; i++) {
    cyl(tableGroup, 0.008, 0.008, 0.28, leafGreenA, [-0.18 + (i % 2) * 0.03, tableHeight + 0.14, -0.08 + (i > 1 ? 0.03 : 0)], 6);
  }
  const orb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 12), mats.gold);
  orb.position.set(0.18, tableHeight + 0.09, -0.12);
  tableGroup.add(orb);
  box(tableGroup, [0.24, 0.035, 0.32], std(0x2a2a38, 0.6), [0.12, tableHeight + 0.02, 0.16], 0.2);
  box(tableGroup, [0.22, 0.03, 0.3], std(0xf5eedc, 0.6), [0.13, tableHeight + 0.055, 0.16], 0.1);

  // Immediate Foreground Left Planter
  makeReceptionPlant(-2.4, 3.2, 1.15);

  // 4. Left Wing: Floor-to-Ceiling Glass Conference / Boardroom
  const confRoom = group(hall, [0, 0, 0]);
  const mullionMat = mats.graphite;

  const confWallZMin = -8.8;
  const confWallZMax = 3.2;
  const confWallLen = confWallZMax - confWallZMin;
  const confWallZCenter = (confWallZMin + confWallZMax) / 2;

  const glassPartition = new THREE.Mesh(
    new THREE.PlaneGeometry(confWallLen - 2.0, IH - 0.2),
    mats.glass
  );
  glassPartition.rotation.y = Math.PI / 2;
  glassPartition.position.set(-5.4, IH / 2, confWallZCenter - 1.0);
  confRoom.add(glassPartition);

  box(confRoom, [0.08, 0.08, confWallLen], mullionMat, [-5.4, 0.02, confWallZCenter]);
  box(confRoom, [0.08, 0.08, confWallLen], mullionMat, [-5.4, IH - 0.08, confWallZCenter]);
  box(confRoom, [0.08, 0.06, confWallLen], mullionMat, [-5.4, 2.3, confWallZCenter]);

  for (let z = confWallZMin; z <= confWallZMax; z += 1.8) {
    box(confRoom, [0.08, IH, 0.08], mullionMat, [-5.4, 0, z]);
  }

  // Large Executive Boardroom Table
  const confTableGroup = group(confRoom, [-8.0, 0, -3.2]);
  const tableWoodMat = std(0xebe5d8, 0.35, 0.05);
  box(confTableGroup, [1.4, 0.08, 4.4], tableWoodMat, [0, 0.74, 0]);
  box(confTableGroup, [1.42, 0.02, 4.42], mats.gold, [0, 0.73, 0]);
  box(confTableGroup, [1.1, 0.72, 0.12], mullionMat, [0, 0.02, -1.4]);
  box(confTableGroup, [1.1, 0.72, 0.12], mullionMat, [0, 0.02, 1.4]);
  box(confTableGroup, [0.18, 0.02, 0.6], mullionMat, [0, 0.78, 0]);

  // 6 Executive Boardroom Chairs (camel leather)
  const confChairMat = std(0xd8be9c, 0.65);
  const makeConfChair = (pos: V3, rotY: number) => {
    const ch = group(confTableGroup, pos, rotY);
    cyl(ch, 0.24, 0.24, 0.04, chromeMat, [0, 0.06, 0], 12);
    cyl(ch, 0.03, 0.03, 0.38, chromeMat, [0, 0.1, 0], 8);
    box(ch, [0.52, 0.08, 0.48], confChairMat, [0, 0.44, 0]);
    box(ch, [0.5, 0.54, 0.06], confChairMat, [0, 0.52, -0.22]);
    box(ch, [0.04, 0.24, 0.36], chromeMat, [-0.26, 0.54, 0]);
    box(ch, [0.04, 0.24, 0.36], chromeMat, [0.26, 0.54, 0]);
  };
  makeConfChair([-0.95, 0, -1.3], Math.PI / 2);
  makeConfChair([-0.95, 0, 0.0], Math.PI / 2);
  makeConfChair([-0.95, 0, 1.3], Math.PI / 2);
  makeConfChair([0.95, 0, -1.3], -Math.PI / 2);
  makeConfChair([0.95, 0, 0.0], -Math.PI / 2);
  makeConfChair([0.95, 0, 1.3], -Math.PI / 2);

  // Conference Presentation Display Screen on Room Wall
  const screenTex = conferenceScreenTexture();
  const screenMat = new THREE.MeshStandardMaterial({
    map: screenTex,
    emissive: 0xffffff,
    emissiveMap: screenTex,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });
  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.45), screenMat);
  screenMesh.rotation.y = Math.PI / 2;
  screenMesh.position.set(-10.62, 2.2, -3.2);
  confRoom.add(screenMesh);
  box(confRoom, [0.04, 1.52, 2.48], mullionMat, [-10.65, 1.44, -3.2]);

  makeReceptionPlant(-9.8, -7.6, 0.95);

  // Left Foreground Cosmetic Display Showcase Credenza
  const dispCred = group(hall, [-4.6, 0, 1.8], Math.PI / 2);
  box(dispCred, [1.8, 0.88, 0.55], marbleDeskMat, [0, 0.02, 0]);
  box(dispCred, [1.84, 0.03, 0.58], mats.gold, [0, 0.89, 0]);
  box(dispCred, [1.8, 0.03, 0.03], mats.goldGlow, [0, 0.87, 0.28]);
  const cosmeticColors = [std(0xf5d3cc, 0.3), std(0xffffff, 0.2), std(0xd4af37, 0.35, 0.6), std(0xcde6ee, 0.3)];
  for (let i = 0; i < 6; i++) {
    cyl(dispCred, 0.045, 0.05, 0.18 + (i % 2) * 0.06, cosmeticColors[i % 4], [-0.65 + i * 0.26, 0.92, (Math.random() - 0.5) * 0.16], 10);
  }

  // 5. Right Wing: Open Office Workstations & Product Display Shelves
  const workArea = group(hall, [7.2, 0, -2.6]);

  const deskTopMat = std(0xfbfbf9, 0.4);
  box(workArea, [1.6, 0.05, 2.8], deskTopMat, [0, 0.74, 0]);
  const privacyMat = std(0xd0e2f2, 0.25, 0.05, { transparent: true, opacity: 0.85 });
  box(workArea, [0.04, 0.45, 2.6], privacyMat, [0, 0.76, 0]);
  box(workArea, [1.5, 0.72, 0.06], mullionMat, [0, 0.02, -1.3]);
  box(workArea, [1.5, 0.72, 0.06], mullionMat, [0, 0.02, 1.3]);

  const makeWorkstationPC = (xPos: number, zPos: number, rotY: number) => {
    const pc = group(workArea, [xPos, 0.76, zPos], rotY);
    box(pc, [0.18, 0.015, 0.15], mullionMat, [0, 0, 0]);
    cyl(pc, 0.018, 0.018, 0.22, mullionMat, [0, 0.01, -0.04], 8);
    box(pc, [0.55, 0.34, 0.02], imacScreenMat, [0, 0.24, 0]);
    box(pc, [0.34, 0.012, 0.12], mullionMat, [0, 0, 0.2]);
  };
  makeWorkstationPC(-0.45, -0.65, 0.1);
  makeWorkstationPC(-0.45, 0.65, -0.1);
  makeWorkstationPC(0.45, -0.65, Math.PI - 0.1);
  makeWorkstationPC(0.45, 0.65, Math.PI + 0.1);

  const meshChairMat = std(0x22262e, 0.6);
  const makeTaskChair = (pos: V3, rotY: number) => {
    const tc = group(workArea, pos, rotY);
    cyl(tc, 0.26, 0.26, 0.05, chromeMat, [0, 0.06, 0], 12);
    cyl(tc, 0.035, 0.035, 0.38, chromeMat, [0, 0.1, 0], 8);
    box(tc, [0.48, 0.08, 0.46], meshChairMat, [0, 0.46, 0]);
    box(tc, [0.46, 0.54, 0.06], meshChairMat, [0, 0.52, -0.22]);
  };
  makeTaskChair([-1.05, 0, -0.65], Math.PI / 2);
  makeTaskChair([-1.05, 0, 0.65], Math.PI / 2);
  makeTaskChair([1.05, 0, -0.65], -Math.PI / 2);
  makeTaskChair([1.05, 0, 0.65], -Math.PI / 2);

  // Right Wall Built-in Illuminated Retail Product Shelving
  const shelfGroup = group(hall, [10.55, 0, -3.2], -Math.PI / 2);
  const shelfWood = std(0x8a6442, 0.7);
  box(shelfGroup, [3.8, 3.2, 0.42], shelfWood, [0, 0.4, -0.2]);
  for (let sIdx = 0; sIdx < 4; sIdx++) {
    const yShelf = 0.95 + sIdx * 0.65;
    box(shelfGroup, [3.6, 0.06, 0.36], std(0xffffff, 0.3), [0, yShelf, 0]);
    box(shelfGroup, [3.6, 0.03, 0.03], mats.goldGlow, [0, yShelf - 0.03, 0.16]);
    for (let b = 0; b < 10; b++) {
      const bX = -1.55 + b * 0.34;
      const bType = (sIdx + b) % 3;
      if (bType === 0) {
        cyl(shelfGroup, 0.045, 0.05, 0.22, cosmeticColors[b % 4], [bX, yShelf + 0.04, 0.02], 10);
      } else if (bType === 1) {
        cyl(shelfGroup, 0.065, 0.065, 0.11, std(0xffffff, 0.2), [bX, yShelf + 0.04, 0.02], 12);
        box(shelfGroup, [0.08, 0.03, 0.08], mats.gold, [bX, yShelf + 0.13, 0.02]);
      } else {
        box(shelfGroup, [0.12, 0.24, 0.12], std(0xf7eedc, 0.5), [bX, yShelf + 0.04, 0.02]);
      }
    }
  }

  // Vertical Gold Typography on Right Wall
  const wallTextTex = officeWallTextTexture();
  const wallTextMat = new THREE.MeshStandardMaterial({
    map: wallTextTex,
    transparent: true,
    roughness: 0.4,
    emissive: 0xffd97d,
    emissiveIntensity: 0.3,
  });
  const wallTextPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.2), wallTextMat);
  wallTextPlane.rotation.y = -Math.PI / 2;
  wallTextPlane.position.set(10.58, 2.1, 0.5);
  hall.add(wallTextPlane);

  // Drifting warm golden ambient dust motes
  const moteCount = lowPower ? 28 : 72;
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
      size: 0.035,
      color: 0xffe3b0,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.34,
    })
  );
  hall.add(motes);

  // Interior architectural lighting accents
  const deskSpotL = new THREE.SpotLight(0xffedd2, 4.8, 12, Math.PI / 4, 0.4);
  deskSpotL.position.set(-2.0, IH - 0.2, -1.8);
  deskSpotL.target.position.set(-1.0, 1.0, -4.3);
  campus.add(deskSpotL);
  campus.add(deskSpotL.target);

  const deskSpotR = new THREE.SpotLight(0xffedd2, 4.8, 12, Math.PI / 4, 0.4);
  deskSpotR.position.set(2.0, IH - 0.2, -1.8);
  deskSpotR.target.position.set(1.0, 1.0, -4.3);
  campus.add(deskSpotR);
  campus.add(deskSpotR.target);

  const confWash = new THREE.PointLight(0xffe8cf, 3.6, 10, 1.8);
  confWash.position.set(-8.0, IH - 0.4, -3.2);
  campus.add(confWash);

  const workWash = new THREE.PointLight(0xffe8cf, 3.6, 10, 1.8);
  workWash.position.set(7.6, IH - 0.4, -2.6);
  campus.add(workWash);

  const navyWallGlow = new THREE.PointLight(0x76a8dc, 2.4, 8, 1.8);
  navyWallGlow.position.set(0, 2.5, -9.2);
  campus.add(navyWallGlow);

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
  // PerspectiveCamera.fov is VERTICAL. On narrow/portrait screens a fixed
  // vertical FOV crops the sides hard, so the scene looks zoomed in. Below a
  // reference aspect, widen the vertical FOV so the horizontal field of view
  // matches what a landscape screen sees (capped to avoid fisheye distortion).
  const FOV_REF_ASPECT = 1.3;
  const FOV_MAX = 92;
  function fitFov(baseFov: number) {
    const aspect = camera.aspect || 1;
    if (aspect >= FOV_REF_ASPECT) return baseFov;
    const halfV = THREE.MathUtils.degToRad(baseFov / 2);
    const fitted = THREE.MathUtils.radToDeg(2 * Math.atan((Math.tan(halfV) * FOV_REF_ASPECT) / aspect));
    return Math.min(Math.max(baseFov, fitted), Math.max(baseFov, FOV_MAX));
  }
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
    camera.updateProjectionMatrix();
  }
  resize();

  // ===== Loop =====
  let lastT = performance.now();
  let el = 0;
  let raf = 0;
  let active = true;
  let readySent = false;

  function tick() {
    if (!active) return;
    raf = requestAnimationFrame(tick);
    const now = performance.now();
    const dt = Math.min((now - lastT) / 1000, 0.1);
    lastT = now;
    el += dt;

    // heavy chase: the camera eases toward the scroll target instead of snapping
    current += (target - current) * (1 - Math.exp(-dt * 5.2));
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
    camera.fov = fitFov(poseFov);
    camera.updateProjectionMatrix();
    // exposure warms up as we step inside
    renderer.toneMappingExposure = 1.03 + 0.2 * smooth(2.7, 3.7, f);

    // the strong sun exists for the real Earth — dim it on the ground so the
    // campus keeps its moody evening light from lamps and windows
    const groundMix = smooth(1.9, 2.6, f);
    moon.intensity = 2.4 - 1.95 * groundMix;
    fill.intensity = 0.5 - 0.44 * groundMix;
    hemi.intensity = 0.6 - 0.22 * groundMix;
    hallFill.intensity = 1.15 * groundMix;

    // slow idle motion
    stars.rotation.y = el * 0.003;
    sky.rotation.y = el * 0.0012;
    orbitClouds.rotation.y = el * 0.0045;

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
    orbitCloudsMat.opacity = 0.55 * (1 - smooth(1.2, 1.9, f));

    // cloud deck drift
    for (const p of puffs) {
      p.s.position.x = p.bx + Math.sin(el * 0.05 + p.seed) * 2.2;
    }

    // gold dust floats in the hall air
    motes.rotation.y = Math.sin(el * 0.06) * 0.02;
    motes.position.y = Math.sin(el * 0.3) * 0.07;

    // subtle atmospheric cloud haze during descent (never a solid white screen)
    const cy = camera.position.y;
    const g = Math.exp(-Math.pow((cy - 60) / 14, 2));
    whiteMat.opacity = g * 0.16;
    white.visible = whiteMat.opacity > 0.005;

    // swap worlds behind the whiteout
    globe.visible = cy > 50;
    campus.visible = cy < 96;
    deck.visible = f > 1.5 && f < 3.2;
    sky.visible = globe.visible;
    stars.visible = globe.visible;

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
    setActive(nextActive) {
      if (active === nextActive) return;
      active = nextActive;
      if (active) {
        lastT = performance.now();
        tick();
      } else {
        cancelAnimationFrame(raf);
      }
    },
    resize,
    dispose() {
      active = false;
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
