import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Trees, Leaf } from "lucide-react";

export const Route = createFileRoute("/app/forest")({
  component: Forest,
  head: () => ({
    meta: [
      { title: "Forêt MaFeliza · MaFeliza" },
      { name: "description", content: "Un arbre planté pour chaque événement célébré. Notre engagement long terme." },
      { property: "og:title", content: "Forêt MaFeliza · MaFeliza" },
      { property: "og:description", content: "48 200 arbres plantés à ce jour, dans 4 forêts protégées." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const forests = [
  { l: "Forêt de Tronçais", loc: "Allier · France", trees: 18400, species: "Chênes, hêtres, alisiers" },
  { l: "Sierra Mixe", loc: "Oaxaca · Mexique", trees: 12750, species: "Encinos, pins Michoacán" },
  { l: "Kikonda", loc: "Ouganda", trees: 9820, species: "Musizi, Maesopsis eminii" },
  { l: "Karnataka Ghats", loc: "Inde", trees: 7230, species: "Teck, santal, banian" },
];

function Forest() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Forêt MaFeliza</h1>
            <p className="text-xs text-muted-foreground">48 200 arbres · 4 forêts protégées</p>
          </div>
          <Trees className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-green-900 via-emerald-800 to-foreground p-6 text-white">
          <Leaf className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Un événement, un arbre. Pour toujours.</h2>
          <p className="mt-3 text-sm opacity-90">Chaque mariage, baptême ou anniversaire créé sur MaFeliza offre un arbre planté dans une forêt certifiée par Reforest'Action et suivi 20 ans.</p>
          <div className="mt-5 grid grid-cols-3 gap-4 text-center">
            <div><p className="font-display text-2xl">48 200</p><p className="text-[10px] opacity-70">arbres plantés</p></div>
            <div><p className="font-display text-2xl">3 616 t</p><p className="text-[10px] opacity-70">CO₂ absorbés</p></div>
            <div><p className="font-display text-2xl">142 ha</p><p className="text-[10px] opacity-70">de forêt</p></div>
          </div>
        </section>

        <section>
          <h3 className="font-display text-lg mb-3">Nos forêts</h3>
          <div className="space-y-3">
            {forests.map((f) => (
              <div key={f.l} className="rounded-2xl border border-border/50 bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg">{f.l}</p>
                    <p className="text-xs text-muted-foreground">{f.loc}</p>
                  </div>
                  <span className="text-sm text-primary font-medium">{f.trees.toLocaleString("fr-FR")}</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Essences · {f.species}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Votre contribution personnelle</p>
          <p className="text-xs text-muted-foreground mt-1">3 événements créés · 3 arbres à votre nom dans la forêt de Tronçais · coordonnées GPS et photo satellite envoyées chaque printemps.</p>
        </div>
      </main>
    </div>
  );
}
