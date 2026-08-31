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

const PANEL_WIDTH_PCT = 47;
const OUTER_MARGIN_PCT = 4;
const LEFT_REST_PCT = OUTER_MARGIN_PCT;
const RIGHT_REST_PCT = 100 - PANEL_WIDTH_PCT - OUTER_MARGIN_PCT;
const REST_GAP_PCT = RIGHT_REST_PCT - LEFT_REST_PCT - PANEL_WIDTH_PCT;
const COLLAPSE_LEFT_PCT = 50 - REST_GAP_PCT / 2;
const COLLAPSE_RIGHT_PCT = 50 + REST_GAP_PCT / 2;

export default function WorksSwap({ works }: WorksSwapProps) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [infoOnLeft, setInfoOnLeft] = useState(true);

  const infoRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");

  const active = works[index];
  const [displayedWork, setDisplayedWork] = useState<{ A: WorkItem; B: WorkItem }>({
    A: works[0],
    B: works[0],
  });

  const goTo = (target: number) => {
    if (target === index || isTransitioning || !infoRef.current || !cardARef.current || !cardBRef.current) {
      return;
    }

    setIsTransitioning(true);

    const nextInfoOnLeft = !infoOnLeft;
    const nextCardOnLeft = !nextInfoOnLeft;

    const outgoingSlot = activeSlot;
    const incomingSlot = outgoingSlot === "A" ? "B" : "A";
    const outgoingRef = outgoingSlot === "A" ? cardARef : cardBRef;
    const incomingRef = incomingSlot === "A" ? cardARef : cardBRef;

    const outgoingWasOnLeft = !nextCardOnLeft;
    const outgoingCollapsePct = outgoingWasOnLeft ? COLLAPSE_LEFT_PCT : COLLAPSE_RIGHT_PCT;
    const incomingStartPct = outgoingWasOnLeft ? COLLAPSE_RIGHT_PCT : COLLAPSE_LEFT_PCT;

    setDisplayedWork((prev) => ({ ...prev, [incomingSlot]: works[target] }));

    gsap.set(incomingRef.current, { left: `${incomingStartPct}%`, width: "0%" });

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        setActiveSlot(incomingSlot);
        setIndex(target);
        setInfoOnLeft(nextInfoOnLeft);
        setIsTransitioning(false);
      },
    });

    tl.to(infoRef.current, { opacity: 0, y: 12, duration: 0.3, ease: "power2.out" }, 0);

    tl.to(
      outgoingRef.current,
      { left: `${outgoingCollapsePct}%`, width: "0%", duration: 1.2, ease: "power3.inOut" },
      0,
    );

    tl.to(
      incomingRef.current,
      {
        left: nextCardOnLeft ? `${LEFT_REST_PCT}%` : `${RIGHT_REST_PCT}%`,
        width: `${PANEL_WIDTH_PCT}%`,
        duration: 1.2,
        ease: "power3.inOut",
      },
      0,
    );

    tl.set(
      infoRef.current,
      { left: nextInfoOnLeft ? `${LEFT_REST_PCT}%` : `${RIGHT_REST_PCT}%`, y: 12 },
      1.2,
    );
    tl.to(infoRef.current, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 1.25);
  };

  const next = () => goTo((index + 1) % works.length);
  const prev = () => goTo((index - 1 + works.length) % works.length);

  return (
    <div className="relative mt-10 h-160">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-30 w-px -translate-x-1/2 bg-ink/10 dark:bg-bg/10" />

      <button
        type="button"
        aria-label="Previous project"
        onClick={prev}
        disabled={isTransitioning}
        className="absolute top-1/2 left-0 z-40 -translate-x-4 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M16 5L8 12L16 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div
        ref={infoRef}
        className="absolute top-1/2 z-20 -translate-y-1/2 overflow-hidden px-10"
        style={{
          left: infoOnLeft ? `${LEFT_REST_PCT}%` : `${RIGHT_REST_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="overflow-hidden">
          <h3 className="font-display text-3xl font-semibold whitespace-nowrap">{active.title}</h3>
          <p className="mt-2 font-sans text-base whitespace-nowrap text-ink/60">{active.description}</p>
        </div>
      </div>

      {/* Card A */}
      <div
        ref={cardARef}
        className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden"
        style={
          activeSlot === "A"
            ? { left: infoOnLeft ? `${RIGHT_REST_PCT}%` : `${LEFT_REST_PCT}%`, width: `${PANEL_WIDTH_PCT}%` }
            : { left: "50%", width: "0%" }
        }
      >
        <div className="h-160 w-full px-10">
          <div className="relative mx-auto h-full w-full max-w-140 overflow-hidden rounded-4xl bg-white p-6">
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-2xl font-semibold text-black/20">
                {displayedWork.A.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Card B */}
      <div
        ref={cardBRef}
        className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden"
        style={
          activeSlot === "B"
            ? { left: infoOnLeft ? `${RIGHT_REST_PCT}%` : `${LEFT_REST_PCT}%`, width: `${PANEL_WIDTH_PCT}%` }
            : { left: "50%", width: "0%" }
        }
      >
        <div className="h-160 w-full px-10">
          <div className="relative mx-auto h-full w-full max-w-140 overflow-hidden rounded-4xl bg-white p-6">
            <div className="flex h-full items-center justify-center">
              <span className="font-display text-2xl font-semibold text-black/20">
                {displayedWork.B.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Next project"
        onClick={next}
        disabled={isTransitioning}
        className="absolute top-1/2 right-0 z-40 translate-x-4 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M8 5L16 12L8 19" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}