import React, { useState } from 'react';
import { 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ShoppingCart, 
  Zap, 
  Star, 
  HelpCircle, 
  AlertCircle,
  FileCheck,
  ExternalLink
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface ProductDetailModalProps {
  product: SubscriptionProduct | null;
  currency: CurrencyCode;
  onClose: () => void;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onOpenFullPage?: (productSlug: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  onClose,
  onAddToCart,
  onBuyNow,
  onOpenFullPage,
}) => {
  if (!product) return null;

  const [selectedPlan, setSelectedPlan] = useState<PlanVariant>(
    product.plans.find((p) => p.isPopular) || product.plans[0]
  );
  const [activeTab, setActiveTab] = useState<'features' | 'activation' | 'faq'>('features');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative color glow */}
        <div 
          className="relative px-4 sm:px-6 py-4 sm:py-6 border-b border-slate-800"
          style={{ background: `linear-gradient(135deg, ${product.colorScheme.bgGlow}, #0f172a)` }}
        >
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && (
                <span className={`px-2.5 py-0.5 rounded-md text-[11px] sm:text-xs font-bold border border-amber-500/30 ${product.colorScheme.badgeBg} ${product.colorScheme.badgeText}`}>
                  {product.badge}
                </span>
              )}
              <span className="text-[11px] sm:text-xs text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-md">
                القسم: {product.brand}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFullPage(product.slug);
                  }}
                  type="button"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700 hover:border-amber-500/30 text-xs font-bold transition-all"
                  title="فتح الصفحة التفصيلية الكاملة للأداة مع مقارنة الأسعار"
                >
                  <span className="hidden xs:inline">الصفحة الكاملة</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 sm:p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          <div className="flex items-start gap-3 sm:gap-4">
            <div className="shrink-0">
              <ProductBrandIcon slug={product.slug} brand={product.brand} size="lg" />
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-lg sm:text-2xl font-black text-white truncate">{product.nameAr}</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-mono mt-0.5 truncate" dir="ltr">{product.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-300">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount} تقييم معتمد)</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>سرعة التجهيز: {product.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ضمان كامل المدة من كينجز ستور</span>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Plan Selector */}
          <div>
            <h4 className="text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
              <span>اختر مدة الاشتراك المناسبة:</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.plans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`cursor-pointer p-3.5 rounded-xl border text-right transition-all ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-white">{plan.durationLabel}</span>
                      <span className="font-extrabold text-base text-amber-400 font-mono">
                        {formatPrice(plan.priceEGP, currency)}
                      </span>
                    </div>
                    <p className="text-[11px] text-emerald-400 font-medium">
                      ✓ {plan.deliveryTypeLabel}
                    </p>
                    {plan.notes && (
                      <p className="text-[10px] text-amber-300 mt-1 font-medium">
                        ★ {plan.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {product.fullDescAr}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'features'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              المميزات المشمولة
            </button>
            <button
              onClick={() => setActiveTab('activation')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'activation'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              طريقة التفعيل والشروط
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`pb-2.5 px-4 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'faq'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              الأسئلة الشائعة ({product.faqs.length})
            </button>
          </div>

          {/* Tab 1: Features */}
          {activeTab === 'features' && (
            <div className="space-y-2">
              {product.featuresAr.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-800/30 border border-slate-800 text-xs sm:text-sm text-slate-200">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Activation Steps */}
          {activeTab === 'activation' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-800/40 text-xs text-blue-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block mb-0.5">المتطلبات:</span>
                  <span>{product.requirementsAr}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <h5 className="text-xs font-bold text-slate-400">خطوات استلام وتشغيل الاشتراك:</h5>
                {product.activationStepsAr.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-200">
                    <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Warranty Guarantee notice */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block mb-0.5">سياسة ضمان كينجز ستور الرسمية:</span>
                  <span>جميع الاشتراكات مشمولة بضمان استبدال فوري طوال فترة الباقة المحددة بدون أي رسوم إضافية.</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: FAQs */}
          {activeTab === 'faq' && (
            <div className="space-y-3">
              {product.faqs.map((faq, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
                  <h5 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-1.5 mb-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{faq.question}</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed pr-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Modal Footer with Price & Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">إجمالي الباقة المختارة:</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-400 font-mono">
                {formatPrice(selectedPlan.priceEGP, currency)}
              </span>
              {selectedPlan.originalPriceEGP > selectedPlan.priceEGP && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  {formatPrice(selectedPlan.originalPriceEGP, currency)}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAddToCart(product, selectedPlan);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs sm:text-sm font-bold text-white transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>إضافة إلى السلة</span>
            </button>

            <button
              onClick={() => {
                onBuyNow(product, selectedPlan);
                onClose();
              }}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/20 transition-all transform hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>متابعة الشراء الفوري</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
