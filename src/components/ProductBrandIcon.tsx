import React from 'react';

interface ProductBrandIconProps {
  slug?: string;
  brand?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ProductBrandIcon: React.FC<ProductBrandIconProps> = ({
  slug = '',
  brand = '',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-16 h-16 text-lg',
  }[size];

  const iconSizePx = {
    sm: 18,
    md: 26,
    lg: 32,
    xl: 38,
  }[size];

  const key = `${slug} ${brand}`.toLowerCase();

  // 1. Google Gemini / Google AI
  if (key.includes('gemini') || key.includes('google-gemini') || key.includes('google ai')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center p-1.5 shadow-lg bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 shadow-blue-500/25 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
            fill="url(#gemini_grad)"
          />
          <defs>
            <linearGradient id="gemini_grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" />
              <stop offset="0.5" stopColor="#E0F2FE" />
              <stop offset="1" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 2. Canva Pro
  if (key.includes('canva')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-cyan-500/25 ${sizeClasses} ${className}`}>
        <span className="text-white font-serif font-black italic tracking-tighter" style={{ fontSize: iconSizePx * 0.9 }}>
          C
        </span>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-slate-950 font-black shadow">
          ★
        </div>
      </div>
    );
  }

  // 3. ChatGPT / OpenAI
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-emerald-500 via-teal-600 to-slate-900 shadow-emerald-500/25 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" fill="none" />
          <path d="M12 6a6 6 0 0 0-5.19 3 6 6 0 0 0 1.73 7.46 6 6 0 0 0 7.46-1.73A6 6 0 0 0 12 6z" fill="currentColor" fillOpacity="0.4" />
          <circle cx="12" cy="12" r="2.5" fill="white" />
        </svg>
      </div>
    );
  }

  // 4. Anthropic Claude Pro
  if (key.includes('claude') || key.includes('anthropic')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-600 via-orange-600 to-stone-900 shadow-orange-500/25 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path
            d="M4.5 12h15M12 4.5v15M6.7 6.7l10.6 10.6M17.3 6.7L6.7 17.3"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 5. Cursor AI
  if (key.includes('cursor')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-600 via-indigo-600 to-slate-900 shadow-purple-500/25 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 3L19 12L12 14L9 21L5 3Z"
            fill="white"
            stroke="#C084FC"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // 6. Midjourney
  if (key.includes('midjourney')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-pink-500 via-rose-600 to-purple-900 shadow-pink-500/25 ${sizeClasses} ${className}`}>
        {/* Origami sailboat icon */}
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path d="M3 17l9 4 9-4-3-10H6L3 17z" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M12 3v18M12 3l7 14M12 3L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // 7. Perplexity AI
  if (key.includes('perplexity')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-teal-500 via-cyan-600 to-slate-900 shadow-teal-500/25 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M12 7v10M7 12h10M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 8. ElevenLabs
  if (key.includes('elevenlabs') || key.includes('eleven')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-orange-500 via-amber-600 to-slate-900 shadow-orange-500/25 ${sizeClasses} ${className}`}>
        {/* Sound waves icon */}
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-3 bg-white rounded-full animate-pulse"></div>
          <div className="w-1.5 h-6 bg-white rounded-full"></div>
          <div className="w-1.5 h-4 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-5 bg-white rounded-full"></div>
        </div>
      </div>
    );
  }

  // 9. CapCut Pro
  if (key.includes('capcut')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-900 shadow-sky-500/25 ${sizeClasses} ${className}`}>
        {/* Film / scissors diamond ribbon */}
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="2" />
          <path d="M7 5v14M17 5v14M3 12h18" stroke="currentColor" strokeWidth="1.5" />
          <polygon points="11,9 15,12 11,15" fill="white" />
        </svg>
      </div>
    );
  }

  // 10. Google Colab
  if (key.includes('colab')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-500 via-yellow-600 to-orange-700 shadow-amber-500/25 ${sizeClasses} ${className}`}>
        {/* Infinity loop / Colab loop */}
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
          <path
            d="M8.5 7.5A4.5 4.5 0 0 0 4 12a4.5 4.5 0 0 0 4.5 4.5c2.1 0 3.8-1.5 4.5-3.5.7 2 2.4 3.5 4.5 3.5a4.5 4.5 0 0 0 4.5-4.5 4.5 4.5 0 0 0-4.5-4.5c-2.1 0-3.8 1.5-4.5 3.5-.7-2-2.4-3.5-4.5-3.5z"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 11. Super Bundles
  if (key.includes('bundle') || key.includes('باقة')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-700 shadow-amber-500/30 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-950">
          <path
            d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M5 19H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default fallback AI Sparkle Icon
  return (
    <div className={`relative rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-amber-500 to-indigo-600 shadow-amber-500/20 ${sizeClasses} ${className}`}>
      <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="white" fillOpacity="0.4" />
      </svg>
    </div>
  );
};
