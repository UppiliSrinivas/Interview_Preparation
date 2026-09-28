# Wipro Full-Stack (React + Python): Interview Master Reference

> **Role read:** the front end of an AI workflow / agent orchestration platform, covering workflow visualization, human-in-the-loop (HITL) approvals, live dashboards, governance, and multi-tenant RBAC. Backend is most likely Python/FastAPI.
>
> **56 questions · 12 sections.** Frontend code is TypeScript + React, backend code is Python + FastAPI. Every code block was syntax-checked. All Python, FastAPI, and pure JS/TS examples were also run, so the outputs and status codes in the comments are real.

<a id="plan"></a>
## Tonight's Reading Plan (interview tomorrow, 2 PM)

| Priority | Sections | Why |
|---|---|---|
| **1: Must read** | [2 HITL](#s2), [5 RBAC & Tenancy](#s5), [9 Python](#s9), [10 FastAPI](#s10) | Most specific to this JD. Python is your biggest gap. HITL and RBAC are where your banking experience shines. |
| **2: Should read** | [1 Workflow Viz](#s1), [3 Live Dashboards](#s3), [11 System Design](#s11) | Likely deep-dive or design-round material |
| **3: Skim** | [4](#s4), [6](#s6), [7](#s7), [8](#s8) | You know most of this already, so just refresh the keywords |
| **Morning** | [12 Last-Mile Kit](#s12) | Soundbites, intro, questions to ask |

Each question ends with an **Interview soundbite**, a one-line answer you can say out loud.

<a id="toc"></a>
## Table of Contents

- **[Section 1: Workflow Visualization](#s1)**
  1. [How would you build a workflow (DAG) visualizer in React?](#q1)
  2. [How do you auto-layout the graph?](#q2)
  3. [How do you show live step status without re-rendering the whole graph?](#q3)
  4. [How do you keep a 1,000+ node graph fast?](#q4)
  5. [How do you detect cycles and compute execution order? (Kahn's algorithm)](#q5)
- **[Section 2: Human-in-the-Loop (HITL) Approvals](#s2)**
  6. [What is HITL, and how do you model an approval's lifecycle?](#q6)
  7. [Two approvers click "Approve" at the same time. What happens?](#q7)
  8. [Optimistic or pessimistic UI for approvals?](#q8)
  9. [What makes a good approval queue UX?](#q9)
  10. [How do you frame your banking (maker-checker) experience for this role?](#q10)
- **[Section 3: Live Dashboards & Real-Time Data](#s3)**
  11. [Polling vs SSE vs WebSockets: which one and when?](#q11)
  12. [How do you build a resilient SSE hook?](#q12)
  13. [How do you build a WebSocket client with reconnect and backoff?](#q13)
  14. [How do you handle high-frequency updates without freezing the UI?](#q14)
  15. [How do you stream LLM tokens into the UI?](#q15)
  16. [How do you render very large tables and logs? (Virtualization)](#q16)
- **[Section 4: Governance, Administration & Configuration UIs](#s4)**
  17. [How do you build complex admin forms? (React Hook Form + Zod)](#q17)
  18. [How do you build schema-driven (dynamic) forms?](#q18)
  19. [How do you handle config versioning (draft → publish → rollback)?](#q19)
  20. [How do you design an audit log UI?](#q20)
- **[Section 5: Multi-Tenancy, RBAC & Access Control](#s5)**
  21. [RBAC vs ABAC vs ReBAC: what's the difference?](#q21)
  22. [How do you implement permission-based rendering? (`usePermission` + `<Can>`)](#q22)
  23. [How do you protect routes?](#q23)
  24. [How do you keep tenants isolated on the frontend?](#q24)
  25. [Where do you store auth tokens? (JWT, cookies, XSS, CSRF)](#q25)
  26. [Why is the frontend never the security boundary?](#q26)
- **[Section 6: Responsive, Accessible & Performant UI](#s6)**
  27. [What are the accessibility essentials for enterprise UIs?](#q27)
  28. [How do you make a graph canvas and a live dashboard accessible?](#q28)
  29. [What's your React rendering performance toolkit?](#q29)
  30. [When do you use `useTransition` and `useDeferredValue`?](#q30)
  31. [How do you approach code splitting?](#q31)
  32. [What are Core Web Vitals, and which matter for dashboards?](#q32)
  33. [How do you build responsive dashboard layouts?](#q33)
- **[Section 7: API Contracts & Data Flow](#s7)**
  34. [How do you work contract-first with the backend? (OpenAPI → typed client)](#q34)
  35. [How do you separate server state from client state?](#q35)
  36. [What error and pagination contracts do you agree with the backend?](#q36)
  37. [REST vs GraphQL vs BFF: how do you choose?](#q37)
- **[Section 8: UI Observability & Quality](#s8)**
  38. [How do you handle errors in the UI? (Error boundaries + Sentry)](#q38)
  39. [What does "UI observability" mean in practice? (RUM + tracing)](#q39)
  40. [What's your testing strategy for this kind of UI?](#q40)
- **[Section 9: Python for JavaScript Developers](#s9)**
  41. [JavaScript → Python: what's the quick mapping?](#q41)
  42. [What are comprehensions and generators?](#q42)
  43. [What Python gotchas trip up JavaScript developers?](#q43)
  44. [What are decorators?](#q44)
  45. [What are `*args`, `**kwargs`, and unpacking?](#q45)
  46. [How does async in Python differ from JavaScript? And what is the GIL?](#q46)
  47. [Type hints, dataclasses, and Pydantic: what's the difference?](#q47)
  48. [How do exceptions and context managers work?](#q48)
- **[Section 10: FastAPI (Backend)](#s10)**
  49. [How does FastAPI compare to Express? Show a minimal app.](#q49)
  50. [How do you use Pydantic request and response models in FastAPI?](#q50)
  51. [How does dependency injection work? (auth → tenant → permission)](#q51)
  52. [How do you handle middleware and CORS?](#q52)
  53. [How do you build SSE and WebSocket endpoints in FastAPI?](#q53)
  54. [Build the HITL approval endpoint with optimistic locking and idempotency.](#q54)
  55. [How do background tasks and async DB access work?](#q55)
- **[Section 11: System Design](#s11)**
  56. [Design the frontend for an AI agent workflow platform.](#q56)
- **[Section 12: Last-Mile Kit (read in the morning)](#s12)**

---

<a id="s1"></a>
## Section 1: Workflow Visualization

<a id="q1"></a>
### 1. How would you build a workflow (DAG) visualizer in React?

A workflow is a **directed graph**. Nodes are steps (an LLM call, a tool call, an approval gate) and edges mean "runs after". Don't hand-build canvas math like pan, zoom, drag and edge routing. Use **React Flow** (package `@xyflow/react`), the standard library for node-based UIs. You pass it `nodes` and `edges` arrays and your own **custom node components**, and it handles the canvas.

Design points worth saying:
- Keep the **graph model** (from the API: ids, types, config) separate from the **view model** (positions, selection, zoom).
- Use **one custom node type per step kind** (LLM, tool, approval) so each can show its own icon and status.
- Support **two modes with the same component**: an editable *builder* and a read-only *run viewer*.

```tsx
import { ReactFlow, Background, Controls, MiniMap, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { StepNode } from './StepNode'; // custom node — see Q3

type StepData = { label: string; kind: 'llm' | 'tool' | 'approval' };

// Defined OUTSIDE the component so the reference is stable (see Q4)
const nodeTypes = { step: StepNode };

export function WorkflowCanvas({ nodes, edges, editable = false }: {
  nodes: Node<StepData>[];
  edges: Edge[];
  editable?: boolean;
}) {
  return (
    <div style={{ height: 600 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        nodesDraggable={editable}
        nodesConnectable={editable}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
```

**Interview soundbite:** "Graph structure comes from the API, layout is computed on the client, and live status streams in over SSE and gets patched into nodes by id."

<a id="q2"></a>
### 2. How do you auto-layout the graph?

The backend usually sends nodes and edges **without x/y positions**. A layout engine calculates them:
- **dagre** is simple and synchronous. It produces a layered (top-to-bottom or left-to-right) layout and is good enough for most workflows.
- **elkjs** is more powerful, with better edge routing, nested groups, and ports. It is async and can run in a **Web Worker** for big graphs.

The key performance rule: **re-run layout only when the structure changes** (nodes or edges added or removed). Never re-run it on status updates.

```ts
import { useMemo } from 'react';
import dagre from '@dagrejs/dagre';
import type { Node, Edge } from '@xyflow/react';

const NODE_W = 220;
const NODE_H = 64;

export function layoutGraph<N extends Node>(nodes: N[], edges: Edge[], direction: 'TB' | 'LR' = 'TB'): N[] {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: direction, nodesep: 40, ranksep: 60 });
  g.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_W, height: NODE_H }));
  edges.forEach((e) => g.setEdge(e.source, e.target));

  dagre.layout(g);

  return nodes.map((n) => {
    const { x, y } = g.node(n.id);
    // dagre returns the CENTER point; React Flow expects the TOP-LEFT corner
    return { ...n, position: { x: x - NODE_W / 2, y: y - NODE_H / 2 } };
  });
}

export function useLayoutedNodes<N extends Node>(nodes: N[], edges: Edge[]) {
  // Re-layout only when the STRUCTURE changes — not when a node's status/data changes
  const structureKey =
    nodes.map((n) => n.id).join('|') + '#' + edges.map((e) => `${e.source}>${e.target}`).join('|');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => layoutGraph(nodes, edges), [structureKey]);
}
```

**Interview soundbite:** "dagre for simple layered layouts, elkjs in a worker for big ones, memoized on graph structure so status updates never trigger re-layout."

<a id="q3"></a>
### 3. How do you show live step status without re-rendering the whole graph?

A running workflow emits many events ("step started", "step finished"). If every event replaces the whole `nodes` array, **every node re-renders** and big graphs lag.

Three levels of fix, from okay to best:
1. Wrap custom nodes in `memo`.
2. Update only the changed node, immutably and by id.
3. **Best:** keep statuses in a **separate store** (Zustand) keyed by node id, and let each node **subscribe to only its own status** with a selector. The layout `nodes` array never changes, so only the one affected node re-renders.

```tsx
import { memo } from 'react';
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import { create } from 'zustand';

type StepStatus = 'idle' | 'running' | 'success' | 'failed' | 'waiting_approval';

type RunStore = {
  statusById: Record<string, StepStatus>;
  setStatus: (id: string, status: StepStatus) => void;
  reset: () => void;
};

export const useRunStore = create<RunStore>((set) => ({
  statusById: {},
  setStatus: (id, status) => set((s) => ({ statusById: { ...s.statusById, [id]: status } })),
  reset: () => set({ statusById: {} }),
}));

type StepNodeType = Node<{ label: string }, 'step'>;

export const StepNode = memo(function StepNode({ id, data }: NodeProps<StepNodeType>) {
  // Subscribes to ONLY this node's status → other nodes don't re-render
  const status = useRunStore((s) => s.statusById[id] ?? 'idle');

  return (
    <div className={`step step--${status}`} role="group" aria-label={`${data.label}: ${status}`}>
      <Handle type="target" position={Position.Top} />
      <span>{data.label}</span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

// From the SSE handler (outside React): useRunStore.getState().setStatus(evt.stepId, evt.status);
```

**Interview soundbite:** "Layout lives in React Flow's nodes, status lives in a Zustand store, and each node subscribes to its own slice, so one event re-renders one node."

<a id="q4"></a>
### 4. How do you keep a 1,000+ node graph fast?

- **Stable `nodeTypes` / `edgeTypes`.** Define them outside the component. A new object each render makes React Flow remount every node, and it logs a warning when that happens.
- **`memo` custom nodes** and avoid inline objects or functions as props. Wrap handlers like `onNodeClick` in `useCallback`.
- **`onlyRenderVisibleElements`** renders only the nodes inside the viewport.
- **Status in a separate store** (see Q3).
- **Level of detail:** when zoomed out, render a simple box instead of the full card.
- **Collapse subgraphs:** show 50 group nodes and expand one on click.
- **Layout in a Web Worker** (elkjs) so the main thread stays free.
- **Cheap styling:** avoid heavy `box-shadow`/`filter` on hundreds of nodes, and limit animated edges.

```tsx
import type { ComponentType } from 'react';
import { ReactFlow, useStore, type Node, type Edge } from '@xyflow/react';

// Level of detail: re-renders only when zoom crosses the 0.6 threshold, not on every zoom tick
const showDetailSelector = (s: { transform: [number, number, number] }) => s.transform[2] > 0.6;

export function useShowDetail() {
  return useStore(showDetailSelector);
}

// Inside a custom node:
//   const detailed = useShowDetail();
//   return detailed ? <FullCard data={data} /> : <div className="dot" />;

export function BigGraph({ nodes, edges, nodeTypes }: {
  nodes: Node[];
  edges: Edge[];
  nodeTypes: Record<string, ComponentType<any>>;
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}       // stable reference from module scope
      onlyRenderVisibleElements   // virtualize nodes/edges outside the viewport
      minZoom={0.1}
    />
  );
}
```

**Interview soundbite:** "Viewport-only rendering, memoized nodes with stable types, level of detail on zoom-out, collapsible groups, and layout in a worker."

<a id="q5"></a>
### 5. How do you detect cycles and compute execution order? (Kahn's algorithm)

A workflow builder must **block cycles**, because a DAG has no loops. The run viewer may also want to show **execution order**. Both come from **topological sort (Kahn's algorithm)**:
1. Count each node's **in-degree** (incoming edges).
2. Put every node with in-degree 0 in a queue.
3. Pop a node, add it to the order, and decrement its neighbours' in-degrees. Any neighbour that reaches 0 joins the queue.
4. If fewer nodes were processed than exist, **there is a cycle**.

Time **O(V + E)**, space **O(V + E)**. It is a likely live-coding question because it ties DSA directly to this domain. In React Flow, run the check inside `isValidConnection` to reject an edge **before** it's added.

```js
function topoSort(nodeIds, edges) {
  const indegree = new Map(nodeIds.map((id) => [id, 0]));
  const adj = new Map(nodeIds.map((id) => [id, []]));

  for (const { source, target } of edges) {
    adj.get(source).push(target);
    indegree.set(target, indegree.get(target) + 1);
  }

  const queue = nodeIds.filter((id) => indegree.get(id) === 0);
  const order = [];
  let head = 0; // index pointer instead of queue.shift(), which is O(n)

  while (head < queue.length) {
    const id = queue[head++];
    order.push(id);
    for (const next of adj.get(id)) {
      indegree.set(next, indegree.get(next) - 1);
      if (indegree.get(next) === 0) queue.push(next);
    }
  }

  return order.length === nodeIds.length
    ? { ok: true, order }
    : { ok: false, order: null }; // not all nodes processed → cycle
}

console.log(topoSort(['a', 'b', 'c'], [{ source: 'a', target: 'b' }, { source: 'b', target: 'c' }]));
// { ok: true, order: [ 'a', 'b', 'c' ] }
console.log(topoSort(['a', 'b'], [{ source: 'a', target: 'b' }, { source: 'b', target: 'a' }]));
// { ok: false, order: null }

// Builder usage: reject an edge that would create a cycle
function wouldCreateCycle(nodeIds, edges, newEdge) {
  return !topoSort(nodeIds, [...edges, newEdge]).ok;
}
console.log(wouldCreateCycle(['a', 'b'], [{ source: 'a', target: 'b' }], { source: 'b', target: 'a' }));
// true
```

**Interview soundbite:** "Kahn's algorithm, O(V+E). If the processed count is less than the node count, there's a cycle. I run it in `isValidConnection` so bad edges are never added."

[↑ Back to top](#toc)

---

<a id="s2"></a>
## Section 2: Human-in-the-Loop (HITL) Approvals

<a id="q6"></a>
### 6. What is HITL, and how do you model an approval's lifecycle?

**HITL (human-in-the-loop)** means the AI agent **pauses at a checkpoint** and waits for a person to **approve, reject, or edit** before it continues. Typical checkpoints are "send this email to 5,000 customers?" and "issue this ₹40,000 refund?". The frontend's job is to show *what the agent wants to do and why*, then send the human's decision safely.

Model the approval as a **finite state machine**: explicit states plus allowed transitions. Impossible states like "approved AND rejected" then cannot exist. In TypeScript, use a **discriminated union**, where the `status` field tells TS exactly which other fields exist.

States: `pending → approved | rejected | expired`. All three outcomes are **terminal**. Real systems often add `escalated` and "approved with edits", where the human modified the agent's proposed action.

```tsx
type Approval =
  | { status: 'pending'; id: string; version: number; requestedAt: string; expiresAt: string }
  | { status: 'approved'; id: string; version: number; decidedBy: string; decidedAt: string; editedPayload?: unknown }
  | { status: 'rejected'; id: string; version: number; decidedBy: string; decidedAt: string; reason: string }
  | { status: 'expired'; id: string; version: number; expiredAt: string };

type ApprovalStatus = Approval['status'];

const allowed: Record<ApprovalStatus, ApprovalStatus[]> = {
  pending: ['approved', 'rejected', 'expired'],
  approved: [], // terminal
  rejected: [], // terminal
  expired: [],  // terminal
};

// The server owns the real transition; the UI uses this only to enable/disable buttons
export const canTransition = (from: ApprovalStatus, to: ApprovalStatus) => allowed[from].includes(to);

export function DecisionLine({ a }: { a: Approval }) {
  switch (a.status) {
    case 'pending':
      return <span>Waiting · expires {a.expiresAt}</span>;
    case 'approved':
      return <span>Approved by {a.decidedBy}</span>;
    case 'rejected':
      return <span>Rejected: {a.reason}</span>; // TS knows `reason` exists only here
    case 'expired':
      return <span>Expired</span>;
  }
}
```

For complex flows with escalation chains, multi-level approval, and timeouts, mention **XState**. The statecharts are visualizable, which fits this product nicely.

**Interview soundbite:** "An approval is a state machine: a discriminated union in TS, transitions owned by the server, and terminal states that can never change."

<a id="q7"></a>
### 7. Two approvers click "Approve" at the same time. What happens?

This is the classic race condition. Without protection, **both requests succeed**. The refund can run twice, or one person approves while another rejects and the last write silently wins.

The fixes come in layers:
1. **Optimistic concurrency control.** Every approval has a `version` (or an ETag). The client sends the version it saw (for example in an `If-Match` header). The server updates `WHERE id = ? AND version = ?`. If 0 rows change, it returns **409 Conflict** and the losing UI shows "Already approved by Priya at 10:42".
2. **Idempotency key.** The client generates a UUID **once per click** and reuses it on retries. The server remembers it, so a double-click or network retry returns the same result instead of acting twice.
3. **Disable the button while the request is in flight.** This helps with one user double-clicking, but it can't stop two different users.
4. **Push decisions live** over SSE so other reviewers see the change within a second, which makes conflicts rare.
5. **Segregation of duties.** The requester can never approve their own request, which is the same rule as maker ≠ checker.

```ts
export class ConflictError extends Error {
  constructor(public current: unknown) {
    super('Approval was changed by someone else');
  }
}

export async function decide(
  approvalId: string,
  decision: 'approve' | 'reject',
  version: number,
  idempotencyKey: string, // create ONCE per click (crypto.randomUUID()) and reuse on retries
  reason?: string,
): Promise<unknown> {
  const res = await fetch(`/api/approvals/${approvalId}/decision`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'If-Match': String(version),
      'Idempotency-Key': idempotencyKey,
    },
    body: JSON.stringify({ decision, reason }),
  });

  if (res.status === 409) throw new ConflictError(await res.json());
  if (!res.ok) throw new Error(`Decision failed: ${res.status}`);
  return res.json();
}
```

The backend half of this is in [Q54](#q54).

**Interview soundbite:** "Version check for concurrency, 409 for the loser, an idempotency key for retries, live push to reduce conflicts, and requester ≠ approver."

<a id="q8"></a>
### 8. Optimistic or pessimistic UI for approvals?

- **Optimistic UI** updates the screen immediately and rolls back if the request fails. It is great for low-risk actions like likes, reordering, and toggles.
- **Pessimistic UI** waits for the server to confirm before changing the screen.

**Approvals should be pessimistic.** The decision has **real-world side effects** (money, emails, deployments), it can **conflict** with another reviewer (Q7), and users need **certainty** that it went through. You can still make it *feel* fast: show a spinner on the clicked button, disable both buttons, keep the item in place, then remove it with a success toast. Optimistic updates are still fine for low-risk bits on the same screen, such as "mark as seen", pinning, and filters.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { decide, ConflictError } from './api';

type DecisionVars = {
  id: string;
  decision: 'approve' | 'reject';
  version: number;
  key: string; // idempotency key, created once per click
  reason?: string;
};

export function useDecision(tenantId: string) {
  const qc = useQueryClient();
  const approvalsKey = ['tenant', tenantId, 'approvals'];

  return useMutation({
    mutationFn: (v: DecisionVars) => decide(v.id, v.decision, v.version, v.key, v.reason),
    onSuccess: () => qc.invalidateQueries({ queryKey: approvalsKey }),
    onError: (err) => {
      if (err instanceof ConflictError) {
        // Someone else decided first → refresh the list; the UI shows who decided
        qc.invalidateQueries({ queryKey: approvalsKey });
      }
    },
  });
}

// In the component:
// const m = useDecision(tenantId);
// <button disabled={m.isPending} onClick={() => m.mutate({ id, decision: 'approve', version, key: crypto.randomUUID() })}>
//   {m.isPending ? 'Approving…' : 'Approve'}
// </button>
```

**Interview soundbite:** "Pessimistic for anything with side effects, but fast-feeling: button-level spinner, both buttons disabled, and conflict-aware error handling."

<a id="q9"></a>
### 9. What makes a good approval queue UX?

- **Context first.** Show what the agent wants to do, why (its reasoning and sources), and the impact ("affects 5,000 customers · ₹2.4L"). If the agent edited something, show a diff.
- **Risk and urgency.** Sort by risk and deadline, show a countdown to expiry, and flag escalations.
- **Decision safety.** Require a reason for every reject. High-risk approvals need a typed confirmation or a second approver. The requester can never approve.
- **Edit-then-approve.** Let the human fix the agent's proposed action before approving, for example correcting an email draft. This is a core HITL pattern.
- **Bulk actions** for low-risk items, with a summary confirmation.
- **Keyboard shortcuts** (J/K to move, A/R to decide) for power users, alongside accessible labels.
- **Real-time behaviour.** An item locks or disappears when someone else decides it. A soft "Priya is reviewing" presence indicator prevents conflicts.
- **Audit.** Record who decided, when, and *what they saw* (a snapshot of the proposal).
- **Notifications** in-app and by email or Slack, with a deep link to the exact item. Mobile approval should work well.

```tsx
import { useEffect, useState } from 'react';

// SLA countdown for one item. For long lists, use ONE shared "now" ticker in context
// instead of one interval per row (1,000 rows = 1,000 timers is wasteful).
export function useTimeLeft(expiresAt: string) {
  const target = new Date(expiresAt).getTime();
  const [msLeft, setMsLeft] = useState(() => target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setMsLeft(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  return Math.max(0, msLeft);
}
```

**Interview soundbite:** "Context and impact first, a risk-sorted queue, safe decisions (reasons, second approver, segregation of duties), edit-then-approve, and live locking."

<a id="q10"></a>
### 10. How do you frame your banking (maker-checker) experience for this role?

This is your strongest story, because banking already solved most of these problems:

| Banking term | This JD's term |
|---|---|
| Maker-checker / four-eyes principle | HITL approval |
| Entitlements | RBAC permissions |
| Segregation of duties | Requester ≠ approver |
| Regulatory audit trail | Governance / audit log |
| Legal-entity or country segregation | Multi-tenancy |
| Transaction limits | Policy thresholds (auto-approve below X) |
| Stale data / concurrent checkers | Optimistic locking, 409 Conflict |

**STAR template.** Fill it in with your **real** details, and don't share client-confidential internals.

```text
S — At Standard Chartered (via TCS), I worked on [module/feature]. [Transaction type] needed
    [maker-checker / entitlement-based access] because of [regulatory / risk reason].
T — I was responsible for [the approval screens / entitlement-driven UI / audit view / ...].
A — I [built X: e.g. permission-driven rendering, conflict handling when two checkers acted,
    audit history view, form validation for limits]. The tricky part was [stale data /
    entitlements changing mid-session / performance of large queues].
R — [Outcome: fewer errors, faster approvals, passed audit, reused across N screens].
Bridge — "HITL approvals in an AI platform are the same pattern. The 'maker' is an agent
          instead of a person, and the same rules apply: versioning, segregation of duties, audit."
```

**Interview soundbite:** "HITL is maker-checker where the maker is an AI agent. I've worked in that world, with the same concurrency, entitlement, and audit concerns."

[↑ Back to top](#toc)

---

<a id="s3"></a>
## Section 3: Live Dashboards & Real-Time Data

<a id="q11"></a>
### 11. Polling vs SSE vs WebSockets: which one and when?

| | Polling | SSE (Server-Sent Events) | WebSocket |
|---|---|---|---|
| Direction | Client pulls | Server → client | Both ways |
| Protocol | Plain HTTP | Plain HTTP (`text/event-stream`) | `ws://` upgrade |
| Reconnect | N/A | **Built in**, resumes with `Last-Event-ID` | You build it |
| Auth | Normal headers/cookies | Native `EventSource`: **cookies only**, no custom headers | Cookie, short-lived token in URL, or first message |
| Proxies / load balancers | Trivial | Easy (it's HTTP) | Needs upgrade + often sticky sessions |
| Best for | Data that changes every 30s+ | Run status, notifications, LLM streaming | Chat, collaborative editing, bidirectional control |

**Rule of thumb for this product:** use **SSE for server-to-client events** (run status, new approvals) and **normal REST calls for commands** (approve, cancel). Choose WebSockets only when the client also sends frequent messages, as in collaborative editing or live cursors. Use polling with `refetchInterval` for slow-changing KPIs.

**Gotcha:** on **HTTP/1.1**, browsers allow about **6 connections per domain**, so several tabs each holding an SSE stream can starve other requests. **HTTP/2** multiplexes everything over one connection and removes the problem.

```ts
import { useQuery } from '@tanstack/react-query';

declare function fetchMetrics(): Promise<{ runsToday: number; failed: number }>;

// Polling is perfectly fine for slow-changing KPIs
export function useKpis(tenantId: string) {
  return useQuery({
    queryKey: ['tenant', tenantId, 'kpis'],
    queryFn: fetchMetrics,
    refetchInterval: 30_000, // pauses automatically while the tab is hidden (default behaviour)
  });
}
```

**Interview soundbite:** "SSE for server-to-client events, REST for commands, WebSockets only for truly bidirectional features, polling for slow KPIs. And HTTP/2, so SSE doesn't hit the connection limit."

<a id="q12"></a>
### 12. How do you build a resilient SSE hook?

`EventSource` **reconnects automatically**, and on reconnect it sends the **`Last-Event-ID` header** so the server can replay missed events. Its limits are that it only does **GET** and can't set **custom headers**, so auth has to go through cookies. If you need a bearer token or POST, use fetch-based streaming instead (for example `@microsoft/fetch-event-source`, or the pattern in Q15).

Hook design rules:
- Open the connection in `useEffect` and **close it on unmount**.
- Keep the handler in a **ref**, so a new handler doesn't cause a reconnect.
- Expose the **connection state** so the UI can show a "Reconnecting…" banner.
- Handle the **CLOSED** state. That means the browser gave up, for example because the server returned 401, and the app must react.

```tsx
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type ConnState = 'connecting' | 'open' | 'reconnecting' | 'closed';

export function useEventStream<T>(url: string | null, onEvent: (data: T) => void) {
  const handlerRef = useRef(onEvent);
  useLayoutEffect(() => {
    handlerRef.current = onEvent; // always call the latest handler, without reconnecting
  });                              // (React 19.2+: useEffectEvent does this for you)

  const [state, setState] = useState<ConnState>('connecting');

  useEffect(() => {
    if (!url) return;
    setState('connecting');
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => setState('open');
    es.onerror = () => {
      // CONNECTING → browser is retrying; CLOSED → it gave up (e.g. 401/500 response)
      setState(es.readyState === EventSource.CLOSED ? 'closed' : 'reconnecting');
    };
    es.onmessage = (e: MessageEvent<string>) => {
      try {
        handlerRef.current(JSON.parse(e.data) as T);
      } catch {
        console.warn('Bad SSE payload', e.data);
      }
    };

    return () => es.close();
  }, [url]);

  return state;
}

// Usage with the store from Q3:
// const conn = useEventStream<RunEvent>(`/api/runs/${runId}/events`,
//   (e) => useRunStore.getState().setStatus(e.stepId, e.status));
// {conn === 'reconnecting' && <Banner>Reconnecting…</Banner>}
```

**Interview soundbite:** "EventSource gives me auto-reconnect and Last-Event-ID replay. I keep the handler in a ref, expose connection state, and treat CLOSED as an auth or server problem."

<a id="q13"></a>
### 13. How do you build a WebSocket client with reconnect and backoff?

WebSockets **don't reconnect on their own**. A production client needs:
- **Exponential backoff with jitter.** When the server restarts, 10,000 clients shouldn't all reconnect in the same second (the "thundering herd" problem). A random delay spreads them out.
- **A heartbeat (ping/pong).** Proxies and load balancers silently drop idle connections, often after about 60 seconds.
- **No reconnect after an intentional close**, such as unmount or logout, including cancelling a reconnect that's already scheduled.
- **Resubscribe** to topics after each reconnect.

```ts
type Listener = (msg: unknown) => void;

export class ReconnectingSocket {
  private ws: WebSocket | null = null;
  private attempt = 0;
  private closedByUser = false;
  private heartbeat?: ReturnType<typeof setInterval>;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private listeners = new Set<Listener>();

  constructor(private url: string, private maxDelayMs = 30_000) {}

  connect(): void {
    this.closedByUser = false;
    this.open();
  }

  private open(): void {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.attempt = 0; // reset backoff after a successful connection
      this.heartbeat = setInterval(() => this.send({ type: 'ping' }), 25_000);
      // resubscribe to topics here
    };

    this.ws.onmessage = (e: MessageEvent<string>) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type !== 'pong') this.listeners.forEach((l) => l(msg));
      } catch {
        /* ignore malformed frames */
      }
    };

    this.ws.onclose = () => {
      clearInterval(this.heartbeat);
      if (this.closedByUser) return;
      // "Full jitter": random delay in [0, min(max, 500ms * 2^attempt)]
      const cap = Math.min(this.maxDelayMs, 500 * 2 ** this.attempt++);
      this.reconnectTimer = setTimeout(() => this.open(), Math.random() * cap);
    };
  }

  send(msg: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }

  close(): void {
    this.closedByUser = true;
    clearTimeout(this.reconnectTimer); // cancel a pending reconnect
    clearInterval(this.heartbeat);
    this.ws?.close();
  }
}
```

**Interview soundbite:** "Exponential backoff with full jitter, a heartbeat to detect dead connections, resubscribe on open, and never reconnect after an intentional close."

<a id="q14"></a>
### 14. How do you handle high-frequency updates without freezing the UI?

An agent run can emit **50+ events per second**. Calling `setState` for each one means 50 renders per second plus chart redraws. React 18's automatic batching only merges updates **within the same tick**, and socket messages arrive in separate tasks, so it doesn't help here.

The fix:
1. **Buffer events** and **flush once per animation frame** (about 16 ms), or every 250 ms for charts.
2. Write the batch into the **TanStack Query cache** with `setQueryData`, so every component reading that query updates together.
3. **Ignore out-of-order events** by comparing timestamps or sequence numbers.
4. **Cap history** (keep the last N points, like a ring buffer) so memory doesn't grow forever.
5. `requestAnimationFrame` **pauses in background tabs**, so flush on `visibilitychange` or fall back to `setTimeout`.

```ts
import type { QueryClient } from '@tanstack/react-query';

type StepEvent = { stepId: string; status: string; ts: number };
type RunSnapshot = { steps: Record<string, { status: string; updatedAt: number }> };

export function createEventBatcher(qc: QueryClient, tenantId: string, runId: string) {
  let buffer: StepEvent[] = [];
  let scheduled = false;

  const flush = () => {
    scheduled = false;
    const batch = buffer;
    buffer = [];

    qc.setQueryData<RunSnapshot>(['tenant', tenantId, 'run', runId], (prev) => {
      if (!prev) return prev;
      const steps = { ...prev.steps };
      for (const e of batch) {
        // Ignore stale / out-of-order events
        if ((steps[e.stepId]?.updatedAt ?? 0) <= e.ts) {
          steps[e.stepId] = { status: e.status, updatedAt: e.ts };
        }
      }
      return { ...prev, steps };
    });
  };

  return (e: StepEvent) => {
    buffer.push(e);
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(flush); // at most ONE cache update per frame
    }
  };
}
```

**Interview soundbite:** "Buffer socket events and flush once per frame into the query cache, drop out-of-order events, and cap history."

<a id="q15"></a>
### 15. How do you stream LLM tokens into the UI?

Agent platforms stream model output **token by token**. Use **`fetch` + `ReadableStream`**, which, unlike `EventSource`, supports POST bodies and auth headers. The details that matter:
- `TextDecoder` with `{ stream: true }`. A multi-byte character (Tamil, emoji) **can be split across two chunks**, and this option handles it.
- Chunks don't align with lines, so **keep the incomplete last line** in a buffer.
- **Cancel** with `AbortController` to power a Stop button.
- **Sanitize before rendering markdown.** Model output is untrusted content and can contain XSS (use DOMPurify).
- For very fast streams, **append to a ref and flush per frame** (as in Q14) instead of calling `setState` per token.

```ts
export async function streamCompletion(
  body: unknown,
  onToken: (t: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch('/api/agent/stream', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) throw new Error(`Stream failed: ${res.status}`);

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffered = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffered += decoder.decode(value, { stream: true }); // handles split multi-byte chars

    const lines = buffered.split('\n');
    buffered = lines.pop() ?? ''; // keep the incomplete last line for the next chunk

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const payload = line.slice(6);
      if (payload === '[DONE]') return;
      onToken(JSON.parse(payload).token);
    }
  }
}

// Stop button:
// const ctrl = new AbortController();
// streamCompletion(body, appendToken, ctrl.signal);
// ...later: ctrl.abort();
```

**Interview soundbite:** "fetch plus ReadableStream so I can POST with auth, a streaming TextDecoder, a line buffer across chunks, AbortController for Stop, and sanitized output."

<a id="q16"></a>
### 16. How do you render very large tables and logs? (Virtualization)

Agent runs can produce **thousands of log lines**, and admin tables can have 10,000 rows. Rendering all of them creates a huge DOM, slow scrolling, and high memory use. **Virtualization** renders only the visible rows plus a small overscan. Use **TanStack Virtual** (headless) or react-window.

- Virtualization handles what's **already loaded**. For really big datasets, combine it with **server-side pagination and filtering**.
- **Accessibility caveat:** off-screen rows don't exist in the DOM. Set `aria-rowcount`/`aria-rowindex` for grids, and provide in-app search because browser Ctrl+F can't find hidden rows.
- For "tail -f" style logs, **auto-scroll only if the user is already at the bottom**.

```tsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

export function LogViewer({ lines }: { lines: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const v = useVirtualizer({
    count: lines.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 22, // row height estimate in px
    overscan: 10,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }} role="log" aria-label="Run logs">
      <div style={{ height: v.getTotalSize(), position: 'relative' }}>
        {v.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${item.start}px)`,
            }}
          >
            {lines[item.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Interview soundbite:** "Virtualize what's loaded, paginate on the server for the rest, and keep accessibility in mind: row indexes and in-app search."

[↑ Back to top](#toc)

---

<a id="s4"></a>
## Section 4: Governance, Administration & Configuration UIs

<a id="q17"></a>
### 17. How do you build complex admin forms? (React Hook Form + Zod)

- **React Hook Form (RHF)** uses **uncontrolled inputs** (refs), so typing in one field doesn't re-render the whole form. Big admin forms stay fast.
- A **Zod** schema is the **single source of truth** for both validation and the TypeScript type (`z.infer`).
- **Cross-field rules** go in `.refine()` / `.superRefine()`, for example "approval threshold must be ≥ auto-approve limit".
- Accessible errors: link each error to its input with `aria-describedby`, set `aria-invalid`, and use `role="alert"`.
- Server-side errors map back onto fields (see Q36).

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const policySchema = z
  .object({
    name: z.string().min(3, 'At least 3 characters'),
    autoApproveBelow: z.number().min(0),
    requireApprovalAbove: z.number().min(0),
    approverRole: z.enum(['admin', 'reviewer']),
  })
  .refine((v) => v.requireApprovalAbove >= v.autoApproveBelow, {
    message: 'Must be ≥ the auto-approve limit',
    path: ['requireApprovalAbove'],
  });

type PolicyForm = z.infer<typeof policySchema>;

export function PolicyEditor({ onSave }: { onSave: (v: PolicyForm) => Promise<void> }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PolicyForm>({
    resolver: zodResolver(policySchema),
    defaultValues: { name: '', autoApproveBelow: 0, requireApprovalAbove: 1000, approverRole: 'reviewer' },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate>
      <label htmlFor="name">Policy name</label>
      <input id="name" {...register('name')} aria-invalid={!!errors.name} aria-describedby="name-err" />
      {errors.name && <p id="name-err" role="alert">{errors.name.message}</p>}

      <label htmlFor="req">Require approval above (₹)</label>
      <input id="req" type="number" {...register('requireApprovalAbove', { valueAsNumber: true })}
        aria-invalid={!!errors.requireApprovalAbove} aria-describedby="req-err" />
      {errors.requireApprovalAbove && <p id="req-err" role="alert">{errors.requireApprovalAbove.message}</p>}

      {/* other fields omitted */}
      <button type="submit" disabled={!isDirty || isSubmitting}>
        {isSubmitting ? 'Saving…' : 'Save policy'}
      </button>
    </form>
  );
}
```

**Interview soundbite:** "RHF for performance with uncontrolled inputs, Zod as the single source of truth for validation and types, cross-field rules in refine, and accessible error wiring."

<a id="q18"></a>
### 18. How do you build schema-driven (dynamic) forms?

An agent platform has **many tools and connectors**, each with different settings (API key, model, temperature, endpoint URL). Hand-coding a form per connector doesn't scale.

The pattern is for the backend to send a **JSON Schema**, which Pydantic generates for free with `Model.model_json_schema()`. The frontend then **renders fields from the schema** through a field registry.
- Libraries: **react-jsonschema-form (RJSF)** or **JSON Forms**, or a custom renderer when you want full design-system control.
- Add **UI hints** (`ui:widget`, order, help text), because a raw schema alone gives an average UX.
- **Secrets:** never send secret values back to the browser. Show "•••• set" with a Replace button.

```tsx
type FieldSchema =
  | { type: 'string'; title: string; enum?: string[]; format?: 'password' }
  | { type: 'number'; title: string; minimum?: number; maximum?: number }
  | { type: 'boolean'; title: string };

type ObjectSchema = { properties: Record<string, FieldSchema>; required?: string[] };

export function SchemaForm({ schema, value, onChange }: {
  schema: ObjectSchema;
  value: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
}) {
  return (
    <>
      {Object.entries(schema.properties).map(([key, field]) => {
        const id = `f-${key}`;
        const set = (v: unknown) => onChange({ ...value, [key]: v });
        const required = schema.required?.includes(key);

        return (
          <div key={key}>
            <label htmlFor={id}>
              {field.title}
              {required && ' *'}
            </label>
            {field.type === 'boolean' ? (
              <input id={id} type="checkbox" checked={Boolean(value[key])}
                onChange={(e) => set(e.target.checked)} />
            ) : field.type === 'number' ? (
              <input id={id} type="number" min={field.minimum} max={field.maximum}
                value={(value[key] as number | undefined) ?? ''}
                onChange={(e) => set(e.target.valueAsNumber)} />
            ) : field.enum ? (
              <select id={id} value={String(value[key] ?? '')} onChange={(e) => set(e.target.value)}>
                {field.enum.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input id={id} type={field.format === 'password' ? 'password' : 'text'}
                value={String(value[key] ?? '')} onChange={(e) => set(e.target.value)} />
            )}
          </div>
        );
      })}
    </>
  );
}
```

**Interview soundbite:** "Pydantic generates JSON Schema, and the UI renders fields from it through a registry plus UI hints. New connectors need zero frontend code, and secrets never round-trip."

<a id="q19"></a>
### 19. How do you handle config versioning (draft → publish → rollback)?

Governance means changes to agent configs and policies are **controlled and traceable**. The pattern is **immutable versions**:
- Editing creates a **draft**. **Publishing** creates a new version (v7). You never mutate v6.
- **Rollback = publish a copy of an old version as a new version.** History stays linear and auditable.
- UI pieces: a version list, a **diff view** between any two versions, who published and when, and a **required change note**.
- Optional: **publishing itself needs approval**, which is HITL applied to the config. It's a nice tie-in to mention.
- Concurrent editors of the same draft are protected with a version or ETag, as in Q7.

```ts
type Change = { path: string; before: unknown; after: unknown };

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

// Recursive diff of two config objects (arrays compared as whole values)
export function diffConfig(before: unknown, after: unknown, path = ''): Change[] {
  if (isObj(before) && isObj(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((k) => diffConfig(before[k], after[k], path ? `${path}.${k}` : k));
  }
  return JSON.stringify(before) === JSON.stringify(after) ? [] : [{ path, before, after }];
}

console.log(
  diffConfig(
    { model: 'model-a', limits: { maxSteps: 10, timeoutSec: 60 }, tools: ['search'] },
    { model: 'model-b', limits: { maxSteps: 20, timeoutSec: 60 }, tools: ['search', 'email'] },
  ),
);
// [
//   { path: 'model', before: 'model-a', after: 'model-b' },
//   { path: 'limits.maxSteps', before: 10, after: 20 },
//   { path: 'tools', before: [ 'search' ], after: [ 'search', 'email' ] }
// ]
```

**Interview soundbite:** "Immutable versions: draft, then publish as a new version. Rollback republishes an old version. Diff before publish, a required change note, and optionally an approval to publish."

<a id="q20"></a>
### 20. How do you design an audit log UI?

An **audit log** is an **append-only** record of *who did what, when, to which resource, and what changed* (before and after). It serves compliance, and in AI platforms it also answers "why did the agent send this email?".

- **Actors include agents.** `actor.type` can be `user`, `agent`, or `system`.
- The **backend writes the log**, never the frontend, because client-sent logs can be forged. The frontend only displays it.
- UI: a filterable table (actor, action, resource, date range), **cursor pagination** (Q36), a before/after diff viewer (reuse Q19), CSV export, and deep links to the resource.
- **Filters live in the URL** so an auditor can share a link to exactly what they're looking at.
- The UI can never edit or delete entries.

```ts
type AuditEvent = {
  id: string;
  tenantId: string;
  actor: { id: string; name: string; type: 'user' | 'agent' | 'system' };
  action: 'approval.decided' | 'policy.published' | 'role.assigned' | 'agent.run.started';
  resource: { type: string; id: string };
  before?: unknown;
  after?: unknown;
  requestId?: string; // correlate with logs/traces (Q39)
  at: string;         // ISO-8601 UTC; format in the user's timezone
};

type AuditFilters = { actorId?: string; action?: AuditEvent['action']; from?: string; to?: string };

// Filters come from the URL → shareable, back-button friendly, and part of the cache key
export const auditKey = (tenantId: string, f: AuditFilters) => ['tenant', tenantId, 'audit', f] as const;

export function filtersFromUrl(search: string): AuditFilters {
  const p = new URLSearchParams(search);
  return {
    actorId: p.get('actor') ?? undefined,
    action: (p.get('action') as AuditFilters['action']) ?? undefined,
    from: p.get('from') ?? undefined,
    to: p.get('to') ?? undefined,
  };
}
```

**Interview soundbite:** "Append-only, written by the backend, agents as first-class actors, filters in the URL, cursor pagination, and before/after diffs."

[↑ Back to top](#toc)

---

<a id="s5"></a>
## Section 5: Multi-Tenancy, RBAC & Access Control

<a id="q21"></a>
### 21. RBAC vs ABAC vs ReBAC: what's the difference?

- **RBAC (Role-Based):** permissions attach to **roles**, and users get roles. "Reviewers can approve." Simple and the most common model.
- **ABAC (Attribute-Based):** rules use **attributes** of the user, the resource, and the context. "Can approve if amount < user's limit AND same region AND during business hours." Very flexible but harder to reason about.
- **ReBAC (Relationship-Based):** access follows **relationships**. "Can edit a workflow if you're a member of the workflow's project." This is the Google Zanzibar model, with tools like OpenFGA and SpiceDB.

Real systems usually run **RBAC plus a few ABAC rules**. Two frontend rules to state:
1. **Check permissions, not roles.** Use `can('approval:decide')`, not `role === 'admin'`. Roles get renamed and re-scoped, while permission strings stay stable.
2. In multi-tenant apps, **roles are per tenant**. A user can be an admin in tenant A and a viewer in tenant B.

```ts
type Permission =
  | 'workflow:read' | 'workflow:edit' | 'workflow:run'
  | 'approval:decide'
  | 'policy:edit' | 'policy:publish'
  | 'user:manage' | 'audit:read';

// Returned by GET /me for the ACTIVE tenant.
// The server resolves roles → permissions; the frontend never derives them itself.
type Session = {
  user: { id: string; name: string };
  tenantId: string;
  permissions: Permission[];
};
```

**Interview soundbite:** "RBAC as the base, ABAC for limits and conditions. The UI checks permission strings resolved by the server per tenant, never role names."

<a id="q22"></a>
### 22. How do you implement permission-based rendering? (`usePermission` + `<Can>`)

**Centralize** permission checks and never scatter `user.role === 'admin'` across components. A context provides the session, a hook returns checker functions, and a `<Can>` component makes JSX declarative.

**Hide or disable?**
- **Disable with a tooltip** ("Reviewer role required") when the feature is normal and the user might request access. This is better for discoverability.
- **Hide** when the feature is sensitive or irrelevant to that user.

```tsx
import { createContext, useContext, useMemo, type ReactNode } from 'react';

type Permission = string; // use the full union from Q21 in real code
type Session = { tenantId: string; permissions: Permission[] };

const SessionContext = createContext<Session | null>(null);

export function SessionProvider({ session, children }: { session: Session; children: ReactNode }) {
  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function usePermission() {
  const session = useContext(SessionContext);
  if (!session) throw new Error('usePermission must be used inside <SessionProvider>');

  const set = useMemo(() => new Set(session.permissions), [session.permissions]);
  return useMemo(
    () => ({
      can: (p: Permission) => set.has(p),
      canAll: (ps: Permission[]) => ps.every((p) => set.has(p)),
      canAny: (ps: Permission[]) => ps.some((p) => set.has(p)),
    }),
    [set],
  );
}

export function Can({ perform, fallback = null, children }: {
  perform: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { can } = usePermission();
  return <>{can(perform) ? children : fallback}</>;
}

// Usage:
// <Can perform="approval:decide" fallback={<DisabledButton reason="Reviewer role required" />}>
//   <ApproveButton />
// </Can>
```

**Interview soundbite:** "One permission context, a `usePermission` hook and a `<Can>` component. Disable with a reason for discoverable features, hide for sensitive ones."

<a id="q23"></a>
### 23. How do you protect routes?

A route guard stops users from reaching `/admin` by typing the URL. With React Router, use a **layout route** that renders `<Outlet />` when allowed and redirects otherwise.
- **Not logged in** → redirect to `/login`, remembering where they came from.
- **Logged in but not allowed** → show a **403 page**, not the login page.
- **Lazy-load** admin routes (Q31) so users without permission never even download that code.
- Guards are **UX only**. The backend still enforces everything (Q26).

```tsx
import { Navigate, Outlet, useLocation } from 'react-router'; // v7 ('react-router-dom' in v6)
import { usePermission } from './permissions';

export function RequirePermission({ perform }: { perform: string }) {
  const { can } = usePermission();
  const location = useLocation();

  if (!can(perform)) {
    return <Navigate to="/403" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

// <Route element={<RequirePermission perform="policy:edit" />}>
//   <Route path="/t/:tenant/governance/policies" element={<PoliciesPage />} />
// </Route>
```

**Interview soundbite:** "Layout-route guards: 401 goes to login, 403 goes to a forbidden page. Admin chunks are lazy-loaded, and the server enforces regardless."

<a id="q24"></a>
### 24. How do you keep tenants isolated on the frontend?

The risks are **tenant A's data showing after switching to tenant B** (a stale cache), requests going out with the wrong tenant, and data leaking through `localStorage`.

1. **Tenant in the URL** (`/t/acme/workflows`) or subdomain (`acme.app.com`). Links are shareable, context is obvious, and two tabs can work on two tenants.
2. **Every query key starts with the tenant id**, so caches can never mix.
3. **On tenant switch:** cancel in-flight queries, **clear the cache**, reset client stores, and reopen SSE/WebSocket connections for the new tenant.
4. **One API client** injects the tenant header. The **server still verifies** the user belongs to that tenant using the token, never the header alone.
5. **Namespace `localStorage` keys** by tenant and user, and clear them on logout.
6. Load per-tenant **branding and feature flags** with the session.

```ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient();

// Every key starts with the tenant → caches can never mix
export const keys = {
  workflows: (t: string) => ['tenant', t, 'workflows'] as const,
  workflow: (t: string, id: string) => ['tenant', t, 'workflows', id] as const,
  approvals: (t: string, status?: string) => ['tenant', t, 'approvals', { status }] as const,
};

export async function switchTenant(resetStores: () => void) {
  await queryClient.cancelQueries(); // stop in-flight requests for the old tenant
  queryClient.clear();               // drop ALL cached data → no cross-tenant leaks
  resetStores();                     // Zustand/Redux client state
  // then navigate to /t/{next}/… — SSE/WS hooks keyed on tenantId reconnect automatically
}

export function apiFetch(tenantId: string, path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers);
  headers.set('X-Tenant-ID', tenantId); // the server still checks membership from the token
  return fetch(`/api${path}`, { ...init, headers, credentials: 'include' });
}
```

**Interview soundbite:** "Tenant in the URL, tenant-prefixed cache keys, clear everything on switch, and the server validates membership on every request."

<a id="q25"></a>
### 25. Where do you store auth tokens? (JWT, cookies, XSS, CSRF)

| Option | Pros | Cons |
|---|---|---|
| `localStorage` | Easy | **Any injected script can read it**, so an XSS bug steals the token. Avoid for sensitive apps. |
| Access token **in memory** + refresh token in an **httpOnly, Secure, SameSite cookie** | Common SPA pattern; JS can't read the refresh token | The access token is lost on page reload, so the app needs a silent refresh call |
| **BFF with an httpOnly session cookie only** | Browser **never sees tokens**; the most secure option for enterprise; matches the IETF guidance for browser-based OAuth apps | Needs a backend-for-frontend and **CSRF protection** (SameSite + CSRF token) |

Also mention:
- **Short-lived access tokens** (5–15 min) with **refresh token rotation**, and logout that revokes server-side.
- Enterprise login is **SSO via OIDC** (Entra ID, Okta) using **Authorization Code + PKCE**.
- XSS defence: a **Content Security Policy (CSP)**, and never `dangerouslySetInnerHTML` with untrusted content. **LLM output counts as untrusted.**

A common bug is **five parallel requests all getting 401 and firing five refresh calls**. Share one refresh promise:

```ts
let accessToken: string | null = null;
let refreshing: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const res = await fetch('/auth/refresh', { method: 'POST', credentials: 'include' }); // httpOnly cookie
  if (!res.ok) throw new Error('Session expired');
  const { accessToken: t } = (await res.json()) as { accessToken: string };
  accessToken = t;
  return t;
}

export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const withAuth = (t: string | null): RequestInit => {
    const headers = new Headers(init.headers);
    if (t) headers.set('Authorization', `Bearer ${t}`);
    return { ...init, headers };
  };

  const res = await fetch(input, withAuth(accessToken));
  if (res.status !== 401) return res;

  // Many requests may get 401 together → they all await the SAME refresh call
  refreshing ??= refreshAccessToken().finally(() => {
    refreshing = null;
  });
  const fresh = await refreshing;
  return fetch(input, withAuth(fresh));
}
```

**Interview soundbite:** "A BFF with httpOnly cookies is the gold standard. Otherwise, access token in memory and refresh token in an httpOnly cookie, with a single shared refresh promise. CSP for XSS, SameSite plus tokens for CSRF."

<a id="q26"></a>
### 26. Why is the frontend never the security boundary?

Anyone can open DevTools, edit the JavaScript, or call your API directly with `curl`. **Hiding a button stops nobody.** Therefore:
- The **backend checks authentication, tenant membership, and permission on every request**.
- It also checks **per object**: "does this approval belong to *your* tenant?" Skipping this causes **IDOR / BOLA**, which is **#1 in the OWASP API Security Top 10**.
- For another tenant's resource, return **404 rather than 403**, so you don't reveal that it exists.
- **Never put secrets in the bundle.** In Vite, any `VITE_*` env variable is **public**.
- Frontend permission checks exist for **UX**: don't show people things they can't use.

```tsx
// ❌ "Security" by hiding — anyone can still call the API directly:
//    curl -X POST https://app/api/approvals/123/decision -d '{"decision":"approve"}'
{isAdmin && <ApproveButton />}

// ✅ UX check on the client + real enforcement on the server (see Q51):
//    SELECT … FROM approvals WHERE id = :id AND tenant_id = :tenant_from_token
//    → not found? 404.  Missing 'approval:decide'? 403.
```

**Interview soundbite:** "The UI hides things for UX. The server enforces auth, tenant, permission, and object ownership on every request. BOLA is OWASP API #1."

[↑ Back to top](#toc)

---

<a id="s6"></a>
## Section 6: Responsive, Accessible & Performant UI

<a id="q27"></a>
### 27. What are the accessibility essentials for enterprise UIs?

The usual target is **WCAG 2.1 / 2.2 Level AA**. It's increasingly a legal requirement too: the **European Accessibility Act** has applied since June 2025, and the US has ADA and Section 508.

- **Semantic HTML first:** `<button>` instead of `<div onClick>`, real `<label>`s, a proper heading hierarchy, `<th scope>` in tables. As the saying goes, *no ARIA is better than bad ARIA*.
- **Keyboard:** everything reachable with Tab, a **visible focus ring**, logical order, and no focus traps except in modals.
- **Modals:** move focus in, trap it, close on Escape, and return focus to the trigger. The native `<dialog>` with `showModal()` does most of this for you.
- **Contrast:** **4.5:1** for normal text, **3:1** for large text and UI components.
- **Never rely on colour alone.** A status needs colour + icon + text. This matters a lot for red/green run statuses.
- **Async updates:** announce them with `aria-live` regions, and set `aria-busy` while loading.
- **Testing:** axe DevTools, `jest-axe` / `@axe-core/playwright` in CI, a keyboard-only walkthrough, and NVDA or VoiceOver.

```tsx
import { useEffect, useRef, type ReactNode } from 'react';

const STATUS = {
  success: { icon: '✓', label: 'Succeeded' },
  failed: { icon: '✕', label: 'Failed' },
  running: { icon: '◌', label: 'Running' },
} as const;

export function StatusBadge({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status];
  // Colour (CSS class) + icon + text → never colour alone
  return (
    <span className={`badge badge--${status}`}>
      <span aria-hidden="true">{s.icon}</span> {s.label}
    </span>
  );
}

export function ConfirmDialog({ open, onClose, title, children }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal(); // native: focus trap, Esc to close, inert background
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="dlg-title">
      <h2 id="dlg-title">{title}</h2>
      {children}
    </dialog>
  );
}
```

**Interview soundbite:** "Semantic HTML first, full keyboard support, native dialog for modals, AA contrast, never colour alone, live regions for async updates, and axe in CI."

<a id="q28"></a>
### 28. How do you make a graph canvas and a live dashboard accessible?

A graph canvas is visual by nature, which makes this the hard accessibility question for this role.
- **Provide an equivalent alternative view.** A **list or tree of steps with status** behind a "List view" toggle. This is the single best answer.
- **Keyboard support on the canvas.** Nodes are focusable with Tab (React Flow supports this, plus an `ariaLabel` per node), Enter opens details, and arrow keys move between nodes.
- **Announce meaningful changes** in one polite `aria-live` region, for example "Step *Send email* is waiting for approval". **Don't** announce every log line or token.
- **Charts** need a data-table alternative or a text summary. **Don't rely on hover tooltips**, because keyboard and touch users can't hover.
- Respect **`prefers-reduced-motion`** for animated edges and pulsing status dots.

```tsx
import { useState } from 'react';

// One polite live region for the page.
// Call announce() only for meaningful changes (failed, waiting for approval, run finished).
export function useAnnouncer() {
  const [msg, setMsg] = useState('');

  const announce = (text: string) => {
    setMsg('');                                   // clear first so identical text is re-announced
    requestAnimationFrame(() => setMsg(text));
  };

  const region = (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {msg}
    </div>
  );

  return { announce, region };
}
```

```css
/* Visually hidden but readable by screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (prefers-reduced-motion: reduce) {
  .react-flow__edge.animated path,
  .step--running {
    animation: none;
  }
}
```

**Interview soundbite:** "An equivalent list view, keyboard-navigable nodes, a polite live region for meaningful changes only, data tables for charts, and reduced motion."

<a id="q29"></a>
### 29. What's your React rendering performance toolkit?

1. **Measure first:** the React DevTools Profiler ("why did this render?") and Chrome's Performance panel. **React 19.2** adds React-specific tracks to Chrome's Performance panel.
2. **Know the three causes of a re-render:** own state changes, parent re-renders, and context value changes.
3. **Fixes, in order:**
   - **Colocate state.** Move it down to where it's used.
   - **Pass JSX as `children`**, so expensive subtrees don't re-render with the parent.
   - **Split contexts** (value vs setter), or use **selector-based stores** (Zustand) to avoid context re-render storms.
   - `memo` expensive pure children, `useMemo` for expensive calculations and stable object props, `useCallback` for callbacks passed to memoized children.
   - **Stable keys.** Never use array indexes for dynamic lists.
4. **React Compiler** (v1.0 since late 2025) memoizes automatically at build time. Know it exists, but still understand manual memoization for existing codebases.
5. **Don't over-memoize.** `memo` has a cost, so add it where the profiler shows a real problem.

```tsx
import { createContext, memo, useContext, useMemo, useState, type ReactNode } from 'react';

type Filters = { status: string; search: string };

const FiltersValue = createContext<Filters | null>(null);
const FiltersSetter = createContext<((f: Filters) => void) | null>(null);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<Filters>({ status: 'all', search: '' });
  // Split contexts: components that only SET filters don't re-render when filters change
  return (
    <FiltersSetter.Provider value={setFilters}>
      <FiltersValue.Provider value={filters}>{children}</FiltersValue.Provider>
    </FiltersSetter.Provider>
  );
}

export const Row = memo(function Row({ id, label, onOpen }: {
  id: string;
  label: string;
  onOpen: (id: string) => void;
}) {
  return <button onClick={() => onOpen(id)}>{label}</button>;
});

export function Table({ rows, onOpen }: {
  rows: { id: string; label: string }[];
  onOpen: (id: string) => void; // must be stable (useCallback in the parent), or memo(Row) is useless
}) {
  const filters = useContext(FiltersValue)!;
  const visible = useMemo(
    () => rows.filter((r) => r.label.toLowerCase().includes(filters.search.toLowerCase())),
    [rows, filters.search],
  );
  return <>{visible.map((r) => <Row key={r.id} {...r} onOpen={onOpen} />)}</>;
}
```

**Interview soundbite:** "Profile first. Then colocate state, pass children, split contexts or use selectors, and memoize only what the profiler flags. React Compiler automates much of this now."

<a id="q30"></a>
### 30. When do you use `useTransition` and `useDeferredValue`?

Both mark work as **non-urgent**, so typing and clicking stay responsive while a heavy re-render happens in the background. That background render is **interruptible**.
- **`useTransition`:** **you own the state update.** Wrap it in `startTransition` and use `isPending` for a spinner. Examples: switching dashboard tabs, applying a filter to 10,000 rows.
- **`useDeferredValue`:** **you receive a value** (a prop or state) and render the expensive part with a lagging copy. Example: a search box filtering a big list. The expensive child **must be memoized**, or it re-renders with the parent anyway.
- Neither makes work *faster*, only interruptible. For truly heavy computation, use a **Web Worker**.

```tsx
import { memo, useDeferredValue, useState, useTransition } from 'react';

export function WorkflowSearch({ allSteps }: { allSteps: string[] }) {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query); // input stays instant; the list catches up
  const isStale = query !== deferredQuery;

  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search steps" />
      <div style={{ opacity: isStale ? 0.6 : 1 }}>
        <StepList steps={allSteps} query={deferredQuery} />
      </div>
    </>
  );
}

// Must be memoized — otherwise it re-renders with the parent on every keystroke anyway
const StepList = memo(function StepList({ steps, query }: { steps: string[]; query: string }) {
  const q = query.toLowerCase();
  return <ul>{steps.filter((s) => s.toLowerCase().includes(q)).map((s) => <li key={s}>{s}</li>)}</ul>;
});

export function DashboardTabs() {
  const [tab, setTab] = useState<'overview' | 'runs' | 'costs'>('overview');
  const [isPending, startTransition] = useTransition();

  return (
    <div role="tablist" aria-busy={isPending}>
      {(['overview', 'runs', 'costs'] as const).map((t) => (
        <button key={t} role="tab" aria-selected={tab === t} onClick={() => startTransition(() => setTab(t))}>
          {t}
        </button>
      ))}
    </div>
  );
}
```

**Interview soundbite:** "useTransition when I own the update, useDeferredValue when I receive the value. Both make rendering interruptible, not faster. Heavy computation goes to a worker."

<a id="q31"></a>
### 31. How do you approach code splitting?

The **graph editor** (React Flow + a layout engine), **charts**, and **admin/governance screens** are heavy, and a viewer who only approves things shouldn't download them.
- **Route-level splitting** with `React.lazy` + `Suspense`.
- **Prefetch on intent:** start loading on hover or focus of the nav link.
- **Load rarely used libraries on click,** such as XLSX export or PDF generation.
- **Group vendor chunks** (graph, charts, react) so a change in your app code doesn't bust the cache for big libraries. Analyze bundles with `rollup-plugin-visualizer`.
- **Ties to RBAC:** users without admin permission never download admin code.

```tsx
import { lazy, Suspense } from 'react';

const WorkflowEditor = lazy(() => import('./features/editor/WorkflowEditor'));

// Prefetch when the user shows intent (hover/focus on the nav link)
export const prefetchEditor = () => void import('./features/editor/WorkflowEditor');

export function EditorRoute() {
  return (
    <Suspense fallback={<div aria-busy="true">Loading editor…</div>}>
      <WorkflowEditor />
    </Suspense>
  );
}

// Heavy, rarely used library → loaded only when the user clicks "Export"
export async function exportRunsToXlsx(rows: object[]) {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Runs');
  XLSX.writeFile(wb, 'runs.xlsx');
}
```

**Interview soundbite:** "Split by route and by permission, prefetch on intent, lazy-load heavy one-off libraries, and keep vendor chunks cache-stable."

<a id="q32"></a>
### 32. What are Core Web Vitals, and which matter for dashboards?

| Metric | Measures | "Good" | Typical fixes |
|---|---|---|---|
| **LCP**: Largest Contentful Paint | Loading speed | ≤ 2.5 s | Smaller JS, preload key resources, optimized images and fonts |
| **INP**: Interaction to Next Paint | Responsiveness (**replaced FID in March 2024**) | ≤ 200 ms | Break up long tasks, fewer re-renders, `useTransition`, Web Workers |
| **CLS**: Cumulative Layout Shift | Visual stability | ≤ 0.1 | Reserve space for charts, images, and skeletons; don't insert content above the fold |

- These are scored at the **75th percentile of real users**.
- For **logged-in dashboards**, **INP matters most**, since the UI is interactive and data-heavy. LCP matters most for public pages.
- Measure real users (**RUM**) with the `web-vitals` library.

```ts
import { onCLS, onINP, onLCP, type Metric } from 'web-vitals';

function send(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,     // 'LCP' | 'INP' | 'CLS'
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    id: metric.id,
    page: location.pathname,
  });
  // sendBeacon survives page unload; fall back to fetch with keepalive
  if (!navigator.sendBeacon?.('/rum', body)) {
    fetch('/rum', { method: 'POST', body, keepalive: true });
  }
}

onLCP(send);
onINP(send);
onCLS(send);
```

**Interview soundbite:** "LCP, INP, CLS at p75 of real users. For a dashboard, INP is the one I watch, and I track all three via web-vitals RUM."

<a id="q33"></a>
### 33. How do you build responsive dashboard layouts?

Dashboards are used on big monitors and laptops, and **approvals often happen on phones** straight from a notification.
- **CSS Grid with `auto-fit` + `minmax`** gives responsive card grids without media queries.
- **Container queries:** a widget adapts to **its own width**, not the viewport. This is ideal for dashboard widgets placed in slots of different sizes. All modern browsers support it.
- **Mobile:** make the approval inbox a first-class mobile flow with big tap targets (WCAG 2.2 AA minimum is **24×24 px**, **44×44** recommended). Swap the graph canvas for the list view on small screens.
- **Tables** become cards on mobile, or scroll horizontally with a sticky first column.

```css
.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.widget {
  container-type: inline-size;
}

/* The widget changes layout based on ITS OWN width, wherever it's placed */
.widget .kpi {
  display: grid;
  grid-template-columns: 1fr;
}

@container (min-width: 420px) {
  .widget .kpi {
    grid-template-columns: auto 1fr;
  }
}
```

**Interview soundbite:** "Grid auto-fit for layout, container queries so widgets adapt to their slot, and mobile-first approvals with proper tap targets."

[↑ Back to top](#toc)

---

<a id="s7"></a>
## Section 7: API Contracts & Data Flow

<a id="q34"></a>
### 34. How do you work contract-first with the backend? (OpenAPI → typed client)

Frontend and backend **agree on the API shape before building**, and the contract is enforced by tooling rather than memory.
- **FastAPI generates OpenAPI automatically** from its Pydantic models (`/openapi.json`, with Swagger UI at `/docs`). This is the natural bridge between React and Python.
- The frontend **generates TypeScript types** from it with `openapi-typescript` + `openapi-fetch`, or uses **Orval** / **hey-api** to also generate TanStack Query hooks.
- **In CI**, regenerate the types and fail the build when the contract breaks, so a backend change can't silently break the UI.
- **Mock from the spec** (MSW, Prism) so the frontend can start before the backend is ready.
- **Evolving safely:** make additive changes, deprecate fields before removing them, and version the API (`/v2`) only for breaking changes.

```bash
# Generate types from the running FastAPI service (or a committed spec file)
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts
```

```ts
import createClient from 'openapi-fetch';
import type { paths } from './schema';

export const api = createClient<paths>({ baseUrl: '/api', credentials: 'include' });

// Fully typed: path params, query, body and response all come from the FastAPI models
export async function getApproval(id: string) {
  const { data, error } = await api.GET('/approvals/{approval_id}', {
    params: { path: { approval_id: id } },
  });
  if (error) throw error;
  return data; // typed as the backend's ApprovalOut model
}
```

**Interview soundbite:** "FastAPI emits OpenAPI, we generate typed clients from it, CI fails on contract drift, and we mock from the spec to work in parallel."

<a id="q35"></a>
### 35. How do you separate server state from client state?

| Kind | Examples | Tool |
|---|---|---|
| **Server state** (owned by the backend; async; can go stale) | Workflows, runs, approvals | **TanStack Query** (or RTK Query) |
| **Client/UI state** (owned by the browser) | Selected node, open panel, theme | `useState`/`useReducer`; **Zustand** when shared |
| **URL state** | Filters, active tab, page | Router search params (shareable) |
| **Form state** | Unsaved edits | React Hook Form |

**Anti-pattern:** copying server data into Redux or `useState` and syncing it by hand. That's where stale-data bugs come from.

TanStack Query concepts to know cold:
- `queryKey` is the cache id.
- **`staleTime`** is how long data counts as fresh. **`gcTime`** is how long unused data stays cached; it was called `cacheTime` before v5.
- `invalidateQueries` after mutations, `setQueryData` for pushed updates (Q14).
- `placeholderData: keepPreviousData` for smooth pagination.

```ts
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export function useApprovals(tenantId: string, status: string, cursor?: string) {
  return useQuery({
    queryKey: ['tenant', tenantId, 'approvals', { status, cursor }],
    queryFn: async ({ signal }) => {
      const qs = new URLSearchParams({ status, ...(cursor ? { cursor } : {}) });
      const res = await fetch(`/api/approvals?${qs}`, { signal, credentials: 'include' });
      if (!res.ok) throw new Error(`Failed to load approvals: ${res.status}`);
      return res.json();
    },
    staleTime: 10_000,                 // fresh for 10s → no refetch on every mount
    placeholderData: keepPreviousData, // keep the old page visible while the next one loads
  });
}
```

**Interview soundbite:** "Server state in TanStack Query, UI state local or in Zustand, filters in the URL, forms in RHF. I never mirror server data into a client store."

<a id="q36"></a>
### 36. What error and pagination contracts do you agree with the backend?

- **Error shape:** use **RFC 9457 Problem Details** (`type`, `title`, `status`, `detail`, `instance`, plus extensions like field `errors` and a `traceId`). The UI maps field errors onto form fields, shows `detail` in a toast, and shows the `traceId` for support.
- **Status codes:** 400/422 validation (FastAPI's default is **422**), **401** not logged in, **403** no permission, **404** not found (or hidden), **409** conflict (Q7), **429** rate limited (respect `Retry-After`), **5xx** retried with backoff, **but only for idempotent requests**.
- **Pagination:** **cursor-based** for live, growing data (runs, audit logs), because it stays stable while new rows are inserted. **Offset-based** for small, static admin lists that need "page 7 of 20".
- **Dates:** ISO-8601 in UTC on the wire, formatted with `Intl.DateTimeFormat` in the user's timezone.
- **Naming:** Python uses `snake_case` and JS uses `camelCase`. Decide once, for example with Pydantic's camelCase aliases (Q50).

```ts
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  traceId?: string;
  errors?: { field: string; message: string }[];
};

// Field errors → form fields; anything else → a toast message with a support reference
export function applyServerErrors<T extends FieldValues>(p: Problem, setError: UseFormSetError<T>): string | null {
  p.errors?.forEach((e) => setError(e.field as Path<T>, { type: 'server', message: e.message }));
  if (p.errors?.length) return null;
  return `${p.detail ?? p.title}${p.traceId ? ` (ref: ${p.traceId})` : ''}`;
}
```

**Interview soundbite:** "Problem Details for errors with a trace id, proper status codes including 409 and 429, cursor pagination for live data, and UTC ISO dates."

<a id="q37"></a>
### 37. REST vs GraphQL vs BFF: how do you choose?

- **REST:** simple, cacheable, and a natural fit for FastAPI. The risk is **chatty dashboards** that need 10 calls to render one page.
- **GraphQL:** the client picks fields and gets one request per view, plus subscriptions. The costs are harder caching, N+1 queries on the server, **field-level authorization**, and more infrastructure. In Python, Strawberry is the usual library.
- **BFF (Backend-for-Frontend):** a thin server layer, often owned by the frontend team, that **aggregates calls** and shapes data for each screen. It can also hold auth cookies (Q25). It's a good middle ground.

For this role, the likely setup is **REST (FastAPI) + SSE**, with a BFF endpoint for dashboard aggregation. The important thing to show in the interview is that you choose based on need, not hype.

```python
import asyncio

import httpx
from fastapi import FastAPI

app = FastAPI()

@app.get("/bff/dashboard")
async def dashboard(tenant_id: str):  # real code: tenant comes from the auth dependency (Q51)
    # ONE call from the browser → three parallel calls to internal services
    async with httpx.AsyncClient(base_url="http://internal-services", timeout=5) as client:
        runs, approvals, costs = await asyncio.gather(
            client.get("/runs/summary", params={"tenant": tenant_id}),
            client.get("/approvals/pending/count", params={"tenant": tenant_id}),
            client.get("/costs/today", params={"tenant": tenant_id}),
        )
    return {"runs": runs.json(), "pendingApprovals": approvals.json(), "costs": costs.json()}
```

**Interview soundbite:** "REST by default, a BFF to aggregate per screen and hold auth, and GraphQL only when many clients need flexible shapes and we can pay for field-level authorization."

[↑ Back to top](#toc)

---

<a id="s8"></a>
## Section 8: UI Observability & Quality

<a id="q38"></a>
### 38. How do you handle errors in the UI? (Error boundaries + Sentry)

- An **error boundary** catches **render errors** in its subtree and shows a fallback instead of a white screen. It must be a class component, or use the `react-error-boundary` library.
- It **does not catch** errors in event handlers, async code, or SSR. Handle those with try/catch and report them.
- **Place boundaries per widget or panel**, so one broken chart doesn't take down the whole dashboard. Add a Retry button.
- **Report to Sentry** with context: tenant, route, release version, and user id (avoid other PII). **Upload source maps** to Sentry but don't serve them publicly.
- React 19 adds root-level hooks: `createRoot(el, { onCaughtError, onUncaughtError })`.

```tsx
import { Component, type ErrorInfo, type ReactNode } from 'react';
import * as Sentry from '@sentry/react';

type Props = { name: string; children: ReactNode };
type State = { hasError: boolean };

export class WidgetBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, {
      tags: { widget: this.props.name },
      extra: { componentStack: info.componentStack },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert">
          {this.props.name} failed to load.{' '}
          <button onClick={() => this.setState({ hasError: false })}>Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// <WidgetBoundary name="Cost chart"><CostChart /></WidgetBoundary>
```

**Interview soundbite:** "Boundaries per widget with retry, try/catch for async and event handlers, and Sentry with tenant, route, and release tags plus private source maps."

<a id="q39"></a>
### 39. What does "UI observability" mean in practice? (RUM + tracing)

It means knowing **what real users actually experience**:
- **Errors** (Q38) and **performance** (Web Vitals, Q32).
- **API latency and failures, as seen from the browser.**
- **Business and UX metrics:** time-to-approve, SSE disconnect rate, render time of big graphs, and drop-off in key flows.
- **End-to-end tracing** with **OpenTelemetry**. The browser starts a trace and sends the **W3C `traceparent` header**, and FastAPI (instrumented with OTel) continues the **same trace**, giving one trace from click to database query.
- **Correlation IDs** shown in error toasts, so support can find the matching logs.
- Remember **CORS**: the backend must allow the `traceparent` header.

In practice, `@opentelemetry/sdk-trace-web` with fetch instrumentation does this automatically. Here's what it does under the hood:

```ts
declare function reportApiTiming(url: string, status: number, ms: number, traceId: string): void;

function randomHex(bytes: number): string {
  const arr = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function tracedFetch(url: string, init: RequestInit = {}) {
  const traceId = randomHex(16); // 32 hex chars
  const spanId = randomHex(8);   // 16 hex chars
  const headers = new Headers(init.headers);
  headers.set('traceparent', `00-${traceId}-${spanId}-01`); // W3C Trace Context format

  const start = performance.now();
  try {
    const res = await fetch(url, { ...init, headers });
    reportApiTiming(url, res.status, performance.now() - start, traceId);
    return res;
  } catch (err) {
    reportApiTiming(url, 0, performance.now() - start, traceId); // 0 = network failure
    throw err;
  }
}
```

**Interview soundbite:** "RUM for vitals, errors, and API timings from the browser, plus business metrics like time-to-approve, and OpenTelemetry traceparent so one trace spans browser to FastAPI to database."

<a id="q40"></a>
### 40. What's your testing strategy for this kind of UI?

Use the **testing trophy**, where most of the value comes from **integration tests**:
- **Static:** TypeScript, ESLint including `jsx-a11y`.
- **Unit (Vitest):** pure logic such as permission checks, the state machine (Q6), `diffConfig` (Q19), `topoSort` (Q5), and reducers.
- **Integration (React Testing Library + MSW):** test the way a user behaves (`getByRole`) against a mocked API. Cover **permission variations** (viewer vs reviewer), the **409 conflict flow**, and SSE updates.
- **E2E (Playwright):** critical journeys like login → approve → audit log shows the entry, and a tenant switch that leaks no data.
- **Accessibility:** `@axe-core/playwright` / `jest-axe` in CI.
- **Visual regression:** Storybook + Chromatic or Playwright screenshots for the design system.
- **Contract:** generated types (Q34) catch API drift at compile time.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { test, expect, beforeAll, afterAll } from 'vitest';
import { ApprovalCard } from './ApprovalCard';

const server = setupServer(
  http.post('/api/approvals/:id/decision', () =>
    HttpResponse.json({ current: { status: 'approved', decidedBy: 'Priya' } }, { status: 409 }),
  ),
);
beforeAll(() => server.listen());
afterAll(() => server.close());

test('shows who decided first when two approvers conflict', async () => {
  // In a real suite, wrap with QueryClientProvider via a custom render helper
  render(<ApprovalCard id="a1" version={3} />);
  await userEvent.click(screen.getByRole('button', { name: /approve/i }));
  expect(await screen.findByText(/already approved by priya/i)).toBeInTheDocument();
});
```

**Interview soundbite:** "Mostly RTL + MSW integration tests, including permission and conflict paths, Playwright for critical journeys, axe in CI, and generated types for contract safety."

[↑ Back to top](#toc)

---

<a id="s9"></a>
## Section 9: Python for JavaScript Developers

<a id="q41"></a>
### 41. JavaScript → Python: what's the quick mapping?

| JavaScript | Python |
|---|---|
| `const x = 1` / `let x` | `x = 1` (no keyword; `UPPER_CASE` marks constants by convention) |
| `null` / `undefined` | `None` |
| `true` / `false` | `True` / `False` |
| `&&` `\|\|` `!` | `and` `or` `not` |
| `===` | `==` compares values; `is` compares identity (use it for `None`) |
| Array `[1, 2]` | list `[1, 2]`; tuple `(1, 2)` is immutable |
| Object / `Map` | dict `{"a": 1}` |
| `Set` | `set()` or `{1, 2}` |
| `arr.length` | `len(arr)` |
| `arr.map(f)` / `arr.filter(f)` | `[f(x) for x in arr]` / `[x for x in arr if f(x)]` |
| `arr.slice(1, 3)`, `arr.at(-1)` | `arr[1:3]`, `arr[-1]` |
| `` `Hi ${name}` `` | `f"Hi {name}"` |
| `for (const x of arr)` | `for x in arr:` |
| `arr.forEach((x, i) => …)` | `for i, x in enumerate(arr):` |
| `Object.entries(o)` | `o.items()` |
| `o.a ?? 'default'` | `o.get("a", "default")` (for dicts) |
| `try / catch / finally` | `try / except / finally` |
| `throw new Error('x')` | `raise ValueError("x")` |
| `class A extends B` | `class A(B):`, with an explicit `self` |
| `import { x } from 'y'` | `from y import x` |
| `Promise.all` | `asyncio.gather` |
| npm + `package.json` | pip / **uv** + `pyproject.toml`, virtual env |
| ESLint + Prettier | **Ruff** (lint + format); **mypy** / **pyright** for types |
| Jest / Vitest | **pytest** |
| Express | **FastAPI** / Flask / Django |

```python
users = [{"name": "Asha", "role": "admin"}, {"name": "Ravi", "role": "viewer"}]

admins = [u["name"] for u in users if u["role"] == "admin"]   # filter + map in one line
by_name = {u["name"]: u for u in users}                        # like Object.fromEntries(...)
first, *rest = [1, 2, 3]                                       # destructuring with rest
role = by_name.get("Kiran", {}).get("role", "none")            # safe lookup with a default

for i, u in enumerate(users, start=1):
    print(f"{i}. {u['name']} ({u['role']})")

print(admins, first, rest, role)
# 1. Asha (admin)
# 2. Ravi (viewer)
# ['Asha'] 1 [2, 3] none
```

**Interview soundbite:** "Same concepts, different syntax: comprehensions instead of map and filter, dicts instead of objects, `None` instead of null and undefined, and asyncio.gather instead of Promise.all."

<a id="q42"></a>
### 42. What are comprehensions and generators?

- A **list comprehension** `[...]` builds the **whole list immediately**.
- A **generator expression** `(...)` is **lazy**. It produces one item at a time with **O(1) memory**, like a JS iterator.
- A function containing **`yield`** is a **generator function**, the equivalent of JS `function*`.
- Uses: processing big files or logs in chunks, batching, and **streaming responses**. FastAPI's `StreamingResponse` accepts generators, which is how SSE works in Q53.

```python
nums = range(1, 11)

squares = [n * n for n in nums]              # list: built right now
evens = {n for n in nums if n % 2 == 0}      # set comprehension
small_sq = {n: n * n for n in nums if n <= 3}  # dict comprehension
total = sum(n * n for n in nums)             # generator expression: no list in memory

def in_batches(items, size):
    """Generator function — the Python version of function* in JS."""
    batch = []
    for item in items:
        batch.append(item)
        if len(batch) == size:
            yield batch
            batch = []
    if batch:
        yield batch

print(squares[:3], sorted(evens)[:3], small_sq, total)
print(list(in_batches(range(7), 3)))
# [1, 4, 9] [2, 4, 6] {1: 1, 2: 4, 3: 9} 385
# [[0, 1, 2], [3, 4, 5], [6]]
```

**Interview soundbite:** "Comprehensions for eager transforms, generators for lazy, constant-memory streams. `yield` is Python's `function*`."

<a id="q43"></a>
### 43. What Python gotchas trip up JavaScript developers?

1. **Mutable default arguments.** A default is evaluated **once**, when the function is defined, so every call shares the same list. Use `None` instead.
2. **`is` vs `==`.** `is` checks identity. Use `x is None`, but never `is` for comparing strings or numbers.
3. **Truthiness.** Empty `[]`, `{}`, `""`, `0`, and `None` are all falsy. In JS, `[]` and `{}` are **truthy**.
4. **Division.** `/` always returns a float, and `//` is floor division, so `-7 // 2` is `-4`, not `-3`.
5. **Integers never lose precision.** There's no `Number.MAX_SAFE_INTEGER` problem.
6. **Closures in loops bind late.** Lambdas capture the variable, not its value, which is the same trap as `var` in JS loops.
7. **`nonlocal`** is required to *reassign* a variable from an enclosing function.
8. **No `++`**, and **indentation is syntax**.

```python
def add_item_bad(item, items=[]):        # ❌ ONE shared list for every call
    items.append(item)
    return items

def add_item(item, items=None):          # ✅ new list per call
    items = [] if items is None else items
    items.append(item)
    return items

print(add_item_bad(1), add_item_bad(2))  # [1, 2] [1, 2]  ← same list object both times
print(add_item(1), add_item(2))          # [1] [2]

print(bool([]), bool({}), bool(""), bool(0))  # False False False False
print(7 / 2, 7 // 2, -7 // 2)                 # 3.5 3 -4
print(2 ** 64)                                 # 18446744073709551616

fns = [lambda: i for i in range(3)]
print([f() for f in fns])                      # [2, 2, 2]  late binding
fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])                      # [0, 1, 2]  value captured via default arg

def counter():
    count = 0
    def inc():
        nonlocal count                         # needed to reassign the outer variable
        count += 1
        return count
    return inc

c = counter()
c()
print(c())                                     # 2
```

**Interview soundbite:** "Mutable defaults, `is` vs `==`, empty collections being falsy, floor division, and late-binding closures. I know the traps."

<a id="q44"></a>
### 44. What are decorators?

A **decorator** is a function that **takes a function and returns a new function**. It's Python's syntax for **higher-order functions**, like wrapping a handler in JS with `withAuth(handler)`.
- `@decorator` above a `def` is shorthand for `fn = decorator(fn)`.
- A **decorator factory** takes arguments and returns a decorator. FastAPI's `@app.get("/path")` is one.
- Use **`functools.wraps`** so the wrapped function keeps its name and docstring.
- Stacked decorators apply **bottom-up**.
- In FastAPI, use **`Depends` rather than decorators** for auth (Q51), because it's typed, testable, and appears in OpenAPI.

```python
import functools
import time

def timed(fn):
    @functools.wraps(fn)                    # keep fn.__name__ and docstring
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        try:
            return fn(*args, **kwargs)
        finally:
            print(f"{fn.__name__} took {(time.perf_counter() - start) * 1000:.1f}ms")
    return wrapper

def require_permission(perm):               # decorator FACTORY: takes config, returns a decorator
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(user, *args, **kwargs):
            if perm not in user["permissions"]:
                raise PermissionError(f"missing {perm}")
            return fn(user, *args, **kwargs)
        return wrapper
    return decorator

@timed
@require_permission("approval:decide")      # applied bottom-up: timed(require_permission(...)(approve))
def approve(user, approval_id):
    return f"{user['name']} approved {approval_id}"

print(approve({"name": "Asha", "permissions": ["approval:decide"]}, "a1"))
# approve took 0.0ms      (timing varies)
# Asha approved a1
```

**Interview soundbite:** "A decorator is a higher-order function with syntax sugar. Factories take config, `functools.wraps` preserves metadata, and in FastAPI I use Depends for auth instead."

<a id="q45"></a>
### 45. What are `*args`, `**kwargs`, and unpacking?

- **`*args`** collects extra positional arguments into a tuple, like JS rest parameters `...args`.
- **`**kwargs`** collects extra **named** arguments into a dict.
- At the call site, `f(*lst)` spreads a list and `f(**d)` spreads a dict into keyword arguments.
- **Merging dicts:** `{**a, **b}` or `a | b` (Python 3.9+), like `{...a, ...b}`.
- **Keyword-only parameters** come after a bare `*`, so `def f(a, *, strict=False)` forces callers to write `strict=`. It's like an options object in JS.

```python
def log(level, *messages, sep=" ", **context):
    ctx = " ".join(f"{k}={v}" for k, v in context.items())
    print(f"[{level}] {sep.join(messages)} {ctx}".rstrip())

log("INFO", "run", "started", run_id="r1", tenant="acme")
# [INFO] run started run_id=r1 tenant=acme

parts = ["step", "failed"]
meta = {"step": "send_email"}
log("ERROR", *parts, **meta)                   # spread a list and a dict
# [ERROR] step failed step=send_email

defaults = {"model": "small", "temperature": 0.2}
override = {"temperature": 0.7}
print({**defaults, **override})                # like {...defaults, ...override}
print(defaults | override)                     # Python 3.9+
# {'model': 'small', 'temperature': 0.7}
# {'model': 'small', 'temperature': 0.7}

def create_run(workflow_id, *, dry_run=False):  # dry_run must be passed by name
    return workflow_id, dry_run

print(create_run("wf1", dry_run=True))         # ('wf1', True)
```

**Interview soundbite:** "`*args` and `**kwargs` are rest params for positional and named arguments, `*` and `**` at a call site are spread, and a bare `*` forces keyword-only arguments."

<a id="q46"></a>
### 46. How does async in Python differ from JavaScript? And what is the GIL?

**Similar:** `async def` and `await`, and a coroutine is roughly a Promise.

**Different:**
1. JS always has an event loop running. Python needs one started with `asyncio.run()`, though **uvicorn/FastAPI starts it for you**.
2. **Calling an async function doesn't start it.** It returns a coroutine object that runs only when awaited or scheduled with `create_task`. In JS, calling an async function starts it immediately.
3. **Blocking calls freeze the whole loop.** `time.sleep`, `requests.get`, and sync DB drivers stall every request on the server. Use async libraries (`httpx`, `asyncpg`) or move the work to a thread with `await asyncio.to_thread(fn)`. **In FastAPI, a plain `def` endpoint automatically runs in a thread pool.**
4. `Promise.all` → `asyncio.gather`. **`asyncio.TaskGroup`** (3.11+) gives structured concurrency: if one task fails, the rest are cancelled. **`asyncio.timeout()`** (3.11+) replaces racing a promise against a timer.

**The GIL (Global Interpreter Lock):** in standard CPython, **only one thread runs Python code at a time**. Threads don't speed up **CPU-bound** work, so use multiprocessing or a process pool for that. **I/O-bound** work (network, DB) is fine with async or threads. Python 3.13 introduced an optional **free-threaded (no-GIL) build**, officially supported since 3.14 but not the default.

```python
import asyncio
import time

async def fetch_step(name: str, delay: float) -> str:
    await asyncio.sleep(delay)          # non-blocking, like await new Promise(r => setTimeout(r, ms))
    return f"{name} done"

async def main() -> None:
    coro = fetch_step("a", 0.1)          # ⚠️ NOT running yet — just a coroutine object
    print(await coro)                    # runs now

    start = time.perf_counter()
    results = await asyncio.gather(      # like Promise.all → ~0.2s total, not 0.5s
        fetch_step("b", 0.2), fetch_step("c", 0.2), fetch_step("d", 0.1),
    )
    print(results, f"{time.perf_counter() - start:.1f}s")

    async with asyncio.TaskGroup() as tg:      # 3.11+: if one task fails, the others are cancelled
        t1 = tg.create_task(fetch_step("e", 0.1))
        t2 = tg.create_task(fetch_step("f", 0.1))
    print(t1.result(), t2.result())

    try:
        async with asyncio.timeout(0.05):      # 3.11+: cancel if it takes too long
            await fetch_step("slow", 1)
    except TimeoutError:
        print("timed out")

asyncio.run(main())
# a done
# ['b done', 'c done', 'd done'] 0.2s
# e done f done
# timed out
```

**Interview soundbite:** "Coroutines don't start until awaited, blocking calls freeze the loop (FastAPI runs plain `def` endpoints in a thread pool), gather is Promise.all, and the GIL means processes, not threads, for CPU-bound work."

<a id="q47"></a>
### 47. Type hints, dataclasses, and Pydantic: what's the difference?

- **Type hints** look like TS annotations, but **Python doesn't enforce them at runtime**. They're checked by **mypy / pyright**. Useful forms: `list[str]`, `dict[str, int]`, `str | None` (3.10+), `Literal["a", "b"]`, `TypedDict`, and `Protocol` (structural typing, like a TS interface).
- **`@dataclass`** auto-generates `__init__`, `__repr__`, and `__eq__` for plain data holders. It does **no validation**.
- **Pydantic v2** does **runtime validation, parsing, and serialization** driven by type hints, much like **Zod**. FastAPI uses it for every request and response. Key methods: `model_validate`, `model_dump` / `model_dump_json`, and `model_json_schema` (Q18).

```python
from dataclasses import dataclass
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, ValidationError, field_validator, model_validator

Status = Literal["pending", "approved", "rejected", "expired"]   # like a TS union of string literals

@dataclass
class StepResult:                      # plain container — NO validation
    step_id: str
    ok: bool

class ApprovalIn(BaseModel):           # runtime-validated, like a Zod schema
    decision: Literal["approve", "reject"]
    reason: str | None = Field(default=None, max_length=500)

    @field_validator("reason")
    @classmethod
    def strip_reason(cls, v: str | None) -> str | None:
        return v.strip() if v else v

    @model_validator(mode="after")     # cross-field rule, like Zod's .refine()
    def reject_needs_reason(self) -> "ApprovalIn":
        if self.decision == "reject" and not self.reason:
            raise ValueError("reason is required when rejecting")
        return self

class ApprovalOut(BaseModel):
    id: str
    status: Status
    version: int
    decided_at: datetime | None = None

print(StepResult("s1", True))
print(ApprovalIn.model_validate({"decision": "reject", "reason": "  wrong amount  "}))
print(ApprovalOut(id="a1", status="approved", version=4, decided_at="2026-09-26T10:00:00Z").model_dump_json())

for bad in ({"decision": "maybe"}, {"decision": "reject"}):
    try:
        ApprovalIn.model_validate(bad)
    except ValidationError as e:
        err = e.errors()[0]
        print(err["type"], err["loc"])

# StepResult(step_id='s1', ok=True)
# decision='reject' reason='wrong amount'
# {"id":"a1","status":"approved","version":4,"decided_at":"2026-09-26T10:00:00Z"}
# literal_error ('decision',)      ← "maybe" isn't an allowed literal
# value_error ()                   ← model_validator: reject without a reason
```

**Interview soundbite:** "Type hints are for tooling, dataclasses are plain containers, and Pydantic is runtime validation, basically Zod for Python and the core of FastAPI."

<a id="q48"></a>
### 48. How do exceptions and context managers work?

- `try / except / else / finally`. The **`else`** block runs **only if no exception** occurred.
- **Catch specific exceptions**, never a bare `except:`. Define custom exceptions by subclassing `Exception`.
- **`raise NewError(...) from err`** keeps the original cause, like `new Error(msg, { cause })` in JS.
- A **context manager** (`with`) **guarantees cleanup**: closing files, releasing DB connections, committing or rolling back. It's `try/finally` built into an object. Async resources use `async with`, and you can write your own with `@contextmanager`.

```python
from contextlib import contextmanager

class ConflictError(Exception):
    """Raised when the approval version doesn't match (→ HTTP 409)."""

@contextmanager
def transaction(log: list[str]):
    log.append("BEGIN")
    try:
        yield log
        log.append("COMMIT")
    except Exception:
        log.append("ROLLBACK")
        raise                               # re-raise after cleanup

log: list[str] = []
try:
    with transaction(log):
        log.append("UPDATE approvals ...")
        raise ConflictError("version mismatch")
except ConflictError as e:
    print("conflict:", e)
else:
    print("not printed — an exception happened")
finally:
    print(log)
# conflict: version mismatch
# ['BEGIN', 'UPDATE approvals ...', 'ROLLBACK']

def parse_amount(raw: str) -> float:
    try:
        return float(raw)
    except ValueError as err:
        raise ValueError(f"invalid amount: {raw!r}") from err   # keeps the original cause

try:
    parse_amount("abc")
except ValueError as e:
    print(e, "| cause:", type(e.__cause__).__name__)
# invalid amount: 'abc' | cause: ValueError
```

**Interview soundbite:** "Specific exceptions, `raise … from` to keep the cause, and context managers for guaranteed cleanup. A transaction commits or rolls back automatically."

[↑ Back to top](#toc)

---

<a id="s10"></a>
## Section 10: FastAPI (Backend)

<a id="q49"></a>
### 49. How does FastAPI compare to Express? Show a minimal app.

| Express | FastAPI |
|---|---|
| `app.get('/x', handler)` | `@app.get("/x")` decorator |
| `req.params`, `req.query` | **Function arguments**: path and query params are parsed and typed automatically |
| `req.body` + Zod/Joi | A **Pydantic model** parameter |
| Middleware `(req, res, next)` | **`Depends()`** for per-route logic; ASGI middleware for global concerns |
| `express.Router()` | `APIRouter` + `app.include_router()` |
| `res.status(404).json(...)` | `raise HTTPException(404, ...)` |
| swagger-jsdoc (manual) | **Automatic OpenAPI** at `/openapi.json`, Swagger UI at `/docs` |
| `node server.js` | `fastapi dev main.py` or `uvicorn main:app --reload` |

FastAPI is built on **Starlette** (ASGI, async-first) and **Pydantic** (validation), which makes it fast and type-driven.

```python
from fastapi import FastAPI, HTTPException, Query, status
from pydantic import BaseModel

app = FastAPI(title="Workflow API")

class WorkflowOut(BaseModel):
    id: str
    name: str
    status: str

FAKE_DB = {
    "wf1": WorkflowOut(id="wf1", name="Refund agent", status="active"),
    "wf2": WorkflowOut(id="wf2", name="Invoice agent", status="paused"),
}

@app.get("/workflows", response_model=list[WorkflowOut])
async def list_workflows(
    status_filter: str | None = Query(default=None, alias="status"),  # ?status=active
    limit: int = Query(default=20, ge=1, le=100),                     # validated: 1..100, else 422
):
    items = [w for w in FAKE_DB.values() if status_filter is None or w.status == status_filter]
    return items[:limit]

@app.get("/workflows/{workflow_id}", response_model=WorkflowOut)
async def get_workflow(workflow_id: str):                              # path param, auto-typed
    wf = FAKE_DB.get(workflow_id)
    if wf is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Workflow not found")
    return wf

# Run:  fastapi dev main.py   (or: uvicorn main:app --reload)  → docs at http://localhost:8000/docs
```

**Interview soundbite:** "Express concepts map directly: routes become decorators, params become typed function arguments, the body is a Pydantic model, middleware is mostly Depends, and OpenAPI comes free."

<a id="q50"></a>
### 50. How do you use Pydantic request and response models in FastAPI?

- **Separate input and output models** (`WorkflowCreate` vs `WorkflowOut`). `response_model` **filters the output**, so internal fields never leak.
- **Validation errors** automatically become a **422** response with per-field details.
- **camelCase for the React app:** set `alias_generator=to_camel` on a base model. FastAPI serializes responses using the aliases, and your Python code keeps `snake_case`.
- **Partial updates (PATCH):** `model_dump(exclude_unset=True)` returns only the fields the client actually sent.

```python
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

class CamelModel(BaseModel):
    # JSON uses camelCase for the React app; Python code keeps snake_case
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)

class WorkflowCreate(CamelModel):
    name: str = Field(min_length=3, max_length=80)
    max_steps: int = Field(default=20, ge=1, le=200)

class WorkflowUpdate(CamelModel):
    name: str | None = None
    max_steps: int | None = None

class WorkflowOut(CamelModel):
    id: str
    name: str
    max_steps: int
    created_at: datetime

app = FastAPI()
DB: dict[str, dict] = {}

@app.post("/workflows", response_model=WorkflowOut, status_code=201)
async def create_workflow(body: WorkflowCreate):
    wf = {
        "id": f"wf{len(DB) + 1}",
        **body.model_dump(),
        "created_at": datetime.now(timezone.utc),
        "internal_cost_center": "CC-9",           # internal field…
    }
    DB[wf["id"]] = wf
    return wf                                     # …filtered out by response_model

@app.patch("/workflows/{wf_id}", response_model=WorkflowOut)
async def update_workflow(wf_id: str, body: WorkflowUpdate):
    if wf_id not in DB:
        raise HTTPException(404, "Workflow not found")
    DB[wf_id].update(body.model_dump(exclude_unset=True))  # only the fields the client sent
    return DB[wf_id]

# POST {"name": "Refund agent", "maxSteps": 10}
# → 201 {"id": "wf1", "name": "Refund agent", "maxSteps": 10, "createdAt": "..."}   (no internal_cost_center)
# POST {"name": "ab"}  → 422 (string_too_short on body.name)
```

**Interview soundbite:** "Separate in and out models, response_model as an output filter, camelCase aliases for the frontend, and `exclude_unset` for PATCH."

<a id="q51"></a>
### 51. How does dependency injection work? (auth → tenant → permission)

This is **the most important FastAPI concept for this JD**. **`Depends()`** declares what a route needs, and FastAPI resolves the chain per request, caching each dependency within that request. It works like Express middleware, but it's **typed, per-route, composable, visible in OpenAPI, and easy to override in tests** with `app.dependency_overrides`.

The chain for this platform:
1. **`get_current_user`** verifies the token (JWT signature, expiry, audience).
2. **`get_tenant`** checks that the user is a **member** of the requested tenant.
3. **`require("approval:decide")`**, a **dependency factory**, checks the permission.
4. An **object-level check** inside the route: the resource must belong to the caller's tenant, otherwise return 404. This prevents IDOR.

```python
from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, FastAPI, Header, HTTPException, status

app = FastAPI()

@dataclass
class User:
    id: str
    memberships: dict[str, set[str]]      # tenant_id -> permissions in that tenant

@dataclass
class TenantContext:
    user: User
    tenant_id: str
    permissions: set[str]

FAKE_TOKENS = {
    "token-asha": User("u1", {"acme": {"approval:decide", "workflow:read"}}),
    "token-ravi": User("u2", {"acme": {"workflow:read"}}),
}

async def get_current_user(authorization: Annotated[str | None, Header()] = None) -> User:
    # Real code: verify JWT signature, expiry, audience (e.g. PyJWT / Authlib)
    token = (authorization or "").removeprefix("Bearer ")
    user = FAKE_TOKENS.get(token)
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return user

async def get_tenant(
    user: Annotated[User, Depends(get_current_user)],
    x_tenant_id: Annotated[str, Header()],                # reads the X-Tenant-ID header
) -> TenantContext:
    perms = user.memberships.get(x_tenant_id)
    if perms is None:                                     # never trust the header alone
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not a member of this tenant")
    return TenantContext(user, x_tenant_id, perms)

def require(permission: str):                             # dependency FACTORY
    async def checker(ctx: Annotated[TenantContext, Depends(get_tenant)]) -> TenantContext:
        if permission not in ctx.permissions:
            raise HTTPException(status.HTTP_403_FORBIDDEN, f"Missing permission: {permission}")
        return ctx
    return checker

APPROVALS = {
    "a1": {"id": "a1", "tenant_id": "acme", "status": "pending"},
    "b1": {"id": "b1", "tenant_id": "globex", "status": "pending"},
}

@app.get("/approvals/{approval_id}")
async def get_approval(
    approval_id: str,
    ctx: Annotated[TenantContext, Depends(require("workflow:read"))],
):
    a = APPROVALS.get(approval_id)
    if a is None or a["tenant_id"] != ctx.tenant_id:      # object-level check → prevents IDOR
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Not found")  # 404: don't reveal it exists
    return a

@app.post("/approvals/{approval_id}/decision")
async def decide(approval_id: str, ctx: Annotated[TenantContext, Depends(require("approval:decide"))]):
    return {"ok": True, "by": ctx.user.id}

# No token                                  → 401
# Ravi + X-Tenant-ID: globex                → 403 (not a member)
# Ravi GET /approvals/a1 (acme)             → 200
# Ravi POST /approvals/a1/decision          → 403 (missing approval:decide)
# Asha GET /approvals/b1 (other tenant's)   → 404
#
# Tests: app.dependency_overrides[get_current_user] = lambda: User("t1", {"acme": {"approval:decide"}})
```

**Interview soundbite:** "A Depends chain of user, then tenant membership, then a permission factory, then an object-level tenant check in the route, returning 404 across tenants. Overridable in tests."

<a id="q52"></a>
### 52. How do you handle middleware and CORS?

- **Global concerns** go in middleware: CORS, request IDs, timing and logging, GZip, security headers.
- **Per-route auth goes in `Depends`**, not middleware, because it's typed, testable, and documented in OpenAPI.
- **CORS** is needed when the frontend and API are on different origins. **With credentials (cookies), `allow_origins` must be an explicit list**, never `"*"`. Allow your custom request headers (`X-Tenant-ID`, `If-Match`, `Idempotency-Key`, `traceparent`) and **expose** any response headers the UI reads (`X-Request-ID`).
- **Order:** the middleware added **last** runs **first** (it's the outermost). Add CORS last, so even error responses carry CORS headers.
- The **`Server-Timing`** header shows backend duration directly in the browser's DevTools Network tab.

```python
import time
import uuid

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.middleware("http")
async def request_context(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid.uuid4())
    start = time.perf_counter()
    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    response.headers["Server-Timing"] = f"app;dur={(time.perf_counter() - start) * 1000:.1f}"
    return response

# Added LAST → outermost → even error responses get CORS headers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com", "http://localhost:5173"],  # explicit list when using cookies
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Tenant-ID", "If-Match", "Idempotency-Key", "traceparent"],
    expose_headers=["X-Request-ID"],
)

@app.get("/health")
async def health():
    return {"ok": True}
```

**Interview soundbite:** "Middleware for cross-cutting concerns, Depends for auth. CORS with explicit origins when using credentials, custom headers allowed and exposed, and CORS outermost."

<a id="q53"></a>
### 53. How do you build SSE and WebSocket endpoints in FastAPI?

**SSE:**
- Return a `StreamingResponse` with `media_type="text/event-stream"` from an **async generator** that yields `id:` / `data:` lines, each event ending with a blank line.
- Honour **`Last-Event-ID`** to resume after a reconnect, and send `retry:` to set the client's reconnect delay.
- **Detect client disconnects** with `await request.is_disconnected()`.
- Send **heartbeat comments** (`: ping`) roughly every 15 seconds so proxies don't close idle streams, and **disable proxy buffering** (`X-Accel-Buffering: no` for nginx).
- The `sse-starlette` library wraps all of this in an `EventSourceResponse`.
- **To scale out**, events come from a **broker** (Redis pub/sub, Kafka), so any API instance can stream any run.

**WebSocket:** use `@app.websocket`. Call `accept()`, loop over receive and send, and handle `WebSocketDisconnect`. Browsers **can't set headers on WebSockets**, so authenticate with a cookie, a **short-lived token in the query string**, or the first message.

```python
import asyncio
import json
from collections.abc import AsyncIterator

from fastapi import FastAPI, Header, Request, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse

app = FastAPI()

async def run_events(run_id: str, after_id: int) -> AsyncIterator[dict]:
    # Real code: subscribe to a Redis pub/sub / Kafka topic for this run and replay from after_id
    for i, status in enumerate(["running", "waiting_approval", "success"], start=1):
        if i > after_id:
            await asyncio.sleep(0.1)
            yield {"id": i, "runId": run_id, "stepId": "send_email", "status": status}

@app.get("/runs/{run_id}/events")
async def stream_run(
    run_id: str,
    request: Request,
    last_event_id: str | None = Header(default=None),    # sent by EventSource on reconnect
):
    async def gen():
        yield "retry: 3000\n\n"                          # client reconnect delay (ms)
        async for evt in run_events(run_id, int(last_event_id or 0)):
            if await request.is_disconnected():
                break
            yield f"id: {evt['id']}\ndata: {json.dumps(evt)}\n\n"

    return StreamingResponse(
        gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )

@app.websocket("/ws/runs/{run_id}")
async def run_socket(ws: WebSocket, run_id: str):
    await ws.accept()
    try:
        while True:
            msg = await ws.receive_json()
            if msg.get("type") == "ping":
                await ws.send_json({"type": "pong"})
            elif msg.get("type") == "cancel_step":
                await ws.send_json({"type": "ack", "runId": run_id, "stepId": msg.get("stepId")})
    except WebSocketDisconnect:
        pass  # client left → clean up subscriptions here
```

**Interview soundbite:** "SSE is a StreamingResponse over an async generator with ids for Last-Event-ID replay, disconnect detection, heartbeats, and a broker behind it to scale out. WebSockets only when the client talks back a lot."

<a id="q54"></a>
### 54. Build the HITL approval endpoint with optimistic locking and idempotency.

This is the backend half of Q7. The order of checks:
1. **Auth + permission** via `Depends` (Q51).
2. **Idempotency:** if this user already sent this key, return the saved result.
3. **Load the approval, scoped by tenant**, returning 404 if it's in another tenant.
4. **Segregation of duties:** the requester can't approve.
5. **Version + state check:** a version mismatch or a non-pending status returns **409**.
6. **Atomic update** that increments the version, plus an **audit record in the same transaction**.
7. **Publish an event** (for SSE) and **resume the paused agent run**.

```python
import asyncio
from datetime import datetime, timezone
from typing import Annotated, Literal

from fastapi import Depends, FastAPI, Header, HTTPException
from pydantic import BaseModel, model_validator

app = FastAPI()

class DecisionIn(BaseModel):
    decision: Literal["approve", "reject"]
    reason: str | None = None

    @model_validator(mode="after")
    def reject_needs_reason(self) -> "DecisionIn":
        if self.decision == "reject" and not self.reason:
            raise ValueError("reason is required when rejecting")
        return self

APPROVALS = {
    "a1": {"id": "a1", "tenant_id": "acme", "status": "pending", "version": 1, "requested_by": "agent:refund-bot"},
}
IDEMPOTENCY: dict[tuple[str, str], dict] = {}   # (user_id, key) -> saved response
AUDIT: list[dict] = []
lock = asyncio.Lock()   # stands in for a DB transaction / atomic UPDATE

async def current_user() -> dict:               # see Q51 for the real auth → tenant → permission chain
    return {"id": "u1", "tenant_id": "acme"}

@app.post("/approvals/{approval_id}/decision")
async def decide(
    approval_id: str,
    body: DecisionIn,
    user: Annotated[dict, Depends(current_user)],
    if_match: Annotated[int, Header()],                # If-Match: <version the client saw>
    idempotency_key: Annotated[str, Header()],         # Idempotency-Key: <uuid per click>
):
    async with lock:
        saved = IDEMPOTENCY.get((user["id"], idempotency_key))
        if saved is not None:                          # retry / double-click → same answer, no double action
            return saved

        a = APPROVALS.get(approval_id)
        if a is None or a["tenant_id"] != user["tenant_id"]:
            raise HTTPException(404, "Not found")
        if a["requested_by"] == user["id"]:
            raise HTTPException(403, "Requester cannot approve their own request")  # segregation of duties
        if a["version"] != if_match or a["status"] != "pending":
            # SQL equivalent (atomic, no lock needed):
            #   UPDATE approvals SET status = :s, version = version + 1, decided_by = :u
            #   WHERE id = :id AND tenant_id = :t AND version = :v AND status = 'pending'
            #   → 0 rows updated ⇒ 409
            raise HTTPException(409, detail={"message": "Already decided or changed", "current": dict(a)})

        a.update(
            status="approved" if body.decision == "approve" else "rejected",
            version=a["version"] + 1,
            decided_by=user["id"],
            decided_at=datetime.now(timezone.utc).isoformat(),
            reason=body.reason,
        )
        result = dict(a)
        AUDIT.append({"action": "approval.decided", "actor": user["id"], "approval": approval_id, "after": result})
        IDEMPOTENCY[(user["id"], idempotency_key)] = result

    # then: publish an event to the broker (→ SSE to other reviewers) and resume the paused agent run
    return result

# 1st POST  If-Match: 1, Idempotency-Key: k1  → 200, version 2
# retry     If-Match: 1, Idempotency-Key: k1  → 200, same body (no double action)
# 2nd user  If-Match: 1, Idempotency-Key: k2  → 409 with the current state
```

**Interview soundbite:** "Idempotency per user and key, tenant-scoped load, requester ≠ approver, a conditional update on version and status that returns 409, audit in the same transaction, then publish and resume."

<a id="q55"></a>
### 55. How do background tasks and async DB access work?

- **`BackgroundTasks`** run **small, non-critical work after the response is sent**, such as notification emails or analytics. They run **in the same process** and are **lost if the server restarts**.
- **Durable or long work** (agent runs, retries) belongs in a **queue and worker**: Celery, RQ, Dramatiq, or arq. **Durable workflow engines** such as **Temporal** fit HITL especially well, because a workflow can **wait days for an approval signal** and survive restarts.
- **Async DB:** SQLAlchemy 2.0 async + asyncpg, with **one session per request** from a **`yield` dependency** that commits, rolls back on error, and always closes.
- **Lifespan:** open and close shared resources (DB pool, Redis) in a `lifespan` context manager. This replaces the older `@app.on_event`.

```python
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import BackgroundTasks, Depends, FastAPI, Request

class FakeSession:                                # stands in for an SQLAlchemy AsyncSession
    async def commit(self) -> None: ...
    async def rollback(self) -> None: ...
    async def close(self) -> None: ...

class FakePool:                                   # stands in for an async engine / connection pool
    def session(self) -> FakeSession:
        return FakeSession()
    async def close(self) -> None: ...

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.pool = FakePool()                   # startup: open DB pool, Redis, etc.
    yield
    await app.state.pool.close()                  # shutdown: close cleanly

app = FastAPI(lifespan=lifespan)

async def get_session(request: Request) -> AsyncIterator[FakeSession]:
    session = request.app.state.pool.session()    # one session per request
    try:
        yield session                             # the route runs here
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()

def notify_approvers(approval_id: str) -> None:
    print(f"notify approvers of {approval_id}")   # email / Slack: small and non-critical

@app.post("/runs/{run_id}/approvals", status_code=201)
async def request_approval(
    run_id: str,
    bg: BackgroundTasks,
    session: Annotated[FakeSession, Depends(get_session)],
):
    approval_id = f"{run_id}-a1"
    # await session.execute(insert(Approval).values(...))
    bg.add_task(notify_approvers, approval_id)    # runs AFTER the response is sent
    return {"approvalId": approval_id, "status": "pending"}
```

**Interview soundbite:** "BackgroundTasks for small fire-and-forget work, a queue or Temporal for durable agent runs and approval waits, a session per request via a yield dependency, and lifespan for pools."

[↑ Back to top](#toc)

---

<a id="s11"></a>
## Section 11: System Design

<a id="q56"></a>
### 56. Design the frontend for an AI agent workflow platform.

Use this **structure** in the design round, and say each heading out loud as you go.

**1. Clarify requirements (2–3 minutes)**
- Who are the users? Builders, approvers, admins, auditors.
- What's the scale? Tenants, runs per day, **largest graph size**, concurrent viewers per run.
- What latency does "live" need? Is mobile approval required? Which compliance needs apply (audit retention, SSO)?

**2. Main screens**
Workflow builder (canvas) · Run viewer (live graph, logs, LLM stream) · **Approval inbox** (HITL) · Dashboards (runs, failures, cost, SLA) · Governance (policies, versions, audit log) · Admin (users, roles, tenants, connectors).

**3. Architecture**

```text
┌──────────────────── Browser (React + TypeScript) ────────────────────┐
│ App shell: router · session/auth · tenant context · error boundaries │
│ Feature modules (lazy): builder · runs · approvals · dashboards ·     │
│                         governance · admin                            │
│ Shared: design system · permissions (<Can>) · typed API client        │
│ State: TanStack Query (server) · Zustand (UI) · URL (filters)         │
└───────────────┬───────────────────────────────┬──────────────────────┘
                │ REST (OpenAPI-typed)          │ SSE (run events, approvals)
┌───────────────▼───────────────────────────────▼──────────────────────┐
│ BFF / API (FastAPI): auth · tenant · RBAC · aggregation · SSE fan-out │
└───────────────┬───────────────────────────────┬──────────────────────┘
      Services: workflows · approvals ·      Event bus (Redis / Kafka)
      policies · audit                        ▲ agent runtime publishes events
```

**4. Data flow for one run**
1. Load the graph (REST) and lay it out (worker, Q2).
2. Subscribe to SSE `/runs/:id/events` (Q12) and batch events into the cache (Q14). Nodes read status through selectors (Q3).
3. The agent hits an approval gate, and a `waiting_approval` event arrives. The inbox updates live and a notification goes out.
4. The reviewer decides (Q7/Q54). The server resumes the agent, and the SSE stream continues.

**5. State:** server data in TanStack Query, UI state in Zustand, filters in the URL, forms in RHF + Zod (Q35).

**6. Tenancy and auth:** OIDC SSO, a BFF with httpOnly cookies, the tenant in the URL, tenant-prefixed cache keys, permissions from `/me`, and route guards. The **server enforces everything** (Q24–Q26).

**7. Performance:** route and permission-based code splitting, `onlyRenderVisibleElements` with level of detail, virtualized logs and tables, rAF batching, workers for layout, and an **INP budget**.

**8. Accessibility:** a list-view alternative to the canvas, keyboard-navigable nodes, polite live announcements, and WCAG AA.

**9. Observability and quality:** a boundary per widget plus Sentry, web-vitals RUM, `traceparent` to the backend, business metrics (time-to-approve), feature flags for rollouts, and the testing trophy (Q40).

**10. Trade-offs to volunteer**
- **SSE vs WebSocket:** SSE, because traffic is one-way and commands go over REST. Revisit if collaborative editing arrives.
- **Build vs buy the canvas:** React Flow, because it's proven. Custom canvas or WebGL only past about 5,000 nodes.
- **Schema-driven vs hand-built forms:** schema-driven for connectors, hand-built for core flows like approvals.
- **Micro-frontends?** Only with many independent teams. Start with a **modular monolith** with strict feature boundaries.

```text
src/
  app/             # providers, router, session, tenant context
  features/
    builder/       # canvas, node palette, cycle validation (topoSort)
    runs/          # run viewer, SSE hook, log viewer, token stream
    approvals/     # inbox, decision flow, conflict handling
    dashboards/    # KPI widgets, charts
    governance/    # policies, versions + diff, audit log
    admin/         # users, roles, tenants, connectors
  shared/
    api/           # generated OpenAPI types + client
    auth/          # usePermission, <Can>, route guards
    ui/            # accessible design-system primitives
    observability/ # Sentry, web-vitals, tracing
```

**Interview soundbite:** "Clarify, list screens, draw the layers, walk one run end to end, then cover state, tenancy, performance, accessibility, observability, and trade-offs."

[↑ Back to top](#toc)

---

<a id="s12"></a>
## Section 12: Last-Mile Kit (read in the morning)

### 12.1 Your 60-second introduction (adapt it)

> "I'm Srinivas, a JavaScript engineer with six years of experience, mainly React and React Native with Node.js on the backend. I'm currently with TCS, working on Standard Chartered, where I [your area: e.g. build customer- and ops-facing React applications with entitlement-driven access and approval workflows]. I care about clean architecture, performance, and UX. Outside work I'm building an MSME business platform, starting with inventory and growing into billing and analytics. On Python, I'm [honest level], and FastAPI maps closely to what I do with Express: typed routes, dependency injection, Pydantic validation. This role, with workflow visualization, HITL approvals, and multi-tenant access, overlaps directly with the approval and entitlement problems I deal with in banking."

**On Python, be honest.** "Stronger in JavaScript, productive in Python and ramping fast" lands better than overclaiming and then stumbling on a follow-up question.

### 12.2 Soundbites by JD line

| JD line | Say this |
|---|---|
| Workflow visualization | "React Flow, dagre/elkjs layout memoized on structure, per-node status subscriptions, viewport-only rendering." |
| HITL approvals | "A state machine with versioned, idempotent decisions: 409 for the loser, requester ≠ approver, full audit. It's maker-checker with an AI maker." |
| Live dashboards | "SSE for events, REST for commands, batched into the query cache once per frame." |
| Governance / admin / config | "Immutable config versions, diff before publish, rollback by republishing, schema-driven connector forms." |
| Multi-tenant / RBAC | "Tenant in the URL, tenant-prefixed cache keys, permission strings from the server, and the backend enforces every request and object." |
| Responsive / accessible / performant | "WCAG AA, a list view for the canvas, INP as the key metric, code splitting by route and permission." |
| API contracts | "FastAPI's OpenAPI to generated TS types, CI fails on drift, Problem Details errors, cursor pagination." |
| UI observability | "Boundaries per widget, Sentry, web-vitals RUM, and traceparent from the browser into FastAPI." |

### 12.3 Questions to ask them

1. Is this an agentic AI platform? What does a typical workflow look like, and how long can a run wait for approval?
2. How is real-time delivered today: SSE, WebSockets, or polling?
3. How is authorization modelled (RBAC, ABAC, per-tenant roles), and where is it enforced?
4. What's the frontend stack: state management, design system, testing, build tool?
5. How are API contracts managed between the React and Python teams?
6. What's the day-to-day split between frontend and Python work?
7. What would a great first 90 days look like in this role?

### 12.4 Morning checklist

- [ ] Read 12.2 out loud once
- [ ] Fill in the STAR template in [Q10](#q10) with real details
- [ ] Re-read [Q7](#q7), [Q46](#q46), and [Q51](#q51), the most likely deep-dive questions
- [ ] Optional: run one FastAPI example locally with `pip install "fastapi[standard]"` then `fastapi dev main.py`, and open `/docs`

[↑ Back to top](#toc)
