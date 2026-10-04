import React, { useState, useEffect } from 'react';
import { getStoredPhotos, onMediaChange, addCustomPhotosBatch, deleteCustomPhoto, savePhotos } from '../data/mediaStore';
import { PhotoItem } from '../types';
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera, Sparkles, MapPin, Calendar, Upload, Check, Loader2, Plus, Trash2, Eye, Zap, Image as ImageIcon, Images, ArrowRight, Maximize2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { resolveAssetUrl } from '../utils/assetPath';

function parsePhotoMetadata(filename: string, category: 'production' | 'behind_the_scenes'): Partial<PhotoItem> {
  const lower = filename.toLowerCase();
  
  if (lower.includes('traviata')) {
    const hasYoncheva = lower.includes('yoncheva');
    const photoCredit = lower.includes('uhlig') ? ' · Photo: Bernd Uhlig' : '';
    return {
      title: hasYoncheva ? 'La Traviata (with Sonya Yoncheva)' : 'La Traviata (Alfredo Germont)',
      role: 'Alfredo Germont',
      venueOrContext: `Staatsoper Berlin / Schiller Theater${photoCredit}`,
      year: '2015',
      caption: 'Singing Alfredo Germont in Giuseppe Verdi’s La Traviata.'
    };
  }

  if (lower.includes('werther')) {
    const credit = lower.includes('jung') ? ' · Photo: Matthias Jung' : '';
    return {
      title: 'Werther (Massenet)',
      role: 'Werther',
      venueOrContext: `Opera Stage${credit}`,
      year: '2016',
      caption: 'Singing the title role of Werther in Jules Massenet’s lyric drama.'
    };
  }

  if (lower.includes('faust')) {
    return {
      title: 'Faust (Gounod)',
      role: 'Faust',
      venueOrContext: 'Opera Stage France',
      year: '2018',
      caption: 'Singing Faust in Charles Gounod’s masterpiece.'
    };
  }

  if (lower.includes('shelleyjackson') || lower.includes('jackson')) {
    return {
      title: 'Opera Stage Duo (with Shelley Jackson)',
      role: 'Leading Tenor',
      venueOrContext: 'Opera Production',
      year: '2017',
      caption: 'Stage scene with soprano Shelley Jackson.'
    };
  }

  // General clean title from filename
  const cleanName = filename
    .replace(/\.[^/.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .slice(0, 45);

  return {
    title: category === 'production' ? `Onstage: ${cleanName}` : cleanName,
    role: category === 'production' ? 'Opera Stage' : 'Behind the Scenes',
    venueOrContext: category === 'production' ? 'Live Opera Production' : 'Rehearsal & Stage Life',
    year: 'Stage Archive',
    caption: 'Stage and performance archive photograph.'
  };
}

export const PhotoGallery: React.FC = () => {
  const { language, t } = useLanguage();
  const isDe = language === 'de';

  const [photos, setPhotos] = useState<PhotoItem[]>(getStoredPhotos());
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [lightboxLoading, setLightboxLoading] = useState<boolean>(true);
  const [isFullGalleryOpen, setIsFullGalleryOpen] = useState<boolean>(false);
  const [isInlineExpanded, setIsInlineExpanded] = useState<boolean>(false);

  // Batch upload state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [justAddedCount, setJustAddedCount] = useState<number>(0);

  useEffect(() => {
    // Also fetch server gallery photos directly to guarantee all uploaded pictures appear
    fetch('/api/gallery-photos')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.photos) && data.photos.length > 0) {
          setPhotos((prev) => {
            const existingUrls = new Set(prev.map((p) => p.image));
            const newServerPhotos = data.photos.filter((p: PhotoItem) => !existingUrls.has(p.image));
            if (newServerPhotos.length > 0) {
              const merged = [...prev, ...newServerPhotos];
              savePhotos(merged);
              return merged;
            }
            return prev;
          });
        }
      })
      .catch((e) => console.log('Server gallery fetch optional', e));

    const unsubscribe = onMediaChange(() => {
      setPhotos(getStoredPhotos());
    });
    return unsubscribe;
  }, []);

  // Photos that have valid image paths
  const displayPhotos = photos.filter((p) => Boolean(p.image));

  // Preview photos: Show 12 initially, or all if expanded
  const curatedPreviews = isInlineExpanded ? displayPhotos : displayPhotos.slice(0, 12);

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (fileList.length === 0) return;

    setIsProcessing(true);
    setUploadProgress({ current: 0, total: fileList.length });

    const newItems: PhotoItem[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      setUploadProgress({ current: i + 1, total: fileList.length });

      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            let finalUrl = dataUrl;

            // Save to server
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
                const json = await res.json();
                if (json.url) {
                  finalUrl = json.url;
                }
              }
            } catch (err) {
              console.log('Server file write optional:', err);
            }

            const item: PhotoItem = {
              id: `photo-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              title: '',
              category: 'production',
              image: finalUrl,
              caption: '',
              venueOrContext: '',
              year: ''
            };

            newItems.push(item);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    if (newItems.length > 0) {
      addCustomPhotosBatch(newItems);
      setPhotos((prev) => [...newItems, ...prev]);
      setJustAddedCount(newItems.length);
      setTimeout(() => setJustAddedCount(0), 4000);
    }

    setIsProcessing(false);
    setUploadProgress(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const openLightbox = (photo: PhotoItem) => {
    setLightboxPhoto(photo);
    setLightboxLoading(true);
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
  };

  const handleNext = () => {
    if (!lightboxPhoto || displayPhotos.length === 0) return;
    const currentIndex = displayPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const nextIndex = (currentIndex + 1) % displayPhotos.length;
    setLightboxPhoto(displayPhotos[nextIndex]);
    setLightboxLoading(true);
  };

  const handlePrev = () => {
    if (!lightboxPhoto || displayPhotos.length === 0) return;
    const currentIndex = displayPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const prevIndex = (currentIndex - 1 + displayPhotos.length) % displayPhotos.length;
    setLightboxPhoto(displayPhotos[prevIndex]);
    setLightboxLoading(true);
  };

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
            alt=""
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

        {/* Upload & Gallery Action */}
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] transition-all cursor-pointer shadow-md active:scale-95">
            <Upload className="w-3.5 h-3.5 text-black" />
            <span>{isDe ? 'Fotos hinzufügen' : 'Select Photos to Add'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>

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

      {/* Batch Upload / Drop Notification */}
      {isProcessing && uploadProgress && (
        <div className="mb-6 p-4 rounded-xl bg-[#141720] border border-[#c49750]/30 flex items-center justify-center gap-3 text-xs text-[#c49750]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Adding photo {uploadProgress.current} of {uploadProgress.total}...</span>
        </div>
      )}

      {justAddedCount > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-center gap-2 text-xs text-emerald-300">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added {justAddedCount} photos to the gallery!</span>
        </div>
      )}

      {/* IF NO PHOTOS HAVE BEEN ADDED YET: Elegant Dropzone Banner */}
      {displayPhotos.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="p-12 rounded-2xl border-2 border-dashed border-[#c49750]/30 hover:border-[#c49750] bg-gradient-to-br from-[#12151d] to-[#0a0c10] text-center transition-all flex flex-col items-center justify-center space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-[#1b202a] text-[#c49750] flex items-center justify-center border border-[#c49750]/30 shadow-lg">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-serif text-white font-medium mb-1">
              Add Your Photos Here
            </h4>
            <p className="text-xs text-[#9a968b] max-w-md mx-auto leading-relaxed">
              Drag and drop your photos directly onto this space, or select them from your computer.
            </p>
          </div>
          <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-md active:scale-95">
            <Upload className="w-4 h-4 text-black" />
            <span>Select Photos From Computer</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
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
                onClick={() => setIsFullGalleryOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#a09c91] hover:text-[#c49750] border-b border-[#a09c91]/30 hover:border-[#c49750] pb-1 cursor-pointer transition-colors"
              >
                <span>{isDe ? `Vollbild-Galerie öffnen (${displayPhotos.length}) →` : `Open Full-Screen Grid (${displayPhotos.length}) →`}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* FULL-SCREEN PHOTO ARCHIVE MODAL (NO TEXT OVERLAYS) */}
      {isFullGalleryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
          onClick={() => setIsFullGalleryOpen(false)}
        >
          <div
            className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <div>
                <h3 className="text-2xl font-serif text-white font-normal">
                  Photos ({displayPhotos.length})
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] transition-all cursor-pointer">
                  <Plus className="w-3.5 h-3.5 text-black" />
                  <span>Add More</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </label>

                <button
                  onClick={() => setIsFullGalleryOpen(false)}
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
        </div>
      )}

      {/* Lightbox Modal: PURE, CLEAN FULL-SCREEN PHOTO VIEW (NO TEXT OVERLAY) */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-6xl w-full max-h-[95vh] flex flex-col bg-transparent overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-end px-4 py-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    deleteCustomPhoto(lightboxPhoto.id);
                    setPhotos(prev => prev.filter(p => p.id !== lightboxPhoto.id));
                    closeLightbox();
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                  title="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline text-xs">Delete</span>
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 rounded-full bg-black/60 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Center Image Container with Previous & Next Arrows */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden min-h-[400px] max-h-[85vh]">
              {lightboxLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-20 space-y-2">
                  <Loader2 className="w-8 h-8 text-[#c49750] animate-spin" />
                </div>
              )}

              <img
                src={resolveAssetUrl(lightboxPhoto.image)}
                alt=""
                className={`max-h-[85vh] w-auto max-w-full object-contain mx-auto transition-opacity duration-300 select-none ${
                  lightboxLoading ? 'opacity-0' : 'opacity-100'
                }`}
                referrerPolicy="no-referrer"
                onLoad={() => setLightboxLoading(false)}
              />

              {/* Prev Button */}
              {displayPhotos.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#c49750] text-white hover:text-black transition-colors cursor-pointer backdrop-blur-md"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Next Button */}
              {displayPhotos.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-[#c49750] text-white hover:text-black transition-colors cursor-pointer backdrop-blur-md"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
