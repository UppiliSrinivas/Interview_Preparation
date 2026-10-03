# Phase 7 - State Management — Questions & Answers

### Q93. State Management Approaches
- **Local state**: `useState`, `useReducer`
- **Lifted state**: shared via a common parent
- **Context API**: low-frequency global values (theme, auth)
- **External stores**: Redux Toolkit, Zustand, Jotai, Recoil
- **Server state**: React Query / RTK Query / SWR (caching, refetching)
- **URL state**: query params, router
- **Form state**: React Hook Form, Formik

Rule of thumb: keep state as local as possible; use a library only when sharing or complexity demands it.

### Q94. Context API
Built-in way to share values without prop drilling. Best for rarely-changing data. Every consumer re-renders when the value changes, so it isn't ideal for high-frequency updates. (See Phase 6, Q79.)

### Q95. Redux Fundamentals
A predictable state container built on three principles: **single store**, **state is read-only** (change via actions), and **changes are made by pure reducers**.

### Q96. Redux Architecture
One-way data flow:
`UI → dispatch(action) → middleware → reducer → new state in store → UI re-renders (via subscriptions/selectors)`.

### Q97. Redux Store
The object holding the whole app state.
```js
const store = configureStore({ reducer: rootReducer });
store.getState(); store.dispatch(action); store.subscribe(listener);
```

### Q98. Reducers
Pure functions `(state, action) => newState`. Never mutate state or do side effects.
```js
function counter(state = 0, action) {
  switch (action.type) {
    case 'inc': return state + 1;
    default: return state;
  }
}
```

### Q99. Actions
Plain objects describing what happened, with a `type` and optional `payload`.
```js
{ type: 'todos/added', payload: { id: 1, text: 'Learn Redux' } }
```

### Q100. Middleware
Code that sits between dispatching an action and the reducer — for logging, async logic, analytics, crash reporting.
```js
const logger = store => next => action => { console.log(action); return next(action); };
```

### Q101. Redux Thunk
Middleware that lets action creators return a **function** (instead of an object) to handle async logic.
```js
const fetchUser = id => async (dispatch) => {
  dispatch({ type: 'user/loading' });
  const user = await api.get(id);
  dispatch({ type: 'user/loaded', payload: user });
};
```
Included by default in Redux Toolkit.

### Q102. Redux Saga
Middleware that handles side effects using **generator functions** (`takeEvery`, `call`, `put`). Powerful for complex flows (cancellation, debouncing, race conditions) but more boilerplate than thunks.

### Q103. Redux Toolkit
The official, recommended way to write Redux: `configureStore`, `createSlice` (reducers + actions together, Immer allows "mutating" syntax), `createAsyncThunk`, good defaults and DevTools.
```js
const counterSlice = createSlice({
  name: 'counter', initialState: 0,
  reducers: { inc: s => s + 1 },
});
export const { inc } = counterSlice.actions;
```

### Q104. RTK Query
Data fetching and caching built into Redux Toolkit — auto-generated hooks, caching, deduplication, invalidation, loading/error states.
```js
const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: b => ({ getUsers: b.query({ query: () => 'users' }) }),
});
const { data, isLoading } = useGetUsersQuery();
```

### Q105. Context vs Redux
| Context | Redux |
|---|---|
| Built into React | External library |
| Simple shared values | Complex, large-scale state |
| No middleware/devtools | Middleware, DevTools, time-travel |
| Re-renders all consumers | Selector-based fine-grained updates |

### Q106. Zustand vs Redux
| Zustand | Redux Toolkit |
|---|---|
| Tiny, minimal boilerplate | More structure and conventions |
| No provider required | Provider required |
| Hook-based store, selectors | Slices, reducers, middleware |
| Great for small/medium apps | Great for large teams/enterprise |
```js
const useStore = create(set => ({ count: 0, inc: () => set(s => ({ count: s.count + 1 })) }));
```
