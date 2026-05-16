// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.3.5",
  ui: "^1.0.0",
  icons: "^1.0.5",
  cli: "^0.6.7",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
