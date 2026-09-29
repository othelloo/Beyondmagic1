import React, { useState, useEffect } from 'react';
import { X, Youtube, Image, Plus, Check, Trash2, Copy, Sparkles, AlertCircle, RefreshCw, Camera, Upload, Inbox, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import {
  getStoredVideos,
  getStoredPhotos,
  addCustomVideo,
  deleteCustomVideo,
  addCustomPhoto,
  deleteCustomPhoto,
  resetMediaToDefaults,
  getStoredPortrait,
  savePortrait
} from '../data/mediaStore';
import { getStoredInquiries, deleteInquiry, onInquiriesChange, InquiryMessage } from '../data/inquiryStore';
import { VideoItem, PhotoItem } from '../types';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'youtube' | 'photo' | 'export'>('inbox');
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(getStoredInquiries());

  useEffect(() => {
    const unsub = onInquiriesChange(() => {
      setInquiries(getStoredInquiries());
    });
    return unsub;
  }, []);

  // Video Form
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState<'opera' | 'composition' | 'teaching'>('opera');
  const [videoDuration, setVideoDuration] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoAddedSuccess, setVideoAddedSuccess] = useState(false);

  // Photo Form
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState<'production' | 'behind_the_scenes'>('production');
  const [photoVenue, setPhotoVenue] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoYear, setPhotoYear] = useState('');
  const [photoRole, setPhotoRole] = useState('');
  const [photoAddedSuccess, setPhotoAddedSuccess] = useState(false);
  const [portraitSuccess, setPortraitSuccess] = useState(false);

  const handlePortraitUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        await savePortrait(dataUrl);
        setPortraitSuccess(true);
        setTimeout(() => setPortraitSuccess(false), 4000);
      }
    };
    reader.readAsDataURL(file);
  };

  // Export Copied State
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const currentVideos = getStoredVideos();
  const currentPhotos = getStoredPhotos();

  // Real-time preview of parsed YouTube ID
  const detectedYtId = getYouTubeId(videoUrl);
  const detectedThumb = detectedYtId ? getYouTubeThumbnail(detectedYtId) : null;

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) return;

    const newVideo: VideoItem = {
      id: `custom-vid-${Date.now()}`,
      title: videoTitle.trim(),
      category: videoCategory,
      youtubeUrl: videoUrl.trim(),
      youtubeId: detectedYtId || undefined,
      duration: videoDuration.trim() || 'Video',
      description: videoDescription.trim() || 'Performance / recording',
      thumbnail: detectedThumb || undefined
    };

    addCustomVideo(newVideo);
    setVideoAddedSuccess(true);
    setVideoUrl('');
    setVideoTitle('');
    setVideoDuration('');
    setVideoDescription('');
    setTimeout(() => setVideoAddedSuccess(false), 3000);
  };

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoTitle.trim() || !photoUrl.trim()) return;

    const newPhoto: PhotoItem = {
      id: `custom-photo-${Date.now()}`,
      title: photoTitle.trim(),
      category: photoCategory,
      image: photoUrl.trim(),
      caption: photoCaption.trim() || photoTitle.trim(),
      venueOrContext: photoVenue.trim() || (photoCategory === 'production' ? 'Opera Stage' : 'Behind the Scenes'),
      year: photoYear.trim() || new Date().getFullYear().toString(),
      role: photoRole.trim() || undefined
    };

    addCustomPhoto(newPhoto);
    setPhotoAddedSuccess(true);
    setPhotoUrl('');
    setPhotoTitle('');
    setPhotoCaption('');
    setPhotoVenue('');
    setPhotoYear('');
    setPhotoRole('');
    setTimeout(() => setPhotoAddedSuccess(false), 3000);
  };

  const generateExportCode = () => {
    return `// Paste this into src/data/content.ts to make your added media permanent for Netlify!

export const PHOTOS_COLLECTION: PhotoItem[] = ${JSON.stringify(currentPhotos, null, 2)};

export const VIDEOS_COLLECTION: VideoItem[] = ${JSON.stringify(currentVideos, null, 2)};
`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateExportCode());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full bg-[#111319] border border-[#2b303d] rounded-2xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0d0f14] shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#c49750]" />
            <span className="text-xs uppercase font-mono tracking-widest text-[#f0ede6]">
              Simple Media Manager
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#20232c] bg-[#141720] px-6 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'inbox'
                ? 'border-[#c49750] text-[#c49750] font-semibold'
                : 'border-transparent text-[#8e8b80] hover:text-white'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-[#c49750]" />
            <span>Messages / Inquiries</span>
            <span className="ml-1 px-1.5 py-0.2 bg-[#c49750]/20 text-[#c49750] text-[10px] font-mono rounded">
              {inquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('youtube')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'youtube'
                ? 'border-[#c49750] text-[#c49750] font-semibold'
                : 'border-transparent text-[#8e8b80] hover:text-white'
            }`}
          >
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>Add YouTube Link</span>
          </button>

          <button
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'photo'
                ? 'border-[#c49750] text-[#c49750] font-semibold'
                : 'border-transparent text-[#8e8b80] hover:text-white'
            }`}
          >
            <Image className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add Photo</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'export'
                ? 'border-[#c49750] text-[#c49750] font-semibold'
                : 'border-transparent text-[#8e8b80] hover:text-white'
            }`}
          >
            <Copy className="w-3.5 h-3.5 text-amber-300" />
            <span>Permanent Netlify Code</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* TAB 0: INBOX & MESSAGES */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              {/* Delivery Explainer Card */}
              <div className="p-4 bg-gradient-to-br from-[#121620] to-[#0e1017] border border-[#c49750]/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750]">
                  <Mail className="w-4 h-4" />
                  <span>Where messages go</span>
                </div>
                <p className="text-xs text-[#d1cdc2] leading-relaxed">
                  When a student or producer fills out the form on your website:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <strong className="text-white block mb-0.5">1. Studio Inbox (Right Here)</strong>
                    <span className="text-[#9c978b]">
                      Every inquiry is instantly recorded and viewable below with the student's name, email, role, and audio sample link.
                    </span>
                  </div>
                  <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <strong className="text-white block mb-0.5">2. Direct to <span className="text-[#c49750]">beeyondmagic@protonmail.com</span></strong>
                    <span className="text-[#9c978b]">
                      When your site is deployed to Netlify, Netlify Forms automatically captures submissions and sends an instant email notification directly to your Proton Mail inbox.
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-[#8c887d] font-mono">
                  <span>RECEIVED MESSAGES ({inquiries.length})</span>
                  <span>Newest first</span>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-12 text-center border border-dashed border-[#222632] rounded-xl space-y-2">
                    <MessageSquare className="w-8 h-8 text-[#4a4f5d] mx-auto" />
                    <p className="text-sm font-medium text-[#b5b1a6]">No messages received yet</p>
                    <p className="text-xs text-[#716e66]">
                      When someone books a lesson or submits an audio/video sample from the contact modal, it will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {inquiries.map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 bg-[#11141c] border border-[#232734] rounded-xl hover:border-[#c49750]/40 transition-all space-y-2.5"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">{inq.name}</span>
                            <span className="text-[#c49750] font-mono text-[11px] bg-[#c49750]/10 px-2 py-0.5 rounded">
                              {inq.topic}
                            </span>
                            <span className="text-[#8c887d] text-[11px]">({inq.discipline})</span>
                          </div>
                          <span className="text-[11px] text-[#716e66] font-mono">{inq.date}</span>
                        </div>

                        <p className="text-xs text-[#d1cdbf] whitespace-pre-wrap leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                          {inq.message || '(No text message)'}
                        </p>

                        {inq.audioLink && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-[#8c887d]">Audio/Video link:</span>
                            <a
                              href={inq.audioLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#c49750] underline hover:text-white flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>{inq.audioLink}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.topic} - Studio Abdellah Lasri`)}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c49750] hover:bg-[#d8a85c] text-black font-semibold text-xs rounded transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>Reply to {inq.email}</span>
                          </a>

                          <button
                            onClick={() => deleteInquiry(inq.id)}
                            className="p-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-white/5 rounded transition-colors flex items-center gap-1 font-mono"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1: YOUTUBE */}
          {activeTab === 'youtube' && (
            <div className="space-y-6">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-[#b8b5ab] leading-relaxed">
                <strong className="text-white block mb-1">How YouTube links work:</strong>
                Simply paste any standard YouTube URL (e.g., <code className="text-[#c49750]">https://www.youtube.com/watch?v=...</code> or <code className="text-[#c49750]">https://youtu.be/...</code>). The site automatically grabs the video thumbnail and embeds the player directly into your video library!
              </div>

              {videoAddedSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Your video was added! You can now watch it in the Video Gallery and Featured Video player.</span>
                </div>
              )}

              <form onSubmit={handleAddVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                    YouTube URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                  />
                </div>

                {/* Instant Live Preview of Detected Thumbnail */}
                {detectedThumb && (
                  <div className="flex items-center gap-3 p-3 bg-black/60 border border-[#c49750]/30 rounded-lg">
                    <img
                      src={detectedThumb}
                      alt="YouTube Thumbnail Preview"
                      className="w-24 aspect-video object-cover rounded border border-white/10"
                    />
                    <div className="text-xs">
                      <span className="text-emerald-400 font-medium block">✓ YouTube video recognized!</span>
                      <span className="text-[#8c887d] text-[11px]">Video ID: {detectedYtId}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Video Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="e.g. Singing Don José in Carmen"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white focus:outline-none focus:border-[#c49750]"
                    >
                      <option value="opera">Singing in Opera & Recitals</option>
                      <option value="composition">My Own Music & Compositions</option>
                      <option value="teaching">Future: Lessons & Method</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Duration (optional)
                    </label>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="e.g. 05:30"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Description / Note
                    </label>
                    <input
                      type="text"
                      value={videoDescription}
                      onChange={(e) => setVideoDescription(e.target.value)}
                      placeholder="e.g. Live stage performance at Opéra de Paris"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Video to Website</span>
                </button>
              </form>

              {/* List of currently active videos with delete button */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs uppercase font-mono text-[#8c887d] mb-3">
                  Current Videos in Gallery ({currentVideos.length}):
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentVideos.map((v) => (
                    <div
                      key={v.id}
                      className="flex items-center justify-between p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Youtube className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="text-[#dedacf] truncate">{v.title}</span>
                        <span className="text-[10px] text-[#78756d] uppercase font-mono shrink-0">({v.category})</span>
                      </div>
                      <button
                        onClick={() => deleteCustomVideo(v.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer shrink-0"
                        title="Delete video"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTO */}
          {activeTab === 'photo' && (
            <div className="space-y-6">
              {/* Main Portrait Section */}
              <div className="p-4 bg-[#181b24] border border-[#c49750]/40 rounded-xl">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] mb-1 font-semibold">
                  <Camera className="w-4 h-4" />
                  <span>Main First-Page Portrait Photo</span>
                </div>
                <p className="text-xs text-[#b8b5ab] mb-3">
                  Upload your real photograph directly from your computer. It will replace the image in the Hero section and Biography immediately.
                </p>

                {portraitSuccess ? (
                  <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Your real portrait has been updated across the website!</span>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-md">
                    <Upload className="w-3.5 h-3.5 text-black" />
                    <span>Select Portrait File From Computer</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePortraitUpload}
                    />
                  </label>
                )}
              </div>

              <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-[#b8b5ab] leading-relaxed">
                <strong className="text-white block mb-1">Add Stage & Behind-the-Scenes Photos:</strong>
                You can paste an online image link (from Cloudinary, Imgur, Dropbox, etc.), or if hosting on Netlify, put your image in the <code className="text-[#c49750]">/public/images/</code> folder and use <code className="text-[#c49750]">/images/my-photo.jpg</code>.
              </div>

              {photoAddedSuccess && (
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Photo added successfully! It is now visible in the Photo Gallery and Lightbox.</span>
                </div>
              )}

              <form onSubmit={handleAddPhoto} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                    Image URL or Path *
                  </label>
                  <input
                    type="text"
                    required
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... or /src/assets/images/... or /images/..."
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Photo Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={photoTitle}
                      onChange={(e) => setPhotoTitle(e.target.value)}
                      placeholder="e.g. Werther Act II"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Collection / Category *
                    </label>
                    <select
                      value={photoCategory}
                      onChange={(e) => setPhotoCategory(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white focus:outline-none focus:border-[#c49750]"
                    >
                      <option value="production">Singing in Productions</option>
                      <option value="behind_the_scenes">Behind the Scenes (Miscellaneous)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Venue / Context
                    </label>
                    <input
                      type="text"
                      value={photoVenue}
                      onChange={(e) => setPhotoVenue(e.target.value)}
                      placeholder="e.g. Grand Théâtre de Genève"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Role (optional)
                    </label>
                    <input
                      type="text"
                      value={photoRole}
                      onChange={(e) => setPhotoRole(e.target.value)}
                      placeholder="e.g. Faust"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                      Year
                    </label>
                    <input
                      type="text"
                      value={photoYear}
                      onChange={(e) => setPhotoYear(e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-[#9c988c] mb-1.5">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={photoCaption}
                    onChange={(e) => setPhotoCaption(e.target.value)}
                    placeholder="Short description of this moment"
                    className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo to Gallery</span>
                </button>
              </form>

              {/* List of currently active photos */}
              <div className="pt-4 border-t border-white/10">
                <div className="text-xs uppercase font-mono text-[#8c887d] mb-3">
                  Current Photos in Gallery ({currentPhotos.length}):
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {currentPhotos.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-2.5 bg-black/40 rounded-lg border border-white/5 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Image className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-[#dedacf] truncate">{p.title}</span>
                        <span className="text-[10px] text-[#78756d] uppercase font-mono shrink-0">
                          ({p.category === 'production' ? 'Production' : 'Behind Scenes'})
                        </span>
                      </div>
                      <button
                        onClick={() => deleteCustomPhoto(p.id)}
                        className="text-red-400 hover:text-red-300 p-1 cursor-pointer shrink-0"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT / CODE FOR NETLIFY */}
          {activeTab === 'export' && (
            <div className="space-y-5">
              <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-[#b8b5ab] leading-relaxed">
                <strong className="text-white block mb-1">Permanent Netlify Setup:</strong>
                Anything you add in this manager is saved in your browser right now. To make it permanent for everyone on your live Netlify website, copy the code below and paste it into <code className="text-[#c49750]">src/data/content.ts</code> in your project files!
              </div>

              <div className="relative">
                <pre className="p-4 bg-black/80 border border-white/10 rounded-xl text-[11px] font-mono text-[#dedacf] overflow-x-auto max-h-64 leading-tight">
                  {generateExportCode()}
                </pre>
                <button
                  onClick={handleCopyCode}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold rounded flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-black" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => {
                    if (window.confirm('Reset all photos and videos back to original defaults?')) {
                      resetMediaToDefaults();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-red-400/80 hover:text-red-300 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset to Original Demo Media</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-[#0d0f14] flex items-center justify-between shrink-0 text-xs text-[#8c887d]">
          <span>Netlify-ready single page site</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-medium cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
