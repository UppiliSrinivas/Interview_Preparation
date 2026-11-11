# CSS3 — Senior Frontend Interview Notes (Product Companies)

> Focus: **cascade & specificity, layout (Flexbox/Grid), responsive design, stacking/rendering, performance, architecture, modern CSS.**

---

## Part 1 — Core Fundamentals

### 1. Explain the CSS Box Model. What does `box-sizing` do?
Every element is a box: **content → padding → border → margin**.
- `content-box` (default): `width` = content only; padding/border are **added** on top.
- `border-box`: `width` includes content + padding + border (more predictable).
```css
*, *::before, *::after { box-sizing: border-box; }
```

### 2. How do the cascade and specificity work?
The browser decides winners by, in order: **origin & importance** (`!important`), **cascade layers**, **specificity**, then **source order** (last wins).

Specificity (high → low): inline styles → **IDs** → **classes, attributes, pseudo-classes** → **elements, pseudo-elements**.
```css
#nav .link        /* (1,1,0) */
.nav .link:hover  /* (0,3,0) */
a                 /* (0,0,1) */
```
`:where()` has **zero** specificity; `:is()`/`:not()` take the **highest** specificity of their arguments. Avoid `!important` and deep selectors; prefer low, flat specificity.

### 3. What are Cascade Layers (`@layer`)?
Let you control priority **independent of specificity** by ordering layers; later layers beat earlier ones (for normal declarations), and **unlayered styles beat layered ones**.
```css
@layer reset, base, components, utilities;
@layer components { .btn { padding: 8px 16px; } }
@layer utilities  { .p-0 { padding: 0; } }   /* wins over components, regardless of specificity */
```
Great for design systems and taming third-party CSS.

### 4. Which properties are inherited? How do you control it?
Inherited by default: mostly text-related (`color`, `font-*`, `line-height`, `visibility`). Not inherited: box properties (`margin`, `padding`, `border`, `background`).
Control with `inherit`, `initial`, `unset`, `revert`.

### 5. What is margin collapsing?
Vertical margins of **adjacent block elements** (siblings, parent-first-child, empty blocks) combine into **one** margin (the larger). It doesn't happen in flex/grid containers, with padding/border between, or when a new **block formatting context** is created (`overflow: hidden/auto`, `display: flow-root`).

### 6. What is a Block Formatting Context (BFC)?
An isolated layout region where block boxes lay out independently — it contains floats and prevents margin collapse with children. Created by `display: flow-root` (cleanest), `overflow` other than visible, floats, absolute positioning, flex/grid containers.

### 7. Common units: `px`, `em`, `rem`, `%`, `vw/vh`, `dvh`, `ch`
- `rem`: relative to root font size (scalable, accessible) — use for font sizes/spacing.
- `em`: relative to the element's own font-size (compounds in nesting).
- `vw`/`vh`: viewport-based. On mobile, `100vh` ignores the dynamic browser UI → use **`dvh`/`svh`/`lvh`**.
- `ch`: width of "0" — good for readable line length (`max-width: 65ch`).

---

## Part 2 — Layout

### 8. Explain `position` values
| Value | Behavior |
|---|---|
| `static` | Normal flow (default) |
| `relative` | Offset from normal position; creates a positioning context |
| `absolute` | Removed from flow; positioned relative to nearest **positioned ancestor** |
| `fixed` | Relative to the viewport |
| `sticky` | Relative until a scroll threshold, then fixed (needs `top`; breaks if an ancestor has `overflow` set) |

### 9. What is a stacking context? How does `z-index` really work?
`z-index` only compares elements **within the same stacking context**. A new stacking context is created by: root element, `position` + `z-index` (not auto), `opacity < 1`, `transform`, `filter`, `will-change`, `isolation: isolate`, and flex/grid children with `z-index`.
Common bug: a child with `z-index: 9999` still appears below another element because its **parent** forms a lower stacking context. Fix with `isolation: isolate` or restructuring.

### 10. Flexbox vs Grid — when to use which?
- **Flexbox**: **one-dimensional** (row *or* column); content-driven; navbars, toolbars, aligning items.
- **Grid**: **two-dimensional** (rows *and* columns); layout-driven; page layouts, card grids, dashboards.
They combine well: Grid for the page, Flexbox inside components.

### 11. Key Flexbox properties and the `flex` shorthand
Container: `display:flex`, `flex-direction`, `justify-content` (main axis), `align-items` (cross axis), `flex-wrap`, `gap`.
Items: `flex: <grow> <shrink> <basis>`.
```css
.item { flex: 1; }          /* 1 1 0% → share space equally */
.fixed { flex: 0 0 200px; } /* no grow/shrink, 200px */
```
Gotcha: flex items have `min-width: auto` and can overflow — fix with `min-width: 0` for truncating text.

### 12. How do you build a responsive card grid without media queries?
```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
```
`auto-fit` collapses empty tracks; `auto-fill` keeps them.

### 13. Classic: How do you center a div?
```css
/* Grid (shortest) */
.parent { display: grid; place-items: center; }

/* Flex */
.parent { display: flex; justify-content: center; align-items: center; }

/* Absolute */
.child { position: absolute; inset: 0; margin: auto; width: 200px; height: 100px; }

/* Horizontal only */
.child { margin-inline: auto; width: fit-content; }
```

### 14. Grid essentials: `fr`, `minmax`, areas, subgrid
```css
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-areas: "sidebar main";
}
.sidebar { grid-area: sidebar; }
```
`fr` = fraction of free space; `minmax(min, max)` for flexible tracks; **subgrid** lets nested grids align with the parent's tracks.

---

## Part 3 — Responsive & Modern CSS

### 15. How do you approach responsive design?
- **Mobile-first**: base styles for small screens, enhance with `min-width` queries.
- Fluid layouts (Grid/Flex, `%`, `fr`), fluid type with `clamp()`.
- Responsive images (`srcset`, `<picture>`), correct viewport meta.
- **Container queries** for component-level responsiveness.
- Test real devices, touch targets, and reduced motion.
```css
.card { padding: 16px; }
@media (min-width: 768px) { .card { padding: 24px; } }
```

### 16. What are Container Queries and why do they matter?
Style a component based on its **container's size**, not the viewport — making components truly reusable.
```css
.card-wrap { container-type: inline-size; }
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 120px 1fr; }
}
```

### 17. Fluid typography with `clamp()`
```css
h1 { font-size: clamp(1.5rem, 1rem + 2vw, 3rem); }  /* min, preferred, max */
```
Also `min()` and `max()` for fluid sizing; keep `rem` in the mix so user zoom/font preferences still work.

### 18. CSS Custom Properties (variables) vs preprocessor variables
CSS variables are **runtime**, cascade/inherit, and can be changed with JS or per scope (theming). Sass variables are compile-time.
```css
:root { --brand: #0a66ff; --space: 8px; }
.btn { background: var(--brand, blue); padding: var(--space); }
[data-theme="dark"] { --brand: #6ea8ff; }
```

### 19. How do you implement dark mode?
```css
:root { color-scheme: light dark; --bg: #fff; --text: #111; }
@media (prefers-color-scheme: dark) { :root { --bg: #111; --text: #eee; } }
[data-theme="dark"] { --bg: #111; --text: #eee; }   /* manual toggle override */
body { background: var(--bg); color: var(--text); }
```
Persist user choice (localStorage) and set the attribute early to avoid a flash.

### 20. Modern selectors worth knowing
- `:is()`, `:where()` — group selectors (specificity differences above)
- **`:has()`** — "parent selector": `.card:has(img)`
- `:focus-visible` — focus ring only for keyboard users
- `:not()`, `:nth-child(n of S)`
- Native **CSS nesting**: `.card { & .title { … } }`
- Logical properties: `margin-inline`, `padding-block`, `inset`

---

## Part 4 — Animation & Performance (High-Value)

### 21. Transition vs Animation
- **Transition**: animates between **two states** triggered by a state change (hover, class toggle).
- **Animation (`@keyframes`)**: multi-step, can run automatically/loop, no trigger needed.
```css
.btn { transition: transform .2s ease; }
.btn:hover { transform: translateY(-2px); }

@keyframes spin { to { transform: rotate(360deg); } }
.loader { animation: spin 1s linear infinite; }
```

### 22. Which CSS properties are cheap to animate and why?
`transform` and `opacity` can run on the **compositor** (GPU) without layout or paint. Animating `width`, `height`, `top`, `left`, `margin` triggers **layout** (expensive); `background`/`box-shadow` trigger **paint**.
```css
/* ❌ */ .box { transition: left .3s; }
/* ✅ */ .box { transition: transform .3s; }
```

### 23. What is `will-change`? When should you use it?
A hint that a property will change so the browser can optimize (e.g., promote to its own layer). Use **sparingly and temporarily** — overuse wastes memory. It also creates a stacking context.

### 24. How do you improve CSS rendering performance?
- Animate `transform`/`opacity` only
- Avoid layout thrashing and deep/complex selectors
- Use `content-visibility: auto` + `contain-intrinsic-size` for off-screen sections
- Use `contain` to isolate subtrees
- Inline **critical CSS**, defer the rest; remove unused CSS
- Minimize `@import` chains; prefer a single bundled/minified file
- Limit expensive effects (large blur/filters/shadows)
- Use font-display: `swap`/`optional` to avoid invisible text

### 25. Respecting motion preferences
```css
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
}
```
An accessibility must-have for vestibular disorders.

---

## Part 5 — Architecture & Practices

### 26. CSS architecture: BEM vs CSS Modules vs CSS-in-JS vs Tailwind
| Approach | Pros | Cons |
|---|---|---|
| **BEM** (`.card__title--active`) | Simple, no tooling, predictable | Verbose, manual discipline |
| **CSS Modules** | Local scope by default, plain CSS, zero runtime | Dynamic styles need CSS variables |
| **CSS-in-JS** (styled-components, Emotion) | Dynamic props, colocated | Runtime cost, SSR complexity (zero-runtime options exist) |
| **Utility-first** (Tailwind) | Fast, consistent design tokens, small output | Verbose markup, learning curve |
Choose based on team size, design system needs, and performance constraints.

### 27. How do you scale CSS in a large codebase?
Design tokens via CSS variables, layered architecture (`@layer reset/base/components/utilities`), scoped styles (Modules/BEM), component-based styling, linting (Stylelint), low specificity rules, documented patterns, and visual regression tests (Storybook/Chromatic).

### 28. Pseudo-classes vs pseudo-elements
- **Pseudo-class** (`:hover`, `:focus`, `:nth-child`) → selects an element in a **state**.
- **Pseudo-element** (`::before`, `::after`, `::placeholder`, `::selection`) → styles a **part** of an element or generates content.
`::before/::after` need `content: ''` to render.

### 29. `display: none` vs `visibility: hidden` vs `opacity: 0`
| | Takes space | Accessible to screen readers | Clickable |
|---|---|---|---|
| `display: none` | No | No | No |
| `visibility: hidden` | Yes | No | No |
| `opacity: 0` | Yes | **Yes** | **Yes** |
For visually-hidden-but-accessible text, use a `.sr-only` utility (clip/position technique).

### 30. Truncating text and line clamping
```css
.one-line { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.three-lines { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
```
In flex children add `min-width: 0` so ellipsis works.

### 31. Maintaining aspect ratio and sizing media
```css
.video { aspect-ratio: 16 / 9; width: 100%; }
img { max-width: 100%; height: auto; display: block; }
.cover { object-fit: cover; }
```
`aspect-ratio` also prevents layout shift (CLS).

### 32. Feature queries and progressive enhancement
```css
@supports (display: grid) { .layout { display: grid; } }
```
Write a sensible baseline, then enhance for modern browsers. Check support (caniuse/Baseline) before relying on newer features.

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Default `box-sizing` | `content-box` (reset to `border-box`) |
| Specificity order | inline > ID > class/attr/pseudo-class > element |
| Clear floats | `display: flow-root` on parent |
| Center anything | `display: grid; place-items: center` |
| `1fr` means | One fraction of the free space in the grid |
| `rem` vs `em` | rem → root size; em → parent/element font size |
| Mobile 100vh bug | Use `100dvh` |
| Cheap animation props | `transform`, `opacity` |
| `z-index` not working | Different stacking context, or element not positioned |
| Common mistakes | Overusing `!important`, deep nesting/high specificity, animating layout properties, px-only font sizes, missing focus styles, `100vh` on mobile, no reduced-motion support |
