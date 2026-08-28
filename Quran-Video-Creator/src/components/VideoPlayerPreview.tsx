import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Film,
  Sparkles,
  Settings2,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
  Gauge,
  Download,
  Shuffle
} from 'lucide-react';
import { Language, QuranAyah, SurahMeta, VideoConfig, VideoFormat } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { NATURE_VIDEOS, NATURE_IMAGES, ALL_NATURE_MEDIA } from '../data/natureVideos';
import {
  drawQuranFrame,
  createParticles,
  getResolutionForFormat,
  createContinuousAudioTrack,
  preloadSlideshowImages,
  Particle
} from '../services/videoRenderer';
import { updateCachedAudioDuration } from '../services/quranService';

interface VideoPlayerPreviewProps {
  verses: QuranAyah[];
  surah: SurahMeta;
  config: VideoConfig;
  lang: Language;
  onReconfigure: () => void;
  onStartRender: () => void;
  isRendering: boolean;
}

export const VideoPlayerPreview: React.FC<VideoPlayerPreviewProps> = ({
  verses,
  surah,
  config,
  lang,
  onReconfigure,
  onStartRender,
  isRendering
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [isPreparingAudio, setIsPreparingAudio] = useState(true);

  const t = TRANSLATIONS[lang];
  const isAr = lang === 'ar';

  // Calculate cumulative timestamps for verses
  const timeline = useMemo(() => {
    let acc = 0;
    const items = verses.map((v, i) => {
      const duration = v.duration || 5;
      const start = acc;
      const end = acc + duration;
      acc = end;
      return { index: i, start, end, duration, ayah: v };
    });
    return { items, totalDuration: Math.max(0.1, acc) };
  }, [verses]);

  // Synchronized refs for silky 60fps render loop
  const currentTimeRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(performance.now());
  const audioContextRef = useRef<AudioContext | null>(null);

  // Background Media resolution
  const isVideoMode = (config.bgMediaType || 'video') === 'video';
  const currentMediaId = config.selectedMediaId || config.natureVideoId || 'forest-stream';

  const currentMedia = useMemo(() => {
    return (
      ALL_NATURE_MEDIA.find((m) => m.id === currentMediaId) ||
      (isVideoMode ? ALL_NATURE_MEDIA[0] : ALL_NATURE_MEDIA.find((m) => m.type === 'image') || ALL_NATURE_MEDIA[0])
    );
  }, [currentMediaId, isVideoMode]);

  const activeMediaSrc = useMemo(() => {
    return config.customMediaUrl || config.customVideoUrl || currentMedia.url;
  }, [config.customMediaUrl, config.customVideoUrl, currentMedia]);

  // Current active Ayah
  const currentItem = useMemo(() => {
    return (
      timeline.items.find((item) => currentTime >= item.start && currentTime < item.end) ||
      timeline.items[timeline.items.length - 1] ||
      null
    );
  }, [timeline, currentTime]);

  // Floating particles
  const particlesRef = useRef<Particle[]>([]);
  useEffect(() => {
    const { width, height } = getResolutionForFormat(config.format);
    particlesRef.current = createParticles(35, width, height);
  }, [config.format]);

  // Nature Photo Slideshow Preloader
  const slideshowImagesRef = useRef<HTMLImageElement[]>([]);
  useEffect(() => {
    if (!isVideoMode) {
      const urls =
        config.customImages && config.customImages.length > 0
          ? config.customImages
          : NATURE_IMAGES.map((img) => img.url);
      preloadSlideshowImages(urls).then((imgs) => {
        slideshowImagesRef.current = imgs;
      });
    } else {
      slideshowImagesRef.current = [];
    }
  }, [isVideoMode, config.customImages]);

  // Load Brand Logo Image if configured
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  useEffect(() => {
    if (config.showLogo && config.logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setLogoImage(img);
      };
      img.onerror = () => {
        console.warn('Failed to load logo image');
        setLogoImage(null);
      };
      img.src = config.logoUrl;
    } else {
      setLogoImage(null);
    }
  }, [config.showLogo, config.logoUrl]);

  // Continuous Seamless Audio Track Generation (User Request: no stopping at every verse)
  useEffect(() => {
    let isMounted = true;
    let createdBlobUrl: string | null = null;

    async function buildContinuousRecitation() {
      if (!verses.length) return;
      setIsPreparingAudio(true);
      setIsAudioReady(false);

      try {
        if (!audioContextRef.current) {
          const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audioContextRef.current = new AudioContextClass();
        }

        // Merge all verses into one seamless WAV track
        const continuousTrack = await createContinuousAudioTrack(verses, audioContextRef.current);
        if (!isMounted) return;

        createdBlobUrl = continuousTrack.blobUrl;
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = continuousTrack.blobUrl;
          audioRef.current.load();
          audioRef.current.currentTime = currentTimeRef.current;
          if (isPlayingRef.current) {
            audioRef.current.play().catch((err) => {
              if (err.name !== 'AbortError') {
                console.warn('Audio play error:', err);
              }
            });
          }
        }
        setIsAudioReady(true);
      } catch (err) {
        console.warn('Continuous audio build fallback to first ayah:', err);
        // Fallback: load first ayah if audio concatenation encounters CORS
        if (isMounted && verses[0] && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = verses[0].audioUrl;
          audioRef.current.load();
          setIsAudioReady(true);
        }
      } finally {
        if (isMounted) {
          setIsPreparingAudio(false);
        }
      }
    }

    buildContinuousRecitation();

    return () => {
      isMounted = false;
      if (createdBlobUrl) {
        URL.revokeObjectURL(createdBlobUrl);
      }
    };
  }, [verses]);

  // Background media element loading & playback rate setup
  useEffect(() => {
    if (isVideoMode && videoRef.current) {
      videoRef.current.src = activeMediaSrc;
      videoRef.current.playbackRate = config.videoPlaybackSpeed ?? 0.5;
      videoRef.current.muted = true;
      videoRef.current.loop = true;
      videoRef.current.load();
      if (isPlayingRef.current) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    } else if (!isVideoMode && imageRef.current) {
      imageRef.current.src = activeMediaSrc;
    }
  }, [activeMediaSrc, isVideoMode, config.videoPlaybackSpeed]);

  // Ensure playbackRate stays synced
  useEffect(() => {
    if (isVideoMode && videoRef.current) {
      videoRef.current.playbackRate = config.videoPlaybackSpeed ?? 0.5;
    }
  }, [config.videoPlaybackSpeed, isVideoMode]);

  // Handle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      audio?.pause();
      if (isVideoMode) videoRef.current?.pause();
    } else {
      if (currentTimeRef.current >= timeline.totalDuration - 0.1) {
        currentTimeRef.current = 0;
        setCurrentTime(0);
        if (audio) audio.currentTime = 0;
      }
      setIsPlaying(true);
      isPlayingRef.current = true;
      lastTimeRef.current = performance.now();

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(() => {});
      }

      if (isVideoMode && videoRef.current) {
        videoRef.current.playbackRate = config.videoPlaybackSpeed ?? 0.5;
        videoRef.current.play().catch(() => {});
      }

      if (audio) {
        audio.currentTime = currentTimeRef.current;
        audio.play().catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('Audio play request issue:', err);
          }
        });
      }
    }
  };

  // Handle Seeking
  const handleSeek = (time: number) => {
    const clampedTime = Math.max(0, Math.min(time, timeline.totalDuration));
    currentTimeRef.current = clampedTime;
    setCurrentTime(clampedTime);

    if (audioRef.current) {
      audioRef.current.currentTime = clampedTime;
      if (isPlayingRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  // Real-time 60fps Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = getResolutionForFormat(config.format);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    lastTimeRef.current = performance.now();
    let lastUiUpdate = 0;

    const render = (now: number) => {
      const delta = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      if (isPlayingRef.current) {
        const audio = audioRef.current;
        if (audio && !audio.paused && audio.duration > 0 && isFinite(audio.currentTime)) {
          // Master continuous audio clock: absolute precision, no stutter or verse pause
          currentTimeRef.current = audio.currentTime;
        } else {
          currentTimeRef.current += delta;
        }

        if (currentTimeRef.current >= timeline.totalDuration) {
          currentTimeRef.current = timeline.totalDuration;
          setCurrentTime(timeline.totalDuration);
          setIsPlaying(false);
          isPlayingRef.current = false;
          audioRef.current?.pause();
          if (isVideoMode) videoRef.current?.pause();
        } else {
          // Throttle state update for performance while canvas renders at 60fps
          if (now - lastUiUpdate > 60) {
            setCurrentTime(currentTimeRef.current);
            lastUiUpdate = now;
          }
        }
      }

      // Render frame with unified mediaElement (video or image)
      const mediaElement = isVideoMode ? videoRef.current : imageRef.current;
      drawQuranFrame(
        ctx,
        width,
        height,
        currentTimeRef.current,
        timeline.totalDuration,
        verses,
        surah,
        mediaElement,
        {
          format: config.format,
          showTranslation: config.showTranslation,
          showParticles: config.showParticles,
          showSurahHeader: config.showSurahHeader,
          showVerseNumbers: config.showVerseNumbers,
          fontSize: config.fontSize,
          verseStyle: config.verseStyle,
          versePosition: config.versePosition || 'bottom',
          particles: particlesRef.current,
          slideshowImages: isVideoMode ? undefined : slideshowImagesRef.current,
          showLogo: config.showLogo,
          logoOpacity: config.logoOpacity,
          logoImage: logoImage,
          logoSize: config.logoSize
        }
      );

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [
    config.format,
    config.showTranslation,
    config.showParticles,
    config.fontSize,
    config.verseStyle,
    config.versePosition,
    config.showLogo,
    config.logoOpacity,
    config.logoSize,
    logoImage,
    isVideoMode,
    verses,
    surah,
    timeline
  ]);

  // Audio onended event: triggers only when the entire continuous recitation completes!
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      setIsPlaying(false);
      isPlayingRef.current = false;
      currentTimeRef.current = timeline.totalDuration;
      setCurrentTime(timeline.totalDuration);
      if (isVideoMode) videoRef.current?.pause();
    };

    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('ended', onEnded);
    };
  }, [timeline.totalDuration, isVideoMode]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Aspect ratio helper
  const getContainerAspect = () => {
    switch (config.format) {
      case '9:16':
        return 'aspect-[9/16] max-h-[75vh]';
      case '16:9':
        return 'aspect-[16/9] max-w-3xl w-full';
      case '1:1':
        return 'aspect-square max-h-[65vh]';
      default:
        return 'aspect-[9/16] max-h-[75vh]';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Offscreen media elements driving the canvas rendering */}
      <video
        ref={videoRef}
        src={isVideoMode ? activeMediaSrc : undefined}
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ position: 'fixed', top: -9999, left: -9999, width: 320, height: 180, opacity: 0, pointerEvents: 'none' }}
      />
      <img
        ref={imageRef}
        src={!isVideoMode ? activeMediaSrc : undefined}
        crossOrigin="anonymous"
        alt="background media"
        style={{ position: 'fixed', top: -9999, left: -9999, width: 320, height: 180, opacity: 0, pointerEvents: 'none' }}
      />
      <audio
        ref={audioRef}
        muted={isMuted}
        preload="auto"
        className="hidden"
      />

      {/* Top Notification Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-slate-900/40 to-emerald-950/20 backdrop-blur-xl border border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 shadow-xl shadow-emerald-500/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/90 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white">
                {t.videoReadyHeadline}
              </h3>
              {/* Continuous Playback Verified Badge */}
              <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-semibold border border-emerald-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t.continuousBadge}</span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              {isAr ? surah.name : surah.englishName} ({verses[0]?.numberInSurah} - {verses[verses.length - 1]?.numberInSurah}) • {config.format} •{' '}
              {isVideoMode ? (isAr ? 'خلفية فيديو' : 'Video Background') : (isAr ? `ألبوم صور (${config.customImages?.length || NATURE_IMAGES.length})` : 'Photo Slideshow')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="reconfigure-video-btn"
            onClick={onReconfigure}
            className="px-4 py-3 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm hover:from-slate-700 hover:to-slate-800 text-slate-300 border border-emerald-500/20 text-xs font-semibold transition-all flex items-center gap-2 active:scale-95"
          >
            <Settings2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.reconfigureBtn}</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Player Container */}
      <div
        ref={containerRef}
        className="relative mx-auto rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-emerald-500/20 shadow-2xl flex flex-col items-center justify-center group"
      >
        <div className={`relative ${getContainerAspect()} flex items-center justify-center overflow-hidden`}>
          <canvas
            ref={canvasRef}
            onClick={togglePlay}
            className="w-full h-full object-contain cursor-pointer"
          />

          {/* Background Video & Image Elements for Canvas Drawing */}
          <video
            ref={videoRef}
            src={isVideoMode ? activeMediaSrc : undefined}
            crossOrigin="anonymous"
            loop
            muted
            playsInline
            preload="auto"
            className="hidden"
          />
          <img
            ref={imageRef}
            src={!isVideoMode ? activeMediaSrc : undefined}
            crossOrigin="anonymous"
            alt="Background"
            className="hidden"
          />

          {/* Audio Preparing Overlay */}
          {isPreparingAudio && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isAr ? 'جاري دمج التلاوة المتصلة...' : 'Preparing continuous recitation...'}</span>
            </div>
          )}

          {/* Quick Central Play Overlay when paused */}
          {!isPlaying && !isPreparingAudio && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-amber-400/50 text-amber-400 flex items-center justify-center shadow-2xl transition-all group-hover:scale-110 active:scale-95"
            >
              <Play className="w-8 h-8 fill-amber-400 translate-x-0.5" />
            </button>
          )}
        </div>

        {/* Player Bottom Control Bar */}
        <div className="w-full p-5 bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border-t border-emerald-500/20 flex flex-col gap-4">
          {/* Seek Bar with Verse markers */}
          <div className="relative flex items-center group/seek">
            <input
              type="range"
              min={0}
              max={timeline.totalDuration}
              step={0.05}
              value={currentTime}
              onChange={(e) => handleSeek(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
            />
            {/* Verse transition markers */}
            {timeline.items.map((item, idx) => {
              if (idx === 0) return null;
              const posPercent = (item.start / timeline.totalDuration) * 100;
              return (
                <div
                  key={item.index}
                  style={{ left: `${posPercent}%` }}
                  title={`Ayah ${item.ayah.numberInSurah}`}
                  className="absolute top-1/2 -translate-y-1/2 w-1 h-2 bg-amber-400/50 rounded-full pointer-events-none"
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-neutral-950" /> : <Play className="w-5 h-5 fill-neutral-950 translate-x-0.5" />}
              </button>

              {/* Replay */}
              <button
                onClick={() => handleSeek(0)}
                className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm transition-colors"
                title={t.replay}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Time display */}
              <div className="text-xs text-neutral-400 font-mono tracking-wider">
                <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(timeline.totalDuration)}</span>
              </div>

              {/* Current Ayah Pill */}
              {currentItem && (
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/40 text-emerald-300 text-xs font-semibold">
                  <span>{isAr ? `الآية ${currentItem.ayah.numberInSurah}` : `Ayah ${currentItem.ayah.numberInSurah}`}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mute toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-3 rounded-2xl text-slate-400 hover:text-white hover:bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Centered Render & Download Button under Preview */}
      <div className="pt-2 relative z-10">
        <button
          id="start-render-btn"
          onClick={onStartRender}
          disabled={isRendering}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 hover:brightness-105 active:scale-[0.99] disabled:opacity-50 text-neutral-950 font-extrabold text-base sm:text-lg shadow-xl shadow-emerald-950/80 border border-amber-400/30 flex items-center justify-center gap-3 transition-all cursor-pointer"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-neutral-950" />
              <span>{isAr ? 'جاري الرندرة ومعالجة المشهد...' : 'Rendering and composing video...'}</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5 text-neutral-950 fill-neutral-950 animate-bounce" />
              <span>{isAr ? 'تحميل الفيديو' : 'Download Video'}</span>
            </>
          )}
        </button>
      </div>

      {/* Recitation Verse Track List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-xl border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <span>{isAr ? 'الآيات المختارة' : 'Selected Verses'}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/50 text-[10px] text-emerald-300 font-semibold">
              {verses.length} {isAr ? 'آيات' : 'Ayahs'}
            </span>
          </h4>
        </div>

        <div className="divide-y divide-neutral-800/60">
          {timeline.items.map((item) => {
            const isActive = currentItem?.index === item.index;
            return (
              <div
                key={item.ayah.number}
                onClick={() => handleSeek(item.start)}
                className={`py-3 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/40 shadow-inner backdrop-blur-sm'
                    : 'hover:bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 font-extrabold shadow-sm'
                        : 'bg-gradient-to-br from-slate-800 to-slate-900 backdrop-blur-sm text-slate-400'
                    }`}
                  >
                    {item.ayah.numberInSurah}
                  </div>
                  <div>
                    <p className={`text-sm ${isActive ? 'text-amber-200 font-bold' : 'text-neutral-200'} font-arabic leading-relaxed`}>
                      {item.ayah.text}
                    </p>
                    {config.showTranslation && (
                      <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                        {item.ayah.translation}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[11px] font-mono text-neutral-500">
                    {formatTime(item.start)} - {formatTime(item.end)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
