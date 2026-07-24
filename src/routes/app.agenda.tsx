import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, MapPin, Clock, Radio, Bell, Plus, Filter } from "lucide-react";
import { useMemo, useState } from "react";
import { events, eventTypeIcons } from "@/lib/mock-data";

export const Route = createFileRoute("/app/agenda")({
  component: Agenda,
  head: () => ({
    meta: [
      { title: "Mon agenda · Memento Live" },
      { name: "description", content: "Retrouvez tous vos événements et ceux auxquels vous êtes invité·e dans une vue calendrier claire." },
      { property: "og:title", content: "Mon agenda · Memento Live" },
      { property: "og:description", content: "Votre calendrier Memento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface AgendaItem {
  slug: string;
  title: string;
  type: string;
  date: Date;
  time: string;
  venue: string;
  city: string;
  role: "host" | "guest";
  status: "confirmed" | "pending" | "live";
  cover: string;
}

function daysBetween(a: Date, b: Date) {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function fmtMonth(d: Date) {
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}
function fmtDay(d: Date) {
  return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
}

function buildAgenda(): AgendaItem[] {
  const now = new Date();
  const roles: Array<AgendaItem["role"]> = ["host", "guest", "guest", "host", "guest", "guest"];
  const statuses: Array<AgendaItem["status"]> = ["confirmed", "confirmed", "pending", "live", "confirmed", "confirmed"];
  const offsets = [1, 12, 34, 0, -14, 62];
  return events.slice(0, 6).map((e, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() + offsets[i]);
    return {
      slug: e.slug,
      title: e.title,
      type: e.type,
      date: d,
      time: e.time ?? "14 h 30",
      venue: e.venue,
      city: e.city,
      role: roles[i],
      status: statuses[i],
      cover: e.coverImage,
    };
  });
}

function Agenda() {
  const [view, setView] = useState<"list" | "month">("list");
  const [filter, setFilter] = useState<"all" | "host" | "guest">("all");
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));

  const items = useMemo(buildAgenda, []);
  const filtered = filter === "all" ? items : items.filter((i) => i.role === filter);
  const now = new Date();

  const upcoming = filtered
    .filter((i) => i.status !== "confirmed" || i.date >= new Date(now.getTime() - 86400000))
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  const past = filtered.filter((i) => i.date < new Date(now.getTime() - 86400000)).sort((a, b) => b.date.getTime() - a.date.getTime());
  const nextLive = upcoming.find((i) => i.status === "live");
  const nextItem = upcoming[0];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mon agenda</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 text-primary" /> Vos rendez-vous à venir
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Tous vos<br />moments précieux</h1>

        {nextItem && (
          <Link
            to="/events/$slug"
            params={{ slug: nextItem.slug }}
            className="mt-5 flex items-stretch gap-3 overflow-hidden rounded-3xl bg-card shadow-card"
          >
            <img src={nextItem.cover} alt="" className="h-24 w-24 shrink-0 object-cover" />
            <div className="flex min-w-0 flex-1 flex-col justify-center py-3 pr-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {nextItem.status === "live" ? "En direct maintenant" : daysBetween(now, nextItem.date) <= 0 ? "Aujourd'hui" : `Dans ${daysBetween(now, nextItem.date)} jours`}
              </span>
              <p className="mt-0.5 truncate font-serif text-lg">{nextItem.title}</p>
              <p className="mt-0.5 flex items-center gap-1 truncate text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" /> {nextItem.venue} · {nextItem.city}
              </p>
            </div>
          </Link>
        )}
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex gap-1 rounded-full bg-secondary p-1">
            {(["list", "month"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
                  view === v ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {v === "list" ? "Liste" : "Mois"}
              </button>
            ))}
          </div>
          <div className="scrollbar-none ml-auto flex gap-1.5 overflow-x-auto">
            {(["all", "host", "guest"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                  filter === f ? "border-foreground bg-foreground text-background" : "border-border bg-card"
                }`}
              >
                {f === "all" ? "Tous" : f === "host" ? "Organisés" : "Invité·e"}
              </button>
            ))}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
              <Filter className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>

      {view === "list" ? (
        <div className="px-4 pt-4">
          {nextLive && (
            <div className="mb-4 flex items-center gap-3 rounded-3xl border border-destructive/40 bg-destructive/5 p-3.5">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-destructive text-white">
                <Radio className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-destructive">En direct</p>
                <p className="truncate text-sm font-semibold">{nextLive.title}</p>
              </div>
              <Link
                to="/events/$slug/live"
                params={{ slug: nextLive.slug }}
                className="rounded-full bg-destructive px-3 py-1.5 text-[11px] font-bold text-white"
              >
                Rejoindre
              </Link>
            </div>
          )}

          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">À venir ({upcoming.length})</p>
          <ul className="space-y-2">
            {upcoming.map((it) => (
              <AgendaCard key={it.slug} item={it} now={now} />
            ))}
          </ul>

          {past.length > 0 && (
            <>
              <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passés</p>
              <ul className="space-y-2 opacity-80">
                {past.map((it) => (
                  <AgendaCard key={it.slug} item={it} now={now} />
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-2 py-2">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-background"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-serif text-lg capitalize">{fmtMonth(cursor)}</p>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="grid h-8 w-8 place-items-center rounded-full hover:bg-background"
              aria-label="Mois suivant"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1">
            {(() => {
              const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
              const startWeekday = (first.getDay() + 6) % 7;
              const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
              const cells: React.ReactNode[] = [];
              for (let i = 0; i < startWeekday; i++) cells.push(<div key={`e${i}`} />);
              for (let d = 1; d <= daysInMonth; d++) {
                const day = new Date(cursor.getFullYear(), cursor.getMonth(), d);
                const dayEvents = items.filter(
                  (e) => e.date.toDateString() === day.toDateString(),
                );
                const isToday = day.toDateString() === now.toDateString();
                cells.push(
                  <div
                    key={d}
                    className={`aspect-square rounded-xl p-1 text-left ${
                      isToday ? "bg-primary text-primary-foreground" : dayEvents.length ? "bg-primary/10" : "bg-card"
                    }`}
                  >
                    <p className={`text-[10px] font-semibold ${isToday ? "" : "text-foreground"}`}>{d}</p>
                    <div className="mt-0.5 flex flex-wrap gap-0.5">
                      {dayEvents.slice(0, 3).map((e) => (
                        <span key={e.slug} className={`h-1.5 w-1.5 rounded-full ${isToday ? "bg-primary-foreground" : "bg-primary"}`} />
                      ))}
                    </div>
                  </div>,
                );
              }
              return cells;
            })()}
          </div>

          <ul className="mt-6 space-y-2">
            {items
              .filter((it) => it.date.getMonth() === cursor.getMonth() && it.date.getFullYear() === cursor.getFullYear())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .map((it) => (
                <AgendaCard key={it.slug} item={it} now={now} />
              ))}
            {items.filter((it) => it.date.getMonth() === cursor.getMonth() && it.date.getFullYear() === cursor.getFullYear()).length === 0 && (
              <li className="rounded-3xl border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
                Aucun événement ce mois-ci.
              </li>
            )}
          </ul>
        </div>
      )}

      <Link
        to="/app/create"
        className="fixed bottom-24 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Nouvel événement
      </Link>
    </div>
  );
}

function AgendaCard({ item, now }: { item: AgendaItem; now: Date }) {
  const emoji = eventTypeIcons[item.type as keyof typeof eventTypeIcons] ?? "🎉";
  const diff = daysBetween(now, item.date);
  const isPast = diff < 0;
  const isLive = item.status === "live";

  return (
    <li>
      <Link
        to="/events/$slug"
        params={{ slug: item.slug }}
        className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 shadow-sm"
      >
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary text-2xl">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                item.role === "host" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              {item.role === "host" ? "J'organise" : "Invité·e"}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Live
              </span>
            )}
            {item.status === "pending" && (
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                RSVP à faire
              </span>
            )}
          </div>
          <p className="mt-1 truncate text-sm font-semibold">{item.title}</p>
          <p className="mt-0.5 flex items-center gap-2 truncate text-[11px] text-muted-foreground">
            <span className="capitalize">{fmtDay(item.date)}</span>
            <span>·</span>
            <Clock className="h-3 w-3" />
            {item.time}
          </p>
        </div>
        <div className="text-right">
          <p className={`font-serif text-lg leading-none ${isLive ? "text-destructive" : isPast ? "text-muted-foreground" : diff <= 7 ? "text-primary" : ""}`}>
            {isPast ? `-${Math.abs(diff)}j` : isLive ? "Live" : diff === 0 ? "J" : `J-${diff}`}
          </p>
        </div>
      </Link>
    </li>
  );
}
