# Forms Interview Questions: Formik, React Hook Form & Zod

Basics to senior questions on React form handling and schema validation, each with the answer an interviewer is listening for.

**Quick positioning**
- **React Hook Form (RHF):** the modern default. Uncontrolled inputs and minimal re-renders.
- **Formik:** still common in older codebases. Controlled inputs and simpler mental model, but heavier re-renders and slower maintenance.
- **Zod:** TypeScript-first schema validation. One schema gives you runtime validation *and* static types, and it can be shared between frontend and backend.

---

## Table of Contents

1. [Formik (Q1–6)](#formik)
2. [React Hook Form (Q7–15)](#react-hook-form)
3. [Zod (Q16–21)](#zod)
4. [Integration & Architecture (Q22–25)](#integration--architecture)
5. [Practical Extras (Q26–29)](#practical-extras)

---

## Formik

### 1. What is Formik, and what problem does it solve?
A library that manages form values, validation, errors, touched state, and submission so you don't wire up `useState` for every field. It uses **controlled inputs**: every keystroke updates Formik's state.

### 2. `useFormik` vs `<Formik>` with `<Field>`: what's the difference?
- **`useFormik`:** a hook. You wire inputs manually. Fine for small forms, but it doesn't support `<Field>`, `<FieldArray>`, or context.
- **`<Formik>` + `<Form>` + `<Field>`:** the component API with context, so nested fields can access form state.

```jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';

<Formik
  initialValues={{ email: '' }}
  validate={(values) => (values.email ? {} : { email: 'Required' })}
  onSubmit={async (values) => { await save(values); }}
>
  {({ isSubmitting }) => (
    <Form>
      <Field name="email" type="email" />
      <ErrorMessage name="email" component="p" />
      <button type="submit" disabled={isSubmitting}>Save</button>
    </Form>
  )}
</Formik>
```

### 3. How does validation work in Formik?
Two options:
- **`validate` function:** return an errors object.
- **`validationSchema`:** pass a Yup schema (native support). For Zod, use an adapter such as `toFormikValidationSchema` from `zod-formik-adapter`, or call `schema.safeParse()` inside `validate`.

### 4. What are `touched`, `errors`, and `dirty`?
- **`errors`:** current validation errors per field.
- **`touched`:** fields the user has visited (blurred). Show errors only when `touched && errors` so users aren't shouted at before typing.
- **`dirty`:** whether values differ from `initialValues`. Useful for "unsaved changes" warnings and disabling the save button.

### 5. How do you handle dynamic lists of fields?
Use `<FieldArray>`, which gives you `push`, `remove`, `insert`, and `move` helpers.
```jsx
<FieldArray name="phones">
  {({ push, remove }) => (
    <>
      {values.phones.map((_, i) => (
        <div key={i}>
          <Field name={`phones.${i}`} />
          <button type="button" onClick={() => remove(i)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => push('')}>Add phone</button>
    </>
  )}
</FieldArray>
```

### 6. What are Formik's main drawbacks?
- **Re-renders:** controlled inputs mean the whole form re-renders on every keystroke, which hurts large forms.
- **Maintenance:** development has slowed significantly, and many teams have moved to RHF.
- **TypeScript:** typing nested field names is weaker than RHF's.

**Good answer:** "Formik is fine for small forms and existing codebases, but for new or large forms I'd choose React Hook Form."

---

## React Hook Form

### 7. What is React Hook Form, and why is it faster?
It uses **uncontrolled inputs** registered via refs. Values live in the DOM and RHF's internal store, not React state, so typing doesn't re-render the form. Components re-render only when the form state they subscribe to changes.

### 8. How do `register` and `handleSubmit` work?
```jsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => { await api.signup(data); };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <input {...register('email', { required: 'Email is required' })} />
      {errors.email && <p role="alert">{errors.email.message}</p>}
      <button disabled={isSubmitting}>Sign up</button>
    </form>
  );
}
```
- **`register`** returns `name`, `ref`, `onChange`, and `onBlur` to spread onto a native input.
- **`handleSubmit`** validates first and calls your callback only if the form is valid.

### 9. How do you use RHF with controlled UI components like MUI?
Components like MUI's `Select`, `Autocomplete`, or a date picker don't expose a native input ref, so use **`Controller`** (or `useController`):
```jsx
import { Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

<Controller
  name="email"
  control={control}
  render={({ field, fieldState }) => (
    <TextField
      {...field}
      label="Email"
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )}
/>
```

### 10. How does `formState` avoid unnecessary re-renders?
`formState` is a **Proxy**. RHF tracks which properties you read (`errors`, `isDirty`, `isValid`) and only re-renders when those change. So destructure only what you need, and read it during render.

```jsx
// Subscribes only to errors and isSubmitting
const { formState: { errors, isSubmitting } } = useForm();
```

### 11. `watch` vs `useWatch` vs `getValues`?
| API | Re-renders? | Use it for |
|---|---|---|
| **`watch`** | Re-renders the component that called `useForm` | Quick reactions at the form level |
| **`useWatch`** | Re-renders only the component using it | Isolated reactive UI (e.g. a live price preview) |
| **`getValues`** | Never | Reading values inside event handlers |

**Senior point:** prefer `useWatch` in a child component to keep re-renders local in large forms.

### 12. How do you handle dynamic field lists?
`useFieldArray`, with `field.id` as the key (never the index):
```jsx
const { fields, append, remove } = useFieldArray({ control, name: 'items' });

{fields.map((field, i) => (
  <div key={field.id}>
    <input {...register(`items.${i}.name`)} />
    <button type="button" onClick={() => remove(i)}>Remove</button>
  </div>
))}
<button type="button" onClick={() => append({ name: '' })}>Add item</button>
```

### 13. How do you load default values from an API (e.g. an edit form)?
- Pass async `defaultValues` (a function returning a promise), or
- Fetch the data, then call `reset(data)` once it arrives.

`reset` also updates the baseline for `isDirty`, so the form starts "clean" with the loaded data.
```jsx
useEffect(() => {
  if (user) reset(user);
}, [user, reset]);
```

### 14. How do you show server-side validation errors?
Use `setError` after the API responds:
```jsx
const onSubmit = async (data) => {
  try {
    await api.signup(data);
  } catch (err) {
    if (err.code === 'EMAIL_TAKEN') {
      setError('email', { type: 'server', message: 'Email already registered' });
    } else {
      setError('root.serverError', { message: 'Something went wrong' });
    }
  }
};
```

### 15. What are validation modes?
Set via `useForm({ mode })`:
- **`onSubmit`** (default): validate on submit, then re-validate on change.
- **`onBlur`:** validate when a field loses focus.
- **`onChange`:** validate on every change. Most responsive, most work.
- **`onTouched`:** validate on first blur, then on every change. A good UX balance.
- **`all`:** both blur and change.

---

## Zod

### 16. What is Zod, and why is it popular?
A TypeScript-first schema library. You define a schema once, and get:
- **runtime validation** of untrusted data (forms, API responses, env vars), and
- **static types** via `z.infer`, with no duplicated interfaces.
```ts
import { z } from 'zod';

const UserSchema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.string().email('Invalid email'),
  age: z.number().int().min(18),
});

type User = z.infer<typeof UserSchema>;
// { name: string; email: string; age: number }
```
*Note: Zod 4 also offers top-level format helpers such as `z.email()`; the chained `z.string().email()` form still works.*

### 17. `parse` vs `safeParse`?
- **`parse`** returns the data or **throws** a `ZodError`.
- **`safeParse`** never throws. It returns `{ success: true, data }` or `{ success: false, error }`.

Use `safeParse` for user input and control flow; use `parse` where invalid data is truly exceptional.
```ts
const result = UserSchema.safeParse(input);
if (!result.success) {
  console.log(result.error.issues);
} else {
  save(result.data);
}
```

### 18. How do you validate fields that depend on each other (e.g. confirm password)?
Use `.refine()` on the object, with `path` to attach the error to the right field. Use `.superRefine()` when you need multiple custom issues.
```ts
const PasswordSchema = z
  .object({
    password: z.string().min(8),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
```

### 19. `transform`, `coerce`, and `preprocess`: what's the difference?
- **`z.coerce.number()`:** converts input before validating. Useful because HTML inputs always return strings.
- **`.transform()`:** changes the output *after* validation (e.g. trim, lowercase, map to a different shape).
- **`z.preprocess()`:** runs custom logic *before* validation.
```ts
const Schema = z.object({
  price: z.coerce.number().positive(),
  email: z.string().email().transform((s) => s.toLowerCase().trim()),
});
```
**Senior point:** with transforms, a schema's input type and output type differ (`z.input<>` vs `z.output<>`), which matters when typing form values.

### 20. How do you validate conditional forms (different fields based on a choice)?
Use `z.discriminatedUnion` on a shared key:
```ts
const PaymentSchema = z.discriminatedUnion('method', [
  z.object({ method: z.literal('card'), cardNumber: z.string().length(16) }),
  z.object({ method: z.literal('upi'), upiId: z.string().includes('@') }),
]);
```
TypeScript then narrows the type correctly in each branch.

### 21. How do you share validation between frontend and backend?
Put schemas in a shared package or folder, and use the same schema in React (with RHF) and in Node/Express:
```ts
// Express middleware
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten().fieldErrors });
  }
  req.body = result.data;
  next();
};

app.post('/signup', validate(SignupSchema), signupHandler);
```
**Why it matters:** frontend validation is UX; backend validation is security. One schema keeps both in sync and eliminates drift.

---

## Integration & Architecture

### 22. How do you connect React Hook Form and Zod?
Use `zodResolver` from `@hookform/resolvers`. Types flow from the schema into the form.
```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const SignupSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

type SignupValues = z.infer<typeof SignupSchema>;

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(SignupSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onTouched',
  });

  return (
    <form onSubmit={handleSubmit((data) => api.signup(data))} noValidate>
      <input {...register('email')} aria-invalid={!!errors.email} />
      {errors.email && <p role="alert">{errors.email.message}</p>}

      <input type="password" {...register('password')} aria-invalid={!!errors.password} />
      {errors.password && <p role="alert">{errors.password.message}</p>}

      <button disabled={isSubmitting}>Sign up</button>
    </form>
  );
}
```

### 23. Formik vs React Hook Form: how do you choose?
| | Formik | React Hook Form |
|---|---|---|
| Input model | Controlled | Uncontrolled (refs) |
| Re-renders | Whole form per keystroke | Only subscribed components |
| Bundle size | Larger | Smaller |
| TypeScript | Weaker field typing | Strong typed field paths |
| UI library integration | Direct | `Controller` for controlled components |
| Maintenance | Slowed | Active |
| Best for | Small forms, legacy code | New projects, large or dynamic forms |

### 24. Yup vs Zod?
| | Yup | Zod |
|---|---|---|
| TypeScript | Types via `InferType`, added later | TypeScript-first, excellent inference |
| Default behavior | Coerces/casts values by default | Strict; coercion is explicit |
| Ecosystem | Formik's native choice | Default in modern stacks (tRPC, RHF, Next.js server actions) |

**Good answer:** "For a TypeScript codebase I'd choose Zod for its inference and the ability to share schemas with the backend. Yup is fine where it's already in use with Formik."

### 25. How would you architect a large multi-step form (e.g. an onboarding wizard)?
- **One form, many steps:** a single `useForm` wrapped in `<FormProvider>`; each step uses `useFormContext()` instead of prop drilling.
- **Per-step validation:** call `trigger(['field1', 'field2'])` before moving to the next step, or give each step its own Zod schema and merge them for the final submit.
- **Keep re-renders local:** use `useWatch` and `Controller` inside step components rather than `watch` at the top.
- **Persist progress:** save drafts to localStorage or the backend so users can resume.
- **Validate again on the server** with the same Zod schema.
- **Accessibility:** label every input, use `aria-invalid` and `role="alert"` on errors, and move focus to the first invalid field (RHF does this by default with `shouldFocusError`).

```tsx
const methods = useForm<OnboardingValues>({ resolver: zodResolver(OnboardingSchema) });

const next = async () => {
  const valid = await methods.trigger(stepFields[step]);
  if (valid) setStep((s) => s + 1);
};

<FormProvider {...methods}>
  <form onSubmit={methods.handleSubmit(submit)}>
    {step === 0 && <AccountStep />}
    {step === 1 && <ProfileStep />}
    {step === 2 && <ReviewStep />}
  </form>
</FormProvider>
```

---

## Practical Extras

### 26. Controlled vs uncontrolled inputs in plain React?
- **Controlled:** React state is the source of truth. You pass `value` and update it in `onChange`. Easy to validate and transform on every keystroke, but every keystroke re-renders.
- **Uncontrolled:** the DOM is the source of truth. You pass `defaultValue` and read the value through a ref (or `FormData`) when needed. No re-render per keystroke.

```jsx
// Controlled
const [email, setEmail] = useState('');
<input value={email} onChange={(e) => setEmail(e.target.value)} />

// Uncontrolled
const emailRef = useRef(null);
<input defaultValue="" ref={emailRef} />
// later: emailRef.current.value
```
**Senior point:** this is exactly why React Hook Form is fast. It builds on uncontrolled inputs and refs, while Formik builds on controlled inputs. Also mention the classic warning: switching an input from uncontrolled to controlled (e.g. `value` going from `undefined` to a string) triggers a React warning, so always initialize values.

### 27. How do you implement async validation (e.g. "username already taken")?
Goals: don't call the API on every keystroke, ignore stale responses, and keep the error tied to the field.

**Option A: validate in the Zod schema** with an async `refine`, then use `zodResolver`. Simple, but runs on every validation pass, so pair it with `mode: 'onBlur'`.
```ts
const Schema = z.object({
  username: z.string().min(3).refine(
    async (name) => !(await api.isUsernameTaken(name)),
    { message: 'Username already taken' },
  ),
});
```

**Option B: debounced check with cancellation** for live feedback while typing:
```tsx
const username = useWatch({ control, name: 'username' });

useEffect(() => {
  if (!username || username.length < 3) return;

  const controller = new AbortController();
  const timer = setTimeout(async () => {
    try {
      const taken = await api.isUsernameTaken(username, { signal: controller.signal });
      if (taken) setError('username', { type: 'async', message: 'Username already taken' });
      else clearErrors('username');
    } catch (e) {
      if (e.name !== 'AbortError') throw e;
    }
  }, 400);

  return () => {
    clearTimeout(timer);
    controller.abort(); // cancel the stale request
  };
}, [username, setError, clearErrors]);
```
**Always re-check on the server at submit time**, because the username can be taken between the check and the submit.

### 28. How do you handle file uploads?
With `register`, a file input gives you a `FileList`. Validate size and type in Zod, then send it with `FormData`.
```tsx
const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

const Schema = z.object({
  avatar: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'Please choose a file')
    .refine((files) => files?.[0]?.size <= MAX_SIZE, 'Max size is 2 MB')
    .refine((files) => ACCEPTED.includes(files?.[0]?.type), 'Only JPG, PNG or WebP'),
});

const onSubmit = async (data) => {
  const body = new FormData();
  body.append('avatar', data.avatar[0]);
  await fetch('/api/avatar', { method: 'POST', body }); // don't set Content-Type manually
};

<input type="file" accept="image/*" {...register('avatar')} />
```
**Senior points:**
- Don't set `Content-Type` yourself; the browser adds the multipart boundary.
- Show a preview with `URL.createObjectURL(file)` and revoke it in a cleanup to avoid memory leaks.
- For large files, upload directly to storage (e.g. a presigned S3 URL) and show progress.
- Client-side checks are UX only; validate type and size again on the server (e.g. with `multer` limits in Express).

### 29. How do you test a form?
Use **React Testing Library** with **`user-event`**, and test behavior the way a user experiences it, not implementation details.
```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('shows validation errors and submits valid data', async () => {
  const user = userEvent.setup();
  const onSubmit = vi.fn(); // or jest.fn()
  render(<SignupForm onSubmit={onSubmit} />);

  // Submitting empty shows errors
  await user.click(screen.getByRole('button', { name: /sign up/i }));
  expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  expect(onSubmit).not.toHaveBeenCalled();

  // Filling valid data submits
  await user.type(screen.getByLabelText(/email/i), 'user@example.com');
  await user.type(screen.getByLabelText(/password/i), 'supersecret');
  await user.click(screen.getByRole('button', { name: /sign up/i }));

  expect(onSubmit).toHaveBeenCalledWith(
    { email: 'user@example.com', password: 'supersecret' },
    expect.anything(), // RHF passes the event as the second argument
  );
});
```
**What to test:**
- Errors appear at the right time and disappear when fixed.
- Submit is blocked when invalid, and the button is disabled while submitting.
- Server errors (mock the API with MSW) show on the right field.
- Dynamic fields can be added and removed.

**Senior point:** query by role and label (`getByRole`, `getByLabelText`), not test IDs. If a test can't find an input by its label, the form probably has an accessibility problem too.

---

*Tip: the strongest form answers connect UX (when errors appear, focus management), performance (re-renders), and correctness (one schema, validated on both client and server).*
