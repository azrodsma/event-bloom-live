import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Handshake, Utensils } from "lucide-react";

export const Route = createFileRoute("/events/$slug/vendor-meals")({
  component: VendorMeals,
  head: () => ({
    meta: [
      { title: "Repas prestataires · MaFeliza" },
      { name: "description", content: "Nourrir ceux qui rendent la journée possible." },
      { property: "og:title", content: "Repas pros · MaFeliza" },
      { property: "og:description", content: "22 prestataires, 22 assiettes chaudes, 0 sandwich sec." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const pros = [
  { role: "Photographe + assistante", n: 2, diet: "1 flexitarien" },
  { role: "Vidéaste + pilote drone", n: 2, diet: "—" },
  { role: "DJ + technicien", n: 2, diet: "1 sans gluten" },
  { role: "Live band", n: 5, diet: "2 végé" },
  { role: "Wedding planner + assistante", n: 2, diet: "—" },
  { role: "Officiante laïque", n: 1, diet: "végane" },
  { role: "MC animateur", n: 1, diet: "—" },
  { role: "Fleuriste (rétablissement)", n: 2, diet: "—" },
  { role: "Voiturier + navetteurs", n: 3, diet: "1 halal" },
  { role: "Agent sécurité", n: 2, diet: "1 halal" },
];

function VendorMeals() {
  const total = pros.reduce((a, p) => a + p.n, 0);
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Repas prestataires</h1>
            <p className="text-xs text-muted-foreground">{total} pros · dîner 20:15</p>
          </div>
          <Utensils className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Handshake className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Un bon repas, pas un plateau froid dans la cuisine.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Nous militons pour que les prestataires soient traités comme des invités : même menu principal, dessert compris, servi assis pendant le calme du plat des mariés.</p>
        </section>

        <section className="space-y-2">
          {pros.map((p) => (
            <div key={p.role} className="rounded-2xl border border-border/50 bg-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{p.role}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{p.diet}</p>
              </div>
              <span className="font-display text-xl text-primary">{p.n}</span>
            </div>
          ))}
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Menu prestataires · Chef Kambo</p>
          <p className="text-xs text-muted-foreground mt-1">Salade tiède aux herbes du potager · Suprême de volaille label rouge écrasé de pomme de terre truffée · Tartelette figue-mascarpone. Alternative végane sur demande.</p>
        </div>
      </main>
    </div>
  );
}
