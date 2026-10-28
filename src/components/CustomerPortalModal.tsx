import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  Lock, 
  Key, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  MessageCircle, 
  Wallet,
  Ban,
  ShoppingBag
} from 'lucide-react';
import { CustomerSubscription, CurrencyCode, CustomerUser } from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';

interface CustomerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriptions: CustomerSubscription[];
  customers?: CustomerUser[];
  currency: CurrencyCode;
  onToggleAutoRenew: (subId: string, enabled: boolean) => void;
  onRenewNow: (subscription: CustomerSubscription) => void;
  onCancelSubscription: (subId: string) => void;
  onOpenProductDetail: (productSlug: string) => void;
  defaultCustomerEmail?: string;
}

export const CustomerPortalModal: React.FC<CustomerPortalModalProps> = ({
  isOpen,
  onClose,
  subscriptions = [],
  customers = [],
  currency,
  onToggleAutoRenew,
  onRenewNow,
  onCancelSubscription,
  onOpenProductDetail,
  defaultCustomerEmail = '',
}) => {
  if (!isOpen) return null;

  const [customerLookup, setCustomerLookup] = useState(defaultCustomerEmail);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired' | 'pending_renewal'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [renewNotice, setRenewNotice] = useState<string | null>(null);

  // Filter subscriptions matching the customer
  const customerSubscriptions = subscriptions.filter((sub) => {
    if (!customerLookup.trim()) return false;
    const q = customerLookup.trim().toLowerCase();
    return (
      sub.customerEmail.toLowerCase().includes(q) ||
      sub.customerPhone.includes(q) ||
      sub.customerName.toLowerCase().includes(q) ||
      (sub.subscriptionCode ? sub.subscriptionCode.toLowerCase().includes(q) : false)
    );
  });

  const filteredSubscriptions = customerSubscriptions.filter((sub) => {
    if (activeTab === 'all') return true;
    return sub.status === activeTab;
  });

  // Matched customer profile from customers database
  const matchedCustomer = customerLookup.trim() ? customers.find((c) => {
    const q = customerLookup.trim().toLowerCase();
    return (
      c.id.toLowerCase() === q ||
      c.email.toLowerCase() === q ||
      (c.phone && c.phone.includes(q)) ||
      c.name.toLowerCase().includes(q)
    );
  }) : null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const calculateDaysRemaining = (expiryDateStr: string) => {
    const expiry = new Date(expiryDateStr).getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleToggleAutoRenewClick = (sub: CustomerSubscription) => {
    const newState = !sub.autoRenew;
    onToggleAutoRenew(sub.id, newState);
    setRenewNotice(
      newState
        ? `تم تفعيل التجديد التلقائي لاشتراك ${sub.productName} بنجاح`
        : `تم إيقاف التجديد التلقائي لاشتراك ${sub.productName}`
    );
    setTimeout(() => setRenewNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#F8F6F2] border border-[#E8E4DC] rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh] font-['Cairo',sans-serif] text-[#242933]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-white border-b border-[#E8E4DC] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF2EC] border border-[#CDE3D4] flex items-center justify-center text-[#13583D]">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-[#242933]">
                  بوابة العميل وإدارة الاشتراكات
                </h3>
                <span className="text-[11px] bg-[#EAF2EC] text-[#13583D] font-bold px-2.5 py-0.5 rounded-full border border-[#CDE3D4]">
                  حسابي
                </span>
              </div>
              <p className="text-xs text-[#5A6272] mt-0.5">
                تتبع حالة التراخيص والبيانات والتجديد التلقائي لاشتراكاتك
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

        {/* Customer Search & Account Status Bar */}
        <div className="p-4 sm:p-5 bg-white border-b border-[#E8E4DC] space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={customerLookup}
                onChange={(e) => setCustomerLookup(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك لعرض اشتراكاتك..."
                className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#242933] placeholder-[#8E97A7] focus:outline-none focus:border-[#13583D]"
              />
              <Search className="w-4 h-4 text-[#8E97A7] absolute right-3.5 top-3.5 pointer-events-none" />
            </div>
          </div>

          {/* Customer ID & Wallet Balance Card */}
          {matchedCustomer && (
            <div className="p-3.5 rounded-2xl bg-[#F8F6F2] border border-[#E8E4DC] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[#5A6272] font-semibold">معرّف حسابك:</span>
                <span className="font-mono text-[#204E85] font-bold bg-[#EEF4FC] px-2.5 py-1 rounded-lg border border-[#BED6F5] flex items-center gap-1.5">
                  <span>{matchedCustomer.id}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(matchedCustomer.id, 'cust-id-portal')}
                    className="text-[#5A6272] hover:text-[#242933] transition-colors"
                    title="نسخ المعرف"
                  >
                    {copiedKey === 'cust-id-portal' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </span>
                {matchedCustomer.name && (
                  <span className="text-[#242933] font-bold mr-1">({matchedCustomer.name})</span>
                )}
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E8E4DC]">
                <div className="p-1 rounded-lg bg-[#EAF2EC] text-[#13583D]">
                  <Wallet className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-[#5A6272] block">رصيد المحفظة المتوفر:</span>
                  <span className="text-sm font-bold text-[#13583D] font-mono">
                    {formatPrice(matchedCustomer.walletBalanceEGP || 0, currency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Ban Warning if account is banned */}
          {matchedCustomer?.isBanned && (
            <div className="p-3.5 rounded-2xl bg-[#FDEEEC] border border-[#F7C6C3] text-[#9C2B27] text-xs flex items-start gap-2.5">
              <Ban className="w-5 h-5 text-[#9C2B27] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block">
                  تنبيه: هذا الحساب محظور حالياً من التجديدات والشراء
                </span>
                <p className="text-xs text-[#9C2B27]/90 mt-0.5 leading-relaxed">
                  سبب الحظر: {matchedCustomer.banReason || 'مخالفة شروط الاستخدام.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Feedback notification toast */}
        {renewNotice && (
          <div className="bg-[#EAF2EC] border-b border-[#CDE3D4] px-6 py-2.5 text-xs text-[#13583D] font-bold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-[#13583D]" />
            <span>{renewNotice}</span>
          </div>
        )}

        {/* Tab filters */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#E8E4DC] bg-white text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-[#13583D] text-[#13583D]'
                : 'border-transparent text-[#5A6272] hover:text-[#242933]'
            }`}
          >
            جميع الاشتراكات ({customerSubscriptions.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'active'
                ? 'border-[#13583D] text-[#13583D]'
                : 'border-transparent text-[#5A6272] hover:text-[#242933]'
            }`}
          >
            النشطة ({customerSubscriptions.filter((s) => s.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveTab('pending_renewal')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'pending_renewal'
                ? 'border-[#13583D] text-[#13583D]'
                : 'border-transparent text-[#5A6272] hover:text-[#242933]'
            }`}
          >
            قيد التجديد ({customerSubscriptions.filter((s) => s.status === 'pending_renewal').length})
          </button>

          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'expired'
                ? 'border-[#13583D] text-[#13583D]'
                : 'border-transparent text-[#5A6272] hover:text-[#242933]'
            }`}
          >
            المنتهية ({customerSubscriptions.filter((s) => s.status === 'expired').length})
          </button>
        </div>

        {/* Subscriptions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-[#EAF2EC] border border-[#CDE3D4] flex items-center justify-center mx-auto text-[#13583D]">
                <Calendar className="w-7 h-7" />
              </div>
              <h4 className="text-[#242933] font-bold text-base">لا توجد اشتراكات مسجلة لهذا الحساب حالياً</h4>
              <p className="text-xs text-[#5A6272] max-w-sm mx-auto">
                عند إتمام طلبك في المتجر، ستظهر تفاصيل ترخيصك وبيانات الدخول وجدولة التجديد التلقائي هنا فوراً.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#13583D] hover:bg-[#0E442F] text-white text-xs font-bold transition-all shadow-xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>تصفح واشترك في الأدوات</span>
              </button>
            </div>
          ) : (
            filteredSubscriptions.map((sub) => {
              const daysRemaining = calculateDaysRemaining(sub.expiryDate);
              const isExpanded = expandedSubId === sub.id;

              const whatsappInquiry = encodeURIComponent(
                `مرحباً كينجز ستور، أستفسر بخصوص اشتراكي رقم ${sub.subscriptionCode} (${sub.productName})`
              );

              return (
                <div
                  key={sub.id}
                  className="rounded-2xl bg-white border border-[#E8E4DC] hover:border-[#D0C9BC] transition-all overflow-hidden shadow-xs"
                >
                  {/* Subscription Main Header Card */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Product & License info */}
                    <div className="flex items-start gap-3.5 flex-1">
                      <div className="shrink-0 mt-0.5">
                        <ProductBrandIcon slug={sub.productSlug} brand={sub.productName} size="md" />
                      </div>

                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 
                            onClick={() => {
                              onClose();
                              onOpenProductDetail(sub.productSlug);
                            }}
                            className="font-bold text-[#242933] text-base hover:text-[#13583D] cursor-pointer transition-colors"
                          >
                            {sub.productName}
                          </h4>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            sub.status === 'active'
                              ? 'bg-[#EAF2EC] text-[#13583D] border-[#CDE3D4]'
                              : sub.status === 'pending_renewal'
                              ? 'bg-[#FEF7EC] text-[#9A6216] border-[#FBD9A5]'
                              : 'bg-[#FDEEEC] text-[#9C2B27] border-[#F7C6C3]'
                          }`}>
                            {sub.status === 'active' && '✓ نشط ومفعل'}
                            {sub.status === 'pending_renewal' && '⚡ قيد التجديد'}
                            {sub.status === 'expired' && '✕ منتهي الصلاحية'}
                            {sub.status === 'cancelled' && 'ملغى'}
                          </span>

                          <span className="text-[11px] font-mono text-[#5A6272] bg-[#F8F6F2] px-2 py-0.5 rounded-md border border-[#E8E4DC]">
                            {sub.subscriptionCode}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#5A6272]">
                          <span className="text-[#13583D] font-bold">{sub.planLabel}</span>
                          <span>•</span>
                          <span>الطلب: #{sub.orderNumber}</span>
                          <span>•</span>
                          <span>بدأ: {formatDate(sub.startDate)}</span>
                        </div>

                        {/* Remaining days & Progress bar */}
                        {sub.status === 'active' && (
                          <div className="pt-2 max-w-md space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-[#5A6272]">ينتهي في: <strong className="text-[#242933]">{formatDate(sub.expiryDate)}</strong></span>
                              <span className={`font-bold font-mono ${daysRemaining <= 10 ? 'text-[#9A6216]' : 'text-[#13583D]'}`}>
                                متبقي {daysRemaining} يوماً
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#EFECE5] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  daysRemaining <= 10 ? 'bg-amber-500' : 'bg-[#13583D]'
                                }`}
                                style={{ 
                                  width: `${Math.min(100, Math.max(5, (daysRemaining / ((sub.durationMonths || 12) * 30)) * 100))}%` 
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions & Auto-Renew Controls */}
                    <div className="flex flex-wrap items-center gap-2.5 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#F0ECE4]">
                      
                      {/* Auto-renew Switch */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F6F2] border border-[#E8E4DC]">
                        <button
                          onClick={() => handleToggleAutoRenewClick(sub)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                            sub.autoRenew ? 'bg-[#13583D]' : 'bg-[#D1CBC0]'
                          }`}
                          title="تفعيل/تعطيل التجديد التلقائي"
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ease-in-out ${
                              sub.autoRenew ? '-translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </button>
                        <div className="text-right">
                          <span className="block text-[11px] font-bold text-[#242933] leading-tight">
                            التجديد التلقائي
                          </span>
                          <span className="text-[10px] text-[#5A6272] block">
                            {sub.autoRenew ? 'مفعل ومجدول' : 'متوقف'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Click Renew Now button */}
                      <button
                        onClick={() => onRenewNow(sub)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white text-xs font-bold shadow-xs transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>تجديد فوري ({formatPrice(sub.renewalPriceEGP, currency)})</span>
                      </button>

                      {/* Toggle Credentials Details */}
                      <button
                        onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE5] text-[#242933] text-xs font-semibold border border-[#E8E4DC] transition-colors"
                      >
                        <Key className="w-3.5 h-3.5 text-[#13583D]" />
                        <span>{isExpanded ? 'إخفاء البيانات' : 'بيانات الحساب'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                    </div>

                  </div>

                  {/* Expanded Credentials & Subscription Management Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-3 bg-[#FAF8F5] border-t border-[#E8E4DC] space-y-4 animate-in fade-in">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        
                        {/* Credentials box */}
                        <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DC] space-y-2.5">
                          <h5 className="font-bold text-[#242933] flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-[#13583D]" />
                            <span>بيانات تشغيل الحساب والتفعيل الرسمي:</span>
                          </h5>

                          {sub.credentials?.email && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F2] border border-[#E8E4DC] font-mono">
                              <span className="text-[#5A6272]">البريد:</span>
                              <span className="text-[#242933] select-all font-semibold">{sub.credentials.email}</span>
                              <button
                                onClick={() => handleCopy(sub.credentials!.email!, `email-${sub.id}`)}
                                className="text-[#13583D] hover:bg-[#EAF2EC] p-1 rounded-md transition-colors"
                                title="نسخ البريد"
                              >
                                {copiedKey === `email-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.password && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F2] border border-[#E8E4DC] font-mono">
                              <span className="text-[#5A6272]">كلمة المرور:</span>
                              <span className="text-[#242933] font-bold select-all">{sub.credentials.password}</span>
                              <button
                                onClick={() => handleCopy(sub.credentials!.password!, `pwd-${sub.id}`)}
                                className="text-[#13583D] hover:bg-[#EAF2EC] p-1 rounded-md transition-colors"
                                title="نسخ كلمة السر"
                              >
                                {copiedKey === `pwd-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.inviteUrl && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-[#F8F6F2] border border-[#E8E4DC]">
                              <span className="text-[#5A6272]">رابط الدعوة:</span>
                              <a
                                href={sub.credentials.inviteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#204E85] hover:underline truncate max-w-[200px] font-mono text-[11px] font-semibold"
                              >
                                {sub.credentials.inviteUrl}
                              </a>
                              <button
                                onClick={() => handleCopy(sub.credentials!.inviteUrl!, `inv-${sub.id}`)}
                                className="text-[#13583D] hover:bg-[#EAF2EC] p-1 rounded-md transition-colors"
                                title="نسخ رابط الدعوة"
                              >
                                {copiedKey === `inv-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.notes && (
                            <p className="text-[11px] text-[#5A6272] leading-relaxed bg-[#F8F6F2] p-2 rounded-lg border border-[#E8E4DC]">
                              💡 {sub.credentials.notes}
                            </p>
                          )}
                        </div>

                        {/* Scheduling & Auto-Renew Management Box */}
                        <div className="p-3.5 rounded-xl bg-white border border-[#E8E4DC] space-y-2.5 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-[#242933] flex items-center gap-1.5 mb-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#13583D]" />
                              <span>إعدادات الجدولة والتجديد:</span>
                            </h5>

                            <div className="space-y-1.5 text-xs">
                              <div className="flex justify-between">
                                <span className="text-[#5A6272]">حالة التجديد:</span>
                                <span className={sub.autoRenew ? 'text-[#13583D] font-bold' : 'text-[#5A6272]'}>
                                  {sub.autoRenew ? 'مفعل تلقائياً' : 'يدوي عند الطلب'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[#5A6272]">سعر التجديد:</span>
                                <span className="font-mono font-bold text-[#242933]">
                                  {formatPrice(sub.renewalPriceEGP, currency)}
                                </span>
                              </div>
                              {sub.autoRenew && sub.autoRenewDate && (
                                <div className="flex justify-between text-[#9A6216] font-semibold">
                                  <span>موعد التجديد القادم:</span>
                                  <span>{formatDate(sub.autoRenewDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions Footer inside drawer */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#E8E4DC]">
                            {sub.credentials?.loginPortalUrl && (
                              <a
                                href={sub.credentials.loginPortalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EEF4FC] text-[#204E85] hover:bg-[#DEEAFC] border border-[#BED6F5] text-[11px] font-bold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>فتح موقع الأداة</span>
                              </a>
                            )}

                            <a
                              href={`https://wa.me/201029384756?text=${whatsappInquiry}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EAF2EC] text-[#13583D] hover:bg-[#DCEEE0] border border-[#CDE3D4] text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>دعم فني عبر واتساب</span>
                            </a>

                            <button
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من إلغاء هذا الاشتراك؟')) {
                                  onCancelSubscription(sub.id);
                                }
                              }}
                              className="text-[#8E97A7] hover:text-rose-600 text-[11px] px-2 py-1 hover:underline ml-auto"
                            >
                              إلغاء الاشتراك
                            </button>
                          </div>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-3 text-xs text-[#5A6272]">
          <div className="flex items-center gap-2 text-[#13583D] font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>اشتراكاتك مؤمنة بضمان استبدال رسمي وتجديد فوري عبر كينجز ستور.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F8F6F2] hover:bg-[#EFECE5] text-[#242933] border border-[#E8E4DC] font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
