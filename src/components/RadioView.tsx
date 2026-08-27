import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Radio, Play, Pause, Search, Volume2, AlertCircle, Loader2 } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface RadioStation {
  id: number;
  name: string;
  url: string;
  recent_date: string;
}

export const RadioView: React.FC = () => {
  const { theme, language } = useApp();
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [activeRadio, setActiveRadio] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchRadios = async () => {
      try {
        setLoading(true);
        // Using mp3quran API for live radios
        const langParam = language === 'en' ? 'eng' : 'ar';
        const response = await fetch(`https://mp3quran.net/api/v3/radios?language=${langParam}`);
        if (!response.ok) throw new Error('Failed to fetch radios');
        const data = await response.json();
        
        if (data && data.radios) {
          const egyptRadio = {
            id: 999999,
            name: language === 'ar' ? 'إذاعة القرآن الكريم من القاهرة' : 'Egypt Quran Radio (Cairo)',
            url: 'https://stream.radiojar.com/8s5u5tpdtwzuv',
            recent_date: new Date().toISOString()
          };
          // Check if it already exists (unlikely but safe)
          const fetchedRadios = data.radios.filter((r: RadioStation) => !r.name.includes('القاهرة') || !r.name.includes('إذاعة القرآن الكريم'));
          setRadios([egyptRadio, ...fetchedRadios]);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (err) {
        console.error('Error fetching radios:', err);
        setError(language === 'ar' ? 'عذراً، فشل تحميل الإذاعات.' : 'Sorry, failed to load radios.');
      } finally {
        setLoading(false);
      }
    };

    fetchRadios();
  }, [language]);

  const handlePlayPause = (station: RadioStation) => {
    if (activeRadio?.id === station.id) {
      // Toggle play/pause for current station
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play().catch(e => {
          console.error("Audio play error", e);
          setAudioError(true);
        });
        setIsPlaying(true);
        setAudioError(false);
      }
    } else {
      // Switch to new station
      setActiveRadio(station);
      setIsPlaying(true);
      setAudioError(false);
      
      if (audioRef.current) {
        audioRef.current.src = station.url;
        audioRef.current.play().catch(e => {
          console.error("Audio play error", e);
          setAudioError(true);
          setIsPlaying(false);
        });
      }
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    { id: 'egypt', labelAr: 'إذاعات مصر', labelEn: 'Egypt Radios' },
    { id: 'reciters', labelAr: 'قراء القرآن', labelEn: 'Reciters' },
    { id: 'fatawa', labelAr: 'فتاوى ودروس', labelEn: 'Fatawa & Lessons' },
    { id: 'translations', labelAr: 'تراجم ومعاني', labelEn: 'Translations' },
  ];

  const getCategory = (name: string) => {
    if (name.includes('القاهرة') || name.includes('مصر')) return 'egypt';
    if (name.includes('فتاوى') || name.includes('تفسير') || name.includes('صحيح') || name.includes('سيرة') || name.includes('قصص') || name.includes('رياض')) return 'fatawa';
    if (name.includes('ترجمة') || name.includes('translation') || name.includes('Translation')) return 'translations';
    return 'reciters';
  };

  const filteredRadios = radios.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && getCategory(r.name) === activeCategory;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 font-cairo">
      <audio
        ref={audioRef}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setAudioError(true);
          setIsPlaying(false);
        }}
        onPlaying={() => {
          setIsPlaying(true);
          setAudioError(false);
        }}
      />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center gap-2 mt-2 sm:mt-4"
      >
        <div className="p-3 sm:p-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 mb-2">
          <Radio size={30} strokeWidth={1.5} className="sm:w-9 sm:h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {language === 'ar' ? 'الإذاعات المباشرة' : 'Live Radio'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-xl text-sm sm:text-base">
          {language === 'ar' 
            ? 'استمع إلى البث المباشر لتلاوات القرآن الكريم بمختلف الروايات، وإذاعات الفتاوى، والدروس، والرقية الشرعية.'
            : 'Listen to live 24/7 broadcasts of Quran recitations, fatwas, lessons, and ruqyah.'}
        </p>
      </motion.div>

      {/* Categories Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex overflow-x-auto hide-scrollbar gap-2 px-1 py-2 mt-2 -mx-4 sm:mx-0 sm:px-0"
      >
        {/* Adds padding to start and end for mobile scroll */}
        <div className="w-2 shrink-0 sm:hidden"></div>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 ${
              activeCategory === cat.id
                ? 'bg-teal-500 text-white shadow-md shadow-teal-500/20'
                : 'bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50'
            }`}
          >
            {language === 'ar' ? cat.labelAr : cat.labelEn}
          </button>
        ))}
        <div className="w-2 shrink-0 sm:hidden"></div>
      </motion.div>

      {/* Search & Active Player Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="sticky top-[60px] sm:top-[70px] z-20 bg-slate-50/95 dark:bg-[#0f172a]/95 backdrop-blur-xl p-3 sm:p-4 -mx-4 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex flex-col md:flex-row gap-3 sm:gap-4 items-center"
      >
        {/* Active Player Banner (Only shows if something is playing/selected) */}
        {activeRadio && (
          <div className="w-full md:w-1/2 flex items-center justify-between bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl p-2 sm:p-3 shadow-sm border border-teal-500/20">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-teal-500/10 flex items-center justify-center relative overflow-hidden shrink-0">
                {isPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center gap-1">
                    <span className="w-1 h-3 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1 h-5 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1 h-4 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-1 h-2 bg-teal-500 rounded-full animate-pulse" style={{ animationDelay: '450ms' }} />
                  </div>
                ) : (
                  <Volume2 className="text-teal-500 w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                  {activeRadio.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-teal-600 dark:text-teal-400 font-medium">
                  {audioError 
                    ? (language === 'ar' ? 'تعذر التشغيل' : 'Stream error') 
                    : (isPlaying ? (language === 'ar' ? 'جاري البث مباشر...' : 'Live now...') : (language === 'ar' ? 'متوقف' : 'Paused'))}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => handlePlayPause(activeRadio)}
              className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-lg sm:rounded-xl bg-teal-500 text-white hover:bg-teal-600 flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 ml-2"
            >
              {isPlaying ? <Pause size={20} className="fill-current" /> : <Play size={20} className="fill-current ml-1" />}
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className={`relative group ${activeRadio ? 'w-full md:w-1/2' : 'w-full'}`}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحث عن إذاعة قاريء أو برنامج...' : 'Search for a reciter or program...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl sm:rounded-2xl py-3 px-10 sm:py-4 sm:px-12 outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all text-sm sm:text-base shadow-sm"
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          />
          <Search 
            className={`absolute top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors ${language === 'ar' ? 'right-3' : 'left-3'}`}
            size={18} 
          />
        </div>
      </motion.div>

      {/* Radio List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-teal-600 dark:text-teal-400">
          <Loader2 size={32} className="animate-spin sm:w-10 sm:h-10" />
          <p className="font-medium text-base sm:text-lg">{language === 'ar' ? 'جاري تحميل الإذاعات...' : 'Loading radios...'}</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-red-500">
          <AlertCircle size={40} className="sm:w-12 sm:h-12" />
          <p className="text-base sm:text-lg font-medium">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 pb-20 pt-2">
          {filteredRadios.length > 0 ? (
            filteredRadios.map((station, i) => {
              const isActive = activeRadio?.id === station.id;
              
              return (
                <motion.div
                  key={station.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.01 * Math.min(i, 30) }}
                  className={`relative p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer group flex flex-col gap-3 overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-600 border-transparent shadow-md shadow-teal-500/20 text-white' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-teal-500/50 hover:shadow-sm hover:shadow-teal-500/10'
                  }`}
                  onClick={() => handlePlayPause(station)}
                >
                  {/* Background pattern for active card */}
                  {isActive && (
                    <div className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }} />
                  )}

                  <div className="flex items-center justify-between z-10">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      isActive 
                        ? 'bg-white/20 text-white backdrop-blur-sm' 
                        : 'bg-slate-50 dark:bg-slate-800/50 text-teal-600 dark:text-teal-400 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 group-hover:scale-110'
                    }`}>
                      {isActive && isPlaying ? (
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="w-1 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                          <span className="w-1 h-3.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                          <span className="w-1 h-2.5 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : (
                        <Radio size={20} strokeWidth={isActive ? 2 : 1.5} />
                      )}
                    </div>
                    
                    <button className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all ${
                      isActive 
                        ? 'bg-white text-teal-600 hover:scale-110 shadow-sm' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-teal-500 group-hover:text-white'
                    }`}>
                      {isActive && isPlaying ? (
                        <Pause size={14} className="fill-current sm:w-4 sm:h-4" />
                      ) : (
                        <Play size={14} className="fill-current ml-0.5 sm:w-4 sm:h-4" />
                      )}
                    </button>
                  </div>
                  
                  <div className="z-10 mt-1">
                    <h4 className={`font-bold text-sm sm:text-base line-clamp-2 leading-tight transition-colors ${
                      isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'
                    }`} title={station.name}>
                      {station.name}
                    </h4>
                    <p className={`text-[10px] sm:text-xs mt-1.5 flex items-center gap-1.5 ${
                      isActive ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive && isPlaying ? 'bg-red-400 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'}`} />
                      {isActive && isPlaying ? (language === 'ar' ? 'مباشر' : 'Live') : (language === 'ar' ? 'إضغط للتشغيل' : 'Tap to play')}
                    </p>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-slate-500">
              {language === 'ar' ? 'لم يتم العثور على إذاعات مطابقة للبحث.' : 'No radios found matching your search.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
