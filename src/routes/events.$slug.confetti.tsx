import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper, Sparkles, Timer } from "lucide-react";

export const Route = createFileRoute("/events/$slug/confetti")({
  component: Confetti,
  head: () => ({
    meta: [
      { title: "Confettis & effets · MaFeliza" },
      { name: "description", content: "Programmez confettis, serpentins et effets scéniques au bon moment." },
      { property: "og:title", content: "Confettis · MaFeliza" },
      { property: "og:description", content: "Le bon effet, à la seconde près." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cues = [
  { t: "17:32", label: "Sortie de mairie", fx: "Pétales de rose blanche", type: "Biodégradable", intensity: 80, color: "from-primary/70 to-primary" },
  { t: "18:45", label: "Entrée en salle", fx: "Serpentins dorés", type: "Papier recyclé", intensity: 100, color: "from-gold to-primary-dark" },
  { t: "21:15", label: "Découpe pièce montée", fx: "Confettis cœurs", type: "Papier de riz", intensity: 60, color: "from-primary to-gold" },
  { t: "23:59", label: "Ouverture minuit", fx: "Étincelles froides", type: "Cold spark 3m", intensity: 100, color: "from-foreground to-primary-dark" },
];

function Confetti() {
  const { slug } = useParams({ from: "/events/$slug/confetti" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Confettis & effets</p>
          <p className="text-xs text-muted-foreground">{cues.length} déclenchements · 100% biodégradable</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-gold/25 to-primary/20 p-6 shadow-card">
          <PartyPopper className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le bon effet, à la seconde près</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque déclenchement synchronisé avec la musique, la lumière et la caméra live.
          </p>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Programmation</p>
          <div className="space-y-2">
            {cues.map((c) => (
              <article key={c.t} className={`rounded-2xl bg-gradient-to-br ${c.color} p-4 text-white shadow-soft`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1 text-[11px] font-bold opacity-90"><Timer className="h-3 w-3" /> {c.t}</p>
                    <p className="mt-1 font-serif text-lg leading-tight">{c.label}</p>
                    <p className="mt-0.5 text-xs opacity-90">{c.fx}</p>
                  </div>
                  <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-bold backdrop-blur">{c.type}</span>
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-[10px] opacity-80">
                    <span>Intensité</span><span>{c.intensity}%</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/25">
                    <div className="h-full rounded-full bg-white" style={{ width: `${c.intensity}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Bonnes pratiques
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Vérifier l'autorisation du lieu pour les cold sparks</li>
            <li>· Prévoir un ramassage rapide (kit balai fourni)</li>
            <li>· Éviter les confettis métalliques (non biodégradables)</li>
            <li>· Informer photographe et vidéaste des cues</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
