import React from 'react';
import { X, Heart, ShieldCheck, Flame, UtensilsCrossed } from 'lucide-react';

interface KitchenStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreMenu: () => void;
}

export const KitchenStoryModal: React.FC<KitchenStoryModalProps> = ({
  isOpen,
  onClose,
  onExploreMenu,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E9DDCF] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with image */}
        <div className="relative h-44 sm:h-52 w-full bg-[#FAF0E4] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80"
            alt="حكاية مطبخ ملفوف بالحب"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3.5 right-4 text-white">
            <span className="bg-[#B83528] text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mb-1">
              روح المطبخ المصري الأصيل
            </span>
            <h2 className="text-xl sm:text-2xl font-black">حكاية "ملفوف بالحب"</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[65vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-[#4F4139] leading-relaxed">
          
          <div className="p-3.5 bg-[#FFF9F2] rounded-2xl border border-[#F1E0CE] space-y-1.5">
            <h3 className="font-black text-[#261B16] text-sm sm:text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#B83528] fill-[#B83528]" />
              <span>ليه بدأنا "ملفوف بالحب"؟</span>
            </h3>
            <p className="font-medium text-[#5A4B42]">
              كلنا بنشتاق لطعم أكل أمهاتنا وجداتنا.. طعم حلة المحشي لما تتقلب على الصينية وسخونتها تدفي القعدة، وطاجن البشاميل اللي صوصه بيبقبق ومقرمش من الوش. بدأنا عشان نوفر الأكل البيتي المصري الأصيل ده لكل حد نفسه في أكلة نظيفة معموله بسمنة بلدي ونظافة مفيش زيها وسط زحمة اليوم.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-black text-[#261B16] text-xs sm:text-sm">وعودنا اللي مستحيل نتنازل عنها:</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E9DDCF] space-y-1">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  🌿
                </div>
                <strong className="block text-[#261B16] font-bold">سمنة بلدي فلاحي 100%</strong>
                <p className="text-[11px] text-[#7A6A61]">
                  مفيش زيوت مهدرجة ولا سمن نباتي.. أكلنا خفيف وصحي وبطعم السمنة البلدي الصافي.
                </p>
              </div>

              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E9DDCF] space-y-1">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#B83528] flex items-center justify-center font-bold">
                  🥬
                </div>
                <strong className="block text-[#261B16] font-bold">لف صوابع حبة حبة</strong>
                <p className="text-[11px] text-[#7A6A61]">
                  ورق العنب والكرنب بيتلفوا صباع صباع بإيدين ستات بيوت محترفات بمقاس واحد.
                </p>
              </div>

              <div className="p-3 bg-[#FAF5EE] rounded-xl border border-[#E9DDCF] space-y-1">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  🔥
                </div>
                <strong className="block text-[#261B16] font-bold">طازة لكل أوردر</strong>
                <p className="text-[11px] text-[#7A6A61]">
                  الأكل بيدخل الفرن ويستوي بعد ما تعمل الأوردر، عشان يوصلك بيغلي كأنه معمول في بيتك.
                </p>
              </div>
            </div>
          </div>

          <p className="text-[#6D5D54] font-medium">
            سواء كنت موظف مش لاقي وقت تطبخ، أو عندك عزومة ومحتاج صواني ومحاشي تشرفك قدام الناس.. بنوعدك بسفرة تفتح النفس وتبيض وشك.
          </p>

        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-between">
          <span className="text-xs text-[#8C7B71]">
            شكراً لثقتكم في مطبخ "ملفوف بالحب"
          </span>
          <button
            onClick={() => {
              onClose();
              onExploreMenu();
            }}
            className="px-4 py-2 bg-[#B83528] text-white text-xs font-bold rounded-xl hover:bg-[#A12E22] transition-colors"
          >
            شوف الأكلات واطلب
          </button>
        </div>

      </div>
    </div>
  );
};
