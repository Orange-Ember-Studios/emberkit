import { build as viteBuild, type UserConfig, type InlineConfig } from "vite";
import { join } from "path";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "fs";
import { pathToFileURL } from "url";
import { cliBrand } from "../brand.js";
import { mergeEmberkitViteConfig } from "../utils/merge-emberkit-vite.js";

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  orange: "\x1b[38;5;208m",
  ember: "\x1b[38;5;202m",
  gray: "\x1b[38;5;240m",
  green: "\x1b[38;5;40m",
  cyan: "\x1b[38;5;51m",
  yellow: "\x1b[38;5;220m",
  red: "\x1b[38;5;196m",
};

function log(level: "info" | "warn" | "error" | "success", message: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  const prefix = `${COLORS.gray}[${timestamp}]${COLORS.reset}`;
  
  const levelColors: Record<string, string> = {
    info: COLORS.cyan,
    warn: COLORS.yellow,
    error: COLORS.red,
    success: COLORS.green,
  };
  
  const levelLabel = `${levelColors[level]}${level.toUpperCase().padEnd(7)}${COLORS.reset}`;
  const emberTag = `${COLORS.ember}[emberkit]${COLORS.reset}`;
  
  console.log(`${prefix} ${levelLabel} ${emberTag} ${message}`);
}

async function loadEmberKitConfig(root: string): Promise<Record<string, unknown> | null> {
  const configPaths = [
    join(root, "emberkit.config.ts"),
    join(root, "emberkit.config.js"),
    join(root, "emberkit.config.mjs"),
  ];
  
  for (const configPath of configPaths) {
    if (existsSync(configPath)) {
      try {
        const configUrl = pathToFileURL(configPath).href;
        const mod = await import(configUrl);
        return mod.default || mod;
      } catch {
        continue;
      }
    }
  }
  
  return null;
}

async function loadViteConfig(root: string): Promise<UserConfig | null> {
  const viteConfigPaths = [
    join(root, "vite.config.ts"),
    join(root, "vite.config.js"),
  ];
  
  for (const configPath of viteConfigPaths) {
    if (existsSync(configPath)) {
      try {
        const configUrl = pathToFileURL(configPath).href;
        const mod = await import(configUrl);
        const config = mod.default || mod;
        return typeof config === "function" 
          ? config({ mode: "production", command: "build" }) 
          : config;
      } catch {
        continue;
      }
    }
  }
  
  return null;
}

export async function build(_args: string[]): Promise<void> {
  const root = process.cwd();
  
  console.log(`\n${cliBrand.logo()} ${COLORS.orange}EmberKit Build${COLORS.reset}\n`);
  
  const emberkitConfig = await loadEmberKitConfig(root);
  const viteFileConfig = await loadViteConfig(root);
  const viteConfig = mergeEmberkitViteConfig(emberkitConfig, viteFileConfig);
  
  const mode = (emberkitConfig as any)?.mode || "hybrid";
  const outDir = (emberkitConfig as any)?.build?.outDir || "dist";
  
  log("info", `Build mode: ${COLORS.ember}${mode}${COLORS.reset}`);
  log("info", `Output directory: ${COLORS.cyan}${outDir}${COLORS.reset}`);
  
  const customLogger = {
    info: () => {},
    warn: (msg: string) => log("warn", msg),
    error: (msg: string) => log("error", msg),
    warnOnce: () => {},
    clearScreen: () => {},
    hasWarned: false,
    hasErrorLogged: () => false,
  };
  
  try {
    if (mode === "spa") {
      log("info", "Building SPA (client-only)...");
      await buildClient(root, outDir, viteConfig, customLogger);
      log("success", "SPA build complete!");
    } else if (mode === "ssr" || mode === "hybrid") {
      log("info", "Building client bundle...");
      await buildClient(root, outDir, viteConfig, customLogger);
      
      log("info", "Building SSR bundle...");
      await buildSSR(root, outDir, viteConfig, customLogger);
      
      log("info", "Generating SSR manifest...");
      await generateManifest(root, outDir, mode);
      
      if (mode === "hybrid") {
        log("info", "Pre-rendering static routes...");
        await prerenderStaticRoutes(root, outDir);
      }
      
      log("success", `${mode.toUpperCase()} build complete!`);
    } else if (mode === "static") {
      log("info", "Building static site...");
      await buildClient(root, outDir, viteConfig, customLogger);
      
      log("info", "Building SSR bundle for pre-rendering...");
      await buildSSR(root, outDir, viteConfig, customLogger);
      
      log("info", "Generating manifest...");
      await generateManifest(root, outDir, mode);
      
      log("info", "Pre-rendering all routes...");
      await prerenderStaticRoutes(root, outDir, true);
      
      log("success", "Static build complete!");
    }
    
    console.log(
      `\n${cliBrand.spark()} ${COLORS.green}Build finished successfully!${COLORS.reset}\n`,
    );
    console.log(`${COLORS.gray}   Output: ${COLORS.cyan}./${outDir}${COLORS.reset}\n`);
    
  } catch (error) {
    log("error", `Build failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

async function buildClient(
  root: string,
  outDir: string,
  viteConfig: UserConfig | null,
  customLogger: any,
): Promise<void> {
  // Ensure plugins from viteConfig are included
  const plugins = viteConfig?.plugins ? (Array.isArray(viteConfig.plugins) ? viteConfig.plugins : [viteConfig.plugins]) : [];
  
  const clientConfig: InlineConfig = {
    ...viteConfig,
    root,
    customLogger,
    logLevel: "silent",
    plugins,
    build: {
      ...(viteConfig?.build || {}),
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        ...(viteConfig?.build?.rollupOptions || {}),
        output: {
          manualChunks: undefined,
        },
      },
    },
    ssr: undefined,
  };
  
  await viteBuild(clientConfig);
}

function getServerEntryShim(): string {
  return `import { routes, notFoundRoute, errorRoute } from 'virtual:emberkit-routes';
import { createElement } from '@emberkit/core';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const routeToRegex = (routePath) => {
  const paramNames = [];
  const regexStr = routePath
    .replace(/:([^/]+)\\*/g, (_, name) => {
      paramNames.push(name);
      return '(.*)';
    })
    .replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });
  return { regex: new RegExp('^' + regexStr.replace(/\\/$/, '/?') + '$'), paramNames };
};

const matchRoute = (routeList, pathname) => {
  const normalizedPath = pathname.replace(/\\/+$/, '') || '/';
  const sortedRoutes = [...routeList].sort((a, b) => {
    const aScore = a.path.includes(':') ? 0 : 1;
    const bScore = b.path.includes(':') ? 0 : 1;
    return bScore - aScore;
  });
  for (const route of sortedRoutes) {
    const pattern = routeToRegex(route.path);
    const match = normalizedPath.match(pattern.regex);
    if (match) {
      const params = {};
      pattern.paramNames.forEach((name, i) => { params[name] = match[i + 1]; });
      return { route, params };
    }
  }
  return null;
};

const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const renderToString = (element) => {
  if (!element && element !== 0) return '';
  if (typeof element === 'string') return escapeHtml(element);
  if (typeof element === 'number') return String(element);
  if (Array.isArray(element)) return element.map(renderToString).join('');

  if (typeof element !== 'object' || !element.type) return '';

  let { type, props } = element;
  props = props || {};

  let depth = 0;
  while (typeof type === 'function' && depth < 50) {
    depth++;
    try {
      const result = type(props);
      if (result && typeof result === 'object' && result.type) {
        type = result.type;
        props = result.props || {};
      } else if (typeof result === 'string' || typeof result === 'number') {
        return typeof result === 'string' ? escapeHtml(result) : String(result);
      } else if (Array.isArray(result)) {
        return result.map(renderToString).join('');
      } else {
        return '';
      }
    } catch (e) {
      console.error('[SSR render error]', e);
      return '';
    }
  }

  if (type === 'Fragment' || type === 'React.Fragment') {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    return children.filter(Boolean).map(renderToString).join('');
  }

  const SELF_CLOSING = new Set(['area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr']);

  const children = Array.isArray(props.children) ? props.children : (props.children ? [props.children] : []);
  let childHtml = children.filter(c => c != null).map(renderToString).join('');

  if (props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html) {
    childHtml = props.dangerouslySetInnerHTML.__html;
  }

  const attrs = Object.entries(props)
    .filter(([k, v]) => k !== 'children' && k !== 'key' && k !== 'dangerouslySetInnerHTML' && v != null && typeof v !== 'function')
    .map(([k, v]) => {
      if (k === 'className') k = 'class';
      if (v === true) return ' ' + k;
      if (v === false) return '';
      if (k === 'style' && typeof v === 'object') {
        const styleStr = Object.entries(v)
          .filter(([, sv]) => sv != null)
          .map(([sp, sv]) => sp.replace(/([A-Z])/g, '-$1').toLowerCase() + ': ' + sv)
          .join('; ');
        return ' ' + k + '="' + escapeHtml(styleStr) + '"';
      }
      return ' ' + k + '="' + escapeHtml(String(v)) + '"';
    })
    .join('');

  if (SELF_CLOSING.has(type)) {
    return '<' + type + attrs + '/>';
  }

  return '<' + type + attrs + '>' + childHtml + '</' + type + '>';
};

export async function render(url) {
  const pathname = url.split('?')[0];

  const match = matchRoute(routes, pathname);

  let appHtml = '';
  let headContent = '';
  let status = 200;

  if (match) {
    try {
      const mod = await match.route.component();
      const Component = mod.default || mod;

      if (mod.metadata) {
        if (mod.metadata.title) {
          headContent += '<title>' + escapeHtml(mod.metadata.title) + '</title>\\n';
        }
        if (mod.metadata.description) {
          headContent += '<meta name="description" content="' + escapeHtml(mod.metadata.description) + '">\\n';
        }
      }

      const element = createElement(Component, { params: match.params });
      appHtml = renderToString(element);
    } catch (e) {
      console.error('[SSR] Failed to render route:', pathname, e);
      if (errorRoute) {
        try {
          status = 500;
          const mod = await errorRoute();
          const Component = mod.default || mod;
          const errorInfo = {
            status: 500,
            message: e instanceof Error ? e.message : 'Internal Server Error',
            error: e,
          };
          const element = createElement(Component, { error: errorInfo });
          appHtml = renderToString(element);
        } catch (fallbackError) {
          console.error('[SSR] Failed to render 500 page:', fallbackError);
          appHtml = '<div style="color: red; padding: 20px;">Internal Server Error</div>';
        }
      } else {
        appHtml = '<div style="color: red; padding: 20px;">SSR Error: ' + escapeHtml(String(e)) + '</div>';
        status = 500;
      }
    }
  } else {
    status = 404;
    if (notFoundRoute) {
      try {
        const mod = await notFoundRoute();
        const Component = mod.default || mod;
        const element = createElement(Component, {});
        appHtml = renderToString(element);
      } catch (e) {
        console.error('[SSR] Failed to render 404 page:', e);
        appHtml = '<div style="padding: 20px;">404 - Page not found</div>';
      }
    } else {
      appHtml = '<div style="padding: 20px;">404 - Page not found</div>';
    }
  }

  const templatePath = join(__dirname, '..', 'index.html');
  let template = readFileSync(templatePath, 'utf-8');

  if (template.includes('<body id="app">')) {
    template = template.replace('<body id="app">', '<body id="app">' + appHtml);
  } else if (template.includes('<div id="app">')) {
    template = template.replace('<div id="app"></div>', '<div id="app">' + appHtml + '</div>');
  } else if (template.includes('<div id="app"/>')) {
    template = template.replace('<div id="app"/>', '<div id="app">' + appHtml + '</div>');
  }

  if (headContent && template.includes('</head>')) {
    template = template.replace('</head>', headContent + '</head>');
  }

  return { html: template, status };
}
`;
}

async function resolveSSREntry(root: string): Promise<string> {
  const userEntryTs = join(root, "src", "entry-server.ts");
  const userEntryTsx = join(root, "src", "entry-server.tsx");
  if (existsSync(userEntryTs)) {
    return userEntryTs;
  }
  if (existsSync(userEntryTsx)) {
    return userEntryTsx;
  }
  const cacheDir = join(root, "node_modules", ".cache", "emberkit");
  mkdirSync(cacheDir, { recursive: true });
  const shimPath = join(cacheDir, "server-entry.js");
  writeFileSync(shimPath, getServerEntryShim(), "utf-8");
  return shimPath;
}

async function buildSSR(
  root: string,
  outDir: string,
  viteConfig: UserConfig | null,
  customLogger: any,
): Promise<void> {
  const ssrEntry = await resolveSSREntry(root);
  const ssrConfig: InlineConfig = {
    ...viteConfig,
    root,
    customLogger,
    logLevel: "silent",
    build: {
      ...(viteConfig?.build || {}),
      outDir: join(outDir, "server"),
      emptyOutDir: true,
      ssr: true,
      rollupOptions: {
        ...(viteConfig?.build?.rollupOptions || {}),
        input: ssrEntry,
        output: {
          format: "esm",
          entryFileNames: "entry-server.js",
        },
      },
    },
    ssr: {
      noExternal: ['virtual:emberkit-routes'],
    },
  };
  
  await viteBuild(ssrConfig);
}

interface RouteEntry {
  path: string;
  file: string;
  isStatic: boolean;
}

async function generateManifest(
  root: string,
  outDir: string,
  mode: string,
): Promise<void> {
  const routesDir = join(root, "src", "routes");
  const routes: RouteEntry[] = [];
  
  if (existsSync(routesDir)) {
    const files = await scanRouteFiles(routesDir);
    
    for (const file of files) {
      const relativePath = file.replace(routesDir, "").replace(/\\/g, "/");
      
      if (relativePath.includes("_layout") || relativePath.includes("_error") || relativePath.includes("_loading")) {
        continue;
      }
      if (relativePath.startsWith("/_api/") || relativePath.includes("/_api/")) {
        continue;
      }
      
      let routePath = relativePath
        .replace(/\.(tsx|ts|jsx|js|md|mdx)$/, "")
        .replace(/(^|\/)index$/, "$1")
        .replace(/\[\.\.\.(\w+)\]/g, ":$1*")
        .replace(/\[([^\]]+)\]/g, ":$1");
      
      if (routePath === "" || routePath === "/") {
        routePath = "/";
      } else {
        routePath = routePath.startsWith("/") ? routePath : "/" + routePath;
      }
      
      const isStatic = !routePath.includes(":");
      
      routes.push({
        path: routePath,
        file: relativePath,
        isStatic,
      });
    }
  }
  
  routes.sort((a, b) => {
    const aScore = a.path.includes(":") ? 0 : 1;
    const bScore = b.path.includes(":") ? 0 : 1;
    return bScore - aScore;
  });
  
  const indexHtmlPath = join(root, outDir, "index.html");
  let template = "";
  if (existsSync(indexHtmlPath)) {
    template = readFileSync(indexHtmlPath, "utf-8");
  }
  
  const manifest = {
    mode,
    routes,
    clientEntry: "/src/index.tsx",
    template,
    buildTime: new Date().toISOString(),
  };
  
  const manifestPath = join(root, outDir, "ssr-manifest.json");
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function scanRouteFiles(dir: string): Promise<string[]> {
  const { readdir, stat } = await import("fs/promises");
  const files: string[] = [];
  const extensions = new Set(["tsx", "ts", "jsx", "js", "md", "mdx"]);
  
  async function walk(currentDir: string) {
    let entries;
    try {
      entries = await readdir(currentDir);
    } catch {
      return;
    }
    
    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const fileStat = await stat(fullPath);
      
      if (fileStat.isDirectory()) {
        await walk(fullPath);
      } else {
        const ext = entry.split(".").pop() ?? "";
        if (extensions.has(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  await walk(dir);
  return files;
}

async function prerenderStaticRoutes(
  root: string,
  outDir: string,
  prerenderAll = false,
): Promise<void> {
  const manifestPath = join(root, outDir, "ssr-manifest.json");
  
  if (!existsSync(manifestPath)) {
    log("warn", "No SSR manifest found, skipping pre-rendering");
    return;
  }
  
  const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
  
  const serverEntryPath = join(root, outDir, "server", "entry-server.js");
  
  if (!existsSync(serverEntryPath)) {
    log("warn", "Server entry not found, skipping pre-rendering");
    return;
  }
  
  let serverModule: any;
  try {
    const serverUrl = pathToFileURL(serverEntryPath).href;
    serverModule = await import(serverUrl);
  } catch (e) {
    log("warn", `Failed to load server module: ${e}`);
    return;
  }
  
  const routesToPrerender = manifest.routes.filter((route: RouteEntry) => 
    prerenderAll || route.isStatic
  );
  
  for (const route of routesToPrerender) {
    if (route.path.includes(":")) {
      continue;
    }
    
    try {
      let html: string;

      if (serverModule.render) {
        html = await serverModule.render(route.path);
      } else if (serverModule.default && typeof serverModule.default === "function") {
        html = "<!DOCTYPE html><html><head></head><body></body></html>";
      } else {
        continue;
      }

      const outputPath = route.path === "/"
        ? join(root, outDir, "index.html")
        : join(root, outDir, route.path, "index.html");
      
      const outputDir = outputPath.replace(/\/index\.html$/, "");
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      
      writeFileSync(outputPath, html, "utf-8");
      console.log(`  ${cliBrand.spark()} ${COLORS.green}${route.path}${COLORS.reset}`);

    } catch (e) {
      console.log(`  ${COLORS.red}◆${COLORS.reset} ${COLORS.red}${route.path} - ${e}${COLORS.reset}`);
    }
  }
}
