import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Palette, Wand2 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/hair-makeup")({
  component: HairMakeup,
  head: () => ({
    meta: [
      { title: "Coiffure & maquillage · MaFeliza" },
      { name: "description", content: "Séances d'essai, timing du jour J, look book." },
      { property: "og:title", content: "Coiffure & maquillage · MaFeliza" },
      { property: "og:description", content: "Vous, sublimé·e — sans artifice." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const looks = [
  { l: "Chignon bas texturé", type: "Coiffure", desc: "Torsades souples, mèches libres" },
  { l: "Vagues Hollywoodiennes", type: "Coiffure", desc: "Volume glamour, brillance soie" },
  { l: "Maquillage nude glow", type: "Maquillage", desc: "Peau lumineuse, cils naturels" },
  { l: "Regard smoky bronze", type: "Maquillage", desc: "Œil intense, lèvres nude" },
];

const trials = [
  { d: "8 juin", pro: "Léna · coiffure", note: "Essai chignon validé · repérage accessoires" },
  { d: "22 juin", pro: "Nadia · maquillage", note: "Nude glow retenu · fond de teint testé" },
  { d: "1er juillet", pro: "Séance photo essai", note: "Test flash + lumière naturelle" },
];

function HairMakeup() {
  const { slug } = useParams({ from: "/events/$slug/hair-makeup" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Coiffure & maquillage</p>
          <p className="text-xs text-muted-foreground">2 essais · 5 personnes le jour J</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-cream to-gold/20 p-6 shadow-card">
          <Wand2 className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Vous, sublimé·e — sans artifice</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Look book validé, timing partagé, produits testés en amont pour éviter toute réaction cutanée.
          </p>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Palette className="h-3.5 w-3.5" /> Look book
          </p>
          <div className="grid grid-cols-2 gap-2">
            {looks.map((l) => (
              <article key={l.l} className="rounded-2xl bg-surface p-4 shadow-soft">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold uppercase text-primary-dark">{l.type}</span>
                <p className="mt-2 font-serif text-lg leading-tight">{l.l}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{l.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <p className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Essais programmés
          </p>
          <div className="space-y-2">
            {trials.map((t) => (
              <article key={t.d} className="flex items-center gap-3 rounded-2xl bg-cream p-3.5 shadow-soft">
                <p className="font-serif text-lg text-primary-dark">{t.d}</p>
                <div className="border-l border-border/60 pl-3">
                  <p className="text-sm font-semibold">{t.pro}</p>
                  <p className="text-[11px] text-muted-foreground">{t.note}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Kit retouches jour J</p>
          <p className="mt-2 text-sm">Poudre matifiante, rouge à lèvres, laque discrète, épingles, blotting papers — glissés dans la pochette de la témoin.</p>
        </section>
      </main>
    </div>
  );
}
