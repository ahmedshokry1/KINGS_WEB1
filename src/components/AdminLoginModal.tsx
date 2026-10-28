import React, { useState } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  X, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  KeyRound, 
  AlertCircle
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
        setError('كلمة المرور غير صحيحة!');
      }
      setIsLoading(false);
    }, 400);
  };

  const loginCardContent = (
    <div 
      className="relative w-full max-w-md bg-white border border-[#E8E4DC] rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 font-['Cairo',sans-serif] text-[#242933]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onClose}
        className="absolute top-5 left-5 p-2 rounded-full bg-[#F8F6F2] text-[#5A6272] hover:text-[#242933] transition-colors border border-[#E8E4DC]"
        title="الرجوع إلى المتجر"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Icon & Title */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#EAF2EC] text-[#13583D] border border-[#CDE3D4] flex items-center justify-center">
          <KeyRound className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2EC] border border-[#CDE3D4] text-[#13583D] text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>منطقة إدارة المتجر</span>
        </div>

        <h3 className="text-xl font-bold text-[#242933]">
          تسجيل دخول لوحة الإدارة
        </h3>
        <p className="text-xs text-[#5A6272] mt-1">
          أدخل كلمة سر المشرف للوصول إلى لوحة التحكم
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#242933] mb-1.5">
            كلمة مرور المسؤول
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="اكتب كلمة المرور..."
              className="w-full bg-[#F8F6F2] border border-[#E8E4DC] rounded-xl px-4 py-3 pl-11 text-sm text-[#242933] placeholder-[#8E97A7] focus:outline-none focus:border-[#13583D] transition-colors"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 top-3.5 text-[#8E97A7] hover:text-[#242933] transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FDEEEC] border border-[#F7C6C3] text-[#9C2B27] text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 rounded-xl bg-[#13583D] hover:bg-[#0E442F] text-white font-bold text-sm shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>دخول لوحة الإدارة</span>
            </>
          )}
        </button>
      </form>
    </div>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen w-full bg-[#F8F6F2] text-[#242933] flex flex-col justify-center items-center p-4 relative font-['Cairo',sans-serif]">
        <div className="w-full max-w-md flex items-center justify-between mb-4 z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs text-[#5A6272] hover:text-[#242933] transition-colors bg-white px-3 py-1.5 rounded-xl border border-[#E8E4DC]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>الرجوع إلى المتجر الرئيسي</span>
          </button>

          <span className="text-[11px] font-mono text-[#13583D] bg-[#EAF2EC] px-2.5 py-1 rounded-xl border border-[#CDE3D4]">
            King's Store Admin
          </span>
        </div>

        <div className="relative z-10 w-full max-w-md">
          {loginCardContent}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {loginCardContent}
    </div>
  );
};
