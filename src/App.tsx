import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Crown, 
  Code, 
  Palette, 
  Bot, 
  Video, 
  BookOpen, 
  Layers, 
  ArrowUpDown,
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AiAdvisorModal } from './components/AiAdvisorModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { TrustFeaturesSection } from './components/TrustFeaturesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { RecentSalesToast } from './components/RecentSalesToast';
import { CustomerPortalModal } from './components/CustomerPortalModal';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AuthModal } from './components/AuthModal';
import { syncCustomerToSupabase, signOutSupabase } from './lib/supabase';

import { 
  SubscriptionProduct, 
  PlanVariant, 
  CartItem, 
  CurrencyCode, 
  Order, 
  ProductCategory,
  CustomerSubscription,
  SubscriptionStatus,
  PaymentMethodConfig,
  CustomerUser,
  WalletTransaction,
  StoreCoupon,
  StoreFaqItem,
  StoreSiteSettings
} from './types/store';
import { 
  INITIAL_PRODUCTS, 
  MOCK_REVIEWS, 
  INITIAL_ORDERS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_PAYMENT_METHODS,
  INITIAL_CUSTOMERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_COUPONS,
  INITIAL_FAQS
} from './data/mockProducts';

export default function App() {
  // Store data state
  const [products, setProducts] = useState<SubscriptionProduct[]>(() => {
    const saved = localStorage.getItem('kings_store_products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('kings_store_orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_ORDERS;
  });

  const [subscriptions, setSubscriptions] = useState<CustomerSubscription[]>(() => {
    const saved = localStorage.getItem('kings_store_subs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SUBSCRIPTIONS;
  });

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(() => {
    const saved = localStorage.getItem('kings_store_payment_methods');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_PAYMENT_METHODS;
  });

  const [customers, setCustomers] = useState<CustomerUser[]>(() => {
    const saved = localStorage.getItem('kings_store_customers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_CUSTOMERS;
  });

  // Complete site-wide customizable settings (تعديل أي شيء في الموقع)
  const [siteSettings, setSiteSettings] = useState<StoreSiteSettings>(() => {
    const saved = localStorage.getItem('kings_store_site_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SITE_SETTINGS;
  });

  // Promotional Discount Coupons
  const [coupons, setCoupons] = useState<StoreCoupon[]>(() => {
    const saved = localStorage.getItem('kings_store_coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_COUPONS;
  });

  // Frequently Asked Questions
  const [faqs, setFaqs] = useState<StoreFaqItem[]>(() => {
    const saved = localStorage.getItem('kings_store_faqs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_FAQS;
  });

  // View Mode: 'store' or standalone 'admin' website
  const [viewMode, setViewMode] = useState<'store' | 'admin'>(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#admin') {
      return 'admin';
    }
    return 'store';
  });

  // Current Logged-in Customer (Supabase Auth / Local Session)
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser | null>(() => {
    const saved = localStorage.getItem('kings_current_customer');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'database'>('login');

  // Sync hash changes for navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setViewMode('admin');
      } else if (hash === '#login') {
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
        setViewMode('store');
      } else if (hash === '#register' || hash === '#signup') {
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
        setViewMode('store');
      } else if (hash === '#database' || hash === '#supabase') {
        setAuthModalMode('database');
        setIsAuthModalOpen(true);
        setViewMode('store');
      } else if (hash === '' || hash === '#store') {
        setViewMode('store');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (currentCustomer) {
      localStorage.setItem('kings_current_customer', JSON.stringify(currentCustomer));
    } else {
      localStorage.removeItem('kings_current_customer');
    }
  }, [currentCustomer]);

  const handleCustomerLoginSuccess = (customer: CustomerUser) => {
    setCurrentCustomer(customer);
    setCustomers((prev) => {
      const existing = prev.find((c) => c.email.toLowerCase() === customer.email.toLowerCase());
      if (existing) {
        return prev.map((c) => (c.email.toLowerCase() === customer.email.toLowerCase() ? { ...c, ...customer } : c));
      }
      return [customer, ...prev];
    });
    syncCustomerToSupabase(customer);
  };

  const handleCustomerLogout = () => {
    signOutSupabase();
    setCurrentCustomer(null);
  };

  const navigateToAdmin = () => {
    window.location.hash = '#admin';
    setViewMode('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    window.location.hash = '';
    setViewMode('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [cart, setCart] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<CurrencyCode>('EGP');

  // Dedicated Product Detail Page navigation slug (null = catalog view)
  const [activeProductSlug, setActiveProductSlug] = useState<string | null>(null);

  // Customer Portal Modal
  const [isCustomerPortalOpen, setIsCustomerPortalOpen] = useState(false);

  // Admin security auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('kings_admin_auth') === 'true';
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync to local storage whenever products, orders, subscriptions or payment methods change
  useEffect(() => {
    localStorage.setItem('kings_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('kings_store_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kings_store_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('kings_store_payment_methods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('kings_store_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('kings_store_site_settings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('kings_store_coupons', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('kings_store_faqs', JSON.stringify(faqs));
  }, [faqs]);

  // Subscription management operations
  const handleToggleAutoRenew = (subId: string, enabled: boolean) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const autoRenewDate = enabled ? (sub.expiryDate || sub.endDate) : undefined;
          return { ...sub, autoRenew: enabled, autoRenewDate };
        }
        return sub;
      })
    );
  };

  const handleRenewNow = (subscription: CustomerSubscription) => {
    // Extend end date by 30 days or plan duration
    const currentEnd = new Date(subscription.expiryDate || subscription.endDate || new Date());
    currentEnd.setMonth(currentEnd.getMonth() + 1);
    const newEndDate = currentEnd.toISOString().split('T')[0];

    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subscription.id) {
          return {
            ...sub,
            status: 'active',
            expiryDate: newEndDate,
            endDate: newEndDate,
            autoRenewDate: sub.autoRenew ? newEndDate : undefined,
          };
        }
        return sub;
      })
    );
  };

  const handleCancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: 'cancelled', autoRenew: false } : sub))
    );
  };

  const handleUpdateSubscriptionStatus = (subId: string, newStatus: SubscriptionStatus) => {
    setSubscriptions((prev) =>
      prev.map((sub) => (sub.id === subId ? { ...sub, status: newStatus } : sub))
    );
  };

  const handleExtendSubscription = (subId: string, days: number) => {
    setSubscriptions((prev) =>
      prev.map((sub) => {
        if (sub.id === subId) {
          const baseStr = sub.expiryDate || sub.endDate || new Date().toISOString();
          const baseDate = new Date(baseStr > new Date().toISOString() ? baseStr : new Date());
          baseDate.setDate(baseDate.getDate() + days);
          const newEndDate = baseDate.toISOString().split('T')[0];
          return {
            ...sub,
            status: 'active',
            expiryDate: newEndDate,
            endDate: newEndDate,
            autoRenewDate: sub.autoRenew ? newEndDate : undefined,
          };
        }
        return sub;
      })
    );
  };

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDeliveryFilter, setSelectedDeliveryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountPercent: number;
    discountFixedEGP: number;
  } | null>(null);

  // Modals state
  const [detailProduct, setDetailProduct] = useState<SubscriptionProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [trackingInitialNumber, setTrackingInitialNumber] = useState('');

  // Cart operations
  const handleAddToCart = (product: SubscriptionProduct, plan: PlanVariant) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.productId === product.id && item.selectedPlan.id === plan.id
      );
      if (existing) {
        return prev.map((item) =>
          item.id === existing.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random()}`,
        productId: product.id,
        product,
        selectedPlan: plan,
        quantity: 1,
      };
      return [...prev, newItem];
    });
  };

  const handleBuyNow = (product: SubscriptionProduct, plan: PlanVariant) => {
    handleAddToCart(product, plan);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  // Coupons
  const handleApplyCoupon = (code: string): boolean => {
    const clean = code.trim().toUpperCase();

    // Check dynamic store coupons first
    const matched = coupons.find((c) => c.code.toUpperCase() === clean && c.isActive);
    if (matched) {
      if (matched.minSpendEGP && cartSubtotalEGP < matched.minSpendEGP) {
        return false;
      }
      if (matched.discountType === 'percentage') {
        setAppliedCoupon({ code: matched.code, discountPercent: matched.discountValue, discountFixedEGP: 0 });
      } else {
        setAppliedCoupon({ code: matched.code, discountPercent: 0, discountFixedEGP: matched.discountValue });
      }
      // increment coupon usage
      setCoupons((prev) =>
        prev.map((c) => (c.id === matched.id ? { ...c, usageCount: c.usageCount + 1 } : c))
      );
      return true;
    }

    // Default static codes fallback
    if (clean === 'KINGS2025' || clean === 'KINGS15') {
      setAppliedCoupon({ code: clean, discountPercent: 15, discountFixedEGP: 0 });
      return true;
    }
    if (clean === 'AI50') {
      setAppliedCoupon({ code: clean, discountPercent: 0, discountFixedEGP: 50 });
      return true;
    }
    if (clean === 'WELCOME' || clean === 'WELCOME10') {
      setAppliedCoupon({ code: clean, discountPercent: 10, discountFixedEGP: 0 });
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Site Customizer Handlers (تعديل أي شيء في الموقع)
  const handleUpdateSiteSettings = (updated: StoreSiteSettings) => {
    setSiteSettings(updated);
  };

  // Dynamic Coupons Handlers
  const handleAddCoupon = (newCoupon: StoreCoupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleUpdateCoupon = (id: string, updatedCoupon: Partial<StoreCoupon>) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedCoupon } : c))
    );
  };

  const handleDeleteCoupon = (couponId: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponId));
  };

  // Dynamic FAQs Handlers
  const handleAddFaq = (newFaq: StoreFaqItem) => {
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleUpdateFaq = (id: string, updatedFaq: Partial<StoreFaqItem>) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updatedFaq } : f))
    );
  };

  const handleDeleteFaq = (faqId: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  // Cart calculations
  const cartSubtotalEGP = cart.reduce(
    (sum, item) => sum + item.selectedPlan.priceEGP * item.quantity,
    0
  );

  let cartDiscountEGP = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent > 0) {
      cartDiscountEGP = (cartSubtotalEGP * appliedCoupon.discountPercent) / 100;
    } else if (appliedCoupon.discountFixedEGP > 0) {
      cartDiscountEGP = Math.min(cartSubtotalEGP, appliedCoupon.discountFixedEGP);
    }
  }

  const cartTotalEGP = Math.max(0, cartSubtotalEGP - cartDiscountEGP);

  // Order placed handler
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);

    // Automatically create customer subscriptions for each ordered item
    const newSubs: CustomerSubscription[] = newOrder.items.map((it, idx) => {
      const now = new Date();
      const end = new Date(now);
      const months = it.planLabel.includes('3 سنوات') ? 36 : it.planLabel.includes('سنة') ? 12 : 1;
      end.setMonth(end.getMonth() + months);
      
      const startDateStr = now.toISOString().split('T')[0];
      const endDateStr = end.toISOString().split('T')[0];

      return {
        id: `sub-${newOrder.id}-${idx}`,
        subscriptionCode: `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customerName: newOrder.customerName,
        customerEmail: newOrder.customerEmail,
        customerPhone: newOrder.customerPhone,
        productId: it.productId,
        productName: it.productName,
        productSlug: it.productName.toLowerCase().replace(/\s+/g, '-'),
        planId: `plan-${it.productId}`,
        planLabel: it.planLabel,
        durationMonths: months,
        status: 'active' as SubscriptionStatus,
        startDate: startDateStr,
        expiryDate: endDateStr,
        endDate: endDateStr,
        autoRenew: true,
        autoRenewDate: endDateStr,
        renewalPriceEGP: it.priceEGP,
        deliveryType: it.deliveryType || 'invite',
        credentials: {
          email: newOrder.customerEmail,
          inviteStatus: 'تم إرسال دعوة التفعيل الرسمية إلى بريدك الإلكتروني',
        },
      };
    });

    setSubscriptions((prev) => [...newSubs, ...prev]);

    // Update customer spending and order count or register new customer
    setCustomers((prev) => {
      const existing = prev.find(
        (c) =>
          c.email.toLowerCase() === newOrder.customerEmail.toLowerCase() ||
          (newOrder.customerPhone && c.phone === newOrder.customerPhone)
      );
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalSpentEGP: (c.totalSpentEGP || 0) + newOrder.totalEGP,
                ordersCount: (c.ordersCount || 0) + 1,
              }
            : c
        );
      } else {
        const newCust: CustomerUser = {
          id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
          name: newOrder.customerName,
          email: newOrder.customerEmail,
          phone: newOrder.customerPhone,
          walletBalanceEGP: 0,
          isBanned: false,
          canPurchase: true,
          canUseCoupons: true,
          canAccessPortal: true,
          createdAt: new Date().toISOString(),
          totalSpentEGP: newOrder.totalEGP,
          ordersCount: 1,
          walletTransactions: [],
        };
        return [newCust, ...prev];
      }
    });

    setCart([]); // Clear cart
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);
  };

  // Admin order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status'], notes?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: newStatus, activationNotes: notes || o.activationNotes }
          : o
      )
    );
  };

  // Admin product operations (CREATE, UPDATE, DELETE)
  const handleAddNewProduct = (newProduct: SubscriptionProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleUpdateProduct = (updatedProduct: SubscriptionProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );

    // Also update any item in the cart if it matches this product
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === updatedProduct.id) {
          const updatedPlan = updatedProduct.plans.find((pl) => pl.id === item.selectedPlan.id) || updatedProduct.plans[0];
          return {
            ...item,
            product: updatedProduct,
            selectedPlan: updatedPlan,
          };
        }
        return item;
      })
    );
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Admin Payment Methods Handlers (صلاحيات الأدمن فقط)
  const handleUpdatePaymentMethod = (updated: PaymentMethodConfig) => {
    setPaymentMethods((prev) => prev.map((pm) => (pm.id === updated.id ? updated : pm)));
  };

  const handleTogglePaymentMethod = (id: string, enabled: boolean) => {
    setPaymentMethods((prev) => prev.map((pm) => (pm.id === id ? { ...pm, isEnabled: enabled } : pm)));
  };

  const handleAddPaymentMethod = (newMethod: PaymentMethodConfig) => {
    setPaymentMethods((prev) => [...prev, newMethod]);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
  };

  const handleResetPaymentMethods = () => {
    setPaymentMethods(INITIAL_PAYMENT_METHODS);
    localStorage.removeItem('kings_store_payment_methods');
  };

  // Customer Management Handlers (صلاحيات المشرف والأدمن على حسابات وأرصدة العملاء)
  const handleUpdateCustomerBalance = (
    customerId: string,
    amount: number,
    type: 'credit' | 'debit' | 'set',
    reason: string,
    adminNote?: string
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const cur = c.walletBalanceEGP || 0;
          let newBal = cur;
          if (type === 'credit') newBal = cur + amount;
          else if (type === 'debit') newBal = Math.max(0, cur - amount);
          else if (type === 'set') newBal = Math.max(0, amount);

          const tx: WalletTransaction = {
            id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            type: type === 'set' ? 'manual_adjust' : type,
            amount: type === 'set' ? Math.abs(newBal - cur) : amount,
            date: new Date().toISOString().split('T')[0],
            reason,
            adminNote,
            previousBalance: cur,
            newBalance: newBal,
          };

          return {
            ...c,
            walletBalanceEGP: newBal,
            walletTransactions: [tx, ...(c.walletTransactions || [])],
          };
        }
        return c;
      })
    );
  };

  const handleUpdateCustomerPermissions = (
    customerId: string,
    permissions: {
      isBanned: boolean;
      banReason?: string;
      canPurchase: boolean;
      canUseCoupons: boolean;
      canAccessPortal: boolean;
      notes?: string;
    }
  ) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          return {
            ...c,
            isBanned: permissions.isBanned,
            banReason: permissions.banReason,
            banDate: permissions.isBanned ? (c.banDate || new Date().toISOString().split('T')[0]) : undefined,
            canPurchase: permissions.canPurchase,
            canUseCoupons: permissions.canUseCoupons,
            canAccessPortal: permissions.canAccessPortal,
            notes: permissions.notes,
          };
        }
        return c;
      })
    );
  };

  const handleAddCustomer = (newCustomer: CustomerUser) => {
    setCustomers((prev) => [newCustomer, ...prev]);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== customerId));
  };

  const handleUseWalletBalance = (customerId: string, amount: number) => {
    handleUpdateCustomerBalance(
      customerId,
      amount,
      'debit',
      'دفع فوري من رصيد المحفظة لطلب اشتراك',
      'خصم شراء من المتجر'
    );
  };

  // Admin Security Handlers (التوجيه لموقع لوحة الإدارة المستقل)
  const handleOpenAdminTrigger = () => {
    navigateToAdmin();
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigateToAdmin();
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('kings_admin_auth');
    setIsAdminLoggedIn(false);
  };

  // Categories list
  const categories: { id: ProductCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'الكل', icon: Layers },
    { id: 'ai-chat', label: 'شات وتوليد نصوص', icon: Bot },
    { id: 'design', label: 'تصميم وجرافيك', icon: Palette },
    { id: 'coding', label: 'برمجة وحوسبة', icon: Code },
    { id: 'video-audio', label: 'فيديو وصوتيات', icon: Video },
    { id: 'research-study', label: 'أبحاث ودراسة', icon: BookOpen },
    { id: 'bundles', label: 'باقات التوفير الكبرى 🔥', icon: Crown },
  ];

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }

        // Delivery type filter
        if (selectedDeliveryFilter === 'invite') {
          const hasInvite = p.plans.some((pl) => pl.deliveryType === 'invite');
          if (!hasInvite) return false;
        } else if (selectedDeliveryFilter === 'private') {
          const hasPrivate = p.plans.some((pl) => pl.deliveryType === 'private_account');
          if (!hasPrivate) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = p.name.toLowerCase().includes(q) || p.nameAr.toLowerCase().includes(q);
          const matchBrand = p.brand.toLowerCase().includes(q);
          const matchDesc = p.shortDescAr.toLowerCase().includes(q) || p.fullDescAr.toLowerCase().includes(q);
          if (!matchName && !matchBrand && !matchDesc) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aMinPrice = Math.min(...a.plans.map((pl) => pl.priceEGP));
        const bMinPrice = Math.min(...b.plans.map((pl) => pl.priceEGP));

        if (sortBy === 'price-asc') return aMinPrice - bMinPrice;
        if (sortBy === 'price-desc') return bMinPrice - aMinPrice;
        if (sortBy === 'rating') return b.rating - a.rating;
        return b.salesCount - a.salesCount;
      });
  }, [products, selectedCategory, selectedDeliveryFilter, searchQuery, sortBy]);

  // Active product for dedicated product detail page
  const activeProduct = useMemo(() => {
    if (!activeProductSlug) return null;
    return products.find((p) => p.slug === activeProductSlug || p.id === activeProductSlug) || null;
  }, [activeProductSlug, products]);

  // Standalone Admin Website Routing (#admin)
  if (viewMode === 'admin') {
    if (!isAdminLoggedIn) {
      return (
        <AdminLoginModal
          isOpen={true}
          isStandalone={true}
          onClose={navigateToStore}
          onLoginSuccess={() => setIsAdminLoggedIn(true)}
        />
      );
    }

    return (
      <AdminDashboard
        isOpen={true}
        onClose={navigateToStore}
        orders={orders}
        products={products}
        subscriptions={subscriptions}
        paymentMethods={paymentMethods}
        customers={customers}
        currency={currency}
        siteSettings={siteSettings}
        onUpdateSiteSettings={handleUpdateSiteSettings}
        coupons={coupons}
        onAddCoupon={handleAddCoupon}
        onUpdateCoupon={handleUpdateCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        faqs={faqs}
        onAddFaq={handleAddFaq}
        onUpdateFaq={handleUpdateFaq}
        onDeleteFaq={handleDeleteFaq}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateSubscriptionStatus={handleUpdateSubscriptionStatus}
        onToggleCustomerAutoRenew={handleToggleAutoRenew}
        onExtendSubscription={handleExtendSubscription}
        onAddProduct={handleAddNewProduct}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onUpdatePaymentMethod={handleUpdatePaymentMethod}
        onAddPaymentMethod={handleAddPaymentMethod}
        onDeletePaymentMethod={handleDeletePaymentMethod}
        onTogglePaymentMethod={handleTogglePaymentMethod}
        onResetPaymentMethods={handleResetPaymentMethods}
        onUpdateCustomerBalance={handleUpdateCustomerBalance}
        onUpdateCustomerPermissions={handleUpdateCustomerPermissions}
        onAddCustomer={handleAddCustomer}
        onDeleteCustomer={handleDeleteCustomer}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#242933] flex flex-col font-['Cairo',sans-serif]">
      
      {/* Admin Quick Control Banner for logged-in Administrator */}
      {isAdminLoggedIn && (
        <div className="bg-[#F7EED8] text-[#5A4518] px-4 py-2 text-xs font-bold flex flex-wrap items-center justify-between gap-2 border-b border-[#EBDCB6] sticky top-0 z-50 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#5A4518] animate-pulse"></span>
            <ShieldCheck className="w-4 h-4 text-[#5A4518] shrink-0" />
            <span className="text-xs font-bold">وضع الإدارة مفعّل — أنت مسجل الدخول كمسؤول</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={navigateToAdmin}
              className="px-3 py-1 rounded-full bg-[#2C3442] text-white hover:bg-[#1E2430] transition-colors text-xs font-semibold"
            >
              <span>فتح لوحة الإدارة ⚡</span>
            </button>
            <button
              onClick={handleAdminLogout}
              className="px-2.5 py-1 rounded-full bg-[#5A4518]/10 hover:bg-[#5A4518]/20 text-[#5A4518] transition-colors text-xs font-medium"
            >
              خروج
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        cartTotalEGP={cartTotalEGP}
        currentCurrency={currency}
        onCurrencyChange={setCurrency}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenTracking={() => {
          setTrackingInitialNumber('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={navigateToAdmin}
        isAdminLoggedIn={isAdminLoggedIn}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectCategory={(cat) => {
          setActiveProductSlug(null);
          setSelectedCategory(cat);
        }}
        selectedCategory={selectedCategory}
        siteSettings={siteSettings}
        currentCustomer={currentCustomer}
        onOpenAuth={(m) => {
          setAuthModalMode(m || 'login');
          setIsAuthModalOpen(true);
        }}
        onCustomerLogout={handleCustomerLogout}
      />

      {/* Main View: Dedicated Product Detail Page or Catalog Home */}
      {activeProduct ? (
        <ProductDetailPage
          product={activeProduct}
          currency={currency}
          onBack={() => {
            setActiveProductSlug(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          onSelectOtherProduct={(slug) => {
            setActiveProductSlug(slug);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          allProducts={products}
        />
      ) : (
        <>
          {/* Hero Section */}
          <HeroBanner
            onSelectCategory={setSelectedCategory}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
            currency={currency}
            siteSettings={siteSettings}
          />

          {/* Main Catalog Section */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8" id="catalog-section">
            
            {/* Category Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-5 no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    type="button"
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border shrink-0 snap-start active:scale-95 ${
                      isSelected
                        ? 'bg-[#2C3442] text-white border-[#2C3442] shadow-xs'
                        : 'bg-white hover:bg-[#F2EFE8] border-[#E8E4DC] text-[#5A6272]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#DDE9F8]' : 'text-[#8E97A7]'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Filters and Sorters Strip */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white border border-[#E8E4DC] mb-6 shadow-xs">
              
              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-[#5A6272] font-semibold flex items-center gap-1 text-xs">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#8E97A7] shrink-0" />
                  <span>تصفية:</span>
                </span>

                <button
                  onClick={() => setSelectedDeliveryFilter('all')}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all text-xs active:scale-95 ${
                    selectedDeliveryFilter === 'all'
                      ? 'bg-[#2C3442] border-[#2C3442] text-white font-bold'
                      : 'bg-[#F8F6F2] border-[#E8E4DC] text-[#5A6272] hover:bg-[#EFECE5]'
                  }`}
                >
                  الكل ({products.length})
                </button>

                <button
                  onClick={() => setSelectedDeliveryFilter('invite')}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all text-xs active:scale-95 ${
                    selectedDeliveryFilter === 'invite'
                      ? 'bg-[#EEF4FC] border-[#BED6F5] text-[#204E85] font-bold'
                      : 'bg-[#F8F6F2] border-[#E8E4DC] text-[#5A6272] hover:bg-[#EFECE5]'
                  }`}
                >
                  تفعيل على إيميلك
                </button>

                <button
                  onClick={() => setSelectedDeliveryFilter('private')}
                  type="button"
                  className={`px-3 py-1.5 rounded-full border transition-all text-xs active:scale-95 ${
                    selectedDeliveryFilter === 'private'
                      ? 'bg-[#FBF0E4] border-[#F2D1B3] text-[#7A4012] font-bold'
                      : 'bg-[#F8F6F2] border-[#E8E4DC] text-[#5A6272] hover:bg-[#EFECE5]'
                  }`}
                >
                  حساب خاص
                </button>
              </div>

              {/* Sort selector */}
              <div className="flex items-center justify-between md:justify-end gap-2 text-xs pt-1 md:pt-0 border-t md:border-t-0 border-[#F0ECE4]">
                <div className="flex items-center gap-1.5 text-[#5A6272]">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#8E97A7] shrink-0" />
                  <span className="text-xs">ترتيب:</span>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F8F6F2] border border-[#E8E4DC] text-[#242933] rounded-full px-3 py-1.5 text-xs focus:outline-none focus:border-[#C4BEAF] cursor-pointer"
                >
                  <option value="popular">الأكثر مبيعاً</option>
                  <option value="price-asc">الأقل سعراً</option>
                  <option value="price-desc">الأعلى سعراً</option>
                  <option value="rating">الأعلى تقييماً</option>
                </select>
              </div>

            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-2xl bg-white border border-[#E8E4DC] space-y-3">
                <Search className="w-10 h-10 text-[#8E97A7] mx-auto" />
                <h3 className="text-base font-bold text-[#242933]">لم نجد اشتراكات تطابق بحثك</h3>
                <p className="text-xs text-[#5A6272] max-w-sm mx-auto">
                  جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من شريط الأقسام في الأعلى.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedDeliveryFilter('all');
                  }}
                  type="button"
                  className="px-4 py-2 rounded-full bg-[#EEF4FC] hover:bg-[#DFECFA] text-[#204E85] font-bold text-xs border border-[#BED6F5] active:scale-95 transition-transform"
                >
                  عرض كافة الاشتراكات
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currency={currency}
                    onAddToCart={handleAddToCart}
                    onBuyNow={handleBuyNow}
                    onViewDetails={(prod) => {
                      setActiveProductSlug(prod.slug);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                ))}
              </div>
            )}

          </main>

          {/* Trust & Guarantee Section */}
          <TrustFeaturesSection />

          {/* Customer Reviews Section */}
          {siteSettings.showReviewsSection !== false && (
            <TestimonialsSection reviews={MOCK_REVIEWS} />
          )}

          {/* FAQ Section */}
          <FaqSection faqs={faqs} isVisible={siteSettings.showFaqSection !== false} />
        </>
      )}

      {/* Footer */}
      <Footer
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
        onOpenCustomerPortal={() => setIsCustomerPortalOpen(true)}
        onSelectCategory={setSelectedCategory}
        siteSettings={siteSettings}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Floating Elements */}
      <FloatingWhatsApp
        whatsappNumber={siteSettings.whatsappNumber}
        presetMessage={siteSettings.whatsappMessagePreset}
        isEnabled={siteSettings.enableWhatsAppFloating}
      />
      <RecentSalesToast />

      {/* MODALS */}

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        currency={currency}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenFullPage={(slug) => {
          setDetailProduct(null);
          setActiveProductSlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Customer Self-Service Subscriptions Management Portal */}
      <CustomerPortalModal
        isOpen={isCustomerPortalOpen}
        onClose={() => setIsCustomerPortalOpen(false)}
        subscriptions={subscriptions}
        customers={customers}
        currency={currency}
        onToggleAutoRenew={handleToggleAutoRenew}
        onRenewNow={handleRenewNow}
        onCancelSubscription={handleCancelSubscription}
        onOpenProductDetail={(slug) => {
          setIsCustomerPortalOpen(false);
          setActiveProductSlug(slug);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        defaultCustomerEmail={currentCustomer?.email || 'ahmedcraft153@gmail.com'}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        totalEGP={cartTotalEGP}
        onOrderPlaced={handleOrderPlaced}
        paymentMethods={paymentMethods}
        customers={customers}
        onUseWalletBalance={handleUseWalletBalance}
        currentCustomer={currentCustomer}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        order={completedOrder}
        currency={currency}
        onClose={() => setCompletedOrder(null)}
        onViewTracking={(orderNumber) => {
          setTrackingInitialNumber(orderNumber);
          setIsTrackingOpen(true);
        }}
      />

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialOrderNumber={trackingInitialNumber}
        currency={currency}
      />

      {/* AI Subscription Advisor Quiz Modal */}
      <AiAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        products={products}
        currency={currency}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Protected Admin Access Login Modal (Fallback) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* Supabase Customer Authentication Modal (تسجيل دخول وإنشاء حساب) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          if (
            window.location.hash === '#login' ||
            window.location.hash === '#register' ||
            window.location.hash === '#signup' ||
            window.location.hash === '#database' ||
            window.location.hash === '#supabase'
          ) {
            window.location.hash = '';
          }
        }}
        onLoginSuccess={handleCustomerLoginSuccess}
        existingCustomers={customers}
        initialMode={authModalMode}
      />

    </div>
  );
}
