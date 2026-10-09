import React, { useState, useEffect } from 'react';
import { Check, X, MessageCircle, Copy, CheckCheck, ExternalLink, QrCode } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

// คีย์เฟรมและสไตล์สำหรับแอนิเมชันลอยแบบ Smooth 3D Floating
const animationStyles = `
@keyframes floatSlow1 {
  0%, 100% { transform: translateY(0px) rotate(-12deg); }
  50% { transform: translateY(-16px) rotate(-8deg); }
}
@keyframes floatSlow2 {
  0%, 100% { transform: translateY(0px) rotate(12deg); }
  50% { transform: translateY(-20px) rotate(16deg); }
}
@keyframes floatSlow3 {
  0%, 100% { transform: translateY(0px) rotate(6deg); }
  50% { transform: translateY(-14px) rotate(2deg); }
}
@keyframes floatSlow4 {
  0%, 100% { transform: translateY(0px) rotate(-12deg); }
  50% { transform: translateY(-18px) rotate(-6deg); }
}

.animate-float-1 { animation: floatSlow1 5s ease-in-out infinite; }
.animate-float-2 { animation: floatSlow2 6.5s ease-in-out infinite; }
.animate-float-3 { animation: floatSlow3 5.5s ease-in-out infinite; }
.animate-float-4 { animation: floatSlow4 7s ease-in-out infinite; }
`;

interface AboutMeProps {
  aboutText?: string;
  onUpdateAboutText?: (text: string) => void;
  lineId?: string;
  lineUrl?: string;
  lang?: Language;
}

export default function AboutMe({
  aboutText = 'Seven Space Labs คือศูนย์กลางการเรียนรู้และระบบปฏิบัติการดิจิทัลแห่งอนาคต ที่ผสานฟิสิกส์ วิทยาศาสตร์ และเทคโนโลยี EdTech เข้าไว้ด้วยกัน ออกแบบมาเพื่อยกระดับศักยภาพของผู้เรียนและนักสร้างสรรค์ ผ่านสื่อการสอนอินเทอร์แอ็กทีฟ คลังความรู้ และเครื่องมือปัญญาประดิษฐ์ระดับโปรดักชัน',
  onUpdateAboutText,
  lineId: initialLineId = '@sevenspacelabs',
  lineUrl: initialLineUrl = '',
  lang = 'th',
}: AboutMeProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const [currentLineId, setCurrentLineId] = useState<string>(initialLineId);
  const [currentLineUrl, setCurrentLineUrl] = useState<string>(initialLineUrl);

  useEffect(() => {
    try {
      const savedContact = localStorage.getItem('ABOUT_ME_LINE_DATA');
      if (savedContact) {
        const parsed = JSON.parse(savedContact);
        if (parsed.lineId) setCurrentLineId(parsed.lineId);
        if (parsed.lineUrl !== undefined) setCurrentLineUrl(parsed.lineUrl);
      }
    } catch (e) {
      console.warn('Failed to load contact data', e);
    }
  }, []);

  const handleCopyLineId = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentLineId);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = currentLineId;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2500);
    } catch (e) {
      console.warn('Failed to copy line ID', e);
    }
  };

  const handleSaveChanges = () => {
    try {
      if (onUpdateAboutText) {
        onUpdateAboutText(aboutText);
      }
      localStorage.setItem('ABOUT_ME_DATA', aboutText);
      localStorage.setItem(
        'ABOUT_ME_LINE_DATA',
        JSON.stringify({ lineId: currentLineId, lineUrl: currentLineUrl })
      );
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2500);
    } catch (e) {
      console.warn('Failed to save ABOUT_ME_DATA', e);
    }
  };

  const hasValidLineUrl = currentLineUrl && currentLineUrl.trim().startsWith('https://');

  return (
    <section className="relative w-full bg-[#000000] py-14 md:py-20 px-6 overflow-hidden border-t border-white/5" id="about-section">
      <style>{animationStyles}</style>

      {/* 1. หลอดแก้วบนซ้าย - Tube Cyan */}
      <div className="absolute top-10 left-4 md:top-16 md:left-24 z-10 pointer-events-none select-none animate-float-1">
        <img
          src="tube_cyan_final.jpg"
          alt="Cyan Flask 3D"
          className="w-24 md:w-36 h-auto mix-blend-screen drop-shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        />
      </div>

      {/* 2. บีกเกอร์บนขวา - Tube Green */}
      <div className="absolute top-8 right-4 md:top-12 md:right-28 z-10 pointer-events-none select-none animate-float-2">
        <img
          src="tube_green_final.jpg"
          alt="Green Beaker 3D"
          className="w-24 md:w-36 h-auto mix-blend-screen drop-shadow-[0_0_20px_rgba(34,197,94,0.4)]"
        />
      </div>

      {/* 3. ขวดแก้วก้นกลมล่างซ้าย - Tube Pink */}
      <div className="absolute bottom-10 left-6 md:bottom-16 md:left-28 z-10 pointer-events-none select-none animate-float-3">
        <img
          src="tube_pink_final.jpg"
          alt="Pink Round Flask 3D"
          className="w-24 md:w-36 h-auto mix-blend-screen drop-shadow-[0_0_20px_rgba(236,72,153,0.4)]"
        />
      </div>

      {/* 4. หลอดทดลองยาวล่างขวา - Tube Purple */}
      <div className="absolute bottom-8 right-6 md:bottom-14 md:right-24 z-10 pointer-events-none select-none animate-float-4">
        <img
          src="tube_purple_clean.jpg"
          alt="Purple Test Tube 3D"
          className="w-16 md:w-24 h-auto mix-blend-screen drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]"
        />
      </div>

      {/* บล็อกเนื้อหาตรงกลาง */}
      <div className="relative z-20 max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        {/* แถวหัวข้อและปุ่ม Admin/Edit Controls */}
        <div className="flex flex-col items-center gap-3">
          {/* หัวข้อ ABOUT ME สไตล์ Metallic Silver-White */}
          <h2 className="text-5xl md:text-8xl font-black font-sans tracking-tight uppercase bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent select-none">
            ABOUT ME
          </h2>

          {/* ปุ่มควบคุมโหมดแก้ไขข้อความ (EDIT TEXT / SAVE CHANGES) */}
          <div className="flex items-center gap-2.5 mt-2">
            <button
              type="button"
              onClick={() => setIsEditing((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                  : 'bg-white/[0.04] text-white/40 border-white/10 hover:text-white hover:border-white/30 hover:bg-white/[0.08]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isEditing
                    ? 'bg-amber-400 animate-pulse shadow-[0_0_6px_#F59E0B]'
                    : 'bg-white/30'
                }`}
              />
              <span>{isEditing ? 'EDITING' : 'EDIT TEXT'}</span>
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={handleSaveChanges}
                className={`bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-mono font-bold tracking-wider px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.3)] hover:shadow-[0_0_18px_rgba(16,185,129,0.5)] cursor-pointer animate-fadeIn active:scale-95 ${
                  isSaved
                    ? 'bg-emerald-500/40 text-white border-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                    : ''
                }`}
                title="บันทึกข้อความลง Central State และ LocalStorage ถาวร"
              >
                <Check
                  className={`w-3.5 h-3.5 transition-transform ${
                    isSaved ? 'scale-125 text-white' : 'text-emerald-400'
                  }`}
                />
                <span>{isSaved ? 'SAVED!' : 'SAVE CHANGES'}</span>
              </button>
            )}
          </div>
        </div>

        {/* ย่อหน้าอธิบายตัวตน หรือ textarea สำหรับแก้ไข */}
        <div className="w-full max-w-2xl mt-6 mb-8 text-center flex flex-col items-center">
          {isEditing ? (
            <div className="w-full text-left space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono text-emerald-400 mb-1">
                  ABOUT ME DESCRIPTION:
                </label>
                <textarea
                  value={aboutText}
                  onChange={(e) => {
                    e.stopPropagation();
                    onUpdateAboutText?.(e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  placeholder="พิมพ์ข้อความแนะนำตัว..."
                  rows={4}
                  className="w-full bg-black/90 text-white border border-dashed border-emerald-400/80 rounded-lg p-3 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-y relative z-50 pointer-events-auto select-text font-kanit leading-relaxed transition-all shadow-2xl whitespace-pre-wrap"
                />
              </div>

              {/* การตั้งค่า LINE Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    LINE ID (สำหรับปุ่มคัดลอก):
                  </label>
                  <input
                    type="text"
                    value={currentLineId}
                    onChange={(e) => setCurrentLineId(e.target.value)}
                    placeholder="@sevenspacelabs"
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-white/70 mb-1">
                    LINE DIRECT URL (เช่น https://lin.ee/... หรือเว้นว่างไว้เพื่อใช้ปุ่ม Copy):
                  </label>
                  <input
                    type="url"
                    value={currentLineUrl}
                    onChange={(e) => setCurrentLineUrl(e.target.value)}
                    placeholder="https://lin.ee/..."
                    className="w-full bg-black/80 border border-white/20 rounded-lg px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <p className="text-[11px] text-white/40 font-mono select-none">
                * กดปุ่ม SAVE CHANGES ด้านบนเพื่อบันทึกข้อมูลถาวร
              </p>
            </div>
          ) : (
            <p
              data-th={aboutText}
              data-en={TRANSLATIONS.en.aboutMe.defaultBio}
              className="text-white/60 text-base md:text-lg font-sans leading-relaxed tracking-wide text-center select-none w-full whitespace-pre-line"
            >
              {lang === 'en' ? TRANSLATIONS.en.aboutMe.defaultBio : aboutText}
            </p>
          )}
        </div>

        {/* ปุ่ม CONTACT ME สไตล์ขอบนีออนไล่เฉดสีม่วง-ชมพู พร้อมฟังก์ชันคลิกเปิด Pop-up Modal */}
        <button
          type="button"
          onClick={() => setIsContactOpen(true)}
          className="inline-flex items-center justify-center rounded-full px-8 py-3.5 border border-fuchsia-500/50 bg-gradient-to-r from-purple-900/30 to-pink-900/30 text-white font-mono text-xs md:text-sm font-bold tracking-widest uppercase hover:scale-105 hover:border-fuchsia-400 hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all cursor-pointer backdrop-blur-md active:scale-95"
        >
          CONTACT ME
        </button>
      </div>

      {/* 2. โครงสร้างและดีไซน์ Pop-up Modal (Glassmorphism & Cyber Glow) */}
      {isContactOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setIsContactOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-fadeIn"
        >
          {/* กล่องคอนเทนต์ตรงกลาง (Modal Box) */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#0d0d16] border border-emerald-500/40 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-[0_0_50px_rgba(16,185,129,0.25)] flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200"
          >
            {/* ปุ่มปิด (Close Button) */}
            <button
              type="button"
              onClick={() => setIsContactOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* ส่วนหัว: สถานะเขียวกระพริบ + แท็ก OFFICIAL CONTACT + ชื่อ Seven Space Labs */}
            <div className="flex items-center justify-center font-mono text-xs text-emerald-400 tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block mr-2 shadow-[0_0_8px_#34d399]" />
              OFFICIAL CONTACT // LINE OA
            </div>
            <h3 className="font-bold text-xl text-white mt-1 mb-4 tracking-wide">
              Seven Space Labs
            </h3>

            {/* ส่วนแสดง QR Code */}
            <div className="p-3 bg-white rounded-2xl shadow-lg inline-block">
              <img
                src="image.png"
                alt="Seven Space Labs LINE Official QR Code"
                className="w-48 h-48 md:w-52 md:h-52 object-contain"
              />
            </div>
            <p className="text-white/60 text-xs mt-3 mb-4">
              {lang === 'en'
                ? 'Scan QR Code to connect or inquire via LINE'
                : 'สแกน QR Code เพื่อติดต่อหรือสอบถามผ่าน LINE'}
            </p>

            {/* ปุ่มลิงก์ หรือ ปุ่มคัดลอก LINE ID (ป้องกันหน้า Error: Unable to add friend) */}
            {hasValidLineUrl ? (
              <a
                href={currentLineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-black text-black" />
                <span>OPEN IN LINE APP</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleCopyLineId}
                className={`w-full py-2.5 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md ${
                  isCopied
                    ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.6)]'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                }`}
                title="คัดลอก LINE ID เพื่อนำไปค้นหาในแอป LINE"
              >
                {isCopied ? (
                  <>
                    <CheckCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>COPIED LINE ID!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>COPY LINE ID ({currentLineId})</span>
                  </>
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 mt-2.5 text-[11px] font-mono text-white/50 select-none">
              <span>LINE ID:</span>
              <span className="text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-white/[0.06] border border-emerald-500/20">
                {currentLineId}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
