"use client";

import WorksSwap, {
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
      "Reads invoices with Gemini, checks the math, and saves clean records to Airtable. Low-confidence ones get flagged and emailed for review.",
    stack: [
      { name: "n8n" },
      { name: "Gemini" },
      { name: "Airtable" },
      { name: "Google Drive" },
    ],
    visual: {
      type: "workflow",
      nodes: [
        { label: "Invoice uploaded", kind: "trigger" },
        { label: "Extract with Gemini", kind: "ai" },
        { label: "Validate totals", kind: "logic" },
        { label: "Needs review?", kind: "logic" },
        { label: "Save to Airtable", kind: "action" },
      ],
    },
  },
    {
    title: "VOYA\nTravel",
    category: "Web development",
    description:
      "Landing page for a fictional adventure travel company. Dark editorial design, scroll animations, responsive layout, working contact form.",
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
            SelectedWorks
          </span>
        </p>
      </div>

      <WorksSwap works={WORKS} />
    </section>
  );
}