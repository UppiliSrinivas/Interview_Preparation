## FlatList Optimization

### Q55: How do you optimize FlatList?

**Answer:**

FlatList can be optimized using:

1. React.memo
2. useCallback
3. keyExtractor
4. getItemLayout
5. Pagination
6. removeClippedSubviews
7. FlashList

These techniques reduce re-renders, memory usage, and improve scrolling performance.

**Interview Answer:**

I optimize FlatList using React.memo, useCallback, keyExtractor, getItemLayout, pagination, and FlashList for large datasets.

---

### Q56: Why should renderItem be memoized?

**Answer:**

Without memoization, renderItem gets recreated on every component re-render.

Bad Example:

```javascript id="a5jr1e"
const renderItem = ({ item }) => {
  return <UserCard item={item} />;
};
```

Better:

```javascript id="c6v5gm"
const renderItem = useCallback(
  ({ item }) => {
    return <UserCard item={item} />;
  },
  []
);
```

**Benefits:**

* Prevents unnecessary function recreation
* Reduces re-renders
* Improves performance

**Interview Answer:**

renderItem should be memoized using useCallback to prevent unnecessary function recreation and improve FlatList performance.

---

### Q57: Why should item components use React.memo?

**Answer:**

React.memo prevents a component from re-rendering if its props have not changed.

Example:

```javascript id="j9tp3o"
const UserCard = React.memo(({ item }) => {
  return <Text>{item.name}</Text>;
});
```

Without React.memo:

```text id="on9v0q"
Parent Re-render
      ↓
All List Items Re-render
```

With React.memo:

```text id="o0kjg3"
Parent Re-render
      ↓
Only Changed Items Re-render
```

**Interview Answer:**

React.memo prevents unnecessary re-rendering of list items and significantly improves FlatList performance.

---

### Q58: What is keyExtractor?

**Answer:**

keyExtractor provides a unique key for each item in FlatList.

Example:

```javascript id="px1t5l"
keyExtractor={(item) => item.id}
```

React uses these keys to identify which items changed, were added, or removed.

**Interview Answer:**

keyExtractor provides a unique identifier for each item, helping React efficiently update the list.

---

### Q59: Why is keyExtractor important?

**Answer:**

Without a unique key, React cannot efficiently track list changes.

Problems:

* Unnecessary re-renders
* Incorrect UI updates
* Poor performance

Good:

```javascript id="0vjlwm"
keyExtractor={(item) => item.id}
```

Bad:

```javascript id="j9u6ga"
keyExtractor={(item, index) => index.toString()}
```

**Interview Answer:**

keyExtractor helps React identify list items efficiently, improving rendering performance and preventing UI issues.

---

### Q60: Why should index not be used as a key?

**Answer:**

Indexes can change when:

* Items are added
* Items are removed
* Items are reordered

Example:

```text id="dzkf1x"
Before:
0 - Apple
1 - Orange
2 - Mango
```

Insert a new item:

```text id="lfq8ha"
0 - Banana
1 - Apple
2 - Orange
3 - Mango
```

React now thinks all items changed.

**Interview Answer:**

Indexes should not be used as keys because they can change when the list updates, causing unnecessary re-renders and UI inconsistencies.

---

### Q61: What is getItemLayout?

**Answer:**

getItemLayout tells FlatList the size and position of items in advance.

Example:

```javascript id="7uyfry"
getItemLayout={(data, index) => ({
  length: 80,
  offset: 80 * index,
  index,
})}
```

FlatList no longer needs to measure every item dynamically.

**Benefits:**

* Faster scrolling
* Faster scrollToIndex
* Better performance

**Interview Answer:**

getItemLayout provides item dimensions beforehand, reducing layout calculations and improving FlatList performance.

---

### Q62: When should getItemLayout be used?

**Answer:**

Use getItemLayout when all items have a fixed height or width.

Example:

```text id="s0d0li"
Chat Message Height = Variable ❌

Product Card Height = Fixed ✅
```

Best suited for:

* Product Lists
* User Lists
* Settings Menus
* Static Row Heights

**Interview Answer:**

getItemLayout should be used when item dimensions are fixed and predictable.

---

### Q63: How does getItemLayout improve performance?

**Answer:**

Normally FlatList calculates item positions dynamically.

```text id="jph1mb"
Item 1
Measure
Item 2
Measure
Item 3
Measure
```

With getItemLayout:

```text id="oz0gwi"
Position Known Already
```

No runtime measurement needed.

Benefits:

* Faster Rendering
* Better Scrolling
* Faster scrollToIndex

**Interview Answer:**

getItemLayout improves performance by avoiding runtime layout measurements and allowing FlatList to calculate item positions instantly.