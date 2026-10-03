# Phase 15 - Accessibility (A11Y) — Questions & Answers

# Basics

### Q304. What is Accessibility?
Designing and building apps so people with disabilities (visual, hearing, motor, cognitive) can use them — including with screen readers, keyboards, and voice control.

### Q305. Why Accessibility Matters?
Inclusivity, legal compliance (ADA, EAA, Section 508), better SEO and usability for everyone (e.g., keyboard users, bright sunlight, slow connections), and a bigger user base.

### Q306. Accessibility Best Practices
- Use semantic HTML first
- Ensure keyboard access and visible focus
- Provide text alternatives (`alt`, labels)
- Maintain color contrast (WCAG AA: 4.5:1 for body text)
- Don't rely on color alone
- Manage focus in modals/route changes
- Announce dynamic changes (`aria-live`)
- Test with a screen reader and axe/Lighthouse

---

# Semantic HTML

### Q307. Semantic HTML
Using elements that describe their meaning (`<button>`, `<nav>`, `<main>`) rather than generic `<div>`/`<span>`.

### Q308. Common Semantic Tags
`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`, `<button>`, `<form>`, `<label>`, `<h1>–<h6>`, `<ul>/<ol>`, `<table>`.

### Q309. Benefits of Semantic HTML
Built-in keyboard and screen-reader support, better SEO, cleaner code, and less need for ARIA.
```jsx
// ❌ <div onClick={save}>Save</div>
// ✅ <button onClick={save}>Save</button>
```

---

# ARIA

### Q310. What is ARIA?
**Accessible Rich Internet Applications**: attributes that add accessibility info (roles, states, properties) when native HTML can't express it.

### Q311. ARIA Roles
Define what an element *is*: `role="dialog"`, `role="alert"`, `role="tablist"`, `role="navigation"`. Native elements already have implicit roles.

### Q312. ARIA Labels
Provide an accessible name:
```jsx
<button aria-label="Close dialog">✕</button>
<input aria-labelledby="nameLabel" />
<p id="hint">Min 8 chars</p><input aria-describedby="hint" />
```

### Q313. ARIA Best Practices
1. **First rule**: use native HTML if it exists.
2. Don't change native semantics unnecessarily.
3. All interactive ARIA controls must be keyboard operable.
4. Don't use `role="presentation"`/`aria-hidden` on focusable elements.
5. Keep states updated (`aria-expanded`, `aria-selected`).
*No ARIA is better than bad ARIA.*

---

# Accessibility Features

### Q314. Screen Readers
Software that reads UI aloud or outputs braille (NVDA, JAWS, VoiceOver, TalkBack). They rely on semantics, labels, and focus order, so proper markup is essential.

### Q315. Keyboard Navigation
All functionality must work without a mouse: `Tab`/`Shift+Tab` to move, `Enter`/`Space` to activate, arrow keys in widgets, `Esc` to close. Keep a logical tab order and never remove the focus outline without a replacement.

### Q316. Focus Management
Move focus intentionally when UI changes: into a modal on open (trap focus), back to the trigger on close, to the page heading after route changes.
```jsx
useEffect(() => { dialogRef.current?.focus(); }, []);
// <div role="dialog" tabIndex={-1} ref={dialogRef}>
```

### Q317. alt Attribute
Text alternative for images.
- Informative image: describe its purpose → `alt="Sales chart showing 20% growth"`
- Decorative image: empty `alt=""` so screen readers skip it.

### Q318. WCAG Guidelines
**Web Content Accessibility Guidelines** built on four principles (POUR): **Perceivable, Operable, Understandable, Robust**. Levels: A, AA (the common legal target), AAA.
