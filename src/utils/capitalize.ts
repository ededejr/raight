/**
 * Capitalize the first word in a string
 */
export function capitalize(str: string) {
  const [first, ...rest] = str?.split("") || [];
  return first?.toUpperCase() + rest?.join("") || "";
}
