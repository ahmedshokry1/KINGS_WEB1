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

  // 1. Microsoft (Clean 4-Color Windows Grid on soft white)
  if (key.includes('microsoft') || key.includes('office') || key.includes('windows')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#F3F5F7] border border-[#E1E5EA] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <div className="grid grid-cols-2 gap-1 p-1">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#F25022] rounded-xs shadow-2xs"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#7FBA00] rounded-xs shadow-2xs"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#00A4EF] rounded-xs shadow-2xs"></div>
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#FFB900] rounded-xs shadow-2xs"></div>
        </div>
      </div>
    );
  }

  // 2. Lovable AI (Crisp Gradient Heart Icon matching the screenshot)
  if (key.includes('lovable')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#FFF1F2] border border-[#FFE4E6] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="url(#lovable_heart)" xmlns="http://www.w3.org/2000/svg" className="filter drop-shadow-xs transform transition-transform group-hover:scale-110">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          <defs>
            <linearGradient id="lovable_heart" x1="2" y1="3" x2="22" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F43F5E" />
              <stop offset="1" stopColor="#E11D48" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // 3. Duolingo (Cute Duolingo Owl Face)
  if (key.includes('duolingo') || key.includes('duo')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#F2FBF1] border border-[#DCF4D9] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110">
          {/* Owl Head Shape */}
          <rect x="4" y="5" width="24" height="22" rx="10" fill="#58CC02" />
          {/* Eye circles */}
          <circle cx="11" cy="14" r="5" fill="white" />
          <circle cx="21" cy="14" r="5" fill="white" />
          {/* Pupils */}
          <circle cx="12" cy="14" r="2.5" fill="#2E384D" />
          <circle cx="20" cy="14" r="2.5" fill="#2E384D" />
          <circle cx="12.8" cy="13" r="0.8" fill="white" />
          <circle cx="20.8" cy="13" r="0.8" fill="white" />
          {/* Orange Beak */}
          <polygon points="16,16 13,20 19,20" fill="#FF9600" />
        </svg>
      </div>
    );
  }

  // 4. Zoom (Crisp Modern Video Camera in Blue)
  if (key.includes('zoom')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#EFF6FF] border border-[#DBEAFE] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110">
          <rect x="2" y="6" width="13" height="12" rx="3.5" fill="#0B5CFF" />
          <path d="M16 10L21 6.5V17.5L16 14V10Z" fill="#0B5CFF" />
          <circle cx="8.5" cy="12" r="2" fill="white" fillOpacity="0.85" />
        </svg>
      </div>
    );
  }

  // 5. Google Gemini / Google AI (Iconic 4-Point Multi-Stop Sparkle)
  if (key.includes('gemini') || key.includes('google-gemini') || key.includes('google ai')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center p-1.5 bg-gradient-to-tr from-[#1B6EF3] via-[#7B57FF] to-[#1AD1D7] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110">
          <path
            d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z"
            fill="white"
          />
        </svg>
      </div>
    );
  }

  // 6. Canva Pro (Canva Cyan Gradient with Elegant C)
  if (key.includes('canva')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#00C4CC] via-[#00A9CE] to-[#7D2AE8] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <span className="text-white font-serif font-black italic tracking-tighter select-none transform transition-transform group-hover:scale-110" style={{ fontSize: iconSizePx * 0.95 }}>
          C
        </span>
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[8px] text-slate-950 font-black shadow-xs">
          ★
        </div>
      </div>
    );
  }

  // 7. ChatGPT / OpenAI (Official Sacred Rosette Spiral)
  if (key.includes('chatgpt') || key.includes('openai') || key.includes('gpt')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#10A37F] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform group-hover:rotate-12 duration-300">
          <path d="M12 2a10 10 0 0 0-9.8 8.1 4.5 4.5 0 0 0 .8 4.2 4.5 4.5 0 0 0 1.2 5.6 10 10 0 0 0 15.6-3.8 4.5 4.5 0 0 0 1.4-4.8A10 10 0 0 0 12 2z" />
          <path d="M12 8a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4z" />
          <circle cx="12" cy="12" r="1.5" fill="white" />
        </svg>
      </div>
    );
  }

  // 8. Anthropic Claude Pro (Terracotta Asterisk Sunburst)
  if (key.includes('claude') || key.includes('anthropic')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#D97757] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:rotate-45 duration-300">
          <path
            d="M4 12h16M12 4v16M6.3 6.3l11.4 11.4M17.7 6.3L6.3 17.7"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 9. Cursor AI (Modern Isometric Developer Glyph)
  if (key.includes('cursor')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#1E1E24] to-[#0A0A0C] border border-slate-700/50 shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:scale-110">
          <path
            d="M6 3L18 12L12 14L9 21L6 3Z"
            fill="#FFFFFF"
            stroke="#8B5CF6"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  // 10. Midjourney (Iconic Sailboat Silhouette)
  if (key.includes('midjourney')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#2D2D39] via-[#1F1F27] to-[#121217] border border-slate-700/40 shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:-translate-y-0.5 duration-300">
          <path d="M3 17l9 4 9-4-3-10H6L3 17z" fill="white" fillOpacity="0.2" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M12 3v18M12 3l7 14M12 3L5 17" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    );
  }

  // 11. Perplexity AI (Clean Search Mesh)
  if (key.includes('perplexity')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#20808D] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:rotate-12 duration-300">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
          <path d="M12 7v10M7 12h10M8.5 8.5l7 7M15.5 8.5l-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 12. ElevenLabs (Voice Soundwaves in Radiant Amber)
  if (key.includes('elevenlabs') || key.includes('eleven')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-[#111111] border border-slate-700/50 shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-3 bg-white rounded-full group-hover:h-5 transition-all duration-300"></div>
          <div className="w-1.5 h-6 bg-white rounded-full group-hover:h-4 transition-all duration-300"></div>
          <div className="w-1.5 h-4 bg-white rounded-full group-hover:h-6 transition-all duration-300"></div>
          <div className="w-1.5 h-5 bg-white rounded-full group-hover:h-3 transition-all duration-300"></div>
        </div>
      </div>
    );
  }

  // 13. CapCut Pro (Stylized Film Cut Hexagon)
  if (key.includes('capcut')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#0F0F11] to-[#1E1E24] border border-slate-700/50 shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:scale-110">
          <rect x="3" y="5" width="18" height="14" rx="3" stroke="white" strokeWidth="2" />
          <path d="M7 5v14M17 5v14M3 12h18" stroke="white" strokeWidth="1.5" />
          <polygon points="11,9 15,12 11,15" fill="#00D2FF" />
        </svg>
      </div>
    );
  }

  // 14. Google Colab (Infinity loop in Colab Yellow/Orange)
  if (key.includes('colab')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#F9AB00] to-[#E37400] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:scale-110">
          <path
            d="M8.5 7.5A4.5 4.5 0 0 0 4 12a4.5 4.5 0 0 0 4.5 4.5c2.1 0 3.8-1.5 4.5-3.5.7 2 2.4 3.5 4.5 3.5a4.5 4.5 0 0 0 4.5-4.5 4.5 4.5 0 0 0-4.5-4.5c-2.1 0-3.8 1.5-4.5 3.5-.7-2-2.4-3.5-4.5-3.5z"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // 15. Super Bundles (Golden Crown VIP)
  if (key.includes('bundle') || key.includes('باقة')) {
    return (
      <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#D97706] via-[#B45309] to-[#78350F] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
        <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white transform transition-transform group-hover:scale-110">
          <path
            d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z"
            fill="white"
            stroke="white"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M5 19H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // Default fallback Sparkle Icon
  return (
    <div className={`relative rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#13583D] to-[#0A3323] shadow-xs group-hover:shadow-sm transition-all duration-300 ${sizeClasses} ${className}`}>
      <svg width={iconSizePx} height={iconSizePx} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white transform transition-transform group-hover:scale-110">
        <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z" fill="white" fillOpacity="0.4" />
      </svg>
    </div>
  );
};
