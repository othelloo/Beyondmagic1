import { PhotoItem } from '../types';
import { ALL_PERMANENT_PHOTOS } from './galleryChunks';

// Map all permanent, embedded photos directly so they never rely on ephemeral disk files
export const BUNDLED_GALLERY_PHOTOS: PhotoItem[] = ALL_PERMANENT_PHOTOS.map((p, index) => ({
  id: p.id || `permanent-photo-${index + 1}`,
  title: '',
  category: 'production',
  image: p.image,
  caption: '',
  venueOrContext: '',
  year: ''
}));
