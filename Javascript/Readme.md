# JavaScript Interview Prep - Q&A Format

**Level:** Beginner to Advanced  
**Updated:** Aug 20, 2026  
**Format:** Question & Answer

---

## **Topics Covered**

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
- ES6 Classes
- Currying
- Memoization
- Debounce & Throttle
- Polyfills (Implement map, filter, reduce)
- Common Interview Questions
- Shallow Copy vs Deep Copy
- Deadlock
- Shadow DOM
- Web APIs & Browser APIs
- Generators & Iterators
- Proxy & Reflect
- Module System (ES6 Modules)
- Advanced Error Handling
- Performance Optimization
- Type Checking & Validation
- Functional Programming Advanced
- Regular Expressions
- Design Patterns
- Date & Time
- JSON
- Symbol, Set, Map & WeakMap/WeakSet
- Async Generators & for-await
- URLSearchParams & URL Handling
- V8 Engine & Performance
- Garbage Collection
- Template Literals & Tagged Templates
- Nullish Coalescing & Optional Chaining
- Spread & Rest Operators (Advanced)
- for...in vs for...of

**Total Questions:** 95  
**Format:** Q&A with Code Examples  
**Level:** Beginner to Advanced

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
- BigInt: Large integers beyond Number.MAX_SAFE_INTEGER

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

### Q5: How do you correctly check for `NaN`, and what does `Object.is()` fix?

**A:** `NaN` is the only JS value that is **not equal to itself**, which breaks naive equality checks:

```javascript
NaN === NaN; // false!
NaN == NaN; // false!

// Global isNaN() coerces its argument first - unreliable:
isNaN("hello"); // true - "hello" coerces to NaN, so this is misleading
isNaN(NaN); // true

// Number.isNaN() does NOT coerce - the reliable way to check:
Number.isNaN("hello"); // false - it's a string, not NaN
Number.isNaN(NaN); // true
Number.isNaN(0 / 0); // true

// Object.is() - like === but fixes two edge cases: NaN and -0/+0
Object.is(NaN, NaN); // true  (=== gives false)
Object.is(0, -0); // false (=== gives true - they look equal but aren't identical)
Object.is(5, 5); // true  (behaves like === for everything else)
```

**Rule of thumb:** use `Number.isNaN()` for NaN checks, `Object.is()` when you specifically need to distinguish `-0` from `0` (rare, but shows up in some numeric algorithms).

### Q6: What is the difference between `null` and `undefined`?

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

### Q7: What are the JavaScript operators?

**A:** JavaScript has several types of operators:

**Arithmetic:** `+`, `-`, `*`, `/`, `%`, `++`, `--`

```javascript
10 + 5; // 15
10 - 5; // 5
10 * 5; // 50
10 / 5; // 2
10 % 3; // 1
```

**Comparison:** `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`

```javascript
10 > 5; // true
10 < 5; // false
10 >= 10; // true
10 <= 9; // false
10 != 5; // true
10 !== "10"; // true (different types)
10 == "10"; // true (type coerced)
```

**Logical:** `&&`, `||`, `!`

```javascript
true && false; // false
true || false; // true
!true; // false
```

**Bitwise:** `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`

```javascript
5 & 1; // 1  (0101 & 0001)
5 | 1; // 5  (0101 | 0001)
5 ^ 1; // 4  (0101 ^ 0001)
~5; // -6  (bitwise NOT)
5 << 1; // 10 (shift left, multiply by 2)
5 >> 1; // 2  (shift right, divide by 2)
```

---

## 2. Functions & Scope

### Q8: What is the difference between `var`, `let`, and `const`?

**A:** In JavaScript, var, let, and const are used to declare variables, but they differ in scope, hoisting behavior, and mutability.
Modern JavaScript prefers let and const because they provide better scoping rules and safer code, while var is considered legacy.

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

### Q9: What is scope in JavaScript?

**A:** Scope refers to the context in which variables are declared and accessed. It defines the visibility and accessibility of variables.

**Types of Scope:**

**Global Scope:** Variables accessible anywhere

```javascript
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
console.log(blockVar); // ReferenceError
console.log(blockConst); // ReferenceError
```

### Q10: What is lexical scope?

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
// This demonstrates that inner() has access to
// variables from its parent scopes
```

### Q11: What are arrow functions?

**A:** Arrow functions are a concise way to write functions introduced in ES6.

```javascript
// Traditional function
function addTraditional(a, b) {
  return a + b;
}

// Arrow function - same behavior, different syntax
const add = (a, b) => a + b;

const square = (x) => x * x;
const multiply = (a, b) => a * b;

const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message;
};

// No parameters
const getRandom = () => Math.random();
```

### Q12: What's the key difference between arrow functions and regular functions?

**A:** Arrow functions and regular functions are two ways to define functions in JavaScript.
The key difference is that arrow functions do not have their own this, arguments, or prototype, whereas regular functions do.
Arrow functions are designed for short, concise functions and callbacks, while regular functions are more flexible and suitable for object methods and constructors.

**1. `this` binding:**

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

### Q13: What are default parameters?

**A:** Default parameters allow you to set default values for function parameters.

```javascript
function greet(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

greet(); // "Hello, Guest!"
greet("John"); // "Hello, John!"
greet("Jane", "Hi"); // "Hi, Jane!"

// With arrow functions
const multiply = (a, b = 1) => a * b;
multiply(5); // 5 (5 * 1)
multiply(5, 3); // 15 (5 * 3)
```

---

## 3. Closures

### Q14: What is a closure?

**A:** A closure is a function that has access to variables from its outer scope even after the outer function has returned. Every function creates a closure.

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
console.log(counter()); // 3
```

### Q15: What are practical use cases for closures?

**A:** Closures are used to maintain state, create private variables, build reusable function factories, and handle async callbacks without global variables.

**1. Data Privacy:**

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
// count is private - can't access directly
console.log(counter.count); // undefined
```

**2. Function Factory:**

```javascript
function makeMultiplier(multiplier) {
  return function (number) {
    return number * multiplier;
  };
}

const double = makeMultiplier(2);
const triple = makeMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

**3. Event Handlers:**

```javascript
function setupButtons() {
  for (let i = 1; i <= 3; i++) {
    const button = document.querySelector(`#button${i}`);
    button.addEventListener("click", function () {
      console.log(`Button ${i} clicked`);
    });
  }
}
```

---

## 4. Hoisting

### Q16: What is hoisting?

**A:** Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their scope before code execution.

**Variable Hoisting:**

```javascript
console.log(a); // undefined (not ReferenceError)
var a = 5;
console.log(a); // 5

// Behind the scenes, JS interprets it as:
// var a;
// console.log(a);  // undefined
// a = 5;

// Function hoisting
sayHello();
function sayHello() {
  console.log("Hello!");
}

// Function declarations are fully hoisted
```

**let/const Hoisting (Temporal Dead Zone):**

```javascript
console.log(b); // ReferenceError - not hoisted
let b = 10;

// let and const are hoisted but not initialized
// They exist in a "Temporal Dead Zone" (TDZ)
```

### Q17: What is the Temporal Dead Zone (TDZ)?

**A:** The Temporal Dead Zone is the period between entering a scope and when a `let`/`const` variable is declared and initialized.

```javascript
function example() {
  console.log(x); // ReferenceError - TDZ active
  let x = 5; // TDZ ends here
  console.log(x); // 5
}

// The variable exists but is uninitialized
// Accessing it throws ReferenceError
```

---

## 5. `this` Keyword

### Q18: What does `this` refer to?

**A:** `this` refers to the context in which a function is executed. Its value depends on how the function is called.

**Global Context:**

```javascript
console.log(this); // window (browser) or global (Node.js)
```

**Method Invocation:**

```javascript
const obj = {
  name: "John",
  greet() {
    console.log(this.name);
  },
};
obj.greet();
```

**Function Call:**

```javascript
function test() {
  console.log(this);
}
test(); // undefined (strict mode) or window (non-strict)
```

**Constructor:**

```javascript
function Person(name) {
  this.name = name; // this refers to new object
}
const person = new Person("Jane");
console.log(person.name); // "Jane"
```

**The classic trap - a regular function nested inside a method loses `this`:**

```javascript
const obj = {
  name: "John",
  regularNested() {
    function inner() {
      console.log(this.name); // undefined - `this` is NOT obj here!
      // `this` is `undefined` (strict mode) or the global object (sloppy mode)
      // because inner() is called as a plain function, not as obj.inner()
    }
    inner();
  },
};
obj.regularNested();
```

**Fix 1 - arrow function (inherits `this` lexically from where it's defined):**

```javascript
const obj2 = {
  name: "John",
  arrowFix() {
    const inner = () => {
      console.log(this.name); // "John" - arrow has no own `this`,
    }; // so it uses `this` from arrowFix's scope
    inner();
  },
};
obj2.arrowFix();
```

**Fix 2 - capture `this` in a variable (the pre-ES6 way, still seen in older code):**

```javascript
const obj3 = {
  name: "John",
  oldFix() {
    const self = this;
    function inner() {
      console.log(self.name); // "John"
    }
    inner();
  },
};
```

**Fix 3 - `.bind(this)`:**

```javascript
const obj4 = {
  name: "John",
  bindFix() {
    function inner() {
      console.log(this.name);
    }
    inner.bind(this)(); // "John"
  },
};
```

This is why arrow functions are generally preferred for callbacks inside methods (e.g. `setTimeout`, array methods, event handlers) when you need `this` to stay pointed at the enclosing object.

### Q19: What are `call()`, `apply()`, and `bind()`?

**A:** These methods allow explicit control over the `this` context.
call and apply execute immediately with a custom this, while bind returns a new function with permanently bound this.

**call()** - Invokes function with specific `this` and individual arguments:

```javascript
function greet(greeting, punctuation) {
  return `${greeting}, ${this.name}${punctuation}`;
}

const person = { name: "Alice" };
greet.call(person, "Hello", "!"); // "Hello, Alice!"
```

**apply()** - Like `call()` but arguments passed as array:

```javascript
greet.apply(person, ["Hi", "."]); // "Hi, Alice."
```

**bind()** - Creates new function with bound `this`:

```javascript
const boundGreet = greet.bind(person, "Hey");
boundGreet("?"); // "Hey, Alice?"
```

---

## 6. Promises & Async/Await

### Q20: What is a Promise?

**A:** A Promise is an object that represents the eventual completion or failure of an asynchronous operation and its resulting value.

### Before Promises (Using Callbacks)

Before Promises were introduced, JavaScript handled asynchronous operations using **callbacks**. While callbacks worked, they introduced several problems as applications grew in complexity:

- Callback Hell (Pyramid of Doom)

- Hard-to-Read Code

- Difficult Error Handling

---

### How Promises Solve These Problems

Promises were introduced to provide a cleaner and more structured way to handle asynchronous code:

- Better Readability  
  Linear, predictable flow that is easier to understand and maintain.

- Chainable Syntax  
  `.then()` allows chaining multiple async operations without deep nesting.

- Centralized Error Handling  
  A single `.catch()` can handle errors from the entire promise chain.

---

### Summary

Callbacks were functional but problematic at scale.  
Promises brought structure, clarity, and reliability to asynchronous JavaScript, laying the foundation for modern patterns like **async/await**.

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Success!");
  }, 1000);
});

promise
  .then((result) => console.log(result)) // "Success!"
  .catch((err) => console.error(err))
  .finally(() => console.log("Done"));
```

**Promise States:**

- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

### Q21: How do you use Promise methods?

**A:**

**Promise.all()** - Runs multiple promises in parallel and waits until **all** of them are fulfilled.

**Behavior**

- If **all promises resolve** → returns an array of results.
- If **any promise rejects** → entire `Promise.all()` rejects immediately.

**Use Cases**

- Fetching multiple APIs together.
- Loading multiple resources in parallel.

```javascript
Promise.all([promise1, promise2, promise3])
  .then((results) => console.log(results))
  .catch((error) => console.error("One failed:", error));
```

**Promise.race()** - Returns the result of the first promise that settles (resolve or reject).

**Behavior**

- First fulfilled → resolves
- First rejected → rejects

**Use Cases**

- API request timeout system.
- Choosing the fastest server.

```javascript
Promise.race([promise1, promise2])
  .then((result) => console.log("First result:", result))
  .catch((err) => console.error(err));
```

**Promise.allSettled()** - Waits for all promises to complete, regardless of whether they resolve or reject.

**Use Cases**

- Bulk operations where failures should not stop the process.
- Logging all results.
- Displaying partial results.

```javascript
Promise.allSettled([promise1, promise2]).then((results) =>
  console.log(results),
);
```

**Promise.any()** - Returns the first promise that fulfills and ignores rejected ones.

**Behavior**

- If one fulfills → resolves with that value
- If all reject → rejects with an `AggregateError`

**Use Cases**

- Fallback or failover strategy (take the first successful response).
- Waiting for the first working resource or API.

```javascript
Promise.any([promise1, promise2, promise3])
  .then((first) => console.log("First success:", first))
  .catch((err) => console.error("All failed:", err)); // AggregateError
```

**Quick comparison:**

| Method | Waits for | Rejects when |
| --- | --- | --- |
| `Promise.all` | All to resolve | Any one rejects |
| `Promise.allSettled` | All to settle (resolve or reject) | Never |
| `Promise.race` | First to settle | First settled result is a rejection |
| `Promise.any` | First to resolve | All reject (`AggregateError`) |

### Q22: What is async/await?

**A:** Async/await is syntactic sugar over Promises that makes asynchronous code look synchronous code.

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

**Key Points:**

- `async` function always returns a Promise
- `await` pauses execution until Promise resolves
- Use `try/catch` for error handling

---

## 7. Callbacks

### Q23: What is a callback?

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

### Q24: What is callback hell?

**A:** Callback hell (or pyramid of doom) occurs when callbacks are nested too deeply, making code hard to read.

```javascript
// Callback Hell - difficult to read
getUser(1, (user) => {
  getPost(user.id, (post) => {
    getComments(post.id, (comments) => {
      getAuthor(comments[0].authorId, (author) => {
        console.log(author);
      });
    });
  });
});

// Solution: Use Promises or async/await
const user = await getUser(1);
const post = await getPost(user.id);
const comments = await getComments(post.id);
const author = await getAuthor(comments[0].authorId);
console.log(author);
```

---

## 8. Event Loop

### Q25: What is the Event Loop?

**A:** The Event Loop is JavaScript's mechanism for executing asynchronous callbacks. It continuously checks the call stack and task queue.

**How it works:**

1. Execute synchronous code (call stack)
2. When function completes, remove from stack
3. Check task queue for callbacks
4. Move callback to call stack and execute
5. Repeat

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

### Q26: What's the difference between microtask and macrotask queues?

**A:**

**Microtask Queue (higher priority):**

- Promises
- async/await
- queueMicrotask()
- MutationObserver

**Macrotask Queue (lower priority):**

- setTimeout
- setInterval
- setImmediate (Node.js)
- I/O operations

```javascript
console.log("Script Start");

setTimeout(() => console.log("setTimeout"), 0);

Promise.resolve()
  .then(() => console.log("Promise 1"))
  .then(() => console.log("Promise 2"));

console.log("Script End");

// Output:
// Script Start
// Script End
// Promise 1
// Promise 2
// setTimeout
```

---

## 9. Arrays & Objects

### Q27: What are important array methods?

**A:**

**Mutating Methods:**

```javascript
// pop() - removes last element
[1, 2, 3].pop(); // [1, 2], returns 3

// push() - adds to end
[1, 2, 3].push(4); // [1, 2, 3, 4], returns 4

// shift() - removes first
[1, 2, 3].shift(); // [2, 3], returns 1

// unshift() - adds to beginning
[1, 2, 3].unshift(0); // [0, 1, 2, 3], returns 4

// splice() - adds/removes
[1, 2, 3, 4].splice(1, 2, "a", "b"); // [1, "a", "b", 4]
```

**Non-Mutating Methods:**

```javascript
[1, 2, 3].map((x) => x * 2); // [2,4,6]
[1, 2, 3, 4].filter((x) => x > 2); // [3,4]
[1, 2, 3, 4].reduce((sum, x) => sum + x, 0); // 10

// Searching
[1, 2, 3].find((x) => x > 1); // 2 - first matching VALUE
[1, 2, 3].findIndex((x) => x > 1); // 1 - first matching INDEX
[1, 2, 3].includes(2); // true - just checks presence

// Testing
[1, 2, 3].some((x) => x > 2); // true - at least one passes
[1, 2, 3].every((x) => x > 0); // true - all must pass

// Flattening
[1, [2, 3], [4, [5, 6]]].flat(); // [1, 2, 3, 4, [5, 6]] - default depth 1
[1, [2, 3], [4, [5, 6]]].flat(Infinity); // [1, 2, 3, 4, 5, 6]
[1, 2, 3].flatMap((x) => [x, x * 2]); // [1,2, 2,4, 3,6] - map then flatten 1 level

// forEach - runs a function per item, always returns undefined
[1, 2, 3].forEach((x) => console.log(x));
```

**`sort()` - the classic gotcha:** it **mutates in place** and sorts **lexicographically (as strings) by default**, not numerically.

```javascript
[10, 1, 21, 2].sort(); // [1, 10, 2, 21] - WRONG for numbers!

// Always pass a comparator for numbers:
[10, 1, 21, 2].sort((a, b) => a - b); // [1, 2, 10, 21] - ascending
[10, 1, 21, 2].sort((a, b) => b - a); // [21, 10, 2, 1] - descending

// It mutates the original array - clone first if you need to preserve it
const original = [3, 1, 2];
const sorted = [...original].sort((a, b) => a - b);
console.log(original); // [3, 1, 2] - untouched
```

### Q28: How do you work with objects?

**A:**

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

### Q29: How do you create arrays with `Array.from()` and `Array.of()`?

**A:**

```javascript
// Array.from() - builds an array from an iterable or array-like object
Array.from("hello"); // ['h','e','l','l','o'] - strings are iterable
Array.from({ length: 3 }, (_, i) => i * 2); // [0, 2, 4] - array-like + map fn
Array.from(document.querySelectorAll("div")); // NodeList -> real array
Array.from(new Set([1, 2, 2, 3])); // [1, 2, 3]

// Array.of() - builds an array from its arguments (fixes a new Array() quirk)
Array.of(7); // [7]
new Array(7); // [empty x 7] - length 7, NOT an array containing 7!
Array.of(1, 2, 3); // [1, 2, 3]
```

### Q30: How do you make an object immutable with `Object.freeze()` and `Object.seal()`?

**A:** Both restrict mutation, but at different strengths - and both are **shallow only**.

```javascript
const frozen = Object.freeze({ name: "John", nested: { age: 25 } });
frozen.name = "Jane"; // fails silently (throws in strict mode)
frozen.city = "NYC"; // fails - can't add new properties
delete frozen.name; // fails - can't delete
console.log(frozen.name); // "John" - unchanged

// Shallow only! Nested objects are still mutable:
frozen.nested.age = 99; // this WORKS - frozen doesn't reach into nested objects
console.log(frozen.nested.age); // 99

console.log(Object.isFrozen(frozen)); // true

// Object.seal() - weaker: can modify existing properties, but can't add/remove
const sealed = Object.seal({ name: "John" });
sealed.name = "Jane"; // works
sealed.city = "NYC"; // fails - can't add new properties
delete sealed.name; // fails - can't delete

console.log(Object.isSealed(sealed)); // true
```

**Quick comparison:**

| | Add props | Modify props | Delete props |
| --- | --- | --- | --- |
| `Object.seal()` | ❌ | ✅ | ❌ |
| `Object.freeze()` | ❌ | ❌ | ❌ |

For deep immutability, you'd need a recursive freeze, or a library like Immer / Immutable.js.

---

## 10. ES6+ Features

### Q31: What is destructuring?

**A:** Destructuring extracts values from arrays or objects into variables.

**Array Destructuring:**

```javascript
const [a, b, c] = [1, 2, 3];
const [first, ...rest] = [1, 2, 3, 4];
const { name, age } = { name: "John", age: 25 };
const { name: personName } = { name: "John" };
const { country = "USA" } = {};
```

### Q32: What are spread and rest operators?

**A:** Both use `...` syntax but work differently.

**Spread Operator** - Expands array/object:

```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5];
const sum = (...numbers) => numbers.reduce((a, b) => a + b, 0);
```

**Rest Operator** - gather multiple remaining values into a single array or object

```javascript
function sumAll(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log(sumAll(1, 2, 3)); // Output: 6
console.log(sumAll(10, 20, 30, 40, 50)); // Output: 150
```

### Q33: What are template literals?

**A:** Template literals use backticks and allow embedding expressions.

```javascript
const name = "John";
const age = 25;

// Basic
const greeting = `Hello, ${name}!`;

// Multi-line
const message = `
    Name: ${name}
    Age: ${age}
`;

// Expressions
const result = `Sum: ${2 + 3}`; // "Sum: 5"

// Tagged templates
function highlight(strings, ...values) {
  return strings
    .map((str, i) => str + (values[i] ? `<mark>${values[i]}</mark>` : ""))
    .join("");
}

highlight`Hello ${name}, you are ${age} years old`;
```

---

## 11. Higher Order Functions

### Q34: What is a Higher Order Function?

**A:** A Higher Order Function (HOF) is a function that takes functions as arguments and/or returns functions.

```javascript
// HOF taking a function as argument
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

### Q35: What are prototypes?

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

### Q36: What is the prototype chain, and how does property lookup work?

**A:** When you access a property on an object, JavaScript checks the object itself first, then walks up its prototype chain (`__proto__` links) until it finds the property or reaches `null`.

```javascript
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function () {
  return `${this.name} is eating`;
};

function Dog(name) {
  Animal.call(this, name);
}
Dog.prototype = Object.create(Animal.prototype); // link the chain
Dog.prototype.constructor = Dog;
Dog.prototype.bark = function () {
  return `${this.name} says Woof!`;
};

const rex = new Dog("Rex");
console.log(rex.bark()); // "Rex says Woof!" - own prototype
console.log(rex.eat()); // "Rex is eating" - found on Animal.prototype
console.log(rex.toString()); // found on Object.prototype (end of chain)

// The chain: rex -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
```

### Q37: What's the difference between `.prototype` and `__proto__`?

**A:** `.prototype` exists only on **functions/classes** and is the object that instances will inherit from. `__proto__` (or `Object.getPrototypeOf()`) exists on **every object** and points to the object it actually inherits from.

```javascript
function Person() {}
const p = new Person();

Person.prototype; // the object new instances inherit from
p.__proto__; // reference to Person.prototype (same object)
p.__proto__ === Person.prototype; // true

// Prefer these standard methods over __proto__ directly:
Object.getPrototypeOf(p); // reads it
Object.create(Person.prototype); // creates an object with a given prototype
Object.setPrototypeOf(p, Animal.prototype); // sets it (slow - avoid in hot code)
```

**Key distinction interviewers look for:** `class` syntax (Q35a below) is syntactic sugar over this exact prototype mechanism - it doesn't replace it.

---

## 13. ES6 Classes

### Q38: What is ES6 class syntax, and how does it relate to prototypes?

**A:** `class` is syntactic sugar over the prototype-based inheritance shown above - under the hood, methods still live on `.prototype`.

```javascript
class Person {
  // Public field
  species = "Homo sapiens";

  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Instance method -> goes on Person.prototype
  greet() {
    return `Hi, I'm ${this.name}`;
  }

  // Getter / setter
  get info() {
    return `${this.name} (${this.age})`;
  }
  set info(value) {
    [this.name, this.age] = value.split(",");
  }

  // Static method -> lives on the class itself, not instances
  static create(name) {
    return new Person(name, 0);
  }
}

class Employee extends Person {
  #salary; // private field - only accessible inside this class

  constructor(name, age, salary) {
    super(name, age); // must call before using `this`
    this.#salary = salary;
  }

  greet() {
    return `${super.greet()}, I work here`; // call parent method
  }

  getSalary() {
    return this.#salary;
  }
}

const emp = new Employee("Jane", 30, 90000);
console.log(emp.greet()); // "Hi, I'm Jane, I work here"
console.log(emp.info); // "Jane (30)"
console.log(emp.getSalary()); // 90000
// emp.#salary;             // SyntaxError - private field, inaccessible outside the class

console.log(typeof Person); // "function" - classes ARE functions
console.log(emp instanceof Person); // true - extends sets up the prototype chain
```

**Key points interviewers probe:**

- Class declarations are **not hoisted** the way function declarations are - they exist in the TDZ until evaluated.
- Class body code runs in **strict mode** automatically.
- `static` members belong to the class, not instances: `Person.create(...)`, not `emp.create(...)`.
- Private fields (`#field`) are enforced by the engine, not just convention (unlike the old `_field` naming pattern).

---

## 14. Currying

### Q39: What is currying?

**A:** Currying is a technique in JavaScript where a function that takes multiple arguments is transformed into a sequence of functions, each taking one argument at a time.

```javascript
const add = (a) => (b) => (c) => a + b + c;
add(1)(2)(3); // 6
```

### Q40: Why use currying?

**A:**

**1. Reusability (Create specialized functions)**

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

// Usage
function sumThree(a, b, c) {
  return a + b + c;
}
const curriedSum = curry(sumThree);

curriedSum(1)(2)(3); // 6
curriedSum(1, 2)(3); // 6 - can supply multiple args per call too
curriedSum(1)(2, 3); // 6
```

**2. Configuration / dependency injection**

```javascript
const request = curry((method, url, body) => fetch(url, { method, body }));
const post = request("POST"); // specialize the method
const postToUsers = post("/api/users"); // specialize the endpoint

postToUsers(JSON.stringify({ name: "Jane" })); // fires the actual request
```

---

## 15. Memoization

### Q41: What is memoization?

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

## 16. Debounce & Throttle

### Q42: What is debouncing?

**A:** Debounce delays the execution of a function until the user stops triggering the event for a specified time.

Function runs after the last event.

**📍 Best Use Cases**

- Search box autocomplete
- Form validation
- Window resize events
- Preventing API spam

```javascript
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

// Usage
const search = debounce(() => {
  console.log("Searching...");
}, 500);

// Will only execute after 500ms of no calls
input.addEventListener("input", search);
```

### Q43: What is throttling?

**A:** Throttle ensures a function runs at most once every given interval, no matter how many times the event fires.

Function runs at regular intervals, ignoring extra triggers.

**📍 Best Use Cases**

- Scroll events
- Infinite scrolling
- Mouse move events
- Prevent button double-click
- Updating progress bars

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

// Usage
const handleScroll = throttle(() => {
  console.log("Scrolling...");
}, 1000);

window.addEventListener("scroll", handleScroll);
```

### Q44: Debounce vs Throttle - When to use?

**A:**

**Debounce** - Wait until user stops:

- Search input
- Auto-save
- Window resize handling

**Throttle** - Limit frequency:

- Scroll events
- Mouse move events
- API calls on button clicks

---

## 17. Polyfills (Implement map, filter, reduce)

### Q45: How to implement Array.prototype.map?

**A:**

```javascript
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback.call(thisArg, this[i], i, this));
  }
  return result;
};

// Usage
const numbers = [1, 2, 3];
const doubled = numbers.myMap((x) => x * 2);
console.log(doubled); // [2, 4, 6]
```

### Q46: How to implement Array.prototype.filter?

**A:**

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

// Usage
const numbers = [1, 2, 3, 4, 5];
const evens = numbers.myFilter((x) => x % 2 === 0);
console.log(evens); // [2, 4]
```

### Q47: How to implement Array.prototype.reduce?

**A:**

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

// Usage
const numbers = [1, 2, 3, 4];
const sum = numbers.myReduce((acc, x) => acc + x, 0);
console.log(sum); // 10
```

---

## 18. Common Interview Questions

### Q48: What is the `new` operator?

**A:** The `new` operator creates an instance of an object from a constructor function.

```javascript
function Person(name) {
  this.name = name;
}

const person = new Person("John");

// Steps the new operator performs:
// 1. Create empty object: {}
// 2. Assign Person.prototype to __proto__
// 3. Call Person with this = new object
// 4. Return the object
```

### Q49: How do event bubbling and capturing work?

**A:**

**Event Bubbling** - Events propagate from the target element up to its ancestors (child → parent → ... → document):

```javascript
document.getElementById("parent").addEventListener("click", () => {
  console.log("Parent clicked");
});

document.getElementById("child").addEventListener("click", () => {
  console.log("Child clicked");
});

// Clicking child logs: "Child clicked" then "Parent clicked"
```

**Event Capturing** - The opposite direction: the event travels from the document down to the target *before* bubbling back up. Pass `true` (or `{ capture: true }`) as the third argument to `addEventListener` to listen during the capture phase:

```javascript
document.getElementById("parent").addEventListener(
  () => console.log("Parent - capture phase"),
  { capture: true },
);

document.getElementById("child").addEventListener("click", () => {
  console.log("Child - bubble phase");
});

// Clicking child logs: "Parent - capture phase" then "Child - bubble phase"
```

**Stopping propagation:**

```javascript
child.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevents the event from reaching ancestors
  console.log("Only this handler runs");
});

// stopImmediatePropagation() also blocks other listeners on the SAME element
```

**The three phases, in order:** Capturing (document → target) → Target → Bubbling (target → document).

### Q50: What is a memory leak?

**A:** A memory leak occurs when variables/objects are no longer needed but aren't garbage collected.

```javascript
// Memory leak example
let globalVar;

function createLeak() {
  globalVar = new Array(1000000);
}

createLeak();
// globalVar holds memory even when not needed

// Fix: Clear reference
globalVar = null;

// Event listener memory leak
function setup() {
  const element = document.getElementById("myBtn");
  element.addEventListener("click", () => {
    console.log("Clicked");
  });
}

// Fix: Remove listener when done
function teardown() {
  const element = document.getElementById("myBtn");
  element.removeEventListener("click", handler);
}
```

### Q51: What is CORS?

**A:** Cross-Origin Resource Sharing (CORS) is a security feature that controls how resources are accessed from different origins.

```javascript
// CORS request with credentials
fetch("https://different-domain.com/api", {
  method: "GET",
  credentials: "include", // Include cookies
  headers: {
    "Content-Type": "application/json",
  },
})
  .then((response) => response.json())
  .catch((error) => console.error(error));

// Server-side CORS headers
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Credentials: true
```

---

## 19. Shallow Copy vs Deep Copy

### Q52: What is the difference between shallow copy and deep copy in JavaScript?

**A:** In JavaScript, a **shallow copy** copies only the top-level properties of an object, while a **deep copy** copies the entire structure, including all nested objects and arrays. With a shallow copy, nested objects/arrays are still shared between the original and the copy (same reference), whereas with a deep copy they are fully independent.

---

### Q53: How do you create a shallow copy in JavaScript?

**A:** Common shallow copy techniques:

- For objects:
  - `Object.assign({}, obj)`
  - `{ ...obj }`

- For arrays:
  - `arr.slice()`
  - `arr.concat([])`
  - `[...arr]`

```javascript
const original = {
  a: 1,
  nested: { x: 10 },
};

// Shallow copy (spread)
const shallow = { ...original };

shallow.a = 2;
shallow.nested.x = 99;

console.log(original.a); // 1 (primitive is independent)
console.log(original.nested.x); // 99 (nested object is shared)
```

Here `a` is independent, but `nested` is shared between `original` and `shallow`, so changing `nested.x` via the copy also changes it in the original.

---

### Q54: How do you create a deep copy in JavaScript?

**A:** Deep copies can be created with:

- `JSON.parse(JSON.stringify(obj))` for simple data (no functions, `undefined`, `Symbol`, `Date`, `Map`, `Set`, etc.).
- `structuredClone(obj)` in modern environments, which supports many built-ins but not functions.
- A custom recursive clone function for full control.

```javascript
const original = {
  a: 1,
  nested: { x: 10 },
};

// Deep copy (simple approach)
const deep = JSON.parse(JSON.stringify(original));

deep.a = 2;
deep.nested.x = 99;
// original.nested.x === 10
```

## 20. Deadlock

### Q55: What is a deadlock, and can it happen in JavaScript?

**A:** A **deadlock** occurs when two or more processes are each waiting for a resource the other holds, so none of them can proceed.

**Classic example (multi-threaded systems):**

- Process A holds Resource 1, waits for Resource 2
- Process B holds Resource 2, waits for Resource 1
- Neither can continue → the system is permanently stuck

```
Process A: locks(R1) -> waits for R2
Process B: locks(R2) -> waits for R1
// Circular wait = deadlock
```

**Does this happen in JavaScript?** Traditional deadlock does **not** occur on JavaScript's main thread, because:

- JavaScript is single-threaded (one call stack)
- It doesn't use OS-level thread locks the way Java or C++ do

However, logically equivalent "stuck forever" situations can still happen:

```javascript
// A Promise that never resolves or rejects - the awaiting code hangs forever
function neverSettles() {
  return new Promise(() => {}); // no resolve/reject call
}

async function stuck() {
  console.log("Before");
  await neverSettles(); // execution pauses here forever
  console.log("This never runs");
}
```

Real deadlock risk returns once you introduce true parallelism and shared state:

- **Worker Threads (Node.js)** with blocking synchronization (`Atomics.wait`) can deadlock each other
- **SharedArrayBuffer + Atomics** misuse across threads
- Circular `await` dependencies between two async functions waiting on each other

---

## 21. Shadow DOM

### Q56: What is the Shadow DOM, and why is it needed?

**A:** The Shadow DOM is a web standard that encapsulates HTML, CSS, and JavaScript inside a separate, isolated DOM tree attached to an element - mainly used to build reusable, self-contained **Web Components**.

Without it, the regular DOM has some problems:

- CSS is global, so styles can leak in and out
- JavaScript can accidentally reach into and modify "internal" markup
- ID/class name collisions across components

Shadow DOM fixes this by:

- Encapsulating styles (CSS inside the shadow root doesn't leak out, and page CSS doesn't leak in)
- Preventing ID/class conflicts
- Protecting internal structure from outside `querySelector` calls
- Enabling truly reusable, drop-in components

### Q57: How do you create and use a Shadow DOM?

**A:**

```javascript
const host = document.querySelector("#my-element");

// Attach a shadow root
const shadowRoot = host.attachShadow({ mode: "open" });

// Content inside the shadow root is style-isolated
shadowRoot.innerHTML = `
  <style>
    p { color: red; }
  </style>
  <p>Hello from Shadow DOM</p>
`;
```

**Open vs. closed mode:**

```javascript
// Open - accessible from outside JS
host.attachShadow({ mode: "open" });
host.shadowRoot; // returns the ShadowRoot object

// Closed - hides internals from outside JS
host.attachShadow({ mode: "closed" });
host.shadowRoot; // null - inaccessible from outside the component
```

Most real-world Web Components use `"open"` - `"closed"` mode mainly helps against accidental external tampering, not real security, since a determined caller can still get a reference via other means.

---

## 22. Web APIs & Browser APIs

### Q58: What is the Fetch API?

**A:** The Fetch API provides a modern way to make HTTP requests and is built into browsers as a replacement for XMLHttpRequest.

```javascript
// Basic GET request
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// POST request with headers
fetch("https://api.example.com/data", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "John", age: 25 }),
})
  .then((response) => response.json())
  .then((data) => console.log(data));

// Request with timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch("https://api.example.com/data", { signal: controller.signal })
  .then((response) => response.json())
  .finally(() => clearTimeout(timeoutId));
```

### Q59: What is localStorage and sessionStorage?

**A:** Web Storage APIs allow storing data on the client-side.

**localStorage** - Persists until manually cleared:

```javascript
// Set item
localStorage.setItem("username", "John");

// Get item
const username = localStorage.getItem("username");

// Remove item
localStorage.removeItem("username");

// Clear all
localStorage.clear();

// Check key existence
if (localStorage.getItem("username")) {
  console.log("User found");
}

// Get all keys
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

**sessionStorage** - Clears when tab closes:

```javascript
sessionStorage.setItem("sessionId", "12345");
const sessionId = sessionStorage.getItem("sessionId");
```

**Differences:**
| Feature | localStorage | sessionStorage |
|---------|--------------|----------------|
| Persistence | Until cleared | Tab closes |
| Scope | All tabs | Single tab |
| Size | ~5-10MB | ~5-10MB |
| Use Case | User preferences | Temporary data |

### Q60: What are Service Workers?

**A:** Service Workers are background scripts that enable offline functionality, push notifications, and background sync.

```javascript
// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => console.log("SW registered", registration))
    .catch((error) => console.log("SW registration failed", error));
}

// Service Worker file (sw.js)
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll(["/", "/index.html", "/styles.css", "/script.js"]);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

### Q61: What are Web Workers?

**A:** Web Workers allow running JavaScript in background threads without blocking the main thread.

**Main thread:**

```javascript
// Create worker
const worker = new Worker("worker.js");

// Send data to worker
worker.postMessage({ num: 10 });

// Receive results
worker.onmessage = (event) => {
  console.log("Result:", event.data);
};
```

**Worker thread (worker.js):**

```javascript
// Receive message
self.onmessage = (event) => {
  const result = event.data.num * 2;

  // Send back result
  self.postMessage(result);
};

// Terminate worker
self.close();
```

### Q62: What is IndexedDB?

**A:** IndexedDB is a large-scale client-side storage system for structured data, supporting queries and indexes.

```javascript
// Open database
const request = indexedDB.open("MyDatabase", 1);

request.onerror = () => console.error("DB error");

request.onsuccess = (event) => {
  const db = event.target.result;

  // Create object store
  if (!db.objectStoreNames.contains("users")) {
    db.createObjectStore("users", { keyPath: "id" });
  }
};

// Add data
function addUser(db, user) {
  const transaction = db.transaction(["users"], "readwrite");
  const store = transaction.objectStore("users");
  store.add(user);
}

// Query data
function getUser(db, id) {
  const transaction = db.transaction(["users"], "readonly");
  const store = transaction.objectStore("users");
  const request = store.get(id);

  request.onsuccess = () => console.log(request.result);
}
```

---

## 23. Generators & Iterators

### Q63: What are Generators?

**A:** Generators are functions that can be paused and resumed, returning multiple values over time.

```javascript
function* countUp() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = countUp();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }

// Using for...of loop
for (const value of countUp()) {
  console.log(value);
}

// Generator with input
function* echo() {
  const input = yield "Enter value";
  yield input;
}

const gen2 = echo();
console.log(gen2.next()); // { value: 'Enter value', done: false }
console.log(gen2.next(10)); // { value: 10, done: false }
```

### Q64: What are Iterators?

**A:** Iterators are objects with a `next()` method that returns `{ value, done }`.

```javascript
// Custom iterator
const myIterator = {
  data: [1, 2, 3],
  index: 0,
  next() {
    if (this.index < this.data.length) {
      return { value: this.data[this.index++], done: false };
    }
    return { done: true };
  },
};

// Use iterator
console.log(myIterator.next()); // { value: 1, done: false }
console.log(myIterator.next()); // { value: 2, done: false }

// Make iterable (add Symbol.iterator)
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => {
        if (index < this.data.length) {
          return { value: this.data[index++], done: false };
        }
        return { done: true };
      },
    };
  },
};

for (const value of iterable) {
  console.log(value);
}
```

---

## 24. Proxy & Reflect

### Q65: What is a Proxy?

**A:** A Proxy intercepts and customizes operations performed on objects.

```javascript
const target = { name: "John", age: 25 };

const handler = {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    target[property] = value;
    return true;
  },
  has(target, property) {
    console.log(`Checking if ${property} exists`);
    return property in target;
  },
};

const proxy = new Proxy(target, handler);

proxy.name; // Logs: "Getting name"
proxy.age = 26; // Logs: "Setting age to 26"
"name" in proxy; // Logs: "Checking if name exists"

// Validation example
const validator = {
  set(target, property, value) {
    if (property === "age" && !Number.isInteger(value)) {
      throw new TypeError("Age must be an integer");
    }
    target[property] = value;
    return true;
  },
};

const user = new Proxy({}, validator);
user.age = 25; // OK
// user.age = "25"; // Throws error
```

### Q66: What is Reflect?

**A:** Reflect is a built-in object providing methods for interceptable operations.

```javascript
const obj = { name: "John", age: 25 };

// Get property
Reflect.get(obj, "name"); // 'John'

// Set property
Reflect.set(obj, "age", 26); // true

// Check property
Reflect.has(obj, "name"); // true

// Delete property
Reflect.deleteProperty(obj, "age"); // true

// Get keys
Reflect.ownKeys(obj); // ['name']

// Get descriptor
Reflect.getOwnPropertyDescriptor(obj, "name");

// Combined with Proxy
const handler = {
  get(target, property) {
    console.log(`Accessing ${property}`);
    return Reflect.get(target, property);
  },
  set(target, property, value) {
    console.log(`Setting ${property} to ${value}`);
    return Reflect.set(target, property, value);
  },
};

const proxy = new Proxy(obj, handler);
```

---

## 25. Module System (ES6 Modules)

### Q67: What are ES6 Modules?

**A:** ES6 modules allow importing and exporting code between files using `import` and `export`.

**Exporting:**

```javascript
// Named exports
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;

export function multiply(a, b) {
  return a * b;
}

// Default export
export default class Calculator {
  divide(a, b) {
    return a / b;
  }
}

// Export all from another module
export * from "./helpers.js";
```

**Importing:**

```javascript
// Named imports
import { add, subtract } from "./math.js";

// Default import
import Calculator from "./math.js";

// Mix default and named
import Calculator, { add, subtract } from "./math.js";

// Namespace import
import * as math from "./math.js";
math.add(2, 3);

// Dynamic import
const module = await import("./math.js");
```

### Q68: What's the difference between CommonJS and ES6 Modules?

**A:**

| Feature  | CommonJS                       | ES6 Modules         |
| -------- | ------------------------------ | ------------------- |
| Syntax   | `require()` / `module.exports` | `import` / `export` |
| Loading  | Synchronous                    | Asynchronous        |
| Scope    | Module scope                   | Module scope        |
| Use Case | Node.js (historically)         | Modern JavaScript   |

```javascript
// CommonJS
const math = require("./math.js");
module.exports = { add: (a, b) => a + b };

// ES6 Modules
import { add } from "./math.js";
export { add };
```

---

## 26. Advanced Error Handling

### Q69: What are Error types in JavaScript?

**A:** JavaScript has several built-in error types.

```javascript
// ReferenceError - undefined variable
try {
  console.log(undefinedVariable);
} catch (e) {
  console.log(e instanceof ReferenceError); // true
}

// TypeError - wrong type
try {
  const str = "hello";
  str.toUpperCase.call(); // TypeError
} catch (e) {
  console.log(e instanceof TypeError); // true
}

// SyntaxError - parsing error
// const x = "unterminated string;

// RangeError - invalid value range
try {
  new Array(-1);
} catch (e) {
  console.log(e instanceof RangeError); // true
}

// Custom Error
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

throw new ValidationError("Invalid input");
```

### Q70: How do you handle errors in Promises?

**A:**

```javascript
// Using .catch()
fetch("/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => {
    console.error("Fetch failed:", error);
  });

// Using try/catch with async/await
async function getData() {
  try {
    const response = await fetch("/api/data");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error; // re-throw if needed
  } finally {
    console.log("Request completed");
  }
}

// Multiple catch blocks
Promise.reject(new TypeError("Type error")).catch((error) => {
  if (error instanceof TypeError) {
    console.log("Handle type error");
  } else {
    throw error;
  }
});
```

---

## 27. Performance Optimization

### Q71: What is requestAnimationFrame?

**A:** `requestAnimationFrame` schedules function to run before browser repaint for smooth animations.

```javascript
// Without requestAnimationFrame (jittery)
function animateWithInterval() {
  let x = 0;
  setInterval(() => {
    x += 5;
    element.style.left = x + "px";
  }, 16); // May not sync with the display's actual refresh rate
}

// With requestAnimationFrame (smooth)
function animateWithRAF() {
  let x = 0;
  function step() {
    x += 5;
    element.style.left = x + "px";
    if (x < 500) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

// Cancel a scheduled frame
const id = requestAnimationFrame(() => {});
cancelAnimationFrame(id);
```

### Q72: What is event delegation, and why use it over per-element listeners?

**A:** Event delegation attaches a single listener to a parent element instead of one listener per child, relying on event bubbling to catch events from descendants.

```javascript
// Without delegation (inefficient)
document.querySelectorAll("li").forEach((item) => {
  item.addEventListener("click", () => {
    console.log("Item clicked");
  });
});

// With delegation (efficient)
document.querySelector("ul").addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log("Item clicked");
  }
});

// Benefits:
// - Handles dynamically added elements
// - Reduces memory usage
// - Cleaner code
```

### Q73: What is tree shaking?

**A:** Tree shaking removes unused code during bundling.

```javascript
// math.js
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;

// app.js
import { add } from "./math.js"; // Only add is imported
console.log(add(2, 3));

// After tree shaking:
// subtract and multiply code is removed from bundle
// Works with ES6 modules (static imports)
```

---

## 28. Type Checking & Validation

### Q74: What are the different ways to check types?

**A:**

```javascript
// typeof (for primitives)
typeof 42; // "number"
typeof "hello"; // "string"
typeof true; // "boolean"
typeof undefined; // "undefined"
typeof Symbol(); // "symbol"
typeof 123n; // "bigint"
typeof {}; // "object"

// instanceof (for objects)
[] instanceof Array; // true
({}) instanceof Object; // true - needs parens! `{}` at the start of a
// statement is parsed as an empty block, not an object literal - a classic gotcha
new Date() instanceof Date; // true

// Array.isArray()
Array.isArray([1, 2, 3]); // true
Array.isArray("not array"); // false

// Object.prototype.toString
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call(new Date()); // "[object Date]"

// Custom type checking
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
    && obj.constructor === Object;
}
```

### Q75: How do you validate form inputs?

**A:**

**HTML5 Validation attributes:**

```html
<input type="email" required />
<input type="number" min="0" max="100" />
<input type="text" pattern="[A-Z]{3}" />
```

**JavaScript validation:**

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[0-9]/.test(password);
}

// Constraint Validation API
const email = document.querySelector('input[type="email"]');
if (!email.checkValidity()) {
  console.log(email.validationMessage);
}

// Custom validation
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    console.log('Form invalid');
  }
});
```

---

## 29. Functional Programming Advanced

### Q76: What is function composition?

**A:** Function composition combines functions to create new functions.

```javascript
// Simple composition
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;
const subtract = (a, b) => a - b;

// Manual composition
const addThenMultiply = (a, b, c) => multiply(add(a, b), c);
addThenMultiply(2, 3, 4); // (2 + 3) * 4 = 20

// Compose utility
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((acc, fn) => fn(acc), x);

const double = (x) => x * 2;
const addOne = (x) => x + 1;
const square = (x) => x * x;

const composed = compose(square, double, addOne);
composed(3); // ((3 + 1) * 2)^2 = 64

// Pipe (left to right)
const pipe =
  (...fns) =>
  (x) =>
    fns.reduce((acc, fn) => fn(acc), x);

const piped = pipe(addOne, double, square);
piped(3); // ((3 + 1) * 2)^2 = 64
```

### Q77: What is partial application?

**A:** Partial application fixes some arguments and returns a function awaiting remaining arguments.

```javascript
// Partial application
function partial(fn, ...args) {
  return (...moreArgs) => fn(...args, ...moreArgs);
}

const add = (a, b, c) => a + b + c;
const addOne = partial(add, 1);
const addOneAndTwo = partial(addOne, 2);

console.log(addOneAndTwo(3)); // 6

// Practical example
const log = (prefix, message) => console.log(`${prefix}: ${message}`);
const logError = partial(log, "ERROR");
const logWarning = partial(log, "WARNING");

logError("File not found"); // ERROR: File not found
logWarning("Low memory"); // WARNING: Low memory
```

---

## 30. Regular Expressions

### Q78: What are Regular Expressions and common patterns?

**A:**

```javascript
// Creating regex - two equivalent syntaxes
const regex1 = /abc/gi; // literal syntax: /pattern/flags
const regex2 = new RegExp("abc", "gi"); // constructor syntax - useful when
// the pattern is built dynamically from a variable at runtime

// Common patterns
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phone = /^\d{3}-\d{3}-\d{4}$/;
const url = /^https?:\/\/.+$/;
const ipAddress = /^(\d{1,3}\.){3}\d{1,3}$/;

// Methods
const text = "Hello World";
/world/i.test(text); // true (case insensitive)
text.match(/\w+/g); // ["Hello", "World"]
text.replace(/Hello/, "Hi"); // "Hi World"
text.split(/\s/); // ["Hello", "World"]

// Flags
// g - global (all matches)
// i - insensitive
// m - multiline
// s - dotAll
// u - unicode
// y - sticky

// Examples
"aaa".match(/a/g); // ["a", "a", "a"]
"aaa".match(/a/); // ["a"] (no g flag)

// Groups and capturing
const date = "2024-12-25";
const [, year, month, day] = date.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(year, month, day); // 2024 12 25
```

---

## 31. Design Patterns

### Q79: What is the Module Pattern?

**A:** The Module Pattern creates private variables using closures.

```javascript
const module = (() => {
  // Private variables
  let privateVar = 0;

  // Private function
  function privateMethod() {
    console.log("Private method");
  }

  // Public API
  return {
    publicMethod() {
      privateVar++;
      console.log(privateVar);
    },
    getPrivateVar() {
      return privateVar;
    },
  };
})();

module.publicMethod(); // 1
module.publicMethod(); // 2
module.getPrivateVar(); // 2
// module.privateVar is undefined
```

### Q80: What is the Singleton Pattern?

**A:** Singleton ensures only one instance of a class exists.

```javascript
const Singleton = (() => {
  let instance;

  function createInstance() {
    return {
      name: "Singleton Instance",
    };
  }

  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const a = Singleton.getInstance();
const b = Singleton.getInstance();
console.log(a === b); // true
```

### Q81: What is the Factory Pattern?

**A:** Factory creates objects without exposing creation logic.

```javascript
function createUser(type) {
  if (type === "admin") {
    return {
      role: "admin",
      permissions: ["read", "write", "delete"],
    };
  } else if (type === "user") {
    return {
      role: "user",
      permissions: ["read"],
    };
  }
}

const admin = createUser("admin");
const user = createUser("user");
```

### Q82: What is the Observer Pattern?

**A:** Observer pattern notifies multiple subscribers of state changes.

```javascript
class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

const subject = new Subject();

const observer1 = (data) => console.log("Observer 1:", data);
const observer2 = (data) => console.log("Observer 2:", data);

subject.subscribe(observer1);
subject.subscribe(observer2);
subject.notify("Event fired"); // Both observers notified
```

---

## 32. Date & Time

### Q83: How do you work with Dates in JavaScript?

**A:**

```javascript
// Create date
const now = new Date();
const specific = new Date("2024-12-25");
const timestamp = new Date(1609459200000);

// Get components
now.getFullYear(); // 2024
now.getMonth(); // 0-11 (0 = January)
now.getDate(); // 1-31
now.getDay(); // 0-6 (0 = Sunday)
now.getHours(); // 0-23
now.getMinutes(); // 0-59
now.getSeconds(); // 0-59

// Set components
now.setFullYear(2025);
now.setMonth(0);
now.setDate(1);

// Formatting
now.toString();
now.toISOString();
now.toLocaleDateString();
now.toLocaleTimeString();

// Calculate difference
const date1 = new Date("2024-01-01");
const date2 = new Date("2024-12-31");
const diff = date2 - date1; // milliseconds
const days = diff / (1000 * 60 * 60 * 24);
```

---

## 33. JSON

### Q84: How do you work with JSON?

**A:**

```javascript
// Parse JSON string to object
const json = '{"name":"John","age":25}';
const obj = JSON.parse(json);
console.log(obj.name); // "John"

// Stringify object to JSON
const data = { name: "Jane", age: 30 };
const jsonString = JSON.stringify(data);
console.log(jsonString); // '{"name":"Jane","age":30}'

// With replacer (filter)
const filtered = JSON.stringify(data, ["name"]);
// Only includes name property

// With space (formatting)
const formatted = JSON.stringify(data, null, 2);
// Pretty print with 2 spaces

// Custom replacer function
const custom = JSON.stringify(data, (key, value) => {
  if (typeof value === "number") {
    return value * 2;
  }
  return value;
});

// Custom reviver
const revived = JSON.parse(jsonString, (key, value) => {
  if (key === "name") {
    return value.toUpperCase();
  }
  return value;
});
```

---

## 34. Symbol, Set, Map & WeakMap/WeakSet

### Q85: What is Symbol?

**A:** Symbol is a primitive type for creating unique identifiers.

```javascript
const sym1 = Symbol("description");
const sym2 = Symbol("description");

console.log(sym1 === sym2); // false (always unique)

// Well-known symbols
const obj = {
  [Symbol.iterator]() {
    // Make object iterable
  },
  [Symbol.toStringTag]: "CustomObject",
};

// Symbol as property key
const id = Symbol("id");
const user = {
  name: "John",
  [id]: 123,
};

console.log(user[id]); // 123
Object.keys(user); // ['name'] (symbol not enumerable by default)
```

### Q86: What are `Set` and `Map`, and how are they different from arrays/objects?

**A:** `Set` stores **unique values** of any type; `Map` stores **key-value pairs** where keys can be *any* type (unlike plain objects, whose keys are coerced to strings).

```javascript
// Set - unique values, insertion order preserved
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log(set); // Set(3) {1, 2, 3} - duplicates removed automatically
set.add(4);
set.has(2); // true
set.delete(1);
console.log(set.size); // 3

// Common use: dedupe an array
const unique = [...new Set([1, 1, 2, 2, 3])]; // [1, 2, 3]

// Map - any type of key, remembers insertion order
const map = new Map();
const objKey = { id: 1 };

map.set("stringKey", "value1");
map.set(objKey, "value2"); // object as a key - impossible with plain {} shorthand
map.set(42, "value3");

map.get(objKey); // "value2"
map.has("stringKey"); // true
map.size; // 3

// Both are iterable directly
for (const [key, value] of map) {
  console.log(key, value);
}
for (const value of set) {
  console.log(value);
}
```

**Map vs. plain Object - when to reach for `Map`:**

| | Object | Map |
| --- | --- | --- |
| Key types | Strings/Symbols only | Any value (objects, functions, etc.) |
| Key order | Not guaranteed pre-ES2015 semantics | Guaranteed insertion order |
| Size | `Object.keys(obj).length` | `.size` property |
| Iteration | Needs `Object.entries()` etc. | Directly iterable |
| Performance | Fine for small, string-keyed data | Better for frequent add/remove |

### Q87: What are WeakMap and WeakSet?

**A:** WeakMap/WeakSet hold weak references; values can be garbage collected.

```javascript
// WeakMap - keys must be objects
const weakMap = new WeakMap();
const obj = { id: 1 };

weakMap.set(obj, "value");
console.log(weakMap.get(obj)); // 'value'

// When obj is garbage collected, entry is removed
// No .keys(), .values(), .entries()
// Not iterable

// WeakSet - similar, holds unique objects
const weakSet = new WeakSet();
weakSet.add(obj);
console.log(weakSet.has(obj)); // true

// Use cases: caching, private data
const privatData = new WeakMap();
class MyClass {
  constructor() {
    privateData.set(this, { secret: "hidden" });
  }
}
```

---

## 35. Async Generators & for-await

### Q88: What are Async Generators?

**A:** Async generators combine generators and async/await for async iteration.

```javascript
// Async generator
async function* asyncGen() {
  yield 1;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  yield 2;
  yield 3;
}

// Use with for-await-of
(async () => {
  for await (const value of asyncGen()) {
    console.log(value); // 1, then 2, then 3
  }
})();

// Practical: fetch paginated API
async function* fetchPages(url) {
  let page = 1;
  while (true) {
    const response = await fetch(`${url}?page=${page}`);
    const data = await response.json();
    if (data.length === 0) break;
    yield data;
    page++;
  }
}

(async () => {
  for await (const page of fetchPages("/api/items")) {
    console.log(page);
  }
})();
```

---

## 36. URLSearchParams & URL Handling

### Q89: How do you work with URLs and query parameters?

**A:**

```javascript
// URLSearchParams
const params = new URLSearchParams();
params.append("name", "John");
params.append("age", "25");
params.set("city", "NYC");

console.log(params.toString()); // "name=John&age=25&city=NYC"

// Parse existing params
const url = "https://example.com?name=John&age=25";
const urlObj = new URL(url);
const searchParams = urlObj.searchParams;

searchParams.get("name"); // 'John'
searchParams.getAll("tag"); // array of values
searchParams.has("age"); // true

// Iterate
for (const [key, value] of searchParams) {
  console.log(key, value);
}

// URL object
const newUrl = new URL("https://example.com");
newUrl.pathname = "/api/users";
newUrl.searchParams.set("id", "123");
console.log(newUrl.href); // https://example.com/api/users?id=123

// Encode/Decode
encodeURIComponent("hello world"); // "hello%20world"
decodeURIComponent("hello%20world"); // "hello world"
```

---

## 37. V8 Engine & Performance

### Q90: What are hidden classes and inline caching?

**A:** V8 optimizations for object property access.

```javascript
// Hidden Classes
function Point(x, y) {
  this.x = x;
  this.y = y;
}

const p1 = new Point(1, 2);
const p2 = new Point(3, 4);
// Both have same hidden class

const p3 = new Point(5, 6);
p3.z = 7; // Creates new hidden class (slower)

// Inline Caching
function add(obj) {
  return obj.x + obj.y;
}

add(p1); // First call (slowest)
add(p1); // V8 caches the property access
add(p1); // Uses cache (fast)

// Performance tips:
// 1. Initialize all properties in constructor
// 2. Don't add properties dynamically
// 3. Keep object shapes consistent
```

---

## 38. Garbage Collection

### Q91: How does garbage collection work?

**A:** JavaScript automatically frees unused memory.

```javascript
// Mark and sweep algorithm
let globalVar = { data: "important" };

function example() {
  let local = { data: "temporary" };
  return local.data;
}

// After function returns, local is garbage collected

// Memory leak - cache grows forever, nothing ever clears it
function leakyModule() {
  const cache = [];
  return function addToCache(item) {
    cache.push(item); // Never removed = leak
  };
}

// Fix - expose a way to release the references
function fixedModule() {
  let cache = [];
  return {
    addToCache(item) {
      cache.push(item);
    },
    clearCache() {
      cache = []; // old array becomes eligible for garbage collection
    },
  };
}

// Event listener leak
element.addEventListener("click", handler);
// Fix: remove when done
element.removeEventListener("click", handler);

// Timer leak
const timerId = setInterval(() => {
  console.log("Running");
}, 1000);
// Fix: clear when done
clearInterval(timerId);
```

---

## 39. Template Literals & Tagged Templates

### Q92: What are tagged templates?

**A:** Tagged templates allow custom processing of template literals.

```javascript
// Basic tagged template
function highlight(strings, ...values) {
  let result = "";
  for (let i = 0; i < strings.length; i++) {
    result += strings[i];
    if (i < values.length) {
      result += `<mark>${values[i]}</mark>`;
    }
  }
  return result;
}

const name = "John";
const age = 25;
const html = highlight`Hello ${name}, you are ${age} years old`;
// Hello <mark>John</mark>, you are <mark>25</mark> years old

// SQL escaping
function sql(strings, ...values) {
  // Prevent SQL injection
  return strings.reduce((result, str, i) => {
    const value = values[i] ? sanitize(values[i]) : "";
    return result + str + value;
  });
}

// Internationalization
function i18n(strings, ...values) {
  const key = strings.join("{}");
  // Lookup translation
}
```

---

## 40. Nullish Coalescing & Optional Chaining

### Q93: What are ?? and ?. operators?

**A:** Modern operators for handling null/undefined values.

**Nullish Coalescing (??)**

```javascript
// Returns right side if left is null or undefined
const value = null ?? "default"; // 'default'
const value2 = 0 ?? "default"; // 0 (not false)
const value3 = "" ?? "default"; // '' (not false)

// Unlike || which considers falsy values
const value4 = 0 || "default"; // 'default' (treats 0 as false)

// Practical use
const config = {
  timeout: null,
};

const timeout = config.timeout ?? 5000; // 5000
```

**Optional Chaining (?.)**

```javascript
const user = {
  name: "John",
  address: {
    street: "123 Main St",
  },
};

// Safely access nested properties
user?.address?.street; // '123 Main St'
user?.phone?.number; // undefined (no error)

// Optional array access
const arr = [1, 2, 3];
arr?.[0]; // 1
arr?.[10]; // undefined

// Optional method call
user?.getEmail?.(); // undefined if method doesn't exist

// Combined
const timeout = config?.timeout ?? 5000;
```

---

## 41. Spread & Rest Operators (Advanced)

### Q94: Advanced spread and rest patterns?

**A:**

```javascript
// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

sum(1, 2, 3, 4); // 10

// Spread in function calls
const arr = [1, 2, 3];
Math.max(...arr); // 3

// Object spread
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3, ...obj1 }; // { c: 3, a: 1, b: 2 }

// Merge objects
const merged = { ...obj1, ...obj2, d: 4 };

// Array spread
const combined = [1, 2, ...arr, 4]; // [1, 2, 1, 2, 3, 4]

// Rest in destructuring
const [first, ...rest] = [1, 2, 3, 4];
const { name, ...others } = { name: "John", age: 25, city: "NYC" };
// others = { age: 25, city: 'NYC' }

// Clone array/object
const arrClone = [...arr];
const objClone = { ...obj1 };
```

---

## 42. for...in vs for...of

### Q95: What's the difference between for...in and for...of?

**A:**

```javascript
const arr = ["a", "b", "c"];
const obj = { x: 1, y: 2, z: 3 };

// for...in (iterates keys/indices)
for (const key in arr) {
  console.log(key); // 0, 1, 2 (as strings)
}

for (const key in obj) {
  console.log(key, obj[key]); // x 1, y 2, z 3
}

// for...of (iterates values, needs iterable)
for (const value of arr) {
  console.log(value); // 'a', 'b', 'c'
}

// Objects not iterable by default
// for (const value of obj) {} // Error

// Strings are iterable
for (const char of "hello") {
  console.log(char); // h, e, l, l, o
}

// Set and Map
const set = new Set([1, 2, 3]);
for (const value of set) {
  console.log(value);
}

// Summary:
// for...in: keys/indices (all objects)
// for...of: values (iterables only)
```




## Practice Tips for Interviews

1. **Understand, don't memorize** - Know the "why" behind concepts
2. **Write code** - Practice on LeetCode, HackerRank, or CodePen
3. **Explain your code** - Communication is key in interviews
4. **Test edge cases** - Think about null, empty, undefined values
5. **Know the fundamentals** - Master closures, scope, and `this`
6. **Practice debugging** - Be able to identify and fix bugs
7. **Build projects** - Real-world experience demonstrates competency
8. **Stay updated** - JavaScript evolves; keep learning

---

**Good luck with your JavaScript interviews! Practice consistently, and you'll ace it!**