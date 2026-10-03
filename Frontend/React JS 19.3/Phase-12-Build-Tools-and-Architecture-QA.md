# Phase 12 - Build Tools, Bundling & Frontend Architecture — Questions & Answers

# Package Managers

### Q193. What is npm?
Node Package Manager — the default registry and CLI for installing and managing JavaScript packages (`npm install`, `npm run build`).

### Q194. What is npx?
Runs a package's binary without installing it globally (downloads temporarily if needed).
```bash
npx create-vite@latest my-app
```

### Q195. npm vs yarn vs pnpm
| | npm | yarn | pnpm |
|---|---|---|---|
| Install | Copies into `node_modules` | Similar, faster caching | Content-addressable store + hard links |
| Disk use | High | Medium | **Lowest** |
| Speed | Good | Good | **Fastest** |
| Strictness | Hoists deps (phantom deps) | Hoists | Strict (no phantom deps) |
| Monorepo | Workspaces | Workspaces | Excellent workspaces |

### Q196. package.json
Project manifest: name, version, scripts, dependencies, devDependencies, `main`/`exports`, `type` (`module`/`commonjs`), engines.

### Q197. package-lock.json
Locks the exact resolved version of every dependency (and sub-dependency) so installs are reproducible across machines and CI. Commit it. Use `npm ci` in CI.

### Q198. dependencies vs devDependencies
- `dependencies`: needed at **runtime** in production (react, axios).
- `devDependencies`: needed only for **development/build** (vite, eslint, jest, typescript).
For a bundled frontend app, the distinction matters less, but keep it clean.

---

# Module Systems

### Q199. CommonJS vs ES Modules
| CommonJS | ES Modules |
|---|---|
| `require()` / `module.exports` | `import` / `export` |
| Synchronous loading | Static, async-capable |
| Dynamic, can't be tree-shaken well | Statically analyzable → **tree-shakable** |
| Node default (legacy) | Browser standard, modern Node |

### Q200. import vs require
`import` is static (hoisted, analyzed at build time); `require` is a runtime function call and can appear anywhere. Use dynamic `import()` for lazy loading in ESM.
```js
import fs from 'fs';           // ESM
const fs = require('fs');      // CJS
```

### Q201. Named Export vs Default Export
```js
export const a = 1;            // named: import { a } from './x'
export default function () {}  // default: import anything from './x'
```
Named exports give better autocompletion, refactoring, and tree-shaking; default exports allow any local name. Many teams prefer named exports.

### Q202. Tree Shaking
Removing **unused exports** from the final bundle. Requires ES modules and side-effect-free code (`"sideEffects": false` in package.json helps).

---

# Bundling Fundamentals

### Q203. What is Bundling?
Combining many source files and dependencies into a few optimized files for the browser.

### Q204. Why is bundling required?
- Browsers historically couldn't resolve `node_modules` imports
- Fewer HTTP requests
- Transform JSX/TypeScript/modern JS
- Minify, tree-shake, and optimize assets
- Code splitting and caching with hashed filenames

### Q205. What is a Module Bundler?
A tool that builds a dependency graph from an entry file and outputs optimized bundles — e.g., Webpack, Rollup, esbuild, Vite (uses Rollup/Rolldown for production), Parcel.

### Q206. What is Tree Shaking?
See Q202. Example: importing `{ debounce }` from lodash-es includes only `debounce`, not the whole library.

### Q207. What is Code Splitting?
Splitting the bundle into chunks loaded on demand (per route/component) so the initial JS is small.
```js
const Page = lazy(() => import('./Page'));
```

### Q208. What is Chunking?
The bundler's result of splitting code into separate output files (**chunks**): entry chunk, async/route chunks, and shared **vendor** chunks (so common libs cache well).

### Q209. Dynamic Imports
`import('./file')` → promise, creates a separate chunk loaded at runtime. Basis of lazy loading.

### Q210. Lazy Loading
Loading code/assets only when needed (`React.lazy`, route-based splitting, `loading="lazy"` for images).

---

# Vite

### Q211. What is Vite?
A modern build tool and dev server. In dev it serves source files as native ES modules (no bundling); for production it bundles with Rollup (Rolldown in newer versions).

### Q212. Why is Vite faster than Webpack?
- **No bundling in dev**: browser loads ES modules directly; only requested files are transformed.
- Dependencies are **pre-bundled once** with esbuild (Go/Rust-speed).
- HMR updates just the changed module, independent of app size.

### Q213. How Vite works during development?
1. Pre-bundles `node_modules` (esbuild) and caches them.
2. Serves your source as native ESM over the dev server.
3. Transforms files on demand (JSX/TS) when the browser requests them.
4. Pushes HMR updates over WebSocket.

### Q214. How Vite works during production?
`vite build` bundles everything with Rollup: tree-shaking, code splitting, minification, CSS extraction, asset hashing, and preload directives.

### Q215. What happens during `vite build`?
Resolve entry (`index.html`) → build module graph → transform (JSX/TS/CSS) → tree-shake → split chunks → minify → emit hashed files to `dist/` (plus manifest if enabled).

### Q216. What is HMR?
**Hot Module Replacement**: swaps only the changed module in the running app without a full reload, preserving state. React Fast Refresh keeps component state during edits.

### Q217. How does Vite optimize builds?
Rollup tree-shaking, automatic code splitting, CSS code splitting, asset inlining for small files, hashed filenames for caching, module preload polyfill, esbuild minification, and dependency pre-bundling.

---

# Webpack

### Q218. What is Webpack?
A highly configurable static module bundler. It builds a dependency graph from an **entry** and emits **bundles**, using **loaders** and **plugins** to process different file types.

### Q219. Entry Point in Webpack
The file where bundling starts.
```js
entry: './src/index.js'
```

### Q220. Output Configuration
Where and how bundles are emitted.
```js
output: { path: path.resolve(__dirname, 'dist'), filename: '[name].[contenthash].js', clean: true }
```

### Q221. Loaders
Transform non-JS files/modules before bundling (`babel-loader`, `css-loader`, `style-loader`, `file-loader`/asset modules).
```js
module: { rules: [{ test: /\.jsx?$/, use: 'babel-loader', exclude: /node_modules/ }] }
```

### Q222. Plugins
Extend Webpack's build process (HTML generation, CSS extraction, minification, env variables, bundle analysis).
```js
plugins: [new HtmlWebpackPlugin({ template: './public/index.html' })]
```
Loaders transform files; plugins hook into the whole build.

### Q223. Babel Loader
Runs files through Babel so modern JS/JSX compiles to browser-compatible code.
`use: 'babel-loader'` with presets `@babel/preset-env` and `@babel/preset-react`.

### Q224. CSS Loader
`css-loader` resolves `@import`/`url()` in CSS and turns it into a JS module; `style-loader` injects it into the DOM (or `MiniCssExtractPlugin` extracts it to files for production).

### Q225. Webpack Build Flow
Read config → start at entry → resolve imports → apply loaders → build dependency graph → apply plugins/optimizations (split, tree-shake, minify) → emit output files.

### Q226. Webpack vs Vite
| Webpack | Vite |
|---|---|
| Bundles in dev too | Native ESM in dev |
| Slower startup/HMR on large apps | Near-instant startup/HMR |
| Very configurable, huge plugin ecosystem | Simpler, sensible defaults |
| Module Federation (micro-frontends) | Plugins/federation via plugins |
| Common in legacy/large enterprise apps | Default for new projects |

---

# Babel

### Q227. What is Babel?
A JavaScript compiler that converts modern JS/JSX/TS into code that older browsers and runtimes can run.

### Q228. Why is Babel needed?
To use new syntax (optional chaining, JSX) while supporting target browsers, and to apply transforms/plugins (like the React Compiler).

### Q229. JSX to JavaScript Transformation
`@babel/preset-react` converts JSX into function calls.
```jsx
<h1 id="a">Hi</h1>
// → jsx("h1", { id: "a", children: "Hi" })
```

### Q230. Polyfills
Code that adds missing runtime features (e.g., `Promise`, `Array.prototype.at`) in older browsers. Babel doesn't add APIs by itself — use `core-js` via `@babel/preset-env` with `useBuiltIns`.

### Q231. Babel vs TypeScript Compiler
- **Babel**: strips types only (no type-checking), fast, plugin ecosystem.
- **tsc**: type-checks and compiles.
Common setup: Babel/SWC/esbuild for transpiling + `tsc --noEmit` for type checking.

---

# Performance Optimization

### Q232. How do you reduce React bundle size?
- Code splitting & lazy routes
- Tree-shaking (ESM imports, `lodash-es`)
- Replace heavy libs (moment → date-fns/dayjs)
- Analyze with `rollup-plugin-visualizer` / `webpack-bundle-analyzer`
- Compress (gzip/brotli), minify
- Optimize images, remove unused CSS
- Avoid importing whole icon/UI libraries
- Use `import type` and production builds

### Q233. Tree Shaking Internals
Bundler analyzes static `import/export` to mark unused exports ("dead code"), then the minifier removes them. Breaks with CommonJS, dynamic access, or side-effectful modules.

### Q234. Code Splitting Strategies
- **Route-based** (most common)
- **Component-based** (modals, charts, editors)
- **Vendor splitting** (stable libs cache longer)
- **Prefetch/preload** likely next chunks

### Q235. Lazy Loading Routes
```jsx
const Dashboard = lazy(() => import('./pages/Dashboard'));
<Route path="/dashboard" element={<Suspense fallback={<Spinner />}><Dashboard /></Suspense>} />
```

### Q236. Image Optimization
Use modern formats (WebP/AVIF), responsive `srcset`, correct dimensions, `loading="lazy"`, compression, and a CDN/image service.

### Q237. CDN Usage
Serve static assets from edge locations close to users for lower latency and offloaded origin traffic. Use hashed filenames + long cache TTLs.

### Q238. Caching Strategies
- Hashed assets: `Cache-Control: public, max-age=31536000, immutable`
- `index.html`: `no-cache` (so new deploys are picked up)
- Service worker caching, API caching (React Query/RTK Query), CDN caching

---

# Environment Management

### Q239. Environment Variables
Config values that change per environment (API URLs, feature flags) kept outside source code.

### Q240. .env Files
Files like `.env`, `.env.development`, `.env.production` that load variables at dev/build time. Don't commit secrets; commit a `.env.example`.

### Q241. Build Time vs Runtime Variables
Frontend env vars are typically **inlined at build time** (the values are baked into the JS bundle). Changing them needs a rebuild. For runtime config, fetch a `config.json` or inject at container start.

### Q242. VITE_ Prefix
Vite only exposes variables starting with `VITE_` to client code, accessed via `import.meta.env.VITE_API_URL`. This prevents accidentally leaking other secrets.

### Q243. Secrets Handling
**Never** put secrets in frontend env vars — anything in the bundle is public. Keep secrets on the server/backend; use CI/CD secret stores for build-time tokens; rotate if leaked.

---

# CI/CD & Deployment

### Q244. What is CI/CD?
- **CI (Continuous Integration)**: auto build, lint, and test on every push/PR.
- **CD (Continuous Delivery/Deployment)**: auto release the tested build to staging/production.

### Q245. Frontend Deployment Process
Commit → PR checks (lint, tests, build) → merge → CI builds `dist/` → upload to hosting/CDN (S3+CloudFront, Vercel, Netlify, Nginx) → invalidate cache → smoke test → rollback if needed.

### Q246. Build Pipeline
Install (`npm ci`) → lint → type-check → unit tests → build → (optional) e2e/Lighthouse → artifact upload → deploy.

### Q247. GitHub Actions
GitHub's CI/CD using YAML workflows in `.github/workflows/`.
```yaml
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm test && npm run build
```

### Q248. Jenkins
A self-hosted, plugin-based automation server using a `Jenkinsfile` (declarative pipelines). Flexible and common in enterprises, but requires you to maintain it.

### Q249. Docker for Frontend Apps
Multi-stage build: build with Node, serve static files with Nginx.
```dockerfile
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
```

### Q250. Nginx Basics
A web server/reverse proxy used to serve static builds. For SPAs, fall back to `index.html`:
```nginx
location / { try_files $uri /index.html; }
location /api/ { proxy_pass http://backend:3000; }
```
Also handles gzip/brotli, caching headers, and HTTPS.

---

# System Design / Architecture

### Q251. How would you structure a large React project?
Feature-based structure with shared layers:
```
src/
  app/            # providers, router, store setup
  features/       # auth/, orders/, inventory/ (components, hooks, api, slice, tests)
  shared/         # ui components, hooks, utils, constants
  services/       # api client, interceptors
  assets/ styles/
```
Principles: colocate by feature, clear public APIs per feature (index.ts), avoid cross-feature imports, lint boundaries, TypeScript, consistent testing.

### Q252. Feature-Based Folder Structure
Group files by **domain/feature** instead of by type, so everything for a feature lives together — easier to scale, own, delete, and lazy-load.

### Q253. Monorepo vs Polyrepo
| Monorepo | Polyrepo |
|---|---|
| One repo, many packages (pnpm/Nx/Turborepo) | One repo per project |
| Easy code sharing, atomic changes | Clear ownership, independent releases |
| Needs tooling for scale | Version/dependency drift, harder sharing |

### Q254. Micro Frontends
Splitting a large frontend into independently built/deployed apps composed at runtime (Module Federation, single-spa, iframes). Good for large multi-team orgs; adds complexity (shared deps, consistency, performance).

### Q255. Scalability Considerations
Modular architecture, code splitting, state-management boundaries, design system, strict TypeScript, testing pyramid, CI/CD, performance budgets, monitoring (Sentry, Web Vitals), feature flags, clear ownership.
