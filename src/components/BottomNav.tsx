import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ActiveTab } from '../types';
import {
  Home,
  Sparkles,
  BookOpen,
  CircleDot,
  Clock,
  Bookmark,
  Layers,
  MoreHorizontal,
  X,
  Compass,
  Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language, theme, soundEnabled, vibrationEnabled } = useApp();
  const [isMoreSheetOpen, setIsMoreSheetOpen] = useState(false);

  const primaryNavItems: { id: ActiveTab; labelAr: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Home className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'quran', labelAr: 'المصحف', labelEn: 'Qur\'an', icon: <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'athkar', labelAr: 'الأذكار', labelEn: 'Athkar', icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" /> },
    { id: 'library', labelAr: 'المكتبة', labelEn: 'Library', icon: <Compass className="w-4 h-4 sm:w-5 sm:h-5" /> }
  ];

  const secondaryNavItems: { id: ActiveTab; labelAr: string; labelEn: string; icon: React.ReactNode; descAr: string }[] = [
    { id: 'index', labelAr: 'الفهرس الشامل', labelEn: 'Full Index', icon: <Layers className="w-5 h-5 text-emerald-400" />, descAr: 'فهرس السور والأجزاء والصفحات' },
    { id: 'prayers', labelAr: 'مواقيت الصلاة والقبلة', labelEn: 'Prayer Times & Qibla', icon: <Clock className="w-5 h-5 text-teal-400" />, descAr: 'المواقيت الدقيقة وبوصلة القبلة' },
    { id: 'saved', labelAr: 'المحفوظات والمفضلة', labelEn: 'Saved Bookmarks', icon: <Bookmark className="w-5 h-5 text-amber-400" />, descAr: 'الآيات والأذكار والكتب المحفوظة' },
    { id: 'tasbih', labelAr: 'السبحة الإلكترونية', labelEn: 'Digital Tasbih', icon: <CircleDot className="w-5 h-5 text-rose-400" />, descAr: 'سبحة تفاعلية ثلاثية الأبعاد' },
    { id: 'radio', labelAr: 'الإذاعات المباشرة', labelEn: 'Live Radio', icon: <Radio className="w-5 h-5 text-indigo-400" />, descAr: 'إذاعات القرآن الكريم المباشرة' }
  ];

  const handleTabClick = (tabId: ActiveTab) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(12);
    setActiveTab(tabId);
    setIsMoreSheetOpen(false);
  };

  const isSecondaryActive = ['index', 'prayers', 'saved', 'tasbih', 'radio'].includes(activeTab);

  return (
    <>
      {/* Secondary More Menu Sheet */}
      <AnimatePresence>
        {isMoreSheetOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`w-full max-w-md rounded-3xl p-5 border backdrop-blur-2xl shadow-2xl transition-all ${
                theme === 'light'
                  ? 'bg-white border-slate-200 text-slate-800'
                  : 'bg-slate-900/95 border-slate-800 text-slate-100'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <span className="font-bold text-sm font-cairo">
                  {language === 'ar' ? 'أقسام وخدمات إضافية' : 'More Features & Tools'}
                </span>
                <button
                  onClick={() => setIsMoreSheetOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5">
                {secondaryNavItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                          : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center">
                          {item.icon}
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold font-cairo block">
                            {language === 'ar' ? item.labelAr : item.labelEn}
                          </span>
                          <span className="text-xs text-slate-400">{item.descAr}</span>
                        </div>
                      </div>
                      {isActive && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Ultra-Compact Floating Bottom Dock */}
      <div className="fixed bottom-2.5 inset-x-0 z-40 px-2 sm:px-4 max-w-lg mx-auto pointer-events-none transition-all">
        <nav
          className={`pointer-events-auto p-1 sm:p-1.5 rounded-2xl sm:rounded-full border backdrop-blur-2xl shadow-xl flex items-center justify-between gap-0.5 transition-all ${
            theme === 'light'
              ? 'bg-white/90 border-slate-200 shadow-slate-300/40'
              : theme === 'sepia'
              ? 'bg-[#261b14]/95 border-amber-800/40 shadow-black/80'
              : 'bg-slate-900/90 border-slate-800/90 shadow-black/80'
          }`}
        >
          {primaryNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative flex-1 py-1 sm:py-1.5 px-0.5 flex flex-col items-center justify-center rounded-xl sm:rounded-full transition-all cursor-pointer select-none ${
                  isActive
                    ? 'text-emerald-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Indicator Glow */}
                {isActive && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 rounded-xl sm:rounded-full bg-emerald-500/20 border border-emerald-500/30 shadow-inner shadow-emerald-500/10"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex flex-col items-center">
                  <span className="p-0.5">{item.icon}</span>
                  <span className="text-[9px] sm:text-[10px] font-cairo tracking-tight whitespace-nowrap">
                    {language === 'ar' ? item.labelAr : item.labelEn}
                  </span>
                </div>
              </button>
            );
          })}

          {/* More Toggle Button */}
          <button
            onClick={() => setIsMoreSheetOpen(!isMoreSheetOpen)}
            className={`relative flex-1 py-1 sm:py-1.5 px-0.5 flex flex-col items-center justify-center rounded-xl sm:rounded-full transition-all cursor-pointer select-none ${
              isSecondaryActive
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200 opacity-80 hover:opacity-100'
            }`}
          >
            {isSecondaryActive && (
              <div className="absolute inset-0 rounded-xl sm:rounded-full bg-emerald-500/15 border border-emerald-500/30" />
            )}
            <div className="relative z-10 flex flex-col items-center">
              <span className="p-0.5">
                <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <span className="text-[9px] sm:text-[10px] font-cairo tracking-tight whitespace-nowrap">
                {language === 'ar' ? 'المزيد' : 'More'}
              </span>
            </div>
          </button>
        </nav>
      </div>
    </>
  );
};
