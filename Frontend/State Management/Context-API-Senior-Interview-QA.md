# React Context API — Senior Frontend Interview Notes (Product Companies)

> Focus: **how it re-renders, performance patterns, when it's the wrong tool, and architecture trade-offs.**

---

## Part 1 — Core Concepts

### 1. What is the Context API and what problem does it solve?
It lets a parent make a value available to **any descendant** without passing props through every level (**prop drilling**). Best for values many components need: theme, locale, auth user, feature flags.

```jsx
const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={{ theme, setTheme }}>   {/* React 19; older: <ThemeContext.Provider> */}
      <Page />
    </ThemeContext>
  );
}

function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

### 2. How does Context work? What triggers consumers to re-render?
When the Provider's `value` changes (compared with **`Object.is`**), **every component that calls `useContext` for that context re-renders** — even if it only uses a part of the value. React searches up the tree for the nearest Provider; if none exists, it uses the **default value** passed to `createContext`.

### 3. What is the default value for?
Used **only when there is no matching Provider above** the component. It's mainly for tests/standalone components. In most apps, pass `undefined`/`null` and throw an error in a custom hook if the Provider is missing.

### 4. What is `use(Context)` in React 19?
`use(ThemeContext)` reads context like `useContext`, but it **can be called conditionally** (after early returns, inside `if`).
```jsx
function Panel({ show }) {
  if (!show) return null;
  const theme = use(ThemeContext);   // allowed
  return <div className={theme}>...</div>;
}
```

### 5. What's the recommended pattern for creating and consuming context?
Wrap it in a custom hook that guards against a missing Provider.
```jsx
const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, login: setUser, logout: () => setUser(null) }), [user]);
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

---

## Part 2 — Performance (Most Asked)

### 6. Why is Context considered a performance problem?
- **No selectors**: consumers can't subscribe to a slice — any change to `value` re-renders all consumers.
- A new object in `value={{ a, b }}` is created every render → **all consumers re-render whenever the Provider re-renders**, even if `a` and `b` didn't change.
- `React.memo` on a consumer doesn't help — context updates bypass memo.

### 7. How do you optimize Context performance?
1. **Memoize the value** with `useMemo` (and functions with `useCallback`).
2. **Split contexts** by concern and update frequency (`UserContext`, `ThemeContext`).
3. **Separate state and dispatch** contexts (dispatch is stable).
4. **Move state down** — keep Providers close to the components that need them.
5. Use the **`children` pattern** so non-consumers aren't re-rendered by the Provider's state change.
6. For fine-grained subscriptions, use a library like **`use-context-selector`**, or switch to Zustand/Redux.

```jsx
// ❌ new object every render
<Ctx value={{ user, setUser }}>

// ✅ memoized
const value = useMemo(() => ({ user, setUser }), [user]);
<Ctx value={value}>
```

### 8. Split state and dispatch contexts — why and how?
Components that only **dispatch** don't re-render when state changes, since the dispatch function is stable.
```jsx
const StateCtx = createContext();
const DispatchCtx = createContext();

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DispatchCtx value={dispatch}>
      <StateCtx value={state}>{children}</StateCtx>
    </DispatchCtx>
  );
}
```

### 9. The `children` pattern — how does it avoid re-renders?
`children` is created by the parent that renders `<Provider>`, so when the Provider's own state changes, the `children` element reference is unchanged and React skips re-rendering those subtrees (unless they consume the context).
```jsx
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');   // state change here...
  return <ThemeContext value={theme}>{children}</ThemeContext>; // ...doesn't re-render `children` that don't consume it
}
```

### 10. Does the React Compiler fix Context re-renders?
It automatically memoizes components and values (reducing wasted re-renders from unstable props/values), but it **doesn't change context semantics** — consumers still re-render when the context value changes. You still need to design contexts well.

---

## Part 3 — Patterns & Architecture

### 11. Context vs prop drilling vs composition — how do you decide?
- **Props**: direct parent → child, explicit and easy to trace.
- **Composition** (`children`/slots): often removes drilling without context.
- **Context**: truly cross-cutting data used at many depths.
Try composition first; reach for context when many distant components need the same data.

### 12. What should (and shouldn't) go into Context?
| Good fit | Poor fit |
|---|---|
| Theme, locale/i18n | Frequently changing values (mouse position, form typing, timers) |
| Current user/auth | Large server-data caches |
| Feature flags, config | Complex state with many consumers needing slices |
| Dependency injection (services, router) | Anything needing middleware/devtools/time-travel |

### 13. How do you manage complex state with Context?
Combine with **`useReducer`** for predictable updates, expose via custom hooks, and split by domain.
```jsx
function cartReducer(state, action) {
  switch (action.type) {
    case 'add': return { ...state, items: [...state.items, action.item] };
    default: return state;
  }
}
```
If many consumers need different slices or updates are frequent, move to Zustand/Redux Toolkit.

### 14. What is "provider hell" and how do you handle it?
Deeply nested Providers at the app root.
```jsx
<A><B><C><D><App /></D></C></B></A>
```
Mitigate by composing them in one `AppProviders` component (or a `composeProviders` helper), keeping providers **scoped** to the subtree that needs them, and consolidating related contexts.

### 15. How does Context work with Server Components (React 19 / Next.js)?
- Server Components **can't create** context or use hooks.
- Context lives in **Client Components** (`'use client'`). A client Provider can wrap server-rendered `children`.
- In React 19.3, Server Components can **render** a context provider directly by importing the context from a `'use client'` module (no wrapper Provider component needed).
```jsx
// user-context.js
'use client';
export const UserContext = createContext(null);

// layout.js (Server Component)
import { UserContext } from './user-context';
export default async function Layout({ children }) {
  const user = await getUser();
  return <UserContext value={user}>{children}</UserContext>;
}
```

### 16. How do you test components that use Context?
Wrap with the Provider in a custom render helper, or provide a mock value.
```jsx
const renderWithTheme = (ui, theme = 'dark') =>
  render(<ThemeContext value={theme}>{ui}</ThemeContext>);
```
Also test that the custom hook throws outside its Provider.

---

## Part 4 — Trade-offs & Comparisons

### 17. Context vs Redux Toolkit
| Context | Redux Toolkit |
|---|---|
| Built into React, no dependency | External library |
| Dependency-injection/low-frequency state | Complex, large-scale state |
| No selectors → re-renders all consumers | Selector-based fine-grained updates |
| No middleware/devtools | Middleware, DevTools, RTK Query |

### 18. Context vs Zustand
Zustand needs no Provider, supports selectors (components re-render only for the slice they use), and works outside React. Context is fine for stable values; Zustand wins for frequently updated shared state.

### 19. Is Context a state management tool?
**No** — it's a **transport mechanism** (dependency injection) for values. State still comes from `useState`/`useReducer`; Context just makes it available deeply. This distinction is a common senior-level interview point.

### 20. Common mistakes with Context
- Passing a new object/array/function in `value` each render
- One giant context for everything (all consumers re-render on any change)
- Putting rapidly changing state in context
- Forgetting a Provider (silent default value) — guard with a custom hook
- Using Context where props or composition would be simpler
- Mutating the context value instead of updating state

### 21. "Explain how you've used Context." (Template answer)
> "I use Context for **low-frequency, cross-cutting values** — auth user, theme, locale, and feature flags. I wrap each context in a custom hook that throws outside its Provider, **memoize the value**, and **split state and dispatch** contexts so components that only trigger actions don't re-render. I scope Providers to the subtree that needs them and use the `children` pattern to limit re-renders. For frequently changing or complex shared state I moved to **Zustand/Redux Toolkit**, and server data lives in React Query."

*(Replace with a concrete project example and measurable outcome.)*

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Create context | `createContext(defaultValue)` |
| Provide | `<Ctx value={...}>` (React 19) / `<Ctx.Provider value={...}>` |
| Consume | `useContext(Ctx)` or `use(Ctx)` (can be conditional) |
| Re-render trigger | Provider `value` changes by `Object.is` |
| Does `memo` stop it? | No — context changes bypass `React.memo` |
| Best optimization | Memoize value, split contexts, separate state/dispatch |
| Avoid for | High-frequency updates and complex global state |
