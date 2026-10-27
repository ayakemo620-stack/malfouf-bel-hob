import React from 'react';
import { Heart, Sparkles, Clock, ShieldCheck, Flame, ArrowLeft, Award, UtensilsCrossed } from 'lucide-react';
import grapePomegranateImg from '../assets/images/grape_pomegranate_1793079534895.jpg';

interface HeroBannerProps {
  onScrollToMenu: () => void;
  onOpenStory: () => void;
  onApplyCoupon: (code: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onScrollToMenu,
  onOpenStory,
  onApplyCoupon,
}) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFDF9] via-[#FBF5ED] to-[#FAF7F2] pt-6 pb-12 sm:py-16 border-b border-[#EADECF]">
      {/* Decorative culinary background patterns */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#B83528]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 sm:w-80 h-72 sm:h-80 rounded-full bg-[#3A6B35]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Main Hero Copy (7 cols) */}
          <div className="lg:col-span-7 text-right space-y-4 sm:space-y-6">
            
            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF0E4] border border-[#E9D6C4] text-[#B83528] text-xs sm:text-sm font-bold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#B83528] animate-ping" />
              <span>أكل بيتي مصري بأيدي ستات بيوت شاطرين 👩‍🍳</span>
              <span className="text-[#87786F] font-normal hidden sm:inline">| يخرج من الفرن طازة وسخن</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#261B16] leading-[1.25] tracking-tight">
              أكل بيتي مصري أصيل.. <br />
              <span className="text-[#B83528] inline-block relative">
                ملفوف بالحب
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-[#B83528]/15 -z-10 rounded-sm" />
              </span>{' '}
              وريحة حبايبنا
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-lg text-[#615148] leading-relaxed max-w-2xl font-medium">
              تسلم إيدك يا ست الكل! بنعملك أحلى ورق عنب بناتي دايب، حلة كرنب فلاحي مسكر، جلاش مورق ومقرمش، وطواجن مكرونة بشاميل ونجرسكو غرقانة صوص.. معمولين بسمنة بلدي ونظافة تشرفك قدام عيلتك وضيوفك.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 sm:pt-2">
              <button
                onClick={onScrollToMenu}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3.5 bg-[#B83528] hover:bg-[#A12E22] text-white font-black text-sm sm:text-base rounded-2xl shadow-lg shadow-[#B83528]/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>اختار أكلتك من المنيو</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={onOpenStory}
                className="px-4 sm:px-6 py-3.5 bg-white hover:bg-[#F3EBE1] text-[#2B1B17] font-bold text-xs sm:text-sm rounded-2xl border border-[#DDCFBE] shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <UtensilsCrossed className="w-4 h-4 text-[#B83528]" />
                <span>حكايتنا وسر الطعم</span>
              </button>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-3 border-t border-[#E8DACB]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-100/80 text-amber-800 flex items-center justify-center shrink-0">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#2A1D17]">طازة وسخن مولع</div>
                  <div className="text-[10px] text-[#7A6C63]">بيستوي مخصوص للأوردر</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-100/80 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#2A1D17]">سمنة بلدي 100%</div>
                  <div className="text-[10px] text-[#7A6C63]">بدون أي زيوت مهدرجة</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-100/80 text-rose-800 flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#B83528]" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#2A1D17]">تغليف حراري</div>
                  <div className="text-[10px] text-[#7A6C63]">يوصلك كأنه طالع من فرنك</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-100/80 text-purple-800 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#2A1D17]">إنستاباي وفودافون</div>
                  <div className="text-[10px] text-[#7A6C63]">ودفع كاش عند الاستلام</div>
                </div>
              </div>
            </div>

          </div>

          {/* Featured Visual Dish Card (5 cols) */}
          <div className="lg:col-span-5 relative mt-2 lg:mt-0">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              
              {/* Outer decorative ring */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#B83528]/20 via-amber-200/40 to-emerald-500/20 rounded-3xl blur-md" />
              
              <div className="relative bg-white rounded-3xl p-3 shadow-2xl border border-[#EBE0D2] overflow-hidden">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden group">
                  <img
                    src={grapePomegranateImg}
                    alt="ورق عنب دبس الرمان ملفوف بالحب"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating badge top right */}
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-[#B83528] flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>الأكتر طلباً النهاردة</span>
                  </div>

                  {/* Floating badge bottom left */}
                  <div className="absolute bottom-2.5 left-2.5 bg-stone-900/80 backdrop-blur-md text-white px-2.5 py-1 rounded-xl text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>تجهيز 40 دقيقة</span>
                  </div>
                </div>

                {/* Dish mini teaser info */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-[#261B16] text-sm sm:text-base">
                      ورق عنب دبس الرمان وحبات الرمان
                    </h3>
                    <span className="font-black text-[#B83528] text-base sm:text-lg font-mono">
                      230 ج.م
                    </span>
                  </div>
                  <p className="text-xs text-[#74645B] leading-normal line-clamp-2">
                    مكس المزازة والحلاوة! ورق عنب غرقان بصوص دبس رمان مركز مع حبات الرمان الفريش وزيت الزيتون.
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span>★ 5.0</span>
                      <span className="text-[#96867D] font-normal">(215 تقييم حقيقي)</span>
                    </div>
                    <button
                      onClick={() => onApplyCoupon('LOVE20')}
                      className="text-[#B83528] font-bold hover:underline flex items-center gap-1"
                    >
                      <span>خصم 20% بكود LOVE20</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
