import React from 'react';
import { useApp } from '../context/AppContext';
// @ts-ignore
import QuranVideoCreatorApp from '../../Quran-Video-Creator/src/App';

export const QuranVideoCreatorWrapper: React.FC = () => {
  const { language, setLanguage } = useApp();

  const handleLangChange = (newLang: 'ar' | 'en') => {
    setLanguage(newLang);
  };

  return (
    <div className="min-h-screen">
      {/* Quran Video Creator App - Navbar and Footer are handled by parent App.tsx */}
      <QuranVideoCreatorApp 
        initialLang={language}
        onLangChange={handleLangChange}
      />
    </div>
  );
};
