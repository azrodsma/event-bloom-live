import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, ScanLine, Wand2, Download, Share2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/ai-portraits")({
  component: AIPortraits,
  head: () => ({
    meta: [
      { title: "Portraits IA · MaFeliza" },
      { name: "description", content: "Transformez vos photos de mariage en tableaux d'artistes : aquarelle, huile, croquis." },
      { property: "og:title", content: "Portraits IA · MaFeliza" },
      { property: "og:description", content: "Vos souvenirs en œuvres d'art." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Style = { id: string; name: string; hint: string; gradient: string; emoji: string };

const styles: Style[] = [
  { id: "watercolor", name: "Aquarelle romantique", hint: "Traits doux, transparences pastel", gradient: "from-rose-200 via-primary/30 to-accent", emoji: "🎨" },
  { id: "oil", name: "Huile classique", hint: "Portrait de maître, patine XIXᵉ", gradient: "from-amber-900 via-primary/50 to-amber-200", emoji: "🖼️" },
  { id: "sketch", name: "Croquis carbone", hint: "Trait sec, papier grain", gradient: "from-neutral-800 via-neutral-500 to-neutral-200", emoji: "✏️" },
  { id: "gold", name: "Feuille d'or", hint: "Iconographie précieuse", gradient: "from-amber-300 via-amber-500 to-amber-100", emoji: "✨" },
  { id: "pop", name: "Sérigraphie pop", hint: "Aplats saturés, contours nets", gradient: "from-primary via-fuchsia-400 to-amber-300", emoji: "🌈" },
  { id: "vintage", name: "Argentique 70s", hint: "Grain fin, tons sépia", gradient: "from-amber-100 via-amber-300 to-primary/40", emoji: "📸" },
];

const gallery = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
];

function AIPortraits() {
  const { slug } = useParams({ from: "/events/$slug/ai-portraits" });
  const [style, setStyle] = useState(styles[0]);
  const [source, setSource] = useState(gallery[0]);
  const [rendering, setRendering] = useState(false);

  const render = () => {
    setRendering(true);
    setTimeout(() => setRendering(false), 1200);
  };

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Portraits IA</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Wand2 className="h-3.5 w-3.5 text-primary" /> Studio créatif
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Vos souvenirs<br />en œuvres d'art</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Choisissez une photo puis un style — nous générons une version haute résolution imprimable.
        </p>
      </section>

      <section className="px-4 pt-6">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${style.gradient} p-1`}>
          <div className="overflow-hidden rounded-[22px] bg-background">
            <div className="relative aspect-[4/5] w-full">
              <img src={source} alt="Aperçu" className="h-full w-full object-cover" />
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${style.gradient} mix-blend-overlay opacity-60`} />
              {rendering && (
                <div className="absolute inset-0 grid place-items-center bg-black/40 backdrop-blur-sm">
                  <div className="flex flex-col items-center gap-2 text-white">
                    <ScanLine className="h-8 w-8 animate-pulse" />
                    <p className="text-xs uppercase tracking-widest">Rendu en cours…</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-x-4 bottom-4 flex items-center gap-2 rounded-2xl bg-black/40 p-2 backdrop-blur">
                <span className="text-xl">{style.emoji}</span>
                <div className="min-w-0 flex-1 text-white">
                  <p className="truncate font-serif text-sm leading-tight">{style.name}</p>
                  <p className="truncate text-[10px] text-white/80">{style.hint}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Photo source</h2>
        <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
          {gallery.map((src) => (
            <button
              key={src}
              onClick={() => setSource(src)}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition ${
                source === src ? "border-primary ring-2 ring-primary/30" : "border-transparent"
              }`}
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
          <button className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-2 border-dashed border-border text-[10px] text-muted-foreground">
            + Album
          </button>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 font-serif text-lg">Styles disponibles</h2>
        <div className="grid grid-cols-2 gap-3">
          {styles.map((s) => {
            const on = style.id === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setStyle(s)}
                className={`relative overflow-hidden rounded-2xl border-2 text-left transition ${on ? "border-primary" : "border-transparent"}`}
              >
                <div className={`h-20 bg-gradient-to-br ${s.gradient}`} />
                <div className="bg-card p-3">
                  <p className="flex items-center gap-1 font-serif text-sm leading-tight">
                    <span>{s.emoji}</span> {s.name}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{s.hint}</p>
                </div>
                {on && (
                  <span className="absolute right-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">
                    Actif
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <button
            onClick={render}
            disabled={rendering}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground py-3 text-xs font-bold text-background disabled:opacity-40"
          >
            <Sparkles className={`h-3.5 w-3.5 ${rendering ? "animate-spin" : ""}`} />
            {rendering ? "Rendu…" : "Générer en haute qualité"}
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-secondary" aria-label="Télécharger">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
