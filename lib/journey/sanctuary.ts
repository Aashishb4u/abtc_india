import * as THREE from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { glowSprite } from "./textures";
import {
  porcelainTileTexture,
  walnutTexture,
  plasterTexture,
  sanctuaryScreenTexture,
  lineArtTexture,
  mirrorSheenTexture,
  shadowBlobTexture,
} from "./textures2";

/*
 * Master Aesthetic Sanctuary — a bright blush-and-gold salon/clinic:
 *   back wall   navy "Master Aesthetic Sanctuary" screen, fluted walnut panels, lit shelves, plants
 *   left wall   three arched, LED-outlined mirrors over white vanities with pink salon chairs
 *   right wall  line-art frames; three treatment beds with pink bolsters, ring-light lamp, trolleys
 *   ceiling     gold ring chandelier in a coved tray ceiling
 *   floor       glossy cream porcelain that reflects the room
 *
 * Room box: x -6.2..6.2, z -10.2..5.8 (front = +z, the door side), height 3.9.
 */

type V3 = [number, number, number];

export const ROOM = { x: 6.2, zBack: -10.2, zFront: 5.8, h: 3.9 };
const ZC = (ROOM.zBack + ROOM.zFront) / 2;
const ZL = ROOM.zFront - ROOM.zBack;

export interface Sanctuary {
  update(el: number, f: number): void;
  redraw(): void;
  dispose(): void;
}

export function buildSanctuary(
  parent: THREE.Object3D,
  opts: { maxAniso: number; lowPower: boolean }
): Sanctuary {
  const { maxAniso, lowPower } = opts;
  const root = new THREE.Group();
  parent.add(root);
  const H = ROOM.h;

  const geos: THREE.BufferGeometry[] = [];
  const mats: THREE.Material[] = [];
  const texs: THREE.Texture[] = [];
  const keepG = <T extends THREE.BufferGeometry>(g: T) => (geos.push(g), g);
  const keepM = <T extends THREE.Material>(m: T) => (mats.push(m), m);
  const keepT = <T extends THREE.Texture>(t: T) => {
    t.anisotropy = maxAniso;
    texs.push(t);
    return t;
  };

  const std = (color: number, roughness = 0.6, metalness = 0, extra: THREE.MeshStandardMaterialParameters = {}) =>
    keepM(new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra }));

  // ---------- materials ----------
  const plasterSide = keepT(plasterTexture("#f4d6c5"));
  plasterSide.repeat.set(4, 2);
  const plasterFeature = keepT(plasterTexture("#eaa88f"));
  plasterFeature.repeat.set(2, 1.5);
  const plasterCeil = keepT(plasterTexture("#fdf1e8"));
  plasterCeil.repeat.set(4, 4);

  const M = {
    wall: keepM(new THREE.MeshStandardMaterial({ map: plasterSide, color: 0xffffff, roughness: 0.88 })),
    feature: keepM(new THREE.MeshStandardMaterial({ map: plasterFeature, color: 0xffffff, roughness: 0.8 })),
    ceil: keepM(
      new THREE.MeshStandardMaterial({ map: plasterCeil, color: 0xffffff, roughness: 0.95, emissive: 0xffe6d0, emissiveIntensity: 0.34 })
    ),
    skirting: std(0xe8b9a2, 0.55),
    gold: std(0xdcb062, 0.26, 1, { envMapIntensity: 1.3 }),
    goldSoft: std(0xc89f55, 0.4, 0.85),
    glow: keepM(
      new THREE.MeshStandardMaterial({ color: 0xffe8c8, emissive: 0xffd9a0, emissiveIntensity: 2.4, roughness: 0.5 })
    ),
    glowWhite: keepM(
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff1da, emissiveIntensity: 3.2, roughness: 0.5 })
    ),
    white: std(0xfbf7f2, 0.34, 0.02, { envMapIntensity: 0.9 }),
    cream: std(0xf7efe4, 0.5),
    pink: std(0xeaa7a6, 0.78, 0, { envMapIntensity: 0.6 }),
    pinkLight: std(0xf3bdb9, 0.8),
    navy: std(0x17145b, 0.55),
    black: std(0x1f1f21, 0.45, 0.7),
    soil: std(0x2c2018, 1),
    leafA: std(0x4f9a5c, 0.7, 0, { flatShading: true }),
    leafB: std(0x3a8350, 0.7, 0, { flatShading: true }),
    leafC: std(0x68b06a, 0.7, 0, { flatShading: true }),
    mirror: keepM(
      new THREE.MeshStandardMaterial({
        map: keepT(mirrorSheenTexture()),
        emissiveMap: null,
        emissive: 0xe9c7b6,
        emissiveIntensity: 0.38,
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.35,
        envMapIntensity: 1.2,
      })
    ),
    shadow: keepM(
      new THREE.MeshBasicMaterial({
        map: keepT(shadowBlobTexture()),
        transparent: true,
        depthWrite: false,
        opacity: 0.8,
        polygonOffset: true,
        polygonOffsetFactor: -2,
      })
    ),
  };
  const bottleMats = [std(0xffffff, 0.3), std(0xf1b9b4, 0.35), std(0x232325, 0.3, 0.4), std(0xe3b964, 0.3, 0.6), std(0xcfe6f4, 0.25)];

  // ---------- helpers ----------
  /** Box whose pos.y is its BOTTOM. */
  const box = (p: THREE.Object3D, size: V3, mat: THREE.Material, pos: V3, rotY = 0) => {
    const m = new THREE.Mesh(keepG(new THREE.BoxGeometry(...size)), mat);
    m.position.set(pos[0], pos[1] + size[1] / 2, pos[2]);
    m.rotation.y = rotY;
    p.add(m);
    return m;
  };
  const rbox = (p: THREE.Object3D, size: V3, mat: THREE.Material, pos: V3, radius = 0.05, rotY = 0) => {
    const m = new THREE.Mesh(keepG(new RoundedBoxGeometry(size[0], size[1], size[2], 3, radius)), mat);
    m.position.set(pos[0], pos[1] + size[1] / 2, pos[2]);
    m.rotation.y = rotY;
    p.add(m);
    return m;
  };
  const cyl = (p: THREE.Object3D, rT: number, rB: number, h: number, mat: THREE.Material, pos: V3, seg = 20) => {
    const m = new THREE.Mesh(keepG(new THREE.CylinderGeometry(rT, rB, h, seg)), mat);
    m.position.set(pos[0], pos[1] + h / 2, pos[2]);
    p.add(m);
    return m;
  };
  const grp = (p: THREE.Object3D, pos: V3, rotY = 0) => {
    const g = new THREE.Group();
    g.position.set(...pos);
    g.rotation.y = rotY;
    p.add(g);
    return g;
  };
  const blob = (x: number, z: number, w: number, d: number, rot = 0, o = 1) => {
    const m = new THREE.Mesh(keepG(new THREE.PlaneGeometry(w, d)), o === 1 ? M.shadow : keepM(M.shadow.clone()));
    if (o !== 1) (m.material as THREE.MeshBasicMaterial).opacity = M.shadow.opacity * o;
    m.rotation.set(-Math.PI / 2, 0, rot);
    m.position.set(x, 0.03, z);
    m.renderOrder = 1;
    root.add(m);
  };
  const glow = (color: string, pos: V3, sx: number, sy: number, opacity: number) => {
    const s = new THREE.Sprite(
      keepM(
        new THREE.SpriteMaterial({
          map: keepT(glowSprite(color)),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity,
        })
      )
    );
    s.position.set(...pos);
    s.scale.set(sx, sy, 1);
    root.add(s);
    return s;
  };
  const stadium = (w: number, h: number) => {
    const s = new THREE.Shape();
    const hw = w / 2;
    const hh = h / 2;
    s.moveTo(-hw, -hh + hw);
    s.lineTo(-hw, hh - hw);
    s.absarc(0, hh - hw, hw, Math.PI, 0, true);
    s.lineTo(hw, -hh + hw);
    s.absarc(0, -hh + hw, hw, 0, Math.PI, true);
    return s;
  };

  // ---------- shell: floor, ceiling, walls ----------
  const tile = keepT(porcelainTileTexture());
  tile.repeat.set((ROOM.x * 2) / 1.2, ZL / 1.2);
  const floorGeo = keepG(new THREE.PlaneGeometry(ROOM.x * 2, ZL));

  let reflector: Reflector | null = null;
  if (!lowPower) {
    reflector = new Reflector(floorGeo, {
      textureWidth: 1024,
      textureHeight: 640,
      color: 0xc9b8aa,
      clipBias: 0.003,
    });
    reflector.rotation.x = -Math.PI / 2;
    reflector.position.set(0, 0.006, ZC);
    reflector.visible = false;
    root.add(reflector);
  }
  const floor = new THREE.Mesh(
    floorGeo,
    keepM(
      new THREE.MeshStandardMaterial({
        map: tile,
        color: 0xffffff,
        roughness: 0.16,
        metalness: 0.0,
        envMapIntensity: 1.1,
        transparent: !!reflector,
        opacity: reflector ? 0.8 : 1,
      })
    )
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0.012, ZC);
  root.add(floor);

  const ceil = new THREE.Mesh(keepG(new THREE.PlaneGeometry(ROOM.x * 2, ZL)), M.ceil);
  ceil.rotation.x = Math.PI / 2;
  ceil.position.set(0, H, ZC);
  root.add(ceil);

  // side + back walls
  for (const s of [-1, 1]) box(root, [0.12, H, ZL + 0.2], M.wall, [s * (ROOM.x + 0.06), 0, ZC]);
  box(root, [ROOM.x * 2 + 0.3, H, 0.12], M.wall, [0, 0, ROOM.zBack - 0.06]);
  // salmon feature panel behind the screen
  box(root, [7.0, H, 0.05], M.feature, [0, 0, ROOM.zBack + 0.025]);
  // front wall interior skin, with the 3 m door opening
  box(root, [ROOM.x - 1.5, H, 0.08], M.wall, [-(1.5 + (ROOM.x - 1.5) / 2), 0, ROOM.zFront - 0.04]);
  box(root, [ROOM.x - 1.5, H, 0.08], M.wall, [1.5 + (ROOM.x - 1.5) / 2, 0, ROOM.zFront - 0.04]);
  box(root, [3.0, H - 3.14, 0.08], M.wall, [0, 3.14, ROOM.zFront - 0.04]);
  // skirting
  for (const s of [-1, 1]) box(root, [0.03, 0.11, ZL], M.skirting, [s * (ROOM.x - 0.015), 0, ZC]);
  box(root, [ROOM.x * 2, 0.11, 0.03], M.skirting, [0, 0, ROOM.zBack + 0.015]);

  // ---------- coved tray ceiling ----------
  const trayIn = { x: 4.6, z0: -9.0, z1: 4.4 };
  // four drop-bands framing the raised centre
  const bandH = 0.16;
  const backD = trayIn.z0 - ROOM.zBack;
  const frontD = ROOM.zFront - trayIn.z1;
  box(root, [ROOM.x * 2, bandH, backD], M.ceil, [0, H - bandH, ROOM.zBack + backD / 2]);
  box(root, [ROOM.x * 2, bandH, frontD], M.ceil, [0, H - bandH, trayIn.z1 + frontD / 2]);
  for (const s of [-1, 1]) {
    box(root, [ROOM.x - trayIn.x, bandH, trayIn.z1 - trayIn.z0], M.ceil, [s * (trayIn.x + (ROOM.x - trayIn.x) / 2), H - bandH, (trayIn.z0 + trayIn.z1) / 2]);
  }
  // warm cove strips: inner edge of the drop-bands + perimeter
  const ledY = H - bandH - 0.02;
  box(root, [trayIn.x * 2, 0.025, 0.05], M.glow, [0, ledY, trayIn.z0 + 0.02]);
  box(root, [trayIn.x * 2, 0.025, 0.05], M.glow, [0, ledY, trayIn.z1 - 0.02]);
  for (const s of [-1, 1]) box(root, [0.05, 0.025, trayIn.z1 - trayIn.z0], M.glow, [s * (trayIn.x - 0.02), ledY, (trayIn.z0 + trayIn.z1) / 2]);
  for (const s of [-1, 1]) box(root, [0.04, 0.03, ZL - 0.4], M.glow, [s * (ROOM.x - 0.1), H - 0.1, ZC]);
  box(root, [ROOM.x * 2 - 0.4, 0.03, 0.04], M.glow, [0, H - 0.1, ROOM.zBack + 0.1]);
  // soft ceiling wash along the cove
  glow("255,214,160", [0, H - 0.3, trayIn.z0 + 0.1], 11, 1.0, 0.18);
  glow("255,214,160", [0, H - 0.3, trayIn.z1 - 0.1], 11, 1.0, 0.16);

  // downlights
  const dlGeo = keepG(new THREE.CircleGeometry(0.09, 20));
  const dlMat = keepM(new THREE.MeshBasicMaterial({ color: 0xfff4de }));
  const dlGlow = keepM(
    new THREE.SpriteMaterial({
      map: keepT(glowSprite("255,232,196")),
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.38,
    })
  );
  for (const x of [-5.4, -2.6, 2.6, 5.4]) {
    for (const z of [-8.6, -5.6, -2.6, 0.4, 3.4]) {
      if (Math.abs(x) < 3 && z > -7 && z < -3.4) continue;
      const d = new THREE.Mesh(dlGeo, dlMat);
      d.rotation.x = Math.PI / 2;
      d.position.set(x, H - 0.012, z);
      root.add(d);
      const g = new THREE.Sprite(dlGlow);
      g.position.set(x, H - 0.1, z);
      g.scale.set(0.9, 0.9, 1);
      root.add(g);
    }
  }

  // ---------- ring chandelier ----------
  const chand = grp(root, [0, 3.3, -6.0]);
  const ringR = 1.3;
  const outer = new THREE.Mesh(keepG(new THREE.TorusGeometry(ringR, 0.075, 18, 120)), M.gold);
  outer.rotation.x = Math.PI / 2;
  chand.add(outer);
  const inner = new THREE.Mesh(keepG(new THREE.TorusGeometry(ringR - 0.02, 0.05, 14, 120)), M.glowWhite);
  inner.rotation.x = Math.PI / 2;
  inner.position.y = -0.07;
  chand.add(inner);
  const disc = new THREE.Mesh(keepG(new THREE.RingGeometry(ringR - 0.12, ringR + 0.02, 120)), M.glowWhite);
  disc.rotation.x = Math.PI / 2;
  disc.position.y = -0.075;
  chand.add(disc);
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI * 2 + 0.5;
    const cable = new THREE.Mesh(keepG(new THREE.CylinderGeometry(0.006, 0.006, H - 3.3, 6)), M.goldSoft);
    cable.position.set(Math.cos(a) * ringR, (H - 3.3) / 2, Math.sin(a) * ringR);
    chand.add(cable);
  }
  const chandGlow = glow("255,226,184", [0, 3.1, -6.0], 6, 6, 0.3);
  const chandLight = new THREE.PointLight(0xffe3bd, 12, 15, 1.9);
  chandLight.position.set(0, 3.0, -6.0);
  root.add(chandLight);

  // ---------- back wall: screen ----------
  const screen = sanctuaryScreenTexture();
  keepT(screen.tex);
  const frame = box(root, [5.1, 2.9, 0.09], M.gold, [0, 0.72, ROOM.zBack + 0.09]);
  void frame;
  box(root, [4.92, 2.72, 0.04], M.navy, [0, 0.81, ROOM.zBack + 0.14]);
  const screenMesh = new THREE.Mesh(
    keepG(new THREE.PlaneGeometry(4.8, 2.6)),
    keepM(
      new THREE.MeshStandardMaterial({
        map: screen.tex,
        emissive: 0xffffff,
        emissiveMap: screen.tex,
        emissiveIntensity: 0.9,
        roughness: 0.18,
        metalness: 0.05,
      })
    )
  );
  screenMesh.position.set(0, 0.81 + 1.3, ROOM.zBack + 0.165);
  root.add(screenMesh);
  // glass sweep: a very faint travelling specular band, like a real lacquered panel
  const sweep = new THREE.Mesh(
    keepG(new THREE.PlaneGeometry(0.9, 2.6)),
    keepM(
      new THREE.MeshBasicMaterial({
        map: keepT(glowSprite("255,255,255")),
        transparent: true,
        opacity: 0.07,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  sweep.position.set(0, 2.11, ROOM.zBack + 0.17);
  root.add(sweep);
  const screenLight = new THREE.PointLight(0x95a4ff, 3.2, 9, 2);
  screenLight.position.set(0, 2.1, ROOM.zBack + 1.4);
  root.add(screenLight);
  glow("150,160,255", [0, 2.1, ROOM.zBack + 0.3], 8.5, 5, 0.1);

  // ---------- back wall: walnut fluted panels + lit shelves ----------
  const wood = keepT(walnutTexture());
  const slatMat = keepM(new THREE.MeshStandardMaterial({ map: wood, color: 0xffffff, roughness: 0.55, metalness: 0.02 }));
  const backing = std(0x3c2616, 0.9);
  const slatGeo = keepG(new THREE.BoxGeometry(0.085, H - 0.08, 0.13));
  const addBottle = (p: THREE.Object3D, x: number, y: number, z: number, seed: number) => {
    const rr = 0.028 + ((seed * 7) % 5) * 0.006;
    const hh = 0.1 + ((seed * 13) % 7) * 0.025;
    const mat = bottleMats[seed % bottleMats.length];
    cyl(p, rr, rr, hh, mat, [x, y, z], 14);
    cyl(p, rr * 0.55, rr * 0.55, 0.035, seed % 2 ? M.gold : M.black, [x, y + hh, z], 12);
  };
  for (const s of [-1, 1]) {
    const px = s * 4.35;
    box(root, [2.0, H, 0.05], backing, [px, 0, ROOM.zBack + 0.06]);
    for (let i = 0; i < 13; i++) {
      const m = new THREE.Mesh(slatGeo, slatMat);
      m.position.set(s * (3.43 + i * 0.152), (H - 0.08) / 2 + 0.04, ROOM.zBack + 0.15);
      root.add(m);
    }
    // glowing shelves
    [0.98, 1.58, 2.18, 2.78].forEach((y, row) => {
      const sh = box(root, [1.7, 0.05, 0.3], M.white, [px, y, ROOM.zBack + 0.32]);
      void sh;
      box(root, [1.7, 0.014, 0.03], M.glow, [px, y - 0.014, ROOM.zBack + 0.46]);
      glow("255,205,150", [px, y - 0.1, ROOM.zBack + 0.4], 2.1, 0.5, 0.22);
      for (let i = 0; i < 8; i++) {
        addBottle(root, px - 0.74 + i * 0.21 + ((row * 3 + i) % 3) * 0.02, y + 0.05, ROOM.zBack + 0.3 + (((i + row) % 3) - 1) * 0.04, i + row * 5 + (s > 0 ? 3 : 0));
      }
    });
  }

  // ---------- plants ----------
  const swayLeaves: { m: THREE.Object3D; base: number; ph: number; amp: number }[] = [];
  const leafGeo = keepG(new THREE.IcosahedronGeometry(1, 0));
  const makePlant = (x: number, z: number, scale = 1, leaves = 15) => {
    const g = grp(root, [x, 0, z]);
    g.scale.setScalar(scale);
    cyl(g, 0.3, 0.23, 0.46, M.white, [0, 0, 0], 6);
    cyl(g, 0.27, 0.27, 0.02, M.soil, [0, 0.45, 0], 6);
    for (let i = 0; i < leaves; i++) {
      const a = i * 2.399;
      const t = i / leaves;
      const pivot = grp(g, [0, 0.46, 0], a);
      const tilt = 0.18 + t * 0.95 + (i % 3) * 0.05;
      pivot.rotation.x = -tilt;
      const len = 0.46 + (1 - t) * 0.42;
      const leaf = new THREE.Mesh(leafGeo, [M.leafA, M.leafB, M.leafC][i % 3]);
      leaf.scale.set(0.22 + (i % 4) * 0.035, len * 0.8, 0.04);
      leaf.position.y = len * 0.95 + 0.05 + t * 0.1;
      pivot.add(leaf);
      swayLeaves.push({ m: pivot, base: pivot.rotation.x, ph: i * 0.9 + x, amp: 0.012 + (i % 3) * 0.004 });
    }
    blob(x, z, 1.3 * scale, 1.3 * scale, 0, 0.9);
  };
  makePlant(-2.95, -9.45, 1.18, 18);
  makePlant(2.95, -9.45, 1.18, 18);
  makePlant(-5.55, -2.2, 0.85, 12);
  makePlant(-5.55, -5.0, 0.85, 12);
  makePlant(5.6, 4.9, 0.9, 13);
  makePlant(-5.6, 4.9, 0.9, 13);

  // ---------- left wall: arched mirrors, vanities, chairs ----------
  const outerS = stadium(1.0, 2.05);
  const innerPts = stadium(0.9, 1.95).getPoints(36);
  outerS.holes.push(new THREE.Path(innerPts));
  const outlineGeo = keepG(new THREE.ExtrudeGeometry(outerS, { depth: 0.03, bevelEnabled: false, curveSegments: 20 }));
  const mirrorGeo = keepG(new THREE.ShapeGeometry(stadium(0.92, 1.97), 24));

  const makeChair = (x: number, z: number, yaw: number) => {
    const g = grp(root, [x, 0, z], yaw);
    cyl(g, 0.3, 0.32, 0.03, M.gold, [0, 0, 0], 32);
    cyl(g, 0.05, 0.06, 0.4, M.gold, [0, 0.03, 0], 16);
    rbox(g, [0.54, 0.15, 0.52], M.pink, [0, 0.42, 0], 0.06);
    const back = rbox(g, [0.52, 0.6, 0.11], M.pink, [0, 0.52, 0.27], 0.06);
    back.rotation.x = 0.1;
    for (const s of [-1, 1]) {
      rbox(g, [0.07, 0.07, 0.4], M.pinkLight, [s * 0.3, 0.66, 0.02], 0.025);
      box(g, [0.04, 0.2, 0.04], M.gold, [s * 0.3, 0.46, 0.0]);
    }
    cyl(g, 0.17, 0.17, 0.025, M.gold, [0, 0.06, -0.38], 24);
    blob(x, z, 1.0, 1.0, 0, 0.9);
    return g;
  };

  [-0.8, -3.6, -6.4].forEach((z, i) => {
    const wallX = -ROOM.x;
    const st = grp(root, [wallX, 0, z], Math.PI / 2);
    // vanity counter (local +z points into the room)
    rbox(st, [1.7, 0.78, 0.5], M.white, [0, 0, 0.27], 0.02);
    box(st, [1.76, 0.04, 0.56], M.white, [0, 0.78, 0.27]);
    box(st, [1.0, 0.012, 0.012], M.gold, [0, 0.55, 0.53]);
    for (const s of [-1, 1]) rbox(st, [0.026, 0.026, 0.12], M.gold, [s * 0.4, 0.62, 0.55], 0.01);
    // mirror
    const mirror = new THREE.Mesh(mirrorGeo, M.mirror);
    mirror.position.set(0, 1.97, 0.012);
    st.add(mirror);
    const outline = new THREE.Mesh(outlineGeo, M.glowWhite);
    outline.position.set(0, 1.97, 0.0);
    st.add(outline);
    // sconce-like halo behind outline
    const halo = new THREE.Sprite(
      keepM(
        new THREE.SpriteMaterial({
          map: keepT(glowSprite("255,222,176")),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.4,
        })
      )
    );
    halo.position.set(0, 1.97, 0.06);
    halo.scale.set(2.2, 3.1, 1);
    st.add(halo);
    // table-top props
    for (let k = 0; k < 4; k++) addBottle(st, -0.55 + k * 0.17, 0.82, 0.3 + (k % 2) * 0.08, i * 4 + k + 2);
    rbox(st, [0.3, 0.025, 0.2], M.pinkLight, [0.52, 0.82, 0.32], 0.01);
    // chair facing the mirror, slightly swivelled
    makeChair(wallX + 1.05, z + 0.0, -Math.PI / 2 + (i === 1 ? -0.35 : i === 0 ? 0.28 : 0.1));
    // wall-side light
    if (i === 1) {
      const l = new THREE.PointLight(0xffd8b4, 4, 8, 1.9);
      l.position.set(wallX + 1.0, 2.3, z);
      root.add(l);
    }
  });

  // ---------- right wall: framed line art ----------
  const frameArtGeo = keepG(new THREE.PlaneGeometry(0.78, 1.25));
  [0, 1, 0].forEach((v, i) => {
    const z = -1.0 - i * 3.2;
    const g = grp(root, [ROOM.x - 0.03, 2.0, z], -Math.PI / 2);
    box(g, [0.96, 1.44, 0.04], M.gold, [0, -0.72, 0]);
    box(g, [0.86, 1.34, 0.02], M.cream, [0, -0.67, 0.025]);
    const art = new THREE.Mesh(
      frameArtGeo,
      keepM(new THREE.MeshStandardMaterial({ map: keepT(lineArtTexture(v)), roughness: 0.7 }))
    );
    art.position.set(0, 0, 0.045);
    g.add(art);
    // picture light
    box(g, [0.5, 0.025, 0.1], M.gold, [0, 0.72, 0.06]);
  });

  // ---------- treatment beds ----------
  const makeBed = (x: number, z: number, yaw: number) => {
    const g = grp(root, [x, 0, z], yaw);
    box(g, [1.88, 0.1, 0.62], M.gold, [0, 0.0, 0]);
    rbox(g, [2.0, 0.4, 0.74], M.white, [0, 0.1, 0], 0.07);
    rbox(g, [1.96, 0.11, 0.72], M.cream, [0, 0.5, 0], 0.045);
    const back = rbox(g, [0.82, 0.11, 0.72], M.cream, [0.88, 0.58, 0], 0.045);
    back.rotation.z = 0.5;
    back.position.y = 0.78;
    back.position.x = 0.7;
    const bol = new THREE.Mesh(keepG(new THREE.CylinderGeometry(0.085, 0.085, 0.58, 18)), M.pinkLight);
    bol.rotation.x = Math.PI / 2;
    bol.position.set(-0.82, 0.7, 0);
    g.add(bol);
    const towel = new THREE.Mesh(keepG(new THREE.BoxGeometry(0.4, 0.04, 0.5)), M.white);
    towel.position.set(0.1, 0.63, 0.02);
    g.add(towel);
    // gold piping
    box(g, [2.0, 0.018, 0.018], M.gold, [0, 0.3, 0.37]);
    blob(x, z, 2.5, 1.3, yaw, 1);
  };
  [-1.6, -4.1, -6.6].forEach((z, i) => makeBed(4.55, z, Math.PI + (i === 1 ? 0.03 : 0)));
  // beds face -x: bolster toward room centre. (Math.PI flips local +x to world -x, so back-rest sits at the wall)

  // magnifier ring lamp between beds
  const makeRingLamp = (x: number, z: number) => {
    const g = grp(root, [x, 0, z]);
    cyl(g, 0.2, 0.22, 0.03, M.white, [0, 0, 0], 24);
    cyl(g, 0.018, 0.018, 1.45, M.white, [0, 0.03, 0], 10);
    const arm = new THREE.Mesh(keepG(new THREE.CylinderGeometry(0.014, 0.014, 0.8, 8)), M.white);
    arm.rotation.z = Math.PI / 2 - 0.35;
    arm.position.set(-0.36, 1.58, 0);
    g.add(arm);
    const ring = new THREE.Mesh(keepG(new THREE.TorusGeometry(0.17, 0.028, 12, 36)), M.glowWhite);
    ring.rotation.set(0.9, 0.3, 0);
    ring.position.set(-0.74, 1.66, 0);
    g.add(ring);
    const lens = new THREE.Mesh(
      keepG(new THREE.CircleGeometry(0.15, 28)),
      keepM(new THREE.MeshStandardMaterial({ color: 0xdfeefa, roughness: 0.05, transparent: true, opacity: 0.28 }))
    );
    lens.rotation.copy(ring.rotation);
    lens.position.copy(ring.position);
    g.add(lens);
    blob(x, z, 0.8, 0.8, 0, 0.7);
  };
  makeRingLamp(5.45, -2.85);
  makeRingLamp(5.45, -5.35);

  // trolleys
  const makeTrolley = (x: number, z: number, yaw: number, seed: number) => {
    const g = grp(root, [x, 0, z], yaw);
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        box(g, [0.03, 0.88, 0.03], M.black, [sx * 0.31, 0.06, sz * 0.2]);
        const w = new THREE.Mesh(keepG(new THREE.SphereGeometry(0.035, 10, 8)), M.black);
        w.position.set(sx * 0.31, 0.035, sz * 0.2);
        g.add(w);
      }
    }
    [0.18, 0.5, 0.86].forEach((y, r) => {
      box(g, [0.68, 0.025, 0.46], M.black, [0, y, 0]);
      for (let k = 0; k < 4; k++) addBottle(g, -0.24 + k * 0.16, y + 0.025, -0.05 + (k % 2) * 0.08, seed + r * 7 + k);
    });
    blob(x, z, 1.0, 0.8, yaw, 0.9);
  };
  makeTrolley(-4.55, 1.55, 0.25, 3);
  makeTrolley(3.0, -2.9, 1.0, 11);
  makeTrolley(-3.7, -8.6, -0.2, 21);

  // ---------- rug ----------
  const rugR = 1.95;
  const rugZ = -5.1;
  const rug = new THREE.Mesh(keepG(new THREE.CircleGeometry(rugR, 64)), M.navy);
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0, 0.026, rugZ);
  root.add(rug);
  const goldRing = (r0: number, r1: number) => {
    const m = new THREE.Mesh(keepG(new THREE.RingGeometry(r0, r1, 96)), M.goldSoft);
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, 0.028, rugZ);
    root.add(m);
  };
  goldRing(rugR - 0.13, rugR - 0.075);
  goldRing(rugR - 0.04, rugR);
  goldRing(rugR - 0.36, rugR - 0.34);

  // ---------- floating dust in the light ----------
  const moteN = lowPower ? 60 : 140;
  const mp = new Float32Array(moteN * 3);
  for (let i = 0; i < moteN; i++) {
    mp[i * 3] = (Math.random() - 0.5) * 11;
    mp[i * 3 + 1] = 0.4 + Math.random() * 3.1;
    mp[i * 3 + 2] = ROOM.zBack + 0.6 + Math.random() * (ZL - 1.2);
  }
  const moteGeo = keepG(new THREE.BufferGeometry());
  moteGeo.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  const motes = new THREE.Points(
    moteGeo,
    keepM(
      new THREE.PointsMaterial({
        map: keepT(glowSprite("255,226,180")),
        size: 0.05,
        color: 0xffe9c4,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    )
  );
  root.add(motes);

  // ---------- fill lights ----------
  const fills: [number, number, number, number][] = [
    [-3.2, 3.3, -0.5, 5],
    [3.2, 3.3, -0.5, 5],
    [-3.4, 3.2, -8.0, 4.5],
    [3.4, 3.2, -8.0, 4.5],
    [4.0, 2.7, -3.9, 4],
  ];
  const fillLights = fills.map(([x, y, z, i]) => {
    const l = new THREE.PointLight(0xffe6c9, i, 12, 1.9);
    l.position.set(x, y, z);
    root.add(l);
    return { l, base: i };
  });
  const baseChand = chandLight.intensity;

  return {
    update(el, f) {
      const reveal = THREE.MathUtils.smoothstep(f, 2.75, 3.5);
      if (reflector) reflector.visible = f > 2.7;

      // gentle air movement in the leaves
      for (const s of swayLeaves) s.m.rotation.x = s.base + Math.sin(el * 0.7 + s.ph) * s.amp;

      // dust drifts, never snaps
      motes.rotation.y = Math.sin(el * 0.05) * 0.03;
      motes.position.y = Math.sin(el * 0.25) * 0.08;
      motes.position.x = Math.sin(el * 0.11) * 0.2;

      // screen gloss sweep (a long, slow pass every ~16 s)
      const sw = (el % 16) / 16;
      sweep.position.x = -3.4 + sw * 6.8;
      (sweep.material as THREE.MeshBasicMaterial).opacity = 0.07 * Math.sin(Math.min(1, sw) * Math.PI);

      // lights warm up as we step in from the dark plaza
      const k = 0.72 + 0.28 * reveal;
      chandLight.intensity = baseChand * k * (1 + Math.sin(el * 0.9) * 0.012);
      chandGlow.material.opacity = 0.3 * k;
      for (const fl of fillLights) fl.l.intensity = fl.base * k;
    },
    redraw() {
      screen.redraw();
    },
    dispose() {
      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      texs.forEach((t) => t.dispose());
      reflector?.dispose?.();
      parent.remove(root);
    },
  };
}
