# React Native Interview Preparation (5.7 Years) - Questions Only

## Phase 1: React Native Architecture

### React Native Fundamentals

1. What is React Native?
2. How does React Native differ from React.js?
3. What are the advantages of React Native?
4. What are the limitations of React Native?
5. Why would a company choose React Native over Native Android/iOS development?

### React Native Architecture

6. Explain React Native Architecture.
7. What are the main layers in React Native Architecture?
8. What is the JavaScript Thread?
9. What is the UI Thread?
10. What is the Native Thread?
11. How does React Native communicate with Native Code?
12. What is the React Native Bridge?
13. Why was the Bridge introduced?
14. What are the limitations of the Bridge?
15. What happens when JavaScript calls a Native Module?

### React Native New Architecture

16. Why was the New Architecture introduced?
17. What is JSI (JavaScript Interface)?
18. How is JSI different from Bridge?
19. What problems does JSI solve?
20. What are TurboModules?
21. What are the benefits of TurboModules?
22. How are TurboModules different from Native Modules?
23. What is lazy loading in TurboModules?
24. What is Fabric?
25. What problems does Fabric solve?
26. How does Fabric improve UI rendering?
27. Explain the complete flow of the New Architecture.
28. What are the benefits of React Native's New Architecture?

---

## Phase 2: Expo vs React Native CLI

29. What is Expo?
30. What is React Native CLI?
31. What are the differences between Expo and React Native CLI?
32. What are the advantages of Expo?
33. What are the disadvantages of Expo?
34. What are the advantages of React Native CLI?
35. What are the disadvantages of React Native CLI?
36. What is Expo Go?
37. How does Expo Go work?
38. What is EAS Build?
39. What are OTA (Over-The-Air) Updates?
40. How do OTA updates work in Expo?
41. What is Expo Prebuild?
42. What happens after running `expo prebuild`?
43. Can Expo use Native Modules?
44. What is the difference between Expo Managed Workflow and Bare Workflow?
45. When would you choose Expo?
46. When would you choose React Native CLI?
47. Which would you choose for a Banking Application and why?
48. Which would you choose for an MVP and why?

---

## Phase 3: FlatList & Optimization

### FlatList Basics

49. What is FlatList?
50. Why do we use FlatList instead of map()?
51. What problems does FlatList solve?
52. What is Virtualization?
53. What is Windowing?
54. How does FlatList improve performance?

### FlatList Optimization

55. How do you optimize FlatList?
56. Why should renderItem be memoized?
57. Why should item components use React.memo?
58. What is keyExtractor?
59. Why is keyExtractor important?
60. Why should index not be used as a key?
61. What is getItemLayout?
62. When should getItemLayout be used?
63. How does getItemLayout improve performance?
64. What is initialNumToRender?
65. What is maxToRenderPerBatch?
66. What is windowSize?
67. What is removeClippedSubviews?
68. How does removeClippedSubviews improve performance?
69. What is ListHeaderComponent?
70. How can ListHeaderComponent be optimized?
71. What is ListFooterComponent?

### Pagination

72. What is pagination?
73. Why is pagination important?
74. What is infinite scrolling?
75. What is onEndReached?
76. How does onEndReached work?
77. What is onEndReachedThreshold?
78. How is onEndReachedThreshold calculated?
79. What happens when onEndReachedThreshold is set to 0?
80. What happens when onEndReachedThreshold is set to 0.5?
81. What happens when onEndReachedThreshold is set to 1?
82. Why does onEndReached sometimes trigger multiple times?
83. How can duplicate API calls be prevented?
84. Why does onEndReached sometimes trigger on initial render?
85. How would you implement production-ready pagination in FlatList?

### Advanced FlatList

86. What is FlashList?
87. How is FlashList different from FlatList?
88. When would you choose FlashList over FlatList?
89. What are the benefits of FlashList?
90. How would you handle 10,000+ records efficiently in React Native?

---

## Senior-Level Scenario Questions

91. FlatList is lagging with 5,000 records. How would you optimize it?
92. Users report slow scrolling on Android. How would you investigate?
93. API calls are firing multiple times during pagination. How would you fix it?
94. Memory usage is increasing while scrolling. How would you debug it?
95. A list contains images and performance is poor. How would you optimize it?
96. What are the most common FlatList performance mistakes?
97. What React Native architecture changes have you worked with recently?
98. Have you worked with the New Architecture? Explain your experience.
99. What are the biggest performance bottlenecks in React Native applications?
100. How would you improve startup time in a React Native application?
