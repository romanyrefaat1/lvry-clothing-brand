"use client";

import Link from "next/link";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useMemo, useState } from "react";

import { useBag } from "@/contexts/bag-context";

type Category = "Tops" | "Layers" | "Bottoms" | "Outerwear";
type Fit = "Relaxed" | "Regular" | "Straight";
type ViewMode = "grid" | "list";

type Product = {
  id: string;
  number: string;
  name: string;
  description: string;
  category: Category;
  fit: Fit;
  color: string;
  colorHex: string;
  sizes: string[];
  slug: string;
};

const products: Product[] = [
  {
    id: "relaxed-tee",
    number: "001",
    name: "Relaxed tee",
    description: "The usual starting point.",
    category: "Tops",
    fit: "Relaxed",
    color: "Bone",
    colorHex: "#EFEBE4",
    sizes: ["S", "M", "L", "XL"],
    slug: "relaxed-tee",
  },
  {
    id: "overshirt",
    number: "002",
    name: "Overshirt",
    description: "For when a tee isn't enough.",
    category: "Layers",
    fit: "Regular",
    color: "Denim",
    colorHex: "#3E5C8A",
    sizes: ["S", "M", "L", "XL"],
    slug: "overshirt",
  },
  {
    id: "straight-trousers",
    number: "003",
    name: "Straight trousers",
    description: "Goes with most things.",
    category: "Bottoms",
    fit: "Straight",
    color: "Canvas",
    colorHex: "#C9B79C",
    sizes: ["S", "M", "L"],
    slug: "straight-trousers",
  },
  {
    id: "everyday-jacket",
    number: "004",
    name: "Everyday jacket",
    description: "An extra layer. Nothing complicated.",
    category: "Outerwear",
    fit: "Regular",
    color: "Ink",
    colorHex: "#252525",
    sizes: ["M", "L", "XL"],
    slug: "everyday-jacket",
  },
];

const categories = ["All pieces", "Tops", "Layers", "Bottoms", "Outerwear"];
const sizes = ["S", "M", "L", "XL"];
const colors = ["Bone", "Denim", "Canvas", "Ink"];
const fits = ["Relaxed", "Regular", "Straight"];

function getParam(
  params: ReturnType<typeof useSearchParams>,
  key: string,
) {
  return params.get(key) ?? "";
}

/* ─────────────────────────────────────────
   PRODUCT IMAGE PLACEHOLDER
   Replace with real, consistent product
   photography before presenting this as
   a finished storefront.
   ───────────────────────────────────────── */

function ProductImagePlaceholder({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <div
      className={`relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden ${
        compact ? "aspect-square" : "aspect-[4/5]"
      }`}
      style={{ backgroundColor: "#E5E0D8" }}
    >
      <div
        className="absolute inset-4 border border-ink/10"
        aria-hidden="true"
      />

      <div className="relative flex flex-col items-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink/45">
          LVRY / {product.number}
        </span>

        <span
          className="mt-4 block h-16 w-16 rounded-full border border-ink/10"
          style={{ backgroundColor: product.colorHex }}
          aria-hidden="true"
        />

        <span className="mt-4 font-display text-2xl tracking-tight text-ink md:text-3xl">
          {product.name}
        </span>

        <span className="mt-2 font-mono text-[8px] uppercase tracking-wider text-ink/45">
          Product image placeholder
        </span>
      </div>

      <span className="absolute bottom-5 left-5 font-mono text-[9px] uppercase text-ink/50">
        {product.color}
      </span>

      <span className="absolute bottom-5 right-5 font-mono text-[9px] uppercase text-ink/50">
        {product.fit} fit
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   FILTER CONTROL
   ───────────────────────────────────────── */

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-border py-5">
      <legend className="eyebrow mb-4 block text-muted">{title}</legend>
      {children}
    </fieldset>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CARD
   ───────────────────────────────────────── */

function ProductCard({
  product,
  view,
  onQuickAdd,
}: {
  product: Product;
  view: ViewMode;
  onQuickAdd: (product: Product) => void;
}) {
  if (view === "list") {
    return (
      <article className="group grid grid-cols-[112px_1fr] gap-5 border-b border-border py-5 sm:grid-cols-[160px_1fr_auto] sm:items-center">
        <Link href={`/shop/${product.slug}`} className="block">
          <ProductImagePlaceholder product={product} compact />
        </Link>

        <div className="min-w-0 py-1">
          <span className="font-mono text-[9px] uppercase text-muted">
            {product.category} / {product.number}
          </span>

          <Link href={`/shop/${product.slug}`} className="mt-2 block">
            <h2 className="font-display text-2xl tracking-tight transition-opacity group-hover:opacity-60">
              {product.name}
            </h2>
          </Link>

          <p className="mt-1 text-xs text-muted">{product.description}</p>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[9px] uppercase text-muted">
            <span>{product.fit} fit</span>
            <span>{product.color}</span>
            <span>Sizes: {product.sizes.join(", ")}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          className="col-span-2 w-full border border-ink px-4 py-3 text-xs transition-colors hover:bg-ink hover:text-bone sm:col-span-1 sm:w-auto"
        >
          Quick add <span aria-hidden="true">+</span>
        </button>
      </article>
    );
  }

  return (
    <article className="group min-w-0">
      <div className="relative">
        <Link
          href={`/shop/${product.slug}`}
          className="block overflow-hidden"
          aria-label={`View ${product.name}`}
        >
          <div className="transition-transform duration-500 group-hover:scale-[1.015]">
            <ProductImagePlaceholder product={product} />
          </div>
        </Link>

        <button
          type="button"
          onClick={() => onQuickAdd(product)}
          className="absolute bottom-4 right-4 translate-y-2 bg-ink px-4 py-3 text-[10px] text-bone opacity-0 transition-all duration-200 hover:bg-signal hover:text-ink group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100"
        >
          Quick add <span aria-hidden="true">+</span>
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/shop/${product.slug}`}>
            <h2 className="text-sm font-medium transition-opacity hover:opacity-60">
              {product.name}
            </h2>
          </Link>

          <p className="mt-1 text-xs text-muted">{product.description}</p>
        </div>

        <span className="shrink-0 font-mono text-[9px] uppercase text-muted">
          {product.number}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full border border-ink/15"
            style={{ backgroundColor: product.colorHex }}
            aria-hidden="true"
          />
          <span className="font-mono text-[9px] uppercase text-muted">
            {product.color}
          </span>
        </div>

        <span className="font-mono text-[9px] uppercase text-muted">
          {product.fit} fit
        </span>
      </div>
    </article>
  );
}

/* ─────────────────────────────────────────
   QUICK ADD MODAL
   ───────────────────────────────────────── */

function QuickAddDialog({
  product,
  onClose,
}: {
  product: Product | null;
  onClose: () => void;
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [message, setMessage] = useState("");
  const { addItem } = useBag();

  if (!product) return null;

  function handleDemoAdd() {
  if (!selectedSize) {
    setMessage("Choose a size first.");
    return;
  }

  addItem(
    {
      id: product.id,
      name: product.name,
      slug: product.slug,
      color: product.color,
      colorHex: product.colorHex,
    },
    selectedSize,
  );

  setMessage(`${product.name} / ${selectedSize} added to your bag.`);
}

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-add-title"
        className="relative w-full max-w-md bg-bone p-6 sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close quick add"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-border text-lg transition-colors hover:bg-ink hover:text-bone"
        >
          ×
        </button>

        <span className="eyebrow text-muted">QUICK ADD / {product.number}</span>

        <h2
          id="quick-add-title"
          className="display-heading mt-5 pr-10 text-4xl"
        >
          {product.name}
        </h2>

        <p className="mt-2 text-sm text-muted">{product.description}</p>

        <div className="mt-8">
          <span className="eyebrow text-muted">Select a size</span>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                aria-pressed={selectedSize === size}
                onClick={() => {
                  setSelectedSize(size);
                  setMessage("");
                }}
                className={`min-h-12 border text-sm transition-colors ${
                  selectedSize === size
                    ? "border-ink bg-ink text-bone"
                    : "border-border hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDemoAdd}
          className="mt-7 flex min-h-12 w-full items-center justify-between bg-ink px-5 text-sm text-bone transition-colors hover:bg-signal hover:text-ink"
        >
          Add to bag <span aria-hidden="true">→</span>
        </button>

        {message && (
          <p role="status" className="mt-4 text-xs leading-5 text-muted">
            {message}
          </p>
        )}

        <p className="mt-5 border-t border-border pt-4 font-mono text-[9px] uppercase leading-5 text-muted">
          Demo storefront. No real stock, prices or checkout are connected.
        </p>
      </section>
    </div>
  );
}

/* ─────────────────────────────────────────
   SHOP PAGE
   ───────────────────────────────────────── */

export function ShopPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  const category = getParam(searchParams, "category") || "All pieces";
  const size = getParam(searchParams, "size");
  const color = getParam(searchParams, "color");
  const fit = getParam(searchParams, "fit");
  const sort = getParam(searchParams, "sort") || "featured";
  const view = (getParam(searchParams, "view") || "grid") as ViewMode;

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "All pieces" || value === "featured" || value === "grid") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (category !== "All pieces") {
      result = result.filter((product) => product.category === category);
    }

    if (size) {
      result = result.filter((product) => product.sizes.includes(size));
    }

    if (color) {
      result = result.filter((product) => product.color === color);
    }

    if (fit) {
      result = result.filter((product) => product.fit === fit);
    }

    if (sort === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }

    return result;
  }, [category, size, color, fit, sort]);

  const activeFilterCount = [
    category !== "All pieces",
    Boolean(size),
    Boolean(color),
    Boolean(fit),
  ].filter(Boolean).length;

  return (
    <>
      <main className="min-h-screen bg-bone">
        {/* PAGE INTRO */}
        <section className="lvry-container pb-10 pt-12 md:pb-14 md:pt-20">
          <div className="flex flex-col justify-between gap-8 border-b border-border pb-10 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-signal">01</span>
                <span className="h-px w-7 bg-border" />
                <span className="eyebrow text-muted">THE COLLECTION</span>
              </div>

              <h1 className="display-heading mt-6 text-6xl md:text-8xl">
                Shop<span className="text-signal">.</span>
              </h1>

              <p className="mt-5 max-w-md text-sm leading-6 text-muted">
                Small range. On purpose. Pieces for the days that make up most
                of your life.
              </p>
            </div>

            <div className="flex items-end justify-between gap-8 md:flex-col md:items-end">
              <span className="handwritten -rotate-3 text-2xl text-denim md:text-3xl">
                Take your time.
              </span>

              <span className="font-mono text-[10px] uppercase text-muted">
                {filteredProducts.length.toString().padStart(2, "0")} /{" "}
                {products.length.toString().padStart(2, "0")} pieces
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
              const active = category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => updateParam("category", item)}
                  aria-pressed={active}
                  className={`shrink-0 text-xs transition-colors ${
                    active
                      ? "font-semibold text-ink"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {item}
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
                <span>{filtersOpen ? "Close filters" : "Filter"}</span>
                <span aria-hidden="true">{filtersOpen ? "−" : "+"}</span>
                {activeFilterCount > 0 && (
                  <span className="font-mono text-[10px]">
                    ({activeFilterCount})
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
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
                  onChange={(event) => updateParam("sort", event.target.value)}
                  className="min-h-10 bg-transparent text-xs outline-none"
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="name-asc">Name: A–Z</option>
                  <option value="name-desc">Name: Z–A</option>
                  <option value="category">Category</option>
                </select>
              </label>

              <div className="hidden h-5 w-px bg-border sm:block" />

              <div className="flex items-center gap-1" aria-label="Display mode">
                <button
                  type="button"
                  onClick={() => updateParam("view", "grid")}
                  aria-label="Grid view"
                  aria-pressed={view === "grid"}
                  className={`flex h-9 w-9 items-center justify-center ${
                    view === "grid" ? "bg-ink text-bone" : "text-muted hover:text-ink"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
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
                    view === "list" ? "bg-ink text-bone" : "text-muted hover:text-ink"
                  }`}
                >
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                    <rect x="1" y="2" width="14" height="2" />
                    <rect x="1" y="7" width="14" height="2" />
                    <rect x="1" y="12" width="14" height="2" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* FILTER PANEL */}
          {filtersOpen && (
            <div className="mt-6 grid gap-8 border-y border-border py-2 sm:grid-cols-3">
              <FilterGroup title="Size">
                <div className="flex flex-wrap gap-2">
                  {sizes.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateParam("size", size === item ? "" : item)}
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

              <FilterGroup title="Color">
                <div className="flex flex-wrap gap-2">
                  {colors.map((item) => {
                    const hex =
                      products.find((product) => product.color === item)?.colorHex ??
                      "#EFEBE4";

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => updateParam("color", color === item ? "" : item)}
                        aria-pressed={color === item}
                        className={`flex items-center gap-2 border px-3 py-2 text-xs ${
                          color === item
                            ? "border-ink bg-surface"
                            : "border-transparent hover:border-border"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-ink/15"
                          style={{ backgroundColor: hex }}
                          aria-hidden="true"
                        />
                        {item}
                      </button>
                    );
                  })}
                </div>
              </FilterGroup>

              <FilterGroup title="Fit">
                <div className="flex flex-wrap gap-2">
                  {fits.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => updateParam("fit", fit === item ? "" : item)}
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
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-5">
              <span className="font-mono text-[9px] uppercase text-muted">
                Applied:
              </span>

              {[category !== "All pieces" ? ["category", category] : null,
                size ? ["size", size] : null,
                color ? ["color", color] : null,
                fit ? ["fit", fit] : null,
              ]
                .filter(Boolean)
                .map((entry) => {
                  const [key, value] = entry as string[];

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateParam(key, "")}
                      className="flex items-center gap-2 border border-border px-2 py-1 text-[10px] hover:border-ink"
                    >
                      {value} <span aria-hidden="true">×</span>
                    </button>
                  );
                })}
            </div>
          )}
        </section>

        {/* PRODUCT GRID */}
        <section className="lvry-container pb-24 pt-8 md:pb-32 md:pt-12">
          {filteredProducts.length > 0 ? (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
                  : "flex flex-col"
              }
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  view={view}
                  onQuickAdd={setQuickAddProduct}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-border px-6 text-center">
              <span className="font-mono text-[10px] uppercase text-signal">
                Nothing here / 000
              </span>

              <h2 className="display-heading mt-5 text-4xl md:text-5xl">
                No matches.
              </h2>

              <p className="mt-4 max-w-xs text-sm leading-6 text-muted">
                These filters don't leave us with anything. Try removing one.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-7 border border-ink px-5 py-3 text-xs transition-colors hover:bg-ink hover:text-bone"
              >
                Clear filters
              </button>
            </div>
          )}

          <div className="mt-16 flex flex-col justify-between gap-3 border-t border-border pt-5 text-[10px] text-muted sm:flex-row">
            <span className="font-mono uppercase">
              Showing {filteredProducts.length} of {products.length} pieces
            </span>
            <span className="font-mono uppercase">
              LVRY / The everyday uniform
            </span>
          </div>
        </section>
      </main>

      <QuickAddDialog
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
      />
    </>
  );
}