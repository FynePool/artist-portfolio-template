import type { Metadata } from "next"
import Nav from "@/components/Nav"
import Footer from "@/components/Footer"
import ArticleBlock from "@/components/Article"
import { JsonLd } from "@/components/JsonLd"
import { buildExhibitionEventSchema } from "@/lib/jsonld"
import { getExhibitions } from "@/lib/data"
import {
  getExhibitionStatus,
  statusBadgeLabel,
  type ExhibitionStatus,
} from "@/lib/exhibitionStatus"
import general from "@/data/general.json"

export const metadata: Metadata = {
  title: `Esposizioni — ${general.artistName}`,
  description: `Foto e racconti delle mostre a cui ha partecipato ${general.artistName}.`,
}

const STATUS_RANK: Record<ExhibitionStatus, number> = {
  current: 0,
  upcoming: 1,
  past: 2,
  undated: 3,
}

export default function ExhibitionsPage() {
  // sort è stabile: dentro ogni gruppo resta l'ordine per data desc di getExhibitions()
  const exhibitions = getExhibitions()
    .map((exhibition) => {
      const status = getExhibitionStatus(exhibition.date, exhibition.dateEnd)
      return {
        exhibition,
        status,
        badge: statusBadgeLabel(status, exhibition.date, exhibition.dateEnd),
      }
    })
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status])

  // Solo le mostre con una data producono un ExhibitionEvent valido per schema.org.
  const events = exhibitions
    .filter(({ exhibition }) => exhibition.date)
    .map(({ exhibition }) => buildExhibitionEventSchema(exhibition))

  return (
    <>
      {events.length > 0 && <JsonLd data={events} />}
      <Nav />
      <main className="pt-14">
        <header className="py-24 px-6 border-b border-rule">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif text-5xl lg:text-7xl font-light text-ink">Esposizioni</h1>
          </div>
        </header>
        {exhibitions.length > 0 ? (
          <section className="px-6 pb-32">
            <div className="max-w-7xl mx-auto divide-y divide-rule">
              {exhibitions.map(({ exhibition, status, badge }) => (
                <div key={exhibition.id}>
                  {badge && (
                    <p className="pt-10 -mb-6 font-sans text-xs tracking-widest uppercase text-muted">
                      <span
                        className="inline-block w-2 h-2 rounded-full bg-ink mr-2 align-middle"
                        aria-hidden="true"
                      />
                      {badge}
                      {status === "upcoming" && (
                        <a
                          href={`/exhibitions/${exhibition.id}/calendar.ics`}
                          download
                          className="ml-4 normal-case tracking-normal underline underline-offset-4 text-muted hover:text-ink transition-colors"
                        >
                          Aggiungi al calendario
                        </a>
                      )}
                    </p>
                  )}
                  <ArticleBlock article={exhibition} enableLightbox />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="px-6 py-32">
            <div className="max-w-7xl mx-auto">
              <p className="font-sans text-muted">Nessuna esposizione disponibile.</p>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
