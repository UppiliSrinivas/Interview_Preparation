# TanStack Query (React Query) — Senior Frontend Interview Notes (Product Companies)

> Focus: **server state vs client state, caching model, keys, invalidation, optimistic updates, SSR, and architecture.** Based on v5 (`@tanstack/react-query`).

---

## Part 1 — Core Concepts

### 1. What is server state, and why does it need its own tool?
Server state is data **owned by the backend** that the UI only borrows a copy of. Unlike client state, it can change without you knowing, goes stale, is shared across screens, and needs caching, deduplication, retries, and background refresh. Putting it in Redux/Zustand means rebuilding all of that by hand. TanStack Query handles it as an **async state manager / cache**, not a fetching library — you still bring `fetch`/axios.

### 2. What does a basic setup look like?
```jsx
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000 } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  );
}

function Todos() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => fetch('/api/todos').then((r) => {
      if (!r.ok) throw new Error('Failed to fetch');   // fetch doesn't throw on 4xx/5xx
      return r.json();
    }),
  });

  if (isPending) return <Spinner />;
  if (isError) return <p role="alert">{error.message}</p>;
  return <TodoList todos={data} />;
}
```
Senior point: `queryFn` must **throw** on failure for React Query to treat it as an error — `fetch` doesn't throw on HTTP errors, so check `res.ok`.

### 3. What are query keys, and how should you design them?
Keys **uniquely identify cached data**. They're arrays, hashed deterministically, and act like a dependency array: when the key changes, the query refetches.
```js
useQuery({ queryKey: ['todos', { status, page }], queryFn: () => fetchTodos({ status, page }) });
useQuery({ queryKey: ['todo', id], queryFn: () => fetchTodo(id) });
```
Rules:
- Include **every variable the `queryFn` uses** (the ESLint plugin enforces this).
- Go from **general to specific** (`['todos', 'list', filters]`) so you can invalidate broadly (`['todos']`) or narrowly.
- Use a **query key factory** in larger apps:
```js
export const todoKeys = {
  all: ['todos'],
  lists: () => [...todoKeys.all, 'list'],
  list: (filters) => [...todoKeys.lists(), filters],
  detail: (id) => [...todoKeys.all, 'detail', id],
};
```

### 4. `staleTime` vs `gcTime` — the most asked question.
| | `staleTime` | `gcTime` (was `cacheTime` before v5) |
|---|---|---|
| Meaning | How long data counts as **fresh** | How long **unused** data stays in memory |
| Default | `0` (immediately stale) | 5 minutes |
| Effect | Fresh data is served from cache with **no refetch** | After no component uses the query for this long, it's garbage-collected |

- **Stale ≠ deleted.** Stale data is still shown instantly; React Query refetches it in the background on triggers (mount, window focus, reconnect).
- Default `staleTime: 0` causes many background refetches. Set it per data type: a user profile might be fresh for 5 minutes; stock prices for seconds.

### 5. What triggers automatic refetches?
For **stale** queries: a new component mounting the query (`refetchOnMount`), window refocus (`refetchOnWindowFocus`), network reconnect (`refetchOnReconnect`), and optional polling (`refetchInterval`). Raising `staleTime` is usually better than turning these off.

### 6. `isPending` vs `isFetching` vs `isLoading`?
- **`isPending`** (`status === 'pending'`): no data yet — show a skeleton.
- **`isFetching`**: a request is in flight, including background refetches — show a subtle indicator.
- **`isLoading`**: equals `isPending && isFetching` (first load in progress). It's a deprecated alias in recent v5 releases, so prefer `isPending`.

Also: `isPlaceholderData`, `isRefetching`, `fetchStatus` (`'fetching' | 'paused' | 'idle'`, where `paused` means offline).

### 7. What does React Query do automatically that you'd otherwise build yourself?
- **Request deduplication** — ten components using `['user', 1]` trigger one request.
- **Caching** shared across the app.
- **Retries** with exponential backoff (3 by default for queries).
- **Background refetching** and stale-while-revalidate UX.
- **Structural sharing** — unchanged parts of the response keep their references, so memoized components don't re-render.
- **Garbage collection** of unused data.
- **Cancellation** via the `signal` passed to `queryFn`.

---

## Part 2 — Query Patterns

### 8. How do you make dependent (serial) queries?
Use `enabled` so the second query waits for the first.
```jsx
const { data: user } = useQuery({ queryKey: ['user', email], queryFn: () => getUser(email) });

const { data: projects } = useQuery({
  queryKey: ['projects', user?.id],
  queryFn: () => getProjects(user.id),
  enabled: !!user?.id,
});
```

### 9. How do you run parallel queries, including a dynamic number?
Multiple `useQuery` calls run in parallel automatically. For a dynamic list, use `useQueries`:
```jsx
const results = useQueries({
  queries: ids.map((id) => ({ queryKey: ['user', id], queryFn: () => getUser(id) })),
});
```

### 10. How do you transform or subscribe to part of the data?
The `select` option transforms data per component **without changing the cache**, and the component re-renders only when the selected result changes.
```jsx
const { data: count } = useQuery({
  queryKey: ['todos'],
  queryFn: fetchTodos,
  select: (todos) => todos.filter((t) => !t.done).length,
});
```
Senior point: define `select` outside the component (or memoize it) so it doesn't re-run on every render.

### 11. How do you build paginated queries without a loading flash between pages?
Include the page in the key and keep the previous page visible while the next loads:
```jsx
import { keepPreviousData, useQuery } from '@tanstack/react-query';

const { data, isPlaceholderData } = useQuery({
  queryKey: ['projects', page],
  queryFn: () => fetchProjects(page),
  placeholderData: keepPreviousData,
});

<button disabled={isPlaceholderData || !data?.hasMore} onClick={() => setPage((p) => p + 1)}>
  Next
</button>
```
(In v5 this replaced the old `keepPreviousData: true` option.)

### 12. How do infinite queries work ("load more" / infinite scroll)?
```jsx
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  queryKey: ['feed'],
  queryFn: ({ pageParam }) => fetchFeed({ cursor: pageParam }),
  initialPageParam: null,                        // required in v5
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined, // undefined = no more pages
});

const items = data?.pages.flatMap((p) => p.items) ?? [];
```
Pair with an `IntersectionObserver` sentinel to call `fetchNextPage()`, and with virtualization (react-window / TanStack Virtual) for very long lists. Use `maxPages` to cap memory.

### 13. How do you prefetch data?
Load data before it's needed — on hover, on route loaders, or for the next page:
```jsx
const queryClient = useQueryClient();

<Link
  to={`/todos/${id}`}
  onMouseEnter={() =>
    queryClient.prefetchQuery({ queryKey: todoKeys.detail(id), queryFn: () => fetchTodo(id) })
  }
/>
```
Also: `initialData` / `placeholderData` from a list cache to render a detail screen instantly.

### 14. What is `queryOptions` and why use it?
A helper to define key + function + options **once** and reuse them in `useQuery`, `prefetchQuery`, `useSuspenseQuery`, and `getQueryData` — with full type inference.
```ts
export const todoQuery = (id: number) =>
  queryOptions({ queryKey: todoKeys.detail(id), queryFn: () => fetchTodo(id), staleTime: 30_000 });

useQuery(todoQuery(id));
queryClient.prefetchQuery(todoQuery(id));
const cached = queryClient.getQueryData(todoQuery(id).queryKey);   // typed
```

### 15. How do you use React Query with Suspense?
`useSuspenseQuery` suspends while loading and throws errors to an error boundary, so `data` is always defined.
```jsx
function Todo({ id }) {
  const { data } = useSuspenseQuery(todoQuery(id));
  return <h2>{data.title}</h2>;
}

<ErrorBoundary fallback={<p>Something went wrong</p>}>
  <Suspense fallback={<Spinner />}><Todo id={1} /></Suspense>
</ErrorBoundary>
```
Watch for **waterfalls**: sibling suspense queries in one component fetch serially — use `useSuspenseQueries` or prefetch in parallel.

---

## Part 3 — Mutations & Cache Updates

### 16. How do mutations work?
```jsx
const queryClient = useQueryClient();

const addTodo = useMutation({
  mutationFn: (newTodo) => api.post('/todos', newTodo),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: todoKeys.lists() }),
  onError: (err) => toast.error(err.message),
});

addTodo.mutate({ title: 'Write tests' });
// or: await addTodo.mutateAsync(data) inside try/catch
```
Mutations don't retry by default and aren't cached like queries. `isPending` on the mutation drives the submit button state.

### 17. Invalidation vs direct cache updates — when to use each?
- **`invalidateQueries`** marks matching queries stale and refetches active ones. Simple, always correct — the default choice.
- **`setQueryData`** writes the new data straight into the cache (e.g. the mutation response already contains the updated entity). Saves a request; you must keep the shape right.
```js
onSuccess: (updatedTodo) => {
  queryClient.setQueryData(todoKeys.detail(updatedTodo.id), updatedTodo);
  queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
},
```
Key matching is **prefix-based** by default: invalidating `['todos']` also covers `['todos', 'list', …]` and `['todos', 'detail', …]`. Use `exact: true` to restrict.

### 18. How do you implement optimistic updates?
**Option A — via the UI (simpler):** render `addTodo.variables` as a pending item while `addTodo.isPending`, then invalidate on settle. No cache surgery, easy rollback (the pending item just disappears on error).

**Option B — via the cache (shared across screens):**
```js
useMutation({
  mutationFn: updateTodo,
  onMutate: async (newTodo) => {
    await queryClient.cancelQueries({ queryKey: todoKeys.detail(newTodo.id) });  // avoid overwrite by in-flight refetch
    const previous = queryClient.getQueryData(todoKeys.detail(newTodo.id));
    queryClient.setQueryData(todoKeys.detail(newTodo.id), (old) => ({ ...old, ...newTodo }));
    return { previous };                                                       // context for rollback
  },
  onError: (_err, newTodo, context) => {
    queryClient.setQueryData(todoKeys.detail(newTodo.id), context.previous);   // roll back
  },
  onSettled: (_data, _err, newTodo) => {
    queryClient.invalidateQueries({ queryKey: todoKeys.detail(newTodo.id) });  // re-sync with server
  },
});
```
Senior points: cancel in-flight queries first, snapshot for rollback, always re-sync in `onSettled`, and avoid optimistic updates for payments or irreversible actions.

### 19. Why were `onSuccess` / `onError` callbacks removed from `useQuery` in v5?
They ran per component instance (duplicate toasts), didn't run when data came from cache, and encouraged syncing server data into local state. Alternatives: derive in render, use `useEffect` on `data` if truly needed, or a global `QueryCache({ onError })` for app-wide error toasts. (Mutation callbacks still exist.)

---

## Part 4 — Production Concerns

### 20. How do you handle errors well?
- `queryFn` throws on bad responses.
- Per-query UI via `isError` / `error`, or `throwOnError` to route to the nearest error boundary.
- App-wide handling (toasts, logging, logout on 401) in `new QueryCache({ onError })` / `MutationCache({ onError })`.
- Tune `retry` (e.g. don't retry 4xx errors):
```js
retry: (failureCount, error) => error.status >= 500 && failureCount < 3,
```

### 21. How does SSR / hydration work (Next.js App Router)?
Prefetch on the server, **dehydrate** the cache into the HTML, and **hydrate** it on the client so there's no loading spinner or refetch on load.
```jsx
// app/todos/page.jsx (Server Component)
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

export default async function Page() {
  const queryClient = new QueryClient();                 // new client per request — never share
  await queryClient.prefetchQuery(todosQuery());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Todos />                                         {/* client component using useQuery */}
    </HydrationBoundary>
  );
}
```
Senior points: create the client **per request** on the server (shared clients leak data between users), and set a `staleTime` above 0 so the client doesn't immediately refetch what the server just loaded.

### 22. How do you test components that use React Query?
- Fresh `QueryClient` per test with `retry: false`; wrap with a custom render.
- Mock the network with **MSW**, not the hook itself.
- Assert loading → success and error states with `findBy*`.
```jsx
const createTestClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
```

### 23. How do you structure React Query in a large codebase?
```
features/todos/
  api.ts          fetch functions (fetchTodos, updateTodo)
  queries.ts      todoKeys factory + queryOptions (todosQuery, todoQuery)
  hooks.ts        useTodos(), useUpdateTodo() — wrap useQuery/useMutation
  components/
```
- Components use **custom hooks**, never raw `useQuery` with inline keys.
- One key factory per feature.
- Global defaults (`staleTime`, `retry`, error handling) on the `QueryClient`.
- React Query Devtools in development.
- ESLint plugin (`@tanstack/eslint-plugin-query`) for exhaustive keys.

---

## Part 5 — Trade-offs & Comparisons

### 24. TanStack Query vs RTK Query vs SWR?
| | TanStack Query | RTK Query | SWR |
|---|---|---|---|
| Cache model | Per query key | Per endpoint + tags, in Redux store | Per key |
| Invalidation | Key-prefix based | Tag-based (`providesTags` / `invalidatesTags`) | Manual `mutate` |
| Mutations | Full API (optimistic, rollback) | Full API | Basic |
| Infinite queries, Devtools | Yes | Yes (Redux DevTools) | Basic |
| Best when | Any React app; most popular choice | App already uses Redux Toolkit | Simple, lightweight needs |

**Good answer:** "If the app already uses Redux Toolkit, RTK Query keeps one store and one pattern. Otherwise TanStack Query — it's framework-agnostic, has the richest feature set, and works alongside Zustand for client state."

### 25. Why not just `useEffect` + `useState` for fetching?
You'd have to handle race conditions (out-of-order responses), cancellation, caching, deduplication, retries, stale data, refetch on focus, loading and error states, pagination, and SSR — in every component. Most hand-rolled versions have race-condition bugs.
```jsx
// The race bug in naive fetching:
useEffect(() => {
  fetchUser(id).then(setUser);   // ❌ if id changes quickly, an older response can win
}, [id]);

// Minimal fix (still no caching/dedup):
useEffect(() => {
  let ignore = false;
  fetchUser(id).then((u) => { if (!ignore) setUser(u); });
  return () => { ignore = true; };
}, [id]);
```

### 26. Should you copy query data into Redux/Zustand?
**No.** Copying creates two sources of truth that drift apart and loses refetching and caching. Read server data from the query everywhere (custom hooks make that easy); keep only client state — selections, UI preferences, drafts — in Zustand/Redux. If a store needs server data, store the **ID**, not the entity.

### 27. "How have you used React Query?" (Template answer)
> "I treat server data as a cache, not state. Each feature has a query key factory and `queryOptions`, exposed through custom hooks. I set `staleTime` per data type to avoid needless refetches, use `select` for derived views, and `placeholderData: keepPreviousData` for pagination. Mutations invalidate by key prefix, and for high-frequency interactions I do optimistic updates with cancel–snapshot–rollback–resync. App-wide errors go through `QueryCache.onError`. On Next.js I prefetch on the server and hydrate with a per-request client. Client state lives separately in Zustand. This removed most of our loading spinners and all hand-written fetch effects."

*(Replace with a concrete project example and measurable outcome.)*

---

## Rapid-Fire

| Question | Answer |
|---|---|
| Server vs client state | Server: backend-owned, can go stale. Client: UI-owned |
| `staleTime` default | `0` — data is stale immediately |
| `gcTime` default | 5 minutes after last observer unmounts (was `cacheTime`) |
| First load flag | `isPending` (no data yet) |
| Background fetch flag | `isFetching` |
| Dependent query | `enabled: !!dependency` |
| Pagination without flash | `placeholderData: keepPreviousData` |
| Infinite query v5 requirement | `initialPageParam` |
| Refresh after mutation | `invalidateQueries({ queryKey })` (prefix match) |
| Optimistic update steps | Cancel → snapshot → set → rollback on error → invalidate on settle |
| SSR | Prefetch on server, `dehydrate` → `HydrationBoundary`, client per request |
| Testing | Fresh client per test, `retry: false`, MSW |
