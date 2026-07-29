import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Users, Clock, Check, MapPin, Sun, Sparkles } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/photoshoot")({
  component: Photoshoot,
  head: () => ({
    meta: [
      { title: "Séance photos & vidéo · Memento Live" },
      { name: "description", content: "Planifiez chaque prise de vue : groupes, lieux, timing, lumière. Aucun cliché oublié." },
      { property: "og:title", content: "Séance photos · Memento Live" },
      { property: "og:description", content: "Le shot-list intelligent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Shot = {
  id: string;
  time: string;
  title: string;
  location: string;
  group: string;
  people: number;
  duration: string;
  type: "must" | "lifestyle" | "family" | "detail";
  done?: boolean;
};

const shots: Shot[] = [
  { id: "s1", time: "14:00", title: "Préparatifs mariée", location: "Suite du domaine", group: "Sarah + demoiselles", people: 5, duration: "45 min", type: "lifestyle", done: true },
  { id: "s2", time: "14:45", title: "Détails robe & accessoires", location: "Suite", group: "Photographe seul", people: 0, duration: "15 min", type: "detail", done: true },
  { id: "s3", time: "15:30", title: "Arrivée invités & cocktail de bienvenue", location: "Jardin", group: "Ambiance", people: 80, duration: "30 min", type: "lifestyle" },
  { id: "s4", time: "16:00", title: "Cérémonie complète", location: "Chapelle & parvis", group: "Couple + officiant", people: 3, duration: "45 min", type: "must" },
  { id: "s5", time: "17:00", title: "Portraits couple · golden hour début", location: "Allée des tilleuls", group: "Sarah & Thomas", people: 2, duration: "30 min", type: "must" },
  { id: "s6", time: "17:30", title: "Photo de groupe", location: "Perron", group: "Tous les invités", people: 120, duration: "10 min", type: "must" },
  { id: "s7", time: "17:45", title: "Familles proches", location: "Parterre", group: "Parents + frères/sœurs", people: 14, duration: "20 min", type: "family" },
  { id: "s8", time: "19:30", title: "Portraits golden hour final", location: "Étang", group: "Sarah & Thomas", people: 2, duration: "20 min", type: "must" },
  { id: "s9", time: "22:30", title: "Première danse", location: "Piste", group: "Couple + invités autour", people: 40, duration: "10 min", type: "must" },
];

const typeMeta = {
  must: { label: "Incontournable", tint: "bg-primary text-primary-foreground" },
  family: { label: "Famille", tint: "bg-emerald-50 text-emerald-700" },
  lifestyle: { label: "Lifestyle", tint: "bg-sky-50 text-sky-700" },
  detail: { label: "Détail", tint: "bg-amber-50 text-amber-700" },
} as const;

function Photoshoot() {
  const { slug } = useParams({ from: "/events/$slug/photoshoot" });
  const [done, setDone] = useState<Set<string>>(new Set(shots.filter((s) => s.done).map((s) => s.id)));
  const [filter, setFilter] = useState<"all" | "must" | "family" | "lifestyle" | "detail">("all");

  const list = filter === "all" ? shots : shots.filter((s) => s.type === filter);
  const doneCount = shots.filter((s) => done.has(s.id)).length;
  const percent = Math.round((doneCount / shots.length) * 100);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Shot-list</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-accent/30 to-background px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Camera className="h-3.5 w-3.5 text-primary" /> Julien Mercier · Photo
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Ne rater aucune image</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Partagé avec votre photographe et coordinateur — cochez au fil de la journée.
        </p>
        <div className="mt-4 rounded-2xl bg-background/70 p-3 backdrop-blur">
          <div className="flex items-baseline justify-between">
            <p className="text-xs text-muted-foreground">Progression</p>
            <p className="font-serif text-sm">{doneCount}/{shots.length} · {percent}%</p>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${percent}%` }} />
          </div>
        </div>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex gap-2 overflow-x-auto px-4 py-3">
          {(["all", "must", "family", "lifestyle", "detail"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-foreground text-background" : "bg-secondary text-muted-foreground"
              }`}
            >
              {f === "all" ? "Tout" : typeMeta[f].label}
            </button>
          ))}
        </div>
      </div>

      <ol className="relative px-4 pt-2">
        <span className="absolute left-[38px] top-4 bottom-4 w-px bg-border" />
        {list.map((s) => {
          const on = done.has(s.id);
          const meta = typeMeta[s.type];
          return (
            <li key={s.id} className="relative mb-3 flex gap-3">
              <button
                onClick={() => setDone((d) => { const n = new Set(d); n.has(s.id) ? n.delete(s.id) : n.add(s.id); return n; })}
                className={`relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full text-[11px] font-bold ring-4 ring-background ${
                  on ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
                aria-label={on ? "Marquer non fait" : "Marquer fait"}
              >
                {on ? <Check className="h-4 w-4" /> : s.time.slice(0, 2)}
              </button>
              <div className={`min-w-0 flex-1 rounded-2xl border p-3 transition ${on ? "border-primary/40 bg-primary/5" : "border-border/60 bg-card"}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className={`font-serif text-[15px] leading-tight ${on ? "line-through opacity-70" : ""}`}>{s.title}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${meta.tint}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.time} · {s.duration}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {s.location}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Users className="h-3 w-3" /> {s.group}
                  {s.people > 0 && <span className="ml-1 text-[10px]">· {s.people} pers.</span>}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4 text-primary" />
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Golden hour · 19h12 → 19h45</p>
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Fenêtre lumière dorée détectée</p>
        <p className="mt-1 text-[12px] text-muted-foreground">Réservez ce créneau pour vos portraits couple. Météo : ensoleillé, vent léger.</p>
        <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-foreground px-5 py-2 text-xs font-bold text-background">
          <Sparkles className="h-3.5 w-3.5" /> Bloquer dans la timeline
        </button>
      </section>
    </div>
  );
}
