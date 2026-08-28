import React, { useState, useEffect } from 'react';
import {
  X,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Film,
  Check,
  Play,
  ChevronDown
} from 'lucide-react';
import { Language, BackgroundMediaType, VideoFormat } from '../types';
import {
  searchPexelsVideos,
  getPopularPexelsVideos,
  searchPexelsPhotos,
  getCuratedPexelsPhotos,
  getBestPexelsVideoUrl,
  PexelsVideoItem,
  PexelsPhotoItem
} from '../services/pexelsService';

interface PexelsMediaModalProps {
  isOpen: boolean;
  lang: Language;
  bgMediaType?: BackgroundMediaType;
  format?: VideoFormat;
  currentVideoUrl?: string;
  currentImageUrls?: string[];
  onApplyVideo?: (videoUrl: string, titleAr?: string) => void;
  onApplyPhotos?: (imageUrls: string[], titleAr?: string) => void;
  onSelectVideo?: (videoUrl: string, titleAr?: string) => void;
  onSelectImages?: (imageUrls: string[], titleAr?: string) => void;
  onClose: () => void;
}

export const PexelsMediaModal: React.FC<PexelsMediaModalProps> = ({
  isOpen,
  lang,
  bgMediaType: initialMediaType = 'video',
  format = '9:16',
  currentVideoUrl,
  currentImageUrls = [],
  onApplyVideo,
  onApplyPhotos,
  onSelectVideo,
  onSelectImages,
  onClose
}) => {
  const isAr = lang === 'ar';
  const [mediaType, setMediaType] = useState<BackgroundMediaType>(initialMediaType || 'video');
  const [searchQuery, setSearchQuery] = useState<string>('شوارع خالية');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  const [videos, setVideos] = useState<PexelsVideoItem[]>([]);
  const [photos, setPhotos] = useState<PexelsPhotoItem[]>([]);

  // Selection state
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(currentVideoUrl || '');
  const [selectedImageUrls, setSelectedImageUrls] = useState<string[]>(currentImageUrls);

  // Sync initial state when modal opens
  useEffect(() => {
    if (isOpen) {
      const typeToUse: BackgroundMediaType = (initialMediaType as BackgroundMediaType) || 'video';
      setMediaType(typeToUse);
      if (currentVideoUrl) setSelectedVideoUrl(currentVideoUrl);
      if (currentImageUrls && currentImageUrls.length > 0) setSelectedImageUrls(currentImageUrls);
      setPage(1);
      fetchMedia(searchQuery, typeToUse, 1, false);
    }
  }, [isOpen, initialMediaType]);

  // Execute Search / Fetch
  const fetchMedia = async (
    queryToSearch: string,
    type: BackgroundMediaType,
    pageNum: number = 1,
    append: boolean = false
  ) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      if (type === 'video') {
        const vResults = queryToSearch.trim()
          ? await searchPexelsVideos(queryToSearch, format, pageNum, 80)
          : await getPopularPexelsVideos(format, pageNum, 80);

        setVideos((prev) => (append ? [...prev, ...vResults] : vResults));
      } else {
        const pResults = queryToSearch.trim()
          ? await searchPexelsPhotos(queryToSearch, format, pageNum, 80)
          : await getCuratedPexelsPhotos(pageNum, 80);

        setPhotos((prev) => (append ? [...prev, ...pResults] : pResults));
      }
    } catch (err) {
      console.error('Error fetching media:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleTagClick = (tagAr: string) => {
    setSearchQuery(tagAr);
    setPage(1);
    fetchMedia(tagAr, mediaType, 1, false);
  };

  const handleMediaTypeChange = (newType: BackgroundMediaType) => {
    setMediaType(newType);
    setPage(1);
    fetchMedia(searchQuery, newType, 1, false);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMedia(searchQuery, mediaType, nextPage, true);
  };

  const togglePhotoSelection = (photoUrl: string) => {
    setSelectedImageUrls((prev) => {
      if (prev.includes(photoUrl)) {
        return prev.filter((u) => u !== photoUrl);
      } else {
        return [...prev, photoUrl];
      }
    });
  };

  const handleApply = () => {
    const videoTitle = searchQuery ? `فيديو: ${searchQuery}` : 'فيديو طبيعة';
    const photosTitle = `ألبوم ${selectedImageUrls.length} صور`;

    if (mediaType === 'video') {
      if (selectedVideoUrl) {
        if (typeof onApplyVideo === 'function') {
          onApplyVideo(selectedVideoUrl, videoTitle);
        }
        if (typeof onSelectVideo === 'function') {
          onSelectVideo(selectedVideoUrl, videoTitle);
        }
      }
    } else {
      if (selectedImageUrls.length > 0) {
        if (typeof onApplyPhotos === 'function') {
          onApplyPhotos(selectedImageUrls, photosTitle);
        }
        if (typeof onSelectImages === 'function') {
          onSelectImages(selectedImageUrls, photosTitle);
        }
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  const PRESET_TAGS = [
    { ar: 'شوارع خالية', en: 'empty street' },
    { ar: 'شلالات', en: 'waterfalls' },
    { ar: 'غابات وأشجار', en: 'forest' },
    { ar: 'جبال وضباب', en: 'mountains' },
    { ar: 'أمواج البحر', en: 'ocean' },
    { ar: 'سماء ونجوم', en: 'stars' },
    { ar: 'مطر وسحب', en: 'rain' },
    { ar: 'غروب ذهبي', en: 'sunset' },
    { ar: 'صحراء ورمال', en: 'desert' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 dir-rtl">
      <div className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-emerald-500/20 flex items-center justify-between bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-emerald-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-emerald-500/10 shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white">
                {isAr ? 'مكتبة الصور والفيديو' : 'Media Library'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {isAr ? 'اختر الأقسام التالية لعرض جميع الفيديوهات والصور المتاحة' : 'Select a category to view nature backgrounds'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-slate-300 hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Media Type Tabs & Category Tag Buttons */}
        <div className="p-4 bg-gradient-to-br from-slate-900/30 via-slate-800/20 to-slate-900/30 border-b border-emerald-500/20 space-y-2.5 shrink-0">
          
          {/* Tabs: Video vs Photos */}
          <div className="flex p-1 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => handleMediaTypeChange('video')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mediaType === 'video'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>{isAr ? 'فيديو حي' : 'Video'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleMediaTypeChange('image')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                mediaType === 'image'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isAr ? 'ألبوم صور' : 'Photos'}</span>
              {selectedImageUrls.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-gradient-to-br from-slate-900 to-slate-950 text-amber-300 text-[10px] font-extrabold border border-emerald-500/20">
                  {selectedImageUrls.length}
                </span>
              )}
            </button>
          </div>

          {/* Dropdown Category Select */}
          <div className="flex flex-col gap-1 max-w-sm mx-auto w-full pt-1">
            <label className="text-[10px] text-neutral-400 font-bold block text-center uppercase tracking-wider">
              {isAr ? 'اختر تصنيف الخلفية من القائمة' : 'Select Background Category'}
            </label>
            <div className="relative">
              <select
                value={searchQuery}
                onChange={(e) => handleTagClick(e.target.value)}
                className="w-full px-4 py-2.5 bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 text-center text-xs text-amber-400 font-extrabold rounded-xl appearance-none cursor-pointer focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20"
              >
                {PRESET_TAGS.map((tag) => (
                  <option key={tag.ar} value={tag.ar} className="bg-gradient-to-br from-slate-900 to-slate-950 text-white font-bold py-2">
                    {isAr ? tag.ar : tag.en}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-neutral-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Media Grid Results */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 custom-scrollbar">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2 text-neutral-400">
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              <p className="text-xs font-medium">
                {isAr ? 'جاري جلب الفيديوهات والصور...' : 'Loading media...'}
              </p>
            </div>
          ) : mediaType === 'video' ? (
            /* Videos Grid */
            videos.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-neutral-400">
                <p className="text-xs font-semibold">لا توجد فيديوهات متاحة لهذا القسم حالياً.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
                  {videos.map((vid) => {
                    const videoLink = getBestPexelsVideoUrl(vid);
                    const isSelected = selectedVideoUrl === videoLink;
                    return (
                      <div
                        key={vid.id}
                        onClick={() => setSelectedVideoUrl(videoLink)}
                        className={`group relative rounded-xl overflow-hidden aspect-[9/16] border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/60 scale-[1.02] shadow-lg'
                            : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/20 hover:border-amber-400/60'
                        }`}
                      >
                        <img
                          src={vid.image}
                          alt={vid.user.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-between p-1.5">
                          <div className="flex items-center justify-between">
                            <span className="px-1 py-0.5 rounded bg-black/60 text-white text-[8px] font-mono">
                              {vid.duration}s
                            </span>
                            {isSelected && (
                              <div className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 text-[9px] text-amber-200 font-medium">
                            <Play className="w-2 h-2 fill-current shrink-0" />
                            <span className="truncate">{vid.user.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center pt-2 pb-4">
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-amber-300 hover:text-amber-200 font-bold text-xs border border-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{isAr ? 'عرض المزيد من الفيديوهات (+80)' : 'Load More Videos (+80)'}</span>
                    )}
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Photos Grid */
            photos.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-neutral-400">
                <p className="text-xs font-semibold">لا توجد صور متاحة لهذا القسم حالياً.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-1.5">
                  {photos.map((photo) => {
                    const photoUrl = photo.src.large2x || photo.src.large;
                    const selectedIndex = selectedImageUrls.indexOf(photoUrl);
                    const isSelected = selectedIndex !== -1;
                    return (
                      <div
                        key={photo.id}
                        onClick={() => togglePhotoSelection(photoUrl)}
                        className={`group relative rounded-lg overflow-hidden aspect-[9/16] border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-400 ring-2 ring-amber-400/60 scale-[1.02] shadow-lg'
                            : 'bg-gradient-to-br from-slate-900 to-slate-950 border-emerald-500/20 hover:border-amber-400/60'
                        }`}
                      >
                        <img
                          src={photo.src.medium}
                          alt={photo.photographer}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-between p-1.5">
                          <div className="flex justify-end">
                            {isSelected ? (
                              <div className="w-4 h-4 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-extrabold text-[9px] shadow">
                                {selectedIndex + 1}
                              </div>
                            ) : (
                              <div className="w-3.5 h-3.5 rounded-full bg-black/40 border border-white/40 group-hover:border-amber-400" />
                            )}
                          </div>

                          <span className="text-[8px] text-amber-200 truncate font-medium">
                            {photo.photographer}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Load More Button */}
                <div className="flex justify-center pt-2 pb-4">
                  <button
                    type="button"
                    disabled={isLoadingMore}
                    onClick={handleLoadMore}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 text-amber-300 hover:text-amber-200 font-bold text-xs border border-emerald-500/20 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>{isAr ? 'عرض المزيد من الصور (+80)' : 'Load More Photos (+80)'}</span>
                    )}
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {/* Modal Footer Bar & Apply Action */}
        <div className="p-4 sm:p-5 border-t border-emerald-500/20 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <div className="text-xs text-slate-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            {mediaType === 'video' ? (
              <span>
                {selectedVideoUrl ? (
                  <strong className="text-amber-300">تم اختيار خلفية فيديو للمشهد 🎥</strong>
                ) : (
                  'انقر على فيديو من القائمة لاختياره'
                )}
              </span>
            ) : (
              <span>
                {selectedImageUrls.length > 0 ? (
                  <strong className="text-amber-300">
                    تم اختيار ({selectedImageUrls.length}) صور للألبوم 🌄
                  </strong>
                ) : (
                  'يمكنك اختيار صورة أو أكثر لتكوين ألبوم صور متحرّكة'
                )}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 text-slate-300 text-xs font-bold transition-all border border-emerald-500/20"
            >
              إلغاء
            </button>

            <button
              type="button"
              disabled={mediaType === 'video' ? !selectedVideoUrl : selectedImageUrls.length === 0}
              onClick={handleApply}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-neutral-950 font-extrabold text-xs shadow-md transition-all disabled:opacity-40"
            >
              تطبيق على الفيديو 🚀
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
