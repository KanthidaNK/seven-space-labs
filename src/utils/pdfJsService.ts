/**
 * Service to interface with Mozilla PDF.js (loaded via CDN)
 */

declare global {
  interface Window {
    pdfjsLib?: any;
  }
}

export interface PdfDocumentInfo {
  numPages: number;
  title?: string;
  coverThumbnailUrl?: string;
}

/**
 * Loads a PDF document and extracts basic metadata and page 1 thumbnail
 */
export async function loadPdfDocument(file: File): Promise<{
  blobUrl: string;
  numPages: number;
  coverThumbnailUrl?: string;
}> {
  const blobUrl = URL.createObjectURL(file);

  if (!window.pdfjsLib) {
    // If CDN is still loading, wait a moment
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  if (!window.pdfjsLib) {
    throw new Error('PDF.js library is not available');
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = window.pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;

  let coverThumbnailUrl: string | undefined;

  try {
    const page1 = await pdfDoc.getPage(1);
    const viewport = page1.getViewport({ scale: 1.0 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page1.render({ canvasContext: ctx, viewport }).promise;
      coverThumbnailUrl = canvas.toDataURL('image/jpeg', 0.85);
    }
  } catch (e) {
    console.warn('Failed to extract PDF cover thumbnail:', e);
  }

  return {
    blobUrl,
    numPages: pdfDoc.numPages,
    coverThumbnailUrl,
  };
}
