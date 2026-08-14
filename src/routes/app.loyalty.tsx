import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Gift, Heart, Star, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/loyalty")({
  component: Loyalty,
  head: () => ({
    meta: [
      { title: "Fidélité MaFeliza · MaFeliza" },
      { name: "description", content: "Gagnez des étoiles à chaque événement et débloquez des avantages exclusifs." },
      { property: "og:title", content: "Fidélité MaFeliza · MaFeliza" },
      { property: "og:description", content: "Vos souvenirs récompensés." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Reward = { id: string; name: string; cost: number; kind: string; unlocked?: boolean };

const rewards: Reward[] = [
  { id: "r1", name: "Livre photo premium offert", cost: 200, kind: "Impression", unlocked: true },
  { id: "r2", name: "Filtre AR exclusif Doré", cost: 350, kind: "Créatif", unlocked: true },
  { id: "r3", name: "Concierge IA illimité 1 mois", cost: 500, kind: "IA" },
  { id: "r4", name: "Playlist DJ pro personnalisée", cost: 750, kind: "Musique" },
  { id: "r5", name: "Session photographe partenaire", cost: 1200, kind: "Prestataire" },
];

const tiers = [
  { name: "Rose", min: 0, color: "from-primary/70 to-primary" },
  { name: "Crème", min: 300, color: "from-cream to-gold/60" },
  { name: "Doré", min: 800, color: "from-gold to-primary-dark" },
];

function Loyalty() {
  const [stars] = useState(480);
  const currentTier = [...tiers].reverse().find((t) => stars >= t.min)!;
  const nextTier = tiers.find((t) => t.min > stars);
  const progress = nextTier ? Math.round(((stars - currentTier.min) / (nextTier.min - currentTier.min)) * 100) : 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Fidélité</p>
          <p className="text-xs text-muted-foreground">Membre depuis mars 2025</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className={`overflow-hidden rounded-3xl bg-gradient-to-br ${currentTier.color} p-6 text-white shadow-card`}>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90">
            <Star className="h-3.5 w-3.5 fill-current" /> Palier {currentTier.name}
          </div>
          <p className="mt-2 font-serif text-5xl leading-none">{stars}</p>
          <p className="mt-1 text-sm opacity-90">étoiles MaFeliza</p>
          {nextTier && (
            <>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-2 text-xs opacity-90">
                Plus que {nextTier.min - stars} étoiles pour le palier {nextTier.name}
              </p>
            </>
          )}
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comment gagner</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Heart, label: "Créer un event", pts: "+50" },
              { icon: Gift, label: "Invité actif", pts: "+10" },
              { icon: Star, label: "Livre d'or", pts: "+5" },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl bg-surface p-3 text-center shadow-soft">
                <x.icon className="mx-auto h-5 w-5 text-primary" />
                <p className="mt-2 text-[11px] text-muted-foreground">{x.label}</p>
                <p className="font-serif text-lg text-gold">{x.pts}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Récompenses</p>
          <div className="space-y-2">
            {rewards.map((r) => {
              const can = stars >= r.cost;
              return (
                <button
                  key={r.id}
                  disabled={!can}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-left shadow-soft transition ${
                    can ? "bg-surface hover:shadow-card" : "bg-surface/60 opacity-60"
                  }`}
                >
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${can ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"}`}>
                    <Gift className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.kind}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-gold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {r.cost}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
