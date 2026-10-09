import React, { useState, useRef, useEffect } from 'react';
import { Language } from '../types';
import { TRENDING_CARDS_I18N } from '../data/translations';

export type IconType = 'flask' | 'lightning' | 'book' | 'orbit' | 'atom' | 'dna' | 'rocket' | 'brain';

export interface TrendingCardItem {
  id: string;
  title: string;
  lab: string;
  color: string;
  iconType: IconType;
}

interface TrendingLabsCarouselProps {
  lang?: Language;
  onOpenLab: (labId: number, mode?: any) => void;
}

// 3. ไอคอนประจำการ์ดมุมขวาบน (SVG Minimalist Line Icons ขนาด 20px พร้อมเอฟเฟกต์ Neon Glow สีเดียวกับการ์ด)
const renderSvgLineIcon = (type: IconType) => {
  switch (type) {
    case 'flask':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </svg>
      );
    case 'lightning':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'book':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      );
    case 'orbit':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)" />
        </svg>
      );
    case 'atom':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(0 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'dna':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 15c6.667-6 13.333 0 20-6" />
          <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
          <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
          <path d="M17 6l-2.5-2.5" />
          <path d="M14 8l-1-1" />
          <path d="M7 18l2.5 2.5" />
          <path d="M10 16l1 1" />
        </svg>
      );
    case 'rocket':
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
          <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-1.5 5-1.5" />
          <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 1.5-5 1.5-5" />
        </svg>
      );
    case 'brain':
    default:
      return (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-2.04" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-2.04" />
        </svg>
      );
  }
};

const DEFAULT_ROW_TOP: TrendingCardItem[] = [
  { id: 't1', title: 'การ์ดความรู้เรื่องสถานที่สำคัญโรมันโบราณ และตำนานดาว', lab: 'LAB 7', color: '#A855F7', iconType: 'orbit' },
  { id: 't2', title: 'เซลล์พืชหรือเซลล์สัตว์? แยกให้ออกใน 30 วินาที', lab: 'LAB 2', color: '#22C55E', iconType: 'dna' },
  { id: 't3', title: 'อันนี้หรืออันนั้น_ของหวานหรือของคาว', lab: 'LAB 7', color: '#EF4444', iconType: 'flask' },
  { id: 't4', title: 'แรงสู่ศูนย์กลาง & วงโคจรดาวเทียมรอบโลก', lab: 'LAB 1', color: '#06B6D4', iconType: 'lightning' },
  { id: 't5', title: 'เทอร์โมไดนามิกส์และเอนโทรปีในห้วงจักรวาล', lab: 'LAB 1', color: '#38BDF8', iconType: 'atom' },
  { id: 't6', title: 'โครงสร้างพันธุศาสตร์และวิวัฒนาการสิ่งมีชีวิต', lab: 'LAB 2', color: '#10B981', iconType: 'dna' },
  { id: 't7', title: 'ประวัติศาสตร์อารยธรรมและโบราณคดีอวกาศ', lab: 'LAB 7', color: '#C084FC', iconType: 'book' },
];

const DEFAULT_ROW_BOTTOM: TrendingCardItem[] = [
  { id: 'b1', title: 'แปลงไฟล์ตำราวิชาการเป็นข้อสอบ 20 ข้อด้วย AI', lab: 'LAB 3', color: '#F59E0B', iconType: 'brain' },
  { id: 'b2', title: 'สำรวจอาชีพดาราศาสตร์ & วิศวกรรมอวกาศ', lab: 'LAB 7', color: '#10B981', iconType: 'rocket' },
  { id: 'b3', title: 'ฟิสิกส์นิวเคลียร์ & ประวัตินักวิทย์ก้องโลก', lab: 'LAB 7', color: '#FB923C', iconType: 'atom' },
  { id: 'b4', title: 'สมุดภาพฟลิปบุ๊ก 3D กลุ่มดาวจักรราศี', lab: 'LAB 4', color: '#EC4899', iconType: 'book' },
  { id: 'b5', title: 'โมเดลทำนายการเคลื่อนที่ของดาวหางด้วย Machine Learning', lab: 'LAB 3', color: '#EAB308', iconType: 'brain' },
  { id: 'b6', title: 'การจำลองกลศาสตร์ควอนตัมบนเว็บเบราว์เซอร์', lab: 'LAB 1', color: '#6366F1', iconType: 'lightning' },
  { id: 'b7', title: 'สารานุกรมระบบสุริยะและการสำรวจดาวอังคาร', lab: 'LAB 4', color: '#F43F5E', iconType: 'rocket' },
];

// 1. Step Size: ความกว้างการ์ด (350px) + gap (18px) = 368px
const STEP_SIZE = 368;
// ขอบเขตการเลื่อนแบบสมมาตร (Symmetric Free-Flow Range) ไม่ล็อกที่ 0 รองรับทั้งค่าลบและบวกเพื่อให้อ่านการ์ดได้เต็มทุกใบ
const RANGE = 1200;

export const TrendingLabsCarousel: React.FC<TrendingLabsCarouselProps> = ({
  lang = 'th',
  onOpenLab,
}) => {
  const isEn = lang === 'en';

  const getCardTitle = (card: TrendingCardItem) => {
    if (TRENDING_CARDS_I18N[card.id]) {
      return isEn ? TRENDING_CARDS_I18N[card.id].en : TRENDING_CARDS_I18N[card.id].th;
    }
    return card.title;
  };
  // 1. scrollOffset เริ่มต้นเป็น 0
  const [scrollOffset, setScrollOffset] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number>(0);

  // Admin Mode state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [editingCard, setEditingCard] = useState<TrendingCardItem | null>(null);
  const [isAddingToTop, setIsAddingToTop] = useState<boolean | null>(null);

  // Cards State with LocalStorage persistence
  const [rowTop, setRowTop] = useState<TrendingCardItem[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_trending_top_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ROW_TOP;
  });

  const [rowBottom, setRowBottom] = useState<TrendingCardItem[]>(() => {
    try {
      const saved = localStorage.getItem('ssl_trending_bottom_v4');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_ROW_BOTTOM;
  });

  useEffect(() => {
    try {
      localStorage.setItem('ssl_trending_top_v4', JSON.stringify(rowTop));
    } catch (e) {}
  }, [rowTop]);

  useEffect(() => {
    try {
      localStorage.setItem('ssl_trending_bottom_v4', JSON.stringify(rowBottom));
    } catch (e) {}
  }, [rowBottom]);

  // 1. ปุ่ม [ → ] (ไปข้างหน้า): เพิ่ม offset ขึ้นครั้งละ 296px (เท่ากับความกว้างการ์ด + gap) ภายในช่วงสมมาตร
  const handleScrollForward = () => {
    setScrollOffset((prev) => Math.max(-RANGE, Math.min(RANGE, prev + STEP_SIZE)));
  };

  // 2. ปุ่ม [ ← ] (ย้อนกลับ): ลด offset ลงครั้งละ 296px ด้วยอัตราเท่ากันเป๊ะ ไม่ล็อกที่ 0 เลื่อนกลับมาอ่านข้อความได้ครบถ้วน
  const handleScrollBackward = () => {
    setScrollOffset((prev) => Math.max(-RANGE, Math.min(RANGE, prev - STEP_SIZE)));
  };

  // 3. การหมุนลูกกลิ้งเมาส์ (Mouse Wheel): คำนวณ deltaY * 0.45 ภายในช่วงสมมาตร [-RANGE, RANGE]
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaY;
    setScrollOffset((prev) => Math.max(-RANGE, Math.min(RANGE, prev + delta * 0.45)));
  };

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentX = e.touches[0].clientX;
    const diff = touchStartXRef.current - currentX;
    setScrollOffset((prev) => Math.max(-RANGE, Math.min(RANGE, prev + diff * 0.8)));
    touchStartXRef.current = currentX;
  };

  // Delete card handler
  const handleDeleteCard = (id: string, isTop: boolean) => {
    if (isTop) {
      setRowTop((prev) => prev.filter((item) => item.id !== id));
    } else {
      setRowBottom((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Add card handler
  const handleOpenAddModal = (isTop: boolean) => {
    const newCard: TrendingCardItem = {
      id: Date.now().toString(),
      title: 'หัวข้อใหม่ // คลิกเพื่อเปิดแล็บ',
      lab: isTop ? 'LAB 7' : 'LAB 3',
      color: isTop ? '#38BDF8' : '#A855F7',
      iconType: 'flask',
    };
    setIsAddingToTop(isTop);
    setEditingCard(newCard);
  };

  // Save edit handler
  const handleSaveCard = () => {
    if (!editingCard) return;
    if (isAddingToTop !== null) {
      if (isAddingToTop) {
        setRowTop((prev) => [...prev, editingCard]);
      } else {
        setRowBottom((prev) => [...prev, editingCard]);
      }
      setIsAddingToTop(null);
    } else {
      setRowTop((prev) => prev.map((item) => (item.id === editingCard.id ? editingCard : item)));
      setRowBottom((prev) => prev.map((item) => (item.id === editingCard.id ? editingCard : item)));
    }
    setEditingCard(null);
  };

  const handleCardClick = (card: TrendingCardItem) => {
    const match = card.lab.match(/\d+/);
    const labId = match ? parseInt(match[0], 10) : 7;
    onOpenLab(labId);
  };

  // 3. ดีไซน์การ์ดแก้วนีนอน (Glass Neon Glow):
  //    - background: radial-gradient(circle at 50% 0%, ${color}12, rgba(14, 14, 18, 0.85))
  //    - ขอบการ์ด: เส้นขอบนีออนแบบนุ่มนวล ความโปร่งแสงประมาณ 30-40% (${color}66) พร้อมเงาเรืองแสงด้านใน inset 0 0 12px ${color}18
  //    - ไอคอนมุมขวาบน: ใช้ไอคอนสีนีออนชุดเดียวกับสีการ์ดและป้าย LAB
  const renderCard = (card: TrendingCardItem, isTop: boolean, uniqueKey: string) => (
    <div
      key={uniqueKey}
      onClick={() => handleCardClick(card)}
      style={{
        background: `radial-gradient(circle at 50% 0%, ${card.color}12, rgba(14, 14, 18, 0.85))`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderWidth: '1.5px',
        borderStyle: 'solid',
        borderColor: `${card.color}66`,
        boxShadow: `0 0 24px ${card.color}26, 0 8px 32px rgba(0, 0, 0, 0.5), inset 0 0 14px ${card.color}18`,
      }}
      className="w-[340px] sm:w-[350px] min-h-[215px] h-[220px] shrink-0 rounded-2xl md:rounded-3xl p-6 flex flex-col justify-between relative group transition-all duration-300 hover:scale-[1.03] cursor-pointer select-none"
    >
      {/* ส่วนบนของการ์ด: แถบแอดมิน + ไอคอนประจำการ์ดมุมขวาบนสีนีออนชุดเดียวกับสีการ์ดและป้าย LAB */}
      <div className="flex items-start justify-between w-full">
        <div />

        <div className="flex items-center gap-2">
          {isAdmin && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 bg-black/85 backdrop-blur-md px-2 py-1 rounded-lg border border-white/20 shadow-lg"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAddingToTop(null);
                  setEditingCard(card);
                }}
                className="w-6 h-6 flex items-center justify-center text-amber-400 hover:text-amber-300 hover:bg-white/10 rounded transition cursor-pointer"
                title="แก้ไขหัวข้อและแล็บ"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCard(card.id, isTop);
                }}
                className="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-white/10 rounded transition cursor-pointer"
                title="ลบการ์ดใบนี้"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          )}

          {/* 3. ไอคอนมุมขวาบน: ใช้ไอคอนสีนีออนชุดเดียวกับสีการ์ดและป้าย LAB */}
          <div
            style={{
              backgroundColor: `${card.color}15`,
              borderColor: `${card.color}66`,
              color: card.color,
              boxShadow: `0 0 14px ${card.color}35, inset 0 0 10px ${card.color}20`,
            }}
            className="w-10 h-10 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-110 shrink-0"
          >
            <div style={{ filter: `drop-shadow(0 0 6px ${card.color})` }}>
              {renderSvgLineIcon(card.iconType)}
            </div>
          </div>
        </div>
      </div>

      {/* Card Title (Scale-up Inner Content) */}
      <h4
        data-th={TRENDING_CARDS_I18N[card.id]?.th || card.title}
        data-en={TRENDING_CARDS_I18N[card.id]?.en || card.title}
        className="text-base md:text-[17px] font-bold text-white leading-snug my-auto line-clamp-3 group-hover:text-white transition-colors font-kanit drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
      >
        {getCardTitle(card)}
      </h4>

      {/* Card Lab Tag - Bottom Left: เข้าชุดกับสีกรอบและไอคอนเรืองแสง 100% */}
      <div className="pt-2 flex items-center justify-between">
        <span
          style={{
            backgroundColor: `${card.color}18`,
            borderColor: `${card.color}80`,
            color: card.color,
            boxShadow: `0 0 12px ${card.color}35`,
          }}
          className="px-3.5 py-1.5 rounded-lg text-xs md:text-[12px] font-mono font-bold border tracking-wider uppercase"
        >
          {card.lab}
        </span>
      </div>
    </div>
  );

  // สร้างชุดการ์ดวนซ้ำ 25 ชุด โดยจัดตำแหน่งกึ่งกลาง (Center Index = 12)
  // รองรับการเลื่อนไปทางขวา (ข้างหน้า) และทางซ้าย (ถอยหลัง) ได้ต่อเนื่องเรื่อยๆ อย่างไม่มีที่สิ้นสุด
  const REPEAT_COUNT = 25;
  const CENTER_INDEX = 12;
  const repeatedRowTop = Array(REPEAT_COUNT).fill(rowTop).flat();
  const repeatedRowBottom = Array(REPEAT_COUNT).fill(rowBottom).flat();
  const rowTopBaseOffset = -(rowTop.length * CENTER_INDEX * STEP_SIZE);
  const rowBottomBaseOffset = -(rowBottom.length * CENTER_INDEX * STEP_SIZE);

  return (
    <section
      id="trending"
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="w-full pt-2 pb-2 overflow-hidden select-none scroll-mt-24"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent font-kanit select-none">
            TRENDING LABS
          </h2>

          {/* Admin Mode Toggle Button */}
          <button
            onClick={() => setIsAdmin((prev) => !prev)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
              isAdmin
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                : 'bg-[#121214] text-white/40 border-white/10 hover:text-white hover:border-white/30'
            }`}
          >
            {isAdmin ? 'ADMIN ACTIVE' : 'ADMIN MODE'}
          </button>

          {/* [+ ADD TREND] Buttons */}
          {isAdmin && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <button
                onClick={() => handleOpenAddModal(true)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold border border-white/20 hover:border-white/40 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span> {isEn ? 'ADD TREND (Top Row)' : 'ADD TREND (แถวบน)'}
              </button>
              <button
                onClick={() => handleOpenAddModal(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold border border-white/20 hover:border-white/40 shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>+</span> {isEn ? 'ADD TREND (Bottom Row)' : 'ADD TREND (แถวล่าง)'}
              </button>
            </div>
          )}
        </div>

        {/* ปุ่ม SCROLL [ ← ] และ [ → ]: ปรากฏตลอด เลื่อนสลับตำแหน่งได้เรื่อยๆ ทั้ง 2 ฝั่งเหมือนกัน 100% */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs text-white/50 font-mono tracking-widest uppercase">
            SCROLL
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleScrollBackward}
              title="เลื่อนไปทางซ้าย (368px)"
              aria-label="Scroll left"
              className="w-9 h-9 rounded-xl bg-[#121216] border border-white/15 text-white/80 hover:text-white hover:border-white/35 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center text-sm font-mono transition-all cursor-pointer active:scale-90 shadow-lg"
            >
              ←
            </button>
            <button
              onClick={handleScrollForward}
              title="เลื่อนไปทางขวา (368px)"
              aria-label="Scroll right"
              className="w-9 h-9 rounded-xl bg-[#121216] border border-white/15 text-white/80 hover:text-white hover:border-white/35 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] flex items-center justify-center text-sm font-mono transition-all cursor-pointer active:scale-90 shadow-lg"
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Rows Container */}
      <div className="space-y-4 overflow-hidden">
        {/* แถวบน: เคลื่อนที่ไปทางขวาตามค่า scrollOffset (transition 0.35s cubic-bezier) */}
        <div
          style={{
            transform: `translate3d(${rowTopBaseOffset + scrollOffset}px, 0, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="flex gap-4 w-max will-change-transform"
        >
          {repeatedRowTop.map((card, idx) => renderCard(card, true, `top-${card.id}-${idx}`))}
        </div>

        {/* แถวล่าง: เคลื่อนที่สวนทางไปทางซ้ายตามค่า -scrollOffset (transition 0.35s cubic-bezier) */}
        <div
          style={{
            transform: `translate3d(${rowBottomBaseOffset - scrollOffset}px, 0, 0)`,
            transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
          }}
          className="flex gap-4 w-max will-change-transform"
        >
          {repeatedRowBottom.map((card, idx) => renderCard(card, false, `btm-${card.id}-${idx}`))}
        </div>
      </div>

      {/* Modal แก้ไข/เพิ่มการ์ดสำหรับแอดมิน */}
      {editingCard && (
        <div
          onClick={() => setEditingCard(null)}
          className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121214] border border-white/20 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 font-kanit">
                <span className="text-amber-400">✎</span> {isAddingToTop !== null ? 'เพิ่มการ์ดใหม่ (ADMIN)' : 'แก้ไขข้อมูลการ์ด (ADMIN)'}
              </h3>
              <button
                onClick={() => setEditingCard(null)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1 font-mono">ชื่อหัวข้อการ์ด</label>
              <textarea
                value={editingCard.title}
                onChange={(e) => setEditingCard({ ...editingCard, title: e.target.value })}
                className="w-full bg-black/60 border border-white/20 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                rows={3}
                placeholder="กรอกชื่อหัวข้อ..."
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-white/50 block mb-1 font-mono">สังกัดแล็บ (เช่น LAB 1, LAB 7)</label>
                <input
                  type="text"
                  value={editingCard.lab}
                  onChange={(e) => setEditingCard({ ...editingCard, lab: e.target.value })}
                  className="w-full bg-black/60 border border-white/20 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400 font-mono transition"
                  placeholder="LAB 7"
                />
              </div>

              <div>
                <label className="text-xs text-white/50 block mb-1 font-mono">ไอคอนลายเส้น (SVG)</label>
                <select
                  value={editingCard.iconType}
                  onChange={(e) => setEditingCard({ ...editingCard, iconType: e.target.value as IconType })}
                  className="w-full bg-[#1A1A1E] border border-white/20 rounded-xl p-2.5 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                >
                  <option value="orbit">วงโคจรดาราศาสตร์ (Orbit)</option>
                  <option value="dna">สายเกลียวเซลล์ (DNA)</option>
                  <option value="flask">หลอดทดลอง (Flask)</option>
                  <option value="lightning">สายฟ้า (Lightning)</option>
                  <option value="brain">สมองกล AI (Brain)</option>
                  <option value="rocket">จรวดอวกาศ (Rocket)</option>
                  <option value="atom">อะตอมฟิสิกส์ (Atom)</option>
                  <option value="book">หนังสือ (Book)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white/50 block mb-1 font-mono">สีขอบนีออน & ไอคอนเรืองแสง</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={editingCard.color || '#38BDF8'}
                  onChange={(e) => setEditingCard({ ...editingCard, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-white/20 bg-transparent cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={editingCard.color}
                  onChange={(e) => setEditingCard({ ...editingCard, color: e.target.value })}
                  className="flex-1 bg-black/60 border border-white/20 rounded-xl p-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
              <button
                onClick={() => setEditingCard(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleSaveCard}
                className="px-5 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs hover:bg-amber-300 transition shadow-[0_0_15px_rgba(245,158,11,0.4)] cursor-pointer"
              >
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
