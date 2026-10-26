import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ArrowLeft, 
  Tag, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';
import { ProductBrandIcon } from './ProductBrandIcon';
import { CartItem, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: () => void;
  appliedCoupon: { code: string; discountPercent: number; discountFixedEGP: number } | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  if (!isOpen) return null;

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  // Subtotal in EGP
  const subtotalEGP = items.reduce(
    (sum, item) => sum + item.selectedPlan.priceEGP * item.quantity,
    0
  );

  // Calculate discount in EGP
  let discountEGP = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      discountEGP = (subtotalEGP * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixedEGP > 0) {
      discountEGP = Math.min(subtotalEGP, appliedCoupon.discountFixedEGP);
    }
  }

  const finalTotalEGP = Math.max(0, subtotalEGP - discountEGP);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim());
    if (success) {
      setCouponSuccess(true);
      setCouponError('');
      setTimeout(() => setCouponSuccess(false), 2000);
    } else {
      setCouponError('كود الخصم غير صحيح أو منتهي الصلاحية (جرب KINGS2025)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs">
      <div className="absolute inset-y-0 left-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-r border-[#E8E4DC] shadow-2xl flex flex-col text-[#242933]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#F5E6BD] flex items-center justify-center text-[#2C3442] border border-[#EBDCB6]">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#242933] text-base">سلة الاشتراكات</h3>
                <span className="text-xs text-slate-500">
                  {items.length === 0 ? 'السلة فارغة' : `${items.length} منتجات في السلة`}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-white">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F8F6F2] border border-[#E8E4DC] flex items-center justify-center text-slate-400">
                  <ShoppingCart className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-[#242933] text-base mb-1">سلتك فارغة حالياً</h4>
                  <p className="text-xs text-slate-500 max-w-xs">
                    تصفح باقات واشتراكات الذكاء الاصطناعي وأضف ما يناسبك.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-xs shadow-xs transition-all"
                >
                  تصفح المنتجات الآن
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC] space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                      <div className="shrink-0 mt-0.5">
                        <ProductBrandIcon slug={item.product.slug} brand={item.product.brand} size="sm" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#242933] text-xs sm:text-sm truncate">
                          {item.product.nameAr}
                        </h4>
                        <span className="text-[11px] text-slate-600 font-medium block">
                          {item.selectedPlan.durationLabel}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium block truncate">
                          ✓ {item.selectedPlan.deliveryTypeLabel}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 transition-colors shrink-0"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                    {/* Quantity Selector */}
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-full px-2 py-0.5 shadow-2xs">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-black text-slate-500 transition-colors"
                        title="إنقاص"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#242933] px-1.5 font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-black text-slate-500 transition-colors"
                        title="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-left font-mono">
                      <span className="text-sm font-bold text-[#242933]">
                        {formatPrice(item.selectedPlan.priceEGP * item.quantity, currency)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Checkout Section (Only if items exist) */}
          {items.length > 0 && (
            <div className="p-5 bg-white border-t border-[#E8E4DC] space-y-4">
              
              {/* Coupon input */}
              <div>
                {appliedCoupon ? (
                  <div className="p-2.5 rounded-xl bg-[#EEF4FC] border border-[#BED6F5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-[#204E85] font-bold">
                      <Sparkles className="w-4 h-4 text-[#3B72A8]" />
                      <span>كوبون مفعّل: {appliedCoupon.code}</span>
                      <span className="text-[#2C5282]">({appliedCoupon.discountPercent > 0 ? `${appliedCoupon.discountPercent}%` : `${appliedCoupon.discountFixedEGP} ج`})</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-xs text-rose-600 hover:underline font-semibold"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="كود الخصم (جرب KINGS2025)"
                        className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-full px-4 py-2 text-xs text-[#242933] placeholder-slate-400 uppercase tracking-wider focus:outline-none focus:border-[#2C3442]"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#F8F6F2] hover:bg-[#EFECE5] text-[#242933] border border-[#E8E4DC] rounded-full text-xs font-bold transition-all"
                    >
                      تطبيق
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 mt-1">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> تم تطبيق الخصم بنجاح!
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-mono text-[#242933] font-medium">
                    {formatPrice(subtotalEGP, currency)}
                  </span>
                </div>

                {discountEGP > 0 && (
                  <div className="flex justify-between text-[#204E85] font-bold">
                    <span>قيمة الخصم:</span>
                    <span className="font-mono">
                      -{formatPrice(discountEGP, currency)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base font-bold text-[#242933] pt-2 border-t border-slate-100">
                  <span>المجموع النهائي:</span>
                  <span className="font-mono text-[#242933] text-lg font-black">
                    {formatPrice(finalTotalEGP, currency)}
                  </span>
                </div>
              </div>

              {/* Trust note */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-[#3B72A8]" />
                <span>ضمان كامل المدة وتفعيل فوري</span>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-sm shadow-xs transition-all hover:scale-[1.01]"
              >
                <span>متابعة لإتمام الطلب والدفع</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
