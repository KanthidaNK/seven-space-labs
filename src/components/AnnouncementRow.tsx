import React from 'react';
import { ThemeMode, Language, ExamNewsItem } from '../types';
import { TRANSLATIONS } from '../data/translations';

export const INITIAL_EXAM_NEWS: ExamNewsItem[] = [
  {
    id: 'exam-1',
    title: 'เปิดรับสมัครสอบคัดเลือกนักเรียนเข้าอบรมค่าย 1 สอวน. (ฟิสิกส์, เคมี, ดาราศาสตร์) ประจำปีการศึกษา',
    summary: 'สอวน. ประกาศรับสมัครนักเรียนระดับมัธยมศึกษาทั่วประเทศเพื่อสอบคัดเลือกเข้าค่าย 1 สาขาฟิสิกส์ ดาราศาสตร์ และคณิตศาสตร์',
    category: 'สอบคัดเลือก สอวน.',
    sourceUrl: 'https://www.posn.or.th',
    updatedDate: '2026-09-25',
  },
  {
    id: 'exam-2',
    title: 'ประกาศกำหนดการสอบคัดเลือกนักเรียนเข้าศึกษาต่อชั้นมัธยมศึกษาปีที่ 4 โรงเรียนกำเนิดวิทย์ (KVIS) และมหิดลวิทยานุสรณ์',
    summary: 'โรงเรียนวิทยาศาสตร์ชั้นนำของประเทศเปิดรับสมัครนักเรียน ม.3 เข้าศึกษาต่อรอบแรก พร้อมทุนการศึกษาเต็มจำนวน',
    category: 'สอบเข้า ม.4 กำเนิดวิทย์/มหิดล',
    sourceUrl: 'https://www.kvis.ac.th',
    updatedDate: '2026-09-24',
  },
  {
    id: 'exam-3',
    title: 'ระบบ TCAS รอบที่ 1 Portfolio: เกณฑ์การคัดเลือกและโควตาพิเศษสำหรับผู้ชนะการแข่งขันโอลิมปิกวิชาการ',
    summary: 'ทปอ. เผยแพร่ระเบียบการ TCAS รอบ Portfolio สำหรับนักเรียนที่มีผลงานวิชาการและโครงงานวิทยาศาสตร์ระดับชาติ',
    category: 'TCAS',
    sourceUrl: 'https://student.mytcas.com',
    updatedDate: '2026-09-22',
  },
];

interface AnnouncementRowProps {
  theme: ThemeMode;
  lang: Language;
  onOpenModalSection: (section: 'news' | 'exam' | 'leaderboard') => void;
}

export const AnnouncementRow: React.FC<AnnouncementRowProps> = ({
  lang = 'th',
  onOpenModalSection,
}) => {
  const isEn = lang === 'en';

  return (
    <section className="w-full pt-2 pb-2">
      {/* 3. LABS UPDATE (เรียง 3 คอลัมน์เท่ากัน ไร้อิโมจิ หัวข้อไซไฟนีออน ฟ้า-เขียว-ชมพู) */}
      <div className="mb-6">
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase bg-gradient-to-b from-[#8C93A0] via-[#C5CDD9] to-[#FFFFFF] bg-clip-text text-transparent font-kanit select-none">
          LABS UPDATE
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ช่องที่ 1: ปฏิทินสอบ & ข่าวรับสมัคร (นีออนสีฟ้า) */}
        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#38BDF8]/40 transition group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#38BDF8] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></span>
                CALENDAR
              </span>
              <span className="text-[11px] text-white/40 font-mono">OCTOBER</span>
            </div>
            <h3
              data-th="รวมข่าวรับสมัครสอบแข่งขันวิทย์-คณิต & สอบคัดเลือกโรงเรียนชั้นนำ"
              data-en="STEM Competitions, Olympiad & Leading School Admissions"
              className="text-sm font-bold text-white leading-snug group-hover:text-cyan-300 transition-colors"
            >
              {isEn
                ? 'STEM Competitions, Olympiad & Leading School Admissions'
                : 'รวมข่าวรับสมัครสอบแข่งขันวิทย์-คณิต & สอบคัดเลือกโรงเรียนชั้นนำ'}
            </h3>

            <div className="mt-4 space-y-2.5">
              <div 
                onClick={() => onOpenModalSection('exam')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">
                    {isEn ? 'POSN Camp 1 Registration Open' : 'เปิดรับสมัคร สอวน. ค่าย 1'}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {isEn ? 'Physics, Astronomy, Math' : 'ฟิสิกส์ ดาราศาสตร์ คณิตฯ'}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0369A1]/30 text-[#38BDF8] border border-[#38BDF8]/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]">
                  {isEn ? 'POSN' : 'สอวน.'}
                </span>
              </div>

              <div 
                onClick={() => onOpenModalSection('exam')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">
                    {isEn ? 'High School Admission Schedule' : 'กำหนดการสอบเข้า ม.1 & ม.4'}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {isEn ? 'KVIS, MWIT, Science Schools' : 'KVIS, MWIT, กำเนิดวิทย์'}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1E3A8A]/40 text-[#60A5FA] border border-[#3B82F6]/40 shadow-[0_0_8px_rgba(59,130,246,0.25)]">
                  MWIT
                </span>
              </div>

              <div 
                onClick={() => onOpenModalSection('exam')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-semibold text-white">
                    {isEn ? 'Annual TCAS Exam Schedule' : 'ปฏิทิน TCAS ประจำปี'}
                  </div>
                  <div className="text-[10px] text-white/40 mt-0.5">
                    {isEn ? 'A-Level, TPAT3 Direct Exams' : 'A-Level, TPAT3 สนามสอบตรง'}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0284C7]/30 text-[#7DD3FC] border border-[#38BDF8]/40">
                  TCAS
                </span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onOpenModalSection('exam')}
            className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40 cursor-pointer hover:text-white transition"
          >
            <span className="hover:text-white transition">
              {isEn ? 'View all exam schedules →' : 'ดูตารางสอบทั้งหมด →'}
            </span>
            <span>{isEn ? 'POSN / TCAS' : 'สอวน. / TCAS'}</span>
          </div>
        </div>

        {/* ช่องที่ 2: ข่าววิทยาศาสตร์ประจำสัปดาห์ (นีออนสีเขียว) */}
        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#4ADE80]/40 transition group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#4ADE80] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] shadow-[0_0_8px_#4ADE80]"></span>
                SCIENCE RADAR
              </span>
              <span className="text-[11px] text-white/40 font-mono">WEEKLY</span>
            </div>
            <h3
              data-th="สรุปความเคลื่อนไหวด้านฟิสิกส์ดาราศาสตร์และเทคโนโลยีอวกาศ"
              data-en="Weekly Astrophysics & Space Exploration Tech Highlights"
              className="text-sm font-bold text-white leading-snug group-hover:text-green-300 transition-colors"
            >
              {isEn
                ? 'Weekly Astrophysics & Space Exploration Tech Highlights'
                : 'สรุปความเคลื่อนไหวด้านฟิสิกส์ดาราศาสตร์และเทคโนโลยีอวกาศ'}
            </h3>

            <div className="mt-4 space-y-2.5">
              <div 
                onClick={() => onOpenModalSection('news')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/15 transition"
              >
                <div className="text-xs font-semibold text-white">
                  {isEn
                    ? 'James Webb Telescope detects exoplanet atmosphere'
                    : 'กล้อง James Webb ตรวจพบชั้นบรรยากาศดาวนอกระบบ'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#14532D]/40 text-[#4ADE80] border border-[#22C55E]/40 shadow-[0_0_8px_rgba(34,197,94,0.2)]">
                    JWST
                  </span>
                  <span className="text-[10px] text-white/40">
                    {isEn ? '2h ago' : '2 ชม. ที่แล้ว'}
                  </span>
                </div>
              </div>

              <div 
                onClick={() => onOpenModalSection('news')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/15 transition"
              >
                <div className="text-xs font-semibold text-white">
                  {isEn
                    ? 'National Observatory releases newborn star cluster images'
                    : 'หอดูดาวแห่งชาติเปิดภาพถ่ายกระจุกดาวฤกษ์เกิดใหม่'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#166534]/30 text-[#86EFAC] border border-[#4ADE80]/40">
                    OBSERVATORY
                  </span>
                  <span className="text-[10px] text-white/40">
                    {isEn ? '5h ago' : '5 ชม. ที่แล้ว'}
                  </span>
                </div>
              </div>

              <div 
                onClick={() => onOpenModalSection('news')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:border-white/15 transition"
              >
                <div className="text-xs font-semibold text-white">
                  {isEn
                    ? 'NASA announces Artemis mission progress timeline'
                    : 'NASA ประกาศไทม์ไลน์ความคืบหน้าภารกิจ Artemis'}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#14532D]/40 text-[#4ADE80] border border-[#22C55E]/40">
                    NASA
                  </span>
                  <span className="text-[10px] text-white/40">
                    {isEn ? '1d ago' : '1 วันที่แล้ว'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onOpenModalSection('news')}
            className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40 cursor-pointer hover:text-white transition"
          >
            <span className="hover:text-white transition">
              {isEn ? 'Read all articles →' : 'อ่านบทความทั้งหมด →'}
            </span>
            <span>DEEP SPACE</span>
          </div>
        </div>

        {/* ช่องที่ 3: ทำเนียบดาวเด่นประจำสัปดาห์ (นีออนสีชมพู) */}
        <div className="bg-[#121214] border border-[#222226] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#F472B6]/40 transition group">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-[#F472B6] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F472B6] shadow-[0_0_8px_#F472B6]"></span>
                HALL OF FAME
              </span>
              <span className="text-[11px] text-white/40 font-mono">● LIVE</span>
            </div>
            <h3
              data-th="ทำเนียบผู้นำคะแนนและผู้สร้างคอนเทนต์ยอดนิยมรอบสัปดาห์"
              data-en="Honor Board: Top Scorers & Featured Content Creators"
              className="text-sm font-bold text-white leading-snug group-hover:text-pink-300 transition-colors"
            >
              {isEn
                ? 'Honor Board: Top Scorers & Featured Content Creators'
                : 'ทำเนียบผู้นำคะแนนและผู้สร้างคอนเทนต์ยอดนิยมรอบสัปดาห์'}
            </h3>

            <div className="mt-4 space-y-2.5">
              <div 
                onClick={() => onOpenModalSection('leaderboard')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-xs font-mono text-white">C</div>
                  <div>
                    <div className="text-xs font-semibold text-white">Cadet_Nova</div>
                    <div className="text-[10px] text-white/40">
                      {isEn ? 'Physics Master • 42 hrs' : 'Physics Master • 42 ชม.'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white">9,850 PTS</span>
              </div>

              <div 
                onClick={() => onOpenModalSection('leaderboard')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-xs font-mono text-white">L</div>
                  <div>
                    <div className="text-xs font-semibold text-white">Luna_Orbital</div>
                    <div className="text-[10px] text-white/40">
                      {isEn ? 'Astro Explorer • 38 hrs' : 'Astro Explorer • 38 ชม.'}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-white">9,420 PTS</span>
              </div>

              <div 
                onClick={() => onOpenModalSection('leaderboard')}
                className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between hover:border-white/15 cursor-pointer transition"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-white/5 flex items-center justify-center text-xs font-mono text-white">K</div>
                  <div>
                    <div className="text-xs font-semibold text-white">Creator Kru_Earth</div>
                    <div className="text-[10px] text-white/40">
                      {isEn ? 'Astrophysics Contributor' : 'ผู้สร้างคอนเทนต์ดาราศาสตร์ฟิสิกส์'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-[#F472B6] bg-[#831843]/30 px-2 py-0.5 rounded border border-[#F472B6]/40 shadow-[0_0_8px_rgba(244,114,182,0.3)]">
                  RANK #1
                </span>
              </div>
            </div>
          </div>

          <div 
            onClick={() => onOpenModalSection('leaderboard')}
            className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-white/40 cursor-pointer hover:text-white transition"
          >
            <span className="hover:text-white transition">
              {isEn ? 'View full leaderboard →' : 'ดูทำเนียบทั้งหมด →'}
            </span>
            <span>TOP CADETS</span>
          </div>
        </div>
      </div>
    </section>
  );
};
