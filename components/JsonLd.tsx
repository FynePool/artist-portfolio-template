// Server component: rende un blocco JSON-LD nel markup. Nessun JS lato client.
// Accetta un singolo oggetto schema.org o un array (più entità sulla stessa pagina).
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  // Escape di "<" per evitare che una "</script>" nel contenuto chiuda il tag.
  const json = JSON.stringify(data).replace(/</g, "\\u003c")
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
