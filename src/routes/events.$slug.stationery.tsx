import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, Sparkles, Layers } from "lucide-react";

export const Route = createFileRoute("/events/$slug/stationery")({
  component: Stationery,
  head: () => ({
    meta: [
      { title: "Papeterie · MaFeliza" },
      { name: "description", content: "Faire-part, menus, marque-places : univers graphique complet." },
      { property: "og:title", content: "Papeterie · MaFeliza" },
      { property: "og:description", content: "Le fil rouge visuel de votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pieces = [
  { l: "Faire-part", qty: 92, status: "Livré", note: "Papier coton 300g · dorure à chaud" },
  { l: "Save the date", qty: 92, status: "Livré", note: "Carte perlée + enveloppe crème" },
  { l: "Livret cérémonie", qty: 166, status: "Impression", note: "16 pages · reliure cousue" },
  { l: "Menus de table", qty: 22, status: "À valider", note: "Un par table · illustration florale" },
  { l: "Marque-places", qty: 166, status: "En préparation", note: "Calligraphie main · Camille Studio" },
  { l: "Cartes de remerciement", qty: 92, status: "Après événement", note: "Envoi J+30 · photo sélectionnée" },
];

function Stationery() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Papeterie</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">6 pièces · Studio Papier & Encre</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Palette className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-gold/30 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Univers graphique</p>
          <h2 className="mt-2 font-display text-2xl">Fleurs séchées & script doré</h2>
          <div className="mt-4 flex gap-2">
            {["#FFF8F4", "#E85D8E", "#D9A441", "#3C2A21"].map((c) => (
              <div key={c} className="flex-1 rounded-lg p-3 text-center text-xs" style={{ background: c, color: c === "#FFF8F4" ? "#3C2A21" : "#fff" }}>{c}</div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          {pieces.map((p) => (
            <div key={p.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2"><Layers className="h-4 w-4 text-primary" /></div>
                  <div>
                    <p className="font-medium">{p.l}</p>
                    <p className="text-xs text-muted-foreground">{p.qty} exemplaires · {p.note}</p>
                  </div>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs whitespace-nowrap">{p.status}</span>
              </div>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Version digitale offerte</p>
            <p className="text-xs text-muted-foreground">Chaque pièce est aussi générée en PDF & story Instagram, incluses dans votre pack.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
