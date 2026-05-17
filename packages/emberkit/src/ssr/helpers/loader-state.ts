import type { LoaderResult } from '../../loader/types.js';

export const LOADER_STATE_SCRIPT_ID = '__emberkit_loader_state__';

export interface LoaderStatePayload {
  pathname: string;
  loaderResult: LoaderResult<unknown> | null;
}

export function buildLoaderStateScript(state: LoaderStatePayload): string {
  const json = JSON.stringify(state).replace(/</g, '\\u003c');
  return `<script id="${LOADER_STATE_SCRIPT_ID}" type="application/json">${json}</script>`;
}

export function readLoaderStateFromDocument(): LoaderStatePayload | null {
  if (typeof document === 'undefined') {
    return null;
  }
  const el = document.getElementById(LOADER_STATE_SCRIPT_ID);
  if (!el?.textContent?.trim()) {
    return null;
  }
  try {
    return JSON.parse(el.textContent) as LoaderStatePayload;
  } catch {
    return null;
  }
}

export function clearLoaderStateScript(): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.getElementById(LOADER_STATE_SCRIPT_ID)?.remove();
}
