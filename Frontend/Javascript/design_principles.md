# Top Design Principles for Product-Based Company Interviews

## Why These Principles Matter

Product-based companies expect engineers to write scalable, maintainable, testable, and reusable code. These principles help you design better frontend and backend applications and are commonly discussed in LLD, HLD, React, JavaScript, and System Design interviews.



# 1. SOLID Principles ⭐⭐⭐⭐⭐

SOLID is a set of five object-oriented design principles that improve maintainability and scalability.

### S - Single Responsibility Principle (SRP)

A class or function should have only one reason to change.

```js
class UserService {
  saveUser() {}
}

class EmailService {
  sendEmail() {}
}
```

### O - Open/Closed Principle (OCP)

Software entities should be open for extension but closed for modification.

### L - Liskov Substitution Principle (LSP)

Derived classes should be replaceable with their base classes without breaking functionality.

### I - Interface Segregation Principle (ISP)

Clients should not be forced to depend on methods they don't use.

### D - Dependency Inversion Principle (DIP)

Depend on abstractions, not concrete implementations.

```js
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }
}
```



# 2. DRY (Don't Repeat Yourself) ⭐⭐⭐⭐⭐

Avoid duplicating logic.

❌ Bad

```js
const tax1 = salary * 0.1;
const tax2 = income * 0.1;
```

✅ Good

```js
function calculateTax(amount) {
  return amount * 0.1;
}
```



# 3. KISS (Keep It Simple, Stupid) ⭐⭐⭐⭐⭐

Prefer simple and readable solutions.

❌ Bad

```js
if (isLoggedIn === true) {}
```

✅ Good

```js
if (isLoggedIn) {}
```



# 4. Separation of Concerns (SoC) ⭐⭐⭐⭐⭐

Separate UI, business logic, and API layers.

```text
UI Layer
    ↓
Custom Hooks
    ↓
Service Layer
    ↓
API Layer
```

Example React Folder Structure:

```text
src/
├── components/
├── hooks/
├── services/
├── utils/
├── pages/
```



# 5. Composition Over Inheritance ⭐⭐⭐⭐⭐

Prefer composing smaller pieces over extending classes.

❌ Inheritance

```js
class Admin extends User {}
```

✅ Composition

```jsx
<User role="admin" />
```

```jsx
<Modal>
  <UserForm />
</Modal>
```

React heavily relies on composition.



# 6. High Cohesion & Low Coupling ⭐⭐⭐⭐

## High Cohesion

Each module should focus on one responsibility.

```js
UserService
```

Handles only user-related operations.

## Low Coupling

Modules should have minimal dependencies on each other.

```text
AuthService
      ↓
UserService
```

Loose coupling improves maintainability and testing.



# 7. Dependency Injection (DI) ⭐⭐⭐⭐

Pass dependencies from outside instead of creating them internally.

❌ Bad

```js
class UserService {
  constructor() {
    this.api = new Axios();
  }
}
```

✅ Good

```js
class UserService {
  constructor(api) {
    this.api = api;
  }
}
```

Benefits:

* Easier testing
* Better flexibility
* Reduced coupling



# 8. YAGNI (You Aren't Gonna Need It) ⭐⭐⭐⭐

Do not build features until they are actually needed.

❌ Bad

```text
Building:
- AI Support
- Offline Mode
- Multi-language
```

Before users need them.

✅ Good

Build only current business requirements.



# 9. Encapsulation ⭐⭐⭐

Hide internal implementation details.

```js
class Counter {
  #count = 0;

  increment() {
    this.#count++;
  }
}
```

Benefits:

* Better security
* Easier maintenance
* Cleaner APIs



# 10. Law of Demeter ⭐⭐⭐

A module should only communicate with its immediate dependencies.

❌ Bad

```js
user.profile.address.city.name
```

✅ Good

```js
user.getCityName()
```

Reduces coupling and complexity.



# Interview Priority Order

## Must Know (Asked Frequently)

1. SOLID Principles
2. DRY
3. KISS
4. Separation of Concerns
5. Composition Over Inheritance
6. High Cohesion & Low Coupling



## Good to Know

7. Dependency Injection
8. YAGNI
9. Encapsulation
10. Law of Demeter



# 30-Second Interview Answer

> In frontend applications, I focus on SOLID principles, DRY, KISS, and Separation of Concerns to create scalable and maintainable code. In React, I prefer Composition over Inheritance and aim for high cohesion with low coupling. These principles improve readability, reusability, testability, and long-term maintainability of large applications.
