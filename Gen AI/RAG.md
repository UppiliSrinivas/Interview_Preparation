
## RAG Fundamentals

### Q3. What is RAG and why use it?

**A:** RAG = Retrieval-Augmented Generation. Relevant information is retrieved from an external knowledge source and given to the LLM as context before it generates an answer. Useful for up-to-date info, private/company data, external knowledge, and reducing hallucinations — without retraining the model.

---

### Q4. What chunking strategies do you know? (Real question asked in interview)

**A:** Six main types:

| Strategy | One-line description |
|---|---|
| **Fixed-size** | Split into equal token/character counts — simple, but can cut mid-sentence |
| **Overlap** | Each chunk repeats a bit of the previous chunk's ending, so meaning isn't lost at boundaries |
| **Sentence/paragraph-based** | Split along natural language boundaries — never cuts mid-sentence |
| **Recursive character splitting** | Try paragraph → sentence → word, falling back if a piece is still too big (LangChain's default) |
| **Semantic chunking** | Use embeddings to detect topic shifts and split there — more expensive, more coherent |
| **Document-structure-aware** | Split by headers/sections/markdown structure — good for manuals, wikis |

**Deep dive — Overlap chunking example:**
Without overlap: chunk 1 = tokens 1–500, chunk 2 = tokens 501–1000. A sentence spanning token 495–510 gets cut in half across the boundary.
With overlap: chunk 2 starts earlier (e.g., token 450) so tokens 450–500 appear in both chunks — whichever chunk gets retrieved, the boundary sentence stays intact.

**Interview-ready phrasing:** "I typically use overlap chunking, where each chunk retains a few lines of context from the adjacent chunk, so information split near a boundary doesn't lose its context."

---

### Q5. What is indexing in a vector database, and why does it matter?

**A:** Indexing organizes stored embeddings so a similarity search doesn't have to brute-force compare against every vector (slow at scale).

- **Flat index / brute-force** — exact, accurate, but doesn't scale.
- **HNSW (Hierarchical Navigable Small World)** — builds a layered graph connecting similar vectors so search can navigate to the right neighborhood fast. Most common ANN (Approximate Nearest Neighbor) method.
- **IVF (Inverted File Index)** — clusters vectors first, then searches only within relevant clusters.

**Interview-ready line:** "Exact search guarantees best results but doesn't scale. Approximate methods like HNSW trade a small amount of accuracy for a huge speed gain — which is why most production vector DBs (Pinecone, Weaviate, Qdrant) use ANN by default."

---

### Q6. What are embedding models, and what's the one rule people forget?

**A:** An embedding model converts text into a vector capturing semantic meaning — similar meaning → vectors close together, even with different wording.

Common models: OpenAI's `text-embedding-3-small/large`, Google's embedding models, open-source `sentence-transformers` (HuggingFace) for self-hosting.

**Critical rule:** The same embedding model must be used to embed both stored documents and the user's query at search time — otherwise vectors don't live in the same space and similarity search breaks.

---

### Q7. What similarity metrics are used in retrieval?

**A:**
- **Cosine similarity** (most common) — measures the angle between two vectors, ignoring magnitude. Range ~ -1 to 1; closer to 1 = more similar.
- **Euclidean distance** — straight-line distance between points; smaller = more similar.
- **Dot product** — like cosine but factors in magnitude; some models are trained specifically for this.

**Example:** Query "What is React used for?" vs. stored sentence "React is used for building user interfaces" → vectors point in nearly the same direction → high cosine similarity. Vs. "Cooking pasta takes ten minutes" → very different direction → low similarity.

---

### Q8. What is re-ranking, and why is it needed?

**A:** Initial vector search returns a rough batch of candidates fast (e.g., top 20) based on pre-computed vector similarity — quick but imprecise. Re-ranking is a second pass using a stronger model (a **cross-encoder**) that evaluates the actual query and each candidate chunk together, then re-scores for true relevance. Only the top 3–5 after re-ranking go to the LLM.

**Example:** Query "How do I reset my password" — first pass might return both the actual reset steps and a loosely related "account security overview" chunk. Re-ranking reads them properly and correctly prioritizes the true match.

---

### Q9. What is query rewriting, and how is it different from re-ranking?

**A:** Two different pipeline stages:
- **Query rewriting** happens **before** retrieval — the LLM reformulates the user's raw/vague/context-dependent question into a clear, self-contained, searchable one. Especially important in multi-turn chat: "What about performance issues with it?" → rewritten to "What about performance issues with React?" using conversation history.
- **Re-ranking** happens **after** retrieval — re-scoring already-retrieved chunks for relevance.

**Order:** Query rewriting → retrieval → re-ranking → generation.

---

### Q10. What is hybrid search?

**A:** Combines two search types run on the same query, then merges results:
- **Vector/semantic search** — good at meaning (connects "vacation days" ↔ "annual leave"), but can miss exact keyword/numeric matches.
- **Keyword search (BM25)** — good at exact terms/codes, but misses semantic similarity.

**Interview line:** "Vector search alone can miss exact keyword or numeric matches — hybrid search fixes that by combining semantic and keyword search."

---

### Q11. How do you evaluate a RAG system?

**A:** Two dimensions, four core metrics:

**Retrieval quality:**
- **Context precision** — of retrieved chunks, how many were actually relevant
- **Context recall** — of all relevant chunks that exist, how many were retrieved

**Generation quality:**
- **Faithfulness** — does the answer stick to facts in retrieved context, or hallucinate
- **Answer relevance** — does the answer actually address the user's question

**Tool:** **RAGAS** — an open-source framework that automates measuring all four, using an LLM-as-judge to grade another LLM's RAG output rather than requiring manual human review.

---

### Q12. RAG vs. Fine-tuning — what's the real distinction?

**A:**
- **RAG** — no training involved; it's a retrieval process that optimizes what context is sent as input to a frozen model. Good for fresh/changing/external information.
- **Fine-tuning** — a training process; it changes the model's actual parameters. Good for teaching consistent behavior, style, or a specialized skill.

Not substitutes — many production systems use **both**: RAG for fresh facts, fine-tuning for consistent behavior.

---

## Quick-fire recap (for last-minute review)

1. **Chunking** → 6 types (fixed, overlap, sentence, recursive, semantic, structure-aware)
2. **Embeddings** → text → vector; same model for docs & queries
3. **Indexing** → HNSW/IVF for fast approximate search at scale
4. **Similarity** → cosine similarity most common
5. **Re-ranking** → cross-encoder narrows rough results to best few
6. **Query rewriting** → clarifies/completes the question *before* search
7. **Hybrid search** → vector + keyword (BM25) combined
8. **Evaluation** → precision/recall (retrieval) + faithfulness/relevance (generation), via RAGAS
