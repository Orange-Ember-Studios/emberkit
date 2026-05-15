import { existsSync, mkdirSync, writeFileSync } from "fs";
import { resolve, join, dirname } from "path";
import { execSync } from "child_process";
import { getPackageManager, getInstallCommand } from "../utils/filesystem.js";
import { formatTemplate, toKebabCase } from "../templates/index.js";
import { starterFiles } from "../templates/project-templates/starter-kit/starter.js";
import { withUiTemplate } from "../templates/project-templates/starter-kit/with-ui.js";
import { minimalTemplate } from "../templates/project-templates/minimal/minimal.js";
import { blogTemplate } from "../templates/project-templates/blog/blog.js";
import { saasTemplate } from "../templates/project-templates/saas/saas.js";
import { dashboardTemplate } from "../templates/project-templates/dashboard/dashboard.js";
import { apiTemplate } from "../templates/project-templates/api/api.js";

export interface CreateOptions {
  name: string;
  directory?: string;
  template?: string;
  noInstall?: boolean;
}

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";

const BRIGHT_BLACK = "\x1b[90m";
const BRIGHT_RED = "\x1b[91m";
const BRIGHT_GREEN = "\x1b[92m";
const BRIGHT_BLUE = "\x1b[94m";
const BRIGHT_CYAN = "\x1b[96m";
const BRIGHT_WHITE = "\x1b[97m";
const BRIGHT_YELLOW = "\x1b[93m";

const ORANGE_BG = "\x1b[48;5;208m";

export const TEMPLATES = [
  { id: "basic", name: "Basic", desc: "Simple starter with Tailwind CSS", files: starterFiles },
  { id: "with-ui", name: "With UI", desc: "Starter with EmberKit UI components", files: withUiTemplate },
  { id: "minimal", name: "Minimal", desc: "Barebones project, no CSS framework", files: minimalTemplate },
  { id: "blog", name: "Blog", desc: "Blog with file-based routing and Tailwind", files: blogTemplate },
  { id: "saas", name: "SaaS", desc: "SaaS landing page with auth routes", files: saasTemplate },
  { id: "dashboard", name: "Dashboard", desc: "Admin dashboard with sidebar layout", files: dashboardTemplate },
  { id: "api", name: "API", desc: "REST API server with CRUD endpoints", files: apiTemplate },
];

function getTemplateById(id: string) {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}

function printTemplateList() {
  console.log(`\n  ${BRIGHT_WHITE + BOLD}Available templates:${RESET}\n`);
  for (const t of TEMPLATES) {
    const isDefault = t.id === "basic";
    const label = isDefault ? ` ${BRIGHT_YELLOW}(default)${RESET}` : "";
    console.log(`    ${BRIGHT_CYAN}${t.id.padEnd(12)}${RESET} ${BRIGHT_WHITE}${t.name}${RESET}${label}`);
    console.log(`    ${DIM}${" ".repeat(16)}${t.desc}${RESET}\n`);
  }
}

function printHeader() {
  const header = `
${BRIGHT_BLACK}╭─────────────────────────────────────────────────────╮${RESET}
${BRIGHT_BLACK}│${RESET}   ${ORANGE_BG}${BRIGHT_BLACK} EmberKit ${RESET}                                         ${BRIGHT_BLACK}│${RESET}
${BRIGHT_BLACK}│${RESET}   ${DIM}A minimalist TypeScript-first JSX framework${RESET}     ${BRIGHT_BLACK}│${RESET}
${BRIGHT_BLACK}╰─────────────────────────────────────────────────────╯${RESET}
`;
  console.log(header);
}

function printStep(step: number, total: number, message: string) {
  void total;
  const numStr = BRIGHT_CYAN + String(step).padStart(2, "0") + RESET;
  const bar = DIM + "━".repeat(40 - message.length) + RESET;
  console.log(`  ${numStr} ${BRIGHT_WHITE + message + RESET} ${bar}`);
}

function printSuccess(message: string) {
  const check = BRIGHT_GREEN + "✓" + RESET;
  console.log(`\n  ${check} ${BRIGHT_GREEN + message + RESET}\n`);
}

function printError(message: string) {
  const err = BRIGHT_RED + "✗" + RESET;
  console.log(`\n  ${err} ${BRIGHT_RED + message + RESET}\n`);
}

function printInfo(message: string) {
  const info = BRIGHT_BLUE + "›" + RESET;
  console.log(`  ${info} ${DIM + message + RESET}`);
}

function getNpmPackageName(name: string): string {
  const kebab = toKebabCase(name);
  return kebab.startsWith("@") ? kebab : kebab.replace(/^emberkit-/, "");
}

export async function create(options: CreateOptions): Promise<void> {
  printHeader();

  const { name, noInstall = false } = options;
  const directory = options.directory ?? toKebabCase(name);
  const targetDir = resolve(process.cwd(), directory);
  const templateId = options.template || "basic";

  const template = getTemplateById(templateId);

  if (templateId !== "basic" && !TEMPLATES.find((t) => t.id === templateId)) {
    printError(`Template "${templateId}" not found.`);
    printTemplateList();
    process.exit(1);
  }

  printStep(1, 3, "Collecting project info");
  console.log(`    ${DIM}Project name:${RESET} ${BRIGHT_WHITE + name + RESET}`);
  console.log(`    ${DIM}Directory:${RESET} ${BRIGHT_WHITE + directory + RESET}`);
  console.log(`    ${DIM}Template:${RESET} ${BRIGHT_WHITE + template.name + RESET} (${template.id})\n`);

  if (existsSync(targetDir)) {
    printError(`Directory "${directory}" already exists.`);
    process.exit(1);
  }

  printStep(2, 3, "Scaffolding project");
  printInfo(`Creating ${directory}/`);

  mkdirSync(targetDir, { recursive: true });

  const templateVars = {
    name,
    packageName: getNpmPackageName(name),
    kebabName: toKebabCase(name),
  };

  const templateFiles = template.files;

  for (const [filePath, content] of Object.entries(templateFiles)) {
    const fullPath = join(targetDir, filePath);
    const dir = dirname(fullPath);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    writeFileSync(fullPath, formatTemplate(content, templateVars), "utf-8");
    printInfo(`Created ${filePath}`);
  }

  printSuccess("Project scaffolded");

  if (!noInstall) {
    printStep(3, 3, "Installing dependencies");

    const pm = getPackageManager();
    const installCmd = getInstallCommand();

    console.log(`    ${DIM}Using:${RESET} ${BRIGHT_CYAN + pm + RESET}\n`);

    try {
      execSync(installCmd, { cwd: targetDir, stdio: "inherit" });
      printSuccess("Dependencies installed");
    } catch {
      printError("Failed to install dependencies");
      console.log(`  ${DIM}Run "${installCmd}" manually in ${directory}/${RESET}\n`);
    }
  }

  console.log(`\n${BRIGHT_WHITE}╭────────────────────────────────────────╮${RESET}`);
  console.log(`${BRIGHT_WHITE}│${RESET}  ${BRIGHT_GREEN + BOLD}Success!${RESET} Your project is ready.      ${BRIGHT_WHITE}│${RESET}`);
  console.log(`${BRIGHT_WHITE}╰────────────────────────────────────────╯${RESET}\n`);

  console.log(`  ${DIM}To start development:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}cd${RESET} ${directory}`);
  if (noInstall) {
    console.log(`    ${BRIGHT_CYAN}${getInstallCommand()}${RESET}`);
  }
  console.log(`    ${BRIGHT_CYAN}emberkit dev${RESET}\n`);

  console.log(`  ${DIM}To build for production:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}emberkit build${RESET}\n`);

  console.log(`  ${DIM}To preview the build:${RESET}`);
  console.log(`    ${BRIGHT_CYAN}emberkit preview${RESET}\n`);
}