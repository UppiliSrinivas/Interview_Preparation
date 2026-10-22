# What Happens When You Hit a URL & Debugging a Blank Screen

> Interview preparation guide for React / Full Stack roles.
> Covers the full request-to-render journey, React rendering models, and a structured approach to debugging blank screens in production.

---

## Table of Contents

1. [How to Answer This Question](#1-how-to-answer-this-question)
2. [Browser Checks Before Any Network Call](#2-browser-checks-before-any-network-call)
3. [DNS Resolution](#3-dns-resolution)
4. [TCP Connection](#4-tcp-connection)
5. [TLS Handshake](#5-tls-handshake)
6. [HTTP Request](#6-http-request)
7. [Server Response and Status Codes](#7-server-response-and-status-codes)
8. [Critical Rendering Path](#8-critical-rendering-path)
9. [Script Loading: async vs defer](#9-script-loading-async-vs-defer)
10. [How React Apps Render: CSR vs SSR vs SSG](#10-how-react-apps-render-csr-vs-ssr-vs-ssg)
11. [Why Blank Screens Happen in React](#11-why-blank-screens-happen-in-react)
12. [Debugging Workflow Overview](#12-debugging-workflow-overview)
13. [Step 1: Console Tab](#13-step-1-console-tab)
14. [Step 2: Network Tab](#14-step-2-network-tab)
15. [Step 3: Elements Tab](#15-step-3-elements-tab)
16. [Step 4: Code-Level Causes](#16-step-4-code-level-causes)
17. [Step 5: Production Debugging](#17-step-5-production-debugging)
18. [Prevention Strategies](#18-prevention-strategies)
19. [Model Answer to Say Out Loud](#19-model-answer-to-say-out-loud)
20. [Follow-Up Questions and Answers](#20-follow-up-questions-and-answers)
21. [Quick Revision Cheat Sheet](#21-quick-revision-cheat-sheet)

---

## 1. How to Answer This Question

This is usually a **two-part question**:

1. What happens behind the scenes when you hit a URL?
2. If the user sees a blank screen, what could be wrong and how do you debug it?

**Strategy:**

- Start with a **high-level flow** in 30 to 60 seconds.
- Go deeper only where the interviewer shows interest.
- Connect the flow to **React**, because that is where blank screens usually come from.
- Answer debugging in a **fixed order**: Console → Network → Elements → Code → Production tools.
- Finish with **prevention**. This is what makes it a senior-level answer.

**The full flow at a glance:**

```
URL typed
  → Browser checks (HSTS, cache, service worker)
  → DNS lookup (domain → IP)
  → TCP handshake
  → TLS handshake (HTTPS)
  → HTTP request (CDN → load balancer → server)
  → HTTP response (HTML + status code)
  → Parse HTML → DOM, parse CSS → CSSOM
  → Run JavaScript
  → Render tree → Layout → Paint → Composite
  → React mounts (for a client-rendered app)
```

---

## 2. Browser Checks Before Any Network Call

Before sending anything over the network, the browser tries to avoid work.

| Check | What it does |
|---|---|
| **URL parsing** | Splits the URL into protocol, domain, port, path and query string |
| **HSTS check** | If the site is on the HSTS list, the browser forces HTTPS even if you typed `http://` |
| **HTTP cache** | If a valid cached copy exists (based on `Cache-Control`), it may be used with no network call |
| **Service worker** | In a PWA, a service worker can intercept the request and answer from its own cache |

**Why it matters:**
Service workers and caches are a common cause of **"users still see the old broken version after a fix"**.

---

## 3. DNS Resolution

DNS converts a domain name like `example.com` into an IP address like `93.184.216.34`.

**Lookup order:**

```
Browser DNS cache
  → OS cache
  → Router cache
  → ISP's recursive resolver
  → Root server
  → TLD server (.com)
  → Authoritative name server (returns the IP)
```

- Each answer is cached for a time called **TTL** (Time To Live).
- Low TTL = faster changes when you switch servers, but more lookups.

**Interview point:**
DNS problems show up as **"This site can't be reached"**, not as a blank screen. If the user sees a blank page, DNS already worked.

---

## 4. TCP Connection

TCP gives a **reliable, ordered** connection between browser and server.

**Three-way handshake:**

```
Browser → Server : SYN       ("I want to connect")
Server  → Browser: SYN-ACK   ("OK, I'm ready")
Browser → Server : ACK       ("Great, let's start")
```

- **HTTP/1.1 and HTTP/2** run over TCP.
- **HTTP/3** uses **QUIC over UDP**, which combines connection and encryption setup into fewer round trips. It is faster on bad mobile networks.

---

## 5. TLS Handshake

For HTTPS, the browser and server set up encryption.

**Simplified steps:**

1. Browser says which encryption methods it supports.
2. Server sends its **SSL/TLS certificate**.
3. Browser verifies the certificate against trusted **Certificate Authorities**.
4. Both sides agree on a shared **session key**.
5. All further data is encrypted with that key.

| Version | Round trips |
|---|---|
| TLS 1.2 | 2 |
| TLS 1.3 | 1 (and 0 for repeat visits) |

**Interview point:**
Certificate problems show a **browser security warning page**, not a blank screen.

---

## 6. HTTP Request

The browser sends the request, for example:

```http
GET /dashboard HTTP/2
Host: example.com
Accept: text/html
Accept-Encoding: gzip, br
Cookie: session=abc123
User-Agent: Mozilla/5.0 ...
```

**The path the request usually travels:**

```
Browser → CDN → Load Balancer → Reverse Proxy (Nginx) → App Server → Database
```

| Layer | Job |
|---|---|
| **CDN** | Serves static files (JS, CSS, images) from a location near the user |
| **Load balancer** | Spreads traffic across multiple servers |
| **Reverse proxy** | Handles SSL, compression, routing, caching |
| **App server** | Runs your backend code (Node/Express, Django) |

---

## 7. Server Response and Status Codes

The server responds with a **status code**, **headers** and a **body** (usually HTML).

| Code | Meaning | Typical cause |
|---|---|---|
| **200** | OK | Success |
| **301 / 302** | Redirect | Moved permanently / temporarily |
| **304** | Not Modified | Browser can use its cached copy |
| **401** | Unauthorized | Missing or expired token |
| **403** | Forbidden | Logged in but no permission |
| **404** | Not Found | Wrong path or missing file |
| **500** | Internal Server Error | Bug in backend code |
| **502** | Bad Gateway | Proxy can't reach the app server |
| **503** | Service Unavailable | Server overloaded or down for maintenance |

**Important response headers:**

- `Content-Type` – what kind of data this is (`text/html`, `application/javascript`)
- `Cache-Control` – how long the browser may cache it
- `Set-Cookie` – stores session or auth data
- `Content-Security-Policy` – controls which scripts are allowed to run

---

## 8. Critical Rendering Path

This is how the browser turns HTML, CSS and JS into pixels.

```
HTML  → DOM
CSS   → CSSOM
DOM + CSSOM → Render Tree → Layout → Paint → Composite
```

| Step | What happens |
|---|---|
| **1. DOM** | HTML is parsed top to bottom into a tree of nodes |
| **2. CSSOM** | CSS is parsed into a style tree. CSS is **render-blocking**, the browser won't paint until it's ready |
| **3. JavaScript** | A normal `<script>` **pauses HTML parsing** until it downloads and runs |
| **4. Render tree** | Combines DOM and CSSOM. Only **visible** elements are included (`display: none` is skipped) |
| **5. Layout (reflow)** | Calculates the size and position of every element |
| **6. Paint** | Fills in pixels: colors, text, borders, images |
| **7. Composite** | Combines layers into the final screen. `transform` and `opacity` are GPU-accelerated here |

**Performance tip to mention:**
Animating `transform` and `opacity` is cheap because it only triggers compositing. Animating `width`, `top` or `left` triggers layout and paint again, which is expensive.

---

## 9. Script Loading: async vs defer

```html
<!-- Blocks HTML parsing until downloaded and executed -->
<script src="app.js"></script>

<!-- Downloads in parallel, runs as soon as ready (order NOT guaranteed) -->
<script async src="analytics.js"></script>

<!-- Downloads in parallel, runs after HTML is parsed, in order -->
<script defer src="app.js"></script>

<!-- ES modules are deferred by default -->
<script type="module" src="main.js"></script>
```

| Attribute | Blocks parsing? | Execution order | Best for |
|---|---|---|---|
| none | Yes | In order | Rarely needed today |
| `async` | No | Whatever finishes first | Independent scripts like analytics |
| `defer` | No | In document order | Application bundles |
| `type="module"` | No | Deferred by default | Modern apps (Vite uses this) |

---

## 10. How React Apps Render: CSR vs SSR vs SSG

### Client-Side Rendering (CSR) – Vite, Create React App

The server sends an almost empty HTML file:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/index-a1b2c3.js"></script>
  </body>
</html>
```

Then React mounts:

```jsx
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
```

**Until this JavaScript runs successfully, the user sees nothing.**

### Comparison

| Model | What server sends | When user sees content | Example |
|---|---|---|---|
| **CSR** | Empty HTML + JS bundle | After JS downloads and runs | Vite, CRA |
| **SSR** | Fully rendered HTML per request | Immediately, then **hydration** makes it interactive | Next.js (dynamic pages) |
| **SSG** | Prebuilt HTML from build time | Immediately, served from CDN | Next.js static pages, Astro |

**Hydration:**
In SSR, React attaches event handlers to HTML that the server already rendered. The page is visible before it is interactive.

**Key line for the interview:**
> "In a CSR app, any JavaScript failure means the user sees nothing. That's why blank screens are mainly a CSR problem. SSR and SSG reduce this because HTML arrives already rendered."

---

## 11. Why Blank Screens Happen in React

Since **React 16**, if a component throws an error during rendering and nothing catches it, **React unmounts the entire component tree**.

```jsx
function UserList({ data }) {
  // If data is undefined, this throws:
  // "Cannot read properties of undefined (reading 'map')"
  return data.users.map((u) => <p key={u.id}>{u.name}</p>);
}
```

One crashing component → whole app disappears → **blank white screen**.

**Why React does this:**
Showing broken or corrupted UI (for example, a wrong payment amount) is worse than showing nothing. React expects you to use **Error Boundaries** to decide what to show instead.

**Main categories of blank screen causes:**

| Category | Example |
|---|---|
| JavaScript runtime error | Accessing a property of `undefined` |
| Bundle failed to load | 404 on JS chunk after deployment |
| API failure not handled | 401 or CORS error, component renders nothing |
| Routing issue | No route matches, or server has no SPA fallback |
| Configuration | Missing environment variable in production |
| CSS issue | Content exists but is invisible |
| Infinite loop | Tab freezes, nothing renders |

---

## 12. Debugging Workflow Overview

Always debug in this order. It goes from fastest check to deepest.

```
1. Console   → Is there a JavaScript error?
2. Network   → Did files and APIs load correctly?
3. Elements  → Is #root empty, or is content just invisible?
4. Code      → Routing, env variables, state logic
5. Production tools → Source maps, Sentry, reproduce in incognito
```

---

## 13. Step 1: Console Tab

Open **DevTools → Console** and look for red errors.

| Error message | What it means | Fix |
|---|---|---|
| `Cannot read properties of undefined (reading 'map')` | Rendering data before it has loaded | Optional chaining, default values, loading state |
| `Uncaught SyntaxError: Unexpected token '<'` | Browser expected JS but received HTML | Fix the asset path or server fallback rules |
| `ChunkLoadError` / `Failed to fetch dynamically imported module` | A lazy-loaded chunk no longer exists, usually after a new deployment | Reload on chunk error, fix caching of `index.html` |
| `process is not defined` | Using `process.env` in Vite | Use `import.meta.env.VITE_*` |
| `Minified React error #...` | Production error with hidden details | Enable source maps, check the React error decoder link |
| `Maximum update depth exceeded` | Infinite re-render loop | Fix state updates inside render or effects |

**Fix example for undefined data:**

```jsx
function UserList({ data }) {
  const users = data?.users ?? [];

  if (users.length === 0) {
    return <p>No users found.</p>;
  }

  return users.map((u) => <p key={u.id}>{u.name}</p>);
}
```

---

## 14. Step 2: Network Tab

Open **DevTools → Network**, enable **Disable cache**, and reload.

### What to look for

**A. JS or CSS files returning 404**

- Cause: wrong base path when the app is deployed in a subfolder.

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/my-app/", // must match the deployed subfolder
});
```

**B. JS file returning HTML**

- Check the response's `Content-Type`. If it says `text/html` for a `.js` file, the server is sending `index.html` for a missing file.
- This causes `Unexpected token '<'` in the console.

**C. API failures**

| Status | Likely problem |
|---|---|
| 401 | Token expired or missing |
| 403 | User lacks permission |
| 500 | Backend bug |
| CORS error | Backend doesn't allow your frontend's origin |

If the component doesn't handle these errors, it may render nothing.

**D. Request pending forever**

- A slow API with no loading state looks exactly like a blank screen.

---

## 15. Step 3: Elements Tab

Open **DevTools → Elements** and inspect `<div id="root">`.

This one check **splits the problem in half**:

| What you see | Meaning | Look at |
|---|---|---|
| `#root` is **empty** | React never mounted, or crashed and unmounted | Console errors, failed bundles |
| `#root` **has content** but nothing visible | It's a CSS problem | Styles below |

**Common CSS causes:**

- `display: none` or `visibility: hidden` on a parent
- `opacity: 0` (often a stuck animation)
- `height: 0` with `overflow: hidden`
- Wrong `z-index` with an overlay covering everything
- White text on a white background
- A full-screen loader that never gets removed

---

## 16. Step 4: Code-Level Causes

### A. Routing problems

**No route matches the URL:**

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Catch-all so unknown URLs don't render nothing */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Refreshing `/dashboard` gives 404 or blank in production:**
The server looks for a real `/dashboard` file. It needs an **SPA fallback** to always serve `index.html`.

```nginx
# Nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### B. Missing environment variables

Works locally, blank in production because `API_URL` is `undefined`.

```js
// Vite: only variables starting with VITE_ are exposed to the browser
const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error("VITE_API_URL is not defined");
}
```

### C. Conditional rendering that never resolves

```jsx
function Profile() {
  const { user, loading, error } = useUser();

  // Bad: if user never loads, the screen stays empty forever
  // if (!user) return null;

  // Good: handle every state explicitly
  if (loading) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <p>Please log in.</p>;

  return <h1>Welcome, {user.name}</h1>;
}
```

### D. Infinite loop in useEffect

```jsx
// Bad: setItems creates a new array → effect runs again → forever
useEffect(() => {
  setItems([...items, newItem]);
}, [items]);

// Good: functional update, no dependency on items
useEffect(() => {
  setItems((prev) => [...prev, newItem]);
}, [newItem]);
```

### E. Auth redirect loop

Login page redirects to dashboard because a stale token exists, and dashboard redirects back to login because the token is invalid. Fix by validating the token in one place and clearing it on failure.

### F. Browser compatibility

Modern syntax not supported by older browsers (for example, old Safari). Fix with proper build targets:

```js
// vite.config.js
export default defineConfig({
  build: {
    target: "es2018",
  },
});
```

### G. Stale cache after deployment

Old cached `index.html` points to JS files like `index-old123.js` that were deleted by the new deploy. Fix in the [Prevention](#18-prevention-strategies) section.

---

## 17. Step 5: Production Debugging

| Technique | Why it helps |
|---|---|
| **Reproduce in incognito** | Rules out cache, extensions and old service workers |
| **Source maps** | Map minified code back to the original file and line number |
| **Error monitoring (Sentry, LogRocket, Datadog)** | Shows real user errors, browser, device, and actions before the crash |
| **Compare environments** | "Works locally, fails in production" points to env variables, base path, server config or CORS |
| **Check recent deployments** | Most production blank screens start right after a release |
| **Test on the user's browser and device** | Catches compatibility issues |

**Sentry setup example:**

```jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
});
```

---

## 18. Prevention Strategies

This is the part that makes your answer **senior-level**.

### A. Error Boundaries

An Error Boundary catches rendering errors in its child components and shows a fallback UI instead of a blank screen.

```jsx
import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Send to monitoring service
    console.error("Caught by ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Usage: wrap the app, and also individual sections
<ErrorBoundary>
  <App />
</ErrorBoundary>;
```

**What Error Boundaries do NOT catch:**

| Not caught | Use instead |
|---|---|
| Errors in event handlers | `try/catch` inside the handler |
| Async code (`setTimeout`, promises, `fetch`) | `try/catch` or `.catch()` |
| Server-side rendering errors | Server error handling |
| Errors inside the boundary itself | A parent boundary |

> Error Boundaries must be **class components**. In practice, many teams use the `react-error-boundary` library for a hooks-friendly API.

### B. Defensive rendering

- Always handle **loading**, **error** and **empty** states.
- Use optional chaining and defaults: `data?.items ?? []`.

### C. Cache strategy

| File | Cache rule | Why |
|---|---|---|
| `index.html` | `Cache-Control: no-cache` | Always get the latest file references |
| Hashed JS/CSS (`index-a1b2c3.js`) | Cache for a long time (1 year) | Filename changes when content changes |

### D. Recover from chunk load errors

```js
window.addEventListener("vite:preloadError", () => {
  // Reload once to fetch the new index.html and chunk names
  if (!sessionStorage.getItem("chunk-reload")) {
    sessionStorage.setItem("chunk-reload", "1");
    window.location.reload();
  }
});
```

### E. Other safeguards

- **Monitoring and alerts** (Sentry, uptime checks)
- **SSR or SSG** for critical pages, so content appears even before JS runs
- **TypeScript** to catch undefined access at compile time
- **Tests and smoke tests** after each deployment
- **Validate environment variables at build time**

---

## 19. Model Answer to Say Out Loud

**About 90 seconds:**

> "When I hit a URL, the browser first checks HSTS and its cache. Then it resolves the domain through DNS, opens a TCP connection, and does a TLS handshake for HTTPS. It sends the HTTP request, which usually goes through a CDN and load balancer to the server. The server returns HTML with a status code, and the browser parses it into the DOM and CSSOM, runs JavaScript, then does layout and paint.
>
> In a client-rendered React app, the HTML is basically an empty root div, so nothing appears until the JS bundle loads and React mounts. That's why blank screens are common in SPAs.
>
> To debug, I start with the console, because an uncaught render error unmounts the whole React tree. Then the network tab, to check for failed bundles, 404 chunks after a deployment, or failing APIs. Then the Elements tab: if the root is empty it's a JS problem, if it has content it's CSS. Common production causes are missing environment variables, wrong base path, no SPA fallback on the server, and stale cache after deployments.
>
> To prevent it, I use error boundaries, proper loading and error states, hashed assets with no-cache on index.html, and Sentry with source maps for production monitoring."

---

## 20. Follow-Up Questions and Answers

**Q1. Why does React unmount the whole tree on an error?**
Showing corrupted UI can be more harmful than showing nothing, for example a wrong price or balance. Error Boundaries let you control what appears instead.

**Q2. Why can't Error Boundaries catch async errors?**
They only catch errors during rendering, lifecycle methods and constructors. Async code runs later, outside React's render cycle.

**Q3. What is hydration, and what causes a hydration mismatch?**
Hydration attaches React's event handlers to HTML rendered on the server. A mismatch happens when server and client render different output, for example using `Date.now()`, `Math.random()` or `window` during render.

**Q4. What's the difference between `async` and `defer`?**
Both download in parallel without blocking parsing. `async` runs as soon as it's ready, in any order. `defer` runs after HTML parsing finishes, in document order.

**Q5. The app works locally but is blank in production. Why?**
Usually environment variables, wrong base path, missing SPA fallback on the server, CORS, or a minification-related issue.

**Q6. How do you improve first load time in a React app?**
Code splitting with `React.lazy` and `Suspense`, tree shaking, brotli compression, CDN delivery, preloading critical assets, image optimization, and SSR or SSG for key pages.

**Q7. What's the difference between reflow and repaint?**
Reflow (layout) recalculates sizes and positions and is expensive. Repaint only redraws colors or visibility without changing layout. Changing `transform` or `opacity` avoids both and only triggers compositing.

**Q8. What is CORS, and why does it cause failures?**
CORS is a browser security rule that blocks requests to a different origin unless the server allows it with headers like `Access-Control-Allow-Origin`. It's fixed on the **backend**, not the frontend.

**Q9. What is a CDN, and why use one?**
A network of servers around the world that store copies of static files. Users download from the nearest server, which reduces latency and load on your main server.

**Q10. How does a service worker cause stale content?**
It can keep serving cached files even after you deploy. Fix by versioning the cache, calling `skipWaiting()` carefully, and prompting users to refresh when a new version is available.

---

## 21. Quick Revision Cheat Sheet

**The flow:**
`HSTS/Cache → DNS → TCP → TLS → HTTP Request → Response → DOM/CSSOM → JS → Layout → Paint → React mounts`

**Debug order:**
`Console → Network → Elements → Code → Production tools`

**Elements tab rule:**
`#root empty = JS problem` · `#root has content = CSS problem`

**Top 6 production causes:**

1. Uncaught render error unmounts the tree
2. 404 on JS chunks after deployment (stale cache)
3. Missing environment variables
4. Wrong base path
5. No SPA fallback on the server
6. Unhandled API failure (401, 500, CORS)

**Top 5 prevention measures:**

1. Error Boundaries
2. Loading, error and empty states
3. `no-cache` on `index.html`, long cache on hashed assets
4. Sentry with source maps
5. SSR or SSG for critical pages
