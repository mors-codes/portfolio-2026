"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

export type ThemeTransitionHandle = {
  play: () => void;
};

const DIAGONAL_OFFSET = 30;

const ThemeTransition = forwardRef<ThemeTransitionHandle>(
  function ThemeTransition(_props, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef({ p: -DIAGONAL_OFFSET });
    const activeTween = useRef<gsap.core.Tween | null>(null);
    const currentClone = useRef<HTMLElement | null>(null);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (!containerRef.current) return;

        activeTween.current?.kill();
        if (currentClone.current) {
          currentClone.current.remove();
          currentClone.current = null;
        }

        // Snapshot the current page BEFORE the theme flips.
        const clone = document.body.cloneNode(true) as HTMLElement;
        clone.style.pointerEvents = "none";
        clone.querySelectorAll("script").forEach((s) => s.remove());
        clone.querySelectorAll("*").forEach((node) => {
          node.removeAttribute("id");
        });

        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.top = "0";
        wrapper.style.left = "0";
        wrapper.style.width = "100%";
        wrapper.style.height = "100%";
        wrapper.style.overflow = "hidden";
        wrapper.style.zIndex = "9999";
        wrapper.appendChild(clone);
        containerRef.current.appendChild(wrapper);
        currentClone.current = wrapper;

        progressRef.current.p = -DIAGONAL_OFFSET;

        const applyClip = (p: number) => {
          wrapper.style.clipPath = `polygon(
            0% 0%,
            ${p + DIAGONAL_OFFSET}% 0%,
            ${p}% 100%,
            0% 100%
          )`;
        };

        applyClip(progressRef.current.p);

        activeTween.current = gsap.to(progressRef.current, {
          p: 100,
          duration: 1.1,
          ease: "power2.inOut",
          onUpdate: () => applyClip(progressRef.current.p),
          onComplete: () => {
            wrapper.remove();
            if (currentClone.current === wrapper) {
              currentClone.current = null;
            }
          },
        });
      },
    }));

    return <div ref={containerRef} aria-hidden="true" />;
  }
);

export default ThemeTransition;