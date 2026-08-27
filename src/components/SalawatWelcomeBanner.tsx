import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { salawatService, SALAWAT_VOICES, SalawatVoice } from '../utils/salawatService';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Heart,
  RefreshCw,
  X,
  Timer,
  Sliders,
  Square,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const SalawatWelcomeBanner: React.FC = () => {
  const { language, theme, showToast } = useApp();
  const [isPlaying, setIsPlaying] = useState<boolean>(salawatService.getIsPlaying());
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    return salawatService.getCurrentVoiceId();
  });
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('sakinah_salawat_banner_dismissed') === 'true';
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [autoOpenEnabled, setAutoOpenEnabled] = useState<boolean>(() => {
    return localStorage.getItem('sakinah_salawat_on_open') !== 'false';
  });
  const [periodicMinutes, setPeriodicMinutes] = useState<number>(() => {
    return salawatService.getPeriodicMinutes();
  });

  useEffect(() => {
    const unsubscribe = salawatService.subscribe((playing, voiceId) => {
      setIsPlaying(playing);
      setSelectedVoiceId(voiceId);
    });
    return unsubscribe;
  }, []);

  // Arm auto welcome audio on initial mount
  useEffect(() => {
    if (autoOpenEnabled) {
      salawatService.armAutoWelcomeSalawat(selectedVoiceId);
    }
  }, [selectedVoiceId, autoOpenEnabled]);

  const handlePlaySalawat = async (voiceId?: string) => {
    const targetVoiceId = voiceId || selectedVoiceId;
    soundEngine.playClick();
    triggerHaptic(15);

    const success = await salawatService.playSalawat(targetVoiceId);
    if (success) {
      showToast(
        language === 'ar' ? 'صلِّ على النبي ﷺ' : 'Salawat on the Prophet ﷺ',
        language === 'ar' ? 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ' : 'May Allah send blessings upon Muhammad ﷺ'
      );
    }
  };

  const handleStopSalawat = () => {
    soundEngine.playClick();
    triggerHaptic(10);
    salawatService.stop();
  };

  const handleVoiceChange = (voice: SalawatVoice) => {
    setSelectedVoiceId(voice.id);
    salawatService.setCurrentVoiceId(voice.id);
    handlePlaySalawat(voice.id);
  };

  const handleToggleAutoOpen = () => {
    const next = !autoOpenEnabled;
    setAutoOpenEnabled(next);
    localStorage.setItem('sakinah_salawat_on_open', next ? 'true' : 'false');
    showToast(
      next
        ? language === 'ar'
          ? 'تم تفعيل الترحيب بالصلاة على النبي ﷺ'
          : 'Welcome Salawat Enabled'
        : language === 'ar'
        ? 'تم إيقاف الترحيب الصوتي'
        : 'Welcome Audio Disabled',
      ''
    );
  };

  const handleSetPeriodic = (mins: number) => {
    setPeriodicMinutes(mins);
    salawatService.setPeriodicMinutes(mins);
    showToast(
      mins > 0
        ? language === 'ar'
          ? `سيتم التذكير بالصلاة على النبي كل ${mins} دقيقة ⏱️`
          : `Periodic Salawat set every ${mins} mins ⏱️`
        : language === 'ar'
        ? 'تم إيقاف التذكير الدوري'
        : 'Periodic reminder turned off',
      ''
    );
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('sakinah_salawat_banner_dismissed', 'true');
  };

  const currentVoice = SALAWAT_VOICES.find((v) => v.id === selectedVoiceId) || SALAWAT_VOICES[0];

  return (
    <div className="w-full mb-1.5 max-w-xl mx-auto px-1">
      {/* Salawat Golden Welcome Banner */}
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="relative overflow-hidden rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-500/10 via-emerald-500/5 to-amber-500/10 backdrop-blur-md p-1.5 px-2 sm:px-3 shadow-sm shadow-amber-500/2 transition-all"
        >
          {/* Subtle Islamic Golden Radiance Background Accent */}
          <div className="absolute -right-10 -bottom-10 w-16 h-16 bg-amber-400/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -left-10 -top-10 w-16 h-16 bg-emerald-400/5 rounded-full blur-xl pointer-events-none" />

          <div className="relative flex items-center justify-between gap-1.5">
            {/* Left/Right Text and Icon */}
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button
                onClick={() => (isPlaying ? handleStopSalawat() : handlePlaySalawat())}
                className={`relative p-1 rounded-lg border transition-all flex items-center justify-center cursor-pointer shrink-0 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white border-rose-400 shadow-sm animate-pulse'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                }`}
                title={isPlaying ? 'إيقاف الصوت الآن' : 'استمع إلى الصلاة على النبي ﷺ'}
              >
                {isPlaying ? (
                  <Square className="w-3 h-3 fill-current" />
                ) : (
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="text-[7.5px] sm:text-[8.5px] font-bold tracking-wide text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1 py-0.1 rounded whitespace-nowrap">
                    {language === 'ar' ? 'الصلاة على النبي ﷺ' : 'Salawat'}
                  </span>
                  <span className="text-[8px] sm:text-[9.5px] text-amber-200/70 font-medium truncate">
                    {language === 'ar' ? currentVoice.nameAr : currentVoice.nameEn}
                  </span>
                </div>
                <h4 className="text-[10px] sm:text-xs font-bold font-scheherazade text-amber-100 truncate mt-0.5">
                  اللَّهُمَّ صَلِّ وَسَلِّمْ وَبَارِكْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ ﷺ
                </h4>
              </div>
            </div>

            {/* Right/Left Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Settings & Voice Trigger */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-1 px-1.5 rounded-md border text-[9px] font-bold font-cairo flex items-center gap-1 transition-colors cursor-pointer ${
                  showSettings
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/15 text-amber-300'
                }`}
              >
                <Sliders className="w-2.5 h-2.5" />
                <span className="hidden xs:inline">{language === 'ar' ? 'الخيارات' : 'Options'}</span>
              </button>

              {/* Dismiss Button */}
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md text-slate-400 hover:text-amber-300 hover:bg-white/5 transition-colors cursor-pointer"
                title={language === 'ar' ? 'إخفاء' : 'Dismiss'}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Settings & Voice Selector Drawer Accordion */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-amber-500/20 space-y-3"
              >
                {/* Voice Selection */}
                <div>
                  <span className="text-[11px] font-bold font-cairo text-amber-300/90 block mb-1.5">
                    {language === 'ar' ? 'اختر صوت القارئ / المنشد:' : 'Choose Reciter Voice:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {SALAWAT_VOICES.map((v) => {
                      const isSelected = v.id === selectedVoiceId;
                      return (
                        <button
                          key={v.id}
                          onClick={() => handleVoiceChange(v)}
                          className={`p-2 rounded-xl text-right border transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-sm'
                              : 'border-white/5 bg-slate-900/50 hover:bg-white/5 text-slate-300 hover:border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                isSelected ? 'bg-amber-400' : 'bg-slate-600'
                              }`}
                            />
                            <span className="text-xs font-bold font-cairo">
                              {language === 'ar' ? v.nameAr : v.nameEn}
                            </span>
                          </div>
                          {v.badge && (
                            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-md font-cairo">
                              {v.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Auto-Open & Periodic Timer Preferences */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  {/* Auto-Open Toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                    <div>
                      <span className="text-xs font-bold font-cairo text-slate-200 block">
                        {language === 'ar' ? 'تشغيل تلقائي عند الفتح' : 'Auto on Open'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-cairo">
                        {language === 'ar' ? 'صوت ترحيبي عند فتح الموقع' : 'Plays salawat upon entering'}
                      </span>
                    </div>
                    <button
                      onClick={handleToggleAutoOpen}
                      className={`px-3 py-1 rounded-lg text-xs font-bold font-cairo transition-all cursor-pointer ${
                        autoOpenEnabled
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {autoOpenEnabled ? (language === 'ar' ? 'مُفعّل' : 'On') : (language === 'ar' ? 'معطّل' : 'Off')}
                    </button>
                  </div>

                  {/* Periodic Reminder */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
                    <div>
                      <span className="text-xs font-bold font-cairo text-slate-200 block flex items-center gap-1">
                        <Timer className="w-3.5 h-3.5 text-amber-400" />
                        <span>{language === 'ar' ? 'تكرار دوري تلقائي' : 'Periodic Reminder'}</span>
                      </span>
                      <span className="text-[10px] text-slate-400 font-cairo">
                        {language === 'ar' ? 'تذكير بالصلاة على النبي كل فتره' : 'Interval reminder'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      {[0, 15, 30, 60].map((mins) => (
                        <button
                          key={mins}
                          onClick={() => handleSetPeriodic(mins)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold font-cairo transition-all cursor-pointer ${
                            periodicMinutes === mins
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {mins === 0 ? (language === 'ar' ? 'إيقاف' : 'Off') : `${mins}د`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
