import React from 'react';
import { Home, Wallet, ShoppingBag } from 'lucide-react';

interface BottomNavMobileProps {
  activeTab?: 'home' | 'wallet' | 'orders';
  onSelectTab?: (tab: 'home' | 'wallet' | 'orders') => void;
  onOpenWallet?: () => void;
  onOpenOrders?: () => void;
  onGoHome?: () => void;
  walletBalanceEGP?: number;
  purchasesCount?: number;
}

export const BottomNavMobile: React.FC<BottomNavMobileProps> = ({
  activeTab = 'home',
  onSelectTab,
  onOpenWallet,
  onOpenOrders,
  onGoHome,
  walletBalanceEGP = 0,
  purchasesCount = 0,
}) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E4DC] py-2 px-6 shadow-lg flex items-center justify-around font-['Cairo',sans-serif] md:hidden">
      
      {/* Home Tab */}
      <button
        onClick={onGoHome}
        type="button"
        className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 ${
          activeTab === 'home'
            ? 'bg-[#EAF2EC] text-[#13583D] font-bold shadow-2xs'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[11px]">الرئيسية</span>
      </button>

      {/* Wallet Tab */}
      <button
        onClick={onOpenWallet}
        type="button"
        className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 relative ${
          activeTab === 'wallet'
            ? 'bg-[#EAF2EC] text-[#13583D] font-bold shadow-2xs'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[11px]">المحفظة</span>
        {walletBalanceEGP > 0 && (
          <span className="absolute top-1 right-3 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        )}
      </button>

      {/* Orders / Purchases Tab */}
      <button
        onClick={onOpenOrders}
        type="button"
        className={`flex flex-col items-center gap-1 py-1.5 px-4 rounded-2xl transition-all duration-200 active:scale-90 relative ${
          activeTab === 'orders'
            ? 'bg-[#EAF2EC] text-[#13583D] font-bold shadow-2xs'
            : 'text-slate-500 hover:text-slate-800 font-medium'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[11px]">مشترياتي</span>
        {purchasesCount > 0 && (
          <span className="absolute top-0 right-2 w-4 h-4 rounded-full bg-[#13583D] text-white text-[9px] font-black flex items-center justify-center animate-bounce">
            {purchasesCount}
          </span>
        )}
      </button>

    </nav>
  );
};
