import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Sparkles, Download, Share2, Heart, Wand2 } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/filters")({
  component: Filters,
  head: () => ({
    meta: [
      { title: "Filtres AR de l'événement · Memento Live" },
      { name: "description", content: "Filtres réalité augmentée personnalisés aux couleurs de votre événement — à partager en story." },
      { property: "og:title", content: "Filtres AR · Memento Live" },
      { property: "og:description", content: "Vos invités portent vos couleurs." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Filter = {
  id: string;
  name: string;
  emoji: string;
  vibe: string;
  uses: number;
  preview: string;
  featured?: boolean;
};

const filters: Filter[] = [
  { id: "f1", name: "Confettis dorés", emoji: "✨", vibe: "Fête & célébration", uses: 428, preview: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600", featured: true },
  { id: "f2", name: "Couronne fleurie", emoji: "🌸", vibe: "Romantique", uses: 312, preview: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600" },
  { id: "f3", name: "Cœurs flottants", emoji: "💕", vibe: "Love", uses: 289, preview: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600" },
  { id: "f4", name: "Hashtag mariés", emoji: "#️⃣", vibe: "#SarahEtThomas26", uses: 201, preview: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600" },
  { id: "f5", name: "Photobooth vintage", emoji: "🎞️", vibe: "Rétro sépia", uses: 156, preview: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600" },
  { id: "f6", name: "Feux d'artifice", emoji: "🎆", vibe: "Grand final", uses: 98, preview: "https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=600" },
];

function Filters() {
  const { slug } = useParams({ from: "/events/$slug/filters" });
  const [active, setActive] = useState<Filter>(filters[0]);
  const [favs, setFavs] = useState<Set<string>>(new Set(["f1", "f3"]));

  return (
    <div className="min-h-screen bg-background pb-28">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Filtres AR</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden">
        <img src={active.preview} alt="" className="h-72 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" />
        <div className="absolute inset-x-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
            <Camera className="h-3 w-3" /> Aperçu
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[11px] uppercase tracking-widest text-white/80">{active.vibe}</p>
          <p className="mt-1 font-serif text-2xl leading-tight">
            {active.emoji} {active.name}
          </p>
          <p className="mt-1 text-[11px] text-white/80">Utilisé {active.uses} fois par vos invités</p>
        </div>
      </section>

      <section className="px-4 pt-5">
        <div className="flex gap-2">
          <button className="flex-1 rounded-full bg-foreground py-3 text-xs font-bold text-background">
            <Camera className="mr-1.5 inline h-3.5 w-3.5" /> Ouvrir l'appareil
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-secondary" aria-label="Partager">
            <Share2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setFavs((s) => { const n = new Set(s); n.has(active.id) ? n.delete(active.id) : n.add(active.id); return n; })}
            className={`grid h-11 w-11 place-items-center rounded-full ${favs.has(active.id) ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            aria-label="Favori"
          >
            <Heart className="h-4 w-4" fill={favs.has(active.id) ? "currentColor" : "none"} />
          </button>
        </div>
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Scanne le QR code présent à l'entrée pour activer les filtres sur Instagram et Snapchat.
        </p>
      </section>

      <section className="px-4 pt-8">
        <h2 className="mb-3 font-serif text-lg">Bibliothèque</h2>
        <div className="grid grid-cols-2 gap-3">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActive(f)}
              className={`group relative overflow-hidden rounded-2xl border text-left transition ${
                active.id === f.id ? "border-primary ring-2 ring-primary/40" : "border-border/60"
              }`}
            >
              <div className="relative h-32 w-full overflow-hidden">
                <img src={f.preview} alt="" className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {f.featured && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold uppercase text-primary-foreground">Top</span>
                )}
                <div className="absolute inset-x-2 bottom-1.5 text-white">
                  <p className="text-lg leading-none">{f.emoji}</p>
                  <p className="mt-1 truncate text-[11px] font-semibold">{f.name}</p>
                  <p className="truncate text-[9px] text-white/70">{f.uses} utilisations</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <Wand2 className="h-3.5 w-3.5" /> Créer un filtre sur mesure
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Votre nom, vos couleurs, vos emojis</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Notre équipe design conçoit un filtre exclusif en 48 h — livré prêt à publier.</p>
        <div className="mt-3 flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
            <Sparkles className="h-3.5 w-3.5" /> Commander · 49 €
          </button>
          <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
            <Download className="h-3.5 w-3.5" /> Voir des exemples
          </button>
        </div>
      </section>
    </div>
  );
}
