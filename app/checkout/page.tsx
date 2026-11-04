
"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useBag, type BagItem } from "@/contexts/bag-context";

type CustomerDetails = {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  apartment: string;
  city: string;
  postalCode: string;
  notes: string;
};

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | null;
};

type CompletedOrder = {
  id: string;
  createdAt: string;
  status: "demo";
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  total: number;
};

const ORDERS_KEY = "lvry_orders";

const emptyDetails: CustomerDetails = {
  email: "",
  fullName: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  postalCode: "",
  notes: "",
};

// Adapt these helpers to your ClothingPiece schema if necessary.
function getProductData(item: BagItem) {
  const product = item.product as unknown as Record<string, unknown>;

  const name =
    (typeof product.name === "string" && product.name) ||
    (typeof product.title === "string" && product.title) ||
    item.product.id;

  const rawPrice =
    product.price

  const parsedPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : typeof rawPrice === "string"
        ? Number(rawPrice.replace(/[^\d.-]/g, ""))
        : NaN;

  const rawImage =
    product.image ??
    product.imageUrl ??
    product.image_url ??
    (Array.isArray(product.images) ? product.images[0] : null);

  const image =
    typeof rawImage === "string" ? rawImage : null;

  return {
    id: item.product.id,
    name,
    price: Number.isFinite(parsedPrice) ? parsedPrice : null,
    image,
    quantity: item.quantity,
  };
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

function makeOrderId() {
  return `LVRY-${Date.now().toString().slice(-8)}`;
}

function getSavedOrders(): CompletedOrder[] {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (!saved) return [];

    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function CheckoutPage() {
  const router = useRouter();

  const {
    items,
    updateQuantity,
    removeItem,
    isReady,
  } = useBag();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [step, setStep] = useState<1 | 2>(1);
  const [details, setDetails] = useState<CustomerDetails>(emptyDetails);
  const [completedOrder, setCompletedOrder] =
    useState<CompletedOrder | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const initialized = useRef(false);

  // Select everything by default, but let the customer deselect pieces.
  useEffect(() => {
    if (!isReady || initialized.current) return;

    setSelectedIds(items.map((item) => item.product.id));
    initialized.current = true;
  }, [isReady, items]);

  // Keep selections synchronized if an item is removed from the bag.
  useEffect(() => {
    const bagIds = new Set(items.map((item) => item.product.id));

    setSelectedIds((current) =>
      current.filter((id) => bagIds.has(id)),
    );
  }, [items]);

  const selectedItems = useMemo(
    () =>
      items.filter((item) =>
        selectedIds.includes(item.product.id),
      ),
    [items, selectedIds],
  );

  const productData = useMemo(
    () => selectedItems.map(getProductData),
    [selectedItems],
  );

  const subtotal = productData.reduce(
    (total, item) =>
      total + (item.price ?? 0) * item.quantity,
    0,
  );

  const hasUnavailablePrices = productData.some(
    (item) => item.price === null,
  );

  const selectedCount = selectedItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const allSelected =
    items.length > 0 && selectedItems.length === items.length;

  function toggleItem(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  }

  function toggleAll() {
    setSelectedIds(
      allSelected
        ? []
        : items.map((item) => item.product.id),
    );
  }

  function updateField(
    field: keyof CustomerDetails,
    value: string,
  ) {
    setDetails((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function continueToDetails() {
    if (selectedItems.length === 0 || hasUnavailablePrices) return;

    setError("");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goBack() {
    setError("");
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function placeOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submitting || selectedItems.length === 0) return;

    setError("");
    setSubmitting(true);

    try {
      const orderItems: OrderItem[] = productData.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price!,
        quantity: item.quantity,
        image: item.image,
      }));

      const order: CompletedOrder = {
        id: makeOrderId(),
        createdAt: new Date().toISOString(),
        status: "demo",
        customer: { ...details },
        items: orderItems,
        subtotal,
        total: subtotal,
      };

      // Save the order BEFORE modifying the bag.
      const previousOrders = getSavedOrders();

      localStorage.setItem(
        ORDERS_KEY,
        JSON.stringify([order, ...previousOrders]),
      );

      // Remove only the products included in this order.
      selectedItems.forEach((item) => {
        removeItem(item.product.id);
      });

      setCompletedOrder(order);
      setSubmitting(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError(
        "We couldn't save your demo order. Your bag hasn't been cleared. Please try again.",
      );
      setSubmitting(false);
    }
  }

  if (!isReady) {
    return (
      <main className="min-h-screen bg-[#EFEBE4] px-6 py-32 text-[#111]">
        <p className="text-center font-mono text-xs uppercase tracking-widest">
          Preparing your bag...
        </p>
      </main>
    );
  }

  // Empty bag.
  if (items.length === 0 && !completedOrder) {
    return (
      <main className="min-h-[75vh] bg-[#EFEBE4] px-6 py-28 text-[#111]">
        <div className="mx-auto max-w-xl text-center">
          <p className="mb-5 font-mono text-xs uppercase tracking-widest text-black/50">
            Checkout
          </p>

          <h1 className="font-display text-5xl tracking-tight md:text-7xl">
            Nothing in here.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-7 text-black/60">
            Your bag is empty. Find a few pieces and come back.
          </p>

          <button
            onClick={() => router.push("/shop")}
            className="mt-9 bg-[#111] px-8 py-4 text-xs font-medium uppercase tracking-widest text-[#EFEBE4] transition hover:bg-[#FF4A1C] hover:text-[#111]"
          >
            Explore the pieces
          </button>
        </div>
      </main>
    );
  }

  // Successful checkout.
  if (completedOrder) {
    return (
      <main className="min-h-screen bg-[#EFEBE4] px-5 py-20 text-[#111] md:px-10 md:py-28">
        <div className="mx-auto max-w-2xl">
          <p className="mb-8 font-mono text-xs uppercase tracking-widest text-[#FF4A1C]">
            Demo order complete
          </p>

          <h1 className="font-display text-6xl tracking-tight md:text-8xl">
            That's that.
          </h1>

          <p className="mt-7 text-lg">
            Your demo order is complete.
          </p>

          <p className="mt-2 text-sm leading-7 text-black/55">
            Nothing is being shipped. But the uniform looks good.
          </p>

          <div className="mt-12 border-y border-black/15 py-7">
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
              Demo order number
            </p>

            <p className="mt-2 font-mono text-2xl">
              {completedOrder.id}
            </p>

            <div className="mt-7 space-y-4">
              {completedOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span>
                    {item.name}
                    <span className="ml-2 text-black/45">
                      × {item.quantity}
                    </span>
                  </span>

                  <span className="font-mono">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-black/15 pt-5">
              <span className="text-sm">Order total</span>
              <span className="font-mono text-xl">
                {formatPrice(completedOrder.total)}
              </span>
            </div>
          </div>

          <p className="mt-7 text-xs leading-6 text-black/45">
            This is a fictional LVRY storefront. No real order was created
            and no payment was collected.
          </p>

          <button
            onClick={() => router.push("/")}
            className="mt-9 w-full bg-[#111] px-8 py-5 text-xs font-medium uppercase tracking-widest text-[#EFEBE4] transition hover:bg-[#FF4A1C] hover:text-[#111] sm:w-auto"
          >
            Back to LVRY
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#EFEBE4] px-5 pb-28 pt-12 text-[#111] md:px-10 md:pb-20 md:pt-20">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="mb-12 border-b border-black/15 pb-7 md:mb-16">
          <div className="mb-7 flex items-center justify-between">
            <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
              Your bag / Checkout
            </p>

            <p className="font-mono text-[10px] uppercase tracking-widest text-black/45">
              {step === 1 ? "01 — 02" : "02 — 02"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`h-1 w-12 ${
                step === 1 ? "bg-[#FF4A1C]" : "bg-[#111]"
              }`}
            />
            <span
              className={`h-1 w-12 ${
                step === 2 ? "bg-[#FF4A1C]" : "bg-black/15"
              }`}
            />
          </div>

          <h1 className="mt-8 font-display text-5xl tracking-tight md:text-7xl">
            {step === 1 ? "A few things, then." : "Where should it go?"}
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-black/55">
            {step === 1
              ? "Choose what you're taking with you. The rest can stay in the bag."
              : "A few details to complete your demo order."}
          </p>
        </div>

        {step === 1 ? (
          <div className="grid gap-14 lg:grid-cols-[1fr_340px]">
            {/* Product selection */}
            <section>
              <div className="mb-5 flex items-center justify-between border-b border-black/15 pb-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
                  Your bag ({items.length} pieces)
                </p>

                <button
                  onClick={toggleAll}
                  className="text-xs underline underline-offset-4 transition hover:text-[#FF4A1C]"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>

              <div className="divide-y divide-black/15">
                {items.map((item) => {
                  const data = getProductData(item);
                  const selected = selectedIds.includes(data.id);

                  return (
                    <article
                      key={data.id}
                      className={`flex gap-4 py-6 transition-opacity sm:gap-6 ${
                        selected ? "opacity-100" : "opacity-45"
                      }`}
                    >
                      {/* Selection checkbox */}
                      <button
                        type="button"
                        aria-label={
                          selected
                            ? `Deselect ${data.name}`
                            : `Select ${data.name}`
                        }
                        aria-pressed={selected}
                        onClick={() => toggleItem(data.id)}
                        className={`mt-2 flex h-5 w-5 shrink-0 items-center justify-center border transition ${
                          selected
                            ? "border-[#111] bg-[#111] text-[#EFEBE4]"
                            : "border-black/35"
                        }`}
                      >
                        {selected && (
                          <span className="text-xs">✓</span>
                        )}
                      </button>

                      {/* Product image */}
                      <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-[#E3DED5] sm:w-32">
                        {data.image ? (
                          <img
                            src={data.image}
                            alt={data.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="font-mono text-[9px] uppercase tracking-widest text-black/35">
                              LVRY
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product details */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                          <h2 className="text-sm font-medium sm:text-base">
                            {data.name}
                          </h2>

                          <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-black/45">
                            {item.product.id}
                          </p>

                          <div className="mt-4 flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(data.id, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="flex h-7 w-7 items-center justify-center border border-black/20 text-sm transition hover:bg-black hover:text-white"
                            >
                              −
                            </button>

                            <span className="w-5 text-center font-mono text-xs">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateQuantity(data.id, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="flex h-7 w-7 items-center justify-center border border-black/20 text-sm transition hover:bg-black hover:text-white"
                            >
                              +
                            </button>

                            <button
                              onClick={() => removeItem(data.id)}
                              className="ml-2 text-[10px] uppercase tracking-widest text-black/45 underline underline-offset-4 transition hover:text-[#FF4A1C]"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="font-mono text-sm">
                            {data.price === null
                              ? "Price unavailable"
                              : formatPrice(data.price * data.quantity)}
                          </p>

                          {item.quantity > 1 && data.price !== null && (
                            <p className="mt-1 text-[10px] text-black/40">
                              {formatPrice(data.price)} each
                            </p>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            {/* Order summary */}
            <aside className="h-fit border-t border-black/15 pt-6 lg:sticky lg:top-10 lg:border-t-0">
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
                Order summary
              </p>

              <div className="mt-7 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/55">Selected pieces</span>
                  <span className="font-mono">{selectedCount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/55">Subtotal</span>
                  <span className="font-mono">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/55">Shipping</span>
                  <span className="text-xs text-black/45">
                    Not charged
                  </span>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-black/15 pt-6">
                <span className="text-sm">Total</span>
                <span className="font-mono text-xl">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {hasUnavailablePrices && (
                <p className="mt-5 text-xs leading-6 text-[#B33A20]">
                  Some pieces don't have a valid price in the catalog.
                  Update their prices before continuing.
                </p>
              )}

              <button
                onClick={continueToDetails}
                disabled={
                  selectedItems.length === 0 || hasUnavailablePrices
                }
                className="mt-8 w-full bg-[#111] px-6 py-5 text-xs font-medium uppercase tracking-widest text-[#EFEBE4] transition hover:bg-[#FF4A1C] hover:text-[#111] disabled:cursor-not-allowed disabled:opacity-30"
              >
                Continue with {selectedCount}{" "}
                {selectedCount === 1 ? "piece" : "pieces"} →
              </button>

              <button
                onClick={() => router.push("/shop")}
                className="mt-5 w-full text-center text-xs text-black/50 underline underline-offset-4 transition hover:text-black"
              >
                Keep looking
              </button>

              <p className="mt-8 text-center font-mono text-[9px] uppercase leading-5 tracking-wider text-black/40">
                Checkout demonstration.
                <br />
                No payment will be collected.
              </p>
            </aside>
          </div>
        ) : (
          <form
            onSubmit={placeOrder}
            className="grid gap-14 lg:grid-cols-[1fr_340px]"
          >
            {/* Customer form */}
            <section className="space-y-12">
              <div>
                <p className="mb-7 font-mono text-[10px] uppercase tracking-widest text-black/45">
                  01 — Contact
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <FormField
                    label="Email address"
                    type="email"
                    placeholder="you@example.com"
                    value={details.email}
                    onChange={(value) => updateField("email", value)}
                  />

                  <FormField
                    label="Full name"
                    placeholder="Your name"
                    value={details.fullName}
                    onChange={(value) => updateField("fullName", value)}
                  />

                  <FormField
                    label="Phone number"
                    type="tel"
                    placeholder="+20 1X XXXX XXXX"
                    value={details.phone}
                    onChange={(value) => updateField("phone", value)}
                  />
                </div>
              </div>

              <div>
                <p className="mb-7 font-mono text-[10px] uppercase tracking-widest text-black/45">
                  02 — Delivery address
                </p>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <FormField
                      label="Street address"
                      placeholder="Street name, building number"
                      value={details.address}
                      onChange={(value) => updateField("address", value)}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <FormField
                      label="Apartment / floor (optional)"
                      placeholder="Apartment, floor, etc."
                      value={details.apartment}
                      onChange={(value) => updateField("apartment", value)}
                    />
                  </div>

                  <FormField
                    label="City"
                    placeholder="Your city"
                    value={details.city}
                    onChange={(value) => updateField("city", value)}
                  />

                  <FormField
                    label="Postal code"
                    placeholder="Postal code"
                    value={details.postalCode}
                    onChange={(value) => updateField("postalCode", value)}
                  />

                  <div className="sm:col-span-2">
                    <label className="block">
                      <span className="mb-3 block text-xs text-black/60">
                        Delivery notes (optional)
                      </span>

                      <textarea
                        value={details.notes}
                        onChange={(event) =>
                          updateField("notes", event.target.value)
                        }
                        rows={3}
                        placeholder="Anything else we should know?"
                        className="w-full resize-none border-b border-black/25 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF4A1C]"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <p className="mb-7 font-mono text-[10px] uppercase tracking-widest text-black/45">
                  03 — Payment
                </p>

                <div className="border border-black/15 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium">
                      Payment demonstration
                    </p>

                    <span className="bg-[#111] px-2 py-1 font-mono text-[9px] uppercase tracking-widest text-[#EFEBE4]">
                      Demo
                    </span>
                  </div>

                  <p className="mt-3 text-xs leading-6 text-black/50">
                    No payment method is required. This is a fictional
                    storefront and no payment will be collected.
                  </p>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="border border-[#B33A20]/30 bg-[#B33A20]/5 p-4 text-xs leading-6 text-[#B33A20]"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={goBack}
                  className="text-left text-xs text-black/50 underline underline-offset-4 transition hover:text-black"
                >
                  ← Back to your selection
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#111] px-8 py-5 text-xs font-medium uppercase tracking-widest text-[#EFEBE4] transition hover:bg-[#FF4A1C] hover:text-[#111] disabled:opacity-50 sm:ml-auto"
                >
                  {submitting ? "Saving order..." : "Place demo order"}
                </button>
              </div>
            </section>

            {/* Summary */}
            <aside className="h-fit border-t border-black/15 pt-6 lg:sticky lg:top-10">
              <p className="font-mono text-[10px] uppercase tracking-widest text-black/50">
                Your order
              </p>

              <div className="mt-6 space-y-5">
                {productData.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >
                    <div className="relative h-16 w-14 shrink-0 bg-[#E3DED5]">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111] px-1 font-mono text-[9px] text-white">
                        {item.quantity}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs">{item.name}</p>
                      <p className="mt-1 font-mono text-[10px] text-black/45">
                        {item.price === null
                          ? "Price unavailable"
                          : formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 space-y-4 border-t border-black/15 pt-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-black/55">Subtotal</span>
                  <span className="font-mono">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-black/55">Shipping</span>
                  <span className="text-xs text-black/45">
                    Not charged
                  </span>
                </div>

                <div className="flex justify-between border-t border-black/15 pt-5">
                  <span>Total</span>
                  <span className="font-mono text-lg">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              <p className="mt-7 text-[10px] leading-6 text-black/40">
                This is a checkout demonstration. No real order will be
                created.
              </p>
            </aside>
          </form>
        )}
      </div>
    </main>
  );
}

function FormField({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs text-black/60">
        {label}
      </span>

      <input
        type={type}
        required
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full border-b border-black/25 bg-transparent px-0 py-3 text-sm outline-none transition placeholder:text-black/25 focus:border-[#FF4A1C]"
      />
    </label>
  );
}
