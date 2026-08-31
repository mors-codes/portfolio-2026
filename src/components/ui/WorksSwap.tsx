"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export interface WorkItem {
  title: string;
  description: string;
}

interface WorksSwapProps {
  works: WorkItem[];
}

const PANEL_WIDTH_PCT = 45;
const RIGHT_POSITION_PCT = 100 - PANEL_WIDTH_PCT;

export default function WorksSwap({ works }: WorksSwapProps) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [infoOnLeft, setInfoOnLeft] = useState(true);

  const infoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const active = works[index];

  const goTo = (target: number) => {
    if (
      target === index ||
      isTransitioning ||
      !infoRef.current ||
      !cardRef.current ||
      !containerRef.current
    )
      return;

    setIsTransitioning(true);
    const nextInfoOnLeft = !infoOnLeft;

    // The info-slot element and the card-slot element each independently
    // travel through center. Whichever one is currently on the LEFT is
    // heading toward center then out to the RIGHT this transition (and
    // vice versa) — so each element's own path is: current-side -> 50%
    // (shrinking) -> opposite-side (growing), content swapping the
    // instant it passes through center.
    const infoTravelsToRight = infoOnLeft; // info is left now, will end up right
    const cardTravelsToRight = !infoOnLeft; // card takes whichever side info vacates

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    // --- INFO element's path ---
    // Shrink to 0 at center (0.5s), then grow back out (0.5s) — but the
    // grow tween starts BEFORE shrink finishes (pass+=0.3, not pass+=0.5)
    // so there's a real overlap window where both are moving at once.
    // That overlap is what makes this read as one continuous pass instead
    // of a shrink-then-stop-then-grow sequence.
    tl.to(
      infoRef.current,
      { left: "50%", width: "0%", duration: 0.5, ease: "power2.in" },
      "pass",
    );
    tl.add(() => {
      setIndex(target);
    }, "pass+=0.25"); // fires before grow starts (pass+=0.3), width still near 0
    tl.to(
      infoRef.current,
      {
        left: infoTravelsToRight ? `${RIGHT_POSITION_PCT}%` : "0%",
        width: `${PANEL_WIDTH_PCT}%`,
        duration: 0.5,
        ease: "power2.out",
      },
      "pass+=0.3",
    );

    // --- CARD element's path (mirrors info, opposite side) ---
    tl.to(
      cardRef.current,
      { left: "50%", width: "0%", duration: 0.5, ease: "power2.in" },
      "pass",
    );
    tl.to(
      cardRef.current,
      {
        left: cardTravelsToRight ? `${RIGHT_POSITION_PCT}%` : "0%",
        width: `${PANEL_WIDTH_PCT}%`,
        duration: 0.5,
        ease: "power2.out",
      },
      "pass+=0.3",
    );

    tl.add(() => {
      setInfoOnLeft(nextInfoOnLeft);
    }, "pass+=0.8"); // after both fully settled (0.3 + 0.5)
  };

  const next = () => goTo((index + 1) % works.length);
  const prev = () => goTo((index - 1 + works.length) % works.length);

  return (
    <div ref={containerRef} className="relative mt-10 h-160">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-25 w-px -translate-x-1/2 bg-ink/10 dark:bg-bg/10" />

      <button
        type="button"
        aria-label="Previous project"
        onClick={prev}
        className="absolute top-1/2 left-0 z-30 -translate-x-4 -translate-y-1/2 text-ink/40 hover:text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 5L8 12L16 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={infoRef}
        className="absolute top-1/2 z-20 -translate-y-1/2 overflow-hidden px-10"
        style={{
          left: infoOnLeft ? "0%" : `${RIGHT_POSITION_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <h3 className="font-display text-3xl font-semibold whitespace-nowrap">{active.title}</h3>
        <p className="mt-2 font-sans text-base whitespace-nowrap text-ink/60">{active.description}</p>
      </div>

      <div
        ref={cardRef}
        className="absolute top-1/2 z-0 -translate-y-1/2 overflow-hidden px-10"
        style={{
          left: infoOnLeft ? `${RIGHT_POSITION_PCT}%` : "0%",
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="relative mx-auto h-160 w-full max-w-140 overflow-hidden rounded-2xl bg-white pt-6 pr-6 pl-6" />
      </div>

      <button
        type="button"
        aria-label="Next project"
        onClick={next}
        className="absolute top-1/2 right-0 z-30 translate-x-4 -translate-y-1/2 text-ink/40 hover:text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 5L16 12L8 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}