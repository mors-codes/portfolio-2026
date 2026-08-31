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

  const active = works[index];

  const goTo = (target: number) => {
    if (
      target === index ||
      isTransitioning ||
      !infoRef.current ||
      !cardRef.current
    ) {
      return;
    }

    setIsTransitioning(true);

    const nextInfoOnLeft = !infoOnLeft;
    const nextCardOnLeft = !nextInfoOnLeft;

    const currentCardOnLeft = !infoOnLeft;

    const tl = gsap.timeline({
      defaults: {
        overwrite: "auto",
      },
      onComplete: () => {
        setIsTransitioning(false);
      },
    });

    /*
     * ----------------------------------------
     * PHASE 1
     * Remove the current content
     * ----------------------------------------
     *
     * Current card collapses toward the center.
     * Current project info fades out.
     */

    tl.to(
      cardRef.current,
      {
        left: "50%",
        width: "0%",
        duration: 0.55,
        ease: "power3.inOut",
      },
      0,
    );

    tl.to(
      infoRef.current,
      {
        opacity: 0,
        y: 12,
        duration: 0.3,
        ease: "power2.out",
      },
      0.15,
    );

    /*
     * ----------------------------------------
     * PHASE 2
     * Swap React content while invisible
     * ----------------------------------------
     */

    tl.add(() => {
      setIndex(target);
    }, 0.5);

    /*
     * ----------------------------------------
     * PHASE 3
     * Move invisible info to its new side
     * ----------------------------------------
     */

    tl.set(
      infoRef.current,
      {
        left: nextInfoOnLeft
          ? "0%"
          : `${RIGHT_POSITION_PCT}%`,
        width: `${PANEL_WIDTH_PCT}%`,
        y: 12,
      },
      0.55,
    );

    /*
     * ----------------------------------------
     * PHASE 4
     * Prepare the incoming card
     * ----------------------------------------
     *
     * Both incoming cards begin at the center.
     *
     * LEFT CARD:
     * center -> left
     *
     * RIGHT CARD:
     * center -> right
     */

    tl.set(
      cardRef.current,
      {
        left: "50%",
        width: "0%",
      },
      0.55,
    );

    /*
     * ----------------------------------------
     * PHASE 5
     * Expand new card into opposite column
     * ----------------------------------------
     */

    tl.to(
      cardRef.current,
      {
        left: nextCardOnLeft
          ? "0%"
          : `${RIGHT_POSITION_PCT}%`,
        width: `${PANEL_WIDTH_PCT}%`,
        duration: 0.6,
        ease: "power3.out",
      },
      0.55,
    );

    /*
     * ----------------------------------------
     * PHASE 6
     * Reveal the new project info
     * ----------------------------------------
     */

    tl.to(
      infoRef.current,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      },
      0.78,
    );

    /*
     * ----------------------------------------
     * PHASE 7
     * Update layout state
     * ----------------------------------------
     */

    tl.add(() => {
      setInfoOnLeft(nextInfoOnLeft);
    }, 1.15);
  };

  const next = () => {
    goTo((index + 1) % works.length);
  };

  const prev = () => {
    goTo((index - 1 + works.length) % works.length);
  };

  return (
    <div className="relative mt-10 h-160">
      {/* Center divider */}
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-30 w-px -translate-x-1/2 bg-ink/10 dark:bg-bg/10" />

      {/* Previous */}
      <button
        type="button"
        aria-label="Previous project"
        onClick={prev}
        disabled={isTransitioning}
        className="absolute top-1/2 left-0 z-40 -translate-x-4 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M16 5L8 12L16 19"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Project info */}
      <div
        ref={infoRef}
        className="absolute top-1/2 z-20 -translate-y-1/2 overflow-hidden px-10"
        style={{
          left: infoOnLeft ? "0%" : `${RIGHT_POSITION_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="overflow-hidden">
          <h3 className="font-display whitespace-nowrap text-3xl font-semibold">
            {active.title}
          </h3>

          <p className="mt-2 whitespace-nowrap font-sans text-base text-ink/60">
            {active.description}
          </p>
        </div>
      </div>

      {/* Card panel */}
      <div
        ref={cardRef}
        className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden"
        style={{
          left: infoOnLeft
            ? `${RIGHT_POSITION_PCT}%`
            : "0%",
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="h-[640px] w-full px-10">
          <div className="relative mx-auto h-full w-full max-w-140 overflow-hidden rounded-2xl bg-white p-6">
            {/* CARD CONTENT */}

            <div className="flex h-full items-center justify-center">
              <span className="font-display text-2xl font-semibold text-black/20">
                {active.title}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Next */}
      <button
        type="button"
        aria-label="Next project"
        onClick={next}
        disabled={isTransitioning}
        className="absolute top-1/2 right-0 z-40 translate-x-4 -translate-y-1/2 text-ink/40 transition-colors hover:text-ink disabled:pointer-events-none disabled:opacity-30"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M8 5L16 12L8 19"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}