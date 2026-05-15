// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.2.6-alpha.0",
  ui: "^0.3.0-alpha.2",
  icons: "^0.2.3-alpha.1",
  cli: "^0.6.1-alpha.12",
  edge: "^0.2.3-alpha.0",
  tsconfig: "^0.2.1",
} as const;
