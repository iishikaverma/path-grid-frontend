interface ErrorStateProps {
  message: string
  onRetry?: () => void
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-surface px-6 py-10 text-center"
    >
      <div className="grid size-11 place-items-center rounded-full bg-node-dest/15 text-node-dest text-xl">
        !
      </div>
      <p className="max-w-sm text-sm text-ink">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          Try again
        </button>
      )}
    </div>
  )
}
