import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Unlock, AlertTriangle, KeyRound, Eye, EyeOff, CheckCircle2, X } from 'lucide-react';

interface AdminSecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  savedPin: string;
}

export const AdminSecurityModal: React.FC<AdminSecurityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  savedPin,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutTimer, setLockoutTimer] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsSuccess(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (lockoutTimer > 0) {
      interval = setInterval(() => {
        setLockoutTimer((prev) => {
          if (prev <= 1) {
            setIsLockedOut(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTimer]);

  if (!isOpen) return null;

  const handleDigitPress = (digit: string) => {
    if (isLockedOut) return;
    if (pin.length < 6) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');
      if (nextPin.length === savedPin.length) {
        verifyPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (isLockedOut) return;
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  const verifyPin = (codeToTest: string) => {
    if (codeToTest === savedPin) {
      setIsSuccess(true);
      setErrorMsg('');
      setTimeout(() => {
        onSuccess();
      }, 600);
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin('');
      if (newAttempts >= 5) {
        setIsLockedOut(true);
        setLockoutTimer(30);
        setErrorMsg('تم حظر المحاولات مؤقتاً لمدة 30 ثانية لأمان النظام ومنع المتطفلين!');
      } else {
        setErrorMsg(`الرمز السري غير صحيح! فاضلك ${5 - newAttempts} محاولات قبل الإغلاق المؤقت.`);
      }
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    verifyPin(pin);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn" dir="rtl">
      <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl border-2 border-[#B83528]/30 shadow-2xl p-6 sm:p-8 overflow-hidden text-center">
        {/* Top security banner */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#B83528] via-[#E25C4D] to-[#B83528]" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-[#73635A] hover:text-[#261B16] rounded-full hover:bg-[#F3EBE1] transition-all"
          title="إلغاء والرجوع للمتجر"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Security Shield Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-[#B83528]/10 text-[#B83528] flex items-center justify-center mb-4 ring-8 ring-[#B83528]/5 shadow-inner">
          {isSuccess ? (
            <Unlock className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 animate-bounce" />
          ) : (
            <ShieldCheck className="w-8 h-8 sm:w-10 sm:h-10 text-[#B83528]" />
          )}
        </div>

        {/* Title & Description */}
        <div className="space-y-1.5 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF0E4] border border-[#E8DACB] text-[11px] font-black text-[#B83528]">
            <Lock className="w-3 h-3" />
            <span>نظام الحماية: عدم دخول أي شخص آخر</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#261B16]">
            منطقة مخصصة للإدارة فقط
          </h3>
          <p className="text-xs sm:text-sm text-[#73635A] font-medium leading-relaxed">
            ممنوع دخول أي شخص غير صاحب العمل لحماية خصوصية بيانات الزبائن، الإيرادات، والتحكم في المطبخ.
          </p>
        </div>

        {/* PIN Dots Display */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {Array.from({ length: savedPin.length }).map((_, idx) => {
            const isFilled = idx < pin.length;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${
                  isFilled
                    ? 'bg-[#B83528] border-[#B83528] scale-125 shadow-md shadow-[#B83528]/30'
                    : 'bg-[#F2ECE4] border-[#D6C7B7]'
                }`}
              />
            );
          })}
        </div>

        {/* Key Code input fallback / view */}
        <form onSubmit={handleManualSubmit} className="mb-4">
          <div className="relative max-w-[200px] mx-auto">
            <input
              type={showPin ? 'text' : 'password'}
              maxLength={savedPin.length}
              value={pin}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setPin(val);
                if (val.length === savedPin.length) verifyPin(val);
              }}
              placeholder="••••"
              disabled={isLockedOut}
              className="w-full text-center text-xl font-mono tracking-widest font-black py-2 px-3 rounded-xl bg-[#FAF5EE] border border-[#DFCFC0] text-[#261B16] focus:outline-none focus:ring-2 focus:ring-[#B83528]"
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#261B16]"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </form>

        {/* Error or Alert Message */}
        {errorMsg && (
          <div className="p-2.5 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center justify-center gap-1.5 animate-shake">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {isSuccess && (
          <div className="p-2.5 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>تم التحقق بنجاح! جاري فتح لوحة الإدارة...</span>
          </div>
        )}

        {isLockedOut && (
          <div className="p-3 mb-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
            انتظر {lockoutTimer} ثانية للمحاولة مرة أخرى.
          </div>
        )}

        {/* Numeric Keypad for Mobile and Touchscreens */}
        <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mb-5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              disabled={isLockedOut}
              onClick={() => handleDigitPress(digit)}
              className="h-12 rounded-2xl bg-[#FAF5EE] hover:bg-[#F2E8DC] active:bg-[#B83528] active:text-white border border-[#E5D7C6] text-[#261B16] font-mono text-lg font-black transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            disabled={isLockedOut}
            onClick={() => setPin('')}
            className="h-12 rounded-2xl bg-[#F6EFE6] hover:bg-[#EBDDCF] text-[#8C7A70] hover:text-[#261B16] text-xs font-bold transition-all border border-[#E5D7C6] flex items-center justify-center cursor-pointer"
          >
            مسح
          </button>
          <button
            type="button"
            disabled={isLockedOut}
            onClick={() => handleDigitPress('0')}
            className="h-12 rounded-2xl bg-[#FAF5EE] hover:bg-[#F2E8DC] active:bg-[#B83528] active:text-white border border-[#E5D7C6] text-[#261B16] font-mono text-lg font-black transition-all shadow-xs flex items-center justify-center cursor-pointer disabled:opacity-50"
          >
            0
          </button>
          <button
            type="button"
            disabled={isLockedOut}
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-[#F6EFE6] hover:bg-[#EBDDCF] text-[#8C7A70] hover:text-[#B83528] text-xs font-bold transition-all border border-[#E5D7C6] flex items-center justify-center cursor-pointer"
          >
            ⌫
          </button>
        </div>

        {/* Master PIN Hint for Owner */}
        <div className="bg-[#FAF5EE] p-3 rounded-2xl border border-[#E8DACB] text-[11px] text-[#73635A] space-y-1">
          <div className="flex items-center justify-center gap-1 font-bold text-[#261B16]">
            <KeyRound className="w-3.5 h-3.5 text-[#B83528]" />
            <span>رمز الدخول المبدئي لمالك المتجر:</span>
            <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#DFCEBD] text-[#B83528] font-black tracking-wider">
              {savedPin}
            </span>
          </div>
          <p className="text-[10px] text-[#8A796F]">
            (يمكنك تغيير الرمز السري من داخل لوحة التحكم بأي وقت لمنع دخول أي شخص غيرك)
          </p>
        </div>

      </div>
    </div>
  );
};
