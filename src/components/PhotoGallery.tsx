import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getStoredPhotos, onMediaChange, savePhotos } from '../data/mediaStore';
import { PhotoItem } from '../types';
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera, Images, Loader2, Upload, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';

export const PhotoGallery: React.FC = () => {
  const { language } = useLanguage();
  const isDe = language === 'de';

  const [photos, setPhotos] = useState<PhotoItem[]>(getStoredPhotos());
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [lightboxLoading, setLightboxLoading] = useState<boolean>(true);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState<boolean>(false);
  const [isInlineExpanded, setIsInlineExpanded] = useState<boolean>(false);

  // Owner Setup / Lock State (Locked by default for clean presentation)
  const [isLocked, setIsLocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('verisme_gallery_locked') !== 'false';
    } catch {
      return true;
    }
  });
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  useEffect(() => {
    // Only fetch server gallery on local dev server to avoid 404 stalls on GitHub Pages / static hosting
    const isDevHost = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.port === '3000');
    if (isDevHost) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      fetch('/api/gallery-photos', { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => {
          clearTimeout(timeoutId);
          if (data && data.success && Array.isArray(data.photos) && data.photos.length > 0) {
            setPhotos(data.photos);
            savePhotos(data.photos);
          }
        })
        .catch(() => {});
    }

    const unsubscribe = onMediaChange(() => {
      setPhotos(getStoredPhotos());
    });
    return unsubscribe;
  }, []);

  const handleOwnerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProgress({ current: 0, total: files.length });
    setUploadStatus(isDe ? `Lade ${files.length} Fotos auf den Server...` : `Saving ${files.length} photos to server...`);

    let uploadedCount = 0;
    const uploadedPhotosList: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const dataUrl = ev.target?.result as string;
          if (dataUrl) {
            try {
              const res = await fetch('/api/upload-gallery-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  image: dataUrl,
                  filename: file.name,
                  category: 'onstage'
                })
              });
              if (res.ok) {
                uploadedCount++;
                uploadedPhotosList.push({
                  id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
                  title: '',
                  category: 'production',
                  image: `/images/onstage/${file.name}`,
                  caption: '',
                  venueOrContext: '',
                  year: ''
                });
              }
            } catch (err) {
              console.error('Upload failed for', file.name, err);
            }
          }
          setUploadProgress({ current: i + 1, total: files.length });
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    if (uploadedPhotosList.length > 0) {
      // Re-fetch gallery photos from server
      const res = await fetch('/api/gallery-photos');
      const data = await res.json();
      if (data && data.success && Array.isArray(data.photos)) {
        setPhotos(data.photos);
        savePhotos(data.photos);
      } else {
        setPhotos(uploadedPhotosList);
        savePhotos(uploadedPhotosList);
      }
      setUploadStatus(
        isDe
          ? `✓ ${uploadedCount} Fotos dauerhaft gespeichert! Klicken Sie auf 'Sperren', um den Upload-Bereich auszublenden.`
          : `✓ ${uploadedCount} photos permanently saved! Click 'Lock / Hide' to remove the uploader.`
      );
    }
  };

  // Photos that have valid image paths
  const displayPhotos = photos.filter((p) => Boolean(p.image));

  // Preview photos: Show 12 initially, or all if expanded
  const curatedPreviews = isInlineExpanded ? displayPhotos : displayPhotos.slice(0, 12);

  // Preserve scroll position so user never loses their place on the page
  const savedScrollY = React.useRef<number>(0);

  const openLightbox = (photo: PhotoItem) => {
    savedScrollY.current = window.scrollY;
    setLightboxPhoto(photo);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
  };

  const openFullGallery = () => {
    savedScrollY.current = window.scrollY;
    setIsFullGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeFullGallery = () => {
    setIsFullGalleryOpen(false);
    document.body.style.overflow = '';
    window.scrollTo({ top: savedScrollY.current, behavior: 'instant' });
  };

  const handleNext = () => {
    if (!lightboxPhoto || displayPhotos.length === 0) return;
    const currentIndex = displayPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const nextIndex = (currentIndex + 1) % displayPhotos.length;
    setLightboxPhoto(displayPhotos[nextIndex]);
  };

  const handlePrev = () => {
    if (!lightboxPhoto || displayPhotos.length === 0) return;
    const currentIndex = displayPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const prevIndex = (currentIndex - 1 + displayPhotos.length) % displayPhotos.length;
    setLightboxPhoto(displayPhotos[prevIndex]);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxPhoto) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
      } else if (isFullGalleryOpen && e.key === 'Escape') {
        closeFullGallery();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxPhoto, isFullGalleryOpen]);

  // Pure, clean photo card: ZERO descriptions, ZERO overlays on the picture
  const renderPhotoCard = (photo: PhotoItem, index?: number, prefix: string = 'card') => {
    return (
      <div
        key={`${prefix}-${photo.id}-${index ?? 0}`}
        onClick={() => openLightbox(photo)}
        className="group relative rounded-xl overflow-hidden bg-[#101217] border border-[#222630] cursor-pointer shadow-lg hover:border-[#c49750]/60 transition-all duration-300 aspect-[4/3]"
      >
        <div className="w-full h-full overflow-hidden bg-black relative">
          <img
            src={resolveAssetUrl(photo.image)}
            alt={photo.title || 'Abdellah Lasri'}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />

          {/* Clean hover action only — NO text or description */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-[#c49750] opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110">
              <ZoomIn className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0e1118]/90 border border-[#212532] rounded-2xl p-4 sm:p-5 flex flex-col h-[520px] sm:h-[550px] shadow-xl">
      
      {/* Compact Fixed Header */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#21242d]">
        <div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-[#c49750] font-medium mb-0.5 flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>{isDe ? 'Fotografien' : 'Photographs'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif text-[#f4f2ec] font-normal">
            {isDe ? 'Fotogalerie' : 'Photo Gallery'}
          </h3>
        </div>

        {/* Gallery Action */}
        <div className="flex items-center gap-2">
          {displayPhotos.length > 0 && (
            <button
              onClick={openFullGallery}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[11px] font-mono uppercase tracking-wider text-[#dedacf] bg-[#171b26] hover:bg-[#202635] border border-[#2d3345] transition-all cursor-pointer"
            >
              <Images className="w-3 h-3 text-[#c49750]" />
              <span>{isDe ? `Alle (${displayPhotos.length})` : `All (${displayPhotos.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* OWNER SETUP BOX (Visible only when unlocked) */}
      {!isLocked && (
        <div className="shrink-0 my-2 p-3 rounded-lg border border-dashed border-[#c49750]/60 bg-[#121622] flex items-center justify-between gap-2 text-xs">
          <div className="text-[11px] text-[#cfcac0] truncate">
            {isDe ? 'Fotos synchronisieren' : 'Sync photos to server'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label className="px-2.5 py-1 bg-[#c49750] text-black text-[10px] font-semibold uppercase rounded cursor-pointer">
              <span>{uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}` : 'Upload'}</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleOwnerUpload} />
            </label>
            <button
              onClick={() => {
                setIsLocked(true);
                try { localStorage.setItem('verisme_gallery_locked', 'true'); } catch {}
              }}
              className="text-[10px] text-[#c49750]"
            >
              <Lock className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* IF NO PHOTOS: Elegant Empty Notice */}
      {displayPhotos.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-2">
          <Camera className="w-6 h-6 text-[#c49750]" />
          <h4 className="text-sm font-serif text-white font-medium">
            {isDe ? 'Fotografien folgen in Kürze' : 'Photographs Coming Soon'}
          </h4>
        </div>
      ) : (
        /* SCROLLABLE GRID OF ALL PHOTOS: Exact matching size to Video Gallery */
        <div className="flex-1 overflow-y-auto pr-1 sm:pr-1.5 pt-3 pb-2 min-h-0">
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
            {displayPhotos.map((photo, idx) => renderPhotoCard(photo, idx, 'preview'))}
          </div>
        </div>
      )}

      {/* Fixed Footer Bar */}
      <div className="shrink-0 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
        <span className="font-mono text-[#8c887d]">
          {isDe
            ? `${displayPhotos.length} Fotos · Scrollen oder Anklicken`
            : `${displayPhotos.length} Photos · Scroll or click to browse`}
        </span>

        <div className="flex items-center gap-3">
          <button
            onClick={openFullGallery}
            className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-[#c49750] hover:text-[#d8a85c] transition-colors cursor-pointer"
          >
            <Images className="w-3.5 h-3.5" />
            <span>{isDe ? 'Ganze Fotogalerie öffnen →' : 'Open Full Gallery →'}</span>
          </button>

          {isLocked && (
            <button
              onClick={() => {
                setIsLocked(false);
                try { localStorage.removeItem('verisme_gallery_locked'); } catch {}
              }}
              className="text-[10px] font-mono text-[#6e6a60] hover:text-[#c49750] transition-colors flex items-center gap-1 cursor-pointer"
              title="Manage photos"
            >
              <Lock className="w-2.5 h-2.5 text-[#c49750]/60" />
            </button>
          )}
        </div>
      </div>

      {/* FULL-SCREEN PHOTO ARCHIVE MODAL (NO TEXT OVERLAYS) */}
      {isFullGalleryOpen && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
          onClick={closeFullGallery}
        >
          <div
            className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-serif text-white font-normal">
                  Photographs ({displayPhotos.length})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={closeFullGallery}
                  className="p-2 rounded-lg bg-[#1a1e28] text-[#a09c91] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Gallery"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Pure Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
                {displayPhotos.map((photo, idx) => renderPhotoCard(photo, idx, 'modal'))}
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Lightbox Modal: DEAD-CENTERED, ATTACHED TO BODY, ZERO JUMP */}
      {lightboxPhoto && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150 overflow-hidden select-none"
          onClick={closeLightbox}
        >
          {/* Top Controls Bar */}
          <div className="absolute top-4 right-4 z-40 flex items-center gap-3">
            <span className="text-xs font-mono text-[#cfcac0] bg-black/60 px-3 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
              {displayPhotos.findIndex((p) => p.id === lightboxPhoto.id) + 1} / {displayPhotos.length}
            </span>
            <button
              onClick={closeLightbox}
              className="p-2.5 rounded-full bg-black/70 hover:bg-white/20 text-white transition-colors cursor-pointer border border-white/20 shadow-lg"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Prev Button */}
          {displayPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#c49750] text-white hover:text-black transition-all cursor-pointer backdrop-blur-md shadow-2xl border border-white/15 active:scale-95"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Next Button */}
          {displayPhotos.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-3 sm:p-4 rounded-full bg-black/70 hover:bg-[#c49750] text-white hover:text-black transition-all cursor-pointer backdrop-blur-md shadow-2xl border border-white/15 active:scale-95"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          )}

          {/* Centered Image Container — perfectly centered vertically and horizontally */}
          <div
            className="relative max-w-[92vw] max-h-[90vh] flex items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={resolveAssetUrl(lightboxPhoto.image)}
              alt=""
              className="max-h-[88vh] max-w-[90vw] w-auto h-auto object-contain block mx-auto rounded shadow-2xl transition-opacity duration-200"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
