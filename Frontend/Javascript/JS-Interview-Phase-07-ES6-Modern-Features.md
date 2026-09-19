# JavaScript Interview Prep — Phase 7 – ES6+ and Modern JavaScript Features

**Part 7 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Strengthen modern JavaScript concepts used in React and modern frontend projects.

### Q146. What are ES6 modules?

**A:** The standard, native way to split code into reusable files, each with its own scope — using `import`/`export`, statically analyzable (unlike CommonJS's dynamic `require`).

```javascript
// math.js
export function add(a, b) { return a + b; }
export default function multiply(a, b) { return a * b; }

// app.js
import multiply, { add } from "./math.js";
add(2, 3); // 5
```

**Trap:** ES modules are always in strict mode automatically, and imports are hoisted + resolved before any code runs — you can `import` from a file declared further down and it still works.

### Q147. What is the difference between default export and named export?

**A:** A file can have **one** default export (imported without braces, any local name) and **many** named exports (imported with braces, exact name required unless aliased).

```javascript
// utils.js
export default function formatDate() {}
export const PI = 3.14159;
export function square(x) { return x * x; }

// app.js
import formatDate, { PI, square } from "./utils.js"; // default + named together
import formatDate2, { square as sq } from "./utils.js"; // aliasing
import * as utils from "./utils.js"; // import everything as a namespace object
```

**Trap:** Default exports can be renamed freely on import (no braces needed); named exports must match the exported name exactly unless you explicitly use `as` to alias.

### Q148. What is destructuring assignment?

**A:** Unpacking values from arrays or objects into distinct variables in a single expression.

```javascript
// Object destructuring - by key name
const { name, age } = { name: "John", age: 25 };

// Array destructuring - by position
const [first, second] = [1, 2];

// Nested + renamed + defaulted
const {
  user: { email = "none@example.com" } = {},
} = { user: {} };

// Function parameter destructuring - extremely common in React props
function Greeting({ name, greeting = "Hello" }) {
  return `${greeting}, ${name}`;
}
```

**Trap:** Destructuring a `null` or `undefined` value throws immediately (`Cannot destructure property of undefined`) — the `= {}` default pattern above guards against that.

### Q149. What are default parameters?

**A:** Fallback values used when an argument is `undefined` (not passed, or explicitly passed as `undefined`) — evaluated fresh on every call, and can reference earlier parameters.

```javascript
function greet(name = "Guest", greeting = `Hello, ${name}`) {
  return greeting;
}
greet(); // "Hello, Guest"
greet("John"); // "Hello, John"
greet("John", "Hi"); // "Hi"
greet(undefined, "Hi"); // "Hi" - undefined triggers the default
greet(null); // "Hello, null" - null does NOT trigger the default!
```

**Trap:** Only `undefined` triggers a default value — passing `null` explicitly does not, a subtle distinction interviewers like to test.

### Q150. What are template literals?

**A:** Backtick-delimited strings with embedded expression support (`${}`) and native multi-line support.

```javascript
const name = "John";
const msg = `Hello, ${name}! Today is ${new Date().toDateString()}.`;
const multiLine = `Line 1
Line 2`;
```

**Trap:** Expressions inside `${}` can be arbitrarily complex (function calls, ternaries) — not just variable names, which people sometimes assume.

### Q151. What are computed property names? *(new)*

**A:** Using a bracketed expression as an object key at creation time, instead of a static identifier — the key is evaluated dynamically.

```javascript
const key = "dynamicKey";
const obj = {
  [key]: "value", // key becomes "dynamicKey"
  [`${key}_2`]: "value2", // expressions work too
  [Symbol.iterator]: function* () {}, // even Symbols as keys
};
console.log(obj); // { dynamicKey: 'value', dynamicKey_2: 'value2', ... }

// Common real use: building an object keyed by a variable
function makeLookup(id, data) {
  return { [id]: data };
}
```

**Trap:** Before ES6, achieving this required a two-step `obj[key] = value` after creating the object — computed property names let you do it inline in the literal itself.

### Q152. What are object shorthand properties? *(new)*

**A:** When a variable name matches the desired property key, you can omit the `key: value` repetition — same for defining methods without the `function` keyword.

```javascript
const name = "John";
const age = 25;

// Shorthand property
const obj = { name, age }; // same as { name: name, age: age }

// Shorthand method
const obj2 = {
  greet() {
    return "hi";
  }, // same as greet: function() { return "hi"; }
};
```

**Trap:** Shorthand method syntax loses the function's `.name` inference benefit in some edge cases with computed keys — minor, but worth knowing it's not 100% identical to the long form in every case.

### Q153. What are classes in JavaScript?

**A:** Syntax (introduced ES6) for defining reusable object blueprints — syntactic sugar over the existing prototype-based inheritance system, not a new inheritance model.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
  greet() {
    return `Hi, I'm ${this.name}`;
  } // goes on Person.prototype under the hood
}
const p = new Person("John", 25);
```

**Trap:** Class bodies run in strict mode automatically, and class declarations are NOT hoisted the way function declarations are — they exist in the TDZ until evaluated (same as `let`/`const`).

### Q154. What is the difference between class and constructor function?

**A:** `class` is syntax sugar over the exact same prototype mechanism constructor functions use — but with real differences: no hoisting, enforced strict mode, `new` is mandatory, and cleaner syntax for inheritance/static/private members.

```javascript
// Constructor function
function PersonOld(name) { this.name = name; }
PersonOld.prototype.greet = function () { return this.name; };

// Class - equivalent under the hood
class Person {
  constructor(name) { this.name = name; }
  greet() { return this.name; }
}

Person(); // TypeError: cannot call a class without 'new'
PersonOld(); // silently works (badly) - `this` becomes the global object
```

**Trap:** Calling a class without `new` throws immediately; calling an old-style constructor function without `new` silently "succeeds" but corrupts the global object — classes make a whole category of bugs impossible.

### Q155. What are static methods?

**A:** Methods that belong to the class itself, not to instances — called as `ClassName.method()`, commonly used for factory functions or utility methods related to the class.

```javascript
class Person {
  constructor(name) { this.name = name; }
  static create(name) {
    return new Person(name);
  }
  static compare(a, b) {
    return a.name.localeCompare(b.name);
  }
}

const p = Person.create("John"); // called on the class, not an instance
// const p2 = p.create('Jane');    // TypeError - not available on instances
```

**Trap:** Static methods can't access instance properties via `this` (there's no instance) — inside a static method, `this` refers to the class itself.

### Q156. What are private class fields?

**A:** Fields/methods prefixed with `#`, enforced by the JS engine (not just convention) to be inaccessible from outside the class — a true encapsulation mechanism, unlike the old `_field` naming trick.

```javascript
class BankAccount {
  #balance = 0; // private field

  deposit(amount) {
    this.#balance += amount;
  }
  #logTransaction(msg) {
    // private method
    console.log(msg);
  }
  getBalance() {
    return this.#balance;
  }
}

const acc = new BankAccount();
acc.deposit(100);
acc.getBalance(); // 100
// acc.#balance;              // SyntaxError - inaccessible outside the class
```

**Trap:** Accessing `acc.#balance` from outside isn't just `undefined` — it's a hard `SyntaxError` at parse time, a much stronger guarantee than the old underscore-prefix convention ever provided.

### Q157. What is optional chaining?

**A:** `?.` short-circuits to `undefined` instead of throwing when accessing a property/method/index on `null` or `undefined`.

```javascript
const user = { profile: { name: "John" } };

user?.profile?.name; // "John"
user?.address?.city; // undefined - no error, even though address doesn't exist
user?.getEmail?.(); // undefined - safely calls a method that might not exist
user?.hobbies?.[0]; // undefined - safe array/index access too
```

**Trap:** Optional chaining short-circuits the **entire remaining chain** on the first `null`/`undefined` — `a?.b.c.d` still throws if `b` exists but `c` doesn't, unless every link uses `?.`.

### Q158. What is nullish coalescing?

**A:** `??` returns the right-hand value only when the left is `null` or `undefined` — unlike `||`, it does NOT treat `0`, `""`, `false`, or `NaN` as "missing."

```javascript
const count = 0;
count || 10; // 10 - WRONG, treats 0 as falsy
count ?? 10; // 0 - correct, 0 is a valid value, not nullish

const name = "";
name ?? "Guest"; // "" - empty string is preserved
name || "Guest"; // "Guest" - "" is falsy, so || overrides it (usually unwanted)
```

**Trap:** `??` and `&&`/`||` cannot be mixed without parentheses in the same expression — `a || b ?? c` is a `SyntaxError`, an intentional restriction to prevent ambiguous precedence bugs.

### Q159. What is the difference between `||` and `??`?

**A:** `||` falls back on ANY falsy value (`0`, `""`, `false`, `NaN`, `null`, `undefined`); `??` falls back ONLY on `null`/`undefined`, leaving other falsy values intact.

```javascript
function getQuantity(qty) {
  return qty || 1; // BUG: qty=0 becomes 1!
}
function getQuantityFixed(qty) {
  return qty ?? 1; // qty=0 stays 0, correct
}
```

**Trap:** This is the exact reason `??` was introduced — `qty || defaultValue` is a very common real-world bug whenever `0` (or `""`) is a legitimate value.

### Q160. What are generators?

**A:** Functions (`function*`) that can pause and resume execution, yielding a sequence of values one at a time via `yield`, instead of computing/returning everything at once.

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}
const gen = numberGenerator();
gen.next(); // { value: 1, done: false }
gen.next(); // { value: 2, done: false }
gen.next(); // { value: 3, done: false }
gen.next(); // { value: undefined, done: true }

for (const num of numberGenerator()) console.log(num); // 1, 2, 3
```

**Trap:** Calling a generator function doesn't run its body at all — it returns an iterator immediately; the body only executes incrementally as `.next()` is called.

### Q161. What is the `yield` keyword?

**A:** Pauses a generator function, returning a value to the caller, and resumes from that exact point on the next `.next()` call — can also receive a value passed back in via `.next(value)`.

```javascript
function* conversation() {
  const name = yield "What's your name?";
  const age = yield `Hi ${name}, how old are you?`;
  return `${name} is ${age} years old`;
}
const gen = conversation();
gen.next(); // { value: "What's your name?", done: false }
gen.next("John"); // { value: "Hi John, how old are you?", done: false } - "John" becomes `name`
gen.next("25"); // { value: "John is 25 years old", done: true }
```

**Trap:** `yield` can flow data BOTH directions — out via its own expression value, and back in via the argument to the next `.next()` call — a two-way communication channel, not just a one-way pause.

### Q162. What are iterators?

**A:** Any object implementing the iterator protocol: a `.next()` method returning `{value, done}`. Arrays, Strings, Maps, and Sets all have built-in iterators, which is what makes `for...of` work on them.

```javascript
function makeIterator(arr) {
  let index = 0;
  return {
    next() {
      return index < arr.length
        ? { value: arr[index++], done: false }
        : { value: undefined, done: true };
    },
  };
}
const it = makeIterator(["a", "b"]);
it.next(); // { value: 'a', done: false }
it.next(); // { value: 'b', done: false }
it.next(); // { value: undefined, done: true }
```

**Trap:** Plain objects (`{}`) don't have a built-in iterator, which is exactly why `for...of` throws on them while `for...in` (Q95's phase-9 cousin) works fine on any object.

### Q163. What is the iterable protocol? *(new)*

**A:** An object is "iterable" if it implements `[Symbol.iterator]()`, a method returning an iterator (Q162). This is the specific interface `for...of`, spread (`...`), and destructuring all rely on.

```javascript
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};

[...range]; // [1, 2, 3] - spread works because it's iterable
for (const n of range) console.log(n); // 1, 2, 3
```

**Trap:** "Iterable" and "iterator" are related but distinct: an iterable's `[Symbol.iterator]()` *returns* an iterator — confusing the two terms is a common imprecision interviewers notice.

### Q164. What are Symbols?

**A:** A primitive type introduced in ES6 representing a guaranteed-unique value — used mainly as "hidden" or collision-free object keys.

```javascript
const id1 = Symbol("id");
const id2 = Symbol("id");
id1 === id2; // false - always unique, even with the same description

const obj = {
  [id1]: "value",
  regularKey: "visible",
};
Object.keys(obj); // ['regularKey'] - Symbol keys are excluded!
JSON.stringify(obj); // '{"regularKey":"visible"}' - also excluded
```

**Trap:** Symbol-keyed properties are invisible to `Object.keys()`, `for...in`, and `JSON.stringify()` — deliberately, since Symbols were designed for "private-ish" metadata that shouldn't clutter normal enumeration.

### Q165. What is BigInt? *(new)*

**A:** A primitive type (ES2020) for integers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1), created by appending `n` to a numeric literal or calling `BigInt()`.

```javascript
const big = 9007199254740993n; // beyond Number's safe integer range
typeof big; // "bigint"

9007199254740993n + 1n; // 9007199254740994n - stays precise
Number.MAX_SAFE_INTEGER + 2; // 9007199254740992 - WRONG, loses precision as a regular Number

// BigInt and Number cannot be mixed directly:
// 1n + 1;                        // TypeError
1n + BigInt(1); // 2n - must convert explicitly
```

**Trap:** You can't mix `BigInt` and `Number` in arithmetic at all — even `1n + 1` throws a `TypeError`, forcing explicit conversion.

### Q166. What is dynamic import?

**A:** `import()` as a function call (not the static `import` statement) — loads a module asynchronously, returning a Promise, enabling code-splitting and conditional/lazy loading.

```javascript
button.addEventListener("click", async () => {
  const { default: Chart } = await import("./chart.js"); // loaded only when needed
  Chart.render();
});

// Conditional loading
if (userWantsFeatureX) {
  const module = await import("./feature-x.js");
}
```

**Trap:** Unlike static `import`, dynamic `import()` can be called anywhere — inside functions, conditionals, event handlers — which is exactly what makes lazy loading (Q193) and route-based code splitting (Q192) possible in bundlers like Webpack/Vite.

### Q167. What is top-level await? *(new)*

**A:** ES2022 feature allowing `await` directly at a module's top level, outside any `async function` — the module itself pauses loading until the awaited Promise settles.

```javascript
// data.js (an ES module)
const response = await fetch("/api/config"); // no wrapping async function needed
export const config = await response.json();
```

```javascript
// consumer.js (a separate file, importing from data.js above)
import { config } from "./data.js"; // waits for data.js to finish loading first
console.log(config);
```

**Trap:** Only works in actual ES modules (`type="module"`, `.mjs`, or ESM-configured bundlers) — using it in a regular script or CommonJS file is a `SyntaxError`.

### Q168. What is `structuredClone()`?

**A:** A built-in, native deep-clone function (no library needed) — handles far more types correctly than the old `JSON.parse(JSON.stringify())` trick, including `Date`, `Map`, `Set`, and circular references.

```javascript
const original = { date: new Date(), map: new Map([["a", 1]]), nested: { x: 1 } };
original.circular = original; // circular reference - fine!

const clone = structuredClone(original);
clone.date instanceof Date; // true - stays a real Date
clone.nested.x = 99;
console.log(original.nested.x); // 1 - fully independent
```

**Trap:** It still can't clone functions, DOM nodes, or class instance methods (throws `DataCloneError`) — for those, you still need a custom clone or a library.

### Q169. What are logical assignment operators? *(new)*

**A:** ES2021 shorthand combining a logical operator with assignment — only assigns if the logical condition is met, avoiding a separate `if` check.

```javascript
let a = null;
a ??= "default"; // a = a ?? 'default' -> assigns since a is nullish
console.log(a); // "default"

let count = 0;
count ||= 10; // assigns since 0 is falsy
console.log(count); // 10

let config = { theme: "dark" };
config.theme &&= config.theme.toUpperCase(); // assigns only if theme is truthy
console.log(config.theme); // "DARK"
```

**Trap:** `??=` is usually the one you actually want for "set a default only if missing" — `||=` will incorrectly overwrite legitimate falsy values like `0` or `""`, the same trap as `||` vs `??` in Q159.

### Q170. What is the pipeline operator proposal? *(new)*

**A:** A **proposed** (not yet standard, currently Stage 2 in TC39) operator `|>` that would let you chain function calls left-to-right instead of nesting them — improving readability for multi-step transformations.

```javascript
// Proposed syntax (NOT valid JS today - requires a Babel plugin to use):
// const result = value |> double |> addOne |> square;

// Today, the same thing requires nested calls or nested variables:
const result = square(addOne(double(value)));

// ...or a manual pipe helper, achievable in current JS:
const pipe = (...fns) => (x) => fns.reduce((acc, fn) => fn(acc), x);
const process = pipe(double, addOne, square);
process(value);
```

**Trap:** Don't present this as working JavaScript — it's explicitly a *proposal*, and interviewers asking about it are usually checking whether you're honest about what's shipped vs. what's still experimental.

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
