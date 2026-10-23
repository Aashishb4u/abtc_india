# ABTC India — Next.js homepage

Next.js 15 (App Router) · TypeScript · Tailwind CSS 3 · GSAP (ScrollTrigger + SplitText) · Framer Motion · Lenis

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Motion architecture

| Layer | Tool | Where |
| --- | --- | --- |
| Smooth scroll (synced to GSAP ticker) | Lenis | `components/motion/SmoothScroll.tsx` |
| Cinematic intro / preloader | GSAP timeline | `components/motion/Preloader.tsx` |
| Masked line / word / char text reveals | GSAP SplitText | `components/motion/SplitHeading.tsx` |
| Image clip-path reveal + scroll parallax | GSAP ScrollTrigger | `components/motion/ParallaxImage.tsx` |
| Scroll-scrubbed watermark | GSAP ScrollTrigger | `components/sections/Cidesco.tsx` |
| Cursor follower | gsap.quickTo | `components/motion/Cursor.tsx` |
| Section / stagger reveals | Framer Motion | `components/motion/Reveal.tsx` |
| 3D tilt + spotlight (spring physics) | Framer Motion | `components/motion/TiltCard.tsx` |
| Magnetic CTAs | Framer Motion | `components/motion/Magnetic.tsx` |
| Scroll-velocity marquee | Framer Motion | `components/motion/Marquee.tsx` |
| Header collapse, drawer, nav pill | Framer Motion | `components/layout/*` |

Everything respects `prefers-reduced-motion`; tilt, magnet and cursor are disabled on touch.

## Swapping images

All image URLs live in `lib/data.ts` (`IMAGES`). Put real photos in `public/images/` and point to `/images/…`.

## Routes

Nav links point to `/committee`, `/accreditations`, `/education`, `/gallery`, `/faq` and `/contact`. Only `/` is built here.
