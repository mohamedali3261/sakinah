import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  ThemeMode,
  ArabicFont,
  FontSize,
  QuranPaperThemeId,
  ActiveTab,
  Bookmark,
  DailyReminder,
  Book,
  BookChapter
} from '../types';
import { BOOKS_DATA } from '../data/booksData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  fontFamily: ArabicFont;
  setFontFamily: (font: ArabicFont) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  quranPaperTheme: QuranPaperThemeId;
  setQuranPaperTheme: (theme: QuranPaperThemeId) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Navigation drilldown
  selectedAthkarCategoryId: string | null;
  setSelectedAthkarCategoryId: (id: string | null) => void;
  selectedBook: Book | null;
  setSelectedBook: (book: Book | null) => void;
  selectedChapter: BookChapter | null;
  setSelectedChapter: (chapter: BookChapter | null) => void;
  
  // Bookmarks & Offline
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'dateAdded'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (targetId: string) => boolean;
  offlineBookIds: string[];
  toggleOfflineBook: (bookId: string) => void;
  isBookOffline: (bookId: string) => boolean;
  
  // Digital Tasbih Global State
  totalDhikrCount: number;
  incrementGlobalDhikr: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  vibrationEnabled: boolean;
  setVibrationEnabled: (val: boolean) => void;
  
  // Modals & Focus Mode
  isFocusMode: boolean;
  setIsFocusMode: (val: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (val: boolean) => void;
  isFontSettingsOpen: boolean;
  setIsFontSettingsOpen: (val: boolean) => void;
  isNotificationSettingsOpen: boolean;
  setIsNotificationSettingsOpen: (val: boolean) => void;
  isPaperThemeModalOpen: boolean;
  isRepeatPageOpen: boolean;
  setIsRepeatPageOpen: (val: boolean) => void;
  setIsPaperThemeModalOpen: (val: boolean) => void;
  
  // Notifications
  reminders: DailyReminder[];
  toggleReminder: (id: string) => void;
  toastMessage: { title: string; body: string } | null;
  showToast: (title: string, body: string) => void;
  closeToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_REMINDERS: DailyReminder[] = [
  {
    id: 'rem-morning',
    titleAr: 'أذكار الصباح',
    titleEn: 'Morning Athkar Reminder',
    time: '06:30',
    category: 'morning',
    enabled: true
  },
  {
    id: 'rem-evening',
    titleAr: 'أذكار المساء',
    titleEn: 'Evening Athkar Reminder',
    time: '17:30',
    category: 'evening',
    enabled: true
  },
  {
    id: 'rem-sleep',
    titleAr: 'أذكار النوم وسورة الملك',
    titleEn: 'Sleep Athkar & Surah Al-Mulk',
    time: '22:30',
    category: 'sleep',
    enabled: true
  },
  {
    id: 'rem-istighfar',
    titleAr: 'الاستغفار والتسبيح اليومي',
    titleEn: 'Daily Tasbih & Istighfar',
    time: '14:00',
    category: 'tasbih',
    enabled: false
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('sakinah_lang') as Language) || 'ar';
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    return (localStorage.getItem('sakinah_theme') as ThemeMode) || 'dark';
  });

  const [fontFamily, setFontFamilyState] = useState<ArabicFont>(() => {
    return (localStorage.getItem('sakinah_font') as ArabicFont) || 'amiri';
  });

  const [fontSize, setFontSizeState] = useState<FontSize>(() => {
    return (localStorage.getItem('sakinah_font_size') as FontSize) || 'md';
  });

  const [quranPaperTheme, setQuranPaperThemeState] = useState<QuranPaperThemeId>(() => {
    return (localStorage.getItem('sakinah_quran_paper_theme') as QuranPaperThemeId) || 'cream';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedAthkarCategoryId, setSelectedAthkarCategoryId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<BookChapter | null>(null);

  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('sakinah_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  // Offline Saved Books
  const [offlineBookIds, setOfflineBookIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('sakinah_offline_books');
    return saved ? JSON.parse(saved) : ['nawawi-40'];
  });

  // Dhikr Counter Global Stats
  const [totalDhikrCount, setTotalDhikrCount] = useState<number>(() => {
    const saved = localStorage.getItem('sakinah_total_dhikr');
    return saved ? parseInt(saved, 10) : 108;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sakinah_sound') !== 'false';
  });

  const [vibrationEnabled, setVibrationEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('sakinah_vibe') !== 'false';
  });

  const setVibrationEnabled = (val: boolean) => {
    setVibrationEnabledState(val);
    localStorage.setItem('sakinah_vibe', val ? 'true' : 'false');
  };

  // Reminders
  const [reminders, setReminders] = useState<DailyReminder[]>(() => {
    const saved = localStorage.getItem('sakinah_reminders');
    return saved ? JSON.parse(saved) : DEFAULT_REMINDERS;
  });

  // Modals & Focus Mode
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFontSettingsOpen, setIsFontSettingsOpen] = useState(false);
  const [isNotificationSettingsOpen, setIsNotificationSettingsOpen] = useState(false);
  const [isPaperThemeModalOpen, setIsPaperThemeModalOpen] = useState(false);
  const [isRepeatPageOpen, setIsRepeatPageOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; body: string } | null>(null);

  // Sync Language & RTL/LTR
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sakinah_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const setTheme = (t: ThemeMode) => {
    setThemeState(t);
    localStorage.setItem('sakinah_theme', t);
  };

  const setFontFamily = (f: ArabicFont) => {
    setFontFamilyState(f);
    localStorage.setItem('sakinah_font', f);
  };

  const setFontSize = (s: FontSize) => {
    setFontSizeState(s);
    localStorage.setItem('sakinah_font_size', s);
  };

  const setQuranPaperTheme = (p: QuranPaperThemeId) => {
    setQuranPaperThemeState(p);
    localStorage.setItem('sakinah_quran_paper_theme', p);
  };

  const addBookmark = (item: Omit<Bookmark, 'id' | 'dateAdded'>) => {
    const newBookmark: Bookmark = {
      ...item,
      id: 'bm_' + Date.now(),
      dateAdded: new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')
    };
    const updated = [newBookmark, ...bookmarks.filter((b) => b.targetId !== item.targetId)];
    setBookmarks(updated);
    localStorage.setItem('sakinah_bookmarks', JSON.stringify(updated));
    showToast(
      language === 'ar' ? 'تمت الإضافة للمفضلة' : 'Saved to Bookmarks',
      language === 'ar' ? `تم حفظ "${item.titleAr}" بنجاح.` : `Saved "${item.titleEn}" successfully.`
    );
  };

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id && b.targetId !== id);
    setBookmarks(updated);
    localStorage.setItem('sakinah_bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (targetId: string) => {
    return bookmarks.some((b) => b.targetId === targetId || b.id === targetId);
  };

  const toggleOfflineBook = (bookId: string) => {
    let updated: string[];
    const isOffline = offlineBookIds.includes(bookId);
    if (isOffline) {
      updated = offlineBookIds.filter((id) => id !== bookId);
      showToast(
        language === 'ar' ? 'إزالة من التخزين' : 'Removed from Offline',
        language === 'ar' ? 'تمت إزالة الكتاب من التخزين دون اتصال.' : 'Book removed from offline storage.'
      );
    } else {
      updated = [...offlineBookIds, bookId];
      const targetBook = BOOKS_DATA.find((b) => b.id === bookId);
      showToast(
        language === 'ar' ? 'تم الحفظ للقراءة دون اتصال' : 'Saved for Offline Reading',
        language === 'ar'
          ? `تم حفظ كتاب "${targetBook?.titleAr || ''}" بنجاح.`
          : `Book "${targetBook?.titleEn || ''}" is now accessible offline.`
      );
    }
    setOfflineBookIds(updated);
    localStorage.setItem('sakinah_offline_books', JSON.stringify(updated));
  };

  const isBookOffline = (bookId: string) => {
    return offlineBookIds.includes(bookId);
  };

  const incrementGlobalDhikr = () => {
    setTotalDhikrCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('sakinah_total_dhikr', next.toString());
      return next;
    });
  };

  const toggleReminder = (id: string) => {
    const updated = reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r));
    setReminders(updated);
    localStorage.setItem('sakinah_reminders', JSON.stringify(updated));
  };

  const showToast = (title: string, body: string) => {
    setToastMessage({ title, body });
    setTimeout(() => {
      setToastMessage(null);
    }, 3800);
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        fontFamily,
        setFontFamily,
        fontSize,
        setFontSize,
        quranPaperTheme,
        setQuranPaperTheme,
        activeTab,
        setActiveTab,
        selectedAthkarCategoryId,
        setSelectedAthkarCategoryId,
        selectedBook,
        setSelectedBook,
        selectedChapter,
        setSelectedChapter,
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        offlineBookIds,
        toggleOfflineBook,
        isBookOffline,
        totalDhikrCount,
        incrementGlobalDhikr,
        soundEnabled,
        setSoundEnabled,
        vibrationEnabled,
        setVibrationEnabled,
        isFocusMode,
        setIsFocusMode,
        isSearchOpen,
        setIsSearchOpen,
        isFontSettingsOpen,
        setIsFontSettingsOpen,
        isNotificationSettingsOpen,
        setIsNotificationSettingsOpen,
        isPaperThemeModalOpen,
        setIsPaperThemeModalOpen,
        isRepeatPageOpen,
        setIsRepeatPageOpen,
        reminders,
        toggleReminder,
        toastMessage,
        showToast,
        closeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
