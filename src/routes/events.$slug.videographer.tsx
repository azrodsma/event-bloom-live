import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Film, Download } from "lucide-react";

export const Route = createFileRoute("/events/$slug/videographer")({
  component: Videographer,
  head: () => ({
    meta: [
      { title: "Vidéaste · MaFeliza" },
      { name: "description", content: "Brief créatif, plans clés et livrables du vidéaste." },
      { property: "og:title", content: "Vidéaste · MaFeliza" },
      { property: "og:description", content: "Le film de votre vie, orchestré à la seconde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const shots = [
  { l: "Getting ready mariée · 09:00", note: "Robe suspendue, alliances, détails" },
  { l: "First look · 15:00", note: "Steadicam · lumière naturelle jardin" },
  { l: "Cérémonie complète · 16:30", note: "3 caméras multi-angles + drone" },
  { l: "Vin d'honneur · 18:00", note: "Interviews invités surprises" },
  { l: "Première danse · 22:00", note: "Slow-motion 120 fps" },
];

const deliverables = [
  { l: "Teaser 60 sec", eta: "J+7", format: "MP4 vertical + horizontal" },
  { l: "Film long 15 min", eta: "J+45", format: "4K HDR" },
  { l: "Rush intégral", eta: "J+60", format: "Cloud privé 3 ans" },
];

function Videographer() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Vidéaste</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Studio Paloma · 2 opérateurs + drone</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Film className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <p className="text-xs uppercase tracking-widest opacity-70">Direction artistique</p>
          <h2 className="mt-2 font-display text-2xl">Cinéma naturaliste · lumière dorée · voix off</h2>
          <p className="mt-2 text-sm opacity-90">Inspiration : "Call Me By Your Name" × "The Farewell". Musique originale composée par Marion Roch.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Plan de tournage</h3>
          <div className="space-y-3">
            {shots.map((s) => (
              <div key={s.l} className="rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:ring-primary/30">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-primary" />
                  <p className="font-medium text-sm">{s.l}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground pl-6">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Livrables</h3>
          <div className="space-y-3">
            {deliverables.map((d) => (
              <div key={d.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center gap-3">
                <div className="rounded-full bg-primary/10 p-2"><Download className="h-4 w-4 text-primary" /></div>
                <div className="flex-1">
                  <p className="font-medium">{d.l}</p>
                  <p className="text-xs text-muted-foreground">{d.format}</p>
                </div>
                <span className="rounded-full bg-cream px-3 py-1 text-xs">{d.eta}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
