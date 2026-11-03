"use client";

import { useSyncExternalStore } from "react";
import { ArrowUp } from "lucide-react";

// Pixels scrolled before the button appears.
const SHOW_AFTER = 400;

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const getSnapshot = () => window.scrollY > SHOW_AFTER;
const getServerSnapshot = () => false;

export default function ScrollToTop() {
  const visible = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const scrollUp = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <button
      type="button"
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={scrollUp}
      className={`fixed right-6 bottom-6 z-40 grid h-12 w-12 place-items-center border-[2px] border-ink bg-bg text-ink transition-all duration-300 hover:bg-ink hover:text-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink md:right-8 md:bottom-8 ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={20} strokeWidth={2.5} aria-hidden="true" />
    </button>
  );
}