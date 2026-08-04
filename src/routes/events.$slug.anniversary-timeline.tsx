import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, PartyPopper, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/anniversary-timeline")({
  component: AnnivTimeline,
  head: () => ({
    meta: [
      { title: "Timeline anniversaire · MaFeliza" },
      { name: "description", content: "Scénographie minute par minute d'un 40 ans mémorable." },
      { property: "og:title", content: "Anniversaire · MaFeliza" },
      { property: "og:description", content: "18h → 04h : le rythme d'une nuit sans faux temps mort." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const slots = [
  { t: "18:00", l: "Accueil champagne rooftop", d: "Cocktail Ruinart · panorama coucher soleil" },
  { t: "19:15", l: "Discours surprise best friend", d: "3 min · vidéo montage 40 ans en 40 secondes" },
  { t: "20:00", l: "Dîner assis 3 services", d: "Chef Yoni Saada · menu autour du chiffre 4" },
  { t: "22:00", l: "Blind test décennies", d: "80s → 20s · équipes de 8 · Awards personnalisés" },
  { t: "23:15", l: "Passage gâteau + feu de Bengale", d: "Pièce montée Yann Couvreur · 40 bougies bio" },
  { t: "23:45", l: "Ouverture piste · live band", d: "Set funk 45 min · The Velvet Session" },
  { t: "01:00", l: "DJ takeover house", d: "Nova Collectif · lasers verts + fumée basse" },
  { t: "03:00", l: "Bar à ramen tardif", d: "Chef itinérant Ippudo · 3 recettes" },
  { t: "04:00", l: "Navettes retour", d: "3 minibus VTC · check nominatif" },
];

function AnnivTimeline() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "anniversaire-40-camille" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Timeline anniversaire</h1>
            <p className="text-xs text-muted-foreground">40 ans · 10h de fête</p>
          </div>
          <PartyPopper className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-gold to-primary p-6 text-white">
          <Sparkles className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Un mariage ne dure qu'un jour. Un anniversaire, ça se rythme.</h2>
          <p className="mt-3 text-sm opacity-90">On alterne pics d'émotion, moments de partage et respirations. Aucun creux au-dessus de 20 min.</p>
        </section>

        <section className="space-y-2">
          {slots.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-primary font-semibold">{s.t}</span>
                {i < slots.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium text-sm">{s.l}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.d}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
