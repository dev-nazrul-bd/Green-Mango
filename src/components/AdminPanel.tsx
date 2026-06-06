import React, { useState } from 'react';
import { 
  X, Plus, RefreshCw, BarChart2, Package, ShoppingBag, 
  UserCheck, ShieldCheck, CheckCircle2, TrendingUp, Edit3, Trash2 
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminPanelProps {
  language: 'bn' | 'en';
  products: Product[];
  orders: Order[];
  onClose: () => void;
  onUpdateProduct: (p: Product) => Promise<void>;
  onAddProduct: (p: Product) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
}

export default function AdminPanel({
  language,
  products,
  orders,
  onClose,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states for adding/editing product
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newNameEn, setNewNameEn] = useState('');
  const [newCat, setNewCat] = useState<'fresh-mango' | 'juice' | 'mango-bar' | 'pickle'>('fresh-mango');
  const [newDesc, setNewDesc] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newPrice, setNewPrice] = useState(100);
  const [newDiscountPrice, setNewDiscountPrice] = useState<number | ''>('');
  const [newUnit, setNewUnit] = useState('১ কেজি');
  const [newStock, setNewStock] = useState(50);
  const [newImage, setNewImage] = useState('');
  const [newRating, setNewRating] = useState(4.8);

  const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
  const lowStockProds = products.filter(p => p.stock <= 10).length;

  const t = {
    bn: {
      title: 'Green Mango টিম ড্যাশবোর্ড 🛡️',
      tabStats: 'পরিসংখ্যান 📊',
      tabProducts: 'পণ্য তালিকা 📦',
      tabOrders: 'আগত অর্ডার সমূহ 🛒',
      revenue: 'সর্বমোট বিক্রি',
      activeOrders: 'মোট অর্ডার',
      lowStock: 'কম মজুদ পণ্য',
      totalItems: 'মোট আইটেম',
      pName: 'পণ্যের নাম',
      pPrice: 'মূল্য (টাকা)',
      pStock: 'মজুদ',
      pCategory: 'ক্যাটাগরি',
      pUnit: 'ওজন/মাপ',
      actions: 'অ্যাকশন',
      edit: 'সম্পাদনা',
      addBtn: 'নতুন পণ্য যোগ করুন ➕',
      orderId: 'অর্ডার নম্বর',
      customer: 'কাস্টমার',
      payment: 'পেমেন্ট মেথড',
      pAmount: 'মোট টাকা',
      status: 'অবস্থা',
      save: 'সংরক্ষণ',
      cancel: 'বাতিল',
      successSave: 'সাফল্যের সাথে সংরক্ষিত হয়েছে!',
      newProdTitle: 'নতুন অরগানিক পণ্য যোগ',
      address: 'ঠিকানা',
      phone: 'ফোন নম্বর',
      items: 'অর্ডারকৃত পণ্য',
    },
    en: {
      title: 'Green Mango Team Console 🛡️',
      tabStats: 'Analytics 📊',
      tabProducts: 'Product Catalog 📦',
      tabOrders: 'Incoming Orders 🛒',
      revenue: 'Gross Revenue',
      activeOrders: 'Total Orders',
      lowStock: 'Low Stock Assets',
      totalItems: 'Active SKUs',
      pName: 'Product Name',
      pPrice: 'Price',
      pStock: 'Stock',
      pCategory: 'Category',
      pUnit: 'Unit Scale',
      actions: 'Action',
      edit: 'Edit Product',
      addBtn: 'Insert New Product ➕',
      orderId: 'Order ID',
      customer: 'Client',
      payment: 'Payment Mode',
      pAmount: 'Amount Payable',
      status: 'Status',
      save: 'Save Changes',
      cancel: 'Cancel',
      successSave: 'Saved successfully!',
      newProdTitle: 'Add New Organic SKU',
      address: 'Shipping Address',
      phone: 'Phone Number',
      items: 'Ordered Items',
    }
  }[language];

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setNewId(p.id);
    setNewName(p.name);
    setNewNameEn(p.nameEn);
    setNewCat(p.category);
    setNewDesc(p.description);
    setNewDescEn(p.descriptionEn);
    setNewPrice(p.price);
    setNewDiscountPrice(p.discountPrice !== undefined ? p.discountPrice : '');
    setNewUnit(p.unit);
    setNewStock(p.stock);
    setNewImage(p.image);
    setNewRating(p.rating);
    setShowAddForm(false);
  };

  const handleAddClick = () => {
    setEditingProduct(null);
    setNewId('mango-' + Math.floor(Math.random() * 900 + 100));
    setNewName('');
    setNewNameEn('');
    setNewCat('fresh-mango');
    setNewDesc('');
    setNewDescEn('');
    setNewPrice(100);
    setNewDiscountPrice('');
    setNewUnit('১ কেজি');
    setNewStock(50);
    setNewImage('https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800');
    setNewRating(4.8);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Product = {
      id: newId,
      name: newName,
      nameEn: newNameEn,
      category: newCat,
      description: newDesc,
      descriptionEn: newDescEn,
      price: Number(newPrice),
      discountPrice: newDiscountPrice === '' ? undefined : Number(newDiscountPrice),
      unit: newUnit,
      stock: Number(newStock),
      image: newImage,
      rating: newRating
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(payload);
        setEditingProduct(null);
      } else {
        await onAddProduct(payload);
        setShowAddForm(false);
      }
      alert(t.successSave);
    } catch (err) {
      alert('Error updating catalog database');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/70 backdrop-blur-md animate-in fade-in duration-300">
      
      <div 
        className="w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-emerald-50 max-h-[90vh]"
        id="cms-panel-container"
      >
        
        {/* Title bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-100 bg-emerald-900 text-white">
          <div className="flex items-center gap-3">
            <span className="text-2xl select-none leading-none">⚙️</span>
            <div>
              <h3 className="font-sans text-lg font-black">{t.title}</h3>
              <p className="text-[10px] text-emerald-300 font-bold tracking-wider">CMS / INVENTORY CONTROL</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 bg-emerald-850 hover:bg-red-600 hover:text-white text-emerald-100 transition-colors cursor-pointer"
            id="close-admin-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch tags */}
        <div className="flex border-b border-emerald-100 bg-emerald-50/30 px-6 pt-2">
          {[
            { id: 'stats', label: t.tabStats },
            { id: 'products', label: t.tabProducts },
            { id: 'orders', label: t.tabOrders },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setEditingProduct(null);
                setShowAddForm(false);
              }}
              className={`px-5 py-3.5 text-xs font-extrabold font-sans leading-none tracking-wide translate-y-[1px] transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'border-b-2 border-emerald-600 text-emerald-800 bg-white font-black' 
                  : 'text-emerald-700/60 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Inner body */}
        <div className="flex-1 p-6 overflow-y-auto font-sans bg-slate-50/50">
          
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Cards grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t.revenue, value: `${totalSales}৳`, icon: TrendingUp, col: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
                  { label: t.activeOrders, value: orders.length, icon: ShoppingBag, col: 'text-blue-700 bg-blue-50 border-blue-100' },
                  { label: t.lowStock, value: lowStockProds, icon: Package, col: 'text-red-700 bg-red-50 border-red-100' },
                  { label: t.totalItems, value: products.length, icon: BarChart2, col: 'text-amber-700 bg-amber-50 border-amber-100' }
                ].map((st, i) => (
                  <div key={i} className={`rounded-2xl border-2 p-5 flex items-center justify-between shadow-xs ${st.col}`}>
                    <div>
                      <span className="text-[11px] uppercase font-bold text-slate-500 tracking-wide block">{st.label}</span>
                      <span className="text-2xl font-black font-mono leading-none mt-2 block">{st.value}</span>
                    </div>
                    <st.icon className="w-8 h-8 opacity-75" />
                  </div>
                ))}
              </div>

              {/* Developer branding dashboard credit */}
              <div className="rounded-2xl bg-white border border-emerald-105 p-6 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-emerald-950 flex items-center gap-2">
                    <UserCheck className="w-4.5 h-4.5 text-emerald-600" />
                    <span>মার্কেটপ্লেস ডেভেলাপার বিবরণ</span>
                  </h4>
                  <p className="text-xs text-slate-600/90 leading-relaxed font-normal max-w-xl">
                    প্রিমিয়াম Green Mango ই-কমার্স প্ল্যাটফর্মটি ডেভেলপ করেছেন <span className="font-extrabold text-emerald-800">Dev Nazrul</span>। উনার সচল মোবাইল নম্বর <span className="font-bold underline text-emerald-800">01793840762</span>। যেকোনো ধরণের মডিফিকেশন বা পেমেন্ট গেটওয়ে সেটিংসে ওনাকে রিচ করতে পারেন।
                  </p>
                </div>
                <div className="flex gap-3">
                  <a
                    href="https://www.facebook.com/4nazrul.islam"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-850 border border-emerald-200 transition-colors"
                  >
                    Facebook 🌐
                  </a>
                  <a
                    href="https://www.linkedin.com/in/md-nazrul-islam-482722411"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg bg-emerald-50 hover:bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-850 border border-emerald-200 transition-colors"
                  >
                    LinkedIn 👔
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              
              {/* Product insert trigger */}
              {!editingProduct && !showAddForm && (
                <div className="flex justify-between items-center sm:grid-cols-2">
                  <span className="text-xs font-bold text-emerald-850 font-sans">
                    {language === 'bn' ? `বর্তমানে স্টোরে ${products.length}টি সক্রিয় আইটেম রয়েছে।` : `Total Active items: ${products.length}`}
                  </span>
                  <button
                    onClick={handleAddClick}
                    className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-xs font-bold py-2.5 px-4 cursor-pointer"
                  >
                    {t.addBtn}
                  </button>
                </div>
              )}

              {/* Show editor form */}
              {(editingProduct || showAddForm) ? (
                <form onSubmit={handleFormSubmit} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-black text-emerald-950 uppercase pb-2 border-b border-emerald-50 flex items-center gap-1.5">
                    <Edit3 className="w-4 h-4 text-emerald-600" />
                    <span>{editingProduct ? t.edit : t.newProdTitle}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Product ID (পণ্য আইডি) *</label>
                      <input
                        type="text"
                        required
                        disabled={!!editingProduct}
                        value={newId}
                        onChange={(e) => setNewId(e.target.value)}
                        className="w-full bg-slate-50 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Name (বাংলা নাম) *</label>
                      <input
                        type="text"
                        required
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Name (English Name) *</label>
                      <input
                        type="text"
                        required
                        value={newNameEn}
                        onChange={(e) => setNewNameEn(e.target.value)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Category (ক্যাটাগরি) *</label>
                      <select
                        value={newCat}
                        onChange={(e) => setNewCat(e.target.value as any)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      >
                        <option value="fresh-mango">Fresh Mango (তাজা আম)</option>
                        <option value="juice">Mango Juice (আমের জুস)</option>
                        <option value="mango-bar">Mango Bar (আমসত্ত্ব)</option>
                        <option value="pickle">Pickle (আমের আচার)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Price / মূল্য (টাকা) *</label>
                      <input
                        type="number"
                        required
                        value={newPrice}
                        onChange={(e) => setNewPrice(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Discount Price (ডিসকাউন্ট মূল্য) [ঐচ্ছিক]</label>
                      <input
                        type="number"
                        placeholder="যেমন: ৩৫০"
                        value={newDiscountPrice}
                        onChange={(e) => setNewDiscountPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Unit Weight (মাপ বা ওজন) *</label>
                      <input
                        type="text"
                        required
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Stock / মজুদ পরিমাণ *</label>
                      <input
                        type="number"
                        required
                        value={newStock}
                        onChange={(e) => setNewStock(Number(e.target.value))}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Photo attachment zone (Requirement 2) */}
                  <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-4.5 space-y-3">
                    <span className="block text-[11px] font-bold text-emerald-950">
                      {language === 'bn' ? '📸 পণ্যের ছবি সংযুক্তকরণ (ফাইল আপলোড)' : '📸 Product Image Attachment (Direct Upload)'}
                    </span>
                    <div className="flex flex-col sm:flex-row items-center gap-4.5">
                      {newImage ? (
                        <div className="relative h-24 w-24 rounded-xl border border-emerald-250 overflow-hidden bg-white shrink-0">
                          <img
                            src={newImage}
                            alt="Preview file"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setNewImage('')}
                            className="absolute top-1 right-1 bg-red-650 hover:bg-red-750 text-white rounded-full p-1 cursor-pointer transition-colors shadow-sm"
                            title="Remove"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-24 w-24 rounded-xl border border-dashed border-emerald-250 bg-emerald-50/20 flex flex-col items-center justify-center text-xs text-emerald-700/60 font-bold font-sans shrink-0">
                          <span>{language === 'bn' ? 'ছবি নেই' : 'No photo'}</span>
                        </div>
                      )}

                      <label className="flex-1 w-full border-2 border-dashed border-emerald-150 hover:border-emerald-300 hover:bg-emerald-50/10 rounded-xl p-4 text-center cursor-pointer transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const r = new FileReader();
                              r.onloadend = () => {
                                setNewImage(r.result as string);
                              };
                              r.readAsDataURL(file);
                            }
                          }}
                        />
                        <span className="text-xl block mb-0.5 select-none">📁</span>
                        <span className="text-[11px] font-bold text-emerald-800 block">
                          {language === 'bn' ? 'ফাইল সিলেক্ট করতে এখানে ক্লিক করুন' : 'Click to select / upload image file'}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {language === 'bn' ? 'জেপেগ, পিএনজি ফরম্যাট ফাইল সরাসরি যুক্ত হবে' : 'JPG, PNG file formats supported'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Description (বাংলা বিবরণ) *</label>
                      <textarea
                        required
                        rows={2}
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">DescriptionEn (English Description) *</label>
                      <textarea
                        required
                        rows={2}
                        value={newDescEn}
                        onChange={(e) => setNewDescEn(e.target.value)}
                        className="w-full bg-white rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-hidden resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions buttons & Anti-overlapping keyboard Padding */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 pb-24 md:pb-0">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setShowAddForm(false);
                      }}
                      className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-xs cursor-pointer"
                    >
                      {t.save}
                    </button>
                  </div>
                </form>
              ) : (
                /* Catalog table representation */
                <div className="overflow-x-auto rounded-2xl border border-emerald-100 bg-white">
                  <table className="min-w-full divide-y divide-emerald-50 text-xs font-sans text-emerald-950">
                    <thead className="bg-emerald-50/40 text-[10px] uppercase font-bold text-emerald-800">
                      <tr>
                        <th className="px-6 py-4 text-left">পণ্য</th>
                        <th className="px-6 py-4 text-left">{t.pCategory}</th>
                        <th className="px-6 py-4 text-center">{t.pPrice}</th>
                        <th className="px-6 py-4 text-center">{t.pStock}</th>
                        <th className="px-6 py-4 text-center">{t.pUnit}</th>
                        <th className="px-6 py-4 text-center">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-50 font-medium">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 rounded-lg object-cover"
                            />
                            <div>
                              <span className="font-extrabold text-slate-900 block">{language === 'bn' ? p.name : p.nameEn}</span>
                              <span className="text-[10px] text-slate-400 font-mono block uppercase">{p.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 uppercase font-bold text-emerald-800">
                            {p.category}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-slate-900 font-mono">
                            {p.price}৳
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                              p.stock <= 10 ? 'bg-red-50 text-red-650' : 'bg-emerald-50 text-emerald-850'
                            }`}>
                              {p.stock}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.unit}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleEditClick(p)}
                                className="rounded-lg border border-emerald-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-600 font-bold px-2 py-1.5 cursor-pointer flex items-center gap-1"
                                title={language === 'bn' ? 'সম্পাদনা করুন' : 'Edit SKU'}
                              >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-700" />
                                <span>{language === 'bn' ? 'সম্পাদনা' : 'Edit'}</span>
                              </button>
                              <button
                                onClick={async () => {
                                  if (confirm(language === 'bn' ? `আপনি কি নিশ্চিতভাবে "${p.name}" মুছতে চান?` : `Are you sure you want to delete "${p.nameEn}"?`)) {
                                    await onDeleteProduct(p.id);
                                  }
                                }}
                                className="rounded-lg border border-red-50 hover:bg-red-50 text-red-500 font-bold px-2 py-1.5 cursor-pointer flex items-center gap-1"
                                title={language === 'bn' ? 'মুছে ফেলুন' : 'Delete SKU'}
                              >
                                <Trash2 className="w-3.5 h-3.5 text-red-650" />
                                <span>{language === 'bn' ? 'মুছুন' : 'Delete'}</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {orders.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-100 rounded-3xl">
                  <span className="text-4xl mb-3 block select-none">📭</span>
                  <p className="text-xs font-bold text-slate-500">এখনো কোনো অর্ডার সাবমিট হয়নি!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-4">
                      
                      {/* Top metadata row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-black text-slate-900 font-mono">{o.id}</span>
                          <span className="text-[10px] text-slate-400 font-bold">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-bold text-slate-600">{t.status}:</span>
                          <select
                            value={o.status}
                            onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                            className={`rounded-lg font-bold border px-2.5 py-1 text-[11px] cursor-pointer focus:outline-hidden ${
                              o.status === 'pending' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                              o.status === 'processing' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                              o.status === 'shipped' ? 'bg-indigo-50 text-indigo-800 border-indigo-200' :
                              'bg-emerald-50 text-emerald-800 border-emerald-200'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* Buyer detail description */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.customer}</p>
                          <p className="font-bold text-slate-900">{o.userName}</p>
                          <p className="text-[10px] text-slate-500">{o.userEmail}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.phone} & {t.address}</p>
                          <p className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>📞</span> 
                            <span className="underline">{o.phone}</span>
                          </p>
                          <p className="text-[10px] text-slate-650 flex items-center gap-1 mt-0.5">
                            <span>📍</span>
                            <span>{o.address}</span>
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{t.payment}</p>
                          <p className="font-extrabold text-emerald-800 flex items-center gap-1">
                            <span>💳</span>
                            <span>{o.paymentMethod.toUpperCase()}</span>
                          </p>
                          {o.paymentNumber && (
                            <p className="text-[10px] text-slate-550 font-semibold mt-0.5">
                              Paying Phone: <span className="font-bold font-mono">{o.paymentNumber}</span>
                            </p>
                          )}
                          {o.transactionId && (
                            <p className="text-[10px] text-slate-550 font-semibold">
                              TrxID: <span className="font-bold font-mono text-emerald-700">{o.transactionId}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Items list matrix */}
                      <div className="border-t border-dashed border-emerald-100 pt-3 text-xs">
                        <p className="text-[10px] uppercase font-bold text-slate-450 mb-2">{t.items}</p>
                        <div className="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between font-medium">
                              <span className="text-slate-800">{item.name} <span className="font-bold text-slate-500">x{item.quantity}</span></span>
                              <span className="font-bold text-slate-900 font-mono">{item.price * item.quantity}৳</span>
                            </div>
                          ))}
                          <div className="h-px bg-slate-200 my-1.5"></div>
                          <div className="flex justify-between font-black text-slate-900 text-sm">
                            <span>TOTAL AMOUNT PAYABLE</span>
                            <span className="text-emerald-800 font-mono">{o.totalAmount}৳</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
