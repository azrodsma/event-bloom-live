import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ChevronLeft, Camera, Upload, Download, Heart, Grid3x3, Play } from "lucide-react";
import { findEvent } from "@/lib/mock-data";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/album")({
  head: ({ params }) => ({
    meta: [
      { title: `Album — ${params.slug} — Memento Live` },
      { name: "description", content: "Album photo collaboratif de l'événement." },
    ],
  }),
  loader: ({ params }) => {
    const event = findEvent(params.slug);
    if (!event) throw notFound();
    return { event };
  },
  component: Album,
});

const photos = [
  { id: "p1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", author: "Marie", likes: 42, video: false },
  { id: "p2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800", author: "Alex", likes: 28, video: false },
  { id: "p3", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800", author: "Emma", likes: 51, video: false },
  { id: "p4", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800", author: "Julien", likes: 17, video: true },
  { id: "p5", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800", author: "Chloé", likes: 34, video: false },
  { id: "p6", url: "https://images.unsplash.com/photo-1530023367847-a683933f4172?w=800", author: "Papa", likes: 63, video: false },
  { id: "p7", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&sat=-20", author: "Léa", likes: 22, video: false },
  { id: "p8", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&hue=10", author: "Marc", likes: 9, video: true },
  { id: "p9", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=800&sat=-30", author: "Sofia", likes: 15, video: false },
];

function Album() {
  const { event } = Route.useLoaderData();
  const [selected, setSelected] = useState<string | null>(null);
  const active = photos.find((p) => p.id === selected);

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
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-gradient-primary p-4 text-white shadow-glow">
          <div>
            <p className="font-serif text-lg">Partagez vos plus belles photos</p>
            <p className="text-xs text-white/80">Toutes les photos ajoutées sont visibles par les invités.</p>
          </div>
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary">
            <Upload className="h-4 w-4" /> Ajouter
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2 text-xs">
          <button className="flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 font-medium text-white">
            <Grid3x3 className="h-3 w-3" /> Tout
          </button>
          <button className="rounded-full bg-surface px-3 py-1.5 font-medium text-muted-foreground">Photos</button>
          <button className="rounded-full bg-surface px-3 py-1.5 font-medium text-muted-foreground">Vidéos</button>
          <button className="rounded-full bg-surface px-3 py-1.5 font-medium text-muted-foreground">Mises en avant</button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-surface"
            >
              <img src={p.url} alt={`Photo de ${p.author}`} className="h-full w-full object-cover transition-transform group-active:scale-95" />
              {p.video && (
                <span className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-black/50 text-white">
                  <Play className="h-3 w-3" fill="currentColor" />
                </span>
              )}
              <span className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                <Heart className="h-3 w-3" fill="currentColor" /> {p.likes}
              </span>
            </button>
          ))}
        </div>
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
            <img src={active.url} alt="" className="max-h-full max-w-full rounded-2xl object-contain" />
          </div>
          <div className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl bg-white/10 p-3 text-white backdrop-blur">
            <div>
              <p className="text-sm font-semibold">Photo de {active.author}</p>
              <p className="text-xs text-white/70">{active.likes} j'aime</p>
            </div>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-primary">
              <Heart className="h-5 w-5" fill="currentColor" />
            </button>
          </div>
        </div>
      )}

      <button className="fixed bottom-8 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-primary text-white shadow-glow">
        <Camera className="h-6 w-6" />
      </button>
    </div>
  );
}
