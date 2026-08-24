"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

type ThemeToggleProps = {
  isDark: boolean;
  onToggleTheme: (e?: React.MouseEvent) => void;
  visible: boolean;
};

export default function ThemeToggle({
  isDark,
  onToggleTheme,
  visible,
}: ThemeToggleProps) {
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.7)",
      delay: 2.7,
    });
  }, []);

  useEffect(() => {
    if (!sunRef.current || !moonRef.current) return;

    const showing = isDark ? sunRef.current : moonRef.current;
    const hiding = isDark ? moonRef.current : sunRef.current;

    gsap.to(hiding, {
      opacity: 0,
      rotate: -90,
      duration: 0.3,
      ease: "power2.in",
      overwrite: "auto",
    });
    gsap.fromTo(
      showing,
      { opacity: 0, rotate: 90 },
      {
        opacity: 1,
        rotate: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      }
    );
  }, [isDark]);

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={onToggleTheme}
      aria-label="Toggle dark mode"
      className="fixed bottom-6 left-6 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-ink text-bg transition-opacity duration-300"
      style={{
        opacity: 0,
        scale: 0,
        pointerEvents: visible ? "auto" : "none",
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <span className="relative block h-[18px] w-[18px]">
        <svg
          ref={sunRef}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
          style={{ opacity: isDark ? 1 : 0 }}
        >
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <svg
          ref={moonRef}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
          style={{ opacity: isDark ? 0 : 1 }}
        >
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>
  );
}