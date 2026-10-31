import * as THREE from "three";

/* Extra procedural textures for the refined Earth + Master Aesthetic Sanctuary. */

function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function finish(c: HTMLCanvasElement, srgb = true, repeat = false) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
  }
  t.anisotropy = 8;
  return t;
}

/** Cream porcelain tile: one repeat = one tile, soft veining, hairline grout. */
export function porcelainTileTexture(): THREE.CanvasTexture {
  const S = 1024;
  const { c, ctx } = makeCanvas(S, S);
  const r = seeded(77);
  const g = ctx.createLinearGradient(0, 0, S, S);
  g.addColorStop(0, "#fbf3ea");
  g.addColorStop(0.5, "#f6ece1");
  g.addColorStop(1, "#faf1e7");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, S, S);

  // cloudy mottling
  for (let i = 0; i < 90; i++) {
    const x = r() * S;
    const y = r() * S;
    const rad = 60 + r() * 220;
    const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const warm = r() > 0.5;
    gr.addColorStop(0, warm ? "rgba(236,214,194,0.16)" : "rgba(255,255,255,0.18)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  // faint marble veins
  ctx.lineCap = "round";
  for (let i = 0; i < 9; i++) {
    ctx.strokeStyle = `rgba(206,184,164,${0.1 + r() * 0.12})`;
    ctx.lineWidth = 0.6 + r() * 1.6;
    ctx.beginPath();
    let x = r() * S;
    let y = r() * S;
    ctx.moveTo(x, y);
    for (let k = 0; k < 7; k++) {
      x += (r() - 0.35) * 190;
      y += (r() - 0.5) * 150;
      ctx.quadraticCurveTo(x - 40 + r() * 80, y - 40 + r() * 80, x, y);
    }
    ctx.stroke();
  }
  // grout
  ctx.strokeStyle = "rgba(190,166,146,0.55)";
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, S, S);
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 1.2;
  ctx.strokeRect(3, 3, S - 6, S - 6);
  return finish(c, true, true);
}

/** Vertical walnut grain for the fluted wall panels. */
export function walnutTexture(): THREE.CanvasTexture {
  const W = 256;
  const H = 512;
  const { c, ctx } = makeCanvas(W, H);
  const r = seeded(31);
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "#a9744a");
  g.addColorStop(0.5, "#bd8859");
  g.addColorStop(1, "#a46f46");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const x = r() * W;
    ctx.strokeStyle = r() > 0.5 ? `rgba(92,56,30,${0.05 + r() * 0.16})` : `rgba(226,184,140,${0.05 + r() * 0.12})`;
    ctx.lineWidth = 0.5 + r() * 1.6;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.bezierCurveTo(x + (r() - 0.5) * 12, H * 0.33, x + (r() - 0.5) * 12, H * 0.66, x + (r() - 0.5) * 8, H);
    ctx.stroke();
  }
  return finish(c, true, true);
}

/** Wall plaster with a barely-there tooth so flat peach never looks CG-flat. */
export function plasterTexture(base = "#f3d2c0"): THREE.CanvasTexture {
  const S = 512;
  const { c, ctx } = makeCanvas(S, S);
  const r = seeded(5);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);
  const img = ctx.getImageData(0, 0, S, S);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (r() - 0.5) * 7;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
  for (let i = 0; i < 70; i++) {
    const x = r() * S;
    const y = r() * S;
    const rad = 40 + r() * 160;
    const gr = ctx.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, r() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(180,110,80,0.04)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gr;
    ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  return finish(c, true, true);
}

/** The big navy display on the back wall: "Master Aesthetic Sanctuary". */
export function sanctuaryScreenTexture(): { tex: THREE.CanvasTexture; redraw: () => void } {
  const W = 1536;
  const H = 832;
  const { c, ctx } = makeCanvas(W, H);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 16;

  const redraw = () => {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0b0a52");
    bg.addColorStop(0.5, "#17145b");
    bg.addColorStop(1, "#0a0846");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // soft vignette-lit centre, like a real backlit panel
    const rg = ctx.createRadialGradient(W / 2, H / 2, 40, W / 2, H / 2, W * 0.6);
    rg.addColorStop(0, "rgba(70,70,190,0.30)");
    rg.addColorStop(1, "rgba(0,0,0,0.25)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = "#e3b862";
    ctx.lineWidth = 7;
    ctx.strokeRect(34, 34, W - 68, H - 68);
    ctx.strokeStyle = "rgba(227,184,98,0.55)";
    ctx.lineWidth = 2;
    ctx.strokeRect(58, 58, W - 116, H - 116);

    ctx.textAlign = "center";
    // emblem: ABTC · CIDESCO inside a gold ellipse
    ctx.strokeStyle = "#f0c878";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(W / 2, 205, 215, 70, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 62px 'Playfair Display', Georgia, serif";
    ctx.fillText("ABTC · CIDESCO", W / 2, 226);

    ctx.fillStyle = "#f4cf86";
    ctx.font = "700 27px Manrope, Arial, sans-serif";
    ctx.fillText("THE WORLD STANDARD IN BEAUTY & WELLNESS EDUCATION", W / 2, 350);

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 100px 'Playfair Display', Georgia, serif";
    ctx.fillText("Master Aesthetic Sanctuary", W / 2, 505);

    ctx.fillStyle = "#8be3ff";
    ctx.font = "600 28px Manrope, Arial, sans-serif";
    ctx.fillText("ZURICH 1946   ·   INDIA 1985   ·   PUNE & MUMBAI", W / 2, 640);

    tex.needsUpdate = true;
  };
  redraw();
  return { tex, redraw };
}

/** Minimal continuous-line portrait, framed art for the right wall. */
export function lineArtTexture(variant = 0): THREE.CanvasTexture {
  const W = 400;
  const H = 640;
  const { c, ctx } = makeCanvas(W, H);
  ctx.fillStyle = variant ? "#f6e4d6" : "#f8ebe0";
  ctx.fillRect(0, 0, W, H);
  const gr = ctx.createRadialGradient(W * 0.6, H * 0.3, 20, W / 2, H / 2, W);
  gr.addColorStop(0, "rgba(255,255,255,0.4)");
  gr.addColorStop(1, "rgba(200,150,120,0.14)");
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = "#7a5646";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (variant === 0) {
    ctx.moveTo(170, 60);
    ctx.bezierCurveTo(300, 40, 340, 200, 300, 280);
    ctx.bezierCurveTo(330, 300, 312, 320, 300, 330);
    ctx.bezierCurveTo(318, 350, 296, 372, 290, 380);
    ctx.bezierCurveTo(300, 420, 260, 450, 215, 440);
    ctx.bezierCurveTo(160, 520, 140, 560, 150, 620);
    ctx.moveTo(215, 440);
    ctx.bezierCurveTo(270, 500, 330, 530, 380, 540);
    ctx.moveTo(228, 214);
    ctx.bezierCurveTo(248, 200, 268, 204, 280, 214);
    ctx.moveTo(150, 120);
    ctx.bezierCurveTo(80, 160, 70, 300, 130, 360);
  } else {
    ctx.moveTo(110, 600);
    ctx.bezierCurveTo(90, 460, 120, 380, 200, 340);
    ctx.bezierCurveTo(150, 300, 150, 190, 215, 130);
    ctx.bezierCurveTo(300, 70, 350, 160, 330, 250);
    ctx.bezierCurveTo(325, 300, 290, 330, 262, 342);
    ctx.bezierCurveTo(340, 380, 360, 470, 350, 600);
    ctx.moveTo(228, 224);
    ctx.bezierCurveTo(246, 212, 268, 216, 280, 226);
  }
  ctx.stroke();
  // blush wash shape
  ctx.fillStyle = "rgba(226,150,128,0.22)";
  ctx.beginPath();
  ctx.ellipse(W * 0.62, H * 0.62, 78, 120, 0.3, 0, Math.PI * 2);
  ctx.fill();
  return finish(c);
}

/** Soft contact-shadow blob (alpha only). */
export function shadowBlobTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 64);
  g.addColorStop(0, "rgba(40,20,14,0.62)");
  g.addColorStop(0.5, "rgba(40,20,14,0.26)");
  g.addColorStop(1, "rgba(40,20,14,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return finish(c, false);
}

/** Soft vertical light wash used for wall-grazing LED glow. */
export function ledWashTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(64, 256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, "rgba(255,214,160,0.95)");
  g.addColorStop(0.35, "rgba(255,200,140,0.35)");
  g.addColorStop(1, "rgba(255,190,130,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 256);
  return finish(c);
}

/** Sun starburst: hot core + long horizontal streak + faint diagonals, like a real lens. */
export function starburstTexture(): THREE.CanvasTexture {
  const S = 512;
  const { c, ctx } = makeCanvas(S, S);
  ctx.clearRect(0, 0, S, S);
  ctx.globalCompositeOperation = "lighter";
  const halo = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  halo.addColorStop(0, "rgba(255,255,255,1)");
  halo.addColorStop(0.06, "rgba(255,244,222,0.95)");
  halo.addColorStop(0.2, "rgba(255,206,140,0.38)");
  halo.addColorStop(0.5, "rgba(255,170,100,0.1)");
  halo.addColorStop(1, "rgba(255,150,90,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, S, S);

  const streak = (angle: number, len: number, thick: number, alpha: number) => {
    ctx.save();
    ctx.translate(S / 2, S / 2);
    ctx.rotate(angle);
    const g = ctx.createLinearGradient(-len, 0, len, 0);
    g.addColorStop(0, "rgba(255,230,190,0)");
    g.addColorStop(0.5, `rgba(255,246,228,${alpha})`);
    g.addColorStop(1, "rgba(255,230,190,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, len, thick, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  streak(0, S * 0.5, 5, 0.85);
  streak(Math.PI / 2, S * 0.3, 3.2, 0.5);
  streak(Math.PI / 4, S * 0.26, 2.2, 0.28);
  streak(-Math.PI / 4, S * 0.26, 2.2, 0.28);
  return finish(c);
}

/** Wide, soft atmospheric haze behind the sun for a cinematic bloom. */
export function sunBloomTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(255,236,206,0.55)");
  g.addColorStop(0.3, "rgba(255,190,130,0.22)");
  g.addColorStop(0.65, "rgba(150,190,255,0.08)");
  g.addColorStop(1, "rgba(120,170,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  return finish(c);
}

/** Warm, bright mirror glass: soft peach-to-white gradient with a diagonal sheen. */
export function mirrorSheenTexture(): THREE.CanvasTexture {
  const { c, ctx } = makeCanvas(256, 512);
  const g = ctx.createLinearGradient(0, 0, 256, 512);
  g.addColorStop(0, "#fff4ec");
  g.addColorStop(0.5, "#f4d9cb");
  g.addColorStop(1, "#e9c4b4");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 512);
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.beginPath();
  ctx.moveTo(150, 0);
  ctx.lineTo(214, 0);
  ctx.lineTo(80, 512);
  ctx.lineTo(18, 512);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.moveTo(224, 0);
  ctx.lineTo(240, 0);
  ctx.lineTo(120, 512);
  ctx.lineTo(104, 512);
  ctx.fill();
  return finish(c);
}
