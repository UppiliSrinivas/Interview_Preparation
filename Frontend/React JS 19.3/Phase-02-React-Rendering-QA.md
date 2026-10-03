# Phase 2 - React Rendering — Questions & Answers

### Q22. What is Virtual DOM?
A lightweight JavaScript object tree that represents the UI. React keeps it in memory and uses it to figure out the minimum real-DOM changes needed.

### Q23. How does Virtual DOM work?
1. State/props change → React **renders** the component to a new virtual tree.
2. It **diffs** the new tree against the previous one.
3. It **patches** only the changed nodes in the real DOM.

### Q24. Real DOM vs Virtual DOM
| Real DOM | Virtual DOM |
|---|---|
| Browser's actual tree | JS object copy |
| Updates are expensive (layout/paint) | Updates are cheap (plain objects) |
| Direct manipulation | React batches and applies minimal changes |

### Q25. What is Reconciliation?
The process React uses to compare the previous and next element trees and decide what to update in the DOM.

### Q26. What is the Diffing Algorithm?
React uses heuristics to make diffing O(n):
- Elements of **different types** → destroy old subtree, build new.
- Same type → keep the node, update changed props, recurse into children.
- Lists use **keys** to match items between renders.

### Q27. What causes a component to re-render?
- Its own state changes
- Its parent re-renders (even if props are identical, unless memoized)
- A context it consumes changes
- A hook it uses (e.g., `useReducer`, external store) updates

Changing props alone doesn't trigger it — the parent re-rendering does.

### Q28. How does React update the UI?
Trigger (state change) → **Render phase** (compute new tree) → **Commit phase** (apply DOM changes, run layout effects, then effects).

### Q29. Render Phase vs Commit Phase
| Render | Commit |
|---|---|
| Calls components, builds new tree | Applies changes to DOM |
| Pure; can be paused/restarted/discarded | Synchronous, can't be interrupted |
| No side effects allowed | `useLayoutEffect`, then `useEffect` run |

### Q30. What is React Fiber?
The reimplemented reconciler (React 16). Each element becomes a **fiber** node (a unit of work). Work can be split into chunks, paused, prioritized, and resumed — the foundation for concurrent features.

### Q31. What is Concurrent Rendering?
React can prepare multiple versions of the UI and interrupt low-priority rendering to handle urgent updates (typing, clicks). Enabled via `createRoot` and used by `startTransition`, `useDeferredValue`, and Suspense.

### Q32. What is Automatic Batching?
React 18 groups multiple state updates into **one re-render**, even inside promises, `setTimeout`, and native event handlers (React 17 only batched inside React events).
```js
setTimeout(() => { setA(1); setB(2); }, 0); // one render in React 18
```
Opt out with `flushSync`.

### Q33. How do state updates work internally?
`setState` doesn't change the value immediately. It enqueues an update on the component's fiber, schedules a render, and during that render React processes the queue to compute the new state.

### Q34. What happens when `setState`/`useState` is called?
1. Update is queued and a re-render is scheduled (batched).
2. React re-renders the component with the new value.
3. If the new value is `Object.is`-equal to the old one, React bails out.
4. Otherwise children re-render, diff happens, DOM is patched, effects run.
