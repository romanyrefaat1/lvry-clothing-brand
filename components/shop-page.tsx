
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useClothes } from "@/contexts/clothes-context";

/* ─────────────────────────────────────────
   TYPES
   ───────────────────────────────────────── */

type Piece = ReturnType<typeof useClothes>["pieces"][number];

type ViewMode = "grid" | "list";

type SortOption = "default" | "name-asc" | "name-desc";

const categories = [
  { label: "All pieces", value: "" },
  { label: "Tops", value: "top" },
  { label: "Layers", value: "layer" },
  { label: "Bottoms", value: "bottom" },
  { label: "Outerwear", value: "outerwear" },
  { label: "Accessories", value: "accessory" },
];

const sizes = ["S", "M", "L", "XL"];

const colors = [
  { name: "Bone", hex: "#EFEBE4" },
  { name: "Denim", hex: "#3E5C8A" },
  { name: "Canvas", hex: "#C9B79C" },
  { name: "Ink", hex: "#111111" },
];

const fits = ["Relaxed", "Regular", "Straight"];

const sortOptions: {
  label: string;
  value: SortOption;
}[] = [
  { label: "Featured", value: "default" },
  { label: "Name: A–Z", value: "name-asc" },
  { label: "Name: Z–A", value: "name-desc" },
];

const categoryLabels: Record<string, string> = {
  top: "Top",
  layer: "Layer",
  bottom: "Bottom",
  outerwear: "Outerwear",
  accessory: "Accessory",
};

function isSortOption(value: string): value is SortOption {
  return (
    value === "default" ||
    value === "name-asc" ||
    value === "name-desc"
  );
}

function isCategory(value: string) {
  return categories.some((category) => category.value === value && value !== "");
}

/* ─────────────────────────────────────────
   FILTER GROUP
   ───────────────────────────────────────── */

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-t border-border py-5">
      <legend className="eyebrow mb-4 block text-muted">
        {title}
      </legend>

      {children}
    </fieldset>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
   ───────────────────────────────────────── */

function ProductCard({
  piece,
  view,
  collectionName,
}: {
  piece: Piece;
  view: ViewMode;
  collectionName: string;
}) {
  const category = categoryLabels[piece.category] ?? piece.category;

  if (view === "list") {
    return (
      <article className="group grid grid-cols-[112px_1fr] gap-5 border-b border-border py-5 sm:grid-cols-[160px_1fr_auto] sm:items-center">
        <Link
          href={`/shop/${piece.id}`}
          className="relative block aspect-square overflow-hidden bg-surface"
          aria-label={`View ${piece.name}`}
        >
          <Image
            src={piece.image}
            alt={piece.name}
            fill
            sizes="(max-width: 640px) 112px, 160px"
            className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        <div className="min-w-0 py-1">
          <span className="font-mono text-[9px] uppercase text-muted">
            {category} / {collectionName}
          </span>

          <Link href={`/shop/${piece.id}`} className="mt-2 block">
            <h2 className="font-display text-2xl tracking-tight transition-opacity group-hover:opacity-60">
              {piece.name}
            </h2>
          </Link>

          <p className="mt-2 text-xs text-muted">
            {collectionName}
          </p>
        </div>

        <Link
          href={`/shop/${piece.id}`}
          className="col-span-2 inline-flex min-h-10 items-center justify-center border border-ink px-4 text-xs transition-colors hover:bg-ink hover:text-bone sm:col-span-1"
        >
          View piece
          <span className="ml-3" aria-hidden="true">↗</span>
        </Link>
      </article>
    );
  }

  return (
    <article className="group min-w-0">
      <Link
        href={`/shop/${piece.id}`}
        className="block"
        aria-label={`View ${piece.name}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-surface">
          <span className="absolute left-4 top-4 z-10 font-mono text-[9px] uppercase tracking-wider text-muted">
            LVRY / {category}
          </span>

          <Image
            src={piece.image}
            alt={piece.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-[1.045]"
          />

          <span className="absolute bottom-4 left-4 translate-y-2 bg-ink px-3 py-2 text-[10px] text-bone opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            View piece <span aria-hidden="true">↗</span>
          </span>
        </div>
      </Link>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/shop/${piece.id}`}>
            <h2 className="text-sm font-medium transition-opacity hover:opacity-60">
              {piece.name}
            </h2>
          </Link>

          <p className="mt-1 text-xs text-muted">
            {collectionName}
          </p>
        </div>

        <span className="shrink-0 font-mono text-[9px] uppercase text-muted">
          {category}
        </span>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────
   SHOP PAGE
   ───────────────────────────────────────── */

export function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    pieces,
    collections,
    filteredPieces,
    setSearch,
    setCollection,
    setCategory,
    setSort,
    clearFilters,
    getCollection,
  } = useClothes();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState<ViewMode>("grid");
  const [searchInput, setSearchInput] = useState("");

  /* URL PARAMETERS */

  const category = searchParams.get("category") ?? "";
  const collection = searchParams.get("collection") ?? "";
  const search = searchParams.get("q") ?? "";

  const size = searchParams.get("size") ?? "";
  const color = searchParams.get("color") ?? "";
  const fit = searchParams.get("fit") ?? "";

  const sortParam = searchParams.get("sort") ?? "default";
  const sort: SortOption = isSortOption(sortParam)
    ? sortParam
    : "default";

  const viewParam = searchParams.get("view") ?? "grid";

  /* SYNC URL WITH CLOTHES CONTEXT */

  useEffect(() => {
    setCategory(isCategory(category) ? category : null);
    setCollection(collection || null);
    setSearch(search);
    setSort(sort);

    setSearchInput(search);
  }, [
    category,
    collection,
    search,
    sort,
    setCategory,
    setCollection,
    setSearch,
    setSort,
  ]);

  useEffect(() => {
    setView(viewParam === "list" ? "list" : "grid");
  }, [viewParam]);

  /* URL UPDATE */

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (
      !value ||
      (key === "sort" && value === "default") ||
      (key === "view" && value === "grid")
    ) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function handleClearFilters() {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("category");
    params.delete("collection");
    params.delete("size");
    params.delete("color");
    params.delete("fit");
    params.delete("q");
    params.delete("sort");

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });

    clearFilters();
    setSearchInput("");
  }

  function handleSearch(value: string) {
    setSearchInput(value);
    updateParam("q", value);
  }

  /* FILTERED RESULTS */

  // Size, color and fit are intentionally retained in the UI,
  // but the catalog does not currently contain these attributes.
  // Selecting any of them therefore produces an empty result.

  const hasUnsupportedFilter = Boolean(size || color || fit);

  const displayedPieces = useMemo(() => {
    if (hasUnsupportedFilter) {
      return [];
    }

    return filteredPieces;
  }, [filteredPieces, hasUnsupportedFilter]);

  const activeFilterCount = [
    Boolean(category),
    Boolean(collection),
    Boolean(size),
    Boolean(color),
    Boolean(fit),
  ].filter(Boolean).length;

  /* ACTIVE FILTER CHIPS */

  const activeFilters = [
    category
      ? {
          key: "category",
          label:
            categories.find((item) => item.value === category)?.label ??
            category,
        }
      : null,
    collection
      ? {
          key: "collection",
          label: getCollection(collection)?.name ?? collection,
        }
      : null,
    size ? { key: "size", label: `Size: ${size}` } : null,
    color ? { key: "color", label: `Color: ${color}` } : null,
    fit ? { key: "fit", label: `Fit: ${fit}` } : null,
  ].filter(
    (item): item is { key: string; label: string } => item !== null,
  );

  /* DISPLAY */

  return (
    <main className="min-h-screen bg-bone">

      {/* PAGE INTRO */}

      <section className="lvry-container pb-10 pt-12 md:pb-14 md:pt-20">
        <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] text-signal">
                01
              </span>

              <span className="h-px w-7 bg-border" />

              <span className="eyebrow text-muted">
                THE COLLECTION
              </span>
            </div>

            <h1 className="display-heading mt-6 text-6xl md:text-8xl">
              Shop<span className="text-signal">.</span>
            </h1>

            <p className="mt-5 max-w-md text-sm leading-6 text-muted">
              Small range. On purpose. Pieces for the days that make up
              most of your life.
            </p>
          </div>

          <div className="flex items-end justify-between gap-8 md:flex-col md:items-end">
            <span className="handwritten -rotate-3 text-2xl text-denim md:text-3xl">
              Take your time.
            </span>

            <span className="font-mono text-[10px] uppercase text-muted">
              {displayedPieces.length.toString().padStart(2, "0")} /{" "}
              {pieces.length.toString().padStart(2, "0")} pieces
            </span>
          </div>
        </div>
      </section>

      {/* CATEGORY NAVIGATION */}

      <section className="lvry-container">
        <nav
          aria-label="Product categories"
          className="flex gap-6 overflow-x-auto border-b border-border pb-4"
        >
          {categories.map((item) => {
            const active = category === item.value;

            return (
              <button
                key={item.value || "all"}
                type="button"
                onClick={() => updateParam("category", item.value)}
                aria-pressed={active}
                className={`shrink-0 text-xs transition-colors ${
                  active
                    ? "font-semibold text-ink"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}

                {active && (
                  <span className="ml-2 text-signal" aria-hidden="true">
                    /
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </section>

      {/* FILTER TOOLBAR */}

      <section className="lvry-container pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              aria-expanded={filtersOpen}
              className="flex min-h-10 items-center gap-3 border border-ink px-4 text-xs transition-colors hover:bg-ink hover:text-bone"
            >
              <span>
                {filtersOpen ? "Close filters" : "Filter"}
              </span>

              <span aria-hidden="true">
                {filtersOpen ? "−" : "+"}
              </span>

              {activeFilterCount > 0 && (
                <span className="font-mono text-[10px]">
                  ({activeFilterCount})
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs text-muted underline underline-offset-4 hover:text-ink"
              >
                Clear all
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <span className="hidden font-mono text-[9px] uppercase text-muted sm:inline">
                Sort
              </span>

              <select
                value={sort}
                onChange={(event) =>
                  updateParam("sort", event.target.value)
                }
                className="min-h-10 bg-transparent text-xs outline-none"
                aria-label="Sort products"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="hidden h-5 w-px bg-border sm:block" />

            {/* VIEW MODES */}

            <div className="flex items-center gap-1" aria-label="Display mode">
              <button
                type="button"
                onClick={() => updateParam("view", "grid")}
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                className={`flex h-9 w-9 items-center justify-center ${
                  view === "grid"
                    ? "bg-ink text-bone"
                    : "text-muted hover:text-ink"
                }`}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="1" y="1" width="6" height="6" />
                  <rect x="9" y="1" width="6" height="6" />
                  <rect x="1" y="9" width="6" height="6" />
                  <rect x="9" y="9" width="6" height="6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={() => updateParam("view", "list")}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={`flex h-9 w-9 items-center justify-center ${
                  view === "list"
                    ? "bg-ink text-bone"
                    : "text-muted hover:text-ink"
                }`}
              >
                <svg
                  viewBox="0 0 16 16"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <rect x="1" y="2" width="14" height="2" />
                  <rect x="1" y="7" width="14" height="2" />
                  <rect x="1" y="12" width="14" height="2" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH */}

        <div className="mt-6 flex items-center gap-3 border-b border-border pb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-4 w-4 shrink-0 text-muted"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m16 16 4 4" />
          </svg>

          <input
            type="search"
            value={searchInput}
            onChange={(event) => handleSearch(event.target.value)}
            placeholder="Find a piece..."
            aria-label="Search pieces"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
          />

          {searchInput && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="text-xs text-muted hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>

        {/* FILTER PANEL */}

        {filtersOpen && (
          <div className="mt-6 grid gap-8 border-y border-border py-2 sm:grid-cols-2 lg:grid-cols-4">

            {/* COLLECTION */}

            <FilterGroup title="Collection">
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => updateParam("collection", "")}
                  aria-pressed={!collection}
                  className={`text-left text-xs ${
                    !collection ? "font-semibold text-ink" : "text-muted"
                  }`}
                >
                  All collections
                </button>

                {collections.map((item) => (
                  <button
                    key={item.codename}
                    type="button"
                    onClick={() =>
                      updateParam(
                        "collection",
                        collection === item.codename ? "" : item.codename,
                      )
                    }
                    aria-pressed={collection === item.codename}
                    className={`text-left text-xs ${
                      collection === item.codename
                        ? "font-semibold text-ink"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* SIZE */}

            <FilterGroup title="Size">
              <div className="flex flex-wrap gap-2">
                {sizes.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      updateParam("size", size === item ? "" : item)
                    }
                    aria-pressed={size === item}
                    className={`h-10 min-w-10 border px-3 text-xs ${
                      size === item
                        ? "border-ink bg-ink text-bone"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* COLOR */}

            <FilterGroup title="Color">
              <div className="flex flex-wrap gap-2">
                {colors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      updateParam(
                        "color",
                        color === item.name ? "" : item.name,
                      )
                    }
                    aria-pressed={color === item.name}
                    className={`flex items-center gap-2 border px-3 py-2 text-xs ${
                      color === item.name
                        ? "border-ink bg-surface"
                        : "border-transparent hover:border-border"
                    }`}
                  >
                    <span
                      className="h-3 w-3 rounded-full border border-ink/15"
                      style={{ backgroundColor: item.hex }}
                      aria-hidden="true"
                    />

                    {item.name}
                  </button>
                ))}
              </div>
            </FilterGroup>

            {/* FIT */}

            <FilterGroup title="Fit">
              <div className="flex flex-wrap gap-2">
                {fits.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() =>
                      updateParam("fit", fit === item ? "" : item)
                    }
                    aria-pressed={fit === item}
                    className={`border px-3 py-2 text-xs ${
                      fit === item
                        ? "border-ink bg-ink text-bone"
                        : "border-border hover:border-ink"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </div>
        )}

        {/* ACTIVE FILTERS */}

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-5">
            <span className="font-mono text-[9px] uppercase text-muted">
              Applied:
            </span>

            {activeFilters.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => updateParam(item.key, "")}
                className="flex items-center gap-2 border border-border px-2 py-1 text-[10px] hover:border-ink"
              >
                {item.label}
                <span aria-hidden="true">×</span>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* PRODUCT GRID */}

      <section className="lvry-container pb-24 pt-8 md:pb-32 md:pt-12">
        {displayedPieces.length > 0 ? (
          <div
            className={
              view === "grid"
                ? "grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col"
            }
          >
            {displayedPieces.map((piece) => {
              const collectionName =
                getCollection(piece.collection)?.name ?? piece.collection;

              return (
                <ProductCard
                  key={piece.id}
                  piece={piece}
                  view={view}
                  collectionName={collectionName}
                />
              );
            })}
          </div>
        ) : (
          <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-border px-6 text-center">
            <span className="font-mono text-[10px] uppercase text-muted">
              Nothing here / 000
            </span>

            <h2 className="display-heading mt-5 text-4xl md:text-5xl">
              No matches.
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
              {hasUnsupportedFilter
                ? "We don't have product information for this filter yet. Remove it to see the collection."
                : "These filters don't leave us with anything. Try removing one."}
            </p>

            <button
              type="button"
              onClick={handleClearFilters}
              className="mt-7 border border-ink px-5 py-3 text-xs transition-colors hover:bg-ink hover:text-bone"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* FOOTER COUNT */}

        <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-5 text-[10px] text-muted sm:flex-row">
          <span className="font-mono uppercase">
            Showing {displayedPieces.length} of {pieces.length} pieces
          </span>

          <span className="font-mono uppercase">
            LVRY / The everyday uniform
          </span>
        </div>
      </section>
    </main>
  );
}
