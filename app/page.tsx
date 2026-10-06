import React from "react"
import Nav from "@/components/Nav"
import Hero from "@/components/Hero"
import Gallery from "@/components/Gallery"
import About from "@/components/About"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"
import ArticleBlock from "@/components/Article"
import ExhibitionsCta from "@/components/ExhibitionsCta"
import FeaturedWorks from "@/components/FeaturedWorks"
import { getGalleries, getHeroImages, getArticles, getExhibitions, getFeaturedWorks } from "@/lib/data"
import { getExhibitionStatus, statusBadgeLabel } from "@/lib/exhibitionStatus"
import content from "@/data/homepage.json"

type SectionKey = "galleries" | "about" | "contact" | "articles" | "exhibitions-cta" | "featured"
const DEFAULT_ORDER: SectionKey[] = ["galleries", "about", "contact"]

export default function Home() {
  const galleries = getGalleries()
  const heroImages = getHeroImages()
  const articles = getArticles()
  const featuredWorks = getFeaturedWorks()
  const allExhibitions = getExhibitions()
  const homepageExhibitions = allExhibitions.filter(e => e.showInHomepage)

  // Mostra "live": una in corso, altrimenti la futura più vicina.
  // getExhibitions() è ordinata per data desc → tra le future, l'ultima è la più vicina.
  const liveEntries = allExhibitions
    .map((e) => ({ e, status: getExhibitionStatus(e.date, e.dateEnd) }))
    .filter((x) => x.status === "current" || x.status === "upcoming")
  const livePick = liveEntries.find((x) => x.status === "current") ?? liveEntries[liveEntries.length - 1]
  const liveLabel = livePick ? statusBadgeLabel(livePick.status, livePick.e.date, livePick.e.dateEnd) : null
  const liveBadge = livePick && liveLabel ? { title: livePick.e.title, label: liveLabel } : undefined
  const rawOrder = (content.sectionOrder as SectionKey[] | undefined) ?? DEFAULT_ORDER
  const visibility = content.sectionVisibility as Partial<Record<SectionKey, boolean>> | undefined
  const order = rawOrder.filter((key) => visibility?.[key] === true)

  const sectionMap: Record<SectionKey, React.ReactNode> = {
    galleries: galleries.filter((section) => section.config.visibility === "public").map((section) => (
      <Gallery
        key={section.id}
        section={section}
        previewCount={section.config.enabled ? section.config.limitItems : undefined}
        detailHref={section.config.enabled ? `/gallerie/${section.id}` : undefined}
      />
    )),
    about: <About />,
    contact: <Contact />,
    "exhibitions-cta": <ExhibitionsCta exhibitions={homepageExhibitions} live={liveBadge} />,
    articles: articles.length > 0 ? (
      <section id="articles" className="py-32 px-6">
        <div className="max-w-7xl mx-auto divide-y divide-rule">
          {articles.map((article) => (
            <ArticleBlock key={article.id} article={article} />
          ))}
        </div>
      </section>
    ) : null,
    featured: <FeaturedWorks works={featuredWorks} />,
  }

  return (
    <>
      <Nav />
      <Hero images={heroImages} />
      {order.map((key) => (
        <React.Fragment key={key}>{sectionMap[key]}</React.Fragment>
      ))}
      <Footer />
    </>
  )
}
