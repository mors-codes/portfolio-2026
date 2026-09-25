"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StackScatter from "@/components/ui/StackScatter";
import { stackCategories } from "@/data/stackData";

gsap.registerPlugin(ScrollTrigger);

interface StackProps {
  isDark: boolean;
}

export default function Stack({ isDark }: StackProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const scatterWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    gsap.set(eyebrowRef.current, { y: 32, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    gsap.set(scatterWrapRef.current, { opacity: 1 });

    tl.to(eyebrowRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      onComplete: () => {
        window.dispatchEvent(new CustomEvent("stack-eyebrow-done"));
      },
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-8 py-12 md:min-h-screen md:py-24 md:px-16"
    >
      <p
        ref={eyebrowRef}
        className="flex items-center gap-2 text-4xl text-[#B5B5B5]"
      >
        <span className="font-mono-label">03</span>
        <span className="font-sans font-thin">—</span>
        <span className="font-display font-black -tracking-widest">
          TechStack
        </span>
      </p>

      <div ref={scatterWrapRef}>
        <StackScatter categories={stackCategories} isDark={isDark} />
      </div>
    </section>
  );
}