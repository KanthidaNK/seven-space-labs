import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  FileText,
  Download,
  CheckCircle,
  Volume2,
  Maximize2,
  Minimize2,
  Crown,
  ShieldCheck,
  ExternalLink,
  Settings,
  Sparkles,
  RefreshCw,
  Video,
  Save,
  RotateCcw,
  Check,
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Search,
  Filter,
  Eye,
  Plus,
  Trash2,
  Edit3,
  Lock,
  Layers,
  GraduationCap,
  FileDown,
  Copy,
  Upload,
  UploadCloud,
  FileCheck,
} from 'lucide-react';
import { Language, CadetProfile } from '../../types';

export interface ClassroomLesson {
  id: string;
  chapterNo: number;
  title: string;
  subtitle: string;
  duration: string;
  youtubeUrl: string;
  pdfUrl: string;
  pdfFileName: string;
  fileData?: string;
  isCustomUpload?: boolean;
  uploadDate?: string;
  summary: string;
  keyPoints: { title: string; formula?: string; detail: string }[];
  isFree?: boolean;
  requiredPasscode?: string;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: 'ม.4' | 'ม.5' | 'ม.6' | 'สอวน. & TCAS' | 'สรุปสูตร';
  grade: string;
  pages: number;
  fileSize: string;
  pdfUrl: string;
  pdfFileName: string;
  fileData?: string;
  isCustomUpload?: boolean;
  uploadDate?: string;
  isFree: boolean;
  requiredPasscode?: string;
  description: string;
}

const DEFAULT_LESSONS: ClassroomLesson[] = [
  {
    id: 'shm-fundamentals',
    chapterNo: 1,
    title: '01. พื้นฐานและนิยามการสั่น (SHM Fundamentals)',
    subtitle: 'บทที่ 4.1: ปริมาณพื้นฐาน คาบ (T) ความถี่ (f) และแอมพลิจูด (A)',
    duration: '32:10',
    youtubeUrl: 'https://www.youtube.com/watch?v=gT_qWkE70K4',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdfFileName: 'physics-shm-chapter-01-fundamentals.pdf',
    summary: 'ศึกษาความสัมพันธ์ของการเคลื่อนที่แบบพีริออดิก คาบการเคลื่อนที่ ความถี่เชิงมุม และเฟสเริ่มต้นของการสั่น',
    keyPoints: [
      {
        title: 'ความถี่เชิงมุมและคาบ',
        formula: 'ω = 2πf = 2π/T',
        detail: 'ความสัมพันธ์ระหว่างอัตราเร็วเชิงมุม ความถี่ และคาบเวลาของการสั่นในหนึ่งรอบสมบูรณ์',
      },
      {
        title: 'นิยามการกระจัดสูงสุด (Amplitude)',
        formula: 'x_max = A',
        detail: 'ระยะกระจัดที่วัดจากตำแหน่งสมดุลไปยังจุดปลายสุดของการเคลื่อนที่',
      },
    ],
    isFree: true,
  },
  {
    id: 'hooke-spring-system',
    chapterNo: 2,
    title: '02. กฎของฮุกและระบบมวลติดสปริง (Hooke\'s Law & Springs)',
    subtitle: 'บทที่ 4.2: แรงดึงกลับในสปริง ค่าคงที่สปริง (k) และพลังงานศักย์ยืดหยุ่น',
    duration: '45:00',
    youtubeUrl: 'https://www.youtube.com/watch?v=tJnJ_fL2qP0',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-shm-chapter-02-springs.pdf',
    summary: 'การวิเคราะห์แรงดึงกลับของสปริงตามกฎของฮุก และการคำนวณคาบการสั่นของมวลติดปลายสปริงแนวราบและแนวดิ่ง',
    keyPoints: [
      {
        title: 'กฎของฮุก (Hooke\'s Law)',
        formula: 'F_s = -kx',
        detail: 'แรงดึงกลับของสปริงมีทิศทางตรงข้ามกับการกระจัดจากตำแหน่งสมดุลเสมอ',
      },
      {
        title: 'คาบการสั่นของมวลติดสปริง',
        formula: 'T = 2π √(m/k)',
        detail: 'คาบการแกว่งขึ้นอยู่กับมวล m และค่านิจสปริง k โดยไม่ขึ้นกับแอมพลิจูด A',
      },
    ],
    isFree: true,
  },
  {
    id: 'shm-equations',
    chapterNo: 3,
    title: '03. การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย (SHM Equations)',
    subtitle: 'บทที่ 4.3: สมการการกระจัด ความเร็ว ความเร่ง และการอนุรักษ์พลังงานกล',
    duration: '48:20',
    youtubeUrl: 'https://www.youtube.com/watch?v=P_wYc_D1tXU',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-shm-chapter-03-shm-equations.pdf',
    summary: 'อนุพันธ์ของฟังก์ชันไซน์และโคไซน์ที่อธิบายการเคลื่อนที่ ความเร็วสูงสุด และความเร่งสูงสุดที่จุดปลาย',
    keyPoints: [
      {
        title: 'สมการการกระจัดและความเร็ว',
        formula: 'x(t) = A cos(ωt + φ)  ⇒  v(t) = -ωA sin(ωt + φ)',
        detail: 'ความเร็วมีค่าสูงสุด v_max = ωA ที่ตำแหน่งสมดุล (x = 0)',
      },
      {
        title: 'ความเร่งและการอนุรักษ์พลังงาน',
        formula: 'a(t) = -ω²x  และ  E_total = 1/2 kA²',
        detail: 'ความเร่งมีทิศพุ่งเข้าหาจุดสมดุลเสมอ และพลังงานกลรวมในระบบคงที่ตลอดเวลา',
      },
    ],
    isFree: true,
  },
  {
    id: 'simple-pendulum-resonance',
    chapterNo: 4,
    title: '04. ลูกตุ้มอย่างง่ายและการสั่นพ้อง (Pendulum & Resonance)',
    subtitle: 'บทที่ 4.4: การแกว่งของลูกตุ้มนาฬิกา ความถี่ธรรมชาติ และปรากฏการณ์เรโซแนนซ์',
    duration: '39:15',
    youtubeUrl: 'https://www.youtube.com/watch?v=17b12D4_v9M',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-shm-chapter-04-pendulum-resonance.pdf',
    summary: 'การแกว่งของลูกตุ้มอย่างง่ายในมุมเล็กๆ และการเกิดการสั่นพ้องเมื่อความถี่ภายนอกตรงกับความถี่ธรรมชาติ',
    keyPoints: [
      {
        title: 'คาบการแกว่งของลูกตุ้มอย่างง่าย',
        formula: 'T = 2π √(L/g)',
        detail: 'คาบการแกว่งขึ้นอยู่กับความยาวเชือก L และความเร่งโน้มถ่วง g โดยไม่ขึ้นกับมวลของลูกตุ้ม',
      },
      {
        title: 'ปรากฏการณ์การสั่นพ้อง (Resonance)',
        formula: 'f_driver = f_natural',
        detail: 'เมื่อความถี่ของแรงขับตรงกับความถี่ธรรมชาติ ระบบจะสั่นด้วยแอมพลิจูดสูงสุด',
      },
    ],
    isFree: false,
    requiredPasscode: 'PHY-101',
  },
];

const DEFAULT_VAULT_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-posn-astro',
    title: 'ชุดข้อสอบฟิสิกส์ สอวน. ดาราศาสตร์และกลศาสตร์ (ม.ปลาย)',
    category: 'สอวน. & TCAS',
    grade: 'ม.4 - ม.6',
    pages: 28,
    fileSize: '3.4 MB',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdfFileName: 'posn-physics-astronomy-exam.pdf',
    isFree: true,
    description: 'รวบรวมข้อสอบคัดเลือกค่าย 1 และค่าย 2 วิชาฟิสิกส์-ดาราศาสตร์ พร้อมแนวทางการคิดเชิงลึก',
  },
  {
    id: 'doc-alevel-67',
    title: 'คลังข้อสอบ A-Level ฟิสิกส์ 67-68 พร้อมเฉลยละเอียด',
    category: 'สอวน. & TCAS',
    grade: 'ม.6 / TCAS',
    pages: 45,
    fileSize: '5.2 MB',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'alevel-physics-full-exam-67.pdf',
    isFree: false,
    requiredPasscode: 'MECH-77',
    description: 'ข้อสอบมาตรฐานจำลองสนามสอบจริง A-Level 30 ข้อ ครบทุกพาร์ทกลศาสตร์ คลื่น ไฟฟ้า และฟิสิกส์ยุคใหม่',
  },
  {
    id: 'doc-m4-newton',
    title: 'ตะลุยโจทย์ฟิสิกส์ ม.4: การเคลื่อนที่แนวตรงและกฎนิวตัน',
    category: 'ม.4',
    grade: 'ม.4 เทอม 1',
    pages: 18,
    fileSize: '2.1 MB',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-m4-motion-newton.pdf',
    isFree: true,
    description: 'แบบฝึกหัด 50 ข้อไล่ระดับความยาก พร้อมสรุปหลักการแตกแรง สมดุลกล และแรงเสียดทาน',
  },
  {
    id: 'doc-cheat-sheet',
    title: 'สรุปสูตรฟิสิกส์ Super Cheat Sheet ฉบับพกพา (ม.4-ม.6)',
    category: 'สรุปสูตร',
    grade: 'ทุกระดับชั้น',
    pages: 12,
    fileSize: '1.8 MB',
    pdfUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
    pdfFileName: 'physics-super-cheat-sheet-all.pdf',
    isFree: true,
    description: 'รวมทุกสูตรฟิสิกส์ ม.ปลาย 20 บท พร้อมหน่วย SI และแผนภาพสรุปตัวแปรจำง่าย',
  },
  {
    id: 'doc-m5-waves',
    title: 'รวมข้อสอบฟิสิกส์ ม.5: คลื่น แสง เสียง และการเคลื่อนที่ SHM',
    category: 'ม.5',
    grade: 'ม.5 เทอม 1-2',
    pages: 34,
    fileSize: '4.1 MB',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-m5-waves-sound-light.pdf',
    isFree: false,
    requiredPasscode: 'COSMO-99',
    description: 'ข้อสอบและแบบฝึกหัดเข้มข้นเรื่องการแทรกสอด การเลี้ยวเบน คลื่นนิ่ง และการสั่นแบบฮาร์มอนิกอย่างง่าย',
  },
  {
    id: 'doc-m6-electromag',
    title: 'ตะลุยข้อสอบฟิสิกส์ ม.6: ไฟฟ้าแม่เหล็ก ฟิสิกส์อะตอมและนิวเคลียร์',
    category: 'ม.6',
    grade: 'ม.6 เทอม 1-2',
    pages: 40,
    fileSize: '4.8 MB',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'physics-m6-electromagnet-atomic.pdf',
    isFree: false,
    requiredPasscode: 'QUANTUM-88',
    description: 'ชุดข้อสอบเจาะลึกไฟฟ้าสถิต วงจรไฟฟ้ากระแสตรง-สลับ แม่เหล็กไฟฟ้า และทวิภาวะคลื่น-อนุภาค',
  },
  {
    id: 'doc-tpat3-guide',
    title: 'คู่มือเตรียมสอบ TPAT3 ความถนัดวิทยาศาสตร์ เทคโนโลยี และวิศวกรรม',
    category: 'สอวน. & TCAS',
    grade: 'ม.6 / TCAS',
    pages: 52,
    fileSize: '6.5 MB',
    pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    pdfFileName: 'tpat3-engineering-science-mastery.pdf',
    isFree: false,
    requiredPasscode: 'PHY-701',
    description: 'แนวข้อสอบความถนัดวิศวกรรม ฟิสิกส์ประยุกต์ การอ่านแบบ มิติสัมพันธ์ และตรรกะเชิงช่าง',
  },
];

const RANDOM_PASSCODES = [
  'PHY-101',
  'MECH-77',
  'COSMO-99',
  'QUANTUM-88',
  'THERMO-55',
  'ELECTRO-303',
  'OPTICS-12',
  'ASTRO-42',
  'WAVE-2026',
  'NEWTON-01',
  'EINSTEIN-07',
  'PHYSICS-99',
];

const getRandomPasscode = () => {
  const index = Math.floor(Math.random() * RANDOM_PASSCODES.length);
  return RANDOM_PASSCODES[index];
};

export function getYouTubeEmbedUrl(urlOrId: string): string {
  if (!urlOrId) return 'https://www.youtube.com/embed/gT_qWkE70K4';
  const trimmed = urlOrId.trim();

  if (trimmed.includes('youtube.com/embed/')) {
    const hasParams = trimmed.includes('?');
    return hasParams ? `${trimmed}&rel=0` : `${trimmed}?rel=0`;
  }

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=0&rel=0&modestbranding=1`;
  }

  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return `https://www.youtube.com/embed/${trimmed}?autoplay=0&rel=0&modestbranding=1`;
  }

  return trimmed.startsWith('http') ? trimmed : `https://www.youtube.com/embed/${trimmed}`;
}

export function getPdfPreviewUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // Return base64 data URL directly so browser/iframe renders it natively
  if (trimmed.startsWith('data:')) {
    return trimmed;
  }

  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    let fileId = '';
    const match1 = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const match2 = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const match3 = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match1 && match1[1]) fileId = match1[1];
    else if (match2 && match2[1]) fileId = match2[1];
    else if (match3 && match3[1]) fileId = match3[1];

    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
  }

  if (trimmed.includes('/preview') || trimmed.includes('docs.google.com/gview')) {
    return trimmed;
  }

  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(trimmed)}`;
}

interface Lab1ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialPin?: string;
  isPremium?: boolean;
  isAdmin?: boolean;
  user?: CadetProfile;
}

export const Lab1ClassroomModal: React.FC<Lab1ClassroomModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialPin = 'PHY-101',
  isPremium = false,
  isAdmin = false,
  user,
}) => {
  // Fullscreen State for Lab 1 Modal
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  // Check role-based admin permission
  const effectiveIsAdmin = Boolean(
    isAdmin ||
      user?.role === 'Admin' ||
      user?.role === 'Developer' ||
      (user as any)?.isAdmin === true
  );

  // Navigation View State: 'hub' | 'video_classroom' | 'document_vault'
  const [viewMode, setViewMode] = useState<'hub' | 'video_classroom' | 'document_vault'>('hub');
  const [selectedCourse, setSelectedCourse] = useState(initialPin || 'PHY-101');

  // Lessons State
  const [lessons, setLessons] = useState<ClassroomLesson[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_classroom_lessons');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage lessons load error:', e);
    }
    return DEFAULT_LESSONS;
  });
  const [activeLessonId, setActiveLessonId] = useState<string>('shm-equations');

  // Vault Documents State
  const [vaultDocs, setVaultDocs] = useState<VaultDocument[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_document_vault_items');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage vault docs error:', e);
    }
    return DEFAULT_VAULT_DOCUMENTS;
  });

  const [searchVault, setSearchVault] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');

  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; fileName: string } | null>(null);

  // Admin Config Modal State
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'lessons' | 'vault'>('lessons');

  // Lesson Edit Form
  const [editLessonForm, setEditLessonForm] = useState<ClassroomLesson>(DEFAULT_LESSONS[0]);

  // Vault Document Add/Edit Form
  const [editVaultForm, setEditVaultForm] = useState<VaultDocument>({
    id: '',
    title: '',
    category: 'ม.4',
    grade: 'ม.4 เทอม 1',
    pages: 10,
    fileSize: '2.0 MB',
    pdfUrl: '',
    pdfFileName: '',
    isFree: true,
    requiredPasscode: 'PHY-101',
    description: '',
  });
  const [isAddingVaultDoc, setIsAddingVaultDoc] = useState(false);

  // Delete Confirmation Modal State
  const [deletingItem, setDeletingItem] = useState<{
    id: string;
    title: string;
    type: 'video' | 'pdf';
  } | null>(null);

  const [saveToast, setSaveToast] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Course Passcode Gate State
  const [unlockedItems, setUnlockedItems] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_lab1_unlocked_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlockedPasscodes, setUnlockedPasscodes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_lab1_unlocked_passcodes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [passcodeGateItem, setPasscodeGateItem] = useState<{
    type: 'lesson' | 'doc';
    id: string;
    title: string;
    requiredPasscode: string;
    onSuccess?: () => void;
  } | null>(null);
  const [enteredPasscode, setEnteredPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Admin Access Guard Function
  const handleOpenAdminManager = (tab: 'lessons' | 'vault' = 'lessons') => {
    setAdminTab(tab);
    setEditLessonForm(currentLesson);
    setIsAdminManagerOpen(true);
  };

  const isLessonUnlocked = (lesson: ClassroomLesson) => {
    if (lesson.isFree !== false) return true;
    if (unlockedItems.includes(lesson.id)) return true;
    const reqCode = (lesson.requiredPasscode || 'PHY-101').trim().toUpperCase();
    return unlockedPasscodes.includes(reqCode);
  };

  const isDocumentUnlocked = (doc: VaultDocument) => {
    if (doc.isFree) return true;
    if (unlockedItems.includes(doc.id)) return true;
    const reqCode = (doc.requiredPasscode || 'PHY-101').trim().toUpperCase();
    return unlockedPasscodes.includes(reqCode);
  };

  const isValidPasscode = (entered: string, required?: string) => {
    const clean = entered.trim().toUpperCase();
    if (!clean) return false;
    const reqClean = (required || 'PHY-101').trim().toUpperCase();
    if (clean === reqClean) return true;
    const validCodes = [
      'PHY-101',
      'MECH-77',
      'COSMO-99',
      'QUANTUM-88',
      'THERMO-55',
      'ELECTRO-303',
      'OPTICS-12',
      'ASTRO-42',
      'WAVE-2026',
      'NEWTON-01',
      'EINSTEIN-07',
      'PHYSICS-99',
      'PHY-701',
      'DEMO-PIN',
    ];
    return validCodes.includes(clean);
  };

  const handleVerifyPasscode = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passcodeGateItem) return;

    const entered = enteredPasscode.trim().toUpperCase();
    if (!entered) {
      setPasscodeError('กรุณากรอกรหัสผ่านเพื่อเข้าเรียน');
      return;
    }

    if (isValidPasscode(entered, passcodeGateItem.requiredPasscode)) {
      const targetReq = (passcodeGateItem.requiredPasscode || 'PHY-101').toUpperCase();
      const updatedPasscodes = Array.from(new Set([...unlockedPasscodes, entered, targetReq]));
      const updatedItems = Array.from(new Set([...unlockedItems, passcodeGateItem.id]));

      setUnlockedPasscodes(updatedPasscodes);
      setUnlockedItems(updatedItems);
      try {
        localStorage.setItem('ssl_lab1_unlocked_passcodes', JSON.stringify(updatedPasscodes));
        localStorage.setItem('ssl_lab1_unlocked_items', JSON.stringify(updatedItems));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }

      showToast(`ปลดล็อก "${passcodeGateItem.title}" สำเร็จ เข้าใช้งานได้ทันที`);

      const callback = passcodeGateItem.onSuccess;
      setPasscodeGateItem(null);
      setEnteredPasscode('');
      setPasscodeError('');

      if (callback) {
        callback();
      }
    } else {
      setPasscodeError(
        `รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบรหัสผ่านของคุณอีกครั้ง (รหัสสำหรับรายการนี้คือ: ${
          passcodeGateItem.requiredPasscode || 'PHY-101'
        })`
      );
    }
  };

  const handleCopyPasscode = (code: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    showToast(`คัดลอกรหัสผ่าน "${code}" เรียบร้อยแล้ว`);
  };

  useEffect(() => {
    if (initialPin) {
      setSelectedCourse(initialPin);
    }
  }, [initialPin, isOpen]);

  const currentLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  // Direct download PDF handler supporting Base64 data, Google Drive direct links, and standard URLs
  const handleDownloadPdf = async (urlOrData: string, fileName: string, id: string, fileData?: string) => {
    const fileContent = fileData || urlOrData;
    if (!fileContent) {
      showToast('ไม่พบข้อมูลไฟล์จริงในระบบ');
      return;
    }

    let downloadName = (fileName || 'document.pdf').trim();
    if (!downloadName.toLowerCase().endsWith('.pdf')) {
      downloadName += '.pdf';
    }

    setDownloadingId(id);

    try {
      // 1. Google Drive Link Handling
      const isGoogleDrive =
        fileContent.includes('drive.google.com') || fileContent.includes('docs.google.com');

      if (isGoogleDrive) {
        let fileId = '';
        const match1 = fileContent.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        const match2 = fileContent.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        const match3 = fileContent.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match1 && match1[1]) fileId = match1[1];
        else if (match2 && match2[1]) fileId = match2[1];
        else if (match3 && match3[1]) fileId = match3[1];

        const directUrl = fileId
          ? `https://drive.google.com/uc?export=download&id=${fileId}`
          : fileContent;

        const link = document.createElement('a');
        link.href = directUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`เปิดดาวน์โหลด Google Drive "${downloadName}" ในหน้าต่างใหม่แล้ว`);
        return;
      }

      // 2. Base64 Uploaded File Handling
      const isBase64 =
        fileContent.startsWith('data:') ||
        (fileContent.length > 200 &&
          !fileContent.startsWith('http://') &&
          !fileContent.startsWith('https://') &&
          !fileContent.startsWith('blob:'));

      if (isBase64) {
        try {
          const arr = fileContent.split(',');
          const mimeMatch = arr[0].match(/:(.*?);/);
          const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
          const base64Clean = (arr[1] || arr[0]).replace(/\s/g, '');
          const bstr = atob(base64Clean);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
          }
          const blob = new Blob([u8arr], { type: mime || 'application/pdf' });
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = downloadName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
          showToast(`ดาวน์โหลดไฟล์ PDF "${downloadName}" สำเร็จเรียบร้อย`);
        } catch (b64Err) {
          console.error('Base64 Blob conversion error:', b64Err);
          const link = document.createElement('a');
          link.href = fileContent;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          showToast(`เปิดไฟล์ "${downloadName}" ในหน้าต่างใหม่แล้ว`);
        }
        return;
      }

      // 3. Standard HTTP/HTTPS Direct Links
      if (fileContent.startsWith('http://') || fileContent.startsWith('https://')) {
        try {
          const response = await fetch(fileContent);
          if (!response.ok) throw new Error('Fetch failed');
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);
          showToast(`ดาวน์โหลด "${downloadName}" เรียบร้อยแล้ว`);
        } catch {
          const a = document.createElement('a');
          a.href = fileContent;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.download = downloadName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          showToast(`เปิดดาวน์โหลด "${downloadName}" ในหน้าต่างใหม่แล้ว`);
        }
      } else {
        const link = document.createElement('a');
        link.href = fileContent;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`เปิดไฟล์ "${downloadName}" ในหน้าต่างใหม่แล้ว`);
      }
    } catch (err) {
      console.error('Download failed:', err);
      const link = document.createElement('a');
      link.href = fileContent;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`เปิดไฟล์ "${downloadName}" ในหน้าต่างใหม่แล้ว`);
    } finally {
      setDownloadingId(null);
    }
  };

  // Save lesson edit
  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = lessons.map((l) => (l.id === editLessonForm.id ? editLessonForm : l));
    setLessons(updated);
    try {
      localStorage.setItem('ssl_classroom_lessons', JSON.stringify(updated));
    } catch (e) {}
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
    setIsAdminManagerOpen(false);
  };

  // Save or Add Vault Document
  const handleSaveVaultDoc = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: VaultDocument[];
    if (isAddingVaultDoc) {
      const newDoc: VaultDocument = {
        ...editVaultForm,
        id: `doc-${Date.now()}`,
        pdfFileName: editVaultForm.pdfFileName || `${editVaultForm.title.slice(0, 20)}.pdf`,
      };
      updated = [newDoc, ...vaultDocs];
    } else {
      updated = vaultDocs.map((d) => (d.id === editVaultForm.id ? editVaultForm : d));
    }

    setVaultDocs(updated);
    try {
      localStorage.setItem('ssl_document_vault_items', JSON.stringify(updated));
    } catch (e) {}

    setIsAddingVaultDoc(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
    setIsAdminManagerOpen(false);
  };

  // Robust Delete Confirmation Handler (PDF & Video)
  const handleConfirmDelete = () => {
    if (!deletingItem) return;

    if (deletingItem.type === 'pdf') {
      const updated = vaultDocs.filter((d) => d.id !== deletingItem.id);
      setVaultDocs(updated);
      try {
        localStorage.setItem('ssl_document_vault_items', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      showToast(`ลบเอกสาร "${deletingItem.title}" เรียบร้อยแล้ว`);
      if (editVaultForm.id === deletingItem.id) {
        setEditVaultForm({
          id: '',
          title: '',
          category: 'ม.4',
          grade: 'ม.4 เทอม 1',
          pages: 15,
          fileSize: '2.5 MB',
          pdfUrl: '',
          pdfFileName: '',
          isFree: true,
          requiredPasscode: getRandomPasscode(),
          description: '',
        });
        setIsAddingVaultDoc(false);
      }
    } else if (deletingItem.type === 'video') {
      if (lessons.length <= 1) {
        showToast('ไม่สามารถลบบทเรียนสุดท้ายได้ อย่างน้อยต้องมี 1 บทเรียนในระบบ');
        setDeletingItem(null);
        return;
      }
      const updated = lessons.filter((l) => l.id !== deletingItem.id);
      setLessons(updated);
      try {
        localStorage.setItem('ssl_classroom_lessons', JSON.stringify(updated));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }
      showToast(`ลบบทเรียนวิดีโอ "${deletingItem.title}" เรียบร้อยแล้ว`);

      if (activeLessonId === deletingItem.id && updated.length > 0) {
        setActiveLessonId(updated[0].id);
      }
      if (editLessonForm.id === deletingItem.id && updated.length > 0) {
        setEditLessonForm(updated[0]);
      }
    }

    setDeletingItem(null);
  };

  // Reset all defaults
  const handleResetAllDefaults = () => {
    if (confirm('ต้องการรีเซ็ตบทเรียนและคลังเอกสารทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setLessons(DEFAULT_LESSONS);
      setVaultDocs(DEFAULT_VAULT_DOCUMENTS);
      try {
        localStorage.removeItem('ssl_classroom_lessons');
        localStorage.removeItem('ssl_document_vault_items');
      } catch (e) {}
      setIsAdminManagerOpen(false);
    }
  };

  // Filter vault documents
  const filteredVaultDocs = vaultDocs.filter((doc) => {
    const matchesCategory = selectedCategory === 'ทั้งหมด' || doc.category === selectedCategory;
    const matchesSearch =
      !searchVault ||
      doc.title.toLowerCase().includes(searchVault.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchVault.toLowerCase()) ||
      doc.grade.toLowerCase().includes(searchVault.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      } bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200`}
    >
      {/* Toast floating banner */}
      {toastMessage && (
        <div className="fixed top-5 z-80 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container - Clean Light Mode UI */}
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'w-screen h-screen rounded-none max-w-none border-none'
            : 'max-w-6xl h-[92vh] rounded-3xl border border-slate-200'
        } bg-slate-50 text-slate-800 shadow-2xl flex flex-col overflow-hidden transition-all duration-200`}
      >
        {/* ========================================================================= */}
        {/* TOP HEADER BAR - Clean & Minimal                                          */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            {viewMode !== 'hub' && (
              <button
                onClick={() => setViewMode('hub')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer shrink-0"
                title="กลับสู่หน้าเลือกหมวดหมู่หลัก"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">หน้าหลัก Hub</span>
              </button>
            )}

            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                ห้องเรียนออนไลน์ & คลังเอกสารฟิสิกส์
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-md sm:max-w-xl mt-0.5">
                {viewMode === 'hub'
                  ? 'เลือกเข้าสู่ห้องเรียนวิดีโอ 4K พร้อมชีทใต้คลิป หรือเปิดคลังเอกสารข้อสอบอิสระ'
                  : viewMode === 'video_classroom'
                  ? `${currentLesson.title} • ดาวน์โหลดชีทสรุปใต้คลิป`
                  : 'คลังรวบรวมไฟล์ข้อสอบ PDF, แบบฝึกหัด สอวน. และสรุปสูตรฟิสิกส์'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline-flex text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
              {viewMode === 'hub'
                ? 'HUB NAVIGATION'
                : viewMode === 'video_classroom'
                ? 'VIDEO CLASSROOM'
                : 'EXAM & PDF VAULT'}
            </span>

            {/* Admin Manager Button - Force Display Always */}
            <button
              onClick={() => handleOpenAdminManager(viewMode === 'document_vault' ? 'vault' : 'lessons')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="จัดการสื่อ YouTube และคลังเอกสาร PDF"
            >
              <Settings className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">จัดการสื่อ & คลัง (Admin)</span>
              <span className="sm:hidden">Admin</span>
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              title={isFullscreen ? 'ย่อหน้าต่างกลับเดิม' : 'ขยายเต็มจอ (Fullscreen)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-indigo-600" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Save Toast Notification */}
        {saveToast && (
          <div className="bg-emerald-50 border-b border-emerald-200 text-emerald-800 px-4 py-2 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>บันทึกการเปลี่ยนแปลงสื่อและคลังเอกสารเรียบร้อยแล้ว</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-600 font-bold">SAVED TO LOCALSTORAGE</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN BODY: VIEW SWITCHER (HUB / VIDEO CLASSROOM / DOCUMENT VAULT)         */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col">
          {/* ----------------------------------------------------------------------- */}
          {/* 1. HUB VIEW: 2 COLUMNS CHOICE CARDS                                     */}
          {/* ----------------------------------------------------------------------- */}
          {viewMode === 'hub' && (
            <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center max-w-5xl mx-auto w-full space-y-8 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Layers className="w-3.5 h-3.5 text-indigo-600" />
                  <span>SEVEN SPACE LAB 1 HUB</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  เลือกรูปแบบการเรียนรู้และคลังเอกสาร
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
                  เข้าสู่ห้องเรียนวิดีโอ 4K พร้อมชีทสรุป หรือเปิดคลังเอกสารข้อสอบฟิสิกส์อิสระสำหรับดาวน์โหลด
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* 1.1 Left Hero Card: ห้องเรียนวิดีโอออนไลน์ */}
                <div className="group relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform shadow-xs">
                        <Video className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-indigo-50 border border-indigo-200 text-indigo-700">
                        4K YOUTUBE + SHEET
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        ห้องเรียนวิดีโอออนไลน์
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        ดูบทเรียนฟิสิกส์ 4K คมชัดสูงผ่าน YouTube Embed พร้อมปุ่มดาวน์โหลดชีทสรุปประจำบทเรียน (PDF) ใต้คลิปโดยตรง
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>เครื่องเล่นวิดีโอ YouTube Responsive 16:9</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ปุ่มดาวน์โหลดชีท PDF ประจำบทเรียนใต้คลิป</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>สลับตอนในหลักสูตรได้อย่างง่ายดาย</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewMode('video_classroom')}
                    className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>เข้าห้องเรียนวิดีโอ (Enter Video Class)</span>
                  </button>
                </div>

                {/* 1.2 Right Hero Card: คลังเอกสาร & ข้อสอบฟิสิกส์ */}
                <div className="group relative rounded-3xl p-6 sm:p-8 bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform shadow-xs">
                        <FileText className="w-7 h-7" />
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold bg-amber-50 border border-amber-200 text-amber-800">
                        DOCUMENT VAULT
                      </span>
                    </div>

                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                        คลังเอกสาร & ข้อสอบฟิสิกส์
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                        ศูนย์รวมไฟล์ PDF ข้อสอบเข้ามหาวิทยาลัย, ตะลุยโจทย์ สอวน., แบบฝึกหัดแยกบท และสรุปสูตรฟิสิกส์ครบวงจร
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>คลังข้อสอบและแบบฝึกหัด {vaultDocs.length}+ ชุด</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>พรีวิวดูตัวอย่าง และดาวน์โหลด PDF ฉบับเต็ม</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>ค้นหาและกรองแยกหมวดหมู่ ม.4 - ม.6 / TCAS</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setViewMode('document_vault')}
                    className="mt-6 w-full py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>เปิดคลังเอกสารข้อสอบ (Open Exam Vault)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* 2. VIDEO CLASSROOM: YOUTUBE + ATTACHED SHEET UNDERNEATH                 */}
          {/* ----------------------------------------------------------------------- */}
          {viewMode === 'video_classroom' && (
            <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
              {/* Main Video & Attached PDF Underneath (8 Cols) */}
              <div className="lg:col-span-8 flex flex-col space-y-4">
                {/* 2.1 YouTube Embed Player (16:9 Aspect Ratio) or Course Passcode Gate */}
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-900 border border-slate-300 shadow-sm">
                  {isLessonUnlocked(currentLesson) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(currentLesson.youtubeUrl)}
                      title={currentLesson.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center p-6 text-center text-white">
                      <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 mb-3 shadow-md">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold mb-2">
                        <span>เนื้อหาเฉพาะคอร์สเรียน (ต้องใช้รหัสผ่าน)</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-white max-w-md mb-1 truncate">
                        {currentLesson.title}
                      </h3>
                      <p className="text-xs text-slate-300 max-w-sm mb-5 leading-relaxed">
                        บทเรียนนี้สงวนสิทธิ์สำหรับผู้ลงทะเบียนคอร์สเรียน กรุณากรอกรหัสผ่านเพื่อเข้าเรียน
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setPasscodeGateItem({
                            type: 'lesson',
                            id: currentLesson.id,
                            title: currentLesson.title,
                            requiredPasscode: currentLesson.requiredPasscode || 'PHY-101',
                            onSuccess: () => {},
                          });
                          setEnteredPasscode('');
                          setPasscodeError('');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer active:scale-98 transition-all"
                      >
                        <Lock className="w-4 h-4" />
                        <span>กรอกรหัสผ่านเพื่อเข้าเรียน (Course Passcode)</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2.2 Lesson Info & Attached PDF Action Card Underneath */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                        <span>{currentLesson.title}</span>
                        {!isLessonUnlocked(currentLesson) && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5 text-amber-600" />
                            <span>[ ปลดล็อกด้วยรหัสผ่าน ]</span>
                          </span>
                        )}
                        {isLessonUnlocked(currentLesson) && currentLesson.isFree !== false && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            [ ฟรี ]
                          </span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">{currentLesson.subtitle}</p>
                    </div>

                    <a
                      href={currentLesson.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-semibold transition-all border border-slate-200 self-start sm:self-auto cursor-pointer"
                    >
                      <span>เปิดบน YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Dedicated Attached PDF Sheet Section */}
                  <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                          <span>ชีทสรุปเอกสารประจำบทเรียน (PDF)</span>
                          <span
                            className={`text-[10px] px-2 py-0.2 rounded font-mono font-bold ${
                              isLessonUnlocked(currentLesson)
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isLessonUnlocked(currentLesson) ? 'พร้อมดาวน์โหลด' : 'ล็อกรหัสผ่าน'}
                          </span>
                          {(currentLesson.isCustomUpload || currentLesson.fileData) && (
                            <span className="text-[10px] px-2 py-0.2 rounded font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                              <UploadCloud className="w-3 h-3 text-emerald-600" />
                              <span>ไฟล์อัปโหลดจริง</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono">
                          {currentLesson.pdfFileName}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (isLessonUnlocked(currentLesson)) {
                            setPreviewDoc({
                              title: currentLesson.title,
                              url: currentLesson.fileData || currentLesson.pdfUrl,
                              fileName: currentLesson.pdfFileName,
                            });
                          } else {
                            setPasscodeGateItem({
                              type: 'lesson',
                              id: currentLesson.id,
                              title: currentLesson.title,
                              requiredPasscode: currentLesson.requiredPasscode || 'PHY-101',
                              onSuccess: () =>
                                setPreviewDoc({
                                  title: currentLesson.title,
                                  url: currentLesson.fileData || currentLesson.pdfUrl,
                                  fileName: currentLesson.pdfFileName,
                                }),
                            });
                            setEnteredPasscode('');
                            setPasscodeError('');
                          }
                        }}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-indigo-600" />
                        <span>พรีวิวชีท</span>
                      </button>

                      <button
                        onClick={() => {
                          const targetName = currentLesson.pdfFileName || `${currentLesson.title}.pdf`;
                          if (isLessonUnlocked(currentLesson)) {
                            handleDownloadPdf(currentLesson.pdfUrl, targetName, currentLesson.id, currentLesson.fileData);
                          } else {
                            setPasscodeGateItem({
                              type: 'lesson',
                              id: currentLesson.id,
                              title: currentLesson.title,
                              requiredPasscode: currentLesson.requiredPasscode || 'PHY-101',
                              onSuccess: () =>
                                handleDownloadPdf(currentLesson.pdfUrl, targetName, currentLesson.id, currentLesson.fileData),
                            });
                            setEnteredPasscode('');
                            setPasscodeError('');
                          }
                        }}
                        disabled={downloadingId === currentLesson.id}
                        className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer active:scale-98 disabled:opacity-50 ${
                          isLessonUnlocked(currentLesson)
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                            : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                        }`}
                      >
                        {downloadingId === currentLesson.id ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : isLessonUnlocked(currentLesson) ? (
                          <Download className="w-3.5 h-3.5" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-slate-950" />
                        )}
                        <span>
                          {isLessonUnlocked(currentLesson)
                            ? 'ดาวน์โหลดชีทประจำบท (PDF)'
                            : 'ใส่รหัสผ่านเพื่อดาวน์โหลด'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Key Formulas Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {currentLesson.keyPoints.map((kp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900 mb-0.5">{kp.title}</div>
                        {kp.formula && (
                          <div className="font-mono text-indigo-700 text-[11px] mb-1 font-bold bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                            {kp.formula}
                          </div>
                        )}
                        <p className="text-[11px] text-slate-600 leading-snug">{kp.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Playlist (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                      <span>รายการบทเรียน ({lessons.length} ตอน)</span>
                    </h4>

                    <button
                      onClick={() => handleOpenAdminManager('lessons')}
                      className="text-[10px] text-indigo-600 hover:underline font-bold cursor-pointer flex items-center gap-1"
                    >
                      <Settings className="w-3 h-3" />
                      <span>แก้ไขลิงก์</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {lessons.map((lesson) => {
                      const isActive = lesson.id === activeLessonId;
                      const isUnlocked = isLessonUnlocked(lesson);
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => {
                            if (isUnlocked) {
                              setActiveLessonId(lesson.id);
                            } else {
                              setPasscodeGateItem({
                                type: 'lesson',
                                id: lesson.id,
                                title: lesson.title,
                                requiredPasscode: lesson.requiredPasscode || 'PHY-101',
                                onSuccess: () => setActiveLessonId(lesson.id),
                              });
                              setEnteredPasscode('');
                              setPasscodeError('');
                            }
                          }}
                          className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                            isActive
                              ? 'bg-indigo-50/90 border-indigo-300 text-slate-900 ring-1 ring-indigo-400 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={`font-bold text-xs ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                              {lesson.title}
                            </span>
                            {isActive && <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />}
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                            {lesson.subtitle}
                          </p>

                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200/80">
                            <span className="flex items-center gap-1 text-slate-600">
                              <Video className="w-3 h-3 text-indigo-600" />
                              <span>{lesson.duration} MIN</span>
                            </span>
                            {isUnlocked ? (
                              <span className="flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                <CheckCircle className="w-3 h-3 text-emerald-600" />
                                <span>{lesson.isFree !== false ? '[ ฟรี ]' : 'ปลดล็อกแล้ว'}</span>
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                <Lock className="w-2.5 h-2.5 text-amber-600" />
                                <span>[ ปลดล็อกด้วยรหัสผ่าน ]</span>
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ระบบ Open Access & Course Passcode</span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    บทเรียนฟรีเปิดดูได้ทันที • บทเรียนคอร์สใช้รหัสผ่านเพื่อปลดล็อก
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------------------- */}
          {/* 3. DOCUMENT VAULT: REPOSITORY FOR EXAMS & PDF SHEETS                    */}
          {/* ----------------------------------------------------------------------- */}
          {viewMode === 'document_vault' && (
            <div className="flex-1 p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
              {/* Top Search & Filter Bar */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchVault}
                    onChange={(e) => setSearchVault(e.target.value)}
                    placeholder="ค้นหาชื่อชุดข้อสอบ, ระดับชั้น, สอวน., TCAS..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 outline-hidden font-medium focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  {searchVault && (
                    <button
                      onClick={() => setSearchVault('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      ล้าง
                    </button>
                  )}
                </div>

                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
                  {['ทั้งหมด', 'ม.4', 'ม.5', 'ม.6', 'สอวน. & TCAS', 'สรุปสูตร'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Add Document Button (Admin Always Visible) */}
                <button
                  onClick={() => {
                    setAdminTab('vault');
                    setIsAddingVaultDoc(true);
                    setEditVaultForm({
                      id: '',
                      title: '',
                      category: 'ม.4',
                      grade: 'ม.4 เทอม 1',
                      pages: 15,
                      fileSize: '2.5 MB',
                      pdfUrl: '',
                      pdfFileName: '',
                      isFree: true,
                      requiredPasscode: getRandomPasscode(),
                      description: '',
                    });
                    setIsAdminManagerOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่มเอกสาร (Admin)</span>
                </button>
              </div>

              {/* Document Grid Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVaultDocs.map((doc) => {
                  const isUnlocked = isDocumentUnlocked(doc);
                  return (
                    <div
                      key={doc.id}
                      className="rounded-2xl p-5 bg-white border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-indigo-300"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-1">
                          <span
                            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                              doc.isFree || isUnlocked
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200 flex items-center gap-1'
                            }`}
                          >
                            {doc.isFree ? (
                              <span>[ ฟรี ]</span>
                            ) : isUnlocked ? (
                              <span>[ ปลดล็อกแล้ว ]</span>
                            ) : (
                              <>
                                <Lock className="w-3 h-3 text-amber-600 inline" />
                                <span>[ ปลดล็อกด้วยรหัสผ่าน ]</span>
                              </>
                            )}
                          </span>

                          <div className="flex items-center gap-1">
                            {doc.isCustomUpload || doc.fileData ? (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-xs">
                                <UploadCloud className="w-3 h-3 text-emerald-600" />
                                <span>[ REAL FILE ]</span>
                              </span>
                            ) : (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1">
                                <FileCheck className="w-3 h-3 text-indigo-600" />
                                <span>[ PDF FILE ]</span>
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-semibold">
                              {doc.category}
                            </span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                            {doc.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                            {doc.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
                          <span>{doc.grade}</span>
                          <span>{doc.pages} หน้า • {doc.fileSize}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => {
                            const targetName = doc.pdfFileName || `${doc.title}.pdf`;
                            if (isUnlocked) {
                              setPreviewDoc({
                                title: doc.title,
                                url: doc.fileData || doc.pdfUrl,
                                fileName: targetName,
                              });
                            } else {
                              setPasscodeGateItem({
                                type: 'doc',
                                id: doc.id,
                                title: doc.title,
                                requiredPasscode: doc.requiredPasscode || 'PHY-101',
                                onSuccess: () =>
                                  setPreviewDoc({
                                    title: doc.title,
                                    url: doc.fileData || doc.pdfUrl,
                                    fileName: targetName,
                                  }),
                              });
                              setEnteredPasscode('');
                              setPasscodeError('');
                            }
                          }}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-600" />
                          <span>พรีวิวตัวอย่าง</span>
                        </button>

                        <button
                          onClick={() => {
                            const targetName = doc.pdfFileName || `${doc.title}.pdf`;
                            if (isUnlocked) {
                              handleDownloadPdf(doc.pdfUrl, targetName, doc.id, doc.fileData);
                            } else {
                              setPasscodeGateItem({
                                type: 'doc',
                                id: doc.id,
                                title: doc.title,
                                requiredPasscode: doc.requiredPasscode || 'PHY-101',
                                onSuccess: () =>
                                  handleDownloadPdf(doc.pdfUrl, targetName, doc.id, doc.fileData),
                              });
                              setEnteredPasscode('');
                              setPasscodeError('');
                            }
                          }}
                          disabled={downloadingId === doc.id}
                          className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                            isUnlocked
                              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          }`}
                        >
                          {downloadingId === doc.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : !isUnlocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-950" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>{isUnlocked ? 'ดาวน์โหลด PDF' : 'ใส่รหัสผ่าน'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredVaultDocs.length === 0 && (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">ไม่พบเอกสารข้อสอบที่ตรงกับคำค้นหา "{searchVault}"</p>
                  <button
                    onClick={() => {
                      setSearchVault('');
                      setSelectedCategory('ทั้งหมด');
                    }}
                    className="text-xs text-indigo-600 underline font-bold cursor-pointer"
                  >
                    ล้างตัวกรองทั้งหมด
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PREVIEW MODAL (INLINE PDF VIEWER)                                         */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-4xl h-[85vh] bg-white text-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-sm text-slate-900 truncate max-w-lg">
                  พรีวิวเอกสาร: {previewDoc.title}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownloadPdf(previewDoc.url, previewDoc.fileName, 'preview-doc')
                  }
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ดาวน์โหลด PDF</span>
                </button>

                <button
                  onClick={() => setPreviewDoc(null)}
                  className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-100 p-2">
              <iframe
                src={getPdfPreviewUrl(previewDoc.url)}
                title={previewDoc.title}
                className="w-full h-full rounded-xl border border-slate-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COURSE PASSCODE GATE MODAL                                                */}
      {/* ========================================================================= */}
      {passcodeGateItem && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-amber-300 rounded-3xl shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-slate-800 space-y-4">
            <button
              type="button"
              onClick={() => {
                setPasscodeGateItem(null);
                setPasscodeError('');
                setEnteredPasscode('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-2 shadow-xs">
              <Lock className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold uppercase tracking-wider">
              เนื้อหาเฉพาะคอร์สเรียน (ต้องใช้รหัสผ่าน)
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug">
                กรุณากรอกรหัสผ่านเพื่อปลดล็อก (Course Passcode)
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ปลดล็อกเข้าถึง: <strong className="text-slate-900">{passcodeGateItem.title}</strong>
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4 pt-1">
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={enteredPasscode}
                  onChange={(e) => {
                    setEnteredPasscode(e.target.value);
                    setPasscodeError('');
                  }}
                  placeholder="พิมพ์รหัสผ่าน เช่น PHY-101"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-300 focus:border-indigo-500 focus:bg-white text-center font-mono font-bold text-indigo-900 text-base placeholder:text-slate-400 outline-hidden tracking-wider uppercase transition-all"
                />
                {passcodeError && (
                  <p className="text-rose-600 text-xs mt-2 font-semibold">
                    {passcodeError}
                  </p>
                )}
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEnteredPasscode(passcodeGateItem.requiredPasscode || 'PHY-101');
                    setPasscodeError('');
                  }}
                  className="text-[11px] text-indigo-600 hover:text-indigo-800 underline font-mono cursor-pointer inline-flex items-center gap-1 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>ทดสอบระบบด้วยรหัสคอร์ส: {passcodeGateItem.requiredPasscode || 'PHY-101'}</span>
                </button>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasscodeGateItem(null);
                    setPasscodeError('');
                    setEnteredPasscode('');
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98"
                >
                  ยืนยันและปลดล็อกทันที
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {deletingItem && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-white border border-rose-200 rounded-3xl shadow-2xl p-6 text-center overflow-hidden text-slate-800 space-y-4">
            <button
              type="button"
              onClick={() => setDeletingItem(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mx-auto w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-1 shadow-xs">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-mono text-[11px] font-bold uppercase tracking-wider">
              ยืนยันการลบข้อมูล
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5 leading-snug">
                ยืนยันการลบ {deletingItem.type === 'video' ? 'บทเรียนวิดีโอ' : 'ชุดข้อสอบ PDF'}?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-200">
                "{deletingItem.title}"
              </p>
              <p className="text-[11px] text-rose-600 mt-2 font-semibold">
                ข้อควรระวัง: การดำเนินการนี้จะลบรายการออกจากระบบทันทีและไม่สามารถย้อนกลับได้
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer border border-slate-200"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>ยืนยันการลบ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN MEDIA & VAULT MANAGER MODAL                                         */}
      {/* ========================================================================= */}
      {isAdminManagerOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 text-slate-900 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 font-bold text-base text-slate-900">
                <Settings className="w-5 h-5 text-indigo-600" />
                <span>จัดการสื่อห้องเรียน & คลังข้อสอบ (Admin Media & Vault Manager)</span>
              </div>
              <button
                onClick={() => setIsAdminManagerOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Admin Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
              <button
                onClick={() => {
                  setAdminTab('lessons');
                  setIsAddingVaultDoc(false);
                }}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  adminTab === 'lessons'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                1. จัดการวิดีโอ YouTube & ชีทประจำบท ({lessons.length} บท)
              </button>

              <button
                onClick={() => setAdminTab('vault')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  adminTab === 'vault'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                2. จัดการไฟล์คลังข้อสอบ PDF ({vaultDocs.length} ชุด)
              </button>
            </div>

            {/* Tab 1: Edit Lessons Form & Video Summary List */}
            {adminTab === 'lessons' && (
              <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <form onSubmit={handleSaveLesson} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 font-mono mb-1 font-bold">
                      เลือกบทเรียนที่ต้องการแก้ไข
                    </label>
                    <select
                      value={editLessonForm.id}
                      onChange={(e) => {
                        const selected = lessons.find((l) => l.id === e.target.value) || lessons[0];
                        setEditLessonForm(selected);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-bold focus:border-indigo-500"
                    >
                      {lessons.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono mb-1 font-bold">
                      ชื่อบทเรียน (Title)
                    </label>
                    <input
                      type="text"
                      value={editLessonForm.title}
                      onChange={(e) => setEditLessonForm({ ...editLessonForm, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-semibold focus:border-indigo-500"
                      required
                    />
                  </div>

                  {/* Access Control Setup */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <label className="block text-slate-900 font-bold font-mono">
                      สิทธิ์การเข้าถึงบทเรียน (Access Control)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <label
                        onClick={() => setEditLessonForm({ ...editLessonForm, isFree: true })}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          editLessonForm.isFree !== false
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-400'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="lessonAccess"
                          checked={editLessonForm.isFree !== false}
                          onChange={() => setEditLessonForm({ ...editLessonForm, isFree: true })}
                          className="accent-emerald-600"
                        />
                        <div className="text-xs">
                          <div className="font-bold">ฟรีสำหรับทุกคน (Open Access)</div>
                          <div className="text-[10px] text-slate-500">ไม่ต้องใส่รหัส เปิดดูและโหลดได้ทันที</div>
                        </div>
                      </label>

                      <label
                        onClick={() =>
                          setEditLessonForm({
                            ...editLessonForm,
                            isFree: false,
                            requiredPasscode: editLessonForm.requiredPasscode || getRandomPasscode(),
                          })
                        }
                        className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                          editLessonForm.isFree === false
                            ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-1 ring-amber-400'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="radio"
                          name="lessonAccess"
                          checked={editLessonForm.isFree === false}
                          onChange={() =>
                            setEditLessonForm({
                              ...editLessonForm,
                              isFree: false,
                              requiredPasscode: editLessonForm.requiredPasscode || getRandomPasscode(),
                            })
                          }
                          className="accent-amber-600"
                        />
                        <div className="text-xs">
                          <div className="font-bold">ต้องใช้รหัสผ่าน (Course Passcode Protected)</div>
                          <div className="text-[10px] text-slate-500">สำหรับผู้สมัครคอร์สเท่านั้น</div>
                        </div>
                      </label>
                    </div>

                    {editLessonForm.isFree === false && (
                      <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                        <label className="block text-slate-700 font-mono font-bold text-[11px]">
                          กำหนดรหัสผ่านคอร์สเรียน (Course Passcode)
                        </label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          <input
                            type="text"
                            value={editLessonForm.requiredPasscode || ''}
                            onChange={(e) =>
                              setEditLessonForm({
                                ...editLessonForm,
                                requiredPasscode: e.target.value.toUpperCase(),
                              })
                            }
                            placeholder="เช่น PHY-101"
                            className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-indigo-900 font-mono font-bold uppercase tracking-wider outline-hidden focus:border-indigo-500"
                          />
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                setEditLessonForm({
                                  ...editLessonForm,
                                  requiredPasscode: getRandomPasscode(),
                                })
                              }
                              className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap text-xs"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                              <span>สุ่มสร้างรหัสอัตโนมัติ</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyPasscode(editLessonForm.requiredPasscode || 'PHY-101')}
                              className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap text-xs"
                            >
                              <Copy className="w-3.5 h-3.5 text-slate-700" />
                              <span>คัดลอกรหัส</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono mb-1 font-bold flex items-center gap-1 text-red-600">
                      <Video className="w-3.5 h-3.5" />
                      <span>YouTube URL หรือ Video ID</span>
                    </label>
                    <input
                      type="text"
                      value={editLessonForm.youtubeUrl}
                      onChange={(e) => setEditLessonForm({ ...editLessonForm, youtubeUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono outline-hidden focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono mb-1 font-bold flex items-center gap-1 text-indigo-600">
                      <FileText className="w-3.5 h-3.5" />
                      <span>ลิงก์ไฟล์ PDF ประจำบทเรียน (Direct URL หรือ Google Drive)</span>
                    </label>
                    <input
                      type="text"
                      value={editLessonForm.pdfUrl}
                      onChange={(e) => setEditLessonForm({ ...editLessonForm, pdfUrl: e.target.value })}
                      placeholder="https://example.com/sheet.pdf"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  {/* File Upload Section for Lesson Sheet */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                    <label className="block text-slate-900 font-bold font-mono text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-indigo-700">
                        <UploadCloud className="w-4 h-4 text-indigo-600" />
                        <span>หรืออัปโหลดชีท PDF ประจำบทเรียนจากเครื่อง (Direct Upload)</span>
                      </span>
                    </label>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-dashed border-indigo-300 text-indigo-700 font-bold text-xs transition-all shadow-xs">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>{editLessonForm.fileData ? 'เปลี่ยนไฟล์ชีท PDF' : 'เลือกไฟล์ชีท PDF จากเครื่อง...'}</span>
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const base64Data = event.target?.result as string;
                                if (base64Data) {
                                  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
                                  setEditLessonForm((prev) => ({
                                    ...prev,
                                    fileData: base64Data,
                                    pdfUrl: base64Data,
                                    pdfFileName: file.name,
                                    isCustomUpload: true,
                                    uploadDate: new Date().toLocaleDateString('th-TH'),
                                  }));
                                  showToast(`โหลดชีท "${file.name}" (${fileSizeMb} MB) พร้อมบันทึก`);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {editLessonForm.fileData && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditLessonForm((prev) => ({
                              ...prev,
                              fileData: undefined,
                              isCustomUpload: false,
                            }));
                            showToast('ยกเลิกไฟล์อัปโหลดแล้ว กลับใช้ลิงก์ URL');
                          }}
                          className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shrink-0 transition-all cursor-pointer"
                        >
                          ลบไฟล์อัปโหลด
                        </button>
                      )}
                    </div>

                    {editLessonForm.isCustomUpload && editLessonForm.pdfFileName && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
                        <div className="flex items-center gap-2 truncate">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="truncate">ชีทที่เลือก: <strong>{editLessonForm.pdfFileName}</strong></span>
                        </div>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold shrink-0">
                          READY TO SAVE
                        </span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-700 font-mono mb-1 font-bold">
                      ชื่อไฟล์ดาวน์โหลด (.pdf)
                    </label>
                    <input
                      type="text"
                      value={editLessonForm.pdfFileName}
                      onChange={(e) => setEditLessonForm({ ...editLessonForm, pdfFileName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 font-mono outline-hidden focus:border-indigo-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleResetAllDefaults}
                        className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer border border-slate-200"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>คืนค่าเริ่มต้น</span>
                      </button>

                      {/* Delete Video Button */}
                      <button
                        type="button"
                        onClick={() =>
                          setDeletingItem({
                            id: editLessonForm.id,
                            title: editLessonForm.title,
                            type: 'video',
                          })
                        }
                        className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold flex items-center gap-1 cursor-pointer border border-rose-200"
                        title="ลบบทเรียนวิดีโอนี้"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                        <span>ลบบทเรียนวิดีโอนี้</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAdminManagerOpen(false)}
                        className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold border border-slate-200 cursor-pointer"
                      >
                        ยกเลิก
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>บันทึกบทเรียน</span>
                      </button>
                    </div>
                  </div>
                </form>

                {/* Video Lessons Summary List with Edit & Delete Action Buttons */}
                <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                  <span className="font-bold text-slate-900 block mb-1">
                    สรุปรายการบทเรียนวิดีโอทั้งหมด ({lessons.length} บท)
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          editLessonForm.id === lesson.id
                            ? 'bg-indigo-50 border-indigo-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                            <span>{lesson.title}</span>
                            <span
                              className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                lesson.isFree !== false
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {lesson.isFree !== false ? 'ฟรี' : `เฉพาะคอร์ส (${lesson.requiredPasscode || 'PHY-101'})`}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {lesson.duration} นาที • {lesson.pdfFileName}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => setEditLessonForm(lesson)}
                            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                            title="เลือกแก้ไขบทเรียนนี้"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setDeletingItem({
                                id: lesson.id,
                                title: lesson.title,
                                type: 'video',
                              })
                            }
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 cursor-pointer"
                            title="ลบบทเรียนนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Vault Documents Management */}
            {adminTab === 'vault' && (
              <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                {isAddingVaultDoc || editVaultForm.id ? (
                  <form onSubmit={handleSaveVaultDoc} className="space-y-3.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-indigo-900">
                        {isAddingVaultDoc ? 'เพิ่มชุดข้อสอบ PDF ใหม่' : 'แก้ไขชุดข้อสอบ'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingVaultDoc(false);
                          setEditVaultForm({ ...editVaultForm, id: '' });
                        }}
                        className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold cursor-pointer"
                      >
                        ยกเลิกแก้ไข
                      </button>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono mb-1 font-bold">
                        ชื่อชุดข้อสอบ / ชื่อเอกสาร
                      </label>
                      <input
                        type="text"
                        value={editVaultForm.title}
                        onChange={(e) => setEditVaultForm({ ...editVaultForm, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold outline-hidden focus:border-indigo-500"
                        placeholder="เช่น ชุดข้อสอบ A-Level ฟิสิกส์ 68"
                        required
                      />
                    </div>

                    {/* Vault Access Control Setup */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-3">
                      <label className="block text-slate-900 font-bold font-mono">
                        สิทธิ์การเข้าถึงเอกสาร (Access Control)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label
                          onClick={() => setEditVaultForm({ ...editVaultForm, isFree: true })}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                            editVaultForm.isFree
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold ring-1 ring-emerald-400'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="vaultAccess"
                            checked={editVaultForm.isFree}
                            onChange={() => setEditVaultForm({ ...editVaultForm, isFree: true })}
                            className="accent-emerald-600"
                          />
                          <div className="text-xs">
                            <div className="font-bold">ฟรีสำหรับทุกคน (Open Access)</div>
                            <div className="text-[10px] text-slate-500">ไม่ต้องใส่รหัส เปิดดูและดาวน์โหลดได้ทันที</div>
                          </div>
                        </label>

                        <label
                          onClick={() =>
                            setEditVaultForm({
                              ...editVaultForm,
                              isFree: false,
                              requiredPasscode: editVaultForm.requiredPasscode || getRandomPasscode(),
                            })
                          }
                          className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                            !editVaultForm.isFree
                              ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold ring-1 ring-amber-400'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="radio"
                            name="vaultAccess"
                            checked={!editVaultForm.isFree}
                            onChange={() =>
                              setEditVaultForm({
                                ...editVaultForm,
                                isFree: false,
                                requiredPasscode: editVaultForm.requiredPasscode || getRandomPasscode(),
                              })
                            }
                            className="accent-amber-600"
                          />
                          <div className="text-xs">
                            <div className="font-bold">ต้องใช้รหัสผ่าน (Course Passcode Protected)</div>
                            <div className="text-[10px] text-slate-500">สำหรับผู้สมัครคอร์สเท่านั้น</div>
                          </div>
                        </label>
                      </div>

                      {!editVaultForm.isFree && (
                        <div className="pt-2 border-t border-slate-200 space-y-2 animate-in fade-in duration-150">
                          <label className="block text-slate-700 font-mono font-bold text-[11px]">
                            กำหนดรหัสผ่านคอร์สเรียน (Course Passcode)
                          </label>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <input
                              type="text"
                              value={editVaultForm.requiredPasscode || ''}
                              onChange={(e) =>
                                setEditVaultForm({
                                  ...editVaultForm,
                                  requiredPasscode: e.target.value.toUpperCase(),
                                })
                              }
                              placeholder="เช่น MECH-77"
                              className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-amber-900 font-mono font-bold uppercase tracking-wider outline-hidden focus:border-indigo-500"
                            />
                            <div className="flex gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditVaultForm({
                                    ...editVaultForm,
                                    requiredPasscode: getRandomPasscode(),
                                  })
                                }
                                className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs whitespace-nowrap text-xs"
                              >
                                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                                <span>สุ่มสร้างรหัสอัตโนมัติ</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleCopyPasscode(editVaultForm.requiredPasscode || 'MECH-77')}
                                className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap text-xs"
                              >
                                <Copy className="w-3.5 h-3.5 text-slate-700" />
                                <span>คัดลอกรหัส</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-mono mb-1 font-bold">
                          หมวดหมู่เอกสาร
                        </label>
                        <select
                          value={editVaultForm.category}
                          onChange={(e) =>
                            setEditVaultForm({
                              ...editVaultForm,
                              category: e.target.value as any,
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 font-semibold outline-hidden focus:border-indigo-500"
                        >
                          <option value="ม.4">ม.4</option>
                          <option value="ม.5">ม.5</option>
                          <option value="ม.6">ม.6</option>
                          <option value="สอวน. & TCAS">สอวน. & TCAS</option>
                          <option value="สรุปสูตร">สรุปสูตร</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-slate-700 font-mono mb-1 font-bold">
                          ระดับชั้น (เช่น ม.4 เทอม 1)
                        </label>
                        <input
                          type="text"
                          value={editVaultForm.grade}
                          onChange={(e) => setEditVaultForm({ ...editVaultForm, grade: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono mb-1 font-bold">
                        ลิงก์ไฟล์ PDF (Direct URL หรือ Google Drive)
                      </label>
                      <input
                        type="text"
                        value={editVaultForm.pdfUrl}
                        onChange={(e) => setEditVaultForm({ ...editVaultForm, pdfUrl: e.target.value })}
                        placeholder="https://example.com/physics-exam.pdf"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-indigo-900 font-mono outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    {/* File Upload Section for Vault Document */}
                    <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                      <label className="block text-slate-900 font-bold font-mono text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-indigo-700">
                          <UploadCloud className="w-4 h-4 text-indigo-600" />
                          <span>หรืออัปโหลดไฟล์ PDF จากเครื่องคอมพิวเตอร์ (Direct Base64 Upload)</span>
                        </span>
                        <span className="text-[10px] text-indigo-600 font-normal">บันทึกไฟล์จริง 100%</span>
                      </label>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-indigo-50 border border-dashed border-indigo-300 text-indigo-700 font-bold text-xs transition-all shadow-xs">
                          <Upload className="w-4 h-4 text-indigo-600" />
                          <span>{editVaultForm.fileData ? 'เปลี่ยนไฟล์ PDF ที่เลือก' : 'เลือกไฟล์ PDF จากเครื่อง...'}</span>
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event) => {
                                  const base64Data = event.target?.result as string;
                                  if (base64Data) {
                                    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(1);
                                    setEditVaultForm((prev) => ({
                                      ...prev,
                                      fileData: base64Data,
                                      pdfUrl: base64Data,
                                      pdfFileName: file.name,
                                      fileSize: `${fileSizeMb} MB`,
                                      isCustomUpload: true,
                                      uploadDate: new Date().toLocaleDateString('th-TH'),
                                    }));
                                    showToast(`โหลดไฟล์ "${file.name}" (${fileSizeMb} MB) พร้อมบันทึก`);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {editVaultForm.fileData && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditVaultForm((prev) => ({
                                ...prev,
                                fileData: undefined,
                                isCustomUpload: false,
                              }));
                              showToast('ยกเลิกไฟล์อัปโหลดแล้ว กลับใช้ลิงก์ URL');
                            }}
                            className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs shrink-0 transition-all cursor-pointer"
                          >
                            ลบไฟล์อัปโหลด
                          </button>
                        )}
                      </div>

                      {editVaultForm.isCustomUpload && editVaultForm.pdfFileName && (
                        <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between font-medium">
                          <div className="flex items-center gap-2 truncate">
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="truncate">ไฟล์ที่เลือก: <strong>{editVaultForm.pdfFileName}</strong> ({editVaultForm.fileSize})</span>
                          </div>
                          <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold shrink-0">
                            READY TO SAVE
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-700 font-mono mb-1 font-bold">
                          จำนวนหน้า (Pages)
                        </label>
                        <input
                          type="number"
                          value={editVaultForm.pages}
                          onChange={(e) =>
                            setEditVaultForm({ ...editVaultForm, pages: Number(e.target.value) || 1 })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-hidden focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-mono mb-1 font-bold">
                          ขนาดไฟล์ (e.g. 3.5 MB)
                        </label>
                        <input
                          type="text"
                          value={editVaultForm.fileSize}
                          onChange={(e) => setEditVaultForm({ ...editVaultForm, fileSize: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900 outline-hidden focus:border-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-mono mb-1 font-bold">
                        คำอธิบายเอกสาร
                      </label>
                      <input
                        type="text"
                        value={editVaultForm.description}
                        onChange={(e) =>
                          setEditVaultForm({ ...editVaultForm, description: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-800 outline-hidden focus:border-indigo-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกข้อมูลชุดข้อสอบ</span>
                    </button>
                  </form>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold">รายการเอกสารข้อสอบทั้งหมด ({vaultDocs.length} ชุด)</span>
                      <button
                        onClick={() => {
                          setIsAddingVaultDoc(true);
                          setEditVaultForm({
                            id: '',
                            title: '',
                            category: 'ม.4',
                            grade: 'ม.4 เทอม 1',
                            pages: 15,
                            fileSize: '2.5 MB',
                            pdfUrl: '',
                            pdfFileName: '',
                            isFree: true,
                            requiredPasscode: getRandomPasscode(),
                            description: '',
                          });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>เพิ่มเอกสารใหม่</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {vaultDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-2">
                              <span>{doc.title}</span>
                              <span
                                className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                                  doc.isFree
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                }`}
                              >
                                {doc.isFree ? 'ฟรี' : `เฉพาะคอร์ส (${doc.requiredPasscode || 'PHY-101'})`}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {doc.category} • {doc.pages} หน้า • {doc.pdfFileName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setEditVaultForm(doc);
                                setIsAddingVaultDoc(false);
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                              title="แก้ไขชุดข้อสอบนี้"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeletingItem({
                                  id: doc.id,
                                  title: doc.title,
                                  type: 'pdf',
                                })
                              }
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 cursor-pointer"
                              title="ลบเอกสารนี้"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
