# Phase 4 - Component Lifecycle — Questions & Answers

### Q54. Lifecycle Methods Overview
Class components have methods that run at specific points: **mounting** (constructor, render, componentDidMount), **updating** (shouldComponentUpdate, render, componentDidUpdate), **unmounting** (componentWillUnmount), plus error handling (`componentDidCatch`, `getDerivedStateFromError`).

### Q55. Mounting Phase
Component is created and inserted into the DOM.
Order: `constructor` → `getDerivedStateFromProps` → `render` → `componentDidMount`.

### Q56. Updating Phase
Triggered by prop/state change or `forceUpdate`.
Order: `getDerivedStateFromProps` → `shouldComponentUpdate` → `render` → `getSnapshotBeforeUpdate` → `componentDidUpdate`.

### Q57. Unmounting Phase
Component is removed from the DOM. Only `componentWillUnmount` runs — use it for cleanup.

### Q58. componentDidMount
Runs once after the first render. Used for API calls, subscriptions, timers, DOM measurements.
```jsx
componentDidMount() { fetchUser().then(u => this.setState({ user: u })); }
```

### Q59. componentDidUpdate
Runs after every update (not the initial render). Compare previous props/state to avoid loops.
```jsx
componentDidUpdate(prevProps) {
  if (prevProps.id !== this.props.id) this.load(this.props.id);
}
```

### Q60. componentWillUnmount
Runs right before removal. Clear timers, cancel requests, remove listeners.
```jsx
componentWillUnmount() { clearInterval(this.timer); }
```

### Q61. Lifecycle in Functional Components
`useEffect` covers all three:
```jsx
useEffect(() => { /* didMount */ return () => { /* willUnmount */ }; }, []);
useEffect(() => { /* didUpdate for id */ }, [id]);
```

### Q62. What are Error Boundaries?
Class components that catch errors in their child tree during rendering, lifecycle methods, and constructors, and show a fallback UI instead of crashing the whole app.
```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logError(error, info); }
  render() { return this.state.hasError ? <h1>Something went wrong</h1> : this.props.children; }
}
```

### Q63. componentDidCatch
Called after a descendant throws; receives `(error, info)`. Use it for **logging/reporting** (e.g., Sentry). Use `getDerivedStateFromError` to update state for the fallback UI.

### Q64. Error Boundary Limitations
They do **not** catch errors in:
- Event handlers (use try/catch)
- Async code (`setTimeout`, promises)
- Server-side rendering
- Errors thrown in the boundary itself

Also, there's no hook equivalent — it must be a class (or use `react-error-boundary`).
