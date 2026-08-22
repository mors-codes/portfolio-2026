import type { Metadata } from "next";
import { archivo, inter, danfo, audiowide } from "@/lib/fonts";
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
      className={`${archivo.variable} ${inter.variable} ${danfo.variable} ${audiowide.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}