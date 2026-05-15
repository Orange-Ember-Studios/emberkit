export const indexTemplate = `import { render } from '@emberkit/core';
import { routes } from 'virtual:emberkit-routes';
import App from './routes/_layout';
import './styles.css';

const root = document.getElementById('app');

if (root) {
  try {
    render(App, root, { routes });
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}
`;