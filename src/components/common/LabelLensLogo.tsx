import React from 'react';

interface LabelLensLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const LabelLensLogo: React.FC<LabelLensLogoProps> = ({
  size = 'md',
  showText = false,
  showSubtitle = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7', text: 'text-base', sub: 'text-[9px]' },
    md: { box: 'w-10 h-10', text: 'text-lg sm:text-xl', sub: 'text-[11px]' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm' }
  };

  const { box, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 shrink-0 select-none ${className}`}>
      {/* Precision Reticle & Shield Logo */}
      <div className={`relative ${box} shrink-0 rounded-2xl bg-gradient-to-br from-brand-700 via-indigo-700 to-emerald-600 p-0.5 shadow-md shadow-brand-500/20 flex items-center justify-center`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          <defs>
            <linearGradient id="logoShieldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4338CA" />
              <stop offset="50%" stopColor="#3730A3" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="tricolorAccent" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>

          {/* Exterior Rounded Protective Shield */}
          <path
            d="M50 12 L78 22 C78 52 50 82 50 82 C50 82 22 52 22 22 Z"
            fill="url(#logoShieldGrad)"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* Optical Scanner Reticle Corners */}
          <path d="M30 32 H38 M30 32 V40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M70 32 H62 M70 32 V40" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M30 62 H38 M30 62 V54" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M70 62 H62 M70 62 V54" stroke="#FDE047" strokeWidth="2.5" strokeLinecap="round" />

          {/* Central Scales of Justice Balance Beam */}
          <path d="M38 42 H62" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 36 V48" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          
          {/* Scale Pans */}
          <path d="M36 43 L33 50 H43 L40 43 Z" fill="#F8FAFC" opacity="0.9" />
          <path d="M64 43 L61 50 H71 L68 43 Z" fill="#F8FAFC" opacity="0.9" />

          {/* Central Verified Statutory Checkmark */}
          <circle cx="50" cy="58" r="11" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M45 58 L48.5 61.5 L55 54.5"
            stroke="#FFFFFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle Tricolor India Sovereign Ribbon */}
          <path
            d="M38 74 H62"
            stroke="url(#tricolorAccent)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Companion Brand Typography */}
      {showText && (
        <div className="flex flex-col shrink-0 min-w-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className={`font-black tracking-tight bg-gradient-to-r from-brand-700 via-indigo-800 to-emerald-700 bg-clip-text text-transparent whitespace-nowrap ${text}`}>
              Label Lens AI
            </span>
            <span className="inline-flex px-1.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-emerald-100 text-emerald-800 rounded border border-emerald-300 shrink-0">
              SIH 2026
            </span>
          </div>
          {showSubtitle && (
            <p className={`text-slate-500 font-medium leading-tight whitespace-nowrap truncate max-w-[280px] ${sub}`}>
              Statutory Legal Metrology & Food Safety Engine
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * High-definition standalone SVG markup for embedding in HTML/PDF exports
 */
export function getLabelLensSvgMarkup(size: number = 64): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="expShieldGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#4338CA" />
        <stop offset="50%" stop-color="#3730A3" />
        <stop offset="100%" stop-color="#059669" />
      </linearGradient>
      <linearGradient id="expTricolor" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF9933" />
        <stop offset="50%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#138808" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="22" fill="#0F172A"/>
    <path d="M50 12 L78 22 C78 52 50 82 50 82 C50 82 22 52 22 22 Z" fill="url(#expShieldGrad)" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round"/>
    <path d="M30 32 H38 M30 32 V40" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" />
    <path d="M70 32 H62 M70 32 V40" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" />
    <path d="M30 62 H38 M30 62 V54" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" />
    <path d="M70 62 H62 M70 62 V54" stroke="#FDE047" stroke-width="2.5" stroke-linecap="round" />
    <path d="M38 42 H62" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" />
    <path d="M50 36 V48" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <path d="M36 43 L33 50 H43 L40 43 Z" fill="#F8FAFC" opacity="0.9" />
    <path d="M64 43 L61 50 H71 L68 43 Z" fill="#F8FAFC" opacity="0.9" />
    <circle cx="50" cy="58" r="11" fill="#10B981" stroke="#FFFFFF" stroke-width="2" />
    <path d="M45 58 L48.5 61.5 L55 54.5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M38 74 H62" stroke="url(#expTricolor)" stroke-width="2.5" stroke-linecap="round"/>
  </svg>`;
}
