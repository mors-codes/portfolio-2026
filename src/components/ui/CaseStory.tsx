import type { ReactNode } from "react";
import type { CaseStudyStory } from "@/data/caseStudies";
import Reveal from "@/components/ui/Reveal";

const LABEL =
  "font-mono text-[10px] font-light tracking-[1.08px] text-ink/50 uppercase";

const ROW =
  "grid gap-6 border-t border-ink/15 py-14 lg:grid-cols-[8rem_minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-x-12 lg:py-16";

function Block({
  id,
  n,
  label,
  headline,
  body,
}: {
  id: string;
  n: string;
  label: string;
  headline: string;
  body: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={ROW}>
      <Reveal>
        <p className={LABEL}>
          <span className="text-ink/30">{n}</span>
          <span className="mx-2 text-ink/30">/</span>
          {label}
        </p>
      </Reveal>

      <Reveal delay={80}>
        <h2
          id={id}
          className="max-w-2xl font-sans text-[clamp(1.5rem,2.4vw,2rem)] leading-tight font-medium tracking-tight text-balance lg:max-w-none"
        >
          {headline}
        </h2>
      </Reveal>
      <Reveal delay={160}>
        <p className="max-w-2xl font-sans text-sm leading-relaxed font-light text-ink/70 md:text-base lg:max-w-none text-justify hyphens-auto">
          {body}
        </p>
      </Reveal>
    </section>
  );
}

export default function CaseStory({
  story,
  width,
}: {
  story: CaseStudyStory;
  /** Frame width of the diagram, so everything lines up with it. */
  width: number | null;
}) {
  const { problem, solution, result } = story;

  return (
    <div
      className="relative left-1/2 mt-16 -translate-x-1/2"
      style={{ width: `min(${width ?? 1100}px, calc(100vw - 4rem))` }}
    >
      <Block
        id="story-problem"
        n="01"
        label="Problem"
        headline={problem.headline}
        body={problem.body}
      />
      <Block
        id="story-solution"
        n="02"
        label="Solution"
        headline={solution.headline}
        body={solution.body}
      />
      <Block
        id="story-result"
        n="03"
        label="Result"
        headline={result.headline}
        body={result.body}
      />
    </div>
  );
}