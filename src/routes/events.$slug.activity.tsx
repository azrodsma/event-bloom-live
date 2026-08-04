import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Activity, Filter, Heart, MessageCircle, Camera, Gift, UserPlus, Mic, Radio, CheckSquare, Download } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/events/$slug/activity")({
  component: ActivityLog,
  head: () => ({
    meta: [
      { title: "Journal d'activité · MaFeliza" },
      { name: "description", content: "Chronologie complète de tout ce qui se passe autour de votre événement : messages, photos, dons, RSVP, réactions." },
      { property: "og:title", content: "Journal d'activité · MaFeliza" },
      { property: "og:description", content: "Fil chronologique de votre événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type ActKind = "photo" | "message" | "like" | "gift" | "rsvp" | "voice" | "live" | "task";

interface Entry {
  id: string;
  kind: ActKind;
  actor: string;
  avatar: string;
  text: string;
  detail?: string;
  time: string;
  day: string;
  highlight?: boolean;
}

const meta: Record<ActKind, { icon: typeof Heart; color: string; label: string }> = {
  photo: { icon: Camera, color: "bg-primary/15 text-primary", label: "Photo" },
  message: { icon: MessageCircle, color: "bg-sky-500/15 text-sky-700", label: "Message" },
  like: { icon: Heart, color: "bg-rose-500/15 text-rose-600", label: "Réaction" },
  gift: { icon: Gift, color: "bg-amber-500/15 text-amber-700", label: "Cagnotte" },
  rsvp: { icon: UserPlus, color: "bg-emerald-500/15 text-emerald-700", label: "RSVP" },
  voice: { icon: Mic, color: "bg-fuchsia-500/15 text-fuchsia-700", label: "Vocal" },
  live: { icon: Radio, color: "bg-destructive/15 text-destructive", label: "Live" },
  task: { icon: CheckSquare, color: "bg-indigo-500/15 text-indigo-700", label: "Tâche" },
};

const entries: Entry[] = [
  { id: "e1", kind: "gift", actor: "Isabelle B.", avatar: "https://i.pravatar.cc/64?img=47", text: "a contribué à la cagnotte", detail: "150 € · Voyage de noces", time: "il y a 4 min", day: "Aujourd'hui", highlight: true },
  { id: "e2", kind: "photo", actor: "Camille R.", avatar: "https://i.pravatar.cc/64?img=32", text: "a ajouté 8 photos à l'album", detail: "Cocktail sur la terrasse", time: "il y a 12 min", day: "Aujourd'hui" },
  { id: "e3", kind: "voice", actor: "Papa Marc", avatar: "https://i.pravatar.cc/64?img=15", text: "a laissé un message vocal", detail: "1 min 24 s dans le livre d'or", time: "il y a 28 min", day: "Aujourd'hui", highlight: true },
  { id: "e4", kind: "like", actor: "Antoine K.", avatar: "https://i.pravatar.cc/64?img=13", text: "et 42 autres ont réagi", detail: "à la story de la cérémonie", time: "il y a 45 min", day: "Aujourd'hui" },
  { id: "e5", kind: "message", actor: "Léa D.", avatar: "https://i.pravatar.cc/64?img=44", text: "a commenté une photo", detail: "« Trop mignons ces deux-là 😍 »", time: "il y a 1 h", day: "Aujourd'hui" },
  { id: "e6", kind: "rsvp", actor: "Julien M.", avatar: "https://i.pravatar.cc/64?img=12", text: "a confirmé sa présence", detail: "+1 accompagnant · Régime végétarien", time: "il y a 2 h", day: "Aujourd'hui" },
  { id: "e7", kind: "live", actor: "Sarah & Thomas", avatar: "https://i.pravatar.cc/64?img=5", text: "ont démarré le live cérémonie", detail: "47 spectateurs simultanés · pic à 82", time: "14 h 32", day: "Hier" },
  { id: "e8", kind: "task", actor: "Vous", avatar: "https://i.pravatar.cc/64?img=1", text: "avez complété une tâche", detail: "Confirmer le fleuriste ✓", time: "18 h 04", day: "Hier" },
  { id: "e9", kind: "gift", actor: "Anonyme", avatar: "https://i.pravatar.cc/64?img=52", text: "a contribué à la cagnotte", detail: "50 € · « Toutes mes félicitations »", time: "10 h 12", day: "Hier" },
  { id: "e10", kind: "rsvp", actor: "Famille Bernard", avatar: "https://i.pravatar.cc/64?img=27", text: "ont confirmé (4 personnes)", detail: "1 enfant · 1 régime sans gluten", time: "9 h 47", day: "Hier" },
  { id: "e11", kind: "photo", actor: "Nadia O.", avatar: "https://i.pravatar.cc/64?img=45", text: "a ajouté une photo à l'album", detail: "Test décoration lundi", time: "il y a 3 jours", day: "Cette semaine" },
];

const filters: Array<{ key: "all" | ActKind; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "gift", label: "Cagnotte" },
  { key: "photo", label: "Photos" },
  { key: "message", label: "Messages" },
  { key: "voice", label: "Vocaux" },
  { key: "rsvp", label: "RSVP" },
  { key: "like", label: "Réactions" },
  { key: "live", label: "Live" },
];

function ActivityLog() {
  const { slug } = useParams({ from: "/events/$slug/activity" });
  const [filter, setFilter] = useState<"all" | ActKind>("all");

  const filtered = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.kind === filter)),
    [filter],
  );
  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, Entry[]>>((acc, e) => {
      (acc[e.day] ||= []).push(e);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Journal d'activité</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Exporter">
          <Download className="h-4 w-4" />
        </button>
      </div>

      <section className="bg-gradient-to-b from-secondary/70 to-transparent px-4 pb-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Activity className="h-3.5 w-3.5 text-primary" /> Chronologie complète
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Tout ce qui se passe<br />autour de vous</h1>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center">
          {[
            { v: "324", l: "Événements" },
            { v: "68", l: "Contributeurs" },
            { v: "1 240 €", l: "Cagnotte" },
            { v: "12", l: "En 24 h", accent: true },
          ].map((s) => (
            <div key={s.l} className={`rounded-2xl p-2.5 ${s.accent ? "bg-primary/10" : "bg-background/80"}`}>
              <p className={`font-serif text-sm leading-none ${s.accent ? "text-primary" : ""}`}>{s.v}</p>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sticky top-14 z-10 border-b border-border/60 bg-background/95 backdrop-blur">
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto px-4 py-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary">
            <Filter className="h-3.5 w-3.5" />
          </span>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium ${
                filter === f.key ? "border-foreground bg-foreground text-background" : "border-border bg-card"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4">
        {Object.entries(grouped).length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
            Aucune activité pour ce filtre.
          </div>
        ) : (
          Object.entries(grouped).map(([day, list]) => (
            <div key={day} className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{day}</p>
              <ol className="relative space-y-3 border-l border-border/60 pl-5">
                {list.map((e) => {
                  const m = meta[e.kind];
                  const Icon = m.icon;
                  return (
                    <li key={e.id} className="relative">
                      <span className={`absolute -left-[27px] grid h-8 w-8 place-items-center rounded-full ring-4 ring-background ${m.color}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className={`rounded-2xl p-3.5 ${e.highlight ? "bg-primary/[0.06] ring-1 ring-primary/20" : "bg-card ring-1 ring-border/60"}`}>
                        <div className="flex items-start gap-3">
                          <img src={e.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm leading-snug">
                              <span className="font-semibold">{e.actor}</span>{" "}
                              <span className="text-muted-foreground">{e.text}</span>
                            </p>
                            {e.detail && <p className="mt-0.5 text-[12px] text-foreground/80">{e.detail}</p>}
                            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className={`rounded-full px-1.5 py-0.5 font-semibold ${m.color}`}>{m.label}</span>
                              <span>·</span>
                              <span>{e.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))
        )}
      </div>

      <button className="mx-4 mt-2 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold">
        Charger plus d'activité
      </button>
    </div>
  );
}
