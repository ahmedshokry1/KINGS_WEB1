import React, { useState, useEffect } from 'react';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';

interface SaleEvent {
  buyer: string;
  product: string;
  timeAgo: string;
}

const RECENT_SALES: SaleEvent[] = [
  { buyer: 'م. أحمد', product: 'Google AI جيميناي برو (18 شهر)', timeAgo: 'منذ دقيقتين' },
  { buyer: 'سارة م.', product: 'Canva Pro (3 سنوات)', timeAgo: 'منذ 5 دقائق' },
  { buyer: 'كريم ع.', product: 'باقة المطورين (Cursor + Claude + GPT)', timeAgo: 'منذ 8 دقائق' },
  { buyer: 'عبدالرحمن', product: 'ChatGPT Plus (حساب خاص)', timeAgo: 'منذ 11 دقيقة' },
  { buyer: 'نور الدين', product: 'CapCut Pro (سنة كاملة)', timeAgo: 'منذ 14 دقيقة' },
  { buyer: 'يوسف خ.', product: 'Midjourney v6.1', timeAgo: 'منذ 18 دقيقة' },
];

export const RecentSalesToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    // Show after 3 seconds initial delay
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Cycle every 11 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % RECENT_SALES.length);
        setIsVisible(true);
      }, 600);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isDismissed]);

  if (isDismissed || !isVisible) return null;

  const current = RECENT_SALES[currentIndex];

  return (
    <div className="fixed bottom-5 right-5 z-40 max-w-xs animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="p-3 rounded-2xl bg-white border border-[#E8E4DC] shadow-lg backdrop-blur-md flex items-start gap-3 text-right text-[#242933]">
        <div className="w-8 h-8 rounded-full bg-[#F5E6BD] text-[#2C3442] flex items-center justify-center shrink-0 mt-0.5 border border-[#EBDCB6]">
          <ShoppingBag className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-[#2C5282] font-bold mb-0.5">
            <CheckCircle className="w-3 h-3 text-[#3B72A8]" />
            <span>طلب تفعيل جديد</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400 font-normal">{current.timeAgo}</span>
          </div>

          <p className="text-xs font-bold text-[#242933] truncate">
            {current.product}
          </p>

          <span className="text-[11px] text-slate-500 block mt-0.5">
            المشتري: {current.buyer}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 p-1 transition-colors"
          title="إغلاق"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
