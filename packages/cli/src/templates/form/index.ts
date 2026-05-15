export const formTemplate = `import { signal } from '@emberkit/core';

const {{name}}Form = () => {
  const email = signal('');
  const password = signal('');
  const error = signal<string | null>(null);
  const loading = signal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    error.value = null;
    loading.value = true;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Handle success
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email.value}
        onInput={(e) => { email.value = e.currentTarget.value; }}
        placeholder="Email"
      />
      <input
        type="password"
        value={password.value}
        onInput={(e) => { password.value = e.currentTarget.value; }}
        placeholder="Password"
      />
      {error.value && <p className="text-red-500">{error.value}</p>}
      <button type="submit" disabled={loading.value}>
        {loading.value ? 'Loading...' : 'Submit'}
      </button>
    </form>
  );
};

export default {{name}}Form;
`;