# React Navigation

## Q1: What is React Navigation?

**Answer:**

React Navigation is the most popular library used to navigate between different screens in a React Native application.

It manages screen transitions, navigation history, and the overall navigation flow.

**Example:**

```jsx
navigation.navigate("Profile");
```

Flow:

```text
Home
  ↓
Profile
```

**Interview Answer:**

> React Navigation is a library that manages navigation between screens in React Native applications. It provides Stack, Tab, and Drawer navigators while maintaining navigation history.

---

## Q2: Why do we use React Navigation?

**Answer:**

We use React Navigation to:

* Navigate between screens
* Pass data between screens
* Maintain navigation history
* Handle authentication flows
* Support deep linking

Example:

```text
Login
  ↓
Home
  ↓
Profile
```

**Interview Answer:**

> React Navigation simplifies screen management, parameter passing, and navigation history in React Native applications.

---

## Q3: What are the different types of Navigators?

**Answer:**

React Navigation provides different navigators for different navigation patterns.

1. Stack Navigator
2. Native Stack Navigator
3. Bottom Tab Navigator
4. Material Top Tab Navigator
5. Drawer Navigator

```text
App
│
├── Stack
├── Bottom Tabs
├── Drawer
└── Top Tabs
```

**Interview Answer:**

> React Navigation provides Stack, Native Stack, Bottom Tab, Top Tab, and Drawer navigators to support different navigation requirements.

---

## Q4: What is Stack Navigator?

**Answer:**

Stack Navigator displays screens one on top of another following the **Last In First Out (LIFO)** principle.

Flow:

```text
Home
 ↓
Profile
 ↓
Settings
```

Going Back:

```text
Settings
 ↑
Profile
 ↑
Home
```

Example:

```jsx
<Stack.Navigator>
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="Profile" component={ProfileScreen} />
</Stack.Navigator>
```

**Best Used For:**

* Login Flow
* Product Details
* Profile
* Settings

**Interview Answer:**

> Stack Navigator follows the LIFO principle where each new screen is pushed onto the stack and removed when navigating back.

---

## Q5: What is Native Stack Navigator?

**Answer:**

Native Stack Navigator uses the native navigation APIs provided by Android and iOS instead of JavaScript-based navigation.

Benefits:

* Faster navigation
* Native animations
* Better performance
* Lower memory usage

Installation:

```bash
npm install @react-navigation/native-stack
```

**Interview Answer:**

> Native Stack Navigator uses native platform navigation APIs, providing smoother transitions and better performance than the JavaScript-based Stack Navigator.

---

## Q6: What is the difference between Stack Navigator and Native Stack Navigator?

**Answer:**

| Stack Navigator     | Native Stack Navigator |
| ------------------- | ---------------------- |
| JavaScript-based    | Native-based           |
| More customizable   | Native look & feel     |
| Slightly slower     | Faster                 |
| Higher memory usage | Lower memory usage     |

**Interview Answer:**

> Stack Navigator is implemented in JavaScript, while Native Stack Navigator uses native platform APIs for improved performance and smoother animations.

---

## Q7: What is Bottom Tab Navigator?

**Answer:**

Bottom Tab Navigator displays tabs at the bottom of the screen for quick navigation between the main sections of an application.

Example:

```text
🏠 Home
🔍 Search
🛒 Cart
👤 Profile
```

**Best Used For:**

* Shopping Apps
* Banking Apps
* Social Media Apps

**Interview Answer:**

> Bottom Tab Navigator provides bottom navigation tabs that allow users to quickly switch between primary screens.

---

## Q8: What is Material Top Tab Navigator?

**Answer:**

Material Top Tab Navigator displays swipeable tabs at the top of the screen.

Example:

```text
Following | For You | Trending
```

Users can switch tabs by tapping or swiping.

**Interview Answer:**

> Material Top Tab Navigator provides top swipeable tabs and is commonly used for category-based navigation.

---

## Q9: What is Drawer Navigator?

**Answer:**

Drawer Navigator provides a side navigation menu that slides from the left or right side of the screen.

Example:

```text
☰ Menu

Home
Orders
Settings
Logout
```

**Best Used For:**

* Enterprise Applications
* Admin Panels
* Business Apps

**Interview Answer:**

> Drawer Navigator provides a side menu that allows users to access different sections of an application.

---

## Q10: What is NavigationContainer?

**Answer:**

NavigationContainer is the root component that manages the navigation state of the application.

Example:

```jsx
<NavigationContainer>
  <AppNavigator />
</NavigationContainer>
```

Without NavigationContainer, navigation will not work.

**Interview Answer:**

> NavigationContainer is the root component responsible for managing navigation state and linking all navigators together.

---

## Q11: How do you pass parameters between screens?

**Answer:**

Parameters are passed using the `navigate()` method.

Example:

```jsx
navigation.navigate("Profile", {
  userId: 10,
});
```

**Interview Answer:**

> Parameters are passed using `navigation.navigate()` and can be accessed in the destination screen using `route.params`.

---

## Q12: How do you receive parameters in another screen?

**Answer:**

Parameters are received using the `route` object.

Example:

```jsx
function Profile({ route }) {
  console.log(route.params.userId);
}
```

Output:

```text
10
```

**Interview Answer:**

> Parameters are received using the `route.params` object provided by React Navigation.

---

## Q13: What is the difference between navigate() and push()?

**Answer:**

### navigate()

Navigates to an existing screen if it already exists in the navigation stack.

```jsx
navigation.navigate("Profile");
```

### push()

Always creates a new instance of the screen.

```jsx
navigation.push("Profile");
```

Example:

```text
navigate()

Home
 ↓
Profile

navigate(Profile)

Home
 ↓
Profile
```

No duplicate screen is created.

```text
push()

Home
 ↓
Profile
 ↓
Profile
 ↓
Profile
```

A new screen is added every time.

**Interview Answer:**

> `navigate()` reuses an existing screen if it's already in the stack, while `push()` always creates a new instance of that screen.

---

## Q14: What is the difference between replace() and navigate()?

**Answer:**

### navigate()

Adds a new screen to the navigation stack.

```text
Home
 ↓
Login
```

### replace()

Removes the current screen and replaces it with another screen.

```text
Login
 ↓
replace()
 ↓
Home
```

Now pressing the Back button will not return to the Login screen.

Example:

```jsx
navigation.replace("Home");
```

**Use Case:**

After successful login:

```text
Login
 ↓
Home
```

The user should not be able to navigate back to the Login screen.

**Interview Answer:**

> `navigate()` pushes a new screen onto the navigation stack, while `replace()` replaces the current screen, preventing users from returning to the previous screen.

---

# Quick Revision

| Question                  | One-Line Answer                                   |
| ------------------------- | ------------------------------------------------- |
| What is React Navigation? | Library used for navigation between screens.      |
| Why use React Navigation? | Manages screen transitions and navigation state.  |
| Types of Navigators?      | Stack, Native Stack, Bottom Tab, Top Tab, Drawer. |
| Stack Navigator?          | LIFO navigation using a stack of screens.         |
| Native Stack?             | Native navigation with better performance.        |
| Stack vs Native Stack?    | JavaScript-based vs Native-based navigation.      |
| Bottom Tab?               | Bottom navigation for primary screens.            |
| Top Tab?                  | Swipeable tabs at the top.                        |
| Drawer?                   | Side navigation menu.                             |
| NavigationContainer?      | Root component managing navigation state.         |
| Pass Parameters?          | `navigation.navigate("Screen", params)`           |
| Receive Parameters?       | `route.params`                                    |
| navigate() vs push()?     | Reuse existing screen vs create new instance.     |
| replace() vs navigate()?  | Replace current screen vs push a new screen.      |
