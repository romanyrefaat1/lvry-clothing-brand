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

export type BagProduct = {
  id: string;
  name: string;
  slug: string;
  color: string;
  colorHex: string;
};

export type BagItem = {
  product: BagProduct;
  size: string;
  quantity: number;
};

type BagContextValue = {
  items: BagItem[];
  itemCount: number;
  addItem: (product: BagProduct, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearBag: () => void;
  isReady: boolean;
};

const BagContext = createContext<BagContextValue | null>(null);
const STORAGE_KEY = "lvry-bag";

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Load the saved bag once when the app starts.
  useEffect(() => {
    try {
      const savedBag = localStorage.getItem(STORAGE_KEY);

      if (savedBag) {
        const parsed = JSON.parse(savedBag);

        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore invalid or unavailable local storage.
    } finally {
      setIsReady(true);
    }
  }, []);

  // Persist changes only after the initial load is complete.
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // The bag remains usable in memory if storage is unavailable.
    }
  }, [items, isReady]);

  const addItem = useCallback((product: BagProduct, size: string) => {
    setItems((current) => {
      const existing = current.find(
        (item) => item.product.id === product.id && item.size === size,
      );

      if (existing) {
        return current.map((item) =>
          item.product.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { product, size, quantity: 1 }];
    });
  }, []);

  const updateQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      if (quantity <= 0) {
        setItems((current) =>
          current.filter(
            (item) =>
              !(item.product.id === productId && item.size === size),
          ),
        );
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.product.id === productId && item.size === size
            ? { ...item, quantity }
            : item,
        ),
      );
    },
    [],
  );

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((current) =>
      current.filter(
        (item) => !(item.product.id === productId && item.size === size),
      ),
    );
  }, []);

  const clearBag = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
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
    throw new Error("useBag must be used inside a BagProvider.");
  }

  return context;
}