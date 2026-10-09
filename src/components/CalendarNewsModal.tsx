import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  Trophy,
  Award,
  Filter,
  Flame,
} from 'lucide-react';
import { Language, ExamNewsItem } from '../types';
import { INITIAL_EXAM_NEWS } from './AnnouncementRow';

interface PhysicsFeedItem {
  id: string;
  dateStr: string;
  timestamp: number;
  titleTh: string;
  titleEn: string;
  contentTh: string;
  contentEn: string;
  summaryTh: string;
  summaryEn: string;
  sourceName: string;
  sourceUrl: string;
  hashtagsTh: string[];
  hashtagsEn: string[];
}

const INITIAL_FEED_DATA: PhysicsFeedItem[] = [
  {
    id: 'feed-flq',
    dateStr: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    titleTh: 'การควบคุมสภาวะควอนตัมด้วยฟลูเกต์ไดนามิกส์ (Floquet Engineering) ในสสารควบแน่น',
    titleEn: 'Floquet Engineering of Quantum States in Condensed Matter Lattices',
    contentTh: 'ทีมนักฟิสิกส์ควอนตัมจากสถาบันชั้นนำระดับโลกได้ประสบความสำเร็จในการใช้เลเซอร์พัลส์ความเข้มสูงช่วงความถี่เทราเฮิรตซ์ (Terahertz Laser Pulses) เพื่อขับเคลื่อนโครงผลึกอะตอมในวัสดุกึ่งตัวนำทรานซิชันไดแอลโคไลด์ ทำให้เกิดสถานะควอนตัมใหม่ที่ไม่มีตามธรรมชาติ (Floquet Topological States) โดยอาศัยหลักการทางคณิตศาสตร์ของ Floquet Theorem ในการแปลงระบบperiodic Hamiltonian ให้กลายเป็นระบบที่มีพลังงานเสมือน (Quasi-energy spectrum) การทดลองนี้สามารถควบคุมสปินของอิเล็กตรอนได้อย่างแม่นยำในระดับพิโสมวินาที ป้องกันการกระเจิงของอิเล็กตรอนจากความไม่สมบูรณ์ของผลึก ทำให้เกิดการนำไฟฟ้าแบบไร้ความต้านทานแม้ในอุณหภูมิห้อง ซึ่งเป็นก้าวสำคัญยิ่งต่อการพัฒนาสถาปัตยกรรมคอมพิวเตอร์ควอนตัมทอพอลอกลี (Topological Quantum Computing). เปรียบเสมือนการที่เราแกว่งชิงช้าด้วยจังหวะเวลาที่สอดคล้องสมบูรณ์กับคาบการแกว่ง (Parametric Resonance) ทำให้ชิงช้าสามารถลอยค้างเติ่งอยู่ในอากาศที่มุมเอียงสูงได้อย่างมั่นคงโดยไม่ตกลงมา แม้ว่าแรงโน้มถ่วงจะพยายามดึงลงมาก็ตาม เช่นเดียวกับการฉายแสงเลเซอร์จังหวะแม่นยำที่บังคับให้อิเล็กตรอนเรียงตัวในสถานะทอพอลอกลีไร้การสูญเสียพลังงาน ผลลัพธ์จากการทดลองนี้นอกจากจะเปิดประตูสู่วิวัฒนาการวัสดุศาสตร์ยุคใหม่แล้ว ยังช่วยลดการสูญเสียความร้อนในไมโครโปรเซสเซอร์ระดับนาโนเมตรได้อย่างมีนัยสำคัญ',
    contentEn: 'Quantum physicists have successfully utilized high-intensity terahertz laser pulses to drive atomic lattices in transition metal dichalcogenides, generating novel Floquet topological states absent in equilibrium nature. By applying Floquet theorem mathematics to transform periodic Hamiltonians into quasi-energy spectra, the experiment achieves picosecond electron spin control and dissipationless transport at room temperature, unlocking a vital pathway toward topological quantum computing architectures. This is analogous to pumping a playground swing in precise parametric resonance, allowing it to sustain stable oscillations at high amplitudes despite gravitational pulling forces, perfectly mirroring how synchronized laser fields lock electrons into lossless topological trajectories.',
    summaryTh: 'การใช้เลเซอร์เทราเฮิรตซ์ควบคุมสสารด้วยเทคนิค Floquet Engineering สร้างสถานะควอนตัมใหม่ไร้การสูญเสียพลังงาน เปรียบเสมือนการบังคับให้ลูกปัดลอยนิ่งกลางอากาศด้วยแรงสั่นสะเทือนจังหวะสมบูรณ์',
    summaryEn: 'Terahertz laser-driven Floquet engineering unlocks dissipationless topological quantum states at room temperature, akin to keeping a pendulum stably suspended via resonant vibrations.',
    sourceName: 'Nature Physics',
    sourceUrl: 'https://www.nature.com/nphys',
    hashtagsTh: ['#QuantumPhysics', '#FloquetEngineering', '#CondensedMatter', '#TerahertzLaser', '#PhysicsNo7'],
    hashtagsEn: ['#QuantumPhysics', '#FloquetEngineering', '#CondensedMatter', '#TerahertzLaser', '#SciencePEC'],
  },
  {
    id: 'feed-dst',
    dateStr: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    titleTh: 'การตรวจพบโซนดักจับฝุ่นละออง (Dust Traps) ในจานกำเนิดดาวเคราะห์ด้วยกล้อง ALMA',
    titleEn: 'ALMA Telescope Array Discovers Millimeter Dust Traps in Protoplanetary Disks',
    contentTh: 'เครือข่ายกล้องโทรทรรศน์วิทยุ ALMA (Atacama Large Millimeter/submillimeter Array) ได้เผยแพร่ภาพความละเอียดสูงของการกระจายตัวของอนุภาคฝุ่นขนาดมิลลิเมตรในจานกำเนิดดาวเคราะห์ (Protoplanetary Disk) รอบดาวฤกษ์อายุน้อย ข้อมูลสเปกตรัมยืนยันการมีอยู่ของ "โซนดักจับฝุ่น" (Dust Traps) ซึ่งเกิดจากความแตกต่างของแรงดันก๊าซ (Gas Pressure Maxima) ที่เหนี่ยวนำให้ฝุ่นละอองและก้อนหินขนาดเล็กมารวมตัวกันเป็นกระจุกหนาแน่น ป้องกันไม่ให้ฝุ่นละอองไหลวนตกลงสู่ใจกลางดาวฤกษ์ กระบวนการนี้ถือเป็นเงื่อนไขทางฟิสิกส์ดาราศาสตร์ขั้นวิกฤตที่อธิบายว่าเหตุใดสสารจึงสามารถก่อตัวรวมกันเป็นดาวเคราะห์น้อยและดาวเคราะห์หินขนาดใหญ่ได้อย่างรวดเร็วภายในเวลาไม่กี่ล้านปี. เปรียบเสมือนการสร้างเขื่อนกั้นน้ำในลำธารที่เชี่ยวกราก เมื่อกระแสน้ำพัดพาตะกอนดินและทรายมาปะทะกับแนวสันเขื่อน ความเร็วของน้ำจะลดลงกะทันหัน ทำให้เศษตะกอนและกรวดทรายตกลงและทับถมกันกลายเป็นเกาะดอนทรายขนาดใหญ่ ในทำนองเดียวกัน แรงดันก๊าซในจานดาวเคราะห์ทำหน้าที่เป็นเขื่อนลมที่หยุดอนุภาคฝุ่นไม่ให้ไหลวนหลุดเข้าสู่ดาวฤกษ์ งานวิจัยนี้ช่วยให้นักดาราศาสตร์เข้าใจกลไกการก่อตัวของระบบสุริยะและดาวเคราะห์นอกระบบได้แม่นยำยิ่งขึ้น',
    contentEn: 'The ALMA telescope array has published high-resolution imagery revealing millimeter-sized dust trap zones within protoplanetary disks surrounding young stellar objects. Spectral analysis confirms that gas pressure maxima naturally aggregate cosmic pebbles and dust, shielding them from inward radial drift toward the host star. This astrophysical mechanism resolves the longstanding planetesimal formation barrier by explaining how rocky planets rapidly coalesce within millions of years. This is comparable to constructing a river dam that abruptly slows torrential currents, allowing suspended silt and sand to settle into substantial sandbars, illustrating how gas pressure barriers concentrate raw planetary building blocks.',
    summaryTh: 'กล้อง ALMA ค้นพบโซนความดันก๊าซทำหน้าที่เป็นเขื่อนธรรมชาติ ดักจับอนุภาคฝุ่นในจานกำเนิดดาวเคราะห์ให้รวมตัวกันเป็นดาวเคราะห์หินได้อย่างรวดเร็ว',
    summaryEn: 'ALMA observations reveal pressure-induced dust traps in protoplanetary disks, serving as natural dams that accelerate rocky planetesimal formation.',
    sourceName: 'Astrophysical Journal (ApJ)',
    sourceUrl: 'https://iopscience.iop.org/journal/0004-637X',
    hashtagsTh: ['#Astrophysics', '#ProtoplanetaryDisk', '#DustTrap', '#PlanetFormation', '#PhysicsNo7'],
    hashtagsEn: ['#Astrophysics', '#ProtoplanetaryDisk', '#DustTrap', '#PlanetFormation', '#SciencePEC'],
  },
  {
    id: 'feed-gwt',
    dateStr: new Date().toISOString().split('T')[0],
    timestamp: Date.now(),
    titleTh: 'แคตตาล็อกคลื่นความโน้มถ่วงชุดใหม่ GWTC-5.0 เผยสถิติหลุมดำมวลปริศนาในช่องว่างมวล',
    titleEn: 'LIGO-Virgo-KAGRA Collaboration Releases GWTC-5.0 Catalog Revealing Mass Gap Black Holes',
    contentTh: 'ความร่วมมือระดับนานาชาติ LIGO-Virgo-KAGRA ได้ประกาศเผยแพร่แคตตาล็อกคลื่นความโน้มถ่วงชุดสมบูรณ์ GWTC-5.0 ซึ่งรวบรวมสัญญาณการชนกันของหลุมดำและดาวนิวตรอนมากกว่า 90 เหตุการณ์ การวิเคราะห์สถิติมวลและการหมุนรอบตัวเอง (Spin Parameter) เผยให้เห็นการค้นพบหลุมดำที่มีมวลอยู่ในช่วง "ช่องว่างมวล" (Mass Gap: ระหว่าง 2.5 ถึง 5 เท่าของมวลสุริยะ) ซึ่งเป็นขอบเขตทางทฤษฎีที่แบบจำลองวิวัฒนาการดาวฤกษ์เดิมไม่คาดว่าจะเกิดขึ้น การตรวจจับนี้บังคับให้นักฟิสิกส์ต้องทบทวนกลไกการระเบิดซูเปอร์โนวาและการยุบตัวของแกนกลางดาวฤกษ์มวลมากใหม่ทั้งหมด. เปรียบเสมือนการที่เรายืนอยู่ริมชายหาดแล้วฟังเสียงคลื่นซัดเข้าฝั่งจากเรือเดินสมุทรหลายร้อยลำที่แล่นผ่านในความมืด จากความถี่และความดังของเสียงคลื่นที่ซัดกระทบโขดหิน เราสามารถแยกแยะได้ว่าเรือลำใดเป็นเรือประมงลำเล็กหรือเรือบรรทุกยักษ์ ข้อมูลคลื่นความโน้มถ่วงนี้เปรียบเสมือนรหัสเสียงที่สะท้อนมวลและประวัติศาสตร์การชนกันของหลุมดำทั่วเอกภพ การค้นพบนี้ถือเป็นหลักชัยสำคัญของฟิสิกส์ยุคใหม่ในการไขปริศนาสสารมืดและหลุมดำปฐมภูมิ',
    contentEn: 'The LIGO-Virgo-KAGRA collaboration has released the comprehensive GWTC-5.0 gravitational-wave catalog detailing over 90 compact binary coalescence events. Statistical mass and spin analyses unveil detections within the elusive "mass gap" (2.5 to 5 solar masses), challenging classical stellar evolution models and forcing revisions to core-collapse supernova physics. This is analogous to listening to ocean waves crashing ashore in pitch darkness, where distinct wave frequencies and amplitudes allow physicists to acoustically distinguish fishing boats from supertankers, mirroring how gravitational waveforms encode the precise masses of colliding cosmic black holes.',
    summaryTh: 'LIGO-Virgo-KAGRA เปิดตัวแคตตาล็อก GWTC-5.0 เผยหลักฐานการชนกันของหลุมดำในช่วงช่องว่างมวลปริศนา ท้าทายทฤษฎีวิวัฒนาการดาวฤกษ์เดิม',
    summaryEn: 'GWTC-5.0 catalog reveals compact binaries populating the stellar-mass gap, reshaping our understanding of supernova collapse and black hole astrophysics.',
    sourceName: 'Physical Review X (PRX)',
    sourceUrl: 'https://journals.aps.org/prx',
    hashtagsTh: ['#GravitationalWaves', '#LIGO', '#BlackHole', '#Astrophysics', '#PhysicsNo7'],
    hashtagsEn: ['#GravitationalWaves', '#LIGO', '#BlackHole', '#Astrophysics', '#SciencePEC'],
  },
];

interface CalendarNewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialSection?: 'news' | 'exam' | 'leaderboard';
}

export const CalendarNewsModal: React.FC<CalendarNewsModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialSection = 'news',
}) => {
  const [currentSection, setCurrentSection] = useState<'news' | 'exam' | 'leaderboard'>(initialSection);
  const [activeTab, setActiveTab] = useState<'th' | 'en'>(lang);

  // News Feed state
  const [newsFeed, setNewsFeed] = useState<PhysicsFeedItem[]>(() => {
    try {
      const saved = localStorage.getItem('seven_space_physics_feed_30d');
      if (saved) {
        const parsed: PhysicsFeedItem[] = JSON.parse(saved);
        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
        const filtered = parsed.filter((item) => item.timestamp >= thirtyDaysAgo);
        if (filtered.length > 0) return filtered;
      }
    } catch (e) {
      console.warn('Failed to load feed:', e);
    }
    return INITIAL_FEED_DATA;
  });

  const [selectedDate, setSelectedDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  // Exam Calendar state
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

  // Leaderboard state
  const [selectedLeaderboardItem, setSelectedLeaderboardItem] = useState<string | null>(null);

  useEffect(() => {
    setCurrentSection(initialSection);
    setSelectedNewsId(null);
    setSelectedExamId(null);
  }, [initialSection, isOpen]);

  if (!isOpen) return null;

  const availableDates = Array.from(new Set(newsFeed.map((item) => item.dateStr))).sort().reverse();
  const filteredFeed = newsFeed.filter((item) => item.dateStr === selectedDate);
  const currentNews = newsFeed.find((item) => item.id === selectedNewsId);

  const examCategories = [
    'ทั้งหมด',
    'สอบคัดเลือก สอวน.',
    'สอบเข้า ม.4 กำเนิดวิทย์/มหิดล',
    'TCAS',
    'ทุนการศึกษา',
    'สอบบรรจุ/ข้าราชการวิชาการ',
  ];
  const filteredExams =
    selectedCategory === 'ทั้งหมด'
      ? INITIAL_EXAM_NEWS
      : INITIAL_EXAM_NEWS.filter((item) => item.category === selectedCategory);
  const currentExam = INITIAL_EXAM_NEWS.find((item) => item.id === selectedExamId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header & Section Tabs */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {currentSection === 'news'
                    ? (activeTab === 'th' ? 'คลังข่าววิทยาศาสตร์และฟิสิกส์เชิงลึก' : 'Deep Physics & Science Feed')
                    : currentSection === 'exam'
                    ? (activeTab === 'th' ? 'ปฏิทินสอบ & ข่าวรับสมัคร' : 'Exam & Admission Calendar')
                    : (activeTab === 'th' ? 'ทำเนียบดาวเด่นประจำสัปดาห์' : 'Weekly Leaderboard')}
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                {activeTab === 'th' ? 'ระบบเจาะลึก 2 ระดับขั้น (2-Tier Drill-down)' : '2-Tier Interactive Drill-down System'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Section Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => {
                  setCurrentSection('news');
                  setSelectedNewsId(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentSection === 'news' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-700'
                }`}
              >
                ข่าววิทย์
              </button>
              <button
                onClick={() => {
                  setCurrentSection('exam');
                  setSelectedExamId(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentSection === 'exam' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-700'
                }`}
              >
                ปฏิทินสอบ
              </button>
              <button
                onClick={() => {
                  setCurrentSection('leaderboard');
                  setSelectedLeaderboardItem(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  currentSection === 'leaderboard' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-700'
                }`}
              >
                ดาวเด่น
              </button>
            </div>

            {/* Language Switcher */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/70 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('th')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'th' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-700'
                }`}
              >
                TH
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'en' ? 'bg-indigo-600 text-white shadow-sm font-bold' : 'text-slate-700'
                }`}
              >
                EN
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: NEWS FEED DRILL-DOWN                          */}
        {/* ======================================================== */}
        {currentSection === 'news' && (
          selectedNewsId && currentNews ? (
            /* Tier 2: Full News Detail View */
            <div className="p-6 overflow-y-auto space-y-5 bg-white flex-1">
              <button
                onClick={() => setSelectedNewsId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{activeTab === 'th' ? '← ย้อนกลับไปหน้ารวมหัวข้อ' : '← Back to Headlines'}</span>
              </button>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {activeTab === 'th' ? currentNews.titleTh : currentNews.titleEn}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-line">
                {activeTab === 'th' ? currentNews.contentTh : currentNews.contentEn}
              </p>

              <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 font-medium">
                <span className="font-bold">สรุปข่าว: </span>
                {activeTab === 'th' ? currentNews.summaryTh : currentNews.summaryEn}
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">
                  แหล่งที่มา: <strong className="text-slate-900">{currentNews.sourceName}</strong>
                </span>
                <a
                  href={currentNews.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs"
                >
                  <span>{activeTab === 'th' ? 'เข้าสู่หน้าบทความจริง ↗' : 'Access Real Article ↗'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="text-[11px] font-mono text-slate-500 italic flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>{activeTab === 'th' ? 'ภาพ: AI concept art' : 'Image: AI concept art'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {(activeTab === 'th' ? currentNews.hashtagsTh : currentNews.hashtagsEn).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-200/70 text-slate-700 border border-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* Tier 1: News Directory / Headlines List */
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span>ย้อนหลัง 30 วัน:</span>
                </span>
                {availableDates.map((d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDate(d)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                      selectedDate === d
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {d === new Date().toISOString().split('T')[0] ? 'วันนี้' : d}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto space-y-3 bg-white flex-1">
                {filteredFeed.length === 0 ? (
                  <div className="p-10 text-center text-slate-500 text-xs">ไม่พบรายการข่าวในวันที่เลือก</div>
                ) : (
                  filteredFeed.map((item, idx) => {
                    const headlineTitle = activeTab === 'th' ? item.titleTh : item.titleEn;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNewsId(item.id)}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                            [{String(idx + 1).padStart(2, '0')}]
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors line-clamp-2">
                            {headlineTitle}
                          </h4>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">{item.sourceName}</span>
                          <span className="p-1.5 rounded-full bg-white text-slate-500 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )
        )}

        {/* ======================================================== */}
        {/* SECTION 2: EXAM CALENDAR DRILL-DOWN                      */}
        {/* ======================================================== */}
        {currentSection === 'exam' && (
          selectedExamId && currentExam ? (
            /* Tier 2: Full Exam Detail View */
            <div className="p-6 overflow-y-auto space-y-5 bg-white flex-1">
              <button
                onClick={() => setSelectedExamId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{activeTab === 'th' ? '← ย้อนกลับไปหน้ารวมหัวข้อ' : '← Back to Exam Directory'}</span>
              </button>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 w-fit">
                {currentExam.category}
              </span>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentExam.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {currentExam.summary} รายละเอียดระเบียบการรับสมัคร กำหนดการสอบคัดเลือก รอบแรกและรอบสอง เกณฑ์การให้คะแนน และการประกาศผลอย่างเป็นทางการผ่านเว็บไซต์สถาบัน
              </p>

              <div className="pt-2 border-t border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="text-slate-600 font-medium">
                  กำหนดการ: <strong className="text-slate-900">ประจำปีการศึกษาใหม่ (อัปเดตสัปดาห์นี้)</strong>
                </span>
                <a
                  href={currentExam.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs"
                >
                  <span>{activeTab === 'th' ? 'ไปที่หน้าประกาศรับสมัครจริง ↗' : 'Go to Official Announcement ↗'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            /* Tier 1: Exam Directory / Category List */
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 mr-1">
                  <Filter className="w-3.5 h-3.5 text-indigo-600" />
                  <span>หมวดหมู่สอบ:</span>
                </span>
                {examCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto space-y-3 bg-white flex-1">
                {filteredExams.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedExamId(item.id)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-slate-100/80 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="shrink-0 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        [{String(idx + 1).padStart(2, '0')}]
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 block mb-0.5">{item.category}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-indigo-600 transition-colors line-clamp-2">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                    <span className="p-1.5 rounded-full bg-white text-slate-500 border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* ======================================================== */}
        {/* SECTION 3: WEEKLY LEADERBOARD DRILL-DOWN                 */}
        {/* ======================================================== */}
        {currentSection === 'leaderboard' && (
          selectedLeaderboardItem ? (
            /* Tier 2: Leaderboard Detail View */
            <div className="p-6 overflow-y-auto space-y-5 bg-white flex-1">
              <button
                onClick={() => setSelectedLeaderboardItem(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer border border-slate-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{activeTab === 'th' ? '← ย้อนกลับไปหน้ารวมหัวข้อ' : '← Back to Leaderboard'}</span>
              </button>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                <Trophy className="w-8 h-8 text-amber-500 shrink-0" />
                <div>
                  <h2 className="text-base font-bold">Cadet_Nova (แชมป์อันดับ 1 ประจำสัปดาห์)</h2>
                  <p className="text-xs text-amber-700 font-mono">คะแนนรวม: 9,850 PTS • ระดับความแม่นยำ: 99.4% Acc</p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
                <p><strong>สังกัดโรงเรียน:</strong> โรงเรียนกำเนิดวิทย์ (KVIS) - ชั้นมัธยมศึกษาปีที่ 5</p>
                <p><strong>สถานีปฏิบัติการยอดเยี่ยม:</strong> ห้องประลองโจทย์วิทยาศาสตร์ (Quiz Arena) และห้องทดสอบ AI Exam Studio</p>
                <p><strong>รางวัลเกียรติยศ:</strong> ได้รับประกาศนียบัตรอิเล็กทรอนิกส์ยืนยันสถานะแชมป์ประจำสัปดาห์ พร้อมสิทธิ์เข้าถึงข้อสอบระดับสูงพิเศษ</p>
              </div>
            </div>
          ) : (
            /* Tier 1: Leaderboard Directory List */
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="px-6 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>ทำเนียบดาวเด่นประจำสัปดาห์ (Top 10 Cadets & Creators)</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  WEEKLY RESET
                </span>
              </div>

              <div className="p-6 overflow-y-auto space-y-3 bg-white flex-1">
                <div
                  onClick={() => setSelectedLeaderboardItem('cadet-1')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-indigo-600">
                        Cadet_Nova (แชมป์สัปดาห์นี้)
                      </h4>
                      <span className="text-[11px] text-slate-500">ม.5 กำเนิดวิทย์ • 9,850 PTS • 99.4% Acc</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>

                <div
                  onClick={() => setSelectedLeaderboardItem('cadet-2')}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-400 transition-all cursor-pointer flex items-center justify-between gap-4 shadow-2xs group"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] group-hover:text-indigo-600">
                        Luna_Orbital
                      </h4>
                      <span className="text-[11px] text-slate-500">ม.4 เตรียมอุดมฯ • 9,420 PTS • 98.1% Acc</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs p-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span className="text-slate-600">CREATOR ยอดนิยม:</span>
                    <strong className="text-slate-900">Kru_Earth Astrophysics</strong>
                  </div>
                  <span className="font-mono text-indigo-600 font-bold">RANK #1</span>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};
