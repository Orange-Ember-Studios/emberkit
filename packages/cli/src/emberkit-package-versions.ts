// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.10.0",
  ui: "^8.0.0",
  icons: "^8.0.0",
  cli: "^3.0.0",
  edge: "^0.3.0",
  tsconfig: "^0.2.1",
} as const;
