"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import type { HeroImages } from "@/lib/data"
import content from "@/data/homepage.json"

function HeroCarousel({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const count = images.length

  const next = () => setCurrent(i => (i + 1) % count)
  const prev = () => setCurrent(i => (i - 1 + count) % count)

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => setCurrent(i => (i + 1) % count), 5000)
    return () => clearInterval(id)
  }, [count])

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 40) {
      if (delta > 0) next()
      else prev()
    }
    touchStartX.current = null
  }

  if (count === 0) return null

  return (
    <div
      className="absolute inset-0"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((img, i) => (
        <Image
          key={img}
          src={`/assets/${img}`}
          alt={`Hero ${i + 1}`}
          fill
          sizes="100vw"
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {count > 1 && (
        <div className="absolute bottom-10 right-8 z-20 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Hero({ images }: { images: HeroImages }) {
  const desktop = images.desktop.length > 0 ? images.desktop : images.mobile
  const mobile = images.mobile.length > 0 ? images.mobile : images.desktop

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Mobile images (<768px) */}
      <div className="md:hidden absolute inset-0">
        <HeroCarousel images={mobile} />
      </div>
      {/* Desktop images (≥768px) */}
      <div className="hidden md:block absolute inset-0">
        <HeroCarousel images={desktop} />
      </div>

      {/* Gradiente top per leggibilità nav */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/45 to-transparent pointer-events-none z-10" />
      {/* Gradiente bottom per testo hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      <div className="absolute bottom-10 left-8 z-10">
        <h1 className="font-serif text-6xl md:text-8xl font-light text-white leading-none hero-text-shadow">
          {content.hero.name}
        </h1>
        <p className="font-sans text-sm tracking-widest uppercase text-white/80 mt-3 hero-text-shadow">
          {content.hero.subtitle}
        </p>
      </div>
    </section>
  )
}
