export interface SSGConfig {
  outDir: string;
  routes: string[];
  prerender?: boolean;
  cacheControl?: string;
}

export interface SSGManifest {
  pages: Map<string, string>;
  errors: Map<string, Error>;
  buildTime: number;
}

export interface StaticPage {
  path: string;
  html: string;
  status: number;
  headers: Record<string, string>;
}

export class SSGBuilder {
  private config: Required<SSGConfig>;
  private manifest: SSGManifest;

  constructor(config: SSGConfig) {
    this.config = {
      outDir: config.outDir,
      routes: config.routes,
      prerender: config.prerender ?? true,
      cacheControl: config.cacheControl ?? 'public, max-age=3600',
    };
    this.manifest = {
      pages: new Map(),
      errors: new Map(),
      buildTime: 0,
    };
  }

  async build(renderFn: (path: string) => Promise<string>): Promise<SSGManifest> {
    const start = Date.now();

    const pages = await Promise.allSettled(
      this.config.routes.map(async (route) => {
        const html = await renderFn(route);
        const page: StaticPage = {
          path: route,
          html,
          status: 200,
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': this.config.cacheControl,
          },
        };
        this.manifest.pages.set(route, html);
        return page;
      }),
    );

    for (let i = 0; i < pages.length; i++) {
      const result = pages[i];
      if (result.status === 'rejected') {
        this.manifest.errors.set(
          this.config.routes[i],
          result.reason,
        );
      }
    }

    this.manifest.buildTime = Date.now() - start;
    return this.manifest;
  }

  getManifest(): SSGManifest {
    return this.manifest;
  }

  getBuildStats(): { pages: number; errors: number; time: number } {
    return {
      pages: this.manifest.pages.size,
      errors: this.manifest.errors.size,
      time: this.manifest.buildTime,
    };
  }
}

export async function generateStaticPages(
  routes: string[],
  renderFn: (path: string) => Promise<string>,
  options: Partial<SSGConfig> = {},
): Promise<SSGManifest> {
  const builder = new SSGBuilder({
    outDir: options.outDir ?? './dist',
    routes,
    ...options,
  });

  return builder.build(renderFn);
}

export function createSSGManifest(pages: StaticPage[]): SSGManifest {
  return {
    pages: new Map(pages.map((p) => [p.path, p.html])),
    errors: new Map(),
    buildTime: 0,
  };
}

export function serializeManifest(manifest: SSGManifest): string {
  return JSON.stringify({
    pages: Array.from(manifest.pages.entries()),
    errors: Array.from(manifest.errors.entries()).map(([k, v]) => [k, v.message]),
    buildTime: manifest.buildTime,
  });
}

export function deserializeManifest(json: string): SSGManifest {
  const data = JSON.parse(json);

  return {
    pages: new Map(data.pages),
    errors: new Map(data.errors),
    buildTime: data.buildTime,
  };
}

export const STATIC_ROUTE_PATTERNS = [
  '/',
  '/about',
  '/contact',
  '/blog',
  '/pricing',
];

export function isStaticRoute(path: string): boolean {
  return (
    !path.includes('[') &&
    !path.includes(':') &&
    !path.startsWith('/api/') &&
    !path.includes('...')
  );
}

export async function crawlRoutes(
  startPath: string,
  shouldCrawl: (path: string) => Promise<boolean>,
  getLinks: (html: string) => string[],
): Promise<string[]> {
  const visited = new Set<string>();
  const queue = [startPath];

  while (queue.length > 0) {
    const path = queue.shift()!;

    if (visited.has(path) || !isStaticRoute(path)) {
      continue;
    }

    visited.add(path);

    if (await shouldCrawl(path)) {
      const html = await fetch(path).then((r) => r.text()).catch(() => '');
      const links = getLinks(html);

      for (const link of links) {
        if (!visited.has(link)) {
          queue.push(link);
        }
      }
    }
  }

  return [...visited];
}

export function estimateBuildTime(pages: number): number {
  return pages * 50;
}