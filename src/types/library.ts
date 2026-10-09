export type UserRole = 'cadet' | 'admin';

export type BookStatus = 'published' | 'pending' | 'rejected';

export interface BookScene {
  sceneNumber: number;
  title: string;
  thaiText: string;
  englishText: string;
  isCover?: boolean;
  copyrightText?: string;
  imageFileName?: string;
  imageUrl?: string; // Real Object/Blob URL from uploaded asset
  hasRealImage?: boolean;
  moralLesson?: string;
  conceptTag?: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  titleEn: string;
  author: string;
  category: string;
  description: string;
  coverImage?: string;
  status: BookStatus;
  submitterRole: UserRole;
  submitterName: string;
  submittedAt: string;
  totalPages: number;
  bookType?: 'html-images' | 'pdf';
  pdfBlobUrl?: string; // Direct Blob URL for PDF rendering and downloading
  pdfFileName?: string;
  coverCanvasUrl?: string; // Real rendered thumbnail of page 1
  pdfDownloadUrl?: string;
  scenes: BookScene[];
  readsCount?: number;
  downloadsCount?: number;
}
