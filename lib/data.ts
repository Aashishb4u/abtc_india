export const NAV = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About Us", href: "/about" },
      { label: "About CIDESCO", href: "/cidesco" },
    ],
  },
  { label: "Committee", href: "/committee" },
  { label: "Accreditations", href: "/accreditations" },
  { label: "Education", href: "/education" },
  {
    label: "Gallery",
    href: "/gallery",
    children: [
      { label: "ABTC Events", href: "/gallery" },
      { label: "CIDESCO Events", href: "/gallery/cidesco" },
    ],
  },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
] as const;

/* Original files from https://www.abtcindia.com/, saved under /public/images. */
export const IMAGES = {
  logo: "/images/brand/abtc-india-logo.png",
  cidescoLogo: "/images/brand/cidesco-international-logo.png",
  hero: "/images/events/seminar-hall.jpg",
  about: "/images/events/faculty-group.jpg",
  founder: "/images/about/maya-paranjapye-founder-portrait.jpg",
  news: [
    {
      src: "/images/news/abtc-cidesco-accreditation-ceremony.webp",
      alt: "Official accreditation signing ceremony with ABTC India trustees and salon executives",
      caption: "Official accreditation certificate presentation",
    },
    {
      src: "/images/news/abtc-committee-accreditation-meeting.webp",
      alt: "ABTC India executive committee at a conference table during the accreditation ceremony",
      caption: "Committee and executive delegation session",
    },
    {
      src: "/images/news/enrich-salons-cidesco-accreditation.webp",
      alt: "Leadership delegation celebrating the 75 salon CIDESCO accreditation milestone",
      caption: "Felicitation of the Enrich leadership group",
    },
  ],
};

export const AIMS = [
  "The primary aim was, to form a section, registered in India.",
  "To be affiliated with CIDESCO International body.",
  "Bring all the beauty professionals together on a common platform.",
  "To impart knowledge and to educate them to an international level.",
  "To groom aspiring beauty therapists to achieve their goals & make them independent professionals.",
  "To promote ABTC certification for beauty therapists who successfully pass the examination.",
  "Recognition & acceptance of ABTC beyond the boundaries of Maharashtra.",
  "Promoting ABTC & CIDESCO schools in India.",
  "Encouraging corporates to be a part of the ABTC.",
];

export const QUALIFICATIONS = [
  {
    eyebrow: "NATIONAL LEVEL",
    title: "ABTC Certification",
    icon: "badge",
    body: "National certification syllabus developed by leading educators to establish foundational and advanced professional beauty therapy skills throughout India.",
    featured: false,
  },
  {
    eyebrow: "SWISS ACCREDITED",
    title: "CIDESCO Certification",
    icon: "verified",
    body: "Internationally benchmarked certifications recognized across luxury spas & aesthetic medical centres worldwide, adhering to modular standards.",
    featured: true,
  },
  {
    eyebrow: "WORLD STANDARD",
    title: "CIDESCO Diplomas",
    icon: "workspace_premium",
    body: "The prestigious gold-standard qualification headquartered in Zurich, Switzerland, marking the pinnacle of international beauty therapy competence.",
    featured: false,
  },
];

export const MARQUEE = [
  "CIDESCO International",
  "Zurich · 1946",
  "40+ Countries",
  "Reg. No. FI1552",
  "Beauty Therapy & Cosmetology",
  "Swiss Academic Rigor",
];
