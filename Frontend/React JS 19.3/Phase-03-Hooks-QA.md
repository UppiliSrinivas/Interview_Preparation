# Phase 3 - Hooks — Questions & Answers

### Q35. What are Hooks?
Functions (names start with `use`) that let function components use state, lifecycle behavior, context, refs, etc. Examples: `useState`, `useEffect`, `useRef`.

### Q36. Why were Hooks introduced?
- Reuse stateful logic without HOCs/render props (custom hooks)
- Avoid huge class components with scattered lifecycle logic
- Remove `this` binding confusion
- Easier to optimize and compile

### Q37. Rules of Hooks
1. Call hooks only at the **top level** — not in loops, conditions, or nested functions.
2. Call hooks only from **function components or custom hooks**.

React tracks hooks by call order, so the order must be identical every render. (`use()` is the exception — it can be called conditionally.)

### Q38. What is `useState`?
Adds local state to a component.
```jsx
const [count, setCount] = useState(0);
<button onClick={() => setCount(count + 1)}>{count}</button>
```
Lazy init for expensive values: `useState(() => compute())`.

### Q39. Why is `useState` asynchronous?
Updates are **batched** and applied on the next render, so `count` inside the current render is a snapshot and doesn't change right after `setCount`.
```jsx
setCount(count + 1);
console.log(count); // still the old value
```

### Q40. Functional State Updates
Use when the new state depends on the previous state — avoids stale values.
```jsx
setCount(c => c + 1);
setCount(c => c + 1); // results in +2
// vs setCount(count + 1) twice → only +1
```

### Q41. What is `useEffect`?
Runs side effects (fetching, subscriptions, timers, DOM sync) **after** render/paint.
```jsx
useEffect(() => {
  document.title = `Count: ${count}`;
}, [count]);
```

### Q42. Dependency Array
Controls when the effect re-runs.
- `[]` → once after mount
- `[a, b]` → when `a` or `b` change
- omitted → after every render

Include every reactive value the effect uses (lint rule `exhaustive-deps`).

### Q43. Cleanup Function
Returned function that runs before the effect re-runs and on unmount — used to unsubscribe, clear timers, abort requests.
```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id);
}, []);
```

### Q44. Infinite Loop in useEffect
Happens when the effect updates state that's in its own dependencies, or a dependency is a new object/function every render.
```jsx
// ❌ loops
useEffect(() => { setData([...data, 1]); }, [data]);
// ✅ fix: functional update / correct deps / memoize deps
```

### Q45. What is `useRef`?
Returns a stable `{ current }` object that persists across renders. Used for DOM access and mutable values (timer IDs, previous values). Changing it does **not** re-render.

### Q46. `useRef` vs `useState`
| useRef | useState |
|---|---|
| Doesn't trigger re-render | Triggers re-render |
| Mutable `.current` | Updated via setter |
| For DOM nodes, timers, previous values | For UI-visible data |

### Q47. What is `useMemo`?
Caches an expensive **computed value** until dependencies change.
```jsx
const sorted = useMemo(() => items.sort(cmp), [items]);
```
Use for expensive calculations or stable object references — not everywhere.

### Q48. What is `useCallback`?
Caches a **function reference** between renders.
```jsx
const onSave = useCallback(() => save(id), [id]);
```
Useful when passing callbacks to memoized children or effect dependencies.

### Q49. `useMemo` vs `useCallback`
`useMemo(fn, deps)` caches the **result** of `fn`. `useCallback(fn, deps)` caches `fn` **itself**. `useCallback(fn, d)` ≈ `useMemo(() => fn, d)`.

### Q50. What is `useContext`?
Reads the nearest value of a Context without prop drilling.
```jsx
const theme = useContext(ThemeContext);
```
Any component using it re-renders when the context value changes.

### Q51. What is `useReducer`?
State management via a reducer `(state, action) => newState` — better for complex or related state transitions.
```jsx
const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'inc' });
```

### Q52. What are Custom Hooks?
Your own functions starting with `use` that combine built-in hooks to reuse logic.
```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(o => !o), []);
  return [on, toggle];
}
```

### Q53. `useEffect` vs `useLayoutEffect`
| useEffect | useLayoutEffect |
|---|---|
| Runs after paint (async) | Runs after DOM update, **before paint** (sync) |
| Default choice | Measuring layout, preventing flicker |
| Doesn't block painting | Blocks painting if slow |
