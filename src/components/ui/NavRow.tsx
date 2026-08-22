"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import NavLink from "./NavLink";

const items = [
  { href: "#about", number: "01", label: "About" },
  { href: "#works", number: "02", label: "Works" },
  { href: "#stack", number: "03", label: "Stack" },
  { href: "#contact", number: "04", label: "Contact" },
];

const MarqueeSequence = ({
  number,
  label,
  count,
  innerRef,
}: {
  number: string;
  label: string;
  count: number;
  innerRef?: React.Ref<HTMLDivElement>;
}) => (
  <div ref={innerRef} className="flex flex-shrink-0 items-center">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex flex-shrink-0 items-center gap-2 px-6">
        <span className="font-mono-label text-xs text-bg/60">{number}</span>
        <span className="font-semibold uppercase">{label}</span>
      </div>
    ))}
  </div>
);

export default function NavRow() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayInnerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeSequenceRef = useRef<HTMLDivElement>(null);
  const oneItemRef = useRef<HTMLDivElement>(null);

  const overlayTweenRef = useRef<gsap.core.Timeline | null>(null);
  const marqueeTweenRef = useRef<gsap.core.Tween | null>(null);
  const isOpenRef = useRef(false);

  const [current, setCurrent] = useState({ number: "01", label: "About" });
  const [itemCount, setItemCount] = useState(6);

  const animationDefaults = { duration: 0.6, ease: "expo.out" };

  useLayoutEffect(() => {
    if (!overlayInnerRef.current) return;
    gsap.set(overlayInnerRef.current, { y: "0%" });
  }, []);

  // Ensures one sequence is always wider than the overlay's own
  // viewport, so the second sequence is already covering the visible
  // area by the time the first fully scrolls out — no gap possible.
  const calculateItemCount = () => {
    if (!oneItemRef.current || !overlayRef.current) return;
    const oneItemWidth = oneItemRef.current.offsetWidth;
    const viewportWidth = overlayRef.current.offsetWidth;
    if (oneItemWidth === 0) return;

    // +2 extra items of headroom beyond the minimum needed, per spec.
    const needed = Math.ceil(viewportWidth / oneItemWidth) + 2;
    setItemCount(Math.max(6, needed));
  };

  useLayoutEffect(() => {
    calculateItemCount();

    const resizeObserver = new ResizeObserver(() => {
      calculateItemCount();
    });
    if (overlayRef.current) resizeObserver.observe(overlayRef.current);

    return () => resizeObserver.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMarquee = () => {
    if (!marqueeRef.current || !marqueeSequenceRef.current) return;
    const sequenceWidth = marqueeSequenceRef.current.offsetWidth;
    if (sequenceWidth === 0) return;

    marqueeTweenRef.current?.kill();
    gsap.set(marqueeRef.current, { x: 0 });
    marqueeTweenRef.current = gsap.to(marqueeRef.current, {
      x: -sequenceWidth,
      duration: 14,
      ease: "none",
      repeat: -1,
    });
  };

  useLayoutEffect(() => {
    startMarquee();
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(startMarquee);
    }
    return () => {
      marqueeTweenRef.current?.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, itemCount]);

  const openOverlay = (edge: "top" | "bottom") => {
    if (!overlayRef.current || !overlayInnerRef.current) return;

    overlayTweenRef.current?.kill();

    gsap.set(overlayRef.current, {
      visibility: "visible",
      transformOrigin: edge === "top" ? "top" : "bottom",
    });

    overlayTweenRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .set(overlayRef.current, { scaleY: 0 }, 0)
      .set(
        overlayInnerRef.current,
        { y: edge === "top" ? "100%" : "-100%" },
        0
      )
      .to(overlayRef.current, { scaleY: 1 }, 0)
      .to(overlayInnerRef.current, { y: "0%" }, 0);
  };

  const closeOverlay = (edge: "top" | "bottom") => {
    if (!overlayRef.current || !overlayInnerRef.current) return;

    overlayTweenRef.current?.kill();

    gsap.set(overlayRef.current, {
      transformOrigin: edge === "top" ? "top" : "bottom",
    });

    overlayTweenRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to(overlayRef.current, { scaleY: 0 }, 0)
      .to(
        overlayInnerRef.current,
        { y: edge === "top" ? "100%" : "-100%" },
        0
      )
      .set(overlayRef.current, { visibility: "hidden" });
  };

  const handleItemHover = (
    label: string,
    number: string,
    edge: "top" | "bottom"
  ) => {
    setCurrent({ number, label });

    if (!isOpenRef.current) {
      isOpenRef.current = true;
      openOverlay(edge);
    }
  };

  const handleNavLeave = (ev: React.MouseEvent<HTMLElement>) => {
    if (
      navRef.current &&
      ev.relatedTarget instanceof Node &&
      navRef.current.contains(ev.relatedTarget)
    ) {
      return;
    }

    const rect = navRef.current?.getBoundingClientRect();
    const edge =
      rect && ev.clientY - rect.top < rect.height / 2 ? "top" : "bottom";

    isOpenRef.current = false;
    closeOverlay(edge);
  };

  return (
    <div className="relative w-full">
      <nav
        ref={navRef}
        onMouseLeave={handleNavLeave}
        className="flex items-center justify-between font-sans text-sm"
      >
        <NavLink {...items[0]} onItemHover={handleItemHover} />
        <NavLink {...items[1]} onItemHover={handleItemHover} />
        <span aria-hidden="true" className="invisible">
          spacer
        </span>
        <NavLink {...items[2]} onItemHover={handleItemHover} />
        <NavLink {...items[3]} onItemHover={handleItemHover} />
      </nav>

      {/* Shared overlay. Initial hidden state is set directly in the
          inline style (scaleY(0) + visibility:hidden) so it is
          off-canvas on the very first paint, before any JS runs. */}
      <div
        ref={overlayRef}
        className="pointer-events-none absolute inset-y-0 -left-8 -right-8 z-20 flex items-center overflow-hidden bg-ink text-bg md:-left-16 md:-right-16"
        style={{
          transform: "scaleY(0)",
          visibility: "hidden",
        }}
      >
        <div
          ref={overlayInnerRef}
          className="flex w-full items-center overflow-hidden"
          style={{ transform: "translateY(0%)" }}
        >
          {/* Hidden probe: measures a single item's width, used only
              to calculate how many items are needed. */}
          <div
            ref={oneItemRef}
            className="pointer-events-none absolute -z-10 flex flex-shrink-0 items-center gap-2 px-6 opacity-0"
            aria-hidden="true"
          >
            <span className="font-mono-label text-xs">{current.number}</span>
            <span className="font-semibold uppercase">{current.label}</span>
          </div>

          <div
            ref={marqueeRef}
            className="flex w-max items-center will-change-transform"
          >
            <MarqueeSequence
              number={current.number}
              label={current.label}
              count={itemCount}
              innerRef={marqueeSequenceRef}
            />
            <MarqueeSequence
              number={current.number}
              label={current.label}
              count={itemCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}