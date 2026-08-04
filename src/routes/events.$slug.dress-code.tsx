import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Shirt, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/events/$slug/dress-code")({
  component: DressCode,
  head: () => ({
    meta: [
      { title: "Dress code · MaFeliza" },
      { name: "description", content: "Palette de couleurs, tenues suggérées et à éviter." },
      { property: "og:title", content: "Dress code · MaFeliza" },
      { property: "og:description", content: "Élégant, cohérent, personnel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const palette = ["#E85D8E", "#D9A441", "#FFF8F4", "#3C2A21", "#B8D4C8"];
const yes = ["Costumes clairs ou pastels", "Robes fluides mi-longues ou longues", "Nœuds papillon assumés", "Chapeaux et capelines élégants", "Chaussures confortables (gazon 30% de la soirée)"];
const no = ["Blanc, écru, ivoire (réservés à la mariée)", "Jeans, sneakers, tenues de plage", "Tenues transparentes ou trop courtes", "Rouge total look (couleur du témoin d'honneur)"];

function DressCode() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Dress code</h1>
            <p className="text-xs text-muted-foreground">Chic bohème · Palette Léa & Thomas</p>
          </div>
          <Shirt className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <p className="text-xs uppercase tracking-widest text-primary">Palette suggérée</p>
          <div className="mt-3 flex gap-2">
            {palette.map((c) => (
              <div key={c} className="flex-1 aspect-square rounded-2xl shadow-inner" style={{ background: c }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Roses tendres, dorés doux, verts sauge et bruns chauds. Le blanc et l'écru sont réservés à la mariée.</p>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />À privilégier</h3>
          <div className="space-y-2">
            {yes.map((y) => (
              <div key={y} className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">✓ {y}</div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">À éviter</h3>
          <div className="space-y-2">
            {no.map((n) => (
              <div key={n} className="rounded-xl border border-border bg-cream/70 p-3 text-sm">✗ {n}</div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-cream p-5 flex items-start gap-3">
          <Users className="h-4 w-4 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">Pas de tenue ? Pas de panique.</p>
            <p className="text-xs text-muted-foreground">Location Panoply.club (-20% avec code LEATHOMAS26) · retouches express Ombelle chez soi.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
