
"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  Maximize2,
  ShoppingBag,
  X,
} from "lucide-react";

import { useClothes } from "@/contexts/clothes-context";
import { useBag } from "@/contexts/bag-context";
import { Button } from "@/components/button";

const categoryLabels: Record<string, string> = {
  top: "Top",
  layer: "Layer",
  bottom: "Bottom",
  outerwear: "Outerwear",
  accessory: "Accessory",
};

function PiecePageContent() {
  const params = useParams<{ slug: string }>();

  const { pieces, collections } = useClothes();
  const { addItem, isReady } = useBag();

  const [isImageOpen, setIsImageOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const piece = pieces.find((item) => item.id === params.slug);

  if (!piece) {
    return (
      <main className="min-h-screen bg-[#EFEBE4] px-5 py-24 text-[#111111] sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[10px] tracking-[0.18em] text-black/45">
            LVRY / 404
          </p>

          <h1 className="mt-8 text-[clamp(4rem,10vw,8rem)] font-bold leading-[0.85] tracking-[-0.09em]">
            Nothing to
            <br />
            wear here.
          </h1>

          <p className="mt-8 max-w-sm text-sm leading-7 text-black/60">
            This piece isn't in the collection. The rest of it is.
          </p>

          <Link
            href="/shop"
            className="mt-10 inline-flex items-center gap-3 bg-[#111111] px-6 py-4 text-sm text-[#EFEBE4] transition-colors hover:bg-[#FF4A1C] hover:text-[#111111]"
          >
            <ArrowLeft size={16} />
            Back to the shop
          </Link>
        </div>
      </main>
    );
  }

  const collection = collections.find(
    (item) => item.codename === piece.collection
  );

  const relatedPieces = pieces
    .filter(
      (item) =>
        item.collection === piece.collection && item.id !== piece.id
    )
    .slice(0, 4);

  const category = categoryLabels[piece.category] ?? piece.category;

  function handleAddToBag() {
    if (!isReady) return;

    addItem(piece);
    setIsAdded(true);

    window.setTimeout(() => {
      setIsAdded(false);
    }, 2200);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#EFEBE4] text-[#111111]">
      {/* Breadcrumb */}
      <div className="border-b border-black/10 px-5 sm:px-10 lg:px-14">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between py-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-black/45 sm:text-[10px]">
            <Link
              href="/shop"
              className="transition-colors hover:text-black"
            >
              SHOP
            </Link>

            <span>/</span>

            <Link
              href={`/shop?collection=${piece.collection}`}
              className="transition-colors hover:text-black"
            >
              {collection?.name.toUpperCase() ?? "COLLECTION"}
            </Link>

            <span>/</span>

            <span className="max-w-[130px] truncate text-black">
              {piece.name.toUpperCase()}
            </span>
          </div>

          <Link
            href="/shop"
            className="hidden items-center gap-2 font-mono text-[9px] tracking-[0.12em] text-black/50 transition-colors hover:text-black sm:flex"
          >
            <ArrowLeft size={12} />
            ALL PIECES
          </Link>
        </div>
      </div>

      {/* Product hero */}
      <section className="px-5 pb-20 pt-8 sm:px-10 sm:pb-28 sm:pt-12 lg:px-14">
        <div className="mx-auto grid max-w-[1600px] gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          {/* Image stage */}
          <div className="relative">
            <div className="relative overflow-hidden bg-[#D9D0C2] p-4 sm:p-8 lg:p-10">
              {/* Paper texture */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.12]"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 180 180\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'.4\'/%3E%3C/svg%3E")',
                }}
              />

              {/* Product paper */}
              <div className="relative z-10 bg-white p-2 shadow-[0_12px_35px_rgba(0,0,0,0.09)] sm:p-4">
                <div className="relative aspect-[4/5] w-full bg-[#EFEBE4]">
                  <Image
                    src={piece.image}
                    alt={piece.name}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Image annotations */}
              <span className="absolute left-5 top-5 z-20 font-mono text-[8px] tracking-[0.15em] text-black/45 sm:left-8 sm:top-8 sm:text-[9px]">
                LVRY / PIECE
              </span>

              <span className="absolute bottom-5 left-5 z-20 font-mono text-[8px] tracking-[0.15em] text-black/45 sm:bottom-8 sm:left-8 sm:text-[9px]">
                {category.toUpperCase()}
              </span>

              <span className="absolute bottom-5 right-5 z-20 rotate-[-8deg] font-serif text-lg italic text-[#FF4A1C] sm:bottom-8 sm:right-8 sm:text-2xl">
                Made to repeat.
              </span>

              {/* Expand image */}
              <Button
  variant="secondary"
  type="button"
  onClick={() => setIsImageOpen(true)}
  aria-label="View product image larger"
  className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center border border-black/15 hover:!text-bone sm:right-8 sm:top-8"
>
  <Maximize2 size={15} strokeWidth={1.5} />
</Button>
            </div>

            {/* Image caption */}
            <div className="mt-4 flex items-center justify-between">
              <span className="font-mono text-[9px] tracking-[0.14em] text-black/45">
                FIG. 001 — THE PIECE
              </span>

              <span className="font-mono text-[9px] tracking-[0.14em] text-black/45">
                01 / 01
              </span>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col lg:sticky lg:top-28 lg:h-fit lg:py-8">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF4A1C]" />

              <p className="font-mono text-[9px] tracking-[0.16em] text-black/50">
                A PIECE FROM THE COLLECTION
              </p>
            </div>

            <h1 className="mt-7 max-w-[650px] text-[clamp(3rem,7vw,6.5rem)] font-bold leading-[0.88] tracking-[-0.085em]">
              {piece.name}
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-black/60">
              One of the pieces in the{" "}
              {collection?.name ?? "LVRY"} collection.
            </p>

            {/* Product metadata */}
            <div className="mt-10 border-y border-black/15">
              <div className="flex items-center justify-between py-4">
                <span className="font-mono text-[9px] tracking-[0.14em] text-black/45">
                  CATEGORY
                </span>
                <span className="text-sm">{category}</span>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 py-4">
                <span className="font-mono text-[9px] tracking-[0.14em] text-black/45">
                  COLLECTION
                </span>
                <span className="text-sm">
                  {collection?.name ?? piece.collection}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-black/10 py-4">
                <span className="font-mono text-[9px] tracking-[0.14em] text-black/45">
                  PIECE CODE
                </span>
                <span className="font-mono text-[10px] text-black/60">
                  {piece.id}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col gap-3">
              <Button
                onClick={handleAddToBag}
                disabled={!isReady}
                className="group flex min-h-[58px] items-center justify-between px-6 transition-colors disabled:cursor-not-allowed !bg-bone disabled:opacity-50"
              >
                <span className="flex items-center gap-3 text-sm">
                  {isAdded ? (
                    <Check size={17} />
                  ) : (
                    <ShoppingBag size={17} />
                  )}
                  {isAdded ? "Added. It's in your bag." : "Add to bag"}
                </span>

                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Button>

              <Link
                href={`/build?piece=${encodeURIComponent(piece.id)}`}
                className="group flex min-h-[58px] items-center justify-between border border-black/25 px-6 transition-colors hover:bg-black hover:text-[#EFEBE4]"
              >
                <span className="text-sm">
                  Build a uniform with this
                </span>

                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </div>

            <p
              aria-live="polite"
              className="mt-5 min-h-5 font-mono text-[9px] tracking-[0.08em] text-black/45"
            >
              {isAdded
                ? "ONE MORE PIECE IN THE BAG."
                : "LVRY IS A FICTIONAL PORTFOLIO PROJECT. NO ORDERS ARE PROCESSED."}
            </p>

            {/* Small handwritten annotation */}
            <div className="mt-12 hidden rotate-[-4deg] self-end sm:block">
              <p className="font-serif text-2xl italic text-[#FF4A1C]">
                Goes with the usual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product details */}
      <section className="border-y border-black/15 bg-[#D9D0C2] px-5 py-20 sm:px-10 sm:py-28 lg:px-14">
        <div className="mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="mb-6 font-mono text-[9px] tracking-[0.16em] text-black/50">
              01 / THE DETAILS
            </p>

            <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.85] tracking-[-0.09em]">
              The
              <br />
              details.
            </h2>

            <p className="mt-8 max-w-xs text-sm leading-[1.8] text-black/60">
              Everything currently in the catalog, in one place. No
              additional claims.
            </p>
          </div>

          <div className="border-t border-black/20">
            <div className="flex items-center justify-between border-b border-black/20 py-6">
              <span className="text-lg tracking-[-0.04em]">Product name</span>
              <span className="max-w-[55%] text-right text-sm text-black/55">
                {piece.name}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-black/20 py-6">
              <span className="text-lg tracking-[-0.04em]">Category</span>
              <span className="text-sm text-black/55">{category}</span>
            </div>

            <div className="flex items-center justify-between border-b border-black/20 py-6">
              <span className="text-lg tracking-[-0.04em]">Collection</span>
              <span className="text-sm text-black/55">
                {collection?.name ?? piece.collection}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-black/20 py-6">
              <span className="text-lg tracking-[-0.04em]">Measurements</span>
              <span className="text-sm text-black/40">Not specified</span>
            </div>

            <div className="flex items-center justify-between border-b border-black/20 py-6">
              <span className="text-lg tracking-[-0.04em]">
                Fabric and care
              </span>
              <span className="text-sm text-black/40">Not specified</span>
            </div>

            <p className="pt-5 font-mono text-[9px] leading-6 tracking-[0.08em] text-black/45">
              PRODUCT SPECIFICATIONS WILL APPEAR HERE WHEN THEY ARE
              ADDED TO THE CATALOG.
            </p>
          </div>
        </div>
      </section>

      {/* Related pieces */}
      <section className="px-5 py-24 sm:px-10 sm:py-32 lg:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="mb-5 font-mono text-[9px] tracking-[0.16em] text-black/45">
                02 / SAME COLLECTION
              </p>

              <h2 className="text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.85] tracking-[-0.085em]">
                Goes with
                <br />
                <span className="font-serif font-normal italic">
                  these.
                </span>
              </h2>
            </div>

            <p className="max-w-[260px] text-sm leading-[1.8] text-black/55">
              Other pieces from the same collection. They know each other.
            </p>
          </div>

          {relatedPieces.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
              {relatedPieces.map((relatedPiece, index) => (
                <Link
                  key={relatedPiece.id}
                  href={`/shop/${relatedPiece.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-[#D9D0C2] p-3 sm:p-5">
                    <div className="relative aspect-[4/5] bg-[#EFEBE4]">
                      <Image
                        src={relatedPiece.image}
                        alt={relatedPiece.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>

                    <span className="absolute left-5 top-5 font-mono text-[8px] tracking-[0.12em] text-black/45 sm:left-7 sm:top-7">
                      0{index + 1}
                    </span>

                    <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFEBE4] opacity-0 transition-all duration-300 group-hover:opacity-100 sm:bottom-7 sm:right-7">
                      <ArrowUpRight size={15} />
                    </span>
                  </div>

                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm leading-snug tracking-[-0.02em]">
                        {relatedPiece.name}
                      </h3>

                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-black/45">
                        {categoryLabels[relatedPiece.category] ??
                          relatedPiece.category}
                      </p>
                    </div>

                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-black/40 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-black"
                    />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="border-y border-black/15 py-12">
              <p className="text-sm text-black/55">
                Nothing else in this collection yet.
              </p>
            </div>
          )}

          <div className="mt-12 border-t border-black/15 pt-6">
            <Link
              href={`/shop?collection=${piece.collection}`}
              className="group inline-flex items-center gap-4 text-sm"
            >
              See the whole collection

              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-2"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Uniform builder CTA */}
      <section className="relative overflow-hidden bg-[#111111] px-5 py-24 text-[#EFEBE4] sm:px-10 sm:py-32 lg:px-14 lg:py-40">
        <div className="relative z-10 mx-auto grid max-w-[1500px] gap-12 lg:grid-cols-[1fr_0.7fr] lg:items-center">
          <div>
            <p className="mb-8 font-mono text-[9px] tracking-[0.16em] text-white/40">
              03 / PUT IT TOGETHER
            </p>

            <h2 className="max-w-[900px] text-[clamp(4rem,10vw,10rem)] font-bold leading-[0.82] tracking-[-0.1em]">
              A few pieces
              <br />
              work better
              <br />
              <span className="font-serif font-normal italic text-[#FF4A1C]">
                together.
              </span>
            </h2>

            <p className="mt-10 max-w-sm text-sm leading-[1.8] text-white/55">
              Put this piece into a uniform. Add a few others. See what
              works.
            </p>

            <Link
              href={`/build?piece=${encodeURIComponent(piece.id)}`}
              className="group mt-10 inline-flex min-h-[58px] items-center gap-8 bg-[#EFEBE4] px-6 text-sm text-[#111111] transition-colors hover:bg-[#FF4A1C]"
            >
              Build a uniform

              <ArrowUpRight
                size={18}
                className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
              />
            </Link>
          </div>

          {/* Featured piece cutout */}
          <div className="relative mx-auto w-full max-w-[440px]">
            <div className="rotate-[4deg] bg-[#D9D0C2] p-4 shadow-2xl sm:p-6">
              <div className="relative aspect-[4/5] bg-[#EFEBE4]">
                <Image
                  src={piece.image}
                  alt={piece.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 440px"
                  className="object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-4 text-[#111111]">
                <span className="font-mono text-[9px] tracking-[0.12em]">
                  {piece.name.toUpperCase()}
                </span>

                <span className="font-serif text-lg italic">LVRY.</span>
              </div>
            </div>

            <span className="absolute -right-4 top-4 rotate-[10deg] font-serif text-2xl italic text-[#FF4A1C] sm:-right-8">
              Start here.
            </span>
          </div>
        </div>

        <span className="pointer-events-none absolute -bottom-12 right-[-3%] select-none text-[35vw] font-black leading-none tracking-[-0.12em] text-white/[0.035]">
          LVRY
        </span>
      </section>

      {/* Image viewer */}
      {isImageOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${piece.name} image viewer`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111]/95 p-4 sm:p-10"
          onClick={() => setIsImageOpen(false)}
        >
          <button
            type="button"
            onClick={() => setIsImageOpen(false)}
            aria-label="Close image viewer"
            className="absolute right-5 top-5 z-20 flex h-12 w-12 items-center justify-center border border-white/20 text-white transition-colors hover:bg-white hover:text-black"
          >
            <X size={20} />
          </button>

          <div
            className="relative h-[85vh] w-full max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={piece.image}
              alt={piece.name}
              fill
              sizes="90vw"
              className="object-contain"
            />

            <p className="absolute bottom-0 left-0 right-0 text-center font-mono text-[10px] tracking-[0.15em] text-white/60">
              {piece.name.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function PiecePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#EFEBE4] px-5 py-24 text-[#111111] sm:px-10">
          <div className="mx-auto max-w-[1600px] animate-pulse">
            <div className="h-4 w-32 bg-black/10" />

            <div className="mt-12 grid gap-10 lg:grid-cols-2">
              <div className="aspect-[4/5] bg-black/5" />

              <div className="space-y-6">
                <div className="h-16 w-3/4 bg-black/5" />
                <div className="h-5 w-1/2 bg-black/5" />
                <div className="h-32 bg-black/5" />
                <div className="h-14 bg-black/5" />
              </div>
            </div>
          </div>
        </main>
      }
    >
      <PiecePageContent />
    </Suspense>
  );
}
