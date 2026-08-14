import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Baby, Palette, Gamepad2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/kids-corner")({
  component: KidsCorner,
  head: () => ({
    meta: [
      { title: "Coin enfants · MaFeliza" },
      { name: "description", content: "Un cocon dédié pour les plus petits invités." },
      { property: "og:title", content: "Coin enfants · MaFeliza" },
      { property: "og:description", content: "Ateliers créatifs, sieste douce, animatrice diplômée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const zones = [
  { l: "Atelier créatif", d: "Peinture pastel, coloriages géants, pâte à modeler", icon: Palette, color: "from-primary to-primary-dark" },
  { l: "Coin jeux", d: "Kaplas, memory, mini-quilles, jeux de rôle costumés", icon: Gamepad2, color: "from-gold to-primary" },
  { l: "Cocon sieste", d: "Tipi, coussins, veilleuses tamisées, playlist berceuse", icon: Baby, color: "from-primary-dark to-foreground" },
];

const kids = [
  { name: "Nino", age: 3, note: "Sieste vers 15h · pas de gluten" },
  { name: "Léa", age: 5, note: "Adore dessiner · végétarienne" },
  { name: "Milo", age: 4, note: "Fatigable · doudou obligatoire" },
  { name: "Zoé", age: 7, note: "Grande sœur relais · autonome" },
  { name: "Adam", age: 2, note: "Sieste 13h30 · biberon 16h" },
];

function KidsCorner() {
  const { slug } = useParams({ from: "/events/$slug/kids-corner" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Coin enfants</p>
          <p className="text-xs text-muted-foreground">5 enfants · 2 animatrices</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-gold/20 to-cream p-6 shadow-card">
          <Baby className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Un cocon pour les tout-petits</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Espace dédié encadré par deux animatrices BAFA. Menu enfant, ateliers, sieste, retour aux parents sur simple appel.
          </p>
        </section>

        <section className="grid gap-3">
          {zones.map((z) => (
            <article key={z.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${z.color} p-5 text-white shadow-soft`}>
              <z.icon className="h-5 w-5" />
              <p className="mt-2 font-serif text-xl leading-tight">{z.l}</p>
              <p className="mt-1 text-xs opacity-90">{z.d}</p>
            </article>
          ))}
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Petits invités confiés</p>
          <div className="space-y-2">
            {kids.map((k) => (
              <article key={k.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-primary/15 font-serif text-lg text-primary-dark">
                  {k.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{k.name} <span className="text-xs text-muted-foreground">· {k.age} ans</span></p>
                  <p className="text-[11px] text-muted-foreground">{k.note}</p>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-dark">
                  Bracelet #{k.name.slice(0, 2).toUpperCase()}
                </span>
              </article>
            ))}
          </div>
        </section>

        <button className="w-full rounded-full bg-foreground py-3 text-sm font-semibold text-background">Contacter l'animatrice</button>
      </main>
    </div>
  );
}
