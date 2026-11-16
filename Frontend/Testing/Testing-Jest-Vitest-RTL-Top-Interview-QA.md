# Jest, Vitest & React Testing Library — Most-Asked Interview Questions

> Trimmed from 94 → 32 questions. Kept only what interviewers actually ask (product + service companies) and the concepts worth understanding.
> Cut: React Native testing, Express/Supertest, virtualized lists, Vitest browser mode/type tests, Jest ESM details, rarely-asked config trivia.

**How the tools fit together (know this one cold)**

| Tool | Role |
|---|---|
| **Jest / Vitest** | Test **runner** — finds and runs tests, gives `describe/test/expect`, mocks, fake timers, coverage |
| **React Testing Library (RTL)** | Renders components and queries them **like a user**. Not a runner — works with either Jest or Vitest |
| **user-event** | Realistic interactions (typing, clicking, tabbing) |
| **jest-dom** | Readable DOM matchers (`toBeInTheDocument`, `toBeDisabled`) |
| **MSW** | Mocks the **network** so real fetching code runs |
| **jsdom / happy-dom** | Fake browser DOM in Node |

---

## Part 1 — Fundamentals (Asked Everywhere)

### 1. What types of tests are there? Pyramid vs Trophy?
| Type | Scope | Tools |
|---|---|---|
| Static | Types, lint | TypeScript, ESLint |
| Unit | One function/component | Jest/Vitest |
| Integration | Several units together (component + hooks + context + mocked API) | Jest/Vitest + RTL + MSW |
| E2E | Whole app in a real browser | Playwright, Cypress |

- **Pyramid**: many unit → fewer integration → very few E2E.
- **Trophy**: static base, then **mostly integration tests**, some unit, few E2E.

**Answer to give:** "For React UIs I follow the trophy — integration tests that render a feature with real children and a mocked network give the most confidence per cost."

### 2. What should you test, and what shouldn't you?
**Test:** behavior users depend on — rendered output, interactions, validation, loading/error/empty states, business logic.
**Don't test:** implementation details (internal state, private functions, which hook was called), third-party internals, trivial code.

Why: tests tied to internals **break on refactors even when behavior is unchanged**, so people stop trusting them.

### 3. Mock vs Stub vs Spy vs Fake?
- **Stub**: returns canned data.
- **Spy**: wraps a real function and records calls.
- **Mock**: replacement you assert on (`toHaveBeenCalledWith`).
- **Fake**: lightweight working implementation (in-memory DB, MSW handlers).

`jest.fn()` / `vi.fn()` can act as any of the first three.

### 4. Is 100% code coverage the goal?
No. Coverage shows what code **ran**, not whether behavior was **verified**. You can hit 100% with weak assertions.
**Answer:** "I use coverage to find untested areas and set sensible thresholds on critical code, but I optimize for meaningful assertions."

---

## Part 2 — Jest

### 5. `toBe` vs `toEqual` vs `toStrictEqual`
- `toBe`: `Object.is` — primitives and same reference.
- `toEqual`: recursive value equality; **ignores `undefined` properties**.
- `toStrictEqual`: also checks `undefined` props, sparse arrays, and class types.
```js
expect({ a: 1, b: undefined }).toEqual({ a: 1 });        // ✅
expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 });  // ❌
expect(0.1 + 0.2).toBeCloseTo(0.3);                      // floats
```
Useful extras: `toMatchObject` (partial), `expect.objectContaining`, `expect.any(Number)`.

### 6. How do you test async code? What's the classic pitfall?
Use `async/await`, `.resolves`, or `.rejects`.
```js
test('fetches user', async () => {
  expect((await getUser(1)).name).toBe('Asha');
});
test('rejects for missing user', async () => {
  await expect(getUser(999)).rejects.toThrow('Not found');
});
```
**Pitfall:** forgetting `await`/`return` — the test finishes before the assertion runs and **passes falsely**.

### 7. What is `jest.fn()` and what can you do with it?
A mock function that records calls and lets you control return values.
```js
const onSave = jest.fn();
onSave.mockReturnValue(true);
onSave.mockResolvedValue({ id: 1 });          // async success
onSave.mockRejectedValue(new Error('x'));     // async failure

expect(onSave).toHaveBeenCalledTimes(1);
expect(onSave).toHaveBeenCalledWith({ name: 'Asha' });
```

### 8. `jest.mock` vs `jest.spyOn` — and how do you mock part of a module?
- `jest.mock('./module')`: replaces the **whole module** for the file; calls are **hoisted** above imports.
- `jest.spyOn(obj, 'method')`: wraps **one method**; real implementation runs unless overridden; restorable.
```js
jest.mock('./api');                              // automock
fetchUser.mockResolvedValue({ name: 'Asha' });

jest.mock('./utils', () => ({                    // partial mock
  ...jest.requireActual('./utils'),
  generateId: jest.fn(() => 'fixed-id'),
}));

const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
spy.mockRestore();
```
Mock at **boundaries** (network, time, SDKs), not your own internals.

### 9. `mockClear` vs `mockReset` vs `mockRestore`
| | Clears calls | Removes implementation | Restores original |
|---|---|---|---|
| `mockClear` | ✅ | ❌ | ❌ |
| `mockReset` | ✅ | ✅ | ❌ |
| `mockRestore` | ✅ | ✅ | ✅ (spies) |

Set `clearMocks` / `restoreMocks: true` in config to avoid **test pollution**.

### 10. How do fake timers work? (Debounce is the classic example)
```js
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

test('debounces', () => {
  const fn = jest.fn();
  const debounced = debounce(fn, 300);
  debounced(); debounced();

  jest.advanceTimersByTime(299);
  expect(fn).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1);
  expect(fn).toHaveBeenCalledTimes(1);
});
```
Also `jest.setSystemTime(new Date('2026-01-01'))` for dates and `runOnlyPendingTimers` for recursive timers. For random/IDs, spy on `Math.random` or inject the dependency.

### 11. What is `test.each`?
Data-driven tests — one test body, many cases.
```js
test.each([[1, 1, 2], [2, 3, 5], [-1, 1, 0]])('add(%i, %i) = %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});
```

### 12. Snapshot testing — when is it useful and when harmful?
Stores serialized output and fails when it changes.
**Harmful:** big component snapshots are noisy, tied to markup, and get rubber-stamped with `-u`.
**OK:** small, stable data (error objects, config, serializers).
For UI, prefer explicit RTL assertions.

### 13. How do you set up Jest for React + TypeScript?
```js
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',                       // separate package: jest-environment-jsdom
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],// imports '@testing-library/jest-dom'
  transform: { '^.+\\.(t|j)sx?$': '@swc/jest' },  // Jest doesn't compile TS/JSX itself
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',       // styles
    '^@/(.*)$': '<rootDir>/src/$1',               // path aliases
  },
  clearMocks: true,
};
```
Key ideas: a **transformer** compiles TS/JSX, **jsdom** simulates the browser, **moduleNameMapper** handles styles/assets/aliases, jsdom lacks some APIs (`matchMedia`, `IntersectionObserver`) so you mock them in the setup file.

### 14. How do you speed up a slow Jest suite?
Faster transformer (`@swc/jest`), run affected tests only (`--onlyChanged`), shard in CI (`--shard=1/4`), `testEnvironment: 'node'` for non-DOM tests, avoid heavy global setup, tune `--maxWorkers`.

---

## Part 3 — Vitest

### 15. Jest vs Vitest — how do you choose?
| | Jest | Vitest |
|---|---|---|
| Config | Separate transform/module setup | **Reuses your Vite config** |
| ESM / TypeScript | Needs transformers; ESM is rough | Native |
| Speed | Good (great with SWC) | Typically faster, esp. watch mode |
| API | `jest.*` | `vi.*` — nearly identical |
| Best for | Large existing Jest suites, React Native | Vite-based web apps |

**Answer:** "Vitest for Vite apps — zero duplicated config and faster feedback. Jest for existing Jest codebases or React Native. My RTL tests are identical either way."

### 16. What changes when migrating Jest → Vitest?
1. `jest.` → `vi.` (or `globals: true`).
2. `jest.requireActual` → async `importOriginal` / `vi.importActual`.
3. Default-export mocks go under the `default` key.
4. Variables used in a `vi.mock` factory need `vi.hoisted` (mock is hoisted above them).
5. Setup import becomes `@testing-library/jest-dom/vitest`.
```ts
const { mockFetch } = vi.hoisted(() => ({ mockFetch: vi.fn() }));
vi.mock('./api', () => ({ fetchUser: mockFetch }));

vi.mock('./utils', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./utils')>()),
  generateId: vi.fn(() => 'fixed-id'),
}));
```

### 17. How do you configure Vitest for React?
```ts
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',            // or happy-dom (faster, less complete)
    globals: true,
    setupFiles: ['./src/test/setup.ts'],   // import '@testing-library/jest-dom/vitest'
    restoreMocks: true,
    coverage: { provider: 'v8', thresholds: { lines: 80 } },
  },
});
```
With `globals: true` in TypeScript, add `"types": ["vitest/globals"]`.

---

## Part 4 — React Testing Library (Heart of the Interview)

### 18. What is RTL's philosophy? Why did it replace Enzyme?
> "The more your tests resemble the way your software is used, the more confidence they give you."

Test what users **see and do** (text, roles, labels, clicks), not state/props/instances. Enzyme encouraged implementation-detail testing (shallow rendering, reading state), broke on refactors, and doesn't support modern React well.

### 19. What does a basic RTL test look like?
```jsx
test('increments the count', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /increment/i }));
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```
Use `screen` for queries; RTL auto-cleans up between tests.

### 20. What is the query priority? How does `getByRole` work?
1. `getByRole` (with `name`) — best, mirrors the accessibility tree
2. `getByLabelText` (forms), `getByPlaceholderText`, `getByText`, `getByDisplayValue`
3. `getByAltText`, `getByTitle`
4. `getByTestId` — **last resort**

```jsx
screen.getByRole('button', { name: /save/i });
screen.getByRole('heading', { level: 2 });
screen.getByRole('textbox', { name: /email/i });   // matched via <label>
```
**Answer:** "If I can't find something by role or label, it's usually an accessibility problem in the component, not a testing problem."

### 21. `getBy` vs `queryBy` vs `findBy`
| Query | No match | Async | Use for |
|---|---|---|---|
| `getBy` | **throws** | No | Element must exist now |
| `queryBy` | returns `null` | No | Asserting **absence** |
| `findBy` | rejects after ~1s | **Yes** | Element appears later |

```jsx
expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
```
Use `getBy` (not `queryBy`) to assert presence — better error messages.

### 22. `userEvent` vs `fireEvent`
- `fireEvent` dispatches **one** DOM event.
- `userEvent` simulates the **full interaction** (typing fires keydown/keypress/input/keyup per character; clicking fires pointer/mouse/focus events; respects `disabled`).

```jsx
const user = userEvent.setup();     // create before render
await user.type(input, 'hello');
await user.selectOptions(select, 'IN');
await user.tab();
```
All `userEvent` calls are **async — always `await`**. Use `fireEvent` only for things like `scroll`.

### 23. How do you test async UI? Common `waitFor` mistakes?
```jsx
render(<UserProfile id={1} />);
expect(screen.getByText(/loading/i)).toBeInTheDocument();
expect(await screen.findByRole('heading', { name: /asha/i })).toBeInTheDocument();

await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));
```
Mistakes: **side effects inside `waitFor`** (callback runs repeatedly), empty `waitFor(() => {})`, many assertions inside one `waitFor`, and using `waitFor(() => getBy…)` instead of `findBy`.

### 24. What is the "not wrapped in act(...)" warning?
A state update happened **outside** React's tracking — usually an async update resolving after the test asserted/finished. RTL's `render`, `userEvent`, and `findBy/waitFor` already wrap `act`.
**Fix:** wait for the final UI with `findBy`/`waitFor`. Manual `act` is rarely needed (mainly when calling hook functions directly).

### 25. What does jest-dom add?
Readable matchers: `toBeInTheDocument`, `toBeVisible`, `toBeDisabled`, `toHaveValue`, `toBeChecked`, `toHaveTextContent`, `toHaveAttribute`, `toHaveFocus`, `toHaveAccessibleName`.
Set up once: `@testing-library/jest-dom` (Jest) or `@testing-library/jest-dom/vitest` (Vitest).

### 26. How do you test custom hooks?
Prefer testing through a component. For reusable hooks, use `renderHook`.
```jsx
const { result } = renderHook(() => useCounter(5));
act(() => result.current.increment());     // act needed: calling hook fn directly
expect(result.current.count).toBe(6);

const { result, rerender } = renderHook(({ id }) => useUser(id), {
  initialProps: { id: 1 }, wrapper: AppProviders,
});
```

### 27. How do you render components that need providers (router, store, query client, theme)?
Create a **custom render** with a wrapper, and a **fresh store/QueryClient per test**.
```tsx
export function renderWithProviders(ui, { route = '/' } = {}) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
    </QueryClientProvider>
  );
  return render(ui, { wrapper: Wrapper });
}
```
Disable retries so error states show immediately; shared caches cause cross-test pollution.

### 28. Common RTL mistakes and fixes
| Mistake | Fix |
|---|---|
| `container.querySelector('.btn')` | `getByRole('button', { name })` |
| `getByTestId` everywhere | Role/label/text queries |
| `fireEvent` for typing | `userEvent` |
| Not awaiting `userEvent` | `await user.click(...)` |
| `getBy` inside `waitFor` | `findBy` |
| Wrapping everything in `act` | Use RTL async utilities |
| Asserting internal state / child props | Assert visible output |
| Shared store/QueryClient across tests | Fresh instance per test |

Also handy: `within(row).getByRole(...)` to scope queries, `screen.debug()` to print the DOM, `screen.logTestingPlaygroundURL()` for query suggestions.

---

## Part 5 — Testing Real-World React Code

### 29. How do you mock APIs — module mocks or MSW?
**MSW** intercepts at the **network level**, so your real fetching code (fetch/axios, React Query, RTK Query) runs unchanged. Tests survive refactors (swap axios → fetch, nothing breaks), and handlers are reusable in Storybook/dev.
```ts
export const server = setupServer(
  http.get('/api/users/:id', ({ params }) => HttpResponse.json({ id: params.id, name: 'Asha' })),
);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// error case in one test
server.use(http.get('/api/users/:id', () => new HttpResponse(null, { status: 500 })));
```
**Answer:** "Module mocks for things like analytics or ID generators; MSW for anything that hits the network."

### 30. How do you test a form (validation + submit)?
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
  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
});
```
Also cover: button disabled while submitting, server errors (via MSW), field-level messages.

### 31. How do you test routing, Redux/Context/Zustand, and React Query?
- **Router**: render with `MemoryRouter` and assert on **what renders** (e.g., logged-out user sees Login) — don't mock `useNavigate`.
- **Redux**: render with a **real store per test** (`setupStore(preloadedState)`); test reducers as pure functions; let thunks/RTK Query hit MSW.
- **Context**: render the real provider (allow an initial value) and assert output.
- **Zustand**: stores are singletons — reset between tests: `afterEach(() => useStore.setState(initial, true))`.
- **React Query**: fresh `QueryClient` with `retry: false`, MSW responses, assert loading → success/error with `findBy`. Never mock `useQuery` itself.

### 32. How do you test error boundaries, lazy components, and modals?
```jsx
// error boundary
const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
render(<ErrorBoundary fallback={<p>Something went wrong</p>}><Bomb /></ErrorBoundary>);
expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

// lazy + Suspense: wait for the chunk
render(<Suspense fallback={<p>Loading…</p>}><LazySettings /></Suspense>);
expect(await screen.findByRole('heading', { name: /settings/i })).toBeInTheDocument();

// modal/portal: screen queries all of document.body
const dialog = await screen.findByRole('dialog', { name: /confirm/i });
await user.click(within(dialog).getByRole('button', { name: /confirm/i }));
```
For timers + `userEvent` (debounced search): `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.

---

## Part 6 — Senior / Product-Company Questions

### 33. How would you define a testing strategy for a new React app?
- **Static**: TypeScript strict + ESLint (`testing-library`, `jsx-a11y` plugins).
- **Unit**: pure logic (utils, reducers, schemas).
- **Integration (the bulk)**: feature-level RTL tests with real providers + MSW.
- **E2E**: a handful of critical journeys (login, checkout) with Playwright against a preview deploy.
- **Visual regression** for the design system (Chromatic/Playwright screenshots).
- **CI gates**: lint + types + tests + coverage threshold on every PR.

### 34. What should you mock, and where's the boundary?
Mock the **edges**: network (MSW), time, randomness, browser APIs jsdom lacks, heavy third-party SDKs. **Don't** mock your own components/hooks in integration tests — the more you mock, the less the test proves.

### 35. What causes flaky tests and how do you fix them?
| Cause | Fix |
|---|---|
| Asserting before async UI settles | `findBy` / `waitFor` |
| Shared state (store, cache, localStorage, MSW overrides) | Fresh instances, `resetHandlers`, `restoreMocks` |
| Real timers/dates | Fake timers, fixed system time |
| Order dependence | Randomize order to expose it (`--randomize` / `sequence.shuffle`) |
| Real network | MSW with `onUnhandledRequest: 'error'` |
| Animations | Disable in test env |

Quarantine with a ticket, but fix the root cause — retries hide real bugs.

### 36. Unit tests pass but production broke. Why, and what do you change?
Likely **over-mocking** (tests verified mocks, not integration), no integration/E2E coverage of the broken flow, or untested environment/API-contract differences.
Fix: write a test reproducing the bug first, move coverage up a level (integration with MSW or E2E), and validate API responses with a schema (Zod) or contract tests.

### 37. How do you test code that's hard to test?
It's usually a **design smell**. Separate pure logic from side effects (extract a function/custom hook), **inject dependencies** (API client, clock, storage) instead of importing globals, and split container (data) from presentational (UI) components.

### 38. How do you set up tests in CI and keep the suite maintainable?
- Run lint + type-check + tests on every PR; cache deps; run affected tests on PRs, full suite on main; **shard** big suites.
- Enforce coverage thresholds on new code; keep traces/screenshots for failed E2E.
- Maintainability: shared custom render, data builders (`buildUser({ overrides })`), MSW handlers per domain, behavior-style test names, no logic in tests, delete tests that only check implementation.

### 39. Live-coding rounds: what do they ask and how do you approach them?
**Common prompts:** counter, todo list (add/toggle/delete/filter), debounced search box, login form flow, paginated table, a `useFetch` hook.
**Approach to narrate:**
> "First I list the behaviors from the user's perspective. Then one test per behavior using role queries and `userEvent`, mocking only the network with MSW, and covering loading, success, empty, and error states."

Example — todo list checklist: add via Enter and button, ignore empty input, toggle complete, delete (use `within(row)`), filters.

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Runner vs RTL | Jest/Vitest run tests; RTL renders and queries |
| Best query | `getByRole` with `name` |
| Assert absence | `queryBy*` + `not.toBeInTheDocument()` |
| Wait for async element | `await screen.findBy*` |
| Typing/clicking | `userEvent` (awaited), not `fireEvent` |
| Mock network | MSW |
| Fake timers | `jest.useFakeTimers()` / `vi.useFakeTimers()` |
| `act` warning fix | Await the final UI, don't wrap in `act` |
| Vitest factory variables | `vi.hoisted` |
| Reset between tests | `restoreMocks`, fresh store/QueryClient, `resetHandlers` |
| **Signals seniority** | Test behavior not implementation; mock at boundaries; independent tests; few integration tests > many brittle unit tests |
