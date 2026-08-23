"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

type PixelTransitionProps = {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
};

export default function PixelTransition({
  firstContent,
  secondContent,
  gridSize = 8,
  pixelColor = "#EFEFEF",
  animationStepDuration = 0.4,
  once = false,
  className = "",
}: PixelTransitionProps) {
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const pixelGridEl = pixelGridRef.current;
    if (!pixelGridEl) return;
    pixelGridEl.innerHTML = "";
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const pixel = document.createElement("div");
        pixel.style.position = "absolute";
        pixel.style.display = "none";
        pixel.style.backgroundColor = pixelColor;
        const size = 100 / gridSize;
        pixel.style.width = `${size}%`;
        pixel.style.height = `${size}%`;
        pixel.style.left = `${col * size}%`;
        pixel.style.top = `${row * size}%`;
        pixelGridEl.appendChild(pixel);
      }
    }
  }, [gridSize, pixelColor]);

  const animatePixels = (activate: boolean) => {
    setIsActive(activate);
    const pixelGridEl = pixelGridRef.current;
    const activeEl = activeRef.current;
    if (!pixelGridEl || !activeEl) return;

    const pixels = pixelGridEl.children;
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    if (delayedCallRef.current) delayedCallRef.current.kill();

    gsap.set(pixels, { display: "none" });

    const totalPixels = pixels.length;
    const staggerDuration = animationStepDuration / totalPixels;

    gsap.to(pixels, {
      display: "block",
      duration: 0,
      stagger: { each: staggerDuration, from: "random" },
    });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      activeEl.style.display = activate ? "block" : "none";
      activeEl.style.pointerEvents = activate ? "none" : "";
    });

    gsap.to(pixels, {
      display: "none",
      duration: 0,
      delay: animationStepDuration,
      stagger: { each: staggerDuration, from: "random" },
    });
  };

  const handleEnter = () => {
    if (!isActive) animatePixels(true);
  };
  const handleLeave = () => {
    if (isActive && !once) animatePixels(false);
  };

  return (
    <div
      className={`relative h-full w-full ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div className="absolute inset-0" aria-hidden={isActive}>
        {firstContent}
      </div>
      <div
        className="absolute inset-0 z-[2] hidden"
        ref={activeRef}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>
      <div
        className="pointer-events-none absolute inset-0 z-[3]"
        ref={pixelGridRef}
      />
    </div>
  );
}