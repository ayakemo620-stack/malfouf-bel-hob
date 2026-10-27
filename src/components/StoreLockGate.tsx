import React, { useState } from 'react';
import { Lock, Unlock, Phone, Sparkles, ShieldAlert, KeyRound, AlertCircle, Heart } from 'lucide-react';

interface StoreLockGateProps {
  isLocked: boolean;
  storePin: string;
  onUnlockTemporarily: () => void;
  onOpenOwnerLogin: () => void;
}

export const StoreLockGate: React.FC<StoreLockGateProps> = ({
  isLocked,
  storePin,
  onUnlockTemporarily,
  onOpenOwnerLogin,
}) => {
  const [inputCode, setInputCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocked) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode === storePin) {
      setErrorMsg('');
      onUnlockTemporarily();
    } else {
      setErrorMsg('رمز الدخول غير صحيح! تواصل مع إدارة ملفوف بالحب للحصول على كود الدخول.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A120F]/90 backdrop-blur-lg flex items-center justify-center p-4" dir="rtl">
      <div className="relative max-w-lg w-full bg-[#FFFDF9] rounded-3xl border-2 border-[#B83528]/40 shadow-2xl p-6 sm:p-8 text-center space-y-6 overflow-hidden">
        
        {/* Decorative background aura */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#B83528]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Lock badge icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#B83528] to-[#99251A] text-white flex items-center justify-center shadow-lg shadow-[#B83528]/30 ring-8 ring-[#B83528]/10 animate-pulse">
          <Lock className="w-10 h-10" />
        </div>

        {/* Header content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF0E4] border border-[#E8DACB] text-xs font-black text-[#B83528]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>نظام الحماية: عدم دخول أي شخص آخر</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#261B16]">
            مطبخ ملفوف بالحب مغلق مؤقتاً
          </h2>
          <p className="text-xs sm:text-sm text-[#73635A] font-medium leading-relaxed">
            تم تفعيل وضع الخصوصية لمنع دخول الزوار غير المصرح لهم. لا يمكن تصفح المنيو أو عمل طلبات إلا بإذن خاص من إدارة المطبخ.
          </p>
        </div>

        {/* VIP / Owner Access Form */}
        <form onSubmit={handleSubmit} className="space-y-3 bg-[#FAF5EE] p-4 sm:p-5 rounded-2xl border border-[#E8DACB]">
          <label className="block text-xs font-bold text-[#54463F] text-right">
            إذا كان معاك كود الدعوة أو الدخول الخاص:
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value);
                setErrorMsg('');
              }}
              placeholder="أدخل رمز الدخول السري..."
              className="flex-1 text-center font-mono font-black text-lg py-2.5 px-4 rounded-xl bg-white border border-[#DFCFC0] text-[#261B16] focus:outline-none focus:ring-2 focus:ring-[#B83528]"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#B83528] hover:bg-[#9E2A1F] text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-[#B83528]/20 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>دخول</span>
            </button>
          </div>

          {errorMsg && (
            <div className="text-red-600 text-xs font-bold flex items-center justify-center gap-1 pt-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </form>

        {/* Direct Contact for special orders or reservations */}
        <div className="space-y-2 pt-2 border-t border-[#EAE0D3]">
          <p className="text-xs text-[#8A796F] font-medium">
            عايز تحجز عزومة خاصة أو تستفسر عن توفر الأكلات؟
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <a
              href="https://wa.me/201012345678"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 rounded-xl bg-[#25D366] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-all shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>تواصل واتساب مع إدارة المطبخ</span>
            </a>
            <button
              type="button"
              onClick={onOpenOwnerLogin}
              className="px-4 py-2.5 rounded-xl bg-[#FAF0E4] hover:bg-[#F2E0CD] text-[#261B16] text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-[#DFCFC0] transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#B83528]" />
              <span>دخول مالك المتجر (Admin)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
