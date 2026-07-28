import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Users2, Award } from "lucide-react";

export const Route = createFileRoute("/app/pro-directory")({
  component: ProDirectory,
  head: () => ({
    meta: [
      { title: "Annuaire pro · Memento Live" },
      { name: "description", content: "1 240 prestataires vérifiés, notés par leurs pairs et par les mariés." },
      { property: "og:title", content: "Annuaire pro · Memento Live" },
      { property: "og:description", content: "Photographes, traiteurs, DJ, fleuristes : la sélection Memento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cats = [
  { l: "Photographes", n: 214, rate: "4.87 ★", top: "Léa Ferrand (Bordeaux)" },
  { l: "Traiteurs", n: 189, rate: "4.79 ★", top: "Kambo (Paris)" },
  { l: "Vidéastes", n: 142, rate: "4.84 ★", top: "Studio Antan (Lyon)" },
  { l: "DJ · Live band", n: 168, rate: "4.81 ★", top: "Nova Collectif" },
  { l: "Fleuristes", n: 156, rate: "4.90 ★", top: "Rose & Sauge" },
  { l: "Wedding planners", n: 98, rate: "4.92 ★", top: "Blanc & Cie" },
  { l: "Officiants laïques", n: 74, rate: "4.94 ★", top: "Camille Dorval" },
  { l: "Papetiers", n: 62, rate: "4.86 ★", top: "Atelier Plume" },
  { l: "Pâtissiers", n: 89, rate: "4.83 ★", top: "Yann Couvreur" },
  { l: "Voituriers", n: 48, rate: "4.71 ★", top: "Prestige Auto Cannes" },
];

function ProDirectory() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Annuaire pro</h1>
            <p className="text-xs text-muted-foreground">1 240 prestataires vérifiés</p>
          </div>
          <Users2 className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-gold/20 p-6">
          <Award className="h-6 w-6 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Notés par les mariés. Certifiés par nos équipes.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Chaque prestataire fait l'objet d'une visite terrain, d'un dossier fiscal vérifié et d'un score composite (avis, réactivité, respect des délais, RSE).</p>
        </section>

        <section className="space-y-2">
          {cats.map((c) => (
            <div key={c.l} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{c.l}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Coup de cœur · {c.top}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-xl text-primary">{c.n}</p>
                <p className="text-[10px] text-gold">{c.rate}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
