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
    return localStorage.getItem('verisme_gallery_locked') !== 'false';
  });
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  useEffect(() => {
    // Also fetch server gallery photos directly to guarantee all uploaded pictures appear
    fetch('/api/gallery-photos')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos(data.photos);
          savePhotos(data.photos);
        }
      })
      .catch((e) => console.log('Server gallery fetch optional', e));

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
  const renderPhotoCard = (photo: PhotoItem) => {
    return (
      <div
        key={photo.id}
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
    <div className="mb-20">
      
      {/* OWNER SETUP BOX (Visible only when not locked) */}
      {!isLocked && (
        <div className="mb-8 p-5 sm:p-6 rounded-2xl border-2 border-dashed border-[#c49750]/60 bg-gradient-to-r from-[#121622] to-[#0d0f17] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider font-mono text-[#c49750] font-semibold flex items-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{isDe ? 'Eigentümer-Setup: Galerie-Fotos synchronisieren' : 'Owner Setup: Sync Gallery Photos'}</span>
            </div>
            <p className="text-xs text-[#cfcac0]">
              {isDe
                ? 'Wählen Sie Ihre 39 Originalfotos von Ihrem Computer aus. Sie werden direkt als permanente Dateien auf dem Server gespeichert.'
                : 'Select your 39 original photos from your computer. They will be saved directly as permanent files in the repository.'}
            </p>
            {uploadStatus && (
              <p className="text-xs text-[#c49750] font-mono mt-1 font-medium">{uploadStatus}</p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <label className="px-5 py-2.5 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-all flex items-center gap-2 shadow-lg active:scale-95">
              <Upload className="w-4 h-4 text-black" />
              <span>{uploadProgress ? `${uploadProgress.current}/${uploadProgress.total}...` : (isDe ? 'Alle 39 Fotos auswählen' : 'Select All 39 Photos')}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleOwnerUpload}
              />
            </label>

            <button
              onClick={() => {
                setIsLocked(true);
                localStorage.setItem('verisme_gallery_locked', 'true');
              }}
              className="px-3.5 py-2.5 bg-[#1b202e] hover:bg-[#252b3d] text-[#c49750] hover:text-[#d8a85c] text-xs font-mono rounded-lg border border-[#c49750]/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Lock and hide uploader permanently for public visitors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isDe ? 'Sperren & Ausblenden' : 'Lock & Hide'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#21242d] pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            <span>{isDe ? 'Fotografien' : 'Photographs'}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#f4f2ec] font-normal">
            {isDe ? 'Fotogalerie' : 'Photo Gallery'}
          </h3>
          <p className="text-xs sm:text-sm text-[#8c887d] mt-1">
            {isDe ? 'Bühnenauftritte, Proben und Momente im Studio.' : 'Stage performances, rehearsals, and studio moments.'}
          </p>
        </div>

        {/* Gallery Action */}
        <div className="flex items-center gap-3">
          {isLocked && (
            <button
              onClick={() => {
                setIsLocked(false);
                localStorage.removeItem('verisme_gallery_locked');
              }}
              className="text-[11px] font-mono text-[#777367] hover:text-[#c49750] transition-colors flex items-center gap-1 cursor-pointer mr-2"
              title="Manage photos"
            >
              <Lock className="w-3 h-3 text-[#c49750]/60" />
              <span>{isDe ? 'Fotos verwalten' : 'Manage Photos'}</span>
            </button>
          )}
          {displayPhotos.length > 6 && (
            <button
              onClick={() => setIsFullGalleryOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#dedacf] bg-[#171b26] hover:bg-[#202635] border border-[#2d3345] transition-all cursor-pointer"
            >
              <Images className="w-3.5 h-3.5 text-[#c49750]" />
              <span>{isDe ? `Alle anzeigen (${displayPhotos.length})` : `View All (${displayPhotos.length})`}</span>
            </button>
          )}
        </div>
      </div>

      {/* IF NO PHOTOS: Elegant Empty Notice */}
      {displayPhotos.length === 0 ? (
        <div className="p-12 rounded-2xl border border-[#272b35] bg-gradient-to-br from-[#12151d] to-[#0a0c10] text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#1b202a] text-[#c49750] flex items-center justify-center border border-[#c49750]/30 shadow-lg">
            <Camera className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-serif text-white font-medium">
            {isDe ? 'Fotografien folgen in Kürze' : 'Photographs Coming Soon'}
          </h4>
          <p className="text-xs text-[#9a968b] max-w-md mx-auto leading-relaxed">
            {isDe ? 'Neue Aufnahmen von Produktionen und Meisterkursen werden in Kürze kuratiert.' : 'Selected captures from international productions and masterclasses.'}
          </p>
        </div>
      ) : (
        /* CURATED PREVIEW OF REAL PHOTOS (NO TEXT OVERLAY) */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {curatedPreviews.map((photo) => renderPhotoCard(photo))}
          </div>

          {displayPhotos.length > 12 && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setIsInlineExpanded(!isInlineExpanded)}
                className="px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-[#c49750] hover:text-[#d8a85c] bg-[#141822] hover:bg-[#1a202d] border border-[#c49750]/30 transition-all cursor-pointer shadow-sm"
              >
                <span>
                  {isInlineExpanded
                    ? (isDe ? 'Weniger anzeigen (Erste 12)' : 'Show Less (First 12)')
                    : (isDe ? `Alle ${displayPhotos.length} Fotos anzeigen` : `Show All ${displayPhotos.length} Photos on Page`)}
                </span>
              </button>
              <button
                onClick={openFullGallery}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a09c91] hover:text-[#c49750] border-b border-[#a09c91]/30 hover:border-[#c49750] pb-1 cursor-pointer transition-colors"
              >
                <span>{isDe ? `Vollbild-Galerie öffnen (${displayPhotos.length}) →` : `Open Full-Screen Grid (${displayPhotos.length}) →`}</span>
              </button>
            </div>
          )}
        </div>
      )}

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
                {displayPhotos.map((photo) => renderPhotoCard(photo))}
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
