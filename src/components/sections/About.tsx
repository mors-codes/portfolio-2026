"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import TimelineEntry from "@/components/ui/TimelineEntry";
import PixelTransition from "@/components/ui/PixelTransition";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [typedCount, setTypedCount] = useState(0);
  const illustrationColRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    if (cursorRef.current) gsap.set(cursorRef.current, { opacity: 1 });

    const targets = [
      eyebrowRef.current,
      illustrationColRef.current,
      bioRef.current,
      contactRef.current,
      timelineRef.current,
    ].filter(Boolean);

    gsap.set(targets, { y: 32, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 75%",
      },
    });

    const FULL_TEXT = "Hello! I'm Mors.";
    const typeCounter = { n: 0 };

    tl.to(eyebrowRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(
        typeCounter,
        {
          n: FULL_TEXT.length,
          duration: 1.6,
          ease: "none",
          onUpdate: () => setTypedCount(Math.round(typeCounter.n)),
        },
        0.15,
      )
      .call(() => {
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "power1.inOut",
        });
      })
      .to(
        illustrationColRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.4,
      )
      .to(
        bioRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.5,
      )
      .to(
        contactRef.current,
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        0.65,
      )
      .to(
        timelineRef.current,
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        0.5,
      );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
        <section ref={sectionRef} className="px-8 py-10 md:px-16 md:py-14">
      <p
        ref={eyebrowRef}
        className="flex items-center gap-2 text-4xl text-[#B5B5B5]"
      >
        <span className="font-mono-label">01</span>
        <span className="font-sans font-thin">—</span>
        <span className="font-display font-black -tracking-widest">
          AboutMe
        </span>
      </p>

      <h2
        ref={headlineRef}
        className="mt-12 font-sans text-6xl font-bold leading-none md:text-8xl"
      >
        <span className="tracking-[-0.07em]">
          {"Hello! ".slice(0, typedCount)}
        </span>
        <span className="font-sans font-extralight tracking-tighter">
          {"I'm Mors.".slice(0, Math.max(0, typedCount - 7))}
        </span>
        <span
          ref={cursorRef}
          aria-hidden="true"
          className="ml-1 inline-block font-sans font-extralight text-ink"
        >
          _
        </span>
      </h2>

      <div className="mt-4 grid gap-16 md:grid-cols-[1fr_1fr] md:gap-24">
        {/* Left: illustration + bio + resume + contact */}
        <div>
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <div
              ref={illustrationColRef}
              className="flex w-full max-w-70 shrink-0 flex-col gap-3"
            >
              <div className="relative aspect-square overflow-hidden rounded-2xl border-3 border-ink">
                <PixelTransition
                  gridSize={10}
                  pixelColor="#222222"
                  animationStepDuration={0.4}
                  once={false}
                  firstContent={
                    <div className="relative h-full w-full bg-white">
                      <Image
                        src="/illustrations/about-portrait.svg"
                        alt="Illustration of Mors, wearing glasses and headphones around his neck"
                        width={280}
                        height={350}
                        className="absolute bottom-0 left-1/2 h-[90%] w-auto -translate-x-1/2 object-contain"
                      />
                    </div>
                  }
                  secondContent={
                    <Image
                      src="/images/portrait-photo.jpg"
                      alt="Photo of Mors"
                      width={280}
                      height={280}
                      className="h-full w-full object-cover"
                    />
                  }
                />
              </div>

              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border-3 border-ink bg-ink py-3 font-sans text-sm font-medium text-bg transition-opacity hover:opacity-80"
              >
                View Resume
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  style={{ transform: "rotate(0deg)" }}
                >
                  <path
                    d="M8 5L16 12L8 19"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>

            <div ref={bioRef} className="flex flex-col gap-4">
              <p className="text-justify font-sans text-base leading-relaxed text-ink hyphens-auto">
                A developer with a strong passion about building modern web and
                mobile apps, and these days I&apos;m focused on AI automation.
              </p>
              <p className="text-justify font-sans text-base leading-relaxed text-ink hyphens-auto">
                I enjoy combining design and development to create applications
                that are functional, engaging, and thoughtfully designed. I am
                seeking opportunities where I can continue learning while
                contributing meaningfully through the projects I work on and the
                ideas I bring to life.
              </p>
            </div>
          </div>

          <div ref={contactRef} className="mt-12">
            <p className="font-display text-base font-black lowercase tracking-tighter text-ink">
              Contact
            </p>
            <p className="mt-2 font-sans text-base text-ink">
              morsmatias15@gmail.com
            </p>
          </div>
        </div>

        {/* Right: education + experience */}
        <div ref={timelineRef} className="flex flex-col gap-12">
          <div>
            <p className="font-display text-base font-black lowercase tracking-tighter text-ink">
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
            <p className="font-display text-base font-black lowercase tracking-tighter text-ink">
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
