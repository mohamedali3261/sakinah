import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BOOKS_DATA } from '../data/booksData';
import { Book, BookChapter } from '../types';
import {
  BookOpen,
  Bookmark,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Copy,
  Sparkles,
  Share2,
  Type,
  Moon,
  Sun,
  Flame
} from 'lucide-react';
import { GlassButton } from './GlassButton';
import { motion, AnimatePresence } from 'motion/react';

export const LibraryView: React.FC = () => {
  const {
    language,
    theme,
    setTheme,
    fontFamily,
    fontSize,
    selectedBook,
    setSelectedBook,
    selectedChapter,
    setSelectedChapter,
    addBookmark,
    isBookmarked,
    setIsFontSettingsOpen,
    showToast
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'hadith' | 'quran' | 'tazkiyah' | 'seerah'>('all');
  const [showExplanation, setShowExplanation] = useState(true);

  // If reader is active
  if (selectedBook && selectedChapter) {
    const currentIndex = selectedBook.chapters.findIndex((c) => c.id === selectedChapter.id);
    const prevChapter = currentIndex > 0 ? selectedBook.chapters[currentIndex - 1] : null;
    const nextChapter =
      currentIndex < selectedBook.chapters.length - 1 ? selectedBook.chapters[currentIndex + 1] : null;

    const handleCopy = () => {
      navigator.clipboard.writeText(
        `${selectedChapter.titleAr}\n\n${selectedChapter.contentAr}\n\n${selectedChapter.explanationAr || ''}`
      );
      showToast(
        language === 'ar' ? 'تم نسخ الفصل' : 'Chapter Copied',
        language === 'ar' ? 'تم نسخ النص إلى الحافظة.' : 'Text copied to clipboard.'
      );
    };

    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-28">
        {/* Reader Top Bar Controls */}
        <div
          className={`p-4 rounded-3xl border backdrop-blur-xl shadow-lg flex items-center justify-between gap-3 ${
            theme === 'light'
              ? 'bg-white/90 border-slate-200 text-slate-800'
              : theme === 'sepia'
              ? 'bg-[#2b1f17]/90 border-amber-800/40 text-amber-50'
              : 'bg-slate-900/90 border-slate-800 text-slate-100'
          }`}
        >
          <button
            onClick={() => setSelectedChapter(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-white/10 text-xs font-cairo font-semibold transition-colors"
          >
            {language === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{language === 'ar' ? 'فهرس الكتاب' : 'Back to Chapters'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            {/* Bookmark Chapter */}
            <button
              onClick={() =>
                addBookmark({
                  type: 'chapter',
                  titleAr: selectedChapter.titleAr,
                  titleEn: selectedChapter.titleEn,
                  snippetAr: selectedChapter.contentAr,
                  snippetEn: selectedChapter.contentEn,
                  targetId: selectedChapter.id,
                  parentId: selectedBook.id
                })
              }
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-amber-400 transition-colors"
              title={language === 'ar' ? 'حفظ في المفضلة' : 'Bookmark'}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked(selectedChapter.id) ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            </button>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-emerald-400 transition-colors"
              title={language === 'ar' ? 'نسخ' : 'Copy'}
            >
              <Copy className="w-4 h-4" />
            </button>

            {/* Font & Display Settings */}
            <button
              onClick={() => setIsFontSettingsOpen(true)}
              className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-teal-300 transition-colors"
              title={language === 'ar' ? 'حجم الخط' : 'Font Settings'}
            >
              <Type className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Document Container */}
        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 md:p-10 rounded-3xl border backdrop-blur-2xl shadow-2xl transition-all ${
            theme === 'light'
              ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
              : theme === 'sepia'
              ? 'bg-[#281b13]/95 border-amber-800/40 text-amber-50 shadow-black/80'
              : 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-black/90'
          }`}
        >
          {/* Chapter Header */}
          <div className="text-center pb-6 border-b border-white/10 space-y-2">
            <span className="text-xs font-bold font-cairo text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
              {language === 'ar' ? selectedBook.titleAr : selectedBook.titleEn}
            </span>
            <h1 className="text-xl md:text-2xl font-bold font-cairo pt-2">
              {language === 'ar' ? selectedChapter.titleAr : selectedChapter.titleEn}
            </h1>
            <p className="text-xs opacity-60 font-cairo">
              {language === 'ar' ? selectedBook.authorAr : selectedBook.authorEn}
            </p>
          </div>

          {/* Main Chapter Content */}
          <div className="my-8">
            <p
              className={`leading-loose whitespace-pre-line text-right font-${fontFamily} ${
                fontSize === 'sm'
                  ? 'text-base'
                  : fontSize === 'md'
                  ? 'text-lg md:text-xl'
                  : fontSize === 'lg'
                  ? 'text-xl md:text-2xl'
                  : fontSize === 'xl'
                  ? 'text-2xl md:text-3xl'
                  : 'text-3xl md:text-4xl'
              }`}
            >
              {selectedChapter.contentAr}
            </p>

            {language === 'en' && (
              <div className="mt-6 pt-6 border-t border-white/10 text-sm font-sans opacity-90 leading-relaxed">
                <p className="whitespace-pre-line">{selectedChapter.contentEn}</p>
              </div>
            )}
          </div>

          {/* Commentary & Lessons Box */}
          {selectedChapter.explanationAr && (
            <div className="mt-8 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm font-cairo">
                <Sparkles className="w-4 h-4" />
                <span>{language === 'ar' ? 'الشرح والفوائد المسلكية:' : 'Commentary & Lessons:'}</span>
              </div>
              <p className="text-sm font-cairo leading-relaxed opacity-95">
                {language === 'ar' ? selectedChapter.explanationAr : selectedChapter.explanationEn}
              </p>
            </div>
          )}

          {/* Chapter Navigation Footer */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center justify-between gap-4">
            {prevChapter ? (
              <button
                onClick={() => setSelectedChapter(prevChapter)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-cairo font-bold transition-all"
              >
                {language === 'ar' ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span className="truncate max-w-[120px] md:max-w-[200px]">
                  {language === 'ar' ? prevChapter.titleAr : prevChapter.titleEn}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <button
                onClick={() => setSelectedChapter(nextChapter)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-cairo font-bold transition-all"
              >
                <span className="truncate max-w-[120px] md:max-w-[200px]">
                  {language === 'ar' ? nextChapter.titleAr : nextChapter.titleEn}
                </span>
                {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            ) : (
              <div />
            )}
          </div>
        </motion.article>
      </div>
    );
  }

  // If a book is selected but not a chapter -> Show Chapters List
  if (selectedBook) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
        {/* Book Header Card */}
        <div
          className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            theme === 'light'
              ? 'bg-white/80 border-slate-200 text-slate-800'
              : theme === 'sepia'
              ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
              : 'bg-slate-900/80 border-slate-800 text-slate-100'
          }`}
        >
          <div className="space-y-1">
            <button
              onClick={() => setSelectedBook(null)}
              className="flex items-center gap-1 text-xs text-emerald-400 font-cairo mb-2 hover:underline"
            >
              {language === 'ar' ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
              <span>{language === 'ar' ? 'العودة لجميع الكتب' : 'Back to Library'}</span>
            </button>
            <h2 className="text-xl md:text-2xl font-bold font-cairo">
              {language === 'ar' ? selectedBook.titleAr : selectedBook.titleEn}
            </h2>
            <p className="text-xs opacity-75 font-cairo">
              {language === 'ar' ? selectedBook.authorAr : selectedBook.authorEn}
            </p>
            <p className="text-xs opacity-90 font-cairo pt-1 max-w-xl">
              {language === 'ar' ? selectedBook.descriptionAr : selectedBook.descriptionEn}
            </p>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="space-y-3">
          <h3 className="text-base font-bold font-cairo px-1">
            {language === 'ar' ? 'فهرس الأبواب والفصول' : 'Chapters Index'} ({selectedBook.chapters.length})
          </h3>

          {selectedBook.chapters.map((chapter, idx) => (
            <div
              key={chapter.id}
              onClick={() => setSelectedChapter(chapter)}
              className="p-4 rounded-2xl border border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-emerald-500/10 transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-white/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-bold font-cairo group-hover:text-emerald-300 transition-colors">
                    {language === 'ar' ? chapter.titleAr : chapter.titleEn}
                  </h4>
                  <p className="text-xs opacity-60 font-cairo line-clamp-1 mt-0.5">
                    {language === 'ar' ? chapter.contentAr.slice(0, 80) : chapter.contentEn.slice(0, 80)}...
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 transition-colors shrink-0">
                {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Books Catalog Gallery
  const filteredBooks =
    categoryFilter === 'all' ? BOOKS_DATA : BOOKS_DATA.filter((b) => b.category === categoryFilter);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', labelAr: 'جميع الكتب', labelEn: 'All Books' },
          { id: 'hadith', labelAr: 'الحديث الشريف', labelEn: 'Noble Hadith' },
          { id: 'quran', labelAr: 'القرآن والتدبر', labelEn: 'Quran & Reflections' },
          { id: 'tazkiyah', labelAr: 'تزكية القلوب', labelEn: 'Tazkiyah' },
          { id: 'seerah', labelAr: 'السيرة النبوية', labelEn: 'Prophetic Biography' }
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setCategoryFilter(chip.id as typeof categoryFilter)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-cairo font-bold whitespace-nowrap transition-all cursor-pointer ${
              categoryFilter === chip.id
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-md'
                : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            {language === 'ar' ? chip.labelAr : chip.labelEn}
          </button>
        ))}
      </div>

      {/* Books Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBooks.map((book) => {
          return (
            <motion.div
              key={book.id}
              whileHover={{ y: -4 }}
              onClick={() => setSelectedBook(book)}
              className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl transition-all cursor-pointer flex flex-col justify-between group ${
                theme === 'light'
                  ? 'bg-white/85 border-slate-200 text-slate-800 hover:border-emerald-400/60'
                  : theme === 'sepia'
                  ? 'bg-[#291c14]/85 border-amber-800/40 text-amber-50 hover:border-amber-500/60'
                  : 'bg-slate-900/80 border-slate-800 text-slate-100 hover:border-emerald-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold font-cairo px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 uppercase">
                    {book.category}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-cairo group-hover:text-emerald-400 transition-colors">
                  {language === 'ar' ? book.titleAr : book.titleEn}
                </h3>
                <p className="text-xs opacity-70 font-cairo mt-1">
                  {language === 'ar' ? book.authorAr : book.authorEn}
                </p>

                <p className="text-xs opacity-85 font-cairo mt-3 line-clamp-2 leading-relaxed">
                  {language === 'ar' ? book.descriptionAr : book.descriptionEn}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-cairo opacity-60">
                  {book.chapters.length} {language === 'ar' ? 'أبواب وفصول' : 'Chapters'}
                </span>

                <div className="flex items-center gap-1 text-xs font-cairo font-bold text-emerald-400 group-hover:translate-x-[-4px] transition-transform">
                  <span>{language === 'ar' ? 'تصفح وقراءة' : 'Read Now'}</span>
                  {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
