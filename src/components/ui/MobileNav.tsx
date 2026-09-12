"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";

type MobileNavProps = {
  hidden?: boolean;
  onMenuToggle: () => void;
};

export default function MobileNav({ hidden, onMenuToggle }: MobileNavProps) {
  const navRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { y: -12, opacity: 0 });
    gsap.to(navRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      delay: 0.3,
      onComplete: () => {
        gsap.set(navRef.current, { clearProps: "opacity,transform" });
      },
    });
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-bg/70 px-8 py-5 font-sans text-xs backdrop-blur-md transition-opacity duration-200 md:hidden ${
        hidden
          ? "pointer-events-none opacity-0 delay-0"
          : "opacity-100 delay-250"
      }`}
    >
      <button type="button" onClick={scrollToTop} aria-label="Scroll to top">
        <p className="font-logo text-2xl">MORS.</p>
      </button>

      <button
        type="button"
        onClick={onMenuToggle}
        aria-label="Open menu"
        className="flex flex-col items-end gap-1.5"
      >
        <span
          style={{
            display: "block",
            height: "4px",
            width: "60px",
            backgroundColor: "#222222",
            borderRadius: "9999px",
          }}
        />
        <span
          style={{
            display: "block",
            height: "4px",
            width: "60px",
            backgroundColor: "#222222",
            borderRadius: "9999px",
          }}
        />
      </button>
    </div>
  );
}