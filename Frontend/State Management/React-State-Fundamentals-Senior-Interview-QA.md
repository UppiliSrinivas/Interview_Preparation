# React State Fundamentals — Senior Frontend Interview Notes (Product Companies)

> Focus: **built-in state done right, React 19 actions, URL state, and choosing the right tool** — the questions asked *before* any library comes up.

---

## Part 1 — useState Done Right

### 1. Why use functional updates (`setCount(c => c + 1)`)?
`count` inside a handler is a **snapshot** from the render that created it. Multiple updates based on the snapshot overwrite each other; functional updates queue on the latest value.
```jsx
// ❌ ends at +1, not +3 — all three read the same snapshot
setCount(count + 1); setCount(count + 1); setCount(count + 1);

// ✅ ends at +3
setCount((c) => c + 1); setCount((c) => c + 1); setCount((c) => c + 1);
```
Rule: if the next state depends on the previous state, use the function form.

### 2. Is `setState` asynchronous? Why doesn't `console.log` show the new value?
Setting state **doesn't change the variable in the current render** — it schedules a re-render with the new value. The current function keeps its snapshot.
```jsx
function handleClick() {
  setName('Asha');
  console.log(name);   // still the old value — this render's snapshot
}
```
If you need the new value right away, compute it into a local variable first, then set it.

### 3. What is automatic batching?
React groups multiple state updates into **one re-render**. Since React 18 this happens everywhere — event handlers, promises, `setTimeout`, native listeners — not only in React events.
```jsx
setTimeout(() => {
  setA(1);
  setB(2);   // one re-render, not two (React 18+)
}, 0);
```
`flushSync(() => setA(1))` forces a synchronous update when you must read the DOM immediately (rare — e.g. scrolling to a just-added item).

### 4. What is a stale closure, and how do you fix it?
A function captures variables from the render it was created in. If it lives longer (interval, listener, memoized callback), it keeps reading **old values**.
```jsx
// ❌ always logs 0 — the interval closure captured the first render's count
useEffect(() => {
  const id = setInterval(() => console.log(count), 1000);
  return () => clearInterval(id);
}, []);
```
Fixes:
- **Functional updates** when the goal is to update state: `setCount(c => c + 1)`.
- **Correct dependencies** so the effect re-subscribes: `[count]`.
- **A ref holding the latest value** for long-lived callbacks:
```jsx
const countRef = useRef(count);
useEffect(() => { countRef.current = count; }, [count]);
// read countRef.current inside the interval
```
- React 19.2's `useEffectEvent` for reading latest values inside effects without re-subscribing.

### 5. Why must state be updated immutably?
React decides whether to re-render by comparing references with `Object.is`. Mutating an object keeps the same reference, so React may skip the update, and memoization (`memo`, `useMemo`, selectors) breaks.
```jsx
// ❌ mutation — same reference
user.name = 'Asha'; setUser(user);

// ✅ new object
setUser((u) => ({ ...u, name: 'Asha' }));
setItems((list) => list.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
setItems((list) => list.filter((i) => i.id !== id));
```
For deeply nested updates, use Immer (`useImmer`) or flatten the state shape.

### 6. What is lazy initial state?
Pass a function to compute the initial value **only on the first render**.
```jsx
// ❌ parses localStorage on every render
const [todos, setTodos] = useState(JSON.parse(localStorage.getItem('todos')) ?? []);

// ✅ runs once
const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('todos')) ?? []);
```

---

## Part 2 — useReducer

### 7. `useState` vs `useReducer` — when do you choose each?
| `useState` | `useReducer` |
|---|---|
| Independent, simple values | Several values that change together |
| Few update types | Many update types / complex transitions |
| Logic lives in handlers | Logic centralized and testable as a pure function |
| — | Next state depends on previous state in non-trivial ways |

```jsx
function reducer(state, action) {
  switch (action.type) {
    case 'fetch_start':   return { ...state, status: 'loading', error: null };
    case 'fetch_success': return { status: 'success', data: action.data, error: null };
    case 'fetch_error':   return { ...state, status: 'error', error: action.error };
    default: throw new Error(`Unknown action: ${action.type}`);
  }
}
const [state, dispatch] = useReducer(reducer, { status: 'idle', data: null, error: null });
```
Senior points: a reducer makes **impossible states impossible** (one `status` enum instead of `isLoading` + `isError` booleans that can both be true), and `dispatch` is stable — safe to pass down or into context.

---

## Part 3 — Where State Should Live

### 8. What is derived state, and why shouldn't you store it?
Anything computable from existing state or props should be **calculated during render**, not stored. Stored copies go out of sync.
```jsx
// ❌ duplicated state + effect to sync it
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);
useEffect(() => setTotal(items.reduce((s, i) => s + i.price, 0)), [items]);

// ✅ derive it
const total = items.reduce((s, i) => s + i.price, 0);
// expensive? wrap in useMemo — or let React Compiler memoize it
```
Also avoid copying props into state (`useState(props.value)`) — the state ignores later prop changes.

### 9. What does "lifting state up" mean?
When two siblings need the same data, move the state to their **closest common parent** and pass it down (value + setter/callback). Single source of truth.

### 10. What is state colocation?
Keep state **as close as possible** to where it's used. Global or high-level state re-renders more of the tree and is harder to reason about. Move state down when only one subtree needs it; lift it only when sharing requires it.

**Good answer:** "My default is local state. I lift it when siblings share it, use URL state for anything shareable, a query library for server data, and global stores only for truly app-wide client state."

### 11. How do you reset a component's state?
Change its **`key`**. React treats it as a new component instance and remounts it with fresh state.
```jsx
// switching users resets the form instead of showing stale input
<ProfileForm key={userId} userId={userId} />
```
This replaces the anti-pattern of a `useEffect` that resets state when a prop changes.

### 12. When should state go in a ref instead?
Use `useRef` for values that **must persist across renders but don't affect the UI**: timer IDs, previous values, DOM nodes, latest-callback refs, instance flags. Updating a ref doesn't re-render. If the UI must show it, it's state.

### 13. "You might not need an effect" — what are the common unnecessary effects?
- Syncing derived state (compute in render instead).
- Resetting state on prop change (use `key`).
- Handling user events in effects (do it in the event handler).
- Chains of effects triggering each other (compute the next state in one handler).
- Fetching data in effects without cleanup (use a query library or handle races with `AbortController`).

Effects are for **synchronizing with external systems** (subscriptions, DOM APIs, timers, network).

---

## Part 4 — React 19 Actions (Mutations Without a Library)

### 14. What are Actions in React 19?
Async functions run inside a **transition**. React tracks their pending state, errors, and optimistic updates automatically. You can pass them straight to `<form action={fn}>`.

### 15. How does `useTransition` handle async work?
`startTransition` now accepts async functions; `isPending` stays true until they finish, and updates inside stay non-blocking.
```jsx
const [isPending, startTransition] = useTransition();

function handleSave() {
  startTransition(async () => {
    const error = await updateName(name);
    if (error) setError(error);
  });
}
<button disabled={isPending}>{isPending ? 'Saving…' : 'Save'}</button>
```

### 16. How does `useActionState` work?
It wraps an action and gives you **the latest result, a form action, and the pending flag**. The action receives the previous state and the form data.
```jsx
import { useActionState } from 'react';

async function subscribe(prevState, formData) {
  const email = formData.get('email');
  const res = await api.subscribe(email);
  return res.ok ? { success: true } : { error: 'Subscription failed' };
}

function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribe, { error: null });
  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>Subscribe</button>
      {state.error && <p role="alert">{state.error}</p>}
      {state.success && <p>Subscribed!</p>}
    </form>
  );
}
```
Note: it replaced the earlier `useFormState` from `react-dom`.

### 17. How does `useOptimistic` work?
Shows an **optimistic value while an action is in flight**; it automatically reverts to the real state when the action finishes (success or failure).
```jsx
import { useOptimistic } from 'react';

function Messages({ messages, sendMessage }) {
  const [optimisticMessages, addOptimistic] = useOptimistic(
    messages,
    (current, newText) => [...current, { text: newText, sending: true }],
  );

  async function formAction(formData) {
    const text = formData.get('text');
    addOptimistic(text);          // instant UI
    await sendMessage(text);      // real update; parent state changes on success
  }

  return (
    <form action={formAction}>
      {optimisticMessages.map((m, i) => (
        <p key={i} style={{ opacity: m.sending ? 0.5 : 1 }}>{m.text}</p>
      ))}
      <input name="text" />
    </form>
  );
}
```
Must be called inside an action or transition.

### 18. What is `useFormStatus`?
From `react-dom`; lets a **child of a `<form>`** read the parent form's status (`pending`, `data`, `method`, `action`) — no prop drilling for submit buttons.
```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Saving…' : 'Save'}</button>;
}
```

### 19. React 19 actions vs React Hook Form vs TanStack Query mutations?
- **React 19 actions:** simple forms and mutations, progressive enhancement, Server Functions in Next.js.
- **React Hook Form + Zod:** complex client-side validation, dynamic fields, rich field-level UX.
- **TanStack Query mutations:** server state with caching, invalidation, retries, and shared optimistic updates across screens.

They combine well: RHF for the form, a mutation (or action) for submission.

---

## Part 5 — URL State

### 20. What state belongs in the URL?
Anything a user expects to **survive refresh, be shareable, or work with back/forward**: filters, search query, sort, pagination, selected tab, open item ID.
```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get('page') ?? 1);
  const sort = params.get('sort') ?? 'newest';

  const setSort = (value) =>
    setParams((p) => { p.set('sort', value); p.set('page', '1'); return p; });

  // feed page/sort into the query key: ['products', { page, sort }]
}
```
Senior points:
- URL params are strings — **parse and validate** them (e.g. with Zod) and handle bad values gracefully.
- Use `replace` for frequent updates (typing in search) to avoid flooding history; debounce writes.
- Libraries like **nuqs** give typed, `useState`-like URL state.
- URL state + query keys = shareable, cache-friendly views with no global store.

---

## Part 6 — Choosing the Right Tool

### 21. How do you decide where each piece of state lives?
| Kind of state | Example | Tool |
|---|---|---|
| Local UI | Modal open, input focus, hover | `useState` / `useReducer` |
| Form | Field values, validation, touched | React Hook Form (+ Zod) or React 19 actions |
| URL | Filters, page, sort, tab | Search params (React Router / nuqs) |
| Server | API data, cache, refetching | TanStack Query / RTK Query |
| Global client | Auth user, theme, cart, preferences | Context (low frequency) / Zustand / Redux Toolkit |
| Non-UI values | Timer IDs, previous values | `useRef` |

### 22. "How do you approach state management in a React app?" (Template answer)
> "I classify state before choosing tools. Local UI state stays in `useState` or `useReducer`, colocated with the component. Anything shareable via link — filters, pagination — goes in the URL. Server data lives in TanStack Query, never copied into a global store. Forms use React Hook Form with Zod. Only genuinely global client state — auth, theme, cart — goes into Context for low-frequency values or Zustand/Redux Toolkit when it updates often or needs selectors. I derive values instead of storing duplicates, and use `key` to reset state instead of effects. That keeps global state tiny and most bugs local."

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Functional update | `setX(prev => next)` when next depends on previous |
| Batching | Multiple updates → one render (everywhere since React 18) |
| Stale closure fix | Functional updates, correct deps, latest-value ref, `useEffectEvent` |
| Reset state | Change the `key` |
| Derived state | Compute during render; don't store |
| Ref vs state | Ref doesn't re-render; state does |
| `useActionState` returns | `[state, formAction, isPending]` |
| `useOptimistic` | Temporary UI value during an action; auto-reverts |
| `useFormStatus` | Child reads parent form's pending state (`react-dom`) |
| URL state for | Filters, sort, pagination, tabs — shareable views |
