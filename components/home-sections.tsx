"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

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
      <span className="font-mono text-[10px] text-signal">{number}</span>
      <span className="h-px w-7 bg-border" />
      <span className="eyebrow text-muted">{children}</span>
    </div>
  );
}

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <span aria-hidden="true" className="inline-block">
      {diagonal ? "↗" : "→"}
    </span>
  );
}

/* ─────────────────────────────────────────
   PRODUCT VISUALS
   Temporary illustrations until product
   photography is available.
   ───────────────────────────────────────── */

type ProductKind = "tee" | "overshirt" | "trousers" | "jacket";

function ProductIllustration({
  kind,
  color,
}: {
  kind: ProductKind;
  color: string;
}) {
  if (kind === "trousers") {
    return (
      <svg viewBox="0 0 240 280" className="h-full w-full" aria-hidden="true">
        <path
          d="M65 28H175L181 112L164 258H119L112 126L103 258H58L48 112L65 28Z"
          fill={color}
          stroke="#111"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d="M65 28H175L170 67H70L65 28Z" fill="#111" opacity=".08" />
        <path d="M120 30V126" stroke="#111" strokeWidth="1.5" opacity=".5" />
        <path d="M71 68H169" stroke="#111" strokeWidth="1.5" opacity=".5" />
        <path d="M80 76L84 108" stroke="#111" strokeWidth="1" opacity=".35" />
        <path d="M160 76L156 108" stroke="#111" strokeWidth="1" opacity=".35" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 280" className="h-full w-full" aria-hidden="true">
      <path
        d="M83 37L119 22H161L197 37L252 83L222 137L195 118V253H85V118L58 137L28 83L83 37Z"
        fill={color}
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {kind !== "tee" && (
        <>
          <path
            d="M119 22L140 57L161 22"
            stroke="#111"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M140 57V253"
            stroke="#111"
            strokeWidth="1.5"
            opacity=".5"
          />
        </>
      )}

      {kind === "overshirt" && (
        <>
          <path d="M91 133H125V171H91V133Z" stroke="#111" strokeWidth="1.3" />
          <path d="M155 133H189V171H155V133Z" stroke="#111" strokeWidth="1.3" />
          <circle cx="145" cy="88" r="2" fill="#111" />
          <circle cx="145" cy="112" r="2" fill="#111" />
          <circle cx="145" cy="136" r="2" fill="#111" />
        </>
      )}

      {kind === "jacket" && (
        <>
          <path d="M140 57V253" stroke="#111" strokeWidth="2" />
          <path d="M88 180H122V218H88V180Z" stroke="#111" strokeWidth="1.5" />
          <path d="M158 180H192V218H158V180Z" stroke="#111" strokeWidth="1.5" />
          <path d="M126 22L140 57L154 22" stroke="#111" strokeWidth="1.5" />
        </>
      )}

      {kind === "tee" && (
        <path
          d="M119 22C120 42 160 42 161 22"
          stroke="#111"
          strokeWidth="2"
          fill="none"
        />
      )}
    </svg>
  );
}

/* ─────────────────────────────────────────
   02 — THE PIECES
   ───────────────────────────────────────── */

const products: {
  name: string;
  description: string;
  category: string;
  kind: ProductKind;
  color: string;
  colorName: string;
  number: string;
  slug: string;
}[] = [
  {
    name: "Relaxed tee",
    description: "The usual starting point.",
    category: "Tops",
    kind: "tee",
    color: "#E8E2D8",
    colorName: "Bone",
    number: "001",
    slug: "relaxed-tee",
  },
  {
    name: "Overshirt",
    description: "For when a tee isn't enough.",
    category: "Layers",
    kind: "overshirt",
    color: "#3E5C8A",
    colorName: "Denim",
    number: "002",
    slug: "overshirt",
  },
  {
    name: "Straight trousers",
    description: "Goes with most things.",
    category: "Bottoms",
    kind: "trousers",
    color: "#C9B79C",
    colorName: "Canvas",
    number: "003",
    slug: "straight-trousers",
  },
  {
    name: "Everyday jacket",
    description: "An extra layer. Nothing complicated.",
    category: "Outerwear",
    kind: "jacket",
    color: "#252525",
    colorName: "Ink",
    number: "004",
    slug: "everyday-jacket",
  },
];

export function CollectionSection() {
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
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/shop/${product.slug}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-surface">
                <span className="absolute left-4 top-4 z-10 font-mono text-[10px] text-muted">
                  LVRY / {product.number}
                </span>

                <div className="absolute inset-0 flex items-center justify-center p-8 transition-transform duration-500 group-hover:scale-[1.06]">
                  <ProductIllustration
                    kind={product.kind}
                    color={product.color}
                  />
                </div>

                <span className="absolute bottom-4 right-4 font-mono text-[9px] uppercase tracking-wider text-muted">
                  {product.colorName}
                </span>

                <span className="absolute bottom-4 left-4 translate-y-2 bg-ink px-3 py-2 text-[10px] text-bone opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  View details <Arrow diagonal />
                </span>
              </div>

              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {product.description}
                  </p>
                </div>
                <span className="eyebrow text-muted">{product.category}</span>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 border-t border-border pt-4 font-mono text-[10px] text-muted">
          PRODUCT ILLUSTRATIONS / DEMO CONTENT
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   03 — BUILDER PREVIEW
   ───────────────────────────────────────── */

const outfitOptions = {
  Top: ["Relaxed tee", "Long sleeve tee", "Everyday shirt"],
  Layer: ["Overshirt", "Knit layer", "No layer"],
  Bottom: ["Straight trousers", "Relaxed trousers", "Shorts"],
};

type OutfitSlot = keyof typeof outfitOptions;

export function BuilderPreview() {
  const [outfit, setOutfit] = useState<Record<OutfitSlot, string>>({
    Top: "Relaxed tee",
    Layer: "Overshirt",
    Bottom: "Straight trousers",
  });

  const [activeSlot, setActiveSlot] = useState<OutfitSlot>("Top");

  const slots: OutfitSlot[] = ["Top", "Layer", "Bottom"];

  function cyclePiece(slot: OutfitSlot) {
    const options = outfitOptions[slot];
    const currentIndex = options.indexOf(outfit[slot]);
    const next = options[(currentIndex + 1) % options.length];

    setOutfit((current) => ({ ...current, [slot]: next }));
  }

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
                <div className="relative flex h-full flex-col items-center justify-center">
                  <div className="relative z-20 w-[78%] max-w-[210px] -rotate-3 border border-ink/10 bg-[#F7F4EF] p-3 shadow-paper">
                    <div className="aspect-[4/4]">
                      <ProductIllustration
                        kind="tee"
                        color="#E8E2D8"
                      />
                    </div>
                    <span className="block pt-2 text-center font-mono text-[9px] uppercase">
                      {outfit.Top}
                    </span>
                  </div>

                  <div className="relative z-10 -mt-5 w-[72%] max-w-[190px] rotate-2 border border-ink/10 bg-[#F7F4EF] p-3 shadow-paper">
                    <div className="aspect-[4/3]">
                      <ProductIllustration
                        kind="overshirt"
                        color="#3E5C8A"
                      />
                    </div>
                    <span className="block pt-2 text-center font-mono text-[9px] uppercase">
                      {outfit.Layer}
                    </span>
                  </div>

                  <div className="relative z-0 -mt-5 w-[65%] max-w-[170px] -rotate-2 border border-ink/10 bg-[#F7F4EF] p-3 shadow-paper">
                    <div className="aspect-[4/3]">
                      <ProductIllustration
                        kind="trousers"
                        color="#C9B79C"
                      />
                    </div>
                    <span className="block pt-2 text-center font-mono text-[9px] uppercase">
                      {outfit.Bottom}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <span className="eyebrow mb-1 text-muted">
                    CHANGE A PIECE
                  </span>

                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => {
                        setActiveSlot(slot);
                        cyclePiece(slot);
                      }}
                      className={`border p-3 text-left transition-colors ${
                        activeSlot === slot
                          ? "border-signal bg-signal/10"
                          : "border-ink/15 hover:border-ink/50"
                      }`}
                    >
                      <span className="block font-mono text-[9px] uppercase text-muted">
                        {slot}
                      </span>
                      <span className="mt-1 block text-xs font-medium">
                        {outfit[slot]}
                      </span>
                      <span className="mt-2 block text-[10px] text-muted">
                        Change <Arrow />
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-ink/15 pt-4">
                <span className="font-mono text-[9px] uppercase text-muted">
                  {activeSlot} selected
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setOutfit({
                      Top: "Relaxed tee",
                      Layer: "Overshirt",
                      Bottom: "Straight trousers",
                    })
                  }
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
   04 — EDITORIAL
   ───────────────────────────────────────── */

const editorialLooks = [
  {
    number: "01",
    title: "The usual",
    description: "A tee and a pair of trousers. You probably know this one.",
    background: "#D8D0C3",
    shirt: "#EDE9E1",
    trousers: "#3E5C8A",
    note: "Monday, probably.",
  },
  {
    number: "02",
    title: "One more layer",
    description: "The overshirt goes on. Not much else changes.",
    background: "#C9B79C",
    shirt: "#3E5C8A",
    trousers: "#252525",
    note: "A little colder.",
  },
  {
    number: "03",
    title: "A little more coverage",
    description: "Same starting point. An extra layer for the way back.",
    background: "#D9DDE2",
    shirt: "#252525",
    trousers: "#C9B79C",
    note: "Later in the day.",
  },
];

function EditorialIllustration({
  look,
}: {
  look: (typeof editorialLooks)[number];
}) {
  return (
    <div
      className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
      style={{ backgroundColor: look.background }}
    >
      <div className="absolute left-5 top-5 font-mono text-[10px] text-ink/60">
        LVRY / LOOK {look.number}
      </div>

      <div className="relative flex h-[70%] w-[65%] flex-col items-center justify-center">
        <div
          className="relative z-20 h-[55%] w-[75%] -rotate-3"
          style={{
            backgroundColor: look.shirt,
            clipPath:
              "polygon(25% 0, 42% 7%, 58% 7%, 75% 0, 100% 25%, 84% 43%, 75% 34%, 75% 100%, 25% 100%, 25% 34%, 16% 43%, 0 25%)",
          }}
        />
        <div className="relative -mt-2 flex h-[50%] w-[62%] justify-center gap-1">
          <div
            className="h-full w-1/2 -rotate-2"
            style={{
              backgroundColor: look.trousers,
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 8% 100%)",
            }}
          />
          <div
            className="h-full w-1/2 rotate-2"
            style={{
              backgroundColor: look.trousers,
              clipPath: "polygon(0 0, 100% 0, 92% 100%, 10% 100%)",
            }}
          />
        </div>
      </div>

      <span className="handwritten absolute bottom-5 right-5 rotate-[-8deg] text-2xl text-ink">
        {look.note}
      </span>
    </div>
  );
}

export function EditorialSection() {
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
          {editorialLooks.map((look) => (
            <Link
              href="/lookbook"
              key={look.number}
              className="group block"
            >
              <div className="relative overflow-hidden">
                <EditorialIllustration look={look} />
                <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/5" />
              </div>

              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] text-signal">
                    {look.number} / THE LOOK
                  </span>
                  <h3 className="mt-2 font-display text-2xl tracking-tight">
                    {look.title}
                  </h3>
                  <p className="mt-2 max-w-xs text-xs leading-5 text-muted">
                    {look.description}
                  </p>
                </div>
                <span className="mt-6 transition-transform group-hover:translate-x-1">
                  <Arrow diagonal />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   05 — PHILOSOPHY
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
    description: "Fit, fabric, measurements and care. The useful information comes first.",
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
                <span className="pt-2 font-mono text-[10px] text-signal">
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
   06 — NEWSLETTER
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

    // Demo only. Connect a mailing-list service before collecting real emails.
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