"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  X,
} from "lucide-react";
import { useClothes } from "@/contexts/clothes-context";

type Look = {
  id: string;
  number: string;
  day: string;
  title: string;
  subtitle: string;
  description: string;
  annotation: string;
  background: string;
  pieceIds: string[];
};

const looks: Look[] = [
  {
    id: "the-usual",
    number: "01",
    day: "MONDAY, PROBABLY",
    title: "The usual.",
    subtitle: "A good place to start.",
    description:
      "A simple combination of a T-shirt and pleated chinos. Some combinations don't need much explaining.",
    annotation: "No decisions required.",
    background: "#D9D0C2",
    pieceIds: [
      "off-white-short-sleeve-tshirt",
      "tan-pleated-chinos",
      "canvas-tote-bag",
    ],
  },
  {
    id: "one-more-layer",
    number: "02",
    day: "TUESDAY, MAYBE",
    title: "One more layer.",
    subtitle: "For when a tee isn't enough.",
    description:
      "A T-shirt with an overshirt on top. Leave it open, keep the rest simple, get on with the day.",
    annotation: "An extra layer. That's all.",
    background: "#B8C2C8",
    pieceIds: [
      "off-white-short-sleeve-tshirt",
      "blue-button-down-overshirt",
      "dark-blue-denim-jeans",
    ],
  },
  {
    id: "out-the-door",
    number: "03",
    day: "WEDNESDAY, OR SO",
    title: "Out the door.",
    subtitle: "A little more structure.",
    description:
      "A long-sleeve base with a zip-up jacket and denim. An uncomplicated combination with another layer.",
    annotation: "Weather dependent.",
    background: "#C5B8A5",
    pieceIds: [
      "olive-green-long-sleeve-tshirt",
      "black-zip-up-jacket",
      "dark-blue-denim-jeans",
    ],
  },
  {
    id: "back-to-basics",
    number: "04",
    day: "THURSDAY. OR FRIDAY.",
    title: "Back to basics.",
    subtitle: "Nothing new to figure out.",
    description:
      "A sweatshirt, chinos and a tote. The pieces you already know, put together again.",
    annotation: "Made to repeat.",
    background: "#E0D7C9",
    pieceIds: [
      "beige-crewneck-sweatshirt",
      "tan-pleated-chinos",
      "canvas-tote-bag",
    ],
  },
];

const details = [
  {
    number: "A",
    pieceId: "olive-green-long-sleeve-tshirt",
    title: "The starting point",
    description: "A piece that can work on its own or underneath another.",
    className: "aspect-[4/5]",
  },
  {
    number: "B",
    pieceId: "blue-button-down-overshirt",
    title: "The extra layer",
    description: "Another piece in the combination. Nothing complicated.",
    className: "aspect-[5/4]",
  },
  {
    number: "C",
    pieceId: "tan-pleated-chinos",
    title: "The everyday",
    description: "A familiar part of the rotation.",
    className: "aspect-[4/5]",
  },
];

const categoryLabels: Record<string, string> = {
  top: "TOP",
  layer: "LAYER",
  bottom: "BOTTOM",
  outerwear: "OUTERWEAR",
  accessory: "ACCESSORY",
};

export default function LookbookPage() {
  const { getPiece } = useClothes();

  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [shopPanelOpen, setShopPanelOpen] = useState(false);

  const activeLook = looks[activeLookIndex];

  const activePieces = activeLook.pieceIds.flatMap((id) => {
    const piece = getPiece(id);
    return piece ? [piece] : [];
  });

  const selectedPiece = selectedPieceId
    ? activePieces.find((piece) => piece.id === selectedPieceId) ?? null
    : null;

  const changeLook = (index: number) => {
    setActiveLookIndex((index + looks.length) % looks.length);
    setSelectedPieceId(null);
  };

  const nextLook = () => changeLook(activeLookIndex + 1);
  const previousLook = () => changeLook(activeLookIndex - 1);

  useEffect(() => {
    if (!shopPanelOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShopPanelOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [shopPanelOpen]);

  return (
    <main className="overflow-hidden bg-[#EFEBE4] text-[#111111]">
      {/* INTRO */}
      <section className="relative px-5 pb-12 pt-12 sm:px-8 sm:pt-20 lg:px-14 lg:pb-20">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-10 flex items-center justify-between border-b border-black/15 pb-3">
            <span className="font-mono text-[10px] tracking-[0.16em]">
              LVRY / JOURNAL
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em]">
              ISSUE NO. 001 — 2026
            </span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div className="relative">
              <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-black/55">
                A STUDY OF GETTING DRESSED
              </p>

              <h1 className="max-w-[900px] text-[clamp(4.5rem,11vw,10.5rem)] font-semibold leading-[0.78] tracking-[-0.095em]">
                One uniform.
                <br />
                <span className="font-serif font-normal italic tracking-[-0.09em]">
                  Many days.
                </span>
              </h1>
            </div>

            <div className="flex flex-col justify-between gap-8 lg:pb-2 lg:pl-16">
              <p className="max-w-[340px] text-[15px] leading-[1.7] text-black/65">
                You probably have a few clothes you reach for more than the
                others. We think that&apos;s worth building around.
              </p>

              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-black/25">
                  <ArrowDown size={16} strokeWidth={1.4} />
                </span>
                <span className="font-mono text-[10px] tracking-[0.14em]">
                  SCROLL THROUGH THE LOOKS
                </span>
              </div>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute right-[8%] top-[31%] hidden rotate-[-9deg] font-serif text-[19px] italic text-[#FF4A1C] lg:block">
          Wear it daily.
        </span>
      </section>

      {/* EDITORIAL LOOK SELECTOR */}
      <section id="looks" className="px-3 pb-20 sm:px-6 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-4 flex items-end justify-between px-2">
            <div>
              <p className="font-mono text-[10px] tracking-[0.16em] text-black/50">
                THE LOOKS
              </p>
              <p className="mt-1 text-sm">
                Four ways to wear the same collection.
              </p>
            </div>

            <span className="font-mono text-[10px] tracking-[0.12em] text-black/50">
              {activeLook.number} / 04
            </span>
          </div>

          <div className="grid overflow-hidden border border-black/15 bg-[#E5DFD5] lg:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.65fr)]">
            {/* GARMENT COMPOSITION */}
            <div
              className="relative flex min-h-[540px] items-center justify-center overflow-hidden sm:min-h-[700px] lg:min-h-[790px]"
              style={{ backgroundColor: activeLook.background }}
            >
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2 sm:left-8 sm:top-8">
                <span className="bg-[#EFEBE4] px-3 py-2 font-mono text-[9px] tracking-[0.14em]">
                  LVRY / {activeLook.number}
                </span>
                <span className="hidden bg-[#EFEBE4] px-3 py-2 font-mono text-[9px] tracking-[0.14em] sm:block">
                  {activeLook.day}
                </span>
              </div>

              {/* Decorative background marks */}
              <div className="pointer-events-none absolute inset-0 opacity-20">
                <div className="absolute left-[12%] top-[18%] h-40 w-40 rounded-full border border-black/40" />
                <div className="absolute bottom-[18%] right-[12%] h-64 w-64 rounded-full border border-black/30" />
                <div className="absolute left-1/2 top-0 h-full w-px bg-black/10" />
              </div>

              {/* Actual catalog pieces */}
              <div className="relative z-10 grid w-full max-w-[850px] grid-cols-2 items-center gap-3 px-5 pb-32 pt-24 sm:gap-8 sm:px-12">
                {activePieces.map((piece, index) => (
                  <Link
                    key={piece.id}
                    href={`/shop/${piece.id}`}
                    className={`group relative flex aspect-[4/5] items-center justify-center transition-transform duration-500 hover:-translate-y-2 ${
                      index === 1 ? "translate-y-10" : ""
                    } ${activePieces.length === 3 && index === 2 ? "col-span-2 mx-auto w-[65%] sm:w-[55%]" : ""}`}
                    aria-label={`View ${piece.name}`}
                  >
                    <img
                      src={piece.image}
                      alt={piece.name}
                      className="h-full w-full object-contain drop-shadow-[0_18px_14px_rgba(0,0,0,0.12)] transition-transform duration-500 group-hover:scale-[1.04]"
                    />

                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#EFEBE4] px-3 py-1.5 font-mono text-[8px] tracking-[0.12em] opacity-0 transition-opacity group-hover:opacity-100">
                      VIEW PIECE
                    </span>
                  </Link>
                ))}
              </div>

              {/* Annotation */}
              <div className="absolute right-5 top-20 z-20 rotate-[7deg] sm:right-12 sm:top-24">
                <span className="font-serif text-lg italic text-[#111111] sm:text-2xl">
                  {activeLook.annotation}
                </span>
                <svg
                  viewBox="0 0 90 25"
                  className="ml-3 h-5 w-20 text-[#111111]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3C25 22 59 23 83 8M73 5L84 8L78 18"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {/* IMAGE FOOTER */}
              <div className="absolute bottom-0 left-0 right-0 z-20 flex items-end justify-between bg-gradient-to-t from-black/30 to-transparent p-5 text-white sm:p-8">
                <div>
                  <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-white/75">
                    CURRENT STUDY
                  </p>
                  <h2 className="text-5xl font-medium tracking-[-0.07em] sm:text-7xl lg:text-8xl">
                    {activeLook.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/80">
                    {activeLook.subtitle}
                  </p>
                </div>

                <div className="hidden items-center gap-2 sm:flex">
                  <button
                    onClick={previousLook}
                    aria-label="Previous look"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-colors hover:bg-white hover:text-black"
                  >
                    <ArrowLeft size={17} />
                  </button>
                  <button
                    onClick={nextLook}
                    aria-label="Next look"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 transition-colors hover:bg-white hover:text-black"
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </div>

            {/* LOOK DETAILS */}
            <div className="flex flex-col justify-between border-t border-black/15 bg-[#EFEBE4] lg:border-l lg:border-t-0">
              <div className="p-6 sm:p-8 lg:p-9">
                <div className="mb-12 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.16em] text-black/50">
                    THE COMBINATION
                  </span>
                  <span className="font-mono text-[10px] text-black/50">
                    {activePieces.length} PIECES
                  </span>
                </div>

                <p className="mb-4 max-w-[300px] text-[15px] leading-[1.7] text-black/65">
                  {activeLook.description}
                </p>

                <div className="mb-8 mt-10 border-t border-black/15">
                  {activePieces.map((piece, index) => (
                    <button
                      key={piece.id}
                      onClick={() => setSelectedPieceId(piece.id)}
                      aria-pressed={selectedPieceId === piece.id}
                      className={`group flex w-full items-center justify-between border-b border-black/15 py-5 text-left transition-colors ${
                        selectedPieceId === piece.id
                          ? "bg-black/[0.035]"
                          : "hover:bg-black/[0.025]"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-[10px] text-black/35">
                          0{index + 1}
                        </span>
                        <div>
                          <p className="text-[15px] tracking-[-0.02em]">
                            {piece.name}
                          </p>
                          <p className="mt-1 font-mono text-[9px] tracking-[0.12em] text-black/45">
                            {categoryLabels[piece.category] ?? piece.category}
                          </p>
                        </div>
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/20 transition-all group-hover:border-black group-hover:bg-black group-hover:text-white">
                        <ArrowUpRight size={14} />
                      </span>
                    </button>
                  ))}
                </div>

                {selectedPiece ? (
                  <div className="mb-6 border-l-2 border-[#FF4A1C] pl-4">
                    <p className="font-mono text-[9px] tracking-[0.15em] text-black/45">
                      SELECTED PIECE
                    </p>
                    <p className="mt-2 text-sm">{selectedPiece.name}</p>
                    <Link
                      href={`/shop/${selectedPiece.id}`}
                      className="mt-3 inline-flex items-center gap-2 text-xs underline underline-offset-4"
                    >
                      View this piece
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <p className="mb-6 font-serif text-sm italic text-black/45">
                    Select a piece to see where it takes you.
                  </p>
                )}

                <button
                  onClick={() => setShopPanelOpen(true)}
                  className="group flex w-full items-center justify-between bg-[#111111] px-5 py-4 text-left text-[#EFEBE4] transition-colors hover:bg-[#FF4A1C] hover:text-[#111111]"
                >
                  <span className="flex items-center gap-3 text-sm">
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Shop this outfit
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>
              </div>

              {/* LOOK SELECTOR */}
              <div className="border-t border-black/15 p-6 sm:p-8 lg:p-9">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[9px] tracking-[0.15em] text-black/50">
                    CHANGE THE LOOK
                  </span>
                  <span className="font-mono text-[9px] text-black/40">
                    SELECT A STUDY
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {looks.map((look, index) => {
                    const previewPiece = getPiece(look.pieceIds[0]);

                    return (
                      <button
                        key={look.id}
                        onClick={() => changeLook(index)}
                        aria-label={`Show look ${look.number}: ${look.title}`}
                        aria-pressed={activeLookIndex === index}
                        className={`group relative aspect-square overflow-hidden border transition-all ${
                          activeLookIndex === index
                            ? "border-black bg-[#E5DFD5] p-1"
                            : "border-transparent bg-[#E5DFD5] opacity-55 hover:opacity-100"
                        }`}
                      >
                        {previewPiece && (
                          <img
                            src={previewPiece.image}
                            alt=""
                            className="h-full w-full object-contain"
                          />
                        )}
                        <span className="absolute bottom-1 right-1 bg-[#EFEBE4] px-1.5 py-1 font-mono text-[8px] text-black">
                          {look.number}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <button
                    onClick={previousLook}
                    className="flex items-center gap-2 text-[11px] text-black/60 transition-colors hover:text-black sm:hidden"
                  >
                    <ArrowLeft size={14} />
                    Previous
                  </button>

                  <span className="font-mono text-[9px] tracking-[0.1em] text-black/40">
                    {activeLook.day}
                  </span>

                  <button
                    onClick={nextLook}
                    className="flex items-center gap-2 text-[11px] text-black/60 transition-colors hover:text-black"
                  >
                    Next look
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL STATEMENT */}
      <section className="relative border-y border-black/15 bg-[#E5DFD5] px-5 py-24 sm:px-10 sm:py-32 lg:py-40">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid gap-12 lg:grid-cols-[0.35fr_1fr]">
            <div>
              <span className="font-mono text-[10px] tracking-[0.16em] text-black/45">
                A SMALL OBSERVATION
              </span>
            </div>

            <div>
              <h2 className="max-w-[1000px] text-[clamp(2.7rem,6.5vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.075em]">
                Most days look a little like each other.
                <span className="font-serif font-normal italic">
                  {" "}
                  That&apos;s fine.
                </span>
              </h2>

              <div className="mt-10 flex flex-col justify-between gap-8 border-t border-black/15 pt-6 sm:flex-row sm:items-end">
                <p className="max-w-[360px] text-sm leading-[1.8] text-black/60">
                  You don&apos;t need a new outfit for every occasion. You need
                  a few things that make sense together.
                </p>

                <Link
                  href="/build"
                  className="group inline-flex items-center gap-4 self-start border-b border-black pb-2 text-sm transition-colors hover:border-[#FF4A1C] sm:self-auto"
                >
                  Build your own combination
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute bottom-8 right-[8%] hidden rotate-[-8deg] font-serif text-xl italic text-[#FF4A1C] lg:block">
          Monday looks like Wednesday.
        </span>
      </section>

      {/* DETAIL STORIES */}
      <section className="px-5 py-20 sm:px-8 sm:py-28 lg:px-14">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 font-mono text-[10px] tracking-[0.16em] text-black/45">
                THE SMALL THINGS
              </p>
              <h2 className="text-5xl font-medium tracking-[-0.07em] sm:text-7xl">
                Look a little closer.
              </h2>
            </div>

            <p className="max-w-[260px] text-sm leading-[1.7] text-black/55">
              The whole point is in the pieces. Not much else needs saying.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {details.map((detail, index) => {
              const piece = getPiece(detail.pieceId);

              if (!piece) return null;

              return (
                <article
                  key={detail.number}
                  className={index === 1 ? "md:mt-16" : ""}
                >
                  <Link
                    href={`/shop/${piece.id}`}
                    className="group block"
                  >
                    <div
                      className={`relative flex items-center justify-center overflow-hidden bg-[#DDD5C9] p-8 ${detail.className}`}
                    >
                      <img
                        src={piece.image}
                        alt={piece.name}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-[1.045]"
                      />

                      <span className="absolute left-4 top-4 bg-[#EFEBE4] px-2.5 py-1.5 font-mono text-[9px] tracking-[0.12em]">
                        DETAIL / {detail.number}
                      </span>

                      <span className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#EFEBE4] opacity-0 transition-all group-hover:opacity-100">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4 border-b border-black/20 py-5">
                      <div>
                        <h3 className="text-xl tracking-[-0.04em]">
                          {detail.title}
                        </h3>
                        <p className="mt-1 text-xs text-black/50">
                          {detail.description}
                        </p>
                        <p className="mt-3 font-mono text-[9px] tracking-[0.12em] text-black/45">
                          {piece.name.toUpperCase()}
                        </p>
                      </div>
                      <span className="font-mono text-[10px] text-black/40">
                        0{index + 1}
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ENDING */}
      <section className="relative overflow-hidden bg-[#111111] px-5 py-24 text-[#EFEBE4] sm:px-10 sm:py-32 lg:py-40">
        <div className="relative z-10 mx-auto max-w-[1400px]">
          <p className="mb-8 font-mono text-[10px] tracking-[0.18em] text-white/45">
            THAT&apos;S THE WHOLE IDEA
          </p>

          <h2 className="max-w-[1100px] text-[clamp(4rem,12vw,11rem)] font-medium leading-[0.82] tracking-[-0.095em]">
            Wear it.
            <br />
            <span className="font-serif font-normal italic">Repeat.</span>
          </h2>

          <div className="mt-14 flex flex-col justify-between gap-10 border-t border-white/20 pt-6 sm:flex-row sm:items-end">
            <p className="max-w-[300px] text-sm leading-[1.8] text-white/55">
              A small range of everyday pieces. Made to work together.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center gap-4 bg-[#EFEBE4] px-6 py-4 text-sm text-[#111111] transition-colors hover:bg-[#FF4A1C]"
              >
                Shop the pieces
                <ArrowUpRight size={16} />
              </Link>

              <Link
                href="/build"
                className="inline-flex items-center gap-4 border border-white/35 px-6 py-4 text-sm transition-colors hover:border-white hover:bg-white hover:text-black"
              >
                Build a uniform
                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <span className="pointer-events-none absolute -bottom-16 right-[-3%] select-none font-black leading-none tracking-[-0.12em] text-white/[0.035] text-[35vw]">
          LVRY
        </span>
      </section>

      {/* SHOP THIS OUTFIT DRAWER */}
      {shopPanelOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Shop this outfit"
        >
          <button
            onClick={() => setShopPanelOpen(false)}
            className="absolute inset-0 cursor-default bg-black/45 backdrop-blur-[2px]"
            aria-label="Close outfit panel"
          />

          <aside className="relative z-10 flex h-full w-full max-w-[480px] flex-col bg-[#EFEBE4] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/15 px-6 py-5">
              <div>
                <p className="font-mono text-[9px] tracking-[0.16em] text-black/45">
                  LVRY / LOOKBOOK
                </p>
                <h2 className="mt-1 text-xl tracking-[-0.04em]">
                  Shop this outfit.
                </h2>
              </div>

              <button
                onClick={() => setShopPanelOpen(false)}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-black/20 transition-colors hover:bg-black hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div
                className="relative mb-8 grid aspect-[5/4] grid-cols-2 items-center gap-2 overflow-hidden p-5"
                style={{ backgroundColor: activeLook.background }}
              >
                {activePieces.map((piece) => (
                  <img
                    key={piece.id}
                    src={piece.image}
                    alt={piece.name}
                    className="h-full w-full object-contain"
                  />
                ))}

                <span className="absolute bottom-3 left-3 bg-[#EFEBE4] px-3 py-2 font-mono text-[9px] tracking-[0.12em]">
                  LOOK {activeLook.number} / {activeLook.day}
                </span>
              </div>

              <div className="mb-5 flex items-end justify-between">
                <div>
                  <h3 className="text-3xl tracking-[-0.06em]">
                    {activeLook.title}
                  </h3>
                  <p className="mt-1 text-xs text-black/50">
                    {activePieces.length} pieces in this combination
                  </p>
                </div>
                <span className="font-mono text-[10px] text-black/40">
                  {activeLook.number} / 04
                </span>
              </div>

              <div className="border-t border-black/15">
                {activePieces.map((piece) => (
                  <div
                    key={piece.id}
                    className="flex items-center justify-between gap-4 border-b border-black/15 py-5"
                  >
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.12em] text-black/40">
                        {categoryLabels[piece.category] ?? piece.category}
                      </p>
                      <p className="mt-1 text-[15px]">{piece.name}</p>
                    </div>

                    <Link
                      href={`/shop/${piece.id}`}
                      onClick={() => setShopPanelOpen(false)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 transition-colors hover:bg-black hover:text-white"
                      aria-label={`View ${piece.name}`}
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/15 p-6">
              <Link
                href="/shop"
                onClick={() => setShopPanelOpen(false)}
                className="flex w-full items-center justify-between bg-[#111111] px-5 py-4 text-sm text-[#EFEBE4] transition-colors hover:bg-[#FF4A1C] hover:text-[#111111]"
              >
                View the full collection
                <ArrowUpRight size={17} />
              </Link>

              <p className="mt-3 text-center font-mono text-[9px] tracking-[0.1em] text-black/40">
                NO RUSH. TAKE A LOOK AROUND.
              </p>
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}