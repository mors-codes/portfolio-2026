"use client";

import { useMemo, useState } from "react";
import TargetCursor from "@/components/ui/TargetCursor";
import "./StackScatter.css";

export interface StackIcon {
  name: string;
  /** Path under /public, or an imported SVG/React component — swap in your own asset here. */
  icon: string;
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
}

interface Placement {
  x: number;
  y: number;
}

function placementsFor(count: number, seed: number): Placement[] {
  // Category block sits dead-center now (no offset pill cluster),
  // so icons just need to clear a radius around the center block.
  const exclusionRadius = 30; // % of container to keep clear around center

  const placements: Placement[] = [];
  for (let i = 0; i < count; i++) {
    const rand1 = ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;
    const rand2 = ((seed * (i + 3) * 4111 + 12345) % 233280) / 233280;

    const angle = rand1 * Math.PI * 2;
    const dist = exclusionRadius + rand2 * 20; // just outside the exclusion zone out to the edges

    const x = Math.min(94, Math.max(6, 50 + Math.cos(angle) * dist));
    const y = Math.min(94, Math.max(6, 50 + Math.sin(angle) * dist));

    placements.push({ x, y });
  }
  return placements;
}

export default function StackScatter({ categories, viewAllHref = "/works" }: StackScatterProps) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [locked, setLocked] = useState<string | null>(null);

  const activeKey = locked ?? hovered;
  const isLocked = locked !== null;

  const activeIcons = useMemo(() => {
    if (!activeKey) return [];
    const cat = categories.find((c) => c.key === activeKey);
    if (!cat) return [];
    const placements = placementsFor(cat.icons.length, cat.icons.length);
    return cat.icons.map((icon, i) => ({ ...icon, placement: placements[i] }));
  }, [activeKey, categories]);

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
              left: `${icon.placement.x}%`,
              top: `${icon.placement.y}%`,
              transform: "translate(-50%, -50%)",
              transitionDelay: `${i * 60}ms`,
            }}
          >
            {/* Swap this for <img src={icon.icon} /> or an imported SVG component once real assets are in. */}
            <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>
              {icon.name.charAt(0)}
            </span>
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