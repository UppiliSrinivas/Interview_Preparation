# First Non-Repeating Character

## Problem Statement

Given a string `str`, find the **first character** that appears **exactly once**.

If no such character exists, return `null`.

---

## Examples

### Example 1

**Input**

```text
swiss
```

**Output**

```text
w
```

**Explanation**

Character frequencies:

```text
s → 3
w → 1
i → 1
```

The first character whose frequency is `1` is **w**.

---

### Example 2

**Input**

```text
aabbcc
```

**Output**

```text
null
```

---

### Example 3

**Input**

```text
leetcode
```

**Output**

```text
l
```

---

# Approach

This problem belongs to the **Hash Map (Frequency Counting)** pattern.

Since we cannot determine whether a character is unique until we've seen the entire string, we solve it in **two passes**.

## Algorithm

### First Pass

Traverse the string and store the frequency of every character in a `Map`.

Example:

```text
swiss

s → 3
w → 1
i → 1
```

---

### Second Pass

Traverse the **original string** again.

For each character:

- If its frequency is `1`, return it immediately.
- Otherwise, continue.

If no character has frequency `1`, return `null`.

---

# JavaScript Solution

```javascript
function firstNonRepeatingCharacter(str) {
    const frequency = new Map();

    // Count character frequencies
    for (const char of str) {
        frequency.set(char, (frequency.get(char) || 0) + 1);
    }

    // Find the first non-repeating character
    for (const char of str) {
        if (frequency.get(char) === 1) {
            return char;
        }
    }

    return null;
}

// Test Cases
console.log(firstNonRepeatingCharacter("swiss"));      // w
console.log(firstNonRepeatingCharacter("aabbcc"));     // null
console.log(firstNonRepeatingCharacter("leetcode"));   // l
console.log(firstNonRepeatingCharacter("abac"));       // b
```

---

# Dry Run

Input

```text
swiss
```

### First Pass

| Character | Frequency Map |
|-----------|---------------|
| s | { s:1 } |
| w | { s:1, w:1 } |
| i | { s:1, w:1, i:1 } |
| s | { s:2, w:1, i:1 } |
| s | { s:3, w:1, i:1 } |

---

### Second Pass

```text
s → frequency = 3 ❌

w → frequency = 1 ✅
```

Return

```text
w
```

---

# Time Complexity

### First Pass

```text
O(n)
```

### Second Pass

```text
O(n)
```

Overall

```text
O(n)
```

Since:

```text
O(n) + O(n) = O(n)
```

---

# Space Complexity

The frequency map stores all unique characters.

Worst case:

```text
abcdef
```

Every character is unique.

```text
O(n)
```

---

# Why Two Passes?

Suppose the input is:

```text
swiss
```

When reading the first character:

```text
s
```

You **cannot** determine whether it is unique because more `s` characters may appear later.

Therefore:

1. First pass → Count frequencies.
2. Second pass → Find the first character with frequency `1`.

---

# Common Mistake

Many candidates iterate directly over the `Map`:

```javascript
for (const [char, count] of frequency) {
    if (count === 1) return char;
}
```

Although this works in JavaScript because `Map` preserves insertion order, interviewers generally prefer iterating over the **original string**.

Reason:

- It clearly guarantees the original character order.
- The solution is language-independent.
- It directly matches the problem statement: **"first" non-repeating character**.

---

# Interview Follow-up Questions

### Q1. Can this be solved in one traversal?

No.

You must first know the frequency of every character before deciding whether a character is unique.

---

### Q2. Why use a `Map`?

A `Map` provides average **O(1)** lookup and insertion, making frequency counting efficient.

---

### Q3. What should be returned if every character repeats?

Return:

```text
null
```

(or `-1` if specified by the interviewer).

---

# Pattern Used

```text
Hash Map (Frequency Counting)
```

---

# Similar Interview Questions

- First Repeating Character
- Character Frequency
- Most Frequent Character
- Valid Anagram
- Group Anagrams
- Top K Frequent Elements
- Count Occurrences of Words

---

# Key Takeaways

- Identify the problem as a **Hash Map (Frequency Counting)** problem.
- Use **two traversals**:
  1. Count frequencies.
  2. Find the first character with frequency `1`.
- Always traverse the **original string** in the second pass to preserve character order.
- Overall Complexity:
  - **Time:** `O(n)`
  - **Space:** `O(n)`