import React from 'react';
import { Star, ShoppingCart, Info, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface GridProps {
  language: 'bn' | 'en';
  products: Product[];
  onAddToCart: (prod: Product) => void;
  onSelectProduct: (prod: Product) => void;
}

export default function ProductGrid({
  language,
  products,
  onAddToCart,
  onSelectProduct,
}: GridProps) {
  
  const t = {
    bn: {
      addToCart: 'ঝুড়িতে যোগ করুন 🛒',
      outOfStock: 'স্টক শেষ ⛔',
      available: 'স্টকে আছে: ',
      kg: 'কেজি',
      tk: '৳',
      popular: 'সেরা অফার',
    },
    en: {
      addToCart: 'Add to Cart 🛒',
      outOfStock: 'Out of Stock ⛔',
      available: 'In Stock: ',
      kg: 'kg',
      tk: '৳',
      popular: 'Bestseller',
    },
  }[language];

  if (products.length === 0) {
    return (
      <div className="w-full text-center py-20 bg-emerald-50/20 rounded-3xl border border-dashed border-emerald-100" id="empty-product-state">
        <span className="text-5xl mb-4 select-none block">🔍</span>
        <h4 className="text-emerald-950 font-bold text-lg font-sans">
          {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি!' : 'No products matched!'}
        </h4>
        <p className="text-emerald-600/80 text-xs mt-1 font-sans">
          {language === 'bn' ? 'অনুগ্রহ করে ভিন্ন কিছু সার্চ করার চেষ্টা করুন।' : 'Please check your spelling or search another keyword.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="product-grid">
      {products.map((p) => {
        const isOutOfStock = p.stock <= 0;
        
        return (
          <div
            key={p.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-emerald-100/40 bg-white p-4 shadow-xs transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 focus-within:ring-2 focus-within:ring-emerald-200"
            id={`product-card-${p.id}`}
          >
            {/* Pop badge */}
            {p.isPopular && (
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1 rounded-full bg-linear-to-r from-amber-500 to-yellow-400 px-3 py-1 text-[9px] font-bold text-white shadow-md shadow-amber-300/30">
                <TrendingUp className="h-3 w-3 animate-bounce" />
                <span className="uppercase tracking-wider font-sans">{t.popular}</span>
              </div>
            )}

            {/* Save Percentage Badge */}
            {p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price && (
              <div className="absolute top-6 right-6 z-10 rounded-lg bg-red-600 px-2.5 py-1 text-[10px] font-extrabold text-white shadow-xs">
                {language === 'bn' 
                  ? `${Math.round(((p.price - p.discountPrice) / p.price) * 105) / 105}% ছাড়! 🎉` 
                  : `${Math.round(((p.price - p.discountPrice) / p.price) * 100)}% OFF! 🎉`}
              </div>
            )}

            {/* FLOATING IMAGE WRAPPER (Requirement 2) */}
            <div 
              className="relative w-full h-64 rounded-2xl overflow-hidden bg-emerald-50 cursor-pointer select-none"
              onClick={() => onSelectProduct(p)}
            >
              <img
                src={p.image}
                alt={p.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108 group-hover:rotate-1"
                id={`product-image-${p.id}`}
              />
              {/* Floating shadow overlay inside image block */}
              <div className="absolute inset-0 bg-linear-to-t from-emerald-950/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Body */}
            <div className="mt-4 flex-1 flex flex-col justify-between">
              
              <div>
                {/* Score & Weight */}
                <div className="flex items-center justify-between">
                  <span className="font-sans text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50">
                    {p.unit}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 stroke-yellow-400" />
                    <span className="text-xs font-bold text-emerald-950 font-sans">{p.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Localized Title */}
                <h4 className="mt-2.5 text-base font-extrabold font-sans text-emerald-950 leading-snug group-hover:text-emerald-700 transition-colors">
                  {language === 'bn' ? p.name : p.nameEn}
                </h4>

                {/* Sub Description snippet */}
                <p className="mt-1.5 text-xs font-sans text-emerald-700/70 line-clamp-2 leading-relaxed">
                  {language === 'bn' ? p.description : p.descriptionEn}
                </p>

                {/* Dynamic stock stats */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold font-mono">
                    {isOutOfStock ? (
                      <span className="text-red-500">{t.outOfStock}</span>
                    ) : (
                      <span className="text-emerald-600/90">{t.available} <span className="font-extrabold text-xs">{p.stock}</span></span>
                    )}
                  </span>
                </div>
              </div>

              {/* Price & Action button */}
              <div className="mt-4 pt-3 border-t border-emerald-50/50 flex items-center justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-emerald-800/80 tracking-widest font-sans leading-none">Price / মূল্য</span>
                  {p.discountPrice && p.discountPrice > 0 && p.discountPrice < p.price ? (
                    <div className="flex flex-col">
                      <span className="line-through text-xs text-stone-400 font-mono -mb-0.5">{p.price}৳</span>
                      <span className="font-sans text-xl font-black text-emerald-950 flex items-baseline">
                        <span className="text-xs text-emerald-700 mr-0.5">{t.tk}</span>
                        {p.discountPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="font-sans text-xl font-black text-emerald-950 flex items-baseline">
                      <span className="text-xs text-emerald-700 mr-0.5">{t.tk}</span>
                      {p.price}
                    </span>
                  )}
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => onSelectProduct(p)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-800 transition-colors cursor-pointer"
                    title="পণ্য বিবরণ / Details"
                    id={`details-btn-${p.id}`}
                  >
                    <Info className="h-4.5 w-4.5" />
                  </button>

                  <button
                    onClick={() => !isOutOfStock && onAddToCart(p)}
                    disabled={isOutOfStock}
                    className={`rounded-xl px-4 py-2 text-xs font-extrabold font-sans flex items-center gap-2 transition-all cursor-pointer ${
                      isOutOfStock
                        ? 'bg-red-50 text-red-500 cursor-not-allowed border border-red-100'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-400/10 hover:shadow-md active:scale-95'
                    }`}
                    id={`add-cart-btn-${p.id}`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{isOutOfStock ? t.outOfStock.split(' ')[0] : (language === 'bn' ? 'কিনুন' : 'Add')}</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        );
      })}
    </div>
  );
}
