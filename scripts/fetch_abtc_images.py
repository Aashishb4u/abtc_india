"""Download original full-size images from abtcindia.com into public/images."""
import os
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "images"
SITEMAP = "https://www.abtcindia.com/wp-sitemap-posts-page-1.xml"
SKIP = (
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
)

# WordPress resized derivatives: name-300x225.jpg
RESIZED = re.compile(r"-\d+x\d+\.(jpg|jpeg|png|webp|gif)$", re.I)
IMAGE = re.compile(r"\.(jpg|jpeg|png|webp|gif)$", re.I)

SEO = {
    "logo-left.png": "brand/abtc-india-logo.png",
    "logo-right.png": "brand/cidesco-international-logo.png",
    "late-mayaji.jpg": "about/maya-paranjapye-founder-portrait.jpg",
    "img-1.webp": "news/abtc-cidesco-accreditation-ceremony.webp",
    "img2-1.webp": "news/abtc-committee-accreditation-meeting.webp",
    "img3-1.webp": "news/enrich-salons-cidesco-accreditation.webp",
}


def slug_from_url(url: str) -> str:
    name = url.rstrip("/").split("/")[-1]
    if name in SEO:
        return SEO[name]
    stem, ext = os.path.splitext(name)
    stem = stem.lower()
    stem = re.sub(r"[^a-z0-9]+", "-", stem).strip("-")
    folder = "gallery"
    low = url.lower()
    if "logo" in stem or "favicon" in stem:
        folder = "brand"
    elif any(k in stem for k in ("maya", "about", "cidesco-logo", "committee")):
        folder = "about"
    return f"{folder}/{stem}{ext.lower()}"


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 ABTC-image-archive"})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read().decode("utf-8", "ignore")


def main() -> None:
    xml = fetch(SITEMAP)
    locs = re.findall(r"<loc>(.*?)</loc>", xml)
    locs = [u for u in locs if not any(s in u for s in SKIP)]
    print(f"pages {len(locs)}")
    urls = set()
    for page in locs:
        try:
            html = fetch(page)
        except Exception as exc:
            print("FAIL", page, exc)
            continue
        found = re.findall(r"https://www\.abtcindia\.com/wp-content/uploads/[^\"')\s]+", html)
        for raw in found:
            clean = raw.split("?")[0]
            if IMAGE.search(clean) and not RESIZED.search(clean):
                urls.add(clean)
    print(f"unique {len(urls)}")
    manifest = []
    for url in sorted(urls):
        rel = slug_from_url(url)
        dest = OUT / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if dest.exists() and dest.stat().st_size > 0:
            print("skip", rel)
        else:
            print("get", rel)
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 ABTC-image-archive"})
            with urllib.request.urlopen(req, timeout=90) as res:
                dest.write_bytes(res.read())
        manifest.append(f"{url}\t/images/{rel.replace(chr(92), '/')}")
    (OUT / "manifest.tsv").write_text("\n".join(manifest) + "\n", encoding="utf-8")
    print("done", len(manifest))


if __name__ == "__main__":
    main()
