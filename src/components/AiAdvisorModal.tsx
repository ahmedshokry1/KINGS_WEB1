import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  Code, 
  Palette, 
  Video, 
  BookOpen, 
  Briefcase, 
  ArrowLeft, 
  Check, 
  Zap, 
  Crown, 
  Tag
} from 'lucide-react';
import { SubscriptionProduct, PlanVariant, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: SubscriptionProduct[];
  currency: CurrencyCode;
  onAddToCart: (product: SubscriptionProduct, plan: PlanVariant) => void;
  onBuyNow: (product: SubscriptionProduct, plan: PlanVariant) => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  products,
  currency,
  onAddToCart,
  onBuyNow,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<number>(1);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedBudget, setSelectedBudget] = useState<string>('');

  const fields = [
    { id: 'coding', label: 'البرمجة وتطوير التطبيقات', icon: Code, desc: 'كتابة الأكواد، تصحيح الأخطاء، وبناء المشاريع' },
    { id: 'design', label: 'التصميم الجرافيكي والميديا', icon: Palette, desc: 'السوشيال ميديا، الشعارات، وتوليد الصور' },
    { id: 'content', label: 'صناعة المحتوى والمونتاج', icon: Video, desc: 'يوتيوب، تيك توك، ريلز، والتعليق الصوتي' },
    { id: 'research', label: 'الدراسة والبحث الأكاديمي', icon: BookOpen, desc: 'الجامعات، رسائل الماجستير وتلخيص الـ PDF' },
    { id: 'business', label: 'الأعمال والتسويق والإدارة', icon: Briefcase, desc: 'الإيميلات، دراسات الجدوى والتحليلات' },
  ];

  // Logic to determine recommended product based on answers
  const getRecommendation = () => {
    if (selectedField === 'coding') {
      if (selectedBudget === 'vip') {
        const bundle = products.find((p) => p.id === 'prod-dev-bundle');
        if (bundle) return { product: bundle, reason: 'باقة المطورين الشاملة توفر لك Cursor Pro + Claude 3.7 + ChatGPT Plus دفعة واحدة مع توفير 40%!' };
      }
      const cursor = products.find((p) => p.id === 'prod-cursor-pro');
      if (cursor) return { product: cursor, reason: 'Cursor Pro هو محرر الأكواد رقم 1 عالمياً لسرعة إنجاز مشاريعك البرمجية.' };
      const claude = products.find((p) => p.id === 'prod-claude-pro');
      return { product: claude || products[0], reason: 'Claude 3.7 Sonnet هو النموذج الأكثر ذكاءً في البرمجة المعقدة.' };
    }

    if (selectedField === 'design') {
      if (selectedBudget === 'budget') {
        const canva = products.find((p) => p.id === 'prod-canva-pro');
        return { product: canva || products[0], reason: 'Canva Pro لمدة 3 سنوات بـ 150 ج.م فقط هو الخيار الأوفر والأقوى لجميع تصاميمك اليومية.' };
      }
      const mj = products.find((p) => p.id === 'prod-midjourney-pro');
      return { product: mj || products[0], reason: 'Midjourney v6.1 يمنحك جودة صور وتصاميم سينمائية خرافية لا تقارن.' };
    }

    if (selectedField === 'content') {
      if (selectedBudget === 'vip') {
        const creatorBundle = products.find((p) => p.id === 'prod-creator-bundle');
        if (creatorBundle) return { product: creatorBundle, reason: 'باقة صانع المحتوى المتكاملة تجمع كانفا 3 سنوات وميدجورني وكاب كات برو.' };
      }
      const capcut = products.find((p) => p.id === 'prod-capcut-pro');
      return { product: capcut || products[0], reason: 'CapCut Pro للمونتاج بدون علامة مائية مع ترجمة ذكية وفلاتر فيروسية.' };
    }

    if (selectedField === 'research') {
      const pplx = products.find((p) => p.id === 'prod-perplexity-pro');
      if (pplx) return { product: pplx, reason: 'Perplexity Pro هو محرك البحث الأكاديمي المعتمد مع توثيق المصادر وتلخيص الـ PDF.' };
      const gemini = products.find((p) => p.id === 'prod-gemini-adv');
      return { product: gemini || products[0], reason: 'Gemini Pro مع 2TB مساحة سحابية وتكامل كامل مع مستندات جوجل.' };
    }

    // Default: Gemini or ChatGPT
    const gemini = products.find((p) => p.id === 'prod-gemini-adv');
    return { product: gemini || products[0], reason: 'عرض Google AI Gemini Pro (18 شهر بـ 150 ج.م) هو أقوى صفقة ذكاء اصطناعي حالياً.' };
  };

  const recommendation = getRecommendation();
  const recPlan = recommendation.product.plans.find((p) => p.isPopular) || recommendation.product.plans[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-950/60 via-slate-900 to-amber-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                مستشار كينجز ستور الذكي
              </h3>
              <p className="text-xs text-slate-400">
                أجب على 3 أسئلة سريعة لنرشح لك أنسب اشتراك مع كوبون خصم خاص
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Step 1: Field */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>السؤال 1 من 3</span>
                <span className="text-amber-400 font-bold">مجال تخصصك</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                ما هو مجالك أو استخدامك الرئيسي لأدوات الذكاء الاصطناعي؟
              </h4>

              <div className="space-y-2">
                {fields.map((f) => {
                  const Icon = f.icon;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelectedField(f.id);
                        setStep(2);
                      }}
                      className="w-full text-right p-3.5 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/50 flex items-center gap-3.5 transition-all group"
                    >
                      <div className="p-2.5 rounded-xl bg-slate-900 text-amber-400 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <span className="font-bold text-xs sm:text-sm text-white block">
                          {f.label}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {f.desc}
                        </span>
                      </div>
                      <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>السؤال 2 من 3</span>
                <span className="text-amber-400 font-bold">الميزانية التقديرية</span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-white mb-3">
                ما هي ميزانيتك التقديرية للاشتراك؟
              </h4>

              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    setSelectedBudget('budget');
                    setStep(3);
                  }}
                  className="w-full text-right p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/50 transition-all"
                >
                  <span className="font-bold text-sm text-white block">
                    اقتصادية وتوفيرية (في حدود 120 - 150 جنيه)
                  </span>
                  <span className="text-xs text-emerald-400 mt-1 block">
                    مثل: كانفا برو 3 سنوات أو جيميناي 18 شهر بـ 150 ج
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBudget('mid');
                    setStep(3);
                  }}
                  className="w-full text-right p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/50 transition-all"
                >
                  <span className="font-bold text-sm text-white block">
                    متوسطة احترافية (في حدود 300 - 450 جنيه)
                  </span>
                  <span className="text-xs text-cyan-400 mt-1 block">
                    مثل: حسابات خاصة كاملة لـ ChatGPT Plus أو Cursor Pro أو Claude Pro
                  </span>
                </button>

                <button
                  onClick={() => {
                    setSelectedBudget('vip');
                    setStep(3);
                  }}
                  className="w-full text-right p-4 rounded-2xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/70 hover:border-amber-400/50 transition-all"
                >
                  <span className="font-bold text-sm text-white block">
                    باقات شاملة مجمعة VIP (أوفر قيمة مقابل المال)
                  </span>
                  <span className="text-xs text-amber-400 mt-1 block">
                    مثل: باقة المطورين الشاملة أو باقة المصممين وصناع المحتوى
                  </span>
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-400 hover:text-white mt-2"
              >
                ← العودة للسؤال السابق
              </button>
            </div>
          )}

          {/* Step 3: Recommendation Result */}
          {step === 3 && (
            <div className="space-y-5 text-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                <Crown className="w-4 h-4" />
                <span>الترشيح الأنسب لك بنسبة تطابق 99%</span>
              </div>

              {/* Recommended Product Box */}
              <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-800/80 to-slate-950 border border-amber-500/40 text-right space-y-3 shadow-xl shadow-amber-500/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                      <ProductBrandIcon slug={recommendation.product.slug} brand={recommendation.product.brand} size="md" />
                    </div>
                    <div>
                      <span className="text-xs text-amber-400 font-bold block">
                        {recommendation.product.brand}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white">
                        {recommendation.product.nameAr}
                      </h3>
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {formatPrice(recPlan.priceEGP, currency)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{recPlan.durationLabel}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  💡 <strong className="text-white">لماذا نرشح لك هذا الاشتراك:</strong> {recommendation.reason}
                </div>

                <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>تفعيل فوري + ضمان كامل المدة من كينجز ستور</span>
                </div>
              </div>

              {/* Special Gift Coupon */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-dashed border-amber-500/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Tag className="w-4 h-4" />
                  <span>هدية إضافية: كود الخصم الفوري KINGS2025</span>
                </div>
                <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black text-[11px]">
                  خصم 15%
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(recommendation.product, recPlan);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm border border-slate-700 transition-all"
                >
                  إضافة للسلة
                </button>

                <button
                  onClick={() => {
                    onBuyNow(recommendation.product, recPlan);
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all"
                >
                  شراء الباقة الآن
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs text-slate-500 hover:text-slate-300 block mx-auto"
              >
                إعادة الاختبار من البداية
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
