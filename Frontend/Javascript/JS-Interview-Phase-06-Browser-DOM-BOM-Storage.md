# JavaScript Interview Prep — Phase 6 – Browser APIs, DOM, BOM & Storage

**Part 6 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Prepare for browser-based frontend engineering questions.

### Q121. What is the DOM? *(new)*

**A:** The Document Object Model — a live, tree-structured, in-memory representation of an HTML page that JS can read and manipulate. Each HTML tag becomes a node object with properties and methods.

```javascript
document.title; // reads the page title
const el = document.getElementById("app");
el.textContent = "Hello"; // mutating the DOM updates what's rendered
document.querySelector(".card"); // CSS-selector-based lookup
```

**Trap:** The DOM is not part of the JS language itself — it's a separate Web API the browser exposes; the same JS engine running in Node has no DOM at all.

### Q122. What is the difference between DOM and BOM? *(new)*

**A:** The **DOM** represents the page content (`document` and its tree); the **BOM** (Browser Object Model) represents the browser window itself — history, location, navigator, screen.

```javascript
// DOM - the page content
document.querySelector("h1").textContent;

// BOM - the browser environment
window.location.href; // current URL
window.history.back(); // navigation
window.navigator.userAgent; // browser info
window.screen.width; // display size
```

**Trap:** `document` is technically a *property of* `window` (part of the BOM), which is why `document.getElementById()` and `window.document.getElementById()` are identical — the DOM lives inside the BOM's `window` object.

### Q123. What is event bubbling?

**A:** Events propagate from the target element up through its ancestors (child → parent → ... → document).

```javascript
document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent clicked");
});
document.getElementById("child").addEventListener("click", () => {
  console.log("Child clicked");
});
// Clicking child logs: "Child clicked" then "Parent clicked"
```

**Trap:** Not all events bubble — `focus`, `blur`, and a few others don't, which is exactly why `focusin`/`focusout` (bubbling versions) exist as alternatives.

### Q124. What is event capturing?

**A:** The opposite direction to bubbling — the event travels from `document` down to the target *before* bubbling back up. Enabled by passing `true` (or `{capture: true}`) as `addEventListener`'s third argument.

```javascript
parent.addEventListener("click", () => console.log("Parent - capture"), { capture: true });
child.addEventListener("click", () => console.log("Child - bubble"));
// Clicking child logs: "Parent - capture" then "Child - bubble"
```

**Trap:** The three phases in order are: capturing (document → target) → target → bubbling (target → document) — most listeners default to the bubble phase, which is why capturing is easy to forget exists.

### Q125. What is event delegation?

**A:** Attaching a single listener to a parent element instead of one per child, relying on bubbling to catch events from descendants — especially useful for dynamically added elements.

```javascript
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.matches("li")) {
    console.log("Clicked item:", e.target.textContent);
  }
});
// Works even for <li> elements added to the list AFTER this listener was set up
```

**Trap:** The main benefit isn't just fewer listeners — it's that delegation automatically covers elements added *later*, which direct per-element listeners never would without re-binding.

### Q126. What is `event.preventDefault()`? *(new)*

**A:** Stops the browser's default action for an event (following a link, submitting a form, showing a context menu) without stopping the event from propagating.

```javascript
document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault(); // stop the page from reloading
  // handle submission with JS (e.g., fetch) instead
});

document.querySelector("a").addEventListener("click", (e) => {
  e.preventDefault(); // stop navigation
});
```

**Trap:** `preventDefault()` and `stopPropagation()` (Q127) do completely different things and are often confused — `preventDefault` stops the browser's built-in behavior; `stopPropagation` stops the event from bubbling/capturing further.

### Q127. What is `event.stopPropagation()`?

**A:** Stops an event from continuing to bubble (or capture) to ancestor elements — other listeners on the *same* element still run.

```javascript
child.addEventListener("click", (event) => {
  event.stopPropagation(); // prevents the event from reaching ancestors
  console.log("Only this handler runs, parent's listener never fires");
});
```

**Trap:** `stopImmediatePropagation()` is the stronger sibling — it also blocks *other listeners on the same element*, not just ancestors, which plain `stopPropagation()` doesn't do.

### Q128. What is the difference between `target` and `currentTarget`? *(new)*

**A:** `event.target` is the element that actually triggered the event (where the click/etc. happened); `event.currentTarget` is the element the listener is attached to — they only match when there's no bubbling involved.

```javascript
document.getElementById("parent").addEventListener("click", (e) => {
  console.log(e.target); // the actual element clicked (could be a nested child)
  console.log(e.currentTarget); // always #parent - where THIS listener lives
});
```

**Trap:** Inside event delegation (Q125), `target` is what you almost always want to inspect (`e.target.matches(...)`) — using `currentTarget` there just gives you back the parent you already know about.

### Q129. What is the difference between `window`, `document`, and `screen`? *(new)*

**A:** `window` is the global browser object (everything lives on it); `document` is the DOM tree for the current page (a property of `window`); `screen` holds physical display info (monitor resolution), independent of the browser window's size.

```javascript
window.innerWidth; // browser viewport width
document.body; // the page's <body> element
screen.width; // the user's MONITOR width, not the browser window
screen.availHeight; // usable screen height minus OS taskbars, etc.
```

**Trap:** `screen.width` is often mistaken for the viewport size — for the actual visible browser area, use `window.innerWidth`/`innerHeight` instead.

### Q130. What is localStorage?

**A:** Key-value storage (strings only) that persists across browser sessions/tabs, scoped per origin, with no expiration until explicitly cleared.

```javascript
localStorage.setItem("theme", "dark");
localStorage.getItem("theme"); // "dark"
localStorage.removeItem("theme");
localStorage.clear(); // wipes everything for this origin

localStorage.setItem("user", JSON.stringify({ name: "John" })); // objects need serializing
const user = JSON.parse(localStorage.getItem("user"));
```

**Trap:** Storage limits (~5-10MB depending on browser) and synchronous API — reading/writing large amounts of data can block the main thread briefly.

### Q131. What is sessionStorage?

**A:** Same API as `localStorage`, but scoped to a single tab/window session — cleared when that tab closes, and not shared across tabs even to the same site.

```javascript
sessionStorage.setItem("formDraft", JSON.stringify({ step: 2 }));
sessionStorage.getItem("formDraft");
// Opening the same site in a NEW tab gets a completely separate sessionStorage
```

**Trap:** Duplicating a tab (browser "duplicate tab" feature) copies `sessionStorage` to the new tab; opening a fresh tab and navigating there does not.

### Q132. What is the difference between cookie, localStorage, and sessionStorage? *(new)*

**A:**

| | Sent to server? | Capacity | Lifetime | Access |
| --- | --- | --- | --- | --- |
| Cookie | Yes, on every request | ~4KB | Set expiry, or session | JS + server |
| localStorage | No | ~5-10MB | Until cleared | JS only |
| sessionStorage | No | ~5-10MB | Until tab closes | JS only |

```javascript
document.cookie = "token=abc123; max-age=3600"; // sent automatically with requests
localStorage.setItem("theme", "dark"); // never sent to server
```

**Trap:** Cookies being sent with *every* HTTP request is both their defining feature (needed for server-side auth) and their biggest cost (added payload on every request) — that trade-off is exactly why localStorage exists for pure client-side data.

### Q133. Why do we need cookies? *(new)*

**A:** They're the only client storage mechanism automatically sent to the server with every request — essential for stateless HTTP to maintain sessions (login state, auth tokens) across page loads.

```javascript
// Server sets a cookie via response header: Set-Cookie: sessionId=abc123; HttpOnly
// Browser automatically includes it on every subsequent request to that domain
document.cookie; // "sessionId=abc123" - readable in JS unless HttpOnly is set
```

**Trap:** `HttpOnly` cookies (set only by the server) are invisible to `document.cookie` entirely — a key security feature that prevents JS (and therefore XSS attacks, see Q179) from stealing session tokens.

### Q134. How do you create, read, update, and delete cookies? *(new)*

**A:** All through the single `document.cookie` string property — reading returns everything, writing appends/updates one cookie at a time.

```javascript
// Create / Update (same operation - matching name overwrites)
document.cookie = "username=John; max-age=3600; path=/";

// Read (returns ALL cookies as one semicolon-separated string)
console.log(document.cookie); // "username=John; theme=dark"

// Delete (set max-age to 0 or a past expiry date)
document.cookie = "username=; max-age=0; path=/";
```

**Trap:** There's no `document.cookie.get(name)` — you have to manually parse the semicolon-delimited string yourself (or use a small helper function) to read an individual cookie's value.

### Q135. What are cookie options like expiry and path? *(new)*

**A:**

```javascript
document.cookie =
  "token=abc123; " +
  "max-age=3600; " + // expires in 3600 seconds
  "expires=Fri, 31 Dec 2026 23:59:59 GMT; " + // or an absolute date
  "path=/; " + // available on all paths under this domain
  "domain=example.com; " + // which domain(s) it's sent to
  "secure; " + // only sent over HTTPS
  "samesite=Strict"; // blocks cross-site sending (CSRF protection, see Q181)
```

**Trap:** `HttpOnly` can only be set by the **server** via the `Set-Cookie` response header — it cannot be set from client-side JavaScript at all, which is the whole point (protects it from XSS).

### Q136. What is a storage event? *(new)*

**A:** Fires on `window` in **other tabs/windows** of the same origin when `localStorage` changes — lets tabs stay in sync (e.g., logging out in one tab logs out all tabs).

```javascript
window.addEventListener("storage", (e) => {
  console.log(e.key); // which key changed
  console.log(e.oldValue, e.newValue);
  console.log(e.url); // which page made the change
});

// In another tab: localStorage.setItem('loggedOut', 'true');
// This tab's storage listener fires automatically
```

**Trap:** The event does **NOT** fire in the same tab/window that made the change — only in other tabs listening to the same origin's storage, a very common point of confusion.

### Q137. What is IndexedDB?

**A:** A low-level, transactional, NoSQL-style client-side database for large amounts of structured data — asynchronous API, supports indexes, far more capacity than localStorage.

```javascript
const request = indexedDB.open("MyDB", 1);
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  db.createObjectStore("users", { keyPath: "id" });
};
request.onsuccess = (e) => {
  const db = e.target.result;
  const tx = db.transaction("users", "readwrite");
  tx.objectStore("users").add({ id: 1, name: "John" });
};
```

**Trap:** Its raw callback-based API is notoriously verbose — in real projects, most teams reach for a wrapper library (like `idb`) rather than using it directly.

### Q138. What is Web Worker?

**A:** Runs JS on a **separate background thread**, off the main thread — for CPU-intensive work that would otherwise freeze the UI. Communicates with the main thread via `postMessage`.

```javascript
// main.js
const worker = new Worker("worker.js");
worker.postMessage({ command: "start", data: [1, 2, 3] });
worker.onmessage = (e) => console.log("From worker:", e.data);

// worker.js
self.onmessage = (e) => {
  const result = e.data.data.map((x) => x * 2);
  self.postMessage(result);
};
```

**Trap:** Workers run in a completely separate global scope — no access to `window`, `document`, or the DOM at all (see Q139).

### Q139. What are the restrictions of Web Workers?

**A:**

```javascript
// Inside a worker file, ALL of these are unavailable:
// - document, window (no DOM access at all)
// - Direct access to variables in the main thread's scope
// - Synchronous XHR is deprecated; most DOM-dependent APIs are off-limits

// Available instead:
// - fetch(), XMLHttpRequest (async)
// - setTimeout/setInterval
// - IndexedDB
// - postMessage() for communication with the main thread
```

**Trap:** Because there's no DOM access, workers can only communicate via `postMessage` (structured-clone serialized, not shared memory by default) — you can't have a worker directly mutate the page.

### Q140. What is `postMessage`? *(new)*

**A:** The standard API for sending messages across execution contexts that don't share memory — between a page and its Web Worker, or between a page and a cross-origin iframe/popup window.

```javascript
// Worker communication
worker.postMessage({ type: "START" });

// Cross-origin window communication (e.g., with an iframe)
iframe.contentWindow.postMessage("hello", "https://trusted-origin.com");

window.addEventListener("message", (e) => {
  if (e.origin !== "https://trusted-origin.com") return; // ALWAYS verify origin
  console.log(e.data);
});
```

**Trap:** Always check `event.origin` inside the listener — skipping this check means any page on the internet could send your window a message and have it trusted, a real security hole.

### Q141. What is CORS?

**A:** Cross-Origin Resource Sharing — a browser security mechanism that blocks JS from one origin making requests to a different origin, unless the server explicitly allows it via response headers.

```javascript
fetch("https://api.other-site.com/data")
  .then((res) => res.json())
  .catch((err) => console.error(err));
// Fails unless api.other-site.com responds with:
// Access-Control-Allow-Origin: <your-origin-or-*>
```

**Trap:** CORS is enforced by the **browser**, not the server — the request still reaches the server and can still execute (e.g., a POST still happens); the browser just blocks the *response* from reaching your JS.

### Q142. What is same-origin policy? *(new)*

**A:** The browser security model CORS is an *exception to* — by default, a page can only freely interact with resources (via JS: reading responses, accessing cookies/localStorage) from the exact same origin (protocol + domain + port).

```javascript
// https://example.com:443 and https://example.com:8080 are DIFFERENT origins (port differs)
// https://example.com and http://example.com are DIFFERENT origins (protocol differs)
// https://app.example.com and https://example.com are DIFFERENT origins (subdomain differs)

fetch("https://example.com/api"); // from https://example.com - allowed, same origin
fetch("https://other.com/api"); // blocked by same-origin policy, unless CORS allows it
```

**Trap:** Origin comparison is exact on all three parts (protocol, domain, port) — even a different port on the same domain counts as cross-origin, which trips up local development (`localhost:3000` vs `localhost:8080`).

### Q143. What is a service worker?

**A:** A script that runs in the background, separate from the page, acting as a programmable network proxy — enables offline support, caching strategies, and push notifications.

```javascript
navigator.serviceWorker.register("/sw.js");

// sw.js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request)),
  );
});
```

**Trap:** Requires HTTPS in production (localhost is exempted for development) — a service worker can intercept ALL network traffic for the page, so browsers restrict it to secure contexts only.

### Q144. What is browser caching? *(new)*

**A:** Storing previously fetched resources (scripts, images, API responses) locally so subsequent requests can be served instantly without hitting the network — controlled via HTTP headers.

```
Cache-Control: max-age=31536000, immutable   // cache for 1 year, never revalidate
Cache-Control: no-cache                       // always revalidate with server first
ETag: "abc123"                                // server-provided fingerprint for revalidation
```

```javascript
// Service workers (Q143) let you implement custom caching strategies in JS,
// on top of the browser's built-in HTTP cache
```

**Trap:** `no-cache` doesn't mean "don't cache" (that's `no-store`) — it means "cache it, but always revalidate with the server before using it," a very common misreading.

### Q145. What is critical rendering path? *(new)*

**A:** The sequence of steps the browser takes to convert HTML/CSS/JS into pixels on screen: parse HTML → build DOM → parse CSS → build CSSOM → combine into the Render Tree → Layout (compute positions/sizes) → Paint (draw pixels).

```
HTML  --parse-->  DOM  \
                        --> Render Tree --> Layout --> Paint --> Composite
CSS   --parse-->  CSSOM /
```

**Trap:** Render-blocking resources (synchronous `<script>` tags in `<head>`, external CSS) delay this whole pipeline — this is exactly why `defer`/`async` script attributes and critical-CSS inlining exist as optimization techniques.

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
