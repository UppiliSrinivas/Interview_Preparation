# Count Character Frequency

## Problem Statement

Given a string `str`, count the frequency of each character and return the result.

---

## Examples

### Example 1

**Input**

```text
programming
```

**Output**

```text
{
  p: 1,
  r: 2,
  o: 1,
  g: 2,
  a: 1,
  m: 2,
  i: 1,
  n: 1
}
```

---

### Example 2

**Input**

```text
aabbcc
```

**Output**

```text
{
  a: 2,
  b: 2,
  c: 2
}
```

---

### Example 3

**Input**

```text

```

**Output**

```text
{}
```

---

# Approach

This problem belongs to the **Hash Map (Frequency Counting)** pattern.

## Algorithm

1. Create an empty `Map`.
2. Traverse each character in the string.
3. If the character already exists in the map:
   - Increment its count.
4. Otherwise:
   - Add the character with a count of `1`.
5. Return the frequency map.

---

# JavaScript Solution

```javascript
function charFrequency(str) {
    const frequency = new Map();

    for (const char of str) {
        frequency.set(char, (frequency.get(char) || 0) + 1);
    }

    return frequency;
}

// Test Cases
console.log(charFrequency("programming"));
console.log(charFrequency("aabbcc"));
console.log(charFrequency(""));
```

---

# Dry Run

Input

```text
banana
```

### Initial Map

```text
{}
```

### Step 1

Character:

```text
b
```

Map

```text
{
  b: 1
}
```

---

### Step 2

Character:

```text
a
```

Map

```text
{
  b: 1,
  a: 1
}
```

---

### Step 3

Character:

```text
n
```

Map

```text
{
  b: 1,
  a: 1,
  n: 1
}
```

---

### Step 4

Character:

```text
a
```

Map

```text
{
  b: 1,
  a: 2,
  n: 1
}
```

---

### Step 5

Character:

```text
n
```

Map

```text
{
  b: 1,
  a: 2,
  n: 2
}
```

---

### Step 6

Character:

```text
a
```

Final Map

```text
{
  b: 1,
  a: 3,
  n: 2
}
```

---

# Time Complexity

| Operation | Complexity |
|-----------|------------|
| Traverse string | O(n) |
| Map lookup | O(1) |
| Map insertion | O(1) |

### Overall

```text
O(n)
```

---

# Space Complexity

In the worst case, every character is unique.

Example:

```text
abcdef
```

The map stores all characters.

```text
O(n)
```

---

# Why Use a Map?

A `Map` provides efficient key-value storage with average **O(1)** lookup and insertion.

Example

```javascript
const map = new Map();

map.set("a", 1);
map.set("b", 2);

console.log(map.get("a")); // 1
console.log(map.has("b")); // true
```

---

# Alternative Solution (Using Object)

```javascript
function charFrequency(str) {
    const frequency = {};

    for (const char of str) {
        frequency[char] = (frequency[char] || 0) + 1;
    }

    return frequency;
}
```

Both approaches have the same time and space complexity.

---

# Interview Follow-up Questions

### Q1. Should I use `Map` or `Object`?

- Use **Map** when you need a dedicated hash map with methods like `get()`, `set()`, and `has()`.
- Use **Object** for simple key-value storage when keys are strings.

---

### Q2. Can uppercase and lowercase be treated as the same?

Yes.

Normalize the string before counting.

Example:

```javascript
str = str.toLowerCase();
```

---

### Q3. Can spaces or special characters be ignored?

Yes.

Skip them during traversal or preprocess the string based on the problem requirements.

---

# Pattern Used

```text
Hash Map (Frequency Counting)
```

---

# Similar Interview Questions

Once you know this pattern, you can solve:

- First Non-Repeating Character
- First Repeating Character
- Most Frequent Character
- Valid Anagram
- Group Anagrams
- Top K Frequent Elements
- Count Occurrences of Words

---

# Key Takeaways

- Identify this as a **Hash Map** problem.
- Traverse the string only once.
- Store each character as a key and its count as the value.
- `Map` provides average **O(1)** lookup and insertion.
- Overall complexity:
  - **Time:** `O(n)`
  - **Space:** `O(n)`