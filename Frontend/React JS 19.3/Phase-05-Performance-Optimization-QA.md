# Phase 5 - Performance Optimization — Questions & Answers

### Q65. What is `React.memo`?
A higher-order component that skips re-rendering a function component if its props are shallow-equal to the previous ones.
```jsx
const Item = React.memo(function Item({ name }) { return <li>{name}</li>; });
```
Only helps if props are stable (use `useCallback`/`useMemo` for objects and functions).

### Q66. What is `PureComponent`?
A class component that implements `shouldComponentUpdate` with a **shallow comparison** of props and state. Class equivalent of `React.memo`.

### Q67. What is Memoization?
Caching the result of a computation for given inputs so it's not recomputed. In React: `useMemo`, `useCallback`, `React.memo` (or the React Compiler automatically).

### Q68. How to avoid unnecessary re-renders?
- `React.memo` for pure children
- `useCallback`/`useMemo` for stable props
- Move state **down** to the component that uses it
- Lift content **up** and pass as `children`
- Split context into smaller contexts
- Use selectors (Zustand/Redux) instead of whole-store subscriptions
- Use stable `key`s
- Enable the React Compiler

### Q69. What is Lazy Loading?
Loading code or resources only when needed, not on initial load.
```jsx
const Settings = React.lazy(() => import('./Settings'));
```

### Q70. What is Code Splitting?
Breaking the bundle into smaller chunks loaded on demand (per route/feature) so the initial load is smaller. Done via dynamic `import()`, `React.lazy`, and bundler support.

### Q71. What is Suspense?
Lets you declare a fallback UI while children are "waiting" (lazy components, `use(promise)`, framework data fetching).
```jsx
<Suspense fallback={<Spinner />}>
  <Settings />
</Suspense>
```

### Q72. Dynamic Imports
`import('./module')` returns a promise for the module at runtime, creating a separate chunk.
```js
const { default: Chart } = await import('./Chart');
```

### Q73. Virtualization
Rendering only the items visible in the viewport (plus a small buffer) instead of the whole list. Libraries: `react-window`, `react-virtualized`, `@tanstack/virtual`.

### Q74. Windowing
Same technique as virtualization — a "window" of visible rows is rendered and positioned as you scroll.
```jsx
<FixedSizeList height={400} itemCount={10000} itemSize={35} width="100%">
  {({ index, style }) => <div style={style}>Row {index}</div>}
</FixedSizeList>
```

### Q75. Debounce vs Throttle
- **Debounce**: run after the user *stops* triggering for N ms (search box).
- **Throttle**: run at most once every N ms while events continue (scroll, resize).
```js
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
```

### Q76. Large List Optimization
- Virtualize/window the list
- Paginate or infinite scroll
- Memoize row components (`React.memo`) with stable keys
- Avoid inline heavy computations per row
- Use `useDeferredValue`/transitions for filtering
- Keep row state local
