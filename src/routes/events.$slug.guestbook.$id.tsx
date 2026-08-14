import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Heart, MessageCircle, Share2, Play, Pause, Flag, Sparkles, Quote } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/guestbook/$id")({
  component: GuestbookEntry,
  head: () => ({
    meta: [
      { title: "Message du livre d'or · MaFeliza" },
      { name: "description", content: "Un message précieux laissé dans le livre d'or : texte, photo ou vocal signé par un proche." },
      { property: "og:title", content: "Message du livre d'or · MaFeliza" },
      { property: "og:description", content: "Un mot pour la vie." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const entry = {
  author: "Grand-mère Odile",
  avatar: "https://i.pravatar.cc/160?img=48",
  role: "Grand-mère de la mariée",
  when: "Samedi 14 juin · 22 h 14",
  moment: "Après le dessert",
  type: "vocal" as const,
  duration: "1:42",
  photo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200",
  message: `Mes chers Sarah et Thomas,

Il y a soixante ans, votre grand-père m'a dit une phrase qui ne m'a jamais quittée : « Aimer, c'est choisir chaque matin. »

Je vous la transmets aujourd'hui comme un petit trésor. Sarah, tu as toujours été cette petite fille qui riait aux éclats en courant dans mon jardin. Thomas, en cinq ans, tu es devenu comme un petit-fils.

Que la vie vous garde ensemble, avec tendresse, avec patience, avec beaucoup de rires. Nous sommes fiers de vous.`,
  hearts: 128,
  replies: 24,
  featured: true,
  transcript: [
    { t: "0:00", line: "Mes chers Sarah et Thomas…" },
    { t: "0:18", line: "Il y a soixante ans, votre grand-père m'a dit…" },
    { t: "0:52", line: "Sarah, tu as toujours été cette petite fille…" },
    { t: "1:21", line: "Que la vie vous garde ensemble, avec tendresse…" },
  ],
};

const others = [
  { id: "m2", author: "Julien", excerpt: "Une soirée hors du temps, merci infiniment.", tone: "Reconnaissance" },
  { id: "m3", author: "Cousine Marie", excerpt: "Vos regards pendant les vœux… inoubliable.", tone: "Émouvant" },
  { id: "m4", author: "Antoine & Léa", excerpt: "On repart avec plein d'idées pour notre propre mariage 😄", tone: "Drôle" },
];

function GuestbookEntry() {
  const { slug } = useParams({ from: "/events/$slug/guestbook/$id" });
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(38);
  const [liked, setLiked] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug/guestbook" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour au livre d'or">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Livre d'or</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      {entry.featured && (
        <div className="mx-4 mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3 w-3" /> Message mis en avant
        </div>
      )}

      <section className="px-4 pt-4">
        <div className="flex items-center gap-3">
          <img src={entry.avatar} alt="" className="h-14 w-14 rounded-full ring-2 ring-primary/20" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">{entry.author}</p>
            <p className="text-[11px] text-muted-foreground">{entry.role}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">{entry.when} · {entry.moment}</p>
          </div>
        </div>
      </section>

      <figure className="mx-4 mt-5 overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={entry.photo} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            📷 Photo jointe
          </span>
        </div>

        <div className="border-b border-border/60 bg-secondary/40 p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPlaying((p) => !p)}
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow"
              aria-label={playing ? "Pause" : "Lire"}
            >
              {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex items-end gap-0.5">
                {Array.from({ length: 32 }).map((_, i) => {
                  const active = i / 32 < progress / 100;
                  return (
                    <span
                      key={i}
                      onClick={() => setProgress(Math.round((i / 32) * 100))}
                      className={`w-1 cursor-pointer rounded-full ${active ? "bg-primary" : "bg-border"}`}
                      style={{ height: `${8 + Math.sin(i * 0.6) * 6 + (i % 3) * 4}px` }}
                    />
                  );
                })}
              </div>
              <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>0:{String(Math.round((entry.duration.split(":").reduce((a, b) => a * 60 + +b, 0) * progress) / 100)).padStart(2, "0")}</span>
                <span>{entry.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <figcaption className="p-5">
          <Quote className="h-5 w-5 text-primary/40" />
          <div className="mt-2 space-y-3 font-serif text-[15px] leading-relaxed">
            {entry.message.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <details className="mt-4 rounded-2xl bg-secondary/60 p-3">
            <summary className="cursor-pointer text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Transcription automatique
            </summary>
            <ul className="mt-2 space-y-1.5 text-[12px]">
              {entry.transcript.map((t) => (
                <li key={t.t} className="flex gap-2">
                  <span className="w-8 shrink-0 font-mono text-[10px] text-primary">{t.t}</span>
                  <span className="text-muted-foreground">{t.line}</span>
                </li>
              ))}
            </ul>
          </details>
        </figcaption>
      </figure>

      <section className="mx-4 mt-4 flex items-center justify-between rounded-full bg-card px-4 py-3 ring-1 ring-border/60">
        <div className="flex items-center gap-4 text-xs">
          <button onClick={() => setLiked((l) => !l)} className="inline-flex items-center gap-1.5">
            <Heart className={`h-4 w-4 transition-transform ${liked ? "fill-primary text-primary scale-110" : ""}`} />
            <span className="font-semibold">{entry.hearts + (liked ? 1 : 0)}</span>
          </button>
          <button onClick={() => setReplyOpen((o) => !o)} className="inline-flex items-center gap-1.5">
            <MessageCircle className="h-4 w-4" />
            <span className="font-semibold">{entry.replies}</span>
          </button>
        </div>
        <button className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
          <Flag className="h-3 w-3" /> Signaler
        </button>
      </section>

      {replyOpen && (
        <section className="mx-4 mt-3 rounded-3xl border border-border/60 bg-card p-4">
          <textarea
            rows={3}
            placeholder="Répondre à ce message…"
            className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button onClick={() => setReplyOpen(false)} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold">
              Annuler
            </button>
            <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">
              Publier
            </button>
          </div>
        </section>
      )}

      <section className="mx-4 mt-8">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">D'autres mots précieux</p>
        <ul className="mt-3 space-y-2">
          {others.map((o) => (
            <li key={o.id}>
              <Link
                to="/events/$slug/guestbook/$id"
                params={{ slug, id: o.id }}
                className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                  <Quote className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{o.author}</p>
                  <p className="truncate text-[11px] text-muted-foreground">« {o.excerpt} »</p>
                </div>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[9px] font-semibold">{o.tone}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
