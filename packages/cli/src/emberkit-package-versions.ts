// Semver ranges for @emberkit/* packages written into generated projects.
// When releasing libraries, bump these to match packages/*/package.json "version".
export const EMBERKIT_PACKAGE_VERSIONS = {
  core: "^0.4.2",
  ui: "^2.0.1",
  icons: "^2.0.2",
  cli: "^0.6.9",
  edge: "^0.2.4",
  tsconfig: "^0.2.1",
} as const;
