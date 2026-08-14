import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Cigarette, Wind, Leaf } from "lucide-react";

export const Route = createFileRoute("/events/$slug/smoking-area")({
  component: SmokingArea,
  head: () => ({
    meta: [
      { title: "Espace fumeurs · MaFeliza" },
      { name: "description", content: "Un coin fumeurs pensé, propre et convivial." },
      { property: "og:title", content: "Espace fumeurs · MaFeliza" },
      { property: "og:description", content: "Discret, ventilé, respectueux des non-fumeurs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const amenities = [
  { l: "Cendriers design", d: "6 unités en laiton mat, vidés toutes les heures" },
  { l: "Braseros lumineux", d: "2 foyers doux, mèche bioéthanol · zéro fumée" },
  { l: "Cave à cigares", d: "Sélection Cohiba, Partagás · service coupe & feu" },
  { l: "Vapoteurs", d: "Station recharge USB · e-liquides fournis" },
];

function SmokingArea() {
  const { slug } = useParams({ from: "/events/$slug/smoking-area" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Espace fumeurs</p>
          <p className="text-xs text-muted-foreground">Terrasse ouest · 32 places</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Cigarette className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Discret, ventilé, respectueux</p>
          <p className="mt-2 text-sm opacity-90">
            Zone dédiée à l'écart des non-fumeurs. Cave à cigares, braseros doux et cendriers pour un moment convivial et propre.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <Wind className="mx-auto h-4 w-4 text-primary-dark" />
            <p className="mt-1 font-serif text-2xl text-primary-dark">15 m</p>
            <p className="text-[10px] text-muted-foreground">du dance-floor</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <Leaf className="mx-auto h-4 w-4 text-foreground" />
            <p className="mt-1 font-serif text-2xl">100%</p>
            <p className="text-[10px] text-muted-foreground">mégots collectés</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <Cigarette className="mx-auto h-4 w-4" />
            <p className="mt-1 font-serif text-2xl">24</p>
            <p className="text-[10px] opacity-80">fumeurs déclarés</p>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Équipements</p>
          <div className="space-y-2">
            {amenities.map((a) => (
              <article key={a.l} className="rounded-2xl bg-surface p-4 shadow-soft">
                <p className="text-sm font-semibold">{a.l}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{a.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Recyclage mégots</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Partenariat avec MéGO! : les mégots sont dépollués puis transformés en mobilier urbain. Rapport écologique envoyé à J+30.
          </p>
        </section>
      </main>
    </div>
  );
}
