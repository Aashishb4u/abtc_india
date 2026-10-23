import { readFileSync, writeFileSync } from "node:fs";

const catalog = JSON.parse(readFileSync("public/images/catalog.json", "utf8"));
const first = (part) => {
  const key = Object.keys(catalog).find((k) => k.includes(part));
  const src = catalog[key]?.[0];
  if (!src) throw new Error("missing " + part);
  return src;
};

function swap(file, sources) {
  let text = readFileSync(file, "utf8");
  let i = 0;
  text = text.replace(/https:\/\/lh3\.googleusercontent\.com\/[^"]+/g, () => {
    const next = sources[i++];
    if (!next) throw new Error("ran out of sources in " + file);
    return next;
  });
  if (i !== sources.length) throw new Error(`${file} replaced ${i} expected ${sources.length}`);
  writeFileSync(file, text);
  console.log(file, i);
}

swap("components/pages/GalleryPage.tsx", [
  first("free-beauty-course"),
  first("abtc-grand-seminar"),
  first("kakinada"),
  first("refreshre-course"),
  first("examiners-practical-exam-01-09-18"),
  first("examiners-practical-exam-31-08"),
  first("examiners-written-exam"),
  first("1st-january-2018"),
  first("30th-january-2017"),
  first("16th-december-2016"),
  first("22nd-april-2016"),
  first("1st-october-2015"),
  first("11th-august-2015"),
  first("5th-august-2015"),
  first("17th-may-2015"),
  first("20th-january-2014"),
  first("association-of-beauty-thearpy"),
  first("cidesco-section-india-exam-sept-2013"),
  first("the-abtc-activities-1990-2000"),
]);

swap("components/pages/AboutPage.tsx", [
  "/images/about/about-us-jone-thornicroft.jpg",
  "/images/about/maya-paranjapye-founder-portrait.jpg",
]);

swap("components/pages/CidescoPage.tsx", [first("65th-cidesco-world-congress")]);

swap("components/pages/CidescoEventsPage.tsx", [
  "/images/brand/cidesco-international-logo.png",
  first("65th-cidesco-world-congress"),
  first("cultural-evening"),
  first("international-schools-meeting"),
  first("cidesco-examiners-meet"),
  first("wuhan-2013"),
  first("cidesco-section-india-exam-sept-2013"),
  first("cidesco-national-division-conference"),
  first("formation-of-national-cidesco-division"),
  first("the-cidesco-exams"),
  first("india-as-a-cidesco-section"),
  first("the-history-of-cidesco-from-1985-1995"),
]);
