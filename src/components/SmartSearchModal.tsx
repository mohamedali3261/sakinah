import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { ATHKAR_CATEGORIES } from '../data/athkarData';
import { BOOKS_DATA } from '../data/booksData';
import { Search, X, BookOpen, Sparkles, ChevronLeft, ChevronRight, Hash } from 'lucide-react';

export const SmartSearchModal: React.FC = () => {
  const {
    language,
    theme,
    isSearchOpen,
    setIsSearchOpen,
    setActiveTab,
    setSelectedAthkarCategoryId,
    setSelectedBook,
    setSelectedChapter
  } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'athkar' | 'books' | 'hadith' | 'quran'>('all');

  // Search Results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const list: Array<{
      id: string;
      type: 'athkar' | 'book' | 'chapter';
      category: string;
      title: string;
      snippet: string;
      parentTitle?: string;
      targetBookId?: string;
      targetChapterId?: string;
      targetCategoryId?: string;
    }> = [];

    // Search Athkar
    if (filterType === 'all' || filterType === 'athkar') {
      ATHKAR_CATEGORIES.forEach((cat) => {
        cat.items.forEach((item) => {
          const matchAr = item.textAr.toLowerCase().includes(q) || (item.fadlAr && item.fadlAr.toLowerCase().includes(q));
          const matchEn = item.textEn.toLowerCase().includes(q) || (item.fadlEn && item.fadlEn.toLowerCase().includes(q));
          if (matchAr || matchEn) {
            list.push({
              id: item.id,
              type: 'athkar',
              category: language === 'ar' ? 'أذكار وأدعية' : 'Athkar & Dua',
              title: language === 'ar' ? cat.titleAr : cat.titleEn,
              snippet: language === 'ar' ? item.textAr : item.textEn,
              parentTitle: language === 'ar' ? cat.titleAr : cat.titleEn,
              targetCategoryId: cat.id
            });
          }
        });
      });
    }

    // Search Books & Chapters
    if (filterType === 'all' || filterType === 'books' || filterType === 'hadith' || filterType === 'quran') {
      BOOKS_DATA.forEach((book) => {
        // Filter by book category if specific
        if (filterType === 'hadith' && book.category !== 'hadith') return;
        if (filterType === 'quran' && book.category !== 'quran') return;

        book.chapters.forEach((chapter) => {
          const matchTitle =
            chapter.titleAr.toLowerCase().includes(q) || chapter.titleEn.toLowerCase().includes(q);
          const matchContent =
            chapter.contentAr.toLowerCase().includes(q) || chapter.contentEn.toLowerCase().includes(q);
          const matchExpl =
            (chapter.explanationAr && chapter.explanationAr.toLowerCase().includes(q)) ||
            (chapter.explanationEn && chapter.explanationEn.toLowerCase().includes(q));

          if (matchTitle || matchContent || matchExpl) {
            list.push({
              id: chapter.id,
              type: 'chapter',
              category:
                book.category === 'hadith'
                  ? language === 'ar' ? 'حديث شريف' : 'Noble Hadith'
                  : book.category === 'quran'
                  ? language === 'ar' ? 'قرآن كريم وتدبر' : 'Quran & Tadabbur'
                  : language === 'ar' ? 'المكتبة الإسلامية' : 'Islamic Library',
              title: language === 'ar' ? chapter.titleAr : chapter.titleEn,
              snippet: language === 'ar' ? chapter.contentAr : chapter.contentEn,
              parentTitle: language === 'ar' ? book.titleAr : book.titleEn,
              targetBookId: book.id,
              targetChapterId: chapter.id
            });
          }
        });
      });
    }

    return list;
  }, [query, filterType, language]);

  const handleSelectResult = (item: (typeof results)[0]) => {
    setIsSearchOpen(false);
    if (item.type === 'athkar') {
      setSelectedAthkarCategoryId(item.targetCategoryId || null);
      setActiveTab('athkar');
    } else if (item.type === 'chapter' && item.targetBookId) {
      const book = BOOKS_DATA.find((b) => b.id === item.targetBookId);
      if (book) {
        setSelectedBook(book);
        const chap = book.chapters.find((c) => c.id === item.targetChapterId);
        setSelectedChapter(chap || book.chapters[0]);
        setActiveTab('library');
      }
    }
  };

  const highlightMatch = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-amber-400/30 text-amber-300 font-bold px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 md:pt-20">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsSearchOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Dialog Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -18 }}
            transition={{ type: 'spring', damping: 26, stiffness: 340 }}
            className={`relative w-full max-w-2xl rounded-3xl p-6 border shadow-2xl z-10 max-h-[85vh] flex flex-col ${
              theme === 'light'
                ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300'
                : theme === 'sepia'
                ? 'bg-[#2b1f17]/95 border-amber-800/40 text-amber-50 shadow-black/60'
                : 'bg-slate-900/95 border-slate-700/60 text-slate-100 shadow-black/80'
            }`}
          >
          {/* Search Input Bar */}
          <div className="relative flex items-center gap-3 pb-4 border-b border-white/10">
            <Search className="w-5 h-5 text-emerald-400 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'ابحث في الأذكار، الأحاديث، الكتب، والآيات الكريمة...'
                  : 'Search in athkar, hadiths, books, and Quranic verses...'
              }
              className="w-full bg-transparent border-none outline-none text-base font-cairo placeholder:opacity-40"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-2 py-3 overflow-x-auto text-xs font-cairo">
            {[
              { id: 'all', labelAr: 'الكل', labelEn: 'All' },
              { id: 'athkar', labelAr: 'الأذكار والأدعية', labelEn: 'Athkar' },
              { id: 'hadith', labelAr: 'الأحاديث النبوية', labelEn: 'Hadith' },
              { id: 'quran', labelAr: 'القرآن والتدبر', labelEn: 'Quran' },
              { id: 'books', labelAr: 'المكتبة والكتب', labelEn: 'Books' }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setFilterType(chip.id as typeof filterType)}
                className={`px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                  filterType === chip.id
                    ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'border-white/10 bg-white/5 opacity-70 hover:opacity-100'
                }`}
              >
                {language === 'ar' ? chip.labelAr : chip.labelEn}
              </button>
            ))}
          </div>

          {/* Search Results Content */}
          <div className="flex-1 overflow-y-auto space-y-3 mt-2 pr-1">
            {!query.trim() ? (
              <div className="py-12 text-center opacity-60">
                <Sparkles className="w-8 h-8 mx-auto text-emerald-400/60 mb-2 animate-pulse" />
                <p className="text-sm font-cairo">
                  {language === 'ar'
                    ? 'اكتب أي كلمة مثل: (النية، الصباح، الصبر، الاستغفار، الفاتحة...)'
                    : 'Type a keyword e.g. (Intention, Morning, Patience, Istighfar, Fatihah...)'}
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center opacity-60">
                <p className="text-sm font-cairo">
                  {language === 'ar' ? 'لم يتم العثور على نتائج مطابقة.' : 'No matching results found.'}
                </p>
              </div>
            ) : (
              results.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectResult(item)}
                  className="p-4 rounded-2xl border border-white/10 hover:border-emerald-400/40 bg-white/5 hover:bg-emerald-500/10 transition-all cursor-pointer group flex items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs text-emerald-400 font-cairo font-semibold mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30">
                        {item.category}
                      </span>
                      {item.parentTitle && (
                        <span className="opacity-70 truncate font-normal">
                          • {item.parentTitle}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold font-cairo mb-1 group-hover:text-emerald-300 transition-colors">
                      {highlightMatch(item.title, query)}
                    </h4>

                    <p className="text-xs opacity-75 line-clamp-2 leading-relaxed font-cairo">
                      {highlightMatch(item.snippet, query)}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-white/5 group-hover:bg-emerald-500/20 text-slate-400 group-hover:text-emerald-300 transition-colors shrink-0 mt-2">
                    {language === 'ar' ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
