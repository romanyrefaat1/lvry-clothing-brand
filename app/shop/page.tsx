import { Suspense } from "react";

import { ShopPage } from "@/components/shop-page";

function ShopLoading() {
  return (
    <main className="lvry-container min-h-screen py-20">
      <div className="h-3 w-24 animate-pulse bg-border" />
      <div className="mt-8 h-16 w-64 animate-pulse bg-border" />
      <div className="mt-5 h-4 w-80 max-w-full animate-pulse bg-border" />

      <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/5] animate-pulse bg-surface"
          />
        ))}
      </div>
    </main>
  );
}

export default function ShopRoute() {
  return (
    <>

      <Suspense fallback={<ShopLoading />}>
        <ShopPage />
      </Suspense>

    </>
  );
}