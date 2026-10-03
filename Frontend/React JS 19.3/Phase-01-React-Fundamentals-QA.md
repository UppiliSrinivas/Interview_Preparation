# Phase 1 - React Fundamentals — Questions & Answers

### Q1. What is React?
A JavaScript library (by Meta) for building user interfaces from small, reusable **components**. You describe *what* the UI should look like for a given state (declarative), and React updates the DOM efficiently.

### Q2. What are the major features of React?
- Component-based architecture
- JSX syntax
- Virtual DOM + efficient updates
- One-way data flow
- Hooks for state and side effects
- Declarative UI
- Large ecosystem (Router, Redux, Next.js, React Native)
- Server rendering / Server Components

### Q3. What is JSX?
A syntax extension that lets you write HTML-like markup inside JavaScript. It's compiled (by Babel/SWC) into function calls.
```jsx
const el = <h1 className="title">Hello</h1>;
// compiles to: jsx('h1', { className: 'title', children: 'Hello' })
```
Rules: one root element (or Fragment), `className` instead of `class`, close all tags, JS inside `{}`.

### Q4. Element vs Component?
- **Element**: a plain object describing what to render, e.g. `<div />` → `{ type: 'div', props: {} }`. Immutable and cheap.
- **Component**: a function/class that takes props and **returns** elements.
```jsx
const element = <Button />;        // element
function Button() { return <button>Hi</button>; } // component
```

### Q5. How to create components in React?
```jsx
// Function component (preferred)
function Welcome({ name }) { return <h1>Hello {name}</h1>; }

// Class component (legacy)
class Welcome extends React.Component {
  render() { return <h1>Hello {this.props.name}</h1>; }
}
```

### Q6. Functional vs Class Component
| | Functional | Class |
|---|---|---|
| Syntax | Plain function | `extends React.Component` |
| State | `useState` | `this.state` |
| Lifecycle | `useEffect` | `componentDidMount`, etc. |
| `this` | Not needed | Needed (binding issues) |
| Logic reuse | Custom hooks | HOCs / render props |
| Today | Standard | Legacy (still supported; needed for Error Boundaries) |

### Q7. What are Pure Functions?
Functions that always return the same output for the same input and cause **no side effects** (no mutation of outside data, no API calls). React components should be pure during render — side effects belong in event handlers or `useEffect`.
```js
const add = (a, b) => a + b;          // pure
let total = 0; const bad = x => (total += x); // impure
```

### Q8. What is State?
Data owned by a component that **changes over time** and triggers a re-render when updated.
```jsx
const [count, setCount] = useState(0);
```

### Q9. What are Props?
Read-only inputs passed from parent to child. A component must never modify its own props.
```jsx
<Greeting name="Nivas" />
function Greeting({ name }) { return <p>Hi {name}</p>; }
```

### Q10. Props vs State
| Props | State |
|---|---|
| Passed from parent | Owned by the component |
| Read-only | Mutable via setter |
| Change comes from parent | Change comes from within |
| Used to configure | Used to remember/track |

### Q11. Why should we not update state directly?
Mutating state (`state.count = 5`) doesn't tell React to re-render, breaks batching, and mutated objects defeat equality checks used by `memo`, `useEffect`, and `useMemo`.
```jsx
// ❌ user.name = 'A'; setUser(user);
// ✅ setUser({ ...user, name: 'A' });
```

### Q12. What is Conditional Rendering?
Showing different UI based on conditions.
```jsx
{isLoggedIn ? <Dashboard /> : <Login />}
{hasError && <ErrorMsg />}
if (loading) return <Spinner />;
```
Pitfall: `{count && <X />}` renders `0` when count is 0 — use `count > 0 &&`.

### Q13. What are Fragments?
Group multiple elements without adding an extra DOM node.
```jsx
<>
  <h1>Title</h1>
  <p>Text</p>
</>
```
Use `<Fragment key={id}>` when you need a key.

### Q14. Why are Keys important?
Keys give list items a stable identity so React can match old vs new items during diffing — avoiding wrong re-use, lost state, and unnecessary re-mounts.
```jsx
items.map(item => <li key={item.id}>{item.name}</li>)
```
Avoid array index as key when the list can reorder, insert, or delete.

### Q15. What is Component Composition?
Building complex UI by combining simple components, typically via `children` or props.
```jsx
function Card({ children }) { return <div className="card">{children}</div>; }
<Card><h2>Hi</h2></Card>
```

### Q16. What are Synthetic Events?
React's cross-browser wrapper around native events with the same interface (`onClick`, `e.preventDefault()`). Since React 17, events are attached at the root container; event pooling was removed in 17.

### Q17. What is Strict Mode?
`<StrictMode>` is a dev-only wrapper that highlights problems: double-invokes renders and effects to expose impure code and missing cleanups, and warns about deprecated APIs. No effect in production.

### Q18. What are Refs?
A way to hold a mutable value or reference a DOM node that **does not cause re-render** when changed.
```jsx
const inputRef = useRef(null);
<input ref={inputRef} />
<button onClick={() => inputRef.current.focus()}>Focus</button>
```

### Q20. What are Controlled Components?
Form inputs whose value is controlled by React state.
```jsx
const [name, setName] = useState('');
<input value={name} onChange={e => setName(e.target.value)} />
```
Good for validation and instant feedback.

### Q21. What are Uncontrolled Components?
Inputs whose value lives in the DOM; you read it via a ref (or `FormData`) when needed.
```jsx
const ref = useRef();
<input defaultValue="hi" ref={ref} />
// ref.current.value
```
Simpler and cheaper for basic forms.
