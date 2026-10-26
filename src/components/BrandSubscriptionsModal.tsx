import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShoppingCart, 
  Zap, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ExternalLink,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface BrandSubscriptionsModalProps {
  product: SubscriptionProduct | null;
  isOpen: boolean;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onViewFullDetails: (product: SubscriptionProduct) => void;
}

export const BrandSubscriptionsModal: React.FC<BrandSubscriptionsModalProps> = ({
  product,
  isOpen,
  currency,
  onClose,
  onAddToCart,
  onBuyNow,
  onViewFullDetails,
}) => {
  const [addedPlanId, setAddedPlanId] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const handleAddToCart = (plan: PlanVariant) => {
    onAddToCart(product, plan);
    setAddedPlanId(plan.id);
    setTimeout(() => setAddedPlanId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs overflow-y-auto font-['Cairo',sans-serif]">
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#E8E4DC] rounded-3xl shadow-2xl overflow-hidden my-auto text-right text-[#242933] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#E8E4DC] bg-[#F8F6F2] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#E8E4DC] p-1.5 flex items-center justify-center shadow-xs">
              <ProductBrandIcon slug={product.slug} brand={product.brand} size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-[#242933]">
                  اشتراكات {product.brand || product.name.split('(')[0].trim()} المتاحة
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#13583D]/10 text-[#13583D]">
                  {product.plans.length} باقات
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                {product.shortDescAr || product.nameAr}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: List of Available Plans */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>اختر الباقة المناسبة لاحتياجك:</span>
            <span className="text-[#13583D] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ضمان كامل المدة وتفعيل رسمي</span>
            </span>
          </div>

          <div className="space-y-3">
            {product.plans.map((plan) => {
              const discountPercent = Math.round(
                ((plan.originalPriceEGP - plan.priceEGP) / plan.originalPriceEGP) * 100
              );
              const isAdded = addedPlanId === plan.id;

              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    plan.isPopular
                      ? 'bg-[#F9FAF7] border-[#13583D] shadow-xs'
                      : 'bg-white border-[#E8E4DC] hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Plan details */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-[#242933]">
                          {plan.durationLabel}
                        </h4>
                        {plan.isPopular && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#13583D] text-white">
                            الأكثر طلباً ⭐
                          </span>
                        )}
                        {discountPercent > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-mono">
                            وفر {discountPercent}%
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="text-emerald-700 font-medium">
                          ✓ {plan.deliveryTypeLabel}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{product.deliveryTime}</span>
                        </span>
                      </div>

                      {plan.notes && (
                        <p className="text-[11px] text-slate-600 bg-white/80 px-2 py-1 rounded-md inline-block border border-slate-100">
                          {plan.notes}
                        </p>
                      )}
                    </div>

                    {/* Price and CTA buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      
                      {/* Price Column */}
                      <div className="text-left font-mono">
                        <div className="text-base sm:text-lg font-black text-[#242933]">
                          {formatPrice(plan.priceEGP, currency)}
                        </div>
                        {plan.originalPriceEGP > plan.priceEGP && (
                          <div className="text-xs text-slate-400 line-through">
                            {formatPrice(plan.originalPriceEGP, currency)}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(plan)}
                          className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                            isAdded
                              ? 'bg-emerald-600 text-white'
                              : 'bg-white hover:bg-slate-100 text-[#242933] border border-[#E8E4DC]'
                          }`}
                          title="إضافة للسلة"
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>تمت!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-3.5 h-3.5" />
                              <span className="hidden xs:inline">أضف للسلة</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onBuyNow(product, plan);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#13583D] hover:bg-[#0E4630] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1 active:scale-95"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>شراء فوري</span>
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Product Features Summary */}
          {product.featuresAr && product.featuresAr.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#F8F6F2] border border-[#E8E4DC] space-y-2 mt-4">
              <h5 className="font-bold text-xs text-[#242933] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#13583D]" />
                <span>مميزات اشتراك {product.nameAr}:</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5E6676]">
                {product.featuresAr.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#13583D] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed page footer link */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
            <span>ترغب في قراءة كل الخطوات والشروط؟</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewFullDetails(product);
              }}
              className="text-[#13583D] hover:underline font-bold flex items-center gap-1"
            >
              <span>فتح صفحة المنتج الكاملة</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
