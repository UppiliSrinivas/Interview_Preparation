# JavaScript Interview Prep — Phase 9 – Advanced JavaScript Output-based Questions

**Part 9 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Practice tricky output questions commonly asked for experienced frontend engineers. For each: predict the output FIRST, then check the explanation.

### Q196. What is the output of code using function hoisting before declaration?

**A:**

```javascript
console.log(sum(2, 3)); // 5 - works! function declarations hoist completely

function sum(a, b) {
  return a + b;
}

console.log(multiply(2, 3)); // TypeError: multiply is not a function

var multiply = function (a, b) {
  return a * b;
};
```

**Trap:** Function *declarations* hoist their entire body; function *expressions* only hoist the `var` binding (as `undefined`) — calling it before the assignment line throws a `TypeError`, not a `ReferenceError`.

### Q197. What is the output of `let x = y = 0` inside a function?

**A:**

```javascript
function test() {
  let x = (y = 0); // only `x` is declared with let; `y` becomes an accidental GLOBAL
}
test();

console.log(typeof x); // "undefined" - x was function-scoped, inaccessible here
console.log(y); // 0 - leaked into the global scope!
```

**Trap:** `let x = y = 0` only applies `let` to `x` — the `y = 0` part is a plain assignment with no declaration keyword, so in non-strict mode it silently creates a global variable. In strict mode, this throws a `ReferenceError` instead (a good reason to always use strict mode / modules).

### Q198. What is the output order of synchronous logs and `setTimeout(..., 0)`?

**A:**

```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
// Output: 1, 3, 2
```

**Trap:** `setTimeout(fn, 0)` never runs synchronously or "immediately" — it always waits for the call stack to clear and the microtask queue to drain, even with a 0ms delay.

### Q199. Why does `0.1 + 0.2 === 0.3` return false?

**A:**

```javascript
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 === 0.3; // false

// Fix: epsilon-based comparison
Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON; // true

// Fix: do currency/precision-sensitive math in integers
const totalCents = 10 + 20; // 30 - exact, no floating point involved
```

**Trap:** JS stores numbers as IEEE-754 double-precision floats, which can't represent most decimal fractions exactly in binary — this happens in Python, Java, and C too, not just JS. The real-world fix for money math: work in integer cents, convert to decimal only for display.

### Q200. What is the output when a function expression is used inside an `if` condition?

**A:**

```javascript
if (typeof foo === "function") {
  console.log("foo exists");
} else {
  console.log("foo does not exist"); // this runs
}

function foo() {} // declared AFTER the check, but hoisted...

// However:
if (true) {
  function bar() {
    return "block-scoped in strict mode";
  }
}
console.log(typeof bar); // "function" in non-strict/sloppy mode (browser quirk),
// but behaves as block-scoped (undefined outside) under strict mode / modules
```

**Trap:** Function declarations *inside* blocks (`if`, `for`, etc.) have historically inconsistent hoisting behavior across engines — modern strict-mode/module code treats them as block-scoped, but legacy sloppy-mode code may still hoist them to the function/global scope. Always prefer function expressions/arrow functions inside conditionals to avoid the ambiguity entirely.

### Q201. What happens when `return` is placed before an object literal on the next line?

**A:**

```javascript
function getObject() {
  return
  {
    name: "John"
  };
}
console.log(getObject()); // undefined !!

function getObjectFixed() {
  return {
    name: "John",
  };
}
console.log(getObjectFixed()); // { name: 'John' }
```

**Trap:** This is Automatic Semicolon Insertion (ASI) — JS inserts an invisible semicolon immediately after `return` because it's followed by a newline, silently turning it into `return;` followed by unreachable code. Always open the brace on the SAME line as `return`.

### Q202. What is the output after deleting an array element using `delete arr[index]`?

**A:**

```javascript
const arr = [1, 2, 3];
delete arr[1];
console.log(arr); // [ 1, <1 empty item>, 3 ]
console.log(arr.length); // 3 - unchanged!
console.log(arr[1]); // undefined
console.log(1 in arr); // false - the slot doesn't exist, it's a hole
```

**Trap:** `delete` leaves a hole without shifting subsequent elements or updating `length` — use `splice()` if you actually want the array to shrink and re-index.

### Q203. What is the output of sparse arrays in modern browsers?

**A:**

```javascript
const sparse = [1, , 3]; // hole at index 1
console.log(sparse); // [ 1, <1 empty item>, 3 ]
console.log(sparse.length); // 3

sparse.forEach((x) => console.log(x)); // logs 1, then 3 - SKIPS the hole entirely
console.log(sparse.map((x) => x * 2)); // [ 2, <1 empty item>, 6 ] - also skips it

for (let i = 0; i < sparse.length; i++) {
  console.log(sparse[i]); // 1, undefined, 3 - a plain for-loop does NOT skip holes
}
```

**Trap:** Iteration method behavior is inconsistent by design — `forEach`/`map`/`filter` skip holes, but a plain indexed `for` loop or `for...of` does not (it yields `undefined` for the hole) — a genuine source of confusing bugs.

### Q204. What is the output of object method shorthand calls?

**A:**

```javascript
const counter = {
  count: 0,
  increment() {
    this.count++;
    return this.count;
  },
};
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2

const { increment } = counter; // destructured - DETACHED from counter
console.log(increment()); // TypeError: Cannot read properties of undefined (reading 'count')
```

**Trap:** Destructuring a method off an object loses its `this` binding entirely — calling the detached reference fails because `this` is no longer `counter`. This is exactly why React historically required binding class methods in the constructor.

### Q205. What is the output of `1 < 2 < 3` and `3 > 2 > 1`?

**A:**

```javascript
1 < 2 < 3; // true  - evaluates left to right: (1 < 2) < 3 -> true < 3 -> 1 < 3 -> true
3 > 2 > 1; // false - (3 > 2) > 1 -> true > 1 -> 1 > 1 -> false
```

**Trap:** Comparison operators are NOT chained mathematically like in Python (`1 < 2 < 3` doesn't mean "is 2 between 1 and 3") — each comparison's boolean result gets coerced to `1`/`0` and compared again with the next operator, left to right.

### Q206. What happens when duplicate parameters are used in non-strict mode?

**A:**

```javascript
function sum(a, a, b) {
  // legal in non-strict mode
  console.log(a); // logs the LAST value passed for 'a', not the first
  return a + b;
}
console.log(sum(1, 2, 3)); // a=2 (overwrites the first a=1), b=3 -> 5
```

**Trap:** Non-strict mode silently allows duplicate parameter names, with the later one simply shadowing the earlier — a real footgun that strict mode (Q207) closes off entirely.

### Q207. What happens when duplicate parameters are used in arrow functions?

**A:**

```javascript
// const add = (a, a) => a + a;   // SyntaxError: Duplicate parameter name not allowed

// Also illegal in regular functions under "use strict":
function sum(a, a) {
  "use strict";
  return a + a; // SyntaxError, same rule applies
}
```

**Trap:** Arrow functions are ALWAYS treated as if in strict mode for this specific rule — duplicate parameter names are a `SyntaxError` unconditionally, regardless of surrounding strict-mode declarations, unlike regular functions where it depends on context.

### Q208. What happens when arrow functions access `arguments`?

**A:**

```javascript
const arrow = () => {
  console.log(arguments); // ReferenceError: arguments is not defined (if no enclosing function)
};
// arrow();

function outer() {
  const inner = () => {
    console.log(arguments); // refers to OUTER's arguments - arrows have none of their own
  };
  inner();
}
outer(1, 2, 3); // logs [Arguments] { '0': 1, '1': 2, '2': 3 } - outer's args, not inner's
```

**Trap:** At the top level (no enclosing regular function), referencing `arguments` inside an arrow function throws a `ReferenceError` — there's nothing lexically enclosing to inherit it from.

### Q209. What is the output of `Math.max()`?

**A:**

```javascript
Math.max(); // -Infinity (no arguments = weakest possible "maximum")
Math.min(); // Infinity  (same logic, opposite direction)

Math.max(1, 2, 3); // 3
Math.max([1, 2, 3]); // NaN - doesn't accept an array directly!
Math.max(...[1, 2, 3]); // 3 - must spread the array into individual arguments
```

**Trap:** `Math.max()`/`Math.min()` take individual arguments, not an array — passing an array directly gives `NaN` since the array coerces to a string, not a number. Spread it, or use `Math.max.apply(null, arr)`.

### Q210. What is the output of `typeof null`?

**A:**

```javascript
typeof null; // "object" - a long-standing bug in the language spec

null instanceof Object; // false - despite typeof saying "object"!
```

**Trap:** This is a famous, never-fixed bug dating back to JS's original 1995 implementation (a leftover from how values were represented internally) — fixing it now would break too much existing code on the web, so it stays permanently. Always mention this is a *known bug*, not a logical design choice, when explaining it.

### Q211. What is the output of `typeof NaN`?

**A:**

```javascript
typeof NaN; // "number" - NaN's TYPE is number, even though its name suggests otherwise

typeof typeof NaN; // "string" - typeof always returns a string (see Q214)
```

**Trap:** `NaN` stands for "Not a Number" but its actual JS type IS `"number"` — it represents an invalid numeric computation, not a non-numeric value, a naming choice that confuses almost everyone at first.

### Q212. What is the output of `[] + []`, `[] + {}`, and `{} + []`?

**A:**

```javascript
[] + []; // ""          - both arrays coerce to "" (empty string), concatenated
[] + {}; // "[object Object]" - [] -> "", {} -> "[object Object]", concatenated
({}) + []; // "[object Object]" - same result, but needs parens (see the trap below)

{} +[]; // 0 - WITHOUT parens, the leading {} is parsed as an empty BLOCK statement,
// not an object literal, leaving just the separate statement +[] -> coerces [] to 0
```

**Trap:** The last one is the real trick: `{} + []` typed as a bare statement parses `{}` as an empty block (not an object literal), leaving just `+[]`, which coerces the empty array to the number `0`. This is the exact same "`{}` at statement-start" parsing quirk from Q95's cousin case — wrap in parentheses to force object-literal interpretation.

### Q213. What is the output of `true + false`?

**A:**

```javascript
true + false; // 1 - booleans coerce to numbers: true -> 1, false -> 0
true + true; // 2
false + false; // 0
"5" + true; // "5true" - + prefers string concat when a string is involved
5 + true; // 6 - no string involved, so true coerces to 1
```

**Trap:** Whether `+` concatenates or adds numerically depends entirely on whether *either* operand is a string — booleans and numbers always coerce toward numeric addition unless a string forces string concatenation instead.

### Q214. What is the output of `typeof typeof 1`?

**A:**

```javascript
typeof 1; // "number"
typeof typeof 1; // "string" - typeof "number" -> "string" (typeof ALWAYS returns a string)
```

**Trap:** `typeof` always returns one of exactly 8 possible strings (`"number"`, `"string"`, `"boolean"`, `"undefined"`, `"object"`, `"function"`, `"symbol"`, `"bigint"`) — so `typeof typeof anything` is always `"string"`, no matter what you start with.

### Q215. What is the output of comparing objects and arrays by reference?

**A:**

```javascript
({}) === {}; // false - two different objects, even though they look identical (needs parens - see Q212)
[] === []; // false - same reason
[1, 2] === [1, 2]; // false

const obj = {};
obj === obj; // true - same reference

[1, 2].toString() === [1, 2].toString(); // true - comparing the resulting STRINGS, not the arrays
JSON.stringify({ a: 1 }) === JSON.stringify({ a: 1 }); // true - comparing strings again
```

**Trap:** `===` on objects/arrays only ever checks reference identity, never structural equality — comparing "shape" requires either a deep-equal utility function, `JSON.stringify()` (imperfect - key order matters), or a library like Lodash's `isEqual`.

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
