import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

function notify() {
  listeners.forEach((cb) => cb());
}

const getSnapshot = () => document.documentElement.classList.contains("dark");
const getServerSnapshot = () => false;

export function useTheme() {
  const isDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleTheme = () => {
    const next = !isDark;

    const applyTheme = () => {
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      notify();
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

  return { isDark, toggleTheme };
}