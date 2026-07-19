# Longest Substring Without Repeating Characters

## Problem Statement

Given a string `str`, find the **length** of the longest substring that contains **no repeating characters**.

A **substring** is a contiguous sequence of characters.

Return the length of the longest substring without repeating characters.

---

## Examples

### Example 1

**Input**

```text
str = "abcabcbb"
```

**Output**

```text
3
```

**Explanation**

The longest substring without repeating characters is:

```text
abc
```

Length = **3**

---

### Example 2

**Input**

```text
str = "bbbbb"
```

**Output**

```text
1
```

**Explanation**

The longest substring is:

```text
b
```

Length = **1**

---

### Example 3

**Input**

```text
str = "pwwkew"
```

**Output**

```text
3
```

**Explanation**

The longest substring without repeating characters is:

```text
wke
```

Length = **3**

---

### Example 4

**Input**

```text
str = "abcdef"
```

**Output**

```text
6
```

**Explanation**

All characters are unique, so the entire string is the longest substring.

---

### Example 5

**Input**

```text
str = ""
```

**Output**

```text
0
```

---

## JavaScript Solution

```javascript
function longestSubstring(str) {
    let left = 0;
    let seen = new Set();
    let maxLength = 0;

    for (let right = 0; right < str.length; right++) {

        // Remove duplicate characters from the left
        while (seen.has(str[right])) {
            seen.delete(str[left]);
            left++;
        }

        // Add current character to the window
        seen.add(str[right]);

        // Update maximum length
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Test Cases
console.log(longestSubstring("abcabcbb")); // 3
console.log(longestSubstring("bbbbb"));    // 1
console.log(longestSubstring("pwwkew"));   // 3
console.log(longestSubstring("abcdef"));   // 6
console.log(longestSubstring(""));         // 0
```

### Pattern Used

```text
Sliding Window + Two Pointers + Hash Set
```

### Time Complexity

```text
O(n)
```

### Space Complexity

```text
O(n)
```