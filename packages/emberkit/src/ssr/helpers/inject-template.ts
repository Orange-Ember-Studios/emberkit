import { buildLoaderStateScript, type LoaderStatePayload } from './loader-state.js';

export interface SSRInjectOptions {
  appHtml: string;
  headContent?: string;
  loaderState?: LoaderStatePayload | null;
}

export function injectSSRIntoTemplate(template: string, options: SSRInjectOptions): string {
  let html = template;
  const { appHtml, headContent, loaderState } = options;
  const loaderScript = loaderState ? buildLoaderStateScript(loaderState) : '';
  const bodyInjection = appHtml + loaderScript;

  if (html.includes('<body id="app">')) {
    html = html.replace('<body id="app">', '<body id="app">' + bodyInjection);
  } else if (html.includes('<div id="app"></div>')) {
    html = html.replace('<div id="app"></div>', '<div id="app">' + bodyInjection + '</div>');
  } else if (html.includes('<div id="app"/>')) {
    html = html.replace('<div id="app"/>', '<div id="app">' + bodyInjection + '</div>');
  }

  if (headContent && html.includes('</head>')) {
    html = html.replace('</head>', headContent + '</head>');
  }

  return html;
}
