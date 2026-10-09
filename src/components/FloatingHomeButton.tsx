import React, { useState, useEffect } from 'react';
import { ArrowUp, Home } from 'lucide-react';

interface FloatingHomeButtonProps {
  threshold?: number;
}

export const FloatingHomeButton: React.FC<FloatingHomeButtonProps> = ({
  threshold = 300,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="กลับสู่ด้านบนสุด (HOME)"
      className="fixed bottom-6 right-6 z-40 bg-black/70 hover:bg-black/90 text-white backdrop-blur-xl border border-white/20 hover:border-white/60 px-4 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.7),0_0_15px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.35)] flex items-center gap-2 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer font-kanit font-bold text-xs md:text-sm tracking-wider select-none animate-fadeIn group"
    >
      <div className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white/20 flex items-center justify-center transition-colors">
        <ArrowUp className="w-3.5 h-3.5 text-white group-hover:translate-y-[-2px] transition-transform duration-200" />
      </div>
      <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
        HOME
      </span>
      <Home className="w-3.5 h-3.5 text-white/60 group-hover:text-white transition-colors ml-0.5" />
    </button>
  );
};
