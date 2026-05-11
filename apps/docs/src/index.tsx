import { render } from '@emberkit/core';
import App from './routes/_layout';

const root = document.getElementById('app');

if (root) {
  render(App, root);
}