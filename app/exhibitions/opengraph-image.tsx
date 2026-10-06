import { ImageResponse } from "next/og"
import { getExhibitions } from "@/lib/data"
import { firstUsableDataUri } from "@/lib/ogAssets"
import general from "@/data/general.json"

export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = `Esposizioni — ${general.artistName}`

// Colori: token light di app/globals.css riportati come hex (vedi app/opengraph-image.tsx)
export default function OpengraphImage() {
  const imageSrc = firstUsableDataUri(
    getExhibitions().flatMap((e) => e.images),
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
          <div style={{ fontSize: 56, color: "#111111", lineHeight: 1.1 }}>
            Esposizioni
          </div>
          <div style={{ fontSize: 28, color: "#666666", marginTop: 20 }}>
            {general.siteTitle}
          </div>
        </div>
      </div>
    ),
    size,
  )
}
