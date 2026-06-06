# React JS Interview Prep - Q&A Format

**Level:** Beginner to Advanced  
**Updated:** Feb 24, 2026  
**Format:** Question & Answer

---

## What is React?

React is a **JavaScript library** for building **user interfaces (UI)**, especially for **single-page applications (SPAs)**.

It was developed and maintained by **Meta (Facebook)**.

React helps developers build fast, interactive, and reusable UI components.

## Why React is Popular?

- Component-based architecture
- Virtual DOM for performance
- Declarative programming style
- Reusable UI components
- Strong ecosystem
- Backed by Meta
- Large community support

## Core Concepts of React

### Component-Based Architecture

Everything in React is a **component**.

```js
function Welcome() {
  return <h1>Hello, Nivas!</h1>;
}
```

Components can be:

- Functional Components
- Class Components (older approach)

## JSX (JavaScript XML)

JSX allows writing HTML-like syntax inside JavaScript.

```js
const element = <h1>Hello World</h1>;
```

JSX is compiled into React.createElement() calls.

## Virtual DOM

React uses a Virtual DOM to improve performance.

Process:

- React creates a virtual representation of UI.

- When state changes, React compares new Virtual DOM with old one.

- Only changed parts are updated in the real DOM.

This process is called **Reconciliation**.


## React is Declarative

Instead of telling the browser how to update UI, we describe what the UI should look like.

```js
return <h1>{count}</h1>;
```

Companies expect you to know:

✔ Performance optimization (useCallback, memo, profiling)
✔ React Query / Redux Toolkit
✔ Error boundaries
✔ Suspense & concurrent features
✔ Server components (React 19)
✔ Clean architecture of large-scale apps
✔ Reusable component design
✔ Fetching patterns & caching strategies
