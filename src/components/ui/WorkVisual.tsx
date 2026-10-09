"use client";

import { useId, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

/* -------------------------------------------------------------------------- */
/*  Data shapes — this is what you edit when adding a project's visual         */
/* -------------------------------------------------------------------------- */

export interface WorkScreen {
  /** Public path, e.g. "/images/works/app-home.png". Missing/broken = blank frame. */
  image?: string;
  /** Small frame name shown above the screen, like a Figma frame label. */
  label?: string;
}

export type WorkflowNodeKind = "trigger" | "ai" | "logic" | "action";

export interface WorkflowNode {
  /** Keep under ~20 characters so it fits the node. */
  label: string;
  kind?: WorkflowNodeKind;
}

/**
 * One entry per visual format. Pick the one that fits the project:
 *
 *   browser  – website / landing page         { type: "browser", image, url? }
 *   screens  – UI/UX, Figma (1–3 screens)     { type: "screens", screens: [{ image, label }] }
 *   phones   – mobile UI (1–3 phones)         { type: "phones", images: [...] }
 *   workflow – AI automation (2–5 nodes)      { type: "workflow", nodes: [{ label, kind }] }
 *   artwork  – graphic design / branding      { type: "artwork", image }
 */
export type WorkVisualData =
  | { type: "browser"; image: string; url?: string }
  | { type: "screens"; screens: WorkScreen[] }
  | { type: "phones"; images: string[] }
  | { type: "workflow"; nodes: WorkflowNode[] }
  | { type: "artwork"; image: string };

interface WorkVisualProps {
  visual: WorkVisualData;
  /** Project title, used for alt text. */
  title: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const IMAGE_SIZES = "(min-width: 1024px) 62vw, 100vw";

const FRAME_SHADOW = "shadow-[0_28px_60px_-28px_rgba(0,0,0,0.55)]";

/** Fills its (relatively positioned) parent. Falls back to a blank tint if the file is missing. */
function FrameImage({
  src,
  alt,
  fit = "cover",
}: {
  src?: string;
  alt: string;
  fit?: "cover" | "contain";
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <div aria-hidden="true" className="absolute inset-0 bg-ink/6" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={IMAGE_SIZES}
      onError={() => setFailed(true)}
      className={fit === "cover" ? "object-cover object-top" : "object-contain"}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  Browser — website / landing page                                           */
/* -------------------------------------------------------------------------- */

function BrowserVisual({
  image,
  title,
}: {
  image: string;
  url?: string;
  title: string;
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${FRAME_SHADOW}`}>
      <FrameImage src={image} alt={`${title} website`} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Screens — UI/UX, Figma                                                     */
/* -------------------------------------------------------------------------- */

interface ScreenSlot {
  left: number;
  top: number;
  width: number;
  ratio: string;
}

/** Positions are percentages of a 5:4 composition box. */
const SCREEN_SLOTS: Record<1 | 2 | 3, ScreenSlot[]> = {
  1: [{ left: 0, top: 10, width: 100, ratio: "16 / 10" }],
  2: [
    { left: 0, top: 8, width: 66, ratio: "4 / 3" },
    { left: 42, top: 38, width: 58, ratio: "16 / 10" },
  ],
  3: [
    { left: 0, top: 12, width: 60, ratio: "4 / 3" },
    { left: 44, top: 5, width: 56, ratio: "16 / 10" },
    { left: 24, top: 52, width: 60, ratio: "16 / 10" },
  ],
};

function ScreensVisual({
  screens,
  title,
}: {
  screens: WorkScreen[];
  title: string;
}) {
  const shown = screens.slice(0, 3);
  const slots = SCREEN_SLOTS[Math.max(shown.length, 1) as 1 | 2 | 3];

  return (
    <div className="relative aspect-5/4 w-[min(90cqw,112cqh)]">
      {shown.map((screen, i) => {
        const slot = slots[i];
        return (
          <figure
            key={i}
            className={`absolute m-0 border border-ink/25 bg-bg ${FRAME_SHADOW}`}
            style={{
              left: `${slot.left}%`,
              top: `${slot.top}%`,
              width: `${slot.width}%`,
              aspectRatio: slot.ratio,
              zIndex: i + 1,
            }}
          >
            {screen.label && (
              <figcaption className="absolute -top-5 left-0 bg-bg pr-1.5 font-sans text-[11px] leading-4 text-ink/50">
                {screen.label}
              </figcaption>
            )}
            <div className="absolute inset-0 overflow-hidden">
              <FrameImage
                src={screen.image}
                alt={screen.label ?? `${title} screen ${i + 1}`}
              />
            </div>
          </figure>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phones — mobile UI                                                         */
/* -------------------------------------------------------------------------- */

const PHONE_RATIO = 19.5 / 9;

function PhonesVisual({ images, title }: { images: string[]; title: string }) {
  const shown = images.slice(0, 3);
  const count = Math.max(shown.length, 1);
  // Cap each phone's width so the row never overflows the stage.
  const maxWidthCqw = (90 - (count - 1) * 4) / count;
  const height = `min(86cqh, ${(maxWidthCqw * PHONE_RATIO).toFixed(1)}cqw)`;

  return (
    <div className="flex h-full w-full items-center justify-center gap-[4cqw]">
      {shown.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`relative aspect-9/19.5 shrink-0 overflow-hidden rounded-[14%/6.5%] border-[3px] border-ink bg-bg ${FRAME_SHADOW} ${
            count === 1
              ? ""
              : i % 2 === 1
                ? "translate-y-[5%]"
                : "translate-y-[-4%]"
          }`}
          style={{ height }}
        >
          <span
            aria-hidden="true"
            className="absolute top-[2.2%] left-1/2 z-10 h-[1.6%] w-[28%] -translate-x-1/2 rounded-full bg-ink"
          />
          <FrameImage src={src} alt={`${title} mobile screen ${i + 1}`} />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Workflow — AI automation                                                   */
/* -------------------------------------------------------------------------- */

const WF = {
  width: 800,
  height: 500,
  pad: 48,
  nodeW: 196,
  nodeH: 56,
  max: 5,
} as const;

function WorkflowVisual({
  nodes,
  title,
}: {
  nodes: WorkflowNode[];
  title: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const rawId = useId();
  const patternId = `wf-dots-${rawId.replace(/:/g, "")}`;

  const shown = nodes.slice(0, WF.max);
  const count = shown.length;
  const stepX =
    count > 1
      ? Math.min(190, (WF.width - WF.pad * 2 - WF.nodeW) / (count - 1))
      : 0;
  const stepY =
    count > 1
      ? Math.min(130, (WF.height - WF.pad * 2 - WF.nodeH) / (count - 1))
      : 0;
  const originX = (WF.width - ((count - 1) * stepX + WF.nodeW)) / 2;
  const originY = (WF.height - ((count - 1) * stepY + WF.nodeH)) / 2;
  const points = shown.map((_, i) => ({
    x: originX + i * stepX,
    y: originY + i * stepY,
  }));

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(".wf-flow", {
        strokeDashoffset: -24,
        duration: 1.2,
        ease: "none",
        repeat: -1,
      });
    }, svgRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="h-full w-full overflow-hidden border-[3px] border-ink bg-bg text-ink">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WF.width} ${WF.height}`}
        className="h-full w-full"
        role="img"
        aria-label={`${title} workflow: ${shown.map((n) => n.label).join(", then ")}`}
      >
        <defs>
          <pattern
            id={patternId}
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.2" className="fill-ink" opacity="0.18" />
          </pattern>
        </defs>
        <rect
          width={WF.width}
          height={WF.height}
          fill={`url(#${patternId})`}
        />

        {shown.map((node, i) => {
          const { x, y } = points[i];
          const inverted = node.kind === "ai";
          return (
            <g key={`${node.label}-${i}`}>
              <rect
                x={x}
                y={y}
                width={WF.nodeW}
                height={WF.nodeH}
                strokeWidth="3"
                className={`stroke-ink ${inverted ? "fill-ink" : "fill-bg"}`}
              />
              <text
                x={x + 16}
                y={y + 21}
                fontSize="10"
                letterSpacing="1"
                className={`font-mono-label ${inverted ? "fill-bg" : "fill-ink"}`}
                opacity="0.6"
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              {node.kind && (
                <text
                  x={x + WF.nodeW - 16}
                  y={y + 21}
                  fontSize="11"
                  textAnchor="end"
                  className={`font-sans ${inverted ? "fill-bg" : "fill-ink"}`}
                  opacity="0.6"
                >
                  {node.kind}
                </text>
              )}
              <text
                x={x + 16}
                y={y + 42}
                fontSize="17"
                fontWeight="500"
                className={`font-sans ${inverted ? "fill-bg" : "fill-ink"}`}
              >
                {node.label}
              </text>
            </g>
          );
        })}

        {points.slice(0, -1).map((from, i) => {
          const to = points[i + 1];
          const sx = from.x + WF.nodeW / 2;
          const sy = from.y + WF.nodeH;
          const ex = to.x;
          const ey = to.y + WF.nodeH / 2;
          return (
            <g key={i}>
              <path
                d={`M${sx} ${sy} Q${sx} ${ey} ${ex} ${ey}`}
                className="wf-flow stroke-ink"
                fill="none"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                strokeLinecap="round"
              />
              <circle cx={sx} cy={sy} r="4" className="fill-ink" />
              <circle cx={ex} cy={ey} r="4" className="fill-ink" />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Artwork — graphic design / branding (shown directly, no mockup)            */
/* -------------------------------------------------------------------------- */

function ArtworkVisual({ image, title }: { image: string; title: string }) {
  return (
    <div className="relative h-[94%] w-[94%]">
      <FrameImage src={image} alt={title} fit="contain" />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Entry point                                                                */
/* -------------------------------------------------------------------------- */

export default function WorkVisual({ visual, title }: WorkVisualProps) {
  switch (visual.type) {
    case "browser":
      return (
        <BrowserVisual image={visual.image} url={visual.url} title={title} />
      );
    case "screens":
      return <ScreensVisual screens={visual.screens} title={title} />;
    case "phones":
      return <PhonesVisual images={visual.images} title={title} />;
    case "workflow":
      return <WorkflowVisual nodes={visual.nodes} title={title} />;
    case "artwork":
      return <ArtworkVisual image={visual.image} title={title} />;
  }
}