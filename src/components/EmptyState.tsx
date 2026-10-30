import type { ReactNode } from 'react'

export default function EmptyState({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-surface px-6 py-10 text-center">
      <p className="font-medium text-ink">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {children}
    </div>
  )
}
