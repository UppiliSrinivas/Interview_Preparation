# Phase 6 - Advanced React — Questions & Answers

### Q77. What are Higher Order Components (HOC)?
A function that takes a component and returns a new component with extra behavior.
```jsx
const withAuth = (Comp) => (props) => isLoggedIn() ? <Comp {...props} /> : <Login />;
const ProtectedPage = withAuth(Page);
```
Mostly replaced by custom hooks; still seen in older codebases (`connect`, `withRouter`).

### Q78. Render Props
A component takes a function prop that returns UI, sharing logic through it.
```jsx
<MouseTracker render={({ x, y }) => <p>{x}, {y}</p>} />
```
Also replaced mostly by hooks.

### Q79. Context API
Shares values across the tree without passing props manually.
```jsx
const ThemeContext = createContext('light');
<ThemeContext value="dark"><App /></ThemeContext>   // React 19 (older: ThemeContext.Provider)
const theme = useContext(ThemeContext);
```

### Q80. Prop Drilling
Passing props through many intermediate components that don't need them. Fix with Context, composition (`children`), or a state library.

### Q81. Context vs Props
- **Props**: explicit, easy to trace, best for direct parent→child data.
- **Context**: implicit, for truly global/shared data (theme, auth, locale). Every consumer re-renders when the value changes.

### Q82. What are Portals?
Render children into a DOM node outside the parent hierarchy (while keeping React tree/event bubbling). Used for modals, tooltips, dropdowns.
```jsx
createPortal(<Modal />, document.body);
```

### Q83. Compound Components
Components that work together sharing implicit state (like `<select>` + `<option>`), usually via Context.
```jsx
<Tabs>
  <Tabs.List><Tabs.Tab id="a">A</Tabs.Tab></Tabs.List>
  <Tabs.Panel id="a">Content</Tabs.Panel>
</Tabs>
```
Gives flexible, readable APIs for design systems.

### Q85. `useImperativeHandle`
Customizes what a parent gets through a `ref`, exposing only specific methods instead of the whole DOM node.
```jsx
function Input({ ref }) {          // React 19: ref is a prop
  const inner = useRef();
  useImperativeHandle(ref, () => ({ focus: () => inner.current.focus() }));
  return <input ref={inner} />;
}
```
Use sparingly — prefer declarative props.

### Q86. What are React Patterns?
Reusable solutions to common design problems: composition, container/presentational, custom hooks, HOC, render props, compound components, controlled/uncontrolled, state reducer, provider pattern.

### Q87. Why Composition over Inheritance?
React components are customized by **containment** (`children`) and props rather than extending classes. It's more flexible, avoids deep class hierarchies, and keeps behavior explicit.

### Q88. What are Web Components?
Browser-native custom elements (Custom Elements, Shadow DOM, HTML Templates). They're framework-agnostic. React can use them (React 19 has full custom element support) and can wrap React components as custom elements.

### Q89. What are React Server Components?
Components that run only on the server, sending rendered output (not their JS) to the client — smaller bundles, direct data access. Interactive parts are marked `'use client'`.

### Q90. What is Hydration?
Attaching event handlers and React state to server-rendered HTML in the browser so it becomes interactive. Server and client output must match, otherwise you get a hydration mismatch.
```jsx
hydrateRoot(document.getElementById('root'), <App />);
```

### Q91. SSR vs CSR
| CSR | SSR |
|---|---|
| Browser renders from JS | Server sends ready HTML |
| Slow first paint, good for dashboards | Fast first paint, better SEO |
| Cheap server | More server work |
| Needs JS to show anything | Needs hydration to become interactive |

### Q92. What is Streaming SSR?
The server sends HTML in chunks as parts become ready (using `<Suspense>` boundaries) instead of waiting for the whole page — faster time-to-first-byte and progressive loading, plus selective hydration.
