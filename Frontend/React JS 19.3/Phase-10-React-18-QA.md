# Phase 10 - React 18+ — Questions & Answers

### Q126. React 18 Features
- `createRoot` (new root API)
- Concurrent rendering
- Automatic batching
- Transitions (`startTransition`, `useTransition`)
- `useDeferredValue`
- Suspense on the server (streaming SSR, selective hydration)
- New hooks: `useId`, `useSyncExternalStore`, `useInsertionEffect`
- Stricter Strict Mode

### Q127. Concurrent Rendering
React can interrupt, pause, and resume rendering so urgent updates (typing) aren't blocked by heavy ones. It's opt-in per update via transitions/deferred values.
```jsx
const [isPending, startTransition] = useTransition();
startTransition(() => setFilter(text));   // low priority
```

### Q128. Automatic Batching
Multiple state updates in the same tick (including inside promises/timeouts) result in a single re-render. Use `flushSync` to force immediate rendering.

### Q129. Suspense Improvements
- Works with streaming SSR: server sends HTML in chunks.
- **Selective hydration**: hydrates parts as they load and prioritizes what the user interacts with.
- Works with transitions so already-visible content isn't replaced by a fallback.

### Q130. New JSX Transform
Introduced in React 17: no need to `import React` in each file. The compiler imports `jsx` from `react/jsx-runtime` automatically, giving slightly smaller bundles.
```jsx
// no `import React from 'react'` needed
function App() { return <h1>Hi</h1>; }
```

### Q131. Strict Mode Double Rendering
In development, React 18 renders components twice and mounts → unmounts → remounts effects once to surface impure renders and missing cleanups. Doesn't happen in production. Fix by making renders pure and writing proper cleanup functions.

### Q132. Future of React
Direction: async-first APIs (Actions, `use`), Server Components, the React Compiler (automatic memoization), and richer UX primitives like View Transitions and `Activity`. See Phase 11 for React 19/19.3.
