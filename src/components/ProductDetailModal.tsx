import React, { useState } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Heart, Sparkles, MessageCircle } from 'lucide-react';
import { Product } from '../types';

interface DetailProps {
  language: 'bn' | 'en';
  product: Product | null;
  onClose: () => void;
  onAddToCart: (prod: Product, qty: number) => void;
}

export default function ProductDetailModal({
  language,
  product,
  onClose,
  onAddToCart,
}: DetailProps) {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const t = {
    bn: {
      organicClm: '১০০% অরগানিক সার্টিফিকেটপ্রাপ্ত',
      descTitle: 'পণ্যের বিবরণ ও পুষ্টিগুণ',
      specifications: 'নিশ্চয়তা ও মাত্রা',
      unit: 'পরিমান বা ওজন',
      stock: 'মজুদ অবস্থা',
      inStock: 'স্টকে আছে',
      soldOut: 'স্টক শেষ',
      addToCart: 'কার্টে যোগ করুন 🛒',
      totalPrice: 'সর্বমোট মূল্য',
      tk: '৳',
      whatsappAsk: 'আম সম্পর্কে যেকোনো প্রয়োজনে আলাপ করুন',
    },
    en: {
      organicClm: '100% Certified Chemical-Free',
      descTitle: 'Product Description & Nutrition',
      specifications: 'Certifications & Details',
      unit: 'Size or Weight',
      stock: 'Stock Status',
      inStock: 'Available',
      soldOut: 'Out of Stock',
      addToCart: 'Add to Cart 🛒',
      totalPrice: 'Total Price',
      tk: '৳',
      whatsappAsk: 'Inquire via WhatsApp directly',
    }
  }[language];

  const handleAddToCart = () => {
    onAddToCart(product, qty);
    setQty(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-md animate-in fade-in duration-300">
      
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-emerald-100 max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible animate-in zoom-in-95 duration-400"
        id="detail-modal"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 hover:bg-red-50 text-emerald-950 hover:text-red-500 shadow-md transition-all cursor-pointer"
          id="close-detail-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Column 1: Magnificent Mango Image */}
        <div className="w-full md:w-1/2 relative bg-emerald-50 min-h-[300px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/60 via-transparent to-transparent"></div>
          
          {/* Certificate Stamp */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-emerald-600/90 text-white font-sans text-xs font-semibold px-4 py-2 backdrop-blur-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>{t.organicClm}</span>
          </div>
        </div>

        {/* Column 2: Rich Specifics Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between max-h-[60vh] md:max-h-[80vh] overflow-y-auto">
          <div>
            
            {/* Category tag */}
            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 font-sans">
              {product.category === 'fresh-mango' ? (language === 'bn' ? 'তাজা আম' : 'Fresh Harvesting') : 
               product.category === 'juice' ? (language === 'bn' ? 'খাঁটি জুস' : 'Fresh Juice') : 
               product.category === 'mango-bar' ? (language === 'bn' ? 'আমসত্ত্ব' : 'Mango Bar') : 
               (language === 'bn' ? 'আমের আচার' : 'Spicy Pickle')}
            </span>

            {/* Title */}
            <h3 className="text-2xl font-sans font-black text-emerald-950 mt-1 leading-tight">
              {language === 'bn' ? product.name : product.nameEn}
            </h3>

            {/* Rating Stars & Unit */}
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`h-4 w-4 ${
                      s <= Math.floor(product.rating) 
                        ? 'fill-yellow-400 stroke-yellow-400' 
                        : 'stroke-stone-300'
                    }`} 
                  />
                ))}
                <span className="text-xs font-bold text-emerald-950 ml-1.5 font-sans leading-none">{product.rating.toFixed(1)}</span>
              </div>

              <span className="h-4 w-px bg-emerald-100"></span>

              <span className="text-xs font-bold text-emerald-700 font-sans">
                {t.unit}: <span className="font-extrabold text-emerald-950">{product.unit}</span>
              </span>
            </div>

            {/* Price section */}
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-xs font-bold text-emerald-800 font-sans leading-none">Price / মূল্য:</span>
              {product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price ? (
                <div className="flex items-baseline gap-2">
                  <span className="line-through text-base text-stone-400 font-mono">{product.price}৳</span>
                  <span className="text-3xl font-black text-emerald-950 font-sans flex items-baseline leading-none">
                    <span className="text-base text-emerald-700 mr-0.5">{t.tk}</span>
                    {product.discountPrice}
                  </span>
                </div>
              ) : (
                <span className="text-3xl font-black text-emerald-950 font-sans flex items-baseline leading-none">
                  <span className="text-base text-emerald-700 mr-0.5">{t.tk}</span>
                  {product.price}
                </span>
              )}
            </div>

            {/* Description Paragraph */}
            <div className="mt-6 border-t border-emerald-50 pt-5">
              <h4 className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider font-sans mb-2">
                {t.descTitle}
              </h4>
              <p className="text-xs sm:text-sm font-sans text-emerald-950/80 leading-relaxed font-normal">
                {language === 'bn' ? product.description : product.descriptionEn}
              </p>
            </div>

            {/* Nutrition & Trust factors */}
            <div className="mt-6 border-t border-emerald-50 pt-5 space-y-2">
              <h4 className="text-xs uppercase font-extrabold text-emerald-800 tracking-wider font-sans">
                {t.specifications}
              </h4>
              <div className="grid grid-cols-2 gap-2 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-sans">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span>{language === 'bn' ? 'আঁশমুক্ত নরম আঁটি' : 'Fiber-free soft seed'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-sans">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span>{language === 'bn' ? 'ভিটামিন এ এবং সি ভরপুর' : 'Rich in Vitamin A & C'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-sans">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span>{language === 'bn' ? 'সরাসরি বাগান থেকে চয়িত' : 'Sourced from Orchards'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-950 font-sans">
                  <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                  <span>{language === 'bn' ? 'নিরাপদ ফুড প্রিজারভেশন' : 'Safe eco-preservative'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Checkout controls */}
          <div className="mt-8 pt-5 border-t border-emerald-50">
            
            {product.stock <= 0 ? (
              <div className="text-center rounded-xl bg-red-50 text-red-500 font-sans font-extrabold py-3">
                {t.soldOut}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                
                {/* Quantity selector */}
                <div className="flex items-center border border-emerald-100 rounded-xl bg-emerald-50/20 px-1 py-1">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-emerald-100 font-black text-emerald-950 transition-all cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold font-sans text-emerald-950 text-sm">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(Math.min(product.stock, qty + 1))}
                    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-emerald-100 font-black text-emerald-950 transition-all cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to click */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-sans font-bold py-3 px-4 flex items-center justify-center gap-2.5 shadow-md shadow-emerald-400/15 transition-all text-sm active:scale-97 cursor-pointer"
                  id="add-qty-cart-btn"
                >
                  <ShoppingCart className="w-4.5 h-4.5" />
                  <span>{t.addToCart}</span>
                </button>
              </div>
            )}

            {/* Dynamic Price Calculation display */}
            {!product.isPopular && product.stock > 0 && (
              <div className="mt-3 text-right">
                <span className="text-[11px] font-medium text-emerald-700 font-sans">
                  {t.totalPrice}: <span className="font-extrabold text-emerald-950 text-xs">
                    {t.tk}
                    {(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price 
                      ? product.discountPrice 
                      : product.price) * qty}
                  </span>
                </span>
              </div>
            )}

            {/* Direct inquiry CTA */}
            <div className="mt-4 pt-3 border-t border-dotted border-emerald-100 flex items-center justify-between">
              <span className="text-[10px] text-emerald-700 font-medium font-sans">
                {t.whatsappAsk}
              </span>
              <a
                href={`https://wa.me/8801793840762?text=আসসালামু আলাইকুম, আমি Green Mango সাইট থেকে '${language === 'bn' ? product.name : product.nameEn}' আম সম্পর্কে বিস্তারিত জানতে চাই।`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 hover:text-emerald-900 font-sans"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600 fill-emerald-100 animate-pulse" />
                <span>WhatsApp (01793840762)</span>
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
