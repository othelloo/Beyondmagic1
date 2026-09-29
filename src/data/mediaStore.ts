import { PhotoItem, VideoItem } from '../types';
import { PHOTOS_COLLECTION, VIDEOS_COLLECTION } from './content';

const STORAGE_KEY_VIDEOS = 'verisme_custom_videos_v5';
const STORAGE_KEY_PHOTOS = 'verisme_custom_photos_v6';
const STORAGE_KEY_PORTRAIT = 'verisme_custom_portrait_v1';

const MEDIA_CHANGE_EVENT = 'verisme_media_changed';

export function getStoredPortrait(): string {
  if (typeof window === 'undefined') return '/images/portrait.jpg';
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PORTRAIT);
    if (saved) return saved;
  } catch (e) {
    console.warn('Failed to read custom portrait', e);
  }
  return '/images/portrait.jpg';
}

export async function savePortrait(dataUrl: string): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_PORTRAIT, dataUrl);
    window.dispatchEvent(new CustomEvent(MEDIA_CHANGE_EVENT));
    
    // Also attempt server sync to write to /public/images/portrait.jpg
    fetch('/api/upload-portrait', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: dataUrl })
    }).catch(err => console.log('Server upload optional:', err));
  } catch (e) {
    console.warn('Failed to save portrait', e);
  }
}

export function getStoredVideos(): VideoItem[] {
  if (typeof window === 'undefined') return VIDEOS_COLLECTION;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VIDEOS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read custom videos from localStorage', e);
  }
  return VIDEOS_COLLECTION;
}

export function saveVideos(videos: VideoItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_VIDEOS, JSON.stringify(videos));
    window.dispatchEvent(new CustomEvent(MEDIA_CHANGE_EVENT));
  } catch (e) {
    console.warn('Failed to save videos to localStorage', e);
  }
}

export function addCustomVideo(newVideo: VideoItem): void {
  const current = getStoredVideos();
  // prepend so newest appears first
  const updated = [newVideo, ...current.filter((v) => v.id !== newVideo.id)];
  saveVideos(updated);
}

export function deleteCustomVideo(id: string): void {
  const current = getStoredVideos();
  const updated = current.filter((v) => v.id !== id);
  saveVideos(updated);
}

export function getStoredPhotos(): PhotoItem[] {
  if (typeof window === 'undefined') return PHOTOS_COLLECTION;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const defaultIds = new Set(PHOTOS_COLLECTION.map(p => p.id));
        const customOnly = parsed.filter((p: PhotoItem) => !defaultIds.has(p.id));
        return [...PHOTOS_COLLECTION, ...customOnly];
      }
    }
  } catch (e) {
    console.warn('Failed to read custom photos from localStorage', e);
  }
  return PHOTOS_COLLECTION;
}

export function savePhotos(photos: PhotoItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Only store metadata without massive base64 if possible
    const sanitized = photos.map(p => {
      // If image is a huge data: URL, keep it, but warn
      return p;
    });
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(sanitized));
    window.dispatchEvent(new CustomEvent(MEDIA_CHANGE_EVENT));
  } catch (e) {
    console.warn('Failed to save photos to localStorage', e);
  }
}

export function addCustomPhoto(newPhoto: PhotoItem): void {
  const current = getStoredPhotos();
  const updated = [newPhoto, ...current.filter((p) => p.id !== newPhoto.id)];
  savePhotos(updated);
}

export function addCustomPhotosBatch(newPhotos: PhotoItem[]): void {
  const current = getStoredPhotos();
  const newIds = new Set(newPhotos.map((p) => p.id));
  const updated = [...newPhotos, ...current.filter((p) => !newIds.has(p.id))];
  savePhotos(updated);
}

export function deleteCustomPhoto(id: string): void {
  const current = getStoredPhotos();
  const updated = current.filter((p) => p.id !== id);
  savePhotos(updated);
}

export function resetMediaToDefaults(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY_VIDEOS);
    localStorage.removeItem(STORAGE_KEY_PHOTOS);
    window.dispatchEvent(new CustomEvent(MEDIA_CHANGE_EVENT));
  } catch (e) {
    console.warn('Failed to reset media in localStorage', e);
  }
}

export function onMediaChange(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(MEDIA_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener(MEDIA_CHANGE_EVENT, callback);
  };
}
