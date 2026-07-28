import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Baby, Heart } from "lucide-react";

export const Route = createFileRoute("/events/$slug/godparents")({
  component: Godparents,
  head: () => ({
    meta: [
      { title: "Parrains & marraines · Memento Live" },
      { name: "description", content: "Coordination avec les parrains et marraines pour le baptême." },
      { property: "og:title", content: "Parrains & marraines · Memento Live" },
      { property: "og:description", content: "Choisir, engager, célébrer." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const roles = [
  { n: "Camille Bertrand", role: "Marraine principale", tasks: ["Porter Louis à l'autel", "Discours court après baptême", "Chandelle allumée"], gift: "Médaille miraculeuse gravée" },
  { n: "Julien Moreau", role: "Parrain principal", tasks: ["Lecture Épître aux Corinthiens", "Chandelle allumée", "Signature registre paroissial"], gift: "Bible reliée cuir dédicacée" },
  { n: "Élise Fournier", role: "Marraine de cœur", tasks: ["Album souvenir", "Lecture d'un poème choisi"], gift: "Coffret naissance Diptyque" },
  { n: "Yann Le Guen", role: "Parrain de cœur", tasks: ["Vidéaste amateur cérémonie", "Discours au repas"], gift: "Livre pour ses 18 ans" },
];

function Godparents() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Parrains & marraines</h1>
            <p className="text-xs text-muted-foreground">Baptême de Louis · 12 septembre 2026</p>
          </div>
          <Baby className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-cream to-primary/10 p-6">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Quatre personnes qui l'accompagneront pour la vie.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Deux parrains catholiques déclarés à la paroisse, deux parrains de cœur reconnus par la famille.</p>
        </section>

        <section className="space-y-3">
          {roles.map((r) => (
            <div key={r.n} className="rounded-2xl border border-border/50 bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">{r.n}</p>
                  <p className="text-xs text-primary">{r.role}</p>
                </div>
              </div>
              <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Missions</p>
              <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                {r.tasks.map((t) => <li key={t}>· {t}</li>)}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground"><span className="text-primary">Cadeau prévu :</span> {r.gift}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
