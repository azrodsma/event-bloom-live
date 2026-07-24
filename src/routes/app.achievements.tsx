import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Sparkles, Heart, Camera, Mic, Users, Calendar, Crown, Lock, Share2 } from "lucide-react";

export const Route = createFileRoute("/app/achievements")({
  component: Achievements,
  head: () => ({
    meta: [
      { title: "Récompenses · Memento Live" },
      { name: "description", content: "Débloquez des badges à mesure que vous créez et partagez vos plus beaux événements." },
      { property: "og:title", content: "Récompenses · Memento Live" },
      { property: "og:description", content: "Collectionnez des badges Memento Live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: typeof Trophy;
  progress: number;
  goal: number;
  unlocked: boolean;
  rarity: "Commun" | "Rare" | "Épique" | "Légendaire";
  color: string;
}

const badges: Badge[] = [
  { id: "b1", name: "Premier souvenir", desc: "Créer votre premier événement", icon: Sparkles, progress: 1, goal: 1, unlocked: true, rarity: "Commun", color: "from-primary/20 to-primary/5" },
  { id: "b2", name: "Cœur d'or", desc: "Recevoir 100 réactions cœur", icon: Heart, progress: 100, goal: 100, unlocked: true, rarity: "Commun", color: "from-primary/30 to-primary/10" },
  { id: "b3", name: "Reporter", desc: "Partager 50 photos sur un événement", icon: Camera, progress: 47, goal: 50, unlocked: false, rarity: "Rare", color: "from-accent/40 to-accent/10" },
  { id: "b4", name: "Voix du souvenir", desc: "Déposer 10 messages vocaux au livre d'or", icon: Mic, progress: 6, goal: 10, unlocked: false, rarity: "Rare", color: "from-accent/40 to-accent/10" },
  { id: "b5", name: "Rassembleur", desc: "Réunir 100 invités sur un même événement", icon: Users, progress: 100, goal: 100, unlocked: true, rarity: "Épique", color: "from-primary/40 to-accent/20" },
  { id: "b6", name: "Marathon", desc: "Diffuser un live de plus de 4 heures", icon: Calendar, progress: 2, goal: 4, unlocked: false, rarity: "Épique", color: "from-primary/30 to-accent/20" },
  { id: "b7", name: "Ambassadeur·rice", desc: "Parrainer 10 nouveaux comptes", icon: Share2, progress: 3, goal: 10, unlocked: false, rarity: "Épique", color: "from-accent/50 to-primary/20" },
  { id: "b8", name: "Légende Memento", desc: "Organiser 10 événements complets", icon: Crown, progress: 2, goal: 10, unlocked: false, rarity: "Légendaire", color: "from-primary/60 via-accent/40 to-primary/20" },
];

const rarityColors: Record<Badge["rarity"], string> = {
  Commun: "text-muted-foreground",
  Rare: "text-primary",
  Épique: "text-accent-foreground",
  Légendaire: "text-primary",
};

function Achievements() {
  const unlocked = badges.filter((b) => b.unlocked).length;
  const total = badges.length;
  const percent = Math.round((unlocked / total) * 100);

  return (
    <div className="pb-24">
      <div className="sticky top-[57px] z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app/profile" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Récompenses</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/10 to-transparent px-4 pb-8 pt-8">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-glow">
          <Trophy className="h-10 w-10" />
        </div>
        <h1 className="mt-4 text-center font-serif text-2xl leading-tight">
          {unlocked} badges débloqués sur {total}
        </h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Continuez à créer, partager et célébrer pour tous les collectionner.
        </p>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-background/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">{percent}% de progression</p>
      </section>

      <section className="px-4 pt-4">
        <h2 className="mb-3 font-serif text-lg">Débloqués</h2>
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {badges.filter((b) => b.unlocked).map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.id} className={`w-40 shrink-0 snap-start rounded-3xl bg-gradient-to-br ${b.color} p-5 shadow-sm`}>
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-background shadow-sm">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 font-serif text-base leading-tight">{b.name}</p>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{b.rarity}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">À débloquer</h2>
        <ul className="space-y-3">
          {badges.filter((b) => !b.unlocked).map((b) => {
            const Icon = b.icon;
            const percent = Math.round((b.progress / b.goal) * 100);
            return (
              <li key={b.id} className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4">
                <div className="flex gap-3">
                  <div className="relative">
                    <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${b.color}`}>
                      <Icon className="h-6 w-6 text-foreground/60" />
                    </div>
                    <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full border-2 border-background bg-muted text-foreground/60">
                      <Lock className="h-2.5 w-2.5" />
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium">{b.name}</p>
                      <span className={`text-[10px] uppercase tracking-wider ${rarityColors[b.rarity]}`}>{b.rarity}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{b.desc}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                      </div>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {b.progress}/{b.goal}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-foreground to-foreground/80 p-6 text-background">
        <p className="text-xs uppercase tracking-[0.2em] opacity-80">Bonus Premium</p>
        <h3 className="mt-1 font-serif text-xl">Badges exclusifs, cadres animés et effets vidéo</h3>
        <p className="mt-2 text-sm opacity-80">
          Les abonnés Premium débloquent une collection secrète de récompenses réservées.
        </p>
        <Link
          to="/app/premium"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground"
        >
          Découvrir Premium →
        </Link>
      </section>
    </div>
  );
}
