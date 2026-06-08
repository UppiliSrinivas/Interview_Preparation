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

JSI (JavaScript Interface) is a C++ layer that allows JavaScript and Native code to communicate directly without using the React Native Bridge.

**Old Architecture**

```text
JS
 ↓
Bridge
 ↓
Native
```

Every communication had to go through the Bridge, which introduced serialization/deserialization overhead.

**New Architecture**

```text
JS
 ↓
JSI
 ↓
Native
```

JSI removes the Bridge and enables direct communication between JavaScript and Native code.

**Benefits:**

* Faster Communication
* Less Serialization
* Better Performance
* Reduced Memory Usage

**Interview Answer:**

JSI is a C++ interface that allows JavaScript and Native code to communicate directly without using the Bridge, improving performance and reducing communication overhead.

---

### Q10: What are TurboModules?

**Answer:**

TurboModules are the next generation of Native Modules that use JSI for communication and support lazy loading.

**Old Native Modules**

```text
App Start
   ↓
Load All Native Modules
```

Example:

* Camera
* Bluetooth
* GPS
* Contacts
* Printer

Even unused modules were loaded during app startup.

**TurboModules**

```text
App Start
   ↓
Load Nothing
```

When needed:

```javascript
Camera.open();
```

Then the Camera module loads.

This is called **Lazy Loading**.

**Benefits:**

* Faster Startup Time
* Reduced Memory Usage
* Better Performance
* Direct JSI Communication

**Interview Answer:**

TurboModules are Native Modules that load only when required and communicate through JSI instead of the Bridge, improving startup performance and reducing memory usage.

---

### Q11: What is Fabric?

**Answer:**

Fabric is React Native's new rendering engine responsible for rendering and updating Native UI components efficiently.

**Old Rendering Flow**

```text
React
 ↓
Shadow Tree
 ↓
Bridge
 ↓
Native Views
```

This required multiple bridge communications.

**Fabric Rendering Flow**

```text
React
 ↓
Fabric
 ↓
Native UI
```

Fabric removes bridge dependency and improves rendering efficiency.

**Responsibilities:**

* UI Rendering
* Layout Calculations
* Screen Updates
* Better Animations
* Better Scrolling

**Benefits:**

* Faster Rendering
* Better User Experience
* Improved Scrolling
* Concurrent Rendering Support

**Interview Answer:**

Fabric is React Native's new rendering engine that improves UI rendering performance by reducing bridge dependency and enabling more efficient updates to native components.

---

### Q12: What problem does the New Architecture solve?

**Answer:**

The old architecture relied heavily on the Bridge for communication.

```text
JS
 ↓
Bridge
 ↓
Native
```

Problems:

* Serialization Overhead
* Slow Startup
* Heavy Memory Usage
* Performance Bottlenecks
* Poor UI Rendering Performance

React Native introduced:

* JSI
* TurboModules
* Fabric

to solve these issues.

**New Architecture**

```text
JavaScript
     │
     ▼
     JSI
     │
     ▼
 TurboModules
     │
     ▼
   Fabric
```

**Benefits:**

* Faster Startup
* Better Memory Management
* Faster Communication
* Better Rendering
* Improved User Experience

**Interview Answer:**

The New Architecture solves performance bottlenecks caused by the Bridge by introducing JSI, TurboModules, and Fabric, resulting in faster startup, better memory usage, and improved UI rendering.

---

### Q15: Expo vs React Native CLI

**Answer:**

| Feature             | Expo             | React Native CLI |
| ------------------- | ---------------- | ---------------- |
| Setup               | Easy             | Moderate         |
| Native Access       | Limited          | Full             |
| Android/iOS Folders | Hidden Initially | Available        |
| OTA Updates         | Built-in         | Manual Setup     |
| Native Modules      | Limited          | Full Support     |
| Build Configuration | Managed          | Full Control     |
| Enterprise Apps     | Sometimes        | Preferred        |

**When to use Expo?**

* MVP Development
* Rapid Development
* Startup Applications
* Internal Applications

**When to use React Native CLI?**

* Banking Applications
* Fintech Applications
* Healthcare Applications
* Enterprise Applications
* Custom Native SDK Integrations

**Interview Answer:**

Expo is best for rapid development and simpler projects, while React Native CLI is preferred when full native customization and enterprise-level integrations are required.

---

### Q29: What is onEndReached?

**Answer:**

`onEndReached` is a FlatList callback that gets triggered when the user scrolls near the end of the list.

Used for:

* Pagination
* Infinite Scrolling
* Social Media Feeds
* Product Listings

Example:

```javascript
onEndReached={fetchNextPage}
```

Flow:

```text
User Scrolls
      ↓
Near End of List
      ↓
onEndReached Fires
      ↓
Fetch Next Page
```

**Interview Answer:**

onEndReached is used to load additional data when the user scrolls near the end of a FlatList, commonly used for pagination and infinite scrolling.

---

### Q30: What is onEndReachedThreshold?

**Answer:**

`onEndReachedThreshold` controls how close to the end of the list the user must be before `onEndReached` is triggered.

Example:

```javascript
onEndReachedThreshold={0.5}
```

Meaning:

```text
Viewport Height = 800px

0.5 × 800 = 400px
```

`onEndReached` will trigger when the user is approximately 400px from the bottom.

Common Values:

```javascript
0.3
0.5
```

**Benefits:**

* Fetches data early
* Prevents loading delays
* Smooth scrolling experience

**Interview Answer:**

onEndReachedThreshold determines how early FlatList should trigger onEndReached before the user reaches the end of the list.

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
