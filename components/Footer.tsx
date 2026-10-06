import general from "@/data/general.json"

export default function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-faint font-sans">
      © {new Date().getFullYear()} {general.artistName} — Tutti i diritti riservati
      <span className="mx-2 opacity-30">·</span>
      <a href="/admin" className="hover:text-muted transition-colors">Area amministrativa</a>
    </footer>
  )
}
