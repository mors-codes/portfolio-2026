import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/data/caseStudies";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.title} — Case Study`,
    description: study.tagline,
  };
}

const META =
  "font-mono text-[10px] font-light tracking-[1.08px] text-ink/50 uppercase";

function SectionLabel({ n, children }: { n: string; children: ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-2xl text-[#B5B5B5] md:text-3xl">
      <span className="font-mono-label">{n}</span>
      <span className="font-sans font-thin">—</span>
      <span className="font-display font-black -tracking-widest">
        {children}
      </span>
    </p>
  );
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-8 py-16 md:py-24">
      <Link
        href="/#works"
        className={`${META} inline-flex items-center gap-2 transition-colors hover:text-ink`}
      >
        <span aria-hidden="true">←</span> Back to works
      </Link>

      <header className="mt-16">
        <p className={META}>{study.category}</p>
        <h1 className="mt-4 font-sans text-[clamp(2.75rem,8vw,5rem)] leading-[0.9] font-medium tracking-tighter text-balance">
          {study.title}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-base font-light leading-normal text-ink/70 md:text-lg">
          {study.tagline}
        </p>
        <ul className="mt-8 flex flex-wrap gap-1.5">
          {study.stack.map((name) => (
            <li
              key={name}
              className="border border-ink/20 px-2.5 py-1 font-mono text-[8px] text-ink/70 uppercase"
            >
              {name}
            </li>
          ))}
        </ul>
      </header>

      <section className="mt-24 grid gap-12 border-t border-ink/20 pt-12">
        <div>
          <SectionLabel n="01">Problem</SectionLabel>
          <p className="mt-6 font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
            {study.problem}
          </p>
        </div>
        <div>
          <SectionLabel n="02">Solution</SectionLabel>
          <p className="mt-6 font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
            {study.solution}
          </p>
        </div>
      </section>

      <section className="mt-24 border-t border-ink/20 pt-12">
        <SectionLabel n="03">HowItWorks</SectionLabel>
        <ol className="mt-10">
          {study.flow.map((step, i) => (
            <li
              key={step.title}
              className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-t border-ink/20 py-6"
            >
              <span className="font-mono-label text-sm text-ink/40 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-sans text-xl font-medium tracking-tight">
                {step.title}
              </h3>
              <p className="col-start-2 font-sans text-sm font-light leading-relaxed text-ink/70">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-24 border-t border-ink/20 pt-12">
        <SectionLabel n="04">KeyDecisions</SectionLabel>
        <div className="mt-10 grid gap-6">
          {study.decisions.map((d) => (
            <div key={d.title} className="border-2 border-ink p-6">
              <h3 className="font-sans text-lg font-medium tracking-tight">
                {d.title}
              </h3>
              <p className="mt-3 font-sans text-sm font-light leading-relaxed text-ink/70">
                {d.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 border-t border-ink/20 pt-12">
        <SectionLabel n="05">Outcome</SectionLabel>
        <ul className="mt-8 max-w-2xl space-y-3">
          {study.outcome.map((item) => (
            <li
              key={item}
              className="flex gap-3 font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base"
            >
              <span aria-hidden="true" className="text-ink/30">
                —
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/#works"
        className={`${META} mt-24 inline-flex items-center gap-2 transition-colors hover:text-ink`}
      >
        <span aria-hidden="true">←</span> Back to works
      </Link>
    </main>
  );
}