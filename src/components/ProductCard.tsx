import React, { useState } from 'react';
import { 
  Star, 
  ShieldCheck, 
  Clock, 
  ShoppingCart, 
  Check, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface ProductCardProps {
  product: SubscriptionProduct;
  currency: CurrencyCode;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onViewDetails: (product: SubscriptionProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onAddToCart,
  onBuyNow,
  onViewDetails,
}) => {
  const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
  const [selectedPlan, setSelectedPlan] = useState<PlanVariant>(defaultPlan);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedPlan);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white border border-[#E8E4DC] hover:border-[#BED6F5] rounded-2xl p-4 sm:p-5 transition-all duration-200 hover:shadow-md">
      
      {/* Top Header: Badge & Rating */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          {product.badge ? (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EEF4FC] text-[#2C5282] border border-[#D5E4F7]">
              {product.badge}
            </span>
          ) : (
            <span className="text-[11px] text-[#8E97A7] font-medium">{product.brand}</span>
          )}

          <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-[#242933] font-mono font-bold">{product.rating}</span>
            <span className="text-slate-400 text-[11px]">({product.reviewsCount})</span>
          </div>
        </div>

        {/* Brand Icon + Name */}
        <div className="flex items-start gap-3 mb-3">
          <div className="shrink-0 p-1.5 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC] group-hover:scale-105 transition-transform">
            <ProductBrandIcon slug={product.slug} brand={product.brand} size="md" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-[#242933] text-base leading-snug group-hover:text-[#2C5282] transition-colors truncate">
              {product.nameAr}
            </h3>
            <span className="text-xs text-[#8E97A7] font-mono block truncate" dir="ltr">
              {product.name}
            </span>
          </div>
        </div>

        {/* Short clean description - 1 line */}
        <p className="text-[#5E6676] text-xs leading-relaxed mb-3.5 line-clamp-1">
          {product.shortDescAr}
        </p>

        {/* Plan Duration Selector (Clean Segmented Buttons) */}
        <div className="mb-3.5">
          <div className="flex flex-wrap gap-1.5">
            {product.plans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  type="button"
                  className={`flex-1 min-w-[70px] text-center px-2 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-[#2C3442] text-white border-[#2C3442] shadow-xs'
                      : 'bg-[#F8F6F2] text-[#5E6676] border-[#E8E4DC] hover:bg-[#EFECE5]'
                  }`}
                >
                  <span className="block truncate">{plan.durationLabel}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiet Delivery & Guarantee Indicators */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 py-2 px-2.5 rounded-lg bg-[#F8F6F2] mb-3 border border-[#E8E4DC]/80">
          <span className="flex items-center gap-1 text-emerald-700 font-medium">
            <Check className="w-3 h-3" />
            <span>{selectedPlan.deliveryTypeLabel}</span>
          </span>
          <span className="flex items-center gap-1 text-[#5E6676]">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{product.deliveryTime}</span>
          </span>
        </div>
      </div>

      {/* Pricing & Primary CTA */}
      <div className="pt-3 border-t border-[#E8E4DC]/80">
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <span className="text-xl font-extrabold text-[#242933] font-mono tabular-nums">
              {formatPrice(selectedPlan.priceEGP, currency)}
            </span>
            {selectedPlan.originalPriceEGP > selectedPlan.priceEGP && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums mr-2">
                {formatPrice(selectedPlan.originalPriceEGP, currency)}
              </span>
            )}
          </div>

          <button
            onClick={() => onViewDetails(product)}
            className="text-xs text-[#5E6676] hover:text-[#242933] flex items-center gap-0.5 underline underline-offset-2"
          >
            <span>التفاصيل</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleAddToCart}
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-98 shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#3B72A8] hover:bg-[#305E8C] text-white hover:shadow'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>تمت الإضافة!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>أضف للسلة</span>
              </>
            )}
          </button>

          <button
            onClick={() => onBuyNow(product, selectedPlan)}
            type="button"
            className="py-2.5 px-4 rounded-full bg-[#EEF4FC] hover:bg-[#DFECFA] text-[#204E85] border border-[#BED6F5] text-xs font-bold transition-all active:scale-98"
          >
            شراء فوري
          </button>
        </div>
      </div>

    </div>
  );
};
