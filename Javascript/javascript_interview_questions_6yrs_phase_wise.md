# JavaScript Interview Questions – Phase-wise Preparation for 6 Years Frontend Engineer

Source reference: https://github.com/sudheerj/javascript-interview-questions

> This file is curated from the JavaScript interview question collection and organized for a 6-year frontend engineer. Start from Phase 1 and move phase by phase. For each question, prepare: definition, real-time use case, code example, edge cases, and interview-level explanation.

---

## Phase 1 – JavaScript Fundamentals & Execution Basics

**Goal:** Build strong clarity on JS basics, runtime behavior, and core syntax.

1. What is JavaScript?
2. What are the data types supported by JavaScript?
3. What is the difference between primitive and non-primitive data types?
4. What is the difference between `null` and `undefined`?
5. What is the difference between `==` and `===`?
6. What is type coercion in JavaScript?
7. What are truthy and falsy values?
8. What is `NaN` and how do you check it correctly?
9. What is the difference between `isNaN()` and `Number.isNaN()`?
10. What is the difference between `var`, `let`, and `const`?
11. What is hoisting in JavaScript?
12. Are `let` and `const` hoisted?
13. What is the Temporal Dead Zone?
14. What is strict mode in JavaScript?
15. What are undeclared and undefined variables?
16. What is variable shadowing?
17. What is the difference between global scope, function scope, and block scope?
18. What is the difference between pass by value and pass by reference?
19. Why is JavaScript called a dynamically typed language?
20. What is the difference between mutable and immutable values?

---

## Phase 2 – Functions, Scope, Closures & `this`

**Goal:** Master function behavior, closures, execution context, and `this` binding.

21. What is a function declaration?
22. What is a function expression?
23. What is an anonymous function?
24. What is an arrow function?
25. What are the differences between normal functions and arrow functions?
26. What is the `arguments` object?
27. Why do arrow functions not have their own `arguments` object?
28. What is a callback function?
29. What is a higher-order function?
30. What is a first-class function?
31. What is a closure?
32. What are practical use cases of closures?
33. What is lexical scope?
34. What is scope chaining?
35. What is the difference between lexical scope and dynamic scope?
36. What is the `this` keyword in JavaScript?
37. How does `this` behave in global scope?
38. How does `this` behave inside normal functions?
39. How does `this` behave inside arrow functions?
40. What is the difference between `call`, `apply`, and `bind`?
41. What is function currying?
42. What is partial application?
43. What is an Immediately Invoked Function Expression?
44. What is recursion?
45. What is tail call optimization?

---

## Phase 3 – Objects, Prototypes & Object APIs

**Goal:** Understand object internals, prototypes, inheritance, and important object methods.

46. What is an object in JavaScript?
47. How do you create objects in JavaScript?
48. What is the difference between dot notation and bracket notation?
49. What are object property descriptors?
50. What is the difference between writable, enumerable, and configurable properties?
51. What is `Object.defineProperty()`?
52. What is `Object.keys()`?
53. What is `Object.values()`?
54. What is `Object.entries()`?
55. What is `Object.assign()`?
56. What is the difference between shallow copy and deep copy?
57. What is `Object.freeze()`?
58. What is `Object.seal()`?
59. What is the difference between `Object.freeze()` and `Object.seal()`?
60. What is `Object.create()`?
61. What is a prototype?
62. What is prototype chaining?
63. What is the difference between `__proto__` and `prototype`?
64. How does inheritance work in JavaScript?
65. What is constructor function inheritance?
66. What is the difference between own property and inherited property?
67. What is `hasOwnProperty()`?
68. What is the difference between `in` operator and `hasOwnProperty()`?
69. How do you clone an object safely?
70. What are the limitations of `JSON.parse(JSON.stringify(obj))` for cloning?

---

## Phase 4 – Arrays, Strings, Maps, Sets & Data Handling

**Goal:** Prepare for day-to-day frontend data transformation questions.

71. What are arrays in JavaScript?
72. What is the difference between `map`, `filter`, and `reduce`?
73. What is the difference between `forEach` and `map`?
74. What is the difference between `find` and `filter`?
75. What is the difference between `some` and `every`?
76. What is the difference between `slice` and `splice`?
77. What is the difference between `push`, `pop`, `shift`, and `unshift`?
78. What are sparse arrays?
79. What happens when you use `delete` on an array element?
80. How do you flatten an array?
81. How do you remove duplicates from an array?
82. What is array destructuring?
83. What are rest and spread operators?
84. What is the difference between rest and spread?
85. What is a Set?
86. What is a Map?
87. What is the difference between Map and Object?
88. What is a WeakMap?
89. What is a WeakSet?
90. What is the difference between Map and WeakMap?
91. What is the difference between Set and WeakSet?
92. What are template literals?
93. What are tagged templates?
94. What are common string methods used in JavaScript?
95. How do you compare strings safely?

---

## Phase 5 – Asynchronous JavaScript & Event Loop

**Goal:** Master the most important frontend interview area: async behavior.

96. What is asynchronous programming in JavaScript?
97. What is a callback?
98. What is callback hell?
99. What is a Promise?
100. What are the three states of a Promise?
101. Why do we need Promises?
102. What is Promise chaining?
103. What is `Promise.resolve()`?
104. What is `Promise.reject()`?
105. What is `Promise.all()`?
106. What is `Promise.allSettled()`?
107. What is `Promise.race()`?
108. What is `Promise.any()`?
109. What is the difference between `Promise.all()` and `Promise.allSettled()`?
110. What is async/await?
111. How do you handle errors in async/await?
112. What is the event loop?
113. What is the call stack?
114. What is the callback queue?
115. What is the microtask queue?
116. What is the difference between microtask and macrotask?
117. What is the output order of `setTimeout`, Promise, and synchronous code?
118. What is the difference between `setTimeout` and `setInterval`?
119. What is the difference between debounce and throttle?
120. How do you cancel an API request in JavaScript?

---

## Phase 6 – Browser APIs, DOM, BOM & Storage

**Goal:** Prepare for browser-based frontend engineering questions.

121. What is the DOM?
122. What is the difference between DOM and BOM?
123. What is event bubbling?
124. What is event capturing?
125. What is event delegation?
126. What is `event.preventDefault()`?
127. What is `event.stopPropagation()`?
128. What is the difference between `target` and `currentTarget`?
129. What is the difference between `window`, `document`, and `screen`?
130. What is localStorage?
131. What is sessionStorage?
132. What is the difference between cookie, localStorage, and sessionStorage?
133. Why do we need cookies?
134. How do you create, read, update, and delete cookies?
135. What are cookie options like expiry and path?
136. What is a storage event?
137. What is IndexedDB?
138. What is Web Worker?
139. What are the restrictions of Web Workers?
140. What is postMessage?
141. What is CORS?
142. What is same-origin policy?
143. What is a service worker?
144. What is browser caching?
145. What is critical rendering path?

---

## Phase 7 – ES6+ and Modern JavaScript Features

**Goal:** Strengthen modern JavaScript concepts used in React and modern frontend projects.

146. What are ES6 modules?
147. What is the difference between default export and named export?
148. What is destructuring assignment?
149. What are default parameters?
150. What are template literals?
151. What are computed property names?
152. What are object shorthand properties?
153. What are classes in JavaScript?
154. What is the difference between class and constructor function?
155. What are static methods?
156. What are private class fields?
157. What is optional chaining?
158. What is nullish coalescing?
159. What is the difference between `||` and `??`?
160. What are generators?
161. What is the `yield` keyword?
162. What are iterators?
163. What is the iterable protocol?
164. What are Symbols?
165. What is BigInt?
166. What is dynamic import?
167. What is top-level await?
168. What is `structuredClone()`?
169. What are logical assignment operators?
170. What is the pipeline operator proposal?

---

## Phase 8 – Error Handling, Security & Web Performance

**Goal:** Prepare senior-level frontend questions beyond syntax.

171. What is error handling in JavaScript?
172. What is the difference between `throw`, `try`, `catch`, and `finally`?
173. What is a custom error?
174. What is the difference between syntax error, reference error, and type error?
175. How do you handle global JavaScript errors?
176. What is `window.onerror`?
177. What is unhandled promise rejection?
178. How do you handle API failures gracefully?
179. What is XSS?
180. How can JavaScript code prevent XSS?
181. What is CSRF?
182. What is CORS security?
183. What is Content Security Policy?
184. Why is `eval()` dangerous?
185. What are memory leaks in JavaScript?
186. What causes memory leaks in frontend applications?
187. How do you detect memory leaks in the browser?
188. What is garbage collection?
189. What are strong and weak references?
190. How do WeakMap and WeakSet help garbage collection?
191. What is tree shaking?
192. What is code splitting?
193. What is lazy loading?
194. What is debouncing used for in performance optimization?
195. What is throttling used for in performance optimization?

---

## Phase 9 – Advanced JavaScript Output-based Questions

**Goal:** Practice tricky output questions commonly asked for experienced frontend engineers.

196. What is the output of code using function hoisting before declaration?
197. What is the output of code using `let x = y = 0` inside a function?
198. What is the output order of synchronous logs and `setTimeout(..., 0)`?
199. Why does `0.1 + 0.2 === 0.3` return false?
200. What is the output when a function expression is used inside an `if` condition?
201. What happens when `return` is placed before an object literal on the next line?
202. What is the output after deleting an array element using `delete arr[index]`?
203. What is the output of sparse arrays in modern browsers?
204. What is the output of object method shorthand calls?
205. What is the output of `1 < 2 < 3` and `3 > 2 > 1`?
206. What happens when duplicate parameters are used in non-strict mode?
207. What happens when duplicate parameters are used in arrow functions?
208. What happens when arrow functions access `arguments`?
209. What is the output of `Math.max()`?
210. What is the output of `typeof null`?
211. What is the output of `typeof NaN`?
212. What is the output of `[] + []`, `[] + {}`, and `{ } + []`?
213. What is the output of `true + false`?
214. What is the output of `typeof typeof 1`?
215. What is the output of comparing objects and arrays by reference?

---

## Phase 10 – Senior Frontend JavaScript System-level Questions

**Goal:** Prepare for 6-year frontend engineer discussions, architecture, debugging, and production use cases.

216. How does JavaScript execution context work?
217. What is the difference between creation phase and execution phase?
218. How does hoisting work internally?
219. How does the event loop affect React rendering and browser responsiveness?
220. How do you optimize expensive JavaScript operations in the browser?
221. How do you avoid blocking the main thread?
222. When should you use Web Workers?
223. How do you design a debounce function from scratch?
224. How do you design a throttle function from scratch?
225. How do you implement custom `Promise.all()`?
226. How do you implement custom `Array.prototype.map()`?
227. How do you implement custom `Array.prototype.filter()`?
228. How do you implement custom `Array.prototype.reduce()`?
229. How do you implement deep clone?
230. How do you implement memoization?
231. How do you implement currying?
232. How do you implement event emitter/pub-sub?
233. How do you handle race conditions in API calls?
234. How do you prevent duplicate API calls?
235. How do you retry failed API calls?
236. How do you cancel stale API requests?
237. How do you handle large JSON data in the frontend?
238. How do you improve JavaScript bundle performance?
239. How do you debug production JavaScript errors?
240. How do you explain JavaScript memory management in an interview?

---

## Suggested Preparation Order

1. **Day 1–3:** Phase 1 and Phase 2
2. **Day 4–6:** Phase 3 and Phase 4
3. **Day 7–10:** Phase 5 deeply with code examples
4. **Day 11–13:** Phase 6 and browser APIs
5. **Day 14–16:** Phase 7 modern JS
6. **Day 17–19:** Phase 8 performance/security
7. **Day 20–23:** Phase 9 output-based questions
8. **Day 24–30:** Phase 10 senior-level implementation and architecture questions

---

## How to Prepare Each Question

For every question, prepare in this structure:

```md
### Question

### Simple Explanation

### Real-time Frontend Use Case

### Code Example

### Common Mistake

### Senior-level Interview Answer
```

---

## High Priority for 6 Years Frontend Engineer

Focus extra on:

- Closures
- Hoisting
- Event loop
- Promises
- Async/await
- `this`, call, apply, bind
- Prototype and inheritance
- Debounce/throttle
- Shallow vs deep copy
- Memory leaks
- Browser storage
- Event delegation
- Web Workers
- JavaScript performance
- Output-based tricky questions
- Polyfills and custom implementations
