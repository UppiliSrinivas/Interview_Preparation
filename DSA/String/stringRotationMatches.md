# Check if One String is a Rotation of Another

## Problem Statement

Given two strings `s1` and `s2`, determine whether `s2` is a **rotation** of `s1`.

A string is considered a rotation if it can be obtained by moving some characters from the beginning of `s1` to its end.

Return `true` if `s2` is a rotation of `s1`; otherwise return `false`.

**Constraints:**

- The two strings must have the same length.
- Do **not** use built-in methods like `includes()` or `indexOf()` for searching.

---

## Examples

### Example 1

**Input**

```text
s1 = "abcd"
s2 = "cdab"
```

**Output**

```text
true
```

---

### Example 2

**Input**

```text
s1 = "waterbottle"
s2 = "erbottlewat"
```

**Output**

```text
true
```

---

### Example 3

**Input**

```text
s1 = "abcd"
s2 = "acbd"
```

**Output**

```text
false
```

---

### Example 4

**Input**

```text
s1 = "hello"
s2 = "llohe"
```

**Output**

```text
true
```

---

### Example 5

**Input**

```text
s1 = "abc"
s2 = "cab"
```

**Output**

```text
true
```

---

## JavaScript Solution

```javascript
function stringMatching(s1, s2) {
    if (s1.length !== s2.length) return false;

    let s3 = s1 + s1;

    for (let i = 0; i < s1.length; i++) {
        if (s2 === s3.substring(i, i + s1.length)) {
            return true;
        }
    }

    return false;
}

// Test Cases
console.log(stringMatching("abcd", "cdab"));                 // true
console.log(stringMatching("waterbottle", "erbottlewat"));   // true
console.log(stringMatching("abcd", "acbd"));                 // false
console.log(stringMatching("hello", "llohe"));               // true
console.log(stringMatching("abc", "cab"));                   // true
```

---

## Pattern Used

```text
String Matching + Sliding Window
```

---

## Time Complexity

```text
O(n²)
```

Where:

- `n` = Length of the string.
- We check `n` possible starting positions.
- Each `substring()` comparison takes up to `O(n)` time.

---

## Space Complexity

```text
O(n)
```

- Extra space is used for the concatenated string (`s1 + s1`).

---

## Key Interview Concepts

- A rotation of a string will always appear as a substring of `s1 + s1`.
- First, verify that both strings have the same length.
- Concatenate the original string with itself.
- Slide a window of length `n` across the concatenated string.
- Compare each substring with the target string.
- Return `true` if a match is found; otherwise return `false`.

> **Interview Tip:**  
> This is the standard interview approach when `includes()` and `indexOf()` are not allowed.  
> For advanced interviews, this can be optimized to **O(n)** using the **KMP (Knuth-Morris-Pratt)** string matching algorithm.
```