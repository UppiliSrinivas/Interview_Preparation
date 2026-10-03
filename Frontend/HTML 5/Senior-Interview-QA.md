# HTML5 — Senior Frontend Interview Notes (Product Companies)

> Focus: **semantics, accessibility, performance (loading/rendering), forms, storage & Web APIs, security, SEO.**

---

## Part 1 — Fundamentals & Semantics

### 1. What is HTML5 and what did it add?
The modern HTML standard. Key additions: **semantic elements** (`<header>`, `<main>`, `<article>`), **multimedia** (`<audio>`, `<video>`), **graphics** (`<canvas>`, inline SVG), **new form inputs & validation**, **storage** (localStorage, IndexedDB), **APIs** (Geolocation, History, Drag & Drop, Web Workers, WebSocket), and a simplified `<!DOCTYPE html>`.

### 2. What are semantic elements and why do they matter?
Elements whose names describe their **meaning**, not just appearance.
```html
<header>…</header>
<nav>…</nav>
<main>
  <article><h1>Title</h1><section>…</section></article>
  <aside>Related</aside>
</main>
<footer>…</footer>
```
Benefits: built-in **accessibility** (landmarks for screen readers), **SEO**, readability/maintainability, and free keyboard behavior (e.g., `<button>`).

### 3. `<div>` vs semantic tags? When is a `<div>` fine?
Use `<div>`/`<span>` only when no semantic element fits (pure layout/styling hooks). Never replace interactive elements with divs.
```html
<!-- ❌ --> <div onclick="save()">Save</div>
<!-- ✅ --> <button type="button" onclick="save()">Save</button>
```

### 4. `<section>` vs `<article>` vs `<div>` vs `<aside>`
- `<article>`: self-contained, reusable content (blog post, card, comment).
- `<section>`: thematic grouping, usually with a heading.
- `<aside>`: tangentially related content (sidebar).
- `<div>`: no meaning, just a container.

### 5. What does `<!DOCTYPE html>` do?
Tells the browser to use **standards mode**. Without it, browsers enter **quirks mode** (legacy layout behavior, e.g., different box model handling), causing inconsistencies.

### 6. Block vs inline vs inline-block elements
- **Block**: starts on a new line, takes full width (`div`, `p`, `section`).
- **Inline**: flows within text; width/height and vertical margins don't apply (`span`, `a`).
- **Inline-block**: flows inline but accepts width/height.
(Defaults can be changed via CSS `display`.)

### 7. Essential `<head>` tags
```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page title</title>
<meta name="description" content="…">
<link rel="canonical" href="https://example.com/page">
<html lang="en">   <!-- on the root element -->
```
`lang` helps screen readers and translation; the viewport tag is required for responsive design.

---

## Part 2 — Performance & Loading (High-Value)

### 8. `async` vs `defer` vs normal scripts
| | Download | Execution | Order |
|---|---|---|---|
| normal | blocks HTML parsing | immediately, blocks parsing | in order |
| `async` | parallel | as soon as downloaded (may interrupt parsing) | **not guaranteed** |
| `defer` | parallel | after HTML parsed, before `DOMContentLoaded` | **in order** |

`type="module"` scripts are **deferred by default**. Use `defer` for app code, `async` for independent scripts (analytics).

### 9. Explain the Critical Rendering Path
1. Parse HTML → **DOM**
2. Parse CSS → **CSSOM**
3. Combine → **Render tree** (visible nodes + styles)
4. **Layout** (size/position)
5. **Paint** (pixels)
6. **Composite** (layers)

CSS is **render-blocking**; synchronous JS is **parser-blocking**. Optimize by inlining critical CSS, deferring JS, and minimizing blocking resources.

### 10. Reflow vs Repaint
- **Reflow (layout)**: geometry changes (width, DOM insertion) → recalculates layout; expensive.
- **Repaint**: appearance changes without geometry (color, visibility).
Avoid layout thrashing (reading layout properties like `offsetHeight` between writes). Prefer `transform`/`opacity` for animations.

### 11. Resource hints: `preload`, `prefetch`, `preconnect`, `dns-prefetch`
```html
<link rel="preload" href="/hero.webp" as="image" fetchpriority="high">  <!-- needed NOW -->
<link rel="prefetch" href="/next-page.js">                              <!-- might need NEXT -->
<link rel="preconnect" href="https://api.example.com" crossorigin>      <!-- open connection early -->
<link rel="dns-prefetch" href="//cdn.example.com">                       <!-- DNS only -->
```

### 12. How do you optimize images in HTML?
```html
<img src="img-800.jpg"
     srcset="img-400.jpg 400w, img-800.jpg 800w, img-1600.jpg 1600w"
     sizes="(max-width: 600px) 100vw, 50vw"
     width="800" height="450" alt="Descriptive text" loading="lazy" decoding="async">

<picture>
  <source type="image/avif" srcset="a.avif">
  <source type="image/webp" srcset="a.webp">
  <img src="a.jpg" alt="…">
</picture>
```
- Set `width`/`height` to prevent **layout shift (CLS)**.
- `loading="lazy"` for below-the-fold images — **don't lazy-load the LCP image**; use `fetchpriority="high"` instead.
- Use modern formats (AVIF/WebP) and responsive `srcset`.

### 13. What is `<picture>` used for?
**Art direction** (different crops per viewport) and **format fallback** (AVIF → WebP → JPEG) — selecting different sources by media query or type.

### 14. Core Web Vitals and how HTML affects them
- **LCP** (loading): prioritize hero image/text, preload, avoid render-blocking resources.
- **INP** (interactivity): avoid long main-thread tasks; defer scripts.
- **CLS** (stability): reserve space with width/height/aspect-ratio, avoid inserting content above existing content.

---

## Part 3 — Forms & Accessibility

### 15. New HTML5 input types and attributes
Types: `email`, `url`, `tel`, `number`, `date`, `time`, `range`, `color`, `search`.
Attributes: `required`, `pattern`, `min`/`max`, `minlength`, `placeholder`, `autocomplete`, `inputmode`, `autofocus`, `list` (+ `<datalist>`).
They give mobile-optimized keyboards, built-in validation, and better UX.
```html
<input type="email" name="email" required autocomplete="email" inputmode="email">
```

### 16. How does built-in form validation work?
The **Constraint Validation API**: browsers validate on submit using attributes (`required`, `pattern`, `type`). Programmatic control:
```js
input.checkValidity();            // boolean
input.setCustomValidity('Msg');   // custom error (empty string clears)
form.reportValidity();            // shows messages
```
CSS: `:invalid`, `:valid`, `:user-invalid`. Always **re-validate on the server**.

### 17. `<label>` and form accessibility
Every input needs an accessible name.
```html
<label for="email">Email</label>
<input id="email" type="email" aria-describedby="hint">
<p id="hint">We'll never share it.</p>
```
Also: group radios with `<fieldset><legend>`, don't use placeholder as a label, link errors with `aria-describedby`/`aria-invalid`, and set `type="button"` on non-submit buttons (default is `submit`).

### 18. Key accessibility practices in HTML
- Use **semantic elements** and landmarks first; ARIA only when needed.
- `alt` text (empty `alt=""` for decorative images).
- **Keyboard** operability and visible focus; logical heading order (`h1`→`h2`…).
- `lang` attribute, sufficient contrast, labels for inputs.
- `tabindex="0"` (make focusable) / `-1` (programmatic focus); avoid positive values.
- Skip link to main content; `aria-live` for dynamic updates.

### 19. ARIA: when and how?
**First rule: don't use ARIA if native HTML does the job.** Use it to fill gaps (custom widgets): `role`, `aria-label`, `aria-expanded`, `aria-controls`, `aria-live`. Bad ARIA is worse than none — and ARIA doesn't add keyboard behavior.

---

## Part 4 — Storage, APIs & Modern Elements

### 20. localStorage vs sessionStorage vs cookies vs IndexedDB
| | Size | Lifetime | Sent to server | API |
|---|---|---|---|---|
| localStorage | ~5 MB | Persistent | No | Sync, strings |
| sessionStorage | ~5 MB | Tab session | No | Sync, strings |
| Cookies | ~4 KB | Configurable | **Yes, every request** | Strings; `HttpOnly`/`Secure`/`SameSite` flags |
| IndexedDB | Large (quota-based) | Persistent | No | Async, structured data/blobs |

Never store sensitive tokens in localStorage (XSS-readable) — prefer HttpOnly cookies.

### 21. What are Web Workers and Service Workers?
- **Web Worker**: runs JS on a background thread (heavy computation) without blocking the UI; communicates by `postMessage`; no DOM access.
- **Service Worker**: a proxy between app and network — enables **offline support, caching strategies, push notifications, background sync**; HTTPS only.

### 22. Useful HTML5/Web APIs to know
- `fetch`, `AbortController`
- **IntersectionObserver** (lazy load, infinite scroll), **ResizeObserver**, **MutationObserver**
- History API (`pushState`) — basis of client-side routing
- `WebSocket`, Server-Sent Events
- Geolocation, Clipboard, Drag & Drop, File API
- `requestAnimationFrame`, `BroadcastChannel`

### 23. `<canvas>` vs SVG
| Canvas | SVG |
|---|---|
| Pixel-based (raster), imperative drawing | Vector, DOM elements |
| Great for many objects/games/charts with big data | Great for icons, crisp scalable graphics, accessibility |
| No per-shape events natively | Each shape is a DOM node (events, CSS styling) |

### 24. Modern native elements: `<dialog>`, `<details>`, popover
```html
<dialog id="d"><p>Hi</p><form method="dialog"><button>Close</button></form></dialog>
<script>d.showModal();</script>    <!-- modal: focus trap, Esc to close, ::backdrop -->

<details><summary>More info</summary>Content</details>

<button popovertarget="tip">Info</button>
<div id="tip" popover>Popover content</div>
```
Prefer these over custom JS widgets when they fit — less code and better accessibility. (Check browser support for newer features like `popover`.)

### 25. Web Components basics
Custom Elements + Shadow DOM + `<template>`/`<slot>` give framework-agnostic reusable components.
```html
<template id="t"><style>p{color:teal}</style><p><slot></slot></p></template>
<script>
customElements.define('my-note', class extends HTMLElement {
  constructor(){ super(); this.attachShadow({mode:'open'}).append(t.content.cloneNode(true)); }
});
</script>
<my-note>Hello</my-note>
```

### 26. `data-*` attributes
Store custom data on elements; read via `element.dataset`.
```html
<button data-id="42" data-action="delete">Delete</button>
<script>btn.dataset.id // "42"</script>
```
Not for secrets or large data; useful for event delegation and CSS hooks.

---

## Part 5 — Security & SEO

### 27. HTML-related security best practices
- Escape/sanitize user content (avoid `innerHTML` with untrusted data → XSS); use `textContent`.
- Add a **Content-Security-Policy**.
- External links with `target="_blank"` → add `rel="noopener noreferrer"`.
- Use `<iframe sandbox>` for untrusted content; restrict with `allow` attribute.
- Use Subresource Integrity (`integrity="sha384-…"`) for third-party scripts/styles.
- Set `autocomplete`, `HttpOnly`/`Secure` cookies, and avoid inline scripts when possible.

### 28. `<iframe>` — risks and best practices
Risks: clickjacking, XSS from embedded content, performance cost. Mitigate with `sandbox`, `loading="lazy"`, `referrerpolicy`, and server headers `X-Frame-Options`/CSP `frame-ancestors` to control who can embed your pages.

### 29. SEO fundamentals in HTML
- One descriptive `<title>` and `<meta name="description">`
- Proper heading hierarchy (one `<h1>`), semantic markup
- `canonical` link, `robots` meta, `hreflang` for languages
- **Open Graph / Twitter cards** for sharing
- **Structured data** (JSON-LD, schema.org) for rich results
- Descriptive `alt` text and link text; fast, mobile-friendly pages
- For SPAs: SSR/SSG so crawlers get content in the initial HTML

```html
<script type="application/ld+json">
{ "@context":"https://schema.org", "@type":"Article", "headline":"Title" }
</script>
```

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Doctype purpose | Standards mode (avoid quirks mode) |
| `defer` vs `async` | defer = in order after parse; async = unordered, ASAP |
| Default `<button>` type in a form | `submit` |
| Lazy-load images | `loading="lazy"` (not for LCP image) |
| Prevent CLS | `width`/`height` or `aspect-ratio` on media |
| Store auth tokens | HttpOnly cookie, not localStorage |
| `<b>`/`<i>` vs `<strong>`/`<em>` | `strong`/`em` carry meaning (importance/emphasis); `b`/`i` are stylistic |
| `<script type="module">` | Deferred by default, strict mode, own scope |
| Common mistakes | Divs as buttons, missing labels/alt, no `lang`, blocking scripts in head, missing width/height, trusting user HTML |
