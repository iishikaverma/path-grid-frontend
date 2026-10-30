/** Simple skeleton block + optional label, for loading areas. */
export default function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-muted">
      <div className="size-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      <p className="text-sm">{label}</p>
    </div>
  )
}

/** Inline rectangular skeleton for list/card placeholders. */
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-surface-2 ${className}`} />
}
