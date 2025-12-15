export function toBooleanString(
  value?: boolean
): "true" | "false" | undefined {
  if (value === undefined) return undefined;
  return value ? "true" : "false";
}
