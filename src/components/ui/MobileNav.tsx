"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";

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

  useLayoutEffect(() => {
    const vv = window.visualViewport;
    if (!vv || !navRef.current) return;

    let frame: number;
    const syncPosition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (navRef.current) {
          navRef.current.style.top = `${vv.offsetTop}px`;
        }
      });
    };

    syncPosition();
    vv.addEventListener("resize", syncPosition);
    vv.addEventListener("scroll", syncPosition);

    return () => {
      cancelAnimationFrame(frame);
      vv.removeEventListener("resize", syncPosition);
      vv.removeEventListener("scroll", syncPosition);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={navRef}
      style={!hasEntered ? { opacity: 0, transform: "translateY(-12px)" } : undefined}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-bg/70 px-6 py-5 font-sans text-xs backdrop-blur-md transition-[top] duration-100 ease-out md:hidden ${
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
        <Image src="/icons/menu.svg" alt="" width={65} height={24} />
      </button>
    </div>
  );
}