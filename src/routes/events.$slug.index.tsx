import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent, eventTypeIcons } from "@/lib/mock-data";
import {
  MapPin,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
  Radio,
  BookHeart,
  Camera,
  Gift,
  Users,
  ExternalLink,
  BarChart3,
  Clock,
  CheckSquare,
  Music2,
  LayoutGrid,
  Wallet,
  QrCode,
  Shirt,
  Map as MapIcon,
  Sparkles,
  MailCheck,
  PackageOpen,
  Car,
  Mic2,
  Baby,
  CloudSun,
  HelpCircle,
  Shield,
  BarChart2,
  Activity,
} from "lucide-react";


import { useEffect, useState } from "react";
import { PostFeed } from "@/components/PostFeed";
import { CagnotteCard } from "@/components/CagnotteCard";



export const Route = createFileRoute("/events/$slug/")({
  head: ({ loaderData }: { loaderData?: { event?: { title?: string; description?: string; cover?: string } } }) => {
    const e = loaderData?.event;
    const title = e?.title ?? "Événement";
    const description = e?.description ?? "Consultez les détails de votre événement privé Memento Live.";
    const meta: Array<Record<string, string>> = [
      { title: `${title} — Memento Live` },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (e?.cover && /^https?:\/\//.test(e.cover)) {
      meta.push({ property: "og:image", content: e.cover });
      meta.push({ name: "twitter:image", content: e.cover });
    }
    return { meta };
  },
  loader: async ({ params }) => {
    const { getEventBySlug } = await import("@/lib/events.functions");
    const { adaptEvent } = await import("@/lib/event-adapter");
    const { getEventStats } = await import("@/lib/stats.functions");
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null, stats: null as Awaited<ReturnType<typeof getEventStats>> | null };
    }
    const stats = await getEventStats({ data: { eventId: db.id } });
    return { event: adaptEvent(db), dbId: db.id, stats };
  },
  component: EventPage,
});


function useCountdown(iso: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(iso).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, done: diff === 0 };
}

function EventPage() {
  const { event, dbId, stats } = Route.useLoaderData();
  const cd = useCountdown(event.date);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Hero */}
      <header className="relative">
        <div className="relative h-[45vh] min-h-[340px] w-full overflow-hidden sm:h-[55vh] sm:min-h-[420px] lg:h-[62vh] lg:max-h-[640px]">
          <img src={event.cover} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/50" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 safe-top">
            <Link to="/app" className="tap grid place-items-center rounded-full bg-white/90 backdrop-blur active:scale-95" aria-label="Retour">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <Link
                to="/events/$slug/story/new"
                params={{ slug: event.slug }}
                className="tap grid place-items-center rounded-full bg-white/90 backdrop-blur active:scale-95"
                aria-label="Publier une story"
              >
                <Camera className="h-4 w-4" />
              </Link>
              <Link
                to="/events/$slug/invite"
                params={{ slug: event.slug }}
                className="tap grid place-items-center rounded-full bg-white/90 backdrop-blur active:scale-95"
                aria-label="Partager"
              >
                <Share2 className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <div className="container-app">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold">
                  {eventTypeIcons[event.type as keyof typeof eventTypeIcons]} {event.type}
                </span>
                {event.isLive && (
                  <span className="animate-pulse-live rounded-full bg-live px-3 py-1 text-xs font-bold uppercase text-white">
                    ● Live · {event.viewers?.toLocaleString("fr-FR")} spectateurs
                  </span>
                )}
              </div>
              <h1 className="mt-3 font-serif text-fluid-hero text-balance text-foreground">{event.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground/80">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{event.venue}, {event.city}</span>
                <span className="inline-flex items-center gap-1.5"><Calendar className="h-4 w-4" />
                  {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container-app grid gap-5 py-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-8 lg:py-10">
        <div className="min-w-0 space-y-5">
        {/* Description */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-sm leading-relaxed text-foreground">{event.description}</p>
        </section>

        {dbId && <PostFeed eventId={dbId} />}


        {event.moneyPot && (
          <CagnotteCard
            url={event.moneyPot.url}
            goal={event.moneyPot.target}
            current={event.moneyPot.current}
          />
        )}




        {/* Live block */}
        {event.livestream && (
          <Link
            to="/events/$slug/live"
            params={{ slug: event.slug }}
            className="block overflow-hidden rounded-3xl bg-gradient-live p-5 text-white shadow-glow"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                <Radio className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest">
                  {event.isLive ? "En direct maintenant" : "Live prévu"}
                </p>
                <p className="mt-0.5 font-serif text-xl">Rejoindre la diffusion</p>
                <p className="mt-0.5 text-xs opacity-90">
                  Via {event.livestream.platform} · Chat, réactions, cagnotte
                </p>
              </div>
              {event.isLive && (
                <div className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold backdrop-blur">
                  <Users className="h-3 w-3" /> {event.viewers?.toLocaleString("fr-FR")}
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Countdown */}
        {!cd.done && !event.isLive && (
          <section className="rounded-3xl bg-gradient-warm p-6 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">Compte à rebours</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              {[
                { v: cd.d, l: "Jours" },
                { v: cd.h, l: "Heures" },
                { v: cd.m, l: "Min" },
                { v: cd.s, l: "Sec" },
              ].map((x) => (
                <div key={x.l} className="rounded-2xl bg-surface p-3 shadow-card">
                  <div className="font-serif text-3xl text-foreground">{String(x.v).padStart(2, "0")}</div>
                  <div className="text-[10px] text-muted-foreground">{x.l}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Money pot */}
        {event.moneyPot && (
          <section className="rounded-3xl bg-surface p-5 shadow-card">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-light text-gold">
                <Gift className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Cagnotte via {event.moneyPot.platform}
                </p>
                <p className="font-serif text-xl">{event.moneyPot.title}</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <span className="font-serif text-3xl">
                  {event.moneyPot.current.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
                <span className="text-sm text-muted-foreground">
                  sur {event.moneyPot.target.toLocaleString("fr-FR")} {event.moneyPot.currency}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary-light">
                <div
                  className="h-full rounded-full bg-gradient-primary"
                  style={{ width: `${Math.min(100, (event.moneyPot.current / event.moneyPot.target) * 100)}%` }}
                />
              </div>
            </div>
            <a
              href={event.moneyPot.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              Participer à la cagnotte <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Cette cagnotte est gérée par une plateforme externe. Memento Live ne collecte pas et ne conserve pas les fonds.
            </p>
          </section>
        )}

        {/* Highlights: livre d'or + album */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/events/$slug/guestbook"
            params={{ slug: event.slug }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-surface to-surface p-5 shadow-card ring-1 ring-primary/10 transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/15 text-primary">
              <BookHeart className="h-5 w-5" />
            </div>
            <p className="mt-3 font-serif text-lg leading-tight">Livre d'or</p>
            <p className="text-xs text-muted-foreground">{stats?.guestbook ?? event.guestbookCount} messages</p>
          </Link>
          <Link
            to="/events/$slug/album"
            params={{ slug: event.slug }}
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/40 via-surface to-surface p-5 shadow-card ring-1 ring-accent/20 transition hover:-translate-y-0.5 hover:shadow-glow"
          >
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-accent/40 text-foreground">
              <Camera className="h-5 w-5" />
            </div>
            <p className="mt-3 font-serif text-lg leading-tight">Album</p>
            <p className="text-xs text-muted-foreground">{stats?.photos ?? event.photosCount} photos</p>
          </Link>
        </div>

        {/* Programme */}
        <Link
          to="/events/$slug/timeline"
          params={{ slug: event.slug }}
          className="flex items-center gap-4 rounded-3xl bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-glow"
        >
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg">Programme de la journée</p>
            <p className="text-xs text-muted-foreground">Le déroulé heure par heure</p>
          </div>
          <span className="text-muted-foreground">→</span>
        </Link>

        {/* Modules — grille unifiée */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-xl">Organisation</h2>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Tous les modules</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5">
            {([
              { to: "/events/$slug/checklist", icon: CheckSquare, label: "Checklist", hint: stats ? `${stats.checklistDone}/${stats.checklistTotal} faits` : "À faire", tone: "primary" },
              { to: "/events/$slug/playlist", icon: Music2, label: "Playlist", hint: `${stats?.songs ?? 0} morceaux`, tone: "accent" },
              { to: "/events/$slug/seating", icon: LayoutGrid, label: "Plan de table", hint: `${stats?.tables ?? 0} tables`, tone: "secondary" },
              { to: "/events/$slug/budget", icon: Wallet, label: "Budget", hint: stats ? `${(stats.budgetTotal ?? 0).toLocaleString("fr-FR")} €` : "—", tone: "primary" },
              { to: "/events/$slug/registry", icon: Gift, label: "Cadeaux", hint: `${stats?.gifts ?? 0} idées`, tone: "accent" },
              { to: "/events/$slug/checkin", icon: QrCode, label: "Check-in", hint: "QR code", tone: "dark" },
              { to: "/events/$slug/rsvp", icon: MailCheck, label: "RSVP", hint: "Confirmer", tone: "primary" },
              { to: "/events/$slug/dresscode", icon: Shirt, label: "Dress code", hint: "Palette & tenues", tone: "accent" },
              { to: "/events/$slug/map", icon: MapIcon, label: "Plan", hint: "Itinéraires", tone: "secondary" },
              { to: "/events/$slug/carpool", icon: Car, label: "Covoiturage", hint: "4 trajets", tone: "primary" },
              { to: "/events/$slug/speeches", icon: Mic2, label: "Discours", hint: "5 · 29 min", tone: "accent" },
              { to: "/events/$slug/kids", icon: Baby, label: "Enfants", hint: "5 petits", tone: "secondary" },
              { to: "/events/$slug/photobooth", icon: Sparkles, label: "Photobooth", hint: "Filtres & stickers", tone: "dark" },
              { to: "/events/$slug/thanks", icon: Heart, label: "Remerciements", hint: "Cartes à envoyer", tone: "primary" },
              { to: "/events/$slug/gifts-received", icon: PackageOpen, label: "Cadeaux reçus", hint: "Journal", tone: "accent" },
            ] as const).map((m) => {
              const Icon = m.icon;
              const toneCls =
                m.tone === "primary" ? "bg-primary/15 text-primary"
                : m.tone === "accent" ? "bg-accent/40 text-foreground"
                : m.tone === "dark" ? "bg-foreground text-background"
                : "bg-secondary text-foreground";
              return (
                <Link
                  key={m.to}
                  to={m.to}
                  params={{ slug: event.slug }}
                  className="group flex flex-col gap-2 rounded-2xl bg-surface p-3.5 shadow-card ring-1 ring-border/40 transition hover:-translate-y-0.5 hover:shadow-glow sm:p-4"
                >
                  <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneCls}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <p className="font-serif text-sm leading-tight">{m.label}</p>
                  <p className="line-clamp-1 text-[10px] text-muted-foreground">{m.hint}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Info & engagement */}
        <section className="space-y-3">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-xl">En temps réel</h2>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">Info & engagement</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5">
            <Link
              to="/events/$slug/weather"
              params={{ slug: event.slug }}
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-50 p-3.5 text-xs font-semibold ring-1 ring-sky-200 transition hover:-translate-y-0.5"
            >
              <CloudSun className="h-5 w-5 text-sky-600" />
              <span>Météo</span>
              <span className="text-[10px] font-medium text-sky-700/80">28° ensoleillé</span>
            </Link>
            <Link
              to="/events/$slug/faq"
              params={{ slug: event.slug }}
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-secondary p-3.5 text-xs font-semibold transition hover:-translate-y-0.5"
            >
              <HelpCircle className="h-5 w-5 text-primary" />
              <span>FAQ</span>
              <span className="text-[10px] font-medium text-muted-foreground">Réponses invités</span>
            </Link>
            <Link
              to="/events/$slug/moderation"
              params={{ slug: event.slug }}
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-destructive/5 p-3.5 text-xs font-semibold ring-1 ring-destructive/20 transition hover:-translate-y-0.5"
            >
              <Shield className="h-5 w-5 text-destructive" />
              <span>Modération</span>
              <span className="text-[10px] font-medium text-destructive/80">2 à traiter</span>
            </Link>
            <Link
              to="/events/$slug/polls"
              params={{ slug: event.slug }}
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-gradient-to-br from-fuchsia-500/15 to-primary/10 p-3.5 text-xs font-semibold ring-1 ring-primary/20 transition hover:-translate-y-0.5"
            >
              <BarChart2 className="h-5 w-5 text-primary" />
              <span>Sondages live</span>
              <span className="text-[10px] font-medium text-muted-foreground">2 en cours</span>
            </Link>
            <Link
              to="/events/$slug/activity"
              params={{ slug: event.slug }}
              className="flex flex-col items-start gap-1.5 rounded-2xl bg-card p-3.5 text-xs font-semibold ring-1 ring-border/60 transition hover:-translate-y-0.5"
            >
              <Activity className="h-5 w-5 text-primary" />
              <span>Journal</span>
              <span className="text-[10px] font-medium text-muted-foreground">12 activités · 24 h</span>
            </Link>
          </div>
        </section>















        {/* Venue */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lieu</p>
          <p className="mt-1 font-serif text-lg">{event.venue}</p>
          <p className="text-sm text-muted-foreground">{event.city}, {event.country}</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(event.venue + " " + event.city)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold"
          >
            <MapPin className="h-3.5 w-3.5" /> Voir sur la carte
          </a>
        </section>

        {/* Souvenir / recap */}
        <Link
          to="/events/$slug/souvenir"
          params={{ slug: event.slug }}
          className="relative flex items-center gap-4 overflow-hidden rounded-3xl bg-gradient-primary p-5 text-white shadow-glow"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            ✨
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest opacity-90">Le souvenir</p>
            <p className="font-serif text-xl">Revivez la journée en un clin d'œil</p>
          </div>
          <span className="text-xl">→</span>
        </Link>

        {/* Organizer actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Link
            to="/events/$slug/dashboard"
            params={{ slug: event.slug }}
            className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-background px-3 py-3 text-xs font-semibold"
          >
            <BarChart3 className="h-4 w-4 text-primary" /> Stats
          </Link>
          <Link
            to="/events/$slug/guests"
            params={{ slug: event.slug }}
            className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-background px-3 py-3 text-xs font-semibold"
          >
            <Users className="h-4 w-4 text-primary" /> Invités
          </Link>
          <Link
            to="/events/$slug/contributors"
            params={{ slug: event.slug }}
            className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-background px-3 py-3 text-xs font-semibold"
          >
            <Users className="h-4 w-4 text-primary" /> Équipe
          </Link>
          <Link
            to="/events/$slug/edit"
            params={{ slug: event.slug }}
            className="flex flex-col items-start gap-1 rounded-2xl border border-border bg-background px-3 py-3 text-xs font-semibold"
          >
            <Calendar className="h-4 w-4 text-primary" /> Modifier
          </Link>

        </div>
        </div>
        {/* Sidebar rail — sticky live/cagnotte widgets on desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            {event.livestream && (
              <Link
                to="/events/$slug/live"
                params={{ slug: event.slug }}
                className="block overflow-hidden rounded-3xl bg-gradient-live p-5 text-white shadow-glow"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
                    <Radio className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest">
                      {event.isLive ? "En direct" : "Live prévu"}
                    </p>
                    <p className="mt-0.5 font-serif text-lg">Rejoindre</p>
                  </div>
                </div>
              </Link>
            )}
            {event.moneyPot && (
              <CagnotteCard
                url={event.moneyPot.url}
                goal={event.moneyPot.target}
                current={event.moneyPot.current}
              />
            )}
            <section className="rounded-3xl bg-surface p-5 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Lieu</p>
              <p className="mt-1 font-serif text-lg">{event.venue}</p>
              <p className="text-sm text-muted-foreground">{event.city}, {event.country}</p>
            </section>
          </div>
        </aside>
      </main>

    </div>
  );
}
