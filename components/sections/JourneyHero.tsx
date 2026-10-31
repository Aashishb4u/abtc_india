"use client";

import { useEffect, useRef, useState } from "react";
import { JOURNEY_STOPS, floatIndexToProgress, progressToFloatIndex } from "@/lib/journey/stops";
import type { JourneyScene } from "@/lib/journey/scene";
import { ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

/**
 * Scroll-driven 3D journey hero: Earth -> India -> Pune -> through the clouds
 * to the ABTC campus -> inside the sanctuary.
 *
 * A tall "track" section gives scroll room; the canvas stays pinned (sticky)
 * while the site-wide Lenis + ScrollTrigger convert scroll position into 0..1
 * progress, which the Three.js scene turns into a smooth camera flight.
 */

// One viewport per stop keeps the scroll story deliberate without making the
// opening feel like an obstacle before visitors can reach the rest of the site.
const VH_PER_STOP = 100;

export function JourneyHero() {
  const trackRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const railBarRef = useRef<HTMLSpanElement>(null);
  const sceneRef = useRef<JourneyScene | null>(null);
  const [ready, setReady] = useState(false);
  const [noGL, setNoGL] = useState(false);
  const [stage, setStage] = useState({ index: 0, settled: true });

  useEffect(() => {
    let disposed = false;
    const cleanups: (() => void)[] = [];

    (async () => {
      const canvas = canvasRef.current;
      const track = trackRef.current;
      if (!canvas || !track) return;

      // WebGL check: fall back to a static hero instead of a blank screen
      const probe = document.createElement("canvas");
      if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) {
        setNoGL(true);
        return;
      }

      const { createJourneyScene } = await import("@/lib/journey/scene");
      if (disposed) return;

      const lowPower =
        window.matchMedia("(max-width: 768px)").matches ||
        ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <= 4;

      const scene = createJourneyScene(canvas, { lowPower, onReady: () => setReady(true) });
      sceneRef.current = scene;

      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        pin: stickyRef.current ?? ".jh-sticky",
        pinSpacing: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          scene.setProgress(self.progress);
          const journeyPosition = progressToFloatIndex(self.progress);
          const index = Math.round(journeyPosition);
          const settled = Math.abs(journeyPosition - index) < 0.46;
          setStage((current) =>
            current.index === index && current.settled === settled ? current : { index, settled }
          );
          if (railBarRef.current) {
            railBarRef.current.style.transform = `scaleY(${Math.min(1, journeyPosition / (JOURNEY_STOPS.length - 1))})`;
          }
        },
      });

      // Recalculate ScrollTrigger markers and pinning with actual layout
      ScrollTrigger.refresh();

      const visibility = new IntersectionObserver(([entry]) => {
        scene.setActive(entry.isIntersecting);
      });
      visibility.observe(track);

      const onMove = (e: PointerEvent) => {
        scene.setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
      };
      const onResize = () => {
        scene.resize();
        ScrollTrigger.refresh();
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", onResize);

      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        visibility.disconnect();
        st.kill();
        scene.dispose();
        sceneRef.current = null;
      });
    })();

    return () => {
      disposed = true;
      cleanups.forEach((f) => f());
    };
  }, []);

  const n = JOURNEY_STOPS.length - 1;
  const active = stage.index;
  const visible = stage.settled;

  const goTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.offsetTop + (track.offsetHeight - window.innerHeight) * floatIndexToProgress(i);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(top, { duration: 1.45 });
    else window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      ref={trackRef}
      className="jh-track -mt-6"
      style={{ height: `${JOURNEY_STOPS.length * VH_PER_STOP}svh` }}
      aria-label="Journey from Earth orbit to ABTC India"
    >
      <div ref={stickyRef} className="jh-sticky">
        <canvas ref={canvasRef} className={`jh-canvas ${ready ? "is-ready" : ""}`} aria-hidden="true" />

        {!ready && !noGL && (
          <div className="jh-loader" role="status">
            <span className="jh-loader-orb" />
            <span>Entering orbit…</span>
          </div>
        )}
        {noGL && <div className="jh-fallback" />}

        {/* narrative cards */}
        {JOURNEY_STOPS.map((s, i) => {
          const on = i === active && (visible || noGL) && (ready || noGL);
          return (
            <article
              key={s.id}
              className={`jh-card side-${s.side} ${i === 0 ? "is-intro" : ""} ${i === n ? "is-outro" : ""} ${on ? "is-on" : ""}`}
              aria-hidden={!on}
            >
              <p className="jh-eyebrow">
                {i > 0 && <span className="jh-num">{s.index}</span>}
                {s.eyebrow}
              </p>
              {i === 0 ? <h1 className="jh-title">{s.title}</h1> : <h2 className="jh-title">{s.title}</h2>}
              <p className="jh-body">{s.body}</p>
              {s.facts && (
                <dl className="jh-facts">
                  {s.facts.map((f) => (
                    <div key={f.label}>
                      <span className="material-symbols-outlined jh-fact-icon" aria-hidden="true">
                        {f.label.toLowerCase().includes("global")
                          ? "public"
                          : f.label.toLowerCase().includes("founded")
                            ? "account_balance"
                            : f.label.toLowerCase().includes("recognition")
                              ? "verified"
                              : f.label.toLowerCase().includes("alumni")
                                ? "groups"
                                : "school"}
                      </span>
                      <span className="jh-fact-copy">
                        <dt>{f.label}</dt>
                        <dd>{f.value}</dd>
                      </span>
                    </div>
                  ))}
                </dl>
              )}
              <p className="jh-hud" aria-hidden>
                <span>{s.location}</span>
                <span>{s.coords}</span>
                <span>ALT {s.altitude}</span>
              </p>
              {i === 0 && (
                <button className="jh-btn jh-btn-ghost" onClick={() => goTo(1)} tabIndex={on ? 0 : -1}>
                  Begin the descent <span aria-hidden>↓</span>
                </button>
              )}
              {i === n && (
                <div className="jh-cta-row">
                  <a className="jh-btn jh-btn-primary" href="#about" tabIndex={on ? 0 : -1}>
                    Discover ABTC India
                  </a>
                  <a className="jh-btn jh-btn-ghost" href="/contact" tabIndex={on ? 0 : -1}>
                    Contact us
                  </a>
                </div>
              )}
            </article>
          );
        })}

        {/* progress rail */}
        <nav className="jh-rail" aria-label="Journey scenes">
          {JOURNEY_STOPS.map((s, i) => (
            <button
              key={s.id}
              className={`jh-rail-item ${i === active ? "is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-current={i === active ? "step" : undefined}
              aria-label={`${s.index} ${s.location}`}
            >
              <span className="jh-rail-num">{s.index}</span>
              <span className="jh-rail-label">{s.location}</span>
              <span className="jh-rail-arrow" aria-hidden="true">›</span>
            </button>
          ))}
          <span ref={railBarRef} className="jh-rail-bar" />
        </nav>

        <button
          type="button"
          onClick={() => goTo(1)}
          className={`jh-scroll-hint ${stage.index > 0 || !stage.settled ? "is-hidden" : ""}`}
          aria-label="Scroll down to begin journey"
        >
          <span className="jh-mouse-pill" aria-hidden="true">
            <span className="jh-mouse-wheel" />
          </span>
          <span className="jh-arrow-stack" aria-hidden="true">
            <span className="jh-arrow jh-arrow-1">
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            <span className="jh-arrow jh-arrow-2">
              <svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L6 6L11 1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </span>
          <span className="jh-scroll-text">Scroll to explore</span>
        </button>
      </div>
    </section>
  );
}
