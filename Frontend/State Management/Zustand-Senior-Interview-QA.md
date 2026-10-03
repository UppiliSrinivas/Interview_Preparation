# Zustand — Senior Frontend Interview Notes (Product Companies)

> Focus: **why/when, performance (selectors), middleware, architecture, SSR, testing, trade-offs.**

---

## Part 1 — Core Concepts

### 1. What is Zustand and why use it?
A small, hook-based global state library. You create a store with `create`, and components subscribe to **slices** of it via selectors. No Provider, minimal boilerplate, works outside React too.

```js
import { create } from 'zustand';

const useCartStore = create((set, get) => ({
  items: [],
  add: (item) => set((s) => ({ items: [...s.items, item] })),
  total: () => get().items.reduce((sum, i) => sum + i.price, 0),
}));

// component
const items = useCartStore((s) => s.items);
const add = useCartStore((s) => s.add);
```

### 2. How does `set` work? Does it replace or merge state?
`set` **shallow-merges** the returned object into the current state (top level only). Nested objects must be updated immutably yourself (or use the `immer` middleware).
`set(state, true)` **replaces** the whole state.

```js
set((s) => ({ user: { ...s.user, name: 'A' } }));   // nested update — spread manually
```

### 3. How does Zustand work internally?
It's a tiny external store (`getState`, `setState`, `subscribe`). The React hook connects to it with **`useSyncExternalStore`**, so it's safe with concurrent rendering (no tearing). On each update, the selector re-runs and the component re-renders only if the selected value changes.

### 4. Why do you not need a Provider?
The store is a module-level singleton created by `create`, and the hook references it directly. Benefits: less boilerplate, usable outside components. Drawback: a singleton is **shared across requests on the server** (see SSR question).

### 5. Can you use the store outside React?
Yes.
```js
useCartStore.getState().add(item);          // read/call actions
useCartStore.setState({ items: [] });       // update
const unsub = useCartStore.subscribe((state, prev) => { /* react to changes */ });
```
Useful in API interceptors (e.g., read the token or call `logout()` on a 401), analytics, and tests.

---

## Part 2 — Selectors & Performance (Most Asked)

### 6. How do selectors prevent unnecessary re-renders?
A component re-renders only when the **selected value** changes (compared with `Object.is`).

```js
// ❌ subscribes to the whole store → re-renders on ANY change
const { count, user } = useStore();

// ✅ subscribe to only what you need
const count = useStore((s) => s.count);
```

### 7. What's the problem with returning objects/arrays from a selector?
A selector that returns a **new reference every time** looks "changed" on every update. In Zustand v5 this can cause an **infinite render loop**; in v4 it causes excess re-renders. Fix with `useShallow`.

```js
import { useShallow } from 'zustand/react/shallow';

// ❌ new object each call
const { name, age } = useStore((s) => ({ name: s.name, age: s.age }));

// ✅ shallow-compares the result
const { name, age } = useStore(useShallow((s) => ({ name: s.name, age: s.age })));
// or select primitives separately
```

### 8. How do you derive/compute values?
- Compute in the selector for cheap derivations: `useStore((s) => s.items.length)`.
- For expensive or new-reference results, use `useShallow`, `useMemo` in the component, or a memoized selector (e.g., `reselect`).
- Avoid storing derived data in state — it can go stale.

### 9. What are "transient updates"?
Reading or subscribing to state **without re-rendering** — via `getState()` or `subscribe` — for high-frequency data (mouse position, animations, drag) where you update the DOM/ref directly.
```js
useEffect(() => useStore.subscribe((s) => { ref.current.style.x = s.x; }), []);
```

---

## Part 3 — Middleware & Features

### 10. What middleware does Zustand provide?
- **`devtools`** — Redux DevTools integration
- **`persist`** — save/restore state to storage
- **`immer`** — "mutating" updates
- **`subscribeWithSelector`** — subscribe to specific slices with listeners
- **`combine`** — infer types from initial state

```js
const useStore = create(devtools(persist(immer((set) => ({
  count: 0,
  inc: () => set((s) => { s.count += 1; }),
})), { name: 'app-store' })));
```
Order matters; `devtools` is typically the outermost.

### 11. How do you persist state correctly?
```js
persist(
  (set) => ({ theme: 'light', token: null, setTheme: (t) => set({ theme: t }) }),
  {
    name: 'app',
    storage: createJSONStorage(() => localStorage),
    partialize: (s) => ({ theme: s.theme }),   // only persist what's needed
    version: 2,
    migrate: (persisted, version) => { /* upgrade old shape */ return persisted; },
  }
)
```
Senior points: **`partialize`** (don't persist actions, server cache, or tokens in localStorage), **`version` + `migrate`** for schema changes, and handle **hydration** (`onRehydrateStorage`, `persist.hasHydrated()`) to avoid flicker/mismatch.

### 12. How do you handle async actions?
Just use `async` functions in the store — no thunk/saga needed.
```js
const useUserStore = create((set) => ({
  user: null, status: 'idle', error: null,
  fetchUser: async (id) => {
    set({ status: 'loading' });
    try {
      const user = await api.getUser(id);
      set({ user, status: 'succeeded' });
    } catch (e) {
      set({ error: e.message, status: 'failed' });
    }
  },
}));
```
For server data (caching, dedupe, refetching), prefer **React Query/SWR/RTK Query** — keep Zustand for client state.

### 13. How do you structure large stores? (Slices pattern)
Split into slice creators and combine them.
```js
const createAuthSlice = (set) => ({ user: null, login: (u) => set({ user: u }) });
const createCartSlice = (set) => ({ items: [], add: (i) => set((s) => ({ items: [...s.items, i] })) });

const useBoundStore = create((...a) => ({ ...createAuthSlice(...a), ...createCartSlice(...a) }));
```
Alternative: **multiple small stores per feature** (often simpler and better for performance isolation).

### 14. How do you type a Zustand store in TypeScript?
Use the curried form `create<T>()(...)` so middleware types infer correctly.
```ts
interface CounterState { count: number; inc: () => void }
const useCounter = create<CounterState>()(devtools((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
})));
```

---

## Part 4 — Architecture & Production Concerns

### 15. Best practices for using Zustand in a large app
1. **Always use selectors** — never subscribe to the whole store.
2. Expose **actions inside the store**; keep state minimal and normalized.
3. Export **custom hooks/selectors** (`useCartCount`) rather than the raw store everywhere.
4. Use `useShallow` for multi-value selection.
5. Separate **server state** (React Query) from **client state** (Zustand).
6. Use `devtools` in development; `persist` with `partialize`/`version`.
7. Keep stores per feature to avoid a "god store".

### 16. SSR / Next.js: what's the pitfall with Zustand?
A module-level store is a **singleton shared across all requests on the server**, which can leak one user's data into another's response. Fix: create a **store per request** with `createStore` and provide it via Context.

```js
const StoreContext = createContext(null);

function StoreProvider({ children, initialState }) {
  const ref = useRef(null);
  if (!ref.current) ref.current = createStore(() => ({ ...initialState }));   // vanilla store
  return <StoreContext value={ref.current}>{children}</StoreContext>;
}
const useAppStore = (selector) => useStore(useContext(StoreContext), selector);
```
Also handle hydration of persisted state to avoid server/client mismatch.

### 17. How do you test Zustand stores?
- Test actions directly with `getState()` / `setState()`.
- **Reset state between tests** (the store is global): capture the initial state and `setState(initial, true)` in `beforeEach`.
- For components, render and interact normally using React Testing Library.
```js
const initial = useStore.getState();
beforeEach(() => useStore.setState(initial, true));
```

---

## Part 5 — Trade-offs & Comparisons

### 18. Zustand vs Redux Toolkit
| Zustand | Redux Toolkit |
|---|---|
| Minimal API, tiny, no Provider | More structure/conventions |
| Flexible — few rules | Opinionated, consistent across big teams |
| Middleware set is small | Rich ecosystem: RTK Query, listener middleware, DevTools time-travel |
| No built-in data fetching/caching | RTK Query built in |
| Great for small–medium apps/features | Great for large teams/enterprise |
Choose Zustand for speed and simplicity; Redux when you need strict architecture, tooling, and standardization.

### 19. Zustand vs Context API
Context re-renders **every consumer** when the value changes and has no selectors. Zustand lets components subscribe to specific slices and works outside React. Context is fine for low-frequency values (theme, locale); Zustand for frequently changing shared state.

### 20. Zustand vs Jotai vs Recoil
- **Zustand**: one store, top-down, selectors.
- **Jotai**: atomic, bottom-up; derived atoms; fine-grained updates.
- **Recoil**: atom/selector model, but the project is no longer actively developed — avoid for new work.

### 21. What are the downsides/limitations of Zustand?
- Few enforced conventions → inconsistent codebases in big teams
- No built-in async/data caching
- Singleton store pitfalls with SSR/tests
- Easy to create a "god store" or subscribe to too much
- Time-travel/debugging less rich than Redux (though `devtools` helps)

### 22. "Explain how you've used Zustand." (Template answer)
> "I use Zustand for **client state** like UI preferences, cart, and filters, and keep **server state** in React Query. I define feature-scoped stores with actions inside the store and always consume them through **selectors** (with `useShallow` for multi-field picks) to avoid re-renders. I use `persist` with `partialize` and versioned migrations, `devtools` in development, and per-request stores for SSR. In tests I reset the store in `beforeEach`. Compared to Redux, it reduced boilerplate significantly while keeping data flow predictable."

*(Replace with a concrete project example and measurable outcome.)*

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Install/create | `create((set, get) => ({...}))` |
| `get()` | Read current state inside actions |
| Replace vs merge | `set(obj)` merges shallowly; `set(obj, true)` replaces |
| Shallow equality hook | `useShallow` from `zustand/react/shallow` |
| Vanilla store | `createStore` from `zustand/vanilla` |
| Subscribe outside React | `store.subscribe(listener)` |
| Common mistakes | Subscribing to whole store, returning new objects from selectors, persisting everything, shared singleton in SSR, mutating nested state without immer |
