# Phase 9 - Testing — Questions & Answers

### Q117. Unit Testing
Testing the smallest pieces (a function, hook, or a single component) in isolation, with dependencies mocked. Fast and precise.

### Q118. Integration Testing
Testing several units working together (e.g., a form + validation + API call + success message). Gives more confidence about real behavior.

### Q119. Jest
A JavaScript test runner with assertions, mocking, snapshots, coverage, and watch mode.
```js
test('adds', () => { expect(1 + 2).toBe(3); });
```
(Vitest is a Jest-compatible alternative for Vite projects.)

### Q120. React Testing Library
Tests components the way **users** use them — by querying rendered output (roles, text, labels) rather than internals.
```jsx
render(<Counter />);
await userEvent.click(screen.getByRole('button', { name: /increment/i }));
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```
Query priority: `getByRole` > `getByLabelText` > `getByText` > `getByTestId`.

### Q121. Mock Functions
Fake functions that record calls and return controlled values.
```js
const onSave = jest.fn();
render(<Form onSave={onSave} />);
// ...submit
expect(onSave).toHaveBeenCalledWith({ name: 'A' });
```

### Q122. Mock API Calls
Prefer **MSW (Mock Service Worker)** to intercept network requests; or mock `fetch`/axios with Jest.
```js
global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ id: 1 }) }));
```

### Q123. Snapshot Testing
Saves rendered output and compares it on later runs.
```js
expect(container).toMatchSnapshot();
```
Good for small stable output; brittle for large components, so don't overuse.

### Q124. Testing Hooks
Use `renderHook` from React Testing Library.
```js
const { result } = renderHook(() => useToggle());
act(() => result.current[1]());
expect(result.current[0]).toBe(true);
```

### Q125. `act()`
Ensures all React updates (state changes, effects) triggered by an action are processed before assertions run. RTL wraps most things in `act` automatically; use it manually for direct state-changing calls (like in `renderHook`).
