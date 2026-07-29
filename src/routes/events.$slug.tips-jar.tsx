import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, HandHeart, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/tips-jar")({
  component: TipsJar,
  head: () => ({
    meta: [
      { title: "Pourboires équipe · Memento Live" },
      { name: "description", content: "Un pot commun transparent pour remercier les équipes." },
      { property: "og:title", content: "Pourboires équipe · Memento Live" },
      { property: "og:description", content: "Merci en actes, pas seulement en mots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const team = [
  { l: "Équipe de service", n: 8, share: 45 },
  { l: "Cuisine", n: 5, share: 25 },
  { l: "Barmen", n: 3, share: 15 },
  { l: "Coordination", n: 2, share: 10 },
  { l: "Techniciens", n: 2, share: 5 },
];

const contributors = [
  { name: "Camille & Théo", amount: 200 },
  { name: "Famille Bernard", amount: 80 },
  { name: "Julie D.", amount: 40 },
  { name: "Anonyme", amount: 20 },
];

function TipsJar() {
  const { slug } = useParams({ from: "/events/$slug/tips-jar" });
  const collected = contributors.reduce((s, c) => s + c.amount, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Pot des équipes</p>
          <p className="text-xs text-muted-foreground">Pourboire collectif transparent</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <HandHeart className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Merci en actes</p>
          <p className="mt-2 text-sm opacity-90">
            Cagnotte externe hébergée par Leetchi. Répartition affichée à l'équipe le lundi suivant.
          </p>
          <div className="mt-4">
            <p className="font-serif text-5xl">{collected} €</p>
            <p className="text-xs opacity-80">objectif 500 € · {Math.round(collected / 5)}%</p>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${(collected / 500) * 100}%` }} />
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Répartition prévue
          </p>
          <div className="space-y-2">
            {team.map((t) => (
              <article key={t.l} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{t.l} <span className="text-xs text-muted-foreground">· {t.n} pers.</span></p>
                  <span className="font-serif text-lg text-primary-dark">{t.share}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${t.share}%` }} />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Contributeurs
          </p>
          <div className="space-y-2">
            {contributors.map((c) => (
              <article key={c.name} className="flex items-center justify-between rounded-2xl bg-cream p-3.5 shadow-soft">
                <p className="text-sm font-semibold">{c.name}</p>
                <span className="font-serif text-lg text-primary-dark">{c.amount} €</span>
              </article>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">Ouvrir la cagnotte Leetchi</button>
      </main>
    </div>
  );
}
