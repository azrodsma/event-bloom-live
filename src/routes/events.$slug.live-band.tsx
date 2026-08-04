import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Music, Mic2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/live-band")({
  component: LiveBand,
  head: () => ({
    meta: [
      { title: "Groupe live · MaFeliza" },
      { name: "description", content: "Set list, fiche technique et déroulé du groupe live." },
      { property: "og:title", content: "Groupe live · MaFeliza" },
      { property: "og:description", content: "The Velvet Session · trio jazz-soul." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const sets = [
  { name: "Set 1 · Cocktail chill", when: "19:00 – 20:15", vibe: "Bossa, soul feutrée, jazz vocal", songs: ["Corcovado", "Fly Me to the Moon", "The Girl from Ipanema", "Feeling Good", "Something Stupid"] },
  { name: "Set 2 · Ouverture de bal", when: "22:30 – 23:15", vibe: "Standards romantiques, montée en énergie", songs: ["At Last (Etta James)", "L-O-V-E", "Can't Take My Eyes Off You", "Ain't Nobody", "Signed Sealed Delivered"] },
  { name: "Set 3 · Party time", when: "23:45 – 00:45", vibe: "Funk, disco, groove", songs: ["Uptown Funk", "September", "Superstition", "I Wish", "Get Lucky", "Le Freak"] },
];

const tech = ["3 musiciens (voix, guitare, contrebasse)", "Sono 4kW · console Yamaha QL1", "4 x XLR + 2 DI + 1 line SM58 chef d'orchestre", "Backline fourni : ampli basse Ampeg, guitare acoustique", "Loge fermée · repas chaud + eau plate/gazeuse"];

function LiveBand() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Groupe live</h1>
            <p className="text-xs text-muted-foreground">The Velvet Session · trio jazz-soul</p>
          </div>
          <Music className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <Mic2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Trois sets. Une nuit qu'on ne réécoute pas sur Spotify.</h2>
        </section>

        <section className="space-y-4">
          {sets.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{s.name}</p>
                  <p className="text-xs text-primary">{s.when}</p>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.vibe}</p>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {s.songs.map((song) => <li key={song}>· {song}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section className="rounded-2xl bg-cream p-5">
          <p className="font-medium text-sm">Fiche technique</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {tech.map((t) => <li key={t}>· {t}</li>)}
          </ul>
        </section>
      </main>
    </div>
  );
}
