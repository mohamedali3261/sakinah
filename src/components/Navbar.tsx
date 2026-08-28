import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Moon,
  Sun,
  Flame,
  Globe,
  Type,
  Bell,
  Sparkles,
  Bookmark as BookmarkIcon,
  Layers,
  BookOpen,
  Palette,
  CircleDot,
  Menu,
  X,
  Home,
  Compass,
  Clock,
  Radio,
  Video
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    setIsSearchOpen,
    setIsFontSettingsOpen,
    setIsNotificationSettingsOpen,
    setIsPaperThemeModalOpen,
    activeTab,
    setActiveTab,
    bookmarks,
    soundEnabled,
    vibrationEnabled
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cycleTheme = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    if (theme === 'dark') setTheme('sepia');
    else if (theme === 'sepia') setTheme('light');
    else setTheme('dark');
  };

  const handleLinkClick = (tabId: any) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(12);
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 py-1.5 sm:py-2.5 max-w-7xl mx-auto transition-all">
      <nav
        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl border backdrop-blur-xl flex items-center justify-between gap-2 shadow-md transition-all ${
          theme === 'light'
            ? 'bg-white/90 border-slate-200 shadow-slate-200/40'
            : theme === 'sepia'
            ? 'bg-[#2a1e16]/90 border-amber-800/30 shadow-black/40'
            : 'bg-slate-900/80 border-slate-800/80 shadow-black/60'
        }`}
      >
        {/* Brand Logo & Title */}
        <div
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-7.5 h-7.5 sm:w-8.5 sm:h-8.5 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-base sm:text-lg font-cairo tracking-wide bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                {language === 'ar' ? 'يَقِين' : 'Yaqeen'}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden xs:inline">
                {language === 'ar' ? 'نور' : 'Noor'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items - Desktop (Visible only on Large Screens lg:flex, hidden on Tablets/Mobiles) */}
        <div className="hidden lg:flex items-center gap-1.5">
          {[
            { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Home className="w-3.5 h-3.5" />, activeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
            { id: 'quran', labelAr: 'المصحف', labelEn: 'Quran', icon: <BookOpen className="w-3.5 h-3.5" />, activeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
            { id: 'athkar', labelAr: 'الأذكار', labelEn: 'Athkar', icon: <Sparkles className="w-3.5 h-3.5" />, activeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
            { id: 'library', labelAr: 'المكتبة', labelEn: 'Library', icon: <Compass className="w-3.5 h-3.5" />, activeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25' },
            { id: 'prayers', labelAr: 'المواقيت', labelEn: 'Prayers', icon: <Clock className="w-3.5 h-3.5" />, activeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
            { id: 'radio', labelAr: 'إذاعة', labelEn: 'Radio', icon: <Radio className="w-3.5 h-3.5" />, activeClass: 'bg-teal-500/15 text-teal-400 border-teal-500/25' },
            { id: 'sebha', labelAr: 'المسبحة', labelEn: 'Sebha', icon: <CircleDot className="w-3.5 h-3.5" />, activeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/25' },
            { id: 'video-creator', labelAr: 'صانع الفيديو', labelEn: 'Video Creator', icon: <Video className="w-3.5 h-3.5" />, activeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/25' },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleLinkClick(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer font-cairo ${
                  isActive
                    ? item.activeClass
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{language === 'ar' ? item.labelAr : item.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Global Toolbar Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Search Trigger Icon (Sleek minimalist, always visible) */}
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playClick();
              setIsSearchOpen(true);
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-emerald-400 border border-white/5 transition-all cursor-pointer"
            title={language === 'ar' ? 'البحث الذكي' : 'Smart Search'}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Buttons hidden on Tablet/Mobile but visible on Large Desktop lg:flex */}
          <div className="hidden lg:flex items-center gap-1.5">
            {/* Font Settings */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playClick();
                setIsFontSettingsOpen(true);
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
              title={language === 'ar' ? 'الخط والقراءة' : 'Font Settings'}
            >
              <Type className="w-4.5 h-4.5 text-teal-300" />
            </button>

            {/* Notifications Reminders */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playClick();
                setIsNotificationSettingsOpen(true);
              }}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-300 transition-all cursor-pointer"
              title={language === 'ar' ? 'التنبيهات' : 'Reminders'}
            >
              <Bell className="w-4 h-4 text-amber-300" />
            </button>

            {/* Language Toggle */}
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playClick();
                setLanguage(language === 'ar' ? 'en' : 'ar');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer font-cairo"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
          </div>

          {/* Hamburger Menu Button - Gorgeous Gilded Medallion Style for Tablet/Mobile */}
          <button
            onClick={() => {
              if (soundEnabled) soundEngine.playClick();
              if (vibrationEnabled) triggerHaptic(15);
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden relative p-2.5 rounded-xl border border-amber-500/40 bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-amber-500/10 text-amber-300 hover:text-amber-100 transition-all cursor-pointer shadow-sm overflow-hidden group"
            title={language === 'ar' ? 'القائمة الرئيسية' : 'Main Menu'}
          >
            {/* Islamic Geometric Pattern Aura (Subtle back decor inside the tiny button) */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:8px_8px]" />
            <div className="relative z-10 flex items-center justify-center">
              {isMobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5 stroke-[2.5]" />}
            </div>
          </button>
        </div>
      </nav>

      {/* Gorgeous Responsive Dropdown Drawer with Islamic Arabesque Background Design */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`absolute top-[68px] sm:top-[76px] left-2 right-2 z-50 p-4 sm:p-5 rounded-2xl border shadow-2xl overflow-hidden backdrop-blur-2xl transition-all ${
              theme === 'light'
                ? 'bg-white/95 border-emerald-500/30 text-slate-800'
                : theme === 'sepia'
                ? 'bg-[#211710]/95 border-amber-800/40 text-amber-50'
                : 'bg-slate-950/95 border-emerald-500/30 text-slate-100'
            }`}
          >
            {/* Traditional Golden Islamic Filigree Line Decor */}
            <div className="absolute inset-1 rounded-xl border border-dashed border-amber-500/20 pointer-events-none" />
            <div className="absolute inset-1.5 rounded-xl border border-emerald-500/20 pointer-events-none" />

            {/* Seamless Islamic Geometric Repeating Background Decor */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#d97706_2px,transparent_2px)] [background-size:16px_16px]" />

            {/* Header Ornament decoration */}
            <div className="relative flex justify-center mb-3">
              <svg viewBox="0 0 200 40" className="w-48 h-10 mx-auto drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100,20 C 85,20 70,5 50,15 C 30,25 20,15 5,20" stroke="url(#vignetteGold)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 100,20 C 115,20 130,5 150,15 C 170,25 180,15 195,20" stroke="url(#vignetteGold)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 50,15 C 45,10 40,15 45,20 Z" fill="url(#vignetteGold)" />
                <path d="M 70,12 C 65,7 60,12 65,17 Z" fill="url(#vignetteGold)" />
                <path d="M 25,18 C 20,13 15,18 20,23 Z" fill="url(#vignetteGold)" />
                <path d="M 150,15 C 155,10 160,15 155,20 Z" fill="url(#vignetteGold)" />
                <path d="M 130,12 C 135,7 140,12 135,17 Z" fill="url(#vignetteGold)" />
                <path d="M 175,18 C 180,13 185,18 180,23 Z" fill="url(#vignetteGold)" />
                <path d="M 85,20 C 80,25 75,20 80,15 C 85,10 90,15 85,20 Z" stroke="url(#vignetteGold)" strokeWidth="1" />
                <path d="M 115,20 C 120,25 125,20 120,15 C 115,10 110,15 115,20 Z" stroke="url(#vignetteGold)" strokeWidth="1" />
                <g transform="translate(100, 20)">
                  <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="url(#vignetteGold)" />
                  <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="url(#vignetteGold)" transform="rotate(45)" />
                  <circle cx="0" cy="0" r="2.5" fill="#10b981" />
                  <circle cx="0" cy="0" r="1.2" fill="#FFF9D0" />
                </g>
                <defs>
                  <linearGradient id="vignetteGold" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#854D0E" />
                    <stop offset="30%" stopColor="#FACC15" />
                    <stop offset="50%" stopColor="#FFF9D0" />
                    <stop offset="70%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#854D0E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Drawer Links and Settings */}
            <div className="relative z-10 space-y-4 font-cairo">
              {/* Primary Direct Links */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'home', labelAr: 'الرئيسية', labelEn: 'Home', icon: <Home className="w-5 h-5 text-amber-400" /> },
                  { id: 'quran', labelAr: 'المصحف الشريف', labelEn: 'Holy Quran', icon: <BookOpen className="w-5 h-5 text-emerald-400" /> },
                  { id: 'athkar', labelAr: 'الأذكار والتحصين', labelEn: 'Daily Athkar', icon: <Sparkles className="w-5 h-5 text-amber-300" /> },
                  { id: 'library', labelAr: 'المكتبة الإسلامية', labelEn: 'Islamic Library', icon: <Compass className="w-5 h-5 text-cyan-300" /> },
                  { id: 'radio', labelAr: 'إذاعة القرآن', labelEn: 'Quran Radio', icon: <Radio className="w-5 h-5 text-teal-400" /> },
                  { id: 'prayers', labelAr: 'مواقيت الصلاة', labelEn: 'Prayer Times', icon: <Clock className="w-5 h-5 text-emerald-300" /> },
                  { id: 'sebha', labelAr: 'المسبحة الإلكترونية', labelEn: 'Digital Sebha', icon: <CircleDot className="w-5 h-5 text-indigo-400" /> },
                  { id: 'video-creator', labelAr: 'صانع الفيديو', labelEn: 'Video Creator', icon: <Video className="w-5 h-5 text-purple-400" /> }
                ].map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                        isActive
                          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-bold'
                          : 'border-slate-800/60 bg-slate-900/40 hover:bg-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="text-[11px] font-bold text-center">
                        {language === 'ar' ? item.labelAr : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-800/60 my-2 pt-2" />

              {/* Settings triggers and actions */}
              <div className="space-y-2">
                {/* Font settings */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsFontSettingsOpen(true);
                  }}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Type className="w-4 h-4 text-teal-300" />
                  <span>{language === 'ar' ? 'إعدادات الخط وحجم التلاوة' : 'Font & Text Customization'}</span>
                </button>

                {/* Reminders / Notifications */}
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsNotificationSettingsOpen(true);
                  }}
                  className="w-full px-3.5 py-3 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 flex items-center gap-2.5 text-xs font-bold transition-all cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'تنبيهات الأذكار والسنن' : 'Prayer & Remembrance Reminders'}</span>
                </button>
              </div>

              {/* Language Toggle */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setLanguage(language === 'ar' ? 'en' : 'ar');
                  }}
                  className="w-full p-3 rounded-xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-900/60 flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all"
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
                </button>
              </div>
            </div>

            {/* Footer Ornament decoration */}
            <div className="relative flex justify-center mt-4">
              <svg viewBox="0 0 200 40" className="w-40 h-8 mx-auto drop-shadow-md opacity-80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M 100,20 C 85,20 70,5 50,15 C 30,25 20,15 5,20" stroke="url(#vignetteGold2)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 100,20 C 115,20 130,5 150,15 C 170,25 180,15 195,20" stroke="url(#vignetteGold2)" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M 50,15 C 45,10 40,15 45,20 Z" fill="url(#vignetteGold2)" />
                <path d="M 70,12 C 65,7 60,12 65,17 Z" fill="url(#vignetteGold2)" />
                <path d="M 150,15 C 155,10 160,15 155,20 Z" fill="url(#vignetteGold2)" />
                <path d="M 130,12 C 135,7 140,12 135,17 Z" fill="url(#vignetteGold2)" />
                <g transform="translate(100, 20)">
                  <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="url(#vignetteGold2)" />
                  <path d="M 0,-8 L 2,-2 L 8,0 L 2,2 L 0,8 L -2,2 L -8,0 L -2,-2 Z" fill="url(#vignetteGold2)" transform="rotate(45)" />
                  <circle cx="0" cy="0" r="2.5" fill="#10b981" />
                </g>
                <defs>
                  <linearGradient id="vignetteGold2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#854D0E" />
                    <stop offset="30%" stopColor="#FACC15" />
                    <stop offset="50%" stopColor="#FFF9D0" />
                    <stop offset="70%" stopColor="#FACC15" />
                    <stop offset="100%" stopColor="#854D0E" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
