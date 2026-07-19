# Remove Duplicate Characters

## Problem Statement

Given a string `str`, remove all duplicate characters while **preserving the order of their first occurrence**.

Return the resulting string.

---

## Examples

### Example 1

**Input**

```text
banana
```

**Output**

```text
ban
```

**Explanation**

```text
b → Keep
a → Keep
n → Keep
a → Already seen → Skip
n → Already seen → Skip
a → Already seen → Skip

Result = "ban"
```

---

### Example 2

**Input**

```text
programming
```

**Output**

```text
progamin
```

---

### Example 3

**Input**

```text
aabbcc
```

**Output**

```text
abc
```

---

### Example 4

**Input**

```text
aaaa
```

**Output**

```text
a
```

---

# Approach

This problem belongs to the **Hash Set** pattern.

We only need to know whether a character has been seen before.

A **Set** is the ideal data structure because it stores **unique values**.

---

# Algorithm

1. Create an empty `Set` called `seen`.
2. Create an empty string `result`.
3. Traverse the string one character at a time.
4. For each character:
   - If it has **not** been seen:
     - Add it to the `Set`.
     - Append it to the result.
   - Otherwise, skip it.
5. Return the result.

---

# JavaScript Solution

```javascript
function removeDuplicateChar(str) {
    const seen = new Set();
    let result = "";

    for (const char of str) {
        if (!seen.has(char)) {
            seen.add(char);
            result += char;
        }
    }

    return result;
}

// Test Cases
console.log(removeDuplicateChar("banana"));      // ban
console.log(removeDuplicateChar("programming")); // progamin
console.log(removeDuplicateChar("aabbcc"));      // abc
console.log(removeDuplicateChar("aaaa"));        // a
```

---

# Dry Run

Input

```text
banana
```

### Initial State

```text
Seen = {}

Result = ""
```

---

### Read 'b'

```text
Seen? No
```

```text
Seen = {b}

Result = "b"
```

---

### Read 'a'

```text
Seen? No
```

```text
Seen = {b, a}

Result = "ba"
```

---

### Read 'n'

```text
Seen? No
```

```text
Seen = {b, a, n}

Result = "ban"
```

---

### Read 'a'

```text
Seen? Yes

Skip
```

---

### Read 'n'

```text
Seen? Yes

Skip
```

---

### Read 'a'

```text
Seen? Yes

Skip
```

---

### Final Result

```text
ban
```

---

# Time Complexity

Each character is visited only once.

`Set.has()` and `Set.add()` are average **O(1)** operations.

```text
O(n)
```

---

# Space Complexity

Worst case:

```text
abcdef
```

Every character is unique.

The `Set` stores all characters.

```text
O(n)
```

---

# Why Use a Set?

A `Set` is specifically designed to store **unique values**.

Example:

```javascript
const seen = new Set();

seen.add("a");
seen.add("b");
seen.add("a");

console.log(seen); // Set { 'a', 'b' }
```

Duplicate values are automatically ignored.

---

# Alternative Solution (Using Map)

```javascript
function removeDuplicateChar(str) {
    const map = new Map();
    let result = "";

    for (const char of str) {
        if (!map.has(char)) {
            map.set(char, true);
            result += char;
        }
    }

    return result;
}
```

Although this works, a **Set** is the better choice because we only need to track whether a character has been seen.

---

# Interview Follow-up Questions

### Q1. Why use a `Set` instead of a `Map`?

A `Set` stores only unique values.

A `Map` stores key-value pairs.

Since we don't need counts or values, a `Set` is the more appropriate data structure.

---

### Q2. Can this be solved in one traversal?

Yes.

We process each character exactly once.

---

### Q3. Can uppercase and lowercase be treated as the same?

Yes.

Normalize the string before processing.

```javascript
str = str.toLowerCase();
```

---

# Pattern Used

```text
Hash Set
```

---

# Similar Interview Questions

- Remove Duplicate Characters
- Remove Duplicate Words
- Longest Substring Without Repeating Characters
- Contains Duplicate
- Happy Number
- Find Unique Elements

---

# Key Takeaways

- Identify the problem as a **Hash Set** problem.
- A `Set` is ideal when you only need to know whether an element has been seen.
- Preserve the order by appending characters only on their first occurrence.
- Traverse the string only once.
- Overall Complexity:
  - **Time:** `O(n)`
  - **Space:** `O(n)`