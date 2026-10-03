# Phase 19 - Frontend Coding Round — Questions & Answers

# JavaScript Coding

### Q366. Debounce Implementation
Runs `fn` only after `delay` ms of no new calls.
```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Q367. Throttle Implementation
Runs `fn` at most once per `limit` ms.
```js
function throttle(fn, limit) {
  let waiting = false;
  return function (...args) {
    if (waiting) return;
    fn.apply(this, args);
    waiting = true;
    setTimeout(() => (waiting = false), limit);
  };
}
```

### Q368. Polyfill for map
```js
Array.prototype.myMap = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) out[i] = cb.call(thisArg, this[i], i, this);
  }
  return out;
};
```

### Q369. Polyfill for filter
```js
Array.prototype.myFilter = function (cb, thisArg) {
  const out = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && cb.call(thisArg, this[i], i, this)) out.push(this[i]);
  }
  return out;
};
```

### Q370. Polyfill for reduce
```js
Array.prototype.myReduce = function (cb, initial) {
  let acc = initial, start = 0;
  if (arguments.length < 2) {
    if (!this.length) throw new TypeError('Reduce of empty array with no initial value');
    acc = this[0]; start = 1;
  }
  for (let i = start; i < this.length; i++) acc = cb(acc, this[i], i, this);
  return acc;
};
```

### Q371. Promise.all Implementation
Resolves with an array of results (in order); rejects on the first rejection.
```js
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let done = 0;
    if (!promises.length) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        results[i] = v;
        if (++done === promises.length) resolve(results);
      }, reject);
    });
  });
}
```

### Q372. Promise.race Implementation
Settles as soon as the first promise settles.
```js
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
}
```

---

# React Coding

### Q373. Build Modal Component
```jsx
import { createPortal } from 'react-dom';
import { useEffect, useRef } from 'react';

function Modal({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    ref.current?.focus();
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={ref}
           className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
```
Mention: portal, Esc to close, focus management, backdrop click, ARIA roles.

### Q374. Build Accordion Component
```jsx
function Accordion({ items }) {
  const [openId, setOpenId] = useState(null);
  return items.map(({ id, title, content }) => (
    <div key={id}>
      <button aria-expanded={openId === id} onClick={() => setOpenId(openId === id ? null : id)}>
        {title}
      </button>
      {openId === id && <div>{content}</div>}
    </div>
  ));
}
```
Variation: allow multiple open by using a `Set` in state.

### Q375. Build Tabs Component
```jsx
function Tabs({ tabs }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div role="tablist">
        {tabs.map((t, i) => (
          <button key={t.label} role="tab" aria-selected={i === active} onClick={() => setActive(i)}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tabs[active].content}</div>
    </>
  );
}
```
Bonus: arrow-key navigation between tabs.

### Q376. Infinite Scroll Component
```jsx
function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const sentinel = useRef(null);

  useEffect(() => {
    fetch(`/api/items?page=${page}`).then(r => r.json()).then(data => {
      setItems(prev => [...prev, ...data.items]);
      setHasMore(data.items.length > 0);
    });
  }, [page]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && hasMore) setPage(p => p + 1);
    });
    if (sentinel.current) obs.observe(sentinel.current);
    return () => obs.disconnect();
  }, [hasMore]);

  return (<>{items.map(i => <div key={i.id}>{i.name}</div>)}<div ref={sentinel} /></>);
}
```
Mention: loading state, avoid duplicate fetches, virtualization for huge lists, abort stale requests.

### Q377. Search Filter Component
```jsx
function SearchList({ data }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => data.filter(d => d.name.toLowerCase().includes(query.toLowerCase())),
    [data, query]
  );
  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      <ul>{filtered.map(d => <li key={d.id}>{d.name}</li>)}</ul>
    </>
  );
}
```
For API search, debounce the query (see Phase 16, Q336).

### Q378. Pagination Component
```jsx
function Paginated({ items, pageSize = 10 }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);
  const current = items.slice((page - 1) * pageSize, page * pageSize);
  return (
    <>
      <ul>{current.map(i => <li key={i.id}>{i.name}</li>)}</ul>
      <button disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
      <span>{page} / {totalPages}</span>
      <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
    </>
  );
}
```

### Q379. Theme Switcher
```jsx
const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return <ThemeContext value={{ theme, toggle }}>{children}</ThemeContext>;
}
// CSS: [data-theme='dark'] { --bg: #111; --text: #eee; }
```

### Q380. Todo Application
```jsx
function Todo() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const add = () => {
    if (!text.trim()) return;
    setTodos(t => [...t, { id: crypto.randomUUID(), text, done: false }]);
    setText('');
  };
  const toggle = id => setTodos(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const remove = id => setTodos(t => t.filter(x => x.id !== id));

  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && add()} />
      <button onClick={add}>Add</button>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
            <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
            <button onClick={() => remove(t.id)}>✕</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```
Extras to mention: persistence, filters (all/active/done), edit, `useReducer`.

### Q381. Form Validation
```jsx
function SignupForm() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const validate = (v) => {
    const e = {};
    if (!/^\S+@\S+\.\S+$/.test(v.email)) e.email = 'Invalid email';
    if (v.password.length < 8) e.password = 'Min 8 characters';
    return e;
  };
  const onChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));
  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length === 0) console.log('submit', values);
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <input name="email" value={values.email} onChange={onChange} aria-invalid={!!errors.email} />
      {errors.email && <p role="alert">{errors.email}</p>}
      <input name="password" type="password" value={values.password} onChange={onChange} aria-invalid={!!errors.password} />
      {errors.password && <p role="alert">{errors.password}</p>}
      <button>Sign up</button>
    </form>
  );
}
```
In real projects: React Hook Form + Zod/Yup; validate on blur, show errors accessibly.
