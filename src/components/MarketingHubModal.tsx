import React, { useState } from 'react';
import { X, Sparkles, Share2, Megaphone, Instagram, Copy, Check } from 'lucide-react';

interface MarketingHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (code: string) => void;
}

export const MarketingHubModal: React.FC<MarketingHubModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copiedText, setCopiedText] = useState(false);

  const promoPostText = `🥬✨ ملفوف بالحب.. ريحة أكل البيت اللي اشتقنا لها وسمنة بلدي 100%!
عايز ورق عنب دايب دوب؟ كرنب بلدي مسكر؟ جلاش مقرمش مورق؟ ولا طاجن مكرونة بشاميل ونجرسكو سايح في الصوص؟
كل أكلاتنا معمولة على إيد ستات بيوت شاطرين وبتوصلك سخنة مولعة لحد باب بيتك!
🎁 خصم 20% على أول أوردر بكود: LOVE20
اطلب دلوقتي وشوف المنيو كامل:
https://malfouf-bel-hob.app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(promoPostText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E9DDCF] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE0D2] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#2D5A27] flex items-center justify-center font-bold">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#2A1D17]">
                الخطة التسويقية لجذب الزبائن
              </h2>
              <span className="text-xs text-[#7A6960]">
                خطة ذكية وبسيطة باللهجة المصرية عشان نوصل لكل محبي الأكل البيتي
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#F3EDE2] hover:bg-[#E7DDD0] text-[#55473F] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-5">
          
          {/* Plan Text (Under 300 words, simple Egyptian Arabic as requested) */}
          <div className="bg-[#FFFDF9] p-4 sm:p-5 rounded-2xl border border-[#EADBCC] space-y-3.5">
            <div className="flex items-center gap-2 text-[#B83528] font-black text-sm">
              <Sparkles className="w-4 h-4" />
              <span>إزاي متجر "ملفوف بالحب" هيجذب العملاء ويكبر بسرعة؟</span>
            </div>

            <p className="text-xs sm:text-sm text-[#4E4038] leading-relaxed font-medium">
              عشان نكسب ثقة الزبائن اللي بيدوروا على أكل بيتي نظيف وطعمه زي أكل أمهاتنا، هنعتمد على 4 خطوات بسيطة ومباشرة:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#52433B]">
              <div className="p-3 bg-[#FAF4EB] rounded-xl border border-[#E8DACB]">
                <strong className="block text-[#261B16] font-bold mb-1">
                  1. فيديوهات ريلز تسيل اللعاب:
                </strong>
                تصوير لحظة خروج طاجن البشاميل من الفرن وهو بيبقبق، وصوت قرمشة الجلاش، ولمعان ورق العنب بدبس الرمان تحت الإضاءة.
              </div>

              <div className="p-3 bg-[#FAF4EB] rounded-xl border border-[#E8DACB]">
                <strong className="block text-[#261B16] font-bold mb-1">
                  2. إعلانات جغرافية مركزة:
                </strong>
                إعلانات إنستغرام وتيك توك تستهدف سكان الأحياء القريبة للمطبخ، مع التركيز على غداء الموظفين في الشركات وأيام العزومات.
              </div>

              <div className="p-3 bg-[#FAF4EB] rounded-xl border border-[#E8DACB]">
                <strong className="block text-[#261B16] font-bold mb-1">
                  3. عروض صواني العيلة يوم الجمعة:
                </strong>
                بوكسات ولمات الجمعة (صينية جلاش + حلة محاشي مشكلة + طاجن بشاميل) بسعر تشجيعي يوفر على ست البيت التعب.
              </div>

              <div className="p-3 bg-[#FAF4EB] rounded-xl border border-[#E8DACB]">
                <strong className="block text-[#261B16] font-bold mb-1">
                  4. خصم ترحيبي وتجربة تشرف:
                </strong>
                كود خصم 20% (LOVE20) لأول أوردر، مع شوية مخلل بيتي وطبق حلو صغير هدية يخلي العميل يطلب كل أسبوع.
              </div>
            </div>
          </div>

          {/* Social Media Post Ready to Copy */}
          <div className="bg-[#FAF7F2] p-3.5 sm:p-4 rounded-2xl border border-[#E6DACB] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#2A1D17]">
                <Instagram className="w-4 h-4 text-[#B83528]" />
                <span>بوست إعلاني جاهز للنشر على السوشيال ميديا:</span>
              </div>
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-white border border-[#D5C2B0] hover:bg-[#F3EDE2] text-[#4F3F36] rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>تم النسخ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>نسخ البوست</span>
                  </>
                )}
              </button>
            </div>

            <pre className="text-xs bg-white p-3 rounded-xl border border-[#DFD1C1] text-[#4A3D36] font-sans whitespace-pre-wrap leading-relaxed select-all">
              {promoPostText}
            </pre>
          </div>

          {/* Direct Share on WhatsApp */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 bg-emerald-50 rounded-2xl border border-emerald-200 gap-2.5">
            <div className="space-y-0.5">
              <h4 className="font-black text-xs sm:text-sm text-emerald-950">
                شير المنيو على جروبات الواتساب
              </h4>
              <p className="text-[11px] text-emerald-800">
                شارك رابط المتجر وكود الخصم في جروبات العيلة وأصحاب الشغل بنقرة واحدة
              </p>
            </div>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(promoPostText)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
            >
              <Share2 className="w-4 h-4" />
              <span>مشاركة على واتساب</span>
            </a>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-between">
          <span className="text-xs text-[#8C7B71]">
            أكل بيتي مصري يشرفك في أي عزومة
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#B83528] text-white text-xs font-bold rounded-xl hover:bg-[#A12E22] transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
