"use client";

import { useState } from "react";
import CardSwap, { Card } from "@/components/ui/CardSwap";

interface WorkItem {
  title: string;
  description: string;
}

const WORKS: WorkItem[] = [
  { title: "Project One", description: "Full-stack web app" },
  { title: "Project Two", description: "Automation workflow" },
  { title: "Project Three", description: "UI/UX design system" },
];

export default function Works() {
  const [frontIdx, setFrontIdx] = useState(0);
  const active = WORKS[frontIdx];

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
        <a href="/works" className="font-mono-label text-sm text-ink/50 hover:text-ink">
          View all →
        </a>
      </div>

      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="font-display text-3xl font-semibold">{active.title}</h3>
          <p className="mt-2 font-sans text-base text-ink/60">{active.description}</p>
        </div>

        <div className="relative mx-auto mt-16 h-110 w-full overflow-hidden rounded-2xl bg-ink p-8">
          <CardSwap
            width={500}
            height={350}
            cardDistance={60}
            verticalDistance={70}
            delay={3000}
            pauseOnHover={true}
            onFrontChange={setFrontIdx}
          >
            {WORKS.map((work) => (
              <Card key={work.title}>
                <div className="flex h-full flex-col overflow-hidden rounded-xl bg-ink text-bg dark:bg-bg dark:text-ink">
                  <div className="flex items-center gap-1.5 border-b border-bg/10 px-4 py-3 dark:border-ink/10">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  </div>
                  <div className="flex-1 bg-bg/10 dark:bg-ink/10" />
                </div>
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}