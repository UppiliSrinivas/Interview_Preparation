# TypeScript Interview Prep — Master Reference (42 Questions)


## Contents

1. [Type System Fundamentals](#1-type-system-fundamentals) (Q1–Q7)
2. [Generics](#2-generics) (Q8–Q12)
3. [Advanced Types](#3-advanced-types) (Q13–Q20)
4. [Narrowing & Type Safety](#4-narrowing--type-safety) (Q21–Q24)
5. [Classes & OOP](#5-classes--oop) (Q25–Q28)
6. [Modules & Declarations](#6-modules--declarations) (Q29–Q32)
7. [TypeScript with React / React Native](#7-typescript-with-react--react-native) (Q33–Q37)
8. [Tooling, Config & Real-World](#8-tooling-config--real-world) (Q38–Q42)

---

## 1. Type System Fundamentals

### Q1. `interface` vs `type` — what's the difference?

Both can describe the shape of an object, but they behave differently in a few key ways:

- **Declaration merging** — two `interface` blocks with the same name automatically combine into one. Two `type` blocks with the same name throw an error.
- **Flexibility** — `type` can also represent unions, intersections, tuples, and primitive aliases. `interface` is meant for object and class shapes only.
- **Extending** — interfaces use `extends`. Type aliases combine using `&` (intersection).
- **Classes** — `interface` reads naturally with `implements` for class contracts.

```ts
// Declaration merging — works with interface
interface User {
  name: string;
}
interface User {
  age: number;
}
// User is automatically merged into: { name: string; age: number }
```

```ts
// Same attempt with type — fails
type Account = { name: string };
type Account = { age: number }; // ❌ Error: Duplicate identifier 'Account'
```

**When to use which:** `interface` for public API shapes, class contracts, and anything meant to be extended later. `type` for unions, intersections, and utility type compositions.

---

### Q2. What is structural typing?

TypeScript checks if two things *look* the same — not if they were *declared* with the same name. This is sometimes called "duck typing": if it has the right shape, TypeScript treats it as that type, even if it was never explicitly labeled as one.

```ts
interface Point {
  x: number;
  y: number;
}

class Coordinate {
  constructor(public x: number, public y: number) {}
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

printPoint(new Coordinate(1, 2));
// ✅ works — Coordinate has the same shape as Point, even though it's a different, unrelated type
```

---

### Q3. `unknown` vs `any` vs `never` — what's each one for?

- **`any`** turns off type checking completely. You can call any method or access any property, and TypeScript won't complain — even if it's wrong.
- **`unknown`** is the safe version of `any`. TypeScript keeps checking active, so you must narrow the type before you're allowed to use it.
- **`never`** represents a value that can't actually occur — like a function that always throws, or the impossible branch of an exhaustive check.

```ts
let valueAny: any = getData();
valueAny.toUpperCase(); // No error, even if this crashes at runtime

let valueUnknown: unknown = getData();
valueUnknown.toUpperCase(); // ❌ Error: must narrow first

if (typeof valueUnknown === "string") {
  valueUnknown.toUpperCase(); // ✅ safe now — narrowed to string
}

function throwError(message: string): never {
  throw new Error(message); // this function never returns normally
}
```

`unknown` is the better choice for things like API responses, where you don't know the shape yet.

---

### Q4. Why turn on `strictNullChecks`?

Without it, `null` and `undefined` are silently assignable to every type, so TypeScript won't warn you when a value might be missing. Turning it on forces you to actually handle that possibility, which catches a large share of real-world bugs.

```ts
function getLength(s: string) {
  return s.length;
}

let name: string = null;
// ❌ Error with strictNullChecks on
// ✅ allowed (and dangerous) with it off

function greet(name: string | null) {
  if (name !== null) {
    console.log(name.toUpperCase()); // ✅ safe, TypeScript narrowed out null here
  }
}
```

---

### Q5. What is type inference and contextual typing?

Type inference means TypeScript figures out a type on its own, without you writing an annotation. Contextual typing is a related idea — TypeScript infers a parameter's type based on where it's used, like inside `.map()`.

```ts
let age = 25; // inferred as number, no annotation needed

const numbers = [1, 2, 3];
numbers.map(n => n * 2); // 'n' is inferred as number, from the array's own type

function add(a: number, b: number) {
  return a + b; // return type inferred as number, no need to write it
}
```

---

### Q6. `readonly` vs `const` — what's the difference?

- **`const`** stops you from reassigning the *variable binding* — but the object it points to can still be mutated.
- **`readonly`** stops you from reassigning a *specific property* on an object or interface, even if the object itself is otherwise mutable.

```ts
const user = { name: "John" };
user = { name: "Jane" }; // ❌ Error — can't reassign the variable
user.name = "Jane";      // ✅ Allowed — const doesn't protect properties

interface UserInfo {
  readonly name: string;
}

const user2: UserInfo = { name: "John" };
user2.name = "Jane"; // ❌ Error — readonly protects this specific property
```

---

### Q7. What are optional chaining (`?.`) and nullish coalescing (`??`) used for?

**Optional chaining (`?.`)** safely reads a nested property that might not exist. If anything along the chain is `null` or `undefined`, it short-circuits to `undefined` instead of throwing.

**Nullish coalescing (`??`)** provides a fallback value, but only when the left side is exactly `null` or `undefined` — unlike `||`, which also replaces other falsy values like `0` or `""`.

```ts
const city = user?.address?.city; // undefined instead of a crash, if address is missing

const nickname = user.nickname ?? "Guest"; // fallback only for null/undefined

const count = 0;
count || 10;  // 10  — WRONG here, 0 is falsy but is a perfectly valid value
count ?? 10;  // 0   — CORRECT, 0 is not null/undefined, so it's kept as-is
```

---

## 2. Generics

### Q8. Why use generics instead of `any`?

Generics keep a link between what goes into a function (or class) and what comes out, so TypeScript can still check things properly. `any` breaks that link entirely — you lose all safety, and TypeScript stops helping you.

```ts
function identity<T>(value: T): T {
  return value;
}

identity(5);       // T inferred as number, return type is number
identity("hello"); // T inferred as string, return type is string
```

**Real-world example — fetching different entity types with one function:**

```ts
interface AdminInfo {
  id: string;
  permissions: string[];
}

interface ViewerInfo {
  id: string;
  subscriptionTier: string;
}

async function fetchEntity<T>(id: string): Promise<T> {
  const res = await fetch(`/api/entities/${id}`);
  return res.json() as T;
}

const admin = await fetchEntity<AdminInfo>("123");
console.log(admin.permissions); // ✅ works

const viewer = await fetchEntity<ViewerInfo>("456");
console.log(viewer.subscriptionTier); // ✅ works
console.log(viewer.permissions); // ❌ Error: ViewerInfo has no 'permissions' field
```

One `fetchEntity` function, but every call site keeps its own exact, correct type.

---

### Q9. What are generic constraints?

A constraint (`<T extends U>`) limits a generic so it can only be a type that includes at least certain properties.

```ts
interface HasId {
  id: string;
}

function logEntityId<T extends HasId>(entity: T): void {
  console.log(entity.id); // ✅ safe — TypeScript knows every T has at least an id
}

logEntityId({ id: "1", name: "Sri" }); // ✅ works — extra fields are fine
logEntityId({ name: "Sri" });          // ❌ Error — missing required 'id'
```

---

### Q10. `T[]` vs `Array<T>` — any real difference?

No functional difference — they mean exactly the same thing. `Array<T>` tends to read more clearly once the type inside gets more complex.

```ts
let a: string[] = ["a", "b"];
let b: Array<string> = ["a", "b"]; // identical to the line above

let list: Array<string | null> = ["a", null]; // easier to read than (string | null)[]
```

---

### Q11. What are default generic parameters?

A generic can have a fallback type, so callers don't have to specify it every single time.

```ts
interface Box<T = string> {
  value: T;
}

const b1: Box = { value: "hello" };    // T defaults to string
const b2: Box<number> = { value: 42 }; // T explicitly set to number
```

---

### Q12. Generic classes vs generic functions — what's the difference?

A generic class locks in one specific type per instance, decided when you create it. A generic function can pick a fresh type on every single call, independent of any other call.

```ts
class Container<T> {
  constructor(private item: T) {}
  getItem(): T {
    return this.item;
  }
}

const stringBox = new Container<string>("hello"); // T is locked to string for this instance

function wrap<T>(item: T): { value: T } {
  return { value: item };
}

wrap("a"); // T = string for this call
wrap(5);   // T = number for this call — same function, different type each time
```

---

## 3. Advanced Types

### Q13. What is a mapped type?

A mapped type builds a new type by applying the same rule to every property of an existing type, instead of writing that transformation out by hand for each field.

```ts
interface UserInfo {
  id: string;
  name: string;
}

type ReadonlyUser = {
  readonly [K in keyof UserInfo]: UserInfo[K];
};
// Equivalent to: { readonly id: string; readonly name: string }
```

This is exactly how built-in utility types like `Readonly<T>`, `Partial<T>`, and `Pick<T>` are implemented internally — they're just mapped types someone already wrote for you.

---

### Q14. What are conditional types and `infer`?

A conditional type picks between two types based on a check — like an if/else, but for types instead of values. `infer` lets you "pull out" a type from inside another type while doing that check.

```ts
type Unwrap<T> = T extends Promise<infer U> ? U : T;

type A = Unwrap<Promise<string>>; // string
type B = Unwrap<number>;          // number — not a Promise, so it passes through unchanged
```

---

### Q15. What do the common built-in utility types do?

```ts
interface UserInfo {
  id: string;
  name: string;
}

type PartialUser  = Partial<UserInfo>;      // { id?: string; name?: string }
type RequiredUser = Required<PartialUser>;  // back to { id: string; name: string }
type NameOnly     = Pick<UserInfo, "name">; // { name: string }
type NewUser      = Omit<UserInfo, "id">;   // { name: string }
type UserMap      = Record<string, UserInfo>; // { [key: string]: UserInfo }
type LockedUser   = Readonly<UserInfo>;     // every field becomes readonly
```

- `Partial` — makes every field optional (handy for update functions).
- `Required` — makes every field mandatory.
- `Pick` — keeps only the fields you name.
- `Omit` — keeps everything except the fields you name.
- `Record` — builds an object type from a key type and a value type.
- `Readonly` — makes every field read-only.

---

### Q16. `Pick` vs `Omit` — how are they related internally?

`Pick` says "keep only these keys." `Omit` says "keep everything except these keys." Under the hood, `Omit` is actually built by combining `Pick` with `Exclude`:

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

`Exclude<keyof T, K>` first works out "every key except K," and then `Pick` grabs just those.

---

### Q17. How would you write your own `DeepPartial<T>`?

Regular `Partial<T>` only makes the top-level fields optional. `DeepPartial<T>` needs to recurse into nested objects too.

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

interface Settings {
  theme: { color: string; darkMode: boolean };
  notifications: boolean;
}

const update: DeepPartial<Settings> = {
  theme: { color: "blue" }, // darkMode is not required, even though it's nested
};
```

---

### Q18. What are template literal types?

They let you build new string types out of existing ones — useful for generating consistent naming patterns, like event handler names.

```ts
type EventName<T extends string> = `on${Capitalize<T>}`;

type ClickEvent = EventName<"click">; // "onClick"
type HoverEvent = EventName<"hover">; // "onHover"
```

---

### Q19. Union vs intersection types — what's the difference?

`|` (union) means "one of these." `&` (intersection) means "all of these, combined into one." Intersecting two conflicting primitive types collapses to `never`, since nothing can satisfy both at once.

```ts
type Status = "loading" | "success" | "error"; // union — must be exactly one of these

type Timestamped = { createdAt: Date };
type Named = { name: string };
type NamedRecord = Timestamped & Named; // intersection — has both fields at once

type Impossible = string & number; // never — nothing can be both a string and a number
```

---

### Q20. What is a discriminated union, and why is it useful?

It's a group of types that all share one common field with different fixed values (the "discriminant" — here, `kind`). Once you check that field, TypeScript automatically narrows the whole object to the matching type, and can warn you if a case is left unhandled.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; side: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2; // TS knows this is the circle variant here
    case "square":
      return shape.side ** 2; // TS knows this is the square variant here
  }
}
```

---

## 4. Narrowing & Type Safety

### Q21. What is "narrowing"?

Narrowing is checking a value's type at runtime (with `typeof`, `instanceof`, `in`, or a plain `if`) so TypeScript can treat it as a more specific type for the rest of that code block.

```ts
function printValue(value: string | number) {
  if (typeof value === "string") {
    console.log(value.toUpperCase()); // narrowed to string here
  } else {
    console.log(value.toFixed(2)); // narrowed to number here
  }
}
```

---

### Q22. What is a custom type guard?

A function that tells TypeScript, "if this returns true, treat the value as this specific type from here on." It uses the special `is` return type.

```ts
interface Cat {
  meow: () => void;
}
interface Dog {
  bark: () => void;
}

function isCat(animal: Cat | Dog): animal is Cat {
  return (animal as Cat).meow !== undefined;
}

function speak(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow(); // ✅ TypeScript knows it's a Cat here
  } else {
    animal.bark(); // ✅ TypeScript knows it's a Dog here
  }
}
```

---

### Q23. What does a type assertion (`as`) actually do?

It does nothing at runtime — it only tells the compiler "trust me, this is this type." Use it when you know more about a value than TypeScript can figure out on its own, but be careful: if you're wrong, TypeScript won't catch it, and you'll only find out when it breaks at runtime.

```ts
const input = document.getElementById("my-input") as HTMLInputElement;
input.value; // works — without the assertion, TS only knows it's HTMLElement | null

let value: unknown = 42;
const num = value as number;
```

Using `as` too often in a codebase is usually a sign the types further upstream should be fixed instead.

---

### Q24. What does the `satisfies` operator do?

It checks that a value matches a type — but unlike a normal type annotation, it doesn't widen the value's inferred type afterward. You get the safety check *and* keep the exact, specific type.

```ts
type Colors = "red" | "green" | "blue";

const palette = {
  primary: "red",
  secondary: "blue",
} satisfies Record<string, Colors>;

palette.primary; // type is "red" (the exact literal) — not widened to just Colors
```

If you'd used `: Record<string, Colors>` as a normal annotation instead, `palette.primary` would just be typed as `Colors`, losing the more precise `"red"` type.

---

## 5. Classes & OOP

### Q25. TypeScript's `private` vs JavaScript's `#private` — what's the real difference?

TypeScript's `private` keyword only blocks access while you're writing code — it's erased once compiled to JavaScript, so it offers no protection at runtime. JavaScript's `#private` fields are enforced by the language itself, even after compilation.

```ts
class Wallet {
  private balance: number = 0; // TypeScript-only — erased at compile time
  #pin: string = "1234";       // real runtime privacy, enforced by JavaScript

}

const w = new Wallet();
console.log((w as any).balance); // ⚠️ accessible once compiled — 'private' gave no real protection
console.log((w as any)["#pin"]); // ❌ still blocked — real JS private field
```

---

### Q26. Abstract class vs interface — when do you pick one over the other?

An interface is a pure contract — it holds no actual code. An abstract class can hold real, shared implementation and state alongside its contract. Pick an abstract class when subclasses need to share behavior, not just a shape.

```ts
abstract class Shape {
  abstract area(): number; // every subclass must implement this

  describe(): string {     // shared logic, inherited by every subclass for free
    return `This shape has an area of ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

---

### Q27. What is the constructor parameter property shorthand?

Adding an access modifier directly to a constructor parameter both declares the class field and assigns it, in a single line.

```ts
class User {
  constructor(private name: string, public age: number) {}
}
// Equivalent to declaring 'name' and 'age' as class fields, AND assigning
// them inside the constructor body — just written in one shorter line.
```

---

### Q28. What is method overloading in TypeScript?

It lets one function have multiple possible input/output signatures, useful when the return type should change depending on what was passed in.

```ts
function getValue(key: "count"): number;
function getValue(key: "name"): string;
function getValue(key: string): number | string {
  return key === "count" ? 42 : "hello";
}

const a = getValue("count"); // type: number
const b = getValue("name");  // type: string
```

---

## 6. Modules & Declarations

### Q29. What does `import type` do, and why use it?

It imports something purely for type-checking — it's completely removed from the final compiled JavaScript. This keeps the bundle smaller and avoids import cycles caused only by types.

```ts
import type { User } from "./types"; // fully erased from the compiled JS output

function greet(user: User) {
  console.log(user.name);
}
```

---

### Q30. What is a `.d.ts` file, and when would you write one?

A file that contains only type information, no real executable code. You write one when you're using a plain JavaScript library with no built-in types, or when you want to publish types for your own package.

```ts
// types/legacy-lib.d.ts
declare module "legacy-lib" {
  export function doSomething(input: string): number;
}
```

---

### Q31. What is "declaration merging"?

If you declare two `interface` blocks with the same name, TypeScript automatically combines them into one. This is commonly used to add extra properties to a type you don't own, like the global `Window` object.

```ts
interface Window {
  myCustomProperty: string;
}
// window.myCustomProperty is now type-checked everywhere in the project,
// merged automatically with the built-in Window interface.
```

---

### Q32. Namespaces vs ES modules — which should you use today?

Namespaces are an older, TypeScript-only way of organizing code. ES modules (`import`/`export`) are the modern standard, and they work far better with today's bundlers and tooling.

```ts
// Old style — avoid in new code
namespace MathUtils {
  export function add(a: number, b: number) {
    return a + b;
  }
}

// Modern style — preferred
export function add(a: number, b: number) {
  return a + b;
}
```

---

## 7. TypeScript with React / React Native

### Q33. What's the best way to type a function component's props?

Type the props object directly, rather than reaching for `React.FC`. `React.FC` has known issues — for example, it silently assumes `children` exists on every component, even when it shouldn't.

```tsx
interface CardProps {
  title: string;
  onPress: () => void;
}

function Card({ title, onPress }: CardProps) {
  return null;
}
```

---

### Q34. How do you type common hooks?

```ts
const [user, setUser] = useState<User | null>(null);
const inputRef = useRef<HTMLInputElement>(null);
```

`useRef` for DOM elements needs `| null` in its type, because the ref starts out empty and only gets set once the element actually mounts.

---

### Q35. What's the gotcha when typing a custom hook that returns a tuple?

By default, TypeScript treats a returned array as a general list, so callers lose the guaranteed order when destructuring. You fix this with an explicit tuple return type (or `as const`).

```ts
function useToggle(): [boolean, () => void] {
  const [on, setOn] = useState(false);
  const toggle = () => setOn(o => !o);
  return [on, toggle]; // explicit tuple type keeps destructuring order safe
}

const [isOn, toggleOn] = useToggle(); // isOn: boolean, toggleOn: () => void
```

---

### Q36. How do you type a component that takes generic props?

```tsx
function List<T>({ items, render }: { items: T[]; render: (item: T) => React.ReactNode }) {
  return <>{items.map(render)}</>;
}

<List items={[1, 2, 3]} render={(n) => <span>{n}</span>} />; // T inferred as number
```

---

### Q37. How do you type event handlers, like an input's `onChange`?

```tsx
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value); // 'target' is correctly typed as HTMLInputElement
}
```

The generic part (`HTMLInputElement`) matters — it decides exactly what properties `e.target` has available.

---

## 8. Tooling, Config & Real-World

### Q38. What does `strict: true` actually turn on?

It's a bundle of several checks turned on at once, including:

- `strictNullChecks` — catches missing/null values
- `noImplicitAny` — stops silent, unintentional `any` types
- `strictFunctionTypes` — checks function parameter types more carefully
- `strictPropertyInitialization` — makes sure class properties are actually assigned

Be ready to explain what each one individually catches — interviewers often ask you to justify turning `strict` on for a legacy project.

---

### Q39. Give a real-world example of module augmentation.

A common one: adding a custom `user` property to Express's `Request` type, after your authentication middleware sets it.

```ts
declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string };
  }
}

// now, anywhere in the app:
app.get("/profile", (req, res) => {
  console.log(req.user?.id); // ✅ typed, no 'as any' needed
});
```

---

### Q40. Enums vs string literal unions — which is usually better?

```ts
enum UserRole {
  Admin,
  Editor,
  Viewer,
}
UserRole.Admin; // generates real, runtime JavaScript code

type UserRoleLite = "admin" | "editor" | "viewer"; // compile-time only, no runtime footprint
```

Most modern codebases prefer **string literal unions** over enums — they add zero extra JavaScript to your final bundle and work just as well for type safety. `const enum` is a middle-ground option, but it has some limitations with certain build tools (like `isolatedModules`).

---

### Q41. What can slow down TypeScript's compiler in large projects?

Deeply nested conditional types, very large union types, and generic utility types applied everywhere can all make `tsc` noticeably slower to build, especially as a codebase grows. Being aware of this matters more once you're working in a large, real-world monorepo.

---

### Q42. How do you migrate a large JavaScript codebase to TypeScript safely?

1. Turn on `allowJs` and `checkJs` first, without enabling full strict mode yet — this lets JS and TS files coexist.
2. Convert small, independent, "leaf" files first — not the core logic everything else depends on.
3. Turn on `strict` mode last, ideally file by file, once most of the codebase is already converted.

---

*Tip: Read through this once, then try explaining each answer out loud in your own words, with the code example, from memory. That's the real test of whether you know it or just recognize it.*
