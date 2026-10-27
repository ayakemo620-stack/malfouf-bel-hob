import React from 'react';
import { ShoppingBag, Utensils, Heart, Phone, Sparkles, MapPin, BarChart3, ClipboardList, Lock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenDeliveryZones: () => void;
  onOpenMarketingHub: () => void;
  onOpenStory: () => void;
  currentView: 'store' | 'kitchen';
  onToggleView: (view: 'store' | 'kitchen') => void;
  activeOrdersCount: number;
  isSessionUnlocked: boolean;
  isStoreLocked: boolean;
  onLockSession: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracker,
  onOpenDeliveryZones,
  onOpenMarketingHub,
  onOpenStory,
  currentView,
  onToggleView,
  activeOrdersCount,
  isSessionUnlocked,
  isStoreLocked,
  onLockSession,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EADECF] shadow-xs">
      {/* Top announcement bar */}
      <div className="bg-[#B83528] text-white text-xs sm:text-sm py-1.5 px-3 text-center flex items-center justify-center gap-2 font-medium">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse shrink-0" />
        <span className="truncate">طازة كل يوم من الفرن البلدي يوصلك سخن مولع! كود الخصم:</span>
        <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-black tracking-wider text-amber-200">LOVE20</span>
        <span className="hidden md:inline text-amber-100 font-bold">(-20% على أول أوردر)</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0" onClick={() => onToggleView('store')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#B83528] to-[#99251A] flex items-center justify-center text-white shadow-md shadow-[#B83528]/25 ring-2 ring-[#B83528]/20">
              <span className="text-xl sm:text-2xl" role="img" aria-label="cabbage">🥬</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg sm:text-2xl font-black text-[#2B1B17] tracking-tight">
                  ملفوف بالحب
                </h1>
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-black px-2 py-0.5 bg-[#FAF0E4] text-[#B83528] rounded-full border border-[#E9D6C4]">
                  <Heart className="w-2.5 h-2.5 fill-[#B83528]" /> أكل بيتي مصري
                </span>
              </div>
              <p className="text-[11px] text-[#7A6B63] font-medium hidden sm:block">
                أحلى محاشي وطواجن بشاميل وجلاش معمولين بسمنة بلدي ونظافة تشرفك
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-bold text-[#54463F]">
            <button
              onClick={() => {
                onToggleView('store');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 rounded-xl transition-all ${
                currentView === 'store'
                  ? 'bg-[#B83528]/10 text-[#B83528]'
                  : 'hover:bg-[#F3EBE1] hover:text-[#2B1B17]'
              }`}
            >
              المنيو والأكلات
            </button>
            <button
              onClick={onOpenStory}
              className="px-3 py-2 rounded-xl hover:bg-[#F3EBE1] hover:text-[#2B1B17] transition-all"
            >
              حكايتنا وسر طعمنا
            </button>
            <button
              onClick={onOpenDeliveryZones}
              className="px-3 py-2 rounded-xl hover:bg-[#F3EBE1] hover:text-[#2B1B17] transition-all flex items-center gap-1"
            >
              <MapPin className="w-4 h-4 text-[#B83528]" />
              مناطق الدليفري
            </button>
            <button
              onClick={onOpenMarketingHub}
              className="px-3 py-2 rounded-xl hover:bg-[#F3EBE1] hover:text-[#2B1B17] transition-all flex items-center gap-1"
            >
              <BarChart3 className="w-4 h-4 text-[#3A6B35]" />
              الخطة التسويقية
            </button>
            <button
              onClick={onOpenTracker}
              className="px-3 py-2 rounded-xl hover:bg-[#F3EBE1] hover:text-[#2B1B17] transition-all flex items-center gap-1 text-[#B83528]"
            >
              <ClipboardList className="w-4 h-4" />
              تتبع الأوردر
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Switch to Kitchen Admin Dashboard Button with Security Lock Protection */}
            <button
              onClick={() => onToggleView(currentView === 'store' ? 'kitchen' : 'store')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-xs border cursor-pointer ${
                currentView === 'kitchen'
                  ? 'bg-[#2E5A27] text-white border-[#2E5A27]'
                  : 'bg-white text-[#2E5A27] border-[#2E5A27]/30 hover:bg-[#2E5A27]/10'
              }`}
              title={
                isSessionUnlocked
                  ? 'جلسة الإدارة مفتوحة - انقر للإدارة'
                  : 'لوحة إدارة المطبخ محمية برمز سري لمنع دخول أي شخص آخر'
              }
            >
              {isSessionUnlocked ? (
                <Utensils className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              ) : (
                <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B83528]" />
              )}
              <span className="hidden md:inline">
                {currentView === 'kitchen' ? 'الرجوع للمتجر' : 'إدارة المطبخ والمخزون'}
              </span>
              <span className="md:hidden text-[11px]">
                {currentView === 'kitchen' ? 'المتجر' : 'المطبخ'}
              </span>
              {!isSessionUnlocked && currentView === 'store' && (
                <span className="text-[10px] bg-[#B83528]/10 text-[#B83528] px-1 rounded font-black hidden sm:inline">
                  🔒 مقفل
                </span>
              )}
              {activeOrdersCount > 0 && currentView === 'store' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-1.5 sm:gap-2 bg-[#B83528] hover:bg-[#A12E22] text-white px-3 py-1.5 sm:px-4 sm:py-2.5 rounded-xl font-black shadow-md shadow-[#B83528]/25 transition-transform active:scale-95 touch-manipulation"
              aria-label="سلة المشتريات"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-stone-900 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="font-mono text-xs sm:text-sm">
                {cartTotal > 0 ? `${cartTotal} ج.م` : 'السلة'}
              </span>
            </button>

            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/?text=%D9%85%D8%B3%D8%A7%D8%A1%20%D8%A7%D9%84%D8%AE%D9%8A%D8%B1%D8%8C%20%D8%B9%D8%A7%D9%8A%D8%B2%20%D8%A3%D8%B9%D8%B1%D9%81%20%D8%A3%D9%83%D9%84%D8%A7%D8%AA%20%D8%A7%D9%84%D9%86%D9%87%D8%A7%D8%B1%D8%AF%D8%A9%20%D9%81%D9%8A%20%D9%85%D8%B7%D8%A8%D8%AE%20%D9%85%D9%84%D9%81%D9%88%D9%81%20%D8%A8%D8%A7%D9%84%D8%AD%D8%A8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center justify-center transition-colors shrink-0"
              title="تواصل مباشر عبر واتساب"
            >
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </a>
          </div>
        </div>

        {/* Mobile secondary navigation bar */}
        <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-[#EFE5D9] text-xs font-bold text-[#54463F] no-scrollbar gap-1.5">
          <button
            onClick={() => onToggleView('store')}
            className={`px-2.5 py-1 rounded-lg whitespace-nowrap ${
              currentView === 'store' ? 'bg-[#B83528]/10 text-[#B83528]' : ''
            }`}
          >
            المنيو
          </button>
          <button onClick={onOpenStory} className="px-2 py-1 rounded-lg whitespace-nowrap">
            حكايتنا
          </button>
          <button onClick={onOpenDeliveryZones} className="px-2 py-1 rounded-lg whitespace-nowrap">
            مناطق الدليفري
          </button>
          <button onClick={onOpenMarketingHub} className="px-2 py-1 rounded-lg whitespace-nowrap text-[#3A6B35]">
            الخطة التسويقية
          </button>
          <button onClick={onOpenTracker} className="px-2 py-1 rounded-lg whitespace-nowrap text-[#B83528]">
            تتبع أوردرك
          </button>
        </div>
      </div>
    </header>
  );
};
