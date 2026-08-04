import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, MapPin, Clock, Sparkles, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/photo-spots")({
  component: PhotoSpots,
  head: () => ({
    meta: [
      { title: "Spots photo · MaFeliza" },
      { name: "description", content: "Les meilleurs endroits et heures pour capturer vos souvenirs, avec conseils lumière." },
      { property: "og:title", content: "Spots photo · MaFeliza" },
      { property: "og:description", content: "La lumière parfaite, au bon moment." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Spot = {
  id: string;
  name: string;
  place: string;
  hour: string;
  light: "Golden hour" | "Blue hour" | "Ombre douce" | "Plein soleil";
  best: string[];
  photo: string;
};

const spots: Spot[] = [
  { id: "s1", name: "Allée des chênes", place: "Entrée du domaine", hour: "17h45 – 18h30", light: "Golden hour", best: ["Couple", "Famille"], photo: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800" },
  { id: "s2", name: "Escalier de pierre", place: "Aile ouest", hour: "16h00 – 17h00", light: "Ombre douce", best: ["Groupe", "Témoins"], photo: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800" },
  { id: "s3", name: "Jardin à la française", place: "Face sud", hour: "10h00 – 11h30", light: "Plein soleil", best: ["Enfants", "Cocktail"], photo: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800" },
  { id: "s4", name: "Miroir du lac", place: "Sud du domaine", hour: "21h15 – 21h45", light: "Blue hour", best: ["Portrait", "First-look"], photo: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800" },
];

const lightColor: Record<Spot["light"], string> = {
  "Golden hour": "bg-gold/25 text-gold",
  "Blue hour": "bg-primary-dark/15 text-primary-dark",
  "Ombre douce": "bg-success/15 text-success",
  "Plein soleil": "bg-primary/15 text-primary",
};

function PhotoSpots() {
  const { slug } = useParams({ from: "/events/$slug/photo-spots" });
  const [active, setActive] = useState<string>(spots[0].id);
  const current = spots.find((s) => s.id === active)!;

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Spots photo</p>
          <p className="text-xs text-muted-foreground">{spots.length} lieux repérés · lumière optimale</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="overflow-hidden rounded-3xl bg-surface shadow-card">
          <div className="relative aspect-[16/10]">
            <img src={current.photo} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <span className={`inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold ${lightColor[current.light]}`}>
                <Sparkles className="h-3 w-3" /> {current.light}
              </span>
              <p className="mt-2 font-serif text-2xl leading-tight">{current.name}</p>
              <p className="text-xs opacity-90">{current.place}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="rounded-2xl bg-cream p-3">
              <Clock className="h-4 w-4 text-primary" />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Créneau</p>
              <p className="font-serif text-lg">{current.hour}</p>
            </div>
            <div className="rounded-2xl bg-cream p-3">
              <Users className="h-4 w-4 text-primary" />
              <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Idéal pour</p>
              <p className="text-sm font-semibold">{current.best.join(" · ")}</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3">
          {spots.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={`overflow-hidden rounded-2xl border-2 text-left transition ${
                s.id === active ? "border-primary shadow-glow" : "border-border"
              }`}
            >
              <div className="relative aspect-video">
                <img src={s.photo} alt="" className="h-full w-full object-cover" />
                <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                  {s.hour.split(" ")[0]}
                </span>
              </div>
              <div className="bg-surface p-2.5">
                <p className="truncate text-xs font-semibold">{s.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{s.place}</p>
              </div>
            </button>
          ))}
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-5 text-white shadow-card">
          <Camera className="h-5 w-5" />
          <p className="mt-2 font-serif text-lg">Partagez avec le photographe</p>
          <p className="mt-1 text-sm opacity-90">Envoyez cette carte à votre photographe pour caler la shot-list.</p>
          <button className="mt-3 rounded-full bg-white/20 px-4 py-2 text-xs font-semibold backdrop-blur">
            <MapPin className="mr-1 inline h-3.5 w-3.5" /> Envoyer la carte
          </button>
        </section>
      </main>
    </div>
  );
}
