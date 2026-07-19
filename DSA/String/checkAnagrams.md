# Valid Anagram

## Problem Statement

Given two strings `str1` and `str2`, determine whether they are **anagrams** of each other.

Two strings are **anagrams** if they contain the **same characters** with the **same frequencies**, but the characters may appear in a different order.

Return `true` if they are anagrams; otherwise, return `false`.

---

## Examples

### Example 1

**Input**

```text
str1 = "listen"
str2 = "silent"
```

**Output**

```text
true
```

---

### Example 2

**Input**

```text
str1 = "triangle"
str2 = "integral"
```

**Output**

```text
true
```

---

### Example 3

**Input**

```text
str1 = "hello"
str2 = "world"
```

**Output**

```text
false
```

---

### Example 4

**Input**

```text
str1 = "rat"
str2 = "car"
```

**Output**

```text
false
```

---

### Example 5

**Input**

```text
str1 = "aab"
str2 = "abb"
```

**Output**

```text
false
```

---

## JavaScript Solution

```javascript
function checkAnagrams(str1, str2) {
    if (str1.length !== str2.length) {
        return false;
    }

    const frequency = new Map();

    for (const char of str1) {
        frequency.set(char, (frequency.get(char) || 0) + 1);
    }

    for (const char of str2) {
        if (!frequency.get(char)) {
            return false;
        }

        frequency.set(char, frequency.get(char) - 1);
    }

    return true;
}

// Test Cases
console.log(checkAnagrams("listen", "silent"));      // true
console.log(checkAnagrams("triangle", "integral"));  // true
console.log(checkAnagrams("hello", "world"));        // false
console.log(checkAnagrams("rat", "car"));            // false
console.log(checkAnagrams("aab", "abb"));            // false
```