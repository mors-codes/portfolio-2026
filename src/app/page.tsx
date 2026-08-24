"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import PillNav from "@/components/ui/PillNav";

export default function Home() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero-nav-row");
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    observer.observe(heroEl);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-bg text-ink">
      <PillNav
        visible={pastHero}
        items={[
          { label: "Home", href: "#hero" },
          { label: "About", href: "#about" },
          { label: "Works", href: "#works" },
          { label: "Stack", href: "#stack" },
          { label: "Contact", href: "#contact" },
        ]}
      />
      <div id="hero">
        <Hero />
      </div>
      <div id="about" className="scroll-mt-5">
        <About />
      </div>
      <div id="works" className="scroll-mt-10">
        <Works />
      </div>
      <div id="stack" className="scroll-mt-24">
        <Stack />
      </div>
      <div id="contact" className="scroll-mt-24">
        <Contact />
      </div>
    </main>
  );
}