import { QuranAyah } from '../types';
import { RECITERS_LIST } from '../data/reciters';

// Embedded offline cache for immediate instant testing & fallback for common surahs
const EMBEDDED_FALLBACKS: Record<number, { text: string; translation: string }[]> = {
  1: [
    { text: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful." },
    { text: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ", translation: "[All] praise is [due] to Allah, Lord of the worlds -" },
    { text: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ", translation: "The Entirely Merciful, the Especially Merciful," },
    { text: "مَٰلِكِ يَوْمِ ٱلدِّينِ", translation: "Sovereign of the Day of Recompense." },
    { text: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "It is You we worship and You we ask for help." },
    { text: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ", translation: "Guide us to the straight path -" },
    { text: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray." }
  ],
  112: [
    { text: "قُلْ هُوَ ٱللَّهُ أَحَدٌ", translation: "Say, 'He is Allah, [who is] One,'" },
    { text: "ٱللَّهُ ٱلصَّمَدُ", translation: "Allah, the Eternal Refuge." },
    { text: "لَمْ يَلِدْ وَلَمْ يُولَدْ", translation: "He neither begets nor is born," },
    { text: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ", translation: "Nor is there to Him any equivalent.'" }
  ],
  113: [
    { text: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ", translation: "Say, 'I seek refuge in the Lord of daybreak'" },
    { text: "مِن شَرِّ مَا خَلَقَ", translation: "From the evil of that which He created" },
    { text: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", translation: "And from the evil of darkness when it settles" },
    { text: "وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلْعُقَدِ", translation: "And from the evil of the blowers in knots" },
    { text: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", translation: "And from the evil of an envier when he envies.'" }
  ],
  114: [
    { text: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ", translation: "Say, 'I seek refuge in the Lord of mankind,'" },
    { text: "مَلِكِ ٱلنَّاسِ", translation: "The Sovereign of mankind," },
    { text: "إِلَٰهِ ٱلنَّاسِ", translation: "The God of mankind," },
    { text: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ", translation: "From the evil of the retreating whisperer -" },
    { text: "ٱلَّذِي يُوَسْوِسُ فِي صُدُورِ ٱلنَّاسِ", translation: "Who whispers [evil] into the breasts of mankind -" },
    { text: "مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ", translation: "From among the jinn and mankind.'" }
  ]
};

const SURAH_AYAH_COUNTS = [
  7, 286, 200, 176, 120, 165, 206, 75, 129, 109, // 1-10
  123, 111, 43, 52, 99, 128, 111, 110, 98, 135, // 11-20
  112, 78, 118, 64, 77, 227, 93, 88, 69, 60, // 21-30
  34, 30, 73, 54, 45, 83, 182, 88, 75, 85, // 31-40
  54, 53, 89, 59, 37, 35, 38, 29, 18, 45, // 41-50
  60, 49, 62, 55, 78, 96, 29, 22, 24, 13, // 51-60
  14, 11, 11, 18, 12, 12, 30, 52, 52, 44, // 61-70
  28, 28, 20, 56, 40, 31, 50, 40, 46, 42, // 71-80
  29, 19, 36, 25, 22, 17, 19, 26, 30, 20, // 81-90
  15, 21, 11, 8, 8, 19, 5, 8, 8, 11, // 91-100
  11, 8, 3, 9, 5, 4, 7, 3, 6, 3, // 101-110
  6, 3, 5, 6 // 111-114
];

export function getAbsoluteAyahNumber(surahNumber: number, ayahNumber: number): number {
  let absolute = 0;
  for (let i = 0; i < surahNumber - 1; i++) {
    absolute += SURAH_AYAH_COUNTS[i];
  }
  return absolute + ayahNumber;
}

export function getAlQuranAudioUrl(surahNumber: number, ayahNumber: number, editionIdentifier: string): string {
  const absoluteAyahNumber = getAbsoluteAyahNumber(surahNumber, ayahNumber);
  return `https://cdn.islamic.network/quran/audio/128/${editionIdentifier}/${absoluteAyahNumber}.mp3`;
}

// Build EveryAyah audio URL for any verse (Full CORS support & fast BunnyCDN)
export function getEveryAyahAudioUrl(surahNumber: number, ayahNumber: number, reciterFolder = 'Alafasy_128kbps'): string {
  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/${reciterFolder}/${s}${a}.mp3`;
}

// Fetch authentic Quran verses with Arabic, English, and Audio
export async function fetchQuranVerses(
  surahNumber: number,
  startAyah: number,
  ayahCount: number,
  reciterId: string
): Promise<QuranAyah[]> {
  const reciter = RECITERS_LIST.find((r) => r.id === reciterId) || RECITERS_LIST[0];
  const audioSource = reciter.audioSourceType || (reciter.everyAyahSubfolder ? 'everyayah' : 'alquran');
  const everyAyahFolder = reciter.everyAyahSubfolder || 'Alafasy_128kbps';

  // Strategy 1: Fast Quran.com v4 API (Official, CDN-cached, full CORS)
  try {
    const qdcUrl = `https://api.quran.com/api/v4/verses/by_chapter/${surahNumber}?language=en&words=false&translations=20&fields=text_uthmani&page=1&per_page=300`;
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(qdcUrl, { signal: ctrl.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.verses) && json.verses.length > 0) {
        const allVerses = json.verses;
        const startIndex = Math.max(0, startAyah - 1);
        const selected = allVerses.slice(startIndex, startIndex + ayahCount);

        const verses: QuranAyah[] = selected.map((v: { verse_number: number; text_uthmani: string; translations?: { text: string }[] }) => {
          const rawTrans = v.translations?.[0]?.text || '';
          // Strip HTML tags like <sup foot_note=...>
          const cleanTrans = rawTrans.replace(/<[^>]*>/g, '').trim();
          const audioUrl = audioSource === 'alquran'
            ? getAlQuranAudioUrl(surahNumber, v.verse_number, reciter.edition)
            : getEveryAyahAudioUrl(surahNumber, v.verse_number, everyAyahFolder);
          return {
            number: v.verse_number,
            numberInSurah: v.verse_number,
            text: v.text_uthmani.trim(),
            translation: cleanTrans,
            audioUrl: audioUrl
          };
        });

        return await measureAudioDurations(verses);
      }
    }
  } catch (err) {
    console.warn('Quran.com API fetch failed or timed out, trying AlQuran Cloud:', err);
  }

  // Strategy 2: AlQuran Cloud API
  try {
    const endpoint = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
    const ctrl = new AbortController();
    const timeoutId = setTimeout(() => ctrl.abort(), 4000);
    const response = await fetch(endpoint, { signal: ctrl.signal });
    clearTimeout(timeoutId);
    
    if (response.ok) {
      const data = await response.json();
      if (data.code === 200 && Array.isArray(data.data) && data.data.length >= 2) {
        const arabicEd = data.data[0];
        const englishEd = data.data[1];

        const startIndex = Math.max(0, startAyah - 1);
        const endIndex = Math.min(startIndex + ayahCount, arabicEd.ayahs.length);
        const verses: QuranAyah[] = [];

        for (let i = startIndex; i < endIndex; i++) {
          const arAyah = arabicEd.ayahs[i];
          const enAyah = englishEd.ayahs[i];
          const audioUrl = audioSource === 'alquran'
            ? getAlQuranAudioUrl(surahNumber, arAyah.numberInSurah, reciter.edition)
            : getEveryAyahAudioUrl(surahNumber, arAyah.numberInSurah, everyAyahFolder);
          verses.push({
            number: arAyah.number,
            numberInSurah: arAyah.numberInSurah,
            text: arAyah.text,
            translation: enAyah?.text || '',
            audioUrl: audioUrl
          });
        }

        return await measureAudioDurations(verses);
      }
    }
  } catch (err) {
    console.warn('AlQuran Cloud API fetch failed, falling back to embedded/generated verses:', err);
  }

  // Strategy 3: Embedded Fallbacks for common Surahs
  const verses: QuranAyah[] = [];
  const embedded = EMBEDDED_FALLBACKS[surahNumber];

  for (let i = 0; i < ayahCount; i++) {
    const ayahNumInSurah = startAyah + i;
    const fallbackItem = embedded ? embedded[ayahNumInSurah - 1] : null;
    const audioUrl = audioSource === 'alquran'
      ? getAlQuranAudioUrl(surahNumber, ayahNumInSurah, reciter.edition)
      : getEveryAyahAudioUrl(surahNumber, ayahNumInSurah, everyAyahFolder);

    verses.push({
      number: ayahNumInSurah,
      numberInSurah: ayahNumInSurah,
      text: fallbackItem ? fallbackItem.text : `آية كريمة رقم (${ayahNumInSurah})`,
      translation: fallbackItem ? fallbackItem.translation : `Verse ${ayahNumInSurah}`,
      audioUrl: audioUrl
    });
  }

  return await measureAudioDurations(verses);
}

// Cache probed audio durations in memory so repeated requests don't need re-fetching
const audioDurationCache = new Map<string, number>();

export function updateCachedAudioDuration(url: string, duration: number) {
  if (duration > 0 && isFinite(duration)) {
    audioDurationCache.set(url, duration);
  }
}

// Measure audio duration for each ayah so synchronization is exact
async function measureAudioDurations(verses: QuranAyah[]): Promise<QuranAyah[]> {
  const measured = await Promise.all(
    verses.map(async (v) => {
      // Check cache first
      if (audioDurationCache.has(v.audioUrl)) {
        return { ...v, duration: audioDurationCache.get(v.audioUrl)! };
      }

      try {
        const duration = await probeAudioDuration(v.audioUrl);
        if (duration > 0) {
          audioDurationCache.set(v.audioUrl, duration);
          return { ...v, duration };
        }
        return { ...v, duration: estimateDurationFromText(v.text) };
      } catch {
        return { ...v, duration: estimateDurationFromText(v.text) };
      }
    })
  );
  return measured;
}

// Probe audio duration using an Audio object with a resilient timeout
function probeAudioDuration(url: string, timeoutMs = 8000): Promise<number> {
  return new Promise((resolve) => {
    if (audioDurationCache.has(url)) {
      resolve(audioDurationCache.get(url)!);
      return;
    }

    const audio = new Audio();
    audio.crossOrigin = 'anonymous';
    audio.preload = 'metadata';
    let resolved = false;

    const cleanup = () => {
      audio.onloadedmetadata = null;
      audio.onerror = null;
      audio.src = '';
    };

    const timer = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        cleanup();
        resolve(0);
      }
    }, timeoutMs);

    audio.onloadedmetadata = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        const d = audio.duration;
        cleanup();
        resolve(isFinite(d) && d > 0 ? d : 0);
      }
    };

    audio.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timer);
        cleanup();
        resolve(0);
      }
    };

    audio.src = url;
  });
}

// Estimate realistic recitation duration based on Arabic word count and Tajweed pauses
function estimateDurationFromText(arabicText: string): number {
  const words = arabicText.trim().split(/\s+/).length;
  // Authentic Quranic recitation includes tajweed pauses and elongation (approx 1.1-1.3s per word + 2.0s pause)
  return Math.max(6.0, words * 1.15 + 2.0);
}
