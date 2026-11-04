
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import clothesData from "@/public/data/lvry-clothes.json";
import type { ClothingPiece } from "@/contexts/clothes-context";

export type BagProduct = ClothingPiece;

export type BagItem = {
  product: BagProduct;
  quantity: number;
};

type BagContextValue = {
  items: BagItem[];
  itemCount: number;

  addItem: (product: BagProduct) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearBag: () => void;

  isReady: boolean;
};

const BagContext = createContext<BagContextValue | null>(null);

const STORAGE_KEY = "lvry-bag";

const catalog = clothesData.pieces as ClothingPiece[];

const catalogById = new Map(
  catalog.map((piece) => [piece.id, piece]),
);

// Normalize both the new format and previously saved bag data.
function normalizeBag(saved: unknown): BagItem[] {
  if (!Array.isArray(saved)) return [];

  const normalized = new Map<string, BagItem>();

  for (const entry of saved) {
    if (!entry || typeof entry !== "object") continue;

    const record = entry as {
      product?: { id?: unknown };
      piece?: { id?: unknown };
      quantity?: unknown;
    };

    const productId =
      typeof record.product?.id === "string"
        ? record.product.id
        : typeof record.piece?.id === "string"
          ? record.piece.id
          : null;

    if (!productId) continue;

    // Always use the latest canonical catalog data.
    const product = catalogById.get(productId);

    if (!product) continue;

    const quantity = Number(record.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) continue;

    const safeQuantity = Math.floor(quantity);

    const existing = normalized.get(productId);

    if (existing) {
      existing.quantity += safeQuantity;
    } else {
      normalized.set(productId, {
        product,
        quantity: safeQuantity,
      });
    }
  }

  return Array.from(normalized.values());
}

export function BagProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load and normalize the existing bag.
  useEffect(() => {
    try {
      const savedBag = localStorage.getItem(STORAGE_KEY);

      if (savedBag) {
        const parsed: unknown = JSON.parse(savedBag);
        setItems(normalizeBag(parsed));
      }
    } catch {
      // Invalid or unavailable storage.
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  // Persist only after hydration.
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items),
      );
    } catch {
      // The bag remains usable in memory.
    }
  }, [items, isReady]);

  const addItem = useCallback((product: BagProduct) => {
    const canonicalProduct = catalogById.get(product.id);

    if (!canonicalProduct) return;

    setItems((current) => {
      const existing = current.find(
        (item) => item.product.id === canonicalProduct.id,
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === canonicalProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [
        ...current,
        {
          product: canonicalProduct,
          quantity: 1,
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      const safeQuantity = Math.floor(quantity);

      if (!Number.isFinite(safeQuantity) || safeQuantity <= 0) {
        setItems((current) =>
          current.filter(
            (item) => item.product.id !== productId,
          ),
        );

        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.product.id === productId
            ? { ...item, quantity: safeQuantity }
            : item,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string) => {
    setItems((current) =>
      current.filter(
        (item) => item.product.id !== productId,
      ),
    );
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () =>
      items.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearBag,
      isReady,
    }),
    [
      items,
      itemCount,
      addItem,
      updateQuantity,
      removeItem,
      clearBag,
      isReady,
    ],
  );

  return (
    <BagContext.Provider value={value}>
      {children}
    </BagContext.Provider>
  );
}

export function useBag() {
  const context = useContext(BagContext);

  if (!context) {
    throw new Error(
      "useBag must be used inside a BagProvider.",
    );
  }

  return context;
}
