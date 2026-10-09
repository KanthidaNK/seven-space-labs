import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit3,
  Trash2,
  Sparkles,
  Play,
  Users,
  FileText,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  MoveUp,
  MoveDown,
  RotateCcw,
  BookOpen,
  Zap,
  Globe,
  Film,
  Award,
} from 'lucide-react';
import { CadetProfile, ThemeMode, Language } from '../types';

export interface FeaturedCollectionItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  imageUrl: string;
  gradient: string;
  targetLab: number;
  targetMode?: string;
  linkText?: string;
}

export interface TrendingQuizItem {
  id: string;
  title: string;
  creator: string;
  creatorVerified: boolean;
  plays: string;
  questionsCount: number;
  isFree: boolean;
  imageUrl: string;
  targetLab: number;
  targetMode?: 'quiz' | 'flashcard' | 'didyouknow_general' | 'didyouknow_scientists' | 'free' | 'premium';
}

interface KahootSectionsProps {
  theme: ThemeMode;
  lang: Language;
  user: CadetProfile;
  onOpenLab: (labId: number, mode?: any) => void;
}

const DEFAULT_FEATURED: FeaturedCollectionItem[] = [
  {
    id: 'f1',
    title: 'ต้อนรับเปิดเทอม 2026',
    subtitle: 'รวมชุดข้อสอบ & สรุปสูตรฟิสิกส์ ม.4-ม.6 เตรียมสอบกลางภาค',
    badge: 'HOT COLLECTION',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-amber-500 via-orange-500 to-rose-500',
    targetLab: 1,
    linkText: 'เข้าสู่ห้องเรียน',
  },
  {
    id: 'f2',
    title: 'ยินดีต้อนรับสู่ Astro Space Arena',
    subtitle: 'สนามประลองความรู้ดาราศาสตร์สุ่มโจทย์สดพร้อมระบบ Multi-player',
    badge: 'ARENA BATTLE',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-indigo-600 via-purple-600 to-pink-500',
    targetLab: 2,
    targetMode: 'quiz',
    linkText: 'เปิดห้องประลอง',
  },
  {
    id: 'f3',
    title: 'Seven Space Math & Physics Games',
    subtitle: 'เกมจำลองฟิสิกส์คลื่น กลศาสตร์ และแรงดึงดูดด้วย AI Generator',
    badge: 'AI SANDBOX',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-blue-600 via-cyan-600 to-teal-500',
    targetLab: 6,
    linkText: 'เล่นเกมจำลอง',
  },
  {
    id: 'f4',
    title: 'Deep Space Cinema 4K',
    subtitle: 'สารคดีเจาะลึกจักรวาล หลุมดำ และกล้องโทรทรรศน์อวกาศ James Webb',
    badge: '4K STREAM',
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-rose-600 via-purple-700 to-slate-900',
    targetLab: 5,
    linkText: 'ชมภาพยนตร์',
  },
  {
    id: 'f5',
    title: 'ห้องสมุด 3D Flipbook นิทานวิทย์',
    subtitle: 'อ่านหนังสือภาพและการ์ตูน 2 ภาษาพลิกหน้าเสมือนจริง',
    badge: 'FLIPBOOK',
    imageUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?w=800&auto=format&fit=crop&q=80',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    targetLab: 4,
    linkText: 'เปิดห้องสมุด',
  },
];

const DEFAULT_TRENDING: TrendingQuizItem[] = [
  {
    id: 't1',
    title: 'เกร็ดความรู้เรื่องสถานที่สำคัญอันโด่งดังและดาราศาสตร์โลก!',
    creator: 'KStudio_Thai',
    creatorVerified: true,
    plays: '3.9K',
    questionsCount: 11,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'didyouknow_general',
  },
  {
    id: 't2',
    title: 'เซลล์พืชหรือเซลล์สัตว์? ประลองชีววิทยาพื้นฐาน',
    creator: 'KStudio_Thai',
    creatorVerified: true,
    plays: '1.6K',
    questionsCount: 12,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'flashcard',
  },
  {
    id: 't3',
    title: 'การเคลื่อนที่แบบฮาร์มอนิกอย่างง่าย (SHM) และคลื่นกล',
    creator: 'Kru_Earth Astrophysics',
    creatorVerified: true,
    plays: '4.2K',
    questionsCount: 20,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'quiz',
  },
  {
    id: 't4',
    title: 'อันนี้หรืออันนั้น: ของหวานหรือของคาว & สารอาหารวิทยาศาสตร์',
    creator: 'KStudio_Thai',
    creatorVerified: true,
    plays: '1.1K',
    questionsCount: 10,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'didyouknow_general',
  },
  {
    id: 't5',
    title: 'ฟิสิกส์นิวเคลียร์ & ประวัติศาสตร์นักวิทยาศาสตร์เอกของโลก',
    creator: 'Nickelodeon_Thai',
    creatorVerified: true,
    plays: '286',
    questionsCount: 15,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'didyouknow_scientists',
  },
  {
    id: 't6',
    title: 'แรงสู่ศูนย์กลาง & วงโคจรดาวเทียมรอบโลก',
    creator: 'AstroNote Official',
    creatorVerified: true,
    plays: '950',
    questionsCount: 14,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    targetLab: 2,
    targetMode: 'quiz',
  },
  {
    id: 't7',
    title: 'สำรวจอาชีพดาราศาสตร์ & วิศวกรรมอวกาศแห่งอนาคต',
    creator: 'HelloSpace_Thai',
    creatorVerified: true,
    plays: '389',
    questionsCount: 10,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=500&auto=format&fit=crop&q=80',
    targetLab: 7,
  },
  {
    id: 't8',
    title: 'การทำงานเป็นทีมกับการแก้โจทย์ฟิสิกส์ สอวน. ค่าย 1',
    creator: 'Nickelodeon_Thai',
    creatorVerified: true,
    plays: '512',
    questionsCount: 18,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=80',
    targetLab: 3,
    targetMode: 'free',
  },
  {
    id: 't9',
    title: 'แปลงไฟล์ตำราวิชาการเป็นข้อสอบ 20 ข้อด้วย AI Studio',
    creator: 'SevenSpace_Official',
    creatorVerified: true,
    plays: '2.4K',
    questionsCount: 20,
    isFree: true,
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80',
    targetLab: 3,
    targetMode: 'free',
  },
];

export const KahootSections: React.FC<KahootSectionsProps> = ({
  theme,
  lang,
  user,
  onOpenLab,
}) => {
  // Check Admin/Dev permissions
  const isAdminOrDev = Boolean(
    user?.role === 'Admin' ||
    user?.role === 'Developer' ||
    user?.role === 'Premium' ||
    user?.isPremium ||
    (user as any)?.isDeveloperMode ||
    user?.callsign?.toUpperCase().includes('ADMIN') ||
    user?.name?.toLowerCase().includes('admin')
  );

  // State for Featured Collections
  const [featuredItems, setFeaturedItems] = useState<FeaturedCollectionItem[]>(() => {
    try {
      const saved = localStorage.getItem('seven_space_featured_collections_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Load featured collections failed', e);
    }
    return DEFAULT_FEATURED;
  });

  // State for Top Trending Quizzes
  const [trendingItems, setTrendingItems] = useState<TrendingQuizItem[]>(() => {
    try {
      const saved = localStorage.getItem('seven_space_top_trending_quizzes_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Load trending quizzes failed', e);
    }
    return DEFAULT_TRENDING;
  });

  // Carousel ref
  const carouselRef = useRef<HTMLDivElement>(null);

  // Modals state for CMS
  const [editFeaturedModal, setEditFeaturedModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    item: FeaturedCollectionItem;
  }>({
    isOpen: false,
    isNew: false,
    item: DEFAULT_FEATURED[0],
  });

  const [editTrendingModal, setEditTrendingModal] = useState<{
    isOpen: boolean;
    isNew: boolean;
    item: TrendingQuizItem;
  }>({
    isOpen: false,
    isNew: false,
    item: DEFAULT_TRENDING[0],
  });

  // Save to LocalStorage whenever modified
  const saveFeatured = (items: FeaturedCollectionItem[]) => {
    setFeaturedItems(items);
    try {
      localStorage.setItem('seven_space_featured_collections_v1', JSON.stringify(items));
    } catch (e) {
      console.warn('Save featured failed', e);
    }
  };

  const saveTrending = (items: TrendingQuizItem[]) => {
    setTrendingItems(items);
    try {
      localStorage.setItem('seven_space_top_trending_quizzes_v1', JSON.stringify(items));
    } catch (e) {
      console.warn('Save trending failed', e);
    }
  };

  // Carousel scroll helpers
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.75;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Admin handlers for Featured
  const handleAddFeatured = () => {
    setEditFeaturedModal({
      isOpen: true,
      isNew: true,
      item: {
        id: 'f_' + Date.now(),
        title: 'ชุดบทเรียนแนะนำใหม่',
        subtitle: 'คำอธิบายสั้นๆ เกี่ยวกับคอร์สหรือข้อสอบชุดนี้',
        badge: 'NEW',
        imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
        gradient: 'from-indigo-600 via-purple-600 to-pink-500',
        targetLab: 1,
        linkText: 'เข้าชมทันที',
      },
    });
  };

  const handleEditFeatured = (item: FeaturedCollectionItem) => {
    setEditFeaturedModal({
      isOpen: true,
      isNew: false,
      item: { ...item },
    });
  };

  const handleDeleteFeatured = (id: string) => {
    if (window.confirm('คุณต้องการลบแบนเนอร์นี้หรือไม่?')) {
      const filtered = featuredItems.filter((x) => x.id !== id);
      saveFeatured(filtered);
    }
  };

  const handleSaveFeaturedModal = (e: React.FormEvent) => {
    e.preventDefault();
    const item = editFeaturedModal.item;
    if (editFeaturedModal.isNew) {
      saveFeatured([...featuredItems, item]);
    } else {
      saveFeatured(featuredItems.map((x) => (x.id === item.id ? item : x)));
    }
    setEditFeaturedModal({ ...editFeaturedModal, isOpen: false });
  };

  // Admin handlers for Trending
  const handleAddTrending = () => {
    setEditTrendingModal({
      isOpen: true,
      isNew: true,
      item: {
        id: 't_' + Date.now(),
        title: 'ชุดโจทย์ประลองใหม่ล่าสุด',
        creator: user.name || 'SevenSpace_Creator',
        creatorVerified: true,
        plays: '100',
        questionsCount: 10,
        isFree: true,
        imageUrl: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80',
        targetLab: 2,
        targetMode: 'quiz',
      },
    });
  };

  const handleEditTrending = (item: TrendingQuizItem) => {
    setEditTrendingModal({
      isOpen: true,
      isNew: false,
      item: { ...item },
    });
  };

  const handleDeleteTrending = (id: string) => {
    if (window.confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
      const filtered = trendingItems.filter((x) => x.id !== id);
      saveTrending(filtered);
    }
  };

  const handleMoveTrending = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= trendingItems.length) return;
    const updated = [...trendingItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    saveTrending(updated);
  };

  const handleSaveTrendingModal = (e: React.FormEvent) => {
    e.preventDefault();
    const item = editTrendingModal.item;
    if (editTrendingModal.isNew) {
      saveTrending([...trendingItems, item]);
    } else {
      saveTrending(trendingItems.map((x) => (x.id === item.id ? item : x)));
    }
    setEditTrendingModal({ ...editTrendingModal, isOpen: false });
  };

  const handleResetDefaults = () => {
    if (window.confirm('รีเซ็ตเนื้อหาแนะนำและรายการยอดนิยมกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      saveFeatured(DEFAULT_FEATURED);
      saveTrending(DEFAULT_TRENDING);
    }
  };

  return (
    <div className="space-y-10 sm:space-y-12 pt-6">
      {/* ========================================================================= */}
      {/* SECTION 1: เนื้อหาแนะนำ (Featured Collections) - Carousel                  */}
      {/* ========================================================================= */}
      <section className="relative">
        {/* Header with Navigation and Admin Controls */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                เนื้อหาแนะนำ (Featured Collections)
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                {featuredItems.length} แบนเนอร์
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Admin Add Button */}
            {isAdminOrDev && (
              <button
                onClick={handleAddFeatured}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                title="เพิ่มแบนเนอร์ใหม่ (Admin CMS)"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ เพิ่มแบนเนอร์แนะนำ</span>
              </button>
            )}

            {/* Carousel Buttons */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => scrollCarousel('left')}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 shadow-xs flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="เลื่อนซ้าย"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel('right')}
                className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 shadow-xs flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                aria-label="เลื่อนขวา"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Admin Mobile Add Button */}
        {isAdminOrDev && (
          <div className="sm:hidden mb-3">
            <button
              onClick={handleAddFeatured}
              className="w-full py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ เพิ่มแบนเนอร์แนะนำ (Admin)</span>
            </button>
          </div>
        )}

        {/* Horizontal Carousel Track */}
        <div
          ref={carouselRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-none scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {featuredItems.map((item) => (
            <div
              key={item.id}
              className="relative shrink-0 w-[290px] sm:w-[360px] md:w-[420px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 snap-start border border-slate-200 group bg-slate-900 cursor-pointer"
              onClick={() => onOpenLab(item.targetLab, item.targetMode)}
            >
              {/* Background Image with Gradient Overlay */}
              <div className="absolute inset-0 z-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div
                  className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-80 mix-blend-multiply`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              </div>

              {/* Admin Floating Action Icons */}
              {isAdminOrDev && (
                <div
                  className="absolute top-3 right-3 z-30 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md p-1 rounded-xl border border-white/20 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleEditFeatured(item)}
                    className="p-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white transition-colors cursor-pointer"
                    title="แก้ไขแบนเนอร์"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteFeatured(item.id)}
                    className="p-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                    title="ลบแบนเนอร์"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Content Overlay */}
              <div className="relative z-10 p-5 sm:p-6 h-[200px] sm:h-[230px] flex flex-col justify-between text-white">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-white/25 text-white backdrop-blur-xs border border-white/30 shadow-xs">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{item.badge || 'FEATURED'}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold text-white/80 bg-black/30 px-2 py-0.5 rounded">
                      LAB {item.targetLab}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black leading-tight drop-shadow-md line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1 line-clamp-2 leading-relaxed drop-shadow-sm font-medium opacity-90">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-950 font-bold text-xs group-hover:bg-amber-300 transition-colors shadow-sm">
                    <span>{item.linkText || 'เข้าชมทันที'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[11px] font-mono text-white/70">Seven Space Hub</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: รายการยอดนิยม (Top Trending Quizzes) - Numbered Ranking Grid   */}
      {/* ========================================================================= */}
      <section className="relative">
        {/* Header with Admin controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                รายการยอดนิยม (Top Trending Quizzes)
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                🔥 TOP RANK
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminOrDev && (
              <>
                <button
                  onClick={handleAddTrending}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ เพิ่มรายการยอดนิยม</span>
                </button>
                <button
                  onClick={handleResetDefaults}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all cursor-pointer"
                  title="รีเซ็ตกลับเป็นค่าเริ่มต้น"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* 3-Column Ranked Grid (สไตล์ Kahoot: 1, 2, 3 / 4, 5, 6 / 7, 8, 9) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {trendingItems.map((quiz, index) => {
            const rank = index + 1;
            return (
              <div
                key={quiz.id}
                onClick={() => onOpenLab(quiz.targetLab, quiz.targetMode)}
                className="group rounded-2xl p-3 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex items-center gap-3 relative cursor-pointer"
              >
                {/* 1. Large Rank Number */}
                <div className="w-7 sm:w-8 font-black text-2xl sm:text-3xl text-slate-400 group-hover:text-indigo-600 transition-colors text-center shrink-0">
                  {rank}
                </div>

                {/* 2. Thumbnail with Player & Question Overlays */}
                <div className="relative w-24 sm:w-28 h-18 sm:h-20 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200">
                  <img
                    src={quiz.imageUrl}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=500&auto=format&fit=crop&q=80';
                    }}
                  />
                  {/* Badges on Thumbnail */}
                  <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between text-[9px] text-white font-mono bg-slate-950/80 backdrop-blur-xs px-1.5 py-0.5 rounded">
                    <span className="flex items-center gap-0.5">
                      <Users className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{quiz.plays}</span>
                    </span>
                    <span className="flex items-center gap-0.5">
                      <FileText className="w-2.5 h-2.5 text-amber-400" />
                      <span>{quiz.questionsCount} ข้อ</span>
                    </span>
                  </div>
                </div>

                {/* 3. Title & Creator Info */}
                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 font-mono">
                      <Zap className="w-3 h-3 fill-indigo-600" />
                      <span>LAB {quiz.targetLab}</span>
                    </span>
                    {quiz.isFree && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                        ฟรี
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-tight">
                    {quiz.title}
                  </h4>

                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-1 truncate">
                    <span className="truncate">{quiz.creator}</span>
                    {quiz.creatorVerified && (
                      <CheckCircle2 className="w-3 h-3 text-indigo-600 inline shrink-0" />
                    )}
                  </div>
                </div>

                {/* 4. Admin Inline Edit / Delete / Reorder Toolbar */}
                {isAdminOrDev && (
                  <div
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white/95 backdrop-blur-xs p-1 rounded-lg border border-slate-300 shadow-sm z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => handleMoveTrending(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="เลื่อนขึ้น"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveTrending(index, 'down')}
                      disabled={index === trendingItems.length - 1}
                      className="p-1 rounded hover:bg-slate-100 text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="เลื่อนลง"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleEditTrending(quiz)}
                      className="p-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 cursor-pointer"
                      title="แก้ไข"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteTrending(quiz.id)}
                      className="p-1 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                      title="ลบ"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ADMIN CMS MODAL: EDIT/ADD FEATURED BANNER                                 */}
      {/* ========================================================================= */}
      {editFeaturedModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span>
                  {editFeaturedModal.isNew ? 'เพิ่มแบนเนอร์เนื้อหาแนะนำ' : 'แก้ไขแบนเนอร์เนื้อหาแนะนำ'}
                </span>
              </h3>
              <button
                onClick={() => setEditFeaturedModal({ ...editFeaturedModal, isOpen: false })}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFeaturedModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  หัวข้อแบนเนอร์ (Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editFeaturedModal.item.title}
                  onChange={(e) =>
                    setEditFeaturedModal({
                      ...editFeaturedModal,
                      item: { ...editFeaturedModal.item, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white outline-hidden font-bold"
                  placeholder="เช่น ต้อนรับเปิดเทอม 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  คำอธิบายย่อ (Subtitle) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editFeaturedModal.item.subtitle}
                  onChange={(e) =>
                    setEditFeaturedModal({
                      ...editFeaturedModal,
                      item: { ...editFeaturedModal.item, subtitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white outline-hidden"
                  placeholder="คำอธิบายสรุปเนื้อหา 1-2 บรรทัด"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ป้ายกำกับ (Badge)
                  </label>
                  <input
                    type="text"
                    value={editFeaturedModal.item.badge}
                    onChange={(e) =>
                      setEditFeaturedModal({
                        ...editFeaturedModal,
                        item: { ...editFeaturedModal.item, badge: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-mono"
                    placeholder="HOT / NEW / RECOMMEND"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ข้อความปุ่มกด
                  </label>
                  <input
                    type="text"
                    value={editFeaturedModal.item.linkText || ''}
                    onChange={(e) =>
                      setEditFeaturedModal({
                        ...editFeaturedModal,
                        item: { ...editFeaturedModal.item, linkText: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden"
                    placeholder="เข้าสู่ห้องเรียน / เปิดประลอง"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ลิงก์รูปภาพปก (Image URL) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    required
                    value={editFeaturedModal.item.imageUrl}
                    onChange={(e) =>
                      setEditFeaturedModal({
                        ...editFeaturedModal,
                        item: { ...editFeaturedModal.item, imageUrl: e.target.value },
                      })
                    }
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-mono text-[11px]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                {/* Preset image suggestions */}
                <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                  {[
                    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop&q=80',
                  ].map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt="preset"
                      onClick={() =>
                        setEditFeaturedModal({
                          ...editFeaturedModal,
                          item: { ...editFeaturedModal.item, imageUrl: url },
                        })
                      }
                      className="w-12 h-8 object-cover rounded-lg border border-slate-300 hover:border-purple-600 cursor-pointer"
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เป้าหมายโมดูลปลายทาง
                  </label>
                  <select
                    value={editFeaturedModal.item.targetLab}
                    onChange={(e) =>
                      setEditFeaturedModal({
                        ...editFeaturedModal,
                        item: { ...editFeaturedModal.item, targetLab: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold outline-hidden"
                  >
                    <option value={1}>LAB 1: ห้องเรียนออนไลน์ & คลังเอกสาร</option>
                    <option value={2}>LAB 2: ห้องประลองความรู้ (Quiz Arena)</option>
                    <option value={3}>LAB 3: แปลงไฟล์ PDF ออกข้อสอบ AI</option>
                    <option value={4}>LAB 4: Library Hub - คลังหนังสือ 3D</option>
                    <option value={5}>LAB 5: โรงภาพยนตร์ดาราศาสตร์ 4K</option>
                    <option value={6}>LAB 6: คอมมูนิตี้สนามเด็กเล่น</option>
                    <option value={7}>LAB 7: ช่อง Creator Channels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชุดสีธีมไล่ระดับ (Gradient)
                  </label>
                  <select
                    value={editFeaturedModal.item.gradient}
                    onChange={(e) =>
                      setEditFeaturedModal({
                        ...editFeaturedModal,
                        item: { ...editFeaturedModal.item, gradient: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-[11px] outline-hidden"
                  >
                    <option value="from-amber-500 via-orange-500 to-rose-500">Amber / Rose</option>
                    <option value="from-indigo-600 via-purple-600 to-pink-500">Indigo / Purple</option>
                    <option value="from-blue-600 via-cyan-600 to-teal-500">Blue / Teal</option>
                    <option value="from-rose-600 via-purple-700 to-slate-900">Rose / Dark Space</option>
                    <option value="from-emerald-600 via-teal-600 to-cyan-700">Emerald / Cyan</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditFeaturedModal({ ...editFeaturedModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  บันทึกแบนเนอร์ ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN CMS MODAL: EDIT/ADD TOP TRENDING QUIZ                               */}
      {/* ========================================================================= */}
      {editTrendingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                <span>
                  {editTrendingModal.isNew ? 'เพิ่มรายการยอดนิยมใหม่' : 'แก้ไขรายการยอดนิยม'}
                </span>
              </h3>
              <button
                onClick={() => setEditTrendingModal({ ...editTrendingModal, isOpen: false })}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTrendingModal} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ชื่อชุดข้อสอบ/ควิซ (Quiz Title) *
                </label>
                <input
                  type="text"
                  required
                  value={editTrendingModal.item.title}
                  onChange={(e) =>
                    setEditTrendingModal({
                      ...editTrendingModal,
                      item: { ...editTrendingModal.item, title: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white outline-hidden font-bold"
                  placeholder="เช่น กลศาสตร์คลื่น & การเคลื่อนที่ SHM"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อครีเอเตอร์/ช่อง (Creator) *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTrendingModal.item.creator}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, creator: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden"
                    placeholder="เช่น KStudio_Thai"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editTrendingModal.item.creatorVerified}
                      onChange={(e) =>
                        setEditTrendingModal({
                          ...editTrendingModal,
                          item: { ...editTrendingModal.item, creatorVerified: e.target.checked },
                        })
                      }
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>มีเครื่องหมายติ๊กถูก ✓</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ยอดผู้เล่นจำลอง
                  </label>
                  <input
                    type="text"
                    value={editTrendingModal.item.plays}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, plays: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-mono"
                    placeholder="3.9K"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    จำนวนข้อ (Questions)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={editTrendingModal.item.questionsCount}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, questionsCount: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ประเภทข้อสอบ
                  </label>
                  <select
                    value={editTrendingModal.item.isFree ? 'free' : 'pro'}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, isFree: e.target.value === 'free' },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-semibold"
                  >
                    <option value="free">ฟรี (Free)</option>
                    <option value="pro">พรีเมียม (PRO)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  รูปปก Thumbnail URL *
                </label>
                <input
                  type="url"
                  required
                  value={editTrendingModal.item.imageUrl}
                  onChange={(e) =>
                    setEditTrendingModal({
                      ...editTrendingModal,
                      item: { ...editTrendingModal.item, imageUrl: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 outline-hidden font-mono text-[11px]"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    เปิดเข้าสู่แล็บ
                  </label>
                  <select
                    value={editTrendingModal.item.targetLab}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, targetLab: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold outline-hidden"
                  >
                    <option value={2}>LAB 2: ห้องประลองความรู้ (Quiz Arena)</option>
                    <option value={1}>LAB 1: ห้องเรียนออนไลน์ & คลังเอกสาร</option>
                    <option value={3}>LAB 3: แปลงไฟล์ PDF ออกข้อสอบ AI</option>
                    <option value={4}>LAB 4: Library Hub - คลังหนังสือ 3D</option>
                    <option value={5}>LAB 5: โรงภาพยนตร์ดาราศาสตร์ 4K</option>
                    <option value={6}>LAB 6: คอมมูนิตี้สนามเด็กเล่น</option>
                    <option value={7}>LAB 7: ช่อง Creator Channels</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    โหมดการเล่นเริ่มต้น
                  </label>
                  <select
                    value={editTrendingModal.item.targetMode || 'quiz'}
                    onChange={(e) =>
                      setEditTrendingModal({
                        ...editTrendingModal,
                        item: { ...editTrendingModal.item, targetMode: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-semibold outline-hidden"
                  >
                    <option value="quiz">ข้อสอบ 4 ตัวเลือก (Quiz)</option>
                    <option value="flashcard">แฟลชการ์ดวิทยาศาสตร์</option>
                    <option value="didyouknow_general">แฟลชการ์ดความรู้ทั่วไป</option>
                    <option value="didyouknow_scientists">แฟลชการ์ดนักวิทยาศาสตร์</option>
                    <option value="free">โหมดฟรี (PDF Exam)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditTrendingModal({ ...editTrendingModal, isOpen: false })}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  บันทึกรายการ ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
