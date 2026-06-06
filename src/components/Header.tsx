import React, { useState } from 'react';
import { ShoppingBag, User, LogOut, Settings, Search, Menu, X, Globe, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  language: 'bn' | 'en';
  onLanguageToggle: () => void;
  cartCount: number;
  onCartOpen: () => void;
  currentUser: UserProfile | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  isAdmin: boolean;
  onAdminToggle: () => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export default function Header({
  language,
  onLanguageToggle,
  cartCount,
  onCartOpen,
  currentUser,
  onLoginClick,
  onLogoutClick,
  isAdmin,
  onAdminToggle,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = {
    bn: {
      brand: 'Green Mango',
      slogan: 'তাজা ও অর্গানিক আম',
      searchPlaceholder: 'সুস্বাদু আম বা আচার খুঁজুন...',
      login: 'লগইন',
      logout: 'লগআউট',
      admin: 'ড্যাশবোর্ড',
      cart: 'ঝুড়ি',
      home: 'মূল পাতা',
      products: 'পণ্যসমূহ',
      ourStory: 'আমাদের কথা',
      contact: 'যোগাযোগ',
    },
    en: {
      brand: 'Green Mango',
      slogan: 'Fresh & Organic Mangoes',
      searchPlaceholder: 'Search fresh mangoes, pickles...',
      login: 'Sign In',
      logout: 'Sign Out',
      admin: 'Dashboard',
      cart: 'Cart',
      home: 'Home',
      products: 'Products',
      ourStory: 'Our Process',
      contact: 'Contact',
    },
  }[language];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100/20 bg-white/80 backdrop-blur-md" id="app-header">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Slogan */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-12 w-12 items-center justify-between rounded-full bg-linear-to-tr from-emerald-500 to-yellow-400 p-2.5 shadow-md shadow-emerald-200/50">
            <span className="text-2xl select-none leading-none">🥭</span>
            <div className="absolute -top-1 -right-1 flex h-4 w-4 animate-ping rounded-full bg-yellow-400 opacity-75"></div>
          </div>
          <div>
            <h1 className="font-sans text-xl font-bold tracking-tight text-emerald-950 flex items-center gap-1.5">
              {t.brand}
              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                PRO
              </span>
            </h1>
            <p className="font-sans text-[11px] font-medium text-emerald-600/90 tracking-wide">
              {t.slogan}
            </p>
          </div>
        </div>

        {/* Global Search Bar (Desktop) */}
        <div className="hidden md:flex relative max-w-md w-full mx-8">
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-emerald-100 bg-emerald-50/30 py-2.5 pl-10 pr-4 text-sm font-sans text-emerald-950 placeholder-emerald-600/60 transition-all duration-300 focus:border-emerald-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-200/50"
            id="desktop-search-input"
          />
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-emerald-600/70" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-2.5 rounded-full p-0.5 hover:bg-emerald-150 text-emerald-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation & Controls Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-6">
          
          {/* Admin Panel (Accessible to everyone, no account check) */}
          <button
            onClick={onAdminToggle}
            className="flex items-center gap-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white px-4 py-1.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
            id="admin-panel-btn"
          >
            <Settings className="h-3.5 w-3.5" />
            <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
          </button>

          {/* Language Selector */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-all cursor-pointer"
            title="ভাষা পরিবর্তন করুন / Change Language"
            id="lng-toggle-btn"
          >
            <Globe className="h-3.5 w-3.5 text-emerald-600" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

          {/* Profile Status */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-xs font-semibold text-emerald-950 leading-tight">
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] font-medium text-emerald-600/80">
                  {currentUser.role === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক'}
                </span>
              </div>
              <button
                onClick={onLogoutClick}
                className="rounded-full p-2 hover:bg-red-50 text-emerald-700 hover:text-red-600 transition-all"
                title={t.logout}
                id="logout-btn"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-4.5 py-2 text-xs font-semibold tracking-wide transition-all shadow-md shadow-emerald-400/20 active:scale-95 cursor-pointer"
              id="login-btn"
            >
              <User className="h-4 w-4" />
              <span>{t.login}</span>
            </button>
          )}

          {/* Cart Icon */}
          <button
            onClick={onCartOpen}
            className="group relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 hover:bg-emerald-100 transition-all"
            id="desktop-cart-btn"
          >
            <ShoppingBag className="h-5.5 w-5.5 text-emerald-800 transition-transform group-hover:scale-110" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white shadow-xs">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Mobile controls bar (Medium & Small Screens) */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={onLanguageToggle}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 text-emerald-800"
            id="mobile-lang-btn"
          >
            <Globe className="h-4 w-4" />
          </button>

          {/* Cart Icon (Mobile) */}
          <button
            onClick={onCartOpen}
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50"
            id="mobile-cart-btn"
          >
            <ShoppingBag className="h-4.5 w-4.5 text-emerald-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          {/* Hamburger Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-800"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-150 bg-white/95 px-4 py-5 space-y-4 shadow-inner animate-in fade-in slide-in-from-top-3 duration-300">
          
          {/* Search bar in Mobile */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-full border border-emerald-100 bg-emerald-50/30 py-2 pl-9 pr-4 text-xs font-sans text-emerald-950 placeholder-emerald-600/60"
              id="mobile-search-input"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-emerald-600/70" />
          </div>

          <div className="flex flex-col gap-2 font-sans pt-1">
            {/* Mobile Admin Toggle (No account needed) */}
            <button
              onClick={() => {
                onAdminToggle();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-amber-500 py-2.5 text-xs font-bold text-white cursor-pointer"
              id="mobile-admin-panel-btn"
            >
              <Settings className="h-4 w-4" />
              <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between rounded-lg bg-emerald-50/50 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold leading-none uppercase">
                    {currentUser.displayName.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">{currentUser.displayName}</p>
                    <p className="text-[10px] text-emerald-600">
                      {currentUser.role === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onLogoutClick();
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-full p-1.5 bg-red-50 text-red-600 hover:bg-red-100"
                  id="mobile-logout-btn"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onLoginClick();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-600 py-2.5 text-xs font-bold text-white"
                id="mobile-login-btn"
              >
                <User className="h-4 w-4" />
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
