import React, { useState } from 'react';
import { CartItem, Coupon } from '../types';
import { X, Trash2, Plus, Minus, ArrowLeft, Tag, ShoppingBag, AlertCircle, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  availableCoupons: Coupon[];
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  availableCoupons,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  const subtotal = items.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const total = Math.max(0, subtotal - discount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const ok = onApplyCoupon(couponInput.trim());
    if (!ok) {
      setCouponError('كود الخصم غير صحيح أو مش واصل الحد الأدنى للطلب');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl flex flex-col justify-between border-r border-[#EADFCF] animate-in slide-in-from-left duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE0D2] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0E4] text-[#B83528] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#2A1D17]">سلة الأوردر</h2>
              <span className="text-xs text-[#7B6A61]">
                {items.length === 0 ? 'السلة لسه فاضية' : `${items.length} أصناف من أشهى أكل بيتي`}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F5EDE3] hover:bg-[#EAE0D3] text-[#4F4139] flex items-center justify-center transition-colors"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-[#8C7A70]">
              <div className="w-20 h-20 rounded-full bg-[#FAF3EA] border-2 border-dashed border-[#E5D7C6] flex items-center justify-center text-4xl">
                🍲
              </div>
              <div>
                <h3 className="font-black text-base text-[#3C2D25] mb-1">
                  سلتك مستنية أحلى أكل بيتي!
                </h3>
                <p className="text-xs leading-relaxed max-w-xs text-[#7A6B62]">
                  اختار اللي نفسك فيه من المحاشي الطازة، رولات الجلاش، أو طواجن البشاميل وهتتسوى ليك مخصوص بكل حب.
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-[#B83528] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#A12E22] transition-colors"
              >
                شوف المنيو واطلب
              </button>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#EADFCF] shadow-xs flex gap-3 relative group"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 bg-[#F4EFE6]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs sm:text-sm text-[#261B16] leading-snug">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                          title="حذف من الأوردر"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Size or option label */}
                      {item.selectedSizeName && (
                        <span className="text-[11px] text-[#B83528] font-bold block mt-0.5">
                          {item.selectedSizeName}
                        </span>
                      )}

                      {item.customNotes && (
                        <p className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded mt-1 border border-amber-200 inline-block">
                          ملاحظة: {item.customNotes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-baseline gap-1 font-bold text-[#B83528]">
                        <span className="font-mono text-base">{item.calculatedPrice * item.quantity}</span>
                        <span className="text-[11px]">ج.م</span>
                      </div>

                      {/* Quantity buttons */}
                      <div className="flex items-center gap-1.5 bg-[#F8F3EC] px-2 py-1 rounded-lg border border-[#E4D7C8]">
                        <button
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-[#4A3D36] hover:bg-white transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center font-mono font-bold text-xs text-[#281C16]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-5 h-5 rounded flex items-center justify-center text-[#4A3D36] hover:bg-white transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Coupon Section */}
              <div className="bg-[#FAF3EA] rounded-2xl p-3.5 border border-[#E9DDCF] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#4B3B32]">
                  <Tag className="w-4 h-4 text-[#B83528]" />
                  <span>معاك كود خصم؟</span>
                </div>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-semibold">
                    <div>
                      <span>كود متفعل: </span>
                      <strong className="font-mono">{appliedCoupon.code}</strong>
                      <span className="mr-1">({appliedCoupon.discountPercent}% خصم)</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-emerald-700 hover:text-red-600 underline text-xs font-bold"
                    >
                      شيل الكود
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="اكتب الكوبون هنا (زي: LOVE20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 uppercase font-mono text-xs px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white focus:outline-none focus:ring-1 focus:ring-[#B83528]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2D5A27] hover:bg-[#254920] text-white text-xs font-bold rounded-xl transition-colors shrink-0"
                    >
                      تفعيل
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1 font-semibold">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {couponError}
                  </p>
                )}

                {/* Suggestions pills */}
                {!appliedCoupon && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-[#8C7A70]">كوبونات متاحة:</span>
                    {availableCoupons.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => onApplyCoupon(c.code)}
                        className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded-md border border-[#D5C4B2] text-[#B83528] hover:bg-[#B83528] hover:text-white transition-colors"
                      >
                        {c.code} (-{c.discountPercent}%)
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer with calculation */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EAE0D3] bg-white space-y-3">
            <div className="space-y-1.5 text-xs text-[#6B5A51]">
              <div className="flex items-center justify-between">
                <span>المجموع:</span>
                <span className="font-mono font-bold text-[#2A1D17]">{subtotal} ج.م</span>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between text-emerald-700 font-bold">
                  <span>خصم الكوبون ({appliedCoupon.code}):</span>
                  <span className="font-mono">-{discount} ج.م</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[11px] text-[#86756C]">
                <span>مصاريف الدليفري:</span>
                <span>بتتحدد في الخطوة الجاية حسب منطقتك</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#EFE5D9] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8A7970] block">الإجمالي:</span>
                <span className="text-2xl font-black text-[#261B16] font-mono">
                  {total} <span className="text-sm font-sans font-bold">ج.م</span>
                </span>
              </div>

              <button
                onClick={onProceedToCheckout}
                className="py-3 px-5 sm:px-6 bg-[#B83528] hover:bg-[#A12E22] text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-[#B83528]/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <span>يلا نكمل الأوردر</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
