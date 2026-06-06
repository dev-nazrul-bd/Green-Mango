/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBag, Sparkles, MessageSquare, Phone, ShieldCheck, 
  UserCheck, AlertCircle, RefreshCw, LogIn, Mail, Lock, CheckCircle, X
} from 'lucide-react';

// Import Types
import { Product, CartItem, Order, UserProfile } from './types';

// Import Services & Helpers
import { 
  auth, 
  db, 
  isFirebaseAvailable, 
  loadProducts, 
  updateProductInDb, 
  fetchOrders, 
  createOrderInDb, 
  saveProfile, 
  fetchProfile,
  deleteProductFromDb
} from './firebase';

import { doc, updateDoc } from 'firebase/firestore';

import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// Import Layout Components
import Header from './components/Header';
import HeroParallax from './components/HeroParallax';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import ProcessTimeline from './components/ProcessTimeline';
import ProductDetailModal from './components/ProductDetailModal';
import OrderModal from './components/OrderModal';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState<'bn' | 'en'>('bn');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Filtering & Selection Statuses
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [manualEmail, setManualEmail] = useState('');
  const [manualName, setManualName] = useState('');
  const [isAdminBypass, setIsAdminBypass] = useState(false); // Developer convenience bypass
  const [isPathAdmin, setIsPathAdmin] = useState(false);

  // Modal displays
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCmsModal, setShowCmsModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // 0. Detect Admin Sub-URL context
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin')) {
      setIsPathAdmin(true);
    } else {
      setIsPathAdmin(false);
    }
  }, []);

  // Trigger Language Toggle
  const handleLanguageToggle = () => {
    setSelectedLanguage((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  // 1. Initial Data Fetch
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        const prods = await loadProducts();
        setProducts(prods);

        // Fetch orders if we have logged in user or simulation is active
        if (currentUser) {
          const ords = await fetchOrders(currentUser.role === 'admin' ? undefined : currentUser.uid);
          setOrders(ords);
        } else {
          // Fetch public / general orders simulation
          const ords = await fetchOrders();
          setOrders(ords);
        }
      } catch (err) {
        console.error("Initiation data failed", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [currentUser]);

  // 2. Auth State Sync
  useEffect(() => {
    if (isFirebaseAvailable && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const name = user.displayName || user.email?.split('@')[0] || 'গ্রাহক';
          const email = user.email || 'customer@greenmango.com';
          const profile = await fetchProfile(user.uid, email, name);
          
          // Strict Email Allowed List override for Admin Control
          const AUTHORIZED_ADMIN_EMAILS = ['nazrul.islam.uli019@gmail.com', 'admin@greenmango.com'];
          const isAllowedAdmin = AUTHORIZED_ADMIN_EMAILS.includes(email.toLowerCase());
          
          if (isAllowedAdmin) {
            profile.role = 'admin';
            setCurrentUser(profile);
            setIsAdminBypass(true);
          } else {
            profile.role = 'customer';
            setCurrentUser(profile);
            setIsAdminBypass(false);
          }
        } else {
          setCurrentUser(null);
          setIsAdminBypass(false);
        }
      });
      return () => unsubscribe();
    }
  }, []);

  // 3. Simulated Authentication fallbacks
  const handleSimulatedLogin = async (role: 'customer' | 'admin') => {
    // Only permit simulated customer logins, simulated admin login is restricted if requested
    if (role === 'admin' && isPathAdmin) {
      alert("Simulation bypassed. Standard users must use Google Login on the /admin page to log in as authorized admins.");
      return;
    }

    const uid = role === 'admin' ? 'admin-bypass-101' : 'customer-bypass-202';
    const email = role === 'admin' ? 'nazrul.islam.uli019@gmail.com' : 'demo@greenmango.com';
    const name = role === 'admin' ? 'Dev Nazrul (Admin)' : 'শুভাকাঙ্ক্ষী গ্রাহক';
    
    const simulatedProfile: UserProfile = {
      uid,
      email,
      displayName: name,
      role: role === 'admin' ? 'admin' : 'customer',
      phone: '01793840762',
      address: 'উত্তরা সেক্টর ৪, ঢাকা'
    };

    setCurrentUser(simulatedProfile);
    if (simulatedProfile.role === 'admin') {
      setIsAdminBypass(true);
    }
    await saveProfile(simulatedProfile);
    setShowLoginModal(false);
  };

  const handleGoogleLogin = async () => {
    if (!isFirebaseAvailable) {
      alert("Firebase is currently offline. Please use the simulated fast login methods below.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setShowLoginModal(false);
    } catch (err) {
      console.error("Google Auth popup failed", err);
      alert("Auth failed or was cancelled. Logging in via demonstration profiles below.");
    }
  };

  const handleLogout = async () => {
    if (isFirebaseAvailable && auth) {
      try {
        await signOut(auth);
      } catch (err) {}
    }
    setCurrentUser(null);
    setIsAdminBypass(false);
    setShowCmsModal(false);
  };

  // 4. Cart Operations
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    
    // Quick notification alerts or standard visual confirmations
    setShowCartModal(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock || 50;
          return { ...item, quantity: Math.min(maxStock, quantity) };
        }
        return item;
      })
    );
  };

  // 5. Checkout trigger
  const handleCheckoutOrder = async (orderData: Partial<Order>): Promise<string> => {
    const fullOrder: Order = {
      id: orderData.id || `ORD-${Date.now()}`,
      userId: currentUser?.uid || 'guest-user',
      userName: orderData.userName || 'Guest Customer',
      userEmail: currentUser?.email || 'guest@greenmango.com',
      address: orderData.address || '',
      phone: orderData.phone || '',
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentNumber: orderData.paymentNumber,
      transactionId: orderData.transactionId,
      status: 'pending',
      createdAt: orderData.createdAt || Date.now()
    };

    // Save order in Firestore
    await createOrderInDb(fullOrder);

    // Refresh application catalog state and order cache
    const prods = await loadProducts();
    setProducts(prods);

    const ords = await fetchOrders(currentUser?.role === 'admin' ? undefined : currentUser?.uid);
    setOrders(ords);

    // Empty active shopping cart
    setCart([]);
    return fullOrder.id;
  };

  // 6. Admin Panel Operations
  const handleAdminUpdateProduct = async (product: Product) => {
    await updateProductInDb(product);
    const renewed = await loadProducts();
    setProducts(renewed);
  };

  const handleAdminAddProduct = async (product: Product) => {
    await updateProductInDb(product);
    const renewed = await loadProducts();
    setProducts(renewed);
  };

  const handleAdminDeleteProduct = async (id: string) => {
    await deleteProductFromDb(id);
    const renewed = await loadProducts();
    setProducts(renewed);
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (isFirebaseAvailable && db) {
      try {
        const docRef = doc(db, 'orders', orderId);
        await updateDoc(docRef, { status });
      } catch (e) {
        console.warn("Firestore status update failed, shifting locally", e);
      }
    }
    
    // Update local orders
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  // 7. Search & Categorization Engine (Memoized)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = activeCategory === 'all' || p.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.descriptionEn.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  if (isPathAdmin) {
    const isUserAdmin = currentUser && currentUser.role === 'admin';

    return (
      <div className="min-h-screen bg-stone-100 text-emerald-950 font-sans flex flex-col items-center justify-center p-4">
        {isUserAdmin ? (
          <div className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl overflow-hidden border border-emerald-100 animate-in zoom-in-95 duration-400">
            <AdminPanel
              language={selectedLanguage}
              products={products}
              orders={orders}
              onClose={() => { window.location.href = '/'; }}
              onUpdateProduct={handleAdminUpdateProduct}
              onAddProduct={handleAdminAddProduct}
              onDeleteProduct={handleAdminDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
            />
          </div>
        ) : (
          <div className="w-full max-w-md bg-white border border-emerald-100/80 rounded-3xl p-8 shadow-2xl relative">
            <div className="text-center font-sans space-y-4">
              <span className="text-5xl block select-none mb-2">🛡️</span>
              <h2 className="text-emerald-950 font-black text-xl">
                {selectedLanguage === 'bn' ? 'গ্রিন ম্যাঙ্গো অ্যাডমিন পোর্টাল' : 'Green Mango Admin Workspace'}
              </h2>
              <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-widest leading-none">
                MANUALLY PERMITTED ACCESS ONLY
              </p>
              
              {currentUser ? (
                <div className="bg-red-50 text-red-700 p-4 rounded-2xl text-xs space-y-3 border border-red-150">
                  <p className="font-extrabold leading-normal">
                    {selectedLanguage === 'bn' 
                      ? `দুঃখিত! আপনার লগইনকৃত ইমেইলটি (${currentUser.email}) অ্যাডমিন ড্যাশবোর্ডের জন্য অনুমোদিত নয়।` 
                      : `Access Denied! The logged-in email (${currentUser.email}) is not of an authorized administrator.`}
                  </p>
                  <p className="font-normal text-[11px]">
                    {selectedLanguage === 'bn' 
                      ? 'অনুগ্রহ করে অনুমোদিত অ্যাডমিন ইমেইল দিয়ে পুনরায় গুগল লগইন সম্পন্ন করুন।' 
                      : 'Please sign out and sign back in with an authorized corporate account.'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-650 hover:bg-red-755 text-white rounded-xl font-bold font-sans cursor-pointer transition-all"
                  >
                    {selectedLanguage === 'bn' ? 'সাইন আউট করুন' : 'Sign Out'}
                  </button>
                </div>
              ) : (
                <div className="pt-4 space-y-4">
                  <div className="bg-amber-50 text-amber-800 p-4 rounded-2xl text-left border border-amber-100 space-y-1 text-xs">
                    <span className="font-bold block">⚠️ এডমিন সতর্কতা:</span>
                    <span className="leading-relaxed block font-normal text-[11.5px]">
                      {selectedLanguage === 'bn' 
                        ? 'এটি গ্রিন ম্যাঙ্গো কর্মকর্তাদের জন্য সংরক্ষিত ডোমেন। এখানে ডেমো বাইপাস বা সিমুলেশন বাটন নেই। শুধুমাত্র ফায়ারবেইসে নিবন্ধিত বা ডেভলপার নজরুলের যোগকৃত অ্যাডমিন ইমেইল দিয়েই গুগল সাইন-ইন সম্ভব।' 
                        : 'This page is standard corporate access. Only authorized developer or corporate emails set in Firebase are permitted.'}
                    </span>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    className="w-full py-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-3 transition-transform active:scale-97 cursor-pointer shadow-xs"
                  >
                    <LogIn className="w-5 h-5 text-red-550" />
                    <span>Google দিয়ে ফায়ারবেস অথ লগইন</span>
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-slate-100 flex justify-between text-xs font-bold">
                <button
                  onClick={() => { setSelectedLanguage(selectedLanguage === 'bn' ? 'en' : 'bn'); }}
                  className="text-emerald-700 hover:text-emerald-950 cursor-pointer"
                >
                  {selectedLanguage === 'bn' ? 'English' : 'বাংলা'}
                </button>
                
                <a
                  href="/"
                  className="text-emerald-700 hover:text-emerald-955 flex items-center gap-1 transition-all"
                >
                  <span>{selectedLanguage === 'bn' ? '⬅️ মূল ওয়েবসাইটে ফিরুন' : '⬅️ Return to Storefront'}</span>
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-emerald-950 font-sans selection:bg-yellow-300 selection:text-emerald-950">
      
      {/* 1. Glass-morphic Sticky Global Header */}
      <Header
        language={selectedLanguage}
        onLanguageToggle={handleLanguageToggle}
        cartCount={cart.reduce((acc, c) => acc + c.quantity, 0)}
        onCartOpen={() => setShowCartModal(true)}
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
        isAdmin={isAdminBypass}
        onAdminToggle={() => setShowCmsModal(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Embedded Orchard Parallax Hero Banner */}
      <HeroParallax language={selectedLanguage} />

      {/* 3. Primary Storefront Marketplace Display */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 space-y-12" id="products-section">
        
        {/* Modular Category Selector Widget */}
        <CategoryFilter
          language={selectedLanguage}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          productCount={filteredProducts.length}
        />

        {/* Dynamic products catalog card framework with state indicator */}
        {loading ? (
          <div className="w-full text-center py-20" id="loading-spinner">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto pb-1" />
            <p className="text-xs font-semibold text-emerald-800 font-sans mt-3">
              {selectedLanguage === 'bn' ? 'বাগান থেকে সতেজ ডাটা লোড হচ্ছে...' : 'Plucking organic metadata from server...'}
            </p>
          </div>
        ) : (
          <ProductGrid
            language={selectedLanguage}
            products={filteredProducts}
            onAddToCart={handleAddToCart}
            onSelectProduct={setSelectedProduct}
          />
        )}

      </main>

      {/* 4. Layered Orchard-to-Table Interactive Process Timeline */}
      <ProcessTimeline language={selectedLanguage} />

      {/* 5. Custom CTA Banner representing WhatsApp Inquiries */}
      <section className="bg-yellow-400 py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-3xl bg-emerald-950 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
          {/* Neon plant graphics */}
          <div className="absolute right-0 bottom-0 opacity-10 font-black text-9xl pointer-events-none select-none">🥭</div>
          
          <div className="space-y-3.5">
            <span className="bg-emerald-800 text-yellow-300 font-sans text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {selectedLanguage === 'bn' ? 'যেকোনো প্রশ্নে আমরা প্রস্তুত' : 'Customer Care Panel'}
            </span>
            <h3 className="text-2xl md:text-3.5xl font-black font-sans leading-tight">
              {selectedLanguage === 'bn' ? 'পাইকারি আম বা বিশেষ অর্ডারের জন্য যোগাযোগ করুন' : 'Wholesale mango bulks & customized deliveries'}
            </h3>
            <p className="text-xs text-emerald-100 max-w-lg font-normal leading-relaxed">
              {selectedLanguage === 'bn' 
                ? 'বড় পরিবারিক অনুষ্ঠান, কর্পোরেট গিফট বক্স বা বাগান কেনার জন্য ডেভ নজরুলের সাথে হোয়াটসঅ্যাপে বিশদ আলোচনা করতে পারেন।' 
                : 'Formulate bespoke corporate hampers, order bulk truck shipments, or directly purchase orchard yield rights with Dev Nazrul.'}
            </p>
          </div>

          <a
            href={`https://wa.me/8801793840762?text=আসসালামু আলাইকুম! আমি Green Mango ওয়েবসাইট থেকে পাইকারি আম ও ডেলিভারি ব্যাপারে আলাপ করতে চাই।`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-yellow-400 text-emerald-950 hover:bg-yellow-300 font-sans font-black text-xs md:text-sm px-8 py-4.5 flex items-center gap-3 transition-all active:scale-95 shadow-lg shrink-0 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5 fill-emerald-950 text-emerald-955" />
            <span>হোয়াটসঅ্যাপ মেসেজ করুন (01793840762)</span>
          </a>
        </div>
      </section>

      {/* 6. Professional localized Bio Footing representing Dev Nazrul */}
      <Footer language={selectedLanguage} />

      {/* ============================================================== */}
      {/* ======================= MODAL PORTALS ========================== */}
      {/* ============================================================== */}

      {/* 1. CUSTOM DETAILED MANGO MODAL POPUP */}
      {selectedProduct && (
        <ProductDetailModal
          language={selectedLanguage}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* 2. SECURE CART & CHECKOUT DRAWER */}
      {showCartModal && (
        <OrderModal
          language={selectedLanguage}
          cartItems={cart}
          onClose={() => setShowCartModal(false)}
          onRemoveItem={handleRemoveFromCart}
          onUpdateQty={handleUpdateCartQty}
          currentUser={currentUser}
          onPlaceOrder={handleCheckoutOrder}
        />
      )}

      {/* 3. GREEN MANGO ADMIN CONSOLE CMS PANEL */}
      {showCmsModal && (
        <AdminPanel
          language={selectedLanguage}
          products={products}
          orders={orders}
          onClose={() => setShowCmsModal(false)}
          onUpdateProduct={handleAdminUpdateProduct}
          onAddProduct={handleAdminAddProduct}
          onDeleteProduct={handleAdminDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      )}

      {/* 4. CENTRAL CUSTOM LOGIN PORTAL MODAL */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/65 backdrop-blur-md animate-in fade-in duration-300">
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-emerald-100 max-w-sm w-full relative shadow-2xl animate-in zoom-in-95 duration-400">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center font-sans">
              <span className="text-4xl block select-none mb-3">🛡️</span>
              <h4 className="text-emerald-950 font-black text-lg">
                {selectedLanguage === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to Green Mango'}
              </h4>
              <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider mt-1">
                SECURE AUTHENTICATION DOOR
              </p>

              {/* Direct Authentication CTA Buttons */}
              <div className="mt-8 space-y-3.5">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs flex items-center justify-center gap-2.5 transition active:scale-97 cursor-pointer"
                >
                  <LogIn className="w-4.5 h-4.5 text-red-550" />
                  <span>Google দিয়ে সরাসরি সাইন-ইন</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase">অথবা ডেমো অ্যাকাউন্ট</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                <button
                  onClick={() => handleSimulatedLogin('customer')}
                  className="w-full py-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-emerald-800 border border-slate-150 font-bold text-xs flex items-center justify-center gap-2.5 transition active:scale-97 cursor-pointer"
                >
                  <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                  <span>গ্রাহক (Customer) ডেমো মোড</span>
                </button>

                <button
                  onClick={() => handleSimulatedLogin('admin')}
                  className="w-full py-3.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-250 font-black text-xs flex items-center justify-center gap-2.5 transition active:scale-97 cursor-pointer"
                >
                  <ShieldCheck className="w-4.5 h-4.5 text-amber-700" />
                  <span>অ্যাডমিন (Dev Nazrul) ডেমো মোড</span>
                </button>
              </div>

              {/* Secure terms tagline */}
              <p className="text-[10px] text-slate-400 leading-normal mt-6 font-normal">
                {selectedLanguage === 'bn' 
                  ? 'নিরাপত্তা নিশ্চিত করতে গুগল অথ ব্যবহার করা হয়েছে। কোনো পাসওয়ার্ড সেভ করা হবে না।' 
                  : 'We prioritize consumer safety. Secure Google OAuth is standard; zero credentials stored.'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
