# Longest Common Prefix

## Problem Statement

Given an array of strings `strs`, find the **longest common prefix** among all the strings.

If there is no common prefix, return an empty string `""`.

---

## Examples

### Example 1

**Input**

```text
strs = ["flower", "flow", "flight"]
```

**Output**

```text
fl
```

---

### Example 2

**Input**

```text
strs = ["dog", "racecar", "car"]
```

**Output**

```text

```

---

### Example 3

**Input**

```text
strs = ["interview", "internet", "internal"]
```

**Output**

```text
inter
```

---

### Example 4

**Input**

```text
strs = ["apple"]
```

**Output**

```text
apple
```

---

### Example 5

**Input**

```text
strs = []
```

**Output**

```text

```

---

## JavaScript Solution

```javascript
function longestCommonPrefix(arr) {
    if (arr.length === 0) return "";

    let result = arr[0];

    for (let i = 1; i < arr.length; i++) {
        let temp = "";

        for (let j = 0; j < result.length; j++) {
            if (result[j] === arr[i][j]) {
                temp += result[j];
            } else {
                break;
            }
        }

        result = temp;

        if (result === "") {
            return "";
        }
    }

    return result;
}

// Test Cases
console.log(longestCommonPrefix(["flower", "flow", "flight"]));      // "fl"
console.log(longestCommonPrefix(["dog", "racecar", "car"]));          // ""
console.log(longestCommonPrefix(["interview", "internet", "internal"])); // "inter"
console.log(longestCommonPrefix(["apple"]));                          // "apple"
console.log(longestCommonPrefix([]));                                 // ""
```

---

## Pattern Used

```text
String Traversal + Horizontal Scanning
```

---

## Time Complexity

```text
O(n × m)
```

Where:

- `n` = Number of strings
- `m` = Length of the shortest common prefix

---

## Space Complexity

```text
O(1)
```

(Excluding the output string)

---

## Key Interview Concepts

- Start with the first string as the initial prefix.
- Compare the current prefix with each remaining string.
- Reduce the prefix whenever a mismatch is found.
- If the prefix becomes empty, return immediately.
- This approach is known as **Horizontal Scanning** and is the most commonly expected solution in coding interviews.