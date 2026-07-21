# String Compression

## Problem Statement

Given a string `str`, compress it by replacing consecutive repeated characters with the character followed by its count.

- If a character appears only once, keep it as it is.
- If a character appears multiple times consecutively, append the count after the character.

Return the compressed string.

---

## Examples

### Example 1

**Input**

```text
str = "aaabbc"
```

**Output**

```text
a3b2c
```

---

### Example 2

**Input**

```text
str = "abcd"
```

**Output**

```text
abcd
```

---

### Example 3

**Input**

```text
str = "aabcccccaaa"
```

**Output**

```text
a2bc5a3
```

---

### Example 4

**Input**

```text
str = "aaaa"
```

**Output**

```text
a4
```

---

### Example 5

**Input**

```text
str = "a"
```

**Output**

```text
a
```

---

### Example 6

**Input**

```text
str = ""
```

**Output**

```text

```

---

## JavaScript Solution

```javascript
function stringCompression(str) {
    if (str.length === 0) return "";

    let count = 1;
    let result = "";

    for (let i = 1; i < str.length; i++) {
        if (str[i] === str[i - 1]) {
            count++;
        } else {
            result += str[i - 1] + (count > 1 ? count : "");
            count = 1;
        }
    }

    // Process the last group
    result += str[str.length - 1] + (count > 1 ? count : "");

    return result;
}

// Test Cases
console.log(stringCompression("aaabbc"));      // a3b2c
console.log(stringCompression("abcd"));        // abcd
console.log(stringCompression("aabcccccaaa")); // a2bc5a3
console.log(stringCompression("aaaa"));        // a4
console.log(stringCompression("a"));           // a
console.log(stringCompression(""));            // ""
```

---

## Pattern Used

```text
Linear Traversal + Run Length Encoding (RLE)
```

---
pp
## Time Complexity

```text
O(n)
```

---

## Space Complexity

```text
O(n)
```

> **Note:** The output string may contain up to `n` characters in the worst case (e.g., `"abcdef"`), so the auxiliary space used for the result is **O(n)**.