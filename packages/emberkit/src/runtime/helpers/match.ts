/**
 * Scores a route path for specificity. Higher score = more specific.
 * Static segments beat dynamic params; dynamic params beat catch-alls.
 * Used to resolve conflicts when multiple routes match the same URL.
 */
export function scoreRoute(routePath: string): number {
  let score = 100;
  const segments = routePath.split('/').filter(Boolean);

  score -= segments.length * 20;

  for (const segment of segments) {
    if (segment.startsWith(':') || segment.startsWith('*') || segment.endsWith('*')) {
      score -= 30;
    } else {
      score += 10;
    }
  }

  if (routePath.includes('*')) {
    score -= 50;
  }

  return Math.max(0, score);
}

function routeMatchesPath(routePath: string, normalized: string): boolean {
  if (routePath === normalized) return true;

  const routeParts = routePath.split('/').filter(Boolean);
  const pathParts = normalized.split('/').filter(Boolean);

  // Catch-all routes (e.g. /:slug*) can match longer paths
  const hasCatchAll = routeParts.some((p) => p.endsWith('*'));
  if (hasCatchAll) {
    if (pathParts.length < routeParts.length) return false;
    for (let i = 0; i < routeParts.length; i++) {
      const part = routeParts[i];
      if (part.startsWith(':')) continue;
      if (part !== pathParts[i]) return false;
    }
    return true;
  }

  // Standard routes: segment counts must match exactly
  if (routeParts.length !== pathParts.length) return false;

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) continue;
    if (routeParts[i] !== pathParts[i]) return false;
  }
  return true;
}

/**
 * Returns the best-matching route for the given pathname.
 * When multiple routes match (e.g. /admin and /:language both match "/admin"),
 * the route with the highest specificity score wins — static beats dynamic.
 */
export function matchRoute<T extends { path: string }>(routes: T[], pathname: string): T | undefined {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/$/, '');

  let bestMatch: T | undefined;
  let bestScore = -1;

  for (const route of routes) {
    const routePath = route.path === '/' ? '/' : route.path.replace(/\/$/, '');
    if (routeMatchesPath(routePath, normalized)) {
      const score = scoreRoute(routePath);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = route;
      }
    }
  }

  return bestMatch;
}
