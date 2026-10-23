import { mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "public", "images");
const sitemap = "https://www.abtcindia.com/wp-sitemap-posts-page-1.xml";
const skip = [
  "checkout",
  "login",
  "register",
  "shop",
  "cart",
  "products",
  "booking",
  "user-profile",
  "my-account",
  "etn",
  "performers",
  "venues",
  "all-events",
  "event-types",
  "submit-event",
  "event-organizers",
];
const resized = /-\d+x\d+\.(jpg|jpeg|png|webp|gif)$/i;
const image = /\.(jpg|jpeg|png|webp|gif)$/i;
const seo = {
  "logo-left.png": "brand/abtc-india-logo.png",
  "logo-right.png": "brand/cidesco-international-logo.png",
  "late-mayaji.jpg": "about/maya-paranjapye-founder-portrait.jpg",
  "img-1.webp": "news/abtc-cidesco-accreditation-ceremony.webp",
  "img2-1.webp": "news/abtc-committee-accreditation-meeting.webp",
  "img3-1.webp": "news/enrich-salons-cidesco-accreditation.webp",
};

function folderFor(page) {
  const p = new URL(page).pathname;
  if (p === "/" || p === "") return "home";
  if (p.includes("about")) return "about";
  if (p.includes("committee")) return "committee";
  if (p.includes("accred")) return "accreditations";
  if (p.includes("education")) return "education";
  if (p.includes("cidesco")) return "gallery/cidesco";
  if (p.includes("abtc") || p.includes("exam") || p.includes("seminar") || p.includes("beauty")) return "gallery/abtc";
  if (p.includes("faq")) return "faq";
  if (p.includes("contact")) return "contact";
  return "gallery";
}

function pageSlug(page) {
  const p = new URL(page).pathname.replace(/^\/|\/$/g, "");
  return (p || "home").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase();
}

function fileFor(page, url, index) {
  const name = url.replace(/\/$/, "").split("/").pop();
  if (seo[name] && (page.endsWith("abtcindia.com/") || page.endsWith("abtcindia.com"))) return seo[name];
  const ext = path.extname(name).toLowerCase();
  let stem = path.basename(name, path.extname(name)).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const numeric = /^(\d+|img\d*|0\d+)$/.test(stem);
  const base = numeric ? `${pageSlug(page)}-${String(index).padStart(2, "0")}` : `${pageSlug(page)}-${stem}`;
  return `${folderFor(page)}/${base}${ext}`;
}

async function fetchText(url) {
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 ABTC-image-archive" } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const xml = await fetchText(sitemap);
const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)]
  .map((m) => m[1])
  .filter((u) => !skip.some((s) => u.includes(s)));
console.log("pages", locs.length);

const catalog = {};
const saved = new Map();
for (const page of locs) {
  try {
    const html = await fetchText(page);
    const found = html.match(/https:\/\/www\.abtcindia\.com\/wp-content\/uploads\/[^"'\)\s]+/g) || [];
    const seen = new Set();
    let n = 0;
    const local = [];
    for (const raw of found) {
      const clean = raw.split("?")[0];
      if (!image.test(clean) || resized.test(clean) || seen.has(clean)) continue;
      const file = clean.split("/").pop();
      if ((file === "logo-left.png" || file === "logo-right.png") && pageSlug(page) !== "home") continue;
      seen.add(clean);
      n += 1;
      const rel = fileFor(page, clean, n);
      const dest = path.join(out, rel);
      await mkdir(path.dirname(dest), { recursive: true });
      if (!saved.has(clean)) {
        let exists = false;
        try {
          exists = (await stat(dest)).size > 0;
        } catch {
          exists = false;
        }
        if (!exists) {
          const res = await fetch(clean, { headers: { "User-Agent": "Mozilla/5.0 ABTC-image-archive" } });
          if (!res.ok) {
            console.log("MISS", res.status, clean);
            continue;
          }
          await writeFile(dest, Buffer.from(await res.arrayBuffer()));
          console.log("get", rel);
        }
        saved.set(clean, `/images/${rel.replaceAll("\\", "/")}`);
      }
      local.push(saved.get(clean));
    }
    catalog[page] = local;
    console.log(pageSlug(page), local.length);
  } catch (err) {
    console.log("FAIL", page, err.message);
  }
}
await writeFile(path.join(out, "catalog.json"), JSON.stringify(catalog, null, 2));
console.log("files", saved.size);
