import React, { useState, useEffect } from 'react';
import { getStoredPhotos, onMediaChange, addCustomPhotosBatch, deleteCustomPhoto } from '../data/mediaStore';
import { PhotoItem } from '../types';
import { X, ZoomIn, ChevronLeft, ChevronRight, Camera, Sparkles, MapPin, Calendar, Upload, Check, Loader2, Plus, Trash2 } from 'lucide-react';

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
  const [photos, setPhotos] = useState<PhotoItem[]>(getStoredPhotos());
  const [activeTab, setActiveTab] = useState<'production' | 'behind_the_scenes'>('production');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);

  // Batch upload state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [justAddedCount, setJustAddedCount] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = onMediaChange(() => {
      setPhotos(getStoredPhotos());
    });
    return unsubscribe;
  }, []);

  const filteredPhotos = photos.filter((p) => p.category === activeTab);

  const handleFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
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
            const meta = parsePhotoMetadata(file.name, activeTab);
            let finalImageSrc = dataUrl;

            // Attempt server save to /public/images/
            try {
              const res = await fetch('/api/upload-gallery-photo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  image: dataUrl,
                  filename: file.name,
                  category: activeTab
                })
              });
              if (res.ok) {
                const json = await res.json();
                if (json.url) {
                  finalImageSrc = json.url;
                }
              }
            } catch (err) {
              console.log('Server file write optional:', err);
            }

            const item: PhotoItem = {
              id: `stage-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
              title: meta.title || file.name,
              category: activeTab,
              image: finalImageSrc,
              caption: meta.caption || file.name,
              venueOrContext: meta.venueOrContext || 'Opera Stage',
              year: meta.year || 'Stage Archive',
              role: meta.role || undefined
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
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
  };

  const handleNext = () => {
    if (!lightboxPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const nextIndex = (currentIndex + 1) % filteredPhotos.length;
    setLightboxPhoto(filteredPhotos[nextIndex]);
  };

  const handlePrev = () => {
    if (!lightboxPhoto) return;
    const currentIndex = filteredPhotos.findIndex((p) => p.id === lightboxPhoto.id);
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setLightboxPhoto(filteredPhotos[prevIndex]);
  };

  return (
    <div className="mb-20">
      
      {/* Gallery Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#21242d] pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-[#c49750] font-medium mb-1 flex items-center gap-2">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Documentation</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif text-[#f4f2ec] font-normal">
            Photographic Archive
          </h3>
          <p className="text-xs sm:text-sm text-[#8c887d] mt-1">
            Two distinct collections capturing stage productions and intimate studio score work.
          </p>
        </div>

        {/* The Two Distinct Gallery Tabs */}
        <div className="flex items-center gap-2 bg-[#12141a] p-1.5 rounded-lg border border-[#22252e]">
          <button
            onClick={() => setActiveTab('production')}
            className={`px-4 py-2 text-xs font-medium rounded transition-all cursor-pointer ${
              activeTab === 'production'
                ? 'bg-[#1e222b] text-[#f4f2ec] shadow-sm font-semibold border border-[#c49750]/50'
                : 'text-[#8c887d] hover:text-[#d4af37]'
            }`}
          >
            <span>Singing in Productions</span>
            <span className="ml-1.5 opacity-60 text-[10px] font-mono">
              ({photos.filter((p) => p.category === 'production').length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('behind_the_scenes')}
            className={`px-4 py-2 text-xs font-medium rounded transition-all cursor-pointer ${
              activeTab === 'behind_the_scenes'
                ? 'bg-[#1e222b] text-[#f4f2ec] shadow-sm font-semibold border border-[#c49750]/50'
                : 'text-[#8c887d] hover:text-[#d4af37]'
            }`}
          >
            <span>Behind the Scenes (Miscellaneous)</span>
            <span className="ml-1.5 opacity-60 text-[10px] font-mono">
              ({photos.filter((p) => p.category === 'behind_the_scenes').length})
            </span>
          </button>
        </div>
      </div>

      {/* Batch Upload Dropzone Banner */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="mb-8 p-5 rounded-2xl border-2 border-dashed border-[#c49750]/30 hover:border-[#c49750] bg-[#12151d]/70 transition-all text-center"
      >
        {isProcessing && uploadProgress ? (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <Loader2 className="w-6 h-6 text-[#c49750] animate-spin" />
            <p className="text-sm font-medium text-[#f4f2ec]">
              Adding photo {uploadProgress.current} of {uploadProgress.total}...
            </p>
            <p className="text-xs text-[#9a9588]">
              Writing images into gallery and auto-formatting opera roles...
            </p>
          </div>
        ) : justAddedCount > 0 ? (
          <div className="flex items-center justify-center gap-2 py-3 text-emerald-300">
            <Check className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-medium">
              Successfully added {justAddedCount} {activeTab === 'production' ? 'onstage' : 'behind-the-scenes'} pictures to the gallery!
            </span>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-3">
            <div className="text-left">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-0.5">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload To: {activeTab === 'production' ? 'Onstage / Professional Productions' : 'Behind the Scenes'}</span>
              </div>
              <p className="text-xs text-[#b8b5ab]">
                Select all 29 pictures at once, or drop them directly here. Roles & opera titles are auto-recognized.
              </p>
            </div>

            <label className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-md active:scale-95">
              <Plus className="w-4 h-4 text-black" />
              <span>Select Pictures From Computer</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          </div>
        )}
      </div>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(photo)}
            className="group relative rounded-xl overflow-hidden bg-[#13151b] border border-[#222630] cursor-pointer shadow-lg hover:border-[#c49750]/60 transition-all duration-300"
          >
            <div className="aspect-[4/3] overflow-hidden bg-[#0c0d12]">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover object-center filter contrast-[1.03] group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            </div>

            {/* Hover Icon */}
            <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-[#c49750]" />
            </div>

            {/* Photo Info Overlay */}
            <div className="absolute bottom-3 left-4 right-4">
              <div className="text-[11px] font-mono text-[#c49750] uppercase tracking-wider mb-0.5">
                {photo.role || photo.year}
              </div>
              <h4 className="text-base font-serif text-[#f2eee9] font-medium line-clamp-1 mb-1">
                {photo.title}
              </h4>
              <p className="text-[11px] text-[#9c978b] line-clamp-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-[#c49750]/70" />
                <span>{photo.venueOrContext}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-[#111318] rounded-2xl overflow-hidden border border-[#2b303d] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0c0d12]">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-widest text-[#c49750]">
                  {lightboxPhoto.category === 'production' ? 'Opera Production' : 'Behind the Scenes'}
                </span>
                <span className="text-xs text-[#8c887d] font-mono">· {lightboxPhoto.year}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    deleteCustomPhoto(lightboxPhoto.id);
                    closeLightbox();
                  }}
                  className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                  title="Remove from gallery"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Remove</span>
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-1.5 rounded-lg text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Image Container with Previous & Next Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] max-h-[65vh]">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                referrerPolicy="no-referrer"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#c49750] text-white hover:text-black transition-colors cursor-pointer backdrop-blur-md"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-[#c49750] text-white hover:text-black transition-colors cursor-pointer backdrop-blur-md"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Caption & Context */}
            <div className="p-6 bg-[#0c0d12] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-serif text-white font-medium mb-1">
                  {lightboxPhoto.title}
                </h4>
                <p className="text-xs text-[#9f9b8f] max-w-2xl leading-relaxed">
                  {lightboxPhoto.caption}
                </p>
              </div>

              <div className="text-right text-xs text-[#8c887d] shrink-0 font-mono">
                <div>{lightboxPhoto.venueOrContext}</div>
                {lightboxPhoto.role && (
                  <div className="text-[#c49750] font-sans text-[11px] mt-0.5">Role: {lightboxPhoto.role}</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
