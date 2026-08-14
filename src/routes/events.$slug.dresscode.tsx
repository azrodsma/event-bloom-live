import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Palette, Shirt, Info, Camera, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/dresscode")({
  component: DressCode,
  head: () => ({
    meta: [
      { title: "Dress code · MaFeliza" },
      { name: "description", content: "Découvrez le dress code, la palette de couleurs et les inspirations tenues pour l'événement." },
      { property: "og:title", content: "Dress code · MaFeliza" },
      { property: "og:description", content: "Toutes les informations pour choisir votre tenue." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Palette {
  name: string;
  colors: string[];
  desc: string;
}

const palettes: Palette[] = [
  { name: "Recommandé", desc: "Notre inspiration principale", colors: ["#FFF8F4", "#E8D5C4", "#D9A441", "#8B6F3E"] },
  { name: "Accents doux", desc: "Pour la touche finale", colors: ["#F5C6D0", "#E85D8E", "#B87990", "#5B2E3F"] },
  { name: "À éviter", desc: "Réservé aux mariés", colors: ["#FFFFFF", "#F8F0E8", "#E8E0D5", "#F0EBE0"] },
];

interface Guide {
  audience: string;
  title: string;
  image: string;
  desc: string;
}

const guides: Guide[] = [
  {
    audience: "Pour elles",
    title: "Robe champêtre chic",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
    desc: "Longueur midi ou longue, tissus fluides, tons pastels ou dorés.",
  },
  {
    audience: "Pour eux",
    title: "Costume beige ou lin",
    image: "https://images.unsplash.com/photo-1516575334481-f85287c2c82d?w=800&auto=format&fit=crop",
    desc: "Costume clair, cravate optionnelle, mocassins ou derbies clairs.",
  },
  {
    audience: "Pour les enfants",
    title: "Confortable & élégant",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop",
    desc: "Robe à volants, bermuda et chemise en lin, sandales fermées.",
  },
];

interface Rule {
  emoji: string;
  title: string;
  desc: string;
  ok: boolean;
}

const rules: Rule[] = [
  { emoji: "🌾", title: "Talons plats bienvenus", desc: "Cérémonie sur herbe, pensez confort", ok: true },
  { emoji: "🌸", title: "Fleurs & couronnes autorisées", desc: "Osez les accessoires floraux", ok: true },
  { emoji: "🧥", title: "Étole ou veste", desc: "La soirée peut être fraîche en extérieur", ok: true },
  { emoji: "⛔", title: "Pas de blanc, ivoire ou crème", desc: "Réservés aux mariés", ok: false },
  { emoji: "🚫", title: "Pas de jean ni baskets", desc: "Cérémonie formelle en journée", ok: false },
];

function DressCode() {
  const { slug } = useParams({ from: "/events/$slug/dresscode" });
  const [selected, setSelected] = useState(0);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Dress code</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Partager">
          <Camera className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #FFF8F4, #D9A441 90%)" }} />
        <div className="relative px-6 pb-10 pt-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur">
            <Sparkles className="h-3 w-3" /> Champêtre chic
          </div>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Élégance dorée<br />sur fond d'ivoire</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-foreground/80">
            Une palette naturelle avec touches dorées, à la fois raffinée et confortable pour la journée.
          </p>
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-lg">Palette</h2>
        </div>
        <div className="space-y-3">
          {palettes.map((p, i) => (
            <div
              key={p.name}
              onClick={() => setSelected(i)}
              className={`cursor-pointer rounded-3xl border p-4 transition-all ${
                selected === i ? "border-primary bg-primary/5" : "border-border/60 bg-card"
              }`}
            >
              <div className="flex items-baseline justify-between">
                <p className="font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.desc}</p>
              </div>
              <div className="mt-3 flex gap-2">
                {p.colors.map((c) => (
                  <div key={c} className="flex-1">
                    <div className="aspect-square rounded-2xl shadow-inner" style={{ backgroundColor: c }} />
                    <p className="mt-1 text-center font-mono text-[9px] uppercase text-muted-foreground">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-center gap-2">
          <Shirt className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-lg">Inspirations</h2>
        </div>
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
          {guides.map((g) => (
            <div key={g.title} className="w-64 shrink-0 snap-start overflow-hidden rounded-3xl bg-card shadow-sm">
              <div className="relative aspect-[4/5]">
                <img src={g.image} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur">
                  {g.audience}
                </span>
              </div>
              <div className="p-4">
                <p className="font-serif text-base">{g.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          <h2 className="font-serif text-lg">À savoir</h2>
        </div>
        <ul className="space-y-2">
          {rules.map((r) => (
            <li
              key={r.title}
              className={`flex items-start gap-3 rounded-2xl border p-3 ${
                r.ok ? "border-border/60 bg-card" : "border-destructive/20 bg-destructive/5"
              }`}
            >
              <span className="text-2xl">{r.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{r.title}</p>
                <p className="text-[11px] text-muted-foreground">{r.desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-secondary to-primary/10 p-5 text-center">
        <p className="font-serif text-lg">Une question sur votre tenue ?</p>
        <p className="mt-1 text-xs text-muted-foreground">Envoyez un message aux mariés, ils vous répondront avec plaisir.</p>
        <Link
          to="/app/messages"
          className="mt-4 inline-flex rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
        >
          Écrire aux mariés
        </Link>
      </section>
    </div>
  );
}
