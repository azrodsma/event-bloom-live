import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { ChevronLeft, TrendingUp, Users, Heart, MessageCircle, Camera, Gift, Radio, Eye, Download } from "lucide-react";

export const Route = createFileRoute("/events/$slug/dashboard")({
  head: ({ params }) => ({
    meta: [
      { title: "Tableau de bord — Memento Live" },
      { name: "description", content: `Statistiques de l'événement ${params.slug}.` },
    ],
  }),
  loader: async ({ params }) => {
    const { getEventBySlug } = await import("@/lib/events.functions");
    const { adaptEvent } = await import("@/lib/event-adapter");
    const { getEventStats } = await import("@/lib/stats.functions");
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, stats: null as Awaited<ReturnType<typeof getEventStats>> | null };
    }
    const stats = await getEventStats({ data: { eventId: db.id } });
    return { event: adaptEvent(db), stats };
  },
  component: Dashboard,
});

function Dashboard() {
  const { event, stats } = Route.useLoaderData();
  const chartData = stats?.activity ?? Array.from({ length: 12 }, (_, i) => ({ label: `J-${11 - i}`, value: 0 }));
  const max = Math.max(1, ...chartData.map((d) => d.value));
  const topContributors = stats?.topContributors ?? [];
  const potPercent = event.moneyPot
    ? Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)
    : 0;


  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link
          to="/events/$slug"
          params={{ slug: event.slug }}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">Tableau de bord</p>
          <p className="truncate text-[11px] text-muted-foreground">{event.title}</p>
        </div>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface" aria-label="Exporter">
          <Download className="h-4 w-4" />
        </button>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        {/* Live status */}
        {event.isLive && (
          <section className="animate-pulse-live rounded-3xl bg-gradient-live p-4 text-white shadow-glow">
            <div className="flex items-center gap-3">
              <Radio className="h-5 w-5" />
              <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-widest">● En direct</p>
                <p className="font-serif text-xl">{event.viewers?.toLocaleString("fr-FR")} spectateurs</p>
              </div>
              <Link
                to="/events/$slug/live"
                params={{ slug: event.slug }}
                className="rounded-full bg-white/25 px-3 py-1.5 text-xs font-semibold backdrop-blur"
              >
                Voir →
              </Link>
            </div>
          </section>
        )}

        {/* KPI grid */}
        <section className="grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: "Invités confirmés", value: String(stats?.guestsConfirmed ?? 0), trend: `${stats?.guestsTotal ?? 0} total`, tone: "primary" as const },
            { icon: Heart, label: "Réactions live", value: "—", trend: "24h", tone: "live" as const },
            { icon: Camera, label: "Photos album", value: String(stats?.photos ?? 0), trend: "en direct", tone: "gold" as const },
            { icon: MessageCircle, label: "Mots du livre d'or", value: String(stats?.guestbook ?? 0), trend: "en direct", tone: "primary" as const },
          ].map((k) => (
            <div key={k.label} className="rounded-3xl bg-surface p-4 shadow-card">
              <div className="flex items-center justify-between">
                <div className={`grid h-9 w-9 place-items-center rounded-2xl ${
                  k.tone === "live" ? "bg-live/10 text-live" : k.tone === "gold" ? "bg-gold-light text-gold" : "bg-primary-light text-primary"
                }`}>
                  <k.icon className="h-4 w-4" />
                </div>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary-light px-2 py-0.5 text-[10px] font-bold text-primary">
                  <TrendingUp className="h-3 w-3" /> {k.trend}
                </span>
              </div>
              <p className="mt-3 font-serif text-3xl leading-none">{k.value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">{k.label}</p>
            </div>
          ))}
        </section>

        {/* Chart */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Engagement</p>
              <p className="font-serif text-2xl">Activité des 12 derniers jours</p>
            </div>
            <span className="rounded-full bg-primary-light px-3 py-1 text-[10px] font-bold uppercase text-primary">+68%</span>
          </div>
          <div className="mt-5 flex h-32 items-end gap-1.5">
            {chartData.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-lg bg-gradient-primary transition-all"
                  style={{ height: `${(v / max) * 100}%` }}
                />
                <span className="text-[9px] text-muted-foreground">J-{12 - i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Money pot */}
        {event.moneyPot && (
          <section className="rounded-3xl bg-surface p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gold-light text-gold">
                <Gift className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cagnotte {event.moneyPot.platform}</p>
                <p className="font-serif text-xl">
                  {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </p>
              </div>
              <span className="font-serif text-2xl text-gold">{Math.round(potPercent)}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-light">
              <div className="h-full rounded-full bg-gradient-to-r from-gold to-primary" style={{ width: `${potPercent}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-serif text-lg">32</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contributeurs</p>
              </div>
              <div>
                <p className="font-serif text-lg">85 €</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Don moyen</p>
              </div>
              <div>
                <p className="font-serif text-lg">3</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Jours restants</p>
              </div>
            </div>
          </section>
        )}

        {/* Top contributors */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Invités les plus actifs</p>
          <ul className="mt-3 space-y-2">
            {[
              { name: "Emma L.", role: "Témoin", posts: 42, avatar: 12 },
              { name: "Lucas M.", role: "Frère", posts: 28, avatar: 25 },
              { name: "Marie D.", role: "Amie", posts: 19, avatar: 47 },
              { name: "Julien R.", role: "Cousin", posts: 15, avatar: 15 },
            ].map((c, i) => (
              <li key={c.name} className="flex items-center gap-3 rounded-2xl p-2 hover:bg-background">
                <span className="w-4 text-center font-serif text-lg text-muted-foreground">{i + 1}</span>
                <img src={`https://i.pravatar.cc/80?img=${c.avatar}`} alt="" className="h-9 w-9 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.role}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <Camera className="h-3 w-3" /> {c.posts}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Audience */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Audience du live</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-background p-3">
              <Eye className="h-4 w-4 text-primary" />
              <p className="mt-2 font-serif text-xl">1 248</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Vues uniques</p>
            </div>
            <div className="rounded-2xl bg-background p-3">
              <Users className="h-4 w-4 text-primary" />
              <p className="mt-2 font-serif text-xl">14 min</p>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Temps moyen</p>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {[
              { country: "🇫🇷 France", percent: 68 },
              { country: "🇧🇪 Belgique", percent: 14 },
              { country: "🇨🇦 Canada", percent: 9 },
              { country: "🌍 Autres", percent: 9 },
            ].map((r) => (
              <div key={r.country}>
                <div className="flex justify-between text-xs">
                  <span>{r.country}</span>
                  <span className="font-semibold">{r.percent}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-primary-light">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${r.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
