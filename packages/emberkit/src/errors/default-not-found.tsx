import type { JSXElement } from '../runtime/types.js';

export interface DefaultNotFoundPageProps {
  pathname?: string;
}

const pageStyle =
  'min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2rem 1.5rem;text-align:center;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#e5e7eb;background:#0b0f19';

const cardStyle = 'max-width:32rem;width:100%';

const codeStyle =
  'margin:0 0 1rem;font-size:clamp(4rem,12vw,6rem);font-weight:800;line-height:1;color:#fb923c';

const titleStyle = 'margin:0 0 0.75rem;font-size:1.75rem;font-weight:700;color:#f9fafb';

const bodyStyle = 'margin:0 0 2rem;font-size:1.0625rem;line-height:1.6;color:#d1d5db';

const linkStyle =
  'display:inline-block;margin-bottom:2.5rem;padding:0.75rem 1.5rem;border-radius:0.5rem;background:#f97316;color:#fff;font-size:1rem;font-weight:600;text-decoration:none';

const hintStyle = 'margin:0;font-size:0.875rem;color:#9ca3af';

/** Built-in 404 page when the project has no `src/routes/404.tsx`. */
export function DefaultNotFoundPage(props: DefaultNotFoundPageProps): JSXElement {
  const pathname = props.pathname ?? '/';

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <p style={codeStyle}>404</p>
        <h1 style={titleStyle}>Page not found</h1>
        <p style={bodyStyle}>
          No route matches <code style={{ color: '#fdba74' }}>{pathname}</code>. Check the URL or
          return to the home page.
        </p>
        <a href="/" style={linkStyle}>
          Go home
        </a>
        <p style={hintStyle}>Add <code style={{ color: '#fdba74' }}>src/routes/404.tsx</code> to customize this page.</p>
      </div>
    </main>
  );
}

export default DefaultNotFoundPage;
