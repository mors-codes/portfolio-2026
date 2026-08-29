import StackScatter from "@/components/ui/StackScatter";
import { stackCategories } from "@/data/stackData";

interface StackProps {
  isDark: boolean;
}

export default function Stack({ isDark }: StackProps) {
  return (
    <section className="min-h-screen px-8 py-24 md:px-16">
      <p className="flex items-center gap-2 text-4xl text-[#B5B5B5]">
        <span className="font-mono-label">03</span>
        <span className="font-sans font-thin">—</span>
        <span className="font-display font-black -tracking-widest">
          TechStack
        </span>
      </p>

      <StackScatter categories={stackCategories} isDark={isDark} />
    </section>
  );
}