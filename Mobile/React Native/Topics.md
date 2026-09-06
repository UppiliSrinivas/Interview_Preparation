# React Native Interview Preparation Guide

> A comprehensive roadmap for React Native interviews (Beginner → Advanced)

---

# Table of Contents

1. JavaScript Fundamentals
2. ES6+ Features
3. React Fundamentals
4. React Hooks
5. React Native Basics
6. Components
7. Styling
8. Navigation
9. State Management
10. Networking
11. Storage
12. Performance Optimization
13. Deep Linking
14. Push Notifications
15. Native Modules
16. Permissions
17. Security
18. Animations
19. Testing
20. Debugging
21. Build & Release
22. Architecture
23. Common Interview Questions
24. Coding Challenges
25. Best Practices

---

# 1. JavaScript Fundamentals

## Topics

- Variables (var, let, const)
- Data Types
- Scope
- Hoisting
- Closures
- Lexical Scope
- Functions
- Arrow Functions
- Promises
- Async/Await
- Event Loop
- Callbacks
- Objects
- Arrays
- Array Methods
- Destructuring
- Spread Operator
- Rest Operator
- Optional Chaining
- Nullish Coalescing
- Map
- Set
- WeakMap
- WeakSet

### Important Questions

- What is hoisting?
- Difference between var, let, const?
- Explain closures.
- Explain event loop.
- Difference between Promise and Async/Await.
- Difference between == and ===.
- Explain prototype.
- Explain this keyword.

---

# 2. ES6+ Features

## Topics

- Template Literals
- Classes
- Modules
- Import / Export
- Dynamic Import
- Generators
- Symbols
- Iterators

Interview Questions

- Named Export vs Default Export
- Spread vs Rest
- Arrow Function vs Normal Function

---

# 3. React Fundamentals

## Topics

- JSX
- Virtual DOM
- Reconciliation
- Rendering
- Component Lifecycle
- Functional Components
- Class Components
- Props
- State
- Keys
- Fragments

Interview Questions

- What is Virtual DOM?
- Why keys are important?
- Props vs State?
- Controlled vs Uncontrolled Components?

---

# 4. React Hooks

## Hooks

- useState
- useEffect
- useRef
- useMemo
- useCallback
- useReducer
- useContext
- useLayoutEffect
- useImperativeHandle
- useTransition

Interview Questions

- Difference between useMemo and useCallback
- useRef vs useState
- useEffect lifecycle
- Dependency Array
- Cleanup Function

---

# 5. React Native Basics

Topics

- Architecture
- React Native Bridge
- Fabric
- Turbo Modules
- Hermes
- JSI
- Metro Bundler
- Expo vs CLI

Interview Questions

- How React Native works?
- What is Bridge?
- What is Hermes?
- Expo vs CLI?

---

# 6. Components

Core Components

- View
- Text
- Image
- ScrollView
- FlatList
- SectionList
- SafeAreaView
- Pressable
- TouchableOpacity
- TextInput
- Modal
- ActivityIndicator
- KeyboardAvoidingView

Interview Questions

- FlatList optimization
- ScrollView vs FlatList
- Pressable vs TouchableOpacity

---

# 7. Styling

Topics

- Flexbox
- Dimensions
- Platform
- StyleSheet
- Responsive Design
- PixelRatio
- Safe Area
- Dark Mode

Interview Questions

- Flexbox properties
- Responsive UI
- Platform-specific styling

---

# 8. Navigation

Topics

- Stack Navigation
- Bottom Tabs
- Drawer
- Nested Navigation
- Deep Linking
- Navigation Params
- Authentication Flow

Libraries

- React Navigation

Interview Questions

- Navigation lifecycle
- Passing params
- Deep linking setup

---

# 9. State Management

Topics

- Context API
- Redux
- Redux Toolkit
- Redux Saga
- Zustand
- MobX
- Recoil

Interview Questions

- Redux Flow
- Middleware
- Saga vs Thunk
- Redux Toolkit advantages

---

# 10. Networking

Topics

- Fetch API
- Axios
- GraphQL
- REST API
- Authentication
- JWT
- Refresh Tokens
- Retry Logic

Interview Questions

- Axios interceptors
- Token refresh
- Error handling

---

# 11. Storage

Topics

- AsyncStorage
- MMKV
- Secure Storage
- SQLite
- Realm

Interview Questions

- AsyncStorage limitations
- MMKV advantages
- Secure storage

---

# 12. Performance Optimization

Topics

- React.memo
- useMemo
- useCallback
- Lazy Loading
- Code Splitting
- Image Optimization
- FlatList Optimization

Interview Questions

- Why unnecessary re-render happens?
- How to optimize FlatList?
- Windowing
- getItemLayout
- keyExtractor

---

# 13. Deep Linking

Topics

- Custom URL Scheme
- Universal Links
- Android App Links
- Linking API
- getInitialURL()
- addEventListener()

Interview Questions

- How deep linking works?
- Universal Links vs Custom Scheme

---

# 14. Push Notifications

Topics

- Firebase Cloud Messaging
- APNs
- Notification Permissions
- Local Notifications
- Background Notifications

Libraries

- @react-native-firebase/messaging
- Notifee

Interview Questions

- Foreground notification
- Background notification
- Token management

---

# 15. Native Modules

Topics

- Android Native Module
- iOS Native Module
- Turbo Modules
- Native UI Components

Interview Questions

- When do you create native modules?
- Bridge communication

---

# 16. Permissions

Topics

- Camera
- Location
- Contacts
- Storage
- Notifications

Library

- react-native-permissions

Interview Questions

- Runtime permissions
- Android 13 notification permission

---

# 17. Security

Topics

- SSL Pinning
- Root Detection
- Jailbreak Detection
- Certificate Pinning
- Secure Storage
- Obfuscation

Interview Questions

- How do you secure API?
- Token storage best practices

---

# 18. Animations

Topics

- Animated API
- LayoutAnimation
- Reanimated
- Gesture Handler

Interview Questions

- Animated vs Reanimated
- Native Driver

---

# 19. Testing

Topics

- Jest
- React Native Testing Library
- Detox

Interview Questions

- Unit Testing
- Integration Testing
- E2E Testing

---

# 20. Debugging

Tools

- React DevTools
- Flipper
- Hermes Debugger
- Chrome DevTools

Interview Questions

- Debug production crash
- Memory leaks

---

# 21. Build & Release

Android

- APK
- AAB
- Proguard
- Signing

iOS

- Archive
- TestFlight
- App Store

CI/CD

- Fastlane
- GitHub Actions

Interview Questions

- Difference between APK and AAB
- Release process

---

# 22. Architecture

Topics

- MVC
- MVVM
- Clean Architecture
- Feature-based Structure

Folder Structure

```
src/
    api/
    assets/
    components/
    hooks/
    navigation/
    redux/
    screens/
    services/
    utils/
```

Interview Questions

- How do you organize a large project?

---

# 23. Common Interview Questions

## Beginner

- What is React Native?
- Difference between React and React Native?
- What is JSX?
- Explain Flexbox.
- Explain Hooks.

---

## Intermediate

- FlatList optimization
- Redux flow
- Navigation lifecycle
- AsyncStorage
- Deep Linking
- Push Notifications

---

## Advanced

- Hermes
- Fabric
- Turbo Modules
- JSI
- Memory leaks
- Performance optimization
- Offline-first architecture
- Background tasks
- Native modules

---

# 24. Coding Challenges

Practice

- Login Screen
- Infinite Pagination
- Debounce Search
- OTP Screen
- Theme Switcher
- Shopping Cart
- Todo App
- Expense Tracker
- Chat UI
- Image Upload
- Pull to Refresh
- Infinite Scroll

---

# 25. Best Practices

## Folder Structure

- Feature-based architecture
- Reusable components
- Custom hooks
- API service layer

## Coding

- Avoid inline functions
- Memoize expensive calculations
- Use React.memo
- Keep components small
- Handle loading/error states
- Write reusable hooks

## Performance

- Avoid unnecessary renders
- Optimize FlatList
- Cache images
- Lazy load screens

## Security

- Never store secrets
- Secure token storage
- Validate API responses
- Enable SSL pinning for sensitive apps

---

# React Native Libraries to Know

## Navigation

- React Navigation

## Networking

- Axios
- React Query

## State Management

- Redux Toolkit
- Redux Saga
- Zustand

## Forms

- React Hook Form
- Formik

## Validation

- Yup
- Zod

## Storage

- MMKV
- AsyncStorage

## Animation

- Reanimated
- Gesture Handler

## Notifications

- Firebase Messaging
- Notifee

## Authentication

- Firebase Auth
- Auth0

## Image

- react-native-fast-image
- react-native-image-picker

## Charts

- react-native-gifted-charts

---

# System Design Topics

- Authentication Flow
- Offline First
- API Layer
- Cache Strategy
- Pagination
- Infinite Scroll
- File Upload
- Background Sync
- Push Notification Architecture
- Deep Linking Architecture

---

# HR Interview Questions

- Tell me about yourself.
- Describe your React Native experience.
- Explain your most challenging project.
- How do you debug production issues?
- Describe a performance optimization you implemented.
- Explain a difficult bug you solved.
- Why are you looking for a new opportunity?
- Where do you see yourself in five years?

---

# Daily Practice Plan

## Week 1

- JavaScript
- ES6
- React Fundamentals

## Week 2

- React Native Components
- Navigation
- Hooks

## Week 3

- Redux
- Networking
- Storage

## Week 4

- Performance
- Native Modules
- Deep Linking
- Push Notifications

## Week 5

- System Design
- Mock Interviews
- Coding Challenges
- Revision

---

# Final Interview Checklist

- JavaScript Fundamentals
- React Fundamentals
- React Hooks
- React Native Architecture
- Navigation
- Redux / State Management
- API Integration
- Storage
- Deep Linking
- Push Notifications
- Performance Optimization
- Animations
- Permissions
- Security
- Testing
- Debugging
- Build & Release
- Native Modules
- System Design
- HR Questions
