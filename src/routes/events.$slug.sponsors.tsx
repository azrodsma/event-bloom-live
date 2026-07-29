import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Star, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/events/$slug/sponsors")({
  component: Sponsors,
  head: () => ({
    meta: [
      { title: "Partenaires & mécènes · Memento Live" },
      { name: "description", content: "Les marques qui soutiennent votre événement avec élégance et discrétion." },
      { property: "og:title", content: "Partenaires · Memento Live" },
      { property: "og:description", content: "Un cercle premium, jamais intrusif." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const sponsors = [
  { name: "Maison Lumen", tier: "Or", contrib: "Champagne cérémonie", value: "1 200 €", color: "from-gold to-primary-dark" },
  { name: "Atelier Rose", tier: "Argent", contrib: "Bouquet mariée offert", value: "180 €", color: "from-primary to-primary-dark" },
  { name: "Studio Nova", tier: "Or", contrib: "Photobooth premium", value: "890 €", color: "from-gold to-primary" },
  { name: "Café Bleu", tier: "Bronze", contrib: "Brunch lendemain −30%", value: "—", color: "from-foreground to-primary-dark" },
];

function Sponsors() {
  const { slug } = useParams({ from: "/events/$slug/sponsors" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Partenaires & mécènes</p>
          <p className="text-xs text-muted-foreground">{sponsors.length} marques · aucune pub intrusive</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-gold/20 to-primary/15 p-6 shadow-card">
          <Handshake className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un cercle premium</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Quatre marques discrètement mises en lumière — jamais de bannière, jamais de pop-up. Uniquement des remerciements élégants.
          </p>
        </section>

        <section className="space-y-2">
          {sponsors.map((s) => (
            <article key={s.name} className={`rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-soft`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-80">Palier {s.tier}</p>
                  <p className="mt-1 font-serif text-xl leading-tight">{s.name}</p>
                  <p className="mt-1 text-xs opacity-90">{s.contrib}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] opacity-80">Valeur</p>
                  <p className="font-serif text-lg">{s.value}</p>
                </div>
              </div>
              <button className="mt-3 flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-semibold backdrop-blur">
                Découvrir la marque <ExternalLink className="h-3 w-3" />
              </button>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Star className="h-3.5 w-3.5" /> Charte partenaire
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Aucun logo sur les faire-part ni les albums photo</li>
            <li>· Mention uniquement dans l'espace dédié + livret papier</li>
            <li>· Filtre éthique : refus des marques hors valeurs de l'organisateur</li>
            <li>· 100% des économies reversées à la cagnotte externe</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
