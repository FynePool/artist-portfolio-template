'use client'

import Image from "next/image"
import { useState, useRef } from "react"
import type { Article } from "@/lib/data"

export default function ExhibitionsCarousel({ exhibitions }: { exhibitions: Article[] }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = exhibitions.length

  const prev = () => setCurrent(i => (i - 1 + count) % count)
  const next = () => setCurrent(i => (i + 1) % count)

  const ex = exhibitions[current]

  return (
    <div
      className="mt-10"
      onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
      onTouchEnd={e => {
        if (touchStartX.current === null || count <= 1) return
        const delta = touchStartX.current - e.changedTouches[0].clientX
        if (Math.abs(delta) > 40) { if (delta > 0) next(); else prev() }
        touchStartX.current = null
      }}
    >
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {ex.images.length > 0 && (
          <div className="w-full md:w-2/5 shrink-0 relative h-64 overflow-hidden bg-surface">
            <Image
              src={`/assets/${ex.images[0]}`}
              alt={ex.title}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-contain"
            />
          </div>
        )}
        <div className="flex flex-col gap-3 flex-1">
          <h3 className="font-serif text-3xl font-light text-ink">{ex.title}</h3>
          {ex.subtitle && (
            <p className="font-sans text-xs tracking-widest uppercase text-muted">{ex.subtitle}</p>
          )}
          {ex.description && (
            <p className="font-sans text-sm leading-relaxed text-body">{ex.description}</p>
          )}
          {ex.link && (
            <a
              href={ex.link.url}
              target={ex.link.newTab ? '_blank' : undefined}
              rel={ex.link.newTab ? 'noopener noreferrer' : undefined}
              className="inline-block mt-2 px-5 py-2.5 border border-ink text-ink font-sans text-sm tracking-wide hover:bg-ink hover:text-surface transition-colors self-start"
            >
              {ex.link.text}
            </a>
          )}
        </div>
      </div>

      {count > 1 && (
        <div className="flex items-center justify-end gap-4 mt-6">
          <div className="flex gap-2">
            {exhibitions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Esposizione ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-ink scale-125' : 'bg-faint'
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1">
            <button
              onClick={prev}
              aria-label="Precedente"
              className="w-8 h-8 flex items-center justify-center border border-rule text-muted hover:border-ink hover:text-ink transition-colors font-sans text-sm"
            >
              ←
            </button>
            <button
              onClick={next}
              aria-label="Successiva"
              className="w-8 h-8 flex items-center justify-center border border-rule text-muted hover:border-ink hover:text-ink transition-colors font-sans text-sm"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
