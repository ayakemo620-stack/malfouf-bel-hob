import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { X, CheckCircle2, Clock, MapPin, ChefHat, Package, Bike, Sparkles, Phone, MessageCircle } from 'lucide-react';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onCancelOrder?: (orderId: string) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
}) => {
  if (!isOpen) return null;

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders[0]?.id || ''
  );

  const currentOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      key: 'received',
      label: 'تم استلام الأوردر 📝',
      desc: 'سجلنا طلبك في المطبخ وبنجهز الحلل والصواني البلدي',
      icon: <Clock className="w-5 h-5" />,
    },
    {
      key: 'in_kitchen',
      label: 'على النار في المطبخ 🔥',
      desc: 'المحاشي بتتسوى على نار هادية بريحة السمنة البلدي وتوابل زمان',
      icon: <ChefHat className="w-5 h-5" />,
    },
    {
      key: 'packaged',
      label: 'تغليف حراري ملوكي 📦',
      desc: 'بنغلف الطواجن في حافظات حرارية معزولة عشان توصلك سخنة مولعة',
      icon: <Package className="w-5 h-5" />,
    },
    {
      key: 'on_the_way',
      label: 'مع الطيار في السكة 🛵',
      desc: 'المندوب استلم الأوردر من المطبخ وطالع بيه على عنوانك حالاً',
      icon: <Bike className="w-5 h-5" />,
    },
    {
      key: 'delivered',
      label: 'ألف هنا وشفا.. تم التسليم 🍽️',
      desc: 'سفرة دايمة ومطرح ما يسري يمري يا رب!',
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
  ];

  const statusOrder: OrderStatus[] = ['received', 'in_kitchen', 'packaged', 'on_the_way', 'delivered'];
  const currentIndex = currentOrder ? statusOrder.indexOf(currentOrder.status) : 0;

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
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#2A1D17]">تتبع حالة أوردرك لحظة بلحظة</h2>
              <span className="text-xs text-[#7A6960]">
                خليك متابع خطوة بخطوة من ساعة ما يدخل الفرن لحد ما يوصل باب بيتك
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
          {orders.length === 0 ? (
            <div className="text-center py-10 space-y-3 text-[#7B6A61]">
              <div className="w-16 h-16 rounded-full bg-[#FAF3EA] flex items-center justify-center mx-auto text-2xl">
                📋
              </div>
              <h3 className="font-black text-base text-[#2C1F19]">مفيش أوردرات جارية دلوقتي</h3>
              <p className="text-xs max-w-sm mx-auto">
                أول ما تعمل أوردر في المتجر، هتقدر تتابع حركته خطوة بخطوة من الشاشة دي.
              </p>
            </div>
          ) : (
            <>
              {/* Order selector tabs if multiple orders */}
              {orders.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EDE2D5] no-scrollbar">
                  <span className="text-xs font-bold text-[#86756C] shrink-0">أوردراتك:</span>
                  {orders.map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black font-mono transition-all shrink-0 ${
                        currentOrder.id === o.id
                          ? 'bg-[#B83528] text-white shadow-xs'
                          : 'bg-[#F5ECE1] text-[#4F3F36] hover:bg-[#EBDFD2]'
                      }`}
                    >
                      {o.orderNumber}
                    </button>
                  ))}
                </div>
              )}

              {/* Order Hero Card */}
              {currentOrder && (
                <div className="bg-gradient-to-br from-[#FAF5EE] to-[#F5ECE0] p-4 sm:p-5 rounded-2xl border border-[#E6D8C8] space-y-3">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <span className="text-[11px] text-[#7A6960] font-bold block">
                        رقم الأوردر
                      </span>
                      <h3 className="text-lg font-black font-mono text-[#261B16]">
                        {currentOrder.orderNumber}
                      </h3>
                      <span className="text-xs text-[#827168] mt-0.5 block">
                        وقت الطلب: {currentOrder.createdAt}
                      </span>
                    </div>

                    <div className="text-left">
                      <span className="text-[11px] text-[#7A6960] font-bold block">
                        إجمالي المبلغ
                      </span>
                      <span className="text-xl font-black text-[#B83528] font-mono">
                        {currentOrder.total} ج.م
                      </span>
                      <span className="text-[11px] text-[#75645B] block font-medium">
                        {currentOrder.paymentMethod === 'cash'
                          ? 'كاش عند الاستلام'
                          : currentOrder.paymentMethod === 'instapay'
                          ? 'تحويل إنستاباي InstaPay'
                          : currentOrder.paymentMethod === 'vodafone_cash'
                          ? 'فودافون كاش'
                          : 'كارت بنكي'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DFD1BF] flex items-center justify-between text-xs text-[#5D4D44] flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#B83528]" />
                      <span>{currentOrder.district} — {currentOrder.address}</span>
                    </div>
                    <div>
                      <span className="bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                        {currentOrder.deliveryType === 'instant'
                          ? '⚡ دليفري فوري سخن (35-50 دقيقة)'
                          : currentOrder.deliveryType === 'pickup'
                          ? 'استلام من المطبخ'
                          : `مجدول (${currentOrder.scheduledDate} - ${currentOrder.scheduledTime})`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress Steps Timeline */}
              {currentOrder && (
                <div className="p-4 bg-white rounded-2xl border border-[#E9DDCF] space-y-5">
                  <h4 className="text-xs font-black text-[#86756C] uppercase tracking-wider">
                    مراحل تحضير وتوصيل الأكل:
                  </h4>

                  <div className="relative space-y-5 pr-2">
                    {/* Connecting line */}
                    <div className="absolute top-3 bottom-3 right-5 w-0.5 bg-[#E6DACB] -z-0" />

                    {steps.map((step, idx) => {
                      const isCompleted = idx < currentIndex;
                      const isCurrent = idx === currentIndex;

                      return (
                        <div key={step.key} className="flex items-start gap-3 sm:gap-4 relative z-10">
                          {/* Step icon dot */}
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-xs ${
                              isCompleted
                                ? 'bg-emerald-600 text-white'
                                : isCurrent
                                ? 'bg-[#B83528] text-white ring-4 ring-[#B83528]/20 animate-pulse'
                                : 'bg-[#F3EBE0] text-[#917E73]'
                            }`}
                          >
                            {step.icon}
                          </div>

                          {/* Step description */}
                          <div className="flex-1 pt-0.5">
                            <div className="flex items-center justify-between">
                              <h5
                                className={`text-xs sm:text-sm font-black ${
                                  isCurrent
                                    ? 'text-[#B83528]'
                                    : isCompleted
                                    ? 'text-emerald-800'
                                    : 'text-[#88776F]'
                                }`}
                              >
                                {step.label}
                              </h5>
                              {isCurrent && (
                                <span className="text-[10px] font-black bg-[#B83528]/10 text-[#B83528] px-2 py-0.5 rounded-full">
                                  شغالين فيها دلوقتي 🔥
                                </span>
                              )}
                              {isCompleted && (
                                <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1">
                                  ✓ جهزت
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#716158] mt-0.5 leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Items in this order */}
              {currentOrder && (
                <div className="p-3.5 sm:p-4 bg-[#FAF7F2] rounded-2xl border border-[#EADFCF] space-y-2">
                  <h4 className="text-xs font-black text-[#86756C] uppercase tracking-wider">
                    أصناف الأوردر:
                  </h4>
                  <div className="divide-y divide-[#EAE0D3]">
                    {currentOrder.items.map((item) => (
                      <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-[#B83528]">
                            {item.quantity}×
                          </span>
                          <span className="font-black text-[#2A1D17]">
                            {item.product.name}
                          </span>
                          {item.selectedSizeName && (
                            <span className="text-[#88776F] text-[11px]">
                              ({item.selectedSizeName})
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-black text-[#2A1D17]">
                          {item.calculatedPrice * item.quantity} ج.م
                        </span>
                      </div>
                    ))}
                  </div>

                  {currentOrder.notes && (
                    <div className="pt-2 text-[11px] text-amber-900 bg-amber-50 p-2 rounded-xl border border-amber-200">
                      ملاحظتك للمطبخ: {currentOrder.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Direct Kitchen WhatsApp Support */}
              <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-emerald-950 gap-2">
                <div className="flex items-center gap-2.5">
                  <MessageCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <strong className="block font-black">عايز تسأل عن الأوردر أو تضيف حاجة؟</strong>
                    <span className="text-[11px] text-emerald-800">فريق المطبخ متصل ومستني يخدمك في أي وقت</span>
                  </div>
                </div>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `مساء الخير مطبخ ملفوف بالحب، بستفسر عن أوردر رقم ${currentOrder?.orderNumber}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>شات واتساب المطبخ</span>
                </a>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-between">
          <span className="text-xs text-[#8C7B71]">
            التحديثات حية ومباشرة من مطبخ "ملفوف بالحب"
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
