# JavaScript Interview Prep — Phase 2 – Functions, Scope, Closures & `this`

**Part 2 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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
