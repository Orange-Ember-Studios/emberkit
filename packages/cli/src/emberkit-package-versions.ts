// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.6.1",
  ui: "^4.0.0",
  icons: "^4.0.1",
  cli: "^0.7.1",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
