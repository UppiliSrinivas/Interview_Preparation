# Phase 16 - API & Networking — Questions & Answers

# REST & GraphQL

### Q319. What is REST API?
An architectural style where resources are exposed via URLs and manipulated using standard HTTP methods; responses are usually JSON.
`GET /users/1`, `POST /users`, `DELETE /users/1`

### Q320. REST Principles
Client–server separation, **stateless** requests, cacheable responses, uniform interface (resources + HTTP verbs), layered system, optional code on demand.

### Q321. GraphQL Basics
A query language where the client asks for exactly the fields it needs from a **single endpoint**, with a typed schema.
```graphql
query { user(id: 1) { name posts { title } } }
```

### Q322. REST vs GraphQL
| REST | GraphQL |
|---|---|
| Many endpoints | One endpoint |
| Fixed response shape (over/under-fetching) | Client picks fields |
| HTTP caching is simple | Caching is more complex |
| Versioned APIs | Schema evolution |

---

# HTTP Methods

### Q323. GET vs POST
- **GET**: read data; parameters in the URL; cacheable; idempotent and safe.
- **POST**: create/submit data; body carries payload; not idempotent.

### Q324. PUT vs PATCH
- **PUT**: replace the **entire** resource (idempotent).
- **PATCH**: update **part** of a resource.

### Q325. DELETE Request
Removes a resource; idempotent (deleting twice leaves the same end state). Typically returns `204 No Content` or `200`.

### Q326. Common HTTP Status Codes
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 301/302 | Redirect |
| 304 | Not Modified |
| 400 | Bad Request |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (not allowed) |
| 404 | Not Found |
| 409 | Conflict |
| 429 | Too Many Requests |
| 500 | Server Error |
| 502/503 | Bad Gateway / Unavailable |

---

# API Clients

### Q327. Fetch API
Built-in browser API returning promises.
```js
const res = await fetch('/api/users');
if (!res.ok) throw new Error(res.status);
const data = await res.json();
```
Note: `fetch` doesn't reject on HTTP errors (404/500) — only on network failure.

### Q328. Axios
Promise-based HTTP client with extras: automatic JSON, interceptors, timeouts, cancellation, and rejects on non-2xx.
```js
const { data } = await axios.get('/api/users');
```

### Q329. Axios vs Fetch
| Fetch | Axios |
|---|---|
| Built-in, no dependency | External library |
| Manual JSON parsing and error check | Auto JSON, throws on errors |
| No interceptors (write wrappers) | Interceptors built in |
| Timeout via `AbortController` | `timeout` option |

---

# Advanced Networking

### Q330. Request Interceptors
Code that runs before every request — commonly to attach auth tokens or headers.
```js
api.interceptors.request.use(cfg => { cfg.headers.Authorization = `Bearer ${token}`; return cfg; });
```

### Q331. Response Interceptors
Code that runs on every response/error — handle 401 (refresh token and retry), global error toasts, data transformation.
```js
api.interceptors.response.use(r => r, async err => {
  if (err.response?.status === 401) { await refresh(); return api(err.config); }
  throw err;
});
```

### Q332. Retry Mechanisms
Retry transient failures (network errors, 502/503/429) with **exponential backoff + jitter** and a max attempts limit. Only retry idempotent requests safely. React Query/RTK Query have built-in retries.

### Q333. API Caching
Avoid refetching unchanged data: HTTP caching (`Cache-Control`, `ETag`), client caches (React Query, RTK Query, SWR) with stale-while-revalidate, and invalidation after mutations.

---

# UI Data Patterns

### Q334. Pagination
Load data in pages.
- **Offset/page**: `?page=2&limit=20` (simple, can skip/duplicate if data changes)
- **Cursor-based**: `?cursor=abc` (stable for large/changing data)

### Q335. Infinite Scrolling
Load more items as the user nears the bottom, usually via `IntersectionObserver` on a sentinel element (or `useInfiniteQuery`). Pair with virtualization for long lists.

### Q336. Debounced Search
Wait until the user stops typing (e.g., 300ms) before calling the API, and cancel stale requests.
```jsx
useEffect(() => {
  const t = setTimeout(() => search(query), 300);
  return () => clearTimeout(t);
}, [query]);
```

### Q337. Authentication Flow
Login → receive tokens → store (access in memory, refresh in HttpOnly cookie) → attach token via interceptor → refresh on 401 → redirect to login on failure → protect routes. (See Phase 14, Q289.)
