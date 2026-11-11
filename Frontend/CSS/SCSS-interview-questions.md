# SCSS Interview Questions: Basics to Senior (Top 25)

The 25 SCSS questions most worth preparing, each with the answer an interviewer is listening for.

**How senior interviews are usually weighted:** ~10% basics, ~30% intermediate, ~60% advanced and scenario questions. Answer basics crisply, add one trade-off or pitfall, and you'll be moved up a level fast.

---

## Table of Contents

1. [Level 1: Basics (Q1–6)](#level-1-basics)
2. [Level 2: Intermediate (Q7–11)](#level-2-intermediate)
3. [Level 3: Advanced / Senior (Q12–24)](#level-3-advanced--senior)
4. [Bonus: Modern CSS Awareness (Q25)](#bonus-modern-css-awareness)

---

## Level 1: Basics

### 1. What is SCSS, and how is it different from Sass?
Both are syntaxes of the same preprocessor. **SCSS** uses CSS-like braces and semicolons, so any valid CSS is valid SCSS. **Sass (indented syntax)** uses indentation instead. SCSS is the industry default.

### 2. Why use a preprocessor at all?
Variables, nesting, mixins, functions, loops, and modules make large stylesheets maintainable. Browsers can't read SCSS, so it compiles to plain CSS.

### 3. How do variables and nesting work, and what's the danger of nesting?
```scss
$primary: #0055ff;

.nav {
  background: $primary;
  a { color: white; }
}
```
Over-nesting produces long, high-specificity selectors tightly coupled to the DOM.

### 4. What does `&` do?
It refers to the parent selector.
```scss
.btn {
  &:hover { opacity: 0.8; }
  &--primary { color: blue; }
}
// Output: .btn:hover, .btn--primary
```
**Senior note:** `&-foo` concatenation makes selectors impossible to grep, so many teams allow it only for BEM.

### 5. What are partials?
Files prefixed with `_` (e.g. `_buttons.scss`). They don't compile to their own CSS file and are meant to be loaded into other files.

### 6. What is a mixin?
A reusable block of declarations.
```scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.box { @include flex-center; }
```

---

## Level 2: Intermediate

### 7. How do mixins take arguments and default values?
```scss
@mixin btn($bg, $pad: 8px 16px) {
  background: $bg;
  padding: $pad;
}

.cta { @include btn(#0055ff); }
```

### 8. What are maps, and how do you read from them?
Key-value collections, read with `map.get()` from `sass:map`.
```scss
@use 'sass:map';

$colors: (primary: #0055ff, danger: #d32f2f);

.alert { color: map.get($colors, danger); }
```

### 9. How do loops and interpolation (`#{}`) work?
`@each` iterates over lists or maps and `@for` over number ranges. Interpolation inserts values into selectors, property names, or strings.
```scss
@each $name, $color in (success: green, error: red) {
  .text-#{$name} { color: $color; }
}

@for $i from 1 through 4 {
  .mt-#{$i} { margin-top: $i * 4px; }
}
```

### 10. How do `@if` and `@else` work?
They emit styles conditionally.
```scss
@mixin theme($mode) {
  @if $mode == dark {
    background: #111;
    color: #fff;
  } @else {
    background: #fff;
    color: #111;
  }
}
```

### 11. What is variable scope?
Variables declared inside a block are local to it. `!global` overrides a global variable from inside a block, but avoid it because it creates hidden side effects.

---

## Level 3: Advanced / Senior

### 12. Why was `@import` deprecated, and how do `@use` and `@forward` differ?
`@import` puts everything into one global namespace, causing name collisions, duplicated CSS when a file is imported twice, and no way to tell where a variable came from.

`@use` loads a module once, namespaces its members (`t.$primary`), and keeps private members (`$-private`) private. `@forward` re-exports members to build a public API through an index file.
```scss
// tokens/_index.scss
@forward 'colors';
@forward 'spacing';

// component.scss
@use 'tokens' as t;

.btn { padding: t.$space-2; color: t.$primary; }
```
Use **Dart Sass** (`sass` or `sass-embedded`). LibSass and `node-sass` are deprecated and lack the module system.

### 13. How do you make a library configurable with `@use ... with`?
Mark variables `!default`, and the consumer configures them on load. A module can only be configured the first time it's loaded.
```scss
// _theme.scss
$primary: #0055ff !default;

// app.scss
@use 'theme' with ($primary: #c2185b);
```

### 14. How would you structure SCSS for a large app or design system?
Use a layered structure such as the 7-1 pattern, ITCSS, or tokens → base → layout → components → utilities.
- **Tokens are the single source of truth**, ideally generated from JSON or Figma.
- **Each layer depends only on layers below it.**
- **Components are co-located** with their JS (React components or CSS Modules).
- **Tokens and tools emit no CSS.** They hold only variables, functions, and mixins.

### 15. Mixin vs function vs placeholder: when do you use each?
| Tool | What it does | Use it for |
|---|---|---|
| **Function** | Returns a value | Calculations, token lookups |
| **Mixin** | Emits declarations; takes arguments and `@content` | Reusable style blocks, media queries |
| **Placeholder + `@extend`** | Groups selectors to share one rule | Shared rules within a single module |

```scss
@use 'sass:math';

@function rem($px, $base: 16px) {
  @return math.div($px, $base) * 1rem;
}

h1 { font-size: rem(32px); } // 2rem
```

### 16. Write a responsive breakpoint mixin backed by a map.
```scss
@use 'sass:map';

$breakpoints: (sm: 576px, md: 768px, lg: 1024px, xl: 1280px);

@mixin up($key) {
  $bp: map.get($breakpoints, $key);

  @if not $bp {
    @error "Unknown breakpoint `#{$key}`.";
  }

  @media (min-width: $bp) { @content; }
}

.card {
  padding: 1rem;
  @include up(md) { padding: 2rem; }
}
```
**Bonus points:** `@error` validation, and mentioning container queries for component-level responsiveness.

### 17. Why do many teams ban or restrict `@extend`?
- It rewrites selectors in places you didn't write, causing **selector explosion** and surprising specificity.
- It **doesn't work across media queries**.
- It **couples otherwise unrelated files**.
- After gzip, mixin duplication usually costs less than people expect.

**Good answer:** "Prefer mixins or utility classes. Use `@extend` only with placeholders, inside one module, never across `@media`."

### 18. SCSS variables vs CSS custom properties: which do you use for theming?
| | SCSS variables | CSS custom properties |
|---|---|---|
| Resolved | At compile time | At runtime |
| Cascade | No | Yes |
| Changeable from JS | No | Yes |
| Best for | Constants, math, loops | Dark mode, multi-tenant theming |

**Senior pattern:** use SCSS to *generate* custom properties from a token map.
```scss
$tokens: (color-primary: #0055ff, radius-md: 8px);

:root {
  @each $key, $value in $tokens {
    --#{$key}: #{$value};
  }
}

.btn { border-radius: var(--radius-md); }
```

### 19. How would you implement dark mode plus per-client theming in a SaaS app?
- Use **semantic tokens** (`--surface`, `--text-muted`), not raw colors.
- **Generate theme blocks** from nested maps.
- Respect **`prefers-color-scheme`** as the default.
- Load **tenant overrides at runtime** as CSS variables, not separate SCSS builds.

```scss
$themes: (
  light: (surface: #ffffff, text: #111111),
  dark:  (surface: #121212, text: #f5f5f5),
);

@each $name, $theme in $themes {
  [data-theme='#{$name}'] {
    @each $key, $value in $theme {
      --#{$key}: #{$value};
    }
  }
}
```

### 20. Why is `/` for division deprecated, and which built-in modules do you use?
`/` is ambiguous with CSS separators like `font: 12px/1.5`. Use `math.div()` or `calc()`.

Common modules:
- `sass:math`: `div`, `round`, `clamp`
- `sass:map`: `get`, `merge`, `deep-merge`, `has-key`
- `sass:color`: `adjust`, `scale`, `mix`. These replace deprecated `lighten()` and `darken()`.
- `sass:meta`: `load-css` (include a module's CSS inside a nested scope, which `@use` can't do), `inspect`

### 21. What rules do you enforce on nesting?
Nest **three levels at most**, and don't nest just to mirror the DOM. Enforce with Stylelint: `max-nesting-depth`, `selector-max-specificity`, `scss/at-extend-no-missing-placeholder`.

### 22. How do you keep CSS output small in a large codebase?
- Keep tokens and mixins non-emitting.
- Avoid `@extend` across files.
- Purge unused utility classes and watch for loops emitting huge class matrices.
- Use CSS Modules or per-route code splitting, and inline critical CSS.
- Audit output size in CI.

### 23. SCSS vs CSS Modules vs CSS-in-JS vs Tailwind: how do you choose?
- **SCSS + CSS Modules:** zero runtime cost, scoped class names, familiar tooling.
- **Runtime CSS-in-JS:** runtime cost and SSR complexity. The industry is moving toward zero-runtime options like vanilla-extract and Panda CSS.
- **Tailwind:** speed and consistency, at the cost of noisier markup.

SCSS still shines for design-system internals and token generation.

### 24. Scenario: a button looks different on two pages. How do you investigate?
1. In DevTools, check **which rule wins and why**: specificity, source order, or a cascade layer.
2. Trace it to SCSS via **source maps**. Use `@debug` and `@warn` if needed.
3. Look for **global leakage** (an unscoped `button {}`), `@extend` side effects, or duplicate imports.

**Fixes:** scope styles (CSS Modules or BEM), lower specificity with `:where()`, or order styles explicitly with `@layer`.

---

## Bonus: Modern CSS Awareness

### 25. Native CSS now has nesting, layers, and container queries. Does SCSS still earn its place, and what should you know?
Yes. Native CSS covers nesting, but SCSS still provides modules, functions, mixins, loops, maps, and token generation. Know these modern features too:
- **`@layer`:** declares an explicit order (`reset, base, components, utilities`) so later layers win regardless of specificity.
- **`:where()` vs `:is()`:** `:where()` has zero specificity, ideal for resets. `:is()` takes its most specific argument's specificity.
- **Container queries:** respond to the parent container's size, not the viewport, making components truly reusable.
- **Logical properties** (`margin-inline`, `padding-block`): RTL support without overrides.

```scss
@layer reset, base, components, utilities;

@layer components {
  .btn { padding: 8px 16px; }
}
```

---

*Tip: pair every basic answer with one trade-off or pitfall. That habit signals seniority more than any memorized fact.*
