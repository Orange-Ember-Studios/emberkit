// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.7.0",
  ui: "^5.0.0",
  icons: "^5.0.0",
  cli: "^0.7.2",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
