import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { findEvent } from "@/lib/mock-data";
import { ChevronLeft, Type, Mic, Camera, Video, Sparkles, Send, X, Pause } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/guestbook/new")({
  head: ({ params }) => ({
    meta: [
      { title: "Laisser un message — Memento Live" },
      { name: "description", content: `Écrivez un mot doux pour ${params.slug}.` },
    ],
  }),
  loader: ({ params }) => {
    const e = findEvent(params.slug);
    if (!e) throw notFound();
    return { event: e };
  },
  component: NewEntry,
});

type Mode = "text" | "voice" | "photo" | "video";

function NewEntry() {
  const { event } = Route.useLoaderData();
  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sent, setSent] = useState(false);

  const toggleRec = () => {
    setRecording((r) => !r);
    if (!recording) {
      const start = Date.now();
      const id = setInterval(() => setSeconds(Math.floor((Date.now() - start) / 1000)), 500);
      (window as unknown as { __rec?: number }).__rec = id as unknown as number;
    } else {
      clearInterval((window as unknown as { __rec?: number }).__rec);
    }
  };

  const modes: { id: Mode; label: string; icon: typeof Type }[] = [
    { id: "text", label: "Texte", icon: Type },
    { id: "voice", label: "Vocal", icon: Mic },
    { id: "photo", label: "Photo", icon: Camera },
    { id: "video", label: "Vidéo", icon: Video },
  ];

  const suggestions = [
    "Merci pour ce moment inoubliable ✨",
    "Vous rayonnez, tout simplement magique 💫",
    "Longue vie à votre bonheur 💕",
    "Ce jour restera gravé à jamais 🌸",
  ];

  return (
    <div className="min-h-screen bg-gradient-warm pb-24">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link
          to="/events/$slug/guestbook"
          params={{ slug: event.slug }}
          className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface"
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight">Livre d'or</p>
          <p className="truncate text-[11px] text-muted-foreground">{event.title}</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-primary p-5 text-white shadow-glow">
          <Sparkles className="h-5 w-5 opacity-80" />
          <h1 className="mt-2 font-serif text-2xl leading-tight">Laissez un mot doux</h1>
          <p className="mt-1 text-sm opacity-90">
            Un souvenir précieux à retrouver après l'événement.
          </p>
        </section>

        {/* Mode picker */}
        <section>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Format</p>
          <div className="grid grid-cols-4 gap-2">
            {modes.map((m) => {
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-2xl border-2 py-3 transition-colors ${
                    active ? "border-primary bg-primary-light" : "border-border bg-background"
                  }`}
                >
                  <m.icon className={`h-4 w-4 ${active ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[11px] font-semibold ${active ? "text-primary" : "text-foreground"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Composer */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          {mode === "text" && (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Écrivez votre message…"
                rows={6}
                maxLength={500}
                className="w-full resize-none rounded-2xl border border-border bg-background p-4 font-serif text-lg leading-relaxed placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{text.length} / 500</span>
                <button className="font-semibold text-primary">✨ Aide-moi à écrire</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => setText(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs hover:bg-primary-light"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          )}

          {mode === "voice" && (
            <div className="flex flex-col items-center py-6">
              <button
                onClick={toggleRec}
                className={`relative grid h-24 w-24 place-items-center rounded-full text-white shadow-glow transition-transform ${
                  recording ? "bg-live scale-105" : "bg-gradient-primary"
                }`}
                aria-label={recording ? "Arrêter" : "Enregistrer"}
              >
                {recording ? <Pause className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                {recording && <span className="animate-ping absolute inset-0 rounded-full bg-live/40" />}
              </button>
              <p className="mt-4 font-serif text-3xl tabular-nums">
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {recording ? "Enregistrement en cours…" : "Appuyez pour commencer"}
              </p>
              {seconds > 0 && !recording && (
                <div className="mt-5 flex items-end gap-0.5">
                  {Array.from({ length: 28 }).map((_, i) => (
                    <span key={i} className="w-1 rounded-full bg-primary/60" style={{ height: `${8 + ((i * 13) % 20)}px` }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {(mode === "photo" || mode === "video") && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="grid h-24 w-24 place-items-center rounded-3xl bg-primary-light">
                {mode === "photo" ? <Camera className="h-10 w-10 text-primary" /> : <Video className="h-10 w-10 text-primary" />}
              </div>
              <div className="text-center">
                <p className="font-serif text-lg">
                  {mode === "photo" ? "Ajoutez une photo" : "Enregistrez une vidéo"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {mode === "photo" ? "JPG, PNG · max 10 Mo" : "MP4 · max 60 secondes"}
                </p>
              </div>
              <button className="rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow">
                Choisir un fichier
              </button>
              <textarea
                placeholder="Ajouter une légende…"
                rows={2}
                className="w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </section>

        {/* Author */}
        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Signature</p>
          <div className="mt-3 flex items-center gap-3">
            <img src="https://i.pravatar.cc/80?img=32" alt="" className="h-10 w-10 rounded-full object-cover" />
            <input
              defaultValue="Camille & Jules"
              className="flex-1 rounded-2xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <label className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="h-4 w-4 rounded border-border text-primary" />
            Publier de façon anonyme
          </label>
        </section>
      </main>

      {/* Send bar */}
      <div className="fixed inset-x-0 bottom-16 z-10 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Link
            to="/events/$slug/guestbook"
            params={{ slug: event.slug }}
            className="grid h-11 w-11 place-items-center rounded-full border border-border"
            aria-label="Annuler"
          >
            <X className="h-4 w-4" />
          </Link>
          <button
            onClick={() => {
              setSent(true);
              setTimeout(() => setSent(false), 2500);
            }}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow"
          >
            <Send className="h-4 w-4" /> {sent ? "Message envoyé ✓" : "Envoyer au livre d'or"}
          </button>
        </div>
      </div>
    </div>
  );
}
