import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Coffee, Cookie, Croissant } from "lucide-react";

export const Route = createFileRoute("/events/$slug/brunch")({
  component: Brunch,
  head: () => ({
    meta: [
      { title: "Brunch du lendemain · MaFeliza" },
      { name: "description", content: "Prolongez la fête autour d'un brunch décontracté." },
      { property: "og:title", content: "Brunch · MaFeliza" },
      { property: "og:description", content: "Le lendemain, la douceur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const stations = [
  { l: "Bar à viennoiseries", items: "Croissants amande, kouign-amann, pain perdu brioché", icon: Croissant, color: "from-gold to-primary" },
  { l: "Œufs à la commande", items: "Bénédictine, mimosa, brouillés truffe", icon: Cookie, color: "from-primary to-primary-dark" },
  { l: "Café bar barista", items: "Flat white, café glacé, matcha latte", icon: Coffee, color: "from-foreground to-primary-dark" },
  { l: "Fruits & smoothies", items: "Bowls açaï, pastèque menthe, ananas rôti", icon: Cookie, color: "from-primary to-gold" },
];

function Brunch() {
  const { slug } = useParams({ from: "/events/$slug/brunch" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Brunch du lendemain</p>
          <p className="text-xs text-muted-foreground">Dimanche 15 juin · 11h → 15h</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/25 p-6 shadow-card">
          <Croissant className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le lendemain, la douceur</p>
          <p className="mt-2 text-sm text-muted-foreground">
            72 invités confirmés. Ambiance déjeuner sur l'herbe, dress code décontracté beige & lin.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-2xl bg-primary/10 p-3">
            <p className="font-serif text-2xl text-primary-dark">72</p>
            <p className="mt-0.5 text-muted-foreground">confirmés</p>
          </div>
          <div className="rounded-2xl bg-gold/25 p-3">
            <p className="font-serif text-2xl text-foreground">4</p>
            <p className="mt-0.5 text-muted-foreground">stations</p>
          </div>
          <div className="rounded-2xl bg-foreground p-3 text-background">
            <p className="font-serif text-2xl">28 €</p>
            <p className="mt-0.5 opacity-80">/pers.</p>
          </div>
        </section>

        <section className="space-y-2">
          {stations.map((s) => (
            <article key={s.l} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${s.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-lg leading-tight">{s.l}</p>
                  <p className="text-xs opacity-85">{s.items}</p>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Musique</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Playlist bossa-nova et néo-jazz curatée par le DJ Milan — 4h de vinyles doux, aucun best-of pénible.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-1.5 text-xs font-semibold text-background">Écouter un extrait</button>
        </section>

        <button className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-white shadow-glow">
          Envoyer les invitations brunch (72)
        </button>
      </main>
    </div>
  );
}
