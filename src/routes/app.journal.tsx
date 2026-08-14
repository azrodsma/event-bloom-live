import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Rss, Calendar, Podcast, BookOpen } from "lucide-react";

export const Route = createFileRoute("/app/journal")({
  component: Journal,
  head: () => ({
    meta: [
      { title: "Journal · MaFeliza" },
      { name: "description", content: "Nos plus belles histoires d'événements, écrites à la main." },
      { property: "og:title", content: "Journal · MaFeliza" },
      { property: "og:description", content: "L'éditorial MaFeliza : témoignages, tendances, coulisses." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const featured = {
  title: "Comment marier tradition provençale et modernité",
  excerpt: "Trois jours dans un mas où lavande, ciel étoilé et DJ set berlinois cohabitent en douceur.",
  author: "Camille Ducroz",
  read: "8 min",
};

const articles = [
  { cat: "Coulisses", title: "Le carnet secret d'une wedding planner à Paris", read: "6 min" },
  { cat: "Tendance", title: "Cérémonies laïques : 6 gestes qui remplacent le riz", read: "4 min" },
  { cat: "Portrait", title: "Rencontre avec Sarah, fleuriste zéro déchet", read: "5 min" },
  { cat: "Guide", title: "Baptême : bien accueillir les invités non pratiquants", read: "7 min" },
];

const podcasts = [
  { title: "Épisode 12 · Dire oui deux fois", guest: "Léa & Marion", duration: "38 min" },
  { title: "Épisode 11 · L'anniversaire surprise réussie", guest: "David M.", duration: "27 min" },
  { title: "Épisode 10 · Célébrer sans budget délirant", guest: "Nora K.", duration: "44 min" },
];

function Journal() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Journal MaFeliza</p>
          <p className="text-xs text-muted-foreground">Édito, guides et podcasts</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <article className="overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase">À la une</span>
          <p className="mt-3 font-serif text-3xl leading-tight">{featured.title}</p>
          <p className="mt-2 text-sm opacity-90">{featured.excerpt}</p>
          <div className="mt-4 flex items-center gap-3 text-xs opacity-80">
            <BookOpen className="h-3.5 w-3.5" /> {featured.read}
            <span>· par {featured.author}</span>
          </div>
        </article>

        <section>
          <div className="mb-3 flex items-center justify-between px-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Cette semaine</p>
            <span className="flex items-center gap-1 text-[11px] text-primary-dark">
              <Rss className="h-3 w-3" /> RSS
            </span>
          </div>
          <div className="space-y-2">
            {articles.map((a) => (
              <article key={a.title} className="flex items-center gap-3 rounded-2xl bg-surface p-4 shadow-soft">
                <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-gold to-primary text-white">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">{a.cat}</p>
                  <p className="mt-0.5 truncate text-sm font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{a.read} · lecture</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Podcast className="h-3.5 w-3.5" /> Podcast Amour & Événements
          </div>
          <div className="space-y-2">
            {podcasts.map((p) => (
              <article key={p.title} className="rounded-2xl bg-surface p-4 shadow-soft">
                <p className="font-serif text-lg leading-tight">{p.title}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Invité · {p.guest}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {p.duration}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
