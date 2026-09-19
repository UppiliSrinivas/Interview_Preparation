
# React.js Interview Study Guide (High-Priority & Core Concepts)

This guide covers the most critical questions from the 395-question roadmap. It focuses on the concepts that are almost guaranteed to be asked in a Senior Associate/Lead interview, especially for a role like the PwC Senior Associate position you are targeting.

---

## Phase 1: React Fundamentals

### Q4. What is the difference between Element and Component?
- **Element:** A plain JavaScript object describing what you want to see on the screen. It is immutable. Example: `{ type: 'button', props: { className: 'btn' } }`.
- **Component:** A function or class that accepts props and returns a React Element. It is a reusable blueprint. Example: `function Button(props) { return <button {...props} /> }`.

### Q10. Difference between Props and State
| Feature | Props | State |
| :--- | :--- | :--- |
| **Mutability** | Immutable (read-only) | Mutable (can be changed) |
| **Ownership** | Passed from parent | Owned by the component itself |
| **Purpose** | Configure a component | Manage internal data that changes over time |
| **Updates** | Parent re-renders to change props | `setState` or `useState` triggers re-render |

### Q14. Why are Keys important?
Keys help React identify which items in a list have changed, been added, or been removed. They give elements a stable identity.
- **Without Keys:** React re-renders the entire list.
- **With Keys:** React only updates the specific item that changed.
- **Best Practice:** Use a unique, stable ID (e.g., `user.id`). Avoid using array indices as keys if the list can be reordered.

### Q18. What are Refs?
Refs (References) provide a way to access DOM nodes or React elements directly. They are used for:
1. Managing focus, text selection, or media playback.
2. Triggering imperative animations.
3. Integrating with third-party DOM libraries.
- **Example:** `const inputRef = useRef(null); <input ref={inputRef} />`

### Q20. What are Controlled Components?
A component where the form data is handled by React state. The input's value is controlled by React, and changes are handled via `onChange`.
```jsx
const [value, setValue] = useState("");
return <input value={value} onChange={(e) => setValue(e.target.value)} />;
```

---

## Phase 2: React Rendering (CRITICAL)

### Q22. What is Virtual DOM?
A lightweight, in-memory representation of the Real DOM. React keeps a tree of these objects. When state changes, React creates a new Virtual DOM tree, compares it with the previous one (Diffing), and calculates the minimum number of changes needed to update the Real DOM.

### Q25. What is Reconciliation?
The process React uses to compare the new Virtual DOM with the previous one and determine what changes need to be made to the Real DOM. This is the algorithm behind React's performance.

### Q26. What is the Diffing Algorithm?
The heuristic algorithm used during Reconciliation. Key rules:
1. Two elements of different types will produce different trees (React will tear down the old tree and build a new one).
2. The developer can hint at which child elements are stable across renders using a `key` prop.

### Q27. What causes a component to re-render?
1. **State Change:** `useState` or `useReducer` setter is called.
2. **Parent Re-render:** A parent component re-renders, causing all its children to re-render (unless memoized).
3. **Context Change:** A value in a `useContext` provider changes.

### Q30. What is React Fiber?
React Fiber is the reimplementation of React's core algorithm (introduced in React 16). It allows React to:
- **Pause, abort, or reuse work** (Concurrent Rendering).
- **Assign priority** to different types of updates (e.g., animations vs. data fetching).
- **Split rendering work into chunks** to avoid blocking the main thread.

### Q32. What is Automatic Batching? (React 18+)
React 18 automatically batches all state updates, even inside promises, setTimeout, and native event handlers. This means multiple `setState` calls result in a single re-render.
```jsx
// React 18: Only 1 re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
```

---

## Phase 3: Hooks (MOST IMPORTANT)

### Q37. Rules of Hooks
1. **Only call Hooks at the top level.** Don't call them inside loops, conditions, or nested functions.
2. **Only call Hooks from React function components** or custom Hooks.

### Q39. Why is useState asynchronous?
State updates are asynchronous and batched for performance reasons. React doesn't update the state immediately; it schedules a re-render. This is why you cannot read the updated state immediately after calling the setter.

### Q40. Functional State Updates
When the new state depends on the previous state, always use the functional form:
```jsx
// Bad (can cause stale state)
setCount(count + 1);

// Good
setCount(prevCount => prevCount + 1);
```

### Q42. Dependency Array in useEffect
- **Empty `[]`:** Runs only once after the initial render (like `componentDidMount`).
- **With dependencies `[a, b]`:** Runs after the initial render AND whenever `a` or `b` changes.
- **No array:** Runs after EVERY render (usually a bug).

### Q43. Cleanup Function in useEffect
A function returned from `useEffect` that runs before the component unmounts or before the next effect runs. Used to cancel subscriptions, timers, or API calls.
```jsx
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer); // Cleanup
}, []);
```

### Q49. useMemo vs useCallback
- **useMemo:** Returns a **memoized value**. Used for expensive calculations.
- **useCallback:** Returns a **memoized function**. Used to prevent unnecessary re-renders of child components that rely on reference equality.
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

### Q53. useEffect vs useLayoutEffect
- **useEffect:** Runs **asynchronously** after the browser has painted the screen. Non-blocking.
- **useLayoutEffect:** Runs **synchronously** after DOM mutations but **before** the browser paints. Used for measuring DOM elements (e.g., tooltips) to prevent flickering.

---

## Phase 5: Performance Optimization

### Q65. What is React.memo?
A Higher Order Component (HOC) that memoizes a functional component. It only re-renders if its props have changed (shallow comparison).
```jsx
const MyComponent = React.memo(function MyComponent(props) {
  /* only re-renders if props change */
});
```

### Q69. What is Lazy Loading?
Loading components only when they are needed, rather than in the initial bundle. Used with `React.lazy` and `Suspense`.
```jsx
const OtherComponent = React.lazy(() => import('./OtherComponent'));
```

### Q75. Debounce vs Throttle
- **Debounce:** Delays the function execution until after a specified time has passed since the last call. (e.g., Search bar input).
- **Throttle:** Ensures the function is called at most once in a specified time period. (e.g., Scroll events).

---

## Phase 6: Advanced React

### Q77. What are Higher Order Components (HOC)?
A function that takes a component and returns a new component with additional props or behavior.
```jsx
const withAuth = (WrappedComponent) => {
  return (props) => {
    const isAuthenticated = useAuth();
    return isAuthenticated ? <WrappedComponent {...props} /> : <Login />;
  };
};
```

### Q79. Context API
A way to share values (like theme, user auth) between components without passing props manually at every level (Prop Drilling).
```jsx
const ThemeContext = React.createContext('light');
// Provider
<ThemeContext.Provider value="dark"> <App /> </ThemeContext.Provider>
// Consumer
const theme = useContext(ThemeContext);
```

### Q82. What are Portals?
A way to render children into a DOM node that exists outside the parent component's DOM hierarchy. Used for Modals, Tooltips, and Toasts.
```jsx
ReactDOM.createPortal(<Modal />, document.getElementById('modal-root'));
```

### Q90. What is Hydration?
In SSR (Server-Side Rendering), the server sends static HTML. The browser displays it, and then React "hydrates" it by attaching event listeners and making it interactive.

---

## Phase 7: State Management

### Q95. Redux Fundamentals
- **Store:** The single source of truth holding the entire state.
- **Actions:** Plain objects describing what happened (`{ type: 'ADD_TODO', payload: 'Buy milk' }`).
- **Reducers:** Pure functions that take the current state and an action, and return a new state.
- **Dispatch:** The method used to send actions to the store.

### Q103. Redux Toolkit (RTK)
The modern, official way to write Redux. It reduces boilerplate by using `createSlice` (which combines actions and reducers) and `configureStore`.

### Q106. Zustand vs Redux
- **Zustand:** Minimalist, less boilerplate, hooks-based, no Provider needed. Great for small-to-medium apps.
- **Redux:** More structured, powerful middleware ecosystem (Thunk, Saga), excellent DevTools. Better for large, complex enterprise apps.

---

## Phase 12: Build Tools (Important for PwC JD)

### Q206. What is Tree Shaking?
A form of dead-code elimination. Bundlers like Webpack and Vite analyze your imports and remove any code that is not actually used. This reduces bundle size.
- **Requirement:** Must use ES Modules (`import`/`export`), not CommonJS (`require`).

### Q207. What is Code Splitting?
Splitting your code into smaller chunks that can be loaded on demand. Used with `React.lazy` and dynamic `import()`.

### Q212. Why is Vite faster than Webpack?
- **Webpack:** Bundles the entire application before starting the dev server.
- **Vite:** Uses Native ES Modules (ESM) during development. It doesn't bundle; it serves files directly to the browser. It uses esbuild (written in Go) for pre-bundling dependencies, which is 10-100x faster than JavaScript-based bundlers.

### Q216. What is HMR (Hot Module Replacement)?
A feature that allows you to update modules in the browser without a full page reload. Preserves application state (like form inputs) during development.

### Q227. What is Babel?
A JavaScript compiler that converts modern JavaScript (ES6+) and JSX into backwards-compatible JavaScript that older browsers can understand.

You are absolutely right. Phases 8, 9, 10, and 11 were missing from the previous guide. Here is the complete Markdown content for those phases. You can append this directly to your existing `React_Interview_Study_Guide.md` file.


---

## Phase 8: React Router

### Q107. What is React Router?
React Router is the standard routing library for React. It enables navigation between different views (components) in a Single Page Application (SPA) without triggering a full page reload. It maps URL paths to specific components.

### Q108. BrowserRouter vs HashRouter
- **BrowserRouter:** Uses the HTML5 History API (`pushState`, `replaceState`) to keep your UI in sync with the URL. It requires server-side configuration to serve `index.html` for all routes. Clean URLs (e.g., `example.com/about`).
- **HashRouter:** Uses the hash portion of the URL (`window.location.hash`). No server configuration needed. URLs look like `example.com/#/about`. Used for legacy browsers or static hosting.

### Q109 & Q110. Route vs Routes
- **`<Routes>`:** The parent component that wraps all your `<Route>` components. It replaces the old `<Switch>` from React Router v5. It looks through all its children `<Route>` elements and renders the first one that matches the current URL.
- **`<Route>`:** A component that defines a mapping between a URL path and a React component.
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
</Routes>
```

### Q111. Link vs NavLink
- **`<Link>`:** Used for navigation. Renders an `<a>` tag. Does not trigger a page reload.
- **`<NavLink>`:** A special version of `<Link>` that adds styling attributes (like `activeClassName` or a style function) when the current URL matches its `to` prop. Used for navigation menus.
```jsx
<NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""}>
  About
</NavLink>
```

### Q112. useNavigate
A hook introduced in React Router v6 that gives you a function to navigate programmatically.
```jsx
const navigate = useNavigate();
const handleClick = () => {
  navigate('/dashboard'); // Navigate to dashboard
  navigate(-1); // Go back
};
```

### Q113. Dynamic Routes
Routes that accept URL parameters. Defined using a colon (`:`).
```jsx
<Route path="/user/:userId" element={<UserProfile />} />
// Accessing the parameter:
const { userId } = useParams();
```

### Q114. Nested Routes
Routes that are rendered inside other routes. Used for layouts where a parent component (e.g., Dashboard) has a sidebar and the child components render in the main content area.
```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="settings" element={<Settings />} />
</Route>
// Inside DashboardLayout: <Outlet /> renders the child route.
```

### Q115. Protected Routes
Routes that require authentication. You create a wrapper component that checks if the user is logged in. If not, it redirects to the login page.
```jsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};
```

### Q116. Lazy Routes
Using `React.lazy` and `Suspense` to load route components only when they are needed. This reduces the initial bundle size.
```jsx
const About = React.lazy(() => import('./About'));
<Route path="/about" element={<Suspense fallback={<Spinner />}><About /></Suspense>} />
```

---

## Phase 9: Testing

### Q117. Unit Testing
Testing individual units of code (functions, hooks, or a single component) in isolation. The goal is to verify that each part works correctly on its own.

### Q118. Integration Testing
Testing how multiple units work together. For example, testing a form component that includes input fields, a submit button, and an API call. It verifies the flow of data between components.

### Q119. Jest
A JavaScript testing framework developed by Meta. It provides the test runner, assertion library, and mocking capabilities. It is the most common testing framework for React.

### Q120. React Testing Library (RTL)
A library for testing React components. It encourages testing from the user's perspective rather than testing implementation details. Its core philosophy is: "The more your tests resemble the way your software is used, the more confidence they can give you."
- **Key APIs:** `render`, `screen`, `fireEvent`, `userEvent`, `waitFor`.

### Q121. Mock Functions
Functions that replace real implementations in tests. They record how they were called (arguments, number of times) and can return fake values.
```js
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
```

### Q122. Mock API Calls
You mock API calls so your tests don't depend on a real server. Use `jest.mock()` or `msw` (Mock Service Worker).
```js
jest.mock('axios');
axios.get.mockResolvedValue({ data: { name: 'John' } });
```

### Q123. Snapshot Testing
A test that captures the rendered output of a component and saves it to a file. On subsequent runs, it compares the new output to the saved snapshot. If they differ, the test fails.
```jsx
const { asFragment } = render(<MyComponent />);
expect(asFragment()).toMatchSnapshot();
```

### Q124. Testing Hooks
Use `@testing-library/react-hooks` (or `renderHook` in RTL v13.1+) to test custom hooks in isolation.
```jsx
const { result } = renderHook(() => useCounter());
act(() => { result.current.increment(); });
expect(result.current.count).toBe(1);
```

### Q125. act()
A function from React that ensures all state updates and effects have been processed before making assertions. RTL usually wraps this automatically, but you may need it for manual state updates.

---

## Phase 10: React 18+

### Q126. React 18 Features
- **Concurrent Rendering:** The ability to prepare multiple versions of the UI at the same time.
- **Automatic Batching:** Batches state updates even inside promises and setTimeout.
- **Transitions:** `useTransition` and `startTransition` to mark updates as non-urgent.
- **Suspense Improvements:** Suspense on the server (Streaming SSR).
- **New Hooks:** `useId`, `useSyncExternalStore`, `useDeferredValue`.

### Q127. Concurrent Rendering
A new behind-the-scenes mechanism that allows React to interrupt, pause, and resume rendering work. It ensures the UI remains responsive even during heavy rendering tasks. It is not a feature you use directly; it is a capability that enables features like Transitions and Suspense.

### Q128. Automatic Batching
In React 17 and earlier, state updates inside promises, setTimeout, and native event handlers were NOT batched. In React 18, they are automatically batched, resulting in fewer re-renders.
```jsx
// React 18: Only 1 re-render
setTimeout(() => {
  setCount(c => c + 1);
  setFlag(f => !f);
}, 1000);
```

### Q129. Suspense Improvements
React 18 allows Suspense to be used on the server for Streaming SSR. It also allows Suspense boundaries to be nested and to show fallbacks while data is loading.

### Q130. New JSX Transform
React 17 introduced a new JSX transform that allows you to use JSX without importing React. This reduces bundle size and simplifies code.
```jsx
// Before (React 16)
import React from 'react';
// After (React 17+)
// No import needed
```

### Q131. Strict Mode Double Rendering
In development, React 18 Strict Mode intentionally double-invokes component functions, effects, and state updaters to help you find bugs related to side effects and impure functions. It does NOT happen in production.

### Q132. Future of React
- **React Compiler:** Auto-memoization, removing the need for manual `useMemo` and `useCallback`.
- **Server Components:** A new paradigm for building apps that combine server and client rendering.
- **Actions:** Simplified data mutations and form handling.

---

## Phase 11: React 19 & Modern React Features

### Q133. What is React 19?
React 19 is the latest major version of React, released in late 2024. It focuses on simplifying data mutations, form handling, and improving performance through the React Compiler.

### Q134. Major Improvements in React 19
- **Actions:** Built-in support for async transitions and form submissions.
- **New Hooks:** `useActionState`, `useFormStatus`, `useOptimistic`, `use`.
- **Ref as a Prop:** `forwardRef` is no longer needed.
- **Document Metadata:** Built-in support for `<title>`, `<meta>`, and `<link>`.
- **React Compiler:** Automatic memoization.
- **Server Components:** Stable support.

### Q135. Difference between React 18 and React 19
| Feature | React 18 | React 19 |
| :--- | :--- | :--- |
| **Form Handling** | Manual with useState/useEffect | Built-in Actions |
| **Ref Forwarding** | Requires `forwardRef` | Ref as a prop |
| **Memoization** | Manual `useMemo`/`useCallback` | Automatic with React Compiler |
| **Metadata** | Required `react-helmet` | Built-in `<title>`, `<meta>` |
| **Async Data** | Manual loading states | `use()` and `useOptimistic` |

### Q136. Why was React 19 introduced?
To reduce boilerplate code, simplify data mutations and form handling, and improve performance by integrating the React Compiler.

---

## Actions

### Q137. What are Actions in React 19?
Actions are functions that handle data mutations and form submissions. They can be async and are integrated with React's transition system. They simplify the process of submitting forms and updating state.

### Q138. Why are Actions useful?
They eliminate the need for manual `isLoading`, `error`, and `data` state management. They handle pending states, errors, and optimistic updates automatically.

### Q139. How Actions simplify form submissions?
Instead of manually calling `e.preventDefault()`, setting loading state, making an API call, and updating state, you just pass an async function to the `<form>` `action` prop.
```jsx
async function submitForm(formData) {
  const name = formData.get('name');
  await api.save(name);
}
<form action={submitForm}>
  <input name="name" />
  <button type="submit">Submit</button>
</form>
```

### Q140. Traditional form handling vs Actions
- **Traditional:** `onSubmit` handler, `e.preventDefault()`, `useState` for loading/error, manual API call.
- **Actions:** Pass async function to `action` prop, React handles pending states, errors, and revalidation.

### Q141. Benefits of Actions
- Less boilerplate.
- Built-in pending states.
- Built-in error handling.
- Works with `useFormStatus` and `useActionState`.

---

## useActionState

### Q142. What is useActionState?
A hook that manages the state of an Action. It returns the current state, a wrapped action function, and a pending flag.
```jsx
const [state, formAction, isPending] = useActionState(async (prevState, formData) => {
  const result = await api.submit(formData);
  return result;
}, initialState);
```

### Q143. Why useActionState was introduced?
To manage form state (errors, success messages) and pending states without manual `useState` and `useEffect`.

### Q144. useState vs useActionState
- **useState:** You manage loading, error, and data state manually.
- **useActionState:** React manages pending state automatically. You only manage the returned data/error.

### Q145. Handling form submission using useActionState
```jsx
function MyForm() {
  const [error, submitAction, isPending] = useActionState(async (prev, formData) => {
    const error = await api.submit(formData);
    return error;
  }, null);

  return (
    <form action={submitAction}>
      <input name="email" />
      <button disabled={isPending}>Submit</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Q146. Advantages of useActionState
- No manual `isLoading` state.
- No manual error state.
- Cleaner code.
- Works seamlessly with `<form>`.

---

## useFormStatus

### Q147. What is useFormStatus?
A hook that provides the status of the parent `<form>` (pending, data, method, action). It must be used inside a component that is a child of the `<form>`.
```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Submit</button>;
}
```

### Q148. Why useFormStatus was introduced?
To allow child components (like a submit button) to access the form's pending state without prop drilling.

### Q149. How to show loading states using useFormStatus?
```jsx
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>;
}
```

### Q150. Real-world use cases of useFormStatus
- Disabling the submit button while the form is submitting.
- Showing a spinner inside the button.
- Preventing double submissions.

---

## useOptimistic

### Q151. What is useOptimistic?
A hook that allows you to show an optimistic (temporary) state while an async action is in progress. If the action fails, React reverts to the previous state.
```jsx
const [optimisticMessages, addOptimisticMessage] = useOptimistic(messages, (state, newMessage) => [...state, newMessage]);
```

### Q152. Why useOptimistic was introduced?
To improve perceived performance by instantly showing the expected result of an action, rather than waiting for the server response.

### Q153. What is Optimistic UI?
A UI pattern where you assume the server request will succeed and update the UI immediately. If it fails, you roll back. Common in likes, comments, and chat apps.

### Q154. Real-world examples of Optimistic Updates
- Liking a post (heart turns red instantly).
- Sending a chat message (message appears instantly).
- Adding an item to a cart.

### Q155. Benefits of useOptimistic
- Instant feedback to the user.
- Smoother user experience.
- Automatic rollback on failure.

---

## use()

### Q156. What is the use() API?
A new React 19 API that allows you to read a promise or context inside a component. Unlike hooks, it can be called conditionally.
```jsx
const data = use(fetchData());
```

### Q157. Why was use() introduced?
To simplify reading async data (promises) and context. It integrates with Suspense to show a fallback while the promise is pending.

### Q158. Promise handling with use()
```jsx
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map(c => <p key={c.id}>{c.text}</p>);
}
```

### Q159. use() vs useEffect
- **useEffect:** Runs after render, manages side effects, requires manual loading/error state.
- **use():** Reads a promise during render, works with Suspense, no manual state management.

### Q160. Suspense integration with use()
Wrap the component using `use()` in a `<Suspense>` boundary. While the promise is pending, the fallback is shown. When resolved, the component renders.
```jsx
<Suspense fallback={<Spinner />}>
  <Comments commentsPromise={commentsPromise} />
</Suspense>
```

---

## React Server Components (RSC)

### Q161. What are React Server Components?
Components that render exclusively on the server. They never ship to the client, reducing bundle size. They can directly access databases and file systems.

### Q162. Why Server Components were introduced?
To reduce bundle size, improve initial load performance, and allow direct access to backend resources without an API layer.

### Q163. Server Components vs Client Components
| Feature | Server Components | Client Components |
| :--- | :--- | :--- |
| **Rendering** | Server only | Client (browser) |
| **Bundle Size** | Zero impact | Adds to bundle |
| **State/Hooks** | Not allowed | Allowed |
| **Event Handlers** | Not allowed | Allowed |
| **DB Access** | Direct | Via API |

### Q164. Benefits of Server Components
- Smaller bundle size.
- Faster initial page load.
- Direct backend access.
- Better SEO.

### Q165. Limitations of Server Components
- No `useState`, `useEffect`, or event handlers.
- Cannot use browser APIs.
- Must be serializable when passing props to Client Components.

### Q166. When should we use Server Components?
- For data fetching.
- For rendering static content.
- For accessing backend resources.
- For large dependencies that you don't want in the client bundle.

---

## Metadata & Document APIs

### Q167. Metadata handling improvements in React 19
React 19 allows you to render `<title>`, `<meta>`, and `<link>` tags directly in your components. React automatically hoists them to the `<head>`.
```jsx
function BlogPost({ post }) {
  return (
    <>
      <title>{post.title}</title>
      <meta name="description" content={post.excerpt} />
      <article>{post.content}</article>
    </>
  );
}
```

### Q168. Managing document title in React 19
Simply render `<title>` inside your component. No need for `react-helmet`.

### Q169. Head management improvements
React 19 automatically deduplicates and hoists metadata tags to the `<head>`, making SEO and document management much simpler.

---

## Ref Improvements

### Q170. What's new in React 19 Refs?
- `ref` is now a regular prop. `forwardRef` is no longer needed.
- Refs can be passed directly to function components.
- Cleanup functions for refs.

### Q171. Ref as a Prop
```jsx
// Before (React 18)
const Input = forwardRef((props, ref) => <input ref={ref} {...props} />);

// After (React 19)
function Input({ ref, ...props }) {
  return <input ref={ref} {...props} />;
}
```

### Q172. forwardRef relevance in React 19
`forwardRef` is deprecated. You can now pass `ref` as a normal prop. It still works for backwards compatibility but is no longer necessary.

### Q173. Ref handling improvements
- Refs can return a cleanup function.
- Refs are now easier to use in function components.
- `useImperativeHandle` still works for custom ref APIs.

---

## Performance Improvements

### Q174. Performance improvements in React 19
- React Compiler (auto-memoization).
- Better hydration (faster, less flickering).
- Improved Suspense.
- Smaller bundle size.

### Q175. Hydration improvements
React 19 improves hydration by:
- Handling mismatches more gracefully.
- Hydrating content progressively.
- Reducing the amount of JavaScript needed for hydration.

### Q176. Suspense improvements
- Suspense can now be used with `use()`.
- Better error handling.
- Streaming SSR improvements.

### Q177. Rendering optimizations
- Automatic batching.
- Concurrent rendering.
- React Compiler eliminates unnecessary re-renders.

---

## React Compiler

### Q178. What is React Compiler?
A build-time tool that automatically optimizes React code by memoizing components and hooks. It eliminates the need for manual `useMemo` and `useCallback`.

### Q179. Why React Compiler was introduced?
To reduce the burden on developers to manually optimize performance. It ensures optimal re-rendering without manual intervention.

### Q180. How React Compiler reduces re-renders?
It analyzes your code and automatically wraps components and values in memoization. It understands the data flow and only re-renders when necessary.

### Q181. React Compiler vs useMemo
- **useMemo:** Manual, requires dependency arrays, easy to get wrong.
- **React Compiler:** Automatic, no dependency arrays, always correct.

### Q182. React Compiler vs useCallback
- **useCallback:** Manual, requires dependency arrays.
- **React Compiler:** Automatic, no manual intervention needed.

### Q183. Do we still need memoization after React Compiler?
In most cases, no. The compiler handles it. However, you may still need `useMemo` for expensive calculations that the compiler cannot optimize, or for referential stability in rare cases.

---

## Modern React Interview Questions

### Q184. What problems does React 19 solve?
- Form handling boilerplate.
- Manual loading/error states.
- Ref forwarding complexity.
- Manual memoization.
- Document metadata management.
- Bundle size (Server Components).

### Q185. Which React 19 features have you used in production?
- **Actions** for form submissions.
- **useActionState** for form state.
- **useFormStatus** for loading buttons.
- **useOptimistic** for instant UI feedback.
- **Ref as a prop** for simpler component APIs.

### Q186. Explain useOptimistic with an example.
```jsx
function LikeButton({ likes, onLike }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (state) => state + 1);
  return (
    <button onClick={async () => { addOptimisticLike(); await onLike(); }}>
      ❤️ {optimisticLikes}
    </button>
  );
}
```

### Q187. Explain useActionState with an example.
```jsx
function LoginForm() {
  const [error, submitAction, isPending] = useActionState(async (prev, formData) => {
    const err = await login(formData);
    return err;
  }, null);

  return (
    <form action={submitAction}>
      <input name="email" />
      <input name="password" type="password" />
      <button disabled={isPending}>{isPending ? 'Logging in...' : 'Login'}</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Q188. Explain use() with an example.
```jsx
function UserProfile({ userPromise }) {
  const user = use(userPromise);
  return <h1>{user.name}</h1>;
}

<Suspense fallback={<Spinner />}>
  <UserProfile userPromise={fetchUser()} />
</Suspense>
```

### Q189. Explain Server Components architecture.
Server Components render on the server. They send a serialized UI description to the client. Client Components are rendered on the client and can be interactive. The server and client work together to build the final UI.

### Q190. Explain React Compiler.
A build-time tool that automatically memoizes components and hooks, eliminating the need for manual `useMemo` and `useCallback`. It analyzes data flow and optimizes re-renders.

### Q191. React 18 vs React 19 comparison.
| Feature | React 18 | React 19 |
| :--- | :--- | :--- |
| **Forms** | Manual | Actions |
| **Refs** | forwardRef | Ref as prop |
| **Memoization** | Manual | React Compiler |
| **Metadata** | react-helmet | Built-in |
| **Async Data** | Manual | use(), useOptimistic |
| **Server Components** | Experimental | Stable |

### Q192. Future roadmap of React.
- React Compiler (stable release).
- Server Components adoption.
- Better DevTools.
- Improved Suspense and streaming.
- More built-in primitives for common patterns.


---

### How to Use This Guide

1. **Copy the code block above** and paste it at the end of your `React_Interview_Study_Guide.md` file.
2. **Focus on Phase 8 (React Router) and Phase 9 (Testing)** first, as these are common in interviews.
3. **Phase 10 and 11 (React 18 & 19)** are critical for Senior roles. Make sure you can explain `useActionState`, `useFormStatus`, `useOptimistic`, and `use()` with examples.
4. **Practice the React 19 code examples** in a sandbox (like CodeSandbox or StackBlitz) so you can speak to them confidently.

You now have a complete guide covering Phases 1 through 11. If you need Phases 12 through 20 expanded in the same detail, just let me know. Good luck with the PwC interview!---

## Phase 13: Browser Fundamentals

### Q264. What is the Event Loop?
The mechanism that allows JavaScript (a single-threaded language) to perform non-blocking I/O operations.
1. **Call Stack:** Executes synchronous code.
2. **Web APIs:** Browser handles async operations (setTimeout, fetch).
3. **Callback Queue:** Holds callbacks ready to run.
4. **Event Loop:** Pushes callbacks from the queue to the stack when the stack is empty.

### Q270. Promise vs setTimeout Execution Order
Promises (Microtasks) have higher priority than setTimeout (Macrotasks).
```js
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// Output: 1, 4, 3, 2
```

---

## Phase 14: Frontend Security

### Q290. What is XSS (Cross-Site Scripting)?
An attack where malicious scripts are injected into a trusted website. React protects against this by default by escaping all values embedded in JSX.
- **Danger:** `dangerouslySetInnerHTML` bypasses this protection. Only use it with sanitized data (e.g., DOMPurify).

### Q293. What is CSRF (Cross-Site Request Forgery)?
An attack that tricks a user into submitting a request they didn't intend to. Prevention: Use CSRF tokens, SameSite cookies, and check the Origin/Referer headers.

### Q298. HttpOnly Cookie
A cookie that cannot be accessed by JavaScript (`document.cookie`). Used to store sensitive tokens (like Refresh Tokens) to prevent XSS attacks from stealing them.

---

## Phase 17: TypeScript (Essential for Senior Roles)

### Q342. Type vs Interface
- **Interface:** Used for defining object shapes. Can be extended (`extends`). Can be merged (declaration merging).
- **Type:** More flexible. Can define unions, intersections, primitives, and tuples. Cannot be merged.
- **Rule of Thumb:** Use `interface` for public APIs/objects. Use `type` for everything else.

### Q343. Generics
A way to create reusable components that work with a variety of types rather than a single one.
```tsx
function identity<T>(arg: T): T { return arg; }
const output = identity<string>("hello");
```

### Q348. Typing Props
```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}
const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => { ... }
```

---

## Phase 19: Coding Round (Must Practice)

### Q366. Debounce Implementation
```js
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}
```

### Q367. Throttle Implementation
```js
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### Q371. Promise.all Implementation
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then((value) => {
        results[index] = value;
        completed++;
        if (completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}
```

---

## Phase 20: Behavioral & Experience (PwC Focus)

### Q382. Tell Me About Yourself
- **Structure:** Present (Current role & key skills) -> Past (Relevant experience & achievements) -> Future (Why this role & PwC).
- **Example:** "I am a Senior Frontend Engineer with 6+ years of experience building scalable React and React Native applications. Currently, I lead a team of 4 developers at [Company], where I architected a micro-frontend solution that reduced deployment time by 40%. I am passionate about GenAI integration and have recently built an LLM-powered agent workflow using LangChain. I am excited about this role at PwC because it combines my technical expertise with the opportunity to solve complex client problems."

### Q387. Biggest Technical Challenge
- **Use STAR Method:** Situation, Task, Action, Result.
- **Example:** "We had a legacy React app with severe performance issues (10s load time). I identified that the main bundle was 5MB. I implemented code splitting with `React.lazy`, tree shaking, and moved heavy calculations to Web Workers. The result was a 70% reduction in load time and a 30% increase in user retention."

### Q389. Performance Issue You Solved
- **Focus on:** React.memo, useMemo, useCallback, Virtualization (react-window), and Bundle Analysis (webpack-bundle-analyzer).

---

## High-Priority Checklist (Study These First)

- [ ] Hooks (useState, useEffect, useMemo, useCallback, useRef)
- [ ] Virtual DOM, Reconciliation, Diffing Algorithm
- [ ] React.memo vs PureComponent
- [ ] Redux Toolkit (createSlice, configureStore)
- [ ] Context API vs Redux
- [ ] React 18/19 Features (Concurrent, Suspense, Actions, useOptimistic)
- [ ] Vite vs Webpack
- [ ] Babel & Tree Shaking
- [ ] Event Loop (Microtasks vs Macrotasks)
- [ ] JWT Authentication Flow
- [ ] TypeScript Generics & Utility Types
- [ ] React System Design (Folder Structure, Micro Frontends)
- [ ] Debounce & Throttle Implementation
- [ ] Behavioral STAR Stories
