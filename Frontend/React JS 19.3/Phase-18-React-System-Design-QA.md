# Phase 18 - React System Design — Questions & Answers

*Use this framework in interviews: **Requirements → Component tree → Data model/state → API → Performance → Accessibility/Edge cases → Trade-offs.***

# Application Design

### Q353. Dashboard Design
- **Requirements**: multiple widgets, filters, date ranges, real-time updates.
- **Components**: `DashboardLayout` → `FilterBar`, `WidgetGrid` → `Widget` (chart/table/KPI).
- **State**: filters in URL/global store; widget data via React Query (per-widget cache).
- **Data**: independent API per widget, parallel fetch, polling/WebSocket for live data.
- **Performance**: lazy-load widgets, memoize charts, virtualize tables, skeleton loaders.
- **Edge cases**: partial failures (error boundary per widget), empty states, permissions per widget.

### Q354. Chat Application Design
- **Components**: `ChatLayout` → `ConversationList`, `MessageList` (virtualized), `MessageInput`.
- **Transport**: WebSocket (fallback to polling); reconnect with backoff.
- **State**: normalized messages by conversation ID; optimistic send (`useOptimistic`) with pending/failed status.
- **Features**: typing indicators, read receipts, unread counts, infinite scroll upward, scroll-anchoring.
- **Performance**: virtualization, batching incoming messages, message dedupe by ID.
- **Edge cases**: offline queue, ordering, duplicates, attachments, reconnection gaps (fetch since last ID).

### Q355. Notification System Design
- **Types**: toasts (transient), in-app inbox (persistent), push notifications.
- **Components**: `NotificationProvider`, `ToastContainer` (portal), `NotificationBell` + list.
- **State**: queue with auto-dismiss, priority, deduplication; unread count from server.
- **Delivery**: WebSocket/SSE for live; polling fallback; service worker for push.
- **A11y**: `role="status"`/`aria-live`, dismiss with keyboard, don't steal focus.

### Q356. File Upload System Design
- **Flow**: select/drag-drop → validate (type/size) → upload → progress → result.
- **Large files**: chunked/resumable uploads or **pre-signed URLs** direct to storage (S3).
- **State per file**: `queued | uploading | paused | failed | done` + progress %.
- **Features**: parallel limit, retry with backoff, cancel (`AbortController`), previews, multiple files.
- **Security**: server-side validation, virus scan, never trust client MIME type.

### Q357. Search System Design
- **Input**: debounced (300ms), cancel stale requests, min length.
- **Results**: server-side search; highlight matches; keyboard navigation (↑/↓/Enter) with ARIA combobox.
- **Caching**: cache by query; recent searches in localStorage.
- **Scale**: pagination/infinite scroll, filters/facets in URL, empty/error states.
- **Advanced**: autosuggest endpoint, typo tolerance (backend), analytics.

---

# Component Design

### Q358. Data Table Design
- **Features**: sorting, filtering, pagination (server-side for large data), column resize/visibility, row selection, sticky header.
- **Architecture**: headless logic (e.g., TanStack Table) + presentational cells.
- **Performance**: virtualize rows, memoize cells, stable column definitions, avoid inline functions.
- **API**: `columns`, `data`, `onSortChange`, `onPageChange`, `renderCell`.
- **A11y**: proper `<table>` semantics, `aria-sort`, keyboard navigation.

### Q359. Reusable Component Library
- **Principles**: design tokens (colors/spacing/typography), composition over configuration, accessible by default, headless primitives (Radix) + styling.
- **API design**: consistent props, controlled + uncontrolled support, polymorphic `as`, `ref` forwarding.
- **Tooling**: Storybook, TypeScript types, unit + visual regression tests, semantic versioning, changelog, tree-shakable exports.
- **Theming**: CSS variables or theme provider; dark mode.

### Q360. Multi-Step Form Design
- **State**: single form state (React Hook Form / reducer) across steps; current step in URL.
- **Validation**: per-step schema (Zod/Yup); block "Next" until valid.
- **UX**: progress indicator, back navigation preserving data, save draft (localStorage/API), confirmation step.
- **Edge cases**: conditional steps, browser refresh, async validation, submit once with loading/error handling.

---

# Architecture

### Q361. Folder Structure
```
src/
  app/ (router, providers, store)
  features/<feature>/ (components, hooks, api, slice, tests, index.ts)
  shared/ (ui, hooks, utils, types)
  services/ (api client)
```
Organize by feature, expose a public API per feature, keep shared code truly generic.

### Q362. Feature-Based Architecture
Each feature owns its UI, state, API calls, and tests. Benefits: easier ownership, lazy-loading per feature, simple deletion, fewer cross-dependencies. Enforce boundaries with lint rules (e.g., no deep imports).

### Q363. Monorepo vs Polyrepo
Monorepo (pnpm/Nx/Turborepo): shared code, atomic changes, unified tooling. Polyrepo: independent ownership and releases, but dependency drift. Choose monorepo for shared design systems and multiple apps.

### Q364. Micro Frontends
Independent teams build/deploy separate frontend apps composed at runtime (Module Federation, single-spa). Pros: team autonomy, independent deploys. Cons: shared dependency/versions, consistency, bundle duplication, complexity. Use only for large orgs.

### Q365. Scalable React Architecture
Feature-based modules, clear state strategy (server state vs client state), design system, TypeScript, code splitting, error boundaries, testing pyramid, CI/CD, observability (Sentry, Web Vitals), accessibility, performance budgets, documented conventions (ADRs).
