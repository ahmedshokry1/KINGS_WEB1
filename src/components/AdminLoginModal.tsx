import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle,
  Crown
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  isStandalone?: boolean;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  isStandalone = false,
}) => {
  if (!isOpen) return null;

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Valid admin master passwords
  const validPasswords = ['kings2025', 'admin', 'kingsadmin', '123456'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('يرجى كتابة كلمة مرور لوحة الإدارة');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (validPasswords.includes(password.trim().toLowerCase())) {
        localStorage.setItem('kings_admin_auth', 'true');
        onLoginSuccess();
        onClose();
        setPassword('');
      } else {
        setError('كلمة المرور غير صحيحة! كلمة المرور الافتراضية هي: kings2025');
      }
      setIsLoading(false);
    }, 400);
  };

  const loginCardContent = (
    <div 
      className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-5 left-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        title="الرجوع إلى المتجر"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Icon & Title */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-[2px] shadow-lg shadow-amber-500/25">
          <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>منطقة محمية ومخصصة لإدارة المتجر 🔒</span>
        </div>

        <h3 className="text-xl font-black text-white">
          تسجيل دخول موقع الإدارة
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          أدخل كلمة سر المشرف للوصول إلى منصة التحكم الشاملة وتعديل كل شيء في الموقع
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            كلمة مرور المسؤول (Admin Password)
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اكتب كلمة المرور..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3.5 text-slate-400 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>دخول منصة الإدارة</span>
            </>
          )}
        </button>

        {/* Quick Demo Helper */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              setPassword('kings2025');
              setError('');
            }}
            className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-4"
          >
            استخدام كلمة المرور الافتراضية للتجربة (kings2025)
          </button>
        </div>
      </form>
    </div>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen w-full bg-[#070a12] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md flex items-center justify-between mb-4 z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>الرجوع إلى المتجر الرئيسي</span>
          </button>

          <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
            King's Store Portal
          </span>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {loginCardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      {loginCardContent}
    </div>
  );
};

