'use client'

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Artwork } from "@/lib/data"
import Lightbox from "./Lightbox"

interface FeaturedWorksProps {
  works: Artwork[]
}

export default function FeaturedWorks({ works }: FeaturedWorksProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Sezione attiva nel CMS ma nessuna opera marcata: non renderizzare nulla
  if (works.length === 0) return null

  return (
    <section id="in-evidenza" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-serif text-5xl font-light text-ink">In evidenza</h2>
          <p className="font-sans text-sm tracking-widest uppercase text-muted mt-2">
            Selezione dell&apos;artista
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {works.map((work, i) => (
            <motion.div
              key={work.file}
              className="relative aspect-[4/3] cursor-pointer overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: works.length <= 6 ? i * 0.07 : 0 }}
              whileHover={{
                scale: 1.02,
                boxShadow:
                  "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
              }}
              onClick={() => setLightboxIndex(i)}
            >
              <Image
                src={work.blurDataURL ? `/assets-opt/${work.file}` : `/assets/${work.file}`}
                alt={work.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                {...(work.blurDataURL && {
                  placeholder: 'blur' as const,
                  blurDataURL: work.blurDataURL,
                })}
              />
            </motion.div>
          ))}
        </div>
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
