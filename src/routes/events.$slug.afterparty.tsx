import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Clock, Music, Sparkles, Lock, Unlock, Users, Wine, Shirt, Car } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/events/$slug/afterparty")({
  component: Afterparty,
  head: () => ({
    meta: [
      { title: "After-party · MaFeliza" },
      { name: "description", content: "Une seconde partie de nuit prolonge la fête. Adresse dévoilée à minuit." },
      { property: "og:title", content: "After-party · MaFeliza" },
      { property: "og:description", content: "La fête continue jusqu'à l'aube." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const info = [
  { icon: Clock, label: "Ouverture", value: "00 h 00 → 05 h 00" },
  { icon: MapPin, label: "Lieu", value: "Adresse dévoilée à minuit" },
  { icon: Music, label: "DJ", value: "Léa B. · House & Disco vintage" },
  { icon: Shirt, label: "Dress code", value: "Blanc, doré, paillettes" },
];

const setlist = [
  { time: "00:00 - 01:00", theme: "Warm-up soul", color: "from-amber-200 to-amber-400" },
  { time: "01:00 - 02:30", theme: "Disco vintage", color: "from-fuchsia-300 to-pink-500" },
  { time: "02:30 - 04:00", theme: "House chaloupée", color: "from-violet-400 to-indigo-500" },
  { time: "04:00 - 05:00", theme: "Ambient sunrise", color: "from-orange-300 to-rose-400" },
];

const rules = [
  "Réservé aux 25-99 ans (les enfants dorment 😴).",
  "Vestiaire gratuit à l'entrée, pensez à des chaussures confortables.",
  "Cocktails maison offerts, bar payant après 3 h.",
  "Photos autorisées, story public·que·s après validation des mariés.",
];

const carpool = [
  { name: "Emma L.", seats: 3, from: "Domaine → After" },
  { name: "Julien P.", seats: 2, from: "Parking sud → After" },
];

function Afterparty() {
  const { slug } = useParams({ from: "/events/$slug/afterparty" });
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const midnight = new Date();
  midnight.setHours(23, 59, 59, 0);
  if (midnight.getTime() < now.getTime()) midnight.setDate(midnight.getDate() + 1);
  const diff = Math.max(0, midnight.getTime() - now.getTime());
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1000);
  const unlocked = h === 0 && m === 0 && s === 0;

  const [rsvp, setRsvp] = useState<"yes" | "no" | null>(null);
  const confirmed = 42;

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">After-party</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900 via-violet-900 to-slate-950" />
        <div className="absolute -left-8 top-10 h-40 w-40 rounded-full bg-primary/40 blur-3xl" />
        <div className="absolute right-0 top-24 h-48 w-48 rounded-full bg-amber-400/30 blur-3xl" />

        <div className="relative px-4 py-10 text-white">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur">
            <Sparkles className="h-3 w-3" /> Événement privé
          </span>
          <h1 className="mt-3 font-serif text-4xl leading-tight">
            La nuit ne fait<br />que commencer
          </h1>
          <p className="mt-2 max-w-xs text-sm text-white/80">
            Une seconde partie, plus intime, pour ceux qui veulent danser jusqu'au petit matin.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { v: h, l: "Heures" },
              { v: m, l: "Minutes" },
              { v: s, l: "Secondes" },
            ].map((u) => (
              <div key={u.l} className="rounded-2xl bg-white/15 py-3 text-center backdrop-blur-md">
                <p className="font-serif text-3xl tabular-nums leading-none">{String(u.v).padStart(2, "0")}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">{u.l}</p>
              </div>
            ))}
          </div>
          <p className="mt-2 text-center text-[10px] text-white/60">Avant révélation du lieu secret</p>
        </div>
      </section>

      <section className="px-4 pt-6">
        <ul className="space-y-2">
          {info.map((i) => {
            const Icon = i.icon;
            const locked = i.label === "Lieu" && !unlocked;
            return (
              <li key={i.label} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{i.label}</p>
                  <p className={`truncate text-sm font-semibold ${locked ? "blur-sm select-none" : ""}`}>
                    {locked ? "Rooftop Le Perchoir — Paris 11" : i.value}
                  </p>
                </div>
                {locked && <Lock className="h-4 w-4 text-muted-foreground" />}
                {!locked && i.label === "Lieu" && <Unlock className="h-4 w-4 text-primary" />}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <p className="text-sm font-bold">Vous en êtes ?</p>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {confirmed} personnes ont déjà confirmé — 38 places restantes.
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setRsvp("yes")}
            className={`flex-1 rounded-full py-3 text-xs font-bold transition-colors ${
              rsvp === "yes" ? "bg-primary text-primary-foreground shadow-glow" : "bg-secondary"
            }`}
          >
            🎉 J'y serai
          </button>
          <button
            onClick={() => setRsvp("no")}
            className={`flex-1 rounded-full py-3 text-xs font-semibold transition-colors ${
              rsvp === "no" ? "bg-foreground text-background" : "bg-secondary"
            }`}
          >
            Pas cette fois
          </button>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Setlist par bloc horaire</p>
        <ul className="mt-3 space-y-2">
          {setlist.map((s) => (
            <li key={s.time} className={`overflow-hidden rounded-2xl bg-gradient-to-r ${s.color} p-3.5 text-white shadow-sm`}>
              <p className="font-mono text-[10px] uppercase tracking-wider text-white/80">{s.time}</p>
              <p className="mt-0.5 font-serif text-lg leading-tight">{s.theme}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Règles du jeu</p>
        <ul className="mt-3 space-y-1.5">
          {rules.map((r) => (
            <li key={r} className="flex items-start gap-2 rounded-2xl bg-secondary/60 p-3 text-[12px]">
              <Wine className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Covoiturage jusqu'à l'after</p>
          <Link to="/events/$slug/carpool" params={{ slug }} className="text-[11px] font-semibold text-primary">
            Voir tout
          </Link>
        </div>
        <ul className="mt-3 space-y-2">
          {carpool.map((c) => (
            <li key={c.name} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/40 text-primary">
                <Car className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.from}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold text-primary">
                {c.seats} places
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
