interface LocationSelectorProps {
  id: string
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

export default function LocationSelector({
  id,
  label,
  value,
  options,
  onChange,
}: LocationSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wide text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
      >
        <option value="" disabled>
          Select a location…
        </option>
        {options.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    </div>
  )
}
