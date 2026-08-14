import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, FileArchive, Cloud, Check } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/export")({
  component: ExportPage,
  head: () => ({
    meta: [
      { title: "Exporter mes données · MaFeliza" },
      { name: "description", content: "Téléchargez tous vos souvenirs, contacts et médias dans un format ouvert." },
      { property: "og:title", content: "Export RGPD · MaFeliza" },
      { property: "og:description", content: "Vos souvenirs, à emporter." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const bundles = [
  { id: "photos", label: "Photos & vidéos", size: "12,4 Go", count: "3 218 fichiers" },
  { id: "guestbook", label: "Livre d'or (textes, vocaux)", size: "48 Mo", count: "142 entrées" },
  { id: "guests", label: "Liste invités & RSVP", size: "1,2 Mo", count: "218 contacts" },
  { id: "chat", label: "Chat live & réactions", size: "6 Mo", count: "1 840 messages" },
  { id: "docs", label: "Documents (factures, contrats)", size: "22 Mo", count: "34 PDF" },
];

function ExportPage() {
  const [selected, setSelected] = useState<string[]>(["photos", "guestbook"]);
  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app/settings" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Exporter mes données</p>
          <p className="text-xs text-muted-foreground">Format ouvert · conforme RGPD</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <FileArchive className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Vos souvenirs, à emporter</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Sélectionnez les catégories à télécharger. Nous préparons un ZIP chiffré en moins de 10 minutes.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Que souhaitez-vous emporter ?</p>
          <div className="space-y-2">
            {bundles.map((b) => {
              const on = selected.includes(b.id);
              return (
                <button
                  key={b.id}
                  onClick={() => toggle(b.id)}
                  className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3.5 text-left shadow-soft transition hover:bg-cream"
                >
                  <div
                    className={`grid h-6 w-6 place-items-center rounded-md border-2 ${
                      on ? "border-primary bg-primary text-white" : "border-border"
                    }`}
                  >
                    {on && <Check className="h-3.5 w-3.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{b.label}</p>
                    <p className="text-[11px] text-muted-foreground">{b.count}</p>
                  </div>
                  <p className="text-xs font-semibold text-primary-dark">{b.size}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Cloud className="h-3.5 w-3.5" /> Destination
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {["ZIP local", "Google Drive", "Dropbox"].map((d, i) => (
              <button
                key={d}
                className={`rounded-2xl p-3 text-xs font-semibold ${
                  i === 0 ? "bg-primary text-white" : "bg-cream text-muted-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-dark py-3.5 text-sm font-semibold text-white shadow-card">
          <Download className="h-4 w-4" /> Préparer l'export ({selected.length} catégorie{selected.length > 1 ? "s" : ""})
        </button>

        <p className="px-2 text-center text-[11px] text-muted-foreground">
          Vos données restent chiffrées de bout en bout. Aucun tiers n'y accède.
        </p>
      </main>
    </div>
  );
}
