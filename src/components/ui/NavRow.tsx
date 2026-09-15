"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import NavLink from "./NavLink";

const items = [
  { href: "#about", number: "01", label: "About" },
  { href: "#works", number: "02", label: "Works" },
  { href: "#stack", number: "03", label: "Stack" },
  { href: "#contact", number: "04", label: "Contact" },
];

export default function NavRow() {
  const barRef = useRef<HTMLDivElement>(null);
  const ghostTextRef = useRef<HTMLDivElement>(null);
  const barTweenRef = useRef<gsap.core.Timeline | null>(null);
  const [current, setCurrent] = useState("About");
  const [isOpen, setIsOpen] = useState(false);

  const animationDefaults = { duration: 0.6, ease: "expo.out" };

  const openBar = (label: string) => {
    if (!barRef.current) return;
    setCurrent(label);
    setIsOpen(true);

    barTweenRef.current?.kill();
    barTweenRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to(barRef.current, { scaleY: 1 }, 0)
      .to(ghostTextRef.current, { opacity: 1, duration: 0.5 }, 0.15);
  };

  const closeBar = () => {
    if (!barRef.current) return;
    setIsOpen(false);

    barTweenRef.current?.kill();
    barTweenRef.current = gsap
      .timeline({ defaults: animationDefaults })
      .to(ghostTextRef.current, { opacity: 0, duration: 0.3 }, 0)
      .to(barRef.current, { scaleY: 0 }, 0.1);
  };

  const handleItemHover = (label: string) => {
    openBar(label);
  };

  return (
    <div className="relative w-full py-4" onMouseLeave={closeBar}>
      {/* Bar: grows from vertical center, sits behind the nav links. Desktop only — no hover on touch. */}
      <div
        ref={barRef}
        className="pointer-events-none absolute inset-y-0 -left-8 -right-8 z-10 hidden items-center justify-center overflow-hidden bg-ink md:-left-16 md:-right-16 md:flex"
        style={{ transform: "scaleY(0)", transformOrigin: "center" }}
      >
        <div
          ref={ghostTextRef}
          className="whitespace-nowrap font-display font-light tracking-[-0.15em] text-neutral-500"
          style={{
            opacity: 0,
            fontSize: "clamp(3rem, 17vh, 12vw)",
            lineHeight: 1,
          }}
        >
          {current}
        </div>
      </div>

      {/* Nav links: 2x2 grid on mobile, single row on desktop */}
      <nav
        className={`relative z-20 grid grid-cols-2 gap-y-6 font-sans text-base transition-colors duration-300 md:flex md:items-center md:justify-between md:gap-y-0 md:text-lg ${
          isOpen ? "md:text-bg" : "text-ink"
        }`}
      >
        <NavLink {...items[0]} onItemHover={handleItemHover} />
        <NavLink {...items[1]} onItemHover={handleItemHover} />
        <span aria-hidden="true" className="hidden md:invisible md:inline">
          spacer
        </span>
        <NavLink {...items[2]} onItemHover={handleItemHover} />
        <NavLink {...items[3]} onItemHover={handleItemHover} />
      </nav>
    </div>
  );
}