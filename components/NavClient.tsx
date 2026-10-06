'use client'

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import ThemeToggle from "./ThemeToggle"

export type NavLink = { href: string; label: string; anchorId: string }

interface NavClientProps {
  // Link già filtrati e ordinati lato server (components/Nav.tsx)
  links: NavLink[]
  brand: string
}

export default function NavClient({ links, brand }: NavClientProps) {
  const [activeSection, setActiveSection] = useState("")
  const [showName, setShowName] = useState(false)
  const [rawIsTop, setRawIsTop] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"
  // On pages without a hero the nav is always in "scrolled" (solid) state
  const isTop = isHome && rawIsTop

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setRawIsTop(y < 80)
      setShowName(y > 40)
    }
    // Run once immediately so state is correct before first scroll
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getActive = () => {
      const mid = window.innerHeight / 2
      let bestId = ''
      let bestDist = Infinity
      links.forEach(({ anchorId }) => {
        const el = document.getElementById(anchorId)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const dist = Math.abs(rect.top + rect.height / 2 - mid)
        if (dist < bestDist) { bestDist = dist; bestId = anchorId }
      })
      if (bestId) setActiveSection(bestId)
    }

    getActive()
    window.addEventListener("scroll", getActive, { passive: true })
    return () => window.removeEventListener("scroll", getActive)
  }, [links])

  const isActive = (link: NavLink) => {
    if (isHome) return activeSection === link.anchorId
    return pathname === link.href
  }

  const resolveHref = (link: NavLink) =>
    link.href.startsWith('#') && !isHome ? `/${link.href}` : link.href

  const linkClass = (link: NavLink) =>
    `font-sans text-sm tracking-wide transition-colors ${
      isTop
        ? "text-white/85 hover:text-white nav-item-shadow"
        : isActive(link)
          ? "text-ink underline underline-offset-4"
          : "text-muted hover:text-ink"
    }`

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isTop
            ? "bg-transparent border-transparent"
            : "bg-surface border-b border-rule"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span
            role={(!isHome || !isTop) ? "button" : undefined}
            tabIndex={(!isHome || !isTop) ? 0 : undefined}
            onClick={() => {
              if (!isHome) { window.location.href = "/" }
              else if (!isTop) { window.scrollTo({ top: 0, behavior: "smooth" }) }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                if (!isHome) { window.location.href = "/" }
                else if (!isTop) { window.scrollTo({ top: 0, behavior: "smooth" }) }
              }
            }}
            className={`font-serif text-xl font-light transition-all duration-300 ${
              (showName || !isHome) ? "opacity-100" : "opacity-0 pointer-events-none"
            } ${isTop ? "text-white nav-item-shadow" : "text-ink"} ${
              (!isHome || !isTop) ? "cursor-pointer" : ""
            }`}
          >
            {brand}
          </span>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-8 ml-auto">
            {links.map((link) => (
              <li key={link.href}>
                <a href={resolveHref(link)} className={linkClass(link)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop theme toggle */}
          <ThemeToggle light={isTop} className="hidden md:flex ml-6" />

          {/* Mobile: theme toggle + burger */}
          <div className="md:hidden flex items-center gap-4 ml-auto">
            <ThemeToggle light={isTop} />
            <button
              className={`text-xl leading-none transition-colors ${
                isTop ? "text-white nav-item-shadow" : "text-ink"
              }`}
              onClick={() => setMenuOpen(true)}
              aria-label="Apri menu"
            >
              ☰
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center">
          <button
            className="absolute top-5 right-6 text-2xl text-ink"
            onClick={() => setMenuOpen(false)}
            aria-label="Chiudi menu"
          >
            ✕
          </button>
          <ul className="flex flex-col items-center gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={resolveHref(link)}
                  className="font-serif text-3xl font-light text-ink"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
