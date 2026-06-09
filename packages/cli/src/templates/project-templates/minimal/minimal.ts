import {
  buildPackageJson,
  buildTsConfig,
  buildEmberkitConfig,
  buildIndexHtml,
  buildEntryFile,
  GITIGNORE,
} from "../_shared/base.js";

export const minimalTemplate: Record<string, string> = {
  "package.json": buildPackageJson(),
  "tsconfig.json": buildTsConfig(false),
  "emberkit.config.ts": buildEmberkitConfig('spa'),
  "index.html": buildIndexHtml(),
  ".gitignore": GITIGNORE,

  "src/index.tsx": buildEntryFile(),

  "src/routes/index.tsx": `import type { RouteComponent } from '@emberkit/core';

const Home: RouteComponent = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1>{{name}}</h1>
      <p>Built with EmberKit</p>
    </div>
  );
};

export default Home;`,
};
