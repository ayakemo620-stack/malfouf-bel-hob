import React from 'react';
import { DeliveryZone } from '../types';
import { X, MapPin, ThermometerSun } from 'lucide-react';

interface DeliveryZonesModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: DeliveryZone[];
}

export const DeliveryZonesModal: React.FC<DeliveryZonesModalProps> = ({
  isOpen,
  onClose,
  zones,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#E9DDCF] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE0D2] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0E4] text-[#B83528] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#2A1D17]">مناطق التوصيل ومصاريف الدليفري</h2>
              <span className="text-xs text-[#7A6960]">
                بنغطي مناطق القاهرة والجيزة وأوردرك بيوصلك سخن مولع في حافظات حرارية
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
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto space-y-4">
          
          {/* Thermal Insulation Promise */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <ThermometerSun className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <h4 className="font-black text-sm text-amber-900">
                ضمان وصول الأكل سخن مولع 100% 🔥
              </h4>
              <p className="leading-relaxed font-medium">
                جميع حلل وصواني المحاشي وطواجن البشاميل بتخرج من الفرن مباشرة في علب وحافظات حرارية مخصوصة معزولة، عشان تفتح العلبة وتلاقي البخار طالع منها كأنك طابخها في بيتك حالاً.
              </p>
            </div>
          </div>

          {/* Zones list */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-black text-[#86756C] uppercase tracking-wider">
              المناطق والأحياء المغطاة:
            </h3>

            <div className="grid grid-cols-1 gap-2.5">
              {zones.map((zone) => (
                <div
                  key={zone.id}
                  className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#EADBCC] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <h4 className="font-black text-sm text-[#261B16]">{zone.name}</h4>
                    </div>
                    <p className="text-[11px] text-[#73635A]">
                      يشمل: {zone.cities.join('، ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium border-t sm:border-t-0 pt-2 sm:pt-0 border-[#E8DACB]">
                    <div className="text-center sm:text-left">
                      <span className="text-[#88786F] block text-[10px]">الوقت التقريبي</span>
                      <span className="font-bold text-[#2A1D17]">{zone.estimatedTime}</span>
                    </div>

                    <div className="text-center sm:text-left">
                      <span className="text-[#88786F] block text-[10px]">مصاريف الدليفري</span>
                      <span className="font-mono font-black text-[#B83528] text-sm">
                        {zone.fee} ج.م
                      </span>
                    </div>

                    <div className="text-center sm:text-left">
                      <span className="text-[#88786F] block text-[10px]">الحد الأدنى للطلب</span>
                      <span className="font-mono font-bold text-[#2A1D17]">{zone.minOrder} ج.م</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup option */}
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between">
            <div className="space-y-0.5">
              <strong className="block font-black">تحب تستلم الأوردر بنفسك؟</strong>
              <p className="text-[11px] text-emerald-800">
                تقدر تختار "استلام من المطبخ" وهيكون جاهز ليك سخن بدون أي مصاريف دليفري.
              </p>
            </div>
            <span className="bg-emerald-600 text-white font-black px-3 py-1.5 rounded-xl shrink-0">
              مجاناً 0 ج.م
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#B83528] text-white text-xs font-bold rounded-xl hover:bg-[#A12E22] transition-colors"
          >
            فهمت، شكراً
          </button>
        </div>

      </div>
    </div>
  );
};
