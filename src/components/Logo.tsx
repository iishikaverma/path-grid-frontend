/** PathGrid brand mark: a route (green start → mid node → destination pin)
 * on an indigo tile. Kept identical to public/favicon.svg. */
export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role="img"
      aria-label="PathGrid logo"
      className="shrink-0"
    >
      <rect width="48" height="48" rx="11" fill="#4f46e5" />
      <path
        d="M13 35 Q22 33 31 28"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeDasharray="0.1 5"
      />
      <circle cx="22" cy="32" r="2.6" fill="#ffffff" />
      <circle cx="13" cy="35" r="4" fill="#22c55e" />
      <path d="M33 8a7 7 0 0 0-7 7c0 5 7 12 7 12s7-7 7-12a7 7 0 0 0-7-7z" fill="#ffffff" />
      <circle cx="33" cy="15" r="3" fill="#4f46e5" />
    </svg>
  )
}
