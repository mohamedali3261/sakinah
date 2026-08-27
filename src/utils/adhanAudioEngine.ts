// Adhan Audio Engine & Playback Controller
import { ADHAN_VOICES, AdhanVoice, DUAA_AFTER_ADHAN } from '../data/adhanData';

export type AdhanPlayState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

class AdhanAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private currentVoiceId: string = 'makkah';
  private currentPrayerName: string = '';
  private state: AdhanPlayState = 'idle';
  private volume: number = 0.9;
  private isMuted: boolean = false;
  private autoAdhanEnabled: boolean = true;
  private mutedPrayers: Record<string, boolean> = {};
  private onStateChangeListeners: Array<(state: AdhanPlayState, progress: number, duration: number, prayerName?: string) => void> = [];
  private updateInterval: number | null = null;

  constructor() {
    const savedVol = localStorage.getItem('sakinah_adhan_volume');
    if (savedVol) {
      this.volume = parseFloat(savedVol);
    }
    const savedAuto = localStorage.getItem('sakinah_auto_adhan_enabled');
    if (savedAuto !== null) {
      this.autoAdhanEnabled = savedAuto === 'true';
    }
    const savedMutedPrayers = localStorage.getItem('sakinah_muted_prayers');
    if (savedMutedPrayers) {
      try {
        this.mutedPrayers = JSON.parse(savedMutedPrayers);
      } catch {}
    }
    const savedVoice = localStorage.getItem('sakinah_adhan_voice_id');
    if (savedVoice) {
      this.currentVoiceId = savedVoice;
    }
  }

  public subscribe(listener: (state: AdhanPlayState, progress: number, duration: number, prayerName?: string) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const progress = this.audio ? this.audio.currentTime : 0;
    const duration = this.audio && !isNaN(this.audio.duration) ? this.audio.duration : 0;
    this.onStateChangeListeners.forEach((l) => l(this.state, progress, duration, this.currentPrayerName));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    localStorage.setItem('sakinah_adhan_volume', this.volume.toString());
    this.notify();
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.audio) {
      this.audio.muted = this.isMuted;
      this.audio.volume = this.isMuted ? 0 : this.volume;
    }
    this.notify();
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.audio) {
      this.audio.muted = muted;
      this.audio.volume = muted ? 0 : this.volume;
    }
    this.notify();
  }

  public isAutoAdhanEnabled(): boolean {
    return this.autoAdhanEnabled;
  }

  public setAutoAdhanEnabled(enabled: boolean) {
    this.autoAdhanEnabled = enabled;
    localStorage.setItem('sakinah_auto_adhan_enabled', enabled ? 'true' : 'false');
    if (!enabled && this.state === 'playing') {
      this.stop();
    }
    this.notify();
  }

  public isPrayerMuted(prayerKey: string): boolean {
    return !!this.mutedPrayers[prayerKey.toLowerCase()];
  }

  public setPrayerMuted(prayerKey: string, muted: boolean) {
    this.mutedPrayers[prayerKey.toLowerCase()] = muted;
    localStorage.setItem('sakinah_muted_prayers', JSON.stringify(this.mutedPrayers));
    this.notify();
  }

  public getCurrentVoiceId(): string {
    return this.currentVoiceId;
  }

  public getCurrentVoice(): AdhanVoice {
    return ADHAN_VOICES.find((v) => v.id === this.currentVoiceId) || ADHAN_VOICES[0];
  }

  public getCurrentPrayerName(): string {
    return this.currentPrayerName;
  }

  public getState(): AdhanPlayState {
    return this.state;
  }

  public isCurrentlyPlaying(): boolean {
    return this.state === 'playing';
  }

  public async playAdhan(voiceId?: string, prayerName?: string, isAutoTrigger: boolean = false): Promise<boolean> {
    if (isAutoTrigger && !this.autoAdhanEnabled) {
      return false;
    }

    if (prayerName && isAutoTrigger && this.isPrayerMuted(prayerName)) {
      return false;
    }

    const targetVoiceId = voiceId || this.currentVoiceId;
    this.currentVoiceId = targetVoiceId;
    localStorage.setItem('sakinah_adhan_voice_id', targetVoiceId);
    if (prayerName) this.currentPrayerName = prayerName;

    const voice = ADHAN_VOICES.find((v) => v.id === targetVoiceId) || ADHAN_VOICES[0];
    const candidateUrls = [voice.audioUrl, ...(voice.backupUrls || [])];

    this.stop();
    this.state = 'loading';
    this.notify();

    for (const url of candidateUrls) {
      try {
        const audio = new Audio();
        audio.src = url;
        audio.volume = this.isMuted ? 0 : this.volume;
        audio.muted = this.isMuted;
        audio.preload = 'auto';

        this.audio = audio;

        audio.onplaying = () => {
          this.state = 'playing';
          this.startProgressTicker();
          this.notify();
        };

        audio.onpause = () => {
          if (this.state === 'playing') {
            this.state = 'paused';
            this.notify();
          }
        };

        audio.onended = () => {
          this.state = 'idle';
          this.currentPrayerName = '';
          this.stopProgressTicker();
          this.notify();
        };

        audio.onerror = (e) => {
          console.warn('Adhan audio candidate failed on url:', url, e);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
          return true;
        }
      } catch (err) {
        console.warn('Could not play adhan from url:', url, err);
      }
    }

    this.state = 'error';
    this.notify();
    return false;
  }

  public pause() {
    if (this.audio && this.state === 'playing') {
      this.audio.pause();
      this.state = 'paused';
      this.notify();
    }
  }

  public resume() {
    if (this.audio && this.state === 'paused') {
      this.audio.play();
      this.state = 'playing';
      this.notify();
    }
  }

  public toggle(voiceId?: string, prayerName?: string) {
    if (this.state === 'playing') {
      this.pause();
    } else if (this.state === 'paused') {
      this.resume();
    } else {
      this.playAdhan(voiceId, prayerName);
    }
  }

  /**
   * Stop active Adhan immediately and completely
   */
  public stop() {
    this.stopProgressTicker();
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
      } catch {}
      this.audio = null;
    }
    this.state = 'idle';
    this.currentPrayerName = '';
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audio && !isNaN(this.audio.duration)) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
      this.notify();
    }
  }

  public async playDuaaAfterAdhan(): Promise<boolean> {
    this.stop();
    try {
      const audio = new Audio(DUAA_AFTER_ADHAN.audioUrl);
      audio.volume = this.isMuted ? 0 : this.volume;
      audio.muted = this.isMuted;
      this.audio = audio;
      this.state = 'playing';
      this.startProgressTicker();
      this.notify();

      audio.onended = () => {
        this.state = 'idle';
        this.stopProgressTicker();
        this.notify();
      };

      await audio.play();
      return true;
    } catch (e) {
      console.warn('Duaa audio playback error:', e);
      this.state = 'error';
      this.notify();
      return false;
    }
  }

  private startProgressTicker() {
    this.stopProgressTicker();
    this.updateInterval = window.setInterval(() => {
      this.notify();
    }, 500);
  }

  private stopProgressTicker() {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
}

export const adhanAudioEngine = new AdhanAudioEngine();

