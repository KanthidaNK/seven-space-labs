import { Language } from '../types';

export interface TranslationDictionary {
  // Navigation
  nav: {
    home: string;
    login: string;
    profile: string;
    gate: string;
    core: string;
    trending: string;
    contact: string;
    level: string;
  };
  // Hero
  hero: {
    titleTop: string;
    titleBottom: string;
    motto: string;
    workspace: string;
    gravitask: string;
  };
  // Labs Update
  labsUpdate: {
    title: string;
    calendar: {
      badge: string;
      month: string;
      title: string;
      item1Title: string;
      item1Sub: string;
      item1Badge: string;
      item2Title: string;
      item2Sub: string;
      item2Badge: string;
      item3Title: string;
      item3Sub: string;
      item3Badge: string;
      footerLink: string;
      footerTag: string;
    };
    radar: {
      badge: string;
      freq: string;
      title: string;
      item1Title: string;
      item1Time: string;
      item2Title: string;
      item2Time: string;
      item3Title: string;
      item3Time: string;
      footerLink: string;
      footerTag: string;
    };
    fame: {
      badge: string;
      freq: string;
      title: string;
      item1Title: string;
      item1Sub: string;
      item1Badge: string;
      item2Title: string;
      item2Sub: string;
      item2Badge: string;
      item3Title: string;
      item3Sub: string;
      item3Badge: string;
      footerLink: string;
      footerTag: string;
    };
  };
  // Trending Labs
  trending: {
    title: string;
    adminMode: string;
    adminActive: string;
    addTop: string;
    addBottom: string;
  };
  // Mission Labs (1-7)
  missionLabs: {
    title: string;
    openLab: string;
    subtitles: Record<number, string>;
    descriptions: Record<number, string>;
  };
  // Core Systems
  coreSystems: {
    title: string;
    editMode: string;
    adminActive: string;
    saveChanges: string;
    saved: string;
    items: Record<number, { name: string; desc: string }>;
  };
  // About Me
  aboutMe: {
    title: string;
    editText: string;
    editActive: string;
    saveChanges: string;
    saved: string;
    defaultBio: string;
    lineTitle: string;
    lineSub: string;
    chatWithUs: string;
    copyId: string;
    copied: string;
    openLine: string;
  };
  // Footer
  footer: {
    techStack: string;
    domainNode: string;
    tagline: string;
    rights: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  th: {
    nav: {
      home: 'HOME',
      login: 'LOGIN',
      profile: 'PROFILE',
      gate: 'GATE',
      core: 'CORE',
      trending: 'TRENDING',
      contact: 'CONTACT',
      level: 'LEVEL',
    },
    hero: {
      titleTop: 'SEVEN SPACE',
      titleBottom: 'LABS',
      motto: 'SEVEN SPACE LABS แหล่งเรียนรู้ EDTECH ยุคใหม่ ขับเคลื่อนเพื่อสร้างประสบการณ์การเรียนรู้ที่ดีกว่า',
      workspace: 'WORKSPACE',
      gravitask: 'GraviTask',
    },
    labsUpdate: {
      title: 'LABS UPDATE',
      calendar: {
        badge: 'CALENDAR',
        month: 'OCTOBER',
        title: 'รวมข่าวรับสมัครสอบแข่งขันวิทย์-คณิต & สอบคัดเลือกโรงเรียนชั้นนำ',
        item1Title: 'เปิดรับสมัคร สอวน. ค่าย 1',
        item1Sub: 'ฟิสิกส์ ดาราศาสตร์ คณิตฯ',
        item1Badge: 'สอวน.',
        item2Title: 'กำหนดการสอบเข้า ม.1 & ม.4',
        item2Sub: 'KVIS, MWIT, กำเนิดวิทย์',
        item2Badge: 'MWIT',
        item3Title: 'ปฏิทิน TCAS ประจำปี',
        item3Sub: 'A-Level, TPAT3 สนามสอบตรง',
        item3Badge: 'TCAS',
        footerLink: 'ดูตารางสอบทั้งหมด →',
        footerTag: 'สอวน. / TCAS',
      },
      radar: {
        badge: 'SCIENCE RADAR',
        freq: 'WEEKLY',
        title: 'สรุปความเคลื่อนไหวด้านฟิสิกส์ดาราศาสตร์และเทคโนโลยีอวกาศ',
        item1Title: 'กล้อง James Webb ตรวจพบชั้นบรรยากาศดาวนอกระบบ',
        item1Time: '2 ชม. ที่แล้ว',
        item2Title: 'อัปเดตเครื่องปฏิกรณ์นิวเคลียร์ฟิวชัน ITER สำเร็จเฟสใหม่',
        item2Time: '1 วันที่แล้ว',
        item3Title: 'ยานสำรวจ Europa Clipper เดินทางมุ่งหน้าสู่ดวงจันทร์ดาวพฤหัสฯ',
        item3Time: '3 วันที่แล้ว',
        footerLink: 'อ่านสรุปข่าววิทยาศาสตร์ →',
        footerTag: 'อัปเดตทุกสัปดาห์',
      },
      fame: {
        badge: 'HALL OF FAME',
        freq: 'NATIONAL',
        title: 'บอร์ดเกียรติยศนักเรียนโอลิมปิกวิชาการ & คะแนนสูงสุดระดับประเทศ',
        item1Title: 'ผู้แทนคณิต-ฟิสิกส์โอลิมปิกระดับชาติ',
        item1Sub: 'เหรียญทอง สอวน. 2568',
        item1Badge: 'GOLD',
        item2Title: 'คะแนนฟิสิกส์ A-Level อันดับ 1 ระดับประเทศ',
        item2Sub: 'เตรียมอุดมศึกษา • 96/100',
        item2Badge: 'TOP 1',
        item3Title: 'นักเรียนที่สอบติด MWIT / KVIS รอบแรก',
        item3Sub: 'โครงการวิทยาศาสตร์พลังสิบ',
        item3Badge: 'MWIT',
        footerLink: 'ดูเกียรติประวัติทั้งหมด →',
        footerTag: 'HALL OF FAME',
      },
    },
    trending: {
      title: 'TRENDING LABS',
      adminMode: 'ADMIN MODE',
      adminActive: 'ADMIN ACTIVE',
      addTop: '+ ADD TREND',
      addBottom: '+ ADD TREND',
    },
    missionLabs: {
      title: 'THE 7 MISSION LABS',
      openLab: 'OPEN LAB',
      subtitles: {
        1: '— ห้องเรียนออนไลน์ & คลังเอกสาร',
        2: '— ห้องประลองความรู้',
        3: '— แปลงไฟล์ PDF ออกข้อสอบ AI',
        4: '— Library Hub - ห้องสมุด',
        5: '— โรงภาพยนตร์สื่อการเรียนรู้',
        6: '— ชุมชน & บอร์ดกิจกรรมอวกาศ',
        7: '— คลังชีทสรุป & ครีเอเตอร์สตูดิโอ',
      },
      descriptions: {
        1: 'คลังวิดีโอออนไลน์เรียนฟิสิกส์ ดาราศาสตร์ วิทยาศาสตร์ เจาะลึก และเอกสารเรียนฉบับเข้มข้น',
        2: 'สนามประลองโจทย์วิชาการแบบจับเวลาด้วยการ์ดความรู้ flash card ท้าทายความเร็วและจัดอันดับผู้เรียนแบบเรียลไทม์',
        3: 'ระบบปัญญาประดิษฐ์สกัดองค์ความรู้จากเอกสาร แปลงตำราเป็นคลังข้อสอบและแบบฝึกหัดอัตโนมัติ',
        4: 'ห้องสมุดดิจิทัลและคลังสื่อสิ่งพิมพ์ 3 มิติ รองรับการเข้าถึงและดาวน์โหลดอ่านแบบออฟไลน์',
        5: 'ศูนย์รวมสื่อการเรียนรู้วิดีโอวิทยาศาสตร์ วิชาการ การทดลองวิทยาศาสตร์ พร้อมระบบจดจำประวัติการรับชมต่อเนื่อง',
        6: 'ศูนย์กลางแลกเปลี่ยนความคิด และกิจกรรมวิชาการร่วมกัน',
        7: 'พื้นที่บ่มเพาะนักสร้างสรรค์ แหล่งเผยแพร่องค์ความรู้ และสร้างคอร์สเรียนสู่อนาคต',
      },
    },
    coreSystems: {
      title: 'CORE SYSTEMS',
      editMode: 'EDIT MODE',
      adminActive: 'ADMIN ACTIVE',
      saveChanges: 'SAVE CHANGES',
      saved: 'SAVED!',
      items: {
        1: {
          name: 'ONLINE CLASSROOM',
          desc: 'คลังวิดีโอออนไลน์เรียนฟิสิกส์ ดาราศาสตร์ วิทยาศาสตร์ เจาะลึก และเอกสารเรียนฉบับเข้มข้น',
        },
        2: {
          name: 'QUIZ ARENA',
          desc: 'สนามประลองโจทย์วิชาการแบบจับเวลาด้วยการ์ดความรู้ flash card ท้าทายความเร็วและจัดอันดับผู้เรียนแบบเรียลไทม์',
        },
        3: {
          name: 'PDF PILOT',
          desc: 'ระบบปัญญาประดิษฐ์สกัดองค์ความรู้จากเอกสาร แปลงตำราเป็นคลังข้อสอบและแบบฝึกหัดอัตโนมัติ',
        },
        4: {
          name: 'LIBRARY HUB',
          desc: 'ห้องสมุดดิจิทัลและคลังสื่อสิ่งพิมพ์ 3 มิติ รองรับการเข้าถึงและดาวน์โหลดอ่านแบบออฟไลน์',
        },
        5: {
          name: 'EDTECH VIDEO CATALOG',
          desc: 'ศูนย์รวมสื่อการเรียนรู้วิดีโอวิทยาศาสตร์ วิชาการ การทดลองวิทยาศาสตร์ พร้อมระบบจดจำประวัติการรับชมต่อเนื่อง',
        },
        6: {
          name: 'COMMUNITY LOUNGE',
          desc: 'ศูนย์กลางแลกเปลี่ยนความคิด และกิจกรรมวิชาการร่วมกัน',
        },
        7: {
          name: 'SPACE LABS CHANNEL',
          desc: 'พื้นที่บ่มเพาะนักสร้างสรรค์ แหล่งเผยแพร่องค์ความรู้ และสร้างคอร์สเรียนสู่อนาคต',
        },
      },
    },
    aboutMe: {
      title: 'ABOUT ME',
      editText: 'EDIT TEXT',
      editActive: 'EDITING ACTIVE',
      saveChanges: 'SAVE CHANGES',
      saved: 'SAVED!',
      defaultBio:
        'Seven Space Labs คือศูนย์กลางการเรียนรู้และระบบปฏิบัติการดิจิทัลแห่งอนาคต ที่ผสานฟิสิกส์ วิทยาศาสตร์ และเทคโนโลยี EdTech เข้าไว้ด้วยกัน ออกแบบมาเพื่อยกระดับศักยภาพของผู้เรียนและนักสร้างสรรค์ ผ่านสื่อการสอนอินเทอร์แอ็กทีฟ คลังความรู้ และเครื่องมือปัญญาประดิษฐ์ระดับโปรดักชัน',
      lineTitle: 'LINE OFFICIAL',
      lineSub: 'ติดต่อสอบถาม • ติดตามข่าวสารกิจกรรม',
      chatWithUs: 'แอดไลน์พูดคุยกับเรา',
      copyId: 'คัดลอก LINE ID',
      copied: 'คัดลอกแล้ว!',
      openLine: 'เปิดแอป LINE',
    },
    footer: {
      techStack: '// ระบบเทคโนโลยี: Google AI Studio • Gemini API • Physics Engine',
      domainNode: 'Domain Node:',
      tagline: 'Next-Gen Orbital STEM Learning System',
      rights: '© 2025-2026 Seven Space Labs. สงวนลิขสิทธิ์ทั้งหมด',
    },
  },
  en: {
    nav: {
      home: 'HOME',
      login: 'LOGIN',
      profile: 'PROFILE',
      gate: 'GATE',
      core: 'CORE',
      trending: 'TRENDING',
      contact: 'CONTACT',
      level: 'LEVEL',
    },
    hero: {
      titleTop: 'SEVEN SPACE',
      titleBottom: 'LABS',
      motto: 'SEVEN SPACE LABS AN EDTECH SPACE DRIVEN TO CREATE BETTER LEARNING EXPERIENCES',
      workspace: 'WORKSPACE',
      gravitask: 'GraviTask',
    },
    labsUpdate: {
      title: 'LABS UPDATE',
      calendar: {
        badge: 'CALENDAR',
        month: 'OCTOBER',
        title: 'STEM Competitions, Olympiad & Leading School Admissions',
        item1Title: 'POSN Camp 1 Registration Open',
        item1Sub: 'Physics, Astronomy & Mathematics',
        item1Badge: 'POSN',
        item2Title: 'High School Admission Calendar',
        item2Sub: 'KVIS, MWIT & Science Academies',
        item2Badge: 'MWIT',
        item3Title: 'Annual TCAS Exam Schedule',
        item3Sub: 'A-Level, TPAT3 & University Admissions',
        item3Badge: 'TCAS',
        footerLink: 'View All Exam Schedules →',
        footerTag: 'POSN / TCAS',
      },
      radar: {
        badge: 'SCIENCE RADAR',
        freq: 'WEEKLY',
        title: 'Weekly Astrophysics & Space Exploration Tech Highlights',
        item1Title: 'James Webb Telescope Detects Exoplanet Atmosphere',
        item1Time: '2 hours ago',
        item2Title: 'ITER Nuclear Fusion Reactor Achieves Milestone Phase',
        item2Time: '1 day ago',
        item3Title: 'Europa Clipper Mission En Route to Jupiter’s Moon',
        item3Time: '3 days ago',
        footerLink: 'Read All Science Briefs →',
        footerTag: 'Updated Weekly',
      },
      fame: {
        badge: 'HALL OF FAME',
        freq: 'NATIONAL',
        title: 'Honor Board: Olympiad Cadets & National Top Scorers',
        item1Title: 'National Math & Physics Olympiad Representatives',
        item1Sub: 'POSN Gold Medalists 2025',
        item1Badge: 'GOLD',
        item2Title: 'National #1 Physics A-Level Score',
        item2Sub: 'Triam Udom Suksa • 96/100',
        item2Badge: 'TOP 1',
        item3Title: 'MWIT & KVIS Round 1 Qualifiers',
        item3Sub: 'Science Excellence Cadet Network',
        item3Badge: 'MWIT',
        footerLink: 'View Full Hall of Fame →',
        footerTag: 'HALL OF FAME',
      },
    },
    trending: {
      title: 'TRENDING LABS',
      adminMode: 'ADMIN MODE',
      adminActive: 'ADMIN ACTIVE',
      addTop: '+ ADD TREND',
      addBottom: '+ ADD TREND',
    },
    missionLabs: {
      title: 'THE 7 MISSION LABS',
      openLab: 'OPEN LAB',
      subtitles: {
        1: '— Online Classroom & Document Vault',
        2: '— Speed Quiz Battle Arena',
        3: '— AI PDF Exam Generator Studio',
        4: '— 3D Digital Library & Flipbook Hub',
        5: '— EdTech Science Cinema Catalog',
        6: '— Community Space & Cosmic Board',
        7: '— Creator Space Hub & Summary Vault',
      },
      descriptions: {
        1: 'In-depth physics, astronomy, and science video repository with comprehensive study documents.',
        2: 'Timed academic flashcard quiz arena with real-time speed challenges and cadet leaderboards.',
        3: 'AI engine that extracts document knowledge, turning textbooks into automated practice exams.',
        4: 'Digital library and 3D interactive publication vault with offline reading support.',
        5: 'Science documentary cinema and experimental video center with continuous playback history.',
        6: 'Central lounge for idea sharing, collaborative academic activities, and discussions.',
        7: 'Incubator space for creators, knowledge sharing, and future course authoring.',
      },
    },
    coreSystems: {
      title: 'CORE SYSTEMS',
      editMode: 'EDIT MODE',
      adminActive: 'ADMIN ACTIVE',
      saveChanges: 'SAVE CHANGES',
      saved: 'SAVED!',
      items: {
        1: {
          name: 'ONLINE CLASSROOM',
          desc: 'In-depth physics, astronomy, and science video repository with comprehensive study documents.',
        },
        2: {
          name: 'QUIZ ARENA',
          desc: 'Timed academic flashcard quiz arena with real-time speed challenges and cadet leaderboards.',
        },
        3: {
          name: 'PDF PILOT',
          desc: 'AI engine extracting knowledge from documents, turning textbooks into automated exams.',
        },
        4: {
          name: 'LIBRARY HUB',
          desc: 'Digital library and 3D publication vault supporting offline downloads and reading.',
        },
        5: {
          name: 'EDTECH VIDEO CATALOG',
          desc: 'Science documentary cinema and academic experimental video center with watch history.',
        },
        6: {
          name: 'COMMUNITY LOUNGE',
          desc: 'Interactive community lounge for idea sharing and collaborative academic activities.',
        },
        7: {
          name: 'SPACE LABS CHANNEL',
          desc: 'Incubator for creators, knowledge sharing hub, and future course creator studios.',
        },
      },
    },
    aboutMe: {
      title: 'ABOUT ME',
      editText: 'EDIT TEXT',
      editActive: 'EDITING ACTIVE',
      saveChanges: 'SAVE CHANGES',
      saved: 'SAVED!',
      defaultBio:
        'Seven Space Labs is a next-generation learning hub and digital operating system bridging physics, science, and EdTech. Designed to empower students and creators through interactive media, curated knowledge vaults, and production-grade artificial intelligence.',
      lineTitle: 'LINE OFFICIAL',
      lineSub: 'Inquiries & Community Announcements',
      chatWithUs: 'Add LINE to Connect',
      copyId: 'Copy LINE ID',
      copied: 'Copied!',
      openLine: 'Open LINE App',
    },
    footer: {
      techStack: '// Tech Stack: Google AI Studio • Gemini API • Physics Engine',
      domainNode: 'Domain Node:',
      tagline: 'Next-Gen Orbital STEM Learning System',
      rights: '© 2025-2026 Seven Space Labs. All rights synchronized.',
    },
  },
};

// Bilingual Trending cards map
export const TRENDING_CARDS_I18N: Record<string, { th: string; en: string }> = {
  t1: {
    th: 'การ์ดความรู้เรื่องสถานที่สำคัญโรมันโบราณ และตำนานดาว',
    en: 'Ancient Roman Landmarks & Constellation Lore',
  },
  t2: {
    th: 'เซลล์พืชหรือเซลล์สัตว์? แยกให้ออกใน 30 วินาที',
    en: 'Plant Cell vs Animal Cell? Identify in 30 Seconds',
  },
  t3: {
    th: 'อันนี้หรืออันนั้น_ของหวานหรือของคาว',
    en: 'This or That: Sweet Desserts or Savory Dishes',
  },
  t4: {
    th: 'แรงสู่ศูนย์กลาง & วงโคจรดาวเทียมรอบโลก',
    en: 'Centripetal Force & Orbital Mechanics Around Earth',
  },
  t5: {
    th: 'เทอร์โมไดนามิกส์และเอนโทรปีในห้วงจักรวาล',
    en: 'Thermodynamics & Cosmic Entropy in Deep Space',
  },
  t6: {
    th: 'โครงสร้างพันธุศาสตร์และวิวัฒนาการสิ่งมีชีวิต',
    en: 'Genetic Structures & Evolutionary Biology',
  },
  t7: {
    th: 'ประวัติศาสตร์อารยธรรมและโบราณคดีอวกาศ',
    en: 'Civilization History & Astro-Archeology Records',
  },
  b1: {
    th: 'แปลงไฟล์ตำราวิชาการเป็นข้อสอบ 20 ข้อด้วย AI',
    en: 'Convert Textbooks into 20-Question AI Exams',
  },
  b2: {
    th: 'สำรวจอาชีพดาราศาสตร์ & วิศวกรรมอวกาศ',
    en: 'Careers in Astronomy & Aerospace Engineering',
  },
  b3: {
    th: 'ฟิสิกส์นิวเคลียร์ & ประวัตินักวิทย์ก้องโลก',
    en: 'Nuclear Physics & World-Renowned Scientists',
  },
  b4: {
    th: 'สมุดภาพฟลิปบุ๊ก 3D กลุ่มดาวจักรราศี',
    en: 'Interactive 3D Zodiac Constellations Flipbook',
  },
  b5: {
    th: 'โมเดลทำนายการเคลื่อนที่ของดาวหางด้วย Machine Learning',
    en: 'Comet Trajectory Prediction via Machine Learning',
  },
  b6: {
    th: 'การจำลองกลศาสตร์ควอนตัมบนเว็บเบราว์เซอร์',
    en: 'In-Browser Quantum Mechanics Physics Simulation',
  },
  b7: {
    th: 'สารานุกรมระบบสุริยะและการสำรวจดาวอังคาร',
    en: 'Solar System Encyclopedia & Mars Exploration Log',
  },
};
