import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Target, Zap } from "lucide-react";

export const Route = createFileRoute("/app/leaderboard")({
  component: Leaderboard,
  head: () => ({
    meta: [
      { title: "Classement · MaFeliza" },
      { name: "description", content: "Les organisateurs les plus inspirants du mois." },
      { property: "og:title", content: "Classement · MaFeliza" },
      { property: "og:description", content: "La communauté qui inspire, à découvrir." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const top = [
  { rank: 1, name: "Camille & Théo", event: "Mariage bohème · Cévennes", stars: 4820, badge: "Doré", color: "from-gold to-primary" },
  { rank: 2, name: "Salomé D.", event: "Baptême villa · Cap Ferret", stars: 3910, badge: "Doré", color: "from-primary to-gold" },
  { rank: 3, name: "Julien P.", event: "Anniv 40 ans · Marrakech", stars: 3140, badge: "Crème", color: "from-primary to-primary-dark" },
];

const rest = [
  { rank: 4, name: "Nour B.", stars: 2680 },
  { rank: 5, name: "Alice & Yann", stars: 2410 },
  { rank: 6, name: "Marina R.", stars: 2205 },
  { rank: 7, name: "Simon L.", stars: 1988 },
  { rank: 8, name: "Vous", stars: 1720, me: true },
  { rank: 9, name: "Thomas V.", stars: 1650 },
  { rank: 10, name: "Léa & Anne", stars: 1512 },
];

function Leaderboard() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Classement du mois</p>
          <p className="text-xs text-muted-foreground">Basé sur les étoiles MaFeliza gagnées</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 items-end gap-2">
          {[top[1], top[0], top[2]].map((t, i) => {
            const height = ["h-24", "h-32", "h-20"][i];
            return (
              <div key={t.rank} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${t.color} ${height} flex flex-col justify-end p-3 text-white shadow-soft`}>
                <Trophy className="mx-auto h-5 w-5" />
                <p className="mt-2 text-center text-[10px] font-bold uppercase opacity-90">#{t.rank}</p>
                <p className="text-center font-serif text-sm leading-tight">{t.name}</p>
                <p className="text-center text-[10px] opacity-90">{t.stars.toLocaleString("fr")} ★</p>
              </div>
            );
          })}
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Podium détaillé</p>
          <div className="space-y-2">
            {top.map((t) => (
              <article key={t.rank} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${t.color} font-bold text-white`}>
                  {t.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{t.event}</p>
                </div>
                <span className="rounded-full bg-gold/25 px-2 py-0.5 text-[10px] font-bold uppercase text-foreground">
                  {t.badge}
                </span>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reste du top 10</p>
          <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
            {rest.map((r, i) => (
              <div key={r.rank} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t border-border/40" : ""} ${r.me ? "bg-primary/10" : ""}`}>
                <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold ${r.me ? "bg-primary text-white" : "bg-cream text-foreground"}`}>
                  {r.rank}
                </span>
                <p className={`flex-1 text-sm ${r.me ? "font-bold" : ""}`}>{r.name}</p>
                <p className="text-xs font-semibold text-primary-dark">{r.stars.toLocaleString("fr")} ★</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-5 text-background shadow-card">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <p className="font-serif text-lg">Objectif du mois</p>
          </div>
          <p className="mt-2 text-sm opacity-90">Encore <span className="font-bold text-primary">280 ★</span> pour rejoindre le top 5 et débloquer le pack impression VIP.</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-[86%] rounded-full bg-primary" />
          </div>
          <button className="mt-4 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold">
            <Zap className="h-3.5 w-3.5" /> Voir comment gagner des étoiles
          </button>
        </section>
      </main>
    </div>
  );
}
