import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  BookPlus,
  ShieldCheck,
  User,
  Check,
  AlertCircle,
  FileCode,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Layers,
  RefreshCw,
} from 'lucide-react';
import { LibraryBook, UserRole } from '../../types/library';
import { parseHtmlBookWithAssets } from '../../utils/htmlBookParser';
import { loadPdfDocument } from '../../utils/pdfJsService';

interface BookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: UserRole;
  onBookSubmitted: (newBook: LibraryBook) => void;
}

export const BookUploadModal: React.FC<BookUploadModalProps> = ({
  isOpen,
  onClose,
  currentUserRole,
  onBookSubmitted,
}) => {
  const [activeTab, setActiveTab] = useState<'html-assets' | 'pdf'>('html-assets');

  // Shared metadata
  const [title, setTitle] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [author, setAuthor] = useState(currentUserRole === 'admin' ? '© Xero Studio' : 'Cadet Contributor');
  const [category, setCategory] = useState('นิทานคลาสสิก & ปรัชญาการเรียนรู้');
  const [description, setDescription] = useState('');
  const [adminDirectPublish, setAdminDirectPublish] = useState<boolean>(currentUserRole === 'admin');

  // TAB A: HTML + Image assets state
  const [htmlFileName, setHtmlFileName] = useState<string>('');
  const [htmlContentText, setHtmlContentText] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<{ name: string; file: File; previewUrl: string }[]>([]);
  const [parsedHtmlBook, setParsedHtmlBook] = useState<LibraryBook | null>(null);

  // TAB B: PDF state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState<number>(0);
  const [pdfCoverThumb, setPdfCoverThumb] = useState<string | undefined>(undefined);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | undefined>(undefined);
  const [isProcessingPdf, setIsProcessingPdf] = useState<boolean>(false);

  const multipleFilesInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // TAB A: Handle Multiple Files (HTML + Images)
  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let targetHtmlFile: File | null = null;
    const imgList: { name: string; file: File; previewUrl: string }[] = [];

    for (const file of files) {
      const ext = file.name.toLowerCase().split('.').pop();
      if (ext === 'html' || ext === 'htm') {
        targetHtmlFile = file;
      } else if (['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext || '')) {
        imgList.push({
          name: file.name,
          file: file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }

    setUploadedImages((prev) => [...prev, ...imgList]);

    if (targetHtmlFile !== null) {
      const currentHtmlFile: File = targetHtmlFile;
      setHtmlFileName(currentHtmlFile.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setHtmlContentText(text);

        // Combine all images
        const allImagesMap = new Map<string, File>();
        [...uploadedImages, ...imgList].forEach((item) => {
          allImagesMap.set(item.name.toLowerCase(), item.file);
        });

        const parsed = parseHtmlBookWithAssets(text, allImagesMap, currentUserRole, currentHtmlFile.name);
        setParsedHtmlBook(parsed);
        setTitle(parsed.title);
        setTitleEn(parsed.titleEn);
        setAuthor(parsed.author);
        setCategory(parsed.category);
        setDescription(parsed.description);
      };
      reader.readAsText(currentHtmlFile);
    } else if (htmlContentText) {
      // Re-parse with newly added images
      const allImagesMap = new Map<string, File>();
      [...uploadedImages, ...imgList].forEach((item) => {
        allImagesMap.set(item.name.toLowerCase(), item.file);
      });
      const parsed = parseHtmlBookWithAssets(htmlContentText, allImagesMap, currentUserRole, htmlFileName || 'หนังสือนิทาน');
      setParsedHtmlBook(parsed);
    }
  };

  // TAB B: Handle PDF Upload
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfFile(file);
    setIsProcessingPdf(true);

    try {
      const info = await loadPdfDocument(file);
      setPdfTotalPages(info.numPages);
      setPdfBlobUrl(info.blobUrl);
      setPdfCoverThumb(info.coverThumbnailUrl);

      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setTitle(cleanName);
      setTitleEn(cleanName);
      setDescription(`หนังสือนิทานฉบับ PDF แท้จริง จำนวน ${info.numPages} หน้า`);
    } catch (err) {
      console.error('Failed to load PDF via PDF.js:', err);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const isPublished = currentUserRole === 'admin' && adminDirectPublish;

    if (activeTab === 'html-assets') {
      if (!parsedHtmlBook || parsedHtmlBook.scenes.length === 0) {
        alert('กรุณาเลือกไฟล์ HTML ก่อนทำการบันทึก');
        return;
      }

      // Re-map images with current state
      const allImagesMap = new Map<string, File>();
      uploadedImages.forEach((item) => {
        allImagesMap.set(item.name.toLowerCase(), item.file);
      });

      const finalParsed = parseHtmlBookWithAssets(
        htmlContentText,
        allImagesMap,
        currentUserRole,
        htmlFileName
      );

      const finalBook: LibraryBook = {
        ...finalParsed,
        id: `book-html-${Date.now()}`,
        title: title.trim(),
        titleEn: titleEn.trim() || title.trim(),
        author: author.trim() || finalParsed.author,
        category,
        description: description.trim() || finalParsed.description,
        status: isPublished ? 'published' : 'pending',
        submitterRole: currentUserRole,
        submitterName: currentUserRole === 'admin' ? 'Xero Studio (Admin)' : 'Cadet Contributor',
        submittedAt: new Date().toISOString().split('T')[0],
        bookType: 'html-images',
        totalPages: finalParsed.scenes.length,
      };

      onBookSubmitted(finalBook);
      onClose();
    } else {
      // PDF Mode
      if (!pdfFile || !pdfBlobUrl) {
        alert('กรุณาเลือกไฟล์ PDF ก่อนทำการบันทึก');
        return;
      }

      const newPdfBook: LibraryBook = {
        id: `book-pdf-${Date.now()}`,
        title: title.trim(),
        titleEn: titleEn.trim() || title.trim(),
        author: author.trim() || 'Xero Studio / Contributor',
        category,
        description: description.trim() || `หนังสือนิทานฉบับ PDF แท้จริง (${pdfTotalPages} หน้า)`,
        status: isPublished ? 'published' : 'pending',
        submitterRole: currentUserRole,
        submitterName: currentUserRole === 'admin' ? 'Xero Studio (Admin)' : 'Cadet Contributor',
        submittedAt: new Date().toISOString().split('T')[0],
        totalPages: pdfTotalPages || 1,
        bookType: 'pdf',
        pdfBlobUrl: pdfBlobUrl,
        pdfFileName: pdfFile.name,
        coverCanvasUrl: pdfCoverThumb,
        scenes: [],
        readsCount: 0,
        downloadsCount: 0,
      };

      onBookSubmitted(newPdfBook);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <span
              className={`p-2 rounded-xl ${
                currentUserRole === 'admin'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <BookPlus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>อัปโหลดหนังสือจริง (Dual Real Upload Engine)</span>
                {currentUserRole === 'admin' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Admin Mode
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 font-bold flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Cadet Member
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-500">
                รองรับไฟล์ชุด HTML + รูปภาพประกอบแท้จริง และไฟล์ PDF ตรงผ่าน PDF.js
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher (แท็บ A vs แท็บ B) */}
        <div className="p-2 bg-slate-100 border-b border-slate-200 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('html-assets')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'html-assets'
                ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 ring-1 ring-indigo-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileCode className="w-4 h-4 text-indigo-600" />
            <span>[แท็บ A] ชุด HTML + รูปภาพจริง</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pdf'
                ? 'bg-white text-rose-700 shadow-sm border border-slate-200/80 ring-1 ring-rose-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>[แท็บ B] ไฟล์ PDF นิทานจริง (PDF.js)</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {/* TAB A: HTML + Image Assets */}
          {activeTab === 'html-assets' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                  เลือกไฟล์ HTML และรูปภาพทั้งหมดพร้อมกัน (Multiple Files) *
                </label>
                <input
                  type="file"
                  multiple
                  ref={multipleFilesInputRef}
                  onChange={handleMultipleFilesChange}
                  accept=".html,.htm,.png,.jpg,.jpeg,.webp,.svg"
                  className="hidden"
                />
                <div
                  onClick={() => multipleFilesInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    htmlFileName
                      ? 'border-indigo-500 bg-indigo-50/40'
                      : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-indigo-600 mb-2" />
                  <span className="text-xs font-bold text-slate-900">
                    {htmlFileName ? `ไฟล์ HTML: ${htmlFileName}` : 'คลิกเพื่อเลือกไฟล์ HTML และรูปภาพประกอบ (.png, .jpg, .webp)'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 max-w-sm">
                    สามารถกด Ctrl หรือ Shift เพื่อเลือกทั้งไฟล์ xerostudio.html และรูป cover.png, 1.png, 2.png, ... พร้อมกันได้เลย
                  </span>
                </div>
              </div>

              {/* Status & Extracted Stats */}
              {parsedHtmlBook && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-emerald-800">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>สกัดโครงสร้าง HTML สำเร็จ: พบ {parsedHtmlBook.scenes.length} หน้าสมบูรณ์</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-mono">
                    รูปภาพที่ตรวจพบและจับคู่ได้: {uploadedImages.length} ไฟล์
                  </div>
                </div>
              )}

              {/* Uploaded Images Preview Strip */}
              {uploadedImages.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5 font-mono">
                    รูปภาพที่แนบเข้ามา ({uploadedImages.length} รูป):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {uploadedImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-16 rounded-xl border border-slate-300 overflow-hidden bg-slate-100 shrink-0 relative group"
                        title={img.name}
                      >
                        <img src={img.previewUrl} alt={img.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono truncate px-1 text-center">
                          {img.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB B: Native PDF via PDF.js */}
          {activeTab === 'pdf' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 font-mono">
                  อัปโหลดไฟล์ PDF นิทานต้นฉบับ *
                </label>
                <input
                  type="file"
                  ref={pdfInputRef}
                  onChange={handlePdfChange}
                  accept=".pdf"
                  className="hidden"
                />
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                    pdfFile
                      ? 'border-rose-500 bg-rose-50/40'
                      : 'border-slate-300 hover:border-rose-400 bg-slate-50/50'
                  }`}
                >
                  {isProcessingPdf ? (
                    <RefreshCw className="w-8 h-8 text-rose-600 animate-spin mb-2" />
                  ) : (
                    <FileText className="w-8 h-8 text-rose-600 mb-2" />
                  )}
                  <span className="text-xs font-bold text-slate-900">
                    {pdfFile ? pdfFile.name : 'คลิกเลือกไฟล์ PDF จากเครื่อง'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1">
                    ระบบจะใช้ PDF.js อ่านจำนวนหน้าจริงและเรนเดอร์หน้ากระดาษแบบ High-DPI
                  </span>
                </div>
              </div>

              {/* PDF Info Card with Page 1 Thumbnail */}
              {pdfTotalPages > 0 && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
                  {pdfCoverThumb && (
                    <img
                      src={pdfCoverThumb}
                      alt="PDF Cover"
                      className="w-14 h-20 object-contain rounded-lg border border-slate-300 bg-white shadow-xs"
                    />
                  )}
                  <div>
                    <span className="text-xs font-bold text-rose-950 block">
                      ตรวจพบเอกสาร PDF สำเร็จ
                    </span>
                    <span className="text-[11px] text-rose-700 font-mono block">
                      จำนวนหน้าจริง: <strong>{pdfTotalPages} หน้าสมบูรณ์</strong>
                    </span>
                    <span className="text-[10px] text-slate-500">
                      พร้อมเปิดอ่านแบบสองหน้าและสลับหน้าด้วย PDF.js Canvas
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Book Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อหนังสือ (ภาษาไทย) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น กระต่ายกับเต่า"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ชื่อหนังสือ (English Title)
              </label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. The Tortoise and the Hare"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Category & Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                หมวดหมู่
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              >
                <option value="นิทานคลาสสิก & ปรัชญาการเรียนรู้">นิทานคลาสสิก & ปรัชญาการเรียนรู้</option>
                <option value="นิทานวิทยาศาสตร์ & ฟิสิกส์">นิทานวิทยาศาสตร์ & ฟิสิกส์</option>
                <option value="การ์ตูนความรู้ & กลศาสตร์อวกาศ">การ์ตูนความรู้ & กลศาสตร์อวกาศ</option>
                <option value="วรรณกรรมเยาวชน & นิทานอีสป">วรรณกรรมเยาวชน & นิทานอีสป</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ผู้แต่ง / ลิขสิทธิ์
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="เช่น © Xero Studio"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              คำอธิบายเนื้อเรื่อง
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุเรื่องย่อ..."
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Admin Direct Publish Option */}
          {currentUserRole === 'admin' && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 border border-purple-200">
              <div>
                <span className="text-xs font-bold text-purple-900 block">
                  Admin Direct Upload (เผยแพร่ทันที)
                </span>
                <span className="text-[10px] text-purple-700">
                  ข้ามขั้นตอนการรอตรวจสอบ และนำขึ้นแสดงบนชั้นวางสาธารณะทันที
                </span>
              </div>
              <input
                type="checkbox"
                checked={adminDirectPublish}
                onChange={(e) => setAdminDirectPublish(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded cursor-pointer"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all cursor-pointer shadow-md ${
                activeTab === 'pdf'
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>
                {currentUserRole === 'admin' && adminDirectPublish
                  ? 'อนุมัติและเผยแพร่ทันที (Direct Publish)'
                  : 'ส่งหนังสือเข้าห้องสมุด (Submit Book)'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
