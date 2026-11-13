"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import WorkflowDiagram from "@/components/ui/WorkflowDiagram";
import { getCaseStudy, type CaseStudyDiagram } from "@/data/caseStudies";

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
  | { type: "diagram"; slug: string }
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
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src={image}
        alt={`${title} website`}
        width={0}
        height={0}
        sizes={IMAGE_SIZES}
        className={`h-auto max-h-full w-auto max-w-full ${FRAME_SHADOW}`}
      />
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

function ScreenImage({
  src,
  alt,
  fallbackRatio,
}: {
  src?: string;
  alt: string;
  fallbackRatio: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-hidden="true"
        className="w-full bg-ink/6"
        style={{ aspectRatio: fallbackRatio }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={IMAGE_SIZES}
      onError={() => setFailed(true)}
      className="block h-auto w-full"
    />
  );
}

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
    <div className="relative aspect-5/4 w-[min(100cqw,125cqh)]">
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
              zIndex: i + 1,
            }}
          >
            {screen.label && (
              <figcaption className="absolute -top-5 left-0 bg-bg pr-1.5 font-sans text-[11px] leading-4 text-ink/50">
                {screen.label}
              </figcaption>
            )}
            <ScreenImage
              src={screen.image}
              alt={screen.label ?? `${title} screen ${i + 1}`}
              fallbackRatio={slot.ratio}
            />
          </figure>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phones — mobile UI                                                         */
/* -------------------------------------------------------------------------- */

function MockupImage({
  src,
  alt,
  maxWidth,
  className = "",
}: {
  src: string;
  alt: string;
  maxWidth: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  // Missing file: blank phone-shaped placeholder instead of a broken image.
  if (failed) {
    return (
      <div aria-hidden="true" className="aspect-9/19.5 h-[80%] bg-ink/6" />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={0}
      height={0}
      sizes={IMAGE_SIZES}
      onError={() => setFailed(true)}
      style={{ maxWidth: `${maxWidth}%` }}
      className={`h-auto max-h-full w-auto min-w-0 object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.18)] ${className}`}
    />
  );
}

function PhonesVisual({ images, title }: { images: string[]; title: string }) {
  const shown = images.slice(0, 3);
  const count = Math.max(shown.length, 1);
  // Per-image width cap so the row never overflows the stage.
  const maxWidth = count === 1 ? 50 : count === 2 ? 44 : 30;

  return (
    <div className="flex h-full w-full items-center justify-center gap-[3cqw]">
      {shown.map((src, i) => (
        <MockupImage
          key={`${src}-${i}`}
          src={src}
          alt={`${title} mobile screen ${i + 1}`}
          maxWidth={maxWidth}
          className={
            count === 1
              ? ""
              : count === 3
                ? i === 1
                  ? "translate-y-[-6%]"
                  : "translate-y-[6%]"
                : i % 2 === 1
                  ? "translate-y-[5%]"
                  : "translate-y-[-4%]"
          }
        />
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Workflow — AI automation                                                   */
/* -------------------------------------------------------------------------- */

// Each step sits a little right of and below the one before it, so the flow
// cascades from the upper left to the lower right.
const CARD_STEP_X = 110;
const CARD_STEP_Y = 96;
const CARD_MAX_STEPS = 5;

/** Lays a plain list of steps out in rows of three, so it fills a card. */
function WorkflowVisual({ nodes }: { nodes: WorkflowNode[]; title: string }) {
  const diagram = useMemo<CaseStudyDiagram>(() => {
    const shown = nodes.slice(0, CARD_MAX_STEPS);
    return {
      nodes: shown.map((n, i) => ({
        id: `step-${i}`,
        label: n.label,
        kind: n.kind ?? "action",
        x: i * CARD_STEP_X,
        y: i * CARD_STEP_Y,
      })),
      edges: shown.slice(1).map((_, i) => ({
        from: `step-${i}`,
        to: `step-${i + 1}`,
      })),
    };
  }, [nodes]);

  return (
    <div className="h-full w-full overflow-hidden border-[3px] border-ink bg-bg">
      <WorkflowDiagram diagram={diagram} preview cascade />
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

/* -------------------------------------------------------------------------- */
/*  Diagram — the case study workflow, in compact form                         */
/* -------------------------------------------------------------------------- */

function DiagramVisual({ slug }: { slug: string }) {
  const diagram = getCaseStudy(slug)?.diagram;

  // No diagram for this slug: blank frame instead of a crash.
  if (!diagram) {
    return (
      <div
        aria-hidden="true"
        className="h-full w-full border-[3px] border-ink bg-ink/6"
      />
    );
  }

  return (
    <div className="h-full w-full overflow-hidden border-[3px] border-ink bg-bg">
      <WorkflowDiagram diagram={diagram} preview />
    </div>
  );
}

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
    case "diagram":
      return <DiagramVisual slug={visual.slug} />;
    case "artwork":
      return <ArtworkVisual image={visual.image} title={title} />;
  }
}