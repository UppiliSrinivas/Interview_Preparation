# Testing Interview Questions: Jest, Vitest & React Testing Library

Basics to senior. Covers what each tool is for, how they fit together, and the questions service and product companies actually ask, each with the answer an interviewer is listening for.

**Versions to know (as of late 2026)**
- **Jest 30.x:** the long-standing standard test runner. 30.3 added `defineConfig` / `mergeConfig` for type-safe config.
- **Vitest 4.x:** the Vite-native runner with a Jest-compatible API. 4.1 added test tags and an experimental native Node execution mode.
- **React Testing Library 16.x:** requires `@testing-library/dom` as an explicit peer dependency and supports React 18+.
- **React Native Testing Library 14:** requires React 19 and makes `render` async.

**Where to focus**
- **Service companies:** Jest + RTL basics, mocking, async tests, coverage, "how do you test this component?"
- **Product companies:** test strategy, what *not* to test, mocking boundaries (MSW), testing hooks/context/data fetching, flaky tests, CI, and writing tests live in machine-coding rounds.

---

## Table of Contents

0. [The Big Picture: What Each Tool Does](#part-0-the-big-picture)
1. [Testing Fundamentals (Q1–8)](#part-1-testing-fundamentals)
2. [Jest (Q9–30)](#part-2-jest)
3. [Vitest (Q31–42)](#part-3-vitest)
4. [React Testing Library (Q43–64)](#part-4-react-testing-library)
5. [Testing Real-World React Code (Q65–74)](#part-5-testing-real-world-react-code)
6. [Senior: Strategy, Quality & CI (Q75–84)](#part-6-senior-strategy-quality--ci)
7. [Bonus: React Native Testing (Q85–88)](#part-7-bonus-react-native-testing)
8. [Live-Coding Scenarios (Q89–94)](#part-8-live-coding-scenarios)

---

## Part 0: The Big Picture

| Tool | What it is | Its job |
|---|---|---|
| **Jest** | Test runner + assertion library + mocking | Finds test files, runs them, provides `describe` / `test` / `expect`, mocks, fake timers, coverage, snapshots |
| **Vitest** | Test runner (Vite-powered), Jest-compatible API | Same job as Jest, but reuses your Vite config, is ESM/TypeScript-native, and is typically faster |
| **React Testing Library (RTL)** | DOM testing utilities for React | Renders components and lets you query and interact with them *like a user*. It is **not** a runner |
| **@testing-library/user-event** | User interaction simulator | Realistic typing, clicking, tabbing (fires the full event sequence) |
| **@testing-library/jest-dom** | Extra matchers | `toBeInTheDocument`, `toBeDisabled`, `toHaveValue`, etc. Works with Jest and Vitest |
| **MSW (Mock Service Worker)** | Network mocking | Intercepts real `fetch` / XHR calls so components run their real data-fetching code |

**How they fit together:**
```
Jest  or  Vitest        → runs tests, expect(), mocks, timers, coverage
   + jsdom/happy-dom    → fake browser DOM in Node
   + RTL                → render(<Component />), screen.getByRole(...)
   + user-event         → user.click(), user.type()
   + jest-dom           → expect(el).toBeInTheDocument()
   + MSW                → fake API responses
```

**One-line interview answer:** "Jest or Vitest is the runner and gives me assertions and mocking. RTL renders components and lets me query them the way a user would. I pick one runner, and RTL works with either."

---

## Part 1: Testing Fundamentals

### 1. Why write tests at all?
- **Confidence to change code:** refactor and upgrade without fear.
- **Catch regressions** before users do.
- **Living documentation** of how code is supposed to behave.
- **Faster feedback** than manual QA.

### 2. What are the main types of tests?
| Type | Scope | Example tools | Speed |
|---|---|---|---|
| **Static** | Types, lint | TypeScript, ESLint | Instant |
| **Unit** | One function or component in isolation | Jest/Vitest (+ RTL) | Very fast |
| **Integration** | Several units working together (component + hooks + context + mocked API) | Jest/Vitest + RTL + MSW | Fast |
| **End-to-end (E2E)** | Whole app in a real browser | Playwright, Cypress (web); Detox, Maestro (mobile) | Slow |

### 3. Testing pyramid vs testing trophy?
- **Pyramid:** many unit tests, fewer integration, very few E2E.
- **Trophy (Kent C. Dodds):** static analysis at the base, then *integration tests as the biggest layer*, some unit, a few E2E.

**Good answer:** "For React UIs I follow the trophy: most value comes from integration tests that render a feature with its real children and a mocked network, because that's closest to how users experience it while staying fast."

### 4. What is the Arrange–Act–Assert (AAA) pattern?
```js
test('adds item to cart', () => {
  // Arrange
  const cart = createCart();
  // Act
  cart.add({ id: 1, price: 100 });
  // Assert
  expect(cart.total()).toBe(100);
});
```
One behavior per test, clearly separated phases.

### 5. Mock vs stub vs spy vs fake?
- **Stub:** returns canned data (`mockReturnValue(42)`).
- **Spy:** wraps a real function and records calls (`jest.spyOn(obj, 'method')`).
- **Mock:** a replacement you also make assertions about (`expect(fn).toHaveBeenCalledWith(...)`).
- **Fake:** a working lightweight implementation (an in-memory database, MSW handlers).

In Jest and Vitest, `jest.fn()` / `vi.fn()` can act as stub, spy, or mock.

### 6. What should you test, and what shouldn't you?
**Test:** behavior users or callers rely on: rendered output, interactions, edge cases, error states, business logic.

**Don't test:** implementation details (internal state, private functions, which hook was called), third-party library internals, or trivial code (plain getters, constants).

### 7. What is code coverage, and is 100% the goal?
Coverage measures which **statements, branches, functions, and lines** ran during tests. It shows what is *untested*, not what is *well tested*. 100% coverage can still miss bugs if assertions are weak.

**Good answer:** "I use coverage to find gaps and set a sensible threshold in CI (e.g. 80% on critical modules), but I focus on meaningful assertions over the percentage."

### 8. What is TDD?
Test-Driven Development: **Red** (write a failing test) → **Green** (write minimal code to pass) → **Refactor**. It's great for pure logic, utilities, and bug fixes (write a test that reproduces the bug first). Know it and be honest about when you use it.

---

## Part 2: Jest

### Basics

### 9. How does Jest find and run tests?
By default it finds files matching `*.test.js`, `*.spec.js`, or files inside `__tests__/`. Run with `npx jest`, `npx jest --watch`, or `npx jest path/to/file`.

### 10. `describe`, `test`, and `it`?
- `describe` groups related tests.
- `test` and `it` are aliases that define a single test.
```js
describe('formatPrice', () => {
  it('formats rupees with two decimals', () => {
    expect(formatPrice(1234.5)).toBe('₹1,234.50');
  });
});
```

### 11. `toBe` vs `toEqual` vs `toStrictEqual`?
- **`toBe`:** `Object.is` equality. Use for primitives and same-reference checks.
- **`toEqual`:** recursive value equality. Ignores `undefined` properties.
- **`toStrictEqual`:** like `toEqual`, but also checks `undefined` properties, array sparseness, and class types.
```js
expect({ a: 1, b: undefined }).toEqual({ a: 1 });        // passes
expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 });  // fails
expect(0.1 + 0.2).toBeCloseTo(0.3);                      // floats
```

### 12. Which other matchers do you use often?
- Truthiness: `toBeTruthy`, `toBeFalsy`, `toBeNull`, `toBeUndefined`, `toBeDefined`
- Numbers: `toBeGreaterThan`, `toBeLessThanOrEqual`, `toBeCloseTo`
- Strings: `toMatch(/regex/)`, `toContain`
- Arrays/objects: `toContain`, `toHaveLength`, `toHaveProperty`, `toMatchObject` (partial match)
- Negation: `.not.toBe(...)`
- Asymmetric: `expect.any(Number)`, `expect.objectContaining({...})`, `expect.arrayContaining([...])`, `expect.stringContaining('x')`

### 13. How do you test that a function throws?
Wrap the call in a function, otherwise the error throws before `expect` can catch it.
```js
expect(() => divide(1, 0)).toThrow('Cannot divide by zero');
expect(() => divide(1, 0)).toThrow(RangeError);
```

### 14. What are setup and teardown hooks?
`beforeAll`, `beforeEach`, `afterEach`, `afterAll`. Scoped to their `describe` block.
```js
let db;
beforeAll(async () => { db = await connect(); });
afterEach(async () => { await db.clear(); });
afterAll(async () => { await db.close(); });
```
**Rule:** keep tests independent; reset shared state in `beforeEach` / `afterEach`.

### 15. `test.only`, `test.skip`, and `test.todo`?
- `.only` runs just that test (never commit it).
- `.skip` skips a test.
- `.todo('name')` marks a planned test.

### Intermediate

### 16. How do you test asynchronous code?
Use `async/await` (preferred), return a promise, or `.resolves` / `.rejects`:
```js
test('fetches user', async () => {
  const user = await getUser(1);
  expect(user.name).toBe('Asha');
});

test('rejects for missing user', async () => {
  await expect(getUser(999)).rejects.toThrow('Not found');
});
```
**Pitfall:** forgetting `await` (or `return`) makes the test pass before the assertion runs. `expect.assertions(n)` guards against that in callback-style code.

### 17. What is `jest.fn()`, and how do you control it?
A mock function that records calls and lets you control return values.
```js
const onSave = jest.fn();
onSave.mockReturnValue(true);              // sync value
onSave.mockResolvedValue({ id: 1 });       // async success
onSave.mockRejectedValue(new Error('x'));  // async failure
onSave.mockImplementation((a, b) => a + b);
onSave.mockReturnValueOnce(1).mockReturnValueOnce(2);

expect(onSave).toHaveBeenCalled();
expect(onSave).toHaveBeenCalledTimes(1);
expect(onSave).toHaveBeenCalledWith({ name: 'Asha' });
expect(onSave).toHaveBeenLastCalledWith(expect.any(Object));
onSave.mock.calls;    // [[arg1, arg2], ...]
onSave.mock.results;  // [{ type: 'return', value }, ...]
```

### 18. How does `jest.mock()` work?
It replaces a whole module with an automatic mock (all exports become `jest.fn()`) or with a factory you provide. Calls to `jest.mock` are **hoisted** to the top of the file, above imports.
```js
import { fetchUser } from './api';
import { getDisplayName } from './user';

jest.mock('./api'); // automock: every export is jest.fn()

test('builds display name', async () => {
  fetchUser.mockResolvedValue({ first: 'Asha', last: 'R' });
  expect(await getDisplayName(1)).toBe('Asha R');
});
```

### 19. How do you mock only part of a module?
Use a factory with `jest.requireActual`:
```js
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  generateId: jest.fn(() => 'fixed-id'),
}));
```

### 20. `jest.spyOn` vs `jest.mock`?
- **`jest.spyOn(object, 'method')`:** wraps one existing method; the real implementation runs unless you override it, and you can restore it with `mockRestore()`.
- **`jest.mock('module')`:** replaces the entire module for the whole test file.
```js
const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
// ... test
spy.mockRestore();
```

### 21. `mockClear` vs `mockReset` vs `mockRestore`?
| Method | Clears call history | Removes implementation | Restores original (spies) |
|---|---|---|---|
| `mockClear()` / `clearAllMocks()` | Yes | No | No |
| `mockReset()` / `resetAllMocks()` | Yes | Yes | No |
| `mockRestore()` / `restoreAllMocks()` | Yes | Yes | Yes |

Config equivalents: `clearMocks`, `resetMocks`, `restoreMocks: true`. Enabling one of these is a common way to prevent test pollution.

### 22. How do fake timers work?
Replace `setTimeout`, `setInterval`, and `Date` so you can control time.
```js
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('debounces calls', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 300);
  debounced(); debounced(); debounced();

  jest.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();

  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);
});
```
Also: `jest.runAllTimers()`, `jest.runOnlyPendingTimers()` (safer with recursive timers), `jest.setSystemTime(new Date('2026-01-01'))`.

### 23. How do you write data-driven tests?
`test.each`:
```js
test.each([
  [1, 1, 2],
  [2, 3, 5],
  [-1, 1, 0],
])('add(%i, %i) = %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});

test.each`
  input      | expected
  ${'hello'} | ${'Hello'}
  ${''}      | ${''}
`('capitalize($input) → $expected', ({ input, expected }) => {
  expect(capitalize(input)).toBe(expected);
});
```

### 24. What is snapshot testing, and when is it a bad idea?
`expect(value).toMatchSnapshot()` stores serialized output and fails if it changes. `toMatchInlineSnapshot()` stores it inside the test file.

**Problems:** large snapshots get rubber-stamped with `-u`, they test implementation detail (markup), and they break on harmless changes.

**Good answer:** "I use small, focused snapshots, like an error message object or a serialized config, and avoid snapshotting whole component trees. For UI I prefer explicit RTL assertions."

### Advanced

### 25. How do you configure Jest for a React + TypeScript project?
```js
// jest.config.js
const { defineConfig } = require('jest'); // Jest 30.3+

module.exports = defineConfig({
  testEnvironment: 'jsdom',              // needs the jest-environment-jsdom package
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: { '^.+\\.(t|j)sx?$': '@swc/jest' }, // or babel-jest / ts-jest
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',     // CSS modules / styles
    '^@/(.*)$': '<rootDir>/src/$1',             // path aliases
  },
  clearMocks: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coverageThreshold: { global: { branches: 80, lines: 80 } },
});

// jest.setup.ts
import '@testing-library/jest-dom';
```
**Key points:** `jsdom` is a separate package since Jest 28; `moduleNameMapper` handles styles, assets, and aliases; transformers compile TS/JSX (Jest doesn't do it natively).

### 26. How do you mock modules with `__mocks__`?
Place `__mocks__/axios.js` next to `node_modules` (for packages) or `src/api/__mocks__/client.js` next to the module. Node packages in a root `__mocks__` folder are used automatically; for user modules you still call `jest.mock('./client')`.

### 27. How do you mock environment-specific things (`window`, `localStorage`, `matchMedia`, `IntersectionObserver`)?
jsdom lacks some browser APIs. Add them in setup:
```js
// jest.setup.ts
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  })),
});

class IO { observe() {} unobserve() {} disconnect() {} }
window.IntersectionObserver = IO;
```
`localStorage` exists in jsdom; clear it in `afterEach`.

### 28. Why is Jest's ESM support awkward?
Jest was built around CommonJS and its module registry; native ESM support still requires `--experimental-vm-modules` and has rough edges, and ESM-only `node_modules` packages often need `transformIgnorePatterns` tweaks. This is one of the main reasons teams on Vite move to Vitest.

### 29. How do you make a slow Jest suite faster?
- Use a faster transformer (`@swc/jest` instead of `babel-jest` / `ts-jest`).
- Run only affected tests: `jest --onlyChanged` / `--changedSince=main`.
- Shard in CI: `jest --shard=1/4`.
- Avoid expensive global setup; mock heavy modules.
- Use `--maxWorkers` tuned to CI cores; find slow files with `--verbose` timing.
- Use `testEnvironment: 'node'` for non-DOM tests (per file via `@jest-environment node` docblock).

### 30. How do you test code that uses `Date.now()` or random values?
- Dates: `jest.useFakeTimers().setSystemTime(new Date('2026-01-01'))`.
- Random/IDs: `jest.spyOn(Math, 'random').mockReturnValue(0.5)` or mock the ID module.
- Better design: inject a clock or ID generator so code is testable without global mocks.

---

## Part 3: Vitest

### 31. What is Vitest, and why do teams choose it?
A test runner built on Vite. It:
- reuses your `vite.config` (aliases, plugins, transforms), so there's no separate transform setup;
- handles ESM and TypeScript natively;
- has a smart watch mode that reruns only tests affected by a change (via Vite's module graph);
- offers a Jest-compatible API, so migration is mostly mechanical.

**Good answer:** "If the app uses Vite, I'd pick Vitest for speed and zero duplicated config. For a large existing Jest codebase or React Native, Jest remains a solid choice."

### 32. What are the API differences from Jest?
| Jest | Vitest |
|---|---|
| `jest.fn()` | `vi.fn()` |
| `jest.mock()` | `vi.mock()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.requireActual()` (sync) | `vi.importActual()` / `importOriginal` (async) |
| Globals by default | Import from `'vitest'`, or set `globals: true` |

```js
import { describe, it, expect, vi } from 'vitest';
```

### 33. How do you configure Vitest for React?
```ts
// vite.config.ts (or vitest.config.ts)
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',          // or 'happy-dom' (faster, less complete)
    globals: true,                 // optional: describe/it/expect without imports
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',              // or 'istanbul'
      reporter: ['text', 'html'],
      thresholds: { lines: 80, branches: 80 },
    },
  },
});
```
```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```
With `globals: true` in TypeScript, add `"types": ["vitest/globals"]` to `tsconfig`.

### 34. How does module mocking work in Vitest?
`vi.mock` is hoisted like `jest.mock`. For partial mocks, use the async `importOriginal`:
```ts
vi.mock('./utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils')>();
  return { ...actual, generateId: vi.fn(() => 'fixed-id') };
});
```
**Gotcha:** a default export must be mocked under the `default` key:
```ts
vi.mock('./logger', () => ({ default: { info: vi.fn() } }));
```

### 35. What is `vi.hoisted`, and why do you need it?
Because `vi.mock` is hoisted above everything, variables declared normally aren't available inside the factory yet. `vi.hoisted` declares values that are hoisted too:
```ts
const { mockFetchUser } = vi.hoisted(() => ({ mockFetchUser: vi.fn() }));

vi.mock('./api', () => ({ fetchUser: mockFetchUser }));

test('uses mocked api', async () => {
  mockFetchUser.mockResolvedValue({ name: 'Asha' });
  // ...
});
```

### 36. jsdom vs happy-dom?
Both simulate the DOM in Node. **happy-dom** is faster but less complete; **jsdom** is more spec-compliant. Start with jsdom; switch per file (`// @vitest-environment happy-dom`) if speed matters and tests pass.

### 37. What is Vitest Browser Mode?
It runs tests in a real browser (via Playwright or WebdriverIO) instead of a simulated DOM. Use it when jsdom isn't realistic enough (layout, real events, Canvas, CSS). Trade-off: slower and more setup than jsdom.

### 38. How do you run multiple test configurations in one repo (e.g. a monorepo, or unit + browser)?
Use `test.projects` to define several projects, each with its own environment, setup files, and include patterns, and run them together.

### 39. What other Vitest features are worth mentioning?
- **Type testing:** `expectTypeOf(fn).returns.toEqualTypeOf<string>()`.
- **In-source testing:** tests inside the source file under `if (import.meta.vitest)`, stripped from production builds.
- **UI:** `@vitest/ui` for a browser dashboard of tests.
- **Test tags (4.1):** label tests and filter runs by tag.
- **Concurrent tests:** `test.concurrent` / `describe.concurrent`.
- **Sharding:** `vitest --shard=1/4`.

### 40. How do you migrate from Jest to Vitest?
1. Install `vitest` (+ `jsdom`), add the `test` block to the Vite config.
2. Replace `jest.` with `vi.` (or use `globals: true` to limit changes).
3. Convert `jest.requireActual` to async `importOriginal` / `vi.importActual`.
4. Fix default-export mocks (`default` key) and `vi.hoisted` for factory variables.
5. Replace `done` callbacks with `async/await`.
6. Switch setup to `@testing-library/jest-dom/vitest`.
7. Run both runners in CI briefly to compare results, then remove Jest.

### 41. Jest vs Vitest: how do you choose?
| | Jest | Vitest |
|---|---|---|
| Config | Own transform/module config | Reuses Vite config |
| ESM / TypeScript | Needs transformers; ESM experimental | Native |
| Speed | Good (great with SWC) | Typically faster, especially watch mode |
| Ecosystem | Largest, most tutorials, React Native default | Growing fast; Vite/Nuxt/SvelteKit default |
| Real browser | No (jsdom) | Browser Mode |
| API | `jest.*` | `vi.*`, nearly identical |

**Good answer:** "Vitest for Vite-based web apps; Jest for React Native and large existing Jest suites. The testing approach with RTL is identical either way."

### 42. Do RTL tests change between Jest and Vitest?
Almost not at all. Queries, `user-event`, and jest-dom matchers are the same. Only the mock API (`vi` vs `jest`), the jest-dom setup import, and config differ.

---

## Part 4: React Testing Library

### Basics

### 43. What is RTL's guiding principle?
"The more your tests resemble the way your software is used, the more confidence they can give you." Test what users see and do (text, roles, labels, clicks) instead of component internals (state, props, instance methods).

### 44. Why did RTL replace Enzyme?
Enzyme encouraged testing implementation details (shallow rendering, reading state), broke on refactors, and never properly supported modern React (hooks, React 18+). RTL tests behavior, survives refactors, and is the officially recommended approach.

### 45. What does a basic RTL test look like?
```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Counter from './Counter';

test('increments the count', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

### 46. What is `screen`, and why prefer it over destructuring from `render`?
`screen` exposes all queries bound to `document.body`. It's always available, avoids destructuring boilerplate, and keeps tests consistent. RTL cleans up the DOM between tests automatically.

### 47. `getBy` vs `queryBy` vs `findBy`?
| Query | No match | Multiple matches | Async | Use for |
|---|---|---|---|---|
| `getBy` | Throws | Throws | No | Element that should be there now |
| `queryBy` | Returns `null` | Throws | No | Asserting something is **not** there |
| `findBy` | Rejects | Rejects | Yes (retries ~1s) | Element that appears later |
| `getAllBy` / `queryAllBy` / `findAllBy` | — | Returns array | — | Multiple elements |

```jsx
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
```

### 48. What is the query priority order?
1. **Accessible to everyone:** `getByRole` (best), `getByLabelText`, `getByPlaceholderText`, `getByText`, `getByDisplayValue`
2. **Semantic:** `getByAltText`, `getByTitle`
3. **Last resort:** `getByTestId`

**Good answer:** "I default to `getByRole` with a `name`. If I can't find an element by role or label, it's usually an accessibility problem in the component, not a testing problem."

### 49. How does `getByRole` work?
It matches the ARIA role, implicit (`<button>` → `button`, `<a href>` → `link`, `<h1>` → `heading`, `<input type="checkbox">` → `checkbox`) or explicit (`role="dialog"`), plus options:
```jsx
screen.getByRole('button', { name: /save/i });
screen.getByRole('heading', { level: 2 });
screen.getByRole('checkbox', { checked: true });
screen.getByRole('tab', { selected: true });
screen.getByRole('textbox', { name: /email/i }); // matched via <label>
```

### 50. What does jest-dom add?
Readable DOM matchers:
`toBeInTheDocument`, `toBeVisible`, `toBeDisabled` / `toBeEnabled`, `toHaveTextContent`, `toHaveValue`, `toBeChecked`, `toHaveAttribute`, `toHaveClass`, `toHaveFocus`, `toHaveAccessibleName`, `toBeInvalid`, `toHaveStyle`.

Set it up once in a setup file (`@testing-library/jest-dom` for Jest, `@testing-library/jest-dom/vitest` for Vitest).

### Intermediate

### 51. `user-event` vs `fireEvent`?
- **`fireEvent`** dispatches a single DOM event (`fireEvent.click`).
- **`user-event`** simulates the full interaction a real user produces. Typing fires `keydown`, `keypress`, `input`, `keyup` for each character; clicking fires pointer, mouse, focus events, and respects `disabled` and `pointer-events: none`.

Prefer `user-event`; use `fireEvent` only for events `user-event` doesn't cover (e.g. `scroll`).
```jsx
const user = userEvent.setup();     // create per test, before render
await user.type(input, 'hello');
await user.clear(input);
await user.selectOptions(select, 'IN');
await user.keyboard('{Enter}');
await user.tab();
await user.upload(fileInput, file);
await user.hover(el);
```
All `user-event` calls are async; always `await` them.

### 52. How do you test async UI (loading → data)?
Use `findBy*` (which wraps `waitFor`) or `waitFor` for non-element assertions:
```jsx
render(<UserProfile id={1} />);
expect(screen.getByText(/loading/i)).toBeInTheDocument();
expect(await screen.findByRole('heading', { name: /asha/i })).toBeInTheDocument();
expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();

await waitFor(() => expect(mockSave).toHaveBeenCalledTimes(1));
await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
```

### 53. What are common `waitFor` mistakes?
- **Side effects inside `waitFor`** (e.g. clicking): the callback can run many times. Do the action outside, assert inside.
- **Empty callback** (`await waitFor(() => {})`): waits one tick and hides timing bugs.
- **Multiple assertions inside one `waitFor`:** put one assertion inside; the rest after.
- **`waitFor(() => getByText(...))`** instead of the simpler `findByText`.

### 54. What is the "not wrapped in act(...)" warning, and how do you fix it?
React warns when state updates happen outside `act`, meaning your test finished or asserted before React processed an update (often an async fetch resolving after the test). RTL's `render`, `user-event`, and async utilities already wrap `act`.

**Fix:** wait for the final UI with `findBy` / `waitFor`, rather than wrapping things in `act` manually. Manual `act` is rarely needed in RTL tests.

### 55. How do you scope queries to part of the page?
`within`:
```jsx
const row = screen.getByRole('row', { name: /asha/i });
await user.click(within(row).getByRole('button', { name: /delete/i }));
```

### 56. How do you test prop changes and unmounting?
```jsx
const { rerender, unmount } = render(<Greeting name="Asha" />);
rerender(<Greeting name="Ravi" />);
expect(screen.getByText(/ravi/i)).toBeInTheDocument();
unmount(); // e.g. to verify cleanup of listeners or timers
```

### 57. How do you debug a failing RTL test?
- `screen.debug()` / `screen.debug(element)` prints the DOM.
- `screen.logTestingPlaygroundURL()` gives a link that suggests the best query.
- `prettyDOM(element)` for formatted output.
- Read the error: RTL prints the accessible roles available when `getByRole` fails.

### 58. How do you test custom hooks?
Prefer testing hooks through a component that uses them. For reusable hooks, use `renderHook` (built into RTL since v13.1):
```jsx
import { renderHook, act } from '@testing-library/react';

test('useCounter increments', () => {
  const { result } = renderHook(() => useCounter(5));
  act(() => result.current.increment());
  expect(result.current.count).toBe(6);
});

// with props and providers
const { result, rerender } = renderHook(({ id }) => useUser(id), {
  initialProps: { id: 1 },
  wrapper: AppProviders,
});
rerender({ id: 2 });
```
Here `act` is needed because you're calling hook functions directly, outside RTL's interaction helpers.

### Advanced

### 59. How do you render components that need providers (theme, router, store, query client)?
Create a custom render once and reuse it:
```tsx
// test/utils.tsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';

export function renderWithProviders(ui, { route = '/', ...options } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  function Wrapper({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}
```
**Key points:** create a **fresh QueryClient/store per test** to avoid shared cache, and disable retries so error states appear immediately.

### 60. How do you mock API calls: `jest.mock` the fetch module, or MSW?
**MSW** intercepts requests at the network layer, so your real fetching code (fetch/axios, React Query, RTK Query) runs unchanged. Tests become integration tests that survive refactors (switching axios → fetch doesn't break them), and the same handlers work in Storybook and the browser during development.
```ts
// test/server.ts
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

export const server = setupServer(
  http.get('/api/users/:id', ({ params }) =>
    HttpResponse.json({ id: params.id, name: 'Asha' }),
  ),
);

// setup file
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// in a test: override for an error case
server.use(
  http.get('/api/users/:id', () => new HttpResponse(null, { status: 500 })),
);
```
**Good answer:** "Module mocks are fine for units like analytics or IDs; for data fetching I mock the network with MSW."

### 61. How do you test components that use timers (debounced search, toasts, polling)?
Combine fake timers with `user-event`'s `advanceTimers` option so typing doesn't hang:
```jsx
beforeEach(() => vi.useFakeTimers());   // jest.useFakeTimers()
afterEach(() => vi.useRealTimers());

test('searches after the user stops typing', async () => {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
  const onSearch = vi.fn();
  render(<SearchBox onSearch={onSearch} delay={300} />);

  await user.type(screen.getByRole('searchbox'), 'react');
  expect(onSearch).not.toHaveBeenCalled();

  await act(() => vi.advanceTimersByTime(300));
  expect(onSearch).toHaveBeenCalledWith('react');
});
```

### 62. How do you test modals, portals, and tooltips?
Portals render into `document.body`, and `screen` queries the whole body, so they work normally:
```jsx
await user.click(screen.getByRole('button', { name: /delete/i }));
const dialog = await screen.findByRole('dialog', { name: /confirm delete/i });
await user.click(within(dialog).getByRole('button', { name: /confirm/i }));
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
```
For tooltips: `await user.hover(trigger)`, then `findByRole('tooltip')`.

### 63. What are the most common RTL mistakes (and fixes)?
| Mistake | Fix |
|---|---|
| `container.querySelector('.btn')` | `screen.getByRole('button', { name })` |
| `getByTestId` everywhere | Role / label / text queries |
| `fireEvent` for typing | `user-event` |
| `queryBy` to assert presence | `getBy` (better error messages) |
| `getBy` inside `waitFor` | `findBy` |
| Wrapping everything in `act` | Use RTL async utilities |
| Asserting internal state or prop calls of child components | Assert visible output |
| Shared QueryClient / store across tests | Fresh instance per test |
| Not awaiting `user-event` | `await user.click(...)` |

### 64. How do you test accessibility?
- Querying by role and label already enforces accessible names.
- Check focus management: `expect(screen.getByRole('dialog')).toHaveFocus()` or `await user.tab()` sequences.
- Add automated checks with `jest-axe` / `vitest-axe`:
```jsx
import { axe } from 'jest-axe';
const { container } = render(<SignupForm />);
expect(await axe(container)).toHaveNoViolations();
```
Automated checks catch only part of the issues, so pair them with manual keyboard and screen reader testing.

---

## Part 5: Testing Real-World React Code

### 65. How do you test a form (React Hook Form + Zod)?
```jsx
test('validates and submits', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn();
  render(<SignupForm onSubmit={onSubmit} />);

  await user.click(screen.getByRole('button', { name: /sign up/i }));
  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();

  await user.type(screen.getByLabelText(/email/i), 'user@example.com');
  await user.type(screen.getByLabelText(/password/i), 'supersecret');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  await waitFor(() =>
    expect(onSubmit).toHaveBeenCalledWith(
      { email: 'user@example.com', password: 'supersecret' },
      expect.anything(),
    ),
  );
});
```
Also test: submit button disabled while submitting, server error shown on the right field (via MSW), dynamic field add/remove.

### 66. How do you test React Router behavior?
Render with `MemoryRouter` (or `createMemoryRouter` + `RouterProvider` for data routers) and assert on what renders:
```jsx
render(
  <MemoryRouter initialEntries={['/dashboard']}>
    <Routes>
      <Route path="/login" element={<h1>Login</h1>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  </MemoryRouter>,
);

// Logged-out user is redirected
expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
```
Assert on the resulting screen rather than mocking `useNavigate`.

### 67. How do you test Context-based state?
Render the real provider (via a wrapper), interact with consumers, and assert output. Allow a custom initial value so tests can start from specific states:
```jsx
render(
  <AuthProvider initialUser={{ name: 'Asha' }}>
    <Header />
  </AuthProvider>,
);
expect(screen.getByText(/hi, asha/i)).toBeInTheDocument();
```

### 68. How do you test Redux Toolkit code?
- **Components:** render with a **real store** created per test (`setupStore(preloadedState)`), not a mocked store. Assert UI changes after user actions.
- **Reducers/slices:** pure functions, test directly: `expect(reducer(initial, addTodo('x'))).toEqual(...)`.
- **Thunks / RTK Query:** let them run against MSW handlers and assert the UI or resulting state.
```jsx
export function renderWithStore(ui, { preloadedState } = {}) {
  const store = setupStore(preloadedState);
  return { store, ...render(<Provider store={store}>{ui}</Provider>) };
}
```

### 69. How do you test Zustand stores?
Test the store directly for logic, and reset state between tests because stores are module singletons:
```ts
const initial = useCartStore.getState();
afterEach(() => useCartStore.setState(initial, true));

test('adds item', () => {
  useCartStore.getState().add({ id: 1 });
  expect(useCartStore.getState().items).toHaveLength(1);
});
```
For components, render normally and assert UI; the store works without a provider.

### 70. How do you test data fetching with React Query?
Fresh `QueryClient` per test with `retry: false`, MSW for responses, then assert loading → success and error states with `findBy`. Avoid mocking `useQuery` itself; that tests nothing real.

### 71. How do you test error boundaries?
Render a child that throws, and silence the expected console error:
```jsx
const Bomb = () => { throw new Error('Boom'); };

test('shows fallback UI', () => {
  const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
  render(<ErrorBoundary fallback={<p>Something went wrong</p>}><Bomb /></ErrorBoundary>);
  expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  spy.mockRestore();
});
```

### 72. How do you test lazy-loaded components (`React.lazy` + `Suspense`)?
Use `findBy*` so the test waits for the lazy chunk to resolve:
```jsx
render(<Suspense fallback={<p>Loading...</p>}><LazySettings /></Suspense>);
expect(await screen.findByRole('heading', { name: /settings/i })).toBeInTheDocument();
```

### 73. How do you test a virtualized list (react-window)?
jsdom has no layout, so measured sizes are zero and nothing renders. Either give the list explicit `height`/`width` props (fixed-size lists render items based on props), or mock `AutoSizer` to return fixed dimensions. Assert that only the visible window of items is in the DOM, and that scrolling (`fireEvent.scroll`) renders new items.

### 74. How do you test an Express API? (full-stack bonus)
Use **Supertest** with your app exported separately from `listen()`:
```js
import request from 'supertest';
import app from '../app';

test('POST /signup validates input', async () => {
  const res = await request(app).post('/signup').send({ email: 'bad' });
  expect(res.status).toBe(400);
  expect(res.body.errors.email).toBeDefined();
});
```
Use a test database (or in-memory/containerized DB via Testcontainers) and reset it between tests.

---

## Part 6: Senior: Strategy, Quality & CI

### 75. How would you define a testing strategy for a new React app?
- **Static:** TypeScript strict mode + ESLint (incl. `eslint-plugin-testing-library`, `jsx-a11y`).
- **Unit:** pure logic (utils, reducers, schema validation, formatting).
- **Integration (the bulk):** feature-level RTL tests with real providers and MSW.
- **E2E:** a handful of critical journeys with Playwright (login, checkout, payment) running against a deployed preview.
- **Visual regression** for the design system (Chromatic / Playwright screenshots).
- **CI gates:** tests + coverage thresholds on every PR.

### 76. What should you mock, and where should the boundary be?
Mock at the **edges of your system**: network (MSW), time (fake timers), randomness, browser APIs jsdom lacks, and heavy third-party SDKs (analytics, payments). Avoid mocking your own components, hooks, or modules in integration tests; the more you mock, the less the test proves.

### 77. What causes flaky tests, and how do you fix them?
| Cause | Fix |
|---|---|
| Asserting before async UI settles | `findBy` / `waitFor` |
| Shared state between tests (store, cache, localStorage, MSW overrides) | Fresh instances, `resetHandlers`, `restoreMocks`, cleanup |
| Real timers / real dates | Fake timers, fixed system time |
| Test order dependence | Run with `--randomize` (Jest) / `sequence.shuffle` (Vitest) to expose it |
| Real network calls | MSW with `onUnhandledRequest: 'error'` |
| Animations | Disable in test env or wait for end state |

Quarantine a flaky test with a ticket, but fix the root cause; retries hide real bugs.

### 78. How do you set up tests in CI?
- Run lint, type-check, and tests on every PR.
- Cache dependencies; run only affected tests on PRs (`--changedSince` / Nx / Turborepo affected), full suite on main.
- Shard large suites across machines (`--shard`).
- Publish coverage and enforce thresholds on new code.
- Run E2E against the preview deployment, with traces/videos on failure.

### 79. Unit tests are green but production broke. What went wrong, and what do you change?
Likely over-mocking (tests verified mocks, not integration), missing integration/E2E coverage of the broken flow, or untested environment differences (config, browser, API contract). Response: write a test that reproduces the bug first, move coverage up a level (integration with MSW or an E2E test), and consider contract tests or schema validation (e.g. Zod on API responses) to catch backend drift.

### 80. How do you test code that's hard to test?
Usually a design smell. Refactor toward testability:
- Separate pure logic from side effects (extract a pure function or custom hook).
- Inject dependencies (API client, clock, storage) instead of importing globals.
- Split large components into a container (data) and presentational component (UI).

### 81. How do you keep a large test suite maintainable?
- Shared test utilities: custom render, factories/builders for test data (e.g. `buildUser({ overrides })`), MSW handlers per domain.
- Descriptive test names that read as behavior ("shows an error when the email is taken").
- No logic in tests (loops/conditionals) beyond `test.each`.
- Delete tests that only re-check implementation details.
- Lint rules: `eslint-plugin-testing-library`, `eslint-plugin-jest` / `vitest`.

### 82. How do you test performance-sensitive components?
Functional tests can assert render counts with React's `<Profiler>` or a render-count spy, but true performance testing belongs in profiling tools, Lighthouse CI, or Playwright performance traces. Mention that unit-test runners aren't benchmarking tools (though Vitest has `bench` for micro-benchmarks).

### 83. Snapshot tests vs visual regression tests vs explicit assertions?
- **Snapshots:** serialized markup; cheap but brittle and often rubber-stamped.
- **Visual regression:** pixel comparison in a real browser; catches CSS bugs that DOM assertions can't.
- **Explicit RTL assertions:** precise and readable; the default for behavior.

### 84. How do you convince a team with no tests to start testing?
Start small and high-value: add the testing setup and a custom render, require tests for bug fixes (a regression test per bug), cover the most critical flow with one E2E test, add tests for new code via PR checklist, and show value with caught regressions. Don't chase coverage numbers on legacy code.

---

## Part 7: Bonus: React Native Testing

### 85. How do you unit test React Native components?
Use **Jest** (the RN default, with the `react-native` preset) plus **React Native Testing Library (RNTL)**. RTL is DOM-based and doesn't work for native components; RNTL provides the same query philosophy for RN.

### 86. What changed in RNTL v14?
It requires React 19 and React Native 0.78+, replaces the deprecated React Test Renderer with the new Test Renderer package, and makes `render`, `renderHook`, and event APIs **async**. Codemods are available for migration.
```tsx
import { render, screen, userEvent } from '@testing-library/react-native';

test('submits login', async () => {
  const user = userEvent.setup();
  await render(<LoginScreen />);
  await user.type(screen.getByLabelText('Email'), 'user@example.com');
  await user.press(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByText('Welcome')).toBeOnTheScreen();
});
```

### 87. How do you handle native modules in RN tests?
Native modules don't exist in Jest. Mock them in setup files: many libraries ship Jest mocks (e.g. `react-native-reanimated/mock`, AsyncStorage's `jest/async-storage-mock`), and you add `jest.mock` for the rest. Configure `transformIgnorePatterns` so RN packages shipped as untranspiled code get transformed.

### 88. What do you use for React Native E2E?
**Detox** (gray-box, synchronizes with the app) or **Maestro** (YAML flows, simple setup). Both run on simulators/emulators in CI.

---

## Part 8: Live-Coding Scenarios

Practice writing these from scratch; they're common in machine-coding rounds.

### 89. Test a counter with increment, decrement, and a minimum of 0.
Cover: initial render, increment, decrement, decrement disabled at 0.

### 90. Test a debounced search box that calls an API.
Cover: no call before the delay (fake timers), one call after, results rendered (MSW), empty state, error state.

### 91. Test a todo list.
Cover: add (Enter key and button), toggle complete, delete, filter (all/active/completed), empty input ignored. Use `within` for row-level actions.

### 92. Test a `useFetch(url)` custom hook.
Cover with `renderHook` + MSW: loading → data, error, refetch when `url` changes (`rerender`), and abort on unmount (no state update warning).

### 93. Test a login flow.
Cover: validation errors, successful login redirects (MemoryRouter), wrong password shows server error (MSW 401), button disabled while submitting.

### 94. Test a paginated table.
Cover: first page renders, next/previous buttons, disabled state on first/last page, sorting by column header, row actions via `within`.

**Approach to narrate in live rounds:** "First I'll list the behaviors from the user's perspective, then write one test per behavior using role queries and user-event, mock only the network with MSW, and cover the loading, success, empty, and error states."

---

*Tip: the answer that signals seniority in almost every testing question is the same: test behavior, not implementation; mock at the boundaries; keep tests independent; and prefer a few integration tests that give real confidence over many brittle unit tests.*
