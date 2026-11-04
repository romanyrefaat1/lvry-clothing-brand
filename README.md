# LVRY

**The everyday uniform.**

LVRY is a fictional clothing label and frontend portfolio project built around one idea: **a uniform made of pieces**.

It imagines a small, repeatable wardrobe of everyday garments that work together. The website presents that idea through a distinctive handmade visual identity and an interactive shopping experience—especially a uniform builder where visitors can assemble outfits from individual pieces.

> LVRY is a fictional portfolio project. It does not process real commercial orders or payments.
> 

---

## The concept

LVRY is for people who would rather build a considered, repeatable wardrobe than keep buying more clothes.

The brand combines:

- A deliberately small clothing range.
- Garments designed to work together as parts of an everyday uniform.
- A tactile visual world made from paper, fabric, cut-outs and handwritten notes.
- Plain, direct product information instead of fashion-marketing language.

The name is pronounced **“livery”** and refers to a distinctive uniform.

## Brand identity

### Personality and voice

LVRY is dry, playful, hands-on and quietly confident.

The visuals can be playful; the writing stays plain and deadpan.

- Use short sentences and concrete language.
- Put facts before adjectives.
- Avoid hype slang, exclamation marks and exaggerated promises.
- Never use fake scarcity, countdowns or artificial urgency.
- Do not make unsupported claims about quality, sustainability, sourcing or product performance.

### Visual system

| Token | Color | Use |
| --- | --- | --- |
| Ink | `#111111` | Primary text and dark surfaces |
| Bone | `#EFEBE4` | Main background |
| Signal | `#FF4A1C` | Small, sparing accents |
| Denim | `#3E5C8A` | Optional supporting color |
| Canvas | `#C9B79C` | Optional supporting color |

**Typography**

- **Bricolage Grotesque** — display and headlines.
- **Geist** — body text and general UI.
- **Geist Mono** — labels, prices, sizes and metadata.
- **Caveat** — handwritten annotations only.

**Art direction**

The site should feel like a handmade tabletop world of paper and fabric: die-cut garment images, thin white borders, real textures, layered cut-outs, irregular edges, hand-drawn marks and restrained handwritten notes.

Product imagery must remain clean, color-accurate and undistorted. The garment is always the hero.

Avoid generic gradients, glassmorphism, glitch effects, random 3D decoration, cartoon/kawaii props and template-like collage treatments.

### Accessibility notes

- Target WCAG 2.2 AA contrast for body text.
- Use Ink on Bone as the default text pairing.
- Signal on Bone is not suitable for small text; use it sparingly as a non-text accent.
- Do not communicate status through color alone.
- Handwritten annotations must never be the only source of essential information.
- Support keyboard interaction and reduced-motion preferences.

---

## Website

### Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage and introduction to the brand |
| `/shop` | Product catalog |
| `/shop/[slug]` | Product detail |
| `/build` | Interactive uniform builder |
| `/lookbook` | Editorial outfit combinations |
| `/about` | Brand philosophy |
| `/contact` | Contact page |

### Global interfaces

The planned global experience includes:

- Sticky desktop navigation and a compact mobile header.
- Full-screen mobile navigation.
- Search overlay with command-palette keyboard behavior.
- Shopping-bag drawer and quick-add controls.
- Reusable product gallery and size guide.
- Newsletter form.
- Clearly labeled demo checkout.

Search keyboard controls:

| Key | Action |
| --- | --- |
| `/` | Open search |
| `↑` / `↓` | Move through results |
| `Enter` | Open selected result |
| `Escape` | Close search |

---

## Signature experience: uniform builder

The uniform builder is the main frontend showcase.

Visitors assemble an outfit from the catalog by selecting pieces for these slots:

- Top
- Layer
- Bottom
- Outerwear

The planned builder includes:

- A structured outfit mode and a freeform canvas.
- Drag-and-drop, snapping, repositioning and layer ordering.
- Button and keyboard alternatives to drag-and-drop.
- Canvas materials: Bone paper, Kraft paper, Denim and Canvas.
- Undo, reset and random outfit actions.
- A live outfit total using clearly identified demo prices.
- Locally saved outfits.
- Shareable URLs that encode outfit selections.
- Image export.
- The ability to add selected pieces or the full outfit to the demo bag.
- A responsive tap-to-select experience on mobile.

Builder state should remain separate from catalog and browsing state.

---

## Catalog

The canonical catalog contains **13 pieces across two collections**. Keep the collection assignments unchanged unless the project owner explicitly updates them.

### College Student

Collection codename: `college-student`

1. Olive Green Long-Sleeve T-Shirt
2. Beige Crewneck Sweatshirt
3. Off-White Short-Sleeve T-Shirt
4. Tan Pleated Chinos
5. Canvas Tote Bag
6. Dark Blue Denim Jeans
7. Black Zip-Up Jacket
8. Blue Button-Down Overshirt

### Going on a Date

Collection codename: `going-on-a-date`

1. Brown Short-Sleeve Knit Polo
2. Olive Green Button-Up Cardigan
3. Light Blue Long-Sleeve Button-Down Shirt
4. Dark Brown Pleated Trousers
5. Olive Green Chore Jacket

### Image assets

The source inventory lists `.jpg` basenames, while the website assets use `.png`.

Use this public URL pattern:

```
/collections/{collection-codename}/1/{filename}.png
```

For example:

```
/collections/college-student/1/olive_green_long_sleeve_tshirt.png
```

The corresponding files live under:

```
public/collections/{collection-codename}/1/
```

Do not include `/public` in public asset URLs. Do not invent missing source image identifiers.

### Catalog JSON contract

The canonical catalog JSON has two top-level keys: `pieces` and `collections`.

```json
{
  "pieces": [
    {
      "id": "olive-green-long-sleeve-tshirt",
      "name": "Olive Green Long-Sleeve T-Shirt",
      "category": "top",
      "collection": "college-student",
      "image": "/collections/college-student/1/olive_green_long_sleeve_tshirt.png"
    }
  ],
  "collections": [
    {
      "codename": "college-student",
      "name": "College Student",
      "description": "...",
      "style": "...",
      "palette": ["..."]
    }
  ]
}
```

Each piece must contain:

- `id`
- `name`
- `category`
- `collection`
- `image`

Collection objects contain metadata such as `codename`, `name`, `description`, `style` and `palette`. Do not add `pieceIds` to collection objects.

Allowed category values:

```tsx
type PieceCategory =
  | "top"
  | "layer"
  | "bottom"
  | "outerwear"
  | "accessory";
```

Keep all 13 catalog entries and their collection assignments consistent with the canonical inventory above.

---

## Frontend architecture

The project uses a Next.js/React frontend with TypeScript and Tailwind CSS.

### ClothesContext

Suggested location: `src/contexts/ClothesContext.tsx`

Responsibilities:

- Provide the canonical catalog and collection data.
- Own browsing, search, filtering and sorting state.
- Expose reusable catalog lookup and filtering operations.

Expected public API:

| Area | API |
| --- | --- |
| Data | `pieces`, `collections`, `filteredPieces` |
| UI state | `search`, `activeCollection`, `activeCategory`, `sort` |
| Setters | `setSearch`, `setCollection`, `setCategory`, `setSort` |
| Reset | `clearFilters` |
| Operations | `searchPieces(query)`, `filterPieces(filters)` |
| Lookups | `getPiece(id)`, `getCollection(codename)`, `getCollectionPieces(codename)` |

Suggested sort values: `default`, `name-asc`, `name-desc`.

Search and filter helper methods should work independently of the current UI filter state. `filteredPieces` should be derived from the active UI state.

### UniformBuilderContext

Keep builder state separate from `ClothesContext`.

It owns builder-specific state, including:

- Selected pieces and active outfit.
- Layer order and canvas positions.
- Canvas material.
- Undo history.
- Saved outfits.

Only support garment color variants when the actual product data provides them.

---

## Other planned features

### Shop

- Live product filtering.
- URL-synced filters so refreshes and shared links preserve selections.
- Category, size, color, fit and price filters where product data supports them.
- Sorting and grid/list views.
- Animated product-grid updates.
- Useful empty states.
- Quick add with size selection.

### Product details

- Product image gallery.
- Fit, fabric, measurements and care information.
- Interactive size guide with centimetres/inches toggle.
- Size recommendations based only on supplied measurements.
- Related pieces.

### Lookbook

- Editorial outfit combinations.
- Clickable garment hotspots.
- Outfit switching.
- “Shop this outfit” and “Build this uniform” actions.

### Shopping bag

- Quantity controls and item removal.
- Derived subtotal.
- Empty, loading and updated states.
- Demo checkout that does not collect payment details or create real orders.

---

## Product data and demo limitations

LVRY is fictional. Prices, fabric composition, fabric weight, measurements, availability, care instructions and sizing recommendations are placeholders until verified product data is supplied.

Do not present placeholder values as factual product claims. Do not imply that the site accepts real orders, collects payments or fulfills purchases.

Newsletter and contact functionality should also be clearly identified as demo functionality unless connected to real services.

---

## Development principles

1. Build reusable components instead of duplicating page-specific implementations.
2. Make interactions functional, not decorative.
3. Provide keyboard-accessible alternatives to drag-and-drop.
4. Respect reduced-motion preferences.
5. Keep essential information out of handwritten-only text.
6. Never rely on color alone to communicate status.
7. Preserve garment color and shape in product imagery.
8. Optimize image loading and responsive layouts.
9. Keep builder state separate from catalog state.
10. Do not invent product specifications, prices, asset identifiers or collection assignments.

---

## Project status

LVRY is a frontend portfolio project. The feature list in this README describes the intended experience and architecture; it should not be read as a claim that every feature is already implemented.

---

## License

No one can use the code of this website at all. The code is read only.