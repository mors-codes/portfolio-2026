import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CASE_STUDIES, getCaseStudy } from "@/data/caseStudies";
import WorkflowDiagram from "@/components/ui/WorkflowDiagram";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import {
  stackBlockCategories,
  type StackBlockTool,
} from "@/data/stackBlockData";

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

const TOOLS = stackBlockCategories.flatMap((c) => c.tools);

// Icons for tags that aren't in the stack data. Add the file, then uncomment.
const EXTRA_ICONS: Record<string, StackBlockTool["icon"]> = {
  // "Google Drive": "/icons/stack/ai-automation/drive.svg",
};

const iconFor = (name: string) =>
  EXTRA_ICONS[name] ??
  TOOLS.find((t) => t.name.toLowerCase() === name.toLowerCase())?.icon;

function TagIcon({ name }: { name: string }) {
  if (name === "AI") {
    return <Sparkles size={13} strokeWidth={2.25} aria-hidden="true" />;
  }
  const icon = iconFor(name);
  if (!icon) return null;
  if (typeof icon === "string") {
    return (
      <Image
        src={icon}
        alt=""
        width={15}
        height={15}
        className="h-3.75 w-3.75"
      />
    );
  }
  // Light/dark pair: show one per theme.
  return (
    <>
      <Image
        src={icon.light}
        alt=""
        width={15}
        height={15}
        className="h-3.75 w-3.75 in-[.dark]:hidden"
      />
      <Image
        src={icon.dark}
        alt=""
        width={15}
        height={15}
        className="hidden h-3.75 w-3.75 in-[.dark]:block"
      />
    </>
  );
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
        <h1 className="mt-4 font-sans text-[clamp(1.75rem,7vw,4rem)] leading-none font-medium tracking-tighter whitespace-nowrap">
          {study.title}
        </h1>
        <p className="mt-8 max-w-2xl font-sans text-sm font-light leading-normal text-ink/70 md:text-base">
          {study.tagline}
        </p>
        <ul className="mt-8 flex flex-wrap gap-1.5">
          {study.stack.map((name) => {
            const hasIcon = name === "AI" || Boolean(iconFor(name));
            return (
              <li
                key={name}
                className={`flex items-center gap-2 border border-ink/20 py-1 font-mono text-[8px] text-ink/70 uppercase ${
                  hasIcon ? "pr-2.5 pl-1" : "px-2.5"
                }`}
              >
                {hasIcon && (
                  <span className="grid h-5 w-5 place-items-center">
                    <TagIcon name={name} />
                  </span>
                )}
                {name}
              </li>
            );
          })}
        </ul>
      </header>

      {study.diagram && (
        <div className="relative left-1/2 mt-16 w-[min(1400px,calc(100vw-4rem))] -translate-x-1/2">
          <WorkflowDiagram diagram={study.diagram} />
        </div>
      )}

      <section className="mt-16">
        {[
          { n: "01", label: "Problem", text: study.problem },
          { n: "02", label: "Solution", text: study.solution },
          { n: "03", label: "Result", text: study.outcome },
        ].map(({ n, label, text }) => (
          <div
            key={n}
            className="grid gap-4 border-t border-ink/20 py-10 last:border-b md:grid-cols-[7rem_1fr] md:gap-8"
          >
            <div className="flex items-baseline gap-3 md:block">
              <span className="font-mono-label text-sm text-ink/40">{n}</span>
              <h2 className="font-display text-xl font-black -tracking-widest md:mt-1">
                {label}
              </h2>
            </div>
            <p className="font-sans text-sm font-light leading-relaxed text-ink/70 md:text-base">
              {text}
            </p>
          </div>
        ))}
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