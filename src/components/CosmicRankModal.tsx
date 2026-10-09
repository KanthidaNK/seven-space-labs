import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Shield,
  Award,
  Flame,
  Clock,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Coins,
  ChevronRight,
  Download,
  Calendar,
  Zap,
  Star,
  ExternalLink,
  BookOpen,
  Check,
  Compass,
  FileCheck,
  RefreshCw,
  QrCode,
  Eye,
  Play,
  XCircle,
  Lightbulb,
  CheckCircle2,
  HelpCircle,
  ListChecks,
  User,
  LogOut,
  Info,
  Camera,
  Upload,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ThemeMode, Language, CadetProfile } from '../types';
import { getStoredUserProfile, UserDetailedProfile } from './UserProfileModal';
import {
  fetchCadetDbState,
  sendStudyWatchHeartbeat,
  triggerSeasonTransitionSimulation,
  CadetDbState,
} from '../utils/quotaService';

interface CosmicRankModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
  lang: Language;
  cadet: CadetProfile;
  onUpdateCadet?: (newCadet: CadetProfile) => void;
  onOpenLab3?: () => void;
  isLoggedIn?: boolean;
  onLogin?: (cadet: CadetProfile) => void;
  onLogout?: () => void;
}

// 5 Cosmic Ranks across 100 Levels
interface CosmicRankTier {
  id: string;
  nameEn: string;
  nameTh: string;
  levelRange: string;
  minLv: number;
  maxLv: number;
  badgeColor: string;
  bgGlow: string;
  frameClass: string;
  description: string;
  titles: string[];
}

const COSMIC_RANKS: CosmicRankTier[] = [
  {
    id: 'cadet',
    nameEn: 'Cadet',
    nameTh: 'เด็กฝึกหัด',
    levelRange: 'Lv. 1 - 20',
    minLv: 1,
    maxLv: 20,
    badgeColor: 'text-cyan-600 dark:text-cyan-400 border-cyan-400 bg-cyan-50/70 dark:bg-cyan-950/40',
    bgGlow: 'from-cyan-500/20 to-indigo-500/10',
    frameClass: 'border-2 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
    description: 'เข้าสู่สถานีอวกาศเพื่อปูพื้นฐานกลศาสตร์นิวตัน ดาราศาสตร์พื้นฐาน และการสังเกตการณ์ท้องฟ้า',
    titles: ['ผู้สังเกตการณ์ดาวฤกษ์ (Starlight Observer)', 'เด็กฝึกหัดกลศาสตร์ (Mechanics Cadet)'],
  },
  {
    id: 'explorer',
    nameEn: 'Explorer',
    nameTh: 'นักสำรวจ',
    levelRange: 'Lv. 21 - 40',
    minLv: 21,
    maxLv: 40,
    badgeColor: 'text-emerald-600 dark:text-emerald-400 border-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/40',
    bgGlow: 'from-emerald-500/20 to-teal-500/10',
    frameClass: 'border-2 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]',
    description: 'เชี่ยวชาญการคำนวณวงโคจรเคปเลอร์ ความเร็วหลุดพ้น และแรงโน้มถ่วงระหว่างดวงดาว',
    titles: ['ผู้บุกเบิกวงโคจร (Orbital Pioneer)', 'นักคำนวณเคปเลอร์ (Keplerian Navigator)'],
  },
  {
    id: 'specialist',
    nameEn: 'Specialist',
    nameTh: 'ผู้เชี่ยวชาญ',
    levelRange: 'Lv. 41 - 60',
    minLv: 41,
    maxLv: 60,
    badgeColor: 'text-indigo-600 dark:text-indigo-400 border-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40',
    bgGlow: 'from-indigo-500/20 to-purple-500/10',
    frameClass: 'border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]',
    description: 'ชำนาญทฤษฎีคลื่นแม่เหล็กไฟฟ้า ทัศนศาสตร์ขั้นสูง และการวิเคราะห์สเปกตรัมแสงของดาวฤกษ์',
    titles: ['ผู้เชี่ยวชาญสนามแม่เหล็ก (Magnetic Field Specialist)', 'ปรมาจารย์ทัศนศาสตร์ (Optics Maestro)'],
  },
  {
    id: 'commander',
    nameEn: 'Commander',
    nameTh: 'ผู้บัญชาการ',
    levelRange: 'Lv. 61 - 80',
    minLv: 61,
    maxLv: 80,
    badgeColor: 'text-amber-600 dark:text-amber-400 border-amber-400 bg-amber-50/70 dark:bg-amber-950/40',
    bgGlow: 'from-amber-500/20 to-orange-500/10',
    frameClass: 'border-2 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.5)]',
    description: 'ควบคุมและบริหารการทดลองฟิสิกส์ดาราศาสตร์ขั้นสูง พร้อมโจทย์ระดับค่ายโอลิมปิกวิชาการ (สอวน.)',
    titles: ['ผู้บัญชาการสถานีอวกาศ (Station Commander)', 'ผู้นำฝูงบินควอนตัม (Quantum Fleet Marshal)'],
  },
  {
    id: 'cosmic_overlord',
    nameEn: 'Cosmic Overlord',
    nameTh: 'ระดับตำนาน',
    levelRange: 'Lv. 81 - 100',
    minLv: 81,
    maxLv: 100,
    badgeColor: 'text-fuchsia-600 dark:text-fuchsia-300 border-fuchsia-400 bg-fuchsia-50/70 dark:bg-fuchsia-950/40',
    bgGlow: 'from-fuchsia-500/30 to-purple-600/20',
    frameClass: 'border-2 border-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.7)] ring-2 ring-cyan-400/50',
    description: 'ผู้กุมความลับสูงสุดของจักรวาล ทฤษฎีสัมพัทธภาพ หลุมดำ และพลังงานมืดแห่งเอกภพ',
    titles: ['จักรพรรดิแห่งมิติเวลา (Time-Space Sovereign)', 'ผู้กุมความลับบิกแบง (Primordial Architect)'],
  },
];

// Academic Certification Tiers
type AcademicGradeTier = 'primary' | 'middle' | 'high';

interface AcademicCertConfig {
  tier: AcademicGradeTier;
  labelTh: string;
  certNameEn: string;
  trackEn: string;
  focusTopics: string;
}

const ACADEMIC_CERTS: Record<AcademicGradeTier, AcademicCertConfig> = {
  primary: {
    tier: 'primary',
    labelTh: 'ระดับประถมศึกษา',
    certNameEn: 'Certificate of Excellence in Young Science & Astronomy',
    trackEn: 'Elementary Science & Planetary Astronomy Track',
    focusTopics: 'ระบบสุริยะ, การขึ้นตกของดวงอาทิตย์และดวงจันทร์, แรงโน้มถ่วงเบื้องต้น, การเคลื่อนที่ของวัตถุ',
  },
  middle: {
    tier: 'middle',
    labelTh: 'ระดับมัธยมศึกษาตอนต้น',
    certNameEn: 'Certificate of Academic Distinction in Foundational Physics',
    trackEn: 'Foundational Classical Mechanics & Optics Track',
    focusTopics: 'กลศาสตร์นิวตัน, งานและพลังงาน, สมดุลกล, ความหนาแน่น ความดัน, คลื่นแสงและการหักเห',
  },
  high: {
    tier: 'high',
    labelTh: 'ระดับมัธยมศึกษาตอนปลาย',
    certNameEn: 'Certificate of Advanced Mastery in Astrophysics & Physics Olympiad Track',
    trackEn: 'Astrophysics & Physics Olympiad (POSN) Preparation Track',
    focusTopics: 'กฎของเคปเลอร์, สนามความโน้มถ่วง, ความเร็วหลุดพ้น, ทฤษฎีสัมพัทธภาพพิเศษ, คลื่นแม่เหล็กไฟฟ้าและควอนตัม',
  },
};

// 30 Sample Proctored Questions for the Standard Assessment Exam
interface ExamQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  category: string;
  explanation: string;
  pitfall?: string;
}

const SAMPLE_30_EXAM_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    question: 'ตามกฎข้อที่สองของเคปเลอร์ (Kepler’s Second Law) เมื่อดาวเคราะห์โคจรเข้าใกล้ดวงอาทิตย์ที่สุด (Perihelion) อัตราเร็วของดาวเคราะห์จะเป็นอย่างไร',
    options: ['มีอัตราเร็วสูงสุดในวงโคจร', 'มีอัตราเร็วต่ำสุดในวงโคจร', 'มีอัตราเร็วเป็นศูนย์ชั่วขณะ', 'อัตราเร็วคงตัวเท่ากับทุกจุด'],
    correctIndex: 0,
    category: 'Astrophysics',
    explanation: 'กฎการกวาดพื้นที่เท่ากันในเวลาเท่ากัน (dA/dt = L/2m = คงที่) ทำให้อัตราเร็วเชิงมุมและอัตราเร็วเชิงเส้นที่จุดใกล้สุด (Perihelion) ต้องสูงที่สุด และช้าที่สุดที่จุดไกลสุด (Aphelion)',
    pitfall: 'มักสับสนระหว่างจุด Perihelion (ใกล้สุด-เร็วสุด) กับ Aphelion (ไกลสุด-ช้าสุด)',
  },
  {
    id: 2,
    question: 'วัตถุตกแบบเสรีภายใต้แรงโน้มถ่วงของโลก (g = 9.8 m/s²) เมื่อเวลาผ่านไป 3 วินาที วัตถุจะตกลงมาเป็นระยะทางเท่าใด (ไม่คิดแรงต้านอากาศ)',
    options: ['14.7 เมตร', '29.4 เมตร', '44.1 เมตร', '88.2 เมตร'],
    correctIndex: 2,
    category: 'Mechanics',
    explanation: 'คำนวณจากสมการระยะทาง s = 1/2 g t² = 1/2 × 9.8 × (3)² = 4.9 × 9 = 44.1 เมตร',
    pitfall: 'ระวังสับสนสูตรความเร็ว v = gt = 29.4 m/s หรือลืมยกกำลังสองของเวลา t',
  },
  {
    id: 3,
    question: 'ความเร็วหลุดพ้น (Escape Velocity) จากผิวโลกมีค่าประมาณเท่าใด',
    options: ['7.9 km/s', '11.2 km/s', '16.7 km/s', '42.1 km/s'],
    correctIndex: 1,
    category: 'Astrophysics',
    explanation: 'ความเร็วหลุดพ้นจากผิวโลกคำนวณจาก v_esc = √(2GM/R) มีค่าประมาณ 11.2 กิโลเมตรต่อวินาที',
    pitfall: '7.9 km/s คือความเร็ววงโคจรต่ำรอบโลก (Orbital Speed v = √(GM/R)) ไม่ใช่ความเร็วหลุดพ้น',
  },
  {
    id: 4,
    question: 'กฎข้อที่สามของนิวตัน (Action = -Reaction) กล่าวถึงแรงกิริยาและแรงปฏิกิริยาอย่างไร',
    options: [
      'เกิดขึ้นพร้อมกัน มีขนาดเท่ากัน ทิศทางตรงข้าม และกระทำต่อวัตถุคนละก้อน',
      'เกิดขึ้นตามลำดับ มีขนาดเท่ากัน และกระทำต่อวัตถุก้อนเดียวกัน',
      'หักล้างกันจนเป็นศูนย์เสมอเพราะอยู่บนวัตถุก้อนเดียวกัน',
      'แรงกิริยาเกิดขึ้นก่อนแรงปฏิกิริยาเสมอตามลำดับเหตุการณ์',
    ],
    correctIndex: 0,
    category: 'Mechanics',
    explanation: 'แรงคู่กิริยา-ปฏิกิริยาเกิดขึ้นพร้อมกันเสมอ มีขนาดเท่ากัน ทิศทางตรงข้าม และกระทำบนวัตถุคนละก้อน จึงไม่สามารถนำมาหักล้างกันเองได้',
    pitfall: 'เข้าใจผิดว่าแรงทั้งสองกระทำต่อวัตถุชิ้นเดียวกัน หรือเข้าใจผิดว่า Action เกิดก่อน Reaction',
  },
  {
    id: 5,
    question: 'ปรากฏการณ์โฟโตอิเล็กทริก (Photoelectric Effect) พิสูจน์ว่าแสงมีสมบัติเป็นอย่างไร',
    options: ['เป็นคลื่นตามยาว', 'เป็นอนุภาค (โฟตอน)', 'เป็นสนามไฟฟ้าสถิต', 'ไม่มีโมเมนตัม'],
    correctIndex: 1,
    category: 'Modern Physics',
    explanation: 'การที่อิเล็กตรอนหลุดออกจากผิวโลหะทันทีเมื่อได้รับแสงที่มีความถี่สูงกว่าความถี่ขีดเริ่ม บ่งชี้ว่าแสงถ่ายทอดพลังงานเป็นก้อนโฟตอน (Photon)',
    pitfall: 'ทฤษฎีคลื่นแบบดั้งเดิมทำนายว่าต้องใช้เวลาสะสมพลังงาน ซึ่งขัดกับผลการทดลองจริง',
  },
  {
    id: 6,
    question: 'สมการพลังงานและความเร็วของโฟตอน E = hf เมื่อ f คือความถี่ และ h คืออะไร',
    options: ['ค่าคงตัวของพลังค์ (Planck’s constant)', 'ความเร็วแสง', 'ค่าคงตัวแรงโน้มถ่วง', 'ค่าคงตัวของโบลต์ซมันน์'],
    correctIndex: 0,
    category: 'Modern Physics',
    explanation: 'h คือค่าคงตัวของพลังค์ (Planck’s constant) มีค่าประมาณ 6.626 × 10⁻³⁴ J·s บ่งบอกอัตราส่วนพลังงานต่อความถี่ของควอนตัมแสง',
    pitfall: 'ระวังสับสนกับค่าคงตัวแรงโน้มถ่วง G หรือความเร็วแสง c',
  },
  {
    id: 7,
    question: 'ขอบเขตของหลุมดำที่ไม่สามารถมีข้อมูลหรือแสงใดหลุดรอดออกมาได้ เรียกว่าอะไร',
    options: ['โฟตอนสเฟียร์', 'ขอบฟ้าเหตุการณ์ (Event Horizon)', 'จุดซิงกูลาริตี', 'แอสโทรพาวส์'],
    correctIndex: 1,
    category: 'Astrophysics',
    explanation: 'ขอบฟ้าเหตุการณ์ (Event Horizon) คือพื้นผิวทรงกลมสมมติรอบหลุมดำที่ความเร็วหลุดพ้นเท่ากับความเร็วแสง (v_esc = c)',
    pitfall: 'จุดซิงกูลาริตี (Singularity) คือจุดกึ่งกลางมวลที่ความหนาแน่นเป็นอนันต์ ไม่ใช่ขอบเขตภายนอก',
  },
  {
    id: 8,
    question: 'งาน (Work) ในทางฟิสิกส์มีค่าเป็นศูนย์ในกรณีใด',
    options: [
      'แรงอยู่ในทิศตั้งฉากกับการกระจัด (θ = 90°)',
      'แรงอยู่ในทิศเดียวกับการกระจัด (θ = 0°)',
      'แรงอยู่ในทิศตรงข้ามกับการกระจัด (θ = 180°)',
      'วัตถุเคลื่อนที่ด้วยความเร่งคงตัว',
    ],
    correctIndex: 0,
    category: 'Mechanics',
    explanation: 'จากสมการงาน W = F·s·cos θ เมื่อทิศทางของแรงตั้งฉากกับการกระจัด cos(90°) = 0 งานจึงเป็นศูนย์ เช่น แรงสู่ศูนย์กลาง',
    pitfall: 'คิดว่าเมื่อมีแรงกระทำแล้วต้องเกิดงานเสมอ แม้ว่าทิศของแรงจะตั้งฉากกับการเคลื่อนที่ก็ตาม',
  },
  {
    id: 9,
    question: 'กฎของสเนลล์ (Snell’s Law) อธิบายปรากฏการณ์ใดของคลื่นแสง',
    options: ['การสะท้อน', 'การหักเหของแสงระหว่างตัวกลาง', 'การเลี้ยวเบน', 'โพลาไรเซชัน'],
    correctIndex: 1,
    category: 'Optics',
    explanation: 'กฎของสเนลล์ n₁ sin θ₁ = n₂ sin θ₂ อธิบายความสัมพันธ์ของมุมตกกระทบและมุมหักเหเมื่อคลื่นแสงเคลื่อนที่ผ่านรอยต่อของตัวกลางต่างชนิด',
    pitfall: 'สับสนระหว่างการสะท้อน (θ_i = θ_r) กับการหักเหที่มีดัชนีหักเห n เข้ามาเกี่ยวข้อง',
  },
  {
    id: 10,
    question: 'หน่วยของแรงในระบบ SI คือนิวตัน (N) ซึ่งเทียบเท่ากับหน่วยฐานใด',
    options: ['kg·m/s²', 'kg·m²/s²', 'kg·m/s', 'kg/m·s²'],
    correctIndex: 0,
    category: 'Mechanics',
    explanation: 'จากกฎข้อที่สองของนิวตัน F = ma หน่วยมวลคือ kg และความเร่งคือ m/s² รวมเป็น kg·m/s²',
    pitfall: 'kg·m²/s² คือหน่วยของงานและพลังงาน (จูล / Joule) ไม่ใช่หน่วยของแรง',
  },
  {
    id: 11,
    question: 'ดาวเคราะห์ในระบบสุริยะดวงใดมีมวลมากที่สุดและมีแรงโน้มถ่วงที่ผิวสูงที่สุด',
    options: ['ดาวเสาร์', 'ดาวพฤหัสบดี', 'ดาวเนปจูน', 'โลก'],
    correctIndex: 1,
    category: 'Astronomy',
    explanation: 'ดาวพฤหัสบดี (Jupiter) มีมวลมากกว่าดาวเคราะห์ทุกดวงในระบบสุริยะรวมกัน และมีแรงโน้มถ่วงที่ผิวประมาณ 24.79 m/s² (2.5 เท่าของโลก)',
    pitfall: 'ดาวเสาร์มีขนาดใหญ่อันดับสองแต่มีความหนาแน่นเฉลี่ยต่ำกว่าน้ำ จึงมีแรงโน้มถ่วงที่ผิวน้อยกว่าดาวพฤหัสบดี',
  },
  {
    id: 12,
    question: 'การชนแบบยืดหยุ่นสมบูรณ์ (Elastic Collision) ปริมาณใดต่อไปนี้ได้รับการอนุรักษ์',
    options: ['โมเมนตัมอย่างเดียว', 'พลังงานจลน์อย่างเดียว', 'ทั้งโมเมนตัมและพลังงานจลน์', 'ไม่มีปริมาณใดอนุรักษ์'],
    correctIndex: 2,
    category: 'Mechanics',
    explanation: 'ในการชนแบบยืดหยุ่นสมบูรณ์ ทั้งโมเมนตัมรวม (Σp) และพลังงานจลน์รวม (ΣEk) ของระบบจะคงตัวเท่าเดิมทั้งก่อนและหลังชน',
    pitfall: 'ในการชนแบบไม่ยืดหยุ่น โมเมนตัมจะอนุรักษ์ แต่พลังงานจลน์จะสูญเสียไปเป็นความร้อนหรือเสียง',
  },
  {
    id: 13,
    question: 'ปรากฏการณ์ดอปเปลอร์ (Doppler Effect) ของแสงจากกาแล็กซีที่กำลังเคลื่อนที่ออกห่างจากโลก เรียกว่าอะไร',
    options: ['บลูชิฟต์ (Blueshift)', 'เรดชิฟต์ (Redshift)', 'กรีนชิฟต์ (Greenshift)', 'คอมปตันชิฟต์'],
    correctIndex: 1,
    category: 'Astrophysics',
    explanation: 'เมื่อแหล่งกำเนิดแสงเคลื่อนที่ออกห่าง ความยาวคลื่นแสงจะถูกยืดออกไปทางฝั่งสีแดง เรียกว่า Redshift ซึ่งเป็นหลักฐานการขยายตัวของเอกภพ',
    pitfall: 'Blueshift เกิดขึ้นเมื่อวัตถุเคลื่อนที่เข้าหาผู้สังเกต ทำให้ความยาวคลื่นสั้นลง',
  },
  {
    id: 14,
    question: 'พลังงานจลน์ของวัตถุมวล m เคลื่อนที่ด้วยความเร็ว v คำนวณได้จากสูตรใด',
    options: ['mv', '1/2 mv²', 'mgh', '1/2 mv'],
    correctIndex: 1,
    category: 'Mechanics',
    explanation: 'พลังงานจลน์ (Kinetic Energy) ของวัตถุคือ Ek = 1/2 mv² ซึ่งแปรผันตรงกับมวลและกำลังสองของอัตราเร็ว',
    pitfall: 'mv คือโมเมนตัม (Momentum) ส่วน mgh คือพลังงานศักย์โน้มถ่วง (Potential Energy)',
  },
  {
    id: 15,
    question: 'ความยาวคลื่นเดอบรอยล์ (de Broglie Wavelength) ของอนุภาคที่มีโมเมนตัม p คำนวณได้จากอะไร',
    options: ['λ = h / p', 'λ = h · p', 'λ = p / h', 'λ = hc / p'],
    correctIndex: 0,
    category: 'Quantum',
    explanation: 'หลุยส์ เดอบรอยล์ เสนอสมมติฐานทวิภาวะคลื่น-อนุภาค โดยความยาวคลื่นสสารคำนวณจาก λ = h/p = h/(mv)',
    pitfall: 'สับสนนำความเร็วแสง c เข้ามาคูณปนกับสมการโฟตอน',
  },
  {
    id: 16,
    question: 'ดาวฤกษ์สร้างพลังงานส่วนใหญ่ผ่านปฏิกิริยานิวเคลียร์ชนิดใดที่แกนกลาง',
    options: ['นิวเคลียร์ฟิชชัน', 'นิวเคลียร์ฟิวชันไฮโดรเจนเป็นฮีเลียม', 'การสลายตัวของยูเรเนียม', 'การสันดาปทางเคมี'],
    correctIndex: 1,
    category: 'Astrophysics',
    explanation: 'ดาวฤกษ์ในแถบลำดับหลักหลอมรวมนิวเคลียสของไฮโดรเจนให้กลายเป็นฮีเลียมผ่านปฏิกิริยานิวเคลียร์ฟิวชัน (Proton-Proton Chain หรือ CNO Cycle)',
    pitfall: 'ฟิชชันคือการแตกตัวของธาตุหนัก เช่น ยูเรเนียม ซึ่งใช้ในโรงไฟฟ้านิวเคลียร์บนโลก ไม่ใช่กระบวนการหลักในดาวฤกษ์',
  },
  {
    id: 17,
    question: 'แรงโน้มถ่วงระหว่างมวลสองก้อนจะเปลี่ยนแปลงอย่างไร หากระยะห่างระหว่างมวลเพิ่มขึ้นเป็น 2 เท่า',
    options: ['ลดลงเหลือ 1/2', 'ลดลงเหลือ 1/4', 'เพิ่มขึ้น 2 เท่า', 'เพิ่มขึ้น 4 เท่า'],
    correctIndex: 1,
    category: 'Gravitation',
    explanation: 'ตามกฎแรงโน้มถ่วงสากล F = G·m₁m₂/r² แรงแปรผกผันกับระยะทางยกกำลังสอง เมื่อ r กลายเป็น 2r แรงจะลดลงเหลือ 1/(2)² = 1/4',
    pitfall: 'ตอบ 1/2 เพราะลืมนำระยะทางมายกกำลังสอง (Inverse-Square Law)',
  },
  {
    id: 18,
    question: 'อุณหภูมิที่ศูนย์สัมบูรณ์ (Absolute Zero) มีค่าเท่ากับกี่องศาเซลเซียส',
    options: ['-273.15 °C', '0 °C', '-100 °C', '-459.67 °C'],
    correctIndex: 0,
    category: 'Thermodynamics',
    explanation: 'ศูนย์สัมบูรณ์คือ 0 เคลวิน (0 K) ซึ่งเท่ากับ -273.15 องศาเซลเซียส เป็นสภาวะที่พลังงานจลน์ของโมเลกุลมีค่าน้อยที่สุดตามหลักฟิสิกส์',
    pitfall: 'ตอบ 0 °C ซึ่งเป็นเพียงจุดเยือกแข็งของน้ำ หรือตอบ -459.67 ซึ่งเป็นหน่วยองศาฟาเรนไฮต์',
  },
  {
    id: 19,
    question: 'ตามกฎของฮับเบิล (Hubble’s Law) ความเร็วถอยร่นของกาแล็กซีแปรผันตรงกับสิ่งใด',
    options: ['ระยะห่างของกาแล็กซีจากผู้สังเกต', 'มวลรวมของกาแล็กซี', 'อายุของดาวฤกษ์ในกาแล็กซี', 'จำนวนดาวเคราะห์'],
    correctIndex: 0,
    category: 'Cosmology',
    explanation: 'กฎของฮับเบิล v = H₀·d ระบุว่าความเร็วในการถอยร่นของกาแล็กซี (v) แปรผันตรงกับระยะห่าง (d) ยิ่งอยู่ไกลยิ่งถอยหนีเร็วขึ้น',
    pitfall: 'คิดว่าความเร็วขึ้นอยู่กับมวลหรือขนาดของกาแล็กซี ซึ่งแท้จริงแล้วเกิดจากการขยายตัวของกาลอวกาศเอง',
  },
  {
    id: 20,
    question: 'คลื่นแม่เหล็กไฟฟ้าชนิดใดมีความยาวคลื่นสั้นที่สุดและพลังงานโฟตอนสูงสุด',
    options: ['คลื่นวิทยุ', 'แสงที่มองเห็นได้', 'รังสีเอกซ์', 'รังสีแกมมา'],
    correctIndex: 3,
    category: 'Optics',
    explanation: 'รังสีแกมมา (Gamma rays) มีความถี่สูงสุดและความยาวคลื่นสั้นที่สุดในสเปกตรัมแม่เหล็กไฟฟ้า จึงมีพลังงานโฟตอน E = hf สูงที่สุด',
    pitfall: 'คลื่นวิทยุมีความยาวคลื่นยาวที่สุดแต่มีพลังงานโฟตอนต่ำที่สุด',
  },
  {
    id: 21,
    question: 'โมเมนตัมเชิงมุมของวัตถุหมุนจะคงตัวเมื่อใด',
    options: ['ทอร์กภายนอกลัพธ์เป็นศูนย์ (Στ = 0)', 'แรงลัพธ์ภายนอกเป็นศูนย์', 'ความเร็วเชิงมุมคงตัว', 'ไม่มีแรงเสียดทาน'],
    correctIndex: 0,
    category: 'Mechanics',
    explanation: 'ตามกฎการอนุรักษ์โมเมนตัมเชิงมุม (dL/dt = Στ) โมเมนตัมเชิงมุมรวม L = Iω จะคงตัวเมื่อไม่มีทอร์กภายนอกลัพธ์มากระทำต่อระบบ',
    pitfall: 'สับสนระหว่างแรงลัพธ์ภายนอก (ΣF = 0 สำหรับโมเมนตัมเชิงเส้น) กับทอร์กลัพธ์ (Στ = 0 สำหรับโมเมนตัมเชิงมุม)',
  },
  {
    id: 22,
    question: 'กล้องโทรทรรศน์อวกาศเจมส์เวบบ์ (JWST) ตรวจจับสัญญาณในช่วงคลื่นใดเป็นหลัก',
    options: ['รังสีเอกซ์', 'คลื่นวิทยุ', 'อินฟราเรด (Infrared)', 'รังสีแกมมา'],
    correctIndex: 2,
    category: 'Astronomy',
    explanation: 'JWST ถูกออกแบบมาเพื่อตรวจจับคลื่นอินฟราเรดช่วงใกล้และกลาง (Near & Mid-Infrared) เพื่อทะลุฝุ่นแก๊สและรับแสง Redshift จากกาแล็กซียุคแรกเริ่ม',
    pitfall: 'กล้องฮับเบิล (Hubble) เน้นช่วงแสงที่ตามองเห็นและอัลตราไวโอเลต ส่วน JWST เน้นช่วงอินฟราเรด',
  },
  {
    id: 23,
    question: 'ความเร่งเนื่องจากแรงโน้มถ่วงที่จุดศูนย์กลางของโลกมีค่าเท่าใด',
    options: ['9.8 m/s²', '0 m/s²', '19.6 m/s²', 'อนันต์'],
    correctIndex: 1,
    category: 'Gravitation',
    explanation: 'ที่จุดศูนย์กลางของโลก มวลของโลกที่อยู่รอบทิศทางจะดึงดูดหักล้างกันเองอย่างสมมาตร ทำให้แรงโน้มถ่วงลัพธ์และความเร่ง g กลายเป็น 0 m/s²',
    pitfall: 'เข้าใจผิดว่าแรงโน้มถ่วงจะเพิ่มขึ้นเรื่อยๆ จนเป็นอนันต์ที่จุดศูนย์กลาง',
  },
  {
    id: 24,
    question: 'สมการ E = mc² ของอัลเบิร์ต ไอน์สไตน์ บ่งบอกถึงความสัมพันธ์ระหว่างสิ่งใด',
    options: ['มวลและพลังงาน', 'โมเมนตัมและเวลา', 'แรงโน้มถ่วงและแสง', 'สนามไฟฟ้าและสนามแม่เหล็ก'],
    correctIndex: 0,
    category: 'Relativity',
    explanation: 'สมการนี้แสดงความสมมูลระหว่างมวลและพลังงาน (Mass-Energy Equivalence) มวลสามารถเปลี่ยนเป็นพลังงานและพลังงานสามารถเปลี่ยนเป็นมวลได้',
    pitfall: 'เข้าใจผิดว่าเป็นการเชื่อมโยงโมเมนตัมกับเวลา หรือคิดว่าเป็นสมการแรงโน้มถ่วง',
  },
  {
    id: 25,
    question: 'หน่วยดาราศาสตร์ (AU: Astronomical Unit) นิยามจากสิ่งใด',
    options: [
      'ระยะทางเฉลี่ยระหว่างโลกกับดวงอาทิตย์ (~149.6 ล้านกิโลเมตร)',
      'ระยะทางที่แสงเดินทางใน 1 ปี',
      'เส้นผ่านศูนย์กลางของระบบสุริยะ',
      'ระยะทางจากโลกถึงดวงจันทร์',
    ],
    correctIndex: 0,
    category: 'Astronomy',
    explanation: '1 AU คือระยะห่างเฉลี่ยจากโลกถึงดวงอาทิตย์ หรือประมาณ 149,597,870.7 กิโลเมตร มักใช้บอกระยะทางภายในระบบสุริยะ',
    pitfall: 'ระยะทางที่แสงเดินทางใน 1 ปี คือปีแสง (Light-Year) ซึ่งมีค่าประมาณ 9.46 ล้านล้านกิโลเมตร',
  },
  {
    id: 26,
    question: 'วัตถุเคลื่อนที่แบบวงกลมสม่ำเสมอด้วยอัตราเร็วคงตัว ปริมาณใดต่อไปนี้ไม่เป็นศูนย์',
    options: ['ความเร่งสู่ศูนย์กลาง', 'แรงลัพธ์ในแนวสัมผัส', 'การกระจัดเมื่อครบหนึ่งรอบ', 'งานลัพธ์ที่ทำในหนึ่งรอบ'],
    correctIndex: 0,
    category: 'Mechanics',
    explanation: 'แม้ว่าอัตราเร็วจะคงที่ แต่ทิศทางความเร็วเปลี่ยนแปลงตลอดเวลา จึงเกิดความเร่งสู่ศูนย์กลาง a_c = v²/r เสมอ',
    pitfall: 'คิดว่าเมื่ออัตราเร็วคงตัวแล้วความเร่งต้องเป็นศูนย์ทั้งหมด โดยลืมไปว่าเวกเตอร์ความเร็วเปลี่ยนทิศทางตลอดเวลา',
  },
  {
    id: 27,
    question: 'ดาวนิวตรอนที่มีสนามแม่เหล็กเข้มข้นมหาศาลและหมุนรอบตัวเองอย่างรวดเร็ว ส่งสัญญาณเป็นจังหวะ เรียกว่าอะไร',
    options: ['พัลซาร์ (Pulsar)', 'ควาซาร์ (Quasar)', 'ซูเปอร์โนวา', 'ดาวแคระขาว'],
    correctIndex: 0,
    category: 'Astrophysics',
    explanation: 'พัลซาร์ (Pulsar) คือดาวนิวตรอนที่หมุนรอบตัวเองเร็วมากและแผ่ลำคลื่นแม่เหล็กไฟฟ้าออกจากขั้วแม่เหล็ก กวาดผ่านโลกเป็นคาบสม่ำเสมอ',
    pitfall: 'ควาซาร์ (Quasar) คือแกนกลางของกาแล็กซีที่มีหลุมดำมวลยิ่งยวด ไม่ใช่ดาวนิวตรอนเดี่ยว',
  },
  {
    id: 28,
    question: 'ความดันในของเหลวที่อยู่นิ่งที่ระดับความลึก h คำนวณได้จากสูตรใด',
    options: ['P = ρgh', 'P = mgh', 'P = 1/2 ρv²', 'P = F / A²'],
    correctIndex: 0,
    category: 'Fluids',
    explanation: 'ความดันเกจในของเหลวคำนวณจาก P = ρgh เมื่อ ρ คือความหนาแน่นของของไหล g คือความเร่งโน้มถ่วง และ h คือความลึก',
    pitfall: 'mgh คือพลังงานศักย์โน้มถ่วงของมวล m ไม่ใช่ความดันในของเหลว',
  },
  {
    id: 29,
    question: 'รัศมีชวาร์ซชิลด์ (Schwarzschild Radius) ของหลุมดำคำนวณได้จากสูตรใด',
    options: ['Rs = 2GM / c²', 'Rs = GM / c²', 'Rs = 2GM / c', 'Rs = GM² / c'],
    correctIndex: 0,
    category: 'Astrophysics',
    explanation: 'รัศมีชวาร์ซชิลด์ได้จากการแทน v_esc = c ลงในสมการความเร็วหลุดพ้น ได้สูตรเป็น Rs = 2GM / c²',
    pitfall: 'ลืมตัวคูณ 2 ด้านหน้า หรือลืมยกกำลังสองของความเร็วแสง c',
  },
  {
    id: 30,
    question: 'หลักการทรงมวลและพลังงานในฟิสิกส์สมัยใหม่ นำไปสู่การอนุรักษ์สิ่งใดร่วมกัน',
    options: ['มวล-พลังงาน (Mass-Energy Conservation)', 'ประจุ-โมเมนตัม', 'ความร้อน-อุณหภูมิ', 'แสง-คลื่นเสียง'],
    correctIndex: 0,
    category: 'Modern Physics',
    explanation: 'ในฟิสิกส์เชิงสัมพัทธภาพ มวลสามารถสลายตัวกลายเป็นพลังงานได้ กฎการอนุรักษ์มวลและกฎการอนุรักษ์พลังงานจึงถูกรวมเป็นกฎการอนุรักษ์มวล-พลังงานร่วมกัน',
    pitfall: 'เข้าใจว่ามวลและพลังงานแยกกันอนุรักษ์อย่างเด็ดขาดเหมือนในฟิสิกส์คลาสสิกของนิวตัน',
  },
];

export const CosmicRankModal: React.FC<CosmicRankModalProps> = ({
  isOpen,
  onClose,
  theme,
  lang,
  cadet,
  onUpdateCadet,
  onOpenLab3,
  isLoggedIn = true,
  onLogin,
  onLogout,
}) => {
  const isWhite = theme === 'white';

  // Login Form States (Simulated Login)
  const [loginUsername, setLoginUsername] = useState('Cadet_Nova');
  const [loginPassword, setLoginPassword] = useState('physics123');

  const handleInlineLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cadetName = loginUsername.trim() || 'Cadet_Nova';
    const isCmd = cadetName.toLowerCase().includes('commander');
    const newProfile: CadetProfile = {
      name: cadetName,
      callsign: isCmd ? 'COMMANDER-01' : 'ASTRO-77',
      email: `${cadetName.toLowerCase()}@space.io`,
      level: isCmd ? 10 : 7,
      sector: 'SECTOR 07-A',
      exp: isCmd ? 50000 : 32450,
      maxExp: isCmd ? 60000 : 40000,
      syncRate: 99.8,
      faction: isCmd ? 'Graviton' : 'Photon',
      role: isCmd ? 'Premium' : 'Free',
      isPremium: isCmd,
      unlockedCourses: isCmd ? ['ALL'] : ['PHY-701'],
      cosmicCoins: isCmd ? 5000 : 1000,
      cosmicEnergy: isCmd ? 300 : 150,
      loginStreak: isCmd ? 14 : 3,
    };
    if (onLogin) {
      onLogin(newProfile);
    }
  };

  // Modal active tabs: 'rank' or 'cert'
  const [activeTab, setActiveTab] = useState<'rank' | 'cert'>('rank');

  // --------------------------------------------------------------------------
  // Tab 1: Rank & Season States (Synchronized with Database State)
  // --------------------------------------------------------------------------
  const [selectedRankTier, setSelectedRankTier] = useState<CosmicRankTier>(COSMIC_RANKS[0]);
  const [expandedRankDetailId, setExpandedRankDetailId] = useState<string | null>(null);
  const [cosmicCoins, setCosmicCoins] = useState<number>(() => {
    return cadet.cosmicCoins ?? Number(localStorage.getItem('ssl_cosmic_coins') || 1000);
  });
  const [cosmicEnergy, setCosmicEnergy] = useState<number>(() => {
    return cadet.cosmicEnergy ?? Number(localStorage.getItem('ssl_cosmic_energy') || 150);
  });
  const [checkinStreak, setCheckinStreak] = useState<number>(() => {
    return cadet.loginStreak ?? Number(localStorage.getItem('ssl_login_streak') || 3);
  });
  const [lastCheckinDate, setLastCheckinDate] = useState<string>(() => {
    return cadet.lastCheckinDate || localStorage.getItem('ssl_last_checkin_date') || '';
  });
  const [famePoints, setFamePoints] = useState<number>(840);
  const [seasonBadges, setSeasonBadges] = useState<string[]>([]);
  const [currentSeasonName, setCurrentSeasonName] = useState<string>('COSMIC SEASON 1');
  const [seasonTransitionFeedback, setSeasonTransitionFeedback] = useState<string>('');
  const [exchangeFeedback, setExchangeFeedback] = useState<string>('');
  const [serverTimeDisplay, setServerTimeDisplay] = useState<string>('กำลังเชื่อมต่อ Server...');

  const todayStr = new Date().toISOString().slice(0, 10);
  const isCheckedInToday = lastCheckinDate === todayStr;

  const handleDailyCheckin = () => {
    if (isCheckedInToday) return;

    const newStreak = checkinStreak + 1;
    const isSevenDayBonus = newStreak % 7 === 0;
    const energyAward = isSevenDayBonus ? 60 : 10;
    const newEnergy = cosmicEnergy + energyAward;

    setCheckinStreak(newStreak);
    setLastCheckinDate(todayStr);
    setCosmicEnergy(newEnergy);

    try {
      localStorage.setItem('ssl_login_streak', String(newStreak));
      localStorage.setItem('ssl_last_checkin_date', todayStr);
      localStorage.setItem('ssl_cosmic_energy', String(newEnergy));

      const savedCadet = localStorage.getItem('cadet_profile');
      if (savedCadet) {
        const parsed = JSON.parse(savedCadet);
        parsed.cosmicEnergy = newEnergy;
        parsed.loginStreak = newStreak;
        parsed.lastCheckinDate = todayStr;
        localStorage.setItem('cadet_profile', JSON.stringify(parsed));
        if (onUpdateCadet) onUpdateCadet(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    window.dispatchEvent(new CustomEvent('ssl_cadet_energy_updated', { detail: { cosmicEnergy: newEnergy } }));
    setExchangeFeedback(
      isSevenDayBonus
        ? `เช็คอินรายวันสำเร็จ! รับโบนัสเช็คอินครบ 7 วัน (+50 Energy) รวมเป็น +60 Energy (Streak: ${newStreak} วัน)`
        : `เช็คอินรายวันสำเร็จ! รับ +10 Energy (Streak: ${newStreak} วัน)`
    );
    setTimeout(() => setExchangeFeedback(''), 5000);
  };

  const handleConvertEnergyToCoins = () => {
    if (cosmicEnergy < 50) {
      setExchangeFeedback(
        `พลังงานไม่เพียงพอ (ต้องการ 50 Energy, ปัจจุบันมี ${cosmicEnergy} Energy) สามารถสะสมพลังงานได้จากการเช็คอินประจำวัน (+10) หรือเล่นแบบประลอง LAB 2 จบชุด (+5)`
      );
      setTimeout(() => setExchangeFeedback(''), 5000);
      return;
    }

    const newEnergy = cosmicEnergy - 50;
    const newCoins = cosmicCoins + 10;

    setCosmicEnergy(newEnergy);
    setCosmicCoins(newCoins);

    try {
      localStorage.setItem('ssl_cosmic_energy', String(newEnergy));
      localStorage.setItem('ssl_cosmic_coins', String(newCoins));

      const savedCadet = localStorage.getItem('cadet_profile');
      if (savedCadet) {
        const parsed = JSON.parse(savedCadet);
        parsed.cosmicEnergy = newEnergy;
        parsed.cosmicCoins = newCoins;
        localStorage.setItem('cadet_profile', JSON.stringify(parsed));
        if (onUpdateCadet) onUpdateCadet(parsed);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    window.dispatchEvent(new CustomEvent('ssl_cadet_energy_updated', { detail: { cosmicEnergy: newEnergy } }));
    window.dispatchEvent(new CustomEvent('ssl_cadet_coins_updated', { detail: { cosmicCoins: newCoins } }));

    setExchangeFeedback(`แลกเปลี่ยนพลังงานสำเร็จ! หัก 50 พลังงาน -> ได้รับ +10 Cosmic Coins (คงเหลือ: ${newCoins} Coins)`);
    setTimeout(() => setExchangeFeedback(''), 5000);
  };

  // --------------------------------------------------------------------------
  // Tab 2: 3-Gate Verification & Anti-Cheat Heartbeat States
  // --------------------------------------------------------------------------
  const [userProfile, setUserProfile] = useState<UserDetailedProfile>(() => getStoredUserProfile(cadet));
  const [showRankAvatarPicker, setShowRankAvatarPicker] = useState(false);
  const rankFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUserProfile(getStoredUserProfile(cadet));
    }
    const handleProfileUpdate = (e: any) => {
      if (e.detail) {
        setUserProfile(e.detail);
      }
    };
    window.addEventListener('ssl_user_profile_updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('ssl_user_profile_updated', handleProfileUpdate);
    };
  }, [isOpen, cadet]);

  const handleRankAvatarSelect = (type: 'preset_g' | 'preset_panda' | 'preset_astro') => {
    const updated = { ...userProfile, avatarType: type, avatarCustomUrl: undefined };
    setUserProfile(updated);
    try {
      localStorage.setItem('ssl_user_detailed_profile_v2', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('ssl_user_profile_updated', { detail: updated }));
    } catch (e) {}
    setShowRankAvatarPicker(false);
  };

  const handleRankFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const customUrl = event.target?.result as string;
        const updated = { ...userProfile, avatarType: 'custom' as const, avatarCustomUrl: customUrl };
        setUserProfile(updated);
        try {
          localStorage.setItem('ssl_user_detailed_profile_v2', JSON.stringify(updated));
          window.dispatchEvent(new CustomEvent('ssl_user_profile_updated', { detail: updated }));
        } catch (err) {}
        setShowRankAvatarPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderRankAvatar = () => {
    if (userProfile.avatarType === 'custom' && userProfile.avatarCustomUrl) {
      return <img src={userProfile.avatarCustomUrl} alt="Avatar" className="w-full h-full object-cover" />;
    }
    if (userProfile.avatarType === 'preset_panda') {
      return <span className="text-2xl select-none">🐼</span>;
    }
    if (userProfile.avatarType === 'preset_g') {
      return <span className="font-mono font-bold text-xl text-white select-none">G</span>;
    }
    return <span className="text-2xl select-none">👨‍🚀</span>;
  };

  const studentName = userProfile.realNameThai || userProfile.displayName || cadet.name || 'กิตติภพ ดารารัตน์';
  const studentEnglishName = userProfile.realNameEnglish || 'Kittiphop Dararat';
  const [selectedGrade, setSelectedGrade] = useState<AcademicGradeTier>('high');

  // Gate 1: 30-Day Streak (with 2 freezes available, backed by Server Time)
  const [streakDays, setStreakDays] = useState<number>(30);
  const [streakFreezesLeft, setStreakFreezesLeft] = useState<number>(2);

  // Gate 2: Coursework Hours & Anti-Cheat Watch Heartbeat (Capped at 2 hrs/day)
  const [courseworkHours, setCourseworkHours] = useState<number>(20);
  const [todayWatchSeconds, setTodayWatchSeconds] = useState<number>(3600); // 1.0 hr today
  const [todayWatchCapReached, setTodayWatchCapReached] = useState<boolean>(false);
  const [isSendingHeartbeat, setIsSendingHeartbeat] = useState<boolean>(false);
  const [heartbeatFeedback, setHeartbeatFeedback] = useState<string>('');

  // Gate 3: Exam Proctored Room States
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>(() => {
    // Default pre-evaluated answers (27 correct, 3 wrong: Q2, Q8, Q17)
    const defaults: Record<number, number> = {};
    SAMPLE_30_EXAM_QUESTIONS.forEach((q) => {
      if (q.id === 2) {
        defaults[q.id] = 1; // Wrong answer (Option B: 29.4 m instead of 44.1 m)
      } else if (q.id === 8) {
        defaults[q.id] = 1; // Wrong answer (Option B instead of Option A)
      } else if (q.id === 17) {
        defaults[q.id] = 0; // Wrong answer (Option A: 1/2 instead of 1/4)
      } else {
        defaults[q.id] = q.correctIndex; // Correct answer
      }
    });
    return defaults;
  });
  const [examSubmitted, setExamSubmitted] = useState<boolean>(true); // Pre-evaluated so users can review immediately
  const [examScore, setExamScore] = useState<number>(27); // 27/30 = 90% (Passed by default if pre-evaluated)
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(2400); // 40 minutes (2,400 seconds)
  const [cooldownHoursLeft, setCooldownHoursLeft] = useState<number>(0);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<'all' | 'correct' | 'wrong'>('all');

  // PDF Certificate Export states (Mobile Memory Optimized)
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfGenerationStatus, setPdfGenerationStatus] = useState<string>('');
  const certContainerRef = useRef<HTMLDivElement | null>(null);

  // Initial Sync with Central Database Authority on Modal Open
  useEffect(() => {
    const syncWithDatabase = async () => {
      const result = await fetchCadetDbState();
      if (result) {
        setServerTimeDisplay(new Date(result.serverTime).toLocaleString('th-TH'));
        setStreakDays(result.state.current_streak);
        setStreakFreezesLeft(result.state.streak_freeze_left);
        setCourseworkHours(Math.round(result.state.cumulative_watch_seconds / 3600));
        setTodayWatchSeconds(result.state.today_watch_seconds);
        setTodayWatchCapReached(result.state.today_watch_seconds >= 7200);
        setCosmicCoins(result.state.cosmic_coins);
        setFamePoints(result.state.fame_points);
        setSeasonBadges(result.state.season_badges || []);
        setCurrentSeasonName(result.state.current_season);
      }
    };

    if (isOpen) {
      syncWithDatabase();
    }

    const handleCadetStateUpdate = (e: any) => {
      if (e.detail) {
        const s = e.detail;
        setCosmicCoins(s.cosmic_coins);
        setFamePoints(s.fame_points);
        setCourseworkHours(Math.round(s.cumulative_watch_seconds / 3600));
        setTodayWatchSeconds(s.today_watch_seconds);
        setTodayWatchCapReached(s.today_watch_seconds >= 7200);
        setStreakDays(s.current_streak);
        setCurrentSeasonName(s.current_season);
        setSeasonBadges(s.season_badges || []);
      }
    };

    window.addEventListener('ssl_cadet_state_updated', handleCadetStateUpdate);
    return () => {
      window.removeEventListener('ssl_cadet_state_updated', handleCadetStateUpdate);
    };
  }, [isOpen]);

  // Determine gate states
  const isGate1Passed = streakDays >= 30;
  const isGate2Passed = courseworkHours >= 20;
  const isGate3Unlocked = isGate1Passed && isGate2Passed;
  const isCertified = examSubmitted && examScore >= 24; // 80% passing

  // Exam timer countdown
  useEffect(() => {
    let timer: any = null;
    if (isExamActive && !examSubmitted && examSecondsLeft > 0) {
      timer = setInterval(() => {
        setExamSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleAutoSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExamActive, examSubmitted, examSecondsLeft]);

  if (!isOpen) return null;

  // Handle Exam submission
  const handleAutoSubmitExam = () => {
    let score = 0;
    SAMPLE_30_EXAM_QUESTIONS.forEach((q) => {
      if (examAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
    setIsExamActive(false);
    setIsReviewModalOpen(true); // Open detailed solutions review modal automatically

    if (score < 24) {
      setCooldownHoursLeft(24);
    }
  };

  const handleStartExam = () => {
    if (!isGate3Unlocked) return;
    setIsExamActive(true);
    setExamSubmitted(false);
    setExamSecondsLeft(2400); // 40 minutes (2,400 seconds)
    setExamAnswers({});
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setExamAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  // Anti-Cheat Watch Heartbeat trigger (adds 30 seconds with 2 hrs/day max cap enforcement)
  const handleSendHeartbeat = async () => {
    setIsSendingHeartbeat(true);
    setHeartbeatFeedback('📡 ส่ง Heartbeat บันทึกเวลาเรียนกับ Server Authority...');
    const result = await sendStudyWatchHeartbeat(30);
    setIsSendingHeartbeat(false);

    setTodayWatchSeconds(result.todayWatchSeconds);
    setCourseworkHours(Math.round(result.cumulativeHours));
    setTodayWatchCapReached(result.dailyCapReached);

    if (result.dailyCapReached) {
      setHeartbeatFeedback('⚠️ คุณได้สะสมเวลาเรียนครบโควตาสูงสุด 2 ชั่วโมงของวันนี้แล้ว (ระบบจำกัดเพื่อสุขอนามัยและป้องกันบอท)');
    } else {
      setHeartbeatFeedback(`✓ บันทึกเวลาเรียนจริงสำเร็จ +${result.addedSeconds} วินาที (วันนี้สะสมแล้ว ${result.todayWatchHours}/2.0 ชม.)`);
    }
    setTimeout(() => setHeartbeatFeedback(''), 4500);
  };

  // Deterministic Season Transition Simulation (Soft reset + Coin Burn + Limited Badge)
  const handleTriggerSeasonTransition = async () => {
    setSeasonTransitionFeedback('กำลังประมวลผล Deterministic Season Transition...');
    const data = await triggerSeasonTransitionSimulation();
    if (data && data.details) {
      setSeasonTransitionFeedback(`✨ ข้ามซีซันสู่ ${data.details.new_season} สำเร็จ! ปรับระดับเป็น Lv.${data.details.new_level}, แปลงเหรียญเป็น ${data.details.fame_points_awarded} Fame Points, และรับตรา '${data.details.awarded_badge}'`);
      setCurrentSeasonName(data.details.new_season);
      setCosmicCoins(0);
      setFamePoints(data.details.total_fame_points);
      setSeasonBadges((prev) => [...new Set([...prev, data.details.awarded_badge])]);
    }
    setTimeout(() => setSeasonTransitionFeedback(''), 6000);
  };

  // 100% Guaranteed Robust PDF Certificate Generator (jsPDF + html2canvas + Fallback Print)
  const handleDownloadCertificate = async () => {
    setIsGeneratingPdf(true);
    setPdfGenerationStatus('กำลังเตรียมบันทึกไฟล์เกียรติบัตร PDF...');

    const element: HTMLElement | null =
      document.getElementById('certificate-render-card') ||
      document.getElementById('certificate-render-node') ||
      (certContainerRef.current as HTMLElement | null);

    if (!element) {
      console.error('ไม่พบคอนเทนเนอร์ใบประกาศเกียรติบัตร id="certificate-render-card"');
      alert('ไม่พบเอกสารเกียรติบัตรในระบบ');
      setIsGeneratingPdf(false);
      setPdfGenerationStatus('');
      return;
    }

    try {
      setPdfGenerationStatus('กำลังแปลงภาพกราฟิกความคมชัดสูง (Scale 2 HD)...');

      // Render high-resolution rasterization using html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 1200,
      });

      setPdfGenerationStatus('กำลังสร้างเอกสาร PDF (SevenSpace-Certificate.pdf)...');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      // Create A4 Landscape PDF (297mm x 210mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);

      // Save PDF directly to local machine
      pdf.save('SevenSpace-Certificate.pdf');

      // Blob link trigger as backup for iframe compatibility
      try {
        const pdfBlob = pdf.output('blob');
        const blobUrl = URL.createObjectURL(pdfBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = 'SevenSpace-Certificate.pdf';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        setTimeout(() => {
          if (downloadLink.parentNode) {
            document.body.removeChild(downloadLink);
          }
          URL.revokeObjectURL(blobUrl);
        }, 5000);
      } catch (e) {
        // Handled by direct pdf.save
      }

      // Free canvas memory
      canvas.width = 0;
      canvas.height = 0;

      setPdfGenerationStatus('✓ บันทึกไฟล์ SevenSpace-Certificate.pdf ลงเครื่องสำเร็จเรียบร้อย');
      setTimeout(() => {
        setIsGeneratingPdf(false);
        setPdfGenerationStatus('');
      }, 2500);
    } catch (err) {
      console.error('Failed to export certificate via html2canvas/jsPDF, attempting fallback print window:', err);

      try {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>Certificate - Seven Space Labs</title>
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                  @page { size: landscape; margin: 0; }
                  body { margin: 0; display: flex; align-items: center; justify-content: center; min-height: 100vh; background: #ffffff; }
                </style>
              </head>
              <body>
                <div style="width: 100%; max-width: 900px; padding: 20px;">
                  ${element.outerHTML}
                </div>
                <script>
                  window.onload = () => {
                    setTimeout(() => {
                      window.print();
                      window.close();
                    }, 400);
                  };
                </script>
              </body>
            </html>
          `);
          printWindow.document.close();
        }
      } catch (printErr) {
        console.error('Print window error:', printErr);
      }

      setIsGeneratingPdf(false);
      setPdfGenerationStatus('');
    }
  };

  const currentCertConfig = ACADEMIC_CERTS[selectedGrade];
  const certId = `SSL-2026-SH-${selectedGrade.toUpperCase()}-9921`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-5xl rounded-3xl shadow-2xl border flex flex-col my-auto max-h-[92vh] overflow-hidden transition-all duration-300 bg-[#09090b]/95 border-white/10 text-white shadow-black/80 backdrop-blur-2xl"
      >
        {/* ========================================================= */}
        {/* Top Header & Tab Navigation */}
        {/* ========================================================= */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-lg shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-[0.2em] text-zinc-400 uppercase">
                  ORBITAL PROTOCOL // TIER 1-100
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-zinc-200 border border-white/15">
                  SEASON 1
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                Cosmic Rank 1-100 & Academic Certification Hub
              </h2>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl border border-white/15 hover:bg-white/10 text-zinc-300 transition-all cursor-pointer"
              title="ปิดหน้าต่าง (Close)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 pb-0 border-b border-white/10 flex items-center gap-2 overflow-x-auto shrink-0 bg-black/40">
          <button
            onClick={() => setActiveTab('rank')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'rank'
                ? 'border-white text-white bg-white/10 border-x border-t border-white/20'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>แท็บที่ 1: ระบบแรงก์และซีซัน (Rank & Orbit Season)</span>
          </button>

          <button
            onClick={() => setActiveTab('cert')}
            className={`flex items-center gap-2 pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap rounded-t-xl ${
              activeTab === 'cert'
                ? 'border-white text-white bg-white/10 border-x border-t border-white/20'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Award className="w-4 h-4 text-cyan-300" />
            <span>แท็บที่ 2: เกียรติบัตรวิชาการ (Mastery Certification Hub)</span>
            {isCertified && (
              <span className="w-2 h-2 rounded-full bg-cyan-300 animate-ping ml-1" />
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* Main Content Area (Scrollable) */}
        {/* ========================================================= */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          {!isLoggedIn ? (
            <div className="p-6 sm:p-10 rounded-3xl bg-[#090D1C] border-2 border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center max-w-md mx-auto my-6 animate-fadeIn">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-center justify-center mx-auto mb-4">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <User className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
                AUTHENTICATION REQUIRED // GUEST
              </div>
              <h3 className="text-2xl font-black text-white mb-2 font-kanit">
                เข้าสู่ระบบจำลอง (CADET LOGIN)
              </h3>
              <p className="text-xs text-slate-400 mb-6 font-kanit">
                กรอก Username และ Password เพื่อจำลองการเข้าสู่ระบบสถานีอวกาศ และเปิดใช้งานโปรไฟล์เต็มรูปแบบ
              </p>

              <form onSubmit={handleInlineLogin} className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">USERNAME / CALLSIGN</label>
                  <input
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition"
                    placeholder="Cadet_Nova"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">PASSWORD (รหัสผ่านจำลอง)</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black/80 border border-white/20 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-cyan-400 transition"
                    placeholder="physics123"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-black font-black text-sm tracking-wider uppercase rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 font-kanit"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  <span>ENTER LABS (LOGIN)</span>
                </button>

                <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-slate-500 font-mono">
                  <span>Quick Demo:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('Cadet_Nova');
                      setLoginPassword('physics123');
                    }}
                    className="text-cyan-400 hover:underline cursor-pointer"
                  >
                    [Cadet_Nova Lv.7]
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername('Commander_Astro');
                      setLoginPassword('physics123');
                    }}
                    className="text-amber-400 hover:underline cursor-pointer"
                  >
                    [Commander Lv.10]
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* ======================================================= */}
              {/* TAB 1: ระบบแรงก์และซีซัน (Rank & Orbit Season) */}
              {/* ======================================================= */}
              {activeTab === 'rank' && (
                <div className="space-y-6">
                  {/* 1. Player Profile HUD Bar */}
                  <div
                    className={`p-5 rounded-2xl border transition-all ${
                      isWhite ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-900/60 border-indigo-900/40'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row items-center justify-between gap-5">
                      {/* Left: Avatar with Clickable Customizer */}
                      <div className="flex items-center gap-4 w-full md:w-auto relative">
                        <div className="relative group">
                          <button
                            type="button"
                            onClick={() => setShowRankAvatarPicker((prev) => !prev)}
                            className="w-18 h-18 rounded-2xl border border-white/20 bg-neutral-900 flex items-center justify-center overflow-hidden relative cursor-pointer group-hover:border-white/50 transition-all shadow-inner"
                            title="คลิกเพื่อเปลี่ยนรูปโปรไฟล์"
                          >
                            {renderRankAvatar()}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Camera className="w-5 h-5 text-white" />
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setShowRankAvatarPicker((prev) => !prev)}
                            className="absolute -bottom-1 -right-1 p-1 rounded-full bg-neutral-800 border border-white/20 text-white hover:bg-neutral-700 transition cursor-pointer shadow"
                            title="เปลี่ยนอวาตาร์"
                          >
                            <Camera className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick Avatar Picker Dropdown */}
                        {showRankAvatarPicker && (
                          <div className="absolute top-20 left-0 p-3 bg-[#09090b] border border-white/15 rounded-xl flex items-center gap-2.5 z-50 shadow-2xl animate-in fade-in">
                            <button
                              type="button"
                              onClick={() => handleRankAvatarSelect('preset_astro')}
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-black/50 hover:border-white text-base cursor-pointer"
                              title="นักบินอวกาศ"
                            >
                              👨‍🚀
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRankAvatarSelect('preset_panda')}
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-black/50 hover:border-white text-base cursor-pointer"
                              title="แพนด้า"
                            >
                              🐼
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRankAvatarSelect('preset_g')}
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-black/50 hover:border-white text-xs font-mono font-bold text-white cursor-pointer"
                              title="ตัวอักษร G"
                            >
                              G
                            </button>
                            <button
                              type="button"
                              onClick={() => rankFileInputRef.current?.click()}
                              className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-black/50 hover:border-white text-zinc-300 hover:text-white transition cursor-pointer"
                              title="อัปโหลดภาพ"
                            >
                              <Upload className="w-3.5 h-3.5" />
                            </button>
                            <input
                              ref={rankFileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handleRankFileUpload}
                              className="hidden"
                            />
                          </div>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-black text-white">{userProfile.displayName || cadet.name}</h3>
                            <span className="text-xs font-mono font-bold text-zinc-300 px-2 py-0.5 rounded-md bg-white/10 border border-white/15">
                              {cadet.callsign}
                            </span>
                          </div>
                          <div className="text-xs font-semibold text-zinc-400 flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-white font-bold">
                              {userProfile.gradeLevel || 'มัธยมศึกษาปีที่ 6 (ม.6)'}
                            </span>
                            <span>•</span>
                            <span className="text-zinc-300 font-medium">
                              {userProfile.school || 'โรงเรียนเตรียมอุดมศึกษา'}
                            </span>
                          </div>
                          <div className="text-xs text-zinc-400 mt-1 font-mono">
                            ยศปัจจุบัน: <strong className="text-white">LEVEL {cadet.level}</strong> // {cadet.sector || 'SECTOR 07-A'}
                          </div>
                        </div>
                      </div>

                      {/* Middle: EXP Progress Bar */}
                      <div className="w-full md:w-72 flex flex-col justify-center">
                        <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                          <span className="text-zinc-400">ความก้าวหน้า EXP</span>
                          <span className="font-bold text-white">
                            {cadet.exp.toLocaleString()} / {cadet.maxExp.toLocaleString()} EXP (72%)
                          </span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-zinc-700 overflow-hidden relative">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-zinc-400 to-white transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.round((cadet.exp / cadet.maxExp) * 100))}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-zinc-400 text-right mt-1 font-mono">
                          ต้องการอีก {(cadet.maxExp - cadet.exp).toLocaleString()} EXP สู่ Lv. {cadet.level + 1}
                        </div>
                      </div>

                      {/* Right: Currency, Honor Wallet & Logout Button */}
                      <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
                        {/* Cosmic Coins */}
                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          <Coins className="w-4 h-4 text-amber-400" />
                          <div>
                            <div className="text-[10px] uppercase font-mono font-bold leading-none text-white/80">COSMIC COINS</div>
                            <div className="text-sm font-black font-mono leading-tight text-white">{cosmicCoins.toLocaleString()} Coins</div>
                          </div>
                        </div>

                        {/* Activity Energy */}
                        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                          <Zap className="w-4 h-4 text-cyan-400" />
                          <div>
                            <div className="text-[10px] uppercase font-mono font-bold leading-none text-white/80">DAILY ENERGY</div>
                            <div className="text-sm font-black font-mono leading-tight text-white">{cosmicEnergy.toLocaleString()} ⚡</div>
                          </div>
                        </div>

                        {/* Logout Button */}
                        {onLogout && (
                          <button
                            type="button"
                            onClick={() => {
                              onLogout();
                              onClose();
                            }}
                            title="ออกจากระบบ (LOGOUT)"
                            className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/60 text-red-300 text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>LOGOUT</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

              {/* 1.5 Energy Converter & Daily Check-in Hub Card */}
              <div
                className="p-5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all hover:border-cyan-500/30"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-base font-bold text-white">ตู้แปลงพลังงานเป็น Cosmic Coins (Gamified Energy Exchange)</h3>
                    </div>
                    <p className="text-xs text-white/80 mt-1">
                      สะสมพลังงานกิจกรรมจากการเช็คอินประจำวัน (+10 Energy) หรือเล่นแบบประลอง LAB 2 จบชุด (+5 Energy) เพื่อนำมาแลกเป็น Cosmic Coins
                    </p>
                  </div>

                  {/* Daily Checkin Button */}
                  <button
                    type="button"
                    onClick={handleDailyCheckin}
                    disabled={isCheckedInToday}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isCheckedInToday
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 cursor-default backdrop-blur-md'
                        : 'bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.08)] active:scale-98'
                    }`}
                  >
                    {isCheckedInToday ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>เช็คอินวันนี้เรียบร้อย (Streak: {checkinStreak} วัน)</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                        <span>เช็คอินรายวันรับ +10 Energy (Streak: {checkinStreak} วัน)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Energy Exchange Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 items-center">
                  <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-cyan-300 shrink-0">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/80 uppercase font-bold">พลังงานกิจกรรม (ENERGY)</div>
                      <div className="text-base font-black font-mono text-white">{cosmicEnergy} ⚡</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-white/80 uppercase font-bold">ยอดเหรียญ (COSMIC COINS)</div>
                      <div className="text-base font-black font-mono text-white">{cosmicCoins.toLocaleString()} Coins</div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={handleConvertEnergyToCoins}
                      className="w-full py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-white font-bold text-xs backdrop-blur-md transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] cursor-pointer flex items-center justify-center gap-2 active:scale-98"
                    >
                      <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                      <span>แลกพลังงานเป็น Cosmic Coins (50 ⚡ → 10 Coins)</span>
                    </button>
                  </div>
                </div>

                {exchangeFeedback && (
                  <div className="mt-3 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-2 font-semibold animate-in fade-in duration-150">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span>{exchangeFeedback}</span>
                  </div>
                )}
              </div>

              {/* 2. โครงสร้าง 100 เลเวล และ 5 ยศอวกาศ */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black flex items-center gap-2 text-white">
                      <Shield className="w-4 h-4 text-cyan-400" />
                      <span>โครงสร้าง 100 เลเวล และ 5 ยศอวกาศ (The 5 Cosmic Tiers)</span>
                    </h3>
                    <p className="text-xs text-white/80">
                      ทุก ๆ 20 เลเวลจะเลื่อนขั้นสู่ยศใหม่ พร้อมปลดล็อกกรอบโปรไฟล์นีออนและฉายาเกียรติยศ
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {COSMIC_RANKS.map((tier) => {
                    const isCurrent = cadet.level >= tier.minLv && cadet.level <= tier.maxLv;
                    const isUnlocked = cadet.level >= tier.minLv;
                    const isSelected = selectedRankTier.id === tier.id;
                    const isExpanded = expandedRankDetailId === tier.id;

                    return (
                      <div
                        key={tier.id}
                        onClick={() => setSelectedRankTier(tier)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between backdrop-blur-xl ${
                          isSelected
                            ? 'border-cyan-400/80 bg-white/10 ring-2 ring-cyan-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_0_20px_rgba(6,182,212,0.2)]'
                            : 'bg-white/[0.04] border-white/15 hover:border-white/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                        }`}
                      >
                        <div>
                          {/* แถวบน: ป้ายช่วงเลเวล & ไอคอนสถานะ/ล็อก */}
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${tier.badgeColor}`}
                            >
                              {tier.levelRange}
                            </span>
                            {isCurrent ? (
                              <span className="text-[9.5px] font-bold text-cyan-300 bg-cyan-950/80 border border-cyan-400/40 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                <span>ยศปัจจุบัน</span>
                              </span>
                            ) : isUnlocked ? (
                              <span className="text-[9.5px] font-bold text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>ปลดล็อก</span>
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-medium text-white/60 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>ล็อก</span>
                              </span>
                            )}
                          </div>

                          {/* ชื่อยศภาษาอังกฤษและไทยตัวหนา */}
                          <div className="mt-1">
                            <h4 className="text-sm sm:text-base font-black tracking-tight text-white">
                              {tier.nameEn}
                            </h4>
                            <div className="text-xs font-bold text-cyan-300 mt-0.5">
                              {tier.nameTh}
                            </div>
                          </div>
                        </div>

                        {/* ปุ่มดูรายละเอียด / วิธีไต่ระดับ */}
                        <div className="pt-2.5 mt-3 border-t border-white/10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRankTier(tier);
                              setExpandedRankDetailId(isExpanded ? null : tier.id);
                            }}
                            className={`text-[11px] font-bold flex items-center justify-between w-full transition-colors cursor-pointer ${
                              isExpanded
                                ? 'text-amber-300'
                                : 'text-cyan-300 hover:text-white'
                            }`}
                          >
                            <span>
                              {isExpanded ? 'ย่อรายละเอียด ▴' : 'อ่านวิธีไต่ระดับ >'}
                            </span>
                            <ChevronRight
                              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                isExpanded ? '-rotate-90 text-amber-300' : ''
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Accordion: รายละเอียดสิทธิประโยชน์ & วิธีไต่ระดับ (เปิดเมื่อกดปุ่ม) */}
                {expandedRankDetailId && (
                  <div
                    className="mt-4 p-5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all animate-fade-in text-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${selectedRankTier.badgeColor}`}
                        >
                          <Award className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono font-bold uppercase text-cyan-300">
                              รายละเอียดสิทธิประโยชน์ & วิธีไต่ระดับ
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${selectedRankTier.badgeColor}`}
                            >
                              {selectedRankTier.nameEn} ({selectedRankTier.nameTh}) • {selectedRankTier.levelRange}
                            </span>
                          </div>
                          <h4 className="text-base font-black mt-1 text-white">
                            ภารกิจไต่ระดับสู่ยศ {selectedRankTier.nameEn} ({selectedRankTier.nameTh})
                          </h4>
                          <p className="text-xs text-white/80 mt-1 leading-relaxed max-w-2xl">
                            {selectedRankTier.description}
                          </p>
                        </div>
                      </div>

                      {/* ปุ่มปิด Accordion */}
                      <button
                        onClick={() => setExpandedRankDetailId(null)}
                        className="text-xs font-bold text-white/80 hover:text-white px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 self-start sm:self-auto cursor-pointer flex items-center gap-1 transition"
                      >
                        <span>✕ ปิดรายละเอียด</span>
                      </button>
                    </div>

                    {/* Content: แนวทางเก็บ EXP & รางวัลที่ปลดล็อก */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* ฝั่งซ้าย: วิธีเก็บ EXP ไต่ระดับ */}
                      <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-2">
                          <Zap className="w-4 h-4 text-amber-300" />
                          <span>แนวทางและวิธีเก็บ EXP ไต่ระดับ:</span>
                        </div>
                        <ul className="text-xs space-y-2 text-white/85">
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span><strong>เข้าเรียนแล็บ 1 (Classroom):</strong> ฟังบรรยายและบันทึกสาระสำคัญ รับ +50 EXP ต่อคาบ</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span><strong>ทำควิซแล็บ 2 (Quiz Arena):</strong> ตอบคำถามฟิสิกส์จับเวลาถูกต้อง รับ +100 EXP ต่อชุด</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 mt-1.5 shrink-0" />
                            <span><strong>สกัดข้อสอบแล็บ 3 (AI Studio):</strong> แปลงตำราหรือชีทสรุปเป็นโจทย์ รับ +150 EXP ทันที</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 mt-1.5 shrink-0" />
                            <span><strong>ส่งงานแล็บ 6 (Creator):</strong> เผยแพร่ชีทสรุปหรือโจทย์สู่สถานี รับ +300 EXP เมื่อได้รับอนุมัติ</span>
                          </li>
                        </ul>
                      </div>

                      {/* ฝั่งขวา: สิทธิประโยชน์และฉายาปลดล็อก */}
                      <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-2">
                          <Sparkles className="w-4 h-4" />
                          <span>สิทธิประโยชน์ & รางวัลที่ปลดล็อก:</span>
                        </div>
                        <div className="space-y-2.5 text-xs text-white/85">
                          <div className="p-2.5 rounded-lg bg-white/5 border border-white/15 flex items-center justify-between">
                            <span className="font-semibold text-white/90">กรอบโปรไฟล์นีออน:</span>
                            <span className="font-mono font-bold text-cyan-300">
                              Neon {selectedRankTier.nameEn} Frame
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-white/80 block mb-1">
                              ฉายาเกียรติยศประจำยศ (Titles):
                            </span>
                            <div className="space-y-1">
                              {selectedRankTier.titles.map((t, idx) => (
                                <div
                                  key={idx}
                                  className="px-2.5 py-1.5 rounded-md bg-white/5 border border-white/15 text-[11px] font-medium text-white flex items-center gap-2"
                                >
                                  <Star className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                                  <span>{t}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. ระบบรอบซีซัน (Cosmic Orbit Season) */}
              <div
                className="p-5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all hover:border-cyan-500/30 text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="text-sm sm:text-base font-black text-white">
                        COSMIC SEASON 1 (เหลือเวลาอีก 45 วัน)
                      </h4>
                      <div className="text-xs text-white/80">
                        ระยะเวลารอบซีซัน 90 วัน // ปัจจุบันอยู่ที่ Day 45/90
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-cyan-300 border border-white/20 self-start sm:self-auto">
                    ACTIVE CYCLE: SEASON 01
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* กติกา Soft Reset */}
                  <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 mb-1.5">
                      <RotateCcw className="w-4 h-4" />
                      <span>กติกา Soft Reset เมื่อจบซีซัน</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      เมื่อสิ้นสุดซีซัน ผู้เล่นที่มีเลเวลสูงจะถูกปรับระดับลงครึ่งหนึ่ง (Level Halving เช่น Lv. 80 จะถูกปรับเป็น Lv. 40) เพื่อให้ทุกคนร่วมออกสตาร์ทไต่ระดับใหม่อย่างเท่าเทียม พร้อมมอบของขวัญเกียรติยศ <strong>"กรอบรูปประจำซีซัน (Limited Nebula Vanguard Frame)"</strong>
                    </p>
                  </div>

                  {/* กลไกเหรียญหมดอายุ (Coin Burn) */}
                  <div className="p-4 rounded-xl border border-white/15 bg-white/[0.03] backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1.5">
                      <Flame className="w-4 h-4" />
                      <span>กลไกเหรียญหมดอายุ (Coin Burn to Fame Points)</span>
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed">
                      เหรียญ <strong>Cosmic Coins</strong> ที่คงเหลือในกระเป๋าเมื่อจบซีซัน จะถูกเบิร์นและแปลงเป็น <strong>คะแนนเกียรติยศสะสม (Fame Points)</strong> ในอัตรา 10:1 โดยอัตโนมัติ เพื่อป้องกันการดองเหรียญข้ามซีซัน และรักษาความสมดุลของระบบเศรษฐกิจในสถานีอวกาศ
                    </p>
                  </div>
                </div>

                {/* Season Transition Automation Details & Simulation Button */}
                <div className="mt-4 pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-mono text-[11px] text-white/80">
                      วันสิ้นสุดซีซันแบบคงที่: <strong className="text-cyan-300">season_end_date = "2026-12-31T23:59:59Z"</strong>
                    </div>
                    <div className="text-[11px] text-white/70 mt-0.5">
                      ระบบตรวจเช็กอัตโนมัติ (Lazy Check on User Session) ปรับลดเลเวลลงครึ่งหนึ่งและแปลงเหรียญทันทีเมื่อข้ามรอบ
                    </div>
                  </div>

                  <button
                    onClick={handleTriggerSeasonTransition}
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.08)] transition-all cursor-pointer flex items-center gap-2 shrink-0 self-start sm:self-auto text-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>⚡ จำลองข้ามซีซัน (Season Transition)</span>
                  </button>
                </div>

                {/* Season Transition Feedback Notice */}
                {seasonTransitionFeedback && (
                  <div className="mt-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-white text-xs font-semibold animate-fade-in flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                    <span>{seasonTransitionFeedback}</span>
                  </div>
                )}

                {/* Unlocked Season Badges Row */}
                {seasonBadges.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                      เหรียญตราประจำซีซันที่ได้รับ:
                    </span>
                    {seasonBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-100 dark:bg-purple-950/80 border border-purple-400/60 text-purple-700 dark:text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)] flex items-center gap-1.5"
                      >
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 2: เกียรติบัตรวิชาการ (Mastery Certification Hub) */}
          {/* ======================================================= */}
          {activeTab === 'cert' && (
            <div className="space-y-6">
              {/* 1. Header & Level Selection */}
              <div
                className="p-5 rounded-2xl border border-white/15 bg-white/[0.04] backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all hover:border-cyan-500/30 text-white"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2">
                      <Award className="w-3.5 h-3.5" />
                      <span>SINGLE-TIER HIGHEST ACADEMIC CERTIFICATION</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                      เกณฑ์รับรองเดี่ยวระดับสูงสุด (ไม่ผูกกับเลเวล คัดเฉพาะคนเก่งและมีวินัยจริง)
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      ผู้เรียนทุกระดับเลเวลสามารถสมัครขอรับการรับรองได้ หากผ่าน "ระบบตรวจสิทธิ์ 3 ประตูเหล็ก" ครบถ้วน
                    </p>
                  </div>

                  {/* Demo Quick-Pass Toggle */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => {
                        setStreakDays(30);
                        setCourseworkHours(20);
                        setExamScore(28);
                        setExamSubmitted(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/40 text-white font-bold text-xs backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ ปลดล็อก 3 ประตูทันที (โหมดกรรมการ)</span>
                    </button>
                  </div>
                </div>

                {/* Level Selection Pills */}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="text-xs font-bold text-white/90 mb-2.5">
                    เลือกระดับชั้นการศึกษาของคุณ:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(['primary', 'middle', 'high'] as AcademicGradeTier[]).map((tierKey) => {
                      const item = ACADEMIC_CERTS[tierKey];
                      const isSelected = selectedGrade === tierKey;
                      return (
                        <button
                          key={tierKey}
                          onClick={() => setSelectedGrade(tierKey)}
                          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer backdrop-blur-md ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/15 ring-2 ring-amber-500/30 text-white'
                              : 'border-white/15 bg-white/[0.03] hover:border-white/30 text-white/80'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-amber-300">
                              {item.labelTh}
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-amber-300" />}
                          </div>
                          <div className="text-xs font-bold tracking-tight text-white line-clamp-1">
                            {item.certNameEn}
                          </div>
                          <div className="text-[11px] text-white/70 mt-1 line-clamp-1">
                            {item.focusTopics}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 2. ระบบตรวจสิทธิ์ 3 ประตูเหล็ก (The 3-Gate Verification System) */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm sm:text-base font-black flex items-center gap-2 text-white">
                      <Lock className="w-4 h-4 text-cyan-400" />
                      <span>ระบบตรวจสิทธิ์ 3 ประตูเหล็ก (The 3-Gate Verification System)</span>
                    </h3>
                    <p className="text-xs text-white/80">
                      ต้องผ่านประตูที่ 1 และ 2 ให้ครบสมบูรณ์ จึงจะปลดล็อกประตูที่ 3 เข้าสู่ห้องสอบวัดระดับมาตรฐาน
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Gate 1: วินัยต่อเนื่อง (30-Day Streak) */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      isGate1Passed
                        ? 'border-emerald-400/50 bg-emerald-500/10 backdrop-blur-xl'
                        : 'border-white/15 bg-white/[0.04] backdrop-blur-xl hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">
                        GATE // 01 (DISCIPLINE)
                      </span>
                      {isGate1Passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" /> ผ่านเกณฑ์
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-amber-300">กำลังเก็บสถิติ</span>
                      )}
                    </div>

                    <h4 className="text-sm font-black flex items-center gap-1.5 text-white">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>30-Day Cosmic Streak</span>
                    </h4>
                    <p className="text-xs text-white/80 mt-1">
                      เช็คอินและเข้าเรียนรู้วิทยาศาสตร์ต่อเนื่อง 30 วันไม่ขาดสาย
                    </p>

                    <div className="my-3">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-white/80">สถิติต่อเนื่อง:</span>
                        <span className={isGate1Passed ? 'text-emerald-400 font-bold' : 'text-white font-bold'}>
                          {streakDays} / 30 วัน
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/50 border border-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                          style={{ width: `${Math.min(100, (streakDays / 30) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                      <span className="text-white/80 flex items-center gap-1">
                        ❄️ Streak Freeze:
                      </span>
                      <span className="font-mono font-bold text-cyan-300">
                        เหลือ {streakFreezesLeft} สิทธิ์/เดือน
                      </span>
                    </div>

                    {/* Small adjuster for testing */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => setStreakDays((p) => Math.max(0, p - 1))}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white hover:bg-white/20 transition border border-white/15"
                      >
                        -1 วัน
                      </button>
                      <button
                        onClick={() => setStreakDays((p) => Math.min(30, p + 1))}
                        className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white hover:bg-white/20 transition border border-white/15"
                      >
                        +1 วัน
                      </button>
                      <button
                        onClick={() => setStreakDays(30)}
                        className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold ml-auto"
                      >
                        เต็ม 30 วัน
                      </button>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/10 text-[9px] font-mono text-white/70 flex items-center gap-1">
                      <Shield className="w-3 h-3 text-cyan-400" />
                      <span>Server Time Authority: ตรวจสอบย้อนหลังจากฐานข้อมูล</span>
                    </div>
                  </div>

                  {/* Gate 2: ชั่วโมงเรียนสะสม (20 Coursework Hours + Anti-Cheat Heartbeat) */}
                  <div
                    className={`p-4 rounded-2xl border-2 transition-all backdrop-blur-xl bg-purple-950/30 border-purple-500/70 shadow-[0_0_25px_rgba(168,85,247,0.35)] hover:border-purple-400 hover:shadow-[0_0_35px_rgba(168,85,247,0.5)]`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-300 shadow-purple-500/50 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
                        GATE // 02 (COURSEWORK)
                      </span>
                      {isGate2Passed ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          <CheckCircle className="w-3.5 h-3.5" /> ผ่านเกณฑ์แล้ว
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-purple-300 bg-purple-500/20 border border-purple-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                          กำลังเก็บชั่วโมง
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black flex items-center gap-1.5 text-white">
                      <Clock className="w-4 h-4 text-purple-400" />
                      <span>20+ Hours Coursework</span>
                    </h4>
                    <p className="text-xs text-white/80 mt-1">
                      ดูคลิปบรรยายบทเรียนและทำบันทึกสรุปครบเป้าหมาย 20 ชม.
                    </p>

                    <div className="my-3">
                      <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                        <span className="text-white/80">เวลาเรียนสะสม:</span>
                        <span className={isGate2Passed ? 'text-emerald-400 font-bold' : 'text-purple-300 font-bold'}>
                          ปัจจุบัน {courseworkHours} / 20 ชั่วโมง
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-black/50 border border-purple-500/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-300 transition-all duration-300 shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                          style={{ width: `${Math.min(100, (courseworkHours / 20) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Anti-Cheat Daily Cap Meter (Max 2 hrs/day) */}
                    <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[11px]">
                      <div className="flex items-center justify-between font-mono mb-1">
                        <span className="text-white/80">จำกัดเรียนสูงสุดต่อวัน:</span>
                        <span className={`font-bold ${todayWatchCapReached ? 'text-amber-300' : 'text-purple-300'}`}>
                          {(todayWatchSeconds / 3600).toFixed(1)} / 2.0 ชม.
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-black/50 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            todayWatchCapReached ? 'bg-amber-400' : 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]'
                          }`}
                          style={{ width: `${Math.min(100, (todayWatchSeconds / 7200) * 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-white/70 mt-1 flex items-center justify-between">
                        <span>ระบบ Heartbeat ป้องกันบอท</span>
                        <span>สูงสุด 2 ชม./วัน</span>
                      </div>
                    </div>

                    {/* Active Heartbeat Button */}
                    <div className="mt-2.5">
                      <button
                        onClick={handleSendHeartbeat}
                        disabled={isSendingHeartbeat || todayWatchCapReached}
                        className="w-full py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 disabled:opacity-50 border border-purple-400/40 text-purple-100 font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.25)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed text-xs"
                      >
                        {isSendingHeartbeat ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>กำลังส่ง Heartbeat...</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-purple-300" />
                            <span>▶ ส่ง Heartbeat ดูคลิปจริง (+30 วินาที)</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Heartbeat feedback */}
                    {heartbeatFeedback && (
                      <div className="mt-2 p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-[10px] text-purple-200 font-semibold leading-tight animate-fade-in">
                        {heartbeatFeedback}
                      </div>
                    )}

                    {/* Small adjuster for testing */}
                    <div className="mt-2.5 flex items-center gap-1.5">
                      <button
                        onClick={() => setCourseworkHours((p) => Math.max(0, p - 2))}
                        className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition border border-purple-500/30"
                      >
                        -2 ชม.
                      </button>
                      <button
                        onClick={() => setCourseworkHours((p) => Math.min(20, p + 2))}
                        className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 transition border border-purple-500/30"
                      >
                        +2 ชม.
                      </button>
                      <button
                        onClick={() => setCourseworkHours(20)}
                        className="text-[10px] px-2 py-0.5 rounded bg-purple-500/30 text-purple-200 border border-purple-400/50 font-bold ml-auto"
                      >
                        ครบ 20 ชม.
                      </button>
                    </div>
                  </div>

                  {/* Gate 3: ห้องสอบวัดระดับมาตรฐาน (Proctored Standard Exam) */}
                  <div
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between backdrop-blur-xl ${
                      isCertified
                        ? 'border-amber-400/80 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                        : isGate3Unlocked
                        ? 'border-cyan-400/80 bg-white/[0.06] shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                        : 'border-white/15 bg-white/[0.03] opacity-80'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">
                          GATE // 03 (ASSESSMENT)
                        </span>
                        {isCertified ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                            <Award className="w-3.5 h-3.5" /> ผ่านเกณฑ์ 80%+
                          </span>
                        ) : isGate3Unlocked ? (
                          <span className="text-[11px] font-bold text-cyan-300">พร้อมเข้าสอบ</span>
                        ) : (
                          <span className="text-[11px] font-bold text-white/60">ประตูล็อก</span>
                        )}
                      </div>

                      <h4 className="text-sm font-black flex items-center gap-1.5 text-white">
                        <FileCheck className="w-4 h-4 text-amber-400" />
                        <span>ห้องสอบวัดระดับมาตรฐาน</span>
                      </h4>
                      <p className="text-xs text-white/80 mt-1">
                        ข้อสอบ 30 ข้อ / จับเวลา 40 นาที / เกณฑ์ผ่าน 80% (24/30 ข้อ)
                      </p>

                      {examSubmitted && (
                        <div className="my-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/15 text-xs space-y-2">
                          <div className="flex items-center justify-between font-mono">
                            <span className="text-white/80">คะแนนสอบล่าสุด:</span>
                            <strong className="text-sm text-white">{examScore}/30 ({Math.round((examScore / 30) * 100)}%)</strong>
                          </div>
                          <div className={`font-bold flex items-center gap-1.5 ${examScore >= 24 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {examScore >= 24 ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" />
                                <span>ผ่านเกณฑ์มาตรฐานแล้ว (80%+)</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                <span>ยังไม่ผ่านเกณฑ์ (ต้องได้ 24/30 ข้อ)</span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => setIsReviewModalOpen(true)}
                            className="w-full py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-cyan-300 border border-white/20 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Lightbulb className="w-3.5 h-3.5" />
                            <span>🔍 ดูเฉลยและจุดที่ทำผิดอย่างละเอียด</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 mt-3 border-t border-white/10">
                      {isGate3Unlocked ? (
                        <button
                          onClick={handleStartExam}
                          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/40 text-white backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>[เข้าสู่การสอบวัดระดับมาตรฐาน (30 ข้อ / จับเวลา 40 นาที)]</span>
                        </button>
                      ) : (
                        <button
                          disabled
                          className="w-full py-2.5 px-3 rounded-xl font-bold text-xs bg-white/5 border border-white/10 text-white/50 cursor-not-allowed flex items-center justify-center gap-1.5"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>🔒 ประตูทดสอบล็อก (ต้องเก็บสถิติและชั่วโมงเรียนให้ครบก่อน)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Proctored Standard Exam Modal / Window (When Active) */}
              {isExamActive && (
                <div className="p-5 rounded-2xl border-2 border-indigo-500/60 bg-slate-950 text-white shadow-2xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900">
                    <div>
                      <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                        PROCTORED STANDARD ASSESSMENT // {currentCertConfig.labelTh}
                      </span>
                      <h4 className="text-base font-black">
                        การสอบวัดระดับมาตรฐานวิชาการ (30 ข้อ / จับเวลา 40 นาที)
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* 40 Min Countdown Timer */}
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 font-mono font-bold text-sm">
                        <Clock className="w-4 h-4 animate-spin text-red-400" style={{ animationDuration: '6s' }} />
                        <span>
                          {Math.floor(examSecondsLeft / 60)}:{(examSecondsLeft % 60).toString().padStart(2, '0')}
                        </span>
                      </div>

                      <button
                        onClick={handleAutoSubmitExam}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                      >
                        ส่งข้อสอบ (Submit Exam)
                      </button>
                    </div>
                  </div>

                  {/* Questions List (First 5 shown with selection, with full navigation) */}
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {SAMPLE_30_EXAM_QUESTIONS.map((q) => {
                      const userChoice = examAnswers[q.id];
                      return (
                        <div
                          key={q.id}
                          className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3"
                        >
                          <div className="flex items-start gap-2">
                            <span className="w-6 h-6 rounded-md bg-indigo-900/80 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {q.id}
                            </span>
                            <div className="text-sm font-medium text-slate-200">
                              {q.question}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8">
                            {q.options.map((opt, optIdx) => {
                              const isPicked = userChoice === optIdx;
                              return (
                                <button
                                  key={optIdx}
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer flex items-center gap-2 ${
                                    isPicked
                                      ? 'border-cyan-400 bg-cyan-500/20 text-white font-bold'
                                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700'
                                  }`}
                                >
                                  <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] font-mono flex items-center justify-center shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      ตอบแล้ว {Object.keys(examAnswers).length} จาก 30 ข้อ (เกณฑ์ผ่าน 24 ข้อ)
                    </span>
                    <button
                      onClick={handleAutoSubmitExam}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg"
                    >
                      ส่งคำตอบและตรวจผลสอบ
                    </button>
                  </div>
                </div>
              )}

              {/* 4. การออกเอกสารเกียรติบัตร PDF (Zero-Cost Client-Side) */}
              <div
                className={`p-5 sm:p-7 rounded-2xl border transition-all ${
                  isWhite ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-indigo-900/50'
                }`}
              >
                <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
                  <h4 className="text-base font-black flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <span>การออกเอกสารเกียรติบัตร PDF (Direct Vector PDF Export)</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    สร้างเอกสารเวกเตอร์ความละเอียดสูงระดับมาตรฐานวิชาการ (A4 Landscape 297 × 210 mm) พร้อมบันทึกไฟล์ลงเครื่องทันที 100%
                  </p>
                </div>

                {/* Auto-populated from Profile Info Banner */}
                <div className="my-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2.5 text-indigo-900 dark:text-indigo-200">
                    <Info className="w-4 h-4 shrink-0 text-indigo-500 dark:text-cyan-400" />
                    <span>
                      ชื่อที่จะพิมพ์บนเกียรติบัตร: <strong className="text-slate-900 dark:text-white">{studentName} {studentEnglishName && `(${studentEnglishName})`}</strong> • <span className="text-slate-600 dark:text-slate-300">{userProfile.school}</span>
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    *ระบบดึงข้อมูลชื่อ-นามสกุลจากโปรไฟล์ของคุณ หากต้องการแก้ไขชื่อให้แก้ไขผ่านหน้าต่าง PROFILE
                  </span>
                </div>

                {/* Certificate Live Preview Box */}
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-3 text-xs font-mono text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-indigo-500" />
                      <span>ตัวอย่างเอกสารเกียรติบัตรทางการ (A4 LANDSCAPE PREVIEW):</span>
                    </span>
                    <span>CERT-ID: {certId}</span>
                  </div>

                  {/* Actual Renderable Certificate DOM Container */}
                  <div className="overflow-x-auto pb-4">
                    <div
                      id="certificate-render-card"
                      ref={certContainerRef}
                      className="w-[840px] h-[594px] mx-auto bg-[#ffffff] text-slate-900 p-8 rounded-none relative shadow-2xl flex flex-col justify-between overflow-hidden select-none border-[8px] border-[#0f2347]"
                      style={{
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Dual Gold & Navy Geometric Inset Borders */}
                      <div className="absolute inset-2 border border-[#b8860b] pointer-events-none" />
                      <div className="absolute inset-3.5 border-2 border-[#d4af37] pointer-events-none" />
                      <div className="absolute inset-5 border border-[#1e3a8a]/20 pointer-events-none" />

                      {/* Corner Guilloché / Geometric Accents in Gold & Navy */}
                      <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#b8860b] pointer-events-none flex items-start justify-start">
                        <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
                      </div>
                      <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#b8860b] pointer-events-none flex items-start justify-end">
                        <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
                      </div>
                      <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#b8860b] pointer-events-none flex items-end justify-start">
                        <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
                      </div>
                      <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#b8860b] pointer-events-none flex items-end justify-end">
                        <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
                      </div>

                      {/* Header */}
                      <div className="text-center pt-2">
                        <div className="flex items-center justify-center gap-3 mb-1">
                          <div className="w-12 h-[1.5px] bg-[#b8860b]" />
                          <span className="text-[11px] font-mono tracking-[0.35em] text-[#0f2347] font-extrabold uppercase">
                            SEVEN SPACE LABS <span className="text-[#b8860b] font-bold">//</span> ORBITAL RESEARCH STATION
                          </span>
                          <div className="w-12 h-[1.5px] bg-[#b8860b]" />
                        </div>
                        <h1 className="text-2xl sm:text-[26px] font-serif font-black tracking-wider text-[#0f2347] uppercase mt-0.5">
                          CERTIFICATE OF ACADEMIC <span className="text-[#b8860b]">EXCELLENCE & MASTERY</span>
                        </h1>
                        <div className="text-[11px] font-mono tracking-[0.25em] text-[#1e3a8a] font-bold mt-1 uppercase">
                          STANDARDIZED ASTROPHYSICS & PHYSICS CERTIFICATION PROTOCOL
                        </div>
                        <div className="w-24 h-[2px] bg-[#b8860b] mx-auto mt-2" />
                      </div>

                      {/* Recipient Statement */}
                      <div className="text-center my-auto py-1">
                        <p className="text-xs font-serif tracking-widest text-[#475569] uppercase font-medium">
                          This is to formally certify that
                        </p>
                        <h2
                          className="text-2xl sm:text-[28px] font-bold text-[#0a0a0a] tracking-wide mt-1.5 border-b-2 border-[#b8860b] pb-1 inline-block px-10"
                          style={{ fontFamily: "'Prompt', 'Plus Jakarta Sans', system-ui, sans-serif" }}
                        >
                          {studentName} {studentEnglishName && <span className="text-[#1e293b] font-bold font-serif">({studentEnglishName})</span>}
                        </h2>

                        <p className="text-xs font-sans tracking-wide text-[#334155] italic mt-2.5">
                          has successfully satisfied all rigorous academic requirements of the 3-Gate Verification Protocol for
                        </p>

                        <div className="text-lg sm:text-xl font-serif font-black text-[#0f2347] tracking-wide mt-1">
                          {currentCertConfig.certNameEn}
                        </div>
                        <div className="text-xs font-mono font-semibold text-[#475569] tracking-wider mt-0.5">
                          Academic Track: <span className="font-bold text-[#1e3a8a]">{currentCertConfig.trackEn}</span>
                        </div>

                        {/* Verified Badges */}
                        <div className="flex items-center justify-center gap-3 mt-3.5">
                          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0284c7]/40 shadow-xs text-[#0369a1] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-[#0284c7]" />
                            <span>30-DAY STREAK VERIFIED</span>
                          </div>
                          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#4f46e5]/40 shadow-xs text-[#4338ca] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
                            <span>20+ COURSEWORK HOURS</span>
                          </div>
                          <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#b45309]/50 shadow-xs text-[#b45309] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-[#d97706]" />
                            <span>DISTINCTION SCORE: {Math.round((examScore / 30) * 100)}%</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer & Signatures */}
                      <div className="flex items-end justify-between pt-3 pb-1 border-t-2 border-[#cbd5e1]/60 text-xs">
                        {/* Director Signature */}
                        <div className="text-center w-52">
                          <div className="font-serif italic text-base font-semibold text-[#0f2347] border-b-2 border-[#cbd5e1] pb-1">
                            Prof. Dr. Orion Vance
                          </div>
                          <div className="text-[10px] font-mono font-bold text-[#334155] mt-1 uppercase">
                            Director of Orbital Research
                          </div>
                          <div className="text-[9px] text-[#64748b] font-mono">
                            Seven Space Labs Consortium
                          </div>
                        </div>

                        {/* Official Gold Seal Graphic */}
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-16 h-16 rounded-full border-2 border-double border-[#b8860b] bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#f59e0b]/20 flex flex-col items-center justify-center text-[#78350f] shadow-md">
                            <Shield className="w-6 h-6 text-[#b45309]" />
                            <span className="text-[7.5px] font-mono font-black tracking-tight text-[#0f2347] mt-0.5">OFFICIAL SEAL</span>
                          </div>
                          <span className="text-[9px] font-mono font-bold text-[#475569] mt-1 tracking-wider">VERIFIED CREDENTIAL</span>
                        </div>

                        {/* QR Code & CERT-ID */}
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-14 bg-white p-1 rounded-lg border border-[#cbd5e1] shadow-xs flex items-center justify-center">
                            <QrCode className="w-full h-full text-[#0f2347]" />
                          </div>
                          <div className="text-left font-mono">
                            <div className="text-[9px] font-bold text-[#64748b] uppercase">CREDENTIAL ID:</div>
                            <div className="text-[11px] font-black text-[#0f2347]">{certId}</div>
                            <div className="text-[9px] text-[#64748b] mt-0.5">
                              Issued: {new Date().toLocaleDateString('th-TH')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single Cleaned & Prominent Centered Download Button */}
                  <div className="mt-6 pt-4 border-t border-white/10 flex flex-col items-center justify-center gap-3">
                    <button
                      onClick={handleDownloadCertificate}
                      disabled={isGeneratingPdf}
                      className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500/15 hover:bg-orange-500/25 active:scale-[0.98] text-white border border-orange-500/50 backdrop-blur-md shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2.5"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                          <span className="text-orange-300">{pdfGenerationStatus || 'กำลังสร้างไฟล์ PDF...'}</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-orange-400" />
                          <span className="text-white font-black tracking-wide">ดาวน์โหลดเกียรติบัตร</span>
                        </>
                      )}
                    </button>

                    {pdfGenerationStatus && !isGeneratingPdf && (
                      <div className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-4 py-1.5 rounded-full animate-fade-in flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{pdfGenerationStatus}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        {/* ========================================================= */}
        {/* Post-Exam Question Breakdown & Detailed Solutions Modal   */}
        {/* ========================================================= */}
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
            <div
              className={`relative w-full max-w-4xl rounded-3xl shadow-2xl border flex flex-col my-auto max-h-[90vh] overflow-hidden transition-all ${
                isWhite
                  ? 'bg-white border-slate-200 text-slate-900 shadow-slate-900/20'
                  : 'bg-[#0a0d1d] border-indigo-500/40 text-white shadow-cyan-500/10'
              }`}
            >
              {/* Review Modal Header */}
              <div
                className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
                  isWhite ? 'border-slate-200 bg-slate-50' : 'border-indigo-900/60 bg-slate-900/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shrink-0">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-600 dark:text-cyan-400 uppercase">
                        EXAM SOLUTIONS & BREAKDOWN
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          examScore >= 24
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                        }`}
                      >
                        {examScore >= 24 ? '✓ PASSED (ผ่านเกณฑ์ 80%+)' : '✗ RETAKE RECOMMENDED'}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight">
                      รายงานผลสอบและเฉลยละเอียดรายข้อ (30 ข้อ)
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {/* Score pill */}
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono font-bold">
                    คะแนนรวม: <span className={examScore >= 24 ? 'text-emerald-500 text-sm' : 'text-red-400 text-sm'}>{examScore}/30</span> ({Math.round((examScore / 30) * 100)}%)
                  </div>

                  <button
                    onClick={() => setIsReviewModalOpen(false)}
                    className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    title="ปิดหน้าต่างเฉลย"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div
                className={`px-5 py-2.5 border-b flex items-center justify-between gap-2 overflow-x-auto shrink-0 ${
                  isWhite ? 'border-slate-200 bg-slate-100/60' : 'border-indigo-950 bg-slate-950/70'
                }`}
              >
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReviewFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      reviewFilter === 'all'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    ข้อสอบทั้งหมด (30 ข้อ)
                  </button>
                  <button
                    onClick={() => setReviewFilter('correct')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      reviewFilter === 'correct'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ตอบถูก ({SAMPLE_30_EXAM_QUESTIONS.filter((q) => examAnswers[q.id] === q.correctIndex).length} ข้อ)</span>
                  </button>
                  <button
                    onClick={() => setReviewFilter('wrong')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      reviewFilter === 'wrong'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>ตอบผิด ({SAMPLE_30_EXAM_QUESTIONS.filter((q) => examAnswers[q.id] !== q.correctIndex).length} ข้อ)</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
                  เกณฑ์ผ่าน 80% (24 ข้อขึ้นไป)
                </span>
              </div>

              {/* Questions Solution List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {SAMPLE_30_EXAM_QUESTIONS.filter((q) => {
                  const isCorrect = examAnswers[q.id] === q.correctIndex;
                  if (reviewFilter === 'correct') return isCorrect;
                  if (reviewFilter === 'wrong') return !isCorrect;
                  return true;
                }).map((q) => {
                  const userChoice = examAnswers[q.id];
                  const isCorrect = userChoice === q.correctIndex;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        isCorrect
                          ? isWhite
                            ? 'border-emerald-200 bg-emerald-50/30'
                            : 'border-emerald-500/30 bg-emerald-950/10'
                          : isWhite
                          ? 'border-red-200 bg-red-50/30'
                          : 'border-red-500/30 bg-red-950/10'
                      }`}
                    >
                      {/* Question Top Meta */}
                      <div className="flex items-center justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                            {q.id}
                          </span>
                          <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {q.category}
                          </span>
                        </div>

                        {/* Status badge */}
                        <div>
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>ตอบถูกต้อง (+1)</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-700">
                              <XCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                              <span>ตอบไม่ถูกต้อง (0)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Question Text */}
                      <div className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 mb-3.5 leading-relaxed">
                        {q.question}
                      </div>

                      {/* 4 Choices Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = userChoice === optIdx;
                          const isRightAnswer = q.correctIndex === optIdx;

                          let choiceStyle = isWhite
                            ? 'border-slate-200 bg-white text-slate-700'
                            : 'border-slate-800 bg-slate-900/60 text-slate-300';

                          if (isRightAnswer) {
                            choiceStyle = isWhite
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-400/50 font-bold'
                              : 'border-emerald-400 bg-emerald-950/40 text-emerald-200 ring-2 ring-emerald-500/40 font-bold';
                          } else if (isPicked && !isRightAnswer) {
                            choiceStyle = isWhite
                              ? 'border-red-500 bg-red-50 text-red-900 ring-2 ring-red-400/50 font-medium'
                              : 'border-red-500 bg-red-950/40 text-red-200 ring-2 ring-red-500/40 font-medium';
                          }

                          return (
                            <div
                              key={optIdx}
                              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${choiceStyle}`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                                  isRightAnswer
                                    ? 'bg-emerald-500 text-white'
                                    : isPicked && !isRightAnswer
                                    ? 'bg-red-500 text-white'
                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>

                              <div className="flex-1 leading-snug">
                                <div>{opt}</div>
                                {isRightAnswer && (
                                  <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>คำตอบที่ถูกต้อง</span>
                                  </div>
                                )}
                                {isPicked && !isRightAnswer && (
                                  <div className="text-[10px] font-bold text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                                    <X className="w-3 h-3" />
                                    <span>คำตอบที่คุณเลือก (ไม่ถูกต้อง)</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Detailed Explanation & Pitfall Box */}
                      <div
                        className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                          isWhite
                            ? 'bg-slate-100/90 border-slate-300 text-slate-800'
                            : 'bg-slate-900/90 border-slate-800 text-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-amber-600 dark:text-amber-400">คำอธิบายวิธีคิดสั้นๆ:</span>{' '}
                            <span className="leading-relaxed">{q.explanation}</span>
                          </div>
                        </div>

                        {q.pitfall && (
                          <div className="flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                            <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                            <div>
                              <span className="font-bold text-orange-600 dark:text-orange-400">จุดที่มักคำนวณพลาดหรือเข้าใจผิด:</span>{' '}
                              <span className="leading-relaxed text-slate-600 dark:text-slate-300">{q.pitfall}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Review Modal Footer */}
              <div
                className={`p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
                  isWhite ? 'border-slate-200 bg-slate-50' : 'border-indigo-950 bg-slate-900/80'
                }`}
              >
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  ปิดหน้าต่างเฉลย
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsReviewModalOpen(false);
                      handleStartExam();
                    }}
                    className="px-4 py-2 rounded-xl bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-cyan-400 border border-indigo-500/30 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>สอบใหม่อีกครั้ง (40 นาที)</span>
                  </button>

                  {examScore >= 24 && (
                    <button
                      onClick={() => {
                        setIsReviewModalOpen(false);
                        handleDownloadCertificate();
                      }}
                      className="px-5 py-2.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 active:scale-[0.98] text-white text-xs font-black backdrop-blur-md border border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all cursor-pointer flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-orange-400" />
                      <span>[📥 ดาวน์โหลดเกียรติบัตร (.pdf)]</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
            </>
          )}
        </div>
        {/* Persistent Hidden Certificate Container for WYSIWYG html2canvas export */}
        <div
          id="certificate-render-node-persistent"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '-9999px',
            width: '840px',
            height: '594px',
            zIndex: -100,
            pointerEvents: 'none',
            opacity: 1,
            backgroundColor: '#ffffff',
          }}
          aria-hidden="true"
          className="bg-[#ffffff] text-slate-900 p-8 relative flex flex-col justify-between overflow-hidden border-[8px] border-[#0f2347]"
        >
          {/* Dual Gold & Navy Geometric Inset Borders */}
          <div className="absolute inset-2 border border-[#b8860b] pointer-events-none" />
          <div className="absolute inset-3.5 border-2 border-[#d4af37] pointer-events-none" />
          <div className="absolute inset-5 border border-[#1e3a8a]/20 pointer-events-none" />

          {/* Corner Guilloché / Geometric Accents in Gold & Navy */}
          <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-[#b8860b] pointer-events-none flex items-start justify-start">
            <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
          </div>
          <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-[#b8860b] pointer-events-none flex items-start justify-end">
            <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
          </div>
          <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-[#b8860b] pointer-events-none flex items-end justify-start">
            <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
          </div>
          <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-[#b8860b] pointer-events-none flex items-end justify-end">
            <div className="w-2 h-2 bg-[#0f2347] m-0.5 border border-[#b8860b]" />
          </div>

          {/* Header */}
          <div className="text-center pt-2">
            <div className="flex items-center justify-center gap-3 mb-1">
              <div className="w-12 h-[1.5px] bg-[#b8860b]" />
              <span className="text-[11px] font-mono tracking-[0.35em] text-[#0f2347] font-extrabold uppercase">
                SEVEN SPACE LABS <span className="text-[#b8860b] font-bold">//</span> ORBITAL RESEARCH STATION
              </span>
              <div className="w-12 h-[1.5px] bg-[#b8860b]" />
            </div>
            <h1 className="text-[26px] font-serif font-black tracking-wider text-[#0f2347] uppercase mt-0.5">
              CERTIFICATE OF ACADEMIC <span className="text-[#b8860b]">EXCELLENCE & MASTERY</span>
            </h1>
            <div className="text-[11px] font-mono tracking-[0.25em] text-[#1e3a8a] font-bold mt-1 uppercase">
              STANDARDIZED ASTROPHYSICS & PHYSICS CERTIFICATION PROTOCOL
            </div>
            <div className="w-24 h-[2px] bg-[#b8860b] mx-auto mt-2" />
          </div>

          {/* Recipient Statement */}
          <div className="text-center my-auto py-1">
            <p className="text-xs font-serif tracking-widest text-[#475569] uppercase font-medium">
              This is to formally certify that
            </p>
            <h2
              className="text-[28px] font-bold text-[#0a0a0a] tracking-wide mt-1.5 border-b-2 border-[#b8860b] pb-1 inline-block px-10"
              style={{ fontFamily: "'Prompt', 'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              {studentName} {studentEnglishName && <span className="text-[#1e293b] font-bold font-serif">({studentEnglishName})</span>}
            </h2>

            <p className="text-xs font-sans tracking-wide text-[#334155] italic mt-2.5">
              has successfully satisfied all rigorous academic requirements of the 3-Gate Verification Protocol for
            </p>

            <div className="text-xl font-serif font-black text-[#0f2347] tracking-wide mt-1">
              {currentCertConfig.certNameEn}
            </div>
            <div className="text-xs font-mono font-semibold text-[#475569] tracking-wider mt-0.5">
              Academic Track: <span className="font-bold text-[#1e3a8a]">{currentCertConfig.trackEn}</span>
            </div>

            {/* Verified Badges */}
            <div className="flex items-center justify-center gap-3 mt-3.5">
              <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#0284c7]/40 shadow-xs text-[#0369a1] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-[#0284c7]" />
                <span>30-DAY STREAK VERIFIED</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#4f46e5]/40 shadow-xs text-[#4338ca] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#4f46e5]" />
                <span>20+ COURSEWORK HOURS</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-white border border-[#b45309]/50 shadow-xs text-[#b45309] text-[10.5px] font-mono font-bold flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#d97706]" />
                <span>DISTINCTION SCORE: {Math.round((examScore / 30) * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="flex items-end justify-between pt-3 pb-1 border-t-2 border-[#cbd5e1]/60 text-xs">
            {/* Director Signature */}
            <div className="text-center w-52">
              <div className="font-serif italic text-base font-semibold text-[#0f2347] border-b-2 border-[#cbd5e1] pb-1">
                Prof. Dr. Orion Vance
              </div>
              <div className="text-[10px] font-mono font-bold text-[#334155] mt-1 uppercase">
                Director of Orbital Research
              </div>
              <div className="text-[9px] text-[#64748b] font-mono">
                Seven Space Labs Consortium
              </div>
            </div>

            {/* Official Gold Seal Graphic */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-double border-[#b8860b] bg-gradient-to-br from-[#fef3c7] via-[#fde68a] to-[#f59e0b]/20 flex flex-col items-center justify-center text-[#78350f] shadow-md">
                <Shield className="w-6 h-6 text-[#b45309]" />
                <span className="text-[7.5px] font-mono font-black tracking-tight text-[#0f2347] mt-0.5">OFFICIAL SEAL</span>
              </div>
              <span className="text-[9px] font-mono font-bold text-[#475569] mt-1 tracking-wider">VERIFIED CREDENTIAL</span>
            </div>

            {/* QR Code & CERT-ID */}
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-white p-1 rounded-lg border border-[#cbd5e1] shadow-xs flex items-center justify-center">
                <QrCode className="w-full h-full text-[#0f2347]" />
              </div>
              <div className="text-left font-mono">
                <div className="text-[9px] font-bold text-[#64748b] uppercase">CREDENTIAL ID:</div>
                <div className="text-[11px] font-black text-[#0f2347]">{certId}</div>
                <div className="text-[9px] text-[#64748b] mt-0.5">
                  Issued: {new Date().toLocaleDateString('th-TH')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
