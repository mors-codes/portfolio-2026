"use client";

import WorksSwap, { type WorkItem } from "@/components/ui/WorksSwap";

const WORKS: WorkItem[] = [
  {
    title: "Project One",
    description: "Full-stack web app",
    image: "/images/works/project-1.png",
  },
  {
    title: "Project Two",
    description: "Automation workflow",
    image: "/images/works/project-2.png",
  },
  {
    title: "Project Three",
    description: "UI/UX design system",
    image: "/images/works/project-3.png",
  },
];

export default function Works() {
  return (
    <section className="min-h-screen px-8 py-24 md:px-16">
      <div className="mb-4 flex items-end justify-between">
        <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
          <span className="font-mono-label">02</span>
          <span className="font-sans font-thin">—</span>
          <span className="font-display font-black -tracking-widest">
            FeaturedWorks
          </span>
        </p>
        <a href="/works" className="font-sans text-sm font-medium text-ink/50 hover:text-ink">
          View More Works →
        </a>
      </div>

      <WorksSwap works={WORKS} />
    </section>
  );
}