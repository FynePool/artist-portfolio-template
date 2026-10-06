'use client'

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { GallerySection } from "@/lib/data"
import { filterByMedium, uniqueMediums } from "@/lib/mediums"
import Lightbox from "./Lightbox"
import MediumFilter from "./MediumFilter"
import Slideshow from "./Slideshow"

interface GalleryProps {
  section: GallerySection
  // Modalità anteprima (homepage): mostra solo le prime N opere…
  previewCount?: number
  // …con link "Vedi tutte le opere" verso la pagina dedicata
  detailHref?: string
  // Mostra i chip di filtro per tecnica (pagina galleria dedicata)
  enableFilter?: boolean
  // Mostra il pulsante "Avvia slideshow" (solo pagina galleria dedicata)
  enableSlideshow?: boolean
}

export default function Gallery({ section, previewCount, detailHref, enableFilter = false, enableSlideshow = false }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeMedium, setActiveMedium] = useState<string | null>(null)

  const mediums = enableFilter ? uniqueMediums(section.works) : []
  const filtered = enableFilter ? filterByMedium(section.works, activeMedium) : section.works
  const works = previewCount !== undefined ? filtered.slice(0, previewCount) : filtered
  const hasMore = detailHref !== undefined && works.length < section.works.length
  const handleFilterChange = (medium: string | null) => {
    setActiveMedium(medium)
    setLightboxIndex(null) // gli indici cambiano con il filtro
  }
  const canStagger = works.length <= 6

  const slideshow = enableSlideshow && works.length > 0 && (
    <div className="mb-10">
      <Slideshow works={works} title={section.title} />
    </div>
  )

  if (section.config.layout === "masonry") {
    return (
      <section id={section.id} className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <GalleryHeader title={section.title} subtitle={section.subtitle} />
          {enableFilter && (
            <MediumFilter media={mediums} active={activeMedium} onChange={handleFilterChange} />
          )}
          {slideshow}
          <div className="columns-1 md:columns-2 lg:columns-3">
            {works.map((work, i) => (
              <motion.div
                key={work.file}
                className="break-inside-avoid mb-4 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
                onClick={() => setLightboxIndex(i)}
              >
                <Image
                  src={work.blurDataURL ? `/assets-opt/${work.file}` : `/assets/${work.file}`}
                  alt={work.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="w-full h-auto"
                  {...(work.blurDataURL && { placeholder: 'blur' as const, blurDataURL: work.blurDataURL })}
                />
              </motion.div>
            ))}
          </div>
          {hasMore && (
            <div className="mt-10">
              <Link
                href={detailHref}
                className="font-sans text-sm tracking-wide text-ink underline underline-offset-4 hover:text-muted transition-colors"
              >
                Vedi tutte le opere di {section.title} →
              </Link>
            </div>
          )}
        </div>

        <AnimatePresence>
          {lightboxIndex !== null && (
            <Lightbox
              works={works}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </AnimatePresence>
      </section>
    )
  }

  const gridClass =
    section.config.layout === "grid-3"
      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      : "grid grid-cols-1 sm:grid-cols-2 gap-4"

  const sizes =
    section.config.layout === "grid-3"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : "(max-width: 640px) 100vw, 50vw"

  return (
    <section id={section.id} className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <GalleryHeader title={section.title} subtitle={section.subtitle} />
        {enableFilter && (
          <MediumFilter media={mediums} active={activeMedium} onChange={handleFilterChange} />
        )}
        {slideshow}
        <div className={gridClass}>
          {works.map((work, i) => (
            <motion.div
              key={work.file}
              className="relative aspect-[4/3] cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: canStagger ? i * 0.07 : 0 }}
              whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={work.blurDataURL ? `/assets-opt/${work.file}` : `/assets/${work.file}`}
                alt={work.alt}
                fill
                sizes={sizes}
                className="object-cover"
                {...(work.blurDataURL && { placeholder: 'blur' as const, blurDataURL: work.blurDataURL })}
              />
            </motion.div>
          ))}
        </div>
        {hasMore && (
          <div className="mt-10">
            <Link
              href={detailHref}
              className="font-sans text-sm tracking-wide text-ink underline underline-offset-4 hover:text-muted transition-colors"
            >
              Vedi tutte le opere di {section.title} →
            </Link>
          </div>
        )}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            works={works}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}

function GalleryHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-serif text-5xl font-light text-ink">{title}</h2>
      {subtitle && <p className="font-sans text-sm tracking-widest uppercase text-muted mt-2">{subtitle}</p>}
    </motion.div>
  )
}
