export function makeSlug(inputString: string): string {
  const slug = inputString.trim().replace(/\s+/g, '-');
  return slug.toLowerCase();
}
