import React, { useState } from 'react';
import { 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  Zap, 
  ShoppingCart, 
  DollarSign, 
  Check, 
  ChevronDown, 
  Sparkles, 
  HelpCircle, 
  Share2, 
  MessageCircle, 
  Lock, 
  Crown,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface ProductDetailPageProps {
  product: SubscriptionProduct;
  currency: CurrencyCode;
  onBack: () => void;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onSelectOtherProduct: (productSlug: string) => void;
  allProducts: SubscriptionProduct[];
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  currency,
  onBack,
  onAddToCart,
  onBuyNow,
  onSelectOtherProduct,
  allProducts,
}) => {
  // Plan selection
  const defaultPlan = product.plans.find((p) => p.isPopular) || product.plans[0];
  const [selectedPlan, setSelectedPlan] = useState<PlanVariant>(defaultPlan);
  const [addedToast, setAddedToast] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const discountPercent = Math.round(
    ((selectedPlan.originalPriceEGP - selectedPlan.priceEGP) / selectedPlan.originalPriceEGP) * 100
  );

  const handleAdd = () => {
    onAddToCart(product, selectedPlan);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || p.category === 'bundles'))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#242933] py-8 animate-in fade-in duration-300 font-['Cairo',sans-serif]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
          <div className="flex items-center gap-2 text-xs text-[#5E6676]">
            <button
              onClick={onBack}
              className="hover:text-[#2C5282] font-bold transition-colors flex items-center gap-1"
            >
              <span>المتجر الرئيسي</span>
            </button>
            <span>/</span>
            <span>اشتراكات الذكاء الاصطناعي</span>
            <span>/</span>
            <span className="text-[#2C5282] font-semibold">{product.nameAr}</span>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F2EFE8] text-[#242933] text-xs font-semibold border border-[#E8E4DC] transition-colors shadow-xs"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للمتجر</span>
          </button>
        </div>

        {/* HERO SECTION: Product Showcase & Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Details (8 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badges & Category */}
            <div className="flex flex-wrap items-center gap-2">
              {product.badge && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#EEF4FC] text-[#2C5282] border border-[#BED6F5]">
                  {product.badge}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-white text-[#5E6676] border border-[#E8E4DC] text-xs font-semibold">
                العلامة: {product.brand}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>اشتراك رسمي 100%</span>
              </span>
            </div>

            {/* Title & Brand Logo */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 p-2 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <ProductBrandIcon slug={product.slug} brand={product.brand} size="xl" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#242933] leading-tight">
                  {product.nameAr}
                </h1>
                <p className="text-sm sm:text-base text-slate-500 font-mono font-medium" dir="ltr">
                  {product.name}
                </p>
              </div>
            </div>

            {/* Ratings & Sales stats */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full text-amber-700 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-500 font-normal">({product.reviewsCount} تقييم)</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                <span>المبيعات:</span>
                <strong className="text-slate-900 font-mono">{product.salesCount}+</strong>
              </div>
              <div className="flex items-center gap-1 text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>سرعة التجهيز: {product.deliveryTime}</span>
              </div>
            </div>

            {/* Description */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 space-y-2 leading-relaxed shadow-xs">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {product.fullDescAr}
              </p>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {product.shortDescAr}
              </p>
            </div>

            {/* Highlights Grid */}
            {product.previewHighlights && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.previewHighlights.map((hl, idx) => (
                  <div key={idx} className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-1">
                    <span className="text-[11px] text-slate-400 block">{hl.label}</span>
                    <span className="text-xs sm:text-sm font-black text-white block">{hl.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 1: Real-World Benefits (الفوائد التي تقدمها الأداة) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <span>ما هي الفوائد والقيمة التي ستحصل عليها؟</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(product.benefitsAr || [
                  'توفير مئات الدولارات شهرياً مقارنة بأسعار الاشتراكات الرسمية بالدولار.',
                  'زيادة سرعة وكفاءة إنجاز العمل ومضاعفة الإنتاجية لأكثر من 3 أضعاف.',
                  'ضمان استبدال فوري ودعم فني متواصل 24/7 عبر الواتساب.',
                  'تفعيل آمن ورسمي بدون أي برامج VPN أو مشاركة كلمات السر الخاصة بك.',
                ]).map((benefit, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 flex items-start gap-3 hover:border-amber-500/40 transition-colors"
                  >
                    <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: Use Cases (مجالات وحالات الاستخدام) */}
            {product.useCasesAr && product.useCasesAr.length > 0 && (
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>لمن يصلح هذا الاشتراك وكيف يفيدك في مجالك؟</span>
                </h3>

                <div className="space-y-2.5">
                  {product.useCasesAr.map((uc, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-amber-300">
                        • {uc.role}:
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 pr-3 leading-relaxed">
                        {uc.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 3: Key Features (الميزات الرئيسية والتقنية) */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <span>الميزات التقنية والمزايا المشمولة في الباقة:</span>
              </h3>

              <div className="space-y-2">
                {product.featuresAr.map((feat, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Side: Pricing & Immediate Order Sticky Box (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* Main Order Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-5">
              
              <div>
                <span className="text-xs text-amber-600 font-bold block mb-1">
                  اختر الباقة المناسبة:
                </span>
                <h3 className="text-lg font-bold text-[#242933]">
                  خطط الاشتراك والأسعار المتاحة
                </h3>
              </div>

              {/* Plans selector list */}
              <div className="space-y-2">
                {product.plans.map((plan) => {
                  const isSelected = selectedPlan.id === plan.id;

                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan)}
                      className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-amber-50/60 border-amber-500 shadow-xs'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-400'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                          </div>
                          <span className="font-bold text-sm text-[#242933]">{plan.durationLabel}</span>
                          {plan.isPopular && (
                            <span className="text-[10px] font-bold bg-[#F5E6BD] text-[#3E341B] px-2 py-0.5 rounded-full">
                              الأكثر طلباً
                            </span>
                          )}
                        </div>

                        <div className="text-left font-mono">
                          <span className="font-extrabold text-base text-[#242933]">
                            {formatPrice(plan.priceEGP, currency)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#5E6676] pr-5">
                        <span className="text-emerald-700 font-medium">✓ {plan.deliveryTypeLabel}</span>
                        {plan.originalPriceEGP > plan.priceEGP && (
                          <span className="line-through text-slate-400">
                            {formatPrice(plan.originalPriceEGP, currency)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price summary strip */}
              <div className="p-4 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC] space-y-1.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#5E6676]">الإجمالي المطلوب:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-[#242933] font-mono">
                      {formatPrice(selectedPlan.priceEGP, currency)}
                    </span>
                    {selectedPlan.originalPriceEGP > selectedPlan.priceEGP && (
                      <span className="text-xs text-slate-400 line-through font-mono">
                        {formatPrice(selectedPlan.originalPriceEGP, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {discountPercent > 0 && (
                  <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold">
                    <span>نسبة التوفير:</span>
                    <span className="font-mono">وفر {discountPercent}%</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => onBuyNow(product, selectedPlan)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-sm shadow-xs transition-all active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>شراء فوري واستلام التفعيل</span>
                </button>

                <button
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-white hover:bg-[#F2EFE8] text-[#242933] font-semibold text-xs border border-[#E8E4DC] transition-all active:scale-98 shadow-2xs"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addedToast ? '✓ تمت الإضافة بنجاح!' : 'إضافة إلى سلة المشتريات'}</span>
                </button>
              </div>

              {/* Guarantees Box */}
              <div className="space-y-2 text-xs text-[#5E6676] pt-3 border-t border-[#E8E4DC]">
                <div className="flex items-center gap-2 text-emerald-700">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>ضمان كامل المدة مع استبدال فوري بدون رسوم</span>
                </div>
                <div className="flex items-center gap-2 text-[#2C5282]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>سرعة التسليم: تفعيل فوري خلال {product.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-2 text-[#5E6676]">
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>خصوصية 100% (لا نطلب كلمة مرور حسابك الشخصي)</span>
                </div>
              </div>

              {/* Direct WhatsApp Contact CTA */}
              <a
                href={`https://wa.me/201029384756?text=${encodeURIComponent(
                  `مرحباً كينجز ستور، أود الاستفسار عن اشتراك ${product.nameAr} باقة (${selectedPlan.durationLabel})`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>لديك استفسار؟ تواصل معنا واتساب</span>
              </a>

            </div>

            {/* Official vs Kings Store Price Comparison Box */}
            {product.officialVsKings && (
              <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>مقارنة السعر (الرسمي بالدولار مقابل كينجز ستور):</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>السعر الرسمي بالدولار:</span>
                    <span className="font-mono text-rose-500 line-through">
                      {product.officialVsKings.officialPriceUSD}
                    </span>
                  </div>

                  <div className="flex justify-between text-[#242933] font-bold">
                    <span>سعر كينجز ستور:</span>
                    <span className="font-mono text-emerald-600 text-sm">
                      {product.officialVsKings.kingsPriceEGP}
                    </span>
                  </div>

                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-center font-semibold text-xs">
                    ✓ {product.officialVsKings.savingsText}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* SECTION: Activation Steps & Requirements */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6">
          <div className="max-w-xl">
            <h3 className="text-lg font-bold text-[#242933] mb-1">
              كيف يتم التفعيل بعد إتمام الطلب؟
            </h3>
            <p className="text-xs text-slate-500">
              خطوات واضحة وسريعة تضمن استلام اشتراكك في دقائق معدودة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.activationStepsAr.map((step, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-7 h-7 rounded-full bg-[#EEF4FC] text-[#2C5282] border border-[#BED6F5] font-black flex items-center justify-center text-xs">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-[#242933] text-xs sm:text-sm">الخطوة {idx + 1}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200/70 text-xs text-blue-900 flex items-center gap-3">
            <Lock className="w-4 h-4 text-blue-600 shrink-0" />
            <div>
              <strong className="block text-blue-950 mb-0.5">المتطلبات:</strong>
              <span>{product.requirementsAr}</span>
            </div>
          </div>
        </div>

        {/* SECTION: Product Specific FAQs */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-[#242933] flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600" />
            <span>أسئلة شائعة حول اشتراك {product.nameAr}:</span>
          </h3>

          <div className="space-y-2">
            {product.faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white border border-slate-200/80 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-right p-4 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-[#242933] hover:text-amber-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-amber-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION: Related Alternative AI Tools */}
        {relatedProducts.length > 0 && (
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <h3 className="text-base font-bold text-[#242933]">
              اشتراكات أخرى قد تهمك:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProducts.map((rel) => {
                const relMinPrice = Math.min(...rel.plans.map((pl) => pl.priceEGP));
                return (
                  <div
                    key={rel.id}
                    onClick={() => onSelectOtherProduct(rel.slug)}
                    className="cursor-pointer p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-slate-300 hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">
                        <ProductBrandIcon slug={rel.slug} brand={rel.brand} size="sm" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-[#242933] group-hover:text-amber-600 transition-colors">
                          {rel.nameAr}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono block" dir="ltr">{rel.name}</span>
                      </div>
                    </div>

                    <div className="text-left font-mono shrink-0">
                      <span className="text-xs font-bold text-[#242933]">
                        {formatPrice(relMinPrice, currency)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
