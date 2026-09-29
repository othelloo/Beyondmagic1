/**
 * Utility to extract a clean YouTube Video ID from any YouTube URL format:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - or just the VIDEO_ID itself
 */
export function getYouTubeId(urlOrId?: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();

  // If already just an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Regex matching various YouTube URL patterns (watch, youtu.be, embed, shorts, live)
  const regExp = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : null;
}

/**
 * Returns the best available YouTube thumbnail URL for a video ID
 */
export function getYouTubeThumbnail(urlOrId?: string): string | null {
  const id = getYouTubeId(urlOrId);
  if (!id) return null;
  // High quality thumbnail
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
