import React, { useState } from 'react';
import { CartItem, Coupon, DeliveryZone, Order } from '../types';
import { X, ShieldCheck, CreditCard, Banknote, Calendar, Clock, MapPin, CheckCircle2, ChevronRight, Lock, Sparkles, Building2, Smartphone, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  appliedCoupon: Coupon | null;
  deliveryZones: DeliveryZone[];
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  appliedCoupon,
  deliveryZones,
  onOrderComplete,
}) => {
  if (!isOpen) return null;

  // Step state: 1: Delivery details, 2: Payment & confirmation
  const [step, setStep] = useState<1 | 2>(1);

  // Delivery form state
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedZoneId, setSelectedZoneId] = useState(deliveryZones[0]?.id || '');
  const [addressDetails, setAddressDetails] = useState('');
  const [deliveryType, setDeliveryType] = useState<'instant' | 'scheduled' | 'pickup'>('instant');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('14:30');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState<'instapay' | 'vodafone_cash' | 'card' | 'cash'>('cash');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Financial calculations
  const subtotal = items.reduce((acc, item) => acc + item.calculatedPrice * item.quantity, 0);
  const discount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  
  const currentZone = deliveryZones.find((z) => z.id === selectedZoneId) || deliveryZones[0];
  const deliveryFee = deliveryType === 'pickup' ? 0 : currentZone.fee;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!customerName.trim() || customerName.trim().length < 3) {
      setValidationError('من فضلك اكتب اسمك الكريم');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setValidationError('من فضلك اكتب رقم موبايل مصري صحيح (مثال: 01012345678)');
      return;
    }
    if (deliveryType !== 'pickup' && !addressDetails.trim()) {
      setValidationError('من فضلك اكتب تفاصيل العنوان بالكامل (الشارع ورقم العمارة والشقة)');
      return;
    }
    if (deliveryType !== 'pickup' && subtotal < currentZone.minOrder) {
      setValidationError(`الحد الأدنى للطلب لمنطقة ${currentZone.name} هو ${currentZone.minOrder} ج.م`);
      return;
    }

    setStep(2);
  };

  const handleFinalOrder = async () => {
    setValidationError('');
    if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        setValidationError('من فضلك اكتب رقم الكارت 16 رقم بشكل صحيح');
        return;
      }
      if (!cardExpiry || !cardCvv) {
        setValidationError('من فضلك كمل تاريخ انتهاء الكارت ورمز الأمان CVV');
        return;
      }
    }

    setIsProcessing(true);

    // Simulate secure network transaction
    setTimeout(() => {
      setIsProcessing(false);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 110,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore fallback
      }

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber: `MLB-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: customerName.trim(),
        phone: phone.trim(),
        district: deliveryType === 'pickup' ? 'استلام من مطبخ ملفوف بالحب' : currentZone.name,
        address: deliveryType === 'pickup' ? 'مطبخ ملفوف بالحب الرئيسي - القاهرة' : addressDetails.trim(),
        deliveryType,
        scheduledDate: deliveryType === 'scheduled' ? scheduledDate : undefined,
        scheduledTime: deliveryType === 'scheduled' ? scheduledTime : undefined,
        paymentMethod,
        items,
        subtotal,
        discount,
        deliveryFee,
        total,
        couponCode: appliedCoupon?.code,
        status: 'received',
        createdAt: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        notes: specialInstructions.trim() || undefined,
        estimatedDeliveryMinutes: deliveryType === 'instant' ? 40 : 60,
      };

      onOrderComplete(newOrder);
      onClose();
    }, 1300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[92vh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-[#E9DDCF] overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-none duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#EBE0D2] flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FAF0E4] text-[#B83528] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5 text-[#B83528]" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#2A1D17]">
                {step === 1 ? 'بيانات التوصيل والاستلام' : 'تأكيد الأوردر وطريقة الدفع'}
              </h2>
              <span className="text-xs text-[#7A6960] flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                أوردرك في أمان وبيوصلك سخن مولع
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

        {/* Stepper indicator */}
        <div className="bg-[#FAF6F0] px-4 sm:px-6 py-2.5 border-b border-[#EBE0D2] flex items-center justify-center gap-3 sm:gap-4 text-xs font-black">
          <div
            className={`flex items-center gap-1.5 ${
              step === 1 ? 'text-[#B83528]' : 'text-emerald-700'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                step === 1 ? 'bg-[#B83528]' : 'bg-emerald-600'
              }`}
            >
              1
            </span>
            <span>عنوان التوصيل</span>
          </div>

          <div className="w-8 sm:w-12 h-0.5 bg-[#DFD2C2]" />

          <div
            className={`flex items-center gap-1.5 ${
              step === 2 ? 'text-[#B83528]' : 'text-stone-400'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                step === 2 ? 'bg-[#B83528]' : 'bg-stone-300 text-stone-600'
              }`}
            >
              2
            </span>
            <span>الدفع والتأكيد</span>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>⚠️</span>
              <span>{validationError}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Delivery Details */
            <form id="delivery-form" onSubmit={handleProceedToPayment} className="space-y-4">
              
              {/* Delivery type selector */}
              <div>
                <label className="text-xs font-black text-[#4B3B32] block mb-2">
                  تحب تستلم الأكل إزاي؟
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryType('instant')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-right transition-all ${
                      deliveryType === 'instant'
                        ? 'border-[#B83528] bg-[#FDF3F1] ring-2 ring-[#B83528]/25'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-[#B83528] mb-1" />
                    <div className="font-black text-xs text-[#2A1D17]">دليفري سخن فوري</div>
                    <div className="text-[10px] text-[#7A6960]">خلال 35-50 دقيقة</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('scheduled')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-right transition-all ${
                      deliveryType === 'scheduled'
                        ? 'border-[#B83528] bg-[#FDF3F1] ring-2 ring-[#B83528]/25'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-600 mb-1" />
                    <div className="font-black text-xs text-[#2A1D17]">حجز مسبق</div>
                    <div className="text-[10px] text-[#7A6960]">لعزومة أو يوم معين</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-right transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-[#B83528] bg-[#FDF3F1] ring-2 ring-[#B83528]/25'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 mb-1" />
                    <div className="font-black text-xs text-[#2A1D17]">استلام من المطبخ</div>
                    <div className="text-[10px] text-emerald-700 font-bold">بدون مصاريف دليفري</div>
                  </button>
                </div>
              </div>

              {/* Scheduled date & time inputs */}
              {deliveryType === 'scheduled' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200">
                  <div>
                    <label className="text-[11px] font-black text-amber-900 block mb-1">
                      يوم العزومة / التسليم:
                    </label>
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-black text-amber-900 block mb-1">
                      الميعاد المناسب لوصول الأكل:
                    </label>
                    <select
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full text-xs p-2 rounded-xl border border-amber-300 bg-white"
                    >
                      <option value="13:30">01:30 الظهر (غداء بدري)</option>
                      <option value="15:00">03:00 العصر (غداء العيلة)</option>
                      <option value="17:00">05:00 المغرب</option>
                      <option value="20:00">08:00 مساءً (عشاء ولمة)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Personal info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-[#4B3B32] block mb-1">
                    الاسم بالكامل *
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: أحمد محمود"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#B83528]/25"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-[#4B3B32] block mb-1">
                    رقم الموبايل للتوصيل *
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    placeholder="010XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#B83528]/25 text-right font-mono"
                    required
                  />
                </div>
              </div>

              {/* Delivery Zone selection */}
              {deliveryType !== 'pickup' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-black text-[#4B3B32] block mb-1">
                      اختار المنطقة بتاعتك *
                    </label>
                    <select
                      value={selectedZoneId}
                      onChange={(e) => setSelectedZoneId(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] bg-white focus:outline-none focus:ring-2 focus:ring-[#B83528]/25 font-bold"
                    >
                      {deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — دليفري {zone.fee} ج.م ({zone.estimatedTime})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-black text-[#4B3B32] block mb-1">
                      العنوان بالتفصيل (اسم الشارع، رقم العمارة، الدور، الشقة) *
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: شارع التسعين الجنوبي، عمارة 15، الدور 3، شقة 6"
                      value={addressDetails}
                      onChange={(e) => setAddressDetails(e.target.value)}
                      className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#B83528]/25"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Special delivery instructions */}
              <div>
                <label className="text-xs font-black text-[#4B3B32] block mb-1">
                  ملاحظات للطيار (اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: رن الجرس مرة واحدة، كلمني لما توصل، سيب الأوردر على الباب..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] focus:outline-none focus:ring-2 focus:ring-[#B83528]/25"
                />
              </div>

            </form>
          ) : (
            /* STEP 2: Secure Payment & Confirmation */
            <div className="space-y-4">
              
              {/* Payment methods tabs */}
              <div>
                <label className="text-xs font-black text-[#4B3B32] block mb-2">
                  طريقة الدفع المناسبة ليك:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  
                  {/* Cash on delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      paymentMethod === 'cash'
                        ? 'border-[#B83528] bg-[#FDF3F1] ring-2 ring-[#B83528]/25 text-[#B83528]'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0] text-[#2C1F19]'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-1 text-emerald-700" />
                    <span className="font-black text-xs">كاش عند الاستلام</span>
                    <span className="text-[10px] opacity-75 text-[#736359]">ادفع للطيار</span>
                  </button>

                  {/* InstaPay */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('instapay')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      paymentMethod === 'instapay'
                        ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-600/25 text-purple-800'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0] text-[#2C1F19]'
                    }`}
                  >
                    <Send className="w-5 h-5 mb-1 text-purple-700" />
                    <span className="font-black text-xs">إنستاباي InstaPay</span>
                    <span className="text-[10px] opacity-75 text-[#736359]">تحويل لحظي</span>
                  </button>

                  {/* Vodafone Cash */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vodafone_cash')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      paymentMethod === 'vodafone_cash'
                        ? 'border-red-600 bg-red-50 ring-2 ring-red-600/25 text-red-800'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0] text-[#2C1F19]'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-red-600" />
                    <span className="font-black text-xs">فودافون كاش</span>
                    <span className="text-[10px] opacity-75 text-[#736359]">محافظ إلكترونية</span>
                  </button>

                  {/* Card (Visa / Mastercard) */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 sm:p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      paymentMethod === 'card'
                        ? 'border-blue-700 bg-blue-50 ring-2 ring-blue-700/25 text-blue-900'
                        : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0] text-[#2C1F19]'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-blue-700" />
                    <span className="font-black text-xs">فيزا / ماستركارد</span>
                    <span className="text-[10px] opacity-75 text-[#736359]">كروت بنكية</span>
                  </button>

                </div>
              </div>

              {/* Payment Details Container */}
              {paymentMethod === 'cash' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="font-black text-sm text-emerald-900">الدفع كاش عند الاستلام:</div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    هتدفع المبلغ نقداً لمندوب التوصيل أول ما يوصلك الأكل سخن وتمام، وبالهنا والشفا مقدماً!
                  </p>
                </div>
              )}

              {paymentMethod === 'instapay' && (
                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 space-y-2">
                  <div className="font-black text-sm text-purple-900 flex items-center justify-between">
                    <span>بيانات التحويل عبر تطبيق InstaPay:</span>
                    <span className="text-[10px] bg-purple-200/80 px-2 py-0.5 rounded font-mono font-bold">
                      تحويل فوري مجاني
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl font-mono text-xs space-y-1 border border-purple-200 select-all font-bold">
                    <div>IPA: malfouf.belhob@instapay</div>
                    <div>أو رقم الموبايل: 01023456789</div>
                  </div>
                  <p className="text-[11px] text-purple-800">
                    حول المبلغ الإجمالي واحتفظ بلقطة الشاشة (سكرين شوت)، وسيتم تأكيد استلامه فورياً من مطبخنا.
                  </p>
                </div>
              )}

              {paymentMethod === 'vodafone_cash' && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-200 text-xs text-red-950 space-y-2">
                  <div className="font-black text-sm text-red-900 flex items-center justify-between">
                    <span>رقم محفظة فودافون كاش / المحافظ الذكية:</span>
                    <span className="text-[10px] bg-red-200/80 px-2 py-0.5 rounded font-mono font-bold">
                      محفظة بيزنس
                    </span>
                  </div>
                  <div className="p-2.5 bg-white rounded-xl font-mono text-sm space-y-1 border border-red-200 select-all font-black text-center text-red-700">
                    01023456789
                  </div>
                  <p className="text-[11px] text-red-800">
                    تقبل التحويل من أي محفظة (فودافون، أورنج، اتصالات، وي كاش، أو محافظ البنوك).
                  </p>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DAC9] space-y-3">
                  <div className="flex items-center justify-between text-xs font-black text-[#4B3B32]">
                    <span>بيانات الكارت البنكي:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono font-bold">
                        VISA
                      </span>
                      <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-mono font-bold">
                        Mastercard
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6D5E55] block mb-1">
                      الاسم المكتوب على الكارت
                    </label>
                    <input
                      type="text"
                      placeholder="AHMED MAHMOUD"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#D5C4B2] bg-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6D5E55] block mb-1">
                      رقم الكارت (16 رقم)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      maxLength={19}
                      placeholder="5422 •••• •••• 4210"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-[#D5C4B2] bg-white font-mono tracking-wider"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-[#6D5E55] block mb-1">
                        تاريخ الانتهاء (شهر / سنة)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY (زي 08/28)"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[#D5C4B2] bg-white font-mono text-center"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-[#6D5E55] block mb-1">
                        رمز الأمان (CVV)
                      </label>
                      <input
                        type="password"
                        placeholder="3 أرقام خلف الكارت"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs px-3 py-2 rounded-xl border border-[#D5C4B2] bg-white font-mono text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order breakdown summary */}
              <div className="p-3.5 bg-[#FAF4EB] rounded-2xl border border-[#E9DCCF] space-y-2 text-xs">
                <div className="font-black text-[#3B2C24] border-b border-[#E3D4C4] pb-1.5 flex items-center justify-between">
                  <span>حساب الأوردر</span>
                  <span className="text-[11px] text-[#7A6960] font-normal">
                    {deliveryType === 'pickup' ? 'استلام ذاتي' : currentZone.name}
                  </span>
                </div>
                <div className="space-y-1 text-[#65554B]">
                  <div className="flex justify-between">
                    <span>مجموع الأصناف ({items.length}):</span>
                    <span className="font-mono font-bold text-[#2B1B17]">{subtotal} ج.م</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>خصم الكود ({appliedCoupon.code}):</span>
                      <span className="font-mono">-{discount} ج.م</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>مصاريف الدليفري:</span>
                    <span className="font-mono font-bold text-[#2B1B17]">
                      {deliveryFee === 0 ? 'مجاناً (استلام)' : `${deliveryFee} ج.م`}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E3D4C4] font-black text-sm text-[#B83528]">
                    <span>المبلغ الإجمالي النهائي:</span>
                    <span className="font-mono text-base">{total} ج.م</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-between gap-3">
          {step === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-xl border border-[#D5C2AF] text-[#4F3F36] hover:bg-[#F2EAE0] text-xs font-bold transition-colors"
              >
                تعديل العنوان
              </button>

              <button
                type="button"
                disabled={isProcessing}
                onClick={handleFinalOrder}
                className="flex-1 py-3 px-5 bg-[#B83528] hover:bg-[#A12E22] text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-[#B83528]/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>بنأكد أوردرك اللذيذ...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>تأكيد الأوردر الآن ({total} ج.م)</span>
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#D5C2AF] text-[#4F3F36] hover:bg-[#F2EAE0] text-xs font-bold transition-colors"
              >
                إلغاء
              </button>

              <button
                type="submit"
                form="delivery-form"
                className="flex-1 py-3 px-5 bg-[#B83528] hover:bg-[#A12E22] text-white rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-[#B83528]/30 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>يلا نروح لخطوة الدفع</span>
                <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
