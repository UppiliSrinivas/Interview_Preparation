# JavaScript Interview Prep — Phase 1 – JavaScript Fundamentals & Execution Basics

**Part 1 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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

**Goal:** Build strong clarity on JS basics, runtime behavior, and core syntax.

### Q1. What is JavaScript?

**A:** A high-level, interpreted (JIT-compiled), single-threaded, dynamically-typed programming language that runs in browsers and on servers (Node.js). Originally built for adding interactivity to web pages, it now powers full-stack apps, mobile apps (React Native), and more.

**Trap:** Calling it "just a scripting language" undersells it in interviews — mention it's now used for full application stacks, not just DOM manipulation.

### Q2. What are the data types supported by JavaScript?

**A:** 7 primitive types + 1 reference type:

```javascript
// Primitives (immutable, compared by value)
typeof "hello"; // "string"
typeof 42; // "number"
typeof 10n; // "bigint"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof null; // "object" (famous quirk - see Q210)

// Reference type
typeof {}; // "object" (covers objects, arrays, functions, dates, etc.)
typeof []; // "object"
typeof function () {}; // "function" (technically a callable object)
```

**Trap:** Forgetting `bigint` and `symbol` when listing primitives — both are ES2015+/ES2020 additions interviewers use to check if your knowledge is current.

### Q3. What is the difference between primitive and non-primitive data types?

**A:** Primitives are immutable and compared/copied **by value**; non-primitives (objects, arrays, functions) are mutable and compared/copied **by reference**.

```javascript
let a = 10;
let b = a;
b = 20;
console.log(a); // 10 - unaffected, primitives copy by value

let obj1 = { x: 10 };
let obj2 = obj1;
obj2.x = 20;
console.log(obj1.x); // 20 - both point to the SAME object

obj1 === obj2; // true (same reference)
({ x: 20 }) === { x: 20 }; // false (different objects, same shape - needs parens, see Q95's sibling gotcha)
```

**Trap:** Assuming `obj2 = obj1` creates a copy — it copies the *reference*, not the object. This is the root cause behind Q18, Q56, and most "why did my state mutate unexpectedly" bugs.

### Q4. What is the difference between `null` and `undefined`?

**A:** `undefined` means a variable has been declared but not assigned a value (JS sets this automatically). `null` is an intentional "no value," explicitly assigned by the developer.

```javascript
let a;
console.log(a); // undefined - JS default

let b = null;
console.log(b); // null - explicit "empty" value

typeof undefined; // "undefined"
typeof null; // "object" (long-standing JS bug, never fixed for compatibility)

null == undefined; // true (loose equality treats them as equal)
null === undefined; // false (different types)
```

**Trap:** Using `== null` as a shortcut to check for both `null` and `undefined` in one comparison is actually a common, accepted pattern — not a mistake, but be ready to explain *why* it works (loose equality's special-case rule for null/undefined).

### Q5. What is the difference between `==` and `===`?

**A:** `==` (loose equality) coerces operand types before comparing; `===` (strict equality) compares both value and type with no coercion.

```javascript
5 == "5"; // true - string coerced to number
5 === "5"; // false - different types
0 == false; // true
0 === false; // false
null == undefined; // true (special case)
NaN == NaN; // false (NaN is never equal to itself - see Q211)
```

**Trap:** Always default to `===` in real code; `==` coercion rules have enough edge cases (`[] == false` is `true`!) that relying on it is a maintenance risk, not just a style preference.

### Q6. What is type coercion in JavaScript? *(new)*

**A:** JS automatically converting a value from one type to another when an operation expects a different type — happens implicitly (via operators) or explicitly (via functions like `Number()`, `String()`).

```javascript
// Implicit coercion
"5" + 3; // "53" - number coerced to string (+ prefers string concat)
"5" - 3; // 2   - string coerced to number (- only makes sense numerically)
"5" * "2"; // 10 - both coerced to numbers
true + true; // 2  - booleans coerced to 1/0
[] + []; // ""  - arrays coerced to strings, then concatenated (see Q212)

// Explicit coercion (preferred in real code)
Number("5"); // 5
String(5); // "5"
Boolean(""); // false
```

**Trap:** `+` is the odd one out — if *either* operand is a string, it concatenates; every other arithmetic operator (`-`, `*`, `/`) always coerces to number first.

### Q7. What are truthy and falsy values? *(new)*

**A:** In a boolean context (`if`, `&&`, `||`, `!!`), every value is either "truthy" or "falsy." JS has exactly **8 falsy values** — everything else is truthy.

```javascript
// All falsy values - memorize this exact list:
Boolean(false); // false
Boolean(0); // false
Boolean(-0); // false
Boolean(0n); // false (BigInt zero)
Boolean(""); // false
Boolean(null); // false
Boolean(undefined); // false
Boolean(NaN); // false

// Everything else is truthy - including these common gotchas:
Boolean("0"); // true - non-empty string!
Boolean([]); // true - empty array is an object, objects are always truthy
Boolean({}); // true - same reason
```

**Trap:** `[]` and `{}` are truthy — a very common interview trick since intuitively an "empty" thing feels falsy.

### Q8. What is `NaN`, and how do you check for it?

**A:** `NaN` ("Not a Number") represents an invalid numeric result. It's the only value in JS not equal to itself, which breaks naive checks.

```javascript
NaN === NaN; // false!
typeof NaN; // "number" - yes, NaN's type IS "number" (see Q211)
Number.isNaN(NaN); // true - the reliable way to check (see Q9)
```

**Trap:** Confusing `NaN`'s type — `typeof NaN` is `"number"`, not `"NaN"` or `"undefined"`, which trips people up constantly.

### Q9. What is the difference between `isNaN()` and `Number.isNaN()`?

**A:** Global `isNaN()` coerces its argument to a number first, which produces false positives; `Number.isNaN()` (ES6) does not coerce, so it only returns `true` for the actual `NaN` value.

```javascript
isNaN("hello"); // true - "hello" coerces to NaN, misleading!
isNaN(NaN); // true
isNaN("123"); // false - "123" coerces to a valid number

Number.isNaN("hello"); // false - it's a string, not actually NaN
Number.isNaN(NaN); // true
```

**Trap:** Always lead with "global `isNaN` coerces, `Number.isNaN` doesn't" as the one-line distinction — it's the exact thing this question is testing.

### Q10. What is the difference between `var`, `let`, and `const`?

**A:**

```javascript
var x = 1; // function-scoped, hoisted + initialized as undefined, re-declarable
let y = 2; // block-scoped, hoisted but in TDZ until declared, re-assignable
const z = 3; // block-scoped, hoisted but in TDZ, cannot be re-assigned

if (true) {
  var x2 = "a";
  let y2 = "b";
}
console.log(x2); // "a" - leaks out of the block
console.log(typeof y2); // ReferenceError if accessed - y2 doesn't exist here

const arr = [1, 2];
arr.push(3); // fine - const prevents re-assignment, not mutation
// arr = [4, 5];      // TypeError - cannot re-assign
```

**Trap:** `const` doesn't mean immutable — it only locks the *binding*, not the contents of an object/array.

### Q11. What is hoisting in JavaScript?

**A:** JS moves declarations (not initializations) to the top of their scope during the compile phase, before code executes.

```javascript
console.log(fn1()); // "hoisted!" - function declarations are fully hoisted
function fn1() {
  return "hoisted!";
}

console.log(x); // undefined, not ReferenceError - var is hoisted & initialized
var x = 5;

console.log(y); // ReferenceError - let/const are hoisted but stay in the TDZ
let y = 5;
```

**Trap:** Function *expressions* (`const fn = function(){}`) are NOT hoisted the way function *declarations* are — only the `const fn` binding hoists (into TDZ), not the function body.

### Q12. Are `let` and `const` hoisted?

**A:** Yes — technically. They're hoisted to the top of their block scope, but remain uninitialized in the **Temporal Dead Zone (TDZ)** until their declaration line runs, so accessing them early throws instead of returning `undefined`.

```javascript
{
  console.log(a); // ReferenceError: Cannot access 'a' before initialization
  let a = 10;
}
```

**Trap:** Saying "`let`/`const` aren't hoisted" is a common half-truth — the accurate answer is "hoisted but not initialized," which is exactly what the TDZ is (see Q13).

### Q13. What is the Temporal Dead Zone?

**A:** The span between entering a scope and the line where a `let`/`const` variable is actually declared. Accessing the variable anywhere in that span throws a `ReferenceError`.

```javascript
function example() {
  console.log(typeof myVar); // "undefined" - var, no TDZ
  console.log(typeof myLet); // ReferenceError - inside TDZ
  var myVar = 1;
  let myLet = 2;
}
```

**Trap:** The TDZ isn't a JS engine bug — it's an intentional design choice to catch use-before-declare bugs early, unlike `var`'s silent `undefined`.

### Q14. What is strict mode in JavaScript? *(new)*

**A:** An opt-in mode (`"use strict"`) that makes JS throw errors for things it used to silently allow — catching bugs and disabling some unsafe features.

```javascript
"use strict";

x = 10; // ReferenceError - can't create implicit globals (silent in non-strict)

function sum(a, a) {
  // SyntaxError - duplicate parameter names not allowed (see Q206)
  return a + a;
}

this; // undefined in a plain function call (non-strict: the global object)
```

**Trap:** ES6 modules and class bodies are **automatically strict** — you never need to write `"use strict"` yourself in modern module-based or class-based code.

### Q15. What are undeclared and undefined variables? *(new)*

**A:** An **undefined** variable has been declared but not assigned a value. An **undeclared** variable was never declared at all — referencing it throws, but *assigning* to it in non-strict mode silently creates a global (a classic bug source).

```javascript
let a;
console.log(a); // undefined - declared, no value

console.log(b); // ReferenceError: b is not defined - never declared

function leak() {
  c = 10; // no let/const/var - creates an accidental global (non-strict mode only)
}
leak();
console.log(c); // 10 - leaked into global scope!
```

**Trap:** "Undefined" and "not defined" sound similar but describe two different bugs — mixing them up in an interview signals imprecise understanding.

### Q16. What is variable shadowing? *(new)*

**A:** Declaring a variable in an inner scope with the same name as one in an outer scope — the inner one "shadows" (hides) the outer one for the rest of that block.

```javascript
let x = "outer";

function shadow() {
  let x = "inner"; // shadows the outer x
  console.log(x); // "inner"
}
shadow();
console.log(x); // "outer" - unaffected

// Illegal shadowing: you can't shadow `let` with `var` in the same/nested scope in a way that breaks the TDZ
let y = 1;
{
  var y = 2; // SyntaxError: Identifier 'y' has already been declared
}
```

**Trap:** "Illegal shadowing" (mixing `var` and `let` for the same name) is the specific follow-up interviewers ask after this question.

### Q17. What is the difference between global scope, function scope, and block scope?

**A:**

```javascript
var globalVar = "I'm global"; // accessible everywhere

function myFunction() {
  var functionScoped = "only inside this function";
  if (true) {
    let blockScoped = "only inside this block";
    var stillFunctionScoped = "var ignores the block!";
  }
  console.log(stillFunctionScoped); // works - var isn't block-scoped
  // console.log(blockScoped);         // ReferenceError
}
```

**Trap:** `var` ignores block boundaries entirely (`if`, `for`, `{}`) — it's only contained by function boundaries, which is exactly why `let`/`const` were introduced.

### Q18. What is the difference between pass by value and pass by reference? *(new)*

**A:** JS always passes arguments **by value** — but for objects, the "value" being copied is a reference (pointer) to the object, so mutations through that reference are visible outside the function, while reassignment is not.

```javascript
function changeValue(num) {
  num = 100; // reassigning a local copy
}
let x = 10;
changeValue(x);
console.log(x); // 10 - unaffected, primitive copied by value

function mutateObj(obj) {
  obj.name = "changed"; // mutates the object the reference points to
}
function reassignObj(obj) {
  obj = { name: "new object" }; // reassigns the LOCAL reference only
}
let person = { name: "original" };
mutateObj(person);
console.log(person.name); // "changed" - mutation is visible outside

reassignObj(person);
console.log(person.name); // still "changed" - reassignment inside doesn't escape
```

**Trap:** JS is technically **never** "pass by reference" in the C++ sense — it's "pass by value, where the value can be a reference." Mixing this up is one of the most common wrong answers in interviews.

### Q19. Why is JavaScript called a dynamically typed language? *(new)*

**A:** Variable types are determined and can change **at runtime**, not declared upfront — the same variable can hold a number, then a string, with no type annotation or compiler check.

```javascript
let x = 5; // number
x = "hello"; // now a string - completely legal
x = true; // now a boolean
x = { a: 1 }; // now an object
```

**Trap:** "Dynamically typed" ≠ "weakly typed" — they're related but distinct concepts; JS is both, and being able to explain the difference (dynamic = type checked at runtime, weak = allows implicit coercion between types) shows deeper understanding.

### Q20. What is the difference between mutable and immutable values?

**A:** Immutable values (primitives) cannot be changed after creation — any "modification" actually creates a new value. Mutable values (objects/arrays) can be changed in place, and `Object.freeze()` is the built-in way to lock that down.

```javascript
let str = "hello";
str[0] = "H"; // silently fails - strings are immutable
console.log(str); // "hello" unchanged
str = str.toUpperCase(); // creates a NEW string, doesn't mutate the old one

const obj = Object.freeze({ name: "John" });
obj.name = "Jane"; // fails silently (throws in strict mode)
console.log(obj.name); // "John" - unchanged

// Without freeze, objects are mutable by default:
const arr = [1, 2, 3];
arr.push(4); // mutates in place
console.log(arr); // [1, 2, 3, 4]
```

**Trap:** All 7 primitive types are immutable by spec — even strings, which *look* like they support index mutation but silently no-op instead.

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
