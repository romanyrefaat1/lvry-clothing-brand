import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";
import { BagProvider } from "@/contexts/bag-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ClothesProvider } from "@/contexts/clothes-context";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LVRY — The everyday uniform",
  description:
    "A small range of clothes for the days that make up most of your life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${geist.variable} ${geistMono.variable} ${caveat.variable}`}
    >
      <body>
      <BagProvider>
        <ClothesProvider>
        <SiteHeader />
      {children}
      <SiteFooter />
      </ClothesProvider>
      </BagProvider>
      </body>
    </html>
  );
}