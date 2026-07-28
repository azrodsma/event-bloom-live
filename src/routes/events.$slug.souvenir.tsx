import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getEventBySlug } from "@/lib/events.functions";
import { getEventStats } from "@/lib/stats.functions";
import { listAlbumMedia } from "@/lib/album.functions";
import { listGuestbookEntries } from "@/lib/guestbook.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { ChevronLeft, Download, Share2, Heart, Camera, BookHeart, Users, Radio, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/souvenir")({
  head: ({ params }) => ({
    meta: [
      { title: `Le souvenir · ${params.slug} — Memento Live` },
      { name: "description", content: `Revivez cet événement : moments forts, album et livre d'or.` },
      { property: "og:title", content: `Souvenir · ${params.slug}` },
      { property: "og:description", content: "Le récap magique de votre événement." },
    ],
  }),
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) throw notFound();
    const [stats, media, entries] = await Promise.all([
      getEventStats({ data: { eventId: db.id } }),
      listAlbumMedia({ data: { eventId: db.id } }),
      listGuestbookEntries({ data: { eventId: db.id } }),
    ]);
    return { event: adaptEvent(db), stats, media, entries };
  },
  component: Souvenir,
});

function Souvenir() {
  const { event, stats, media, entries } = Route.useLoaderData();
  const dateLabel = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const photos = (media as Array<{ id: string; url: string; media_type: string }>).filter((m) => m.media_type === "photo").slice(0, 6);
  const featured = (entries as Array<{ id: string; author_name: string; kind: string; content: string | null }>).find((e) => e.kind === "text" && e.content);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: event.title, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      <header className="relative">
        <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
          <img src={event.cover} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-black/40" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
            <Link
              to="/events/$slug"
              params={{ slug: event.slug }}
              className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex gap-2">
              <button onClick={share} className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Partager">
                <Share2 className="h-4 w-4" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Télécharger">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-center sm:p-8">
            <div className="mx-auto max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-light px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-gold">
                <Sparkles className="h-3 w-3" /> Le souvenir
              </span>
              <h1 className="mt-3 font-serif text-4xl leading-tight text-foreground sm:text-5xl">{event.title}</h1>
              <p className="mt-2 text-sm text-foreground/80">{dateLabel} · {event.venue}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        <section className="grid grid-cols-4 gap-2">
          {[
            { icon: Users, v: stats.guestsConfirmed, l: "Invités" },
            { icon: Camera, v: stats.photos, l: "Photos" },
            { icon: BookHeart, v: stats.guestbook, l: "Mots" },
            { icon: Radio, v: event.viewers?.toLocaleString("fr-FR") ?? "—", l: "Live" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface p-3 text-center shadow-card">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 font-serif text-xl leading-none">{s.v}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </section>

        <section>
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="font-serif text-2xl">Les photos préférées</h2>
            <Link
              to="/events/$slug/album"
              params={{ slug: event.slug }}
              className="text-xs font-semibold text-primary"
            >
              Voir l'album →
            </Link>
          </div>
          {photos.length === 0 ? (
            <p className="rounded-3xl bg-surface p-6 text-center text-sm text-muted-foreground">
              Aucune photo pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {photos.map((p, i) => (
                <div key={p.id} className="relative aspect-square overflow-hidden rounded-2xl shadow-card">
                  <img src={p.url} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
                  {i === 0 && (
                    <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                      <Heart className="h-2.5 w-2.5 fill-primary text-primary" /> Top
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {featured && (
          <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-glow">
            <Sparkles className="absolute -right-2 -top-2 h-16 w-16 text-white/10" />
            <p className="text-xs font-bold uppercase tracking-widest opacity-80">Le mot du livre d'or</p>
            <p className="mt-3 font-serif text-xl leading-snug">« {featured.content} »</p>
            <p className="mt-4 text-sm font-semibold">{featured.author_name}</p>
            <Link
              to="/events/$slug/guestbook"
              params={{ slug: event.slug }}
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold underline"
            >
              Lire tous les messages →
            </Link>
          </section>
        )}

        <section className="rounded-3xl bg-surface p-5 text-center shadow-card">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-gold-light text-gold">
            <Download className="h-5 w-5" />
          </div>
          <h3 className="mt-3 font-serif text-xl">Livre souvenir imprimé</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Recevez chez vous un livre relié avec toutes les photos, les mots du livre d'or et les moments forts.
          </p>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background">
            Commander · 49 €
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">Format 22×22cm · 80 pages · Livraison 10 jours</p>
        </section>
      </main>
    </div>
  );
}
