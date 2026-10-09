import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface PdfCanvasReaderProps {
  pdfBlobUrl: string;
  currentPage: number;
  scale?: number;
  onNumPages?: (numPages: number) => void;
}

export const PdfCanvasReader: React.FC<PdfCanvasReaderProps> = ({
  pdfBlobUrl,
  currentPage,
  scale = 1.75,
  onNumPages,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const pdfDocRef = useRef<any>(null);
  const currentRenderTaskRef = useRef<any>(null);

  // Load PDF Document
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadDoc = async () => {
      try {
        if (!window.pdfjsLib) {
          // wait briefly for script tag
          for (let i = 0; i < 20; i++) {
            if (window.pdfjsLib) break;
            await new Promise((r) => setTimeout(r, 100));
          }
        }

        if (!window.pdfjsLib) {
          throw new Error('ไม่พบเอนจิน PDF.js ในระบบ');
        }

        const loadingTask = window.pdfjsLib.getDocument({ url: pdfBlobUrl });
        const pdfDoc = await loadingTask.promise;

        if (isCancelled) return;

        pdfDocRef.current = pdfDoc;
        if (onNumPages) {
          onNumPages(pdfDoc.numPages);
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Error loading PDF document:', err);
          setError(err.message || 'ไม่สามารถเปิดอ่านไฟล์ PDF ได้');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadDoc();

    return () => {
      isCancelled = true;
    };
  }, [pdfBlobUrl]);

  // Render Current Page
  useEffect(() => {
    let isCancelled = false;

    const renderPage = async () => {
      if (!pdfDocRef.current || !canvasRef.current) return;

      try {
        if (currentRenderTaskRef.current) {
          try {
            currentRenderTaskRef.current.cancel();
          } catch {
            // ignore cancel error
          }
        }

        setLoading(true);
        const page = await pdfDocRef.current.getPage(currentPage);
        if (isCancelled) return;

        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;

        await renderTask.promise;
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException' && !isCancelled) {
          console.error('Error rendering PDF page:', err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
    };
  }, [currentPage, scale, pdfBlobUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-rose-50 border border-rose-200 rounded-2xl text-center max-w-md mx-auto">
        <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
        <p className="text-xs font-bold text-rose-800">{error}</p>
        <span className="text-[10px] text-rose-600 mt-1">
          กรุณาตรวจสอบว่าไฟล์ PDF ถูกต้องและสามารถเข้าถึงได้
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-[460px] p-2 sm:p-4">
      {loading && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xs rounded-2xl">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
          <span className="text-xs font-mono font-bold text-slate-700">
            กำลังเรนเดอร์หน้ากระดาษ PDF (High-DPI)...
          </span>
        </div>
      )}
      <div className="max-w-full max-h-[78vh] overflow-auto shadow-2xl rounded-xl border border-slate-300 bg-white">
        <canvas ref={canvasRef} className="block mx-auto max-w-full h-auto object-contain" />
      </div>
    </div>
  );
};
