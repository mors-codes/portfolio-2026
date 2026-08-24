import type { Metadata } from "next";
import Script from "next/script";
import { archivo, inter, danfo, audiowide } from "@/lib/fonts";
import ClickSpark from "@/components/ui/ClickSpark";
import "./globals.css";

export const metadata: Metadata = {
  title: "Moriss Matias",
  description: "Full Stack Developer / UI Designer / AI Automation Specialist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${archivo.variable} ${inter.variable} ${danfo.variable} ${audiowide.variable}`}
    >
      <body className="font-sans antialiased">
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              var stored = localStorage.getItem("theme");
              var theme = stored === "dark" ? "dark" : "light";
              if (theme === "dark") {
                document.documentElement.classList.add("dark");
              }
            })();
          `}
        </Script>
        <ClickSpark
          sparkSize={10}
          sparkRadius={18}
          sparkCount={8}
          duration={450}
        >
          {children}
        </ClickSpark>
      </body>
    </html>
  );
}
