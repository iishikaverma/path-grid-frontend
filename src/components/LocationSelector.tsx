import Select from './Select'

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
  const labelId = `${id}-label`
  return (
    <div className="flex flex-col gap-1.5">
      <span
        id={labelId}
        className="text-xs font-semibold uppercase tracking-wide text-muted"
      >
        {label}
      </span>
      <Select id={id} labelId={labelId} value={value} options={options} onChange={onChange} />
    </div>
  )
}
