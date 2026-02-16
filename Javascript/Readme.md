# JavaScript Interview Prep — Q&A Format

**Level:** Beginner to Advanced  
**Updated:** Feb 16, 2026  
**Format:** Question & Answer

---

## Topics Covered

- JavaScript Basics (Variables, Data Types, Operators)
- Functions & Scope
- Closures
- Hoisting
- `this` Keyword
- Promises & Async/Await
- Callbacks
- Event Loop
- Arrays & Objects
- ES6+ Features
- Higher Order Functions
- Prototypal Inheritance
- Currying
- Debounce & Throttle
- Polyfills (Implements map, filter, reduce)
- Deadlock
- Shadow DOM
- Common Interview Questions

---

## 1. JavaScript Basics (Variables, Data Types, Operators)

### Q1: What is JavaScript?

**A:** JavaScript is a high-level, interpreted, event-driven programming language used to create interactive and dynamic web content. It runs on both client-side (browsers) and server-side (Node.js). JavaScript is dynamically typed and supports both functional and object-oriented programming paradigms.

### Q2: What are the data types supported by JavaScript?

**A:** JavaScript has two categories of data types:

**Primitive Types:**

- Number: `let age = 25;`
- String: `let name = "John";`
- Boolean: `let isActive = true;`
- Null: Intentional absence of value
- Undefined: Uninitialized variable
- Symbol: Unique identifier (ES6)
- BigInt: Large integers beyond `Number.MAX_SAFE_INTEGER`

**Non-Primitive Types:**

- Object: Collections of key-value pairs
- Array: Ordered collections
- Function: Reusable code blocks

### Q3: How do you detect primitive vs non-primitive data types?

**A:** Using the `typeof` operator:

```javascript
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof null; // "object" // known quirk
typeof Symbol(); // "symbol"
typeof {}; // "object"
typeof []; // "object"

// For arrays specifically
Array.isArray([1, 2, 3]); // true
```

### Q4: What's the difference between `==` and `===`?

**A:**

- `==` (loose equality) performs type coercion before comparison
- `===` (strict equality) compares without any type conversion

```javascript
5 == "5"; // true (string coerced to number)
5 === "5"; // false (different types)
null == undefined; // true
null === undefined; // false
0 == false; // true
0 === false; // false
```

### Q5: What is the difference between `null` and `undefined`?

**A:**

- `null` is an intentional assignment value representing the absence of value
- `undefined` is a variable declared but not assigned a value

```javascript
let a = null;
console.log(a); // null

let b;
console.log(b); // undefined

typeof null; // "object" (bug in JS)
typeof undefined; // "undefined"
```

### Q6: What are the JavaScript operators?

**A:** JavaScript has several types of operators.

- Arithmetic: `+`, `-`, `*`, `/`, `%`, `++`, `--`
- Comparison: `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
- Logical: `&&`, `||`, `!`
- Bitwise: `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`

```javascript
// Examples
10 + 5; // 15
10 - 5; // 5
10 * 5; // 50
10 / 5; // 2
10 % 3; // 1

true && false; // false
true || false; // true
!true; // false
```

---

## 2. Functions & Scope

### Q7: What is the difference between `var`, `let`, and `const`?

**A:**

| Feature                 |                            var |       let |     const |
| ----------------------- | -----------------------------: | --------: | --------: |
| Scope                   |                       Function |     Block |     Block |
| Re-declaration          |                            Yes |        No |        No |
| Re-assignment           |                            Yes |       Yes |        No |
| Hoisting                | Yes (initialized to undefined) | Yes (TDZ) | Yes (TDZ) |
| Initialization Required |                             No |        No |       Yes |

```javascript
// var - function scoped
function example1() {
  if (true) {
    var x = 10;
  }
  console.log(x); // 10 (accessible)
}

// let - block scoped
function example2() {
  if (true) {
    let y = 20;
  }
  // console.log(y); // ReferenceError
}

// const - immutable binding
const z = 30;
// z = 40; // Error - cannot reassign

const obj = { name: "John" };
obj.name = "Jane"; // OK - modifying property
```

### Q8: What is scope in JavaScript?

**A:** Scope refers to the context in which variables are declared and accessed. It defines the visibility and accessibility of variables.

Types of scope:

- Global Scope: Variables accessible anywhere
- Function Scope: Variables accessible only within the function
- Block Scope: `let` and `const` are limited to blocks

```javascript
// Global
var global = "I'm global";
function test() {
  console.log(global);
}

// Function scoped
function test2() {
  var local = "I'm local";
  console.log(local);
}

// Block scoped
if (true) {
  let blockVar = 10;
  const blockConst = 20;
}
// blockVar and blockConst are not accessible here
```

### Q9: What is lexical scope?

**A:** Lexical scope means the scope is determined by where code is written, not where it's called. Inner functions have access to variables from their parent functions.

```javascript
const global = "global";
function outer() {
  const outerVar = "outer";
  function inner() {
    const innerVar = "inner";
    console.log(innerVar); // "inner"
    console.log(outerVar); // "outer"
    console.log(global); // "global"
  }
  inner();
}
outer();
```

### Q10: What are arrow functions?

**A:** Arrow functions are a concise way to write functions introduced in ES6.

```javascript
// Traditional function
function add(a, b) {
  return a + b;
}

// Arrow function
const addArrow = (a, b) => a + b;

const square = (x) => x * x;
const multiply = (a, b) => a * b;

const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};

const getRandom = () => Math.random();
```

### Q11: Key differences between arrow and regular functions

- `this` binding: arrow functions do not have their own `this`; they inherit it from the enclosing scope.
- `arguments` object: regular functions have `arguments`; arrow functions do not.
- Arrow functions cannot be used as constructors (no `new`).

```javascript
const obj = {
  name: "John",
  regularMethod: function () {
    console.log(this.name);
  }, // "John"
  arrowMethod: () => {
    console.log(this.name);
  }, // undefined (in many cases)
};
```

### Q12: What are default parameters?

**A:** Default parameters allow you to set default values for function parameters.

```javascript
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet(); // "Hello, Guest!"
greet("John"); // "Hello, John!"
greet("Jane", "Hi"); // "Hi, Jane!"

const multiply = (a, b = 1) => a * b;
```

---

## 3. Closures

### Q13: What is a closure?

**A:** A closure is a function that has access to variables from its outer scope even after the outer function has returned.

```javascript
function outer() {
  let count = 0;
  return function inner() {
    count++;
    return count;
  };
}

const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

### Q14: Practical use cases for closures

1. Data privacy / encapsulation (private variables)
2. Function factories (creating partially applied functions)
3. Event handlers that capture loop index (when using `let`)

```javascript
function createCounter() {
  let count = 0;
  return {
    increment() {
      return ++count;
    },
    decrement() {
      return --count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment(); // 1
```

---

## 4. Hoisting

### Q15: What is hoisting?

**A:** Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their scope before code execution.

```javascript
console.log(a); // undefined
var a = 5;

// Equivalent (conceptually):
// var a;
// console.log(a); // undefined
// a = 5;

// Function hoisting
sayHello();
function sayHello() {
  console.log("Hello!");
}

// let / const are hoisted but uninitialized (TDZ)
// console.log(b); // ReferenceError
// let b = 10;
```

### Q16: What is the Temporal Dead Zone (TDZ)?

**A:** The Temporal Dead Zone is the period between entering a scope and when a `let`/`const` variable is declared and initialized. Accessing it in the TDZ throws a `ReferenceError`.

```javascript
function example() {
  // console.log(x); // ReferenceError (TDZ)
  let x = 5; // TDZ ends here
  console.log(x); // 5
}
```

---

## 5. `this` Keyword

### Q17: What does `this` refer to?

**A:** `this` refers to the context in which a function is executed. Its value depends on how the function is called.

- Global context: `this` is `window` (browser) or `global` (Node.js) in non-strict mode.
- Method invocation: `this` is the object on which the method was called.
- Function call (strict mode): `this` is `undefined`.
- Constructor (`new`): `this` is the newly created instance.

```javascript
const obj = {
  name: "John",
  greet() {
    console.log(this.name);
  },
};
obj.greet(); // "John"
```

### Q18: `call()`, `apply()`, and `bind()`

- `call(thisArg, ...args)` — invoke with specified `this` and arguments.
- `apply(thisArg, argsArray)` — same as `call` but takes an array of arguments.
- `bind(thisArg, ...args)` — returns a new function with bound `this` and optionally preset arguments.

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}
const person = { name: "Alice" };
greet.call(person, "Hello", "!"); // "Hello, Alice!"
greet.apply(person, ["Hi", "."]); // "Hi, Alice."
const bound = greet.bind(person, "Hey");
bound("?"); // "Hey, Alice?"
```

---

## 6. Promises & Async/Await

### Q19: What is a Promise?

**A:** A Promise represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("Success!"), 1000);
});

promise
  .then((result) => console.log(result)) // "Success!"
  .catch((err) => console.error(err))
  .finally(() => console.log("Done"));
```

### Q20: Useful Promise methods

- `Promise.all([...])` — wait for all promises (rejects if any reject)
- `Promise.race([...])` — resolves/rejects with first settled promise
- `Promise.allSettled([...])` — wait for all and return results with statuses

### Q21: What is async/await?

**A:** `async/await` is syntactic sugar over Promises that makes asynchronous code look synchronous.

```javascript
async function fetchData() {
  try {
    const response = await fetch("https://api.example.com/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    console.log("Request completed");
  }
}

fetchData().then((data) => console.log(data));
```

---

## 7. Callbacks

### Q22: What is a callback?

**A:** A callback is a function passed as an argument to another function, which is called when some event occurs.

```javascript
function greeting(name) {
  alert("Hello " + name);
}
function processUserInput(callback) {
  const name = prompt("Please enter your name.");
  callback(name);
}
processUserInput(greeting);
```

### Q23: What is callback hell?

**A:** Callback hell (pyramid of doom) occurs when callbacks are nested too deeply, making code hard to read. Use Promises or `async/await` to flatten.

---

## 8. Event Loop

### Q24: What is the Event Loop?

**A:** The Event Loop is JavaScript's mechanism for executing asynchronous callbacks. It continuously checks the call stack and task queues (microtask and macrotask).

```javascript
console.log("Start");
setTimeout(() => console.log("Timeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
console.log("End");

// Output:
// Start
// End
// Promise
// Timeout
```

### Q25: Microtasks vs Macrotasks

- Microtasks (higher priority): Promises, `queueMicrotask`, `MutationObserver`
- Macrotasks (lower priority): `setTimeout`, `setInterval`, I/O, etc.

---

## 9. Arrays & Objects

### Q26: Important array methods

- Mutating: `pop`, `push`, `shift`, `unshift`, `splice`
- Non-mutating: `map`, `filter`, `reduce`, `find`, `includes`, `slice`

```javascript
[1, 2, 3].map((x) => x * 2); // [2,4,6]
[1, 2, 3, 4].filter((x) => x > 2); // [3,4]
[1, 2, 3, 4].reduce((sum, x) => sum + x, 0); // 10
```

### Q27: Working with objects

```javascript
const obj = { name: "John", age: 25 };
obj.name; // "John"
obj["age"]; // 25
obj.city = "NYC";
delete obj.age;
Object.keys(obj); // ['name','city']
Object.values(obj); // ['John','NYC']
Object.entries(obj); // [['name','John'],['city','NYC']]
const newObj = { ...obj, country: "USA" };
```

---

## 10. ES6+ Features

### Q28: Destructuring

```javascript
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];
const { name, age } = { name: "John", age: 25 };
const { name: personName } = { name: "John" };
const { country = "USA" } = {};
```

### Q29: Spread and rest operators

```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5];
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
```

### Q30: Template literals

```javascript
const name = "John";
const age = 25;
const greeting = `Hello, ${name}!`;
const result = `Sum: ${2 + 3}`; // "Sum: 5"
```

---

## 11. Higher Order Functions

### Q31: What is a Higher Order Function (HOF)?

**A:** A HOF is a function that takes functions as arguments and/or returns functions.

```javascript
function withLogging(fn) {
  return function (...args) {
    console.log("Calling", fn.name);
    return fn(...args);
  };
}

function add(a, b) {
  return a + b;
}
const addWithLogging = withLogging(add);
addWithLogging(2, 3); // Logs and returns 5
```

---

## 12. Prototypal Inheritance

### Q33: What are prototypes?

**A:** Every JavaScript object has a prototype from which it inherits properties and methods.

```javascript
function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return `Hello, ${this.name}`;
};
const p = new Person("John");
console.log(p.greet()); // "Hello, John"
```

---

## 13. Currying

### Q36: What is currying?

**A:** Currying converts a function that takes multiple arguments into a sequence of functions that each take a single argument.

```javascript
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6
```

### Q38: Implementing a `curry` utility

```javascript
function curry(fn) {
  const arity = fn.length;
  return function $curry(...args) {
    if (args.length < arity) {
      return (...nextArgs) => $curry(...args, ...nextArgs);
    }
    return fn(...args);
  };
}
```

---

## Memoization

### Q37: What is memoization?

**A:** Memoization is an optimization technique that caches the results of expensive function calls and returns the cached result when the same inputs occur again. It's most effective for pure functions (no side-effects, deterministic outputs for given inputs).

```javascript
// Generic memoize utility using a Map and JSON-serialized argument key
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// Example: recursive Fibonacci (slow) vs memoized
function slowFib(n) {
  if (n <= 1) return n;
  return slowFib(n - 1) + slowFib(n - 2);
}

const fastFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
});

console.time("slow");
// avoid large n for slowFib
console.log(slowFib(20));
console.timeEnd("slow");

console.time("fast");
console.log(fastFib(40)); // fast thanks to memoization
console.timeEnd("fast");
```

**Notes:**

- Use memoization for pure functions where repeated calls with same args occur.
- Be careful with caching many unique inputs (memory growth); consider cache eviction strategies for long-running processes.

---

## 14. Debounce & Throttle

### Q39: Debouncing

```javascript
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}
```

### Q40: Throttling

```javascript
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
}
```

---

## 15. Polyfills (map, filter, reduce)

### Q42: `Array.prototype.map` polyfill

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback.call(thisArg, this[i], i, this));
  }
  return result;
};
```

### Q43: `Array.prototype.filter` polyfill

```javascript
Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};
```

### Q44: `Array.prototype.reduce` polyfill

```javascript
Array.prototype.myReduce = function (callback, initialValue) {
  if (this.length === 0 && initialValue === undefined) {
    throw new TypeError("Reduce of empty array with no initial value");
  }
  let acc = initialValue;
  let startIndex = 0;
  if (initialValue === undefined) {
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};
```

---

## 16. Common Interview Questions

### Q45: What is the `new` operator?

**A:** `new` creates an instance from a constructor function. Steps:

1. Create an empty object `{}`
2. Set the object's `__proto__` to the constructor's `prototype`
3. Call the constructor with `this` set to the new object
4. Return the object (unless constructor returns an object)

### Q46: Event bubbling and capturing

- Bubbling: events propagate from child to parent.
- Capturing: events propagate from parent to child (useCapture = true).

### Q47: Event delegation

Handle events at a higher level (e.g., parent) and inspect `event.target` — efficient and works with dynamic elements.

### Q48: REST API calls (fetch examples)

```javascript
// GET
fetch("https://api.example.com/users")
  .then((r) => r.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));

// POST
fetch("https://api.example.com/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John", age: 25 }),
})
  .then((r) => r.json())
  .then((data) => console.log(data));

// async/await
async function getUsers() {
  const response = await fetch("https://api.example.com/users");
  return response.json();
}
```

### Q49: Memory leaks

Common causes: lingering global references, forgotten timers, event listeners not removed. Fix by clearing references and removing listeners.

### Q50: CORS

Cross-Origin Resource Sharing controls access to resources from different origins. Server must send proper `Access-Control-*` headers to allow cross-origin requests.

---

## 17. Shallow Copy vs Deep Copy

### Q51: Difference

- Shallow copy copies top-level properties only; nested objects are shared by reference.
- Deep copy duplicates entire structure so nested objects are independent.

### Q52: Shallow copy techniques

- Objects: `Object.assign({}, obj)` or `{ ...obj }`
- Arrays: `arr.slice()`, `arr.concat([])`, or `[...arr]`

```javascript
const original = { a: 1, nested: { x: 10 } };
const shallow = { ...original };
shallow.a = 2;
shallow.nested.x = 99;
// original.nested.x === 99
```

### Q53: Deep copy techniques

- `JSON.parse(JSON.stringify(obj))` — simple but loses functions, `undefined`, Symbols, Date, Map, Set, etc.
- `structuredClone(obj)` — modern, supports many built-ins (not functions)
- Custom recursive clone for full control

```javascript
const original = { a: 1, nested: { x: 10 } };
const deep = JSON.parse(JSON.stringify(original));
deep.nested.x = 99;
// original.nested.x === 10
```

## What is Deadlock?

A **deadlock** occurs when two or more processes are waiting for each other to release resources, and none of them can proceed.

### Classic Example (Multi-threaded Systems)

- Process A waits for Resource B
- Process B waits for Resource A
- Neither can continue

➡ System becomes permanently stuck.

---

## Does Deadlock Happen in JavaScript?

### Short Answer:

Traditional deadlock **does NOT occur in JavaScript’s main thread** because:

- JavaScript is **single-threaded**
- It does not use traditional thread locks like Java or C++

However, deadlock-like situations can occur logically in:

- Promises
- Async/Await
- Event Loop misuse
- Worker Threads (Node.js)
- Shared memory with Atomics

## What is Shadow DOM?

The **Shadow DOM** is a web standard that allows you to encapsulate HTML, CSS, and JavaScript inside a separate, isolated DOM tree attached to an element.

It is mainly used in **Web Components** to create reusable and fully encapsulated UI components.

---

## Why Do We Need Shadow DOM?

Normally, in the DOM:

- CSS is global
- Styles can leak
- JavaScript can accidentally modify elements
- ID/class conflicts can occur

Shadow DOM solves this by:

- Encapsulating styles
- Preventing CSS conflicts
- Protecting internal structure
- Creating reusable components

---

## Creating Shadow DOM

```js
const host = document.querySelector("#my-element");

// Attach shadow root
const shadowRoot = host.attachShadow({ mode: "open" });

// Add content inside shadow DOM
shadowRoot.innerHTML = `
  <style>
    p { color: red; }
  </style>
  <p>Hello from Shadow DOM</p>
`;
```

### Shadow DOM Modes

Open Mode

```js
element.attachShadow({ mode: "open" });
```

- Accessible via element.shadowRoot
- Can inspect via JavaScript

Closed Mode

```js
element.attachShadow({ mode: "closed" });
```

- element.shadowRoot returns null
- Not accessible from outside

## Practice Tips for Interviews

1. **Understand, don't memorize** — know the "why" behind concepts.
2. **Write code** — practice on LeetCode, HackerRank, or CodePen.
3. **Explain your code** — communication is key in interviews.
4. **Test edge cases** — consider null, empty, undefined values.
5. **Know the fundamentals** — closures, scope, `this`.
6. **Practice debugging** — be able to identify and fix bugs.
7. **Build projects** — real-world experience demonstrates competency.
8. **Stay updated** — JavaScript evolves; keep learning.

**Good luck with your JavaScript interviews! Practice consistently, and you'll ace it!**
