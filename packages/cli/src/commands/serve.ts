import { createServer as createHttpServer } from "http";
import { join, extname } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { pathToFileURL } from "url";

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
    ║      ░▒▓█ PRODUCTION SERVER █▓▒░      ║
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
  ".map": "application/json",
};

interface SSRManifest {
  mode: string;
  routes: Array<{ path: string; file: string; isStatic: boolean }>;
  template: string;
}

interface RouteMatch {
  route: { path: string; file: string; isStatic: boolean };
  params: Record<string, string>;
}

function routeToRegex(routePath: string): { regex: RegExp; paramNames: string[] } {
  const paramNames: string[] = [];
  const regexStr = routePath
    .replace(/:([^/]+)\*/g, (_, name) => {
      paramNames.push(name);
      return "(.*)";
    })
    .replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
  return { regex: new RegExp("^" + regexStr + "$"), paramNames };
}

function matchRoute(routes: SSRManifest["routes"], pathname: string): RouteMatch | null {
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  
  const sortedRoutes = [...routes].sort((a, b) => {
    const aScore = a.path.includes(":") ? 0 : 1;
    const bScore = b.path.includes(":") ? 0 : 1;
    return bScore - aScore;
  });
  
  for (const route of sortedRoutes) {
    const pattern = routeToRegex(route.path);
    const match = normalizedPath.match(pattern.regex);
    if (match) {
      const params: Record<string, string> = {};
      pattern.paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });
      return { route, params };
    }
  }
  return null;
}

export async function serve(args: string[]): Promise<void> {
  const portArg = args.find((a) => a.startsWith("--port="));
  const hostArg = args.find((a) => a.startsWith("--host="));
  const dirArg = args.find((a) => a.startsWith("--dir="));
  
  const root = process.cwd();
  const outDir = dirArg?.split("=")[1] || "dist";
  const distPath = join(root, outDir);
  
  console.log(`${COLORS.orange}${EMBERKIT_ASCII}${COLORS.reset}`);
  
  if (!existsSync(distPath)) {
    log("error", `Build directory not found: ${distPath}`);
    log("info", "Run 'emberkit build' first to create a production build.");
    process.exit(1);
  }
  
  const manifestPath = join(distPath, "ssr-manifest.json");
  let manifest: SSRManifest | null = null;
  
  if (existsSync(manifestPath)) {
    manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));
    log("info", `Loaded SSR manifest (mode: ${manifest?.mode})`);
  } else {
    log("warn", "No SSR manifest found, serving as static site");
  }
  
  const serverEntryPath = join(distPath, "server", "entry-server.js");
  let serverModule: any = null;
  
  if (manifest && (manifest.mode === "ssr" || manifest.mode === "hybrid") && existsSync(serverEntryPath)) {
    try {
      const serverUrl = pathToFileURL(serverEntryPath).href;
      serverModule = await import(serverUrl);
      log("info", "Loaded SSR server module");
    } catch (e) {
      log("warn", `Could not load SSR module: ${e}`);
    }
  }
  
  const port = parseInt(portArg?.split("=")[1] || "3000", 10);
  const host = hostArg?.split("=")[1] || "0.0.0.0";
  
  let requestCount = 0;
  const startTime = Date.now();
  
  const server = createHttpServer(async (req, res) => {
    requestCount++;
    const reqStart = Date.now();
    const url = req.url ?? "/";
    const urlObj = new URL(url, `http://${req.headers.host || "localhost"}`);
    const pathname = urlObj.pathname;
    
    res.setHeader("X-Powered-By", "EmberKit");
    
    const serveStaticFile = (filePath: string): boolean => {
      if (existsSync(filePath) && statSync(filePath).isFile()) {
        const ext = extname(filePath);
        const mimeType = MIME_TYPES[ext] || "application/octet-stream";
        
        res.setHeader("Content-Type", mimeType);
        
        if (ext === ".html") {
          res.setHeader("Cache-Control", "no-cache");
        } else if (pathname.includes("/assets/")) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=86400");
        }
        
        res.end(readFileSync(filePath));
        return true;
      }
      return false;
    };
    
    const staticPath = join(distPath, pathname);
    if (serveStaticFile(staticPath)) {
      const ms = Date.now() - reqStart;
      log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(static, ${ms}ms)${COLORS.reset}`);
      return;
    }
    
    if (pathname !== "/" && !pathname.includes(".")) {
      const htmlPath = join(distPath, pathname, "index.html");
      if (serveStaticFile(htmlPath)) {
        const ms = Date.now() - reqStart;
        log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(prerendered, ${ms}ms)${COLORS.reset}`);
        return;
      }
    }
    
    if (manifest && (manifest.mode === "ssr" || manifest.mode === "hybrid") && serverModule) {
      if (req.headers.accept?.includes("text/html")) {
        const routeMatch = matchRoute(manifest.routes, pathname);
        
        if (routeMatch && (manifest.mode === "ssr" || !routeMatch.route.isStatic)) {
          try {
            if (serverModule.render) {
              const html = await serverModule.render(url, routeMatch.params);
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.setHeader("Cache-Control", "no-cache");
              res.end(typeof html === "string" ? html : html?.html ?? "");
              
              const ms = Date.now() - reqStart;
              log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(ssr, ${ms}ms)${COLORS.reset}`);
              return;
            }
          } catch (e) {
            log("error", `SSR render failed for ${pathname}: ${e}`);
          }
        }
      }
    }
    
    const indexPath = join(distPath, "index.html");
    if (existsSync(indexPath)) {
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("Cache-Control", "no-cache");
      res.end(readFileSync(indexPath));
      
      const ms = Date.now() - reqStart;
      log("request", `${COLORS.green}200${COLORS.reset} ${pathname} ${COLORS.dim}(spa fallback, ${ms}ms)${COLORS.reset}`);
      return;
    }
    
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>404 - Not Found</h1>");
    
    const ms = Date.now() - reqStart;
    log("request", `${COLORS.yellow}404${COLORS.reset} ${pathname} ${COLORS.dim}(${ms}ms)${COLORS.reset}`);
  });
  
  server.listen(port, host, () => {
    log("success", "Production server is running!");
    console.log("");
    console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.bright}Local:${COLORS.reset}   ${COLORS.cyan}http://localhost:${port}${COLORS.reset}`);
    
    if (host === "0.0.0.0" || host === "::") {
      import("os").then((os) => {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name] || []) {
            if (iface.family === "IPv4" && !iface.internal) {
              console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.bright}Network:${COLORS.reset} ${COLORS.cyan}http://${iface.address}:${port}${COLORS.reset}`);
            }
          }
        }
      });
    }
    
    console.log("");
    console.log(`   ${COLORS.gray}Mode:${COLORS.reset}    ${COLORS.ember}${manifest?.mode || "static"}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Dir:${COLORS.reset}     ${COLORS.dim}${outDir}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Routes:${COLORS.reset}  ${COLORS.dim}${manifest?.routes.length || 0}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Press${COLORS.reset}    ${COLORS.dim}Ctrl+C${COLORS.reset} ${COLORS.gray}to stop${COLORS.reset}`);
    console.log("");
  });
  
  process.on("SIGINT", () => {
    const uptime = Math.round((Date.now() - startTime) / 1000);
    console.log("");
    log("info", `Shutting down... (served ${requestCount} requests in ${uptime}s)`);
    server.close();
    process.exit(0);
  });
  
  return new Promise(() => {});
}
