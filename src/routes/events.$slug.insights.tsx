import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, TrendingUp, Users, Camera, MessageSquare, Heart, Sparkles, Award } from "lucide-react";

export const Route = createFileRoute("/events/$slug/insights")({
  component: Insights,
  head: () => ({
    meta: [
      { title: "Insights de l'événement · Memento Live" },
      { name: "description", content: "L'analyse post-événement : engagement, moments forts, contributeurs et sentiments." },
      { property: "og:title", content: "Insights · Memento Live" },
      { property: "og:description", content: "Comprendre ce qui a rendu ce jour unique." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const kpis = [
  { icon: Users, label: "Invités actifs", value: "112", delta: "+8", tint: "text-primary" },
  { icon: Camera, label: "Souvenirs", value: "2 148", delta: "+312 aujourd'hui", tint: "text-emerald-600" },
  { icon: MessageSquare, label: "Messages", value: "3 402", delta: "pic à 22h30", tint: "text-sky-600" },
  { icon: Heart, label: "Réactions", value: "9 187", delta: "+18% vs référence", tint: "text-rose-600" },
];

const hours = [
  { h: "14h", v: 12 }, { h: "15h", v: 28 }, { h: "16h", v: 52 }, { h: "17h", v: 68 },
  { h: "18h", v: 74 }, { h: "19h", v: 82 }, { h: "20h", v: 88 }, { h: "21h", v: 94 },
  { h: "22h", v: 100 }, { h: "23h", v: 92 }, { h: "0h", v: 78 }, { h: "1h", v: 46 },
];

const moments = [
  { time: "17:12", label: "Sortie de cérémonie", score: 96, emoji: "💒" },
  { time: "19:30", label: "Portraits golden hour", score: 92, emoji: "✨" },
  { time: "22:15", label: "Première danse", score: 100, emoji: "💃" },
  { time: "23:03", label: "Discours du père", score: 88, emoji: "🎩" },
  { time: "00:47", label: "Ovation cousins", score: 84, emoji: "🎤" },
];

const contributors = [
  { name: "Julie", role: "Témoin", points: 428, badge: "🥇" },
  { name: "Antoine", role: "Frère", points: 356, badge: "🥈" },
  { name: "Camille", role: "Cousine", points: 291, badge: "🥉" },
  { name: "Léa", role: "Sœur du marié", points: 244 },
  { name: "Michel", role: "Père", points: 187 },
];

const sentiments = [
  { label: "Émotion", pct: 42, color: "bg-rose-400" },
  { label: "Joie", pct: 34, color: "bg-amber-400" },
  { label: "Rire", pct: 16, color: "bg-primary" },
  { label: "Tendresse", pct: 8, color: "bg-sky-400" },
];

function Insights() {
  const { slug } = useParams({ from: "/events/$slug/insights" });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Insights</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <TrendingUp className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Bilan complet
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">La journée<br />en chiffres tendres</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Chaque métrique est réversible : un chiffre représente une émotion partagée, jamais une performance.
        </p>
      </section>

      <section className="px-4 pt-6">
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <div key={k.label} className="rounded-2xl border border-border/60 bg-card p-3">
                <Icon className={`h-4 w-4 ${k.tint}`} />
                <p className="mt-2 font-serif text-2xl leading-none">{k.value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
                <p className="mt-1 text-[10px] text-emerald-600">{k.delta}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Activité au fil des heures</h2>
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex h-32 items-end gap-1.5">
            {hours.map((h) => (
              <div key={h.h} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-primary to-accent"
                  style={{ height: `${h.v}%`, minHeight: "4px" }}
                />
                <span className="text-[8px] text-muted-foreground">{h.h}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            Pic d'engagement à <span className="font-serif text-foreground">22h</span> — première danse.
          </p>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Moments forts détectés</h2>
        <ul className="space-y-2">
          {moments.map((m) => (
            <li key={m.time} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/40 text-2xl">
                {m.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[14px] leading-tight">{m.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{m.time}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${m.score}%` }} />
                </div>
              </div>
              <span className="shrink-0 font-serif text-lg text-primary">{m.score}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 flex items-center gap-1.5 font-serif text-lg">
          <Award className="h-4 w-4 text-primary" /> Contributeurs
        </h2>
        <ul className="space-y-2">
          {contributors.map((c, i) => (
            <li key={c.name} className={`flex items-center gap-3 rounded-2xl border p-3 ${
              i < 3 ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"
            }`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-secondary text-lg">
                {c.badge ?? String(i + 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-[14px] leading-tight">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{c.role}</p>
              </div>
              <span className="shrink-0 font-serif text-base text-primary">{c.points} pts</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Ambiance ressentie</h2>
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex h-8 overflow-hidden rounded-full">
            {sentiments.map((s) => (
              <div
                key={s.label}
                className={`${s.color} grid place-items-center text-[10px] font-bold text-white`}
                style={{ width: `${s.pct}%` }}
              >
                {s.pct}%
              </div>
            ))}
          </div>
          <ul className="mt-3 space-y-1">
            {sentiments.map((s) => (
              <li key={s.label} className="flex items-center gap-2 text-[12px]">
                <span className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="flex-1">{s.label}</span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-4 mt-6 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Rapport complet</p>
        <p className="mt-2 font-serif text-lg leading-tight">42 pages illustrées</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Un PDF haut de gamme à conserver — statistiques, mots-clés, tags émotionnels.
        </p>
        <button className="mt-3 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          Télécharger le rapport
        </button>
      </section>
    </div>
  );
}
