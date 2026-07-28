import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Star, Verified, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/pro-directory")({
  component: ProDirectory,
  head: () => ({
    meta: [
      { title: "Pros vérifiés · Memento Live" },
      { name: "description", content: "Annuaire de prestataires vérifiés : photographes, DJ, traiteurs, wedding planners." },
      { property: "og:title", content: "Pros vérifiés · Memento Live" },
      { property: "og:description", content: "Une sélection de confiance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const categories = ["Tous", "Photo", "DJ", "Traiteur", "Wedding planner", "Fleuriste", "Vidéo"];

const pros = [
  { name: "Studio Aurore", cat: "Photo", city: "Paris", rate: 4.9, reviews: 128, gold: true, price: "€€€", tag: "Reportage émotionnel" },
  { name: "DJ Solène", cat: "DJ", city: "Lyon", rate: 4.8, reviews: 96, gold: true, price: "€€", tag: "House & French touch" },
  { name: "Maison Vera", cat: "Traiteur", city: "Bordeaux", rate: 4.9, reviews: 74, gold: true, price: "€€€€", tag: "Cuisine bistronomique locavore" },
  { name: "Élodie · Planner", cat: "Wedding planner", city: "Nice", rate: 5.0, reviews: 42, gold: true, price: "€€€", tag: "Cérémonies laïques poétiques" },
  { name: "Atelier Foliage", cat: "Fleuriste", city: "Lille", rate: 4.7, reviews: 58, gold: false, price: "€€", tag: "Compositions sauvages & séchées" },
  { name: "Studio Verso", cat: "Vidéo", city: "Toulouse", rate: 4.9, reviews: 61, gold: true, price: "€€€", tag: "Films cinématiques 6K" },
];

function ProDirectory() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Pros vérifiés</p>
          <p className="text-xs text-muted-foreground">{pros.length} pros · liseré doré = vérifié</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <Award className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Une sélection de confiance</p>
          <p className="mt-2 text-sm opacity-90">
            Chaque pro doré est audité : SIRET, assurance RCP, avis clients recoupés, éthique respectée.
          </p>
        </section>

        <div className="-mx-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 px-4">
            {categories.map((c, i) => (
              <button
                key={c}
                className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold ${
                  i === 0 ? "bg-primary text-white" : "bg-surface text-muted-foreground shadow-soft"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-2">
          {pros.map((p) => (
            <article
              key={p.name}
              className={`rounded-2xl bg-surface p-3.5 shadow-soft ${p.gold ? "ring-1 ring-gold/50" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl font-bold text-white ${p.gold ? "bg-gradient-to-br from-gold to-primary" : "bg-gradient-to-br from-muted to-foreground"}`}>
                  {p.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    {p.gold && <Verified className="h-3.5 w-3.5 fill-gold text-white" />}
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {p.cat} · {p.city} · {p.price}
                  </p>
                  <p className="mt-1 text-xs">{p.tag}</p>
                </div>
                <div className="text-right">
                  <p className="flex items-center gap-0.5 text-sm font-bold">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {p.rate}
                  </p>
                  <p className="text-[10px] text-muted-foreground">{p.reviews} avis</p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex-1 rounded-full bg-cream py-2 text-xs font-semibold">Voir le portfolio</button>
                <button className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-white">Demander un devis</button>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <Sparkles className="h-5 w-5 text-primary-dark" />
          <p className="mt-2 font-serif text-lg leading-tight">Vous êtes un pro ?</p>
          <p className="mt-1 text-xs text-muted-foreground">Postulez à la certification Memento (gratuit, 15 min).</p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Devenir pro vérifié
          </button>
        </section>
      </main>
    </div>
  );
}
