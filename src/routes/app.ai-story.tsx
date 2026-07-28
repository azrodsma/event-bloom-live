import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, Wand2, Loader2, Copy, Check, Upload, X, Image as ImageIcon, Film, GripVertical } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { composeStory } from "@/lib/story.functions";

type MediaItem = {
  id: string;
  file: File;
  kind: "image" | "video";
  url: string;
  duration?: number;
  caption: string;
};

const fmtSize = (b: number) => (b < 1024 * 1024 ? `${Math.round(b / 1024)} Ko` : `${(b / 1024 / 1024).toFixed(1)} Mo`);
const fmtDur = (s?: number) => (s ? `${Math.round(s)}s` : "");

export const Route = createFileRoute("/app/ai-story")({
  component: AIStory,
  head: () => ({
    meta: [
      { title: "Composeur IA · Memento Live" },
      { name: "description", content: "Générez un storyboard, une voix off et 8 légendes à partir de vos photos et clips." },
      { property: "og:title", content: "Composeur IA · Memento Live" },
      { property: "og:description", content: "L'IA rédige votre highlight reel dans le ton choisi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TONES = ["romantique", "drôle", "sobre", "poétique", "cinématique"] as const;
const EXAMPLES: Record<string, string> = {
  Mariage: "10:30 préparatifs mariée · rires · robe suspendue à la fenêtre\n14:30 échange des vœux sous la pergola de roses\n16:00 pluie de pétales sur le parvis\n18:45 discours du témoin, larmes puis fou rire\n20:15 séance golden hour dans le champ de blé\n22:30 ouverture de bal sur Ed Sheeran\n23:45 feu d'artifice au bord de l'étang",
  Baptême: "10:00 arrivée famille église Saint-Vincent\n10:30 onction au saint-chrême, cierge allumé\n11:15 sortie sous les lys, grand-mère émue\n13:00 déjeuner jardin, gâteau baptême Yann Couvreur\n15:00 photo des 4 générations sous le cèdre",
  Anniversaire: "18:00 cocktail rooftop coucher soleil\n19:15 vidéo surprise 40 ans en 40 sec\n22:00 blind test décennies\n23:15 gâteau feu de Bengale\n01:00 DJ set house lasers",
};

function AIStory() {
  const compose = useServerFn(composeStory);
  const [eventType, setEventType] = useState("Mariage");
  const [eventName, setEventName] = useState("Léa & Thomas");
  const [tone, setTone] = useState<(typeof TONES)[number]>("cinématique");
  const [moments, setMoments] = useState(EXAMPLES.Mariage);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => { media.forEach((m) => URL.revokeObjectURL(m.url)); }, [media]);

  const mediaDescriptor = (list: MediaItem[]) =>
    list.length
      ? "\n\nMédias fournis dans l'ordre voulu par l'utilisateur (respecte cette séquence pour le storyboard et les légendes) :\n" +
        list.map((m, i) => `${i + 1}. ${m.kind === "image" ? "photo" : "clip " + fmtDur(m.duration)} — ${m.file.name}${m.caption ? " · " + m.caption : ""}`).join("\n")
      : "";

  const promptForModel = () => moments + mediaDescriptor(media);

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const next: MediaItem[] = [];
    for (const file of Array.from(files)) {
      const isImg = file.type.startsWith("image/");
      const isVid = file.type.startsWith("video/");
      if (!isImg && !isVid) continue;
      const url = URL.createObjectURL(file);
      const item: MediaItem = {
        id: crypto.randomUUID(),
        file,
        kind: isImg ? "image" : "video",
        url,
        caption: "",
      };
      if (isVid) {
        item.duration = await new Promise<number | undefined>((resolve) => {
          const v = document.createElement("video");
          v.preload = "metadata";
          v.onloadedmetadata = () => resolve(isFinite(v.duration) ? v.duration : undefined);
          v.onerror = () => resolve(undefined);
          v.src = url;
        });
      }
      next.push(item);
    }
    setMedia((m) => [...m, ...next]);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeMedia = (id: string) => {
    setMedia((m) => {
      const item = m.find((x) => x.id === id);
      if (item) URL.revokeObjectURL(item.url);
      return m.filter((x) => x.id !== id);
    });
  };

  const updateCaption = (id: string, caption: string) =>
    setMedia((m) => m.map((x) => (x.id === id ? { ...x, caption } : x)));

  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const reorder = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    setMedia((m) => {
      const from = m.findIndex((x) => x.id === fromId);
      const to = m.findIndex((x) => x.id === toId);
      if (from < 0 || to < 0) return m;
      const next = m.slice();
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  };

  const onGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const r = await compose({ data: { eventType, eventName, tone, moments: promptForModel(), language: "fr" } });
      setResult(r.markdown);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur inconnue";
      if (msg.includes("429")) setError("Trop de requêtes. Réessayez dans quelques secondes.");
      else if (msg.includes("402")) setError("Crédits IA épuisés. Rechargez votre workspace.");
      else setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4">
          <Link to="/app" className="rounded-full bg-cream p-2">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl">Composeur IA</h1>
            <p className="text-xs text-muted-foreground">Storyboard · voix off · légendes</p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white">
          <Wand2 className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Décrivez vos moments. L'IA écrit le film.</h2>
          <p className="mt-3 text-sm opacity-90">Notre modèle rédige un titre, un storyboard 6 scènes (~90s), 8 légendes prêtes à poster et une invitation. Le tout dans le ton que vous choisissez.</p>
        </section>

        <section className="rounded-3xl border border-border/50 bg-card p-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Type d'événement</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {Object.keys(EXAMPLES).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => { setEventType(t); setMoments(EXAMPLES[t]); }}
                  className={`rounded-full px-4 py-1.5 text-xs border ${eventType === t ? "bg-primary text-white border-primary" : "bg-cream border-border/50"}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Nom de l'événement</label>
            <input
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-border/50 bg-background px-4 py-2.5 text-sm font-display"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Ton</label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {TONES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`rounded-full px-4 py-1.5 text-xs border capitalize ${tone === t ? "bg-foreground text-white border-foreground" : "bg-cream border-border/50"}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground">Moments capturés</label>
            <textarea
              value={moments}
              onChange={(e) => setMoments(e.target.value)}
              rows={8}
              placeholder="Une ligne par photo, clip ou note vocale…"
              className="mt-2 w-full rounded-xl border border-border/50 bg-background px-4 py-3 text-sm resize-y font-mono leading-relaxed"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">{moments.length} / 4000 caractères</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase tracking-wider text-muted-foreground">Photos & clips</label>
              <span className="text-[10px] text-muted-foreground">{media.length} fichier{media.length > 1 ? "s" : ""}</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-2 w-full rounded-xl border-2 border-dashed border-border bg-cream/50 px-4 py-6 flex flex-col items-center gap-1.5 text-sm text-muted-foreground hover:border-primary hover:bg-primary/5 transition"
            >
              <Upload className="h-5 w-5 text-primary" />
              <span className="font-medium text-foreground">Importer photos & clips</span>
              <span className="text-[11px]">JPG, PNG, HEIC, MP4, MOV — jusqu'à 20 Mo / fichier</span>
            </button>

            {media.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {media.map((m, i) => (
                  <div
                    key={m.id}
                    draggable
                    onDragStart={(e) => { setDragId(m.id); e.dataTransfer.effectAllowed = "move"; }}
                    onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (overId !== m.id) setOverId(m.id); }}
                    onDragLeave={() => { if (overId === m.id) setOverId(null); }}
                    onDrop={(e) => { e.preventDefault(); if (dragId) reorder(dragId, m.id); setDragId(null); setOverId(null); }}
                    onDragEnd={() => { setDragId(null); setOverId(null); }}
                    className={`rounded-xl border bg-background overflow-hidden transition ${overId === m.id && dragId !== m.id ? "border-primary ring-2 ring-primary/30" : "border-border/50"} ${dragId === m.id ? "opacity-40" : ""}`}
                  >
                    <div className="relative aspect-video bg-foreground/5">
                      {m.kind === "image" ? (
                        <img src={m.url} alt="" className="h-full w-full object-cover pointer-events-none" />
                      ) : (
                        <video src={m.url} className="h-full w-full object-cover pointer-events-none" muted playsInline />
                      )}
                      <span className="absolute top-1.5 left-1.5 rounded-full bg-black/60 text-white text-[10px] px-1.5 py-0.5 flex items-center gap-1">
                        <GripVertical className="h-2.5 w-2.5" />
                        {m.kind === "image" ? <ImageIcon className="h-2.5 w-2.5" /> : <Film className="h-2.5 w-2.5" />}
                        {i + 1}{m.duration ? ` · ${fmtDur(m.duration)}` : ""}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeMedia(m.id)}
                        className="absolute top-1.5 right-1.5 rounded-full bg-black/60 text-white p-1"
                        aria-label="Retirer"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="p-2 flex items-center gap-1.5">
                      <GripVertical className="h-3 w-3 text-muted-foreground shrink-0 cursor-grab" />
                      <div className="flex-1 min-w-0">
                        <input
                          value={m.caption}
                          onChange={(e) => updateCaption(m.id, e.target.value)}
                          onDragStart={(e) => e.preventDefault()}
                          placeholder="Décrivez ce moment…"
                          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                        />
                        <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{m.file.name} · {fmtSize(m.file.size)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {media.length > 0 && (
              <p className="mt-2 text-[10px] text-muted-foreground">
                Glissez-déposez les tuiles pour changer l'ordre — l'IA suivra cette séquence pour le storyboard et les légendes.
              </p>
            )}
          </div>

          <button
            onClick={onGenerate}
            disabled={loading || moments.trim().length < 10}
            className="w-full rounded-2xl bg-gradient-to-r from-primary to-gold px-6 py-4 text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-transform active:scale-[0.98]"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> L'IA compose…</> : <><Sparkles className="h-4 w-4" /> Générer le récit</>}
          </button>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </section>

        {result && (
          <section className="rounded-3xl border border-border/50 bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl">Votre récit</h3>
              <button onClick={copy} className="text-xs flex items-center gap-1.5 text-primary bg-primary/10 rounded-full px-3 py-1.5">
                {copied ? <><Check className="h-3 w-3" /> Copié</> : <><Copy className="h-3 w-3" /> Copier le markdown</>}
              </button>
            </div>
            <article className="prose prose-sm max-w-none prose-headings:font-display prose-headings:text-foreground prose-h2:text-primary prose-h2:mt-6 prose-h2:mb-3 prose-p:text-foreground/80 prose-strong:text-foreground prose-li:text-foreground/80">
              <ReactMarkdown>{result}</ReactMarkdown>
            </article>
          </section>
        )}

        <div className="rounded-2xl bg-cream p-5 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Confidentialité</p>
          <p className="mt-1">Vos moments ne sont ni stockés côté IA, ni utilisés pour l'entraînement. Le modèle Gemini 3.6 Flash traite votre requête en flux chiffré et efface le contexte à la fin.</p>
        </div>
      </main>
    </div>
  );
}
