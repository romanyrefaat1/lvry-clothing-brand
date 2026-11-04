
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Copy,
  Layers,
  Minus,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Share2,
  ShoppingBag,
  Sparkles,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useBag } from "@/contexts/bag-context";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Slot = "top" | "layer" | "bottom" | "outerwear";
type Background = "bone" | "kraft" | "denim" | "canvas";
type Category = Slot | "all";

type Product = {
  id: string;
  number: string;
  name: string;
  description: string;
  category: string;
  color: string;
  colorHex: string;
  sizes: string[];
  slug: string;
  slot: Slot;
};

type OutfitSlots = Record<Slot, string | null>;

type OutfitState = {
  slots: OutfitSlots;
  sizes: Record<string, string>;
  background: Background;
};

type SavedOutfit = OutfitState & {
  id: string;
  name: string;
  createdAt: number;
};

type HistoryState = {
  past: OutfitState[];
  future: OutfitState[];
};

const STORAGE_KEY = "lvry-saved-outfits";

const emptySlots: OutfitSlots = {
  top: null,
  layer: null,
  bottom: null,
  outerwear: null,
};

const initialState: OutfitState = {
  slots: {
    top: "relaxed-tee",
    layer: null,
    bottom: "straight-trousers",
    outerwear: null,
  },
  sizes: {},
  background: "bone",
};

// --------------------------------------------------
// PRODUCT DATA
// --------------------------------------------------

const products: Product[] = [
  {
    id: "relaxed-tee",
    number: "001",
    name: "Relaxed tee",
    description: "The usual starting point.",
    category: "Tops",
    color: "Bone",
    colorHex: "#EFEBE4",
    sizes: ["S", "M", "L", "XL"],
    slug: "relaxed-tee",
    slot: "top",
  },
  {
    id: "overshirt",
    number: "002",
    name: "Overshirt",
    description: "For when a tee isn't enough.",
    category: "Layers",
    color: "Denim",
    colorHex: "#3E5C8A",
    sizes: ["S", "M", "L", "XL"],
    slug: "overshirt",
    slot: "layer",
  },
  {
    id: "straight-trousers",
    number: "003",
    name: "Straight trousers",
    description: "Goes with most things.",
    category: "Bottoms",
    color: "Canvas",
    colorHex: "#C9B79C",
    sizes: ["S", "M", "L"],
    slug: "straight-trousers",
    slot: "bottom",
  },
  {
    id: "everyday-jacket",
    number: "004",
    name: "Everyday jacket",
    description: "An extra layer. Nothing complicated.",
    category: "Outerwear",
    color: "Ink",
    colorHex: "#252525",
    sizes: ["M", "L", "XL"],
    slug: "everyday-jacket",
    slot: "outerwear",
  },
];

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "top", label: "Tops" },
  { id: "layer", label: "Layers" },
  { id: "bottom", label: "Bottoms" },
  { id: "outerwear", label: "Outerwear" },
];

const slotLabels: Record<Slot, string> = {
  top: "Top",
  layer: "Layer",
  bottom: "Bottom",
  outerwear: "Outerwear",
};

const backgrounds: {
  id: Background;
  label: string;
  color: string;
  textColor: string;
}[] = [
  { id: "bone", label: "Bone paper", color: "#EFEBE4", textColor: "#171613" },
  { id: "kraft", label: "Kraft paper", color: "#C9B79C", textColor: "#171613" },
  { id: "denim", label: "Denim", color: "#3E5C8A", textColor: "#EFEBE4" },
  { id: "canvas", label: "Canvas", color: "#D8CBB8", textColor: "#171613" },
];

const slotPositions: Record<Slot, string> = {
  top: "left-[30%] top-[7%] z-20 w-[40%]",
  layer: "left-[40%] top-[11%] z-30 w-[43%]",
  bottom: "left-[30%] bottom-[5%] z-10 w-[40%]",
  outerwear: "left-[12%] top-[8%] z-40 w-[43%]",
};

function getProduct(id: string | null): Product | undefined {
  return products.find((product) => product.id === id);
}

// --------------------------------------------------
// GARMENT ARTWORK
// --------------------------------------------------

function GarmentArtwork({
  product,
  className = "",
}: {
  product: Product;
  className?: string;
}) {
  const fill = product.colorHex;
  const stroke = product.color === "Bone" ? "#B9B1A5" : "#171613";

  return (
    <svg
      viewBox="0 0 300 360"
      fill="none"
      className={className}
      role="img"
      aria-label={product.name}
    >
      {product.id === "relaxed-tee" && (
        <>
          <path
            d="M93 45 124 31c8 13 16 19 26 19s18-6 26-19l31 14 48 43-31 38-25-19v205H101V107l-25 19-31-38 48-43Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M124 31c4 18 13 27 26 27s22-9 26-27"
            stroke={stroke}
            strokeWidth="2.5"
          />
          <path
            d="M125 32c5 12 13 18 25 18s20-6 25-18"
            stroke={stroke}
            strokeWidth="1.5"
            opacity=".35"
          />
        </>
      )}

      {product.id === "overshirt" && (
        <>
          <path
            d="M91 43 124 31c7 13 16 20 26 20s19-7 26-20l33 12 44 45-29 39-23-18v210H99V109l-23 18-29-39 44-45Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="m124 31 26 39 26-39M150 70v249"
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="m124 31 8 49-21-13-14 36M176 31l-8 49 21-13 14 36"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M111 205h25v28h-25zM164 205h25v28h-25z"
            stroke={stroke}
            strokeWidth="1.5"
          />
          {[105, 135, 165, 195, 225, 255].map((y) => (
            <circle key={y} cx="150" cy={y} r="2.5" fill={stroke} />
          ))}
        </>
      )}

      {product.id === "straight-trousers" && (
        <>
          <path
            d="M83 36h134l-13 286h-53l-10-181-10 181H78L83 36Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M83 36h134v35H83z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M150 72v69M92 85h116"
            stroke={stroke}
            strokeWidth="1.5"
            opacity=".55"
          />
          <path
            d="M135 36v16M165 36v16"
            stroke={stroke}
            strokeWidth="1.5"
          />
        </>
      )}

      {product.id === "everyday-jacket" && (
        <>
          <path
            d="M91 43 124 31c7 13 16 20 26 20s19-7 26-20l33 12 44 45-29 39-23-18v210H99V109l-23 18-29-39 44-45Z"
            fill={fill}
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="m124 31 26 39 26-39M150 70v249"
            stroke="#EFEBE4"
            strokeWidth="2"
          />
          <path
            d="M124 31 110 86l40-16 40 16-14-55"
            stroke="#EFEBE4"
            strokeWidth="1.5"
          />
          <path
            d="M105 236h34v33h-34zM161 236h34v33h-34z"
            stroke="#EFEBE4"
            strokeWidth="1.5"
          />
          {[110, 145, 180, 215, 250].map((y) => (
            <circle key={y} cx="150" cy={y} r="2.5" fill="#EFEBE4" />
          ))}
        </>
      )}
    </svg>
  );
}

// --------------------------------------------------
// PRODUCT CARD
// --------------------------------------------------

function ProductCard({
  product,
  isSelected,
  onSelect,
  onDragStart,
}: {
  product: Product;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (event: DragEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`group min-w-0 text-left transition ${
        isSelected ? "opacity-100" : "opacity-90 hover:opacity-100"
      }`}
    >
      <div
        className={`relative flex aspect-[4/4.7] items-center justify-center overflow-hidden border p-4 transition-all duration-300 ${
          isSelected
            ? "border-ink bg-[#EAE5DC]"
            : "border-transparent bg-[#F2EFEA] hover:border-ink/40"
        }`}
      >
        <GarmentArtwork
          product={product}
          className="h-full w-full max-w-[130px] transition-transform duration-500 group-hover:scale-[1.06]"
        />

        <span className="absolute left-3 top-3 font-mono text-[9px] text-muted">
          {product.number}
        </span>

        {isSelected ? (
          <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-white">
            <Check size={12} />
          </span>
        ) : (
          <span className="absolute bottom-3 right-3 flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink opacity-0 shadow-sm transition group-hover:opacity-100">
            <Plus size={14} />
          </span>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-medium">{product.name}</p>
          <p className="mt-1 font-mono text-[10px] text-muted">
            {product.color}
          </p>
        </div>

        {isSelected && (
          <span className="mt-0.5 font-mono text-[9px] text-muted">
            ADDED
          </span>
        )}
      </div>
    </button>
  );
}

// --------------------------------------------------
// MAIN BUILDER
// --------------------------------------------------

export function UniformBuilder() {
  const { addItem } = useBag();

  const [outfit, setOutfit] = useState<OutfitState>(initialState);

  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
  });

  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedSlot, setSelectedSlot] = useState<Slot>("top");
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);

  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");
  const [saveDialog, setSaveDialog] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // ------------------------------------------------
  // DERIVED STATE
  // ------------------------------------------------

  const selectedProducts = useMemo(
    () =>
      (Object.entries(outfit.slots) as [Slot, string | null][])
        .map(([slot, id]) => {
          const product = getProduct(id);
          return product ? { slot, product } : null;
        })
        .filter(
          (
            item,
          ): item is {
            slot: Slot;
            product: Product;
          } => item !== null,
        ),
    [outfit.slots],
  );

  const visibleProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          activeCategory === "all" || product.slot === activeCategory,
      ),
    [activeCategory],
  );

  const selectedBackground =
    backgrounds.find((item) => item.id === outfit.background) ??
    backgrounds[0];

  const missingSizes = selectedProducts.filter(
    ({ product }) => !outfit.sizes[product.id],
  );

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // ------------------------------------------------
  // HISTORY
  // ------------------------------------------------

  const updateOutfit = useCallback(
    (updater: (current: OutfitState) => OutfitState) => {
      setOutfit((current) => {
        const next = updater(current);

        setHistory((previous) => ({
          past: [...previous.past, current].slice(-30),
          future: [],
        }));

        return next;
      });
    },
    [],
  );

  function undo() {
    if (!canUndo) return;

    const previous = history.past[history.past.length - 1];

    setHistory((current) => ({
      past: current.past.slice(0, -1),
      future: [outfit, ...current.future],
    }));

    setOutfit(previous);
  }

  function redo() {
    if (!canRedo) return;

    const next = history.future[0];

    setHistory((current) => ({
      past: [...current.past, outfit],
      future: current.future.slice(1),
    }));

    setOutfit(next);
  }

  // ------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setSavedOutfits(parsed);
        }
      }

      const params = new URLSearchParams(window.location.search);
      const shared = params.get("outfit");

      if (shared) {
        const decoded = JSON.parse(atob(shared));

        if (decoded && typeof decoded === "object") {
          const validSlots: OutfitSlots = { ...emptySlots };

          for (const slot of Object.keys(slotLabels) as Slot[]) {
            const id = decoded.slots?.[slot];
            if (products.some((product) => product.id === id)) {
              validSlots[slot] = id;
            }
          }

          const validBackground = backgrounds.some(
            (item) => item.id === decoded.background,
          )
            ? decoded.background
            : "bone";

          const validSizes: Record<string, string> = {};

          for (const product of products) {
            const size = decoded.sizes?.[product.id];

            if (product.sizes.includes(size)) {
              validSizes[product.id] = size;
            }
          }

          setOutfit({
            slots: validSlots,
            background: validBackground,
            sizes: validSizes,
          });

          setMessage("Shared outfit loaded.");
        }
      }
    } catch {
      // Ignore invalid local or shared data.
    } finally {
      setReady(true);
    }
  }, []);

  // ------------------------------------------------
  // ACTIONS
  // ------------------------------------------------

  function selectProduct(product: Product) {
    updateOutfit((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [product.slot]:
          current.slots[product.slot] === product.id
            ? null
            : product.id,
      },
    }));

    setSelectedSlot(product.slot);
    setMessage("");
  }

  function removeProduct(slot: Slot) {
    updateOutfit((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [slot]: null,
      },
    }));

    setMessage("Piece removed.");
  }

  function handleDragStart(
    event: DragEvent<HTMLButtonElement>,
    product: Product,
  ) {
    event.dataTransfer.setData("text/plain", product.id);
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const productId = event.dataTransfer.getData("text/plain");
    const product = getProduct(productId);

    if (!product) return;

    updateOutfit((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [product.slot]: product.id,
      },
    }));

    setSelectedSlot(product.slot);
    setMessage(`${product.name} added.`);
  }

  function changeBackground(background: Background) {
    updateOutfit((current) => ({
      ...current,
      background,
    }));
  }

  function changeSize(productId: string, size: string) {
    updateOutfit((current) => ({
      ...current,
      sizes: {
        ...current.sizes,
        [productId]: size,
      },
    }));
  }

  function resetOutfit() {
    updateOutfit(() => ({
      slots: { ...emptySlots },
      sizes: {},
      background: "bone",
    }));

    setMessage("Canvas cleared.");
  }

  // ------------------------------------------------
  // SAVING
  // ------------------------------------------------

  function persistSavedOutfits(updated: SavedOutfit[]) {
    setSavedOutfits(updated);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      setMessage("Couldn't save outfits on this device.");
    }
  }

  function saveOutfit() {
    if (selectedProducts.length === 0) {
      setMessage("Add at least one piece before saving.");
      return;
    }

    setOutfitName(`My uniform ${savedOutfits.length + 1}`);
    setSaveDialog(true);
  }

  function confirmSave() {
    if (!outfitName.trim()) return;

    const saved: SavedOutfit = {
      id: crypto.randomUUID(),
      name: outfitName.trim(),
      slots: { ...outfit.slots },
      sizes: { ...outfit.sizes },
      background: outfit.background,
      createdAt: Date.now(),
    };

    persistSavedOutfits([saved, ...savedOutfits].slice(0, 12));

    setSaveDialog(false);
    setMessage("Your uniform has been saved.");
  }

  function loadOutfit(saved: SavedOutfit) {
    updateOutfit(() => ({
      slots: { ...emptySlots, ...saved.slots },
      sizes: saved.sizes ?? {},
      background: saved.background ?? "bone",
    }));

    setShowSaved(false);
    setShowReview(false);
    setMessage(`${saved.name} loaded.`);
  }

  function deleteOutfit(id: string) {
    persistSavedOutfits(
      savedOutfits.filter((outfit) => outfit.id !== id),
    );
    setMessage("Saved outfit deleted.");
  }

  // ------------------------------------------------
  // SHARING
  // ------------------------------------------------

  async function shareOutfit() {
    if (selectedProducts.length === 0) {
      setMessage("Add a piece before sharing.");
      return;
    }

    const payload = {
      slots: outfit.slots,
      sizes: outfit.sizes,
      background: outfit.background,
    };

    const url = new URL(window.location.href);

    url.searchParams.set(
      "outfit",
      btoa(JSON.stringify(payload)),
    );

    try {
      await navigator.clipboard.writeText(url.toString());
      setMessage("Outfit link copied to clipboard.");
    } catch {
      setMessage("Couldn't copy the sharing link.");
    }
  }

  // ------------------------------------------------
  // BAG
  // ------------------------------------------------

  function addOutfitToBag() {
    if (selectedProducts.length === 0) {
      setMessage("Add a piece to your outfit first.");
      return;
    }

    if (missingSizes.length > 0) {
      setMessage(
        `Choose a size for ${missingSizes[0].product.name}.`,
      );
      setShowReview(true);
      return;
    }

    selectedProducts.forEach(({ product }) => {
      const size = outfit.sizes[product.id];

      if (!size) return;

      addItem(
        {
          id: product.id,
          name: product.name,
          slug: product.slug,
          color: product.color,
          colorHex: product.colorHex,
        },
        size,
      );
    });

    setMessage(
      `${selectedProducts.length} piece${selectedProducts.length === 1 ? "" : "s"} added to your bag.`,
    );
  }

  // ------------------------------------------------
  // LOADING
  // ------------------------------------------------

  if (!ready) {
    return (
      <div className="lvry-container py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-64 bg-[#E6E0D6]" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="aspect-[4/4.5] bg-[#E6E0D6]" />
            <div className="h-[500px] bg-[#E6E0D6]" />
          </div>
        </div>
      </div>
    );
  }

  // ------------------------------------------------
  // RENDER
  // ------------------------------------------------

  return (
    <div className="lvry-container pb-28 pt-8 md:pb-20 md:pt-12">
      {/* HEADER */}

      <header className="mb-8 border-b border-border pb-7 md:mb-10 md:pb-9">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-signal" />
              <p className="eyebrow">LVRY STUDIO / 001</p>
            </div>

            <h1 className="display-heading text-5xl leading-[0.95] md:text-7xl">
              Build a uniform.
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-muted">
              A few good pieces. Endless ways to wear them.
              Put something together that feels like you.
            </p>
          </div>

          <div className="flex items-center gap-3 md:pb-1">
            <button
              type="button"
              onClick={() => setShowSaved(true)}
              className="inline-flex items-center gap-2 border border-border px-4 py-3 text-xs transition hover:border-ink"
            >
              <Layers size={14} />
              My uniforms
              <span className="font-mono text-muted">
                {savedOutfits.length}
              </span>
            </button>

            <button
              type="button"
              onClick={shareOutfit}
              className="inline-flex items-center gap-2 bg-ink px-4 py-3 text-xs text-bone transition hover:bg-signal hover:text-ink"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE */}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)] lg:gap-10">
        {/* CANVAS */}

        <section className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="eyebrow">01 / THE CANVAS</p>
              <p className="mt-1 text-xs text-muted">
                {selectedProducts.length} of 4 pieces
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                aria-label="Undo"
                title="Undo"
                className="p-2 text-muted transition hover:text-ink disabled:opacity-30"
              >
                <Undo2 size={16} />
              </button>

              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                aria-label="Redo"
                title="Redo"
                className="p-2 text-muted transition hover:text-ink disabled:opacity-30"
              >
                <Redo2 size={16} />
              </button>

              <span className="mx-2 h-4 w-px bg-border" />

              <button
                type="button"
                onClick={resetOutfit}
                className="inline-flex items-center gap-2 px-2 py-2 text-[11px] text-muted transition hover:text-ink"
              >
                <RotateCcw size={13} />
                Reset
              </button>
            </div>
          </div>

          {/* OUTFIT COMPOSITION */}

          <div
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            className="relative isolate aspect-[4/4.5] overflow-hidden border border-border transition-colors duration-500 sm:aspect-[4/4.2]"
            style={{
              backgroundColor: selectedBackground.color,
              color: selectedBackground.textColor,
            }}
            aria-label="Interactive outfit canvas"
          >
            <div className="paper-texture pointer-events-none absolute inset-0 opacity-[0.17]" />

            {/* Canvas metadata */}

            <div className="absolute left-5 top-5 z-50">
              <p className="font-mono text-[9px] tracking-[0.16em] opacity-60">
                LVRY / DAILY STUDY
              </p>
              <p className="mt-1 text-xs">Uniform no. 01</p>
            </div>

            <div className="absolute right-5 top-5 z-50 text-right">
              <p className="font-mono text-[9px] tracking-[0.16em] opacity-60">
                THE EVERYDAY UNIFORM
              </p>
              <p className="mt-1 text-xs">
                {selectedProducts.length} pieces
              </p>
            </div>

            {/* Garments */}

            {(Object.keys(slotLabels) as Slot[]).map((slot) => {
              const product = getProduct(outfit.slots[slot]);
              const active = selectedSlot === slot;

              return (
                <div
                  key={slot}
                  className={`absolute ${slotPositions[slot]} flex min-h-[90px] items-center justify-center transition-all duration-500 ${
                    active ? "z-50" : ""
                  }`}
                >
                  {product ? (
                    <div
                      className={`group relative w-full transition-all duration-300 ${
                        active ? "scale-[1.025]" : "hover:scale-[1.025]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setActiveCategory(slot);
                        }}
                        aria-label={`Inspect ${product.name}`}
                        className={`block w-full ${
                          active
                            ? "outline outline-1 outline-dashed outline-current/40 outline-offset-2"
                            : ""
                        }`}
                      >
                        <GarmentArtwork
                          product={product}
                          className="h-auto w-full drop-shadow-[3px_7px_4px_rgba(17,17,17,0.12)]"
                        />
                      </button>

                      <div
                        className={`absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-black/10 bg-white/95 px-2 py-1.5 text-[9px] text-ink shadow-sm transition ${
                          active
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {product.name}

                        <button
                          type="button"
                          onClick={() => removeProduct(slot)}
                          aria-label={`Remove ${product.name}`}
                          className="border-l border-border pl-2 text-muted hover:text-signal"
                        >
                          <X size={11} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSlot(slot);
                        setActiveCategory(slot);
                      }}
                      className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-current/30 py-5 text-center transition hover:border-current/70 hover:bg-black/[0.025] ${
                        active ? "border-current/70 bg-black/[0.025]" : ""
                      }`}
                    >
                      <Plus size={17} strokeWidth={1.5} />
                      <span className="font-mono text-[9px] uppercase tracking-wider">
                        Add {slotLabels[slot]}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}

            {/* Canvas footer */}

            <div className="absolute bottom-5 left-5 z-50">
              <p className="handwritten text-xl">Made to repeat.</p>
            </div>

            <div className="absolute bottom-5 right-5 z-50 text-right">
              <p className="font-mono text-[9px] tracking-widest opacity-60">
                LVRY / 001
              </p>
              <p className="mt-1 text-[10px]">Pieces of a uniform.</p>
            </div>

            {selectedProducts.length === 0 && (
              <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center">
                <p className="handwritten -rotate-6 text-2xl opacity-40">
                  Start with something good.
                </p>
              </div>
            )}
          </div>

          {/* CANVAS CONTROLS */}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Canvas material</p>
              <p className="mt-1 text-xs text-muted">
                Change the paper, not the clothes.
              </p>
            </div>

            <div className="flex items-center gap-4">
              {backgrounds.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => changeBackground(item.id)}
                  title={item.label}
                  aria-label={`Use ${item.label}`}
                  aria-pressed={outfit.background === item.id}
                  className={`h-7 w-7 border transition-all ${
                    outfit.background === item.id
                      ? "border-ink ring-1 ring-ink ring-offset-2"
                      : "border-black/10 hover:scale-110 hover:border-ink"
                  }`}
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>

          {/* CANVAS ACTIONS */}

          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={saveOutfit}
              className="flex items-center justify-center gap-2 border border-border px-3 py-3.5 text-xs transition hover:border-ink"
            >
              <Save size={14} />
              Save uniform
            </button>

            <button
              type="button"
              onClick={shareOutfit}
              className="flex items-center justify-center gap-2 border border-border px-3 py-3.5 text-xs transition hover:border-ink"
            >
              <Share2 size={14} />
              Share
            </button>

            <button
              type="button"
              onClick={() => setShowSaved(true)}
              className="col-span-2 flex items-center justify-center gap-2 border border-border px-3 py-3.5 text-xs transition hover:border-ink sm:col-span-1"
            >
              <Copy size={14} />
              Saved uniforms ({savedOutfits.length})
            </button>
          </div>
        </section>

        {/* PRODUCT COLLECTION */}

        <section className="min-w-0 lg:sticky lg:top-24">
          <div className="mb-5">
            <p className="eyebrow">02 / THE COLLECTION</p>

            <div className="mt-2 flex items-end justify-between gap-3">
              <h2 className="display-heading text-3xl md:text-4xl">
                The pieces.
              </h2>

              <span className="font-mono text-[10px] text-muted">
                {visibleProducts.length} PIECES
              </span>
            </div>

            <p className="mt-3 max-w-sm text-xs leading-5 text-muted">
              Good clothes don't need much. Find the pieces
              that work together.
            </p>
          </div>

          {/* CATEGORY FILTER */}

          <div className="mb-5 flex gap-1 overflow-x-auto border-b border-border pb-3 [scrollbar-width:none]">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveCategory(category.id)}
                aria-pressed={activeCategory === category.id}
                className={`shrink-0 px-3 py-2 text-[11px] transition ${
                  activeCategory === category.id
                    ? "bg-ink text-bone"
                    : "text-muted hover:text-ink"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* PRODUCT GRID */}

          <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={outfit.slots[product.slot] === product.id}
                onSelect={() => selectProduct(product)}
                onDragStart={(event) =>
                  handleDragStart(event, product)
                }
              />
            ))}
          </div>

          {/* SELECTION SUMMARY */}

          <div className="mt-9 border-t border-border pt-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow">03 / YOUR UNIFORM</p>
                <p className="mt-1 text-xs text-muted">
                  Everything you've picked.
                </p>
              </div>

              <span className="font-mono text-[10px] text-muted">
                {selectedProducts.length} / 4
              </span>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="border border-dashed border-border px-4 py-8 text-center">
                <Plus
                  size={19}
                  className="mx-auto mb-3 text-muted"
                  strokeWidth={1.5}
                />
                <p className="text-xs">Your uniform starts here.</p>
                <p className="mt-1 text-[10px] text-muted">
                  Pick a piece from the collection.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map(({ slot, product }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 border-b border-border pb-3 last:border-0"
                  >
                    <div className="flex h-[65px] w-[55px] shrink-0 items-center justify-center bg-[#F2EFEA] p-2">
                      <GarmentArtwork
                        product={product}
                        className="h-full w-full"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">
                        {product.name}
                      </p>

                      <p className="mt-1 font-mono text-[9px] text-muted">
                        {slotLabels[slot]} / {product.color}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <label
                          htmlFor={`size-${product.id}`}
                          className="font-mono text-[9px] text-muted"
                        >
                          SIZE
                        </label>

                        <select
                          id={`size-${product.id}`}
                          value={outfit.sizes[product.id] ?? ""}
                          onChange={(event) =>
                            changeSize(product.id, event.target.value)
                          }
                          className="min-w-[76px] border border-border bg-transparent px-2 py-1 text-[10px] outline-none transition focus:border-ink"
                        >
                          <option value="">Choose</option>

                          {product.sizes.map((size) => (
                            <option key={size} value={size}>
                              {size}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeProduct(slot)}
                      aria-label={`Remove ${product.name}`}
                      className="p-2 text-muted transition hover:text-signal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* REVIEW BUTTON */}

          <button
            type="button"
            onClick={() => setShowReview(true)}
            disabled={selectedProducts.length === 0}
            className="mt-5 flex w-full items-center justify-between border border-border px-4 py-3.5 text-xs transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="flex items-center gap-2">
              <ArrowDown size={14} />
              Review your uniform
            </span>
            <ArrowRight size={14} />
          </button>

          {/* BAG CTA */}

          <div className="mt-3">
            <button
              type="button"
              onClick={addOutfitToBag}
              disabled={selectedProducts.length === 0}
              className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-4 text-xs text-bone transition hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={15} />
              Add uniform to bag
              <span className="font-mono">
                ({selectedProducts.length})
              </span>
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-muted">
              Choose a size for each piece before adding.
              No payment is processed here.
            </p>
          </div>
        </section>
      </div>

      {/* ---------------------------------------------- */}
      {/* REVIEW DIALOG */}
      {/* ---------------------------------------------- */}

      {showReview && (
        <div
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowReview(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="max-h-[90dvh] w-full max-w-xl overflow-y-auto bg-[#F8F6F2] p-5 shadow-2xl sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <p className="eyebrow">LVRY / YOUR SELECTION</p>
                <h2
                  id="review-title"
                  className="display-heading mt-2 text-3xl"
                >
                  The final edit.
                </h2>
                <p className="mt-2 text-xs text-muted">
                  Check your pieces and choose your sizes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReview(false)}
                aria-label="Close review"
                className="p-2 text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {selectedProducts.map(({ slot, product }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border-b border-border pb-4"
                >
                  <div className="flex h-20 w-16 shrink-0 items-center justify-center bg-[#EFEBE4] p-2">
                    <GarmentArtwork
                      product={product}
                      className="h-full w-full"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="mt-1 font-mono text-[10px] text-muted">
                      {slotLabels[slot]} / {product.color}
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <label
                        htmlFor={`review-size-${product.id}`}
                        className="font-mono text-[9px] text-muted"
                      >
                        SIZE
                      </label>

                      <select
                        id={`review-size-${product.id}`}
                        value={outfit.sizes[product.id] ?? ""}
                        onChange={(event) =>
                          changeSize(product.id, event.target.value)
                        }
                        className="border border-border bg-transparent px-3 py-1.5 text-xs outline-none focus:border-ink"
                      >
                        <option value="">Choose size</option>
                        {product.sizes.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {outfit.sizes[product.id] && (
                    <Check size={15} className="text-muted" />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs">
              <span className="text-muted">Pieces selected</span>
              <span className="font-mono">
                {selectedProducts.length} / 4
              </span>
            </div>

            {missingSizes.length > 0 && (
              <p className="mt-4 text-[11px] text-muted">
                Choose a size for all {missingSizes.length} remaining
                {missingSizes.length === 1 ? " piece" : " pieces"}.
              </p>
            )}

            <button
              type="button"
              onClick={addOutfitToBag}
              disabled={missingSizes.length > 0}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-ink px-5 py-4 text-xs text-bone transition hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShoppingBag size={15} />
              Add everything to bag
              <ArrowRight size={14} />
            </button>
          </section>
        </div>
      )}

      {/* ---------------------------------------------- */}
      {/* SAVE DIALOG */}
      {/* ---------------------------------------------- */}

      {saveDialog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-title"
            className="w-full max-w-md bg-[#F8F6F2] p-6 shadow-2xl md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="eyebrow">KEEP SOMETHING GOOD</p>
              <button
                type="button"
                onClick={() => setSaveDialog(false)}
                aria-label="Close dialog"
                className="text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <h2
              id="save-title"
              className="display-heading text-3xl"
            >
              Give it a name.
            </h2>

            <p className="mt-2 text-xs leading-5 text-muted">
              Save this combination so you can come back to it later.
            </p>

            <label
              htmlFor="outfit-name"
              className="mt-6 block font-mono text-[10px] text-muted"
            >
              UNIFORM NAME
            </label>

            <input
              id="outfit-name"
              autoFocus
              value={outfitName}
              onChange={(event) => setOutfitName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") confirmSave();
              }}
              maxLength={40}
              placeholder="My everyday uniform"
              className="mt-2 w-full border-b border-border bg-transparent py-3 text-sm outline-none transition placeholder:text-muted/50 focus:border-ink"
            />

            <div className="mt-7 flex gap-2">
              <button
                type="button"
                onClick={() => setSaveDialog(false)}
                className="flex-1 border border-border px-4 py-3 text-xs hover:border-ink"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmSave}
                disabled={!outfitName.trim()}
                className="flex flex-1 items-center justify-center gap-2 bg-ink px-4 py-3 text-xs text-bone transition hover:bg-signal hover:text-ink disabled:opacity-40"
              >
                <Save size={14} />
                Save uniform
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ---------------------------------------------- */}
      {/* SAVED OUTFITS */}
      {/* ---------------------------------------------- */}

      {showSaved && (
        <div
          className="fixed inset-0 z-[115] flex justify-end bg-black/40 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSaved(false);
            }
          }}
        >
          <aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="saved-title"
            className="flex h-full w-full max-w-md flex-col bg-[#F8F6F2] shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-border p-6">
              <div>
                <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
                <h2
                  id="saved-title"
                  className="display-heading mt-2 text-3xl"
                >
                  Saved uniforms.
                </h2>
                <p className="mt-2 text-xs text-muted">
                  Stored on this device.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowSaved(false)}
                aria-label="Close saved uniforms"
                className="p-2 text-muted hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {savedOutfits.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Layers
                    size={28}
                    strokeWidth={1}
                    className="mb-5 text-muted"
                  />
                  <h3 className="display-heading text-2xl">
                    Nothing here yet.
                  </h3>
                  <p className="mt-2 max-w-[220px] text-xs leading-5 text-muted">
                    Save an outfit you love and it will find a home here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {savedOutfits.map((saved) => {
                    const savedProducts = (
                      Object.entries(saved.slots) as [
                        Slot,
                        string | null,
                      ][]
                    )
                      .map(([, id]) => getProduct(id))
                      .filter(
                        (product): product is Product =>
                          product !== undefined,
                      );

                    return (
                      <div
                        key={saved.id}
                        className="border-b border-border pb-5"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-medium">
                              {saved.name}
                            </h3>
                            <p className="mt-1 font-mono text-[9px] text-muted">
                              {savedProducts.length} PIECES
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => deleteOutfit(saved.id)}
                            aria-label={`Delete ${saved.name}`}
                            className="p-2 text-muted hover:text-signal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {savedProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex h-16 w-14 items-center justify-center bg-[#EFEBE4] p-2"
                            >
                              <GarmentArtwork
                                product={product}
                                className="h-full w-full"
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => loadOutfit(saved)}
                          className="mt-3 flex w-full items-center justify-between border border-border px-3 py-2.5 text-xs transition hover:border-ink"
                        >
                          Load uniform
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* ---------------------------------------------- */}
      {/* TOAST FEEDBACK */}
      {/* ---------------------------------------------- */}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-[150] flex max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 border border-ink bg-ink px-4 py-3 text-xs text-bone shadow-xl"
        >
          <Check size={15} className="shrink-0" />

          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            aria-label="Dismiss notification"
            className="ml-2 opacity-70 transition hover:opacity-100"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
