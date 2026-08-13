import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, Type, Mic, Camera, Video, Sparkles, Send, X, Pause, LogIn } from "lucide-react";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getEventBySlug } from "@/lib/events.functions";
import { createGuestbookEntry } from "@/lib/guestbook.functions";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) throw notFound();
    return { event: { id: db.id, slug: db.slug, title: db.title } };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/guestbook/new")({
  head: ({ params }) => ({
    meta: [
      { title: "Laisser un message — MaFeliza" },
      { name: "description", content: `Écrivez un mot doux pour ${params.slug}.` },
    ],
  }),
  loader: routeLoader,
  component: NewEntry,
});

type Mode = "text" | "voice" | "photo" | "video";

async function uploadToStorage(file: Blob, ext: string, eventId: string): Promise<string> {
  const path = `guestbook/${eventId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("event-media").upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  const { data } = supabase.storage.from("event-media").getPublicUrl(path);
  return data.publicUrl;
}

function NewEntry() {
  const { event } = Route.useLoaderData() as RouteLoaderData;
  const { user } = useAuth();
  const navigate = useNavigate();
  const create = useServerFn(createGuestbookEntry);

  const [mode, setMode] = useState<Mode>("text");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const toggleRec = async () => {
    if (recording) {
      mediaRef.current?.stop();
      if (timerRef.current) window.clearInterval(timerRef.current);
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => chunksRef.current.push(e.data);
      rec.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      mediaRef.current = rec;
      setSeconds(0);
      const start = Date.now();
      timerRef.current = window.setInterval(
        () => setSeconds(Math.floor((Date.now() - start) / 1000)),
        500,
      );
      setRecording(true);
    } catch (e) {
      setError("Micro indisponible");
    }
  };

  const submit = async () => {
    if (!user) return;
    setSending(true);
    setError(null);
    try {
      if (mode === "text") {
        if (!text.trim()) throw new Error("Message vide");
        await create({ data: { eventId: event.id, kind: "text", content: text.trim() } });
      } else if (mode === "photo" || mode === "video") {
        if (!file) throw new Error("Aucun fichier sélectionné");
        const ext = file.name.split(".").pop() || (mode === "photo" ? "jpg" : "mp4");
        const url = await uploadToStorage(file, ext, event.id);
        await create({
          data: {
            eventId: event.id,
            kind: mode,
            content: text.trim() || undefined,
            mediaUrl: url,
          },
        });
      } else if (mode === "voice") {
        if (!audioBlob) throw new Error("Aucun enregistrement");
        const url = await uploadToStorage(audioBlob, "webm", event.id);
        await create({ data: { eventId: event.id, kind: "audio", mediaUrl: url } });
      }
      navigate({ to: "/events/$slug/guestbook", params: { slug: event.slug } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
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

  const canSend =
    !sending &&
    !!user &&
    ((mode === "text" && text.trim().length > 0) ||
      ((mode === "photo" || mode === "video") && !!file) ||
      (mode === "voice" && !!audioBlob));

  return (
    <div className="min-h-screen bg-gradient-warm pb-32">
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
          <p className="mt-1 text-sm opacity-90">Un souvenir précieux à retrouver après l'événement.</p>
        </section>

        {!user && (
          <Link
            to="/auth"
            className="flex items-center justify-center gap-2 rounded-3xl bg-surface p-4 text-sm font-semibold shadow-card"
          >
            <LogIn className="h-4 w-4" /> Se connecter pour publier
          </Link>
        )}

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
                  <span className={`text-[11px] font-semibold ${active ? "text-primary" : "text-foreground"}`}>
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

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
                {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                {String(seconds % 60).padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {recording ? "Enregistrement…" : audioBlob ? "Prêt à envoyer ✓" : "Appuyez pour commencer"}
              </p>
              {audioBlob && !recording && (
                <audio controls src={URL.createObjectURL(audioBlob)} className="mt-4 w-full" />
              )}
            </div>
          )}

          {(mode === "photo" || mode === "video") && (
            <div className="flex flex-col items-center gap-4 py-4">
              <label className="flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-background p-6">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-light">
                  {mode === "photo" ? (
                    <Camera className="h-8 w-8 text-primary" />
                  ) : (
                    <Video className="h-8 w-8 text-primary" />
                  )}
                </div>
                <p className="font-serif text-lg">
                  {file ? file.name : mode === "photo" ? "Ajoutez une photo" : "Ajoutez une vidéo"}
                </p>
                <input
                  type="file"
                  accept={mode === "photo" ? "image/*" : "video/*"}
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <span className="rounded-full bg-gradient-primary px-5 py-2 text-sm font-semibold text-white shadow-glow">
                  Choisir un fichier
                </span>
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ajouter une légende…"
                rows={2}
                className="w-full resize-none rounded-2xl border border-border bg-background p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
          )}
        </section>

        {error && (
          <p className="rounded-2xl bg-live/10 p-3 text-center text-sm text-live">{error}</p>
        )}
      </main>

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
            onClick={submit}
            disabled={!canSend}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> {sending ? "Envoi…" : "Envoyer au livre d'or"}
          </button>
        </div>
      </div>
    </div>
  );
}
