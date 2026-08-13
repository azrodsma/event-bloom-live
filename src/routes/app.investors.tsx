import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, Users, Globe, Award } from "lucide-react";

export const Route = createFileRoute("/app/investors")({
  component: Investors,
  head: () => ({
    meta: [
      { title: "Investisseurs · MaFeliza" },
      { name: "description", content: "Traction, vision et opportunités d'investissement chez MaFeliza." },
      { property: "og:title", content: "Investisseurs · MaFeliza" },
      { property: "og:description", content: "Nous réinventons la mémoire des grands moments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const metrics = [
  { l: "Événements créés", v: "48 200", d: "+312% YoY", icon: Award },
  { l: "Invités actifs", v: "1,8 M", d: "62 pays", icon: Users },
  { l: "MRR", v: "184 k€", d: "Rétention 94%", icon: TrendingUp },
  { l: "NPS", v: "72", d: "Top 5% SaaS", icon: Globe },
];

const rounds = [
  { l: "Pre-seed", date: "Mars 2024", amount: "450 k€", lead: "Kima Ventures" },
  { l: "Seed", date: "Février 2025", amount: "3,2 M€", lead: "Point Nine + BA lifestyle" },
  { l: "Série A", date: "Ouverture Q1 2027", amount: "12 M€ ciblés", lead: "En cours de constitution" },
];

function Investors() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/app" className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Investisseurs</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Traction · Vision · Team</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <TrendingUp className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <p className="text-xs uppercase tracking-widest opacity-70">Notre thèse</p>
          <h2 className="mt-2 font-serif text-3xl leading-[1.05] sm:text-4xl">La mémoire des moments qui comptent mérite mieux qu'un cloud photo.</h2>
          <p className="mt-3 text-sm opacity-90">MaFeliza orchestre l'avant, le pendant et l'après des grands événements privés. 60 milliards € dépensés chaque année en Europe — 0% capturé numériquement de bout en bout.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Traction (T3 2026)</h3>
          <div className="grid grid-cols-2 gap-3">
            {metrics.map((m) => (
              <div key={m.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <m.icon className="h-4 w-4 text-primary" />
                <p className="mt-2 text-xs text-muted-foreground">{m.l}</p>
                <p className="font-display text-2xl">{m.v}</p>
                <p className="text-xs text-primary">{m.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Historique de financement</h3>
          <div className="space-y-3">
            {rounds.map((r) => (
              <div key={r.l} className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{r.l}</p>
                  <span className="text-xs text-muted-foreground">{r.date}</span>
                </div>
                <p className="mt-1 font-display text-xl">{r.amount}</p>
                <p className="text-xs text-muted-foreground">Lead : {r.lead}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-5">
          <p className="font-display text-lg">Data room</p>
          <p className="text-xs text-muted-foreground mt-1">Accessible sur NDA · métriques temps réel, cohortes, unit economics.</p>
          <button className="mt-3 rounded-full bg-foreground px-5 py-2.5 text-sm text-white">Demander l'accès</button>
        </section>
      </main>
    </div>
  );
}
