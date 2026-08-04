import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";

export const Route = createFileRoute("/app/saved")({
  component: Saved,
  head: () => ({
    meta: [
      { title: "Enregistré · MaFeliza" },
      { name: "description", content: "Vos posts, moodboards et idées mis de côté pour plus tard." },
      { property: "og:title", content: "Enregistré · MaFeliza" },
      { property: "og:description", content: "Votre bibliothèque d'inspirations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const collections = [
  { name: "Décor bohème", count: 24, cover: "from-primary/70 to-gold" },
  { name: "Playlists slow", count: 8, cover: "from-primary-dark to-primary" },
  { name: "Cadeaux invités", count: 15, cover: "from-gold to-primary-dark" },
  { name: "Cérémonies laïques", count: 11, cover: "from-foreground to-primary-dark" },
];

const posts = [
  { author: "Camille R.", event: "Mariage Provence · 2025", excerpt: "L'astuce des vases dépareillés pour éviter la scéno figée…", likes: 218, comments: 34 },
  { author: "Julien P.", event: "Baptême Villa · 2024", excerpt: "Ma checklist J-30 : ce qu'on aurait dû préparer plus tôt.", likes: 142, comments: 19 },
  { author: "Nour B.", event: "Anniversaire 40 ans", excerpt: "Le photobooth à 90 € qui a fait plus rire que le DJ.", likes: 89, comments: 12 },
];

function Saved() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Enregistré</p>
          <p className="text-xs text-muted-foreground">4 collections · 58 posts</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vos collections</p>
          <div className="grid grid-cols-2 gap-2">
            {collections.map((c) => (
              <article key={c.name} className={`rounded-2xl bg-gradient-to-br ${c.cover} p-4 text-white shadow-soft`}>
                <Bookmark className="h-5 w-5" />
                <p className="mt-3 font-serif text-lg leading-tight">{c.name}</p>
                <p className="mt-1 text-xs opacity-90">{c.count} éléments</p>
              </article>
            ))}
            <button className="grid place-items-center rounded-2xl border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
              + Nouvelle collection
            </button>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Posts sauvegardés</p>
          <div className="space-y-2">
            {posts.map((p) => (
              <article key={p.author} className="rounded-2xl bg-surface p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-gold font-bold text-white">
                    {p.author[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.author}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{p.event}</p>
                  </div>
                  <Bookmark className="h-5 w-5 fill-primary text-primary" />
                </div>
                <p className="mt-3 text-sm text-foreground/90">{p.excerpt}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="h-3.5 w-3.5" /> {p.comments}</span>
                  <span className="ml-auto flex items-center gap-1"><Share2 className="h-3.5 w-3.5" /> Partager</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
