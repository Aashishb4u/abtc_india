// Camera stops & narrative copy for the Earth -> India -> Pune -> Clouds -> ABTC Sanctuary scroll journey.

export type Vec3 = [number, number, number];

/**
 * Relative scroll room per travel leg. The final leg (through the doors into
 * the sanctuary) gets the most, so the arrival glides instead of rushing.
 */
export const SEGMENT_WEIGHTS = [1, 1, 1.15, 1.7];
const CUM: number[] = [0];
for (const w of SEGMENT_WEIGHTS) CUM.push(CUM[CUM.length - 1] + w);
const TOTAL_W = CUM[CUM.length - 1];

/** Map raw scroll progress (0..1) to a float stop index (0..stops-1). */
export function progressToFloatIndex(p: number): number {
  const s = Math.min(1, Math.max(0, p)) * TOTAL_W;
  let i = 0;
  while (i < SEGMENT_WEIGHTS.length - 1 && s > CUM[i + 1]) i++;
  return i + (s - CUM[i]) / SEGMENT_WEIGHTS[i];
}

/** Inverse: scroll progress (0..1) at which a given float stop index sits. */
export function floatIndexToProgress(f: number): number {
  const i = Math.min(SEGMENT_WEIGHTS.length - 1, Math.max(0, Math.floor(f)));
  return (CUM[i] + (f - i) * SEGMENT_WEIGHTS[i]) / TOTAL_W;
}

export interface JourneyStop {
  id: string;
  index: string;
  eyebrow: string;
  location: string;
  coords: string;
  altitude: string;
  title: string;
  body: string;
  facts?: { label: string; value: string }[];
  side: "left" | "right" | "center";
  cam: Vec3;
  look: Vec3;
  fov?: number;
}

export const JOURNEY_STOPS: JourneyStop[] = [
  {
    id: "earth",
    index: "00",
    eyebrow: "CIDESCO International · Global Standard",
    location: "Orbital View · Zurich to India",
    coords: "47.3769° N, 8.5417° E → 18.5204° N, 73.8567° E",
    altitude: "18,400 KM",
    title: "Elevating Beauty & Wellness Worldwide",
    body: "Headquartered in Zurich since 1946 and represented across 40+ nations, CIDESCO sets the gold standard in aesthetics. Scroll to journey from orbit to ABTC India.",
    facts: [
      { label: "Global Network", value: "40+ Countries" },
      { label: "Founded in Zurich", value: "1946" },
    ],
    side: "left",
    cam: [0, 92, 108],
    look: [0, 142, -6],
    fov: 46,
  },
  {
    id: "india",
    index: "01",
    eyebrow: "Indian Section · Reg. No. FI1552",
    location: "Indian Subcontinent",
    coords: "20.5937° N, 78.9629° E · INDIA",
    altitude: "2,650 KM",
    title: "Across the Indian Subcontinent",
    body: "Established in 1985 as the official Indian Section of CIDESCO International, ABTC unites 34+ accredited academies and thousands of certified professionals nationwide.",
    facts: [
      { label: "Accredited Schools", value: "34+ Institutes" },
      { label: "Certified Alumni", value: "2,000+" },
    ],
    side: "right",
    cam: [0, 104.5, 46.7],
    look: [0, 121.0, 23.5],
    fov: 44,
  },
  {
    id: "pune",
    index: "02",
    eyebrow: "Maharashtra · Academic Hub",
    location: "Pune Metropolitan Region",
    coords: "18.5204° N, 73.8567° E · PUNE",
    altitude: "14.2 KM",
    title: "Pune: Heart of Aesthetic Education",
    body: "Nestled beside the Sahyadris, Pune stands at the forefront of India's beauty therapy education — home to premier CIDESCO & ABTC accredited institutes and examiners.",
    facts: [
      { label: "Regional Hub", value: "Pune & Mumbai" },
      { label: "World Standard", value: "Swiss Rigor" },
    ],
    side: "left",
    cam: [0, 116.2, 30.4],
    look: [0, 120.6, 24.2],
    fov: 42,
  },
  {
    id: "building",
    index: "03",
    eyebrow: "Through the Clouds · Campus Arrival",
    location: "ABTC India Academy & Secretariat",
    coords: "18.5204° N, 73.8567° E · CAMPUS PLAZA",
    altitude: "12 M",
    title: "The ABTC India Campus",
    body: "Descending through the clouds to the doors of ABTC India — where aspiring beauty therapists, clinical educators, and international examiners converge under one roof.",
    facts: [
      { label: "National Section", value: "Since 1985" },
      { label: "Examinations", value: "ABTC & CIDESCO" },
    ],
    side: "right",
    cam: [-2.2, 4.3, 23.5],
    look: [0, 4.5, 5.5],
    fov: 48,
  },
  {
    id: "sanctuary",
    index: "04",
    eyebrow: "Inside ABTC · The Aesthetic Sanctuary",
    location: "Master Clinical & Examination Studio",
    coords: "INTERIOR · HALL OF EXCELLENCE",
    altitude: "GROUND LEVEL",
    title: "Where Mastery Takes Shape",
    body: "Welcome inside ABTC's clinical aesthetic studio and examination hall — crafted for hands-on skin science, advanced cosmetology, and internationally recognised diplomas.",
    facts: [
      { label: "Qualification", value: "CIDESCO Diploma" },
      { label: "Recognition", value: "Global" },
    ],
    side: "center",
    cam: [0.0, 1.72, -1.6],
    look: [0.0, 1.38, -9.2],
    fov: 54,
  },
];
