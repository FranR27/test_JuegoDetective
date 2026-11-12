import React from 'react';

const PATHS = {
  folder: (
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.2c.7 0 1.4.3 1.9.8l1.1 1.2h6.8A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
  ),
  file: (
    <>
      <path d="M6 3.8h7.6L19 9.2v11H6z" />
      <path d="M13.4 3.8v5.6H19" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  chat: <path d="M20.5 11.3a7.8 7.8 0 0 1-8.2 7.8 8.6 8.6 0 0 1-3.3-.7L4 19.6l1.3-4.2a8 8 0 0 1-1.2-4.2 7.8 7.8 0 0 1 8-7.7 7.8 7.8 0 0 1 8.4 7.8z" />,
  evidence: (
    <>
      <path d="M8.2 3.5h7.6v4.2H8.2z" />
      <path d="M6 5.4H4.8A1.8 1.8 0 0 0 3 7.2v11.6a1.8 1.8 0 0 0 1.8 1.8h14.4a1.8 1.8 0 0 0 1.8-1.8V7.2a1.8 1.8 0 0 0-1.8-1.8H18" />
      <path d="M7.5 12h9M7.5 15.5h6" />
    </>
  ),
  lock: (
    <>
      <rect x="4.8" y="10.5" width="14.4" height="10" rx="2" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.6 0v2.7" />
    </>
  ),
  unlock: (
    <>
      <rect x="4.8" y="10.5" width="14.4" height="10" rx="2" />
      <path d="M8.2 10.5V7.8a3.8 3.8 0 0 1 7.3-1.4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m15.5 15.5 4.2 4.2" />
    </>
  ),
  check: <path d="m4.5 12.5 4.6 4.6L19.5 6.7" />,
  warning: (
    <>
      <path d="M12 3.5 21 19.5H3z" />
      <path d="M12 9v4.5M12 16.6v.2" />
    </>
  ),
  photo: (
    <>
      <rect x="3" y="4.8" width="18" height="14.4" rx="2" />
      <circle cx="8.4" cy="9.6" r="1.6" />
      <path d="m4.5 17 4.8-4.4 3.2 2.8 3-2.6 4 4.2" />
    </>
  ),
  chevron: <path d="m8.5 5.5 6.5 6.5-6.5 6.5" />,
  arrowLeft: <path d="M20 12H4m0 0 6-6m-6 6 6 6" />,
  arrowRight: <path d="M4 12h16m0 0-6-6m6 6-6 6" />,
  reset: (
    <>
      <path d="M4 10a8 8 0 1 1 2 7.3" />
      <path d="M4 4.5V10h5.5" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.2 19.5 6v6.1c0 4.6-3.1 7.6-7.5 8.7-4.4-1.1-7.5-4.1-7.5-8.7V6z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.2" r="3.6" />
      <path d="M4.8 20.2c.7-3.6 3.4-5.6 7.2-5.6s6.5 2 7.2 5.6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s6.3-5.6 6.3-11A6.3 6.3 0 0 0 5.7 10c0 5.4 6.3 11 6.3 11z" />
      <circle cx="12" cy="10" r="2.2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  eye: (
    <>
      <path d="M2.8 12s3.5-6.2 9.2-6.2S21.2 12 21.2 12s-3.5 6.2-9.2 6.2S2.8 12 2.8 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  key: (
    <>
      <circle cx="8.2" cy="8.2" r="3.8" />
      <path d="m11 11 8.4 8.4M15.6 15.6l2-2M17.8 17.8l2-2" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M8.2 14.8a6 6 0 1 1 7.6 0c-.8.7-1.3 1.5-1.3 2.2H9.5c0-.7-.5-1.5-1.3-2.2z" />
    </>
  ),
  spark: (
    <>
      <path d="M12 3v4M12 17v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M3 12h4M17 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
    </>
  ),
};

export default function Icon({ name, size = 18, label, className = '', ...rest }) {
  const path = PATHS[name];
  if (!path) return null;

  return (
    <svg
      className={`case-icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : 'true'}
      role={label ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {label ? <title>{label}</title> : null}
      {path}
    </svg>
  );
}
