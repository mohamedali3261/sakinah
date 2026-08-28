import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  SlidersHorizontal,
  Film,
  Download,
  AlertCircle,
  HelpCircle,
  Heart
} from 'lucide-react';
import {
  Language,
  VideoConfig,
  QuranAyah,
  SurahMeta,
  RenderedVideoOutput
} from './types';
import { SURAHS_LIST } from './data/surahs';
import { NATURE_VIDEOS, NATURE_IMAGES, ALL_NATURE_MEDIA, fetchRandomNatureVideoByKeywords } from './data/natureVideos';
import { TRANSLATIONS } from './data/translations';
import { fetchQuranVerses } from './services/quranService';
import { renderQuranVideo, preloadSlideshowImages } from './services/videoRenderer';
import { VideoSettingsForm } from './components/VideoSettingsForm';
import { VideoPlayerPreview } from './components/VideoPlayerPreview';
import { RenderProgressModal } from './components/RenderProgressModal';
import { PexelsMediaModal } from './components/PexelsMediaModal';

interface QuranVideoCreatorProps {
  initialLang?: Language;
  onLangChange?: (lang: Language) => void;
}

export default function App({ initialLang = 'ar', onLangChange }: QuranVideoCreatorProps = {}) {
  // Application State
  const [lang, setLang] = useState<Language>(initialLang); // Use prop or default to Arabic
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');
  const [isPexelsModalOpen, setIsPexelsModalOpen] = useState(false);

  // Video Configuration (defaults to Surah Al-Mulk, 1-3, 9:16 vertical reels)
  const [config, setConfig] = useState<VideoConfig>({
    surahNumber: 67, // Surah Al-Mulk
    startingAyah: 1,
    ayahCount: 3,
    bgMediaType: 'video',
    selectedMediaId: undefined, // Enforce selection
    natureVideoId: undefined, // Enforce selection
    reciterId: 'alafasy',
    format: '9:16',
    showTranslation: true,
    showParticles: true,
    showVerseNumbers: false,
    verseStyle: 'border',
    fontSize: 'large',
    versePosition: 'bottom',
    randomBgMedia: false, // Turn off random auto-pick
    videoPlaybackSpeed: 0.5, // Default to 0.5x serene slow-motion
    showLogo: false,
    logoUrl: undefined,
    logoOpacity: 0.9,
    logoSize: 100
  });

  // Loaded Media & Quran Data
  const [verses, setVerses] = useState<QuranAyah[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Video Rendering & Download State
  const [isRenderModalOpen, setIsRenderModalOpen] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderedOutput, setRenderedOutput] = useState<RenderedVideoOutput | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  // Hidden offscreen canvas for rendering
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenVideoRef = useRef<HTMLVideoElement>(null);
  const hiddenImageRef = useRef<HTMLImageElement>(null);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';
  const currentSurah = SURAHS_LIST.find((s) => s.number === config.surahNumber) || SURAHS_LIST[0];

  const isVideoMode = (config.bgMediaType || 'video') === 'video';
  const currentMediaId = config.selectedMediaId || config.natureVideoId || 'forest-stream';
  const currentMedia =
    ALL_NATURE_MEDIA.find((m) => m.id === currentMediaId) || ALL_NATURE_MEDIA[0];

  const activeMediaSrc = config.customMediaUrl || config.customVideoUrl || currentMedia.url;

  // Update HTML document direction and title on language change
  useEffect(() => {
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isAr]);

  // Sync language with parent prop when it changes
  useEffect(() => {
    if (initialLang && initialLang !== lang) {
      setLang(initialLang);
    }
  }, [initialLang]);

  // Notify parent of language changes
  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    if (onLangChange) {
      onLangChange(newLang);
    }
  };

  // Initial load: preload default Surah verses so preview is ready right away if requested
  useEffect(() => {
    let isMounted = true;
    async function preloadDefault() {
      try {
        const data = await fetchQuranVerses(67, 1, 3, 'alafasy');
        if (isMounted) {
          setVerses(data);
        }
      } catch (err) {
        console.warn('Initial preload error:', err);
      }
    }
    preloadDefault();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler: "Generate Quran Video"
  const handleGenerate = async () => {
    // Validate that user has added or selected a background video or image
    const hasMedia = config.selectedMediaId || config.customVideoUrl || (config.customImages && config.customImages.length > 0);
    if (!hasMedia) {
      setErrorMsg(
        isAr
          ? '⚠️ يرجى إضافة صور أو فيديو كخلفية أولاً لتتمكن من إنشاء وتوليد الفيديو الكريم! اضغط على "مكتبة الصور والفيديو" لاختيار الخلفية.'
          : '⚠️ Please select or upload a background video or photo first! Click on "Media Library" to choose your background.'
      );
      setIsPexelsModalOpen(true); // Proactively open the background picker modal!
      return;
    }

    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const fetchedVerses = await fetchQuranVerses(
        config.surahNumber,
        config.startingAyah,
        config.ayahCount,
        config.reciterId
      );
      setVerses(fetchedVerses);
      setActiveTab('preview');
      // Scroll to top smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to generate video data:', err);
      setErrorMsg(t.statusError);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler: Render Final Video File
  const handleStartRender = async () => {
    if (!verses.length || !hiddenCanvasRef.current) return;

    setIsRenderModalOpen(true);
    setIsRendering(true);
    setRenderProgress(0);
    setRenderedOutput(null);
    setRenderError(null);

    // Ensure hidden media is loaded and ready
    if (isVideoMode && hiddenVideoRef.current) {
      hiddenVideoRef.current.src = activeMediaSrc;
      hiddenVideoRef.current.playbackRate = config.videoPlaybackSpeed ?? 0.5;
      hiddenVideoRef.current.load();
      hiddenVideoRef.current.play().catch(() => {});
    } else if (!isVideoMode && hiddenImageRef.current) {
      hiddenImageRef.current.src = activeMediaSrc;
    }

    try {
      let loadedSlideshowImgs: HTMLImageElement[] | undefined = undefined;
      if (!isVideoMode) {
        const urls = config.customImages && config.customImages.length > 0
          ? config.customImages
          : NATURE_IMAGES.map((img) => img.url);
        loadedSlideshowImgs = await preloadSlideshowImages(urls);
      }

      const activeMediaEl = isVideoMode ? hiddenVideoRef.current : hiddenImageRef.current;
      const output = await renderQuranVideo({
        canvas: hiddenCanvasRef.current,
        videoElement: hiddenVideoRef.current,
        imageElement: hiddenImageRef.current,
        mediaElement: activeMediaEl,
        slideshowImages: loadedSlideshowImgs,
        verses,
        surah: currentSurah,
        format: config.format,
        showTranslation: config.showTranslation,
        showParticles: config.showParticles,
        showSurahHeader: config.showSurahHeader,
        showVerseNumbers: config.showVerseNumbers,
        fontSize: config.fontSize,
        versePosition: config.versePosition || 'bottom',
        showLogo: config.showLogo,
        logoUrl: config.logoUrl,
        logoOpacity: config.logoOpacity,
        logoSize: config.logoSize,
        onProgress: (percent) => {
          setRenderProgress(percent);
        }
      });

      setRenderedOutput(output);
      setIsRendering(false);
      setRenderProgress(100);
    } catch (err) {
      console.error('Video rendering failed:', err);
      setRenderError(
        isAr
          ? 'حدث خطأ أثناء رندرة الفيديو أو أن المتصفح لا يدعم تسجيل الكانفاس. يرجى تجربة متصفح حديث مثل Chrome أو Edge.'
          : 'Video rendering failed or canvas recording is not supported in this browser. Please try Chrome or Edge.'
      );
      setIsRendering(false);
    }
  };

  const getThemeBackground = () => {
    // Always dark mode
    return 'bg-gradient-to-br from-slate-950/90 via-[#06181b]/92 to-slate-950/90 text-slate-100';
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-body selection:bg-amber-500/30 selection:text-amber-200 ${getThemeBackground()} ${
        isAr ? 'font-arabic' : ''
      }`}
    >
      {/* Offscreen elements for Canvas Video Recording engine */}
      <canvas
        ref={hiddenCanvasRef}
        style={{ position: 'fixed', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}
      />
      <video
        ref={hiddenVideoRef}
        src={isVideoMode ? activeMediaSrc : undefined}
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ position: 'fixed', top: -9999, left: -9999, width: 320, height: 180, opacity: 0, pointerEvents: 'none' }}
      />
      <img
        ref={hiddenImageRef}
        src={!isVideoMode ? activeMediaSrc : undefined}
        crossOrigin="anonymous"
        alt="hidden background"
        style={{ position: 'fixed', top: -9999, left: -9999, width: 320, height: 180, opacity: 0, pointerEvents: 'none' }}
      />

      {/* Header removed - using Yaqeen Navbar instead */}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6">
        {/* Hero Welcome Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-4 h-4" />
            <span>{isAr ? 'توليد فيديو قرآني تلقائي بالكامل' : '100% Automated Quran Video Generator'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400 drop-shadow-lg font-display">
            {isAr ? 'أنشئ فيديوهات قرآنية خاشعة ومتقنة' : 'Create Stunning Quran Recitation Videos'}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {t.tagline}
          </p>
        </div>

        {/* Navigation Step Pills */}
        <div className="flex justify-center">
          <div className="inline-flex p-2 rounded-3xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 shadow-xl">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'config'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              <span>{t.step1Title}</span>
            </button>

            <button
              onClick={() => {
                if (verses.length) setActiveTab('preview');
                else handleGenerate();
              }}
              className={`px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'preview'
                  ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Film className="w-4 h-4 text-amber-400" />
              <span>{t.step2Title}</span>
              {verses.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto p-5 rounded-3xl bg-gradient-to-br from-red-950/50 to-red-900/30 backdrop-blur-xl border border-red-500/30 text-red-300 text-sm flex items-center gap-3 shadow-xl shadow-red-500/10">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Content Views */}
        {activeTab === 'config' ? (
          <VideoSettingsForm
            config={config}
            lang={lang}
            isGenerating={isGenerating}
            onChange={setConfig}
            onGenerate={handleGenerate}
            onOpenPexelsModal={() => setIsPexelsModalOpen(true)}
          />
        ) : (
          <VideoPlayerPreview
            verses={verses}
            surah={currentSurah}
            config={config}
            lang={lang}
            onReconfigure={() => setActiveTab('config')}
            onStartRender={handleStartRender}
            isRendering={isRendering}
          />
        )}
      </main>

      {/* Pexels Media Search & Select Modal */}
      <PexelsMediaModal
        isOpen={isPexelsModalOpen}
        lang={lang}
        bgMediaType={config.bgMediaType || 'video'}
        format={config.format}
        currentVideoUrl={config.customVideoUrl}
        currentImageUrls={config.customImages}
        onClose={() => setIsPexelsModalOpen(false)}
        onApplyVideo={(videoUrl) => {
          setConfig((prev) => ({
            ...prev,
            bgMediaType: 'video',
            customVideoUrl: videoUrl,
            customMediaUrl: videoUrl
          }));
          setIsPexelsModalOpen(false);
        }}
        onApplyPhotos={(imageUrls) => {
          setConfig((prev) => ({
            ...prev,
            bgMediaType: 'image',
            customImages: imageUrls,
            customMediaUrl: imageUrls[0]
          }));
          setIsPexelsModalOpen(false);
        }}
        onSelectVideo={(videoUrl) => {
          setConfig((prev) => ({
            ...prev,
            bgMediaType: 'video',
            customVideoUrl: videoUrl,
            customMediaUrl: videoUrl
          }));
          setIsPexelsModalOpen(false);
        }}
        onSelectImages={(imageUrls) => {
          setConfig((prev) => ({
            ...prev,
            bgMediaType: 'image',
            customImages: imageUrls,
            customMediaUrl: imageUrls[0]
          }));
          setIsPexelsModalOpen(false);
        }}
      />

      {/* Render Progress & Download Video Modal */}
      <RenderProgressModal
        isOpen={isRenderModalOpen}
        isRendering={isRendering}
        progressPercent={renderProgress}
        output={renderedOutput}
        errorMessage={renderError}
        format={config.format}
        lang={lang}
        onClose={() => {
          setIsRenderModalOpen(false);
          setRenderError(null);
        }}
        onRetry={handleStartRender}
        onDownload={() => {
          // Optional callback
        }}
      />

      {/* Footer removed - using Yaqeen Footer from parent */}
    </div>
  );
}
