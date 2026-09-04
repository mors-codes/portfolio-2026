"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import "./PillNav.css";

type PillNavItem = {
  label: string;
  href: string;
};

type PillNavProps = {
  items: PillNavItem[];
  visible: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function PillNav({
  items,
  visible,
  isDark,
  onToggleTheme,
}: PillNavProps) {
const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRefs = useRef<(gsap.core.Timeline | null)[]>([]);
  const activeTweenRefs = useRef<(gsap.core.Tween | null)[]>([]);
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  const logoButtonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const ease = "power3.out";

  useLayoutEffect(() => {
    if (!logoButtonRef.current || !listRef.current) return;
    gsap.set(logoButtonRef.current, { scale: 0 });
    gsap.set(listRef.current, { width: 0, overflow: "hidden" });
  }, []);

  useEffect(() => {
    if (!logoButtonRef.current || !listRef.current) return;

    if (visible) {
      gsap.to(logoButtonRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.set(listRef.current, { overflow: "hidden" });
      gsap.to(listRef.current, {
        width: "auto",
        duration: 0.6,
        ease: "power2.out",
      });
    } else {
      gsap.to(logoButtonRef.current, {
        scale: 0,
        duration: 0.6,
        ease: "power2.out",
      });
      gsap.to(listRef.current, {
        width: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [visible]);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta =
          Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`,
        });

        const label = pill.querySelector<HTMLElement>(".pill-label");
        const white = pill.querySelector<HTMLElement>(".pill-label-hover");

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(
          circle,
          { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: "auto" },
          0
        );

        if (label) {
          tl.to(
            label,
            { y: -(h + 8), duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(
            white,
            { y: 0, opacity: 1, duration: 2, ease, overwrite: "auto" },
            0
          );
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener("resize", layout);
    if (document.fonts?.ready) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    return () => window.removeEventListener("resize", layout);
  }, [items]);

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

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: "auto",
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: "auto",
    });
  };

  return (
    <div
      className="pill-nav-container transition-all duration-600"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: `translateX(-50%) translateY(${visible ? 0 : -12}px)`,
      }}
    >
      <nav className="pill-nav" aria-label="Primary">
        <div className="pill-nav-items">
          <ul ref={listRef} className="pill-list" role="menubar">
            {items.map((item, i) => (
              <li key={item.href}>
                <a
                  role="menuitem"
                  href={item.href}
                  className="pill"
                  onMouseEnter={() => handleEnter(i)}
                  onMouseLeave={() => handleLeave(i)}
                >
                  <span
                    className="hover-circle"
                    aria-hidden="true"
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack">
                    <span className="pill-label">{item.label}</span>
                    <span className="pill-label-hover" aria-hidden="true">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <button
          ref={logoButtonRef}
          type="button"
          className={`pill-logo cursor-pointer border-[3.5px] ${
            isDark
              ? "border-white bg-black text-white"
              : "border-black bg-white text-black"
          }`}
          aria-label="Toggle dark mode"
          onClick={onToggleTheme}
          style={{ position: "relative" }}
        >
          <svg
            ref={sunRef}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              opacity: isDark ? 1 : 0,
            }}
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
            style={{
              position: "absolute",
              opacity: isDark ? 0 : 1,
            }}
          >
            <path
              d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}