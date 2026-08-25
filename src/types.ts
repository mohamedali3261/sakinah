export type Language = 'ar' | 'en';

export type ThemeMode = 'dark' | 'light' | 'sepia';

export type ArabicFont = 'amiri' | 'scheherazade' | 'cairo' | 'tajawal';

export type FontSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ActiveTab = 'home' | 'quran' | 'athkar' | 'library' | 'index' | 'tasbih' | 'prayers' | 'saved';

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
}
