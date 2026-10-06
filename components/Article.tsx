'use client'

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { Article, Artwork } from "@/lib/data"
import Lightbox from "@/components/Lightbox"

function ArticleCarousel({ images, alt, enableLightbox }: { images: string[]; alt: string; enableLightbox?: boolean }) {
  const [current, setCurrent] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number | null>(null)
  const count = images.length

  const next = () => setCurrent(i => (i + 1) % count)
  const prev = () => setCurrent(i => (i - 1 + count) % count)

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => setCurrent(i => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [count])

  if (count === 0) return null

  const works: Artwork[] = images.map((img, i) => ({
    file: img,
    alt: i === 0 ? alt : `${alt} — ${i + 1}`,
  }))

  return (
    <>
      <div
        className={`relative w-full min-h-80 h-full overflow-hidden bg-surface${enableLightbox ? ' cursor-zoom-in' : ''}`}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
        onTouchEnd={e => {
          if (touchStartX.current === null) return
          const delta = touchStartX.current - e.changedTouches[0].clientX
          if (Math.abs(delta) > 40) { if (delta > 0) next(); else prev() }
          touchStartX.current = null
        }}
        onClick={enableLightbox ? () => setLightboxIndex(current) : undefined}
      >
        {images.map((img, i) => (
          <Image
            key={img}
            src={`/assets/${img}`}
            alt={i === 0 ? alt : `${alt} — ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-contain transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
          />
        ))}
        {count > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setCurrent(i) }}
                aria-label={`Slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'bg-ink scale-125' : 'bg-ink/40'
                }`}
              />
            ))}
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
    </>
  )
}

export default function ArticleBlock({ article, enableLightbox }: { article: Article; enableLightbox?: boolean }) {
  const isRight = article.imagePosition === 'right'

  return (
    <motion.article
      className={`flex flex-col ${isRight ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-start md:items-stretch py-16`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5 }}
    >
      {/* Mobile only: title + subtitle appear above the image */}
      <div className="md:hidden w-full">
        <h2 className="font-serif text-4xl font-light text-ink">{article.title}</h2>
        {article.subtitle && (
          <p className="font-sans text-sm tracking-widest uppercase text-muted mt-2">
            {article.subtitle}
          </p>
        )}
      </div>

      {/* Image / carousel */}
      <div className="w-full md:w-1/2 shrink-0">
        <ArticleCarousel images={article.images} alt={article.title} enableLightbox={enableLightbox} />
      </div>

      {/* Text block: desktop shows title+subtitle+desc+CTA; mobile shows only desc+CTA */}
      <div className="w-full md:w-1/2 flex flex-col gap-4">
        <div className="hidden md:flex md:flex-col md:gap-2">
          <h2 className="font-serif text-4xl lg:text-5xl font-light text-ink">{article.title}</h2>
          {article.subtitle && (
            <p className="font-sans text-sm tracking-widest uppercase text-muted">
              {article.subtitle}
            </p>
          )}
        </div>
        {article.description && (
          <p className="font-sans text-base leading-relaxed text-body">
            {article.description}
          </p>
        )}
        {article.link && (
          <a
            href={article.link.url}
            target={article.link.newTab ? '_blank' : undefined}
            rel={article.link.newTab ? 'noopener noreferrer' : undefined}
            className="inline-block mt-2 px-6 py-3 border border-ink text-ink font-sans text-sm tracking-wide hover:bg-ink hover:text-surface transition-colors self-start"
          >
            {article.link.text}
          </a>
        )}
      </div>
    </motion.article>
  )
}
