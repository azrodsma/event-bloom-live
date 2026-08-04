import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sun, Moon, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug/sunset")({
  component: Sunset,
  head: () => ({
    meta: [
      { title: "Lumière du jour · MaFeliza" },
      { name: "description", content: "Chronomètre solaire pour vos plus belles photos." },
      { property: "og:title", content: "Lumière du jour · MaFeliza" },
      { property: "og:description", content: "Capturez la golden hour à la seconde près." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const phases = [
  { l: "Lever du soleil", h: "05:56", tag: "Brume dorée · portraits éthérés", icon: Sun, color: "from-gold to-primary" },
  { l: "Blue hour matin", h: "06:14", tag: "Silhouettes bleutées avant l'aube", icon: Sun, color: "from-primary to-primary-dark" },
  { l: "Zénith", h: "13:42", tag: "Ombres dures · éviter portraits", icon: Sun, color: "from-primary-dark to-foreground" },
  { l: "Golden hour", h: "20:38", tag: "Lumière chaude · photos couple", icon: Sun, color: "from-gold to-primary-dark" },
  { l: "Coucher du soleil", h: "21:24", tag: "Ciel flamboyant · plan large", icon: Sun, color: "from-primary to-gold" },
  { l: "Blue hour soir", h: "21:47", tag: "Bougies & lanternes activées", icon: Moon, color: "from-foreground to-primary-dark" },
];

function Sunset() {
  const { slug } = useParams({ from: "/events/$slug/sunset" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Lumière du jour</p>
          <p className="text-xs text-muted-foreground">14 juin 2026 · Luberon</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <Sun className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Golden hour · 20:38</p>
          <p className="mt-2 text-sm opacity-90">Durée exploitable : 46 minutes. Idéal pour les photos de couple près de l'oliveraie.</p>
          <div className="mt-4 flex items-center gap-2 text-xs opacity-90">
            <MapPin className="h-3.5 w-3.5" /> 43.7982°N · 5.2044°E · Alt. 328 m
          </div>
        </section>

        <section className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-gold via-primary to-foreground" />
          <div className="space-y-3">
            {phases.map((p, i) => (
              <article key={i} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${p.color} p-4 text-white shadow-soft`}>
                <span className="absolute -left-[18px] top-5 grid h-4 w-4 place-items-center rounded-full bg-white ring-4 ring-background" />
                <div className="flex items-center gap-3">
                  <p.icon className="h-5 w-5" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-tight">{p.l}</p>
                    <p className="text-xs opacity-85">{p.tag}</p>
                  </div>
                  <span className="flex items-center gap-1 rounded-full bg-white/25 px-2 py-1 text-[11px] font-semibold">
                    <Clock className="h-3 w-3" /> {p.h}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <p className="font-serif text-lg leading-tight">Suggestion IA</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Décalez la cérémonie de 15 minutes pour aligner les vœux avec la golden hour. La lumière rasera l'arche à 20:53.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">Appliquer la suggestion</button>
        </section>
      </main>
    </div>
  );
}
