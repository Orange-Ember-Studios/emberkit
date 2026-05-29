// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.11.0",
  ui: "^9.0.1",
  icons: "^9.0.0",
  cli: "^4.0.0",
  edge: "^0.3.0",
  tsconfig: "^0.2.1",
} as const;
