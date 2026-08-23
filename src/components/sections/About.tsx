import Image from "next/image";
import TimelineEntry from "@/components/ui/TimelineEntry";

export default function About() {
  return (
    <section className="px-8 py-20 md:px-16 md:py-28">
      <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
        <span className="font-mono-label">01</span>
        <span className="font-mono-label">—</span>
        <span className="font-display font-black tracking-[-0.1em]">
          AboutMe
        </span>
      </p>

      <h2 className="mt-12 font-sans text-6xl font-bold leading-none md:text-8xl">
        <span className="tracking-[-0.07em]">Hello!</span>{" "}
        <span className="font-sans font-extralight tracking-[-0.05em]">I&apos;m Mors.</span>
      </h2>

      <div className="mt-4 grid gap-16 md:grid-cols-[1fr_1fr] md:gap-24">
        {/* Left: illustration + bio + resume + contact */}
        <div>
                    <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div className="flex w-full max-w-[280px] shrink-0 flex-col gap-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl border-3 border-ink">
                <Image
                  src="/illustrations/about-portrait.svg"
                  alt="Illustration of Mors, wearing glasses and headphones around his neck"
                  width={280}
                  height={350}
                  className="absolute bottom-0 left-1/2 h-[90%] w-auto -translate-x-1/2 object-contain"
                />
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-2xl border-3 border-ink bg-ink py-3 font-sans text-sm font-medium text-bg transition-opacity hover:opacity-80"
              >
                View Resume
                <span aria-hidden="true">→</span>
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-justify font-sans text-base leading-relaxed text-ink hyphens-auto">
                A developer with a strong passion about building modern web
                and mobile apps, and these days I&apos;m focused on AI
                automation.
              </p>
              <p className="text-justify font-sans text-base leading-relaxed text-ink hyphens-auto">
                I enjoy combining design and development to create
                applications that are functional, engaging, and thoughtfully
                designed. I am seeking opportunities where I can continue
                learning while contributing meaningfully through the projects
                I work on and the ideas I bring to life.
              </p>
            </div>
          </div>

          <div className="mt-12">
            <p className="font-display text-base font-black lowercase tracking-[-0.05em] text-ink">
              Contact
            </p>
            <p className="mt-2 font-sans text-base text-ink">
              morsmatias15@gmail.com
            </p>
          </div>
        </div>

        {/* Right: education + experience */}
        <div className="flex flex-col gap-12">
          <div>
            <p className="font-display text-base font-black lowercase tracking-[-0.05em] text-ink">
              Education
            </p>
            <div className="mt-6">
              <TimelineEntry
                date="2023–2025"
                title="Associate in Computer Technology"
                subtitle="De La Salle Lipa"
              />
            </div>
          </div>

          <div>
            <p className="font-display text-base font-black lowercase tracking-[-0.05em] text-ink">
              Experience
            </p>
            <div className="mt-6 flex flex-col gap-10">
              <TimelineEntry
                date="Jun 2025 – Dec 2025"
                title="Freelance Developer"
                subtitle="Self-Employed | Remote"
                description="Built full-stack web systems and native mobile apps end-to-end, from requirements through delivery."
              />
              <TimelineEntry
                date="Feb 2025 – Apr 2025"
                title="IT Specialist Intern"
                subtitle="Nutech Hardware and Software Solutions"
                description="Developed a responsive project management website and integrated Zapier with Gmail for automated notifications."
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}