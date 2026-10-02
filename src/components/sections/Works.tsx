"use client";

import WorksSwap, {
  type WorkItem,
} from "@/components/ui/WorksSwap";
import { ArrowRight } from "lucide-react";

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
    title: "DM Workflows",
    category: "Web development",
    description:
      "Website for an automation studio, with a lead form that emails new inquiries.",
    stack: [
      { name: "Next.js", icon: "/icons/stack/frontend/nextjs.svg" },
      { name: "TypeScript", icon: "/icons/stack/frontend/typescript.svg" },
      { name: "Tailwind CSS", icon: "/icons/stack/frontend/tailwindcss.svg" },
      { name: "Resend", icon: "/icons/stack/resend-light.svg" },
    ],
    link: "https://dmworkflows.com",
    visual: {
      type: "browser",
      image: "/images/works/project-1.png",
      url: "dmworkflows.com",
    },
  },
  {
    title: "Project Two",
    category: "AI automation",
    description: "Automation workflow",
    visual: {
      type: "workflow",
      nodes: [
        { label: "Form submitted", kind: "trigger" },
        { label: "Extract with Gemini", kind: "ai" },
        { label: "Validate fields", kind: "logic" },
        { label: "Route by type", kind: "logic" },
        { label: "Update CRM", kind: "action" },
      ],
    },
  },
  {
    title: "Project Three",
    category: "UI/UX design",
    description: "UI/UX design system",
    visual: {
      type: "screens",
      screens: [
        { image: "/images/works/project-3.png", label: "Design system" },
      ],
    },
  },
];

export default function Works() {
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
            FeaturedWorks
          </span>
        </p>

        <a
          href="/works"
          className="font-sans text-sm font-medium text-ink/50 transition-colors hover:text-ink"
        >
          View More Works
          <ArrowRight size={12} className="inline-block ml-1" />
        </a>
      </div>

      <WorksSwap works={WORKS} />
    </section>
  );
}