import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent, guestbookMessages } from "@/lib/mock-data";
import { ChevronLeft, Heart, MessageCircle, Star, Image, Mic, Video } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/guestbook")({
  head: ({ params }) => {
    const e = findEvent(params.slug);
    return {
      meta: [
        { title: e ? `Livre d'or · ${e.title} — Memento Live` : "Livre d'or — Memento Live" },
        { name: "description", content: "Laissez un message, une photo, une vidéo ou un vocal pour créer un souvenir inoubliable." },
      ],
    };
  },
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: Guestbook,
});

const filters = ["Tous", "Photos", "Vidéos", "Vocaux", "Favoris"] as const;

function Guestbook() {
  const { event } = Route.useLoaderData();
  const [filter, setFilter] = useState<(typeof filters)[number]>("Tous");
  const [text, setText] = useState("");

  const filtered = guestbookMessages.filter((m) => {
    if (filter === "Photos") return m.media?.type === "photo";
    if (filter === "Vidéos") return m.media?.type === "video";
    if (filter === "Vocaux") return m.media?.type === "audio";
    if (filter === "Favoris") return m.isFeatured;
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-xl">Livre d'or</p>
            <p className="truncate text-xs text-muted-foreground">
              {event.title} · {guestbookMessages.length} messages
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        {/* Compose */}
        <div className="rounded-3xl bg-surface p-4 shadow-card">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Laissez un message pour ${event.title.split(" & ")[0]}...`}
            rows={3}
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              {[
                { icon: Image, label: "Photo" },
                { icon: Video, label: "Vidéo" },
                { icon: Mic, label: "Vocal" },
              ].map((a) => (
                <button
                  key={a.label}
                  className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <a.icon className="h-3.5 w-3.5" /> {a.label}
                </button>
              ))}
            </div>
            <Link
              to="/events/$slug/guestbook/new"
              params={{ slug: event.slug }}
              className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Publier
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium ${
                f === filter ? "bg-foreground text-background" : "bg-surface text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-3">
          {filtered.map((m) => (
            <article key={m.id} className={`rounded-3xl bg-surface p-4 shadow-card ${m.isFeatured ? "ring-2 ring-primary/30" : ""}`}>
              <div className="flex items-start gap-3">
                <img src={m.avatar} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <p className="font-semibold">{m.author}</p>
                    {m.isFeatured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.role} · {m.time}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground">{m.text}</p>
              {m.media?.type === "photo" && (
                <img src={m.media.url} alt="" className="mt-3 aspect-video w-full rounded-2xl object-cover" />
              )}
              {m.media?.type === "audio" && (
                <div className="mt-3 flex items-center gap-3 rounded-2xl bg-primary-light p-3">
                  <button className="grid h-10 w-10 place-items-center rounded-full bg-primary text-white">▶</button>
                  <div className="h-1.5 flex-1 rounded-full bg-white">
                    <div className="h-full w-1/3 rounded-full bg-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">0:34</span>
                </div>
              )}
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <Heart className="h-4 w-4" /> {m.likes}
                </button>
                <button className="inline-flex items-center gap-1 hover:text-primary">
                  <MessageCircle className="h-4 w-4" /> Répondre
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
