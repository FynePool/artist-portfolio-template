import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/lib/theme"
import { SITE_URL } from "@/lib/site"
import { getHeroImages } from "@/lib/data"
import { JsonLd } from "@/components/JsonLd"
import { buildPersonSchema } from "@/lib/jsonld"
import content from "@/data/general.json"
import "./globals.css"

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["300", "400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
})

const inter = Inter({
  variable: "--font-inter",
  weight: ["400", "500"],
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: content.siteTitle,
  description: content.description,
  manifest: "/site.webmanifest",
  openGraph: {
    title: content.siteTitle,
    description: content.description,
    // Niente images statiche: le genera la file convention opengraph-image.tsx
    locale: "it_IT",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const hero = getHeroImages()
  const personImage = hero.desktop[0] ? `${SITE_URL}/assets/${hero.desktop[0]}` : undefined

  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body>
        <JsonLd data={buildPersonSchema(personImage)} />
        <ThemeProvider defaultTheme={content.defaultTheme as 'light' | 'dark'}>
          {children}
        </ThemeProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
