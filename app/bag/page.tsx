
"use client";

import Image from "next/image";
import Link from "next/link";

import { useBag } from "@/contexts/bag-context";
import { useClothes } from "@/contexts/clothes-context";

import type { ClothingPiece } from "@/contexts/clothes-context";

function BagItemVisual({
  piece,
}: {
  piece: ClothingPiece;
}) {
  return (
    <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-surface">
      {piece.image ? (
        <Image
          src={piece.image}
          alt={piece.name}
          fill
          sizes="(max-width: 640px) 104px, 140px"
          className="object-contain p-3 transition-transform duration-500 hover:scale-105"
        />
      ) : (
        <div className="flex flex-col items-center gap-2 text-muted">
          <span className="font-mono text-2xl">
            LVRY
          </span>
          <span className="font-mono text-[9px] uppercase">
            No image
          </span>
        </div>
      )}
    </div>
  );
}

function EmptyBag() {
  return (
    <div className="flex min-h-[55vh] flex-col items-center justify-center px-6 text-center">
      <span className="font-mono text-[10px] uppercase text-signal">
        BAG / 000
      </span>

      <h2 className="display-heading mt-6 text-5xl md:text-6xl">
        Nothing here<span className="text-signal">.</span>
      </h2>

      <p className="mt-5 max-w-xs text-sm leading-6 text-muted">
        Your bag is empty. Nothing to carry yet.
        Have a look around.
      </p>

      <Link
        href="/shop"
        className="mt-8 flex min-h-12 items-center gap-8 bg-ink px-5 text-sm text-bone transition-colors hover:bg-signal hover:text-ink"
      >
        Browse the pieces
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function BagItemCard({
  item,
  collectionName,
  updateQuantity,
  removeItem,
}: {
  item: {
    product: ClothingPiece;
    quantity: number;
  };
  collectionName: string;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}) {
  const { product, quantity } = item;

  const productHref = `/shop/${product.id}`;

  const categoryName = product.category.replace(
    /-/g,
    " ",
  );

  return (
    <article
      className="grid grid-cols-[104px_1fr] gap-5 border-b border-border py-6 sm:grid-cols-[140px_1fr]"
    >
      <Link
        href={productHref}
        aria-label={`View ${product.name}`}
      >
        <BagItemVisual piece={product} />
      </Link>

      <div className="flex min-w-0 flex-col justify-between gap-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <span className="font-mono text-[9px] uppercase text-muted">
              LVRY / {collectionName}
            </span>

            <Link href={productHref}>
              <h2 className="mt-2 font-display text-xl tracking-tight transition-opacity hover:opacity-60 sm:text-2xl">
                {product.name}
              </h2>
            </Link>

            <p className="mt-2 text-xs capitalize text-muted">
              {categoryName}
            </p>
          </div>

          <button
            type="button"
            onClick={() => removeItem(product.id)}
            className="shrink-0 text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink"
            aria-label={`Remove ${product.name}`}
          >
            Remove
          </button>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div
            className="flex h-9 items-center border border-border"
            aria-label={`Quantity controls for ${product.name}`}
          >
            <button
              type="button"
              onClick={() =>
                updateQuantity(product.id, quantity - 1)
              }
              aria-label={`Decrease ${product.name} quantity`}
              className="h-full w-9 text-sm transition-colors hover:bg-ink hover:text-bone"
            >
              −
            </button>

            <span
              className="min-w-8 text-center font-mono text-xs"
              aria-live="polite"
              aria-label={`Quantity ${quantity}`}
            >
              {quantity}
            </span>

            <button
              type="button"
              onClick={() =>
                updateQuantity(product.id, quantity + 1)
              }
              aria-label={`Increase ${product.name} quantity`}
              className="h-full w-9 text-sm transition-colors hover:bg-ink hover:text-bone"
            >
              +
            </button>
          </div>

          <span className="font-mono text-[9px] uppercase text-muted">
            Price not set
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BagPage() {
  const {
    items,
    itemCount,
    updateQuantity,
    removeItem,
    clearBag,
    isReady,
  } = useBag();

  const { getCollection } = useClothes();

  if (!isReady) {
    return (
      <main className="lvry-container min-h-[60vh] py-20">
        <div className="h-3 w-20 animate-pulse bg-border" />
        <div className="mt-8 h-16 w-64 animate-pulse bg-border" />
        <div className="mt-12 h-32 w-full animate-pulse bg-surface" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bone">
      <div className="lvry-container pb-24 pt-12 md:pb-32 md:pt-20">

        {/* HEADER */}

        <div className="flex flex-col justify-between gap-6 border-b border-border pb-10 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-signal">
                06
              </span>

              <span className="h-px w-7 bg-border" />

              <span className="eyebrow text-muted">
                YOUR SELECTION
              </span>
            </div>

            <h1 className="display-heading mt-6 text-6xl md:text-8xl">
              The bag<span className="text-signal">.</span>
            </h1>

            <p className="mt-4 text-sm text-muted">
              {itemCount === 0
                ? "Currently holding absolutely nothing."
                : `${itemCount} ${itemCount === 1 ? "piece" : "pieces"} in your bag.`}
            </p>
          </div>

          {items.length > 0 && (
            <button
              type="button"
              onClick={clearBag}
              className="w-fit text-xs text-muted underline underline-offset-4 transition-colors hover:text-ink"
            >
              Clear bag
            </button>
          )}
        </div>

        {/* CONTENT */}

        {!items.length ? (
          <EmptyBag />
        ) : (
          <div className="grid gap-14 pt-10 lg:grid-cols-[1fr_340px] lg:gap-20">

            {/* BAG ITEMS */}

            <section aria-label="Items in your bag">
              <div className="mb-5 hidden grid-cols-[1fr_110px_90px] border-b border-border pb-3 font-mono text-[9px] uppercase text-muted sm:grid">
                <span>Piece</span>
                <span>Quantity</span>
                <span className="text-right">Subtotal</span>
              </div>

              <div>
                {items.map((item) => {
                  const collection = getCollection(
                    item.product.collection,
                  );

                  const collectionName =
                    collection?.name ??
                    item.product.collection.replace(/-/g, " ");

                  return (
                    <BagItemCard
                      key={item.product.id}
                      item={item}
                      collectionName={collectionName}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                    />
                  );
                })}
              </div>

              <Link
                href="/shop"
                className="text-link mt-7 inline-block text-xs"
              >
                <span aria-hidden="true">←</span>
                {" "}Continue shopping
              </Link>
            </section>

            {/* ORDER SUMMARY */}

            <aside className="h-fit border border-border p-6 md:p-7">
              <span className="eyebrow text-muted">
                ORDER SUMMARY
              </span>

              <h2 className="display-heading mt-5 text-3xl">
                The numbers<span className="text-signal">.</span>
              </h2>

              <div className="mt-7 space-y-4 border-y border-border py-5 text-xs">
                <div className="flex justify-between gap-4">
                  <span className="text-muted">Pieces</span>

                  <span className="font-mono">
                    {itemCount}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Subtotal</span>

                  <span className="font-mono">
                    Not available
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-muted">Shipping</span>

                  <span className="font-mono">
                    Not calculated
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium">
                    Total
                  </span>

                  <span className="font-mono text-sm">
                    —
                  </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-muted">
                  Product prices and shipping details haven't
                  been configured for this demo.
                </p>
              </div>

              <Link
                href={"/checkout"}
                className="mt-7 flex min-h-12 w-full cursor-not-allowed items-center justify-between bg-ink/40 px-5 text-sm text-bone/70"
              >
                Checkout
                <span aria-hidden="true">→</span>
              </Link>

              <p className="mt-4 text-center font-mono text-[9px] uppercase leading-5 text-muted">
                Demo storefront / No orders processed
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
