import type { SVGProps } from 'react'

export type IconName =
  | 'arrow-down'
  | 'arrow-left'
  | 'arrow-right'
  | 'book'
  | 'captions'
  | 'check'
  | 'chevron-down'
  | 'close'
  | 'cutaway'
  | 'drop'
  | 'expand'
  | 'explore'
  | 'info'
  | 'layers'
  | 'menu'
  | 'minus'
  | 'pause'
  | 'play'
  | 'plus'
  | 'reset'
  | 'settings'
  | 'sound'
  | 'sound-off'
  | 'sparkle'
  | 'sun'

const paths: Record<IconName, React.ReactNode> = {
  'arrow-down': (
    <>
      <path d="M12 4v16" />
      <path d="m6 14 6 6 6-6" />
    </>
  ),
  'arrow-left': (
    <>
      <path d="M19 12H5" />
      <path d="m11 6-6 6 6 6" />
    </>
  ),
  'arrow-right': (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  book: (
    <>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
      <path d="M8 7h7M8 10.5h5" />
    </>
  ),
  captions: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10 10.3a3 3 0 1 0 0 3.4M17 10.3a3 3 0 1 0 0 3.4" />
    </>
  ),
  check: <path d="m4.5 12 5 5 10-10" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  close: (
    <>
      <path d="m6 6 12 12M18 6 6 18" />
    </>
  ),
  cutaway: (
    <>
      <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z" />
      <path d="M4 7.5 12 12l8-4.5M12 12v9" />
      <path d="m8 5.2 8 4.5" strokeDasharray="2 3" />
    </>
  ),
  drop: (
    <>
      <path d="M12 2.7c3.2 4.6 6.4 8.5 6.4 12.1a6.4 6.4 0 0 1-12.8 0C5.6 11.2 8.8 7.3 12 2.7Z" />
      <path d="M8.7 14.7a3.6 3.6 0 0 0 3.3 3.5" />
    </>
  ),
  expand: (
    <>
      <path d="M8 3H3v5M16 3h5v5M21 16v5h-5M3 16v5h5" />
      <path d="m3 8 5-5M16 3l5 5M21 16l-5 5M8 21l-5-5" />
    </>
  ),
  explore: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5 5-2Z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
    </>
  ),
  menu: (
    <>
      <path d="M4 7h16M4 12h16M4 17h10" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  pause: (
    <>
      <path d="M8 5v14M16 5v14" strokeWidth="2.5" />
    </>
  ),
  play: <path d="m8.5 5 10 7-10 7V5Z" fill="currentColor" stroke="none" />,
  plus: <path d="M12 5v14M5 12h14" />,
  reset: (
    <>
      <path d="M4.5 9A8 8 0 1 1 4 14" />
      <path d="M4 4v5h5" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 8.97 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15.03 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.6 8.97a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8.97 4.6 1.7 1.7 0 0 0 10 3.08V3h4v.08a1.7 1.7 0 0 0 1.03 1.52 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 8.97 1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z" />
    </>
  ),
  sound: (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.2 6a9 9 0 0 1 0 12" />
    </>
  ),
  'sound-off': (
    <>
      <path d="M11 5 6.5 9H3v6h3.5L11 19V5Z" />
      <path d="m16 10 5 5M21 10l-5 5" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3c.7 5.1 3.9 8.3 9 9-5.1.7-8.3 3.9-9 9-.7-5.1-3.9-8.3-9-9 5.1-.7 8.3-3.9 9-9Z" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
}

export function Icon({
  name,
  size = 18,
  ...props
}: { name: IconName; size?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  )
}
