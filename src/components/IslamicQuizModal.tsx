import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ISLAMIC_QUIZ_QUESTIONS,
  QUIZ_CATEGORIES,
  QuizQuestion
} from '../data/islamicQuizData';
import {
  X,
  Sparkles,
  Award,
  BookOpen,
  Compass,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Trophy,
  Flame,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Layers,
  Volume2,
  ChevronDown,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface IslamicQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IslamicQuizModal: React.FC<IslamicQuizModalProps> = ({ isOpen, onClose }) => {
  const { language, theme, showToast, soundEnabled, vibrationEnabled } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [answeredHistory, setAnsweredHistory] = useState<{ [qId: string]: boolean }>({});
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState<boolean>(false);

  // Filter questions based on selected category
  const filteredQuestions = selectedCategory === 'all'
    ? ISLAMIC_QUIZ_QUESTIONS
    : ISLAMIC_QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory);

  const currentQuestion: QuizQuestion | undefined = filteredQuestions[currentQuestionIndex];

  // Reset question state when changing category
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setIsCompleted(false);
  }, [selectedCategory]);

  if (!isOpen) return null;

  const handleOptionSelect = (index: number) => {
    if (isAnswerSubmitted) return;
    if (soundEnabled) soundEngine.playClick();
    if (vibrationEnabled) triggerHaptic(10);
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || !currentQuestion || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQuestion.correctIndex;

    if (isCorrect) {
      if (soundEnabled) soundEngine.playSuccess();
      if (vibrationEnabled) triggerHaptic(30);
      const newScore = score + 10 + streak * 2;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setAnsweredHistory({ ...answeredHistory, [currentQuestion.id]: true });
      showToast(
        language === 'ar' ? '🎉 إجابة صحيحة وموفقة!' : '🎉 Correct Answer!',
        language === 'ar' ? `أحسنت! +${10 + streak * 2} نقطة` : `Well done! +${10 + streak * 2} pts`
      );
    } else {
      if (soundEnabled) soundEngine.playClick();
      if (vibrationEnabled) triggerHaptic(40);
      setStreak(0);
      setAnsweredHistory({ ...answeredHistory, [currentQuestion.id]: false });
      showToast(
        language === 'ar' ? 'نعتذر، إجابة غير صحيحة' : 'Incorrect',
        language === 'ar' ? 'اقرأ الشرح التوضيحي لمعرفة الإجابة الصحيحة والدليل.' : 'Check the explanation below.'
      );
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      if (soundEnabled) soundEngine.playClick();
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsCompleted(true);
      if (soundEnabled) soundEngine.playSuccess();
    }
  };

  const handleRestartQuiz = () => {
    if (soundEnabled) soundEngine.playClick();
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setIsCompleted(false);
    setAnsweredHistory({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col my-auto transition-all ${
          theme === 'light'
            ? 'bg-white border-slate-200 text-slate-800'
            : theme === 'sepia'
            ? 'bg-[#2b1e15] border-amber-800/40 text-amber-50'
            : 'bg-slate-900 border-slate-800 text-slate-100'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-700/50 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-cairo flex items-center gap-2">
                <span>{language === 'ar' ? 'بنك المسابقات والمعرفة الإسلامية' : 'Islamic Quiz & Knowledge Bank'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {score} pts
                </span>
              </h2>
              <p className="text-[11px] opacity-70 font-cairo">
                {language === 'ar' ? 'اختبر معلوماتك في السيرة، قصص الأنبياء، علوم القرآن، والأحكام' : 'Test your Islamic knowledge in Seerah, Prophets & Fiqh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold font-mono">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streak}x</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Filters Bar - Replaced with an elegant mobile-optimized Popup Dropdown */}
        <div className="relative p-3 bg-black/20 border-b border-slate-800 flex items-center justify-between gap-3 z-30">
          <span className="text-xs font-bold font-cairo text-slate-400">
            {language === 'ar' ? 'تصنيف الأسئلة:' : 'Question Category:'}
          </span>
          <div className="relative">
            <button
              onClick={() => {
                if (soundEnabled) soundEngine.playClick();
                setIsFilterDropdownOpen(!isFilterDropdownOpen);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold font-cairo bg-amber-500 text-slate-950 shadow-md flex items-center gap-2 transition-all cursor-pointer hover:bg-amber-400"
            >
              <span>
                {language === 'ar'
                  ? QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.nameAr
                  : QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.nameEn}
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isFilterDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Popup Menu */}
            <AnimatePresence>
              {isFilterDropdownOpen && (
                <>
                  {/* Overlay to close on tap outside */}
                  <div
                    className="fixed inset-0 z-40 bg-transparent"
                    onClick={() => setIsFilterDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute left-0 right-0 mt-2 w-48 rounded-2xl border shadow-xl z-50 overflow-hidden ${
                      theme === 'light'
                        ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-800'
                        : theme === 'sepia'
                        ? 'bg-[#36271c] border-amber-800/40 shadow-black/50 text-amber-50'
                        : 'bg-slate-800 border-slate-700 shadow-black/50 text-slate-100'
                    }`}
                  >
                    <div className="py-1 flex flex-col">
                      {QUIZ_CATEGORIES.map((cat) => {
                        const isSelected = selectedCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => {
                              if (soundEnabled) soundEngine.playClick();
                              setSelectedCategory(cat.id);
                              setIsFilterDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 text-right font-cairo text-xs font-semibold flex items-center justify-between transition-colors hover:bg-white/5 cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/10 text-amber-400 border-r-4 border-amber-500'
                                : 'text-slate-300'
                            }`}
                          >
                            <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Main Quiz Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {!isCompleted && currentQuestion ? (
            <div className="space-y-5">
              {/* Question Progress & Category Badge */}
              <div className="flex items-center justify-between text-xs font-cairo">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                    {language === 'ar' ? currentQuestion.categoryAr : currentQuestion.categoryEn}
                  </span>
                  <span className="text-slate-400">
                    {language === 'ar'
                      ? `السؤال ${currentQuestionIndex + 1} من ${filteredQuestions.length}`
                      : `Question ${currentQuestionIndex + 1} of ${filteredQuestions.length}`}
                  </span>
                </div>

                {/* Question Difficulty Indicator */}
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  currentQuestion.difficulty === 'easy'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : currentQuestion.difficulty === 'medium'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {currentQuestion.difficulty === 'easy' ? 'سهل' : currentQuestion.difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
                />
              </div>

              {/* Question Text Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <p
                  dir="rtl"
                  className="text-right text-base sm:text-lg font-bold font-cairo leading-relaxed text-slate-100"
                >
                  {language === 'ar' ? currentQuestion.questionAr : currentQuestion.questionEn}
                </p>
              </div>

              {/* 4 Interactive Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {(language === 'ar' ? currentQuestion.optionsAr : currentQuestion.optionsEn).map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;
                  let optionStyle = 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10 hover:border-white/20';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'bg-emerald-500/25 border-emerald-400 text-emerald-200 font-bold shadow-lg shadow-emerald-950/50';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'bg-rose-500/25 border-rose-400 text-rose-200 font-bold';
                    } else {
                      optionStyle = 'bg-white/5 border-transparent opacity-40';
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold ring-2 ring-amber-400/30';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 sm:p-4 rounded-2xl border text-right font-cairo text-sm transition-all flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs font-mono shrink-0">
                          {idx === 0 ? 'أ' : idx === 1 ? 'ب' : idx === 2 ? 'ج' : 'د'}
                        </span>
                        <span className="font-semibold">{opt}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Proof Box (Revealed after answering) */}
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 space-y-2 text-right"
                >
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold font-cairo text-emerald-300">
                    <span>{language === 'ar' ? '💡 المعلومة والشرح التوضيحي' : 'Explanation & Context'}</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <p className="text-xs sm:text-sm font-cairo leading-relaxed text-slate-300" dir="rtl">
                    {language === 'ar' ? currentQuestion.explanationAr : currentQuestion.explanationEn}
                  </p>
                </motion.div>
              )}
            </div>
          ) : (
            /* Quiz Completed Final Summary Screen */
            <div className="text-center py-8 space-y-6">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/20 text-amber-400 flex items-center justify-center border-2 border-amber-400 shadow-2xl shadow-amber-500/20">
                <Trophy className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold font-cairo text-amber-300">
                  {language === 'ar' ? '🎉 ما شاء الله! مبارك إتمام المسابقة' : 'Congratulations! Quiz Completed'}
                </h3>
                <p className="text-sm font-cairo text-slate-400 max-w-md mx-auto">
                  {language === 'ar'
                    ? 'لقد اختبرت معلوماتك الدينية بنجاح وزدت من حصيلتك المعرفية في علوم دينك وسيرة نبيك.'
                    : 'You successfully completed the quiz and enriched your Islamic knowledge.'}
                </p>
              </div>

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-cairo">{language === 'ar' ? 'النقاط الكلية' : 'Total Score'}</span>
                  <span className="text-xl font-bold font-mono text-emerald-400">{score}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-cairo">{language === 'ar' ? 'أطول سلسلة' : 'Best Streak'}</span>
                  <span className="text-xl font-bold font-mono text-orange-400">{highestStreak}🔥</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-slate-400 block font-cairo">{language === 'ar' ? 'الأسئلة' : 'Questions'}</span>
                  <span className="text-xl font-bold font-mono text-amber-400">{filteredQuestions.length}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-cairo text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{language === 'ar' ? 'إعادة الاختبار من جديد' : 'Play Again'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-100 font-semibold font-cairo text-sm transition-all cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Bar (When in Question Mode) */}
        {!isCompleted && currentQuestion && (
          <div className="p-4 border-t border-slate-700/50 bg-white/5 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold font-cairo text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'خروج' : 'Exit'}
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl font-bold font-cairo text-xs transition-all cursor-pointer ${
                  selectedOption !== null
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {language === 'ar' ? 'تأكيد الإجابة ✓' : 'Confirm Answer'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-cairo text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-amber-500/20"
              >
                <span>{currentQuestionIndex < filteredQuestions.length - 1 ? (language === 'ar' ? 'السؤال التالي ←' : 'Next Question →') : (language === 'ar' ? 'عرض النتيجة النهائية 🏆' : 'View Results')}</span>
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};
