import { createServer, type UserConfig, type LogLevel } from "vite";
import { join } from "path";
import { existsSync } from "fs";
import { pathToFileURL } from "url";
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

const EMBERKIT_ASCII = `
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║     ${COLORS.orange}◆${COLORS.reset}  E M B E R K I T  ${COLORS.orange}◆${COLORS.reset}           ║
    ║                                       ║
    ║        ░▒▓█ DEV SERVER █▓▒░           ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
`;

function log(level: "info" | "warn" | "error" | "success" | "debug", message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
  const prefix = `${COLORS.gray}[${timestamp}]${COLORS.reset}`;
  
  const levelColors: Record<string, string> = {
    info: COLORS.cyan,
    warn: COLORS.yellow,
    error: COLORS.red,
    success: COLORS.green,
    debug: COLORS.gray,
  };
  
  const levelLabel = `${levelColors[level]}${level.toUpperCase().padEnd(7)}${COLORS.reset}`;
  const emberTag = `${COLORS.ember}[emberkit]${COLORS.reset}`;
  
  let output = `${prefix} ${levelLabel} ${emberTag} ${message}`;
  
  if (meta && Object.keys(meta).length > 0) {
    const metaStr = Object.entries(meta)
      .map(([k, v]) => `${COLORS.gray}${k}=${COLORS.reset}${COLORS.dim}${v}${COLORS.reset}`)
      .join(" ");
    output += ` ${metaStr}`;
  }
  
  console.log(output);
}

async function loadEmberKitConfig(root: string): Promise<Record<string, unknown> | null> {
  const configPath = join(root, "emberkit.config.ts");
  const configPathJs = join(root, "emberkit.config.js");
  
  const finalPath = existsSync(configPath) ? configPath : existsSync(configPathJs) ? configPathJs : null;
  
  if (!finalPath) {
    return null;
  }
  
  try {
    const configUrl = pathToFileURL(finalPath).href;
    const mod = await import(configUrl);
    return mod.default || mod;
  } catch {
    return null;
  }
}

async function loadViteConfig(root: string): Promise<UserConfig | null> {
  const viteConfigPath = join(root, "vite.config.ts");
  const viteConfigPathJs = join(root, "vite.config.js");
  
  const finalPath = existsSync(viteConfigPath) ? viteConfigPath : existsSync(viteConfigPathJs) ? viteConfigPathJs : null;
  
  if (!finalPath) {
    return null;
  }
  
  try {
    const configUrl = pathToFileURL(finalPath).href;
    const mod = await import(configUrl);
    const config = mod.default || mod;
    return typeof config === "function" ? config({ mode: "development", command: "serve" }) : config;
  } catch {
    return null;
  }
}

export async function dev(_args: string[]): Promise<void> {
  const root = process.cwd();
  
  console.clear();
  console.log(`${COLORS.orange}${EMBERKIT_ASCII}${COLORS.reset}`);
  
  log("info", "Initializing development server...");
  
  const emberkitConfig = await loadEmberKitConfig(root);
  const viteFileConfig = await loadViteConfig(root);
  const viteConfig = mergeEmberkitViteConfig(emberkitConfig, viteFileConfig);
  
  if (emberkitConfig) {
    log("debug", "Loaded emberkit.config", { mode: (emberkitConfig as any).mode || "hybrid" });
  }
  
  const serverPort = (emberkitConfig as any)?.server?.port 
    || (viteConfig as any)?.server?.port 
    || 3000;
  const serverHost = (emberkitConfig as any)?.server?.host 
    || (viteConfig as any)?.server?.host 
    || "localhost";
  
  const customLogger = {
    info: (msg: string) => {
      if (!msg.includes("VITE") && !msg.includes("vite")) {
        log("info", msg);
      }
    },
    warn: (msg: string) => log("warn", msg),
    error: (msg: string) => log("error", msg),
    warnOnce: (msg: string) => log("warn", msg),
    clearScreen: () => {},
    hasWarned: false,
    hasErrorLogged: (_error: Error) => false,
  };
  
  try {
    const mergedConfig: UserConfig = {
      ...viteConfig,
      root,
      customLogger,
      clearScreen: false,
      server: {
        ...(viteConfig?.server || {}),
        port: serverPort,
        host: serverHost,
      },
      logLevel: "silent" as LogLevel,
    };
    
    const server = await createServer(mergedConfig);
    
    await server.listen();
    
    const info = server.config.server;
    const protocol = info.https ? "https" : "http";
    const host = typeof info.host === "string" ? info.host : "localhost";
    const port = info.port || serverPort;
    const address = `${protocol}://${host}:${port}`;
    
    console.log("");
    log("success", "Server is running!");
    console.log("");
    console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.bright}Local:${COLORS.reset}   ${COLORS.cyan}${address}${COLORS.reset}`);
    
    if (host === "0.0.0.0" || host === "::") {
      const os = await import("os");
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name] || []) {
          if (iface.family === "IPv4" && !iface.internal) {
            console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.bright}Network:${COLORS.reset} ${COLORS.cyan}${protocol}://${iface.address}:${port}${COLORS.reset}`);
          }
        }
      }
    }
    
    const mode = (emberkitConfig as any)?.mode || "hybrid";
    console.log("");
    console.log(`   ${COLORS.gray}Mode:${COLORS.reset}    ${COLORS.ember}${mode}${COLORS.reset}`);
    console.log(`   ${COLORS.gray}Press${COLORS.reset}    ${COLORS.dim}h + enter${COLORS.reset} ${COLORS.gray}to show help${COLORS.reset}`);
    console.log("");
    
    server.watcher.on("change", (file) => {
      const relativePath = file.replace(root, "").replace(/^\//, "");
      log("info", `File changed: ${COLORS.cyan}${relativePath}${COLORS.reset}`);
    });
    
    process.stdin.setRawMode?.(false);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    
    let inputBuffer = "";
    process.stdin.on("data", async (key: string) => {
      if (key === "\u0003") {
        log("info", "Shutting down...");
        await server.close();
        process.exit(0);
      }
      
      if (key === "\r" || key === "\n") {
        const cmd = inputBuffer.trim().toLowerCase();
        inputBuffer = "";
        
        if (cmd === "h" || cmd === "help") {
          console.log("");
          console.log(`   ${COLORS.bright}${COLORS.orange}EmberKit Dev Server Commands${COLORS.reset}`);
          console.log(`   ${COLORS.gray}─────────────────────────────${COLORS.reset}`);
          console.log(`   ${COLORS.cyan}r${COLORS.reset}     Restart server`);
          console.log(`   ${COLORS.cyan}u${COLORS.reset}     Show server URL`);
          console.log(`   ${COLORS.cyan}c${COLORS.reset}     Clear console`);
          console.log(`   ${COLORS.cyan}q${COLORS.reset}     Quit`);
          console.log("");
        } else if (cmd === "r" || cmd === "restart") {
          log("info", "Restarting server...");
          await server.restart();
          log("success", "Server restarted!");
        } else if (cmd === "u" || cmd === "url") {
          console.log(`   ${COLORS.bright}${COLORS.orange}➜${COLORS.reset}  ${COLORS.cyan}${address}${COLORS.reset}`);
        } else if (cmd === "c" || cmd === "clear") {
          console.clear();
          console.log(`${COLORS.orange}${EMBERKIT_ASCII}${COLORS.reset}`);
        } else if (cmd === "q" || cmd === "quit") {
          log("info", "Shutting down...");
          await server.close();
          process.exit(0);
        }
      } else {
        inputBuffer += key;
      }
    });
    
  } catch (error) {
    log("error", `Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}
