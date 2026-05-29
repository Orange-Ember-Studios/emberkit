export const indexTemplate = `import { render } from '@emberkit/core';
import { routes, notFoundRoute, errorRoute } from 'virtual:emberkit-routes';
import App from './routes/_layout';
import './styles.css';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes, notFoundRoute, errorRoute });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}
`;