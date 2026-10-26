import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Calendar, 
  Clock, 
  RefreshCw, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  AlertCircle, 
  Lock, 
  Key, 
  Mail, 
  Phone, 
  Search, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp, 
  Trash2, 
  Sparkles, 
  MessageCircle, 
  CheckCircle2, 
  Zap, 
  Power,
  Wallet,
  Ban
} from 'lucide-react';
import { CustomerSubscription, SubscriptionStatus, CurrencyCode, SubscriptionProduct, PlanVariant, CustomerUser } from '../types/store';
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
  subscriptions,
  customers = [],
  currency,
  onToggleAutoRenew,
  onRenewNow,
  onCancelSubscription,
  onOpenProductDetail,
  defaultCustomerEmail = 'ahmedcraft153@gmail.com',
}) => {
  if (!isOpen) return null;

  const [customerLookup, setCustomerLookup] = useState(defaultCustomerEmail);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'expired' | 'pending_renewal'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSubId, setExpandedSubId] = useState<string | null>(null);
  const [renewNotice, setRenewNotice] = useState<string | null>(null);

  // Filter subscriptions matching the customer
  const customerSubscriptions = subscriptions.filter((sub) => {
    if (!customerLookup.trim()) return true;
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

  // Metrics
  const activeCount = customerSubscriptions.filter((s) => s.status === 'active').length;
  const autoRenewCount = customerSubscriptions.filter((s) => s.autoRenew && s.status === 'active').length;

  // Matched customer profile from customers database
  const matchedCustomer = customers.find((c) => {
    if (!customerLookup.trim()) return false;
    const q = customerLookup.trim().toLowerCase();
    return (
      c.id.toLowerCase() === q ||
      c.email.toLowerCase() === q ||
      (c.phone && c.phone.includes(q)) ||
      c.name.toLowerCase().includes(q)
    );
  }) || customers[0];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[2px] shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-[#090d16] rounded-2xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  بوابة العميل لإدارة الاشتراكات والتجديد التلقائي
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  لوحة العميل
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تتبع حالة تراخيصك، بيانات الدخول، وجدولة التجديدات التلقائية بكل سهولة
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

        {/* Customer Search & Quick Accounts Switcher */}
        <div className="p-4 sm:p-5 bg-slate-900/60 border-b border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={customerLookup}
                onChange={(e) => setCustomerLookup(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني أو رقم هاتفك لعرض اشتراكاتك..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>

            {/* Quick Demo Customer Account Switcher for Instant Testing */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="shrink-0 text-[11px]">حسابات تجريبية:</span>
              <button
                onClick={() => setCustomerLookup('ahmedcraft153@gmail.com')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors shrink-0 ${
                  customerLookup === 'ahmedcraft153@gmail.com'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                ahmedcraft153
              </button>
              <button
                onClick={() => setCustomerLookup('omar.dev@gmail.com')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors shrink-0 ${
                  customerLookup === 'omar.dev@gmail.com'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                omar.dev
              </button>
              <button
                onClick={() => setCustomerLookup('mina.design@gmail.com')}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono transition-colors shrink-0 ${
                  customerLookup === 'mina.design@gmail.com'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                mina.design
              </button>
            </div>
          </div>

          {/* Customer ID & Wallet Balance Card */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-950 to-slate-950 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold">معرّف حسابك (ID العميل):</span>
              <span className="font-mono text-amber-400 font-bold bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                <span>{matchedCustomer ? matchedCustomer.id : 'CUST-8821'}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(matchedCustomer ? matchedCustomer.id : 'CUST-8821', 'cust-id-portal')}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="نسخ ID العميل"
                >
                  {copiedKey === 'cust-id-portal' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <div className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Wallet className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">رصيد المحفظة المتوفر:</span>
                <span className="text-sm font-black text-amber-400 font-mono">
                  {formatPrice(matchedCustomer?.walletBalanceEGP || 0, currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Ban Warning if account is banned */}
          {matchedCustomer?.isBanned && (
            <div className="p-3.5 rounded-2xl bg-rose-950/70 border border-rose-500 text-rose-200 text-xs flex items-start gap-2.5 shadow-lg shadow-rose-950/40 animate-in fade-in">
              <Ban className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sm block text-white">
                  تنبيه: هذا الحساب محظور حالياً من التجديدات والشراء 🚫
                </span>
                <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">
                  سبب الحظر: {matchedCustomer.banReason || 'قرار إداري بمخالفة شروط الاستخدام.'}
                </p>
                <p className="text-[11px] text-rose-400 mt-1">
                  يمكنك استعراض بيانات اشتراكاتك فقط. للتواصل مع الإدارة: support@kingsstore.ai
                </p>
              </div>
            </div>
          )}

          {/* Metrics ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs pt-1">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">الاشتراكات النشطة:</span>
              <span className="text-emerald-400 font-black text-base">{activeCount} اشتراك نشط</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">التجديد التلقائي:</span>
              <span className="text-amber-400 font-black text-base">{autoRenewCount} مجدول</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">الضمان المعتمد:</span>
              <span className="text-cyan-400 font-bold text-xs sm:text-sm">ضمان استبدال 100%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">الدعم الفني المباشر:</span>
              <span className="text-purple-400 font-bold text-xs sm:text-sm">واتساب 24/7 متاح</span>
            </div>
          </div>
        </div>

        {/* Feedback notification toast */}
        {renewNotice && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-6 py-2.5 text-xs text-amber-300 font-bold flex items-center justify-center gap-2 animate-in fade-in">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{renewNotice}</span>
          </div>
        )}

        {/* Tab filters */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/30 text-xs">
          <button
            onClick={() => setActiveTab('all')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'all'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            جميع الاشتراكات ({customerSubscriptions.length})
          </button>

          <button
            onClick={() => setActiveTab('active')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'active'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            الاشتراكات النشطة ({customerSubscriptions.filter((s) => s.status === 'active').length})
          </button>

          <button
            onClick={() => setActiveTab('pending_renewal')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'pending_renewal'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            قيد التجديد ({customerSubscriptions.filter((s) => s.status === 'pending_renewal').length})
          </button>

          <button
            onClick={() => setActiveTab('expired')}
            className={`pb-2.5 px-3 font-bold border-b-2 transition-all ${
              activeTab === 'expired'
                ? 'border-rose-400 text-rose-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            المنتهية ({customerSubscriptions.filter((s) => s.status === 'expired').length})
          </button>
        </div>

        {/* Subscriptions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-white font-bold text-base">لا توجد اشتراكات مسجلة لهذا الحساب</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                يرجى التأكد من كتابة البريد الإلكتروني أو رقم الهاتف المسجل به عند إتمام طلبك.
              </p>
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
                  className="rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
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
                            className="font-black text-white text-base hover:text-amber-400 cursor-pointer transition-colors"
                          >
                            {sub.productName}
                          </h4>

                          {/* Status Badge */}
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                            sub.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : sub.status === 'pending_renewal'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                          }`}>
                            {sub.status === 'active' && '✓ نشط ومفعل'}
                            {sub.status === 'pending_renewal' && '⚡ قيد التجديد'}
                            {sub.status === 'expired' && '✕ منتهي الصلاحية'}
                            {sub.status === 'cancelled' && 'ملغى'}
                          </span>

                          <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {sub.subscriptionCode}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                          <span className="text-amber-400 font-semibold">{sub.planLabel}</span>
                          <span className="text-slate-500">•</span>
                          <span>الطلب: #{sub.orderNumber}</span>
                          <span className="text-slate-500">•</span>
                          <span className="text-slate-400">بدأ: {formatDate(sub.startDate)}</span>
                        </div>

                        {/* Remaining days & Progress bar */}
                        {sub.status === 'active' && (
                          <div className="pt-2 max-w-md space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="text-slate-400">ينتهي في: <strong className="text-white">{formatDate(sub.expiryDate)}</strong></span>
                              <span className={`font-bold font-mono ${daysRemaining <= 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                متبقي {daysRemaining} يوماً
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  daysRemaining <= 10 ? 'bg-amber-400' : 'bg-emerald-500'
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
                    <div className="flex flex-wrap items-center gap-3 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800/80">
                      
                      {/* Auto-renew Switch */}
                      <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <button
                          onClick={() => handleToggleAutoRenewClick(sub)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out relative ${
                            sub.autoRenew ? 'bg-amber-500' : 'bg-slate-700'
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
                          <span className="block text-[11px] font-bold text-white leading-tight">
                            التجديد التلقائي
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {sub.autoRenew ? 'مفعل ومجدول' : 'متوقف'}
                          </span>
                        </div>
                      </div>

                      {/* 1-Click Renew Now button */}
                      <button
                        onClick={() => onRenewNow(sub)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md transition-all"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>تجديد فوري ({formatPrice(sub.renewalPriceEGP, currency)})</span>
                      </button>

                      {/* Toggle Credentials Details */}
                      <button
                        onClick={() => setExpandedSubId(isExpanded ? null : sub.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                      >
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isExpanded ? 'إخفاء البيانات' : 'بيانات الحساب'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                    </div>

                  </div>

                  {/* Expanded Credentials & Subscription Management Drawer */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 bg-slate-950/60 border-t border-slate-800/80 space-y-4 animate-in fade-in">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        
                        {/* Credentials box */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
                          <h5 className="font-bold text-amber-400 flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5" />
                            <span>بيانات تشغيل الحساب والتفعيل الرسمي:</span>
                          </h5>

                          {sub.credentials?.email && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                              <span className="text-slate-400">البريد:</span>
                              <span className="text-white select-all">{sub.credentials.email}</span>
                              <button
                                onClick={() => handleCopy(sub.credentials!.email!, `email-${sub.id}`)}
                                className="text-amber-400 hover:text-amber-300 ml-2"
                                title="نسخ البريد"
                              >
                                {copiedKey === `email-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.password && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono">
                              <span className="text-slate-400">كلمة المرور:</span>
                              <span className="text-amber-300 font-bold select-all">{sub.credentials.password}</span>
                              <button
                                onClick={() => handleCopy(sub.credentials!.password!, `pwd-${sub.id}`)}
                                className="text-amber-400 hover:text-amber-300 ml-2"
                                title="نسخ كلمة السر"
                              >
                                {copiedKey === `pwd-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.inviteUrl && (
                            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                              <span className="text-slate-400">رابط الدعوة:</span>
                              <a
                                href={sub.credentials.inviteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:underline truncate max-w-[200px] font-mono text-[11px]"
                              >
                                {sub.credentials.inviteUrl}
                              </a>
                              <button
                                onClick={() => handleCopy(sub.credentials!.inviteUrl!, `inv-${sub.id}`)}
                                className="text-amber-400 hover:text-amber-300 ml-2"
                                title="نسخ رابط الدعوة"
                              >
                                {copiedKey === `inv-${sub.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          )}

                          {sub.credentials?.notes && (
                            <p className="text-[11px] text-slate-300 leading-relaxed bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                              💡 {sub.credentials.notes}
                            </p>
                          )}
                        </div>

                        {/* Scheduling & Auto-Renew Management Box */}
                        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>إعدادات الجدولة والتجديد:</span>
                            </h5>

                            <div className="space-y-1.5 text-slate-300 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400">حالة التجديد:</span>
                                <span className={sub.autoRenew ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                                  {sub.autoRenew ? 'مفعل تلقائياً' : 'يدوي عند الطلب'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400">سعر التجديد المحجوز:</span>
                                <span className="font-mono font-bold text-white">
                                  {formatPrice(sub.renewalPriceEGP, currency)}
                                </span>
                              </div>
                              {sub.autoRenew && sub.autoRenewDate && (
                                <div className="flex justify-between text-amber-300">
                                  <span>موعد التجديد القادم:</span>
                                  <span>{formatDate(sub.autoRenewDate)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Quick Actions Footer inside drawer */}
                          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                            {sub.credentials?.loginPortalUrl && (
                              <a
                                href={sub.credentials.loginPortalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30 text-[11px] font-bold"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>فتح موقع الأداة الرسمي</span>
                              </a>
                            )}

                            <a
                              href={`https://wa.me/201029384756?text=${whatsappInquiry}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 text-[11px] font-bold"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>دعم فني عبر واتساب</span>
                            </a>

                            <button
                              onClick={() => {
                                if (window.confirm('هل أنت متأكد من إلغاء هذا الاشتراك؟ يمكنك إعادة تفعيله في أي وقت.')) {
                                  onCancelSubscription(sub.id);
                                }
                              }}
                              className="text-slate-500 hover:text-rose-400 text-[11px] px-2 py-1 hover:underline ml-auto"
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
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>جميع اشتراكات كينجز ستور تدار مركزياً مع ضمان استبدال كامل المدة وتجديد مستقر.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
