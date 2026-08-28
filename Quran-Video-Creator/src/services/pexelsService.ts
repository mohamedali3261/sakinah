export interface PexelsVideoItem {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string; // thumbnail
  duration: number;
  user: {
    name: string;
    url: string;
  };
  video_files: {
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }[];
}

export interface PexelsPhotoItem {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY || 'jkL8YS4uv9vShlbVCcDiQd2cL1ojHPgH20TA0nwymRfGXma2srfHHyM4';

const AR_TO_EN_MAP: Record<string, string> = {
  شلال: 'waterfall',
  شلالات: 'waterfalls',
  غابة: 'forest',
  غابات: 'forest',
  شجر: 'trees',
  أشجار: 'trees',
  جبل: 'mountain',
  جبال: 'mountains',
  بحر: 'ocean',
  محيط: 'ocean',
  أمواج: 'waves',
  شاطئ: 'beach',
  سماء: 'sky',
  سحب: 'clouds',
  غيوم: 'clouds',
  مطر: 'rain',
  أمطار: 'rain',
  غروب: 'sunset',
  شروق: 'sunrise',
  صحراء: 'desert',
  رمال: 'sand dunes',
  نجوم: 'stars',
  ليل: 'starry night',
  طبيعة: 'nature',
  حديقة: 'green nature',
  زهور: 'flowers',
  ورود: 'flowers',
  ثلج: 'snow mountains',
  جليد: 'ice mountains',
  شتاء: 'winter forest',
  ربيع: 'spring nature',
  خريف: 'autumn forest',
  نهر: 'river',
  بحيرة: 'alpine lake',
  ضباب: 'misty forest',
  فضاء: 'galaxy stars',
  كون: 'space galaxy'
};

export function translateArabicQueryToEnglish(query: string): string {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return 'nature';

  // Smart check for empty streets/cities in Arabic queries
  if (
    trimmed.includes('شوارع') || 
    trimmed.includes('شارع') || 
    trimmed.includes('طريق') || 
    trimmed.includes('طرق') || 
    trimmed.includes('مدينة') || 
    trimmed.includes('مدن')
  ) {
    if (
      trimmed.includes('خال') || 
      trimmed.includes('هدو') || 
      trimmed.includes('بشر') || 
      trimmed.includes('ناس') || 
      trimmed.includes('بدون') || 
      trimmed.includes('فاضي') || 
      trimmed.includes('فارغ')
    ) {
      return 'empty street road no people quiet';
    }
    return 'scenic empty road street';
  }

  // Check direct dictionary match
  if (AR_TO_EN_MAP[trimmed]) {
    return AR_TO_EN_MAP[trimmed];
  }

  // Check partial word matches in dictionary
  const words = trimmed.split(/\s+/);
  const translatedWords = words.map((w) => {
    // Clean Arabic prefixes like 'ال'
    const cleanW = w.startsWith('ال') ? w.slice(2) : w;
    return AR_TO_EN_MAP[cleanW] || AR_TO_EN_MAP[w] || '';
  }).filter(Boolean);

  if (translatedWords.length > 0) {
    return translatedWords.join(' ');
  }

  // If query contains non-ASCII (Arabic) and wasn't found in map, fallback to nature + original
  const isArabic = /[\u0600-\u06FF]/.test(query);
  if (isArabic) {
    return 'nature scenery';
  }

  return query;
}

export async function searchPexelsVideos(query: string, orientation: string = 'portrait', page: number = 1, perPage: number = 80): Promise<PexelsVideoItem[]> {
  const enQuery = translateArabicQueryToEnglish(query);
  const orientationParam = orientation === '16:9' ? 'landscape' : orientation === '1:1' ? 'square' : 'portrait';
  const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(enQuery)}&per_page=${perPage}&page=${page}&orientation=${orientationParam}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    if (!res.ok) {
      throw new Error(`Pexels API error: ${res.status}`);
    }
    const data = await res.json();
    return data.videos || [];
  } catch (err) {
    console.warn('Failed to search Pexels videos, fetching popular videos instead:', err);
    return getPopularPexelsVideos(orientationParam, page, perPage);
  }
}

export async function getPopularPexelsVideos(orientation: string = 'portrait', page: number = 1, perPage: number = 80): Promise<PexelsVideoItem[]> {
  const url = `https://api.pexels.com/videos/popular?per_page=${perPage}&page=${page}&min_width=720`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.videos || [];
  } catch (err) {
    console.error('Error fetching popular Pexels videos:', err);
    return [];
  }
}

export async function searchPexelsPhotos(query: string, orientation: string = 'portrait', page: number = 1, perPage: number = 80): Promise<PexelsPhotoItem[]> {
  const enQuery = translateArabicQueryToEnglish(query);
  const orientationParam = orientation === '16:9' ? 'landscape' : orientation === '1:1' ? 'square' : 'portrait';
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(enQuery)}&per_page=${perPage}&page=${page}&orientation=${orientationParam}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    if (!res.ok) {
      throw new Error(`Pexels API error: ${res.status}`);
    }
    const data = await res.json();
    return data.photos || [];
  } catch (err) {
    console.warn('Failed to search Pexels photos, fetching curated photos instead:', err);
    return getCuratedPexelsPhotos(page, perPage);
  }
}

export async function getCuratedPexelsPhotos(page: number = 1, perPage: number = 80): Promise<PexelsPhotoItem[]> {
  const url = `https://api.pexels.com/v1/curated?per_page=${perPage}&page=${page}`;
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.photos || [];
  } catch (err) {
    console.error('Error fetching curated Pexels photos:', err);
    return [];
  }
}

/**
 * Extracts the best MP4 video link from Pexels video files
 */
export function getBestPexelsVideoUrl(video: PexelsVideoItem): string {
  if (!video.video_files || video.video_files.length === 0) return '';
  // Prefer HD files around 720p - 1080p
  const hdFile = video.video_files.find((f) => f.quality === 'hd' && f.file_type === 'video/mp4')
    || video.video_files.find((f) => f.file_type === 'video/mp4')
    || video.video_files[0];
  return hdFile.link;
}
