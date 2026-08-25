import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeView } from './components/HomeView';
import { QuranView } from './components/QuranView';
import { AthkarView } from './components/AthkarView';
import { LibraryView } from './components/LibraryView';
import { IndexView } from './components/IndexView';
import { DigitalTasbih } from './components/DigitalTasbih';
import { PrayerTimesWidget } from './components/PrayerTimesWidget';
import { BookmarksView } from './components/BookmarksView';
import { SmartSearchModal } from './components/SmartSearchModal';
import { FontSettingsModal } from './components/FontSettingsModal';
import { NotificationSettingsModal } from './components/NotificationSettingsModal';
import { ToastNotification } from './components/ToastNotification';
import { motion, AnimatePresence } from 'motion/react';

const MainContent: React.FC = () => {
  const { activeTab, theme, language, isFocusMode } = useApp();

  const getThemeBackground = () => {
    switch (theme) {
      case 'light':
        return 'bg-gradient-to-br from-slate-100 via-emerald-50/30 to-teal-100/40 text-slate-800';
      case 'sepia':
        return 'bg-gradient-to-br from-[#1a120c] via-[#24170f] to-[#150d08] text-amber-50';
      case 'dark':
      default:
        return 'bg-gradient-to-br from-slate-950 via-[#06181b] to-slate-950 text-slate-100';
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 relative flex flex-col font-cairo bg-islamic-pattern ${getThemeBackground()}`}
    >
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
          isFocusMode ? 'pt-2 sm:pt-4 pb-8 max-w-4xl' : 'pt-2 sm:pt-4 md:pt-6 pb-20'
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
            {activeTab === 'tasbih' && <DigitalTasbih />}
            {activeTab === 'prayers' && <PrayerTimesWidget />}
            {activeTab === 'saved' && <BookmarksView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Dock Navigation (Hidden seamlessly in Focus Mode) */}
      <AnimatePresence>
        {!isFocusMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <BottomNav />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Modals & Toast Alerts */}
      <SmartSearchModal />
      <FontSettingsModal />
      <NotificationSettingsModal />
      <ToastNotification />
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
