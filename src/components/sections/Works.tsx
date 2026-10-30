"use client";

import { useSyncExternalStore } from "react";
import WorksSwap, {
  OPENED_KEY,
  type WorkItem,
} from "@/components/ui/WorksSwap";

/*
 * Add a project = add an object. `visual` picks the presentation:
 *
 *   { type: "browser", image: "/images/works/x.png", url: "x.com" }
 *   { type: "screens", screens: [{ image: "/images/works/a.png", label: "Home" }] }   // 1–3
 *   { type: "phones",  images: ["/images/works/m1.png", "/images/works/m2.png"] }     // 1–3
 *   { type: "workflow", nodes: [{ label: "Form submitted", kind: "trigger" }, ...] }  // 2–5
 *   { type: "artwork", image: "/images/works/poster.png" }
 *
 * workflow node kinds: "trigger" | "ai" | "logic" | "action" ("ai" renders inverted)
 */
const WORKS: WorkItem[] = [
  {
    title: "DM\nWorkflows",
    category: "Web development",
    description:
      "Website for an automation studio, with a lead form that emails new inquiries.",
    stack: [
      { name: "Next.js", icon: "/icons/stack/frontend/nextjs.svg" },
      { name: "TypeScript", icon: "/icons/stack/frontend/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/stack/frontend/tailwindcss.svg" },
    ],
    link: "https://dmworkflows.com",
    visual: {
      type: "browser",
      image: "/images/works/project-1.png",
      url: "dmworkflows.com",
    },
  },
  {
    title: "Invoice\nProcessing",
    category: "AI automation",
    description:
      "AI reads each invoice, checks the math, and saves clean records to Airtable. Doubtful ones get flagged by email.",
    stack: [
      { name: "n8n" },
      { name: "AI" },
      { name: "Airtable" },
      { name: "Google Drive" },
    ],
    caseStudy: "/works/invoice-processing",
    visual: {
      type: "workflow",
      nodes: [
        { label: "Invoice uploaded", kind: "trigger" },
        { label: "Extract with AI", kind: "ai" },
        { label: "Validate totals", kind: "logic" },
        { label: "Needs review?", kind: "logic" },
        { label: "Save to Airtable", kind: "action" },
      ],
    },
  },
    {
    title: "Voya\nTravel",
    category: "Web development",
    description:
      "Landing page for a fictional adventure travel company, with scroll animations and a working contact form.",
    stack: [
      { name: "HTML5" },
      { name: "Tailwind CSS", icon: "/icons/stack/frontend/tailwindcss.svg" },
      { name: "JavaScript" },
    ],
    link: "https://github.com/mors-codes/voya",
    visual: {
      type: "browser",
      image: "/images/works/project-3.png",
    },
  },
  {
    title: "Lead\nScoring",
    category: "AI automation",
    description:
      "AI scores real estate leads hot, warm, or cold, syncs them to HubSpot, and sends a tailored follow-up.",
    stack: [
      { name: "n8n" },
      { name: "AI" },
      { name: "HubSpot" },
      { name: "Gmail" },
    ],
    caseStudy: "/works/lead-scoring",
    visual: {
      type: "workflow",
      nodes: [
        { label: "Lead form submitted", kind: "trigger" },
        { label: "Score with AI", kind: "ai" },
        { label: "Route by tier", kind: "logic" },
        { label: "Sync to HubSpot", kind: "action" },
        { label: "Send follow-up", kind: "action" },
      ],
    },
  },
  {
    title: "LozEat\nApp",
    category: "UI/UX design",
    description:
      "Mobile app design for ordering food around campus, with delivery to classrooms and landmarks.",
    stack: [
      { name: "Figma", icon: "/icons/stack/frontend/figma.svg" },
      { name: "Prototyping" },
      { name: "HCI" },
      { name: "Mobile UI" },
    ],
    caseStudy: "/works/lozeat",
    visual: {
      type: "phones",
      images: [
        "/images/works/lozeat-1.svg",
        "/images/works/lozeat-2.svg",
        "/images/works/lozeat-3.svg",
      ],
    },
  },
];

const noopSubscribe = () => () => {};

// Index of the project whose case study was last opened in this tab.
// sessionStorage is client-only, so the server snapshot is always 0.
function readOpened() {
  try {
    const n = Number(sessionStorage.getItem(OPENED_KEY));
    return Number.isInteger(n) && n >= 0 && n < WORKS.length ? n : 0;
  } catch {
    return 0;
  }
}

export default function Works() {
  const startIndex = useSyncExternalStore(noopSubscribe, readOpened, () => 0);
  return (
    <section
      id="works"
      className="min-h-screen px-8 py-24 md:px-16"
    >
      <div className="mb-4 flex items-end justify-between">
        <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
          <span className="font-mono-label">
            02
          </span>

          <span className="font-sans font-thin">
            —
          </span>

          <span className="font-display font-black -tracking-widest">
            SelectedWorks
          </span>
        </p>
      </div>

      <WorksSwap key={startIndex} works={WORKS} initialIndex={startIndex} />
    </section>
  );
}