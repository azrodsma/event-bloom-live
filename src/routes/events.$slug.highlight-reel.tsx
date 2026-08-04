import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Play, Heart, Share2, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/highlight-reel")({
  component: HighlightReel,
  head: () => ({
    meta: [
      { title: "Best-of vidéo · MaFeliza" },
      { name: "description", content: "Un montage automatique des meilleurs moments de votre événement, généré par IA." },
      { property: "og:title", content: "Best-of vidéo · MaFeliza" },
      { property: "og:description", content: "Votre journée en 60 secondes de magie." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const styles = [
  { id: "cine", label: "Cinématique", desc: "Ralentis, grain doré, orchestre.", color: "from-foreground to-primary" },
  { id: "pop", label: "Pop & fun", desc: "Cuts rapides, sticker, énergie.", color: "from-primary to-gold" },
  { id: "doc", label: "Documentaire", desc: "Interviews, voix off, émotion.", color: "from-primary-dark to-primary" },
] as const;

const chapters = [
  { t: "0:00", label: "Préparatifs & lever du soleil", pick: 12 },
  { t: "0:12", label: "Arrivée des invités", pick: 8 },
  { t: "0:24", label: "Cérémonie · échange des vœux", pick: 18 },
  { t: "0:42", label: "Cocktail & rires", pick: 10 },
  { t: "0:58", label: "Première danse", pick: 14 },
  { t: "1:12", label: "Feu d'artifice final", pick: 6 },
];

function HighlightReel() {
  const { slug } = useParams({ from: "/events/$slug/highlight-reel" });
  const [style, setStyle] = useState<(typeof styles)[number]["id"]>("cine");
  const [duration, setDuration] = useState(60);
  const active = styles.find((s) => s.id === style)!;

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Best-of vidéo</p>
          <p className="text-xs text-muted-foreground">Généré par IA · v3</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-6 px-4 py-5">
        <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${active.color} p-1 shadow-card`}>
          <div className="relative aspect-video overflow-hidden rounded-[22px] bg-foreground">
            <img
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
              alt=""
              className="h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 grid place-items-center">
              <button className="grid h-16 w-16 place-items-center rounded-full bg-white/90 text-primary shadow-glow backdrop-blur">
                <Play className="h-7 w-7 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span className="rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">{duration}s · {active.label}</span>
              <div className="flex gap-2">
                <button className="grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur"><Heart className="h-4 w-4" /></button>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur"><Share2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Style de montage</p>
          <div className="grid grid-cols-3 gap-2">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`rounded-2xl border-2 p-3 text-left transition ${
                  style === s.id ? "border-primary bg-primary-light" : "border-border bg-surface"
                }`}
              >
                <span className={`mb-2 block h-8 w-8 rounded-full bg-gradient-to-br ${s.color}`} />
                <p className="text-sm font-semibold">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">{s.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-lg">Durée</p>
            <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">{duration}s</span>
          </div>
          <input
            type="range"
            min={30}
            max={180}
            step={15}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
            <span>30s</span><span>1min</span><span>2min</span><span>3min</span>
          </div>
        </section>

        <section>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chapitres détectés</p>
          <div className="space-y-2">
            {chapters.map((c) => (
              <div key={c.t} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-card">
                <span className="rounded-full bg-foreground px-2.5 py-1 font-mono text-[11px] font-semibold text-background">{c.t}</span>
                <p className="flex-1 text-sm font-medium">{c.label}</p>
                <span className="text-xs text-muted-foreground">{c.pick} clips</span>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-2">
          <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow">
            <Sparkles className="h-4 w-4" /> Regénérer
          </button>
          <button className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold">
            <Download className="h-4 w-4" /> Télécharger
          </button>
        </div>
      </main>
    </div>
  );
}
