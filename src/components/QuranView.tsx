import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { SURAHS_METADATA, SurahMeta, RECITERS_LIST, fetchFullSurah } from '../data/quranData';
import { QuranSurah, QuranVerse, Reciter } from '../types';
import { QuranPageView } from './QuranPageView';
import { QuranImagePageView, SURAH_START_PAGES } from './QuranImagePageView';
import { QuranReciterModal } from './QuranReciterModal';
import { AyahEndMarker } from './AyahEndMarker';
import { MushafSurahHeader } from './MushafSurahHeader';
import {
  Search,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bookmark,
  Share2,
  Copy,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  Type,
  Music,
  Headphones,
  Sliders,
  Layers,
  FileText,
  AlignJustify,
  ListFilter,
  X,
  BookMarked,
  Info,
  Maximize2,
  Minimize2,
  Eye,
  Star,
  Grid,
  List,
  Compass
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

// 30 Ajza' Overview for direct navigation
const QURAN_AJZA = [
  { juz: 1, nameAr: 'الجزء الأول', startSurah: 1, startAyah: 1, startPage: 1, labelAr: 'الم (الفاتحة - البقرة ١٤١)' },
  { juz: 2, nameAr: 'الجزء الثاني', startSurah: 2, startAyah: 142, startPage: 22, labelAr: 'سَيَقُولُ السُّفَهَاءُ (البقرة ١٤٢ - ٢٥٢)' },
  { juz: 3, nameAr: 'الجزء الثالث', startSurah: 2, startAyah: 253, startPage: 42, labelAr: 'تِلْكَ الرُّسُلُ (البقرة ٢٥٣ - آل عمران ٩٢)' },
  { juz: 4, nameAr: 'الجزء الرابع', startSurah: 3, startAyah: 93, startPage: 62, labelAr: 'لَنْ تَنَالُوا البِرَّ (آل عمران ٩٣ - النساء ٢٣)' },
  { juz: 5, nameAr: 'الجزء الخامس', startSurah: 4, startAyah: 24, startPage: 82, labelAr: 'وَالمُحْصَنَاتُ (النساء ٢٤ - ١٤٧)' },
  { juz: 6, nameAr: 'الجزء السادس', startSurah: 4, startAyah: 148, startPage: 102, labelAr: 'لَا يُحِبُّ اللَّهُ (النساء ١٤٨ - المائدة ٨١)' },
  { juz: 7, nameAr: 'الجزء السابع', startSurah: 5, startAyah: 82, startPage: 121, labelAr: 'وَإِذَا سَمِعُوا (المائدة ٨٢ - الأنعام ١١٠)' },
  { juz: 8, nameAr: 'الجزء الثامن', startSurah: 6, startAyah: 111, startPage: 142, labelAr: 'وَلَوْ أَنَّنَا (الأنعام ١١١ - الأعراف ٨٧)' },
  { juz: 9, nameAr: 'الجزء التاسع', startSurah: 7, startAyah: 88, startPage: 162, labelAr: 'قَالَ المَلَأُ (الأعراف ٨٨ - الأنفال ٤٠)' },
  { juz: 10, nameAr: 'الجزء العاشر', startSurah: 8, startAyah: 41, startPage: 182, labelAr: 'وَاعْلَمُوا (الأنفال ٤١ - التوبة ٩٢)' },
  { juz: 11, nameAr: 'الجزء الحادي عشر', startSurah: 9, startAyah: 93, startPage: 201, labelAr: 'يَعْتَذِرُونَ إِلَيْكُمْ (التوبة ٩٣ - هود ٥)' },
  { juz: 12, nameAr: 'الجزء الثاني عشر', startSurah: 11, startAyah: 6, startPage: 222, labelAr: 'وَمَا مِنْ دَابَّةٍ (هود ٦ - يوسف ٥٢)' },
  { juz: 13, nameAr: 'الجزء الثالث عشر', startSurah: 12, startAyah: 53, startPage: 242, labelAr: 'وَمَا أُبَرِّئُ نَفْسِي (يوسف ٥٣ - إبراهيم ٥٢)' },
  { juz: 14, nameAr: 'الجزء الرابع عشر', startSurah: 15, startAyah: 1, startPage: 262, labelAr: 'رُبَمَا يَوَدُّ (الحجر ١ - النحل ١٢٨)' },
  { juz: 15, nameAr: 'الجزء الخامس عشر', startSurah: 17, startAyah: 1, startPage: 282, labelAr: 'سُبْحَانَ الَّذِي (الإسراء ١ - الكهف ٧٤)' },
  { juz: 16, nameAr: 'الجزء السادس عشر', startSurah: 18, startAyah: 75, startPage: 302, labelAr: 'قَالَ أَلَمْ أَقُلْ (الكهف ٧٥ - طه ١٣٥)' },
  { juz: 17, nameAr: 'الجزء السابع عشر', startSurah: 21, startAyah: 1, startPage: 322, labelAr: 'اقْتَرَبَ لِلنَّاسِ (الأنبياء ١ - الحج ٧٨)' },
  { juz: 18, nameAr: 'الجزء الثامن عشر', startSurah: 23, startAyah: 1, startPage: 342, labelAr: 'قَدْ أَفْلَحَ (المؤمنون ١ - الفرقان ٢٠)' },
  { juz: 19, nameAr: 'الجزء التاسع عشر', startSurah: 25, startAyah: 21, startPage: 362, labelAr: 'وَقَالَ الَّذِينَ (الفرقان ٢١ - النمل ٥٥)' },
  { juz: 20, nameAr: 'الجزء العشرون', startSurah: 27, startAyah: 56, startPage: 382, labelAr: 'فَمَا كَانَ جَوَابَ (النمل ٥٦ - العنكبوت ٤٥)' },
  { juz: 21, nameAr: 'الجزء الحادي والعشرون', startSurah: 29, startAyah: 46, startPage: 402, labelAr: 'وَلَا تُجَادِلُوا (العنكبوت ٤٦ - الأحزاب ٣٠)' },
  { juz: 22, nameAr: 'الجزء الثاني والعشرون', startSurah: 33, startAyah: 31, startPage: 422, labelAr: 'وَمَنْ يَقْنُتْ (الأحزاب ٣١ - يس ٢٧)' },
  { juz: 23, nameAr: 'الجزء الثالث والعشرون', startSurah: 36, startAyah: 28, startPage: 442, labelAr: 'وَمَا أَنْزَلْنَا (يس ٢٨ - الزمر ٣١)' },
  { juz: 24, nameAr: 'الجزء الرابع والعشرون', startSurah: 39, startAyah: 32, startPage: 462, labelAr: 'فَمَنْ أَظْلَمُ (الزمر ٣٢ - فصلت ٤٦)' },
  { juz: 25, nameAr: 'الجزء الخامس والعشرون', startSurah: 41, startAyah: 47, startPage: 482, labelAr: 'إِلَيْهِ يُرَدُّ (فصلت ٤٧ - الجاثية ٣٧)' },
  { juz: 26, nameAr: 'الجزء السادس والعشرون', startSurah: 46, startAyah: 1, startPage: 502, labelAr: 'حم (الأحقاف ١ - الذاريات ٣٠)' },
  { juz: 27, nameAr: 'الجزء السابع والعشرون', startSurah: 51, startAyah: 31, startPage: 522, labelAr: 'قَالَ فَمَا خَطْبُكُمْ (الذاريات ٣١ - الحديد ٢٩)' },
  { juz: 28, nameAr: 'الجزء الثامن والعشرون', startSurah: 58, startAyah: 1, startPage: 542, labelAr: 'قَدْ سَمِعَ (المجادلة ١ - التحريم ١٢)' },
  { juz: 29, nameAr: 'الجزء التاسع والعشرون (تبارك)', startSurah: 67, startAyah: 1, startPage: 562, labelAr: 'تَبَارَكَ الَّذِي (الملك ١ - المرسلات ٥٠)' },
  { juz: 30, nameAr: 'الجزء الثلاثون (عمّ)', startSurah: 78, startAyah: 1, startPage: 582, labelAr: 'عَمَّ يَتَسَاءَلُونَ (النبأ ١ - الناس ٦)' }
];

export const QuranView: React.FC = () => {
  const {
    language,
    theme,
    fontSize,
    fontFamily,
    addBookmark,
    isBookmarked,
    removeBookmark,
    showToast,
    soundEnabled,
    vibrationEnabled,
    isFocusMode,
    setIsFocusMode
  } = useApp();

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [currentSurahData, setCurrentSurahData] = useState<QuranSurah | null>(null);
  const [loadingSurah, setLoadingSurah] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan' | 'juz' | 'favorites' | 'images'>('all');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Reading Modes: 'detailed' (آية بآية), 'page' (صفحة بصفحة), 'mushaf_image' (مصورة quran.com), 'continuous' (السورة كاملة)
  const [viewMode, setViewMode] = useState<'detailed' | 'page' | 'mushaf_image' | 'continuous'>('page');

  // Page-by-page state
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [pagesInSurah, setPagesInSurah] = useState<number[]>([1]);
  const [pageDirection, setPageDirection] = useState<number>(1);

  // Audio Player State
  const [selectedReciter, setSelectedReciter] = useState<Reciter>(RECITERS_LIST[0]);
  const [isReciterModalOpen, setIsReciterModalOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Active Selected Ayah for Modal / Tafsir Drawer
  const [inspectedAyah, setInspectedAyah] = useState<QuranVerse | null>(null);

  // Favorites state for Surahs
  const [favoriteSurahs, setFavoriteSurahs] = useState<number[]>(() => {
    const saved = localStorage.getItem('sakinah_fav_surahs');
    return saved ? JSON.parse(saved) : [1, 18, 36, 55, 67, 112];
  });

  // Last read Surah
  const [lastReadSurah, setLastReadSurah] = useState<{ number: number; nameAr: string; nameEn: string } | null>(() => {
    const saved = localStorage.getItem('sakinah_last_read_quran');
    return saved ? JSON.parse(saved) : null;
  });

  // Toggle favorite surah
  const handleToggleFavoriteSurah = (surahNum: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    const updated = favoriteSurahs.includes(surahNum)
      ? favoriteSurahs.filter((n) => n !== surahNum)
      : [...favoriteSurahs, surahNum];
    setFavoriteSurahs(updated);
    localStorage.setItem('sakinah_fav_surahs', JSON.stringify(updated));
  };

  // Filtered surahs
  const filteredSurahs = SURAHS_METADATA.filter((s) => {
    const matchesSearch =
      s.nameAr.includes(searchQuery) ||
      s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.number.toString() === searchQuery.trim();

    if (!matchesSearch) return false;

    if (filterType === 'Meccan') return s.revelationType === 'Meccan';
    if (filterType === 'Medinan') return s.revelationType === 'Medinan';
    if (filterType === 'favorites') return favoriteSurahs.includes(s.number);
    return true;
  });

  // Load full Surah data when selected
  useEffect(() => {
    if (!selectedSurahNumber) return;

    let isMounted = true;
    setLoadingSurah(true);

    fetchFullSurah(selectedSurahNumber)
      .then((data) => {
        if (!isMounted) return;
        setCurrentSurahData(data);
        setLoadingSurah(false);

        // Derive unique pages in this surah
        const pages = Array.from(new Set(data.verses.map((v) => v.page || 1))).sort((a, b) => a - b);
        setPagesInSurah(pages.length > 0 ? pages : [1]);
        setCurrentPageNumber(pages[0] || 1);

        // Save last read surah
        const lastRead = { number: data.number, nameAr: data.nameAr, nameEn: data.nameEn };
        setLastReadSurah(lastRead);
        localStorage.setItem('sakinah_last_read_quran', JSON.stringify(lastRead));
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadingSurah(false);
        showToast(
          language === 'ar' ? 'تعذر تحميل السورة' : 'Error loading Surah',
          language === 'ar' ? 'يرجى التحقق من اتصال الإنترنت.' : 'Check internet connection.'
        );
      });

    return () => {
      isMounted = false;
    };
  }, [selectedSurahNumber]);

  // Audio setup when reciter or surah changes
  useEffect(() => {
    if (!selectedSurahNumber || !currentSurahData) return;

    const formattedNum = String(selectedSurahNumber).padStart(3, '0');
    const audioUrl = `${selectedReciter.serverUrl}/${formattedNum}.mp3`;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [selectedSurahNumber, selectedReciter]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        showToast(
          language === 'ar' ? 'تعذر تشغيل التلاوة' : 'Audio Unavailable',
          language === 'ar' ? 'يرجى اختيار قارئ آخر أو التأكد من الاتصال.' : 'Select another reciter or check connection.'
        );
        setIsPlaying(false);
      });
    }
  };

  // Audio event listeners
  const onTimeUpdate = () => {
    if (!audioRef.current) return;
    setAudioCurrentTime(audioRef.current.currentTime);
    const progress = (audioRef.current.currentTime / (audioRef.current.duration || 1)) * 100;
    setAudioProgress(progress);
  };

  const onLoadedMetadata = () => {
    if (!audioRef.current) return;
    setAudioDuration(audioRef.current.duration || 0);
  };

  const onEnded = () => {
    setIsPlaying(false);
    setAudioProgress(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const targetTime = (parseFloat(e.target.value) / 100) * audioDuration;
    audioRef.current.currentTime = targetTime;
    setAudioProgress(parseFloat(e.target.value));
  };

  // Page navigation
  const handlePageChange = (newPage: number, direction: number) => {
    setPageDirection(direction);
    setCurrentPageNumber(newPage);
  };

  // Click on Surah
  const handleSurahClick = (surahNum: number, initialPage?: number) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    setSelectedSurahNumber(surahNum);
    const startPage = initialPage || SURAH_START_PAGES[surahNum] || 1;
    setCurrentPageNumber(startPage);
    setViewMode('mushaf_image');
  };

  // Copy Ayah
  const handleCopyAyah = (verse: QuranVerse, surahName: string) => {
    const textToCopy = `${verse.textAr} [${surahName}: ${verse.verseNumber}]`;
    navigator.clipboard.writeText(textToCopy);
    showToast(
      language === 'ar' ? 'تم نسخ الآية الكريمة' : 'Ayah Copied',
      language === 'ar' ? `آية ${verse.verseNumber} من سورة ${surahName}` : `Ayah ${verse.verseNumber}`
    );
  };

  // Toggle Ayah Bookmark
  const handleToggleAyahBookmark = (verse: QuranVerse, surah: QuranSurah) => {
    const bookmarkId = `quran_${surah.number}_${verse.verseNumber}`;
    if (isBookmarked(bookmarkId)) {
      removeBookmark(bookmarkId);
      showToast(
        language === 'ar' ? 'تمت إزالة الحفظ' : 'Bookmark Removed',
        language === 'ar' ? 'تم حذف الآية من قائمة المحفوظات' : 'Removed from bookmarks'
      );
    } else {
      addBookmark({
        id: bookmarkId,
        type: 'quran',
        title: `سورة ${surah.nameAr} (آية ${verse.verseNumber})`,
        textPreview: verse.textAr,
        createdAt: new Date().toISOString()
      });
      showToast(
        language === 'ar' ? 'تم حفظ الآية' : 'Ayah Bookmarked',
        language === 'ar' ? 'يمكنك الرجوع إليها في أي وقت من المفضلة' : 'Saved to your bookmarks'
      );
    }
  };

  const getArabicFontClass = () => {
    switch (fontFamily) {
      case 'amiri':
        return 'font-quran';
      case 'scheherazade':
        return 'font-scheherazade';
      case 'tajawal':
        return 'font-tajawal';
      default:
        return 'font-quran';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-lg sm:text-xl leading-[2.4]';
      case 'lg':
        return 'text-2xl sm:text-3xl md:text-4xl leading-[2.9]';
      case 'xl':
        return 'text-3xl sm:text-4xl md:text-5xl leading-[3.2]';
      default:
        return 'text-xl sm:text-2xl md:text-3xl leading-[2.6]';
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div id="quran-view" className="space-y-5 pb-24">
      {/* If No Surah Selected: Surah Browser & Index */}
      {!selectedSurahNumber ? (
        <div className="space-y-6">
          {/* Header Hero Banner */}
          <div
            className={`relative overflow-hidden rounded-3xl p-6 sm:p-8 border backdrop-blur-2xl transition-all shadow-xl ${
              theme === 'light'
                ? 'bg-gradient-to-br from-amber-50 via-white to-emerald-50 border-amber-300/80 text-slate-900 shadow-amber-900/5'
                : theme === 'sepia'
                ? 'bg-gradient-to-br from-[#332216] via-[#24170f] to-[#1c1109] border-amber-700/60 text-amber-50 shadow-black/60'
                : 'bg-gradient-to-br from-[#06241e] via-[#091e24] to-[#0d1624] border-emerald-500/30 text-slate-100 shadow-emerald-950/50'
            }`}
          >
            {/* Islamic Background Texture */}
            <div className="absolute inset-0 bg-islamic-arabesque opacity-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3 font-cairo">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'ar' ? 'المصحف الشريف كاملاً (١١٤ سورة)' : 'The Holy Qur’an (114 Surahs)'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-cairo text-slate-100 mb-2">
                  {language === 'ar' ? 'فهرس سور وأجزاء القرآن الكريم' : 'Quran Surahs & Ajza’ Catalog'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl font-cairo leading-relaxed">
                  {language === 'ar'
                    ? 'تصفح وقراءة المصحف الشريف بنمط الصفحة، أو الآيات المفصلة، أو السورة المتصلة، مع الاستماع لأشهر القراء.'
                    : 'Read and listen to the Holy Quran by Page, Verse, or Continuous flow with renowned reciters.'}
                </p>
              </div>

              {/* Last Read Quick Jump */}
              {lastReadSurah && (
                <button
                  onClick={() => handleSurahClick(lastReadSurah.number)}
                  className="group flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 hover:border-emerald-400/80 transition-all cursor-pointer shadow-lg shrink-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform">
                    <Bookmark className="w-5 h-5 fill-emerald-400 text-emerald-300" />
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-amber-400 block font-bold font-cairo">
                      {language === 'ar' ? 'متابعة القراءة الأخيرة' : 'Continue Reading'}
                    </span>
                    <span className="text-sm font-bold font-cairo text-slate-100">
                      {language === 'ar' ? `سورة ${lastReadSurah.nameAr}` : `Surah ${lastReadSurah.nameEn}`}
                    </span>
                  </div>
                  <ChevronLeft className={`w-4 h-4 text-emerald-400 group-hover:-translate-x-1 transition-transform ${language === 'en' ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Quick Surahs Bar */}
            <div className="relative z-10 mt-6 pt-4 border-t border-slate-700/40 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs text-amber-300 font-bold shrink-0 font-cairo flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {language === 'ar' ? 'سور مباركة شائعة:' : 'Quick Surahs:'}
              </span>
              {[
                { num: 1, name: 'الفاتحة' },
                { num: 18, name: 'الكهف' },
                { num: 36, name: 'يس' },
                { num: 55, name: 'الرحمن' },
                { num: 56, name: 'الواقعة' },
                { num: 67, name: 'الملك' },
                { num: 112, name: 'الإخلاص' }
              ].map((qs) => (
                <button
                  key={qs.num}
                  onClick={() => handleSurahClick(qs.num)}
                  className="px-3.5 py-1 text-xs rounded-full bg-slate-900/80 border border-slate-700/70 hover:border-emerald-400 hover:bg-emerald-950/60 text-slate-200 hover:text-emerald-300 transition-all shrink-0 cursor-pointer font-cairo font-semibold"
                >
                  {qs.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search, Filter Tabs & Layout Switcher */}
          <div className="space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {/* Search Input */}
              <div className="relative w-full flex-1">
                <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن سورة بالاسم، أو الرقم، أو المعنى...' : 'Search Surah by name, number, or meaning...'}
                  className={`w-full py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                    language === 'ar' ? 'pr-10 pl-4 font-cairo' : 'pl-10 pr-4'
                  } ${
                    theme === 'light'
                      ? 'bg-white border-slate-200 text-slate-800'
                      : 'bg-slate-900/80 border-slate-800 text-slate-100 placeholder-slate-500'
                  }`}
                />
              </div>

              {/* Layout Switcher (Grid / List) */}
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-2xl border border-slate-700 shrink-0">
                <button
                  onClick={() => setLayoutMode('grid')}
                  title={language === 'ar' ? 'عرض شبكي' : 'Grid View'}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    layoutMode === 'grid' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setLayoutMode('list')}
                  title={language === 'ar' ? 'عرض قائمة' : 'List View'}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    layoutMode === 'list' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Filter Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', labelAr: 'جميع السور (١١٤)', labelEn: 'All Surahs (114)' },
                { id: 'images', labelAr: 'المصحف المصور (quran.com) 🖼️', labelEn: 'Quran Images (604 Pages)' },
                { id: 'Meccan', labelAr: 'مكية (٨٦) 🕋', labelEn: 'Meccan (86)' },
                { id: 'Medinan', labelAr: 'مدنية (٢٨) 🕌', labelEn: 'Medinan (28)' },
                { id: 'juz', labelAr: 'تصفح الأجزاء (٣٠ جزءاً) 📑', labelEn: 'By Juz (30)' },
                { id: 'favorites', labelAr: 'السور المفضلة ⭐', labelEn: 'Favorites' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setFilterType(tab.id as any);
                  }}
                  className={`px-4 py-2 rounded-2xl text-xs font-bold font-cairo whitespace-nowrap transition-all cursor-pointer ${
                    filterType === tab.id
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/25'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70'
                  }`}
                >
                  {language === 'ar' ? tab.labelAr : tab.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* View: Direct quran.com-images Browser (All 604 pages) */}
          {filterType === 'images' ? (
            <div className="space-y-4">
              <QuranImagePageView
                pageNumber={currentPageNumber}
                onPageChange={handlePageChange}
                direction={pageDirection}
                theme={theme}
                language={language}
              />
            </div>
          ) : filterType === 'juz' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {QURAN_AJZA.map((j) => (
                <motion.div
                  key={j.juz}
                  whileHover={{ y: -2 }}
                  onClick={() => handleSurahClick(j.startSurah, j.startPage)}
                  className={`p-4 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-between ${
                    theme === 'light'
                      ? 'bg-white/90 border-slate-200 hover:border-emerald-500/60 hover:bg-emerald-50/40 text-slate-800'
                      : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm shrink-0 shadow-inner">
                      {j.juz}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base font-cairo text-slate-100">
                        {j.nameAr}
                      </h3>
                      <p className="text-xs text-emerald-400 font-cairo mt-0.5">{j.labelAr}</p>
                      <span className="text-[10px] text-slate-400 font-mono">يبدأ من صفحة {j.startPage}</span>
                    </div>
                  </div>
                  <ChevronLeft className={`w-4 h-4 text-emerald-400 ${language === 'en' ? 'rotate-180' : ''}`} />
                </motion.div>
              ))}
            </div>
          ) : (
            /* Surahs Grid or List */
            <div className={layoutMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5' : 'space-y-2.5'}>
              {filteredSurahs.map((surah) => {
                const isFav = favoriteSurahs.includes(surah.number);

                return (
                  <motion.div
                    key={surah.number}
                    whileHover={{ y: -2 }}
                    onClick={() => handleSurahClick(surah.number)}
                    className={`group p-4 rounded-3xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${
                      theme === 'light'
                        ? 'bg-white/85 border-slate-200 hover:border-emerald-500/60 hover:bg-emerald-50/30'
                        : theme === 'sepia'
                        ? 'bg-[#291c13]/85 border-amber-800/40 hover:border-amber-500/50'
                        : 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/40 hover:bg-slate-800/80'
                    }`}
                  >
                    {/* Left: Star Rosette Number + Titles */}
                    <div className="flex items-center gap-3.5">
                      {/* Islamic Rosette Badge */}
                      <div className="relative w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shrink-0 shadow-inner">
                        <span>{surah.number}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base font-cairo text-slate-100 group-hover:text-emerald-400 transition-colors">
                            {language === 'ar' ? `سورة ${surah.nameAr}` : surah.nameEn}
                          </h3>
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-cairo mt-1">
                          <span className="text-amber-400 font-medium">
                            {surah.revelationType === 'Meccan' ? 'مكية 🕋' : 'مدنية 🕌'}
                          </span>
                          <span>•</span>
                          <span>{surah.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'}</span>
                          <span>•</span>
                          <span>{language === 'ar' ? `الجزء ${surah.juzStart}` : `Juz ${surah.juzStart}`}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Surah Calligraphy & Favorite Star */}
                    <div className="flex items-center gap-2.5">
                      <div className="text-right">
                        <span className="text-xl sm:text-2xl font-quran font-bold text-amber-300/90 group-hover:text-amber-300 block">
                          {surah.nameAr}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans block">{surah.englishMeaning}</span>
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => handleToggleFavoriteSurah(surah.number, e)}
                        title={isFav ? (language === 'ar' ? 'إزالة من المفضلة' : 'Remove Favorite') : (language === 'ar' ? 'إضافة للمفضلة' : 'Add Favorite')}
                        className={`p-2 rounded-xl transition-all cursor-pointer ${
                          isFav ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-amber-300 hover:bg-slate-800'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {filteredSurahs.length === 0 && filterType !== 'juz' && (
            <div className="text-center py-16 text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400" />
              <p className="font-cairo text-sm">
                {language === 'ar' ? 'لم يتم العثور على أي سورة مطابقة للبحث.' : 'No Surahs found matching your search.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Surah Reader View */
        <div className="space-y-4">
          {/* Top Sticky Surah Toolbar */}
          <div
            className={`sticky top-2 z-30 p-3.5 sm:p-4 rounded-3xl border backdrop-blur-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 transition-all ${
              theme === 'light'
                ? 'bg-white/90 border-slate-200 text-slate-800'
                : theme === 'sepia'
                ? 'bg-[#291c13]/90 border-amber-800/40 text-amber-50'
                : 'bg-slate-900/90 border-slate-800 text-slate-100'
            }`}
          >
            {/* Left: Back Button & Surah Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedSurahNumber(null);
                  setCurrentSurahData(null);
                  if (audioRef.current) {
                    audioRef.current.pause();
                    setIsPlaying(false);
                  }
                }}
                className="p-2 rounded-2xl bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1 text-xs font-bold font-cairo"
              >
                <ArrowRight className={`w-4 h-4 ${language === 'en' ? 'rotate-180' : ''}`} />
                <span>{language === 'ar' ? 'الفهرس' : 'Index'}</span>
              </button>

              {currentSurahData && (
                <div>
                  <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100">
                    {language === 'ar' ? `سورة ${currentSurahData.nameAr}` : `Surah ${currentSurahData.nameEn}`}
                  </h2>
                  <span className="text-[11px] text-emerald-400 font-cairo block">
                    {currentSurahData.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'} • {currentSurahData.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية 🕋' : 'Meccan') : (language === 'ar' ? 'مدنية 🕌' : 'Medinan')}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Reading Modes & Reciter Player */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Reading Mode Tabs */}
              <div className="flex items-center gap-1 bg-slate-800/90 p-1 rounded-2xl border border-slate-700/80">
                {[
                  { id: 'page', labelAr: 'صفحة بصفحة', labelEn: 'By Page', icon: <BookOpen className="w-3.5 h-3.5" /> },
                  { id: 'mushaf_image', labelAr: 'مصحف الصور', labelEn: 'Quran Images', icon: <Eye className="w-3.5 h-3.5 text-amber-400" /> },
                  { id: 'continuous', labelAr: 'السورة كاملة', labelEn: 'Full Surah', icon: <AlignJustify className="w-3.5 h-3.5" /> },
                  { id: 'detailed', labelAr: 'آية بآية', labelEn: 'By Verse', icon: <Layers className="w-3.5 h-3.5" /> }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      soundEngine.playClick();
                      setViewMode(mode.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-cairo flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === mode.id
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-300 hover:text-slate-100'
                    }`}
                  >
                    {mode.icon}
                    <span className="hidden sm:inline">{language === 'ar' ? mode.labelAr : mode.labelEn}</span>
                  </button>
                ))}
              </div>

              {/* Reciter Selector Button */}
              <button
                onClick={() => setIsReciterModalOpen(true)}
                title={language === 'ar' ? 'اختيار القارئ' : 'Select Reciter'}
                className="px-3 py-1.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span className="max-w-[90px] truncate">{language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}</span>
              </button>

              {/* Audio Play/Pause Button */}
              <button
                onClick={handleTogglePlay}
                title={isPlaying ? (language === 'ar' ? 'إيقاف مؤقت' : 'Pause') : (language === 'ar' ? 'تشغيل السورة' : 'Play Surah')}
                className={`p-2 rounded-2xl border transition-all cursor-pointer shadow-md ${
                  isPlaying
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-emerald-500 text-slate-950 border-emerald-400 hover:scale-105'
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              </button>
            </div>
          </div>

          {/* Audio Player Progress Mini-Bar (When playing) */}
          {isPlaying && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl border bg-emerald-950/60 border-emerald-500/30 backdrop-blur-xl flex items-center gap-3 text-xs font-cairo"
            >
              <div className="flex items-center gap-2 text-emerald-400 shrink-0">
                <Music className="w-4 h-4 animate-pulse" />
                <span className="font-bold">{language === 'ar' ? selectedReciter.nameAr : selectedReciter.nameEn}</span>
              </div>

              <span className="font-mono text-[11px] text-slate-400">{formatTime(audioCurrentTime)}</span>

              <input
                type="range"
                min="0"
                max="100"
                value={audioProgress || 0}
                onChange={handleSeek}
                className="flex-1 accent-emerald-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />

              <span className="font-mono text-[11px] text-slate-400">{formatTime(audioDuration)}</span>

              <button
                onClick={handleTogglePlay}
                className="p-1 rounded-lg bg-white/10 text-slate-200 hover:bg-white/20 cursor-pointer"
              >
                <Pause className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          {/* Loading State */}
          {loadingSurah && (
            <div className="text-center py-24">
              <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm font-bold text-slate-300 font-cairo">
                {language === 'ar' ? 'جاري تحميل آيات السورة الكريمة...' : 'Loading Holy Surah verses...'}
              </p>
            </div>
          )}

          {/* 1. Page-by-Page Reading View Mode (صفحة بصفحة) */}
          {currentSurahData && !loadingSurah && viewMode === 'page' && (
            <QuranPageView
              surah={currentSurahData}
              currentPageNumber={currentPageNumber}
              pagesInSurah={pagesInSurah}
              onPageChange={handlePageChange}
              direction={pageDirection}
              fontFamily={fontFamily}
              fontSize={fontSize}
              theme={theme}
              language={language}
              onAyahClick={(verse) => setInspectedAyah(verse)}
              onCopyAyah={(verse) => handleCopyAyah(verse, currentSurahData.nameAr)}
              onToggleBookmark={(verse) => handleToggleAyahBookmark(verse, currentSurahData)}
              isBookmarked={(id) => isBookmarked(id)}
              selectedAyahNumber={inspectedAyah?.verseNumber || null}
            />
          )}

          {/* 1.5. Quran.com Images Mode (صفحات المصحف المصورة) */}
          {currentSurahData && !loadingSurah && viewMode === 'mushaf_image' && (
            <QuranImagePageView
              pageNumber={currentPageNumber}
              onPageChange={handlePageChange}
              direction={pageDirection}
              theme={theme}
              language={language}
              surahNameAr={currentSurahData.nameAr}
            />
          )}

          {/* 2. Continuous Surah Reading View Mode (السورة متصلة ورا بعض) */}
          {currentSurahData && !loadingSurah && viewMode === 'continuous' && (
            <div className="space-y-4">
              {/* Ornate Header Component */}
              <MushafSurahHeader
                surah={currentSurahData}
                showBismillah={true}
                theme={theme}
                language={language}
              />

              {/* Full Continuous Flow Container in Authentic Double Border */}
              <div
                className={`relative p-5 sm:p-9 md:p-11 rounded-3xl border-2 shadow-2xl transition-all ${
                  theme === 'light'
                    ? 'bg-[#fbf7ed] border-amber-400/80 text-slate-900 shadow-amber-900/10'
                    : theme === 'sepia'
                    ? 'bg-[#261911] border-amber-700/60 text-amber-50 shadow-black/70'
                    : 'bg-[#09151e] border-emerald-500/40 text-slate-100 shadow-emerald-950/60'
                }`}
              >
                {/* Inner Framing Line */}
                <div className={`absolute inset-2 sm:inset-3 border rounded-2xl pointer-events-none ${
                  theme === 'light' ? 'border-amber-400/30' : theme === 'sepia' ? 'border-amber-600/30' : 'border-emerald-500/25'
                }`} />

                {/* Corner Floral Rosettes */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[9px] text-amber-400 opacity-60 pointer-events-none">❖</div>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-[9px] text-amber-400 opacity-60 pointer-events-none">❖</div>
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 text-[9px] text-amber-400 opacity-60 pointer-events-none">❖</div>
                <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 text-[9px] text-amber-400 opacity-60 pointer-events-none">❖</div>

                {/* Justified Quran Text */}
                <div
                  dir="rtl"
                  className={`relative z-10 mushaf-layout px-1 sm:px-3 py-1 select-text ${getArabicFontClass()} ${getFontSizeClass()}`}
                >
                  {currentSurahData.verses.map((verse) => {
                    const bookmarkId = `quran_${currentSurahData.number}_${verse.verseNumber}`;
                    const saved = isBookmarked(bookmarkId);
                    const isSelected = inspectedAyah?.verseNumber === verse.verseNumber;

                    return (
                      <span
                        key={verse.id || verse.verseNumber}
                        onClick={() => setInspectedAyah(verse)}
                        className={`inline transition-all cursor-pointer rounded-lg px-0.5 py-0.5 ${
                          isSelected
                            ? 'bg-emerald-500/30 text-emerald-200 shadow-sm'
                            : 'hover:text-emerald-300 hover:bg-emerald-500/15'
                        }`}
                      >
                        {verse.textAr}{' '}
                        <AyahEndMarker
                          verseNumber={verse.verseNumber}
                          isBookmarked={saved}
                          isSelected={isSelected}
                          onClick={() => setInspectedAyah(verse)}
                        />{' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* 3. Detailed Verses Reading View Mode (آية بآية) */}
          {currentSurahData && !loadingSurah && viewMode === 'detailed' && (
            <div className="space-y-4">
              <MushafSurahHeader
                surah={currentSurahData}
                showBismillah={false}
                theme={theme}
                language={language}
              />

              <div className="space-y-3.5">
                {currentSurahData.verses.map((verse) => {
                  const bookmarkId = `quran_${currentSurahData.number}_${verse.verseNumber}`;
                  const saved = isBookmarked(bookmarkId);

                  return (
                    <div
                      key={verse.id || verse.verseNumber}
                      className={`p-5 sm:p-6 rounded-3xl border backdrop-blur-xl transition-all shadow-sm ${
                        theme === 'light'
                          ? 'bg-white/85 border-slate-200 hover:border-emerald-400/50'
                          : theme === 'sepia'
                          ? 'bg-[#291c13] border-amber-800/40 hover:border-amber-500/50'
                          : 'bg-slate-900/70 border-slate-800/80 hover:border-emerald-500/30'
                      }`}
                    >
                      {/* Verse Header Info & Actions */}
                      <div className="flex items-center justify-between mb-4 border-b border-slate-800/50 pb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs flex items-center justify-center font-mono">
                            {verse.verseNumber}
                          </span>
                          <span className="text-xs text-slate-400 font-cairo">
                            {language === 'ar' ? `آية ${verse.verseNumber}` : `Ayah ${verse.verseNumber}`}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {language === 'ar' ? `(صفحة ${verse.page || 1})` : `(Page ${verse.page || 1})`}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyAyah(verse, currentSurahData.nameAr)}
                            title={language === 'ar' ? 'نسخ الآية' : 'Copy Ayah'}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-slate-800 transition-all cursor-pointer"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleAyahBookmark(verse, currentSurahData)}
                            title={language === 'ar' ? 'حفظ في المفضلة' : 'Bookmark'}
                            className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                              saved ? 'text-amber-400 bg-amber-400/10' : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Arabic Verse Text */}
                      <p
                        dir="rtl"
                        className={`text-right font-semibold text-slate-100 mb-3 ${getArabicFontClass()} ${getFontSizeClass()}`}
                      >
                        {verse.textAr}{' '}
                        <AyahEndMarker
                          verseNumber={verse.verseNumber}
                          isBookmarked={saved}
                          isSelected={inspectedAyah?.verseNumber === verse.verseNumber}
                          onClick={() => setInspectedAyah(verse)}
                        />
                      </p>

                      {verse.textEn && (
                        <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed pt-2 border-t border-slate-800/40">
                          {verse.textEn}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden Global Audio Element for Surah Player */}
      <audio
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
        className="hidden"
      />

      {/* Reciter Selector Modal */}
      <QuranReciterModal
        isOpen={isReciterModalOpen}
        onClose={() => setIsReciterModalOpen(false)}
        selectedReciter={selectedReciter}
        onSelectReciter={(reciter) => {
          setSelectedReciter(reciter);
          showToast(
            language === 'ar' ? 'تم اختيار القارئ' : 'Reciter Changed',
            language === 'ar' ? `القارئ الشيخ ${reciter.nameAr}` : reciter.nameEn
          );
        }}
      />
    </div>
  );
};
