import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mic2, Clock, GripVertical, Sparkles, Video, Users, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/speeches")({
  component: Speeches,
  head: () => ({
    meta: [
      { title: "Discours & prises de parole · Memento Live" },
      { name: "description", content: "Coordonnez les discours, le timing et l'ordre de passage — sans mauvaises surprises le jour J." },
      { property: "og:title", content: "Discours & prises de parole · Memento Live" },
      { property: "og:description", content: "L'organisation des discours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Status = "confirmé" | "à confirmer" | "surprise";
type Format = "live" | "vidéo" | "audio";

interface Speech {
  id: string;
  order: number;
  speaker: string;
  role: string;
  avatar: string;
  duration: string;
  minutes: number;
  status: Status;
  format: Format;
  moment: string;
  preview?: string;
}

const initial: Speech[] = [
  {
    id: "s1",
    order: 1,
    speaker: "Marc Bernard",
    role: "Père de la mariée",
    avatar: "https://i.pravatar.cc/64?img=15",
    duration: "5 min",
    minutes: 5,
    status: "confirmé",
    format: "live",
    moment: "Ouverture du dîner · 20 h 00",
    preview: "Un mot d'accueil qui remonte à l'enfance de Sarah.",
  },
  {
    id: "s2",
    order: 2,
    speaker: "Camille Rousseau",
    role: "Témoin de la mariée",
    avatar: "https://i.pravatar.cc/64?img=32",
    duration: "7 min",
    minutes: 7,
    status: "confirmé",
    format: "live",
    moment: "Après l'entrée · 20 h 30",
    preview: "Anecdotes de fac, avec accessoires prévus.",
  },
  {
    id: "s3",
    order: 3,
    speaker: "Julien & Antoine",
    role: "Témoins du marié",
    avatar: "https://i.pravatar.cc/64?img=12",
    duration: "10 min",
    minutes: 10,
    status: "surprise",
    format: "vidéo",
    moment: "Avant le plat principal · 21 h 15",
    preview: "Vidéo souvenir des 15 dernières années — chut !",
  },
  {
    id: "s4",
    order: 4,
    speaker: "Isabelle Bernard",
    role: "Mère de la mariée",
    avatar: "https://i.pravatar.cc/64?img=47",
    duration: "4 min",
    minutes: 4,
    status: "à confirmer",
    format: "live",
    moment: "Avant le dessert · 22 h 30",
  },
  {
    id: "s5",
    order: 5,
    speaker: "Grand-mère Yvonne",
    role: "Grand-mère de Thomas",
    avatar: "https://i.pravatar.cc/64?img=48",
    duration: "3 min",
    minutes: 3,
    status: "confirmé",
    format: "audio",
    moment: "Pendant le dessert · 22 h 45",
    preview: "Message vocal enregistré depuis Nice.",
  },
];

const statusMeta: Record<Status, string> = {
  "confirmé": "bg-primary/10 text-primary",
  "à confirmer": "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "surprise": "bg-foreground text-background",
};

const formatMeta: Record<Format, { icon: typeof Mic2; label: string }> = {
  live: { icon: Mic2, label: "En direct" },
  vidéo: { icon: Video, label: "Vidéo" },
  audio: { icon: Heart, label: "Vocal" },
};

function Speeches() {
  const { slug } = useParams({ from: "/events/$slug/speeches" });
  const [speeches] = useState(initial);
  const totalMinutes = speeches.reduce((s, x) => s + x.minutes, 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Discours</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/70 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Mic2 className="h-3.5 w-3.5 text-primary" /> Prises de parole
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Un timing millimétré<br />pour vos discours</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">{speeches.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Discours</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none text-primary">{totalMinutes} min</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Durée totale</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">1</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Surprise 🤫</p>
          </div>
        </div>
      </section>

      <ol className="relative space-y-4 px-4 pt-6">
        <span className="absolute left-9 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" aria-hidden />
        {speeches.map((s) => {
          const Icon = formatMeta[s.format].icon;
          return (
            <li key={s.id} className="relative flex gap-3">
              <div className="relative z-10 flex flex-col items-center">
                <span className="grid h-10 w-10 place-items-center rounded-full border-4 border-background bg-primary font-serif text-sm font-bold text-primary-foreground shadow-sm">
                  {s.order}
                </span>
              </div>
              <div className="flex-1 rounded-3xl border border-border/60 bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <img src={s.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium leading-tight">{s.speaker}</p>
                      <p className="text-[11px] text-muted-foreground">{s.role}</p>
                    </div>
                  </div>
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {s.moment}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusMeta[s.status]}`}>
                    {s.status === "surprise" ? "🤫 Surprise" : s.status}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium">
                    <Icon className="h-3 w-3" /> {formatMeta[s.format].label}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-[10px] font-medium ring-1 ring-border">
                    <Clock className="h-3 w-3" /> {s.duration}
                  </span>
                </div>

                {s.preview && (
                  <p className="mt-3 rounded-xl bg-secondary/50 px-3 py-2 text-[11px] italic text-foreground/70">
                    « {s.preview} »
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <section className="mx-4 mt-8 rounded-3xl bg-gradient-to-br from-primary/10 to-accent/20 p-5">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Conseils Memento
        </div>
        <p className="mt-2 font-serif text-lg leading-tight">Le bon rythme pour vos discours</p>
        <ul className="mt-3 space-y-2 text-xs text-foreground/80">
          <li className="flex gap-2"><span className="text-primary">·</span> Alternez les moments forts avec les plats pour tenir l'attention.</li>
          <li className="flex gap-2"><span className="text-primary">·</span> Comptez 5 à 7 minutes par intervention pour éviter les longueurs.</li>
          <li className="flex gap-2"><span className="text-primary">·</span> Prévoyez un micro sans fil et testez-le une heure avant.</li>
        </ul>
        <Link
          to="/events/$slug/timeline"
          params={{ slug }}
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background"
        >
          <Users className="h-3.5 w-3.5" /> Voir le programme complet
        </Link>
      </section>
    </div>
  );
}
