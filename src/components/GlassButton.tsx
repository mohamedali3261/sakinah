import React, { useState } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useApp } from '../context/AppContext';
import { soundEngine, triggerHaptic } from '../utils/audio';

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  enableHaptic?: boolean;
  enableSound?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = 'primary',
  size = 'md',
  enableHaptic = true,
  enableSound = true,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const { soundEnabled, vibrationEnabled, theme } = useApp();
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (enableSound && soundEnabled) {
      soundEngine.playClick();
    }
    if (enableHaptic && vibrationEnabled) {
      triggerHaptic(15);
    }

    // Generate glass ripple coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();

    setRipples((prev) => [...prev, { x, y, id: rippleId }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 600);

    if (onClick) {
      onClick(e);
    }
  };

  const getVariantStyles = () => {
    const isLight = theme === 'light';
    const isSepia = theme === 'sepia';

    switch (variant) {
      case 'primary':
        return isLight
          ? 'bg-emerald-600/90 text-white shadow-emerald-500/20 border-white/40 hover:bg-emerald-600'
          : isSepia
          ? 'bg-amber-700/80 text-amber-50 shadow-amber-950/40 border-amber-400/20 hover:bg-amber-700'
          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30 shadow-emerald-950/40';
      case 'accent':
        return isLight
          ? 'bg-amber-500 text-white shadow-amber-500/20 border-white/30 hover:bg-amber-600'
          : isSepia
          ? 'bg-amber-600 text-amber-100 border-amber-300/30 hover:bg-amber-500'
          : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30';
      case 'secondary':
        return isLight
          ? 'bg-slate-200/80 text-slate-800 border-slate-300 hover:bg-slate-300/80'
          : isSepia
          ? 'bg-stone-800/60 text-amber-200 border-amber-900/40 hover:bg-stone-800/90'
          : 'bg-slate-800/60 text-slate-200 border-slate-700/60 hover:bg-slate-800/90';
      case 'danger':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30 hover:bg-rose-500/30';
      case 'ghost':
        return isLight
          ? 'bg-transparent text-slate-700 hover:bg-slate-100/60 border-transparent'
          : isSepia
          ? 'bg-transparent text-amber-200 hover:bg-amber-950/40 border-transparent'
          : 'bg-transparent text-slate-300 hover:bg-slate-800/40 border-transparent';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-xs rounded-xl';
      case 'lg':
        return 'px-6 py-3 text-base rounded-2xl';
      case 'md':
      default:
        return 'px-4 py-2 text-sm rounded-xl';
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center font-cairo font-medium transition-all backdrop-blur-md border shadow-lg overflow-hidden cursor-pointer select-none ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {/* Glass Light Reflection Sheen */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-b from-white/15 to-transparent pointer-events-none opacity-60" />

      {/* Ripple Animation on click */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full pointer-events-none animate-ping bg-white/30"
          style={{
            left: ripple.x - 12,
            top: ripple.y - 12,
            width: 24,
            height: 24
          }}
        />
      ))}

      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};
