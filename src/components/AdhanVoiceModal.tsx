import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ADHAN_VOICES, AdhanVoice, DUAA_AFTER_ADHAN } from '../data/adhanData';
import { adhanAudioEngine, AdhanPlayState } from '../utils/adhanAudioEngine';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  RotateCcw,
  Check,
  Sparkles,
  Music,
  Radio,
  Sliders,
  X,
  Heart,
  Compass,
  Info,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface AdhanVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedVoiceId: string;
  onSelectVoice: (voiceId: string) => void;
}

export const AdhanVoiceModal: React.FC<AdhanVoiceModalProps> = ({
  isOpen,
  onClose,
  selectedVoiceId,
  onSelectVoice
}) => {
  const { language, theme, showToast } = useApp();
  const [playState, setPlayState] = useState<AdhanPlayState>('idle');
  const [progressSec, setProgressSec] = useState<number>(0);
  const [durationSec, setDurationSec] = useState<number>(0);
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState<number>(adhanAudioEngine.getVolume());
  const [filter, setFilter] = useState<'all' | 'makkah' | 'egypt' | 'fajr'>('all');
  const [isPlayingDuaa, setIsPlayingDuaa] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adhanAudioEngine.subscribe((state, prog, dur) => {
      setPlayState(state);
      setProgressSec(prog);
      setDurationSec(dur);
      if (state === 'idle') {
        setActivePlayingId(null);
        setIsPlayingDuaa(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handlePlayVoice = (voice: AdhanVoice) => {
    soundEngine.playClick();
    triggerHaptic();
    setIsPlayingDuaa(false);

    if (activePlayingId === voice.id && playState === 'playing') {
      adhanAudioEngine.pause();
    } else if (activePlayingId === voice.id && playState === 'paused') {
      adhanAudioEngine.resume();
    } else {
      setActivePlayingId(voice.id);
      adhanAudioEngine.playAdhan(voice.id);
    }
  };

  const handleSelectDefault = (voiceId: string) => {
    soundEngine.playClick();
    triggerHaptic();
    onSelectVoice(voiceId);
    localStorage.setItem('sakinah_adhan_voice', voiceId);
    showToast(
      language === 'ar' ? 'تم تعيين صوت الأذان' : 'Adhan Voice Set',
      language === 'ar' ? 'سيتم تشغيل هذا الصوت المبارك عند مواعيد الصلاة.' : 'This adhan voice will be used for prayer calls.'
    );
  };

  const handlePlayDuaa = () => {
    soundEngine.playClick();
    triggerHaptic();
    setActivePlayingId(null);
    setIsPlayingDuaa(true);
    adhanAudioEngine.playDuaaAfterAdhan();
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    adhanAudioEngine.setVolume(newVol);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const filteredVoices = ADHAN_VOICES.filter((v) => {
    if (filter === 'fajr') return v.isFajrOnly;
    if (filter === 'makkah') return v.id.includes('makkah') || v.id.includes('madinah');
    if (filter === 'egypt') return v.id.includes('abdulbasit') || v.id.includes('rifat') || v.id.includes('egypt');
    return true;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
            theme === 'light'
              ? 'bg-[#fcfaf5] border-amber-300/80 text-slate-800'
              : theme === 'sepia'
              ? 'bg-[#22160f] border-amber-700/60 text-amber-50'
              : 'bg-[#0b161f] border-emerald-500/30 text-slate-100'
          }`}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-md shadow-amber-500/20">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-scheherazade text-amber-400">
                  {language === 'ar' ? 'أصوات ومؤذنو الأذان الشريف' : 'Adhan Voices & Muezzins'}
                </h3>
                <p className="text-xs text-slate-400 font-cairo">
                  {language === 'ar'
                    ? 'اختر صوت المؤذن واستمع للتسجيلات الخاشعة من الحرمين والعالم الإسلامي'
                    : 'Select your preferred muezzin & preview authentic call to prayers'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                adhanAudioEngine.stop();
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Player Progress & Volume Control Toolbar */}
          <div className="p-3 sm:p-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* Status info */}
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  playState === 'playing' ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
                }`}
              />
              <span className="text-xs font-bold font-cairo text-slate-300">
                {playState === 'playing'
                  ? language === 'ar'
                    ? 'جاري الاستماع...'
                    : 'Playing...'
                  : playState === 'loading'
                  ? language === 'ar'
                    ? 'جاري تحميل الصوت...'
                    : 'Loading audio...'
                  : language === 'ar'
                  ? 'جاهز للاستماع'
                  : 'Ready to play'}
              </span>
              {durationSec > 0 && (
                <span className="text-xs text-amber-400/90 font-mono">
                  {formatSeconds(progressSec)} / {formatSeconds(durationSec)}
                </span>
              )}
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleVolumeChange(volume === 0 ? 0.8 : 0)}
                className="p-1 text-slate-400 hover:text-amber-400 cursor-pointer"
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Stop Adhan Button (Active when playing/paused) */}
            {(playState === 'playing' || playState === 'paused' || isPlayingDuaa) && (
              <button
                onClick={() => {
                  adhanAudioEngine.stop();
                  setActivePlayingId(null);
                  setIsPlayingDuaa(false);
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold font-cairo flex items-center gap-1.5 shadow-md shadow-rose-950/50 border border-rose-400/40 cursor-pointer animate-pulse"
                title={language === 'ar' ? 'إيقاف الصوت فوراً' : 'Stop Audio'}
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>{language === 'ar' ? 'إيقاف الصوت' : 'Stop Audio'}</span>
              </button>
            )}

            {/* Duaa After Adhan Quick Button */}
            <button
              onClick={handlePlayDuaa}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer ${
                isPlayingDuaa
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'دعاء ما بعد الأذان' : 'Duaa After Adhan'}</span>
            </button>
          </div>

          {/* Filter Pills */}
          <div className="p-3 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'جميع الأصوات (١١)' : 'All Voices'}
            </button>
            <button
              onClick={() => setFilter('makkah')}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                filter === 'makkah'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'الحرمان الشريفان 🕋' : 'Haramain'}
            </button>
            <button
              onClick={() => setFilter('egypt')}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                filter === 'egypt'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'مصر والأزهر 🇪🇬' : 'Egypt & Azhar'}
            </button>
            <button
              onClick={() => setFilter('fajr')}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-cairo transition-all cursor-pointer whitespace-nowrap ${
                filter === 'fajr'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              {language === 'ar' ? 'أذان الفجر (الصلاة خير من النوم) 🌙' : 'Fajr Adhan'}
            </button>
          </div>

          {/* Voice List */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
            {filteredVoices.map((voice) => {
              const isSelected = voice.id === selectedVoiceId;
              const isCurrentPlaying = activePlayingId === voice.id && playState === 'playing';
              const isCurrentLoading = activePlayingId === voice.id && playState === 'loading';

              return (
                <motion.div
                  key={voice.id}
                  whileHover={{ scale: 1.005 }}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-amber-400/80 bg-amber-500/15 shadow-md shadow-amber-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  {/* Left: Info & Muezzin */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handlePlayVoice(voice)}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                        isCurrentPlaying
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/40 animate-pulse'
                          : isSelected
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-white/10 hover:bg-white/20 text-slate-200 border-white/15'
                      }`}
                      title={isCurrentPlaying ? 'إيقاف مؤقت' : 'استمع إلى الأذان'}
                    >
                      {isCurrentLoading ? (
                        <RotateCcw className="w-5 h-5 animate-spin text-amber-400" />
                      ) : isCurrentPlaying ? (
                        <Pause className="w-5 h-5 text-slate-950" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h4 className="text-base font-bold font-cairo text-slate-100">
                          {language === 'ar' ? voice.nameAr : voice.nameEn}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                          {voice.badge}
                        </span>
                        {voice.maqamAr && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
                            {voice.maqamAr}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-300/90 font-scheherazade mt-0.5">
                        {language === 'ar' ? voice.muezzinAr : voice.muezzinEn}
                      </p>
                      <p className="text-xs text-slate-400 font-cairo line-clamp-2 mt-1">
                        {language === 'ar' ? voice.descriptionAr : voice.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {/* Play/Preview Button */}
                    <button
                      onClick={() => handlePlayVoice(voice)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold font-cairo flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCurrentPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'إيقاف' : 'Pause'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'استماع' : 'Preview'}</span>
                        </>
                      )}
                    </button>

                    {/* Set as Default Button */}
                    <button
                      onClick={() => handleSelectDefault(voice.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-cairo flex items-center gap-1.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                          : 'border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'الصوت المعتمد' : 'Selected'}</span>
                        </>
                      ) : (
                        <span>{language === 'ar' ? 'تعيين كأذان رئيسي' : 'Select'}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Duaa Box Footer */}
          <div className="p-4 border-t border-white/10 bg-amber-500/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <p className="text-xs text-slate-300 font-cairo">
                {language === 'ar'
                  ? 'يُسنّ للمسلم ترديد الأذان خلف المؤذن ثم سؤال الوسيلة للنبي ﷺ.'
                  : 'It is recommended to repeat after the muezzin and make duaa.'}
              </p>
            </div>
            <button
              onClick={() => {
                adhanAudioEngine.stop();
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-bold font-cairo cursor-pointer"
            >
              {language === 'ar' ? 'تم الإغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
