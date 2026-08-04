import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Trophy, Sparkles, Check, Clock, Users, Plus, Lock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/photo-challenges")({
  component: PhotoChallenges,
  head: () => ({
    meta: [
      { title: "Défis photo · MaFeliza" },
      { name: "description", content: "Une chasse aux souvenirs à travers la soirée. Débloquez, capturez, gagnez." },
      { property: "og:title", content: "Défis photo · MaFeliza" },
      { property: "og:description", content: "La chasse aux souvenirs de la soirée." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Difficulty = "Facile" | "Moyen" | "Épique";
type Status = "done" | "todo" | "locked";

type Challenge = {
  id: string;
  emoji: string;
  title: string;
  hint: string;
  points: number;
  difficulty: Difficulty;
  status: Status;
  contributors?: number;
  preview?: string;
  bg: string;
};

const challenges: Challenge[] = [
  {
    id: "c1",
    emoji: "🥂",
    title: "Le premier toast",
    hint: "Capturez le clink de la coupe d'ouverture",
    points: 30,
    difficulty: "Facile",
    status: "done",
    contributors: 24,
    preview: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400",
    bg: "from-amber-100 to-amber-200",
  },
  {
    id: "c2",
    emoji: "💃",
    title: "L'ouverture de bal",
    hint: "Une photo de la première danse — floue autorisée !",
    points: 50,
    difficulty: "Moyen",
    status: "done",
    contributors: 18,
    preview: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    bg: "from-primary/30 to-primary/10",
  },
  {
    id: "c3",
    emoji: "😂",
    title: "Le fou rire de la table 7",
    hint: "Attention : nécessite une bonne dose d'auto-dérision",
    points: 40,
    difficulty: "Moyen",
    status: "todo",
    contributors: 3,
    bg: "from-sky-100 to-sky-200",
  },
  {
    id: "c4",
    emoji: "👴",
    title: "Trois générations, une photo",
    hint: "Enfant, parent, grand-parent — dans le même cadre",
    points: 70,
    difficulty: "Épique",
    status: "todo",
    contributors: 1,
    bg: "from-rose-100 to-rose-200",
  },
  {
    id: "c5",
    emoji: "🕺",
    title: "Le pas de danse improbable",
    hint: "Boomerang ou vidéo courte, 3 secondes suffisent",
    points: 40,
    difficulty: "Moyen",
    status: "todo",
    bg: "from-violet-100 to-violet-200",
  },
  {
    id: "c6",
    emoji: "🌌",
    title: "Selfie sous les étoiles",
    hint: "Se déverrouille après minuit",
    points: 60,
    difficulty: "Épique",
    status: "locked",
    bg: "from-slate-200 to-slate-300",
  },
  {
    id: "c7",
    emoji: "💍",
    title: "Le baiser voleur",
    hint: "Se déverrouille à la sortie de l'église",
    points: 90,
    difficulty: "Épique",
    status: "locked",
    bg: "from-slate-200 to-slate-300",
  },
];

const difficulty: Record<Difficulty, string> = {
  Facile: "bg-emerald-100 text-emerald-700",
  Moyen: "bg-amber-100 text-amber-700",
  Épique: "bg-primary/15 text-primary",
};

const filters = ["Tous", "À faire", "Complétés", "Verrouillés"] as const;

function PhotoChallenges() {
  const { slug } = useParams({ from: "/events/$slug/photo-challenges" });
  const [tab, setTab] = useState<(typeof filters)[number]>("Tous");

  const done = challenges.filter((c) => c.status === "done").length;
  const totalPoints = challenges.filter((c) => c.status === "done").reduce((a, c) => a + c.points, 0);
  const pct = Math.round((done / challenges.length) * 100);

  const list = challenges.filter((c) => {
    if (tab === "Tous") return true;
    if (tab === "À faire") return c.status === "todo";
    if (tab === "Complétés") return c.status === "done";
    return c.status === "locked";
  });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Défis photo</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Créer">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-accent/40 to-transparent" />
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Camera className="h-3.5 w-3.5 text-primary" /> Chasse aux souvenirs
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            {challenges.length} défis,<br />
            <span className="italic text-primary">une soirée légendaire</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Débloquez des missions au fil de la soirée. Chaque photo compte.
          </p>

          <div className="mt-5 rounded-2xl bg-card/90 p-4 shadow-sm ring-1 ring-border/60 backdrop-blur">
            <div className="flex items-baseline justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Progression</p>
              <p className="font-mono text-xs font-bold">{done}/{challenges.length}</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-secondary/50 p-2">
                <p className="font-serif text-xl leading-none">{totalPoints}</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">points</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-2">
                <p className="font-serif text-xl leading-none">4<span className="text-xs">e</span></p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">rang</p>
              </div>
              <div className="rounded-xl bg-secondary/50 p-2">
                <p className="font-serif text-xl leading-none">2</p>
                <p className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">à débloquer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 -mx-1 flex gap-1.5 overflow-x-auto border-b border-border/60 bg-background/95 px-5 py-2.5 backdrop-blur">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setTab(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
              tab === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <ul className="space-y-3 px-4 pt-4">
        {list.map((c) => {
          const isDone = c.status === "done";
          const isLocked = c.status === "locked";
          return (
            <li
              key={c.id}
              className={`overflow-hidden rounded-3xl border border-border/60 bg-card ${isLocked ? "opacity-70" : ""}`}
            >
              <div className={`relative h-32 bg-gradient-to-br ${c.bg}`}>
                {c.preview && (
                  <img src={c.preview} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 text-4xl drop-shadow">{c.emoji}</span>
                <div className="absolute right-3 top-3 flex flex-col items-end gap-1">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${difficulty[c.difficulty]}`}>
                    {c.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-bold backdrop-blur">
                    <Sparkles className="h-2.5 w-2.5" /> {c.points} pts
                  </span>
                </div>
                {isDone && (
                  <span className="absolute bottom-3 left-4 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                    <Check className="h-3 w-3" /> Complété
                  </span>
                )}
                {isLocked && (
                  <span className="absolute bottom-3 left-4 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                    <Lock className="h-3 w-3" /> Verrouillé
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="font-serif text-lg leading-tight">{c.title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{c.hint}</p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {c.contributors ? `${c.contributors} invité·es` : "Personne encore"}
                  </div>
                  {!isLocked ? (
                    <button
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-bold ${
                        isDone ? "bg-secondary text-foreground" : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <Camera className="h-3 w-3" /> {isDone ? "Rejouer" : "Capturer"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1.5 text-[10px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> Bientôt
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-8 flex items-center justify-between rounded-3xl bg-primary/10 p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Trophy className="h-3.5 w-3.5" /> Récompense finale
          </div>
          <p className="mt-1 font-serif text-lg leading-tight">Livre photo édition limitée</p>
          <p className="text-[11px] text-muted-foreground">Top 5 des chasseurs de souvenirs</p>
        </div>
        <div className="text-4xl">🏆</div>
      </section>
    </div>
  );
}
