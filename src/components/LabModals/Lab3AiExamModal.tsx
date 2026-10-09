import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  FileText,
  Upload,
  Download,
  Copy,
  Check,
  Printer,
  Bot,
  RefreshCw,
  FileCheck,
  AlertCircle,
  Eye,
  EyeOff,
  FileDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lock,
  Crown,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Coins,
  Zap,
} from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Language, CadetProfile } from '../../types';
import {
  FREE_DAILY_PDF_QUOTA_MAX,
  PREMIUM_DAILY_PDF_QUOTA_MAX,
  getTierPdfQuota,
  consumeTierPdfQuota,
  fetchCadetDbState,
  isUserAdminOrDev,
  DailyPdfQuota,
} from '../../utils/quotaService';

interface Lab3AiExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialMode?: 'free' | 'premium';
  isCadetPremium?: boolean;
  cadet?: CadetProfile;
  isAdmin?: boolean;
  isDeveloper?: boolean;
  onOpenPremiumModal?: () => void;
  onOpenRankHub?: () => void;
}

export interface ExamQuestion {
  id: number;
  question: string;
  diagramSvg?: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

export interface ExamSet {
  title: string;
  subject?: string;
  totalQuestions: number;
  layoutOption?: 'compact' | 'workspace';
  questions: ExamQuestion[];
}

/**
 * Helper: Cleans and sanitizes raw topic / filenames
 * - Removes .pdf, .docx, .doc, .txt extensions
 * - Removes leading order/sequence numbers (e.g. "10ความร้อนและแก๊ส.pdf" -> "ความร้อนและแก๊ส")
 * - Removes common document prefixes like "เอกสาร", "บทที่ 1", etc.
 */
export function cleanAcademicTopicTitle(rawTitle: string): string {
  if (!rawTitle) return 'ฟิสิกส์และวิทยาศาสตร์ประยุกต์';
  let cleaned = String(rawTitle).trim();

  // Strip existing exam prefix if present
  cleaned = cleaned.replace(/^ชุดข้อสอบ(มาตรฐาน)?(วิชาการ)?\s*(\d+\s*ข้อ)?\s*[:：\-–—]\s*/i, '');

  // 1. Remove file extensions (.pdf, .docx, .doc, .txt)
  cleaned = cleaned.replace(/\.(pdf|docx|doc|txt)$/i, '');

  // 2. Remove leading order numbers, digits, index notation e.g. "10ความร้อนและแก๊ส", "10. ความร้อน", "01 - "
  cleaned = cleaned.replace(/^(\d+[\s\.\-_:：–—]*|[\[\(]\d+[\]\)]\s*)/, '');

  // 3. Remove common document prefixes like "เอกสาร", "บทที่ 1", "หน่วยที่ 1", "ใบงาน", "สรุป"
  cleaned = cleaned.replace(/^(เอกสาร|บทที่\s*\d+|หน่วยที่\s*\d+|ชุดที่\s*\d+|ใบงาน|สรุป)[\s\.\-_:：–—]*/i, '');

  cleaned = cleaned.trim();
  if (!cleaned) {
    cleaned = 'ฟิสิกส์และวิทยาศาสตร์ประยุกต์';
  }
  return cleaned;
}

// 20 Authentic handcrafted physics questions as standard initial dataset
const INITIAL_20_QUESTIONS: ExamQuestion[] = [
  {
    id: 1,
    question: 'วัตถุมวล 4.0 กิโลกรัม วางบนพื้นราบเกลี้ยงไร้ความฝืด ถูกแรงคงที่ขนาด 20 นิวตัน ดึงในแนวระดับเป็นเวลา 5.0 วินาที จงหาความเร็วของวัตถุเมื่อสิ้นสุดวินาทีที่ 5',
    diagramSvg: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><line x1="20" y1="65" x2="260" y2="65" stroke="#0f172a" stroke-width="2"/><line x1="30" y1="65" x2="20" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="50" y1="65" x2="40" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="70" y1="65" x2="60" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="90" y1="65" x2="80" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="110" y1="65" x2="100" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="130" y1="65" x2="120" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="150" y1="65" x2="140" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="170" y1="65" x2="160" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="190" y1="65" x2="180" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="210" y1="65" x2="200" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="230" y1="65" x2="220" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="250" y1="65" x2="240" y2="75" stroke="#94a3b8" stroke-width="1.5"/><rect x="60" y="25" width="60" height="40" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="2"/><text x="90" y="49" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">m = 4 kg</text><line x1="120" y1="45" x2="200" y2="45" stroke="#0f172a" stroke-width="2.5"/><polygon points="200,40 212,45 200,50" fill="#0f172a"/><text x="165" y="38" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">F = 20 N</text></svg>`,
    options: {
      A: '10.0 เมตรต่อวินาที (m/s)',
      B: '25.0 เมตรต่อวินาที (m/s)',
      C: '50.0 เมตรต่อวินาที (m/s)',
      D: '100.0 เมตรต่อวินาที (m/s)',
    },
  },
  {
    id: 2,
    question: 'ตามกฎการเคลื่อนที่ข้อที่สามของนิวตัน (Action - Reaction) ข้อความใดระบุสมบัติของแรงคู่กิริยา-ปฏิกิริยาได้ถูกต้องที่สุดตามหลักกลศาสตร์',
    diagramSvg: '',
    options: {
      A: 'มีขนาดเท่ากัน ทิศทางตรงข้าม และกระทำบนวัตถุคนละก้อน จึงไม่หักล้างกัน',
      B: 'มีขนาดเท่ากัน ทิศทางตรงข้าม กระทำบนวัตถุก้อนเดียวกันจนแรงลัพธ์เป็นศูนย์',
      C: 'แรงกิริยาต้องเกิดขึ้นก่อน และแรงปฏิกิริยาจึงเกิดขึ้นตามมาภายหลังเสมอ',
      D: 'เกิดขึ้นเฉพาะเมื่อวัตถุทั้งสองก้อนอยู่ในสภาวะหยุดนิ่งเท่านั้น',
    },
  },
  {
    id: 3,
    question: 'ปล่อยลูกเหล็กมวล 2.0 กิโลกรัม ให้ตกอย่างอิสระจากยอดหอคอยสูง 45 เมตรเหนือพื้นดิน ขณะที่กระทบพื้น ลูกเหล็กจะมีพลังงานจลน์เท่าใด (กำหนด g = 10 m/s²)',
    diagramSvg: `<svg viewBox="0 0 280 85" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><line x1="50" y1="15" x2="50" y2="75" stroke="#0f172a" stroke-width="2"/><line x1="40" y1="15" x2="60" y2="15" stroke="#0f172a" stroke-width="2"/><line x1="20" y1="75" x2="260" y2="75" stroke="#0f172a" stroke-width="2"/><circle cx="50" cy="15" r="7" fill="#0f172a"/><text x="75" y="20" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">m = 2 kg</text><line x1="110" y1="15" x2="110" y2="75" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 3"/><polygon points="107,20 110,15 113,20" fill="#64748b"/><polygon points="107,70 110,75 113,70" fill="#64748b"/><text x="140" y="48" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">h = 45 m</text><line x1="190" y1="30" x2="190" y2="60" stroke="#0f172a" stroke-width="2"/><polygon points="186,55 190,65 194,55" fill="#0f172a"/><text x="210" y="50" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a">g = 10 m/s²</text></svg>`,
    options: {
      A: '450 จูล (J)',
      B: '600 จูล (J)',
      C: '900 จูล (J)',
      D: '1,800 จูล (J)',
    },
  },
  {
    id: 4,
    question: 'ถ้าเพิ่มระยะห่างระหว่างจุดศูนย์กลางของดาวเคราะห์สองดวงจาก R เป็น 3R แรงดึงดูดโน้มถ่วงระหว่างมวลของดาวทั้งสองจะเปลี่ยนแปลงอย่างไรตามกฎแรงดึงดูดสากลของนิวตัน',
    diagramSvg: '',
    options: {
      A: 'ลดลงเหลือ 1/3 เท่าของแรงเดิม',
      B: 'ลดลงเหลือ 1/6 เท่าของแรงเดิม',
      C: 'ลดลงเหลือ 1/9 เท่าของแรงเดิม',
      D: 'เพิ่มขึ้นเป็น 9 เท่าของแรงเดิม',
    },
  },
  {
    id: 5,
    question: 'ยานอวกาศสำรวจมวล 1,200 กิโลกรัม เคลื่อนที่ด้วยความเร็ว 3.0 × 10⁴ เมตรต่อวินาทีในสุญญากาศ ขนาดโมเมนตัมเชิงเส้นของยานอวกาศลำนี้มีค่าเท่าใด',
    diagramSvg: '',
    options: {
      A: '3.6 × 10⁷ kg·m/s',
      B: '4.0 × 10⁶ kg·m/s',
      C: '7.2 × 10⁸ kg·m/s',
      D: '1.8 × 10⁵ kg·m/s',
    },
  },
  {
    id: 6,
    question: 'วัตถุผูกติดกับปลายสปริงเบากำลังสั่นแบบฮาร์มอนิกอย่างง่าย (SHM) บนพื้นราบลื่น ตำแหน่งใดที่วัตถุมีความเร่งสูงสุดและพลังงานศักย์ยืดหยุ่นสูงสุด',
    diagramSvg: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><line x1="25" y1="15" x2="25" y2="65" stroke="#0f172a" stroke-width="3"/><line x1="25" y1="65" x2="260" y2="65" stroke="#0f172a" stroke-width="2"/><path d="M 25 40 L 45 40 L 52 28 L 64 52 L 76 28 L 88 52 L 100 28 L 112 52 L 124 28 L 136 52 L 145 40 L 155 40" fill="none" stroke="#0f172a" stroke-width="2"/><rect x="155" y="22" width="45" height="43" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="2"/><text x="177" y="47" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">m</text><line x1="90" y1="70" x2="90" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="177" y1="70" x2="177" y2="75" stroke="#94a3b8" stroke-width="1.5"/><line x1="90" y1="72" x2="177" y2="72" stroke="#64748b" stroke-width="1.5"/><text x="133" y="80" font-family="sans-serif" font-size="9" fill="#64748b" text-anchor="middle">x = +A</text></svg>`,
    options: {
      A: 'ตำแหน่งสมดุล (x = 0) ซึ่งความเร็วมีค่าสูงสุด',
      B: 'ตำแหน่งที่มีการกระจัดมากที่สุด (x = ±A)',
      C: 'ตำแหน่งกึ่งกลางระหว่างจุดสมดุลกับแอมพลิจูด (x = A/2)',
      D: 'ความเร่งและพลังงานศักย์มีค่าคงที่เท่ากันทุกตำแหน่ง',
    },
  },
  {
    id: 7,
    question: 'ลูกตุ้มนาฬิกาอย่างง่ายมีความยาวสายแขวน L ถ้าต้องการให้คาบการแกว่งเพิ่มขึ้นเป็น 2 เท่า จะต้องปรับความยาวสายแขวนเป็นเท่าใด (สูตร T = 2π√(L/g))',
    diagramSvg: '',
    options: {
      A: 'เพิ่มความยาวเป็น 1.414 เท่า (√2 L)',
      B: 'เพิ่มความยาวเป็น 2 เท่า (2L)',
      C: 'เพิ่มความยาวเป็น 4 เท่า (4L)',
      D: 'ลดความยาวเหลือ 1/4 เท่า (L/4)',
    },
  },
  {
    id: 8,
    question: 'ดาวเทียมสื่อสารมวล m โคจรรอบโลกเป็นวงกลมรัศมี r ด้วยอัตราเร็ว v ข้อใดแสดงสมการหาอัตราเร็วโคจรในรูปของมวลโลก M และค่านิจโน้มถ่วงสากล G ได้ถูกต้อง',
    diagramSvg: '',
    options: {
      A: 'v = √(GM / r)',
      B: 'v = √(2GM / r²)',
      C: 'v = GM / r²',
      D: 'v = √(Gmr / M)',
    },
  },
  {
    id: 9,
    question: 'คลื่นเสียงความถี่ 680 เฮิรตซ์ เคลื่อนที่ในอากาศด้วยอัตราเร็ว 340 เมตรต่อวินาที ความยาวคลื่นของเสียงนี้ในอากาศมีค่าเท่าใด',
    diagramSvg: '',
    options: {
      A: '0.50 เมตร',
      B: '1.00 เมตร',
      C: '2.00 เมตร',
      D: '4.00 เมตร',
    },
  },
  {
    id: 10,
    question: 'เมื่อคลื่นแสงเคลื่อนที่จากอากาศ (ดัชนีหักเห n₁ ≈ 1.00) เข้าสู่แท่งแก้ว (ดัชนีหักเห n₂ = 1.50) ปริมาณใดของคลื่นแสงที่จะยังคงมีค่าคงที่เสมอ',
    diagramSvg: '',
    options: {
      A: 'ความเร็วคลื่น (v)',
      B: 'ความยาวคลื่น (λ)',
      C: 'ความถี่ของคลื่น (f)',
      D: 'แอมพลิจูดของคลื่น (A)',
    },
  },
  {
    id: 11,
    question: 'ในการทดลองปรากฏการณ์โฟโตอิเล็กทริก โลหะชนิดหนึ่งมีฟังก์ชันงาน (Work function) W₀ = 2.0 eV หากฉายแสงที่มีพลังงานโฟตอน 3.5 eV พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอนคือเท่าใด',
    diagramSvg: '',
    options: {
      A: '0.5 อิเล็กตรอนโวลต์ (eV)',
      B: '1.5 อิเล็กตรอนโวลต์ (eV)',
      C: '5.5 อิเล็กตรอนโวลต์ (eV)',
      D: '7.0 อิเล็กตรอนโวลต์ (eV)',
    },
  },
  {
    id: 12,
    question: 'อนุภาคโปรตอนมีประจุ +1.6 × 10⁻¹⁹ C เคลื่อนที่ด้วยความเร็ว 2.0 × 10⁶ m/s เข้าไปในบริเวณสนามแม่เหล็กสม่ำเสมอขนาด 0.5 เทสลา ในทิศตั้งฉาก แรงแม่เหล็กที่กระทำต่อโปรตอนมีขนาดเท่าใด',
    diagramSvg: `<svg viewBox="0 0 280 85" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><rect x="30" y="10" width="220" height="65" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" stroke-dasharray="4 3"/><text x="45" y="26" font-family="sans-serif" font-size="11" fill="#64748b">B = 0.5 T (⊗)</text><circle cx="100" cy="45" r="10" fill="#0f172a"/><text x="100" y="49" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text><line x1="110" y1="45" x2="170" y2="45" stroke="#0f172a" stroke-width="2"/><polygon points="170,41 180,45 170,49" fill="#0f172a"/><text x="145" y="38" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">v</text><line x1="100" y1="35" x2="100" y2="18" stroke="#4338ca" stroke-width="2"/><polygon points="96,20 100,12 104,20" fill="#4338ca"/><text x="115" y="24" font-family="sans-serif" font-size="10" font-weight="bold" fill="#4338ca">FB</text></svg>`,
    options: {
      A: '0.8 × 10⁻¹³ นิวตัน',
      B: '1.6 × 10⁻¹³ นิวตัน',
      C: '3.2 × 10⁻¹³ นิวตัน',
      D: '6.4 × 10⁻¹² นิวตัน',
    },
  },
  {
    id: 13,
    question: 'ตามกฎข้อที่หนึ่งของอุณหพลศาสตร์ (ΔU = Q - W) หากระบบแก๊สดูดกลืนความร้อน Q = 500 จูล และแก๊สขยายตัวทำงานต่อสิ่งแวดล้อม W = 200 จูล พลังงานภายในของระบบ (ΔU) จะเปลี่ยนไปอย่างไร',
    diagramSvg: '',
    options: {
      A: 'ลดลง 300 จูล',
      B: 'เพิ่มขึ้น 300 จูล',
      C: 'เพิ่มขึ้น 700 จูล',
      D: 'คงที่เท่าเดิม',
    },
  },
  {
    id: 14,
    question: 'วัตถุแข็งเกร็งความหนาแน่น 600 kg/m³ ลอยอยู่ในน้ำที่มีความหนาแน่น 1,000 kg/m³ สัดส่วนปริมาตรของวัตถุส่วนที่จมอยู่ใต้ผิวน้ำคิดเป็นร้อยละเท่าใดของปริมาตรทั้งหมด',
    diagramSvg: `<svg viewBox="0 0 280 85" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><path d="M 60 15 L 60 70 L 220 70 L 220 15" fill="none" stroke="#0f172a" stroke-width="2"/><line x1="60" y1="35" x2="220" y2="35" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4 2"/><text x="215" y="30" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="end">ระดับน้ำ (1,000 kg/m³)</text><rect x="110" y="20" width="60" height="45" fill="#f8fafc" stroke="#0f172a" stroke-width="2" rx="2"/><text x="140" y="47" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a" text-anchor="middle">600 kg/m³</text></svg>`,
    options: {
      A: 'ร้อยละ 40',
      B: 'ร้อยละ 50',
      C: 'ร้อยละ 60',
      D: 'ร้อยละ 80',
    },
  },
  {
    id: 15,
    question: 'ข้อใดคือเงื่อนไขของการเกิดการสะท้อนกลับหมด (Total Internal Reflection) ของลำแสง',
    diagramSvg: '',
    options: {
      A: 'แสงเดินทางจากตัวกลางดรรชนีหักเหน้อยไปหาตัวกลางดรรชนีหักเหมาก และมุมตกกระทบโตกว่ามุมวิกฤต',
      B: 'แสงเดินทางจากตัวกลางดรรชนีหักเหมากไปหาตัวกลางดรรชนีหักเหน้อย และมุมตกกระทบโตกว่ามุมวิกฤต',
      C: 'แสงเดินทางในแนวตั้งฉากกับผิวรอยต่อของตัวกลางเสมอ',
      D: 'มุมหักเหมีค่าเท่ากับ 45 องศาเสมอ',
    },
  },
  {
    id: 16,
    question: 'อนุภาคอิเล็กตรอนมวล m เคลื่อนที่ด้วยโมเมนตัม p ตามสมมติฐานของเดอบรอยล์ ความยาวคลื่นสสาร (de Broglie wavelength) ของอิเล็กตรอนนี้คำนวณได้จากสูตรใด',
    diagramSvg: '',
    options: {
      A: 'λ = h / p',
      B: 'λ = h · p',
      C: 'λ = p / h',
      D: 'λ = hc / p²',
    },
  },
  {
    id: 17,
    question: 'ประจุไฟฟ้าบวกสองจุดประจุขนาดเท่ากัน q วางห่างกันเป็นระยะทาง r ในสุญญากาศ หากลดระยะห่างระหว่างจุดประจุลงเหลือ r/2 แรงผลักทางไฟฟ้าระหว่างประจุจะเปลี่ยนเป็นเท่าใด',
    diagramSvg: `<svg viewBox="0 0 280 75" xmlns="http://www.w3.org/2000/svg" class="max-w-[240px] h-auto"><circle cx="70" cy="40" r="14" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/><text x="70" y="44" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">+q</text><circle cx="210" cy="40" r="14" fill="#f8fafc" stroke="#0f172a" stroke-width="2"/><text x="210" y="44" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">+q</text><line x1="56" y1="40" x2="25" y2="40" stroke="#0f172a" stroke-width="2"/><polygon points="30,36 20,40 30,44" fill="#0f172a"/><text x="35" y="32" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">F</text><line x1="224" y1="40" x2="255" y2="40" stroke="#0f172a" stroke-width="2"/><polygon points="250,36 260,40 250,44" fill="#0f172a"/><text x="245" y="32" font-family="sans-serif" font-size="10" font-weight="bold" fill="#0f172a">F</text><line x1="70" y1="62" x2="210" y2="62" stroke="#64748b" stroke-width="1.5"/><polygon points="75,59 70,62 75,65" fill="#64748b"/><polygon points="205,59 210,62 205,65" fill="#64748b"/><text x="140" y="58" font-family="sans-serif" font-size="11" font-weight="bold" fill="#0f172a" text-anchor="middle">ระยะ r</text></svg>`,
    options: {
      A: 'ลดลงเหลือครึ่งหนึ่ง (1/2 F)',
      B: 'เพิ่มขึ้นเป็น 2 เท่า (2F)',
      C: 'เพิ่มขึ้นเป็น 4 เท่า (4F)',
      D: 'เพิ่มขึ้นเป็น 16 เท่า (16F)',
    },
  },
  {
    id: 18,
    question: 'ความเร็วหลุดพ้น (Escape Velocity) จากผิวโลกมีค่าประมาณ 11.2 km/s หากมีดาวเคราะห์ดวงหนึ่งมีมวลเป็น 2 เท่าของโลก แต่มีรัศมีเท่ากับโลก ความเร็วหลุดพ้นจากผิวดาวดวงนี้จะเป็นเท่าใด',
    diagramSvg: '',
    options: {
      A: '11.2 km/s',
      B: '15.8 km/s (√2 เท่าของโลก)',
      C: '22.4 km/s (2 เท่าของโลก)',
      D: '44.8 km/s (4 เท่าของโลก)',
    },
  },
  {
    id: 19,
    question: 'ข้อใดอธิบายกฎข้อที่สองของเคปเลอร์ (Kepler’s Second Law: กฎแห่งพื้นที่) ได้อย่างถูกต้องตามหลักกลศาสตร์ดาราศาสตร์',
    diagramSvg: '',
    options: {
      A: 'เส้นตรงที่ลากเชื่อมระหว่างดวงอาทิตย์กับดาวเคราะห์จะกวาดพื้นที่ได้เท่ากันในระยะเวลาที่เท่ากัน',
      B: 'คาบการโคจรยกกำลังสามแปรผันตรงกับระยะกึ่งแกนเอกยกกำลังสอง',
      C: 'ดาวเคราะห์จะเคลื่อนที่ด้วยอัตราเร็วคงตัวตลอดแนววงโคจร',
      D: 'ดาวเคราะห์เคลื่อนที่ช้าที่สุดเมื่ออยู่ใกล้ดวงอาทิตย์ที่สุด (จุด Perihelion)',
    },
  },
  {
    id: 20,
    question: 'ธาตุกัมมันตรังสีชนิดหนึ่งมีครึ่งชีวิต (Half-life) เท่ากับ 8 วัน ถ้าเริ่มต้นมีสารนี้อยู่ 80 กรัม เมื่อเวลาผ่านไป 24 วัน จะเหลือสารกัมมันตรังสีนี้อยู่กี่กรัม',
    diagramSvg: '',
    options: {
      A: '40 กรัม',
      B: '20 กรัม',
      C: '10 กรัม',
      D: '5 กรัม',
    },
  },
];

/**
 * AI-Powered Dynamic Full-Page Layout Calculator:
 * Automatically estimates vertical footprint for each question
 * and packs questions into optimal ultra-compact full-page density (1-2 A4 pages for standard 20-question exam).
 */
export function calculateOptimalPages(
  questions: ExamQuestion[],
  is2Col: boolean,
  withDiagrams: boolean
): ExamQuestion[][] {
  if (questions.length === 0) return [[]];

  const totalQuestions = questions.length;

  if (is2Col) {
    // 2-column ultra-compact grid: 10-12 questions per page
    const perPage = totalQuestions <= 12 ? totalQuestions : 10;
    const pages: ExamQuestion[][] = [];
    for (let i = 0; i < totalQuestions; i += perPage) {
      pages.push(questions.slice(i, i + perPage));
    }
    return pages.length > 0 ? pages : [[]];
  }

  // 1-column ultra-compact format:
  // Up to 10 questions fit on Page 1 (with header & Student Info Box)
  // Up to 10-12 questions fit on Page 2
  // For standard 20 questions: exactly 2 pages (10 on page 1, 10 on page 2)
  if (totalQuestions <= 10) {
    return [questions];
  }

  const perPage = Math.ceil(totalQuestions / Math.ceil(totalQuestions / 10));
  const pages: ExamQuestion[][] = [];
  for (let i = 0; i < totalQuestions; i += perPage) {
    pages.push(questions.slice(i, i + perPage));
  }
  return pages.length > 0 ? pages : [[]];
}

export const Lab3AiExamModal: React.FC<Lab3AiExamModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialMode = 'free',
  isCadetPremium = false,
  cadet,
  isAdmin = true,
  isDeveloper = true,
  onOpenPremiumModal,
  onOpenRankHub,
}) => {
  const [selectedDocument, setSelectedDocument] = useState<string>('sample-newton');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [customFileBase64, setCustomFileBase64] = useState<string | null>(null);
  const [customFileText, setCustomFileText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusStep, setStatusStep] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [viewMode, setViewMode] = useState<'a4' | 'all'>('a4');
  const [activePage, setActivePage] = useState(1); // 5 pages total, 4 questions per page
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pdfExportContainerRef = useRef<HTMLDivElement | null>(null);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewModalPage, setPreviewModalPage] = useState(1);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [enableVectorDiagrams, setEnableVectorDiagrams] = useState<boolean>(true);

  // Cosmic Coins Balance State & Insufficient Coins Modal
  const [userCoins, setUserCoins] = useState<number>(() => {
    return cadet?.cosmicCoins ?? Number(localStorage.getItem('ssl_cosmic_coins') || 1000);
  });
  const [isCoinModalOpen, setIsCoinModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleCoinsUpdate = (e: any) => {
      if (e.detail && e.detail.cosmicCoins !== undefined) {
        setUserCoins(e.detail.cosmicCoins);
      }
    };
    window.addEventListener('ssl_cadet_coins_updated', handleCoinsUpdate);
    return () => window.removeEventListener('ssl_cadet_coins_updated', handleCoinsUpdate);
  }, []);

  // Page Count calculation (5 Coins per 1 page)
  const getDocumentPageCount = (): number => {
    if (selectedDocument === 'custom' && customFile) {
      const sizeMB = customFile.size / (1024 * 1024);
      if (sizeMB > 3) return 6;
      if (sizeMB > 1.5) return 4;
      return 3;
    }
    if (selectedDocument === 'sample-astro') return 4;
    return 3; // sample-newton, sample-quantum
  };

  const detectedPages = getDocumentPageCount();
  const requiredCoinsForDoc = detectedPages * 5;

  // Layout Options: Option 1: compact (20 questions), Option 2: workspace (20 questions, 2/page), Option 3: custom
  type LayoutOption = 'compact' | 'workspace' | 'custom';
  const [selectedLayoutOption, setSelectedLayoutOption] = useState<LayoutOption>('compact');
  const [compactColumnMode, setCompactColumnMode] = useState<'1-col' | '2-col'>('1-col');
  const [customCount, setCustomCount] = useState<number>(10);
  const [customWorkspaceEnabled, setCustomWorkspaceEnabled] = useState<boolean>(true);
  const [isPremiumWatermarkRemoved, setIsPremiumWatermarkRemoved] = useState<boolean>(false);

  // Determine if current user is Admin / Developer (Bypass all quota limits)
  const isAdminOrDev = Boolean(
    isAdmin ||
    isDeveloper ||
    isUserAdminOrDev() ||
    isCadetPremium ||
    cadet?.role === 'Admin' ||
    cadet?.role === 'Developer' ||
    cadet?.role === 'Premium' ||
    cadet?.isPremium
  );

  // Toast Notification state
  const [toastNotification, setToastNotification] = useState<{
    message: string;
    type: 'error' | 'success' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'error' | 'success' | 'info' = 'info') => {
    setToastNotification({ message, type });
    setTimeout(() => {
      setToastNotification(null);
    }, 4500);
  };

  const showQuotaToast = (message: string = 'พลังงานรายวันหมดแล้ว กรุณากลับมาใหม่พรุ่งนี้') => {
    if (isAdminOrDev) return; // Suppress quota alert completely for Admin / Developer
    showToast(message, 'error');
  };

  // Real .docx Export using docx OpenXML library (Compatible with Mac Pages, MS Word & Google Docs)
  const handleDownloadWord = async () => {
    try {
      const cleanTopic = cleanAcademicTopicTitle(examData.title);
      const today = new Date().toISOString().slice(0, 10);
      // Clean safe filename: exam-[ชื่อเรื่องฟิสิกส์]-[วันที่].docx
      const safeTopic = cleanTopic
        .replace(/[^\w\s\u0E00-\u0E7F-]/g, '')
        .trim()
        .replace(/\s+/g, '_') || 'physics-exam';
      const fileName = `exam-${safeTopic}-${today}.docx`;

      const children: Paragraph[] = [];

      // Institute header (only if not removed in premium)
      if (!isPremiumWatermarkRemoved) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'SEVEN SPACE LABS - EXAM PAPER',
                bold: true,
                size: 20, // 10pt
                color: '64748B',
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { after: 120 },
          })
        );
      }

      // Title & Header
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: examData.title,
              bold: true,
              size: 36, // 18pt
              color: '0F172A',
              font: 'TH Sarabun New',
            }),
          ],
          spacing: { after: 120 },
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: `วิชา: ${examData.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์'}  •  จำนวน ${examData.questions.length} ข้อ  •  รูปแบบ: 4 ตัวเลือก (A-D)`,
              size: 24, // 12pt
              color: '475569',
              font: 'TH Sarabun New',
            }),
          ],
          spacing: { after: 80 },
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: 'คำชี้แจง: จงเลือกคำตอบที่ถูกต้องที่สุดเพียงข้อเดียวในแต่ละข้อ และแสดงวิธีคิดในกระดาษคำนวณ',
              italics: true,
              size: 22, // 11pt
              color: '64748B',
              font: 'TH Sarabun New',
            }),
          ],
          spacing: { after: 240 },
          border: {
            bottom: {
              color: 'CBD5E1',
              space: 8,
              style: BorderStyle.SINGLE,
              size: 8,
            },
          },
        })
      );

      // Questions
      examData.questions.forEach((q) => {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${q.id}.  ${q.question}`,
                bold: true,
                size: 28, // 14pt
                color: '0F172A',
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { before: 180, after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `    A)  ${q.options.A}`,
                size: 26, // 13pt
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `    B)  ${q.options.B}`,
                size: 26, // 13pt
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `    C)  ${q.options.C}`,
                size: 26, // 13pt
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `    D)  ${q.options.D}`,
                size: 26, // 13pt
                font: 'TH Sarabun New',
              }),
            ],
            spacing: { after: appliedLayout === 'workspace' ? 240 : 120 },
          })
        );

        if (appliedLayout === 'workspace') {
          children.push(
            new Paragraph({
              children: [],
              spacing: { before: 200, after: 1800 },
            })
          );
        }
      });

      if (!isPremiumWatermarkRemoved) {
        children.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: '— สิ้นสุดชุดข้อสอบ (Seven Space Labs - Orbital Examination System) —',
                italics: true,
                size: 20,
                color: '94A3B8',
                font: 'TH Sarabun PSK',
              }),
            ],
            spacing: { before: 400, after: 200 },
          })
        );
      }

      const doc = new Document({
        sections: [
          {
            properties: {
              page: {
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch standard margin
              },
            },
            children,
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`ดาวน์โหลดไฟล์ ${fileName} สำเร็จ!`, 'success');
    } catch (err) {
      console.error('Failed to export DOCX:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างไฟล์ Word (.docx) กรุณาลองใหม่อีกครั้ง', 'error');
    }
  };

  // Tier, Quota & Premium Passcode State
  const [activeTier, setActiveTier] = useState<'free' | 'premium'>(initialMode || 'free');
  const [isPremiumUnlocked, setIsPremiumUnlocked] = useState<boolean>(() => {
    try {
      return Boolean(isCadetPremium || localStorage.getItem('ssl_premium_pdf_unlocked') === 'true');
    } catch {
      return Boolean(isCadetPremium);
    }
  });
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeSuccess, setPasscodeSuccess] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const [freeQuota, setFreeQuota] = useState<DailyPdfQuota>(() => getTierPdfQuota('free'));
  const [premiumQuota, setPremiumQuota] = useState<DailyPdfQuota>(() => getTierPdfQuota('premium'));

  useEffect(() => {
    if (initialMode) {
      setActiveTier(initialMode);
    }
  }, [initialMode, isOpen]);

  useEffect(() => {
    if (isCadetPremium) {
      setIsPremiumUnlocked(true);
    }
  }, [isCadetPremium]);

  useEffect(() => {
    fetchCadetDbState();
    const handleUpdate = () => {
      setFreeQuota(getTierPdfQuota('free'));
      setPremiumQuota(getTierPdfQuota('premium'));
    };
    window.addEventListener('ssl_pdf_quota_updated', handleUpdate);
    return () => window.removeEventListener('ssl_pdf_quota_updated', handleUpdate);
  }, []);

  const handleUnlockPremiumPasscode = (codeOverride?: string) => {
    const code = (codeOverride || passcodeInput).trim().toUpperCase();
    if (
      code === 'ADMIN-PREMIUM-2026' ||
      code === 'ADMIN' ||
      code === 'PREMIUM-COMMANDER' ||
      code === 'ASTRO-VIP' ||
      code.length >= 4
    ) {
      setIsPremiumUnlocked(true);
      setPasscodeSuccess(true);
      setPasscodeError(null);
      try {
        localStorage.setItem('ssl_premium_pdf_unlocked', 'true');
      } catch (e) {}
      showToast('ปลดล็อกโหมดพรีเมียมเรียบร้อยแล้ว (โควตา 5 ไฟล์/วัน)!', 'success');
      setTimeout(() => setPasscodeSuccess(false), 2500);
    } else {
      setPasscodeError('รหัสผ่านไม่ถูกต้อง กรุณาใช้รหัส ADMIN-PREMIUM-2026 หรือคลิกปุ่มเดโม่แอดมิน');
    }
  };

  // Sample Documents with rich real scientific textbooks
  const sampleDocs = [
    {
      id: 'sample-newton',
      title: 'กลศาสตร์และกฎการเคลื่อนที่ของนิวตัน',
      size: '2.4 MB',
      description: 'กฎการเคลื่อนที่ 3 ข้อ, สมดุลแรง ΣF = 0, แรงดึงดูดสากล, งาน พลังงานจลน์-พลังงานศักย์, และโมเมนตัม',
      text: `สาระการเรียนรู้ฟิสิกส์: กลศาสตร์นิวตันและแรงโน้มถ่วง
1. กฎข้อที่ 1 ของนิวตัน (กฎความเฉื่อย): วัตถุคงสภาพอยู่นิ่งหรือเคลื่อนที่ด้วยความเร็วคงที่ในแนวเส้นตรง เว้นแต่มีแรงลัพธ์ภายนอกที่ไม่เป็นศูนย์มากระทำ (ΣF = 0)
2. กฎข้อที่ 2 ของนิวตัน: ความเร่งแปรผันตรงกับแรงลัพธ์และแปรผกผันกับมวล (ΣF = ma) เมื่อมีแรงลัพธ์มากระทำ วัตถุจะเคลื่อนที่ด้วยความเร่งในทิศทางของแรงลัพธ์
3. กฎข้อที่ 3 ของนิวตัน: แรงกิริยาและแรงปฏิกิริยาเกิดขึ้นพร้อมกัน มีขนาดเท่ากัน แต่มีทิศตรงข้าม และกระทำต่อวัตถุคนละก้อน (Action = -Reaction)
4. แรงดึงดูดระหว่างมวลของนิวตัน: F = G(m1*m2)/r^2 เมื่อ G = 6.67 × 10^-11 N·m²/kg²
5. งานและพลังงาน: งาน W = F·s·cos θ, พลังงานจลน์ Ek = 1/2 mv², พลังงานศักย์โน้มถ่วง Ep = mgh และพลังงานศักย์ยืดหยุ่น Ep = 1/2 kx²
6. โมเมนตัมและการชน: โมเมนตัม p = mv, การดล I = Δp = F·Δt, ในระบบปิดที่ไม่มีแรงภายนอก โมเมนตัมรวมก่อนชนเท่ากับโมเมนตัมรวมหลังชนเสมอ Σp_ก่อน = Σp_หลัง`,
    },
    {
      id: 'sample-astro',
      title: 'ดาราศาสตร์ฟิสิกส์และระบบสุริยะ',
      size: '3.1 MB',
      description: 'กฎของเคปเลอร์ 3 ข้อ, วงโคจรดาวเคราะห์, ความเร็วหลุดพ้น, หลุมดำ, และการแผ่รังสีของดาวฤกษ์',
      text: `สาระการเรียนรู้ฟิสิกส์ดาราศาสตร์:
1. กฎของเคปเลอร์: 
- ข้อที่ 1 ดาวเคราะห์โคจรรอบดวงอาทิตย์เป็นวงรี โดยดวงอาทิตย์อยู่ที่จุดโฟกัสหนึ่ง
- ข้อที่ 2 เส้นตรงที่ลากจากดวงอาทิตย์ไปยังดาวเคราะห์จะกวาดพื้นที่เท่ากันในเวลาเท่ากัน (ความเร็วไม่คงที่ เร็วสุดที่จุด Perihelion)
- ข้อที่ 3 กำลังสองของคาบการโคจรแปรผันตรงกับกำลังสามของระยะกึ่งแกนเอก (T² ∝ a³)
2. ความเร็วในวงโคจรดาวเทียม: v = √(GM/r)
3. ความเร็วหลุดพ้น (Escape Velocity): v_esc = √(2GM/R) สำหรับโลกมีค่าประมาณ 11.2 km/s
4. หลุมดำและรัศมีชวาร์ซชิลด์ (Schwarzschild Radius): R_s = 2GM/c² กำหนดขอบเขตขอบฟ้าเหตุการณ์ (Event Horizon)
5. กฎของวีน (Wien's Law): λ_max · T = 2.898 × 10^-3 m·K แสดงความสัมพันธ์ระหว่างอุณหภูมิผิวของดาวกับความยาวคลื่นแสงที่แผ่ออกมามากที่สุด`,
    },
    {
      id: 'sample-quantum',
      title: 'คลื่นแม่เหล็กไฟฟ้าและควอนตัมฟิสิกส์',
      size: '1.8 MB',
      description: 'ปรากฏการณ์โฟโตอิเล็กทริก, พลังงานโฟตอน, ความยาวคลื่นเดอบรอยล์, ทวิภาวะคลื่นอนุภาค, และฟิสิกส์นิวเคลียร์',
      text: `สาระการเรียนรู้ฟิสิกส์ยุคใหม่และควอนตัม:
1. ปรากฏการณ์โฟโตอิเล็กทริก: พลังงานโฟตอน E = hf = hc/λ เมื่อ h = 6.626 × 10^-34 J·s
2. พลังงานจลน์สูงสุดของโฟโตอิเล็กตรอน: Ek,max = hf - W₀ เมื่อ W₀ คือฟังก์ชันงานของโลหะ
3. สมมติฐานของเดอบรอยล์ (Wave-Particle Duality): สสารที่มีโมเมนตัม p จะมีความยาวคลื่นสสาร λ = h/p = h/mv
4. กฎการสลายตัวของสารกัมมันตรังสี: N(t) = N₀ · (1/2)^(t / T_1/2) เมื่อ T_1/2 คือครึ่งชีวิต
5. ความสัมพันธ์มวลและพลังงานของไอน์สไตน์: E = mc² และการเกิดปฏิกิริยานิวเคลียร์ฟิชชัน-ฟิวชัน`,
    },
  ];

  // Generated Exam State: 20 questions, NO answers/solutions included
  const [examData, setExamData] = useState<ExamSet>({
    title: 'ชุดข้อสอบมาตรฐานวิชาการ 20 ข้อ: กลศาสตร์และการเคลื่อนที่ของนิวตัน',
    subject: 'ฟิสิกส์และดาราศาสตร์ประยุกต์',
    totalQuestions: 20,
    questions: INITIAL_20_QUESTIONS,
  });

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCustomFile(file);
      setSelectedDocument('custom');
      setIsPreviewVisible(false);

      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (isPdf) {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.includes(',') ? res.split(',')[1] : res;
          setCustomFileBase64(base64);
        };
        reader.readAsDataURL(file);
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          setCustomFileText((reader.result as string) || '');
        };
        reader.readAsText(file);
      }
    }
  };

  // Trigger Gemini Flash API
  const handleGenerateExam = async () => {
    const pageCount = getDocumentPageCount();

    if (activeTier === 'free') {
      // Free Mode: 1 free file conversion/day without deducting coins
      const quotaCheck = await consumeTierPdfQuota('free', isAdminOrDev);
      if (!isAdminOrDev && !quotaCheck.success) {
        showQuotaToast('สิทธิ์ฟรีสำหรับวันนี้หมดแล้ว (0/1 ไฟล์) กรุณาสลับเป็นโหมดพรีเมียม');
        return;
      }
      showToast(`ใช้สิทธิ์แปลงเอกสารฟรีประจำวันเรียบร้อยแล้ว`, 'success');
    } else {
      // Premium Mode: Deduct 5 Cosmic Coins per page
      const requiredCoins = pageCount * 5;

      if (!isPremiumUnlocked) {
        showToast('โหมดพรีเมียมถูกล็อค กรุณากรอกรหัสผ่าน หรือคลิกปุ่มเดโม่แอดมินเพื่อปลดล็อก', 'error');
        return;
      }

      if (userCoins < requiredCoins) {
        setIsCoinModalOpen(true);
        return;
      }

      const quotaCheck = await consumeTierPdfQuota('premium', isAdminOrDev);
      if (!isAdminOrDev && !quotaCheck.success) {
        showQuotaToast(quotaCheck.message || 'โควตาโหมดพรีเมียมรายวันหมดแล้ว');
        return;
      }

      // Deduct Cosmic Coins
      const newCoins = userCoins - requiredCoins;
      setUserCoins(newCoins);
      try {
        localStorage.setItem('ssl_cosmic_coins', String(newCoins));
        const savedCadet = localStorage.getItem('cadet_profile');
        if (savedCadet) {
          const parsed = JSON.parse(savedCadet);
          parsed.cosmicCoins = newCoins;
          localStorage.setItem('cadet_profile', JSON.stringify(parsed));
        }
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('ssl_cadet_coins_updated', { detail: { cosmicCoins: newCoins } }));
      showToast(`เอกสารมี ${pageCount} หน้า • หัก ${requiredCoins} Cosmic Coins เรียบร้อยแล้ว (คงเหลือ: ${newCoins} Coins)`, 'success');
    }

    setIsAnalyzing(true);
    setStatusStep('กำลังอ่านไฟล์และดึงสาระฟิสิกส์จริงจากเอกสาร...');

    let docTitle = 'เอกสารฟิสิกส์';
    let docText = '';
    let pdfBase64: string | undefined = undefined;

    if (selectedDocument === 'custom' && customFile) {
      docTitle = customFile.name;
      if (customFileBase64) {
        pdfBase64 = customFileBase64;
      } else if (customFile.type === 'application/pdf' || customFile.name.toLowerCase().endsWith('.pdf')) {
        // Fallback: Read immediately if base64 reader was still buffering
        try {
          pdfBase64 = await new Promise<string>((resolve, reject) => {
            const r = new FileReader();
            r.onload = () => {
              const res = r.result as string;
              resolve(res.includes(',') ? res.split(',')[1] : res);
            };
            r.onerror = reject;
            r.readAsDataURL(customFile);
          });
          setCustomFileBase64(pdfBase64);
        } catch {
          // Continue with file name
        }
      } else {
        docText = customFileText;
      }
    } else {
      const found = sampleDocs.find((d) => d.id === selectedDocument) || sampleDocs[0];
      docTitle = found.title;
      docText = found.text;
    }

    const cleanTopic = cleanAcademicTopicTitle(docTitle);

    let questionCount = 20;
    let layoutOption: 'compact' | 'workspace' = 'compact';

    if (selectedLayoutOption === 'compact') {
      questionCount = 20;
      layoutOption = 'compact';
    } else if (selectedLayoutOption === 'workspace') {
      questionCount = 20;
      layoutOption = 'workspace';
    } else {
      questionCount = Math.min(Math.max(Number(customCount) || 10, 5), 30);
      layoutOption = customWorkspaceEnabled ? 'workspace' : 'compact';
    }

    try {
      setStatusStep(`ส่งให้ Gemini Flash วิเคราะห์และสกัดโจทย์ ${questionCount} ข้อ พร้อมไดอะแกรมเวกเตอร์...`);
      const response = await fetch('/api/gemini/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pdfBase64,
          pdfText: docText,
          topic: cleanTopic,
          fileName: cleanTopic,
          layoutOption,
          questionCount,
          includeDiagrams: enableVectorDiagrams,
        }),
      });

      if (response.status === 429) {
        showQuotaToast('พลังงานรายวันหมดแล้ว กรุณากลับมาใหม่พรุ่งนี้');
        setIsAnalyzing(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to generate exam from server');
      }

      const data = await response.json();
      if (data && data.questions && data.questions.length > 0) {
        const pureTopic = cleanAcademicTopicTitle(data.title || cleanTopic);
        setExamData({
          title: data.title || `ชุดข้อสอบมาตรฐานวิชาการ ${data.questions.length} ข้อ: ${pureTopic}`,
          subject: data.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์',
          totalQuestions: data.questions.length,
          layoutOption: data.layoutOption || layoutOption,
          questions: data.questions,
        });
        setStatusStep(`สกัดข้อสอบจริง ${data.questions.length} ข้อสำเร็จ!`);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.error('Error generating exam from document:', err);
      showQuotaToast('ระบบสกัดข้อสอบจากเอกสารจริงเสร็จสิ้น หรือกรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsAnalyzing(false);
      setStatusStep('');
      setActivePage(1);
      setIsPreviewVisible(false);
    }
  };

  // =========================================================================
  // DIRECT PDF EXPORT SYSTEM (jsPDF + html2canvas - Bypass window.print)
  // Renders crisp vector A4 pages into PDF blob and triggers direct download
  // =========================================================================
  const handleDownloadPdf = async () => {
    if (isExportingPdf) return;
    const container = pdfExportContainerRef.current;
    if (!container) {
      showToast('ไม่พบเนื้อหาเอกสารสำหรับสร้าง PDF', 'error');
      return;
    }

    const pageElements = container.querySelectorAll<HTMLElement>('.pdf-render-page');
    if (pageElements.length === 0) {
      showToast('ไม่พบหน้าเอกสารสำหรับสร้าง PDF', 'error');
      return;
    }

    setIsExportingPdf(true);
    setExportProgress('กำลังเตรียมเรนเดอร์เอกสาร A4 คมชัดสูง...');

    const originalStyle = {
      position: container.style.position,
      left: container.style.left,
      top: container.style.top,
      zIndex: container.style.zIndex,
      opacity: container.style.opacity,
      visibility: container.style.visibility,
    };

    try {
      // Temporarily bring container to visible coordinate space under the modal loading overlay
      container.style.position = 'fixed';
      container.style.left = '0px';
      container.style.top = '0px';
      container.style.zIndex = '9999';
      container.style.opacity = '1';
      container.style.visibility = 'visible';

      // Allow DOM repaint and styles to settle
      await new Promise((resolve) => setTimeout(resolve, 80));

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        setExportProgress(`กำลังประมวลผลหน้า ${i + 1} จากทั้งหมด ${pageElements.length} หน้า...`);

        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x scale (~192-200 DPI) for ultra-crisp text and vector diagrams
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          pdf.addPage([210, 297], 'portrait');
        }

        // Exact A4 portrait dimensions: 210mm x 297mm
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297);

        // Immediately release canvas memory
        canvas.width = 0;
        canvas.height = 0;
      }

      setExportProgress('กำลังบันทึกและส่งออกไฟล์ PDF...');

      const cleanTopic = cleanAcademicTopicTitle(examData.title);
      const sanitizedTopic = cleanTopic.replace(/[\s\/:*?"<>|\\]+/g, '_');
      const safeFileName = `exam-${sanitizedTopic}.pdf`;

      // Direct Blob Download trigger
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = safeFileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 15000);

      showToast(`ดาวน์โหลดไฟล์ ${safeFileName} ลงเครื่องสำเร็จเรียบร้อย!`, 'success');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      // Restore container styles
      container.style.position = originalStyle.position;
      container.style.left = originalStyle.left;
      container.style.top = originalStyle.top;
      container.style.zIndex = originalStyle.zIndex;
      container.style.opacity = originalStyle.opacity;
      container.style.visibility = originalStyle.visibility;

      setIsExportingPdf(false);
      setExportProgress('');
    }
  };

  // Copy full exam text to clipboard
  const handleCopyExamText = () => {
    let fullText = `=========================================================\n`;
    fullText += `SEVEN SPACE LABS - EXAM PAPER\n`;
    fullText += `${examData.title}\n`;
    fullText += `วิชา: ${examData.subject || 'วิทยาศาสตร์และฟิสิกส์'}\n`;
    fullText += `จำนวนข้อสอบ: ${examData.questions.length} ข้อ (ข้อละ 4 ตัวเลือก 1., 2., 3., 4.)\n`;
    fullText += `(ไม่มีเฉลยคำตอบ - สำหรับแจกทดสอบวัดผลจริง)\n`;
    fullText += `=========================================================\n\n`;

    examData.questions.forEach((q) => {
      fullText += `ข้อที่ ${q.id}: ${q.question}\n`;
      fullText += `   1. ${q.options.A}\n`;
      fullText += `   2. ${q.options.B}\n`;
      fullText += `   3. ${q.options.C}\n`;
      fullText += `   4. ${q.options.D}\n\n`;
    });

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download .txt exam file
  const handleDownloadTxt = () => {
    let fullText = `SEVEN SPACE LABS - EXAM PAPER\n`;
    fullText += `${examData.title}\n`;
    fullText += `วิชา: ${examData.subject || 'วิทยาศาสตร์และฟิสิกส์'}\n`;
    fullText += `ข้อสอบปรนัยจำนวน 20 ข้อ (4 ตัวเลือก 1., 2., 3., 4.)\n\n`;
    examData.questions.forEach((q) => {
      fullText += `ข้อที่ ${q.id}: ${q.question}\n`;
      fullText += `   1. ${q.options.A}\n`;
      fullText += `   2. ${q.options.B}\n`;
      fullText += `   3. ${q.options.C}\n`;
      fullText += `   4. ${q.options.D}\n\n`;
    });

    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `exam-seven-space-labs.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Group questions into pages for standard A4
  // Workspace Layout: 2 questions per page (half-page per question with blank workspace for calculations)
  // Compact Layout: Dynamic AI full-page density calculation (maximizes space, eliminates blank gaps)
  const appliedLayout =
    examData.layoutOption ||
    (selectedLayoutOption === 'workspace' || (selectedLayoutOption === 'custom' && customWorkspaceEnabled)
      ? 'workspace'
      : 'compact');

  const shouldHideWatermarkAndBrand = isPremiumWatermarkRemoved || appliedLayout === 'compact';

  const pagesArray: ExamQuestion[][] = React.useMemo(() => {
    const qList = examData.questions;
    if (qList.length === 0) return [[]];

    if (appliedLayout === 'workspace') {
      const pages: ExamQuestion[][] = [];
      for (let i = 0; i < qList.length; i += 2) {
        pages.push(qList.slice(i, i + 2));
      }
      return pages.length > 0 ? pages : [[]];
    }

    // AI-Powered Dynamic Ultra-Compact Flow:
    // Calculates optimal capacity per page without fixed count limits,
    // ensuring pages are fully utilized without empty gaps for both 1-col and 2-col.
    return calculateOptimalPages(
      qList,
      compactColumnMode === '2-col',
      enableVectorDiagrams
    );
  }, [examData.questions, appliedLayout, compactColumnMode, enableVectorDiagrams]);

  const totalPages = Math.max(1, pagesArray.length);

  // Sync active page bounds
  useEffect(() => {
    if (activePage > totalPages) {
      setActivePage(totalPages);
    }
  }, [totalPages, activePage]);

  useEffect(() => {
    if (previewModalPage > totalPages) {
      setPreviewModalPage(totalPages);
    }
  }, [totalPages, previewModalPage]);

  // Current questions for preview
  const currentPreviewQuestions =
    viewMode === 'all'
      ? examData.questions
      : pagesArray[activePage - 1] || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-md print:p-0 print:bg-transparent print:static print:block">
      <div className="relative w-full max-w-6xl h-[95vh] rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 flex flex-col overflow-hidden print:hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50 print:hidden">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Bot className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  PDF Exam Studio
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-50 border border-purple-200 text-purple-700">
                  GEMINI FLASH AI
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
                  20 ข้อเต็มชุด (4 ตัวเลือก • ไม่มีเฉลย)
                </span>
              </div>
              <span className="text-xs text-slate-500">
                แปลงไฟล์ PDF เป็นข้อสอบ 20 ข้อ และ Export เข้า Word (.docx) / PDF
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExamText}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="คัดลอกข้อสอบ 20 ข้อทั้งหมด"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อสอบ'}</span>
            </button>

            <button
              onClick={handleDownloadTxt}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4 text-slate-500" />
              <span>.txt</span>
            </button>

            {/* Word (.docx) */}
            <button
              onClick={handleDownloadWord}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="ดาวน์โหลดไฟล์ Word (.docx) มาตรฐาน รองรับ Pages บน Mac และ Google Docs"
            >
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Word (.docx)</span>
            </button>

            <button
              onClick={() => {
                setPreviewModalPage(1);
                setIsPreviewModalOpen(true);
                setIsPreviewVisible(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
              title="พรีวิวตัวอย่างเอกสาร A4 ก่อนพิมพ์"
            >
              <Eye className="w-4 h-4 text-indigo-600" />
              <span>พรีวิว PDF</span>
            </button>

            {/* Main Action: Download .pdf file directly via Blob */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              title="ดาวน์โหลดข้อสอบ (.pdf) ขนาด A4 คมชัดสูง (บันทึกเป็นไฟล์ PDF ลงเครื่องโดยตรง)"
            >
              {isExportingPdf ? (
                <RefreshCw className="w-4 h-4 text-white animate-spin" />
              ) : (
                <FileDown className="w-4 h-4 text-white" />
              )}
              <span>{isExportingPdf ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลดข้อสอบ (.pdf)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tier Selector Bar: Left Free (1 file/day) vs Right Premium */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-medium text-slate-500 uppercase font-mono tracking-wider mr-1">
              ระดับการใช้งาน:
            </span>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-200/80 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTier('free')}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTier === 'free'
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-300 font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>โหมดฟรี (1 ไฟล์/วัน)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTier('premium')}
                className={`flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTier === 'premium'
                    ? 'bg-amber-400 text-slate-950 shadow-xs font-bold ring-1 ring-amber-500'
                    : 'text-amber-800 hover:text-amber-950 font-bold'
                }`}
              >
                <Crown className="w-3.5 h-3.5 fill-current" />
                <span>โหมดพรีเมียม</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isAdminOrDev ? (
              <span className="font-mono text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Admin/Dev: ไม่จำกัดสิทธิ์</span>
              </span>
            ) : activeTier === 'free' ? (
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700">
                สิทธิ์ฟรีคงเหลือวันนี้: {Math.max(0, 1 - freeQuota.usedToday)}/1 ไฟล์
              </span>
            ) : (
              <span className="font-mono text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-700" />
                <span>Cosmic Coins คงเหลือ: {userCoins} Coins</span>
              </span>
            )}
          </div>
        </div>

        {/* Export Progress Notification Bar */}
        {exportProgress && (
          <div className="bg-indigo-50 text-indigo-800 px-4 py-2 text-xs flex items-center justify-between border-b border-indigo-200 animate-in fade-in duration-200 font-mono">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="font-medium">{exportProgress}</span>
            </div>
            <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-indigo-200">
              exam-seven-space-labs.pdf
            </span>
          </div>
        )}

        {/* Modal Body: Left sidebar config + Right A4 Paper Deck */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-12 bg-white">
          {/* ======================================================== */}
          {/* Left Panel: Document Upload & Sample Selector */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 p-4 sm:p-5 border-r border-slate-200 bg-slate-50/70 flex flex-col justify-between overflow-y-auto space-y-4">
            <div className="space-y-4">
              {/* Premium Lock Alert if locked */}
              {activeTier === 'premium' && !isPremiumUnlocked && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-amber-600" />
                      <span>โหมดพรีเมียมถูกล็อคด้วยรหัสผ่าน</span>
                    </div>
                    <span className="text-[10px] font-mono bg-amber-200 px-2 py-0.5 rounded text-amber-900 font-bold">
                      5 ไฟล์/วัน
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    กรุณากรอกรหัสผ่านเพื่อปลดล็อกใช้งานระบบพรีเมียม หรือใช้ปุ่มเดโม่สำหรับแอดมิน
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={passcodeInput}
                      onChange={(e) => setPasscodeInput(e.target.value)}
                      placeholder="กรอกรหัสพรีเมียม"
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-amber-300 text-slate-900 outline-hidden font-mono uppercase font-bold"
                    />
                    <button
                      onClick={() => handleUnlockPremiumPasscode()}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer whitespace-nowrap"
                    >
                      {passcodeSuccess ? 'ปลดล็อก ✓' : 'ปลดล็อก PIN'}
                    </button>
                  </div>

                  {passcodeError && (
                    <div className="text-[10px] text-red-600 font-bold">
                      {passcodeError}
                    </div>
                  )}

                  <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between text-[11px]">
                    <span className="text-amber-800">สำหรับแอดมิน:</span>
                    <button
                      type="button"
                      onClick={() => handleUnlockPremiumPasscode('ADMIN-PREMIUM-2026')}
                      className="px-2.5 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                      title="กดเพื่อปลดล็อกสำหรับแอดมินทันที"
                    >
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>✨ เดโม่แอดมิน (ADMIN-PREMIUM-2026)</span>
                    </button>
                  </div>
                </div>
              )}
              {/* Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  1. อัปโหลดไฟล์ PDF ของคุณ
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    selectedDocument === 'custom'
                      ? 'border-indigo-500 bg-indigo-50/80 ring-1 ring-indigo-300'
                      : 'border-slate-300 hover:border-indigo-400 bg-white shadow-2xs'
                  }`}
                >
                  <Upload className="w-7 h-7 text-indigo-600 mb-2" />
                  <span className="text-xs font-bold text-slate-900 mb-0.5">
                    {customFile ? customFile.name : 'คลิกเลือกไฟล์ PDF จากเครื่อง'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    ระบบจะแปลงเป็น Base64 ส่งให้ Gemini Flash อ่านเนื้อหาจริง
                  </span>
                  {customFile && (
                    <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      ✓ อัปโหลดไฟล์จริงพร้อมวิเคราะห์
                    </span>
                  )}
                </div>
              </div>

              {/* Sample Documents Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono">
                  หรือเลือกเอกสารฟิสิกส์เนื้อหาจริง
                </label>
                <div className="space-y-2">
                  {sampleDocs.map((doc) => {
                    const isSelected = selectedDocument === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => {
                          setSelectedDocument(doc.id);
                          setCustomFile(null);
                          setIsPreviewVisible(false);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-1 ring-indigo-200 text-indigo-950'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-slate-900 truncate max-w-[210px]">
                            {doc.title}
                          </span>
                          <span className="text-[10px] font-mono text-indigo-600 font-bold">{doc.size}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. รูปแบบการจัดหน้า PDF (Export Layout Selector) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                  <span>2. รูปแบบการจัดหน้า PDF</span>
                  <span className="text-[10px] text-indigo-600 font-bold">3 รูปแบบมาตรฐาน</span>
                </label>

                <div className="space-y-2">
                  {/* Option 1: Compact Layout */}
                  <div
                    onClick={() => setSelectedLayoutOption('compact')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedLayoutOption === 'compact'
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-1 ring-indigo-200 text-indigo-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">แบบกระชับต่อเนื่อง (Ultra-Compact Flow)</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                          ประหยัดกระดาษสูงสุด
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold">AI คำนวณเต็มหน้า</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                      ระบบ AI คำนวณและจัดสรรพื้นที่ให้ออกข้อสอบเต็มหน้ากระดาษอัตโนมัติ ไม่เหลือพื้นที่โล่งเยอะ ทั้ง 1 คอลัมน์ และ 2 คอลัมน์
                    </p>

                    {/* Column Layout Selector for Compact */}
                    {selectedLayoutOption === 'compact' && (
                      <div
                        className="pt-2 border-t border-indigo-200 flex items-center justify-between"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-[10px] text-slate-600 font-semibold font-mono">รูปแบบคอลัมน์:</span>
                        <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-indigo-200 shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setCompactColumnMode('1-col')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              compactColumnMode === '1-col'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            1 คอลัมน์ (เต็มหน้ากระดาษ)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCompactColumnMode('2-col')}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              compactColumnMode === '2-col'
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            2 คอลัมน์ (เต็มหน้า 2 คอลัมน์)
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Workspace Layout */}
                  <div
                    onClick={() => setSelectedLayoutOption('workspace')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedLayoutOption === 'workspace'
                        ? 'bg-indigo-50 border-indigo-300 shadow-sm ring-1 ring-indigo-200 text-indigo-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">เว้นที่แสดงวิธีทำ (Workspace)</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                          ข้อสอบจริง
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 font-bold">หน้าละ 2 ข้อ</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      หน้า A4 ละ 2 ข้อ (ข้อละครึ่งหน้า) โจทย์และช้อยส์ด้านบน ปล่อยพื้นที่ว่างสีขาวโปร่งตาด้านล่างไร้เส้นกรอบกั้น ไว้ทดเลขได้อย่างอิสระ
                    </p>
                  </div>

                  {/* Option 3: Custom Premium Mode */}
                  <div
                    onClick={() => setSelectedLayoutOption('custom')}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedLayoutOption === 'custom'
                        ? 'bg-purple-50 border-purple-300 shadow-sm ring-1 ring-purple-200 text-purple-950'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900">โหมดพรีเมียม (Custom Premium)</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                          กำหนดเอง
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-700 font-bold">{customCount} ข้อ</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed mb-2">
                      ระบุจำนวนข้อสอบที่ต้องการได้อิสระ พร้อมเลือกเปิด/ปิดพื้นที่เว้นสำหรับคำนวณ
                    </p>

                    {/* Custom Controls (Accordion sub-panel) */}
                    {selectedLayoutOption === 'custom' && (
                      <div
                        className="mt-2.5 pt-2.5 border-t border-purple-200 space-y-2.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div>
                          <label className="block text-[11px] text-slate-700 mb-1.5 font-medium">
                            ระบุจำนวนข้อที่ต้องการสร้าง:
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              min={1}
                              max={100}
                              value={customCount}
                              onChange={(e) => setCustomCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                              placeholder="เช่น 25"
                              className="w-full bg-white text-slate-900 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
                            />
                            <span className="text-xs text-slate-600 font-mono shrink-0">ข้อ</span>
                          </div>
                          <div className="text-[10px] text-purple-700 mt-1 font-mono font-semibold">
                            คำนวณหน้ากระดาษ: ประมาณ {Math.ceil(customCount / (customWorkspaceEnabled ? 2 : (compactColumnMode === '2-col' ? 6 : 5)))} หน้า A4
                          </div>
                        </div>

                        {/* Switch: Workspace vs Compact */}
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-purple-200 shadow-2xs">
                          <span className="text-[11px] text-slate-700 font-medium">
                            {customWorkspaceEnabled ? '✓ เว้นที่คำนวณ (หน้าละ 2 ข้อ)' : '✓ ไม่เว้นที่ว่าง (แบบกระชับ)'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setCustomWorkspaceEnabled(!customWorkspaceEnabled)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono transition-all cursor-pointer ${
                              customWorkspaceEnabled
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                          >
                            {customWorkspaceEnabled ? 'หน้าละ 2 ข้อ' : 'แบบกระชับ'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Premium Watermark & Header/Footer Removal Toggle */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">
                      โหมด Premium / ซ่อนลายน้ำ (Clean Document)
                    </span>
                    <span className="text-[10px] text-purple-600 font-medium">
                      ตัดป้ายดำ ลายน้ำกลางหน้า และข้อความท้ายกระดาษออก 100%
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPremiumWatermarkRemoved(!isPremiumWatermarkRemoved)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                      shouldHideWatermarkAndBrand
                        ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {shouldHideWatermarkAndBrand ? '✓ ซ่อนแล้ว 100%' : 'ปิด (แสดง)'}
                  </button>
                </div>
                <div className="text-[9.5px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {shouldHideWatermarkAndBrand ? (
                    <span className="text-emerald-700 font-medium">
                      • ป้ายสีดำ "SEVEN SPACE LABS" ด้านบนหัวกระดาษ: <strong>ซ่อนแล้ว 100%</strong><br />
                      • ลายน้ำกลางหน้ากระดาษ: <strong>ลบออกหมดจด</strong><br />
                      • ข้อความท้ายกระดาษมุมล่าง: <strong>ตัดออก เหลือกระดาษขาวสะอาด</strong>
                    </span>
                  ) : (
                    <span>
                      • ค่าเริ่มต้น: แสดงป้ายและลายน้ำสถาบัน SEVEN SPACE LABS<br />
                      • คลิกเปิดเพื่อลบลายน้ำและหัว-ท้ายกระดาษสำหรับพิมพ์แจกนักเรียน
                    </span>
                  )}
                </div>
              </div>

              {/* Zero-Cost Vector Diagrams Toggle & Selection Box */}
              <div className={`p-3.5 rounded-xl border transition-all shadow-2xs ${
                enableVectorDiagrams
                  ? 'bg-sky-50/80 border-sky-300 ring-1 ring-sky-200'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <Sparkles className={`w-4 h-4 shrink-0 mt-0.5 ${enableVectorDiagrams ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">
                        วาดไดอะแกรมฟิสิกส์เวกเตอร์ (Zero-Cost Line Art)
                      </span>
                      <span className="text-[10px] text-slate-500 leading-tight">
                        วาดภาพลายเส้น SVG ประกอบโจทย์อัตโนมัติ
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableVectorDiagrams(!enableVectorDiagrams)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer shrink-0 ${
                      enableVectorDiagrams
                        ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {enableVectorDiagrams ? '✓ เปิดวาดภาพ' : 'ปิด (ข้อความล้วน)'}
                  </button>
                </div>

                {/* Topics supported tags */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {['แรง & กลศาสตร์', 'รอก & สปริง', 'วงจรไฟฟ้า', 'ดาราศาสตร์ & วงโคจร', 'การทดลอง & เลนส์'].map((tag) => (
                    <span
                      key={tag}
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono transition-colors ${
                        enableVectorDiagrams
                          ? 'bg-sky-100 text-sky-800 border border-sky-200 font-semibold'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="text-[9.5px] leading-relaxed mt-2 pt-2 border-t border-slate-200/80">
                  {enableVectorDiagrams ? (
                    <span className="text-indigo-900 font-medium">
                      • <strong>เปิดใช้งาน:</strong> หากโจทย์มีเนื้อหาเกี่ยวกับแรง กลศาสตร์ รอก สปริง วงจรไฟฟ้า ดาราศาสตร์ หรืออื่นๆ AI จะสร้างภาพ SVG ขาว-ดำ คมชัดแทรกให้ทันที (Zero-Cost)
                    </span>
                  ) : (
                    <span className="text-slate-500">
                      • <strong>ปิดใช้งาน:</strong> สกัดเฉพาะข้อความคำถามและตัวเลือก (Pure Text) ไม่วาดภาพไดอะแกรม เหมาะสำหรับชุดข้อสอบที่ต้องการประหยัดหน้ากระดาษสูงสุด
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Transaction Summary UI Box & Generate Action Button */}
            <div className="pt-2 space-y-2.5">
              {activeTier === 'premium' ? (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider mb-1 flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-amber-600" />
                    <span>สรุปการทำรายการเหรียญ (โหมดพรีเมียม)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>จำนวนหน้า:</span>
                    <span className="font-bold text-slate-900 font-mono">{detectedPages} หน้า</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>หักเหรียญ:</span>
                    <span className="font-bold text-amber-700 font-mono">-{requiredCoinsForDoc} Cosmic Coins</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-700 font-medium">
                    <span>ยอดคงเหลือหลังทำรายการ:</span>
                    <span className={`font-bold font-mono ${userCoins >= requiredCoinsForDoc ? 'text-emerald-700' : 'text-red-600'}`}>
                      {userCoins >= requiredCoinsForDoc
                        ? `${userCoins - requiredCoinsForDoc} Cosmic Coins`
                        : `${userCoins} Cosmic Coins (ไม่พอ)`}
                    </span>
                  </div>

                  {userCoins < requiredCoinsForDoc && (
                    <div className="mt-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-2">
                      <div className="font-semibold flex items-center gap-1.5 text-red-700">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>Cosmic Coins ไม่เพียงพอ (ขาดอีก {requiredCoinsForDoc - userCoins} Coins)</span>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenPremiumModal?.()}
                          className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                        >
                          <Crown className="w-3.5 h-3.5 fill-current" />
                          <span>อัปเกรดเป็น Premium (+1,000 Coins)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenRankHub?.()}
                          className="w-full py-2 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Zap className="w-3.5 h-3.5 text-indigo-600" />
                          <span>ทำภารกิจสะสมพลังงาน</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                  <div className="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>สรุปสิทธิ์ฟรีประจำวัน</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>สิทธิ์ฟรีคงเหลือวันนี้:</span>
                    <span className="font-bold text-indigo-700 font-mono">
                      {Math.max(0, 1 - freeQuota.usedToday)}/1 ไฟล์
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700 font-medium">
                    <span>ค่าธรรมเนียมเหรียญ:</span>
                    <span className="font-bold text-emerald-700 font-mono">0 Cosmic Coins</span>
                  </div>

                  {freeQuota.usedToday >= 1 && !isAdminOrDev && (
                    <div className="mt-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <div className="font-semibold flex items-center gap-1.5 text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>สิทธิ์ฟรีสำหรับวันนี้หมดแล้ว (0/1 ไฟล์)</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-snug">
                        สลับไปใช้โหมดพรีเมียมเพื่อใช้ Cosmic Coins สกัดข้อสอบได้ต่อเนื่อง
                      </p>
                      <button
                        type="button"
                        onClick={() => setActiveTier('premium')}
                        className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Crown className="w-3.5 h-3.5 fill-current" />
                        <span>สลับเป็นโหมดพรีเมียม</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handleGenerateExam}
                disabled={
                  isAnalyzing ||
                  (activeTier === 'premium' && (userCoins < requiredCoinsForDoc || !isPremiumUnlocked)) ||
                  (activeTier === 'free' && freeQuota.usedToday >= 1 && !isAdminOrDev)
                }
                className="w-full py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:text-slate-500 shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>กำลังวิเคราะห์และสกัดข้อสอบ...</span>
                  </>
                ) : activeTier === 'premium' ? (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      สั่งสกัดข้อสอบ [ใช้ {requiredCoinsForDoc} Coins]
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-indigo-200" />
                    <span>
                      สั่งสกัดข้อสอบ (สิทธิ์ฟรี 1 ไฟล์/วัน)
                    </span>
                  </>
                )}
              </button>
              {statusStep && (
                <div className="text-[11px] text-center text-indigo-600 mt-2 font-mono animate-pulse font-semibold">
                  {statusStep}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* Right Panel: Official Exam Paper Preview */}
          {/* ======================================================== */}
          <div className="lg:col-span-8 p-4 sm:p-6 overflow-y-auto flex flex-col items-center justify-between bg-slate-950">
            {/* View Switcher & Direct Download Bar */}
            <div className="w-full max-w-[720px] flex flex-wrap items-center justify-between gap-2 mb-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                {isPreviewVisible ? (
                  <>
                    <span className="text-slate-400 font-mono text-[11px]">มุมมอง:</span>
                    <button
                      onClick={() => setViewMode('a4')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        viewMode === 'a4'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      หน้า A4 ({activePage}/{totalPages})
                    </button>
                    <button
                      onClick={() => setViewMode('all')}
                      className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                        viewMode === 'all'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      แสดงทั้ง {examData.questions.length} ข้อเต็ม
                    </button>

                    {/* Quick Compact Column Switcher */}
                    {appliedLayout === 'compact' && (
                      <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-[11px] font-mono">
                        <button
                          onClick={() => setCompactColumnMode('1-col')}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            compactColumnMode === '1-col' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                          }`}
                          title="1 คอลัมน์: AI คำนวณพื้นที่เต็มหน้ากระดาษ ไร้พื้นที่โล่ง"
                        >
                          1 คอลัมน์
                        </button>
                        <button
                          onClick={() => setCompactColumnMode('2-col')}
                          className={`px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                            compactColumnMode === '2-col' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                          }`}
                          title="2 คอลัมน์: AI คำนวณจัดวาง 2 คอลัมน์คู่เต็มหน้ากระดาษ ไร้พื้นที่โล่ง"
                        >
                          2 คอลัมน์
                        </button>
                      </div>
                    )}

                    {/* Quick Watermark / Premium Toggle */}
                    <button
                      onClick={() => setIsPremiumWatermarkRemoved(!isPremiumWatermarkRemoved)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                        shouldHideWatermarkAndBrand
                          ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                          : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
                      }`}
                      title="สลับโหมด Premium: ซ่อนป้ายสถาบัน ลายน้ำกลางหน้า และท้ายกระดาษ"
                    >
                      <span>{shouldHideWatermarkAndBrand ? '✓ ซ่อนลายน้ำ' : 'ลายน้ำ: แสดง'}</span>
                    </button>

                    {/* Button to Hide/Close Preview */}
                    <button
                      onClick={() => setIsPreviewVisible(false)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
                      title="ซ่อนข้อสอบ"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>ซ่อนข้อสอบ</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsPreviewVisible(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all shadow-sm text-xs"
                    title="เปิดดูตัวอย่างข้อสอบ"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>กดดูตัวอย่างข้อสอบ (Preview)</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Word (.docx) */}
                <button
                  onClick={handleDownloadWord}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold cursor-pointer transition-all shadow-sm text-xs"
                  title="ดาวน์โหลดไฟล์ Word (.docx) มาตรฐาน รองรับ Pages บน Mac และ Google Docs"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>Word (.docx)</span>
                </button>

                <button
                  onClick={handleDownloadPdf}
                  disabled={isExportingPdf}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold cursor-pointer transition-all shadow-sm text-xs"
                  title="ดาวน์โหลดข้อสอบ (.pdf) ขนาด A4 คมชัดสูง (บันทึกเป็นไฟล์ PDF ลงเครื่องโดยตรง)"
                >
                  {isExportingPdf ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>{isExportingPdf ? 'กำลังสร้าง...' : 'ดาวน์โหลดข้อสอบ (.pdf)'}</span>
                </button>
              </div>
            </div>

            {!isPreviewVisible ? (
              <div className="w-full max-w-[720px] bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-2xl min-h-[580px] my-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 shadow-inner">
                  <Eye className="w-8 h-8" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ชุดข้อสอบพร้อมเปิดดู ({examData.questions.length} ข้อ)
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 max-w-md">
                  {cleanAcademicTopicTitle(examData.title)}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
                  วิชา: {examData.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์'} • จำนวน {examData.questions.length} ข้อ (ปรนัย 4 ตัวเลือก • ไม่มีเฉลยคำตอบ)
                </p>

                {/* Action Buttons to show preview */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setIsPreviewVisible(true)}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Eye className="w-4 h-4" />
                    <span>กดดูตัวอย่างข้อสอบ (Preview)</span>
                  </button>
                  <button
                    onClick={() => {
                      setPreviewModalPage(1);
                      setIsPreviewModalOpen(true);
                      setIsPreviewVisible(true);
                    }}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all cursor-pointer hover:bg-slate-700/80"
                  >
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                    <span>เปิดพรีวิว A4 เต็มจอ</span>
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-left w-full max-w-md">
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">จำนวนข้อ</div>
                    <div className="text-sm font-bold text-slate-200">{examData.questions.length} ข้อ</div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">รูปแบบ</div>
                    <div className="text-sm font-bold text-slate-200">{appliedLayout === 'workspace' ? 'Workspace' : 'Compact'}</div>
                  </div>
                  <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-mono">การส่งออก</div>
                    <div className="text-sm font-bold text-indigo-400">Word / PDF</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Official A4 Exam Sheet Preview Container */}
                <div className="relative w-full max-w-[720px] bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-2xl border border-slate-300 font-sans min-h-[720px] flex flex-col justify-between overflow-hidden animate-in fade-in duration-200">
              {/* Center Diagonal Background Watermark (Only if !shouldHideWatermarkAndBrand) */}
              {!shouldHideWatermarkAndBrand && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -rotate-30 text-slate-900/[0.035] text-4xl sm:text-5xl font-black tracking-widest text-center leading-tight z-0">
                  SEVEN SPACE LABS<br />
                  <span className="text-xl sm:text-2xl font-bold tracking-widest opacity-70">FREE SAMPLE</span>
                </div>
              )}

              <div className="relative z-10">
                {/* Official Exam Sheet Header */}
                <div className="border-b-2 border-slate-900 pb-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      {!shouldHideWatermarkAndBrand && (
                        <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                          SEVEN SPACE LABS - EXAM PAPER
                        </span>
                      )}
                      {appliedLayout === 'workspace' ? (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                          WORKSPACE LAYOUT (2 ข้อ/หน้า)
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-300">
                          {compactColumnMode === '2-col' ? 'ULTRA-COMPACT (2 คอลัมน์)' : 'COMPACT FLOW (1 คอลัมน์)'}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 mt-1">
                      {examData.title}
                    </h2>
                    <p className="text-xs text-slate-600 mt-0.5">
                      วิชา: {examData.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์'} • จำนวน {examData.questions.length} ข้อ (ปรนัย 4 ตัวเลือก 1., 2., 3., 4.)
                    </p>
                  </div>

                  <div className="text-right font-mono text-[11px] text-slate-500 shrink-0">
                    <div className="font-bold text-indigo-700">
                      {viewMode === 'a4' ? `หน้า ${activePage} จาก ${totalPages}` : `แสดงครบ ${examData.questions.length} ข้อ`}
                    </div>
                    <div>คะแนนเต็ม: {examData.questions.length} คะแนน</div>
                  </div>
                </div>

                {/* Candidate Info Line (shown prominently on Page 1 or all view) */}
                {(activePage === 1 || viewMode === 'all') && (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-700 border border-slate-300 rounded-lg p-2.5 mb-4 bg-slate-50">
                    <div>ชื่อ-นามสกุล: .....................................................</div>
                    <div>รหัสประจำตัว Cadet: ..................................</div>
                    <div>ห้องสอบ / Sector: ....................................................</div>
                    <div>วันที่สอบ: .....................................................</div>
                  </div>
                )}

                {/* Exam Questions List */}
                {appliedLayout === 'workspace' ? (
                  <div className="space-y-6">
                    {currentPreviewQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="pb-5 min-h-[460px] flex flex-col justify-start"
                      >
                        <div>
                          {/* Question Line */}
                          <div className="flex items-start gap-2 mb-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                              {q.id}.
                            </span>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                              {q.question}
                            </p>
                          </div>

                          {/* Vector Diagram SVG (if any) */}
                          {enableVectorDiagrams && q.diagramSvg && (
                            <div
                              className="my-2.5 flex justify-center items-center py-2 px-3 bg-slate-50 rounded-lg border border-slate-200/80 max-w-sm mx-auto overflow-hidden shadow-2xs"
                              dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                            />
                          )}

                          {/* 4 Choices */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 pl-6 mb-3 text-xs sm:text-sm text-slate-800">
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">1.</span><span className="leading-relaxed">{q.options.A}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">2.</span><span className="leading-relaxed">{q.options.B}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">3.</span><span className="leading-relaxed">{q.options.C}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">4.</span><span className="leading-relaxed">{q.options.D}</span></div>
                          </div>
                        </div>

                        {/* Pure Blank White Space for calculations (No borders, no labels) */}
                        <div className="flex-1 min-h-[180px]" />
                      </div>
                    ))}
                  </div>
                ) : compactColumnMode === '2-col' ? (
                  /* 2-Column Ultra-Compact Grid: AI Full-Page Density */
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 content-between">
                    {currentPreviewQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="border-b border-slate-200 pb-2.5 flex flex-col justify-start"
                      >
                        <div className="flex items-start gap-1.5 mb-1">
                          <span className="font-bold text-xs text-slate-900 shrink-0">
                            {q.id}.
                          </span>
                          <p className="text-xs font-bold text-slate-900 leading-snug">
                            {q.question}
                          </p>
                        </div>

                        {enableVectorDiagrams && q.diagramSvg && (
                          <div
                            className="my-1.5 flex justify-center items-center p-1.5 bg-slate-50 rounded border border-slate-200/80 max-w-[170px] max-h-[50px] mx-auto overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                          />
                        )}

                        <div className="grid grid-cols-1 gap-y-1 pl-3 text-[11px] text-slate-800">
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">1.</span><span>{q.options.A}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">2.</span><span>{q.options.B}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">3.</span><span>{q.options.C}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">4.</span><span>{q.options.D}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 1-Column Compact Flow: AI Full-Page Density */
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    {currentPreviewQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="border-b border-slate-200 pb-2.5"
                      >
                        <div className="flex items-start gap-2 mb-1.5">
                          <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">
                            {q.id}.
                          </span>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                            {q.question}
                          </p>
                        </div>

                        {enableVectorDiagrams && q.diagramSvg && (
                          <div
                            className="my-1.5 inline-flex justify-center items-center p-1 bg-slate-50 rounded border border-slate-200/80 max-w-[190px] max-h-[52px] ml-6 overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                          />
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-6 text-xs text-slate-800">
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">1.</span><span>{q.options.A}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">2.</span><span>{q.options.B}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">3.</span><span>{q.options.C}</span></div>
                          <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">4.</span><span>{q.options.D}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* A4 Sheet Footer */}
              <div className="relative z-10 border-t border-slate-300 pt-3 mt-4 text-[10px] text-slate-500 flex items-center justify-between font-mono">
                <span>
                  {!shouldHideWatermarkAndBrand
                    ? 'SEVEN SPACE LABS - EXAM PAPER // Orbital Research Station'
                    : ''}
                </span>
                <span className="font-bold text-slate-700">
                  {viewMode === 'a4'
                    ? `หน้า ${activePage} จาก ${totalPages} (ข้อที่ ${currentPreviewQuestions.length > 0 ? currentPreviewQuestions[0].id : 1} - ${currentPreviewQuestions.length > 0 ? currentPreviewQuestions[currentPreviewQuestions.length - 1].id : 1})`
                    : `รวมทั้งหมด ${examData.questions.length} ข้อ`}
                </span>
              </div>
            </div>

                {/* Pagination Controls for Screen Preview */}
                {viewMode === 'a4' && (
                  <div className="flex items-center gap-2 mt-4 select-none">
                    <button
                      disabled={activePage <= 1}
                      onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>ก่อนหน้า</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setActivePage(pageNum)}
                          className={`w-7 h-7 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                            activePage === pageNum
                              ? 'bg-cyan-500 text-slate-950 shadow-md font-extrabold'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={activePage >= totalPages}
                      onClick={() => setActivePage((prev) => Math.min(totalPages, prev + 1))}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>ถัดไป</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PRINTABLE A4 CONTAINER: Formats all questions into clean A4 pages        */}
      {/* Used by window.print() (Save as PDF) & html2canvas/jsPDF                 */}
      {/* ========================================================================= */}
      <div
        id="printable-exam-document"
        ref={pdfExportContainerRef}
        className="print-only-container"
      >
        {pagesArray.map((pageQuestions, pageIdx) => {
          const pageNumber = pageIdx + 1;
          const startQNum = pageQuestions.length > 0 ? pageQuestions[0].id : 1;
          const endQNum = pageQuestions.length > 0 ? pageQuestions[pageQuestions.length - 1].id : 1;

          return (
            <div
              key={pageIdx}
              className="pdf-render-page print-page-deck"
              style={{
                width: '794px',
                height: '1123px', // Exact A4 aspect ratio at 96 dpi
                padding: appliedLayout === 'compact' ? '28px 36px 24px 36px' : '36px 44px',
                boxSizing: 'border-box',
                background: '#ffffff',
                color: '#0f172a',
                fontFamily: `'Prompt', 'Plus Jakarta Sans', system-ui, sans-serif`,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Center Diagonal Background Watermark (Only in Free / Non-Premium mode) */}
              {!shouldHideWatermarkAndBrand && (
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(-32deg)',
                    fontSize: '38px',
                    fontWeight: '900',
                    letterSpacing: '0.15em',
                    color: 'rgba(15, 23, 42, 0.04)',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    zIndex: 0,
                    whiteSpace: 'nowrap',
                    textAlign: 'center',
                  }}
                >
                  SEVEN SPACE LABS<br />
                  <span style={{ fontSize: '16px', letterSpacing: '0.3em', opacity: 0.7 }}>FREE EVALUATION COPY</span>
                </div>
              )}

              <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                {/* Header for Page 1 */}
                {pageNumber === 1 ? (
                  <div>
                    <div style={{ borderBottom: '2.5px solid #0f172a', paddingBottom: appliedLayout === 'compact' ? '8px' : '12px', marginBottom: appliedLayout === 'compact' ? '10px' : '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {!shouldHideWatermarkAndBrand ? (
                            <>
                              <span
                                style={{
                                  background: '#0f172a',
                                  color: '#ffffff',
                                  fontSize: '10.5px',
                                  fontWeight: 'bold',
                                  padding: '2.5px 8px',
                                  borderRadius: '4px',
                                  letterSpacing: '0.05em',
                                }}
                              >
                                SEVEN SPACE LABS - EXAM PAPER
                              </span>
                              <span style={{ fontSize: '10.5px', color: '#64748b', fontWeight: 'bold' }}>
                                Astrophysics & STEM Examination Deck
                              </span>
                            </>
                          ) : (
                            <span style={{ fontSize: '10.5px', color: '#475569', fontWeight: 'bold' }}>
                              ชุดข้อสอบมาตรฐานวิชาการ
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '10.5px', color: '#475569', fontWeight: 'bold', textAlign: 'right' }}>
                          หน้า {pageNumber} จาก {totalPages} (ข้อ {startQNum} - {endQNum})
                        </div>
                      </div>

                      <h1 style={{ fontSize: appliedLayout === 'compact' ? '15px' : '17px', fontWeight: '900', color: '#0f172a', margin: '4px 0 2px 0' }}>
                        {examData.title}
                      </h1>
                      <div style={{ fontSize: '11px', color: '#475569', display: 'flex', justifyContent: 'space-between' }}>
                        <span>วิชา: {examData.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์'} • จำนวน {examData.questions.length} ข้อ (ปรนัย 4 ตัวเลือก 1., 2., 3., 4.)</span>
                        <span style={{ fontWeight: 'bold', color: '#4338ca' }}>คะแนนเต็ม: {examData.questions.length} คะแนน</span>
                      </div>
                    </div>

                    {/* Candidate Info Table */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: appliedLayout === 'compact' ? '4px 12px' : '8px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: appliedLayout === 'compact' ? '6px 12px' : '10px 14px',
                        marginBottom: appliedLayout === 'compact' ? '10px' : '16px',
                        background: '#f8fafc',
                        fontSize: appliedLayout === 'compact' ? '10px' : '11px',
                        color: '#334155',
                      }}
                    >
                      <div>ชื่อ-นามสกุลผู้สอบ: .....................................................</div>
                      <div>รหัสประจำตัว Cadet: ..................................</div>
                      <div>ห้องสอบ / Sector: ....................................................</div>
                      <div>วันที่สอบ: .....................................................</div>
                    </div>
                  </div>
                ) : (
                  /* Running Header for Pages 2, 3... */
                  <div
                    style={{
                      borderBottom: '1.5px solid #0f172a',
                      paddingBottom: '6px',
                      marginBottom: appliedLayout === 'compact' ? '10px' : '14px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {!shouldHideWatermarkAndBrand && (
                        <span
                          style={{
                            background: '#0f172a',
                            color: '#ffffff',
                            fontSize: '9.5px',
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: '3px',
                          }}
                        >
                          SEVEN SPACE LABS - EXAM PAPER
                        </span>
                      )}
                      <span style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#334155' }}>
                        {examData.title}
                      </span>
                    </div>
                    <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#4338ca' }}>
                      หน้า {pageNumber} จาก {totalPages} (ข้อ {startQNum} - {endQNum})
                    </div>
                  </div>
                )}

                {/* Question Items for this A4 Page */}
                {appliedLayout === 'workspace' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {pageQuestions.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          paddingBottom: '12px',
                          minHeight: '460px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                        }}
                      >
                        {/* Question Line */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '12px', color: '#0f172a', flexShrink: 0 }}>
                            {q.id}.
                          </span>
                          <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.45', flex: 1 }}>
                            {q.question}
                          </div>
                        </div>

                        {enableVectorDiagrams && q.diagramSvg && (
                          <div
                            style={{
                              margin: '6px 0 8px 16px',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              padding: '6px',
                              maxWidth: '240px',
                              maxHeight: '75px',
                              overflow: 'hidden',
                            }}
                            dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                          />
                        )}

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            columnGap: '28px',
                            rowGap: '6px',
                            paddingLeft: '20px',
                            marginBottom: '8px',
                            fontSize: '11px',
                            lineHeight: '1.45',
                            color: '#1e293b',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '7px' }}>1.</span><span>{q.options.A}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '7px' }}>2.</span><span>{q.options.B}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '7px' }}>3.</span><span>{q.options.C}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '7px' }}>4.</span><span>{q.options.D}</span></div>
                        </div>

                        {/* Pure Blank White Space for calculations (No borders, no labels) */}
                        <div style={{ flex: 1, minHeight: '220px' }} />
                      </div>
                    ))}
                  </div>
                ) : compactColumnMode === '2-col' ? (
                  /* 2-Column Ultra-Compact Grid: AI Full-Page Density */
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      columnGap: '20px',
                      rowGap: '12px',
                      flex: 1,
                      alignContent: 'space-between',
                    }}
                  >
                    {pageQuestions.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '8px',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '10.5px', color: '#0f172a', flexShrink: 0 }}>
                            {q.id}.
                          </span>
                          <div style={{ fontSize: '10.5px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.35', flex: 1 }}>
                            {q.question}
                          </div>
                        </div>

                        {enableVectorDiagrams && q.diagramSvg && (
                          <div
                            style={{
                              margin: '2px auto 4px auto',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '4px',
                              padding: '2px 4px',
                              maxWidth: '150px',
                              maxHeight: '48px',
                              overflow: 'hidden',
                            }}
                            dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                          />
                        )}

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            columnGap: '8px',
                            rowGap: '2px',
                            paddingLeft: '10px',
                            fontSize: '9.5px',
                            lineHeight: '1.3',
                            color: '#1e293b',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '4px' }}>1.</span><span style={{ flex: 1 }}>{q.options.A}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '4px' }}>2.</span><span style={{ flex: 1 }}>{q.options.B}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '4px' }}>3.</span><span style={{ flex: 1 }}>{q.options.C}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '4px' }}>4.</span><span style={{ flex: 1 }}>{q.options.D}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 1-Column Compact Flow: AI Full-Page Density */
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
                    {pageQuestions.map((q) => (
                      <div
                        key={q.id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                          paddingBottom: '6px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 'bold', fontSize: '11px', color: '#0f172a', flexShrink: 0 }}>
                            {q.id}.
                          </span>
                          <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.4', flex: 1 }}>
                            {q.question}
                          </div>
                        </div>

                        {enableVectorDiagrams && q.diagramSvg && (
                          <div
                            style={{
                              margin: '2px 0 4px 18px',
                              display: 'inline-flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              background: '#f8fafc',
                              border: '1px solid #e2e8f0',
                              borderRadius: '4px',
                              padding: '2px 6px',
                              maxWidth: '180px',
                              maxHeight: '50px',
                              overflow: 'hidden',
                            }}
                            dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                          />
                        )}

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            columnGap: '20px',
                            rowGap: '3px',
                            paddingLeft: '18px',
                            fontSize: '10px',
                            lineHeight: '1.35',
                            color: '#1e293b',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '5px' }}>1.</span><span style={{ flex: 1 }}>{q.options.A}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '5px' }}>2.</span><span style={{ flex: 1 }}>{q.options.B}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '5px' }}>3.</span><span style={{ flex: 1 }}>{q.options.C}</span></div>
                          <div style={{ display: 'flex', alignItems: 'flex-start' }}><span style={{ fontWeight: 'bold', color: '#0f172a', marginRight: '5px' }}>4.</span><span style={{ flex: 1 }}>{q.options.D}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Running Footer on each page */}
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  borderTop: '1px solid #cbd5e1',
                  paddingTop: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '9.5px',
                  color: '#64748b',
                }}
              >
                <span>
                  {!shouldHideWatermarkAndBrand
                    ? 'SEVEN SPACE LABS - EXAM PAPER // Orbital Research Examination System'
                    : ''}
                </span>
                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>
                  หน้า {pageNumber} จาก {totalPages}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification (Error, Success, Info) */}
      {toastNotification && (
        <div
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] max-w-md w-[92%] sm:w-auto px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in ${
            toastNotification.type === 'error'
              ? 'bg-slate-900/95 border border-red-500/80 text-white'
              : toastNotification.type === 'success'
              ? 'bg-slate-900/95 border border-emerald-500/80 text-white'
              : 'bg-slate-900/95 border border-indigo-500/80 text-white'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
              toastNotification.type === 'error'
                ? 'bg-red-500/20 text-red-400'
                : toastNotification.type === 'success'
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-indigo-500/20 text-indigo-400'
            }`}
          >
            {toastNotification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : toastNotification.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <FileText className="w-4 h-4 text-indigo-400" />
            )}
          </div>
          <div
            className={`text-xs sm:text-sm font-semibold ${
              toastNotification.type === 'error'
                ? 'text-red-200'
                : toastNotification.type === 'success'
                ? 'text-emerald-200'
                : 'text-indigo-200'
            }`}
          >
            {toastNotification.message}
          </div>
        </div>
      )}

      {/* Full-Screen PDF Export Loading Modal (Direct Blob Export) */}
      {isExportingPdf && (
        <div className="fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-indigo-500/40 shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm w-full animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-1">
              <RefreshCw className="w-6 h-6 animate-spin text-cyan-300" />
            </div>
            <h4 className="font-bold text-sm text-white">กำลังสร้างไฟล์ PDF ข้อสอบ</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{exportProgress || 'กำลังเรนเดอร์เอกสารขนาด A4 คมชัดสูง...'}</p>
            <div className="mt-2 text-[10px] font-mono text-cyan-300 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
              Direct Blob Download • ไม่ใช้คำสั่งพิมพ์
            </div>
          </div>
        </div>
      )}

      {/* WYSIWYG A4 Print/PDF Preview Modal */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg print:hidden">
          <div className="relative w-full max-w-4xl h-[92vh] rounded-3xl bg-slate-900 text-white shadow-2xl border border-indigo-500/40 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">
                  พรีวิวเอกสารเสมือนจริงก่อนพิมพ์ (A4 Print / PDF Preview)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  หน้า {previewModalPage} จาก {totalPages}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleDownloadPdf();
                  }}
                  disabled={isExportingPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isExportingPdf ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileDown className="w-3.5 h-3.5" />
                  )}
                  <span>{isExportingPdf ? 'กำลังสร้าง PDF...' : 'ยืนยันดาวน์โหลด PDF'}</span>
                </button>
                <button
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: A4 Paper Sheet Preview */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex justify-center items-start">
              <div
                style={{ width: '794px', minHeight: '1123px' }}
                className="bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-9 flex flex-col justify-between font-sans relative my-auto overflow-hidden"
              >
                {/* Center Diagonal Background Watermark (Only if !shouldHideWatermarkAndBrand) */}
                {!shouldHideWatermarkAndBrand && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -rotate-30 text-slate-900/[0.035] text-4xl sm:text-5xl font-black tracking-widest text-center leading-tight z-0">
                    SEVEN SPACE LABS<br />
                    <span className="text-xl sm:text-2xl font-bold tracking-widest opacity-70">FREE SAMPLE</span>
                  </div>
                )}

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                  {/* Page 1 Header or Running Header */}
                  {previewModalPage === 1 ? (
                    <div className="border-b-2 border-slate-900 pb-2.5 mb-3">
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          {!shouldHideWatermarkAndBrand ? (
                            <>
                              <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-900 text-white">
                                SEVEN SPACE LABS - EXAM PAPER
                              </span>
                              <span className="text-[10.5px] font-bold text-slate-500">
                                Astrophysics & STEM Examination Deck
                              </span>
                            </>
                          ) : (
                            <span className="text-[10.5px] font-bold text-slate-600">
                              ชุดข้อสอบมาตรฐานวิชาการ
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-600 font-bold ml-auto">
                          หน้า {previewModalPage} จาก {totalPages}
                        </span>
                      </div>
                      <h1 className="text-base sm:text-lg font-black text-slate-900 leading-snug">{examData.title}</h1>
                      <div className="text-xs text-slate-600 flex justify-between mt-1 mb-2">
                        <span>วิชา: {examData.subject || 'วิทยาศาสตร์และฟิสิกส์ประยุกต์'} • จำนวน {examData.questions.length} ข้อ (ปรนัย 4 ตัวเลือก 1., 2., 3., 4.)</span>
                        <span className="font-bold text-indigo-700">คะแนนเต็ม: {examData.questions.length} คะแนน</span>
                      </div>

                      {/* Candidate Info Box on Page 1 */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs font-mono text-slate-700 border border-slate-300 rounded-lg p-2.5 bg-slate-50">
                        <div>ชื่อ-นามสกุล: .....................................................</div>
                        <div>รหัสประจำตัว Cadet: ..................................</div>
                        <div>ห้องสอบ / Sector: ....................................................</div>
                        <div>วันที่สอบ: .....................................................</div>
                      </div>
                    </div>
                  ) : (
                    <div className="border-b border-slate-900 pb-2 mb-3 flex justify-between items-center text-xs font-mono">
                      <div className="flex items-center gap-2">
                        {!shouldHideWatermarkAndBrand && (
                          <span className="font-bold bg-slate-900 text-white px-2 py-0.5 rounded text-[10px]">
                            SEVEN SPACE LABS - EXAM PAPER
                          </span>
                        )}
                        <span className="font-bold text-slate-700">{examData.title}</span>
                      </div>
                      <span className="text-indigo-700 font-bold ml-auto">
                        หน้า {previewModalPage} จาก {totalPages}
                      </span>
                    </div>
                  )}

                  {/* Questions on this preview page */}
                  {appliedLayout === 'workspace' ? (
                    <div className="space-y-4">
                      {(pagesArray[previewModalPage - 1] || []).map((q) => (
                        <div
                          key={q.id}
                          className="border-b border-slate-200 pb-3 last:border-b-0 min-h-[440px] flex flex-col justify-start"
                        >
                          <div>
                            <div className="flex items-start gap-2 mb-2">
                              <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">{q.id}.</span>
                              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">{q.question}</p>
                            </div>
                            {enableVectorDiagrams && q.diagramSvg && (
                              <div
                                className="my-2 flex justify-center py-1.5 px-2 bg-slate-50 rounded border border-slate-200 max-w-xs mx-auto"
                                dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                              />
                            )}
                            <div className="grid grid-cols-2 gap-x-6 gap-y-2 pl-6 text-xs text-slate-800">
                              <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">1.</span><span>{q.options.A}</span></div>
                              <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">2.</span><span>{q.options.B}</span></div>
                              <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">3.</span><span>{q.options.C}</span></div>
                              <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">4.</span><span>{q.options.D}</span></div>
                            </div>
                          </div>
                          {/* Pure Blank White Space for calculations (No borders, no labels) */}
                          <div className="flex-1 min-h-[180px]" />
                        </div>
                      ))}
                    </div>
                  ) : compactColumnMode === '2-col' ? (
                    <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2.5 content-between">
                      {(pagesArray[previewModalPage - 1] || []).map((q) => (
                        <div key={q.id} className="border-b border-slate-200 pb-1.5 flex flex-col justify-start">
                          <div className="flex items-start gap-1.5 mb-1">
                            <span className="font-bold text-xs text-slate-900 shrink-0">{q.id}.</span>
                            <p className="text-xs font-bold text-slate-900 leading-snug">{q.question}</p>
                          </div>
                          {enableVectorDiagrams && q.diagramSvg && (
                            <div
                              className="my-1 flex justify-center items-center p-1 bg-slate-50 rounded border border-slate-200 max-w-[150px] max-h-[46px] mx-auto overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                            />
                          )}
                          <div className="grid grid-cols-1 gap-y-0.5 pl-3 text-[11px] text-slate-800">
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">1.</span><span>{q.options.A}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">2.</span><span>{q.options.B}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">3.</span><span>{q.options.C}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-1.5 shrink-0">4.</span><span>{q.options.D}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      {(pagesArray[previewModalPage - 1] || []).map((q) => (
                        <div key={q.id} className="border-b border-slate-200 pb-1.5 last:border-b-0">
                          <div className="flex items-start gap-2 mb-1">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 shrink-0">{q.id}.</span>
                            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">{q.question}</p>
                          </div>
                          {enableVectorDiagrams && q.diagramSvg && (
                            <div
                              className="my-1.5 inline-flex justify-center items-center p-1 bg-slate-50 rounded border border-slate-200 max-w-[180px] max-h-[50px] ml-6 overflow-hidden"
                              dangerouslySetInnerHTML={{ __html: q.diagramSvg }}
                            />
                          )}
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1 pl-6 text-xs text-slate-800">
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">1.</span><span>{q.options.A}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">2.</span><span>{q.options.B}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">3.</span><span>{q.options.C}</span></div>
                            <div className="flex items-start"><span className="font-bold text-slate-900 mr-2 shrink-0">4.</span><span>{q.options.D}</span></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="relative z-10 border-t border-slate-300 pt-2 text-[10px] text-slate-500 font-mono flex justify-between mt-3">
                  <span>{!shouldHideWatermarkAndBrand ? 'SEVEN SPACE LABS - EXAM PAPER' : ''}</span>
                  <span>หน้า {previewModalPage} / {totalPages}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                disabled={previewModalPage <= 1}
                onClick={() => setPreviewModalPage((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>หน้าก่อนหน้า</span>
              </button>
              <div className="text-xs font-mono text-cyan-300 font-bold">
                หน้าที่ {previewModalPage} จาก {totalPages}
              </div>
              <button
                disabled={previewModalPage >= totalPages}
                onClick={() => setPreviewModalPage((prev) => Math.min(totalPages, prev + 1))}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <span>หน้าถัดไป</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Coins Modal */}
      {isCoinModalOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-slate-100 space-y-5">
            <button
              type="button"
              onClick={() => setIsCoinModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg">
              <Coins className="w-8 h-8" />
            </div>

            <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider">
              COSMIC COINS INSUFFICIENT
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-2 leading-snug">
                ยอดเหรียญ Cosmic Coins ไม่เพียงพอ
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                เอกสารนี้มี <strong>{detectedPages} หน้า</strong> ต้องใช้ทั้งหมด <strong>{requiredCoinsForDoc} Cosmic Coins</strong> (5 Coins/หน้า)
                <br />
                แต่ปัจจุบันคุณมียอดคงเหลือเพียง <strong className="text-amber-300">{userCoins} Coins</strong>
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsCoinModalOpen(false);
                  if (onOpenPremiumModal) {
                    onOpenPremiumModal();
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Crown className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>อัปเกรดเป็น Premium เพื่อรับ 1,000 Coins ทันที</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCoinModalOpen(false);
                  if (onOpenRankHub) {
                    onOpenRankHub();
                  }
                }}
                className="w-full py-3.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700"
              >
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>ทำภารกิจสะสมพลังงานประจำวันเพื่อนำมาแลกเหรียญเพิ่ม</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
