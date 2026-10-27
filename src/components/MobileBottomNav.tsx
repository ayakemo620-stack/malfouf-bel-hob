import React from 'react';
import { Utensils, ShoppingBag, ClipboardList, MapPin, ChefHat, Lock, Heart, Sparkles, BookOpen } from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'store' | 'kitchen';
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenDeliveryZones: () => void;
  onOpenStory: () => void;
  onToggleView: (view: 'store' | 'kitchen') => void;
  isSessionUnlocked: boolean;
  activeOrdersCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  cartCount,
  cartTotal,
  onOpenCart,
  onOpenTracker,
  onOpenDeliveryZones,
  onOpenStory,
  onToggleView,
  isSessionUnlocked,
  activeOrdersCount,
}) => {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-lg border-t border-[#EAE0D3] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] py-1.5 px-2" dir="rtl">
      <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
        
        {/* Button 1: Menu / Store */}
        <button
          onClick={() => {
            if (currentView !== 'store') {
              onToggleView('store');
            } else {
              const el = document.getElementById('menu-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'store'
              ? 'text-[#B83528] font-black'
              : 'text-[#7A6B63] hover:text-[#261B16]'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${currentView === 'store' ? 'bg-[#B83528]/10' : ''}`}>
            <span className="text-lg leading-none" role="img" aria-label="menu">🍲</span>
          </div>
          <span className="text-[10px] mt-0.5 font-bold">المنيو</span>
        </button>

        {/* Button 2: Track Orders */}
        <button
          onClick={onOpenTracker}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#7A6B63] hover:text-[#261B16] transition-all cursor-pointer relative"
        >
          <div className="p-1.5 rounded-xl relative">
            <ClipboardList className="w-5 h-5 text-[#B83528]" />
            {activeOrdersCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">أوردراتي</span>
        </button>

        {/* Button 3: Floating / Center Cart Highlight Button */}
        <button
          onClick={onOpenCart}
          className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
        >
          <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B83528] to-[#D94132] text-white flex items-center justify-center shadow-lg shadow-[#B83528]/35 ring-4 ring-[#FFFDF9] transition-transform active:scale-95">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-400 text-stone-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs border-2 border-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 font-black text-[#B83528]">
            {cartTotal > 0 ? `${cartTotal} ج.م` : 'السلة'}
          </span>
        </button>

        {/* Button 4: Delivery Zones */}
        <button
          onClick={onOpenDeliveryZones}
          className="flex flex-col items-center justify-center py-1 px-1 rounded-xl text-[#7A6B63] hover:text-[#261B16] transition-all cursor-pointer"
        >
          <div className="p-1.5 rounded-xl">
            <MapPin className="w-5 h-5 text-[#3A6B35]" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">التوصيل</span>
        </button>

        {/* Button 5: Kitchen Admin (Protected) */}
        <button
          onClick={() => onToggleView(currentView === 'store' ? 'kitchen' : 'store')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all cursor-pointer ${
            currentView === 'kitchen'
              ? 'text-[#2D5A27] font-black'
              : 'text-[#7A6B63] hover:text-[#261B16]'
          }`}
        >
          <div className={`p-1.5 rounded-xl relative ${currentView === 'kitchen' ? 'bg-[#2D5A27]/10' : ''}`}>
            {isSessionUnlocked ? (
              <ChefHat className="w-5 h-5 text-[#2D5A27]" />
            ) : (
              <Lock className="w-5 h-5 text-[#B83528]" />
            )}
            {!isSessionUnlocked && (
              <span className="absolute -top-0.5 -right-0.5 text-[8px] bg-[#B83528] text-white px-1 rounded-full font-mono">
                PIN
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-bold">
            {currentView === 'kitchen' ? 'المتجر' : 'المطبخ'}
          </span>
        </button>

      </div>
    </div>
  );
};
