import { ImageResponse } from "next/og"
import { getGalleries } from "@/lib/data"
import { firstUsableDataUri } from "@/lib/ogAssets"
import general from "@/data/general.json"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `Galleria — ${general.artistName}`

interface OgImageProps {
  params: Promise<{ id: string }>
}

// Senza generateStaticParams la route resterebbe dinamica: su Vercel a runtime
// public/assets non è nel bundle della function, l'immagine va generata al build.
export function generateStaticParams(): { id: string }[] {
  return getGalleries().map((gallery) => ({ id: gallery.id }))
}

// Colori: token light di app/globals.css riportati come hex (vedi app/opengraph-image.tsx)
export default async function OpengraphImage({ params }: OgImageProps) {
  const { id } = await params
  const gallery = getGalleries().find((g) => g.id === id)
  const imageSrc = gallery
    ? firstUsableDataUri(gallery.works.map((w) => w.file))
    : null

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#FAFAF7",
        }}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt=""
            style={{ width: "50%", height: "100%", objectFit: "cover" }}
          />
        )}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 64,
          }}
        >
          <div style={{ fontSize: 56, color: "#111111", lineHeight: 1.1 }}>
            {gallery?.title ?? "Galleria"}
          </div>
          {gallery?.subtitle && (
            <div style={{ fontSize: 26, color: "#666666", marginTop: 16 }}>
              {gallery.subtitle}
            </div>
          )}
          <div style={{ fontSize: 28, color: "#111111", marginTop: 28 }}>
            {general.siteTitle}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
