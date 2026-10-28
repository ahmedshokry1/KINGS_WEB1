import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Package, 
  AlertCircle, 
  MessageCircle,
} from 'lucide-react';
import { Order, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialOrderNumber?: string;
  currency: CurrencyCode;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialOrderNumber = '',
  currency,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [searched, setSearched] = useState(Boolean(initialOrderNumber));

  const foundOrder = orders.find(
    (o) =>
      o.orderNumber.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.customerEmail.toLowerCase() === searchQuery.trim().toLowerCase() ||
      o.customerPhone.includes(searchQuery.trim())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
  };

  const getStatusStep = (status: Order['status']) => {
    switch (status) {
      case 'pending_payment': return 1;
      case 'verifying_payment': return 2;
      case 'activating': return 3;
      case 'completed': return 4;
      default: return 2;
    }
  };

  const currentStep = foundOrder ? getStatusStep(foundOrder.status) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto font-['Cairo',sans-serif]">
      <div 
        className="relative w-full max-w-2xl bg-[#F8F6F2] border border-[#E8E4DC] rounded-3xl shadow-2xl overflow-hidden my-auto text-[#242933]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] text-[#13583D] border border-[#CDE3D4] flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#242933]">
                متابعة وتتبع حالة طلب الاشتراك
              </h3>
              <p className="text-xs text-[#5A6272]">
                أدخل رقم طلبك أو بريدك الإلكتروني لمعرفة حالة التفعيل
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#5A6272] hover:text-[#242933] rounded-xl hover:bg-[#F0ECE4] transition-colors"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="p-5 sm:p-6 border-b border-[#E8E4DC] bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم طلبك (مثال: KS-1024) أو بريدك..."
                className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#242933] placeholder-[#8E97A7] focus:outline-none focus:border-[#13583D]"
              />
              <Search className="w-4 h-4 text-[#8E97A7] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-xs sm:text-sm transition-all shadow-xs"
            >
              بحث
            </button>
          </form>
        </div>

        {/* Search Results */}
        <div className="p-5 sm:p-6 max-h-[60vh] overflow-y-auto space-y-5">
          {searched && !foundOrder ? (
            <div className="text-center py-8 p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
              <h4 className="text-[#242933] font-bold text-base">لم نتمكن من العثور على هذا الطلب</h4>
              <p className="text-xs text-[#5A6272] max-w-sm mx-auto">
                يرجى التأكد من كتابة رقم الطلب كما وصلك في رسالة التأكيد أو التواصل مع خدمة العملاء للمساعدة الفورية.
              </p>
            </div>
          ) : foundOrder ? (
            <div className="space-y-5">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="text-xs text-[#5A6272] block">رقم الطلب:</span>
                  <span className="text-lg font-bold text-[#13583D] font-mono">
                    {foundOrder.orderNumber}
                  </span>
                  <span className="text-[11px] text-[#5A6272] block mt-0.5">
                    العميل: {foundOrder.customerName} ({foundOrder.customerEmail})
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-xs text-[#5A6272] block">الحالة الحالية:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${
                    foundOrder.status === 'completed'
                      ? 'bg-[#EAF2EC] text-[#13583D] border-[#CDE3D4]'
                      : foundOrder.status === 'activating'
                      ? 'bg-[#EEF4FC] text-[#204E85] border-[#BED6F5]'
                      : 'bg-[#FEF7EC] text-[#9A6216] border-[#FBD9A5]'
                  }`}>
                    {foundOrder.status === 'completed' && '✓ تم التفعيل والتسليم بنجاح'}
                    {foundOrder.status === 'activating' && '⚡ جاري التفعيل والإرسال'}
                    {foundOrder.status === 'verifying_payment' && '⏳ قيد تأكيد الدفع'}
                    {foundOrder.status === 'pending_payment' && 'بانتظار التحويل'}
                  </span>
                </div>
              </div>

              {/* Progress Steps Tracker */}
              <div className="p-4 rounded-2xl bg-white border border-[#E8E4DC] shadow-xs">
                <h4 className="text-xs font-bold text-[#242933] mb-4">مسار تنفيذ وتفعيل الطلب:</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  
                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 1 ? 'bg-[#13583D] text-white' : 'bg-[#EFECE5] text-[#8E97A7]'
                    }`}>
                      1
                    </div>
                    <span className={currentStep >= 1 ? 'text-[#242933] font-bold' : 'text-[#8E97A7]'}>
                      استلام الطلب
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 2 ? 'bg-[#13583D] text-white' : 'bg-[#EFECE5] text-[#8E97A7]'
                    }`}>
                      2
                    </div>
                    <span className={currentStep >= 2 ? 'text-[#242933] font-bold' : 'text-[#8E97A7]'}>
                      تأكيد التحويل
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 3 ? 'bg-[#13583D] text-white' : 'bg-[#EFECE5] text-[#8E97A7]'
                    }`}>
                      3
                    </div>
                    <span className={currentStep >= 3 ? 'text-[#242933] font-bold' : 'text-[#8E97A7]'}>
                      إرسال التفعيل
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 4 ? 'bg-[#13583D] text-white' : 'bg-[#EFECE5] text-[#8E97A7]'
                    }`}>
                      ✓
                    </div>
                    <span className={currentStep >= 4 ? 'text-[#13583D] font-bold' : 'text-[#8E97A7]'}>
                      حساب مفعل
                    </span>
                  </div>

                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#5A6272]">الاشتراكات المشمولة في هذا الطلب:</h4>
                {foundOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white border border-[#E8E4DC] flex items-center justify-between gap-3 shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">
                        <ProductBrandIcon slug={item.productId} brand={item.productName} size="sm" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-[#242933] block">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-[#13583D] font-medium">
                          {item.planLabel} (الكمية: {item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-[#242933] shrink-0">
                      {formatPrice(item.pricePaid, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Activation details or notes */}
              {foundOrder.activationNotes && (
                <div className="p-3.5 rounded-xl bg-[#EEF4FC] border border-[#BED6F5] text-xs text-[#204E85] space-y-1">
                  <span className="font-bold block">ملاحظات التفعيل الحالية:</span>
                  <p>{foundOrder.activationNotes}</p>
                </div>
              )}

              {/* Direct WhatsApp Contact Button for this order */}
              <a
                href={`https://wa.me/201099887766?text=${encodeURIComponent(
                  `مرحباً كينجز ستور، أستفسر عن طلبي رقم ${foundOrder.orderNumber}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#EAF2EC] hover:bg-[#DCEEE0] text-[#13583D] font-bold text-xs border border-[#CDE3D4] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل مع الدعم الفني بخصوص هذا الطلب</span>
              </a>

            </div>
          ) : (
            <div className="text-center py-8 p-6 rounded-2xl bg-white border border-[#E8E4DC] text-[#5A6272] text-xs">
              أدخل رقم الطلب في الأعلى لعرض تفاصيل وحالة التفعيل.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
