export type ProductCategory = 
  | 'all'
  | 'ai-chat'
  | 'coding'
  | 'design'
  | 'video-audio'
  | 'research-study'
  | 'bundles';

export type DeliveryType = 
  | 'invite'            // دعوة رسمية على إيميلك الشخصي
  | 'private_account'   // حساب خاص بك بالكامل
  | 'shared_account'    // حساب مشترك اقتصادي
  | 'license_key';      // كود ترخيص أو تفعيل فوري

export interface PlanVariant {
  id: string;
  durationLabel: string; // e.g. "شهر واحد", "3 أشهر", "سنة كاملة", "3 سنوات"
  durationMonths: number;
  priceEGP: number;
  originalPriceEGP: number;
  deliveryType: DeliveryType;
  deliveryTypeLabel: string;
  isPopular?: boolean;
  notes?: string;
}

export interface SubscriptionProduct {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  brand: string;
  category: ProductCategory;
  badge?: string;
  isFeatured?: boolean;
  shortDescAr: string;
  fullDescAr: string;
  iconName: string;
  colorScheme: {
    accent: string;
    bgGlow: string;
    border: string;
    badgeBg: string;
    badgeText: string;
  };
  rating: number;
  reviewsCount: number;
  salesCount: number;
  deliveryTime: string;
  plans: PlanVariant[];
  featuresAr: string[];
  benefitsAr?: string[];
  useCasesAr?: { role: string; desc: string }[];
  officialVsKings?: {
    officialPriceUSD: string;
    kingsPriceEGP: string;
    savingsText: string;
  };
  previewHighlights?: {
    label: string;
    value: string;
  }[];
  activationStepsAr: string[];
  requirementsAr: string;
  faqs: { question: string; answer: string }[];
}

export type CurrencyCode = 'EGP' | 'SAR' | 'USD' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  nameAr: string;
  symbol: string;
  rateToEGP: number;
}

export interface CartItem {
  id: string;
  productId: string;
  product: SubscriptionProduct;
  selectedPlan: PlanVariant;
  quantity: number;
  userEmail?: string;
  userPhone?: string;
  notes?: string;
}

export type OrderStatus = 
  | 'pending_payment'
  | 'verifying_payment'
  | 'activating'
  | 'completed'
  | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: {
    productId: string;
    productName: string;
    planLabel: string;
    deliveryType: DeliveryType;
    priceEGP: number;
    pricePaid: number;
    currency: CurrencyCode;
    quantity: number;
  }[];
  totalEGP: number;
  totalPaid: number;
  currency: CurrencyCode;
  paymentMethod: 'instapay' | 'vodafone_cash' | 'card' | 'mada' | 'usdt' | string;
  paymentReference?: string;
  status: OrderStatus;
  activationCode?: string;
  activationNotes?: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending_renewal';

export interface CustomerSubscription {
  id: string;
  subscriptionCode?: string; // e.g. SUB-9421
  orderNumber?: string;
  orderId?: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productSlug: string;
  planId?: string;
  planLabel: string;
  durationMonths?: number;
  status: SubscriptionStatus;
  startDate: string; // ISO date string
  expiryDate: string; // ISO date string
  endDate?: string; // ISO date string alias
  autoRenew: boolean;
  autoRenewDate?: string;
  renewalPriceEGP: number;
  deliveryType: DeliveryType;
  credentials?: {
    email?: string;
    password?: string;
    inviteUrl?: string;
    inviteStatus?: string;
    licenseKey?: string;
    loginPortalUrl?: string;
    notes?: string;
  };
  lastRenewalNotice?: string;
}

export interface Review {
  id: string;
  customerName: string;
  city: string;
  rating: number;
  date: string;
  productName: string;
  comment: string;
  verified: boolean;
}

export interface PaymentMethodConfig {
  id: string;
  key: string;
  nameAr: string;
  nameEn: string;
  subtitleAr: string;
  accountIdentifier: string;
  accountHolderName?: string;
  instructionsAr: string;
  isEnabled: boolean;
  badge?: string;
  iconType: 'building' | 'smartphone' | 'card' | 'coins';
}

export interface WalletTransaction {
  id: string;
  type: 'credit' | 'debit' | 'purchase' | 'refund' | 'bonus' | 'manual_adjust';
  amount: number;
  date: string;
  reason: string;
  adminNote?: string;
  previousBalance: number;
  newBalance: number;
}

export interface CustomerUser {
  id: string; // e.g. "CUST-8821"
  name: string;
  email: string;
  phone: string;
  walletBalanceEGP: number;
  isBanned: boolean;
  banReason?: string;
  banDate?: string;
  canPurchase: boolean;
  canUseCoupons: boolean;
  canAccessPortal: boolean;
  notes?: string;
  createdAt: string;
  totalSpentEGP: number;
  ordersCount: number;
  walletTransactions: WalletTransaction[];
}

export interface StoreCoupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 20) or fixed EGP (e.g. 50)
  minSpendEGP: number;
  descriptionAr: string;
  isActive: boolean;
  expiresAt?: string;
  usageCount: number;
}

export interface StoreFaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface StoreSiteSettings {
  storeNameAr: string;
  storeNameEn: string;
  storeSlogan: string;
  announcementText: string;
  announcementCode: string;
  isAnnouncementActive: boolean;
  heroBadgeText: string;
  heroTitleLeading: string;
  heroTitleHighlight: string;
  heroTitleTrailing: string;
  heroSubtitle: string;
  guaranteeText1: string;
  guaranteeText2: string;
  guaranteeText3: string;
  whatsappNumber: string;
  whatsappMessagePreset: string;
  telegramUsername: string;
  supportEmail: string;
  workingHoursText: string;
  footerCopyrightText: string;
  deliveryTimeNotice: string;
  showReviewsSection: boolean;
  showFaqSection: boolean;
  enableWhatsAppFloating?: boolean;
}

