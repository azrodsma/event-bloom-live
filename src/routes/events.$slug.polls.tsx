import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, BarChart2, Plus, Sparkles, Users, Check, Clock, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/polls")({
  component: Polls,
  head: () => ({
    meta: [
      { title: "Sondages en direct · MaFeliza" },
      { name: "description", content: "Créez des sondages instantanés pendant l'événement et voyez les résultats se mettre à jour en direct." },
      { property: "og:title", content: "Sondages en direct · MaFeliza" },
      { property: "og:description", content: "Sondages live pour vos invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Option {
  id: string;
  label: string;
  emoji?: string;
  votes: number;
}
interface Poll {
  id: string;
  question: string;
  status: "live" | "closed" | "draft";
  totalVoters: number;
  timeLeft?: string;
  options: Option[];
  userVote?: string;
}

const seed: Poll[] = [
  {
    id: "p1",
    question: "Qui va attraper le bouquet ?",
    status: "live",
    totalVoters: 87,
    timeLeft: "3 min",
    options: [
      { id: "a", label: "Camille", emoji: "💐", votes: 34 },
      { id: "b", label: "Léa", emoji: "🌸", votes: 28 },
      { id: "c", label: "Marie", emoji: "🌺", votes: 15 },
      { id: "d", label: "Une surprise", emoji: "✨", votes: 10 },
    ],
    userVote: "a",
  },
  {
    id: "p2",
    question: "Prochain morceau à jouer ?",
    status: "live",
    totalVoters: 52,
    timeLeft: "1 min",
    options: [
      { id: "a", label: "Slow romantique", emoji: "💞", votes: 12 },
      { id: "b", label: "Tube 2010s", emoji: "🕺", votes: 24 },
      { id: "c", label: "Classique intemporel", emoji: "🎷", votes: 16 },
    ],
  },
  {
    id: "p3",
    question: "Où partent-ils en voyage de noces ?",
    status: "closed",
    totalVoters: 143,
    options: [
      { id: "a", label: "Bali", emoji: "🌴", votes: 68 },
      { id: "b", label: "Japon", emoji: "🎌", votes: 45 },
      { id: "c", label: "Islande", emoji: "❄️", votes: 30 },
    ],
    userVote: "b",
  },
];

const templates = [
  { emoji: "💐", label: "Qui va attraper le bouquet ?" },
  { emoji: "🎵", label: "Prochaine chanson ?" },
  { emoji: "🍰", label: "Part de gâteau préférée ?" },
  { emoji: "👗", label: "Meilleure tenue de la soirée ?" },
];

function Polls() {
  const { slug } = useParams({ from: "/events/$slug/polls" });
  const [polls, setPolls] = useState(seed);
  const [tab, setTab] = useState<"live" | "closed">("live");

  const filtered = polls.filter((p) => p.status === tab);
  const stats = useMemo(
    () => ({
      live: polls.filter((p) => p.status === "live").length,
      voters: polls.reduce((a, p) => a + p.totalVoters, 0),
      responses: polls.reduce((a, p) => a + p.options.reduce((s, o) => s + o.votes, 0), 0),
    }),
    [polls],
  );

  function vote(pollId: string, optionId: string) {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId || p.userVote) return p;
        return {
          ...p,
          userVote: optionId,
          totalVoters: p.totalVoters + 1,
          options: p.options.map((o) => (o.id === optionId ? { ...o, votes: o.votes + 1 } : o)),
        };
      }),
    );
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex items-center gap-1.5">
          <span className="grid h-2 w-2 place-items-center rounded-full bg-destructive animate-pulse" />
          <p className="font-serif text-lg">Sondages en direct</p>
        </div>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-accent/30 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <BarChart2 className="h-3.5 w-3.5 text-primary" /> Interagissez pendant l'événement
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Faites voter<br />vos invités</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { v: stats.live, l: "En cours", c: "text-destructive" },
            { v: stats.voters, l: "Votants", c: "" },
            { v: stats.responses, l: "Réponses", c: "text-primary" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-background/80 p-3 text-center">
              <p className={`font-serif text-xl leading-none ${s.c}`}>{s.v}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-10 flex gap-2 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
        {(["live", "closed"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold ${
              tab === t ? "bg-foreground text-background" : "bg-secondary text-foreground"
            }`}
          >
            {t === "live" ? `En direct (${stats.live})` : `Terminés (${polls.length - stats.live})`}
          </button>
        ))}
      </div>

      <ul className="space-y-4 px-4 pt-4">
        {filtered.length === 0 ? (
          <li className="rounded-3xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Aucun sondage {tab === "live" ? "en cours" : "terminé"}.
          </li>
        ) : (
          filtered.map((p) => {
            const total = p.options.reduce((a, o) => a + o.votes, 0) || 1;
            const isLive = p.status === "live";
            const winner = [...p.options].sort((a, b) => b.votes - a.votes)[0];
            return (
              <li key={p.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
                <div className="flex items-start justify-between gap-3 border-b border-border/50 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {isLive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Live
                        </span>
                      ) : (
                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                          Terminé
                        </span>
                      )}
                      {p.timeLeft && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" /> {p.timeLeft}
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground">· {p.totalVoters} votants</span>
                    </div>
                    <p className="mt-1.5 font-serif text-lg leading-tight">{p.question}</p>
                  </div>
                </div>

                <ul className="space-y-2 p-4">
                  {p.options.map((o) => {
                    const pct = Math.round((o.votes / total) * 100);
                    const chosen = p.userVote === o.id;
                    const isWinner = !isLive && o.id === winner.id;
                    const showResults = Boolean(p.userVote) || !isLive;
                    return (
                      <li key={o.id}>
                        <button
                          disabled={Boolean(p.userVote) || !isLive}
                          onClick={() => vote(p.id, o.id)}
                          className={`relative w-full overflow-hidden rounded-2xl border px-4 py-3 text-left transition-colors ${
                            chosen
                              ? "border-primary bg-primary/5"
                              : isWinner
                              ? "border-amber-500/60 bg-amber-500/5"
                              : "border-border bg-background hover:border-primary/40"
                          } ${!isLive || p.userVote ? "cursor-default" : "cursor-pointer"}`}
                        >
                          {showResults && (
                            <div
                              className={`absolute inset-y-0 left-0 ${
                                chosen ? "bg-primary/15" : isWinner ? "bg-amber-500/15" : "bg-secondary"
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          )}
                          <div className="relative flex items-center gap-3">
                            <span className="text-xl">{o.emoji}</span>
                            <span className="flex-1 text-sm font-medium">{o.label}</span>
                            {showResults ? (
                              <>
                                <span className="text-xs text-muted-foreground">{o.votes}</span>
                                <span className="w-10 text-right text-sm font-semibold">{pct}%</span>
                                {chosen && <Check className="h-4 w-4 text-primary" />}
                                {isWinner && !chosen && <TrendingUp className="h-4 w-4 text-amber-600" />}
                              </>
                            ) : (
                              <span className="rounded-full border border-border px-3 py-1 text-[10px] font-semibold">
                                Voter
                              </span>
                            )}
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {p.userVote && isLive && (
                  <p className="border-t border-border/40 bg-primary/5 px-4 py-2.5 text-center text-[11px] font-medium text-primary">
                    Merci pour votre vote — les résultats s'actualisent en direct.
                  </p>
                )}
              </li>
            );
          })
        )}
      </ul>

      <section className="mx-4 mt-6">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Modèles rapides</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {templates.map((t) => (
            <button key={t.label} className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-left">
              <span className="text-lg">{t.emoji}</span>
              <span className="text-xs font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </section>

      <button className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow">
        <Plus className="h-4 w-4" /> Créer un sondage
      </button>

      <p className="mt-8 flex items-center justify-center gap-1.5 px-4 text-center text-[10px] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-primary" /> Diffusez le résultat à l'écran pendant le live
      </p>
      <span className="sr-only"><Users className="inline h-3 w-3" /></span>
    </div>
  );
}
