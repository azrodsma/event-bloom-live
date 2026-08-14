import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Coffee, Sparkles, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/late-night")({
  component: LateNight,
  head: () => ({
    meta: [
      { title: "Fin de soirée · MaFeliza" },
      { name: "description", content: "Snacks, second souffle et derniers slows." },
      { property: "og:title", content: "Fin de soirée · MaFeliza" },
      { property: "og:description", content: "L'énergie ne retombe jamais." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const slots = [
  { t: "23:30", l: "Bar à croque-monsieur", d: "Fromage affiné, jambon truffé, végétarien" },
  { t: "00:15", l: "Set techno-lounge", d: "DJ Milan · BPM 118→124 · deep house" },
  { t: "01:00", l: "Nuit blanche photobooth", d: "Polaroids néon · accessoires kitsch" },
  { t: "01:45", l: "Soupe à l'oignon", d: "Recette de grand-mère · réconfort garanti" },
  { t: "02:30", l: "Derniers slows", d: "Playlist « à deux » · lumière tamisée" },
  { t: "03:00", l: "Café expresso", d: "Barista mobile · biscotti sablés" },
];

function LateNight() {
  const { slug } = useParams({ from: "/events/$slug/late-night" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Fin de soirée</p>
          <p className="text-xs text-muted-foreground">23h30 → 03h00 · second souffle</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Sparkles className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'énergie ne retombe jamais</p>
          <p className="mt-2 text-sm opacity-90">
            Snacks chauds, café frais et rythme calibré : personne ne veut rentrer avant les premières lueurs.
          </p>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Clock className="h-3.5 w-3.5" /> Timeline nocturne
          </p>
          <div className="space-y-2">
            {slots.map((s) => (
              <article key={s.t} className="flex gap-4 rounded-2xl bg-surface p-4 shadow-soft">
                <p className="flex-shrink-0 font-serif text-2xl text-primary-dark">{s.t}</p>
                <div className="min-w-0 flex-1 border-l border-border/60 pl-4">
                  <p className="text-sm font-semibold">{s.l}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{s.d}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Coffee className="h-3.5 w-3.5" /> Kit anti-coup-de-mou
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Tisanes, chocolats chauds, mouchoirs, chargeurs universels et paires de chaussons pour les pieds fatigués.
          </p>
        </section>
      </main>
    </div>
  );
}
