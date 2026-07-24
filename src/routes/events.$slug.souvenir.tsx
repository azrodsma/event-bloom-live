import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { ChevronLeft, Download, Share2, Heart, Camera, BookHeart, Users, Radio, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/souvenir")({
  head: ({ params }) => {
    const e = findEvent(params.slug);
    return {
      meta: [
        { title: `Le souvenir · ${e?.title ?? ""} — Memento Live` },
        { name: "description", content: `Revivez ${e?.title ?? "cet événement"} : les moments forts, l'album et le livre d'or.` },
        { property: "og:title", content: `Souvenir · ${e?.title ?? ""}` },
        { property: "og:description", content: "Le récap magique de votre événement." },
        ...(e?.cover
          ? [
              { property: "og:image", content: e.cover },
              { name: "twitter:image", content: e.cover },
            ]
          : []),
      ],
    };
  },
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: Souvenir,
});

const highlights = [
  { time: "15:03", label: "L'entrée des mariés", by: "142 réactions 💐" },
  { time: "17:22", label: "Le premier baiser", by: "Moment le plus liké ❤️" },
  { time: "19:47", label: "Discours d'Emma", by: "Message vocal favori 🎙️" },
  { time: "22:15", label: "Ouverture du bal", by: "312 cœurs envoyés" },
  { time: "00:42", label: "Feu d'artifice", by: "89 photos partagées ✨" },
];

function Souvenir() {
  const { event } = Route.useLoaderData();
  const dateLabel = new Date(event.date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Hero */}
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
              <button className="grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur" aria-label="Partager">
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
        {/* Stats */}
        <section className="grid grid-cols-4 gap-2">
          {[
            { icon: Users, v: "148", l: "Invités" },
            { icon: Camera, v: event.photosCount, l: "Photos" },
            { icon: BookHeart, v: event.guestbookCount, l: "Mots" },
            { icon: Radio, v: event.viewers?.toLocaleString("fr-FR") ?? "—", l: "Live" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl bg-surface p-3 text-center shadow-card">
              <s.icon className="mx-auto h-4 w-4 text-primary" />
              <p className="mt-1.5 font-serif text-xl leading-none">{s.v}</p>
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </section>

        {/* Highlights timeline */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Les moments forts</p>
          <h2 className="mt-1 font-serif text-2xl">La journée en 5 instants</h2>
          <ol className="mt-4 space-y-3">
            {highlights.map((h, i) => (
              <li key={h.time} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-primary text-xs font-bold text-white shadow-glow">
                    {i + 1}
                  </div>
                  {i < highlights.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-primary-light" style={{ minHeight: 24 }} />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{h.time}</p>
                  <p className="font-serif text-lg leading-tight">{h.label}</p>
                  <p className="text-xs text-muted-foreground">{h.by}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Best photos */}
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
          <div className="grid grid-cols-3 gap-2">
            {[
              "photo-1519741497674-611481863552",
              "photo-1511285560929-80b456fea0bc",
              "photo-1465495976277-4387d4b0e4a6",
              "photo-1519225421980-715cb0215aed",
              "photo-1520854221256-17451cc331bf",
              "photo-1478146896981-b80fe463b330",
            ].map((id, i) => (
              <div key={id} className="relative aspect-square overflow-hidden rounded-2xl shadow-card">
                <img
                  src={`https://images.unsplash.com/${id}?w=400`}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />
                {i === 0 && (
                  <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur">
                    <Heart className="h-2.5 w-2.5 fill-primary text-primary" /> Top
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Featured message */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-glow">
          <Sparkles className="absolute -right-2 -top-2 h-16 w-16 text-white/10" />
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">Le mot du livre d'or</p>
          <p className="mt-3 font-serif text-xl leading-snug">
            « Merci pour cette journée hors du temps. Vous nous avez offert le plus beau des souvenirs. »
          </p>
          <div className="mt-4 flex items-center gap-2">
            <img src="https://i.pravatar.cc/40?img=12" alt="" className="h-8 w-8 rounded-full border-2 border-white/40" />
            <div>
              <p className="text-sm font-semibold">Emma & Antoine</p>
              <p className="text-[11px] opacity-80">Témoins de mariage</p>
            </div>
          </div>
          <Link
            to="/events/$slug/guestbook"
            params={{ slug: event.slug }}
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold underline"
          >
            Lire tous les messages →
          </Link>
        </section>

        {/* Download recap */}
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
