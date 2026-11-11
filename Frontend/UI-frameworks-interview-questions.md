# UI Frameworks Interview Questions: MUI, Bootstrap & Tailwind CSS

Basics to senior questions for the three most-asked UI frameworks, each with the answer an interviewer is listening for.

**Versions to know (as of late 2026)**
- **Material UI:** v9 (April 2026). MUI jumped from v7 straight to v9 (there is no v8) to align versions with MUI X.
- **Tailwind CSS:** v4.3. v4 introduced CSS-first config (`@import "tailwindcss"` + `@theme`) and the Rust-based Oxide engine.
- **Bootstrap:** 5.3.x is the stable line. Bootstrap 6 is in alpha.

**Where to focus:** service companies and bank projects still use Bootstrap and MUI heavily. Product companies and startups increasingly use Tailwind with shadcn/ui.

---

## Table of Contents

1. [Material UI (Q1–9)](#material-ui-mui)
2. [Bootstrap (Q10–18)](#bootstrap)
3. [Tailwind CSS (Q19–27)](#tailwind-css)
4. [Cross-Framework Questions (Q28–30)](#cross-framework-questions)

---

## Material UI (MUI)

### Basics

#### 1. What is MUI?
A React component library implementing Material Design. It provides prebuilt, accessible components (Button, TextField, Dialog, Autocomplete) plus a theming system.

#### 2. How do you customize the theme?
Use `createTheme()` and `<ThemeProvider>` to set the palette, typography, spacing, breakpoints, and component defaults.
```jsx
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: { primary: { main: '#0055ff' } },
  typography: { fontFamily: 'Inter, sans-serif' },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
  },
});

export default function App() {
  return <ThemeProvider theme={theme}>{/* app */}</ThemeProvider>;
}
```

#### 3. `sx` vs `styled()` vs theme overrides: when do you use each?
| Approach | Use it for |
|---|---|
| **`sx` prop** | One-off styles on a single instance. Understands theme values (`p: 2`, `color: 'primary.main'`). |
| **`styled()`** | Reusable styled components. |
| **`theme.components.MuiX.styleOverrides`** | Changing every instance of a component globally. |

```jsx
<Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 1 }} />

const Card = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
}));
```

### Intermediate

#### 4. How does responsive styling work?
- Breakpoint objects: `sx={{ width: { xs: '100%', md: '50%' } }}`
- Hook: `useMediaQuery(theme.breakpoints.up('md'))`
- Grid component with the `size` prop for responsive columns:
```jsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
</Grid>
```

#### 5. What are `slots` and `slotProps`?
The modern API for customizing a component's inner parts, such as the input inside a TextField or the popper inside an Autocomplete, without hacking class names.
```jsx
<Autocomplete
  slotProps={{ popper: { placement: 'bottom-start' } }}
  options={options}
  renderInput={(params) => <TextField {...params} />}
/>
```

#### 6. How do you implement dark mode correctly?
- Enable CSS variables in the theme with `colorSchemes: { light: true, dark: true }` and `cssVariables: true`.
- Switch modes with the `useColorScheme()` hook.
- With SSR (e.g. Next.js), add `InitColorSchemeScript` to prevent a flash of the wrong theme.
```jsx
const theme = createTheme({
  cssVariables: true,
  colorSchemes: { light: true, dark: true },
});

function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return <Button onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>Toggle</Button>;
}
```

### Senior

#### 7. What performance problems does MUI have, and how do you fix them?
The default styling engine (Emotion) generates CSS at runtime. Heavy `sx` usage in long lists or tables re-computes styles on every render.

**Fixes:**
- Move styles into `styled()` components defined outside render.
- Virtualize long lists (e.g. `react-window`).
- Use path imports or rely on tree-shaking to keep the bundle small.
- Avoid inline theme computations in hot paths.
- For large data tables, use MUI X Data Grid, which virtualizes for you.

#### 8. How do you add a custom palette color in TypeScript?
Use module augmentation:
```ts
declare module '@mui/material/styles' {
  interface Palette { brand: Palette['primary'] }
  interface PaletteOptions { brand?: PaletteOptions['primary'] }
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides { brand: true }
}

// Now this type-checks:
<Button color="brand">Save</Button>
```

#### 9. How would you build a company design system on top of MUI?
- **Wrap** MUI components in your own (`<AppButton>`) so you can swap or upgrade libraries later.
- **Centralize tokens** in the theme.
- **Lock down variants** so teams can't invent one-off styles.
- **Document** everything in Storybook.
- **Avoid styling MUI components directly** from feature code.

---

## Bootstrap

### Basics

#### 10. How does the grid work?
A 12-column Flexbox grid: `.container` → `.row` → `.col-*`. Breakpoints are `sm`, `md`, `lg`, `xl`, `xxl`, and the grid is mobile-first.
```html
<div class="container">
  <div class="row">
    <div class="col-12 col-md-6">Left</div>
    <div class="col-12 col-md-6">Right</div>
  </div>
</div>
```

#### 11. `.container` vs `.container-fluid`?
`.container` has a fixed max-width at each breakpoint. `.container-fluid` is always 100% wide.

#### 12. What are utility classes?
Spacing (`mt-3`, `px-2`), display (`d-flex`, `d-none d-md-block`), Flexbox (`justify-content-between`), text and color utilities. They reduce the amount of custom CSS you need.

### Intermediate

#### 13. What changed in Bootstrap 5?
- Dropped jQuery in favor of vanilla JS.
- Dropped IE support.
- Added the `xxl` breakpoint, RTL support, an expanded utility API, and CSS variables.
- 5.3 added color modes (dark mode).

#### 14. How do you customize Bootstrap properly?
Use the Sass source, not CSS overrides. Override `!default` variables and maps before importing Bootstrap, and import only the parts you need.
```scss
// custom.scss
$primary: #0055ff;
$enable-shadows: true;

@import 'bootstrap/scss/functions';
@import 'bootstrap/scss/variables';
@import 'bootstrap/scss/mixins';
@import 'bootstrap/scss/grid';
@import 'bootstrap/scss/buttons';
@import 'bootstrap/scss/utilities/api';
```

#### 15. How does dark mode work in 5.3?
Through color modes. Set `data-bs-theme="dark"` on `<html>` or any element, and Bootstrap's CSS variables switch accordingly.
```html
<html data-bs-theme="dark">
  ...
  <div data-bs-theme="light">This section stays light</div>
</html>
```

### Senior

#### 16. How do you use Bootstrap in a React app?
Use **React-Bootstrap** or **reactstrap** rather than Bootstrap's own JS. Bootstrap's JS manipulates the DOM directly, which conflicts with React's virtual DOM.

#### 17. Bootstrap's CSS is large. How do you reduce it?
- Import only the Sass modules you use.
- Purge unused classes with PurgeCSS.
- Disable unneeded features with `$enable-*` flags.

#### 18. When would you not choose Bootstrap?
For highly custom branded UIs, where you end up fighting the default look, or token-driven design systems. Bootstrap shines for admin panels, internal tools, and fast prototypes.

---

## Tailwind CSS

### Basics

#### 19. What is utility-first CSS?
You compose small, single-purpose classes (`flex`, `p-4`, `text-sm`) directly in markup instead of writing semantic CSS classes.
```html
<button class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Save
</button>
```

#### 20. How does responsive design work?
Mobile-first breakpoint prefixes: `w-full md:w-1/2 lg:w-1/3`. Unprefixed classes apply to all sizes; prefixed classes apply from that breakpoint up.

#### 21. How do states and dark mode work?
Through variants: `hover:bg-blue-600`, `focus-visible:ring-2`, `disabled:opacity-50`, `dark:bg-gray-900`, `group-hover:text-white`.

### Intermediate

#### 22. What changed in Tailwind v4?
- **CSS-first config** replaces `tailwind.config.js`.
- **Oxide engine** (Rust) makes builds much faster.
- **Automatic content detection**, so no `content` array is needed.
- **Native CSS features:** cascade layers, `@property`, `color-mix()`.
- **Theme values become CSS variables** automatically, making runtime theming easy.
```css
@import "tailwindcss";

@theme {
  --color-brand: #0055ff;
  --font-display: "Inter", sans-serif;
}
```
```html
<h1 class="font-display text-brand">Hello</h1>
```

#### 23. Why do dynamic class names break?
Tailwind scans source files for complete class names at build time, so a template like `bg-${color}-500` is never generated. Map values to complete class strings instead:
```js
// Breaks
<div className={`bg-${color}-500`} />

// Works
const bg = { success: 'bg-green-500', error: 'bg-red-500' };
<div className={bg[status]} />
```

#### 24. What are arbitrary values?
One-off values in brackets: `w-[372px]`, `grid-cols-[200px_1fr]`, `top-[calc(100%-1rem)]`. Useful, but overusing them signals missing design tokens.

### Senior

#### 25. How do you handle conflicting classes in reusable components?
Use `clsx` for conditional classes plus `tailwind-merge` to resolve conflicts, usually combined in a `cn()` helper (the shadcn/ui pattern). Use `cva` (class-variance-authority) for typed variants.
```ts
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cva } from 'class-variance-authority';

export const cn = (...inputs) => twMerge(clsx(inputs));

const button = cva('rounded-lg px-4 py-2 font-medium', {
  variants: {
    intent: {
      primary: 'bg-blue-600 text-white',
      ghost: 'bg-transparent text-blue-600',
    },
  },
  defaultVariants: { intent: 'primary' },
});

<button className={cn(button({ intent: 'ghost' }), className)} />
```

#### 26. Should you use `@apply`?
Sparingly. It brings back the abstraction Tailwind avoids. For reuse, extract components (React components with their classes) instead. It's acceptable for third-party HTML you can't control.

#### 27. How do you answer "Tailwind makes markup messy"?
Acknowledge the trade-off, then the mitigations and benefits:
- **Mitigations:** component extraction (how you reuse in React anyway), the Prettier class-sorting plugin, `cva` for variants.
- **Benefits:** no naming debates, no dead CSS, small production bundles, consistency enforced through design tokens.

---

## Cross-Framework Questions

#### 28. How do the three compare?
| | MUI | Bootstrap | Tailwind |
|---|---|---|---|
| Type | React component library | CSS + JS framework | Utility-first CSS |
| Styling engine | CSS-in-JS (Emotion, runtime) | Sass, compiled | Build-time CSS generation |
| Runtime cost | Yes | Minimal | None |
| Customization | Theme object | Sass variables | `@theme` tokens |
| Best for | Enterprise dashboards and forms | Admin panels, prototypes | Custom-branded products |
| Accessibility | Built in | Partial | Your responsibility (or use Radix / shadcn) |

#### 29. Which would you choose for a new SaaS product, and why?
- **Custom brand and performance:** Tailwind with shadcn/ui or Radix primitives.
- **Data-heavy enterprise app that needs to ship fast:** MUI (plus MUI X for data grids and date pickers).
- **Internal tool or quick prototype:** Bootstrap.

Always justify with trade-offs: team familiarity, design requirements, bundle size, accessibility needs.

#### 30. How would you migrate from Bootstrap to Tailwind?
1. Migrate **incrementally, component by component**.
2. **Map Bootstrap variables to Tailwind tokens** in `@theme`.
3. **Run both side by side** using Tailwind's prefix option to avoid class collisions.
4. Guard every step with **visual regression tests** (Chromatic, Percy, or Playwright screenshots).
5. Remove Bootstrap once no components depend on it.

**Bonus: "Isn't Tailwind just inline styles?"**
No. Tailwind supports variants (hover, focus, responsive) that inline styles can't, constrains values to design tokens, supports media queries, and duplicate classes deduplicate in the CSS output.

---

*Tip: in framework rounds, interviewers care less about class names and more about trade-offs, customization strategy, and performance. Always explain why you'd choose an approach.*
