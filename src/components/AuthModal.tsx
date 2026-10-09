import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, Crown, User, BookOpen, Sparkles } from 'lucide-react';
import { ThemeMode, Language, CadetProfile, UserRole } from '../types';
import { syncUserToGoogleSheet } from '../utils/googleSheetsService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (cadet: CadetProfile) => void;
  currentCadet?: CadetProfile | null;
  theme: ThemeMode;
  lang: Language;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessLogin,
  currentCadet,
  theme,
  lang,
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState(currentCadet?.name || 'Cadet_Nova');
  const [email, setEmail] = useState(currentCadet?.email || 'nova@space.io');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentCadet?.role || (currentCadet?.isPremium ? 'Premium' : 'Free'));
  const [password, setPassword] = useState('physics123');
  const [showPassword, setShowPassword] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) return;

    setStatusMessage(lang === 'th' ? 'กำลังเชื่อมต่อ Orbital Node & Sync Google Sheets...' : 'Connecting to Orbital Node & Syncing Google Sheets...');
    
    const cadetName = username.includes('@') ? username.split('@')[0] : username;
    const cadetEmail = email || `${cadetName.toLowerCase()}@space.io`;
    const isPremium = selectedRole === 'Premium';
    const unlockedCourses = selectedRole === 'Student' ? ['PHY-701'] : selectedRole === 'Premium' ? ['ALL'] : (currentCadet?.unlockedCourses || []);

    const updatedProfile: CadetProfile = {
      name: cadetName,
      callsign: isPremium ? 'COMMANDER-01' : 'ASTRO-77',
      email: cadetEmail,
      level: isPremium ? 10 : selectedRole === 'Student' ? 8 : 7,
      sector: 'SECTOR 07-A',
      exp: isPremium ? 50000 : 32450,
      maxExp: 60000,
      syncRate: 99.8,
      faction: 'Photon',
      isPremium,
      role: selectedRole,
      unlockedCourses,
    };

    // Sync to Google Sheets Webhook
    await syncUserToGoogleSheet({
      name: cadetName,
      email: cadetEmail,
      role: selectedRole,
      unlockedCourse: selectedRole === 'Premium' ? 'ALL_PREMIUM' : selectedRole === 'Student' ? 'PHY-701' : 'None',
      action: 'LOGIN',
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      onSuccessLogin(updatedProfile);
      setStatusMessage(null);
      onClose();
    }, 500);
  };

  const handleOAuth = async (provider: string) => {
    setStatusMessage(lang === 'th' ? `กำลังเข้าสู่ระบบผ่าน ${provider} & Sync Google Sheets...` : `Authenticating with ${provider}...`);
    
    const cadetName = `${provider}_Cadet`;
    const cadetEmail = `${provider.toLowerCase()}_cadet@space.io`;
    const isPremium = selectedRole === 'Premium';
    const unlockedCourses = selectedRole === 'Student' ? ['PHY-701'] : selectedRole === 'Premium' ? ['ALL'] : [];

    const updatedProfile: CadetProfile = {
      name: cadetName,
      callsign: isPremium ? 'SPACE-COMMANDER' : 'SPACE-HERO',
      email: cadetEmail,
      level: isPremium ? 10 : 8,
      sector: 'SECTOR 07-A',
      exp: isPremium ? 50000 : 36800,
      maxExp: 60000,
      syncRate: 99.9,
      faction: 'Graviton',
      isPremium,
      role: selectedRole,
      unlockedCourses,
    };

    // Sync to Google Sheets Webhook
    await syncUserToGoogleSheet({
      name: cadetName,
      email: cadetEmail,
      role: selectedRole,
      unlockedCourse: selectedRole === 'Premium' ? 'ALL_PREMIUM' : selectedRole === 'Student' ? 'PHY-701' : 'None',
      action: 'LOGIN',
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      onSuccessLogin(updatedProfile);
      setStatusMessage(null);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl p-6 sm:p-6 bg-white text-slate-900 shadow-xl border border-slate-200 overflow-hidden"
        style={{
          boxShadow: '0 20px 40px -12px rgba(15, 23, 42, 0.12)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Compact Header */}
        <div className="mb-4 pr-8">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            {isRegister ? (lang === 'th' ? 'ลงทะเบียน Cadet ใหม่' : 'Register New Cadet') : (lang === 'th' ? 'เข้าสู่ระบบ & สิทธิ์การเข้าถึง' : 'Sign In & Access Rights')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ระบบสิทธิ์ 3 ระดับ พร้อมบันทึกสถิติผู้ใช้ลง Google Sheets อัตโนมัติ
          </p>
        </div>

        {/* 3-Tier Role Selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
            เลือกระดับสิทธิ์ผู้ใช้งาน (3 ระดับ)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Free */}
            <button
              type="button"
              onClick={() => setSelectedRole('Free')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRole === 'Free'
                  ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400 text-slate-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs mb-0.5 text-slate-800">
                <User className="w-3 h-3 text-slate-600" />
                <span>1. Free</span>
              </div>
              <div className="text-[10px] text-slate-500 leading-tight">ผู้ใช้ทั่วไป (ล็อก PDF)</div>
            </button>

            {/* Student */}
            <button
              type="button"
              onClick={() => setSelectedRole('Student')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRole === 'Student'
                  ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-400 text-indigo-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs mb-0.5 text-indigo-700">
                <BookOpen className="w-3 h-3 text-indigo-600" />
                <span>2. Student</span>
              </div>
              <div className="text-[10px] text-indigo-600 leading-tight">นักเรียนคอร์สเดี่ยว (PIN)</div>
            </button>

            {/* Premium */}
            <button
              type="button"
              onClick={() => setSelectedRole('Premium')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                selectedRole === 'Premium'
                  ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-400 text-amber-900 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs mb-0.5 text-amber-700">
                <Crown className="w-3 h-3 text-amber-500" />
                <span>3. Premium</span>
              </div>
              <div className="text-[10px] text-amber-700 leading-tight">ปลดล็อกทุกอย่าง 100%</div>
            </button>
          </div>
        </div>

        {/* 3 Social Buttons (Google, Microsoft, Apple) */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Google */}
          <button
            type="button"
            onClick={() => handleOAuth('Google')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 font-medium text-xs shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"/>
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"/>
            </svg>
            <span>Google</span>
          </button>

          {/* Microsoft */}
          <button
            type="button"
            onClick={() => handleOAuth('Microsoft')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 font-medium text-xs shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 23 23">
              <path fill="#f35325" d="M1 1h10v10H1z" />
              <path fill="#81bc06" d="M12 1h10v10H12z" />
              <path fill="#05a6f0" d="M1 12h10v10H1z" />
              <path fill="#ffba08" d="M12 12h10v10H12z" />
            </svg>
            <span>Microsoft</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            onClick={() => handleOAuth('Apple')}
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 font-medium text-xs shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.65-1.24z"/>
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              ชื่อผู้ใช้ / Cadet Callsign
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all font-medium"
              placeholder="Cadet_Nova"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              อีเมล / Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all font-medium"
              placeholder="nova@space.io"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รหัสผ่าน / Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-hidden transition-all font-medium pr-9"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all cursor-pointer active:scale-98 mt-2"
          >
            {isRegister ? 'สร้างบัญชีและบันทึกสิทธิ์' : 'ยืนยันเข้าสู่ระบบ & บันทึกสิทธิ์'}
          </button>
        </form>
      </div>
    </div>
  );
};
