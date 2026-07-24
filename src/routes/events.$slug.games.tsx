import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Play, Sparkles, Trophy, Users, Clock, ChevronRight, Music, Puzzle, Target, HelpCircle, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/games")({
  component: Games,
  head: () => ({
    meta: [
      { title: "Jeux & animations · Memento Live" },
      { name: "description", content: "Blind tests, quiz sur les mariés, chasse au trésor : animez la soirée avec vos invités." },
      { property: "og:title", content: "Jeux & animations · Memento Live" },
      { property: "og:description", content: "Faites vibrer la salle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Game = {
  id: string;
  emoji: string;
  title: string;
  duration: string;
  players: string;
  intensity: 1 | 2 | 3;
  desc: string;
  icon: typeof Music;
  color: string;
  scheduled?: string;
  played?: boolean;
};

const games: Game[] = [
  {
    id: "g1",
    emoji: "🎵",
    title: "Blind test des mariés",
    duration: "20 min",
    players: "Tous",
    intensity: 2,
    desc: "20 titres qui ont marqué leur histoire — le premier à sonner remporte le point.",
    icon: Music,
    color: "from-fuchsia-400 to-pink-500",
    scheduled: "22 h 00",
  },
  {
    id: "g2",
    emoji: "🔎",
    title: "Chasse au trésor du Domaine",
    duration: "45 min",
    players: "Équipes de 4",
    intensity: 3,
    desc: "12 indices dispersés dans le château, un mot doux à trouver au final.",
    icon: Target,
    color: "from-emerald-400 to-teal-500",
    scheduled: "17 h 30",
    played: true,
  },
  {
    id: "g3",
    emoji: "💬",
    title: "Qui a dit ça ?",
    duration: "15 min",
    players: "Duo mariés + salle",
    intensity: 1,
    desc: "Des citations, à attribuer à Sarah ou Thomas. Fous rires garantis.",
    icon: HelpCircle,
    color: "from-amber-400 to-orange-500",
    scheduled: "21 h 15",
  },
  {
    id: "g4",
    emoji: "🧩",
    title: "Puzzle photo collaboratif",
    duration: "En continu",
    players: "Tous",
    intensity: 1,
    desc: "Assemblez ensemble une photo mystère qui se dévoilera au fil de la soirée.",
    icon: Puzzle,
    color: "from-sky-400 to-indigo-500",
  },
  {
    id: "g5",
    emoji: "❤️",
    title: "Speed friending",
    duration: "25 min",
    players: "Célibataires & solo",
    intensity: 2,
    desc: "Rencontres éclairs de 3 min pour briser la glace, avec cartes-questions.",
    icon: Heart,
    color: "from-rose-400 to-rose-500",
    scheduled: "19 h 45",
  },
];

const leaderboard = [
  { pos: 1, team: "Team témoins", pts: 42, color: "bg-amber-400" },
  { pos: 2, team: "Cousins & cousines", pts: 38, color: "bg-slate-300" },
  { pos: 3, team: "Amis du lycée", pts: 34, color: "bg-orange-400" },
  { pos: 4, team: "Voisins & famille", pts: 28, color: "bg-secondary" },
];

const intensityDot = (n: number) => (
  <span className="inline-flex items-center gap-0.5">
    {[1, 2, 3].map((i) => (
      <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= n ? "bg-primary" : "bg-border"}`} />
    ))}
  </span>
);

function Games() {
  const { slug } = useParams({ from: "/events/$slug/games" });
  const [tab, setTab] = useState<"catalog" | "board">("catalog");

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Jeux & animations</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-primary/10 via-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 5 animations · 3 h de fun
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Faites vibrer<br />toute la salle</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Piochez dans le catalogue Memento ou créez vos propres jeux. Résultats en temps réel.
        </p>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1">
          {(["catalog", "board"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-semibold ${
                tab === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {v === "catalog" ? "Catalogue" : "Classement"}
            </button>
          ))}
        </div>
      </div>

      {tab === "catalog" && (
        <section className="space-y-3 px-4 pt-4">
          {games.map((g) => {
            const Icon = g.icon;
            return (
              <article
                key={g.id}
                className={`relative overflow-hidden rounded-3xl border border-border/60 bg-card ${g.played ? "opacity-70" : ""}`}
              >
                <div className={`relative h-24 w-full bg-gradient-to-br ${g.color}`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <span className="absolute left-4 top-4 grid h-14 w-14 place-items-center rounded-2xl bg-white/85 text-3xl shadow-sm backdrop-blur">
                    {g.emoji}
                  </span>
                  {g.scheduled && !g.played && (
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-foreground backdrop-blur">
                      <Clock className="mr-1 inline h-3 w-3" /> {g.scheduled}
                    </span>
                  )}
                  {g.played && (
                    <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                      ✓ Joué
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {g.duration}
                    <span>·</span>
                    <Users className="h-3.5 w-3.5" /> {g.players}
                    <span>·</span>
                    {intensityDot(g.intensity)}
                  </div>
                  <h2 className="mt-1.5 font-serif text-lg leading-tight">{g.title}</h2>
                  <p className="mt-1 text-[12px] text-muted-foreground">{g.desc}</p>

                  <div className="mt-4 flex gap-2">
                    {g.played ? (
                      <>
                        <button className="flex-1 rounded-full border border-border bg-background py-2.5 text-xs font-semibold">
                          Revoir les scores
                        </button>
                        <button className="rounded-full bg-secondary px-3 py-2.5 text-xs font-semibold">
                          Rejouer
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2.5 text-xs font-bold text-primary-foreground shadow-glow">
                          <Play className="h-3.5 w-3.5 fill-current" /> Lancer maintenant
                        </button>
                        <button className="rounded-full border border-border bg-background px-3 py-2.5 text-xs font-semibold">
                          Personnaliser
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-border py-5 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-4 w-4" /> Créer un jeu sur mesure
          </button>
        </section>
      )}

      {tab === "board" && (
        <section className="px-4 pt-4">
          <div className="rounded-3xl border border-border/60 bg-card p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Trophy className="h-3.5 w-3.5" /> Classement provisoire
            </div>
            <ul className="mt-4 space-y-2">
              {leaderboard.map((t) => (
                <li key={t.team} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${t.color} font-serif text-lg`}>
                    {t.pos}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{t.team}</p>
                    <div className="mt-1 h-1.5 rounded-full bg-background">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${(t.pts / leaderboard[0].pts) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold">{t.pts}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-3xl bg-primary/5 p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Récompense finale</p>
            <p className="mt-2 font-serif text-lg leading-tight">Bouteille de champagne + honneur suprême</p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Remise à la table gagnante à minuit, avant l'ouverture de bal.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl bg-card p-3 ring-1 ring-border/60">
            <div className="min-w-0">
              <p className="text-sm font-semibold">Voir historique complet</p>
              <p className="text-[10px] text-muted-foreground">Détails par jeu et par équipe</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </section>
      )}
    </div>
  );
}
