"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import NavRow from "@/components/ui/NavRow";
import AnimatedName from "@/components/ui/AnimatedName";
import ThemeToggle from "@/components/ui/ThemeToggle";

type HeroProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function Hero({ isDark, onToggleTheme }: HeroProps) {
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const roleLabelsRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
  const nameBlockRef = useRef<HTMLDivElement>(null);
  const illustrationRef = useRef<HTMLDivElement>(null);
  const navWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!nameRef.current) return;
    const letters = nameRef.current.querySelectorAll(".letter");
    if (letters.length === 0) return;

    const center = (letters.length - 1) / 2;
    const order = Array.from(letters)
      .map((el, i) => ({ el, distance: Math.abs(i - center) }))
      .sort((a, b) => a.distance - b.distance)
      .map((item) => item.el);

    gsap.set(letters, { y: "100%", opacity: 0 });
    if (roleLabelsRef.current) {
      gsap.set(roleLabelsRef.current, { x: -24, opacity: 0 });
    }
    if (yearRef.current) {
      gsap.set(yearRef.current, { x: 24, opacity: 0 });
    }
    if (eyebrowRef.current)
      gsap.set(eyebrowRef.current, { y: -12, opacity: 0 });
    if (logoRef.current) gsap.set(logoRef.current, { y: -12, opacity: 0 });
    if (illustrationRef.current) {
      gsap.set(illustrationRef.current, { y: 24, opacity: 0 });
    }
    if (navWrapRef.current) {
      gsap.set(navWrapRef.current, { y: 16, opacity: 0 });
    }

    const tl = gsap.timeline();

    tl.to(
      order,
      {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        ease: "back.out(1.7)",
        stagger: 0.035,
      },
      0.1,
    );

    if (roleLabelsRef.current) {
      tl.to(
        roleLabelsRef.current,
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.9,
      );
    }

    if (yearRef.current) {
      tl.to(
        yearRef.current,
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        1.3,
      );
    }

    tl.to(
      [eyebrowRef.current, logoRef.current].filter(Boolean),
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 },
      1.5,
    );

    if (illustrationRef.current) {
      tl.to(
        illustrationRef.current,
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        1.8,
      );
    }

    if (navWrapRef.current) {
      tl.to(
        navWrapRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        2.1,
      );
    }
  }, []);

  useLayoutEffect(() => {
    const applyNameStretch = () => {
    const h1 = nameRef.current;
    const wrapper = h1?.parentElement as HTMLElement | null;
    const container = nameBlockRef.current;
    if (!h1 || !wrapper || !container) return;

    wrapper.style.transform = "";
    wrapper.style.fontSize = "";

    if (window.innerWidth >= 768) return;

    const availableWidth = container.getBoundingClientRect().width;
    const naturalWidth = h1.scrollWidth;
    if (naturalWidth <= 0 || availableWidth <= 0) return;

    const currentSize = parseFloat(getComputedStyle(wrapper).fontSize);
    const scaleBoost = 0.95;
    wrapper.style.fontSize = `${currentSize * (availableWidth / naturalWidth) * scaleBoost}px`;
  };

    applyNameStretch();
    document.fonts?.ready?.then(applyNameStretch);

    window.addEventListener("resize", applyNameStretch);
    return () => window.removeEventListener("resize", applyNameStretch);
  }, []);

  return (
    <section className="relative min-h-screen px-8 py-10 md:px-16 md:py-12">
      {/* Top row: logo / eyebrow */}
      <div className="relative flex items-start font-sans text-xs">
        <p
          ref={logoRef}
          className="hidden font-logo text-2xl md:block"
          style={{ opacity: 0 }}
        >
          MORS.
        </p>

        <div
          ref={eyebrowRef}
          className="ml-auto hidden items-center gap-4 md:flex"
          style={{ opacity: 0, transform: "translateY(-12px)" }}
        >
          <p
            className="mr-3 max-w-40 text-right font-normal leading-tight"
            style={{ color: isDark ? "#a0a0a0" : "#8a8a8a" }}
          >
            Open for work and collaborations
          </p>
          <div
            className="h-6 w-0.5 shrink-0"
            style={{ backgroundColor: isDark ? "#3a3a3a" : "#dcdcdc" }}
          />
          <div className="flex shrink-0 items-center -translate-y-1">
            <ThemeToggle
              isDark={isDark}
              onToggleTheme={onToggleTheme}
              visible
              iconColor={isDark ? "#b8b8b8" : "#6a6a6a"}
            />
          </div>
        </div>
      </div>

      {/* Role labels + Name lockup + year, sharing one centered block */}
      <div className="mt-24 flex justify-center md:mt-20">
        <div ref={nameBlockRef} className="relative w-auto text-center md:inline-block">
          <p
            ref={roleLabelsRef}
            className="-mb-2 ml-4.5 flex w-auto flex-nowrap items-center gap-2 whitespace-nowrap font-sans text-[2.4vw] md:ml-[22.8px] md:mb-2 md:gap-5 md:text-sm"
            style={{ opacity: 0, transform: "translateX(-24px)" }}
          >
            <span>Full Stack Developer</span>
            <span>/</span>
            <span>UI Designer</span>
            <span>/</span>
            <span>AI Automation Specialist</span>
          </p>
          <AnimatedName ref={nameRef} />
          <p
            ref={yearRef}
            className="absolute right-[10.5px] bottom-1.5 w-auto text-right font-sans text-xs font-bold md:static md:right-auto md:-ml-4 md:-mt-4 md:text-sm"
            style={{ opacity: 0, transform: "translateX(24px)" }}
          >
            2026
          </p>
        </div>
      </div>

      {/* Illustration + Numbered nav row */}
      <div className="relative mt-4">
        <div
          ref={illustrationRef}
          className="flex justify-center"
          style={{ opacity: 0, transform: "translateY(24px)" }}
        >
          <Image
            src="/illustrations/hero-desk.svg"
            alt="Illustration of Moriss at his desk, working at a computer with his cat nearby"
            width={480}
            height={480}
            priority
            className="h-auto w-full max-w-85 md:max-w-75"
          />
        </div>

        <div
          ref={navWrapRef}
          id="hero-nav-row"
          className="mt-8 mb-6 md:absolute md:inset-y-0 md:left-0 md:right-0 md:mb-0 md:flex md:items-center"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <NavRow />
        </div>
      </div>

    </section>
  );
}
