import { createServer as createHttpServer } from "http";
import { join, extname } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { pathToFileURL } from "url";
import { normalizeSSRRenderResult } from "../utils/ssr-render-result.js";

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

const EMBERKIT_ASCII = `
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║     ${COLORS.orange}◆${COLORS.reset}  E M B E R K I T  ${COLORS.orange}◆${COLORS.reset}           ║
    ║                                       ║
    ║       ░▒▓█ PREVIEW SERVER █▓▒░        ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
`;

function log(level: "info" | "warn" | "error" | "success" | "request", message: string) {
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  const prefix = `${COLORS.gray}[${timestamp}]${COLORS.reset}`;
  
  const levelColors: Record<string, string> = {
    info: COLORS.cyan,
    warn: COLORS.yellow,
    error: COLORS.red,
    success: COLORS.green,
    request: COLORS.dim,
  };
  
  const levelLabel = `${levelColors[level]}${level.toUpperCase().padEnd(7)}${COLORS.reset}`;
  const emberTag = `${COLORS.ember}[emberkit]${COLORS.reset}`;
  
  console.log(`${prefix} ${levelLabel} ${emberTag} ${message}`);
}

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".mjs": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
  ".otf": "font/otf",
  ".webp": "image/webp",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

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

interface SSRManifest {
  mode: string;
  routes: Array<{ path: string; file: string; isStatic: boolean }>;
  template: string;
}

export async function preview(_args: string[]): Promise<void> {
  const root = process.cwd();
  
  console.clear();
  console.log(`${COLORS.orange}${EMBERKIT_ASCII}${COLORS.reset}`);
  
  const emberkitConfig = await loadEmberKitConfig(root);
  const configMode = (emberkitConfig as any)?.mode || "hybrid";
  const outDir = (emberkitConfig as any)?.build?.outDir || "dist";
  const distPath = join(root, outDir);
  
  if (!existsSync(distPath)) {
    log("error", `Build directory not found: ${distPath}`);
    log("info", "Run 'emberkit build' first to create a production build.");
    process.exit(1);
  }
  
  const manifestPath = join(distPath, "ssr-manifest.json");
  let manifest: SSRManifest | null = null;
  
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    log("info", `Loaded SSR manifest (mode: ${manifest?.mode || configMode})`);
  }

  const mode = manifest?.mode || configMode;
  
  const serverEntryPath = join(distPath, "server", "entry-server.js");
  let serverModule: any = null;
  
  if ((mode === "ssr" || mode === "hybrid") && existsSync(serverEntryPath)) {
    try {
      const serverUrl = pathToFileURL(serverEntryPath).href;
      serverModule = await import(serverUrl);
      log("info", "Loaded SSR server module");
    } catch (e) {
      log("warn", `Could not load SSR module: ${e}`);
    }
  }
  
  const port = (emberkitConfig as any)?.server?.port || 4173;
  const host = (emberkitConfig as any)?.server?.host || "localhost";
  
  const server = createHttpServer(async (req, res) => {
    const url = req.url ?? "/";
    const urlObj = new URL(url, `http://${req.headers.host || "localhost"}`);
    const pathname = urlObj.pathname;
    
    const serveStaticFile = (filePath: string): boolean => {
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        const ext = extname(filePath);
        const mimeType = MIME_TYPES[ext] || "application/octet-stream";
        
        res.setHeader("Content-Type", mimeType);
        res.setHeader("Cache-Control", "public, max-age=31536000");
        res.end(readFileSync(filePath));
        return true;
      }
      return false;
    };
    
    const staticPath = join(distPath, pathname);
    if (serveStaticFile(staticPath)) {
      log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(static)${COLORS.reset}`);
      return;
    }
    
    const wantsHtml =
      req.headers.accept?.includes("text/html") ||
      (req.headers.accept?.includes("*/*") && !pathname.includes("."));

    if (
      pathname !== "/" &&
      !pathname.includes(".") &&
      (mode === "static" || mode === "hybrid")
    ) {
      const htmlPath = join(distPath, pathname, "index.html");
      if (serveStaticFile(htmlPath)) {
        log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(prerendered)${COLORS.reset}`);
        return;
      }
    }

    if ((mode === "ssr" || mode === "hybrid") && serverModule) {
      if (wantsHtml) {
        try {
          const result = normalizeSSRRenderResult(await serverModule.render(url));
          res.statusCode = result.status;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(result.html);
          log("request", `${COLORS.green}${result.status}${COLORS.reset} ${pathname} ${COLORS.dim}(ssr)${COLORS.reset}`);
          return;
        } catch (e) {
          log("error", `SSR render failed: ${e}`);
        }
      }
    }
    
    const indexPath = join(distPath, "index.html");
    if (existsSync(indexPath)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(readFileSync(indexPath));
      log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(fallback)${COLORS.reset}`);
      return;
    }
    
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>404 - Not Found</h1>");
    log("request", `${COLORS.yellow}404${COLORS.reset} ${pathname}`);
  });
  
  server.listen(port, host, () => {
    log("success", "Preview server is running!");
    console.log("");
    console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.bright}Local:${COLORS.reset}   ${COLORS.cyan}http://${host}:${port}${COLORS.reset}`);
    console.log("");
    console.log(`   ${COLORS.gray}Mode:${COLORS.reset}    ${COLORS.ember}${manifest?.mode || mode}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Dir:${COLORS.reset}     ${COLORS.dim}${outDir}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Press${COLORS.reset}    ${COLORS.dim}Ctrl+C${COLORS.reset} ${COLORS.gray}to stop${COLORS.reset}`);
    console.log("");
  });
  
  return new Promise(() => {});
}
