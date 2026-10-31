import * as THREE from "three";

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

/** Convert (lat, lon) in degrees to pixel coordinates on an equirectangular canvas (w x h). */
function llToXY(lat: number, lon: number, w: number, h: number): [number, number] {
  const x = (0.5 + lon / 360) * w;
  const y = (0.5 - lat / 180) * h;
  return [x, y];
}

function drawPoly(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  w: number,
  h: number
) {
  if (!pts.length) return;
  ctx.beginPath();
  pts.forEach(([lat, lon], idx) => {
    const [x, y] = llToXY(lat, lon, w, h);
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
}

// Accurate stylized continent polygons [lat, lon]
const CONTINENTS: [number, number][][] = [
  // Africa
  [
    [37, 10], [32, 32], [12, 51], [-2, 41], [-15, 40], [-26, 33],
    [-35, 20], [-34, 18], [-18, 12], [-5, 9], [4, 7], [5, -8],
    [15, -17], [28, -13], [36, -6],
  ],
  // Europe
  [
    [36, -9], [43, -9], [48, -4], [52, 5], [58, 8], [70, 20],
    [70, 40], [60, 60], [46, 48], [42, 28], [38, 24], [40, 18],
    [38, 15], [44, 8], [36, -5],
  ],
  // Asia (mainland excluding detailed India peninsula which is drawn separately)
  [
    [60, 60], [72, 80], [73, 120], [66, 170], [55, 160], [52, 140],
    [38, 122], [31, 122], [22, 114], [10, 105], [1, 104], [15, 98],
    [22, 92], [28, 88], [30, 78], [25, 67], [25, 57], [13, 45],
    [28, 35], [37, 36], [42, 28], [46, 48],
  ],
  // Australia
  [
    [-12, 131], [-12, 142], [-25, 153], [-38, 147], [-35, 136],
    [-34, 115], [-22, 114], [-15, 124],
  ],
  // North America
  [
    [70, -160], [72, -95], [60, -64], [45, -60], [25, -80], [19, -96],
    [8, -78], [15, -93], [23, -106], [32, -117], [48, -124], [60, -148],
  ],
  // South America
  [
    [11, -74], [6, -52], [-6, -35], [-23, -43], [-38, -57], [-54, -68],
    [-50, -75], [-18, -71], [-5, -81], [8, -78],
  ],
  // UK & Ireland
  [
    [50, -5], [58, -6], [58, -2], [51, 1],
  ],
  // Japan
  [
    [31, 130], [35, 140], [44, 145], [40, 139], [34, 132],
  ],
  // Indonesia / Sumatra / Borneo
  [
    [5, 95], [-6, 106], [-8, 115], [-5, 105],
  ],
  [
    [7, 116], [1, 109], [-3, 114], [1, 118],
  ],
  // Madagascar
  [
    [-12, 49], [-25, 47], [-25, 44], [-15, 46],
  ],
];

// High-precision India polygon [lat, lon]
const INDIA_POLY: [number, number][] = [
  [35.5, 74.5], [36.8, 76.0], [34.8, 78.5], [32.0, 78.8], [30.2, 81.0],
  [28.2, 84.5], [27.5, 88.2], [28.0, 91.8], [28.8, 96.5], [27.0, 97.2],
  [24.0, 94.5], [22.0, 92.6], [24.5, 89.8], [22.2, 88.8], [21.5, 87.0],
  [19.8, 85.8], [17.7, 83.3], [16.0, 81.2], [13.1, 80.3], [10.3, 79.8],
  [8.08, 77.55], // Kanyakumari
  [9.9, 76.25], // Kochi
  [12.9, 74.8], // Mangalore
  [15.4, 73.8], // Goa
  [18.0, 73.0], // Konkan
  [19.07, 72.87], // Mumbai
  [21.1, 72.7], // Surat
  [20.7, 70.4], // Saurashtra
  [22.3, 69.0], // Dwarka
  [23.8, 68.4], // Kutch
  [24.7, 71.0], // Rajasthan border
  [27.5, 70.2], [30.1, 73.9], [32.5, 74.6],
];

// Sri Lanka
const SRILANKA_POLY: [number, number][] = [
  [9.8, 80.2], [8.5, 81.8], [6.0, 81.2], [6.1, 80.1], [8.2, 79.8],
];

// Maharashtra highlight polygon [lat, lon]
const MAHARASHTRA_POLY: [number, number][] = [
  [20.2, 72.8], [21.6, 74.2], [21.3, 76.5], [21.5, 79.2], [20.5, 80.5],
  [18.6, 80.2], [18.5, 77.8], [17.5, 76.2], [16.8, 74.2], [15.8, 73.7],
  [18.0, 73.0], [19.1, 72.85],
];

// Accredited cities in India [lat, lon, label, major?]
const INDIA_CITIES: [number, number, string, boolean][] = [
  [18.5204, 73.8567, "PUNE", true],
  [19.076, 72.8777, "MUMBAI", true],
  [28.6139, 77.209, "NEW DELHI", true],
  [12.9716, 77.5946, "BENGALURU", true],
  [17.385, 78.4867, "HYDERABAD", true],
  [23.0225, 72.5714, "AHMEDABAD", false],
  [22.5726, 88.3639, "KOLKATA", true],
  [13.0827, 80.2707, "CHENNAI", false],
  [26.9124, 75.7873, "JAIPUR", false],
  [30.7333, 76.7794, "CHANDIGARH", false],
  [17.6868, 83.2185, "VISAKHAPATNAM", false],
  [22.7196, 75.8577, "INDORE", false],
  [21.1458, 79.0882, "NAGPUR", false],
  [19.9975, 73.7898, "NASHIK", false],
  [10.7867, 76.6548, "PALAKKAD", false],
];

export function earthTexture(scale = 1): THREE.CanvasTexture {
  const W = 2048;
  const H = 1024;
  const { c, ctx } = makeCanvas(W * scale, H * scale);
  ctx.scale(scale, scale);

  // 1. Deep ocean bathymetry background
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, H);
  oceanGrad.addColorStop(0, "#02061c");
  oceanGrad.addColorStop(0.25, "#06163e");
  oceanGrad.addColorStop(0.5, "#082258");
  oceanGrad.addColorStop(0.75, "#06163e");
  oceanGrad.addColorStop(1, "#02061c");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, W, H);

  // Indian ocean subtle radial glow around India
  const [ix, iy] = llToXY(20, 78, W, H);
  const indOceanGlow = ctx.createRadialGradient(ix, iy, 10, ix, iy, 320);
  indOceanGlow.addColorStop(0, "rgba(7, 153, 232, 0.25)");
  indOceanGlow.addColorStop(0.5, "rgba(7, 153, 232, 0.08)");
  indOceanGlow.addColorStop(1, "rgba(7, 153, 232, 0)");
  ctx.fillStyle = indOceanGlow;
  ctx.fillRect(0, 0, W, H);

  // 2. Subtle latitude / longitude graticule lines
  ctx.strokeStyle = "rgba(7, 153, 232, 0.11)";
  ctx.lineWidth = 1;
  for (let lon = -180; lon <= 180; lon += 15) {
    const [x] = llToXY(0, lon, W, H);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = llToXY(lat, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }

  // 3. Continents with coastal glow
  ctx.save();
  for (const poly of CONTINENTS) {
    drawPoly(ctx, poly, W, H);
    ctx.fillStyle = "#0e2a5c";
    ctx.shadowColor = "rgba(7, 153, 232, 0.45)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.strokeStyle = "rgba(65, 175, 245, 0.42)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();

  // Sri Lanka
  drawPoly(ctx, SRILANKA_POLY, W, H);
  ctx.fillStyle = "#143875";
  ctx.fill();
  ctx.strokeStyle = "rgba(7, 153, 232, 0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Highlighted INDIA landmass
  ctx.save();
  drawPoly(ctx, INDIA_POLY, W, H);
  const indGrad = ctx.createLinearGradient(ix - 120, iy - 140, ix + 120, iy + 140);
  indGrad.addColorStop(0, "#164896");
  indGrad.addColorStop(0.5, "#1d5bbf");
  indGrad.addColorStop(1, "#123b82");
  ctx.fillStyle = indGrad;
  ctx.shadowColor = "rgba(7, 153, 232, 0.85)";
  ctx.shadowBlur = 22;
  ctx.fill();

  // Crisp luminous border of India
  ctx.strokeStyle = "#5ad2ff";
  ctx.lineWidth = 3.2;
  ctx.stroke();
  ctx.restore();

  // 5. Highlighted MAHARASHTRA region inside India
  ctx.save();
  drawPoly(ctx, MAHARASHTRA_POLY, W, H);
  ctx.fillStyle = "rgba(7, 153, 232, 0.42)";
  ctx.fill();
  ctx.strokeStyle = "#ffd97d";
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.restore();

  // 6. Glowing national network lines from Pune/Mumbai to all accredited cities
  const [puneX, puneY] = llToXY(18.5204, 73.8567, W, H);
  ctx.save();
  for (const [lat, lon] of INDIA_CITIES) {
    const [cx, cy] = llToXY(lat, lon, W, H);
    ctx.beginPath();
    ctx.moveTo(puneX, puneY);
    ctx.lineTo(cx, cy);
    ctx.strokeStyle = "rgba(120, 220, 255, 0.45)";
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }
  ctx.restore();

  // 7. City light nodes across India + Zurich HQ
  for (const [lat, lon, label, major] of INDIA_CITIES) {
    const [cx, cy] = llToXY(lat, lon, W, H);
    const r = major ? 8 : 4.5;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2.5);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.3, major ? "#ffd97d" : "#5ad2ff");
    g.addColorStop(1, "rgba(7, 153, 232, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
    ctx.fill();

    if (major) {
      ctx.font = "700 11px Manrope, Arial, sans-serif";
      ctx.fillStyle = label === "PUNE" ? "#ffd97d" : "rgba(235, 248, 255, 0.92)";
      ctx.textAlign = label === "MUMBAI" ? "right" : "left";
      const offX = label === "MUMBAI" ? -8 : 8;
      const offY = label === "PUNE" ? 4 : 3;
      ctx.fillText(label, cx + offX, cy + offY);
    }
  }

  // Country label INDIA
  ctx.save();
  ctx.font = "800 22px Playfair Display, Georgia, serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.textAlign = "center";
  const [indLblX, indLblY] = llToXY(23.5, 79.0, W, H);
  ctx.fillText("I N D I A", indLblX, indLblY);
  ctx.restore();

  // Zurich HQ marker (47.3769° N, 8.5417° E)
  const [zx, zy] = llToXY(47.3769, 8.5417, W, H);
  const zg = ctx.createRadialGradient(zx, zy, 0, zx, zy, 18);
  zg.addColorStop(0, "#ffffff");
  zg.addColorStop(0.35, "#ffd97d");
  zg.addColorStop(1, "rgba(255, 217, 125, 0)");
  ctx.fillStyle = zg;
  ctx.beginPath();
  ctx.arc(zx, zy, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = "700 13px Manrope, Arial, sans-serif";
  ctx.fillStyle = "#ffd97d";
  ctx.textAlign = "center";
  ctx.fillText("ZURICH HQ · 1946", zx, zy - 12);

  // Subtle global city lights speckle
  const globalHubs: [number, number][] = [
    [51.5, -0.1], [48.8, 2.3], [40.7, -74.0], [35.6, 139.7], [25.2, 55.3],
    [1.3, 103.8], [-33.8, 151.2], [30.0, 31.2], [-26.2, 28.0], [37.7, -122.4],
  ];
  for (const [glat, glon] of globalHubs) {
    const [gx, gy] = llToXY(glat, glon, W, H);
    const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 9);
    gg.addColorStop(0, "#ffffff");
    gg.addColorStop(0.4, "#5ad2ff");
    gg.addColorStop(1, "rgba(7, 153, 232, 0)");
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(gx, gy, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function earthCloudsTexture(): THREE.CanvasTexture {
  const W = 1024;
  const H = 512;
  const { c, ctx } = makeCanvas(W, H);
  ctx.clearRect(0, 0, W, H);

  for (let i = 0; i < 160; i++) {
    const x = Math.random() * W;
    const y = (0.12 + Math.random() * 0.76) * H;
    const rx = 25 + Math.random() * 85;
    const ry = 8 + Math.random() * 24;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rx);
    const a = 0.06 + Math.random() * 0.14;
    g.addColorStop(0, `rgba(235, 246, 255, ${a})`);
    g.addColorStop(0.55, `rgba(200, 230, 255, ${a * 0.5})`);
    g.addColorStop(1, "rgba(200, 230, 255, 0)");
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(1, ry / rx);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Detailed circular satellite/topographic overlay for Pune, Maharashtra. */
export function puneTerrainTexture(scale = 1): THREE.CanvasTexture {
  const S = 1024;
  const { c, ctx } = makeCanvas(S * scale, S * scale);
  ctx.scale(scale, scale);
  const cx = S / 2;
  const cy = S / 2;

  // --- Realistic night-satellite look: earthy terrain base fading into the globe ---
  const baseGrad = ctx.createRadialGradient(cx, cy, 40, cx, cy, S * 0.48);
  baseGrad.addColorStop(0, "rgba(34, 32, 24, 0.96)");
  baseGrad.addColorStop(0.55, "rgba(30, 30, 22, 0.88)");
  baseGrad.addColorStop(0.82, "rgba(26, 28, 22, 0.35)");
  baseGrad.addColorStop(1, "rgba(26, 28, 22, 0)");
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.49, 0, Math.PI * 2);
  ctx.fill();

  // Clip to circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, S * 0.46, 0, Math.PI * 2);
  ctx.clip();

  // Terrain mottling — dark olive/brown patches (Sahyadri hills west & south)
  const rand = (() => {
    let s = 42;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();
  for (let i = 0; i < 160; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.pow(rand(), 0.6) * S * 0.44;
    const px = cx + Math.cos(a) * d;
    const py = cy + Math.sin(a) * d;
    const r = 14 + rand() * 46;
    const westBias = px < cx - 60 || py > cy + 120;
    const g = ctx.createRadialGradient(px, py, 0, px, py, r);
    const tone = westBias
      ? `rgba(${38 + (rand() * 14) | 0}, ${44 + (rand() * 12) | 0}, ${26 + (rand() * 8) | 0},`
      : `rgba(${52 + (rand() * 16) | 0}, ${46 + (rand() * 12) | 0}, ${34 + (rand() * 10) | 0},`;
    g.addColorStop(0, `${tone} ${0.16 + rand() * 0.2})`);
    g.addColorStop(1, `${tone} 0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mula-Mutha River — dark, subtly reflective, no neon
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx - 380, cy - 110);
  ctx.bezierCurveTo(cx - 180, cy - 40, cx - 80, cy + 45, cx + 10, cy + 10);
  ctx.bezierCurveTo(cx + 120, cy - 30, cx + 220, cy + 35, cx + 390, cy - 15);
  ctx.strokeStyle = "rgba(22, 36, 44, 0.9)";
  ctx.lineWidth = 11;
  ctx.stroke();
  ctx.strokeStyle = "rgba(96, 132, 148, 0.4)";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Pavana / Mula northern tributary
  ctx.beginPath();
  ctx.moveTo(cx - 290, cy - 280);
  ctx.quadraticCurveTo(cx - 110, cy - 120, cx + 10, cy + 10);
  ctx.strokeStyle = "rgba(24, 38, 46, 0.85)";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.restore();

  // City light field — warm sodium-lamp clusters, dense near the centre
  for (let i = 0; i < 2600; i++) {
    const a = rand() * Math.PI * 2;
    const d = Math.pow(rand(), 1.7) * S * 0.42;
    const px = cx + Math.cos(a) * d;
    const py = cy + Math.sin(a) * d * 0.92;
    const warm = rand();
    ctx.fillStyle =
      warm > 0.82
        ? `rgba(255, 244, 214, ${0.28 + rand() * 0.3})`
        : `rgba(255, ${190 + (rand() * 40) | 0}, ${140 + (rand() * 40) | 0}, ${0.14 + rand() * 0.28})`;
    const r = rand() * 1.7 + 0.5;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Arterial highways — faint warm threads, no neon
  const arteries: [number, number, number, number][] = [
    [cx - 340, cy - 310, cx, cy],
    [cx, cy, cx + 340, cy - 190],
    [cx, cy, cx + 350, cy + 160],
    [cx, cy, cx - 40, cy + 360],
    [cx, cy, cx - 320, cy + 80],
  ];
  ctx.save();
  for (const [x1, y1, x2, y2] of arteries) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(210, 180, 140, 0.18)";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.restore();

  // tiny pin at the hub — a location marker, not a radar ring
  const pin = ctx.createRadialGradient(cx, cy, 0, cx, cy, 14);
  pin.addColorStop(0, "rgba(255, 236, 210, 0.7)");
  pin.addColorStop(0.45, "rgba(232, 200, 150, 0.28)");
  pin.addColorStop(1, "rgba(232, 200, 150, 0)");
  ctx.fillStyle = pin;
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  // City district labels — quiet map annotations
  ctx.font = "600 15px Manrope, Arial, sans-serif";
  ctx.fillStyle = "rgba(236, 232, 220, 0.45)";
  ctx.textAlign = "center";
  ctx.fillText("SHIVAJINAGAR", cx - 85, cy - 75);
  ctx.fillText("KOREGAON PARK", cx + 115, cy - 55);
  ctx.fillText("DECCAN GYMKHANA", cx - 95, cy + 70);
  ctx.fillText("VIMAN NAGAR", cx + 165, cy - 125);
  ctx.fillText("KOTHRUD", cx - 190, cy + 35);

  ctx.font = "700 22px Playfair Display, Georgia, serif";
  ctx.fillStyle = "rgba(236, 230, 214, 0.7)";
  ctx.fillText("PUNE · MAHARASHTRA", cx, cy + 150);
  ctx.font = "600 13px Manrope, Arial, sans-serif";
  ctx.fillStyle = "rgba(220, 214, 200, 0.5)";
  ctx.fillText("ABTC & CIDESCO ACADEMIC CLUSTER", cx, cy + 174);

  ctx.restore();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Soft multi-lobe volumetric cloud puff texture for the 3D cloud deck. */
export function cloudPuffTexture(): THREE.CanvasTexture {
  const S = 512;
  const { c, ctx } = makeCanvas(S, S);
  const rand = (() => {
    let s = 7;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();

  // billowing top lobes — many small irregular tufts build a cumulus silhouette
  const tufts: [number, number, number, number][] = [];
  for (let i = 0; i < 26; i++) {
    const t = i / 26;
    const x = 70 + t * 372 + (rand() - 0.5) * 40;
    const lift = Math.sin(t * Math.PI); // taller in the middle
    const y = 300 - lift * (70 + rand() * 60);
    const r = 34 + rand() * 46 * (0.6 + lift * 0.6);
    tufts.push([x, y, r, 0.22 + rand() * 0.22]);
  }
  // flat, slightly shaded base
  for (let i = 0; i < 10; i++) {
    tufts.push([90 + i * 37, 318 + rand() * 10, 44 + rand() * 24, 0.18 + rand() * 0.12]);
  }
  for (const [x, y, r, a] of tufts) {
    const g = ctx.createRadialGradient(x, y - r * 0.22, 2, x, y, r);
    g.addColorStop(0, `rgba(255, 255, 255, ${a})`);
    g.addColorStop(0.5, `rgba(246, 248, 250, ${a * 0.6})`);
    g.addColorStop(0.8, `rgba(226, 230, 235, ${a * 0.18})`);
    g.addColorStop(1, "rgba(226, 230, 235, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // grey shading under the base — gives the cloud weight
  for (let i = 0; i < 9; i++) {
    const x = 110 + i * 36 + (rand() - 0.5) * 18;
    const y = 336 + rand() * 8;
    const r = 36 + rand() * 20;
    const g = ctx.createRadialGradient(x, y, 2, x, y, r);
    g.addColorStop(0, "rgba(148, 152, 160, 0.16)");
    g.addColorStop(1, "rgba(148, 152, 160, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function glowSprite(color = "7,153,232"): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.22, `rgba(${color},0.9)`);
  g.addColorStop(0.55, `rgba(${color},0.28)`);
  g.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function marbleFloorTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(512, 512);
  const n = 4;
  const s = 512 / n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const v = 242 + Math.floor(Math.random() * 8);
      ctx.fillStyle = `rgb(${v},${v + 2},${v + 6})`;
      ctx.fillRect(i * s, j * s, s, s);

      // Subtle marble veining
      ctx.strokeStyle = "rgba(23, 20, 91, 0.055)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(i * s + 12, j * s + 24);
      ctx.bezierCurveTo(
        i * s + s * 0.4,
        j * s + s * 0.2,
        i * s + s * 0.6,
        j * s + s * 0.8,
        i * s + s - 10,
        j * s + s - 18
      );
      ctx.stroke();

      const g = ctx.createLinearGradient(i * s, j * s, i * s + s, j * s + s);
      g.addColorStop(0, "rgba(255,255,255,0.16)");
      g.addColorStop(1, "rgba(7,153,232,0.03)");
      ctx.fillStyle = g;
      ctx.fillRect(i * s, j * s, s, s);
    }
  }
  ctx.strokeStyle = "rgba(180, 195, 220, 0.65)";
  ctx.lineWidth = 2;
  for (let k = 0; k <= n; k++) {
    ctx.beginPath();
    ctx.moveTo(k * s, 0);
    ctx.lineTo(k * s, 512);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, k * s);
    ctx.lineTo(512, k * s);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function paverTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(256, 256);
  ctx.fillStyle = "#cbd5e1";
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 4; x++) {
      const off = y % 2 ? 32 : 0;
      const v = 212 + Math.floor(Math.random() * 18);
      ctx.fillStyle = `rgb(${v - 4},${v},${v + 8})`;
      ctx.fillRect(x * 64 + off + 2, y * 32 + 2, 60, 28);
      ctx.fillRect(x * 64 + off - 256 + 2, y * 32 + 2, 60, 28);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Architectural exterior fascia signboard for the ABTC India Building. */
export function abtcSignTexture(): { tex: THREE.CanvasTexture; redraw: () => void } {
  const { c, ctx } = makeCanvas(2048, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const redraw = () => {
    const g = ctx.createLinearGradient(0, 0, 2048, 512);
    g.addColorStop(0, "#15161c");
    g.addColorStop(0.5, "#23252e");
    g.addColorStop(1, "#15161c");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 2048, 512);

    // Double gold architectural frame — brass on dark stone
    ctx.strokeStyle = "#d8b367";
    ctx.lineWidth = 8;
    ctx.strokeRect(24, 24, 2000, 464);
    ctx.strokeStyle = "rgba(216, 179, 103, 0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(42, 42, 1964, 428);

    // Left circular CIDESCO emblem motif
    ctx.save();
    ctx.translate(220, 256);
    ctx.strokeStyle = "#d8b367";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(216, 179, 103, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#f4efe6";
    ctx.font = "700 44px Playfair Display, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("ABTC", 0, -14);
    ctx.fillStyle = "#d8b367";
    ctx.font = "700 22px Manrope, Arial, sans-serif";
    ctx.fillText("INDIA", 0, 26);
    ctx.restore();

    // Right circular CIDESCO 1946 motif
    ctx.save();
    ctx.translate(1828, 256);
    ctx.strokeStyle = "#d8b367";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(0, 0, 110, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#d8b367";
    ctx.font = "700 32px Playfair Display, Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("CIDESCO", 0, -14);
    ctx.fillStyle = "#e9e4d8";
    ctx.font = "600 20px Manrope, Arial, sans-serif";
    ctx.fillText("ZURICH · 1946", 0, 26);
    ctx.restore();

    // Center typography
    ctx.textAlign = "center";
    ctx.fillStyle = "#d8b367";
    ctx.font = "700 30px Manrope, Arial, sans-serif";
    ctx.fillText("INDIAN SECTION OF CIDESCO INTERNATIONAL · REG. NO. FI1552", 1024, 125);

    ctx.fillStyle = "#f7f3ea";
    ctx.font = "700 132px Playfair Display, Georgia, serif";
    ctx.fillText("ABTC INDIA", 1024, 285);

    ctx.fillStyle = "#cfc7b4";
    ctx.font = "600 36px Manrope, Arial, sans-serif";
    ctx.fillText("ASSOCIATION OF BEAUTY THERAPY & COSMETOLOGY", 1024, 385);

    tex.needsUpdate = true;
  };
  redraw();
  return { tex, redraw };
}

/** Backlit interior feature plaque inside the ABTC Master Sanctuary. */
export function sanctuarySealTexture(): { tex: THREE.CanvasTexture; redraw: () => void } {
  const { c, ctx } = makeCanvas(1024, 512);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const redraw = () => {
    const g = ctx.createLinearGradient(0, 0, 1024, 512);
    g.addColorStop(0, "#05033a");
    g.addColorStop(0.5, "#17145B");
    g.addColorStop(1, "#05033a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 512);

    ctx.strokeStyle = "#ffd97d";
    ctx.lineWidth = 6;
    ctx.strokeRect(20, 20, 984, 472);
    ctx.strokeStyle = "rgba(7, 153, 232, 0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, 956, 444);

    // Emblem rings
    ctx.strokeStyle = "#ffd97d";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(512, 145, 115, 62, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "700 44px Playfair Display, Georgia, serif";
    ctx.fillText("ABTC · CIDESCO", 512, 158);

    ctx.fillStyle = "#ffd97d";
    ctx.font = "700 22px Manrope, Arial, sans-serif";
    ctx.fillText("THE WORLD STANDARD IN BEAUTY & WELLNESS EDUCATION", 512, 268);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 56px Playfair Display, Georgia, serif";
    ctx.fillText("Master Aesthetic Sanctuary", 512, 345);

    ctx.fillStyle = "#7ce0ff";
    ctx.font = "600 22px Manrope, Arial, sans-serif";
    ctx.fillText("ZURICH 1946  ·  INDIA 1985  ·  PUNE & MUMBAI", 512, 415);

    tex.needsUpdate = true;
  };
  redraw();
  return { tex, redraw };
}

/** Framed accreditation charter for the Hall of Honour wall. */
export function charterTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(512, 640);
  ctx.fillStyle = "#fcfaf5";
  ctx.fillRect(0, 0, 512, 640);
  ctx.strokeStyle = "#c8a248";
  ctx.lineWidth = 18;
  ctx.strokeRect(16, 16, 480, 608);
  ctx.strokeStyle = "#17145B";
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, 428, 556);

  ctx.fillStyle = "#17145B";
  ctx.textAlign = "center";
  ctx.font = "700 28px Playfair Display, Georgia, serif";
  ctx.fillText("CIDESCO INTERNATIONAL", 256, 120);
  ctx.fillStyle = "#0799E8";
  ctx.font = "700 18px Manrope, Arial, sans-serif";
  ctx.fillText("ZURICH · SWITZERLAND", 256, 155);

  ctx.fillStyle = "#17145B";
  ctx.font = "italic 600 34px Playfair Display, Georgia, serif";
  ctx.fillText("Official National Charter", 256, 240);

  ctx.fillStyle = "#474650";
  ctx.font = "500 18px Manrope, Arial, sans-serif";
  ctx.fillText("Association of Beauty Therapy", 256, 310);
  ctx.fillText("& Cosmetology (India)", 256, 338);
  ctx.fillText("Registered No. FI1552", 256, 380);

  // Gold wax seal
  ctx.fillStyle = "#d4af37";
  ctx.beginPath();
  ctx.arc(256, 490, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#17145B";
  ctx.lineWidth = 2;
  ctx.stroke();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function mirrorTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(256, 320);
  const g = ctx.createLinearGradient(0, 0, 256, 320);
  g.addColorStop(0, "#eef5fc");
  g.addColorStop(0.5, "#d2e4f6");
  g.addColorStop(1, "#b4cde6");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 320);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.beginPath();
  ctx.moveTo(145, 0);
  ctx.lineTo(198, 0);
  ctx.lineTo(62, 320);
  ctx.lineTo(12, 320);
  ctx.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Equirectangular deep-space sky: cobalt-navy field, soft nebula, fine magnitude-scaled stars. */
export function spaceSkyTexture(): THREE.CanvasTexture {
  const W = 4096;
  const H = 2048;
  const { c, ctx } = makeCanvas(W, H);
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#01030c");
  bg.addColorStop(0.5, "#020717");
  bg.addColorStop(1, "#01030c");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const rand = (() => {
    let s = 901;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();

  // wide, very soft nebula haze — cobalt, never grey, never banded
  const haze = (x: number, y: number, r: number, rgb: string, a: number) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, `rgba(${rgb}, ${a})`);
    g.addColorStop(0.5, `rgba(${rgb}, ${a * 0.4})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  };
  for (let i = 0; i < 22; i++) haze(rand() * W, rand() * H, 260 + rand() * 520, "8, 32, 110", 0.05 + rand() * 0.06);
  for (let i = 0; i < 9; i++) haze(rand() * W, rand() * H, 200 + rand() * 360, "30, 76, 190", 0.025 + rand() * 0.035);
  // faint violet hint so the blue has depth
  for (let i = 0; i < 4; i++) haze(rand() * W, rand() * H, 300 + rand() * 300, "50, 30, 120", 0.025);

  // fine star field: lots of tiny stars, a handful of brighter ones with a soft halo
  for (let i = 0; i < 7500; i++) {
    const x = rand() * W;
    const y = rand() * H;
    const mag = Math.pow(rand(), 5);
    const r = 0.3 + mag * 1.05;
    const t = rand();
    const a = 0.2 + mag * 0.8;
    ctx.fillStyle =
      t > 0.92 ? `rgba(255, 232, 205, ${a})` : t < 0.35 ? `rgba(180, 208, 255, ${a})` : `rgba(240, 246, 255, ${a})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    if (mag > 0.55) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, `rgba(200, 224, 255, ${0.22 * mag})`);
      g.addColorStop(1, "rgba(200, 224, 255, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 5, y - r * 5, r * 10, r * 10);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

/** Warm ashlar limestone for the ABTC academy facade. */
export function limestoneTexture(scale = 1): THREE.CanvasTexture {
  const S = 512;
  const { c, ctx } = makeCanvas(S * scale, S * scale);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#d5cfc2";
  ctx.fillRect(0, 0, S, S);

  const rand = (() => {
    let s = 19;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();

  // grain
  for (let i = 0; i < 2800; i++) {
    const x = rand() * S;
    const y = rand() * S;
    const v = 175 + ((rand() * 50) | 0);
    ctx.fillStyle = `rgba(${v}, ${v - 12}, ${v - 32}, ${0.08 + rand() * 0.18})`;
    ctx.fillRect(x, y, 1 + rand() * 2.5, 1 + rand() * 2.5);
  }

  // ashlar courses — large stone blocks, not plank siding
  const rowH = 86;
  for (let y = 0; y < S; y += rowH) {
    ctx.fillStyle = "rgba(110, 102, 90, 0.28)";
    ctx.fillRect(0, y, S, 2);
    const offset = ((y / rowH) | 0) % 2 === 0 ? 0 : 90;
    for (let x = offset; x < S + 180; x += 180) {
      ctx.fillRect(x, y, 2, rowH);
    }
  }

  // weathering streaks
  for (let i = 0; i < 40; i++) {
    const x = rand() * S;
    const g = ctx.createLinearGradient(x, 0, x, S);
    g.addColorStop(0, "rgba(90, 78, 60, 0)");
    g.addColorStop(0.4, `rgba(90, 78, 60, ${0.04 + rand() * 0.06})`);
    g.addColorStop(1, "rgba(90, 78, 60, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 2 + rand() * 4, S);
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

/** Distant city-block night facade: dark mass with a grid of warm windows. */
export function cityNightTexture(seed = 3): THREE.CanvasTexture {
  const W = 256;
  const H = 512;
  const { c, ctx } = makeCanvas(W, H);
  ctx.fillStyle = "#1a1916";
  ctx.fillRect(0, 0, W, H);

  const rand = (() => {
    let s = seed * 97 + 13;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  })();

  // slight storey banding
  for (let y = 0; y < H; y += 28) {
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, y, W, 1);
  }

  const cols = 5;
  const rows = 16;
  const cw = W / (cols + 1);
  const rh = H / (rows + 2);
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      if (rand() < 0.28) continue; // dark window
      const x = cw * 0.7 + i * cw;
      const y = rh * 1.2 + j * rh;
      const on = rand();
      ctx.fillStyle =
        on > 0.82
          ? "rgba(255, 236, 200, 0.85)"
          : on > 0.45
            ? "rgba(232, 196, 130, 0.55)"
            : "rgba(90, 78, 58, 0.7)";
      ctx.fillRect(x, y, cw * 0.46, rh * 0.48);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
