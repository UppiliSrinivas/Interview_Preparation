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

## Phase 2: Expo vs React Native CLI

### Q13: What is Expo?

**Answer:**

Expo is a framework built on top of React Native that simplifies development by providing pre-configured tools, libraries, OTA updates, and cloud build services.

**Example:**

```bash
npx create-expo-app MyApp
```

You can run the app immediately using Expo Go without opening Android Studio or Xcode.

---

### Q14: What is React Native CLI?

**Answer:**

React Native CLI is the official way of creating React Native apps with full access to Android and iOS native projects.

**Example:**

```bash
npx react-native init MyApp
```

Creates:

```text
android/
ios/
```

folders for native customization.

---

### Q15: What are the differences between Expo and React Native CLI?

**Answer:**

| Feature        | Expo     | React Native CLI |
| -------------- | -------- | ---------------- |
| Setup          | Easy     | Moderate         |
| Native Access  | Limited  | Full             |
| OTA Updates    | Built-in | Manual           |
| Native Modules | Limited  | Full             |
| Build Setup    | Managed  | Customizable     |

**Example:**

For a startup MVP → Expo

For a banking app → React Native CLI

---

### Q16: What are the advantages of Expo?

**Answer:**

* Quick project setup
* Expo Go support
* OTA Updates
* EAS Cloud Builds
* No native setup initially

---

### Q17: What are the disadvantages of Expo?

**Answer:**

* Limited native customization
* Some third-party SDKs may not work
* Larger app size
* May require prebuild/eject for advanced features

---

### Q18: What are the advantages of React Native CLI?

**Answer:**

* Full native access
* Any Android/iOS SDK can be integrated
* Better enterprise support
* Complete build customization

---

### Q19: What are the disadvantages of React Native CLI?

**Answer:**

* More setup required
* Android/iOS build issues
* Native development knowledge needed
* Higher maintenance effort

---

### Q20: What is Expo Go?

**Answer:**

Expo Go is a mobile application that allows developers to run and test Expo apps by scanning a QR code.

**Example:**

```bash
npx expo start
```

---

### Q21: How does Expo Go work?

**Answer:**

Expo starts a local development server.

```text
Developer Machine
        ↓
Expo Server
        ↓
QR Code
        ↓
Expo Go App
```

The application loads directly on the device.

---

### Q22: What is EAS Build?

**Answer:**

EAS (Expo Application Services) Build is Expo's cloud build system used to generate Android and iOS builds.

**Example:**

```bash
eas build --platform android
```

---

### Q23: What are OTA (Over-The-Air) Updates?

**Answer:**

OTA updates allow JavaScript changes to be delivered without publishing a new version to the Play Store or App Store.

---

### Q24: How do OTA Updates work in Expo?

**Answer:**

Developer publishes an update:

```bash
eas update
```

Users automatically receive the latest JavaScript bundle when opening the app.

---

### Q25: What is Expo Prebuild?

**Answer:**

Expo Prebuild generates Android and iOS native projects from an Expo application.

**Example:**

```bash
npx expo prebuild
```

---

### Q26: What happens after running expo prebuild?

**Answer:**

Expo creates:

```text
android/
ios/
```

folders and converts the project into a native-capable project.

---

### Q27: Can Expo use Native Modules?

**Answer:**

Yes.

* Managed Workflow → Expo-supported modules only.
* Prebuild/Bare Workflow → Any Native Module.

---

### Q28: What is the difference between Expo Managed Workflow and Bare Workflow?

**Answer:**

**Managed Workflow**

* No android/ios folders
* Expo manages native configuration
* Faster development

**Bare Workflow**

* android/ios folders available
* Full native access
* More flexibility

---

### Q29: When would you choose Expo?

**Answer:**

Choose Expo for:

* MVPs
* Rapid prototyping
* Startup products
* Internal business applications

---

### Q30: When would you choose React Native CLI?

**Answer:**

Choose React Native CLI for:

* Banking applications
* Fintech products
* Healthcare apps
* Enterprise applications
* Native SDK integrations

---

### Q31: Which would you choose for a Banking Application and why?

**Answer:**

I would choose React Native CLI because banking apps often require:

* Native SDK integration
* Biometric authentication
* Security libraries
* Device-level features

---

### Q32: Which would you choose for an MVP and why?

**Answer:**

I would choose Expo because:

* Faster development
* Less setup
* Built-in OTA updates
* Faster time-to-market

---
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


