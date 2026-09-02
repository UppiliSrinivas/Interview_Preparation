# PwC AI Engineer Interview Preparation --- LLM Fundamentals

> A simple, interview-oriented guide covering the LLM fundamentals we
> have studied so far.

------------------------------------------------------------------------

## 1. What is an LLM?

**LLM = Large Language Model**

An LLM is a deep-learning model trained on a very large amount of text
data to understand and generate human-like language.

It processes text as **tokens** and predicts the **next token based on
the context**.

### What can an LLM do?

An LLM can perform many language-related tasks, such as:

-   Question answering
-   Summarization
-   Text generation
-   Translation
-   Code generation
-   Information extraction
-   Conversational responses

### LLM vs Traditional Machine Learning

  -----------------------------------------------------------------------
  Traditional ML                      LLM
  ----------------------------------- -----------------------------------
  Usually designed for a specific     General-purpose language model
  task                                

  Common examples: classification,    Question answering, summarization,
  regression, spam detection          code generation, text generation

  Often task-specific                 Can perform many language-related
                                      tasks
  -----------------------------------------------------------------------

### Easy way to remember

**Traditional ML:**

> Train a model to solve a particular problem.

**LLM:**

> Train a large model to understand patterns in language so it can
> perform many language-related tasks.

### Important terminology

Don't say:

> "LLMs have a lot of memory."

Say:

> "LLMs process a large context window of tokens."

An LLM's context is not automatically permanent memory.

------------------------------------------------------------------------

# 2. Tokens and Context Window

## What is a Token?

A **token** is a small unit of text that an LLM processes.

A token can be:

-   A complete word
-   Part of a word
-   Punctuation
-   Sometimes a space-related component

For example:

``` text
"React is powerful"
```

could roughly be represented as:

``` text
React | is | powerful
```

But:

> **Token ≠ word**

One word can sometimes be split into multiple tokens.

Tokenization is model-specific.

------------------------------------------------------------------------

## Why do LLMs use tokens?

Computers need numerical representations to process language.

The general flow is:

``` text
Human text
    ↓
Tokenization
    ↓
Tokens / token IDs
    ↓
LLM processing
    ↓
Generated tokens
    ↓
Text response
```

------------------------------------------------------------------------

## What is a Context Window?

A **context window** is the maximum number of tokens that a model can
process as input/context at one time.

Think of it as the model's **short-term working context**.

It can contain things such as:

-   System instructions
-   Previous conversation
-   User question
-   Retrieved documents
-   Other relevant context

Conceptually:

``` text
Context Window
┌─────────────────────────────┐
│ System instructions         │
│ Previous conversation       │
│ User question               │
│ Retrieved documents          │
└─────────────────────────────┘
              ↓
             LLM
              ↓
          Response
```

### Important distinction

> **Context window ≠ permanent memory**

------------------------------------------------------------------------

# 3. Tokens vs Embeddings

This is an important distinction.

## Token

A **token** is a piece of text processed by the model.

## Embedding

An **embedding** is a numerical representation of data that captures
semantic meaning.

Similar pieces of content can have embeddings that are mathematically
close to each other.

### Easy way to remember

> **Token = piece of text**

> **Embedding = numerical representation capturing meaning**

They are not the same thing.

------------------------------------------------------------------------

# 4. Where Are Embeddings Used?

Embeddings are commonly used for **semantic search**, especially in RAG
systems.

Suppose we have:

``` text
"React Native is used for mobile application development."
```

A user asks:

``` text
"What technology can I use to build mobile apps?"
```

The wording is different, but the meaning is similar.

An embedding model can represent both pieces of text as vectors. A
vector database can then identify their semantic similarity.

------------------------------------------------------------------------

# 5. Important: Text Embeddings vs Token Embeddings

There are two concepts that can be confusing.

## Text embeddings used in RAG

Purpose:

> Find semantically relevant information.

``` text
Text
 ↓
Embedding model
 ↓
Vector
 ↓
Vector database
 ↓
Similarity search
```

These embeddings are generally not sent directly to the LLM as the
context.

------------------------------------------------------------------------

## Token embeddings inside an LLM

Inside an LLM, token IDs are mapped to learned vector representations
before the Transformer processes them.

Conceptually:

``` text
Text
 ↓
Tokenizer
 ↓
Token IDs
 ↓
LLM embedding layer
 ↓
Vectors
 ↓
Transformer
```

These are often called **token embeddings**.

### Key distinction

> **RAG text embeddings help retrieve relevant information.**

> **Token embeddings help the LLM process tokens internally.**

------------------------------------------------------------------------

# 6. What is RAG?

**RAG = Retrieval-Augmented Generation**

RAG is a technique where relevant information is retrieved from an
external knowledge source and provided to an LLM as context before
generating an answer.

## Why use RAG?

RAG is useful when we need:

-   Up-to-date information
-   Private/company information
-   External knowledge
-   Better grounding
-   Relevant information without retraining the model

It can also help reduce hallucinations by grounding responses in
retrieved information.

------------------------------------------------------------------------

# 7. Why Does RAG Compare Embeddings Before the LLM?

The purpose of RAG is:

> **Find the right information → Give it to the LLM → Let the LLM
> answer**

Imagine a company has:

-   10,000 documents
-   Hundreds of thousands of paragraphs

A user asks:

> "How many annual leave days do employees get?"

We don't want to send every paragraph to the LLM.

Instead:

``` text
Company documents
       ↓
Create embeddings
       ↓
Store embeddings in vector database
```

At query time:

``` text
User question
       ↓
Create question embedding
       ↓
Vector database
       ↓
Similarity search
       ↓
Relevant document chunks
       ↓
Context + question
       ↓
LLM
       ↓
Answer
```

### Why use embeddings?

Keyword matching is not always enough.

Document:

> "Employees are entitled to 20 days of annual leave."

Question:

> "How much vacation can I take every year?"

The words are different, but the meaning is similar.

Embeddings allow semantic similarity to be identified.

### Important mental model

Don't think:

> "RAG compares embeddings so the LLM can understand the embeddings."

Think:

> **"RAG compares embeddings to find relevant information. The retrieved
> text is then added to the prompt and tokenized before being processed
> by the LLM."**

### Key flow

``` text
Embedding
   ↓
Find relevant information
   ↓
Retrieve original text
   ↓
Tokenize retrieved text
   ↓
LLM processes it
```

------------------------------------------------------------------------

# 8. Complete RAG Flow

## Document ingestion

``` text
Company Documents
       ↓
Chunking
       ↓
Text chunks
       ↓
Embedding Model
       ↓
Embeddings
       ↓
Vector Database
```

## Query time

``` text
User Question
       ↓
Question Embedding
       ↓
Vector Database
       ↓
Similarity Search
       ↓
Relevant Text Chunks
       ↓
Context + Question
       ↓
Tokenizer
       ↓
Tokens
       ↓
LLM
       ↓
Generated Response
```

### Important

The vector database normally returns the **original text chunks**, not
merely the embedding vectors.

For example:

``` text
Vector database finds:
[0.12, -0.45, 0.78, ...]
```

but the application retrieves the associated text:

``` text
"Employees are entitled to 20 days of annual leave..."
```

That text is then included in the LLM's context.

------------------------------------------------------------------------

# 9. How Does an LLM Work Internally?

The high-level flow is:

``` text
Text
 ↓
Tokens
 ↓
Token embeddings
 ↓
Transformer
 ↓
Attention / Self-Attention
 ↓
Contextual representation
 ↓
Next-token prediction
 ↓
Generated tokens
 ↓
Text response
```

------------------------------------------------------------------------

# 10. What is a Transformer?

A **Transformer** is a neural-network architecture used by modern LLMs.

It allows the model to process relationships between tokens efficiently.

### Easy definition

> **A Transformer is a neural-network architecture that uses attention
> mechanisms to understand relationships between tokens and process
> language efficiently.**

------------------------------------------------------------------------

# 11. What is Attention?

Attention answers:

> **"Which other tokens should I pay attention to when understanding
> this token?"**

Consider:

> "The cat drank the milk because it was thirsty."

To understand **"it"**, the model should pay attention to relevant
tokens, such as **"cat"**.

Conceptually:

``` text
The → cat       HIGH relevance
it  → cat       HIGH relevance
it  → milk      LOW relevance
```

Attention helps the model determine which parts of the input are
important to each other.

------------------------------------------------------------------------

# 12. What is Self-Attention?

**Self-attention** means tokens in a sequence attend to other tokens
within the same sequence.

For example:

> "The dog chased the ball because it was excited."

When processing **"it"**, the model considers other tokens in the same
sequence to understand what "it" likely refers to.

### Easy definition

> **Self-attention allows each token to consider other tokens in the
> same sequence when building its contextual representation.**

------------------------------------------------------------------------

# 13. Why is Self-Attention Useful?

The meaning of a word can depend heavily on context.

For example:

> "I went to the **bank** to deposit money."

versus:

> "I sat beside the **bank** of the river."

The word **bank** is the same, but the surrounding context changes its
meaning.

Self-attention helps the model understand those relationships.

------------------------------------------------------------------------

# 14. Query, Key, and Value

Attention uses three concepts:

-   **Query (Q)**
-   **Key (K)**
-   **Value (V)**

A simple analogy is a library search.

### Query

> "What information am I looking for?"

### Key

> "What information do I represent for matching?"

### Value

> "What information should I actually provide?"

Conceptually:

``` text
Query
"What am I looking for?"
       ↓
Compare with Keys
       ↓
Find relevant information
       ↓
Use Values
```

------------------------------------------------------------------------

## How Q, K, V work in self-attention

For each token, the model creates Q, K, and V representations.

``` text
The       → Q, K, V
cat       → Q, K, V
drank     → Q, K, V
milk      → Q, K, V
```

When processing a token such as **"drank"**, the model compares its
Query with the Keys of other tokens to determine relevance.

Conceptually:

``` text
"drank" Query
      │
      ├── "The"   → low relevance
      ├── "cat"   → high relevance
      ├── "drank" → relevance
      └── "milk"  → high relevance
```

### Interview-ready explanation

> **Queries represent what a token is looking for, Keys represent what
> each token offers for matching, and Values contain the information
> used after attention scores are calculated.**

------------------------------------------------------------------------

# 15. Next-Token Prediction

A fundamental operation of an LLM is predicting the next token based on
the context it has processed.

Suppose the input is:

``` text
"React is a"
```

The model may produce probabilities such as:

``` text
library      45%
framework    35%
language      5%
database      1%
...
```

The model uses a decoding strategy to select the next token.

If it selects:

``` text
"library"
```

the sequence becomes:

``` text
"React is a library"
```

Then it predicts the next token again.

``` text
Generate token
      ↓
Add token to context
      ↓
Predict next token
      ↓
Generate token
      ↓
Repeat
```

This repeated next-token prediction produces the response.

### Important clarification

The model is not simply looking at the last word.

It uses the **context and relationships between tokens**, which is where
the Transformer and attention mechanisms are important.

------------------------------------------------------------------------

# 16. Training vs Inference

## Training

Training is where the model learns.

``` text
Training data
     ↓
Tokens
     ↓
Model
     ↓
Prediction
     ↓
Compare with target
     ↓
Calculate loss
     ↓
Backpropagation
     ↓
Update parameters
     ↓
Repeat
```

## Inference

Inference is when the trained model is used.

``` text
User input
    ↓
Tokens
    ↓
Trained LLM
    ↓
Prediction
    ↓
Response
```

### Key difference

> **Training = learning**

> **Inference = using the learned model**

During training, parameters are updated.

During normal inference, the model's parameters are not being updated.

------------------------------------------------------------------------

# 17. What are Parameters?

Parameters are learned numerical values inside the neural network.

During training, these values are adjusted so the model becomes better
at predicting tokens.

Think of them as the model's **learned internal configuration**.

``` text
Training data
     ↓
Model
     ↓
Parameters
     ↓
Adjust parameters
     ↓
Better predictions
```

Modern LLMs can contain billions of parameters.

------------------------------------------------------------------------

# 18. What is a Loss Function?

A loss function measures how far the model's prediction is from the
desired target.

Example:

``` text
Input:
"The capital of France is..."

Expected:
Paris

Model predicts:
London
```

The loss function measures the prediction error.

``` text
Prediction
    ↓
Compare with target
    ↓
Loss
```

If the prediction is better, the loss is generally lower.

------------------------------------------------------------------------

# 19. What is Backpropagation?

Backpropagation determines how the prediction error should be propagated
backward through the network so the model's parameters can be adjusted.

Simplified:

``` text
Input
  ↓
Model
  ↓
Prediction
  ↓
Loss
  ↓
Backpropagation
  ↓
Update parameters
  ↓
Better model
```

------------------------------------------------------------------------

# 20. What is Gradient Descent?

Gradient descent is an optimization technique used to adjust parameters
in a direction that reduces the loss.

A simple analogy is trying to reach the lowest point of a mountain.

``` text
       ●
      / \
     /   \
    /     \
   /       \____
                ●
             lowest loss
```

You repeatedly move toward a direction that reduces the loss.

### Remember the relationship

> **Loss tells us how wrong the model is.**

> **Backpropagation calculates how the error should affect the
> parameters.**

> **Gradient descent updates parameters to reduce the loss.**

------------------------------------------------------------------------

# 21. Pretraining

**Pretraining** is large-scale training that teaches a model general
patterns and capabilities from massive amounts of data.

Training data can include different types of text and code depending on
the model and training process.

Conceptually:

``` text
Large training data
       ↓
Tokenization
       ↓
Training
       ↓
General-purpose LLM
```

The model learns patterns such as:

-   Language structure
-   Grammar
-   Relationships between concepts
-   Programming patterns
-   Common knowledge patterns
-   Writing patterns

The model is not simply storing every sentence it has seen.

Its parameters learn patterns from the training process.

------------------------------------------------------------------------

# 22. Fine-Tuning

Fine-tuning means taking an already-trained model and training it
further on a more specific dataset.

``` text
Pretrained LLM
      ↓
Specific training data
      ↓
Fine-tuning
      ↓
Specialized behavior
```

Fine-tuning can be useful for:

-   Specific behavior
-   Specific output formats
-   Specialized tasks
-   Consistent style
-   Domain-specific behavior

### Important

Don't say:

> "Fine-tuning causes hallucinations."

Instead:

> **"Fine-tuning changes model behavior, but hallucinations can occur
> with both fine-tuned and non-fine-tuned models."**

------------------------------------------------------------------------

# 23. SFT --- Supervised Fine-Tuning

**SFT = Supervised Fine-Tuning**

SFT trains a pretrained model using examples of desired input-output
behavior.

Example:

``` text
Input:
"Explain JavaScript closures."

Expected output:
"A closure is a function that..."
```

Many examples like this can teach the model a desired behavior.

### Easy definition

> **SFT trains a pretrained model using labeled examples of desired
> input-output behavior.**

------------------------------------------------------------------------

# 24. Why Instruction Tuning?

Instruction tuning helps a model respond appropriately to user
instructions.

For example:

``` text
User:
"Write a Python function to calculate factorial."
```

We want the model to generate an appropriate function rather than simply
continue text in an unrelated way.

Instruction tuning helps improve instruction-following behavior.

------------------------------------------------------------------------

# 25. RLHF

**RLHF = Reinforcement Learning from Human Feedback**

The basic idea is to use human preferences to help align model behavior
with responses people consider useful or preferable.

Example:

``` text
Prompt
  ↓
Model
 ↙   ↘
A     B
 \   /
  Human preference
       ↓
Training signal
       ↓
Improve behavior
```

If humans consistently prefer one response over another, those
preferences can be used as a training signal.

### Why RLHF?

Predicting the next token is not exactly the same as producing the most
helpful answer.

Human feedback can help improve:

-   Helpfulness
-   Instruction following
-   Response quality
-   Safety/alignment

------------------------------------------------------------------------

# 26. Pretraining vs SFT vs RLHF

  -----------------------------------------------------------------------
  Stage                               Main purpose
  ----------------------------------- -----------------------------------
  **Pretraining**                     Learn general language patterns and
                                      capabilities

  **SFT / Fine-tuning**               Learn specific behavior, tasks, or
                                      instructions

  **RLHF**                            Use human preferences to improve
                                      alignment/behavior
  -----------------------------------------------------------------------

Easy memory trick:

``` text
Pretraining
"Learn language"
      ↓
SFT
"Learn how to follow instructions"
      ↓
RLHF
"Learn which behaviors humans prefer"
```

This is a simplified mental model; real production training pipelines
can vary.

------------------------------------------------------------------------

# 27. RAG vs Fine-Tuning

This is an important interview topic.

## RAG

The model stays unchanged.

``` text
LLM
 +
External knowledge
 ↓
RAG application
```

RAG retrieves relevant information at runtime and provides it as
context.

Use RAG when information:

-   Changes frequently
-   Is private/internal
-   Comes from external documents
-   Needs to be retrieved dynamically

## Fine-tuning

The model itself is trained further.

``` text
Existing LLM
     ↓
Additional training
     ↓
Modified model behavior
```

Consider fine-tuning when you need consistent:

-   Behavior
-   Style
-   Format
-   Specialized task performance

### Easy way to remember

**RAG:**

> Model stays the same + external knowledge

**Fine-tuning:**

> Model is trained further + behavior changes

------------------------------------------------------------------------

# 28. Temperature

Temperature controls how predictable or varied the model's token
selection is during generation.

### Lower temperature

Generally produces more predictable/deterministic output.

### Higher temperature

Generally allows more variation and creativity.

Example:

``` text
Low temperature
      ↓
More predictable output

Higher temperature
      ↓
More varied output
```

### Important

Temperature does not:

-   Retrain the model
-   Add knowledge
-   Change model parameters
-   Make the model inherently smarter

### Hallucination connection

Don't say:

> "Lower temperature prevents hallucinations."

Say:

> **"Lower temperature can make outputs more deterministic, but it does
> not eliminate hallucinations."**

------------------------------------------------------------------------

# 29. Sampling

Sampling means selecting the next token using the probability
distribution rather than always choosing only the highest-probability
token.

Example:

``` text
blue       70%
clear      20%
bright      7%
green       3%
```

A purely greedy strategy might always select:

> blue

Sampling can allow other likely tokens to be selected, introducing
variation.

------------------------------------------------------------------------

# 30. Top-K

Top-K restricts token selection to the **K highest-probability tokens**.

Example:

``` text
blue       40%
clear      25%
bright     15%
dark       10%
green       5%
red         3%
yellow      2%
```

If:

``` text
Top-K = 3
```

the candidates are:

``` text
blue
clear
bright
```

### Definition

> **Top-K restricts token selection to the K highest-probability
> tokens.**

------------------------------------------------------------------------

# 31. Top-P

Top-P is also called **nucleus sampling**.

Instead of selecting a fixed number of tokens, it selects enough of the
highest-probability tokens to reach a cumulative probability threshold.

Example:

``` text
blue       50%
clear      25%
bright     15%
dark        7%
green       3%
```

If:

``` text
Top-P = 0.90
```

we accumulate:

``` text
blue                 50%
blue + clear         75%
+ bright             90%
```

So the candidate set becomes:

``` text
blue
clear
bright
```

### Top-K vs Top-P

  -----------------------------------------------------------------------
  Top-K                               Top-P
  ----------------------------------- -----------------------------------
  Fixed number of candidate tokens    Variable number of candidate tokens

  Example: K = 10                     Example: P = 0.90

  Select highest K probabilities      Select tokens until cumulative
                                      probability reaches P
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 32. How Token Generation Works

Conceptually:

``` text
Prompt
  ↓
LLM
  ↓
Token probabilities
  ↓
Temperature
  ↓
Top-K / Top-P filtering
  ↓
Sampling / selection
  ↓
Next token
  ↓
Add token to context
  ↓
Predict next token
  ↓
Repeat
```

This process continues until the model reaches an appropriate stopping
condition.

------------------------------------------------------------------------

# 33. Complete LLM Mental Model

At this point, the overall picture is:

``` text
                         LLM

                  ┌───────────────┐
                  │    Training   │
                  └───────┬───────┘
                          ↓
                Large training data
                          ↓
                     Tokenization
                          ↓
                    Transformer
                          ↓
                  Next-token prediction
                          ↓
                    Loss function
                          ↓
                    Backpropagation
                          ↓
                 Update parameters
                          ↓
                  Trained LLM
                          │
                          │
                     INFERENCE
                          ↓
                    User question
                          ↓
                       Tokens
                          ↓
                  Token embeddings
                          ↓
                    Transformer
                          ↓
                   Self-attention
                          ↓
                      Q / K / V
                          ↓
               Contextual representation
                          ↓
                Next-token probabilities
                          ↓
            Temperature / Top-K / Top-P
                          ↓
                    Next token
                          ↓
                       Repeat
                          ↓
                     Response
```

------------------------------------------------------------------------

# 34. Where RAG Fits

RAG is an application-level technique that adds external knowledge to
the inference process.

``` text
                  User Question
                        │
              ┌─────────┴─────────┐
              ↓                   ↓
      Query Embedding          Question
              ↓                   │
       Vector Database            │
              ↓                   │
     Relevant Text Chunks         │
              └─────────┬─────────┘
                        ↓
                Context + Question
                        ↓
                    Tokenizer
                        ↓
                      LLM
                        ↓
                    Response
```

The important distinction is:

> **Embeddings help find the relevant information. Tokens are what the
> LLM processes.**

------------------------------------------------------------------------

# 35. Where Agents and Tool Calling Fit

RAG is about retrieving relevant information.

Tool calling allows an LLM application to interact with external
systems.

For example:

``` text
User:
"Show products with low stock."
        ↓
      LLM
        ↓
Request database tool
        ↓
Inventory database
        ↓
Results
        ↓
      LLM
        ↓
Natural-language response
```

This will be covered in detail in the next part of the preparation.

------------------------------------------------------------------------

# 36. High-Priority PwC Interview Corrections

Remember these exact distinctions:

  -----------------------------------------------------------------------
  Don't say                           Say instead
  ----------------------------------- -----------------------------------
  LLM has a lot of memory             LLM processes a large context
                                      window

  Retrieval-Augmented Graph           Retrieval-Augmented Generation

  Embeddings are tokens               Embeddings are numerical
                                      representations capturing semantic
                                      meaning

  RAG sends embeddings to the LLM     RAG retrieves relevant text, which
                                      is then tokenized and processed by
                                      the LLM

  Fine-tuning causes hallucinations   Fine-tuning changes model behavior;
                                      hallucinations can occur with
                                      either approach

  Lower temperature prevents          Lower temperature can make output
  hallucinations                      more deterministic but doesn't
                                      eliminate hallucinations

  AI agent is just an LLM for a task  An agent can use tools, take
                                      actions, and work toward a goal

  RAG modifies the model              RAG provides external context
                                      without changing the model

  Training and inference are the same Training learns/updates parameters;
                                      inference uses the trained model
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# 37. Quick Revision Sheet

If you have only a few minutes before the interview, remember these:

### LLM

> Deep-learning model trained on huge amounts of data to understand and
> generate language.

### Token

> Small unit of text processed by the LLM.

### Context Window

> Maximum amount of token-based context the model can process at one
> time.

### Embedding

> Numerical representation capturing semantic meaning.

### Transformer

> Neural-network architecture used by modern LLMs.

### Attention

> Mechanism that determines which tokens are relevant to each other.

### Self-Attention

> Tokens attend to other tokens within the same sequence.

### Q/K/V

> Query = what I'm looking for; Key = what I offer for matching; Value =
> information used after matching.

### Next-Token Prediction

> Predict the next token based on the context.

### Training

> Learning from data and updating parameters.

### Loss

> Measures prediction error.

### Backpropagation

> Determines how the error should influence parameters.

### Gradient Descent

> Updates parameters to reduce loss.

### Pretraining

> Learn general patterns and capabilities.

### SFT

> Learn desired input-output behavior from supervised examples.

### RLHF

> Use human preferences to improve alignment/behavior.

### RAG

> Retrieve external relevant information and provide it as context to
> the LLM.

### Fine-Tuning

> Further train the model to change/adapt its behavior.

### Temperature

> Controls randomness/variation in token selection.

### Top-K

> Select from the K most probable tokens.

### Top-P

> Select from enough probable tokens to reach a cumulative probability
> threshold.

### Sampling

> Select tokens from the probability distribution rather than always
> choosing only the highest-probability token.

------------------------------------------------------------------------

# 38. The One Big Picture to Remember

``` text
                    USER
                      │
                      ↓
                  QUESTION
                      │
                      ↓
             ┌─────────────────┐
             │   RAG (optional)│
             │                 │
             │ Query embedding │
             │       ↓         │
             │  Vector search  │
             │       ↓         │
             │ Relevant chunks │
             └────────┬────────┘
                      ↓
              Context + Question
                      ↓
                  Tokenizer
                      ↓
                    Tokens
                      ↓
              Token Embeddings
                      ↓
                 Transformer
                      ↓
                Self-Attention
                      ↓
                   Q / K / V
                      ↓
             Contextual meaning
                      ↓
            Next-token prediction
                      ↓
       Temperature / Top-K / Top-P
                      ↓
                 Next token
                      ↓
                    Repeat
                      ↓
                   RESPONSE
```

## Interview priority

For the PwC AI Engineer interview, prioritize understanding these
concepts in this order:

1.  **LLM fundamentals**
2.  **Tokens and context windows**
3.  **Embeddings**
4.  **Transformer and attention**
5.  **Next-token prediction**
6.  **RAG**
7.  **RAG vs fine-tuning**
8.  **Hallucination reduction**
9.  **Prompt engineering**
10. **Function/tool calling**
11. **AI agents**
12. **Production AI architecture**

------------------------------------------------------------------------

## Next topic

The natural next topic after these fundamentals is:

**Prompt Engineering**

We'll cover:

-   System vs user prompts
-   Roles
-   Instructions
-   Context
-   Constraints
-   Zero-shot prompting
-   Few-shot prompting
-   Chain-of-thought considerations
-   Structured output / JSON
-   Prompt templates
-   Prompt injection
-   Prompt versioning
-   Production prompt design
