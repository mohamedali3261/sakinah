import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SURAHS_METADATA, RECITERS_LIST, fetchFullSurah } from '../../data/quranData';
import { QuranSurah, QuranVerse, Reciter } from '../../types';
import { QuranPageView } from '../QuranPageView';
import { QuranImagePageView, SURAH_START_PAGES } from '../QuranImagePageView';
import { QuranReciterModal } from '../QuranReciterModal';
import { TafsirModal } from '../TafsirModal';
import { QuranMemorizeModal } from '../QuranMemorizeModal';
import { getPaperThemeById } from '../../data/paperThemes';
import { soundEngine, triggerHaptic } from '../../utils/audio';

import { QuranStandaloneMushaf } from './QuranStandaloneMushaf';
import { QuranGateway } from './QuranGateway';
import { QuranSurahToolbar } from './QuranSurahToolbar';
import { QuranContinuousView } from './QuranContinuousView';

export const QuranView: React.FC = () => {
  const {
    language,
    theme,
    fontSize,
    fontFamily,
    quranPaperTheme,
    setIsPaperThemeModalOpen,
    addBookmark,
    isBookmarked,
    removeBookmark,
    showToast,
    soundEnabled,
    vibrationEnabled,
    setIsFocusMode,
    setActiveTab,
    setIsRepeatPageOpen,
  } = useApp();

  const paperTheme = getPaperThemeById(quranPaperTheme);

  const [selectedSurahNumber, setSelectedSurahNumber] = useState<number | null>(null);
  const [currentSurahData, setCurrentSurahData] = useState<QuranSurah | null>(null);
  const [loadingSurah, setLoadingSurah] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'Meccan' | 'Medinan' | 'juz' | 'favorites' | 'images' | 'khatmah'>('all');

  // Reading Modes: 'page' (صفحة بصفحة), 'mushaf_image' (مصورة quran.com), 'continuous' (السورة كاملة)
  const [viewMode, setViewMode] = useState<'page' | 'mushaf_image' | 'continuous'>('page');

  // Page-by-page state
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(() => {
    const saved = localStorage.getItem('sakinah_last_quran_page');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [pagesInSurah, setPagesInSurah] = useState<number[]>([1]);
  const [pageDirection, setPageDirection] = useState<number>(1);

  // Modals
  const [isTafsirModalOpen, setIsTafsirModalOpen] = useState<boolean>(false);
  const [isMemorizeModalOpen, setIsMemorizeModalOpen] = useState<boolean>(false);

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

  // Standalone Mushaf State
  const [isStandaloneMushafOpen, setIsStandaloneMushafOpen] = useState<boolean>(false);

  // Check if standalone Mushaf was triggered from another view
  useEffect(() => {
    if (localStorage.getItem('sakinah_trigger_standalone_mushaf') === 'true') {
      localStorage.removeItem('sakinah_trigger_standalone_mushaf');
      const savedPage = localStorage.getItem('sakinah_last_quran_page');
      if (savedPage) {
        setCurrentPageNumber(parseInt(savedPage, 10));
      }
      setIsStandaloneMushafOpen(true);
      setIsFocusMode(true);
    }
  }, [isStandaloneMushafOpen, setIsFocusMode]);

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
    localStorage.setItem('sakinah_last_quran_page', newPage.toString());
  };

  // Click on Surah
  const handleSurahClick = (surahNum: number, initialPage?: number) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    const startPage = initialPage || SURAH_START_PAGES[surahNum] || 1;
    setCurrentPageNumber(startPage);
    localStorage.setItem('sakinah_last_quran_page', startPage.toString());
    setIsStandaloneMushafOpen(true);
    setIsFocusMode(true);
  };

  const openStandaloneMushaf = (page?: number) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(15);
    if (page) {
      setCurrentPageNumber(page);
      localStorage.setItem('sakinah_last_quran_page', page.toString());
    } else {
      const savedPage = localStorage.getItem('sakinah_last_quran_page');
      if (savedPage) {
        setCurrentPageNumber(parseInt(savedPage, 10));
      }
    }
    setIsStandaloneMushafOpen(true);
    setIsFocusMode(true);
  };

  const closeStandaloneMushaf = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setIsStandaloneMushafOpen(false);
    setIsFocusMode(false);

    if (localStorage.getItem('sakinah_opened_from_index') === 'true') {
      localStorage.removeItem('sakinah_opened_from_index');
      setActiveTab('index');
    }
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
        createdAt: new Date().toISOString(),
      });
      showToast(
        language === 'ar' ? 'تم حفظ الآية' : 'Ayah Bookmarked',
        language === 'ar' ? 'يمكنك الرجوع إليها في أي وقت من المفضلة' : 'Saved to your bookmarks'
      );
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (isStandaloneMushafOpen) {
    return (
      <QuranStandaloneMushaf
        currentPageNumber={currentPageNumber}
        handlePageChange={handlePageChange}
        pageDirection={pageDirection}
        theme={theme}
        language={language}
        onClose={closeStandaloneMushaf}
      />
    );
  }

  return (
    <div id="quran-view" className="space-y-5 pb-24">
      {/* If No Surah Selected: Clean, Beautiful Quran Gateway */}
      {!selectedSurahNumber ? (
        <QuranGateway
          theme={theme}
          language={language}
          currentPageNumber={currentPageNumber}
          lastReadSurah={lastReadSurah}
          selectedReciter={selectedReciter}
          setSelectedReciter={setSelectedReciter}
          handleSurahClick={handleSurahClick}
          openStandaloneMushaf={openStandaloneMushaf}
          setActiveTab={setActiveTab}
          setIsRepeatPageOpen={setIsRepeatPageOpen}
        />
      ) : (
        /* Surah Reader View */
        <div className="space-y-4">
          {/* Top Sticky Surah Toolbar & Playback bar */}
          <QuranSurahToolbar
            theme={theme}
            language={language}
            currentSurahData={currentSurahData}
            onBack={() => {
              soundEngine.playClick();
              setSelectedSurahNumber(null);
              setCurrentSurahData(null);
              if (audioRef.current) {
                audioRef.current.pause();
                setIsPlaying(false);
              }
            }}
            viewMode={viewMode}
            setViewMode={setViewMode}
            setIsMemorizeModalOpen={setIsMemorizeModalOpen}
            setIsRepeatPageOpen={setIsRepeatPageOpen}
            setIsPaperThemeModalOpen={setIsPaperThemeModalOpen}
            setIsReciterModalOpen={setIsReciterModalOpen}
            selectedReciter={selectedReciter}
            isPlaying={isPlaying}
            handleTogglePlay={handleTogglePlay}
            audioCurrentTime={audioCurrentTime}
            audioDuration={audioDuration}
            audioProgress={audioProgress}
            handleSeek={handleSeek}
            formatTime={formatTime}
          />

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
              onAyahClick={(verse) => {
                setInspectedAyah(verse);
                setIsTafsirModalOpen(true);
              }}
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
            <QuranContinuousView
              currentSurahData={currentSurahData}
              paperTheme={paperTheme}
              theme={theme}
              language={language}
              fontFamily={fontFamily}
              fontSize={fontSize}
              inspectedAyah={inspectedAyah}
              setInspectedAyah={setInspectedAyah}
              setIsTafsirModalOpen={setIsTafsirModalOpen}
              isBookmarked={(id) => isBookmarked(id)}
            />
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

      {/* Tafsir & Word Meanings Modal */}
      {currentSurahData && (
        <TafsirModal
          isOpen={isTafsirModalOpen}
          onClose={() => {
            setIsTafsirModalOpen(false);
            setInspectedAyah(null);
          }}
          verse={inspectedAyah}
          surahNameAr={currentSurahData.nameAr}
          surahNumber={currentSurahData.number}
          theme={theme}
          language={language}
          hasPrevAyah={inspectedAyah ? inspectedAyah.verseNumber > 1 : false}
          hasNextAyah={
            inspectedAyah
              ? inspectedAyah.verseNumber < currentSurahData.verses.length
              : false
          }
          onNavigatePrevAyah={() => {
            if (!inspectedAyah) return;
            const prevIdx = currentSurahData.verses.findIndex(
              (v) => v.verseNumber === inspectedAyah.verseNumber - 1
            );
            if (prevIdx !== -1) {
              setInspectedAyah(currentSurahData.verses[prevIdx]);
            }
          }}
          onNavigateNextAyah={() => {
            if (!inspectedAyah) return;
            const nextIdx = currentSurahData.verses.findIndex(
              (v) => v.verseNumber === inspectedAyah.verseNumber + 1
            );
            if (nextIdx !== -1) {
              setInspectedAyah(currentSurahData.verses[nextIdx]);
            }
          }}
        />
      )}

      {/* Quran Memorization & Repetition Mode Modal */}
      {currentSurahData && (
        <QuranMemorizeModal
          isOpen={isMemorizeModalOpen}
          onClose={() => setIsMemorizeModalOpen(false)}
          surahNumber={currentSurahData.number}
          surahNameAr={currentSurahData.nameAr}
          verses={currentSurahData.verses}
          theme={theme}
          language={language}
        />
      )}
    </div>
  );
};
