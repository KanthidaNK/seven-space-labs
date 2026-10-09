import React from 'react';
import { X, ShieldAlert, Crown, ArrowRight } from 'lucide-react';

interface ArenaPermissionGuardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userRole?: string;
  onOpenUpgrade?: () => void;
}

export const ArenaPermissionGuardModal: React.FC<ArenaPermissionGuardModalProps> = ({
  isOpen,
  onClose,
  userName = 'Cadet_Nova',
  userRole = 'Free',
  onOpenUpgrade,
}) => {
  if (!isOpen) return null;

  const isStudent = userRole === 'Student';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-7 text-center overflow-hidden">
        {/* Ambient Cosmic Glow */}
        <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-44 h-44 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-950/50">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Status Tag */}
        <div className="inline-block px-3 py-1 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-300 font-mono text-[11px] font-bold uppercase tracking-wider mb-3">
          จำกัดสิทธิ์การใช้งาน • Access Restricted
        </div>

        {/* Main Alert Message */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 leading-snug">
          ฟีเจอร์นี้เปิดให้เฉพาะสมาชิก Premium และ Admin เท่านั้น
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          ระบบจัดการและสร้างโหมดประลอง (Admin Mode Studio) รวมถึงฟังก์ชันแก้ไขและลบโหมด สงวนสิทธิ์สำหรับบัญชีผู้ดูแลระบบ (Admin) หรือสมาชิกสถานะ Premium (เช่น บัญชี Cadet_Nova ที่มีป้าย PREMIUM) เท่านั้น เพื่อรักษามาตรฐานความถูกต้องของโจทย์
        </p>

        {/* Current User Status Panel */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left mb-6 text-xs space-y-2">
          <div className="flex justify-between items-center text-slate-400">
            <span>บัญชีผู้ใช้ปัจจุบัน:</span>
            <span className="font-semibold text-white">{userName}</span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>สถานะบัญชี:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
              isStudent
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-800 text-slate-300 border border-slate-700'
            }`}>
              {isStudent ? 'STUDENT (สิทธิ์นักเรียน)' : 'FREE USER (ผู้ใช้งานทั่วไป)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {onOpenUpgrade && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenUpgrade();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs shadow-md shadow-amber-900/40 transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Crown className="w-3.5 h-3.5" />
              <span>อัปเกรดเป็น Premium</span>
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
