"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TargetCursor from "@/components/ui/TargetCursor";
import { stackBlockCategories } from "@/data/stackBlockData";
import "./StackScatter.css";

export interface StackIcon {
  name: string;
  icon: string | { light: string; dark: string };
  x: number;
  y: number;
  size?: number;
  rotation?: number;
}

export interface StackCategory {
  key: string;
  label: string;
  icons: StackIcon[];
}

interface StackScatterProps {
  categories: StackCategory[];
  isDark: boolean;
}

function resolveIcon(icon: StackIcon["icon"], isDark: boolean): string {
  if (typeof icon === "string") return icon;
  return isDark ? icon.dark : icon.light;
}

export default function StackScatter({
  categories,
  isDark,
}: StackScatterProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);
  const [view, setView] = useState<"scatter" | "block">("scatter");

  const activeKey = locked ?? hovered;
  const isLocked = locked !== null;

  const [displayedKey, setDisplayedKey] = useState<string | null>(null);
  const [displayedLocked, setDisplayedLocked] = useState(false);

  const displayedCategory = categories.find((c) => c.key === displayedKey);
  const activeIcons = displayedCategory ? displayedCategory.icons : [];

  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const transitionTokenRef = useRef(0);

  const scatterRootRef = useRef<HTMLDivElement>(null);
  const blockRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = ++transitionTokenRef.current;
    const currentEls = Array.from(iconRefs.current.values());

    if (currentEls.length === 0) {
      setDisplayedKey(activeKey);
      setDisplayedLocked(isLocked);
      return;
    }

    gsap.killTweensOf(currentEls);
    gsap.to(currentEls, {
      scale: 0,
      opacity: 0,
      duration: 0.2,
      ease: "power3.in",
      onComplete: () => {
        if (transitionTokenRef.current !== token) return;
        setDisplayedKey(activeKey);
        setDisplayedLocked(isLocked);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey]);

  useEffect(() => {
    const els = activeIcons
      .map((icon) => iconRefs.current.get(icon.name))
      .filter((el): el is HTMLDivElement => Boolean(el));

    if (els.length === 0) return;

    gsap.killTweensOf(els);
    gsap.set(els, {
      scale: 0,
      opacity: 0,
      transformOrigin: "50% 50%",
    });

    const targetScale = displayedLocked ? 1.05 : 0.95;
    const targetOpacity = displayedLocked ? 1 : 0.85;

    gsap.to(els, {
      scale: targetScale,
      opacity: targetOpacity,
      duration: 0.5,
      ease: "back.out(1.5)",
      stagger: {
        each: 0.03,
        from: "random",
      },
      delay: () => Math.random() * 0.06 - 0.03,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedKey, displayedLocked]);

  // Toggle between scatter and block view with a crossfade.
  useEffect(() => {
    const scatterEl = scatterRootRef.current;
    const blockEl = blockRootRef.current;
    if (!scatterEl || !blockEl) return;

    gsap.killTweensOf([scatterEl, blockEl]);

    if (view === "block") {
      gsap.set(blockEl, { display: "grid" });
      gsap.fromTo(
        blockEl,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
      gsap.to(scatterEl, {
        opacity: 0,
        duration: 0.25,
        ease: "power3.in",
        onComplete: () => gsap.set(scatterEl, { display: "none" }),
      });
    } else {
      gsap.set(scatterEl, { display: "block" });
      gsap.fromTo(
        scatterEl,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: "power3.out" }
      );
      gsap.to(blockEl, {
        opacity: 0,
        y: 12,
        duration: 0.25,
        ease: "power3.in",
        onComplete: () => gsap.set(blockEl, { display: "none" }),
      });
    }
  }, [view]);

  function handleCategoryEnter(key: string) {
    if (!isLocked) setHovered(key);
  }

  function handleCategoryLeave() {
    if (!isLocked) setHovered(null);
  }

  function handleCategoryClick(key: string) {
    if (locked === key) {
      setLocked(null);
    } else {
      setLocked(key);
      setHovered(null);
    }
  }

  return (
    <div className="stack-scatter-container">
      <TargetCursor
        targetSelector=".cursor-target"
        showOnlyOnTarget
        cursorColor={isDark ? "#efefef" : "#222222"}
      />

      <div ref={scatterRootRef} style={{ display: "block" }}>
        <div className="stack-scatter-icon-layer">
          {activeIcons.map((icon) => (
            <div
              key={icon.name}
              className="stack-scatter-icon-wrapper"
              style={{
                left: `${icon.x}%`,
                top: `${icon.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                ref={(el) => {
                  if (el) iconRefs.current.set(icon.name, el);
                  else iconRefs.current.delete(icon.name);
                }}
                className="stack-scatter-icon"
                data-state={displayedLocked ? "active" : "preview"}
                style={{
                  width: icon.size ?? 36,
                  height: icon.size ?? 36,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveIcon(icon.icon, isDark)}
                  alt={icon.name}
                  width={icon.size ?? 36}
                  height={icon.size ?? 36}
                  draggable={false}
                  style={{ transform: `rotate(${icon.rotation ?? 0}deg)` }}
                />
                {displayedLocked && (
                  <span className="stack-scatter-icon-tooltip">{icon.name}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="stack-scatter-center">
          <span className="stack-scatter-badge">
            The tools and platforms that shaped how I build.
          </span>

          <div className="stack-scatter-category-list">
            {categories.map((cat) => {
              const state =
                locked === cat.key
                  ? "active"
                  : activeKey === cat.key
                    ? "hover"
                    : "idle";
              return (
                <button
                  key={cat.key}
                  type="button"
                  className="stack-scatter-category cursor-target"
                  data-state={state}
                  onMouseEnter={() => handleCategoryEnter(cat.key)}
                  onMouseLeave={handleCategoryLeave}
                  onClick={() => handleCategoryClick(cat.key)}
                  aria-pressed={locked === cat.key}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="stack-scatter-view-all"
            onClick={() => setView("block")}
          >
            View all tech stack
          </button>
        </div>
      </div>

      <div
        ref={blockRootRef}
        className="stack-block-view"
        style={{ display: "none" }}
      >
        <button
          type="button"
          className="stack-block-back cursor-target"
          onClick={() => setView("scatter")}
        >
          ← Back
        </button>

        {stackBlockCategories.map((cat) => (
          <div key={cat.key} className="stack-block-category">
            <h3 className="stack-block-category-label">{cat.label}</h3>
            <div className="stack-block-pill-row">
              {cat.tools.map((tool) => (
                <span key={tool.name} className="stack-block-pill">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolveIcon(tool.icon, isDark)}
                    alt=""
                    width={18}
                    height={18}
                  />
                  {tool.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}