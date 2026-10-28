import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber?: string;
  presetMessage?: string;
  isEnabled?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappNumber = '201099887766',
  presetMessage = 'مرحباً كينجز ستور، أود الاستفسار عن اشتراكات الذكاء الاصطناعي',
  isEnabled = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (isEnabled === false) return null;

  const quickMessages = [
    'مرحباً، أود الاستفسار عن باقات كانفا برو المتاحة',
    'أريد معرفة تفاصيل تفعيل Google AI جيميناي برو',
    'أرغب في شراء اشتراك ChatGPT Plus أو Cursor Pro',
    'لدي استفسار بخصوص طريقة الدفع عبر انستاباي والمحافظ',
  ];

  const handleSend = (text: string) => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 z-40 font-['Cairo',sans-serif]">
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-2rem)] bg-white border border-[#E8E4DC] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="bg-[#13583D] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5 fill-white" />
              </div>
              <div>
                <h4 className="font-bold text-sm">خدمة عملاء كينجز ستور</h4>
                <span className="text-[11px] text-emerald-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                  متواجدون للرد المباشر
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick choices */}
          <div className="p-4 space-y-2 bg-[#F8F6F2] text-xs">
            <p className="text-[#5A6272] text-[11px] mb-2 font-medium">اختر موضوع استفسارك أو اكتب لنا مباشرة:</p>
            {quickMessages.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(msg)}
                className="w-full text-right p-2.5 rounded-xl bg-white hover:bg-[#EAF2EC] text-[#242933] border border-[#E8E4DC] hover:border-[#CDE3D4] transition-all duration-200 flex items-center justify-between group active:scale-[0.98]"
              >
                <span className="text-[11px] line-clamp-1 font-medium">{msg}</span>
                <Send className="w-3 h-3 text-[#13583D] group-hover:-translate-x-1 transition-transform shrink-0" />
              </button>
            ))}
          </div>

          {/* Open Chat button */}
          <div className="p-3 bg-white border-t border-[#E8E4DC]">
            <button
              onClick={() => handleSend(presetMessage)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs hover:shadow transition-all active:scale-[0.98]"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>محادثة مباشرة على واتساب</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Pill / Circle Button with gentle hover lift */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#13583D] animate-pulse"></span>
        </div>
        <span className="hidden sm:inline font-bold">دعم واتساب 24/7</span>
      </button>
    </div>
  );
};
