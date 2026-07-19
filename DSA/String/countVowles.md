# Count Vowels

## Problem Statement

Given a string `str`, count the total number of vowels.

Vowels are:

```text
a, e, i, o, u
```

The solution should be **case-insensitive**, meaning uppercase vowels should also be counted.

---

## Examples

### Example 1

**Input**

```text
Interview
```

**Output**

```text
4
```

---

### Example 2

**Input**

```text
HELLO
```

**Output**

```text
2
```

---

### Example 3

**Input**

```text
xyz
```

**Output**

```text
0
```

---

## Approach

This problem belongs to the **Simple Traversal Pattern**.

### Algorithm

1. Initialize a counter to `0`.
2. Traverse the string one character at a time.
3. Convert the current character to lowercase.
4. Check whether it is a vowel.
5. If it is a vowel, increment the counter.
6. After traversing the entire string, return the counter.

---

## JavaScript Solution (Recommended)

```javascript
function countVowels(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    let count = 0;

    for (const ch of str) {
        if (vowels.has(ch.toLowerCase())) {
            count++;
        }
    }

    return count;
}

// Test Cases
console.log(countVowels("Interview"));   // 4
console.log(countVowels("HELLO"));       // 2
console.log(countVowels("xyz"));         // 0
console.log(countVowels("OpenAI"));      // 4
```

---

## Alternative Solution

```javascript
function countVowels(str) {
    const vowels = "aeiou";
    let count = 0;

    for (const ch of str) {
        if (vowels.includes(ch.toLowerCase())) {
            count++;
        }
    }

    return count;
}
```

---

## Dry Run

Input:

```text
Interview
```

Traversal:

```text
I  -> vowel ✅ count = 1
n  -> not a vowel
t  -> not a vowel
e  -> vowel ✅ count = 2
r  -> not a vowel
v  -> not a vowel
i  -> vowel ✅ count = 3
e  -> vowel ✅ count = 4
w  -> not a vowel
```

Final Result:

```text
4
```

---

## Time Complexity

The string is traversed only once.

```text
O(n)
```

where `n` is the length of the string.

---

## Space Complexity

The vowel collection contains only five characters.

```text
O(1)
```

(Constant Extra Space)

---

## Why Use a Set?

Instead of writing:

```javascript
['a', 'e', 'i', 'o', 'u'].includes(ch)
```

inside the loop, create the collection once:

```javascript
const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
```

Advantages:

- Created only once.
- Cleaner code.
- Clearly expresses a membership lookup.
- Common interview practice for lookup problems.

---

## Edge Cases

| Input | Output |
|-------|--------|
| `""` | `0` |
| `"bcdf"` | `0` |
| `"AEIOU"` | `5` |
| `"aEiOu"` | `5` |
| `"12345"` | `0` |
| `"Hello World"` | `3` |

---

## Interview Follow-up Questions

### Q1. Can uppercase vowels appear?

Yes.

Convert each character to lowercase (or uppercase) before checking.

---

### Q2. Can the string contain numbers or symbols?

Yes.

They are simply ignored because they are not vowels.

---

### Q3. Can you count vowels and consonants in a single traversal?

Yes.

Maintain two counters:

- `vowelCount`
- `consonantCount`

Traverse the string once and update the appropriate counter.

---

## Pattern Used

```text
Simple Traversal
```

---

## Key Takeaways

- Recognize this as a **Simple Traversal** problem.
- Visit each character exactly once.
- Use a `Set` (or a constant string) for efficient vowel lookup.
- Convert characters to lowercase before comparison.
- Achieve **O(n)** time and **O(1)** extra space.