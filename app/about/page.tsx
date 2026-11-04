
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useClothes } from "@/contexts/clothes-context";

import type {
  ClothingCategory,
  ClothingPiece,
} from "@/contexts/clothes-context";
import { Button } from "@/components/button";

const manifesto =
  "We think most people wear the same few things anyway. So we make those things properly, in a small range, and we describe them honestly.";

function CatalogImage({
  piece,
  sizes,
  className = "",
}: {
  piece: ClothingPiece | undefined;
  sizes: string;
  className?: string;
}) {
  if (!piece) {
    return (
      <div className={`flex items-center justify-center bg-[#D9D0C2] ${className}`}>
        <span className="font-mono text-[9px] tracking-widest text-black/40">
          IMAGE UNAVAILABLE
        </span>
      </div>
    );
  }

  return (
    <Image
      src={piece.image}
      alt={piece.name}
      fill
      sizes={sizes}
      className={className}
    />
  );
}

export default function AboutPage() {
  const { pieces } = useClothes();

  // Select actual products from the catalog.
  // The fallbacks keep the collage populated if a category is missing.
  const getByCategory = (category: ClothingCategory, fallbackIndex: number) =>
    pieces.find((piece) => piece.category === category) ??
    pieces[fallbackIndex] ??
    pieces[0];

  const topPiece = getByCategory("top", 0);
  const layerPiece = getByCategory("layer", 1);
  const outerwearPiece = getByCategory("outerwear", 2);
  const bottomPiece = getByCategory("bottom", 3);

  const heroPieces = [
    {
      piece: topPiece,
      label: "THE USUAL STARTING POINT.",
      position:
        "left-[7%] top-[12%] rotate-[-8deg] sm:left-[12%] sm:top-[10%]",
      width: "w-[125px] sm:w-[220px]",
    },
    {
      piece: layerPiece,
      label: "THIS GOES WITH THAT.",
      position:
        "left-[37%] top-[21%] rotate-[7deg] sm:left-[39%] sm:top-[13%]",
      width: "w-[135px] sm:w-[240px]",
    },
    {
      piece: outerwearPiece,
      label: "NOTHING COMPLICATED.",
      position:
        "right-[6%] top-[12%] rotate-[5deg] sm:right-[11%] sm:top-[12%]",
      width: "w-[115px] sm:w-[205px]",
    },
  ];

  const principles = [
    {
      number: "01",
      title: "Repeatable.",
      subtitle: "Clothes for the days that happen most.",
      description:
        "The pieces should work on an ordinary Monday. And on Tuesday. And on the days when you don't feel like figuring out something new.",
      note: "MADE TO REPEAT",
      background: "#D9D0C2",
      piece: topPiece,
    },
    {
      number: "02",
      title: "Considered.",
      subtitle: "A small range. On purpose.",
      description:
        "Not a hundred versions of the same thing. A small collection where every piece has a place and works with the others.",
      note: "LESS, BUT THOUGHT THROUGH",
      background: "#C5B8A5",
      piece: layerPiece ?? bottomPiece,
    },
    {
      number: "03",
      title: "Plain-spoken.",
      subtitle: "Clothing without the usual sales pitch.",
      description:
        "Fit, fabric and sizing should be explained clearly. You shouldn't have to decode a paragraph of marketing language to understand a shirt.",
      note: "SAY WHAT IT IS",
      background: "#B9C2C8",
      piece: outerwearPiece ?? bottomPiece,
    },
  ];

  const thingsWeAreNot = [
    {
      title: "No hype.",
      text: "No countdowns. No artificial scarcity. No pressure to buy something before it disappears.",
    },
    {
      title: "No endless range.",
      text: "A small collection is intentional. More options don't automatically make a better wardrobe.",
    },
    {
      title: "No sales language.",
      text: "The clothes should speak for themselves. We'll tell you what a piece is, not what you should feel about it.",
    },
  ];

  return (
    <main className="overflow-hidden bg-[#EFEBE4] text-[#111111]">
      {/* HERO */}
      <section className="relative px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-20 lg:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex items-center justify-between border-b border-black/15 pb-3">
            <span className="font-mono text-[10px] tracking-[0.16em]">
              LVRY / ABOUT
            </span>

            <span className="font-mono text-[10px] tracking-[0.16em] text-black/45">
              A NOTE ON WHAT WE DO
            </span>
          </div>

          <div className="grid items-end gap-12 lg:grid-cols-[1fr_350px]">
            <div>
              <p className="mb-6 font-mono text-[10px] tracking-[0.18em] text-black/50">
                THE EVERYDAY UNIFORM.
              </p>

              <h1 className="text-[clamp(6rem,19vw,17rem)] font-bold leading-[0.72] tracking-[-0.115em]">
                LVRY
                <span className="ml-2 align-top font-serif text-[0.15em] font-normal italic tracking-normal text-[#FF4A1C]">
                  /ˈlɪv.ər.i/
                </span>
              </h1>
            </div>

            <div className="max-w-[340px] pb-2 lg:pb-4">
              <p className="text-[17px] leading-[1.7] tracking-[-0.02em] text-black/70">
                A small range of everyday clothes. Made to work together.
                Described without the usual sales pitch.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20">
                  <ArrowDown size={16} strokeWidth={1.4} />
                </span>

                <span className="font-mono text-[9px] tracking-[0.15em] text-black/50">
                  A LITTLE MORE ABOUT US
                </span>
              </div>
            </div>
          </div>

          {/* HERO COLLAGE */}
          <div className="relative mt-16 min-h-[470px] overflow-hidden border border-black/10 bg-[#D9D0C2] sm:mt-24 sm:min-h-[650px] lg:min-h-[760px]">
            {/* Paper texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.18]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.3'/%3E%3C/svg%3E\")",
              }}
            />

            {heroPieces.map(({ piece, label, position, width }, index) => (
              <div
                key={`${piece?.id ?? "empty"}-${index}`}
                className={`absolute z-10 ${position}`}
              >
                <div
                  className={`${width} relative border-[7px] border-white bg-[#EFEBE4] p-1 shadow-xl sm:border-[10px]`}
                >
                  <div className="relative aspect-[4/5] w-full">
                    <CatalogImage
                      piece={piece}
                      sizes="(max-width: 640px) 140px, 250px"
                      className="object-contain"
                    />
                  </div>
                </div>

                <p className="mt-3 rotate-[-2deg] font-mono text-[8px] tracking-[0.12em] sm:text-[10px]">
                  {label}
                </p>
              </div>
            ))}

            {/* Central wordmark */}
            <div className="absolute bottom-[10%] left-0 right-0 z-20 text-center">
              <p className="font-mono text-[9px] tracking-[0.22em] text-black/55 sm:text-[11px]">
                A UNIFORM MADE OF PIECES
              </p>

              <p className="mt-3 text-[clamp(3.5rem,10vw,9rem)] font-bold leading-none tracking-[-0.1em]">
                MADE TO REPEAT.
              </p>
            </div>

            {/* Handwritten note */}
            <div className="absolute bottom-[36%] right-[9%] z-20 hidden rotate-[-10deg] sm:block">
              <p className="font-serif text-2xl italic text-[#FF4A1C]">
                Monday again.
              </p>

              <svg
                viewBox="0 0 100 30"
                className="ml-3 h-6 w-24 text-[#FF4A1C]"
                fill="none"
              >
                <path
                  d="M2 4C30 25 65 25 91 8M80 4L92 8L85 19"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <span className="absolute bottom-4 left-4 z-20 font-mono text-[8px] tracking-[0.15em] text-black/45 sm:bottom-6 sm:left-7 sm:text-[9px]">
              FIG. 001 — THE LVRY WAY
            </span>

            <span className="absolute right-4 top-4 z-20 font-mono text-[8px] tracking-[0.15em] text-black/45 sm:right-7 sm:top-6 sm:text-[9px]">
              A SMALL COLLECTION
            </span>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="border-y border-black/15 bg-[#111111] px-5 py-24 text-[#EFEBE4] sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.35fr_1fr]">
          <div>
            <p className="font-mono text-[10px] tracking-[0.16em] text-white/40">
              01 / THE MANIFESTO
            </p>

            <span className="mt-5 block font-serif text-5xl italic text-[#FF4A1C]">
              A note.
            </span>
          </div>

          <div>
            <p className="max-w-[1100px] text-[clamp(2rem,5.4vw,5.6rem)] font-medium leading-[1.12] tracking-[-0.065em]">
              {manifesto}
            </p>

            <div className="mt-12 flex items-center gap-3 border-t border-white/20 pt-5">
              <span className="h-2 w-2 rounded-full bg-[#FF4A1C]" />

              <span className="font-mono text-[9px] tracking-[0.16em] text-white/45">
                THE IDEA BEHIND LVRY
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PRINCIPLES */}
      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-16 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-5 font-mono text-[10px] tracking-[0.16em] text-black/45">
                02 / WHAT MATTERS
              </p>

              <h2 className="text-[clamp(3.5rem,8vw,8rem)] font-medium leading-[0.85] tracking-[-0.085em]">
                Three things.
                <br />
                <span className="font-serif font-normal italic">
                  That's it.
                </span>
              </h2>
            </div>

            <p className="max-w-[270px] text-sm leading-[1.8] text-black/55">
              Not a complicated philosophy. Just a few things we think
              clothing should get right.
            </p>
          </div>

          <div className="border-t border-black/20">
            {principles.map((principle) => (
              <article
                key={principle.number}
                className="grid gap-8 border-b border-black/20 py-10 lg:grid-cols-[100px_0.9fr_1fr_0.8fr] lg:items-center lg:gap-12 lg:py-14"
              >
                <span className="font-mono text-[11px] text-black/40">
                  {principle.number}
                </span>

                <div>
                  <h3 className="text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.08em]">
                    {principle.title}
                  </h3>

                  <p className="mt-4 max-w-[260px] text-sm leading-[1.6] text-black/55">
                    {principle.subtitle}
                  </p>
                </div>

                <p className="max-w-[380px] text-[14px] leading-[1.85] text-black/65">
                  {principle.description}
                </p>

                <div
                  className="relative ml-auto w-full max-w-[310px] overflow-hidden p-3"
                  style={{ backgroundColor: principle.background }}
                >
                  <div className="border-[6px] border-white bg-white p-1 shadow-md">
                    <div className="relative aspect-[5/4] w-full">
                      <CatalogImage
                        piece={principle.piece}
                        sizes="(max-width: 1024px) 80vw, 310px"
                        className="object-contain"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <span className="font-mono text-[8px] tracking-[0.12em]">
                      {principle.note}
                    </span>

                    <span className="font-serif text-lg italic">
                      LVRY.
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* THE NAME */}
      <section className="border-y border-black/15 bg-[#D9D0C2] px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="mx-auto grid max-w-[1500px] gap-14 lg:grid-cols-2 lg:items-center">
          <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden border border-black/10 bg-[#EFEBE4] sm:min-h-[480px]">
            <div className="absolute left-[12%] top-[12%] h-[70%] w-[70%] rotate-[-7deg] border border-black/10 bg-[#C9B79C]" />

            <div className="relative z-10 rotate-[4deg] border-[10px] border-white bg-[#EFEBE4] px-8 py-12 shadow-xl sm:px-14 sm:py-16">
              <p className="text-[clamp(4rem,10vw,8rem)] font-bold leading-none tracking-[-0.12em]">
                LVRY
              </p>

              <p className="mt-4 text-center font-mono text-[9px] tracking-[0.2em] text-black/45">
                /ˈlɪv.ər.i/
              </p>
            </div>

            <span className="absolute bottom-5 right-5 rotate-[-8deg] font-serif text-xl italic text-[#FF4A1C]">
              A name with a reason.
            </span>
          </div>

          <div className="lg:pl-10">
            <p className="mb-6 font-mono text-[10px] tracking-[0.16em] text-black/45">
              03 / THE NAME
            </p>

            <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.085em]">
              A word.
              <br />
              <span className="font-serif font-normal italic">
                A uniform.
              </span>
            </h2>

            <div className="mt-10 max-w-[450px] space-y-5 text-[15px] leading-[1.85] text-black/65">
              <p>
                LVRY is pronounced{" "}
                <span className="text-black">livery</span>.
              </p>

              <p>
                Livery means a distinctive uniform. It's where the name comes
                from.
              </p>

              <p>
                The idea is simple: a wardrobe built from a small number of
                pieces that belong together.
              </p>
            </div>

            <div className="mt-10 border-t border-black/20 pt-5">
              <span className="font-mono text-[9px] tracking-[0.16em] text-black/45">
                THE EVERYDAY UNIFORM.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE ARE NOT */}
      <section className="px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1fr]">
            <div>
              <p className="mb-5 font-mono text-[10px] tracking-[0.16em] text-black/45">
                04 / A FEW THINGS WE'RE NOT
              </p>

              <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.88] tracking-[-0.085em]">
                No need
                <br />
                <span className="font-serif font-normal italic">
                  for all that.
                </span>
              </h2>
            </div>

            <div className="border-t border-black/20">
              {thingsWeAreNot.map((item) => (
                <div
                  key={item.title}
                  className="grid gap-3 border-b border-black/20 py-7 sm:grid-cols-[150px_1fr] sm:gap-8"
                >
                  <h3 className="text-xl tracking-[-0.04em]">
                    {item.title}
                  </h3>

                  <p className="max-w-[470px] text-sm leading-[1.8] text-black/60">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#FF4A1C] px-5 py-24 sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="relative z-10 mx-auto max-w-[1500px]">
          <p className="mb-8 font-mono text-[10px] tracking-[0.17em] text-black/55">
            05 / ENOUGH ABOUT US
          </p>

          <h2 className="max-w-[1000px] text-[clamp(4rem,12vw,11rem)] font-bold leading-[0.8] tracking-[-0.1em]">
            Less to
            <br />
            think about.
          </h2>

          <div className="mt-14 flex flex-col justify-between gap-10 border-t border-black/25 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-[300px] text-sm leading-[1.8] text-black/70">
              A small collection of pieces. Have a look around.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
              >
                <Button variant="light_bg" className="border-1">
                Shop the pieces

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
                </Button>
              </Link>

              <Link
                href="/build"
              >
                <Button variant="default" className="hover:border-1">
                Build a uniform

                <ArrowUpRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute -bottom-12 right-[-3%] select-none text-[35vw] font-black leading-none tracking-[-0.12em] text-black/[0.055]">
          LVRY
        </span>
      </section>
    </main>
  );
}
