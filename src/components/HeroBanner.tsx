import React from 'react';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Bot,
  Palette,
  Code
} from 'lucide-react';
import { CurrencyCode, StoreSiteSettings } from '../types/store';

interface HeroBannerProps {
  onSelectCategory: (cat: string) => void;
  onOpenAdvisor: () => void;
  currency: CurrencyCode;
  siteSettings?: StoreSiteSettings;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenAdvisor,
  siteSettings,
}) => {
  return (
    <section className="relative bg-[#F8F6F2] border-b border-[#E8E4DC] py-10 sm:py-16 overflow-hidden">
      {/* Subtle calm ambient background decoration */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-[#F7EED8]/60 via-[#EEF4FC]/40 to-transparent blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          
          {/* Calm Status Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EEF4FC] border border-[#D5E4F7] rounded-full text-[#2C5282] text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#3B72A8] animate-pulse" />
            <span>{siteSettings?.heroBadgeText || 'كينجز ستور · اشتراكات الذكاء الاصطناعي الأصلية'}</span>
          </div>

          {/* Calm, concise headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#242933] tracking-tight leading-tight sm:leading-snug">
            {siteSettings?.heroTitleLeading || 'أدوات الذكاء الاصطناعي والتصميم'}{' '}
            <span className="text-[#3B72A8] underline decoration-[#BED6F5] underline-offset-4">
              {siteSettings?.heroTitleHighlight || 'الأصلية'}
            </span>{' '}
            {siteSettings?.heroTitleTrailing || 'بأفضل سعر'}
          </h1>

          {/* Short, tranquil subtitle */}
          <p className="text-[#5E6676] text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            {siteSettings?.heroSubtitle || 'تفعيل رسمي مباشر على حسابك الشخصي مع ضمان كامل المدة ودعم فني متواصل عبر الواتساب.'}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#catalog-section"
              className="px-6 py-3 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-sm shadow-xs hover:shadow transition-all flex items-center gap-2 active:scale-98"
            >
              <span>تصفح الأدوات والعروض</span>
              <ArrowLeft className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenAdvisor}
              type="button"
              className="px-5 py-3 rounded-full bg-white hover:bg-[#F2EFE8] text-[#242933] font-semibold text-sm transition-all flex items-center gap-2 border border-[#E8E4DC] active:scale-98 shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-[#3B72A8]" />
              <span>مستشار الاختيار الذكي</span>
            </button>
          </div>

          {/* Quick Quiet Guarantees - 3 clean text points with dots */}
          <div className="pt-6 border-t border-[#E8E4DC]/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-[#5E6676]">
            <div className="flex items-center gap-1.5 font-medium text-[#242933]">
              <Zap className="w-3.5 h-3.5 text-amber-600" />
              <span>تفعيل سريع خلال 15 دقيقة</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 font-medium text-[#242933]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>ضمان استبدال كامل المدة</span>
            </div>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 font-medium text-[#242933]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#3B72A8]" />
              <span>تفعيل على إيميلك الشخصي</span>
            </div>
          </div>

          {/* Quick Category shortcuts */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#8E97A7] font-medium ml-1">الأكثر طلباً:</span>
            {[
              { label: 'ChatGPT Plus', cat: 'ai-chat' },
              { label: 'Claude 3.7 Pro', cat: 'ai-chat' },
              { label: 'Canva Pro', cat: 'design' },
              { label: 'Midjourney', cat: 'design' },
              { label: 'Cursor Pro', cat: 'coding' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onSelectCategory(item.cat)}
                type="button"
                className="px-3 py-1 rounded-full bg-white hover:bg-[#F2EFE8] text-[#5E6676] text-xs border border-[#E8E4DC] transition-colors shadow-2xs"
              >
                {item.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
