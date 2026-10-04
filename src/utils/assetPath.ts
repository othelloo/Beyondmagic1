/**
 * Resolves static image/asset paths correctly regardless of whether the site
 * is hosted at root domain (e.g. https://domain.com/) or on GitHub Pages
 * in a subdirectory (e.g. https://username.github.io/repository-name/).
 */
export function resolveAssetUrl(path: string | undefined | null): string {
  if (!path) return '';

  // Data URLs, external URLs, blob URLs remain unchanged
  if (path.startsWith('data:') || path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
    return path;
  }

  // Already relative
  if (path.startsWith('./')) {
    return path;
  }

  // If path starts with a leading slash like '/images/portrait.jpg'
  // and we're on a subdirectory (like GitHub Pages), convert to relative './images/portrait.jpg'
  // so the browser resolves it relative to the current index.html directory
  if (path.startsWith('/')) {
    return `.${path}`;
  }

  return `./${path}`;
}
