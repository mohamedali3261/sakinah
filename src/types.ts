export type Language = 'ar' | 'en';

export type ThemeMode = 'dark' | 'light' | 'sepia';

export type ArabicFont = 'amiri' | 'scheherazade' | 'cairo' | 'tajawal';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type QuranPaperThemeId = 'cream' | 'antique' | 'dark' | 'emerald' | 'pure_white' | 'warm_amber';

export type ActiveTab = 'home' | 'quran' | 'athkar' | 'library' | 'index' | 'prayers' | 'saved' | 'sebha' | 'radio';

export interface QuranVerse {
  id: number;
  verseNumber: number;
  textAr: string;
  textEn: string;
  translationAr?: string;
  tafsir?: string;
  juz: number;
  page: number;
  audioUrl?: string;
}

export interface QuranSurah {
  number: number;
  nameAr: string;
  nameEn: string;
  englishMeaning: string;
  versesCount: number;
  revelationType: 'Meccan' | 'Medinan';
  revelationOrder: number;
  juzStart: number;
  bismillahPre: boolean;
  verses: QuranVerse[];
}

export interface Reciter {
  id: string;
  nameAr: string;
  nameEn: string;
  serverUrl: string;
}

export interface AthkarItem {
  id: string;
  textAr: string;
  textEn: string;
  transliteration?: string;
  count: number;
  referenceAr?: string;
  referenceEn?: string;
  fadlAr?: string;
  fadlEn?: string;
}

export interface AthkarCategory {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  items: AthkarItem[];
}

export interface BookChapter {
  id: string;
  titleAr: string;
  titleEn: string;
  contentAr: string;
  contentEn: string;
  hadithNumber?: number;
  explanationAr?: string;
  explanationEn?: string;
}

export interface Book {
  id: string;
  titleAr: string;
  titleEn: string;
  authorAr: string;
  authorEn: string;
  category: 'hadith' | 'quran' | 'seerah' | 'tazkiyah' | 'fiqh';
  descriptionAr: string;
  descriptionEn: string;
  chaptersCount: number;
  chapters: BookChapter[];
  colorAccent: string;
}

export interface Bookmark {
  id: string;
  type: 'athkar' | 'hadith' | 'chapter' | 'ayah';
  titleAr: string;
  titleEn: string;
  snippetAr: string;
  snippetEn: string;
  targetId: string;
  parentId?: string;
  dateAdded: string;
  note?: string;
}

export interface DailyReminder {
  id: string;
  titleAr: string;
  titleEn: string;
  time: string; // HH:MM
  category: string;
  enabled: boolean;
}

export interface CityPrayer {
  cityAr: string;
  cityEn: string;
  countryAr: string;
  countryEn: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  qiblaAngle: number;
  latitude?: number;
  longitude?: number;
  timezone?: number;
}

export interface KhatmahPlan {
  id: string;
  title: string;
  durationDays: number; // e.g. 7, 14, 30, 60
  startDate: string; // ISO date string
  totalPages: number; // 604 pages total
  pagesRead: number;
  completedDays: number[]; // Array of completed day indices (0 to durationDays-1)
  dailyTargetPages: number;
  lastReadPage: number;
  isCompleted: boolean;
  notes?: string;
}

export interface TafsirData {
  surahNumber: number;
  verseNumber: number;
  ayahText: string;
  tafsirMuyassar: string;
  tafsirSaadi?: string;
  tafsirIbnKathir?: string;
  difficultWords?: { word: string; meaning: string }[];
}

export interface MemorizationConfig {
  surahNumber: number;
  surahNameAr: string;
  fromAyah: number;
  toAyah: number;
  repeatPerAyah: number; // e.g. 3, 5, 7, 10
  repeatWholeRange: number; // e.g. 1, 3, 5
  delayBetweenRepeatsSec: number; // 0, 1, 2, 3
  reciterId: string;
}
