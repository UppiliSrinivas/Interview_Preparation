# Isomorphic Strings

## Problem Statement

Given two strings `s` and `t`, determine whether they are **isomorphic**.

Two strings are isomorphic if the characters in `s` can be replaced to get `t`.

Rules:

- Every character in `s` must map to exactly one character in `t`.
- No two different characters in `s` can map to the same character in `t`.
- A character may map to itself.

Return `true` if the strings are isomorphic; otherwise return `false`.

---

## Examples

### Example 1

**Input**

```text
s = "egg"
t = "add"
```

**Output**

```text
true
```

**Explanation**

```text
e → a
g → d
```

The mapping is one-to-one.

---

### Example 2

**Input**

```text
s = "foo"
t = "bar"
```

**Output**

```text
false
```

**Explanation**

```text
f → b
o → a
```

The last `'o'` should map to `'a'`, but it maps to `'r'`.

---

### Example 3

**Input**

```text
s = "paper"
t = "title"
```

**Output**

```text
true
```

---

### Example 4

**Input**

```text
s = "ab"
t = "aa"
```

**Output**

```text
false
```

**Explanation**

```text
a → a
b → a
```

Two different characters cannot map to the same character.

---

### Example 5

**Input**

```text
s = "badc"
t = "baba"
```

**Output**

```text
false
```

---

## JavaScript Solution

```javascript
function isIsomorphicString(s, t) {
    if (s.length !== t.length) return false;

    let sMap = new Map();
    let tMap = new Map();

    for (let i = 0; i < s.length; i++) {

        const sChar = s[i];
        const tChar = t[i];

        if (sMap.has(sChar) && sMap.get(sChar) !== tChar) {
            return false;
        }

        if (tMap.has(tChar) && tMap.get(tChar) !== sChar) {
            return false;
        }

        sMap.set(sChar, tChar);
        tMap.set(tChar, sChar);
    }

    return true;
}

// Test Cases
console.log(isIsomorphicString("egg", "add"));       // true
console.log(isIsomorphicString("foo", "bar"));       // false
console.log(isIsomorphicString("paper", "title"));   // true
console.log(isIsomorphicString("ab", "aa"));         // false
console.log(isIsomorphicString("badc", "baba"));     // false
```

---

## Pattern Used

```text
Hash Map (Bidirectional Mapping)
```

---

## Time Complexity

```text
O(n)
```

Where:

- `n` = Length of the strings

---

## Space Complexity

```text
O(n)
```

Two hash maps are used to store character mappings.

---

## Key Interview Concepts

- Use **two HashMaps** to maintain a one-to-one mapping.
- One map stores the mapping from `s → t`.
- The other map stores the reverse mapping from `t → s`.
- Before inserting a new mapping, verify that any existing mapping is consistent.
- If either mapping conflicts, return `false`.
- This bidirectional mapping approach is the standard and most commonly expected interview solution.
```