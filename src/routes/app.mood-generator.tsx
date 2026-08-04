import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Palette, Type, Layout, Download, Share2, Wand2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/mood-generator")({
  component: MoodGen,
  head: () => ({
    meta: [
      { title: "Générateur de mood board · MaFeliza" },
      { name: "description", content: "Décrivez votre vision en une phrase — l'IA compose la palette, la typo et les inspirations." },
      { property: "og:title", content: "Mood board IA · MaFeliza" },
      { property: "og:description", content: "De l'idée floue à la vision claire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Preset = {
  id: string;
  name: string;
  vibe: string;
  colors: string[];
  fontHead: string;
  fontBody: string;
  images: string[];
  keywords: string[];
};

const presets: Preset[] = [
  {
    id: "romantic-garden",
    name: "Jardin romantique",
    vibe: "Botanique, poudré, aérien",
    colors: ["#F5C1CB", "#FFF8F4", "#8FA97A", "#E85D8E", "#D9A441"],
    fontHead: "Playfair Display",
    fontBody: "Inter",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=400",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400",
      "https://images.unsplash.com/photo-1487070183336-b863922373d4?w=400",
    ],
    keywords: ["Pivoines", "Lin froissé", "Lumière rasante", "Guinguette", "Pieds nus dans l'herbe"],
  },
  {
    id: "black-tie",
    name: "Grand soir",
    vibe: "Noir doux, or, velours",
    colors: ["#0F0F10", "#1A1A1E", "#D9A441", "#FFF8F4", "#8B6F3F"],
    fontHead: "Playfair Display",
    fontBody: "Inter",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400",
      "https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=400",
      "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400",
      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
    ],
    keywords: ["Chandeliers", "Nappe damassée", "Champagne rosé", "Smoking noir", "Cristal"],
  },
  {
    id: "coastal",
    name: "Bord de mer",
    vibe: "Écume, sable, lin blanc",
    colors: ["#A9C7D6", "#F0EBE0", "#E85D8E", "#3D5C6E", "#DDB892"],
    fontHead: "Playfair Display",
    fontBody: "Inter",
    images: [
      "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=400",
      "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?w=400",
      "https://images.unsplash.com/photo-1499244571948-7ccddb3583f1?w=400",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=400",
    ],
    keywords: ["Voiles au vent", "Coquillages", "Pieds dans le sable", "Feu de camp", "Lin brut"],
  },
];

function MoodGen() {
  const [prompt, setPrompt] = useState("Un mariage romantique, printemps, dans un vieux jardin français");
  const [preset, setPreset] = useState(presets[0]);
  const [generating, setGenerating] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const random = presets[Math.floor(Math.random() * presets.length)];
      setPreset(random);
      setGenerating(false);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mood board IA</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary" aria-label="Partager">
          <Share2 className="h-4 w-4" />
        </button>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Wand2 className="h-3.5 w-3.5 text-primary" /> Générateur créatif
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Une phrase, une vision</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Décrivez votre événement en 1 à 2 phrases — l'IA propose palette, typo et images d'inspiration.
        </p>

        <div className="mt-4 rounded-3xl border border-border/60 bg-card p-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[80px] w-full resize-none bg-transparent px-2 py-1 font-serif text-[15px] leading-relaxed outline-none"
            placeholder="Ex : Un anniversaire au bord de la mer, ambiance dolce vita…"
          />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground">{prompt.length}/200</p>
            <button
              onClick={generate}
              disabled={generating}
              className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background disabled:opacity-40"
            >
              <Sparkles className={`h-3.5 w-3.5 ${generating ? "animate-spin" : ""}`} /> {generating ? "Génération…" : "Générer"}
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="font-serif text-lg">Direction artistique</h2>
          <span className="text-[11px] text-muted-foreground">{preset.name}</span>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="grid grid-cols-2 gap-1">
            {preset.images.map((src, i) => (
              <img key={i} src={src} alt="" className="aspect-square w-full object-cover" />
            ))}
          </div>

          <div className="p-4">
            <p className="text-[10px] uppercase tracking-wider text-primary">
              <Palette className="mr-1 inline h-3 w-3" /> Palette
            </p>
            <div className="mt-2 flex overflow-hidden rounded-2xl">
              {preset.colors.map((c) => (
                <div key={c} className="flex-1 py-6 text-center text-[9px] font-bold" style={{ background: c, color: c === "#FFF8F4" || c === "#F5C1CB" || c === "#F0EBE0" ? "#0F0F10" : "#FFF8F4" }}>
                  {c}
                </div>
              ))}
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-wider text-primary">
              <Type className="mr-1 inline h-3 w-3" /> Typographies
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Titres</p>
                <p className="mt-1 font-serif text-lg leading-none">Sarah & Thomas</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{preset.fontHead}</p>
              </div>
              <div className="rounded-2xl bg-secondary p-3">
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Corps</p>
                <p className="mt-1 text-sm">Nous vous invitons…</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{preset.fontBody}</p>
              </div>
            </div>

            <p className="mt-4 text-[10px] uppercase tracking-wider text-primary">
              <Layout className="mr-1 inline h-3 w-3" /> Mots-clés
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {preset.keywords.map((k) => (
                <span key={k} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold text-muted-foreground">
                  {k}
                </span>
              ))}
            </div>

            <p className="mt-4 text-[11px] italic text-muted-foreground">« {preset.vibe} »</p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Ambiances suggérées</h2>
        <div className="scrollbar-none flex gap-3 overflow-x-auto pb-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setPreset(p)}
              className={`shrink-0 overflow-hidden rounded-2xl border text-left transition ${preset.id === p.id ? "border-primary ring-2 ring-primary/40" : "border-border/60"}`}
              style={{ width: "180px" }}
            >
              <img src={p.images[0]} alt="" className="h-24 w-full object-cover" />
              <div className="p-2.5">
                <p className="font-serif text-sm">{p.name}</p>
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">{p.vibe}</p>
                <div className="mt-2 flex gap-0.5">
                  {p.colors.slice(0, 4).map((c) => (
                    <span key={c} className="h-3 flex-1 rounded-sm" style={{ background: c }} />
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border/60 bg-background/95 p-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-2">
          <button className="flex-1 rounded-full bg-primary py-3 text-xs font-bold text-primary-foreground">
            Appliquer à mon événement
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-secondary" aria-label="Télécharger">
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
