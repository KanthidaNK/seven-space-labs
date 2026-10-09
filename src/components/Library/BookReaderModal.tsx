import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  ArrowRight,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';
import { LibraryBook, BookScene } from '../../types/library';
import { PdfCanvasReader } from './PdfCanvasReader';

interface BookReaderModalProps {
  book: LibraryBook | null;
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: (book: LibraryBook) => void;
}

export const BookReaderModal: React.FC<BookReaderModalProps> = ({
  book,
  isOpen,
  onClose,
  onDownloadPdf,
}) => {
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfNumPages, setPdfNumPages] = useState<number>(book?.totalPages || 1);

  useEffect(() => {
    setCurrentPageNum(1);
    if (book) {
      setPdfNumPages(book.totalPages || 1);
    }
  }, [book?.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen || !book) return;
    const maxPages = book.bookType === 'pdf' ? pdfNumPages : book.scenes.length;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        setCurrentPageNum((prev) => Math.min(maxPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPageNum((prev) => Math.max(1, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, book, pdfNumPages, onClose]);

  if (!isOpen || !book) return null;

  const isPdf = book.bookType === 'pdf' && !!book.pdfBlobUrl;
  const totalPages = isPdf ? pdfNumPages : book.scenes.length;
  const currentScene: BookScene | undefined = !isPdf ? book.scenes[currentPageNum - 1] : undefined;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full ${
          isFullscreen ? 'max-w-none h-full' : 'max-w-5xl h-[92vh]'
        } rounded-3xl bg-[#EEF1F6] text-slate-900 shadow-2xl border border-slate-300/80 flex flex-col overflow-hidden transition-all duration-300 font-sans`}
      >
        {/* Top Control Bar */}
        <div className="px-4 py-3 bg-white/95 border-b border-slate-200/90 flex items-center justify-between backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700">
              <BookOpen className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-md">
                  {book.title} {book.titleEn && book.titleEn !== book.title ? `(${book.titleEn})` : ''}
                </h3>
                <span className="hidden sm:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {book.author}
                </span>
                {isPdf && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                    PDF.js High-DPI
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-serif">
                {isPdf
                  ? `โหมดเปิดอ่านไฟล์ PDF จริงผ่าน PDF.js (หน้า ${currentPageNum} จาก ${totalPages})`
                  : `โหมดเปิดอ่านสองหน้า HTML & รูปภาพแท้จริง (หน้า ${currentPageNum} จาก ${totalPages})`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownloadPdf(book)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="ดาวน์โหลดไฟล์ PDF ของหนังสือเล่มนี้"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ดาวน์โหลด PDF</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title={isFullscreen ? 'ย่อหน้าต่าง' : 'เต็มจอ'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close"
              title="ปิดหน้าต่างอ่าน"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Book Reading Container */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 flex items-center justify-center bg-[#EEF1F6]">
          {isPdf ? (
            /* ========================================================= */
            /* TAB B: PDF Rendering Mode via Mozilla PDF.js Canvas       */
            /* ========================================================= */
            <div className="w-full h-full flex flex-col items-center justify-center">
              <PdfCanvasReader
                pdfBlobUrl={book.pdfBlobUrl!}
                currentPage={currentPageNum}
                scale={1.85}
                onNumPages={(num) => setPdfNumPages(num)}
              />
            </div>
          ) : (
            /* ========================================================= */
            /* TAB A: HTML + Real Image Assets 2-Page Spread             */
            /* ========================================================= */
            <div className="w-full max-w-4xl bg-[#FBF9F3] rounded-2xl shadow-[0_15px_45px_rgba(15,23,42,0.18)] border border-amber-900/15 overflow-hidden flex flex-col md:flex-row relative min-h-[460px] sm:min-h-[500px]">
              {/* Center Spine Shadow Effect */}
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 pointer-events-none z-20 bg-gradient-to-r from-black/15 via-black/5 to-black/15" />
              <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1.5px] pointer-events-none z-30 bg-amber-900/25" />

              {/* Left Page: Real Image Illustration */}
              <div className="w-full md:w-1/2 bg-amber-50/40 relative flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-amber-900/10 min-h-[260px] md:min-h-full">
                <div className="absolute top-0 bottom-0 right-0 w-6 bg-gradient-to-l from-black/5 to-transparent pointer-events-none z-10" />

                <div className="flex-1 w-full h-full flex items-center justify-center p-3 sm:p-5 relative">
                  {currentScene?.imageUrl ? (
                    <div className="w-full h-full max-h-[380px] flex items-center justify-center rounded-xl overflow-hidden shadow-inner border border-amber-900/15 bg-white relative">
                      <img
                        src={currentScene.imageUrl}
                        alt={currentScene.title || 'Illustration'}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full min-h-[280px] max-h-[380px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 p-6 text-center">
                      <ImageIcon className="w-10 h-10 text-amber-500 mb-2 opacity-70" />
                      <span className="text-xs font-bold text-amber-900 font-mono">
                        {currentScene?.imageFileName || 'image.png'}
                      </span>
                      <span className="text-[11px] text-amber-700/80 mt-1 max-w-xs">
                        ยังไม่ได้แนบไฟล์รูปภาพชื่อนี้ในระบบ
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-5 py-2.5 flex items-center justify-between text-[11px] text-amber-900/60 font-serif border-t border-amber-900/5 bg-amber-50/50">
                  <span className="truncate max-w-[180px]">{book.title}</span>
                  <span className="font-mono text-xs font-semibold text-amber-900">
                    {currentScene?.isCover ? 'หน้าปก (Cover)' : `หน้าซ้ายภาพวาด`}
                  </span>
                </div>
              </div>

              {/* Right Page: Real Text from HTML */}
              <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between relative bg-[#FBF9F3]">
                <div className="absolute top-0 bottom-0 left-0 w-6 bg-gradient-to-r from-black/5 to-transparent pointer-events-none z-10 hidden md:block" />

                <div className="space-y-4">
                  {/* Header */}
                  <div className="border-b border-amber-900/15 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        {currentScene?.title || `ฉากที่ ${currentPageNum}`}
                      </span>
                      {currentScene?.conceptTag && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-medium">
                          {currentScene.conceptTag}
                        </span>
                      )}
                    </div>
                  </div>

                  {currentScene?.isCover ? (
                    <div className="space-y-3 py-1">
                      <div>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-amber-800 font-bold block mb-1">
                          นิทานอีสปฉบับพิเศษ • 2 ภาษา (Bilingual Edition)
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
                          {book.title}
                        </h2>
                        {book.titleEn && book.titleEn !== book.title && (
                          <h3 className="text-base sm:text-lg font-semibold text-slate-600 font-serif italic">
                            {book.titleEn}
                          </h3>
                        )}
                        <div className="mt-1 text-xs font-mono text-slate-500 font-semibold">
                          ลิขสิทธิ์ / จัดทำโดย: <span className="text-amber-900">{currentScene.copyrightText || book.author}</span>
                        </div>
                      </div>

                      <div className="border-b-2 border-dashed border-amber-300/80 my-2" />

                      {currentScene.thaiText && (
                        <p className="text-sm sm:text-base leading-relaxed text-slate-800 font-serif">
                          {currentScene.thaiText}
                        </p>
                      )}

                      {currentScene.englishText && (
                        <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-serif italic">
                          {currentScene.englishText}
                        </p>
                      )}

                      {totalPages > 1 && (
                        <div className="pt-2">
                          <button
                            onClick={() => setCurrentPageNum(2)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-600/20"
                          >
                            <span>เริ่มอ่านฉากที่ 1 (Start Reading)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* Thai Text */}
                      {currentScene?.thaiText && (
                        <div>
                          <p className="text-base sm:text-lg leading-relaxed text-slate-900 font-serif font-medium indent-6">
                            {currentScene.thaiText}
                          </p>
                        </div>
                      )}

                      {/* Divider */}
                      {currentScene?.thaiText && currentScene?.englishText && (
                        <div className="relative py-1">
                          <div className="border-b-2 border-dashed border-amber-300/80" />
                          <span className="absolute left-1/2 -translate-x-1/2 -top-2 px-2 bg-[#FBF9F3] text-[9px] font-mono text-amber-700 uppercase tracking-widest">
                            English Translation
                          </span>
                        </div>
                      )}

                      {/* English Text */}
                      {currentScene?.englishText && (
                        <div>
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-700 font-serif italic indent-6">
                            {currentScene.englishText}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-amber-900/10 pt-3 mt-4 flex items-center justify-between text-xs text-amber-900/70 font-mono">
                  <span>{book.author}</span>
                  <span className="font-bold text-amber-950 text-sm">
                    หน้า {currentPageNum} / {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Slide & Navigation Bar */}
        <div className="px-4 py-3 bg-white/95 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Previous Scene Button */}
          <button
            onClick={() => setCurrentPageNum((prev) => Math.max(1, prev - 1))}
            disabled={currentPageNum === 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>← หน้าก่อนหน้า</span>
          </button>

          {/* Quick Scene Dots / Page Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPageNum(num)}
                className={`min-w-7 h-7 px-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center justify-center ${
                  num === currentPageNum
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {num === 1 && !isPdf ? 'ปก' : num}
              </button>
            ))}
            <span className="text-xs font-mono text-slate-500 ml-2">
              (หน้า {currentPageNum} / {totalPages})
            </span>
          </div>

          {/* Next Scene Button */}
          <button
            onClick={() => setCurrentPageNum((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPageNum >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:pointer-events-none text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <span>หน้าถัดไป →</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
