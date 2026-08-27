export default function Contact() {
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
            Open to roles and projects where I can keep growing as a
            developer while building things that actually matter.
          </p>

          <a
            href="mailto:hello@example.com" // TODO: swap real email
            className="mt-8 inline-block sans text-xl underline underline-offset-4 md:text-3xl"
          >
            hello@example.com
          </a>
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
        <p className="font-display select-none text-center whitespace-nowrap text-[22vw] font-black leading-none -tracking-widest text-[#E2E2E2] md:text-[16.5vw]">
          MorissMatias
        </p>
      </div>
    </section>
  );
}