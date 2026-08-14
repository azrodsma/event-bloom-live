import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Coins, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/app/creators")({
  component: Creators,
  head: () => ({
    meta: [
      { title: "Programme créateurs · MaFeliza" },
      { name: "description", content: "Monétisez vos templates, playlists et moodboards auprès de la communauté MaFeliza." },
      { property: "og:title", content: "Programme créateurs · MaFeliza" },
      { property: "og:description", content: "Vos créations, valorisées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const items = [
  { name: "Moodboard Bohème 2026", type: "Moodboard", sales: 84, revenue: "252 €", color: "from-primary to-primary-dark" },
  { name: "Playlist « Slow romantique »", type: "Playlist", sales: 156, revenue: "312 €", color: "from-gold to-primary" },
  { name: "Template faire-part minéral", type: "Papeterie", sales: 42, revenue: "504 €", color: "from-primary-dark to-gold" },
  { name: "Cue-sheet lumière classique", type: "Preset scéno", sales: 19, revenue: "228 €", color: "from-foreground to-primary-dark" },
];

function Creators() {
  const total = items.reduce((a, i) => a + parseInt(i.revenue), 0);
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Programme créateurs</p>
          <p className="text-xs text-muted-foreground">70% pour vous · payé sur cagnotte externe</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Coins className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Vos créations, valorisées</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] uppercase opacity-70">Revenus 30j</p>
              <p className="font-serif text-2xl">{total} €</p>
            </div>
            <div>
              <p className="text-[10px] uppercase opacity-70">Ventes</p>
              <p className="font-serif text-2xl">{items.reduce((a, i) => a + i.sales, 0)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase opacity-70">Note</p>
              <p className="font-serif text-2xl">4,9★</p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vos créations en boutique</p>
          <div className="space-y-2">
            {items.map((it) => (
              <article key={it.name} className={`rounded-2xl bg-gradient-to-br ${it.color} p-4 text-white shadow-soft`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase opacity-80">{it.type}</p>
                    <p className="mt-1 font-serif text-lg leading-tight">{it.name}</p>
                    <p className="mt-1 flex items-center gap-1 text-[11px] opacity-90">
                      <Users className="h-3 w-3" /> {it.sales} ventes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] opacity-80">Revenu</p>
                    <p className="font-serif text-xl">{it.revenue}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" /> Prochains paliers
          </div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-cream p-3">
              <span>Créateur Argent (500 €)</span>
              <span className="text-primary-dark font-semibold">80%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-cream p-3">
              <span>Créateur Or (2 000 €)</span>
              <span className="text-muted-foreground">42%</span>
            </div>
          </div>
        </section>

        <button className="w-full rounded-full bg-gradient-to-r from-primary to-primary-dark py-3.5 text-sm font-semibold text-white shadow-card">
          Publier une nouvelle création
        </button>
      </main>
    </div>
  );
}
