import React from 'react';
import { Logo } from './Logo';
import { ThemeMode, Language } from '../types';

interface FooterProps {
  theme: ThemeMode;
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ theme, lang }) => {
  return (
    <footer className="relative w-full pt-12 pb-20 bg-[#070709] text-white border-t border-slate-800/80 transition-colors" id="contact-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tech Stack Bar */}
        <div className="p-4 rounded-2xl bg-[#111113] border border-[#222222] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-white">Seven Space Labs (SSL)</span>
            <span className="hidden md:inline">// Tech Stack: Google AI Studio • Gemini API • Physics Engine</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Domain Node:</span>
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-purple-300 font-bold">
              sevenspacelabs.com
            </span>
          </div>
        </div>

        {/* Bottom Brand Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" showText={false} />
            <span className="font-bold text-white">Seven Space Labs</span>
            <span>—</span>
            <span
              data-th="ระบบการเรียนรู้สะเต็มศึกษาและฟิสิกส์อวกาศยุคใหม่"
              data-en="Next-Gen Orbital STEM Learning System"
            >
              {lang === 'en'
                ? 'Next-Gen Orbital STEM Learning System'
                : 'ระบบการเรียนรู้สะเต็มศึกษาและฟิสิกส์อวกาศยุคใหม่'}
            </span>
          </div>

          <div
            data-th="© 2025-2026 Seven Space Labs. สงวนลิขสิทธิ์ทั้งหมด"
            data-en="© 2025-2026 Seven Space Labs. All rights synchronized."
          >
            {lang === 'en'
              ? '© 2025-2026 Seven Space Labs. All rights synchronized.'
              : '© 2025-2026 Seven Space Labs. สงวนลิขสิทธิ์ทั้งหมด'}
          </div>
        </div>
      </div>
    </footer>
  );
};

