import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/photo-timeline")({
  component: PhotoTimeline,
  head: () => ({
    meta: [
      { title: "Timeline photo · MaFeliza" },
      { name: "description", content: "Minute par minute avec le photographe : lumière, lieux, moments clés." },
      { property: "og:title", content: "Timeline photo · MaFeliza" },
      { property: "og:description", content: "10h de reportage millimétré avec Léa Ferrand." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const slots = [
  { t: "10:30", d: "Getting ready mariée", light: "Fenêtre nord · voile douce", loc: "Suite Rose · Château" },
  { t: "12:00", d: "Getting ready marié", light: "Terrasse ombragée", loc: "Suite Cèdre" },
  { t: "13:15", d: "First look", light: "Verger · plein soleil filtré", loc: "Allée des pommiers" },
  { t: "14:30", d: "Cérémonie religieuse", light: "Intérieur église · vitraux", loc: "Saint-Vincent" },
  { t: "16:00", d: "Sortie & pétales", light: "Parvis · haute lumière", loc: "Parvis église" },
  { t: "16:45", d: "Portraits famille (22 groupes)", light: "Ombre longue verger", loc: "Verger" },
  { t: "17:30", d: "Cocktail · reportage libre", light: "Golden hour approche", loc: "Pergola + prairie" },
  { t: "20:15", d: "Séance couple golden hour", light: "Golden 25 min pile", loc: "Champ de blé voisin" },
  { t: "21:00", d: "Entrée bal & premier danse", light: "Lumière artificielle DJ", loc: "Grange" },
  { t: "23:30", d: "Feu d'artifice", light: "Nuit · flash off", loc: "Étang" },
];

function PhotoTimeline() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Timeline photo</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">Léa Ferrand · 10h de reportage</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Camera className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary/15 to-cream p-6">
          <Clock className="h-5 w-5 text-primary" />
          <h2 className="mt-2 font-display text-3xl leading-tight">La lumière n'attend pas. Nous non plus.</h2>
          <p className="mt-2 text-sm text-muted-foreground">Chaque créneau est calé sur l'éphéméride du 5 juin : lever 06:03, coucher 21:38, golden hour 20:15-20:40.</p>
        </section>

        <section className="space-y-2">
          {slots.map((s, i) => (
            <div key={s.t} className="rounded-2xl border border-border/50 bg-card p-4 flex gap-4">
              <div className="flex flex-col items-center">
                <span className="font-mono text-xs text-primary font-semibold">{s.t}</span>
                {i < slots.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="flex-1 pb-2">
                <p className="font-medium text-sm">{s.d}</p>
                <p className="text-xs text-muted-foreground mt-1">☀ {s.light}</p>
                <p className="text-xs text-muted-foreground">📍 {s.loc}</p>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
