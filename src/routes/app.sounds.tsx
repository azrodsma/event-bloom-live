import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Pause, Heart, Sparkles, Search, Download, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/sounds")({
  component: Sounds,
  head: () => ({
    meta: [
      { title: "Bibliothèque sonore · Memento Live" },
      { name: "description", content: "Ambiances, jingles et musiques libres de droits pour habiller vos événements." },
      { property: "og:title", content: "Bibliothèque sonore · Memento Live" },
      { property: "og:description", content: "Le bon son pour chaque instant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Track = {
  id: string;
  title: string;
  author: string;
  mood: string;
  duration: string;
  bpm: number;
  color: string;
  new?: boolean;
  pro?: boolean;
};

const categories = [
  { id: "moments", label: "Grands moments", emoji: "✨" },
  { id: "cocktail", label: "Cocktail chic", emoji: "🍾" },
  { id: "cere", label: "Cérémonie", emoji: "💍" },
  { id: "fete", label: "Fête & danse", emoji: "🕺" },
  { id: "voix", label: "Effets & jingles", emoji: "🎙️" },
  { id: "cine", label: "Cinéma souvenir", emoji: "🎬" },
];

const featured: Track[] = [
  { id: "t1", title: "Marche nuptiale piano", author: "Studio Memento", mood: "Solennel", duration: "3:12", bpm: 62, color: "from-rose-200 to-rose-400", new: true },
  { id: "t2", title: "Cocktail lounge sunset", author: "Neon Days", mood: "Chic & détendu", duration: "4:08", bpm: 96, color: "from-amber-200 to-amber-400" },
  { id: "t3", title: "Explosion de feu d'artifice", author: "Foley Studio", mood: "Grand final", duration: "0:18", bpm: 0, color: "from-fuchsia-300 to-fuchsia-500" },
];

const tracks: Track[] = [
  { id: "l1", title: "Entrée des mariés · violons", author: "Ensemble Étoile", mood: "Émouvant", duration: "2:48", bpm: 68, color: "from-rose-300 to-rose-500" },
  { id: "l2", title: "Ouverture de bal jazz", author: "Trio Belleville", mood: "Élégant", duration: "3:52", bpm: 104, color: "from-amber-300 to-amber-500", pro: true },
  { id: "l3", title: "Ambiance apéritif Provence", author: "Studio Memento", mood: "Ensoleillé", duration: "5:12", bpm: 88, color: "from-orange-300 to-orange-500" },
  { id: "l4", title: "Discours · nappe piano", author: "Nordic Keys", mood: "Neutre & doux", duration: "4:22", bpm: 60, color: "from-sky-300 to-sky-500" },
  { id: "l5", title: "Piste de danse disco 70s", author: "Fever Nights", mood: "Festif", duration: "3:34", bpm: 122, color: "from-fuchsia-400 to-fuchsia-600", pro: true },
  { id: "l6", title: "Applaudissements chaleureux", author: "Foley Studio", mood: "Ovation", duration: "0:12", bpm: 0, color: "from-emerald-300 to-emerald-500" },
];

const packs = [
  { name: "Pack Mariage complet", tracks: 34, minutes: 128, image: "https://images.unsplash.com/photo-1519741497674-611481863552?w=400" },
  { name: "Pack Anniversaire festif", tracks: 22, minutes: 84, image: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400" },
  { name: "Pack Cérémonie douce", tracks: 18, minutes: 62, image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400" },
];

function Sounds() {
  const [cat, setCat] = useState("moments");
  const [playing, setPlaying] = useState<string | null>("t1");
  const [saved, setSaved] = useState<Set<string>>(new Set(["t1"]));

  const toggle = (id: string) =>
    setSaved((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Bibliothèque sonore</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Rechercher">
          <Search className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-primary/10 via-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 240 sons libres de droits
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Le bon son<br />pour chaque instant</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Habillez cérémonie, cocktail, discours et danse avec des morceaux prêts à l'emploi.
        </p>
      </section>

      <section className="px-4">
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                cat === c.id ? "bg-foreground text-background" : "bg-secondary text-foreground"
              }`}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-5 px-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">À la une</p>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {featured.map((t) => {
            const on = playing === t.id;
            return (
              <article
                key={t.id}
                className={`relative flex w-64 shrink-0 flex-col justify-end overflow-hidden rounded-3xl bg-gradient-to-br ${t.color} p-4 text-white shadow-sm`}
                style={{ minHeight: 160 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {t.new && (
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-foreground">
                    Nouveau
                  </span>
                )}
                <div className="relative flex items-end gap-0.5">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-1 rounded-full bg-white/80"
                      style={{ height: `${6 + Math.sin(i * 0.7 + t.id.length) * 10 + (i % 4) * 5}px` }}
                    />
                  ))}
                </div>
                <div className="relative mt-3">
                  <p className="font-serif text-lg leading-tight">{t.title}</p>
                  <p className="text-[11px] text-white/80">{t.author} · {t.mood}</p>
                  <p className="mt-1 text-[10px] text-white/60">{t.duration}{t.bpm ? ` · ${t.bpm} BPM` : ""}</p>
                </div>
                <button
                  onClick={() => setPlaying((p) => (p === t.id ? null : t.id))}
                  className="absolute right-3 bottom-3 grid h-11 w-11 place-items-center rounded-full bg-white text-foreground shadow-glow"
                  aria-label={on ? "Pause" : "Lire"}
                >
                  {on ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Toute la bibliothèque</p>
        <ul className="space-y-1.5">
          {tracks.map((t) => {
            const on = playing === t.id;
            return (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-card p-2.5 ring-1 ring-border/60">
                <button
                  onClick={() => setPlaying((p) => (p === t.id ? null : t.id))}
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${t.color} text-white shadow-sm`}
                  aria-label={on ? "Pause" : "Lire"}
                >
                  {on ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 pl-0.5" />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-semibold">{t.title}</p>
                    {t.pro && (
                      <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-primary">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {t.author} · {t.mood} · {t.duration}
                    {t.bpm ? ` · ${t.bpm} BPM` : ""}
                  </p>
                </div>
                <button onClick={() => toggle(t.id)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-secondary" aria-label="Sauvegarder">
                  <Heart className={`h-4 w-4 ${saved.has(t.id) ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Packs prêts à l'emploi</p>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-3 -mx-4 flex gap-3 overflow-x-auto px-4 pb-2">
          {packs.map((p) => (
            <article key={p.name} className="w-52 shrink-0 overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative h-24 w-full overflow-hidden">
                <img src={p.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold leading-tight">{p.name}</p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">{p.tracks} morceaux · {p.minutes} min</p>
                <button className="mt-2 inline-flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold text-background">
                  <Download className="h-3 w-3" /> Importer
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {playing && (
        <div className="fixed bottom-20 left-3 right-3 z-30 flex items-center gap-3 rounded-full bg-foreground px-3 py-2 pr-4 text-background shadow-glow">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
            <Pause className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">
              {[...featured, ...tracks].find((t) => t.id === playing)?.title}
            </p>
            <p className="truncate text-[10px] text-background/70">
              {[...featured, ...tracks].find((t) => t.id === playing)?.author}
            </p>
          </div>
          <button onClick={() => setPlaying(null)} className="text-[10px] font-semibold text-background/70">
            Stop
          </button>
        </div>
      )}
    </div>
  );
}
