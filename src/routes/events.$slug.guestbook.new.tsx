import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  ChevronLeft,
  Mic,
  Video,
  Heart,
  X,
  Pause,
  LogIn,
  MoreHorizontal,
  Globe,
  Lock,
  Image as ImageIcon,
} from "lucide-react";
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
      { title: "Écrire un message — MaFeliza" },
      { name: "description", content: `Texte, photo, vidéo ou vocal pour ${params.slug}.` },
      { property: "og:title", content: "Écrire un message — MaFeliza" },
      { property: "og:description", content: "Texte, photo, vidéo (30s) ou message vocal (2min)." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  const [preview, setPreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [publicVisible, setPublicVisible] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const photoInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const pick = (kind: "photo" | "video") => {
    if (mode === kind && file) {
      setFile(null);
      setPreview(null);
      setMode("text");
      return;
    }
    (kind === "photo" ? photoInput : videoInput).current?.click();
  };

  const onFile = (kind: "photo" | "video", f: File | null) => {
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setMode(kind);
    setAudioBlob(null);
  };

  const toggleRec = async () => {
    if (mode !== "voice") {
      setMode("voice");
      setFile(null);
      setPreview(null);
      return;
    }
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
      timerRef.current = window.setInterval(() => {
        const s = Math.floor((Date.now() - start) / 1000);
        setSeconds(s);
        if (s >= 120) {
          rec.stop();
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRecording(false);
        }
      }, 500);
      setRecording(true);
    } catch {
      setError("Micro indisponible");
    }
  };

  const submit = async () => {
    if (!user) return;
    setSending(true);
    setError(null);
    try {
      if (mode === "photo" || mode === "video") {
        if (!file) throw new Error("Aucun fichier sélectionné");
        const ext = file.name.split(".").pop() || (mode === "photo" ? "jpg" : "mp4");
        const url = await uploadToStorage(file, ext, event.id);
        await create({
          data: { eventId: event.id, kind: mode, content: text.trim() || undefined, mediaUrl: url },
        });
      } else if (mode === "voice") {
        if (!audioBlob) throw new Error("Aucun enregistrement");
        const url = await uploadToStorage(audioBlob, "webm", event.id);
        await create({ data: { eventId: event.id, kind: "audio", mediaUrl: url } });
      } else {
        if (!text.trim()) throw new Error("Message vide");
        await create({ data: { eventId: event.id, kind: "text", content: text.trim() } });
      }
      navigate({ to: "/events/$slug/guestbook", params: { slug: event.slug } });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSending(false);
    }
  };

  const canSend =
    !sending &&
    !!user &&
    ((mode === "text" && text.trim().length > 0) ||
      ((mode === "photo" || mode === "video") && !!file) ||
      (mode === "voice" && !!audioBlob));

  const actions = [
    { id: "photo" as const, label: "Photo", hint: "", icon: ImageIcon, onClick: () => pick("photo") },
    { id: "video" as const, label: "Vidéo", hint: "30 secondes", icon: Video, onClick: () => pick("video") },
    { id: "voice" as const, label: "Vocal", hint: "2 minutes", icon: Mic, onClick: toggleRec },
  ];

  return (
    <div className="module-page min-h-dvh bg-background pb-8">
      {/* Header centré */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur-2xl safe-top">
        <div className="mx-auto grid max-w-2xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5">
          <Link
            to="/events/$slug/guestbook"
            params={{ slug: event.slug }}
            aria-label="Retour"
            className="tap grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 text-center">
            <p className="truncate text-[17px] font-bold leading-tight">Livre d'or</p>
            <p className="truncate text-[13px] font-medium text-muted-foreground">{event.title}</p>
          </div>
          <button
            aria-label="Plus d'options"
            className="tap grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-4 px-4 py-4">
        {/* Grand champ de texte */}
        <section className="relative rounded-[22px] bg-surface p-4 shadow-card ring-1 ring-border/60">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Écrivez quelques mots pour les mariés..."
            rows={7}
            maxLength={500}
            className="w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none placeholder:text-muted-foreground"
          />
          <span className="absolute bottom-3 right-4 text-[11px] font-medium text-muted-foreground">
            {text.length}/500
          </span>
        </section>

        {/* Tuiles de format */}
        <input
          ref={photoInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFile("photo", e.target.files?.[0] ?? null)}
        />
        <input
          ref={videoInput}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => onFile("video", e.target.files?.[0] ?? null)}
        />
        <div className="grid grid-cols-3 gap-3">
          {actions.map((a) => {
            const active = mode === a.id;
            return (
              <button
                key={a.id}
                onClick={a.onClick}
                aria-pressed={active}
                className={`tap flex flex-col items-center justify-center gap-1.5 rounded-[18px] py-5 transition-colors ${
                  active
                    ? "bg-primary-light text-primary ring-1 ring-primary/50"
                    : "bg-surface text-foreground shadow-card ring-1 ring-border/60"
                }`}
              >
                <a.icon className="h-6 w-6" strokeWidth={1.7} />
                <span className="text-[13px] font-semibold leading-none">{a.label}</span>
                {a.hint && (
                  <span className="text-[10px] font-medium leading-none text-muted-foreground">
                    {a.hint}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Aperçu média sélectionné */}
        {preview && (mode === "photo" || mode === "video") && (
          <div className="relative overflow-hidden rounded-[18px] bg-muted">
            {mode === "photo" ? (
              <img src={preview} alt="Aperçu" className="aspect-[4/3] w-full object-cover" />
            ) : (
              <video src={preview} controls className="aspect-[4/3] w-full object-cover" />
            )}
            <button
              onClick={() => {
                setFile(null);
                setPreview(null);
                setMode("text");
              }}
              aria-label="Retirer le média"
              className="tap absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/85 backdrop-blur"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Enregistreur vocal */}
        {mode === "voice" && (
          <div className="flex flex-col items-center rounded-[18px] bg-surface py-6 shadow-card ring-1 ring-border/60">
            <button
              onClick={toggleRec}
              aria-label={recording ? "Arrêter" : "Enregistrer"}
              className={`relative grid h-20 w-20 place-items-center rounded-full text-primary-foreground shadow-glow ${
                recording ? "scale-105 bg-live" : "bg-gradient-primary"
              }`}
            >
              {recording ? <Pause className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
              {recording && <span className="animate-ping absolute inset-0 rounded-full bg-live/40" />}
            </button>
            <p className="mt-3 font-serif text-3xl tabular-nums">
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {recording ? "Enregistrement… (2 min max)" : audioBlob ? "Prêt à envoyer ✓" : "Appuyez pour commencer"}
            </p>
          </div>
        )}

        {/* Visibilité */}
        <button
          onClick={() => setPublicVisible((v) => !v)}
          aria-pressed={publicVisible}
          className="tap flex w-full items-center gap-3 rounded-[18px] bg-surface px-4 py-3.5 shadow-card ring-1 ring-border/60"
        >
          {publicVisible ? (
            <Globe className="h-4 w-4 shrink-0 text-foreground" />
          ) : (
            <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <span className="min-w-0 flex-1 text-left text-[13px] font-semibold">
            {publicVisible ? "Visible par tous les invités" : "Visible par les organisateurs"}
          </span>
          <span
            className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
              publicVisible ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-background transition-all ${
                publicVisible ? "left-6" : "left-1"
              }`}
            />
          </span>
        </button>

        {error && <p className="text-center text-[12px] font-medium text-live">{error}</p>}

        {/* Envoyer */}
        {user ? (
          <button
            onClick={submit}
            disabled={!canSend}
            className="tap flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-4 text-[15px] font-bold text-primary-foreground shadow-glow disabled:opacity-50"
          >
            <Heart className="h-4 w-4 fill-current" />
            {sending ? "Envoi…" : "Envoyer le message"}
          </button>
        ) : (
          <Link
            to="/auth"
            className="tap flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary py-4 text-[15px] font-bold text-primary-foreground shadow-glow"
          >
            <LogIn className="h-4 w-4" /> Se connecter pour publier
          </Link>
        )}
      </main>
    </div>
  );
}
