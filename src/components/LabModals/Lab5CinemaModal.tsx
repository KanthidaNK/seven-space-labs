import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Film,
  Sparkles,
  ExternalLink,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Save,
  RotateCcw,
  Search,
  Check,
  Copy,
  Layers,
  Video,
  Clock,
  User,
  Share2,
  Atom,
  BookOpen,
  Globe,
  Radio,
  Tv,
} from 'lucide-react';
import { Language } from '../../types';

export type CinemaCategory = 'all' | 'tales' | 'knowledge' | 'science' | 'space';

export interface CinemaVideo {
  id: string;
  title: string;
  category: 'tales' | 'knowledge' | 'science' | 'space';
  youtubeUrl: string;
  duration: string;
  channelName: string;
  description: string;
  views?: string;
  featured?: boolean;
}

const DEFAULT_CINEMA_VIDEOS: CinemaVideo[] = [
  // 1. ดาราศาสตร์ & ฟิสิกส์อวกาศ (Astrophysics 4K)
  {
    id: 'space-timelapse-future',
    title: 'TIMELAPSE OF THE FUTURE: ท่องกาลเวลาสู่อนาคต 100 ล้านล้านปีสู่จุดจบจักรวาล (4K)',
    category: 'space',
    youtubeUrl: 'https://www.youtube.com/watch?v=uD4izuDMUQA',
    duration: '29:20',
    channelName: 'Melodysheep',
    views: '112M views',
    featured: true,
    description: 'สารคดีดาราศาสตร์ 4K ระดับตำนาน จำลองการวิวัฒนาการของเอกภพ ยุคของดาวฤกษ์ หลุมดำ และการสลายตัวของอะตอม',
  },
  {
    id: 'space-black-hole-deep',
    title: 'เจาะลึกความจริงของหลุมดำและขอบฟ้าเหตุการณ์ (The Black Hole Information Paradox)',
    category: 'space',
    youtubeUrl: 'https://www.youtube.com/watch?v=e-P5IFTqB98',
    duration: '10:55',
    channelName: 'Kurzgesagt – In a Nutshell',
    views: '24M views',
    description: 'หลุมดำกลืนกินสสารแล้วข้อมูลหายไปไหน? ท่องขอบฟ้าเหตุการณ์และการแผ่รังสีฮอว์คิง',
  },
  {
    id: 'space-jwst-deep-field',
    title: 'ภาพถ่ายอวกาศห้วงลึกแรกจากกล้องโทรทรรศน์อวกาศ เจมส์ เวบบ์ (JWST 4K Showcase)',
    category: 'space',
    youtubeUrl: 'https://www.youtube.com/watch?v=1C_zWdx3xVU',
    duration: '08:15',
    channelName: 'NASA Goddard',
    views: '18M views',
    description: 'ชมภาพถ่ายกาแล็กซีแรกเริ่มของเอกภพเมื่อ 13,000 ล้านปีก่อนด้วยระบบตรวจจับรังสีอินฟราเรดความละเอียดสูงสุด',
  },

  // 2. วิทยาศาสตร์ & การทดลอง (Science & Experiments)
  {
    id: 'science-vacuum-fall',
    title: 'การทดลองตกอิสระในห้องสุญญากาศที่ใหญ่ที่สุดในโลก: ขนนก vs ลูกตุ้มโบว์ลิ่ง',
    category: 'science',
    youtubeUrl: 'https://www.youtube.com/watch?v=E43-CfukEgs',
    duration: '04:42',
    channelName: 'BBC Earth Lab / Brian Cox',
    views: '68M views',
    featured: true,
    description: 'พิสูจน์กฎการตกอิสระของกาลิเลโอในห้องสุญญากาศของ NASA เมื่อไม่มีแรงต้านอากาศ วัตถุทุกชิ้นจะตกด้วยความเร่งเท่ากัน',
  },
  {
    id: 'science-light-speed-water',
    title: 'ทำไมแสงถึงเคลื่อนที่ช้าลงเมื่อผ่านแก้วและน้ำ? ไขปริศนาธรรมชาติของคลื่นแสง',
    category: 'science',
    youtubeUrl: 'https://www.youtube.com/watch?v=CUjt3646agQ',
    duration: '16:30',
    channelName: 'Veritasium',
    views: '15M views',
    description: 'การเดินทางของโฟตอนผ่านตัวกลาง การแทรกสอด และการหักเหแสงตามหลักฟิสิกส์คลื่นแม่เหล็กไฟฟ้า',
  },
  {
    id: 'science-sound-resonance',
    title: 'ภาพคลื่นเสียงที่ตามองเห็น: การสั่นพ้องบนแผ่นเหล็ก (Chladni Plate Sound Resonance)',
    category: 'science',
    youtubeUrl: 'https://www.youtube.com/watch?v=wvJAgrUBF4w',
    duration: '03:50',
    channelName: 'Brusspup Science',
    views: '32M views',
    description: 'การทดลองคลื่นนิ่งทางอะคูสติก เมื่อความถี่เปลี่ยน ทรายบนแผ่นโลหะจะจัดเรียงตัวเป็นลวดลายเรขาคณิตอันงดงาม',
  },

  // 3. ความรู้รอบตัว & ปรัชญา (General Knowledge)
  {
    id: 'knowledge-history-universe',
    title: 'ประวัติศาสตร์ 13,800 ล้านปีของเอกภพตั้งแต่บิกแบงถึงมนุษย์ยุคปัจจุบันใน 10 นาที',
    category: 'knowledge',
    youtubeUrl: 'https://www.youtube.com/watch?v=5TbUxGZtwGI',
    duration: '11:42',
    channelName: 'Kurzgesagt – In a Nutshell',
    views: '45M views',
    description: 'ลำดับเวลาการกำเนิดธาตุในดาวฤกษ์ การรวมตัวของสิ่งมีชีวิต และอารยธรรมมนุษย์บนโลกสีน้ำเงินใบเล็ก',
  },
  {
    id: 'knowledge-what-is-time',
    title: 'เวลาคืออะไร? ทำไมเวลาจึงไหลไปข้างหน้าเสมอตามกฎเอนโทรปี (The Arrow of Time)',
    category: 'knowledge',
    youtubeUrl: 'https://www.youtube.com/watch?v=jlTVIMOix94',
    duration: '14:20',
    channelName: 'TED-Ed Science',
    views: '9.8M views',
    description: 'สัมพัทธภาพพิเศษของไอน์สไตน์ ความยืดหยุ่นของกาลอวกาศ และเหตุผลที่ทำไมเราจำอดีตได้แต่จำอนาคตไม่ได้',
  },
  {
    id: 'knowledge-spaceth-future',
    title: 'การสำรวจดาวอังคารและอนาคตการตั้งถิ่นฐานนอกโลกของมนุษยชาติ',
    category: 'knowledge',
    youtubeUrl: 'https://www.youtube.com/watch?v=RH3p9qXq8Zg',
    duration: '22:15',
    channelName: 'Spaceth.co',
    views: '3.2M views',
    description: 'วิเคราะห์เทคโนโลยีจรวดนำกลับมาใช้ใหม่ Starship, การดัดแปลงบรรยากาศดาวอังคาร (Terraforming) และก้าวต่อไปของมนุษยชาติ',
  },

  // 4. นิทาน & วรรณกรรมเยาวชน (Tales & Fables)
  {
    id: 'tales-little-prince',
    title: 'การเดินทางของเจ้าชายน้อยและดวงดาว B-612 (The Little Prince & The Asteroid)',
    category: 'tales',
    youtubeUrl: 'https://www.youtube.com/watch?v=0hY3uX1Zq2o',
    duration: '18:30',
    channelName: 'วรรณกรรมเยาวชนคลาสสิก',
    views: '5.6M views',
    featured: true,
    description: 'วรรณกรรมระดับโลกที่สอนให้มองเห็นสิ่งที่สำคัญด้วยหัวใจ การดูแลดอกกุหลาบ และการเดินทางข้ามหมู่ดาว',
  },
  {
    id: 'tales-orion-mythology',
    title: 'ตำนานกลุ่มดาวนายพรานและแมงป่องแห่งท้องฟ้า (The Legend of Orion & Scorpius)',
    category: 'tales',
    youtubeUrl: 'https://www.youtube.com/watch?v=rL6gY9t2HjU',
    duration: '15:45',
    channelName: 'Point of View',
    views: '4.1M views',
    description: 'เรื่องเล่าดาราศาสตร์กรีกโบราณ เหตุผลที่กลุ่มดาวนายพรานและแมงป่องไม่เคยปรากฏบนท้องฟ้าพร้อมกัน',
  },
  {
    id: 'tales-milky-way-lovers',
    title: 'ตำนานทางช้างเผือกและคู่รักแห่งดวงดาว (The Star Festival & The Milky Way)',
    category: 'tales',
    youtubeUrl: 'https://www.youtube.com/watch?v=yYmB8c7Z9XQ',
    duration: '12:20',
    channelName: 'Tales of the Stars',
    views: '2.8M views',
    description: 'นิทานดาวคนเลี้ยงวัว (Altair) และดาวหญิงทอผ้า (Vega) ที่มีแม่น้ำสวรรค์ทางช้างเผือกคั่นกลาง',
  },
];

export function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return 'uD4izuDMUQA';
  const trimmed = urlOrId.trim();

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = trimmed.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    return match[2];
  }

  if (trimmed.length === 11 && !trimmed.includes('/') && !trimmed.includes('.')) {
    return trimmed;
  }

  return 'uD4izuDMUQA';
}

export function getYouTubeEmbedUrl(urlOrId: string): string {
  const id = extractYouTubeId(urlOrId);
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
}

export function getYouTubeThumbnail(urlOrId: string): string {
  const id = extractYouTubeId(urlOrId);
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

interface Lab5CinemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const Lab5CinemaModal: React.FC<Lab5CinemaModalProps> = ({ isOpen, onClose, lang }) => {
  // Category Filter State
  const [selectedCategory, setSelectedCategory] = useState<CinemaCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Video Library State with LocalStorage Persistence
  const [videoList, setVideoList] = useState<CinemaVideo[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_cinema_videos');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage cinema load error:', e);
    }
    return DEFAULT_CINEMA_VIDEOS;
  });

  const [activeVideoId, setActiveVideoId] = useState<string>('space-timelapse-future');
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Admin Video Manager State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editForm, setEditForm] = useState<CinemaVideo>({
    id: '',
    title: '',
    category: 'space',
    youtubeUrl: '',
    duration: '15:00',
    channelName: '',
    description: '',
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeVideo = videoList.find((v) => v.id === activeVideoId) || videoList[0];

  // Filtered Video List
  const filteredVideos = videoList.filter((video) => {
    const matchesCat = selectedCategory === 'all' || video.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.channelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleCopyLink = () => {
    if (activeVideo) {
      navigator.clipboard.writeText(activeVideo.youtubeUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleSaveVideoForm = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: CinemaVideo[];

    if (isAddingNew) {
      const newVideo: CinemaVideo = {
        ...editForm,
        id: `vid-${Date.now()}`,
        duration: editForm.duration || '10:00',
        views: 'NEW VIDEO',
      };
      updated = [newVideo, ...videoList];
      setActiveVideoId(newVideo.id);
    } else {
      updated = videoList.map((v) => (v.id === editForm.id ? editForm : v));
    }

    setVideoList(updated);
    try {
      localStorage.setItem('ssl_cinema_videos', JSON.stringify(updated));
    } catch (e) {}

    setIsAddingNew(false);
    setIsAdminOpen(false);
    setToastMessage('บันทึกข้อมูลคลิปวิดีโอเรียบร้อยแล้ว!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteVideo = (id: string) => {
    if (confirm('คุณต้องการลบคลิปวิดีโอนี้ออกจากเพลย์ลิสต์หรือไม่?')) {
      const updated = videoList.filter((v) => v.id !== id);
      setVideoList(updated);
      try {
        localStorage.setItem('ssl_cinema_videos', JSON.stringify(updated));
      } catch (e) {}

      if (activeVideoId === id && updated.length > 0) {
        setActiveVideoId(updated[0].id);
      }
    }
  };

  const handleResetDefaults = () => {
    if (confirm('ต้องการรีเซ็ตคลังวิดีโอทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setVideoList(DEFAULT_CINEMA_VIDEOS);
      setActiveVideoId(DEFAULT_CINEMA_VIDEOS[0].id);
      try {
        localStorage.removeItem('ssl_cinema_videos');
      } catch (e) {}
      setIsAdminOpen(false);
      setToastMessage('รีเซ็ตคลังวิดีโอเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const getCategoryBadge = (cat: 'tales' | 'knowledge' | 'science' | 'space') => {
    switch (cat) {
      case 'tales':
        return { label: 'นิทาน & วรรณกรรม', bg: 'bg-purple-950/80 text-purple-300 border-purple-500/40' };
      case 'knowledge':
        return { label: 'ความรู้รอบตัว', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' };
      case 'science':
        return { label: 'วิทยาศาสตร์ & การทดลอง', bg: 'bg-blue-950/80 text-blue-300 border-blue-500/40' };
      case 'space':
        return { label: 'ดาราศาสตร์ 4K', bg: 'bg-rose-950/80 text-rose-300 border-rose-500/40' };
      default:
        return { label: 'ทั่วไป', bg: 'bg-slate-800 text-slate-300 border-slate-700' };
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[94vh] rounded-3xl bg-slate-900 text-white shadow-2xl border border-rose-500/30 flex flex-col overflow-hidden">
        {/* ========================================================================= */}
        {/* TOP BAR: BRANDING & ADMIN BUTTON                                          */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-400">
              <Film className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>LAB 5: โรงภาพยนตร์ความรู้อัจฉริยะ (Smart EdTech Cinema)</span>
                </h3>
                <span className="hidden sm:inline text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-950 text-rose-300 border border-rose-700/60">
                  4K STREAM HUB
                </span>
              </div>
              <p className="text-xs text-slate-400">
                คลังสื่อวิดีโอเสริมทักษะ นิทานวิทยาศาสตร์ ดาราศาสตร์ และการทดลองระดับโลก
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Video Manager Button */}
            <button
              onClick={() => {
                setIsAddingNew(false);
                setEditForm(activeVideo);
                setIsAdminOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
              title="จัดการคลังคลิปวิดีโอ (Admin)"
            >
              <Settings className="w-3.5 h-3.5 text-rose-400" />
              <span>จัดการคลังวิดีโอ (Admin)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS                                                      */}
        {/* ========================================================================= */}
        <div className="bg-slate-950/80 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-bold text-slate-500 uppercase font-mono tracking-wider mr-2 hidden md:inline">
              หมวดหมู่เนื้อหา:
            </span>

            {[
              { id: 'all', label: 'ทั้งหมด (All)', icon: Layers },
              { id: 'tales', label: 'นิทาน & วรรณกรรมเยาวชน (Tales & Fables)', icon: BookOpen },
              { id: 'knowledge', label: 'ความรู้รอบตัว & ปรัชญา (General Knowledge)', icon: Globe },
              { id: 'science', label: 'วิทยาศาสตร์ & การทดลอง (Science & Experiments)', icon: Atom },
              { id: 'space', label: 'ดาราศาสตร์ & ฟิสิกส์อวกาศ (Astrophysics 4K)', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CinemaCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-sm shadow-rose-600/30 ring-1 ring-rose-400/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              setIsAddingNew(true);
              setEditForm({
                id: '',
                title: '',
                category: selectedCategory === 'all' ? 'space' : selectedCategory,
                youtubeUrl: '',
                duration: '10:00',
                channelName: '',
                description: '',
              });
              setIsAdminOpen(true);
            }}
            className="sm:hidden text-xs text-rose-400 font-bold whitespace-nowrap"
          >
            + เพิ่มคลิป
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-emerald-950 border-b border-emerald-500/50 text-emerald-200 px-4 py-2 text-xs flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">SYNCED</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MAIN BODY: 2 COLUMNS (LEFT PLAYER + RIGHT PLAYLIST)                       */}
        {/* ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950">
          {/* ======================================================================= */}
          {/* LEFT COLUMN: YOUTUBE EMBED PLAYER & VIDEO INFO (7-8 COLS)               */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-4">
            {/* 1. YouTube Responsive 16:9 Embed Frame */}
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-black border border-slate-800 shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(activeVideo.youtubeUrl)}
                title={activeVideo.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* 2. Video Title, Channel Credit, & Action Bar */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {(() => {
                      const badge = getCategoryBadge(activeVideo.category);
                      return (
                        <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                          {badge.label}
                        </span>
                      );
                    })()}

                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{activeVideo.duration}</span>
                    </span>

                    {activeVideo.views && (
                      <span className="text-[11px] font-mono text-slate-500">
                        • {activeVideo.views}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {activeVideo.title}
                  </h3>

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                      <Tv className="w-3.5 h-3.5 text-rose-500" />
                      <span>ช่องเจ้าของคลิป: {activeVideo.channelName}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={handleCopyLink}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                    title="คัดลอกลิงก์วิดีโอ"
                  >
                    {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <a
                    href={activeVideo.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/20"
                  >
                    <span>เปิดบน YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Description Box */}
              <div className="space-y-1 text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] font-mono mb-1">
                  คำอธิบายเนื้อหาและสาระสำคัญ:
                </div>
                <p>{activeVideo.description}</p>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: VIDEO PLAYLIST LIST/GRID (4-5 COLS)                        */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between bg-slate-900/90 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 max-h-[82vh] overflow-hidden">
            {/* Playlist Header & Search */}
            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-1.5">
                  <Film className="w-3.5 h-3.5 text-rose-400" />
                  <span>รายการคลิป ({filteredVideos.length} เรื่อง)</span>
                </h4>

                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    setEditForm({
                      id: '',
                      title: '',
                      category: selectedCategory === 'all' ? 'space' : selectedCategory,
                      youtubeUrl: '',
                      duration: '12:00',
                      channelName: '',
                      description: '',
                    });
                    setIsAdminOpen(true);
                  }}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มคลิปใหม่</span>
                </button>
              </div>

              {/* Search Inside Playlist */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ค้นหาชื่อตอน, ชื่อช่อง, หรือเนื้อหา..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder:text-slate-500 outline-hidden font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                  >
                    ล้าง
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Playlist Cards */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredVideos.map((video) => {
                const isActive = video.id === activeVideoId;
                const badge = getCategoryBadge(video.category);
                const thumbUrl = getYouTubeThumbnail(video.youtubeUrl);

                return (
                  <div
                    key={video.id}
                    onClick={() => setActiveVideoId(video.id)}
                    className={`group relative rounded-2xl p-3 border transition-all cursor-pointer flex gap-3 ${
                      isActive
                        ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500/50 shadow-lg shadow-rose-950/50'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-28 h-18 rounded-xl overflow-hidden bg-slate-800 shrink-0 border border-slate-700/80">
                      <img
                        src={thumbUrl}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          // Fallback to placeholder if thumbnail fails
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-7 h-7 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/80 font-mono text-[9px] text-white px-1.5 py-0.2 rounded font-bold">
                        {video.duration}
                      </span>
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${badge.bg}`}>
                            {badge.label}
                          </span>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                          )}
                        </div>

                        <h5 className={`font-bold text-xs line-clamp-2 leading-snug ${isActive ? 'text-rose-200' : 'text-slate-200'}`}>
                          {video.title}
                        </h5>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                        <span className="truncate max-w-[120px] text-slate-300 font-semibold">{video.channelName}</span>
                        {video.views && <span>{video.views}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredVideos.length === 0 && (
                <div className="text-center py-8 text-slate-500 space-y-2">
                  <Film className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-xs font-semibold">ไม่พบคลิปในหมวดนี้</p>
                </div>
              )}
            </div>

            {/* Bottom Quick Credit */}
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex items-center justify-between shrink-0">
              <span>EDTECH 4K HUB</span>
              <span className="text-rose-400 font-bold">SMART CINEMA ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADMIN VIDEO MANAGER MODAL                                                 */}
      {/* ========================================================================= */}
      {isAdminOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 text-white shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-base">
                <Settings className="w-5 h-5 text-rose-400" />
                <span>จัดการคลังวิดีโอ (Admin Video Manager)</span>
              </div>
              <button
                onClick={() => setIsAdminOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form or List Switcher */}
            {isAddingNew || editForm.id ? (
              <form onSubmit={handleSaveVideoForm} className="space-y-3 text-xs overflow-y-auto pr-1 flex-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-rose-300">
                    {isAddingNew ? '➕ เพิ่มวิดีโอใหม่เข้าสู่คลัง' : '✏️ แก้ไขข้อมูลวิดีโอ'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditForm(activeVideo);
                    }}
                    className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    ดูรายการทั้งหมด
                  </button>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 font-bold">
                    ชื่อคลิปวิดีโอ / ตอน (Title)
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold outline-hidden"
                    placeholder="เช่น TIMELAPSE OF THE FUTURE หรือ นิทานดาว"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-mono mb-1 font-bold">
                      หมวดหมู่เนื้อหา
                    </label>
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category: e.target.value as any,
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-semibold outline-hidden"
                    >
                      <option value="tales">นิทาน & วรรณกรรมเยาวชน (Tales)</option>
                      <option value="knowledge">ความรู้รอบตัว & ปรัชญา (Knowledge)</option>
                      <option value="science">วิทยาศาสตร์ & การทดลอง (Science)</option>
                      <option value="space">ดาราศาสตร์ & ฟิสิกส์อวกาศ (Space)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 font-mono mb-1 font-bold">
                      ความยาวคลิป (เช่น 15:30)
                    </label>
                    <input
                      type="text"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono outline-hidden"
                      placeholder="15:30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 font-bold flex items-center gap-1 text-red-400">
                    <Video className="w-3.5 h-3.5" />
                    <span>YouTube URL หรือ Video ID (รองรับทุกช่อง)</span>
                  </label>
                  <input
                    type="text"
                    value={editForm.youtubeUrl}
                    onChange={(e) => setEditForm({ ...editForm, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=VIDEO_ID หรือ youtu.be/ID"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-cyan-300 font-mono outline-hidden"
                    required
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    ตัวอย่าง: https://www.youtube.com/watch?v=uD4izuDMUQA
                  </span>
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 font-bold">
                    ชื่อช่องเจ้าของคลิป (Channel Credit)
                  </label>
                  <input
                    type="text"
                    value={editForm.channelName}
                    onChange={(e) => setEditForm({ ...editForm, channelName: e.target.value })}
                    placeholder="เช่น Melodysheep, Kurzgesagt, NASA, Veritasium, TED-Ed"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-mono mb-1 font-bold">
                    คำอธิบายคลิปย่อ (Description)
                  </label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    placeholder="อธิบายสรุปสาระสำคัญของคลิป..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 outline-hidden"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNew(false);
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>บันทึกวิดีโอ</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">
                    รายการวิดีโอทั้งหมดในระบบ ({videoList.length} เรื่อง)
                  </span>
                  <button
                    onClick={() => {
                      setIsAddingNew(true);
                      setEditForm({
                        id: '',
                        title: '',
                        category: 'space',
                        youtubeUrl: '',
                        duration: '10:00',
                        channelName: '',
                        description: '',
                      });
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>เพิ่มคลิปใหม่</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {videoList.map((vid) => (
                    <div
                      key={vid.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-white truncate flex items-center gap-2">
                          <span>{vid.title}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-rose-300">
                            {vid.category}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {vid.channelName} • {vid.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditForm(vid);
                            setIsAddingNew(false);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="แก้ไขคลิปนี้"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(vid.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/40 text-red-300 hover:text-white"
                          title="ลบคลิปนี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>คืนค่าเริ่มต้น</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsAdminOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
