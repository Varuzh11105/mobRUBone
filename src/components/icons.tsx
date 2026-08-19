import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p,
});

/* Логотип: ладонь с монетой-сердцем */
export const LogoMark = (p: P) => (
  <svg {...base(p)} strokeWidth={1.7}>
    <circle cx="12" cy="8.2" r="5.2" fill="currentColor" stroke="none" opacity="0.14" />
    <path d="M12 11.2c-2.3-1.6-3.7-3.1-3.7-4.7a2.2 2.2 0 0 1 3.7-1.6 2.2 2.2 0 0 1 3.7 1.6c0 1.6-1.4 3.1-3.7 4.7Z" fill="currentColor" stroke="none" />
    <path d="M3.5 14.5c1.8-1 3.4-1 4.8 0l1.6 1.1c.7.5 1.6.5 2.3 0l1.2-.9" />
    <path d="M3.5 14.5V20h5l6.4.9a4 4 0 0 0 2.9-.6l2.7-1.9c1-.7.5-2.3-.8-2.2l-4 .4" />
  </svg>
);

export const IconFeed = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 5.5h16M4 5.5 5.6 18a2 2 0 0 0 2 1.8h8.8a2 2 0 0 0 2-1.8L20 5.5" />
    <path d="M8 5V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" />
    <path d="M12 10v6M12 10l-2 2m2-2 2 2" />
  </svg>
);

export const IconHistory = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 6h9m-9 4.5h7m-7 4.5h9" />
    <path d="M17.3 12.6c1.9 1.3 3 2.6 3 4a3 3 0 0 1-5.3 1.8L14 17l-1 1.4a3 3 0 0 1-5.3-1.8c0-1.4 1.1-2.7 3-4l3.3-2.3 3.3 2.3Z" fill="currentColor" fillOpacity="0.16" />
  </svg>
);

export const IconTarget = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.6" opacity="0.55" />
    <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    <path d="M12 2.2v3M12 18.8v3M2.2 12h3M18.8 12h3" opacity="0.55" />
  </svg>
);

export const IconShield = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3 5 5.8v5.4c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V5.8L12 3Z" fill="currentColor" fillOpacity="0.13" />
    <path d="m8.8 11.8 2.2 2.2 4.2-4.6" />
  </svg>
);

export const IconPlus = (p: P) => (
  <svg {...base(p)} strokeWidth={2.4}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconSearch = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m20 20-4.6-4.6" />
  </svg>
);

export const IconBack = (p: P) => (
  <svg {...base(p)} strokeWidth={2.1}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </svg>
);

export const IconClose = (p: P) => (
  <svg {...base(p)} strokeWidth={2.1}>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconShare = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6" cy="12" r="2.6" />
    <circle cx="17.5" cy="5.5" r="2.6" />
    <circle cx="17.5" cy="18.5" r="2.6" />
    <path d="m8.4 10.8 6.8-4M8.4 13.2l6.8 4" />
  </svg>
);

export const IconCheck = (p: P) => (
  <svg {...base(p)} strokeWidth={2.4}>
    <path d="m4.5 12.5 5 5L19.5 7" />
  </svg>
);

export const IconVerified = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 2.8 14 4.9l2.9-.4.6 2.9 2.7 1.2-1.2 2.7 1.2 2.7-2.7 1.2-.6 2.9-2.9-.4-2 2.1-2-2.1-2.9.4-.6-2.9-2.7-1.2L4 11.3l1.2-2.7L4 5.9l2.7-1.2.6-2.9 2.9.4 1.8-1.4Z" fill="currentColor" stroke="none" />
    <path d="m8.8 11.6 2.2 2.2 4.2-4.6" stroke="#fbfcf9" strokeWidth={2} />
  </svg>
);

export const IconUsers = (p: P) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8.5" r="3.4" />
    <path d="M3.2 20c.5-3.3 2.8-5.3 5.8-5.3s5.3 2 5.8 5.3" />
    <path d="M15.5 5.6a3.4 3.4 0 0 1 0 5.8M17.6 14.9c1.8.8 3 2.4 3.2 5.1" opacity="0.6" />
  </svg>
);

export const IconClock = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.5V12l3.2 2.4" />
  </svg>
);

export const IconCard = (p: P) => (
  <svg {...base(p)}>
    <rect x="3" y="5.5" width="18" height="13.5" rx="2.6" />
    <path d="M3 10h18" strokeWidth={2.4} />
    <path d="M7 15h4" />
  </svg>
);

export const IconSBP = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.4" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.4" />
    <path d="M14 14h3v3h-3zM20 14v.01M20 20h-3" strokeWidth={2.2} />
  </svg>
);

export const IconWallet = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h11A2.5 2.5 0 0 1 20 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
    <path d="M15 12h5v3.5h-5a1.75 1.75 0 1 1 0-3.5Z" fill="currentColor" fillOpacity="0.15" />
  </svg>
);

export const IconCopy = (p: P) => (
  <svg {...base(p)}>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2.4" />
    <path d="M5.5 15.5h-1a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const IconSpark = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 3.5 13.8 9l5.7 1.8-5.7 1.8L12 18.2l-1.8-5.6L4.5 10.8 10.2 9 12 3.5Z" fill="currentColor" fillOpacity="0.18" />
    <path d="M19 16.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" fill="currentColor" stroke="none" opacity="0.7" />
  </svg>
);

export const IconArrowR = (p: P) => (
  <svg {...base(p)} strokeWidth={2.1}>
    <path d="M4.5 12h15m0 0L14 6.5m5.5 5.5L14 17.5" />
  </svg>
);

export const IconDoc = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 3.5h8L19 8.5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
    <path d="M13.5 3.5v5.2h5.2M8 13h7M8 16.5h5" />
  </svg>
);

export const IconHand = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 11.5V6.2a1.55 1.55 0 0 1 3.1 0v4.6" />
    <path d="M10.1 10V4.7a1.55 1.55 0 0 1 3.1 0V10" />
    <path d="M13.2 10.2V6.4a1.55 1.55 0 0 1 3.1 0v6.8" />
    <path d="M16.3 13.2v-1.9a1.55 1.55 0 0 1 3.1 0v3.2c0 3.8-2.7 6.5-6.8 6.5-3 0-4.6-1.2-6.3-3.6L4 14.6c-.8-1.1-.3-2.6 1.1-2.7.9-.1 1.6.3 2.1 1l1 1.4" />
  </svg>
);

export const IconChevron = (p: P) => (
  <svg {...base(p)} strokeWidth={2.1}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const IconHeart = (p: P) => (
  <svg {...base(p)}>
    <path
      d="M12 20.4c-5.2-3.5-8.5-6.9-8.5-10.6A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2c0 3.7-3.3 7.1-8.5 10.6Z"
      fill="currentColor"
      fillOpacity="0.18"
    />
  </svg>
);

export const IconLive = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" opacity="0.7" />
    <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" opacity="0.4" />
  </svg>
);

/* ---- иконки категорий ---- */
export const IconMedical = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 20.5c-4.6-3.2-7.5-6.2-7.5-9.4a4.4 4.4 0 0 1 7.5-3.1 4.4 4.4 0 0 1 7.5 3.1c0 3.2-2.9 6.2-7.5 9.4Z" />
    <path d="M12 8.4v5M9.5 10.9h5" />
  </svg>
);

export const IconPaw = (p: P) => (
  <svg {...base(p)}>
    <circle cx="6.2" cy="9" r="1.9" />
    <circle cx="10.3" cy="5.8" r="2" />
    <circle cx="15" cy="6.4" r="1.9" />
    <circle cx="18.4" cy="10.5" r="1.7" />
    <path d="M12.4 19.8c-2.6 0-4.8-1.6-4.8-3.9 0-2.4 2.1-5.4 4.8-5.4s4.8 3 4.8 5.4c0 2.3-2.2 3.9-4.8 3.9Z" />
  </svg>
);

export const IconElderly = (p: P) => (
  <svg {...base(p)}>
    <path d="M8 18.5V14c0-2.8 2-4.8 4.7-4.8 2.5 0 4.3 1.8 4.3 4.3" />
    <circle cx="12.7" cy="5.6" r="2.4" />
    <path d="M6 21v-8.5M6 21h13M17 21v-4" />
  </svg>
);

export const IconBackpack = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 8.5A5 5 0 0 1 12 4a5 5 0 0 1 5 4.5V18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V8.5Z" />
    <path d="M9 4.8a3 3 0 0 1 6 0M7 13h10M12 13v3" />
  </svg>
);

export const IconHomeFire = (p: P) => (
  <svg {...base(p)}>
    <path d="m3.5 11 8.5-7 8.5 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M12 17.8c-1.9-1.2-2.8-2.4-2.8-3.7 0-1 .7-1.9 1.5-2.7.5.9 1 1.3 1.6 1.6.4-1 .4-2-.2-3.3 2 1 3.3 2.8 3.3 4.5 0 1.3-1.3 2.5-3.4 3.6Z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

export const IconWheel = (p: P) => (
  <svg {...base(p)}>
    <circle cx="10" cy="15" r="5.2" />
    <circle cx="10" cy="15" r="1.3" fill="currentColor" stroke="none" />
    <path d="M10 3.6a2 2 0 1 0 .01 0ZM10 6.5v4h5l2.4 4.6" />
    <path d="M18.6 13.5a5.8 5.8 0 0 1-.4 4.8" opacity="0.6" />
  </svg>
);

export const IconBowl = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 11.5h16c0 3.4-2.4 6-5.5 6.7V20h-5v-1.8C6.4 17.5 4 14.9 4 11.5Z" />
    <path d="M9 8.2c0-1.2 1-1.4 1-2.4M13.5 8.2c0-1.2 1-1.4 1-2.4" opacity="0.7" />
  </svg>
);

export const IconBolt = (p: P) => (
  <svg {...base(p)}>
    <path d="M13 2.5 5.5 13H11l-1 8.5L17.5 11H12l1-8.5Z" fill="currentColor" fillOpacity="0.16" />
  </svg>
);

export const IconArrowUpRight = (p: P) => (
  <svg {...base(p)} strokeWidth={2}>
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
);

export const IconRub = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 20V4h4.2a4.3 4.3 0 0 1 0 8.6H7.5M7.5 16h6.5" />
  </svg>
);

export const CATEGORY_ICONS: Record<string, (p: P) => JSX.Element> = {
  treatment: IconMedical,
  animals: IconPaw,
  elderly: IconElderly,
  kids: IconBackpack,
  disaster: IconHomeFire,
  sport: IconWheel,
  other: IconBowl,
};
