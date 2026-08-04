import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sun, Umbrella } from "lucide-react";

export const Route = createFileRoute("/events/$slug/outdoor")({
  component: Outdoor,
  head: () => ({
    meta: [
      { title: "Extérieur · MaFeliza" },
      { name: "description", content: "Gestion des espaces extérieurs, mobilier, ombrage et éclairage." },
      { property: "og:title", content: "Extérieur · MaFeliza" },
      { property: "og:description", content: "Le jardin transformé en salle de bal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const zones = [
  { l: "Prairie apéritif", size: "400 m²", cap: "148 debout", eq: "6 mange-debout, 4 canapés modulaires, guirlandes guinguette 40m" },
  { l: "Verger cocktail", size: "220 m²", cap: "60 assis", eq: "12 poufs vintage, tapis kilim, bar apéro en tonneaux" },
  { l: "Pergola cérémonie laïque", size: "80 m²", cap: "150 assis", eq: "Arche florale 3m, 150 chaises rotin, allée de tapis" },
  { l: "Terrasse dîner", size: "600 m²", cap: "148 assis", eq: "18 tables rondes, chapiteau si pluie H+2h" },
  { l: "Piste de danse jardin", size: "80 m²", cap: "100 debout", eq: "Parquet démontable Bolefloor, éclairage 8 lyres LED" },
];

function Outdoor() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Extérieur</h1>
            <p className="text-xs text-muted-foreground">Château de Malviès · 5 zones activées</p>
          </div>
          <Sun className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Umbrella className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Cinq espaces, une continuité.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Chaque zone a son ambiance et son mobilier. Plan de replis chapiteau activable en 2h en cas d'orage.</p>
        </section>

        <section className="space-y-3">
          {zones.map((z) => (
            <div key={z.l} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg">{z.l}</p>
                <div className="text-right">
                  <p className="text-xs text-primary">{z.size}</p>
                  <p className="text-xs text-muted-foreground">{z.cap}</p>
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{z.eq}</p>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Éclairage nocturne</p>
          <p className="text-xs text-muted-foreground mt-1">4 500 ampoules basse conso · 380 lanternes marocaines · balisage LED chaussée · minuteries automatiques 20h30-04h30.</p>
        </div>
      </main>
    </div>
  );
}
