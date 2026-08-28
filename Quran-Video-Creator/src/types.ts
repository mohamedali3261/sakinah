export type Language = 'en' | 'ar';

export type VideoFormat = '9:16' | '16:9' | '1:1';

export type FontSizeOption = 'small' | 'medium' | 'large' | 'extra-large' | 'huge';

export type VerseStyle = 'card' | 'minimal' | 'border' | 'badge' | 'glowing';

export interface SurahMeta {
  number: number;
  name: string; // Arabic name, e.g. "سورة الفاتحة"
  englishName: string; // e.g. "Al-Faatiha"
  englishNameTranslation: string; // e.g. "The Opening"
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface QuranAyah {
  number: number; // Global ayah number
  numberInSurah: number;
  text: string; // Arabic text with diacritics
  translation: string; // English translation
  audioUrl: string; // Audio URL for this specific ayah
  duration?: number; // Duration in seconds
}

export interface Reciter {
  id: string;
  nameEn: string;
  nameAr: string;
  subtextEn: string;
  subtextAr: string;
  edition: string; // e.g. "ar.alafasy"
  everyAyahSubfolder?: string; // fallback
  sampleAyahAudio?: string;
  audioSourceType?: 'everyayah' | 'alquran' | 'fallback';
}

export type BackgroundMediaType = 'video' | 'image';

export interface NatureVideo {
  id: string;
  titleEn: string;
  titleAr: string;
  category: 'forest' | 'water' | 'sky' | 'mountains' | 'rain' | 'desert' | 'waterfall';
  videoUrl: string;
  thumbnailUrl: string;
  authorCredit?: string;
  source?: 'pexels' | 'unsplash' | 'custom';
}

export interface NatureMediaItem {
  id: string;
  type: BackgroundMediaType; // 'video' or 'image'
  titleEn: string;
  titleAr: string;
  category: 'forest' | 'water' | 'sky' | 'mountains' | 'rain' | 'desert' | 'waterfall';
  url: string; // Video MP4 or Image JPG
  thumbnailUrl: string;
  authorCredit?: string;
  source?: 'pexels' | 'unsplash' | 'custom';
}

export interface VideoConfig {
  surahNumber: number;
  startingAyah: number;
  ayahCount: number;
  bgMediaType: BackgroundMediaType; // 'video' | 'image'
  selectedMediaId: string;
  customMediaUrl?: string;
  natureVideoId?: string; // backwards compatibility
  customVideoUrl?: string; // backwards compatibility
  reciterId: string;
  format: VideoFormat;
  showTranslation: boolean;
  showParticles: boolean;
  showSurahHeader?: boolean;
  showVerseNumbers?: boolean;
  fontSize: FontSizeOption;
  verseStyle?: VerseStyle;
  versePosition?: 'bottom' | 'center';
  randomBgMedia?: boolean;
  videoPlaybackSpeed?: number; // e.g. 0.25, 0.5, 0.75, 1.0
  logoUrl?: string; // Base64 data URL or external URL for custom logo overlay
  showLogo?: boolean; // Toggle to show logo on top right
  logoOpacity?: number; // Opacity of the logo (0.0 to 1.0)
  logoSize?: number; // Logo size percentage multiplier (e.g. 50 to 200)
}

export interface GenerationProgress {
  step: 'idle' | 'fetching' | 'loading_media' | 'ready' | 'rendering' | 'completed' | 'error';
  progressPercent: number;
  messageEn: string;
  messageAr: string;
}

export interface RenderedVideoOutput {
  blobUrl: string;
  fileName: string;
  duration: number;
  fileSizeBytes: number;
}
