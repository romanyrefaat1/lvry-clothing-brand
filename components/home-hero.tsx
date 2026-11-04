"use client";

import Image from "next/image";
import Link from "next/link";
import { useClothes } from "@/contexts/clothes-context";
import { Button } from "./button";

export function HomeHero() {
  const { getCollectionPieces } = useClothes();

  const collectionPieces = getCollectionPieces("college-student");

  const heroPiece =
    collectionPieces.find((piece) => piece.category === "layer") ??
    collectionPieces.find((piece) => piece.category === "top") ??
    collectionPieces[0];

  return (
    <section className="overflow-hidden bg-bone">
      <div className="lvry-container grid min-h-[690px] grid-cols-1 items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20 lg:min-h-[760px]">
        {/* Copy */}
        <div className="relative z-10 max-w-[660px]">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-signal" />

            <p className="eyebrow text-muted">
              Independent clothing label / Est. concept
            </p>
          </div>

          <h1 className="display-heading max-w-[700px] text-[clamp(3.25rem,10vw,9.5rem)]">
            THE
            <br />
            EVERYDAY
            <br />
            UNIFORM<span className="text-signal">.</span>
          </h1>

          <div className="mt-9 max-w-[390px]">
            <p className="text-base leading-7 text-ink/75 md:text-lg">
              A small range of clothes for the days that make up most of your
              life.
            </p>

            <p className="mt-3 text-sm leading-6 text-muted">
              No complicated wardrobe. No difficult decisions. Just pieces
              that work together.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link
              href="/shop"
              >
              <Button>
                Shop the pieces
              <span aria-hidden="true">↗</span>
              </Button>
            </Link>

            <Link href="/build" className="text-link">
              Build your uniform
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          <p className="handwritten mt-10 -rotate-3 text-2xl text-denim">
            Wear it daily. Repeat as needed.
          </p>
        </div>

        {/* Paper-cutout composition */}
        <div className="relative mx-auto h-[470px] w-full max-w-[550px] md:h-[590px]">
          {/* Back paper */}
          <div className="paper-texture absolute left-[9%] top-[5%] h-[82%] w-[76%] rotate-[-5deg] border border-ink/10 shadow-paper" />

          {/* Denim fabric */}
          <div className="absolute right-[1%] top-[11%] h-[28%] w-[37%] rotate-[8deg] bg-denim p-3 shadow-paper">
            <div className="h-full border border-white/30" />

            <span className="absolute -bottom-6 right-0 font-mono text-[9px] uppercase tracking-widest text-muted">
              Denim / Fabric
            </span>
          </div>

          {/* Actual catalog garment */}
          <div className="absolute left-[13%] top-[12%] z-10 flex h-[75%] w-[68%] rotate-[-4deg] items-center justify-center border border-ink/10 bg-[#F7F4EF] p-5 shadow-[8px_10px_0_rgba(17,17,17,0.12)]">
            {heroPiece ? (
              <>
                <div className="relative h-full w-full">
                  <Image
                    src={heroPiece.image}
                    alt={heroPiece.name}
                    fill
                    priority
                    sizes="(max-width: 767px) 80vw, 40vw"
                    className="object-contain"
                  />
                </div>

                <span className="absolute bottom-4 left-4 max-w-[80%] truncate font-mono text-[9px] uppercase tracking-widest text-ink/60">
                  {heroPiece.name}
                </span>
              </>
            ) : (
              <p className="font-mono text-xs uppercase text-muted">
                No catalog pieces available
              </p>
            )}
          </div>

          {/* Canvas swatch */}
          <div className="absolute bottom-[8%] right-[4%] z-20 h-[26%] w-[34%] rotate-[7deg] bg-canvas p-3 shadow-paper">
            <div className="h-full border border-ink/20" />

            <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase tracking-widest">
              Canvas / Fabric
            </span>
          </div>

          {/* Orange annotation */}
          <div className="absolute right-[2%] top-[46%] z-30 flex h-[82px] w-[82px] rotate-[10deg] items-center justify-center bg-signal text-center shadow-paper">
            <span className="font-mono text-[10px] font-medium uppercase leading-4">
              Made
              <br />
              to
              <br />
              repeat
            </span>
          </div>

          {/* Handwritten note */}
          <p className="handwritten absolute bottom-[1%] left-[4%] z-30 -rotate-6 text-3xl text-denim">
            Nothing to figure out.
          </p>

          {/* Small label */}
          <div className="absolute left-[2%] top-[4%] z-20 -rotate-6 border border-ink/20 bg-bone px-3 py-2 shadow-paper">
            <span className="font-mono text-[9px] uppercase tracking-wider">
              LVRY / Daily issue
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-y border-ink bg-signal">
        <div className="lvry-container flex min-h-12 items-center justify-between gap-4 overflow-hidden">
          <span className="eyebrow whitespace-nowrap text-ink">
            Small range. On purpose.
          </span>

          <span className="eyebrow hidden whitespace-nowrap text-ink sm:block">
            Pieces of a uniform.
          </span>

          <span className="eyebrow whitespace-nowrap text-ink">
            Made to repeat.
          </span>
        </div>
      </div>
    </section>
  );
}