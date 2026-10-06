import Link from "next/link"
import content from "@/data/homepage.json"
import type { Article } from "@/lib/data"
import ExhibitionsCarousel from "@/components/ExhibitionsCarousel"

interface ExhibitionsCtaProps {
  exhibitions?: Article[]
  live?: { title: string; label: string }
}

export default function ExhibitionsCta({ exhibitions = [], live }: ExhibitionsCtaProps) {
  const cta = content.exhibitionsCta

  return (
    <section id="exhibitions-cta" className="py-24 px-6 border-y border-rule">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="flex flex-col gap-3">
            {live && (
              <p className="font-sans text-xs tracking-widest uppercase text-muted">
                <span className="inline-block w-2 h-2 rounded-full bg-ink mr-2 align-middle" aria-hidden="true" />
                {live.label} — {live.title}
              </p>
            )}
            <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink">{cta.title}</h2>
            {cta.description && (
              <p className="font-sans text-base text-body max-w-lg">{cta.description}</p>
            )}
          </div>
          <Link
            href="/exhibitions"
            className="inline-block self-start md:self-auto px-8 py-4 border border-ink text-ink font-sans text-sm tracking-wide hover:bg-ink hover:text-surface transition-colors whitespace-nowrap"
          >
            {cta.buttonLabel}
          </Link>
        </div>
        {exhibitions.length > 0 && (
          <ExhibitionsCarousel exhibitions={exhibitions} />
        )}
      </div>
    </section>
  )
}
