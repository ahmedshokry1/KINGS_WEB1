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
      className="bg-white border border-[#E8E4DC] rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200 group hover:border-[#13583D]/40 cursor-pointer text-right relative overflow-hidden"
    >
      {/* Top Row: Category Pill & Brand Icon */}
      <div className="flex items-start justify-between gap-3 mb-3">
        {/* Category Badge (Pill) */}
        <span className="inline-block text-[11px] sm:text-xs font-bold px-3 py-1 rounded-full bg-[#F4F7EE] text-[#1B6A48] border border-[#DEEADE] shrink-0">
          {getCategoryBadge()}
        </span>

        {/* Brand Icon Squircle */}
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#F8F9F7] border border-[#E8EFE6] flex items-center justify-center p-1.5 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
          <ProductBrandIcon slug={product.slug} brand={product.brand} size="sm" />
        </div>
      </div>

      {/* Middle Section: Title & Short Tagline */}
      <div className="space-y-1.5 mb-4">
        <h3 className="font-bold text-base sm:text-lg text-[#242933] group-hover:text-[#13583D] transition-colors leading-tight">
          {product.brand || product.name.split('(')[0].trim()}
        </h3>
        
        <p className="text-xs text-[#5E6676] line-clamp-2 leading-relaxed min-h-[32px]">
          {product.shortDescAr || product.nameAr}
        </p>

        {/* Starting price & plans count */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100">
          <span className="font-mono text-[#242933] font-bold">
            تبدأ من {formatPrice(minPrice, currency)}
          </span>
          <span className="text-[#1B6A48] font-medium flex items-center gap-1">
            <Layers className="w-3 h-3" />
            <span>{plansCount} باقات متاحة</span>
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
        className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-[#13583D] hover:bg-[#0E4630] active:scale-[0.98] text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>عرض المنتجات</span>
        <ArrowLeft className="w-4 h-4 opacity-80 group-hover:translate-x-[-2px] transition-transform" />
      </button>
    </div>
  );
};
