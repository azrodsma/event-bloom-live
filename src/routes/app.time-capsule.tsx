import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Lock, Sparkles, Mic, Camera, Mail, Plus, Users, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/app/time-capsule")({
  component: TimeCapsule,
  head: () => ({
    meta: [
      { title: "Capsule temporelle · MaFeliza" },
      { name: "description", content: "Scellez un message aujourd'hui, ouvrez-le dans 1, 5 ou 10 ans." },
      { property: "og:title", content: "Capsule temporelle · MaFeliza" },
      { property: "og:description", content: "Écrire au futur, se souvenir en couleur." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Status = "sealed" | "ready" | "opened";

const capsules: {
  id: string;
  title: string;
  event: string;
  sealed: string;
  opens: string;
  daysLeft: number;
  contributors: number;
  status: Status;
  types: ("text" | "audio" | "photo")[];
  cover: string;
  progress: number;
}[] = [
  {
    id: "1",
    title: "À nos futurs nous",
    event: "Mariage Sarah & Thomas",
    sealed: "12 sept. 2026",
    opens: "12 sept. 2036",
    daysLeft: 3654,
    contributors: 187,
    status: "sealed",
    types: ["text", "audio", "photo"],
    cover: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600",
    progress: 12,
  },
  {
    id: "2",
    title: "Lettre à Gabriel adulte",
    event: "Baptême de Gabriel",
    sealed: "18 mai 2026",
    opens: "18 mai 2044",
    daysLeft: 6570,
    contributors: 42,
    status: "sealed",
    types: ["text", "audio"],
    cover: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600",
    progress: 3,
  },
  {
    id: "3",
    title: "Un an après nos 30 ans",
    event: "Anniversaire Clara",
    sealed: "22 mars 2025",
    opens: "22 mars 2026",
    daysLeft: 0,
    contributors: 28,
    status: "ready",
    types: ["text", "audio", "photo"],
    cover: "https://images.unsplash.com/photo-1464047736614-af63643285bf?w=600",
    progress: 100,
  },
  {
    id: "4",
    title: "Nos vœux à nous-mêmes",
    event: "EVJF de Léa",
    sealed: "5 juillet 2024",
    opens: "5 juillet 2025",
    daysLeft: -20,
    contributors: 12,
    status: "opened",
    types: ["text"],
    cover: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=600",
    progress: 100,
  },
];

const durations = [
  { label: "1 an", desc: "Souvenirs proches", emoji: "🌱" },
  { label: "5 ans", desc: "Retour émouvant", emoji: "🌿" },
  { label: "10 ans", desc: "Voyage temporel", emoji: "🌳" },
  { label: "18 ans", desc: "Pour un enfant qui grandit", emoji: "👶" },
];

const typeIcon = { text: Mail, audio: Mic, photo: Camera };

function TimeCapsule() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Capsules temporelles</p>
        <button className="grid h-9 w-9 place-items-center rounded-full bg-foreground text-background" aria-label="Créer">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/15 via-accent/40 to-transparent" />
        <div className="absolute -left-16 top-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-4 top-6 text-7xl opacity-10 rotate-12">⏳</div>
        <div className="relative px-4 pb-6 pt-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <Clock className="h-3.5 w-3.5 text-primary" /> 4 capsules · 269 contributions
          </div>
          <h1 className="mt-2 font-serif text-4xl leading-tight">
            Écrire au futur,<br />
            <span className="italic text-primary">se souvenir en couleur</span>
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Scellez aujourd'hui, ouvrez plus tard. Vos mots, voix et images voyagent dans le temps.
          </p>
        </div>
      </section>

      <section className="mx-4 mt-2 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-5">
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
              <Sparkles className="h-3 w-3" /> Prête à ouvrir
            </div>
            <p className="mt-2 font-serif text-lg leading-tight">Un an après nos 30 ans</p>
            <p className="text-[11px] text-muted-foreground">28 messages vous attendent</p>
          </div>
          <button className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">
            Ouvrir <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vos capsules</p>
        <ul className="mt-3 space-y-4">
          {capsules.map((c) => {
            const locked = c.status === "sealed";
            const opened = c.status === "opened";
            return (
              <li key={c.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="relative h-32">
                  <img src={c.cover} alt="" className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
                    <span className="rounded-full bg-white/85 px-2 py-1 text-[10px] font-bold backdrop-blur">
                      {c.event}
                    </span>
                    {locked && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[10px] font-bold text-white backdrop-blur">
                        <Lock className="h-3 w-3" /> Scellée
                      </span>
                    )}
                    {opened && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-[10px] font-bold backdrop-blur">
                        Ouverte
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                    <p className="font-serif text-xl leading-tight">{c.title}</p>
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-white/85">
                      <Users className="h-3 w-3" /> {c.contributors} contributions
                      <span>·</span>
                      {c.types.map((t) => {
                        const Icon = typeIcon[t];
                        return <Icon key={t} className="h-3 w-3" />;
                      })}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <p className="uppercase tracking-wider text-muted-foreground">Scellée le</p>
                      <p className="mt-0.5 font-mono">{c.sealed}</p>
                    </div>
                    <div className="text-right">
                      <p className="uppercase tracking-wider text-muted-foreground">Ouverture</p>
                      <p className="mt-0.5 font-mono text-primary">{c.opens}</p>
                    </div>
                  </div>

                  {locked && (
                    <div className="mt-4">
                      <div className="mb-1.5 flex items-center justify-between text-[10px]">
                        <span className="text-muted-foreground">
                          {c.daysLeft.toLocaleString("fr-FR")} jours restants
                        </span>
                        <span className="font-mono">{c.progress}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400" style={{ width: `${c.progress}%` }} />
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    {locked ? (
                      <>
                        <button className="flex-1 rounded-full bg-primary py-2 text-[11px] font-bold text-primary-foreground">
                          Ajouter un message
                        </button>
                        <button className="rounded-full border border-border bg-background px-3 py-2 text-[11px] font-semibold">
                          Partager
                        </button>
                      </>
                    ) : opened ? (
                      <button className="flex-1 rounded-full border border-border bg-background py-2 text-[11px] font-semibold">
                        Revoir les messages
                      </button>
                    ) : (
                      <button className="flex-1 rounded-full bg-emerald-500 py-2 text-[11px] font-bold text-white">
                        Ouvrir maintenant
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mx-4 mt-8 rounded-3xl bg-secondary/40 p-5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Créer une nouvelle capsule</p>
        <p className="mt-2 font-serif text-lg leading-tight">Choisissez une durée</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {durations.map((d) => (
            <button key={d.label} className="rounded-2xl border border-border/60 bg-card p-3 text-left transition hover:border-primary/40">
              <span className="text-2xl">{d.emoji}</span>
              <p className="mt-1 font-serif text-base leading-none">{d.label}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">{d.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-3 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Lock className="h-5 w-5 shrink-0 text-primary" />
        <p>Chiffrement de bout en bout. Personne — pas même nous — ne peut lire une capsule avant sa date d'ouverture.</p>
      </div>
    </div>
  );
}
