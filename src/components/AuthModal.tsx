import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  Crown, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { CustomerUser } from '../types/store';
import { 
  signInWithSupabase, 
  signUpWithSupabase
} from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (customer: CustomerUser) => void;
  existingCustomers?: CustomerUser[];
  initialMode?: 'login' | 'register';
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
  const [mode, setMode] = useState<'login' | 'register'>(initialMode === 'register' ? 'register' : 'login');
  
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

  // General UI states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode === 'register' ? 'register' : 'login');
      setErrorMessage('');
      setSuccessMessage('');
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
          setSuccessMessage('تم إنشاء حسابك بنجاح! تفقد بريدك لتأكيد التسجيل.');
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

  const content = (
    <div className={`relative w-full ${isStandalone ? 'max-w-xl' : 'max-w-md'} bg-white border border-[#E8E4DC] rounded-3xl shadow-xl overflow-hidden flex flex-col font-['Cairo',sans-serif] text-[#242933] animate-in fade-in zoom-in-95 duration-200`}>
      
      {/* Header */}
      <div className="p-5 border-b border-[#E8E4DC] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#EAF2EC] text-[#13583D] border border-[#CDE3D4] flex items-center justify-center">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-[#242933]">حساب عميل كينجز ستور</h3>
            </div>
            <p className="text-xs text-[#5A6272] mt-0.5">
              إدارة الاشتراكات والتراخيص ورصيد المحفظة
            </p>
          </div>
        </div>

        {!isStandalone && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5A6272] hover:text-[#242933] hover:bg-[#F0ECE4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Mode Tabs (تسجيل الدخول / حساب جديد فقط) */}
      <div className="p-2 bg-[#F8F6F2] border-b border-[#E8E4DC] flex items-center gap-2">
        <button
          type="button"
          onClick={() => { setMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            mode === 'login'
              ? 'bg-[#13583D] text-white shadow-xs'
              : 'text-[#5A6272] hover:text-[#242933] hover:bg-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>تسجيل الدخول</span>
        </button>

        <button
          type="button"
          onClick={() => { setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
          className={`flex-1 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            mode === 'register'
              ? 'bg-[#13583D] text-white shadow-xs'
              : 'text-[#5A6272] hover:text-[#242933] hover:bg-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>حساب جديد</span>
        </button>
      </div>

      {/* Messages */}
      {errorMessage && (
        <div className="m-4 mb-0 p-3 rounded-xl bg-[#FDEEEC] border border-[#F7C6C3] text-[#9C2B27] text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#9C2B27]" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="m-4 mb-0 p-3 rounded-xl bg-[#EAF2EC] border border-[#CDE3D4] text-[#13583D] text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#13583D]" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Body Content */}
      <div className="p-5 sm:p-6">
        
        {/* TAB 1: LOGIN */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#242933] mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2.5 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242933] mb-1">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  dir="ltr"
                  className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-10 py-2.5 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E97A7] hover:text-[#242933]"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
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
          </form>
        )}

        {/* TAB 2: REGISTER */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-[#242933] mb-1">
                الاسم بالكامل <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="مثال: أحمد محمد"
                  className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242933] mb-1">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="name@example.com"
                  dir="ltr"
                  className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#242933] mb-1">
                رقم الهاتف / واتساب (اختياري)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="01012345678"
                  dir="ltr"
                  className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-10 pl-4 py-2 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#242933] mb-1">
                  كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="6 خانات فأكثر"
                    dir="ltr"
                    className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-9 pl-8 py-2 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8E97A7] hover:text-[#242933]"
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#242933] mb-1">
                  تأكيد كلمة المرور <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-[#8E97A7]" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="تأكيد كلمة المرور"
                    dir="ltr"
                    className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl pr-9 pl-3 py-2 text-xs sm:text-sm text-[#242933] focus:outline-none focus:border-[#13583D]"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-3 py-3 px-4 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
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

      </div>

      {/* Footer */}
      <div className="p-4 bg-[#F8F6F2] border-t border-[#E8E4DC] flex items-center justify-between text-xs text-[#5A6272]">
        <div className="flex items-center gap-1.5 text-[#13583D]">
          <ShieldCheck className="w-4 h-4" />
          <span>بياناتك محمية ومؤمنة</span>
        </div>
        <div>
          {mode === 'login' ? (
            <button
              onClick={() => { setMode('register'); setErrorMessage(''); }}
              className="text-[#13583D] hover:underline font-bold"
            >
              ليس لديك حساب؟ سجل الآن
            </button>
          ) : (
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className="text-[#13583D] hover:underline font-bold"
            >
              لديك حساب بالفعل؟ تسجيل الدخول
            </button>
          )}
        </div>
      </div>

    </div>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      {content}
    </div>
  );
};
