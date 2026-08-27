// Salawat on the Prophet (صلى الله عليه وسلم) Audio & Voice Service
// Verse of Salawat: "إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا" (الأحزاب: 56)

export interface SalawatVoice {
  id: string;
  nameAr: string;
  nameEn: string;
  reciterAr: string;
  reciterEn: string;
  audioUrl: string;
  backupUrls?: string[];
  textAr: string;
  badge?: string;
}

export const SALAWAT_VOICES: SalawatVoice[] = [
  {
    id: 'mishary',
    nameAr: 'الشيخ مشاري راشد العفاسي',
    nameEn: 'Sheikh Mishary Rashid Alafasy',
    reciterAr: 'مشاري العفاسي (سورة الأحزاب: ٥٦)',
    reciterEn: 'Mishary Alafasy (Al-Ahzab: 56)',
    audioUrl: '/audio/salawat/alafasy_033056.mp3',
    backupUrls: [],
    textAr: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا • اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ',
    badge: 'خاشع وعذب'
  },
  {
    id: 'minshawi',
    nameAr: 'فضيلة الشيخ محمد صديق المنشاوي',
    nameEn: 'Sheikh Mohamed Siddiq Al-Minshawi',
    reciterAr: 'محمد صديق المنشاوي (سورة الأحزاب: ٥٦)',
    reciterEn: 'Al-Minshawi (Al-Ahzab: 56)',
    audioUrl: '/audio/salawat/minshawi_033056.mp3',
    backupUrls: [],
    textAr: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا',
    badge: 'الخشوع والبكاء'
  },
  {
    id: 'muaiqly',
    nameAr: 'فضيلة الشيخ ماهر المعيقلي',
    nameEn: 'Sheikh Maher Al-Muaiqly',
    reciterAr: 'ماهر المعيقلي (إمام الحرم المكي)',
    reciterEn: 'Maher Al-Muaiqly',
    audioUrl: '/audio/salawat/muaiqly_033056.mp3',
    backupUrls: [],
    textAr: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا',
    badge: 'صوت الحرم المكي'
  },
  {
    id: 'husary',
    nameAr: 'فضيلة الشيخ محمود خليل الحصري',
    nameEn: 'Sheikh Mahmoud Khalil Al-Husary',
    reciterAr: 'محمود خليل الحصري (سورة الأحزاب: ٥٦)',
    reciterEn: 'Mahmoud Khalil Al-Husary',
    audioUrl: '/audio/salawat/husary_033056.mp3',
    backupUrls: [],
    textAr: 'إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا',
    badge: 'شيخ عموم المقارئ'
  }
];

class SalawatService {
  private activeAudio: HTMLAudioElement | null = null;
  private hasPlayedOnSession: boolean = false;
  private isAutoPlayArmed: boolean = false;
  private isPlaying: boolean = false;
  private currentVoiceId: string = 'mishary'; // Default: Sheikh Mishary Rashid Alafasy
  private periodicInterval: number | null = null;
  private periodicMinutes: number = 0;
  private listeners: Array<(isPlaying: boolean, voiceId: string) => void> = [];

  constructor() {
    this.hasPlayedOnSession = false; // Always allow playing on fresh load/reload!
    try {
      sessionStorage.removeItem('sakinah_salawat_played');
    } catch {}
    const savedVoice = localStorage.getItem('sakinah_salawat_voice');
    if (savedVoice) this.currentVoiceId = savedVoice;

    const savedPeriodic = localStorage.getItem('sakinah_salawat_periodic_min');
    if (savedPeriodic) {
      this.periodicMinutes = parseInt(savedPeriodic, 10);
      if (this.periodicMinutes > 0) {
        this.armPeriodicReminder(this.periodicMinutes);
      }
    }
  }

  public subscribe(listener: (isPlaying: boolean, voiceId: string) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying, this.currentVoiceId));
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getCurrentVoiceId(): string {
    return this.currentVoiceId;
  }

  public setCurrentVoiceId(id: string) {
    this.currentVoiceId = id;
    localStorage.setItem('sakinah_salawat_voice', id);
    this.notify();
  }

  public getPeriodicMinutes(): number {
    return this.periodicMinutes;
  }

  public setPeriodicMinutes(mins: number) {
    this.periodicMinutes = mins;
    localStorage.setItem('sakinah_salawat_periodic_min', mins.toString());
    if (mins > 0) {
      this.armPeriodicReminder(mins);
    } else {
      if (this.periodicInterval) {
        clearInterval(this.periodicInterval);
        this.periodicInterval = null;
      }
    }
  }

  private armPeriodicReminder(minutes: number) {
    if (this.periodicInterval) {
      clearInterval(this.periodicInterval);
      this.periodicInterval = null;
    }
    if (minutes <= 0) return;

    this.periodicInterval = window.setInterval(() => {
      this.playSalawat(this.currentVoiceId);
    }, minutes * 60 * 1000);
  }

  /**
   * Synthesize spoken Arabic Salawat using Web Speech API as a 100% reliable offline fallback
   */
  public speakSalawatViaSpeech(text: string = 'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ'): Promise<boolean> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        this.isPlaying = false;
        this.notify();
        resolve(false);
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.88;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const arVoice = voices.find(
          (v) =>
            v.lang.startsWith('ar') ||
            v.name.toLowerCase().includes('arabic') ||
            v.name.toLowerCase().includes('maged') ||
            v.name.toLowerCase().includes('tariq') ||
            v.name.toLowerCase().includes('laila')
        );
        if (arVoice) {
          utterance.voice = arVoice;
        }

        utterance.onend = () => {
          this.isPlaying = false;
          this.notify();
          resolve(true);
        };
        utterance.onerror = () => {
          this.isPlaying = false;
          this.notify();
          resolve(false);
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        this.isPlaying = false;
        this.notify();
        resolve(false);
      }
    });
  }

  /**
   * Attempt to start playing audio from a single URL cleanly
   */
  private tryPlayAudio(url: string, onEnd?: () => void): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.volume = 0.95;
        audio.crossOrigin = 'anonymous'; // Handle CORS
        this.activeAudio = audio;

        let hasResolved = false;

        const cleanup = () => {
          audio.onplay = null;
          audio.onerror = null;
          audio.onended = null;
          audio.oncanplay = null;
        };

        audio.oncanplay = () => {
          console.log('[Salawat] Audio can play:', url);
        };

        audio.onplay = () => {
          console.log('[Salawat] Audio playing:', url);
          if (!hasResolved) {
            hasResolved = true;
            this.isPlaying = true;
            this.notify();
            resolve(true);
          }
        };

        audio.onended = () => {
          console.log('[Salawat] Audio ended:', url);
          cleanup();
          this.isPlaying = false;
          this.activeAudio = null;
          this.notify();
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.error('[Salawat] Audio error:', url, e);
          cleanup();
          if (!hasResolved) {
            hasResolved = true;
            resolve(false);
          }
        };

        audio.src = url;
        console.log('[Salawat] Attempting to play:', url);
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.error('[Salawat] Play promise rejected:', url, err);
            cleanup();
            if (!hasResolved) {
              hasResolved = true;
              resolve(false);
            }
          });
        }
      } catch (err) {
        console.error('[Salawat] Exception in tryPlayAudio:', err);
        resolve(false);
      }
    });
  }

  /**
   * Play Salawat audio with resilient fallback chain (Primary Audio -> Backup URLs -> Web Speech)
   * Prioritizes real recorded Quranic audio over AI speech synthesis
   */
  public async playSalawat(voiceId?: string, onStart?: () => void, onEnd?: () => void): Promise<boolean> {
    const targetVoiceId = voiceId || this.currentVoiceId;
    this.currentVoiceId = targetVoiceId;
    const selectedVoice = SALAWAT_VOICES.find((v) => v.id === targetVoiceId) || SALAWAT_VOICES[0];

    this.stop();

    this.isPlaying = true;
    this.notify();
    if (onStart) onStart();

    // Try playing genuine Quranic Salawat verse audio files FIRST
    const urlsToTry = [selectedVoice.audioUrl, ...(selectedVoice.backupUrls || [])].filter(Boolean);
    console.log('[Salawat] URLs to try:', urlsToTry);

    for (const url of urlsToTry) {
      const success = await this.tryPlayAudio(url, onEnd);
      if (success) {
        this.hasPlayedOnSession = true;
        sessionStorage.setItem('sakinah_salawat_played', 'true');
        return true;
      }
    }

    console.log('[Salawat] All audio URLs failed, trying Web Speech API');
    // Only use Web Speech API as last resort fallback
    const speechSuccess = await this.speakSalawatViaSpeech(
      'اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ سَيِّدِنَا وَنَبِيِّنَا مُحَمَّدٍ'
    );
    if (speechSuccess) {
      this.hasPlayedOnSession = true;
      sessionStorage.setItem('sakinah_salawat_played', 'true');
      if (onEnd) onEnd();
      return true;
    }

    console.log('[Salawat] All methods failed');
    this.isPlaying = false;
    this.notify();
    if (onEnd) onEnd();
    return false;
  }

  /**
   * Stop any active Salawat audio or speech immediately
   */
  public stop() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
        this.activeAudio.src = '';
      } catch {}
      this.activeAudio = null;
    }
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
    this.isPlaying = false;
    this.notify();
  }

  /**
   * Auto-Welcome Salawat when site loads
   */
  public armAutoWelcomeSalawat(voiceId?: string, onTrigger?: () => void) {
    const isEnabled = localStorage.getItem('sakinah_salawat_on_open') !== 'false';
    if (!isEnabled || this.hasPlayedOnSession || this.isAutoPlayArmed) return;

    this.isAutoPlayArmed = true;
    const targetId = voiceId || this.currentVoiceId;

    const setupFirstInteraction = () => {
      const handleFirstInteraction = () => {
        this.playSalawat(targetId, onTrigger);
        this.isAutoPlayArmed = false;
        window.removeEventListener('click', handleFirstInteraction, true);
        window.removeEventListener('touchstart', handleFirstInteraction, true);
        window.removeEventListener('keydown', handleFirstInteraction, true);
        window.removeEventListener('scroll', handleFirstInteraction, true);
      };

      window.addEventListener('click', handleFirstInteraction, { once: true, capture: true });
      window.addEventListener('touchstart', handleFirstInteraction, { once: true, capture: true });
      window.addEventListener('keydown', handleFirstInteraction, { once: true, capture: true });
      window.addEventListener('scroll', handleFirstInteraction, { once: true, capture: true });
    };

    this.playSalawat(targetId, onTrigger)
      .then((success) => {
        if (success) {
          this.isAutoPlayArmed = false;
        } else {
          setupFirstInteraction();
        }
      })
      .catch(() => {
        setupFirstInteraction();
      });
  }
}

export const salawatService = new SalawatService();

