import React from 'react';
import { Layers, ArrowLeft } from 'lucide-react';
import { SubscriptionProduct, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface BrandToolCardProps {
  product: SubscriptionProduct;
  currency: CurrencyCode;
  onViewProducts: (product: SubscriptionProduct) => void;
}

export const BrandToolCard: React.FC<BrandToolCardProps> = ({
  product,
  currency,
  onViewProducts,
}) => {
  const minPrice = Math.min(...product.plans.map((p) => p.priceEGP));
  const plansCount = product.plans.length;

  // Category badge label in Arabic
  const getCategoryBadge = () => {
    if (product.badge) return product.badge;
    switch (product.category) {
      case 'design':
        return 'تصميم';
      case 'ai-chat':
        return 'AI';
      case 'coding':
        return 'برمجة';
      case 'video-audio':
        return 'صوت وفيديو';
      case 'research-study':
        return 'أبحاث';
      case 'productivity':
        return 'إنتاجية';
      case 'learning':
        return 'تعليم';
      case 'bundles':
        return 'باقات شاملة';
      default:
        return 'اشتراك';
    }
  };

  return (
    <div
      onClick={() => onViewProducts(product)}
      className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-lg hover:-translate-y-1 hover:border-[#13583D]/50 transition-all duration-300 ease-out group cursor-pointer text-right relative overflow-hidden active:scale-[0.99] select-none"
    >
      {/* Subtle background ambient hover glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#13583D]/5 rounded-full blur-2xl group-hover:bg-[#13583D]/10 transition-colors pointer-events-none" />

      {/* Top Row: Category Pill & Brand Icon */}
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        {/* Category Badge (Pill) */}
        <span className="inline-block text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-[#F4F7EE] text-[#1B6A48] border border-[#DEEADE] shrink-0 group-hover:bg-[#EAF2EC] group-hover:border-[#CDE3D4] transition-colors">
          {getCategoryBadge()}
        </span>

        {/* Brand Icon Squircle with 3D Pop Hover */}
        <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-[#F8F9F7] border border-[#E8EFE6] flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 group-hover:shadow-xs transition-all duration-300 shrink-0">
          <ProductBrandIcon slug={product.slug} brand={product.brand} size="md" />
        </div>
      </div>

      {/* Middle Section: Title & Short Tagline */}
      <div className="space-y-1.5 mb-4 relative z-10">
        <h3 className="font-bold text-base sm:text-lg text-[#242933] group-hover:text-[#13583D] transition-colors duration-200 leading-tight">
          {product.brand || product.name.split('(')[0].trim()}
        </h3>
        
        <p className="text-xs text-[#5E6676] line-clamp-2 leading-relaxed min-h-[32px]">
          {product.shortDescAr || product.nameAr}
        </p>

        {/* Starting price & plans count */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-[#F0ECE4]">
          <span className="font-mono text-[#242933] font-bold">
            تبدأ من {formatPrice(minPrice, currency)}
          </span>
          <span className="text-[#13583D] font-semibold flex items-center gap-1 bg-[#F4F7EE] px-2 py-0.5 rounded-full">
            <Layers className="w-3 h-3 text-[#13583D]" />
            <span>{plansCount} باقات</span>
          </span>
        </div>
      </div>

      {/* Bottom Button: عرض المنتجات */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onViewProducts(product);
        }}
        className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-[#13583D] hover:bg-[#0E442F] active:scale-[0.97] text-white font-bold text-sm shadow-xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer relative z-10 group/btn"
      >
        <span>عرض المنتجات</span>
        <ArrowLeft className="w-4 h-4 opacity-90 transform group-hover/btn:-translate-x-1 transition-transform duration-200" />
      </button>
    </div>
  );
};
