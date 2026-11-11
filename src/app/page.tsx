"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/lib/useTheme";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Works from "@/components/sections/Works";
import Stack from "@/components/sections/Stack";
import Contact from "@/components/sections/Contact";
import PillNav from "@/components/ui/PillNav";
import MobileNav from "@/components/ui/MobileNav";
import StaggeredMenu, {
  type StaggeredMenuHandle,
} from "@/components/ui/StaggeredMenu";

export default function Home() {
  const [pastHero, setPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<StaggeredMenuHandle>(null);
  const { isDark, toggleTheme } = useTheme();

  const handleMenuToggle = () => {
    menuRef.current?.toggle();
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
      <div className="hidden md:block">
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
      </div>
      <MobileNav
        hidden={menuOpen}
        onMenuToggle={handleMenuToggle}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
      <div id="hero">
        <Hero isDark={isDark} onToggleTheme={toggleTheme} />
      </div>
      <div id="about" className="-scroll-mt-7 max-md:scroll-mt-15">
        <About />
      </div>
      <div id="works" className="-scroll-mt-17 max-md:-scroll-mt-10">
        <Works />
      </div>
      <div id="stack" className="-scroll-mt-17 max-md:scroll-mt-0">
        <Stack isDark={isDark} />
      </div>
      <div id="contact" className="-scroll-mt-17">
        <Contact />
      </div>
      <StaggeredMenu
        ref={menuRef}
        onOpenChange={setMenuOpen}
        colors={["#3a3a3a", "#2a2a2a"]}
        items={[
          { label: "About", ariaLabel: "Go to About section", link: "#about" },
          { label: "Works", ariaLabel: "Go to Works section", link: "#works" },
          { label: "Stack", ariaLabel: "Go to Stack section", link: "#stack" },
          {
            label: "Contact",
            ariaLabel: "Go to Contact section",
            link: "#contact",
          },
        ]}
        socialItems={[
          { label: "GitHub", link: "https://github.com/mors-codes" },
          { label: "Facebook", link: "https://www.facebook.com/mors.matias" },
        ]}
        displaySocials
        displayItemNumbering
      />
    </main>
  );
}