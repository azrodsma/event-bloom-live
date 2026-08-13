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
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link
            to="/events/$slug"
            params={{ slug: "mariage-lea-thomas" }}
            className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Groupe live</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">The Velvet Session · trio jazz-soul</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Music className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-foreground to-primary-dark p-7 text-white shadow-modal">
          <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-gold/25 blur-3xl" />
          <span className="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-white/95">
            <Mic2 className="h-3.5 w-3.5 text-gold" /> 3 sets · 16 titres
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:text-4xl">
            Trois sets. Une nuit qu'on ne réécoute pas sur Spotify.
          </h2>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {sets.map((s) => (
            <div
              key={s.name}
              className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-serif text-lg leading-snug">{s.name}</p>
                <span className="shrink-0 rounded-full bg-gold-light px-2.5 py-1 text-[11px] font-semibold text-gold">{s.when}</span>
              </div>
              <p className="mt-2 text-[11px] font-medium text-primary">{s.vibe}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {s.songs.map((song) => (
                  <li key={song} className="rounded-full bg-primary-light px-2.5 py-1 text-[11px] font-medium text-foreground">
                    {song}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="rounded-[26px] bg-gradient-mesh p-6 shadow-card ring-1 ring-border/60">
          <p className="font-serif text-lg">Fiche technique</p>
          <ul className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted-foreground">
            {tech.map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                {t}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
