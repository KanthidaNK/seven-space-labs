import React from 'react';
import { ShieldCheck, Check, X, BookOpen, Clock, AlertTriangle, FileText } from 'lucide-react';
import { LibraryBook } from '../../types/library';

interface AdminModerationPanelProps {
  pendingBooks: LibraryBook[];
  onApprove: (bookId: string) => void;
  onReject: (bookId: string) => void;
  onPreviewBook: (book: LibraryBook) => void;
  onClose?: () => void;
}

export const AdminModerationPanel: React.FC<AdminModerationPanelProps> = ({
  pendingBooks,
  onApprove,
  onReject,
  onPreviewBook,
  onClose,
}) => {
  return (
    <div className="bg-white border border-purple-200 rounded-3xl p-5 sm:p-6 text-slate-800 shadow-md relative overflow-hidden">
      {/* Glow Ambient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-600">
            <ShieldCheck className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <span>Admin Moderation Panel (ระบบคัดกรองหนังสือ)</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 border border-purple-200 font-bold">
                {pendingBooks.length} เล่มรอตรวจสอบ
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              ตรวจสอบเนื้อหา ความถูกต้อง และพิจารณา [อนุมัติ] หรือ [ปฏิเสธ] หนังสือที่ผู้ใช้ส่งเข้ามา
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* List of Pending Books */}
      {pendingBooks.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
            <Check className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">ไม่มีหนังสือที่รอการตรวจสอบ</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            หนังสือทั้งหมดได้รับการคัดกรองและอนุมัติขึ้นสู่ชั้นวางเรียบร้อยแล้ว
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {pendingBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-14 rounded-xl bg-purple-50 border border-purple-200 flex flex-col items-center justify-center text-xl shrink-0 overflow-hidden">
                  {book.coverCanvasUrl || book.coverImage || book.scenes[0]?.imageUrl ? (
                    <img
                      src={book.coverCanvasUrl || book.coverImage || book.scenes[0]?.imageUrl}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-slate-900">{book.title}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" />
                      รอการตรวจสอบ
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {book.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">{book.description}</p>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">
                    ผู้ส่ง: <strong className="text-slate-700">{book.submitterName}</strong> • วันที่ส่ง: {book.submittedAt}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => onPreviewBook(book)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer transition-all border border-slate-300 shadow-xs"
                  title="เปิดดูตัวอย่างหนังสือเล่มนี้"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>ตรวจดู</span>
                </button>

                <button
                  onClick={() => onReject(book.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold cursor-pointer transition-all border border-rose-200"
                  title="ปฏิเสธหนังสือเล่มนี้"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>ปฏิเสธ (Reject)</span>
                </button>

                <button
                  onClick={() => onApprove(book.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-600/20"
                  title="อนุมัติและเผยแพร่ขึ้นชั้นวางทันที"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>อนุมัติ (Approve)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
