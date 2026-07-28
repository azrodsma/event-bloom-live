import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Camera, Clock } from "lucide-react";

export const Route = createFileRoute("/events/$slug/photo-timeline")({
  component: PhotoTimeline,
  head: () => ({
    meta: [
      { title: "Timeline photo · Memento Live" },
      { name: "description", content: "Minute par minute avec le photographe : lumière, lieux, moments clés." },
      { property: "og:title", content: "Timeline photo · Memento Live" },
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
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Timeline photo</h1>
            <p className="text-xs text-muted-foreground">Léa Ferrand · 10h de reportage</p>
          </div>
          <Camera className="h-5 w-5 text-primary" />
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
