import React from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Review } from '../types/store';

interface TestimonialsSectionProps {
  reviews: Review[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ reviews }) => {
  return (
    <section className="py-12 bg-[#F8F6F2] border-b border-[#E8E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3">
          <div>
            <span className="text-xs font-bold text-[#8E97A7] uppercase tracking-wider block mb-1">
              آراء وتجارب العملاء
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#242933]">
              تقييمات موثقة من مستخدمي كينجز ستور
            </h2>
          </div>

          <div className="flex items-center gap-2 bg-white border border-[#E8E4DC] px-3.5 py-1.5 rounded-full text-xs shrink-0 shadow-xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#242933]">4.9 / 5</span>
            <span className="text-[#8E97A7]">· +1,500 عميل</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.slice(0, 4).map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-xl bg-white border border-[#E8E4DC] flex flex-col justify-between shadow-xs space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-[#8E97A7]">{rev.date}</span>
                </div>

                <p className="text-xs text-[#5E6676] leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-[#F0ECE4] flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-[#242933] text-[11px] block">{rev.customerName}</span>
                  <span className="text-[10px] text-[#8E97A7]">{rev.productName}</span>
                </div>
                {rev.verified && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                    <CheckCircle className="w-3 h-3" />
                    موثق
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
