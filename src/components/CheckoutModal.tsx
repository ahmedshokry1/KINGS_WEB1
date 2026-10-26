import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Copy, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Coins, 
  ArrowLeft, 
  Sparkles,
  Phone,
  Mail,
  User,
  Clock,
  Info,
  Ban,
  Wallet,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CurrencyCode, Order, PaymentMethodConfig, CustomerUser } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  totalEGP: number;
  onOrderPlaced: (newOrder: Order) => void;
  paymentMethods?: PaymentMethodConfig[];
  customers?: CustomerUser[];
  onUseWalletBalance?: (customerId: string, amount: number) => void;
  currentCustomer?: CustomerUser | null;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  totalEGP,
  onOrderPlaced,
  paymentMethods = [],
  customers = [],
  onUseWalletBalance,
  currentCustomer,
}) => {
  if (!isOpen) return null;

  // Active payment methods
  const activeMethods = paymentMethods.length > 0
    ? paymentMethods.filter((pm) => pm.isEnabled)
    : [];

  // Default to first active method or 'instapay'
  const defaultMethodKey = activeMethods.length > 0 ? activeMethods[0].key : 'instapay';

  // Form states
  const [customerName, setCustomerName] = useState(currentCustomer?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentCustomer?.email || '');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState<string>(defaultMethodKey);
  const [paymentReference, setPaymentReference] = useState('');
  const [notes, setNotes] = useState('');
  
  // Validation & Loading
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Match customer by email, phone, or direct ID typed in email field
  const matchedCustomer = customers.find((c) => {
    const emailClean = customerEmail.trim().toLowerCase();
    const phoneClean = customerPhone.trim();
    if (emailClean && (c.email.toLowerCase() === emailClean || c.id.toLowerCase() === emailClean)) return true;
    if (phoneClean && c.phone === phoneClean) return true;
    return false;
  });

  const isBannedCustomer = !!matchedCustomer && (matchedCustomer.isBanned || matchedCustomer.canPurchase === false);
  const hasWalletBalance = !!matchedCustomer && (matchedCustomer.walletBalanceEGP || 0) > 0;
  const canPayFullWithWallet = hasWalletBalance && (matchedCustomer?.walletBalanceEGP || 0) >= totalEGP;

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (isBannedCustomer) {
      errs.banned = matchedCustomer?.banReason || 'عذراً، هذا الحساب محظور من إتمام الطلبات';
      setErrors(errs);
      return false;
    }

    if (!customerName.trim()) {
      errs.customerName = 'يرجى كتابة اسمك الكريم';
    }
    if (!customerEmail.trim() || !customerEmail.includes('@')) {
      errs.customerEmail = 'يرجى إدخال بريد إلكتروني صالح لاستلام التفعيل';
    }
    if (!customerPhone.trim() || customerPhone.length < 8) {
      errs.customerPhone = 'يرجى إدخال رقم هاتف / واتساب صالح لتسليم تفاصيل الحساب';
    }
    if (paymentMethod !== 'wallet' && !paymentReference.trim()) {
      errs.paymentReference = 'يرجى كتابة اسم المحول أو الرقم المرجعي لعملية التحويل';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#ffffff'],
        });
      } catch (err) {
        // ignore if canvas unavailable
      }

      // If paid via wallet, deduct balance
      if (paymentMethod === 'wallet' && matchedCustomer && onUseWalletBalance) {
        onUseWalletBalance(matchedCustomer.id, Math.min(totalEGP, matchedCustomer.walletBalanceEGP));
      }

      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const orderNumber = `KS-${randomNum}`;

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        items: items.map((it) => ({
          productId: it.productId,
          productName: it.product.nameAr,
          planLabel: it.selectedPlan.durationLabel,
          deliveryType: it.selectedPlan.deliveryType,
          priceEGP: it.selectedPlan.priceEGP,
          pricePaid: it.selectedPlan.priceEGP * it.quantity,
          currency: 'EGP',
          quantity: it.quantity,
        })),
        totalEGP,
        totalPaid: totalEGP,
        currency,
        paymentMethod: paymentMethod === 'wallet' ? 'wallet' : paymentMethod,
        paymentReference: paymentMethod === 'wallet' 
          ? `خصم فوري من رصيد المحفظة (${matchedCustomer?.id || 'المحفظة'})`
          : paymentReference.trim(),
        status: paymentMethod === 'wallet' ? 'completed' : 'verifying_payment',
        activationNotes: paymentMethod === 'wallet'
          ? 'تم الدفع بالكامل من رصيد المحفظة وتأكيد الطلب فورياً'
          : 'تم تسجيل الطلب وجاري التحقق من التحويل وتجهيز التفعيل الفوري',
      };

      onOrderPlaced(newOrder);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white border border-[#E8E4DC] rounded-2xl shadow-xl overflow-hidden my-auto text-[#242933]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#E8E4DC] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F5E6BD] flex items-center justify-center text-[#2C3442] border border-[#EBDCB6]">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#242933]">
                إتمام الطلب
              </h3>
              <p className="text-xs text-slate-500">
                أدخل بيانات الاستلام واختر طريقة الدفع المناسبة
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Order Summary Strip */}
          <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex -space-x-2 space-x-reverse shrink-0">
                {items.slice(0, 3).map((it) => (
                  <div key={it.id} className="border-2 border-white rounded-xl shadow-2xs">
                    <ProductBrandIcon slug={it.product.slug} brand={it.product.brand} size="sm" />
                  </div>
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[11px] text-slate-500 block">الاشتراكات ({items.length}):</span>
                <span className="text-xs font-bold text-[#242933] truncate block">
                  {items.map((i) => i.product.nameAr).join(' + ')}
                </span>
              </div>
            </div>
            <div className="text-left shrink-0">
              <span className="text-[11px] text-slate-500 block">المبلغ المطلوب:</span>
              <span className="text-base sm:text-lg font-black text-[#242933] font-mono">
                {formatPrice(totalEGP, currency)}
              </span>
            </div>
          </div>

          {/* Section 1: Customer Contact info */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#242933] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-500" />
              <span>1. بيانات استلام التفعيل</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  الاسم بالكامل <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: أحمد علي"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#242933] placeholder-slate-400 focus:outline-none focus:border-[#2C3442]"
                  />
                </div>
                {errors.customerName && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رقم الواتساب <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#242933] placeholder-slate-400 focus:outline-none focus:border-[#2C3442]"
                    dir="ltr"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                </div>
                {errors.customerPhone && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.customerPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني المراد التفعيل عليه <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#242933] placeholder-slate-400 focus:outline-none focus:border-[#2C3442]"
                  dir="ltr"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
              {errors.customerEmail && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.customerEmail}</p>
              )}
            </div>

            {/* Banned Customer Alert Banner */}
            {isBannedCustomer && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                <Ban className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-sm block">عذراً، هذا الحساب محظور من إتمام الطلبات</span>
                  <p className="mt-0.5 text-xs text-rose-700">
                    {matchedCustomer?.banReason || 'تم إيقاف هذا الحساب نظراً لمخالفة شروط الاستخدام.'}
                  </p>
                </div>
              </div>
            )}

            {/* Wallet Available Banner */}
            {!isBannedCustomer && hasWalletBalance && (
              <div className="p-3 rounded-xl bg-[#F7EED8] border border-[#EBDCB6] text-xs flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#5A4518] shrink-0" />
                  <div>
                    <span className="font-bold text-[#242933] block">رصيد محفظتك المتاح:</span>
                    <span className="text-[#5A4518] font-mono font-bold text-xs">
                      {formatPrice(matchedCustomer?.walletBalanceEGP || 0, currency)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('wallet');
                    setPaymentReference(`خصم من رصيد المحفظة (${matchedCustomer?.id})`);
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#2C3442] text-white'
                      : 'bg-[#F5E6BD] text-[#2C3442] hover:bg-[#ebdcb6] border border-[#EBDCB6]'
                  }`}
                >
                  {paymentMethod === 'wallet' ? 'تم اختيار المحفظة ✓' : 'الدفع من المحفظة'}
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#242933] uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span>2. وسيلة الدفع</span>
              </h4>
              <span className="text-xs text-slate-500">
                {activeMethods.length} خيارات متاحة
              </span>
            </div>

            {/* Payment method selector pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {hasWalletBalance && !isBannedCustomer && (
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod('wallet');
                    setPaymentReference(`خصم من رصيد المحفظة (${matchedCustomer?.id})`);
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    paymentMethod === 'wallet'
                      ? 'bg-[#EEF4FC] border-[#BED6F5] text-[#204E85] font-bold'
                      : 'bg-[#F8F6F2] border-[#E8E4DC] text-[#242933] hover:border-slate-300'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto mb-1 text-[#204E85]" />
                  <span className="text-xs block truncate font-bold">المحفظة</span>
                  <span className="text-[10px] text-slate-500 block truncate font-mono">
                    {matchedCustomer?.walletBalanceEGP} ج.م
                  </span>
                </button>
              )}

              {activeMethods.map((pm) => {
                const isSelected = paymentMethod === pm.key;
                const getIcon = () => {
                  switch (pm.iconType) {
                    case 'smartphone':
                      return <Smartphone className="w-5 h-5 mx-auto mb-1 text-slate-700" />;
                    case 'card':
                      return <CreditCard className="w-5 h-5 mx-auto mb-1 text-slate-700" />;
                    case 'coins':
                      return <Coins className="w-5 h-5 mx-auto mb-1 text-slate-700" />;
                    case 'building':
                    default:
                      return <Building2 className="w-5 h-5 mx-auto mb-1 text-slate-700" />;
                  }
                };

                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.key)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#EEF4FC] border-[#BED6F5] text-[#204E85] font-bold shadow-2xs'
                        : 'bg-[#F8F6F2] border-[#E8E4DC] text-[#242933] hover:border-slate-300'
                    }`}
                  >
                    {getIcon()}
                    <span className="text-xs block truncate">{pm.nameAr}</span>
                    <span className="text-[10px] text-slate-500 font-normal block truncate">
                      {pm.badge || pm.subtitleAr}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Payment Method Details Box */}
            {paymentMethod === 'wallet' ? (
              <div className="p-3.5 rounded-xl bg-[#F7EED8] border border-[#EBDCB6] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-[#242933]">
                  <span>الدفع المباشر من رصيد المحفظة</span>
                  <span className="font-mono text-[#5A4518]">
                    خصم {formatPrice(totalEGP, currency)}
                  </span>
                </div>
                <p className="text-slate-600">
                  سيتم خصم قيمة الاشتراك وتأكيد الطلب فوراً.
                </p>
              </div>
            ) : (() => {
              const currentPm = activeMethods.find((m) => m.key === paymentMethod) || activeMethods[0];
              if (!currentPm) return null;

              return (
                <div className="p-3.5 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#242933]">
                      بيانات التحويل ({currentPm.nameAr}):
                    </span>
                    {currentPm.accountIdentifier && currentPm.iconType !== 'card' && (
                      <button
                        type="button"
                        onClick={() => handleCopy(currentPm.accountIdentifier, currentPm.key)}
                        className="text-xs text-[#204E85] hover:underline flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedField === currentPm.key ? 'تم النسخ!' : 'نسخ'}</span>
                      </button>
                    )}
                  </div>

                  {currentPm.iconType !== 'card' ? (
                    <div className="p-2.5 rounded-lg bg-white border border-[#E8E4DC] font-mono font-bold text-[#242933] text-center tracking-wider text-sm select-all">
                      {currentPm.accountIdentifier}
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      <input
                        type="text"
                        placeholder="رقم البطاقة (16 رقم)"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#242933] font-mono text-center"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#242933] font-mono text-center"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#242933] font-mono text-center"
                        />
                      </div>
                    </div>
                  )}

                  {currentPm.accountHolderName && (
                    <div className="text-xs text-slate-600 flex items-center gap-1.5">
                      <span>المستلم:</span>
                      <span className="font-bold text-[#242933]">{currentPm.accountHolderName}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-500">
                    {currentPm.instructionsAr} حوّل مبلغ <strong className="text-[#242933] font-mono">{formatPrice(totalEGP, currency)}</strong>.
                  </p>
                </div>
              );
            })()}

            {/* Reference Number / Transfer Proof */}
            {paymentMethod !== 'wallet' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  اسم صاحب التحويل أو رقم العملية <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="مثال: تحويل باسم أحمد علي"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs sm:text-sm text-[#242933] placeholder-slate-400 focus:outline-none focus:border-[#2C3442]"
                />
                {errors.paymentReference && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.paymentReference}</p>
                )}
              </div>
            )}

            {/* Customer Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                ملاحظات (اختياري)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="أي ملاحظة تود إضافتها للطلب..."
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-[#242933] placeholder-slate-400 focus:outline-none focus:border-[#2C3442]"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting || isBannedCustomer}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-full font-bold text-sm shadow-xs transition-all ${
              isBannedCustomer
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#3B72A8] hover:bg-[#305E8C] text-white active:scale-[0.99] disabled:opacity-50'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 animate-spin" />
                جاري إرسال الطلب...
              </span>
            ) : isBannedCustomer ? (
              <span>الحساب محظور 🚫</span>
            ) : paymentMethod === 'wallet' ? (
              <>
                <Wallet className="w-4 h-4" />
                <span>تأكيد الدفع من المحفظة</span>
              </>
            ) : (
              <>
                <span>تأكيد الطلب الآن</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
