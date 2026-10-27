import React, { useState } from 'react';
import { Product } from '../types';
import { Clock, Flame, Heart, Plus, Check, Star, AlertCircle, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, selectedSizeName?: string, customNotes?: string) => void;
  onViewDetails: (product: Product) => void;
  cartQuantity?: number;
  onUpdateCartQuantity?: (delta: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  cartQuantity = 0,
  onUpdateCartQuantity,
}) => {
  // If product has sizes, default to first or matching size
  const [selectedSizeIndex, setSelectedSizeIndex] = useState<number>(0);
  const [justAdded, setJustAdded] = useState(false);

  const currentSizeObj = product.sizes && product.sizes.length > 0
    ? product.sizes[selectedSizeIndex]
    : undefined;

  const currentPrice = currentSizeObj ? currentSizeObj.price : product.price;
  const currentServings = currentSizeObj ? currentSizeObj.servings : product.servings;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stockCount <= 0) return;
    onAddToCart(product, currentSizeObj ? currentSizeObj.name : undefined);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const isLowStock = product.stockCount > 0 && product.stockCount <= 5;
  const isOutOfStock = product.stockCount <= 0;

  return (
    <div
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-3xl border border-[#E8DECة] border-[#EADFCF] overflow-hidden shadow-xs hover:shadow-xl hover:border-[#D5C2AF] transition-all duration-300 flex flex-col cursor-pointer relative active:scale-[0.99] touch-manipulation"
    >
      {/* Visual Image container */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-[#F3EDE2]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25" />

        {/* Top Badges */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex flex-col gap-1 items-end">
          {product.isFeatured && (
            <span className="bg-[#B83528] text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              أكتر طلب
            </span>
          )}
          {product.dietaryTags.slice(0, 1).map((tag, idx) => (
            <span
              key={idx}
              className="bg-white/95 text-[#2C221D] text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Top Left Preparation Time */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium px-2 py-1 rounded-lg flex items-center gap-1">
          <Clock className="w-3 h-3 text-amber-300" />
          <span>{product.prepTime}</span>
        </div>

        {/* Bottom stats inside image */}
        <div className="absolute bottom-2 right-2.5 left-2.5 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="font-bold">{product.rating}</span>
            <span className="text-stone-300 text-[10px]">({product.reviewsCount})</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px]">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{product.calories} سعرة</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-black text-base sm:text-lg text-[#261B16] leading-snug group-hover:text-[#B83528] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Description in Egyptian Dialect */}
          <p className="text-xs sm:text-sm text-[#6C5D54] line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Dietary tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {product.dietaryTags.slice(0, 2).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] bg-[#FAF3EA] text-[#69584E] px-2 py-0.5 rounded-md border border-[#EBE0D2]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Size selector buttons if dish has sizes (like Bechamel or Negresco) */}
        {product.sizes && product.sizes.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#F8F2E8] p-1 rounded-xl border border-[#E7D9C7] flex items-center justify-between gap-1 text-xs"
          >
            {product.sizes.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSizeIndex(idx)}
                className={`flex-1 py-1.5 px-1.5 rounded-lg font-bold text-center transition-all ${
                  selectedSizeIndex === idx
                    ? 'bg-[#B83528] text-white shadow-xs'
                    : 'text-[#6C5D54] hover:text-[#261B16]'
                }`}
              >
                <div className="text-[11px] leading-tight font-black">{s.name.split('(')[0]}</div>
                <div className="text-[10px] opacity-90 font-mono mt-0.5">{s.price} ج.م</div>
              </button>
            ))}
          </div>
        )}

        {/* Stock status indicator & Servings */}
        <div className="flex items-center justify-between text-[11px] pt-1">
          {isOutOfStock ? (
            <span className="text-red-600 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              خلصت النهاردة
            </span>
          ) : isLowStock ? (
            <span className="text-amber-700 font-bold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              باقي {product.stockCount} بس!
            </span>
          ) : (
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              جاهز ومستوي طازة
            </span>
          )}

          <span className="text-[#88786F] text-[11px] font-medium">
            {currentServings}
          </span>
        </div>

        {/* Price & Add to Cart button */}
        <div className="pt-2 border-t border-[#EFE5D9] flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-[#261B16] font-mono">
              {currentPrice}
            </span>
            <span className="text-xs text-[#7B6A61] font-bold">ج.م</span>
            {product.originalPrice && !currentSizeObj && (
              <span className="text-xs text-[#A8988E] line-through font-mono mr-1">
                {product.originalPrice}
              </span>
            )}
          </div>

          {/* Mobile-friendly Stepper or Add Button */}
          {cartQuantity > 0 && onUpdateCartQuantity && !product.sizes ? (
            <div
              onClick={(e) => e.stopPropagation()}
              className="flex items-center bg-[#FAF0E4] border border-[#E8DACB] rounded-xl p-1 gap-1 shadow-xs"
            >
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(-1)}
                className="w-8 h-8 rounded-lg bg-white hover:bg-stone-100 flex items-center justify-center font-black text-sm text-[#B83528] shadow-xs active:scale-95 cursor-pointer touch-manipulation"
                title="تقليل الكمية"
              >
                -
              </button>
              <span className="font-mono font-black text-xs sm:text-sm px-2 min-w-[24px] text-center text-[#261B16]">
                {cartQuantity}
              </span>
              <button
                type="button"
                onClick={() => onUpdateCartQuantity(1)}
                className="w-8 h-8 rounded-lg bg-[#B83528] text-white hover:bg-[#A12E22] flex items-center justify-center font-black text-sm shadow-xs active:scale-95 cursor-pointer touch-manipulation"
                title="زيادة الكمية"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer touch-manipulation ${
                isOutOfStock
                  ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  : justAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                  : 'bg-[#B83528] hover:bg-[#A12E22] text-white shadow-[#B83528]/25'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>اتضافت بالسلة!</span>
                </>
              ) : isOutOfStock ? (
                <span>خلص</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>أضف للأوردر</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
