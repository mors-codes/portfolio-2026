"use client";

import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "morsmatias15@gmail.com"; // TODO: swap real email

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-end px-8 pt-24 md:px-16 scroll-mt-24"
    >
      <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
        <span className="font-mono-label">04</span>
        <span className="font-sans font-thin">—</span>
        <span className="font-display font-black -tracking-widest">
          GetInTouch
        </span>
      </p>

      <div className="mt-16 flex flex-col gap-16 md:mt-24 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-sans text-5xl font-black leading-[1.1] md:text-7xl">
            Let&apos;s build
            <br />
            something.
          </p>

          <p className="mt-4 max-w-md font-sans text-base text-ink/60 md:text-lg">
            Open to roles and projects where I can keep growing as a developer
            while building things that actually matter.
          </p>

          <button
            onClick={handleCopy}
            className="group mt-8 inline-flex items-center gap-2 whitespace-nowrap rounded-xl border-3 border-ink bg-ink px-5 py-3 font-sans text-sm font-semibold text-bg transition-opacity hover:opacity-80"
          >
            {copied ? (
              <Check className="h-4 w-4 shrink-0 text-bg" />
            ) : (
              <>
                <Mail className="h-4 w-4 shrink-0 text-bg group-hover:hidden" />
                <Copy className="hidden h-4 w-4 shrink-0 text-bg group-hover:block" />
              </>
            )}
            <span className="grid grid-cols-1 grid-rows-1 items-center">
              <span className="col-start-1 row-start-1 whitespace-nowrap opacity-100 blur-none transition-[opacity,filter] duration-300 ease-out group-hover:opacity-0 group-hover:blur-sm">
                Contact
              </span>
              <span className="col-start-1 row-start-1 grid grid-cols-[0fr] overflow-hidden transition-[grid-template-columns] duration-300 ease-out group-hover:grid-cols-[1fr]">
                <span className="min-w-0 overflow-hidden whitespace-nowrap opacity-0 blur-sm transition-[opacity,filter] delay-100 duration-300 ease-out group-hover:opacity-100 group-hover:blur-none">
                  {email}
                </span>
              </span>
            </span>
          </button>
        </div>

        <div className="flex gap-6 font-sans text-sm uppercase tracking-widest">
          <a
            href="https://github.com/mors-codes"
            target="_blank"
            rel="noopener noreferrer"
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            GitHub
          </a>
          <a
            href="#" // TODO: LinkedIn placeholder
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            LinkedIn
          </a>
          <a
            href="#" // TODO: placeholder
            className="opacity-60 transition-opacity hover:opacity-100"
          >
            Twitter
          </a>
        </div>
      </div>

      <div className="-mx-8 -mb-8 mt-20 h-[18vw] overflow-hidden md:-mx-16 md:mt-32 md:h-[13.5vw]">
        <p className="font-display select-none text-center whitespace-nowrap text-[22vw] font-black leading-none -tracking-widest text-echo md:text-[16.5vw]">
          MorissMatias
        </p>
      </div>
    </section>
  );
}
