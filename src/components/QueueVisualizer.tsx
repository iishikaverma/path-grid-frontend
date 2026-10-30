/** Shows the BFS queue front -> rear to make FIFO behaviour obvious. */
export default function QueueVisualizer({ queue }: { queue: string[] }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-muted">
        <span>Front (dequeue)</span>
        <span>Rear (enqueue)</span>
      </div>

      <div className="thin-scroll flex min-h-[52px] items-center gap-2 overflow-x-auto rounded-xl border border-border bg-surface-2 p-2">
        {queue.length === 0 ? (
          <span className="px-2 text-sm text-muted">Queue is empty</span>
        ) : (
          queue.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className={`shrink-0 rounded-lg border px-3 py-1.5 text-sm font-medium ${
                i === 0
                  ? 'border-node-current bg-node-current/15 text-ink'
                  : 'border-border bg-surface text-ink'
              }`}
            >
              {name}
            </span>
          ))
        )}
      </div>

      <p className="mt-2 text-xs text-muted">
        Queue follows FIFO — First In, First Out. Nodes leave from the front and new
        ones join the rear.
      </p>
    </div>
  )
}
