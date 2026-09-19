# RAG & Token Optimization — Interview Prep Q&A

> Compiled from prep discussion, based on real PwC AI Engineer interview questions on chunking and token optimization.

---

## Part 1: Token Optimization Techniques

### Q1. How do you optimize token usage in an LLM application with long conversation history?

**A:** There are several complementary techniques:

1. **Summarization** — Once history crosses a token threshold, call the LLM with a summarization prompt on the older messages, and replace the raw history with the compressed summary before sending to the LLM.
2. **Sliding window** — Keep only the last N messages in full; drop or summarize anything older. Simple array/list management, no LLM call needed.
3. **Selective context (relevance filtering)** — Instead of sending full history, embed conversation chunks, store them in a vector DB, and retrieve only the chunks relevant to the current query.
4. **Prompt compression** — Use a smaller model (or a dedicated library like **LLMLingua**, from Microsoft) to rewrite a long prompt in a more compact form while preserving meaning.
5. **Caching** — Providers (OpenAI, Anthropic) let you mark reusable parts of a prompt (e.g., system prompt) as cached, reducing token cost on repeated calls.

**Key line for interviews:** "Most of these come down to three things — an LLM sub-call (summarization), a vector database (selective retrieval), or plain application logic (sliding window). It's rarely a from-scratch algorithm."

---

### Q2. Walk through your token-threshold summarization logic.

**A:** Example flow:
- `maxTokenCount = 40,000`
- Current history = 40,000 tokens
- New input = 3,000 tokens
- Once threshold is hit, call a summarization API on the full history → compresses 40k → 10k tokens
- Store that as the new "summary" context
- Final payload to LLM = `summary (10k) + new input (3k) = 13k tokens`

**Common implementation bug to avoid:**
```python
# WRONG — still sends full history even after summarizing
def checkTokenLimit(input):
    history = getChatHistory()
    if getChatHistoryToken() >= max_token:
        input = input + summarizeHistory(history)
    sendToLLM(history + input)   # bug: history is still the full, un-summarized version
```

```python
# CORRECT — summary REPLACES history, doesn't add to it
def checkTokenLimit(input):
    history = getChatHistory()
    if getChatHistoryToken() >= max_token:
        compressed_context = summarizeHistory(history)
        sendToLLM(compressed_context + input)
    else:
        sendToLLM(history + input)
```

**Interview-ready phrasing:** "Once history crosses the token threshold, I replace the raw history with a summarized version before sending it to the LLM, rather than sending both."

---
