export interface SSRRenderResult {
  html: string;
  status: number;
}

/** Normalize server `render()` return value (string or `{ html, status }`). */
export function normalizeSSRRenderResult(result: unknown): SSRRenderResult {
  if (typeof result === "string") {
    return { html: result, status: 200 };
  }
  if (result && typeof result === "object" && "html" in result) {
    const record = result as { html?: unknown; status?: unknown };
    return {
      html: typeof record.html === "string" ? record.html : "",
      status: typeof record.status === "number" ? record.status : 200,
    };
  }
  return { html: "", status: 500 };
}
