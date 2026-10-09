import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CoreSystemsListProps {
  onOpenLab: (labId: number, mode?: any) => void;
}

export const CoreSystemsList: React.FC<CoreSystemsListProps> = ({ onOpenLab }) => {
  const coreSystems = [
    { num: '01', title: 'PHYSICS VAULT & CLASSROOM', desc: 'ห้องเรียนออนไลน์ & คลังเอกสารฟิสิกส์', labId: 1 },
    { num: '02', title: 'QUIZ ARENA & SPEEDRUN', desc: 'ห้องประลองความรู้และโหมดจับเวลา', labId: 2 },
    { num: '03', title: 'PDF EXAM AI PILOT STUDIO', desc: 'สถานีแปลง PDF ออกข้อสอบ AI', labId: 3 },
    { num: '04', title: 'CELESTIAL FLIPBOOK LIBRARY', desc: 'ห้องสมุดนิทานดวงดาวและหนังสือเรียน', labId: 4 },
    { num: '05', title: 'EDTECH CINEMA HUB', desc: 'โรงภาพยนตร์สื่อการเรียนรู้มัลติมีเดีย', labId: 5 },
    { num: '06', title: 'COSMIC PLAYGROUND LOUNGE', desc: 'ศูนย์กลางกิจกรรมและสังคมผู้เรียน', labId: 6 },
    { num: '07', title: 'CREATOR SPACE HUB & CHANNEL', desc: 'สถานีชีทสรุปและผลงานผู้สอน', labId: 7 },
  ];

  return (
    <section className="w-full py-4 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <h2 className="text-sm font-mono font-bold text-slate-300 tracking-widest uppercase flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Sequence 5 // Core Systems List (01 — 07)</span>
        </h2>
        <span className="text-[11px] font-mono text-slate-500">7 ACTIVE COMMAND LABS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {coreSystems.map((item) => (
          <div
            key={item.num}
            onClick={() => onOpenLab(item.labId)}
            className="rounded-2xl p-3.5 bg-[#111113] border border-[#222222] hover:border-purple-500/60 hover:bg-slate-900/90 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-700 group-hover:text-purple-400 transition-colors block">
                {item.num}
              </span>
              <div className="font-bold text-xs text-white font-kanit mt-2 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </div>
              <div className="text-[10px] text-slate-400 font-light line-clamp-1 mt-0.5">
                {item.desc}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 group-hover:text-slate-300">
              <span>ENTER LAB</span>
              <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
