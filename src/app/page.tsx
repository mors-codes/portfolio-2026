import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <Hero />
      <About />
    </main>
  );
}