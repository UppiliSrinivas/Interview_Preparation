# Phase 8 - React Router — Questions & Answers

*(Examples use React Router v6+ syntax.)*

### Q107. React Router
The standard routing library for React. It maps URLs to components and handles navigation without full page reloads (client-side routing).

### Q108. BrowserRouter
A router that uses the HTML5 History API (clean URLs like `/about`). Wrap your app once.
```jsx
<BrowserRouter><App /></BrowserRouter>
```
Server must return `index.html` for unknown paths.

### Q109. Route
Maps a path to an element.
```jsx
<Route path="/about" element={<About />} />
```

### Q110. Routes
Container that picks the **best matching** `Route` and renders it (replaced `Switch` from v5).
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Q111. Link vs NavLink
- `Link`: navigates without reload.
- `NavLink`: same, but knows if it's **active** (adds `active` class or lets you style via callback).
```jsx
<NavLink to="/home" className={({ isActive }) => isActive ? 'on' : ''}>Home</NavLink>
```

### Q112. useNavigate
Hook for programmatic navigation.
```jsx
const navigate = useNavigate();
navigate('/dashboard');
navigate(-1);                       // back
navigate('/login', { replace: true });
```

### Q113. Dynamic Routes
Use URL params with `:`.
```jsx
<Route path="/users/:id" element={<User />} />
const { id } = useParams();
```

### Q114. Nested Routes
Child routes render inside the parent's `<Outlet />`.
```jsx
<Route path="/dashboard" element={<Layout />}>
  <Route index element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>
// Layout: <Outlet />
```

### Q115. Protected Routes
Wrap routes with a guard that redirects unauthenticated users.
```jsx
function Protected({ children }) {
  return isAuth ? children : <Navigate to="/login" replace />;
}
<Route path="/profile" element={<Protected><Profile /></Protected>} />
```
Remember: client-side guards are UX only — enforce access on the server.

### Q116. Lazy Routes
Code-split each route with `React.lazy` + `Suspense` so a page's JS loads only when visited.
```jsx
const Reports = lazy(() => import('./Reports'));
<Suspense fallback={<Spinner />}>
  <Route path="/reports" element={<Reports />} />
</Suspense>
```
(Data routers also support a `lazy` route property.)
