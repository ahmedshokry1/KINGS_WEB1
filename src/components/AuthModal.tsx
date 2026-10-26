import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Sparkles, 
  Crown, 
  ArrowRight, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  RefreshCw,
  Zap
} from 'lucide-react';
import { CustomerUser } from '../types/store';
import { 
  signInWithSupabase, 
  signUpWithSupabase, 
  isSupabaseConfigured, 
  getStoredSupabaseConfig, 
  saveStoredSupabaseConfig, 
  testSupabaseConnection 
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (customer: CustomerUser) => void;
  existingCustomers?: CustomerUser[];
  initialMode?: 'login' | 'register' | 'database';
  isStandalone?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  existingCustomers = [],
  initialMode = 'login',
  isStandalone = false,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'database'>(initialMode);
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Supabase Config fields
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [isTestingSb, setIsTestingSb] = useState(false);
  const [sbStatusNotice, setSbStatusNotice] = useState<{ success: boolean; msg: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);

  // General UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Check Supabase connection state
  const isSbActive = isSupabaseConfigured();

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      const conf = getStoredSupabaseConfig();
      setSbUrl(conf.url || '');
      setSbKey(conf.anonKey || '');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signInWithSupabase({
        email: loginEmail,
        password: loginPassword,
        existingCustomers,
      });

      if (result.success && result.user) {
        setSuccessMessage(`أهلاً بك مجدداً يا ${result.user.name} 👋`);
        setTimeout(() => {
          onLoginSuccess(result.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(result.error || 'تعذر تسجيل الدخول، تأكد من صحة البيانات.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ غير متوقع');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('يرجى إدخال الاسم، البريد الإلكتروني وكلمة المرور');
      return;
    }

    if (regPassword.length < 6) {
      setErrorMessage('كلمة المرور يجب أن لا تقل عن 6 أحرف أو أرقام');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage('كلمتا المرور غير متطابقتين، يرجى إعادة التأكد');
      return;
    }

    setIsLoading(true);
    try {
      const result = await signUpWithSupabase({
        email: regEmail,
        password: regPassword,
        name: regName,
        phone: regPhone,
      });

      if (result.success && result.user) {
        if (result.requiresEmailConfirmation) {
          setSuccessMessage('تم إنشاء حسابك في Supabase بنجاح! تفقد بريدك لتأكيد التسجيل.');
        } else {
          setSuccessMessage(`تم إنشاء حسابك بنجاح في كينجز ستور! مرحباً بك يا ${result.user.name} 🎉`);
        }
        setTimeout(() => {
          onLoginSuccess(result.user!);
          onClose();
        }, 900);
      } else {
        setErrorMessage(result.error || 'تعذر إنشاء الحساب');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'حدث خطأ غير متوقع أثناء التسجيل');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTestingSb(true);
    setSbStatusNotice(null);

    const test = await testSupabaseConnection(sbUrl, sbKey);
    setIsTestingSb(false);

    if (test.success) {
      saveStoredSupabaseConfig(sbUrl, sbKey);
      setSbStatusNotice({ success: true, msg: '✅ تم الاتصال وحفظ بيانات Supabase بنجاح! الحسابات متصلة الآن مباشرة بقاعدتك.' });
    } else {
      setSbStatusNotice({ success: false, msg: test.message });
    }
  };

  const handleCopySql = () => {
    const sql = `-- كود إنشاء جدول عملاء كينجز ستور في Supabase SQL Editor
create table if not exists public.customers (
    id uuid default gen_random_uuid() primary key,
    customer_code text unique,
    email text unique not null,
    name text not null,
    phone text,
    wallet_balance_egp numeric default 0,
    is_banned boolean default false,
    can_purchase boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
alter table public.customers enable row level security;
create policy "Allow public read" on public.customers for select using (true);
create policy "Allow public insert and update" on public.customers for all using (true) with check (true);`;
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const content = (
    <div className={`relative w-full ${isStandalone ? 'max-w-xl' : 'max-w-lg'} bg-white border border-[#E8E4DC] rounded-2xl shadow-xl overflow-hidden flex flex-col font-['Cairo',sans-serif] text-[#242933] animate-in fade-in zoom-in-95 duration-200`}>
      
      {/* Header */}
      <div className="p-5 border-b border-[#E8E4DC] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F5E6BD] flex items-center justify-center text-[#2C3442] border border-[#EBDCB6]">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#242933]">حساب عميل كينجز ستور</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              إدارة الاشتراكات والتراخيص ورصيد المحفظة
            </p>
          </div>
        </div>

        {!isStandalone && (
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Supabase Status Banner */}
      <div className="px-5 py-2.5 bg-[#F8F6F2] border-b border-[#E8E4DC] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-slate-600 font-medium">قاعدة البيانات:</span>
          {isSbActive ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              متصلة سحابياً بنجاح
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-[#EEF4FC] text-[#2C5282] px-2 py-0.5 rounded-full border border-[#BED6F5] text-[11px]">
              وضع الحفظ المحلي السريع
            </span>
          )}
        </div>

        <button
          onClick={() => setMode('database')}
          className="text-[#2C5282] hover:text-[#1E3A5F] text-[11px] underline underline-offset-2 flex items-center gap-1"
        >
          <span>إعدادات الربط</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation Mode Tabs */}
      <div className="p-2.5 bg-[#F8F6F2] border-b border-[#E8E4DC] flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-[#2C3442] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#242933] hover:bg-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>تسجيل الدخول</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`flex-1 py-2 rounded-full font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-[#2C3442] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#242933] hover:bg-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>حساب جديد</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('database'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`px-3 py-2 rounded-full font-medium text-xs transition-all flex items-center justify-center gap-1 ${
            mode === 'database'
              ? 'bg-[#2C5282] text-white shadow-xs'
              : 'text-slate-600 hover:text-[#242933] hover:bg-white'
          }`}
          title="ربط قاعدة بيانات Supabase"
        >
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Supabase</span>
        </button>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="m-4 mb-0 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="m-4 mb-0 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Body content based on tab */}
      <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(85vh-160px)]">

        {/* TAB 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-3.5 py-2.5 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442] transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-10 py-2.5 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>جارٍ تسجيل الدخول...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>

            {/* Quick Demo Credentials */}
            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-500 mb-2">حسابات تجريبية سريعة:</p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('ahmed@gmail.com');
                    setLoginPassword('123456');
                  }}
                  className="px-3 py-1 rounded-full bg-[#F8F6F2] hover:bg-[#EFECE5] text-xs text-[#242933] border border-[#E8E4DC]"
                >
                  عميل تجريبي: ahmed@gmail.com
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('sarah@company.eg');
                    setLoginPassword('123456');
                  }}
                  className="px-3 py-1 rounded-full bg-[#F8F6F2] hover:bg-[#EFECE5] text-xs text-[#242933] border border-[#E8E4DC]"
                >
                  عميل تجريبي: sarah@company.eg
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                الاسم بالكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="محمد أحمد"
                  className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-3.5 py-2.5 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-3.5 py-2.5 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                رقم الهاتف / الواتساب (اختياري)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="010XXXXXXXX"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg pr-10 pl-3.5 py-2.5 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6 أحرف فأكثر"
                    dir="ltr"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black p-1"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  تأكيد كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="أعد كتابتها"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-[#242933] placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#2C3442]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-full bg-[#3B72A8] hover:bg-[#305E8C] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>جارٍ إنشاء الحساب...</span>
                </>
              ) : (
                <span>إنشاء الحساب</span>
              )}
            </button>
          </form>
        )}

        {/* TAB 3: SUPABASE CONFIGURATION */}
        {mode === 'database' && (
          <div className="space-y-4 text-slate-700 text-xs">
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">الربط مع Supabase</h4>
                <p className="text-slate-600 text-xs mt-0.5 leading-relaxed">
                  احفظ بيانات العملاء وكلمات المرور المشفرة وأرصدة المحافظ مباشرة في مشروع Supabase الخاص بك.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSupabaseConfig} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  رابط المشروع (Supabase URL) <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="url"
                  value={sbUrl}
                  onChange={(e) => setSbUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  dir="ltr"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-[#242933] font-mono text-xs focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  المفتاح العام (Anon Key) <span className="text-emerald-600">*</span>
                </label>
                <textarea
                  value={sbKey}
                  onChange={(e) => setSbKey(e.target.value)}
                  placeholder="sb_publishable_..."
                  dir="ltr"
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-[#242933] font-mono text-[11px] focus:outline-none focus:border-emerald-600"
                  required
                />
              </div>

              {sbStatusNotice && (
                <div className={`p-3 rounded-xl border text-xs ${
                  sbStatusNotice.success 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}>
                  {sbStatusNotice.msg}
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isTestingSb}
                  className="flex-1 py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isTestingSb ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>جارٍ فحص الاتصال...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>اختبار وحفظ الاتصال</span>
                    </>
                  )}
                </button>

                {isSbActive && (
                  <button
                    type="button"
                    onClick={() => {
                      saveStoredSupabaseConfig('', '');
                      setSbUrl('');
                      setSbKey('');
                      setSbStatusNotice({ success: true, msg: 'تم فصل الربط والعودة إلى التخزين المحلي.' });
                    }}
                    className="py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    فصل
                  </button>
                )}
              </div>
            </form>

            {/* SQL Script Quick Copy */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-700">سكريبت SQL:</span>
                <button
                  type="button"
                  onClick={handleCopySql}
                  className="flex items-center gap-1 text-[11px] text-[#242933] bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full border border-slate-200"
                >
                  {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSql ? 'تم النسخ!' : 'نسخ كود SQL'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                الصق الكود في Supabase SQL Editor لإنشاء جدول العملاء وسياسات الأمان تلقائياً.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>حماية وتشفير آمن</span>
        </div>
        <div>
          {mode === 'login' ? (
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className="text-[#242933] hover:underline font-bold"
            >
              إنشاء حساب جديد
            </button>
          ) : mode === 'register' ? (
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className="text-[#242933] hover:underline font-bold"
            >
              تسجيل الدخول
            </button>
          ) : (
            <button
              onClick={() => { setMode('login'); }}
              className="text-[#242933] hover:underline font-bold"
            >
              العودة لتسجيل الدخول
            </button>
          )}
        </div>
      </div>

    </div>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen w-full bg-[#F8F6F2] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-xs overflow-y-auto">
      {content}
    </div>
  );
};
