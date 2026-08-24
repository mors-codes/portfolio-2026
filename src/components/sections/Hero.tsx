"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import NavRow from "@/components/ui/NavRow";
import AnimatedName from "@/components/ui/AnimatedName";

export default function Hero() {
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const logoRef = useRef<HTMLParagraphElement>(null);
  const folioRef = useRef<HTMLDivElement>(null);
  const roleLabelsRef = useRef<HTMLParagraphElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const yearRef = useRef<HTMLParagraphElement>(null);
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
    if (eyebrowRef.current) gsap.set(eyebrowRef.current, { y: -12, opacity: 0 });
    if (logoRef.current) gsap.set(logoRef.current, { y: -12, opacity: 0 });
    if (folioRef.current) gsap.set(folioRef.current, { y: -12, opacity: 0 });
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
      0.1
    );

    if (roleLabelsRef.current) {
      tl.to(
        roleLabelsRef.current,
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.9
      );
    }

    if (yearRef.current) {
      tl.to(
        yearRef.current,
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        1.3
      );
    }

    tl.to(
      [eyebrowRef.current, logoRef.current, folioRef.current].filter(Boolean),
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08 },
      1.5
    );

    if (illustrationRef.current) {
      tl.to(
        illustrationRef.current,
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        1.8
      );
    }

    if (navWrapRef.current) {
      tl.to(
        navWrapRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        2.1
      );
    }
    }, []);

  return (
    <section className="relative min-h-screen px-8 py-10 md:px-16 md:py-12">
      {/* Top row: eyebrow / logo / folio label */}
      <div className="relative flex items-start font-sans text-xs">
        <p
          ref={eyebrowRef}
          className="max-w-[160px] font-medium leading-snug"
          style={{ opacity: 0, transform: "translateY(-12px)" }}
        >
          Open for work and collaborations
        </p>

        <p
          ref={logoRef}
          className="absolute left-1/2 -translate-x-1/2 font-logo text-2xl"
          style={{ opacity: 0 }}
        >
          MORS.
        </p>

        <div
          ref={folioRef}
          className="ml-auto font-medium leading-tight"
          style={{ opacity: 0, transform: "translateY(-12px)" }}
        >
          <p className="pl-[30px]">-FOLIO</p>
          <p>PORTO</p>
        </div>
      </div>

      {/* Role labels + Name lockup + year, sharing one centered block */}
      <div className="mt-16 flex justify-center md:mt-20">
        <div className="inline-block text-left">
          <p
            ref={roleLabelsRef}
            className="mb-2 ml-2 flex items-center gap-5 font-sans text-sm"
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
            className="-mt-4 text-right font-sans text-sm font-bold"
            style={{ opacity: 0, transform: "translateX(24px)" }}
          >
            2026
          </p>
        </div>
      </div>

      {/* Illustration + Numbered nav row, nav vertically centered on illustration */}
      <div className="relative mt-8">
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
            className="h-auto w-full max-w-[300px]"
          />
        </div>

        <div
          ref={navWrapRef}
          id="hero-nav-row"
          className="absolute inset-y-0 left-0 right-0 flex items-center"
          style={{ opacity: 0, transform: "translateY(16px)" }}
        >
          <NavRow />
        </div>
      </div>
    </section>
  );
}