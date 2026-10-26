import React from 'react';
import { Crown, MessageCircle, ShieldCheck, Mail, Lock } from 'lucide-react';
import { StoreSiteSettings } from '../types/store';

interface FooterProps {
  onOpenTracking: () => void;
  onOpenAdvisor: () => void;
  onOpenCustomerPortal?: () => void;
  onSelectCategory: (cat: string) => void;
  onOpenAdmin?: () => void;
  siteSettings?: StoreSiteSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenTracking,
  onOpenAdvisor,
  onOpenCustomerPortal,
  onSelectCategory,
  onOpenAdmin,
  siteSettings,
}) => {
  const whatsappNum = siteSettings?.whatsappNumber || '201029384756';

  return (
    <footer className="bg-[#1E2430] text-slate-300 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F5E6BD] flex items-center justify-center text-[#2C3442]">
                <Crown className="w-4 h-4 fill-[#2C3442]" />
              </div>
              <span className="text-lg font-black text-white font-['Plus_Jakarta_Sans',sans-serif]">
                KINGS <span className="text-[#A8C7FA]">STORE</span>
              </span>
            </div>

            <p className="text-slate-300 text-xs leading-relaxed max-w-xs">
              {siteSettings?.storeSlogan || 'منصة توفير اشتراكات وأدوات الذكاء الاصطناعي والتصميم الأصلية بتفعيل رسمي وضمان كامل المدة.'}
            </p>

            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold hover:bg-emerald-500/30 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>دعم الواتساب المباشر</span>
            </a>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              الأقسام
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-[#DDE8F6] transition-colors">
                  جميع الأدوات
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('ai-chat')} className="hover:text-[#DDE8F6] transition-colors">
                  محادثة وكتابة (ChatGPT / Claude)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('design')} className="hover:text-[#DDE8F6] transition-colors">
                  تصميم وصور (Canva / Midjourney)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('coding')} className="hover:text-[#DDE8F6] transition-colors">
                  برمجة وتطوير (Cursor / Colab)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              خدمة العملاء
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <button onClick={onOpenTracking} className="hover:text-[#DDE8F6] transition-colors">
                  تتبع حالة الطلب
                </button>
              </li>
              {onOpenCustomerPortal && (
                <li>
                  <button onClick={onOpenCustomerPortal} className="hover:text-[#DDE8F6] transition-colors">
                    بوابة اشتراكاتي
                  </button>
                </li>
              )}
              <li>
                <button onClick={onOpenAdvisor} className="hover:text-[#DDE8F6] transition-colors">
                  مستشار الاختيار الذكي
                </button>
              </li>
              <li>
                <a href="#faq-section" className="hover:text-[#DDE8F6] transition-colors">
                  الأسئلة الشائعة
                </a>
              </li>
            </ul>
          </div>

          {/* Guarantees & Admin */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2.5">
              الضمان والأمان
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              جميع التراخيص أصلية ورسمية 100% مع ضمان استبدال فوري طوال فترة الاشتراك.
            </p>
            {onOpenAdmin && (
              <div className="pt-2">
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-[11px]"
                >
                  <Lock className="w-3 h-3" />
                  <span>دخول الإدارة</span>
                </button>
              </div>
            )}
          </div>

        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <p>{siteSettings?.footerCopyrightText || 'جميع الحقوق محفوظة © 2026 كينجز ستور (King\'s Store).'}</p>
          <p className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>تسوق آمن وتفعيل فوري</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
