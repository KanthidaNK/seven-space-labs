import React, { useState, useEffect } from 'react';
import {
  X,
  Trophy,
  Zap,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Check,
  Globe,
  Atom,
  Lightbulb,
  Play,
  Settings,
  Plus,
  Layers,
  Crown,
  Maximize2,
  Minimize2,
  BookOpen,
} from 'lucide-react';
import { Language, CadetProfile } from '../../types';
import { isUserAdminOrDev } from '../../utils/quotaService';
import {
  ArenaModeConfig,
  ArenaQuizFormat,
  AcademicLevel,
  GeneralDifficulty,
  ARENA_COLOR_MAP,
  renderArenaIcon,
  loadArenaModes,
  saveArenaModes,
  DEFAULT_ARENA_MODES,
  LaserSwordsIcon,
} from '../../data/arenaModesData';
import { Lab2AdminModesModal } from './Lab2AdminModesModal';
import { ArenaPermissionGuardModal } from './ArenaPermissionGuardModal';
import { arenaAudio } from '../../utils/arenaSoundEffects';

interface Lab2QuizArenaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialModeId?: string;
  initialMode?: string;
  user?: CadetProfile | null;
  isCadetPremium?: boolean;
  isAdmin?: boolean;
  onOpenUpgradeModal?: () => void;
}

interface ArenaQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  flashcard: {
    statement: string;
    isTrue: boolean;
    explanation: string;
  };
}

// Default topic tags per category
const DEFAULT_TOPIC_TAGS: Record<string, string[]> = {
  default: [
    'กฎการเคลื่อนที่ของนิวตัน',
    'ดาราศาสตร์และหลุมดำ',
    'คลื่นแม่เหล็กไฟฟ้าและแสง',
    'แรงโน้มถ่วงและวงโคจรเคปเลอร์',
    'ความดันและแรงลอยตัวของของไหล',
    'งาน พลังงาน และการอนุรักษ์',
    'เคมีอินทรีย์และพันธะเคมี',
    'ชีววิทยา พันธุศาสตร์และ DNA',
  ],
  general: [
    '🌍 ประชากร & ประเทศในโลก',
    '🏛️ สิ่งมหัศจรรย์และประวัติศาสตร์โลก',
    '🌊 มหาสมุทร & ท้องทะเลลึก',
    '🇹🇭 เกร็ดความรู้ประเทศไทย',
    '🏔️ ภูมิศาสตร์ & ยอดเขาสูงสุด',
    '🏆 สถิติโลกกินเนสส์บุ๊ค',
  ],
  scientists: [
    '🔭 กาลิเลโอกับกล้องโทรทรรศน์',
    '💡 ไอน์สไตน์ & รางวัลโนเบล',
    '⚡ นิโคลา เทสลา & ไฟฟ้า AC',
    '🧪 มารี กูรี & กัมมันตรังสี',
    '🍎 ไอแซก นิวตัน & แรงโน้มถ่วง',
    '🏆 รวมรางวัลโนเบล & สิ่งประดิษฐ์',
  ],
};

// 12 รายการแบบทดสอบสำเร็จรูป คลังแบบทดสอบ Ready-to-Play
export interface ReadyQuizPreset {
  id: string;
  title: string;
  category: string;
  grade: string;
  icon: string;
  colorTheme: 'emerald' | 'cyan' | 'purple' | 'amber' | 'rose' | 'indigo';
  format: ArenaQuizFormat;
  questionCount: number;
  highlight: string;
}

export const READY_QUIZ_PRESETS: ReadyQuizPreset[] = [
  {
    id: 'ready-1',
    title: 'สิ่งมีชีวิตและพืชรอบตัว',
    category: 'ชีววิทยา & ธรรมชาติ',
    grade: 'ประถม - ม.ต้น',
    icon: '🌱',
    colorTheme: 'emerald',
    format: 'quiz',
    questionCount: 15,
    highlight: 'การสังเคราะห์ด้วยแสง คลอโรฟิลล์ และระบบนิเวศ',
  },
  {
    id: 'ready-2',
    title: 'แรงและการเคลื่อนที่เบื้องต้น',
    category: 'วิทยาศาสตร์กายภาพ',
    grade: 'ประถม - ม.ต้น',
    icon: '⚡',
    colorTheme: 'cyan',
    format: 'quiz',
    questionCount: 15,
    highlight: 'แรงเสียดทาน ความเร็ว อัตราเร็ว และแรงโน้มถ่วง',
  },
  {
    id: 'ready-3',
    title: 'วงจรไฟฟ้าและสารในชีวิตประจำวัน',
    category: 'พลังงาน & เคมีประจำวัน',
    grade: 'ประถม - ม.ต้น',
    icon: '💡',
    colorTheme: 'amber',
    format: 'quiz',
    questionCount: 15,
    highlight: 'วงจรอนุกรม-ขนาน กฎของโอห์ม และความเป็นกรด-เบส',
  },
  {
    id: 'ready-4',
    title: 'ภูมิศาสตร์และดวงดาวพื้นฐาน',
    category: 'โลก ดาราศาสตร์ & อวกาศ',
    grade: 'ประถม - ม.ต้น',
    icon: '🌍',
    colorTheme: 'indigo',
    format: 'quiz',
    questionCount: 15,
    highlight: 'ชั้นบรรยากาศ ข้างขึ้นข้างแรม และกลุ่มดาวบนฟ้า',
  },
  {
    id: 'ready-5',
    title: 'เซลล์พืช เซลล์สัตว์ และสารอาหาร',
    category: 'ชีววิทยา & สรีรวิทยา',
    grade: 'ม.ต้น - ม.ปลาย',
    icon: '🧬',
    colorTheme: 'emerald',
    format: 'quiz',
    questionCount: 15,
    highlight: 'ออร์แกเนลล์ ไมโทคอนเดรีย สารอาหาร 5 หมู่ และเอนไซม์',
  },
  {
    id: 'ready-6',
    title: 'ธาตุ สารประกอบ และปฏิกิริยาเคมี',
    category: 'เคมี & สสาร',
    grade: 'ม.ต้น - ม.ปลาย',
    icon: '⚗️',
    colorTheme: 'purple',
    format: 'quiz',
    questionCount: 15,
    highlight: 'ตารางธาตุ พันธะเคมี และปฏิกิริยาดูด-คายความร้อน',
  },
  {
    id: 'ready-7',
    title: 'คลื่น แสง เสียง และพันธุศาสตร์',
    category: 'ฟิสิกส์คลื่น & พันธุศาสตร์',
    grade: 'ม.ต้น - ม.ปลาย',
    icon: '🌊',
    colorTheme: 'cyan',
    format: 'quiz',
    questionCount: 15,
    highlight: 'การสะท้อน การหักเห ดอปเปลอร์ DNA และยีน',
  },
  {
    id: 'ready-8',
    title: 'ระบบสุริยะและดาราศาสตร์ฟิสิกส์',
    category: 'ดาราศาสตร์ & จักรวาล',
    grade: 'ม.ต้น - ม.ปลาย',
    icon: '🪐',
    colorTheme: 'indigo',
    format: 'quiz',
    questionCount: 15,
    highlight: 'ดาวเคราะห์ 8 ดวง กฎเคปเลอร์ ฟิวชัน และหลุมดำ',
  },
  {
    id: 'ready-9',
    title: 'กลศาสตร์ การเคลื่อนที่ และแรงนิวตัน',
    category: 'ฟิสิกส์กลศาสตร์',
    grade: 'ม.ปลาย / สอวน.',
    icon: '🎯',
    colorTheme: 'rose',
    format: 'quiz',
    questionCount: 15,
    highlight: 'กฎการเคลื่อนที่นิวตัน โพรเจกไทล์ และวงกลม',
  },
  {
    id: 'ready-10',
    title: 'งาน พลังงาน และโมเมนตัม',
    category: 'ฟิสิกส์ ม.ปลาย',
    grade: 'ม.ปลาย / สอวน.',
    icon: '🚀',
    colorTheme: 'amber',
    format: 'quiz',
    questionCount: 15,
    highlight: 'การอนุรักษ์พลังงาน การชน โมเมนตัม และกำลัง',
  },
  {
    id: 'ready-11',
    title: 'ไฟฟ้าแม่เหล็ก ฟิสิกส์อะตอม และนิวเคลียร์',
    category: 'ฟิสิกส์ขั้นสูง / TCAS',
    grade: 'ม.ปลาย / มหาวิทยาลัย',
    icon: '⚛️',
    colorTheme: 'purple',
    format: 'quiz',
    questionCount: 15,
    highlight: 'กฎคูลอมบ์ แม่เหล็กไฟฟ้า ควอนตัม ฟิชชัน และฟิวชัน',
  },
  {
    id: 'ready-12',
    title: 'นักวิทยาศาสตร์เอกของโลก',
    category: 'ประวัติศาสตร์วิทยาศาสตร์',
    grade: 'ทุกระดับชั้น',
    icon: '🔬',
    colorTheme: 'cyan',
    format: 'flashcard',
    questionCount: 15,
    highlight: 'ไอน์สไตน์ นิวตัน มารี กูรี เทสลา กาลิเลโอ และดาร์วิน',
  },
];

export const Lab2QuizArenaModal: React.FC<Lab2QuizArenaModalProps> = ({
  isOpen,
  onClose,
  lang,
  initialModeId,
  initialMode = 'quiz',
  user = null,
  isCadetPremium = false,
  isAdmin = false,
  onOpenUpgradeModal,
}) => {
  // Modes state loaded from persistent storage
  const [modes, setModes] = useState<ArenaModeConfig[]>(() => loadArenaModes());
  const [selectedModeId, setSelectedModeId] = useState<string>('mode_quiz_standard');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminInitialEditId, setAdminInitialEditId] = useState<string | null>(null);

  // Fullscreen State for Lab 2 Modal
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFullscreen(false);
    }
  }, [isOpen]);
  const [isArenaGuardOpen, setIsArenaGuardOpen] = useState(false);

  // Role-Based Access Control (RBAC): Admin & Premium Only
  const isCadetAdmin = Boolean(
    isUserAdminOrDev() ||
    isAdmin ||
    user?.role === 'Admin' ||
    user?.role === 'Developer' ||
    (user as any)?.isAdmin === true ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_is_admin') === 'true' ||
        localStorage.getItem('ssl_is_developer') === 'true'))
  );

  const isUserPremium = Boolean(
    isCadetPremium ||
    user?.isPremium === true ||
    user?.role === 'Premium' ||
    (typeof window !== 'undefined' &&
      (localStorage.getItem('ssl_premium_pdf_unlocked') === 'true' ||
        localStorage.getItem('isPremium') === 'true'))
  );

  const canManageArena = isCadetAdmin || isUserPremium;

  const handleOpenAdminModal = (initialEditId?: string) => {
    if (!canManageArena) {
      setIsArenaGuardOpen(true);
      return;
    }
    setAdminInitialEditId(initialEditId || null);
    setIsAdminModalOpen(true);
  };

  // Screen state: 'setup' | 'playing' | 'summary'
  const [screen, setScreen] = useState<'setup' | 'playing' | 'summary'>('setup');

  // Generator inputs
  const [playFormat, setPlayFormat] = useState<ArenaQuizFormat>('quiz');
  const [topic, setTopic] = useState('กฎการเคลื่อนที่ของนิวตันและแรงดึงดูดสากล');
  const [questionCount, setQuestionCount] = useState<number>(15);
  const [level, setLevel] = useState<AcademicLevel>('middle');
  const [difficulty, setDifficulty] = useState<GeneralDifficulty>('medium');
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  // Dynamic Topic Tags (Custom Category Tags with LocalStorage persistence)
  const [topicTagsMap, setTopicTagsMap] = useState<Record<string, string[]>>(() => {
    try {
      const raw = localStorage.getItem('lab2_custom_topic_tags_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_TOPIC_TAGS,
            ...parsed,
          };
        }
      }
    } catch (e) {
      console.warn('Failed to load topic tags from localStorage', e);
    }
    return DEFAULT_TOPIC_TAGS;
  });

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  // Reload modes whenever modal opens or storage changes
  useEffect(() => {
    if (isOpen) {
      const loaded = loadArenaModes();
      setModes(loaded);

      // Find matching mode
      const matched =
        loaded.find((m) => m.id === initialModeId) ||
        loaded.find(
          (m) =>
            m.format === initialMode ||
            m.id.includes(initialMode || '') ||
            (initialMode === 'didyouknow_general' && m.id === 'mode_flashcard_general') ||
            (initialMode === 'didyouknow_scientists' && m.id === 'mode_flashcard_scientists')
        ) ||
        loaded[0] ||
        DEFAULT_ARENA_MODES[0];

      if (matched) {
        setSelectedModeId(matched.id);
        setPlayFormat(matched.format);
        setTopic(matched.topic);
        setQuestionCount(matched.questionCount || 15);
        setLevel(matched.level || 'middle');
        setDifficulty(matched.difficulty || 'medium');
      }
    }
  }, [isOpen, initialModeId, initialMode]);

  // Synchronize dynamic modes and auto-reset active mode when updated or deleted
  useEffect(() => {
    const handleStorageChange = () => {
      const loaded = loadArenaModes();
      setModes(loaded);
      setSelectedModeId((prevId) => {
        if (!loaded.find((m) => m.id === prevId)) {
          if (loaded.length > 0) {
            const first = loaded[0];
            setPlayFormat(first.format);
            setTopic(first.topic);
            if (first.questionCount) setQuestionCount(first.questionCount);
            setLevel(first.level || 'middle');
            setDifficulty(first.difficulty || 'medium');
            return first.id;
          }
        }
        return prevId;
      });
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('arena_modes_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('arena_modes_updated', handleStorageChange);
    };
  }, []);

  // Questions Pool (Randomized 12-20 Questions)
  const [questions, setQuestions] = useState<ArenaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Mode 1: Multiple Choice State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Mode 2: Flashcard State
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardAnswer, setFlashcardAnswer] = useState<boolean | null>(null);
  const [flashcardScore, setFlashcardScore] = useState(0);

  // Audio Controller State (persisted in LocalStorage)
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('lab2_arena_sound_enabled');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    setIsSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('lab2_arena_sound_enabled', String(next));
      } catch (err) {
        console.warn('Failed to save sound preference to localStorage:', err);
      }
      if (next) {
        arenaAudio.playToggle(true);
      }
      return next;
    });
  };

  // Active Tag Category Key based on mode
  const currentTagCategoryKey =
    selectedModeId === 'mode_flashcard_general'
      ? 'general'
      : selectedModeId === 'mode_flashcard_scientists'
      ? 'scientists'
      : 'default';

  const activeTopicTags =
    topicTagsMap[currentTagCategoryKey] ||
    topicTagsMap.default ||
    DEFAULT_TOPIC_TAGS.default;

  // Add custom topic tag handler
  const handleAddCustomTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) {
      setIsAddingTag(false);
      return;
    }

    const currentList = topicTagsMap[currentTagCategoryKey] || [];
    const updatedList = currentList.includes(trimmed) ? currentList : [...currentList, trimmed];
    const updatedMap = {
      ...topicTagsMap,
      [currentTagCategoryKey]: updatedList,
    };
    setTopicTagsMap(updatedMap);
    try {
      localStorage.setItem('lab2_custom_topic_tags_v1', JSON.stringify(updatedMap));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    // Auto-select as active topic
    setTopic(trimmed);
    setNewTagInput('');
    setIsAddingTag(false);
  };

  // Delete topic tag handler
  const handleDeleteTag = (tagToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentList = topicTagsMap[currentTagCategoryKey] || [];
    const updatedList = currentList.filter((t) => t !== tagToDelete);
    const updatedMap = {
      ...topicTagsMap,
      [currentTagCategoryKey]: updatedList,
    };
    setTopicTagsMap(updatedMap);
    try {
      localStorage.setItem('lab2_custom_topic_tags_v1', JSON.stringify(updatedMap));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    if (topic === tagToDelete && updatedList.length > 0) {
      setTopic(updatedList[0]);
    }
  };

  // Reset to default tags
  const handleResetTags = () => {
    if (confirm('ต้องการคืนค่ารายการแท็กหัวข้อเริ่มต้นหรือไม่?')) {
      setTopicTagsMap(DEFAULT_TOPIC_TAGS);
      try {
        localStorage.removeItem('lab2_custom_topic_tags_v1');
      } catch (err) {
        console.warn('LocalStorage remove error:', err);
      }
      const defaultList = DEFAULT_TOPIC_TAGS[currentTagCategoryKey] || DEFAULT_TOPIC_TAGS.default;
      if (defaultList.length > 0) {
        setTopic(defaultList[0]);
      }
    }
  };

  if (!isOpen) return null;

  const currentSelectedMode =
    modes.find((m) => m.id === selectedModeId) || modes[0] || DEFAULT_ARENA_MODES[0];

  // Quick Launch Ready-to-play Preset (Instant, 0 wait time, 0 coins deducted)
  const handlePlayReadyPreset = (preset: ReadyQuizPreset) => {
    const count = preset.questionCount || 15;
    const generated = generateLocal20Questions(
      preset.title,
      'middle',
      preset.format,
      'medium',
      count
    );
    setTopic(preset.title);
    setPlayFormat(preset.format);
    setQuestionCount(count);
    setQuestions(generated.slice(0, count));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setQuizScore(0);
    setStreak(0);
    setIsFlipped(false);
    setFlashcardAnswer(null);
    setFlashcardScore(0);
    setScreen('playing');
    if (isSoundEnabled) {
      arenaAudio.playToggle(true);
    }
  };

  const handleSelectModeItem = (mode: ArenaModeConfig) => {
    setSelectedModeId(mode.id);
    setPlayFormat(mode.format);
    setTopic(mode.topic);
    if (mode.questionCount) {
      setQuestionCount(mode.questionCount);
    }
    setLevel(mode.level || 'middle');
    setDifficulty(mode.difficulty || 'medium');
  };

  const handleSaveUpdatedModes = (newModes: ArenaModeConfig[]) => {
    setModes(newModes);
    saveArenaModes(newModes);
    if (!newModes.find((m) => m.id === selectedModeId)) {
      if (newModes.length > 0) {
        handleSelectModeItem(newModes[0]);
      }
    }
  };

  // Generate live questions via Gemini Flash API (Exact specified question count)
  const handleGenerateArena = async () => {
    const targetCount = Math.max(1, Math.min(50, Number(questionCount) || 10));

    setIsGenerating(true);
    setStatusMessage(`กำลังเชื่อมต่อ Gemini Flash เพื่อสร้างโจทย์สด ${targetCount} ข้อ...`);

    try {
      const response = await fetch('/api/gemini/generate-arena-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim() || currentSelectedMode.topic || 'ฟิสิกส์และดาราศาสตร์',
          level,
          mode:
            currentSelectedMode.id === 'mode_flashcard_general'
              ? 'didyouknow_general'
              : currentSelectedMode.id === 'mode_flashcard_scientists'
              ? 'didyouknow_scientists'
              : playFormat,
          difficulty,
          count: targetCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned an error');
      }

      const data = await response.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        // Guarantee strict question count limit from API response
        const strictQuestions = data.questions.slice(0, targetCount).map((q: any, i: number) => ({
          ...q,
          id: i + 1,
        }));
        setQuestions(strictQuestions);
      } else {
        throw new Error('No questions returned');
      }

      // Reset gameplay state
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setQuizScore(0);
      setStreak(0);
      setIsFlipped(false);
      setFlashcardAnswer(null);
      setFlashcardScore(0);
      setScreen('playing');
    } catch (err) {
      console.warn('Fallback generating questions:', err);
      const generated = generateLocal20Questions(
        topic.trim() || currentSelectedMode.topic || 'ฟิสิกส์และดาราศาสตร์',
        level,
        currentSelectedMode.id === 'mode_flashcard_general'
          ? 'didyouknow_general'
          : currentSelectedMode.id === 'mode_flashcard_scientists'
          ? 'didyouknow_scientists'
          : playFormat,
        difficulty,
        targetCount
      );
      setQuestions(generated.slice(0, targetCount));
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsAnswerChecked(false);
      setQuizScore(0);
      setStreak(0);
      setIsFlipped(false);
      setFlashcardAnswer(null);
      setFlashcardScore(0);
      setScreen('playing');
    } finally {
      setIsGenerating(false);
      setStatusMessage('');
    }
  };

  // Multiple Choice Option Selection
  const handleSelectOption = (index: number) => {
    if (isAnswerChecked) return;
    setSelectedOption(index);
    setIsAnswerChecked(true);

    const isCorrect = index === questions[currentIndex]?.correctIndex;
    if (isCorrect) {
      setQuizScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      if (isSoundEnabled) {
        arenaAudio.playCorrect();
      }
    } else {
      setStreak(0);
      if (isSoundEnabled) {
        arenaAudio.playWrong();
      }
    }
  };

  // Energy award for completing a quiz/flashcard set (+5 Energy)
  const awardQuizEnergy = () => {
    try {
      const currentEnergy = Number(localStorage.getItem('ssl_cosmic_energy') || 150);
      const newEnergy = currentEnergy + 5;
      localStorage.setItem('ssl_cosmic_energy', String(newEnergy));
      const cadetSaved = localStorage.getItem('cadet_profile');
      if (cadetSaved) {
        const parsed = JSON.parse(cadetSaved);
        parsed.cosmicEnergy = newEnergy;
        localStorage.setItem('cadet_profile', JSON.stringify(parsed));
      }
      window.dispatchEvent(new CustomEvent('ssl_cadet_energy_updated', { detail: { cosmicEnergy: newEnergy } }));
    } catch (e) {
      console.warn('LocalStorage energy save error:', e);
    }
  };

  // Advance Multiple Choice
  const handleNextQuizQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerChecked(false);
    } else {
      awardQuizEnergy();
      setScreen('summary');
      if (isSoundEnabled) {
        arenaAudio.playVictory();
      }
    }
  };

  // Flashcard True/False Answer
  const handleAnswerFlashcard = (userSaidTrue: boolean) => {
    if (isFlipped) return;
    setFlashcardAnswer(userSaidTrue);
    setIsFlipped(true);

    const isCorrect = userSaidTrue === questions[currentIndex]?.flashcard?.isTrue;
    if (isCorrect) {
      setFlashcardScore((prev) => prev + 1);
      if (isSoundEnabled) {
        arenaAudio.playCorrect();
      }
    } else {
      if (isSoundEnabled) {
        arenaAudio.playWrong();
      }
    }
  };

  // Advance Flashcard
  const handleNextFlashcard = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      setFlashcardAnswer(null);
    } else {
      awardQuizEnergy();
      setScreen('summary');
      if (isSoundEnabled) {
        arenaAudio.playVictory();
      }
    }
  };

  const currentQ = questions[currentIndex];
  const activeColorTheme = ARENA_COLOR_MAP[currentSelectedMode.colorTheme] || ARENA_COLOR_MAP.indigo;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isFullscreen ? 'p-0' : 'p-1 sm:p-2.5 md:p-3'
      } bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200`}
    >
      <div
        className={`relative w-full ${
          isFullscreen
            ? 'w-screen h-screen rounded-none max-w-none max-h-none border-none'
            : 'w-full max-w-[99vw] h-[95vh] rounded-2xl sm:rounded-3xl border border-slate-700/80'
        } bg-slate-900 shadow-2xl flex flex-col overflow-hidden text-slate-100 transition-all duration-200`}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-950/80 border border-purple-500/40 text-purple-400 shadow-sm shadow-purple-950/50">
              <Sparkles className="w-5 h-5 text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.85)]" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>ห้องประลองความรู้ & แฟลชการ์ด</span>
                </h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  AI สร้างโจทย์สด {questionCount} ข้อ
                </span>
              </div>
              <span className="text-xs text-slate-400">
                Interactive Quiz & Flashcard Arena • ระบบตรวจและเฉลยทันที พร้อมสร้างและกำหนดจำนวนข้อได้เอง
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {screen === 'setup' && (
              <button
                type="button"
                onClick={() => handleOpenAdminModal()}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-950/40 hover:from-amber-500/30 hover:to-indigo-900 border border-amber-500/40 text-amber-300 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-xs"
                title="จัดการและสร้างโหมดประลอง (เฉพาะบัญชีแอดมินและสมาชิก Premium)"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="hidden sm:inline">จัดการโหมด</span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                  PREMIUM
                </span>
              </button>
            )}

            {screen === 'playing' && (
              <button
                onClick={() => setScreen('setup')}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>เปลี่ยนโหมด/หัวข้อ</span>
              </button>
            )}

            {/* Audio Toggle Controller (เปิดเสียง / ปิดเสียง พร้อมไอคอน SVG เส้นเวกเตอร์นีออนเลเซอร์) */}
            <button
              type="button"
              onClick={toggleSound}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                isSoundEnabled
                  ? 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-950/50'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-400'
              }`}
              title={isSoundEnabled ? 'คลิกเพื่อปิดเสียง' : 'คลิกเพื่อเปิดเสียง'}
              aria-label={isSoundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
            >
              {isSoundEnabled ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 text-emerald-400 shrink-0 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <span className="text-xs font-medium">เปิดเสียง</span>
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3.5 h-3.5 text-slate-400 shrink-0"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="22" y1="2" x2="2" y2="22" />
                  </svg>
                  <span className="text-xs font-medium">ปิดเสียง</span>
                </>
              )}
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isFullscreen ? 'ย่อหน้าต่างกลับเดิม' : 'ขยายเต็มจอ (Fullscreen)'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5 text-amber-300" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body - Full Width Layout */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-5 bg-slate-950 flex flex-col min-h-0">
          {/* ======================================================== */}
          {/* 1. SETUP / GENERATOR SCREEN (2-COLUMN 65% : 35% LAYOUT)  */}
          {/* ======================================================== */}
          {screen === 'setup' && (
            <div className="w-full flex-1 flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch min-h-0">
              
              {/* ===================================================== */}
              {/* LEFT COLUMN: 65% - พื้นที่หลัก AI GENERATOR           */}
              {/* ===================================================== */}
              <div className="w-full lg:w-[65%] flex flex-col justify-between space-y-4 bg-slate-900/60 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl overflow-y-auto">
                <div className="space-y-4">
                  {/* Top Header Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 gap-2 flex-wrap">
                    <div>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950/80 border border-indigo-500/40 text-cyan-300 mb-1">
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                        <span>Gemini Flash AI สุ่มสร้างโจทย์สด</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        ระบบสร้างโจทย์และแฟลชการ์ดสด (AI Generator)
                      </h2>
                      <p className="text-xs text-slate-400">
                        เลือกโหมดและปรับแต่งข้อสอบสด AI จะสร้างคำถามพร้อมตรวจและเฉลยทันที
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenAdminModal('NEW')}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 cursor-pointer transition-colors bg-amber-950/40 hover:bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-xs group"
                        title="สร้าง/แก้ไขโหมดประลอง (เฉพาะบัญชีแอดมินและสมาชิก Premium)"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400 group-hover:scale-110 transition-transform" />
                        <span>+ สร้าง/แก้ไขโหมด</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500 text-slate-950">
                          PREMIUM
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Mode Selector - 4 Core Modes Grid */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono mb-2">
                      โหมดการประลองความรู้ ({modes.length} โหมด)
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {modes.map((mode) => {
                        const isSelected = selectedModeId === mode.id;
                        const colorCfg = ARENA_COLOR_MAP[mode.colorTheme] || ARENA_COLOR_MAP.indigo;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => handleSelectModeItem(mode)}
                            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start justify-between gap-2.5 ${
                              isSelected
                                ? `bg-slate-900 border-white ring-2 ring-white/70 text-white shadow-xl scale-[1.01]`
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 flex-1 min-w-0">
                              <div
                                className={`w-8 h-8 rounded-xl ${colorCfg.bg} text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5`}
                              >
                                {renderArenaIcon(mode.iconName, 'w-4 h-4')}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-white mb-0.5 flex-wrap">
                                  <span className="truncate">{mode.title}</span>
                                  <span
                                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${colorCfg.badgeBg} ${colorCfg.badgeText}`}
                                  >
                                    {mode.format === 'quiz' ? '4 ตัวเลือก' : 'แฟลชการ์ด'}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                                  {mode.subtitle || mode.topic}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 mt-1">
                              <div
                                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                  isSelected
                                    ? 'border-white bg-white text-slate-950'
                                    : 'border-slate-600'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Format Toggle (4 Choices vs Flashcards) */}
                  <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div>
                      <span className="text-xs font-bold text-slate-300 font-mono">
                        รูปแบบการเล่น:
                      </span>
                      <div className="text-xs sm:text-sm font-bold text-white mt-0.5">
                        {playFormat === 'quiz' ? 'โหมด 4 ตัวเลือก (Multiple Choice)' : 'โหมดแฟลชการ์ด ใช่/ไม่ใช่ (True/False)'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setPlayFormat('quiz')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          playFormat === 'quiz'
                            ? 'bg-indigo-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>4 ตัวเลือก</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlayFormat('flashcard')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          playFormat === 'flashcard'
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>แฟลชการ์ด (ใช่/ไม่ใช่)</span>
                      </button>
                    </div>
                  </div>

                  {/* Question Count Selector (5, 10, 15, 20, 25, 30 ข้อ และกำหนดเอง) */}
                  <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                        จำนวนข้อสอบ / แฟลชการ์ด
                      </label>
                      <span className="text-xs font-bold text-cyan-400 font-mono">
                        {questionCount} ข้อ
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap pt-0.5">
                      {[5, 10, 15, 20, 25, 30].map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          onClick={() => setQuestionCount(cnt)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            questionCount === cnt
                              ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400'
                              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {cnt} ข้อ
                        </button>
                      ))}

                      <div className="flex items-center gap-1.5 ml-auto">
                        <span className="text-xs text-slate-400">กำหนดเอง:</span>
                        <input
                          type="number"
                          min={1}
                          max={50}
                          value={questionCount}
                          onChange={(e) => setQuestionCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                          className="w-16 px-2.5 py-1 text-center rounded-xl bg-slate-950 border border-slate-700 text-white text-xs font-bold font-mono focus:border-cyan-400 outline-hidden"
                        />
                        <span className="text-xs text-slate-400">ข้อ</span>
                      </div>
                    </div>
                  </div>

                  {/* Topic Input Box & Dynamic Tag Manager */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <span>หัวข้อ / หมวดหมู่ที่ต้องการประลอง (ป้อนปรับแต่งได้)</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleResetTags}
                          className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer flex items-center gap-1"
                          title="คืนค่ารายการแท็กหัวข้อเริ่มต้น"
                        >
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>คืนค่าแท็ก</span>
                        </button>
                        <span className="text-[10px] text-cyan-400 font-mono font-bold">
                          {questionCount} ข้อ
                        </span>
                      </div>
                    </div>

                    {/* Free Text Input */}
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="เช่น กฎของนิวตัน, ระบบสุริยะ, เคมีอินทรีย์, พันธุศาสตร์, ไฟฟ้าสถิต..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 outline-hidden transition-all font-medium"
                    />

                    {/* Dynamic Category Tags Strip */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {activeTopicTags.map((t) => {
                        const isSelected = topic === t;
                        return (
                          <div
                            key={t}
                            onClick={() => setTopic(t)}
                            className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-xl border transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'bg-indigo-600 border-indigo-400 text-white font-bold shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400/40'
                                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <span className="truncate max-w-[180px]">{t}</span>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteTag(t, e)}
                              title={`ลบแท็ก "${t}"`}
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                                isSelected
                                  ? 'text-indigo-200 hover:text-white hover:bg-rose-600'
                                  : 'text-slate-400 hover:text-rose-400 hover:bg-rose-950/60'
                              }`}
                            >
                              <X className="w-2.5 h-2.5 stroke-[3]" />
                            </button>
                          </div>
                        );
                      })}

                      {/* Add New Tag Button / Inline Input */}
                      {!isAddingTag ? (
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingTag(true);
                            setNewTagInput('');
                          }}
                          className="px-2.5 py-1 text-[11px] rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-all shadow-xs hover:border-indigo-400"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>เพิ่มหัวข้อใหม่</span>
                        </button>
                      ) : (
                        <form
                          onSubmit={handleAddCustomTag}
                          className="inline-flex items-center gap-1 bg-slate-900 border border-indigo-400 ring-2 ring-indigo-500/30 rounded-xl p-0.5 animate-in fade-in zoom-in-95 duration-150"
                        >
                          <input
                            type="text"
                            autoFocus
                            value={newTagInput}
                            onChange={(e) => setNewTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') setIsAddingTag(false);
                            }}
                            placeholder="พิมพ์ชื่อหัวข้อใหม่..."
                            className="px-2.5 py-0.5 text-xs text-white bg-transparent outline-hidden w-36 sm:w-44 placeholder:text-slate-500 font-medium"
                          />
                          <button
                            type="submit"
                            className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-0.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>บันทึก</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingTag(false)}
                            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-xs cursor-pointer transition-colors"
                            title="ยกเลิก"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                  {/* Level & Difficulty Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Academic Level */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                        ระดับชั้นการศึกษา
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'primary', label: 'ประถม' },
                          { id: 'middle', label: 'ม.ต้น' },
                          { id: 'high', label: 'ม.ปลาย' },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setLevel(lvl.id as any)}
                            className={`py-1.5 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                              level === lvl.id
                                ? 'bg-indigo-950 border-indigo-400 text-indigo-200 ring-2 ring-indigo-400'
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Difficulty */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                        ระดับความยาก
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'easy', label: 'ง่าย', color: 'text-emerald-400 border-emerald-500' },
                          { id: 'medium', label: 'ปานกลาง', color: 'text-cyan-400 border-cyan-500' },
                          { id: 'hard', label: 'ยากมาก', color: 'text-rose-400 border-rose-500' },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setDifficulty(lvl.id as any)}
                            className={`py-1.5 px-2 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                              difficulty === lvl.id
                                ? `bg-slate-800 ${lvl.color} ring-2 ring-cyan-400`
                                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Start Button */}
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={handleGenerateArena}
                    disabled={isGenerating}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-600 to-cyan-600 hover:from-purple-600 hover:to-cyan-500 text-white font-bold text-base transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin text-purple-200" />
                        <span>{statusMessage || `กำลังสร้างโจทย์สด ${questionCount} ข้อ...`}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-amber-300" />
                        <span>
                          เริ่มประลองทันที (AI สร้างโจทย์สด) • {questionCount} ข้อ
                        </span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ===================================================== */}
              {/* RIGHT COLUMN: 35% - แถบข้าง "คลังแบบทดสอบ"            */}
              {/* ===================================================== */}
              <div className="w-full lg:w-[35%] flex flex-col bg-slate-900/80 p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-purple-500/30 shadow-xl min-h-0">
                {/* Header */}
                <div className="pb-3 border-b border-slate-800/80 shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shadow-xs">
                        <BookOpen className="w-4 h-4 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-1.5">
                          <span>คลังแบบทดสอบ</span>
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 border border-emerald-500/40">
                            12 ชุด
                          </span>
                        </h3>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-indigo-950/80 text-cyan-300 border border-cyan-500/30">
                      เล่นฟรี 0 เหรียญ
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    การ์ดแบบทดสอบสำเร็จรูป (Ready-to-play) กดแล้วเริ่มเล่นได้ทันที ไม่ต้องรอ AI เจน
                  </p>
                </div>

                {/* Vertical Scrollable List of Ready-to-Play Cards */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 mt-3.5 sleek-scrollbar min-h-0 max-h-[580px] lg:max-h-[660px]">
                  {READY_QUIZ_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handlePlayReadyPreset(preset)}
                      className="w-full p-3 sm:p-3.5 rounded-2xl border bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-purple-500/60 text-left transition-all cursor-pointer group flex items-center justify-between gap-3 shadow-md hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/40 flex items-center justify-center text-lg shrink-0 group-hover:scale-105 transition-transform shadow-xs">
                          {preset.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[11px] font-mono font-bold text-slate-400">
                              #{String(idx + 1).padStart(2, '0')}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {preset.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                              {preset.category}
                            </span>
                            <span>•</span>
                            <span className="text-purple-300 font-mono font-bold">
                              {preset.questionCount} ข้อ
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        <span className="hidden xl:inline-flex text-[11px] font-bold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          เล่นทันที
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-purple-600/30 group-hover:bg-purple-600 text-purple-300 group-hover:text-white border border-purple-500/40 flex items-center justify-center transition-all shadow-xs">
                          <Play className="w-3.5 h-3.5 fill-current" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* 2. PLAYING SCREEN: MULTIPLE CHOICE (4 CHOICES)           */}
          {/* ======================================================== */}
          {screen === 'playing' && playFormat === 'quiz' && currentQ && (
            <div className="max-w-2xl mx-auto w-full space-y-6 my-auto">
              {/* Progress & Stats Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-500/40 text-indigo-300 font-bold">
                    ข้อที่ {currentIndex + 1} / {questions.length}
                  </span>
                  {streak > 1 && (
                    <span className="px-2 py-0.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-bold animate-pulse">
                      🔥 Streak x{streak}
                    </span>
                  )}
                </div>
                <div className="text-slate-400">
                  คะแนนสะสม: <strong className="text-white text-sm">{quizScore}</strong> / {questions.length}
                </div>
              </div>

              {/* Progress Bar Line */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {currentQ.question}
                </div>

                {/* 4 Choices */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((opt, idx) => {
                    let btnStyle = 'bg-slate-950/70 border-slate-800 text-slate-200 hover:border-slate-700';
                    if (isAnswerChecked) {
                      if (idx === currentQ.correctIndex) {
                        btnStyle = 'bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400';
                      } else if (idx === selectedOption) {
                        btnStyle = 'bg-rose-950/90 border-rose-400 text-rose-100 ring-2 ring-rose-400';
                      } else {
                        btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerChecked}
                        className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${btnStyle} cursor-pointer disabled:cursor-default`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-white/10 font-mono text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isAnswerChecked && idx === currentQ.correctIndex && (
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                        )}
                        {isAnswerChecked && idx === selectedOption && idx !== currentQ.correctIndex && (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Instant Explanation Box after Selection */}
                {isAnswerChecked && (
                  <div className="p-4 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-xs sm:text-sm text-slate-200 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 font-bold text-cyan-300">
                      <Sparkles className="w-4 h-4" />
                      <span>
                        {selectedOption === currentQ.correctIndex ? 'ถูกต้องยอดเยี่ยม! 🎉' : 'ยังไม่ถูกต้อง 😊'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">{currentQ.explanation}</p>
                    <div className="flex justify-end pt-2">
                      {currentIndex < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNextQuizQuestion}
                          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>ข้อถัดไป</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setScreen('summary');
                            if (isSoundEnabled) {
                              arenaAudio.playVictory();
                            }
                          }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                        >
                          <span>ดูผลการประเมิน</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. PLAYING SCREEN: FLASHCARD (TRUE / FALSE)               */}
          {/* ======================================================== */}
          {screen === 'playing' && playFormat === 'flashcard' && currentQ && (
            <div className="max-w-xl mx-auto w-full space-y-6 my-auto">
              {/* Progress Bar */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                  การ์ดที่ {currentIndex + 1} / {questions.length}
                </span>
                <div className="text-slate-400">
                  ทายถูก: <strong className="text-white text-sm">{flashcardScore}</strong> / {questions.length}
                </div>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* 3D Interactive Flip Card */}
              <div className="p-8 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl min-h-[260px] flex flex-col justify-between text-center relative overflow-hidden">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-purple-950/80 border border-purple-500/40 text-purple-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>เกร็ดความรู้ • จริง หรือ เท็จ?</span>
                  </span>
                  <div className="text-lg sm:text-xl font-bold text-white leading-relaxed pt-2">
                    {currentQ.flashcard.statement}
                  </div>
                </div>

                {/* True/False Buttons (Before Flip) */}
                {!isFlipped ? (
                  <div className="grid grid-cols-2 gap-4 pt-6">
                    <button
                      onClick={() => handleAnswerFlashcard(true)}
                      className="py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                      <span>จริง (ใช่)</span>
                    </button>
                    <button
                      onClick={() => handleAnswerFlashcard(false)}
                      className="py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-102"
                    >
                      <X className="w-5 h-5 stroke-[3]" />
                      <span>ไม่จริง (เท็จ)</span>
                    </button>
                  </div>
                ) : (
                  /* Flipped Explanation & Next Button */
                  <div className="space-y-4 pt-4 border-t border-slate-800 animate-in fade-in">
                    <div className="flex items-center justify-center gap-2">
                      {flashcardAnswer === currentQ.flashcard.isTrue ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                          <CheckCircle className="w-4 h-4" />
                          <span>ทายถูกต้อง! (เฉลยคือ: {currentQ.flashcard.isTrue ? 'จริง' : 'ไม่จริง'})</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950 border border-rose-500/40 text-rose-300 text-xs font-bold">
                          <XCircle className="w-4 h-4" />
                          <span>ยังไม่ถูก (เฉลยที่ถูกต้องคือ: {currentQ.flashcard.isTrue ? 'จริง' : 'ไม่จริง'})</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed px-2">
                      {currentQ.flashcard.explanation}
                    </p>

                    <div className="flex justify-end pt-2">
                      {currentIndex < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={handleNextFlashcard}
                          className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-bold text-sm text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer"
                        >
                          <span>การ์ดถัดไป</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setScreen('summary');
                            if (isSoundEnabled) {
                              arenaAudio.playVictory();
                            }
                          }}
                          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center gap-2 cursor-pointer animate-pulse"
                        >
                          <span>ดูผลการประเมิน</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* 4. SUMMARY SCREEN                                        */}
          {/* ======================================================== */}
          {screen === 'summary' && (
            <div className="max-w-md mx-auto w-full text-center space-y-6 my-auto">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-950/80 border border-amber-500/50 text-amber-400 flex items-center justify-center shadow-xl shadow-amber-950/50 animate-bounce">
                <Trophy className="w-10 h-10" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  เสร็จสิ้นการประลอง!
                </h2>
                <p className="text-xs text-slate-400">
                  โหมด: <strong>{currentSelectedMode.title}</strong> • ({topic})
                </p>
              </div>

              {/* Score Display Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  คะแนนที่ทำได้
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white">
                  {playFormat === 'quiz' ? quizScore : flashcardScore}{' '}
                  <span className="text-slate-600 text-2xl">/ {questions.length}</span>
                </div>
                <p className="text-xs text-emerald-400 font-semibold pt-1">
                  +100 EXP สะสมเข้าสู่ระบบ Cadet Profile เรียบร้อย
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setCurrentIndex(0);
                    setSelectedOption(null);
                    setIsAnswerChecked(false);
                    setQuizScore(0);
                    setIsFlipped(false);
                    setFlashcardAnswer(null);
                    setFlashcardScore(0);
                    setScreen('playing');
                  }}
                  className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm cursor-pointer transition-all"
                >
                  เล่นซ้ำโจทย์เดิม 🔄
                </button>

                <button
                  onClick={() => setScreen('setup')}
                  className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all"
                >
                  สร้างโจทย์รอบใหม่ ⚡
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Admin Modes Studio Modal */}
      <Lab2AdminModesModal
        isOpen={isAdminModalOpen}
        onClose={() => {
          setIsAdminModalOpen(false);
          setAdminInitialEditId(null);
        }}
        modes={modes}
        onSaveModes={handleSaveUpdatedModes}
        initialEditingId={adminInitialEditId}
        canManage={canManageArena}
        user={user}
        onOpenUpgrade={onOpenUpgradeModal}
      />

      {/* Permission Guard Modal for Unauthorized Access */}
      <ArenaPermissionGuardModal
        isOpen={isArenaGuardOpen}
        onClose={() => setIsArenaGuardOpen(false)}
        userName={user?.name}
        userRole={user?.role}
        onOpenUpgrade={onOpenUpgradeModal}
      />
    </div>
  );
};

// =========================================================================
// Fallback Randomized Questions Generator (Guarantees zero-failure resilience)
// =========================================================================
function generateLocal20Questions(
  topic: string,
  level: string,
  mode: string = 'quiz',
  difficulty: GeneralDifficulty = 'medium',
  count: number = 20
): ArenaQuestion[] {
  const lowerTopic = (topic || '').toLowerCase();
  let selectedPool: any[] = [];

  if (lowerTopic.includes('สิ่งมีชีวิต') || lowerTopic.includes('พืช')) {
    selectedPool = [
      {
        question: 'กระบวนการสังเคราะห์ด้วยแสง (Photosynthesis) ของพืชเกิดขึ้นที่ออร์แกเนลล์ใดและได้ผลผลิตหลักคืออะไร?',
        options: [
          'คลอโรพลาสต์ (Chloroplast) ได้น้ำตาลกลูโคสและก๊าซออกซิเจน',
          'ไมโทคอนเดรีย ได้ก๊าซคาร์บอนไดออกไซด์และน้ำ',
          'ไรโบโซม ได้โปรตีนและกรดอะมิโน',
          'แวคิวโอล ได้น้ำและเกลือแร่',
        ],
        correctIndex: 0,
        explanation: 'พืชใช้คลอโรฟิลล์ในคลอโรพลาสต์ดูดกลืนพลังงานแสง เปลี่ยนน้ำและคาร์บอนไดออกไซด์เป็นน้ำตาลกลูโคสและปล่อยออกซิเจน',
        flashcard: {
          statement: 'การคายน้ำของพืชส่วนใหญ่เกิดขึ้นทาง "ปากใบ" (Stomata) ที่อยู่บริเวณผิวใบ',
          isTrue: true,
          explanation: 'ถูกต้อง: ปากใบทำหน้าที่ควบคุมการคายน้ำและการแลกเปลี่ยนก๊าซของพืช',
        },
      },
      {
        question: 'ข้อใดคือลักษณะสำคัญของพืชใบเลี้ยงเดี่ยว (Monocotyledon)?',
        options: [
          'มีเส้นใบเรียงขนานกัน และระบบรากเป็นรากฝอย',
          'มีเส้นใบเป็นร่างแห และมีระบบรากแก้ว',
          'มีท่อลำเลียงเรียงตัวเป็นระเบียบเป็นวงกลม',
          'กลีบดอกมีจำนวนทวีคูณของ 4 หรือ 5',
        ],
        correctIndex: 0,
        explanation: 'พืชใบเลี้ยงเดี่ยว เช่น ข้าว หญ้า มะพร้าว จะมีเส้นใบขนาน ระบบรากฝอย และกลีบดอกทวีคูณของ 3',
        flashcard: {
          statement: 'พืชสีเขียวจัดเป็น "ผู้ผลิต" (Producer) ในระบบนิเวศเพราะสามารถสร้างอาหารเองได้',
          isTrue: true,
          explanation: 'ถูกต้อง: ผู้ผลิตสามารถเปลี่ยนพลังงานแสงอาทิตย์เป็นพลังงานเคมีผ่านกระบวนการสังเคราะห์ด้วยแสง',
        },
      },
      {
        question: 'ท่อลำเลียงที่ทำหน้าที่ลำเลียงน้ำและแร่ธาตุจากรากขึ้นสู่ใบในพืชเรียกว่าอะไร?',
        options: ['ไซเลม (Xylem)', 'โฟลเอ็ม (Phloem)', 'แคมเบียม (Cambium)', 'คอร์เทกซ์ (Cortex)'],
        correctIndex: 0,
        explanation: 'ไซเลม (Xylem) ทำหน้าที่ลำเลียงน้ำและแร่ธาตุขึ้นสู่ยอด ส่วนโฟลเอ็ม (Phloem) ลำเลียงอาหารที่พืชสร้างขึ้น',
        flashcard: {
          statement: 'พืชหายใจเฉพาะในเวลากลางคืนเท่านั้น ในเวลากลางวันพืชจะไม่หายใจ',
          isTrue: false,
          explanation: 'ไม่จริง: พืชมีการหายใจระดับเซลล์ตลอด 24 ชั่วโมงทั้งกลางวันและกลางคืนเพื่อสร้างพลังงาน',
        },
      },
      {
        question: 'สิ่งมีชีวิตในข้อใดต่อไปนี้จัดเป็นสิ่งมีชีวิตเซลล์เดียว (Unicellular organism)?',
        options: ['อะมีบาและพารามีเซียม', 'ไฮดราและพลานาเรีย', 'เห็ดและราขนมปัง', 'มอสและเฟิร์น'],
        correctIndex: 0,
        explanation: 'อะมีบาและพารามีเซียมเป็นโพรทิสต์เซลล์เดียว ดำรงชีวิตและทำกิจกรรมทุกอย่างได้ภายในเซลล์เดียว',
        flashcard: {
          statement: 'เห็ด รา ยีสต์ จัดเป็นพืชชนิดหนึ่งเนื่องจากไม่สามารถเคลื่อนที่ได้',
          isTrue: false,
          explanation: 'ไม่จริง: เห็ดและราจัดอยู่ในอาณาจักรฟังไจ (Fungi) ไม่ใช่พืช และไม่สามารถสังเคราะห์ด้วยแสงได้',
        },
      },
    ];
  } else if (lowerTopic.includes('แรงและการเคลื่อนที่เบื้องต้น')) {
    selectedPool = [
      {
        question: 'แรงเสียดทาน (Friction force) ที่กระทำต่อวัตถุขณะกำลังเคลื่อนที่บนพื้นผิว มีทิศทางอย่างไร?',
        options: [
          'มีทิศตรงข้ามกับทิศทางการเคลื่อนที่ของวัตถุเสมอ',
          'มีทิศเดียวกับทิศทางการเคลื่อนที่ของวัตถุ',
          'มีทิศตั้งฉากกับพื้นผิวสัมผัสในแนวดิ่งเสมอ',
          'มีทิศพุ่งเข้าหาจุดศูนย์กลางของโลก',
        ],
        correctIndex: 0,
        explanation: 'แรงเสียดทานเป็นแรงต้านการเคลื่อนที่ จึงมีทิศทางขนานกับผิวสัมผัสและตรงข้ามกับทิศทางการเคลื่อนที่เสมอ',
        flashcard: {
          statement: 'น้ำหนัก (Weight) ของวัตถุคือแรงดึงดูดของโลกที่กระทำต่อมวลของวัตถุ มีหน่วยเป็นนิวตัน (N)',
          isTrue: true,
          explanation: 'ถูกต้อง: น้ำหนักคำนวณจาก W = mg โดย g คือความเร่งโน้มถ่วงของโลก',
        },
      },
      {
        question: 'ความแตกต่างสำคัญระหว่าง "อัตราเร็ว" (Speed) กับ "ความเร็ว" (Velocity) คือข้อใด?',
        options: [
          'อัตราเร็วเป็นปริมาณสเกลาร์ (บอกเฉพาะขนาด) ส่วนความเร็วเป็นปริมาณเวกเตอร์ (บอกทั้งขนาดและทิศทาง)',
          'อัตราเร็วบอกทั้งขนาดและทิศทาง ส่วนความเร็วบอกเฉพาะขนาด',
          'อัตราเร็วมีหน่วยเป็นกิโลเมตร ส่วนความเร็วมีหน่วยเป็นวินาที',
          'ไม่มีข้อแตกต่างกันเลย ทั้งสองคำมีความหมายเหมือนกันทุกประการ',
        ],
        correctIndex: 0,
        explanation: 'อัตราเร็วคิดจากระยะทาง/เวลา (สเกลาร์) ส่วนความเร็วคิดจากการกระจัด/เวลา (เวกเตอร์มีทิศทาง)',
        flashcard: {
          statement: 'วัตถุที่กำลังตกอย่างอิสระในสนามโน้มถ่วงใกล้ผิวโลกจะมีความเร่งคงที่ประมาณ 9.8 m/s²',
          isTrue: true,
          explanation: 'ถูกต้อง: ความเร่งเนื่องจากแรงโน้มถ่วง (g) มีค่าคงที่ประมาณ 9.8 หรือ 10 m/s² ในทิศดิ่งลง',
        },
      },
      {
        question: 'เมื่อขับรถแล้วเบรกกะทันหัน คนในรถจะพุ่งไปข้างหน้า เป็นไปตามกฎข้อใด?',
        options: [
          'กฎความเฉื่อย (กฎข้อที่ 1 ของนิวตัน)',
          'กฎแรงกิริยาและแรงปฏิกิริยา (กฎข้อที่ 3 ของนิวตัน)',
          'กฎแรงดึงดูดระหว่างมวลของเคปเลอร์',
          'กฎการอนุรักษ์ประจุไฟฟ้า',
        ],
        correctIndex: 0,
        explanation: 'ความเฉื่อยคือสมบัติของวัตถุที่พยายามรักษาสภาพการเคลื่อนที่เดิมไว้ เมื่อรถหยุด ตัวคนจึงยังคงเคลื่อนที่ไปข้างหน้าตามสภาพเดิม',
        flashcard: {
          statement: 'มวล (Mass) ของวัตถุบนดวงจันทร์จะมีค่าน้อยกว่ามวลของวัตถุชิ้นเดิมเมื่ออยู่บนโลก',
          isTrue: false,
          explanation: 'ไม่จริง: มวลของวัตถุมีค่าคงที่เสมอไม่ว่าจะอยู่ที่ใด แต่น้ำหนักจะลดลงเนื่องจากแรงโน้มถ่วงดวงจันทร์น้อยกว่าโลก',
        },
      },
    ];
  } else if (lowerTopic.includes('วงจรไฟฟ้า') || lowerTopic.includes('สารในชีวิตประจำวัน')) {
    selectedPool = [
      {
        question: 'การต่อหลอดไฟฟ้าภายในบ้านเรือน นิยมต่อวงจรแบบใด และเพราะเหตุใด?',
        options: [
          'ต่อแบบขนาน เพราะเมื่อหลอดหนึ่งขาด หลอดอื่นยังคงทำงานได้ตามปกติและได้รับความต่างศักย์เท่ากัน',
          'ต่อแบบอนุกรม เพราะประหยัดสายไฟและกระแสไฟไหลเท่ากันทุกห้อง',
          'ต่อแบบผสมอนุกรมขนานสลับกันทุก 5 วินาที',
          'ต่อแบบสายดินเดี่ยวเพื่อลดค่าไฟฟ้า',
        ],
        correctIndex: 0,
        explanation: 'วงจรแบบขนานให้ความต่างศักย์ตกคร่อมเครื่องใช้ไฟฟ้าแต่ละชิ้นเท่ากับ 220V เท่ากัน และสามารถเปิด-ปิดสวิตช์แยกกันได้อย่างอิสระ',
        flashcard: {
          statement: 'ตามกฎของโอห์ม ความต่างศักย์ (V) เท่ากับ กระแสไฟฟ้า (I) คูณด้วย ความต้านทาน (R) (V = IR)',
          isTrue: true,
          explanation: 'ถูกต้อง: กฎของโอห์มระบุว่า V = IR หรือ I = V/R',
        },
      },
      {
        question: 'สารละลายที่มีค่า pH เท่ากับ 3 จัดเป็นสารประเภทใด?',
        options: ['สารละลายกรด (Acid)', 'สารละลายเบส (Base)', 'สารละลายที่เป็นกลาง (Neutral)', 'สารกึ่งตัวนำ'],
        correctIndex: 0,
        explanation: 'ค่า pH น้อยกว่า 7 จัดเป็นกรด, pH เท่ากับ 7 เป็นกลาง, และ pH มากกว่า 7 เป็นเบส',
        flashcard: {
          statement: 'น้ำยาล้างจานและสบู่มีสมบัติเป็นสารละลายเบส และเปลี่ยนสีกระดาษลิตมัสจากสีแดงเป็นสีน้ำเงิน',
          isTrue: true,
          explanation: 'ถูกต้อง: เบสมีรสฝาด ลื่นมือ และเปลี่ยนสีกระดาษลิตมัสแดงเป็นน้ำเงิน',
        },
      },
      {
        question: 'ฟิวส์ (Fuse) และเบรกเกอร์ในวงจรไฟฟ้า มีหน้าที่สำคัญอย่างไร?',
        options: [
          'ตัดวงจรไฟฟ้าอัตโนมัติเมื่อมีกระแสไฟฟ้าไหลเกินหรือเกิดไฟฟ้าลัดวงจร',
          'เพิ่มแรงดันไฟฟ้าให้แก่อุปกรณ์ไฟฟ้าทำงานได้แรงขึ้น',
          'เปลี่ยนไฟฟ้ากระแสสลับให้เป็นกระแสตรง',
          'กักเก็บพลังงานไฟฟ้าไว้ใช้ตอนไฟดับ',
        ],
        correctIndex: 0,
        explanation: 'ฟิวส์ทำจากโลหะผสมจุดหลอมเหลวต่ำ จะหลอมละลายตัดวงจรทันทีเมื่อกระแสไฟฟ้าไหลเกินพิกัดเพื่อป้องกันไฟไหม้',
        flashcard: {
          statement: 'น้ำบริสุทธิ์ (Pure Water) เป็นตัวนำไฟฟ้าที่ยอดเยี่ยมเทียบเท่ากับสายทองแดง',
          isTrue: false,
          explanation: 'ไม่จริง: น้ำบริสุทธิ์แทบไม่นำไฟฟ้า แต่น้ำประปานำไฟฟ้าได้เพราะมีไอออนของแร่ธาตุละลายอยู่',
        },
      },
    ];
  } else if (lowerTopic.includes('ภูมิศาสตร์') || lowerTopic.includes('ดวงดาวพื้นฐาน')) {
    selectedPool = [
      {
        question: 'ชั้นบรรยากาศของโลกชั้นใดที่เกิดปรากฏการณ์สภาพอากาศ เช่น เมฆ หมอก ฝน และพายุ?',
        options: ['โทรโพสเฟียร์ (Troposphere)', 'สตราโทสเฟียร์ (Stratosphere)', 'มีโซสเฟียร์ (Mesosphere)', 'เทอร์โมสเฟียร์ (Thermosphere)'],
        correctIndex: 0,
        explanation: 'โทรโพสเฟียร์อยู่ติดผิวโลกมากที่สุด (0-10 กม.) มีไอน้ำและมวลอากาศหนาแน่นที่สุด จึงเกิดลมฟ้าอากาศทั้งหมด',
        flashcard: {
          statement: 'ปรากฏการณ์น้ำขึ้น-น้ำลงเกิดจากแรงดึงดูดของดวงจันทร์และดวงอาทิตย์ที่กระทำต่อน้ำในมหาสมุทรโลก',
          isTrue: true,
          explanation: 'ถูกต้อง: แรงไทดัลจากดวงจันทร์เป็นปัจจัยหลักที่ทำให้น้ำในมหาสมุทรป่องออกทั้งสองฝั่ง',
        },
      },
      {
        question: 'ดาวเหนือ (Polaris) ใช้เป็นจุดอ้างอิงในการหาทิศเหนือ อยู่ในกลุ่มดาวใดบนท้องฟ้า?',
        options: ['กลุ่มดาวหมีเล็ก (Ursa Minor)', 'กลุ่มดาวหมีใหญ่ (Ursa Major)', 'กลุ่มดาวนายพราน (Orion)', 'กลุ่มดาวค้างคาว (Cassiopeia)'],
        correctIndex: 0,
        explanation: 'ดาวเหนืออยู่ที่ปลายหางของกลุ่มดาวหมีเล็ก (Ursa Minor) ซึ่งอยู่ตรงกับแนวแกนหมุนขั้วเหนือของโลก',
        flashcard: {
          statement: 'ดวงจันทร์หมุนรอบตัวเองโดยใช้เวลาเท่ากับเวลาที่โคจรรอบโลก จึงทำให้เรามองเห็นดวงจันทร์เพียงด้านเดียวเสมอ',
          isTrue: true,
          explanation: 'ถูกต้อง: ปรากฏการณ์นี้เรียกว่า Synchronous Rotation (Tidal Locking)',
        },
      },
      {
        question: 'ทวีปใดมีพื้นที่ขนาดใหญ่ที่สุดและมีประชากรมากที่สุดในโลก?',
        options: ['ทวีปเอเชีย (Asia)', 'ทวีปแอฟริกา (Africa)', 'ทวีปอเมริกาเหนือ (North America)', 'ทวีปยุโรป (Europe)'],
        correctIndex: 0,
        explanation: 'ทวีปเอเชียมีพื้นที่ครอบคลุมประมาณ 30% ของแผ่นดินโลก และมีประชากรอาศัยอยู่มากที่สุดกว่า 4.7 พันล้านคน',
        flashcard: {
          statement: 'เส้นศูนย์สูตร (Equator) มีค่าละติจูดเท่ากับ 90 องศาเหนือ',
          isTrue: false,
          explanation: 'ไม่จริง: เส้นศูนย์สูตรคือเส้นละติจูด 0 องศา ส่วนละติจูด 90 องศาคือขั้วโลกเหนือและขั้วโลกใต้',
        },
      },
    ];
  } else if (lowerTopic.includes('เซลล์') || lowerTopic.includes('สารอาหาร')) {
    selectedPool = [
      {
        question: 'โครงสร้างใดที่พบเฉพาะในเซลล์พืช แต่ "ไม่พบ" ในเซลล์สัตว์?',
        options: [
          'ผนังเซลล์ (Cell wall) และ คลอโรพลาสต์ (Chloroplast)',
          'เยื่อหุ้มเซลล์ (Cell membrane) และ ไรโบโซม',
          'ไมโทคอนเดรีย (Mitochondria) และ นิวเคลียส',
          'ไซโทพลาซึม และ ร่างแหเอนโดพลาซึม',
        ],
        correctIndex: 0,
        explanation: 'เซลล์พืชมีผนังเซลล์ที่ทำจากเซลลูโลสเพิ่มความแข็งแรง และมีคลอโรพลาสต์สังเคราะห์ด้วยแสง ซึ่งเซลล์สัตว์ไม่มี',
        flashcard: {
          statement: 'ไมโทคอนเดรีย (Mitochondria) ทำหน้าที่เป็น "โรงไฟฟ้าของเซลล์" ในการสร้างพลังงาน ATP ให้แก่สิ่งมีชีวิต',
          isTrue: true,
          explanation: 'ถูกต้อง: ไมโทคอนเดรียทำหน้าที่สร้างพลังงานผ่านกระบวนการหายใจระดับเซลล์',
        },
      },
      {
        question: 'สารอาหารประเภทใดให้พลังงานสูงที่สุดต่อปริมาณ 1 กรัม?',
        options: ['ไขมัน (Fat) ให้ 9 กิโลแคลอรี', 'คาร์โบไฮเดรต ให้ 4 กิโลแคลอรี', 'โปรตีน ให้ 4 กิโลแคลอรี', 'วิตามินและเกลือแร่'],
        correctIndex: 0,
        explanation: 'ไขมัน 1 กรัม ให้พลังงานถึง 9 kcal ขณะที่คาร์โบไฮเดรตและโปรตีน 1 กรัม ให้พลังงาน 4 kcal',
        flashcard: {
          statement: 'วิตามิน A, D, E, K จัดเป็นกลุ่มวิตามินที่สามารถละลายได้ในน้ำ',
          isTrue: false,
          explanation: 'ไม่จริง: วิตามิน A, D, E, K เป็นวิตามินที่ละลายในไขมัน ส่วนวิตามิน B และ C ละลายในน้ำ',
        },
      },
      {
        question: 'เอนไซม์อะไมเลส (Amylase) ในน้ำลายมนุษย์ ทำหน้าที่ย่อยสารอาหารประเภทใดเป็นอันดับแรก?',
        options: ['แป้งและคาร์โบไฮเดรต', 'โปรตีนและเนื้อสัตว์', 'ไขมันและน้ำมันพืช', 'เกลือแร่และวิตามิน'],
        correctIndex: 0,
        explanation: 'อะไมเลสในปากเริ่มย่อยแป้งให้กลายเป็นน้ำตาลมอลโทส ซึ่งเป็นการย่อยทางเคมีขั้นแรกในระบบทางเดินอาหาร',
        flashcard: {
          statement: 'เยื่อหุ้มเซลล์มีสมบัติเป็น "เยื่อเลือกผ่าน" (Semi-permeable membrane) ยอมให้สารบางชนิดผ่านเข้าออกได้เท่านั้น',
          isTrue: true,
          explanation: 'ถูกต้อง: เยื่อหุ้มเซลล์ควบคุมการเข้าออกของสารเพื่อรักษาสมดุลภายในเซลล์',
        },
      },
    ];
  } else if (lowerTopic.includes('ธาตุ') || lowerTopic.includes('สารประกอบ') || lowerTopic.includes('เคมี')) {
    selectedPool = [
      {
        question: 'ความแตกต่างพื้นฐานระหว่าง "ธาตุ" (Element) กับ "สารประกอบ" (Compound) คือข้อใด?',
        options: [
          'ธาตุประกอบด้วยอะตอมชนิดเดียวกัน ส่วนสารประกอบเกิดจากธาตุตั้งแต่ 2 ชนิดขึ้นไปรวมตัวกันทางเคมี',
          'ธาตุเป็นของเหลวเสมอ ส่วนสารประกอบเป็นของแข็ง',
          'ธาตุสามารถแยกสลายทางเคมีได้ง่ายกว่าสารประกอบ',
          'สารประกอบไม่มีสูตรเคมีที่แน่นอน',
        ],
        correctIndex: 0,
        explanation: 'ธาตุ (เช่น Fe, O, H) มีอะตอมชนิดเดียว สารประกอบ (เช่น H₂O, NaCl) มีธาตุตั้งแต่สองชนิดขึ้นไปยึดเหนี่ยวด้วยพันธะเคมี',
        flashcard: {
          statement: 'ปฏิกิริยาคายความร้อน (Exothermic reaction) จะปล่อยพลังงานความร้อนออกมาสู่อุณหภูมิสิ่งแวดล้อม ทำให้สิ่งแวดล้อมร้อนขึ้น',
          isTrue: true,
          explanation: 'ถูกต้อง: ปฏิกิริยาคายความร้อนจะถ่ายเทพลังงานออกภายนอก เช่น การเผาไหม้',
        },
      },
      {
        question: 'ในตารางธาตุ ธาตุที่มีสมบัติทางเคมีคล้ายคลึงกันจะจัดอยู่ในกลุ่มใด?',
        options: ['หมู่เดียวกัน (Same Group ในแนวตั้ง)', 'คาบเดียวกัน (Same Period ในแนวนอน)', 'น้ำหนักอะตอมเท่ากัน', 'เลขมวลเท่ากัน'],
        correctIndex: 0,
        explanation: 'ธาตุในหมู่เดียวกันจะมีจำนวนเวเลนซ์อิเล็กตรอน (อิเล็กตรอนวงนอกสุด) เท่ากัน จึงมีพฤติกรรมทางเคมีคล้ายคลึงกัน',
        flashcard: {
          statement: 'การระเหิดของลูกเหม็นและการละลายของน้ำตาลในน้ำจัดเป็นการเปลี่ยนแปลงทางเคมี',
          isTrue: false,
          explanation: 'ไม่จริง: การระเหิดและการละลายเป็นการเปลี่ยนแปลงทางกายภาพ เพราะไม่เกิดสารใหม่',
        },
      },
      {
        question: 'ธาตุอโลหะชนิดใดที่เป็นองค์ประกอบหลักที่มีปริมาณมากที่สุดในบรรยากาศของโลก?',
        options: ['ก๊าซไนโตรเจน (Nitrogen, ~78%)', 'ก๊าซออกซิเจน (Oxygen, ~21%)', 'ก๊าซอาร์กอน (Argon)', 'ก๊าซคาร์บอนไดออกไซด์'],
        correctIndex: 0,
        explanation: 'ไนโตรเจน (N₂) คิดเป็นประมาณ 78% ของบรรยากาศโลก รองลงมาคือออกซิเจน (O₂) ประมาณ 21%',
        flashcard: {
          statement: 'พันธะโคเวเลนต์ (Covalent bond) คือพันธะที่เกิดจากการใช้อิเล็กตรอนร่วมกันระหว่างอะตอมอโลหะ',
          isTrue: true,
          explanation: 'ถูกต้อง: พันธะโคเวเลนต์เป็นการแชร์อิเล็กตรอน เช่น ในโมเลกุลน้ำ H₂O',
        },
      },
    ];
  } else if (lowerTopic.includes('คลื่น') || lowerTopic.includes('พันธุศาสตร์') || lowerTopic.includes('optics') || lowerTopic.includes('dna')) {
    selectedPool = [
      {
        question: 'เมื่อคลื่นแสงเดินทางจากตัวกลางที่มีดัชนีหักเหน้อย (อากาศ) เข้าสู่ตัวกลางที่มีดัชนีหักเหมาก (แก้ว) ปริมาณใดจะไม่เปลี่ยนแปลง?',
        options: ['ความถี่ของคลื่น (Frequency, f)', 'ความยาวคลื่น (Wavelength, λ)', 'ความเร็วของแสง (Speed, v)', 'แอมพลิจูด (Amplitude)'],
        correctIndex: 0,
        explanation: 'ความถี่คลื่นขึ้นกับแหล่งกำเนิด จึงคงที่เสมอ ส่วนความเร็วและความยาวคลื่นจะลดลงตาม v = c/n',
        flashcard: {
          statement: 'คลื่นเสียงไม่สามารถเดินทางผ่านสุญญากาศได้ เพราะต้องอาศัยตัวกลางในการส่งผ่านแรงสั่นสะเทือน',
          isTrue: true,
          explanation: 'ถูกต้อง: เสียงเป็นคลื่นกล ต้องอาศัยอนุภาคของตัวกลางในการแผ่คลื่น',
        },
      },
      {
        question: 'สารพันธุกรรมหลักที่ทำหน้าที่เก็บรหัสพันธุกรรมในเซลล์สิ่งมีชีวิตส่วนใหญ่คืออะไร?',
        options: ['DNA (กรดดีออกซีไรโบนิวคลีอิก)', 'ATP (อะดีโนซีนไตรฟอสเฟต)', 'ฮีโมโกลบิน', 'กลูโคส'],
        correctIndex: 0,
        explanation: 'DNA ประกอบด้วยสายพอรินิวคลีโอไทด์คู่ บิดเป็นเกลียวคู่ (Double Helix) ทำหน้าที่ถ่ายทอดลักษณะทางพันธุกรรม',
        flashcard: {
          statement: 'ในมนุษย์ปกติ เซลล์ร่างกาย (Somatic cells) มีจำนวนโครโมโซมทั้งหมด 46 แท่ง (23 คู่)',
          isTrue: true,
          explanation: 'ถูกต้อง: 22 คู่เป็นออโตโซม และ 1 คู่เป็นโครโมโซมเพศ (XX หรือ XY)',
        },
      },
      {
        question: 'การสะท้อนกลับหมด (Total Internal Reflection) ของแสงจะเกิดขึ้นได้ภายใต้เงื่อนไขใด?',
        options: [
          'แสงเคลื่อนที่จากตัวกลางดัชนีหักเหมากไปยังตัวกลางดัชนีหักเหน้อย และมุมตกกระทบโตกว่ามุมวิกฤต',
          'แสงเคลื่อนที่จากอากาศลงสู่น้ำด้วยมุม 45 องศา',
          'มุมตกกระทบเท่ากับ 0 องศาในสุญญากาศ',
          'ตัวกลางทั้งสองมีความหนาแน่นเท่ากันทุกประการ',
        ],
        correctIndex: 0,
        explanation: 'การสะท้อนกลับหมดต้องเกิดจากตัวกลางที่มีความหนาแน่นเชิงแสงสูงสู่ต่ำ และมุมตกกระทบต้องโตกว่ามุมวิกฤต',
        flashcard: {
          statement: 'ยีนเด่น (Dominant gene) สามารถข่มยีนด้อย (Recessive gene) ได้อย่างสมบูรณ์ในฟีโนไทป์',
          isTrue: true,
          explanation: 'ถูกต้อง: เป็นไปตามกฎการถ่ายทอดทางพันธุกรรมของเกรเกอร์ เมนเดล',
        },
      },
    ];
  } else if (lowerTopic.includes('ระบบสุริยะ') || lowerTopic.includes('ดาราศาสตร์ฟิสิกส์') || lowerTopic.includes('จักรวาล')) {
    selectedPool = [
      {
        question: 'ดาวเคราะห์ที่มีขนาดใหญ่ที่สุดในระบบสุริยะ และมีจุดแดงใหญ่ (Great Red Spot) คือดาวดวงใด?',
        options: ['ดาวพฤหัสบดี (Jupiter)', 'ดาวเสาร์ (Saturn)', 'ดาวเนปจูน (Neptune)', 'ดาวยูเรนัส (Uranus)'],
        correctIndex: 0,
        explanation: 'ดาวพฤหัสบดีเป็นดาวเคราะห์ก๊าซที่มีมวลและขนาดใหญ่ที่สุด มีพายุหมุนขนาดยักษ์เรียกว่าจุดแดงใหญ่',
        flashcard: {
          statement: 'ดวงอาทิตย์ผลิตพลังงานความร้อนและแสงสว่างผ่านปฏิกิริยา "นิวเคลียร์ฟิวชัน" (Nuclear Fusion) ของไฮโดรเจน',
          isTrue: true,
          explanation: 'ถูกต้อง: แกนกลางดวงอาทิตย์หลอมไฮโดรเจนเป็นฮีเลียม ปลดปล่อยพลังงานมหาศาล',
        },
      },
      {
        question: 'หลุมดำ (Black Hole) มีคุณสมบัติทางดาราศาสตร์ที่โดดเด่นข้อใด?',
        options: [
          'มีความโน้มถ่วงมหาศาลจนกระทั่งความเร็วหลุดพ้นสูงกว่าความเร็วแสง แม้แต่แสงก็ไม่สามารถหนีออกมาได้',
          'เป็นดาวฤกษ์ที่สว่างที่สุดในใจกลางกาแล็กซี',
          'ประกอบด้วยธาตุเหล็กแข็งตัวที่ไม่มีแรงโน้มถ่วง',
          'ดูดกลืนเฉพาะคลื่นวิทยุแต่ปล่อยแสงเลเซอร์ออกมา',
        ],
        correctIndex: 0,
        explanation: 'ขอบฟ้าเหตุการณ์ (Event Horizon) ของหลุมดำเป็นจุดที่ความเร็วหลุดพ้นเท่ากับความเร็วแสง ทำให้ไม่มีสิ่งใดหลุดรอดออกมาได้',
        flashcard: {
          statement: 'กาแล็กซีทางช้างเผือก (Milky Way Galaxy) ของเรามีรูปร่างเป็นกาแล็กซีชนิดกังหันมีคาน (Barred Spiral)',
          isTrue: true,
          explanation: 'ถูกต้อง: ทางช้างเผือกเป็นกังหันแบบมีคานใจกลาง มีแขนกังหันหมุนวนออกไป',
        },
      },
      {
        question: 'ดาวเคราะห์ในระบบสุริยะดวงใดที่อยู่ใกล้ดวงอาทิตย์มากที่สุด?',
        options: ['ดาวพุธ (Mercury)', 'ดาวศุกร์ (Venus)', 'โลก (Earth)', 'ดาวอังคาร (Mars)'],
        correctIndex: 0,
        explanation: 'ดาวพุธอยู่ใกล้ดวงอาทิตย์ที่สุด ใช้เวลาโคจรรอบดวงอาทิตย์เพียง 88 วันของโลก',
        flashcard: {
          statement: 'ดาวพลูโต (Pluto) ยังคงได้รับการจัดเป็นดาวเคราะห์หลักดวงที่ 9 ของระบบสุริยะในปัจจุบัน',
          isTrue: false,
          explanation: 'ไม่จริง: สหพันธ์ดาราศาสตร์สากล (IAU) ได้ปรับลดสถานะของดาวพลูโตเป็น "ดาวเคราะห์แคระ" (Dwarf Planet) ตั้งแต่ปี 2006',
        },
      },
    ];
  } else if (lowerTopic.includes('กลศาสตร์') || lowerTopic.includes('นิวตัน')) {
    selectedPool = [
      {
        question: 'ตามกฎการเคลื่อนที่ข้อที่ 2 ของนิวตัน (ΣF = ma) หากแรงลัพธ์ที่กระทำต่อวัตถุมวลคงที่เพิ่มขึ้นเป็น 3 เท่า ความเร่งของวัตถุจะเป็นอย่างไร?',
        options: ['เพิ่มขึ้นเป็น 3 เท่าของความเร่งเดิม', 'ลดลงเหลือ 1/3 ของเดิม', 'เท่าเดิมเนื่องจากมวลคงที่', 'เพิ่มขึ้นเป็น 9 เท่า'],
        correctIndex: 0,
        explanation: 'จากสมการ ΣF = ma เมื่อมวลคงที่ ความเร่ง a จะแปรผันตรงกับแรงลัพธ์ ΣF',
        flashcard: {
          statement: 'วัตถุที่เคลื่อนที่ด้วยความเร็วคงที่เสมอจะมีแรงลัพธ์ที่กระทำต่อวัตถุเป็นศูนย์ตามกฎข้อที่ 1 ของนิวตัน',
          isTrue: true,
          explanation: 'ถูกต้อง: เมื่อความเร็วคงที่ ความเร่งเป็นศูนย์ ส่งผลให้แรงลัพธ์เป็นศูนย์',
        },
      },
      {
        question: 'ในการยิงแบบโพรเจกไทล์บนพื้นราบโดยไม่คิดแรงต้านอากาศ มุมยิงใดทำให้วัตถุไปได้ระยะทางแนวราบไกลที่สุด?',
        options: ['ทำมุม 45 องศากับแนวราบ', 'ทำมุม 30 องศา', 'ทำมุม 60 องศา', 'ทำมุม 90 องศา'],
        correctIndex: 0,
        explanation: 'ระยะทางในแนวราบ R = (u² sin 2θ)/g จะมีค่าสูงสุดเมื่อ sin 2θ = 1 นั่นคือ 2θ = 90° หรือ θ = 45°',
        flashcard: {
          statement: 'ที่จุดสูงสุดของการเคลื่อนที่แบบโพรเจกไทล์ ความเร็วของวัตถุจะมีค่าเป็นศูนย์อย่างสมบูรณ์',
          isTrue: false,
          explanation: 'ไม่จริง: ความเร็วแนวดิ่ง vy เป็นศูนย์ แต่วัตถุยังคงมีความเร็วแนวราบ vx คงที่',
        },
      },
      {
        question: 'ตามกฎข้อที่ 3 ของนิวตัน (Action = Reaction) แรงกิริยาและแรงปฏิกิริยามีลักษณะอย่างไร?',
        options: [
          'มีขนาดเท่ากัน ทิศทางตรงข้ามกัน และกระทำต่อวัตถุคนละก้อน จึงไม่หักล้างกัน',
          'มีขนาดเท่ากัน ทิศทางเดียวกัน และกระทำต่อวัตถุก้อนเดียวกัน',
          'เกิดไม่พร้อมกัน โดยแรงกิริยาต้องเกิดขึ้นก่อนเสมอ',
          'หักล้างกันจนแรงลัพธ์เป็นศูนย์เสมอ',
        ],
        correctIndex: 0,
        explanation: 'แรงคู่กิริยา-ปฏิกิริยาเกิดขึ้นพร้อมกัน มีขนาดเท่ากัน ทิศตรงข้าม แต่กระทำต่อวัตถุคนละก้อน จึงไม่อาจหักล้างกันได้',
        flashcard: {
          statement: 'ในการเคลื่อนที่แบบวงกลมสม่ำเสมอ แรงสู่ศูนย์กลางจะตั้งฉากกับทิศความเร็วเสมอ จึงไม่ทำให้เกิดงาน (Work = 0)',
          isTrue: true,
          explanation: 'ถูกต้อง: งาน W = F s cos(90°) = 0 ดังนั้นพลังงานจลน์ของวัตถุจึงคงที่',
        },
      },
    ];
  } else if (lowerTopic.includes('งาน') || lowerTopic.includes('พลังงาน') || lowerTopic.includes('โมเมนตัม')) {
    selectedPool = [
      {
        question: 'งาน (Work) ในทางฟิสิกส์จะเกิดขึ้นเมื่อใดตามนิยาม W = F · s · cos θ?',
        options: [
          'เมื่อมีแรงกระทำและวัตถุเกิดการกระจัดในทิศทางที่ไม่ตั้งฉากกับแนวแรง',
          'เมื่อออกแรงดันกำแพงคอนกรีตจนเหนื่อยแต่กำแพงไม่ขยับ',
          'เมื่อแบกของหนักเดินไปบนพื้นราบในแนวระดับด้วยความเร็วคงที่',
          'เมื่อถือหนังสือยืนอยู่นิ่งๆ เป็นเวลานาน',
        ],
        correctIndex: 0,
        explanation: 'งานเกิดขึ้นเมื่อมีแรง F และมีการกระจัด s ตามแนวแรง ถ้าไม่มีการกระจัด (s=0) หรืองานตั้งฉาก (cos 90° = 0) งานจะมีค่าเป็นศูนย์',
        flashcard: {
          statement: 'ตามกฎการอนุรักษ์พลังงานกล พลังงานไม่สามารถสร้างขึ้นใหม่หรือทำลายได้ แต่เปลี่ยนรูปได้',
          isTrue: true,
          explanation: 'ถูกต้อง: พลังงานรวมในระบบปิดมีค่าคงที่เสมอ เช่น พลังงานศักย์เปลี่ยนเป็นพลังงานจลน์',
        },
      },
      {
        question: 'พลังงานจลน์ (Kinetic Energy) ของวัตถุที่มีมวล m และความเร็ว v คำนวณได้จากสูตรใด?',
        options: ['Ek = (1/2)mv²', 'Ep = mgh', 'W = F · s', 'P = W / t'],
        correctIndex: 0,
        explanation: 'พลังงานจลน์คือพลังงานจากการเคลื่อนที่ Ek = 1/2 mv² เมื่อความเร็วเพิ่มเป็น 2 เท่า พลังงานจลน์จะเพิ่มเป็น 4 เท่า',
        flashcard: {
          statement: 'โมเมนตัม (Momentum) ของวัตถุเป็นปริมาณเวกเตอร์ คำนวณจากผลคูณของมวลกับความเร็ว (p = mv)',
          isTrue: true,
          explanation: 'ถูกต้อง: โมเมนตัมมีทิศทางเดียวกับเวกเตอร์ความเร็วของวัตถุ',
        },
      },
      {
        question: 'ในการชนกันของวัตถุในระบบปิดที่ไม่มีแรงภายนอก ปริมาณใดได้รับการอนุรักษ์เสมอในทุกกรณี?',
        options: ['โมเมนตัมรวมของระบบ (Total Momentum)', 'พลังงานจลน์รวมของระบบ', 'ความเร็วสัมพัทธ์ของวัตถุ', 'รูปร่างของวัตถุ'],
        correctIndex: 0,
        explanation: 'โมเมนตัมรวมของระบบอนุรักษ์เสมอในทุกการชน ส่วนพลังงานจลน์จะอนุรักษ์เฉพาะในการชนแบบยืดหยุ่นสมบูรณ์เท่านั้น',
        flashcard: {
          statement: 'กำลัง (Power) คืออัตราการทำงานต่อหนึ่งหน่วยเวลา มีหน่วยในระบบเอสไอเป็น วัตต์ (Watt หรือ J/s)',
          isTrue: true,
          explanation: 'ถูกต้อง: กำลัง P = W/t วัดประสิทธิภาพในการทำงานต่อวินาที',
        },
      },
    ];
  } else if (lowerTopic.includes('ไฟฟ้าแม่เหล็ก') || lowerTopic.includes('ฟิสิกส์อะตอม') || lowerTopic.includes('นิวเคลียร์')) {
    selectedPool = [
      {
        question: 'ตามกฎของคูลอมบ์ (Coulomb\'s Law) หากระยะห่างระหว่างจุดประจุ 2 จุด เพิ่มขึ้นเป็น 2 เท่า แรงไฟฟ้าจะมีค่าเปลี่ยนแปลงอย่างไร?',
        options: ['ลดลงเหลือ 1/4 ของแรงเดิม', 'ลดลงเหลือ 1/2 ของแรงเดิม', 'เพิ่มขึ้นเป็น 2 เท่า', 'เพิ่มขึ้นเป็น 4 เท่า'],
        correctIndex: 0,
        explanation: 'F = k(q1*q2)/r² แรงแปรผกผันกับระยะทางยกกำลังสอง เมื่อ r เพิ่มเป็น 2 เท่า แรงจึงลดลงเหลือ 1/(2²) = 1/4',
        flashcard: {
          statement: 'เส้นแรงไฟฟ้าจะพุ่งออกจากประจุบวกและพุ่งเข้าหาประจุลบเสมอ และไม่มีวันตัดกันเองเด็ดขาด',
          isTrue: true,
          explanation: 'ถูกต้อง: ทิศทางของสนามไฟฟ้าถูกนิยามตามทิศแรงที่กระทำต่อประจุทดสอบบวก',
        },
      },
      {
        question: 'ปฏิกิริยานิวเคลียร์ฟิชชัน (Nuclear Fission) แตกต่างจาก นิวเคลียร์ฟิวชัน (Nuclear Fusion) อย่างไร?',
        options: [
          'ฟิชชันคือการแตกตัวของนิวเคลียสธาตุหนัก ส่วนฟิวชันคือการรวมตัวของนิวเคลียสธาตุเบา',
          'ฟิชชันเกิดขึ้นบนดวงอาทิตย์ ส่วนฟิวชันเกิดขึ้นในโรงไฟฟ้านิวเคลียร์ปัจจุบัน',
          'ฟิชชันไม่ปล่อยพลังงาน ส่วนฟิวชันปล่อยรังสีแกมมาเท่านั้น',
          'ทั้งสองปฏิกิริยาคือสิ่งเดียวกันทุกประการ',
        ],
        correctIndex: 0,
        explanation: 'ฟิชชัน เช่น การแตกตัวของยูเรเนียม-235 ส่วนฟิวชัน เช่น การหลอมไฮโดรเจนเป็นฮีเลียมบนดวงอาทิตย์',
        flashcard: {
          statement: 'ครึ่งชีวิต (Half-life) คือระยะเวลาที่สารกัมมันตรังสีสลายตัวจนเหลือปริมาณครึ่งหนึ่งของปริมาณเริ่มต้น',
          isTrue: true,
          explanation: 'ถูกต้อง: ครึ่งชีวิตเป็นสมบัติเฉพาะตัวของแต่ละไอโซโทปกัมมันตรังสี',
        },
      },
      {
        question: 'ทวิภาวะคลื่น-อนุภาค (Wave-Particle Duality) ตามสมมติฐานของเดอบรอยล์ ระบุว่าอย่างไร?',
        options: [
          'สสารและอนุภาคทุกชนิดที่มีโมเมนตัมสามารถแสดงสมบัติของคลื่นได้ด้วยความยาวคลื่น λ = h/p',
          'แสงเป็นคลื่นเท่านั้น ไม่สามารถแสดงสมบัติอนุภาคได้',
          'อิเล็กตรอนมีมวลเป็นศูนย์เมื่อเคลื่อนที่ด้วยความเร็วแสง',
          'พลังงานสามารถแบ่งย่อยได้อย่างต่อเนื่องไร้ขีดจำกัด',
        ],
        correctIndex: 0,
        explanation: 'หลุยส์ เดอบรอยล์ เสนอว่าอนุภาคที่มีมวลและโมเมนตัม เช่น อิเล็กตรอน สามารถแสดงสมบัติคลื่นได้ เช่น การเลี้ยวเบนและการแทรกสอด',
        flashcard: {
          statement: 'รังสีแอลฟา (Alpha radiation) มีอำนาจทะลุทะลวงสูงที่สุดในบรรดารังสีนิวเคลียร์ทั้งหมด',
          isTrue: false,
          explanation: 'ไม่จริง: รังสีแอลฟามีมวลมาก อำนาจทะลุทะลวงต่ำที่สุด กระดาษแผ่นเดียวก็กั้นได้ ส่วนรังสีแกมมามีอำนาจทะลุทะลวงสูงที่สุด',
        },
      },
    ];
  } else if (lowerTopic.includes('นักวิทยาศาสตร์') || mode === 'didyouknow_scientists') {
    selectedPool = [
      {
        question: 'ใครคือนักวิทยาศาสตร์ที่ค้นพบกฎความโน้มถ่วงสากล กฎการเคลื่อนที่ 3 ข้อ และประดิษฐ์กล้องโทรทรรศน์สะท้อนแสง?',
        options: ['เซอร์ ไอแซก นิวตัน (Sir Isaac Newton)', 'กาลิเลโอ กาลิเลอี', 'อัลเบิร์ต ไอน์สไตน์', 'นิโคลา เทสลา'],
        correctIndex: 0,
        explanation: 'เซอร์ ไอแซก นิวตัน ตีพิมพ์หนังสือเล่มเอก Principia ในปี 1687 วางรากฐานวิชากลศาสตร์คลาสสิกของโลก',
        flashcard: {
          statement: 'อัลเบิร์ต ไอน์สไตน์ ได้รับรางวัลโนเบลสาขาฟิสิกส์จาก "ปรากฏการณ์โฟโตอิเล็กทริก" ไม่ใช่จากทฤษฎีสัมพัทธภาพ',
          isTrue: true,
          explanation: 'ถูกต้อง: ไอน์สไตน์ได้รับรางวัลโนเบลปี 1921 จากการอธิบายปรากฏการณ์โฟโตอิเล็กทริก',
        },
      },
      {
        question: 'มารี กูรี (Marie Curie) เป็นบุคคลประวัติศาสตร์ที่ได้รับรางวัลโนเบลในสาขาใดบ้าง?',
        options: [
          'สาขาฟิสิกส์ (ปี 1903) และสาขาเคมี (ปี 1911)',
          'สาขาฟิสิกส์และสาขาสันติภาพ',
          'สาขาสรีรวิทยาหรือการแพทย์ 2 ครั้ง',
          'สาขาเคมีและสาขาวรรณกรรม',
        ],
        correctIndex: 0,
        explanation: 'มารี กูรี ค้นพบธาตุพอโลเนียมและเรเดียม และเป็นสตรีคนเดียวที่ได้รับรางวัลโนเบลใน 2 สาขาวิทยาศาสตร์',
        flashcard: {
          statement: 'นิโคลา เทสลา (Nikola Tesla) คือผู้บุกเบิกและคิดค้นระบบไฟฟ้ากระแสสลับ (AC) และมอเตอร์เหนี่ยวนำ',
          isTrue: true,
          explanation: 'ถูกต้อง: ระบบไฟฟ้ากระแสสลับของเทสลาปฏิวัติระบบส่งกำลังไฟฟ้าทั่วโลกจนถึงปัจจุบัน',
        },
      },
      {
        question: 'กาลิเลโอ กาลิเลอี ถูกยกย่องให้เป็นบิดาแห่งวิทยาศาสตร์สมัยใหม่เนื่องจากผลงานใด?',
        options: [
          'การใช้กล้องโทรทรรศน์ส่องดูดวงดาวและการทดลองพิสูจน์การตกของวัตถุอย่างเป็นระบบ',
          'การสร้างระเบิดปรมาณูลูกแรกของโลก',
          'การคิดค้นยาปฏิชีวนะเพนิซิลลิน',
          'การเสนอทฤษฎีวิวัฒนาการการคัดเลือกโดยธรรมชาติ',
        ],
        correctIndex: 0,
        explanation: 'กาลิเลโอปฏิวัติวิธีวิทยาศาสตร์ด้วยการใช้การทดลองและการสังเกตการณ์จริงมาหักล้างปรัชญาความเชื่อเดิม',
        flashcard: {
          statement: 'ชาลส์ ดาร์วิน (Charles Darwin) เสนอทฤษฎีการคัดเลือกโดยธรรมชาติ (Natural Selection) ผ่านหนังสือ On the Origin of Species',
          isTrue: true,
          explanation: 'ถูกต้อง: ทฤษฎีวิวัฒนาการของดาร์วินวางรากฐานสำคัญให้แก่วิชาชีววิทยาสมัยใหม่',
        },
      },
    ];
  } else {
    // Universal Rich Fallback Pool
    selectedPool = [
      {
        question: 'ตามกฎการเคลื่อนที่ข้อที่ 2 ของนิวตัน (ΣF = ma) หากแรงลัพธ์ที่กระทำต่อวัตถุมวลคงที่เพิ่มขึ้นเป็น 3 เท่า ความเร่งของวัตถุจะเป็นอย่างไร?',
        options: ['เพิ่มขึ้นเป็น 3 เท่าของความเร่งเดิม', 'ลดลงเหลือ 1/3 ของเดิม', 'เท่าเดิมเนื่องจากมวลคงที่', 'เพิ่มขึ้นเป็น 9 เท่า'],
        correctIndex: 0,
        explanation: 'จากสมการ ΣF = ma เมื่อมวล m คงที่ ความเร่ง a จะแปรผันตรงกับแรงลัพธ์ ΣF',
        flashcard: {
          statement: 'วัตถุที่เคลื่อนที่ด้วยความเร็วคงที่เสมอจะมีแรงลัพธ์ที่กระทำต่อวัตถุเป็นศูนย์ตามกฎข้อที่ 1 ของนิวตัน',
          isTrue: true,
          explanation: 'ถูกต้อง: เมื่อความเร็วคงที่ ความเร่งเป็นศูนย์ ส่งผลให้แรงลัพธ์เป็นศูนย์',
        },
      },
      {
        question: 'ปรากฏการณ์การสะท้อนกลับหมด (Total Internal Reflection) ของแสงจะเกิดขึ้นได้ภายใต้เงื่อนไขใด?',
        options: [
          'แสงเคลื่อนที่จากตัวกลางดัชนีหักเหมากไปยังตัวกลางดัชนีหักเหน้อย และมุมตกกระทบโตกว่ามุมวิกฤต',
          'แสงเคลื่อนที่จากอากาศลงสู่น้ำด้วยมุม 45 องศา',
          'มุมตกกระทบเท่ากับ 0 องศาในสุญญากาศ',
          'ตัวกลางทั้งสองมีความหนาแน่นเท่ากันทุกประการ',
        ],
        correctIndex: 0,
        explanation: 'การสะท้อนกลับหมดเกิดขึ้นได้เมื่อแสงเดินทางจากตัวกลางที่มีดัชนีหักเหสูงไปต่ำ และมุมตกกระทบโตกว่ามุมวิกฤต',
        flashcard: {
          statement: 'ความถี่ของคลื่นแสงจะไม่เปลี่ยนแปลงเมื่อเดินทางข้ามผ่านรอยต่อระหว่างตัวกลางสองชนิด',
          isTrue: true,
          explanation: 'ถูกต้อง: ความถี่ขึ้นกับแหล่งกำเนิด ไม่เปลี่ยนแปลงตามตัวกลาง',
        },
      },
      {
        question: 'พลังงานสะสมในตัวเก็บประจุที่มีประจุ Q และความต่างศักย์ V คำนวณได้จากสูตรใด?',
        options: ['U = (1/2)QV หรือ (1/2)CV²', 'U = QV²', 'U = C²V', 'U = 2QV'],
        correctIndex: 0,
        explanation: 'พลังงานสะสมคำนวณจากพื้นที่ใต้กราฟระหว่างประจุกับความต่างศักย์ U = (1/2)QV = (1/2)CV²',
        flashcard: {
          statement: 'คลื่นแม่เหล็กไฟฟ้าทุกชนิดเดินทางในสุญญากาศด้วยอัตราเร็วแสง c ≈ 3×10⁸ m/s เท่ากันทั้งหมด',
          isTrue: true,
          explanation: 'ถูกต้อง: คลื่นแม่เหล็กไฟฟ้าทุกสเปกตรัมมีความเร็วเท่ากับความเร็วแสงในสุญญากาศ',
        },
      },
    ];
  }

  return Array.from({ length: count }, (_, i) => {
    const template = selectedPool[i % selectedPool.length];
    const id = i + 1;
    return {
      id,
      question: template.question,
      options: template.options,
      correctIndex: template.correctIndex,
      explanation: template.explanation,
      flashcard: {
        statement: template.flashcard.statement,
        isTrue: template.flashcard.isTrue,
        explanation: template.flashcard.explanation,
      },
    };
  });
}
