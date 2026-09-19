# JavaScript Interview Prep — Phase 3 – Objects, Prototypes & Object APIs

**Part 3 of 10** in the phase-wise JS interview prep series. Questions and phase numbers match `javascript_interview_questions_6yrs_phase_wise.md` exactly.

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
