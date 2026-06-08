# React Native Interview Preparation (5.7 Years Experience)

## Phase 1: React Native Architecture

### Q1: What is React Native?

**Answer:**

React Native is an open-source framework developed by Meta for building cross-platform mobile applications using JavaScript and React. It allows developers to write a single codebase and deploy applications on both Android and iOS while rendering native UI components.

---

### Q2: How does React Native differ from React.js?

**Answer:**

| React.js                | React Native               |
| ----------------------- | -------------------------- |
| Builds Web Applications | Builds Mobile Applications |
| Uses HTML Elements      | Uses Native Components     |
| Uses DOM                | Uses Native UI Components  |
| Browser Rendering       | Android/iOS Rendering      |

Example:

React.js

```jsx
<div>Hello</div>
```

React Native

```jsx
<Text>Hello</Text>
```

---

### Q3: Explain React Native Architecture.

**Answer:**

React Native architecture consists of:

1. JavaScript Thread
2. Bridge (Old Architecture)
3. Native Modules
4. UI Thread
5. Native Thread

Flow:

JavaScript Code
↓
JavaScript Thread
↓
Bridge
↓
Native Modules
↓
Android / iOS Native Components

---

### Q4: What is the JavaScript Thread?

**Answer:**

The JavaScript thread executes:

* Business Logic
* API Calls
* Hooks
* State Updates
* Event Handling

Example:

```javascript
const [count, setCount] = useState(0);

fetch('/users');
```

---

### Q5: What is the UI Thread?

**Answer:**

The UI Thread is responsible for:

* Rendering UI
* Animations
* Scrolling
* Touch Events

---

### Q6: What is the Native Thread?

**Answer:**

The Native Thread handles:

* Camera
* Bluetooth
* GPS
* File System
* Native SDKs

---

### Q7: What is React Native Bridge?

**Answer:**

The Bridge is a communication layer between JavaScript and Native Code.

Flow:

JavaScript
↓
Bridge
↓
Native

---

### Q8: What are the limitations of the Bridge?

**Answer:**

1. Serialization overhead
2. Asynchronous communication
3. Performance bottleneck
4. Animation lag
5. Large data transfer issues

---

### Q9: What is JSI?

**Answer:**

JSI (JavaScript Interface) is a C++ layer that allows JavaScript and Native code to communicate directly without using the Bridge.

Old Architecture:

JS
↓
Bridge
↓
Native

New Architecture:

JS
↓
JSI
↓
Native

Benefits:

* Faster communication
* Less serialization
* Better performance

---

### Q10: What are TurboModules?

**Answer:**

TurboModules are the next generation of Native Modules that support lazy loading and direct JSI communication.

Benefits:

* Faster startup
* Reduced memory usage
* Better performance

---

### Q11: What is Fabric?

**Answer:**

Fabric is React Native's new rendering engine.

Responsibilities:

* UI Rendering
* Layout Calculations
* Screen Updates
* Better Animation Performance

---

### Q12: What problem does the New Architecture solve?

**Answer:**

The New Architecture solves:

* Bridge bottlenecks
* Slow startup
* Heavy memory usage
* Poor UI rendering performance

using:

* JSI
* TurboModules
* Fabric

---

## Phase 2: Expo vs React Native CLI

### Q13: What is Expo?

**Answer:**

Expo is a framework built on top of React Native that simplifies development by providing:

* Expo SDK
* Expo Go
* OTA Updates
* EAS Build

---

### Q14: What is React Native CLI?

**Answer:**

React Native CLI provides full access to Android and iOS native projects.

Project Structure:

```text
android/
ios/
src/
```

---

### Q15: Expo vs React Native CLI

**Answer:**

| Feature         | Expo      | RN CLI    |
| --------------- | --------- | --------- |
| Setup           | Easy      | Moderate  |
| Native Access   | Limited   | Full      |
| OTA Updates     | Built-in  | Manual    |
| Native Modules  | Limited   | Full      |
| Enterprise Apps | Sometimes | Preferred |

---

### Q16: What is Expo Go?

**Answer:**

Expo Go allows developers to run and test Expo applications instantly by scanning a QR code.

---

### Q17: What is EAS Build?

**Answer:**

EAS Build is Expo's cloud build service for generating Android and iOS builds.

---

### Q18: What are OTA Updates?

**Answer:**

OTA (Over-The-Air) updates allow JavaScript updates to be delivered without publishing a new app version to the Play Store or App Store.

---

### Q19: What is Expo Prebuild?

**Answer:**

```bash
npx expo prebuild
```

Generates:

```text
android/
ios/
```

folders, allowing native customization.

---

### Q20: When would you choose Expo?

**Answer:**

* MVP Development
* Rapid Development
* Startup Applications
* Internal Business Applications

---

### Q21: When would you choose React Native CLI?

**Answer:**

* Banking Applications
* Fintech Applications
* Healthcare Applications
* Enterprise Applications
* Custom Native SDK Integrations

---

## Phase 3: FlatList & Optimization

### Q22: Why FlatList?

**Answer:**

FlatList uses virtualization to render only visible items instead of rendering the entire dataset.

Benefits:

* Lower Memory Usage
* Better Scrolling Performance
* Faster Rendering

---

### Q23: What is Virtualization?

**Answer:**

Virtualization is the process of rendering only visible items and removing off-screen items from memory.

---

### Q24: How do you optimize FlatList?

**Answer:**

1. React.memo
2. useCallback
3. keyExtractor
4. getItemLayout
5. Pagination
6. FlashList
7. removeClippedSubviews

---

### Q25: What is getItemLayout?

**Answer:**

Used when item height is fixed.

Example:

```javascript
getItemLayout={(data,index)=>({
 length:80,
 offset:80*index,
 index
})}
```

Benefits:

* Faster scrolling
* Faster scrollToIndex

---

### Q26: What is keyExtractor?

**Answer:**

Provides a unique key for each list item.

Example:

```javascript
keyExtractor={(item)=>item.id}
```

---

### Q27: Why use React.memo in FlatList?

**Answer:**

Prevents unnecessary re-renders of item components.

---

### Q28: Why use useCallback with renderItem?

**Answer:**

Prevents recreation of renderItem function on every render.

---

### Q29: What is onEndReached?

**Answer:**

A callback triggered when the user scrolls near the end of the list.

Used for:

* Pagination
* Infinite Scrolling

Example:

```javascript
onEndReached={fetchNextPage}
```

---

### Q30: What is onEndReachedThreshold?

**Answer:**

Controls how close to the end of the list the user must be before onEndReached is triggered.

Example:

```javascript
onEndReachedThreshold={0.5}
```

Means:

Trigger when the user is within half a screen height from the bottom.

---

### Q31: Why does onEndReached fire multiple times?

**Answer:**

Reasons:

* Fast scrolling
* Missing loading flag
* Re-renders

Solution:

```javascript
if(loading) return;
```

---

### Q32: What is FlashList?

**Answer:**

FlashList is a high-performance list component developed by Shopify.

Benefits:

* Better rendering performance
* Better memory management
* Suitable for large datasets

Example:

```javascript
import { FlashList } from "@shopify/flash-list";
```

---

## Interview Summary

For Accenture, the most important topics are:

1. React Native Architecture
2. JSI
3. TurboModules
4. Fabric
5. Expo vs CLI
6. Native Modules
7. FlatList Optimization
8. Hooks
9. Redux / Zustand
10. Deep Linking
11. Push Notifications
12. Build Process

Master these topics first before moving to coding rounds and advanced React Native concepts.
