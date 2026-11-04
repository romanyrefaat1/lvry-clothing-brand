
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type DragEvent,
} from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  Copy,
  Layers,
  Plus,
  Redo2,
  RotateCcw,
  Save,
  Share2,
  Shuffle,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import { useClothes } from "@/contexts/clothes-context";
import { useBag } from "@/contexts/bag-context";

// --------------------------------------------------
// TYPES
// --------------------------------------------------

type Piece = ReturnType<typeof useClothes>["pieces"][number];

type Slot = Piece["category"];

type Category = Slot | "all";

type Background = "bone" | "kraft" | "denim" | "canvas";

type OutfitSlots = Record<Slot, string | null>;

type OutfitState = {
  slots: OutfitSlots;
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

const categories: { id: Category; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "top", label: "Tops" },
  { id: "layer", label: "Layers" },
  { id: "bottom", label: "Bottoms" },
  { id: "outerwear", label: "Outerwear" },
  { id: "accessory", label: "Accessories" },
];

const slotLabels: Record<Slot, string> = {
  top: "Top",
  layer: "Layer",
  bottom: "Bottom",
  outerwear: "Outerwear",
  accessory: "Accessory",
};

const emptySlots: OutfitSlots = {
  top: null,
  layer: null,
  bottom: null,
  outerwear: null,
  accessory: null,
};

const initialState: OutfitState = {
  slots: { ...emptySlots },
  background: "bone",
};

const backgrounds: {
  id: Background;
  label: string;
  color: string;
  textColor: string;
}[] = [
  {
    id: "bone",
    label: "Bone paper",
    color: "#EFEBE4",
    textColor: "#171613",
  },
  {
    id: "kraft",
    label: "Kraft paper",
    color: "#C9B79C",
    textColor: "#171613",
  },
  {
    id: "denim",
    label: "Denim",
    color: "#3E5C8A",
    textColor: "#EFEBE4",
  },
  {
    id: "canvas",
    label: "Canvas",
    color: "#D8CBB8",
    textColor: "#171613",
  },
];

const slotPositions: Record<Slot, string> = {
  top: "left-[28%] top-[8%] z-20 w-[42%]",
  layer: "left-[39%] top-[12%] z-30 w-[43%]",
  bottom: "left-[29%] bottom-[7%] z-10 w-[42%]",
  outerwear: "left-[8%] top-[10%] z-40 w-[45%]",
  accessory: "right-[5%] bottom-[22%] z-50 w-[24%]",
};

function getCategoryLabel(category: string) {
  return slotLabels[category as Slot] ?? category;
}

function encodeOutfit(outfit: OutfitState) {
  return btoa(
    encodeURIComponent(
      JSON.stringify(outfit),
    ),
  );
}

function decodeOutfit(value: string): unknown {
  return JSON.parse(
    decodeURIComponent(
      atob(value),
    ),
  );
}

// --------------------------------------------------
// PRODUCT CARD
// --------------------------------------------------

function ProductCard({
  piece,
  isSelected,
  onSelect,
  onDragStart,
}: {
  piece: Piece;
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
        isSelected
          ? "opacity-100"
          : "opacity-90 hover:opacity-100"
      }`}
    >
      <div
        className={`relative aspect-[4/4.7] overflow-hidden border p-3 transition-all duration-300 ${
          isSelected
            ? "border-ink bg-[#EAE5DC]"
            : "border-transparent bg-[#F2EFEA] hover:border-ink/40"
        }`}
      >
        <Image
          src={piece.image}
          alt={piece.name}
          fill
          sizes="(max-width: 640px) 45vw, 240px"
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.05]"
          draggable={false}
        />

        <span className="absolute left-3 top-3 font-mono text-[9px] text-muted">
          {piece.collection}
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
          <p className="text-xs font-medium">{piece.name}</p>

          <p className="mt-1 font-mono text-[10px] text-muted">
            {getCategoryLabel(piece.category)}
          </p>
        </div>

        {isSelected && (
          <span className="mt-0.5 shrink-0 font-mono text-[9px] text-muted">
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
  const {
    pieces,
    collections,
  } = useClothes();

  const {addItem} = useBag()

  const [outfit, setOutfit] = useState<OutfitState>(initialState);

  const [history, setHistory] = useState<HistoryState>({
    past: [],
    future: [],
  });

  const [activeCategory, setActiveCategory] =
    useState<Category>("all");

  const [selectedSlot, setSelectedSlot] =
    useState<Slot>("top");

  const [savedOutfits, setSavedOutfits] =
    useState<SavedOutfit[]>([]);

  const [ready, setReady] = useState(false);
  const [message, setMessage] = useState("");

  const [saveDialog, setSaveDialog] = useState(false);
  const [outfitName, setOutfitName] = useState("");

  const [showSaved, setShowSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);

  // ------------------------------------------------
  // CATALOG LOOKUPS
  // ------------------------------------------------

  const piecesById = useMemo(
    () => new Map(pieces.map((piece) => [piece.id, piece])),
    [pieces],
  );

  const collectionsByCodename = useMemo(
    () =>
      new Map(
        collections.map((collection) => [
          collection.codename,
          collection,
        ]),
      ),
    [collections],
  );

  function getPiece(id: string | null): Piece | undefined {
    if (!id) return undefined;
    return piecesById.get(id);
  }

  function getCollectionName(codename: string) {
    return (
      collectionsByCodename.get(codename)?.name ??
      codename
    );
  }

  // ------------------------------------------------
  // DERIVED STATE
  // ------------------------------------------------

  const selectedProducts = useMemo(
    () =>
      (Object.entries(outfit.slots) as [Slot, string | null][])
        .map(([slot, id]) => {
          const piece = id ? piecesById.get(id) : undefined;

          return piece ? { slot, piece } : null;
        })
        .filter(
          (
            item,
          ): item is {
            slot: Slot;
            piece: Piece;
          } => item !== null,
        ),
    [outfit.slots, piecesById],
  );

  const visibleProducts = useMemo(
    () =>
      pieces.filter(
        (piece) =>
          activeCategory === "all" ||
          piece.category === activeCategory,
      ),
    [pieces, activeCategory],
  );

  const selectedBackground =
    backgrounds.find(
      (item) => item.id === outfit.background,
    ) ?? backgrounds[0];

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // ------------------------------------------------
  // HISTORY
  // ------------------------------------------------

  const updateOutfit = useCallback(
    (updater: (current: OutfitState) => OutfitState) => {
      setOutfit((current) => {
        const next = updater(current);

        if (JSON.stringify(current) === JSON.stringify(next)) {
          return current;
        }

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
    setMessage("");
  }

  function redo() {
    if (!canRedo) return;

    const next = history.future[0];

    setHistory((current) => ({
      past: [...current.past, outfit],
      future: current.future.slice(1),
    }));

    setOutfit(next);
    setMessage("");
  }

  // ------------------------------------------------
  // VALIDATION
  // ------------------------------------------------

  function validateOutfit(value: unknown): OutfitState | null {
    if (!value || typeof value !== "object") {
      return null;
    }

    const data = value as {
      slots?: Record<string, unknown>;
      background?: unknown;
    };

    const validSlots: OutfitSlots = { ...emptySlots };

    for (const slot of Object.keys(slotLabels) as Slot[]) {
      const id = data.slots?.[slot];

      if (typeof id !== "string") continue;

      const piece = piecesById.get(id);

      if (piece && piece.category === slot) {
        validSlots[slot] = id;
      }
    }

    const validBackground = backgrounds.some(
      (item) => item.id === data.background,
    )
      ? (data.background as Background)
      : "bone";

    return {
      slots: validSlots,
      background: validBackground,
    };
  }

  function validateSavedOutfits(value: unknown): SavedOutfit[] {
    if (!Array.isArray(value)) return [];

    return value
      .map((item): SavedOutfit | null => {
        if (!item || typeof item !== "object") return null;

        const data = item as {
          id?: unknown;
          name?: unknown;
          createdAt?: unknown;
          slots?: Record<string, unknown>;
          background?: unknown;
        };

        const validated = validateOutfit(data);

        if (
          !validated ||
          typeof data.id !== "string" ||
          typeof data.name !== "string"
        ) {
          return null;
        }

        return {
          ...validated,
          id: data.id,
          name: data.name,
          createdAt:
            typeof data.createdAt === "number"
              ? data.createdAt
              : Date.now(),
        };
      })
      .filter(
        (item): item is SavedOutfit => item !== null,
      );
  }

  // ------------------------------------------------
  // INITIALIZATION
  // ------------------------------------------------

  useEffect(() => {
    if (pieces.length === 0) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setSavedOutfits(
          validateSavedOutfits(JSON.parse(saved)),
        );
      }

      const params = new URLSearchParams(
        window.location.search,
      );

      const shared = params.get("outfit");

      if (shared) {
        const decoded = decodeOutfit(shared);
        const validated = validateOutfit(decoded);

        if (validated) {
          setOutfit(validated);
          setMessage("Shared outfit loaded.");
        }
      }
    } catch {
      setMessage("Couldn't load the saved outfit.");
    } finally {
      setReady(true);
    }
    // Catalog is loaded by the context. Initialize once it exists.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pieces.length]);

  // ------------------------------------------------
  // ACTIONS
  // ------------------------------------------------

  function selectPiece(piece: Piece) {
    const slot = piece.category as Slot;

    updateOutfit((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [slot]:
          current.slots[slot] === piece.id
            ? null
            : piece.id,
      },
    }));

    setSelectedSlot(slot);
    setMessage("");
  }

  function removePiece(slot: Slot) {
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
    piece: Piece,
  ) {
    event.dataTransfer.setData("text/plain", piece.id);
    event.dataTransfer.effectAllowed = "copy";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const pieceId = event.dataTransfer.getData("text/plain");
    const piece = getPiece(pieceId);

    if (!piece) return;

    const slot = piece.category as Slot;

    updateOutfit((current) => ({
      ...current,
      slots: {
        ...current.slots,
        [slot]: piece.id,
      },
    }));

    setSelectedSlot(slot);
    setMessage(`${piece.name} added.`);
  }

  function changeBackground(background: Background) {
    updateOutfit((current) => ({
      ...current,
      background,
    }));
  }

  function resetOutfit() {
    updateOutfit(() => ({
      slots: { ...emptySlots },
      background: "bone",
    }));

    setMessage("Canvas cleared.");
  }

  function randomOutfit() {
    const shuffled = [...pieces].sort(
      () => Math.random() - 0.5,
    );

    const slots: OutfitSlots = { ...emptySlots };

    for (const piece of shuffled) {
      const slot = piece.category as Slot;

      if (!slots[slot]) {
        slots[slot] = piece.id;
      }
    }

    updateOutfit((current) => ({
      ...current,
      slots,
    }));

    setMessage("A new combination.");
  }

  // ------------------------------------------------
  // SAVING
  // ------------------------------------------------

  function persistSavedOutfits(updated: SavedOutfit[]) {
    setSavedOutfits(updated);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updated),
      );
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
      background: outfit.background,
      createdAt: Date.now(),
    };

    persistSavedOutfits(
      [saved, ...savedOutfits].slice(0, 12),
    );

    setSaveDialog(false);
    setMessage("Your uniform has been saved.");
  }

  function loadOutfit(saved: SavedOutfit) {
    updateOutfit(() => ({
      slots: { ...emptySlots, ...saved.slots },
      background: saved.background ?? "bone",
    }));

    setShowSaved(false);
    setShowReview(false);
    setMessage(`${saved.name} loaded.`);
  }

  function deleteOutfit(id: string) {
    persistSavedOutfits(
      savedOutfits.filter((item) => item.id !== id),
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

    const url = new URL(window.location.href);

    url.searchParams.set(
      "outfit",
      encodeOutfit(outfit),
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

  function handleAddToBag() {
  if (selectedProducts.length === 0) {
    setMessage("Add at least one piece first.");
    return;
  }

  selectedProducts.forEach(({ piece }) => {
    addItem(piece);
  });

  setMessage(
    `${selectedProducts.length} ${
      selectedProducts.length === 1 ? "piece" : "pieces"
    } added to bag.`,
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
                {selectedProducts.length} of 5 pieces
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
                onClick={randomOutfit}
                className="inline-flex items-center gap-2 px-2 py-2 text-[11px] text-muted transition hover:text-ink"
              >
                <Shuffle size={13} />
                Random
              </button>

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

            <div className="absolute left-5 top-5 z-[60]">
              <p className="font-mono text-[9px] tracking-[0.16em] opacity-60">
                LVRY / DAILY STUDY
              </p>

              <p className="mt-1 text-xs">
                Uniform no. 01
              </p>
            </div>

            <div className="absolute right-5 top-5 z-[60] text-right">
              <p className="font-mono text-[9px] tracking-[0.16em] opacity-60">
                THE EVERYDAY UNIFORM
              </p>

              <p className="mt-1 text-xs">
                {selectedProducts.length} pieces
              </p>
            </div>

            {/* Garments */}

            {(Object.keys(slotLabels) as Slot[]).map((slot) => {
              const piece = getPiece(outfit.slots[slot]);
              const active = selectedSlot === slot;

              return (
                <div
                  key={slot}
                  className={`absolute ${slotPositions[slot]} flex min-h-[90px] items-center justify-center transition-all duration-500 ${
                    active ? "z-[55]" : ""
                  }`}
                >
                  {piece ? (
                    <div
                      className={`group relative w-full transition-all duration-300 ${
                        active
                          ? "scale-[1.025]"
                          : "hover:scale-[1.025]"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedSlot(slot);
                          setActiveCategory(slot);
                        }}
                        aria-label={`Inspect ${piece.name}`}
                        className={`relative block aspect-[4/4.5] w-full ${
                          active
                            ? "outline outline-1 outline-dashed outline-current/40 outline-offset-2"
                            : ""
                        }`}
                      >
                        <Image
                          src={piece.image}
                          alt={piece.name}
                          fill
                          sizes="(max-width: 1024px) 45vw, 400px"
                          className="object-contain drop-shadow-[3px_7px_4px_rgba(17,17,17,0.12)]"
                          draggable={false}
                        />
                      </button>

                      <div
                        className={`absolute -bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap border border-black/10 bg-white/95 px-2 py-1.5 text-[9px] text-ink shadow-sm transition ${
                          active
                            ? "opacity-100"
                            : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {piece.name}

                        <button
                          type="button"
                          onClick={() => removePiece(slot)}
                          aria-label={`Remove ${piece.name}`}
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
                        active
                          ? "border-current/70 bg-black/[0.025]"
                          : ""
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

            <div className="absolute bottom-5 left-5 z-[60]">
              <p className="handwritten text-xl">
                Made to repeat.
              </p>
            </div>

            <div className="absolute bottom-5 right-5 z-[60] text-right">
              <p className="font-mono text-[9px] tracking-widest opacity-60">
                LVRY / 001
              </p>

              <p className="mt-1 text-[10px]">
                Pieces of a uniform.
              </p>
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

          {visibleProducts.length === 0 ? (
            <div className="border border-dashed border-border px-4 py-12 text-center">
              <p className="text-xs">
                No pieces in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4">
              {visibleProducts.map((piece) => (
                <ProductCard
                  key={piece.id}
                  piece={piece}
                  isSelected={
                    outfit.slots[piece.category as Slot] === piece.id
                  }
                  onSelect={() => selectPiece(piece)}
                  onDragStart={(event) =>
                    handleDragStart(event, piece)
                  }
                />
              ))}
            </div>
          )}

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
                {selectedProducts.length} / 5
              </span>
            </div>

            {selectedProducts.length === 0 ? (
              <div className="border border-dashed border-border px-4 py-8 text-center">
                <Plus
                  size={19}
                  className="mx-auto mb-3 text-muted"
                  strokeWidth={1.5}
                />

                <p className="text-xs">
                  Your uniform starts here.
                </p>

                <p className="mt-1 text-[10px] text-muted">
                  Pick a piece from the collection.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedProducts.map(({ slot, piece }) => (
                  <div
                    key={piece.id}
                    className="flex items-center gap-3 border-b border-border pb-3 last:border-0"
                  >
                    <div className="relative h-[65px] w-[55px] shrink-0 bg-[#F2EFEA] p-2">
                      <Image
                        src={piece.image}
                        alt={piece.name}
                        fill
                        sizes="55px"
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium">
                        {piece.name}
                      </p>

                      <p className="mt-1 font-mono text-[9px] text-muted">
                        {slotLabels[slot]} /{" "}
                        {getCollectionName(piece.collection)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removePiece(slot)}
                      aria-label={`Remove ${piece.name}`}
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
              onClick={handleAddToBag}
              disabled={selectedProducts.length === 0}
              className="flex w-full items-center justify-center gap-2 bg-ink px-5 py-4 text-xs text-bone transition hover:bg-signal hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              Add uniform to bag
              <span className="font-mono">
                ({selectedProducts.length})
              </span>
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-muted">
              No size selection is required for these pieces.
            </p>
          </div>
        </section>
      </div>

      {/* REVIEW DIALOG */}

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
                <p className="eyebrow">
                  LVRY / YOUR SELECTION
                </p>

                <h2
                  id="review-title"
                  className="display-heading mt-2 text-3xl"
                >
                  The final edit.
                </h2>

                <p className="mt-2 text-xs text-muted">
                  Check the pieces you've selected.
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
              {selectedProducts.map(({ slot, piece }) => (
                <div
                  key={piece.id}
                  className="flex items-center gap-4 border-b border-border pb-4"
                >
                  <div className="relative h-20 w-16 shrink-0 bg-[#EFEBE4] p-2">
                    <Image
                      src={piece.image}
                      alt={piece.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {piece.name}
                    </p>

                    <p className="mt-1 font-mono text-[10px] text-muted">
                      {slotLabels[slot]} /{" "}
                      {getCollectionName(piece.collection)}
                    </p>

                    <Link
                      href={`/shop/${piece.id}`}
                      className="mt-2 inline-block text-[10px] underline underline-offset-4"
                    >
                      View piece
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => removePiece(slot)}
                    aria-label={`Remove ${piece.name}`}
                    className="p-2 text-muted hover:text-signal"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between text-xs">
              <span className="text-muted">
                Pieces selected
              </span>

              <span className="font-mono">
                {selectedProducts.length} / 5
              </span>
            </div>

            <p className="mt-5 text-[11px] leading-5 text-muted">
  Your selected pieces will be added to your bag.
  Product sizing and availability are not currently specified.
</p>

            <button
              type="button"
              onClick={() => setShowReview(false)}
              className="mt-6 flex w-full items-center justify-center gap-2 bg-ink px-5 py-4 text-xs text-bone transition hover:bg-signal hover:text-ink"
            >
              Back to the canvas
              <ArrowRight size={14} />
            </button>
          </section>
        </div>
      )}

      {/* SAVE DIALOG */}

      {saveDialog && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="save-title"
            className="w-full max-w-md bg-[#F8F6F2] p-6 shadow-2xl md:p-8"
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="eyebrow">
                KEEP SOMETHING GOOD
              </p>

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
              onChange={(event) =>
                setOutfitName(event.target.value)
              }
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

      {/* SAVED OUTFITS */}

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
                <p className="eyebrow">
                  YOUR PERSONAL COLLECTION
                </p>

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
                      .map(([, id]) => getPiece(id))
                      .filter(
                        (piece): piece is Piece =>
                          piece !== undefined,
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
                          {savedProducts.map((piece) => (
                            <div
                              key={piece.id}
                              className="relative flex h-16 w-14 items-center justify-center bg-[#EFEBE4] p-2"
                            >
                              <Image
                                src={piece.image}
                                alt={piece.name}
                                fill
                                sizes="56px"
                                className="object-contain p-1"
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

      {/* TOAST FEEDBACK */}

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
