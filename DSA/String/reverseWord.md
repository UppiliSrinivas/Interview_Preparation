# Reverse Words in a String

## Problem Statement

Given a string `str` containing words separated by spaces, reverse the order of the words.

- Remove any leading and trailing spaces.
- Replace multiple spaces between words with a single space.
- Return the resulting string.

**Note:**

- Do **not** use built-in methods like `split()`, `reverse()`, or `join()`.
- Solve the problem using string traversal.

---

## Examples

### Example 1

**Input**

```text
str = "the sky is blue"
```

**Output**

```text
blue is sky the
```

---

### Example 2

**Input**

```text
str = "  hello world  "
```

**Output**

```text
world hello
```

---

### Example 3

**Input**

```text
str = "a good   example"
```

**Output**

```text
example good a
```

---

### Example 4

**Input**

```text
str = "JavaScript"
```

**Output**

```text
JavaScript
```

---

### Example 5

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
function reverseWord(str) {
    let result = "";
    let lastIndex = str.length;

    for (let i = str.length - 1; i >= 0; i--) {

        if (str[i] === ' ') {
            lastIndex = i;
        }
        else if (i === 0 || str[i - 1] === ' ') {

            if (result.length > 0) {
                result += " ";
            }

            result += str.substring(i, lastIndex);
        }
    }

    return result;
}

// Test Cases
console.log(reverseWord("the sky is blue"));      // "blue is sky the"
console.log(reverseWord("  hello world  "));      // "world hello"
console.log(reverseWord("a good   example"));     // "example good a"
console.log(reverseWord("JavaScript"));           // "JavaScript"
console.log(reverseWord(""));                     // ""
```

---

## Pattern Used

```text
String Traversal + Two Pointers
```

---

## Time Complexity

```text
O(n)
```

The string is traversed only once from right to left.

---

## Space Complexity

```text
O(n)
```

The result string stores the reversed sentence.

---

## Key Interview Concepts

- Traverse a string from right to left.
- Identify word boundaries using spaces.
- Handle leading, trailing, and multiple spaces.
- Extract words using `substring()`.
- Build the final string without using `split()`, `reverse()`, or `join()`.