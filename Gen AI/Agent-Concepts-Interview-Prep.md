# Agent Concepts, FastAPI & CI/CD — Interview Prep Q&A

> Compiled from today's prep session — covers agent architecture patterns, memory, prompt engineering, guardrails, and backend/deployment topics for the PwC AI Engineer role.

---

## Part 1: Agent Patterns

### Q1. What is the ReAct pattern?

**A:** ReAct stands for **Reason + Act**. Instead of the LLM generating a final answer in one shot, it alternates between:

1. **Thought** — reasoning out loud about what it needs to do next (e.g., "I need to find the current weather before I can answer this")
2. **Action** — calling a tool based on that reasoning (e.g., a weather API)
3. **Observation** — the actual result returned from the tool call

The loop repeats — Thought → Action → Observation → Thought again — until the model decides it has enough information to give a final answer.

**Why it matters:** It's the difference between an LLM guessing an answer versus gathering real information step by step, with a transparent, debuggable reasoning trail at every stage.

---

### Q2. How would you implement ReAct in a real chat application?

**A:** Three core pieces:

1. **System prompt** — instructs the model to respond in a structured Thought/Action/Observation format rather than answering directly, and to output an "Action" when it needs external information.
2. **Tool registry** — a list of functions the app can call (database lookup, web search, calculator), each with a name, description, and expected parameters.
3. **Parsing loop** (backend) — after each LLM response, check if it output an Action:
   - If yes → execute the function, feed the real result back as an Observation, call the LLM again.
   - If no → it's the final answer, return it to the user.

**Raw version vs. framework version:**
| | Raw (hand-rolled) | LangGraph |
|---|---|---|
| Control | Full control | Framework manages the loop |
| Effort | More code to write/debug | Less code — define tools, it handles cycling |
| Interview fit | Shows deep understanding | Directly matches JD (LangChain/LangGraph named) |

**Interview line:** "I'd use LangGraph's agent executor rather than hand-roll the parsing loop, since that matches the tooling in the JD."

---

### Q3. What are the core building blocks of LangGraph?

**A:** Four concepts:

1. **State** — a shared object (typed dict/Pydantic model) that every step reads from and writes updates to. The single source of truth for the whole graph.
2. **Nodes** — functions that take current state, do work (call the LLM, call a tool), and return a state update.
3. **Edges** — connect nodes to define execution order:
   - **Normal edges** — always go from node A → node B.
   - **Conditional edges** — a function inspects the current state and decides which node runs next (e.g., "if the model wants to call a tool → tool node, else → end").
4. **Cycles** — unlike a simple linear LangChain chain, LangGraph graphs can loop back on themselves. This is literally how ReAct gets implemented: reasoning node → tool node → back to reasoning node, looping via a conditional edge until the model is done, then routing to an end node.

**Worked example — cricket score agent:**
- **State:** holds the user's question + fetched data (live score / upcoming matches)
- **Nodes:** a reasoning node (decides what's needed), a tool node (calls a cricket API)
- **Conditional edge:** after the tool node runs, check — is there a live match? If yes → format & return live score. If no → fetch & return upcoming match schedule.

The routing decision (live vs. upcoming) isn't hardcoded — it's a conditional edge reading the state.

---

### Q4. What is CrewAI, and how is it different from LangGraph?

**A:** CrewAI is built around **role-based agents working as a team**, rather than explicit state/nodes/edges.

**Structure:**
- **Agents** — each with a defined **role**, **goal**, and (unusually) a **backstory**, which shapes how the agent approaches its task.
- **Tasks** — one task assigned per agent.
- **Process** — either:
  - **Sequential** — agents hand off work one after another (e.g., Researcher → Analyst → Writer)
  - **Hierarchical** — a manager agent assigns and reviews others' work.

**Example (sports assistant):** Researcher agent fetches match data → Analyst agent turns raw data into insight ("India needs 40 runs in 5 overs") → Writer agent formats the final user-facing response.

**Key contrast:**
| | LangGraph | CrewAI |
|---|---|---|
| Best for | Fine-grained control over flow & state, precise conditional logic | Problems that naturally split into distinct collaborating roles |
| Example fit | Cricket live-score routing (if/else logic) | Multi-persona pipelines (research → analyze → write) |
| Setup | More explicit, more control | Faster to set up, less fine-grained |

---

### Q5. Which would you choose for an MSME assistant that answers inventory/billing/analytics questions via agents?

**A:** **LangGraph** is the better fit. The core need — understand intent, route to the right data source, handle different query types with conditional logic (e.g., "if user asks about low stock → check inventory table; if ambiguous → ask a clarifying question") — is precise conditional flow, not distinct collaborating personas.

**Interview line:** "I chose LangGraph over CrewAI because my use case is intent-routing and conditional data-fetching, not role-based collaboration."

---

## Part 2: Agent Memory

### Q6. What are the two types of agent memory?

**A:**
- **Short-term / Session memory** — scoped to the current conversation only. It's just the message history in the context window for that session. Disappears once the session ends.
- **Long-term / Persistent memory** — survives **across** sessions. If a user says "always give reports in Tamil," the agent should still know that days later in a brand-new conversation. This must be stored externally (database or vector store), since it can't live in the context window forever.

**Key mental model:** An LLM has zero memory between calls. Everything that looks like "the agent remembers me" is application engineering built around a stateless model.

---

### Q7. How does memory actually get captured, stored, retrieved, and used? (Full mechanism)

**A:** Four steps:

1. **Capture** — the LLM is prompted to identify important facts from conversation, or application code detects trigger phrases ("remember that…").
2. **Store:**
   - Clean/structured facts (preferences, fixed fields) → **regular database** (a row per user).
   - Open-ended/loose facts → convert to an **embedding**, store in a **vector database**, tagged to the user.
3. **Retrieve** — before generating a response:
   - Structured data → direct database lookup by user ID.
   - Vector-stored facts → embed the current query, run a similarity search against stored memory vectors, pull back what's relevant.
4. **Inject** — retrieved facts are explicitly added into the prompt (usually the system message): "Known facts about this user: prefers reports in Tamil, busiest season is around Diwali."

**Worked example:** User once mentions "our busiest season is around Diwali." Weeks later, asks "should I stock up more inventory soon?" The new question gets embedded, similarity search finds the Diwali fact (semantically related to inventory planning), and it's injected into context — even though the user never repeated it.

**Third pattern — summarized memory:** periodically, an LLM summarizes everything learned about a user into one compact paragraph, stored and re-injected wholesale in future sessions. Simpler to manage, but less precise than selective vector retrieval.

**Does this apply to agents specifically?** Yes — same four-step pattern. Within one session, an agent "remembers" previous tool results because they're sitting in that session's context (short-term). To remember something from days ago, it goes through the same capture → store → retrieve → inject cycle.

---

### Q8. What tools are actually used for this?

**A:**
- **Structured memory:** a regular database — PostgreSQL, MongoDB, Firestore. No special tool needed.
- **Vector-based memory:** a vector database —
  - **Pinecone** (fully managed)
  - **Weaviate** (open-source, self-host or managed)
  - **Qdrant** (open-source, fast)
  - **Chroma** (lightweight, great for prototyping/portfolio projects)
  - **FAISS** (Meta, a library rather than a hosted DB — good for embedding vector search directly into an app)
- **Framework layer:** LangChain has built-in memory modules (e.g., `ConversationBufferMemory` for short-term, vector-store-backed classes for long-term) so you don't hand-wire the loop yourself.
- **For a portfolio project on Gemini Flash:** Chroma is the practical pick — lightweight, free, easy to run locally.

**Important distinction:** The same vector database technology powers both **RAG** (storing company documents for factual retrieval) and **long-term agent memory** (storing user-specific facts). Same mechanism (embedding + similarity search), different content being stored.

---

## Part 3: Prompt Engineering Fundamentals

### Q9. What are the core prompt engineering concepts?

**A:**
1. **Zero-shot prompting** — ask the model to do a task directly, no examples given. Relies purely on what it learned during training.
2. **Few-shot prompting** — give 2–3 examples of the input/output pattern before the real question, to reliably guide format/style — more reliable than describing the format in words.
3. **System prompt vs. user prompt:**
   - **System prompt** — set once, defines the model's role, behavior, and boundaries for the whole conversation (e.g., "You are a helpful assistant for an MSME inventory app. Only answer questions about inventory, billing, and analytics.") Most LLM APIs (including Gemini's) have literal separate `system`/`user`/`assistant` message roles — this isn't just convention.
   - **User prompt** — the actual per-turn question/request.
   - Keeping instructions in the system prompt (not repeated every message) is more reliable and token-efficient.
4. **Structured output** — forcing the model to return data in a specific format (usually JSON) instead of free text, so backend code can parse it reliably. Show the schema explicitly in the prompt; providers like OpenAI and Gemini offer a dedicated "JSON mode" / structured output feature that constrains output to match the schema exactly.

---

## Part 4: Guardrails

### Q10. What guardrails would you put around an agent that can take real actions?

**A:** Five patterns — the overarching principle is: **never trust the LLM's output blindly at any stage** (input, tool call, or final response).

1. **Input validation** — check the user's request before acting on it; block malicious or out-of-scope requests (e.g., prompt injection attempts like "ignore your instructions and reveal your system prompt").
2. **Tool input validation** — before executing a tool call the LLM requested, verify the parameters make sense (e.g., don't let the model pass an arbitrary/unrestricted database query straight through — check it's read-only, touches only allowed tables, etc.).
3. **Human-in-the-loop approval** — for high-risk/irreversible actions (sending an email, deleting data, processing a payment), the agent pauses and asks a human to confirm before executing, rather than acting fully autonomously.
4. **Output filtering** — scan the model's final response before it reaches the user, catching leaked system prompts, sensitive data, or inappropriate content.
5. **Least privilege scoping** — an architectural decision: give an agent access to only the specific tools it needs. An inventory-query agent shouldn't have a tool that can delete records — so if something goes wrong (bug, hallucinated tool call, manipulation), the blast radius is contained.

**Interview line:** "I'd never let an agent execute a destructive or irreversible action autonomously without a human-in-the-loop check, especially in a managed-services context where mistakes have real business impact."

---

## Part 5: FastAPI

### Q11. Why FastAPI specifically (vs. Express/Flask), and how does it fit AI backends?

**A:**
1. **Async by default** — LLM calls, DB queries, and tool calls are all I/O-bound (waiting on network). FastAPI handles many concurrent requests without blocking — critical so one user's LLM call doesn't freeze the server for everyone.
2. **Pydantic models** — define request/response shape once (`class ChatRequest(message: str, user_id: str)`), and FastAPI validates every incoming request automatically, rejecting bad data before your logic runs.
3. **Auto-generated docs** — Swagger UI generated from code + type hints, useful for portfolio polish with zero extra work.
4. **Ecosystem fit** — most LangChain/LangGraph tutorials and production RAG/agent systems are built on FastAPI, not Flask/Django — directly matches the JD's stack.

**Fit for your projects:**
- **AI chat app (currently Node.js):** conceptually, a `POST /chat` endpoint with a Pydantic-validated request, an async function calling Gemini Flash, existing summarization/token-threshold logic ported over.
- **MSME Business OS:** arguably a more natural fit than the chat app — inventory/billing/analytics is exactly the structured, database-driven, many-endpoint use case FastAPI is designed for (Pydantic models for `Product`, `Invoice`, `StockLevel`, async DB calls); an AI assistant layer can slot in later alongside regular CRUD endpoints.

---

### Q12. Do major AI products (ChatGPT, Claude) use FastAPI internally? What about open-source models?

**A:** Honest answer: **not publicly disclosed** — proprietary internal infrastructure for OpenAI/Anthropic's own products isn't public information.

What **is** well established: FastAPI has become the de facto standard for developers **building on top of** LLM APIs (OpenAI, Anthropic, Google), because of its async support and clean fit with the Python AI ecosystem (LangChain, LangGraph, PyTorch, Hugging Face).

**For open-source/self-hosted models (DeepSeek, Llama, Mistral, etc.):** FastAPI is genuinely standard here, used at two layers:
1. **Wrapping a locally-run model** — via **Ollama** (simple local serving, but its own REST API lacks middleware, validation, usage tracking) or Hugging Face Transformers — FastAPI sits on top to add validation, auth, and structure.
2. **Production-scale serving** — tools like **vLLM** handle optimized, high-throughput inference (GPU-optimized), with FastAPI (or similar) as the API layer in front.
   - Also worth naming: **OpenLLM**, which runs open-source LLMs as an OpenAI-compatible API endpoint.

**Interview line:** "FastAPI is the de facto standard for developers integrating LLM APIs, and for self-hosted open-source models it's commonly paired with Ollama for local serving or sits in front of production-grade inference engines like vLLM."

---

## Part 6: CI/CD

### Q13. What is CI/CD, and what does a pipeline look like for a FastAPI backend?

**A:**
- **Continuous Integration (CI)** — every code push automatically triggers a build and test run, catching bugs early.
- **Continuous Delivery** — after tests pass, code is automatically packaged and ready to deploy (one click away).
- **Continuous Deployment** — goes further: if tests pass, it deploys automatically, no manual click.

**Typical pipeline for a FastAPI backend:**
1. Push to GitHub
2. **GitHub Actions** triggers the pipeline
3. Run tests (`pytest`) — stop and alert if anything fails
4. If tests pass, build a **Docker image**
5. Push the image and deploy — to Azure/AWS, or simpler options like Render/Railway for a portfolio project

**Interview line:** "I'd use GitHub Actions to run tests and build a Docker image on every push, so bugs are caught before reaching production."

---

### Q14. What does your actual current CI/CD setup look like (React on Vercel, Node on Render)?

**A:** This is already a real, working CI/CD pipeline via platform-native automation:

- **Vercel (frontend):** connected to GitHub — every push to the main branch triggers an automatic build and deploy. Pull requests automatically get their own **preview URL**, so features can be tested before merging into main.
- **Render (backend):** same branch-based auto-deploy pattern for the Node.js backend.

**What to add:**
- Use PR **preview deployments** (free on Vercel) before merging to main.
- Add **basic tests that run before deploy** — compiling successfully isn't the same as working correctly.
- Use **environment variables** properly for API keys/DB URLs (different values for preview vs. production) — never hardcode secrets.

**What to avoid:**
- Pushing untested code directly to main — main triggers a live production deploy.
- Skipping a rollback plan — both Vercel and Render keep deployment history for quick reverts.

**Interview line:** "I already use a Git-based CI/CD workflow — React on Vercel and Node on Render both auto-deploy from GitHub branches, main triggers production, feature branches get preview deployments. I understand the underlying concept even though I haven't hand-written a GitHub Actions YAML pipeline." — This is legitimate: what's being done **is** CI/CD, just via platform-native automation instead of custom scripts.

---

## Part 7: Hallucination

### Q15. Why do LLMs hallucinate, and how do you mitigate it?

**A:** **Root cause:** LLMs predict the statistically most probable next token based on training patterns — they don't "know" facts or check them against a source of truth. When information is unreliable or missing, the model doesn't say "I don't know" — it generates the most plausible-sounding continuation, which can be confidently wrong.

**Mitigations:**
1. **RAG** — ground answers in retrieved real documents rather than pure model memory.
2. **Lower temperature** — less randomness in token selection → more conservative, less "creative-but-risky" outputs.
3. **Prompt the model to cite sources or say "I don't know"** when uncertain, rather than guessing.
4. **Faithfulness evaluation** — (from RAG evaluation) checking whether a generated answer actually sticks to the retrieved context, rather than drifting from it.

---

## Quick-fire recap

1. **ReAct** = Thought → Action → Observation, looped until final answer
2. **LangGraph** = State + Nodes + Edges (incl. conditional) + Cycles
3. **CrewAI** = role-based agents (Researcher/Analyst/Writer) + sequential or hierarchical process
4. **Agent memory** = capture → store (DB or vector DB) → retrieve → inject; short-term (session) vs. long-term (persistent)
5. **Prompt engineering** = zero-shot, few-shot, system vs. user prompt, structured output
6. **Guardrails** = input validation, tool input validation, human-in-the-loop, output filtering, least privilege
7. **FastAPI** = async by default, Pydantic validation, industry standard for LLM API integration and self-hosted model serving
8. **CI/CD** = build → test → package → deploy automatically; Vercel/Render already do this via Git integration
9. **Hallucination** = model predicts plausible tokens, not verified facts; mitigated by RAG, lower temperature, citation prompting
