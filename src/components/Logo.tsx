import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  showText?: boolean;
  variant?: 'compact' | 'full' | 'icon';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  variant = 'compact',
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-11',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
    hero: 'h-28 sm:h-32',
  };

  const containerPadding = {
    sm: 'p-1.5 rounded-lg',
    md: 'p-2 rounded-xl',
    lg: 'p-2.5 rounded-2xl',
    xl: 'p-3 rounded-2xl',
    hero: 'p-4 rounded-3xl',
  };

  const hClass = heightClasses[size] || 'h-10';
  const padClass = containerPadding[size] || 'p-2 rounded-xl';

  // Variant 1: Icon only with black container
  if (variant === 'icon' || !showText) {
    return (
      <div
        className={`bg-black ${padClass} flex items-center justify-center border border-slate-800/90 shadow-lg shrink-0 select-none ${className}`}
      >
        <img
          src="/logo-seven-space.svg"
          alt="Seven Space Labs"
          className={`${hClass} w-auto object-contain`}
          loading="eager"
        />
      </div>
    );
  }

  // Variant 2: Full Badge with black container (Perfect for Hero or Modal)
  if (variant === 'full') {
    return (
      <div
        className={`bg-black p-3 sm:p-4 rounded-2xl sm:rounded-3xl flex flex-col items-center justify-center border border-slate-800/90 shadow-2xl select-none text-center ${className}`}
      >
        <img
          src="/logo-seven-space.svg"
          alt="Seven Space Labs"
          className={`${hClass} w-auto object-contain max-w-full`}
          loading="eager"
        />
      </div>
    );
  }

  // Variant 3: Compact Navbar Lockup with Black Container for the Image
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Black Container holding the authentic black & metallic logo image */}
      <div className="bg-black p-1.5 sm:p-2 rounded-xl flex items-center justify-center border border-slate-800/90 shadow-md shrink-0">
        <img
          src="/logo-seven-space.svg"
          alt="Seven Space Labs"
          className="h-9 sm:h-10 w-auto object-contain"
          loading="eager"
        />
      </div>

      {/* Brand Text Header Details */}
      <div className="flex flex-col text-left justify-center">
        <div className="flex items-center gap-1.5">
          <span className="font-black text-sm sm:text-base tracking-[0.12em] uppercase font-sans text-slate-900 leading-tight">
            SEVEN SPACE
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold tracking-wider">
            EDTECH V2.0
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] font-black tracking-[0.2em] text-cyan-600 font-sans">
            LABS
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-[9px] tracking-wider font-mono text-slate-500 uppercase">
            Astrophysics Command
          </span>
        </div>
      </div>
    </div>
  );
};
