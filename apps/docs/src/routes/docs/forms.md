# Forms & Mutations

EmberKit provides built-in form handling with validation, state management, and submission handling.

## Basic Form

```tsx
import { createSignal } from '@emberkit/core';
import { handleFormSubmit } from '@emberkit/core';

function ContactForm() {
  const [submitted, setSubmitted] = createSignal(false);

  async function onSubmit(event: SubmitEvent) {
    await handleFormSubmit(event, {
      onSubmit: async (formData) => {
        await fetch('/api/contact', {
          method: 'POST',
          body: formData,
        });
        setSubmitted(true);
      },
      onError: (errors) => {
        console.error('Validation failed:', errors);
      },
    });
  }

  if (submitted()) {
    return <div className="alert-success">Message sent!</div>;
  }

  return (
    <form onSubmit={onSubmit}>
      <input name="name" placeholder="Name" required />
      <input name="email" type="email" placeholder="Email" required />
      <textarea name="message" placeholder="Message" required />
      <button type="submit">Send</button>
    </form>
  );
}
```

## Validation

Define a validation schema:

```tsx
import { createFormValidator } from '@emberkit/core';

const validator = createFormValidator({
  fields: {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    age: {
      custom: (value) => {
        const n = Number(value);
        if (n < 18) return 'Must be at least 18';
        if (n > 120) return 'Invalid age';
        return null;
      },
    },
  },
});

const errors = validator.validate({ name: '', email: 'bad', age: 15 });
// { name: 'name is required', email: 'email is invalid', age: 'Must be at least 18' }
```

### Built-in Validators

| Field Name | Validation |
|-----------|------------|
| `email` | Pattern match for email format |
| `url` | Pattern match for HTTP(S) URLs |
| `phone` | Pattern match for phone numbers |

## Form State

Track form state manually for complex forms:

```tsx
import { createSignal, createFormState, setFieldValue, setFieldError } from '@emberkit/core';

function SignupForm() {
  const [state, setState] = createSignal(createFormState({
    username: '',
    password: '',
  }));

  function handleChange(name: string, value: string) {
    setState(prev => setFieldValue(prev, name, value));
  }

  return (
    <form>
      <input
        value={state().values.username}
        onChange={(e) => handleChange('username', e.target.value)}
      />
      {state().errors.username && <span>{state().errors.username}</span>}
    </form>
  );
}
```

## Mutations

Server-side mutations handle data changes:

```tsx
// src/routes/_api/posts.ts
export async function POST(request: Request) {
  const data = await request.json();
  
  // Validate
  if (!data.title || !data.content) {
    return new Response('Missing fields', { status: 400 });
  }

  // Save to database
  const post = await db.posts.create(data);
  
  return new Response(JSON.stringify(post), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Progressive Enhancement

Forms work without JavaScript. The server handles the submission:

```tsx
<form action="/api/contact" method="POST">
  <input name="name" />
  <input name="email" type="email" />
  <button type="submit">Send</button>
</form>
```

With JavaScript loaded, client-side validation runs first, then the mutation is handled via fetch.

## Next Steps

- [Signals](/docs/signals) - Form state management
- [Routing](/docs/routing) - API routes for mutations
- [SSR](/docs/ssr) - Server-side form handling
