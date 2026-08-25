import React from 'react';
import { toArabicDigits } from '../utils/arabicNumbers';

interface AyahEndMarkerProps {
  verseNumber: number;
  isBookmarked?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AyahEndMarker: React.FC<AyahEndMarkerProps> = ({
  verseNumber,
  isBookmarked = false,
  isSelected = false,
  onClick,
  size = 'md',
  className = ''
}) => {
  const arabicNum = toArabicDigits(verseNumber);

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-7 h-7 text-[10px]', svg: 26 };
      case 'lg':
        return { container: 'w-10 h-10 text-xs sm:text-sm', svg: 38 };
      case 'md':
      default:
        return { container: 'w-8 h-8 text-[11px] sm:text-xs', svg: 32 };
    }
  };

  const dim = getDimensions();

  return (
    <span
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      title={`آية رقم ${verseNumber}`}
      className={`inline-flex items-center justify-center relative select-none cursor-pointer align-middle mx-1 transition-all duration-200 group hover:scale-110 active:scale-95 ${dim.container} ${className}`}
    >
      {/* Authentic Ornate Islamic Rosette SVG */}
      <svg
        viewBox="0 0 44 44"
        className="w-full h-full absolute inset-0 drop-shadow-sm transition-all duration-300"
      >
        <defs>
          <linearGradient id={`goldGrad-${verseNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <linearGradient id={`emeraldGrad-${verseNumber}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="50%" stopColor="#059669" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <radialGradient id={`glow-${verseNumber}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={isBookmarked ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.25)'} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Center Glow Background */}
        <circle cx="22" cy="22" r="19" fill={`url(#glow-${verseNumber})`} />

        {/* 8-Pointed Star / Petal Rosette Outline */}
        <path
          d="M 22 2 
             C 24.5 7.5, 27.5 7.5, 33 5 
             C 33.5 10.5, 36.5 13.5, 42 14 
             C 39.5 19.5, 39.5 22.5, 42 28 
             C 36.5 28.5, 33.5 31.5, 33 37 
             C 27.5 34.5, 24.5 34.5, 22 40 
             C 19.5 34.5, 16.5 34.5, 11 37 
             C 10.5 31.5, 7.5 28.5, 2 28 
             C 4.5 22.5, 4.5 19.5, 2 14 
             C 7.5 13.5, 10.5 10.5, 11 5 
             C 16.5 7.5, 19.5 7.5, 22 2 Z"
          fill={
            isBookmarked
              ? 'rgba(180, 83, 9, 0.25)'
              : isSelected
              ? 'rgba(5, 150, 105, 0.35)'
              : 'rgba(15, 23, 42, 0.65)'
          }
          stroke={
            isBookmarked
              ? `url(#goldGrad-${verseNumber})`
              : isSelected
              ? `url(#emeraldGrad-${verseNumber})`
              : 'rgba(16, 185, 129, 0.55)'
          }
          strokeWidth="1.6"
          strokeLinejoin="round"
          className="transition-colors group-hover:stroke-amber-400"
        />

        {/* Inner Ring with Subtle Golden Filigree Dots */}
        <circle
          cx="22"
          cy="22"
          r="13.5"
          fill="none"
          stroke={
            isBookmarked
              ? 'rgba(251, 191, 36, 0.8)'
              : isSelected
              ? 'rgba(52, 211, 153, 0.9)'
              : 'rgba(209, 213, 219, 0.35)'
          }
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* 4 Cardinal Dots */}
        <circle cx="22" cy="7" r="1" fill={isBookmarked ? '#f59e0b' : '#10b981'} />
        <circle cx="37" cy="22" r="1" fill={isBookmarked ? '#f59e0b' : '#10b981'} />
        <circle cx="22" cy="37" r="1" fill={isBookmarked ? '#f59e0b' : '#10b981'} />
        <circle cx="7" cy="22" r="1" fill={isBookmarked ? '#f59e0b' : '#10b981'} />
      </svg>

      {/* Eastern Arabic Verse Number (١, ٢, ٣...) */}
      <span
        className={`relative z-10 font-bold font-amiri tracking-tighter leading-none transition-colors ${
          isBookmarked
            ? 'text-amber-300 font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'
            : isSelected
            ? 'text-emerald-200 font-extrabold'
            : 'text-amber-200/90 group-hover:text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)]'
        }`}
      >
        {arabicNum}
      </span>
    </span>
  );
};
