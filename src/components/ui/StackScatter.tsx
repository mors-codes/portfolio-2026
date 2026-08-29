"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import TargetCursor from "@/components/ui/TargetCursor";
import "./StackScatter.css";

export interface StackIcon {
  name: string;
  /** Path under /public. Object form is for icons with separate light/dark assets. */
  icon: string | { light: string; dark: string };
  /** Fixed position as % of the scatter container (0–100). */
  x: number;
  y: number;
  /** Icon width/height in px. Defaults to 36 if omitted. */
  size?: number;
  /** Rotation in degrees. Defaults to 0 if omitted. */
  rotation?: number;
}

export interface StackCategory {
  key: string;
  label: string;
  icons: StackIcon[];
}

interface StackScatterProps {
  categories: StackCategory[];
  /** Href for the "view all tech stack" button. */
  viewAllHref?: string;
  /** Current theme, needed to resolve light/dark icon variants. */
  isDark: boolean;
}

function resolveIcon(icon: StackIcon["icon"], isDark: boolean): string {
  if (typeof icon === "string") return icon;
  return isDark ? icon.dark : icon.light;
}

export default function StackScatter({
  categories,
  viewAllHref = "/works",
  isDark,
}: StackScatterProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);

  const activeKey = locked ?? hovered;
  const isLocked = locked !== null;

  const activeCategory = categories.find((c) => c.key === activeKey);
  const activeIcons = activeCategory ? activeCategory.icons : [];

  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());

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

    const targetScale = isLocked ? 1.05 : 0.95;
    const targetOpacity = isLocked ? 1 : 0.85;

    gsap.to(els, {
      scale: targetScale,
      opacity: targetOpacity,
      duration: 0.35,
      ease: "back.out(1.5)",
      stagger: {
        each: 0.03,
        from: "random",
      },
      delay: () => Math.random() * 0.06 - 0.03,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeKey, isLocked]);

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
      <TargetCursor targetSelector=".cursor-target" showOnlyOnTarget />

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
              data-state={isLocked ? "active" : "preview"}
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
              {isLocked && (
                <span className="stack-scatter-icon-tooltip">{icon.name}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="stack-scatter-center">
        <span className="stack-scatter-badge">
          Hover a category to view its tools
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

        <a href={viewAllHref} className="stack-scatter-view-all cursor-target">
          View all tech stack
        </a>
      </div>
    </div>
  );
}