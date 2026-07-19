# Valid Palindrome (Ignore Special Characters)

## Problem Statement

Given a string `str`, determine whether it is a palindrome after:

- Ignoring uppercase and lowercase differences.
- Ignoring all non-alphanumeric characters (spaces, punctuation, symbols, etc.).

Return `true` if it is a palindrome; otherwise, return `false`.

---

## Examples

### Example 1

**Input**

```text
"A man, a plan, a canal: Panama"
```

**Output**

```text
true
```

**Explanation**

After removing special characters and converting to lowercase:

```text
amanaplanacanalpanama
```

It reads the same from left to right and right to left.

---

### Example 2

**Input**

```text
"race a car"
```

**Output**

```text
false
```

---

### Example 3

**Input**

```text
"madam"
```

**Output**

```text
true
```

---

## Approach

This problem is best solved using the **Two Pointer Pattern**.

### Algorithm

1. Initialize two pointers:
   - `left = 0`
   - `right = str.length - 1`
2. Move the `left` pointer forward until it points to an alphanumeric character.
3. Move the `right` pointer backward until it points to an alphanumeric character.
4. Compare both characters (case-insensitive).
5. If they are different, return `false`.
6. Otherwise, move both pointers inward.
7. Continue until both pointers meet.
8. If no mismatch is found, return `true`.

---

## JavaScript Solution

```javascript
function isPalindrome(str) {
    let left = 0;
    let right = str.length - 1;

    while (left < right) {

        while (
            left < right &&
            !/[a-z0-9]/i.test(str[left])
        ) {
            left++;
        }

        while (
            left < right &&
            !/[a-z0-9]/i.test(str[right])
        ) {
            right--;
        }

        if (str[left].toLowerCase() !== str[right].toLowerCase()) {
            return false;
        }

        left++;
        right--;
    }

    return true;
}

// Test Cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("race a car"));                      // false
console.log(isPalindrome("madam"));                           // true
console.log(isPalindrome("No lemon, no melon"));             // true
```

---

## Dry Run

Input:

```text
"A man, a plan, a canal: Panama"
```

Initial pointers:

```text
A man, a plan, a canal: Panama
↑                             ↑
```

Compare:

```text
A == a ✅
```

Move pointers.

Skip spaces and punctuation.

```text
A man, a plan, a canal: Panama
 ↑                           ↑
```

Compare:

```text
m == m ✅
```

Continue until both pointers meet.

Since every comparison matches, return:

```text
true
```

---

## Time Complexity

| Operation | Complexity |
|-----------|------------|
| Traversing the string | O(n) |

**Overall Time Complexity**

```text
O(n)
```

---

## Space Complexity

Only two pointers are used.

No extra string or array is created.

```text
O(1)
```

---

## Why This Solution Is Optimal

- No additional string is created.
- No extra array is used.
- Every character is visited at most once.
- Uses the **Two Pointer Pattern**, a common interview technique.
- Achieves **O(n)** time and **O(1)** extra space.

---

## Interview Follow-up Questions

### Q1. Why not use `replace()` and `toLowerCase()`?

They create a new string, increasing the extra space complexity to **O(n)**.

---

### Q2. Why use two pointers?

Because we only need to compare characters from both ends while moving toward the center.

---

### Q3. Can this be solved recursively?

Yes, but recursion uses the call stack, resulting in **O(n)** extra space.

---

## Pattern Used

```text
Two Pointers
```

---

## Key Takeaways

- Recognize this as a **Two Pointer** problem.
- Skip invalid characters while traversing.
- Compare characters in a case-insensitive manner.
- Avoid creating extra strings for the most optimal solution.
- Always discuss **Time Complexity** and **Space Complexity** during interviews.