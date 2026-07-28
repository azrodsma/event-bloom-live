import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Aperture, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/couple-shoot")({
  component: CoupleShoot,
  head: () => ({
    meta: [
      { title: "Séance couple · Memento Live" },
      { name: "description", content: "Le moment volé à deux, mis en scène." },
      { property: "og:title", content: "Séance couple · Memento Live" },
      { property: "og:description", content: "20 minutes qui deviennent vos plus belles photos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const shots = [
  { l: "Le premier regard", d: "Verger sud · lumière filtrée par les feuilles", dur: "3 min" },
  { l: "La marche complice", d: "Allée de graviers · plan large", dur: "4 min" },
  { l: "L'accolade rieuse", d: "Sous la tonnelle · lumière chaude", dur: "3 min" },
  { l: "Portrait rapproché", d: "Contre le mur en pierre · 85mm f/1.4", dur: "5 min" },
  { l: "Silhouette contre-jour", d: "Coucher de soleil · champ de blé", dur: "4 min" },
  { l: "L'improvisé", d: "Fous rires, danse, spontané", dur: "3 min" },
];

function CoupleShoot() {
  const { slug } = useParams({ from: "/events/$slug/couple-shoot" });
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Séance couple</p>
          <p className="text-xs text-muted-foreground">18h30 → 19h00 · golden hour</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <Camera className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">20 minutes volées à deux</p>
          <p className="mt-2 text-sm opacity-90">
            Théo emmène le couple loin de la foule, dans une lumière rêvée. Chaque plan est pensé, mais rien n'est figé.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">6</p>
            <p className="text-[10px] text-muted-foreground">tableaux</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl">22 min</p>
            <p className="text-[10px] text-muted-foreground">durée totale</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">85mm</p>
            <p className="text-[10px] opacity-80">focale reine</p>
          </div>
        </section>

        <section className="space-y-2">
          {shots.map((s, i) => (
            <article key={s.l} className="flex items-start gap-3 rounded-2xl bg-surface p-4 shadow-soft">
              <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full bg-primary/15 font-serif text-primary-dark">
                {i + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{s.l}</p>
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" />{s.dur}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{s.d}</p>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Aperture className="h-3.5 w-3.5" /> Conseils avant la séance
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Retouche rouge à lèvres, gorgée d'eau, respiration profonde. Théo dirige sans forcer, votre complicité fait le reste.
          </p>
        </section>
      </main>
    </div>
  );
}
