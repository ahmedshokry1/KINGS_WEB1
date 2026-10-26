import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Search, 
  Plus, 
  Edit3, 
  MessageCircle, 
  Mail, 
  Phone, 
  Trash2, 
  Save, 
  LogOut, 
  Sparkles, 
  Copy,
  Sliders,
  Check,
  AlertTriangle,
  UserCheck,
  Calendar,
  RefreshCw,
  Power,
  Key,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  Building2,
  Smartphone,
  Coins,
  ShieldCheck,
  RotateCcw,
  ToggleLeft,
  ToggleRight,
  Settings,
  Users,
  Wallet,
  Ban,
  ShieldOff,
  UserX,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  CheckCircle2,
  AlertCircle,
  Globe,
  Ticket,
  HelpCircle,
  FileText,
  SlidersHorizontal,
  ArrowLeft,
  ArrowRight,
  Eye,
  CheckCheck,
  Palette,
  Bell,
  Info,
  Crown,
  Database
} from 'lucide-react';
import { 
  Order, 
  SubscriptionProduct, 
  PlanVariant, 
  CurrencyCode, 
  ProductCategory, 
  DeliveryType,
  CustomerSubscription,
  SubscriptionStatus,
  PaymentMethodConfig,
  CustomerUser,
  WalletTransaction,
  StoreSiteSettings,
  StoreCoupon,
  StoreFaqItem
} from '../types/store';
import { formatPrice } from '../utils/currency';
import { ProductBrandIcon } from './ProductBrandIcon';
import { isSupabaseConfigured } from '../lib/supabase';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  products: SubscriptionProduct[];
  subscriptions: CustomerSubscription[];
  paymentMethods: PaymentMethodConfig[];
  customers?: CustomerUser[];
  currency: CurrencyCode;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status'], notes?: string) => void;
  onUpdateSubscriptionStatus: (subId: string, newStatus: SubscriptionStatus) => void;
  onToggleCustomerAutoRenew: (subId: string, enabled: boolean) => void;
  onExtendSubscription: (subId: string, days: number) => void;
  onAddProduct: (product: SubscriptionProduct) => void;
  onUpdateProduct: (product: SubscriptionProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdatePaymentMethod: (updatedMethod: PaymentMethodConfig) => void;
  onAddPaymentMethod: (newMethod: PaymentMethodConfig) => void;
  onDeletePaymentMethod: (methodId: string) => void;
  onTogglePaymentMethod: (methodId: string, enabled: boolean) => void;
  onResetPaymentMethods: () => void;
  onUpdateCustomerBalance?: (
    customerId: string, 
    amount: number, 
    type: 'credit' | 'debit' | 'set', 
    reason: string, 
    adminNote?: string
  ) => void;
  onUpdateCustomerPermissions?: (
    customerId: string, 
    permissions: {
      isBanned: boolean;
      banReason?: string;
      canPurchase: boolean;
      canUseCoupons: boolean;
      canAccessPortal: boolean;
      notes?: string;
    }
  ) => void;
  onAddCustomer?: (customer: CustomerUser) => void;
  onDeleteCustomer?: (customerId: string) => void;
  siteSettings?: StoreSiteSettings;
  onUpdateSiteSettings?: (settings: StoreSiteSettings) => void;
  coupons?: StoreCoupon[];
  onAddCoupon?: (coupon: StoreCoupon) => void;
  onUpdateCoupon?: (id: string, coupon: Partial<StoreCoupon>) => void;
  onDeleteCoupon?: (id: string) => void;
  faqs?: StoreFaqItem[];
  onAddFaq?: (faq: StoreFaqItem) => void;
  onUpdateFaq?: (id: string, faq: Partial<StoreFaqItem>) => void;
  onDeleteFaq?: (id: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  orders,
  products,
  subscriptions,
  paymentMethods = [],
  customers = [],
  currency,
  onUpdateOrderStatus,
  onUpdateSubscriptionStatus,
  onToggleCustomerAutoRenew,
  onExtendSubscription,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdatePaymentMethod,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onTogglePaymentMethod,
  onResetPaymentMethods,
  onUpdateCustomerBalance,
  onUpdateCustomerPermissions,
  onAddCustomer,
  onDeleteCustomer,
  siteSettings,
  onUpdateSiteSettings,
  coupons = [],
  onAddCoupon,
  onUpdateCoupon,
  onDeleteCoupon,
  faqs = [],
  onAddFaq,
  onUpdateFaq,
  onDeleteFaq,
  onLogout,
}) => {
  if (!isOpen) return null;

  type AdminTabType = 'overview' | 'products' | 'orders' | 'subscriptions' | 'payments' | 'customers' | 'site_customizer' | 'coupons' | 'faqs';
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [subFilter, setSubFilter] = useState<string>('all');
  const [subSearch, setSubSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<SubscriptionProduct | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  // Payment Method Management State
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<PaymentMethodConfig | null>(null);
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<string | null>(null);

  // Customer Management & Balance & Permissions State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'banned' | 'with_balance'>('all');
  const [selectedCustomerForBalance, setSelectedCustomerForBalance] = useState<CustomerUser | null>(null);
  const [selectedCustomerForPermissions, setSelectedCustomerForPermissions] = useState<CustomerUser | null>(null);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<CustomerUser | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [customerNotice, setCustomerNotice] = useState<string | null>(null);

  // Balance Form State
  const [balanceOpType, setBalanceOpType] = useState<'credit' | 'debit' | 'set'>('credit');
  const [balanceAmount, setBalanceAmount] = useState<number | string>(100);
  const [balanceReason, setBalanceReason] = useState<string>('شحن رصيد نقدي لحساب العميل');
  const [balanceAdminNote, setBalanceAdminNote] = useState<string>('');

  // Permissions Form State
  const [permIsBanned, setPermIsBanned] = useState<boolean>(false);
  const [permBanReason, setPermBanReason] = useState<string>('');
  const [permCanPurchase, setPermCanPurchase] = useState<boolean>(true);
  const [permCanUseCoupons, setPermCanUseCoupons] = useState<boolean>(true);
  const [permCanAccessPortal, setPermCanAccessPortal] = useState<boolean>(true);
  const [permNotes, setPermNotes] = useState<string>('');

  // New Customer Form State
  const [newCustId, setNewCustId] = useState<string>('');
  const [newCustName, setNewCustName] = useState<string>('');
  const [newCustEmail, setNewCustEmail] = useState<string>('');
  const [newCustPhone, setNewCustPhone] = useState<string>('');
  const [newCustBalance, setNewCustBalance] = useState<number | string>(0);
  const [newCustNotes, setNewCustNotes] = useState<string>('');

  // Form states for new payment method
  const [newPmKey, setNewPmKey] = useState('');
  const [newPmNameAr, setNewPmNameAr] = useState('');
  const [newPmNameEn, setNewPmNameEn] = useState('');
  const [newPmSubtitleAr, setNewPmSubtitleAr] = useState('');
  const [newPmAccountIdentifier, setNewPmAccountIdentifier] = useState('');
  const [newPmAccountHolder, setNewPmAccountHolder] = useState('');
  const [newPmInstructions, setNewPmInstructions] = useState('');
  const [newPmBadge, setNewPmBadge] = useState('جديد');
  const [newPmIconType, setNewPmIconType] = useState<'building' | 'smartphone' | 'card' | 'coins'>('building');

  // New product form modal state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Kings AI');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('ai-chat');
  const [newProdPrice, setNewProdPrice] = useState(150);
  const [newProdDuration, setNewProdDuration] = useState('سنة كاملة');

  // Site Customizer State (Full control over every text and setting on the website)
  const [localSettings, setLocalSettings] = useState<StoreSiteSettings>(() => {
    return siteSettings || {
      storeNameAr: 'كينجز ستور | King\'s Store',
      storeNameEn: 'King\'s Store AI Subscriptions',
      storeSlogan: 'الموزع المعتمد لاشتراكات وأدوات الذكاء الاصطناعي والتصميم في مصر والوطن العربي',
      announcementText: '🔥 عرض كينجز ستور الحصري: اشتراك كانفا برو 3 سنوات بـ 150 ج.م فقط | تفعيل على إيميلك الشخصي وضمان كامل المدة!',
      announcementCode: 'KINGS2025',
      isAnnouncementActive: true,
      heroBadgeText: 'كينجز ستور - الموزع المعتمد لاشتراكات الذكاء الاصطناعي والتصميم',
      heroTitleLeading: 'امتلك أقوى أدوات',
      heroTitleHighlight: 'الذكاء الاصطناعي',
      heroTitleTrailing: 'بأوفر سعر في مصر والوطن العربي',
      heroSubtitle: 'اشتراكات أصلية ورسمية 100% مع تفعيل فوري على إيميلك الشخصي دون الحاجة لكلمة السر. ضمان كامل المدة مع استبدال فوري ودعم فني متاح 24/7 عبر الواتساب.',
      guaranteeText1: 'تفعيل فوري خلال 5 - 15 دقيقة',
      guaranteeText2: 'ضمان استبدال كامل المدة 100%',
      guaranteeText3: 'دعم فني واستشارات متواصلة 24/7',
      whatsappNumber: '201099887766',
      whatsappMessagePreset: 'مرحباً كينجز ستور، أود الاستفسار عن اشتراكات الذكاء الاصطناعي وعروض اليوم.',
      telegramUsername: 'kingsstore_ai',
      supportEmail: 'support@kingsstore.ai',
      workingHoursText: 'خدمة العملاء متوفرة يومياً من 9:00 صباحاً حتى 2:00 بعد منتصف الليل بتوقيت القاهرة',
      footerCopyrightText: 'جميع الحقوق محفوظة © 2026 كينجز ستور (King\'s Store). المنصة الرائدة لحلول الذكاء الاصطناعي والتراخيص الرقمية.',
      deliveryTimeNotice: 'متوسط وقت التجهيز والتفعيل الفعلي لدينا هو 5 إلى 15 دقيقة فقط.',
      showReviewsSection: true,
      showFaqSection: true,
    };
  });
  const [siteSettingsSavedNotice, setSiteSettingsSavedNotice] = useState(false);

  // Sync incoming siteSettings prop if changed externally
  React.useEffect(() => {
    if (siteSettings) {
      setLocalSettings(siteSettings);
    }
  }, [siteSettings]);

  // Coupons Form State
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState<number | string>(20);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState<number | string>(150);
  const [newCouponDesc, setNewCouponDesc] = useState('');
  const [couponNotice, setCouponNotice] = useState<string | null>(null);

  // FAQs Form State
  const [isAddingFaq, setIsAddingFaq] = useState(false);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('التفعيل');
  const [faqNotice, setFaqNotice] = useState<string | null>(null);

  const totalRevenueEGP = orders.reduce((sum, o) => sum + o.totalEGP, 0);
  const completedOrders = orders.filter((o) => o.status === 'completed').length;
  const pendingOrders = orders.filter((o) => o.status !== 'completed').length;

  const totalWalletsBalanceEGP = customers.reduce((sum, c) => sum + (c.walletBalanceEGP || 0), 0);
  const bannedCustomersCount = customers.filter((c) => c.isBanned).length;
  const activeCustomersCount = customers.filter((c) => !c.isBanned).length;
  const withBalanceCount = customers.filter((c) => (c.walletBalanceEGP || 0) > 0).length;

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.includes(q)
      );
    }
    return true;
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.nameAr.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
  });

  const filteredCustomers = customers.filter((c) => {
    if (customerFilter === 'active' && c.isBanned) return false;
    if (customerFilter === 'banned' && !c.isBanned) return false;
    if (customerFilter === 'with_balance' && (c.walletBalanceEGP || 0) <= 0) return false;

    if (customerSearch.trim()) {
      const q = customerSearch.trim().toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        (c.banReason && c.banReason.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open Edit modal for a product
  const handleStartEdit = (product: SubscriptionProduct) => {
    // deep clone so edits don't mutate until explicitly saved
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  // Save changes to editing product
  const handleSaveProductChanges = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    onUpdateProduct(editingProduct);
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setEditingProduct(null);
    }, 1000);
  };

  // Add plan to editing product
  const handleAddPlanToEditingProduct = () => {
    if (!editingProduct) return;
    const newPlan: PlanVariant = {
      id: `plan-${Date.now()}`,
      durationLabel: 'باقة جديدة',
      durationMonths: 1,
      priceEGP: 150,
      originalPriceEGP: 300,
      deliveryType: 'invite',
      deliveryTypeLabel: 'تفعيل على إيميلك الخاص',
      isPopular: false,
    };
    setEditingProduct({
      ...editingProduct,
      plans: [...editingProduct.plans, newPlan],
    });
  };

  // Remove plan from editing product
  const handleRemovePlanFromEditingProduct = (planId: string) => {
    if (!editingProduct) return;
    if (editingProduct.plans.length <= 1) {
      alert('يجب أن يحتوي المنتج على باقة واحدة على الأقل');
      return;
    }
    setEditingProduct({
      ...editingProduct,
      plans: editingProduct.plans.filter((p) => p.id !== planId),
    });
  };

  // Update specific plan field
  const handleUpdatePlanField = (
    planId: string,
    field: keyof PlanVariant,
    value: any
  ) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      plans: editingProduct.plans.map((p) =>
        p.id === planId ? { ...p, [field]: value } : p
      ),
    });
  };

  // Add new product
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr.trim()) return;

    const newProduct: SubscriptionProduct = {
      id: `prod-${Date.now()}`,
      name: newProdNameEn || newProdNameAr,
      nameAr: newProdNameAr,
      slug: newProdNameEn.toLowerCase().replace(/\s+/g, '-') || `prod-${Date.now()}`,
      brand: newProdBrand || 'Kings AI',
      category: newProdCategory,
      badge: 'جديد ⚡',
      shortDescAr: 'اشتراك رسمي موثوق مع تفعيل فوري وضمان كامل المدة من كينجز ستور.',
      fullDescAr: 'اشتراك رسمي موثوق مع كامل الصلاحيات والدعم الفني طوال فترة الاشتراك.',
      iconName: 'Sparkles',
      colorScheme: {
        accent: '#F59E0B',
        bgGlow: 'rgba(245, 158, 11, 0.15)',
        border: 'rgba(245, 158, 11, 0.3)',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-400',
      },
      rating: 5.0,
      reviewsCount: 1,
      salesCount: 0,
      deliveryTime: 'خلال 10 دقائق',
      plans: [
        {
          id: `plan-${Date.now()}`,
          durationLabel: newProdDuration,
          durationMonths: 12,
          priceEGP: Number(newProdPrice),
          originalPriceEGP: Number(newProdPrice) * 1.5,
          deliveryType: 'invite',
          deliveryTypeLabel: 'تفعيل رسمي على إيميلك الخاص',
          isPopular: true,
        },
      ],
      featuresAr: [
        'تفعيل رسمي وسريع بدون الحاجة لكلمة السر',
        'ضمان كامل المدة مع استبدال فوري',
        'دعم فني متواصل عبر الواتساب',
      ],
      activationStepsAr: [
        'أدخل بريدك وسيتم إرسال دعوة التفعيل الرسمية',
      ],
      requirementsAr: 'إيميل شخصي نشط فقط',
      faqs: [
        {
          question: 'هل الاشتراك أصلي ومضمون؟',
          answer: 'نعم بضمان كينجز ستور الكامل طوال فترة اشتراكك.',
        },
      ],
    };

    onAddProduct(newProduct);
    setIsAddingProduct(false);
    setNewProdNameAr('');
    setNewProdNameEn('');
  };

  return (
    <div className="min-h-screen w-full bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-amber-500/30">
      
      {/* Standalone Admin Executive Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090d16]/95 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xl shadow-black/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-black text-white">
                منصة إدارة كينجز ستور
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-500/15 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                موقع التحكم المباشر
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden xs:block">
              التحكم الشامل في الاشتراكات، الأسعار، الطلبات، المحافظ، وتخصيص الموقع
            </p>
          </div>
        </div>

        {/* Action Controls & Store Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onClose}
            type="button"
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md shadow-amber-500/20 transition-all transform active:scale-95"
            title="معاينة المتجر المباشر كما يراه العميل"
          >
            <Globe className="w-4 h-4" />
            <span>معاينة المتجر 🌐</span>
          </button>

          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-mono text-[11px]">ahmedcraft153@gmail.com</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">مدير عام</span>
            {isSupabaseConfigured() ? (
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-emerald-500/30">
                <Database className="w-3 h-3 text-emerald-400" />
                <span>Supabase متصل</span>
              </span>
            ) : (
              <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded flex items-center gap-1 border border-slate-700">
                <Database className="w-3 h-3 text-slate-400" />
                <span>تخزين محلي</span>
              </span>
            )}
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
            title="تسجيل خروج الأدمن"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5">

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 p-4 sm:p-5 border-b border-slate-800 bg-slate-900/40">
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>إجمالي المبيعات</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              {formatPrice(totalRevenueEGP, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>طلبات قيد التفعيل</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              {pendingOrders} طلبات
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>طلبات مكتملة</span>
              <CheckCircle className="w-4 h-4 text-cyan-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">
              {completedOrders} طلب
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>الاشتراكات المتاحة</span>
              <Package className="w-4 h-4 text-purple-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-purple-400 font-mono">
              {products.length} أداة ذكاء
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>أرصدة المحافظ</span>
              <Wallet className="w-4 h-4 text-amber-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              {formatPrice(totalWalletsBalanceEGP, currency)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>العملاء والحظر</span>
              <Users className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-lg sm:text-xl font-black text-white font-mono">
              {customers.length} <span className="text-xs text-rose-400">({bannedCustomersCount} 🚫)</span>
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center justify-between px-3 sm:px-6 border-b border-slate-800 bg-slate-950/60 gap-2 overflow-x-auto">
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('overview')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>نظرة عامة 📊</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>الاشتراكات والأسعار ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>الطلبات ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscriptions')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'subscriptions'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>التراخيص ({subscriptions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'payments'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>طرق الدفع ({paymentMethods.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'customers'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>العملاء والمحافظ ({customers.length})</span>
              {bannedCustomersCount > 0 && (
                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-1 rounded">
                  {bannedCustomersCount} 🚫
                </span>
              )}
            </button>

            {/* Site Customizer Tab */}
            <button
              onClick={() => setActiveTab('site_customizer')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'site_customizer'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>تخصيص كامل للموقع ⚙️</span>
            </button>

            {/* Coupons Tab */}
            <button
              onClick={() => setActiveTab('coupons')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>الكوبونات ({coupons.length})</span>
            </button>

            {/* FAQs Tab */}
            <button
              onClick={() => setActiveTab('faqs')}
              type="button"
              className={`py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'faqs'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>الأسئلة الشائعة ({faqs.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2 py-1">
            {activeTab === 'products' && (
              <button
                onClick={() => setIsAddingProduct(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة منتج جديد</span>
              </button>
            )}

            {activeTab === 'payments' && (
              <button
                onClick={() => setIsAddingPaymentMethod(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة طريقة دفع</span>
              </button>
            )}

            {activeTab === 'customers' && (
              <button
                onClick={() => {
                  const randomId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
                  setNewCustId(randomId);
                  setNewCustName('');
                  setNewCustEmail('');
                  setNewCustPhone('');
                  setNewCustBalance(0);
                  setNewCustNotes('');
                  setIsAddingCustomer(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة عميل جديد 👤</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => setIsAddingCoupon(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إنشاء كود خصم 🎟️</span>
              </button>
            )}

            {activeTab === 'faqs' && (
              <button
                onClick={() => setIsAddingFaq(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة سؤال وجواب ❓</span>
              </button>
            )}

            {activeTab === 'site_customizer' && (
              <button
                onClick={() => {
                  if (onUpdateSiteSettings) {
                    onUpdateSiteSettings(localSettings);
                    setSiteSettingsSavedNotice(true);
                    setTimeout(() => setSiteSettingsSavedNotice(false), 3000);
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التعديلات فوراً 💾</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          
          {/* TAB 0: Overview & Quick Hub (نظرة عامة والتحكم السريع) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Welcome Card */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xl shadow-black/30">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                    <Crown className="w-7 h-7 text-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        مرحباً بك في منصة التحكم الشاملة لمتجر كينجز ستور 👑
                      </h3>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/40">
                        موقع مستقل
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                      هذا موقع الإدارة المستقل الخاص بك. يمكنك هنا تعديل أي شيء في المتجر: الأسعار، المنتجات، المحافظ، طرق الدفع، الطلبات، الكوبونات، والتصميم مع إمكانية المعاينة المباشرة بضغطة زر.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                  <button
                    onClick={onClose}
                    type="button"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Globe className="w-4 h-4" />
                    <span>معاينة المتجر المباشر 🌐</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('site_customizer')}
                    type="button"
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                    <span>تخصيص نصوص الموقع ⚙️</span>
                  </button>
                </div>
              </div>

              {/* Quick Jump Shortcuts Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{products.length}</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">الاشتراكات والأسعار</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">تعديل باقات وأسعار الأدوات</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('site_customizer')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20">
                      <SlidersHorizontal className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400">تعديل</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">تخصيص الموقع</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">تعديل أي نص، شعار، وواتساب</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('payments')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{paymentMethods.length}</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">طرق الدفع</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">انستاباي، فودافون كاش، بنوك</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('customers')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20">
                      <Users className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{customers.length}</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">العملاء والمحافظ</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">شحن/خصم رصيد وحظر</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('coupons')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20">
                      <Ticket className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-slate-500">{coupons.length}</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">أكواد الخصم</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">إنشاء عروض ترويجية</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 text-right transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono text-cyan-400">{orders.length}</span>
                  </div>
                  <span className="font-bold text-white text-xs sm:text-sm block">الطلبات والتفعيل</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">إرسال التراخيص وتأكيد الدفع</span>
                </button>
              </div>

              {/* Latest Orders Snapshot */}
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    <h4 className="font-bold text-white text-sm sm:text-base">آخر طلبات المتجر الحديثة</h4>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>عرض كافة الطلبات ({orders.length})</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400">
                        <th className="pb-2 font-semibold">رقم الطلب</th>
                        <th className="pb-2 font-semibold">العميل</th>
                        <th className="pb-2 font-semibold">المبلغ</th>
                        <th className="pb-2 font-semibold">طريقة الدفع</th>
                        <th className="pb-2 font-semibold">الحالة</th>
                        <th className="pb-2 font-semibold">الإجراء</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 font-mono font-bold text-white">{order.orderNumber}</td>
                          <td className="py-2.5 text-slate-300">
                            <div>{order.customerName}</div>
                            <span className="text-[10px] text-slate-500 font-mono">{order.customerEmail}</span>
                          </td>
                          <td className="py-2.5 font-mono font-bold text-amber-400">
                            {formatPrice(order.totalEGP, currency)}
                          </td>
                          <td className="py-2.5 text-slate-400 font-mono text-[11px]">{order.paymentMethod}</td>
                          <td className="py-2.5">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              order.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : order.status === 'activating'
                                ? 'bg-amber-500/20 text-amber-400'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {order.status === 'completed' ? 'مكتمل ✅' : order.status === 'activating' ? 'قيد التجهيز ⏳' : 'جديد'}
                            </span>
                          </td>
                          <td className="py-2.5">
                            <button
                              type="button"
                              onClick={() => setActiveTab('orders')}
                              className="text-amber-400 hover:text-amber-300 font-bold"
                            >
                              إدارة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: Products & Price Manager */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* Product search & count bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="ابحث عن اشتراك لتعديل سعره..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  اضغط على زر <strong className="text-amber-400">"تعديل المنتج والأسعار"</strong> لتغيير أي سعر أو إضافة باقات جديدة.
                </span>
              </div>

              {/* Products Cards Grid with Direct Edit & Price controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((p) => {
                  const defaultPlan = p.plans.find((pl) => pl.isPopular) || p.plans[0];
                  return (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-start gap-3 mb-2">
                          <div className="shrink-0 mt-0.5">
                            <ProductBrandIcon slug={p.slug} brand={p.brand} size="md" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-semibold text-slate-400">{p.brand}</span>
                              {p.badge && (
                                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {p.badge}
                                </span>
                              )}
                            </div>

                            <h4 className="font-extrabold text-white text-sm leading-snug">
                              {p.nameAr}
                            </h4>
                            <span className="text-[11px] text-slate-500 font-mono block mt-0.5" dir="ltr">
                              {p.name}
                            </span>
                          </div>
                        </div>

                        {/* List of current active plans & prices */}
                        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400 block font-semibold">
                            الباقات والأسعار الحالية ({p.plans.length}):
                          </span>
                          {p.plans.map((pl) => (
                            <div
                              key={pl.id}
                              className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                {pl.isPopular && <span className="text-amber-400 text-[10px]">★</span>}
                                <span className="text-slate-200 truncate">{pl.durationLabel}</span>
                              </div>
                              <span className="font-mono font-black text-amber-400 text-xs shrink-0">
                                {formatPrice(pl.priceEGP, currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل المنتج والأسعار</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف اشتراك "${p.nameAr}" من المتجر؟`)) {
                              onDeleteProduct(p.id);
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                          title="حذف المنتج"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 2: Orders Manager */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">تصفية حسب الحالة:</span>
                  {(['all', 'verifying_payment', 'activating', 'completed'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg border transition-all ${
                        orderFilter === st
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {st === 'all' && 'الكل'}
                      {st === 'verifying_payment' && 'قيد التأكيد'}
                      {st === 'activating' && 'جاري التفعيل'}
                      {st === 'completed' && 'مكتمل'}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="بحث برقم الطلب، الإيميل، الاسم..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-3">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    لا توجد طلبات تطابق الفلتر المحدد.
                  </div>
                ) : (
                  filteredOrders.map((ord) => {
                    const whatsappMsg = encodeURIComponent(
                      `مرحباً ${ord.customerName}، معك الدعم الفني من كينجز ستور بخصوص طلبك رقم ${ord.orderNumber}. تم تفعيل اشتراكك بنجاح!`
                    );
                    const whatsappLink = `https://wa.me/${ord.customerPhone.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`;

                    return (
                      <div
                        key={ord.id}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-black text-amber-400 text-sm">
                              {ord.orderNumber}
                            </span>
                            <span className="text-xs font-bold text-white">
                              {ord.customerName}
                            </span>
                            <span className="text-xs text-slate-400">
                              ({new Date(ord.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })})
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              ord.status === 'completed'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : ord.status === 'activating'
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {ord.status === 'completed' && '✓ مكتمل وتم التسليم'}
                              {ord.status === 'activating' && '⚡ جاري التفعيل'}
                              {ord.status === 'verifying_payment' && '⏳ قيد التأكيد'}
                              {ord.status === 'pending_payment' && 'بانتظار الدفع'}
                            </span>

                            <span className="font-mono font-black text-sm text-white">
                              {formatPrice(ord.totalEGP, currency)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items & Customer details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                          {/* Subscriptions */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">الاشتراك المطلوب:</span>
                            {ord.items.map((it, idx) => (
                              <div key={idx} className="text-slate-200">
                                • {it.productName} ({it.planLabel})
                              </div>
                            ))}
                          </div>

                          {/* Customer Email & Phone */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">بيانات التسليم:</span>
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Mail className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono">{ord.customerEmail}</span>
                              <button
                                onClick={() => handleCopy(ord.customerEmail, `mail-${ord.id}`)}
                                className="text-amber-400 hover:text-amber-300 ml-1"
                                title="نسخ البريد لإرسال الدعوة"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              {copiedId === `mail-${ord.id}` && (
                                <span className="text-[10px] text-emerald-400">تم!</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-200">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span className="font-mono" dir="ltr">{ord.customerPhone}</span>
                            </div>
                          </div>

                          {/* Payment method & Reference */}
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-semibold">طريقة الدفع والمرجع:</span>
                            <div className="text-slate-200">
                              طريقة: <strong className="text-amber-400">{ord.paymentMethod}</strong>
                            </div>
                            <div className="text-slate-300">
                              مرجع التحويل: <span className="font-mono">{ord.paymentReference}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions strip for Seller */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">تحديث الحالة:</span>
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'activating', 'تم تأكيد استلام المبلغ وجاري إرسال الدعوة')}
                              className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-semibold"
                            >
                              بدء التفعيل
                            </button>
                            <button
                              onClick={() => onUpdateOrderStatus(ord.id, 'completed', 'تم تفعيل الحساب وإرسال الدعوة بنجاح')}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-semibold"
                            >
                              إكمال الطلب
                            </button>
                          </div>

                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>مراسلة العميل واتساب</span>
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Customer Subscriptions Management & Auto-Renewals */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-4">
              
              {/* Stats overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[11px] text-emerald-400 block font-semibold">اشتراكات نشطة</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'active').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <span className="text-[11px] text-purple-400 block font-semibold">تجديد تلقائي مفعل</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.autoRenew).length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[11px] text-amber-400 block font-semibold">قيد التجديد</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'pending_renewal').length}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <span className="text-[11px] text-rose-400 block font-semibold">منتهية أو ملغاة</span>
                  <span className="text-lg font-black text-white font-mono">
                    {subscriptions.filter((s) => s.status === 'expired' || s.status === 'cancelled').length}
                  </span>
                </div>
              </div>

              {/* Subscriptions Filter and Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {[
                    { id: 'all', label: 'الكل' },
                    { id: 'active', label: 'نشط' },
                    { id: 'pending_renewal', label: 'قيد التجديد' },
                    { id: 'expired', label: 'منتهي' },
                    { id: 'cancelled', label: 'ملغى' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setSubFilter(tab.id)}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                        subFilter === tab.id
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-72">
                  <input
                    type="text"
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    placeholder="بحث بإيميل العميل أو اسم الأداة..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Subscriptions Cards List */}
              <div className="space-y-3">
                {subscriptions
                  .filter((sub) => {
                    if (subFilter !== 'all' && sub.status !== subFilter) return false;
                    if (subSearch.trim()) {
                      const q = subSearch.toLowerCase().trim();
                      return (
                        sub.customerName.toLowerCase().includes(q) ||
                        sub.customerEmail.toLowerCase().includes(q) ||
                        sub.customerPhone.includes(q) ||
                        sub.productName.toLowerCase().includes(q) ||
                        sub.planLabel.toLowerCase().includes(q)
                      );
                    }
                    return true;
                  })
                  .map((sub) => {
                    const endStr = sub.expiryDate || sub.endDate || new Date().toISOString();
                    const daysRemaining = Math.max(
                      0,
                      Math.ceil((new Date(endStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                    );

                    const reminderMsg = encodeURIComponent(
                      `مرحباً ${sub.customerName}، معك الدعم الفني من كينجز ستور بخصوص اشتراكك في ${sub.productName}. باقي على انتهاء اشتراكك ${daysRemaining} يوم. هل ترغب في التجديد والحفاظ على استمرارية الخدمة بنفس السعر المخفض (${sub.renewalPriceEGP} ج.م)؟`
                    );
                    const whatsappLink = `https://wa.me/${sub.customerPhone.replace(/[^0-9]/g, '')}?text=${reminderMsg}`;

                    return (
                      <div
                        key={sub.id}
                        className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                          <div className="flex items-center gap-3">
                            <ProductBrandIcon slug={sub.productSlug} brand={sub.productName} size="sm" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{sub.productName}</span>
                                <span className="text-xs text-amber-400/90 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                  {sub.planLabel}
                                </span>
                              </div>
                              <span className="text-[11px] text-slate-400">
                                العميل: <strong className="text-slate-200">{sub.customerName}</strong> ({sub.customerEmail})
                              </span>
                            </div>
                          </div>

                          {/* Status changer */}
                          <div className="flex items-center gap-2">
                            <select
                              value={sub.status}
                              onChange={(e) => onUpdateSubscriptionStatus(sub.id, e.target.value as SubscriptionStatus)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                sub.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                                  : sub.status === 'pending_renewal'
                                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                                  : sub.status === 'expired'
                                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                  : 'bg-slate-700 text-slate-300 border-slate-600'
                              }`}
                            >
                              <option value="active">نشط (Active)</option>
                              <option value="pending_renewal">قيد التجديد (Pending Renewal)</option>
                              <option value="expired">منتهي الصلاحية (Expired)</option>
                              <option value="cancelled">ملغى (Cancelled)</option>
                            </select>

                            <button
                              onClick={() => onToggleCustomerAutoRenew(sub.id, !sub.autoRenew)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                                sub.autoRenew
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30'
                                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                              title="تبديل حالة التجديد التلقائي"
                            >
                              <RefreshCw className={`w-3 h-3 ${sub.autoRenew ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
                              <span>{sub.autoRenew ? 'تجديد مجدول' : 'تجديد يدوي'}</span>
                            </button>
                          </div>
                        </div>

                        {/* Dates & Remaining days bar */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                          <div>
                            <span className="text-slate-400 block mb-0.5">فترة الاشتراك:</span>
                            <span className="text-slate-200 font-mono text-[11px]">
                              {sub.startDate} إلى {endStr}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-slate-400 mb-1">
                              <span>الأيام المتبقية:</span>
                              <span className="font-bold text-amber-400 font-mono">{daysRemaining} يوم</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  daysRemaining > 30 ? 'bg-emerald-500' : daysRemaining > 7 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${Math.min(100, (daysRemaining / 365) * 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div>
                            <span className="text-slate-400 block mb-0.5">قيمة التجديد القادم:</span>
                            <span className="text-emerald-400 font-bold font-mono">
                              {formatPrice(sub.renewalPriceEGP, currency)}
                            </span>
                            {sub.autoRenew && sub.autoRenewDate && (
                              <span className="text-[10px] text-purple-300 block">
                                مجدول في: {sub.autoRenewDate}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Credentials viewer & quick extension actions */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                          {/* Credentials summary */}
                          <div className="flex items-center gap-2">
                            {sub.credentials?.email && (
                              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono text-[11px] border border-slate-800">
                                <span>{sub.credentials.email}</span>
                                <button
                                  onClick={() => handleCopy(sub.credentials!.email!, `sub-mail-${sub.id}`)}
                                  className="text-slate-400 hover:text-white"
                                  title="نسخ الإيميل"
                                >
                                  {copiedId === `sub-mail-${sub.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                            {sub.credentials?.password && (
                              <div className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded text-slate-300 font-mono text-[11px] border border-slate-800">
                                <span>••••••</span>
                                <button
                                  onClick={() => handleCopy(sub.credentials!.password!, `sub-pass-${sub.id}`)}
                                  className="text-slate-400 hover:text-white"
                                  title="نسخ كلمة السر"
                                >
                                  {copiedId === `sub-pass-${sub.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Key className="w-3 h-3" />}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Quick Admin Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onExtendSubscription(sub.id, 30)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                            >
                              + تمديد 30 يوم
                            </button>

                            <button
                              onClick={() => onExtendSubscription(sub.id, 365)}
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-colors border border-amber-500/30"
                            >
                              + تمديد سنة كاملة
                            </button>

                            <a
                              href={whatsappLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>تذكير تجديد واتساب</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: PAYMENT METHODS MANAGEMENT (إدارة وتعديل طرق الدفع للآدمن فقط) */}
          {/* ========================================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Admin Info Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        إدارة وتعديل طرق الدفع والتحويل (صلاحيات الأدمن فقط 🔒)
                      </h4>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/40">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      يمكنك هنا تعديل أرقام محافظ فودافون كاش، عنوان انستاباي IPA، عناوين USDT، أو بيانات البطاقات. أي تعديل تقوم بحفظه ينعكس فوراً ومباشرة على صفحة إتمام الطلب (Checkout) لدى جميع العملاء.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setNewPmKey(`pm-${Date.now()}`);
                      setNewPmNameAr('');
                      setNewPmNameEn('');
                      setNewPmSubtitleAr('تحويل فوري');
                      setNewPmAccountIdentifier('');
                      setNewPmAccountHolder('Kings Store');
                      setNewPmInstructions('قم بالتحويل على العنوان الموضح وأدخل اسم صاحب التحويل.');
                      setNewPmBadge('جديد');
                      setNewPmIconType('building');
                      setIsAddingPaymentMethod(true);
                    }}
                    type="button"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة وسيلة دفع جديدة</span>
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm('هل تريد استعادة وسائل الدفع الأصلية الافتراضية؟')) {
                        onResetPaymentMethods();
                        setPaymentNotice('تمت استعادة وسائل الدفع الافتراضية بنجاح.');
                        setTimeout(() => setPaymentNotice(null), 3000);
                      }
                    }}
                    type="button"
                    title="استعادة الإعدادات الافتراضية"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-all active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">استعادة الافتراضي</span>
                  </button>
                </div>
              </div>

              {/* Notice toast if any */}
              {paymentNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{paymentNotice}</span>
                </div>
              )}

              {/* Payment Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((pm) => {
                  const getIcon = () => {
                    switch (pm.iconType) {
                      case 'smartphone':
                        return <Smartphone className="w-6 h-6 text-rose-400" />;
                      case 'card':
                        return <CreditCard className="w-6 h-6 text-blue-400" />;
                      case 'coins':
                        return <Coins className="w-6 h-6 text-emerald-400" />;
                      case 'building':
                      default:
                        return <Building2 className="w-6 h-6 text-amber-400" />;
                    }
                  };

                  return (
                    <div
                      key={pm.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                        pm.isEnabled
                          ? 'bg-slate-900/90 border-slate-700/80 shadow-md shadow-black/30'
                          : 'bg-slate-900/40 border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div>
                        {/* Top Row: Icon, Title, Status & Toggle */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-start gap-3">
                            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 shrink-0">
                              {getIcon()}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-white text-base">{pm.nameAr}</h4>
                                {pm.badge && (
                                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                                    {pm.badge}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400 font-mono block mt-0.5" dir="ltr">
                                {pm.nameEn} · ({pm.key})
                              </span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {pm.subtitleAr}
                              </span>
                            </div>
                          </div>

                          {/* Quick Enable/Disable Toggle */}
                          <button
                            onClick={() => {
                              onTogglePaymentMethod(pm.id, !pm.isEnabled);
                              setPaymentNotice(`تم ${!pm.isEnabled ? 'تفعيل' : 'تعطيل'} وسيلة الدفع (${pm.nameAr}) بنجاح.`);
                              setTimeout(() => setPaymentNotice(null), 2500);
                            }}
                            type="button"
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                              pm.isEnabled
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                            }`}
                            title="تفعيل أو تعطيل ظهور وسيلة الدفع للعملاء"
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{pm.isEnabled ? 'مفعلة بالمتجر' : 'معطلة'}</span>
                          </button>
                        </div>

                        {/* Account Identifier & Holder Card */}
                        <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 mb-3">
                          <div>
                            <span className="text-[11px] text-slate-400 block mb-1">
                              رقم الحساب / عنوان التحويل / المحفظة:
                            </span>
                            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
                              <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm select-all break-all">
                                {pm.accountIdentifier}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(pm.accountIdentifier);
                                  setCopiedId(pm.id);
                                  setTimeout(() => setCopiedId(null), 2000);
                                }}
                                className="text-xs text-slate-400 hover:text-amber-300 shrink-0"
                                title="نسخ"
                              >
                                {copiedId === pm.id ? (
                                  <span className="text-[10px] text-emerald-400 font-bold">تم النسخ!</span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          {pm.accountHolderName && (
                            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                              <span className="text-slate-400">اسم صاحب الحساب / المستلم:</span>
                              <span className="font-semibold text-slate-200">{pm.accountHolderName}</span>
                            </div>
                          )}
                        </div>

                        {/* Instructions text */}
                        <div className="mb-4">
                          <span className="text-[11px] text-slate-400 block mb-0.5">تعليمات التحويل للعميل:</span>
                          <p className="text-xs text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/50 leading-relaxed">
                            {pm.instructionsAr}
                          </p>
                        </div>
                      </div>

                      {/* Actions: Edit & Delete */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => setEditingPaymentMethod({ ...pm })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all active:scale-95"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>تعديل البيانات</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف وسيلة الدفع (${pm.nameAr})؟`)) {
                              onDeletePaymentMethod(pm.id);
                              setPaymentNotice(`تم حذف (${pm.nameAr}) بنجاح.`);
                              setTimeout(() => setPaymentNotice(null), 2500);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                          title="حذف طريقة الدفع"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: CUSTOMER MANAGEMENT & WALLET BALANCE & PERMISSIONS (العملاء والمحافظ) */}
          {/* ========================================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              
              {/* Admin Info Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/20">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-sm sm:text-base">
                        التحكم في العملاء، الأرصدة، والصلاحيات (الأدمن فقط 🔒)
                      </h4>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-md border border-amber-500/40">
                        Admin Only
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      تحكم كامل في رصيد محفظة العميل عبر معرّف العميل (Customer ID). يمكنك شحن وخصم الرصيد، حظر الحسابات، والتحكم بصلاحيات الشراء والكوبونات فوراً مع الحفظ الدائم.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      const randomId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
                      setNewCustId(randomId);
                      setNewCustName('');
                      setNewCustEmail('');
                      setNewCustPhone('');
                      setNewCustBalance(0);
                      setNewCustNotes('');
                      setIsAddingCustomer(true);
                    }}
                    type="button"
                    className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة عميل جديد 👤</span>
                  </button>
                </div>
              </div>

              {/* Notification toast if any */}
              {customerNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{customerNotice}</span>
                </div>
              )}

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-slate-900/60 p-3 sm:p-4 rounded-2xl border border-slate-800">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="ابحث عبر ID العميل (مثل CUST-8821)، الاسم، الإيميل، أو رقم الهاتف..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-sans"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
                  {customerSearch && (
                    <button
                      onClick={() => setCustomerSearch('')}
                      className="absolute left-3 top-3 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                  <button
                    onClick={() => setCustomerFilter('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      customerFilter === 'all'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    الكل ({customers.length})
                  </button>

                  <button
                    onClick={() => setCustomerFilter('active')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      customerFilter === 'active'
                        ? 'bg-emerald-500 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    نشط ({activeCustomersCount})
                  </button>

                  <button
                    onClick={() => setCustomerFilter('banned')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      customerFilter === 'banned'
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    محظور 🚫 ({bannedCustomersCount})
                  </button>

                  <button
                    onClick={() => setCustomerFilter('with_balance')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      customerFilter === 'with_balance'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    أصحاب أرصدة 💳 ({withBalanceCount})
                  </button>
                </div>
              </div>

              {/* Customers Cards Grid */}
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                  <UserX className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-300 font-bold text-sm">لم يتم العثور على أي عميل يطابق معايير البحث</p>
                  <p className="text-xs text-slate-500 mt-1">تأكد من كتابة ID العميل أو البريد بشكل صحيح</p>
                  {customerSearch && (
                    <button
                      onClick={() => setCustomerSearch('')}
                      className="mt-3 px-3 py-1.5 rounded-lg bg-slate-800 text-amber-400 text-xs font-bold hover:bg-slate-700"
                    >
                      إعادة تعيين البحث
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCustomers.map((cust) => {
                    const isBanned = cust.isBanned;

                    return (
                      <div
                        key={cust.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                          isBanned
                            ? 'bg-rose-950/20 border-rose-500/40 shadow-md shadow-rose-950/20'
                            : 'bg-slate-900/90 border-slate-700/80 shadow-md shadow-black/30'
                        }`}
                      >
                        <div>
                          {/* Top row: Customer ID, status badge */}
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                                <span>{cust.id}</span>
                                <button
                                  type="button"
                                  onClick={() => handleCopy(cust.id, cust.id)}
                                  className="text-slate-400 hover:text-amber-300 transition-colors"
                                  title="نسخ ID العميل"
                                >
                                  {copiedId === cust.id ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </span>

                              {isBanned ? (
                                <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded-md border border-rose-500/40 flex items-center gap-1">
                                  <Ban className="w-3 h-3 text-rose-400" />
                                  <span>محظور</span>
                                </span>
                              ) : (
                                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-500/40 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  <span>نشط</span>
                                </span>
                              )}
                            </div>

                            <span className="text-[10px] text-slate-500">
                              {new Date(cust.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                          </div>

                          {/* Customer Name & Contacts */}
                          <div className="space-y-1.5 mb-3">
                            <h4 className="text-base font-black text-white flex items-center gap-2">
                              <span>{cust.name}</span>
                              {cust.totalSpentEGP > 1000 && (
                                <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded font-mono">
                                  VIP 👑
                                </span>
                              )}
                            </h4>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                              <span className="flex items-center gap-1 text-slate-400 font-mono">
                                <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                <span>{cust.email}</span>
                              </span>

                              {cust.phone && (
                                <span className="flex items-center gap-1 text-slate-400 font-mono">
                                  <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                  <span>{cust.phone}</span>
                                  <a
                                    href={`https://wa.me/2${cust.phone.replace(/^0/, '')}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-emerald-400 hover:text-emerald-300 text-[10px] underline ml-1"
                                    title="مراسلة واتساب"
                                  >
                                    واتساب
                                  </a>
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Ban Reason alert if banned */}
                          {isBanned && (
                            <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 mb-3 text-xs text-rose-300 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">سبب الحظر والإيقاف:</span>
                                <span>{cust.banReason || 'قرار إداري بسبب مخالفة شروط الاستخدام'}</span>
                                {cust.banDate && (
                                  <span className="block text-[10px] text-rose-400/80 mt-0.5 font-mono">
                                    تاريخ الحظر: {cust.banDate}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Customer Internal Notes */}
                          {cust.notes && (
                            <p className="text-xs text-slate-400 bg-slate-950/40 p-2 rounded-lg border border-slate-800 mb-3 italic">
                              📝 {cust.notes}
                            </p>
                          )}

                          {/* Balance & Permissions Card */}
                          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                            <div>
                              <span className="text-[11px] text-slate-400 block mb-0.5">رصيد المحفظة المتاح:</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-amber-400 font-mono">
                                  {formatPrice(cust.walletBalanceEGP || 0, currency)}
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {cust.walletTransactions?.length || 0} عملية سابقة مسجلة
                              </span>
                            </div>

                            <div className="space-y-1 text-[11px] border-r-0 sm:border-r sm:border-slate-800/80 sm:pr-3">
                              <span className="text-slate-400 block font-semibold mb-1">الصلاحيات:</span>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">إتمام الشراء:</span>
                                <span className={cust.canPurchase !== false && !isBanned ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                  {cust.canPurchase !== false && !isBanned ? 'مسموح ✅' : 'ممنوع ❌'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">استخدام الكوبونات:</span>
                                <span className={cust.canUseCoupons !== false && !isBanned ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                  {cust.canUseCoupons !== false && !isBanned ? 'مسموح ✅' : 'ممنوع ❌'}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400">بوابة الاشتراكات:</span>
                                <span className={cust.canAccessPortal !== false && !isBanned ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                  {cust.canAccessPortal !== false && !isBanned ? 'مسموح ✅' : 'ممنوع ❌'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Actions Buttons */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {/* Balance Control Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerForBalance(cust);
                                setBalanceOpType('credit');
                                setBalanceAmount(100);
                                setBalanceReason('شحن رصيد نقدي لحساب العميل');
                                setBalanceAdminNote('');
                              }}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all active:scale-95"
                              title="شحن أو خصم أو تعيين رصيد محفظة العميل"
                            >
                              <Wallet className="w-3.5 h-3.5" />
                              <span>التحكم بالرصيد</span>
                            </button>

                            {/* Permissions & Ban Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCustomerForPermissions(cust);
                                setPermIsBanned(cust.isBanned);
                                setPermBanReason(cust.banReason || 'محاولة إرسال إيصالات تحويل بنكي وهمية متكررة');
                                setPermCanPurchase(cust.canPurchase !== false);
                                setPermCanUseCoupons(cust.canUseCoupons !== false);
                                setPermCanAccessPortal(cust.canAccessPortal !== false);
                                setPermNotes(cust.notes || '');
                              }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                                isBanned
                                  ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border-rose-500/40'
                                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700'
                              }`}
                              title="تعديل صلاحيات العميل وحظر الحساب"
                            >
                              <ShieldOff className="w-3.5 h-3.5 text-rose-400" />
                              <span>{isBanned ? 'إدارة الحظر' : 'الصلاحيات والحظر'}</span>
                            </button>

                            {/* Transactions History Button */}
                            <button
                              type="button"
                              onClick={() => setSelectedCustomerForHistory(cust)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition-all active:scale-95"
                              title="استعراض سجل حركات المحفظة السابقة"
                            >
                              <History className="w-3.5 h-3.5 text-cyan-400" />
                              <span>سجل العمليات ({cust.walletTransactions?.length || 0})</span>
                            </button>
                          </div>

                          {/* Delete customer */}
                          {onDeleteCustomer && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`هل أنت متأكد من حذف العميل (${cust.name} - ${cust.id}) نهائياً؟`)) {
                                  onDeleteCustomer(cust.id);
                                  setCustomerNotice(`تم حذف حساب العميل (${cust.name}) بنجاح.`);
                                  setTimeout(() => setCustomerNotice(null), 2500);
                                }
                              }}
                              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                              title="حذف حساب العميل"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: SITE CUSTOMIZER - "تعديل أي شيء في الموقع" */}
          {/* ========================================================================= */}
          {activeTab === 'site_customizer' && (
            <div className="space-y-6">
              
              {/* Top Banner with Save Status */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base flex items-center gap-2">
                      <span>تخصيص كامل لكافة نصوص وبيانات وروابط الموقع ⚙️</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
                        تحكم فوري
                      </span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      من هنا يمكنك تعديل أي نص في الموقع: اسم المتجر، الشريط الإعلاني، نصوص الهيرو الكبرى، أرقام الواتساب، والفوتر مع حفظ دائم وتحديث حي للعميل.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      if (onUpdateSiteSettings) {
                        onUpdateSiteSettings(localSettings);
                        setSiteSettingsSavedNotice(true);
                        setTimeout(() => setSiteSettingsSavedNotice(false), 3000);
                      }
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ كل تعديلات الموقع 💾</span>
                  </button>
                </div>
              </div>

              {/* Toast if saved */}
              {siteSettingsSavedNotice && (
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>تم حفظ وتطبيق كافة إعدادات ونصوص الموقع فوراً! يمكنك الضغط على 'معاينة المتجر' للتأكد.</span>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
                
                {/* Section 1: Store Branding & Identity */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800/80 pb-2">
                    <Crown className="w-4 h-4" />
                    <span>1. هوية واسم وشعار المتجر (Branding)</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">اسم المتجر بالعربية:</label>
                    <input
                      type="text"
                      value={localSettings.storeNameAr}
                      onChange={(e) => setLocalSettings({ ...localSettings, storeNameAr: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">اسم المتجر بالإنجليزية:</label>
                    <input
                      type="text"
                      value={localSettings.storeNameEn}
                      onChange={(e) => setLocalSettings({ ...localSettings, storeNameEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">الشعار التسويقي والوصفي (Slogan):</label>
                    <textarea
                      rows={2}
                      value={localSettings.storeSlogan}
                      onChange={(e) => setLocalSettings({ ...localSettings, storeSlogan: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Section 2: Announcement Bar */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold">
                      <Bell className="w-4 h-4" />
                      <span>2. شريط الإعلانات الترويجي العلوي</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setLocalSettings({ ...localSettings, isAnnouncementActive: !localSettings.isAnnouncementActive })}
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                        localSettings.isAnnouncementActive
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {localSettings.isAnnouncementActive ? 'مفعّل وشغال 🟢' : 'معطل ومخفي ⚪'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">نص الإعلان في الشريط العلوي:</label>
                    <textarea
                      rows={2}
                      value={localSettings.announcementText}
                      onChange={(e) => setLocalSettings({ ...localSettings, announcementText: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                      placeholder="اكتب الإعلان الترويجي الذي يظهر أعلى الموقع..."
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">كود الخصم المعروض بالشريط:</label>
                    <input
                      type="text"
                      value={localSettings.announcementCode}
                      onChange={(e) => setLocalSettings({ ...localSettings, announcementCode: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400 uppercase"
                    />
                  </div>
                </div>

                {/* Section 3: Main Hero Banner */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4 lg:col-span-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800/80 pb-2">
                    <Sparkles className="w-4 h-4" />
                    <span>3. نصوص وعناوين البانر الرئيسي (Hero Section)</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">شارة البانر العلوية (Badge):</label>
                    <input
                      type="text"
                      value={localSettings.heroBadgeText}
                      onChange={(e) => setLocalSettings({ ...localSettings, heroBadgeText: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">بداية العنوان الرئيسي:</label>
                      <input
                        type="text"
                        value={localSettings.heroTitleLeading}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroTitleLeading: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-amber-400 font-semibold mb-1">الكلمة الملونة المتوهجة:</label>
                      <input
                        type="text"
                        value={localSettings.heroTitleHighlight}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroTitleHighlight: e.target.value })}
                        className="w-full bg-slate-800 border border-amber-500/50 rounded-xl px-3 py-2 text-amber-300 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">تكملة العنوان الرئيسي:</label>
                      <input
                        type="text"
                        value={localSettings.heroTitleTrailing}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroTitleTrailing: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">الوصف التسويقي أسفل العنوان:</label>
                    <textarea
                      rows={2}
                      value={localSettings.heroSubtitle}
                      onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نص الضمان 1 (تفعيل):</label>
                      <input
                        type="text"
                        value={localSettings.guaranteeText1}
                        onChange={(e) => setLocalSettings({ ...localSettings, guaranteeText1: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نص الضمان 2 (استبدال):</label>
                      <input
                        type="text"
                        value={localSettings.guaranteeText2}
                        onChange={(e) => setLocalSettings({ ...localSettings, guaranteeText2: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">نص الضمان 3 (دعم):</label>
                      <input
                        type="text"
                        value={localSettings.guaranteeText3}
                        onChange={(e) => setLocalSettings({ ...localSettings, guaranteeText3: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 4: Support & WhatsApp */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-slate-800/80 pb-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>4. بيانات الدعم الفني والواتساب الفعلي</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      رقم الواتساب الفعلي (مفتاح الدولة بدون +):
                    </label>
                    <input
                      type="text"
                      value={localSettings.whatsappNumber}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappNumber: e.target.value })}
                      placeholder="2010XXXXXXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-400"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      هذا الرقم هو الذي يتم تحويل العميل إليه عند النقر على أي زر واتساب في الموقع
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">رسالة الواتساب الجاهزة:</label>
                    <textarea
                      rows={2}
                      value={localSettings.whatsappMessagePreset}
                      onChange={(e) => setLocalSettings({ ...localSettings, whatsappMessagePreset: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">يوزر التيليجرام:</label>
                      <input
                        type="text"
                        value={localSettings.telegramUsername}
                        onChange={(e) => setLocalSettings({ ...localSettings, telegramUsername: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">بريد الدعم الفني:</label>
                      <input
                        type="email"
                        value={localSettings.supportEmail}
                        onChange={(e) => setLocalSettings({ ...localSettings, supportEmail: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">مواعيد وساعات العمل الموضحة للعميل:</label>
                    <input
                      type="text"
                      value={localSettings.workingHoursText}
                      onChange={(e) => setLocalSettings({ ...localSettings, workingHoursText: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                {/* Section 5: Footer & Section Toggles */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-amber-400 font-bold border-b border-slate-800/80 pb-2">
                    <FileText className="w-4 h-4" />
                    <span>5. الفوتر، إشعارات التسليم، والأقسام</span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">نص حقوق النشر والملكية (الفوتر):</label>
                    <textarea
                      rows={2}
                      value={localSettings.footerCopyrightText}
                      onChange={(e) => setLocalSettings({ ...localSettings, footerCopyrightText: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">تنبيه مدة التسليم المعروض في الطلبات:</label>
                    <input
                      type="text"
                      value={localSettings.deliveryTimeNotice}
                      onChange={(e) => setLocalSettings({ ...localSettings, deliveryTimeNotice: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-slate-300 font-bold block">إظهار أو إخفاء أقسام المتجر:</span>
                    
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer">
                      <div>
                        <span className="font-semibold text-white block">إظهار قسم آراء وتقييمات العملاء</span>
                        <span className="text-[11px] text-slate-400">قسم المراجعات والتقييمات بالصفحة الرئيسية</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localSettings.showReviewsSection}
                        onChange={(e) => setLocalSettings({ ...localSettings, showReviewsSection: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer">
                      <div>
                        <span className="font-semibold text-white block">إظهار قسم الأسئلة الشائعة (FAQ)</span>
                        <span className="text-[11px] text-slate-400">الأسئلة الشائعة والإجابات في أسفل الصفحة الرئيسية</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={localSettings.showFaqSection}
                        onChange={(e) => setLocalSettings({ ...localSettings, showFaqSection: e.target.checked })}
                        className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                      />
                    </label>
                  </div>
                </div>

              </div>

              {/* Bottom Save Action */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  سيتم تطبيق التعديلات فوراً على المتجر وحفظها في التخزين المحلي.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateSiteSettings) {
                      onUpdateSiteSettings(localSettings);
                      setSiteSettingsSavedNotice(true);
                      setTimeout(() => setSiteSettingsSavedNotice(false), 3000);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ كل تعديلات الموقع فوراً 💾</span>
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 7: COUPONS & DISCOUNTS MANAGEMENT (إدارة الكوبونات) */}
          {/* ========================================================================= */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      إدارة الكوبونات وأكواد الخصم الترويجية 🎟️
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      يمكنك إنشاء أكواد خصم بنسبة مئوية أو بمبلغ ثابت وتحديد الحد الأدنى للمشتريات
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إنشاء كود خصم جديد</span>
                </button>
              </div>

              {couponNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{couponNotice}</span>
                </div>
              )}

              {/* Coupons Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      coupon.isActive
                        ? 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50'
                        : 'bg-slate-950/60 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/30">
                        {coupon.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateCoupon) {
                            onUpdateCoupon(coupon.id, { isActive: !coupon.isActive });
                          }
                        }}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          coupon.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {coupon.isActive ? 'مفعّل 🟢' : 'معطل ⚪'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 font-medium">{coupon.descriptionAr}</p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
                      <span>
                        الخصم:{' '}
                        <strong className="text-white">
                          {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `${coupon.discountValue} ج.م`}
                        </strong>
                      </span>
                      <span>الحد الأدنى: {coupon.minSpendEGP} ج.م</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>استُخدم: {coupon.usageCount || 0} مرة</span>
                      {onDeleteCoupon && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`هل أنت متأكد من حذف الكود (${coupon.code})؟`)) {
                              onDeleteCoupon(coupon.id);
                              setCouponNotice(`تم حذف الكود (${coupon.code})`);
                              setTimeout(() => setCouponNotice(null), 2500);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-400 p-1"
                          title="حذف الكوبون"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 8: FAQS MANAGEMENT (إدارة الأسئلة الشائعة) */}
          {/* ========================================================================= */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-900 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">
                      إدارة الأسئلة الشائعة والإجابات (FAQ) ❓
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      تعديل وإضافة الأسئلة المعروضة في قسم الأسئلة الشائعة بأسفل الصفحة الرئيسية
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingFaq(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة سؤال وجواب جديد</span>
                </button>
              </div>

              {faqNotice && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{faqNotice}</span>
                </div>
              )}

              {/* FAQs List */}
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2 hover:border-slate-700 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {faq.category && (
                          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                            {faq.category}
                          </span>
                        )}
                        <h5 className="font-bold text-white text-sm">{faq.question}</h5>
                      </div>

                      {onDeleteFaq && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                              onDeleteFaq(faq.id);
                              setFaqNotice('تم حذف السؤال بنجاح.');
                              setTimeout(() => setFaqNotice(null), 2500);
                            }
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                          title="حذف السؤال"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <p className="text-slate-300 leading-relaxed pt-1 border-t border-slate-800/80">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* MODAL 1: Edit Product and its Pricing/Plans (تعديل المنتج والأسعار) */}
        {/* ========================================================================= */}
        {editingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    <ProductBrandIcon slug={editingProduct.slug} brand={editingProduct.brand} size="md" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      تعديل اشتراك: {editingProduct.nameAr}
                    </h4>
                    <p className="text-xs text-slate-400">
                      قم بتعديل الأسعار، مدد الباقات، أو تفاصيل المنتج وسيتم تحديثها فوراً في المتجر
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveProductChanges} className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* Basic Details */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    1. المعلومات الأساسية للأداة
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الاسم بالعربية:</label>
                      <input
                        type="text"
                        value={editingProduct.nameAr}
                        onChange={(e) => setEditingProduct({ ...editingProduct, nameAr: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الاسم بالإنجليزية:</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400 font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الشركة / الماركة:</label>
                      <input
                        type="text"
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">الشارة الترويجية (Badge):</label>
                      <input
                        type="text"
                        value={editingProduct.badge || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                        placeholder="مثال: الأكثر مبيعاً 🔥 أو عرض خاص ⭐"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 font-semibold mb-1">الوصف المختصر:</label>
                    <textarea
                      value={editingProduct.shortDescAr}
                      onChange={(e) => setEditingProduct({ ...editingProduct, shortDescAr: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>
                </div>

                {/* Pricing & Plans Manager (EDITING PRICES) */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                        2. باقات وأسعار الاشتراك (Plans & Prices)
                      </h5>
                      <span className="text-[11px] text-slate-400">
                        يمكنك تغيير السعر، تعديل مدة الباقة، أو إضافة خيارات جديدة
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddPlanToEditingProduct}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة باقة جديدة</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingProduct.plans.map((plan, index) => (
                      <div
                        key={plan.id}
                        className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-400">
                            باقة #{index + 1}
                          </span>

                          <div className="flex items-center gap-3">
                            <label className="flex items-center gap-1 text-[11px] text-slate-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={plan.isPopular || false}
                                onChange={(e) => handleUpdatePlanField(plan.id, 'isPopular', e.target.checked)}
                                className="rounded text-amber-500 focus:ring-0"
                              />
                              <span>عرض كـ (الأكثر طلباً)</span>
                            </label>

                            <button
                              type="button"
                              onClick={() => handleRemovePlanFromEditingProduct(plan.id)}
                              className="text-slate-400 hover:text-rose-400 p-1"
                              title="حذف الباقة"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                          {/* Duration label */}
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">اسم ومدة الباقة:</label>
                            <input
                              type="text"
                              value={plan.durationLabel}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'durationLabel', e.target.value)}
                              placeholder="مثال: 18 شهر (عرض مميز)"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                              required
                            />
                          </div>

                          {/* Price in EGP */}
                          <div>
                            <label className="block text-emerald-400 text-[11px] font-bold mb-1">
                              السعر الحالي للبيع (ج.م):
                            </label>
                            <input
                              type="number"
                              value={plan.priceEGP}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'priceEGP', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-emerald-500/50 rounded-lg px-2.5 py-1.5 text-white font-mono font-bold"
                              required
                              min={1}
                            />
                          </div>

                          {/* Original crossed-out price */}
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">السعر الأصلي المشطوب (ج.م):</label>
                            <input
                              type="number"
                              value={plan.originalPriceEGP}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'originalPriceEGP', Number(e.target.value))}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                              min={1}
                            />
                          </div>
                        </div>

                        {/* Delivery type label */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">نوع التسليم:</label>
                            <select
                              value={plan.deliveryType}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'deliveryType', e.target.value as DeliveryType)}
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                            >
                              <option value="invite">دعوة رسمية على الإيميل (invite)</option>
                              <option value="private_account">حساب خاص كامل (private_account)</option>
                              <option value="shared_account">حساب مشترك اقتصادي (shared_account)</option>
                              <option value="license_key">كود ترخيص (license_key)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-slate-400 text-[11px] mb-1">توضيح التسليم للعميل:</label>
                            <input
                              type="text"
                              value={plan.deliveryTypeLabel}
                              onChange={(e) => handleUpdatePlanField(plan.id, 'deliveryTypeLabel', e.target.value)}
                              placeholder="تفعيل رسمي على إيميلك الخاص"
                              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Save Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {saveSuccessNotice && (
                      <span className="text-emerald-400 text-xs font-bold flex items-center gap-1 animate-pulse">
                        <Check className="w-4 h-4" />
                        تم حفظ التعديلات بنجاح!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                    >
                      إلغاء
                    </button>

                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-500/25 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      <span>حفظ الأسعار والتعديلات فوراً</span>
                    </button>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 2: Add New Product Modal */}
        {/* ========================================================================= */}
        {isAddingProduct && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-white text-base">إضافة أداة ذكاء اصطناعي جديدة</h4>
                <button onClick={() => setIsAddingProduct(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 mb-1">اسم الأداة بالعربية:</label>
                  <input
                    type="text"
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    placeholder="مثال: اشتراك DeepSeek Pro"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">الاسم بالإنجليزي:</label>
                  <input
                    type="text"
                    value={newProdNameEn}
                    onChange={(e) => setNewProdNameEn(e.target.value)}
                    placeholder="DeepSeek Pro Subscription"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">القسم:</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value as ProductCategory)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                    >
                      <option value="ai-chat">شات ونصوص</option>
                      <option value="coding">برمجة</option>
                      <option value="design">تصميم</option>
                      <option value="video-audio">فيديو وصوت</option>
                      <option value="research-study">أبحاث</option>
                      <option value="bundles">باقات توفير</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">الشركة:</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      placeholder="OpenAI / Google..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 mb-1">السعر للبيع (ج.م):</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                      min={1}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">المدة:</label>
                    <input
                      type="text"
                      value={newProdDuration}
                      onChange={(e) => setNewProdDuration(e.target.value)}
                      placeholder="سنة كاملة"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold"
                  >
                    حفظ ونشر في المتجر
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingProduct(false)}
                    className="py-2 px-4 rounded-xl bg-slate-800 text-slate-300"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 3: Edit Payment Method (تعديل وسيلة الدفع - أدمن فقط) */}
        {/* ========================================================================= */}
        {editingPaymentMethod && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Edit3 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      تعديل وسيلة الدفع: {editingPaymentMethod.nameAr}
                    </h4>
                    <p className="text-xs text-slate-400">
                      تعديل أرقام التحويل والحساب والتعليمات المباشرة للعميل
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingPaymentMethod(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdatePaymentMethod(editingPaymentMethod);
                  setEditingPaymentMethod(null);
                  setPaymentNotice(`تم تحديث بيانات (${editingPaymentMethod.nameAr}) بنجاح!`);
                  setTimeout(() => setPaymentNotice(null), 3000);
                }}
                className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      الاسم بالعربية <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={editingPaymentMethod.nameAr}
                      onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, nameAr: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      الاسم بالإنجليزية
                    </label>
                    <input
                      type="text"
                      value={editingPaymentMethod.nameEn}
                      onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, nameEn: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    رقم الحساب / عنوان الدفع اللحظي IPA / المحفظة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPaymentMethod.accountIdentifier}
                    onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, accountIdentifier: e.target.value })}
                    placeholder="مثال: 01029384756 أو user@instapay أو عنوان USDT"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      اسم صاحب الحساب / المستلم
                    </label>
                    <input
                      type="text"
                      value={editingPaymentMethod.accountHolderName || ''}
                      onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, accountHolderName: e.target.value })}
                      placeholder="مثال: متجر كينجز ستور الرسمي"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      شارة مميزة (Badge)
                    </label>
                    <input
                      type="text"
                      value={editingPaymentMethod.badge || ''}
                      onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, badge: e.target.value })}
                      placeholder="مثال: موصى به / فوري"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    نوع الأيقونة
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'building', label: 'بنك / انستاباي', icon: Building2 },
                      { type: 'smartphone', label: 'كاش / محفظة', icon: Smartphone },
                      { type: 'card', label: 'بطاقة بنكية', icon: CreditCard },
                      { type: 'coins', label: 'كريبتو / USDT', icon: Coins },
                    ].map((it) => {
                      const Icon = it.icon;
                      const isSelected = editingPaymentMethod.iconType === it.type;
                      return (
                        <button
                          key={it.type}
                          type="button"
                          onClick={() => setEditingPaymentMethod({ ...editingPaymentMethod, iconType: it.type as any })}
                          className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px]">{it.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    التعليمات والتوجيهات للعميل
                  </label>
                  <textarea
                    rows={3}
                    value={editingPaymentMethod.instructionsAr}
                    onChange={(e) => setEditingPaymentMethod({ ...editingPaymentMethod, instructionsAr: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">حالة وسيلة الدفع بالمتجر</span>
                    <span className="text-[11px] text-slate-400">تظهر للعملاء في خيارات الدفع عند التفعيل</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingPaymentMethod({ ...editingPaymentMethod, isEnabled: !editingPaymentMethod.isEnabled })}
                    className={`px-3 py-1.5 rounded-xl font-bold border transition-colors ${
                      editingPaymentMethod.isEnabled
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {editingPaymentMethod.isEnabled ? 'مفعلة' : 'معطلة'}
                  </button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    حفظ التعديلات فوراً
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingPaymentMethod(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 4: Add New Payment Method (إضافة وسيلة دفع جديدة - أدمن فقط) */}
        {/* ========================================================================= */}
        {isAddingPaymentMethod && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-xl bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      إضافة وسيلة دفع جديدة
                    </h4>
                    <p className="text-xs text-slate-400">
                      إضافة حساب بنكي، محفظة إلكترونية، أو وسيلة دفع دولية
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingPaymentMethod(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newPmNameAr.trim() || !newPmAccountIdentifier.trim()) return;

                  const newMethod: PaymentMethodConfig = {
                    id: `pm-${Date.now()}`,
                    key: newPmKey.trim() || `pm-${Date.now()}`,
                    nameAr: newPmNameAr.trim(),
                    nameEn: newPmNameEn.trim() || newPmNameAr.trim(),
                    subtitleAr: newPmSubtitleAr.trim() || 'تحويل مباشر',
                    accountIdentifier: newPmAccountIdentifier.trim(),
                    accountHolderName: newPmAccountHolder.trim() || undefined,
                    instructionsAr: newPmInstructions.trim() || 'يرجى التحويل إلى الحساب الموضح وإرفاق صورة أو رقم العملية.',
                    isEnabled: true,
                    badge: newPmBadge.trim() || undefined,
                    iconType: newPmIconType,
                  };

                  onAddPaymentMethod(newMethod);
                  setIsAddingPaymentMethod(false);
                  setPaymentNotice(`تمت إضافة وسيلة الدفع (${newMethod.nameAr}) بنجاح!`);
                  setTimeout(() => setPaymentNotice(null), 3000);
                }}
                className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      اسم الوسيلة بالعربية <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={newPmNameAr}
                      onChange={(e) => setNewPmNameAr(e.target.value)}
                      placeholder="مثال: تحويل بنكي CIB / محفظة وي باي"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      الاسم بالإنجليزية
                    </label>
                    <input
                      type="text"
                      value={newPmNameEn}
                      onChange={(e) => setNewPmNameEn(e.target.value)}
                      placeholder="مثال: Bank Transfer / WE Pay"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    رقم الحساب / عنوان التحويل / المحفظة <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPmAccountIdentifier}
                    onChange={(e) => setNewPmAccountIdentifier(e.target.value)}
                    placeholder="مثال: 01551234567 أو رقم حساب IBAN"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-400"
                    dir="ltr"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      اسم صاحب الحساب / المستلم
                    </label>
                    <input
                      type="text"
                      value={newPmAccountHolder}
                      onChange={(e) => setNewPmAccountHolder(e.target.value)}
                      placeholder="مثال: متجر كينجز ستور"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      شارة مميزة (Badge)
                    </label>
                    <input
                      type="text"
                      value={newPmBadge}
                      onChange={(e) => setNewPmBadge(e.target.value)}
                      placeholder="مثال: جديد / بنكي"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    نوع الأيقونة
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { type: 'building', label: 'بنك / انستاباي', icon: Building2 },
                      { type: 'smartphone', label: 'كاش / محفظة', icon: Smartphone },
                      { type: 'card', label: 'بطاقة بنكية', icon: CreditCard },
                      { type: 'coins', label: 'كريبتو / USDT', icon: Coins },
                    ].map((it) => {
                      const Icon = it.icon;
                      const isSelected = newPmIconType === it.type;
                      return (
                        <button
                          key={it.type}
                          type="button"
                          onClick={() => setNewPmIconType(it.type as any)}
                          className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-[10px]">{it.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    التعليمات والتوجيهات للعميل
                  </label>
                  <textarea
                    rows={3}
                    value={newPmInstructions}
                    onChange={(e) => setNewPmInstructions(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                    placeholder="اكتب التوجيهات التي ستظهر للعميل أسفل وسيلة الدفع في صفحة إتمام الطلب..."
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    حفظ وإضافة للمتجر
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingPaymentMethod(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 5: CUSTOMER BALANCE CONTROL (التحكم في رصيد محفظة العميل) */}
        {/* ========================================================================= */}
        {selectedCustomerForBalance && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <span>التحكم في رصيد العميل</span>
                      <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {selectedCustomerForBalance.id}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {selectedCustomerForBalance.name} ({selectedCustomerForBalance.email})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomerForBalance(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const currentBal = selectedCustomerForBalance.walletBalanceEGP || 0;
                  const numAmt = Math.max(0, Number(balanceAmount) || 0);
                  let finalNewBal = currentBal;
                  if (balanceOpType === 'credit') finalNewBal = currentBal + numAmt;
                  else if (balanceOpType === 'debit') finalNewBal = Math.max(0, currentBal - numAmt);
                  else if (balanceOpType === 'set') finalNewBal = numAmt;

                  if (onUpdateCustomerBalance) {
                    onUpdateCustomerBalance(
                      selectedCustomerForBalance.id,
                      numAmt,
                      balanceOpType,
                      balanceReason.trim() || 'تعديل رصيد محفظة بواسطة المشرف',
                      balanceAdminNote.trim() || undefined
                    );
                    setCustomerNotice(`تم تحديث رصيد (${selectedCustomerForBalance.name}) إلى ${finalNewBal} ج.م بنجاح!`);
                    setTimeout(() => setCustomerNotice(null), 3000);
                  }
                  setSelectedCustomerForBalance(null);
                }}
                className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
              >
                {/* Current Balance Showcase */}
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">الرصيد الحالي بالمحفظة:</span>
                    <span className="text-2xl font-black text-amber-400 font-mono">
                      {formatPrice(selectedCustomerForBalance.walletBalanceEGP || 0, currency)}
                    </span>
                  </div>
                  <div className="text-left font-mono text-[11px] text-slate-500">
                    <span>ID: {selectedCustomerForBalance.id}</span>
                  </div>
                </div>

                {/* Operation Type Selection */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">نوع العملية:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBalanceOpType('credit');
                        setBalanceReason('شحن رصيد نقدي لحساب العميل');
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        balanceOpType === 'credit'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                      <span>➕ إضافة / شحن</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBalanceOpType('debit');
                        setBalanceReason('خصم رصيد / تسوية حساب');
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        balanceOpType === 'debit'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ArrowUpRight className="w-4 h-4 text-rose-400" />
                      <span>➖ خصم رصيد</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBalanceOpType('set');
                        setBalanceReason('ضبط وتعيين الرصيد المباشر');
                      }}
                      className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                        balanceOpType === 'set'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Settings className="w-4 h-4 text-amber-400" />
                      <span>⚙️ تعيين دقيق</span>
                    </button>
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    {balanceOpType === 'set' ? 'القيمة الجديدة للرصيد (ج.م):' : 'المبلغ المراد تطبيقه (ج.م):'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={balanceAmount}
                    onChange={(e) => setBalanceAmount(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-base font-mono font-bold focus:outline-none focus:border-amber-400"
                    required
                  />

                  {/* Quick amount chips */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[50, 100, 200, 500, 1000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBalanceAmount(amt)}
                        className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px] border border-slate-700"
                      >
                        +{amt} ج.م
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason Selection & Input */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">سبب العملية (يظهر للعميل في كشف حسابه):</label>
                  <input
                    type="text"
                    value={balanceReason}
                    onChange={(e) => setBalanceReason(e.target.value)}
                    placeholder="مثال: شحن رصيد عبر انستاباي / بونص ولاء"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    required
                  />

                  {/* Quick Preset Reason Pills */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {[
                      'شحن رصيد عبر انستاباي',
                      'شحن محفظة فودافون كاش',
                      'مكافأة ولاء وترقية VIP',
                      'تعويض عن تأخير تفعيل',
                      'استرداد قيمة اشتراك ملغي',
                      'تسوية حساب دورية',
                    ].map((reason) => (
                      <button
                        key={reason}
                        type="button"
                        onClick={() => setBalanceReason(reason)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700/60"
                      >
                        {reason}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Admin Note */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ملاحظات سرية للإدارة (اختياري - لا تظهر للعميل):
                  </label>
                  <input
                    type="text"
                    value={balanceAdminNote}
                    onChange={(e) => setBalanceAdminNote(e.target.value)}
                    placeholder="رقم المعاملة، اسم المحول، سبب داخلي..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Preview Calculated Balance */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <span className="text-slate-300 font-semibold">الرصيد بعد تنفيذ العملية:</span>
                  <span className="text-base font-black text-amber-400 font-mono">
                    {(() => {
                      const cur = selectedCustomerForBalance.walletBalanceEGP || 0;
                      const val = Math.max(0, Number(balanceAmount) || 0);
                      if (balanceOpType === 'credit') return `${cur + val} ج.م`;
                      if (balanceOpType === 'debit') return `${Math.max(0, cur - val)} ج.م`;
                      return `${val} ج.م`;
                    })()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    تأكيد وتحديث الرصيد فوراً
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerForBalance(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 6: CUSTOMER PERMISSIONS & BAN CONTROL (إدارة الصلاحيات والحظر) */}
        {/* ========================================================================= */}
        {selectedCustomerForPermissions && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-lg bg-slate-900 border border-rose-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                    <ShieldOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <span>إدارة الصلاحيات وحظر العميل</span>
                      <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {selectedCustomerForPermissions.id}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {selectedCustomerForPermissions.name} ({selectedCustomerForPermissions.email})
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomerForPermissions(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (onUpdateCustomerPermissions) {
                    onUpdateCustomerPermissions(
                      selectedCustomerForPermissions.id,
                      {
                        isBanned: permIsBanned,
                        banReason: permIsBanned ? (permBanReason.trim() || 'قرار إداري بمخالفة الشروط') : undefined,
                        canPurchase: permIsBanned ? false : permCanPurchase,
                        canUseCoupons: permIsBanned ? false : permCanUseCoupons,
                        canAccessPortal: permCanAccessPortal,
                        notes: permNotes.trim() || undefined,
                      }
                    );
                    setCustomerNotice(
                      permIsBanned
                        ? `تم حظر العميل (${selectedCustomerForPermissions.name}) بنجاح 🚫`
                        : `تم فك حظر / تحديث صلاحيات العميل (${selectedCustomerForPermissions.name}) بنجاح ✅`
                    );
                    setTimeout(() => setCustomerNotice(null), 3000);
                  }
                  setSelectedCustomerForPermissions(null);
                }}
                className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
              >
                {/* Main Ban Switch Box */}
                <div className={`p-4 rounded-2xl border transition-all ${
                  permIsBanned
                    ? 'bg-rose-950/40 border-rose-500/60'
                    : 'bg-emerald-950/20 border-emerald-500/40'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {permIsBanned ? (
                        <Ban className="w-6 h-6 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      )}
                      <div>
                        <span className="font-black text-sm block text-white">
                          {permIsBanned ? 'الحساب محظور حالياً 🚫' : 'الحساب نشط وغير محظور 🟢'}
                        </span>
                        <span className="text-[11px] text-slate-300">
                          {permIsBanned
                            ? 'الحظر يمنع العميل من إتمام أي طلبات جديدة ويظهر تنبيهاً أمنياً بالسبب'
                            : 'الحساب متاح له الاستفادة من خدمات المتجر بشكل طبيعي'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const nextBanned = !permIsBanned;
                        setPermIsBanned(nextBanned);
                        if (nextBanned) {
                          setPermCanPurchase(false);
                          setPermCanUseCoupons(false);
                          if (!permBanReason) {
                            setPermBanReason('محاولة إرسال إيصالات تحويل بنكي وهمية متكررة');
                          }
                        } else {
                          setPermCanPurchase(true);
                          setPermCanUseCoupons(true);
                        }
                      }}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        permIsBanned ? 'bg-rose-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                          permIsBanned ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* If banned: Ban Reason input & preset buttons */}
                {permIsBanned && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <label className="block text-rose-300 font-bold mb-1">
                      سبب الحظر (سيظهر للعميل في حال حاول إتمام طلب):
                    </label>
                    <input
                      type="text"
                      value={permBanReason}
                      onChange={(e) => setPermBanReason(e.target.value)}
                      placeholder="اكتب سبب الحظر..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                      required={permIsBanned}
                    />

                    {/* Presets */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {[
                        'محاولة إرسال إيصالات تحويل بنكي وهمية متكررة',
                        'مخالفة سياسة الاستخدام ومشاركة بيانات الحساب',
                        'محاولة احتيال مالي وطلب استرداد مضلل',
                        'حساب مكرر أو نشاط سبام مشبوه',
                        'إساءة استخدام الدعم الفني',
                      ].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPermBanReason(preset)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Granular Permissions Section */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-slate-300 font-bold block">الصلاحيات الدقيقة للعميل:</span>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">صلاحية إتمام الطلبات والشراء (canPurchase)</span>
                      <span className="text-[11px] text-slate-400">السماح للعميل بإتمام عمليات الدفع والشراء في المتجر</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permCanPurchase}
                      disabled={permIsBanned}
                      onChange={(e) => setPermCanPurchase(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">صلاحية استخدام الكوبونات والخصومات (canUseCoupons)</span>
                      <span className="text-[11px] text-slate-400">إمكانية تطبيق أكواد الخصم الترويجية في السلة</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permCanUseCoupons}
                      disabled={permIsBanned}
                      onChange={(e) => setPermCanUseCoupons(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 cursor-pointer">
                    <div>
                      <span className="font-semibold text-white block">صلاحية الدخول لبوابة الاشتراكات (canAccessPortal)</span>
                      <span className="text-[11px] text-slate-400">السماح باستعراض بيانات وتراخيص الاشتراكات السابقة والتجديد</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={permCanAccessPortal}
                      onChange={(e) => setPermCanAccessPortal(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0 bg-slate-900 border-slate-700"
                    />
                  </label>
                </div>

                {/* Admin Internal Notes */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    سجل ملاحظات الإدارة الخاصة بهذا العميل:
                  </label>
                  <textarea
                    rows={2}
                    value={permNotes}
                    onChange={(e) => setPermNotes(e.target.value)}
                    placeholder="ملاحظات داخلية للمشرفين..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    حفظ التغييرات وتطبيق الصلاحيات
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedCustomerForPermissions(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 7: CUSTOMER WALLET TRANSACTIONS HISTORY (سجل حركات محفظة العميل) */}
        {/* ========================================================================= */}
        {selectedCustomerForHistory && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <History className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white flex items-center gap-2">
                      <span>كشف حركات محفظة العميل</span>
                      <span className="font-mono text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        {selectedCustomerForHistory.id}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      {selectedCustomerForHistory.name} - الرصيد الحالي: {formatPrice(selectedCustomerForHistory.walletBalanceEGP || 0, currency)}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCustomerForHistory(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 overflow-y-auto flex-1 space-y-3 text-xs">
                {(!selectedCustomerForHistory.walletTransactions || selectedCustomerForHistory.walletTransactions.length === 0) ? (
                  <div className="text-center py-10 text-slate-400">
                    <p className="font-bold">لا توجد حركات مسجلة في محفظة هذا العميل حتى الآن</p>
                    <p className="text-[11px] text-slate-500 mt-1">عند شحن أو خصم رصيد العميل ستظهر تفاصيل المعاملات هنا</p>
                  </div>
                ) : (
                  selectedCustomerForHistory.walletTransactions.map((tx) => {
                    const isPositive = tx.type === 'credit' || tx.type === 'bonus' || tx.type === 'refund';
                    return (
                      <div
                        key={tx.id}
                        className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold font-mono text-sm ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? `+${tx.amount}` : `-${tx.amount}`} ج.م
                          </span>

                          <span className="text-[10px] text-slate-500 font-mono">
                            {tx.date}
                          </span>
                        </div>

                        <p className="text-white font-medium">{tx.reason}</p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                          <span>الرصيد السابق: {tx.previousBalance} ج.م</span>
                          <span>الرصيد الجديد: {tx.newBalance} ج.م</span>
                        </div>

                        {tx.adminNote && (
                          <p className="text-[10px] text-slate-500 italic">
                            ملاحظة إدارية: {tx.adminNote}
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCustomerForHistory(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700 text-xs"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 8: ADD NEW CUSTOMER (إضافة عميل جديد) */}
        {/* ========================================================================= */}
        {isAddingCustomer && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-lg bg-slate-900 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-white">
                      إضافة عميل جديد للنظام 👤
                    </h4>
                    <p className="text-xs text-slate-400">
                      إنشاء حساب عميل برقم ID مخصص مع تحديد رصيد افتتاحي
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCustName.trim() || !newCustEmail.trim()) return;

                  const newCust: CustomerUser = {
                    id: newCustId.trim() || `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
                    name: newCustName.trim(),
                    email: newCustEmail.trim().toLowerCase(),
                    phone: newCustPhone.trim(),
                    walletBalanceEGP: Math.max(0, Number(newCustBalance) || 0),
                    isBanned: false,
                    canPurchase: true,
                    canUseCoupons: true,
                    canAccessPortal: true,
                    notes: newCustNotes.trim() || undefined,
                    createdAt: new Date().toISOString(),
                    totalSpentEGP: 0,
                    ordersCount: 0,
                    walletTransactions: Number(newCustBalance) > 0 ? [
                      {
                        id: `tx-${Date.now()}`,
                        type: 'credit',
                        amount: Number(newCustBalance),
                        date: new Date().toISOString().split('T')[0],
                        reason: 'رصيد افتتاحي عند إنشاء الحساب',
                        adminNote: 'تم تسجيل العميل بواسطة الإدارة',
                        previousBalance: 0,
                        newBalance: Number(newCustBalance),
                      }
                    ] : [],
                  };

                  if (onAddCustomer) {
                    onAddCustomer(newCust);
                    setCustomerNotice(`تم إضافة العميل (${newCust.name} - ${newCust.id}) بنجاح!`);
                    setTimeout(() => setCustomerNotice(null), 3000);
                  }
                  setIsAddingCustomer(false);
                }}
                className="p-5 space-y-4 overflow-y-auto flex-1 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    معرّف العميل (Customer ID) <span className="text-rose-400">*</span>:
                  </label>
                  <input
                    type="text"
                    value={newCustId}
                    onChange={(e) => setNewCustId(e.target.value.toUpperCase())}
                    placeholder="مثال: CUST-8821"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-amber-400"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    يمكنك استخدام الـ ID التلقائي أو تخصيصه للعميل
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      اسم العميل بالكامل <span className="text-rose-400">*</span>:
                    </label>
                    <input
                      type="text"
                      value={newCustName}
                      onChange={(e) => setNewCustName(e.target.value)}
                      placeholder="مثال: أحمد محمود"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      البريد الإلكتروني <span className="text-rose-400">*</span>:
                    </label>
                    <input
                      type="email"
                      value={newCustEmail}
                      onChange={(e) => setNewCustEmail(e.target.value)}
                      placeholder="client@gmail.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      رقم الهاتف / الواتساب:
                    </label>
                    <input
                      type="text"
                      value={newCustPhone}
                      onChange={(e) => setNewCustPhone(e.target.value)}
                      placeholder="010XXXXXXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      رصيد افتتاحي بالمحفظة (ج.م):
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCustBalance}
                      onChange={(e) => setNewCustBalance(e.target.value)}
                      placeholder="0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    ملاحظات داخلية:
                  </label>
                  <textarea
                    rows={2}
                    value={newCustNotes}
                    onChange={(e) => setNewCustNotes(e.target.value)}
                    placeholder="ملاحظات المشرف حول هذا العميل..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95"
                  >
                    إنشاء حساب العميل
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustomer(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 9: ADD NEW COUPON (إنشاء كود خصم جديد) */}
        {/* ========================================================================= */}
        {isAddingCoupon && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-md bg-slate-900 border border-purple-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                    <Ticket className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">إنشاء كود خصم ترويجي جديد 🎟️</h4>
                    <p className="text-xs text-slate-400">سيتم تفعيل الكود فوراً للعملاء في السلة</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingCoupon(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCouponCode.trim()) return;

                  const createdCoupon: StoreCoupon = {
                    id: `coup-${Date.now()}`,
                    code: newCouponCode.trim().toUpperCase(),
                    discountType: newCouponType,
                    discountValue: Number(newCouponValue) || 10,
                    minSpendEGP: Number(newCouponMinSpend) || 0,
                    descriptionAr: newCouponDesc.trim() || `خصم ${newCouponValue}${newCouponType === 'percentage' ? '%' : ' ج.م'} على الطلبات`,
                    isActive: true,
                    usageCount: 0,
                  };

                  if (onAddCoupon) {
                    onAddCoupon(createdCoupon);
                    setCouponNotice(`تم إنشاء وتفعيل كود الخصم (${createdCoupon.code}) بنجاح!`);
                    setTimeout(() => setCouponNotice(null), 3000);
                  }

                  setIsAddingCoupon(false);
                  setNewCouponCode('');
                  setNewCouponDesc('');
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">كود الخصم (Promo Code) *:</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    placeholder="مثال: SUMMER30 أو VIP50"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono uppercase focus:outline-none focus:border-purple-400"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">نوع الخصم:</label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as any)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">قيمة الخصم:</label>
                    <input
                      type="number"
                      min="1"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الحد الأدنى للطلب (ج.م):</label>
                  <input
                    type="number"
                    min="0"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">وصف الكوبون للعملاء:</label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="مثال: خصم 30% بمناسبة عروض الصيف"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold transition-all active:scale-95"
                  >
                    حفظ ونشر الكود
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCoupon(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL 10: ADD NEW FAQ (إضافة سؤال شائع جديد) */}
        {/* ========================================================================= */}
        {isAddingFaq && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div 
              className="relative w-full max-w-md bg-slate-900 border border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden my-auto p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base">إضافة سؤال شائع جديد ❓</h4>
                    <p className="text-xs text-slate-400">سيظهر في قسم الأسئلة الشائعة بالصفحة الرئيسية</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddingFaq(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;

                  const createdFaq: StoreFaqItem = {
                    id: `faq-${Date.now()}`,
                    question: newFaqQuestion.trim(),
                    answer: newFaqAnswer.trim(),
                    category: newFaqCategory.trim() || 'عام',
                  };

                  if (onAddFaq) {
                    onAddFaq(createdFaq);
                    setFaqNotice('تمت إضافة السؤال بنجاح إلى الصفحة الرئيسية!');
                    setTimeout(() => setFaqNotice(null), 3000);
                  }

                  setIsAddingFaq(false);
                  setNewFaqQuestion('');
                  setNewFaqAnswer('');
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">القسم أو التصنيف:</label>
                  <input
                    type="text"
                    value={newFaqCategory}
                    onChange={(e) => setNewFaqCategory(e.target.value)}
                    placeholder="مثال: التفعيل، الضمان، الدفع"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نص السؤال *:</label>
                  <input
                    type="text"
                    value={newFaqQuestion}
                    onChange={(e) => setNewFaqQuestion(e.target.value)}
                    placeholder="اكتب السؤال هنا..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">نص الإجابة التفصيلية *:</label>
                  <textarea
                    rows={4}
                    value={newFaqAnswer}
                    onChange={(e) => setNewFaqAnswer(e.target.value)}
                    placeholder="اكتب إجابة السؤال بوضوح للعملاء..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all active:scale-95"
                  >
                    إضافة ونشر السؤال
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingFaq(false)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
