// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.2.10",
  ui: "^0.3.4",
  icons: "^0.2.8",
  cli: "^0.6.5",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
