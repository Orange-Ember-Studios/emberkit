import docsPackage from '../../package.json' with { type: 'json' };
import { VERSION as coreVersion } from '@emberkit/core';
export { VERSION as UI_VERSION } from '@emberkit/ui';

/** @emberkit/docs app version (apps/docs/package.json) */
export const DOCS_VERSION = docsPackage.version;

/** @emberkit/core published version */
export const CORE_VERSION = coreVersion;

export function formatVersion(version: string): string {
  return version.startsWith('v') ? version : `v${version}`;
}
