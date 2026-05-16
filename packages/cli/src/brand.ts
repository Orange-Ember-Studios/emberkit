/**
 * ANSI terminal brand marks (no emoji) for consistent CLI branding.
 */
export const cliBrand = {
  orange: "\x1b[38;5;208m",
  cyan: "\x1b[38;5;51m",
  red: "\x1b[38;5;196m",
  reset: "\x1b[0m",

  /** EmberKit logo mark in terminal output */
  logo(): string {
    return `${cliBrand.orange}◆${cliBrand.reset}`;
  },

  /** Success / highlight accent */
  spark(): string {
    return `${cliBrand.cyan}✦${cliBrand.reset}`;
  },

  /** Error line prefix */
  fail(): string {
    return `${cliBrand.red}◆${cliBrand.reset}`;
  },
};
