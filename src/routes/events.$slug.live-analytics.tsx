import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Radio, Users, TrendingUp, Eye, Heart, MessageCircle, Globe2, Signal, AlertTriangle, Zap } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/events/$slug/live-analytics")({
  component: LiveAnalytics,
  head: () => ({
    meta: [
      { title: "Analytics du live · Memento Live" },
      { name: "description", content: "Statistiques en temps réel de votre diffusion : audience, engagement, qualité du signal et pics d'émotions." },
      { property: "og:title", content: "Analytics du live · Memento Live" },
      { property: "og:description", content: "Pilotez votre diffusion en direct." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const cities = [
  { name: "Paris", pct: 42, viewers: 28 },
  { name: "Lyon", pct: 18, viewers: 12 },
  { name: "Bordeaux", pct: 12, viewers: 8 },
  { name: "Marseille", pct: 9, viewers: 6 },
  { name: "Bruxelles", pct: 7, viewers: 5 },
  { name: "Autres", pct: 12, viewers: 9 },
];

const moments = [
  { t: "14:32", label: "Entrée des mariés", peak: 68 },
  { t: "14:58", label: "Échange des vœux", peak: 82 },
  { t: "15:14", label: "Premier baiser", peak: 91 },
  { t: "15:20", label: "Sortie sous les pétales", peak: 74 },
];

function LiveAnalytics() {
  const { slug } = useParams({ from: "/events/$slug/live-analytics" });
  const [viewers, setViewers] = useState(68);
  const [hearts, setHearts] = useState(1284);
  const [messages, setMessages] = useState(96);
  const [signal] = useState<"excellent" | "good" | "warn">("excellent");
  const [curve, setCurve] = useState<number[]>([32, 38, 45, 52, 48, 55, 62, 68, 72, 78, 82, 68]);

  useEffect(() => {
    const t = setInterval(() => {
      setViewers((v) => Math.max(50, Math.min(95, v + Math.round((Math.random() - 0.5) * 6))));
      setHearts((h) => h + Math.floor(Math.random() * 12));
      setMessages((m) => m + (Math.random() > 0.6 ? 1 : 0));
      setCurve((c) => [...c.slice(1), Math.max(30, Math.min(95, c[c.length - 1] + Math.round((Math.random() - 0.5) * 12)))]);
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const max = Math.max(...curve);
  const min = Math.min(...curve);
  const points = curve
    .map((v, i) => {
      const x = (i / (curve.length - 1)) * 100;
      const y = 100 - ((v - min) / Math.max(1, max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug/live" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Analytics live</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[10px] font-bold text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
        </span>
      </div>

      <section className="bg-gradient-to-b from-destructive/10 to-transparent px-4 pb-6 pt-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Radio className="h-3.5 w-3.5 text-destructive" /> Depuis 47 minutes
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Diffusion<br />en direct</h1>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <StatCard icon={Users} value={viewers} label="Spectateurs" pulse />
          <StatCard icon={Heart} value={hearts.toLocaleString("fr-FR")} label="Réactions" />
          <StatCard icon={MessageCircle} value={messages} label="Messages" />
        </div>
      </section>

      <section className="px-4">
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Audience en direct</p>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
              <TrendingUp className="h-3 w-3" /> +18% vs il y a 5 min
            </span>
          </div>
          <div className="mt-4 h-32 w-full">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
              <defs>
                <linearGradient id="lg" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polygon fill="url(#lg)" points={`0,100 ${points} 100,100`} />
              <polyline fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" points={points} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-[9px] uppercase tracking-wider text-muted-foreground">
            <span>-30 min</span>
            <span>-15 min</span>
            <span>Maintenant</span>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Globe2 className="h-3.5 w-3.5" /> Provenance
        </p>
        <ul className="space-y-2.5 rounded-3xl border border-border/60 bg-card p-4">
          {cities.map((c) => (
            <li key={c.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold">{c.name}</span>
                <span className="text-muted-foreground">{c.viewers} · {c.pct}%</span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-secondary">
                <div className="h-full rounded-full bg-primary" style={{ width: `${c.pct}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <Zap className="h-3.5 w-3.5 text-accent" /> Pics d'émotions
        </p>
        <ul className="space-y-2">
          {moments.map((m) => (
            <li key={m.t} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
              <span className="grid h-10 w-14 shrink-0 place-items-center rounded-xl bg-secondary font-mono text-xs font-bold">
                {m.t}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{m.label}</p>
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-1.5 flex-1 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${m.peak}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-accent">{m.peak}</span>
                </div>
              </div>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 px-4">
        <div
          className={`flex items-center gap-3 rounded-3xl border p-4 ${
            signal === "excellent"
              ? "border-primary/30 bg-primary/5"
              : signal === "good"
                ? "border-amber-400/30 bg-amber-500/5"
                : "border-destructive/30 bg-destructive/5"
          }`}
        >
          <Signal className={`h-5 w-5 ${signal === "excellent" ? "text-primary" : signal === "good" ? "text-amber-600" : "text-destructive"}`} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wider">Qualité du signal</p>
            <p className="text-[11px] text-muted-foreground">1080p · 48 Mbps · 24 ms de latence · 0.2% de pertes</p>
          </div>
          <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
            Excellent
          </span>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-secondary/60 p-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-[11px] text-muted-foreground">
            3 spectateurs signalent un léger décalage audio. Reconnectez-les si le problème persiste.
          </p>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, pulse }: { icon: typeof Users; value: string | number; label: string; pulse?: boolean }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {pulse && <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />}
      </div>
      <p className="mt-2 font-serif text-2xl leading-none">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}
