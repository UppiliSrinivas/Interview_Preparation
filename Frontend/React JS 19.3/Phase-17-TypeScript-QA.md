# Phase 17 - TypeScript — Questions & Answers

# Fundamentals

### Q338. What is TypeScript?
A typed superset of JavaScript that compiles to plain JS. It adds static types, checked at build time.

### Q339. Benefits of TypeScript
Catches bugs before runtime, better autocomplete and refactoring, self-documenting code, safer large-scale codebases, and easier team collaboration.

### Q340. Types
```ts
let name: string = 'Nivas';
let age: number = 30;
let ok: boolean = true;
let ids: number[] = [1, 2];
let pair: [string, number] = ['a', 1];   // tuple
let anything: unknown;                    // safer than any
function greet(n: string): void {}
```
Also: `enum`, `any`, `never`, `null`, `undefined`.

### Q341. Interfaces
Describe the shape of objects; can be extended and merged.
```ts
interface User { id: number; name: string; email?: string }
interface Admin extends User { role: 'admin' }
```

### Q342. Type vs Interface
| type | interface |
|---|---|
| Can alias unions, primitives, tuples | Object shapes only |
| No declaration merging | Supports declaration merging |
| Combine with `&` | Extend with `extends` |
Both work for objects; many teams use `interface` for object APIs and `type` for unions/utilities.

---

# Advanced Types

### Q343. Generics
Reusable types that work with different data types.
```ts
function first<T>(arr: T[]): T { return arr[0]; }
first<number>([1, 2]);          // 1
interface ApiResponse<T> { data: T; error?: string }
```

### Q344. Utility Types
Built-in helpers:
```ts
Partial<User>        // all optional
Required<User>       // all required
Pick<User, 'id'>     // only id
Omit<User, 'email'>  // without email
Readonly<User>
Record<string, number>
ReturnType<typeof fn>
```

### Q345. Union Types
A value can be one of several types.
```ts
type Status = 'idle' | 'loading' | 'error';
let id: string | number;
```

### Q346. Intersection Types
Combine multiple types into one that has all members.
```ts
type Employee = Person & { company: string };
```

### Q347. Type Guards
Narrow a type at runtime.
```ts
function print(x: string | number) {
  if (typeof x === 'string') x.toUpperCase();   // typeof
}
const isUser = (v: any): v is User => 'id' in v; // custom guard
// also: instanceof, `in`, discriminated unions
```

---

# React with TypeScript

### Q348. Typing Props
```tsx
interface ButtonProps { label: string; onClick: () => void; disabled?: boolean; children?: React.ReactNode }
function Button({ label, onClick, disabled }: ButtonProps) { return <button onClick={onClick} disabled={disabled}>{label}</button>; }
```

### Q349. Typing State
```tsx
const [user, setUser] = useState<User | null>(null);
const [items, setItems] = useState<string[]>([]);
```

### Q350. Typing Hooks
```tsx
const ref = useRef<HTMLInputElement>(null);
const [state, dispatch] = useReducer(reducer, init); // reducer typed with Action union
const handle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {}, []);
```
Custom hook: annotate params and return type (or `as const` for tuples).

### Q351. Typing Context
```tsx
interface AuthCtx { user: User | null; login: (u: User) => void }
const AuthContext = createContext<AuthCtx | undefined>(undefined);
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
```

### Q352. Typing Redux Toolkit
```ts
export const store = configureStore({ reducer: { counter: counterReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// slice: PayloadAction<number>
```
