import NavClient, { type NavLink } from "./NavClient"
import { getGalleries } from "@/lib/data"
import content from "@/data/homepage.json"
import general from "@/data/general.json"

// Server component: costruisce i link dalla configurazione (gallerie lette dal
// file system + data/homepage.json) e delega l'interattività a NavClient.

type SectionKey = "galleries" | "articles" | "exhibitions-cta" | "about" | "contact"
type SectionLink = NavLink & { section: SectionKey }

const visibility = content.sectionVisibility as Partial<Record<SectionKey, boolean>>
const sectionOrder = content.sectionOrder as SectionKey[]

const sectionIndex = (key: SectionKey) => {
  const i = sectionOrder.indexOf(key)
  return i === -1 ? Infinity : i
}

function buildLinks(): NavLink[] {
  // Una voce per ogni galleria pubblica (le stesse renderizzate in homepage)
  const galleryLinks: SectionLink[] = getGalleries()
    .filter((g) => g.config.visibility === "public")
    .map((g) => ({ href: `#${g.id}`, label: g.title, section: "galleries", anchorId: g.id }))

  const baseLinks: SectionLink[] = [
    ...galleryLinks,
    { href: "#biografia",   label: "Biografia",   section: "about",           anchorId: "biografia" },
    { href: "#contatti",    label: "Contatti",    section: "contact",         anchorId: "contatti" },
    { href: "/exhibitions", label: "Esposizioni", section: "exhibitions-cta", anchorId: "exhibitions-cta" },
  ]

  return baseLinks
    .filter((l) => visibility[l.section] === true)
    .sort((a, b) => {
      const diff = sectionIndex(a.section) - sectionIndex(b.section)
      if (diff !== 0) return diff
      return baseLinks.indexOf(a) - baseLinks.indexOf(b)
    })
    .map(({ href, label, anchorId }) => ({ href, label, anchorId }))
}

export default function Nav() {
  return <NavClient links={buildLinks()} brand={general.artistName} />
}
