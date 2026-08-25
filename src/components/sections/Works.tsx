"use client";

import { useRef, useState } from "react";
import CardSwap, { Card, type CardSwapHandle } from "@/components/ui/CardSwap";

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
  const cardSwapRef = useRef<CardSwapHandle>(null);

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

      <div className="grid -gap-5 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="font-display text-3xl font-semibold">{active.title}</h3>
          <p className="mt-2 font-sans text-base text-ink/60">{active.description}</p>
        </div>

        <div className="relative mx-auto mt-10 h-125 w-full overflow-hidden rounded-2xl bg-ink p-8">
          <CardSwap
            ref={cardSwapRef}
            width={520}
            height={420}
            cardDistance={60}
            verticalDistance={70}
            delay={3000}
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

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-4 rounded-full bg-ink px-4 py-2">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => cardSwapRef.current?.prev()}
              className="text-bg/60 hover:text-bg"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M16 5L8 12L16 19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {WORKS.map((work, i) => (
              <button
                key={work.title}
                type="button"
                aria-label={`Show ${work.title}`}
                onClick={() => cardSwapRef.current?.goTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${
                  frontIdx === i ? "bg-bg" : "bg-bg/30"
                }`}
              />
            ))}
            <button
              type="button"
              aria-label="Next project"
              onClick={() => cardSwapRef.current?.next()}
              className="text-bg/60 hover:text-bg"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M8 5L16 12L8 19"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}