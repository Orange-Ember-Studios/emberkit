import type { RouteComponent } from '@emberkit/core';

interface ErrorInfo {
  status?: number;
  message?: string;
  error?: Error;
}

const ServerError: RouteComponent<{ error?: ErrorInfo }> = ({ error }) => {
  const message = error?.message || 'Something went wrong on our end';

  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px', color: '#ef4444' }}>
          500
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
          Server Error
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#9ca3af' }}>
          {message}
        </p>

        <a
          href="/"
          style={{
            display: 'inline-block',
            backgroundColor: '#fb923c',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '600',
            marginBottom: '40px',
          }}
        >
          Go Back Home
        </a>

        <div style={{ marginTop: '40px', fontSize: '14px', color: '#6b7280' }}>
          <p>If this problem persists, please contact support.</p>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
