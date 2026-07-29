import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Video, Mic, Camera, Square, Play, RotateCcw, Send, Check, Heart, Sparkles, Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/events/$slug/toast")({
  component: Toast,
  head: () => ({
    meta: [
      { title: "Enregistrer un vœu · Memento Live" },
      { name: "description", content: "Absent·e le jour J ? Enregistrez un message vidéo ou vocal qui sera diffusé pendant la cérémonie." },
      { property: "og:title", content: "Enregistrer un vœu · Memento Live" },
      { property: "og:description", content: "Un message qui traverse la distance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Mode = "video" | "audio";
type Phase = "prompt" | "recording" | "review" | "sent";

const prompts = [
  "Racontez comment vous vous êtes rencontrés",
  "Un souvenir marquant avec les mariés",
  "Un vœu pour leur avenir",
  "Une anecdote drôle que peu de gens connaissent",
  "Un mot pour les futurs enfants",
];

const submitted = [
  { author: "Grand-mère Odile", type: "Vidéo", duration: "1:24", tone: "Émouvant", when: "il y a 2 j" },
  { author: "Cousin Léo (Australie)", type: "Vidéo", duration: "2:08", tone: "Drôle", when: "il y a 5 j" },
  { author: "Julie & Antoine", type: "Vocal", duration: "0:52", tone: "Tendre", when: "il y a 1 sem." },
];

function Toast() {
  const { slug } = useParams({ from: "/events/$slug/toast" });
  const [mode, setMode] = useState<Mode>("video");
  const [phase, setPhase] = useState<Phase>("prompt");
  const [prompt, setPrompt] = useState(prompts[0]);
  const [elapsed, setElapsed] = useState(0);
  const [note, setNote] = useState("");
  const [level, setLevel] = useState(0);
  const timerRef = useRef<number | null>(null);

  const MAX = 120;

  useEffect(() => {
    if (phase === "recording") {
      timerRef.current = window.setInterval(() => {
        setElapsed((e) => {
          if (e + 1 >= MAX) {
            stop();
            return MAX;
          }
          return e + 1;
        });
        setLevel(Math.random() * 100);
      }, 1000);
    }
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase]);

  function start() {
    setElapsed(0);
    setPhase("recording");
  }
  function stop() {
    if (timerRef.current) window.clearInterval(timerRef.current);
    setPhase("review");
  }
  function retake() {
    setElapsed(0);
    setPhase("prompt");
  }
  function send() {
    setPhase("sent");
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");
  const pct = (elapsed / MAX) * 100;

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Enregistrer un vœu</p>
        <span className="w-9" />
      </div>

      {phase === "prompt" && (
        <>
          <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6 text-center">
            <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-primary" /> Message aux mariés
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Un message qui<br />traverse la distance</h1>
            <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
              Absent·e le jour J ? Enregistrez un mot qui sera projeté au moment des discours.
            </p>
          </section>

          <section className="px-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "video" as const, icon: Video, label: "Vidéo", desc: "2 min max, HD" },
                  { id: "audio" as const, icon: Mic, label: "Vocal", desc: "2 min max" },
                ]
              ).map((m) => {
                const Icon = m.icon;
                const active = mode === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={`rounded-2xl border-2 p-4 text-left transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <Icon className={`h-6 w-6 ${active ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="mt-2 text-sm font-semibold">{m.label}</p>
                    <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="mt-6 px-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> Inspirations
            </p>
            <ul className="space-y-1.5">
              {prompts.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => setPrompt(p)}
                    className={`flex w-full items-center gap-2 rounded-2xl px-3.5 py-3 text-left text-sm transition-colors ${
                      prompt === p ? "bg-primary/10 ring-1 ring-primary/40" : "bg-card ring-1 ring-border/60"
                    }`}
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
                        prompt === p ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {prompt === p && <Check className="h-3 w-3" />}
                    </span>
                    {p}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 px-4">
            <div className="rounded-3xl bg-secondary/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <Clock className="h-3.5 w-3.5 text-primary" /> Conseil
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Trouvez un endroit calme, souriez, parlez comme si les mariés étaient devant vous. Une minute suffit.
              </p>
            </div>
          </section>

          <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
            <button
              onClick={start}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-destructive py-4 text-sm font-bold text-white shadow-glow"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-white" /> Commencer l'enregistrement
            </button>
          </div>
        </>
      )}

      {phase === "recording" && (
        <section className="px-4 pt-4">
          {mode === "video" ? (
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-black">
              <div className="absolute inset-0 grid place-items-center text-white/60">
                <div className="text-center">
                  <Camera className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-xs">Aperçu caméra</p>
                </div>
              </div>
              <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[10px] font-bold text-white">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> REC
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-1 font-mono text-[11px] font-bold text-white backdrop-blur">
                {mm}:{ss}
              </span>
              <p className="absolute inset-x-4 bottom-16 text-center font-serif text-lg italic text-white/95 drop-shadow">
                « {prompt} »
              </p>
            </div>
          ) : (
            <div className="grid aspect-square place-items-center rounded-3xl bg-gradient-to-br from-primary via-primary/70 to-accent">
              <div className="relative">
                <span className="absolute -inset-8 rounded-full bg-white/20 animate-ping" />
                <span className="relative grid h-32 w-32 place-items-center rounded-full bg-white text-primary shadow-2xl">
                  <Mic className="h-14 w-14" />
                </span>
              </div>
            </div>
          )}

          <div className="mt-5 flex gap-0.5">
            {Array.from({ length: 30 }).map((_, i) => (
              <span
                key={i}
                className={`h-8 flex-1 rounded-sm ${
                  i / 30 < level / 100 ? "bg-primary" : "bg-secondary"
                }`}
                style={{ opacity: 0.3 + Math.random() * 0.7 }}
              />
            ))}
          </div>

          <div className="mt-4">
            <div className="h-1.5 rounded-full bg-secondary">
              <div className="h-full rounded-full bg-destructive transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
              <span className="font-mono">{mm}:{ss}</span>
              <span>02:00 max</span>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
            <button
              onClick={stop}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-4 text-sm font-bold text-background"
            >
              <Square className="h-4 w-4 fill-current" /> Terminer
            </button>
          </div>
        </section>
      )}

      {phase === "review" && (
        <section className="px-4 pt-4">
          <div className="relative overflow-hidden rounded-3xl bg-slate-900">
            {mode === "video" ? (
              <div className="relative aspect-[3/4]">
                <div className="absolute inset-0 grid place-items-center text-white/60">
                  <Play className="h-14 w-14 opacity-80" />
                </div>
              </div>
            ) : (
              <div className="grid aspect-square place-items-center bg-gradient-to-br from-primary/40 to-accent/40">
                <div className="text-center text-white">
                  <Mic className="mx-auto h-10 w-10" />
                  <div className="mt-3 flex items-end gap-0.5">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <span
                        key={i}
                        className="w-1 rounded-full bg-white/80"
                        style={{ height: `${10 + Math.sin(i) * 20 + Math.random() * 20}px` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold">Durée · {mm}:{ss}</span>
            <span className="rounded-full bg-secondary px-2.5 py-1 font-semibold capitalize">{mode}</span>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 font-semibold text-primary">HD</span>
          </div>

          <label className="mt-5 block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Petit mot pour les mariés (optionnel)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Depuis Sydney avec tout mon amour…"
              rows={3}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            />
          </label>

          <div className="mt-6 flex gap-2">
            <button
              onClick={retake}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border bg-card py-3 text-sm font-semibold"
            >
              <RotateCcw className="h-4 w-4" /> Refaire
            </button>
            <button
              onClick={send}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-primary-foreground shadow-glow"
            >
              <Send className="h-4 w-4" /> Envoyer
            </button>
          </div>
        </section>
      )}

      {phase === "sent" && (
        <section className="px-4 pt-10 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow">
            <Check className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-serif text-3xl leading-tight">Message envoyé</h1>
          <p className="mx-auto mt-3 max-w-xs text-sm text-muted-foreground">
            Il sera diffusé le 14 juin à 21 h, pendant les discours. Sarah & Thomas le découvriront ensemble.
          </p>

          <button onClick={retake} className="mt-6 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold">
            Enregistrer un autre vœu
          </button>
        </section>
      )}

      {phase === "prompt" && (
        <section className="mt-6 px-4">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Déjà envoyés · {submitted.length}</p>
          <ul className="space-y-2">
            {submitted.map((s) => (
              <li key={s.author} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary">
                  {s.type === "Vidéo" ? <Video className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{s.author}</p>
                  <p className="text-[10px] text-muted-foreground">{s.type} · {s.duration} · {s.tone} · {s.when}</p>
                </div>
                <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
