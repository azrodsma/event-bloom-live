import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { ChevronLeft, Upload, ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { getEventBySlug, createStory } from "@/lib/events.functions";
import { uploadEventMedia } from "@/lib/storage";
import { useAuth } from "@/hooks/use-auth";

const routeLoader = async ({ params }: { params: { slug: string } }) => {
    const ev = await getEventBySlug({ data: { slug: params.slug } });
    if (!ev) throw notFound();
    return { event: ev };
  };
type RouteLoaderData = Awaited<ReturnType<typeof routeLoader>>;

export const Route = createFileRoute("/events/$slug/story/new")({
  head: ({ params }) => ({
    meta: [
      { title: `Nouvelle story — ${params.slug} — MaFeliza` },
      { name: "description", content: "Partagez une story éphémère (24 h) pour votre événement." },
    ],
  }),
  loader: routeLoader,
  component: NewStory,
});

function NewStory() {
  const { event } = Route.useLoaderData() as RouteLoaderData;
  const { user } = useAuth();
  const router = useRouter();
  const create = useServerFn(createStory);
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPick = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !file) return;
    setBusy(true);
    try {
      const { url } = await uploadEventMedia({ eventId: event.id, file, userId: user.id });
      const mediaType: "image" | "video" = file.type.startsWith("video") ? "video" : "image";
      await create({ data: { eventId: event.id, mediaUrl: url, mediaType } });
      toast.success("Story publiée pour 24 h");
      router.navigate({ to: "/events/$slug", params: { slug: event.slug } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Échec");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="module-page">
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
          <h1 className="font-serif text-xl">Nouvelle story</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {!user ? (
          <div className="rounded-3xl bg-surface p-6 text-center shadow-card">
            <p className="text-sm text-muted-foreground">Connectez-vous pour publier une story.</p>
            <Link
              to="/auth"
              className="mt-3 inline-flex rounded-full bg-gradient-primary px-4 py-2 text-sm font-semibold text-white shadow-glow"
            >
              Se connecter
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPick(f);
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="grid aspect-[9/16] w-full place-items-center overflow-hidden rounded-3xl bg-surface shadow-card"
            >
              {preview ? (
                file?.type.startsWith("video") ? (
                  <video src={preview} className="h-full w-full object-cover" autoPlay muted loop playsInline />
                ) : (
                  <img src={preview} alt="" className="h-full w-full object-cover" />
                )
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImagePlus className="mx-auto h-10 w-10" />
                  <p className="mt-2 text-sm font-medium">Choisir photo ou vidéo</p>
                  <p className="mt-1 text-xs">Visible pendant 24 h</p>
                </div>
              )}
            </button>
            <button
              type="submit"
              disabled={!file || busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-60"
            >
              <Upload className="h-4 w-4" /> {busy ? "Publication…" : "Publier ma story"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
