import React, { useState } from 'react';
import { Search, Sparkles, Filter, Globe } from 'lucide-react';
import { ThemeMode, Language } from '../types';

interface SearchFilterBarProps {
  theme: ThemeMode;
  lang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSearchSubmit: (query: string) => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  theme,
  lang,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  onSearchSubmit,
}) => {
  const isWhite = theme === 'white';

  const categories = [
    { id: 'all', labelTh: 'ทั้งหมด', labelEn: 'All Units' },
    { id: 'primary', labelTh: 'ประถม', labelEn: 'Primary' },
    { id: 'middle', labelTh: 'ม.ต้น', labelEn: 'Middle School' },
    { id: 'high', labelTh: 'ม.ปลาย', labelEn: 'High School' },
    { id: 'physics', labelTh: 'ฟิสิกส์', labelEn: 'Physics' },
    { id: 'astronomy', labelTh: 'ดาราศาสตร์', labelEn: 'Astronomy' },
    { id: 'kids-science', labelTh: 'วิทยาศาสตร์เด็ก', labelEn: 'Kids Science' },
    { id: 'general', labelTh: 'ความรู้ทั่วไป', labelEn: 'General Science' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(searchQuery);
  };

  return (
    <section className="relative w-full py-4">
      <div
        className={`rounded-2xl p-4 sm:p-5 transition-all ${
          isWhite ? 'liquid-glass-white-card' : 'liquid-glass'
        }`}
      >
        {/* Search input bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                lang === 'th'
                  ? 'ค้นหาบทเรียน, คลังข้อสอบฟิสิกส์, นิทานดวงดาว, หรือชีทสรุปจาก Creator...'
                  : 'Search astrophysics lectures, exam sheets, celestial stories or Creator summaries...'
              }
              className={`w-full pl-11 pr-14 py-3 rounded-xl text-xs sm:text-sm font-normal border transition-all outline-hidden ${
                isWhite
                  ? 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'
                  : 'bg-slate-900/90 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-900/50'
              }`}
            />
            <span className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs hover:shadow-indigo-500/25 transition-all active:scale-[0.98] cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{lang === 'th' ? 'ค้นหา (Search)' : 'Search'}</span>
            </button>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-3 text-xs font-semibold rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>10,000+ {lang === 'th' ? 'รายการเปิดสาธารณะ' : 'Open Vault Records'}</span>
            </div>
          </div>
        </form>

        {/* Quick Filter Tag Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'th' ? 'ตัวกรองด่วน:' : 'Quick Filters:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isWhite
                      ? 'bg-slate-100/90 hover:bg-slate-200/80 text-slate-600'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {lang === 'th' ? cat.labelTh : cat.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
