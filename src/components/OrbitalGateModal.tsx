import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Award, RotateCcw, ShieldAlert, KeyRound, Lock, Sparkles, Check, AlertCircle, Copy } from 'lucide-react';

interface OrbitalGateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000; // 90 days in milliseconds

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

// Reusable Neon Stroke Lock Icon
const NeonLockIcon: React.FC<{ className?: string }> = ({ className = 'w-4.5 h-4.5' }) => (
  <svg
    className={`${className} text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.8)] shrink-0`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const LOCK_KEYS: Record<string, string> = {
  'ประถม': 'know_lock_primary',
  'มัธยมต้น': 'know_lock_secondary',
  'มัธยมปลาย': 'know_lock_highschool',
  'IQ': 'apti_lock_iq',
  'EQ': 'apti_lock_eq',
  'ความถนัด': 'apti_lock_aptitude',
};

// Cooldown intervals by category: STEM = 30 Days, Apti = 90 Days
const ITEM_COOLDOWN_MS: Record<string, number> = {
  'ประถม': THIRTY_DAYS_MS,
  'มัธยมต้น': THIRTY_DAYS_MS,
  'มัธยมปลาย': THIRTY_DAYS_MS,
  'IQ': NINETY_DAYS_MS,
  'EQ': NINETY_DAYS_MS,
  'ความถนัด': NINETY_DAYS_MS,
};

// Helper: Calculate Today's Dynamic Daily Token (7S-MMDD)
const getTodayDynamicToken = (): string => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `7S-${month}${day}`;
};

// Helper: Real-time Rolling Cooldown calculation per item
const getRemainingDaysForItem = (itemName: string): number => {
  const key = LOCK_KEYS[itemName];
  if (!key) return 0;
  const stored = localStorage.getItem(key);
  if (!stored) return 0;
  const timestamp = parseInt(stored, 10);
  if (isNaN(timestamp)) {
    localStorage.removeItem(key);
    return 0;
  }
  const cooldownMs = ITEM_COOLDOWN_MS[itemName] || NINETY_DAYS_MS;
  const targetDate = timestamp + cooldownMs;
  const diffMs = targetDate - Date.now();
  const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  if (remainingDays <= 0) {
    localStorage.removeItem(key);
    return 0;
  }
  return remainingDays;
};

// Helper: Check Admin status from URL params, localStorage, or cadet profile
const checkIsAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  const searchParams = window.location.search;
  if (searchParams.includes('admin=true') || searchParams.includes('admin=1')) return true;
  if (localStorage.getItem('isAdminMode') === 'true' || localStorage.getItem('adminMode') === 'true') return true;
  try {
    const profile = localStorage.getItem('cadet_profile');
    if (profile) {
      const parsed = JSON.parse(profile);
      if (parsed.role === 'Admin' || parsed.isAdmin) return true;
    }
  } catch (e) {}
  return false;
};

// STEM Questions by Grade Level
const STEM_QUESTIONS_BY_LEVEL: Record<string, Question[]> = {
  ประถม: [
    {
      id: 1,
      question: 'สิ่งใดเป็นแหล่งพลังงานแสงหลักของโลก?',
      options: ['ดวงอาทิตย์', 'ดวงจันทร์', 'หลอดไฟ', 'ถ่านหิน'],
      correctIndex: 0,
      explanation: 'ดวงอาทิตย์เป็นแหล่งพลังงานแสงและพลังงานความร้อนหลักของโลก',
    },
    {
      id: 2,
      question: 'น้ำในสถานะของแข็งเรียกว่าอะไร?',
      options: ['น้ำแข็ง', 'ไอน้ำ', 'หยดน้ำ', 'น้ำเชื่อม'],
      correctIndex: 0,
      explanation: 'เมื่อน้ำเย็นจัดจนเป็นของแข็งจะเรียกว่าน้ำแข็ง',
    },
    {
      id: 3,
      question: 'การดึงหรือผลักวัตถุให้เคลื่อนที่เรียกว่าอะไร?',
      options: ['แรง (Force)', 'งาน (Work)', 'พลังงาน (Energy)', 'ความกดอากาศ'],
      correctIndex: 0,
      explanation: 'แรงคือสิ่งที่มากระทำต่อวัตถุแล้วทำให้วัตถุเปลี่ยนทิศทางหรือเคลื่อนที่',
    },
  ],
  มัธยมต้น: [
    {
      id: 1,
      question: 'หน่วยของแรงในระบบเอสไอ (SI Unit of Force) คือหน่วยใด?',
      options: ['นิวตัน (N)', 'จูล (J)', 'วัตต์ (W)', 'พาสคัล (Pa)'],
      correctIndex: 0,
      explanation: 'แรงมีหน่วยเป็น นิวตัน (N) ซึ่งเท่ากับ kg·m/s²',
    },
    {
      id: 2,
      question: 'แสงเดินทางด้วยความเร็วประมาณเท่าใดในสุญญากาศ?',
      options: ['3 × 10⁸ m/s', '3 × 10⁵ m/s', '300,000 m/s', '3 × 10¹⁰ m/s'],
      correctIndex: 0,
      explanation: 'ความเร็วแสงในสุญญากาศอยู่ที่ประมาณ 3 × 10⁸ เมตรต่อวินาที',
    },
    {
      id: 3,
      question: 'สถานะของสสารที่มีปริมาตรคงที่แต่รูปร่างเปลี่ยนตามภาชนะคือสถานะใด?',
      options: ['ของเหลว', 'ของแข็ง', 'แก๊ส', 'พลาสมา'],
      correctIndex: 0,
      explanation: 'ของเหลวมีปริมาตรคงที่ แต่รูปร่างจะเปลี่ยนไปตามภาชนะที่บรรจุ',
    },
  ],
  มัธยมปลาย: [
    {
      id: 1,
      question: 'ตามกฎข้อที่ 2 ของนิวตัน (ΣF = ma) ความเร่ง (a) มีทิศทางเดียวกับค่าใด?',
      options: ['แรงผลลัพธ์ (ΣF)', 'ความเร็วต้น (v₀)', 'มวลของวัตถุ (m)', 'ตำแหน่ง (x)'],
      correctIndex: 0,
      explanation: 'ความเร่ง (a) จะมีทิศทางเดียวกับแรงผลลัพธ์ (ΣF) ที่มากระทำเสมอ',
    },
    {
      id: 2,
      question: 'คลื่น electromagnetic ชนิดใดมีความถี่สูงที่สุดและพลังงานมากที่สุด?',
      options: ['รังสีแกมมา (Gamma Ray)', 'รังสี X-ray', 'รังสี UV', 'คลื่นวิทยุ'],
      correctIndex: 0,
      explanation: 'รังสีแกมมามีความถี่สูงที่สุดและความยาวคลื่นสั้นที่สุดในสเปกตรัมแม่เหล็กไฟฟ้า',
    },
    {
      id: 3,
      question: 'กฎของโอห์ม (Ohm\'s Law) ในวงจรไฟฟ้ากระแสตรงสัมพันธ์กันด้วยสมการใด?',
      options: ['V = IR', 'P = IV', 'F = qE', 'E = mc²'],
      correctIndex: 0,
      explanation: 'กฎของโอห์มระบุว่าความต่างศักย์ V เท่ากับกระแส I คูณความต้านทาน R (V = IR)',
    },
  ],
};

// Apti Questions by Evaluation Type
const APTI_QUESTIONS_BY_TYPE: Record<string, Question[]> = {
  IQ: [
    {
      id: 1,
      question: 'พิจารณาอนุกรมตรรกะ: 2, 4, 8, 16, 32, ... ตัวเลขถัดไปคืออะไร?',
      options: ['64', '48', '50', '60'],
      correctIndex: 0,
      explanation: 'ลำดับเป็นการคูณ 2 เพิ่มขึ้นเรื่อยๆ: 32 × 2 = 64',
    },
    {
      id: 2,
      question: 'รูปทรงเรขาคณิตสามมิติที่มีหน้าเป็นรูปสามเหลี่ยมด้านเท่า 4 หน้า คือรูปทรงใด?',
      options: ['ทรงสามหน้า (Tetrahedron)', 'ทรงสี่เหลี่ยมลูกบาศก์', 'ทรงกระบอก', 'ทรงแปดหน้า'],
      correctIndex: 0,
      explanation: 'Tetrahedron ประกอบด้วยหน้าสามเหลี่ยม 4 หน้า',
    },
    {
      id: 3,
      question: 'หาก A สูงกว่า B และ B สูงกว่า C ข้อใดสรุปได้ถูกต้องแน่แท้?',
      options: ['A สูงกว่า C', 'C สูงกว่า A', 'A และ C สูงเท่ากัน', 'สรุปไม่ได้'],
      correctIndex: 0,
      explanation: 'ตามคุณสมบัติการถ่ายทอด (Transitive Property): A > B > C ดังนั้น A > C',
    },
  ],
  EQ: [
    {
      id: 1,
      question: 'เมื่อต้องทำงานกลุ่มกับผู้อื่นที่มีความคิดเห็นขัดแย้งกันอย่างสิ้นเชิง วิธีจัดการที่ดีที่สุดคือ?',
      options: [
        'รับฟังเหตุผลของทุกฝ่าย และหาจุดร่วมบนเป้าหมายของทีม',
        'ยืนยันความคิดตนเองเพราะมั่นใจว่าถูกต้อง',
        'ถอนตัวออกจากทีมทันทีเพื่อลดความขัดแย้ง',
        'ปล่อยให้ผู้อื่นตัดสินใจโดยไม่แสดงความเห็น',
      ],
      correctIndex: 0,
      explanation: 'การเปิดใจรับฟังและหาจุดร่วมแสดงถึงความฉลาดทางอารมณ์ (EQ) และภาวะผู้นำ',
    },
    {
      id: 2,
      question: 'เมื่อเผชิญกับผลการสอบที่ไม่เป็นไปตามคาดหวัง การปฏิกิริยาเชิงบวกต่อตนเองคือ?',
      options: [
        'วิเคราะห์จุดบกพร่องและวางแผนปรับปรุงการอ่านหนังสือใหม่',
        'โทษข้อสอบและครูผู้สอนว่ายากเกินไป',
        'ละทิ้งวิชานั้นและไม่พยายามอีกต่อไป',
        'เปรียบเทียบตนเองกับผู้อื่นแล้วเสียใจ',
      ],
      correctIndex: 0,
      explanation: 'การมองความผิดพลาดเป็นโอกาสในการเรียนรู้ (Growth Mindset) คือองค์ประกอบหลักของ EQ',
    },
    {
      id: 3,
      question: 'การตระหนักรู้ในอารมณ์ของตนเอง (Self-Awareness) มีประโยชน์อย่างไรในการเรียน?',
      options: [
        'ช่วยให้บริหารเวลาและความเครียดได้อย่างมีประสิทธิภาพ',
        'ทำให้เรียนได้โดยไม่ต้องอ่านหนังสือ',
        'ทำให้สอบได้คะแนนเต็มทุกครั้ง',
        'ช่วยควบคุมผู้อื่นให้ทำตามคำสั่งได้',
      ],
      correctIndex: 0,
      explanation: 'Self-Awareness ช่วยให้รู้เท่าทันสภาวะอารมณ์ วางแผน และรับมือกับความเครียดได้ดี',
    },
  ],
  ความถนัด: [
    {
      id: 1,
      question: 'ตามตรรกศาสตร์: "ดาวเคราะห์ทุกดวงโคจรรอบดวงอาทิตย์ และโลกเป็นดาวเคราะห์" ข้อใดคือข้อสรุปที่ถูกต้องที่สุด?',
      options: [
        'โลกโคจรรอบดวงอาทิตย์',
        'ดวงอาทิตย์โคจรรอบโลก',
        'โลกเป็นดวงอาทิตย์',
        'ไม่สามารถสรุปได้',
      ],
      correctIndex: 0,
      explanation: 'เป็นเหตุผลเชิงตรรกศาสตร์ (Syllogism) ที่สมบูรณ์',
    },
    {
      id: 2,
      question: 'ถ้าฟันเฟือง A หมุนตามเข็มนาฬิกา และขบอยู่กับฟันเฟือง B ข้อใดถูกต้องเกี่ยวกับ B?',
      options: [
        'ฟันเฟือง B หมุนทวนเข็มนาฬิกา',
        'ฟันเฟือง B หมุนตามเข็มนาฬิกา',
        'ฟันเฟือง B หยุดนิ่ง',
        'ฟันเฟือง B หมุนสลับไปมา',
      ],
      correctIndex: 0,
      explanation: 'ฟันเฟืองสองตัวที่ขบกันโดยตรงจะหมุนในทิศทางตรงกันข้ามเสมอ',
    },
    {
      id: 3,
      question: 'คลื่นเสียงไม่สามารถเดินทางผ่านสถานะใดได้?',
      options: ['สุญญากาศ', 'ของแข็ง', 'ของเหลว', 'แก๊ส'],
      correctIndex: 0,
      explanation: 'คลื่นเสียงเป็นคลื่นกล ต้องอาศัยตัวกลางในการสั่นสะเทือน จึงเดินทางผ่านสุญญากาศไม่ได้',
    },
  ],
};

export const OrbitalGateModal: React.FC<OrbitalGateModalProps> = ({ isOpen, onClose }) => {
  // Navigation & Sub-modals
  const [activeTest, setActiveTest] = useState<'none' | 'stem' | 'apti'>('none');
  const [selectedLevel, setSelectedLevel] = useState<string>('มัธยมปลาย');
  const [selectedAptiType, setSelectedAptiType] = useState<string>('IQ');

  // Sub-modal Popups
  const [isStemPopupOpen, setIsStemPopupOpen] = useState<boolean>(false);
  const [isAptiPopupOpen, setIsAptiPopupOpen] = useState<boolean>(false);
  const [isSeasonInfoOpen, setIsSeasonInfoOpen] = useState<boolean>(false);

  // Emergency Unlock Token Modal
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<boolean>(false);
  const [tokenInput, setTokenInput] = useState<string>('');
  const [targetItemToUnlock, setTargetItemToUnlock] = useState<string>('ALL');
  const [tokenFeedback, setTokenFeedback] = useState<{ type: 'success' | 'error' | 'none'; message: string }>({
    type: 'none',
    message: '',
  });

  // Admin Control Console Modal
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState<boolean>(false);
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  // Test Execution State
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Real-time Rolling Cooldown Map
  const [remainingDaysMap, setRemainingDaysMap] = useState<Record<string, number>>({});
  const [hasAnyLock, setHasAnyLock] = useState<boolean>(false);

  const refreshLockStateMap = () => {
    const newMap: Record<string, number> = {};
    let anyLock = false;

    Object.keys(LOCK_KEYS).forEach((item) => {
      const days = getRemainingDaysForItem(item);
      newMap[item] = days;
      if (days > 0) anyLock = true;
    });

    setRemainingDaysMap(newMap);
    setHasAnyLock(anyLock);
  };

  useEffect(() => {
    if (isOpen) {
      try {
        refreshLockStateMap();
      } catch (e) {
        console.warn('Error calculating lock state', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // ALL items completed check (for locking main card buttons)
  const allStemCompleted =
    (remainingDaysMap['ประถม'] || 0) > 0 &&
    (remainingDaysMap['มัธยมต้น'] || 0) > 0 &&
    (remainingDaysMap['มัธยมปลาย'] || 0) > 0;

  const allAptiCompleted =
    (remainingDaysMap['IQ'] || 0) > 0 &&
    (remainingDaysMap['EQ'] || 0) > 0 &&
    (remainingDaysMap['ความถนัด'] || 0) > 0;

  // Handlers for starting tests from popups
  const handleConfirmStemLevel = (level: string) => {
    if (getRemainingDaysForItem(level) > 0) return; // Locked
    setSelectedLevel(level);
    setIsStemPopupOpen(false);
    setActiveTest('stem');
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  const handleConfirmAptiType = (type: string) => {
    if (getRemainingDaysForItem(type) > 0) return; // Locked
    setSelectedAptiType(type);
    setIsAptiPopupOpen(false);
    setActiveTest('apti');
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Emergency Token Verification Handler
  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    const expectedToken = getTodayDynamicToken();
    const enteredToken = tokenInput.trim().toUpperCase();

    if (enteredToken === expectedToken || enteredToken === '7S-MASTER') {
      if (targetItemToUnlock === 'ALL') {
        Object.values(LOCK_KEYS).forEach((key) => localStorage.removeItem(key));
      } else {
        const key = LOCK_KEYS[targetItemToUnlock];
        if (key) localStorage.removeItem(key);
      }

      refreshLockStateMap();
      setTokenFeedback({
        type: 'success',
        message: 'ปลดล็อกสำเร็จ! พร้อมสำหรับการทดสอบรอบใหม่',
      });

      setTimeout(() => {
        setIsTokenModalOpen(false);
        setTokenFeedback({ type: 'none', message: '' });
        setTokenInput('');
      }, 1500);
    } else {
      setTokenFeedback({
        type: 'error',
        message: 'รหัสผ่านไม่ถูกต้อง หรือหมดอายุแล้ว กรุณาติดต่อผู้ดูแลระบบ',
      });
    }
  };

  // Full Reset Tool (for Admin Console)
  const handleResetProtocol = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    Object.values(LOCK_KEYS).forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem('completed_apti_types');
    localStorage.removeItem('completed_stem_levels');
    localStorage.removeItem('last_apti_test_date');
    refreshLockStateMap();
    setIsAdminConsoleOpen(false);
  };

  // Copy Dynamic Token to Clipboard
  const handleCopyToken = (textStr: string) => {
    navigator.clipboard.writeText(textStr);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const currentQuestions =
    activeTest === 'stem'
      ? STEM_QUESTIONS_BY_LEVEL[selectedLevel] || STEM_QUESTIONS_BY_LEVEL['มัธยมปลาย']
      : APTI_QUESTIONS_BY_TYPE[selectedAptiType] || APTI_QUESTIONS_BY_TYPE['IQ'];

  const handleSelectAnswer = (qIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    const timeNow = Date.now().toString();

    if (activeTest === 'stem') {
      const key = LOCK_KEYS[selectedLevel];
      if (key) localStorage.setItem(key, timeNow);
      refreshLockStateMap();
    } else if (activeTest === 'apti') {
      const key = LOCK_KEYS[selectedAptiType];
      if (key) localStorage.setItem(key, timeNow);
      refreshLockStateMap();
    }
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  const handleBackToGrid = () => {
    setActiveTest('none');
    setCurrentStep(0);
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0C0C0C]/90 border border-white/10 rounded-3xl shadow-[0_0_35px_rgba(255,255,255,0.08)] backdrop-blur-2xl flex flex-col overflow-hidden text-slate-100 p-6 md:p-8">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5 mb-6 relative">
          <div>
            <h2 className="text-2xl md:text-4xl font-black font-kanit tracking-tight bg-gradient-to-r from-[#646973] via-[#94A3B8] to-[#BBCCD7] bg-clip-text text-transparent">
              ORBITAL GATE
            </h2>
            <p className="text-zinc-400 text-[11px] md:text-xs font-mono tracking-widest uppercase mt-1">
              DIAGNOSTIC & APTITUDE EVALUATION TERMINAL
            </p>
          </div>

          {/* Top Right Controls Container */}
          <div className="flex flex-col items-end gap-2">
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Row: ADMIN MODE Button and LOCK Button (Side-by-side under Close Button) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAdminConsoleOpen(true)}
                className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 text-[10px] font-mono tracking-wider px-2 py-0.5 rounded cursor-pointer transition-colors"
                title="เปิดแผงควบคุมแอดมิน (ADMIN CONTROL TERMINAL)"
              >
                <span>• ADMIN MODE</span>
              </button>

              {hasAnyLock && (
                <button
                  type="button"
                  onClick={() => setIsSeasonInfoOpen(true)}
                  className="bg-black/60 border border-white/20 text-xs text-zinc-300 hover:text-white px-3 py-1 rounded-full hover:border-white/60 transition-all cursor-pointer font-mono flex items-center gap-1.5 shadow-sm hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] animate-in fade-in duration-200"
                  title="คลิกเพื่ออ่านรายละเอียดระบบจำกัดสิทธิ์ประจำซีซั่น"
                >
                  <NeonLockIcon className="w-3 h-3" />
                  <span>LOCK</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {activeTest === 'none' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* [การ์ดซ้าย: KNOWLEDGE LEVEL CHECK] */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <h3 className="text-lg md:text-xl font-black font-kanit text-white mb-3 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] transition-all duration-300">
                    KNOWLEDGE LEVEL CHECK
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm font-sans leading-relaxed mb-6 whitespace-pre-line">
                    แบบประเมินความรู้พื้นฐานวิทยาศาสตร์และฟิสิกส์{"\n"}เพื่อวิเคราะห์และวางเส้นทางการเรียน
                  </p>
                </div>

                {allStemCompleted ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-6 rounded-xl bg-zinc-900/60 border border-white/10 text-zinc-400 font-kanit font-semibold text-xs md:text-sm cursor-not-allowed flex items-center justify-between transition-all"
                  >
                    <span>START ASSESSMENT</span>
                    <NeonLockIcon className="w-4.5 h-4.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsStemPopupOpen(true);
                    }}
                    className="w-full py-3 px-5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-md cursor-pointer flex items-center justify-center font-kanit text-xs md:text-sm active:scale-98"
                  >
                    <span>START ASSESSMENT</span>
                  </button>
                )}
              </div>

              {/* [การ์ดขวา: APTI-ORBIT EVALUATION] */}
              <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-white/40 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <h3 className="text-lg md:text-xl font-black font-kanit text-white mb-3 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_12px_rgba(192,132,252,0.7)] transition-all duration-300">
                    APTI-ORBIT EVALUATION
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm font-sans leading-relaxed mb-6">
                    แบบทดสอบวัดระดับสติปัญญา IQ, EQ และความถนัดเชิงตรรกะ
                  </p>
                </div>

                {allAptiCompleted ? (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3 px-6 rounded-xl bg-zinc-900/60 border border-white/10 text-zinc-400 font-kanit font-semibold text-xs md:text-sm cursor-not-allowed flex items-center justify-between transition-all"
                  >
                    <span>ENTER EVALUATION</span>
                    <NeonLockIcon className="w-4.5 h-4.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setIsAptiPopupOpen(true);
                    }}
                    className="w-full py-3 px-5 rounded-xl bg-white text-black font-semibold hover:bg-zinc-200 transition-all shadow-md cursor-pointer flex items-center justify-center font-kanit text-xs md:text-sm active:scale-98"
                  >
                    <span>ENTER EVALUATION</span>
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Interactive Test View */}
          {activeTest !== 'none' && !isSubmitted && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold ${activeTest === 'stem' ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40' : 'bg-purple-950 text-purple-300 border border-purple-500/40'}`}>
                    {activeTest === 'stem' ? `STEM ASSESSMENT (${selectedLevel})` : `APTI-ORBIT (${selectedAptiType})`}
                  </span>
                  <span className="text-xs font-mono text-zinc-400">
                    ข้อที่ {currentStep + 1} / {currentQuestions.length}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-mono cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>ยกเลิก</span>
                </button>
              </div>

              {/* Question & Choices */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                <h4 className="text-base md:text-lg font-bold font-kanit text-white leading-relaxed">
                  {currentQuestions[currentStep].question}
                </h4>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQuestions[currentStep].options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentStep] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectAnswer(currentStep, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border text-sm font-kanit transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-white text-black border-white font-bold shadow-md'
                            : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/80'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 0) {
                      handleBackToGrid();
                    } else {
                      setCurrentStep((p) => p - 1);
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 cursor-pointer transition"
                >
                  ย้อนกลับ
                </button>

                {currentStep < currentQuestions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((p) => p + 1)}
                    disabled={selectedAnswers[currentStep] === undefined}
                    className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 disabled:opacity-40 font-bold text-xs md:text-sm cursor-pointer disabled:cursor-not-allowed transition"
                  >
                    ข้อถัดไป
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitTest}
                    disabled={selectedAnswers[currentStep] === undefined}
                    className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs md:text-sm cursor-pointer transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
                  >
                    ส่งคำตอบ / ดูผลลัพธ์
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Test Result View */}
          {activeTest !== 'none' && isSubmitted && (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/5 border border-white/10 mb-2">
                <Award className={`w-10 h-10 ${activeTest === 'stem' ? 'text-cyan-400' : 'text-purple-400'}`} />
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-black font-kanit text-white">
                  {activeTest === 'stem' ? `STEM DIAGNOSTIC RESULT (${selectedLevel})` : `APTI-ORBIT EVALUATION SUMMARY (${selectedAptiType})`}
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-1">
                  ผลการประเมินวิเคราะห์ด้วยระบบ Seven Space Client Terminal
                </p>
              </div>

              <div className="max-w-md mx-auto p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="text-3xl font-black font-mono text-white">
                  คะแนนที่ได้: <span className={activeTest === 'stem' ? 'text-cyan-400' : 'text-purple-400'}>{calculateScore()} / {currentQuestions.length}</span>
                </div>

                <div className="text-xs font-mono text-zinc-300 bg-white/5 p-3.5 rounded-xl border border-white/10 leading-relaxed text-left">
                  {activeTest === 'stem' ? (
                    calculateScore() === 3
                      ? '✨ ผลประเมินระดับ ADVANCED: คุณมีความรู้พื้นฐานแน่นพร้อมสำหรับการเรียนใน LAB 1 (Physics No.7) และประลองใน LAB 2 (Quiz Arena)'
                      : '👍 ผลประเมินระดับ INTERMEDIATE: แนะนำเข้าทบทวนบทเรียนใน LAB 1 และฝึกฝนโจทย์อัตโนมัติใน LAB 3'
                  ) : (
                    `🔮 ผลประเมิน APTI-ORBIT (${selectedAptiType}): ผ่านเกณฑ์ประเมินประจำซีซั่น! บันทึกประวัติการทดสอบลงในระบบเรียบร้อยแล้ว`
                  )}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleBackToGrid}
                  className="px-6 py-2.5 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs md:text-sm cursor-pointer transition shadow-md"
                >
                  กลับสู่หน้าหลัก ORBITAL GATE
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-MODAL 1: STEM Level Selection Popup                  */}
      {/* ======================================================== */}
      {isStemPopupOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#121214] border border-white/20 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsStemPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black font-kanit text-white">
                เลือกระดับชั้นการศึกษา
              </h3>
              <p className="text-xs text-zinc-400 font-kanit mt-1">
                เพื่อจัดชุดแบบประเมินความรู้พื้นฐานให้เหมาะสม (รอบละ 30 วัน)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {['ประถม', 'มัธยมต้น', 'มัธยมปลาย'].map((lvl) => {
                const daysLeft = remainingDaysMap[lvl] ?? getRemainingDaysForItem(lvl);
                const isLocked = daysLeft > 0;

                return isLocked ? (
                  <button
                    key={lvl}
                    type="button"
                    disabled
                    className="py-3.5 px-6 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-400 font-bold font-kanit text-sm cursor-not-allowed flex items-center justify-between w-full transition-all"
                  >
                    <span>[ {lvl} ]</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-400 font-mono tracking-tight mr-1">
                        เหลืออีก {daysLeft} วัน
                      </span>
                      <NeonLockIcon className="w-4.5 h-4.5" />
                    </div>
                  </button>
                ) : (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleConfirmStemLevel(lvl)}
                    className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/40 text-white font-bold font-kanit text-sm transition-all cursor-pointer hover:shadow-lg active:scale-98 flex items-center justify-center w-full"
                  >
                    <span>[ {lvl} ]</span>
                  </button>
                );
              })}
            </div>

            {hasAnyLock && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsStemPopupOpen(false);
                    setIsTokenModalOpen(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer transition"
                >
                  [ ขอสิทธิ์ทดสอบใหม่ / ใส่รหัสปลดล็อก ]
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 2: Apti Evaluation Type Selection Popup        */}
      {/* ======================================================== */}
      {isAptiPopupOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#121214] border border-white/20 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-6 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAptiPopupOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-xl font-black font-kanit text-white">
                เลือกประเภทการทดสอบ
              </h3>
              <p className="text-xs text-zinc-400 font-kanit mt-1">
                เลือกด้านที่ต้องการวัดผลการประเมินประจำซีซั่น (รอบละ 90 วัน)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {['IQ', 'EQ', 'ความถนัด'].map((type) => {
                const daysLeft = remainingDaysMap[type] ?? getRemainingDaysForItem(type);
                const isLocked = daysLeft > 0;

                return isLocked ? (
                  <button
                    key={type}
                    type="button"
                    disabled
                    className="py-3.5 px-6 rounded-2xl bg-zinc-900/60 border border-white/10 text-zinc-400 font-bold font-kanit text-sm cursor-not-allowed flex items-center justify-between w-full transition-all"
                  >
                    <span>[ {type} ]</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-400 font-mono tracking-tight mr-1">
                        เหลืออีก {daysLeft} วัน
                      </span>
                      <NeonLockIcon className="w-4.5 h-4.5" />
                    </div>
                  </button>
                ) : (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleConfirmAptiType(type)}
                    className="py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-purple-500/20 border border-purple-400/50 text-white font-bold font-kanit text-sm transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] active:scale-98 flex items-center justify-center w-full"
                  >
                    <span>[ {type} ]</span>
                  </button>
                );
              })}
            </div>

            {hasAnyLock && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsAptiPopupOpen(false);
                    setIsTokenModalOpen(true);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer transition"
                >
                  [ ขอสิทธิ์ทดสอบใหม่ / ใส่รหัสปลดล็อก ]
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 3: Season Lock Protocol Info Popup             */}
      {/* ======================================================== */}
      {isSeasonInfoOpen && (
        <div
          className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#121214] border border-white/20 rounded-3xl p-6 md:p-8 max-w-lg w-full text-left space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsSeasonInfoOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <NeonLockIcon className="w-5 h-5" />
              </div>
              <h3 className="text-base md:text-lg font-black font-kanit text-white leading-tight">
                ระบบจำกัดสิทธิ์การประเมินประจำซีซั่น{"\n"}
                <span className="text-amber-400 text-xs font-mono font-normal">
                  (SEASON LOCK PROTOCOL)
                </span>
              </h3>
            </div>

            <div className="space-y-4 text-xs md:text-sm text-zinc-300 font-kanit leading-relaxed">
              <p>
                เพื่อให้ผลการวัดระดับสติปัญญา IQ, EQ และความถนัดเชิงตรรกะมีความเที่ยงตรงและแม่นยำสูงสุดตามหลักจิตวิทยาการวัดผล ระบบจึงกำหนดสิทธิ์การทดสอบไว้ตามรอบ Cooldown (30 วันสำหรับแบบประเมินความรู้ และ 90 วันสำหรับแบบทดสอบวัดระดับสติปัญญา)
              </p>
              <p>
                ทั้งนี้เพื่อป้องกันการคลาดเคลื่อนทางสถิติจากการจดจำแนวข้อสอบ (Practice Effect) เมื่อผู้เรียนส่งรายงานผลคะแนนเรียบร้อยแล้ว ระบบจะทำการล็อกการประเมินทันที และจะปลดล็อกพร้อมรีเซ็ตสิทธิ์ใหม่อัตโนมัติเมื่อครบกำหนดรอบเวลา
              </p>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  setIsSeasonInfoOpen(false);
                  setIsTokenModalOpen(true);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 underline font-mono cursor-pointer transition"
              >
                [ ขอสิทธิ์ทดสอบใหม่ / ใส่รหัสปลดล็อก ]
              </button>

              <button
                type="button"
                onClick={() => setIsSeasonInfoOpen(false)}
                className="py-2.5 px-6 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold font-kanit text-xs md:text-sm cursor-pointer transition shadow-md active:scale-98 text-center"
              >
                รับทราบ / ตกลง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 4: Emergency Unlock Token Modal for Parents    */}
      {/* ======================================================== */}
      {isTokenModalOpen && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#121214] border border-amber-500/30 rounded-3xl p-6 md:p-8 max-w-md w-full text-center space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setIsTokenModalOpen(false);
                setTokenFeedback({ type: 'none', message: '' });
                setTokenInput('');
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black font-kanit text-white">
                กรอกรหัสปลดล็อกฉุกเฉิน
              </h3>
              <p className="text-xs text-zinc-400 font-kanit mt-1">
                สำหรับผู้ปกครองหรือผู้ดูแลระบบที่ได้รับรหัส Dynamic Token ประจำวัน
              </p>
            </div>

            <form onSubmit={handleVerifyToken} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  เลือกหมวดที่ต้องการปลดล็อก:
                </label>
                <select
                  value={targetItemToUnlock}
                  onChange={(e) => setTargetItemToUnlock(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs font-kanit text-white focus:outline-none focus:border-amber-400 cursor-pointer"
                >
                  <option value="ALL">ปลดล็อกทุกรายการทั้งหมด (Reset All)</option>
                  <option value="ประถม">ประถม (30 วัน)</option>
                  <option value="มัธยมต้น">มัธยมต้น (30 วัน)</option>
                  <option value="มัธยมปลาย">มัธยมปลาย (30 วัน)</option>
                  <option value="IQ">IQ (90 วัน)</option>
                  <option value="EQ">EQ (90 วัน)</option>
                  <option value="ความถนัด">ความถนัด (90 วัน)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1.5">
                  รหัสปลดล็อกประจำวัน (Dynamic Token 7 หลัก):
                </label>
                <input
                  type="text"
                  maxLength={10}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  placeholder="7S-XXXX"
                  className="w-full bg-black/80 border border-zinc-700 rounded-xl px-4 py-3 text-base font-mono text-amber-300 font-bold tracking-widest uppercase focus:outline-none focus:border-amber-400 text-center placeholder-zinc-600"
                  required
                />
              </div>

              {tokenFeedback.type === 'success' && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-kanit flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{tokenFeedback.message}</span>
                </div>
              )}

              {tokenFeedback.type === 'error' && (
                <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-kanit flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{tokenFeedback.message}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold font-kanit text-xs md:text-sm transition-all shadow-lg cursor-pointer active:scale-98"
              >
                ยืนยันการปลดล็อก
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SUB-MODAL 5: Exact System Style Admin Control Console    */}
      {/* ======================================================== */}
      {isAdminConsoleOpen && (
        <div
          className="fixed inset-0 z-[160] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-[#0C0C0C]/95 border border-zinc-700 rounded-2xl p-6 md:p-8 max-w-md w-full backdrop-blur-2xl shadow-2xl relative text-left space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsAdminConsoleOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-black font-mono text-white leading-tight">
                  ADMIN CONTROL TERMINAL
                </h3>
                <p className="text-xs text-amber-400/80 font-mono">
                  SEVEN SPACE LABS SYSTEM PRIVILEGE
                </p>
              </div>
            </div>

            {/* [การ์ดส่วนที่ 1: รหัสปลดล็อกฉุกเฉินประจำวัน (Dynamic Daily Token)] */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  TODAY'S DYNAMIC TOKEN (7S-MMDD):
                </span>
                <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px]">
                  เปลี่ยนอัตโนมัติรายวัน
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 text-2xl md:text-3xl font-black font-mono text-amber-300 tracking-widest text-center py-2.5 bg-black/70 rounded-xl border border-amber-500/30 shadow-inner select-all">
                  {getTodayDynamicToken()}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopyToken(getTodayDynamicToken())}
                  className="px-3.5 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copiedToken ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>

              <p className="text-xs text-zinc-300 font-kanit leading-relaxed">
                รหัสปลดล็อกฉุกเฉินประจำวัน ใช้มอบให้นักเรียน/ผู้ปกครองที่ทำข้อสอบพลาดเพื่อนำไปกรอกปลดล็อกเฉพาะรายการ (รหัสเปลี่ยนอัตโนมัติทุกเที่ยงคืน)
              </p>

              <div className="text-xs font-mono text-zinc-400 bg-black/50 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <span>MASTER CODE (สำหรับแอดมินทดสอบ):</span>
                <code className="text-amber-300 font-bold select-all">7S-MASTER</code>
              </div>
            </div>

            {/* [การ์ดส่วนที่ 2: เครื่องมือรีเซ็ตระบบทั้งหมด (Testing Reset Protocol)] */}
            <div className="pt-2 border-t border-white/10 space-y-3">
              <div className="text-xs font-mono text-zinc-400">
                TESTING RESET PROTOCOL (DEV & TESTING TOOL):
              </div>

              <button
                type="button"
                onClick={handleResetProtocol}
                className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-kanit text-xs md:text-sm transition-all shadow-lg cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                <span>RESET ALL TESTING DATA</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
