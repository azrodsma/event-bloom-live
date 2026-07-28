import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Download, Grid3x3 } from "lucide-react";

export const Route = createFileRoute("/events/$slug/disposable-cams")({
  component: DisposableCams,
  head: () => ({
    meta: [
      { title: "Appareils jetables · Memento Live" },
      { name: "description", content: "L'esprit argentique retrouvé — sans le développement à l'aveugle." },
      { property: "og:title", content: "Appareils jetables · Memento Live" },
      { property: "og:description", content: "Grain argentique, souvenirs nets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cams = [
  { id: "01", assigned: "Table Pivoine", shots: 24, taken: 18, color: "from-primary to-primary-dark" },
  { id: "02", assigned: "Table Rose", shots: 24, taken: 22, color: "from-gold to-primary" },
  { id: "03", assigned: "Table Camélia", shots: 24, taken: 11, color: "from-primary-dark to-gold" },
  { id: "04", assigned: "Table Kids", shots: 24, taken: 24, color: "from-foreground to-primary-dark" },
  { id: "05", assigned: "Table Iris", shots: 24, taken: 6, color: "from-primary to-gold" },
];

function DisposableCams() {
  const { slug } = useParams({ from: "/events/$slug/disposable-cams" });
  const total = cams.reduce((a, c) => a + c.taken, 0);
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Appareils jetables</p>
          <p className="text-xs text-muted-foreground">{cams.length} appareils · {total} clichés</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-gold/25 to-primary/15 p-6 shadow-card">
          <Camera className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Grain argentique, souvenirs nets</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Nous confions un appareil argentique à chaque table. Le scan haute résolution vous arrive sous 7 jours.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {cams.map((c) => {
            const pct = Math.round((c.taken / c.shots) * 100);
            return (
              <article key={c.id} className={`rounded-2xl bg-gradient-to-br ${c.color} p-4 text-white shadow-soft`}>
                <p className="text-[10px] font-bold uppercase opacity-80">Cam #{c.id}</p>
                <p className="mt-1 font-serif text-lg leading-tight">{c.assigned}</p>
                <p className="mt-2 font-serif text-3xl leading-none">{c.taken}<span className="text-sm opacity-70">/{c.shots}</span></p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-2 text-[10px] opacity-80">{pct === 100 ? "Pellicule pleine · à récupérer" : `${c.shots - c.taken} clichés restants`}</p>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Grid3x3 className="h-3.5 w-3.5" /> Consignes de table
          </div>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Un cliché par convive minimum</li>
            <li>· Photos spontanées · pas de mises en scène</li>
            <li>· Déposer l'appareil au bar avant minuit</li>
            <li>· Ne pas ouvrir : la pellicule serait voilée</li>
          </ul>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Download className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Scan haute résolution</p>
          <p className="mt-1 text-sm opacity-80">
            Développement labo + scans 3600 dpi + retouche douce. Livraison 7 jours.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Confirmer le développement — 89 €</button>
        </section>
      </main>
    </div>
  );
}
