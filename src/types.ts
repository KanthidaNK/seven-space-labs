export type ThemeMode = 'white' | 'cosmic' | 'dark';
export type Language = 'th' | 'en';
export type UserRole = 'Free' | 'Student' | 'Premium' | 'Admin' | 'Developer';

export interface ExamNewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'สอบคัดเลือก สอวน.' | 'สอบเข้า ม.4 กำเนิดวิทย์/มหิดล' | 'TCAS' | 'ทุนการศึกษา' | string;
  sourceUrl: string;
  updatedDate: string;
}

export interface CadetProfile {
  name: string;
  callsign: string;
  email?: string;
  level: number;
  sector: string;
  exp: number;
  maxExp: number;
  syncRate: number;
  avatarUrl?: string;
  faction?: 'Kinetic' | 'Graviton' | 'Photon' | 'DarkVector';
  isPremium?: boolean;
  role?: UserRole;
  unlockedCourses?: string[];
  cosmicCoins?: number;
  cosmicEnergy?: number;
  loginStreak?: number;
  lastCheckinDate?: string;
}

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timeLimit: number;
}

export interface FlipbookItem {
  id: string;
  title: string;
  subtitle: string;
  pages: number;
  language: string;
  coverColor: string;
  category: string;
  content: {
    pageNumber: number;
    title: string;
    text: string;
    diagramType?: 'photon' | 'gravity' | 'optics';
  }[];
}

export interface VideoLecture {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  savedTimestamp: string;
  tags: string[];
  views: string;
  likes: string;
}

export interface CreatorItem {
  id: string;
  name: string;
  school: string;
  subscribers: string;
  sheetsCount: number;
  badge: string;
  avatar: string;
  rating: number;
}
