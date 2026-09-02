# FastAPI Q&A
*Milestone document — session covering FastAPI fundamentals for LLM backend interviews*



## 1. What is FastAPI and why use it over Flask/Django?

FastAPI is a modern Python web framework built for speed and automatic data validation. Compared to Flask: native async support + automatic request validation via Pydantic. Compared to Django: much lighter weight, no built-in admin panel/ORM — ideal for APIs, especially LLM backends handling many concurrent, slow external calls.



## 2. What is Pydantic and why does FastAPI use it?

Pydantic is a data validation library. You define a class describing expected data shape (like a TypeScript interface, but enforced at **runtime**, not just compile time). If a request sends wrong data types, FastAPI automatically rejects it with a clear error — no manual validation code needed.



## 3. Path parameters vs Query parameters vs Request body

- **Path parameters**: part of the URL itself (e.g., an ID in the address)
- **Query parameters**: come after `?` in the URL, typically optional filters
- **Request body**: main payload, usually JSON — this is what Pydantic models typically validate



## 4. `def` vs `async def` for a route

**Kitchen analogy:**
- **Blocking (`def`)**: You put pasta water on and stand there watching it boil for 10 minutes. No other orders get touched. One chef (server) frozen on one task.
- **Non-blocking (`async def` + `await`)**: You put pasta water on, then go chop salad for the next order while it boils, checking back when it's ready. One chef juggling multiple slow tasks by working on something else during wait time.

**Key pairing:**
- `async def` marks the **whole function** as allowed to pause and resume.
- `await` marks the **specific line** where the pausing actually happens (e.g., calling the LLM API).
- If you write `async def` but forget `await`, or call something blocking inside it, you get **no benefit** — it behaves like a normal blocking function even though it looks async.

**Critical trap:** If you accidentally call something blocking inside an async function (e.g., a synchronous file read, or a non-async-aware DB call), it freezes the **entire server for all users**, not just that one request.

**JS vs Python difference:** Same core concept as JavaScript async/await, but the consequence of getting it wrong is more severe in Python/FastAPI — Node's event loop is more forgiving by default; Python will genuinely block the whole server.

**Concurrency behavior (important nuance):** When multiple requests are waiting on slow calls (e.g., LLM APIs), whichever request's wait finishes **first** gets handled first — not based on arrival order, but based on **completion order**. The server continuously checks all pending waiting tasks and handles whichever becomes ready, regardless of when it started or what else is still pending.



## 5. What is Dependency Injection in FastAPI?

Instead of repeating setup code (auth checks, DB connections) in every route, you write that logic once as a separate function (a "dependency"), and FastAPI automatically runs it and injects the result into any route that declares it needs it.

**Example:** Every endpoint needs to verify an API key. Instead of copy-pasting the check, write one function for it; routes declare "this depends on that function." FastAPI runs it automatically before route logic executes; if it fails, the request is rejected before your code even runs.

> **Important correction:** DI is **not** primarily about speed/performance — it's about avoiding code duplication and keeping things clean and testable. (Secondary benefit: FastAPI can cache a dependency's result within a single request if used multiple times.)

**Interview line:** *"Dependency injection in FastAPI lets you extract shared logic — like authentication, database sessions, or rate limiting checks — into reusable functions that FastAPI automatically injects into any route that declares it needs them, keeping route code clean and avoiding duplication."*



## 6. Background Tasks

Lets you return a response to the client **immediately**, while FastAPI executes a function **afterward**, without blocking the response.

**Use case:** log the request, save conversation to DB, send analytics — after streaming an LLM response back, so the user isn't waiting on that extra work.

**Distinct from `async def`:** `async def` is about not blocking *while waiting*; background tasks are about doing extra work *after* the response has already been sent.



## 7. Middleware vs Dependency Injection

- **Middleware**: runs on **every request globally**, regardless of route. A checkpoint every request passes through both on the way in and out. Examples: logging, CORS headers, measuring request duration, rate limiting.
- **Dependency Injection**: **opt-in per route** — only runs where explicitly declared (e.g., auth on specific protected endpoints).

**Example walkthrough (logging middleware):**
1. Note the time when the request comes in
2. Let the request continue to its actual route, wait for it to finish
3. Once the route is done, calculate elapsed time and log it, before the response goes out

**Example (CORS):** Instead of adding CORS headers in every route, one middleware attaches them automatically to every outgoing response.

Same concept as Express.js middleware (`req, res, next`) — just Python's async syntax. **Nuance:** FastAPI convention leans toward using Dependency Injection (not middleware) for route-specific concerns like authentication, since it's more explicit about which routes are protected.



## 8. Request & Response Validation with Pydantic

**Input validation:** FastAPI checks incoming data against a Pydantic model. Wrong type or missing field → automatic rejection with a `422` status code + details on which field failed and why. No manual validation code needed.

**Output validation (`response_model`):** You can also declare the shape of the *outgoing* response. If your route logic returns extra/mismatched fields, FastAPI filters/strips them before sending to the client — even if your code technically returned more.

**Security example:** If your DB object includes a password hash alongside username/email, but your `response_model` only declares username + email, FastAPI automatically strips the password hash from the response — protects against accidental data leaks.

**Interview line:** *"FastAPI validates both incoming requests and outgoing responses using Pydantic models. On the output side, this is useful for security and consistency — it strips fields not declared in the response model, so you can't accidentally leak internal data even if your function returns more than it should."*



## 9. HTTPException vs normal responses

For expected error cases (e.g., item not found), you don't return an error as if it were a normal successful response. Instead, you raise `HTTPException` with a status code (e.g., `404`) and a detail message.

Raising `HTTPException` immediately **stops** the function execution and sends a proper HTTP error response with the correct status code — so the client (e.g., React frontend) can check status codes reliably instead of parsing the response body to guess what happened.

**LLM-specific example:** If a user's prompt exceeds the context window, raise `HTTPException` with a `400` status and clear message, rather than letting the LLM API call fail unpredictably later.



## 10. Handling a long-running LLM request without blocking other users

*(Synthesis question — combines everything above)*

**Approach:**
1. Define the route as `async def`
2. `await` the LLM API call so the server isn't blocked for other users during the wait
3. Stream the response using FastAPI's `StreamingResponse`, so the user sees tokens appear progressively instead of waiting for full generation (same concept as SSE streaming already built in the Node chat app project)
4. If there's follow-up work (e.g., saving conversation to DB), offload it to a **Background Task** so it doesn't delay the response

**Interview line:** *"I'd define the route as async def, and await the LLM API call so the server isn't blocked for other users during that wait. I'd also stream the response using FastAPI's streaming response, so the user sees tokens appear progressively instead of waiting for the full generation. If there's follow-up work, like saving the conversation to a database, I'd offload that to a background task so it doesn't delay the response."*



## Notes / Context from this session

- PwC Glider.ai assessment (cleared): heavily featured FastAPI + vector database concepts
- Next steps: **Technical round → Manager round → HR round**
- **Streaming clarification:** FastAPI does **not** stream automatically by default — you must explicitly write a generator function and wrap it in a `StreamingResponse`. Same underlying idea as SSE streaming already implemented in the Node.js chat app.
- Still to cover: **Vector databases** (Pinecone/Weaviate/pgvector tradeoffs, chunking strategies) — flagged as the next topic after FastAPI.