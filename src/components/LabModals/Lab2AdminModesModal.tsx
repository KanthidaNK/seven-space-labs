import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Sparkles,
  Play,
  Check,
  CheckCircle2,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CadetProfile } from '../../types';
import {
  ArenaModeConfig,
  ArenaQuizFormat,
  AcademicLevel,
  GeneralDifficulty,
  ARENA_COLOR_MAP,
  ICON_OPTIONS,
  renderArenaIcon,
  DEFAULT_ARENA_MODES,
  saveArenaModes,
} from '../../data/arenaModesData';
import { ArenaPermissionGuardModal } from './ArenaPermissionGuardModal';

interface Lab2AdminModesModalProps {
  isOpen: boolean;
  onClose: () => void;
  modes: ArenaModeConfig[];
  onSaveModes: (modes: ArenaModeConfig[]) => void;
  initialEditingId?: string | null;
  canManage?: boolean;
  user?: CadetProfile | null;
  onOpenUpgrade?: () => void;
}

const DEFAULT_ADMIN_TOPIC_TAGS: string[] = [
  'ฟิสิกส์ดาราศาสตร์และหลุมดำ',
  'เคมีอินทรีย์และการทดลอง',
  'ชีววิทยาและระบบนิเวศน์',
  'นักวิทยาศาสตร์และรางวัลโนเบล',
  'ความรู้รอบตัวและประวัติศาสตร์โลก',
  'คณิตศาสตร์และการคิดคำนวณ',
  'แสง คลื่น และเสียง',
];

const ADMIN_TAGS_STORAGE_KEY = 'lab2_admin_topic_tags_v1';

export const Lab2AdminModesModal: React.FC<Lab2AdminModesModalProps> = ({
  isOpen,
  onClose,
  modes: initialModes,
  onSaveModes,
  initialEditingId = null,
  canManage = true,
  user = null,
  onOpenUpgrade,
}) => {
  const [modes, setModes] = useState<ArenaModeConfig[]>(initialModes);

  useEffect(() => {
    setModes(initialModes);
  }, [initialModes]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formFormat, setFormFormat] = useState<ArenaQuizFormat>('quiz');
  const [formTopic, setFormTopic] = useState('');
  const [formQuestionCount, setFormQuestionCount] = useState<number>(15);
  const [formLevel, setFormLevel] = useState<AcademicLevel>('middle');
  const [formDifficulty, setFormDifficulty] = useState<GeneralDifficulty>('medium');
  const [formColorTheme, setFormColorTheme] = useState('indigo');
  const [formIconName, setFormIconName] = useState('Zap');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [modeToDelete, setModeToDelete] = useState<ArenaModeConfig | null>(null);

  // Dynamic Topic Tags for Admin with LocalStorage persistence
  const [adminTopicTags, setAdminTopicTags] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_TAGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load admin topic tags from localStorage', e);
    }
    return DEFAULT_ADMIN_TOPIC_TAGS;
  });

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const handleAddAdminTag = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmed = newTagInput.trim();
    if (!trimmed) {
      setIsAddingTag(false);
      return;
    }

    const updated = adminTopicTags.includes(trimmed)
      ? adminTopicTags
      : [...adminTopicTags, trimmed];

    setAdminTopicTags(updated);
    try {
      localStorage.setItem(ADMIN_TAGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // Auto-select topic into form input
    setFormTopic(trimmed);
    setNewTagInput('');
    setIsAddingTag(false);
  };

  const handleDeleteAdminTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const updated = adminTopicTags.filter((t) => t !== tagToDelete);
    setAdminTopicTags(updated);
    try {
      localStorage.setItem(ADMIN_TAGS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  };

  const handleResetAdminTags = () => {
    setAdminTopicTags(DEFAULT_ADMIN_TOPIC_TAGS);
    try {
      localStorage.setItem(ADMIN_TAGS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_TOPIC_TAGS));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
    triggerToast('คืนค่ารายการแท็กหัวข้อเริ่มต้นเรียบร้อยแล้ว');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2500);
  };

  const handleStartCreate = () => {
    setEditingId('NEW');
    setFormTitle('โหมดประลองหัวข้อพิเศษ');
    setFormSubtitle('ตรวจและเฉลยทันที');
    setFormFormat('quiz');
    setFormTopic('ฟิสิกส์ดาราศาสตร์และหลุมดำ');
    setFormQuestionCount(15);
    setFormLevel('middle');
    setFormDifficulty('medium');
    setFormColorTheme('indigo');
    setFormIconName('Zap');
  };

  const handleStartEdit = (mode: ArenaModeConfig) => {
    setEditingId(mode.id);
    setFormTitle(mode.title);
    setFormSubtitle(mode.subtitle);
    setFormFormat(mode.format);
    setFormTopic(mode.topic);
    setFormQuestionCount(mode.questionCount || 15);
    setFormLevel(mode.level);
    setFormDifficulty(mode.difficulty);
    setFormColorTheme(mode.colorTheme || 'indigo');
    setFormIconName(mode.iconName || 'Play');
  };

  useEffect(() => {
    if (isOpen && canManage) {
      if (initialEditingId === 'NEW') {
        handleStartCreate();
      } else if (initialEditingId) {
        const found = modes.find((m) => m.id === initialEditingId);
        if (found) {
          handleStartEdit(found);
        }
      }
    }
  }, [isOpen, initialEditingId, canManage, modes]);

  if (!isOpen) return null;

  // Modal Guard: If user lacks admin/premium permission, block access and show restriction modal
  if (!canManage) {
    return (
      <ArenaPermissionGuardModal
        isOpen={isOpen}
        onClose={onClose}
        userName={user?.name}
        userRole={user?.role}
        onOpenUpgrade={onOpenUpgrade}
      />
    );
  }

  const handleCancelForm = () => {
    setEditingId(null);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTopic.trim()) {
      alert('กรุณากรอกชื่อโหมดและหัวข้อสำหรับ AI');
      return;
    }

    const safeCount = Math.max(1, Math.min(50, Number(formQuestionCount) || 10));

    if (editingId === 'NEW') {
      const newMode: ArenaModeConfig = {
        id: `mode_${Date.now()}`,
        title: formTitle.trim(),
        subtitle: formSubtitle.trim() || (formFormat === 'quiz' ? `Multiple Choice • ${safeCount} ข้อ` : `Quick Science • ${safeCount} ข้อ (ใช่/ไม่ใช่)`),
        badgeText: `${safeCount} ข้อ`,
        format: formFormat,
        topic: formTopic.trim(),
        questionCount: safeCount,
        level: formLevel,
        difficulty: formDifficulty,
        colorTheme: formColorTheme,
        iconName: formIconName,
        isCustom: true,
        createdAt: new Date().toISOString(),
      };
      const updated = [...modes, newMode];
      setModes(updated);
      saveArenaModes(updated);
      onSaveModes(updated);
      triggerToast('สร้างโหมดใหม่เรียบร้อยแล้ว!');
    } else if (editingId) {
      const updated = modes.map((m) =>
        m.id === editingId
          ? {
              ...m,
              title: formTitle.trim(),
              subtitle: formSubtitle.trim(),
              badgeText: `${safeCount} ข้อ`,
              format: formFormat,
              topic: formTopic.trim(),
              questionCount: safeCount,
              level: formLevel,
              difficulty: formDifficulty,
              colorTheme: formColorTheme,
              iconName: formIconName,
            }
          : m
      );
      setModes(updated);
      saveArenaModes(updated);
      onSaveModes(updated);
      triggerToast('อัปเดตโหมดเรียบร้อยแล้ว!');
    }
    setEditingId(null);
  };

  const handleRequestDelete = (mode: ArenaModeConfig) => {
    setModeToDelete(mode);
  };

  const handleConfirmDelete = () => {
    if (!modeToDelete) return;
    const id = modeToDelete.id;
    const title = modeToDelete.title;

    setModes((prevModes) => {
      const updated = prevModes.filter((item) => item.id !== id);
      try {
        localStorage.setItem('lab2_arena_modes_v1', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      saveArenaModes(updated);
      onSaveModes(updated);
      return updated;
    });

    if (editingId === id) {
      setEditingId(null);
    }
    setModeToDelete(null);
    triggerToast(`ลบโหมด "${title}" เรียบร้อยแล้ว`);
  };

  const handleCancelDelete = () => {
    setModeToDelete(null);
  };

  const handleDeleteMode = (id: string) => {
    const target = modes.find((m) => m.id === id);
    if (target) {
      handleRequestDelete(target);
    }
  };

  const handleResetDefaults = () => {
    setModes(DEFAULT_ARENA_MODES);
    try {
      localStorage.setItem('lab2_arena_modes_v1', JSON.stringify(DEFAULT_ARENA_MODES));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
    saveArenaModes(DEFAULT_ARENA_MODES);
    onSaveModes(DEFAULT_ARENA_MODES);
    setEditingId(null);
    triggerToast('คืนค่าโหมดประลองเริ่มต้นเรียบร้อยแล้ว');
  };

  const currentColorConfig = ARENA_COLOR_MAP[formColorTheme] || ARENA_COLOR_MAP.indigo;

  if (!canManage) {
    return (
      <ArenaPermissionGuardModal
        isOpen={isOpen}
        onClose={onClose}
        userName={user?.name}
        userRole={user?.role}
        onOpenUpgrade={onOpenUpgrade}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Toast */}
        {showSuccessToast && (
          <div className="absolute top-4 right-4 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-950 border border-indigo-500/40 text-indigo-400">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  จัดการและสร้างโหมดประลอง (Admin Mode Studio)
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/40 text-indigo-300">
                  LAB 2 ARENA CMS
                </span>
              </div>
              <span className="text-xs text-slate-400">
                เพิ่ม สร้าง แก้ไข และลบโหมดประลอง พร้อมกำหนดสีแบนเนอร์ รูปแบบข้อสอบ (4 ตัวเลือก / แฟลชการ์ด) จำนวนข้อ และหัวข้อที่ต้องการ
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
              title="คืนค่าโหมดเริ่มต้น"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">คืนค่าเริ่มต้น</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950">
          {editingId ? (
            /* ========================================================================= */
            /* CREATE / EDIT FORM                                                        */
            /* ========================================================================= */
            <form onSubmit={handleSaveForm} className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h4 className="font-bold text-white text-base">
                    {editingId === 'NEW' ? 'สร้างโหมดประลองใหม่' : 'แก้ไขโหมดประลอง'}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800"
                >
                  ยกเลิก
                </button>
              </div>

              {/* Live Preview Card */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  พรีวิวแบนเนอร์จริงที่จะปรากฏบนหน้าเว็บ (Live Banner Preview)
                </label>
                <div
                  className={`w-full p-3.5 sm:p-4 rounded-2xl ${currentColorConfig.bg} text-white font-semibold text-xs flex items-center justify-between shadow-md transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl ${currentColorConfig.iconBg} flex items-center justify-center shrink-0`}
                    >
                      {renderArenaIcon(formIconName, 'w-4 h-4 text-white')}
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{formTitle || 'ชื่อโหมดประลอง'}</span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${currentColorConfig.badgeBg} ${currentColorConfig.badgeText}`}
                        >
                          {formFormat === 'quiz' ? '4 ตัวเลือก' : 'แฟลชการ์ด (ใช่/ไม่ใช่)'}
                        </span>
                      </div>
                      <div className={`text-[11px] font-normal ${currentColorConfig.subtextColor}`}>
                        {formSubtitle || 'คำอธิบายย่อยที่จะแสดงบนแบนเนอร์'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/80 shrink-0" />
                </div>
              </div>

              {/* 1. Mode Format Toggle: 4 Choices vs Flashcards */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                  รูปแบบการประลอง (Quiz Type)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormFormat('quiz')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                      formFormat === 'quiz'
                        ? 'bg-indigo-950/90 border-indigo-400 ring-2 ring-indigo-400 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white mb-1">
                        <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                        <span>โหมด 4 ตัวเลือก (Multiple Choice)</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        สร้างข้อสอบ {formQuestionCount} ข้อ พร้อมตัวเลือก 4 ช้อยส์ และเฉลยทันทีหลังตอบ
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        formFormat === 'quiz'
                          ? 'border-indigo-400 bg-indigo-400 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {formFormat === 'quiz' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormFormat('flashcard')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                      formFormat === 'flashcard'
                        ? 'bg-purple-950/90 border-purple-400 ring-2 ring-purple-400 text-white shadow-lg'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-sm text-white mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>โหมดแฟลชการ์ด (ใช่ / ไม่ใช่)</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        สร้างแฟลชการ์ด {formQuestionCount} ข้อ ทายถูก/ผิด พลิกการ์ดแสดงเกร็ดความรู้และคำอธิบายเฉลย
                      </div>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        formFormat === 'flashcard'
                          ? 'border-purple-400 bg-purple-400 text-slate-950'
                          : 'border-slate-600'
                      }`}
                    >
                      {formFormat === 'flashcard' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Titles & Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    ชื่อโหมดที่จะแสดงบนแบนเนอร์ *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="เช่น แฟลชการ์ดดาราศาสตร์ขั้นสูง, ข้อสอบเคมีโอลิมปิก"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-400 outline-hidden"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    คำอธิบายย่อยบนแบนเนอร์
                  </label>
                  <input
                    type="text"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    placeholder="เช่น ตะลุยโจทย์หลุมดำและคลื่นความโน้มถ่วง ตรวจและเฉลยทันที"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-400 outline-hidden"
                  />
                </div>
              </div>

              {/* 2.1 Question Count (แอดมินสามารถระบุจำนวนข้อได้) */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-200 font-mono">
                    จำนวนข้อสอบ / แฟลชการ์ด (ระบุจำนวนข้อที่ต้องการ) *
                  </label>
                  <span className="text-xs font-bold text-indigo-400 font-mono">
                    {formQuestionCount} ข้อ
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  {[5, 10, 12, 15, 20, 25, 30].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setFormQuestionCount(cnt)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        formQuestionCount === cnt
                          ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cnt} ข้อ
                    </button>
                  ))}

                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-slate-400">หรือระบุเอง:</span>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={formQuestionCount}
                      onChange={(e) => setFormQuestionCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                      className="w-16 px-2.5 py-1 text-center rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold font-mono focus:border-indigo-400 outline-hidden"
                    />
                    <span className="text-xs text-slate-400">ข้อ</span>
                  </div>
                </div>
              </div>

              {/* 3. AI Topic Input & Dynamic Topic Manager */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    หัวข้อคำสั่งสำหรับ AI ในการสร้างโจทย์ {formQuestionCount} ข้อ *
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetAdminTags}
                      className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                      title="คืนค่ารายการแท็กหัวข้อเริ่มต้น"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>คืนค่าแท็ก</span>
                    </button>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      Gemini Flash จะออกโจทย์ {formQuestionCount} ข้อตามหัวข้อนี้
                    </span>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={formTopic}
                  onChange={(e) => setFormTopic(e.target.value)}
                  placeholder="เช่น ฟิสิกส์นิวเคลียร์, หลุมดำ, พันธุศาสตร์และ DNA, สารกึ่งตัวนำ, ไฟฟ้าสถิต..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/30 outline-hidden transition-all"
                />

                  {/* Dynamic Category Tags Strip */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {adminTopicTags.map((t) => {
                    const isSelected = formTopic === t;
                    return (
                      <div
                        key={t}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormTopic(t);
                        }}
                        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-xl border transition-all cursor-pointer select-none ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
                        }`}
                      >
                        <span className="truncate max-w-[200px]">{t}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAdminTag(t, e)}
                          title={`ลบหัวข้อ "${t}"`}
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected
                              ? 'text-indigo-200 hover:text-white hover:bg-rose-600'
                              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/60'
                          }`}
                        >
                          <X className="w-2.5 h-2.5 stroke-[3]" />
                        </button>
                      </div>
                    );
                  })}

                  {/* Add New Tag Button / Inline Box */}
                  {!isAddingTag ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsAddingTag(true);
                        setNewTagInput('');
                      }}
                      className="px-2.5 py-1 text-xs rounded-xl border border-dashed border-indigo-400/80 bg-indigo-950/60 hover:bg-indigo-900/90 text-indigo-300 hover:text-white font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                      title="เพิ่มหัวข้อคำสั่ง AI ใหม่"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>เพิ่มหัวข้อใหม่</span>
                    </button>
                  ) : (
                    <div
                      className="inline-flex items-center gap-1 bg-slate-900 border border-indigo-400 ring-2 ring-indigo-500/30 rounded-xl p-0.5 animate-in fade-in zoom-in-95 duration-150"
                    >
                      <input
                        type="text"
                        autoFocus
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddAdminTag(e);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            setIsAddingTag(false);
                          }
                        }}
                        placeholder="เช่น สารกึ่งตัวนำ, ไฟฟ้าสถิต, ดาราศาสตร์ทรงกลม..."
                        className="px-2.5 py-0.5 text-xs text-white bg-transparent outline-hidden w-44 sm:w-56 placeholder:text-slate-500 font-medium"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAddAdminTag(e);
                        }}
                        className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>ตกลง</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsAddingTag(false);
                        }}
                        className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs cursor-pointer transition-colors"
                        title="ยกเลิก"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Banner Color Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  เลือกสีแบนเนอร์ที่จะปรากฏ (Banner Color Palette)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {Object.entries(ARENA_COLOR_MAP).map(([colorKey, cfg]) => (
                    <button
                      key={colorKey}
                      type="button"
                      onClick={() => setFormColorTheme(colorKey)}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${
                        formColorTheme === colorKey
                          ? 'border-white ring-2 ring-white/50 bg-slate-800 shadow-md'
                          : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${cfg.previewBg} shrink-0`} />
                      <span className="text-[11px] font-medium text-slate-200 truncate">
                        {cfg.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Icon Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-300 font-mono">
                  เลือกไอคอนแบนเนอร์ (Banner Icon)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {ICON_OPTIONS.map((opt) => {
                    const IconComp = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormIconName(opt.id)}
                        className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                          formIconName === opt.id
                            ? 'border-indigo-400 bg-indigo-950/80 text-white ring-2 ring-indigo-400 shadow-md'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title={opt.label}
                      >
                        <IconComp className="w-5 h-5" />
                        <span className="text-[9px] truncate w-full text-center">{opt.id}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 6. Level & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    ระดับชั้นการศึกษาเริ่มต้น
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-400 outline-hidden"
                  >
                    <option value="primary">ระดับประถมศึกษา (Primary)</option>
                    <option value="middle">ระดับมัธยมศึกษาตอนต้น (Middle School)</option>
                    <option value="high">ระดับมัธยมศึกษาตอนปลาย (High School / เข้มข้น)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 font-mono">
                    ระดับความยากเริ่มต้น
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-indigo-400 outline-hidden"
                  >
                    <option value="easy">ง่าย (Easy)</option>
                    <option value="medium">ปานกลาง (Medium)</option>
                    <option value="hard">ยากมาก (Hard / Expert)</option>
                  </select>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg cursor-pointer transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>บันทึกโหมด</span>
                </button>
              </div>
            </form>
          ) : (
            /* ========================================================================= */
            /* MODES LIST VIEW                                                           */
            /* ========================================================================= */
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/70 p-4 rounded-2xl border border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    รายการโหมดประลองทั้งหมด ({modes.length} โหมด)
                  </h4>
                  <p className="text-xs text-slate-400">
                    คลิก "+ สร้างโหมดใหม่" หรือกดปุ่มแก้ไข/ลบโหมดตามต้องการ
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartCreate}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ สร้างโหมดใหม่</span>
                </button>
              </div>

              {/* Modes Grid / List (แสดงผลพอดี 7 แถบ หากมีมากกว่า 7 แถบจะสไลด์เลื่อนดูได้อย่างลื่นไหล) */}
              <div className="relative">
                <div className="max-h-[580px] overflow-y-auto space-y-3 pr-2 sleek-scrollbar">
                  {modes.map((mode, index) => {
                    const colorConfig = ARENA_COLOR_MAP[mode.colorTheme] || ARENA_COLOR_MAP.indigo;
                    return (
                      <div
                        key={mode.id}
                        className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all group shrink-0"
                      >
                        {/* Left Mode Info & Live Color Bar */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="font-mono text-xs font-bold text-slate-500 w-5">
                            {index + 1}.
                          </div>
                          <div
                            className={`w-10 h-10 rounded-xl ${colorConfig.bg} text-white flex items-center justify-center shrink-0 shadow-sm`}
                          >
                            {renderArenaIcon(mode.iconName, 'w-5 h-5')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-sm truncate">
                                {mode.title}
                              </span>
                              <span
                                className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                                  mode.format === 'quiz'
                                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                                    : 'bg-purple-950 text-purple-300 border border-purple-500/30'
                                }`}
                              >
                                {mode.format === 'quiz' ? 'โหมด 4 ตัวเลือก' : 'แฟลชการ์ด (ใช่/ไม่ใช่)'}
                              </span>
                              {mode.isCustom && (
                                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                  กำหนดเอง (Custom)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 truncate mt-0.5">
                              {mode.subtitle || mode.topic}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                              <span>หัวข้อ AI: {mode.topic}</span>
                              <span>•</span>
                              <span>สี: {colorConfig.label}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(mode)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
                            title="แก้ไขโหมด"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRequestDelete(mode);
                            }}
                            className="p-2 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-500/30 transition-all cursor-pointer"
                            title="ลบโหมด"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Gradient Fade when items overflow (> 7 items) */}
                {modes.length > 7 && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent rounded-b-2xl flex items-end justify-center pb-1">
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-900/90 px-2.5 py-0.5 rounded-full border border-slate-700 shadow-sm">
                      เลื่อนดูโหมดเพิ่มเติม ({modes.length} โหมด) ↓
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal (Seven Space Labs Sci-Fi Dark Theme) */}
        {modeToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/90 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 animate-in zoom-in-95 duration-150">
              {/* Warning Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-950/50">
                <Trash2 className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <div className="text-center mb-6">
                <h4 className="text-lg sm:text-xl font-bold text-white mb-2 tracking-tight">
                  ยืนยันการลบโหมดประลอง
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  คุณต้องการลบ{' '}
                  <span className="font-bold text-rose-400 bg-rose-950/50 px-2 py-0.5 rounded-lg border border-rose-500/30">
                    "{modeToDelete.title}"
                  </span>{' '}
                  ใช่หรือไม่?
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  การกระทำนี้ไม่สามารถย้อนกลับได้
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleCancelDelete}
                  className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm transition-all cursor-pointer border border-slate-700 hover:border-slate-600"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all cursor-pointer shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>ใช่, ลบโหมดนี้</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
