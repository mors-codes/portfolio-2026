"use client";

import { useState } from "react";
import { Mail, Copy, Check, Phone } from "lucide-react";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "morsmatias15@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section
      id="contact"
      className="relative flex flex-col justify-end px-8 pt-24 md:min-h-screen md:px-16 scroll-mt-24"
    >
      <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
        <span className="font-mono-label">04</span>
        <span className="font-sans font-thin">—</span>
        <span className="font-display font-black -tracking-widest">
          ContactMe
        </span>
      </p>

      <div className="mx-auto mt-24 grid max-w-5xl gap-40 md:mt-32 md:grid-cols-[1fr_1.3fr] md:items-center">
        <div className="flex flex-col justify-center">
          <p className="font-display text-3xl font-bold leading-[1.1] tracking-tighter whitespace-nowrap md:text-5xl">
            Let&apos;s Connect
          </p>

          <p className="mt-4 max-w-xs font-sans text-base text-ink/60 md:text-lg">
            Open to roles and projects where I can keep growing as a developer
            while building things that actually matter.
          </p>  

          <button
            onClick={handleCopy}
            className="group mt-8 inline-flex w-fit cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-3 border-ink bg-ink px-5 py-3 font-sans text-sm font-semibold text-bg"
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

        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-ink/10 bg-bg p-24 shadow-sm">
          <div className="flex gap-3">
            <a
              href="https://github.com/mors-codes"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-ink/70 transition-colors hover:bg-ink hover:text-bg"
              aria-label="GitHub"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.58 2 12.17c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.36-3.37-1.36-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.31.1-2.72 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.17C22 6.58 17.52 2 12 2z" />
              </svg>
            </a>
            <a
              href="#" // TODO: WhatsApp number
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-ink/70 transition-colors hover:bg-ink hover:text-bg"
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.28-1.39a9.9 9.9 0 0 0 4.76 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m0 1.67c2.2 0 4.26.86 5.82 2.42a8.19 8.19 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.24 8.23a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.13.82.84-3.05-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24m-4.44 4.59c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.68 2.68 4.14 3.65 2.05.81 2.46.65 2.91.61.45-.04 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.46-.28-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.46" />
              </svg>
            </a>
            <a
              href="tel:#" // TODO: phone number
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/10 text-ink/70 transition-colors hover:bg-ink hover:text-bg"
              aria-label="Phone"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
          <p className="font-sans text-sm font-normal text-ink/40 italic">
            Refined by Repetition
          </p>
        </div>
      </div>

      <div className="-mx-8 -mb-8 mt-20 h-[13vw] overflow-hidden md:-mx-16 md:mt-32 md:h-[13.5vw]">
        <p className="font-display select-none text-center whitespace-nowrap text-[16vw] font-black leading-none -tracking-widest text-echo md:text-[16.5vw]">
          MorissMatias
        </p>
      </div>
    </section>
  );
}