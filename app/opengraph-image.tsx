import { ImageResponse } from "next/og"
import { getGalleries } from "@/lib/data"
import { firstUsableDataUri } from "@/lib/ogAssets"
import general from "@/data/general.json"
import homepage from "@/data/homepage.json"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `${general.artistName} — ${homepage.hero.subtitle}`

// I colori replicano i token light di app/globals.css
// (surface #FAFAF7, ink #111111, muted #666666): i token CSS non esistono
// nel contesto satori, vanno riportati come valori.
export default function OpengraphImage() {
  const imageSrc = firstUsableDataUri(
    getGalleries().flatMap((g) => g.works.map((w) => w.file)),
  )

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
          <div style={{ fontSize: 64, color: "#111111", lineHeight: 1.1 }}>
            {general.siteTitle}
          </div>
          <div style={{ fontSize: 28, color: "#666666", marginTop: 20 }}>
            {homepage.hero.subtitle}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
