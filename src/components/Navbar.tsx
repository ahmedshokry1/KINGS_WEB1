import React, { useState } from 'react';
import { 
  Crown, 
  ShoppingCart, 
  Search, 
  CheckCircle2, 
  Sparkles,
  ChevronDown,
  X,
  Lock,
  ShieldCheck,
  User,
  LogOut,
  Wallet,
  Database
} from 'lucide-react';
import { CurrencyCode, StoreSiteSettings, CustomerUser } from '../types/store';
import { CURRENCIES, formatPrice } from '../utils/currency';

interface NavbarProps {
  cartCount: number;
  cartTotalEGP: number;
  currentCurrency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  onOpenCart: () => void;
  onOpenCustomerPortal: () => void;
  onOpenAdvisor: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  siteSettings?: StoreSiteSettings;
  currentCustomer?: CustomerUser | null;
  onOpenAuth?: (mode?: 'login' | 'register' | 'database') => void;
  onCustomerLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  cartTotalEGP,
  currentCurrency,
  onCurrencyChange,
  onOpenCart,
  onOpenCustomerPortal,
  onOpenAdvisor,
  onOpenTracking,
  onOpenAdmin,
  isAdminLoggedIn,
  searchQuery,
  onSearchChange,
  onSelectCategory,
  siteSettings,
  currentCustomer,
  onOpenAuth,
  onCustomerLogout,
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F6F2]/95 backdrop-blur-md border-b border-[#E8E4DC] shadow-xs">
      {/* Top micro announcement bar */}
      {(siteSettings ? siteSettings.isAnnouncementActive : true) && (
        <div className="bg-[#2C3442] text-[#E8EEF5] text-xs font-medium py-1.5 px-3 text-center flex items-center justify-center gap-2">
          <span className="bg-[#F5E6BD] text-[#3E341B] font-bold px-2 py-0.2 rounded-full text-[10px]">
            عرض خاص
          </span>
          <span className="line-clamp-1">
            {siteSettings?.announcementText || 'اشتراكات رسمية وضمان كامل المدة | استخدم كود: KINGS2025'}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div 
            onClick={() => onSelectCategory('all')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F5E6BD] flex items-center justify-center shadow-xs text-[#2C3442]">
              <Crown className="w-5 h-5 fill-[#2C3442]" />
            </div>

            <div>
              <span className="text-xl font-black text-[#242933] tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
                KINGS <span className="text-[#3B72A8]">STORE</span>
              </span>
              <p className="hidden xs:block text-[11px] text-[#5E6676] font-medium">اشتراكات الذكاء الاصطناعي</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أداة (ChatGPT, Claude, Canva...)"
              className="w-full bg-white border border-[#E8E4DC] rounded-full pl-4 pr-10 py-2 text-xs sm:text-sm text-[#242933] placeholder-[#8E97A7] focus:outline-none focus:border-[#BED6F5] transition-all"
            />
            <Search className="w-4 h-4 text-[#8E97A7] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Customer Subscriptions / Profile */}
            {currentCustomer ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  type="button"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all border border-slate-200/80"
                >
                  <div className="w-5 h-5 rounded-full bg-[#F5E6BD] text-[#3E341B] flex items-center justify-center font-bold text-[10px]">
                    {currentCustomer.name ? currentCustomer.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{currentCustomer.name}</span>
                  <span className="hidden md:inline text-[11px] font-mono text-slate-500">
                    ({currentCustomer.walletBalanceEGP || 0} ج.م)
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserDropdown && (
                  <div 
                    className="absolute left-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-right font-['Cairo',sans-serif]"
                    onMouseLeave={() => setShowUserDropdown(false)}
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentCustomer.name}</p>
                      <p className="text-[11px] text-slate-500 truncate" dir="ltr">{currentCustomer.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenCustomerPortal();
                      }}
                      className="w-full text-right px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#3B72A8]" />
                      <span>اشتراكاتي وتراخيصي</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        if (onCustomerLogout) onCustomerLogout();
                      }}
                      className="w-full text-right px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>تسجيل الخروج</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => onOpenAuth ? onOpenAuth('login') : null}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full bg-white hover:bg-[#F2EFE8] text-[#242933] text-xs font-semibold border border-[#E8E4DC] transition-colors shadow-2xs"
              >
                <User className="w-3.5 h-3.5 text-[#5E6676]" />
                <span>دخول</span>
              </button>
            )}

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                type="button"
                className="flex items-center gap-1 px-2.5 py-1.5 sm:py-2 rounded-full bg-white border border-[#E8E4DC] text-xs font-medium text-[#242933] hover:bg-[#F2EFE8]"
              >
                <span className="font-bold">{CURRENCIES[currentCurrency].symbol}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showCurrencyDropdown && (
                <div 
                  className="absolute left-0 mt-2 w-32 bg-white border border-[#E8E4DC] rounded-xl shadow-lg py-1 z-50"
                  onMouseLeave={() => setShowCurrencyDropdown(false)}
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map((cCode) => (
                    <button
                      key={cCode}
                      onClick={() => {
                        onCurrencyChange(cCode);
                        setShowCurrencyDropdown(false);
                      }}
                      className={`w-full text-right px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-50 ${
                        currentCurrency === cCode ? 'font-bold text-[#3B72A8]' : 'text-slate-700'
                      }`}
                    >
                      <span>{CURRENCIES[cCode].nameAr}</span>
                      <span className="font-mono text-[10px] text-slate-400">{CURRENCIES[cCode].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Portal Button */}
            <button
              onClick={onOpenAdmin}
              type="button"
              title="لوحة الإدارة"
              className="p-2 rounded-full text-[#5E6676] hover:text-[#242933] hover:bg-[#F2EFE8] transition-colors"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Wallet Balance Pill like in screenshot */}
            <button
              onClick={onOpenCustomerPortal}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EAF5EC] hover:bg-[#DDF0E2] text-[#13583D] border border-[#CDE5D2] font-mono text-xs font-bold transition-all shadow-2xs active:scale-95"
              title="المحفظة والرصيد"
            >
              <span className="w-4 h-4 rounded-full bg-[#13583D] text-white flex items-center justify-center text-[10px] font-black leading-none">
                +
              </span>
              <span>{formatPrice(currentCustomer?.walletBalanceEGP || 0, currentCurrency)}</span>
              <Wallet className="w-3.5 h-3.5 opacity-80" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-98 select-none"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">السلة</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#3B72A8] rounded-full w-5 h-5 flex items-center justify-center text-xs font-black">
                  {cartCount}
                </span>
              )}
              {cartTotalEGP > 0 && (
                <span className="hidden md:inline font-mono border-r border-white/30 pr-1.5 mr-0.5">
                  {formatPrice(cartTotalEGP, currentCurrency)}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="ابحث عن أداة..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-10 py-1.5 text-xs text-slate-800 placeholder-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>
    </header>
  );
};
