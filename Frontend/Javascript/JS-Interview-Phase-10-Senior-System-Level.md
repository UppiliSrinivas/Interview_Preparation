# JavaScript Interview Prep — Phase 10 – Senior Frontend JavaScript System-level Questions

**Part 10 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Prepare for 6-year frontend engineer discussions, architecture, debugging, and production use cases.

### Q216. How does JavaScript execution context work?

**A:** Every function call creates a new execution context, pushed onto the call stack, containing that scope's variables, `this` binding, and a reference to its outer (lexical) environment. Runs in two phases (see Q217).

```javascript
let a = "global";
function outer() {
  let b = "outer";
  function inner() {
    let c = "inner";
    console.log(a, b, c); // "global outer inner" - accesses all 3 via the scope chain
  }
  inner();
}
outer();
// Call stack while inner() runs: inner -> outer -> global (each is its own execution context)
```

**Trap:** "Execution context" and "scope" are related but distinct — the context is the runtime container (with `this`, variables, and the outer reference); the scope chain is what that container uses to resolve variable lookups.

### Q217. What is the difference between creation phase and execution phase? *(new)*

**A:** Every execution context runs in two passes: the **creation phase** sets up memory (hoists `var`s as `undefined`, hoists function declarations fully, and creates `this`) before any code runs; the **execution phase** then runs the code line by line, assigning actual values.

```javascript
console.log(x); // undefined - hoisted and initialized during creation phase
console.log(foo()); // "hi" - fully hoisted during creation phase

var x = 5; // execution phase: x is now actually assigned 5
function foo() {
  return "hi";
}
```

**Trap:** This two-phase model is the actual mechanism *behind* hoisting (Q11) — being able to explain hoisting in terms of "creation phase sets up undefined bindings first" is a noticeably stronger answer than just saying "declarations move to the top."

### Q218. How does hoisting work internally?

**A:** During the creation phase (Q217), the engine scans the code, allocates memory for every `var`/function declaration in the current scope, initializes `var`s to `undefined` and fully hoists function declarations — `let`/`const` are allocated but left uninitialized (the TDZ, Q13).

```javascript
function example() {
  console.log(a); // undefined - allocated + initialized in creation phase
  console.log(fn()); // works - function fully hoisted
  console.log(b); // ReferenceError - TDZ, allocated but not initialized

  var a = 1;
  let b = 2;
  function fn() {
    return "hoisted";
  }
}
example();
```

**Trap:** Hoisting isn't literally "moving code to the top" (a common but imprecise mental model) — it's that the engine pre-scans and allocates memory for declarations before executing anything, which produces the same observable effect without actually relocating any code.

### Q219. How does the event loop affect React rendering and browser responsiveness? *(new)*

**A:** React state updates and DOM rendering work happen within the browser's rendering pipeline, which itself competes with the event loop's task queues — long-running synchronous JS (a big `for` loop, a slow computation) blocks the main thread entirely, including React's ability to re-render or respond to input.

```javascript
function handleClick() {
  setLoading(true); // React schedules a re-render (batched)

  for (let i = 0; i < 5_000_000_000; i++) {} // blocks the main thread synchronously

  // The "loading" UI never actually PAINTS until this loop finishes,
  // even though setLoading(true) was already called - the browser can't
  // paint or process other events while the call stack is busy
}
```

**Trap:** React 18's concurrent rendering can yield back to the browser between chunks of rendering work for large trees, but it cannot interrupt YOUR synchronous code — a heavy computation inside an event handler still blocks everything regardless of React version; that's a job for a Web Worker (Q138) or breaking work into smaller async chunks.

### Q220. How do you optimize expensive JavaScript operations in the browser?

**A:**

```javascript
// 1. Debounce/throttle high-frequency triggers (Q194/195)
// 2. Move heavy computation off the main thread
const worker = new Worker("heavy-calc.js");

// 3. Break large synchronous work into chunks, yielding control back
function processLargeArray(arr, i = 0) {
  const chunkEnd = Math.min(i + 1000, arr.length);
  for (; i < chunkEnd; i++) {
    /* process arr[i] */
  }
  if (i < arr.length) {
    setTimeout(() => processLargeArray(arr, i), 0); // yield, then continue
  }
}

// 4. Memoize expensive pure computations (Q41/230)
// 5. Use requestIdleCallback for genuinely low-priority work
requestIdleCallback(() => {
  /* do work when the browser is idle */
});
```

**Trap:** `setTimeout(fn, 0)` as a "yield point" is a real, commonly used technique — it lets queued microtasks, rendering, and user input processing happen between chunks, even though it feels like a hack.

### Q221. How do you avoid blocking the main thread?

**A:** Offload genuinely CPU-heavy work to a Web Worker, chunk synchronous work with yield points, and avoid synchronous operations that block (like synchronous XHR, or `while` loops waiting on a condition).

```javascript
// Bad - blocks everything for however long this takes
function blockingSort(arr) {
  return arr.sort((a, b) => expensiveComparator(a, b));
}

// Better - run in a Worker
const worker = new Worker("sort-worker.js");
worker.postMessage(arr);
worker.onmessage = (e) => console.log("Sorted:", e.data);
```

**Trap:** The main thread also handles layout, paint, and user input — a blocked main thread isn't just "slow JS," it's a frozen, unresponsive page from the user's perspective, which is why this matters more than raw execution speed alone.

### Q222. When should you use Web Workers?

**A:** For genuinely CPU-intensive, long-running JS work that would otherwise freeze the UI — large data processing/parsing, image/video manipulation, complex calculations — NOT for simple async I/O (which `fetch`/Promises already handle without blocking).

```javascript
// GOOD use case: heavy computation
const worker = new Worker("prime-calculator.js");
worker.postMessage({ upTo: 10_000_000 });

// UNNECESSARY use case: a simple fetch (already async, doesn't need a Worker)
fetch("/api/data").then((res) => res.json()); // this never blocks the main thread anyway
```

**Trap:** A common misconception is that Workers make network requests "faster" — `fetch` is already non-blocking without a Worker; Workers only help when the bottleneck is actual **CPU computation**, not I/O waiting.

### Q223. How do you design a debounce function from scratch?

**A:**

```javascript
function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId); // cancel any pending call
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

const search = debounce((query) => console.log("Searching:", query), 300);
search("a");
search("ab");
search("abc"); // only THIS call actually fires, 300ms after the last keystroke
```

**Trap:** Using `fn.apply(this, args)` (not just `fn(...args)`) preserves the correct `this` context if `debounce` is used as an object method — an easy detail to forget that breaks `this`-dependent callbacks.

### Q224. How do you design a throttle function from scratch?

**A:**

```javascript
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const onScroll = throttle(() => console.log("scroll handled"), 200);
window.addEventListener("scroll", onScroll); // fires at most every 200ms
```

**Trap:** A common follow-up: this "leading edge" implementation fires immediately on the first call, then ignores calls until the cooldown ends — interviewers sometimes ask for a "trailing edge" variant too (fire once more after the cooldown if calls happened during it), which requires a bit more bookkeeping.

### Q225. How do you implement custom `Promise.all()`? *(new)*

**A:**

```javascript
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;

    if (promises.length === 0) return resolve([]);

    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((value) => {
          results[index] = value; // preserve original order, not completion order
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // fail-fast: first rejection rejects the whole thing
    });
  });
}

myPromiseAll([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]).then((r) =>
  console.log(r),
); // [1, 2, 3]
```

**Trap:** Results must be placed at `results[index]`, not pushed in completion order — since promises can resolve out of order, but `Promise.all()`'s contract guarantees the result array matches the INPUT order.

### Q226. How do you implement custom `Array.prototype.map()`?

**A:**

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) {
      // respects sparse arrays (see Q78) - skips holes
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

[1, 2, 3].myMap((x) => x * 2); // [2, 4, 6]
```

**Trap:** The real `map()` skips holes in sparse arrays and supports a `thisArg` second parameter — both easy to forget when reimplementing it, and exactly what interviewers check for in a "polyfill" question.

### Q227. How do you implement custom `Array.prototype.filter()`?

**A:**

```javascript
Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

[1, 2, 3, 4].myFilter((x) => x % 2 === 0); // [2, 4]
```

**Trap:** Same sparse-array-skipping (`i in this`) detail as `map` — a thorough implementation checks for it even though most interview answers skip this edge case.

### Q228. How do you implement custom `Array.prototype.reduce()`?

**A:**

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;

  if (acc === undefined) {
    if (this.length === 0) throw new TypeError("Reduce of empty array with no initial value");
    acc = this[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

[1, 2, 3, 4].myReduce((sum, x) => sum + x, 0); // 10
[1, 2, 3, 4].myReduce((sum, x) => sum + x); // 10 - no initial value, uses this[0]
```

**Trap:** The "no initial value provided" branch is the part almost everyone gets wrong on the first try — real `reduce()` uses the first element as the accumulator and starts iterating from index 1, and throws on an empty array with no initial value.

### Q229. How do you implement deep clone?

**A:**

```javascript
function deepClone(obj, seen = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj; // primitives - return as-is
  if (seen.has(obj)) return seen.get(obj); // handle circular references

  const clone = Array.isArray(obj) ? [] : {};
  seen.set(obj, clone);

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], seen);
    }
  }
  return clone;
}

const original = { a: 1, nested: { b: 2 } };
original.self = original; // circular reference
const clone = deepClone(original);
clone.nested.b = 99;
console.log(original.nested.b); // 2 - independent
console.log(clone.self === clone); // true - circular reference preserved correctly
```

**Trap:** Handling circular references (via the `seen` WeakMap tracking already-cloned objects) is exactly what separates a senior-level answer from a naive recursive clone that would otherwise infinite-loop and crash. For production code, `structuredClone()` (Q168) handles this natively and should be preferred over a hand-rolled version.

### Q230. How do you implement memoization?

**A:**

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key); // cache hit
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const slowSquare = (n) => {
  for (let i = 0; i < 1e8; i++) {} // simulate expensive work
  return n * n;
};
const fastSquare = memoize(slowSquare);
fastSquare(5); // slow the first time
fastSquare(5); // instant - served from cache
```

**Trap:** `JSON.stringify(args)` as the cache key breaks down for non-serializable arguments (functions, `undefined`, circular objects) and for object arguments where key order might differ — fine for simple primitive-argument functions, but not a universal solution.

### Q231. How do you implement currying?

**A:**

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...next) => curried.apply(this, [...args, ...next]);
  };
}

const sum3 = curry((a, b, c) => a + b + c);
sum3(1, 2, 3); // 6 - all at once
sum3(1)(2)(3); // 6 - one at a time
sum3(1, 2)(3); // 6 - mixed
```

**Trap:** `fn.length` (used to know how many arguments to wait for) doesn't count rest parameters or parameters with default values — `curry((a, b, ...rest) => {})` would have `fn.length === 2`, silently ignoring the rest params in the arity check.

### Q232. How do you implement an event emitter/pub-sub?

**A:**

```javascript
class EventEmitter {
  #events = new Map();

  on(event, listener) {
    if (!this.#events.has(event)) this.#events.set(event, []);
    this.#events.get(event).push(listener);
    return this; // chainable
  }

  off(event, listener) {
    const listeners = this.#events.get(event) || [];
    this.#events.set(event, listeners.filter((l) => l !== listener));
  }

  emit(event, ...args) {
    (this.#events.get(event) || []).forEach((listener) => listener(...args));
  }
}

const emitter = new EventEmitter();
const onUserLogin = (name) => console.log(`${name} logged in`);
emitter.on("login", onUserLogin);
emitter.emit("login", "John"); // "John logged in"
emitter.off("login", onUserLogin);
```

**Trap:** A production-grade version needs to guard against a listener that removes itself (or another listener) *while* `emit` is iterating — iterating over a snapshot/copy of the listeners array avoids skipping entries due to mutation during iteration.

### Q233. How do you handle race conditions in API calls? *(new)*

**A:** The classic problem: two requests fire (e.g., search-as-you-type), but the *older* one resolves *after* the newer one, overwriting fresher data with stale results. Fix with a request ID/token check, or `AbortController`.

```javascript
let latestRequestId = 0;

async function search(query) {
  const requestId = ++latestRequestId;
  const results = await fetch(`/api/search?q=${query}`).then((r) => r.json());

  if (requestId !== latestRequestId) return; // a newer request has since started - discard this stale result
  renderResults(results);
}

// Alternative: AbortController - cancel the actual in-flight request
let controller;
async function searchWithAbort(query) {
  controller?.abort(); // cancel any previous in-flight request
  controller = new AbortController();
  const results = await fetch(`/api/search?q=${query}`, { signal: controller.signal }).then((r) =>
    r.json(),
  );
  renderResults(results);
}
```

**Trap:** Debouncing (Q194) reduces HOW OFTEN requests fire, but doesn't guarantee response ORDER — even a debounced search can still race if network latency varies, so race-condition handling is a genuinely separate concern from debouncing.

### Q234. How do you prevent duplicate API calls? *(new)*

**A:** Track in-flight requests and return the existing Promise instead of firing a new one, for the same logical request.

```javascript
const pendingRequests = new Map();

function dedupedFetch(url) {
  if (pendingRequests.has(url)) {
    return pendingRequests.get(url); // reuse the in-flight request
  }
  const promise = fetch(url)
    .then((res) => res.json())
    .finally(() => pendingRequests.delete(url)); // clean up once settled

  pendingRequests.set(url, promise);
  return promise;
}

// Both calls made in quick succession share the SAME underlying request:
dedupedFetch("/api/user/1");
dedupedFetch("/api/user/1"); // returns the same pending Promise, no second network call
```

**Trap:** The `.finally()` cleanup is essential — without it, the cache entry never gets removed, meaning after the request completes you'd keep returning a stale, already-resolved Promise for every future call to that URL.

### Q235. How do you retry failed API calls? *(new)*

**A:** Wrap the request in a retry loop with a delay (ideally exponential backoff) between attempts, and a maximum retry count.

```javascript
async function fetchWithRetry(url, retries = 3, backoff = 500) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((resolve) => setTimeout(resolve, backoff));
    return fetchWithRetry(url, retries - 1, backoff * 2); // exponential backoff
  }
}
```

**Trap:** Blindly retrying every failure is a mistake — retry only on transient errors (network failures, 5xx server errors), never on 4xx client errors (like 401/404), since retrying a request that's fundamentally wrong just wastes time and load.

### Q236. How do you cancel stale API requests?

**A:** `AbortController`, tied to whatever triggers the "this response is no longer needed" condition (component unmount, a newer request superseding it, user navigating away).

```javascript
function useSearch(query) {
  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/search?q=${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then(setResults)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err); // ignore expected aborts
      });

    return () => controller.abort(); // cleanup: cancel if query changes or component unmounts
  }, [query]);
}
```

**Trap:** This is the React `useEffect` cleanup pattern specifically designed for this problem — forgetting the `return () => controller.abort()` cleanup is one of the most common sources of the "setState on unmounted component" warning.

### Q237. How do you handle large JSON data in the frontend? *(new)*

**A:** Avoid parsing/rendering everything at once — paginate or stream from the server if possible, virtualize long lists (render only visible rows), and move heavy parsing/filtering off the main thread if it's unavoidably large.

```javascript
// 1. Virtualization - only render visible rows (conceptual; libraries like
//    react-window / react-virtualized implement this properly)
function getVisibleRows(allRows, scrollTop, rowHeight, viewportHeight) {
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = startIndex + Math.ceil(viewportHeight / rowHeight);
  return allRows.slice(startIndex, endIndex);
}

// 2. Process large JSON off the main thread
const worker = new Worker("json-processor.js");
worker.postMessage(hugeJsonString);
worker.onmessage = (e) => console.log("Processed:", e.data);

// 3. Prefer streaming/pagination over one giant payload wherever the API allows it
```

**Trap:** `JSON.parse()` on a genuinely huge string (tens of MB+) is itself synchronous and blocks the main thread — moving that parsing into a Web Worker is a real, necessary technique, not just an optimization nicety, once payloads get large enough.

### Q238. How do you improve JavaScript bundle performance?

**A:**

```javascript
// 1. Tree shaking (Q191) - eliminate unused exports (relies on ES modules)
// 2. Code splitting (Q192) - load only what's needed per route/feature
const Dashboard = React.lazy(() => import("./Dashboard"));

// 3. Minification/compression (handled by build tools - Terser, Brotli/gzip)
// 4. Analyze what's actually IN the bundle before optimizing blindly:
//    `npx webpack-bundle-analyzer` or Vite's built-in visualizer plugin

// 5. Avoid large dependencies for small needs (e.g. a whole date library for one format call)
```

**Trap:** "Optimize the bundle" without first measuring what's actually large is a common wrong first move — always profile with a bundle analyzer before guessing at what to cut or split.

### Q239. How do you debug production JavaScript errors? *(new)*

**A:** Source maps to map minified stack traces back to original code, an error-monitoring service (Sentry, Datadog, etc.) to capture errors with context, and structured logging around critical operations.

```javascript
// 1. Upload source maps to your error monitoring service at deploy time
//    (never ship source maps publicly if the code is proprietary - upload separately)

// 2. Global error handlers report to the monitoring service (see Q175-177)
window.addEventListener("error", (e) => {
  errorMonitoringService.captureException(e.error, {
    url: window.location.href,
    userAgent: navigator.userAgent,
  });
});

window.addEventListener("unhandledrejection", (e) => {
  errorMonitoringService.captureException(e.reason);
});

// 3. Add breadcrumbs / context before risky operations for easier reproduction
```

**Trap:** Without source maps uploaded to your monitoring tool, production error stack traces are just minified, unreadable gibberish (`at t.a (main.a3f1.js:1:24521)`) — this is one of the most commonly forgotten deploy steps that silently cripples debugging capability.

### Q240. How do you explain JavaScript memory management in an interview?

**A:** A clean, structured answer: JS allocates memory automatically (variable declarations, object creation), and frees it automatically via garbage collection (mark-and-sweep — Q188) once objects become unreachable. As the engineer, your job is to avoid *unintentionally* keeping things reachable (leaks — Q185/186), and to use weak references (`WeakMap`/`WeakSet` — Q190) when you want to associate data with an object's lifecycle without controlling it.

```javascript
// A concise structure to walk through out loud:
// 1. Allocation - happens automatically (object literals, function calls, etc.)
// 2. Use - reading/writing the allocated memory
// 3. Release - garbage collector frees memory once nothing references it anymore
// 4. Common leak sources - forgotten listeners/timers, growing caches, detached DOM nodes
// 5. Tools - Chrome DevTools Memory tab (heap snapshots, allocation timelines)
```

**Trap:** The strongest answers connect the theory to something concrete you've actually debugged (a specific leak you found and fixed) — reciting the mark-and-sweep algorithm alone reads as memorized; pairing it with a real diagnostic story (Q187's heap-snapshot workflow) reads as senior-level.

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
