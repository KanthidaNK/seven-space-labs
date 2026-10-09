import React from 'react';
import { ThemeMode, Language, CadetProfile } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  lang: Language;
  onToggleLang: () => void;
  onOpenAuth: () => void;
  onOpenProfile?: () => void;
  onOpenGate?: () => void;
  onOpenSearch: () => void;
  onOpenRank?: () => void;
  user: CadetProfile | null;
  activeNav: string;
  onSelectNav: (id: string) => void;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  lang,
  onToggleLang,
  onOpenAuth,
  onOpenProfile,
  onOpenGate,
  onOpenSearch,
  onOpenRank,
  user,
  activeNav,
  onSelectNav,
  isLoggedIn = false,
}) => {
  const firstNavItem = !isLoggedIn
    ? { id: 'auth_login', label: 'LOGIN', href: '#login' }
    : { id: 'auth_profile', label: 'PROFILE', href: '#profile' };

  const navItems = [
    { id: 'home', label: 'HOME', href: '#hero-section' },
    firstNavItem,
    { id: 'gate', label: 'GATE', href: '#orbital-gate' },
    { id: 'core', label: 'CORE', href: '#mission-labs' },
    { id: 'trending', label: 'TRENDING', href: '#trending' },
    { id: 'contact', label: 'CONTACT', href: '#contact-section' },
  ];

  const level = user?.level || 7;

  const handleNavClick = (id: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    onSelectNav(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'auth_login') {
      onOpenAuth();
    } else if (id === 'auth_profile') {
      // หน้าจอไม่ต้อง SCROLL ให้หน้าจอคงอยู่ที่ตำแหน่งเดิม แล้วเปิดหน้าต่าง Profile
      if (onOpenProfile) {
        onOpenProfile();
      } else {
        onOpenRank?.();
      }
    } else if (id === 'gate') {
      const el = document.getElementById('mission-labs') || document.getElementById('labs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      onOpenGate?.();
    } else if (id === 'trending') {
      const el = document.getElementById('trending');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'core' || id === 'labs') {
      const el = document.getElementById('core-systems') || document.getElementById('mission-labs') || document.getElementById('labs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'contact') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'about') {
      const el = document.getElementById('about-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-[#0C0C0C]/90 backdrop-blur-[12px] px-4 sm:px-6 py-4 flex items-center justify-between border-b border-transparent text-white">
      <div className="max-w-[1400px] w-full mx-auto flex items-center justify-between gap-4">
        {/* Left: Navigation Links (ลดขนาดลง 30% ให้กระชับ สวยงาม สมดุล) */}
        <nav className="flex items-center gap-4 sm:gap-5 md:gap-6 lg:gap-7 text-[13px] sm:text-[14px] md:text-[15px] lg:text-base font-semibold tracking-wider text-[#D7E2EA]/85 font-kanit select-none" aria-label="Dark Console Navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={(e) => handleNavClick(item.id, e)}
                className={`transition-all duration-200 cursor-pointer bg-transparent border-0 p-0 text-left ${
                  isActive
                    ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.8)] scale-[1.02]'
                    : 'text-[#94A3B8] hover:text-white hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right side: Language Switcher and clean minimal LEVEL box */}
        <div className="flex items-center gap-3">
          <button 
            id="lang-toggle"
            type="button"
            onClick={onToggleLang} 
            title="เปลี่ยนภาษา (TH / EN)"
            className="text-white hover:text-white/90 font-mono text-xs border border-white/15 hover:border-white/40 px-3.5 py-1.5 rounded-lg transition bg-[#121214] hover:bg-[#18181c] cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 select-none"
          >
            <span className={lang === 'th' ? 'font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-white/40 font-medium'}>
              TH
            </span>
            <span className="text-white/20 select-none font-light">|</span>
            <span className={lang === 'en' ? 'font-black text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.9)]' : 'text-white/40 font-medium'}>
              EN
            </span>
          </button>

          <div 
            onClick={onOpenRank}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onOpenRank?.();
            }}
            title="คลิกเพื่อเปิดระบบ Cosmic Rank 1-100 & เกียรติบัตรวิชาการ"
            className="bg-[#121214] border border-white/10 hover:border-white/20 cursor-pointer rounded-xl px-4 py-2 flex items-center shadow-xl transition active:scale-95"
          >
            <span className="text-xs font-bold text-white tracking-wide font-mono">
              LEVEL {level}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
