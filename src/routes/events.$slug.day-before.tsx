import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sunrise, Coffee } from "lucide-react";

export const Route = createFileRoute("/events/$slug/day-before")({
  component: DayBefore,
  head: () => ({
    meta: [
      { title: "Veille du jour J · MaFeliza" },
      { name: "description", content: "Répétition, dîner de veille et récap' logistique." },
      { property: "og:title", content: "Veille · MaFeliza" },
      { property: "og:description", content: "Le calme, la répétition, la nuit qu'on gagne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const day = [
  { t: "09:00", l: "Arrivée mariés au Château", w: "Chambre nuptiale · check-in prioritaire" },
  { t: "10:00", l: "Livraison mobilier + vaisselle", w: "Loueurs Options + Alter Ego · inventaire signature" },
  { t: "13:00", l: "Déjeuner léger équipe organisation", w: "Traiteur Kambo · 12 pers." },
  { t: "14:30", l: "Répétition cérémonie religieuse", w: "Église Saint-Vincent · 45 min · témoins et enfants" },
  { t: "16:00", l: "Répétition entrée & discours", w: "Salle de bal · MC Antoine · DJ Nova · lumières" },
  { t: "17:30", l: "Installation fleurs (partielle)", w: "Arche laïque montée · centres livrés à J+0" },
  { t: "19:30", l: "Dîner de veille · 48 pers.", w: "Familles proches + témoins · Auberge Le Pressoir" },
  { t: "22:30", l: "Retour Château · nuit apaisée", w: "Tisane camomille · Kindle interdit après 23h" },
];

function DayBefore() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Veille du jour J</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Jeudi 4 juin</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Sunrise className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Coffee className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">La journée qui prépare la journée.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Répétitions, retrouvailles proches, sommeil sacré. On ne fait rien d'énervant après 20h.</p>
        </section>

        <section className="space-y-2">
          {day.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-primary">{s.t}</span>
                {i < day.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium text-sm">{s.l}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.w}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Kit de survie chambre nuptiale</p>
          <p className="text-xs text-muted-foreground mt-1">Diffuseur lavande · masque yeux soie · huile Puressentiel sommeil · réveil doux Loftie · playlist "Nuit avant" 40 min.</p>
        </div>
      </main>
    </div>
  );
}
