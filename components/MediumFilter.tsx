'use client'

interface MediumFilterProps {
  media: string[]
  active: string | null
  onChange: (medium: string | null) => void
}

export default function MediumFilter({ media, active, onChange }: MediumFilterProps) {
  // Con meno di 2 tecniche il filtro è rumore: non renderizzare nulla
  if (media.length < 2) return null

  return (
    <div className="flex flex-wrap gap-2 mb-10" role="group" aria-label="Filtra per tecnica">
      <FilterChip label="Tutte" selected={active === null} onClick={() => onChange(null)} />
      {media.map((medium) => (
        <FilterChip
          key={medium}
          label={medium}
          selected={active === medium}
          onClick={() => onChange(medium)}
        />
      ))}
    </div>
  )
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`font-sans text-xs tracking-wide px-3 py-1.5 border transition-colors ${
        selected
          ? "border-ink bg-ink text-surface"
          : "border-rule text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  )
}
