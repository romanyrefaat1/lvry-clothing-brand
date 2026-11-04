"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useClothes } from "@/contexts/clothes-context";

/* ─────────────────────────────────────────
   SHARED DECORATIVE ELEMENTS
   ───────────────────────────────────────── */

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] text-denim">{number}</span>
      <span className="h-px w-7 bg-border" />
      <span className="eyebrow text-muted">{children}</span>
    </div>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? "↗" : "→"}</span>;
}

function formatCategory(category: string) {
  return category.replaceAll("-", " ");
}

/* ─────────────────────────────────────────
   01 — THE PIECES
   ───────────────────────────────────────── */

export function CollectionSection() {
  const { pieces } = useClothes();

  const featuredPieces = pieces.slice(0, 4);

  return (
    <section className="py-24 md:py-32">
      <div className="lvry-container">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel number="01">THE COLLECTION</SectionLabel>

            <h2 className="display-heading mt-6 text-5xl md:text-7xl">
              The pieces<span className="text-signal">.</span>
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              Tops, layers and bottoms. Each with a place in the uniform.
            </p>
          </div>

          <Link href="/shop" className="text-link">
            View all pieces <Arrow diagonal />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPieces.map((piece, index) => (
            <Link
              key={piece.id}
              href={`/shop/${piece.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <span className="absolute left-4 top-4 z-10 font-mono text-[10px] text-muted">
                  LVRY / {String(index + 1).padStart(3, "0")}
                </span>

                <div className="absolute inset-0 p-8 transition-transform duration-500 group-hover:scale-[1.04]">
                  <Image
                    src={piece.image}
                    alt={piece.name}
                    fill
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                    className="object-contain p-8"
                  />
                </div>

                <span className="absolute bottom-4 left-4 translate-y-2 bg-ink px-3 py-2 text-[10px] text-bone opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View details <Arrow diagonal />
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium">{piece.name}</h3>

                <span className="eyebrow shrink-0 text-muted">
                  {formatCategory(piece.category)}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {featuredPieces.length === 0 && (
          <p className="py-12 text-sm text-muted">
            The collection is currently empty.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   02 — BUILDER PREVIEW
   ───────────────────────────────────────── */

const builderSlots = [
  { key: "top", label: "Top", categories: ["top"] },
  { key: "layer", label: "Layer", categories: ["layer", "outerwear"] },
  { key: "bottom", label: "Bottom", categories: ["bottom"] },
] as const;

type BuilderSlot = (typeof builderSlots)[number]["key"];

type BuilderSelection = Record<BuilderSlot, string | null>;

export function BuilderPreview() {
  const { pieces, getPiece } = useClothes();

  const [outfit, setOutfit] = useState<BuilderSelection>(() => ({
    top: pieces.find((piece) => piece.category === "top")?.id ?? null,
    layer:
      pieces.find(
        (piece) =>
          piece.category === "layer" || piece.category === "outerwear",
      )?.id ?? null,
    bottom: pieces.find((piece) => piece.category === "bottom")?.id ?? null,
  }));

  const [activeSlot, setActiveSlot] = useState<BuilderSlot>("top");

  function cyclePiece(slot: BuilderSlot) {
    const slotConfig = builderSlots.find((item) => item.key === slot);

    if (!slotConfig) return;

    const options = pieces.filter((piece) =>
      slotConfig.categories.some((category) => piece.category === category),
    );

    if (options.length === 0) return;

    const currentIndex = options.findIndex(
      (piece) => piece.id === outfit[slot],
    );

    const nextIndex = (currentIndex + 1) % options.length;

    setOutfit((current) => ({
      ...current,
      [slot]: options[nextIndex].id,
    }));
  }

  function resetOutfit() {
    setOutfit({
      top: pieces.find((piece) => piece.category === "top")?.id ?? null,
      layer:
        pieces.find(
          (piece) =>
            piece.category === "layer" || piece.category === "outerwear",
        )?.id ?? null,
      bottom: pieces.find((piece) => piece.category === "bottom")?.id ?? null,
    });

    setActiveSlot("top");
  }

  const selectedPieces = {
    top: outfit.top ? getPiece(outfit.top) : undefined,
    layer: outfit.layer ? getPiece(outfit.layer) : undefined,
    bottom: outfit.bottom ? getPiece(outfit.bottom) : undefined,
  };

  return (
    <section className="overflow-hidden bg-ink py-24 text-bone md:py-32">
      <div className="lvry-container">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <SectionLabel number="02">THE UNIFORM BUILDER</SectionLabel>

            <h2 className="display-heading mt-7 text-5xl md:text-7xl">
              Assemble
              <br />
              your
              <br />
              uniform<span className="text-signal">.</span>
            </h2>

            <p className="mt-7 max-w-sm text-sm leading-7 text-bone/65">
              Pick a top. Add a layer. Choose your trousers. Move things around
              until they make sense.
            </p>

            <p className="handwritten mt-7 -rotate-3 text-3xl text-signal">
              No fashion degree required.
            </p>

            <Link
              href="/build"
              className="mt-10 inline-flex min-h-12 items-center gap-8 bg-bone px-5 text-sm text-ink transition-colors hover:bg-signal"
            >
              Build a uniform <Arrow diagonal />
            </Link>
          </div>

          <div className="relative">
            <div className="absolute -right-3 -top-5 z-10 rotate-3 bg-signal px-4 py-3 font-mono text-[10px] uppercase leading-4 text-ink shadow-paper">
              Your uniform
              <br />
              / 001
            </div>

            <div className="paper-texture relative min-h-[440px] p-5 text-ink md:min-h-[500px] md:p-8">
              <div className="flex items-center justify-between border-b border-ink/15 pb-4">
                <span className="eyebrow">THE CANVAS</span>
                <span className="font-mono text-[9px] text-muted">
                  INTERACTIVE PREVIEW
                </span>
              </div>

              <div className="grid min-h-[290px] grid-cols-[1fr_0.8fr] items-center gap-4 py-6 md:min-h-[340px]">
                <div className="flex min-w-0 flex-col items-center justify-center">
                  {builderSlots.map((slot, index) => {
                    const piece = selectedPieces[slot.key];

                    return (
                      <div
                        key={slot.key}
                        className={`relative w-full max-w-[210px] border border-ink/10 bg-[#F7F4EF] p-3 shadow-paper ${
                          index === 0
                            ? "z-30 -rotate-3"
                            : index === 1
                              ? "z-20 -mt-5 rotate-2"
                              : "z-10 -mt-5 -rotate-2"
                        }`}
                      >
                        <div className="relative aspect-square">
                          {piece ? (
                            <Image
                              src={piece.image}
                              alt={piece.name}
                              fill
                              sizes="210px"
                              className="object-contain"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-center font-mono text-[10px] uppercase text-muted">
                              No {slot.label.toLowerCase()} available
                            </div>
                          )}
                        </div>

                        <span className="block truncate pt-2 text-center font-mono text-[9px] uppercase">
                          {piece?.name ?? `No ${slot.label}`}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex min-w-0 flex-col gap-3">
                  <span className="eyebrow mb-1 text-muted">
                    CHANGE A PIECE
                  </span>

                  {builderSlots.map((slot) => {
                    const piece = selectedPieces[slot.key];

                    return (
                      <button
                        key={slot.key}
                        type="button"
                        onClick={() => {
                          setActiveSlot(slot.key);
                          cyclePiece(slot.key);
                        }}
                        className={`border p-3 text-left transition-colors ${
                          activeSlot === slot.key
                            ? "border-signal bg-signal/10"
                            : "border-ink/15 hover:border-ink/50"
                        }`}
                      >
                        <span className="block font-mono text-[9px] uppercase text-muted">
                          {slot.label}
                        </span>

                        <span className="mt-1 block truncate text-xs font-medium">
                          {piece?.name ?? "No piece available"}
                        </span>

                        <span className="mt-2 block text-[10px] text-muted">
                          Change <Arrow />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-ink/15 pt-4">
                <span className="font-mono text-[9px] uppercase text-muted">
                  {builderSlots.find((slot) => slot.key === activeSlot)?.label}{" "}
                  selected
                </span>

                <button
                  type="button"
                  onClick={resetOutfit}
                  className="text-xs underline underline-offset-4 hover:text-denim"
                >
                  Reset canvas
                </button>
              </div>
            </div>

            <p className="mt-4 text-right font-mono text-[9px] uppercase tracking-wider text-bone/40">
              A small preview of a larger idea.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   03 — EDITORIAL
   ───────────────────────────────────────── */

export function EditorialSection() {
  const { pieces } = useClothes();

  const tops = pieces.filter((piece) => piece.category === "top");
  const layers = pieces.filter(
    (piece) => piece.category === "layer" || piece.category === "outerwear",
  );
  const bottoms = pieces.filter((piece) => piece.category === "bottom");

  const looks = tops.slice(0, 3).map((top, index) => {
  const lookPieces = [
    top,
    bottoms.length ? bottoms[index % bottoms.length] : undefined,
    layers.length ? layers[index % layers.length] : undefined,
  ].filter((piece): piece is (typeof pieces)[number] => piece !== undefined);

  return {
    number: String(index + 1).padStart(2, "0"),
    title: ["The usual", "One more layer", "A different starting point"][index],
    note: ["Monday, probably.", "A little colder.", "Later in the day."][index],
    pieces: lookPieces,
  };
});

  return (
    <section className="py-24 md:py-32">
      <div className="lvry-container">
        <div className="mb-14 grid gap-8 md:grid-cols-[1fr_0.7fr] md:items-end">
          <div>
            <SectionLabel number="03">A FEW WAYS TO WEAR IT</SectionLabel>

            <h2 className="display-heading mt-7 text-5xl md:text-7xl">
              One uniform.
              <br />
              Many days<span className="text-signal">.</span>
            </h2>
          </div>

          <div className="md:pb-2">
            <p className="max-w-sm text-sm leading-7 text-muted">
              You probably have a few clothes you reach for more than the
              others. We think that's worth building around.
            </p>

            <Link href="/lookbook" className="text-link mt-6">
              See the lookbook <Arrow diagonal />
            </Link>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {looks.map((look) => (
            <Link
              href="/lookbook"
              key={look.number}
              className="group block"
            >
              <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-surface p-8">
                <span className="absolute left-5 top-5 font-mono text-[10px] text-ink/60">
                  LVRY / LOOK {look.number}
                </span>

                <div className="flex h-full w-full flex-col items-center justify-center">
                  {look.pieces.map((piece, index) => (
                    <div
                      key={piece.id}
                      className={`relative h-[38%] w-[80%] ${
                        index === 0
                          ? "z-30 -rotate-3"
                          : index === 1
                            ? "z-20 -mt-6 rotate-2"
                            : "z-10 -mt-6 -rotate-2"
                      }`}
                    >
                      <Image
                        src={piece.image}
                        alt={piece.name}
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>

                <span className="handwritten absolute bottom-5 right-5 rotate-[-8deg] text-2xl text-ink">
                  {look.note}
                </span>

                <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5" />
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] text-denim">
                    {look.number} / THE LOOK
                  </span>

                  <h3 className="mt-2 font-display text-2xl tracking-tight">
                    {look.title}
                  </h3>

                  <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
                    {look.pieces.map((piece) => piece.name).join(" / ")}
                  </p>
                </div>

                <span className="mt-6 transition-transform group-hover:translate-x-1">
                  <Arrow diagonal />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {looks.length === 0 && (
          <p className="py-12 text-sm text-muted">
            Looks will appear here once the collection has enough pieces.
          </p>
        )}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   04 — PHILOSOPHY
   ───────────────────────────────────────── */

const principles = [
  {
    number: "01",
    title: "Repeatable",
    description: "Clothes for ordinary days. The ones that happen most often.",
  },
  {
    number: "02",
    title: "Considered",
    description: "A small range where every piece has a reason to exist.",
  },
  {
    number: "03",
    title: "Plain-spoken",
    description:
      "Fit, fabric, measurements and care. The useful information comes first.",
  },
];

export function PhilosophySection() {
  return (
    <section className="bg-[#E5DFD5] py-24 md:py-32">
      <div className="lvry-container">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel number="04">A NOTE ON THE IDEA</SectionLabel>

            <h2 className="display-heading mt-7 max-w-xl text-5xl md:text-7xl">
              Less to
              <br />
              think about<span className="text-signal">.</span>
            </h2>

            <div className="mt-8 max-w-md space-y-5 text-sm leading-7 text-ink/70">
              <p>Most wardrobes have enough clothes.</p>
              <p>
                What they could use is a little more thought about which ones
                belong there.
              </p>
              <p>
                LVRY is a small collection of everyday pieces. Made to work
                together. Described without the usual sales pitch.
              </p>
            </div>

            <Link href="/about" className="text-link mt-8">
              More about LVRY <Arrow diagonal />
            </Link>
          </div>

          <div className="border-t border-ink/20">
            {principles.map((principle) => (
              <div
                key={principle.number}
                className="grid grid-cols-[45px_1fr] gap-4 border-b border-ink/20 py-7 md:grid-cols-[65px_1fr]"
              >
                <span className="pt-2 font-mono text-[10px] text-denim">
                  {principle.number}
                </span>

                <div>
                  <h3 className="font-display text-3xl tracking-tight md:text-4xl">
                    {principle.title}
                  </h3>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}

            <div className="relative mt-8 rotate-2 border border-ink/15 bg-bone p-6 shadow-paper">
              <span className="eyebrow text-muted">THE SHORT VERSION</span>

              <p className="display-heading mt-4 text-3xl md:text-4xl">
                A few pieces.
                <br />
                Your own combination.
              </p>

              <span className="handwritten absolute -bottom-5 right-5 -rotate-6 text-2xl text-denim">
                That's the idea.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   05 — NEWSLETTER
   ───────────────────────────────────────── */

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("That doesn't look like an email address.");
      return;
    }

    // Demo only. No subscription is created or stored.
    setSubmitted(true);
  }

  return (
    <section className="relative overflow-hidden bg-denim py-24 text-bone md:py-28">
      <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border border-bone/10" />
      <div className="pointer-events-none absolute -right-8 -top-12 h-56 w-56 rounded-full border border-bone/10" />

      <div className="lvry-container relative grid gap-12 md:grid-cols-[1fr_0.8fr] md:items-end">
        <div>
          <SectionLabel number="05">OCCASIONAL CORRESPONDENCE</SectionLabel>

          <h2 className="display-heading mt-7 text-5xl md:text-7xl">
            The occasional
            <br />
            note<span className="text-signal">.</span>
          </h2>

          <p className="mt-6 max-w-sm text-sm leading-7 text-bone/70">
            New pieces, useful updates and things worth sharing. No daily
            emails. We have other things to do.
          </p>
        </div>

        <div>
          {submitted ? (
            <div className="border-t border-bone/30 py-6">
              <span className="eyebrow text-signal">FORM DEMONSTRATION</span>

              <h3 className="mt-4 font-display text-3xl">
                You're on the list.
              </h3>

              <p className="mt-3 text-sm text-bone/65">
                This is a demo. No subscription was created.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="mt-6 text-xs underline underline-offset-4"
              >
                Try again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <label
                htmlFor="newsletter-email"
                className="eyebrow mb-3 block text-bone/60"
              >
                Email address
              </label>

              <div className="flex border-b border-bone/50">
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm text-bone outline-none placeholder:text-bone/40 focus-visible:outline-none"
                />

                <button
                  type="submit"
                  aria-label="Sign up for the newsletter"
                  className="px-3 text-xl text-signal transition-transform hover:translate-x-1"
                >
                  <Arrow />
                </button>
              </div>

              {error && (
                <p role="alert" className="mt-3 text-xs text-[#FFD1C5]">
                  {error}
                </p>
              )}

              <p className="mt-4 text-[10px] leading-5 text-bone/50">
                Demo form. No email address is stored or submitted.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}