import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, PawPrint, Heart, Camera, Bone } from "lucide-react";

export const Route = createFileRoute("/events/$slug/ring-bearer")({
  component: RingBearer,
  head: () => ({
    meta: [
      { title: "Porteur d'alliances · Memento Live" },
      { name: "description", content: "Confiez les alliances à un enfant, un chien ou un drone." },
      { property: "og:title", content: "Porteur d'alliances · Memento Live" },
      { property: "og:description", content: "Le moment le plus attendu de la cérémonie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const options = [
  { name: "Iris · 6 ans", role: "Filleule", pros: "Complice du couple", cons: "Timide devant du monde", selected: true, color: "from-primary to-gold" },
  { name: "Nino · Golden Retriever", role: "Chien de famille", pros: "Photos irrésistibles", cons: "Prévoir un dresseur", selected: false, color: "from-gold to-primary-dark" },
  { name: "Drone porteur", role: "Prestataire tech", pros: "Effet cinématique", cons: "Salle intérieure requise", selected: false, color: "from-foreground to-primary-dark" },
];

function RingBearer() {
  const { slug } = useParams({ from: "/events/$slug/ring-bearer" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Porteur d'alliances</p>
          <p className="text-xs text-muted-foreground">Répétition prévue J-1 · 17h</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/25 p-6 shadow-card">
          <Heart className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Le moment le plus attendu</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Trois pistes shortlistées. Chaque option inclut coussin, harnais et plan B en cas de trac ou d'imprévu.
          </p>
        </section>

        <section className="space-y-3">
          {options.map((o) => (
            <article key={o.name} className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${o.color} p-5 text-white shadow-soft`}>
              {o.selected && (
                <span className="absolute right-4 top-4 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-primary-dark">Choisi</span>
              )}
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-white/20">
                  <PawPrint className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-serif text-xl leading-tight">{o.name}</p>
                  <p className="text-xs opacity-85">{o.role}</p>
                </div>
              </div>
              <div className="mt-4 space-y-1 text-xs">
                <p className="opacity-90">✓ {o.pros}</p>
                <p className="opacity-80">△ {o.cons}</p>
              </div>
              {!o.selected && (
                <button className="mt-4 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold">Choisir cette option</button>
              )}
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Kit du porteur</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[11px]">
            <div className="rounded-xl bg-cream p-3">
              <Heart className="mx-auto h-4 w-4 text-primary-dark" />
              <p className="mt-1 font-semibold">Coussin lin</p>
            </div>
            <div className="rounded-xl bg-cream p-3">
              <Bone className="mx-auto h-4 w-4 text-primary-dark" />
              <p className="mt-1 font-semibold">Récompenses</p>
            </div>
            <div className="rounded-xl bg-cream p-3">
              <Camera className="mx-auto h-4 w-4 text-primary-dark" />
              <p className="mt-1 font-semibold">Photographe</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
