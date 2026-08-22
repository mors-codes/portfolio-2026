"use client";

import { forwardRef } from "react";

const NAME = "MorissMatias";

const AnimatedName = forwardRef<HTMLHeadingElement>(function AnimatedName(
  _props,
  ref
) {
  return (
    <h1
      ref={ref}
      className="overflow-hidden pt-4 pb-4 pr-4 font-display text-[16vw] font-black leading-[0.8] tracking-[-0.1em] md:text-[12vw]"
      aria-label={NAME}
    >
      {NAME.split("").map((char, i) => (
        <span key={i} className="letter inline-block" aria-hidden="true">
          {char}
        </span>
      ))}
    </h1>
  );
});

export default AnimatedName;