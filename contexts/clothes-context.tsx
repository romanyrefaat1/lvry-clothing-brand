
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import clothesData from "@/public/data/lvry-clothes.json";

// Types

export type ClothingCategory =
  | "top"
  | "layer"
  | "bottom"
  | "outerwear"
  | "accessory";

export type ClothingPiece = {
  id: string;
  name: string;
  category: ClothingCategory;
  collection: string;
  image: string;
};

export type ClothingCollection = {
  codename: string;
  name: string;
  description: string;
  style: string;
  palette: string[];
};

export type PieceFilters = {
  search?: string;
  collection?: string | null;
  category?: ClothingCategory | null;
};

type SortOption = "default" | "name-asc" | "name-desc";

type ClothesContextType = {
  // Data
  pieces: ClothingPiece[];
  collections: ClothingCollection[];

  // Current filter state
  search: string;
  activeCollection: string | null;
  activeCategory: ClothingCategory | null;
  sort: SortOption;

  // Automatically filtered data
  filteredPieces: ClothingPiece[];

  // Filter controls
  setSearch: (value: string) => void;
  setCollection: (value: string | null) => void;
  setCategory: (value: ClothingCategory | null) => void;
  setSort: (value: SortOption) => void;
  clearFilters: () => void;

  // Data actions
  searchPieces: (query: string) => ClothingPiece[];
  filterPieces: (filters: PieceFilters) => ClothingPiece[];
  getPiece: (id: string) => ClothingPiece | undefined;
  getCollection: (codename: string) => ClothingCollection | undefined;
  getCollectionPieces: (codename: string) => ClothingPiece[];
};

const ClothesContext = createContext<ClothesContextType | null>(null);

const initialPieces = clothesData.pieces as ClothingPiece[];
const initialCollections = clothesData.collections as ClothingCollection[];

export function ClothesProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [activeCollection, setCollection] = useState<string | null>(null);
  const [activeCategory, setCategory] =
    useState<ClothingCategory | null>(null);
  const [sort, setSort] = useState<SortOption>("default");

  // Search independently of the current UI filters.
  const searchPieces = useCallback((query: string) => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return initialPieces;

    return initialPieces.filter((piece) =>
      piece.name.toLowerCase().includes(normalized)
    );
  }, []);

  // Apply custom filters independently of the current UI filters.
  const filterPieces = useCallback((filters: PieceFilters) => {
    let result = [...initialPieces];

    if (filters.search?.trim()) {
      const query = filters.search.trim().toLowerCase();

      result = result.filter((piece) =>
        piece.name.toLowerCase().includes(query)
      );
    }

    if (filters.collection) {
      result = result.filter(
        (piece) => piece.collection === filters.collection
      );
    }

    if (filters.category) {
      result = result.filter(
        (piece) => piece.category === filters.category
      );
    }

    return result;
  }, []);

  // Current UI filters.
  const filteredPieces = useMemo(() => {
    let result = filterPieces({
      search,
      collection: activeCollection,
      category: activeCategory,
    });

    if (sort === "name-asc") {
      result = [...result].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    if (sort === "name-desc") {
      result = [...result].sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [search, activeCollection, activeCategory, sort, filterPieces]);

  const getPiece = useCallback((id: string) => {
    return initialPieces.find((piece) => piece.id === id);
  }, []);

  const getCollection = useCallback((codename: string) => {
    return initialCollections.find(
      (collection) => collection.codename === codename
    );
  }, []);

  const getCollectionPieces = useCallback((codename: string) => {
    return initialPieces.filter(
      (piece) => piece.collection === codename
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setCollection(null);
    setCategory(null);
    setSort("default");
  }, []);

  const value = useMemo(
    () => ({
      pieces: initialPieces,
      collections: initialCollections,

      search,
      activeCollection,
      activeCategory,
      sort,
      filteredPieces,

      setSearch,
      setCollection,
      setCategory,
      setSort,
      clearFilters,

      searchPieces,
      filterPieces,
      getPiece,
      getCollection,
      getCollectionPieces,
    }),
    [
      search,
      activeCollection,
      activeCategory,
      sort,
      filteredPieces,
      clearFilters,
      searchPieces,
      filterPieces,
      getPiece,
      getCollection,
      getCollectionPieces,
    ]
  );

  return (
    <ClothesContext.Provider value={value}>
      {children}
    </ClothesContext.Provider>
  );
}

export function useClothes() {
  const context = useContext(ClothesContext);

  if (!context) {
    throw new Error(
      "useClothes must be used inside a ClothesProvider"
    );
  }

  return context;
}
