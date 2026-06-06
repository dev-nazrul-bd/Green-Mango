import React from 'react';
import { Leaf, TrendingUp, GlassWater, Eye, Award } from 'lucide-react';

interface FilterProps {
  language: 'bn' | 'en';
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  productCount: number;
}

export default function CategoryFilter({
  language,
  activeCategory,
  onCategoryChange,
  productCount,
}: FilterProps) {
  const categories = [
    { id: 'all', bn: 'সব পণ্য 🛍️', en: 'All Delights 🛍️', icon: Award },
    { id: 'fresh-mango', bn: 'তাজা আম 🥭', en: 'Fresh Mangoes 🥭', icon: Leaf },
    { id: 'juice', bn: 'খাঁটি জুস 🍹', en: 'Pure Nectars 🍹', icon: GlassWater },
    { id: 'mango-bar', bn: 'ম্যাঙ্গো বার 🍫', en: 'Mango Bars 🍫', icon: TrendingUp },
    { id: 'pickle', bn: 'আমের আচার 🏺', en: 'Rich Pickles 🏺', icon: Eye },
  ];

  const t = {
    bn: {
      showing: 'টি পণ্য প্রদর্শিত হচ্ছে',
      filterTitle: 'ক্যাটাগরি সমূহ',
    },
    en: {
      showing: 'items found matching',
      filterTitle: 'Our Curations',
    },
  }[language];

  return (
    <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-50 pb-5" id="category-filter-section">
      <div>
        <h3 className="text-xs font-semibold text-emerald-800 uppercase tracking-widest font-sans mb-1">
          {t.filterTitle}
        </h3>
        <p className="text-2xl font-bold font-sans text-emerald-950">
          {language === 'bn' ? 'আমের বিশেষ সম্ভার' : 'Savor Organic Harvests'}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-full px-5 py-2.5 text-xs font-bold leading-none uppercase font-sans tracking-wide transition-all duration-300 flex items-center gap-2 cursor-pointer select-none ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-400/20'
                  : 'bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 text-emerald-800'
              }`}
            >
              <span>{language === 'bn' ? cat.bn : cat.en}</span>
            </button>
          );
        })}
      </div>

      <div className="text-right flex items-center md:justify-end gap-1.5 self-start md:self-center">
        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="font-sans text-xs font-bold text-emerald-700/80 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
          {language === 'bn' ? `${productCount} ${t.showing}` : `${productCount} ${t.showing}`}
        </span>
      </div>
    </div>
  );
}
