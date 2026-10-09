import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  Zap,
  Lock,
  Crown,
  Coins,
} from 'lucide-react';
import { Language } from '../types';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  lang: Language;
}

export const PremiumUpgradeModal: React.FC<PremiumUpgradeModalProps> = ({
  isOpen,
  onClose,
  onUpgradeSuccess,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Glowing sci-fi header accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-500 animate-pulse" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Badge & Lock Icon */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-950/90 border border-amber-500/60 text-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/80">
              <Crown className="w-8 h-8 animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-950/60 border border-amber-500/40 text-amber-300">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>PREMIUM ALL-ACCESS REQUIRED</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              ฟีเจอร์นี้สงวนสิทธิ์สำหรับสมาชิก Premium All-Access เท่านั้น
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              เครื่องมือ <strong>PDF Exam Studio (แปลง PDF เป็นไฟล์ข้อสอบด้วย AI)</strong> และบริการพิเศษสำหรับสมาชิกพรีเมียม
            </p>
          </div>

          {/* Premium Feature Highlights */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3 text-xs sm:text-sm">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>สิทธิพิเศษระดับ Premium Commander:</span>
            </div>

            <ul className="space-y-2.5 text-slate-300">
              <li className="flex items-start gap-2">
                <Coins className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span><strong>โควตา 1,000 Cosmic Coins ทันที:</strong> เติมโควตาเหรียญเต็มจำนวนทุกเดือนที่ต่ออายุ</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>แปลงไฟล์ข้อสอบ PDF ไม่จำกัด:</strong> สกัดโจทย์ 20-30 ข้อพร้อมระบบวาดไดอะแกรม SVG</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ปลดล็อกห้องเรียนอัตโนมัติ 100%:</strong> เข้าเรียนได้ทุกวิชาใน LAB 1 โดยไม่ต้องกรอก Class PIN</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>ดาวน์โหลดไฟล์ข้อสอบครบทุกฟอร์แมต:</strong> Word (.docx), PDF คมชัดสูง & LaTeX</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onUpgradeSuccess();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>อัปเกรดเป็นสมาชิกพรีเมียม (รับ 1,000 Coins ทันที)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer transition-all"
            >
              ไว้คราวหลัง (กลับสู่หน้าหลัก)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
