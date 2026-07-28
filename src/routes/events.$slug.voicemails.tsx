import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Mic, Play, Pause, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/voicemails")({
  component: Voicemails,
  head: () => ({
    meta: [
      { title: "Messages vocaux · Memento Live" },
      { name: "description", content: "Un répondeur privé pour recueillir les voix de ceux qui comptent." },
      { property: "og:title", content: "Messages vocaux · Memento Live" },
      { property: "og:description", content: "Les voix qui restent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const messages = [
  { from: "Mamie Louise", dur: "1:24", when: "il y a 2h", note: "Émotion palpable, mouchoirs conseillés", color: "from-primary to-primary-dark" },
  { from: "Oncle Marc (Canada)", dur: "0:48", when: "il y a 5h", note: "Blague de famille légendaire", color: "from-gold to-primary" },
  { from: "Inès (10 ans)", dur: "0:32", when: "hier", note: "Ma cousine préférée !", color: "from-primary-dark to-gold" },
  { from: "Papa", dur: "2:11", when: "hier", note: "Discours de répétition — pépite", color: "from-foreground to-primary-dark" },
  { from: "Anonyme", dur: "0:19", when: "il y a 3 jours", note: "Message mystère 🎁", color: "from-primary to-gold" },
];

function Voicemails() {
  const { slug } = useParams({ from: "/events/$slug/voicemails" });
  const [playing, setPlaying] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Messages vocaux</p>
          <p className="text-xs text-muted-foreground">{messages.length} voix · numéro dédié</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <Mic className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Les voix qui restent</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vos proches appellent un numéro dédié et laissent un message. On les archive à vie, chiffrés.
          </p>
          <div className="mt-4 rounded-2xl bg-background/80 p-3 backdrop-blur">
            <p className="text-[10px] font-bold uppercase text-muted-foreground">Numéro à partager</p>
            <p className="mt-1 font-mono text-2xl font-bold text-primary-dark">01 84 80 42 07</p>
            <p className="mt-1 text-[11px] text-muted-foreground">Code événement : <span className="font-mono">4218</span></p>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Messages reçus</p>
          <div className="space-y-2">
            {messages.map((m, i) => {
              const isPlaying = playing === i;
              return (
                <article key={i} className={`rounded-2xl bg-gradient-to-br ${m.color} p-3.5 text-white shadow-soft`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPlaying(isPlaying ? null : i)}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/25 backdrop-blur"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-0.5" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{m.from}</p>
                      <p className="truncate text-[11px] opacity-80">{m.when} · {m.dur}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    {Array.from({ length: 32 }).map((_, k) => (
                      <span
                        key={k}
                        className="rounded-full bg-white/60"
                        style={{
                          width: 2,
                          height: 4 + ((k * 7 + i * 3) % 20),
                          opacity: isPlaying && k < 18 ? 1 : 0.55,
                        }}
                      />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] italic opacity-90">« {m.note} »</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Users className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Compilation IA</p>
          <p className="mt-1 text-sm opacity-80">
            Une bande-son unique de 3 min montée automatiquement pour ouvrir votre livre souvenir.
          </p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">Générer le montage</button>
        </section>
      </main>
    </div>
  );
}
