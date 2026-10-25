import { PhotoItem, VideoItem } from '../types';
import { PHOTOS_COLLECTION, VIDEOS_COLLECTION } from './content';
import { INITIAL_ARCHIVE_PHOTOS } from './uploadedPhotos';
import { BUNDLED_GALLERY_PHOTOS } from './bundledGallery';
import { getStoredPortrait, STORAGE_KEY_PORTRAIT, MEDIA_CHANGE_EVENT, onPortraitChange } from './portraitStore';

export { getStoredPortrait, onPortraitChange };

const STORAGE_KEY_VIDEOS = 'verisme_custom_videos_v5';
const STORAGE_KEY_PHOTOS = 'verisme_custom_photos_v10';

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

export function reorderVideos(fromIndex: number, toIndex: number): void {
  const current = [...getStoredVideos()];
  if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return;
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  saveVideos(current);
}

export function moveVideo(id: string, direction: 'up' | 'down'): void {
  const current = getStoredVideos();
  const index = current.findIndex((v) => v.id === id);
  if (index === -1) return;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  reorderVideos(index, targetIndex);
}

export function getStoredPhotos(): PhotoItem[] {
  let list: PhotoItem[] = BUNDLED_GALLERY_PHOTOS;
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasDataUrls = parsed.some((p: PhotoItem) => p.image && p.image.startsWith('data:image'));
          if (hasDataUrls) {
            list = parsed;
          }
        }
      }
    } catch (e) {
      console.warn('Failed to read custom photos from localStorage', e);
    }
  }

  // Ensure every photo has a strictly unique ID
  const seenIds = new Set<string>();
  const uniquePhotos: PhotoItem[] = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    let uniqueId = item.id || `photo-${i}`;
    if (seenIds.has(uniqueId)) {
      uniqueId = `${uniqueId}_dup_${i}`;
    }
    seenIds.add(uniqueId);
    uniquePhotos.push({
      ...item,
      id: uniqueId
    });
  }

  return uniquePhotos;
}

export function savePhotos(photos: PhotoItem[]): void {
  if (typeof window === 'undefined') return;
  // Deduplicate IDs before saving
  const seenIds = new Set<string>();
  const uniquePhotos: PhotoItem[] = [];
  for (let i = 0; i < photos.length; i++) {
    const item = photos[i];
    let uniqueId = item.id || `photo-${i}`;
    if (seenIds.has(uniqueId)) {
      uniqueId = `${uniqueId}_dup_${i}`;
    }
    seenIds.add(uniqueId);
    uniquePhotos.push({
      ...item,
      id: uniqueId
    });
  }

  try {
    localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(uniquePhotos));
  } catch (e) {
    console.warn('Failed to save photos to localStorage (quota exceeded)', e);
  }
  window.dispatchEvent(new CustomEvent(MEDIA_CHANGE_EVENT));
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
  const updated = current.filter((v) => v.id !== id);
  savePhotos(updated);
}

export function reorderPhotos(fromIndex: number, toIndex: number): void {
  const current = [...getStoredPhotos()];
  if (fromIndex < 0 || fromIndex >= current.length || toIndex < 0 || toIndex >= current.length) return;
  const [moved] = current.splice(fromIndex, 1);
  current.splice(toIndex, 0, moved);
  savePhotos(current);
}

export function movePhoto(id: string, direction: 'up' | 'down'): void {
  const current = getStoredPhotos();
  const index = current.findIndex((p) => p.id === id);
  if (index === -1) return;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  reorderPhotos(index, targetIndex);
}

const STORAGE_KEY_ADMIN_PASSWORD = 'verisme_admin_password_v1';

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEY_ADMIN_PASSWORD) || '';
}

export function setAdminPassword(password: string): void {
  if (typeof window === 'undefined') return;
  if (!password) {
    localStorage.removeItem(STORAGE_KEY_ADMIN_PASSWORD);
  } else {
    localStorage.setItem(STORAGE_KEY_ADMIN_PASSWORD, password);
  }
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
