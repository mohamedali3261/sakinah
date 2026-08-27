export type QuranPaperThemeId = 'cream' | 'antique' | 'dark' | 'emerald' | 'pure_white' | 'warm_amber';

export interface QuranPaperTheme {
  id: QuranPaperThemeId;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  bgClass: string;
  borderClass: string;
  innerBorderClass: string;
  textClass: string;
  accentClass: string;
  rosetteClass: string;
  headerBgClass: string;
  footerBgClass: string;
  previewBg: string;
  previewBorder: string;
  previewText: string;
  isDark: boolean;
}

export const QURAN_PAPER_THEMES: QuranPaperTheme[] = [
  {
    id: 'cream',
    nameAr: 'الكريمي الهادئ للعين',
    nameEn: 'Soothing Eye Cream',
    descriptionAr: 'ورق ناعم هادئ بلون عاجي مريح للبصر أثناء القراءة الطويلة.',
    descriptionEn: 'Soft ivory cream paper designed for reduced eye strain during extended reading.',
    bgClass: 'bg-[#fbf7ed]',
    borderClass: 'border-amber-400/80',
    innerBorderClass: 'border-amber-400/30',
    textClass: 'text-[#1c1917]',
    accentClass: 'text-amber-700',
    rosetteClass: 'text-amber-600',
    headerBgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-900',
    footerBgClass: 'border-amber-500/20 text-amber-900/70',
    previewBg: '#fbf7ed',
    previewBorder: '#d97706',
    previewText: '#1c1917',
    isDark: false
  },
  {
    id: 'antique',
    nameAr: 'الورق العتيق التراثي',
    nameEn: 'Antique Parchment',
    descriptionAr: 'مظهر المخطوطات القديمة وورق البردي التراثي الأصيل بعبق التاريخ.',
    descriptionEn: 'Vintage papyrus parchment aesthetic reminiscent of classical Quranic manuscripts.',
    bgClass: 'bg-[#f0e4d0]',
    borderClass: 'border-[#926239]',
    innerBorderClass: 'border-[#b6895b]/40',
    textClass: 'text-[#2a170a]',
    accentClass: 'text-[#87491b]',
    rosetteClass: 'text-[#a15e29]',
    headerBgClass: 'bg-[#87491b]/10 border-[#87491b]/20 text-[#542d10]',
    footerBgClass: 'border-[#87491b]/20 text-[#542d10]/70',
    previewBg: '#f0e4d0',
    previewBorder: '#926239',
    previewText: '#2a170a',
    isDark: false
  },
  {
    id: 'dark',
    nameAr: 'الداكن الليلي',
    nameEn: 'Dark Night Canvas',
    descriptionAr: 'خلفية داكنة خافتة للقراءة الليلية والتهجد دون إجهاد العين في الظلام.',
    descriptionEn: 'Deep obsidian night backdrop optimized for Tahajjud and low-light reading.',
    bgClass: 'bg-[#09151e]',
    borderClass: 'border-emerald-500/40',
    innerBorderClass: 'border-emerald-500/25',
    textClass: 'text-[#f1f5f9]',
    accentClass: 'text-emerald-400',
    rosetteClass: 'text-amber-400',
    headerBgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300',
    footerBgClass: 'border-emerald-500/20 text-slate-400',
    previewBg: '#09151e',
    previewBorder: '#10b981',
    previewText: '#f1f5f9',
    isDark: true
  },
  {
    id: 'emerald',
    nameAr: 'الزمردي القرآني الهادئ',
    nameEn: 'Soothing Emerald Sage',
    descriptionAr: 'درجة مهدئة من الأخضر الساجي المستوحى من طبعات المصاحف الفاخرة.',
    descriptionEn: 'Peaceful sage green tone inspired by classical royal illuminated Qurans.',
    bgClass: 'bg-[#ecf5f0]',
    borderClass: 'border-emerald-600/70',
    innerBorderClass: 'border-emerald-600/30',
    textClass: 'text-[#063323]',
    accentClass: 'text-emerald-800',
    rosetteClass: 'text-emerald-700',
    headerBgClass: 'bg-emerald-700/10 border-emerald-700/20 text-emerald-900',
    footerBgClass: 'border-emerald-700/20 text-emerald-900/70',
    previewBg: '#ecf5f0',
    previewBorder: '#059669',
    previewText: '#063323',
    isDark: false
  },
  {
    id: 'warm_amber',
    nameAr: 'الكهرماني الدافئ (قنديل)',
    nameEn: 'Warm Candlelight Amber',
    descriptionAr: 'دفء إضاءة القنديل والشموع الهادئة لقراءة خاشعة في سكون الليل.',
    descriptionEn: 'Cozy amber tone evoking traditional lantern and candlelight ambience.',
    bgClass: 'bg-[#26170d]',
    borderClass: 'border-amber-600/60',
    innerBorderClass: 'border-amber-500/30',
    textClass: 'text-[#fef3c7]',
    accentClass: 'text-amber-400',
    rosetteClass: 'text-amber-300',
    headerBgClass: 'bg-amber-500/15 border-amber-500/30 text-amber-200',
    footerBgClass: 'border-amber-500/20 text-amber-300/70',
    previewBg: '#26170d',
    previewBorder: '#d97706',
    previewText: '#fef3c7',
    isDark: true
  },
  {
    id: 'pure_white',
    nameAr: 'الأبيض الناصع العصري',
    nameEn: 'Pure Modern White',
    descriptionAr: 'ورق أبيض ناصع عالي التباين ووضوح فائق للحروف والتشكيل.',
    descriptionEn: 'High contrast clean white canvas with crisp typography and gold borders.',
    bgClass: 'bg-white',
    borderClass: 'border-slate-300 shadow-md',
    innerBorderClass: 'border-amber-400/40',
    textClass: 'text-[#0f172a]',
    accentClass: 'text-emerald-700',
    rosetteClass: 'text-amber-600',
    headerBgClass: 'bg-slate-100 border-slate-200 text-slate-800',
    footerBgClass: 'border-slate-200 text-slate-600',
    previewBg: '#ffffff',
    previewBorder: '#cbd5e1',
    previewText: '#0f172a',
    isDark: false
  }
];

export const getPaperThemeById = (id?: string): QuranPaperTheme => {
  return QURAN_PAPER_THEMES.find((t) => t.id === id) || QURAN_PAPER_THEMES[0];
};
