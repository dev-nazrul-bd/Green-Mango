import React, { useEffect, useState, useRef } from 'react';
import { Leaf, CheckCircle, Flame, Sparkles } from 'lucide-react';

interface TimelineProps {
  language: 'bn' | 'en';
}

export default function ProcessTimeline({ language }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calculate how far down the section has scrolled relative to viewport
      const totalDist = rect.height + viewportHeight;
      const progress = Math.min(Math.max((viewportHeight - rect.top) / totalDist, 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const steps = [
    {
      num: '১',
      numEn: '1',
      titleBn: 'অর্গানিক মুকুল ও যত্ন',
      titleEn: 'Organic Sprouting & Care',
      descBn: 'আম উৎপাদনের শুরু থেকেই বিষাক্ত কীটনাশক ব্যতিরেকে জৈব সার ও প্রাকৃতিক পরিচর্যা ব্যবহার করা হয়।',
      descEn: 'From initial sprouting, we rely 100% on natural compost and organic crop shields. Zero synthetic poisons.',
      icon: '🌸',
      bgImg: 'https://images.unsplash.com/photo-1591189863430-ab87e120f312?q=80&w=600&auto=format&fit=crop'
    },
    {
      num: '২',
      numEn: '2',
      titleBn: 'হাতে বাছাই আমের সংগ্রহ',
      titleEn: 'Hand-Picked Harvest',
      descBn: 'অভিজ্ঞ চাষিরা সরাসরি আম গাছ থেকে পুষ্ট ও সুন্দর আম নিখুঁত অবস্থায় ডাঁটাসহ হাতে টেনে পেড়ে নেন।',
      descEn: 'Skilled farmers scale selected trees to carefully pluck mature mangoes with intact stalks to prevent sap marks.',
      icon: '🌿',
      bgImg: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&auto=format&fit=crop'
    },
    {
      num: '৩',
      numEn: '3',
      titleBn: 'সর্টিং ও কেমিক্যাল-মুক্ত প্রসেসিং',
      titleEn: 'Clean Sorting & Zero Spraying',
      descBn: 'কোনো কার্বাইড বা ক্ষতিকারক ইথ্রেল স্প্রে ছাড়া কুসুম গরম পানিতে ফাঙ্গাসমুক্ত করে খড় দিয়ে প্রাকৃতিকভাবে পাকানো হয়।',
      descEn: 'Absolutely zero calcium carbide. Fruits are cleansed using pure warm water, sorted, and naturally ripened in straw beds.',
      icon: '🧹',
      bgImg: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=600&auto=format&fit=crop'
    },
    {
      num: '৪',
      numEn: '4',
      titleBn: 'পরিবেশ-বান্ধব প্যাকেজিং ও টেবিল',
      titleEn: 'Eco-Friendly Packing to Your Table',
      descBn: 'ছিদ্রযুক্ত কাঠের ঝুড়ি বা ঘন ক্রাফট পেপার বক্সে আমগুলো সাজিয়ে দ্রুততম সময়ে আপনার ডাইনিং টেবিলে পাঠানো হয়।',
      descEn: 'Nicely arranged in ventilated straw-padded carton chambers, shipped immediately to safeguard taste and freshness.',
      icon: '🏡',
      bgImg: 'https://images.unsplash.com/photo-1502741224143-90386d7f8c82?q=80&w=600&auto=format&fit=crop'
    }
  ];

  const t = {
    bn: {
      heading: 'আমাদের গল্প ও কর্মপদ্ধতি',
      sub: 'বাগান থেকে আপনার খাবার টেবিল পর্যন্ত আমাদের স্বচ্ছতা',
    },
    en: {
      heading: 'Orchard to Dining Table',
      sub: 'Committed to complete transparency across our process',
    }
  }[language];

  // Derive scroll-based custom offsets for layered depth illustration
  const offset1 = (scrollProgress - 0.5) * 80;
  const offset2 = (scrollProgress - 0.5) * -130;
  const rotationAngle = (scrollProgress - 0.5) * 45;

  return (
    <section 
      ref={containerRef}
      className="relative py-24 bg-gradient-to-b from-stone-50 via-emerald-50/50 to-white overflow-hidden scroll-mt-20 border-b border-emerald-100/10"
      id="process-section"
    >
      
      {/* BACKGROUND FLOATING LAYER 1 (Parallax depth element) */}
      <div 
        className="absolute top-1/4 left-5 text-8xl opacity-10 pointer-events-none select-none hidden md:block"
        style={{
          transform: `translateY(${offset1}px) rotate(${rotationAngle}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        🍃
      </div>

      <div 
        className="absolute bottom-1/4 right-5 text-9xl opacity-10 pointer-events-none select-none hidden md:block"
        style={{
          transform: `translateY(${offset2}px) rotate(${-rotationAngle}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        🥭
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 mb-4 uppercase tracking-widest font-sans">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'শতভাগ বিশুদ্ধতা' : '100% Purity Process'}</span>
          </div>
          <h2 className="font-sans text-3xl sm:text-4xl font-black text-emerald-950 tracking-tight leading-tight">
            {t.heading}
          </h2>
          <p className="font-sans text-xs sm:text-sm font-medium text-emerald-700 mt-2.5">
            {t.sub}
          </p>
        </div>

        {/* Layered Cards Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, idx) => {
            // Give individual cards cascading top translations to simulate waves
            const cardFloatY = (scrollProgress - 0.5) * (30 * (idx - 1.5));

            return (
              <div 
                key={idx}
                className="group relative rounded-3xl bg-white border border-emerald-100/50 p-5 shadow-xs transition-all duration-500 hover:shadow-xl hover:border-emerald-300"
                style={{
                  transform: `translateY(${cardFloatY}px)`,
                  transition: 'transform 0.15s cubic-bezier(0.1, 0.8, 0.25, 1)'
                }}
              >
                {/* Visual Step Layer image */}
                <div className="relative w-full h-40 rounded-2xl overflow-hidden mb-5">
                  <img
                    src={step.bgImg}
                    alt={step.titleEn}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover grayscale-5 hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  
                  {/* Floating Number Card overlay */}
                  <div className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400 font-black font-sans text-emerald-950 shadow-md">
                    {language === 'bn' ? step.num : step.numEn}
                  </div>

                  <div className="absolute bottom-3 right-3 text-2xl select-none leading-none bg-white p-2 rounded-xl shadow-xs">
                    {step.icon}
                  </div>
                </div>

                {/* Info Elements */}
                <h4 className="font-sans text-base font-extrabold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors">
                  {language === 'bn' ? step.titleBn : step.titleEn}
                </h4>

                <p className="mt-3 font-sans text-xs text-emerald-700/80 leading-relaxed font-normal">
                  {language === 'bn' ? step.descBn : step.descEn}
                </p>

                {/* Checkmark Indicator */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="h-1 flex-1 bg-emerald-100/40 rounded-full group-hover:bg-yellow-250 transition-colors"></span>
                  <CheckCircle className="w-5 h-5 text-emerald-500 ml-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>

              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}
