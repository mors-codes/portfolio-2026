"use client";

import { forwardRef } from "react";

const NAME = "MorissMatias";

const AnimatedName = forwardRef<HTMLHeadingElement>(
  function AnimatedName(_props, ref) {
    return (
      <div className="group relative inline-block">
        <h1
          ref={ref}
          className="overflow-hidden pt-4 pb-4 pr-4 font-display text-[16vw] font-black leading-[0.8] -tracking-widest md:text-[12vw]"
          aria-label={NAME}
        >
          {NAME.split("").map((char, i) => (
            <span
              key={i}
              className="letter inline-block"
              aria-hidden="true"
              style={{ opacity: 0, transform: "translateY(100%)" }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Glare layer: same text, same box, positioned exactly over the
          h1 above. Its own text is transparent — only the gradient
          background shows, clipped to the glyph shapes via
          background-clip: text. Swept across on hover via CSS only. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden pt-4 pb-4 pr-4 font-display text-[16vw] font-black leading-[0.8] -tracking-widest text-transparent md:text-[12vw]"
        >
          <span
            className="inline-block h-full w-full transition-[background-position] duration-1100 ease-out group-hover:bg-position-[-50%_0]!"
            style={{
              backgroundImage:
                "linear-gradient(115deg, transparent 40%, rgba(255,255,255,0.75) 50%, transparent 60%)",
              backgroundSize: "250% 100%",
              backgroundPosition: "150% 0",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {NAME}
          </span>
        </div>
      </div>
    );
  },
);

export default AnimatedName;
