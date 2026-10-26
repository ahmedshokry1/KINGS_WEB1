import React from 'react';
import { Zap, ShieldCheck, BadgePercent, Headphones } from 'lucide-react';

export const TrustFeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Zap,
      color: 'text-[#8C6D23] bg-[#F7EED8]',
      title: 'تفعيل رسمي وسريع',
      desc: 'رابط ودعوة رسمية على بريدك الشخصي خلال دقائق معدودة.',
    },
    {
      icon: ShieldCheck,
      color: 'text-[#2D6A4F] bg-[#EAF5EC]',
      title: 'ضمان كامل المدة',
      desc: 'استبدال فوري ودعم متواصل طوال مدة اشتراكك بدون انقطاع.',
    },
    {
      icon: BadgePercent,
      color: 'text-[#2C5282] bg-[#EEF4FC]',
      title: 'أوفر سعر محلي',
      desc: 'دفع بالجنيه المصري عبر انستاباي والمحافظ الإلكترونية.',
    },
    {
      icon: Headphones,
      color: 'text-[#69306D] bg-[#F5EDF8]',
      title: 'دعم فني متواصل',
      desc: 'فريق دعم مباشر عبر الواتساب للإجابة عن استفساراتك 24/7.',
    },
  ];

  return (
    <section className="py-12 bg-[#F8F6F2] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-white border border-[#E8E4DC] flex items-start gap-3.5 transition-all hover:border-[#BED6F5] hover:shadow-xs"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#242933] mb-1">{feat.title}</h3>
                  <p className="text-xs text-[#5E6676] leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
