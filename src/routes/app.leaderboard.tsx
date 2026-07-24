import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trophy, Medal, Crown, Star, Flame, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/leaderboard")({
  component: Leaderboard,
  head: () => ({
    meta: [
      { title: "Classement Memento · Meilleurs contributeurs" },
      { name: "description", content: "Découvrez les invités les plus actifs, les événements les plus vivants et grimpez dans le classement." },
      { property: "og:title", content: "Classement · Memento Live" },
      { property: "og:description", content: "Une compétition douce entre passionnés." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Row = {
  rank: number;
  name: string;
  role: string;
  avatar: string;
  points: number;
  streak: number;
  badges: number;
  trend: "up" | "down" | "flat";
  me?: boolean;
};

const globalRows: Row[] = [
  { rank: 1, name: "Léa Durand", role: "Wedding planner", avatar: "https://i.pravatar.cc/80?img=44", points: 8420, streak: 45, badges: 24, trend: "up" },
  { rank: 2, name: "Julien Mercier", role: "Photographe", avatar: "https://i.pravatar.cc/80?img=12", points: 7180, streak: 32, badges: 21, trend: "up" },
  { rank: 3, name: "Camille Rousseau", role: "Musicien", avatar: "https://i.pravatar.cc/80?img=32", points: 6540, streak: 28, badges: 19, trend: "flat" },
  { rank: 4, name: "Antoine Kessler", role: "Officiant laïque", avatar: "https://i.pravatar.cc/80?img=13", points: 5920, streak: 15, badges: 17, trend: "up" },
  { rank: 5, name: "Nadia Ouali", role: "Traiteur", avatar: "https://i.pravatar.cc/80?img=45", points: 5310, streak: 22, badges: 16, trend: "down" },
  { rank: 6, name: "Sarah B.", role: "Vous", avatar: "https://i.pravatar.cc/80?img=47", points: 4820, streak: 18, badges: 14, trend: "up", me: true },
  { rank: 7, name: "Paul Vasseur", role: "DJ", avatar: "https://i.pravatar.cc/80?img=14", points: 4460, streak: 12, badges: 13, trend: "flat" },
  { rank: 8, name: "Isabelle Bernard", role: "Fleuriste", avatar: "https://i.pravatar.cc/80?img=48", points: 3980, streak: 9, badges: 12, trend: "up" },
];

const friendsRows: Row[] = [
  { rank: 1, name: "Léa Durand", role: "Amie", avatar: "https://i.pravatar.cc/80?img=44", points: 8420, streak: 45, badges: 24, trend: "up" },
  { rank: 2, name: "Sarah B.", role: "Vous", avatar: "https://i.pravatar.cc/80?img=47", points: 4820, streak: 18, badges: 14, trend: "up", me: true },
  { rank: 3, name: "Emma R.", role: "Cousine", avatar: "https://i.pravatar.cc/80?img=48", points: 2140, streak: 6, badges: 9, trend: "up" },
  { rank: 4, name: "Thomas M.", role: "Époux", avatar: "https://i.pravatar.cc/80?img=15", points: 1980, streak: 4, badges: 8, trend: "flat" },
];

const tabs = ["Global", "Amis", "Cette semaine"] as const;

function Leaderboard() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Global");
  const rows = tab === "Amis" ? friendsRows : globalRows;
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Classement</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/15 via-accent/30 to-background px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Trophy className="h-3.5 w-3.5 text-primary" /> Saison 2 · Printemps 26
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Les âmes de la fête</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Chaque souvenir partagé, chaque commentaire, chaque bougie allumée compte.
        </p>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 px-4 pt-4 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1 text-xs font-semibold">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-full py-2 transition ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {podium.length === 3 && (
        <section className="mt-4 px-4">
          <div className="grid grid-cols-3 items-end gap-2">
            {[podium[1], podium[0], podium[2]].map((p, i) => {
              const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
              const height = pos === 1 ? "h-32" : pos === 2 ? "h-24" : "h-20";
              const color = pos === 1 ? "from-primary to-accent" : pos === 2 ? "from-accent to-secondary" : "from-secondary to-secondary";
              return (
                <div key={p.rank} className="flex flex-col items-center">
                  <div className="relative">
                    <img src={p.avatar} alt="" className={`h-16 w-16 rounded-full object-cover ring-4 ${pos === 1 ? "ring-primary" : "ring-accent"}`} />
                    {pos === 1 && (
                      <Crown className="absolute -top-4 left-1/2 h-6 w-6 -translate-x-1/2 text-primary" fill="currentColor" />
                    )}
                  </div>
                  <p className="mt-2 truncate max-w-[6rem] text-center text-[12px] font-semibold">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.points.toLocaleString("fr")} pts</p>
                  <div className={`mt-2 w-full rounded-t-2xl bg-gradient-to-b ${color} ${height} grid place-items-center text-white`}>
                    <span className="font-serif text-2xl">{pos}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section className="mx-4 mt-6 rounded-3xl border border-primary/40 bg-primary/5 p-4">
        <div className="flex items-center gap-3">
          <img src="https://i.pravatar.cc/80?img=47" alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-wider text-primary">Votre position</p>
            <p className="font-serif text-lg leading-tight">6ᵉ · Sarah B.</p>
          </div>
          <div className="text-right">
            <p className="font-serif text-xl leading-none">4 820</p>
            <p className="text-[10px] text-muted-foreground">points</p>
          </div>
        </div>
        <p className="mt-3 flex items-center gap-1 text-[11px] text-muted-foreground">
          <TrendingUp className="h-3 w-3 text-primary" /> +240 pts cette semaine · plus que 490 pts pour dépasser Nadia
        </p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: "68%" }} />
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Suivants</h2>
        <ul className="space-y-2">
          {rest.map((r) => (
            <li
              key={r.rank}
              className={`flex items-center gap-3 rounded-2xl border p-3 ${r.me ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}
            >
              <span className="w-6 text-center font-serif text-lg text-muted-foreground">{r.rank}</span>
              <img src={r.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name} {r.me && <span className="text-primary">· vous</span>}</p>
                <p className="truncate text-[11px] text-muted-foreground">{r.role}</p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                  <Flame className="h-3 w-3 text-primary" /> {r.streak}
                </span>
                <span className="inline-flex items-center gap-0.5 text-muted-foreground">
                  <Medal className="h-3 w-3 text-primary" /> {r.badges}
                </span>
                <span className="w-14 text-right font-serif text-sm">{r.points.toLocaleString("fr")}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Récompenses de saison</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Top 10 · Livre photo Prestige offert</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Fin de saison le 30 juin. Les récompenses sont livrées à domicile.</p>
        <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Users className="h-3 w-3" /> 4 120 participants cette saison
        </p>
      </section>
    </div>
  );
}
