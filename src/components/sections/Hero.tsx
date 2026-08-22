import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen px-8 py-10 md:px-16 md:py-12">
      {/* Top row: eyebrow / logo / folio label */}
      <div className="relative flex items-start font-sans text-xs">
        <p className="max-w-[160px] font-medium leading-snug">
          Open for work and collaborations
        </p>

        <p className="absolute left-1/2 -translate-x-1/2 font-logo text-2xl">
          MORS.
        </p>

        <div className="ml-auto font-medium leading-tight">
          <p className="pl-[30px]">-FOLIO</p>
          <p>PORTO</p>
        </div>
      </div>

      {/* Role labels + Name lockup + year, sharing one centered block */}
      <div className="mt-16 flex justify-center md:mt-20">
        <div className="inline-block text-left">
          <p className="mb-6 ml-2 flex items-center gap-5 font-sans text-sm">
            <span>Full Stack Developer</span>
            <span>/</span>
            <span>UI Designer</span>
            <span>/</span>
            <span>AI Automation Specialist</span>
          </p>
          <h1 className="font-display text-[16vw] font-black leading-[0.8] tracking-[-0.1em] md:text-[12vw]">
            MorissMatias
          </h1>
          <p className="text-right font-sans text-sm font-bold">2026</p>
        </div>
      </div>

      {/* Illustration + Numbered nav row, nav vertically centered on illustration */}
<div className="relative mt-6">
  <div className="flex justify-center">
    <Image
      src="/illustrations/hero-desk.svg"
      alt="Illustration of Moriss at his desk, working at a computer with his cat nearby"
      width={480}
      height={480}
      priority
      className="h-auto w-full max-w-[320px]"
    />
  </div>

  <nav className="absolute inset-y-0 left-0 right-0 flex items-center justify-between font-sans text-sm">
  <a href="#about" className="group">
    <span className="font-mono-label block text-xs text-ink/50">01</span>
    <span className="font-semibold">About</span>
  </a>
  <a href="#works" className="group">
    <span className="font-mono-label block text-xs text-ink/50">02</span>
    <span className="font-semibold">Works</span>
  </a>
  <span aria-hidden="true" className="invisible">
    spacer
  </span>
  <a href="#stack" className="group">
    <span className="font-mono-label block text-xs text-ink/50">03</span>
    <span className="font-semibold">Stack</span>
  </a>
  <a href="#contact" className="group">
    <span className="font-mono-label block text-xs text-ink/50">04</span>
    <span className="font-semibold">Contact</span>
  </a>
</nav>
</div>
    </section>
  );
}
