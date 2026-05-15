// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.2.7",
  ui: "^0.3.1",
  icons: "^0.2.4",
  cli: "^0.6.2",
  edge: "^0.2.3",
  tsconfig: "^0.2.1",
} as const;
