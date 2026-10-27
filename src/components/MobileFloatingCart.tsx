import React from 'react';
import { ShoppingBag, ArrowLeft, Sparkles } from 'lucide-react';

interface MobileFloatingCartProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  isVisible: boolean;
}

export const MobileFloatingCart: React.FC<MobileFloatingCartProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  isVisible,
}) => {
  if (!isVisible || cartCount === 0) return null;

  return (
    <div className="md:hidden fixed bottom-18 inset-x-3 z-30 animate-slideUp" dir="rtl">
      <button
        onClick={onOpenCart}
        className="w-full bg-[#B83528] text-white rounded-2xl p-3.5 shadow-xl shadow-[#B83528]/35 flex items-center justify-between gap-3 active:scale-[0.98] transition-transform cursor-pointer border border-[#D9483A]"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-mono font-black text-sm">
            {cartCount}
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-white/90">سلة الأكلات الجاهزة</div>
            <div className="text-sm font-black font-mono">
              {cartTotal} <span className="text-[11px] font-sans">ج.م</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors">
          <span>إتمام الطلب</span>
          <ArrowLeft className="w-4 h-4" />
        </div>
      </button>
    </div>
  );
};
