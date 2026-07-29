import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Compass, MapPin, Camera } from "lucide-react";

export const Route = createFileRoute("/events/$slug/honeymoon")({
  component: Honeymoon,
  head: () => ({
    meta: [
      { title: "Voyage de noces · Memento Live" },
      { name: "description", content: "Planifiez le voyage qui prolonge la magie." },
      { property: "og:title", content: "Voyage de noces · Memento Live" },
      { property: "og:description", content: "L'après-mariage, encore plus doux." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  { day: "J+1", l: "Paris → Athènes", d: "Vol Air France 14h20 · surclassement offert", color: "from-primary to-primary-dark" },
  { day: "J+2 à J+5", l: "Santorin", d: "Villa privée à Oia · vue caldeira · piscine à débordement", color: "from-gold to-primary" },
  { day: "J+6 à J+9", l: "Milos", d: "Bateau privé · plages secrètes · Sarakiniko sunset", color: "from-primary-dark to-foreground" },
  { day: "J+10", l: "Athènes → Paris", d: "Retour en douceur · vol de nuit", color: "from-foreground to-primary" },
];

const budget = [
  { l: "Vols", v: 1480, done: true },
  { l: "Hébergement", v: 3200, done: true },
  { l: "Bateau privé Milos", v: 620, done: false },
  { l: "Restaurants signature", v: 850, done: false },
  { l: "Excursions", v: 340, done: false },
];

function Honeymoon() {
  const { slug } = useParams({ from: "/events/$slug/honeymoon" });
  const total = budget.reduce((s, b) => s + b.v, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Voyage de noces</p>
          <p className="text-xs text-muted-foreground">10 jours · Cyclades</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/25 via-gold/25 to-cream p-6 shadow-card">
          <Compass className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'après-mariage, encore plus doux</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Itinéraire orchestré par une agence partenaire, financé par la cagnotte lune de miel dédiée. Vous n'avez qu'à profiter.
          </p>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Itinéraire
          </p>
          <div className="space-y-3">
            {steps.map((s) => (
              <article key={s.l} className={`rounded-2xl bg-gradient-to-br ${s.color} p-5 text-white shadow-soft`}>
                <p className="text-[10px] font-bold uppercase opacity-80">{s.day}</p>
                <p className="mt-1 font-serif text-xl leading-tight">{s.l}</p>
                <p className="mt-1 text-xs opacity-90">{s.d}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Budget lune de miel</p>
          <div className="space-y-2">
            {budget.map((b) => (
              <article key={b.l} className="flex items-center justify-between rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className={`h-2.5 w-2.5 rounded-full ${b.done ? "bg-primary" : "bg-gold"}`} />
                  <p className="text-sm font-semibold">{b.l}</p>
                </div>
                <span className="font-serif text-lg text-primary-dark">{b.v.toLocaleString("fr")} €</span>
              </article>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-foreground p-4 text-background">
            <p className="text-xs uppercase tracking-wider opacity-80">Total prévu</p>
            <p className="font-serif text-2xl">{total.toLocaleString("fr")} €</p>
          </div>
        </section>

        <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-white">
          <Camera className="h-4 w-4" /> Ouvrir le carnet de voyage
        </button>
      </main>
    </div>
  );
}
