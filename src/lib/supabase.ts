import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import { CustomerUser, WalletTransaction } from '../types/store';

// Supabase project credentials (provided by user & configurable via Vite env or UI)
const DEFAULT_SUPABASE_URL = 'https://qhwpjyuoushvsaepzsyh.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_N2UoozSHTt-KKdZda2cevw_M_VLKIUR';

const ENV_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const ENV_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_ANON_KEY;

const STORAGE_KEY_URL = 'kings_supabase_url';
const STORAGE_KEY_ANON = 'kings_supabase_anon_key';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  if (typeof window === 'undefined') {
    return { url: ENV_SUPABASE_URL, anonKey: ENV_SUPABASE_ANON_KEY };
  }
  const customUrl = localStorage.getItem(STORAGE_KEY_URL);
  const customKey = localStorage.getItem(STORAGE_KEY_ANON);
  return {
    url: (customUrl && customUrl.trim()) || ENV_SUPABASE_URL,
    anonKey: (customKey && customKey.trim()) || ENV_SUPABASE_ANON_KEY,
  };
}

export function saveStoredSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window === 'undefined') return;
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_ANON);

  // Reinitialize client instance
  initSupabaseClient();
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (url && anonKey && url.startsWith('http')) {
    try {
      supabaseInstance = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      supabaseInstance = null;
      return null;
    }
  }
  supabaseInstance = null;
  return null;
}

// Initial initialization
initSupabaseClient();

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    return initSupabaseClient();
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getStoredSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
}

/**
 * Test connectivity with the configured Supabase instance
 */
export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string }> {
  const targetUrl = url || getStoredSupabaseConfig().url;
  const targetKey = key || getStoredSupabaseConfig().anonKey;

  if (!targetUrl || !targetKey || !targetUrl.startsWith('http')) {
    return { success: false, message: 'يرجى إدخال رابط المشروع المفتاح العام (Anon Key) بشكل صحيح.' };
  }

  try {
    const testClient = createClient(targetUrl, targetKey);
    // Attempt a light ping by querying auth settings or a basic table
    const { error } = await testClient.auth.getSession();
    if (error) {
      return { success: false, message: `تعذر الاتصال: ${error.message}` };
    }
    return { success: true, message: 'تم الاتصال بقاعدة بيانات Supabase بنجاح!' };
  } catch (err: any) {
    return { success: false, message: `خطأ في الاتصال: ${err?.message || 'تأكد من صحة الرابط والمفتاح'}` };
  }
}

/**
 * Register a new user in Supabase Auth & create a customer profile record
 */
export async function signUpWithSupabase(params: {
  email: string;
  password: string;
  name: string;
  phone: string;
}): Promise<{ success: boolean; user?: CustomerUser; error?: string; requiresEmailConfirmation?: boolean }> {
  const client = getSupabase();

  // If Supabase is connected, use real Supabase Auth
  if (client) {
    try {
      const { data, error } = await client.auth.signUp({
        email: params.email,
        password: params.password,
        options: {
          data: {
            full_name: params.name,
            phone: params.phone,
          },
        },
      });

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      const authUser = data.user;
      if (!authUser) {
        return { success: false, error: 'حدث خطأ غير متوقع أثناء إنشاء الحساب.' };
      }

      const customerId = `CUST-${authUser.id.slice(0, 8).toUpperCase()}`;

      // Insert profile record in 'profiles' / 'customers' table in Supabase
      try {
        await client.from('customers').upsert({
          id: authUser.id,
          customer_code: customerId,
          email: params.email,
          name: params.name,
          phone: params.phone,
          wallet_balance_egp: 0,
          is_banned: false,
          created_at: new Date().toISOString(),
        });
      } catch (tableErr) {
        // Table might not exist yet if user hasn't run migration; soft fail
        console.warn('Could not insert into Supabase customers table directly:', tableErr);
      }

      const newCustomer: CustomerUser = {
        id: customerId,
        name: params.name,
        email: params.email,
        phone: params.phone,
        walletBalanceEGP: 0,
        isBanned: false,
        canPurchase: true,
        canUseCoupons: true,
        canAccessPortal: true,
        createdAt: new Date().toISOString(),
        totalSpentEGP: 0,
        ordersCount: 0,
        walletTransactions: [],
      };

      const requiresConfirmation = !data.session && Boolean(authUser);

      return {
        success: true,
        user: newCustomer,
        requiresEmailConfirmation: requiresConfirmation,
      };
    } catch (err: any) {
      return { success: false, error: err?.message || 'تعذر الاتصال بـ Supabase.' };
    }
  }

  // Fallback to local storage customer creation if Supabase credentials are not yet entered
  const customerId = `CUST-${Math.floor(1000 + Math.random() * 9000)}`;
  const localCustomer: CustomerUser = {
    id: customerId,
    name: params.name,
    email: params.email,
    phone: params.phone,
    walletBalanceEGP: 0,
    isBanned: false,
    canPurchase: true,
    canUseCoupons: true,
    canAccessPortal: true,
    createdAt: new Date().toISOString(),
    totalSpentEGP: 0,
    ordersCount: 0,
    walletTransactions: [],
  };

  return {
    success: true,
    user: localCustomer,
    requiresEmailConfirmation: false,
  };
}

/**
 * Sign in existing user with Supabase
 */
export async function signInWithSupabase(params: {
  email: string;
  password: string;
  existingCustomers?: CustomerUser[];
}): Promise<{ success: boolean; user?: CustomerUser; error?: string }> {
  const client = getSupabase();

  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        return { success: false, error: translateSupabaseError(error.message) };
      }

      const authUser = data.user;
      if (!authUser) {
        return { success: false, error: 'تعذر العثور على بيانات المستخدم.' };
      }

      // Try fetching profile from Supabase 'customers' table
      let fetchedCustomer: Partial<CustomerUser> | null = null;
      try {
        const { data: dbData } = await client
          .from('customers')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();

        if (dbData) {
          fetchedCustomer = {
            id: dbData.customer_code || `CUST-${authUser.id.slice(0, 8).toUpperCase()}`,
            name: dbData.name || authUser.user_metadata?.full_name || 'عميل كينجز ستور',
            email: dbData.email || authUser.email || params.email,
            phone: dbData.phone || authUser.user_metadata?.phone || '',
            walletBalanceEGP: Number(dbData.wallet_balance_egp || 0),
            isBanned: Boolean(dbData.is_banned),
            canPurchase: dbData.can_purchase ?? true,
            canUseCoupons: dbData.can_use_coupons ?? true,
            canAccessPortal: dbData.can_access_portal ?? true,
            createdAt: dbData.created_at || authUser.created_at,
            totalSpentEGP: Number(dbData.total_spent_egp || 0),
            ordersCount: Number(dbData.orders_count || 0),
          };
        }
      } catch (dbErr) {
        console.warn('Could not read from Supabase customers table:', dbErr);
      }

      const customer: CustomerUser = {
        id: fetchedCustomer?.id || `CUST-${authUser.id.slice(0, 8).toUpperCase()}`,
        name: fetchedCustomer?.name || authUser.user_metadata?.full_name || 'عميل كينجز ستور',
        email: authUser.email || params.email,
        phone: fetchedCustomer?.phone || authUser.user_metadata?.phone || '',
        walletBalanceEGP: fetchedCustomer?.walletBalanceEGP ?? 0,
        isBanned: fetchedCustomer?.isBanned ?? false,
        canPurchase: fetchedCustomer?.canPurchase ?? true,
        canUseCoupons: fetchedCustomer?.canUseCoupons ?? true,
        canAccessPortal: fetchedCustomer?.canAccessPortal ?? true,
        createdAt: fetchedCustomer?.createdAt || authUser.created_at,
        totalSpentEGP: fetchedCustomer?.totalSpentEGP ?? 0,
        ordersCount: fetchedCustomer?.ordersCount ?? 0,
        walletTransactions: [],
      };

      return { success: true, user: customer };
    } catch (err: any) {
      return { success: false, error: err?.message || 'تعذر تسجيل الدخول عبر Supabase.' };
    }
  }

  // Local fallback: search existingCustomers list
  const cleanEmail = params.email.trim().toLowerCase();
  const found = params.existingCustomers?.find((c) => c.email.toLowerCase() === cleanEmail);

  if (found) {
    if (found.isBanned) {
      return { success: false, error: `هذا الحساب محظور حالياً: ${found.banReason || 'تواصل مع الدعم الفني'}` };
    }
    return { success: true, user: found };
  }

  // Create standard local session if email is valid
  const fallbackUser: CustomerUser = {
    id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
    name: cleanEmail.split('@')[0],
    email: cleanEmail,
    phone: '',
    walletBalanceEGP: 0,
    isBanned: false,
    canPurchase: true,
    canUseCoupons: true,
    canAccessPortal: true,
    createdAt: new Date().toISOString(),
    totalSpentEGP: 0,
    ordersCount: 0,
    walletTransactions: [],
  };

  return { success: true, user: fallbackUser };
}

/**
 * Sign out of Supabase
 */
export async function signOutSupabase(): Promise<void> {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (e) {
      console.warn('Error during Supabase signOut:', e);
    }
  }
}

/**
 * Sync customer updates (like wallet balance) to Supabase
 */
export async function syncCustomerToSupabase(customer: CustomerUser): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    await client.from('customers').upsert({
      customer_code: customer.id,
      email: customer.email,
      name: customer.name,
      phone: customer.phone,
      wallet_balance_egp: customer.walletBalanceEGP,
      is_banned: customer.isBanned,
      can_purchase: customer.canPurchase,
      can_use_coupons: customer.canUseCoupons,
      can_access_portal: customer.canAccessPortal,
      total_spent_egp: customer.totalSpentEGP,
      orders_count: customer.ordersCount,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });
  } catch (e) {
    console.warn('Failed to sync customer to Supabase:', e);
  }
}

function translateSupabaseError(errorMsg: string): string {
  const lower = errorMsg.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid_grant')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
  }
  if (lower.includes('user already registered') || lower.includes('already exists')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل! يمكنك تسجيل الدخول مباشرة.';
  }
  if (lower.includes('password should be at least')) {
    return 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.';
  }
  if (lower.includes('email not confirmed')) {
    return 'يرجى تأكيد بريدك الإلكتروني أولاً عبر الرابط المرسل لبريدك.';
  }
  if (lower.includes('rate limit')) {
    return 'تم إرسال عدة طلبات متتالية، يرجى الانتظار دقيقة والمحاولة مجدداً.';
  }
  return errorMsg;
}
