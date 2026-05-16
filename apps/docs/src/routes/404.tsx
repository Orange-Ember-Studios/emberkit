import type { RouteComponent } from '@emberkit/core';

const NotFound: RouteComponent = () => {
  return (
    <div style={{ padding: '40px 20px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a' }}>
      <div style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '20px', color: '#fb923c' }}>
          404
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#fff' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: '#9ca3af' }}>
          The page you're looking for doesn't exist or has been moved.
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

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '40px', textAlign: 'left' }}>
          <a
            href="/docs/introduction"
            style={{
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Documentation</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Learn about EmberKit</div>
          </a>

          <a
            href="/docs/quick-start"
            style={{
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontWeight: '600', marginBottom: '8px', color: '#fff' }}>Quick Start</div>
            <div style={{ fontSize: '14px', color: '#9ca3af' }}>Get started in minutes</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
