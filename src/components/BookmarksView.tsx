import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BOOKS_DATA } from '../data/booksData';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import {
  Bookmark,
  Trash2,
  BookOpen,
  Sparkles,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  FolderHeart
} from 'lucide-react';
import { GlassButton } from './GlassButton';
import { motion } from 'motion/react';

export const BookmarksView: React.FC = () => {
  const {
    language,
    theme,
    bookmarks,
    removeBookmark,
    offlineBookIds,
    toggleOfflineBook,
    setActiveTab,
    setSelectedBook,
    setSelectedChapter,
    setSelectedAthkarCategoryId,
    showToast
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'bookmarks' | 'offline'>('bookmarks');

  const offlineBooks = BOOKS_DATA.filter((b) => offlineBookIds.includes(b.id));

  const handleOpenBookmark = (item: (typeof bookmarks)[0]) => {
    if (item.type === 'athkar') {
      // Find category
      const cat = ATHKAR_CATEGORIES.find((c) => c.items.some((it) => it.id === item.targetId));
      if (cat) {
        setSelectedAthkarCategoryId(cat.id);
        setActiveTab('athkar');
      }
    } else if (item.type === 'chapter') {
      for (const book of BOOKS_DATA) {
        const chap = book.chapters.find((c) => c.id === item.targetId);
        if (chap) {
          setSelectedBook(book);
          setSelectedChapter(chap);
          setActiveTab('library');
          return;
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header Banner */}
      <div
        className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 ${
          theme === 'light'
            ? 'bg-white/80 border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1f17]/80 border-amber-800/40 text-amber-50'
            : 'bg-slate-900/80 border-slate-800 text-slate-100'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-cairo">
              {language === 'ar' ? 'المحفوظات والقراءة دون اتصال' : 'Saved Bookmarks & Offline Books'}
            </h2>
            <p className="text-xs opacity-75 font-cairo">
              {language === 'ar'
                ? 'أدعية وآيات وكتب محفوظة للرجوع إليها في أي وقت'
                : 'Your personal spiritual repository available anytime offline'}
            </p>
          </div>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubTab('bookmarks')}
            className={`px-4 py-2 rounded-2xl border text-xs font-cairo font-bold transition-all cursor-pointer ${
              activeSubTab === 'bookmarks'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-md'
                : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            {language === 'ar' ? 'المفضلة' : 'Bookmarks'} ({bookmarks.length})
          </button>

          <button
            onClick={() => setActiveSubTab('offline')}
            className={`px-4 py-2 rounded-2xl border text-xs font-cairo font-bold transition-all cursor-pointer ${
              activeSubTab === 'offline'
                ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-md'
                : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
            }`}
          >
            {language === 'ar' ? 'الكتب المحمّلة' : 'Offline Books'} ({offlineBooks.length})
          </button>
        </div>
      </div>

      {/* Bookmarks Section */}
      {activeSubTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length === 0 ? (
            <div className="p-12 rounded-3xl border border-white/10 bg-white/5 text-center opacity-60">
              <Bookmark className="w-10 h-10 mx-auto text-amber-400/60 mb-2" />
              <p className="text-sm font-cairo">
                {language === 'ar'
                  ? 'لم تقم بحفظ أي أذكار أو آيات أو فصول بعد. اضغط على أيقونة الإشارة المرجعية للحفظ.'
                  : 'No bookmarks yet. Tap the bookmark icon on any athkar or chapter to save it here.'}
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <motion.div
                key={bm.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-3xl border backdrop-blur-xl shadow-md transition-all flex items-start justify-between gap-4 ${
                  theme === 'light'
                    ? 'bg-white/85 border-slate-200 text-slate-800'
                    : theme === 'sepia'
                    ? 'bg-[#291c14]/85 border-amber-800/40 text-amber-50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-100'
                }`}
              >
                <div
                  onClick={() => handleOpenBookmark(bm)}
                  className="flex-1 min-w-0 cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold font-cairo px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300">
                      {bm.type === 'athkar'
                        ? language === 'ar' ? 'ذكر مبارك' : 'Athkar'
                        : bm.type === 'chapter'
                        ? language === 'ar' ? 'فصل من كتاب' : 'Chapter'
                        : language === 'ar' ? 'آية كريمة' : 'Quranic Verse'}
                    </span>
                    <span className="text-[10px] opacity-60 font-mono">{bm.dateAdded}</span>
                  </div>

                  <h3 className="text-base font-bold font-cairo group-hover:text-emerald-400 transition-colors">
                    {language === 'ar' ? bm.titleAr : bm.titleEn}
                  </h3>

                  <p className="text-xs opacity-75 font-cairo line-clamp-2 mt-1 leading-relaxed">
                    {language === 'ar' ? bm.snippetAr : bm.snippetEn}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 pt-1">
                  <button
                    onClick={() => {
                      removeBookmark(bm.id);
                      showToast(
                        language === 'ar' ? 'تم الحذف من المفضلة' : 'Bookmark Removed',
                        language === 'ar' ? 'تمت إزالة العنصر بنجاح.' : 'Item removed from bookmarks.'
                      );
                    }}
                    className="p-2 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title={language === 'ar' ? 'إزالة' : 'Remove'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Offline Books Section */}
      {activeSubTab === 'offline' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs font-cairo">
            <span className="text-emerald-300">
              {language === 'ar'
                ? 'جميع الكتب المدرجة هنا متوفرة بالكامل دون الحاجة لأي اتصال بالإنترنت.'
                : 'All listed books below are fully downloaded and cached locally for offline reading.'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {offlineBooks.map((book) => (
              <div
                key={book.id}
                className={`p-6 rounded-3xl border backdrop-blur-xl shadow-xl flex flex-col justify-between ${
                  theme === 'light'
                    ? 'bg-white/85 border-slate-200 text-slate-800'
                    : theme === 'sepia'
                    ? 'bg-[#291c14]/85 border-amber-800/40 text-amber-50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold font-cairo px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300">
                      {book.chapters.length} {language === 'ar' ? 'فصل كامل' : 'Chapters'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-cairo text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'جاهز دون اتصال' : 'Offline Ready'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-cairo">
                    {language === 'ar' ? book.titleAr : book.titleEn}
                  </h3>
                  <p className="text-xs opacity-70 font-cairo mt-0.5">
                    {language === 'ar' ? book.authorAr : book.authorEn}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <GlassButton
                    size="sm"
                    variant="primary"
                    onClick={() => {
                      setSelectedBook(book);
                      setSelectedChapter(book.chapters[0]);
                      setActiveTab('library');
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'بدء القراءة' : 'Read Book'}</span>
                  </GlassButton>

                  <button
                    onClick={() => toggleOfflineBook(book.id)}
                    className="p-2 rounded-xl hover:bg-white/10 text-slate-400 hover:text-rose-400 text-xs font-cairo"
                    title={language === 'ar' ? 'حذف من التخزين' : 'Remove from offline'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
