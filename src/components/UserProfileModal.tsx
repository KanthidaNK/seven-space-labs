import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Edit3,
  Check,
  HelpCircle,
  LogOut,
  User,
  UserCheck,
  School,
  GraduationCap,
  Mail,
  Lock,
  Phone,
  PhoneCall,
  Info,
  CheckCircle2,
  Upload,
  KeyRound,
  Cpu,
  Layers,
  Database,
  Network,
  Sparkles,
  Compass,
  Award,
  MessageCircle,
  Globe,
} from 'lucide-react';
import { CadetProfile, Language } from '../types';

export interface UserDetailedProfile {
  displayName: string;
  realNameThai: string;
  realNameEnglish: string;
  school: string;
  gradeLevel: string;
  studentPhone: string;
  parentPhone: string;
  email: string;
  passwordText: string;
  avatarType: 'preset_g' | 'preset_panda' | 'preset_astro' | 'custom';
  avatarCustomUrl?: string;
}

export const GRADE_OPTIONS = [
  'ประถมศึกษาปีที่ 1 (ป.1)',
  'ประถมศึกษาปีที่ 2 (ป.2)',
  'ประถมศึกษาปีที่ 3 (ป.3)',
  'ประถมศึกษาปีที่ 4 (ป.4)',
  'ประถมศึกษาปีที่ 5 (ป.5)',
  'ประถมศึกษาปีที่ 6 (ป.6)',
  'มัธยมศึกษาปีที่ 1 (ม.1)',
  'มัธยมศึกษาปีที่ 2 (ม.2)',
  'มัธยมศึกษาปีที่ 3 (ม.3)',
  'มัธยมศึกษาปีที่ 4 (ม.4)',
  'มัธยมศึกษาปีที่ 5 (ม.5)',
  'มัธยมศึกษาปีที่ 6 (ม.6)',
  'อุดมศึกษา / ระดับมหาวิทยาลัย',
  'ครู / อาจารย์ / ติวเตอร์',
  'ผู้ปกครอง',
];

export const DEFAULT_PROFILE: UserDetailedProfile = {
  displayName: 'GraviUser',
  realNameThai: 'กิตติภพ ดารารัตน์',
  realNameEnglish: 'Kittiphop Dararat',
  school: 'โรงเรียนเตรียมอุดมศึกษา',
  gradeLevel: 'มัธยมศึกษาปีที่ 6 (ม.6)',
  studentPhone: '089-123-4567',
  parentPhone: '081-987-6543',
  email: 'user@gravitask.app',
  passwordText: 'physics1234',
  avatarType: 'preset_astro',
};

export const STORAGE_KEY = 'ssl_user_detailed_profile_v2';

export const getStoredUserProfile = (cadet?: CadetProfile | null): UserDetailedProfile => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        realNameThai: parsed.realNameThai || parsed.realName || DEFAULT_PROFILE.realNameThai,
        realNameEnglish: parsed.realNameEnglish || DEFAULT_PROFILE.realNameEnglish,
      };
    }
    // Check legacy storage
    const legacySaved = localStorage.getItem('ssl_user_detailed_profile_v1');
    if (legacySaved) {
      const parsed = JSON.parse(legacySaved);
      return {
        ...DEFAULT_PROFILE,
        displayName: parsed.displayName || (parsed.fullName?.includes('(') ? parsed.fullName.split('(')[1].replace(')', '') : (parsed.fullName || 'GraviUser')),
        realNameThai: parsed.realNameThai || parsed.realName || (parsed.fullName?.includes('(') ? parsed.fullName.split('(')[0].trim() : (parsed.fullName || DEFAULT_PROFILE.realNameThai)),
        realNameEnglish: parsed.realNameEnglish || DEFAULT_PROFILE.realNameEnglish,
        school: parsed.school || DEFAULT_PROFILE.school,
        gradeLevel: parsed.gradeLevel || DEFAULT_PROFILE.gradeLevel,
        studentPhone: parsed.studentPhone || DEFAULT_PROFILE.studentPhone,
        parentPhone: parsed.parentPhone || DEFAULT_PROFILE.parentPhone,
        email: parsed.email || DEFAULT_PROFILE.email,
        passwordText: parsed.passwordText || DEFAULT_PROFILE.passwordText,
        avatarType: parsed.avatarType || DEFAULT_PROFILE.avatarType,
        avatarCustomUrl: parsed.avatarCustomUrl,
      };
    }
  } catch (e) {
    console.warn('Error reading profile', e);
  }
  return {
    ...DEFAULT_PROFILE,
    displayName: cadet?.name && cadet.name !== 'Cadet_Guest' ? cadet.name : DEFAULT_PROFILE.displayName,
    email: cadet?.email && cadet.email !== 'guest@space.io' ? cadet.email : DEFAULT_PROFILE.email,
  };
};

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  cadet?: CadetProfile | null;
  lang?: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  cadet,
  lang = 'th',
}) => {
  const [profile, setProfile] = useState<UserDetailedProfile>(() => getStoredUserProfile(cadet));
  const [formData, setFormData] = useState<UserDetailedProfile>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync profile when opened or cadet changes
  useEffect(() => {
    if (isOpen) {
      const current = getStoredUserProfile(cadet);
      setProfile(current);
      setFormData(current);
    }
  }, [isOpen, cadet]);

  if (!isOpen) return null;

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  const handleStartEdit = () => {
    setFormData(profile);
    setIsEditing(true);
    setSavedSuccess(false);
  };

  const handleCancelEdit = () => {
    setFormData(profile);
    setIsEditing(false);
    setShowPasswordChange(false);
  };

  const handleSaveEdit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setProfile(formData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      // Dispatch global sync event
      window.dispatchEvent(new CustomEvent('ssl_user_profile_updated', { detail: formData }));
      
      // Also update cadet name in cadet_profile if exists
      const savedCadet = localStorage.getItem('cadet_profile');
      if (savedCadet) {
        const parsed = JSON.parse(savedCadet);
        parsed.name = formData.displayName || parsed.name;
        parsed.email = formData.email || parsed.email;
        localStorage.setItem('cadet_profile', JSON.stringify(parsed));
      }
    } catch (err) {
      console.warn('Failed to save profile to localStorage', err);
    }
    setIsEditing(false);
    setShowPasswordChange(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAvatarSelect = (type: 'preset_g' | 'preset_panda' | 'preset_astro') => {
    const updated = { ...formData, avatarType: type, avatarCustomUrl: undefined };
    setFormData(updated);
    setProfile(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ssl_user_profile_updated', { detail: updated }));
    } catch (e) {}
    setShowAvatarPicker(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const customUrl = event.target?.result as string;
        const updated: UserDetailedProfile = {
          ...formData,
          avatarType: 'custom',
          avatarCustomUrl: customUrl,
        };
        setFormData(updated);
        setProfile(updated);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('ssl_user_profile_updated', { detail: updated }));
        } catch (err) {}
        setShowAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAvatarContent = () => {
    if (formData.avatarType === 'custom' && formData.avatarCustomUrl) {
      return (
        <img
          src={formData.avatarCustomUrl}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      );
    }
    if (formData.avatarType === 'preset_panda') {
      return <span className="text-3xl select-none">🐼</span>;
    }
    if (formData.avatarType === 'preset_g') {
      return (
        <span className="font-mono font-bold text-2xl text-white tracking-wider select-none">
          G
        </span>
      );
    }
    // preset_astro
    return <span className="text-3xl select-none">👨‍🚀</span>;
  };

  return (
    <>
      {/* Main Profile Modal */}
      <div
        className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-2xl overflow-hidden text-white font-sans max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-neutral-400" />
              <h2 className="text-xs font-mono font-bold text-neutral-200 tracking-widest uppercase">
                EXPLORER PROFILE
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {/* Avatar Section & Top Display Info */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker((prev) => !prev)}
                  className="w-20 h-20 rounded-full border border-white/20 bg-neutral-900 flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:border-white/40 transition-all shadow-inner"
                  title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
                >
                  {renderAvatarContent()}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAvatarPicker((prev) => !prev)}
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-neutral-800 border border-white/20 text-white hover:bg-neutral-700 transition cursor-pointer shadow"
                  title="เลือกรูปภาพ / อัปโหลดภาพ"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              {/* Quick Avatar Picker Dropdown */}
              {showAvatarPicker && (
                <div className="mt-3 p-3 bg-neutral-900 border border-white/10 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => handleAvatarSelect('preset_astro')}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border text-base transition cursor-pointer ${
                      formData.avatarType === 'preset_astro'
                        ? 'border-white bg-white/20'
                        : 'border-white/10 hover:border-white/30 bg-black/40'
                    }`}
                    title="นักบินอวกาศ"
                  >
                    👨‍🚀
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAvatarSelect('preset_panda')}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border text-base transition cursor-pointer ${
                      formData.avatarType === 'preset_panda'
                        ? 'border-white bg-white/20'
                        : 'border-white/10 hover:border-white/30 bg-black/40'
                    }`}
                    title="แพนด้า"
                  >
                    🐼
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAvatarSelect('preset_g')}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border text-xs font-mono font-bold transition cursor-pointer ${
                      formData.avatarType === 'preset_g'
                        ? 'border-white bg-white/20 text-white'
                        : 'border-white/10 hover:border-white/30 bg-black/40 text-neutral-300'
                    }`}
                    title="ตัวอักษร G"
                  >
                    G
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 bg-black/40 text-neutral-300 hover:text-white transition cursor-pointer"
                    title="อัปโหลดรูปภาพจากอุปกรณ์"
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Display Name on Card Header */}
              <div className="text-center mt-2.5">
                <h3 className="font-bold text-base text-white tracking-wide">
                  {profile.displayName || 'GraviUser'}
                </h3>
                <p className="text-xs text-neutral-400 font-mono mt-0.5">
                  {profile.gradeLevel || 'มัธยมศึกษาปีที่ 6 (ม.6)'} • {profile.school || 'โรงเรียนเตรียมอุดมศึกษา'}
                </p>
              </div>
            </div>

            {/* Success Banner */}
            {savedSuccess && (
              <div className="flex items-center gap-2 p-2.5 bg-neutral-900 border border-white/20 rounded-xl text-xs text-neutral-200 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>บันทึกข้อมูลและซิงค์กับระบบเกียรติบัตรเรียบร้อยแล้ว</span>
              </div>
            )}

            {/* Form Fields Section */}
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              {/* 1. ชื่อโปรไฟล์ (Profile Name / Display Name) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  1. ชื่อโปรไฟล์ (Profile Name / Display Name)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="เช่น GraviUser, AstroNova"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-medium"
                  />
                ) : (
                  <div className="text-sm font-semibold text-white">{profile.displayName || '-'}</div>
                )}
              </div>

              {/* 2. ชื่อ - นามสกุล (ภาษาไทย) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-neutral-400" />
                  2. ชื่อ - นามสกุล (ภาษาไทย)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.realNameThai}
                    onChange={(e) => setFormData({ ...formData, realNameThai: e.target.value })}
                    placeholder="เช่น กิตติภพ ดารารัตน์"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition"
                  />
                ) : (
                  <div className="text-sm font-medium text-white">{profile.realNameThai || '-'}</div>
                )}
              </div>

              {/* 3. ชื่อ - นามสกุล (ภาษาอังกฤษ - สำหรับออกเกียรติบัตรสากล) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-neutral-400" />
                  3. ชื่อ - นามสกุล (ภาษาอังกฤษ - สำหรับออกเกียรติบัตรสากล)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.realNameEnglish}
                    onChange={(e) => setFormData({ ...formData, realNameEnglish: e.target.value })}
                    placeholder="เช่น Kittiphop Dararat"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-mono"
                  />
                ) : (
                  <div className="text-sm font-medium text-white font-mono">{profile.realNameEnglish || '-'}</div>
                )}
              </div>

              {/* 4. โรงเรียน / สถาบัน (School / Institution) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-neutral-400" />
                  4. โรงเรียน / สถาบัน (School / Institution)
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.school}
                    onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                    placeholder="เช่น โรงเรียนเตรียมอุดมศึกษา"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition"
                  />
                ) : (
                  <div className="text-sm font-medium text-white">{profile.school || '-'}</div>
                )}
              </div>

              {/* 5. ระดับการศึกษา (Grade Level - Dropdown Select) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-neutral-400" />
                  5. ระดับการศึกษา (Grade Level)
                </label>
                {isEditing ? (
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition cursor-pointer"
                  >
                    {GRADE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm font-medium text-white">{profile.gradeLevel || '-'}</div>
                )}
              </div>

              {/* 6. เบอร์โทรศัพท์ผู้เรียน (Student Phone Number) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  6. เบอร์โทรศัพท์ผู้เรียน (Student Phone Number)
                </label>
                <p className="text-[10px] text-neutral-500">
                  สำหรับติดต่อติดตามการเข้าห้องเรียน / การใช้งานระบบ
                </p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.studentPhone}
                    onChange={(e) => setFormData({ ...formData, studentPhone: e.target.value })}
                    placeholder="08x-xxx-xxxx"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-mono mt-1"
                  />
                ) : (
                  <div className="text-xs font-mono text-white">{profile.studentPhone || '-'}</div>
                )}
              </div>

              {/* 7. เบอร์โทรศัพท์ผู้ปกครอง (Parent / Guardian Phone Number) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-neutral-400" />
                  7. เบอร์โทรศัพท์ผู้ปกครอง (Parent / Guardian Phone Number)
                </label>
                <p className="text-[10px] text-neutral-500">
                  สำหรับติดต่อกรณีฉุกเฉิน
                </p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="08x-xxx-xxxx"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-mono mt-1"
                  />
                ) : (
                  <div className="text-xs font-mono text-white">{profile.parentPhone || '-'}</div>
                )}
              </div>

              {/* 8. อีเมลบัญชี (Account Email) */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-neutral-400" />
                  8. อีเมลบัญชี (Account Email)
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@gravitask.app"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-mono"
                  />
                ) : (
                  <div className="text-xs font-mono text-neutral-300">{profile.email || '-'}</div>
                )}
              </div>

              {/* 9. รหัสผ่าน (Password) พร้อมปุ่มเปลี่ยนรหัสผ่าน */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-medium text-neutral-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-neutral-400" />
                    9. รหัสผ่าน (Password)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (!isEditing) setIsEditing(true);
                      setShowPasswordChange((prev) => !prev);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-white underline font-mono cursor-pointer flex items-center gap-1"
                  >
                    <KeyRound className="w-3 h-3" />
                    {showPasswordChange ? 'ซ่อนรหัส' : 'เปลี่ยนรหัสผ่าน'}
                  </button>
                </div>
                {showPasswordChange ? (
                  <input
                    type="text"
                    value={formData.passwordText}
                    onChange={(e) => setFormData({ ...formData, passwordText: e.target.value })}
                    placeholder="กรอกรหัสผ่านใหม่"
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-white/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition font-mono mt-1"
                  />
                ) : (
                  <div className="text-xs font-mono text-neutral-400 tracking-widest">••••••••</div>
                )}
              </div>
            </form>
          </div>

          {/* Footer Actions */}
          <div className="pt-3.5 mt-3.5 border-t border-white/10 space-y-2">
            {/* Edit / Save Buttons */}
            {isEditing ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-3 border border-white/15 hover:bg-white/5 text-neutral-300 rounded-xl text-xs font-medium transition cursor-pointer"
                >
                  {lang === 'en' ? 'Cancel' : 'ยกเลิก'}
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEdit()}
                  className="py-2 px-3 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                >
                  <Check className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Save Changes' : 'บันทึกข้อมูล'}
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleStartEdit}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Edit Profile' : 'แก้ไขข้อมูลโปรไฟล์'}
              </button>
            )}

            {/* Help & System Docs Button (Opens Modal) */}
            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="w-full py-2 px-3 bg-transparent hover:bg-white/5 text-neutral-400 hover:text-neutral-200 border border-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              {lang === 'en' ? 'Help & System Docs' : 'ช่วยเหลือ & ข้อมูลระบบ'}
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={handleLogoutClick}
              className="w-full py-2 px-3 border border-red-500/20 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              {lang === 'en' ? 'LOG OUT' : 'LOG OUT / ออกจากระบบ'}
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Modal: ช่วยเหลือ & ข้อมูลระบบ (Seven Space Labs Docs Modal) */}
      {isHelpOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsHelpOpen(false)}
        >
          <div
            className="relative bg-[#0d0d14] border border-white/15 rounded-2xl p-6 sm:p-7 max-w-lg w-full shadow-2xl overflow-hidden text-white font-sans max-h-[88vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-neutral-300" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  ช่วยเหลือ & ข้อมูลระบบ
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close help modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 custom-scrollbar text-xs">
              {/* Introduction Description */}
              <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-xl leading-relaxed text-neutral-300">
                <p>
                  <strong className="text-white">Seven Space Labs</strong> คือระบบปฏิบัติการดิจิทัลและศูนย์การเรียนรู้แห่งอนาคต ผสานฟิสิกส์เชิงลึก เทคโนโลยี EdTech และ Interactive Virtual Labs
                </p>
              </div>

              {/* System Specs Table (ตารางข้อมูลจำเพาะระบบ) */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                  ตารางข้อมูลจำเพาะระบบ (System Specs)
                </h4>
                <div className="bg-white/[0.02] border border-white/10 rounded-xl divide-y divide-white/5 overflow-hidden text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-neutral-500" />
                      เวอร์ชัน
                    </span>
                    <span className="font-mono text-white font-medium">v1.0.0 (Production Release)</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-neutral-500" />
                      สถาปัตยกรรม
                    </span>
                    <span className="text-white text-right max-w-[60%]">Single-Page Application (SPA) ควบคุม State ในหน้าเดียว</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Database className="w-3 h-3 text-neutral-500" />
                      ระบบจัดเก็บข้อมูล
                    </span>
                    <span className="text-white text-right max-w-[60%]">Client-side State พร้อม Local Storage Persistence</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-neutral-400 flex items-center gap-1.5">
                      <Network className="w-3 h-3 text-neutral-500" />
                      เครือข่ายเชื่อมต่อ
                    </span>
                    <span className="text-white text-right max-w-[60%]">GraviTask Engine & Real-time Labs Ecosystem</span>
                  </div>
                </div>
              </div>

              {/* Basic Shortcuts & Usage (ส่วนแนะนำคีย์ลัดและแนวทางใช้งาน) */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-neutral-400" />
                  ส่วนแนะนำคีย์ลัดและแนวทางใช้งาน (Basic Shortcuts & Usage)
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-2.5">
                    <span className="mt-0.5 p-1 rounded bg-white/10 text-white">
                      <Layers className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-neutral-300 leading-relaxed">
                      คลิกการ์ดในส่วน <strong className="text-white">TRENDING LABS</strong> เพื่อเปิดใช้งานการทดลองและแบบจำลองฟิสิกส์
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-2.5">
                    <span className="mt-0.5 p-1 rounded bg-white/10 text-white">
                      <Award className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-neutral-300 leading-relaxed">
                      ตรวจสอบสถานะการเรียนและสะสมแต้มผ่านระบบ <strong className="text-white">LEVEL 7 (Cosmic Rank)</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-start gap-2.5">
                    <span className="mt-0.5 p-1 rounded bg-white/10 text-white">
                      <MessageCircle className="w-3.5 h-3.5" />
                    </span>
                    <div className="text-neutral-300 leading-relaxed">
                      เชื่อมต่อและประสานงานผ่าน LINE Official Account ในปุ่ม <strong className="text-white">CONTACT ME</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Close Button */}
            <div className="pt-3.5 mt-3.5 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsHelpOpen(false)}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-200 text-black font-semibold rounded-xl text-xs transition cursor-pointer shadow"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
