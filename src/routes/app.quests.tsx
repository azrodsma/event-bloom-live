import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Sparkles, Flame, Target, Check, Lock } from "lucide-react";

export const Route = createFileRoute("/app/quests")({
  component: Quests,
  head: () => ({
    meta: [
      { title: "Quêtes hebdomadaires · MaFeliza" },
      { name: "description", content: "Des missions douces qui font avancer votre événement chaque semaine." },
      { property: "og:title", content: "Quêtes · MaFeliza" },
      { property: "og:description", content: "Un petit pas par jour, un grand jour au bout." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Quest = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  xp: number;
  difficulty: "facile" | "moyen" | "épique";
  category: "photo" | "social" | "logistique" | "émotion";
  locked?: boolean;
  done?: boolean;
};

const quests: Quest[] = [
  { id: "q1", title: "Ajouter 5 nouvelles photos", description: "Enrichissez l'album de la semaine.", progress: 5, target: 5, xp: 40, difficulty: "facile", category: "photo", done: true },
  { id: "q2", title: "Écrire à 3 invités", description: "Un mot doux à ceux que vous voyez peu.", progress: 2, target: 3, xp: 60, difficulty: "facile", category: "social" },
  { id: "q3", title: "Terminer la playlist cocktail", description: "Objectif : 45 min de musique douce.", progress: 32, target: 45, xp: 80, difficulty: "moyen", category: "logistique" },
  { id: "q4", title: "Enregistrer un vocal souvenir", description: "Racontez à votre futur vous 5 min.", progress: 0, target: 1, xp: 100, difficulty: "moyen", category: "émotion" },
  { id: "q5", title: "Valider le plan de table", description: "Toutes les tables assignées.", progress: 8, target: 12, xp: 120, difficulty: "moyen", category: "logistique" },
  { id: "q6", title: "Envoyer les 30 derniers faire-part", description: "Sprint final avant J-45.", progress: 0, target: 30, xp: 200, difficulty: "épique", category: "logistique" },
  { id: "q7", title: "Découvrir la Rétrospective 2025", description: "Débloquée à 500 XP hebdo.", progress: 0, target: 1, xp: 0, difficulty: "épique", category: "émotion", locked: true },
];

const catTint = {
  photo: "bg-amber-100 text-amber-800",
  social: "bg-primary/10 text-primary",
  logistique: "bg-sky-100 text-sky-800",
  émotion: "bg-rose-100 text-rose-800",
} as const;

const diffTint = {
  facile: "text-emerald-600",
  moyen: "text-amber-600",
  épique: "text-primary",
} as const;

function Quests() {
  const totalXp = quests.reduce((s, q) => s + (q.done ? q.xp : Math.floor((q.progress / q.target) * q.xp)), 0);
  const targetXp = 500;
  const percent = Math.min(100, Math.round((totalXp / targetXp) * 100));
  const streak = 12;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Quêtes</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Trophy className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-accent px-4 pb-8 pt-8 text-primary-foreground">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-primary-foreground/80">
          <Flame className="h-3.5 w-3.5" /> Semaine 18 · Sprint doux
        </div>
        <h1 className="mt-3 font-serif text-3xl leading-tight">Un petit pas<br />par jour</h1>

        <div className="mt-6 rounded-3xl bg-background/15 p-4 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-primary-foreground/70">XP hebdomadaire</p>
            <p className="font-serif text-sm">
              <span className="text-2xl">{totalXp}</span>
              <span className="text-primary-foreground/70">/{targetXp}</span>
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-foreground/20">
            <div className="h-full bg-gradient-to-r from-primary-foreground to-accent" style={{ width: `${percent}%` }} />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/15 p-3 text-center backdrop-blur">
            <p className="flex items-center justify-center gap-1 font-serif text-lg leading-none">
              🔥 {streak}
            </p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-primary-foreground/70">jours</p>
          </div>
          <div className="rounded-2xl bg-background/15 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">Niveau 7</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-primary-foreground/70">Passionné</p>
          </div>
          <div className="rounded-2xl bg-background/15 p-3 text-center backdrop-blur">
            <p className="font-serif text-lg leading-none">{quests.filter((q) => q.done).length}/{quests.filter((q) => !q.locked).length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-primary-foreground/70">Terminées</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Quêtes actives</h2>
        <ul className="space-y-2">
          {quests.map((q) => {
            const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
            return (
              <li
                key={q.id}
                className={`rounded-2xl border p-3 transition ${
                  q.locked ? "border-dashed border-border bg-secondary/40 opacity-60" :
                  q.done ? "border-emerald-200 bg-emerald-50/50" :
                  "border-border/60 bg-card"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${q.done ? "bg-emerald-500 text-white" : "bg-gradient-to-br from-primary/15 to-accent/40"}`}>
                    {q.locked ? <Lock className="h-4 w-4 text-muted-foreground" /> :
                     q.done ? <Check className="h-5 w-5" /> :
                     <Target className="h-4 w-4 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif text-[14px] leading-tight">{q.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${catTint[q.category]}`}>
                        {q.category}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{q.description}</p>
                    {!q.locked && (
                      <>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                            <div className={`h-full ${q.done ? "bg-emerald-500" : "bg-gradient-to-r from-primary to-accent"}`} style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-semibold tabular-nums text-muted-foreground">
                            {q.progress}/{q.target}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span className={`font-bold uppercase ${diffTint[q.difficulty]}`}>
                            {q.difficulty}
                          </span>
                          <span className="flex items-center gap-1 font-bold text-primary">
                            <Sparkles className="h-3 w-3" /> +{q.xp} XP
                          </span>
                        </div>
                      </>
                    )}
                    {q.locked && (
                      <p className="mt-2 text-[10px] font-semibold text-muted-foreground">
                        Se débloque à 500 XP hebdo
                      </p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Récompense hebdo</p>
        <p className="mt-2 font-serif text-lg leading-tight">Tirage vinyle personnalisé</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Atteignez 500 XP avant dimanche minuit pour participer au tirage.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Voir la récompense
        </button>
      </section>
    </div>
  );
}
