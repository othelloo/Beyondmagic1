import React, { useState, useEffect } from 'react';
import {
  X,
  Youtube,
  Image as ImageIcon,
  Plus,
  Check,
  Trash2,
  Copy,
  Sparkles,
  RefreshCw,
  Camera,
  Upload,
  Inbox,
  Mail,
  MessageSquare,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Send,
  Clock,
  Link2,
  ShieldAlert,
  Download
} from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '../utils/youtube';
import {
  getStoredVideos,
  getStoredPhotos,
  addCustomVideo,
  deleteCustomVideo,
  moveVideo,
  addCustomPhoto,
  deleteCustomPhoto,
  movePhoto,
  resetMediaToDefaults,
  onMediaChange,
  savePortrait
} from '../data/mediaStore';
import {
  getActiveAdminPassword,
  checkAdminPassword,
  isUsingDefaultPassword,
  createPendingPasswordChange,
  getPendingPasswordChange,
  cancelPendingPasswordChange,
  validateAndApplyVerification,
  DEFAULT_ADMIN_PASSWORD,
  AUTHORIZED_ADMIN_EMAIL,
  PendingPasswordChange
} from '../data/adminAuthStore';
import { sendPasswordVerificationEmail, EmailDispatchResult } from '../utils/adminEmailService';
import {
  getStoredInquiries,
  deleteInquiry,
  onInquiriesChange,
  InquiryMessage,
  exportInquiriesAsCsv
} from '../data/inquiryStore';
import { VideoItem, PhotoItem } from '../types';

interface MediaManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MediaManagerModal: React.FC<MediaManagerModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inbox' | 'youtube' | 'photo' | 'security' | 'export'>('youtube');
  const [inquiries, setInquiries] = useState<InquiryMessage[]>(getStoredInquiries());
  const [videos, setVideos] = useState<VideoItem[]>(getStoredVideos());
  const [photos, setPhotos] = useState<PhotoItem[]>(getStoredPhotos());

  // Password / Authentication state - ALWAYS locked by default
  const [storedPassword, setStoredPasswordState] = useState<string>(getActiveAdminPassword());
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email verification banners
  const [verificationBanner, setVerificationBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Security tab state for email-verified password change
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmittingChange, setIsSubmittingChange] = useState(false);
  const [pendingChange, setPendingChange] = useState<PendingPasswordChange | null>(getPendingPasswordChange());
  const [emailDispatchResult, setEmailDispatchResult] = useState<EmailDispatchResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Synchronize with external changes
  useEffect(() => {
    const unsubInquiries = onInquiriesChange(() => {
      setInquiries(getStoredInquiries());
    });
    const unsubMedia = onMediaChange(() => {
      setVideos(getStoredVideos());
      setPhotos(getStoredPhotos());
    });
    return () => {
      unsubInquiries();
      unsubMedia();
    };
  }, []);

  // When modal opens or mounts, refresh current password & check for email verification link token
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setStoredPasswordState(getActiveAdminPassword());
    setPendingChange(getPendingPasswordChange());

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('verify_token') || urlParams.get('admin_token');
    const claim = urlParams.get('claim') || undefined;

    if (token) {
      validateAndApplyVerification(token, claim).then((res) => {
        if (res.success) {
          setVerificationBanner({ type: 'success', text: res.message });
          setStoredPasswordState(getActiveAdminPassword());
          setPendingChange(null);
          // Clean the address bar while keeping /admin
          const cleanPath = window.location.pathname.startsWith('/admin') ? '/admin' : window.location.pathname;
          window.history.replaceState(null, '', cleanPath);
        } else {
          setVerificationBanner({ type: 'error', text: res.message });
        }
      });
    }
  }, [isOpen]);

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

  // Export Copied State
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  // Real-time preview of parsed YouTube ID
  const detectedYtId = getYouTubeId(videoUrl);
  const detectedThumb = detectedYtId ? getYouTubeThumbnail(detectedYtId) : null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkAdminPassword(passwordInput)) {
      setIsUnlocked(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleLockStudio = () => {
    setIsUnlocked(false);
    setPasswordInput('');
  };

  const handleRequestPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmed = newPassword.trim();
    if (!trimmed) {
      setFormError('Please enter a new password.');
      return;
    }
    if (trimmed.length < 4) {
      setFormError('Password must be at least 4 characters long.');
      return;
    }
    if (trimmed !== confirmPassword.trim()) {
      setFormError('Passwords do not match. Please ensure both fields are identical.');
      return;
    }

    setIsSubmittingChange(true);
    try {
      const { token, verificationUrl, expiresAt } = createPendingPasswordChange(trimmed);
      const dispatch = await sendPasswordVerificationEmail({ token, verificationUrl, expiresAt });
      setEmailDispatchResult(dispatch);
      setPendingChange(getPendingPasswordChange());
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to submit password change request.');
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const handleCancelPending = () => {
    cancelPendingPasswordChange();
    setPendingChange(null);
    setEmailDispatchResult(null);
    setFormError('');
  };

  const handleCopyLink = (url: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

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

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setPhotoUrl(dataUrl);
        if (!photoTitle) {
          const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setPhotoTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
        }
      }
    };
    reader.readAsDataURL(file);
  };

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
    setVideos(getStoredVideos());
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
    setPhotos(getStoredPhotos());
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
    return `// Paste this into src/data/content.ts to make your media changes permanent in git/repo!

export const PHOTOS_COLLECTION: PhotoItem[] = ${JSON.stringify(photos, null, 2)};

export const VIDEOS_COLLECTION: VideoItem[] = ${JSON.stringify(videos, null, 2)};
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-[#111319] border border-[#2b303d] rounded-2xl shadow-2xl overflow-hidden my-4 sm:my-6 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-white/10 bg-[#0d0f14] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#c49750]/15 border border-[#c49750]/40 flex items-center justify-center text-[#c49750]">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono uppercase tracking-widest text-[#f0ede6] font-semibold">
                  Studio Admin
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c49750]/20 text-[#c49750] border border-[#c49750]/30">
                  /admin
                </span>
                {isUsingDefaultPassword() ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <KeyRound className="w-2.5 h-2.5" />
                    <span>Pass: temporaryadmin</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Verified Password</span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#8e8a7f] mt-0.5">
                Add, delete & reorder videos and gallery photos without editing code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isUnlocked && (
              <button
                onClick={handleLockStudio}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-[#b8b5ab] hover:text-white transition-colors cursor-pointer border border-white/10"
                title="Lock Admin Session"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#9c978b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Admin"
              title="Close (/admin)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STRICT LOCKED SCREEN - Access strictly requires the active password */}
        {!isUnlocked ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-[#181c26] border border-[#c49750]/40 flex items-center justify-center text-[#c49750]">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Studio Admin Access</h3>
              <p className="text-xs text-[#8e8a7f] max-w-sm">
                Access is restricted. Enter your password to manage videos, photos, and messages.
              </p>
            </div>

            {/* Email Verification Feedback Banner */}
            {verificationBanner && (
              <div
                className={`w-full max-w-sm p-3.5 rounded-xl border text-xs text-left flex items-start gap-2.5 animate-in fade-in ${
                  verificationBanner.type === 'success'
                    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-200'
                    : 'bg-red-950/70 border-red-500/50 text-red-200'
                }`}
              >
                {verificationBanner.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-semibold mb-0.5">
                    {verificationBanner.type === 'success' ? 'Password Verified & Activated' : 'Verification Issue'}
                  </div>
                  <div className="leading-relaxed">{verificationBanner.text}</div>
                </div>
              </div>
            )}

            {/* Password status hint */}
            <div className="p-2.5 bg-[#141722] border border-white/5 rounded-lg text-[11px] text-[#9c978b] max-w-xs w-full text-center font-mono">
              {isUsingDefaultPassword() ? (
                <span>Access Pass: <strong className="text-[#c49750]">temporaryadmin</strong></span>
              ) : (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Protected with verified password
                </span>
              )}
            </div>

            <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-3">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  placeholder="Enter admin password..."
                  className={`w-full px-4 py-2.5 bg-black/60 border rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none ${
                    passwordError ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2b303d] focus:border-[#c49750]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8e8a7f] hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <p className="text-[11px] text-red-400 font-mono">
                  Incorrect password. {isUsingDefaultPassword() ? '(Default pass is temporaryadmin)' : ''}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md"
              >
                Unlock Studio
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="flex border-b border-[#20232c] bg-[#141720] px-4 sm:px-6 shrink-0 overflow-x-auto gap-1">
              <button
                onClick={() => setActiveTab('youtube')}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'youtube'
                    ? 'border-[#c49750] text-[#c49750] font-semibold'
                    : 'border-transparent text-[#8e8b80] hover:text-white'
                }`}
              >
                <Youtube className="w-3.5 h-3.5 text-red-500" />
                <span>Videos ({videos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('photo')}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'photo'
                    ? 'border-[#c49750] text-[#c49750] font-semibold'
                    : 'border-transparent text-[#8e8b80] hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
                <span>Photos ({photos.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('inbox')}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'inbox'
                    ? 'border-[#c49750] text-[#c49750] font-semibold'
                    : 'border-transparent text-[#8e8b80] hover:text-white'
                }`}
              >
                <Inbox className="w-3.5 h-3.5 text-[#c49750]" />
                <span>Inbox</span>
                <span className="ml-1 px-1.5 py-0.2 bg-[#c49750]/20 text-[#c49750] text-[10px] font-mono rounded">
                  {inquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'security'
                    ? 'border-[#c49750] text-[#c49750] font-semibold'
                    : 'border-transparent text-[#8e8b80] hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                <span>Password / PIN</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`py-3 px-3 sm:px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors cursor-pointer shrink-0 ${
                  activeTab === 'export'
                    ? 'border-[#c49750] text-[#c49750] font-semibold'
                    : 'border-transparent text-[#8e8b80] hover:text-white'
                }`}
              >
                <Copy className="w-3.5 h-3.5 text-amber-300" />
                <span>Permanent Code</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6">

              {/* TAB 1: YOUTUBE VIDEOS (ADD + REORDER + DELETE) */}
              {activeTab === 'youtube' && (
                <div className="space-y-6">
                  {/* Notice */}
                  <div className="p-3.5 bg-black/40 border border-white/10 rounded-xl text-xs text-[#b8b5ab] leading-relaxed flex items-start gap-3">
                    <Youtube className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block mb-0.5">Add or Reorder YouTube Videos</strong>
                      <span>
                        Paste any YouTube link below. In the list below, use the <span className="text-[#c49750] font-mono">↑</span> and <span className="text-[#c49750] font-mono">↓</span> buttons to arrange which videos appear first in your gallery!
                      </span>
                    </div>
                  </div>

                  {videoAddedSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Video added! It is now active in your Video Gallery and Featured Video spotlight.</span>
                    </div>
                  )}

                  {/* Add Video Form */}
                  <form onSubmit={handleAddVideo} className="p-4 bg-[#141720]/80 border border-[#232734] rounded-xl space-y-3.5">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#c49750] font-semibold">
                      Add New YouTube Video
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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
                      <div className="flex items-center gap-3 p-2.5 bg-black/60 border border-[#c49750]/40 rounded-lg">
                        <img
                          src={detectedThumb}
                          alt="Thumbnail Preview"
                          className="w-24 aspect-video object-cover rounded border border-white/10"
                        />
                        <div className="text-xs">
                          <span className="text-emerald-400 font-medium block">✓ YouTube video recognized</span>
                          <span className="text-[#8c887d] text-[11px] font-mono">ID: {detectedYtId}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                          Category *
                        </label>
                        <select
                          value={videoCategory}
                          onChange={(e) => setVideoCategory(e.target.value as any)}
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white focus:outline-none focus:border-[#c49750]"
                        >
                          <option value="opera">Singing in Opera & Recitals</option>
                          <option value="composition">My Own Music & Compositions</option>
                          <option value="teaching">Lessons & Technique</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                          Description (optional)
                        </label>
                        <input
                          type="text"
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="e.g. Live stage performance"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Video to Gallery</span>
                    </button>
                  </form>

                  {/* Reorder and Delete List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#8c887d]">
                      <span>CURRENT VIDEOS ({videos.length}) — USE ARROWS TO REORDER</span>
                      <span className="text-[11px]">Top video appears first</span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {videos.map((v, index) => {
                        const ytId = v.youtubeId || getYouTubeId(v.youtubeUrl || '');
                        const thumb = v.thumbnail || (ytId ? getYouTubeThumbnail(ytId) : null);

                        return (
                          <div
                            key={v.id}
                            className="flex items-center justify-between p-2.5 bg-[#12151d] rounded-xl border border-white/5 hover:border-[#c49750]/30 transition-all gap-3 text-xs"
                          >
                            {/* Position Badge & Thumbnail */}
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="w-5 text-center font-mono text-[11px] text-[#6d6a60] shrink-0">
                                {index + 1}
                              </span>
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={v.title}
                                  className="w-14 aspect-video object-cover rounded border border-white/10 shrink-0"
                                />
                              ) : (
                                <div className="w-14 aspect-video bg-black/60 rounded flex items-center justify-center shrink-0">
                                  <Youtube className="w-4 h-4 text-red-500" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="text-white font-medium truncate">{v.title}</div>
                                <div className="text-[10px] text-[#8c887d] font-mono flex items-center gap-2">
                                  <span className="text-[#c49750] uppercase">{v.category}</span>
                                  {v.duration && <span>· {v.duration}</span>}
                                </div>
                              </div>
                            </div>

                            {/* Actions: Move Up, Move Down, Delete */}
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                disabled={index === 0}
                                onClick={() => moveVideo(v.id, 'up')}
                                className="p-1.5 rounded hover:bg-white/10 text-[#9c978b] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Move video up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={index === videos.length - 1}
                                onClick={() => moveVideo(v.id, 'down')}
                                className="p-1.5 rounded hover:bg-white/10 text-[#9c978b] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                title="Move video down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                              <div className="w-px h-4 bg-white/10 mx-0.5" />
                              <button
                                type="button"
                                onClick={() => deleteCustomVideo(v.id)}
                                className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                                title="Delete video"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PHOTOS (ADD + COMPUTER UPLOAD + REORDER + PORTRAIT) */}
              {activeTab === 'photo' && (
                <div className="space-y-6">
                  {/* Main Portrait Section */}
                  <div className="p-4 bg-[#141720]/80 border border-[#c49750]/40 rounded-xl space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] font-semibold">
                      <Camera className="w-4 h-4" />
                      <span>Main First-Page Portrait Photo</span>
                    </div>
                    <p className="text-xs text-[#b8b5ab]">
                      Select an image file from your computer. It instantly updates the main portrait in the Hero section and Biography.
                    </p>

                    {portraitSuccess ? (
                      <div className="p-3 bg-emerald-950/70 border border-emerald-500/50 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Your main portrait was successfully updated!</span>
                      </div>
                    ) : (
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#c49750] hover:bg-[#d8a85c] text-black text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer transition-all shadow-md">
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

                  {photoAddedSuccess && (
                    <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                      <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Photo added successfully! It is now visible in the Photo Gallery and Lightbox.</span>
                    </div>
                  )}

                  {/* Add Photo Form */}
                  <form onSubmit={handleAddPhoto} className="p-4 bg-[#141720]/80 border border-[#232734] rounded-xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono uppercase tracking-wider text-[#c49750] font-semibold">
                        Add Photo to Gallery
                      </span>
                      <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] cursor-pointer transition-colors">
                        <Upload className="w-3 h-3 text-[#c49750]" />
                        <span>Or upload file from computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoFileUpload}
                        />
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                        Image URL or Local Path *
                      </label>
                      <input
                        type="text"
                        required
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                        placeholder="https://... or /src/assets/images/... or uploaded file"
                        className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                      />
                    </div>

                    {/* Preview of Photo being added */}
                    {photoUrl && (
                      <div className="flex items-center gap-3 p-2 bg-black/60 border border-[#c49750]/30 rounded-lg">
                        <img
                          src={photoUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded border border-white/10"
                        />
                        <div className="text-xs text-[#9c978b]">
                          <span className="text-emerald-400 block font-medium">✓ Photo ready</span>
                          <span className="text-[11px] truncate max-w-xs block">{photoTitle || 'Enter title below'}</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                          Venue / Context
                        </label>
                        <input
                          type="text"
                          value={photoVenue}
                          onChange={(e) => setPhotoVenue(e.target.value)}
                          placeholder="e.g. Opéra de Paris"
                          className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
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

                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c49750] hover:bg-[#d8a85c] rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Photo to Gallery</span>
                    </button>
                  </form>

                  {/* Reorder and Delete List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono text-[#8c887d]">
                      <span>CURRENT PHOTOS ({photos.length}) — USE ARROWS TO REORDER</span>
                      <span className="text-[11px]">Top photo appears first</span>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {photos.map((p, index) => (
                        <div
                          key={`photo-item-${p.id}-${index}`}
                          className="flex items-center justify-between p-2.5 bg-[#12151d] rounded-xl border border-white/5 hover:border-[#c49750]/30 transition-all gap-3 text-xs"
                        >
                          {/* Position Badge & Thumbnail */}
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-5 text-center font-mono text-[11px] text-[#6d6a60] shrink-0">
                              {index + 1}
                            </span>
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-12 h-12 object-cover rounded border border-white/10 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-white font-medium truncate">{p.title}</div>
                              <div className="text-[10px] text-[#8c887d] font-mono flex items-center gap-2">
                                <span className="text-[#c49750] uppercase">
                                  {p.category === 'production' ? 'Production' : 'Behind Scenes'}
                                </span>
                                {p.venueOrContext && <span className="truncate">· {p.venueOrContext}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Actions: Move Up, Move Down, Delete */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => movePhoto(p.id, 'up')}
                              className="p-1.5 rounded hover:bg-white/10 text-[#9c978b] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move photo up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === photos.length - 1}
                              onClick={() => movePhoto(p.id, 'down')}
                              className="p-1.5 rounded hover:bg-white/10 text-[#9c978b] hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move photo down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <div className="w-px h-4 bg-white/10 mx-0.5" />
                            <button
                              type="button"
                              onClick={() => deleteCustomPhoto(p.id)}
                              className="p-1.5 rounded hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: INBOX & RECEIVED MESSAGES */}
              {activeTab === 'inbox' && (
                <div className="space-y-6">
                  {/* Delivery & Anti-Spam Zero-Loss Explainer Card */}
                  <div className="p-4 bg-gradient-to-br from-[#121620] to-[#0e1017] border border-[#c49750]/30 rounded-xl space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#c49750] font-semibold">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Direct Studio Inbox & Anti-Spam Protection</span>
                      </div>
                      {inquiries.length > 0 && (
                        <button
                          type="button"
                          onClick={exportInquiriesAsCsv}
                          className="px-3 py-1.5 text-xs font-mono bg-[#c49750]/15 hover:bg-[#c49750]/25 text-[#c49750] border border-[#c49750]/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Export to Excel / CSV</span>
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-[#d1cdc2] leading-relaxed">
                      <strong>How your messages are protected from Netlify spam cuts:</strong> Automated cloud filters (like Netlify&apos;s Akismet) frequently misjudge student messages that contain links (such as SoundCloud, YouTube, or Google Drive audition samples) as spam and drop them into a hidden spam folder.
                    </p>

                    <div className="p-3 bg-black/40 rounded-lg border border-emerald-500/20 text-xs text-[#b8b5ab] space-y-1">
                      <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Dual-Channel Safety Active:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Every single submission is logged directly into this Studio Inbox <em>before</em> any third-party filters run. Even if Netlify flags a message with a music link, it is 100% saved and readable right here.
                      </p>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#8c887d] font-mono">
                      <span>RECEIVED MESSAGES ({inquiries.length})</span>
                      {inquiries.length > 0 && (
                        <button
                          type="button"
                          onClick={exportInquiriesAsCsv}
                          className="text-[11px] text-[#c49750] hover:underline flex items-center gap-1"
                        >
                          <Download className="w-3 h-3" />
                          <span>Download CSV</span>
                        </button>
                      )}
                    </div>

                    {inquiries.length === 0 ? (
                      <div className="p-12 text-center border border-dashed border-[#222632] rounded-xl space-y-2">
                        <MessageSquare className="w-8 h-8 text-[#4a4f5d] mx-auto" />
                        <p className="text-sm font-medium text-[#b5b1a6]">No messages received yet</p>
                        <p className="text-xs text-[#716e66]">
                          When someone books a lesson or submits an audition sample, it will appear here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
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

              {/* TAB 4: SECURITY & EMAIL-VERIFIED PASSWORD SYSTEM */}
              {activeTab === 'security' && (
                <div className="space-y-5">
                  {/* Security Overview Card */}
                  <div className="p-4 bg-black/40 border border-[#2b303d] rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#c49750]" />
                        <span className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
                          Admin Security & Password Control
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleLockStudio}
                        className="px-2.5 py-1 text-[11px] font-mono text-amber-400 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 rounded border border-amber-500/20 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3 h-3" />
                        <span>Lock Studio Now</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#b8b5ab] leading-relaxed">
                      Admin access is restricted by password. You can update your password at any time. For maximum protection, any password change only activates when verified through your authorized email.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      <div className="p-3 bg-[#11141c] rounded-lg border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d]">Current Active Password:</span>
                        <div className="text-xs">
                          {isUsingDefaultPassword() ? (
                            <span className="text-amber-400 font-mono flex items-center gap-1 font-semibold">
                              <KeyRound className="w-3.5 h-3.5" /> temporaryadmin
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" /> Verified Custom Password
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3 bg-[#11141c] rounded-lg border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#8c887d]">Authorized Verification Email:</span>
                        <div className="text-xs font-mono text-[#c49750] truncate font-semibold">
                          {AUTHORIZED_ADMIN_EMAIL}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE PENDING EMAIL VERIFICATION CARD */}
                  {pendingChange && (
                    <div className="p-4 sm:p-5 bg-gradient-to-br from-[#1a1c12] to-[#12140e] border border-amber-500/40 rounded-xl space-y-3.5 shadow-lg animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                          <Clock className="w-4 h-4 animate-pulse" />
                          <span>Password Change Pending Email Verification</span>
                        </div>
                        <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                          Valid for 2 hours
                        </span>
                      </div>

                      <p className="text-xs text-[#e0ded5] leading-relaxed">
                        A request to change your admin password has been submitted. An authorization message was prepared for{' '}
                        <strong className="text-amber-300 font-mono">{AUTHORIZED_ADMIN_EMAIL}</strong>.
                      </p>

                      <div className="p-3 bg-black/50 border border-amber-500/20 rounded-lg text-xs space-y-1 text-[#d6d3c7]">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Strict Privacy & Verification Rules:</span>
                        </div>
                        <p className="text-[11px] text-[#b8b5ab]">
                          • The new password is <strong>never displayed</strong> in the email.
                        </p>
                        <p className="text-[11px] text-[#b8b5ab]">
                          • You simply click the link in your email to validate and activate it on your page.
                        </p>
                        <p className="text-[11px] text-[#b8b5ab]">
                          • Your current password (<strong>{isUsingDefaultPassword() ? 'temporaryadmin' : 'current password'}</strong>) continues to work until verified.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 pt-1">
                        <a
                          href="https://mail.proton.me/"
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 shadow"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Open ProtonMail (mail.proton.me)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {emailDispatchResult && (
                          <a
                            href={emailDispatchResult.mailtoUrl}
                            className="px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-xs rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5 text-[#c49750]" />
                            <span>Mail App</span>
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            const { verificationUrl } = createPendingPasswordChange(pendingChange.newPasswordValue);
                            handleCopyLink(verificationUrl);
                          }}
                          className="px-3 py-2 bg-[#1b1f2b] hover:bg-[#252b3b] text-[#c49750] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 border border-[#2b303d] cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedLink ? 'Link Copied!' : 'Copy Verification Link'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCancelPending}
                          className="px-3 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs rounded-lg transition-colors border border-red-500/20 cursor-pointer ml-auto"
                        >
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Set or Change Password Form */}
                  <form
                    onSubmit={handleRequestPasswordChange}
                    className="p-4 sm:p-5 bg-[#141720]/80 border border-[#232734] rounded-xl space-y-4"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-mono uppercase tracking-wider text-[#c49750] font-semibold flex items-center gap-2">
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{pendingChange ? 'Submit A Different Password' : 'Change Admin Password'}</span>
                      </div>
                      <p className="text-xs text-[#9c978b]">
                        Enter your desired new password below. A secure verification link will be prepared for{' '}
                        <strong className="text-white">{AUTHORIZED_ADMIN_EMAIL}</strong>. The change only works after clicking the link.
                      </p>
                    </div>

                    {formError && (
                      <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-300 flex items-center gap-2 animate-in fade-in">
                        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              setFormError('');
                            }}
                            placeholder="e.g. BeyondMagic2026!..."
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750] pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8a7f] hover:text-white cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-[#9c988c] mb-1">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              setFormError('');
                            }}
                            placeholder="Re-enter password..."
                            className="w-full px-3.5 py-2.5 bg-black/60 border border-[#2b303d] rounded-lg text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#c49750] pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8e8a7f] hover:text-white cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="submit"
                        disabled={isSubmittingChange || !newPassword.trim() || !confirmPassword.trim()}
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#c49750] hover:bg-[#d8a85c] disabled:opacity-40 text-black text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        {isSubmittingChange ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating & Dispatching Link...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>Send Verification Link to {AUTHORIZED_ADMIN_EMAIL}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 5: EXPORT / CODE FOR NETLIFY */}
              {activeTab === 'export' && (
                <div className="space-y-5">
                  <div className="p-4 bg-black/40 border border-white/10 rounded-xl text-xs text-[#b8b5ab] leading-relaxed">
                    <strong className="text-white block mb-1">Permanent Netlify Setup:</strong>
                    All additions and order changes you make here take effect immediately in your browser. If you want these media items baked into your git repository code for all visitors across all browsers, click below to copy the code:
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
                      <span>Reset to Original Defaults</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="px-5 sm:px-6 py-3.5 border-t border-white/10 bg-[#0d0f14] flex items-center justify-between shrink-0 text-xs text-[#8c887d]">
              <div className="flex items-center gap-2">
                <span>Secret link:</span>
                <code className="text-[#c49750] font-mono bg-black/40 px-2 py-0.5 rounded text-[11px]">
                  yoursite.com/admin
                </code>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#c49750] hover:bg-[#d8a85c] text-black font-semibold rounded-lg text-xs cursor-pointer transition-colors"
              >
                Close & Return to Site
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
