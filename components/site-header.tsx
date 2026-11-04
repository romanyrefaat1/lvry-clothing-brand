"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { label: "Shop", href: "/shop" },
  { label: "Build a uniform", href: "/build" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" },
];
import { useBag } from "@/contexts/bag-context";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, isReady } = useBag();

  return (
    <header className="relative z-50 border-b border-border bg-bone">
      <div className="lvry-container flex h-[var(--nav-height)] items-center justify-between">
        <Link
          href="/"
          aria-label="LVRY home"
          className="font-display text-[2rem] font-bold tracking-[-0.09em]"
        >
          LVRY<span className="text-signal">.</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-9 md:flex">
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
          <Link
            href="/shop"
            className="text-[0.8rem] transition-opacity hover:opacity-50"
          >
            Search
          </Link>
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

        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 items-center gap-3 text-xs md:hidden"
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
        </button>
      </div>

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
            <Link href="/shop" onClick={() => setMenuOpen(false)}>
              Search
            </Link>
            <Link href="/bag" onClick={() => setMenuOpen(false)}>
              Bag (0)
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}