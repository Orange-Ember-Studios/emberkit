export function formatTemplate(
  template: string,
  params: Record<string, string>,
): string {
  let result = template;

  for (const [key, value] of Object.entries(params)) {
    result = result.split(`{{${key}}}`).join(value);
  }

  return result;
}

export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}
