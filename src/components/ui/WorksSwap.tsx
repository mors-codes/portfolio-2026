"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export interface WorkItem {
  title: string;
  description: string;
  image: string;
}

interface WorksSwapProps {
  works: WorkItem[];
}

const PANEL_WIDTH_PCT = 45;
const RIGHT_POSITION_PCT = 100 - PANEL_WIDTH_PCT;

export default function WorksSwap({ works }: WorksSwapProps) {
  const [index, setIndex] = useState(0);
  const [outgoing, setOutgoing] = useState<{
    image: string;
    dir: number;
  } | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const incomingImgRef = useRef<HTMLDivElement>(null);
  const outgoingImgRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [infoOnLeft, setInfoOnLeft] = useState(true);
  const active = works[index];

  const goTo = (target: number) => {
    if (
      target === index ||
      isTransitioning ||
      !infoRef.current ||
      !imageRef.current ||
      !containerRef.current
    )
      return;

    setIsTransitioning(true);
    const dir =
      target > index || (target === 0 && index === works.length - 1) ? 1 : -1;
    const currentImage = active.image;
    const nextInfoOnLeft = !infoOnLeft;

    const imgSlotWidth = imageRef.current.offsetWidth;

    const leftPct = 0;
    const rightPct = RIGHT_POSITION_PCT;
    const infoToPct = nextInfoOnLeft ? leftPct : rightPct;
    const imageToPct = nextInfoOnLeft ? rightPct : leftPct;

    const tl = gsap.timeline({
      onComplete: () => setIsTransitioning(false),
    });

    tl.to(infoRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
    });

    tl.to(
      infoRef.current,
      { left: `${infoToPct}%`, duration: 0.6, ease: "power2.inOut" },
      "swap",
    );
    tl.to(
      imageRef.current,
      { left: `${imageToPct}%`, duration: 0.6, ease: "power2.inOut" },
      "swap",
    );

    tl.add(() => {
      setOutgoing({ image: currentImage, dir });
      setIndex(target);
      setInfoOnLeft(nextInfoOnLeft);

      if (incomingImgRef.current) {
        const enterFrom = dir > 0 ? imgSlotWidth : -imgSlotWidth;
        gsap.killTweensOf(incomingImgRef.current);
        gsap.fromTo(
          incomingImgRef.current,
          { x: enterFrom, opacity: 1 },
          { x: 0, opacity: 1, duration: 0.5, ease: "power2.inOut" },
        );
      }
      if (outgoingImgRef.current) {
        gsap.killTweensOf(outgoingImgRef.current);
        gsap.to(outgoingImgRef.current, {
          x: dir > 0 ? -imgSlotWidth : imgSlotWidth,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => setOutgoing(null),
        });
      }
    }, "swap+=0.15");

    tl.fromTo(
      infoRef.current,
      { y: 24, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
      "swap+=0.35",
    );
  };

  const next = () => goTo((index + 1) % works.length);
  const prev = () => goTo((index - 1 + works.length) % works.length);

  return (
    <div ref={containerRef} className="relative mt-10 h-160">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-[25] w-px -translate-x-1/2 bg-ink/10 dark:bg-bg/10" />

      <button
        type="button"
        aria-label="Previous project"
        onClick={prev}
        className="absolute top-1/2 left-0 z-30 -translate-x-4 -translate-y-1/2 text-ink/40 hover:text-ink"
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

      <div
        ref={infoRef}
        className="absolute top-1/2 z-20 -translate-y-1/2 px-10"
        style={{
          left: infoOnLeft ? "0%" : `${RIGHT_POSITION_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <h3 className="font-display text-3xl font-semibold">{active.title}</h3>
        <p className="mt-2 font-sans text-base text-ink/60">
          {active.description}
        </p>
      </div>

      <div
        ref={imageRef}
        className="absolute top-1/2 z-0 -translate-y-1/2 px-10"
        style={{
          left: infoOnLeft ? `${RIGHT_POSITION_PCT}%` : "0%",
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="relative mx-auto h-160 w-full max-w-140 overflow-hidden rounded-2xl bg-white pt-6 pr-6 pl-6">
          {outgoing && (
            <div
              ref={outgoingImgRef}
              className="absolute inset-0 h-full w-full overflow-hidden pt-6 pr-6 pl-6"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={outgoing.image}
                alt=""
                className="h-full w-full object-cover object-top"
              />
            </div>
          )}
          <div ref={incomingImgRef} className="h-full w-full overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.image}
              alt={active.title}
              className="h-full w-full object-cover object-top"
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label="Next project"
        onClick={next}
        className="absolute top-1/2 right-0 z-30 translate-x-4 -translate-y-1/2 text-ink/40 hover:text-ink"
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
