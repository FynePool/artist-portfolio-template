'use client'

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import type { Artwork } from "@/lib/data"

interface SlideshowProps {
  works: Artwork[]
  title?: string
}

const SLIDE_MS = 6000
const SLIDE_MS_REDUCED = 8000

export default function Slideshow({ works, title }: SlideshowProps) {
  const [isActive, setIsActive] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  // prefers-reduced-motion: valore iniziale letto in modo lazy (SSR-safe: false sul server;
  // non incide sul DOM iniziale, che è il solo pulsante trigger → nessun mismatch di hydration).
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Aggiorna se l'impostazione di sistema cambia (setState solo nella callback).
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  const goToNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % works.length)
  }, [works.length])

  const goToPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + works.length) % works.length)
  }, [works.length])

  const handleExit = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
    } catch {
      // già fuori dal fullscreen (o non supportato): nessuna azione
    }
    setIsActive(false)
    setIsPaused(false)
  }, [])

  const handleStart = async () => {
    setCurrentIndex(0)
    setIsPaused(false)
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      // iOS/Safari: nessun vero fullscreen → si usa l'overlay fisso come fallback
    }
    setIsActive(true)
  }

  // Autoplay: avanza da solo salvo pausa.
  useEffect(() => {
    if (!isActive || isPaused || works.length < 2) return
    timerRef.current = setTimeout(goToNext, reducedMotion ? SLIDE_MS_REDUCED : SLIDE_MS)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isActive, isPaused, currentIndex, works.length, reducedMotion, goToNext])

  // Mentre attivo: lock dello scroll + tastiera (stesso pattern del Lightbox).
  useEffect(() => {
    if (!isActive) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleExit()
      else if (e.key === " ") { e.preventDefault(); setIsPaused((p) => !p) }
      else if (e.key === "ArrowRight") goToNext()
      else if (e.key === "ArrowLeft") goToPrev()
    }
    // Se l'utente esce dal fullscreen nativo (Esc del browser), chiudi anche l'overlay.
    const onFsChange = () => {
      if (!document.fullscreenElement) setIsActive(false)
    }
    window.addEventListener("keydown", onKey)
    document.addEventListener("fullscreenchange", onFsChange)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
      document.removeEventListener("fullscreenchange", onFsChange)
    }
  }, [isActive, handleExit, goToNext, goToPrev])

  if (works.length === 0) return null

  if (!isActive) {
    return (
      <button
        type="button"
        onClick={handleStart}
        className="font-sans text-sm tracking-wide text-ink underline underline-offset-4 hover:text-muted transition-colors"
      >
        Avvia slideshow →
      </button>
    )
  }

  const currentWork = works[currentIndex]

  return (
    <div
      className="slideshow-overlay fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Slideshow — ${title}` : "Slideshow"}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWork.file}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.2 : 0.6 }}
        >
          <Image
            src={`/assets/${currentWork.file}`}
            alt={currentWork.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </motion.div>
      </AnimatePresence>

      {/* Contatore */}
      <div className="fixed top-4 right-4 z-10 text-white font-sans text-sm">
        {currentIndex + 1} / {works.length}
      </div>

      {/* Controlli */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 text-white">
        <button
          type="button"
          onClick={goToPrev}
          className="text-2xl leading-none px-1 hover:text-faint transition-colors"
          aria-label="Opera precedente"
        >
          ←
        </button>
        <button
          type="button"
          onClick={() => setIsPaused((p) => !p)}
          className="font-sans text-sm underline underline-offset-4 hover:text-faint transition-colors"
          aria-label={isPaused ? "Riprendi" : "Pausa"}
        >
          {isPaused ? "Play" : "Pausa"}
        </button>
        <button
          type="button"
          onClick={goToNext}
          className="text-2xl leading-none px-1 hover:text-faint transition-colors"
          aria-label="Opera successiva"
        >
          →
        </button>
        <button
          type="button"
          onClick={handleExit}
          className="font-sans text-sm underline underline-offset-4 hover:text-faint transition-colors"
          aria-label="Esci dalla slideshow"
        >
          Esci
        </button>
      </div>
    </div>
  )
}
