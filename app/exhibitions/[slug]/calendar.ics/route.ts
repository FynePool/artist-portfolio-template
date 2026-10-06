import { getExhibitions } from "@/lib/data"
import { buildExhibitionIcs } from "@/lib/ics"

// Route generata al build per ogni mostra datata (il sito è statico)
export const dynamic = "force-static"

export function generateStaticParams(): { slug: string }[] {
  return getExhibitions()
    .filter((e) => e.date !== undefined)
    .map((e) => ({ slug: e.id }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params
  const exhibition = getExhibitions().find((e) => e.id === slug)
  const ics = exhibition ? buildExhibitionIcs(exhibition) : null

  if (!ics) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
    },
  })
}
