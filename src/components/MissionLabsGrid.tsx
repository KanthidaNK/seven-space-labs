import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Play,
  FileText,
  Download,
  KeyRound,
  Swords,
  Users,
  Bot,
  FileCheck,
  BookOpen,
  Eye,
  Film,
  Sparkles,
  Share2,
  Gamepad2,
  Code,
  MessageSquare,
  CheckCircle2,
  Zap,
  Globe,
  Atom,
  Lightbulb,
  Crown,
  ShieldCheck,
  Check,
  Tv,
  Plus,
  Settings,
  Search,
  Pin,
  Gem,
  Radio,
  Upload,
} from 'lucide-react';
import { ThemeMode, Language, CadetProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { syncUserToGoogleSheet } from '../utils/googleSheetsService';
import { getTierPdfQuota, DailyPdfQuota, isUserAdminOrDev } from '../utils/quotaService';
import {
  ArenaModeConfig,
  ARENA_COLOR_MAP,
  renderArenaIcon,
  loadArenaModes,
  saveArenaModes,
  LaserSwordsIcon,
} from '../data/arenaModesData';
import { Lab2AdminModesModal } from './LabModals/Lab2AdminModesModal';
import { ArenaPermissionGuardModal } from './LabModals/ArenaPermissionGuardModal';

// 1. สถาปัตยกรรมข้อมูลหลักของ THE 7 MISSION LABS
export interface LabItemData {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  coverImage: string;
  description: string;
}

export const DEFAULT_MISSION_LABS: Record<number, LabItemData> = {
  1: {
    id: 1,
    title: 'PHYSICS NO.7',
    subtitle: '— ห้องเรียนออนไลน์ & คลังเอกสาร',
    color: '#22C55E',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    description: 'คลังวิดีโอออนไลน์เรียนฟิสิกส์ ดาราศาสตร์ วิทยาศาสตร์ เจาะลึก และเอกสารเรียนฉบับเข้มข้น',
  },
  2: {
    id: 2,
    title: 'QUIZ ARENA',
    subtitle: '— ห้องประลองความรู้',
    color: '#F59E0B',
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    description: 'สนามประลองโจทย์วิชาการแบบจับเวลาด้วยการ์ดความรู้ flash card ท้าทายความเร็วและจัดอันดับผู้เรียนแบบเรียลไทม์',
  },
  3: {
    id: 3,
    title: 'PDF PILOT',
    subtitle: '— แปลงไฟล์ PDF ออกข้อสอบ AI',
    color: '#06B6D4',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    description: 'ระบบปัญญาประดิษฐ์สกัดองค์ความรู้จากเอกสาร แปลงตำราเป็นคลังข้อสอบและแบบฝึกหัดอัตโนมัติ',
  },
  4: {
    id: 4,
    title: 'XERO STUDIO',
    subtitle: '— Library Hub - ห้องสมุด',
    color: '#3B82F6',
    coverImage: 'https://images.unsplash.com/photo-1507842229452-9426f43e06a3?auto=format&fit=crop&w=600&q=80',
    description: 'ห้องสมุดดิจิทัลและคลังสื่อสิ่งพิมพ์ 3 มิติ รองรับการเข้าถึงและดาวน์โหลดอ่านแบบออฟไลน์',
  },
  5: {
    id: 5,
    title: 'EDTECH VIDEO',
    subtitle: '— โรงภาพยนตร์สื่อการเรียนรู้',
    color: '#A855F7',
    coverImage: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&w=600&q=80',
    description: 'ศูนย์รวมสื่อการเรียนรู้วิดีโอวิทยาศาสตร์ วิชาการ การทดลองวิทยาศาสตร์ พร้อมระบบจดจำประวัติการรับชมต่อเนื่อง',
  },
  6: {
    id: 6,
    title: 'COSMIC PLAYGROUND',
    subtitle: '— ชุมชน & บอร์ดกิจกรรมอวกาศ',
    color: '#FB923C',
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    description: 'ศูนย์กลางแลกเปลี่ยนความคิด และกิจกรรมวิชาการร่วมกัน',
  },
  7: {
    id: 7,
    title: 'CREATOR SPACE HUB',
    subtitle: '— คลังชีทสรุป & ครีเอเตอร์สตูดิโอ',
    color: '#EC4899',
    coverImage: 'https://images.unsplash.com/photo-1517976487507-5b3b4b45f912?auto=format&fit=crop&w=600&q=80',
    description: 'พื้นที่บ่มเพาะนักสร้างสรรค์ แหล่งเผยแพร่องค์ความรู้ และสร้างคอร์สเรียนสู่อนาคต',
  },
};

// ฟังก์ชันโหลดข้อมูลเริ่มต้นจาก LocalStorage (Single Source of Truth: 'MISSION_LABS_CUSTOM_DESCRIPTIONS')
const loadInitialMissionLabs = (): Record<number, LabItemData> => {
  let customDescriptions: Record<number, string> = {};
  try {
    const savedCustom = localStorage.getItem('MISSION_LABS_CUSTOM_DESCRIPTIONS');
    if (savedCustom) {
      customDescriptions = JSON.parse(savedCustom);
    } else {
      const legacyDesc = localStorage.getItem('SEVEN_LABS_DESCRIPTIONS');
      if (legacyDesc) customDescriptions = JSON.parse(legacyDesc);
    }
  } catch (e) {
    console.warn('Error reading custom descriptions', e);
  }

  let baseLabs: Record<number, LabItemData> = { ...DEFAULT_MISSION_LABS };
  try {
    const raw = localStorage.getItem('MISSION_LABS_STORAGE') || localStorage.getItem('SEVEN_LABS_DATA');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed[1] && parsed[1].id) {
        baseLabs = { ...DEFAULT_MISSION_LABS, ...parsed };
      } else if (parsed.covers || parsed.colors || parsed.descriptions) {
        for (let i = 1; i <= 7; i++) {
          baseLabs[i] = {
            ...DEFAULT_MISSION_LABS[i],
            coverImage: parsed.covers?.[i] || baseLabs[i].coverImage,
            color: parsed.colors?.[i] || baseLabs[i].color,
            description: parsed.descriptions?.[i] || baseLabs[i].description,
          };
        }
      }
    }
  } catch (e) {
    console.warn('Error reading MISSION_LABS_STORAGE', e);
  }

  // Single Source of Truth: Custom descriptions always override default or stored values
  for (let i = 1; i <= 7; i++) {
    if (typeof customDescriptions[i] === 'string') {
      baseLabs[i].description = customDescriptions[i];
    }
  }

  return baseLabs;
};

export const NEON_COLOR_PRESETS = [
  { label: 'Green', value: '#22C55E' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Orange', value: '#FB923C' },
  { label: 'Cyan', value: '#06B6D4' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Pink', value: '#EC4899' },
  { label: 'Red', value: '#EF4444' },
];

export const CORE_SYSTEM_ROWS = [
  {
    id: 1,
    name: 'ONLINE CLASSROOM',
    defaultDesc: 'คลังวิดีโอออนไลน์เรียนฟิสิกส์ ดาราศาสตร์ วิทยาศาสตร์ เจาะลึก และเอกสารเรียนฉบับเข้มข้น',
  },
  {
    id: 2,
    name: 'QUIZ ARENA',
    defaultDesc: 'สนามประลองโจทย์วิชาการแบบจับเวลาด้วยการ์ดความรู้ flash card ท้าทายความเร็วและจัดอันดับผู้เรียนแบบเรียลไทม์',
  },
  {
    id: 3,
    name: 'PDF PILOT',
    defaultDesc: 'ระบบปัญญาประดิษฐ์สกัดองค์ความรู้จากเอกสาร แปลงตำราเป็นคลังข้อสอบและแบบฝึกหัดอัตโนมัติ',
  },
  {
    id: 4,
    name: 'LIBRARY HUB',
    defaultDesc: 'ห้องสมุดดิจิทัลและคลังสื่อสิ่งพิมพ์ 3 มิติ รองรับการเข้าถึงและดาวน์โหลดอ่านแบบออฟไลน์',
  },
  {
    id: 5,
    name: 'EDTECH VIDEO CATALOG',
    defaultDesc: 'ศูนย์รวมสื่อการเรียนรู้วิดีโอวิทยาศาสตร์ วิชาการ การทดลองวิทยาศาสตร์ พร้อมระบบจดจำประวัติการรับชมต่อเนื่อง',
  },
  {
    id: 6,
    name: 'COMMUNITY LOUNGE',
    defaultDesc: 'ศูนย์กลางแลกเปลี่ยนความคิด และกิจกรรมวิชาการร่วมกัน',
  },
  {
    id: 7,
    name: 'SPACE LABS CHANNEL',
    defaultDesc: 'พื้นที่บ่มเพาะนักสร้างสรรค์ แหล่งเผยแพร่องค์ความรู้ และสร้างคอร์สเรียนสู่อนาคต',
  },
];

interface LabColorPickerProps {
  labId: number;
  currentColor: string;
  onSelectColor: (labId: number, color: string) => void;
}

const LabColorPicker: React.FC<LabColorPickerProps> = ({
  labId,
  currentColor,
  onSelectColor,
}) => {
  return (
    <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/15 shadow-xl animate-fadeIn">
      <span className="text-[10px] font-mono font-bold text-white/50 mr-0.5 hidden sm:inline">COLOR:</span>
      {NEON_COLOR_PRESETS.map((preset) => {
        const isSelected = currentColor.toLowerCase() === preset.value.toLowerCase();
        return (
          <button
            key={preset.value}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectColor(labId, preset.value);
            }}
            style={{
              backgroundColor: preset.value,
              boxShadow: isSelected ? `0 0 10px ${preset.value}, 0 0 4px #FFFFFF` : 'none',
              transform: isSelected ? 'scale(1.25)' : 'scale(1)',
            }}
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 cursor-pointer hover:scale-125 border ${
              isSelected ? 'border-white ring-1 ring-white/60' : 'border-black/50'
            }`}
            title={preset.label}
          />
        );
      })}
      {/* Free Color Picker Input */}
      <label
        style={{ borderColor: `${currentColor}99` }}
        className="relative w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden cursor-pointer border hover:scale-110 transition-transform ml-0.5 flex items-center justify-center bg-white/5"
        title="เลือกสีอิสระ (Custom Color)"
      >
        <input
          type="color"
          value={currentColor}
          onChange={(e) => onSelectColor(labId, e.target.value)}
          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
        />
        <span
          style={{ backgroundColor: currentColor }}
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
        />
      </label>
    </div>
  );
};

interface LabPreviewBoxProps {
  labId: number;
  color: string;
  coverImage?: string;
  isAdmin: boolean;
  onUploadClick: (labId: number) => void;
}

const LabPreviewBox: React.FC<LabPreviewBoxProps> = ({
  labId,
  color,
  coverImage,
  isAdmin,
  onUploadClick,
}) => {
  return (
    <div
      style={{
        background: `radial-gradient(120% 80% at 50% 50%, ${color}15 0%, rgba(18, 18, 22, 0.6) 100%)`,
        border: `1.5px solid ${color}60`,
        boxShadow: `0 0 25px ${color}20, inset 0 0 15px ${color}12`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      className="md:col-span-4 relative rounded-2xl overflow-hidden min-h-[280px] md:min-h-[340px] lg:min-h-[360px] flex items-center justify-center group"
    >
      {/* Background Cover Image (100% Pure Cover Art Image เต็มกรอบ ไร้ตัวหนังสือใดๆ ทับ) */}
      {coverImage ? (
        <img
          src={coverImage}
          alt={`Cover for LAB ${labId}`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      )}

      {/* ปุ่มอัปโหลดภาพหน้าปกสำหรับ Admin (แสดงเมื่อเปิด ADMIN MODE เท่านั้น) */}
      {isAdmin && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUploadClick(labId);
          }}
          className="absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded-lg bg-black/85 hover:bg-amber-400 text-amber-400 hover:text-black border border-amber-400/50 text-[10px] font-mono font-bold tracking-wider backdrop-blur-md transition-all flex items-center gap-1.5 shadow-lg cursor-pointer animate-fadeIn"
          title={`เปลี่ยนภาพหน้าปก LAB ${labId} จากเครื่อง (.png, .jpg, .webp)`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>เปลี่ยนภาพหน้าปก</span>
        </button>
      )}
    </div>
  );
};

interface BigOpenLabCardProps {
  labId: number;
  color: string;
  description: string;
  isAdmin: boolean;
  onUpdateDescription?: (labId: number, newDesc: string) => void;
  onClick: () => void;
}

const BigOpenLabCard: React.FC<BigOpenLabCardProps> = ({
  labId,
  color,
  description,
  isAdmin,
  onUpdateDescription,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={(e) => {
        if (!isAdmin && onClick) onClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: `radial-gradient(120% 80% at 50% 50%, ${color}18 0%, rgba(18, 18, 22, 0.6) 100%)`,
        border: `1.5px solid ${isHovered ? 'rgba(255, 255, 255, 0.8)' : color + '60'}`,
        boxShadow: isHovered
          ? `0 0 35px ${color}40, inset 0 0 20px ${color}20`
          : `0 0 25px ${color}20, inset 0 0 15px ${color}12`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      className={`md:col-span-8 rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[280px] md:min-h-[340px] lg:min-h-[360px] text-center transition-all duration-300 group ${
        isAdmin ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]'
      } relative overflow-hidden select-none`}
    >
      {/* ตรงกลางด้านบน: ข้อความตัวหนาใหญ่สีขาวทึบ OPEN LAB X */}
      <span
        style={{
          textShadow: isHovered
            ? `0 0 16px ${color}, 0 0 28px ${color}99, 0 2px 8px rgba(0, 0, 0, 0.8)`
            : '0 2px 8px rgba(0, 0, 0, 0.7)',
        }}
        className="text-3xl md:text-5xl font-black font-kanit tracking-wider uppercase text-white transition-all duration-300 group-hover:scale-105 select-none"
      >
        OPEN LAB {labId}
      </span>

      {/* ตรงกลางด้านล่าง: คำขยายความภาษาไทยของแต่ละแล็บ */}
      {isAdmin ? (
        <div
          className="w-full max-w-[85%] mt-3 z-50 animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <textarea
            value={description}
            onChange={(e) => {
              e.stopPropagation();
              onUpdateDescription?.(labId, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            placeholder="พิมพ์คำอธิบายแล็บที่นี่..."
            rows={2}
            className="w-full bg-black/90 text-white border border-dashed border-emerald-400/80 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y relative z-50 pointer-events-auto select-text font-kanit shadow-lg leading-relaxed text-center whitespace-pre-wrap"
            title="แก้ไขคำอธิบายสำหรับ Admin"
          />
        </div>
      ) : (
        <p className="text-white/70 text-sm md:text-base mt-4 text-center max-w-[85%] leading-relaxed font-sans select-none transition-colors group-hover:text-white/90 whitespace-pre-line">
          {description}
        </p>
      )}
    </div>
  );
};

interface MissionLabsGridProps {
  theme: ThemeMode;
  lang: Language;
  user: CadetProfile | null;
  appLabDescriptions?: Record<number, string>;
  onUpdateLabDescription?: (labId: number, desc: string) => void;
  onSaveAllLabDescriptions?: (labs: Record<number, string>) => void;
  onOpenLab: (
    labId: number,
    mode?: 'quiz' | 'flashcard' | 'didyouknow_general' | 'didyouknow_scientists' | 'free' | 'premium'
  ) => void;
  onUnlockClass: (pin: string) => void;
  onOpenPremiumModal: () => void;
}

export const MissionLabsGrid: React.FC<MissionLabsGridProps> = ({
  theme,
  lang,
  user,
  appLabDescriptions,
  onUpdateLabDescription,
  onSaveAllLabDescriptions,
  onOpenLab,
  onUnlockClass,
  onOpenPremiumModal,
}) => {
  const isWhite = theme === 'white';
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isCoreEditMode, setIsCoreEditMode] = useState<boolean>(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetLabForUpload, setTargetLabForUpload] = useState<number | null>(null);

  // Unified State สำหรับข้อมูลแล็บทั้งหมด (LAB 1 ถึง LAB 7)
  const [labsData, setLabsData] = useState<Record<number, LabItemData>>(loadInitialMissionLabs);

  const isEn = lang === 'en';

  const getLabSubtitle = (id: number) => {
    if (isEn && TRANSLATIONS.en.missionLabs.subtitles[id]) {
      return TRANSLATIONS.en.missionLabs.subtitles[id];
    }
    return labsData[id]?.subtitle || '';
  };

  const getLabDescription = (id: number) => {
    if (isEn && TRANSLATIONS.en.missionLabs.descriptions[id]) {
      return TRANSLATIONS.en.missionLabs.descriptions[id];
    }
    return appLabDescriptions?.[id] ?? labsData[id]?.description ?? '';
  };

  // Sync กับ appLabDescriptions จาก Root State หากส่งเข้ามา
  useEffect(() => {
    if (appLabDescriptions) {
      setLabsData((prev) => {
        let changed = false;
        const next = { ...prev };
        for (let i = 1; i <= 7; i++) {
          if (appLabDescriptions[i] && next[i] && next[i].description !== appLabDescriptions[i]) {
            next[i] = { ...next[i], description: appLabDescriptions[i] };
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    }
  }, [appLabDescriptions]);

  // Sync ลง LocalStorage แบบเรียลไทม์ (Single Source of Truth: 'MISSION_LABS_CUSTOM_DESCRIPTIONS')
  useEffect(() => {
    try {
      const descriptionsMap: Record<number, string> = {};
      for (let i = 1; i <= 7; i++) {
        if (labsData[i]) {
          descriptionsMap[i] = labsData[i].description;
        }
      }
      localStorage.setItem('MISSION_LABS_CUSTOM_DESCRIPTIONS', JSON.stringify(descriptionsMap));
      localStorage.setItem('MISSION_LABS_STORAGE', JSON.stringify(labsData));
      localStorage.setItem('SEVEN_LABS_DESCRIPTIONS', JSON.stringify(descriptionsMap));
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        console.warn('LocalStorage quota exceeded in useEffect. Stripping large cover images...');
        try {
          const strippedData: Record<number, LabItemData> = {};
          for (let i = 1; i <= 7; i++) {
            const lab = labsData[i];
            strippedData[i] = {
              ...lab,
              coverImage: lab?.coverImage?.startsWith('data:') ? DEFAULT_MISSION_LABS[i]?.coverImage || lab.coverImage : lab.coverImage,
            };
          }
          localStorage.setItem('MISSION_LABS_STORAGE', JSON.stringify(strippedData));
        } catch (innerErr) {
          console.error('Failed to save even after stripping:', innerErr);
        }
      }
    }
  }, [labsData]);

  // ฟังก์ชันอัปเดตฟิลด์ใดๆ ของแล็บแบบ Real-time
  const handleUpdateLabField = (labId: number, field: keyof LabItemData, value: string) => {
    setLabsData((prev) => ({
      ...prev,
      [labId]: {
        ...prev[labId],
        [field]: value,
      },
    }));
  };

  const handleUpdateDescription = (labId: number, newDesc: string) => {
    handleUpdateLabField(labId, 'description', newDesc);
    onUpdateLabDescription?.(labId, newDesc);
  };

  // ฟังก์ชันบันทึกข้อมูลถาวรเมื่อกดปุ่ม SAVE CHANGES
  const handleSaveChanges = () => {
    try {
      const descriptionsMap: Record<number, string> = {};
      for (let i = 1; i <= 7; i++) {
        if (appLabDescriptions?.[i]) {
          descriptionsMap[i] = appLabDescriptions[i];
        } else if (labsData[i]) {
          descriptionsMap[i] = labsData[i].description;
        }
      }
      onSaveAllLabDescriptions?.(descriptionsMap);
      localStorage.setItem('MISSION_LABS_CUSTOM_DESCRIPTIONS', JSON.stringify(descriptionsMap));
      localStorage.setItem('MISSION_LABS_STORAGE', JSON.stringify(labsData));
      localStorage.setItem('SEVEN_LABS_DESCRIPTIONS', JSON.stringify(descriptionsMap));
      setIsSaveSuccess(true);
      setTimeout(() => {
        setIsSaveSuccess(false);
      }, 2500);
    } catch (e: any) {
      console.error('Save changes error', e);
      if (e?.name === 'QuotaExceededError' || e?.code === 22) {
        alert('พื้นที่จัดเก็บในเบราว์เซอร์เต็ม (Local Storage Quota Exceeded) ระบบได้ทำการบีบอัดและบันทึกข้อมูลสำคัญเรียบร้อยแล้ว');
        try {
          const strippedData: Record<number, LabItemData> = {};
          for (let i = 1; i <= 7; i++) {
            const lab = labsData[i];
            strippedData[i] = {
              ...lab,
              coverImage: lab?.coverImage?.startsWith('data:') ? DEFAULT_MISSION_LABS[i]?.coverImage || lab.coverImage : lab.coverImage,
            };
          }
          localStorage.setItem('MISSION_LABS_STORAGE', JSON.stringify(strippedData));
          setIsSaveSuccess(true);
          setTimeout(() => setIsSaveSuccess(false), 2500);
        } catch (innerErr) {
          console.error('Inner save error:', innerErr);
        }
      } else {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล: ' + (e?.message || 'Unknown error'));
      }
    }
  };

  // Handler เปิดหน้าต่างเลือกไฟล์รูปภาพ
  const handleTriggerUpload = (labId: number) => {
    setTargetLabForUpload(labId);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  // Handler นำไฟล์รูปภาพแปลงเป็น Data URL ด้วย FileReader แล้วอัปเดตหน้าปกทันที
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && targetLabForUpload) {
      if (file.size > 800 * 1024) {
        alert('ขนาดไฟล์รูปภาพใหญ่เกินไป (จำกัดไม่เกิน 800KB เพื่อป้องกันพื้นที่จัดเก็บในเบราว์เซอร์เต็ม)');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (dataUrl) {
          handleUpdateLabField(targetLabForUpload, 'coverImage', dataUrl);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [classPin, setClassPin] = useState('PHY-701');
  const [unlockedSuccess, setUnlockedSuccess] = useState(false);
  const [unlockedCourses, setUnlockedCourses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('unlockedCourses');
      return saved ? JSON.parse(saved) : ['PHY-701'];
    } catch {
      return ['PHY-701'];
    }
  });

  // Premium Lock & Quotas
  const isCadetPremium = Boolean(user?.isPremium || user?.role === 'Premium');
  const [isPdfPremiumUnlocked, setIsPdfPremiumUnlocked] = useState<boolean>(() => {
    try {
      return isCadetPremium || localStorage.getItem('ssl_premium_pdf_unlocked') === 'true';
    } catch {
      return isCadetPremium;
    }
  });

  const [premiumPasscode, setPremiumPasscode] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [freeQuota, setFreeQuota] = useState<DailyPdfQuota>(getTierPdfQuota('free'));
  const [premiumQuota, setPremiumQuota] = useState<DailyPdfQuota>(getTierPdfQuota('premium'));

  // LAB 2: Dynamic Arena Modes (Admin & Premium manageable)
  const [arenaModes, setArenaModes] = useState<ArenaModeConfig[]>(() => loadArenaModes());
  const [isArenaAdminOpen, setIsArenaAdminOpen] = useState(false);
  const [arenaAdminInitialEditId, setArenaAdminInitialEditId] = useState<string | null>(null);
  const [isArenaGuardOpen, setIsArenaGuardOpen] = useState(false);

  // Role-Based Access Control (RBAC): Admin & Premium Only
  const isCadetAdmin = Boolean(
    user?.role === 'Admin' ||
    user?.role === 'Developer' ||
    (user as any)?.isAdmin === true ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_is_admin') === 'true' ||
        localStorage.getItem('ssl_is_developer') === 'true'))
  );

  const isCadetPremiumStatus = Boolean(
    user?.isPremium === true ||
    user?.role === 'Premium' ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_premium_pdf_unlocked') === 'true' ||
        localStorage.getItem('isPremium') === 'true'))
  );

  const canManageArena = isCadetAdmin || isCadetPremiumStatus;

  const handleOpenArenaAdmin = (initialEditId?: string) => {
    if (!canManageArena) {
      setIsArenaGuardOpen(true);
      return;
    }
    setArenaAdminInitialEditId(initialEditId || null);
    setIsArenaAdminOpen(true);
  };

  // Sync arena modes whenever storage updates
  useEffect(() => {
    const handleStorageChange = () => {
      setArenaModes(loadArenaModes());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('arena_modes_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('arena_modes_updated', handleStorageChange);
    };
  }, []);

  const handleSaveArenaModes = (newModes: ArenaModeConfig[]) => {
    setArenaModes(newModes);
    saveArenaModes(newModes);
  };

  useEffect(() => {
    const handleUpdate = () => {
      setFreeQuota(getTierPdfQuota('free'));
      setPremiumQuota(getTierPdfQuota('premium'));
    };
    window.addEventListener('ssl_pdf_quota_updated', handleUpdate);
    return () => window.removeEventListener('ssl_pdf_quota_updated', handleUpdate);
  }, []);

  const isAdminOrDev = Boolean(
    user?.role === 'Admin' ||
    user?.role === 'Developer' ||
    isCadetPremium ||
    isUserAdminOrDev()
  );

  const isPremium = isCadetPremium || isPdfPremiumUnlocked || isAdminOrDev;
  const isCurrentPinUnlocked = isPremium || unlockedCourses.includes(classPin.trim().toUpperCase());

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = classPin.trim().toUpperCase();
    if (!cleanPin) return;

    // Persist to unlockedCourses
    const newCourses = Array.from(new Set([...unlockedCourses, cleanPin]));
    setUnlockedCourses(newCourses);
    try {
      localStorage.setItem('unlockedCourses', JSON.stringify(newCourses));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    setUnlockedSuccess(true);

    // Sync to Google Sheets
    await syncUserToGoogleSheet({
      name: user?.name || 'Cadet_Nova',
      email: user?.email || 'nova@space.io',
      role: isPremium ? 'Premium' : 'Student',
      unlockedCourse: cleanPin,
      action: 'PIN_UNLOCK',
      timestamp: new Date().toISOString(),
    });

    setTimeout(() => {
      onUnlockClass(cleanPin);
      setUnlockedSuccess(false);
    }, 600);
  };

  const handleUnlockPdfPremium = (codeToUse?: string) => {
    const code = (codeToUse || premiumPasscode).trim().toUpperCase();
    if (
      code === 'ADMIN-PREMIUM-2026' ||
      code === 'ADMIN' ||
      code === 'PREMIUM-COMMANDER' ||
      code === 'ASTRO-VIP' ||
      code.length >= 4
    ) {
      setIsPdfPremiumUnlocked(true);
      setPasscodeSuccess(true);
      try {
        localStorage.setItem('ssl_premium_pdf_unlocked', 'true');
      } catch (e) {}

      syncUserToGoogleSheet({
        name: user?.name || 'Cadet_Nova',
        email: user?.email || 'nova@space.io',
        role: 'Premium',
        unlockedCourse: 'PREMIUM_PDF_STUDIO',
        action: 'UPGRADE_PREMIUM',
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        setPasscodeSuccess(false);
        onOpenLab(3, 'premium');
      }, 500);
    } else {
      alert('รหัสผ่านพรีเมียมไม่ถูกต้อง หรือคลิกปุ่ม "เดโม่แอดมิน (ADMIN-PREMIUM-2026)" เพื่อทดสอบระบบ');
    }
  };

  return (
    /* 5. THE 7 MISSION LABS (STICKY STACKING CARDS สมบูรณ์แบบตามตัวอย่าง) */
    <section id="labs" className="relative w-full pt-4">
      {/* Anchor for navigation */}
      <div id="mission-labs" className="absolute -top-24" />

      {/* Hidden File Input for Admin Cover Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* หัวข้อขนาดใหญ่ ขนาบข้างขวาด้วยปุ่ม ADMIN MODE ในระนาบเดียวกัน */}
      <div className="flex items-center gap-4 md:gap-6 mb-8 flex-wrap">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent font-kanit select-none">
          THE 7 MISSION LABS
        </h2>

        {/* Admin Mode Toggle Button & Save Changes Button วางขนาบข้างขวาของหัวข้อในระนาบเดียวกัน */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsAdmin((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
                : 'bg-[#141417] text-white/50 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]' : 'bg-white/30'}`} />
            <span>{isAdmin ? 'ADMIN ACTIVE' : 'ADMIN MODE'}</span>
          </button>

          {/* ปุ่ม SAVE CHANGES สำหรับ Admin (แสดงเฉพาะตอนเปิดโหมด Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={handleSaveChanges}
              className={`bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] cursor-pointer animate-fadeIn active:scale-95 ${
                isSaveSuccess ? 'bg-emerald-500/40 text-white border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]' : ''
              }`}
              title="บันทึกข้อมูลภาพ สีนีออน และข้อความทั้งหมดลง LocalStorage ถาวร"
            >
              <Check className={`w-3.5 h-3.5 transition-transform ${isSaveSuccess ? 'scale-125 text-white' : 'text-emerald-400'}`} />
              <span>{isSaveSuccess ? 'SAVED!' : 'SAVE CHANGES'}</span>
            </button>
          )}
        </div>
      </div>

      {/* คอนเทนเนอร์รายการการ์ดทั้ง 7 ใบ (Pure 2D Flat Stacking - 100% Full Width ตามสเปกต้นฉบับ) */}
      <div className="relative space-y-12 pb-2 h-auto w-full">
        {/* LAB 1 */}
        <div 
          style={{
            top: '80px',
            zIndex: 10,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">1</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 1 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 1
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[1].title}</h3>
                <span
                  style={{ color: labsData[1].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(1)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={1}
                  currentColor={labsData[1].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 1 (Physics No.7 - ฟิสิกส์ & คลื่น: Atom/Quantum Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[1].color}55`,
                boxShadow: `0 0 12px ${labsData[1].color}33, inset 0 0 8px ${labsData[1].color}20`,
                color: labsData[1].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 1 — ${labsData[1].title}`}
              aria-label="LAB 1 Atom Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1.8" fill="currentColor" />
                <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="3.8" transform="rotate(120 12 12)" />
              </svg>
            </div>
          </div>

          {/* บอร์ดพรีวิวหน้าจอภายในแล็บ */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={1}
              color={labsData[1].color}
              coverImage={labsData[1].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={1}
              color={labsData[1].color}
              description={getLabDescription(1)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(1)}
            />
          </div>
        </div>

        {/* LAB 2 */}
        <div 
          style={{
            top: '93px',
            zIndex: 20,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">2</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 2 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 2
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[2].title}</h3>
                <span
                  style={{ color: labsData[2].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(2)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={2}
                  currentColor={labsData[2].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 2 (Quiz Arena - สนามประลองความรู้: Lightning/Speedrun Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[2].color}55`,
                boxShadow: `0 0 12px ${labsData[2].color}33, inset 0 0 8px ${labsData[2].color}20`,
                color: labsData[2].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 2 — ${labsData[2].title}`}
              aria-label="LAB 2 Lightning Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={2}
              color={labsData[2].color}
              coverImage={labsData[2].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={2}
              color={labsData[2].color}
              description={getLabDescription(2)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(2)}
            />
          </div>
        </div>

        {/* LAB 3 */}
        <div 
          style={{
            top: '106px',
            zIndex: 30,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">3</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 3 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 3
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[3].title}</h3>
                <span
                  style={{ color: labsData[3].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(3)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={3}
                  currentColor={labsData[3].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 3 (PDF Pilot - แปลงไฟล์ข้อสอบ AI: Document AI/Chip Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[3].color}55`,
                boxShadow: `0 0 12px ${labsData[3].color}33, inset 0 0 8px ${labsData[3].color}20`,
                color: labsData[3].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 3 — ${labsData[3].title}`}
              aria-label="LAB 3 Document AI Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="8" y1="13" x2="16" y2="13" />
                <line x1="8" y1="17" x2="13" y2="17" />
                <circle cx="15.5" cy="17" r="1.2" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={3}
              color={labsData[3].color}
              coverImage={labsData[3].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={3}
              color={labsData[3].color}
              description={getLabDescription(3)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(3, 'free')}
            />
          </div>
        </div>

        {/* LAB 4 */}
        <div 
          style={{
            top: '119px',
            zIndex: 40,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">4</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 4 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 4
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[4].title}</h3>
                <span
                  style={{ color: labsData[4].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(4)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={4}
                  currentColor={labsData[4].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 4 (Library Hub - ห้องสมุด 3D Flipbook: Open Book/Holobook Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[4].color}55`,
                boxShadow: `0 0 12px ${labsData[4].color}33, inset 0 0 8px ${labsData[4].color}20`,
                color: labsData[4].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 4 — ${labsData[4].title}`}
              aria-label="LAB 4 Holobook Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={4}
              color={labsData[4].color}
              coverImage={labsData[4].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={4}
              color={labsData[4].color}
              description={getLabDescription(4)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(4)}
            />
          </div>
        </div>

        {/* LAB 5 */}
        <div 
          style={{
            top: '132px',
            zIndex: 50,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">5</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 5 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 5
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[5].title}</h3>
                <span
                  style={{ color: labsData[5].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(5)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={5}
                  currentColor={labsData[5].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 5 (Video Catalog - สื่อวิดีโอสตรีมมิ่ง: Play Media/Catalog Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[5].color}55`,
                boxShadow: `0 0 12px ${labsData[5].color}33, inset 0 0 8px ${labsData[5].color}20`,
                color: labsData[5].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 5 — ${labsData[5].title}`}
              aria-label="LAB 5 Play Media Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="15" x="2" y="4" rx="3" />
                <polygon points="10 8.5 15 11.5 10 14.5 10 8.5" fill="currentColor" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={5}
              color={labsData[5].color}
              coverImage={labsData[5].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={5}
              color={labsData[5].color}
              description={getLabDescription(5)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(5)}
            />
          </div>
        </div>

        {/* LAB 6 */}
        <div 
          style={{
            top: '145px',
            zIndex: 60,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">6</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 6 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 6
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[6].title}</h3>
                <span
                  style={{ color: labsData[6].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(6)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={6}
                  currentColor={labsData[6].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 6 (Cosmic Playground - ชุมชน & บอร์ดแลกเปลี่ยน: Cosmic Planet/Network Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[6].color}55`,
                boxShadow: `0 0 12px ${labsData[6].color}33, inset 0 0 8px ${labsData[6].color}20`,
                color: labsData[6].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 6 — ${labsData[6].title}`}
              aria-label="LAB 6 Cosmic Planet Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={6}
              color={labsData[6].color}
              coverImage={labsData[6].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={6}
              color={labsData[6].color}
              description={getLabDescription(6)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(6)}
            />
          </div>
        </div>

        {/* LAB 7 */}
        <div 
          style={{
            top: '158px',
            zIndex: 70,
            borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            borderLeft: '1px solid rgba(255, 255, 255, 0.05)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 -8px 20px -2px rgba(0, 0, 0, 0.75)',
          }}
          className="sticky w-full bg-[#121214] rounded-t-[28px] rounded-b-[24px] p-6 md:p-8 min-h-[480px] md:min-h-[520px] flex flex-col justify-between"
        >
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 md:gap-4 flex-wrap">
              {/* 1. ตัวเลขลำดับหน้าสุด (1-7) ทรงเรขาคณิต Heavy Block สีขาวตัน Archivo Black */}
              <span style={{ fontFamily: "'Archivo Black', sans-serif" }} className="font-archivo text-5xl md:text-6xl font-black leading-none text-white shrink-0 select-none">7</span>

              {/* 2. กรอบแคปซูลโปร่งใส [ LAB 7 ] */}
              <span className="rounded-full bg-white/[0.06] border border-white/20 backdrop-blur-sm px-2.5 py-0.5 text-[11px] font-mono font-bold text-white tracking-wider shrink-0 select-none">
                LAB 7
              </span>

              {/* 3. ชื่อหลักของแล็บ + 4. ข้อความต่อท้ายสีนีออน */}
              <div className="flex items-baseline flex-wrap gap-2.5">
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-wide font-kanit">{labsData[7].title}</h3>
                <span
                  style={{ color: labsData[7].color }}
                  className="font-bold text-base md:text-lg font-kanit tracking-normal"
                >
                  {getLabSubtitle(7)}
                </span>
              </div>

              {/* Palette นีออนพรีเซ็ตสำหรับ Admin */}
              {isAdmin && (
                <LabColorPicker
                  labId={7}
                  currentColor={labsData[7].color}
                  onSelectColor={(id, color) => handleUpdateLabField(id, 'color', color)}
                />
              )}
            </div>
            {/* Glassmorphism Neon Icon: LAB 7 (Creator Space Hub - สถาบันสร้างสรรค์คอร์ส: Spaceship/Launch Station Icon) */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: `1px solid ${labsData[7].color}55`,
                boxShadow: `0 0 12px ${labsData[7].color}33, inset 0 0 8px ${labsData[7].color}20`,
                color: labsData[7].color,
              }}
              className="w-[40px] h-[40px] rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 hover:scale-105"
              title={`LAB 7 — ${labsData[7].title}`}
              aria-label="LAB 7 Spaceship Icon"
            >
              <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-1.5" />
                <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 1.5-5 1.5-5" />
              </svg>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
            <LabPreviewBox
              labId={7}
              color={labsData[7].color}
              coverImage={labsData[7].coverImage}
              isAdmin={isAdmin}
              onUploadClick={handleTriggerUpload}
            />

            <BigOpenLabCard
              labId={7}
              color={labsData[7].color}
              description={getLabDescription(7)}
              isAdmin={isAdmin}
              onUpdateDescription={handleUpdateDescription}
              onClick={() => onOpenLab(7)}
            />
          </div>
        </div>
      </div>

      {/* 6. CORE SYSTEMS (SOLID DARK BACKGROUND + EDIT/SAVE CONTROLS) */}
      <div id="core-systems" className="mt-2 md:mt-3 mb-6 p-6 md:p-8 rounded-3xl bg-[#000000] border border-white/10 shadow-2xl text-left w-full h-auto scroll-mt-24">
        {/* Header: Left title + Right action buttons in same row */}
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6 md:mb-8">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent font-kanit select-none">
            CORE SYSTEMS
          </h2>

          {/* Right Action Controls: Edit Mode Toggle & Save Changes */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsCoreEditMode((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                isCoreEditMode
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
                  : 'bg-[#141417] text-white/50 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/5'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isCoreEditMode ? 'bg-amber-400 animate-pulse shadow-[0_0_8px_#F59E0B]' : 'bg-white/30'}`} />
              <span>{isCoreEditMode ? 'ADMIN ACTIVE' : 'EDIT MODE'}</span>
            </button>

            {/* SAVE CHANGES Button (Shown when in Edit Mode) */}
            {isCoreEditMode && (
              <button
                type="button"
                onClick={handleSaveChanges}
                className={`bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] cursor-pointer animate-fadeIn active:scale-95 ${
                  isSaveSuccess ? 'bg-emerald-500/40 text-white border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]' : ''
                }`}
                title="บันทึกข้อความทั้งหมดลง LocalStorage ถาวร"
              >
                <Check className={`w-3.5 h-3.5 transition-transform ${isSaveSuccess ? 'scale-125 text-white' : 'text-emerald-400'}`} />
                <span>{isSaveSuccess ? 'SAVED!' : 'SAVE CHANGES'}</span>
              </button>
            )}
          </div>
        </div>

        {/* แถบรายการ 7 แล็บ แบบ Interactive Hover Glass */}
        <div className="space-y-3 pt-2">
          {CORE_SYSTEM_ROWS.map((item) => {
            const desc = isEn
              ? (TRANSLATIONS.en.coreSystems.items[item.id]?.desc || item.defaultDesc)
              : (appLabDescriptions?.[item.id] ||
                 (typeof labsData[item.id]?.description === 'string'
                   ? labsData[item.id].description
                   : item.defaultDesc));
            const itemName = isEn
              ? (TRANSLATIONS.en.coreSystems.items[item.id]?.name || item.name)
              : item.name;
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!isCoreEditMode) {
                    onOpenLab(item.id, item.id === 3 ? 'free' : undefined);
                  }
                }}
                className={`group flex items-center justify-between py-4 md:py-5 px-4 md:px-6 rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-300 ease-out cursor-pointer ${
                  isCoreEditMode
                    ? 'border-white/10'
                    : 'hover:border-white/60 hover:bg-white/[0.06] hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_0_15px_rgba(255,255,255,0.35),0_0_30px_rgba(255,255,255,0.15),0_10px_25px_-5px_rgba(0,0,0,0.8)]'
                }`}
              >
                {/* ฝั่งซ้าย: ตัวเลขลำดับสีขาวตัวหนาเรขาคณิต Archivo Black (ลดขนาด 20% ให้สมดุล) + ชื่อห้อง (text-lg md:text-xl font-black) */}
                <div className="flex items-center gap-4 md:gap-6 min-w-0 pr-4 shrink-0">
                  <span
                    style={{ fontFamily: "'Archivo Black', sans-serif" }}
                    className="text-5xl md:text-6xl lg:text-7xl font-black font-archivo tracking-tight leading-none text-white group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.95)] transition-all duration-300 shrink-0 select-none w-12 md:w-16 text-center"
                  >
                    {item.id}
                  </span>
                  <span
                    data-th={item.name}
                    data-en={TRANSLATIONS.en.coreSystems.items[item.id]?.name || item.name}
                    className="text-lg md:text-xl font-black font-kanit tracking-wide text-white/95 group-hover:text-white group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] uppercase truncate transition-all duration-300"
                  >
                    {itemName}
                  </span>
                </div>

                {/* ฝั่งขวา: ข้อความคำอธิบายภาษาไทย หรือ textarea แก้ไขข้อความ */}
                <div
                  className="flex-1 max-w-[55%] md:max-w-[65%] ml-auto text-right"
                  onClick={(e) => {
                    if (isCoreEditMode) e.stopPropagation();
                  }}
                  onMouseDown={(e) => {
                    if (isCoreEditMode) e.stopPropagation();
                  }}
                >
                  {isCoreEditMode ? (
                    <textarea
                      value={appLabDescriptions?.[item.id] ?? (labsData[item.id]?.description || '')}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleUpdateDescription(item.id, e.target.value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      placeholder={isEn ? "Enter system description..." : "พิมพ์คำอธิบายระบบ..."}
                      rows={2}
                      className="w-full bg-black/90 text-white border border-dashed border-emerald-400/80 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y relative z-50 pointer-events-auto select-text font-kanit shadow-lg leading-relaxed text-left whitespace-pre-wrap"
                    />
                  ) : (
                    <p
                      data-th={item.defaultDesc}
                      data-en={TRANSLATIONS.en.coreSystems.items[item.id]?.desc || item.defaultDesc}
                      className="text-white/60 group-hover:text-white/90 text-xs md:text-sm font-sans text-right select-none leading-relaxed p-1.5 whitespace-pre-line transition-colors duration-300"
                    >
                      {desc}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin Arena Modes Studio Modal */}
      <Lab2AdminModesModal
        isOpen={isArenaAdminOpen}
        onClose={() => {
          setIsArenaAdminOpen(false);
          setArenaAdminInitialEditId(null);
        }}
        modes={arenaModes}
        onSaveModes={handleSaveArenaModes}
        initialEditingId={arenaAdminInitialEditId}
        canManage={canManageArena}
        user={user}
        onOpenUpgrade={onOpenPremiumModal}
      />

      {/* Permission Guard Modal for Unauthorized Access */}
      <ArenaPermissionGuardModal
        isOpen={isArenaGuardOpen}
        onClose={() => setIsArenaGuardOpen(false)}
        userName={user?.name}
        userRole={user?.role}
        onOpenUpgrade={onOpenPremiumModal}
      />
    </section>
  );
};
