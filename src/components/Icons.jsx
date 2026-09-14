import React from 'react';

/* ─────────────────────────────────────────────
   NEURO custom SVG icon set
   Each icon takes: size (default 20), color, style, className
──────────────────────────────────────────────── */

export const NeuroLogo = ({ size = 36, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9"/>
        <stop offset="40%" stopColor="#e0e7ff" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0"/>
      </radialGradient>
      <linearGradient id="ring-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ffffff" stopOpacity="0.6"/>
        <stop offset="1" stopColor="#94a3b8" stopOpacity="0.2"/>
      </linearGradient>
      <filter id="n-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
      <filter id="n-core" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.5" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>

    {/* Outer orbit ring */}
    <circle cx="32" cy="32" r="28" stroke="#ffffff" strokeWidth="0.8" fill="none" opacity="0.12"/>
    
    {/* Middle orbit ring - tilted ellipse feel */}
    <ellipse cx="32" cy="32" rx="22" ry="20" stroke="#ffffff" strokeWidth="0.6" fill="none" opacity="0.1" transform="rotate(-15 32 32)"/>
    
    {/* Inner orbit ring */}
    <circle cx="32" cy="32" r="14" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.15"/>

    {/* Central glowing core */}
    <circle cx="32" cy="32" r="10" fill="url(#core-glow)" filter="url(#n-core)"/>
    <circle cx="32" cy="32" r="5" fill="#ffffff" opacity="0.95" filter="url(#n-glow)"/>
    <circle cx="32" cy="32" r="2.5" fill="#ffffff"/>

    {/* Neural connection lines from core to outer nodes */}
    <line x1="32" y1="32" x2="14" y2="18" stroke="#ffffff" strokeWidth="0.7" opacity="0.25"/>
    <line x1="32" y1="32" x2="50" y2="20" stroke="#ffffff" strokeWidth="0.7" opacity="0.25"/>
    <line x1="32" y1="32" x2="52" y2="42" stroke="#ffffff" strokeWidth="0.7" opacity="0.2"/>
    <line x1="32" y1="32" x2="12" y2="44" stroke="#ffffff" strokeWidth="0.7" opacity="0.2"/>
    <line x1="32" y1="32" x2="32" y2="6"  stroke="#ffffff" strokeWidth="0.7" opacity="0.2"/>
    <line x1="32" y1="32" x2="32" y2="58" stroke="#ffffff" strokeWidth="0.7" opacity="0.15"/>

    {/* Outer neural nodes */}
    <circle cx="14" cy="18" r="2.5" fill="#ffffff" opacity="0.7" filter="url(#n-glow)"/>
    <circle cx="50" cy="20" r="2.5" fill="#ffffff" opacity="0.7" filter="url(#n-glow)"/>
    <circle cx="52" cy="42" r="2"   fill="#ffffff" opacity="0.5" filter="url(#n-glow)"/>
    <circle cx="12" cy="44" r="2"   fill="#ffffff" opacity="0.5" filter="url(#n-glow)"/>
    <circle cx="32" cy="6"  r="1.8" fill="#ffffff" opacity="0.45"/>
    <circle cx="32" cy="58" r="1.8" fill="#ffffff" opacity="0.35"/>

    {/* Mid-layer nodes on the inner ring */}
    <circle cx="20" cy="26" r="1.5" fill="#ffffff" opacity="0.4"/>
    <circle cx="44" cy="28" r="1.5" fill="#ffffff" opacity="0.4"/>
    <circle cx="24" cy="42" r="1.2" fill="#ffffff" opacity="0.3"/>
    <circle cx="42" cy="40" r="1.2" fill="#ffffff" opacity="0.3"/>

    {/* Subtle cross-connections between outer nodes */}
    <line x1="14" y1="18" x2="50" y2="20" stroke="#ffffff" strokeWidth="0.4" opacity="0.1" strokeDasharray="2 3"/>
    <line x1="50" y1="20" x2="52" y2="42" stroke="#ffffff" strokeWidth="0.4" opacity="0.1" strokeDasharray="2 3"/>
    <line x1="12" y1="44" x2="14" y2="18" stroke="#ffffff" strokeWidth="0.4" opacity="0.1" strokeDasharray="2 3"/>
  </svg>
);

export const BrainCoreIcon = ({ size = 20, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    {/* Human Brain Silhouette icon */}
    <path
      d="M7 6 C5 7, 3 10, 3.5 13 C4 15, 5 16.5, 6.5 17 C7 18, 8 19, 10 19 C11 20.5, 13 21, 14 21 C14.5 21.5, 15.5 22, 16 21.5 C16.5 21, 15.5 19.5, 15.5 18.5 C17 18, 18.5 17, 19 15.5 C20.5 14, 21 11, 19.5 8 C18 5, 15 3.5, 12 4 C10 4, 8.5 5, 7 6 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(255,255,255,0.06)"
    />
    <path d="M6 10 Q8 10 8 12 Q8 14 6 14" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M11 6 Q13 7 12 10 Q14 11 15 9" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M18 10 Q16 11 16 13 Q18 14 18 12" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M10 16 Q12 15 13 17" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
    <path d="M14 18 Q16 17 17.5 16" stroke={color} strokeWidth="1.1" strokeLinecap="round"/>
  </svg>
);

export const VoiceIcon = ({ size = 20, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="7.5" y="2" width="5" height="10" rx="2.5" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M4 10c0 3.314 2.686 6 6 6s6-2.686 6-6" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <line x1="10" y1="16" x2="10" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="7"  y1="19" x2="13" y2="19" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const EnginesIcon = ({ size = 20, color = '#fbbf24' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="3" stroke={color} strokeWidth="1.5" fill="none"/>
    <circle cx="10" cy="3"  r="1.5" fill={color} opacity="0.8"/>
    <circle cx="10" cy="17" r="1.5" fill={color} opacity="0.8"/>
    <circle cx="3"  cy="10" r="1.5" fill={color} opacity="0.8"/>
    <circle cx="17" cy="10" r="1.5" fill={color} opacity="0.8"/>
    <circle cx="5"  cy="5"  r="1.2" fill={color} opacity="0.5"/>
    <circle cx="15" cy="15" r="1.2" fill={color} opacity="0.5"/>
    <circle cx="15" cy="5"  r="1.2" fill={color} opacity="0.5"/>
    <circle cx="5"  cy="15" r="1.2" fill={color} opacity="0.5"/>
    <line x1="10" y1="7" x2="10" y2="4.5"  stroke={color} strokeWidth="1" opacity="0.7"/>
    <line x1="10" y1="13" x2="10" y2="15.5" stroke={color} strokeWidth="1" opacity="0.7"/>
    <line x1="7"  y1="10" x2="4.5" y2="10" stroke={color} strokeWidth="1" opacity="0.7"/>
    <line x1="13" y1="10" x2="15.5" y2="10" stroke={color} strokeWidth="1" opacity="0.7"/>
  </svg>
);

export const SlidesIcon = ({ size = 20, color = '#f472b6' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
    <rect x="5" y="7" width="5" height="5" rx="1" fill={color} opacity="0.6"/>
    <line x1="12" y1="8"  x2="16" y2="8"  stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7"/>
    <line x1="12" y1="10.5" x2="15" y2="10.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
    <line x1="8"  y1="19" x2="12" y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
    <line x1="12" y1="19" x2="8"  y2="16" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
);

export const MemoryIcon = ({ size = 20, color = '#34d399' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <ellipse cx="10" cy="7" rx="7" ry="4" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M3 7v6c0 2.21 3.134 4 7 4s7-1.79 7-4V7" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M3 10c0 2.21 3.134 4 7 4s7-1.79 7-4" stroke={color} strokeWidth="1.2" strokeDasharray="2 2" fill="none" opacity="0.5"/>
  </svg>
);

export const AutomationIcon = ({ size = 20, color = '#60a5fa' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M4 3h3v4H4z" rx="1" stroke={color} strokeWidth="1.3" fill="none"/>
    <path d="M13 3h3v4h-3z" stroke={color} strokeWidth="1.3" fill="none"/>
    <path d="M4 13h3v4H4z" stroke={color} strokeWidth="1.3" fill="none"/>
    <path d="M13 13h3v4h-3z" stroke={color} strokeWidth="1.3" fill="none"/>
    <line x1="7" y1="5" x2="13" y2="5" stroke={color} strokeWidth="1.3"/>
    <line x1="10" y1="5" x2="10" y2="7" stroke={color} strokeWidth="1.3"/>
    <line x1="10" y1="7" x2="10" y2="13" stroke={color} strokeWidth="1.3" strokeDasharray="2 1" opacity="0.6"/>
    <line x1="10" y1="13" x2="7" y2="15" stroke={color} strokeWidth="1.3"/>
    <line x1="10" y1="13" x2="13" y2="15" stroke={color} strokeWidth="1.3"/>
  </svg>
);

export const SettingsIcon = ({ size = 20, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="2.5" stroke={color} strokeWidth="1.5" fill="none"/>
    <path d="M10 1.5l1.1 1.9a7 7 0 011.6.65l2.1-.55 1.65 2.85-1.55 1.55a7 7 0 010 1.82l1.55 1.55-1.65 2.85-2.1-.55a7 7 0 01-1.6.65L10 18.5l-1.1-1.9a7 7 0 01-1.6-.65l-2.1.55L3.55 13.65l1.55-1.55a7 7 0 010-1.82L3.55 8.73 5.2 5.88l2.1.55a7 7 0 011.6-.65L10 1.5z" stroke={color} strokeWidth="1.3" fill="none"/>
  </svg>
);

export const UploadIcon = ({ size = 18, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M3 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M9 11V4" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5.5 7L9 3.5 12.5 7" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ExportIcon = ({ size = 18, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M3 12v2a1 1 0 001 1h10a1 1 0 001-1v-2" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M9 4v7" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5.5 7.5L9 11 12.5 7.5" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SendIcon = ({ size = 16, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill={color}/>
  </svg>
);

export const NotificationIcon = ({ size = 18, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path d="M9 2a5 5 0 00-5 5v3.5L2.5 12.5h13L14 10.5V7a5 5 0 00-5-5z" stroke={color} strokeWidth="1.4" fill="none"/>
    <path d="M7 14a2 2 0 004 0" stroke={color} strokeWidth="1.4" fill="none"/>
  </svg>
);

export const SearchIcon = ({ size = 16, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.4"/>
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

export const PlusIcon = ({ size = 16, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <line x1="8" y1="2" x2="8" y2="14" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="2" y1="8" x2="14" y2="8" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const CalendarIcon = ({ size = 16, color = '#ffffff' }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <rect x="3" y="4" width="14" height="13" rx="2" stroke={color} strokeWidth="1.5" fill="none"/>
    <line x1="3" y1="8" x2="17" y2="8" stroke={color} strokeWidth="1.2"/>
    <line x1="7" y1="2" x2="7" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="13" y1="2" x2="13" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="7" cy="11" r="1" fill={color}/>
    <circle cx="10" cy="11" r="1" fill={color}/>
    <circle cx="13" cy="11" r="1" fill={color}/>
    <circle cx="7" cy="14" r="1" fill={color}/>
    <circle cx="10" cy="14" r="1" fill={color}/>
  </svg>
);

export const CheckIcon = ({ size = 14, color = '#34d399' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2 7l4 4 6-6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const TrashIcon = ({ size = 14, color = '#f87171' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M1.5 3h11M5 3V1.5h4V3M5.5 5.5v5M8.5 5.5v5M2.5 3l.8 9h7.4l.8-9" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ChevronRightIcon = ({ size = 14, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M5 3l4 4-4 4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const RefreshIcon = ({ size = 14, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M1.5 7A5.5 5.5 0 0012 9.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M12.5 7A5.5 5.5 0 002 4.5" stroke={color} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M10 7.5l2-2 2 2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 6.5l-2 2-2-2" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const EyeIcon = ({ size = 14, color = '#94a3b8' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M1 7S3 3 7 3s6 4 6 4-2 4-6 4-6-4-6-4z" stroke={color} strokeWidth="1.3" fill="none"/>
    <circle cx="7" cy="7" r="1.5" stroke={color} strokeWidth="1.2" fill="none"/>
  </svg>
);

export const ZapIcon = ({ size = 14, color = '#fbbf24' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M8 1.5L3 8h4.5L6 12.5 11 6H6.5L8 1.5z" fill={color} stroke={color} strokeWidth="0.6" strokeLinejoin="round"/>
  </svg>
);

export const KeyboardIcon = ({ size = 16, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3.5" width="14" height="9" rx="1.5" stroke={color} strokeWidth="1.3" fill="none"/>
    <rect x="3" y="6" width="2" height="2" rx="0.5" fill={color} opacity="0.7"/>
    <rect x="7" y="6" width="2" height="2" rx="0.5" fill={color} opacity="0.7"/>
    <rect x="11" y="6" width="2" height="2" rx="0.5" fill={color} opacity="0.7"/>
    <rect x="5" y="9" width="6" height="1.5" rx="0.75" fill={color} opacity="0.5"/>
  </svg>
);
