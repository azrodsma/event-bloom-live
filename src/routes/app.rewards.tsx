import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Star, Gift } from "lucide-react";

export const Route = createFileRoute("/app/rewards")({
  component: Rewards,
  head: () => ({
    meta: [
      { title: "Récompenses · Memento Live" },
      { name: "description", content: "Cumulez des étoiles, débloquez des expériences uniques." },
      { property: "og:title", content: "Récompenses · Memento Live" },
      { property: "og:description", content: "Vos souvenirs valent de l'or." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const rewards = [
  { l: "Album photo premium 30×30", cost: 480, partner: "Studio Cheerz", ready: true },
  { l: "Séance photo couple", cost: 720, partner: "Théo Combes", ready: true },
  { l: "Week-end en Provence", cost: 1200, partner: "Domaine du Colombier", ready: false },
  { l: "Bougie signature parfumée", cost: 180, partner: "Diptyque", ready: true },
  { l: "Coffret dégustation vins", cost: 340, partner: "Le Petit Ballon", ready: true },
];

const activity = [
  { l: "Événement Wrapped partagé", stars: 40, date: "hier" },
  { l: "Invitation d'un proche", stars: 60, date: "il y a 3j" },
  { l: "Album collaboratif complété", stars: 80, date: "il y a 1sem" },
];

function Rewards() {
  const stars = 620;
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Récompenses</p>
          <p className="text-xs text-muted-foreground">Vos étoiles Memento</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider opacity-90">
            <Trophy className="h-4 w-4" /> Palier Crème
          </div>
          <p className="mt-3 flex items-baseline gap-2 font-serif text-5xl">
            {stars} <Star className="h-6 w-6 fill-white" />
          </p>
          <p className="text-xs opacity-90">380 étoiles pour débloquer le palier Doré</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: "62%" }} />
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Gift className="h-3.5 w-3.5" /> Catalogue partenaires
          </p>
          <div className="space-y-2">
            {rewards.map((r) => (
              <article key={r.l} className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-soft">
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gold/25">
                  <Gift className="h-5 w-5 text-primary-dark" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{r.l}</p>
                  <p className="text-[11px] text-muted-foreground">Partenaire {r.partner}</p>
                </div>
                <div className="text-right">
                  <p className="font-serif text-lg text-primary-dark">{r.cost}</p>
                  <button
                    disabled={!r.ready || stars < r.cost}
                    className="mt-0.5 rounded-full bg-foreground px-3 py-1 text-[10px] font-semibold text-background disabled:opacity-40"
                  >
                    {stars >= r.cost ? "Échanger" : "Bloqué"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Étoiles récemment gagnées</p>
          <div className="space-y-2">
            {activity.map((a) => (
              <article key={a.l} className="flex items-center justify-between rounded-2xl bg-cream p-3.5 shadow-soft">
                <div>
                  <p className="text-sm font-semibold">{a.l}</p>
                  <p className="text-[11px] text-muted-foreground">{a.date}</p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary-dark">
                  +{a.stars} <Star className="h-3 w-3 fill-primary-dark" />
                </span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
