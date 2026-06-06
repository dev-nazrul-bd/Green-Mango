import React from 'react';
import { Phone, Mail, MapPin, Facebook, Linkedin, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  language: 'bn' | 'en';
}

export default function Footer({ language }: FooterProps) {
  
  const t = {
    bn: {
      desc: 'Green Mango সরাসরি রাজশাহীর শ্রেষ্ঠ আম বাগান থেকে কেমিক্যাল ও ফরমালিন মুক্ত তাজা আম, আমের খাঁটি জুস, ঘরে তৈরি আচার এবং কুলায় রোদ-শুকানো আমসত্ত্ব গ্রাহকের দোরগোড়ায় পৌঁছে দিতে প্রতিশ্রুতিবদ্ধ।',
      linksTitle: 'কুইক লিংকস',
      home: 'মূল পাতা',
      products: 'আমের সম্ভার',
      process: 'আমাদের জার্নি',
      contact: 'যোগাযোগ করুন',
      devTitle: 'প্ল্যাটফর্ম ডেভেলাপার',
      devBio: 'এই আধুনিক ই-কমার্স ওয়েবসাইটটি অত্যন্ত দক্ষতার সাথে তৈরি করেছেন Dev Nazrul। যেকোনো জটিল ওয়েব সলিউশন বা ব্যবসায়িক প্রয়োজনে সরাসরি নিম্নের লিংকে যোগাযোগ করতে পারেন।',
      addressVal: 'উত্তরা সেক্টর ৪, ঢাকা, বাংলাদেশ (আম প্রাপ্তি: রাজশাহী ও রংপুর বাগান)',
      copyright: '© ২০২৬ Green Mango। সর্বস্বত্ব সংরক্ষিত।',
      trustTitle: 'কেন আমরাই সেরা?',
      trust1: 'শতভাগ কেমিক্যাল মুক্ত',
      trust2: 'অর্গানিক ফ্রেশ ডাস্ট-ফ্রি',
      trust3: 'অর্ডার পর বাগান চয়ন',
    },
    en: {
      desc: 'Green Mango delivers premium, carbide-free naturally grown fresh mangoes, raw mango juices, organic fruit bars, and sun-dried spicy pickles directly from selected Rajshahi orchards right to your dining table.',
      linksTitle: 'Quick Explore',
      home: 'Welcome Hub',
      products: 'Store Catalog',
      process: 'Orchard Journey',
      contact: 'Get in Touch',
      devTitle: 'Developer Identity',
      devBio: 'This interactive e-commerce platform has been carefully crafted by Dev Nazrul. Contact directly for advanced web adjustments, custom applications, or system integration queries.',
      addressVal: 'Uttara Sector 4, Dhaka, Bangladesh (Orchards: Rajshahi & Rangpur)',
      copyright: '© 2026 Green Mango. All Rights Reserved.',
      trustTitle: 'Guaranteed Standards',
      trust1: '100% Organic Ripened',
      trust2: 'Dust Protected Quality',
      trust3: 'Harvested Post-Order',
    }
  }[language];

  return (
    <footer className="bg-emerald-950 text-emerald-100 font-sans border-t-4 border-yellow-400" id="app-footer">
      
      {/* Top Value Propositions */}
      <div className="bg-emerald-900/50 border-b border-emerald-900 py-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { tag: t.trust1, icon: '🌿', text: language === 'bn' ? 'কোনো রাসায়নিক কার্বাইড বা স্প্রে ব্যবহার করা হয় না।' : 'Strict compliance against artificial chemical ripening.' },
            { tag: t.trust2, icon: '🛡️', text: language === 'bn' ? 'সম্পূর্ণ পরিষ্কার হাইজেনিক নিয়মে পণ্য রক্ষণাবেক্ষণ।' : 'Sorted & packaged in hygienic dust-controlled facilities.' },
            { tag: t.trust3, icon: '🌳', text: language === 'bn' ? 'গাছে পাকা সুমিষ্ট আমের নিখুঁত নিশ্চয়তা।' : 'Only pluck mature crops once order confirmation is received.' }
          ].map((item, idx) => (
            <div key={idx} className="flex gap-4 items-start">
              <span className="text-3xl select-none leading-none">{item.icon}</span>
              <div>
                <h4 className="text-sm font-extrabold text-yellow-300">{item.tag}</h4>
                <p className="text-xs text-emerald-250 mt-1 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl select-none leading-none">🥭</span>
            <span className="text-xl font-black text-white tracking-tight">Green Mango</span>
          </div>
          <p className="text-xs text-emerald-300 leading-relaxed font-normal">
            {t.desc}
          </p>
        </div>

        {/* Links Column */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-yellow-300">{t.linksTitle}</h4>
          <ul className="space-y-2.5 text-xs font-semibold">
            <li><a href="#hero-section" className="hover:text-white transition-colors">{t.home}</a></li>
            <li><a href="#products-section" className="hover:text-white transition-colors">{t.products}</a></li>
            <li><a href="#process-section" className="hover:text-white transition-colors">{t.process}</a></li>
          </ul>
        </div>

        {/* Contact info */}
        <div className="space-y-4">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-yellow-300">{t.contact}</h4>
          <ul className="space-y-3 text-xs text-emerald-300">
            <li className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.addressVal}</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-extrabold text-yellow-300">01793840762 (Dev Nazrul)</span>
            </li>
            <li className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="underline select-all">nazrul.islam.uli019@gmail.com</span>
            </li>
          </ul>
        </div>

        {/* Developer special bio */}
        <div className="space-y-4 bg-emerald-900/20 border border-emerald-900 p-4.5 rounded-2xl">
          <h4 className="text-xs uppercase font-black tracking-widest text-yellow-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{t.devTitle}</span>
          </h4>
          <p className="text-[11px] text-emerald-300 leading-relaxed font-normal">
            {t.devBio}
          </p>
          <div className="flex gap-3 pt-2">
            <a
              href="https://www.facebook.com/4nazrul.islam"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition"
              title="Facebook Profile Link"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/md-nazrul-islam-482722411"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-800 text-white hover:bg-emerald-700 transition"
              title="LinkedIn Profile Link"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/8801793840762"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-400 text-emerald-950 hover:bg-yellow-300 transition"
              title="WhatsApp Chat Link"
            >
              <span className="text-xs font-black">WA</span>
            </a>
          </div>
        </div>

      </div>

      {/* Underbar Copyright */}
      <div className="border-t border-emerald-900 text-center py-6 px-4 text-[11px] text-emerald-400 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-3">
        <span>{t.copyright}</span>
        <span className="flex items-center gap-1">
          Developed with <Heart className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" /> by 
          <a 
            href="https://www.linkedin.com/in/md-nazrul-islam-482722411" 
            target="_blank" 
            rel="noreferrer" 
            className="font-black text-white hover:underline scale-105"
          >
            Dev Nazrul
          </a>
        </span>
      </div>

    </footer>
  );
}
