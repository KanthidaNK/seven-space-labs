import { LibraryBook, BookScene, UserRole } from '../types/library';

/**
 * Extracts the image file name from element's style (background-image: url(...)) or <img> src
 */
export function extractImageFileName(el: Element): string | undefined {
  // Check style attribute on the element itself
  const style = el.getAttribute('style') || '';
  const match = style.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
  if (match && match[1]) {
    return cleanFileName(match[1]);
  }

  // Check child elements with background-image style
  const childWithBg = el.querySelector('[style*="url("]');
  if (childWithBg) {
    const childStyle = childWithBg.getAttribute('style') || '';
    const childMatch = childStyle.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i);
    if (childMatch && childMatch[1]) {
      return cleanFileName(childMatch[1]);
    }
  }

  // Check <img> tag
  const img = el.querySelector('img');
  if (img) {
    const src = img.getAttribute('src');
    if (src) return cleanFileName(src);
  }

  return undefined;
}

function cleanFileName(raw: string): string {
  // Remove leading paths or ./ or quotes
  const trimmed = raw.trim().replace(/^['"]|['"]$/g, '');
  // Extract just the filename if it's a relative path e.g. "images/cover.png" -> "cover.png"
  const parts = trimmed.split(/[\/\\]/);
  return parts[parts.length - 1].toLowerCase();
}

/**
 * Parses an HTML storybook file (such as xerostudio.html) together with user-uploaded image files
 */
export function parseHtmlBookWithAssets(
  htmlContent: string,
  imageFilesMap: Map<string, File>,
  userRole: UserRole = 'cadet',
  fallbackFileName: string = 'หนังสือนิทาน'
): LibraryBook {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const pageRows = doc.querySelectorAll('.book-page-row');

  if (pageRows.length > 0) {
    const scenes: BookScene[] = [];
    let bookTitle = '';
    let bookTitleEn = '';
    let bookAuthor = '© Xero Studio';

    pageRows.forEach((row, index) => {
      const pageNum = index + 1;
      const refFileName = extractImageFileName(row);

      // Match with uploaded images
      let matchedImageUrl: string | undefined;
      let hasRealImage = false;

      if (refFileName) {
        const file = imageFilesMap.get(refFileName.toLowerCase());
        if (file) {
          matchedImageUrl = URL.createObjectURL(file);
          hasRealImage = true;
        }
      }

      if (index === 0) {
        // Page 1: Cover Page
        const thaiHeadline =
          row.querySelector('.cover-thai-headline')?.textContent?.trim() ||
          doc.querySelector('.cover-thai-headline')?.textContent?.trim() ||
          row.querySelector('h1')?.textContent?.trim() ||
          'กระต่ายกับเต่า';

        const engSubline =
          row.querySelector('.cover-english-subline')?.textContent?.trim() ||
          doc.querySelector('.cover-english-subline')?.textContent?.trim() ||
          row.querySelector('h2')?.textContent?.trim() ||
          'The Tortoise and the Hare';

        const copyright =
          row.querySelector('.copyright-text')?.textContent?.trim() ||
          doc.querySelector('.copyright-text')?.textContent?.trim() ||
          '© Xero Studio';

        const coverIntro =
          row.querySelector('.narration-thai')?.textContent?.trim() ||
          row.querySelector('p')?.textContent?.trim() ||
          '';

        const coverIntroEn =
          row.querySelector('.narration-english')?.textContent?.trim() ||
          '';

        bookTitle = thaiHeadline;
        bookTitleEn = engSubline;
        bookAuthor = copyright;

        scenes.push({
          sceneNumber: 1,
          isCover: true,
          title: `หน้าปก: ${thaiHeadline}`,
          thaiText: coverIntro,
          englishText: coverIntroEn,
          copyrightText: copyright,
          imageFileName: refFileName || 'cover.png',
          imageUrl: matchedImageUrl,
          hasRealImage: hasRealImage,
          conceptTag: 'Cover Spread',
        });
      } else {
        // Pages 2 to N: Story Scenes
        const thaiNarrative =
          row.querySelector('.narration-thai')?.textContent?.trim() ||
          row.querySelector('.thai-text')?.textContent?.trim() ||
          row.querySelectorAll('p')[0]?.textContent?.trim() ||
          '';

        const engNarrative =
          row.querySelector('.narration-english')?.textContent?.trim() ||
          row.querySelector('.english-text')?.textContent?.trim() ||
          row.querySelectorAll('p')[1]?.textContent?.trim() ||
          '';

        const sceneHeadline =
          row.querySelector('.scene-title, .page-title, h2, h3')?.textContent?.trim() ||
          `ฉากที่ ${index}`;

        const isLastScene = index === pageRows.length - 1;

        scenes.push({
          sceneNumber: pageNum,
          isCover: false,
          title: sceneHeadline,
          thaiText: thaiNarrative,
          englishText: engNarrative,
          imageFileName: refFileName || `${index}.png`,
          imageUrl: matchedImageUrl,
          hasRealImage: hasRealImage,
          conceptTag: isLastScene ? 'บทสรุป & ข้อคิด' : `ฉากที่ ${index}`,
        });
      }
    });

    return {
      id: `book-html-${Date.now()}`,
      title: bookTitle || fallbackFileName,
      titleEn: bookTitleEn || fallbackFileName,
      author: bookAuthor,
      category: 'นิทานคลาสสิก & ปรัชญาการเรียนรู้',
      description: `นิทานฉบับสมบูรณ์ ${scenes.length} หน้า สกัดจากไฟล์ HTML และรูปภาพจริง (${bookAuthor})`,
      status: userRole === 'admin' ? 'published' : 'pending',
      submitterRole: userRole,
      submitterName: userRole === 'admin' ? 'Xero Studio (Admin)' : 'Cadet Contributor',
      submittedAt: new Date().toISOString().split('T')[0],
      totalPages: scenes.length,
      bookType: 'html-images',
      coverImage: scenes[0]?.imageUrl,
      readsCount: 0,
      downloadsCount: 0,
      scenes: scenes,
    };
  }

  // Fallback for general HTML documents with <section> or <article>
  const sections = doc.querySelectorAll('section, article, .page, .scene');
  const extractedScenes: BookScene[] = [];
  const docTitle = doc.querySelector('h1')?.textContent?.trim() || doc.title || fallbackFileName;

  if (sections.length > 0) {
    sections.forEach((sec, idx) => {
      const pElements = sec.querySelectorAll('p');
      const thai = pElements[0]?.textContent?.trim() || '';
      const eng = pElements[1]?.textContent?.trim() || '';
      const secTitle = sec.querySelector('h2, h3, .title')?.textContent?.trim() || `หน้า ${idx + 1}`;
      const refFileName = extractImageFileName(sec);
      let matchedImageUrl: string | undefined;
      let hasRealImage = false;

      if (refFileName) {
        const file = imageFilesMap.get(refFileName.toLowerCase());
        if (file) {
          matchedImageUrl = URL.createObjectURL(file);
          hasRealImage = true;
        }
      }

      extractedScenes.push({
        sceneNumber: idx + 1,
        title: secTitle,
        thaiText: thai,
        englishText: eng,
        imageFileName: refFileName,
        imageUrl: matchedImageUrl,
        hasRealImage: hasRealImage,
      });
    });
  }

  return {
    id: `book-html-${Date.now()}`,
    title: docTitle,
    titleEn: docTitle,
    author: 'Xero Studio Contributor',
    category: 'นิทานคลาสสิก & วรรณกรรม',
    description: `หนังสือดิจิทัลนำเข้าจากไฟล์ HTML จำนวน ${extractedScenes.length} หน้า`,
    status: userRole === 'admin' ? 'published' : 'pending',
    submitterRole: userRole,
    submitterName: userRole === 'admin' ? 'Commander (Admin)' : 'Cadet Contributor',
    submittedAt: new Date().toISOString().split('T')[0],
    totalPages: Math.max(1, extractedScenes.length),
    bookType: 'html-images',
    readsCount: 0,
    downloadsCount: 0,
    scenes: extractedScenes,
  };
}
