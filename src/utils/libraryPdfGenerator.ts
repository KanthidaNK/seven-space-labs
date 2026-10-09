import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LibraryBook } from '../types/library';

/**
 * Generates an A4 PDF Storybook for any LibraryBook
 * with Thai/English text and illustrations rendered via html2canvas & jsPDF
 */
export async function generateBookPdf(
  book: LibraryBook,
  onProgress?: (msg: string) => void
): Promise<void> {
  // If it's a real PDF uploaded by user, directly download the authentic file!
  if (book.bookType === 'pdf' && book.pdfBlobUrl) {
    if (onProgress) onProgress('กำลังดาวน์โหลดไฟล์ PDF ต้นฉบับ...');
    const link = document.createElement('a');
    link.href = book.pdfBlobUrl;
    link.download = book.pdfFileName || `${book.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  if (onProgress) onProgress('กำลังเตรียมเรนเดอร์เนื้อหาหนังสือ...');

  // Create temporary off-screen container for rendering A4 pages
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '0px';
  container.style.width = '794px';
  container.style.zIndex = '-100';
  container.style.background = '#ffffff';
  document.body.appendChild(container);

  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const totalPages = book.scenes.length + 1; // 1 cover + N scenes

    // 1. Render Cover Page
    if (onProgress) onProgress(`กำลังสร้างหน้าปกหนังสือ: ${book.title}...`);
    const coverEl = document.createElement('div');
    coverEl.style.width = '794px';
    coverEl.style.height = '1123px';
    coverEl.style.background = '#FBF9F3';
    coverEl.style.padding = '60px 50px';
    coverEl.style.display = 'flex';
    coverEl.style.flexDirection = 'column';
    coverEl.style.justifyContent = 'space-between';
    coverEl.style.boxSizing = 'border-box';
    coverEl.style.fontFamily = 'sans-serif';
    coverEl.style.color = '#0f172a';
    coverEl.style.border = '1px solid #e2e8f0';

    coverEl.innerHTML = `
      <div style="border-bottom: 2px solid #b45309; padding-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: monospace; font-size: 13px; font-weight: bold; color: #b45309; text-transform: uppercase;">
          LIBRARY HUB // STORYBOOK COLLECTION
        </span>
        <span style="font-size: 11px; color: #64748b; font-family: monospace;">
          A4 DIGITAL EDITION
        </span>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <span style="display: inline-block; font-size: 12px; font-weight: bold; padding: 4px 14px; border-radius: 9999px; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; margin-bottom: 20px;">
          ${book.category}
        </span>
        <h1 style="font-size: 38px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; font-family: serif;">
          ${book.title}
        </h1>
        <h2 style="font-size: 22px; font-weight: 600; color: #475569; margin: 0 0 30px 0; font-style: italic;">
          ${book.titleEn}
        </h2>
        
        <div style="width: 240px; height: 240px; margin: 0 auto 30px auto; border-radius: 20px; background: #ffffff; border: 1px solid #cbd5e1; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(0,0,0,0.06); overflow: hidden; padding: 12px;">
          ${
            book.scenes[0]?.imageUrl
              ? `<img src="${book.scenes[0].imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
              : `<div style="font-size: 14px; color: #64748b; font-family: monospace;">[ ${book.scenes[0]?.imageFileName || 'cover.png'} ]</div>`
          }
        </div>

        <p style="font-size: 15px; color: #334155; max-width: 580px; margin: 0 auto; line-height: 1.6; font-family: serif;">
          ${book.description}
        </p>
      </div>

      <div style="border-top: 2px solid #b45309; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #475569; font-family: monospace;">
        <div>
          <span>ผู้จัดทำ / ลิขสิทธิ์: </span>
          <strong style="color: #0f172a;">${book.author}</strong>
        </div>
        <div>
          <span>จำนวน: <strong>${book.scenes.length} ฉากสมบูรณ์</strong></span>
        </div>
      </div>
    `;

    container.appendChild(coverEl);
    const coverCanvas = await html2canvas(coverEl, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FBF9F3',
      width: 794,
      height: 1123,
    });
    const coverImgData = coverCanvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(coverImgData, 'JPEG', 0, 0, 210, 297);
    coverCanvas.width = 0;
    coverCanvas.height = 0;
    container.removeChild(coverEl);

    // 2. Render Each Story Scene (Skip index 0 if it is already the cover)
    const startIndex = book.scenes[0]?.isCover ? 1 : 0;
    for (let i = startIndex; i < book.scenes.length; i++) {
      const scene = book.scenes[i];
      const displaySceneNum = book.scenes[0]?.isCover ? i : i + 1;
      if (onProgress) onProgress(`กำลังเรนเดอร์ฉากที่ ${displaySceneNum} จากทั้งหมด ${book.scenes.length - (book.scenes[0]?.isCover ? 1 : 0)} ฉาก...`);

      const sceneEl = document.createElement('div');
      sceneEl.style.width = '794px';
      sceneEl.style.height = '1123px';
      sceneEl.style.background = '#FBF9F3';
      sceneEl.style.padding = '50px 45px';
      sceneEl.style.display = 'flex';
      sceneEl.style.flexDirection = 'column';
      sceneEl.style.justifyContent = 'space-between';
      sceneEl.style.boxSizing = 'border-box';
      sceneEl.style.fontFamily = 'sans-serif';
      sceneEl.style.color = '#0f172a';
      sceneEl.style.border = '1px solid #e2e8f0';

      sceneEl.innerHTML = `
        <div style="border-bottom: 1.5px solid #d97706; padding-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <span style="font-family: serif; font-size: 15px; font-weight: bold; color: #92400e;">
              ${book.title}
            </span>
            <span style="font-size: 13px; color: #64748b; margin-left: 8px;">
              • ${scene.title}
            </span>
          </div>
          ${
            scene.conceptTag
              ? `<span style="font-size: 11px; padding: 2px 10px; border-radius: 9999px; background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; font-family: monospace;">${scene.conceptTag}</span>`
              : ''
          }
        </div>

        <div style="margin: 20px 0; display: flex; flex-direction: column; gap: 20px; flex: 1; justify-content: center;">
          <!-- Illustration Box -->
          <div style="width: 100%; height: 380px; border-radius: 16px; background: #ffffff; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); overflow: hidden; padding: 12px;">
            ${
              scene.imageUrl
                ? `<img src="${scene.imageUrl}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`
                : `<div style="font-size: 14px; color: #64748b; font-family: monospace;">[ ${scene.imageFileName || `ฉากที่ ${displaySceneNum}`} ]</div>`
            }
          </div>

          <!-- Bilingual Narrative -->
          <div style="padding: 20px 24px; border-radius: 16px; background: #ffffff; border: 1px solid #fde68a;">
            <p style="font-size: 18px; line-height: 1.7; font-family: serif; font-weight: 600; color: #0f172a; margin: 0 0 16px 0; text-indent: 24px;">
              ${scene.thaiText}
            </p>

            <div style="border-bottom: 1.5px dashed #cbd5e1; margin-bottom: 14px; position: relative;"></div>

            <p style="font-size: 14px; line-height: 1.6; font-family: serif; font-style: italic; color: #475569; margin: 0; text-indent: 24px;">
              ${scene.englishText}
            </p>
          </div>

          ${
            scene.moralLesson
              ? `<div style="padding: 12px 18px; border-radius: 12px; background: #fef3c7; border: 1px solid #fde68a; font-size: 13px; color: #78350f; font-family: serif;">
                  <strong>💡 ข้อคิดประจำเรื่อง:</strong> ${scene.moralLesson}
                </div>`
              : ''
          }
        </div>

        <div style="border-top: 1.5px solid #d97706; padding-top: 14px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #64748b; font-family: monospace;">
          <span>${book.author}</span>
          <span style="font-weight: bold; color: #0f172a; font-size: 13px;">
            หน้า ${i + 1} จากทั้งหมด ${book.scenes.length} ฉาก
          </span>
        </div>
      `;

      container.appendChild(sceneEl);
      const sceneCanvas = await html2canvas(sceneEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#FBF9F3',
        width: 794,
        height: 1123,
      });

      pdf.addPage([210, 297], 'portrait');
      const sceneImgData = sceneCanvas.toDataURL('image/jpeg', 0.95);
      pdf.addImage(sceneImgData, 'JPEG', 0, 0, 210, 297);

      sceneCanvas.width = 0;
      sceneCanvas.height = 0;
      container.removeChild(sceneEl);
    }

    if (onProgress) onProgress('กำลังส่งออกไฟล์ PDF...');

    const cleanTitle = (book.titleEn || book.title).replace(/[\s\/:*?"<>|\\]+/g, '_');
    const fileName = `book-${cleanTitle}.pdf`;

    const blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}
