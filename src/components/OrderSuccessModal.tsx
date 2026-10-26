import React from 'react';
import { 
  CheckCircle2, 
  Crown, 
  Copy, 
  MessageCircle, 
  Clock, 
  Mail, 
  Phone, 
  ArrowLeft, 
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Order, CurrencyCode } from '../types/store';
import { formatPrice } from '../utils/currency';

interface OrderSuccessModalProps {
  order: Order | null;
  currency: CurrencyCode;
  onClose: () => void;
  onViewTracking: (orderNumber: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  currency,
  onClose,
  onViewTracking,
}) => {
  if (!order) return null;

  const [copied, setCopied] = React.useState(false);

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = encodeURIComponent(
    `مرحباً كينجز ستور (Kings Store)، قمت بطلب اشتراك جديد:\nرقم الطلب: ${order.orderNumber}\nالاسم: ${order.customerName}\nالبريد: ${order.customerEmail}\nطريقة الدفع: ${order.paymentMethod} (مرجع: ${order.paymentReference})\nأرجو إرسال التفعيل فوراً وشكراً!`
  );

  const whatsappUrl = `https://wa.me/201029384756?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto p-6 sm:p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Celebration Icon */}
        <div className="relative mx-auto w-20 h-20 mb-5">
          <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping"></div>
          <div className="relative w-full h-full bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Crown className="w-10 h-10 text-slate-950" />
          </div>
        </div>

        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
          ✓ تم تسجيل طلبك بنجاح في كينجز ستور
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
          مبروك! اشتراكك قيد التفعيل الفوري
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mb-6 leading-relaxed">
          شكراً لثقتك بنا. سيتم إرسال دعوة التفعيل الرسمية أو بيانات الحساب إلى بريدك الإلكتروني والواتساب خلال دقائق معدودة.
        </p>

        {/* Order Number Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between mb-6">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">رقم طلبك الخاص:</span>
            <span className="text-xl font-black text-amber-400 font-mono tracking-wider">
              {order.orderNumber}
            </span>
          </div>

          <button
            onClick={handleCopyOrderNumber}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'تم النسخ!' : 'نسخ الرقم'}</span>
          </button>
        </div>

        {/* Live Timeline status */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 mb-6 text-right space-y-3">
          <h4 className="text-xs font-bold text-slate-400">مراحل التفعيل الآن:</h4>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>تم استلام تفاصيل الطلب وتأكيد البيانات</span>
            </div>
            <div className="flex items-center gap-2.5 text-amber-400 font-semibold animate-pulse">
              <Clock className="w-4 h-4 shrink-0" />
              <span>جاري مراجعة التحويل وتجهيز كود/دعوة التفعيل (خلال 5-15 دقيقة)</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-500">
              <Mail className="w-4 h-4 shrink-0" />
              <span>إرسال الرابط الرسمي إلى {order.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Quick Action: Direct WhatsApp Delivery */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all transform hover:scale-[1.01]"
          >
            <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
            <span>تسريع التفعيل عبر الواتساب فوراً</span>
            <ExternalLink className="w-4 h-4 mr-1" />
          </a>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onClose();
                onViewTracking(order.orderNumber);
              }}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              متابعة حالة الطلب
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              العودة للمتجر
            </button>
          </div>
        </div>

        {/* Trust reminder */}
        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>مشمول بضمان كامل المدة من كينجز ستور مع دعم فني متواصل</span>
        </div>

      </div>
    </div>
  );
};
