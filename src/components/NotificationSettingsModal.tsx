import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Bell, BellRing, X, Check, Clock, Sparkles, Play, Square, Volume2, Timer } from 'lucide-react';
import { GlassButton } from './GlassButton';
import { soundEngine, triggerHaptic } from '../utils/audio';
import { salawatService, SALAWAT_VOICES, SalawatVoice } from '../utils/salawatService';

export const NotificationSettingsModal: React.FC = () => {
  const {
    language,
    theme,
    isNotificationSettingsOpen,
    setIsNotificationSettingsOpen,
    reminders,
    toggleReminder,
    showToast
  } = useApp();

  const [selectedVoiceId, setSelectedVoiceId] = useState<string>(() => {
    return salawatService.getCurrentVoiceId();
  });
  const [isSalawatPlaying, setIsSalawatPlaying] = useState<boolean>(
    salawatService.getIsPlaying()
  );
  const [periodicMinutes, setPeriodicMinutes] = useState<number>(() => {
    return salawatService.getPeriodicMinutes();
  });

  useEffect(() => {
    const unsubscribe = salawatService.subscribe((playing, voiceId) => {
      setIsSalawatPlaying(playing);
      setSelectedVoiceId(voiceId);
    });
    return unsubscribe;
  }, []);

  const handleVoiceChange = (voice: SalawatVoice) => {
    setSelectedVoiceId(voice.id);
    salawatService.setCurrentVoiceId(voice.id);
    if (soundEnabledGlobal) soundEngine.playClick();
  };

  const handlePlaySalawat = async (voiceId: string) => {
    soundEngine.playClick();
    triggerHaptic(15);
    const success = await salawatService.playSalawat(voiceId);
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

  const soundEnabledGlobal = true; // safe fallback

  const handleTestNotification = (title: string, desc: string) => {
    soundEngine.playCompletion();

    // Check if Browser notifications are permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: desc,
        icon: '/favicon.ico'
      });
    }

    showToast(
      language === 'ar' ? 'تنبيه الأذكار التجريبي 🔔' : 'Athkar Reminder Test 🔔',
      desc
    );
  };

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        showToast(
          language === 'ar' ? 'تم تفعيل الإشعارات' : 'Notifications Enabled',
          language === 'ar' ? 'ستصلك التذكيرات اليومية في أوقاتها المحددة.' : 'You will receive scheduled Athkar alerts.'
        );
      }
    }
  };

  return (
    <AnimatePresence>
      {isNotificationSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsNotificationSettingsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-lg rounded-3xl p-6 border shadow-2xl z-10 max-h-[90vh] overflow-y-auto ${
              theme === 'light'
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
                : theme === 'sepia'
                ? 'bg-[#2b1f17]/95 border-amber-800/40 text-amber-50 shadow-black/60'
                : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-black/80'
            }`}
          >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
                <BellRing className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-cairo">
                  {language === 'ar' ? 'جدول التنبيهات والأذكار اليومية' : 'Daily Athkar & Invocations Alerts'}
                </h3>
                <p className="text-xs opacity-70 font-cairo">
                  {language === 'ar' ? 'تذكيرات ذكية لحفظ أورادك وأوقات الذكر' : 'Smart reminders to keep your daily spiritual fortress'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsNotificationSettingsOpen(false)}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {/* System Permission Banner */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold font-cairo text-emerald-400">
                    {language === 'ar' ? 'إشعارات المتصفح والهاتف' : 'Browser & Device Alerts'}
                  </h4>
                  <p className="text-xs opacity-80 font-cairo">
                    {language === 'ar'
                      ? 'فعّل الإذن لتصلك التنبيهات حتى خارج التطبيق'
                      : 'Enable permissions to receive Athkar push notifications'}
                  </p>
                </div>
              </div>

              <GlassButton size="sm" variant="accent" onClick={requestBrowserPermission}>
                {language === 'ar' ? 'تفعيل' : 'Allow'}
              </GlassButton>
            </div>

            {/* 💖 Salawat Voice Selection Panel */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-sm font-bold font-cairo text-amber-300">
                    {language === 'ar' ? 'صوت التذكير بالصلاة على النبي ﷺ' : 'Salawat Reminder Reciter'}
                  </h4>
                  <p className="text-[10px] opacity-80 font-cairo text-slate-400">
                    {language === 'ar' ? 'اختر الصوت المفضل وتوقيت التذكير التلقائي' : 'Choose your preferred voice & interval'}
                  </p>
                </div>
              </div>

              {/* Reciter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                {SALAWAT_VOICES.map((v) => {
                  const isSelected = v.id === selectedVoiceId;
                  const isThisVoicePlaying = isSalawatPlaying && isSelected;
                  return (
                    <div
                      key={v.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'border-amber-400 bg-amber-500/15 text-amber-100'
                          : 'border-white/5 bg-slate-900/40 hover:bg-white/5 text-slate-300'
                      }`}
                    >
                      <button
                        onClick={() => handleVoiceChange(v)}
                        className="flex items-center gap-2 flex-1 text-right min-w-0 cursor-pointer"
                      >
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-slate-600'}`} />
                        <div className="min-w-0">
                          <span className="text-xs font-bold font-cairo block truncate">
                            {language === 'ar' ? v.nameAr : v.nameEn}
                          </span>
                        </div>
                      </button>

                      {/* Play/Stop Button for each voice */}
                      <button
                        onClick={() => {
                          if (isThisVoicePlaying) {
                            handleStopSalawat();
                          } else {
                            handlePlaySalawat(v.id);
                          }
                        }}
                        className={`p-1.5 rounded-lg shrink-0 transition-colors flex items-center justify-center cursor-pointer ${
                          isThisVoicePlaying
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30'
                        }`}
                        title={isThisVoicePlaying ? 'إيقاف' : 'استماع'}
                      >
                        {isThisVoicePlaying ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Periodic timer inside modal */}
              <div className="pt-2 border-t border-white/5 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-cairo">
                    {language === 'ar' ? 'معدل التكرار التلقائي:' : 'Reminder Interval:'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[0, 15, 30, 60].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => handleSetPeriodic(mins)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold font-cairo transition-all cursor-pointer ${
                        periodicMinutes === mins
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mins === 0 ? (language === 'ar' ? 'معطّل' : 'Off') : `${mins} ${language === 'ar' ? 'دقائق' : 'min'}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reminders List */}
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                    reminder.enabled
                      ? 'border-emerald-500/40 bg-emerald-500/10'
                      : 'border-white/10 bg-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl ${
                        reminder.enabled
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold font-cairo">
                        {language === 'ar' ? reminder.titleAr : reminder.titleEn}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs opacity-75 mt-0.5 font-cairo">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{reminder.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleTestNotification(
                          language === 'ar' ? reminder.titleAr : reminder.titleEn,
                          language === 'ar'
                            ? `حان وقت ${reminder.titleAr} المباركة، نفعك الله ببركتها.`
                            : `Time for ${reminder.titleEn}. May Allah bless your day.`
                        )
                      }
                      title={language === 'ar' ? 'تجربة التنبيه' : 'Test Reminder'}
                      className="px-2.5 py-1.5 text-xs rounded-xl bg-white/10 hover:bg-white/20 transition-all font-cairo"
                    >
                      {language === 'ar' ? 'تجربة' : 'Test'}
                    </button>

                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`w-12 h-7 rounded-full transition-colors relative cursor-pointer ${
                        reminder.enabled ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        animate={{ x: reminder.enabled ? (language === 'ar' ? -22 : 22) : 2 }}
                        className="w-5 h-5 rounded-full bg-white shadow-md absolute top-1 left-1"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
            <GlassButton variant="primary" onClick={() => setIsNotificationSettingsOpen(false)}>
              <Check className="w-4 h-4" />
              <span>{language === 'ar' ? 'تم' : 'Done'}</span>
            </GlassButton>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
