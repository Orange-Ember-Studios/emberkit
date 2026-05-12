import { render } from '@emberkit/core';
import App from './routes/_layout';

console.log('[entry] index.tsx loaded');
console.log('[entry] App:', App);

const root = document.getElementById('app');
console.log('[entry] root element:', root);

if (root) {
  console.log('[entry] Calling render...');
  try {
    render(App, root);
    console.log('[entry] Render successful');
  } catch (error) {
    console.error('[entry] Render error:', error);
  }
}