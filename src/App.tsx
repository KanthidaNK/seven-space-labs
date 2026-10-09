/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeMode, Language, CadetProfile } from './types';
import { StarlightBackground } from './components/StarlightBackground';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { TrendingLabsCarousel } from './components/TrendingLabsCarousel';
import { AnnouncementRow } from './components/AnnouncementRow';
import { CoreSystemsList } from './components/CoreSystemsList';
import { MissionLabsGrid } from './components/MissionLabsGrid';
import { KahootSections } from './components/KahootSections';
import AboutMe from './components/AboutMe';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { CalendarNewsModal } from './components/CalendarNewsModal';
import { CosmicRankModal } from './components/CosmicRankModal';
import { PremiumUpgradeModal } from './components/PremiumUpgradeModal';
import { OrbitalGateModal } from './components/OrbitalGateModal';
import { FloatingHomeButton } from './components/FloatingHomeButton';
import { syncUserToGoogleSheet } from './utils/googleSheetsService';

// 7 Lab Modals
import { Lab1ClassroomModal } from './components/LabModals/Lab1ClassroomModal';
import { Lab2QuizArenaModal } from './components/LabModals/Lab2QuizArenaModal';
import { Lab3AiExamModal } from './components/LabModals/Lab3AiExamModal';
import { Lab4FlipbookModal } from './components/LabModals/Lab4FlipbookModal';
import { Lab5CinemaModal } from './components/LabModals/Lab5CinemaModal';
import { Lab6CreatorModal } from './components/LabModals/Lab6CreatorModal';
import { Lab7PlaygroundModal } from './components/LabModals/Lab7PlaygroundModal';

export interface AppContentData {
  aboutText: string;
  labs: Record<number, string>;
}

export const DEFAULT_APP_CONTENT: AppContentData = {
  aboutText:
    'Seven Space Labs คือศูนย์กลางการเรียนรู้และระบบปฏิบัติการดิจิทัลแห่งอนาคต ที่ผสานฟิสิกส์ วิทยาศาสตร์ และเทคโนโลยี EdTech เข้าไว้ด้วยกัน ออกแบบมาเพื่อยกระดับศักยภาพของผู้เรียนและนักสร้างสรรค์ ผ่านสื่อการสอนอินเทอร์แอ็กทีฟ คลังความรู้ และเครื่องมือปัญญาประดิษฐ์ระดับโปรดักชัน',
  labs: {
    1: 'คลังวิดีโอออนไลน์เรียนฟิสิกส์ ดาราศาสตร์ วิทยาศาสตร์ เจาะลึก และเอกสารเรียนฉบับเข้มข้น',
    2: 'สนามประลองโจทย์วิชาการแบบจับเวลาด้วยการ์ดความรู้ flash card ท้าทายความเร็วและจัดอันดับผู้เรียนแบบเรียลไทม์',
    3: 'ระบบปัญญาประดิษฐ์สร้างแนวข้อสอบฟิสิกส์และวิทยาศาสตร์ พร้อมเฉลยละเอียดและวิเคราะห์ผลลัพธ์',
    4: 'ห้องสมุดหนังสืออิเล็กทรอนิกส์และเอกสารทางวิชาการ พร้อมฟังก์ชันพลิกหน้าเสมือนจริง',
    5: 'โรงภาพยนตร์และศูนย์รวมสารคดี วิทยาศาสตร์ ดาราศาสตร์ และฟิสิกส์ระดับสากล',
    6: 'สตูดิโอและพื้นที่สร้างสรรค์ผลงาน สื่อการสอน และนวัตกรรมดิจิทัลสำหรับผู้เรียน',
    7: 'สนามทดลองเสมือนจริงและพื้นที่พัฒนาทักษะการทดลองทางวิทยาศาสตร์และฟิสิกส์',
  },
};

export default function App() {
  // Central Data Store (Single Source of Truth) for About Me & 7 Labs descriptions
  const [appContent, setAppContent] = useState<AppContentData>(() => {
    try {
      const local = localStorage.getItem('SSL_GLOBAL_STORAGE_V1');
      if (local) {
        const parsed = JSON.parse(local);
        return {
          aboutText: parsed.aboutText || DEFAULT_APP_CONTENT.aboutText,
          labs: {
            ...DEFAULT_APP_CONTENT.labs,
            ...(parsed.labs || {}),
          },
        };
      }
    } catch (e) {
      console.warn('Error reading SSL_GLOBAL_STORAGE_V1', e);
    }

    // Fallback checks for legacy keys
    let initialAbout = DEFAULT_APP_CONTENT.aboutText;
    try {
      const legacyAbout = localStorage.getItem('ABOUT_ME_DATA');
      if (legacyAbout && legacyAbout.trim()) initialAbout = legacyAbout;
    } catch (e) {}

    let initialLabs = { ...DEFAULT_APP_CONTENT.labs };
    try {
      const legacyLabs =
        localStorage.getItem('MISSION_LABS_CUSTOM_DESCRIPTIONS') ||
        localStorage.getItem('SEVEN_LABS_DESCRIPTIONS');
      if (legacyLabs) {
        const parsedLabs = JSON.parse(legacyLabs);
        initialLabs = { ...initialLabs, ...parsedLabs };
      }
    } catch (e) {}

    return {
      aboutText: initialAbout,
      labs: initialLabs,
    };
  });

  const handleUpdateAboutText = (newAboutText: string) => {
    setAppContent((prev) => {
      const updated = { ...prev, aboutText: newAboutText };
      try {
        localStorage.setItem('SSL_GLOBAL_STORAGE_V1', JSON.stringify(updated));
        localStorage.setItem('ABOUT_ME_DATA', newAboutText);
      } catch (e) {
        console.warn('Storage save error', e);
      }
      return updated;
    });
  };

  const handleUpdateLabDescription = (labId: number, newDesc: string) => {
    setAppContent((prev) => {
      const updatedLabs = { ...prev.labs, [labId]: newDesc };
      const updated = { ...prev, labs: updatedLabs };
      try {
        localStorage.setItem('SSL_GLOBAL_STORAGE_V1', JSON.stringify(updated));
        localStorage.setItem('MISSION_LABS_CUSTOM_DESCRIPTIONS', JSON.stringify(updatedLabs));
      } catch (e) {
        console.warn('Storage save error', e);
      }
      return updated;
    });
  };

  const handleSaveAllLabDescriptions = (newLabs: Record<number, string>) => {
    setAppContent((prev) => {
      const updated = { ...prev, labs: newLabs };
      try {
        localStorage.setItem('SSL_GLOBAL_STORAGE_V1', JSON.stringify(updated));
        localStorage.setItem('MISSION_LABS_CUSTOM_DESCRIPTIONS', JSON.stringify(newLabs));
      } catch (e) {
        console.warn('Storage save error', e);
      }
      return updated;
    });
  };

  // Theme state: Pure Dark Futuristic Console ('dark') by default
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('ssl_lang') || localStorage.getItem('currentLang');
      if (saved) {
        const s = saved.toLowerCase();
        if (s === 'en') return 'en';
        if (s === 'th') return 'th';
      }
    } catch (e) {}
    return 'th';
  });
  const [activeNav, setActiveNav] = useState('lobby');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [isRankOpen, setIsRankOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [modalSection, setModalSection] = useState<'news' | 'exam' | 'leaderboard'>('news');
  const [activeLabModal, setActiveLabModal] = useState<number | null>(null);
  const [quizArenaInitialMode, setQuizArenaInitialMode] = useState<string>('mode_quiz_standard');
  const [pdfExamInitialMode, setPdfExamInitialMode] = useState<'free' | 'premium'>('free');
  const [currentClassPin, setCurrentClassPin] = useState('PHY-701');

  // Global Auth State (isLoggedIn from localStorage, default false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('isLoggedIn');
      return saved === 'true';
    } catch (e) {
      return false;
    }
  });

  // Auth Guard for Rank Dashboard
  const handleRankClick = () => {
    if (isLoggedIn) {
      setIsRankOpen(true);
    } else {
      setIsLoginOpen(true);
    }
  };

  // Cadet Profile state (Loaded & Saved with LocalStorage)
  const [cadet, setCadet] = useState<CadetProfile>(() => {
    const savedCoins = Number(localStorage.getItem('ssl_cosmic_coins') || 1000);
    const savedEnergy = Number(localStorage.getItem('ssl_cosmic_energy') || 150);
    const savedStreak = Number(localStorage.getItem('ssl_login_streak') || 3);
    const savedCheckin = localStorage.getItem('ssl_last_checkin_date') || '';

    try {
      const saved = localStorage.getItem('cadet_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          cosmicCoins: parsed.cosmicCoins ?? savedCoins,
          cosmicEnergy: parsed.cosmicEnergy ?? savedEnergy,
          loginStreak: parsed.loginStreak ?? savedStreak,
          lastCheckinDate: parsed.lastCheckinDate ?? savedCheckin,
        };
      }
    } catch (e) {
      console.warn('LocalStorage cadet load error', e);
    }
    return {
      name: 'Cadet_Nova',
      callsign: 'ASTRO-77',
      email: 'nova@space.io',
      level: 7,
      sector: 'SECTOR 07-A',
      exp: 32450,
      maxExp: 40000,
      syncRate: 99.8,
      faction: 'Photon',
      role: 'Free',
      isPremium: false,
      unlockedCourses: ['PHY-701'],
      cosmicCoins: savedCoins,
      cosmicEnergy: savedEnergy,
      loginStreak: savedStreak,
      lastCheckinDate: savedCheckin,
    };
  });

  const isPremium = Boolean(cadet.isPremium || cadet.role === 'Premium');

  const handleUpdateCadet = (updated: CadetProfile) => {
    setCadet(updated);
    try {
      localStorage.setItem('cadet_profile', JSON.stringify(updated));
      if (updated.cosmicCoins !== undefined) {
        localStorage.setItem('ssl_cosmic_coins', String(updated.cosmicCoins));
      }
      if (updated.cosmicEnergy !== undefined) {
        localStorage.setItem('ssl_cosmic_energy', String(updated.cosmicEnergy));
      }
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  };

  const handleLoginSuccess = (newCadet: CadetProfile) => {
    setIsLoggedIn(true);
    try {
      localStorage.setItem('isLoggedIn', 'true');
    } catch (e) {}
    handleUpdateCadet(newCadet);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsProfileOpen(false);
    setIsRankOpen(false);
    try {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('isLoggedIn');
    } catch (e) {}
    const guestCadet: CadetProfile = {
      name: 'Cadet_Guest',
      callsign: 'GUEST-01',
      email: 'guest@space.io',
      level: 1,
      sector: 'SECTOR 01',
      exp: 0,
      maxExp: 10000,
      syncRate: 90.0,
      faction: 'Photon',
      role: 'Free',
      isPremium: false,
      unlockedCourses: [],
      cosmicCoins: 100,
      cosmicEnergy: 50,
      loginStreak: 1,
    };
    handleUpdateCadet(guestCadet);
  };

  // Sync state with global coin and energy custom events
  useEffect(() => {
    const handleEnergyUpdate = (e: any) => {
      if (e.detail && e.detail.cosmicEnergy !== undefined) {
        setCadet((prev) => ({ ...prev, cosmicEnergy: e.detail.cosmicEnergy }));
      }
    };
    const handleCoinsUpdate = (e: any) => {
      if (e.detail && e.detail.cosmicCoins !== undefined) {
        setCadet((prev) => ({ ...prev, cosmicCoins: e.detail.cosmicCoins }));
      }
    };
    window.addEventListener('ssl_cadet_energy_updated', handleEnergyUpdate);
    window.addEventListener('ssl_cadet_coins_updated', handleCoinsUpdate);
    return () => {
      window.removeEventListener('ssl_cadet_energy_updated', handleEnergyUpdate);
      window.removeEventListener('ssl_cadet_coins_updated', handleCoinsUpdate);
    };
  }, []);

  const handleUpgradeToPremium = async () => {
    const newCoins = (cadet.cosmicCoins || 0) + 1000;
    const upgraded: CadetProfile = {
      ...cadet,
      role: 'Premium',
      isPremium: true,
      callsign: 'COMMANDER-01',
      level: Math.max(cadet.level, 10),
      exp: 50000,
      cosmicCoins: newCoins,
      unlockedCourses: ['ALL'],
    };
    try {
      localStorage.setItem('ssl_cosmic_coins', String(newCoins));
    } catch (e) {}
    handleUpdateCadet(upgraded);
    window.dispatchEvent(new CustomEvent('ssl_cadet_coins_updated', { detail: { cosmicCoins: newCoins } }));

    // Sync to Google Sheets
    await syncUserToGoogleSheet({
      name: upgraded.name,
      email: upgraded.email || 'cadet@space.io',
      role: 'Premium',
      unlockedCourse: 'ALL_PREMIUM',
      action: 'UPGRADE_PREMIUM',
      timestamp: new Date().toISOString(),
    });

    // Directly open PDF Exam Studio upon successful upgrade
    setActiveLabModal(3);
  };

  const toggleTheme = () => {
    // Locked permanently to Pure Sci-Fi Light Theme
    setTheme('white');
  };

  const toggleLang = () => {
    setLang((prev) => {
      const next: Language = prev === 'th' ? 'en' : 'th';
      try {
        localStorage.setItem('ssl_lang', next);
        localStorage.setItem('currentLang', next.toUpperCase());
      } catch (e) {}

      // Dispatch event so any dynamically opened modals/labs also render in the active language
      window.dispatchEvent(new CustomEvent('lang_changed', { detail: { lang: next } }));

      // Instant DOM update for any elements carrying data-th and data-en
      setTimeout(() => {
        document.querySelectorAll('[data-th][data-en]').forEach((el) => {
          const thVal = el.getAttribute('data-th');
          const enVal = el.getAttribute('data-en');
          if (next === 'en' && enVal) el.textContent = enVal;
          else if (next === 'th' && thVal) el.textContent = thVal;
        });
      }, 0);

      return next;
    });
  };

  useEffect(() => {
    try {
      localStorage.setItem('ssl_lang', lang);
      localStorage.setItem('currentLang', lang.toUpperCase());
    } catch (e) {}
    document.documentElement.lang = lang;
    window.dispatchEvent(new CustomEvent('lang_changed', { detail: { lang } }));
  }, [lang]);

  const handleOpenLab = (
    labId: number,
    mode?: string
  ) => {
    if (labId === 2 && mode) {
      setQuizArenaInitialMode(mode);
    }
    if (labId === 3) {
      if (mode === 'free' || mode === 'premium') {
        setPdfExamInitialMode(mode);
      }
    }
    setActiveLabModal(labId);
  };

  const handleUnlockClass = (pin: string) => {
    setCurrentClassPin(pin);
    setActiveLabModal(1);
  };

  const handleNavSelect = (id: string) => {
    setActiveNav(id);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'auth_profile' || id === 'auth_login') {
      // หน้าจอไม่ต้อง SCROLL หน้าจอคงอยู่ที่ตำแหน่งเดิม นิ่งไม่ไหล
      return;
    } else if (id === 'gate') {
      const el = document.getElementById('mission-labs') || document.getElementById('labs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setIsGateModalOpen(true);
    } else if (id === 'vault') {
      setActiveLabModal(1);
    } else if (id === 'quiz') {
      setActiveLabModal(2);
    } else if (id === 'ai-exam') {
      setPdfExamInitialMode('free');
      setActiveLabModal(3);
    } else if (id === 'library') {
      setActiveLabModal(4);
    } else if (id === 'cinema') {
      setActiveLabModal(5);
    } else if (id === 'core' || id === 'labs') {
      const el = document.getElementById('core-systems') || document.getElementById('mission-labs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'trending') {
      const el = document.getElementById('trending');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'contact') {
      const el = document.getElementById('contact-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (query: string) => {
    if (!query) return;
    const lower = query.toLowerCase();
    if (lower.includes('สอบ') || lower.includes('ai') || lower.includes('pdf')) {
      setPdfExamInitialMode('free');
      setActiveLabModal(3);
    } else if (lower.includes('ประลอง') || lower.includes('quiz') || lower.includes('เกม')) {
      setActiveLabModal(2);
    } else if (lower.includes('หนังสือ') || lower.includes('นิทาน') || lower.includes('flipbook')) {
      setActiveLabModal(4);
    } else if (lower.includes('คลิป') || lower.includes('หนัง') || lower.includes('video')) {
      setActiveLabModal(5);
    } else {
      const el = document.getElementById('mission-labs');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className={`min-h-screen relative font-kanit selection:bg-purple-600/30 transition-colors duration-300 ${
        theme === 'white' ? 'bg-[#ffffff] text-slate-900' : 'bg-[#0C0C0C] text-[#D7E2EA]'
      }`}
    >
      {/* Dynamic Starlight & Constellation Canvas Background */}
      <StarlightBackground theme={theme} />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          lang={lang}
          onToggleLang={toggleLang}
          onOpenAuth={() => setIsLoginOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenGate={() => setIsGateModalOpen(true)}
          onOpenSearch={() => {
            const input = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (input) input.focus();
          }}
          onOpenRank={handleRankClick}
          user={cadet}
          activeNav={activeNav}
          onSelectNav={handleNavSelect}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />

        {/* Section 1 - Hero Section (SEVEN SPACE LABS - ราบเรียบ ไม่มีกรอบการ์ดรองรับ แพนด้าและตัวหนังสืออยู่กับพื้นหลัง 100%) */}
        <HeroBanner
          theme={theme}
          lang={lang}
          cadet={cadet}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onSearchSubmit={handleSearchSubmit}
          onOpenRankDashboard={handleRankClick}
          onExploreLabs={() => {
            const el = document.getElementById('mission-labs');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Core Layout Main Content - Consistent Base Grid & Unified Spacing */}
        <main className="flex-1 max-w-[1400px] mx-auto px-4 sm:px-6 w-full space-y-10 pb-12">
          {/* Section 3 - LABS UPDATE */}
          <AnnouncementRow
            theme={theme}
            lang={lang}
            onOpenModalSection={(section) => {
              setModalSection(section);
              setIsCalendarOpen(true);
            }}
          />

          {/* Section 4 - TRENDING LABS */}
          <TrendingLabsCarousel lang={lang} onOpenLab={handleOpenLab} />

          {/* Section 5 - The 7 Mission Labs (Sticky Stacking Cards Effect in Full-Width Rows) */}
          <MissionLabsGrid
            theme={theme}
            lang={lang}
            user={cadet}
            appLabDescriptions={appContent.labs}
            onUpdateLabDescription={handleUpdateLabDescription}
            onSaveAllLabDescriptions={handleSaveAllLabDescriptions}
            onOpenLab={handleOpenLab}
            onUnlockClass={handleUnlockClass}
            onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
          />
        </main>

        {/* Section 6 - ABOUT ME (with 3D Floating Lab Tubes) */}
        <AboutMe
          aboutText={appContent.aboutText}
          onUpdateAboutText={handleUpdateAboutText}
          lang={lang}
        />

        {/* Footer */}
        <Footer theme={theme} lang={lang} />
      </div>

      {/* Premium Upgrade Modal (Sci-Fi alert for PDF Exam Studio lock) */}
      <PremiumUpgradeModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgradeSuccess={handleUpgradeToPremium}
        lang={lang}
      />

      {/* Calendar & Admission Specs Modal */}
      <CalendarNewsModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        lang={lang}
        initialSection={modalSection}
      />

      {/* The 7 Interactive Mission Lab Modals */}
      <Lab1ClassroomModal
        isOpen={activeLabModal === 1}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
        initialPin={currentClassPin}
        isPremium={isPremium}
        isAdmin={cadet?.role === 'Admin' || cadet?.role === 'Developer'}
        user={cadet}
      />

      <Lab2QuizArenaModal
        isOpen={activeLabModal === 2}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
        initialModeId={quizArenaInitialMode}
        user={cadet}
        isCadetPremium={isPremium}
        isAdmin={cadet?.role === 'Admin' || cadet?.role === 'Developer'}
        onOpenUpgradeModal={() => setIsPremiumModalOpen(true)}
      />

      <Lab3AiExamModal
        isOpen={activeLabModal === 3}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
        initialMode={pdfExamInitialMode}
        isCadetPremium={isPremium}
        cadet={cadet}
        isAdmin={cadet?.role === 'Admin' || cadet?.role === 'Developer'}
        isDeveloper={cadet?.role === 'Developer'}
        onOpenPremiumModal={() => setIsPremiumModalOpen(true)}
        onOpenRankHub={handleRankClick}
      />

      <Lab4FlipbookModal
        isOpen={activeLabModal === 4}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
      />

      <Lab5CinemaModal
        isOpen={activeLabModal === 5}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
      />

      <Lab6CreatorModal
        isOpen={activeLabModal === 6}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
        user={cadet}
        isAdmin={cadet?.role === 'Admin' || cadet?.role === 'Developer'}
      />

      <Lab7PlaygroundModal
        isOpen={activeLabModal === 7}
        onClose={() => setActiveLabModal(null)}
        lang={lang}
        user={cadet}
        isCadetPremium={isPremium}
        onOpenUpgrade={() => setIsPremiumModalOpen(true)}
      />

      {/* Auth Modal with 3-tier Role selection & Google Sheets sync */}
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccessLogin={(newCadet) => handleLoginSuccess(newCadet)}
        currentCadet={cadet}
        theme={theme}
        lang={lang}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        onLogout={handleLogout}
        cadet={cadet}
        lang={lang}
      />

      {/* Cosmic Rank 1-100 & Academic Certification Hub Modal (Auth Guarded) */}
      <CosmicRankModal
        isOpen={isRankOpen && isLoggedIn}
        onClose={() => setIsRankOpen(false)}
        theme={theme}
        lang={lang}
        cadet={cadet}
        onUpdateCadet={(newCadet) => handleUpdateCadet(newCadet)}
        isLoggedIn={isLoggedIn}
        onLogin={(newCadet) => handleLoginSuccess(newCadet)}
        onLogout={handleLogout}
        onOpenLab3={() => {
          setIsRankOpen(false);
          if (!isPremium) {
            setIsPremiumModalOpen(true);
          } else {
            setActiveLabModal(3);
          }
        }}
      />

      {/* Orbital Gate Assessment Hub Modal */}
      <OrbitalGateModal
        isOpen={isGateModalOpen}
        onClose={() => setIsGateModalOpen(false)}
      />

      {/* Floating HOME Button (Glassmorphism, smooth scrolls to top) */}
      <FloatingHomeButton threshold={300} />
    </div>
  );
}
