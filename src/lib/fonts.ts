import { Archivo, Inter, Danfo, Audiowide } from "next/font/google";

export const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-inter",
  display: "swap",
});

export const danfo = Danfo({
  subsets: ["latin"],
  variable: "--font-danfo",
  display: "swap",
});

export const audiowide = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-audiowide",
  display: "swap",
});