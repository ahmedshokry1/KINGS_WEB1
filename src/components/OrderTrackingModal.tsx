import React, { useState } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Package, 
  ShieldCheck, 
  MessageCircle,
  ExternalLink,
  Crown
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                متابعة وتتبع حالة طلب الاشتراك
              </h3>
              <p className="text-xs text-slate-400">
                أدخل رقم طلبك أو بريدك الإلكتروني لمعرفة حالة التفعيل
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

        {/* Search bar */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-900/60">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="أدخل رقم الطلب (مثلاً KS-8492) أو بريدك..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all"
            >
              بحث
            </button>
          </form>

          {/* Quick Demo order pills for easy testing */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-400">
            <span>طلبات للتجربة السريعة:</span>
            {orders.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setSearchQuery(o.orderNumber);
                  setSearched(true);
                }}
                className="font-mono text-amber-400 hover:text-amber-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700"
              >
                {o.orderNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
          {searched && !foundOrder ? (
            <div className="text-center py-8 space-y-3">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <h4 className="text-white font-bold text-base">لم نتمكن من العثور على هذا الطلب</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                يرجى التأكد من كتابة رقم الطلب بصورة صحيحة مثل (KS-8492) أو التواصل مع خدمة العملاء للمساعدة الفورية.
              </p>
            </div>
          ) : foundOrder ? (
            <div className="space-y-6">
              
              {/* Order Status Banner */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block">رقم الطلب:</span>
                  <span className="text-lg font-black text-amber-400 font-mono">
                    {foundOrder.orderNumber}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    العميل: {foundOrder.customerName} ({foundOrder.customerEmail})
                  </span>
                </div>

                <div className="text-left">
                  <span className="text-xs text-slate-400 block">الحالة الحالية:</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    foundOrder.status === 'completed'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : foundOrder.status === 'activating'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {foundOrder.status === 'completed' && '✓ تم التفعيل والتسليم بنجاح'}
                    {foundOrder.status === 'activating' && '⚡ جاري التفعيل والإرسال'}
                    {foundOrder.status === 'verifying_payment' && '⏳ قيد تأكيد الدفع'}
                    {foundOrder.status === 'pending_payment' && 'بانتظار التحويل'}
                  </span>
                </div>
              </div>

              {/* Progress Steps Tracker */}
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 mb-4">مسار تنفيذ وتفعيل الطلب:</h4>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  
                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                    }`}>
                      1
                    </div>
                    <span className={currentStep >= 1 ? 'text-white font-semibold' : 'text-slate-500'}>
                      استلام الطلب
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                    }`}>
                      2
                    </div>
                    <span className={currentStep >= 2 ? 'text-white font-semibold' : 'text-slate-500'}>
                      تأكيد التحويل
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                    }`}>
                      3
                    </div>
                    <span className={currentStep >= 3 ? 'text-white font-semibold' : 'text-slate-500'}>
                      إرسال التفعيل
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold ${
                      currentStep >= 4 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-400'
                    }`}>
                      ✓
                    </div>
                    <span className={currentStep >= 4 ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                      حساب مفعل
                    </span>
                  </div>

                </div>
              </div>

              {/* Items in this order */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400">الاشتراكات المشمولة في هذا الطلب:</h4>
                {foundOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">
                        <ProductBrandIcon slug={item.productId} brand={item.productName} size="sm" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-white block">
                          {item.productName}
                        </span>
                        <span className="text-[11px] text-amber-400">
                          {item.planLabel} (الكمية: {item.quantity})
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-slate-300 shrink-0">
                      {formatPrice(item.pricePaid, currency)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Activation details or notes */}
              {foundOrder.activationNotes && (
                <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/50 text-xs text-blue-200 space-y-1">
                  <span className="font-bold block">ملاحظات التفعيل الحالية:</span>
                  <p>{foundOrder.activationNotes}</p>
                </div>
              )}

              {/* Direct WhatsApp Contact Button for this order */}
              <a
                href={`https://wa.me/201029384756?text=${encodeURIComponent(
                  `مرحباً كينجز ستور، أستفسر عن طلبي رقم ${foundOrder.orderNumber}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>تواصل مع الدعم الفني بخصوص هذا الطلب</span>
              </a>

            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              أدخل رقم الطلب في الأعلى لعرض تفاصيل وحالة التفعيل.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
