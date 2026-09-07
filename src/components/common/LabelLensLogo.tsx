import React from 'react';

interface LabelLensLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
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
    xs: { box: 'w-6 h-6', text: 'text-sm', sub: 'text-[8px]', badge: 'text-[8px] px-1' },
    sm: { box: 'w-8 h-8', text: 'text-base', sub: 'text-[9px]', badge: 'text-[8px] px-1.5' },
    md: { box: 'w-10 h-10', text: 'text-lg sm:text-xl', sub: 'text-[11px]', badge: 'text-[9px] px-1.5' },
    lg: { box: 'w-14 h-14', text: 'text-2xl', sub: 'text-xs', badge: 'text-[10px] px-2' },
    xl: { box: 'w-20 h-20', text: 'text-3xl', sub: 'text-sm', badge: 'text-xs px-2.5' },
    '2xl': { box: 'w-28 h-28', text: 'text-4xl', sub: 'text-base', badge: 'text-xs px-3' }
  };

  const { box, text, sub, badge } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 shrink-0 select-none ${className}`}>
      {/* High-Tech Optical Scanner & Statutory Shield Emblem */}
      <div className={`relative ${box} shrink-0 rounded-2xl p-[1.5px] bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-500 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-300 group`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-[14px] bg-slate-950 p-1"
        >
          <defs>
            {/* Holographic Lens Gradient */}
            <radialGradient id="lensAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="65%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>

            {/* Shield Outline Gradient */}
            <linearGradient id="shieldBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Golden Scales Gradient */}
            <linearGradient id="goldScales" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            {/* Sovereign Tricolor Gradient */}
            <linearGradient id="tricolorGradient" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="48%" stopColor="#FFFFFF" />
              <stop offset="52%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
          </defs>

          {/* Deep Optical Lens Background */}
          <rect width="100" height="100" rx="14" fill="url(#lensAura)" />

          {/* Precision Outer Circular Reticle Track */}
          <circle cx="50" cy="50" r="41" stroke="#334155" strokeWidth="1.2" strokeDasharray="3 3" />
          <circle cx="50" cy="50" r="34" stroke="#1E293B" strokeWidth="1" />

          {/* Exterior Rounded Protective Shield */}
          <path
            d="M50 14 L78 24 C78 52 50 82 50 82 C50 82 22 52 22 24 Z"
            fill="#0F172A"
            fillOpacity="0.85"
            stroke="url(#shieldBorder)"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />

          {/* Optical Scanner Reticle Brackets (Cyan & Amber) */}
          <path d="M31 32 H38 M31 32 V39" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M69 32 H62 M69 32 V39" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M31 62 H38 M31 62 V55" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M69 62 H62 M69 62 V55" stroke="#38BDF8" strokeWidth="2.2" strokeLinecap="round" />

          {/* Golden Scales of Justice (Legal Metrology Act, 2009) */}
          <path d="M37 40 H63" stroke="url(#goldScales)" strokeWidth="2.4" strokeLinecap="round" />
          <path d="M50 34 V46" stroke="url(#goldScales)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="50" cy="34" r="2.2" fill="#FDE047" />

          {/* Left & Right Scale Pans */}
          <path d="M35 41 L32 47 H42 L39 41 Z" fill="#FDE047" fillOpacity="0.8" />
          <path d="M65 41 L62 47 H72 L69 41 Z" fill="#FDE047" fillOpacity="0.8" />

          {/* Central Verified Statutory Checkmark Seal (Rule 6 / FSSAI) */}
          <circle cx="50" cy="57" r="10" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.8" />
          <path
            d="M45.5 57 L48.8 60.3 L55 53.8"
            stroke="#FFFFFF"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Sovereign Indian Tricolor Base Arc */}
          <path
            d="M37 72 Q50 78 63 72"
            stroke="url(#tricolorGradient)"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Companion Brand Typography (Light / Dark Adaptive) */}
      {showText && (
        <div className="flex flex-col shrink-0 min-w-0">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className={`font-black tracking-tight text-slate-900 dark:text-white transition-colors duration-200 whitespace-nowrap ${text}`}>
              Label Lens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-emerald-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-emerald-400">AI</span>
            </span>
            <span className={`inline-flex items-center font-extrabold tracking-wider uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-300 dark:border-emerald-800 shrink-0 ${badge}`}>
              SIH 2026
            </span>
          </div>
          {showSubtitle && (
            <p className={`text-slate-500 dark:text-slate-400 font-medium leading-tight whitespace-nowrap truncate max-w-[280px] sm:max-w-none transition-colors duration-200 ${sub}`}>
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
      <radialGradient id="expLensAura" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#1E293B" />
        <stop offset="100%" stop-color="#020617" />
      </radialGradient>
      <linearGradient id="expShieldBorder" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#38BDF8" />
        <stop offset="50%" stop-color="#6366F1" />
        <stop offset="100%" stop-color="#10B981" />
      </linearGradient>
      <linearGradient id="expGoldScales" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FDE047" />
        <stop offset="100%" stop-color="#EAB308" />
      </linearGradient>
      <linearGradient id="expTricolor" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#FF9933" />
        <stop offset="48%" stop-color="#FFFFFF" />
        <stop offset="52%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#138808" />
      </linearGradient>
    </defs>
    <rect width="100" height="100" rx="20" fill="url(#expLensAura)"/>
    <circle cx="50" cy="50" r="41" stroke="#334155" stroke-width="1.2" stroke-dasharray="3 3"/>
    <path d="M50 14 L78 24 C78 52 50 82 50 82 C50 82 22 52 22 24 Z" fill="#0F172A" fill-opacity="0.85" stroke="url(#expShieldBorder)" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M31 32 H38 M31 32 V39" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M69 32 H62 M69 32 V39" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M31 62 H38 M31 62 V55" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M69 62 H62 M69 62 V55" stroke="#38BDF8" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M37 40 H63" stroke="url(#expGoldScales)" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M50 34 V46" stroke="url(#expGoldScales)" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="34" r="2.2" fill="#FDE047"/>
    <path d="M35 41 L32 47 H42 L39 41 Z" fill="#FDE047" fill-opacity="0.8"/>
    <path d="M65 41 L62 47 H72 L69 41 Z" fill="#FDE047" fill-opacity="0.8"/>
    <circle cx="50" cy="57" r="10" fill="#10B981" stroke="#FFFFFF" stroke-width="1.8"/>
    <path d="M45.5 57 L48.8 60.3 L55 53.8" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M37 72 Q50 78 63 72" stroke="url(#expTricolor)" stroke-width="2.4" stroke-linecap="round" fill="none"/>
  </svg>`;
}
