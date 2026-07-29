import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Camera, Upload, Download, Grid3x3, Play, LogIn, Trash2, Pencil, Check, X } from "lucide-react";
import { findEvent } from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getEventBySlug } from "@/lib/events.functions";
import { adaptEvent } from "@/lib/event-adapter";
import { listAlbumMedia, createAlbumMedia, deleteAlbumMedia, updateAlbumCaption } from "@/lib/album.functions";
import { uploadEventMedia } from "@/lib/storage";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/events/$slug/album")({
  head: ({ params }) => ({
    meta: [
      { title: `Album — ${params.slug} — Memento Live` },
      { name: "description", content: "Album photo collaboratif de l'événement." },
    ],
  }),
  loader: async ({ params }) => {
    const db = await getEventBySlug({ data: { slug: params.slug } });
    if (!db) {
      const e = findEvent(params.slug);
      if (!e) throw notFound();
      return { event: e, dbId: null as string | null };
    }
    return { event: adaptEvent(db), dbId: db.id };
  },
  component: Album,
});

type Media = {
  id: string;
  uploader_id: string | null;
  uploader_name: string | null;
  url: string;
  media_type: string;
  caption: string | null;
  created_at: string;
};

function Album() {
  const { event, dbId } = Route.useLoaderData();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "image" | "video">("all");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingCaption, setPendingCaption] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const list = useServerFn(listAlbumMedia);
  const create = useServerFn(createAlbumMedia);
  const del = useServerFn(deleteAlbumMedia);
  const updateCap = useServerFn(updateAlbumCaption);

  const key = ["album", dbId] as const;
  const { data: photos = [] } = useQuery({
    queryKey: key,
    enabled: !!dbId,
    queryFn: async () => (await list({ data: { eventId: dbId! } })) as Media[],
  });

  useEffect(() => {
    if (!dbId) return;
    const ch = supabase
      .channel(`album-${dbId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "album_media", filter: `event_id=eq.${dbId}` },
        (payload) => {
          qc.setQueryData<Media[]>(key, (prev = []) => [payload.new as Media, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [dbId, qc]);

  const filtered = photos.filter((p) => (filter === "all" ? true : filter === "video" ? p.media_type === "video" : p.media_type === "image"));
  const active = photos.find((p) => p.id === selected);

  const onPickFiles = () => fileRef.current?.click();

  const onFilesChosen: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    if (!user || !dbId) return;
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (files.length === 0) return;
    setError(null);
    setUploading(true);
    try {
      const cap = pendingCaption.trim();
      for (const file of files) {
        const mediaType: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
        const { url } = await uploadEventMedia({ eventId: dbId, file, userId: user.id });
        await create({ data: { eventId: dbId, url, mediaType, caption: cap || undefined } });
      }
      setPendingCaption("");
      toast.success(files.length > 1 ? `${files.length} médias ajoutés` : "Média ajouté");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'envoi");
    } finally {
      setUploading(false);
    }
  };

  async function onDelete(id: string) {
    if (!confirm("Supprimer ce média ?")) return;
    try {
      await del({ data: { id } });
      qc.setQueryData<Media[]>(key, (prev = []) => prev.filter((p) => p.id !== id));
      setSelected(null);
      toast.success("Média supprimé");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec");
    }
  }

  async function onSaveCaption(id: string) {
    try {
      await updateCap({ data: { id, caption: editValue } });
      qc.setQueryData<Media[]>(key, (prev = []) => prev.map((p) => (p.id === id ? { ...p, caption: editValue } : p)));
      setEditingId(null);
      toast.success("Légende mise à jour");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec");
    }
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
          <Link
            to="/events/$slug"
            params={{ slug: event.slug }}
            className="grid h-10 w-10 place-items-center rounded-full bg-surface"
            aria-label="Retour"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Album collaboratif</h1>
            <p className="truncate text-xs text-muted-foreground">{event.title} · {photos.length} médias</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-surface" aria-label="Télécharger">
            <Download className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={onFilesChosen}
        />

        <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-primary p-4 text-white shadow-glow">
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg">Partagez vos plus belles photos</p>
            <p className="text-xs text-white/80">Toutes les photos ajoutées sont visibles par les invités.</p>
            {error && <p className="mt-1 text-xs font-semibold">⚠︎ {error}</p>}
          </div>
          {user ? (
            <button
              onClick={onPickFiles}
              disabled={uploading || !dbId}
              className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary disabled:opacity-70"
            >
              <Upload className="h-4 w-4" /> {uploading ? "Envoi…" : "Ajouter"}
            </button>
          ) : (
            <Link to="/auth" className="ml-3 flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
              <LogIn className="h-4 w-4" /> Connexion
            </Link>
          )}
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 font-medium ${filter === "all" ? "bg-primary text-white" : "bg-surface text-muted-foreground"}`}
          >
            <Grid3x3 className="h-3 w-3" /> Tout
          </button>
          <button
            onClick={() => setFilter("image")}
            className={`rounded-full px-3 py-1.5 font-medium ${filter === "image" ? "bg-primary text-white" : "bg-surface text-muted-foreground"}`}
          >
            Photos
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`rounded-full px-3 py-1.5 font-medium ${filter === "video" ? "bg-primary text-white" : "bg-surface text-muted-foreground"}`}
          >
            Vidéos
          </button>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl bg-surface p-8 text-center text-sm text-muted-foreground">
            Aucun média pour le moment. Sois le premier à partager une photo 📸
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {filtered.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-surface"
              >
                {p.media_type === "video" ? (
                  <video src={p.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img src={p.url} alt={`Photo de ${p.uploader_name ?? "Invité"}`} className="h-full w-full object-cover transition-transform group-active:scale-95" />
                )}
                {p.media_type === "video" && (
                  <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white">
                    <Play className="h-3 w-3" fill="currentColor" />
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      {active && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="ml-auto grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white"
            aria-label="Fermer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-center">
            {active.media_type === "video" ? (
              <video src={active.url} controls className="max-h-full max-w-full rounded-2xl" />
            ) : (
              <img src={active.url} alt="" className="max-h-full max-w-full rounded-2xl object-contain" />
            )}
          </div>
          <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
            <div>
              <p className="text-sm font-semibold">Partagé par {active.uploader_name ?? "Invité"}</p>
              <p className="text-xs text-white/70">{new Date(active.created_at).toLocaleString("fr-FR")}</p>
            </div>
          </div>
        </div>
      )}

      {user && (
        <button
          onClick={onPickFiles}
          disabled={uploading || !dbId}
          className="fixed bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-glow disabled:opacity-70"
          aria-label="Ajouter des photos"
        >
          <Camera className="h-6 w-6" />
        </button>
      )}
    </div>
  );
}
