"use client";

import { useState } from "react";
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
        {activeIcons.map((icon, i) => (
          <div
            key={icon.name}
            className="stack-scatter-icon"
            data-state={isLocked ? "active" : "preview"}
            style={{
              left: `${icon.x}%`,
              top: `${icon.y}%`,
              width: icon.size ?? 36,
              height: icon.size ?? 36,
              transform: "translate(-50%, -50%)",
              transitionDelay: `${i * 60}ms`,
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