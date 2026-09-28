# Python Interview Q&A: Round 2 (Python + FastAPI)

> Built from your topic list: collections, `*args`/`**kwargs`, `==` vs `is`, functions and lambda, comprehensions, exceptions, OOP and `self`, decorators, generators, iterators, async/await, threads vs processes, memory and the GIL, and FastAPI. Extra topics (copying, closures, context managers, testing, coding problems) are added because they come up in the same interviews.
>
> **46 questions · 10 sections.** Each answer explains the idea in plain English, then shows code, then gives a one-line **Interview soundbite** you can say out loud. Every code block was run, so the outputs in the comments are real.
>
> **Python only:** no comparisons with other languages, just the core language, concurrency, memory, and FastAPI.

<a id="plan"></a>
## Study Plan (round 2 is Wednesday, 9 AM)

| Priority | Questions | Why |
|---|---|---|
| **1: Must read** | [Q1–10](#s1) data structures, functions, `==` vs `is` · [Q23](#q23) decorators · [Q25–27](#s7) GIL, threads, async · [Q32–37](#s9) FastAPI | Asked in almost every Python screen |
| **2: Should read** | [Q11–13](#s3) comprehensions, iterators, generators · [Q14–16](#s4) exceptions · [Q17–22](#s5) OOP · [Q46](#q46) type hints, dataclasses, Pydantic | Fundamentals round |
| **3: Skim** | [Q29–31](#s8) memory · [Q28](#q28) locks · [Q40](#q40) database | Deeper follow-ups |
| **Morning** | [Q45](#q45) rapid-fire · [Q43–44](#q43) coding problems and output puzzles | Warm-up |

<a id="toc"></a>
## Table of Contents

- **[Section 1: Data Structures](#s1)**
  1. [### 1. What is the difference between list, tuple, set, and dictionary?](#q1)
  2. [### 2. What is mutable vs immutable, and what does "hashable" mean?](#q2)
  3. [### 3. What is the difference between assignment, shallow copy, and deep copy?](#q3)
  4. [### 4. How fast are common operations, and which `collections` types should I know?](#q4)
  5. [### 5. What dictionary operations come up most in interviews?](#q5)
- **[Section 2: Functions & Scope](#s2)**
  6. [### 6. How do functions work in Python? (defaults, return values, first-class)](#q6)
  7. [### 7. What are `*args` and `**kwargs`?](#q7)
  8. [### 8. What is a lambda, and when should you use one?](#q8)
  9. [### 9. What are closures and the LEGB scope rule?](#q9)
  10. [### 10. What is the difference between `==` and `is`?](#q10)
- **[Section 3: Comprehensions, Iterators & Generators](#s3)**
  11. [### 11. What are list, dict, and set comprehensions?](#q11)
  12. [### 12. What is the difference between an iterable and an iterator?](#q12)
  13. [### 13. What are generators, and why use them?](#q13)
- **[Section 4: Exceptions & Context Managers](#s4)**
  14. [### 14. How does exception handling work? (try / except / else / finally)](#q14)
  15. [### 15. How do you create custom exceptions? (and what is EAFP?)](#q15)
  16. [### 16. What is a context manager, and how do you write one?](#q16)
- **[Section 5: Object-Oriented Programming](#s5)**
  17. [### 17. What are classes, objects, `__init__`, and `self`?](#q17)
  18. [### 18. What are instance attributes vs class attributes, and instance vs class vs static methods?](#q18)
  19. [### 19. How do inheritance, `super()`, MRO, and polymorphism work? (And composition vs inheritance?)](#q19)
  20. [### 20. How does encapsulation work in Python? (`_x`, `__x`, `@property`)](#q20)
  21. [### 21. What are dunder (magic) methods?](#q21)
  22. [### 22. What are abstract classes, duck typing, and `Protocol`?](#q22)
- **[Section 6: Decorators](#s6)**
  23. [### 23. What is a decorator, and how do you write one?](#q23)
  24. [### 24. Show a practical decorator: retry, and caching with `lru_cache`.](#q24)
- **[Section 7: Concurrency: GIL, Threads, Processes, Async](#s7)**
  25. [### 25. What is the GIL, and why does it exist?](#q25)
  26. [### 26. Multithreading vs multiprocessing vs asyncio: when do you use which?](#q26)
  27. [### 27. How does `async` / `await` work in Python?](#q27)
  28. [### 28. What is a race condition, and how do you prevent it? (`threading.Lock`)](#q28)
- **[Section 8: Memory Management](#s8)**
  29. [### 29. How does Python manage memory?](#q29)
  30. [### 30. What are reference cycles and memory leaks, and how do you reduce memory use?](#q30)
  31. [### 31. Is Python pass-by-value or pass-by-reference?](#q31)
- **[Section 9: API Development with FastAPI](#s9)**
  32. [### 32. What is FastAPI, and why use it? (ASGI, Starlette, Pydantic)](#q32)
  33. [### 33. How do path parameters, query parameters, and request bodies work? (validation and 422)](#q33)
  34. [### 34. What is dependency injection in FastAPI? (`Depends`)](#q34)
  35. [### 35. What is the difference between `async def` and `def` endpoints?](#q35)
  36. [### 36. How do you handle errors in FastAPI? (`HTTPException`, custom handlers, 422)](#q36)
  37. [### 37. How does authentication work in FastAPI? (JWT + `Depends`)](#q37)
  38. [### 38. How do `response_model`, status codes, and PATCH vs PUT work?](#q38)
  39. [### 39. How do you structure a FastAPI project? (routers and layers)](#q39)
  40. [### 40. How do you connect a database in FastAPI? (SQLAlchemy 2.0 + a session dependency)](#q40)
  41. [### 41. How do you test a FastAPI app? (`TestClient`, `dependency_overrides`, pytest)](#q41)
  42. [### 42. FastAPI vs Flask vs Django: when do you pick which?](#q42)
- **[Section 10: Practice: Coding, Output Puzzles & Rapid-Fire](#s10)**
  43. [### 43. What basic coding problems should I be able to solve in Python?](#q43)
  44. [### 44. Predict the output: what do these snippets print?](#q44)
  45. [### 45. Rapid-fire: one-line answers to common Python questions](#q45)
  46. [### 46. What are type hints, dataclasses, and Pydantic, and how do they differ?](#q46)

---

<a id="s1"></a>
## Section 1: Data Structures

<a id="q1"></a>
### 1. What is the difference between list, tuple, set, and dictionary?

All four are built-in containers. Choose based on **three questions: does order matter, do I need to change it, and do I need unique items or key lookup?**

| | list | tuple | set | dict |
|---|---|---|---|---|
| Syntax | `[1, 2]` | `(1, 2)` | `{1, 2}` | `{"a": 1}` |
| Ordered? | Yes | Yes | **No** (no indexing) | Yes, by insertion (3.7+) |
| Mutable? | Yes | **No** | Yes | Yes |
| Duplicates? | Yes | Yes | **No** | Keys unique, values can repeat |
| Lookup | by index O(1); `in` is O(n) | by index O(1) | `in` is **O(1)** average | by key **O(1)** average |
| Typical use | A sequence you change | A fixed record, or a dict key | Uniqueness, fast `in`, set maths | Key → value mapping |

Gotchas interviewers like:
- `{}` is an **empty dict**. An empty set is `set()`.
- A one-item tuple needs a comma: `(1,)`. Without it, `(1)` is just the number 1.
- Set elements and dict keys must be **hashable** (see Q2).

```python
nums = [3, 1, 2, 3]
nums.append(4)
nums.sort()
print(nums)                         # [1, 2, 3, 3, 4]

point = (10, 20)                    # fixed record
x, y = point                        # unpacking
print(x, y)                         # 10 20

a, b = {1, 2, 3}, {3, 4}
print(a & b, a | b, a - b)          # {3} {1, 2, 3, 4} {1, 2}   (intersection, union, difference)
print(set(nums))                    # {1, 2, 3, 4}   ← removes duplicates

user = {"name": "Asha", "role": "admin"}
print(user["name"], user.get("email", "n/a"))   # Asha n/a   (.get avoids KeyError)

print(type({}), type(set()), type((1,)), type((1)))
# <class 'dict'> <class 'set'> <class 'tuple'> <class 'int'>
```

**Interview soundbite:** "List for an ordered sequence I change, tuple for a fixed record, set for uniqueness and fast membership, dict for key-value lookup, and dicts and sets are hash-based, so lookups are O(1) on average."

<a id="q2"></a>
### 2. What is mutable vs immutable, and what does "hashable" mean?

- **Immutable** objects cannot change after creation: `int`, `float`, `str`, `bool`, `tuple`, `frozenset`, `bytes`, `None`. "Changing" them creates a **new** object.
- **Mutable** objects change in place: `list`, `dict`, `set`, and most custom objects.
- **Hashable** means the object has a stable hash value that never changes during its life. Immutable built-ins are hashable, and mutable containers are not. **Dict keys and set items must be hashable**, because Python uses the hash to find the slot.
- A tuple is hashable only if everything inside it is. `(1, [2])` is not.

Why it matters: passing a mutable object to a function lets the function change the caller's data.

```python
def add_item(items):
    items.append("x")          # mutates the caller's list

def rename(name):
    name = name + "!"          # creates a NEW string; the caller's string is untouched

lst, s = ["a"], "hi"
add_item(lst)
rename(s)
print(lst, s)                  # ['a', 'x'] hi

t = (1, [2, 3])
t[1].append(4)                 # the tuple can't change, but the list inside it can
print(t)                       # (1, [2, 3, 4])

try:
    {[1, 2]: "value"}          # list as a dict key
except TypeError as e:
    print(e)                   # unhashable type: 'list'

lookup = {(1, 2): "ok"}        # tuple key works
print(lookup[(1, 2)])          # ok
```

**Interview soundbite:** "Immutable objects can't change, so they're hashable and can be dict keys. Mutable ones can be changed by any function that receives them, which is why defaults and copies need care."

<a id="q3"></a>
### 3. What is the difference between assignment, shallow copy, and deep copy?

- **Assignment** (`b = a`) copies nothing. Both names point to the **same object**.
- **Shallow copy** (`a.copy()`, `list(a)`, `copy.copy(a)`) makes a new outer container, but the **inner objects are shared**.
- **Deep copy** (`copy.deepcopy(a)`) recursively copies everything, so the two are fully independent.

The classic trap is `[[0] * 3] * 3`. It makes three references to **one** inner list.

```python
import copy

orig = {"name": "wf", "steps": [1, 2]}
alias = orig                      # same object
shallow = orig.copy()             # new dict, SAME inner list
deep = copy.deepcopy(orig)        # fully independent

orig["steps"].append(3)           # mutate the shared inner list
orig["name"] = "changed"          # rebind a key on the outer dict

print(alias["steps"], shallow["steps"], deep["steps"])
# [1, 2, 3] [1, 2, 3] [1, 2]
print(alias["name"], shallow["name"], deep["name"])
# changed wf wf

bad = [[0] * 3] * 3               # three references to ONE row
bad[0][0] = 1
print(bad)                        # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

good = [[0] * 3 for _ in range(3)]    # a fresh row each time
good[0][0] = 1
print(good)                       # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

**Interview soundbite:** "Assignment shares the object, a shallow copy shares the inner objects, and deepcopy shares nothing. For nested data I use deepcopy or build it with a comprehension."

<a id="q4"></a>
### 4. How fast are common operations, and which `collections` types should I know?

| Operation | list | set / dict |
|---|---|---|
| Index / get by key | O(1) | O(1) average |
| `x in container` | **O(n)** | **O(1)** average |
| `append` / `pop()` (end) | O(1) | n/a |
| `insert(0, x)` / `pop(0)` | **O(n)** (shifts everything) | n/a |
| Sort | O(n log n) (Timsort) | n/a |

The most common performance fix is turning a `list` membership check into a `set`. For queues, use **`deque`**, because `list.pop(0)` is O(n).

`collections` types to know: **`deque`** (fast both ends), **`Counter`** (count things), **`defaultdict`** (auto-create missing keys), and **`OrderedDict`** (rarely needed now).

```python
from collections import Counter, defaultdict, deque

queue = deque([1, 2, 3])
queue.append(4)                  # O(1) at the right end
print(queue.popleft())           # 1 — O(1) at the left end

print(Counter("banana").most_common(2))     # [('a', 3), ('n', 2)]

groups = defaultdict(list)       # missing key → new empty list
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))              # {'a': ['apple', 'avocado'], 'b': ['banana']}

big_list = list(range(100_000))
big_set = set(big_list)
print(99_999 in big_list, 99_999 in big_set)   # True True — same answer, but the set is far faster
```

**Interview soundbite:** "Membership on a list is O(n) and on a set or dict it's O(1), so I use sets for lookups, deque for queues, Counter for counting, and defaultdict for grouping."

<a id="q5"></a>
### 5. What dictionary operations come up most in interviews?

```python
scores = {"asha": 82, "ravi": 95, "kiran": 70}

# Sort by value
top = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
print(top)                       # [('ravi', 95), ('asha', 82), ('kiran', 70)]
print(dict(top[:2]))             # {'ravi': 95, 'asha': 82}

# Invert (values must be unique and hashable)
print({v: k for k, v in scores.items()})    # {82: 'asha', 95: 'ravi', 70: 'kiran'}

# Safe access and removal
print(scores.get("zed"), scores.get("zed", 0))     # None 0
print(scores.pop("kiran", None), scores.pop("zed", None))   # 70 None
print(scores)                    # {'asha': 82, 'ravi': 95}

# Insert only if missing, and merge
scores.setdefault("meena", 60)
merged = scores | {"asha": 90}   # Python 3.9+; the right side wins on clashes
print(merged)                    # {'asha': 90, 'ravi': 95, 'meena': 60}

# Loop patterns
for name, score in scores.items():
    if score > 80:
        print(name)              # asha, then ravi

# Group by a key
records = [("fe", "Asha"), ("be", "Ravi"), ("fe", "Kiran")]
by_team = {}
for team, person in records:
    by_team.setdefault(team, []).append(person)
print(by_team)                   # {'fe': ['Asha', 'Kiran'], 'be': ['Ravi']}
```

**Interview soundbite:** "`.get` for safe reads, `.items()` for looping, `sorted(..., key=...)` for ordering, `setdefault` or `defaultdict` for grouping, and `|` to merge."

[↑ Back to top](#toc)

---

<a id="s2"></a>
## Section 2: Functions & Scope

<a id="q6"></a>
### 6. How do functions work in Python? (defaults, return values, first-class)

- A function without a `return` returns **`None`**.
- **Return multiple values** by returning a tuple and unpacking it.
- Functions are **first-class objects**, so you can store them in variables, pass them as arguments, and return them.
- **Default values are evaluated once**, at definition time. That's why a mutable default like `[]` is shared between calls. Use `None`.
- **Keyword-only arguments** come after a bare `*`.

```python
def greet(name, greeting="Hello", *, punctuation="!"):
    return f"{greeting}, {name}{punctuation}"

print(greet("Asha"))                       # Hello, Asha!
print(greet("Ravi", "Hi", punctuation="?"))    # Hi, Ravi?

def min_max(nums):
    return min(nums), max(nums)            # returns ONE tuple

lo, hi = min_max([3, 1, 4])
print(lo, hi)                              # 1 4

def apply(fn, value):                      # functions are objects: pass them around
    return fn(value)

print(apply(str.upper, "abc"), apply(len, [1, 2, 3]))   # ABC 3

def add_bad(item, items=[]):               # ❌ ONE list shared by every call
    items.append(item)
    return items

def add_good(item, items=None):            # ✅ new list per call
    items = [] if items is None else items
    items.append(item)
    return items

print(add_bad(1), add_bad(2))              # [1, 2] [1, 2]
print(add_good(1), add_good(2))            # [1] [2]
```

**Interview soundbite:** "Functions are first-class objects, no return means None, multiple returns are really a tuple, and I never use a mutable default argument."

<a id="q7"></a>
### 7. What are `*args` and `**kwargs`?

- **`*args`** collects extra **positional** arguments into a **tuple**.
- **`**kwargs`** collects extra **keyword** arguments into a **dict**.
- At a call site, `*` unpacks a list or tuple and `**` unpacks a dict. That's how wrappers and decorators forward arguments untouched.
- **Parameter order:** normal → default → `*args` → keyword-only → `**kwargs`.

```python
def report(title, *args, sep=" | ", **kwargs):
    print(title, sep.join(map(str, args)), kwargs)

report("Run:", "a", "b", status="ok", retries=2)
# Run: a | b {'status': 'ok', 'retries': 2}

nums = [1, 2, 3]
opts = {"sep": "-"}
report("Spread:", *nums, **opts)           # unpack a list and a dict at the call site
# Spread: 1-2-3 {}

def call_with_log(fn, *args, **kwargs):    # forwards everything, whatever fn takes
    print(f"calling {fn.__name__} args={args} kwargs={kwargs}")
    return fn(*args, **kwargs)

def add(a, b, scale=1):
    return (a + b) * scale

print(call_with_log(add, 2, 3, scale=10))
# calling add args=(2, 3) kwargs={'scale': 10}
# 50

def full_order(a, b=1, *args, key, **kwargs):     # the legal parameter order
    return a, b, args, key, kwargs

print(full_order(1, 2, 3, 4, key="k", extra=True))
# (1, 2, (3, 4), 'k', {'extra': True})
```

**Interview soundbite:** "`*args` is a tuple of extras, `**kwargs` is a dict of named extras, and the same symbols at a call site unpack, so wrappers can forward any signature."

<a id="q8"></a>
### 8. What is a lambda, and when should you use one?

A **lambda** is a small anonymous function limited to **one expression**. It's meant for short throwaway functions, mostly as a `key=` argument to `sorted`, `min`, or `max`.

Limits: no statements, no assignments, and no docstring. If it needs a name, or gets long, write a `def`. Comprehensions are usually clearer than `map` or `filter` with a lambda.

```python
users = [{"name": "Asha", "age": 31}, {"name": "Ravi", "age": 27}]

print(sorted(users, key=lambda u: u["age"]))
# [{'name': 'Ravi', 'age': 27}, {'name': 'Asha', 'age': 31}]
print(max(users, key=lambda u: u["age"])["name"])        # Asha

print(list(map(lambda x: x * x, [1, 2, 3])))             # [1, 4, 9]
print(list(filter(lambda x: x % 2 == 0, range(6))))      # [0, 2, 4]
print([x * x for x in [1, 2, 3]])                        # [1, 4, 9]   ← the preferred style

from functools import reduce
print(reduce(lambda acc, x: acc + x, [1, 2, 3, 4]))      # 10

fns = [lambda: i for i in range(3)]                      # ⚠️ late binding: all see the final i
print([f() for f in fns])                                # [2, 2, 2]
fns = [lambda i=i: i for i in range(3)]                  # fix: capture with a default argument
print([f() for f in fns])                                # [0, 1, 2]
```

**Interview soundbite:** "A lambda is a one-expression anonymous function, best for `key=`. Anything longer gets a `def`, and I watch for late binding inside loops."

<a id="q9"></a>
### 9. What are closures and the LEGB scope rule?

**LEGB** is the order Python looks up a name: **L**ocal → **E**nclosing (outer functions) → **G**lobal (module) → **B**uilt-in.

A **closure** is an inner function that **remembers variables from its enclosing function** after the outer function has finished. It's how factories, decorators, and counters work.

- Reading an outer variable just works.
- **Reassigning** one needs `nonlocal` (enclosing) or `global` (module). Otherwise Python treats the name as a new local, which causes `UnboundLocalError`.

```python
x = "global"

def outer():
    x = "enclosing"
    def inner():
        return x               # found in the Enclosing scope before Global
    return inner()

print(outer())                 # enclosing

def make_counter():
    count = 0
    def inc():
        nonlocal count         # needed to REASSIGN the outer variable
        count += 1
        return count
    return inc                 # inc "closes over" count

c1, c2 = make_counter(), make_counter()
print(c1(), c1(), c2())        # 1 2 1   — each closure has its own count

total = 0
def bad():
    total += 1                 # assignment makes `total` local, but it has no value yet

try:
    bad()
except UnboundLocalError as e:
    print(e)    # cannot access local variable 'total' where it is not associated with a value
```

**Interview soundbite:** "LEGB is the lookup order. A closure keeps its enclosing variables alive, and I need `nonlocal` to reassign them."

<a id="q10"></a>
### 10. What is the difference between `==` and `is`?

- **`==`** asks "are the **values** equal?" It calls `__eq__`, which you can customize.
- **`is`** asks "are they the **same object** in memory?" It compares `id()`.
- Use **`is` only for singletons**, mainly `None` (and sometimes `True`/`False`). Write `x is None`, not `x == None`.
- Small integers and some short strings are **cached** by CPython, so `is` sometimes looks like it works on numbers. That's an implementation detail, so never rely on it.

```python
a = [1, 2]
b = [1, 2]
c = a
print(a == b, a is b, a is c)          # True False True

x = None
print(x is None)                       # True — the correct way to check for None

print(int("256") is int("256"))        # True   (small ints are cached: implementation detail!)
print(int("1000") is int("1000"))      # False  (don't depend on this either way)

class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y
    def __eq__(self, other):           # == uses this
        return (self.x, self.y) == (other.x, other.y)

p1, p2 = Point(1, 2), Point(1, 2)
print(p1 == p2, p1 is p2)              # True False
```

**Interview soundbite:** "`==` compares values via `__eq__`, `is` compares identity. I use `is` only for `None` and other singletons."

[↑ Back to top](#toc)

---

<a id="s3"></a>
## Section 3: Comprehensions, Iterators & Generators

<a id="q11"></a>
### 11. What are list, dict, and set comprehensions?

A **comprehension** builds a collection from another iterable in one readable expression: `[expression for item in iterable if condition]`.

- Use `[...]` for a list, `{k: v ...}` for a dict, `{...}` for a set, and `(...)` for a **generator** (lazy, see Q13).
- The `if` at the end **filters**. An `x if cond else y` at the front **chooses a value**.
- Read nested loops left to right, in the same order as the equivalent `for` loops.
- Stop at two `for` clauses. Beyond that, a normal loop is more readable.

```python
nums = range(1, 8)

print([n * n for n in nums if n % 2 == 0])                  # [4, 16, 36]         (filter)
print(["even" if n % 2 == 0 else "odd" for n in [1, 2, 3]]) # ['odd', 'even', 'odd']  (choose a value)

matrix = [[1, 2], [3, 4], [5, 6]]
print([v for row in matrix for v in row])                   # [1, 2, 3, 4, 5, 6]  (flatten)
print([[row[i] for row in matrix] for i in range(2)])       # [[1, 3, 5], [2, 4, 6]]  (transpose)

words = ["apple", "avocado", "banana"]
print({w: len(w) for w in words})                           # {'apple': 5, 'avocado': 7, 'banana': 6}
print(sorted({w[0] for w in words}))                        # ['a', 'b']  (set removes duplicates)

# Equivalent plain loop, for comparison:
result = []
for n in nums:
    if n % 2 == 0:
        result.append(n * n)
print(result)                                               # [4, 16, 36]
```

**Interview soundbite:** "Comprehensions are the readable, faster way to map and filter, in list, dict, set, and generator flavours, and I keep them to one or two loops."

<a id="q12"></a>
### 12. What is the difference between an iterable and an iterator?

- An **iterable** is anything you can loop over: it has `__iter__()` that returns an iterator. Lists, strings, dicts, files, and generators are iterables.
- An **iterator** produces items one at a time: it has `__next__()`, and raises **`StopIteration`** when it runs out. An iterator is also an iterable, because its `__iter__` returns itself.
- A `for` loop calls `iter(obj)` once, then calls `next()` repeatedly until `StopIteration`.
- An iterator is **single-use**. Once exhausted, it stays empty, while a list can be looped over again.

```python
nums = [10, 20]
it = iter(nums)                    # iterable → iterator
print(next(it), next(it))          # 10 20
try:
    next(it)
except StopIteration:
    print("exhausted")             # exhausted

class Countdown:                   # a custom iterator class
    def __init__(self, start):
        self.current = start
    def __iter__(self):
        return self                # an iterator returns itself
    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

print(list(Countdown(3)))          # [3, 2, 1]

c = Countdown(2)
print(list(c), list(c))            # [2, 1] []   ← the second pass is empty: single-use
```

**Interview soundbite:** "An iterable gives you an iterator through `__iter__`, and an iterator yields items through `__next__` until StopIteration. Iterators are single-use, and generators are the easy way to write one."

<a id="q13"></a>
### 13. What are generators, and why use them?

A **generator function** contains `yield`. Calling it doesn't run the body. It returns a **generator object** (an iterator) that runs **until the next `yield`**, pauses with its local state intact, and resumes on the next `next()`.

Why they matter:
- **Lazy:** values are produced on demand, so memory is O(1) instead of O(n).
- They work with **infinite sequences** and **streaming** large files.
- They **chain into pipelines**, where each stage processes one item at a time.
- `yield from` delegates to another iterable or generator.
- A **generator expression** `(x for x in ...)` is the one-liner form.

```python
import sys
from itertools import islice

def fib():
    a, b = 0, 1
    while True:                     # infinite, but only computes what you ask for
        yield a
        a, b = b, a + b

print(list(islice(fib(), 8)))       # [0, 1, 1, 2, 3, 5, 8, 13]

as_list = [n for n in range(1_000_000)]
as_gen = (n for n in range(1_000_000))
print(sys.getsizeof(as_list) > 1_000_000, sys.getsizeof(as_gen) < 1_000)   # True True

def flatten(nested):
    for item in nested:
        if isinstance(item, list):
            yield from flatten(item)    # delegate to the recursive generator
        else:
            yield item

print(list(flatten([1, [2, [3, 4]], 5])))    # [1, 2, 3, 4, 5]

# A lazy pipeline: each stage handles ONE line at a time
def read_lines(text):
    yield from text.splitlines()

def only_errors(lines):
    return (line for line in lines if "ERROR" in line)

def parse(lines):
    for line in lines:
        level, _, msg = line.partition(": ")
        yield {"level": level, "msg": msg}

log = "INFO: started\nERROR: db down\nERROR: retry failed"
print(list(parse(only_errors(read_lines(log)))))
# [{'level': 'ERROR', 'msg': 'db down'}, {'level': 'ERROR', 'msg': 'retry failed'}]

g = (n for n in range(3))
print(list(g), list(g))             # [0, 1, 2] []   ← exhausted after one pass
```

**Interview soundbite:** "A generator uses `yield` to produce values lazily with constant memory, which suits big files, infinite streams, and pipelines. It's single-use, and FastAPI streaming responses use the same idea."

[↑ Back to top](#toc)

---

<a id="s4"></a>
## Section 4: Exceptions & Context Managers

<a id="q14"></a>
### 14. How does exception handling work? (try / except / else / finally)

- **`try`**: code that might fail.
- **`except SomeError`**: handle a specific error. Order matters, so put the most specific first.
- **`else`**: runs **only if no exception** occurred.
- **`finally`**: runs **always**, even after a `return` or an unhandled error. Use it for cleanup.
- **Catch specific exceptions.** A bare `except:` also swallows `KeyboardInterrupt` and hides bugs.
- Use bare **`raise`** inside `except` to re-raise the same error after logging.

```python
def parse_age(raw):
    try:
        age = int(raw)
    except ValueError:
        print(f"not a number: {raw!r}")
        return None
    except TypeError:
        print("wrong type")
        return None
    else:
        print("parsed ok")          # only when there was NO exception
        return age
    finally:
        print("done")               # ALWAYS runs, before the function returns

print(parse_age("31"))
# parsed ok
# done
# 31
print(parse_age("abc"))
# not a number: 'abc'
# done
# None
print(parse_age(None))
# wrong type
# done
# None

try:
    try:
        1 / 0
    except ZeroDivisionError:
        print("logging it...")
        raise                       # re-raise the SAME exception for the caller
except ZeroDivisionError as e:
    print("caller got:", e)
# logging it...
# caller got: division by zero
```

**Interview soundbite:** "Try, then specific excepts, else for the success path, and finally for cleanup that always runs. I never use a bare except, and I re-raise with bare `raise`."

<a id="q15"></a>
### 15. How do you create custom exceptions? (and what is EAFP?)

Subclass `Exception`. A **base class for your app's errors** lets callers catch "anything we raised on purpose" in one clause, and subclasses carry the detail. Use **`raise NewError(...) from err`** to keep the original cause.

**EAFP** ("Easier to Ask Forgiveness than Permission") is the Pythonic style: just try it and catch the failure. **LBYL** ("Look Before You Leap") checks first. EAFP avoids race conditions, such as a file deleted between your check and your use.

```python
class AppError(Exception):
    """Base for every error this app raises on purpose."""

class NotFoundError(AppError):
    def __init__(self, resource, id_):
        super().__init__(f"{resource} {id_} not found")
        self.resource, self.id = resource, id_

class ConflictError(AppError):
    pass

def get_user(users, uid):
    try:
        return users[uid]
    except KeyError as err:
        raise NotFoundError("user", uid) from err     # keeps the original as __cause__

try:
    get_user({}, 7)
except AppError as e:                                  # catches NotFoundError AND ConflictError
    print(type(e).__name__, "-", e, "| cause:", type(e.__cause__).__name__)
# NotFoundError - user 7 not found | cause: KeyError

config = {"port": 8000}
try:                                                   # EAFP: try, and handle the failure
    host = config["host"]
except KeyError:
    host = "localhost"
print(host)                                            # localhost

print(config.get("host", "localhost"))                 # for dicts, .get is even simpler
```

**Interview soundbite:** "One base exception for the app, specific subclasses for cases, `raise ... from` to keep the cause, and EAFP over pre-checks."

<a id="q16"></a>
### 16. What is a context manager, and how do you write one?

A **context manager** guarantees **setup and cleanup** around a block, using `with`. It runs `__enter__` on the way in and `__exit__` on the way out, **even when an exception occurs**. It's a reusable `try/finally`. Typical uses are files, locks, DB transactions, and temporary settings.

Two ways to write one:
1. A **class** with `__enter__` and `__exit__`. Returning `True` from `__exit__` would swallow the exception, so normally return `False`.
2. A **generator** with `@contextlib.contextmanager`: code before `yield` is setup, code after is cleanup, and you wrap the `yield` in `try/finally`.

```python
from contextlib import contextmanager

class Resource:
    def __enter__(self):
        print("open")
        return self
    def __exit__(self, exc_type, exc, tb):
        print("close")
        return False                 # False → don't swallow the exception

with Resource():
    print("working")
# open
# working
# close

try:
    with Resource():
        raise ValueError("boom")
except ValueError as e:
    print("caught", e)
# open
# close          ← cleanup ran even though it failed
# caught boom

settings = {"debug": False}

@contextmanager
def override(key, value):
    old = settings[key]
    settings[key] = value            # setup
    try:
        yield
    finally:
        settings[key] = old          # cleanup, always

with override("debug", True):
    print(settings["debug"])         # True
print(settings["debug"])             # False

with open("/tmp/_demo.txt", "w") as f:    # the most common one: the file always gets closed
    f.write("hi")
print(f.closed)                      # True
```

**Interview soundbite:** "`with` guarantees cleanup through `__enter__` and `__exit__`, like a reusable try/finally. I write them as a class or with `@contextmanager`, and use them for files, locks, and transactions."

[↑ Back to top](#toc)

---

<a id="s5"></a>
## Section 5: Object-Oriented Programming

<a id="q17"></a>
### 17. What are classes, objects, `__init__`, and `self`?

- A **class** is a blueprint. An **object (instance)** is one thing built from it.
- **`__init__`** is the initializer. It runs right after the object is created and sets up its data. (`__new__` actually creates the object, and you rarely need it.)
- **`self`** is the instance the method was called on. It is **explicit**: always the first parameter, and you must write `self.x` to reach the object's data (there is no implicit access to the instance).
- `obj.method()` is sugar for `Class.method(obj)`.
- Returning `self` from a method lets you **chain calls**.

```python
class Workflow:
    def __init__(self, name, steps=None):
        self.name = name                 # instance attributes: one set per object
        self.steps = steps or []

    def add_step(self, step):
        self.steps.append(step)
        return self                      # return self → chaining

    def describe(self):
        return f"{self.name}: {len(self.steps)} steps"

wf = Workflow("Refund")
wf.add_step("validate").add_step("approve")
print(wf.describe())                     # Refund: 2 steps
print(Workflow.describe(wf))             # Refund: 2 steps   ← same call, spelled out

other = Workflow("Invoice")
print(other.steps, wf.steps)             # [] ['validate', 'approve']   ← separate data per instance
```

**Interview soundbite:** "A class is a blueprint, `__init__` sets up each instance, and `self` is the explicit reference to the instance the method is called on."

<a id="q18"></a>
### 18. What are instance attributes vs class attributes, and instance vs class vs static methods?

- **Instance attribute:** set on `self`, separate for every object.
- **Class attribute:** defined in the class body, **shared by all instances**.
- **Instance method:** takes `self`, works with one object's data.
- **`@classmethod`:** takes `cls` (the class). Used for **alternative constructors** and works correctly with subclasses.
- **`@staticmethod`:** takes neither. It's just a function that lives in the class namespace for organization.

Trap: assigning `obj.count = 99` creates a **new instance attribute** that shadows the class attribute, and doesn't change the shared one.

```python
class Approval:
    count = 0                                   # class attribute (shared)
    VALID = {"approve", "reject"}

    def __init__(self, id_):
        self.id = id_                           # instance attribute
        Approval.count += 1

    def summary(self):                          # instance method
        return f"approval {self.id}"

    @classmethod
    def from_dict(cls, data):                   # alternative constructor; cls may be a subclass
        return cls(data["id"])

    @staticmethod
    def is_valid(decision):                     # no self, no cls
        return decision in Approval.VALID

a = Approval.from_dict({"id": "a1"})
b = Approval("a2")
print(Approval.count, a.count)                  # 2 2
print(Approval.is_valid("approve"), Approval.is_valid("maybe"))   # True False

a.count = 99                                    # creates an INSTANCE attribute that shadows the class one
print(a.count, b.count, Approval.count)         # 99 2 2
```

**Interview soundbite:** "Instance attributes are per object, class attributes are shared. Instance methods get `self`, classmethods get `cls` for alternative constructors, and staticmethods get neither."

<a id="q19"></a>
### 19. How do inheritance, `super()`, MRO, and polymorphism work? (And composition vs inheritance?)

- **Inheritance:** a subclass reuses and overrides its parent's behaviour: `class B(A)`.
- **`super()`** calls the next class's method in the **MRO (Method Resolution Order)**, the lookup order across the inheritance chain. Python uses **C3 linearization**, so it handles diamonds predictably. Inspect it with `Class.__mro__`.
- **Polymorphism:** different classes respond to the same method call, so callers don't care about the concrete type.
- **Composition over inheritance:** prefer "has-a" (an object holds a collaborator) to "is-a" hierarchies. It's easier to test, swap, and extend, and it avoids deep, fragile trees.

```python
class Notifier:
    def __init__(self, name):
        self.name = name
    def send(self, msg):
        raise NotImplementedError

class EmailNotifier(Notifier):
    def send(self, msg):
        return f"[email:{self.name}] {msg}"

class SlackNotifier(Notifier):
    def __init__(self, name, channel):
        super().__init__(name)                 # run the parent's __init__
        self.channel = channel
    def send(self, msg):
        return f"[slack:{self.channel}] {msg}"

for n in [EmailNotifier("ops"), SlackNotifier("ops", "#alerts")]:
    print(n.send("run failed"))                # polymorphism: same call, different behaviour
# [email:ops] run failed
# [slack:#alerts] run failed

class A:
    def hi(self): return "A"
class B(A):
    def hi(self): return "B>" + super().hi()
class C(A):
    def hi(self): return "C>" + super().hi()
class D(B, C):                                 # the diamond
    pass

print(D().hi())                                # B>C>A
print([k.__name__ for k in D.__mro__])         # ['D', 'B', 'C', 'A', 'object']

class Runner:                                  # composition: Runner HAS a notifier
    def __init__(self, notifier):
        self.notifier = notifier
    def run(self):
        return self.notifier.send("run started")

print(Runner(SlackNotifier("ops", "#alerts")).run())    # [slack:#alerts] run started
```

**Interview soundbite:** "`super()` follows the MRO, polymorphism means callers don't care about the concrete type, and I prefer composition to deep inheritance because it's easier to test and swap."

<a id="q20"></a>
### 20. How does encapsulation work in Python? (`_x`, `__x`, `@property`)

Python has **no true private members**. It relies on conventions:
- **`_name`**: "internal, please don't touch" (a convention only).
- **`__name`**: **name-mangled** to `_ClassName__name` to avoid accidental clashes in subclasses. It's not real security.
- **`@property`**: exposes a method as an attribute, so you can start with a plain attribute and add validation later **without changing callers**. That's why Python code doesn't need Java-style getters and setters.

```python
class Account:
    def __init__(self, balance):
        self._balance = balance          # convention: internal
        self.__secret = "s"              # mangled to _Account__secret

    @property
    def balance(self):                   # read:  acc.balance
        return self._balance

    @balance.setter
    def balance(self, value):            # write: acc.balance = ...  (with validation)
        if value < 0:
            raise ValueError("balance cannot be negative")
        self._balance = value

acc = Account(100)
acc.balance = 150
print(acc.balance)                       # 150

try:
    acc.balance = -5
except ValueError as e:
    print(e)                             # balance cannot be negative

print(hasattr(acc, "__secret"), hasattr(acc, "_Account__secret"))   # False True
```

**Interview soundbite:** "Python uses conventions: a leading underscore means internal, double underscore mangles the name, and `@property` lets me add validation later without breaking callers."

<a id="q21"></a>
### 21. What are dunder (magic) methods?

**Dunder methods** (`__like_this__`) let your objects work with Python's built-in syntax and functions. You rarely call them directly. Python calls them for you.

| You write | Python calls | Purpose |
|---|---|---|
| `Money(5)` | `__init__` | Initialize |
| `repr(x)` / `str(x)` / `print(x)` | `__repr__` / `__str__` | Debug text (for developers) / display text (for users) |
| `a == b` | `__eq__` | Equality (also define `__hash__` if you need dict/set use) |
| `a + b`, `a < b` | `__add__`, `__lt__` | Operators |
| `len(x)`, `x[i]`, `for i in x` | `__len__`, `__getitem__`, `__iter__` | Container behaviour |
| `with x:` | `__enter__`, `__exit__` | Context manager |
| `x()` | `__call__` | Makes an object callable |
| `if x:` | `__bool__` | Truthiness |

```python
class Money:
    def __init__(self, amount, currency="INR"):
        self.amount, self.currency = amount, currency
    def __repr__(self):                                   # for developers, ideally eval-able
        return f"Money({self.amount!r}, {self.currency!r})"
    def __str__(self):                                    # for users
        return f"{self.currency} {self.amount:,.2f}"
    def __eq__(self, other):
        return isinstance(other, Money) and (self.amount, self.currency) == (other.amount, other.currency)
    def __hash__(self):                                   # defining __eq__ removes the default hash, so add it back
        return hash((self.amount, self.currency))
    def __add__(self, other):
        return Money(self.amount + other.amount, self.currency)
    def __lt__(self, other):
        return self.amount < other.amount
    def __bool__(self):
        return self.amount != 0

m = Money(1500) + Money(250.5)
print(m)                                                  # INR 1,750.50
print(repr(m))                                            # Money(1750.5, 'INR')
print(m == Money(1750.5), Money(1) < Money(2), bool(Money(0)))   # True True False
print(sorted([Money(30), Money(10)]))                     # [Money(10, 'INR'), Money(30, 'INR')]
print(len({Money(5), Money(5)}))                          # 1   ← equal objects collapse in a set
```

**Interview soundbite:** "Dunder methods hook my class into Python's syntax: `__repr__` for debugging, `__str__` for display, `__eq__` with `__hash__` for equality, and `__len__`, `__iter__`, and `__enter__` for container and context behaviour."

<a id="q22"></a>
### 22. What are abstract classes, duck typing, and `Protocol`?

- **Duck typing:** "if it walks like a duck..." Python cares about what an object **can do**, not what it inherits from. Any object with a `send()` method works where a notifier is expected.
- **ABC (`abc.ABC` + `@abstractmethod`):** an explicit contract. A class with unimplemented abstract methods **can't be instantiated**, so missing methods fail early.
- **`typing.Protocol`:** duck typing with **type-checker support** (structural typing). A class matches if it has the right methods, with no inheritance needed.

Rule of thumb: use an **ABC** when you want shared base behaviour and enforcement, and a **Protocol** when you just want to describe the shape you accept.

```python
from abc import ABC, abstractmethod
from typing import Protocol

class Storage(ABC):
    @abstractmethod
    def save(self, key, value): ...

class MemoryStorage(Storage):
    def __init__(self):
        self.data = {}
    def save(self, key, value):
        self.data[key] = value

try:
    Storage()                                    # abstract → can't instantiate
except TypeError:
    print("cannot instantiate an abstract class")

s = MemoryStorage()
s.save("k", "v")
print(s.data)                                    # {'k': 'v'}

class SupportsSend(Protocol):                    # structural type: "anything with send(str) -> str"
    def send(self, msg: str) -> str: ...

def alert(channel: SupportsSend) -> str:
    return channel.send("hello")

class Fake:                                      # no inheritance at all
    def send(self, msg):
        return f"fake:{msg}"

print(alert(Fake()))                             # fake:hello   ← duck typing; mypy/pyright also accept it
```

**Interview soundbite:** "Duck typing is the default. ABCs enforce a contract at instantiation, and Protocols describe the shape I accept for type checkers, without forcing inheritance."

[↑ Back to top](#toc)

---

<a id="s6"></a>
## Section 6: Decorators

<a id="q23"></a>
### 23. What is a decorator, and how do you write one?

A **decorator** is a function that **takes a function and returns a new function** that adds behaviour around it: logging, timing, auth, caching, retries.

- `@decorator` above a `def` is just sugar for `fn = decorator(fn)`.
- The inner **wrapper** takes `*args, **kwargs` so it works with any signature.
- Always add **`@functools.wraps(fn)`**, or the wrapped function loses its `__name__` and docstring (which breaks debugging and tools like FastAPI's docs).
- A decorator **with arguments** is a three-level function: factory → decorator → wrapper.
- Stacked decorators apply **bottom-up**.

```python
import functools

def log_calls(fn):
    @functools.wraps(fn)                     # keep fn's name and docstring
    def wrapper(*args, **kwargs):
        print(f"-> {fn.__name__}{args}")
        result = fn(*args, **kwargs)
        print(f"<- {result}")
        return result
    return wrapper

@log_calls                                   # same as: add = log_calls(add)
def add(a, b):
    """Add two numbers."""
    return a + b

add(2, 3)
# -> add(2, 3)
# <- 5
print(add.__name__, "|", add.__doc__)        # add | Add two numbers.

def repeat(times):                           # decorator WITH arguments: factory → decorator → wrapper
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            return [fn(*args, **kwargs) for _ in range(times)]
        return wrapper
    return decorator

@repeat(3)
def ping():
    return "pong"

print(ping())                                # ['pong', 'pong', 'pong']
```

**Interview soundbite:** "A decorator is a function that wraps a function. The wrapper forwards `*args` and `**kwargs`, `functools.wraps` preserves metadata, and decorators with arguments add one more nesting level."

<a id="q24"></a>
### 24. Show a practical decorator: retry, and caching with `lru_cache`.

- A **retry** decorator is a very common real-world example: retry a flaky call a few times, waiting longer each time (exponential backoff), and only for the exceptions you expect.
- **`functools.lru_cache`** (or `@functools.cache`, 3.9+) is a **built-in memoization decorator**: it stores results by arguments, so repeated calls skip the work. Arguments must be hashable, and only use it for **pure** functions (same input, same output).

```python
import functools
import time

def retry(times=3, delay=0.0, exceptions=(Exception,)):
    def decorator(fn):
        @functools.wraps(fn)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return fn(*args, **kwargs)
                except exceptions as e:
                    print(f"attempt {attempt} failed: {e}")
                    if attempt == times:
                        raise                                  # out of attempts → let it fail
                    time.sleep(delay * 2 ** (attempt - 1))     # exponential backoff
        return wrapper
    return decorator

calls = {"n": 0}

@retry(times=3, exceptions=(ConnectionError,))
def flaky():
    calls["n"] += 1
    if calls["n"] < 3:
        raise ConnectionError("network down")
    return "ok"

print(flaky())
# attempt 1 failed: network down
# attempt 2 failed: network down
# ok

@functools.lru_cache(maxsize=128)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(50))                      # 12586269025   (instant; without the cache this takes ages)
print(fib.cache_info())             # CacheInfo(hits=48, misses=51, maxsize=128, currsize=51)
```

**Interview soundbite:** "I'd write retry as a decorator factory with backoff and a narrow exception list, and use `lru_cache` for pure functions, remembering that arguments must be hashable."

[↑ Back to top](#toc)

---

<a id="s7"></a>
## Section 7: Concurrency: GIL, Threads, Processes, Async

<a id="q25"></a>
### 25. What is the GIL, and why does it exist?

The **GIL (Global Interpreter Lock)** is a lock in standard **CPython** that lets **only one thread execute Python bytecode at a time**, even on a multi-core machine.

- **Why it exists:** CPython's memory management uses reference counting (Q29). The GIL keeps those counters safe without a lock on every object, which made the interpreter simple and fast for single-threaded code.
- **Effect:** threads **don't speed up CPU-bound work**. For CPU-bound work, use **processes**. Threads are still useful for **I/O-bound work**, because a thread releases the GIL while it waits on the network, disk, or `sleep`.
- **Not a problem for async:** asyncio runs on one thread anyway.
- The GIL doesn't make your code thread-safe. `count += 1` is still several steps, so you still need locks (Q28).
- **Newer Python:** an optional **free-threaded (no-GIL) build** arrived in 3.13 and is officially supported from 3.14, but it isn't the default yet. Other implementations (Jython, IronPython) have no GIL.

```python
import threading
import time

def cpu_work(n=2_000_000):
    return sum(i * i for i in range(n))

start = time.perf_counter()
cpu_work(); cpu_work()
sequential = time.perf_counter() - start

start = time.perf_counter()
threads = [threading.Thread(target=cpu_work) for _ in range(2)]
[t.start() for t in threads]
[t.join() for t in threads]
threaded = time.perf_counter() - start

# On standard CPython the two times are about the same: threads did NOT give a 2x speed-up.
print(f"sequential {sequential:.2f}s | 2 threads {threaded:.2f}s")
print("similar:", threaded > sequential * 0.7)      # True on standard (GIL) CPython
```

**Interview soundbite:** "The GIL lets one thread run Python bytecode at a time. It protects CPython's reference counting, so threads don't help CPU-bound code, but they're fine for I/O. For CPU work I use processes."

<a id="q26"></a>
### 26. Multithreading vs multiprocessing vs asyncio: when do you use which?

| | Threads | Processes | asyncio |
|---|---|---|---|
| Best for | I/O-bound (blocking libraries) | **CPU-bound** | I/O-bound, **many** connections |
| Runs in parallel? | No for Python code (GIL); yes while waiting on I/O | **Yes**, one interpreter per process | No, but overlaps waiting on one thread |
| Memory | Shared | Separate (heavier) | Shared, very light |
| Data sharing | Easy, but needs locks | Needs pickling, queues, or shared memory | Easy, no locks between awaits |
| Overhead | Low | High (startup, IPC) | Lowest |
| Danger | Race conditions | Serialization cost | One blocking call freezes everything |

Quick decision:
- Waiting on network or disk, using **async libraries** → **asyncio**.
- Waiting on network or disk, using **blocking libraries** → **threads**.
- Crunching numbers, image or data processing → **processes**.

Use **`concurrent.futures`** for a simple, uniform API: `ThreadPoolExecutor` and `ProcessPoolExecutor`.

```python
import time
from concurrent.futures import ProcessPoolExecutor, ThreadPoolExecutor

def io_task(n):
    time.sleep(0.2)                    # stands in for a network call: releases the GIL while waiting
    return n

def cpu_task(n):
    return sum(i * i for i in range(n))

if __name__ == "__main__":             # required for multiprocessing on Windows/macOS
    start = time.perf_counter()
    with ThreadPoolExecutor(max_workers=5) as pool:
        print(list(pool.map(io_task, range(5))))          # [0, 1, 2, 3, 4]
    print(f"5 I/O tasks in threads: {time.perf_counter() - start:.1f}s")   # ≈0.2s, not 1.0s

    with ProcessPoolExecutor(max_workers=2) as pool:      # real parallelism for CPU-bound work
        results = list(pool.map(cpu_task, [10_000, 20_000]))
    print(results)                                        # [333283335000, 2666466670000]
```

**Interview soundbite:** "Async or threads for I/O-bound work, processes for CPU-bound work because of the GIL. For a web API I'd use asyncio, and offload CPU-heavy jobs to a process pool or a worker queue."

<a id="q27"></a>
### 27. How does `async` / `await` work in Python?

- **`async def`** defines a **coroutine function**. Calling it returns a **coroutine object**, and nothing runs yet.
- **`await`** pauses the current coroutine until the awaited thing finishes and lets the **event loop** run other tasks meanwhile. It's cooperative multitasking on **one thread**.
- **`asyncio.run(main())`** starts the event loop. **`asyncio.gather(...)`** runs coroutines concurrently and returns their results in order. `asyncio.create_task` schedules one in the background.
- **The big rule: never block the event loop.** `time.sleep`, `requests.get`, and heavy CPU work inside an `async def` freeze every other task. Use `await asyncio.sleep`, async libraries (`httpx`, `asyncpg`), or `await asyncio.to_thread(blocking_fn)`.
- **`asyncio.Semaphore`** limits how many tasks run at once (rate limiting).

```python
import asyncio
import time

async def fetch(i):
    await asyncio.sleep(0.1)                 # non-blocking wait
    return i

async def bad():
    time.sleep(0.1)                          # ❌ blocks the whole loop

async def good():
    await asyncio.sleep(0.1)                 # ✅ yields to the loop

async def limited(sem, i):
    async with sem:                          # at most 2 at a time
        await asyncio.sleep(0.05)
        return i

async def main():
    coro = fetch(1)                          # a coroutine object: NOT running yet
    print(await coro)                        # 1

    t = time.perf_counter()
    print(await asyncio.gather(*(fetch(i) for i in range(5))))     # [0, 1, 2, 3, 4]
    print("gather:", round(time.perf_counter() - t, 1))            # 0.1  (5 waits overlapped)

    t = time.perf_counter()
    await asyncio.gather(bad(), bad())
    print("blocking:", round(time.perf_counter() - t, 1))          # 0.2  (they ran one after another)

    t = time.perf_counter()
    await asyncio.gather(good(), good())
    print("non-blocking:", round(time.perf_counter() - t, 1))      # 0.1

    sem = asyncio.Semaphore(2)
    print(await asyncio.gather(*(limited(sem, i) for i in range(6))))   # [0, 1, 2, 3, 4, 5]

    print(await asyncio.to_thread(sum, range(1000)))               # 499500  (a blocking call, moved off the loop)

asyncio.run(main())
```

**Interview soundbite:** "async/await is cooperative concurrency on one thread. `gather` overlaps I/O waits, and the golden rule is to never block the event loop. Blocking work goes to `to_thread` or a process pool."

<a id="q28"></a>
### 28. What is a race condition, and how do you prevent it? (`threading.Lock`)

A **race condition** happens when threads read and write shared data in a **read → modify → write** sequence, and another thread sneaks in between. Updates get **lost**. Even with the GIL, `x += 1` is several bytecode steps, so it's not atomic.

Fixes:
- **`threading.Lock`** (use `with lock:`) makes the critical section run one thread at a time.
- Prefer **not sharing state**: pass messages through a **`queue.Queue`** (thread-safe), or give each thread its own data.
- For processes, use `multiprocessing.Queue` or a manager. For asyncio, use `asyncio.Lock`, though single-threaded code only races across `await` points.
- **Deadlock:** two threads each waiting for the other's lock. Avoid it by always taking locks in the same order and keeping critical sections tiny.

```python
import threading
import time

balance = 100
lock = threading.Lock()

def withdraw_unsafe(n):
    global balance
    current = balance
    time.sleep(0.01)                 # another thread runs here and reads the SAME old balance
    balance = current - n

def withdraw_safe(n):
    global balance
    with lock:                       # only one thread inside at a time
        current = balance
        time.sleep(0.01)
        balance = current - n

def run(fn):
    global balance
    balance = 100
    threads = [threading.Thread(target=fn, args=(10,)) for _ in range(5)]
    [t.start() for t in threads]
    [t.join() for t in threads]
    return balance

print(run(withdraw_unsafe))          # 90  ← lost updates (5 × 10 withdrawn, but only one counted)
print(run(withdraw_safe))            # 50  ← correct
```

**Interview soundbite:** "A race condition is an unsynchronized read-modify-write on shared data. I fix it with a Lock, or better, avoid shared state by passing messages through a Queue."

[↑ Back to top](#toc)

---

<a id="s8"></a>
## Section 8: Memory Management

<a id="q29"></a>
### 29. How does Python manage memory?

- Python keeps objects in a **private heap**, managed for you. There's no `malloc` or `free` in your code. Small objects use an internal allocator (**pymalloc**) that reuses memory blocks.
- The main mechanism is **reference counting**. Each object counts how many names or containers refer to it. When the count hits **zero**, the object is freed immediately. `del x` only removes a *name*, and the object is freed only if that was the last reference.
- Reference counting can't free **reference cycles** (A points to B, B points to A). A **cyclic garbage collector** (the `gc` module, generational, checking newer objects more often) finds and frees those.
- Freed memory isn't always handed back to the OS, since Python often keeps it for reuse.

```python
import sys

a = []
print(sys.getrefcount(a))     # 2  (the name `a` + the temporary argument to getrefcount)
b = a
print(sys.getrefcount(a))     # 3  (a second name now points to it)
del b
print(sys.getrefcount(a))     # 2  (del removed one reference; the object is still alive)

class Tracker:
    def __del__(self):
        print("freed!")

t = Tracker()
u = t
del t                          # count 2 → 1: still alive
print("after del t")           # after del t
del u                          # count 1 → 0: freed immediately
# freed!
```

**Interview soundbite:** "Objects live on a managed private heap and are freed when their reference count reaches zero. A cyclic garbage collector handles reference cycles that counting alone can't."

<a id="q30"></a>
### 30. What are reference cycles and memory leaks, and how do you reduce memory use?

**Reference cycle:** objects referring to each other, so the count never reaches zero. The cyclic GC eventually collects them. `gc.collect()` forces a run.
**`weakref`** holds a reference that doesn't keep the object alive, which is useful for caches and parent links.

Common real-world "leaks" in Python are really **objects you still reference**: an ever-growing global list or dict, an unbounded cache, listeners never removed, or big objects captured by closures.

Ways to use less memory:
- **Generators** instead of lists for big data (Q13).
- **`__slots__`** on classes with millions of instances: no per-instance `__dict__`, so less memory and no accidental new attributes.
- Bound your caches (`lru_cache(maxsize=...)`), and use `del` or scoping to drop big objects early.
- Find the culprit with **`tracemalloc`** or a profiler such as memray, rather than guessing.

```python
import gc
import tracemalloc
import weakref

class Node:
    def __init__(self, name):
        self.name = name
        self.other = None

gc.collect()
a, b = Node("a"), Node("b")
a.other, b.other = b, a              # a reference cycle
ref = weakref.ref(a)                 # a weak reference doesn't keep `a` alive
del a, b
print(ref() is not None)             # True  — counts never hit zero because of the cycle
gc.collect()                         # the cyclic GC runs
print(ref() is None)                 # True  — now they're freed

class Slotted:
    __slots__ = ("x", "y")           # fixed attributes, no per-instance __dict__
    def __init__(self, x, y):
        self.x, self.y = x, y

p = Slotted(1, 2)
try:
    p.z = 3                          # can't add attributes that aren't in __slots__
except AttributeError as e:
    print(type(e).__name__)          # AttributeError

tracemalloc.start()
data = [str(i) * 10 for i in range(10_000)]
current, peak = tracemalloc.get_traced_memory()
print(current > 100_000, peak >= current)     # True True   (tracemalloc reports real numbers)
tracemalloc.stop()
```

**Interview soundbite:** "Cycles need the garbage collector, weakrefs avoid keeping objects alive, and most leaks are really references I forgot to drop. I use generators and `__slots__` to save memory, and tracemalloc to find leaks."

<a id="q31"></a>
### 31. Is Python pass-by-value or pass-by-reference?

Neither exactly. It's **pass by object reference** (also called "pass by assignment"). The function receives a **new name bound to the same object**.

- **Mutating** the object (`lst.append`) is visible to the caller.
- **Rebinding** the parameter (`lst = [99]`) only changes the local name, and the caller is unaffected.
- For immutable objects (int, str, tuple), you can't mutate them, so it *behaves* like pass-by-value.

```python
def append_item(lst):
    lst.append(1)         # mutates the shared object → the caller sees it

def reassign(lst):
    lst = [99]            # rebinds the LOCAL name only → the caller is unaffected

a = []
append_item(a)
reassign(a)
print(a)                  # [1]

def bump(n):
    n += 1                # ints are immutable: n becomes a new int, locally
    return n

x = 10
print(bump(x), x)         # 11 10

y = z = []                # y and z name the same list
y += [1]                  # += mutates in place for lists
print(z)                  # [1]
y = y + [2]               # builds a NEW list and rebinds y
print(y, z)               # [1, 2] [1]
```

**Interview soundbite:** "Python passes object references by assignment. Mutating a mutable argument affects the caller, but rebinding the name doesn't."

[↑ Back to top](#toc)

---

<a id="s9"></a>
## Section 9: API Development with FastAPI

<a id="q32"></a>
### 32. What is FastAPI, and why use it? (ASGI, Starlette, Pydantic)

**FastAPI** is a modern Python web framework for building APIs. It's built on **Starlette** (the async web layer) and **Pydantic** (validation). Its selling points:
- **Type hints drive everything.** Path and query params, request bodies, and responses are parsed, validated, and documented from your function signatures.
- **Automatic OpenAPI docs** at `/docs` (Swagger UI) and `/redoc`, plus `/openapi.json`. That's the machine-readable contract of your API, and client code can be generated from it.
- **Async-first** (`async def` endpoints), but plain `def` also works (Q35).
- **Dependency injection** with `Depends` (Q34).
- **ASGI vs WSGI:** WSGI (classic Flask/Django) is synchronous, one request per worker at a time. **ASGI** supports async, WebSockets, and streaming. FastAPI runs on an ASGI server, **uvicorn**.

```python
# main.py
from fastapi import FastAPI

app = FastAPI(title="Workflow API", version="1.0")

@app.get("/health")
async def health():
    return {"status": "ok"}

# Run it:      fastapi dev main.py              (needs: pip install "fastapi[standard]")
# or:          uvicorn main:app --reload
# Docs:        http://localhost:8000/docs
# Test quickly:
#   curl http://localhost:8000/health    →  {"status":"ok"}
```

**Interview soundbite:** "FastAPI is type-hint-driven: Pydantic validates, OpenAPI docs are generated automatically, and it runs on an ASGI server, so it supports async, streaming, and WebSockets."

<a id="q33"></a>
### 33. How do path parameters, query parameters, and request bodies work? (validation and 422)

- **Path parameter:** appears in the URL template, `/workflows/{workflow_id}`.
- **Query parameter:** any other simple function argument, `?limit=20`.
- **Request body:** a parameter typed as a **Pydantic model**.
- FastAPI converts types (`"20"` → `20`) and validates constraints (`ge`, `le`, `min_length`, `pattern`). Invalid input gets an automatic **422 Unprocessable Entity** with details on which field failed, before your code runs.
- Use **`Annotated[...]`** with `Query`, `Path`, and `Field` to attach the rules (the current recommended style).

```python
from typing import Annotated, Literal

from fastapi import FastAPI, Path, Query
from pydantic import BaseModel

app = FastAPI()

class RunCreate(BaseModel):
    workflow_id: str
    inputs: dict[str, str] = {}
    priority: Literal["low", "normal", "high"] = "normal"

@app.get("/workflows/{workflow_id}/runs")
async def list_runs(
    workflow_id: Annotated[str, Path(min_length=2)],                                  # path param
    status: Annotated[str | None, Query(pattern="^(running|failed|success)$")] = None,  # optional query
    limit: Annotated[int, Query(ge=1, le=100)] = 20,                                  # validated 1..100
):
    return {"workflow": workflow_id, "status": status, "limit": limit}

@app.post("/runs", status_code=201)
async def create_run(body: RunCreate):                                                # body from JSON
    return {"id": "r1", **body.model_dump()}

# GET  /workflows/wf1/runs?limit=5&status=failed → 200 {"workflow":"wf1","status":"failed","limit":5}
# GET  /workflows/wf1/runs?limit=500             → 422, loc ["query","limit"], "Input should be less than or equal to 100"
# POST /runs {"workflow_id":"wf1","priority":"urgent"} → 422, loc ["body","priority"]
# POST /runs {"workflow_id":"wf1"}               → 201 {"id":"r1","workflow_id":"wf1","inputs":{},"priority":"normal"}
```

**Interview soundbite:** "Path params come from the URL, query params from plain arguments, and the body from a Pydantic model. FastAPI converts and validates them, and answers 422 with field-level errors before my code runs."

<a id="q34"></a>
### 34. What is dependency injection in FastAPI? (`Depends`)

`Depends(fn)` tells FastAPI: "run this function first and give me its result." It's how you share **auth, DB sessions, pagination, and config** across routes without repeating code.

- Dependencies can depend on other dependencies (sub-dependencies), and FastAPI **caches the result per request**.
- A dependency that **`yield`s** is a setup/teardown pair, perfect for **DB sessions**: open, yield, then commit, rollback, or close.
- **Class-based dependencies** work too: FastAPI reads the constructor parameters.
- In tests, swap any dependency with `app.dependency_overrides[...]` (Q41).
- Compared with middleware: middleware runs for **every** request, while a dependency runs **only on the routes that ask for it**, and it's typed and shows up in the OpenAPI docs.

```python
from typing import Annotated

from fastapi import Depends, FastAPI, Query

app = FastAPI()
events = []

class Pagination:                                        # class-based dependency
    def __init__(self, page: int = 1, size: int = Query(20, le=100)):
        self.page, self.size = page, size
    @property
    def offset(self):
        return (self.page - 1) * self.size

def get_db():                                            # yield dependency: setup → route → teardown
    events.append("open")
    db = {"connection": "fake"}
    try:
        yield db
    finally:
        events.append("close")                           # always runs, even if the route fails

def get_settings():
    return {"env": "dev"}

@app.get("/items")
async def items(
    p: Annotated[Pagination, Depends()],
    db: Annotated[dict, Depends(get_db)],
    settings: Annotated[dict, Depends(get_settings)],
):
    return {"offset": p.offset, "size": p.size, "db": db["connection"], "env": settings["env"]}

# GET /items?page=3&size=10 → {"offset":20,"size":10,"db":"fake","env":"dev"}
# events after the request → ["open", "close"]
```

**Interview soundbite:** "`Depends` injects shared logic like auth, DB sessions, and pagination. `yield` dependencies give setup and teardown, and dependencies are overridable in tests."

<a id="q35"></a>
### 35. What is the difference between `async def` and `def` endpoints?

- **`async def`** endpoints run **on the event loop**. Inside them, use `await` with async libraries. **Any blocking call freezes the whole server** for all users.
- **Plain `def`** endpoints run in a **thread pool**, so a blocking call (a sync DB driver, `requests`, `time.sleep`) only blocks that worker thread and the loop stays free.
- Rule of thumb: if you can `await` everything you call, use `async def`. If you call blocking libraries, use `def`, or keep `async def` and wrap the blocking part in `await asyncio.to_thread(...)` (or `run_in_threadpool`).
- CPU-heavy work belongs **outside the request cycle**: a process pool or a task queue (Celery, ARQ, Temporal).

```python
import asyncio
import time

from fastapi import FastAPI

app = FastAPI()

def blocking_report():                    # stands in for a sync DB call or a heavy library
    time.sleep(0.1)
    return "report"

@app.get("/a")
async def async_endpoint():               # ✅ async I/O: awaits without blocking the loop
    await asyncio.sleep(0.1)
    return {"kind": "async"}

@app.get("/b")
def sync_endpoint():                      # ✅ sync code: FastAPI runs this in a thread pool
    return {"kind": "sync", "data": blocking_report()}

@app.get("/c")
async def async_with_blocking_part():     # ✅ async endpoint, blocking part moved off the loop
    data = await asyncio.to_thread(blocking_report)
    return {"kind": "async+thread", "data": data}

@app.get("/bad")
async def bad_endpoint():                 # ❌ blocks the event loop for EVERY request
    time.sleep(5)
    return {"kind": "bad"}
```

**Interview soundbite:** "`async def` runs on the event loop, so it must never block. Plain `def` runs in a thread pool, so blocking libraries are safe there, and CPU-heavy work goes to a worker."

<a id="q36"></a>
### 36. How do you handle errors in FastAPI? (`HTTPException`, custom handlers, 422)

- **`raise HTTPException(status_code, detail)`** returns an error response right away, from any route or dependency.
- **Custom exception handlers** (`@app.exception_handler(MyError)`) convert your **domain exceptions** into consistent JSON, so route code stays clean: raise `NotFoundError`, and one handler produces the 404 body.
- **Override `RequestValidationError`** to reshape the default 422 into the format your API clients expect (for example field → message pairs).
- Agree on one error shape with the API consumers (RFC 9457 "Problem Details" is a good standard).

```python
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel

app = FastAPI()

class NotFoundError(Exception):
    def __init__(self, what, id_):
        self.what, self.id = what, id_

@app.exception_handler(NotFoundError)
async def not_found_handler(request: Request, exc: NotFoundError):
    return JSONResponse(status_code=404, content={
        "type": "not_found", "title": f"{exc.what} not found", "status": 404,
        "detail": f"{exc.what} {exc.id} does not exist",
    })

@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(status_code=422, content={
        "title": "Validation failed",
        "errors": [{"field": ".".join(str(p) for p in e["loc"][1:]), "message": e["msg"]}
                   for e in exc.errors()],
    })

class Item(BaseModel):
    name: str
    qty: int

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    if item_id == 0:
        raise HTTPException(status_code=400, detail="id must be positive")   # quick one-off error
    if item_id != 1:
        raise NotFoundError("item", item_id)                                 # domain error → handler
    return {"id": 1}

@app.post("/items")
async def create_item(item: Item):
    return item

# GET  /items/1   → 200 {"id":1}
# GET  /items/0   → 400 {"detail":"id must be positive"}
# GET  /items/9   → 404 {"type":"not_found","title":"item not found","status":404,"detail":"item 9 does not exist"}
# POST /items {"name":"x","qty":"abc"} → 422 {"title":"Validation failed","errors":[{"field":"qty","message":"Input should be a valid integer, unable to parse string as an integer"}]}
```

**Interview soundbite:** "`HTTPException` for one-offs, custom exception handlers to turn domain errors into a consistent JSON shape, and an overridden validation handler so clients get field-level errors."

<a id="q37"></a>
### 37. How does authentication work in FastAPI? (JWT + `Depends`)

The usual flow:
1. **Login:** the user sends credentials. The server checks the **hashed** password (argon2 or bcrypt, never plaintext) and returns a **short-lived signed JWT** (`sub` = user id, `exp` = expiry).
2. **Each request:** the client sends `Authorization: Bearer <token>`.
3. **A dependency** (`get_current_user`) verifies the signature and expiry and returns the user, or raises **401**.
4. **Routes** that need auth declare `Depends(get_current_user)`. For permissions, layer another dependency on top (returns **403** if the user lacks the permission).

Also: the secret comes from **environment config**, never source code. Expiry should be short (5 to 15 minutes) with refresh tokens, and use HTTPS. Never log tokens, and rotate the signing secret if it leaks.

```python
from datetime import datetime, timedelta, timezone
from typing import Annotated

import jwt                                                    # pip install pyjwt
from fastapi import Depends, FastAPI, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

SECRET = "change-me"           # from an environment variable in real code
ALGO = "HS256"
app = FastAPI()
bearer = HTTPBearer(auto_error=False)

def create_token(user_id: str, minutes: int = 15) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(minutes=minutes)}
    return jwt.encode(payload, SECRET, algorithm=ALGO)

async def current_user(creds: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> str:
    if creds is None:
        raise HTTPException(401, "Not authenticated", headers={"WWW-Authenticate": "Bearer"})
    try:
        payload = jwt.decode(creds.credentials, SECRET, algorithms=[ALGO])   # verifies signature AND expiry
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")
    return payload["sub"]

@app.get("/me")
async def me(user: Annotated[str, Depends(current_user)]):
    return {"user": user}

# GET /me                                  → 401 Not authenticated
# GET /me  Authorization: Bearer <valid>   → 200 {"user":"asha"}
# GET /me  Authorization: Bearer <expired> → 401 Token expired
# GET /me  Authorization: Bearer garbage   → 401 Invalid token
```

**Interview soundbite:** "Login returns a short-lived signed JWT, and a `get_current_user` dependency verifies it on every protected route and raises 401 when it's bad. Permissions are a second dependency returning 403, and secrets come from the environment."

<a id="q38"></a>
### 38. How do `response_model`, status codes, and PATCH vs PUT work?

- **`response_model`** filters and validates what you return, so **internal fields (passwords, internal ids) never leak**. Use **separate input and output models**.
- **Status codes:** `201` create, `204` delete (no body), `200` default, `404` missing, `409` conflict, `422` validation.
- **PUT** replaces the whole resource, and **PATCH** updates only the fields sent. For PATCH, use `model_dump(exclude_unset=True)` to see which fields the client actually provided.

```python
from fastapi import FastAPI, HTTPException, Response
from pydantic import BaseModel

app = FastAPI()
DB: dict[int, dict] = {}

class UserIn(BaseModel):
    name: str
    email: str
    password: str                         # accepted on input…

class UserOut(BaseModel):
    id: int
    name: str
    email: str                            # …but never returned

class UserPatch(BaseModel):
    name: str | None = None
    email: str | None = None

@app.post("/users", response_model=UserOut, status_code=201)
async def create_user(body: UserIn):
    uid = len(DB) + 1
    DB[uid] = {"id": uid, **body.model_dump()}
    return DB[uid]                        # includes the password, but response_model strips it

@app.patch("/users/{uid}", response_model=UserOut)
async def patch_user(uid: int, body: UserPatch):
    if uid not in DB:
        raise HTTPException(404, "User not found")
    DB[uid].update(body.model_dump(exclude_unset=True))   # only what the client actually sent
    return DB[uid]

@app.delete("/users/{uid}", status_code=204)
async def delete_user(uid: int):
    if DB.pop(uid, None) is None:
        raise HTTPException(404, "User not found")
    return Response(status_code=204)

# POST   /users {"name":"Asha","email":"a@x.com","password":"pw"} → 201 {"id":1,"name":"Asha","email":"a@x.com"}
# PATCH  /users/1 {"name":"Asha R"}  → 200 {"id":1,"name":"Asha R","email":"a@x.com"}   (email untouched)
# DELETE /users/1  → 204 (empty body)      DELETE /users/1 again → 404
```

**Interview soundbite:** "Separate input and output models with `response_model` so nothing internal leaks, the right status codes (201, 204, 404, 409), and PATCH with `exclude_unset` for partial updates."

<a id="q39"></a>
### 39. How do you structure a FastAPI project? (routers and layers)

Keep each layer small and single-purpose:
- **Routers (`APIRouter`)** hold HTTP concerns only: paths, params, status codes. Group by feature and mount with `include_router(prefix=..., tags=[...], dependencies=[...])`. A router-level dependency, such as auth, protects all its routes.
- **Schemas** (Pydantic): request and response shapes.
- **Services**: business rules, which don't know about HTTP.
- **Repositories / models**: DB access.
- **Dependencies**: auth, DB session, pagination, settings.
- **Settings** via `pydantic-settings`, reading environment variables.

```text
app/
  main.py            # create app, include routers, middleware, exception handlers
  core/              # settings (pydantic-settings), security helpers
  api/
    deps.py          # get_db, current_user, require_permission
    routes/
      workflows.py   # APIRouter for /workflows
      approvals.py   # APIRouter for /approvals
  schemas/           # Pydantic models (in / out)
  services/          # business logic (no FastAPI imports)
  models/            # SQLAlchemy models
tests/
```

```python
from fastapi import APIRouter, Depends, FastAPI, HTTPException

def require_auth():                                 # in real code: the JWT dependency from Q37
    return "asha"

workflows = APIRouter(prefix="/workflows", tags=["workflows"], dependencies=[Depends(require_auth)])
health = APIRouter()

class WorkflowService:                              # business rules: no HTTP knowledge here
    def __init__(self):
        self.items = {1: "Refund agent"}
    def get(self, wf_id: int) -> str:
        if wf_id not in self.items:
            raise KeyError(wf_id)
        return self.items[wf_id]

service = WorkflowService()

@workflows.get("/{wf_id}")
async def get_workflow(wf_id: int):
    try:
        return {"id": wf_id, "name": service.get(wf_id)}
    except KeyError:
        raise HTTPException(404, "Workflow not found")   # the router turns domain errors into HTTP

@health.get("/health")
async def ping():
    return {"ok": True}

app = FastAPI()
app.include_router(health)
app.include_router(workflows, prefix="/api/v1")     # → /api/v1/workflows/{wf_id}

# GET /health              → 200 {"ok":true}
# GET /api/v1/workflows/1  → 200 {"id":1,"name":"Refund agent"}
# GET /api/v1/workflows/9  → 404
```

**Interview soundbite:** "Routers per feature for HTTP, schemas for the contract, services for business rules, repositories for the DB, and Depends for cross-cutting concerns, so each layer is testable on its own."

<a id="q40"></a>
### 40. How do you connect a database in FastAPI? (SQLAlchemy 2.0 + a session dependency)

Pattern: one **engine** per app, a **session per request** from a `yield` dependency, and Pydantic models with **`from_attributes=True`** so FastAPI can serialize ORM objects.

- Use **sync SQLAlchemy** with plain `def` endpoints (they run in the thread pool), or **async SQLAlchemy + asyncpg** with `async def` and `AsyncSession`.
- The dependency commits on success, rolls back on error, and always closes.
- Manage schema changes with **Alembic** migrations, not `create_all` in production.
- Beware **N+1 queries**: load related rows with `selectinload` or `joinedload`.
- The demo uses in-memory SQLite. In production it's usually PostgreSQL.

```python
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import String, create_engine, select
from sqlalchemy.orm import DeclarativeBase, Mapped, Session, mapped_column, sessionmaker
from sqlalchemy.pool import StaticPool

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
SessionLocal = sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

class Workflow(Base):
    __tablename__ = "workflows"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(80), unique=True)

Base.metadata.create_all(engine)              # demo only → use Alembic migrations in real projects

def get_db():
    db = SessionLocal()
    try:
        yield db                              # the route runs here
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

class WorkflowIn(BaseModel):
    name: str = Field(min_length=3)

class WorkflowOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)     # read from ORM objects
    id: int
    name: str

app = FastAPI()
DbSession = Annotated[Session, Depends(get_db)]

@app.post("/workflows", response_model=WorkflowOut, status_code=201)
def create(body: WorkflowIn, db: DbSession):            # plain def → thread pool (sync driver)
    if db.scalar(select(Workflow).where(Workflow.name == body.name)):
        raise HTTPException(409, "Name already exists")
    wf = Workflow(name=body.name)
    db.add(wf)
    db.flush()                                          # assigns wf.id without committing yet
    return wf

@app.get("/workflows", response_model=list[WorkflowOut])
def list_all(db: DbSession):
    return db.scalars(select(Workflow).order_by(Workflow.id)).all()

# POST /workflows {"name":"Refund agent"} → 201 {"id":1,"name":"Refund agent"}
# POST /workflows {"name":"Refund agent"} → 409 (duplicate)
# GET  /workflows                         → 200 [{"id":1,"name":"Refund agent"}]
```

**Interview soundbite:** "One engine, a session per request through a yield dependency that commits or rolls back, ORM-to-Pydantic with `from_attributes`, Alembic for migrations, and async drivers if the endpoints are async."

<a id="q41"></a>
### 41. How do you test a FastAPI app? (`TestClient`, `dependency_overrides`, pytest)

- **`TestClient(app)`** calls your app in-process, with no server needed, so tests are fast. It needs `httpx`. (Newer Starlette versions print a deprecation warning suggesting `httpx2`. The tests still pass, and you just install whichever package the warning names.)
- **`app.dependency_overrides[real] = fake`** swaps auth, DB, or external services for fakes. That's the payoff of `Depends`.
- **Always clear overrides** after each test, using a pytest fixture.
- Test the **status code and the JSON**, the happy path and the errors: 401, 403, 404, 409, 422.
- Keep business logic in plain functions or services so most tests don't need HTTP.

```python
# test_api.py — run with:  pytest -q
import pytest
from fastapi import Depends, FastAPI, HTTPException
from fastapi.testclient import TestClient

app = FastAPI()

def current_user():                                   # the real one would verify a JWT
    raise HTTPException(401, "Not authenticated")

@app.get("/me")
def me(user: str = Depends(current_user)):
    return {"user": user}

@app.post("/orders", status_code=201)
def create_order(item: str, user: str = Depends(current_user)):
    return {"item": item, "owner": user}

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()                  # never leak overrides between tests

def test_requires_auth(client):
    assert client.get("/me").status_code == 401

def test_me_with_fake_user(client):
    app.dependency_overrides[current_user] = lambda: "asha"      # swap the dependency
    r = client.get("/me")
    assert r.status_code == 200
    assert r.json() == {"user": "asha"}

def test_create_order(client):
    app.dependency_overrides[current_user] = lambda: "asha"
    r = client.post("/orders", params={"item": "book"})
    assert r.status_code == 201
    assert r.json() == {"item": "book", "owner": "asha"}

def test_validation_error(client):
    app.dependency_overrides[current_user] = lambda: "asha"
    assert client.post("/orders").status_code == 422             # missing required query param

# $ pytest -q
# ....                                                        [100%]
# 4 passed
```

**Interview soundbite:** "TestClient plus dependency_overrides, so I can fake auth and the DB and test every status path without running a server, and I keep business logic in plain functions."

<a id="q42"></a>
### 42. FastAPI vs Flask vs Django: when do you pick which?

| | FastAPI | Flask | Django (+ DRF) |
|---|---|---|---|
| Style | Type-hint-driven API framework | Minimal micro-framework | Batteries-included full framework |
| Async | Native (ASGI) | Mostly sync (async support is limited) | Async views supported, ORM mostly sync |
| Validation | Built in (Pydantic) | Add-on (marshmallow, etc.) | Serializers (DRF) or forms |
| API docs | **Automatic** OpenAPI | Add-on | Add-on (drf-spectacular) |
| ORM / admin / auth | Bring your own (SQLAlchemy…) | Bring your own | **Built in** ORM, migrations, admin, auth |
| Best for | High-performance APIs, microservices, ML/AI backends, typed contracts | Small services, prototypes, full control | Full web apps with admin and DB-heavy CRUD |

For this role, an **AI workflow platform** fits FastAPI: typed contracts, async and streaming (SSE and WebSockets), and easy integration with Python AI libraries. Django is a strong choice when you need the built-in admin and ORM out of the box.

**Interview soundbite:** "FastAPI for typed, async APIs with automatic docs, Flask for small and simple, Django when I want the batteries: ORM, admin, and auth. For an AI workflow platform, FastAPI is a natural fit."

[↑ Back to top](#toc)

---

<a id="s10"></a>
## Section 10: Practice: Coding, Output Puzzles & Rapid-Fire

<a id="q43"></a>
### 43. What basic coding problems should I be able to solve in Python?

Round 1 had a few basic coding problems, so expect the same style here. Say the **approach and complexity** before you type. These are the classics, each written the Pythonic way:

```python
from collections import Counter

def is_palindrome(s):                       # O(n)
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]

def is_anagram(a, b):                       # O(n)
    return Counter(a.replace(" ", "").lower()) == Counter(b.replace(" ", "").lower())

def first_unique_char(s):                   # O(n): count once, then scan once
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1

def two_sum(nums, target):                  # O(n): one pass with a dict of value → index
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

def dedupe_keep_order(items):               # O(n): dict keys keep insertion order
    return list(dict.fromkeys(items))

def word_freq(text):                        # O(n)
    return dict(Counter(text.lower().split()))

def flatten(nested):                        # recursive; use a generator for huge inputs (Q13)
    out = []
    for x in nested:
        out.extend(flatten(x) if isinstance(x, list) else [x])
    return out

def valid_parentheses(s):                   # O(n): stack
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack

def fizzbuzz(n):
    return ["FizzBuzz" if i % 15 == 0 else "Fizz" if i % 3 == 0 else "Buzz" if i % 5 == 0 else str(i)
            for i in range(1, n + 1)]

def max_subarray(nums):                     # Kadane's algorithm, O(n)
    best = cur = nums[0]
    for n in nums[1:]:
        cur = max(n, cur + n)
        best = max(best, cur)
    return best

print(is_palindrome("A man, a plan, a canal: Panama"))    # True
print(is_anagram("Listen", "Silent"))                     # True
print(first_unique_char("leetcode"))                      # 0
print(two_sum([2, 7, 11, 15], 9))                         # [0, 1]
print(dedupe_keep_order([3, 1, 3, 2, 1]))                 # [3, 1, 2]
print(word_freq("the cat and the hat"))                   # {'the': 2, 'cat': 1, 'and': 1, 'hat': 1}
print(flatten([1, [2, [3, [4]]], 5]))                     # [1, 2, 3, 4, 5]
print(valid_parentheses("{[()]}"), valid_parentheses("(]"))    # True False
print(fizzbuzz(15)[-5:])                                  # ['11', 'Fizz', '13', '14', 'FizzBuzz']
print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))      # 6
```

**Interview soundbite:** "I state the approach and complexity first: a dict or set for O(1) lookups, a stack for matching, Counter for frequency, and slices and comprehensions to keep it short."

<a id="q44"></a>
### 44. Predict the output: what do these snippets print?

Interviewers use these to check whether you understand mutability, scope, and laziness. Say your reasoning out loud.

```python
# 1. Mutable default argument
def f(x, acc=[]):
    acc.append(x)
    return acc
print(f(1), f(2))                       # [1, 2] [1, 2]   ← ONE shared list

# 2. Repeated references
grid = [[0] * 2] * 2
grid[0][0] = 9
print(grid)                             # [[9, 0], [9, 0]]   ← both rows are the same list

# 3. Late binding in closures
funcs = [lambda: i for i in range(3)]
print([fn() for fn in funcs])           # [2, 2, 2]   ← every lambda sees the final i

# 4. += vs +
x = [1, 2]; y = x
y += [3]                                # in-place: mutates the shared list
print(x)                                # [1, 2, 3]
y = y + [4]                             # creates a NEW list; y is rebound
print(x, y)                             # [1, 2, 3] [1, 2, 3, 4]

# 5. Floating point and rounding
print(0.1 + 0.2 == 0.3, round(2.5), round(3.5))    # False 2 4   ← banker's rounding (ties go to even)

# 6. 1, 1.0 and True are equal, so they are the same dict key
d = {}
d[1] = "a"; d[1.0] = "b"; d[True] = "c"
print(d)                                # {1: 'c'}

# 7. A generator can only be consumed once
g = (n for n in range(3))
print(list(g), list(g))                 # [0, 1, 2] []

# 8. finally overrides return
def tricky():
    try:
        return "try"
    finally:
        return "finally"
print(tricky())                         # finally

# 9. Class attribute vs instance attribute
class C:
    items = []
a, b = C(), C()
a.items.append(1)
print(b.items)                          # [1]   ← the list belongs to the class, shared by all instances

# 10. Truthiness
print(bool([]), bool([0]), bool(""), bool(" "), bool(None))    # False True False True False
```

**Interview soundbite:** "Most of these come down to three things: mutable objects are shared, closures capture variables (not values), and iterators are single-use."

<a id="q45"></a>
### 45. Rapid-fire: one-line answers to common Python questions

| Question | Answer |
|---|---|
| Compiled or interpreted? | Both: source is compiled to **bytecode** (`.pyc`), then run by the interpreter (the Python VM). |
| What is PEP 8? | Python's official code style guide. Tools: **Ruff**, Black, flake8. |
| What does `if __name__ == "__main__":` do? | Runs the code only when the file is executed directly, not when it's imported. |
| `append` vs `extend`? | `append(x)` adds one item (a list stays nested). `extend(it)` adds each item of an iterable. |
| `sort()` vs `sorted()`? | `list.sort()` sorts in place and returns `None`. `sorted()` returns a new list and works on any iterable. Both are stable (Timsort). |
| `remove` vs `pop` vs `del`? | `remove(value)` deletes the first match. `pop(i)` removes and returns the item at an index. `del lst[i]` removes without returning. |
| `range` in Python 3? | A lazy sequence, so `range(10**9)` uses almost no memory. |
| `__str__` vs `__repr__`? | `__str__` is for users. `__repr__` is for developers and debugging. If only one is defined, define `__repr__`. |
| Module vs package? | A module is one `.py` file. A package is a folder of modules (usually with `__init__.py`). |
| Why virtual environments? | Isolated dependencies per project. Create one with `python -m venv .venv`, or use `uv`. |
| `pip` vs `uv`? | `pip` is the standard installer. `uv` is a much faster modern replacement for pip and venv. |
| What are f-strings? | Formatted string literals: `f"{name!r:>10}"`. The fastest and most readable formatting option. |
| `None` vs `0` vs `""`? | `None` means "no value" (a singleton, check with `is`). `0` and `""` are real values that are falsy. |
| What is `zip` / `enumerate`? | `zip(a, b)` pairs items. `enumerate(x)` gives `(index, item)`. Both are lazy. |
| What is `global`? | Lets a function reassign a module-level name. Avoid it, and pass values instead. |
| What are type hints? | Annotations such as `def f(x: int) -> str`. **Not enforced at runtime**. They're for tools like mypy and pyright (Pydantic and FastAPI do use them at runtime). |
| What is the walrus `:=`? | Assigns inside an expression (3.8+): `if (n := len(x)) > 10:`. |
| What is `match`? | Structural pattern matching (3.10+), a more powerful `switch`. |
| Is dict ordered? | Yes, in insertion order, guaranteed since 3.7. |
| `json.dumps` vs `json.loads`? | `dumps` turns Python objects into a JSON string. `loads` parses a JSON string into Python objects. |
| What is a `dataclass`? | `@dataclass` auto-generates `__init__`, `__repr__`, and `__eq__` for plain data holders. |
| What is `pickle`? | Python-specific object serialization. **Never unpickle untrusted data.** |
| What is `if x:` for a list? | Empty is falsy, non-empty is truthy. Prefer `if not items:` over `if len(items) == 0:`. |
| What is Pydantic? | Runtime data validation and parsing driven by type hints. FastAPI uses it for every request and response. |
| What does `uvicorn` do? | It's the ASGI server that actually runs a FastAPI app. |

**Interview soundbite:** "Short, accurate one-liners, and if I'm unsure I say so and reason it out rather than guessing."

<a id="q46"></a>
### 46. What are type hints, dataclasses, and Pydantic, and how do they differ?

- **Type hints** are annotations such as `def f(x: int) -> str`. Python **does not enforce them at runtime**. They document intent and let tools like **mypy** and **pyright** catch mistakes before you run the code. Useful forms: `list[str]`, `dict[str, int]`, `str | None` (3.10+), `Literal["a", "b"]`, `TypedDict`, and `Protocol` (Q22).
- **`@dataclass`** auto-generates `__init__`, `__repr__`, and `__eq__` for plain data holders. It's standard library and lightweight, but it does **no validation**. Use `field(default_factory=list)` for mutable defaults, and `@dataclass(frozen=True)` for an immutable, hashable object.
- **Pydantic** (v2) **validates and converts data at runtime** using the type hints: it coerces `"3"` to `3`, raises `ValidationError` on bad input, and serializes with `model_dump()` and `model_dump_json()`. FastAPI uses it for every request and response.

Rule of thumb: **dataclass** for trusted internal data, **Pydantic** for data crossing a boundary (API input, config, files), and **type hints** everywhere, checked by mypy or pyright in CI.

```python
from dataclasses import dataclass, field

from pydantic import BaseModel, Field, ValidationError, field_validator

def double(x: int) -> int:
    return x * 2

print(double("ab"))                        # abab   ← the hint is NOT enforced at runtime

@dataclass
class Step:
    name: str
    retries: int = 0
    tags: list[str] = field(default_factory=list)   # mutable default needs default_factory

print(Step("send_email"))                  # Step(name='send_email', retries=0, tags=[])
print(Step("a") == Step("a"))              # True   (__eq__ generated)
print(Step("a", retries="three"))          # Step(name='a', retries='three', tags=[])   ← no validation!

@dataclass(frozen=True)
class Point:                               # immutable and hashable
    x: int
    y: int

p = Point(1, 2)
try:
    p.x = 5
except AttributeError:
    print("frozen: cannot modify")         # frozen: cannot modify
print({p: "ok"})                           # {Point(x=1, y=2): 'ok'}

class StepModel(BaseModel):                # Pydantic: validated at runtime
    name: str = Field(min_length=1)
    retries: int = 0

    @field_validator("name")
    @classmethod
    def clean(cls, v: str) -> str:
        return v.strip()

print(StepModel(name="  send  ", retries="3"))        # name='send' retries=3   ← "3" coerced to int, name stripped

try:
    StepModel(name="", retries="three")
except ValidationError as e:
    print(e.error_count(), "errors")                  # 2 errors

print(StepModel(name="x").model_dump())               # {'name': 'x', 'retries': 0}
print(StepModel.model_validate_json('{"name": "y", "retries": 2}'))   # name='y' retries=2
```

**Interview soundbite:** "Type hints are for tools and aren't enforced at runtime, dataclasses are lightweight containers with no validation, and Pydantic validates and converts at runtime, so I use it wherever data crosses a boundary."

[↑ Back to top](#toc)

---

## Night-Before Cheat Sheet

- **Data structures:** list (ordered, mutable) · tuple (fixed) · set (unique, O(1) `in`) · dict (key→value, O(1)). Hashable = immutable.
- **Copy:** assignment shares · shallow copy shares inner objects · `deepcopy` shares nothing.
- **`==` vs `is`:** value vs identity. `is` only for `None`.
- **Never** use a mutable default argument. Use `None`.
- **`*args`** = tuple, **`**kwargs`** = dict. `*` and `**` at call sites unpack.
- **LEGB** scope · closures need `nonlocal` to reassign.
- **Generators** are lazy and single-use. `yield`, `yield from`.
- **Exceptions:** `try / except / else / finally`. Specific excepts, `raise ... from`, EAFP.
- **OOP:** `self` is explicit · `@classmethod` for alternative constructors · `super()` follows the MRO · prefer composition · `@property` for validation.
- **Decorator** = function wrapping a function · always `functools.wraps`.
- **GIL:** one thread runs bytecode at a time → threads for I/O, **processes for CPU**, asyncio for many I/O tasks.
- **Async rule:** never block the event loop. Use `to_thread` for blocking code.
- **Memory:** reference counting + cyclic GC · `weakref` · `__slots__` · generators.
- **Type hints** aren't enforced at runtime · **dataclass** = plain container, no validation · **Pydantic** = validation at boundaries.
- **FastAPI:** type hints → validation + docs · `Depends` for auth, DB, and pagination · `async def` vs `def` · `HTTPException` and exception handlers · `response_model` hides internals · `TestClient` + `dependency_overrides`.

[↑ Back to top](#toc)
