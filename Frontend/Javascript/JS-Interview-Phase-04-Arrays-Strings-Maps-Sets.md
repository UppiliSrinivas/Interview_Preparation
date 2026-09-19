# JavaScript Interview Prep — Phase 4 – Arrays, Strings, Maps, Sets & Data Handling

**Part 4 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Prepare for day-to-day frontend data transformation questions.

### Q71. What are arrays in JavaScript?

**A:** Ordered, index-based lists that can hold mixed types — technically a special kind of object with numeric keys and a `length` property that auto-updates.

```javascript
const arr = [1, "two", { three: 3 }, [4]];
arr.length; // 4
typeof arr; // "object" - arrays ARE objects
Array.isArray(arr); // true - the correct way to check (typeof can't tell arrays from objects)
```

**Trap:** `typeof arr` returns `"object"`, not `"array"` — always use `Array.isArray()` for a real type check.

### Q72. What is the difference between `map`, `filter`, and `reduce`?

**A:**

```javascript
const nums = [1, 2, 3, 4];

nums.map((x) => x * 2); // [2, 4, 6, 8] - transforms EVERY item, same length out
nums.filter((x) => x > 2); // [3, 4] - keeps SOME items, shorter (or equal) length
nums.reduce((acc, x) => acc + x, 0); // 10 - collapses to a SINGLE value
```

**Trap:** All three are non-mutating — they return a new array (or value) and leave the original untouched, unlike `sort()`, `splice()`, `push()`, etc.

### Q73. What is the difference between `forEach` and `map`?

**A:** `forEach` runs a function per item and always returns `undefined` — it's for side effects. `map` returns a *new array* built from the callback's return values — it's for transformation.

```javascript
const nums = [1, 2, 3];

const result1 = nums.forEach((x) => x * 2);
console.log(result1); // undefined - forEach doesn't collect anything

const result2 = nums.map((x) => x * 2);
console.log(result2); // [2, 4, 6] - map collects the return values
```

**Trap:** Using `forEach` when you meant `map` (or vice versa) is one of the most common junior mistakes — if you need the transformed array, it's always `map`.

### Q74. What is the difference between `find` and `filter`?

**A:** `find` returns the first matching *element* (or `undefined`); `filter` returns an *array* of all matches (possibly empty).

```javascript
const users = [{ id: 1 }, { id: 2 }, { id: 3 }];

users.find((u) => u.id === 2); // { id: 2 } - single object
users.filter((u) => u.id > 1); // [{ id: 2 }, { id: 3 }] - array

users.find((u) => u.id === 99); // undefined - no match
users.filter((u) => u.id === 99); // [] - empty array, not undefined
```

**Trap:** `find` stops iterating as soon as it finds a match (more efficient for "does one exist" checks); `filter` always processes the entire array.

### Q75. What is the difference between `some` and `every`?

**A:** `some` returns `true` if **at least one** element passes the test; `every` returns `true` only if **all** elements pass.

```javascript
const nums = [1, 2, 3, 4];

nums.some((x) => x > 3); // true - at least one (4) passes
nums.every((x) => x > 0); // true - all pass
nums.every((x) => x > 2); // false - not all pass

[].every((x) => x > 100); // true! - vacuously true on empty arrays
[].some((x) => x > 100); // false - vacuously false on empty arrays
```

**Trap:** Both short-circuit (`some` stops at the first `true`, `every` stops at the first `false`) — and the empty-array behavior (`every` → `true`, `some` → `false`) surprises people who haven't hit it before.

### Q76. What is the difference between `slice` and `splice`? *(new)*

**A:** `slice` is non-mutating — returns a shallow copy of a portion without touching the original. `splice` **mutates** the original array in place, removing/replacing/inserting elements.

```javascript
const arr = [1, 2, 3, 4, 5];

const sliced = arr.slice(1, 3); // [2, 3] - new array
console.log(arr); // [1, 2, 3, 4, 5] - unchanged

const removed = arr.splice(1, 2); // removes 2 items starting at index 1
console.log(removed); // [2, 3] - the removed items
console.log(arr); // [1, 4, 5] - original array MUTATED

arr.splice(1, 0, "a", "b"); // insert without removing (deleteCount = 0)
console.log(arr); // [1, 'a', 'b', 4, 5]
```

**Trap:** The names are easy to confuse — remember "sp-LICE mutates," "SLICE doesn't." Mixing them up in production is a classic source of "why did my original array change" bugs.

### Q77. What is the difference between `push`, `pop`, `shift`, and `unshift`?

**A:** All four mutate the array in place, operating on either end.

```javascript
const arr = [2, 3, 4];

arr.push(5); // adds to END -> [2,3,4,5], returns new length (4)
arr.pop(); // removes from END -> [2,3,4], returns removed item (5)
arr.unshift(1); // adds to START -> [1,2,3,4], returns new length (4)
arr.shift(); // removes from START -> [2,3,4], returns removed item (1)
```

**Trap:** `shift`/`unshift` are O(n) — every remaining element has to be re-indexed — while `push`/`pop` are O(1). For large arrays, prefer the end of the array when performance matters.

### Q78. What are sparse arrays? *(new)*

**A:** Arrays with "holes" — missing indices that aren't actually `undefined` values, just absent entirely. Created via the `Array` constructor, `delete`, or skipping indices in a literal.

```javascript
const sparse = [1, , 3]; // hole at index 1
console.log(sparse.length); // 3
console.log(sparse[1]); // undefined (when read)
console.log(1 in sparse); // false - the slot doesn't actually exist

const arr2 = new Array(3); // [empty x 3] - fully sparse, length 3, no elements

sparse.forEach((x) => console.log(x)); // logs 1 and 3 ONLY - skips the hole!
sparse.map((x) => x * 2); // [2, <1 empty item>, 6] - also skips holes
```

**Trap:** Most iteration methods (`forEach`, `map`, `filter`) **skip holes entirely** — a hole is not the same as an element containing `undefined`, which trips people up when debugging "missing" array items.

### Q79. What happens when you use `delete` on an array element? *(new)*

**A:** It removes the value but leaves a **hole** — the array's `length` doesn't change, and the slot becomes sparse rather than actually shifting elements down.

```javascript
const arr = [1, 2, 3];
delete arr[1];
console.log(arr); // [ 1, <1 empty item>, 3 ]
console.log(arr.length); // 3 - unchanged!
console.log(arr[1]); // undefined
console.log(1 in arr); // false - the index doesn't exist anymore
```

**Trap:** `delete` on an array is almost always the wrong tool — use `splice()` if you want to actually remove an element and shift the rest down, keeping `length` accurate.

### Q80. How do you flatten an array?

**A:**

```javascript
const nested = [1, [2, 3], [4, [5, 6]]];

nested.flat(); // [1, 2, 3, 4, [5, 6]] - default depth 1
nested.flat(Infinity); // [1, 2, 3, 4, 5, 6] - fully flat, any depth

nested.flatMap((x) => (Array.isArray(x) ? x : [x])); // map + flat(1) in one pass
```

**Trap:** `flat()`'s default depth is only `1` — a common bug is expecting it to fully flatten deeply nested arrays without passing `Infinity` (or a large enough number).

### Q81. How do you remove duplicates from an array?

**A:** The `Set` constructor is the standard, concise approach for primitive values.

```javascript
const nums = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(nums)]; // [1, 2, 3]

// For objects, Set won't help (different references) - dedupe by a key instead:
const users = [{ id: 1 }, { id: 2 }, { id: 1 }];
const uniqueUsers = [...new Map(users.map((u) => [u.id, u])).values()];
```

**Trap:** `Set` dedupes by reference for objects, not by shape — `new Set([{a:1}, {a:1}])` keeps both since they're different object references, even though they look identical.

### Q82. What is array destructuring?

**A:** Unpacking array values into individual variables by position, with support for skipping, defaults, and rest collection.

```javascript
const [a, b, c] = [1, 2, 3];
const [first, , third] = [1, 2, 3]; // skip index 1
const [x = 10, y = 20] = [5]; // x=5, y=20 (default used)
const [head, ...tail] = [1, 2, 3, 4]; // head=1, tail=[2,3,4]

// Swapping without a temp variable:
let m = 1, n = 2;
[m, n] = [n, m]; // m=2, n=1
```

**Trap:** Destructuring reads by **position**, not name — unlike object destructuring, which reads by key name.

### Q83. What are rest and spread operators?

**A:** Same `...` syntax, opposite direction: **rest** collects multiple values *into* an array/object; **spread** expands an array/object *out* into individual elements.

```javascript
// Rest - gathering (in function params or destructuring)
function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }
const [first, ...rest] = [1, 2, 3]; // rest = [2, 3]

// Spread - expanding (in calls, literals)
const arr = [1, 2, 3];
console.log(Math.max(...arr)); // spread into function arguments
const combined = [...arr, 4, 5]; // spread into a new array
const merged = { ...{ a: 1 }, ...{ b: 2 } }; // spread into a new object
```

**Trap:** Rest **must be the last** parameter/element in its pattern — `function f(...rest, last)` is a `SyntaxError`.

### Q84. What is the difference between rest and spread? *(new)*

**A:** Context determines which one you're looking at, even though the syntax is identical:

```javascript
// REST - appears on the LEFT side of an assignment, or in a function signature
function example(...args) {} // rest - collects arguments into an array
const [a, ...others] = [1, 2, 3]; // rest - collects remaining items

// SPREAD - appears on the RIGHT side / inside a call or literal
const arr = [1, 2, 3];
example(...arr); // spread - expands the array into individual arguments
const copy = [...arr]; // spread - expands into a new array literal
```

**Trap:** The one-line rule interviewers want: "rest gathers, spread spreads" — and syntactically, rest only ever appears in a *binding* position (function params, destructuring patterns), spread everywhere else.

### Q85. What is a Set?

**A:** A collection of **unique** values of any type, iterable, with guaranteed insertion order.

```javascript
const set = new Set([1, 2, 2, 3]);
console.log(set); // Set(3) {1, 2, 3} - duplicates auto-removed
set.add(4);
set.has(2); // true
set.delete(1);
console.log(set.size); // 3 - not .length
```

**Trap:** Use `.size`, not `.length` — a common typo carried over from array habits.

### Q86. What is a Map?

**A:** A collection of key-value pairs where keys can be **any type** (unlike plain objects, whose keys coerce to strings), with guaranteed insertion order and a `.size` property.

```javascript
const map = new Map();
const objKey = { id: 1 };

map.set("stringKey", "value1");
map.set(objKey, "value2"); // object as a key - impossible with {}
map.set(42, "value3");

map.get(objKey); // "value2"
map.size; // 3

for (const [key, value] of map) {
  console.log(key, value); // directly iterable
}
```

**Trap:** `map.set(key, val)` returns the Map itself (chainable), not the value — different from how you might expect based on similar-looking object patterns.

### Q87. What is the difference between Map and Object?

**A:**

| | Object | Map |
| --- | --- | --- |
| Key types | Strings/Symbols only | Any value |
| Key order | Not spec-guaranteed pre-ES2015 semantics | Guaranteed insertion order |
| Size | `Object.keys(obj).length` | `.size` |
| Iteration | Needs `Object.entries()` etc. | Directly iterable |
| Performance | Fine for small, string-keyed data | Better for frequent add/remove |

```javascript
const obj = {};
obj[{}] = "value"; // key coerced to the string "[object Object]"!

const map = new Map();
map.set({}, "value"); // key stays a real object reference
```

**Trap:** Using an object as an object key silently coerces it to `"[object Object]"` — a real (and confusing) bug that `Map` completely avoids.

### Q88. What is a WeakMap?

**A:** Like `Map`, but keys must be objects, and those keys are held **weakly** — if nothing else references the key object, it (and its entry) can be garbage collected. Not iterable, no `.size`.

```javascript
let obj = { id: 1 };
const wm = new WeakMap();
wm.set(obj, "metadata");
console.log(wm.get(obj)); // "metadata"

obj = null; // no other references to the original object now
// The WeakMap entry becomes eligible for garbage collection automatically
```

**Trap:** You can't iterate a `WeakMap` (no `.keys()`, no `for...of`) — that's not an oversight, it's required, since entries can vanish at any time via GC and iteration order would be nondeterministic.

### Q89. What is a WeakSet?

**A:** Like `Set`, but can only hold objects (not primitives), held weakly, not iterable, no `.size`.

```javascript
let obj = { id: 1 };
const ws = new WeakSet();
ws.add(obj);
ws.has(obj); // true

obj = null; // eligible for GC, entry disappears from the WeakSet automatically
```

**Trap:** Common real use case: tracking "has this DOM node/object already been processed" without preventing it from being garbage collected once removed from the page.

### Q90. What is the difference between Map and WeakMap? *(new)*

**A:**

```javascript
// Map: any key type, iterable, prevents garbage collection of its keys
const map = new Map();
map.set("string key", "ok"); // primitives allowed as keys
map.size; // has size
for (const entry of map) {
} // iterable

// WeakMap: object keys ONLY, NOT iterable, does NOT prevent GC
const wm = new WeakMap();
// wm.set("string", "fail");  // TypeError - WeakMap keys must be objects
wm.set({}, "ok");
// wm.size;                   // undefined - no size property
// for (const e of wm) {}     // TypeError - not iterable
```

**Trap:** The core trade-off to state clearly: `Map` is more flexible but can leak memory if you forget to clean up entries; `WeakMap` self-cleans but sacrifices iteration and primitive keys — pick based on whether you need to enumerate entries.

### Q91. What is the difference between Set and WeakSet? *(new)*

**A:** Same relationship as Map/WeakMap — `Set` allows any value type and is iterable; `WeakSet` allows only objects, isn't iterable, and allows garbage collection of unreferenced entries.

```javascript
const set = new Set([1, "two", { three: 3 }]); // any type allowed
set.size; // has size, is iterable

const ws = new WeakSet();
ws.add({}); // objects only
// ws.add(1);                 // TypeError - primitives not allowed
// [...ws];                   // TypeError - not iterable
```

**Trap:** `WeakSet`'s main real-world use is metadata tagging (e.g., "mark this DOM node as already initialized") without creating a memory leak if the node is later removed from the page.

### Q92. What are template literals?

**A:** Backtick-delimited strings supporting embedded expressions (`${}`) and multi-line text without concatenation.

```javascript
const name = "John";
const age = 25;
const message = `Hello, ${name}! You are ${age} years old.`;

const multiLine = `Line 1
Line 2`; // real newline, no \n needed

const html = `<div>${age > 18 ? "Adult" : "Minor"}</div>`; // expressions allowed
```

**Trap:** Template literals don't replace the need for escaping — a literal backtick or `${` inside the string still needs `\` `` \` `` or `\${`.

### Q93. What are tagged templates?

**A:** A function called with a template literal's parts split into an array of string segments plus the interpolated values, allowing custom processing (sanitization, i18n, styled-components-style CSS-in-JS).

```javascript
function highlight(strings, ...values) {
  return strings.reduce(
    (result, str, i) => `${result}${str}${values[i] ? `**${values[i]}**` : ""}`,
    "",
  );
}

const name = "John";
const result = highlight`Hello, ${name}! Welcome.`;
console.log(result); // "Hello, **John**! Welcome."
```

**Trap:** This is exactly how libraries like `styled-components` (`` styled.div`color: red;` ``) work under the hood — a good way to show the concept isn't just academic.

### Q94. What are common string methods used in JavaScript? *(new)*

**A:**

```javascript
const str = "  Hello World  ";

str.trim(); // "Hello World" - remove whitespace both ends
str.toLowerCase(); // "  hello world  "
str.toUpperCase(); // "  HELLO WORLD  "
str.includes("World"); // true
str.startsWith("  He"); // true
str.replace("World", "JS"); // replaces first match only
str.replaceAll("l", "L"); // replaces ALL matches (ES2021+)
str.split(" "); // ['', '', 'Hello', 'World', '', '']
str.slice(2, 7); // "Hello" - supports negative indices
str.padStart(20, "*"); // pad to a fixed length
str.repeat(3); // repeats the string
"5".padStart(3, "0"); // "005" - common for formatting IDs
```

**Trap:** `replace()` only replaces the **first** match unless you pass a global regex (`/pattern/g`) — `replaceAll()` (ES2021) is the more intuitive modern choice for plain strings.

### Q95. How do you compare strings safely? *(new)*

**A:** For simple equality, `===` is fine. For sorting or locale-aware comparison (accents, case, different alphabets), use `localeCompare()` rather than raw `<`/`>`.

```javascript
"apple" === "apple"; // true

"a" < "b"; // true - simple ASCII/UTF-16 comparison, fine for basic cases
"Z" < "a"; // true! - uppercase letters sort before lowercase in raw comparison

// Locale-aware, handles case and accents sensibly:
"apple".localeCompare("Apple"); // negative or positive depending on locale rules
["café", "apple", "Banana"].sort((a, b) => a.localeCompare(b));
// sorts sensibly regardless of case/accents

"apple".localeCompare("apple", undefined, { sensitivity: "base" }); // 0 - case/accent-insensitive
```

**Trap:** Raw `<`/`>` comparison sorts by UTF-16 code unit, which puts all uppercase letters before all lowercase ones (`"Z" < "a"`) — a frequent source of "why is my sort weird" bugs with mixed-case data.

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
