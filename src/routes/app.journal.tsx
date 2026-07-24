import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Feather, Sparkles, CheckCircle2, Circle, Plus, Calendar, ChevronRight, Sun, Cloud, CloudRain, Moon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/journal")({
  component: Journal,
  head: () => ({
    meta: [
      { title: "Mon journal · Memento Live" },
      { name: "description", content: "Un espace intime pour noter vos ressentis, victoires et to-do de la préparation." },
      { property: "og:title", content: "Mon journal · Memento Live" },
      { property: "og:description", content: "Prendre soin de vous, aussi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Mood = "radieux" | "serein" | "nuageux" | "orageux";

const moods: { id: Mood; label: string; icon: typeof Sun; tint: string }[] = [
  { id: "radieux", label: "Radieux", icon: Sun, tint: "bg-amber-100 text-amber-700" },
  { id: "serein", label: "Serein", icon: Moon, tint: "bg-sky-100 text-sky-700" },
  { id: "nuageux", label: "Nuageux", icon: Cloud, tint: "bg-slate-100 text-slate-700" },
  { id: "orageux", label: "Orageux", icon: CloudRain, tint: "bg-primary/10 text-primary" },
];

type Entry = {
  id: string;
  date: string;
  day: string;
  mood: Mood;
  title: string;
  text: string;
  wins: string[];
  worries?: string[];
};

const entries: Entry[] = [
  {
    id: "e1",
    date: "Mardi 15 juil.",
    day: "J–89",
    mood: "radieux",
    title: "On a choisi les alliances",
    text:
      "Rendez-vous chez le bijoutier ce matin. Elle a pleuré en voyant la mienne. J'ai souri comme un idiot pendant 20 minutes. Aujourd'hui, tout va bien.",
    wins: ["Alliances commandées", "RDV fleuriste calé", "Playlist +12 titres"],
  },
  {
    id: "e2",
    date: "Vendredi 11 juil.",
    day: "J–93",
    mood: "orageux",
    title: "Plan de table impossible",
    text:
      "Tante Colette et cousin Bruno ne se parlent plus depuis 2019. Ma mère insiste pour qu'ils soient à la même table. Je n'y arriverai pas ce soir.",
    wins: ["Robe essayée (elle adore)"],
    worries: ["Plan de table", "Budget fleurs dépassé de 400 €"],
  },
  {
    id: "e3",
    date: "Dimanche 6 juil.",
    day: "J–98",
    mood: "serein",
    title: "Répétition en douceur",
    text:
      "On a marché ensemble jusqu'à la chapelle en fin d'après-midi. Le vent, les cyprès. J'ai réalisé qu'on allait vraiment se marier là.",
    wins: ["Lieu confirmé", "Officiant briefé", "Faire-part validés"],
  },
];

const todos = [
  { id: "t1", label: "Appeler le traiteur pour le vin", done: true },
  { id: "t2", label: "Envoyer les faire-part restants", done: true },
  { id: "t3", label: "Choisir la lecture pour la cérémonie", done: false },
  { id: "t4", label: "Prendre 30 min pour moi (marche + silence)", done: false },
  { id: "t5", label: "Confirmer navette invités hôtel", done: false },
];

const prompts = [
  "Un moment simple qui m'a fait sourire aujourd'hui…",
  "Ce que je veux garder de cette journée dans 20 ans…",
  "Une gratitude pour quelqu'un qui m'a aidé cette semaine…",
];

function Journal() {
  const [checked, setChecked] = useState<Set<string>>(new Set(todos.filter((t) => t.done).map((t) => t.id)));
  const [todayMood, setTodayMood] = useState<Mood | null>(null);
  const [draft, setDraft] = useState("");

  const toggle = (id: string) =>
    setChecked((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const streak = 12;
  const progress = (checked.size / todos.length) * 100;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Mon journal</p>
        <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Calendrier">
          <Calendar className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden px-4 pb-6 pt-6">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-accent/40 to-transparent" />
        <div className="relative">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Feather className="h-3.5 w-3.5 text-primary" /> Espace privé · chiffré
          </div>
          <h1 className="mt-2 font-serif text-3xl leading-tight">Prendre soin<br />de vous, aussi</h1>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-semibold shadow-sm backdrop-blur">
            🔥 {streak} jours d'écriture consécutifs
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="rounded-3xl border border-border/60 bg-card p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Aujourd'hui — comment ça va ?</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {moods.map((m) => {
              const Icon = m.icon;
              const active = todayMood === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setTodayMood(m.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl p-3 transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-glow" : m.tint
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px] font-bold">{m.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 rounded-2xl bg-secondary p-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" /> Amorce du jour
            </div>
            <p className="mt-1 font-serif text-sm italic text-foreground">{prompts[0]}</p>
          </div>

          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrivez librement…"
            rows={4}
            className="mt-3 w-full resize-none rounded-2xl border border-border bg-background px-3.5 py-3 font-serif text-[13px] leading-relaxed placeholder:font-sans placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>{draft.length} caractères</span>
            <button className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-background disabled:opacity-40" disabled={!draft.length}>
              Enregistrer
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Ma to-do douceur</p>
          <span className="text-[10px] font-semibold text-primary">{checked.size}/{todos.length}</span>
        </div>
        <div className="mb-2 h-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
        <ul className="space-y-1.5">
          {todos.map((t) => {
            const done = checked.has(t.id);
            return (
              <li key={t.id}>
                <button
                  onClick={() => toggle(t.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all ${
                    done ? "border-transparent bg-secondary/50" : "border-border bg-card"
                  }`}
                >
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <span className={`text-sm ${done ? "text-muted-foreground line-through" : ""}`}>{t.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-border py-3 text-xs font-semibold text-muted-foreground">
          <Plus className="h-3.5 w-3.5" /> Ajouter une intention
        </button>
      </section>

      <section className="mt-8 px-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pages précédentes</p>
          <button className="text-[10px] font-bold text-primary">Toutes</button>
        </div>
        <ul className="space-y-3">
          {entries.map((e) => {
            const m = moods.find((x) => x.id === e.mood)!;
            const Icon = m.icon;
            return (
              <li key={e.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="flex items-center justify-between border-b border-border/50 bg-secondary/40 px-4 py-2.5">
                  <div>
                    <p className="text-xs font-semibold">{e.date}</p>
                    <p className="text-[10px] text-muted-foreground">{e.day}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${m.tint}`}>
                    <Icon className="h-3 w-3" /> {m.label}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-serif text-lg leading-tight">{e.title}</p>
                  <p className="mt-2 font-serif text-[13px] italic leading-relaxed text-muted-foreground">{e.text}</p>

                  {e.wins.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {e.wins.map((w) => (
                        <span key={w} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                          ✓ {w}
                        </span>
                      ))}
                    </div>
                  )}
                  {e.worries && e.worries.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {e.worries.map((w) => (
                        <span key={w} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                          · {w}
                        </span>
                      ))}
                    </div>
                  )}

                  <button className="mt-3 flex items-center gap-1 text-[10px] font-bold text-primary">
                    Rouvrir cette page <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
