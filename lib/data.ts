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

/* Replace these with local files in /public (e.g. "/images/hero.jpg") for production. */
export const IMAGES = {
  hero: "https://lh3.googleusercontent.com/aida/AEtjO1UIhzsnAAPGfzH5p-sZujK4_ckZ6z_vg86--24zp3kYpCm88N5FtGCp-xjq-UOmYMGEumcnOptAUM4-_PUTu6go0nxyJmoBEpBHs_jZlDVf6j3mtxQ7gKUuZDLMoGTlVUcUZFv5vNvgeRy2vHJmkDV6UKl7KYBxFp2L-FRtXbWX5vHzf-sLVaqRSkuhI7KJGKaUr31rfChTvh36n6i3bvQm4fGU5ODtHQf-58rK84QNFocwZ2iQqRkWpz0",
  about:
    "https://lh3.googleusercontent.com/aida/AEtjO1VKclp62NhlPw9o01p3QTi7Mix2p2_BjzDxvE0Li4yhloMaYNSnMnLKmAQdkvkHIl0ub8FCiw35eyTIOtaGMbxCyfax27mgtPFT3ETJ6cXfMWZ5CgU7q5Am77WUu88V1mobKuNcyfWgrXoQmIOtD-1Zz0-1SudZzJcDoRdNzQHYzkdJltzBCdqvTyw-_qyeoojIuLnfFJZzNSPzhJdMGWfHran2i-5TmLnugprsYXbXXpNhCOVhOU7CEdGD",
  news: [
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwHMmTnxivwi0w6NPV7TwwEckJ18GYVniKpQzGT5aOydlAqbG8XZz2zExonThRQfTPpPL9GC2OTyTjSE3EF2jccFzowv_mVau0QfuEBKH_k2e52fnNRl5lzBn88sBjJ4uxJ-E2H-AcTGPvyiOQUDl-TJsXsFSGyFvs5weNrmSjdTTIGoD9xb_arJcll_s2UKZ0QiEPdXtsDibCgMGH1OsHnDZLBRQFsZMl2k9CrmhOR8J01_hLcZ2EVg",
      alt: "Official accreditation signing ceremony with ABTC India trustees and salon executives",
      caption: "Official accreditation certificate presentation",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAjkQEKd3cUcTeQqCnngiPIUdlhTdwjmyhzWfHWr55nvuALq0yAIDVvKZFN2-IlPWnY3FMD3jKyHa-1ra8JoytwkfcvjFOGbvSzi51LmsSX-lsv8rjMql-ms6HiLN0zwVmvwbWMI96sHQYhkqjZGcv-HKiaRQlDK5OROKU3p50PisOy8B8lbTYrhRtGaHSpFCYplC_ORzT__5ylDv88dhZASyoJ_aAwDyo4Lo8Ks-A-RO36U7MQw0lb6g",
      alt: "ABTC India executive committee at a conference table during the accreditation ceremony",
      caption: "Committee and executive delegation session",
    },
    {
      src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC-o2XWVJtSoW4wRKQEKcKE-OR7vcwlDTHw2kKjsGJlobsHOVXkWNdp72L2vE4g9MAiBTk54ScHrNaVgJHref2QRwfcsYTB0ymFf39FK2rFn2gjJ6MN_trjohyMuUPTkqPibGLUaJq5kG3JV8UavxUC4J68KP4aXZ_N4M_HBYXQVuAMs_5v2r4gJE-k1lBfi3NIN6rX0F676gYz38WktZhjXZACm-ZPA7_l6E6CUHCL-vwZxlnSilsF0w",
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
