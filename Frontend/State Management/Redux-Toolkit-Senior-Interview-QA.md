# Redux Toolkit — Senior Frontend Interview Notes (Product Companies)

> Trimmed from 50 → 22 high-value questions. Basics are merged into one-liners at the end.
> Senior-level focus: **trade-offs, performance, architecture, and "why"** — not just definitions.

---

## Part 1 — Core Concepts

### 1. Why Redux Toolkit over plain Redux?
RTK is the official, recommended way to write Redux. It removes boilerplate and bakes in best practices:
- `createSlice` → reducers + actions in one place
- **Immer** built in → write "mutating" syntax safely
- `configureStore` → DevTools, thunk, and dev-time safety checks by default
- `createAsyncThunk` / **RTK Query** → standard async and data-fetching patterns

```js
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: { increment: (state) => { state.count += 1; } },
});
export const { increment } = counterSlice.actions;
export const store = configureStore({ reducer: { counter: counterSlice.reducer } });
```

### 2. How does Immer work? Why can we "mutate" state?
Reducers receive a **draft proxy** of the state. Immer records your changes and produces a new immutable object with structural sharing (unchanged parts keep the same reference).

Gotchas interviewers like:
- Either **mutate the draft** *or* **return a new value** — never both.
- Don't mutate state outside reducers.
- Immer works only on plain objects/arrays (not class instances, Maps/Sets need `enableMapSet()`).

### 3. What does `configureStore` set up by default?
- Redux DevTools
- `redux-thunk`
- Dev-only checks: **`immutableCheck`** (detects mutations) and **`serializableCheck`** (warns about non-serializable values like functions, Promises, class instances)

```js
configureStore({
  reducer,
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});
```
Disable checks only for specific known actions/paths, not globally.

### 4. Why must reducers be pure? Why can't they call APIs?
Same input → same output, no side effects. This gives predictability, time-travel debugging, easy testing, and safe replays. Side effects belong in **thunks, RTK Query, or listener middleware**.

### 5. Why should Redux state be serializable?
DevTools, persistence, SSR hydration, and time-travel all depend on it. Avoid storing functions, class instances, Promises, `Date` objects (store ISO strings/timestamps), or DOM nodes.

---

## Part 2 — Async Logic

### 6. How does `createAsyncThunk` work? Explain the lifecycle.
It generates a thunk and three action types: **`pending` → `fulfilled` | `rejected`**. You handle them in `extraReducers`.

```js
export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (id, { rejectWithValue, signal }) => {
    try {
      const res = await fetch(`/api/users/${id}`, { signal });
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (e) {
      return rejectWithValue(e.message);   // typed, serializable error payload
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, status: 'idle', error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending,   (s) => { s.status = 'loading'; })
      .addCase(fetchUser.fulfilled, (s, a) => { s.status = 'succeeded'; s.data = a.payload; })
      .addCase(fetchUser.rejected,  (s, a) => { s.status = 'failed'; s.error = a.payload ?? a.error.message; });
  },
});
```
Senior points: use `status` enum instead of multiple booleans; `rejectWithValue` for controlled errors; `condition` option to skip duplicate requests; `.unwrap()` in components for try/catch; abort via `signal`.

### 7. `reducers` vs `extraReducers`?
- `reducers`: actions **owned by this slice** (auto-generates action creators).
- `extraReducers`: respond to **external** actions (async thunks, other slices, RTK Query).
Use the **builder callback** syntax (object syntax was removed in RTK 2.0).

### 8. createAsyncThunk vs RTK Query — when to use which?
| Use `createAsyncThunk` | Use RTK Query |
|---|---|
| One-off workflows, non-REST logic, orchestration | Standard server-state fetching (GET/POST CRUD) |
| You manage cache/loading yourself | Caching, dedupe, polling, invalidation built in |

Rule: **server state → RTK Query (or React Query); client/UI state → slices.**

### 9. When would you use listener middleware (or saga) instead of thunks?
For reactive side effects: "when action X happens, do Y" (analytics, syncing, debounce, cancellation, background workflows). RTK's `createListenerMiddleware` covers most saga use cases with far less complexity.

```js
listenerMiddleware.startListening({
  actionCreator: loggedOut,
  effect: async (_, api) => { api.dispatch(apiSlice.util.resetApiState()); },
});
```

---

## Part 3 — Selectors & Performance (High-Value Section)

### 10. How does `useSelector` decide to re-render?
It runs the selector on every store update and compares the result with the previous one using **strict reference equality (`===`)**. If the reference changes, the component re-renders.

Common bug — selector returns a **new reference** every time:
```js
// ❌ new array each call → re-renders on every store update
const active = useSelector((s) => s.todos.filter((t) => !t.done));

// ✅ memoized
const selectActive = createSelector([(s) => s.todos], (todos) => todos.filter((t) => !t.done));
const active = useSelector(selectActive);
```

### 11. What is `createSelector` and why use it?
Creates **memoized derived-data selectors** that recompute only when their input selectors' results change. Use it for filtering/sorting/mapping, expensive computation, and stable references.

```js
const selectTotal = createSelector(
  [(s) => s.cart.items],
  (items) => items.reduce((sum, i) => sum + i.price * i.qty, 0)
);
```
Note: a single `createSelector` instance has a cache size of 1 by default; for per-component parameters, create selector factories (`makeSelectX`) or use parameterized patterns.

### 12. How do you optimize Redux performance in a large app?
1. Select **minimal** data (not `state.user` if you need `state.user.name`).
2. **Memoize** derived data with `createSelector`.
3. **Normalize** state (`createEntityAdapter`), so updates touch one entity.
4. Don't store **derived state** — compute it in selectors.
5. Use `React.memo` for list rows; pass IDs, let rows select their own data.
6. Split slices by feature; avoid giant frequently-updated objects.
7. Virtualize long lists; batch updates; avoid dispatching on every keystroke (debounce).

### 13. What is normalized state and `createEntityAdapter`?
Store collections as `{ ids: [], entities: { [id]: item } }` instead of nested arrays. Gives O(1) lookups, no duplication, and simple updates.

```js
const usersAdapter = createEntityAdapter();           // uses `id` by default
const slice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: { userAdded: usersAdapter.addOne, usersLoaded: usersAdapter.setAll },
});
export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersAdapter.getSelectors((s) => s.users);
```

---

## Part 4 — RTK Query

### 14. What is RTK Query and what does it give you?
A data-fetching and caching layer built on RTK. It provides auto-generated hooks, **caching, request deduplication, loading/error states, polling, refetch on focus/reconnect, and cache invalidation**.

```js
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Post'],
  endpoints: (build) => ({
    getPosts: build.query({
      query: () => 'posts',
      providesTags: (res) => res ? [...res.map(({ id }) => ({ type: 'Post', id })), { type: 'Post', id: 'LIST' }] : [{ type: 'Post', id: 'LIST' }],
    }),
    addPost: build.mutation({
      query: (body) => ({ url: 'posts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});
export const { useGetPostsQuery, useAddPostMutation } = api;
```

### 15. How does cache invalidation with tags work?
Queries declare `providesTags`; mutations declare `invalidatesTags`. When a mutation succeeds, every query that provides a matching tag is **automatically refetched**. Use `{type, id}` tags for granular invalidation.

### 16. How do you implement optimistic updates in RTK Query?
Patch the cache in `onQueryStarted`, then **undo on failure**.

```js
updatePost: build.mutation({
  query: ({ id, ...patch }) => ({ url: `posts/${id}`, method: 'PATCH', body: patch }),
  async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
    const patchResult = dispatch(
      api.util.updateQueryData('getPosts', undefined, (draft) => {
        Object.assign(draft.find((p) => p.id === id), patch);
      })
    );
    try { await queryFulfilled; } catch { patchResult.undo(); }
  },
}),
```
**Optimistic** = update UI first, roll back on error (feels instant). **Pessimistic** = wait for the server, then update (safer for payments/critical data).

### 17. How do you handle auth (token refresh) with RTK Query?
Wrap `baseQuery` to attach the token and handle 401 once with a refresh, then retry.

```js
const baseQueryWithReauth = async (args, api, extra) => {
  let result = await rawBaseQuery(args, api, extra);
  if (result.error?.status === 401) {
    const refresh = await rawBaseQuery('/auth/refresh', api, extra);
    if (refresh.data) result = await rawBaseQuery(args, api, extra);
    else api.dispatch(loggedOut());
  }
  return result;
};
```
Production notes: avoid parallel refresh calls (use a mutex like `async-mutex`), keep tokens out of persisted Redux when possible (prefer HttpOnly cookies).

---

## Part 5 — Architecture & Trade-offs

### 18. Redux vs Context vs Zustand vs React Query — how do you choose?
| Need | Choice |
|---|---|
| Low-frequency global values (theme, locale, auth user) | **Context** |
| Server data (caching, refetching) | **React Query / RTK Query** |
| Complex shared client state, many teams, strict conventions, DevTools/time-travel | **Redux Toolkit** |
| Small/medium shared state with minimal boilerplate | **Zustand** |
| Local UI state | `useState` / `useReducer` |

Why Context isn't a Redux replacement: every consumer re-renders when the value changes, no selectors, no middleware, no devtools.

### 19. When should you NOT use Redux?
Small apps, state used by one component or one subtree, mostly server state (use a query library), or when the team doesn't need the structure. Don't put form input state or ephemeral UI state (hover, modal open) in global Redux unless truly shared.

### 20. How do you structure a Redux Toolkit project?
**Feature-based** ("ducks"/slice per feature):
```
src/
  app/            store.js, hooks.js (typed useAppSelector/useAppDispatch), rootReducer
  features/
    auth/         authSlice.js, authApi.js, selectors.js, components/
    orders/       ordersSlice.js, ordersApi.js, ...
  shared/         ui, utils
```
Keep selectors next to slices, export a public API per feature, and avoid cross-feature deep imports.

### 21. How do you persist Redux state safely?
Use `redux-persist` (or custom localStorage sync) with a **whitelist** — persist only what's needed (UI prefs, cart), not server cache or tokens. Handle migrations/versioning, and ignore persist actions in `serializableCheck`.
```js
serializableCheck: { ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER] }
```

### 22. "Explain the Redux architecture you've used." (Template answer)
> "I organize by **feature slices**. Server data goes through **RTK Query** with tag-based invalidation and optimistic updates for key interactions; client/UI state lives in `createSlice` slices. I use **normalized state** with `createEntityAdapter` for large collections and **memoized selectors** (`createSelector`) to avoid unnecessary re-renders. Side effects use thunks or the listener middleware, and I keep reducers pure and state serializable. For auth I use an RTK Query base query with token refresh. I keep global state minimal — local state stays local — and use typed hooks with TypeScript. The result was fewer re-renders, predictable data flow, and easier onboarding for the team."

*(Replace with a real project example: what you built, the problem, a metric.)*

---

## Rapid-Fire Basics (one-liners)

| Question | Answer |
|---|---|
| Action | Plain object `{ type, payload }` describing what happened |
| Reducer | Pure function `(state, action) => newState` |
| `dispatch` | Sends an action to the store |
| `useSelector` / `useDispatch` | Read from store / get dispatch function |
| Slice | Feature-specific piece of state + its reducers/actions |
| `initialState` | State the slice starts with |
| Loading/error handling | Use `status: 'idle' \| 'loading' \| 'succeeded' \| 'failed'` + `error` |
| Default middleware | thunk + immutableCheck + serializableCheck (checks are dev-only) |
| Query vs Mutation (RTK Query) | Query reads/caches; Mutation changes data and can invalidate tags |
| Common mistakes | Mutating outside reducers, storing derived state, non-serializable values, giant "god" slices, selecting whole state objects |
