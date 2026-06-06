import React, { useEffect, useState } from 'react';
import { Sparkles, Leaf, ArrowDownCircle } from 'lucide-react';

interface HeroProps {
  language: 'bn' | 'en';
}

export default function HeroParallax({ language }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = {
    bn: {
      badge: '১০০% প্রাকৃতিক ও রাসায়নিক মুক্ত',
      headingMain: 'মধুময় ও তাজা আমের',
      headingAlt: 'অনাবিল স্বাদ ও সতেজতা!',
      desc: 'রাজশাহী ও রংপুরের ঐতিহ্যবাহী আম বাগান থেকে সরাসরি আপনার ঘরে। ফরমালিন ও বিষাক্ত স্প্রেবিহীন সম্পুর্ণ অরগানিক পাকা আম ও আমের সুস্বাদু পণ্য।',
      buttonShop: 'আমের মেলা দেখুন 🥭',
      buttonStory: 'আমাদের গল্প',
      bannerFeature1: 'বাগানের তাজা আম',
      bannerFeature2: 'খাঁটি প্রসেসড জুস',
      bannerFeature3: 'ঐতিহ্যবাহী আচার',
    },
    en: {
      badge: '100% Organic & Chemical-Free',
      headingMain: 'Glorious Ripe Mangoes',
      headingAlt: 'Bursting with Nature’s Sweetness',
      desc: 'Sourced directly from selected orchards in Rajshahi and Rangpur. Chemical-free, premium scale organic mangoes and processed traditional mango delicacies.',
      buttonShop: 'Explore Store 🥭',
      buttonStory: 'Our Journey',
      bannerFeature1: 'Orchard Fresh',
      bannerFeature2: 'Pure Nectar Juice',
      bannerFeature3: 'Homemade Pickles',
    },
  }[language];

  // Parallax translation variables
  const backgroundY = scrollY * 0.45; // Back layer drifts at 45% of scroll speed
  const midY = scrollY * 0.25;        // Mid layer (plants) drifts at 25% of scroll
  const textY = scrollY * 0.08;       // Text shifts slightly at 8% scroll

  return (
    <div
      className="relative w-full h-[90vh] md:h-[85vh] overflow-hidden bg-linear-to-b from-emerald-900 via-emerald-800 to-emerald-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 border-b-4 border-yellow-400"
      id="hero-section"
    >
      
      {/* BACKGROUND LAYER: Vibrant Orchard Backdrop (Parallax) */}
      <div
        className="absolute inset-0 w-full h-full mix-blend-overlay opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=1500&auto=format&fit=crop')`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          transform: `translateY(${backgroundY}px)`,
          transition: 'transform 0.05s linear',
        }}
      />

      {/* SPECIAL DECORATIVE AMBIENT SUNBEAM OVERLAY */}
      <div className="absolute inset-0 bg-radial-gradient from-yellow-300/10 via-transparent to-transparent pointer-events-none opacity-60"></div>

      {/* FLOAT LAYER 2: Cascading Leaves and Fruits */}
      <div 
        className="absolute top-10 left-[8%] z-10 w-24 h-24 bg-cover pointer-events-none opacity-40 md:opacity-75"
        style={{
          transform: `translateY(${midY * 1.2}px) rotate(${scrollY * 0.05}deg)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        <Leaf className="w-12 h-12 text-yellow-300 transform rotate-45" />
      </div>
      
      <div 
        className="absolute bottom-20 right-[10%] z-10 w-20 h-20 bg-cover pointer-events-none opacity-30 md:opacity-85"
        style={{
          transform: `translateY(${midY * 0.8}px) scale(${1 - scrollY * 0.0005})`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        <span className="text-5xl select-none leading-none animate-bounce">🥭</span>
      </div>

      <div 
        className="absolute top-20 right-[15%] z-10 pointer-events-none opacity-20 md:opacity-50"
        style={{
          transform: `translateY(${midY * 1.5}px) rotate(${-scrollY * 0.03}deg)`,
          transition: 'transform 0.05s ease-out',
        }}
      >
        <Leaf className="w-10 h-10 text-emerald-400" />
      </div>

      {/* FOREGROUND LAYER 3: Hero Content */}
      <div 
        className="relative z-20 max-w-5xl mx-auto text-center"
        style={{
          transform: `translateY(${textY}px)`,
          transition: 'transform 0.08s ease-out'
        }}
      >
        
        {/* Quality Checked Badge */}
        <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-400/90 text-sm font-sans font-bold text-emerald-950 px-4 py-1.5 shadow-md shadow-yellow-400/10 mb-6 scale-95 md:scale-100">
          <Sparkles className="w-4.5 h-4.5 text-emerald-950 animate-spin" />
          <span>{t.badge}</span>
        </div>

        {/* Localized Headings */}
        <h2 className="font-sans text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-tight select-none">
          <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
            {t.headingMain}
          </span>
          <br />
          <span className="text-white drop-shadow-sm">
            {t.headingAlt}
          </span>
        </h2>

        {/* Dynamic Description */}
        <p className="font-sans text-emerald-100 max-w-2xl mx-auto mt-6 text-sm sm:text-base md:text-lg leading-relaxed font-normal opacity-95">
          {t.desc}
        </p>

        {/* Interactive action anchors */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
          <a
            href="#products-section"
            className="rounded-full bg-yellow-400 hover:bg-yellow-300 active:scale-95 text-emerald-950 font-sans font-extrabold px-8 py-4 text-[13px] md:text-sm tracking-wide transition-all shadow-lg shadow-yellow-400/20 duration-300 transform select-none cursor-pointer"
          >
            {t.buttonShop}
          </a>
          <a
            href="#process-section"
            className="rounded-full border-2 border-white/50 hover:border-white text-white font-sans font-bold px-6 py-3.5 text-xs tracking-wide transition-all duration-300 select-none backdrop-blur-xs cursor-pointer"
          >
            {t.buttonStory}
          </a>
        </div>

        {/* Feature List Mini-cards */}
        <div className="mt-16 grid grid-cols-3 gap-3 md:gap-6 max-w-3xl mx-auto">
          {[
            { label: t.bannerFeature1, icon: '🏡', cl: 'from-emerald-50 to-emerald-100/15' },
            { label: t.bannerFeature2, icon: '🍹', cl: 'from-yellow-50 to-yellow-105/15' },
            { label: t.bannerFeature3, icon: '🏺', cl: 'from-amber-50 to-amber-105/15' }
          ].map((item, index) => (
            <div 
              key={index} 
              className="rounded-xl border border-white/10 bg-white/5 p-3.5 flex flex-col items-center text-center backdrop-blur-xs shadow-inner"
              style={{
                transform: `translateY(${midY * 0.1 * (index + 1)}px)`,
                transition: 'transform 0.05s ease-out'
              }}
            >
              <span className="text-xl md:text-2xl mb-1.5 select-none">{item.icon}</span>
              <span className="font-sans text-[11px] md:text-xs font-bold text-yellow-300 truncate tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Floating indicator */}
      <a 
        href="#products-section"
        className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 hover:text-yellow-300 text-white/70 transition-colors animate-bounce"
      >
        <span className="text-[10px] uppercase font-bold tracking-widest font-sans">Scroll</span>
        <ArrowDownCircle className="w-5 h-5" />
      </a>

    </div>
  );
}
