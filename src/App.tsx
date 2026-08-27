import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { salawatService } from './utils/salawatService';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { QuranView } from './components/QuranView';
import { AthkarView } from './components/AthkarView';
import { LibraryView } from './components/LibraryView';
import { IndexView } from './components/IndexView';
import { PrayerTimesWidget } from './components/PrayerTimesWidget';
import { BookmarksView } from './components/BookmarksView';
import { SebhaView } from './components/SebhaView';
import { RadioView } from './components/RadioView';
import { SmartSearchModal } from './components/SmartSearchModal';
import { FontSettingsModal } from './components/FontSettingsModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { ToastNotification } from './components/ToastNotification';
import { GlobalAdhanPlayer } from './components/GlobalAdhanPlayer';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import bgImage from './assets/Ghh.jpg';

const MainContent: React.FC = () => {
  const { activeTab, theme, language, isFocusMode } = useApp();
  const [scrollScale, setScrollScale] = useState(1);

  // Dynamic page title based on active tab
  useEffect(() => {
    const titles: Record<string, { ar: string; en: string }> = {
      home: { ar: 'الرئيسية | يَقِين', en: 'Home | Yaqeen' },
      quran: { ar: 'المصحف الشريف | يَقِين', en: 'Quran | Yaqeen' },
      athkar: { ar: 'الأذكار | يَقِين', en: 'Athkar | Yaqeen' },
      library: { ar: 'المكتبة الإسلامية | يَقِين', en: 'Library | Yaqeen' },
      index: { ar: 'الفهرس الشامل | يَقِين', en: 'Full Index | Yaqeen' },
      prayers: { ar: 'مواقيت الصلاة والقبلة | يَقِين', en: 'Prayer Times & Qibla | Yaqeen' },
      saved: { ar: 'المحفوظات والمفضلة | يَقِين', en: 'Saved Bookmarks | Yaqeen' },
      sebha: { ar: 'السبحة الإلكترونية | يَقِين', en: 'Digital Tasbih | Yaqeen' },
      radio: { ar: 'الإذاعات المباشرة | يَقِين', en: 'Live Radio | Yaqeen' },
    };

    const title = titles[activeTab] || titles.home;
    document.title = language === 'ar' ? title.ar : title.en;
  }, [activeTab, language]);

  // Smooth background scroll zoom logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      // Gently scale up to a maximum of 1.25 as the user scrolls
      const targetScale = Math.min(1.25, 1 + scrollY * 0.00018);
      setScrollScale(targetScale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Startup audio greeting: Salawat on the Prophet (صلى الله عليه وسلم)
  useEffect(() => {
    salawatService.armAutoWelcomeSalawat();
  }, []);

  const getThemeBackground = () => {
    switch (theme) {
      case 'light':
        return 'bg-gradient-to-br from-slate-100/90 via-emerald-50/20 to-teal-100/30 text-slate-800';
      case 'sepia':
        return 'bg-gradient-to-br from-[#1a120c]/90 via-[#24170f]/90 to-[#150d08]/95 text-amber-50';
      case 'dark':
      default:
        return 'bg-gradient-to-br from-slate-950/90 via-[#06181b]/92 to-slate-950/90 text-slate-100';
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative flex flex-col font-cairo ${getThemeBackground()}`}
    >
      {/* Hardware-accelerated Scroll-Zoom Background Wrapper */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-150 ease-out"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.86), rgba(15, 23, 42, 0.94)), url(${bgImage})`,
            transform: `scale(${scrollScale})`,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Subtle ambient lighting blobs */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navbar (Hidden seamlessly in Focus Mode) */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="sticky top-0 z-40"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Dynamic View Content */}
      <main
        className={`flex-1 w-full max-w-7xl mx-auto px-3 sm:px-4 transition-all duration-300 ${
          isFocusMode ? 'pt-2 sm:pt-4 pb-8 max-w-4xl' : 'pt-2 sm:pt-4 md:pt-6 pb-12'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {activeTab === 'home' && <HomeView />}
            {activeTab === 'quran' && <QuranView />}
            {activeTab === 'athkar' && <AthkarView />}
            {activeTab === 'library' && <LibraryView />}
            {activeTab === 'index' && <IndexView />}
            {activeTab === 'prayers' && <PrayerTimesWidget />}
            {activeTab === 'saved' && <BookmarksView />}
            {activeTab === 'sebha' && <SebhaView />}
            {activeTab === 'radio' && <RadioView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Interactive Modals & Toast Alerts */}
      <SmartSearchModal />
      <FontSettingsModal />
      <NotificationSettingsModal />
      <ToastNotification />
      <GlobalAdhanPlayer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
