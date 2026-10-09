import React, { useState, useRef } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { ThemeMode, Language, CadetProfile } from '../types';

const TRANSPARENT_PANDA_URL =
  'https://cdn.fbsbx.com/v/t65.102178-21/836328980_991758740622393_3987408269858052767_n.jpg/panda_transparent_final.png?_nc_ht=cdn.fbsbx.com&_nc_ohc=-yoqVApUY3EQ7kNvwF-1ItI&sdl=0&ccb=14-4&oh=00_AQPcPSKWEka38rZT2gEJdcdhH0nTwtozz7Y70hueddLqXg&oe=6AC379A0&_nc_sid=4ee932';

const GRAVITASK_LOGO_8K_URL =
  'https://cdn.fbsbx.com/v/t65.102178-21/840093772_2616763055427631_4123801940364677371_n.jpg/logo_G_8K_transparent.png?_nc_ht=cdn.fbsbx.com&_nc_ohc=u_DZJXIYsm8Q7kNvwFS8Ad_&sdl=0&ccb=14-4&oh=00_AQNTXqh1fUit4_1RFKhwC0TSyBnovDgx0ixr4e4ysiCiBg&oe=6AED615C&_nc_sid=4ee932';

/**
 * 3D Interactive Space Panda Mascot Component
 * - Displays the real transparent space panda mascot PNG without dark background
 * - Automatic Zero-G floating up & down animation (animate-mascot-float)
 * - Interactive 3D Perspective Tilt Parallax tracking mouse/touch pointer
 * - Multi-layered atmospheric cosmic purple & fuchsia glow
 * - Dynamic neon glow drop shadow drop-shadow-[0_0_25px_rgba(168,85,247,0.35)]
 * - Direct image file drag-and-drop replacement with /api/upload-mascot sync
 */
export const SpacePanda3DParallax: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('custom_mascot_image');
      if (saved) return saved;
    } catch {}
    return TRANSPARENT_PANDA_URL;
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (e.clientX - centerX) / (rect.width / 2);
    const normY = (e.clientY - centerY) / (rect.height / 2);

    // Inverted Y rotation for natural 3D tilt perspective
    setTilt({
      x: -normY * 18, // max +/- 18 deg
      y: normX * 22,  // max +/- 22 deg
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const normX = (touch.clientX - centerX) / (rect.width / 2);
    const normY = (touch.clientY - centerY) / (rect.height / 2);

    setTilt({
      x: -normY * 18,
      y: normX * 22,
    });
  };

  const handleTouchEnd = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  // Drag and drop image file directly onto the mascot to update
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        setImgSrc(dataUrl);
        try {
          localStorage.setItem('custom_mascot_image', dataUrl);
          await fetch('/api/upload-mascot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ dataUrl }),
          });
        } catch (err) {
          console.warn('Could not sync mascot to server', err);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* 3D Perspective Canvas Container */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative w-[380px] sm:w-[480px] md:w-[546px] lg:w-[572px] aspect-square flex items-center justify-center cursor-pointer group"
        style={{ perspective: '1200px' }}
      >
        {/* Layer 0: Deep Atmospheric Ambient Glow Aura (shifts in subtle counter-parallax) */}
        <div
          className="absolute w-[330px] h-[330px] sm:w-[416px] sm:h-[416px] md:w-[546px] md:h-[546px] rounded-full bg-gradient-to-tr from-[#7C3AED]/40 via-[#B600A8]/30 to-cyan-500/20 blur-[65px] pointer-events-none transition-transform duration-500 ease-out animate-orbital-aura"
          style={{
            transform: `translate3d(${-tilt.y * 1.1}px, ${tilt.x * 1.1}px, -40px)`,
          }}
        />

        {/* Layer 1: Floating & 3D Tilting Parent Wrapper */}
        <div
          className="relative w-full h-full flex items-center justify-center animate-mascot-float"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.05 : 1})`,
            transition: isHovered
              ? 'transform 0.12s ease-out'
              : 'transform 0.65s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          {/* Layer 2: Real Transparent Space Panda Mascot Image */}
          <div
            className="relative z-10 w-full h-full aspect-square flex items-center justify-center"
            style={{
              transform: 'translateZ(35px)',
            }}
          >
            <img
              src={imgSrc}
              alt="Space Panda Mascot"
              className="w-full h-full object-contain pointer-events-none transition-all duration-300 filter drop-shadow-[0_0_30px_rgba(168,85,247,0.4)] drop-shadow-[0_20px_40px_rgba(0,0,0,0.85)]"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.triedTransparent) {
                  target.dataset.triedTransparent = 'true';
                  target.src = '/panda_transparent_final.png';
                } else if (!target.dataset.triedFinalPng) {
                  target.dataset.triedFinalPng = 'true';
                  target.src = '/panda_final.png';
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface HeroBannerProps {
  theme: ThemeMode;
  lang: Language;
  cadet: CadetProfile;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenRankDashboard?: () => void;
  onExploreLabs?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ lang = 'th' }) => {
  return (
    <section id="hero-section" className="relative min-h-[95vh] flex flex-col items-center justify-between text-center px-6 pt-10 pb-8 bg-[#0C0C0C] overflow-hidden w-full scroll-mt-20">
      {/* 1. Main Center: SEVEN SPACE LABS Title + Panda Mascot */}
      <div className="my-auto flex flex-col items-center justify-center text-center z-10 select-none pt-2">
        {/* ข้อความหัวข้อ SEVEN SPACE LABS ตรงกลางเป๊ะ (ขยายขนาดขึ้นอีก 30%) */}
        <h1 className="text-[clamp(4.25rem,11vw,155px)] font-black tracking-[-0.04em] leading-[0.85] uppercase text-center bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent drop-shadow-[0_24px_48px_rgba(0,0,0,0.9)] font-kanit">
          <span className="block">SEVEN SPACE</span>
          <span className="block mt-1">LABS</span>
        </h1>

        {/* รูปแพนด้าอวกาศ อยู่ตรงกลางใต้หัวข้ออย่างสมบูรณ์ (ขยายขนาดขึ้นอีก 30%) */}
        <div className="relative flex justify-center items-center mt-10 sm:mt-14 md:mt-16 mb-6 z-20 mx-auto">
          <div className="w-[440px] md:w-[580px] aspect-square rounded-full bg-gradient-to-tr from-[#7C3AED]/25 to-[#B600A8]/20 blur-[80px] absolute pointer-events-none" />
          <SpacePanda3DParallax />
        </div>
      </div>

      {/* 2. Bottom Row: คำโปรยชิดมุมซ้ายล่าง & การ์ด GraviTask ชิดมุมขวาล่าง */}
      <div className="w-full max-w-[1400px] mx-auto z-10 px-4 sm:px-6 mt-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
        {/* ข้อความคำโปรย 2 บรรทัด ชิดมุมซ้ายล่างตำแหน่งเดิม (รองรับทั้ง TH และ EN) */}
        <div className="text-left select-none">
          <p
            data-th="SEVEN SPACE LABS แหล่งเรียนรู้ EDTECH ยุคใหม่ ขับเคลื่อนเพื่อสร้าง ประสบการณ์การเรียนรู้ที่ดีกว่า"
            data-en="SEVEN SPACE LABS AN EDTECH SPACE DRIVEN TO CREATE BETTER LEARNING EXPERIENCES"
            className="text-[#8E8E93] text-xs md:text-sm font-medium tracking-wider uppercase leading-snug"
          >
            {lang === 'th' ? (
              <>
                SEVEN SPACE LABS แหล่งเรียนรู้ EDTECH ยุคใหม่ ขับเคลื่อนเพื่อสร้าง <br />
                ประสบการณ์การเรียนรู้ที่ดีกว่า
              </>
            ) : (
              <>
                SEVEN SPACE LABS AN EDTECH SPACE DRIVEN TO CREATE <br />
                BETTER LEARNING EXPERIENCES
              </>
            )}
          </p>
        </div>

        {/* ตัวแอป GraviTask ขนาดกะทัดรัด วางที่มุมขวาล่าง */}
        <div className="sm:ml-auto select-none">
          <a
            href="https://gravitask.pages.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-fit group cursor-pointer"
            title={lang === 'th' ? 'เข้าสู่ GraviTask Workspace' : 'Enter GraviTask Workspace'}
          >
            <div className="relative rounded-2xl p-3.5 pr-5 bg-[#0a0a14]/85 backdrop-blur-xl border border-cyan-500/30 group-hover:border-cyan-400/60 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-105 overflow-hidden text-left w-fit">
              {/* Subtle ambient glow */}
              <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/25 transition-all duration-500" />
              <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-purple-500/15 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/25 transition-all duration-500" />

              <div className="flex items-center gap-3.5 relative z-10 w-fit">
                {/* โลโก้ตัว G (logo_G_8K_transparent.png) 8K คมชัด พร้อมแอนิเมชันลอยแบบนุ่มนวล ±4px */}
                <div className="w-10 h-10 md:w-11 md:h-11 shrink-0 rounded-xl p-0.5 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-400/30 group-hover:border-cyan-400/70 transition-all drop-shadow-[0_0_12px_rgba(6,182,212,0.5)] flex items-center justify-center animate-float-g">
                  <img
                    src="/logo-g.png"
                    alt="GraviTask 8K Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.tried8kUrl) {
                        target.dataset.tried8kUrl = 'true';
                        target.src = GRAVITASK_LOGO_8K_URL;
                      } else {
                        target.src = '/logo_G_8K_transparent.png';
                      }
                    }}
                  />
                </div>

                {/* ข้อความ WORKSPACE + GraviTask */}
                <div className="flex flex-col whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1.5 shadow-[0_0_6px_#34d399]" />
                    <span
                      data-th="พื้นที่ทำงาน"
                      data-en="WORKSPACE"
                      className="font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase font-bold"
                    >
                      {lang === 'th' ? 'พื้นที่ทำงาน' : 'WORKSPACE'}
                    </span>
                  </div>
                  <h2 className="font-black text-lg md:text-xl text-white group-hover:text-cyan-300 transition-colors font-kanit mt-0.5 tracking-tight leading-none">
                    GraviTask
                  </h2>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};
