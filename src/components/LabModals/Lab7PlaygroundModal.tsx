import React, { useState, useEffect } from 'react';
import {
  X,
  Search,
  Sparkles,
  Play,
  RotateCcw,
  Flame,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  Share2,
  Users,
  CheckCircle2,
  Plus,
  HelpCircle,
  Clock,
  Layers,
  Zap,
  Star,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Trophy,
  Copy,
  Check,
  Send,
  Eye,
  Settings,
  Tv,
  Compass,
  Radio,
  Sliders,
  Bookmark,
  Crown,
  FileText,
  Download,
  ThumbsUp,
  MessageSquare,
  Video,
  FileDown,
  Maximize2,
  Minimize2,
  BookMarked,
  Filter,
  CheckCircle,
  AlertCircle,
  UserCheck,
  UserPlus,
  ArrowUpRight,
  GraduationCap,
  Trash2,
  Timer,
  Target,
  TrendingUp,
  BarChart3,
  Lock,
  PenTool,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { Language, CadetProfile } from '../../types';
import { isUserAdminOrDev } from '../../utils/quotaService';

interface Lab7PlaygroundModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user?: CadetProfile | null;
  isCadetPremium?: boolean;
  onOpenUpgrade?: () => void;
}

// ---------------------------------------------------------------------------
// DATA TYPES
// ---------------------------------------------------------------------------
export interface QuizQuestion {
  id: string;
  text: string;
  formula?: string;
  options: string[];
  correctIndex: number;
  timeLimit: number;
  points: number;
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
  headerColor: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ยาก';
  participants: string;
  participantCount: number;
  questionCount: number;
  category: string;
  tags: string[];
  author: {
    name: string;
    avatar: string;
    timeAgo: string;
  };
  questions: QuizQuestion[];
  flashcards: {
    term: string;
    definition: string;
    formula?: string;
  }[];
  learnNotes: string[];
}

export interface CreatorVideo {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  views: string;
  embedUrl: string;
  category: string;
  summary: string;
  keyPoints: { title: string; formula?: string; detail: string }[];
  chapters: { time: string; title: string }[];
}

export interface CreatorSheet {
  id: string;
  title: string;
  category: string;
  pages: number;
  fileSize: string;
  description: string;
  previewUrl: string;
  downloadCount: string;
  highlights: string[];
}

export interface QnAPost {
  id: string;
  question: string;
  author: string;
  authorAvatar: string;
  timeAgo: string;
  likes: number;
  hasLiked?: boolean;
  topicTag: string;
  formula?: string;
  creatorAnswer?: {
    author: string;
    avatar: string;
    verified: boolean;
    text: string;
    timeAgo: string;
  };
}

export interface CreatorProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  avatarBg: string;
  coverGradient: string;
  badge: string;
  category: string;
  followers: number;
  followersFormatted: string;
  courseCount: number;
  quizCount: number;
  sheetCount: number;
  rating: number;
  bio: string;
  tagline: string;
  specialties: string[];
  videos: CreatorVideo[];
  quizzes: QuizItem[];
  sheets: CreatorSheet[];
  qnaPosts: QnAPost[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  isUser?: boolean;
}

// ---------------------------------------------------------------------------
// CREATORS DATASET (Rich In-App Internal Resources)
// ---------------------------------------------------------------------------
const CREATOR_CHANNELS: CreatorProfile[] = [
  {
    id: 'creator-physics-no7',
    name: 'ครูฟิสิกส์ No.7 (Physics No.7)',
    handle: '@physics_no7',
    avatar: '👨‍🏫',
    avatarBg: 'bg-violet-600',
    coverGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]',
    badge: 'VERIFIED PARTNER',
    category: 'ฟิสิกส์ ม.ปลาย',
    followers: 145800,
    followersFormatted: '145.8k',
    courseCount: 24,
    quizCount: 16,
    sheetCount: 12,
    rating: 4.9,
    tagline: 'เข้าใจฟิสิกส์แบบเห็นภาพ ตะลุยโจทย์ประยุกต์ และเตรียมสอบเข้ามหาวิทยาลัยชั้นนำ',
    bio: 'ศูนย์รวมโจทย์ฟิสิกส์ ม.ปลาย สอวน. และ TCAS A-Level เจาะลึกสูตรการคำนวณ เทคนิคตัดช้อยส์ และควิซประลองความเร็วสไตล์ Kahoot',
    specialties: ['กลศาสตร์ประยุกต์', 'ไฟฟ้าและแม่เหล็ก', 'คลื่นและเสียง', 'เตรียมสอบ A-Level'],
    videos: [
      {
        id: 'vid-no7-01',
        title: '01. เจาะลึก 3 กฎการเคลื่อนที่ของนิวตัน & เทคนิคแตกแรง 2 มิติ',
        subtitle: 'บทเรียนกลศาสตร์พื้นฐาน สรุปคอนเซปต์แรงเสียดทานและโมเมนตัม',
        duration: '28:45',
        views: '42.5k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'กลศาสตร์',
        summary: 'ทำความเข้าใจกฎการเคลื่อนที่ของนิวตันทั้ง 3 ข้อ การวิเคราะห์ Free Body Diagram และการคำนวณแรงลัพธ์ ∑F = ma',
        keyPoints: [
          { title: 'กฎข้อที่ 1 (ความเฉื่อย)', formula: '∑F = 0 ⇒ v = constant', detail: 'วัตถุรักษาสภาพการเคลื่อนที่เดิมเมื่อไม่มีแรงลัพธ์มากระทำ' },
          { title: 'กฎข้อที่ 2 (ความเร่ง)', formula: '∑F = ma', detail: 'ความเร่งแปรผันตามแรงลัพธ์และแปรผกผันกับมวลของวัตถุ' },
          { title: 'กฎข้อที่ 3 (แรงกิริยา-ปฏิกิริยา)', formula: 'F₁₂ = -F₂₁', detail: 'แรงกิริยาและแรงปฏิกิริยาเกิดพร้อมกัน มีขนาดเท่ากัน ทิศทางตรงข้าม กระทำต่อวัตถุคนละก้อน' },
        ],
        chapters: [
          { time: '00:00', title: 'บทนำ & ปริมาณเวกเตอร์' },
          { time: '05:30', title: 'Free Body Diagram' },
          { time: '14:20', title: 'การคำนวณแรงเสียดทาน fs, fk' },
          { time: '22:15', title: 'ตัวอย่างโจทย์สอบเข้า TCAS' },
        ],
      },
      {
        id: 'vid-no7-02',
        title: '02. ตะลุยโจทย์ ไฟฟ้าสถิต & สนามไฟฟ้าระหว่างแผ่นคู่ขนาน',
        subtitle: 'เตรียมสอบ A-Level ฟิสิกส์ กฎของคูลอมบ์ ศักย์ไฟฟ้า ตัวเก็บประจุ',
        duration: '35:20',
        views: '38.9k',
        embedUrl: 'https://www.youtube.com/embed/tJnJ_fL2qP0',
        category: 'ไฟฟ้า',
        summary: 'วิเคราะห์แรงระหว่างประจุไฟฟ้า สนามไฟฟ้า เส้นแรงไฟฟ้า ศักย์ไฟฟ้า และงานในการย้ายประจุในสนามไฟฟ้าสม่ำเสมอ',
        keyPoints: [
          { title: 'กฎของคูลอมบ์', formula: 'F = k·(q₁q₂)/r²', detail: 'แรงดึงดูดหรือผลักระหว่างประจุจุดสองจุดแปรผกผันกับระยะทางยกกำลังสอง' },
          { title: 'สนามไฟฟ้า', formula: 'E = F/q = kQ/r²', detail: 'แรงกระทำต่อประจุทดสอบบวก 1 คูลอมบ์' },
          { title: 'พลังงานศักย์ไฟฟ้า', formula: 'U = kq₁q₂/r', detail: 'งานที่ต้องทำเพื่อนำประจุจากระยะอนันต์มายังตำแหน่งที่กำหนด' },
        ],
        chapters: [
          { time: '00:00', title: 'คุณสมบัติของประจุไฟฟ้า' },
          { time: '08:40', title: 'การหาจุดสะเทินในสนามไฟฟ้า' },
          { time: '19:10', title: 'สนามไฟฟ้าระหว่างแผ่นคู่ขนาน' },
          { time: '28:50', title: 'โจทย์ประยุกต์หยดน้ำมันมิลลิแกน' },
        ],
      },
      {
        id: 'vid-no7-03',
        title: '03. สรุปคลื่นกล แสง และเสียง ใน 40 นาที เข้าใจทะลุปรุโปร่ง',
        subtitle: 'การแทรกสอด เลี้ยวเบน ดอปเปลอร์ และการสั่นพ้องในท่อ',
        duration: '41:10',
        views: '51.2k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'คลื่น',
        summary: 'ครบทุกสมบัติคลื่น: สะท้อน หักเห แทรกสอด เลี้ยวเบน พร้อมสมการอัตราเร็วคลื่น v = fλ และปรากฏการณ์ดอปเปลอร์',
        keyPoints: [
          { title: 'สมการคลื่นพื้นฐาน', formula: 'v = fλ', detail: 'ความเร็วคลื่นเท่ากับความถี่คูณความยาวคลื่น' },
          { title: 'กฎของสเนลล์', formula: 'n₁ sin θ₁ = n₂ sin θ₂', detail: 'การหักเหของคลื่นเมื่อเคลื่อนที่ผ่านตัวกลางต่างชนิด' },
          { title: 'การสั่นพ้องในท่อปลายปิด', formula: 'f = (2n-1)v / 4L', detail: 'ความถี่ฮาร์มอนิกที่ทำให้เกิดเสียงดังที่สุด' },
        ],
        chapters: [
          { time: '00:00', title: 'ชนิดและสมบัติคลื่นกล' },
          { time: '12:00', title: 'การแทรกสอดช่องคู่ของยังก์' },
          { time: '25:30', title: 'คลื่นเสียง & ระดับความเข้มเสียง' },
          { time: '35:00', title: 'สูตรดอปเปลอร์และคลื่นกระแทก' },
        ],
      },
    ],
    quizzes: [
      {
        id: 'exam-01',
        title: 'กฎของนิวตัน - Newton Laws',
        description: 'ตะลุย 3 กฎการเคลื่อนที่ของนิวตัน พร้อมคำนวณแรงเสียดทาน โมเมนตัม และการประยุกต์ในโจทย์ฟิสิกส์',
        emoji: '🚀',
        headerColor: '#7C3AED',
        difficulty: 'ปานกลาง',
        participants: '14.8k',
        participantCount: 14800,
        questionCount: 12,
        category: 'กลศาสตร์',
        tags: ['#กลศาสตร์', '#นิวตัน', '#แรง'],
        author: {
          name: 'ครูฟิสิกส์ No.7',
          avatar: '👨‍🏫',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'q1-1',
            text: 'วัตถุมวล 2 kg ถูกแรง 10 N ดึงในแนวราบ ความเร่งที่เกิดขึ้นเป็นเท่าใด?',
            formula: 'F = ma',
            options: ['5 m/s²', '20 m/s²', '0.2 m/s²', '12 m/s²'],
            correctIndex: 0,
            timeLimit: 30,
            points: 1000,
            explanation: 'จากสูตร F = ma จะได้ a = F / m = 10 / 2 = 5 m/s²',
          },
          {
            id: 'q1-2',
            text: 'กฎข้อที่ 3 ของนิวตัน (Action = Reaction) กล่าวถึงเรื่องใด?',
            formula: 'F_{action} = -F_{reaction}',
            options: [
              'แรงกิริยา = แรงปฏิกิริยา ทิศตรงข้าม กระทำต่อวัตถุคนละก้อน',
              'วัตถุหยุดนิ่งเสมอเมื่อแรงลัพธ์เท่ากับศูนย์',
              'แรงลัพธ์เท่ากับมวลคูณความเร่งของการเคลื่อนที่',
              'พลังงานกลรวมของระบบมีค่าคงที่เสมอ',
            ],
            correctIndex: 0,
            timeLimit: 20,
            points: 800,
            explanation: 'ทุกแรงกิริยาย่อมมีแรงปฏิกิริยาขนาดเท่ากันและทิศทางตรงกันข้ามเสมอ และกระทำต่อวัตถุคนละก้อน',
          },
          {
            id: 'q1-3',
            text: 'เมื่อปล่อยวัตถุตกอย่างอิสระภายใต้แรงโน้มถ่วง ความเร่งมีค่าเท่าใด?',
            formula: 'a = g \\approx 9.8\\text{ m/s}^2',
            options: ['9.8 m/s²', '0 m/s²', '19.6 m/s²', 'แปรผันตามมวลของวัตถุ'],
            correctIndex: 0,
            timeLimit: 15,
            points: 700,
            explanation: 'วัตถุทุกชิ้นตกอย่างอิสระด้วยความเร่งโน้มถ่วง g ≈ 9.8 m/s² โดยไม่ขึ้นกับมวล',
          },
        ],
        flashcards: [
          {
            term: 'กฎข้อที่ 1 (Law of Inertia)',
            definition: 'วัตถุจะรักษาสภาพหยุดนิ่งหรือเคลื่อนที่ด้วยความเร็วคงที่ในแนวเส้นตรง เว้นแต่จะมีแรงลัพธ์ที่ไม่เป็นศูนย์มากระทำ',
            formula: '\\sum \\vec{F} = 0 \\implies \\vec{v} = \\text{constant}',
          },
          {
            term: 'กฎข้อที่ 2 (Law of Acceleration)',
            definition: 'ความเร่งของวัตถุแปรผันตรงกับแรงลัพธ์ที่กระทำต่อวัตถุ และแปรผกผันกับมวลของวัตถุ',
            formula: '\\sum \\vec{F} = m\\vec{a}',
          },
          {
            term: 'กฎข้อที่ 3 (Action-Reaction)',
            definition: 'เมื่อวัตถุหนึ่งออกแรงกระทำต่ออีกวัตถุหนึ่ง วัตถุที่สองจะออกแรงกระทำกลับด้วยขนาดเท่ากันแต่ทิศทางตรงกันข้าม',
            formula: '\\vec{F}_{12} = -\\vec{F}_{21}',
          },
        ],
        learnNotes: [
          'มวล (Mass) เป็นปริมาณสเกลาร์ บ่งบอกถึงความเฉื่อยในการเปลี่ยนสภาพการเคลื่อนที่ (หน่วย kg)',
          'น้ำหนัก (Weight) คือแรงโน้มถ่วงที่โลกดึงดูดวัตถุ W = mg (หน่วย N)',
          'แรงเสียดทานสถิตสูงสุด fs(max) = μs·N และแรงเสียดทานจลน์ fk = μk·N',
        ],
      },
      {
        id: 'exam-02',
        title: 'ไฟฟ้าสถิต ⚡ สนามไฟฟ้า & ศักย์ไฟฟ้า',
        description: 'เข้าใจประจุไฟฟ้า กฎของคูลอมบ์ สนามไฟฟ้า ศักย์ไฟฟ้า ตัวเก็บประจุ แบบจัดเต็ม',
        emoji: '⚡',
        headerColor: '#0EA5E9',
        difficulty: 'ยาก',
        participants: '9.8k',
        participantCount: 9800,
        questionCount: 15,
        category: 'ไฟฟ้า',
        tags: ['#ไฟฟ้า', '#คูลอมบ์', '#สนามไฟฟ้า'],
        author: {
          name: 'ครูฟิสิกส์ No.7',
          avatar: '👨‍🏫',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'q2-1',
            text: 'แรงระหว่างประจุ 2 ประจุ แปรผันตามสิ่งใด?',
            formula: 'F = k \\cdot \\frac{q_1 q_2}{r^2}',
            options: ['1 / r²', 'r²', 'r', '1 / r'],
            correctIndex: 0,
            timeLimit: 25,
            points: 1000,
            explanation: 'ตามกฎของคูลอมบ์ แรงดึงดูดหรือผลักระหว่างประจุจะแปรผกผันกับระยะทางยกกำลังสอง (1/r²)',
          },
        ],
        flashcards: [
          {
            term: "กฎของคูลอมบ์ (Coulomb's Law)",
            definition: 'แรงระหว่างประจุไฟฟ้าจุดสองจุดแปรผันตรงกับผลคูณของขนาดประจุ และแปรผกผันกับกำลังสองของระยะห่าง',
            formula: 'F = \\frac{1}{4\\pi \\epsilon_0} \\frac{|q_1 q_2|}{r^2}',
          },
        ],
        learnNotes: ['เส้นแรงไฟฟ้าพุ่งออกจากประจุบวกและพุ่งเข้าหาประจุลบ'],
      },
    ],
    sheets: [
      {
        id: 'sheet-no7-01',
        title: 'สูตรลับฟิสิกส์ ม.ปลาย แผ่นเดียวจบ (One-Page Mechanics & Electromagnetism)',
        category: 'สรุปสูตร A-Level',
        pages: 2,
        fileSize: '1.8 MB',
        description: 'รวบรวมทุกสมการฟิสิกส์ ม.4-ม.6 ที่ออกสอบบ่อย พร้อมเงื่อนไขการใช้สูตรและหน่วยสากล',
        previewUrl: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        downloadCount: '12.4k',
        highlights: ['สมการการเคลื่อนที่ 5 สูตรหลัก', 'กฎการอนุรักษ์พลังงาน & โมเมนตัม', 'ไฟฟ้ากระแสตรง & วงจรไฟฟ้า', 'คลื่นกล & เสียง'],
      },
    ],
    qnaPosts: [
      {
        id: 'qna-no7-01',
        question: 'ทำไมตอนใช้สูตร v² = u² + 2as ทิศทางของความเร่ง a ต้องกำหนดเครื่องหมายบวก-ลบเทียบกับ u เสมอครับ?',
        author: 'Cadet_Beam',
        authorAvatar: '👨‍🎓',
        timeAgo: '2 ชั่วโมงที่แล้ว',
        likes: 18,
        topicTag: 'กลศาสตร์',
        formula: 'v^2 = u^2 + 2as',
        creatorAnswer: {
          author: 'ครูฟิสิกส์ No.7',
          avatar: '👨‍🏫',
          verified: true,
          text: 'เพราะปริมาณในสมการนี้เป็น "เวกเตอร์" ทั้งหมดครับ โดยหลักการแล้วเราจะยึด "ทิศทางของความเร็วต้น u เป็นทิศบวก (+)" เสมอ หากความเร่ง a มีทิศตรงข้ามกับ u เราจึงต้องใส่เครื่องหมายลบ (-) ให้ความเร่งเพื่อคำนวณขนาดและทิศทางได้ถูกต้องครับ!',
          timeAgo: '1 ชั่วโมงที่แล้ว',
        },
      },
    ],
  },
  {
    id: 'creator-ko-aek',
    name: 'ฟิสิกส์โกเอก TCAS (Physics Ko-Aek)',
    handle: '@physics_koaek',
    avatar: '🎯',
    avatarBg: 'bg-amber-500',
    coverGradient: 'from-[#78350F] via-[#B45309] to-[#F59E0B]',
    badge: 'VERIFIED PARTNER',
    category: 'TCAS & A-Level',
    followers: 289400,
    followersFormatted: '289.4k',
    courseCount: 42,
    quizCount: 28,
    sheetCount: 18,
    rating: 5.0,
    tagline: 'ฟิสิกส์เข้าใจง่าย ไม่ต้องท่องสูตร เน้นความเข้าใจลึกซึ้งและเทคนิคคิดลัด',
    bio: 'ติวเตอร์ฟิสิกส์ขวัญใจนักเรียนไทย สอนเทคนิคตีโจทย์ฟิสิกส์ยากๆ ให้ง่าย มองโจทย์ออกใน 30 วินาที พร้อมเฉลยข้อสอบ A-Level ย้อนหลัง 10 ปี',
    specialties: ['เทคนิคตัดช้อยส์ A-Level', 'งานและพลังงาน', 'ฟิสิกส์อะตอมและนิวเคลียร์', 'สอวน. คัดเลือก'],
    videos: [
      {
        id: 'vid-ka-01',
        title: 'เฉลยโจทย์ดักคะแนน A-Level ฟิสิกส์ เรื่อง งาน พลังงาน และกำลัง',
        subtitle: 'เทคนิคแก้โจทย์อนุรักษ์พลังงานกลแบบไม่ต้องเขียนสมการยาว',
        duration: '34:10',
        views: '68.2k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'พลังงาน',
        summary: 'วิเคราะห์กฎอนุรักษ์พลังงาน E₁ = E₂ และงานของแรงภายนอก W = ΔE อย่างละเอียด',
        keyPoints: [
          { title: 'กฎอนุรักษ์พลังงาน', formula: 'E_k1 + E_p1 + W_other = E_k2 + E_p2', detail: 'พลังงานรวมไม่มีวันสูญหาย เพียงแต่เปลี่ยนรูปไป' },
        ],
        chapters: [
          { time: '00:00', title: 'จุดผิดบ่อยเรื่องงาน W = F·s·cos θ' },
          { time: '15:00', title: 'พลังงานศักย์ยืดหยุ่นสปริง' },
        ],
      },
    ],
    quizzes: [
      {
        id: 'exam-ka-01',
        title: 'งานและพลังงานกล - Work & Energy Mastery',
        description: 'ทดสอบความเข้าใจเรื่องงาน พลังงานจลน์ พลังงานศักย์ และกำลังงาน',
        emoji: '⚡',
        headerColor: '#F59E0B',
        difficulty: 'ปานกลาง',
        participants: '18.2k',
        participantCount: 18200,
        questionCount: 10,
        category: 'พลังงาน',
        tags: ['#พลังงาน', '#งาน', '#กำลัง'],
        author: {
          name: 'ฟิสิกส์โกเอก TCAS',
          avatar: '🎯',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'qka-1',
            text: 'งาน (Work) ที่เกิดจากแรงคงที่ F กระทำต่อวัตถุเคลื่อนที่เป็นระยะทาง s ทำมุม θ มีค่าเท่าใด?',
            formula: 'W = F s \\cos\\theta',
            options: ['F s cos θ', 'F s sin θ', '½ m v²', 'F / s'],
            correctIndex: 0,
            timeLimit: 20,
            points: 1000,
            explanation: 'งาน W = F · s · cos θ โดย θ คือมุมระหว่างทิศของแรงกับทิศการกระจัด',
          },
        ],
        flashcards: [
          {
            term: 'พลังงานจลน์ (Kinetic Energy)',
            definition: 'พลังงานที่มีอยู่ในวัตถุอันเนื่องมาจากความเร็วของการเคลื่อนที่',
            formula: 'E_k = \\frac{1}{2}mv^2',
          },
        ],
        learnNotes: ['แรงที่ตั้งฉากกับการเคลื่อนที่ (θ = 90°) จะไม่ก่อให้เกิดงาน (W = 0) เสมอ'],
      },
    ],
    sheets: [
      {
        id: 'sheet-ka-01',
        title: 'สรุปสูตรฟิสิกส์โกเอก ฉบับ TCAS A-Level ลุยสนามจริง',
        category: 'สรุปสูตรสอบเข้า',
        pages: 3,
        fileSize: '2.5 MB',
        description: 'รวมเทคนิคทางลัดและข้อควรระวังในห้องสอบ A-Level',
        previewUrl: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        downloadCount: '21.5k',
        highlights: ['ตารางเปรียบเทียบเชิงเส้น-เชิงมุม', 'เทคนิคคิดลัดวงจรกระแสสลับ', 'สรุปฟิสิกส์นิวเคลียร์'],
      },
    ],
    qnaPosts: [
      {
        id: 'qna-ka-01',
        question: 'ในข้อสอบพลังงาน ถ้ามีแรงเสียดทาน งานของแรงเสียดทานต้องคิดเป็นบวกหรือลบครับ?',
        author: 'SkyWalker_TH',
        authorAvatar: '👨‍🚀',
        timeAgo: '1 วันที่แล้ว',
        likes: 31,
        topicTag: 'พลังงาน',
        creatorAnswer: {
          author: 'ฟิสิกส์โกเอก TCAS',
          avatar: '🎯',
          verified: true,
          text: 'คิดเป็น "ลบ (-)" หรือคิดเป็น "งานที่สูญเสียไปกับความร้อน" ครับ! เพราะแรงเสียดทาน fk มีทิศทางตรงข้ามกับการกระจัด s เสมอ ทำให้มุม θ = 180° และ cos(180°) = -1 ดังนั้น W_f = -fk·s เสมอครับ',
          timeAgo: '20 ชั่วโมงที่แล้ว',
        },
      },
    ],
  },
  {
    id: 'creator-spaceth',
    name: 'Spaceth.co Cosmos',
    handle: '@spaceth_co',
    avatar: '🪐',
    avatarBg: 'bg-cyan-600',
    coverGradient: 'from-[#0C4A6E] via-[#0284C7] to-[#38BDF8]',
    badge: 'VERIFIED PARTNER',
    category: 'ดาราศาสตร์ & อวกาศ',
    followers: 198200,
    followersFormatted: '198.2k',
    courseCount: 30,
    quizCount: 14,
    sheetCount: 8,
    rating: 4.9,
    tagline: 'สำรวจเอกภพ ฟิสิกส์ดาราศาสตร์ และวิทยาการสำรวจอวกาศยุคใหม่',
    bio: 'สื่อวิทยาศาสตร์และอวกาศชั้นนำของไทย ถ่ายทอดความรู้กลศาสตร์วงโคจร ฟิสิกส์สัมพัทธภาพ และหลุมดำแบบลึกซึ้ง เข้าถึงได้ทุกคน',
    specialties: ['ฟิสิกส์ดาราศาสตร์', 'กลศาสตร์วงโคจรของเคปเลอร์', 'สัมพัทธภาพพิเศษ', 'การสำรวจอวกาศ'],
    videos: [
      {
        id: 'vid-sp-01',
        title: 'ฟิสิกส์แห่งหลุมดำและกาลอวกาศโค้งงอ (Black Hole Physics & Spacetime)',
        subtitle: 'ทฤษฎีสัมพัทธภาพทั่วไปของไอน์สไตน์ และการค้นพบคลื่นความโน้มถ่วง',
        duration: '38:00',
        views: '94.1k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'อวกาศ',
        summary: 'ศึกษาความโค้งของกาลอวกาศ ขอบฟ้าเหตุการณ์ (Event Horizon) และการขยายตัวของเอกภพ',
        keyPoints: [
          { title: 'รัศมีชวาร์ซชิลด์', formula: 'r_s = \\frac{2GM}{c^2}', detail: 'รัศมีของขอบฟ้าเหตุการณ์ของหลุมดำที่ไม่หมุน' },
        ],
        chapters: [
          { time: '00:00', title: 'ไอน์สไตน์และความโน้มถ่วง' },
          { time: '18:30', title: 'โครงสร้างของหลุมดำ' },
        ],
      },
    ],
    quizzes: [
      {
        id: 'exam-sp-01',
        title: 'ฟิสิกส์ดาราศาสตร์และกลศาสตร์เคปเลอร์ 🌌',
        description: 'กฎ 3 ข้อของเคปเลอร์ ความเร็วหลุดพ้น และแรงโน้มถ่วงสากล',
        emoji: '🪐',
        headerColor: '#0284C7',
        difficulty: 'ยาก',
        participants: '15.6k',
        participantCount: 15600,
        questionCount: 8,
        category: 'กลศาสตร์',
        tags: ['#ดาราศาสตร์', '#เคปเลอร์', '#ความโน้มถ่วง'],
        author: {
          name: 'Spaceth.co Cosmos',
          avatar: '🪐',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'qsp-1',
            text: 'ความเร็วหลุดพ้น (Escape Velocity) จากผิวดาวเคราะห์คำนวณได้จากสมการใด?',
            formula: 'v_{esc} = \\sqrt{\\frac{2GM}{R}}',
            options: ['√(2GM / R)', '√(GM / R)', '2GM / R²', 'GM / R'],
            correctIndex: 0,
            timeLimit: 25,
            points: 1000,
            explanation: 'ความเร็วหลุดพ้น v_esc = √(2GM / R) หาได้จากการตั้งพลังงานกลรวมเป็นศูนย์ที่ระยะอนันต์',
          },
        ],
        flashcards: [
          {
            term: 'กฎข้อที่ 3 ของเคปเลอร์',
            definition: 'กำลังสองของคาบการโคจรแปรผันตรงกับกำลังสามของกึ่งแกนเอกของวงโคจร',
            formula: 'T^2 \\propto a^3',
          },
        ],
        learnNotes: ['ความเร็วในการโคจรเป็นวงกลมรอบโลกที่ระดับความสูง h คือ v_orb = √(GM / (R + h))'],
      },
    ],
    sheets: [
      {
        id: 'sheet-sp-01',
        title: 'คู่มือฟิสิกส์ดาราศาสตร์ & สมการจักรวาลวิทยา',
        category: 'ดาราศาสตร์',
        pages: 5,
        fileSize: '4.1 MB',
        description: 'สรุปเนื้อหาดาราศาสตร์ สอวน. และปรากฏการณ์บนท้องฟ้า',
        previewUrl: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        downloadCount: '9.2k',
        highlights: ['กฎของสเตฟาน-โบลต์ซมันน์', 'สเปกตรัมของดาวฤกษ์', 'แผนภาพ HR Diagram'],
      },
    ],
    qnaPosts: [
      {
        id: 'qna-sp-01',
        question: 'ทำไมดาวเทียมที่โคจรอยู่รอบโลกถึงไม่ตกลงมาใส่โลก ทั้งๆ ที่มีแรงโน้มถ่วงดึงดูดอยู่ตลอดเวลาครับ?',
        author: 'Astro_Tonkla',
        authorAvatar: '🚀',
        timeAgo: '1 วันที่แล้ว',
        likes: 45,
        topicTag: 'ดาราศาสตร์',
        creatorAnswer: {
          author: 'Spaceth.co Cosmos',
          avatar: '🪐',
          verified: true,
          text: 'เพราะดาวเทียมกำลัง "ตกอย่างต่อเนื่องรอบความโค้งของโลก" ครับ! ความเร็วในแนวสัมผัสของดาวเทียมเร็วพอที่จะทำให้ระยะการตกของมันโค้งขนานไปกับความโค้งของผิวโลกพอดี (v ≈ 7.8 km/s) ทำให้มันคงระดับความสูงเดิมได้ครับ',
          timeAgo: '18 ชั่วโมงที่แล้ว',
        },
      },
    ],
  },
  {
    id: 'creator-kurzgesagt',
    name: 'Kurzgesagt TH (In a Nutshell)',
    handle: '@kurzgesagt_th',
    avatar: '🦆',
    avatarBg: 'bg-rose-600',
    coverGradient: 'from-[#881337] via-[#E11D48] to-[#FB7185]',
    badge: 'VERIFIED PARTNER',
    category: 'วิทยาศาสตร์ & ฟิสิกส์อนุภาค',
    followers: 412000,
    followersFormatted: '412.0k',
    courseCount: 36,
    quizCount: 20,
    sheetCount: 15,
    rating: 5.0,
    tagline: 'ฟิสิกส์อนุภาค กลศาสตร์ควอนตัม และความลึกลับของจักรวาลในแอนิเมชันระดับโลก',
    bio: 'อธิบายแนวคิดฟิสิกส์ขั้นสูง ควอนตัมฟิสิกส์ ปฏิสสาร และวิวัฒนาการดาวฤกษ์ให้เข้าใจง่าย ชัดเจน และน่าหลงใหล',
    specialties: ['ควอนตัมฟิสิกส์', 'ฟิสิกส์อนุภาค', 'เทอร์โมไดนามิกส์', 'การกำเนิดเอกภพ'],
    videos: [
      {
        id: 'vid-kz-01',
        title: 'กลศาสตร์ควอนตัมคืออะไร? อนุภาคหรือคลื่น และหลักความไม่แน่นอน',
        subtitle: 'การทดลองการเลี้ยวเบนของอิเล็กตรอนและฟิสิกส์แห่งความน่าจะเป็น',
        duration: '22:15',
        views: '128.4k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'ควอนตัม',
        summary: 'เจาะลึกสมการของชเรอดิงเงอร์ ปรากฏการณ์โฟโตอิเล็กทริก และฟังก์ชันคลื่น',
        keyPoints: [
          { title: 'หลักความไม่แน่นอนของไฮเซนเบิร์ก', formula: '\\Delta x \\cdot \\Delta p \\ge \\frac{\\hbar}{2}', detail: 'ไม่สามารถระบุตำแหน่งและโมเมนตัมของอนุภาคพร้อมกันได้อย่างแม่นยำแน่นอน' },
        ],
        chapters: [
          { time: '00:00', title: 'โลกของอนุภาคขนาดเล็ก' },
          { time: '10:00', title: 'ทวิภาวะคลื่น-อนุภาค' },
        ],
      },
    ],
    quizzes: [
      {
        id: 'exam-kz-01',
        title: 'ควอนตัม & ฟิสิกส์อะตอมเบื้องต้น ⚛️',
        description: 'สมมติฐานของเดอบรอยล์ โฟตอน พลังงานของแสง และแบบจำลองอะตอม',
        emoji: '⚛️',
        headerColor: '#E11D48',
        difficulty: 'ยาก',
        participants: '22.4k',
        participantCount: 22400,
        questionCount: 10,
        category: 'ฟิสิกส์',
        tags: ['#ควอนตัม', '#โฟตอน', '#อะตอม'],
        author: {
          name: 'Kurzgesagt TH',
          avatar: '🦆',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'qkz-1',
            text: 'พลังงานของโฟตอนหนึ่งตัวแปรผันตรงกับปริมาณใด?',
            formula: 'E = hf = \\frac{hc}{\\lambda}',
            options: ['ความถี่ (f)', 'ความยาวคลื่น (λ)', 'แอมพลิจูด (A)', 'มวลนิ่ง (m0)'],
            correctIndex: 0,
            timeLimit: 20,
            points: 1000,
            explanation: 'ตามสมการของพลังค์ E = hf พลังงานโฟตอนแปรผันตรงกับความถี่ของคลื่นแม่เหล็กไฟฟ้า',
          },
        ],
        flashcards: [
          {
            term: 'ความยาวคลื่นเดอบรอยล์',
            definition: 'สสารที่มีโมเมนตัม p จะประพฤติตัวเป็นคลื่นที่มีความยาวคลื่น λ',
            formula: '\\lambda = \\frac{h}{p} = \\frac{h}{mv}',
          },
        ],
        learnNotes: ['ค่าคงที่ของพลังค์ h ≈ 6.626 × 10⁻³⁴ J·s'],
      },
    ],
    sheets: [
      {
        id: 'sheet-kz-01',
        title: 'สรุปฟิสิกส์อะตอม ฟิสิกส์นิวเคลียร์ & อนุภาค',
        category: 'ฟิสิกส์ยุคใหม่',
        pages: 4,
        fileSize: '3.8 MB',
        description: 'สรุปปรากฏการณ์โฟโตอิเล็กทริก รังสีเอกซ์ กัมมันตภาพรังสี และปฏิกิริยานิวเคลียร์',
        previewUrl: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        downloadCount: '15.8k',
        highlights: ['สมการไอน์สไตน์โฟโตอิเล็กทริก', 'ครึ่งชีวิต & กฎการสลายตัว', 'ฟิชชัน vs ฟิวชัน'],
      },
    ],
    qnaPosts: [
      {
        id: 'qna-kz-01',
        question: 'ทำไมแสงถึงมีทั้งสมบัติความเป็นคลื่นและอนุภาคพร้อมกันได้ครับ?',
        author: 'Junior_Scientist',
        authorAvatar: '🧪',
        timeAgo: '2 วันที่แล้ว',
        likes: 52,
        topicTag: 'ควอนตัม',
        creatorAnswer: {
          author: 'Kurzgesagt TH',
          avatar: '🦆',
          verified: true,
          text: 'นี่คือหัวใจของ "ทวิภาวะคลื่น-อนุภาค (Wave-Particle Duality)" ครับ! แสงจะแสดงสมบัติคลื่นในการเคลื่อนที่ เช่น การแทรกสอดและการเลี้ยวเบน แต่จะแสดงสมบัติอนุภาค (โฟตอน) เมื่อมีอันตรกิริยากับสสาร เช่น ในปรากฏการณ์โฟโตอิเล็กทริกและการกระเจิงคอมป์ตันครับ',
          timeAgo: '1 วันที่แล้ว',
        },
      },
    ],
  },
  {
    id: 'creator-point-of-view',
    name: 'Point of View (วิทยาศาสตร์ & สาระคดี)',
    handle: '@point_of_view',
    avatar: '📚',
    avatarBg: 'bg-emerald-600',
    coverGradient: 'from-[#064E3B] via-[#059669] to-[#34D399]',
    badge: 'VERIFIED PARTNER',
    category: 'วิทยาศาสตร์ทั่วไป',
    followers: 320500,
    followersFormatted: '320.5k',
    courseCount: 28,
    quizCount: 18,
    sheetCount: 10,
    rating: 4.9,
    tagline: 'เรื่องเล่าวิทยาศาสตร์ ประวัติศาสตร์สิ่งประดิษฐ์ และการค้นพบฟิสิกส์ที่เปลี่ยนโลก',
    bio: 'ถ่ายทอดเรื่องราวนักวิทยาศาสตร์เอกของโลก กฎฟิสิกส์ในชีวิตประจำวัน และเกร็ดความรู้ทางธรรมชาติอย่างเพลิดเพลิน',
    specialties: ['ประวัติศาสตร์วิทยาศาสตร์', 'ฟิสิกส์ในชีวิตประจำวัน', 'การค้นพบระดับโนเบล', 'การทดลองคลาสสิก'],
    videos: [
      {
        id: 'vid-pv-01',
        title: 'การค้นพบที่เปลี่ยนโลก: จากแอปเปิลของนิวตันสู่สัมพัทธภาพของไอน์สไตน์',
        subtitle: 'ทำความเข้าใจประวัติศาสตร์และแนวคิดสำคัญของวิชาฟิสิกส์',
        duration: '26:30',
        views: '88.9k',
        embedUrl: 'https://www.youtube.com/embed/gT_qWkE70K4',
        category: 'ประวัติศาสตร์',
        summary: 'เดินทางย้อนเวลาดูพัฒนาการทางฟิสิกส์ตั้งแต่ยุคกาลิเลโอ นิวตัน แมกซ์เวลล์ ถึงไอน์สไตน์',
        keyPoints: [
          { title: 'การปฏิวัติวิทยาศาสตร์', formula: 'F_g = G \\frac{m_1 m_2}{r^2}', detail: 'แรงโน้มถ่วงที่เชื่อมโยงการตกของวัตถุบนโลกกับการโคจรของดวงจันทร์' },
        ],
        chapters: [
          { time: '00:00', title: 'กาลิเลโอและการทดลองที่หอเอนปิซา' },
          { time: '12:00', title: 'กฎแรงโน้มถ่วงสากลของนิวตัน' },
        ],
      },
    ],
    quizzes: [
      {
        id: 'exam-pv-01',
        title: 'นักวิทยาศาสตร์เอก & การค้นพบเปลี่ยนโลก 🌍',
        description: 'ทดสอบความรู้รอบตัวเกี่ยวกับนักฟิสิกส์ การทดลองคลาสสิก และรางวัลโนเบล',
        emoji: '🌍',
        headerColor: '#059669',
        difficulty: 'ง่าย',
        participants: '19.8k',
        participantCount: 19800,
        questionCount: 8,
        category: 'ความรู้รอบตัว',
        tags: ['#ประวัติศาสตร์', '#นักวิทยาศาสตร์', '#โนเบล'],
        author: {
          name: 'Point of View',
          avatar: '📚',
          timeAgo: 'อัปเดตล่าสุด',
        },
        questions: [
          {
            id: 'qpv-1',
            text: 'อัลเบิร์ต ไอน์สไตน์ ได้รับรางวัลโนเบลสาขาฟิสิกส์จากการอธิบายปรากฏการณ์ใด?',
            formula: 'E = hf - W_0',
            options: ['ปรากฏการณ์โฟโตอิเล็กทริก', 'ทฤษฎีสัมพัทธภาพพิเศษ', 'ทฤษฎีสัมพัทธภาพทั่วไป', 'การแผ่รังสีของวัตถุดำ'],
            correctIndex: 0,
            timeLimit: 20,
            points: 1000,
            explanation: 'ไอน์สไตน์ได้รับรางวัลโนเบลในปี 1921 สำหรับการค้นพบกฎของปรากฏการณ์โฟโตอิเล็กทริก',
          },
        ],
        flashcards: [
          {
            term: 'กาลิเลโอ กาลิเลอี (Galileo Galilei)',
            definition: 'บิดาแห่งวิทยาศาสตร์สมัยใหม่ ผู้บุกเบิกการทดลองเชิงประจักษ์และการใช้กล้องโทรทรรศน์สังเกตดาราศาสตร์',
          },
        ],
        learnNotes: ['เซอร์ไอแซก นิวตัน ตีพิมพ์หนังสือ Principia Mathematica ในปี ค.ศ. 1687'],
      },
    ],
    sheets: [
      {
        id: 'sheet-pv-01',
        title: 'ไทม์ไลน์การค้นพบทางฟิสิกส์และดาราศาสตร์โลก',
        category: 'ประวัติศาสตร์',
        pages: 3,
        fileSize: '2.1 MB',
        description: 'แผนผังลำดับเหตุการณ์การค้นพบสมการฟิสิกส์และเทคโนโลยีอวกาศ',
        previewUrl: 'https://docs.google.com/gview?embedded=true&url=https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf',
        downloadCount: '8.4k',
        highlights: ['ยุคดั้งเดิม (Classical Physics)', 'ยุคแม่เหล็กไฟฟ้า (Electromagnetism)', 'ยุคฟิสิกส์ยุคใหม่ (Modern Physics)'],
      },
    ],
    qnaPosts: [
      {
        id: 'qna-pv-01',
        question: 'ใครเป็นคนแรกที่พิสูจน์ว่าโลกหมุนรอบดวงอาทิตย์อย่างมีหลักฐานทางคณิตศาสตร์ครับ?',
        author: 'History_Fan',
        authorAvatar: '📜',
        timeAgo: '3 วันที่แล้ว',
        likes: 27,
        topicTag: 'ประวัติศาสตร์',
        creatorAnswer: {
          author: 'Point of View',
          avatar: '📚',
          verified: true,
          text: 'นิโคเลาส์ โคเปอร์นิคัส เสนอแบบจำลองดวงอาทิตย์เป็นศูนย์กลาง (Heliocentrism) และโยฮันเนส เคปเลอร์ ได้พิสูจน์ด้วยกฎการโคจร 3 ข้อทางคณิตศาสตร์อย่างสมบูรณ์แบบครับ!',
          timeAgo: '2 วันที่แล้ว',
        },
      },
    ],
  },
];

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: 'Mind Physics', avatar: '🦊', score: 12800 },
  { rank: 2, name: 'ฟิสิกส์สู้ตาย', avatar: '🐯', score: 11500 },
  { rank: 3, name: 'ครู No.7', avatar: '👨‍🏫', score: 10200 },
  { rank: 4, name: 'เด็กวิทย์ TCAS', avatar: '🧪', score: 9800 },
  { rank: 5, name: 'คุณ (Cadet)', avatar: '⭐', score: 0, isUser: true },
];

export const Lab7PlaygroundModal: React.FC<Lab7PlaygroundModalProps> = ({
  isOpen,
  onClose,
  lang,
  user = null,
  isCadetPremium = false,
  onOpenUpgrade,
}) => {
  // Navigation State: null = Page 1 (Channels Directory Hub), string = Page 2 (Individual Channel View)
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  // Directory Filters & Search
  const [directorySearch, setDirectorySearch] = useState('');
  const [directoryCategory, setDirectoryCategory] = useState('ทั้งหมด');

  // Channel Inner Tabs: 'videos' | 'quizzes' | 'sheets' | 'qna'
  const [activeTab, setActiveTab] = useState<'videos' | 'quizzes' | 'sheets' | 'qna'>('videos');

  // Follow states (Persistent in LocalStorage)
  const [followedCreators, setFollowedCreators] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('ssl_followed_creators');
      return saved ? JSON.parse(saved) : { 'creator-physics-no7': true };
    } catch {
      return { 'creator-physics-no7': true };
    }
  });

  // Video Player state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [studyNotes, setStudyNotes] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem('ssl_creator_study_notes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [currentNoteText, setCurrentNoteText] = useState('');

  // Quiz / Kahoot state inside channel
  const [quizViewState, setQuizViewState] = useState<'catalog' | 'detail' | 'play_solo' | 'flashcards' | 'learn'>('catalog');
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem>(CREATOR_CHANNELS[0].quizzes[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizElapsedSeconds, setQuizElapsedSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameOver, setIsGameOver] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [quizCategoryFilter, setQuizCategoryFilter] = useState('ทั้งหมด');

  // Sheet Preview Modal
  const [previewSheet, setPreviewSheet] = useState<CreatorSheet | null>(null);

  // Custom Quizzes per Creator State (Persistent in LocalStorage)
  const [customQuizzesMap, setCustomQuizzesMap] = useState<Record<string, QuizItem[]>>(() => {
    try {
      const saved = localStorage.getItem('ssl_creator_custom_quizzes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Creator Studio (Create Quiz & Flashcards) Modal State
  const [isCreateQuizModalOpen, setIsCreateQuizModalOpen] = useState(false);
  const [creationMode, setCreationMode] = useState<'manual' | 'ai'>('manual');
  const [showAiUpgradeGuard, setShowAiUpgradeGuard] = useState(false);

  // AI Creation Form States (Universal Multi-Subject AI Engine)
  const [aiTopic, setAiTopic] = useState('');
  const [aiSubject, setAiSubject] = useState('สังคมศึกษา & ประวัติศาสตร์');
  const [aiFormat, setAiFormat] = useState<'quiz' | 'flashcard'>('quiz');
  const [aiQuestionCount, setAiQuestionCount] = useState<number>(10);
  const [aiLevel, setAiLevel] = useState<string>('high');
  const [aiDifficulty, setAiDifficulty] = useState<string>('medium');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  // Role-Based Access Control (RBAC): Admin & Premium Only for AI Studio
  const isCadetAdmin = Boolean(
    isUserAdminOrDev() ||
    (user?.role as string) === 'Admin' ||
    (user?.role as string) === 'admin' ||
    user?.role === 'Developer' ||
    user?.name === 'Admin' ||
    user?.email?.toLowerCase().includes('admin') ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_is_admin') === 'true' ||
        localStorage.getItem('ssl_is_developer') === 'true'))
  );

  const isUserPremium = Boolean(
    isCadetPremium ||
    user?.isPremium === true ||
    user?.role === 'Premium' ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_premium_pdf_unlocked') === 'true' ||
        localStorage.getItem('isPremium') === 'true'))
  );

  const canUseAiStudio = isCadetAdmin || isUserPremium;

  const handleSelectAiMode = () => {
    if (!canUseAiStudio) {
      setShowAiUpgradeGuard(true);
      return;
    }
    setCreationMode('ai');
  };

  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDesc, setNewQuizDesc] = useState('');
  const [newQuizCategory, setNewQuizCategory] = useState('กลศาสตร์');
  const [newQuizDifficulty, setNewQuizDifficulty] = useState<'ง่าย' | 'ปานกลาง' | 'ยาก'>('ปานกลาง');
  const [newQuizEmoji, setNewQuizEmoji] = useState('🚀');
  const [newQuizHeaderColor, setNewQuizHeaderColor] = useState('#7C3AED');
  const [newQuestionsList, setNewQuestionsList] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      text: '',
      formula: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      timeLimit: 30,
      points: 1000,
      explanation: '',
    },
  ]);

  // Host Live Simulation Modal State
  const [isHostLiveModalOpen, setIsHostLiveModalOpen] = useState(false);
  const [livePin] = useState('889-702');
  const [mockCadetsList, setMockCadetsList] = useState<string[]>([
    'น้องน้ำหวาน ม.5',
    'Cadet_Beam',
    'Astro_Tonkla',
    'SkyWalker_TH',
    'Mind Physics',
  ]);
  const [isLiveActive, setIsLiveActive] = useState(false);

  // Creator Onboarding Application State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isApplySuccessModalOpen, setIsApplySuccessModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: '',
    phone: '',
    email: '',
    education: '',
    channelName: '',
    category: 'ฟิสิกส์ ม.ปลาย',
    description: '',
  });

  // Admin Mode Controls (Directory Categories & Creator Cards)
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_lab7_custom_categories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [newCategoryInput, setNewCategoryInput] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [channelsList, setChannelsList] = useState<CreatorProfile[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_lab7_deleted_channel_ids');
      if (saved) {
        const deletedIds: string[] = JSON.parse(saved);
        return CREATOR_CHANNELS.filter((c) => !deletedIds.includes(c.id));
      }
      return CREATOR_CHANNELS;
    } catch {
      return CREATOR_CHANNELS;
    }
  });
  const [channelToDelete, setChannelToDelete] = useState<CreatorProfile | null>(null);

  // ชุดข้อมูลระดับชั้นเรียน (ตัด 2 บรรทัดล่างออกเรียบร้อย)
  const gradeOptions = [
    { value: "p1", label: "ประถมศึกษาปีที่ 1 (ป.1)" },
    { value: "p2", label: "ประถมศึกษาปีที่ 2 (ป.2)" },
    { value: "p3", label: "ประถมศึกษาปีที่ 3 (ป.3)" },
    { value: "p4", label: "ประถมศึกษาปีที่ 4 (ป.4)" },
    { value: "p5", label: "ประถมศึกษาปีที่ 5 (ป.5)" },
    { value: "p6", label: "ประถมศึกษาปีที่ 6 (ป.6)" },
    { value: "m1", label: "มัธยมศึกษาปีที่ 1 (ม.1)" },
    { value: "m2", label: "มัธยมศึกษาปีที่ 2 (ม.2)" },
    { value: "m3", label: "มัธยมศึกษาปีที่ 3 (ม.3)" },
    { value: "m4", label: "มัธยมศึกษาปีที่ 4 (ม.4)" },
    { value: "m5", label: "มัธยมศึกษาปีที่ 5 (ม.5)" },
    { value: "m6", label: "มัธยมศึกษาปีที่ 6 (ม.6 / TCAS)" },
    { value: "university", label: "อุดมศึกษา / ระดับมหาวิทยาลัย / บุคคลทั่วไป" },
  ];

  // ชุดข้อมูลรูปแบบการเรียน (เพิ่มเรียนที่บ้าน/ห้าง)
  const formatOptions = [
    { value: "online", label: "Online ผ่านระบบห้องเรียน Seven Space Labs" },
    { value: "onsite-home", label: "Onsite นอกสถานที่ (เรียนที่บ้าน / ห้าง / สถานที่สะดวกของผู้เรียน)" },
  ];

  // Escrow Booking Modal State
  const [bookingCreator, setBookingCreator] = useState<CreatorProfile | null>(null);
  const [bookingForm, setBookingForm] = useState({
    studentName: '',
    gradeLevel: 'm4',
    learningMode: 'online',
    preferredSchedule: '',
    notes: '',
  });

  // Q&A State
  const [qnaList, setQnaList] = useState<QnAPost[]>(CREATOR_CHANNELS[0].qnaPosts);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionTag, setNewQuestionTag] = useState('กลศาสตร์');
  const [newQuestionFormula, setNewQuestionFormula] = useState('');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);

  // Fullscreen Modal State
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Reset to Directory when reopening or closing
  useEffect(() => {
    if (!isOpen) {
      setSelectedCreatorId(null);
    }
  }, [isOpen]);

  const activeCreator = selectedCreatorId
    ? CREATOR_CHANNELS.find((c) => c.id === selectedCreatorId) || CREATOR_CHANNELS[0]
    : CREATOR_CHANNELS[0];

  const isFollowing = selectedCreatorId ? Boolean(followedCreators[activeCreator.id]) : false;

  // Sync Q&A and Note text when switching creator
  useEffect(() => {
    if (selectedCreatorId) {
      setQnaList(activeCreator.qnaPosts);
      setActiveVideoIndex(0);
      if (activeCreator.quizzes.length > 0) {
        setSelectedQuiz(activeCreator.quizzes[0]);
      }
      setActiveTab('videos');
      setQuizViewState('catalog');
    }
  }, [selectedCreatorId]);

  const currentVideo = activeCreator.videos[activeVideoIndex] || activeCreator.videos[0];

  useEffect(() => {
    if (currentVideo) {
      setCurrentNoteText(studyNotes[currentVideo.id] || '');
    }
  }, [currentVideo?.id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleFollow = (creatorId: string) => {
    const nextState = !followedCreators[creatorId];
    const updated = { ...followedCreators, [creatorId]: nextState };
    setFollowedCreators(updated);
    try {
      localStorage.setItem('ssl_followed_creators', JSON.stringify(updated));
    } catch {}

    const targetCreator = CREATOR_CHANNELS.find((c) => c.id === creatorId);
    if (nextState) {
      showToast(`⭐ ติดตามช่อง ${targetCreator?.name || 'ครีเอเตอร์'} เรียบร้อยแล้ว!`);
    } else {
      showToast(`ยกเลิกการติดตามช่อง ${targetCreator?.name || 'ครีเอเตอร์'}`);
    }
  };

  const handleSaveNote = () => {
    if (!currentVideo) return;
    const updated = { ...studyNotes, [currentVideo.id]: currentNoteText };
    setStudyNotes(updated);
    try {
      localStorage.setItem('ssl_creator_study_notes', JSON.stringify(updated));
    } catch {}
    showToast('💾 บันทึกโน้ตสรุปประจำคลิปนี้เรียบร้อยแล้ว');
  };

  const handleDownloadNote = () => {
    if (!currentNoteText) {
      showToast('⚠️ ยังไม่มีข้อความในโน้ตสรุป');
      return;
    }
    const blob = new Blob([`[โน้ตสรุปฟิสิกส์ - ${activeCreator.name}]\nหัวข้อ: ${currentVideo?.title}\n\n${currentNoteText}\n\nบันทึกเมื่อ: ${new Date().toLocaleString()}`], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${currentVideo?.id || 'physics'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 ดาวน์โหลดโน้ตสรุป .txt เรียบร้อย');
  };

  // Solo Play Timer
  useEffect(() => {
    if (quizViewState !== 'play_solo' || isAnswerSubmitted || isGameOver) return;
    if (timeLeft <= 0) {
      setIsAnswerSubmitted(true);
      setStreak(0);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizViewState, isAnswerSubmitted, isGameOver, timeLeft]);

  // Overall Quiz Elapsed Timer
  useEffect(() => {
    if (quizViewState !== 'play_solo' || isGameOver) return;
    const timer = setInterval(() => {
      setQuizElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [quizViewState, isGameOver]);

  if (!isOpen) return null;

  // Quiz Play Handlers
  const handleStartPlaySolo = (quiz: QuizItem) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setUserSelectedOption(null);
    setIsAnswerSubmitted(false);
    setUserScore(0);
    setStreak(0);
    setMaxStreak(0);
    setCorrectAnswersCount(0);
    setQuizElapsedSeconds(0);
    setTimeLeft(quiz.questions[0]?.timeLimit || 30);
    setIsGameOver(false);
    setQuizViewState('play_solo');
  };

  const handleStartFlashcards = (quiz: QuizItem) => {
    setSelectedQuiz(quiz);
    setCardIndex(0);
    setIsFlipped(false);
    setQuizViewState('flashcards');
  };

  const handleStartLearn = (quiz: QuizItem) => {
    setSelectedQuiz(quiz);
    setQuizViewState('learn');
  };

  const handleSelectOption = (index: number) => {
    if (isAnswerSubmitted) return;
    setUserSelectedOption(index);
    setIsAnswerSubmitted(true);

    const currentQ = selectedQuiz.questions[currentQuestionIndex];
    if (index === currentQ.correctIndex) {
      const timeBonus = Math.floor((timeLeft / (currentQ.timeLimit || 30)) * 500);
      const pointsGained = (currentQ.points || 1000) + timeBonus;
      setUserScore((prev) => prev + pointsGained);
      setStreak((prev) => {
        const next = prev + 1;
        if (next > maxStreak) setMaxStreak(next);
        return next;
      });
      setCorrectAnswersCount((prev) => prev + 1);
      showToast(`🎉 ถูกต้อง! +${pointsGained} คะแนน (Streak x${streak + 1})`);
    } else {
      setStreak(0);
      showToast('❌ ยังไม่ถูกต้อง ดูคำอธิบายวิธีคิดด้านล่างได้เลย');
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < selectedQuiz.questions.length) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setUserSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(selectedQuiz.questions[nextIdx].timeLimit || 30);
    } else {
      setIsGameOver(true);
    }
  };

  // Creator Studio: Question Form Helpers
  const handleAddQuestionField = () => {
    setNewQuestionsList((prev) => [
      ...prev,
      {
        id: `q-new-${Date.now()}-${prev.length + 1}`,
        text: '',
        formula: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        timeLimit: 30,
        points: 1000,
        explanation: '',
      },
    ]);
  };

  const handleRemoveQuestionField = (index: number) => {
    if (newQuestionsList.length <= 1) {
      showToast('⚠️ ต้องมีข้อสอบอย่างน้อย 1 ข้อ');
      return;
    }
    setNewQuestionsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateQuestionField = (index: number, field: keyof QuizQuestion, value: any) => {
    setNewQuestionsList((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: value } : q))
    );
  };

  const handleUpdateOption = (qIndex: number, optIndex: number, text: string) => {
    setNewQuestionsList((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        const newOpts = [...q.options];
        newOpts[optIndex] = text;
        return { ...q, options: newOpts };
      })
    );
  };

  const handlePublishNewQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuizTitle.trim()) {
      showToast('⚠️ กรุณาระบุชื่อชุดข้อสอบ');
      return;
    }
    const hasValidQuestions = newQuestionsList.some(
      (q) => q.text.trim() && q.options.filter((o) => o.trim()).length >= 2
    );
    if (!hasValidQuestions) {
      showToast('⚠️ กรุณากรอกโจทย์และตัวเลือกอย่างน้อย 2 ตัวเลือกในข้อแรก');
      return;
    }

    const cleanQuestions = newQuestionsList
      .filter((q) => q.text.trim())
      .map((q, idx) => ({
        ...q,
        id: `q-${Date.now()}-${idx + 1}`,
        options: q.options.map((o, oIdx) => o.trim() || `ตัวเลือกที่ ${oIdx + 1}`),
        timeLimit: Number(q.timeLimit) || 30,
        points: Number(q.points) || 1000,
        explanation: q.explanation.trim() || 'คำตอบถูกต้องตามหลักการทางฟิสิกส์',
      }));

    const flashcardsFromQuestions = cleanQuestions.map((q) => ({
      term: q.text,
      definition: q.options[q.correctIndex] || 'คำตอบที่ถูกต้อง',
      formula: q.formula || undefined,
    }));

    const learnNotesFromQuestions = cleanQuestions.map(
      (q, idx) => `ข้อ ${idx + 1}: ${q.explanation}`
    );

    const newQuizItem: QuizItem = {
      id: `quiz-custom-${Date.now()}`,
      title: newQuizTitle.trim(),
      description: newQuizDesc.trim() || `ชุดข้อสอบวิชา ${newQuizCategory} สร้างโดย ${activeCreator.name}`,
      emoji: newQuizEmoji || '🚀',
      headerColor: newQuizHeaderColor || '#7C3AED',
      difficulty: newQuizDifficulty,
      participants: '1',
      participantCount: 1,
      questionCount: cleanQuestions.length,
      category: newQuizCategory,
      tags: [`#${newQuizCategory}`, '#CreatorStudio', '#ข้อสอบใหม่'],
      author: {
        name: activeCreator.name,
        avatar: activeCreator.avatar,
        timeAgo: 'เมื่อสักครู่',
      },
      questions: cleanQuestions,
      flashcards: flashcardsFromQuestions,
      learnNotes: learnNotesFromQuestions,
    };

    const creatorId = activeCreator.id;
    const existingList = customQuizzesMap[creatorId] || [];
    const updatedMap = {
      ...customQuizzesMap,
      [creatorId]: [newQuizItem, ...existingList],
    };

    setCustomQuizzesMap(updatedMap);
    try {
      localStorage.setItem('ssl_creator_custom_quizzes', JSON.stringify(updatedMap));
    } catch (err) {
      console.warn('LocalStorage save error', err);
    }

    // Reset Form
    setNewQuizTitle('');
    setNewQuizDesc('');
    setNewQuestionsList([
      {
        id: 'q-new-1',
        text: '',
        formula: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        timeLimit: 30,
        points: 1000,
        explanation: '',
      },
    ]);
    setIsCreateQuizModalOpen(false);

    // Switch to Tab 2 and open detail of the newly created quiz
    setActiveTab('quizzes');
    setSelectedQuiz(newQuizItem);
    setQuizViewState('detail');
    showToast('บันทึกและเผยแพร่ชุดข้อสอบลงช่องสำเร็จ!');
  };

  const handleGenerateWithAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canUseAiStudio) {
      setShowAiUpgradeGuard(true);
      return;
    }
    if (!aiTopic.trim()) {
      showToast('กรุณาระบุหมวดวิชาหรือหัวข้อที่ต้องการออกโจทย์');
      return;
    }

    setIsAiGenerating(true);
    setAiStatusMessage(`Universal AI Engine กำลังวิเคราะห์และออกโจทย์ ${aiQuestionCount} ข้อ...`);

    try {
      const response = await fetch('/api/gemini/generate-creator-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic.trim(),
          subject: aiSubject,
          format: aiFormat,
          count: aiQuestionCount,
          level: aiLevel,
          difficulty: aiDifficulty,
          creatorName: activeCreator.name,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error in generating creator quiz');
      }

      const data = await response.json();
      if (!data || !data.questions || data.questions.length === 0) {
        throw new Error('Invalid quiz response from AI engine');
      }

      const generatedQuestions: QuizQuestion[] = data.questions.map((q: any, idx: number) => ({
        id: `q-ai-${Date.now()}-${idx + 1}`,
        text: q.text || q.question || '',
        formula: q.formula || '',
        options: Array.isArray(q.options) && q.options.length >= 2 ? q.options : ['ตัวเลือก A', 'ตัวเลือก B'],
        correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
        timeLimit: Number(q.timeLimit) || (aiFormat === 'flashcard' ? 20 : 30),
        points: Number(q.points) || 1000,
        explanation: q.explanation || 'คำอธิบายตามหลักวิชาการสากล',
      }));

      const flashcardsList = data.flashcards || generatedQuestions.map((q) => ({
        term: q.text,
        definition: q.options[q.correctIndex] || 'คำตอบที่ถูกต้อง',
        formula: q.formula || undefined,
      }));

      const learnNotesList = data.learnNotes || generatedQuestions.map(
        (q, idx) => `ข้อ ${idx + 1}: ${q.explanation}`
      );

      const newQuizItem: QuizItem = {
        id: `quiz-ai-${Date.now()}`,
        title: data.title || `ชุดข้อสอบ ${aiTopic.trim()} (${aiSubject})`,
        description: data.description || `ชุดข้อสอบมาตรฐานวิชาการ สร้างอัตโนมัติด้วย AI Studio โดย ${activeCreator.name}`,
        emoji: data.emoji || (aiSubject.includes('อังกฤษ') ? '🇬🇧' : aiSubject.includes('ประวัติ') ? '🏛️' : aiSubject.includes('กฎหมาย') ? '⚖️' : aiSubject.includes('การเงิน') ? '💰' : '📚'),
        headerColor: data.headerColor || '#7C3AED',
        difficulty: (data.difficulty as any) || (aiDifficulty === 'easy' ? 'ง่าย' : aiDifficulty === 'hard' ? 'ยาก' : 'ปานกลาง'),
        participants: '1',
        participantCount: 1,
        questionCount: generatedQuestions.length,
        category: aiSubject || 'วิชาการทั่วไป',
        tags: [`#${aiSubject.replace(/\s+/g, '')}`, `#${aiTopic.trim().slice(0, 15)}`, '#UniversalAI', '#ข้อสอบใหม่อัตโนมัติ'],
        author: {
          name: activeCreator.name,
          avatar: activeCreator.avatar,
          timeAgo: 'เมื่อสักครู่',
        },
        questions: generatedQuestions,
        flashcards: flashcardsList,
        learnNotes: learnNotesList,
      };

      const creatorId = activeCreator.id;
      const existingList = customQuizzesMap[creatorId] || [];
      const updatedMap = {
        ...customQuizzesMap,
        [creatorId]: [newQuizItem, ...existingList],
      };

      setCustomQuizzesMap(updatedMap);
      try {
        localStorage.setItem('ssl_creator_custom_quizzes', JSON.stringify(updatedMap));
      } catch (err) {
        console.warn('LocalStorage save error', err);
      }

      showToast(`AI สร้างชุดข้อสอบ "${newQuizItem.title}" ${generatedQuestions.length} ข้อ สำเร็จเรียบร้อย!`);
      setIsCreateQuizModalOpen(false);

      // Reset AI input fields
      setAiTopic('');

      // Switch to Tab 2 and open detail of the newly created quiz
      setActiveTab('quizzes');
      setSelectedQuiz(newQuizItem);
      setQuizViewState('detail');
    } catch (err: any) {
      console.error('Error generating creator quiz with AI:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างข้อสอบด้วย AI กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsAiGenerating(false);
      setAiStatusMessage('');
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newPost: QnAPost = {
      id: `qna-${Date.now()}`,
      question: newQuestionText.trim(),
      author: 'คุณ (Cadet)',
      authorAvatar: '⭐',
      timeAgo: 'เมื่อสักครู่',
      likes: 1,
      hasLiked: true,
      topicTag: newQuestionTag,
      formula: newQuestionFormula.trim() || undefined,
    };

    setQnaList([newPost, ...qnaList]);
    setNewQuestionText('');
    setNewQuestionFormula('');
    setIsAskModalOpen(false);
    showToast('🚀 โพสต์คำถามถึงครีเอเตอร์เรียบร้อยแล้ว!');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyForm.name.trim() || !applyForm.phone.trim() || !applyForm.email.trim() || !applyForm.channelName.trim()) {
      showToast('⚠️ กรุณากรอกข้อมูลสำคัญให้ครบถ้วน');
      return;
    }

    try {
      const existing = localStorage.getItem('ssl_creator_applications');
      const list = existing ? JSON.parse(existing) : [];
      const newApp = {
        ...applyForm,
        id: `app-${Date.now()}`,
        status: 'pending_approval',
        submittedAt: new Date().toISOString(),
      };
      list.push(newApp);
      localStorage.setItem('ssl_creator_applications', JSON.stringify(list));
    } catch (err) {
      console.warn('LocalStorage save error', err);
    }

    setIsApplyModalOpen(false);
    setIsApplySuccessModalOpen(true);
    setApplyForm({
      name: '',
      phone: '',
      email: '',
      education: '',
      channelName: '',
      category: 'ฟิสิกส์ ม.ปลาย',
      description: '',
    });
    showToast('✨ ส่งข้อมูลสำเร็จ อยู่ระหว่างรอแอดมินตรวจสอบและอนุมัติ');
  };

  const handleLikeQuestion = (id: string) => {
    setQnaList((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextLiked = !item.hasLiked;
          return {
            ...item,
            hasLiked: nextLiked,
            likes: nextLiked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  const kahootChoiceColors = [
    { bg: 'bg-[#EF4444]', hover: 'hover:bg-[#DC2626]', shape: '▲', label: 'A' },
    { bg: 'bg-[#0EA5E9]', hover: 'hover:bg-[#0284C7]', shape: '♦', label: 'B' },
    { bg: 'bg-[#F59E0B]', hover: 'hover:bg-[#D97706]', shape: '●', label: 'C' },
    { bg: 'bg-[#10B981]', hover: 'hover:bg-[#059669]', shape: '■', label: 'D' },
  ];

  // Filtered Channels for Directory
  const defaultCategories = ['ทั้งหมด', 'ฟิสิกส์ ม.ปลาย', 'TCAS & A-Level', 'ดาราศาสตร์ & อวกาศ', 'วิทยาศาสตร์ทั่วไป'];
  const allCategories = Array.from(new Set([...defaultCategories, ...customCategories]));

  const filteredChannels = channelsList.filter((c) => {
    const matchCat =
      directoryCategory === 'ทั้งหมด' ||
      c.category.includes(directoryCategory) ||
      (directoryCategory === 'TCAS & A-Level' && c.category.includes('TCAS')) ||
      (directoryCategory === 'ดาราศาสตร์ & อวกาศ' && c.category.includes('ดาราศาสตร์')) ||
      c.specialties.some((s) => s.toLowerCase().includes(directoryCategory.toLowerCase()));

    const matchSearch =
      !directorySearch.trim() ||
      c.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      c.bio.toLowerCase().includes(directorySearch.toLowerCase()) ||
      c.specialties.some((s) => s.toLowerCase().includes(directorySearch.toLowerCase()));

    return matchCat && matchSearch;
  });

  const handleAddCategory = () => {
    const trimmed = newCategoryInput.trim();
    if (!trimmed) return;
    if (allCategories.includes(trimmed)) {
      showToast('⚠️ รายวิชานี้มีอยู่แล้ว');
      return;
    }
    const updated = [...customCategories, trimmed];
    setCustomCategories(updated);
    try {
      localStorage.setItem('ssl_lab7_custom_categories', JSON.stringify(updated));
    } catch {}
    setNewCategoryInput('');
    setIsAddingCategory(false);
    showToast(`✓ เพิ่มหมวดหมู่วิชา "${trimmed}" เรียบร้อยแล้ว`);
  };

  const handleDeleteCategory = (catName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customCategories.filter((c) => c !== catName);
    setCustomCategories(updated);
    try {
      localStorage.setItem('ssl_lab7_custom_categories', JSON.stringify(updated));
    } catch {}
    if (directoryCategory === catName) {
      setDirectoryCategory('ทั้งหมด');
    }
    showToast(`🗑️ ลบหมวดหมู่วิชา "${catName}" เรียบร้อย`);
  };

  const handleConfirmDeleteChannel = (channel: CreatorProfile) => {
    const updated = channelsList.filter((c) => c.id !== channel.id);
    setChannelsList(updated);
    try {
      const saved = localStorage.getItem('ssl_lab7_deleted_channel_ids');
      const deletedIds: string[] = saved ? JSON.parse(saved) : [];
      if (!deletedIds.includes(channel.id)) {
        deletedIds.push(channel.id);
        localStorage.setItem('ssl_lab7_deleted_channel_ids', JSON.stringify(deletedIds));
      }
    } catch {}
    setChannelToDelete(null);
    showToast(`🗑️ ลบห้อง/ติวเตอร์ "${channel.name}" เรียบร้อย`);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200`}>
      <div className={`relative w-full ${isFullscreen ? 'w-screen h-screen rounded-none max-w-none border-none' : 'max-w-7xl h-[95vh] rounded-[28px] border border-purple-200/50'} bg-[#FFFFFF] text-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden font-sans transition-all duration-200`}>
        
        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full text-xs font-bold shadow-xl border bg-slate-900 text-white border-purple-500/50 flex items-center gap-2 animate-in slide-in-from-top duration-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TOP NAVBAR (Dark Purple Kahoot-style Header)                              */}
        {/* ========================================================================= */}
        <div className="h-16 px-4 sm:px-6 bg-[#4C1D95] text-white flex items-center justify-between shrink-0 shadow-md">
          {/* Left: Brand or Back Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            {selectedCreatorId ? (
              <button
                onClick={() => {
                  setSelectedCreatorId(null);
                  setQuizViewState('catalog');
                }}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition-all cursor-pointer border border-white/20 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 text-amber-300" />
                <span>ย้อนกลับไปหน้ารวมช่อง</span>
              </button>
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-purple-200">
                  <Tv className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-purple-300 block leading-tight">LAB 7</span>
                  <span className="text-sm sm:text-base font-black tracking-tight text-white leading-none">
                    ช่องการเรียนรู้ (Creator Channels)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {selectedCreatorId && (
              <button
                onClick={() => {
                  setSelectedCreatorId(null);
                  setQuizViewState('catalog');
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-purple-100 text-xs font-bold border border-white/15 cursor-pointer active:scale-95"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>สารบัญช่องทั้งหมด ({channelsList.length})</span>
              </button>
            )}

            {/* Fullscreen Toggle Button */}
            <button
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-white/15 text-purple-200 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'ย่อหน้าต่างกลับเดิม' : 'ขยายเต็มจอ (Fullscreen)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-amber-300" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/15 text-purple-200 hover:text-white transition-colors cursor-pointer ml-0.5"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY AREA                                                            */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto bg-[#F8F7FF] text-slate-800 flex flex-col">
          
          {/* ======================================================================= */}
          {/* PAGE 1: CHANNELS DIRECTORY HUB (When selectedCreatorId === null)        */}
          {/* ======================================================================= */}
          {!selectedCreatorId ? (
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
              
              {/* Directory Clean Header Bar */}
              <div className="bg-white rounded-[24px] p-5 sm:p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-lg">
                    <Tv className="w-5 h-5 text-purple-700" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      ช่องการเรียนรู้ (Creator Channels)
                    </h1>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                  {/* Search in Directory */}
                  <div className="w-full sm:w-64 lg:w-72 relative">
                    <input
                      type="text"
                      placeholder="ค้นหาชื่อช่อง, หัวข้อติว..."
                      value={directorySearch}
                      onChange={(e) => setDirectorySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all shadow-xs"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                  </div>

                  {/* [สมัครเป็น Creator / ติวเตอร์] Button */}
                  <button
                    onClick={() => setIsApplyModalOpen(true)}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>สมัครเป็น Creator / ติวเตอร์</span>
                  </button>
                </div>
              </div>

              {/* Category Filter Pills & Admin Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  {allCategories.map((cat) => {
                    const isCustom = customCategories.includes(cat);
                    return (
                      <div
                        key={cat}
                        className={`inline-flex items-center rounded-full text-xs font-bold transition-all ${
                          directoryCategory === cat
                            ? 'bg-[#1F1A3D] text-white shadow-sm'
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setDirectoryCategory(cat)}
                          className="px-4 py-2 cursor-pointer focus:outline-hidden"
                        >
                          {cat}
                        </button>

                        {/* Admin Mode: Small 'x' to delete custom categories */}
                        {isAdminMode && isCustom && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteCategory(cat, e)}
                            className="mr-2 p-0.5 rounded-full hover:bg-rose-500 hover:text-white text-slate-400 transition-colors cursor-pointer"
                            title={`ลบหมวดหมู่ ${cat}`}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {/* Admin Mode: Add Subject button (+) */}
                  {isAdminMode && (
                    <div className="inline-flex items-center">
                      {isAddingCategory ? (
                        <div className="flex items-center gap-1.5 bg-white border border-purple-300 rounded-full px-3 py-1 shadow-xs">
                          <input
                            type="text"
                            autoFocus
                            placeholder="พิมพ์ชื่อวิชาใหม่..."
                            value={newCategoryInput}
                            onChange={(e) => setNewCategoryInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleAddCategory();
                              if (e.key === 'Escape') setIsAddingCategory(false);
                            }}
                            className="text-xs text-slate-800 outline-none w-32 bg-transparent"
                          />
                          <button
                            type="button"
                            onClick={handleAddCategory}
                            className="px-2 py-0.5 rounded-full bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 cursor-pointer"
                          >
                            บันทึก
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingCategory(false);
                              setNewCategoryInput('');
                            }}
                            className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsAddingCategory(true)}
                          className="px-3 py-2 rounded-full text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 text-purple-600" />
                          <span>เพิ่มรายวิชา</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Admin Mode Toggle Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdminMode(!isAdminMode)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      isAdminMode
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{isAdminMode ? 'โหมดแอดมิน (เปิดอยู่)' : 'Admin Mode'}</span>
                  </button>
                </div>
              </div>

              {/* Channels Grid (Square / Rectangular Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChannels.map((channel) => {
                  const channelFollowing = Boolean(followedCreators[channel.id]);
                  return (
                    <div
                      key={channel.id}
                      onClick={() => {
                        setSelectedCreatorId(channel.id);
                        setQuizViewState('catalog');
                      }}
                      className="group bg-white rounded-[26px] border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] hover:shadow-[0_16px_36px_rgba(31,26,61,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1.5 relative"
                    >
                      {/* Card Cover Stripe */}
                      <div className={`h-24 bg-gradient-to-r ${channel.coverGradient} p-4 relative flex items-start justify-between`}>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-black/25 text-white backdrop-blur-md border border-white/20">
                          {channel.category}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                            <span>{channel.rating}</span>
                          </span>

                          {/* Admin Mode: Delete Card Button */}
                          {isAdminMode && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setChannelToDelete(channel);
                              }}
                              className="px-2 py-0.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] flex items-center gap-1 shadow-md transition-all cursor-pointer border border-white/20"
                              title="ลบห้อง/ติวเตอร์"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>ลบห้อง/ติวเตอร์</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Card Main Body */}
                      <div className="p-6 pt-0 flex-1 flex flex-col justify-between space-y-4 relative">
                        
                        {/* Avatar (Floating up from banner) */}
                        <div className="-mt-10 flex items-end justify-between">
                          <div className={`w-18 h-18 rounded-3xl ${channel.avatarBg} text-white flex items-center justify-center text-3xl shadow-lg border-4 border-white ring-2 ring-purple-100 group-hover:scale-105 transition-transform`}>
                            {channel.avatar}
                          </div>

                          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-purple-50 text-[#7C3AED] border border-purple-200">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>VERIFIED</span>
                          </div>
                        </div>

                        {/* Title & Tagline */}
                        <div className="space-y-1.5">
                          <h3 className="text-base font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                            {channel.name}
                          </h3>
                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                            {channel.tagline}
                          </p>
                        </div>

                        {/* Specialties Tags */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {channel.specialties.slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                              {spec}
                            </span>
                          ))}
                        </div>

                        {/* Metrics Bar */}
                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <div className="font-mono font-bold text-slate-900 text-xs">
                              {(channelFollowing ? channel.followers + 1 : channel.followers).toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">ผู้ติดตาม</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <div className="font-mono font-bold text-slate-900 text-xs">{channel.courseCount}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">คลิปติว</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <div className="font-mono font-bold text-slate-900 text-xs">{channel.quizCount}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">ชุดควิซ</div>
                          </div>
                        </div>

                        {/* 2 Balanced Action Buttons: Clean text only, NO arrow icons */}
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {/* Button 1: Visit Channel */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCreatorId(channel.id);
                              setQuizViewState('catalog');
                            }}
                            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center justify-center cursor-pointer active:scale-98 border border-slate-200"
                          >
                            <span>เข้าสู่ช่อง</span>
                          </button>

                          {/* Button 2: Book Tutor via Admin Center (Primary Highlight - Escrow Shield) */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setBookingCreator(channel);
                            }}
                            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center cursor-pointer active:scale-98"
                          >
                            <span>นัดเรียนผ่านระบบกลาง</span>
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* ======================================================================= */
            /* PAGE 2: INDIVIDUAL CHANNEL PROFILE HUB (When selectedCreatorId is set) */
            /* ======================================================================= */
            <div className="flex-1 flex flex-col animate-in fade-in duration-200">
              
              {/* Channel Profile Header */}
              <div className="bg-white border-b border-slate-200 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    
                    {/* Left: Avatar & Channel Details */}
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl ${activeCreator.avatarBg} text-white flex items-center justify-center text-3xl sm:text-4xl shadow-lg border-2 border-white ring-4 ring-purple-100 shrink-0`}>
                        {activeCreator.avatar}
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                            {activeCreator.name}
                          </h1>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200">
                            <Crown className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{activeCreator.badge}</span>
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                          {activeCreator.bio}
                        </p>

                        {/* Stats & Channel Metadata */}
                        <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5 text-slate-800 font-bold">
                            <Users className="w-3.5 h-3.5 text-purple-600" />
                            <span>{(isFollowing ? activeCreator.followers + 1 : activeCreator.followers).toLocaleString()} ผู้ติดตาม</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-rose-500" />
                            <span>{activeCreator.courseCount} คลิปติว</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-cyan-600" />
                            <span>{activeCreator.quizCount} ชุดข้อสอบ</span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{activeCreator.rating} / 5.0</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Follow & Channel Action Buttons */}
                    <div className="flex flex-wrap md:flex-col lg:flex-row items-center gap-2.5 shrink-0 w-full sm:w-auto">
                      {/* [สร้างชุดข้อสอบ & แฟลชการ์ด (Creator Studio)] Button */}
                      <button
                        onClick={() => setIsCreateQuizModalOpen(true)}
                        className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-98"
                      >
                        <Plus className="w-4 h-4" />
                        <span>สร้างชุดข้อสอบ & แฟลชการ์ด (Creator Studio)</span>
                      </button>

                      <button
                        onClick={() => handleToggleFollow(activeCreator.id)}
                        className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                          isFollowing
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                            : 'bg-[#1F1A3D] hover:bg-[#2D2654] text-white shadow-purple-900/20'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 text-emerald-600" />
                            <span>ติดตามแล้ว (Following)</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 text-purple-300" />
                            <span>ติดตาม (Follow)</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          showToast(`📋 คัดลอกลิงก์โปรไฟล์ช่อง ${activeCreator.name} เรียบร้อย`);
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-xs"
                        title="แชร์ช่องนี้"
                      >
                        <Share2 className="w-4 h-4 text-purple-600" />
                        <span>แชร์</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedCreatorId(null);
                          setQuizViewState('catalog');
                        }}
                        className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-98 shadow-xs"
                      >
                        <Compass className="w-4 h-4 text-purple-600" />
                        <span>เปลี่ยนช่อง</span>
                      </button>
                    </div>

                  </div>
                </div>

                {/* 4 Content Tabs */}
                <div className="border-t border-slate-100 bg-[#FAF9FF] px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
                    <button
                      onClick={() => {
                        setActiveTab('videos');
                        setQuizViewState('catalog');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === 'videos'
                          ? 'bg-[#1F1A3D] text-white shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-white text-slate-600 hover:bg-purple-50/50 hover:text-purple-900 border border-slate-200'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5 text-rose-500" />
                      <span>1. คอร์ส & คลิปติวในระบบ ({activeCreator.videos.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('quizzes');
                        setQuizViewState('catalog');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === 'quizzes'
                          ? 'bg-[#1F1A3D] text-white shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-white text-slate-600 hover:bg-purple-50/50 hover:text-purple-900 border border-slate-200'
                      }`}
                    >
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      <span>2. ชุดข้อสอบของช่อง ({([...(customQuizzesMap[activeCreator.id] || []), ...activeCreator.quizzes]).length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('sheets');
                        setQuizViewState('catalog');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === 'sheets'
                          ? 'bg-[#1F1A3D] text-white shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-white text-slate-600 hover:bg-purple-50/50 hover:text-purple-900 border border-slate-200'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-600" />
                      <span>3. ชีทสรุป & เอกสาร ({activeCreator.sheets.length})</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('qna');
                        setQuizViewState('catalog');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                        activeTab === 'qna'
                          ? 'bg-[#1F1A3D] text-white shadow-sm ring-1 ring-purple-500/30'
                          : 'bg-white text-slate-600 hover:bg-purple-50/50 hover:text-purple-900 border border-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>4. กระดานถาม-ตอบ Q&A ({qnaList.length})</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* =================================================================== */}
              {/* TAB 1: VIDEOS & NOTES                                               */}
              {/* =================================================================== */}
              {activeTab === 'videos' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* Left: Embedded Video Player + Lesson Summary */}
                    <div className="lg:col-span-8 space-y-6">
                      <div className="bg-slate-900 rounded-[24px] overflow-hidden shadow-xl border border-slate-800">
                        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
                          <iframe
                            src={currentVideo.embedUrl}
                            title={currentVideo.title}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>

                        {/* Player Controls Bar */}
                        <div className="p-4 bg-slate-950 text-white flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-md bg-purple-900/60 text-purple-300 font-mono font-bold">
                              {currentVideo.duration}
                            </span>
                            <span className="text-slate-400">
                              {currentVideo.views} views • เล่นภายในระบบ In-App
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-slate-400 font-bold">ความเร็ว:</span>
                            {['1x', '1.25x', '1.5x', '2x'].map((speed) => (
                              <button
                                key={speed}
                                onClick={() => {
                                  setPlaybackSpeed(speed);
                                  showToast(`⚡ ปรับความเร็วการเล่นเป็น ${speed}`);
                                }}
                                className={`px-2 py-0.5 rounded text-xs font-mono font-bold cursor-pointer ${
                                  playbackSpeed === speed ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                              >
                                {speed}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Video Info & Keypoints */}
                      <div className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                              หมวดหมู่: {currentVideo.category}
                            </span>
                            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
                              {currentVideo.title}
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                              {currentVideo.subtitle}
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab('quizzes');
                              setQuizViewState('catalog');
                            }}
                            className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>ทำควิซท้ายคลิป</span>
                          </button>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <h3 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                            <span>สาระสำคัญ & สูตรประจำบทเรียน</span>
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {currentVideo.keyPoints.map((kp, idx) => (
                              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
                                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                  <span>{kp.title}</span>
                                  {kp.formula && (
                                    <span className="font-mono text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                                      {kp.formula}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-600 leading-relaxed">
                                  {kp.detail}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Playlist & Notes Pad */}
                    <div className="lg:col-span-4 space-y-6">
                      
                      {/* Playlist */}
                      <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-3">
                        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="w-4 h-4 text-rose-500" />
                          <span>รายการคลิปในช่อง ({activeCreator.videos.length})</span>
                        </h3>

                        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                          {activeCreator.videos.map((vid, idx) => {
                            const isCurrent = idx === activeVideoIndex;
                            return (
                              <button
                                key={vid.id}
                                onClick={() => setActiveVideoIndex(idx)}
                                className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-start gap-3 cursor-pointer ${
                                  isCurrent
                                    ? 'bg-purple-50 text-purple-900 border border-purple-300 font-bold shadow-xs'
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${isCurrent ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                                  {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="line-clamp-2 leading-snug">{vid.title}</div>
                                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                                    <span>⏱ {vid.duration}</span>
                                    <span>•</span>
                                    <span>{vid.category}</span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes Pad */}
                      <div className="bg-white rounded-[22px] p-5 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                            <BookMarked className="w-4 h-4 text-purple-600" />
                            <span>สมุดจดโน้ตขณะเรียน</span>
                          </h3>
                          <button
                            onClick={handleDownloadNote}
                            className="text-[11px] text-purple-700 hover:text-purple-900 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <FileDown className="w-3.5 h-3.5" />
                            <span>ดาวน์โหลด</span>
                          </button>
                        </div>

                        <textarea
                          rows={5}
                          value={currentNoteText}
                          onChange={(e) => setCurrentNoteText(e.target.value)}
                          placeholder="พิมพ์จดสรุปเนื้อหา สูตรลับ หรือข้อสงสัยขณะฟังครีเอเตอร์สอน..."
                          className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all resize-none"
                        />

                        <button
                          onClick={handleSaveNote}
                          className="w-full py-2.5 rounded-xl bg-[#1F1A3D] hover:bg-[#2D2654] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>บันทึกโน้ตนี้</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 2: QUIZZES & FLASHCARDS                                         */}
              {/* =================================================================== */}
              {activeTab === 'quizzes' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                  
                  {/* CATALOG VIEW */}
                  {quizViewState === 'catalog' && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {['ทั้งหมด', 'กลศาสตร์', 'ไฟฟ้า', 'คลื่น', 'พลังงาน'].map((cat) => (
                            <button
                              key={cat}
                              onClick={() => setQuizCategoryFilter(cat)}
                              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                                quizCategoryFilter === cat
                                  ? 'bg-[#1F1A3D] text-white shadow-sm'
                                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <div className="text-xs font-bold text-slate-500">
                          รวมแบบทดสอบของ {activeCreator.name} ({([...(customQuizzesMap[activeCreator.id] || []), ...activeCreator.quizzes]).length} ชุด)
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...(customQuizzesMap[activeCreator.id] || []), ...activeCreator.quizzes]
                          .filter((q) => quizCategoryFilter === 'ทั้งหมด' || q.category === quizCategoryFilter)
                          .map((quiz) => (
                            <div
                              key={quiz.id}
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setQuizViewState('detail');
                              }}
                              className="group bg-white rounded-[22px] border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] hover:shadow-[0_16px_36px_rgba(31,26,61,0.12)] transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer hover:-translate-y-1"
                            >
                              <div
                                className="h-28 p-4 flex items-start justify-between relative overflow-hidden text-white"
                                style={{ backgroundColor: quiz.headerColor }}
                              >
                                <div className="w-11 h-11 rounded-xl bg-white shadow-md flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                                  {quiz.emoji}
                                </div>
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 backdrop-blur-md">
                                  {quiz.difficulty}
                                </span>
                                <div className="absolute bottom-2.5 left-4 flex items-center gap-3 text-[11px] font-bold">
                                  <span className="flex items-center gap-1 bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                                    <Users className="w-3 h-3" /> {quiz.participants}
                                  </span>
                                  <span className="flex items-center gap-1 bg-black/25 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                                    <BookOpen className="w-3 h-3" /> {quiz.questionCount} ข้อ
                                  </span>
                                </div>
                              </div>

                              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                                    {quiz.title}
                                  </h3>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                    {quiz.description}
                                  </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                  {quiz.tags.map((tag, idx) => (
                                    <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-[#7C3AED]">
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                  <span className="font-semibold text-slate-700 text-[11px]">
                                    โดย {quiz.author.name}
                                  </span>
                                  <span className="text-[10px] text-purple-700 font-bold flex items-center gap-1">
                                    <span>เข้าเล่นควิซ</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* DETAIL VIEW */}
                  {quizViewState === 'detail' && (
                    <div className="space-y-6 animate-in fade-in">
                      <button
                        onClick={() => setQuizViewState('catalog')}
                        className="flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>กลับสู่หน้ารวมควิซ</span>
                      </button>

                      <div
                        className="rounded-[24px] p-6 sm:p-8 text-white relative overflow-hidden shadow-lg flex items-center gap-6"
                        style={{ backgroundColor: selectedQuiz.headerColor }}
                      >
                        <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl shrink-0">
                          {selectedQuiz.emoji}
                        </div>
                        <div className="space-y-2">
                          <h2 className="text-xl sm:text-2xl font-black text-white">
                            {selectedQuiz.title}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-white">
                            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
                              ⭐ {selectedQuiz.participants} เล่น
                            </span>
                            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
                              📚 {selectedQuiz.questionCount} คำถาม
                            </span>
                            <span className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-full">
                              🏷️ {selectedQuiz.category}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column (Action & Modes) */}
                        <div className="lg:col-span-7 space-y-6">
                          <div className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4">
                            <h3 className="text-sm font-bold text-slate-900">เลือกโหมดการเล่นและการเรียนรู้</h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {selectedQuiz.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              {selectedQuiz.tags.map((t, idx) => (
                                <span key={idx} className="text-xs font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-[#7C3AED]">
                                  {t}
                                </span>
                              ))}
                            </div>

                            {/* 4 Primary Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {/* 1) Host Live */}
                              <button
                                onClick={() => setIsHostLiveModalOpen(true)}
                                className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                              >
                                <Zap className="w-4 h-4 text-amber-300" />
                                <span>🚀 Host Live (เปิดห้องแข่งสด)</span>
                              </button>

                              {/* 2) Play Solo */}
                              <button
                                onClick={() => handleStartPlaySolo(selectedQuiz)}
                                className="py-3 px-4 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                              >
                                <Play className="w-4 h-4 fill-white" />
                                <span>🎮 Play Solo (ทำข้อสอบเดี่ยว)</span>
                              </button>

                              {/* 3) Learn */}
                              <button
                                onClick={() => handleStartLearn(selectedQuiz)}
                                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <BookOpen className="w-4 h-4 text-purple-600" />
                                <span>📖 Learn (สรุปแก่นเนื้อหา)</span>
                              </button>

                              {/* 4) Flashcards */}
                              <button
                                onClick={() => handleStartFlashcards(selectedQuiz)}
                                className="py-3 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                              >
                                <Layers className="w-4 h-4 text-amber-500" />
                                <span>🗂️ Flashcards (3D Flip การ์ด)</span>
                              </button>
                            </div>
                          </div>

                          {/* Questions Preview List with 4 choices preview */}
                          <div className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <Layers className="w-4 h-4 text-purple-600" />
                                <span>พรีวิวรายการข้อสอบ ({selectedQuiz.questions.length} ข้อ)</span>
                              </h3>
                              <span className="text-[11px] text-purple-700 font-bold">
                                4 ตัวเลือก • มีเฉลยวิธีคิด
                              </span>
                            </div>

                            <div className="space-y-3">
                              {selectedQuiz.questions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5 transition-all hover:border-purple-300"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                                        {idx + 1}
                                      </span>
                                      <span className="text-[11px] font-bold text-purple-700">
                                        ⏱ {q.timeLimit} วินาที • {q.points} คะแนน
                                      </span>
                                    </div>

                                    <button
                                      onClick={() => handleStartPlaySolo(selectedQuiz)}
                                      className="px-3 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>ทำข้อนี้</span>
                                    </button>
                                  </div>

                                  <div className="text-xs font-bold text-slate-900 leading-snug">
                                    {q.text}
                                  </div>

                                  {q.formula && (
                                    <div className="inline-block font-mono text-[11px] px-2.5 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                                      {q.formula}
                                    </div>
                                  )}

                                  {/* 4 Choices Grid Preview */}
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                                    {q.options.map((opt, oIdx) => (
                                      <div
                                        key={oIdx}
                                        className={`p-2 rounded-xl text-[11px] flex items-center gap-2 ${
                                          oIdx === q.correctIndex
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold'
                                            : 'bg-white text-slate-700 border border-slate-200'
                                        }`}
                                      >
                                        <span className={`w-4 h-4 rounded-md flex items-center justify-center font-bold text-[10px] ${
                                          oIdx === q.correctIndex ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                          {['A', 'B', 'C', 'D'][oIdx]}
                                        </span>
                                        <span className="truncate">{opt}</span>
                                        {oIdx === q.correctIndex && (
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600 ml-auto shrink-0" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Hall of Fame & Exam Strategy Tips */}
                        <div className="lg:col-span-5 space-y-6">
                          
                          {/* Hall of Fame Leaderboard */}
                          <div className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span>กระดานทำเนียบผู้นำ (Hall of Fame)</span>
                              </h3>
                              <span className="text-[10px] text-slate-400 font-mono">TOP 5 RANK</span>
                            </div>

                            <div className="space-y-2">
                              {LEADERBOARD_DATA.map((u) => (
                                <div
                                  key={u.rank}
                                  className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                                    u.isUser
                                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20'
                                      : 'bg-slate-50 text-slate-700 border border-slate-100'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <span
                                      className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                                        u.rank === 1
                                          ? 'bg-amber-400 text-slate-950 shadow-xs'
                                          : u.rank === 2
                                          ? 'bg-slate-300 text-slate-800'
                                          : u.rank === 3
                                          ? 'bg-amber-600 text-white'
                                          : u.isUser
                                          ? 'bg-white/20 text-white'
                                          : 'bg-slate-200 text-slate-600'
                                      }`}
                                    >
                                      {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                                    </span>
                                    <span className="text-base">{u.avatar}</span>
                                    <div>
                                      <div className="font-bold leading-none">{u.name}</div>
                                      {u.isUser && (
                                        <div className="text-[10px] text-purple-200 font-normal mt-0.5">ผู้เล่นปัจจุบัน</div>
                                      )}
                                    </div>
                                  </div>

                                  <div className="font-mono font-bold text-right">
                                    <div>{u.isUser && userScore > 0 ? userScore.toLocaleString() : u.score.toLocaleString()}</div>
                                    <div className={`text-[10px] ${u.isUser ? 'text-purple-200' : 'text-slate-400'}`}>คะแนน</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Exam Strategy & Formula Shortcut Box */}
                          <div className="rounded-[24px] p-6 bg-[#1F1A3D] text-white shadow-xl space-y-3.5 border border-purple-500/30">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                              <Sparkles className="w-4 h-4" />
                              <span>เคล็ดลับการทำข้อสอบ & เทคนิคตัดช้อยส์</span>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed">
                              💡 <strong>เทคนิค Dimensional Analysis:</strong> เช็คหน่วยของคำถามเทียบกับช้อยส์ หากถามหาอัตราเร็ว (m/s) ให้ตัดช้อยส์ที่มีมิติแรงหรือพลังงานทิ้งได้ทันที!
                            </p>

                            <div className="p-3.5 rounded-xl bg-white/10 text-xs text-purple-200 font-mono space-y-1">
                              <div>v = u + at | s = ut + ½at²</div>
                              <div>W = F·s·cos θ | E_k = ½mv²</div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================================================================= */}
                  {/* PLAY SOLO GAME VIEW (Interactive Quiz Player & Live Timer)        */}
                  {/* ================================================================= */}
                  {quizViewState === 'play_solo' && (
                    <div className="p-4 max-w-4xl mx-auto w-full space-y-6 animate-in zoom-in-95">
                      
                      {/* Top Bar: Navigation & Live Stats */}
                      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={() => setQuizViewState('detail')}
                          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-700 cursor-pointer transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>ออกจากการเล่น</span>
                        </button>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                          <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                            <span>Streak: {streak}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                            <Trophy className="w-4 h-4 text-purple-600" />
                            <span>คะแนน: {userScore.toLocaleString()}</span>
                          </div>
                          <div className="text-slate-700 bg-slate-100 px-3 py-1 rounded-full font-mono">
                            ข้อ {currentQuestionIndex + 1}/{selectedQuiz.questions.length}
                          </div>
                        </div>
                      </div>

                      {!isGameOver ? (
                        <div className="space-y-5">
                          
                          {/* Animated Countdown Timer Bar */}
                          {(() => {
                            const currentQ = selectedQuiz.questions[currentQuestionIndex];
                            const totalT = currentQ?.timeLimit || 30;
                            const pct = Math.max(0, Math.min(100, (timeLeft / totalT) * 100));
                            const isUrgent = timeLeft <= 5;
                            return (
                              <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-bold px-1">
                                  <span className="flex items-center gap-1.5 text-slate-600">
                                    <Timer className="w-4 h-4 text-purple-600" />
                                    <span>เวลาที่เหลือต่อข้อ</span>
                                  </span>
                                  <span className={`font-mono text-sm font-black ${isUrgent ? 'text-rose-600 animate-pulse' : 'text-purple-700'}`}>
                                    ⏱ {timeLeft}s / {totalT}s
                                  </span>
                                </div>
                                <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 shadow-inner">
                                  <div
                                    className={`h-full rounded-full transition-all duration-300 ease-linear ${
                                      isUrgent
                                        ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                                        : timeLeft <= 10
                                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                                        : 'bg-gradient-to-r from-purple-500 to-indigo-600'
                                    }`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })()}

                          {/* Question Prompt Card */}
                          <div className="bg-white rounded-[26px] p-6 sm:p-8 border border-slate-200/90 shadow-md text-center space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold">
                              <span>คำถามข้อที่ {currentQuestionIndex + 1}</span>
                              <span>•</span>
                              <span>{selectedQuiz.questions[currentQuestionIndex].points || 1000} แต้ม</span>
                            </div>
                            
                            <h2 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug">
                              {selectedQuiz.questions[currentQuestionIndex].text}
                            </h2>

                            {selectedQuiz.questions[currentQuestionIndex].formula && (
                              <div className="inline-block font-mono text-sm sm:text-base px-4 py-2 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-bold shadow-xs">
                                {selectedQuiz.questions[currentQuestionIndex].formula}
                              </div>
                            )}
                          </div>

                          {/* 4 Choices Grid (Kahoot / Game-Show Styled) */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {selectedQuiz.questions[currentQuestionIndex].options.map((option, idx) => {
                              const choice = kahootChoiceColors[idx % 4];
                              const isSelected = userSelectedOption === idx;
                              const isCorrect = idx === selectedQuiz.questions[currentQuestionIndex].correctIndex;

                              let btnStyle = `${choice.bg} ${choice.hover} text-white shadow-md`;
                              if (isAnswerSubmitted) {
                                if (isCorrect) btnStyle = 'bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-lg scale-[1.01]';
                                else if (isSelected) btnStyle = 'bg-rose-600 text-white opacity-95';
                                else btnStyle = 'bg-slate-200 text-slate-500 opacity-40';
                              }

                              return (
                                <button
                                  key={idx}
                                  disabled={isAnswerSubmitted}
                                  onClick={() => handleSelectOption(idx)}
                                  className={`p-4 sm:p-5 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center gap-3.5 text-left cursor-pointer transform active:scale-98 ${btnStyle}`}
                                >
                                  <span className="w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center font-black text-lg shrink-0">
                                    {choice.shape}
                                  </span>
                                  <span className="flex-1 leading-snug">{option}</span>
                                  {isAnswerSubmitted && isCorrect && (
                                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Instant Feedback & Explanation Card */}
                          {isAnswerSubmitted && (
                            <div className="p-5 rounded-2xl bg-white border border-purple-200 shadow-md space-y-3.5 animate-in fade-in slide-in-from-bottom-2">
                              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100">
                                <div className="text-xs sm:text-sm font-black">
                                  {userSelectedOption === selectedQuiz.questions[currentQuestionIndex].correctIndex ? (
                                    <span className="text-emerald-600 flex items-center gap-1.5">
                                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                      <span>ถูกต้องยอดเยี่ยม! (+{selectedQuiz.questions[currentQuestionIndex].points || 1000} แต้ม + Speed Bonus)</span>
                                    </span>
                                  ) : (
                                    <span className="text-rose-600 flex items-center gap-1.5">
                                      <AlertCircle className="w-5 h-5 text-rose-600" />
                                      <span>ยังไม่ถูกต้อง! เฉลยคือตัวเลือก {['A', 'B', 'C', 'D'][selectedQuiz.questions[currentQuestionIndex].correctIndex]}: {selectedQuiz.questions[currentQuestionIndex].options[selectedQuiz.questions[currentQuestionIndex].correctIndex]}</span>
                                    </span>
                                  )}
                                </div>

                                <button
                                  onClick={handleNextQuestion}
                                  className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-purple-500/20 cursor-pointer active:scale-98"
                                >
                                  <span>{currentQuestionIndex + 1 < selectedQuiz.questions.length ? 'ข้อถัดไป' : 'ดูสรุปผลคะแนน'}</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="p-4 rounded-xl bg-purple-50 text-xs text-purple-950 leading-relaxed border border-purple-200 space-y-1">
                                <div className="font-bold text-purple-900 flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                  <span>คำอธิบายเฉลยวิธีคิด:</span>
                                </div>
                                <p className="text-slate-700">
                                  {selectedQuiz.questions[currentQuestionIndex].explanation || 'คำตอบถูกต้องตามหลักการคำนวณและทฤษฎีทางฟิสิกส์'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* ======================================================= */
                        /* GAME OVER: SUMMARY SCORE & DYNAMIC LEADERBOARD          */
                        /* ======================================================= */
                        <div className="bg-white rounded-[28px] p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6 animate-in zoom-in-95">
                          
                          {/* Hero Score Badge */}
                          <div className="text-center space-y-3">
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-200 text-amber-900 flex items-center justify-center text-4xl mx-auto shadow-lg shadow-amber-300/30">
                              🏆
                            </div>
                            <div>
                              <span className="text-xs font-bold text-purple-700 uppercase tracking-widest">
                                MISSION COMPLETED
                              </span>
                              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                                สรุปผลคะแนนการประลองควิซ
                              </h2>
                              <p className="text-xs text-slate-500">
                                ชุดข้อสอบ: {selectedQuiz.title} ({selectedQuiz.category})
                              </p>
                            </div>

                            <div className="text-4xl sm:text-5xl font-mono font-black text-[#7C3AED] py-1">
                              {userScore.toLocaleString()} <span className="text-lg font-bold text-slate-600">คะแนน</span>
                            </div>
                          </div>

                          {/* Stats Metrics Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-center space-y-1">
                              <Target className="w-5 h-5 text-purple-600 mx-auto" />
                              <div className="text-[11px] font-bold text-slate-500">ความแม่นยำ (Accuracy)</div>
                              <div className="text-base font-black text-purple-900">
                                {correctAnswersCount}/{selectedQuiz.questions.length} ({Math.round((correctAnswersCount / (selectedQuiz.questions.length || 1)) * 100)}%)
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-1">
                              <Flame className="w-5 h-5 text-amber-500 mx-auto" />
                              <div className="text-[11px] font-bold text-slate-500">Streak สูงสุด</div>
                              <div className="text-base font-black text-amber-700">
                                🔥 x{maxStreak}
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 text-center space-y-1">
                              <Timer className="w-5 h-5 text-cyan-600 mx-auto" />
                              <div className="text-[11px] font-bold text-slate-500">เวลาที่ใช้ทั้งหมด</div>
                              <div className="text-base font-black text-cyan-800">
                                ⏱ {quizElapsedSeconds} วินาที
                              </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                              <Award className="w-5 h-5 text-emerald-600 mx-auto" />
                              <div className="text-[11px] font-bold text-slate-500">อันดับของคุณ</div>
                              <div className="text-base font-black text-emerald-800">
                                {userScore >= 12000 ? '🥇 Rank #1' : userScore >= 10000 ? '🥈 Rank #2' : userScore >= 8000 ? '🥉 Rank #3' : '⭐ Top 5'}
                              </div>
                            </div>
                          </div>

                          {/* Dynamic Leaderboard for this Quiz */}
                          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <Trophy className="w-4 h-4 text-amber-500" />
                                <span>กระดานคะแนนผู้นำประจำชุดข้อสอบนี้ (Leaderboard)</span>
                              </h3>
                              <span className="text-[10px] text-slate-400 font-mono">LIVE RANKINGS</span>
                            </div>

                            {(() => {
                              const dynamicBoard = [
                                { rank: 1, name: 'Mind Physics', avatar: '🦊', score: 12800 },
                                { rank: 2, name: 'ฟิสิกส์สู้ตาย', avatar: '🐯', score: 11500 },
                                { rank: 3, name: 'ครู No.7', avatar: '👨‍🏫', score: 10200 },
                                { rank: 4, name: 'เด็กวิทย์ TCAS', avatar: '🧪', score: 9800 },
                                { rank: 5, name: 'คุณ (Cadet)', avatar: '⭐', score: userScore, isUser: true },
                              ]
                                .sort((a, b) => b.score - a.score)
                                .map((item, idx) => ({ ...item, rank: idx + 1 }));

                              return (
                                <div className="space-y-2">
                                  {dynamicBoard.map((u) => (
                                    <div
                                      key={u.rank}
                                      className={`p-3 rounded-xl flex items-center justify-between text-xs transition-all ${
                                        u.isUser
                                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold shadow-md shadow-purple-500/20'
                                          : 'bg-white text-slate-700 border border-slate-200'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <span
                                          className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                                            u.rank === 1
                                              ? 'bg-amber-400 text-slate-950 shadow-xs'
                                              : u.rank === 2
                                              ? 'bg-slate-300 text-slate-800'
                                              : u.rank === 3
                                              ? 'bg-amber-600 text-white'
                                              : u.isUser
                                              ? 'bg-white/20 text-white'
                                              : 'bg-slate-100 text-slate-600'
                                          }`}
                                        >
                                          {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : u.rank}
                                        </span>
                                        <span className="text-base">{u.avatar}</span>
                                        <div>
                                          <div className="font-bold leading-none">{u.name}</div>
                                          {u.isUser && (
                                            <div className="text-[10px] text-purple-200 font-normal mt-0.5">คะแนนรอบล่าสุดของคุณ</div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="font-mono font-bold text-right">
                                        <div>{u.score.toLocaleString()}</div>
                                        <div className={`text-[10px] ${u.isUser ? 'text-purple-200' : 'text-slate-400'}`}>คะแนน</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              );
                            })()}
                          </div>

                          {/* Strategy Box: เคล็ดลับการทำข้อสอบ */}
                          <div className="rounded-2xl p-5 bg-[#1F1A3D] text-white shadow-md space-y-2.5 border border-purple-500/30">
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                              <Sparkles className="w-4 h-4" />
                              <span>เคล็ดลับการทำข้อสอบ & เทคนิคคิดเร็วประจำบท {selectedQuiz.category}</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              💡 <strong>สูตรลัดประจำบท:</strong> เมื่อเจอโจทย์ที่มีการเปลี่ยนแปลงของพลังงาน ใช้กฎอนุรักษ์พลังงาน <code>E₁ + W = E₂</code> จะช่วยลดขั้นตอนการหาความเร่งและการแตกแรงได้เร็วกว่าเดิมถึง 50%
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                            <button
                              onClick={() => handleStartPlaySolo(selectedQuiz)}
                              className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center gap-2 cursor-pointer active:scale-98"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>เล่นใหม่อีกครั้ง (Play Again)</span>
                            </button>

                            <button
                              onClick={() => handleStartFlashcards(selectedQuiz)}
                              className="px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs flex items-center gap-2 cursor-pointer"
                            >
                              <Layers className="w-4 h-4" />
                              <span>ทบทวน Flashcards</span>
                            </button>

                            <button
                              onClick={() => setQuizViewState('catalog')}
                              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
                            >
                              <ArrowLeft className="w-4 h-4" />
                              <span>กลับสู่หน้ารวมควิซ</span>
                            </button>
                          </div>

                        </div>
                      )}

                    </div>
                  )}

                  {/* FLASHCARDS VIEW */}
                  {quizViewState === 'flashcards' && (
                    <div className="p-4 max-w-2xl mx-auto w-full space-y-6 animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setQuizViewState('detail')}
                          className="flex items-center gap-1.5 text-xs font-bold text-purple-700 cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>กลับหน้ารายละเอียด</span>
                        </button>
                        <span className="text-xs font-bold text-slate-500">
                          การ์ด {cardIndex + 1} / {selectedQuiz.flashcards.length}
                        </span>
                      </div>

                      <div
                        onClick={() => setIsFlipped(!isFlipped)}
                        className="min-h-[280px] p-8 rounded-[28px] bg-white border-2 border-purple-200 shadow-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:border-purple-400"
                      >
                        <span className="text-[11px] font-bold text-purple-600 uppercase tracking-widest mb-3">
                          {isFlipped ? 'คำอธิบาย (Definition)' : 'หัวข้อ / คำศัพท์ (Term)'}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                          {isFlipped ? selectedQuiz.flashcards[cardIndex].definition : selectedQuiz.flashcards[cardIndex].term}
                        </h3>
                        {selectedQuiz.flashcards[cardIndex].formula && isFlipped && (
                          <div className="mt-4 font-mono text-sm px-4 py-1.5 rounded-xl bg-purple-50 text-purple-800 font-bold border border-purple-200">
                            {selectedQuiz.flashcards[cardIndex].formula}
                          </div>
                        )}
                        <span className="text-[11px] text-slate-400 mt-6">
                          (คลิกที่การ์ดเพื่อพลิกดูเฉลย)
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <button
                          disabled={cardIndex === 0}
                          onClick={() => {
                            setCardIndex((prev) => prev - 1);
                            setIsFlipped(false);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-slate-100 disabled:opacity-40 text-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>การ์ดก่อนหน้า</span>
                        </button>

                        <button
                          disabled={cardIndex + 1 >= selectedQuiz.flashcards.length}
                          onClick={() => {
                            setCardIndex((prev) => prev + 1);
                            setIsFlipped(false);
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#7C3AED] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>การ์ดถัดไป</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* LEARN NOTES VIEW */}
                  {quizViewState === 'learn' && (
                    <div className="p-4 max-w-3xl mx-auto w-full space-y-6 animate-in fade-in">
                      <button
                        onClick={() => setQuizViewState('detail')}
                        className="flex items-center gap-1.5 text-xs font-bold text-purple-700 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>กลับหน้ารายละเอียด</span>
                      </button>

                      <div className="bg-white rounded-[24px] p-6 sm:p-8 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4">
                        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          <span>สรุปสาระสำคัญ: {selectedQuiz.title}</span>
                        </h2>
                        <div className="space-y-3 pt-2">
                          {selectedQuiz.learnNotes.map((note, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-slate-800 leading-relaxed flex items-start gap-3">
                              <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 3: CHEAT SHEETS & PDF VAULT                                     */}
              {/* =================================================================== */}
              {activeTab === 'sheets' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        ชีทสรุปสูตร & เอกสารติวของช่อง {activeCreator.name}
                      </h2>
                      <p className="text-xs text-slate-500">
                        เปิดอ่านสรุปในระบบได้ทันที หรือดาวน์โหลดไฟล์เก็บไว้ทบทวน
                      </p>
                    </div>
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                      {activeCreator.sheets.length} ไฟล์พร้อมใช้งาน
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {activeCreator.sheets.map((sheet) => (
                      <div
                        key={sheet.id}
                        className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] hover:shadow-[0_16px_36px_rgba(31,26,61,0.12)] transition-all flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                              {sheet.category}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              {sheet.fileSize} • {sheet.pages} หน้า
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 leading-snug">
                            {sheet.title}
                          </h3>

                          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {sheet.description}
                          </p>

                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            {sheet.highlights.slice(0, 3).map((hl, idx) => (
                              <div key={idx} className="text-[11px] text-slate-600 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                                <span className="truncate">{hl}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => setPreviewSheet(sheet)}
                            className="flex-1 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>เปิดอ่านในระบบ</span>
                          </button>

                          <button
                            onClick={() => {
                              showToast(`📥 กำลังดาวน์โหลด ${sheet.title}`);
                            }}
                            className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer"
                            title="ดาวน์โหลด"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =================================================================== */}
              {/* TAB 4: Q&A BOARD                                                    */}
              {/* =================================================================== */}
              {activeTab === 'qna' && (
                <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-[22px] border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)]">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>กระดานถาม-ตอบประจำช่อง {activeCreator.name}</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        โพสต์คำถามเกี่ยวกับโจทย์หรือบทเรียนเพื่อรับคำตอบจากครีเอเตอร์โดยตรง
                      </p>
                    </div>

                    <button
                      onClick={() => setIsAskModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-98"
                    >
                      <Plus className="w-4 h-4" />
                      <span>ตั้งคำถามใหม่</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {qnaList.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white rounded-[22px] p-6 border border-gray-100 shadow-[0_8px_24px_rgba(31,26,61,0.06)] space-y-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-lg font-bold">
                              {post.authorAvatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-800">{post.author}</span>
                                <span className="text-[10px] text-slate-400">• {post.timeAgo}</span>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 inline-block mt-0.5">
                                #{post.topicTag}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleLikeQuestion(post.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                              post.hasLiked ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${post.hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                            <span>{post.likes}</span>
                          </button>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
                          {post.question}
                        </p>

                        {post.formula && (
                          <div className="inline-block font-mono text-xs px-3 py-1 rounded-lg bg-purple-50 text-purple-800 font-bold border border-purple-200">
                            {post.formula}
                          </div>
                        )}

                        {post.creatorAnswer ? (
                          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50/90 to-indigo-50/70 border border-purple-200 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{post.creatorAnswer.avatar}</span>
                              <span className="text-xs font-bold text-purple-950">{post.creatorAnswer.author}</span>
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-600 text-white">
                                <Crown className="w-2.5 h-2.5" /> ครูตอบแล้ว
                              </span>
                              <span className="text-[10px] text-slate-400 ml-auto">{post.creatorAnswer.timeAgo}</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed pl-6">
                              {post.creatorAnswer.text}
                            </p>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-slate-50 text-slate-500 text-xs flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            <span>รอครู/ทีมงานตรวจสอบและตอบคำถาม</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL: IN-APP SHEET PDF PREVIEW MODAL                                     */}
        {/* ========================================================================= */}
        {previewSheet && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-[28px] overflow-hidden shadow-2xl border border-purple-200 flex flex-col">
              <div className="p-4 sm:p-5 bg-[#1F1A3D] text-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-300" />
                  <div>
                    <h3 className="text-sm font-bold text-white">{previewSheet.title}</h3>
                    <span className="text-[10px] text-purple-200">{previewSheet.category} • {previewSheet.fileSize}</span>
                  </div>
                </div>
                <button
                  onClick={() => setPreviewSheet(null)}
                  className="p-1 rounded-full hover:bg-white/20 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 bg-slate-100 p-2 sm:p-4">
                <iframe
                  src={previewSheet.previewUrl}
                  title={previewSheet.title}
                  className="w-full h-full rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ASK QUESTION MODAL                                                 */}
        {/* ========================================================================= */}
        {isAskModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  ตั้งคำถามถึง {activeCreator.name}
                </h3>
                <button
                  onClick={() => setIsAskModalOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddQuestion} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">หมวดวิชา</label>
                  <select
                    value={newQuestionTag}
                    onChange={(e) => setNewQuestionTag(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                  >
                    <option value="กลศาสตร์">กลศาสตร์</option>
                    <option value="ไฟฟ้า">ไฟฟ้า</option>
                    <option value="คลื่น">คลื่น</option>
                    <option value="พลังงาน">พลังงาน</option>
                    <option value="ดาราศาสตร์">ดาราศาสตร์</option>
                    <option value="ควอนตัม">ควอนตัม</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">คำถาม / ข้อสงสัย</label>
                  <textarea
                    rows={4}
                    required
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="พิมพ์คำถามหรือโจทย์ที่ต้องการปรึกษา..."
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">สูตรฟิสิกส์ (ถ้ามี)</label>
                  <input
                    type="text"
                    value={newQuestionFormula}
                    onChange={(e) => setNewQuestionFormula(e.target.value)}
                    placeholder="เช่น ∑F = ma หรือ v = fλ"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAskModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md cursor-pointer"
                  >
                    โพสต์คำถาม
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CREATOR ONBOARDING APPLICATION FORM MODAL                          */}
        {/* ========================================================================= */}
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-xl bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[11px] font-extrabold mb-1">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                    <span>CREATOR ONBOARDING</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900">
                    แบบฟอร์มสมัครเป็น Creator / ติวเตอร์
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    กรอกข้อมูลเบื้องต้นเพื่อส่งให้แอดมินพิจารณาอนุมัติเปิดช่องการเรียนรู้
                  </p>
                </div>
                <button
                  onClick={() => setIsApplyModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleApplySubmit} className="space-y-4">
                {/* 1) Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    1) ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applyForm.name}
                    onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                    placeholder="เช่น ดร.สมชาย วิทยาการ / นายสิทธิโชค ศิษย์เอก"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                {/* 2 & 3) Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      2) เบอร์โทรศัพท์ติดต่อ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={applyForm.phone}
                      onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                      placeholder="เช่น 081-234-5678"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      3) อีเมล (E-mail) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={applyForm.email}
                      onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                      placeholder="เช่น tutor@physics.com"
                      className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* 4) Education */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    4) ประวัติการศึกษา / สถาบันที่จบ
                  </label>
                  <input
                    type="text"
                    value={applyForm.education}
                    onChange={(e) => setApplyForm({ ...applyForm, education: e.target.value })}
                    placeholder="เช่น วท.บ. ฟิสิกส์ จุฬาฯ / ค.บ. มัธยมศึกษา (วิทยาศาสตร์)"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                {/* 5) Proposed Channel Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    5) ชื่อช่องที่ต้องการสร้าง <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applyForm.channelName}
                    onChange={(e) => setApplyForm({ ...applyForm, channelName: e.target.value })}
                    placeholder="เช่น Quantum Physics Lab / ตะลุยโจทย์ฟิสิกส์ขั้นเทพ"
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                  />
                </div>

                {/* 6) Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    6) หมวดหมู่วิชาและเนื้อหาที่ต้องการสอน
                  </label>
                  <select
                    value={applyForm.category}
                    onChange={(e) => setApplyForm({ ...applyForm, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                  >
                    <option value="ฟิสิกส์ ม.ปลาย">ฟิสิกส์ ม.ปลาย (ม.4 - ม.6)</option>
                    <option value="TCAS & A-Level">TCAS & A-Level ตะลุยโจทย์สอบเข้า</option>
                    <option value="สอวน. & ฟิสิกส์โอลิมปิก">สอวน. & ฟิสิกส์โอลิมปิก</option>
                    <option value="ดาราศาสตร์ & อวกาศ">ดาราศาสตร์ & ฟิสิกส์อวกาศ</option>
                    <option value="วิทยาศาสตร์ทั่วไป & การทดลอง">วิทยาศาสตร์ทั่วไป & การทดลอง</option>
                  </select>
                </div>

                {/* 7) Bio / Teaching Style */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    7) คำอธิบายแนวทางการสอนย่อ
                  </label>
                  <textarea
                    rows={3}
                    value={applyForm.description}
                    onChange={(e) => setApplyForm({ ...applyForm, description: e.target.value })}
                    placeholder="อธิบายสไตล์การสอน สื่อที่จะนำมาลง และจุดเด่นของช่องคุณ..."
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition-all cursor-pointer active:scale-98"
                  >
                    ส่งใบสมัครเพื่อรอการอนุมัติ
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: CREATOR STUDIO - CREATE QUIZ & FLASHCARDS MODAL                    */}
        {/* ========================================================================= */}
        {isCreateQuizModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="relative w-full max-w-3xl bg-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-purple-200 space-y-6 max-h-[92vh] overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/25">
                    🎨
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-extrabold mb-0.5">
                      <Sparkles className="w-3 h-3 text-purple-600" />
                      <span>CREATOR STUDIO</span>
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight">
                      สร้างชุดข้อสอบ & แฟลชการ์ดใหม่
                    </h3>
                    <p className="text-xs text-slate-500">
                      เผยแพร่คอนเทนต์ข้อสอบลงช่อง <strong>{activeCreator.name}</strong> โดยตรง
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsCreateQuizModalOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Creation Mode Selector Tabs (ฝั่ง A vs ฝั่ง B) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                {/* ฝั่ง A: ป้อนข้อมูลสร้างด้วยตนเอง (Manual Creator) */}
                <button
                  type="button"
                  onClick={() => setCreationMode('manual')}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    creationMode === 'manual'
                      ? 'bg-white text-purple-900 shadow-md border border-purple-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <PenTool className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>ป้อนข้อมูลสร้างด้วยตนเอง (Manual Creator)</span>
                </button>

                {/* ฝั่ง B: สร้างอัตโนมัติด้วย AI Studio (LAB 2 Engine) */}
                <button
                  type="button"
                  onClick={handleSelectAiMode}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                    creationMode === 'ai'
                      ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white shadow-md border border-purple-400/40'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 shrink-0 ${creationMode === 'ai' ? 'text-amber-300' : 'text-purple-600'}`} />
                  <span>สร้างอัตโนมัติด้วย AI Studio (LAB 2 Engine)</span>
                  {!canUseAiStudio ? (
                    <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-full border border-amber-300 shadow-xs shrink-0">
                      <Lock className="w-2.5 h-2.5 text-amber-700" />
                      <span>PREMIUM ONLY</span>
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full shadow-xs shrink-0">
                      PREMIUM
                    </span>
                  )}
                </button>
              </div>

              {/* ========================================================= */}
              {/* MODE A: MANUAL CREATOR FORM                               */}
              {/* ========================================================= */}
              {creationMode === 'manual' && (
                <form onSubmit={handlePublishNewQuiz} className="space-y-6 animate-in fade-in duration-150">
                  {/* 1. General Quiz Info */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span>1. ข้อมูลทั่วไปของชุดข้อสอบ</span>
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          ชื่อชุดข้อสอบ <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newQuizTitle}
                          onChange={(e) => setNewQuizTitle(e.target.value)}
                          placeholder="เช่น ตะลุยโจทย์ กฎการเคลื่อนที่นิวตัน & แรงเสียดทาน ชุดที่ 1"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          คำอธิบายย่อ
                        </label>
                        <input
                          type="text"
                          value={newQuizDesc}
                          onChange={(e) => setNewQuizDesc(e.target.value)}
                          placeholder="เช่น ข้อสอบเข้มข้น 4 ตัวเลือก พร้อมสูตรลัดและเฉลยละเอียดทุกข้อ เหมาะสำหรับเตรียมสอบ TCAS"
                          className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">หมวดหมู่วิชา</label>
                          <select
                            value={newQuizCategory}
                            onChange={(e) => setNewQuizCategory(e.target.value)}
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                          >
                            <option value="สังคมศึกษา & ประวัติศาสตร์">สังคมศึกษา & ประวัติศาสตร์</option>
                            <option value="ภาษาอังกฤษ">ภาษาอังกฤษ</option>
                            <option value="ภาษาไทย">ภาษาไทย</option>
                            <option value="วิทยาศาสตร์ & ฟิสิกส์">วิทยาศาสตร์ & ฟิสิกส์</option>
                            <option value="คณิตศาสตร์">คณิตศาสตร์</option>
                            <option value="กฎหมายเบื้องต้น">กฎหมายเบื้องต้น</option>
                            <option value="การเงิน & ธุรกิจ">การเงิน & ธุรกิจ</option>
                            <option value="กลศาสตร์">กลศาสตร์</option>
                            <option value="ไฟฟ้า & แม่เหล็ก">ไฟฟ้า & แม่เหล็ก</option>
                            <option value="คลื่น & แสง">คลื่น & แสง</option>
                            <option value="ความรู้รอบตัว">ความรู้รอบตัว</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">ระดับความยาก</label>
                          <select
                            value={newQuizDifficulty}
                            onChange={(e) => setNewQuizDifficulty(e.target.value as any)}
                            className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500"
                          >
                            <option value="ง่าย">ง่าย (Beginner)</option>
                            <option value="ปานกลาง">ปานกลาง (Intermediate)</option>
                            <option value="ยาก">ยาก (Advanced / A-Level)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">อิโมจิ & สีธีม</label>
                          <div className="flex items-center gap-2">
                            <select
                              value={newQuizEmoji}
                              onChange={(e) => setNewQuizEmoji(e.target.value)}
                              className="w-20 p-2.5 rounded-xl bg-white border border-slate-200 text-base text-center"
                            >
                              <option value="🚀">🚀</option>
                              <option value="⚡">⚡</option>
                              <option value="📚">📚</option>
                              <option value="🏛️">🏛️</option>
                              <option value="⚖️">⚖️</option>
                              <option value="💰">💰</option>
                              <option value="🍎">🍎</option>
                              <option value="🌌">🌌</option>
                              <option value="🧪">🧪</option>
                              <option value="🎯">🎯</option>
                              <option value="💡">💡</option>
                            </select>
                            <input
                              type="color"
                              value={newQuizHeaderColor}
                              onChange={(e) => setNewQuizHeaderColor(e.target.value)}
                              className="h-9 w-full rounded-xl cursor-pointer bg-white border border-slate-200 p-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 2. Question Items Builder */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        <span>2. รายการข้อสอบรายข้อ ({newQuestionsList.length} ข้อ)</span>
                      </h4>
                      <span className="text-[11px] text-purple-700 font-bold">
                        คลิกปุ่มวงกลมหน้ารายการช้อยส์เพื่อระบุข้อที่ถูกต้อง
                      </span>
                    </div>

                    <div className="space-y-4">
                      {newQuestionsList.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl bg-white border-2 border-purple-100 shadow-xs space-y-4 relative transition-all hover:border-purple-300"
                        >
                          {/* Question Header & Delete */}
                          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-xl bg-[#7C3AED] text-white font-black text-xs flex items-center justify-center shadow-xs">
                                {qIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                คำถามข้อที่ {qIdx + 1}
                              </span>
                            </div>

                            {newQuestionsList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveQuestionField(qIdx)}
                                className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>ลบข้อนี้</span>
                              </button>
                            )}
                          </div>

                          {/* Question Text & Formula */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                โจทย์คำถาม <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                value={q.text}
                                onChange={(e) => handleUpdateQuestionField(qIdx, 'text', e.target.value)}
                                placeholder="เช่น วัตถุมวล 5 kg เคลื่อนที่ด้วยความเร่ง 4 m/s² บนพื้นราบลื่น จงหาแรงลัพธ์ที่กระทำต่อวัตถุ?"
                                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                สูตรคำนวณ / สัญลักษณ์วิชาการ (ถ้ามี)
                              </label>
                              <input
                                type="text"
                                value={q.formula || ''}
                                onChange={(e) => handleUpdateQuestionField(qIdx, 'formula', e.target.value)}
                                placeholder="เช่น ∑F = ma หรือ E = mc² หรือ A = P(1+r/n)^nt"
                                className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-purple-900 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white"
                              />
                            </div>

                            {/* 4 Choices */}
                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-2">
                                ตัวเลือก 4 ช้อยส์ (กดเลือกวงกลมสีเขียว = ตัวเลือกที่ถูกต้อง) <span className="text-rose-500">*</span>
                              </label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {q.options.map((opt, optIdx) => {
                                  const isCorrect = q.correctIndex === optIdx;
                                  const choiceLetters = ['A', 'B', 'C', 'D'];
                                  return (
                                    <div
                                      key={optIdx}
                                      className={`flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border transition-all ${
                                        isCorrect
                                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200'
                                          : 'bg-slate-50 border-slate-200'
                                      }`}
                                    >
                                      <button
                                        type="button"
                                        onClick={() => handleUpdateQuestionField(qIdx, 'correctIndex', optIdx)}
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 cursor-pointer transition-colors ${
                                          isCorrect
                                            ? 'bg-emerald-600 text-white shadow-xs'
                                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                        }`}
                                        title={isCorrect ? 'ตัวเลือกที่ถูกต้อง' : 'คลิกเพื่อตั้งเป็นคำตอบที่ถูก'}
                                      >
                                        {choiceLetters[optIdx]}
                                      </button>
                                      <input
                                        type="text"
                                        required
                                        value={opt}
                                        onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                                        placeholder={`ตัวเลือก ${choiceLetters[optIdx]}...`}
                                        className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden font-medium"
                                      />
                                      {isCorrect && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Time Limit, Points & Explanation */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  เวลาทำข้อนี้ (วินาที)
                                </label>
                                <select
                                  value={q.timeLimit}
                                  onChange={(e) => handleUpdateQuestionField(qIdx, 'timeLimit', Number(e.target.value))}
                                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                                >
                                  <option value={15}>15 วินาที (สายสปีด)</option>
                                  <option value={20}>20 วินาที</option>
                                  <option value={30}>30 วินาที (มาตรฐาน)</option>
                                  <option value={45}>45 วินาที</option>
                                  <option value={60}>60 วินาที (โจทย์คำนวณยาว)</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                  คะแนนประจำข้อ (Points)
                                </label>
                                <select
                                  value={q.points}
                                  onChange={(e) => handleUpdateQuestionField(qIdx, 'points', Number(e.target.value))}
                                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800"
                                >
                                  <option value={500}>500 แต้ม</option>
                                  <option value={1000}>1,000 แต้ม (มาตรฐาน)</option>
                                  <option value={1500}>1,500 แต้ม</option>
                                  <option value={2000}>2,000 แต้ม (โจทย์ท้าทาย)</option>
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                                คำอธิบายเฉลยวิธีคิด (Explanation)
                              </label>
                              <textarea
                                rows={2}
                                value={q.explanation}
                                onChange={(e) => handleUpdateQuestionField(qIdx, 'explanation', e.target.value)}
                                placeholder="อธิบายวิธีคิดและสูตรที่ใช้ เพื่อให้ผู้เรียนเข้าใจวิธีทำเมื่อตอบเสร็จ..."
                                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Question Button */}
                    <button
                      type="button"
                      onClick={handleAddQuestionField}
                      className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>เพิ่มข้อสอบข้อถัดไป</span>
                    </button>
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCreateQuizModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ยกเลิก
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-md shadow-purple-500/25 transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>บันทึกและเผยแพร่ลงช่องทันที</span>
                    </button>
                  </div>
                </form>
              )}

              {/* ========================================================= */}
              {/* MODE B: UNIVERSAL MULTI-SUBJECT AI ENGINE FORM            */}
              {/* ========================================================= */}
              {creationMode === 'ai' && (
                <form onSubmit={handleGenerateWithAi} className="space-y-6 animate-in fade-in duration-150">
                  {/* AI Banner */}
                  <div className="bg-gradient-to-br from-purple-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 rounded-3xl border border-purple-500/30 shadow-xl relative overflow-hidden">
                    <div className="absolute -top-12 -right-12 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-[10px] font-mono font-bold">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>UNIVERSAL MULTI-SUBJECT AI ENGINE • LAB 2 POWERED</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                        ระบบผู้ช่วย AI สร้างชุดข้อสอบ & แฟลชการ์ดอัจฉริยะทุกหมวดวิชา
                      </h4>
                      <p className="text-xs text-purple-200/90 leading-relaxed max-w-2xl">
                        ปลดล็อกการสร้างข้อสอบทุกกลุ่มสาระการเรียนรู้ ไม่จำกัดเฉพาะวิทยาศาสตร์! ออกโจทย์ได้ครอบคลุมทั้งสังคมศึกษา, ประวัติศาสตร์, ภาษาไทย, ภาษาอังกฤษ, กฎหมาย, การเงิน, วิทยาศาสตร์ และความรู้รอบตัวตามหลักสูตรอย่างแม่นยำ
                      </p>
                    </div>
                  </div>

                  {/* AI Settings Grid */}
                  <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200/90 space-y-5">
                    {/* 1. Format & Question Count */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Format */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          1. รูปแบบชุดข้อสอบ
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setAiFormat('quiz')}
                            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              aiFormat === 'quiz'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25 ring-2 ring-purple-200'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-sm font-black">โหมด 4 ตัวเลือก</span>
                            <span className={`text-[10px] font-normal ${aiFormat === 'quiz' ? 'text-purple-100' : 'text-slate-400'}`}>
                              Multiple Choice
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setAiFormat('flashcard')}
                            className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                              aiFormat === 'flashcard'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25 ring-2 ring-purple-200'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <span className="text-sm font-black">โหมดแฟลชการ์ด</span>
                            <span className={`text-[10px] font-normal ${aiFormat === 'flashcard' ? 'text-purple-100' : 'text-slate-400'}`}>
                              True / False (ใช่/ไม่ใช่)
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Question Count */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-2">
                          2. จำนวนข้อที่ต้องการสร้าง
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[5, 10, 15, 20].map((cnt) => (
                            <button
                              key={cnt}
                              type="button"
                              onClick={() => setAiQuestionCount(cnt)}
                              className={`py-3 px-2 rounded-2xl border text-xs font-bold flex flex-col items-center justify-center transition-all cursor-pointer ${
                                aiQuestionCount === cnt
                                  ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/25 ring-2 ring-purple-200'
                                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <span className="text-sm font-black">{cnt}</span>
                              <span className={`text-[10px] font-normal ${aiQuestionCount === cnt ? 'text-purple-100' : 'text-slate-400'}`}>
                                ข้อ
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 2. Level & Difficulty */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Academic Level */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          3. ระดับชั้นการศึกษา
                        </label>
                        <select
                          value={aiLevel}
                          onChange={(e) => setAiLevel(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="primary">ประถมศึกษา (Primary)</option>
                          <option value="middle">มัธยมศึกษาตอนต้น (Middle School)</option>
                          <option value="high">มัธยมศึกษาตอนปลาย (High School / TCAS)</option>
                          <option value="university">มหาวิทยาลัย / อุดมศึกษา (University)</option>
                          <option value="general">บุคคลทั่วไป / ศึกษาตามอัธยาศัย (General)</option>
                        </select>
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          4. ระดับความยาก
                        </label>
                        <select
                          value={aiDifficulty}
                          onChange={(e) => setAiDifficulty(e.target.value)}
                          className="w-full p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        >
                          <option value="easy">ง่าย (เน้นความจำและความรู้พื้นฐาน)</option>
                          <option value="medium">ปานกลาง (เน้นการประยุกต์ใช้และการแก้ปัญหา)</option>
                          <option value="hard">ท้าทาย (เน้นการคิดวิเคราะห์และการประเมินค่า)</option>
                        </select>
                      </div>
                    </div>

                    {/* 3. Category & Free-Text Topic Input */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          5. กลุ่มสาระวิชาหลัก
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            'สังคมศึกษา & ประวัติศาสตร์',
                            'ภาษาอังกฤษ',
                            'ภาษาไทย',
                            'วิทยาศาสตร์ & ฟิสิกส์',
                            'คณิตศาสตร์',
                            'กฎหมายเบื้องต้น',
                            'การเงิน & ธุรกิจ',
                            'ความรู้รอบตัวสากล',
                          ].map((subj) => (
                            <button
                              key={subj}
                              type="button"
                              onClick={() => setAiSubject(subj)}
                              className={`p-2.5 rounded-xl border text-[11px] font-bold text-center transition-all cursor-pointer truncate ${
                                aiSubject === subj
                                  ? 'bg-purple-100 border-purple-500 text-purple-900 shadow-xs ring-1 ring-purple-300'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              {subj}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1.5">
                          6. หมวดวิชา / หัวข้อที่ต้องการออกโจทย์ (พิมพ์เนื้อหาได้อย่างอิสระ) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={aiTopic}
                          onChange={(e) => setAiTopic(e.target.value)}
                          placeholder="เช่น ประวัติศาสตร์กรุงศรีอยุธยา, English Grammar Tenses, กฎหมายรัฐธรรมนูญเบื้องต้น, หรือ การเงินส่วนบุคคล"
                          className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                        />
                      </div>

                      {/* Quick Tag Suggestions */}
                      <div>
                        <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                          หัวข้อแนะนำด่วน (คลิกเพื่อเลือกทันที):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: 'ประวัติศาสตร์อยุธยาและรัตนโกสินทร์', subj: 'สังคมศึกษา & ประวัติศาสตร์' },
                            { name: 'English Grammar & Essential Vocab', subj: 'ภาษาอังกฤษ' },
                            { name: 'กฎหมายพื้นฐานในชีวิตประจำวัน', subj: 'กฎหมายเบื้องต้น' },
                            { name: 'การเงินและการลงทุนสำหรับเยาวชน', subj: 'การเงิน & ธุรกิจ' },
                            { name: 'ฟิสิกส์ดาราศาสตร์และหลุมดำ', subj: 'วิทยาศาสตร์ & ฟิสิกส์' },
                            { name: 'หลักภาษาไทยและการใช้ภาษา', subj: 'ภาษาไทย' },
                          ].map((sug) => (
                            <button
                              key={sug.name}
                              type="button"
                              onClick={() => {
                                setAiTopic(sug.name);
                                setAiSubject(sug.subj);
                              }}
                              className="text-[10px] font-medium bg-white hover:bg-purple-50 text-slate-600 hover:text-purple-700 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-purple-300 transition-colors cursor-pointer"
                            >
                              + {sug.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsCreateQuizModalOpen(false)}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      ยกเลิก
                    </button>

                    <button
                      type="submit"
                      disabled={isAiGenerating}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                    >
                      {isAiGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                          <span>{aiStatusMessage || 'กำลังสร้างชุดข้อสอบด้วย AI...'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>ให้ AI สร้างชุดข้อสอบลงช่องทันที</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Permission Guard Modal for AI Studio Access */}
        {showAiUpgradeGuard && (
          <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-center overflow-hidden text-slate-100">
              <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

              <button
                type="button"
                onClick={() => setShowAiUpgradeGuard(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/50">
                <Crown className="w-8 h-8 fill-amber-500/30" />
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
                สิทธิ์เฉพาะพรีเมียม • PREMIUM ONLY
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
                ระบบสร้างข้อสอบและแฟลชการ์ดอัตโนมัติด้วย AI สงวนสิทธิ์สำหรับสมาชิกระดับ Premium เท่านั้น
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                อัปเกรดเป็นสมาชิกพรีเมียมเพื่อปลดล็อกระบบ Universal Multi-Subject AI Engine ช่วยสร้างข้อสอบและแฟลชการ์ดทุกกลุ่มวิชาได้ทันที ไม่จำกัดจำนวนข้อ พร้อมตรวจและเฉลยละเอียด
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {onOpenUpgrade && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAiUpgradeGuard(false);
                      onOpenUpgrade();
                    }}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Crown className="w-4 h-4 fill-slate-950" />
                    <span>อัปเกรดเป็น Premium ทันที</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowAiUpgradeGuard(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
                >
                  ใช้โหมดสร้างด้วยตนเอง (ฟรี)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: HOST LIVE SIMULATION MODAL (Kahoot-style Room)                     */}
        {/* ========================================================================= */}
        {isHostLiveModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95">
            <div className="relative w-full max-w-lg bg-gradient-to-b from-[#4C1D95] to-[#1F1A3D] text-white rounded-[28px] p-6 sm:p-8 shadow-2xl border border-purple-400/30 text-center space-y-6">
              
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/15 text-xs font-bold text-purple-200">
                  🔴 LIVE GAME ROOM
                </span>
                <button
                  onClick={() => setIsHostLiveModalOpen(false)}
                  className="p-1 rounded-full hover:bg-white/15 text-white/80"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  ห้องประลองสด: {selectedQuiz.title}
                </h3>
                <p className="text-xs text-purple-200 mt-1">
                  เปิดห้องให้เพื่อนและนักเรียนเข้าร่วมแข่งขันพร้อมกันแบบเรียลไทม์
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 space-y-2">
                <span className="text-[11px] font-bold text-purple-300 tracking-widest uppercase">GAME PIN</span>
                <div className="text-4xl font-mono font-black text-amber-300 tracking-wider">
                  {livePin}
                </div>
              </div>

              <div className="space-y-2 text-left">
                <div className="flex items-center justify-between text-xs text-purple-200 font-bold px-1">
                  <span>ผู้เข้าร่วมในห้องขณะนี้ ({mockCadetsList.length} คน)</span>
                  <span className="text-emerald-400 animate-pulse">● พร้อมเริ่มเกม</span>
                </div>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-black/25 border border-white/10 max-h-32 overflow-y-auto">
                  {mockCadetsList.map((name, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/15 text-xs font-bold text-white flex items-center gap-1.5">
                      <span>👤</span>
                      <span>{name}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsHostLiveModalOpen(false);
                    handleStartPlaySolo(selectedQuiz);
                    showToast('🚀 เริ่มการแข่งขันแบบ Solo Simulation สำเร็จ!');
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer active:scale-98"
                >
                  ▶ เริ่มประลอง (Start Game)
                </button>
                <button
                  onClick={() => setIsHostLiveModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer"
                >
                  ปิด
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: APPLICATION SUCCESS CONFIRMATION                                   */}
        {/* ========================================================================= */}
        {isApplySuccessModalOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in zoom-in-95">
            <div className="relative w-full max-w-md bg-white rounded-[28px] p-7 shadow-2xl border border-purple-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-inner">
                ✓
              </div>
              <h3 className="text-lg font-black text-slate-900">
                ส่งข้อมูลใบสมัครสำเร็จ!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                ส่งข้อมูลสำเร็จ อยู่ระหว่างรอแอดมินตรวจสอบและอนุมัติ โดยสถานะช่องของคุณจะอยู่ในคิวรออนุมัติ และแอดมินจะเป็นผู้กดยืนยันเพื่อเปิดช่องสู่ระบบอย่างเป็นทางการ
              </p>
              <div className="p-3 rounded-xl bg-purple-50 text-[11px] text-purple-900 border border-purple-200 font-medium">
                ทีมงานจะติดต่อกลับทางอีเมลและเบอร์โทรศัพท์ที่ระบุไว้ภายใน 1-2 วันทำการ
              </div>
              <button
                onClick={() => setIsApplySuccessModalOpen(false)}
                className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                รับทราบ
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ADMIN DELETE CHANNEL CONFIRMATION                                  */}
        {/* ========================================================================= */}
        {channelToDelete && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in zoom-in-95">
            <div className="relative w-full max-w-md bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-rose-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
                <Trash2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  ยืนยันการลบห้อง / ติวเตอร์?
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  คุณกำลังจะลบห้อง <strong className="text-slate-900">{channelToDelete.name}</strong> ออกจากระบบหน้ารวมช่อง การดำเนินการนี้สำหรับโหมดแอดมินเท่านั้น
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-left flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${channelToDelete.avatarBg} text-white flex items-center justify-center text-xl shrink-0`}>
                  {channelToDelete.avatar}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{channelToDelete.name}</div>
                  <div className="text-[10px] text-slate-500">{channelToDelete.category} • {channelToDelete.rating} ★</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setChannelToDelete(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmDeleteChannel(channelToDelete)}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                >
                  ยืนยันลบห้อง
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL: ESCROW MATCHING BOOKING MODAL (Seven Space Labs Escrow Protection)  */}
        {/* ========================================================================= */}
        {bookingCreator && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
            <div className="relative w-full max-w-lg bg-white rounded-[28px] p-6 sm:p-7 shadow-2xl border border-purple-200 space-y-5 max-h-[92vh] overflow-y-auto">
              
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold shadow-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Seven Space Labs Escrow Protection</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    นัดเรียนผ่านระบบกลาง (Secure Matching)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ติดต่อจองเวลาเรียนกับติวเตอร์ พร้อมการคุ้มครองมาตรฐานความปลอดภัยสูงสุด
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingCreator(null)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Creator Card Brief */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white border border-purple-100 flex items-center gap-3.5 shadow-xs">
                <div className={`w-14 h-14 rounded-2xl ${bookingCreator.avatarBg} text-white flex items-center justify-center text-2xl shadow-md border-2 border-white shrink-0`}>
                  {bookingCreator.avatar}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-slate-900 truncate">
                      {bookingCreator.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 shrink-0">
                      {bookingCreator.category}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1">
                    {bookingCreator.specialties.map((spec, idx) => (
                      <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/80 border border-purple-100 text-purple-900">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Booking Form Fields */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const gradeLabel = gradeOptions.find((g) => g.value === bookingForm.gradeLevel)?.label || bookingForm.gradeLevel;
                  setBookingCreator(null);
                  setBookingForm({
                    studentName: '',
                    gradeLevel: 'm4',
                    learningMode: 'online',
                    preferredSchedule: '',
                    notes: '',
                  });
                  showToast(`🚀 ส่งคำขอนัดหมายติวเตอร์ ${bookingCreator.name} (${gradeLabel}) ไปยังแอดมินเรียบร้อยแล้ว!`);
                }}
                className="space-y-3.5 text-left"
              >
                {/* 1. Student / Parent Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อผู้ปกครอง / นักเรียน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณแม่สุวรรณา / น้องภูริวัจน์"
                    value={bookingForm.studentName}
                    onChange={(e) => setBookingForm({ ...bookingForm, studentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all shadow-xs"
                  />
                </div>

                {/* 2. Grade Level & Learning Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      ระดับชั้น <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={bookingForm.gradeLevel}
                      onChange={(e) => setBookingForm({ ...bookingForm, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      {gradeOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      รูปแบบการเรียน <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={bookingForm.learningMode}
                      onChange={(e) => setBookingForm({ ...bookingForm, learningMode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      {formatOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 3. Preferred Schedule */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    วันและเวลาที่สะดวกเรียน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น ทุกวันเสาร์ 10:00 - 12:00 น. หรือ วันธรรมดาหลัง 17:00 น."
                    value={bookingForm.preferredSchedule}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredSchedule: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all shadow-xs"
                  />
                </div>

                {/* 4. Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ข้อความเพิ่มเติม / จุดประสงค์การเรียน (ถ้ามี)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="เช่น ต้องการเน้นเตรียมสอบ A-Level ฟิสิกส์ หรือ ปูพื้นฐานกลศาสตร์ตั้งแต่แรก..."
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                    className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-500 focus:bg-white transition-all resize-none shadow-xs"
                  />
                </div>

                {/* Notice Box: Seven Space Labs Official Escrow */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 text-[11px] text-emerald-950 space-y-1 shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>ระบบพักเงินและจับคู่ปลอดภัย (Escrow Guarantee)</span>
                  </div>
                  <p className="leading-relaxed text-emerald-800 font-medium">
                    เพื่อความปลอดภัยของผู้เรียนและติวเตอร์ ทุกการติดต่อและการชำระเงินจะได้รับการดูแลและพักเงินผ่านศูนย์กลาง Seven Space Labs Official
                  </p>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/25 transition-all cursor-pointer active:scale-98"
                  >
                    ส่งคำขอนัดหมายไปยังแอดมิน
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
