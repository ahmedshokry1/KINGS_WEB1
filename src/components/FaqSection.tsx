import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { StoreFaqItem } from '../types/store';

interface FaqSectionProps {
  faqs?: StoreFaqItem[];
  isVisible?: boolean;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ faqs: propFaqs, isVisible = true }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (isVisible === false) return null;

  const defaultFaqs = [
    {
      q: 'كيف يتم التفعيل على إيميلي الشخصي؟ وهل تحتاجون كلمة السر؟',
      a: 'لا نطلب كلمة السر إطلاقاً. يتم إرسال دعوة رسمية مباشرة إلى بريدك الإلكتروني (مثل Canva و Gemini)، وتضغط قبول الدعوة فقط ليتحول حسابك فوراً إلى الخطة المدفوعة.',
    },
    {
      q: 'هل الأدوات والاشتراكات أصلية ورسمية؟',
      a: 'نعم 100%، جميع الاشتراكات مقدمة من السيرفرات الرسمية للشركات وتستقبل التحديثات والنماذج الجديدة بمجرد إطلاقها.',
    },
    {
      q: 'ماذا يشمل ضمان كامل المدة من كينجز ستور؟',
      a: 'نحن ملتزمون بخدمتك طوال فترة اشتراكك، وفي حال حدوث أي توقف أو مشكلة تقنية يقوم فريق الدعم بحلها أو تعويضك بحساب جديد فوراً.',
    },
    {
      q: 'ما هي طرق الدفع المتاحة داخل وخارج مصر؟',
      a: 'نوفر الدفع عبر تطبيق انستاباي (InstaPay)، محافظ فودافون كاش، أورانج واتصالات كاش، بالإضافة للبطاقات البنكية وعملة USDT الرقمية للمشتركين من خارج مصر.',
    },
    {
      q: 'كم يستغرق استلام الاشتراك بعد الطلب؟',
      a: 'متوسط وقت التجهيز الفعلي يتراوح بين 5 إلى 15 دقيقة فقط، ويصلك كود أو رابط التفعيل فور تأكيد التحويل.',
    },
  ];

  const items = propFaqs && propFaqs.length > 0 
    ? propFaqs.map(f => ({ q: f.question, a: f.answer }))
    : defaultFaqs;

  return (
    <section className="py-12 bg-[#F8F6F2] border-b border-[#E8E4DC]" id="faq-section">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-[#8E97A7] uppercase tracking-wider block mb-1">
            الأسئلة الشائعة
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-[#242933]">
            إجابات واضحة ومباشرة
          </h2>
        </div>

        <div className="space-y-2.5">
          {items.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl bg-white border border-[#E8E4DC] overflow-hidden transition-all hover:border-[#BED6F5]"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-right p-4 flex items-center justify-between gap-4 font-semibold text-sm text-[#242933] hover:text-[#2C5282] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8E97A7] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#2C5282]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[#5E6676] leading-relaxed border-t border-[#F0ECE4] pt-2.5">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
