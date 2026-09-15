"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

type MobileNavProps = {
  hidden?: boolean;
  onMenuToggle: () => void;
};

export default function MobileNav({ hidden, onMenuToggle }: MobileNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  useLayoutEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { y: -12, opacity: 0 });
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      delay: 1,
      onComplete: () => {
        gsap.set(navRef.current, { clearProps: "opacity,transform" });
        setHasEntered(true);
      },
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={navRef}
      style={!hasEntered ? { opacity: 0, transform: "translateY(-12px)" } : undefined}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-bg/70 px-6 py-5 font-sans text-xs backdrop-blur-md md:hidden ${
        hasEntered
          ? `transition-opacity duration-200 ${hidden ? "pointer-events-none opacity-0 delay-0" : "opacity-100 delay-250"}`
          : ""
      }`}
    >
      <button type="button" onClick={scrollToTop} aria-label="Scroll to top">
        <p className="font-logo text-2xl">MORS.</p>
      </button>

      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open menu"
        className="flex flex-col items-end gap-2"
      >
        <span
          style={{
            display: "block",
            height: "2px",
            width: "60px",
            backgroundColor: "#222222",
            borderRadius: "9999px",
          }}
        />
        <span
          style={{
            display: "block",
            height: "2px",
            width: "60px",
            backgroundColor: "#222222",
            borderRadius: "9999px",
          }}
        />
      </button>
    </div>
  );
}