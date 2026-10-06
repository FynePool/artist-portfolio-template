import { marked } from "marked"
import FadeUp from "./FadeUp"
import content from "@/data/bio.json"
import { getMostre, getPremi, type TimelineEntry } from "@/lib/data"

function groupByYear(items: TimelineEntry[]) {
  const sorted = [...items].sort((a, b) => b.year.localeCompare(a.year))
  const groups: { year: string; descriptions: string[] }[] = []
  for (const item of sorted) {
    const last = groups[groups.length - 1]
    if (last && last.year === item.year) {
      last.descriptions.push(item.description)
    } else {
      groups.push({ year: item.year, descriptions: [item.description] })
    }
  }
  return groups
}


function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

// Tipo esplicito: un campo svuotato dal CMS può sparire dal JSON, e il tipo
// inferito da bio.json romperebbe il build.
const social = content.social as Partial<Record<"instagram" | "facebook", string>>

const socialLinks = [
  { key: "instagram", label: "Instagram", url: social.instagram, Icon: IconInstagram },
  { key: "facebook",  label: "Facebook",  url: social.facebook,  Icon: IconFacebook  },
].filter(s => s.url)

const { aboutSections: s } = content

export default async function About() {
  const mostreItems = getMostre()
  const premiItems = getPremi()
  return (
    <section id="biografia" className="py-24 px-6">
      <div className="max-w-5xl mx-auto space-y-24">

        {/* Biografia */}
        {s.biografia === true && (
          <FadeUp>
            <h2 className="font-serif text-4xl font-light mb-8">Biografia</h2>
            <div>
              <div
                className="font-sans text-base leading-relaxed text-body [&_p]:m-0 [&_p+p]:mt-4"
                dangerouslySetInnerHTML={{ __html: marked.parse(content.bio, { breaks: true }) as string }}
              />
              {socialLinks.length > 0 && (
                <div className="mt-10 pt-8 border-t border-rule">
                  <p className="font-sans text-xs tracking-widest uppercase text-faint mb-4">Seguimi</p>
                  <div className="flex gap-5">
                    {socialLinks.map(({ key, label, url, Icon }) => (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        className="flex items-center gap-2 font-sans text-sm text-body hover:text-ink transition-colors"
                      >
                        <Icon />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeUp>
        )}

        {/* Premi */}
        {s.premi === true && (
          <FadeUp delay={150}>
            <h2 className="font-serif text-4xl font-light mb-8">Premi</h2>
            <div className="space-y-5">
              {groupByYear(premiItems).map((group) => (
                <div key={group.year} className="border-t border-rule pt-4">
                  <span className="font-serif text-xl text-ink">{group.year}</span>
                  <div className="mt-2 space-y-3">
                    {group.descriptions.map((desc, j) => (
                      <p key={j} className="font-sans text-sm text-muted">{desc}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        )}

        {/* Mostre e partecipazioni */}
        {s.mostre === true && (
          <FadeUp delay={300}>
            <h2 className="font-serif text-4xl font-light mb-8">Mostre e partecipazioni</h2>
            <div className="columns-2 md:columns-3 gap-10">
              {groupByYear(mostreItems).map((group) => (
                <div key={group.year} className="border-t border-rule pt-4 break-inside-avoid mb-6">
                  <span className="font-serif text-xl text-ink">{group.year}</span>
                  <div className="mt-2 space-y-3">
                    {group.descriptions.map((desc, j) => (
                      <p key={j} className="font-sans text-sm text-muted">{desc}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        )}

      </div>
    </section>
  )
}
