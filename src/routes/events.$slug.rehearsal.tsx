import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, CheckCircle2, Circle, AlertCircle, Users, Sparkles, Play, Coffee } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/rehearsal")({
  component: Rehearsal,
  head: () => ({
    meta: [
      { title: "Répétition générale · Memento Live" },
      { name: "description", content: "Planning détaillé de la répétition la veille de l'événement, avec rôles et étapes-clés." },
      { property: "og:title", content: "Répétition générale · Memento Live" },
      { property: "og:description", content: "Un jour J qui roule commence la veille." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Step = {
  id: string;
  time: string;
  duration: string;
  title: string;
  place: string;
  who: string[];
  notes?: string;
  status: "done" | "next" | "todo" | "warn";
  kind: "logistic" | "ceremony" | "break" | "party";
};

const steps: Step[] = [
  { id: "s1", time: "14:00", duration: "30 min", title: "Accueil & check technique", place: "Portail principal", who: ["Sarah", "Thomas", "Régisseur"], status: "done", kind: "logistic" },
  { id: "s2", time: "14:30", duration: "45 min", title: "Mise en place de la salle", place: "Grande salle", who: ["Décoratrice", "Témoins"], notes: "Poser noms sur les tables, tester lumière tamisée.", status: "done", kind: "logistic" },
  { id: "s3", time: "15:15", duration: "1 h", title: "Répétition entrée cérémonie", place: "Jardin sud", who: ["Mariés", "Cortège", "Officiant·e"], notes: "Musique test : marche nuptiale piano à –6 dB.", status: "next", kind: "ceremony" },
  { id: "s4", time: "16:15", duration: "20 min", title: "Pause fraîcheur", place: "Terrasse", who: ["Tout le monde"], status: "todo", kind: "break" },
  { id: "s5", time: "16:35", duration: "50 min", title: "Répétition rituels & vœux", place: "Chapelle en plein air", who: ["Mariés", "Enfants d'honneur"], notes: "Vérifier lecture micro-cravate.", status: "warn", kind: "ceremony" },
  { id: "s6", time: "17:30", duration: "40 min", title: "Chorégraphie ouverture de bal", place: "Salle de bal", who: ["Mariés", "DJ", "Coach danse"], status: "todo", kind: "party" },
  { id: "s7", time: "19:00", duration: "1 h 30", title: "Dîner de répétition", place: "Terrasse extérieure", who: ["Famille proche", "Témoins"], notes: "Menu simple : buffet italien.", status: "todo", kind: "break" },
];

const roles = [
  { name: "Julien P.", role: "Témoin · logistique", color: "bg-rose-500" },
  { name: "Élodie R.", role: "Témoin · discours", color: "bg-amber-500" },
  { name: "Officiant·e", role: "Cérémonie laïque", color: "bg-emerald-500" },
  { name: "DJ Léa", role: "Musique & ouverture", color: "bg-violet-500" },
  { name: "Régisseur", role: "Son & lumière", color: "bg-sky-500" },
];

const kindMeta = {
  logistic: { label: "Logistique", tint: "text-slate-600 bg-slate-100" },
  ceremony: { label: "Cérémonie", tint: "text-rose-700 bg-rose-100" },
  break: { label: "Pause", tint: "text-amber-700 bg-amber-100" },
  party: { label: "Fête", tint: "text-violet-700 bg-violet-100" },
} as const;

function Rehearsal() {
  const { slug } = useParams({ from: "/events/$slug/rehearsal" });
  const [statuses, setStatuses] = useState(() =>
    Object.fromEntries(steps.map((s) => [s.id, s.status] as const)),
  );

  const cycle = (id: string) => {
    setStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === "done" ? "todo" : prev[id] === "todo" ? "next" : prev[id] === "next" ? "warn" : "done",
    }));
  };

  const doneCount = Object.values(statuses).filter((s) => s === "done").length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Répétition</p>
        <button className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">
          Live
        </button>
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Vendredi 13 juin · veille du jour J
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Un jour J qui roule<br />commence la veille</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          7 étapes, 22 personnes clés, un timing millimétré.
        </p>

        <div className="mt-5 rounded-3xl border border-border/60 bg-card p-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-primary">{doneCount}/{steps.length} étapes bouclées</span>
            <span className="text-muted-foreground">{pct}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-secondary">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="px-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Casting du jour</p>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {roles.map((r) => (
            <div key={r.name} className="w-32 shrink-0 rounded-2xl border border-border/60 bg-card p-3">
              <span className={`inline-block h-2.5 w-2.5 rounded-full ${r.color}`} />
              <p className="mt-2 truncate text-sm font-semibold">{r.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{r.role}</p>
            </div>
          ))}
        </div>
      </section>

      <ol className="relative mt-6 space-y-3 px-4">
        {steps.map((s, idx) => {
          const st = statuses[s.id];
          const meta = kindMeta[s.kind];
          const Icon =
            st === "done" ? CheckCircle2 : st === "next" ? Play : st === "warn" ? AlertCircle : Circle;
          const iconTint =
            st === "done"
              ? "text-primary"
              : st === "next"
                ? "text-accent-foreground"
                : st === "warn"
                  ? "text-destructive"
                  : "text-muted-foreground";
          return (
            <li key={s.id} className="relative">
              {idx < steps.length - 1 && <span className="absolute left-4 top-11 h-full w-px bg-border" aria-hidden />}
              <div className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <button
                    onClick={() => cycle(s.id)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-background ring-2 ring-border"
                    aria-label="Changer le statut"
                  >
                    <Icon className={`h-4 w-4 ${iconTint} ${st === "done" ? "fill-primary/20" : ""}`} />
                  </button>
                  <span className="mt-1 font-mono text-[10px] font-bold text-muted-foreground">{s.time}</span>
                </div>

                <div
                  className={`min-w-0 flex-1 rounded-2xl border p-3.5 ${
                    st === "next" ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${meta.tint}`}>
                      {meta.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground">· {s.duration}</span>
                    {st === "next" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                        <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> En cours
                      </span>
                    )}
                    {st === "warn" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-1.5 py-0.5 text-[9px] font-bold text-destructive">
                        À vérifier
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 font-serif text-lg leading-tight">{s.title}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {s.place}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.who.map((w) => (
                      <span key={w} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                        <Users className="h-2.5 w-2.5" /> {w}
                      </span>
                    ))}
                  </div>
                  {s.notes && (
                    <p className="mt-2 rounded-2xl bg-secondary/60 p-2.5 text-[11px] text-muted-foreground">
                      💡 {s.notes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-primary/5 p-4">
        <Coffee className="h-5 w-5 shrink-0 text-primary" />
        <div className="text-[11px] text-muted-foreground">
          Un buffet léger sera servi dès 13 h 30. Pensez à venir bien reposé·e — la journée est intense.
        </div>
      </section>

      <div className="mx-4 mt-4 flex gap-2">
        <button className="flex-1 rounded-full bg-foreground py-3 text-xs font-bold text-background">
          Envoyer un rappel
        </button>
        <button className="rounded-full border border-border bg-background px-4 py-3 text-xs font-semibold">
          <Clock className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
