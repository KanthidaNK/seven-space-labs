import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Gamepad2,
  Sparkles,
  Play,
  RotateCcw,
  MessageSquare,
  Send,
  ShieldCheck,
  Search,
  Plus,
  Copy,
  Check,
  FileText,
  Trash2,
  AlertCircle,
  Coins,
  Award,
  Users,
  Calendar,
  HelpCircle,
  Heart,
  Share2,
  Layers,
  GraduationCap,
  MessageCircle,
  ShieldAlert,
  Edit3,
  Clock,
  Flag,
  Upload,
  RefreshCw,
  Flame,
  CheckCircle2,
  Lock,
  Sliders,
  Target,
  Activity,
  Zap,
  Maximize2,
  Minimize2,
  Globe,
  Link,
  Info,
  FolderArchive,
  Cloud,
  FileCode,
  Shield,
  LayoutGrid,
} from 'lucide-react';
import { Language, CadetProfile } from '../../types';

interface Lab6CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user?: CadetProfile | null;
  isAdmin?: boolean;
}

interface CommunityPost {
  id: string;
  author: string;
  authorBadge?: string;
  avatarBg: string;
  text: string;
  time: string;
  likes: number;
  likedByUser?: boolean;
  replies?: number;
  tag?: string;
}

interface CommunityRoom {
  id: string;
  title: string;
  category: 'sos' | 'exam' | 'sheets' | 'parents' | 'general';
  icon: string;
  description: string;
  badge: string;
  badgeColor: string;
  ownerCallsign: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: number;
  lastActiveAt: number;
  initialFeePaid: number;
  posts: CommunityPost[];
}

export interface ArcadeGameInfo {
  id: string;
  title: string;
  url: string;
  tag: string;
  difficulty: 'ง่าย' | 'ปานกลาง' | 'ท้าทาย' | 'แอดวานซ์';
  category: string;
  description: string;
  formulaHeader: string;
  formulas: { label: string; equation: string; note: string }[];
  isCustom?: boolean;
  hostingType?: 'Cloudflare Pages' | 'GitHub Pages' | 'PhET Interactive' | 'WebGL Shader';
}

const DEFAULT_ARCADE_GAMES: ArcadeGameInfo[] = [
  {
    id: 'projectile-phet',
    title: '🎯 วิถีโพรเจกไทล์ (Projectile Motion & Kinematics)',
    url: 'https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_all.html',
    tag: 'Cloudflare / HTML5 Verified',
    difficulty: 'ปานกลาง',
    category: 'จลนศาสตร์ 2 มิติ (Kinematics)',
    hostingType: 'Cloudflare Pages',
    description: 'ห้องทดลองฟิสิกส์การเคลื่อนที่แบบโพรเจกไทล์ ยิงลูกกระสุนปืนใหญ่ ปรับมุม แรงต้านอากาศ มวล และขนาดเป้าหมาย',
    formulaHeader: 'สมการการเคลื่อนที่วิถีโค้ง (Projectile Formulas)',
    formulas: [
      { label: 'ระยะทางแนวนอน (Sx)', equation: 'S_x = u_x \\cdot t = (u \\cos\\theta) \\cdot t', note: 'ความเร็วคงที่ในแนวราบ (ax = 0)' },
      { label: 'ระยะทางแนวดิ่ง (Sy)', equation: 'S_y = u_y t - \\frac{1}{2}gt^2 = (u \\sin\\theta) t - \\frac{1}{2}gt^2', note: 'ความเร่งแนวดิ่งตามแรงโน้มถ่วง (ay = -g)' },
      { label: 'ความเร็วแนวดิ่ง (vy)', equation: 'v_y^2 = u_y^2 - 2gS_y', note: 'คำนวณความเร็วที่ตำแหน่งระดับความสูงใดๆ' },
      { label: 'ระยะตกไกลสุด (R)', equation: 'R = \\frac{u^2 \\sin 2\\theta}{g}', note: 'ได้ระยะทางไกลสุดเมื่อมุมยิง \\theta = 45°' },
      { label: 'ความสูงสูงสุด (Hmax)', equation: 'H_{max} = \\frac{u^2 \\sin^2\\theta}{2g}', note: 'ณ จุดสูงสุด ความเร็วแนวดิ่ง vy = 0' },
    ],
  },
  {
    id: 'gravity-orbits-phet',
    title: '🪐 แรงดึงดูดและวงโคจร (Gravity & Kepler Orbits)',
    url: 'https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_all.html',
    tag: 'Orbital Mechanics & Gravity',
    difficulty: 'ท้าทาย',
    category: 'ดาราศาสตร์และแรงโน้มถ่วง (Astrophysics)',
    hostingType: 'Cloudflare Pages',
    description: 'จำลองแรงดึงดูดระหว่างดวงอาทิตย์ โลก ดวงจันทร์ และสถานีอวกาศ ศึกษาวงโคจรวงกลม วงรี และการเหวี่ยงแรงโน้มถ่วง',
    formulaHeader: 'กฎแรงดึงดูดสากลและวงโคจร (Gravitational Laws)',
    formulas: [
      { label: 'แรงดึงดูดระหว่างมวล (Fg)', equation: 'F_g = G \\frac{M \\cdot m}{r^2}', note: 'G = 6.674 \\times 10^{-11} \\text{ N}\\cdot\\text{m}^2/\\text{kg}^2' },
      { label: 'ความเร็ววงโคจร (vorbit)', equation: 'v_{orbit} = \\sqrt{\\frac{GM}{r}}', note: 'ความเร็วคงที่สำหรับรักษาระดับวงโคจรกลม' },
      { label: 'ความเร็วหลุดพ้น (vesc)', equation: 'v_{esc} = \\sqrt{\\frac{2GM}{r}} = \\sqrt{2} \\cdot v_{orbit}', note: 'ความเร็วขั้นต่ำที่วัตถุจะหลุดจากสนามโน้มถ่วง' },
      { label: 'กฎข้อที่ 3 ของเคปเลอร์', equation: 'T^2 = \\left(\\frac{4\\pi^2}{GM}\\right) r^3', note: 'อัตราส่วนกำลังสองของคาบแปรผันตรงกับกำลังสามของรัศมี' },
    ],
  },
  {
    id: 'fluid-webgl',
    title: '🌊 กลศาสตร์ของไหล WebGL (Fluid Dynamics GPU)',
    url: 'https://paveldogreat.github.io/WebGL-Fluid-Simulation/',
    tag: 'Navier-Stokes GPU Shader',
    difficulty: 'แอดวานซ์',
    category: 'กลศาสตร์ของไหล (Fluid Dynamics)',
    hostingType: 'WebGL Shader',
    description: 'การจำลองกลศาสตร์ของไหลแบบเรียลไทม์ คำนวณสมการ Navier-Stokes บน WebGL GPU Shader พร้อมการแพร่กระจายของควันและความร้อน',
    formulaHeader: 'สมการกลศาสตร์ของไหล (Navier-Stokes Equations)',
    formulas: [
      { label: 'สมการนาเวียร์-สโตกส์', equation: '\\rho \\left(\\frac{\\partial \\mathbf{u}}{\\partial t} + \\mathbf{u} \\cdot \\nabla \\mathbf{u}\\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{u} + \\mathbf{f}', note: 'สมการการอนุรักษ์โมเมนตัมของของไหลบีบอัดไม่ได้' },
      { label: 'สมการความต่อเนื่อง (Continuity)', equation: '\\nabla \\cdot \\mathbf{u} = 0', note: 'การอนุรักษ์มวลของของไหล (Incompressible)' },
      { label: 'สมการแบร์นูลลี (Bernoulli)', equation: 'p + \\frac{1}{2}\\rho v^2 + \\rho gh = \\text{const}', note: 'การอนุรักษ์พลังงานในของไหลอุดมคติ' },
    ],
  },
  {
    id: 'pendulum-phet',
    title: '⏱️ เพนดูลัมฮาร์มอนิก (PhET Harmonic Pendulum Lab)',
    url: 'https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_all.html',
    tag: 'SHM & Energy Conservation',
    difficulty: 'ง่าย',
    category: 'การแกว่งฮาร์มอนิก (Oscillations)',
    hostingType: 'Cloudflare Pages',
    description: 'ทดลองการแกว่งของลูกตุ้มเพนดูลัม เปรียบเทียบความยาวเชือก มวล แรงโน้มถ่วงบนดาวดวงอื่น และแรงต้านทาน',
    formulaHeader: 'สมการการแกว่งลูกตุ้มอย่างง่าย (SHM Formulas)',
    formulas: [
      { label: 'คาบการแกว่ง (T)', equation: 'T = 2\\pi \\sqrt{\\frac{L}{g}}', note: 'คาบขึ้นอยู่กับความยาว L และแรงโน้มถ่วง g (อิสระจากมวล)' },
      { label: 'ความถี่เชิงมุม (ω)', equation: '\\omega = \\sqrt{\\frac{g}{L}} = \\frac{2\\pi}{T}', note: 'อัตราเร็วเชิงมุมของการสั่นแกว่ง' },
      { label: 'อนุรักษ์พลังงานกล (E)', equation: 'E_{total} = \\frac{1}{2}mv^2 + mgh = \\text{คงที่}', note: 'ผลรวมพลังงานจลน์และศักย์คงที่เมื่อไร้แรงต้าน' },
      { label: 'อัตราเร็วสูงสุด (vmax)', equation: 'v_{max} = \\sqrt{2gL(1 - \\cos\\theta_0)}', note: 'ความเร็วสูงสุดเกิดขึ้นที่จุดต่ำสุด (จุดสมดุล)' },
    ],
  },
  {
    id: 'skate-energy-phet',
    title: '🛹 รางสเก็ตบอร์ดพลังงาน (Energy Skate Park)',
    url: 'https://phet.colorado.edu/sims/html/energy-skate-park/latest/energy-skate-park_all.html',
    tag: 'Work & Energy Conservation',
    difficulty: 'ง่าย',
    category: 'งานและพลังงาน (Work & Energy)',
    hostingType: 'Cloudflare Pages',
    description: 'เรียนรู้กฎการอนุรักษ์พลังงานกล การเปลี่ยนรูประหว่างพลังงานศักย์ พลังงานจลน์ และพลังงานความร้อนจากแรงเสียดทานบนรางสเก็ต',
    formulaHeader: 'สมการงานและพลังงานกล (Work-Energy Formulas)',
    formulas: [
      { label: 'พลังงานจลน์ (Ek)', equation: 'E_k = \\frac{1}{2} m v^2', note: 'พลังงานเนื่องจากความเร็วของวัตถุ' },
      { label: 'พลังงานศักย์โน้มถ่วง (Ep)', equation: 'E_p = m g h', note: 'พลังงานเนื่องจากระดับความสูงในสนามโน้มถ่วง' },
      { label: 'กฎอนุรักษ์พลังงาน', equation: 'E_k^{(1)} + E_p^{(1)} = E_k^{(2)} + E_p^{(2)} + W_{friction}', note: 'พลังงานรวมเริ่มต้นเท่ากับพลังงานรวมปลายทางบวกงานสูญเสีย' },
    ],
  },
  {
    id: 'waves-phet',
    title: '📡 การแทรกสอดของคลื่น (PhET Wave Interference)',
    url: 'https://phet.colorado.edu/sims/html/wave-interference/latest/wave-interference_all.html',
    tag: 'Wave Optics & Interference',
    difficulty: 'ปานกลาง',
    category: 'คลื่นและแสง (Waves & Optics)',
    hostingType: 'Cloudflare Pages',
    description: 'ทดลองการแทรกสอดและการเลี้ยวเบนของคลื่นน้ำ คลื่นเสียง และคลื่นแสงผ่านช่องเดี่ยวและช่องคู่ (Young Double Slit)',
    formulaHeader: 'สมการคลื่นและการแทรกสอด (Wave Equations)',
    formulas: [
      { label: 'ความเร็วคลื่น (v)', equation: 'v = f \\lambda', note: 'ความสัมพันธ์ระหว่างอัตราเร็ว ความถี่ และความยาวคลื่น' },
      { label: 'ช่องคู่เสริมกัน (Constructive)', equation: 'd \\sin\\theta = n \\lambda \\quad (n = 0, 1, 2, \\dots)', note: 'แนวปฏิบัพ (แถบสว่างหรือเสียงดังสุด)' },
      { label: 'ช่องคู่หักล้าง (Destructive)', equation: 'd \\sin\\theta = \\left(n - \\frac{1}{2}\\right) \\lambda', note: 'แนวบัพ (แถบมืดหรือเสียงเงียบ)' },
    ],
  },
];

// Initial Default Community Rooms
const DEFAULT_ROOMS: CommunityRoom[] = [
  {
    id: 'room-sos',
    title: '🚨 ห้อง SOS ถาม-ตอบโจทย์ฟิสิกส์ด่วน',
    category: 'sos',
    icon: '⚡',
    description: 'พื้นที่ถาม-ตอบโจทย์การบ้าน ข้อสอบที่ติดขัด มีพี่ๆ Cadet และผู้เชี่ยวชาญช่วยอธิบายวิธีคิดเป็นขั้นตอน',
    badge: 'URGENT HELP',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    ownerCallsign: 'COMMANDER_ADMIN',
    status: 'approved',
    createdAt: Date.now() - 15 * 86400000,
    lastActiveAt: Date.now() - 300000,
    initialFeePaid: 500,
    posts: [
      {
        id: 'sos-1',
        author: 'น้องน้ำหวาน ม.5',
        authorBadge: 'Cadet Junior',
        avatarBg: 'bg-pink-500',
        text: 'รบกวนช่วยแนะแนวข้อนี้หน่อยค่ะ: ลูกตุ้มอย่างง่ายมวล 2 kg ยาว 1 m แกว่งมุม 10° หาความเร็วสูงสุดที่จุดสมดุล ใช้กฎอนุรักษ์พลังงานหรือสูตร v_max = ωA คะ?',
        time: '5 นาทีที่แล้ว',
        likes: 12,
        replies: 4,
        tag: '#SHM #ลูกตุ้ม',
      },
      {
        id: 'sos-2',
        author: 'พี่กันต์ ฟิสิกส์โอลิมปิก',
        authorBadge: 'Verified Mentor',
        avatarBg: 'bg-indigo-600',
        text: 'ตอบน้องน้ำหวาน: ใช้ได้ทั้งสองวิธีครับ! ถ้ามุมเล็ก (10° ≈ 0.17 rad) ใช้ v_max = ωA โดย ω = √(g/L) และ A = L·θ จะได้ผลลัพธ์เร็วและแม่นยำมากครับ',
        time: '2 นาทีที่แล้ว',
        likes: 24,
        tag: '#เฉลยละเอียด',
      },
    ],
  },
  {
    id: 'room-exam',
    title: '📅 ห้องปฏิทินข่าวสอบเข้า / TCAS / สอวน.',
    category: 'exam',
    icon: '🗓️',
    description: 'อัปเดตกำหนดการสอบ สอวน. ค่าย 1-2, A-Level ฟิสิกส์, TPAT3 วิศวกรรมศาสตร์ และทุนการศึกษา',
    badge: 'EXAM ALERTS',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    ownerCallsign: 'COMMANDER_ADMIN',
    status: 'approved',
    createdAt: Date.now() - 25 * 86400000,
    lastActiveAt: Date.now() - 3600000,
    initialFeePaid: 500,
    posts: [
      {
        id: 'ex-1',
        author: 'Ground Control Admin',
        authorBadge: 'Station Chief',
        avatarBg: 'bg-amber-600',
        text: '📢 แจ้งเตือน: เปิดรับสมัครสอบ สอวน. ฟิสิกส์ และ ดาราศาสตร์ ประจำปีการศึกษา 2569 แล้ว เช็กศูนย์สอบและกำหนดการได้ที่ปฏิทินกลาง',
        time: '1 ชั่วโมงที่แล้ว',
        likes: 89,
        replies: 15,
        tag: '#สอวน69 #ประกาศทางการ',
      },
    ],
  },
  {
    id: 'room-sheets',
    title: '📚 ห้องคลังแจกชีทและข้อสอบชุมชน',
    category: 'sheets',
    icon: '📑',
    description: 'แบ่งปันไฟล์สรุปสูตร สรุปเนื้อหา Mind Map ลายมือสวย และชุดข้อสอบจำลองจากเพื่อนๆ Cadet',
    badge: 'RESOURCE SHARING',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    ownerCallsign: 'AstroNote_Pro',
    status: 'approved',
    createdAt: Date.now() - 10 * 86400000,
    lastActiveAt: Date.now() - 7200000,
    initialFeePaid: 500,
    posts: [
      {
        id: 'sh-1',
        author: 'AstroNote Creator',
        authorBadge: 'Top Contributor',
        avatarBg: 'bg-emerald-600',
        text: 'แจกชีทสรุปฟิสิกส์ 20 บทฉบับพกพา สรุปตัวแปรและหน่วย SI ชัดเจน ดาวน์โหลดไปอ่านคู่กับ LAB 1 ได้เลยครับ',
        time: 'เมื่อวาน',
        likes: 156,
        replies: 32,
        tag: '#ชีทสรุป #มปลาย',
      },
    ],
  },
  {
    id: 'room-parents',
    title: '👨‍👩‍👧 ห้องพูดคุยสำหรับผู้ปกครอง (Parent Lounge)',
    category: 'parents',
    icon: '☕',
    description: 'พื้นที่แลกเปลี่ยนแนวทางการส่งเสริมลูกหลานในสายวิทยาศาสตร์ เทคโนโลยี ค่ายโอลิมปิก และทุนการศึกษา',
    badge: 'PARENT NETWORK',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    ownerCallsign: 'Parent_Council',
    status: 'approved',
    createdAt: Date.now() - 35 * 86400000,
    lastActiveAt: Date.now() - 14400000,
    initialFeePaid: 500,
    posts: [
      {
        id: 'pr-1',
        author: 'คุณแม่น้องออมสิน',
        authorBadge: 'Parent Member',
        avatarBg: 'bg-rose-600',
        text: 'ขอคำแนะนำคุณพ่อคุณแม่ค่ะ ลูกชายอยู่ ม.3 สนใจเข้าค่าย สอวน. ฟิสิกส์ ควรเริ่มปูพื้นฐานคณิตศาสตร์และฟิสิกส์จากส่วนไหนก่อนดีคะ?',
        time: '4 ชั่วโมงที่แล้ว',
        likes: 38,
        replies: 12,
        tag: '#เตรียมตัวสอวน',
      },
    ],
  },
];

export const Lab6CreatorModal: React.FC<Lab6CreatorModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  isAdmin: propIsAdmin,
}) => {
  // Navigation Mode: 'gateway' (Default modal on open) | 'game_center' | 'community'
  const [viewMode, setViewMode] = useState<'gateway' | 'game_center' | 'community'>('gateway');

  // Reset to Gateway on every open
  useEffect(() => {
    if (isOpen) {
      setViewMode('gateway');
    }
  }, [isOpen]);

  // Admin Mode Toggle State (Synced with system role + manual toggle button)
  const initialAdmin = Boolean(propIsAdmin || user?.role === 'Admin' || user?.role === 'Developer');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(initialAdmin);

  // Sync with prop changes if parent updates
  useEffect(() => {
    setIsAdminMode(Boolean(propIsAdmin || user?.role === 'Admin' || user?.role === 'Developer'));
  }, [propIsAdmin, user?.role]);

  const userLevel = user?.level || 7;
  const userCallsign = user?.callsign || user?.name || 'Cadet_Player';

  // Game Vault State
  const [arcadeGames, setArcadeGames] = useState<ArcadeGameInfo[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_arcade_vault_games_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ARCADE_GAMES;
  });

  const [selectedGameId, setSelectedGameId] = useState<string>(DEFAULT_ARCADE_GAMES[0].id);
  const activeGame = arcadeGames.find((g) => g.id === selectedGameId) || arcadeGames[0] || DEFAULT_ARCADE_GAMES[0];

  // Admin Custom URL State (Cloudflare Pages URL Input)
  const [customGameUrl, setCustomGameUrl] = useState<string>('');
  const [customGameTitle, setCustomGameTitle] = useState<string>('');
  const [activeIframeUrl, setActiveIframeUrl] = useState<string>(DEFAULT_ARCADE_GAMES[0].url);
  const [isLoadingIframe, setIsLoadingIframe] = useState<boolean>(false);

  // Admin Direct Upload Dropzone State
  const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false);
  const [isUploadingGame, setIsUploadingGame] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fullscreen Container Ref & State (Arcade Player)
  const iframeContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Modal Fullscreen State (Expands Lab 6 container to 100vw and 100vh)
  const [isModalFullscreen, setIsModalFullscreen] = useState<boolean>(false);

  // Toast / System Notification
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Synchronize active iframe URL when selected game changes
  useEffect(() => {
    if (activeGame) {
      setIsLoadingIframe(true);
      setActiveIframeUrl(activeGame.url);
    }
  }, [selectedGameId]);

  // Fullscreen Change Listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    const container = iframeContainerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch((err) => console.warn(err));
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => console.warn(err));
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  // Admin: Load Custom External Game URL (Cloudflare Pages URL)
  const handleLoadCustomGame = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isAdminMode) {
      showToast('⚠️ สิทธิ์แอดมินเท่านั้นสำหรับเพิ่มเกมเข้าคลัง', 'error');
      return;
    }
    if (!customGameUrl.trim()) {
      showToast('⚠️ กรุณาระบุ Cloudflare Pages URL (เช่น https://my-game.pages.dev)', 'error');
      return;
    }

    let urlToLoad = customGameUrl.trim();
    if (!urlToLoad.startsWith('http://') && !urlToLoad.startsWith('https://')) {
      urlToLoad = `https://${urlToLoad}`;
    }

    let hostName = 'Cloudflare Pages';
    try {
      hostName = new URL(urlToLoad).hostname;
    } catch (e) {}

    setIsLoadingIframe(true);
    setActiveIframeUrl(urlToLoad);

    const isCloudflare = urlToLoad.includes('.pages.dev');
    const newId = `cf-${Date.now()}`;
    const newTitle = customGameTitle.trim() ? `🎮 ${customGameTitle.trim()}` : `⚡ ${hostName}`;
    
    const newGame: ArcadeGameInfo = {
      id: newId,
      title: newTitle,
      url: urlToLoad,
      tag: isCloudflare ? 'Cloudflare Pages Direct' : 'External WebGL / HTML5',
      difficulty: 'ปานกลาง',
      category: isCloudflare ? 'Cloudflare Pages Hosted' : 'External Hosted Game',
      hostingType: isCloudflare ? 'Cloudflare Pages' : 'GitHub Pages',
      description: `เกมที่โหลดตรงจาก Cloudflare Pages: ${urlToLoad}`,
      formulaHeader: 'สมการและตัวแปรฟิสิกส์ (Cloudflare Pages Game)',
      formulas: [
        { label: 'โฮสต์ (Host)', equation: hostName, note: 'รันบน Arcade WebGL/HTML5 Sandbox Player 100% Responsive' },
        { label: 'สถานะ (Status)', equation: 'LIVE // CLOUDFLARE PAGES', note: 'รองรับการขยายหน้าจอเต็มจอ Fullscreen Mode แบบ YouTube' },
      ],
      isCustom: true,
    };

    setArcadeGames((prev) => {
      const updated = [newGame, ...prev];
      try {
        localStorage.setItem('ssl_arcade_vault_games_v4', JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });

    setSelectedGameId(newId);
    setCustomGameUrl('');
    setCustomGameTitle('');
    showToast(`🚀 เพิ่ม ${newTitle} เข้าคลังและเริ่มเล่นใน iframe สำเร็จ!`, 'success');
  };

  // Admin: Handle Direct Upload (File / Zip Dropzone - Local Preview Only)
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!isAdminMode) {
      showToast('⚠️ สิทธิ์แอดมินเท่านั้นสำหรับอัปโหลดไฟล์เกมเข้าคลัง', 'error');
      return;
    }

    const file = files[0];
    const fileName = file.name;
    setIsUploadingGame(true);

    setTimeout(() => {
      setIsUploadingGame(false);
      const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const demoUrl = fileName.endsWith('.html')
        ? URL.createObjectURL(file)
        : `https://${cleanTitle.toLowerCase().replace(/\s+/g, '-')}.pages.dev`;

      const newId = `upload-${Date.now()}`;
      const newGame: ArcadeGameInfo = {
        id: newId,
        title: `📦 ${cleanTitle} (Local Preview)`,
        url: demoUrl,
        tag: 'Local Preview Bundle',
        difficulty: 'ท้าทาย',
        category: 'Uploaded Asset Bundle',
        hostingType: 'Cloudflare Pages',
        description: `แพ็กเกจเกมฟิสิกส์อัปโหลดเพื่อทดสอบ Local (${(file.size / 1024).toFixed(1)} KB)`,
        formulaHeader: 'สมการและสเปกไฟล์เกม (Local Physics Asset)',
        formulas: [
          { label: 'ไฟล์แพ็กเกจ', equation: fileName, note: `ขนาด ${(file.size / 1024).toFixed(1)} KB // Local Preview Only` },
          { label: 'ไปป์ไลน์', equation: 'SANDBOX PREVIEW', note: 'สำหรับการออนไลน์ถาวร กรุณาอัปโหลดขึ้น Cloudflare Pages แล้วนำ URL มากรอก' },
        ],
        isCustom: true,
      };

      setArcadeGames((prev) => {
        const updated = [newGame, ...prev];
        try {
          localStorage.setItem('ssl_arcade_vault_games_v4', JSON.stringify(updated));
        } catch (err) {}
        return updated;
      });

      setSelectedGameId(newId);
      showToast(`✨ ประมวลผลไฟล์ ${fileName} ในโหมด Local Preview สำเร็จ!`, 'success');
    }, 1200);
  };

  // Admin: Remove custom game from vault
  const handleRemoveCustomGame = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = arcadeGames.filter((g) => g.id !== gameId);
    setArcadeGames(updated);
    try {
      localStorage.setItem('ssl_arcade_vault_games_v4', JSON.stringify(updated));
    } catch (err) {}
    if (selectedGameId === gameId) {
      setSelectedGameId(DEFAULT_ARCADE_GAMES[0].id);
    }
    showToast('🗑️ ลบเกมออกจากคลังสำเร็จ', 'info');
  };

  // Reload Current Iframe
  const handleReloadIframe = () => {
    setIsLoadingIframe(true);
    const currentUrl = activeIframeUrl;
    setActiveIframeUrl('');
    setTimeout(() => {
      setActiveIframeUrl(currentUrl);
    }, 100);
    showToast('🔄 รีโหลดเครื่องเล่นเกมเรียบร้อย', 'info');
  };

  // =========================================================================
  // COMMUNITY STATE
  // =========================================================================
  const [rooms, setRooms] = useState<CommunityRoom[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_community_rooms_v2');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ROOMS;
  });
  const [selectedRoomId, setSelectedRoomId] = useState<string>('room-sos');
  const [newPostText, setNewPostText] = useState('');

  // Reset Modal Fullscreen on Close
  useEffect(() => {
    if (!isOpen) {
      setIsModalFullscreen(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Dual Theme Styling Variables
  const isLightTheme = viewMode === 'community';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isModalFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
      } bg-black/85 backdrop-blur-md animate-fadeIn select-none font-kanit`}
    >
      
      {/* Dynamic Modal Container (Dual-Theme System) */}
      <div
        className={`relative w-full ${
          isModalFullscreen
            ? 'w-screen h-screen max-w-none max-h-none rounded-none border-none'
            : 'max-w-7xl h-[94vh] max-h-[94vh] rounded-3xl'
        } flex flex-col overflow-hidden transition-all duration-300 ${
          isLightTheme
            ? 'bg-slate-50 border border-slate-300 text-slate-900 shadow-2xl'
            : 'bg-[#090C15] border border-cyan-500/30 text-white shadow-[0_0_50px_rgba(6,182,212,0.15)]'
        }`}
      >
        
        {/* ========================================================================= */}
        {/* FIXED HEADER: Locked Height & Coordinates (No Layout Shift)               */}
        {/* ========================================================================= */}
        <div
          className={`h-[68px] min-h-[68px] px-5 border-b flex items-center justify-between shrink-0 transition-colors duration-300 ${
            isLightTheme
              ? 'bg-white border-slate-200 text-slate-900 shadow-xs'
              : 'bg-[#0C101D] border-white/10 text-white'
          }`}
        >
          {/* Left: Branding & Status Badge (Fixed Anchor) */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                isLightTheme
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-600'
                  : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              {viewMode === 'community' ? <MessageSquare className="w-5 h-5" /> : <Gamepad2 className="w-5 h-5" />}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isLightTheme
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}
                >
                  LAB 6
                </span>
                
                <h3 className="text-sm md:text-base font-black tracking-wide truncate">
                  {viewMode === 'gateway' && 'GATEWAY // CHOOSE SYSTEM'}
                  {viewMode === 'game_center' && 'ARCADE PLAYER // CLOUDFLARE PAGES'}
                  {viewMode === 'community' && 'COMMUNITY HUB // CADET NETWORK'}
                </h3>
                
                {/* Fixed Admin Status Badge */}
                {isAdminMode ? (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-amber-500" />
                    <span>[ ADMIN ENGINE // RESTRICTED ]</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 flex items-center gap-1 shrink-0">
                    <Gamepad2 className="w-3 h-3 text-cyan-600" />
                    <span>[ CADET ACCESS // PHYSICS VAULT ]</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right Controls: Fixed Width Admin Toggle + Navigation Tabs + Close Button */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* 1. FIXED-WIDTH ADMIN TOGGLE (No Layout Shift) */}
            <button
              type="button"
              onClick={() => {
                const nextState = !isAdminMode;
                setIsAdminMode(nextState);
                showToast(
                  nextState
                    ? '🛡️ สถานะ: ADMIN ON (เปิดแถบควบคุม URL Input & คลังเกม)'
                    : '👤 สถานะ: ADMIN OFF (โหมด Cadet ทั่วไป ซ่อนแถบ URL Input)',
                  nextState ? 'success' : 'info'
                );
              }}
              title={isAdminMode ? 'คลิกเพื่อสลับเป็นโหมด Cadet ทั่วไป' : 'คลิกเพื่อสลับเป็นโหมดแอดมิน (ADMIN ON)'}
              className={`w-[118px] h-[34px] rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-1.5 border transition-all cursor-pointer shadow-xs ${
                isAdminMode
                  ? 'bg-amber-500/20 border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30'
                  : 'bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              <Shield className={`w-3.5 h-3.5 ${isAdminMode ? 'text-amber-500 fill-amber-500/30' : 'text-zinc-400'}`} />
              <span>{isAdminMode ? '• ADMIN ON' : '• ADMIN OFF'}</span>
            </button>

            {/* Navigation Tabs */}
            <div
              className={`flex p-1 rounded-xl border text-xs font-mono font-bold ${
                isLightTheme
                  ? 'bg-slate-100 border-slate-200'
                  : 'bg-[#121626] border-white/10'
              }`}
            >
              <button
                type="button"
                onClick={() => setViewMode('gateway')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'gateway'
                    ? isLightTheme
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-black font-black'
                    : isLightTheme
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">GATEWAY</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('game_center')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'game_center'
                    ? isLightTheme
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-black font-black'
                    : isLightTheme
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>ARCADE</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('community')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  viewMode === 'community'
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : isLightTheme
                    ? 'text-slate-600 hover:text-slate-900'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>COMMUNITY</span>
              </button>
            </div>

            {/* Modal Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsModalFullscreen((prev) => !prev)}
              title={isModalFullscreen ? 'ย่อหน้าต่างกลับเดิม (Exit Fullscreen)' : 'ขยายเต็มจอ (Fullscreen)'}
              aria-label={isModalFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer flex items-center justify-center ${
                isLightTheme
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              {isModalFullscreen ? (
                <Minimize2 className={`w-4 h-4 ${isLightTheme ? 'text-indigo-600' : 'text-cyan-400'}`} />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isLightTheme
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-600 hover:text-slate-900'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-18 right-6 z-50 animate-fadeIn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f172a] border border-cyan-500/60 text-cyan-300 text-xs shadow-2xl backdrop-blur-md">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{notification.message}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 1. GATEWAY MODAL (SPLIT 2 OPTIONS // NO ARROW BUTTONS // PURE CENTER TEXT) */}
        {/* ========================================================================= */}
        {viewMode === 'gateway' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 overflow-y-auto animate-fadeIn bg-gradient-to-b from-[#090C15] via-[#0b1020] to-[#070913]">
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                SEVEN SPACE LABS // LAB 6 GATEWAY
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
                เลือกประตูเข้าสู่ระบบ LAB 6
              </h2>
              <p className="text-xs md:text-sm text-white/60">
                เลือกระหว่างพื้นที่สนทนาชุมชน Cadet หรือศูนย์รวมเครื่องเล่นเกมฟิสิกส์ Arcade Player
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
              
              {/* Option 1: Community Hub (Dark Glassmorphism Portal) */}
              <div
                onClick={() => setViewMode('community')}
                className="group p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#12162c] via-[#0d1222] to-[#070a16] border-2 border-indigo-500/40 hover:border-indigo-400 shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 text-white hover:scale-[1.01]"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                        CADET NETWORK
                      </span>
                      <span className="text-[10px] font-mono text-white/50">4 ห้องสนทนา</span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      ห้องคอมมูนิตี้ (Community Hub)
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      พื้นที่แลกเปลี่ยน ถาม-ตอบโจทย์ฟิสิกส์ด่วน (SOS) ปฏิทินข่าวสอบ TCAS / สอวน. คลังแจกชีทสรุป และห้องสนทนาผู้ปกครอง สบายตาระบบ Light Mode ด้านใน
                    </p>
                  </div>
                </div>

                {/* Button Option 1 (NO ARROWS // PURE TEXT CENTERED) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode('community');
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold text-sm tracking-wide text-center transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
                >
                  เข้าสู่ห้องสนทนา
                </button>
              </div>

              {/* Option 2: Game Center (Dark Space Theme Portal) */}
              <div
                onClick={() => setViewMode('game_center')}
                className="group p-6 md:p-8 rounded-3xl bg-gradient-to-br from-[#0c1326] via-[#090e1c] to-[#060812] border-2 border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.15)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-6 text-white hover:scale-[1.01]"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <Gamepad2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        DARK SPACE THEME
                      </span>
                      <span className="text-[10px] font-mono text-white/50">Cloudflare Pages &amp; WebGL</span>
                    </div>
                    <h3 className="text-xl font-black text-white tracking-tight">
                      ศูนย์รวมเกม (Game Center / Arcade)
                    </h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      คลังสื่อจำลองฟิสิกส์อินเทอร์แอ็กทีฟ เครื่องเล่น Arcade WebGL/HTML5 รันลิงก์ Cloudflare Pages แบบ Sandbox พร้อมโหมดเต็มจอ Fullscreen
                    </p>
                  </div>
                </div>

                {/* Button Option 2 (NO ARROWS // PURE TEXT CENTERED) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode('game_center');
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 active:scale-98 text-black font-black text-sm tracking-wide text-center transition-all shadow-lg shadow-cyan-500/30 cursor-pointer"
                >
                  เข้าสู่ศูนย์เกม Sandbox
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ARCADE PLAYER VIEW (DARK SPACE THEME // CLOUDFLARE PAGES & VAULT)      */}
        {/* ========================================================================= */}
        {viewMode === 'game_center' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-3 md:p-5 overflow-hidden animate-fadeIn bg-[#090C15]">
            
            {/* Left Column (4 Cols): Physics & Logic Vault */}
            <div className="lg:col-span-4 flex flex-col justify-between bg-[#0e1322] p-4 rounded-2xl border border-white/10 overflow-y-auto space-y-4 text-white">
              
              <div className="space-y-4">
                {/* Header of Left Panel */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                    <Activity className="w-4 h-4" />
                    <span>PHYSICS &amp; LOGIC VAULT ({arcadeGames.length})</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    ONLINE
                  </span>
                </div>

                {/* Direct Upload Dropzone (When Admin Mode is ON) */}
                {isAdminMode && (
                  <div className="p-3 rounded-xl bg-gradient-to-br from-amber-950/30 to-black/60 border border-amber-500/40 space-y-2 shadow-lg animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-amber-300 flex items-center gap-1">
                        <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                        <span>LOCAL PREVIEW DROPZONE</span>
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        (Local Preview Only)
                      </span>
                    </div>

                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(true);
                      }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDraggingFile(false);
                        handleFileUpload(e.dataTransfer.files);
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      className={`p-2.5 rounded-lg border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-1 ${
                        isDraggingFile
                          ? 'bg-amber-950/60 border-amber-400 text-amber-200'
                          : 'bg-[#05070f]/80 border-amber-500/30 text-white/60 hover:border-amber-400/60'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip,.html,.wasm"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                      />

                      {isUploadingGame ? (
                        <div className="flex items-center gap-2 text-amber-300 text-xs font-mono py-1">
                          <RotateCcw className="w-4 h-4 animate-spin text-amber-400" />
                          <span>กำลังประมวลผลไฟล์...</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-[11px] font-mono">
                            <span className="text-amber-300 font-bold">ลากไฟล์ .zip / .html มาวาง</span> หรือ <span className="underline text-amber-400">คลิกเลือก</span>
                          </div>
                          <span className="text-[9px] text-white/40 font-mono">
                            ทดสอบในเครื่อง (Local Preview Only)
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Game Vault Selector List */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono text-white/50 uppercase tracking-wider">
                    เลือกเกมจากคลัง (CLICK TO PLAY):
                  </label>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {arcadeGames.map((game) => {
                      const isSelected = selectedGameId === game.id;
                      return (
                        <div
                          key={game.id}
                          onClick={() => setSelectedGameId(game.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-cyan-950/70 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                              : 'bg-[#090D1A] border-white/10 text-white/70 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <div className="space-y-0.5 truncate pr-2">
                            <div className="font-bold text-xs flex items-center gap-1.5 text-white truncate">
                              <span className="truncate">{game.title}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-white/50 truncate">
                              <span className="text-cyan-400 font-mono font-bold">[{game.hostingType || 'Cloudflare'}]</span>
                              <span className="truncate">{game.category}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/20">
                              {game.difficulty}
                            </span>
                            {game.isCustom && isAdminMode && (
                              <button
                                type="button"
                                onClick={(e) => handleRemoveCustomGame(game.id, e)}
                                title="ลบเกมออกจากคลัง"
                                className="p-1 rounded bg-red-950/60 hover:bg-red-800 text-red-300 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Physics Formula Panel for Active Game */}
                <div className="p-3 rounded-xl bg-[#070A14] border border-cyan-500/30 space-y-2 shadow-inner">
                  <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                    <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5 truncate">
                      <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">{activeGame.formulaHeader}</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40 shrink-0">
                      FORMULAS
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs font-mono max-h-[140px] overflow-y-auto pr-1">
                    {activeGame.formulas.map((f, idx) => (
                      <div key={idx} className="p-2 rounded-lg bg-[#0C1122] border border-white/5 space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-cyan-300 font-bold">{f.label}:</span>
                          <span className="text-amber-300 font-bold bg-black/40 px-1.5 py-0.5 rounded text-[10px]">
                            {f.equation}
                          </span>
                        </div>
                        <p className="text-[10px] text-white/50 font-sans">{f.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer info note */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/40 font-mono">
                <span>SEVEN SPACE LABS // ARCADE</span>
                <span className="text-cyan-400 font-bold">100% EMBEDDED</span>
              </div>
            </div>

            {/* Right Column (8 Cols): Arcade Iframe Player & Admin Bar */}
            <div
              ref={iframeContainerRef}
              className={`${
                isFullscreen
                  ? 'fixed inset-0 z-[200] w-screen h-screen p-3 md:p-6 bg-[#070913] flex flex-col justify-between overflow-hidden'
                  : 'lg:col-span-8 flex flex-col justify-between bg-[#0e1322] p-4 rounded-2xl border border-white/10 space-y-3'
              }`}
            >
              
              {/* Admin URL Input Panel (Shown only when ADMIN ON) */}
              {isAdminMode && !isFullscreen && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-amber-950/50 via-[#131b2e] to-black/70 border border-amber-500/50 space-y-2 shadow-lg animate-fadeIn shrink-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1.5">
                      <Cloud className="w-3.5 h-3.5 text-amber-400" />
                      <span>CLOUDFLARE PAGES URL INJECTOR (PRIMARY VAULT)</span>
                    </span>
                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ADMIN ON
                    </span>
                  </div>

                  <form onSubmit={handleLoadCustomGame} className="flex flex-col sm:flex-row gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="url"
                        value={customGameUrl}
                        onChange={(e) => setCustomGameUrl(e.target.value)}
                        placeholder="วางลิงก์เกม Cloudflare เช่น https://my-game.pages.dev"
                        className="w-full pl-8 pr-3 py-2 rounded-lg bg-[#05070f] border border-amber-500/40 text-xs text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-amber-400 font-mono"
                      />
                      <Globe className="w-3.5 h-3.5 text-amber-400 absolute left-2.5 top-2.5" />
                    </div>

                    <input
                      type="text"
                      value={customGameTitle}
                      onChange={(e) => setCustomGameTitle(e.target.value)}
                      placeholder="ชื่อเกม เช่น 2D Orbital Mechanics"
                      className="sm:w-56 px-3 py-2 rounded-lg bg-[#05070f] border border-white/10 text-xs text-white placeholder:text-white/35 outline-none focus:border-amber-400 font-kanit"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/25 shrink-0 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+ เพิ่มเข้าคลัง (ADD TO VAULT)</span>
                    </button>
                  </form>
                </div>
              )}

              {/* Arcade Player Top Bar: Game Selector + Reload + Fullscreen Button */}
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5 flex-wrap gap-2 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399] shrink-0" />
                  
                  <select
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                    className="bg-[#070A14] border border-cyan-500/40 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer max-w-[340px] truncate"
                  >
                    {arcadeGames.map((g) => (
                      <option key={g.id} value={g.id} className="bg-[#090C15] text-white">
                        {g.title}
                      </option>
                    ))}
                  </select>

                  {isFullscreen && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/50 shrink-0">
                      FULLSCREEN ACTIVE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 font-mono text-xs shrink-0">
                  <button
                    type="button"
                    onClick={handleReloadIframe}
                    title="รีโหลดเกม (Reload Game)"
                    className="p-1.5 px-3 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="text-[11px]">RELOAD</span>
                  </button>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    title={isFullscreen ? 'ออกจากโหมดเต็มจอ (Exit Fullscreen - Esc)' : 'ขยายหน้าจอเกมเต็มจอ (Fullscreen Mode)'}
                    className="p-1.5 px-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-black border border-cyan-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    <span>{isFullscreen ? 'EXIT FULLSCREEN' : '⛶ FULLSCREEN'}</span>
                  </button>
                </div>
              </div>

              {/* Iframe Viewport Container */}
              <div
                className={`relative w-full rounded-2xl overflow-hidden bg-[#000000] border border-cyan-500/30 flex items-center justify-center shadow-2xl ${
                  isFullscreen ? 'flex-1 my-1 h-full' : 'flex-1 min-h-[390px] h-[55vh]'
                }`}
              >
                {isLoadingIframe && (
                  <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center gap-2 pointer-events-none transition-opacity duration-500">
                    <RotateCcw className="w-8 h-8 text-cyan-400 animate-spin" />
                    <span className="text-xs font-mono text-cyan-300 font-bold tracking-wider">
                      LOADING ARCADE IFRAME PLAYER...
                    </span>
                  </div>
                )}

                {activeIframeUrl ? (
                  <iframe
                    key={activeIframeUrl}
                    src={activeIframeUrl}
                    title={activeGame.title}
                    onLoad={() => setIsLoadingIframe(false)}
                    className="w-full h-full block"
                    style={{ border: 'none', width: '100%', height: '100%' }}
                    sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                    allow="fullscreen; autoplay; pointer-lock"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center space-y-2 text-white/50">
                    <AlertCircle className="w-8 h-8 text-amber-400" />
                    <p className="text-xs">ไม่พบ URL ของเกม กรุณาเลือกเกมจากคลังด้านซ้ายหรือระบุ Cloudflare Pages URL</p>
                  </div>
                )}
              </div>

              {/* Iframe Bottom Status Bar */}
              <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-white/50 shrink-0 flex-wrap gap-2">
                <div className="flex items-center gap-2 truncate">
                  <span className="text-cyan-400 font-bold truncate">🎮 {activeGame.title}</span>
                  <span className="hidden md:inline text-white/30">|</span>
                  <span className="hidden md:inline text-white/40 truncate">{activeGame.category}</span>
                  {activeGame.hostingType && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 border border-white/10">
                      {activeGame.hostingType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-white/40">IN-PAGE SANDBOX</span>
                  <span className="text-emerald-400 font-bold">● ARCADE ONLINE</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. COMMUNITY HUB VIEW (CLEAN WHITE / LIGHT MODE THEME)                    */}
        {/* ========================================================================= */}
        {viewMode === 'community' && (
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 md:p-6 overflow-hidden animate-fadeIn bg-slate-50 text-slate-900">
            
            {/* Left Rooms List (4 Cols) - Light Theme */}
            <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>ห้องสนทนาชุมชน ({rooms.length})</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400 font-bold">CADET NETWORK</span>
              </div>

              <div className="space-y-2">
                {rooms.map((room) => {
                  const isSelected = selectedRoomId === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => setSelectedRoomId(room.id)}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-400 text-indigo-950 shadow-xs font-medium ring-1 ring-indigo-400/50'
                          : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{room.icon}</span>
                          <div className="font-bold text-xs truncate">{room.title}</div>
                        </div>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${room.badgeColor}`}>
                          {room.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{room.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Active Room Feed (8 Cols) - Light Theme */}
            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">
                    {rooms.find((r) => r.id === selectedRoomId)?.icon || '⚡'}
                  </span>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {rooms.find((r) => r.id === selectedRoomId)?.title}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {rooms.find((r) => r.id === selectedRoomId)?.description}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  LIGHT MODE // COMFORT READ
                </span>
              </div>

              {/* Message Feed in Light Mode */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {(rooms.find((r) => r.id === selectedRoomId)?.posts || []).map((post) => (
                  <div key={post.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full ${post.avatarBg} text-white font-bold text-[10px] flex items-center justify-center shadow-xs`}>
                          {post.author[0]}
                        </div>
                        <span className="font-bold text-xs text-slate-900">{post.author}</span>
                        {post.authorBadge && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold">
                            {post.authorBadge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{post.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 pl-8 leading-relaxed font-sans">{post.text}</p>
                    {post.tag && (
                      <div className="pl-8 pt-0.5">
                        <span className="text-[10px] text-indigo-600 font-mono font-medium">{post.tag}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Send Post Box - Light Mode */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="พิมพ์ข้อความแลกเปลี่ยนความรู้ หรือถามโจทย์ในห้องนี้..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newPostText.trim()) return;
                    const newPost: CommunityPost = {
                      id: `post-${Date.now()}`,
                      author: userCallsign,
                      authorBadge: isAdminMode ? 'Verified Admin' : `Cadet Lv.${userLevel}`,
                      avatarBg: 'bg-indigo-600',
                      text: newPostText.trim(),
                      time: 'เมื่อสักครู่',
                      likes: 1,
                      likedByUser: true,
                    };
                    setRooms((prev) =>
                      prev.map((r) => (r.id === selectedRoomId ? { ...r, posts: [newPost, ...r.posts] } : r))
                    );
                    setNewPostText('');
                    showToast('💬 ส่งข้อความโพสต์เรียบร้อย', 'success');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่ง</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
