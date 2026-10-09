import React, { useState, useEffect } from 'react';
import {
  X,
  BookOpen,
  Download,
  Plus,
  ShieldCheck,
  User,
  Search,
  Check,
  Clock,
  Sparkles,
  BookMarked,
  Filter,
  Eye,
  RefreshCw,
  Library,
  Trash2,
  AlertTriangle,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Language } from '../../types';
import { LibraryBook, UserRole } from '../../types/library';
import { initialLibraryBooks } from '../../data/initialLibraryBooks';
import { BookReaderModal } from '../Library/BookReaderModal';
import { BookUploadModal } from '../Library/BookUploadModal';
import { AdminModerationPanel } from '../Library/AdminModerationPanel';
import { generateBookPdf } from '../../utils/libraryPdfGenerator';

interface Lab4FlipbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const Lab4FlipbookModal: React.FC<Lab4FlipbookModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  // Books state persisted with localStorage
  const [books, setBooks] = useState<LibraryBook[]>(() => {
    try {
      const saved = localStorage.getItem('library_hub_books_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Check if tortoise-hare-xero has all 7 pages with cover spread
          const tortoise = parsed.find((b: LibraryBook) => b.id === 'tortoise-hare-xero');
          if (!tortoise || tortoise.scenes.length < 7 || !tortoise.scenes[0]?.isCover) {
            // Upgrade or inject full 7 scenes from initialLibraryBooks
            const updated = parsed.map((b: LibraryBook) =>
              b.id === 'tortoise-hare-xero' ? initialLibraryBooks[0] : b
            );
            return updated;
          }
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return initialLibraryBooks;
  });

  // Current active user role (Cadet vs Admin)
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('cadet');

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [readingBook, setReadingBook] = useState<LibraryBook | null>(null);
  const [isReaderOpen, setIsReaderOpen] = useState<boolean>(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);
  const [bookToDelete, setBookToDelete] = useState<LibraryBook | null>(null);

  // PDF Exporting progress
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [exportProgressMsg, setExportProgressMsg] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    try {
      localStorage.setItem('library_hub_books_v2', JSON.stringify(books));
    } catch (e) {
      console.error('Failed to save library books to localStorage:', e);
    }
  }, [books]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (!isOpen) return null;

  // Actions
  const handleApproveBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: 'published' } : b))
    );
    showToast('อนุมัติหนังสือเรียบร้อยแล้ว! พร้อมแสดงบนชั้นวางสาธารณะ', 'success');
  };

  const handleRejectBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, status: 'rejected' } : b))
    );
    showToast('ปฏิเสธการเผยแพร่หนังสือดังกล่าวแล้ว', 'info');
  };

  const handleConfirmDelete = () => {
    if (!bookToDelete) return;
    const targetTitle = bookToDelete.title;
    const targetId = bookToDelete.id;

    setBooks((prev) => {
      const updated = prev.filter((b) => b.id !== targetId);
      try {
        localStorage.setItem('library_hub_books_v2', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save updated books after deletion:', e);
      }
      return updated;
    });

    showToast(`ลบหนังสือเรื่อง "${targetTitle}" ออกจากคลังเรียบร้อยแล้ว`, 'info');
    setBookToDelete(null);
  };

  const handleBookSubmitted = (newBook: LibraryBook) => {
    setBooks((prev) => [newBook, ...prev]);
    if (newBook.status === 'published') {
      showToast(`หนังสือ "${newBook.title}" เผยแพร่ขึ้นชั้นวางเรียบร้อยแล้ว!`, 'success');
    } else {
      showToast(
        `ส่งหนังสือ "${newBook.title}" เรียบร้อย! ขณะนี้อยู่ในสถานะ [รอการตรวจสอบ / Pending Approval]`,
        'info'
      );
    }
  };

  const handleOpenReader = (book: LibraryBook) => {
    setReadingBook(book);
    setIsReaderOpen(true);
    // increment read count
    setBooks((prev) =>
      prev.map((b) => (b.id === book.id ? { ...b, readsCount: (b.readsCount || 0) + 1 } : b))
    );
  };

  const handleDownloadPdf = async (book: LibraryBook) => {
    if (isExportingPdf) return;
    setIsExportingPdf(true);
    try {
      await generateBookPdf(book, (msg) => setExportProgressMsg(msg));
      showToast(`ดาวน์โหลดไฟล์ PDF ของเรื่อง "${book.title}" เรียบร้อยแล้ว!`, 'success');
      // increment download count
      setBooks((prev) =>
        prev.map((b) =>
          b.id === book.id ? { ...b, downloadsCount: (b.downloadsCount || 0) + 1 } : b
        )
      );
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast('เกิดข้อผิดพลาดในการสร้างไฟล์ PDF กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
      setIsExportingPdf(false);
      setExportProgressMsg('');
    }
  };

  // Pending books for admin moderation
  const pendingBooks = books.filter((b) => b.status === 'pending');

  // Filter books on shelf:
  // If admin: can view published or filter pending
  // If cadet: only view published (or their own submissions)
  const visibleBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'pending'
        ? b.status === 'pending'
        : b.category === selectedCategory;

    if (currentUserRole === 'admin') {
      return matchesSearch && matchesCategory;
    } else {
      // Cadet sees published books, plus any pending book they submitted
      const isVisibleForCadet = b.status === 'published' || b.submitterRole === 'cadet';
      return isVisibleForCadet && matchesSearch && matchesCategory;
    }
  });

  const categories = [
    { id: 'all', label: 'ทั้งหมด' },
    { id: 'นิทานคลาสสิก & ปรัชญาการเรียนรู้', label: 'นิทานคลาสสิก & ปรัชญา' },
    { id: 'นิทานวิทยาศาสตร์ & ฟิสิกส์', label: 'วิทยาศาสตร์ & ฟิสิกส์' },
    { id: 'การ์ตูนความรู้ & กลศาสตร์อวกาศ', label: 'การ์ตูนความรู้ & อวกาศ' },
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'} bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200`}>
      <div className={`relative w-full ${isFullscreen ? 'w-screen h-screen max-w-none h-full rounded-none border-none' : 'max-w-6xl h-[92vh] rounded-3xl border border-slate-200'} bg-white text-slate-900 shadow-2xl flex flex-col overflow-hidden font-sans transition-all duration-200`}>
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Library className="w-5 h-5 sm:w-6 sm:h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>LAB 4: Library Hub - คลังหนังสือ & สื่อการเรียนรู้ดิจิทัล</span>
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                  {books.filter((b) => b.status === 'published').length} เล่มพร้อมอ่าน
                </span>
              </div>
              <span className="text-xs text-slate-500">
                ระบบชั้นวางหนังสือ 2 โหมดการอ่าน (PDF Download & Interactive HTML Web Reader)
              </span>
            </div>
          </div>

          {/* Top Right Controls & Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 border border-slate-200 p-1 rounded-xl shadow-xs">
              <button
                onClick={() => {
                  setCurrentUserRole('cadet');
                  setShowAdminPanel(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentUserRole === 'cadet'
                    ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="สลับเป็นสิทธิ์ผู้ใช้ทั่วไป (Cadet)"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">นักเรียน (Cadet)</span>
              </button>

              <button
                onClick={() => setCurrentUserRole('admin')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentUserRole === 'admin'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="สลับเป็นสิทธิ์ผู้ดูแลระบบ (Admin) เพื่อคัดกรองหรือเผยแพร่ทันที"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ผู้ดูแล (Admin)</span>
              </button>
            </div>

            {/* Admin Moderation Button */}
            {currentUserRole === 'admin' && (
              <button
                onClick={() => setShowAdminPanel(!showAdminPanel)}
                className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  showAdminPanel
                    ? 'bg-purple-600 border-purple-500 text-white shadow-sm'
                    : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700'
                }`}
                title="เปิด/ปิด แถบคัดกรองหนังสือที่รออนุมัติ"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>คัดกรองหนังสือ</span>
                {pendingBooks.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {pendingBooks.length}
                  </span>
                )}
              </button>
            )}

            {/* Contribute Book Button */}
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95"
              title="อัปโหลดหนังสือใหม่เข้าสู่ระบบห้องสมุด"
            >
              <Plus className="w-4 h-4" />
              <span>+ อัปโหลดหนังสือ (Contribute)</span>
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer border border-slate-200 flex items-center justify-center"
              title={isFullscreen ? 'ย่อหน้าต่างกลับเดิม (Exit Fullscreen)' : 'ขยายเต็มจอ (Fullscreen)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 text-indigo-600" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200 flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toast Notification Bar */}
        {toastMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-semibold flex items-center justify-between border-b animate-in fade-in duration-150 ${
              toastMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : toastMessage.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-indigo-50 text-indigo-800 border-indigo-200'
            }`}
          >
            <span>{toastMessage.text}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="hover:opacity-75 cursor-pointer text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Filter Bar & Search Toolbar */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 bg-white border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {currentUserRole === 'admin' && pendingBooks.length > 0 && (
              <button
                onClick={() => setSelectedCategory('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'pending'
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>รออนุมัติ ({pendingBooks.length})</span>
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเรื่อง หรือ ผู้แต่ง..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/70 space-y-6">
          {/* Admin Moderation Panel (Collapsible or if active) */}
          {currentUserRole === 'admin' && (showAdminPanel || selectedCategory === 'pending') && (
            <AdminModerationPanel
              pendingBooks={pendingBooks}
              onApprove={handleApproveBook}
              onReject={handleRejectBook}
              onPreviewBook={handleOpenReader}
              onClose={() => setShowAdminPanel(false)}
            />
          )}

          {/* Featured Showcase Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono">
                ชั้นวางหนังสือดิจิทัล (Digital Book Shelf)
              </h4>
            </div>
            <span className="text-xs font-mono text-slate-400">
              แสดง {visibleBooks.length} เล่ม
            </span>
          </div>

          {/* Books Shelf Grid */}
          {visibleBooks.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-200 shadow-xs">
              <BookOpen className="w-12 h-12 text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-800">ไม่พบหนังสือที่ตรงกับเงื่อนไข</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                ลองปรับคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูหนังสือที่มีอยู่ในระบบ
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleBooks.map((book) => {
                const isTortoiseHare = book.id === 'tortoise-hare-xero';
                return (
                  <div
                    key={book.id}
                    className={`rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-lg ${
                      isTortoiseHare
                        ? 'bg-white border-2 border-amber-300 ring-2 ring-amber-100 hover:border-amber-400'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {/* Book Card Top: Visual Banner & Badges */}
                    <div>
                      <div className="relative h-44 bg-slate-100 flex items-center justify-center p-3 overflow-hidden border-b border-slate-200">
                        {/* Real Image / PDF Cover / Book Graphic */}
                        {book.coverCanvasUrl ? (
                          <img
                            src={book.coverCanvasUrl}
                            alt={book.title}
                            className="w-full h-full object-contain"
                          />
                        ) : book.coverImage || book.scenes[0]?.imageUrl ? (
                          <img
                            src={book.coverImage || book.scenes[0]?.imageUrl}
                            alt={book.title}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <BookOpen className="w-10 h-10 mb-1.5 text-slate-300" />
                            <span className="text-[10px] font-mono text-slate-500 max-w-[180px] truncate text-center px-2">
                              {book.title}
                            </span>
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                          {isTortoiseHare && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              FEATURED SHOWCASE
                            </span>
                          )}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/95 text-slate-700 border border-slate-200 shadow-xs">
                            {book.totalPages} หน้า
                          </span>
                        </div>

                        {/* Status Badge & Admin Delete Button */}
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {book.status === 'published' ? (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold flex items-center gap-1 shadow-xs">
                              <Check className="w-3 h-3" />
                              เผยแพร่แล้ว
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-1 shadow-xs">
                              <Clock className="w-3 h-3" />
                              รอการตรวจสอบ
                            </span>
                          )}

                          {/* Admin Only Delete Button */}
                          {currentUserRole === 'admin' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setBookToDelete(book);
                              }}
                              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 hover:border-rose-300 transition-all cursor-pointer shadow-xs flex items-center justify-center"
                              title="ลบหนังสือเล่มนี้ (Admin Only)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-4 sm:p-5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 font-bold block mb-1">
                          {book.category}
                        </span>

                        <h4 className="text-base font-bold text-slate-900 line-clamp-1 mb-0.5">
                          {book.title}
                        </h4>
                        <span className="text-xs text-slate-500 italic block mb-2 font-serif line-clamp-1">
                          {book.titleEn}
                        </span>

                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                          {book.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-2.5">
                          <span className="truncate max-w-[170px]">
                            ลิขสิทธิ์: <strong className="text-slate-700">{book.author}</strong>
                          </span>
                          <span>อ่านแล้ว: {book.readsCount || 0} ครั้ง</span>
                        </div>
                      </div>
                    </div>

                    {/* Dual Action Buttons (ดาวน์โหลด PDF & อ่านออนไลน์ Web Reader) */}
                    <div className="p-4 pt-0 grid grid-cols-2 gap-2.5">
                      {/* Button 1: Download PDF */}
                      <button
                        onClick={() => handleDownloadPdf(book)}
                        disabled={isExportingPdf}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all cursor-pointer shadow-xs disabled:opacity-50"
                        title="ดาวน์โหลดไฟล์ .pdf ฉบับเต็มลงเครื่อง"
                      >
                        <Download className="w-3.5 h-3.5 text-indigo-600" />
                        <span>ดาวน์โหลด PDF</span>
                      </button>

                      {/* Button 2: Interactive Web Reader */}
                      <button
                        onClick={() => handleOpenReader(book)}
                        className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-sm ${
                          isTortoiseHare
                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                        }`}
                        title="เปิดอ่านออนไลน์แบบสองหน้าสมจริง (Interactive Web Reader)"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>อ่านออนไลน์</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Two-Page Book Reader Modal */}
      <BookReaderModal
        book={readingBook}
        isOpen={isReaderOpen}
        onClose={() => {
          setIsReaderOpen(false);
          setReadingBook(null);
        }}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Book Upload Modal (Cadet / Admin) */}
      <BookUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUserRole={currentUserRole}
        onBookSubmitted={handleBookSubmitted}
      />

      {/* PDF Export Progress Overlay */}
      {isExportingPdf && (
        <div className="fixed inset-0 z-80 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-white border border-indigo-200 shadow-2xl flex flex-col items-center gap-3 text-center max-w-sm w-full animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-1">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">กำลังสร้างไฟล์ PDF หนังสือ</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              {exportProgressMsg || 'กำลังเรนเดอร์เอกสารและภาพประกอบขนาด A4 คมชัดสูง...'}
            </p>
            <div className="mt-2 text-[10px] font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              A4 Storybook PDF • jsPDF Vector Rendering
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Admin */}
      {bookToDelete && (
        <div className="fixed inset-0 z-90 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-rose-200 rounded-3xl p-6 text-slate-900 shadow-2xl max-w-md w-full relative overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span>ยืนยันการลบหนังสือ</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 font-bold">
                Admin Action
              </span>
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือเรื่อง <strong className="text-rose-600">"{bookToDelete.title}"</strong> ออกจากคลัง? การดำเนินการนี้จะลบหนังสือออกจากระบบและชั้นวางทันที
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                onClick={() => setBookToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>

              <button
                onClick={handleConfirmDelete}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-rose-600/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>ยืนยันการลบ</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
