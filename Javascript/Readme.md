# JavaScript Interview Prep - Q&A Format

> **Level:** Beginner to Advanced | **Updated:** December 18, 2025 | **Format:** Question & Answer

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
- Currying
- Debounce & Throttle
- Polyfills (Implements map, filter, reduce)
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
- BigInt: Large integers beyond Number.MAX_SAFE_INTEGER

**Non-Primitive Types:**
- Object: Collections of key-value pairs
- Array: Ordered collections
- Function: Reusable code blocks

### Q3: How do you detect primitive vs non-primitive data types?
**A:** Using the `typeof` operator:
```javascript
typeof 42              // "number"
typeof "hello"         // "string"
typeof true            // "boolean"
typeof undefined       // "undefined"
typeof null            // "object" (known quirk!)
typeof Symbol()        // "symbol"
typeof {}              // "object"
typeof []              // "object"

// For arrays specifically
Array.isArray([1,2,3]) // true
```

### Q4: What's the difference between `==` and `===`?
**A:** 
- `==` (loose equality) performs type coercion before comparison
- `===` (strict equality) compares without any type conversion

```javascript
5 == "5"     // true (string coerced to number)
5 === "5"    // false (different types)
null == undefined     // true
null === undefined    // false
0 == false           // true
0 === false          // false
```

### Q5: What is the difference between `null` and `undefined`?
**A:** 
- `null` is an intentional assignment value representing the absence of value
- `undefined` is a variable declared but not assigned a value

```javascript
let a = null;
console.log(a);     // null

let b;
console.log(b);     // undefined

typeof null          // "object" (bug in JS)
typeof undefined     // "undefined"
```

### Q6: What are the JavaScript operators?
**A:** JavaScript has several types of operators:

**Arithmetic:** `+`, `-`, `*`, `/`, `%`, `++`, `--`
```javascript
10 + 5   // 15
10 - 5   // 5
10 * 5   // 50
10 / 5   // 2
10 % 3   // 1
```

**Comparison:** `==`, `===`, `!=`, `!==`, `>`, `<`, `>=`, `<=`
```javascript
5 > 3     // true
5 == "5"  // true
5 === "5" // false
```

**Logical:** `&&`, `||`, `!`
```javascript
true && false  // false
true || false  // true
!true          // false
```

**Bitwise:** `&`, `|`, `^`, `~`, `<<`, `>>`, `>>>`

---

## 2. Functions & Scope

### Q7: What is the difference between `var`, `let`, and `const`?
**A:** In JavaScript, var, let, and const are used to declare variables, but they differ in scope, hoisting behavior, and mutability.
Modern JavaScript prefers let and const because they provide better scoping rules and safer code, while var is considered legacy.

| Feature | `var` | `let` | `const` |
|-------|------|------|--------|
| Scope | Function-scoped | Block-scoped | Block-scoped |
| Hoisting | Hoisted and initialized as `undefined` | Hoisted but in Temporal Dead Zone (TDZ) | Hoisted but in Temporal Dead Zone (TDZ) |
| Re-declaration | Allowed | Not allowed | Not allowed |
| Re-assignment | Allowed | Allowed | Not allowed |
| Initialization | Optional | Optional | Mandatory at declaration |
| Temporal Dead Zone | No | Yes | Yes |
| Global object binding | Added to `window` | Not added | Not added |
| Use case | Legacy code | Variables that change | Constants / fixed references |
| Modern usage | Not recommended | Recommended | Preferred by default |

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
    console.log(y); // ReferenceError
}

// const - immutable binding
const z = 30;
// z = 40; // Error - cannot reassign
const obj = { name: "John" };
obj.name = "Jane"; // OK - modifying property
```

### Q8: What is scope in JavaScript?
**A:** Scope refers to the context in which variables are declared and accessed. It defines the visibility and accessibility of variables.

**Types of Scope:**

**Global Scope:** Variables accessible anywhere
```javascript
var global = "I'm global";
function test() {
    console.log(global); // Accessible
}
```

**Function Scope:** Variables accessible only within the function
```javascript
function test() {
    var local = "I'm local";
    console.log(local); // Accessible
}
console.log(local); // ReferenceError
```

**Block Scope:** `let` and `const` are limited to blocks
```javascript
if (true) {
    let blockVar = 10;
    const blockConst = 20;
}
console.log(blockVar); // ReferenceError
console.log(blockConst); // ReferenceError
```

### Q9: What is lexical scope?
**A:** Lexical scope means the scope is determined by where code is written, not where it's called. Inner functions have access to variables from their parent functions.

```javascript
const global = "global";

function outer() {
    const outerVar = "outer";
    
    function inner() {
        const innerVar = "inner";
        console.log(innerVar);    // "inner"
        console.log(outerVar);    // "outer"
        console.log(global);      // "global"
    }
    inner();
}

outer();
// This demonstrates that inner() has access to 
// variables from its parent scopes
```

### Q10: What are arrow functions?
**A:** Arrow functions are a concise way to write functions introduced in ES6.

```javascript
// Traditional function
function add(a, b) {
    return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// Single parameter (parentheses optional)
const square = x => x * x;

// Multiple parameters
const multiply = (a, b) => a * b;

// Explicit return
const greet = name => {
    const message = `Hello, ${name}!`;
    return message;
};

// No parameters
const getRandom = () => Math.random();
```

### Q11: What's the key difference between arrow functions and regular functions?
**A:** Arrow functions and regular functions are two ways to define functions in JavaScript.
The key difference is that arrow functions do not have their own this, arguments, or prototype, whereas regular functions do.
Arrow functions are designed for short, concise functions and callbacks, while regular functions are more flexible and suitable for object methods and constructors.

**1. `this` binding:**
```javascript
const obj = {
    name: "John",
    regularMethod: function() {
        console.log(this.name); // "John" (refers to obj)
    },
    arrowMethod: () => {
        console.log(this.name); // undefined (inherits global this)
    }
};
obj.regularMethod(); // "John"
obj.arrowMethod();   // undefined
```

**2. Arguments object:**
```javascript
function regular(...args) {
    console.log(arguments); // Works - array-like object
}

const arrow = (...args) => {
    console.log(arguments); // ReferenceError
};
```

**3. Cannot be used as constructors:**
```javascript
const Person = (name) => {
    this.name = name;
};
new Person("John"); // TypeError
```

### Q12: What are default parameters?
**A:** Default parameters allow you to set default values for function parameters.

```javascript
function greet(name = "Guest", greeting = "Hello") {
    return `${greeting}, ${name}!`;
}

greet();                    // "Hello, Guest!"
greet("John");              // "Hello, John!"
greet("Jane", "Hi");        // "Hi, Jane!"

// With arrow functions
const multiply = (a, b = 1) => a * b;
multiply(5);     // 5 (5 * 1)
multiply(5, 3);  // 15 (5 * 3)
```

---

## 3. Closures

### Q13: What is a closure?
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

### Q14: What are practical use cases for closures?
**A:** Closures are used to maintain state, create private variables, build reusable function factories, and handle async callbacks without global variables.

**1. Data Privacy:**
```javascript
function createCounter() {
    let count = 0;  // Private variable
    
    return {
        increment() { return ++count; },
        decrement() { return --count; },
        getCount() { return count; }
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
    return function(number) {
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
        button.addEventListener('click', function() {
            console.log(`Button ${i} clicked`);
        });
    }
}
```

---

## 4. Hoisting

### Q15: What is hoisting?
**A:** Hoisting is JavaScript's default behavior of moving variable and function declarations to the top of their scope before code execution.

**Variable Hoisting:**
```javascript
console.log(a);  // undefined (not ReferenceError)
var a = 5;
console.log(a);  // 5

// Behind the scenes, JS interprets it as:
// var a;
// console.log(a);  // undefined
// a = 5;
// console.log(a);  // 5
```

**Function Hoisting:**
```javascript
sayHello(); // "Hello!" - works!

function sayHello() {
    console.log("Hello!");
}

// Function declarations are fully hoisted
```

**let/const Hoisting (Temporal Dead Zone):**
```javascript
console.log(b);  // ReferenceError - not hoisted
let b = 10;

// let and const are hoisted but not initialized
// They exist in a "Temporal Dead Zone" (TDZ)
```

### Q16: What is the Temporal Dead Zone (TDZ)?
**A:** The Temporal Dead Zone is the period between entering a scope and when a `let`/`const` variable is declared and initialized.

```javascript
function example() {
    console.log(x); // ReferenceError - TDZ active
    let x = 5;     // TDZ ends here
    console.log(x); // 5
}

// The variable exists but is uninitialized
// Accessing it throws ReferenceError
```

---

## 5. `this` Keyword

### Q17: What does `this` refer to?
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
        console.log(this.name); // "John" - this refers to obj
    }
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

### Q18: What are `call()`, `apply()`, and `bind()`?
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

### Q19: What is a Promise?
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
    .then(result => console.log(result)) // "Success!"
    .catch(error => console.error(error))
    .finally(() => console.log("Done"));
```

**Promise States:**
- Pending: Initial state
- Fulfilled: Operation completed successfully
- Rejected: Operation failed

### Q20: How do you use Promise methods?
**A:**

**Promise.all()** - Waits for all promises:
```javascript
Promise.all([promise1, promise2, promise3])
    .then(results => console.log(results))
    .catch(error => console.error("One failed:", error));
```

**Promise.race()** - Returns first settled promise:
```javascript
Promise.race([promise1, promise2])
    .then(result => console.log("First result:", result));
```

**Promise.allSettled()** - Waits for all, returns status:
```javascript
Promise.allSettled([promise1, promise2])
    .then(results => console.log(results));
```

### Q21: What is async/await?
**A:** Async/await is syntactic sugar over Promises that makes asynchronous code look synchronous code.

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
    } finally {
        console.log("Request completed");
    }
}

fetchData().then(data => console.log(data));
```

**Key Points:**
- `async` function always returns a Promise
- `await` pauses execution until Promise resolves
- Use `try/catch` for error handling

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

### Q24: What is the Event Loop?
**A:** The Event Loop is JavaScript's mechanism for executing asynchronous callbacks. It continuously checks the call stack and task queue.

**How it works:**
1. Execute synchronous code (call stack)
2. When function completes, remove from stack
3. Check task queue for callbacks
4. Move callback to call stack and execute
5. Repeat

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 0);

Promise.resolve()
    .then(() => console.log("Promise"));

console.log("End");

// Output:
// Start
// End
// Promise
// Timeout
```

### Q25: What's the difference between microtask and macrotask queues?
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

### Q26: What are important array methods?
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
// map() - transforms
[1, 2, 3].map(x => x * 2); // [2, 4, 6]

// filter() - filters
[1, 2, 3, 4].filter(x => x > 2); // [3, 4]

// reduce() - accumulates
[1, 2, 3, 4].reduce((sum, x) => sum + x, 0); // 10

// find() - first match
[1, 2, 3].find(x => x > 2); // 3

// includes() - contains
[1, 2, 3].includes(2); // true

// slice() - extracts
[1, 2, 3, 4].slice(1, 3); // [2, 3]
```

### Q27: How do you work with objects?
**A:**

```javascript
// Creating objects
const obj = { name: "John", age: 25 };

// Accessing properties
obj.name;        // "John"
obj["age"];      // 25

// Adding properties
obj.city = "NYC";

// Deleting properties
delete obj.age;

// Checking property existence
"name" in obj;   // true
obj.hasOwnProperty("name"); // true

// Object methods
Object.keys(obj);      // ["name", "city"]
Object.values(obj);    // ["John", "NYC"]
Object.entries(obj);   // [["name", "John"], ["city", "NYC"]]

// Spreading objects
const newObj = { ...obj, country: "USA" };
```

---

## 10. ES6+ Features

### Q28: What is destructuring?
**A:** Destructuring extracts values from arrays or objects into variables.

**Array Destructuring:**
```javascript
const [a, b, c] = [1, 2, 3];
console.log(a); // 1
console.log(b); // 2

const [first, ...rest] = [1, 2, 3, 4];
console.log(first); // 1
console.log(rest);  // [2, 3, 4]
```

**Object Destructuring:**
```javascript
const { name, age } = { name: "John", age: 25 };
console.log(name); // "John"

// Renaming
const { name: personName } = { name: "John" };
console.log(personName); // "John"

// Default values
const { country = "USA" } = {};
console.log(country); // "USA"
```

### Q29: What are spread and rest operators?
**A:** Both use `...` syntax but work differently.

**Spread Operator** - Expands array/object:
```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3 }; // { a: 1, b: 2, c: 3 }
```

**Rest Operator** - Collects into array:
```javascript
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b);
}
sum(1, 2, 3, 4); // 10
```

### Q30: What are template literals?
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
    return strings.map((str, i) => 
        str + (values[i] ? `<mark>${values[i]}</mark>` : '')
    ).join('');
}

highlight`Hello ${name}, you are ${age} years old`;
```

---

## 11. Higher Order Functions

### Q31: What is a Higher Order Function?
**A:** A Higher Order Function (HOF) is a function that takes functions as arguments and/or returns functions.

```javascript
// HOF taking a function as argument
function withLogging(fn) {
    return function(...args) {
        console.log("Calling", fn.name);
        return fn(...args);
    };
}

function add(a, b) {
    return a + b;
}

const addWithLogging = withLogging(add);
addWithLogging(2, 3); // Logs "Calling add", returns 5
```

**HOF returning a function:**
```javascript
function multiplier(factor) {
    return function(number) {
        return number * factor;
    };
}

const double = multiplier(2);
double(5); // 10
```

### Q32: What are practical examples of HOF?
**A:**

**Array methods (map, filter, reduce):**
```javascript
[1, 2, 3, 4]
    .filter(x => x > 2)
    .map(x => x * 2)
    .reduce((sum, x) => sum + x);
// 14
```

**Decorators/Middleware:**
```javascript
function authenticate(fn) {
    return function(user, ...args) {
        if (!user.isAuthenticated) {
            throw new Error("Not authenticated");
        }
        return fn(user, ...args);
    };
}
```

---

## 12. Prototypal Inheritance

### Q33: What are prototypes?
**A:** Every JavaScript object has a prototype from which it inherits properties and methods.

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    return `Hello, ${this.name}`;
};

const person = new Person("John");
console.log(person.greet()); // "Hello, John"

// Check prototype chain
console.log(person.__proto__ === Person.prototype); // true
```

### Q34: How does prototypal inheritance work?
**A:** Objects inherit from other objects through the prototype chain.

```javascript
// Parent
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    return `${this.name} makes a sound`;
};

// Child
function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up prototype chain
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    return `${this.name} barks`;
};

const dog = new Dog("Buddy", "Golden");
console.log(dog.speak()); // "Buddy makes a sound"
console.log(dog.bark());  // "Buddy barks"
```

### Q35: What's the difference between prototype and __proto__?
**A:**

- `prototype` - Property of constructor functions, used for inheritance
- `__proto__` - Reference to the object's actual prototype

```javascript
function Person(name) {
    this.name = name;
}

const person = new Person("John");

console.log(Person.prototype);      // The prototype object
console.log(person.__proto__);      // Reference to Person.prototype
console.log(person.__proto__ === Person.prototype); // true
```

---

## 13. Currying

### Q36: What is currying?
**A:** Currying is a technique of converting a function that takes multiple arguments into a sequence of functions that take one argument each.

```javascript
// Regular function
function add(a, b, c) {
    return a + b + c;
}

// Curried version
function curriedAdd(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        };
    };
}

curriedAdd(1)(2)(3); // 6

// ES6 arrow function version
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6
```

### Q37: Why use currying?
**A:** 

**Partial Application:**
```javascript
const add = a => b => a + b;
const add5 = add(5);
add5(3); // 8
add5(7); // 12
```

**Function Composition:**
```javascript
const multiply = a => b => a * b;
const double = multiply(2);
[1, 2, 3].map(double); // [2, 4, 6]
```

### Q38: How do you implement a curry function?
**A:**

```javascript
function curry(fn) {
    const arity = fn.length; // Number of parameters
    
    return function $curry(...args) {
        if (args.length < arity) {
            return (...nextArgs) => $curry(...args, ...nextArgs);
        }
        return fn(...args);
    };
}

// Usage
function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);
curriedAdd(1)(2)(3); // 6
curriedAdd(1, 2)(3); // 6
```

---

## 14. Debounce & Throttle

### Q39: What is debouncing?
**A:** Debouncing ensures a function is called only once after a series of events stop occurring.

```javascript
function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Usage
const search = debounce(() => {
    console.log("Searching...");
}, 500);

// Will only execute after 500ms of no calls
input.addEventListener('input', search);
```

### Q40: What is throttling?
**A:** Throttling ensures a function is called at most once every specified time interval.

```javascript
function throttle(fn, delay) {
    let lastCall = 0;
    return function(...args) {
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

window.addEventListener('scroll', handleScroll);
```

### Q41: Debounce vs Throttle - When to use?
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

## 15. Polyfills (Implement map, filter, reduce)

### Q42: How to implement Array.prototype.map?
**A:**

```javascript
Array.prototype.myMap = function(callback, thisArg) {
    const result = [];
    for (let i = 0; i < this.length; i++) {
        result.push(callback.call(thisArg, this[i], i, this));
    }
    return result;
};

// Usage
const numbers = [1, 2, 3];
const doubled = numbers.myMap(x => x * 2);
console.log(doubled); // [2, 4, 6]
```

### Q43: How to implement Array.prototype.filter?
**A:**

```javascript
Array.prototype.myFilter = function(callback, thisArg) {
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
const evens = numbers.myFilter(x => x % 2 === 0);
console.log(evens); // [2, 4]
```

### Q44: How to implement Array.prototype.reduce?
**A:**

```javascript
Array.prototype.myReduce = function(callback, initialValue) {
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

## 16. Common Interview Questions

### Q45: What is the `new` operator?
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

### Q46: How do event bubbling and capturing work?
**A:**

**Event Bubbling** - Events propagate from child to parent:
```javascript
document.getElementById("parent").addEventListener("click", () => {
    console.log("Parent clicked");
});

document.getElementById("child").addEventListener("click", () => {
    console.log("Child clicked");
});

// Clicking child logs: "Child clicked" then "Parent clicked"
```

**Event Capturing** - Events propagate from parent to child:
```javascript
document.getElementById("parent").addEventListener("click", 
    () => console.log("Parent"), 
    true // useCapture = true
);

document.getElementById("child").addEventListener("click", 
    () => console.log("Child"), 
    true
);

// Clicking child logs: "Parent clicked" then "Child clicked"
```

### Q47: What is event delegation?
**A:** Event delegation handles events at a higher level instead of attaching listeners to individual elements.

```javascript
// Without delegation - multiple listeners
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
    button.addEventListener("click", handleClick);
});

// With delegation - single listener
document.addEventListener("click", (event) => {
    if (event.target.matches("button")) {
        handleClick(event);
    }
});

// Advantages: Better performance, works with dynamic elements
```

### Q48: What is a REST API and how do you call it?
**A:**

```javascript
// GET request
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));

// POST request
fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: "John", age: 25 })
})
    .then(response => response.json())
    .then(data => console.log(data));

// Using async/await
async function getUsers() {
    const response = await fetch('https://api.example.com/users');
    const data = await response.json();
    return data;
}
```

### Q49: What is a memory leak?
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

### Q50: What is CORS?
**A:** Cross-Origin Resource Sharing (CORS) is a security feature that controls how resources are accessed from different origins.

```javascript
// CORS request with credentials
fetch('https://different-domain.com/api', {
    method: 'GET',
    credentials: 'include', // Include cookies
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.catch(error => console.error(error));

// Server-side CORS headers
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, PUT, DELETE
// Access-Control-Allow-Credentials: true
```

---

## 17. Shallow Copy vs Deep Copy

### Q51: What is the difference between shallow copy and deep copy in JavaScript?

**A:** In JavaScript, a **shallow copy** copies only the top-level properties of an object, while a **deep copy** copies the entire structure, including all nested objects and arrays. [file:32] With a shallow copy, nested objects/arrays are still shared between the original and the copy (same reference), whereas with a deep copy they are fully independent. [file:32]

---

### Q52: How do you create a shallow copy in JavaScript?

**A:** Common shallow copy techniques: [file:32]  

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
nested: { x: 10 }
};

// Shallow copy (spread)
const shallow = { ...original };

shallow.a = 2;
shallow.nested.x = 99;

console.log(original.a); // 1 (primitive is independent)
console.log(original.nested.x); // 99 (nested object is shared)
```

Here `a` is independent, but `nested` is shared between `original` and `shallow`, so changing `nested.x` via the copy also changes it in the original. [file:32]

---

### Q53: How do you create a deep copy in JavaScript?

**A:** Deep copies can be created with: [file:32]  

- `JSON.parse(JSON.stringify(obj))` for simple data (no functions, `undefined`, `Symbol`, `Date`, `Map`, `Set`, etc.).  
- `structuredClone(obj)` in modern environments, which supports many built-ins but not functions.  
- A custom recursive clone function for full control.  


```javascript
const original = {
a: 1,
nested: { x: 10 }
};

// Deep copy (simple approach)
const deep = JSON.parse(JSON.stringify(original));

deep.a = 2;
deep.nested.x = 99;

console.log(original.a); // 1 (independent)
console.log(original.nested.x); // 10 (still independent)
```
---

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

**Good luck with your JavaScript interviews! Practice consistently, and you'll ace it! 🚀**
