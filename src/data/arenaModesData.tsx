import React from 'react';
export { LaserSwordsIcon } from '../components/icons/LaserSwordsIcon';
import {
  Play,
  Sparkles,
  Globe,
  Atom,
  Lightbulb,
  Target,
  Dna,
  Rocket,
  FlaskConical,
  BookOpen,
  Brain,
  Swords,
  Flame,
  GraduationCap,
  Zap,
  Trophy,
} from 'lucide-react';

export type ArenaQuizFormat = 'quiz' | 'flashcard';
export type AcademicLevel = 'primary' | 'middle' | 'high';
export type GeneralDifficulty = 'easy' | 'medium' | 'hard';

export interface ArenaModeConfig {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  format: ArenaQuizFormat; // 'quiz' (4 ตัวเลือก) หรือ 'flashcard' (ใช่/ไม่ใช่)
  topic: string;
  questionCount?: number; // จำนวนข้อที่แอดมินกำหนด
  level: AcademicLevel;
  difficulty: GeneralDifficulty;
  colorTheme: string; // 'indigo' | 'purple' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'fuchsia' | 'teal' | 'blue' | 'slate'
  iconName: string;
  isCustom?: boolean;
  createdAt?: string;
}

export const ARENA_COLOR_MAP: Record<
  string,
  {
    bg: string;
    hoverBg: string;
    border: string;
    badgeBg: string;
    badgeText: string;
    iconBg: string;
    iconColor: string;
    subtextColor: string;
    ringColor: string;
    previewBg: string;
    label: string;
  }
> = {
  indigo: {
    bg: 'bg-indigo-600',
    hoverBg: 'hover:bg-indigo-700',
    border: 'border-indigo-500',
    badgeBg: 'bg-indigo-800',
    badgeText: 'text-indigo-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-indigo-100',
    ringColor: 'ring-indigo-400',
    previewBg: 'bg-indigo-600',
    label: 'น้ำเงินคราม (Indigo)',
  },
  purple: {
    bg: 'bg-purple-600',
    hoverBg: 'hover:bg-purple-700',
    border: 'border-purple-500',
    badgeBg: 'bg-purple-800',
    badgeText: 'text-purple-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-purple-100',
    ringColor: 'ring-purple-400',
    previewBg: 'bg-purple-600',
    label: 'ม่วงนีออน (Purple)',
  },
  emerald: {
    bg: 'bg-emerald-600',
    hoverBg: 'hover:bg-emerald-700',
    border: 'border-emerald-500',
    badgeBg: 'bg-emerald-800',
    badgeText: 'text-emerald-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-emerald-100',
    ringColor: 'ring-emerald-400',
    previewBg: 'bg-emerald-600',
    label: 'เขียวมรกต (Emerald)',
  },
  amber: {
    bg: 'bg-amber-600',
    hoverBg: 'hover:bg-amber-700',
    border: 'border-amber-500',
    badgeBg: 'bg-amber-800',
    badgeText: 'text-amber-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-amber-100',
    ringColor: 'ring-amber-400',
    previewBg: 'bg-amber-600',
    label: 'ส้มทอง (Amber)',
  },
  rose: {
    bg: 'bg-rose-600',
    hoverBg: 'hover:bg-rose-700',
    border: 'border-rose-500',
    badgeBg: 'bg-rose-800',
    badgeText: 'text-rose-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-rose-100',
    ringColor: 'ring-rose-400',
    previewBg: 'bg-rose-600',
    label: 'แดงกุหลาบ (Rose)',
  },
  cyan: {
    bg: 'bg-cyan-600',
    hoverBg: 'hover:bg-cyan-700',
    border: 'border-cyan-500',
    badgeBg: 'bg-cyan-800',
    badgeText: 'text-cyan-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-cyan-100',
    ringColor: 'ring-cyan-400',
    previewBg: 'bg-cyan-600',
    label: 'ฟ้าไซอัน (Cyan)',
  },
  fuchsia: {
    bg: 'bg-fuchsia-600',
    hoverBg: 'hover:bg-fuchsia-700',
    border: 'border-fuchsia-500',
    badgeBg: 'bg-fuchsia-800',
    badgeText: 'text-fuchsia-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-fuchsia-100',
    ringColor: 'ring-fuchsia-400',
    previewBg: 'bg-fuchsia-600',
    label: 'ชมพูสด (Fuchsia)',
  },
  teal: {
    bg: 'bg-teal-600',
    hoverBg: 'hover:bg-teal-700',
    border: 'border-teal-500',
    badgeBg: 'bg-teal-800',
    badgeText: 'text-teal-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-teal-100',
    ringColor: 'ring-teal-400',
    previewBg: 'bg-teal-600',
    label: 'เขียวหัวเป็ด (Teal)',
  },
  blue: {
    bg: 'bg-blue-600',
    hoverBg: 'hover:bg-blue-700',
    border: 'border-blue-500',
    badgeBg: 'bg-blue-800',
    badgeText: 'text-blue-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-blue-100',
    ringColor: 'ring-blue-400',
    previewBg: 'bg-blue-600',
    label: 'น้ำเงินโคบอลต์ (Blue)',
  },
  slate: {
    bg: 'bg-slate-700',
    hoverBg: 'hover:bg-slate-800',
    border: 'border-slate-500',
    badgeBg: 'bg-slate-900',
    badgeText: 'text-slate-200',
    iconBg: 'bg-white/20',
    iconColor: 'text-white',
    subtextColor: 'text-slate-200',
    ringColor: 'ring-slate-400',
    previewBg: 'bg-slate-700',
    label: 'เทาชาร์โคล (Slate)',
  },
};

export const DEFAULT_ARENA_MODES: ArenaModeConfig[] = [
  {
    id: 'mode_quiz_standard',
    title: 'โหมดข้อสอบสี่ตัวเลือก',
    subtitle: 'Multiple Choice • ตรวจและเฉลยทันที',
    format: 'quiz',
    topic: 'กฎการเคลื่อนที่ของนิวตันและแรงดึงดูดสากล',
    questionCount: 15,
    level: 'middle',
    difficulty: 'medium',
    colorTheme: 'indigo',
    iconName: 'Play',
    isCustom: false,
  },
  {
    id: 'mode_flashcard_science',
    title: 'โหมดแฟลชการ์ดวิทยาศาสตร์',
    subtitle: 'Quick Science • ใช่ / ไม่ใช่',
    format: 'flashcard',
    topic: 'ฟิสิกส์ ดาราศาสตร์ และการทดลองวิทยาศาสตร์',
    questionCount: 15,
    level: 'middle',
    difficulty: 'medium',
    colorTheme: 'purple',
    iconName: 'Sparkles',
    isCustom: false,
  },
  {
    id: 'mode_flashcard_general',
    title: 'แฟลชการ์ดความรู้ทั่วไป',
    subtitle: 'ประชากร, ภูมิศาสตร์, สถิติโลก (ง่าย / ปานกลาง / ยากมาก)',
    badgeText: '15 ข้อ',
    format: 'flashcard',
    topic: 'ความรู้ทั่วไปรอบโลกและประเทศไทย',
    questionCount: 15,
    level: 'middle',
    difficulty: 'medium',
    colorTheme: 'emerald',
    iconName: 'Globe',
    isCustom: false,
  },
  {
    id: 'mode_flashcard_scientists',
    title: 'แฟลชการ์ดนักวิทยาศาสตร์',
    subtitle: 'กล้องโทรทรรศน์, ไอน์สไตน์, มารี กูรี, นิวตัน, เทสลา',
    badgeText: '15 ข้อ',
    format: 'flashcard',
    topic: 'นักวิทยาศาสตร์ สิ่งประดิษฐ์ และรางวัลโนเบล',
    questionCount: 15,
    level: 'middle',
    difficulty: 'medium',
    colorTheme: 'amber',
    iconName: 'Atom',
    isCustom: false,
  },
];

export const ICON_OPTIONS: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'Play', label: 'Play (เล่น)', icon: Play },
  { id: 'Sparkles', label: 'ประกายดาว (Sparkles)', icon: Sparkles },
  { id: 'Globe', label: 'โลก (Globe)', icon: Globe },
  { id: 'Atom', label: 'อะตอม (Atom)', icon: Atom },
  { id: 'Lightbulb', label: 'หลอดไฟ (Lightbulb)', icon: Lightbulb },
  { id: 'Target', label: 'เป้าหมาย (Target)', icon: Target },
  { id: 'Dna', label: 'ดีเอ็นเอ (DNA)', icon: Dna },
  { id: 'Rocket', label: 'จรวด (Rocket)', icon: Rocket },
  { id: 'FlaskConical', label: 'ขวดทดลอง (Flask)', icon: FlaskConical },
  { id: 'BookOpen', label: 'หนังสือ (Book)', icon: BookOpen },
  { id: 'Brain', label: 'สมอง (Brain)', icon: Brain },
  { id: 'Swords', label: 'ดาบประลอง (Swords)', icon: Swords },
  { id: 'Flame', label: 'เปลวไฟ (Flame)', icon: Flame },
  { id: 'GraduationCap', label: 'หมวกปริญญา (Graduation)', icon: GraduationCap },
  { id: 'Zap', label: 'สายฟ้า (Zap)', icon: Zap },
  { id: 'Trophy', label: 'ถ้วยรางวัล (Trophy)', icon: Trophy },
];

export const renderArenaIcon = (iconName: string, className = 'w-4 h-4') => {
  const found = ICON_OPTIONS.find((i) => i.id === iconName);
  if (found) {
    const IconComp = found.icon;
    return <IconComp className={className} />;
  }
  return <Play className={className} />;
};

const STORAGE_KEY = 'lab2_arena_modes_v1';

export function loadArenaModes(): ArenaModeConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load arena modes from localStorage', e);
  }
  return DEFAULT_ARENA_MODES;
}

export function saveArenaModes(modes: ArenaModeConfig[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(modes));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('arena_modes_updated'));
    }
  } catch (e) {
    console.warn('Failed to save arena modes to localStorage', e);
  }
}

export function resetArenaModes(): ArenaModeConfig[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Failed to reset arena modes', e);
  }
  return DEFAULT_ARENA_MODES;
}
