import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  BookOpen,
  Moon,
  Sun,
  Wifi,
  CheckCircle2,
  Download,
  Play,
  Pause,
  Headphones,
  Sliders,
  Sparkles,
  Layers,
  X,
  Volume2,
  Bookmark,
  Smartphone,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';
import { SURAHS_METADATA, RECITERS_LIST } from '../data/quranData';
import { Reciter } from '../types';

interface QuranImagePageViewProps {
  pageNumber: number;
  onPageChange: (newPage: number, direction: number) => void;
  direction: number;
  theme: string;
  language: 'ar' | 'en';
  surahNameAr?: string;
  juzNumber?: number;
  isStandalone?: boolean;
  onClose?: () => void;
}

// Standard Madani Mushaf Surah Start Pages (604 pages total)
export const SURAH_START_PAGES: Record<number, number> = {
  1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
  11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
  21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
  31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
  41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
  51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
  61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
  71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
  81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
  91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
  101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603, 110: 603,
  111: 603, 112: 604, 113: 604, 114: 604
};

// 30 Ajza' Start Pages
export const JUZ_START_PAGES = [
  1, 22, 42, 62, 82, 102, 121, 142, 162, 182,
  201, 222, 242, 262, 282, 302, 322, 342, 362, 382,
  402, 422, 442, 462, 482, 502, 522, 542, 562, 582
];

// Offline Cache Storage Name
const CACHE_NAME = 'sakinah-quran-pages-v2';

// Traditional Islamic Corner Ornament Component (۞ إطار مزخرف إسلامي)
const CornerOrnamentSVG: React.FC<{ position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }> = ({ position }) => {
  const rotation = {
    'top-left': 'rotate-0',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  }[position];

  const posClass = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-right': 'bottom-0 right-0',
    'bottom-left': 'bottom-0 left-0',
  }[position];

  return (
    <div className={`absolute ${posClass} w-8 h-8 sm:w-14 sm:h-14 pointer-events-none z-20 ${rotation}`}>
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`goldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9D0" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#CA8A04" />
            <stop offset="100%" stopColor="#854D0E" />
          </linearGradient>
          <linearGradient id={`emeraldGrad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
        </defs>
        
        {/* Layer 1: Traditional Outer Arabesque Gate/Arch */}
        <path d="M 0,0 L 120,0 C 85,0 55,20 55,55 C 55,85 20,120 0,120 Z" fill={`url(#goldGrad-${position})`} opacity="0.9" />
        
        {/* Layer 2: Inner Emerald Engraving */}
        <path d="M 0,0 L 105,0 C 72,0 46,18 46,46 C 46,72 18,105 0,105 Z" fill={`url(#emeraldGrad-${position})`} />
        
        {/* Layer 3: Nested Golden Filigree Arcs */}
        <path d="M 0,0 L 90,0 C 60,0 38,15 38,38 C 15,38 0,60 0,90 Z" stroke={`url(#goldGrad-${position})`} strokeWidth="1.5" />
        <path d="M 0,0 L 75,0 C 50,0 30,12 30,30 C 12,30 0,50 0,75 Z" stroke={`url(#goldGrad-${position})`} strokeWidth="1" strokeDasharray="2,2" />

        {/* Hand-drawn Arabesque Swirls (سنابل وزخارف نباتية مرسومة) */}
        <path d="M 15,80 C 15,50 35,35 65,35 C 50,20 30,15 10,25" stroke={`url(#goldGrad-${position})`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        <path d="M 80,15 C 50,15 35,35 35,65 C 20,50 15,30 25,10" stroke={`url(#goldGrad-${position})`} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        
        {/* Small teardrop leaves inside */}
        <path d="M 45,45 C 50,40 55,45 50,50 C 45,55 40,50 45,45 Z" fill={`url(#goldGrad-${position})`} />
        <path d="M 28,28 C 32,24 36,28 32,32 C 28,36 24,32 28,28 Z" fill={`url(#goldGrad-${position})`} />
        <path d="M 60,20 C 65,18 68,22 65,25 C 62,28 58,25 60,20 Z" fill={`url(#goldGrad-${position})`} />
        <path d="M 20,60 C 18,65 22,68 25,65 C 28,62 25,58 20,60 Z" fill={`url(#goldGrad-${position})`} />

        {/* Layer 4: Exquisite 8-Pointed Star (ثمن النجمة الإسلامية المباركة) */}
        <g transform="translate(32, 32)">
          {/* Outer Star */}
          <path d="M 0,-15 L 4,-4 L 15,0 L 4,4 L 0,15 L -4,4 L -15,0 L -4,-4 Z" fill={`url(#goldGrad-${position})`} />
          {/* Rotated Star for 8 points */}
          <path d="M 0,-15 L 4,-4 L 15,0 L 4,4 L 0,15 L -4,4 L -15,0 L -4,-4 Z" fill={`url(#goldGrad-${position})`} transform="rotate(45)" />
          {/* Inner core */}
          <circle cx="0" cy="0" r="5" fill="#92400E" />
          <circle cx="0" cy="0" r="3" fill="#FFF9D0" />
        </g>
        
        {/* Solid Gilded Corner Borders */}
        <line x1="0" y1="0" x2="120" y2="0" stroke={`url(#goldGrad-${position})`} strokeWidth="3" />
        <line x1="0" y1="0" x2="0" y2="120" stroke={`url(#goldGrad-${position})`} strokeWidth="3" />
        <circle cx="0" cy="0" r="8" fill={`url(#goldGrad-${position})`} />
        <circle cx="0" cy="0" r="4" fill="#064E3B" />
      </svg>
    </div>
  );
};

export const QuranImagePageView: React.FC<QuranImagePageViewProps> = ({
  pageNumber,
  onPageChange,
  direction,
  theme,
  language,
  surahNameAr: initialSurahName,
  juzNumber: initialJuz,
  isStandalone = false,
  onClose
}) => {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [resolution, setResolution] = useState<1200 | 1920 | 1024>(1200);
  const [isNightFilter, setIsNightFilter] = useState<boolean>(theme === 'dark');
  const [pageBgMode, setPageBgMode] = useState<'default' | 'warm-yellow' | 'dark'>(() => {
    const saved = localStorage.getItem('sakinah_mushaf_bg_mode');
    if (saved === 'default' || saved === 'warm-yellow' || saved === 'dark') {
      return saved as 'default' | 'warm-yellow' | 'dark';
    }
    return theme === 'dark' ? 'dark' : 'default';
  });

  const handleSetPageBgMode = (mode: 'default' | 'warm-yellow' | 'dark') => {
    setPageBgMode(mode);
    setIsNightFilter(mode === 'dark');
    localStorage.setItem('sakinah_mushaf_bg_mode', mode);
  };

  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    const saved = localStorage.getItem('sakinah_mushaf_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = () => {
    soundEngine.playClick();
    triggerHaptic(15);
    let updated: number[];
    if (bookmarks.includes(pageNumber)) {
      updated = bookmarks.filter((p) => p !== pageNumber);
    } else {
      updated = [...bookmarks, pageNumber].sort((a, b) => a - b);
    }
    setBookmarks(updated);
    localStorage.setItem('sakinah_mushaf_bookmarks', JSON.stringify(updated));
  };

  // Keep pageNumber in localStorage to automatically resume reading position
  useEffect(() => {
    localStorage.setItem('sakinah_last_quran_page', pageNumber.toString());
  }, [pageNumber]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(isStandalone);
  
  // Fill width mode (eliminates side black bars & fills screen width)
  const [isFillWidth, setIsFillWidth] = useState<boolean>(true);
  const [showFrameDecorations, setShowFrameDecorations] = useState<boolean>(true);

  // Dedicated Settings Modal Drawer
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Controls Visibility (Tap to toggle)
  const [showControls, setShowControls] = useState<boolean>(true);

  // Offline caching state
  const [isCachedOffline, setIsCachedOffline] = useState<boolean>(false);
  const [cacheProgress, setCacheProgress] = useState<number | null>(null);
  const [isCachingRange, setIsCachingRange] = useState<boolean>(false);
  const [isCachingEntire, setIsCachingEntire] = useState<boolean>(false);
  const [entireCacheProgress, setEntireCacheProgress] = useState<number | null>(null);
  const [entireCacheCurrentPage, setEntireCacheCurrentPage] = useState<number | null>(null);

  // Audio Reciter Player state
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const totalPages = 604;
  const hasPrev = pageNumber > 1;
  const hasNext = pageNumber < totalPages;

  // Derive current Surah and Juz from page number
  const getCurrentSurahAndJuz = (page: number) => {
    let surahNum = 1;
    for (let s = 114; s >= 1; s--) {
      if (SURAH_START_PAGES[s] <= page) {
        surahNum = s;
        break;
      }
    }
    let juzNum = 1;
    for (let j = 30; j >= 1; j--) {
      if (JUZ_START_PAGES[j - 1] <= page) {
        juzNum = j;
        break;
      }
    }
    const surahMeta = SURAHS_METADATA.find((s) => s.number === surahNum);
    return {
      surahNum,
      surahName: surahMeta ? surahMeta.nameAr : '',
      juzNum
    };
  };

  const { surahNum, surahName, juzNum } = getCurrentSurahAndJuz(pageNumber);

  const getSourcesForPage = (page: number, res: number) => {
    const p3 = String(page).padStart(3, '0');
    return [
      { name: 'المصحف المحلي', url: `/quran-images/page${p3}.png` },
      { name: 'IslamDB CDN', url: `https://quran.islam-db.com/public/data/pages/quranpages_1024/images/page${p3}.png` },
      { name: 'Quran.com CDN', url: `https://cdn.quran.com/images/pages/${res}/${page}.png` },
      { name: 'QuranHub CDN', url: `https://raw.githubusercontent.com/QuranHub/quran-pages-images/main/Hafs/page${p3}.png` },
      { name: 'GovarJabbar CDN', url: `https://raw.githubusercontent.com/GovarJabbar/Quran-PNG/main/images/page${p3}.png` }
    ];
  };

  const [serverIndex, setServerIndex] = useState<number>(0);
  const sources = getSourcesForPage(pageNumber, resolution);
  const [currentImgSrc, setCurrentImgSrc] = useState<string>(
    `/quran-images/page${String(pageNumber).padStart(3, '0')}.png`
  );

  // Audio setup when surah or reciter changes
  useEffect(() => {
    const formattedNum = String(surahNum).padStart(3, '0');
    const audioUrl = `${selectedReciter.serverUrl}/${formattedNum}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (isPlayingAudio) {
        audioRef.current.play().catch(() => setIsPlayingAudio(false));
      }
    }
  }, [surahNum, selectedReciter]);

  const handleToggleAudioPlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!audioRef.current) return;
    soundEngine.playClick();
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play().then(() => setIsPlayingAudio(true)).catch(() => {
        setIsPlayingAudio(false);
      });
    }
  };

  const loadPageWithCache = async (page: number, res: number, serverIdx: number) => {
    setIsLoading(true);
    setHasError(false);
    setIsCachedOffline(false);

    const pageSources = getSourcesForPage(page, res);
    const targetUrl = pageSources[serverIdx]?.url || pageSources[0].url;

    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(targetUrl);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const localUrl = URL.createObjectURL(blob);
          setCurrentImgSrc(localUrl);
          setIsCachedOffline(true);
          setIsLoading(false);
          preloadAdjacentPagesToCache(page, res, serverIdx);
          return;
        }
      } catch (err) {
        console.warn('Cache match error:', err);
      }
    }

    setCurrentImgSrc(targetUrl);

    if ('caches' in window) {
      fetch(targetUrl, { mode: 'cors' })
        .then((res) => {
          if (res.ok) {
            caches.open(CACHE_NAME).then((cache) => cache.put(targetUrl, res));
            setIsCachedOffline(true);
          }
        })
        .catch(() => {});
    }

    preloadAdjacentPagesToCache(page, res, serverIdx);
  };

  const preloadAdjacentPagesToCache = async (currentPage: number, res: number, serverIdx: number) => {
    const pagesToCache = [currentPage + 1, currentPage + 2, currentPage - 1].filter(p => p >= 1 && p <= 604);
    if ('caches' in window) {
      try {
        const cache = await caches.open(CACHE_NAME);
        for (const p of pagesToCache) {
          const url = getSourcesForPage(p, res)[serverIdx]?.url;
          if (url) {
            const match = await cache.match(url);
            if (!match) {
              fetch(url, { mode: 'cors' }).then((r) => {
                if (r.ok) cache.put(url, r);
              }).catch(() => {});
            }
          }
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadPageWithCache(pageNumber, resolution, serverIndex);
  }, [pageNumber, resolution, serverIndex]);

  const handleImageError = () => {
    const nextIdx = serverIndex + 1;
    if (nextIdx < sources.length) {
      setServerIndex(nextIdx);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const cacheNext20Pages = async () => {
    if (!('caches' in window)) return;
    setIsCachingRange(true);
    soundEngine.playClick();
    triggerHaptic(20);

    const start = pageNumber;
    const end = Math.min(604, pageNumber + 19);
    const total = end - start + 1;
    let completed = 0;

    const cache = await caches.open(CACHE_NAME);

    for (let p = start; p <= end; p++) {
      const url = getSourcesForPage(p, resolution)[serverIndex]?.url;
      if (url) {
        try {
          const match = await cache.match(url);
          if (!match) {
            const res = await fetch(url, { mode: 'cors' });
            if (res.ok) await cache.put(url, res);
          }
        } catch (e) {}
      }
      completed++;
      setCacheProgress(Math.round((completed / total) * 100));
    }

    setIsCachingRange(false);
    setCacheProgress(null);
    setIsCachedOffline(true);
    soundEngine.playCompletion();
    triggerHaptic(30);
  };

  const cacheEntireMushaf = async () => {
    if (!('caches' in window)) return;
    setIsCachingEntire(true);
    soundEngine.playClick();
    triggerHaptic(25);

    const start = 1;
    const end = 604;
    const total = 604;
    let completed = 0;

    const cache = await caches.open(CACHE_NAME);

    for (let p = start; p <= end; p++) {
      // Allow user to cancel caching midway
      if (localStorage.getItem('sakinah_cancel_caching') === 'true') {
        localStorage.removeItem('sakinah_cancel_caching');
        break;
      }

      setEntireCacheCurrentPage(p);
      const url = getSourcesForPage(p, resolution)[serverIndex]?.url;
      if (url) {
        try {
          const match = await cache.match(url);
          if (!match) {
            const res = await fetch(url, { mode: 'cors' });
            if (res.ok) await cache.put(url, res);
          }
        } catch (e) {
          console.warn(`Failed to cache page ${p}:`, e);
        }
      }
      completed++;
      setEntireCacheProgress(Math.round((completed / total) * 100));
      // Small pause to keep browser fluid and responsive
      await new Promise((resolve) => setTimeout(resolve, 30));
    }

    setIsCachingEntire(false);
    setEntireCacheProgress(null);
    setEntireCacheCurrentPage(null);
    setIsCachedOffline(true);
    soundEngine.playCompletion();
    triggerHaptic(40);
  };

  const cancelCachingEntire = () => {
    localStorage.setItem('sakinah_cancel_caching', 'true');
    setIsCachingEntire(false);
    setEntireCacheProgress(null);
    setEntireCacheCurrentPage(null);
    soundEngine.playClick();
    triggerHaptic(15);
  };

  const handlePrevPage = () => {
    if (hasPrev) {
      soundEngine.playClick();
      triggerHaptic(12);
      onPageChange(pageNumber - 1, -1);
    }
  };

  const handleNextPage = () => {
    if (hasNext) {
      soundEngine.playClick();
      triggerHaptic(12);
      onPageChange(pageNumber + 1, 1);
    }
  };

  const handleSelectSurah = (sNum: number) => {
    soundEngine.playClick();
    const targetPage = SURAH_START_PAGES[sNum] || 1;
    onPageChange(targetPage, targetPage > pageNumber ? 1 : -1);
    setIsSettingsOpen(false);
  };

  const handleSelectJuz = (jNum: number) => {
    soundEngine.playClick();
    const targetPage = JUZ_START_PAGES[jNum - 1] || 1;
    onPageChange(targetPage, targetPage > pageNumber ? 1 : -1);
    setIsSettingsOpen(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > 50 && hasNext) {
      handleNextPage();
    } else if (distance < -50 && hasPrev) {
      handlePrevPage();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const handlePageTap = () => {
    soundEngine.playClick();
    setShowControls(!showControls);
  };

  const toggleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playClick();
    const nextFullscreen = !isFullscreen;
    setIsFullscreen(nextFullscreen);
    setShowControls(true);
  };

  const pageVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', damping: 28, stiffness: 300 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
        opacity: { duration: 0.12 }
      }
    })
  };

  return (
    <div
      className={`relative select-none overflow-hidden transition-all duration-300 w-full ${
        isFullscreen
          ? 'fixed inset-0 z-[100] bg-slate-950 p-0 m-0 w-screen h-screen'
          : 'rounded-3xl border border-slate-800 bg-slate-950 p-0 max-w-full'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hidden Audio Ref */}
      <audio
        ref={audioRef}
        onEnded={() => setIsPlayingAudio(false)}
      />

      {/* ULTRA-CLEAN UNCLUTTERED TOP FLOATING TOOLBAR */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="absolute top-2 left-2 right-2 z-30 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl border backdrop-blur-xl shadow-xl flex items-center justify-between gap-1.5 transition-all duration-300 bg-slate-950/45 border-slate-800/30 text-slate-100"
          >
            {/* Left: Page Badge & Surah Info */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isStandalone && onClose && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundEngine.playClick();
                    onClose();
                  }}
                  className="pl-2 pr-2.5 py-1 rounded-lg bg-red-500/20 hover:bg-red-500/35 text-red-300 border border-red-500/30 flex items-center gap-1 text-[11px] font-bold font-cairo transition-all cursor-pointer select-none ml-0.5 shadow-sm shrink-0"
                >
                  <X className="w-3 h-3" />
                  <span className="hidden xs:inline">إغلاق</span>
                </button>
              )}
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold font-mono text-xs shadow-inner shrink-0">
                {pageNumber}
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="text-[11px] sm:text-xs font-extrabold font-cairo text-amber-400 whitespace-nowrap">
                  سورة {surahName || initialSurahName}
                </span>
                <span className="text-slate-600 text-[10px] sm:text-xs">•</span>
                <span className="text-[10px] sm:text-[11px] font-bold font-cairo text-emerald-400 whitespace-nowrap">
                  ج {juzNum || initialJuz}
                </span>
              </div>
            </div>

            {/* Right: Controls & Display Modes */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {/* Fill Width Toggle Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick();
                  setIsFillWidth(!isFillWidth);
                }}
                title={isFillWidth ? 'إلغاء تعبئة العرض' : 'تعبئة العرض'}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-[11px] font-bold font-cairo flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ${
                  isFillWidth
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700/60'
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isFillWidth ? 'تعبئة' : 'احتواء'}</span>
              </button>

              {/* Quick Audio Pill */}
              <button
                onClick={handleToggleAudioPlay}
                title={isPlayingAudio ? 'إيقاف التلاوة' : 'تشغيل التلاوة'}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-[11px] font-bold font-cairo flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-emerald-300'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">إيقاف</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span className="hidden sm:inline">تلاوة</span>
                  </>
                )}
              </button>

              {/* Fullscreen Mode Button */}
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? 'خروج من ملء الشاشة' : 'ملء الشاشة'}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-[11px] font-bold font-cairo flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ${
                  isFullscreen
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">ملء الشاشة</span>
              </button>

              {/* Bookmark Current Page Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleBookmark();
                }}
                title={bookmarks.includes(pageNumber) ? 'إزالة العلامة المرجعية' : 'حفظ الصفحة الحالية'}
                className={`p-1.5 sm:px-2 sm:py-1 rounded-lg border text-[11px] font-bold font-cairo flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shrink-0 ${
                  bookmarks.includes(pageNumber)
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-amber-500/20 shadow-md'
                    : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(pageNumber) ? 'fill-current' : ''}`} />
                <span className="hidden sm:inline">
                  {bookmarks.includes(pageNumber) ? 'محفوظة ✓' : 'حفظ الصفحة'}
                </span>
              </button>

              {/* Dedicated Settings Modal Trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playClick();
                  setIsSettingsOpen(true);
                }}
                title="إعدادات المصحف"
                className="p-1.5 sm:px-2 sm:py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all cursor-pointer flex items-center justify-center gap-1 text-[11px] font-bold font-cairo shadow-sm shrink-0"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">الإعدادات</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PURE QURAN PAGE DISPLAY CANVAS (DISTRACTION-FREE WITH GILDED ISLAMIC FRAME) */}
      <div
        onClick={handlePageTap}
        className={`relative overflow-hidden flex items-center justify-center p-0 cursor-pointer transition-all mx-auto ${
          isFullscreen
            ? `w-screen h-screen ${
                pageBgMode === 'warm-yellow'
                  ? 'bg-[#fcf7e6]'
                  : 'bg-slate-950'
              }`
            : `rounded-3xl border shadow-2xl min-h-[640px] sm:min-h-[880px] w-full max-w-xl md:max-w-2xl lg:max-w-[65vh] ${
                pageBgMode === 'warm-yellow'
                  ? 'border-amber-700/20 bg-[#fcf7e6]'
                  : 'border-amber-500/10 bg-slate-950'
              }`
        }`}
      >
        {/* Side Click Zones for Quick Page Turning in Fullscreen / Hidden Controls */}
        {!showControls && (
          <>
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPage();
              }}
              title="الصفحة السابقة"
              className="absolute right-0 top-0 bottom-0 w-[15%] z-30 opacity-0 hover:opacity-20 bg-gradient-to-l from-emerald-500/30 to-transparent transition-all cursor-pointer flex items-center justify-end pr-2 text-emerald-300 font-bold"
            >
              <ChevronRight className="w-8 h-8" />
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                handleNextPage();
              }}
              title="الصفحة التالية"
              className="absolute left-0 top-0 bottom-0 w-[15%] z-30 opacity-0 hover:opacity-20 bg-gradient-to-r from-emerald-500/30 to-transparent transition-all cursor-pointer flex items-center justify-start pl-2 text-emerald-300 font-bold"
            >
              <ChevronLeft className="w-8 h-8" />
            </div>
          </>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-sm rounded-3xl">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin mb-2" />
            <p className="text-xs font-bold text-slate-200 font-cairo">
              جاري تحميل الصفحة {pageNumber}...
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="text-center py-16 px-6 z-20">
            <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-60" />
            <h3 className="text-base font-bold font-cairo text-slate-100 mb-1">
              تعذر تحميل الصورة
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHasError(false);
                setIsLoading(true);
                setServerIndex(0);
                loadPageWithCache(pageNumber, resolution, 0);
              }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold font-cairo text-xs shadow-md hover:bg-emerald-400 transition-all cursor-pointer"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Pure Quran Page Image with Ornate Islamic Gilded Frame */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={pageNumber}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ transform: `scale(${zoomScale})` }}
            className="transition-transform duration-200 ease-out flex items-center justify-center w-full h-full max-w-full"
          >
            {/* GILDED ISLAMIC ILLUMINATED FRAME (إطار المصحف الشريف المزخرف) */}
            <div
              className={`relative w-full h-full flex flex-col items-center justify-between transition-all my-auto overflow-hidden ${
                !showFrameDecorations
                  ? `p-0 border-0 shadow-none ${pageBgMode === 'warm-yellow' ? 'bg-[#faf3dc]' : 'bg-slate-950'}`
                  : isFullscreen
                  ? `p-0.5 sm:p-1.5 rounded-none border-0 shadow-none ${pageBgMode === 'warm-yellow' ? 'bg-[#faf3dc]' : 'bg-slate-950'}`
                  : `p-1 sm:p-2.5 rounded-xl sm:rounded-2xl border-2 sm:border-4 shadow-[0_0_35px_rgba(217,119,6,0.25)] ${
                      pageBgMode === 'warm-yellow'
                        ? 'border-amber-700 bg-gradient-to-b from-[#fbf8ee] via-[#faf3dc] to-[#f3e9ca]'
                        : pageBgMode === 'dark'
                        ? 'border-slate-800 bg-[#0d1422]'
                        : 'border-amber-600/80 bg-gradient-to-b from-[#fefcf8] via-[#fbf7ed] to-[#f4ecd8] dark:from-[#0d1522] dark:via-[#090f19] dark:to-[#04070c]'
                    }`
              }`}
            >
              {showFrameDecorations && (
                <>
                  {/* Concentric Islamic Filigree Borders for Exquisite Craft Feel */}
                  <div className="absolute inset-0.5 sm:inset-1 rounded-lg border border-dashed border-amber-600/35 pointer-events-none z-10" />
                  <div className="absolute inset-1 sm:inset-1.5 rounded-lg border border-emerald-600/50 pointer-events-none ring-1 ring-amber-400/60 z-10" />
                  <div className="absolute inset-2 sm:inset-3 rounded-md border border-amber-500/20 pointer-events-none z-10" />

                  <CornerOrnamentSVG position="top-left" />
                  <CornerOrnamentSVG position="top-right" />
                  <CornerOrnamentSVG position="bottom-left" />
                  <CornerOrnamentSVG position="bottom-right" />

                  {/* Top Surah & Juz Cartouche */}
                  <div className="z-10 mt-0.5 mb-0.5 pointer-events-none">
                    <div className={`px-3 py-0.5 rounded-full border shadow-md flex items-center gap-1.5 ${
                      pageBgMode === 'warm-yellow'
                        ? 'bg-gradient-to-r from-amber-900 via-amber-950 to-amber-900 border-amber-400/70'
                        : 'bg-gradient-to-r from-amber-950/90 via-emerald-950/90 to-amber-950/90 border-amber-400/70'
                    }`}>
                      <span className="text-amber-400 text-[10px]">۞</span>
                      <span className="font-extrabold font-cairo text-[10px] sm:text-xs text-amber-100 tracking-wide">
                        سورة {surahName || initialSurahName} • الجزء {juzNum || initialJuz}
                      </span>
                      <span className="text-amber-400 text-[10px]">۞</span>
                    </div>
                  </div>
                </>
              )}

              {/* Page Image Canvas */}
              <div className="relative z-10 flex-1 flex items-center justify-center w-full h-full overflow-hidden my-auto">
                {currentImgSrc ? (
                  <img
                    src={currentImgSrc}
                    alt={`المصحف الشريف صفحة ${pageNumber}`}
                    onLoad={() => setIsLoading(false)}
                    onError={handleImageError}
                    referrerPolicy="no-referrer"
                    className={`transition-all duration-200 ${
                      isFillWidth
                        ? 'w-full h-full max-h-none sm:max-h-full object-contain my-auto'
                        : 'w-full h-auto max-h-[88vh] sm:max-h-[94vh] object-contain my-auto'
                    } ${
                      pageBgMode === 'dark' ? 'filter invert brightness-90 contrast-125 hue-rotate-180' : ''
                    } ${
                      pageBgMode === 'warm-yellow' ? 'mix-blend-multiply opacity-[0.98]' : ''
                    }`}
                  />
                ) : null}
              </div>

              {showFrameDecorations && (
                <div className="z-10 mb-0.5 mt-0.5 pointer-events-none">
                  <div className={`px-3 py-0.5 rounded-full bg-gradient-to-r border font-mono font-bold text-[10px] flex items-center gap-1 shadow-sm ${
                    pageBgMode === 'warm-yellow'
                      ? 'from-amber-900 via-amber-950 to-amber-900 border-amber-500/50 text-amber-100'
                      : 'from-amber-950/90 via-slate-950/90 to-amber-950/90 border-amber-500/60 text-amber-300'
                  }`}>
                    <span className="text-amber-500 font-serif">﴿</span>
                    <span>{pageNumber}</span>
                    <span className="text-amber-500 font-serif">﴾</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* STREAMLINED BOTTOM NAVIGATION SLIDER BAR */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-2 left-2 right-2 z-30 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border shadow-xl flex items-center justify-between gap-2 transition-all duration-300 bg-slate-950/45 border-slate-800/30 text-slate-100 backdrop-blur-xl"
          >
            {/* Prev Page Button (Circular Icon Only to Save Space) */}
            <button
              onClick={handlePrevPage}
              disabled={!hasPrev}
              title="الصفحة السابقة"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                hasPrev
                  ? 'bg-slate-800/90 hover:bg-slate-700 border-slate-700/60 text-slate-200 hover:text-emerald-300 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronRight className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </button>

            {/* Range Slider & Counter inside single row */}
            <div className="flex-1 flex items-center gap-2 px-1">
              <span className="text-amber-400 font-bold font-cairo text-[10px] sm:text-xs whitespace-nowrap bg-slate-950/30 px-2 py-1 rounded-md border border-amber-500/10 shadow-inner">
                صفحة {pageNumber}
              </span>
              <input
                type="range"
                min={1}
                max={604}
                value={pageNumber}
                onChange={(e) => {
                  const p = parseInt(e.target.value, 10);
                  onPageChange(p, p > pageNumber ? 1 : -1);
                }}
                className="flex-1 accent-emerald-500 cursor-pointer h-1 bg-slate-800 rounded-lg"
              />
            </div>

            {/* Next Page Button (Circular Icon Only to Save Space) */}
            <button
              onClick={handleNextPage}
              disabled={!hasNext}
              title="الصفحة التالية"
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                hasNext
                  ? 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500/40 text-emerald-300 shadow-sm'
                  : 'bg-slate-900/40 border-slate-800/40 text-slate-600 opacity-40 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className={`w-5 h-5 ${language === 'en' ? 'rotate-180' : ''}`} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DEDICATED ELEGANT QURAN SETTINGS MODAL / DRAWER */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold font-cairo text-slate-100">
                    إعدادات وتسهيلات المصحف
                  </h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 cursor-pointer transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Section 1: Quick Index Jump */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold font-cairo text-amber-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>الانتقال السريع للفهرس</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-400 font-cairo block mb-1">اختر السورة:</label>
                    <select
                      value={surahNum}
                      onChange={(e) => handleSelectSurah(Number(e.target.value))}
                      className="w-full p-2 rounded-xl text-xs font-bold font-cairo bg-slate-800 border border-slate-700 text-emerald-300 outline-none cursor-pointer"
                    >
                      {SURAHS_METADATA.map((s) => (
                        <option key={s.number} value={s.number}>
                          {s.number}. سورة {s.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 font-cairo block mb-1">اختر الجزء:</label>
                    <select
                      value={juzNum}
                      onChange={(e) => handleSelectJuz(Number(e.target.value))}
                      className="w-full p-2 rounded-xl text-xs font-bold font-cairo bg-slate-800 border border-slate-700 text-amber-300 outline-none cursor-pointer"
                    >
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((j) => (
                        <option key={j} value={j}>
                          الجزء {j}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 1.5: Saved Bookmarks */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold font-cairo text-amber-400 flex items-center gap-1.5 justify-between">
                  <span className="flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 fill-amber-400/20 text-amber-400" />
                    <span>العلامات المرجعية والصفحات المحفوظة</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono bg-slate-800/80 px-1.5 py-0.5 rounded-md">({bookmarks.length})</span>
                </h4>
                {bookmarks.length === 0 ? (
                  <p className="text-[11px] text-slate-500 text-center font-cairo py-1.5">
                    لا توجد صفحات محفوظة حالياً. اضغط على زر "حفظ الصفحة" في الأعلى لحفظ أي صفحة.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
                    {bookmarks.map((p) => {
                      let matchedSurahName = '';
                      for (let sNum = 114; sNum >= 1; sNum--) {
                        if (p >= SURAH_START_PAGES[sNum]) {
                          matchedSurahName = SURAHS_METADATA[sNum - 1]?.nameAr || '';
                          break;
                        }
                      }
                      if (!matchedSurahName) matchedSurahName = SURAHS_METADATA[0].nameAr;

                      return (
                        <div
                          key={p}
                          onClick={() => {
                            soundEngine.playClick();
                            triggerHaptic(10);
                            onPageChange(p, p > pageNumber ? 1 : -1);
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-cairo flex items-center gap-1 border cursor-pointer transition-all ${
                            pageNumber === p
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700/60 text-slate-300'
                          }`}
                        >
                          <span>📖 ص {p}</span>
                          <span className="opacity-75">({matchedSurahName})</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section 2: Audio Reciter Selection */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold font-cairo text-emerald-400 flex items-center gap-1.5">
                  <Headphones className="w-4 h-4" />
                  <span>قارئ التلاوة الصوتية للسورة</span>
                </h4>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedReciter.id}
                    onChange={(e) => {
                      const r = RECITERS_LIST.find((item) => item.id === e.target.value);
                      if (r) setSelectedReciter(r);
                    }}
                    className="flex-1 p-2 rounded-xl text-xs font-cairo bg-slate-800 border border-slate-700 text-slate-200 outline-none cursor-pointer"
                  >
                    {RECITERS_LIST.map((rec) => (
                      <option key={rec.id} value={rec.id}>
                        {rec.nameAr}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={handleToggleAudioPlay}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold font-cairo flex items-center gap-1 cursor-pointer transition-all ${
                      isPlayingAudio
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-emerald-500 text-slate-950 border-emerald-400'
                    }`}
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    <span>{isPlayingAudio ? 'إيقاف' : 'تشغيل'}</span>
                  </button>
                </div>
              </div>

              {/* Section 3: Display Quality, Night Mode, Zoom & Fit Mode */}
              <div className="space-y-3 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold font-cairo text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>طريقة عرض الآيات وملء الشاشة والإطارات</span>
                </h4>

                {/* Display Width Mode & Frame Toggles */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 font-cairo block mb-1">تعبئة العرض بدون فراغات:</span>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setIsFillWidth(!isFillWidth);
                      }}
                      className={`w-full py-1.5 px-2 rounded-xl border text-xs font-cairo font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        isFillWidth
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{isFillWidth ? 'ملء الشاشة والعرض' : 'احتواء عادي'}</span>
                    </button>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 font-cairo block mb-1">الإطار المزخرف:</span>
                    <button
                      onClick={() => {
                        soundEngine.playClick();
                        setShowFrameDecorations(!showFrameDecorations);
                      }}
                      className={`w-full py-1.5 px-2 rounded-xl border text-xs font-cairo font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                        showFrameDecorations
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 border-slate-700 text-slate-400'
                      }`}
                    >
                      <span>{showFrameDecorations ? 'إطار مذهب ۞' : 'بدون إطار (آيات فقط)'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Resolution */}
                  <div>
                    <span className="text-[11px] text-slate-400 font-cairo block mb-1">دقة الصورة:</span>
                    <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                      {([1024, 1200, 1920] as const).map((res) => (
                        <button
                          key={res}
                          onClick={() => {
                            soundEngine.playClick();
                            setResolution(res);
                          }}
                          className={`flex-1 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            resolution === res ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {res === 1920 ? '4K' : res === 1200 ? 'HD' : 'SD'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comfortable Page Background Selector */}
                  <div>
                    <span className="text-[11px] text-slate-400 font-cairo block mb-1">خلفية مريحة للعين:</span>
                    <div className="flex gap-1 bg-slate-800 p-1 rounded-xl">
                      {[
                        { id: 'default', label: '⚪ عادي', activeClass: 'bg-slate-700 text-slate-100 font-bold' },
                        { id: 'warm-yellow', label: '🟡 صفراء', activeClass: 'bg-amber-500 text-slate-950 font-extrabold' },
                        { id: 'dark', label: '⚫ داكنة', activeClass: 'bg-emerald-500 text-slate-950 font-extrabold' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            soundEngine.playClick();
                            handleSetPageBgMode(item.id as any);
                          }}
                          className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-cairo font-bold transition-all cursor-pointer text-center ${
                            pageBgMode === item.id ? item.activeClass : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Zoom Scale */}
                <div>
                  <span className="text-[11px] text-slate-400 font-cairo block mb-1">نسبة تكبير الصفحة ({Math.round(zoomScale * 100)}%):</span>
                  <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl">
                    <button
                      onClick={() => setZoomScale((z) => Math.max(0.8, z - 0.15))}
                      className="p-1 text-slate-300 hover:text-emerald-300 rounded-lg cursor-pointer"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center text-xs font-mono font-bold text-emerald-400">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomScale((z) => Math.min(2.5, z + 0.15))}
                      className="p-1 text-slate-300 hover:text-emerald-300 rounded-lg cursor-pointer"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    {zoomScale !== 1 && (
                      <button
                        onClick={() => setZoomScale(1)}
                        className="px-2 py-0.5 text-[10px] text-amber-400 hover:bg-slate-700 rounded-lg cursor-pointer font-cairo"
                      >
                        إعادة ضغط
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 4: Offline Download Range */}
              <div className="space-y-3.5 p-3.5 bg-slate-950/60 rounded-2xl border border-slate-800">
                <h4 className="text-xs font-bold font-cairo text-emerald-400 flex items-center gap-1.5">
                  <Download className="w-4 h-4" />
                  <span>تحميل المصحف الشريف للأوفلاين (بدون إنترنت)</span>
                </h4>
                
                <p className="text-[11px] text-slate-400 font-cairo leading-relaxed">
                  يمكنك حفظ صفحات المصحف بالكامل في ذاكرة متصفحك الآمنة لتعمل معك بدون حاجة للاتصال بالإنترنت نهائياً.
                </p>

                <div className="grid grid-cols-1 gap-2">
                  {/* Button 1: Cache Next 20 Pages */}
                  <button
                    onClick={cacheNext20Pages}
                    disabled={isCachingRange || isCachingEntire}
                    className={`w-full py-2.5 px-3 rounded-xl border text-xs font-cairo font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCachingRange
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
                        : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-300 disabled:opacity-40'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isCachingRange ? `جاري حفظ 20 صفحة (${cacheProgress}%)` : 'حفظ 20 صفحة قادمة للأوفلاين'}
                    </span>
                  </button>

                  {/* Button 2: Cache Entire 604 Pages */}
                  {!isCachingEntire ? (
                    <button
                      onClick={cacheEntireMushaf}
                      disabled={isCachingRange || isCachingEntire}
                      className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-cairo font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-40"
                    >
                      <BookOpen className="w-4 h-4 fill-slate-950 text-slate-950" />
                      <span>تحميل وحفظ المصحف كاملاً (٦٠٤ صفحة)</span>
                    </button>
                  ) : (
                    <div className="space-y-2 p-2 bg-slate-900 rounded-xl border border-teal-500/30">
                      <div className="flex items-center justify-between text-xs font-cairo font-bold">
                        <span className="text-teal-400 animate-pulse">جاري تحميل المصحف كاملاً...</span>
                        <span className="text-amber-400">{entireCacheProgress}%</span>
                      </div>
                      
                      {/* Caching Progress Bar */}
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${entireCacheProgress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-cairo">
                        <span>جاري حفظ صفحة {entireCacheCurrentPage} من 604</span>
                        <button
                          onClick={cancelCachingEntire}
                          className="text-red-400 hover:text-red-300 font-bold underline cursor-pointer"
                        >
                          إلغاء التحميل
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-cairo text-xs shadow-lg transition-all cursor-pointer"
              >
                إغلاق وحفظ الإعدادات
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
