"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

export interface WorkStackItem {
  name: string;
  icon: string;
}

export interface WorkItem {
  title: string;
  description: string;
  image: string;
  stack?: WorkStackItem[];
  link?: string;
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
const CARD_FRAME_MAX_WIDTH = 640;

export default function WorksSwap({ works }: WorksSwapProps) {
  const [index, setIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [infoOnLeft, setInfoOnLeft] = useState(true);

  const infoRef = useRef<HTMLDivElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");

  const active = works[index];
  const [displayedWork, setDisplayedWork] = useState<{
    A: WorkItem;
    B: WorkItem;
  }>({
    A: works[0],
    B: works[0],
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const hasPlayedEntranceRef = useRef(false);
  // Start at the fully-rendered desktop frame width so the image never falls
  // back to its narrow intrinsic width before the first measurement arrives.
  const [cardFrameWidth, setCardFrameWidth] = useState(CARD_FRAME_MAX_WIDTH);
  const imageWidth = Math.max(Math.min(cardFrameWidth - 80, 560) - 56, 0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateCardFrameWidth = () => {
      setCardFrameWidth(container.clientWidth * (PANEL_WIDTH_PCT / 100));
    };

    updateCardFrameWidth();
    const resizeObserver = new ResizeObserver(updateCardFrameWidth);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  useLayoutEffect(() => {
    if (!infoRef.current || !cardARef.current) return;
    gsap.set(cardARef.current, { left: `${COLLAPSE_RIGHT_PCT}%`, width: "0%" });
    gsap.set(infoRef.current, { opacity: 0, y: 30 });
  }, []);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const playEntrance = () => {
      if (hasPlayedEntranceRef.current || !infoRef.current || !cardARef.current)
        return;
      hasPlayedEntranceRef.current = true;

      const tl = gsap.timeline();
      tl.to(
        cardARef.current,
        {
          left: `${RIGHT_REST_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
          duration: 1.2,
          ease: "power3.inOut",
        },
        0,
      );
      tl.to(
        infoRef.current,
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        0.3,
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          playEntrance();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = (target: number) => {
    if (
      target === index ||
      isTransitioning ||
      !infoRef.current ||
      !cardARef.current ||
      !cardBRef.current
    ) {
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
    const outgoingCollapsePct = outgoingWasOnLeft
      ? COLLAPSE_LEFT_PCT
      : COLLAPSE_RIGHT_PCT;
    const incomingStartPct = outgoingWasOnLeft
      ? COLLAPSE_RIGHT_PCT
      : COLLAPSE_LEFT_PCT;

    // Commit the new image before GSAP exposes the incoming slot. Without this,
    // the first swap can reveal one frame of that slot's stale collapsed content.
    flushSync(() => {
      setDisplayedWork((prev) => ({ ...prev, [incomingSlot]: works[target] }));
    });

    // The DOM order would otherwise put Card B above Card A during B -> A swaps,
    // allowing the collapsing panel to briefly peek over the incoming one.
    gsap.set(outgoingRef.current, { zIndex: 10 });
    gsap.set(incomingRef.current, { zIndex: 11 });
    gsap.set(incomingRef.current, {
      left: `${incomingStartPct}%`,
      width: "0%",
    });

    const tl = gsap.timeline({
      defaults: { overwrite: "auto" },
      onComplete: () => {
        setActiveSlot(incomingSlot);
        setIndex(target);
        setInfoOnLeft(nextInfoOnLeft);
        setIsTransitioning(false);
      },
    });

    tl.to(
      infoRef.current,
      { opacity: 0, y: 12, duration: 0.3, ease: "power2.out" },
      0,
    );

    tl.to(
      outgoingRef.current,
      {
        left: `${outgoingCollapsePct}%`,
        width: "0%",
        duration: 1.2,
        ease: "power3.inOut",
      },
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
      {
        left: nextInfoOnLeft ? `${LEFT_REST_PCT}%` : `${RIGHT_REST_PCT}%`,
        y: 12,
      },
      1.2,
    );
    tl.to(
      infoRef.current,
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      1.25,
    );
  };

  const next = () => goTo((index + 1) % works.length);
  const prev = () => goTo((index - 1 + works.length) % works.length);

  return (
    <div ref={containerRef} className="relative mt-10 h-160">
      <div className="pointer-events-none absolute top-0 bottom-0 left-1/2 z-30 w-px -translate-x-1/2 bg-ink/10 dark:bg-bg/10" />

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

      <div
        ref={infoRef}
        className="absolute top-[calc(50%-10rem)] z-20 -translate-y-1/2 overflow-hidden px-10"
        style={{
          left: infoOnLeft ? `${LEFT_REST_PCT}%` : `${RIGHT_REST_PCT}%`,
          width: `${PANEL_WIDTH_PCT}%`,
        }}
      >
        <div className="overflow-hidden">
          <h3 className="font-sans text-7xl font-medium tracking-tighter whitespace-nowrap">
            {active.title}
          </h3>

          {active.stack && active.stack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {active.stack.map((item) => (
                <span
                  key={item.name}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink"
                  title={item.name}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className="h-5 w-5"
                  />
                </span>
              ))}
            </div>
          )}

          {active.link && (
            <a
              href={active.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative mt-3 inline-block font-sans text-lg font-normal text-ink/60 transition-colors hover:text-ink"
            >
              <span className="relative italic">
                Visit Site
                <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </span>
              <ArrowUpRight size={16} className="inline-block ml-1" />
            </a>
          )}
        </div>
      </div>

      {/* Card A */}
      <div
        ref={cardARef}
        className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden isolate [clip-path:inset(0)]"
        style={
          activeSlot === "A"
            ? {
                left: infoOnLeft ? `${RIGHT_REST_PCT}%` : `${LEFT_REST_PCT}%`,
                width: `${PANEL_WIDTH_PCT}%`,
              }
            : { left: "50%", width: "0%" }
        }
      >
        <div className="h-160 w-full px-10">
          <div className="relative mx-auto h-full w-full max-w-140 overflow-hidden rounded-4xl bg-white pt-7 pr-7 pl-7">
            <div
              className="relative h-full overflow-hidden shadow-[0_0_22px_rgba(0,0,0,0.48)]"
              style={{ width: imageWidth }}
            >
              <Image
                src={displayedWork.A.image}
                alt={displayedWork.A.title}
                fill
                sizes="(max-width: 680px) calc(47vw - 7rem), 528px"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card B */}
      <div
        ref={cardBRef}
        className="absolute top-1/2 z-10 -translate-y-1/2 overflow-hidden isolate [clip-path:inset(0)]"
        style={
          activeSlot === "B"
            ? {
                left: infoOnLeft ? `${RIGHT_REST_PCT}%` : `${LEFT_REST_PCT}%`,
                width: `${PANEL_WIDTH_PCT}%`,
              }
            : { left: "50%", width: "0%" }
        }
      >
        <div className="h-160 w-full px-10">
          <div className="relative mx-auto h-full w-full max-w-140 overflow-hidden rounded-4xl bg-white pt-7 pr-7 pl-7">
            <div
              className="relative h-full overflow-hidden shadow-[0_0_22px_rgba(0,0,0,0.48)]"
              style={{ width: imageWidth }}
            >
              <Image
                src={displayedWork.B.image}
                alt={displayedWork.B.title}
                fill
                sizes="(max-width: 680px) calc(47vw - 7rem), 528px"
                className="object-cover object-top"
              />
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
