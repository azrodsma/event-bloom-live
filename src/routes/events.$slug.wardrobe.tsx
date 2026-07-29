import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBag, Sparkles, Ruler } from "lucide-react";

export const Route = createFileRoute("/events/$slug/wardrobe")({
  component: Wardrobe,
  head: () => ({
    meta: [
      { title: "Vestiaire · Memento Live" },
      { name: "description", content: "Coordonnez les tenues de la garde rapprochée sans stress." },
      { property: "og:title", content: "Vestiaire · Memento Live" },
      { property: "og:description", content: "Une harmonie visuelle sans imposer d'uniforme." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const outfits = [
  { role: "Mariée", who: "Léa", status: "Essayage 3/3", tag: "Sur-mesure", color: "from-primary to-primary-dark" },
  { role: "Marié", who: "Thomas", status: "Retouches", tag: "Prêt-à-porter", color: "from-foreground to-primary-dark" },
  { role: "Témoin 1", who: "Julie", status: "Commandé", tag: "Couleur miel", color: "from-gold to-primary" },
  { role: "Témoin 2", who: "Alice", status: "En attente", tag: "Couleur miel", color: "from-primary to-gold" },
  { role: "Enfant d'honneur", who: "Iris", status: "Reçu", tag: "Ivoire", color: "from-cream to-gold" },
];

const palette = ["#E85D8E", "#FFF8F4", "#D9A441", "#F2C4B7", "#B5895C"];

function Wardrobe() {
  const { slug } = useParams({ from: "/events/$slug/wardrobe" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Vestiaire</p>
          <p className="text-xs text-muted-foreground">5 tenues · essayage final J-14</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/10 to-gold/20 p-6 shadow-card">
          <ShoppingBag className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Une harmonie visuelle sans uniforme</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Suivez commandes, essayages et retouches en un tableau. Un lookbook privé est envoyé à la garde rapprochée.
          </p>
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Palette validée</p>
          <div className="mt-3 flex gap-2">
            {palette.map((c) => (
              <div key={c} className="flex-1">
                <div className="h-16 rounded-2xl shadow-soft" style={{ backgroundColor: c }} />
                <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">{c}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          {outfits.map((o) => (
            <article key={o.who} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${o.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20 font-bold">
                  {o.who[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase opacity-80">{o.role}</p>
                  <p className="font-serif text-xl leading-tight">{o.who}</p>
                </div>
                <span className="rounded-full bg-white/25 px-2 py-1 text-[10px] font-semibold">{o.tag}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="opacity-90">{o.status}</span>
                <span className="flex items-center gap-1 opacity-90"><Ruler className="h-3 w-3" /> Fiche mensurations</span>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Sparkles className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Location écoresponsable</p>
          <p className="mt-1 text-sm opacity-80">
            Nos partenaires (Les Cachotières, Panoply) louent les tenues des invités qui le souhaitent : -70% d'empreinte carbone.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Proposer aux invités</button>
        </section>
      </main>
    </div>
  );
}
