import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { adhanAudioEngine, AdhanPlayState } from '../utils/adhanAudioEngine';
import { salawatService, SALAWAT_VOICES } from '../utils/salawatService';
import {
  Volume2,
  VolumeX,
  Square,
  Pause,
  Play,
  Sparkles,
  Compass,
  X,
  Radio,
  Heart,
  Music
} from 'lucide-react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const GlobalAdhanPlayer: React.FC = () => {
  const { language, theme, soundEnabled, vibrationEnabled, showToast } = useApp();
  
  // Adhan state
  const [playState, setPlayState] = useState<AdhanPlayState>(adhanAudioEngine.getState());
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [prayerName, setPrayerName] = useState<string>('');
  const [isMuted, setIsMuted] = useState<boolean>(adhanAudioEngine.getIsMuted());

  // Salawat state
  const [isSalawatPlaying, setIsSalawatPlaying] = useState<boolean>(salawatService.getIsPlaying());
  const [salawatVoiceId, setSalawatVoiceId] = useState<string>(salawatService.getCurrentVoiceId());

  useEffect(() => {
    const unsubscribeAdhan = adhanAudioEngine.subscribe((state, prog, dur, pName) => {
      setPlayState(state);
      setProgress(prog);
      setDuration(dur);
      setIsMuted(adhanAudioEngine.getIsMuted());
      if (pName) setPrayerName(pName);
    });

    const unsubscribeSalawat = salawatService.subscribe((playing, vId) => {
      setIsSalawatPlaying(playing);
      setSalawatVoiceId(vId);
    });

    return () => {
      unsubscribeAdhan();
      unsubscribeSalawat();
    };
  }, []);

  const isAdhanActive = playState === 'playing' || playState === 'paused' || playState === 'loading';
  const isVisible = isAdhanActive || isSalawatPlaying;

  if (!isVisible) return null;

  const currentAdhanVoice = adhanAudioEngine.getCurrentVoice();
  const currentSalawatVoice = SALAWAT_VOICES.find((v) => v.id === salawatVoiceId) || SALAWAT_VOICES[0];

  const handleStopAdhan = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(20);
    adhanAudioEngine.stop();
    showToast(
      language === 'ar' ? 'تم إيقاف صوت الأذان ⏹️' : 'Adhan Stopped ⏹️',
      language === 'ar' ? 'تم كتم وإيقاف نداء الصلاة فوراً' : 'Adhan playback terminated'
    );
  };

  const handleStopSalawat = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(20);
    salawatService.stop();
    showToast(
      language === 'ar' ? 'تم إيقاف الصلاة على النبي ﷺ ⏹️' : 'Salawat Stopped ⏹️',
      ''
    );
  };

  const handleStopAll = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(25);
    adhanAudioEngine.stop();
    salawatService.stop();
    showToast(
      language === 'ar' ? 'تم إيقاف جميع الأصوات ⏹️' : 'All Audio Stopped ⏹️',
      ''
    );
  };

  const handleToggleMute = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(12);
    const muted = adhanAudioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleTogglePlay = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(12);
    if (playState === 'playing') {
      adhanAudioEngine.pause();
    } else {
      adhanAudioEngine.resume();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-20 sm:bottom-24 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 pointer-events-auto"
      >
        <div
          className={`p-4 rounded-3xl border-2 shadow-2xl backdrop-blur-2xl transition-all ${
            theme === 'light'
              ? 'bg-slate-900/95 border-emerald-500/50 text-slate-100 shadow-emerald-950/40 ring-1 ring-emerald-500/30'
              : theme === 'sepia'
              ? 'bg-[#22160e]/95 border-amber-500/50 text-amber-50 shadow-black/80 ring-1 ring-amber-500/30'
              : 'bg-slate-950/95 border-emerald-500/50 text-slate-100 shadow-black/90 ring-1 ring-emerald-500/30'
          }`}
        >
          {/* Active Adhan Player View */}
          {isAdhanActive && (
            <div>
              {/* Header Row */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold font-cairo text-emerald-300 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>
                      {prayerName
                        ? language === 'ar'
                          ? `يصدح الآن: أذان ${prayerName} 🕌`
                          : `Now Playing: ${prayerName} Adhan 🕌`
                        : language === 'ar'
                        ? 'يصدح الآن نداء الأذان 🕌'
                        : 'Adhan Call to Prayer'}
                    </span>
                  </span>
                </div>

                <button
                  onClick={handleStopAdhan}
                  title={language === 'ar' ? 'إغلاق وإيقاف' : 'Close and Stop'}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body Info */}
              <div className="flex items-center justify-between gap-3 my-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center justify-center shrink-0 shadow-inner">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold font-cairo text-slate-100 truncate">
                      {language === 'ar' ? currentAdhanVoice.nameAr : currentAdhanVoice.nameEn}
                    </h4>
                    <p className="text-[10px] text-emerald-400/90 font-cairo truncate">
                      {language === 'ar' ? currentAdhanVoice.muezzinAr : currentAdhanVoice.muezzinEn}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Mute Button */}
                  <button
                    onClick={handleToggleMute}
                    title={isMuted ? (language === 'ar' ? 'تشغيل الصوت' : 'Unmute') : (language === 'ar' ? 'كتم الصوت' : 'Mute')}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      isMuted
                        ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
                        : 'bg-white/10 hover:bg-white/15 text-slate-200'
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Pause / Play */}
                  <button
                    onClick={handleTogglePlay}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 transition-all cursor-pointer"
                  >
                    {playState === 'playing' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  {/* STOP ADHAN (Prominent Red Button) */}
                  <button
                    onClick={handleStopAdhan}
                    className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold font-cairo text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/60 border border-rose-400/50 transition-all hover:scale-105 cursor-pointer active:scale-95 animate-pulse"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'ar' ? 'إيقاف الأذان' : 'Stop'}</span>
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 space-y-1">
                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{formatTime(progress)}</span>
                  <span>{duration > 0 ? formatTime(duration) : '--:--'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Salawat Player View */}
          {isSalawatPlaying && !isAdhanActive && (
            <div>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                  <span className="text-xs font-bold font-cairo text-amber-300 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>{language === 'ar' ? 'تلاوة آية الصلاة على النبي ﷺ' : 'Salawat on the Prophet ﷺ'}</span>
                  </span>
                </div>

                <button
                  onClick={handleStopSalawat}
                  title={language === 'ar' ? 'إيقاف' : 'Stop'}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/15 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 my-1">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 flex items-center justify-center shrink-0 shadow-inner">
                    <Heart className="w-5 h-5 text-amber-400 fill-amber-400/30" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold font-cairo text-slate-100 truncate">
                      {language === 'ar' ? currentSalawatVoice.nameAr : currentSalawatVoice.nameEn}
                    </h4>
                    <p className="text-[10px] text-amber-300/90 font-cairo truncate">
                      {currentSalawatVoice.badge || (language === 'ar' ? 'الصلاة والسلام على رسول الله' : 'Peace be upon him')}
                    </p>
                  </div>
                </div>

                {/* STOP SALAWAT Prominent Button */}
                <button
                  onClick={handleStopSalawat}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold font-cairo text-xs flex items-center gap-1.5 shadow-lg shadow-rose-950/60 border border-rose-400/50 transition-all hover:scale-105 cursor-pointer active:scale-95"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{language === 'ar' ? 'إيقاف الصوت' : 'Stop'}</span>
                </button>
              </div>
            </div>
          )}

          {/* If BOTH are playing simultaneously, offer Stop All */}
          {isAdhanActive && isSalawatPlaying && (
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={handleStopAll}
                className="px-3 py-1 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-[11px] font-bold font-cairo cursor-pointer"
              >
                {language === 'ar' ? 'إيقاف جميع الأصوات ⏹️' : 'Stop All Audio'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

