import type { JSXElement } from '../runtime/types.js';

export interface DefaultServerErrorInfo {
  status?: number;
  message?: string;
  error?: unknown;
}

export interface DefaultServerErrorPageProps {
  error?: DefaultServerErrorInfo;
  pathname?: string;
}

const pageStyle =
  'min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#e5e7eb;background:#0b0f19';

const cardStyle = 'max-width:36rem;width:100%';

const codeStyle =
  'margin:0 0 1rem;font-size:clamp(3.5rem,10vw,5rem);font-weight:800;line-height:1;color:#f87171';

const titleStyle = 'margin:0 0 0.75rem;font-size:1.75rem;font-weight:700;color:#f9fafb';

const bodyStyle = 'margin:0 0 1rem;font-size:1.0625rem;line-height:1.6;color:#d1d5db';

const detailStyle =
  'margin:0 0 2rem;padding:1rem;border-radius:0.5rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);font-size:0.875rem;line-height:1.5;color:#fca5a5;word-break:break-word';

const linkStyle =
  'display:inline-block;margin-bottom:2.5rem;padding:0.75rem 1.5rem;border-radius:0.5rem;background:#f97316;color:#fff;font-size:1rem;font-weight:600;text-decoration:none';

const hintStyle = 'margin:0;font-size:0.875rem;color:#9ca3af';

/** Built-in 500 page when the project has no `src/routes/500.tsx`. */
export function DefaultServerErrorPage(props: DefaultServerErrorPageProps): JSXElement {
  const status = props.error?.status ?? 500;
  const message = props.error?.message ?? 'Something went wrong while rendering this page.';
  const pathname = props.pathname ?? '/';

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <p style={codeStyle}>{status}</p>
        <h1 style={titleStyle}>Server error</h1>
        <p style={bodyStyle}>
          An error occurred while loading <code style={{ color: '#fdba74' }}>{pathname}</code>.
        </p>
        <p style={detailStyle}>{message}</p>
        <a href="/" style={linkStyle}>
          Go home
        </a>
        <p style={hintStyle}>Add <code style={{ color: '#fdba74' }}>src/routes/500.tsx</code> to customize this page.</p>
      </div>
    </main>
  );
}

export default DefaultServerErrorPage;
