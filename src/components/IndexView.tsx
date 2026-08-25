import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SURAHS_METADATA } from '../data/quranData';
import { BOOKS_DATA } from '../data/booksData';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import {
  Compass,
  BookOpen,
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Layers,
  ArrowUpRight,
  Clock,
  Heart,
  CheckCircle2,
  FileText,
  Star
} from 'lucide-react';
import { motion } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

export const IndexView: React.FC = () => {
  const {
    language,
    theme,
    setActiveTab,
    setSelectedAthkarCategoryId,
    setSelectedBook,
    setSelectedChapter,
    soundEnabled,
    vibrationEnabled
  } = useApp();

  const [activeSection, setActiveSection] = useState<'all' | 'quran' | 'athkar' | 'books' | 'sunan'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const navigateToQuran = () => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setActiveTab('quran');
  };

  const navigateToAthkarCategory = (catId: string) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setSelectedAthkarCategoryId(catId);
    setActiveTab('athkar');
  };

  const navigateToBook = (bookId: string) => {
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    const targetBook = BOOKS_DATA.find((b) => b.id === bookId);
    if (targetBook) {
      setSelectedBook(targetBook);
      setSelectedChapter(null);
      setActiveTab('library');
    }
  };

  // Filtered entries
  const query = searchQuery.trim().toLowerCase();

  const filteredSurahs = SURAHS_METADATA.filter(
    (s) =>
      s.nameAr.includes(query) ||
      s.nameEn.toLowerCase().includes(query) ||
      s.number.toString() === query
  );

  const filteredAthkar = ATHKAR_CATEGORIES.filter(
    (c) =>
      c.titleAr.includes(query) ||
      c.titleEn.toLowerCase().includes(query) ||
      c.descriptionAr.includes(query)
  );

  const filteredBooks = BOOKS_DATA.filter(
    (b) =>
      b.titleAr.includes(query) ||
      b.titleEn.toLowerCase().includes(query) ||
      b.authorAr.includes(query)
  );

  // Daily Sunan & Wird Items for index
  const dailySunanItems = [
    { titleAr: 'سُنن الصلاة الرواتب (١٢ ركعة)', titleEn: 'Rawatib Sunnah Prayers (12 Rak’ahs)', timeAr: 'مع الصلوات الخمس', fadlAr: 'بنى الله له بيتاً في الجنة' },
    { titleAr: 'صلاة الوتر وقيام الليل', titleEn: 'Witr & Night Vigil Prayer', timeAr: 'بعد العشاء حتى الفجر', fadlAr: 'أفضل الصلاة بعد الفريضة' },
    { titleAr: 'صلاة الضحى (ركعتان إلى ٨ ركعات)', titleEn: 'Duha Forenoon Prayer', timeAr: 'بعد الشروق بثلث ساعة', fadlAr: 'تجزئ عن صدقة كل مفصل' },
    { titleAr: 'قراءة سورة الملك قبل النوم', titleEn: 'Surah Al-Mulk at Night', timeAr: 'قبل المنام', fadlAr: 'المانعة والمنجية من عذاب القبر' },
    { titleAr: 'قراءة سورة الكهف يوم الجمعة', titleEn: 'Surah Al-Kahf on Friday', timeAr: 'يوم الجمعة', fadlAr: 'نور ما بين الجمعتين' },
    { titleAr: 'صيام الاثنين والخميس والأيام البيض', titleEn: 'Fasting Mondays, Thursdays & White Days', timeAr: 'أسبوعياً وشهرياً', fadlAr: 'تُعرض الأعمال على الله' }
  ];

  return (
    <div id="index-view" className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border backdrop-blur-xl transition-all shadow-xl bg-gradient-to-br from-teal-950/40 via-slate-900/60 to-emerald-950/30 border-teal-500/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30 mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الفهرس الشامل والمبوب' : 'Comprehensive Directory'}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-cairo text-slate-100 mb-2">
          {language === 'ar' ? 'فهرس المحتوى والأبواب' : 'Master Index & Table of Contents'}
        </h1>
        <p className="text-sm text-slate-300 max-w-xl">
          {language === 'ar'
            ? 'دليلك الشامل للوصول السريع إلى سور القرآن الكريم، أبواب الأذكار المفصلة، كتب الحديث الشريف، والسنن اليومية.'
            : 'Your unified directory for instant access to Quran Surahs, detailed Athkar categories, Hadith collections, and Daily Sunan.'}
        </p>

        {/* Index Metrics Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-700/40">
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xl font-bold font-cairo text-emerald-400 block">١١٤</span>
            <span className="text-xs text-slate-400">{language === 'ar' ? 'سورة في المصحف' : 'Quran Surahs'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xl font-bold font-cairo text-teal-400 block">{ATHKAR_CATEGORIES.length}</span>
            <span className="text-xs text-slate-400">{language === 'ar' ? 'فئات وأبواب أذكار' : 'Athkar Categories'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xl font-bold font-cairo text-amber-400 block">{BOOKS_DATA.length}</span>
            <span className="text-xs text-slate-400">{language === 'ar' ? 'كتب ومراجع إسلامية' : 'Books & Hadith'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <span className="text-xl font-bold font-cairo text-sky-400 block">٣٠</span>
            <span className="text-xs text-slate-400">{language === 'ar' ? 'جزءاً مقسماً' : 'Quranic Ajza’'}</span>
          </div>
        </div>
      </div>

      {/* Search & Navigation Bar */}
      <div className="space-y-3">
        <div className="relative w-full">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث في الفهرس عن سورة، كتاب، باب أذكار، أو سُنّة...' : 'Search index by Surah, Athkar, Book, or Sunnah...'}
            className={`w-full py-3 rounded-2xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
              language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'
            } ${
              theme === 'light'
                ? 'bg-white border-slate-200 text-slate-800'
                : 'bg-slate-900/70 border-slate-800 text-slate-100 placeholder-slate-500'
            }`}
          />
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'all', labelAr: 'عرض الكل', labelEn: 'All Index' },
            { id: 'quran', labelAr: 'فهرس القرآن', labelEn: 'Quran Index' },
            { id: 'athkar', labelAr: 'فهرس الأذكار', labelEn: 'Athkar Index' },
            { id: 'books', labelAr: 'فهرس الكتب', labelEn: 'Books Index' },
            { id: 'sunan', labelAr: 'السنن والأوراد', labelEn: 'Sunan & Wird' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-slate-100'
              }`}
            >
              {language === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Athkar Categories Index */}
      {(activeSection === 'all' || activeSection === 'athkar') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ar' ? 'فهرس أبواب الأذكار والأدعية' : 'Athkar Categories Index'}</span>
            </h2>
            <span className="text-xs text-emerald-400 font-medium">
              {filteredAthkar.length} {language === 'ar' ? 'أبواب متخصصة' : 'Categories'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredAthkar.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigateToAthkarCategory(cat.id)}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between shadow-sm hover:shadow-md ${
                  theme === 'light'
                    ? 'bg-white/80 border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-cairo text-slate-100">
                      {language === 'ar' ? cat.titleAr : cat.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {cat.items.length} {language === 'ar' ? 'أذكار مسندة' : 'Supplications'}
                    </p>
                  </div>
                </div>
                <ChevronLeft className={`w-4 h-4 text-slate-400 ${language === 'en' ? 'rotate-180' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Quran Surahs Index */}
      {(activeSection === 'all' || activeSection === 'quran') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>{language === 'ar' ? 'فهرس سور القرآن الكريم (١١٤ سورة)' : 'Holy Quran Surahs Index'}</span>
            </h2>
            <button
              onClick={navigateToQuran}
              className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <span>{language === 'ar' ? 'فتح المصحف' : 'Open Quran'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {filteredSurahs.map((s) => (
              <div
                key={s.number}
                onClick={navigateToQuran}
                className={`p-3 rounded-xl border backdrop-blur-xl transition-all cursor-pointer flex flex-col justify-between ${
                  theme === 'light'
                    ? 'bg-white/80 border-slate-200 hover:border-teal-500/50'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-teal-500/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="font-bold text-teal-400">#{s.number}</span>
                  <span className="text-[10px]">{s.revelationType === 'Meccan' ? (language === 'ar' ? 'مكية' : 'Mec') : (language === 'ar' ? 'مدنية' : 'Med')}</span>
                </div>
                <span className="font-quran font-bold text-base text-slate-100 text-right my-1">
                  {s.nameAr}
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {s.versesCount} {language === 'ar' ? 'آية' : 'Ayahs'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Islamic Library Books Index */}
      {(activeSection === 'all' || activeSection === 'books') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100 flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-amber-400" />
              <span>{language === 'ar' ? 'فهرس أمهات الكتب والمصنفات' : 'Islamic Library Collections'}</span>
            </h2>
            <span className="text-xs text-amber-400 font-medium">
              {filteredBooks.length} {language === 'ar' ? 'مؤلفات' : 'Volumes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredBooks.map((b) => (
              <div
                key={b.id}
                onClick={() => navigateToBook(b.id)}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all cursor-pointer flex items-center justify-between ${
                  theme === 'light'
                    ? 'bg-white/80 border-slate-200 hover:border-amber-500/50 hover:bg-amber-50/20'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                    <BookMarked className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm font-cairo text-slate-100">
                      {language === 'ar' ? b.titleAr : b.titleEn}
                    </h3>
                    <p className="text-xs text-amber-400/90">{language === 'ar' ? b.authorAr : b.authorEn}</p>
                    <p className="text-[11px] text-slate-400">{b.chapters.length} {language === 'ar' ? 'أبواب وفصول' : 'Chapters'}</p>
                  </div>
                </div>
                <ChevronLeft className={`w-4 h-4 text-slate-400 ${language === 'en' ? 'rotate-180' : ''}`} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Daily Sunan & Routine Index */}
      {(activeSection === 'all' || activeSection === 'sunan') && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold font-cairo text-slate-100 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{language === 'ar' ? 'فهرس السنن الرواتب والأوراد اليومية' : 'Daily Sunnah & Devotional Routine'}</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {dailySunanItems.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border backdrop-blur-xl transition-all ${
                  theme === 'light'
                    ? 'bg-white/80 border-slate-200'
                    : 'bg-slate-900/60 border-slate-800/80'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-sm font-cairo text-slate-100 mb-1">
                      {language === 'ar' ? item.titleAr : item.titleEn}
                    </h3>
                    <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{item.timeAr}</span>
                    </div>
                    <p className="text-[11px] text-emerald-400/90 font-medium">
                      {item.fadlAr}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
