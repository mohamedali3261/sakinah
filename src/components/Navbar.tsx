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
  MoreVertical,
  Layers,
  BookOpen
} from 'lucide-react';
import { GlassButton } from './GlassButton';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    setIsSearchOpen,
    setIsFontSettingsOpen,
    setIsNotificationSettingsOpen,
    setActiveTab,
    bookmarks
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cycleTheme = () => {
    if (theme === 'dark') setTheme('sepia');
    else if (theme === 'sepia') setTheme('light');
    else setTheme('dark');
  };

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 py-1.5 sm:py-2.5 max-w-7xl mx-auto transition-all">
      <nav
        className={`w-full px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl sm:rounded-3xl border backdrop-blur-xl flex items-center justify-between gap-2 sm:gap-3 shadow-md transition-all ${
          theme === 'light'
            ? 'bg-white/90 border-slate-200 shadow-slate-200/40'
            : theme === 'sepia'
            ? 'bg-[#2a1e16]/90 border-amber-800/30 shadow-black/40'
            : 'bg-slate-900/80 border-slate-800/80 shadow-black/60'
        }`}
      >
        {/* Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2 cursor-pointer group select-none shrink-0"
        >
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-base sm:text-lg font-cairo tracking-wide bg-gradient-to-r from-emerald-400 via-teal-200 to-amber-200 bg-clip-text text-transparent">
                {language === 'ar' ? 'سَكِينَة' : 'Sakīnah'}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hidden xs:inline">
                {language === 'ar' ? 'نور' : 'Noor'}
              </span>
            </div>
          </div>
        </div>

        {/* Global Smart Search Bar Trigger (Desktop) */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className={`flex-1 max-w-xs md:max-w-md hidden sm:flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all text-xs font-cairo cursor-pointer ${
            theme === 'light'
              ? 'bg-slate-100/80 border-slate-200 text-slate-500 hover:border-emerald-500/40 hover:bg-white'
              : theme === 'sepia'
              ? 'bg-amber-950/40 border-amber-800/30 text-amber-300/70 hover:border-amber-500/40 hover:bg-amber-950/60'
              : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-emerald-500/40 hover:bg-slate-800/80'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">
              {language === 'ar' ? 'بحث ذكي في القرآن والأذكار...' : 'Search Quran, Athkar, Books...'}
            </span>
          </div>
          <kbd className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono opacity-60">
            ⌘K
          </kbd>
        </button>

        {/* Action Controls - Mobile Optimized */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Quick Search Button (Mobile) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/10 transition-colors cursor-pointer"
            title={language === 'ar' ? 'بحث' : 'Search'}
          >
            <Search className="w-4 h-4 text-emerald-400" />
          </button>

          {/* Quran Direct Header Link */}
          <button
            onClick={() => setActiveTab('quran')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/20 transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'المصحف' : 'Quran'}</span>
          </button>

          {/* Index Direct Header Link */}
          <button
            onClick={() => setActiveTab('index')}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/20 transition-all cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'الفهرس' : 'Index'}</span>
          </button>

          {/* Bookmarks Icon */}
          <button
            onClick={() => setActiveTab('saved')}
            className="relative p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            title={language === 'ar' ? 'المحفوظات' : 'Bookmarks'}
          >
            <BookmarkIcon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
            {bookmarks.length > 0 && (
              <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 text-[8px] font-bold flex items-center justify-center text-slate-950">
                {bookmarks.length}
              </span>
            )}
          </button>

          {/* Font Settings */}
          <button
            onClick={() => setIsFontSettingsOpen(true)}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            title={language === 'ar' ? 'الخط والقراءة' : 'Font Settings'}
          >
            <Type className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-teal-300" />
          </button>

          {/* Notifications Reminders */}
          <button
            onClick={() => setIsNotificationSettingsOpen(true)}
            className="hidden sm:block p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            title={language === 'ar' ? 'التنبيهات' : 'Reminders'}
          >
            <Bell className="w-4 h-4 text-amber-300" />
          </button>

          {/* Theme Quick Toggle */}
          <button
            onClick={cycleTheme}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/10 text-slate-300 transition-colors cursor-pointer"
            title={language === 'ar' ? 'المظهر' : 'Theme'}
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-emerald-400" />
            ) : theme === 'sepia' ? (
              <Flame className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400" />
            ) : (
              <Sun className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-500" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="text-[11px]">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
