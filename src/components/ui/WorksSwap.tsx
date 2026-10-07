"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { flushSync } from "react-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";
import WorkVisual, {
  prefersReducedMotion,
  type WorkVisualData,
} from "@/components/ui/WorkVisual";

export type {
  WorkVisualData,
  WorkScreen,
  WorkflowNode,
  WorkflowNodeKind,
} from "@/components/ui/WorkVisual";

export interface WorkStackItem {
  name: string;
  /** Optional logo. Without one the tag renders as plain text. */
  icon?: string;
}

export interface WorkItem {
  title: string;
  /** e.g. "Web development", "AI automation" */
  category: string;
  description?: string;
  stack?: WorkStackItem[];
  link?: string;
  /** Decides how the project is presented. See WorkVisualData. */
  visual: WorkVisualData;
}

interface WorksSwapProps {
  works: WorkItem[];
}

// Right panel: the old visual fades out drifting right, the new one fades in
// drifting left. SHIFT_PCT is the drift distance as a % of the stage width.
const SHIFT_PCT = 6;
const EXIT_DURATION = 0.5;
const ENTER_DURATION = 0.8;
const ENTER_DELAY = 0.4;

// Left panel: every info element just fades (no movement).
const FADE_SELECTOR = "[data-reveal], [data-title]";

const pad = (n: number) => String(n).padStart(2, "0");

const NAV_BUTTON =
    "grid h-12 w-12 place-items-center border-[2px] border-ink text-ink transition-colors hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink";

function Layer({
  layerRef,
  work,
  workIndex,
}: {
  layerRef: RefObject<HTMLDivElement | null>;
  work: WorkItem;
  workIndex: number;
}) {
  return (
    <div ref={layerRef} className="absolute inset-0">
      {/* Card behind the visual. Also the size container the visuals' cq units measure. */}
      <div className="h-full w-full bg-ink/8 p-6 @container-size sm:p-8 lg:p-12">
        <div className="flex h-full w-full items-center justify-center">
          {/* key remounts the visual per project so image-error state never leaks across projects */}
          <div className="flex aspect-16/10 w-[min(100cqw,160cqh)] items-center justify-center @container-size">
            <WorkVisual key={workIndex} visual={work.visual} title={work.title} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorksSwap({ works }: WorksSwapProps) {
  const total = works.length;

  // `current` drives the info column. `layers` holds which project each of the
  // two stacked visual layers is showing; they alternate on every swap.
  const [current, setCurrent] = useState(0);
  const [layers, setLayers] = useState<[number, number]>([0, 0]);

  const rootRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);

  const currentRef = useRef(0);
  const prevCurrentRef = useRef(0);
  const activeLayerRef = useRef<0 | 1>(0);
  const busyRef = useRef(false);
  const inViewRef = useRef(false);

  /* ---------------------------- first-view entrance ---------------------------- */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const info = infoRef.current;
    const layerA = layerARef.current;
    const layerB = layerBRef.current;
    if (!root || !info || !layerA || !layerB) return;

    gsap.set(layerB, { autoAlpha: 0 });
    if (prefersReducedMotion()) return;

    const controls = controlsRef.current;
    const items = info.querySelectorAll(FADE_SELECTOR);

    gsap.set(items, { autoAlpha: 0 });
    gsap.set(controls, { autoAlpha: 0 });
    gsap.set(layerA, { autoAlpha: 0, xPercent: SHIFT_PCT });

    const play = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(layerA, { clearProps: "transform" });
        },
      });
      tl.to(
        layerA,
        {
          autoAlpha: 1,
          xPercent: 0,
          duration: ENTER_DURATION + 0.2,
          ease: "power3.out",
        },
        0.15,
      )
        .to(items, { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0.4)
        .to(controls, { autoAlpha: 1, duration: 0.5, ease: "power2.out" }, 0.9);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          play();
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  /* ------------------- info column: reveal after content swaps ------------------ */
  useLayoutEffect(() => {
    if (prevCurrentRef.current === current) return;
    prevCurrentRef.current = current;

    const info = infoRef.current;
    if (!info || prefersReducedMotion()) return;

    gsap.fromTo(
      info.querySelectorAll(FADE_SELECTOR),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" },
    );
  }, [current]);

  /* --------------------------------- navigation --------------------------------- */
  const goTo = useCallback(
    (target: number) => {
      const info = infoRef.current;
      const layerA = layerARef.current;
      const layerB = layerBRef.current;
      if (total < 2 || busyRef.current || !info || !layerA || !layerB) return;
      if (target === currentRef.current) return;

      busyRef.current = true;

      const incomingIdx: 0 | 1 = activeLayerRef.current === 0 ? 1 : 0;
      const outEl = incomingIdx === 1 ? layerA : layerB;
      const inEl = incomingIdx === 1 ? layerB : layerA;

      const commit = () => {
        activeLayerRef.current = incomingIdx;
        currentRef.current = target;
        busyRef.current = false;
      };

      // Mount the incoming visual before it is revealed so no stale frame flashes.
      flushSync(() => {
        setLayers((prev): [number, number] =>
          incomingIdx === 0 ? [target, prev[1]] : [prev[0], target],
        );
      });

      if (prefersReducedMotion()) {
        flushSync(() => setCurrent(target));
        gsap.set(outEl, { autoAlpha: 0 });
        gsap.set(inEl, { autoAlpha: 1 });
        commit();
        return;
      }

      // Incoming layer waits invisible, parked to the right of its resting spot.
      gsap.set(outEl, { zIndex: 1 });
      gsap.set(inEl, { zIndex: 2, autoAlpha: 0, xPercent: SHIFT_PCT });

      const items = info.querySelectorAll(FADE_SELECTOR);

      const tl = gsap.timeline({
        defaults: { overwrite: "auto" },
        onComplete: () => {
          gsap.set(outEl, { autoAlpha: 0 });
          gsap.set([outEl, inEl], { clearProps: "transform" });
          commit();
        },
      });

      tl.to(items, { autoAlpha: 0, duration: 0.3, ease: "power2.in" }, 0)
        .add(() => {
          flushSync(() => setCurrent(target));
        }, 0.35)
        .to(
          outEl,
          {
            autoAlpha: 0,
            xPercent: SHIFT_PCT,
            duration: EXIT_DURATION,
            ease: "power2.in",
          },
          0,
        )
        .to(
          inEl,
          {
            autoAlpha: 1,
            xPercent: 0,
            duration: ENTER_DURATION,
            ease: "power3.out",
          },
          ENTER_DELAY,
        );
    },
    [total],
  );

  const next = useCallback(
    () => goTo((currentRef.current + 1) % total),
    [goTo, total],
  );
  const prev = useCallback(
    () => goTo((currentRef.current - 1 + total) % total),
    [goTo, total],
  );

  /* ----------------------------- keyboard (in view only) ----------------------------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.4 },
    );
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!inViewRef.current || e.defaultPrevented) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
      ) {
        return;
      }

      e.preventDefault();
      if (e.key === "ArrowRight") next();
      else prev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev]);

  if (total === 0) return null;

  const active = works[current] ?? works[0];
  const workAt = (i: number) => works[i] ?? works[0];

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured works"
      className="relative mt-14 grid gap-10 lg:h-[calc(100svh-19.75rem)] lg:max-h-216 lg:min-h-128 lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)] lg:grid-rows-[1fr_auto] lg:gap-x-14 lg:gap-y-8"
    >
      {/* Left column: project info */}
      <div
        ref={infoRef}
        aria-live="polite"
        className="flex flex-col justify-center lg:col-start-1 lg:row-start-1 lg:pr-4"
      >
        <p
          data-reveal
          className="flex items-baseline gap-2 font-mono-label text-sm tracking-widest"
        >
          <span>{pad(current + 1)}</span>
          <span className="text-ink/30">/ {pad(total)}</span>
        </p>

        <p data-reveal className="mt-8 font-display text-[11px] font-light tracking-widest text-ink/50 uppercase">
          {active.category}
        </p>

        <div className="mt-2 overflow-hidden pb-[0.15em] text-[clamp(3.5rem,calc(7vw-0.4rem),7rem)] lg:min-h-[1.85em] lg:flex lg:items-end">
          <h3
            data-title  
            className="font-sans leading-[0.80] font-medium tracking-tighter text-balance whitespace-pre-line"
          >
            {active.title}
          </h3>
        </div>

        <div className="mt-2 max-w-md font-display text-xs font-light leading-normal text-ink/70 empty:hidden md:text-sm lg:min-h-[3em] lg:empty:block">
          {active.description && <p data-reveal>{active.description}</p>}
        </div>

        <div className="mt-6 empty:hidden lg:min-h-7.5 lg:empty:block">
        {active.stack && active.stack.length > 0 && (
          <ul data-reveal className="flex flex-wrap gap-1.5">
            {active.stack.map((item) => (
              <li
                key={item.name}
                className={`flex items-center gap-2 border border-ink/20 py-1 font-sans text-xs text-ink/70 ${
                  item.icon ? "pr-2.5 pl-1" : "px-2.5"
                }`}
              >
                {item.icon && (
                  <span className="grid h-5 w-5 place-items-center">
                    <Image
                      src={item.icon}
                      alt=""
                      width={15}
                      height={15}
                      className="h-3.75 w-3.75"
                    />
                  </span>
                )}
                {item.name}
              </li>
            ))}
          </ul>
        )}
        </div>

        {active.link && (
          <a
            data-reveal
            href={active.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative mt-8 inline-block self-start font-sans text-xs font-normal text-ink"
          >
            <span className="underline decoration-ink/30 decoration-1 underline-offset-8 transition-colors group-hover:decoration-ink">
              Visit Site
            </span>
            <ArrowUpRight size={12} className="ml-1 inline-block" />
          </a>
        )}
      </div>

      {/* Right column: visual stage (two alternating layers) */}
      <div className="relative h-88 @container-size sm:h-128 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:h-auto">
        <Layer layerRef={layerARef} work={workAt(layers[0])} workIndex={layers[0]} />
        <Layer layerRef={layerBRef} work={workAt(layers[1])} workIndex={layers[1]} />
      </div>

      {/* Controls */}
      {total > 1 && (
        <div
          ref={controlsRef}
          className="flex items-center gap-6 lg:col-start-1 lg:row-start-2 lg:pr-4"
        >
          <div className="flex gap-3">
            <button
              type="button"
              aria-label="Previous project"
              onClick={prev}
              className={NAV_BUTTON}
            >
              <ArrowLeft size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={next}
              className={NAV_BUTTON}
            >
              <ArrowRight size={20} strokeWidth={2.5} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}