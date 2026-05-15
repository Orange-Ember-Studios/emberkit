// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.2.8",
  ui: "^0.3.3",
  icons: "^0.2.6",
  cli: "^0.6.3",
  edge: "^0.2.3",
  tsconfig: "^0.2.1",
} as const;
