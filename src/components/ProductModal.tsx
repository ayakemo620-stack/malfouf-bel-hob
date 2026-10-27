import React, { useState } from 'react';
import { Product } from '../types';
import { X, Clock, Flame, Star, Check, Plus, Minus, ChefHat, Sparkles } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSizeName?: string, notes?: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [customNotes, setCustomNotes] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const currentSizeObj = product.sizes && product.sizes.length > 0
    ? product.sizes[selectedSizeIndex]
    : undefined;

  const unitPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const totalPrice = unitPrice * quantity;

  const handleAdd = () => {
    if (product.stockCount <= 0) return;
    for (let i = 0; i < quantity; i++) {
      onAddToCart(
        product,
        currentSizeObj ? currentSizeObj.name : undefined,
        customNotes.trim() ? customNotes.trim() : undefined
      );
    }
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 850);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 text-right">
      <div
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-[#EBE0D2] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 left-3.5 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Image Header */}
        <div className="relative h-56 sm:h-64 w-full bg-[#F3EDE2] overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-3 right-4 left-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#B83528] text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs">
                {product.category === 'mahshi'
                  ? 'محاشي وورق عنب'
                  : product.category === 'goulash'
                  ? 'جلاش وصواني'
                  : product.category === 'pasta'
                  ? 'بشاميل ونجرسكو'
                  : 'بوكسات العزومات'}
              </span>
              <div className="flex items-center gap-1 bg-black/50 px-2 py-0.5 rounded-lg text-xs">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-stone-300 text-[11px]">({product.reviewsCount} تقييم)</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm">{product.name}</h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* Detailed description */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#99877E]">حكاية الطبق وسر طعمه</h4>
            <p className="text-xs sm:text-sm text-[#4F4139] leading-relaxed font-medium">
              {product.longDescription || product.description}
            </p>
          </div>

          {/* Chef Tip if available */}
          {product.chefTip && (
            <div className="p-3 rounded-2xl bg-[#FFF8EE] border border-[#F3DFC4] flex items-start gap-2.5">
              <ChefHat className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-[#705238]">
                <strong className="block text-[#54391F] font-bold mb-0.5">نصيحة ست الكل في المطبخ:</strong>
                {product.chefTip}
              </div>
            </div>
          )}

          {/* Size / Portion selector if dish has sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-[#99877E] block">
                اختار الحجم اللي يناسبك:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {product.sizes.map((size, idx) => {
                  const isSelected = selectedSizeIndex === idx;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeIndex(idx)}
                      className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#B83528] bg-[#FDF3F1] ring-2 ring-[#B83528]/25'
                          : 'border-[#E6DACB] bg-white hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="font-black text-xs sm:text-sm text-[#2B1B17]">
                        {size.name}
                      </div>
                      <div className="text-[11px] text-[#86756C] mt-0.5">{size.servings}</div>
                      <div className="text-sm font-black text-[#B83528] font-mono mt-2">
                        {size.price} ج.م
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Natural ingredients */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#99877E]">
              المكونات البلدي الطازة:
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((item, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-[#FAF3EA] text-[#55453C] px-2.5 py-1 rounded-xl border border-[#E7DCCE]"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-2 p-2.5 bg-[#F9F5EE] rounded-2xl border border-[#EADFCF] text-center text-xs">
            <div>
              <span className="text-[#88786F] block text-[10px]">وقت التسوية</span>
              <span className="font-bold text-[#2C1F19] mt-0.5 block">{product.prepTime}</span>
            </div>
            <div>
              <span className="text-[#88786F] block text-[10px]">السعرات</span>
              <span className="font-bold text-[#2C1F19] mt-0.5 block">{product.calories} سعرة</span>
            </div>
            <div>
              <span className="text-[#88786F] block text-[10px]">درجة الشطة</span>
              <span className="font-bold text-[#2C1F19] mt-0.5 block">
                {product.spiceLevel === 'none'
                  ? 'بارد بدون شطة'
                  : product.spiceLevel === 'mild'
                  ? 'مظبوط ولطيف'
                  : 'مشطشط نار 🔥'}
              </span>
            </div>
          </div>

          {/* Custom Notes for Kitchen */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#4B3D35] block">
              أي طلب خاص للشيف؟ (زيادة ليمون، تسوية زيادة، بدون شطة...)
            </label>
            <input
              type="text"
              placeholder="اكتب ملاحظتك هنا وهتوصل المطبخ مع الأوردر..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-[#DCCFBF] focus:outline-none focus:ring-2 focus:ring-[#B83528]/30 bg-[#FFFDF9]"
            />
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-3.5 sm:p-5 bg-[#FAF7F2] border-t border-[#EAE0D3] flex items-center justify-between gap-3">
          
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-xl border border-[#DECFC0] shadow-xs">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-7 h-7 rounded-lg bg-[#F5EDE3] hover:bg-[#EADDCF] text-[#4A3D36] flex items-center justify-center font-bold"
              aria-label="تقليل الكمية"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center font-mono font-bold text-sm text-[#281C16]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
              disabled={quantity >= product.stockCount}
              className="w-7 h-7 rounded-lg bg-[#F5EDE3] hover:bg-[#EADDCF] text-[#4A3D36] flex items-center justify-center font-bold disabled:opacity-40"
              aria-label="زيادة الكمية"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            type="button"
            disabled={product.stockCount <= 0}
            onClick={handleAdd}
            className={`flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
              isAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : product.stockCount <= 0
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : 'bg-[#B83528] hover:bg-[#A12E22] text-white shadow-[#B83528]/30'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>اتضاف للأوردر بنجاح!</span>
              </>
            ) : product.stockCount <= 0 ? (
              <span>خلص النهاردة</span>
            ) : (
              <>
                <span>أضف للسلة</span>
                <span>•</span>
                <span className="font-mono">{totalPrice} ج.م</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
};
