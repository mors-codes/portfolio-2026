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
    description:
      "Placeholder description. Replace with one or two lines on what the automation does and the result.",
    stack: [
      { name: "n8n" },
      { name: "Gemini" },
      { name: "Supabase" },
      { name: "Webhooks" },
    ],
    link: "#", // placeholder, swap for the real link
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
    description:
      "Placeholder description. Replace with one or two lines on the design problem and what you delivered.",
    stack: [
      { name: "Figma" },
      { name: "Design tokens" },
      { name: "Prototyping" },
      { name: "Handoff" },
    ],
    link: "#", // placeholder, swap for the real link
    visual: {
      type: "screens",
      screens: [
        { image: "/images/works/project-3.png", label: "Home" },
        { label: "Dashboard" },
        { label: "Settings" },
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
            SelectedWorks
          </span>
        </p>
      </div>

      <WorksSwap works={WORKS} />
    </section>
  );
}