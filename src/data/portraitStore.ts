export const STORAGE_KEY_PORTRAIT = 'verisme_custom_portrait_v2';
export const MEDIA_CHANGE_EVENT = 'verisme_media_changed';

export function getStoredPortrait(): string {
  if (typeof window === 'undefined') return '/images/portrait.jpg';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PORTRAIT);
    if (saved && !saved.includes('portrait_placeholder.svg')) {
      return saved;
    }
  } catch (e) {
    // Ignore
  }
  return '/images/portrait.jpg';
}

export function onPortraitChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MEDIA_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener(MEDIA_CHANGE_EVENT, callback);
  };
}
