"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

const themeListeners = new Set<() => void>();

function subscribeToThemeChange(callback: () => void) {
  themeListeners.add(callback);
  return () => themeListeners.delete(callback);
}

function notifyThemeChange() {
  themeListeners.forEach((cb) => cb());
}

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import PillNav from "@/components/ui/PillNav";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Home() {
  const [pastHero, setPastHero] = useState(false);
  const isDark = useSyncExternalStore(
    subscribeToThemeChange,
    () => document.documentElement.classList.contains("dark"),
    () => false
  );

    const toggleTheme = () => {
    const next = !isDark;

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      notifyThemeChange();
    };

    if (
      "startViewTransition" in document &&
      typeof document.startViewTransition === "function"
    ) {
      const glint = document.createElement("div");
      glint.className = "sword-glint slicing";
      document.body.appendChild(glint);
      setTimeout(() => glint.remove(), 1000);
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

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
        isDark={isDark}
        onToggleTheme={toggleTheme}
        items={[
          { label: "Home", href: "#hero" },
          { label: "About", href: "#about" },
          { label: "Works", href: "#works" },
          { label: "Stack", href: "#stack" },
          { label: "Contact", href: "#contact" },
        ]}
      />
      <ThemeToggle
        visible={!pastHero}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <div id="hero">
        <Hero />
      </div>
      <div id="about" className="scroll-mt-5">
        <About />
      </div>
      <div id="works" className="-scroll-mt-5">
        <Works />
      </div>
      <div id="stack" className="-scroll-mt-5">
        <Stack isDark={isDark} />
      </div>
      <div id="contact" className="-scroll-mt-5">
        <Contact />
      </div>
    </main>
  );
}