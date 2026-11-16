# 25 Real-World Front-End Interview Problems

Practice set for senior React / JavaScript interviews, from beginner to advanced. Most use a banking transactions theme.

Sample data: `transactions = [{ id, accountNo, amount, status, date }]`

## Beginner

1. Sum the amounts of all transactions with status `success`.
2. Remove duplicate transactions by `id`.
3. Sort transactions by date, newest first.
4. Find the highest and lowest transaction amounts.
5. Format an amount in Indian rupees (e.g. ₹1,25,000.00).
6. Mask an account number so only the last 4 digits show (e.g. XXXXXX1234).
7. Count how many transactions there are for each status.

## Intermediate

8. Group transactions by account number and total the successful amounts.
9. Group transactions by month.
10. Write a `debounce` function for a search box.
11. Write a `throttle` function for scroll events.
12. Deep clone a nested object.
13. Flatten a nested array (and a nested object) without built-ins.
14. Write polyfills for `map`, `filter` and `reduce`.
15. Write a polyfill for `Promise.all`.
16. Build a `useFetch` custom hook returning loading, error and data.
17. Paginate a list of transactions on the front end.

## Advanced

18. Request queue: run at most 2 API calls at a time; the rest wait in a queue.
19. Retry a failed API call with exponential backoff.
20. Add a timeout to a fetch call using `AbortController`.
21. Prevent double payment clicks (in-flight guard, disabled button, idempotency key).
22. Cancel stale search requests so only the latest result is shown.
23. Refresh an expired access token with an Axios interceptor, queueing the failed calls and retrying them.
24. Dashboard with 3 APIs where each widget loads, fails and retries independently.
25. Build a simple event emitter (pub-sub) with `on`, `off` and `emit`.

## How to practise

- Write each solution by hand before running it.
- Say the time complexity and one trade-off out loud.
- Link each answer to a real example from your work.

## Scenario questions with one-line answers

Short "what happens if" questions, from beginner to advanced. Say the one-line answer first, then explain if asked.

### Beginner

1. **A list re-renders wrongly after deleting an item. Why?** Using the array index as `key`; use a stable unique id instead.
2. **An input field won't let the user type. Why?** It has a `value` but no `onChange`, so it's controlled and never updates.
3. **State shows the old value right after `setState`. Why?** State updates are async and batched; read the new value on the next render or use the functional update.
4. **A `useEffect` runs in an infinite loop. Why?** It sets state that's in its own dependency array, or a dependency is a new object every render.
5. **The page crashes when the API returns `null`. How do you prevent it?** Optional chaining with a fallback, like `data?.name ?? "-"`.
6. **A button click submits the form and reloads the page. How do you stop it?** Call `e.preventDefault()` or set `type="button"`.
7. **An image breaks the layout on mobile. Fix?** Set `max-width: 100%; height: auto;` and use responsive units.

### Medium

8. **The user clicks the Pay button twice. What happens and how do you prevent it?** Two payments can be sent; disable the button while in flight, add a ref guard, and send an idempotency key to the backend.
9. **The search box calls the API on every keystroke. Fix?** Debounce the input, around 300 ms.
10. **Old search results overwrite newer ones. Why and fix?** Responses arrive out of order; cancel the previous request with `AbortController` or ignore stale responses.
11. **A component updates state after it unmounts. Fix?** Clean up in the effect's return and abort the pending request.
12. **One of three dashboard APIs fails and the whole page goes blank. Fix?** Use `Promise.allSettled` or per-widget queries with error boundaries, so each widget fails on its own.
13. **A child re-renders even though its props didn't change. Fix?** Wrap it in `React.memo` and stabilise function and object props with `useCallback` and `useMemo`.
14. **The backend stops sending `username`. Immediate production fix?** `user?.username ?? "Customer"`, then mark the field optional in the type and validate the response.
15. **A list of 10,000 transactions makes the page slow. Fix?** Virtualise the list, or paginate.
16. **All Context consumers re-render on any change. Fix?** Memoise the provider value and split the context into smaller ones.

### Advanced

17. **The access token expires while 5 requests are in flight. What do you do?** One interceptor refreshes the token once, queues the failed calls, then replays them with the new token.
18. **Only 2 API calls should run at a time. How?** A request queue with a running counter; when one finishes, start the next.
19. **An API sometimes fails briefly. How do you make it reliable?** Retry with exponential backoff and a maximum number of attempts.
20. **An API sometimes hangs forever. Fix?** A timeout with `AbortController`, then show a retry option.
21. **A user injects a script through a comment field. How do you protect the app?** Render as text, never use `dangerouslySetInnerHTML` without DOMPurify, and add a Content Security Policy.
22. **Another site tricks the user's browser into sending a transfer request. How do you prevent it?** SameSite cookies plus a CSRF token, or send the token in the Authorization header.
23. **Where do you store tokens in a banking app?** Access token in memory, refresh token in an HttpOnly, Secure, SameSite cookie; never localStorage.
24. **The bundle is huge and the first load is slow. Fix?** Code-split routes with `React.lazy`, tree-shake, and lazy-load heavy libraries.
25. **Users report a bug you can't reproduce in production. What do you do?** Check Splunk or Dynatrace logs by correlation ID, reproduce with the same data, and add an error boundary with logging.

## 50 most-asked interview questions (2025–2026)

Based on 2026 interview guides ([GreatFrontEnd](https://www.greatfrontend.com/blog/100-react-interview-questions-straight-from-ex-interviewers), [TechScreen](https://techscreen.app/articles/react-interview-questions-2026), [GoLinuxCloud](https://www.golinuxcloud.com/react-js-interview-questions-experienced/), [igmGuru](https://www.igmguru.com/blog/react-interview-questions), [OnlyFrontendJobs](https://www.onlyfrontendjobs.com/blog/frontend-developer-interview-questions-2026)). Recurring themes: rendering and keys, hooks and useEffect bugs, memoization trade-offs, scenario rounds, and React 19 for senior roles.

### Beginner (1–15)

1. What is the Virtual DOM and how does reconciliation work?
2. Why do keys matter in lists, and why is the index a bad key?
3. State vs. props: what's the difference?
4. Controlled vs. uncontrolled components.
5. What are the rules of hooks, and why do they exist?
6. What does the functional form of setState, `setCount(c => c + 1)`, solve?
7. How does the useEffect dependency array work?
8. What is lifting state up?
9. Explain closures with an example.
10. `var` vs. `let` vs. `const`, and hoisting.
11. `==` vs. `===`.
12. How does `this` behave in normal vs. arrow functions?
13. What is event delegation?
14. Flexbox vs. Grid: when do you use each?
15. What are semantic HTML and basic accessibility (ARIA, keyboard navigation)?

### Medium (16–35)

16. Explain the event loop: microtasks vs. macrotasks, with an output question.
17. Promises vs. async/await, and error handling.
18. Promise.all vs. allSettled vs. race vs. any.
19. Implement debounce and throttle.
20. Implement a polyfill for map, reduce or Promise.all.
21. Deep clone vs. shallow copy, and `structuredClone`.
22. What causes a re-render, and how do you prevent unnecessary ones?
23. When should you use useMemo and useCallback, and when not? (Memoization has a cost.)
24. Fix an infinite useEffect loop.
25. useEffect cleanup: why and when?
26. useRef: two main uses.
27. Write a custom hook, like useFetch or useDebounce.
28. Context API drawbacks and how to avoid extra re-renders.
29. Redux Toolkit vs. Zustand vs. Context: which do you pick and why?
30. Server state vs. client state, and why use TanStack Query or RTK Query.
31. Error boundaries: what they catch and what they don't.
32. Code splitting with React.lazy and Suspense.
33. How do you handle a large list of 10,000+ items? (Virtualization.)
34. TypeScript: interface vs. type, generics, and Partial, Pick and Omit.
35. How do you test components with React Testing Library?

### Advanced (36–50)

36. React 19 Actions, useActionState and useFormStatus.
37. useOptimistic with a real example.
38. The `use` API: reading promises and context.
39. What does the React Compiler do, and is useMemo still needed?
40. What are Server Components vs. Client Components?
41. What is hydration, and what causes hydration errors?
42. useTransition and useDeferredValue: keeping a laggy filter input responsive.
43. React Fiber and concurrent rendering, at a high level.
44. Cancel stale requests with AbortController.
45. Concurrency limiter: run at most N API calls at a time.
46. Token refresh with an Axios interceptor and a request queue.
47. XSS, CSRF and secure token storage in a SPA.
48. Core Web Vitals (LCP, INP, CLS) and how to improve them.
49. Design the data layer for a dashboard where widgets fail independently.
50. How would you migrate an old React app to a modern architecture?
