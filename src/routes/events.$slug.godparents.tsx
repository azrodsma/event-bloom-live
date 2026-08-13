import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Baby, Heart } from "lucide-react";

export const Route = createFileRoute("/events/$slug/godparents")({
  component: Godparents,
  head: () => ({
    meta: [
      { title: "Parrains & marraines · MaFeliza" },
      { name: "description", content: "Coordination avec les parrains et marraines pour le baptême." },
      { property: "og:title", content: "Parrains & marraines · MaFeliza" },
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
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link
            to="/events/$slug"
            params={{ slug: "mariage-lea-thomas" }}
            className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95"
            aria-label="Retour"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Parrains & marraines</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Baptême de Louis · 12 septembre 2026</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Baby className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="relative overflow-hidden rounded-[32px] bg-gradient-mesh p-7 shadow-card ring-1 ring-border/60">
          <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-light px-3 py-1 text-[11px] font-semibold text-gold">
            <Heart className="h-3.5 w-3.5" /> Cercle de cœur
          </span>
          <h2 className="mt-3 font-serif text-3xl leading-[1.05] sm:text-4xl">Quatre personnes qui l'accompagneront pour la vie.</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Deux parrains catholiques déclarés à la paroisse, deux parrains de cœur reconnus par la famille.
          </p>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          {roles.map((r) => (
            <div
              key={r.n}
              className="rounded-[26px] bg-surface p-5 shadow-card ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-0.5 hover:ring-primary/30"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-primary font-serif text-sm text-primary-foreground">
                  {r.n.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg leading-tight">{r.n}</p>
                  <p className="truncate text-[11px] font-semibold text-primary">{r.role}</p>
                </div>
              </div>
              <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Missions</p>
              <ul className="mt-1.5 space-y-1.5 text-[13px] leading-relaxed text-muted-foreground">
                {r.tasks.map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-4 rounded-2xl bg-gold-light/60 px-3 py-2 text-[11px] font-medium text-foreground">
                <span className="text-gold">Cadeau prévu :</span> {r.gift}
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
