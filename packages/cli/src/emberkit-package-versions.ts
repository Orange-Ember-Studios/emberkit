// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.3.8",
  ui: "^1.0.1",
  icons: "^1.0.8",
  cli: "^0.6.8",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
