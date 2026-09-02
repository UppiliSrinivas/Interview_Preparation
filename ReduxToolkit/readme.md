# Redux Toolkit Interview Questions (Top 50) - React.js (6 Years)

> Concise interview notes with simple answers and examples.

## 1. What is Redux Toolkit?
Redux Toolkit (RTK) is the official way to write Redux. It reduces boilerplate and provides utilities like `configureStore`, `createSlice`, and `createAsyncThunk`.

```js
const store = configureStore({ reducer: { user: userReducer }});
```

## 2. Why Redux Toolkit over Redux?
- Less boilerplate
- Built-in Immer
- Better defaults
- Easier async handling

## 3. What is configureStore()?
Creates the Redux store with DevTools and default middleware enabled.

## 4. What is createSlice()?
Combines state, reducers and action creators in one place.

```js
const counterSlice = createSlice({
 name:'counter',
 initialState:{count:0},
 reducers:{
   increment:(state)=>{state.count++}
 }
})
```

## 5. Why can we mutate state?
RTK uses Immer, which creates immutable updates behind the scenes.

## 6. What is Immer?
Library that lets you write mutable-looking code safely.

## 7. What is a Slice?
A feature-specific piece of Redux state.

## 8. What is initialState?
Default state used when the store initializes.

## 9. What is an Action?
A plain object describing what happened.

## 10. What is a Reducer?
A pure function that returns the next state.

## 11. What is dispatch()?
Sends an action to the store.

## 12. What is useSelector()?
Reads data from Redux store.

## 13. What is useDispatch()?
Returns dispatch function.

## 14. What is createAsyncThunk?
Handles async operations like API calls.

## 15. Async thunk lifecycle?
pending → fulfilled → rejected.

## 16. How do you handle loading?
Maintain loading boolean in state.

## 17. How do you handle errors?
Store error message in state.

## 18. What is extraReducers?
Handles actions generated outside the slice.

## 19. Difference: reducers vs extraReducers?
reducers => local actions.
extraReducers => external actions.

## 20. What is serializableCheck?
Warns if non-serializable data enters Redux.

## 21. What is immutableCheck?
Detects accidental mutations.

## 22. What middleware comes by default?
Thunk, serializableCheck, immutableCheck.

## 23. What is createSelector?
Creates memoized selectors.

## 24. Why memoization?
Avoids unnecessary recalculations.

## 25. What causes rerenders with useSelector?
Returned value reference changes.

## 26. How to optimize useSelector?
Select minimal state and memoize.

## 27. What is normalized state?
Store entities by id instead of nested arrays.

## 28. What is createEntityAdapter?
Helps manage normalized collections.

## 29. Benefits of Entity Adapter?
CRUD helpers, selectors, performance.

## 30. What is RTK Query?
Built-in data fetching and caching solution.

## 31. Query vs Mutation?
Query reads. Mutation changes data.

## 32. What is cache invalidation?
Refresh stale cached data after mutations.

## 33. What are tags in RTK Query?
Used for cache invalidation.

## 34. Optimistic update?
Update UI before server response.

## 35. Pessimistic update?
Wait for server before updating UI.

## 36. Redux vs Context API?
Redux for complex global state. Context for simple shared state.

## 37. When should you use Redux?
Shared, complex application state.

## 38. When avoid Redux?
Small apps/local component state.

## 39. Can reducers call APIs?
No. Reducers must stay pure.

## 40. Why reducers must be pure?
Predictable and testable.

## 41. Can reducers be async?
No.

## 42. Can Redux store functions?
Avoid storing non-serializable values.

## 43. Best folder structure?
Feature-based (features/auth, features/users).

## 44. Authentication state?
Store auth/user info; keep tokens securely.

## 45. Persist Redux state?
Use redux-persist when needed.

## 46. Redux DevTools?
Inspect actions and state changes.

## 47. Common performance tips?
Memoized selectors, normalized state, React.memo.

## 48. Common mistakes?
Mutating outside reducers, storing derived state, oversized store.

## 49. Explain your Redux architecture.
Organize by feature, async with thunks/RTK Query, memoized selectors.

## 50. Difference between Redux Toolkit and Redux?
RTK is the recommended abstraction over Redux with less code, better defaults, and improved developer experience.
