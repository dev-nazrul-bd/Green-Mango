import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ShoppingCart, CheckCircle2, MessageSquare, Phone, MapPin } from 'lucide-react';
import { CartItem, Order, UserProfile } from '../types';

interface OrderModalProps {
  language: 'bn' | 'en';
  cartItems: CartItem[];
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onUpdateQty: (id: string, qty: number) => void;
  currentUser: UserProfile | null;
  onPlaceOrder: (orderData: Partial<Order>) => Promise<string>;
}

export default function OrderModal({
  language,
  cartItems,
  onClose,
  onRemoveItem,
  onUpdateQty,
  currentUser,
  onPlaceOrder,
}: OrderModalProps) {
  const [step, setStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [name, setName] = useState(currentUser?.displayName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [payMethod, setPayMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [payNumber, setPayNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  const cartTotal = cartItems.reduce((acc, item) => {
    const activePrice = item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price
      ? item.product.discountPrice
      : item.product.price;
    return acc + activePrice * item.quantity;
  }, 0);
  const shippingFee = cartTotal > 1500 ? 0 : 80; // Free shipping over 1500 TK
  const totalPayable = cartTotal + shippingFee;

  const t = {
    bn: {
      cartTitle: 'আপনার আমের ঝুড়ি 🛒',
      checkoutTitle: 'ডেলিভারি ও পেমেন্ট বিবরণ 🚚',
      successTitle: 'অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉',
      emptyCart: 'আপনার আমের ঝুড়ি খালি! কিছু সুস্বাদু আম বা আচার যোগ করুন।',
      itemName: 'পণ্য',
      qty: 'পরিমাণ',
      price: 'মূল্য',
      total: 'টোটাল',
      subtotal: 'সর্বমোট পণ্য মূল্য',
      shipping: 'ডেলিভারি চার্জ',
      payable: 'সর্বমোট প্রদেয় মূল্য',
      freeShippingBonus: '১৫০০ টাকার বেশি অর্ডারে ফ্রি ডেলিভারি!',
      needsBilling: 'অনুগ্রহ করে ডেলিভারি তথ্য পুরন করুন:',
      fullName: 'আপনার সম্পূর্ণ নাম',
      mobNumber: 'সচল মোবাইল নম্বর',
      deliveryAddress: 'পূর্ণাঙ্গ ডেলিভারি ঠিকানা',
      paymentSel: 'পেমেন্ট মাধ্যম বেছে নিন',
      codOption: 'ক্যাশ অন ডেলিভারি (হাতে আম পেয়ে মূল্য পরিশোধ)',
      bkashOption: 'বিকাশ (bKash)',
      nagadOption: 'নগদ (Nagad)',
      payMsg: '১. নিচে দেওয়া নম্বরে "Send Money" করুন: \n',
      payInstructions: '২. যে পার্সোনাল বিকাশ/নগদ নম্বর থেকে টাকা পাঠিয়েছেন এবং ফিরতি ট্রানজেকশন আইডি (TrxID) নিচের বক্সে লিখুন। আম সতেজ রাখতে দ্রুত নিশ্চিত করা হবে।',
      senderNum: 'আপনার বিকাশ/নগদ নম্বর',
      trxIdLabel: 'ট্রানজেকশন আইডি (Transaction ID / TrxID)',
      btnNext: 'ডেলিভারি ঠিকানায় যান ➡️',
      btnPlaceOrder: 'অর্ডার কনফার্ম করুন ✅',
      btnReturn: 'শপিং করুন 🛍️',
      successMsg: 'ধন্যবাদ! আপনার অর্ডারটি আমরা পেয়েছি। আমাদের প্রতিনিধি দ্রুত আপনার মোবাইলে যোগাযোগ করবেন।',
      successCta: 'হোয়াটসঅ্যাপে অর্ডার কনফার্ম করুন',
      tk: '৳',
    },
    en: {
      cartTitle: 'Your Cart 🛒',
      checkoutTitle: 'Delivery & Payment Details 🚚',
      successTitle: 'Order Placed Successfully! 🎉',
      emptyCart: 'Your cart is empty! Please add some delicious mangoes/delicacies.',
      itemName: 'Item',
      qty: 'Qty',
      price: 'Price',
      total: 'Total',
      subtotal: 'Cart Subtotal',
      shipping: 'Shipping Fee',
      payable: 'Amount Payable',
      freeShippingBonus: 'Free standard shipping on orders over 1500 TK!',
      needsBilling: 'Please fill out your delivery details:',
      fullName: 'Full Name',
      mobNumber: 'Active Mobile Number',
      deliveryAddress: 'Full Delivery Address',
      paymentSel: 'Choose Payment Method',
      codOption: 'Cash on Delivery (Pay when you receive)',
      bkashOption: 'bKash Wallet',
      nagadOption: 'Nagad Wallet',
      payMsg: '1. Please "Send Money" to the number: \n',
      payInstructions: '2. After sending, enter your sender wallet number and the transaction ID (TrxID) below to seal your order.',
      senderNum: 'Paid from Wallet Number',
      trxIdLabel: 'Transaction ID / TrxID',
      btnNext: 'Proceed to Shipping ➡️',
      btnPlaceOrder: 'Confirm Order ✅',
      btnReturn: 'Back to Shop 🛍️',
      successMsg: 'Thank you! Your order was placed. Our representative will ring you shortly to verify shipment.',
      successCta: 'Confirm Order on WhatsApp',
      tk: '৳',
    }
  }[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !address) {
      alert(language === 'bn' ? 'দয়া করে সবগুলো জরুরি ঘর পুরণ করুন' : 'Please fill all mandatory fields');
      return;
    }
    if ((payMethod === 'bkash' || payMethod === 'nagad') && (!payNumber || !trxId)) {
      alert(language === 'bn' ? 'পেমেন্ট ভেরিফিকেশনের জন্য ওয়ালেট নম্বর ও TrxID প্রদান করুন' : 'Please enter paid wallet number & TrxID');
      return;
    }

    setLoading(true);
    try {
      const orderId = 'ORD-' + Math.floor(Math.random() * 900000 + 100000);
      const itemsData = cartItems.map(item => {
        const itemPrice = item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price
          ? item.product.discountPrice
          : item.product.price;
        return {
          productId: item.product.id,
          name: language === 'bn' ? item.product.name : item.product.nameEn,
          quantity: item.quantity,
          price: itemPrice,
          image: item.product.image
        };
      });

      await onPlaceOrder({
        id: orderId,
        userName: name,
        userEmail: currentUser?.email || 'guest@greenmango.com',
        phone,
        address,
        items: itemsData,
        totalAmount: totalPayable,
        paymentMethod: payMethod,
        paymentNumber: payNumber || undefined,
        transactionId: trxId || undefined,
        status: 'pending',
        createdAt: Date.now()
      });

      setCreatedOrderId(orderId);
      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Order failed to compile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppMessage = () => {
    const itemsText = cartItems.map(item => {
      const activePrice = item.product.discountPrice && item.product.discountPrice > 0 && item.product.discountPrice < item.product.price
        ? item.product.discountPrice
        : item.product.price;
      return `- ${language === 'bn' ? item.product.name : item.product.nameEn} (${item.quantity} x ${activePrice}৳)`;
    }).join('\n');

    return `আসসালামু আলাইকুম! আমি Green Mango অ্যাপ থেকে একটি অর্ডার সাবমিট করেছি। 🥭
অর্ডার আইডি: ${createdOrderId}
নাম: ${name}
মোবাইল: ${phone}
ডেলিভারি ঠিকানা: ${address}
আাইটেমসমূহ:
${itemsText}
সর্বমোট প্রদেয় মূল্য: ${totalPayable}৳
পেমেন্ট মেথড: ${payMethod.toUpperCase()} ${payNumber ? `(নম্বর: ${payNumber}, TrxID: ${trxId})` : ''}
দয়া করে অর্ডারটি দ্রুত কনফার্ম করুন। ধন্যবাদ!`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/65 backdrop-blur-md animate-in fade-in duration-300">
      
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col border border-emerald-50 max-h-[90vh]"
        id="order-modal-container"
      >
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-emerald-100 bg-emerald-50/25">
          <h3 className="font-sans text-lg font-extrabold text-emerald-950">
            {step === 'cart' ? t.cartTitle : step === 'checkout' ? t.checkoutTitle : t.successTitle}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-red-50 text-emerald-900 hover:text-red-500 transition-colors cursor-pointer"
            id="close-order-modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic content box */}
        <div className="flex-1 p-6 overflow-y-auto font-sans">
          
          {step === 'cart' && (
            <div>
              {cartItems.length === 0 ? (
                <div className="text-center py-16">
                  <span className="text-5xl mb-4 block">🛒</span>
                  <p className="text-emerald-950 text-sm font-bold">{t.emptyCart}</p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-xs font-semibold text-white cursor-pointer"
                  >
                    {language === 'bn' ? 'আম কিনুন 🥭' : 'Go Shopping 🥭'}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Cart items list table */}
                  <div className="divide-y divide-emerald-50 max-h-[350px] overflow-y-auto pr-1">
                    {cartItems.map((item) => (
                      <div key={item.product.id} className="flex gap-4 py-4.5 items-center first:pt-0 last:pb-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="h-14 w-14 rounded-xl object-cover border border-emerald-100"
                        />
                        <div className="flex-1">
                          <h4 className="text-xs sm:text-sm font-extrabold text-emerald-950">
                            {language === 'bn' ? item.product.name : item.product.nameEn}
                          </h4>
                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{item.product.unit}</p>
                          <div className="flex items-center justify-between mt-1.5">
                            {/* Quantity buttons */}
                            <div className="flex items-center border border-emerald-100 rounded-lg">
                              <button
                                onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}
                                className="px-2 py-1 text-slate-500 hover:bg-emerald-50 text-xs font-black cursor-pointer"
                              >
                                -
                              </button>
                              <span className="px-2 text-xs font-bold text-emerald-950 font-mono">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}
                                className="px-2 py-1 text-slate-500 hover:bg-emerald-50 text-xs font-black cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            {/* Sub total */}
                            <span className="text-xs font-bold text-emerald-950 font-mono">
                              {t.tk}{item.product.price * item.quantity}
                            </span>
                          </div>
                        </div>

                        {/* Removal */}
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Calculations card */}
                  <div className="rounded-2xl bg-emerald-50/30 p-4 border border-emerald-100/50 space-y-2 text-sm">
                    {cartTotal < 1500 && (
                      <div className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1.5 rounded-lg border border-emerald-100 text-center mb-2 animate-bounce">
                        💡 {t.freeShippingBonus}
                      </div>
                    )}
                    <div className="flex justify-between text-emerald-800">
                      <span>{t.subtotal}:</span>
                      <span className="font-mono font-bold">{t.tk}{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-emerald-800">
                      <span>{t.shipping}:</span>
                      <span className="font-mono font-bold">
                        {shippingFee === 0 ? (language === 'bn' ? 'ফ্রি' : 'Free') : `${t.tk}${shippingFee}`}
                      </span>
                    </div>
                    <div className="h-px bg-emerald-100 my-2"></div>
                    <div className="flex justify-between font-black text-emerald-950 text-base">
                      <span>{t.payable}:</span>
                      <span className="font-mono text-lg">{t.tk}{totalPayable}</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => setStep('checkout')}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{t.btnNext}</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {step === 'checkout' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="space-y-4">
                <p className="text-xs font-bold text-emerald-850 uppercase tracking-wide border-l-2 border-emerald-500 pl-2">
                  {t.needsBilling}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-emerald-950 font-bold mb-1.5">{t.fullName} *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. মোঃ নজরুল ইসলাম"
                      className="w-full rounded-xl border border-emerald-100 px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-emerald-950 font-bold mb-1.5">{t.mobNumber} *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 01793840762"
                      className="w-full rounded-xl border border-emerald-100 px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-emerald-950 font-bold mb-1.5">{t.deliveryAddress} *</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. ফ্ল্যাট ৩বি, বাড়ি ১২, রোড ৫, উত্তরা, ঢাকা"
                    className="w-full rounded-xl border border-emerald-100 px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-hidden resize-none"
                  />
                </div>
              </div>

              {/* Payment selector */}
              <div className="space-y-3.5 pt-3 border-t border-emerald-50">
                <p className="text-xs font-bold text-emerald-850 uppercase tracking-wide border-l-2 border-emerald-500 pl-2">
                  {t.paymentSel}
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'cod', label: language === 'bn' ? 'ক্যাশ অন' : 'COD', sub: 'Cash', color: 'border-emerald-200 bg-emerald-50/10' },
                    { id: 'bkash', label: 'বিকাশ', sub: 'bKash Send', color: 'border-pink-200 bg-pink-50/10' },
                    { id: 'nagad', label: 'নগদ', sub: 'Nagad Send', color: 'border-orange-200 bg-orange-50/10' }
                  ].map((pM) => (
                    <button
                      key={pM.id}
                      type="button"
                      onClick={() => setPayMethod(pM.id as any)}
                      className={`rounded-2xl border-2 p-3 text-center flex flex-col items-center justify-center transition-all cursor-pointer select-none ${
                        payMethod === pM.id 
                          ? 'border-emerald-600 bg-emerald-50/30' 
                          : 'border-slate-100 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xs font-black text-emerald-950 leading-none">{pM.label}</span>
                      <span className="text-[9px] text-emerald-700/80 font-bold mt-1 leading-none">{pM.sub}</span>
                    </button>
                  ))}
                </div>

                {/* Secure instructions for wallet paid */}
                {payMethod !== 'cod' && (
                  <div className="rounded-2xl bg-amber-50/50 border border-amber-100 p-4 space-y-3">
                    <p className="text-xs font-bold text-amber-900 leading-relaxed whitespace-pre-line">
                      {t.payMsg} <span className="font-extrabold text-sm text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-250 font-mono">01793840762</span> (Dev Nazrul)
                    </p>
                    <p className="text-[10px] text-emerald-800/80 leading-relaxed font-bold">
                      {t.payInstructions}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-1">{t.senderNum} *</label>
                        <input
                          type="tel"
                          required
                          value={payNumber}
                          onChange={(e) => setPayNumber(e.target.value)}
                          placeholder="e.g. 01712345678"
                          className="w-full bg-white rounded-lg border border-emerald-100 px-3 py-2 text-xs focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-emerald-950 mb-1">{t.trxIdLabel} *</label>
                        <input
                          type="text"
                          required
                          value={trxId}
                          onChange={(e) => setTrxId(e.target.value)}
                          placeholder="e.g. BK88SDF99"
                          className="w-full bg-white rounded-lg border border-emerald-100 px-3 py-2 text-xs focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <span>{t.btnPlaceOrder} ({t.tk}{totalPayable})</span>
                  )}
                </button>
              </div>

            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-10 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-lg font-sans font-black text-emerald-950">
                  {language === 'bn' ? 'অর্ডারটি সফলভাবে সাবমিট হয়েছে!' : 'Your Order is Stored!'}
                </h4>
                <p className="text-xs font-bold text-emerald-600 font-mono mt-1">
                  ORDER ID: {createdOrderId}
                </p>
                <p className="text-xs text-emerald-700/80 max-w-sm mx-auto mt-4 leading-relaxed font-normal">
                  {t.successMsg}
                </p>
              </div>

              <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                {/* Whatsapp redirection */}
                <a
                  href={`https://wa.me/8801793840762?text=${encodeURIComponent(getWhatsAppMessage())}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs py-3 px-4 flex items-center justify-center gap-2.5 transition-all shadow-md shadow-emerald-400/25 select-none cursor-pointer"
                >
                  <MessageSquare className="w-4.5 h-4.5 fill-white" />
                  <span>{t.successCta}</span>
                </a>

                <button
                  onClick={onClose}
                  className="rounded-xl border border-emerald-100 hover:bg-emerald-50 text-emerald-800 font-bold text-xs py-2.5 cursor-pointer"
                >
                  {t.btnReturn}
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
