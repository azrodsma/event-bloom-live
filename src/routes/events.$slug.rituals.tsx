import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Feather, Sparkles, Music } from "lucide-react";

export const Route = createFileRoute("/events/$slug/rituals")({
  component: Rituals,
  head: () => ({
    meta: [
      { title: "Rituels symboliques · MaFeliza" },
      { name: "description", content: "Composez votre cérémonie avec des rituels qui vous ressemblent." },
      { property: "og:title", content: "Rituels · MaFeliza" },
      { property: "og:description", content: "Des gestes forts, chargés de sens." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const rituals = [
  { name: "Rituel du sable", origin: "Hawaïen", duration: "4 min", desc: "Deux sables colorés qui n'en font qu'un dans une carafe scellée.", selected: true },
  { name: "Rituel du ruban", origin: "Celte", duration: "3 min", desc: "Trois rubans noués autour des poignets par l'officiant.", selected: true },
  { name: "Cérémonie de la bougie", origin: "Européen", duration: "2 min", desc: "Chaque famille allume une flamme réunie au centre.", selected: false },
  { name: "Rituel de l'arbre", origin: "Nordique", duration: "6 min", desc: "Plantation d'un olivier avec de la terre apportée par les invités.", selected: true },
  { name: "Rituel de la capsule", origin: "Contemporain", duration: "5 min", desc: "Lettres scellées à ouvrir aux 10 ans du mariage.", selected: false },
];

function Rituals() {
  const { slug } = useParams({ from: "/events/$slug/rituals" });
  const total = rituals.filter((r) => r.selected).length;
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Rituels</p>
          <p className="text-xs text-muted-foreground">{total} sélectionnés · 13 min cumulées</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <Feather className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Des gestes forts, chargés de sens</p>
          <p className="mt-2 text-sm opacity-90">
            Nous coordonnons accessoires, musiques et texte de l'officiant pour chaque rituel choisi.
          </p>
        </section>

        <section className="space-y-2">
          {rituals.map((r) => (
            <article key={r.name} className={`rounded-2xl border-2 p-4 shadow-soft transition ${
              r.selected ? "border-primary bg-primary/5" : "border-transparent bg-surface"
            }`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-serif text-lg leading-tight">{r.name}</p>
                    {r.selected && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">Choisi</span>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{r.origin} · {r.duration}</p>
                </div>
                <button className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  r.selected ? "bg-primary text-white" : "border border-border"
                }`}>
                  {r.selected ? "Retirer" : "Ajouter"}
                </button>
              </div>
              <p className="mt-3 text-sm text-foreground/85">{r.desc}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl bg-cream p-5 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary-dark">
            <Music className="h-3.5 w-3.5" /> Bande son suggérée
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Une playlist instrumentale de 13 min est générée pour accompagner l'enchaînement de vos rituels.
          </p>
          <button className="mt-3 flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            <Sparkles className="h-3.5 w-3.5" /> Générer la playlist
          </button>
        </section>
      </main>
    </div>
  );
}
