# JavaScript Interview Prep — Phase 5 – Asynchronous JavaScript & Event Loop

**Part 5 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Master the most important frontend interview area: async behavior.

### Q96. What is asynchronous programming in JavaScript? *(new)*

**A:** Running long-taking operations (network requests, timers, file I/O) without blocking the single main thread — the operation is handed off, and a callback/Promise resolves later while other code keeps running.

```javascript
console.log("1. Start");
setTimeout(() => console.log("2. Async work done"), 0);
console.log("3. End");
// Output order: 1, 3, 2 - synchronous code always runs before queued async callbacks
```

**Trap:** "Asynchronous" doesn't mean "multi-threaded" — JS remains single-threaded; async just means the engine can move on to other work instead of blocking while waiting.

### Q97. What is a callback?

**A:** A function passed to another function to be invoked later — the original mechanism for async work before Promises existed.

```javascript
function fetchData(callback) {
  setTimeout(() => callback("data loaded"), 1000);
}
fetchData((result) => console.log(result));
```

**Trap:** Not all callbacks are async (see Q28) — `Array.prototype.map`'s callback is fully synchronous.

### Q98. What is callback hell?

**A:** Deeply nested callbacks from chaining sequential async operations, producing unreadable, hard-to-maintain "pyramid of doom" code — the exact problem Promises were designed to solve.

```javascript
getUser(1, (user) => {
  getPosts(user.id, (posts) => {
    getComments(posts[0].id, (comments) => {
      console.log(comments); // 3 levels deep and growing
    }, handleError);
  }, handleError);
}, handleError);

function handleError(err) {}
```

**Trap:** The real pain isn't just indentation — it's error handling: each level needs its own error callback, and there's no single place to catch failures from any step.

### Q99. What is a Promise?

**A:** An object representing the eventual result (or failure) of an async operation — a cleaner alternative to nested callbacks, with built-in chaining and centralized error handling.

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    success ? resolve("data") : reject("error");
  }, 1000);
});

promise
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

**Trap:** A Promise's executor function runs **synchronously and immediately** when the Promise is constructed — only the resolve/reject callbacks are deferred.

### Q100. What are the three states of a Promise?

**A:**

```javascript
const p1 = new Promise((resolve) => resolve("done")); // fulfilled
const p2 = new Promise((_, reject) => reject("failed")); // rejected
const p3 = new Promise(() => {}); // pending forever - never settles
```

**Trap:** A Promise can only transition **once** — from `pending` to either `fulfilled` or `rejected`, never back, and never both. Calling `resolve()` after `reject()` (or vice versa) is silently ignored.

### Q101. Why do we need Promises?

**A:** They flatten nested callback pyramids into a linear `.then()` chain, provide a single `.catch()` for error handling across the whole chain, and compose well with `Promise.all`/`race`/`allSettled`/`any` for coordinating multiple async operations.

```javascript
// Callback hell
step1((a) => step2(a, (b) => step3(b, (c) => console.log(c))));

// Promise chain - flat, linear, one error handler
step1p()
  .then((a) => step2p(a))
  .then((b) => step3p(b))
  .then((c) => console.log(c))
  .catch((err) => console.error(err));
```

**Trap:** Promises solve the *readability and error-handling* problem of callbacks, but not the underlying async nature of the work — `async/await` (Q110) is what makes it read like sync code.

### Q102. What is Promise chaining?

**A:** Each `.then()` returns a **new** Promise, allowing sequential async steps to be linked — and if a `.then()` returns a value, the next `.then()` receives it (if it returns a Promise, the chain waits for it to settle).

```javascript
fetch("/api/user")
  .then((res) => res.json()) // returns a Promise, chain waits for it
  .then((user) => fetch(`/api/posts/${user.id}`))
  .then((res) => res.json())
  .then((posts) => console.log(posts))
  .catch((err) => console.error("Any step's error lands here:", err));
```

**Trap:** Forgetting to `return` inside a `.then()` breaks the chain — the next `.then()` receives `undefined` instead of waiting for your async work.

### Q103. What is `Promise.resolve()`? *(new)*

**A:** Creates an already-fulfilled Promise wrapping a given value — useful for normalizing a value that might or might not already be a Promise into one you can always `.then()` on.

```javascript
Promise.resolve(5).then((val) => console.log(val)); // 5

// Handy for functions that might return sync or async values:
function getValue(useCache) {
  return useCache ? Promise.resolve(cachedValue) : fetchFromServer();
}
getValue(true).then((val) => console.log(val)); // works either way
```

**Trap:** If you pass an existing Promise into `Promise.resolve()`, it just returns that same Promise unchanged — it doesn't wrap Promises in Promises.

### Q104. What is `Promise.reject()`? *(new)*

**A:** Creates an already-rejected Promise wrapping a given reason — the rejected counterpart to `Promise.resolve()`, useful for returning a consistent Promise-based error from a function.

```javascript
function validate(age) {
  if (age < 0) return Promise.reject(new Error("Invalid age"));
  return Promise.resolve(age);
}

validate(-5).catch((err) => console.error(err.message)); // "Invalid age"
```

**Trap:** An unhandled `Promise.reject()` (with no `.catch()` anywhere in the chain) triggers an `unhandledrejection` event (see Q177) — same as any other rejected Promise.

### Q105. What is `Promise.all()`?

**A:** Runs Promises in parallel, resolving with an array of all results **only if every one succeeds** — rejects immediately (fails fast) if any single one rejects.

```javascript
Promise.all([fetch("/a"), fetch("/b"), fetch("/c")])
  .then((responses) => console.log("All succeeded:", responses))
  .catch((err) => console.error("At least one failed:", err));
```

**Trap:** "Fail fast" means you lose visibility into which of the *other* promises succeeded once one rejects — use `Promise.allSettled()` (Q106) if you need every outcome regardless of failures.

### Q106. What is `Promise.allSettled()`?

**A:** Runs Promises in parallel and always resolves once all have settled, with an array of `{status, value}` or `{status, reason}` objects — never rejects itself, regardless of individual failures.

```javascript
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject("error"),
  Promise.resolve(3),
]).then((results) => console.log(results));
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'error' },
//   { status: 'fulfilled', value: 3 }
// ]
```

**Trap:** You must check each result's `.status` manually — there's no automatic short-circuit or `.catch()` needed, since the outer Promise itself never rejects.

### Q107. What is `Promise.race()`?

**A:** Resolves or rejects as soon as the **first** Promise in the array settles (whether fulfilled or rejected) — the others keep running but their results are ignored.

```javascript
Promise.race([promise1, promise2])
  .then((result) => console.log("First result:", result))
  .catch((err) => console.error(err));

// Common use: implementing a timeout
const timeout = new Promise((_, reject) => setTimeout(() => reject("timeout"), 5000));
Promise.race([fetch("/api/data"), timeout]).catch((err) => console.error(err));
```

**Trap:** "First to settle" includes rejections — if the fastest Promise happens to reject, `race()` rejects too, even if a slower one would have succeeded.

### Q108. What is `Promise.any()`?

**A:** Resolves with the **first fulfilled** Promise, ignoring rejections — only rejects (with an `AggregateError`) if *every* Promise rejects.

```javascript
Promise.any([promise1, promise2, promise3])
  .then((first) => console.log("First success:", first))
  .catch((err) => console.error("All failed:", err)); // AggregateError
```

**Trap:** `any()` vs `race()` is a common mix-up — `race()` cares about "first to settle" (success or failure), `any()` specifically wants "first success" and tolerates failures along the way.

### Q109. What is the difference between `Promise.all()` and `Promise.allSettled()`?

**A:**

| | Waits for | Rejects when | Result shape |
| --- | --- | --- | --- |
| `Promise.all()` | All to resolve | Any one rejects (fail-fast) | Array of values |
| `Promise.allSettled()` | All to settle | Never | Array of `{status, value/reason}` |

```javascript
// Use .all() when you need every result to proceed (e.g., loading required data)
// Use .allSettled() when partial success is acceptable (e.g., batch operations)
```

**Trap:** Reach for `allSettled()` whenever individual failures shouldn't block the others — e.g. uploading 10 files where 2 failing shouldn't prevent reporting success on the other 8.

### Q110. What is async/await?

**A:** Syntax sugar over Promises that lets async code read like synchronous code — `await` pauses execution within the async function (not the whole thread) until the Promise settles.

```javascript
async function fetchUser() {
  try {
    const res = await fetch("/api/user");
    const user = await res.json();
    return user;
  } catch (err) {
    console.error(err);
  }
}
// An async function ALWAYS returns a Promise, even if you `return` a plain value
```

**Trap:** `await` only pauses the *current async function*, not the whole program — other code (and other async functions) continues running normally in the meantime.

### Q111. How do you handle errors in async/await?

**A:** `try/catch` wraps the awaited code — any rejection anywhere in the `try` block (including from a chain of awaited calls) is caught in one place.

```javascript
async function getData() {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed:", err.message);
    return null; // fallback value
  } finally {
    console.log("Cleanup runs regardless of success/failure");
  }
}
```

**Trap:** `fetch()` does NOT reject on HTTP error statuses (404, 500) — only on network failures. You must manually check `res.ok` and throw yourself, or errors silently pass through as "successful" responses.

### Q112. What is the event loop?

**A:** The mechanism that lets JS's single thread handle async operations — it continuously checks: is the call stack empty? If so, pull the next task from the queue (microtasks first, fully drained, then one macrotask) and push it onto the stack.

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
// Sync code first, then ALL microtasks (Promise), then macrotasks (setTimeout)
```

**Trap:** `setTimeout(fn, 0)` does NOT run immediately — it still goes through the macrotask queue and waits for the call stack to empty AND all microtasks to drain first.

### Q113. What is the call stack?

**A:** A LIFO (last-in-first-out) structure tracking which function is currently executing — each function call pushes a new frame; returning pops it off.

```javascript
function a() { b(); }
function b() { c(); }
function c() { console.log(new Error().stack); }
a();
// Stack (top to bottom): c, b, a, (global) - shows the call chain
```

**Trap:** An empty call stack is the *precondition* the event loop checks before pulling anything from the task queues — if the stack is never empty (an infinite loop), queued callbacks never get a chance to run, no matter how they were scheduled.

### Q114. What is the callback queue?

**A:** Also called the **macrotask queue** — where callbacks from `setTimeout`, `setInterval`, DOM events, and I/O wait their turn. Only pulled from once the call stack is empty AND the microtask queue is fully drained.

```javascript
setTimeout(() => console.log("macrotask"), 0);
Promise.resolve().then(() => console.log("microtask"));
// "microtask" always logs first - macrotask queue waits for microtasks to finish
```

**Trap:** "Callback queue" and "macrotask queue" are the same thing described with two different names — don't be thrown if an interviewer uses one term and you've studied the other.

### Q115. What is the microtask queue?

**A:** A higher-priority queue for Promise callbacks (`.then`, `.catch`, `.finally`) and `queueMicrotask()` — fully drained after every single macrotask, before the event loop moves to the next one.

```javascript
setTimeout(() => console.log("timeout"), 0);
Promise.resolve()
  .then(() => console.log("micro 1"))
  .then(() => console.log("micro 2")); // even chained microtasks run before the timeout
// Output: micro 1, micro 2, timeout
```

**Trap:** If microtasks keep queuing more microtasks (e.g., a `.then()` that schedules another `.then()`), the macrotask queue can be starved indefinitely — a real performance footgun.

### Q116. What is the difference between microtask and macrotask?

**A:**

```javascript
// Macrotasks: setTimeout, setInterval, setImmediate (Node), I/O, UI rendering
// Microtasks: Promise callbacks, queueMicrotask(), MutationObserver

console.log("1");
setTimeout(() => console.log("2 - macrotask"), 0);
Promise.resolve().then(() => console.log("3 - microtask"));
queueMicrotask(() => console.log("4 - microtask"));
console.log("5");
// Output: 1, 5, 3, 4, 2
```

**Trap:** The event loop drains the **entire** microtask queue between each single macrotask — not one microtask per macrotask, all of them.

### Q117. What is the output order of `setTimeout`, Promise, and synchronous code?

**A:** Synchronous code always runs first (top to bottom), then the entire microtask queue drains, then one macrotask runs — repeating.

```javascript
console.log("Start"); // 1. sync
setTimeout(() => console.log("Timeout"), 0); // 4. macrotask
Promise.resolve().then(() => console.log("Promise 1")); // 3. microtask
Promise.resolve().then(() => console.log("Promise 2")); // 3. microtask
console.log("End"); // 2. sync
// Output: Start, End, Promise 1, Promise 2, Timeout
```

**Trap:** This exact scenario is the single most commonly asked event-loop question — memorize the ordering rule (sync → all microtasks → one macrotask) rather than the specific example, so you can handle any variation.

### Q118. What is the difference between `setTimeout` and `setInterval`? *(new)*

**A:** `setTimeout` runs a callback once after a delay; `setInterval` runs it repeatedly every N milliseconds until explicitly stopped.

```javascript
const timeoutId = setTimeout(() => console.log("once, after 1s"), 1000);
clearTimeout(timeoutId); // cancel before it fires

const intervalId = setInterval(() => console.log("every 1s"), 1000);
clearInterval(intervalId); // must explicitly stop, or it runs forever
```

**Trap:** Neither guarantees exact timing — both only guarantee "no earlier than" the specified delay; if the call stack is busy, the actual firing time is pushed later. `setInterval` can also "stack up" callbacks if the interval is shorter than the callback's own execution time.

### Q119. What is the difference between debounce and throttle?

**A:** Debounce delays execution until activity **stops** for a set period (resets the timer on every call); throttle guarantees execution happens **at most once** per fixed interval, regardless of how often it's triggered.

```javascript
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

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
```

**Trap:** Search-as-you-type wants **debounce** (wait until the user stops typing); scroll/resize handlers want **throttle** (need periodic updates while the event keeps firing continuously) — mixing these use cases up is the most common wrong answer.

### Q120. How do you cancel an API request in JavaScript?

**A:** `AbortController` is the standard modern API — pass its `signal` to `fetch()`, then call `.abort()` to cancel.

```javascript
const controller = new AbortController();

fetch("/api/data", { signal: controller.signal })
  .then((res) => res.json())
  .catch((err) => {
    if (err.name === "AbortError") console.log("Request was cancelled");
  });

controller.abort(); // cancels the in-flight request

// Common pattern: auto-cancel after a timeout
const timeoutController = new AbortController();
setTimeout(() => timeoutController.abort(), 5000);
```

**Trap:** Aborting a `fetch()` doesn't throw a normal error — it rejects with a `DOMException` named `"AbortError"`, which you should check for and usually handle silently rather than treating as a real failure.

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
