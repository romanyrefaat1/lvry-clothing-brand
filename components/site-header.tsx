"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/button";
import { useBag } from "@/contexts/bag-context";
import { useClothes } from "@/contexts/clothes-context";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Build a uniform", href: "/build" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];

const suggestions = ["Relaxed tee", "Overshirt", "Trousers", "Outerwear"];

const RECENT_SEARCHES_KEY = "lvry-recent-searches";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const { itemCount, isReady } = useBag();
  const { pieces } = useClothes();

  const normalizedSearch = search.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalizedSearch) return [];

    return pieces
      .filter((piece) => {
        const searchableText = [
          piece.name,
          piece.category,
          piece.collection,
          piece.id,
        ]
          .join(" ")
          .replace(/[-_]/g, " ")
          .toLowerCase();

        return searchableText.includes(normalizedSearch);
      })
      .slice(0, 6);
  }, [pieces, normalizedSearch]);

  const activeResult = results[activeIndex];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setRecentSearches(
            parsed
              .filter(
                (value): value is string => typeof value === "string"
              )
              .slice(0, 5)
          );
        }
      }
    } catch {
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    if (!searchOpen) return;

    const timeout = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);

    return () => window.clearTimeout(timeout);
  }, [searchOpen]);

  useEffect(() => {
    function handleGlobalKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if (event.key === "/" && !isTyping && !searchOpen) {
        event.preventDefault();
        setMenuOpen(false);
        setSearchOpen(true);
      }

      if (event.key === "Escape") {
        setSearchOpen(false);
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [search]);

  function closeSearch() {
    setSearchOpen(false);
    setSearch("");
    setActiveIndex(0);
  }

  function saveRecentSearch(value: string) {
    const trimmed = value.trim();

    if (!trimmed) return;

    const updated = [
      trimmed,
      ...recentSearches.filter(
        (item) => item.toLowerCase() !== trimmed.toLowerCase()
      ),
    ].slice(0, 5);

    setRecentSearches(updated);

    try {
      localStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updated)
      );
    } catch {
      // Search still works if local storage is unavailable.
    }
  }

  function clearRecentSearches() {
    setRecentSearches([]);

    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore unavailable storage.
    }
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (results.length) {
        setActiveIndex((current) =>
          Math.min(current + 1, results.length - 1)
        );
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (results.length) {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    }

    if (event.key === "Enter") {
      if (activeResult) {
        saveRecentSearch(search);
        window.location.href = `/shop/${activeResult.id}`;
      } else if (search.trim()) {
        saveRecentSearch(search);
        window.location.href = `/shop?search=${encodeURIComponent(
          search.trim()
        )}`;
      }
    }
  }

  function openSearch() {
    setMenuOpen(false);
    setSearchOpen(true);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-bone">
        <div className="lvry-container flex h-[var(--nav-height)] items-center justify-between">
          <Link
            href="/"
            aria-label="LVRY home"
            className="font-display text-[2rem] font-bold tracking-[-0.09em]"
          >
            LVRY<span className="text-signal">.</span>
          </Link>

          {/* DESKTOP NAVIGATION */}

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 md:flex"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.8rem] font-medium transition-opacity hover:opacity-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-7 md:flex">
            <Button
              type="button"
              variant="secondary"
              onClick={openSearch}
              aria-label="Search products"
              className="!min-h-0 !gap-2 !border-0 !bg-transparent !px-0 !py-0 !shadow-none !text-[0.8rem] hover:!translate-y-0 hover:!bg-transparent hover:!text-ink hover:!opacity-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-4 w-4"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              Search
              <span className="font-mono text-[9px] text-muted">
                /
              </span>
            </Button>

            <Link
              href="/bag"
              className="flex items-center gap-2 text-xs transition-opacity hover:opacity-60"
              aria-label={`Shopping bag, ${isReady ? itemCount : 0} items`}
            >
              Bag
              <span className="font-mono text-signal">
                ({isReady ? itemCount.toString().padStart(2, "0") : "—"})
              </span>
            </Link>
          </div>

          {/* MOBILE CONTROLS */}

          <div className="flex items-center gap-5 md:hidden">
            <Button
              type="button"
              variant="secondary"
              onClick={openSearch}
              aria-label="Search products"
              className="!min-h-10 !w-8 !justify-center !gap-0 !border-0 !bg-transparent !p-0 !shadow-none hover:!translate-y-0 hover:!bg-transparent hover:!text-ink"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-5 w-5"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>
            </Button>

            <Link
              href="/bag"
              className="text-xs"
              aria-label={`Shopping bag, ${isReady ? itemCount : 0} items`}
            >
              Bag
              <span className="ml-1 font-mono text-signal">
                ({isReady ? itemCount : "—"})
              </span>
            </Link>

            <Button
              type="button"
              variant="secondary"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((open) => !open)}
              className="!min-h-10 !gap-3 !border-0 !bg-transparent !px-0 !py-0 !shadow-none !text-xs hover:!translate-y-0 hover:!bg-transparent hover:!text-ink"
            >
              <span>{menuOpen ? "Close" : "Menu"}</span>

              <span className="flex w-5 flex-col gap-[5px]">
                <span
                  className={`h-px w-full bg-ink transition-transform ${
                    menuOpen ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-full bg-ink transition-transform ${
                    menuOpen ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </span>
            </Button>
          </div>
        </div>

        {/* MOBILE MENU */}

        {menuOpen && (
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="absolute left-0 top-full w-full border-b border-border bg-bone px-[var(--page-gutter)] pb-8 pt-5 shadow-paper md:hidden"
          >
            <div className="flex flex-col">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between border-b border-border py-4 font-display text-2xl tracking-tight"
                >
                  <span>{link.label}</span>
                  <span className="font-mono text-xs text-muted">
                    0{index + 1}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-6 flex gap-7 text-sm text-muted">
              <Button
                type="button"
                variant="secondary"
                onClick={openSearch}
                className="!min-h-0 !border-0 !bg-transparent !px-0 !py-0 !shadow-none !text-sm !text-muted hover:!translate-y-0 hover:!bg-transparent hover:!text-ink"
                // className="!hover:bg-transparent"
              >
                Search
              </Button>

              <Link
                href="/bag"
                onClick={() => setMenuOpen(false)}
              >
                Bag ({isReady ? itemCount : "—"})
              </Link>
            </div>
          </nav>
        )}
      </header>

      {/* SEARCH OVERLAY */}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/50 px-4 pt-[12vh] backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSearch();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-heading"
            className="w-full max-w-2xl border border-border bg-bone shadow-2xl"
          >
            {/* SEARCH INPUT */}

            <div className="flex items-center gap-4 border-b border-border px-5 py-5 sm:px-7">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-5 w-5 shrink-0 text-muted"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4.5 4.5" />
              </svg>

              <input
                ref={searchInputRef}
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search LVRY..."
                aria-label="Search pieces, colors and categories"
                aria-describedby="search-shortcuts"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted sm:text-lg"
              />

              <Button
                type="button"
                variant="secondary"
                onClick={closeSearch}
                aria-label="Close search"
                className="!min-h-0 !shrink-0 !px-2 !py-1 !text-[10px] !font-mono !text-muted"
              >
                ESC
              </Button>
            </div>

            <div className="max-h-[65vh] overflow-y-auto px-5 py-6 sm:px-7">
              <h2
                id="search-heading"
                className="font-mono text-[9px] uppercase tracking-wider text-muted"
              >
                {normalizedSearch
                  ? `${results.length} ${
                      results.length === 1 ? "result" : "results"
                    }`
                  : "Looking for something?"}
              </h2>

              {/* SEARCH RESULTS */}

              {normalizedSearch ? (
                results.length > 0 ? (
                  <div className="mt-4">
                    {results.map((piece, index) => (
                      <Link
                        key={piece.id}
                        href={`/shop/${piece.id}`}
                        onClick={() => {
                          saveRecentSearch(search);
                          closeSearch();
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-center justify-between gap-4 border-b border-border px-3 py-4 transition-colors ${
                          activeIndex === index
                            ? "bg-surface"
                            : "hover:bg-surface"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {piece.name}
                          </p>

                          <p className="mt-1 font-mono text-[9px] uppercase text-muted">
                            {piece.category.replace(/-/g, " ")}
                          </p>
                        </div>

                        <span className="shrink-0 font-mono text-xs text-muted">
                          ↗
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <p className="display-heading text-3xl">
                      Nothing came up<span className="text-signal">.</span>
                    </p>

                    <p className="mt-3 text-xs text-muted">
                      Try a different word.
                    </p>
                  </div>
                )
              ) : (
                <>
                  {/* SUGGESTED SEARCHES */}

                  <div className="mt-5">
                    <p className="mb-3 text-xs text-muted">
                      Suggested searches
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {suggestions.map((suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          variant="secondary"
                          onClick={() => setSearch(suggestion)}
                          className="!min-h-0 !px-3 !py-2 !text-xs !shadow-none hover:!translate-y-0"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* RECENT SEARCHES */}

                  {recentSearches.length > 0 && (
                    <div className="mt-8">
                      <div className="mb-3 flex items-center justify-between">
                        <p className="text-xs text-muted">
                          Recent searches
                        </p>

                        <Button
                          type="button"
                          variant="secondary"
                          onClick={clearRecentSearches}
                          className="!min-h-0 !border-0 !bg-transparent !px-0 !py-0 !text-[10px] !text-muted !underline !shadow-none hover:!translate-y-0 hover:!bg-transparent hover:!text-ink"
                        >
                          Clear history
                        </Button>
                      </div>

                      <div className="flex flex-col">
                        {recentSearches.map((recent) => (
                          <Button
                            key={recent}
                            type="button"
                            variant="secondary"
                            onClick={() => setSearch(recent)}
                            className="!min-h-0 !w-full !justify-start !gap-3 !border-0 !border-b !border-border !bg-transparent !px-0 !py-3 !text-left !text-sm !font-normal !shadow-none hover:!translate-y-0 hover:!bg-transparent hover:!opacity-50"
                          >
                            <span className="font-mono text-xs text-muted">
                              ↗
                            </span>
                            {recent}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* KEYBOARD HINTS */}

            <div
              id="search-shortcuts"
              className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-4 font-mono text-[9px] uppercase text-muted sm:px-7"
            >
              <div className="flex gap-4">
                <span>↑ ↓ Navigate</span>
                <span>↵ Open</span>
              </div>

              <span>ESC Close</span>
            </div>
          </section>
        </div>
      )}
    </>
  );
}