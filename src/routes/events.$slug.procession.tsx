import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Route as RouteIcon, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/procession")({
  component: Procession,
  head: () => ({
    meta: [
      { title: "Cortège · Memento Live" },
      { name: "description", content: "Orchestrez le cortège nuptial minute par minute." },
      { property: "og:title", content: "Cortège · Memento Live" },
      { property: "og:description", content: "L'entrée qui donne le ton." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const steps = [
  { t: "14:32", who: "Grands-parents", detail: "Bras dessus bras dessous", song: "Clair de Lune · Debussy" },
  { t: "14:34", who: "Parents du marié", detail: "Suivis des témoins masculins", song: "Canon · Pachelbel" },
  { t: "14:36", who: "Demoiselles d'honneur", detail: "Bouquet miniature", song: "A Thousand Years · Instrumental" },
  { t: "14:38", who: "Enfants d'honneur", detail: "Pétales · panier osier", song: "La Vie en Rose · Instrumental" },
  { t: "14:40", who: "La mariée & son père", detail: "Pause 3 s à la porte", song: "Here Comes the Sun · Cordes" },
];

function Procession() {
  const { slug } = useParams({ from: "/events/$slug/procession" });
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Cortège</p>
          <p className="text-xs text-muted-foreground">5 séquences · durée 8 min</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-foreground p-6 text-white shadow-card">
          <RouteIcon className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">L'entrée qui donne le ton</p>
          <p className="mt-2 text-sm opacity-90">
            Chaque pas est chronométré et musical. Le maître de cérémonie reçoit ce déroulé sur sa tablette.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Point de départ · Cloître ouest
          </div>
          <p className="mt-2 text-sm text-foreground/90">
            Longueur allée · 22 m · tempo suggéré 60 pas/min.
          </p>
        </section>

        <section className="relative pl-6">
          <div className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-primary via-gold to-primary" />
          <div className="space-y-3">
            {steps.map((s, i) => (
              <article key={i} className="relative rounded-2xl bg-surface p-4 shadow-soft">
                <span className="absolute -left-[18px] top-5 grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background" />
                <div className="flex items-center justify-between">
                  <p className="font-serif text-lg leading-tight">{s.who}</p>
                  <span className="flex items-center gap-1 text-xs font-semibold text-primary-dark">
                    <Clock className="h-3 w-3" /> {s.t}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.detail}</p>
                <p className="mt-2 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary-dark inline-block">
                  ♪ {s.song}
                </p>
              </article>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">Exporter en PDF pour l'officiant</button>
      </main>
    </div>
  );
}
