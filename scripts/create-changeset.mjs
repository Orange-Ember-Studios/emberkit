#!/usr/bin/env node
/**
 * Write a Changesets markdown file without the interactive wizard.
 *
 * Usage:
 *   pnpm changeset:add --message "Summary" @emberkit/ui:minor
 *   pnpm changeset:add -m "Fix CLI" @emberkit/cli:patch @emberkit/core:patch
 *   pnpm changeset:add --from-git main --bump patch -m "Sync versions"
 *
 * Package bump pairs are name:major|minor|patch (npm scope allowed).
 * --from-git: include every workspace package that has changes vs ref (staged +
 * unstaged + committed ahead of ref). Respects "ignore" in .changeset/config.json.
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function loadChangesetConfig() {
  const path = join(REPO_ROOT, ".changeset", "config.json");
  if (!existsSync(path)) {
    return { ignore: [] };
  }
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { ignore: [] };
  }
}

function parsePkgBump(s) {
  const lastColon = s.lastIndexOf(":");
  if (lastColon <= 0) {
    throw new Error(`Invalid pkg:bump "${s}" (expected @scope/name:patch)`);
  }
  const name = s.slice(0, lastColon);
  const type = s.slice(lastColon + 1);
  if (!["major", "minor", "patch"].includes(type)) {
    throw new Error(`Invalid bump "${type}" for ${name} (use major|minor|patch)`);
  }
  return { name, type };
}

function makeFileId(summary) {
  const base = summary
    .slice(0, 48)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).slice(2, 8);
  return base ? `${base}-${suffix}` : `change-${suffix}`;
}

function changedFilesSince(ref) {
  const set = new Set();
  const add = (text) => {
    for (const line of text.split("\n")) {
      const t = line.trim();
      if (t) set.add(t);
    }
  };
  try {
    add(
      execSync(`git diff --name-only ${ref}`, {
        cwd: REPO_ROOT,
        encoding: "utf8",
      }),
    );
  } catch {
    /* ref may be invalid; caller handles empty result */
  }
  try {
    add(
      execSync(`git diff --name-only --cached ${ref}`, {
        cwd: REPO_ROOT,
        encoding: "utf8",
      }),
    );
  } catch {
    /* ignore */
  }
  try {
    const base = execSync(`git merge-base ${ref} HEAD`, {
      cwd: REPO_ROOT,
      encoding: "utf8",
    }).trim();
    if (base) {
      add(
        execSync(`git diff --name-only ${base}..HEAD`, {
          cwd: REPO_ROOT,
          encoding: "utf8",
        }),
      );
    }
  } catch {
    /* ignore */
  }
  return [...set];
}

function changedPackageNamesSince(ref) {
  const ignore = new Set(loadChangesetConfig().ignore ?? []);
  const out = new Set();
  const names = changedFilesSince(ref);

  for (const rel of names) {
    const parts = rel.split("/");
    if (parts[0] !== "packages" && parts[0] !== "apps") continue;
    const pkgRoot = join(REPO_ROOT, parts[0], parts[1]);
    const pkgJsonPath = join(pkgRoot, "package.json");
    if (!existsSync(pkgJsonPath)) continue;
    let pkgJson;
    try {
      pkgJson = JSON.parse(readFileSync(pkgJsonPath, "utf8"));
    } catch {
      continue;
    }
    const n = pkgJson.name;
    if (typeof n === "string" && n && !ignore.has(n)) out.add(n);
  }
  return [...out].sort();
}

function usage() {
  console.error(`
Usage:
  pnpm changeset:add --message "…" <@scope/pkg:minor> […]
  pnpm changeset:add -m "…" --from-git main --bump patch

Options:
  -m, --message <text>     Changeset summary (changelog entry)
  --from-git <ref>         Resolve packages from git diff vs ref
  --bump <major|minor|patch>  Bump type when using --from-git (required with --from-git)
`);
}

function main() {
  const argv = process.argv.slice(2);
  let message = "";
  let fromGit = null;
  let defaultBump = null;
  const pairs = [];

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help") {
      usage();
      process.exit(0);
    }
    if (a === "-m" || a === "--message") {
      message = argv[++i] ?? "";
      continue;
    }
    if (a === "--from-git") {
      fromGit = argv[++i] ?? "";
      continue;
    }
    if (a === "--bump") {
      defaultBump = argv[++i] ?? "";
      continue;
    }
    if (a.startsWith("-")) {
      console.error(`Unknown option: ${a}`);
      usage();
      process.exit(1);
    }
    pairs.push(parsePkgBump(a));
  }

  if (!message.trim()) {
    console.error("Error: --message / -m is required.");
    usage();
    process.exit(1);
  }

  let releases;
  if (fromGit != null) {
    if (!fromGit) {
      console.error("Error: --from-git needs a ref (e.g. main).");
      process.exit(1);
    }
    if (!["major", "minor", "patch"].includes(defaultBump ?? "")) {
      console.error("Error: --from-git requires --bump major|minor|patch.");
      process.exit(1);
    }
    const names = changedPackageNamesSince(fromGit);
    if (names.length === 0) {
      console.error(
        `No versionable packages found in diff vs ${fromGit} (or only ignored apps).`,
      );
      process.exit(1);
    }
    releases = names.map((name) => ({ name, type: defaultBump }));
  } else {
    if (pairs.length === 0) {
      console.error("Error: pass at least one pkg:bump or use --from-git.");
      usage();
      process.exit(1);
    }
    const seen = new Map();
    for (const { name, type } of pairs) {
      seen.set(name, type);
    }
    releases = [...seen.entries()].map(([name, type]) => ({ name, type }));
  }

  const headerLines = ["---"];
  for (const { name, type } of releases) {
    headerLines.push(`"${name}": ${type}`);
  }
  headerLines.push("---");
  const body = `${headerLines.join("\n")}\n\n${message.trim()}\n`;

  const dir = join(REPO_ROOT, ".changeset");
  if (!existsSync(dir)) {
    console.error("Error: .changeset directory missing. Run: pnpm changeset init");
    process.exit(1);
  }

  const id = makeFileId(message);
  const path = join(dir, `${id}.md`);
  writeFileSync(path, body, "utf8");
  console.log(path);
}

main();
