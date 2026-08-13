import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Utensils, ClipboardList } from "lucide-react";

export const Route = createFileRoute("/events/$slug/kitchen-brief")({
  component: KitchenBrief,
  head: () => ({
    meta: [
      { title: "Brief cuisine · MaFeliza" },
      { name: "description", content: "Fiche cuisine consolidée : couverts, allergènes, timings de service." },
      { property: "og:title", content: "Brief cuisine · MaFeliza" },
      { property: "og:description", content: "Un seul document pour le chef, imprimé en A3." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const services = [
  { t: "19:00", l: "Cocktail dinatoire", ppl: 148, notes: "12 stations · 6 pers/min/station · fin 20:30 pile" },
  { t: "20:45", l: "Entrée · Tartare de daurade", ppl: 142, notes: "6 vegan (galette pois chiche) · 2 sans gluten · 1 halal poisson" },
  { t: "21:15", l: "Plat · Filet de bœuf Rossini", ppl: 142, notes: "12 vegan (risotto artichauts) · 3 sans lactose · 1 halal (agneau) · 2 enfants (nuggets maison)" },
  { t: "22:30", l: "Pause bal 45 min", ppl: 148, notes: "Cuisine repos · restart plonge" },
  { t: "23:45", l: "Pièce montée", ppl: 148, notes: "4 sans gluten portion isolée · découpe par chef pâtissier" },
  { t: "01:30", l: "Snack tardif · Croque-monsieur truffe", ppl: 90, notes: "5 vegan (croque champignons) · frites rustiques" },
  { t: "10:00", l: "Brunch lendemain", ppl: 65, notes: "Buffet · 3 sans gluten · 2 vegan" },
];

function KitchenBrief() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Brief cuisine</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Chef Camille Lacoste · brigade 14 pers.</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Utensils className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-primary-dark p-6 text-white">
          <ClipboardList className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Un seul document. Zéro allergène oublié.</h2>
          <p className="mt-3 text-sm opacity-90">Généré depuis les RSVP, allergies, régimes spéciaux et plan de table. Imprimé en A3, plastifié, deux exemplaires en cuisine.</p>
        </section>

        <section className="space-y-2">
          {services.map((s) => (
            <div key={s.t} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <span className="font-display text-lg text-primary w-16">{s.t}</span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-sm">{s.l}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{s.ppl} couverts</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{s.notes}</p>
              </div>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Réunion de brief</p>
          <p className="text-xs text-muted-foreground mt-1">Vendredi 18h00 en cuisine · dégustation finale · validation timings avec DJ et MC.</p>
        </div>
      </main>
    </div>
  );
}
