import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Video, Clock, MapPin } from "lucide-react";

export const Route = createFileRoute("/events/$slug/media-team")({
  component: MediaTeam,
  head: () => ({
    meta: [
      { title: "Équipe média · MaFeliza" },
      { name: "description", content: "Coordonnez photographes, vidéastes et cadreurs live sur une timeline unique." },
      { property: "og:title", content: "Équipe média · MaFeliza" },
      { property: "og:description", content: "Chaque instant, capté par la bonne personne." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const crew = [
  { name: "Léa Martin", role: "Photographe principale", tag: "photo", color: "from-primary to-primary-dark", start: "13:00", end: "23:30" },
  { name: "Kévin Roux", role: "Second photographe", tag: "photo", color: "from-primary/60 to-primary", start: "15:00", end: "21:00" },
  { name: "Studio Verso", role: "Vidéaste film", tag: "video", color: "from-gold to-primary-dark", start: "14:30", end: "23:00" },
  { name: "Ilan (drone)", role: "Cadreur aérien", tag: "video", color: "from-gold/70 to-gold", start: "16:00", end: "18:00" },
  { name: "Nora K.", role: "Cadreuse live YouTube", tag: "live", color: "from-primary-dark to-foreground", start: "16:30", end: "22:00" },
];

const shots = [
  { t: "13:00", who: "Léa", place: "Suite mariée", label: "Préparatifs · robe" },
  { t: "14:00", who: "Kévin", place: "Suite marié", label: "Préparatifs · costume" },
  { t: "16:00", who: "Ilan", place: "Parvis", label: "Drone arrivée cortège" },
  { t: "16:30", who: "Nora", place: "Autel", label: "Live cérémonie" },
  { t: "18:00", who: "Studio Verso", place: "Jardin", label: "Séance couple golden hour" },
  { t: "20:30", who: "Léa", place: "Salle", label: "Discours & rires" },
  { t: "22:30", who: "Kévin", place: "Piste", label: "Ouverture de bal" },
];

const badge: Record<string, { label: string; icon: any }> = {
  photo: { label: "Photo", icon: Camera },
  video: { label: "Vidéo", icon: Video },
  live: { label: "Live", icon: Video },
};

function MediaTeam() {
  const { slug } = useParams({ from: "/events/$slug/media-team" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Équipe média</p>
          <p className="text-xs text-muted-foreground">{crew.length} pros · {shots.length} moments clés</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">L'équipe</p>
          <div className="space-y-2">
            {crew.map((c) => {
              const B = badge[c.tag];
              const Icon = B.icon;
              return (
                <article key={c.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-soft">
                  <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${c.color} text-white shadow-glow`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  <div className="text-right">
                    <span className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-bold uppercase text-primary-dark">
                      {B.label}
                    </span>
                    <p className="mt-1 text-[11px] text-muted-foreground">{c.start}–{c.end}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Timeline média</p>
          <div className="relative rounded-3xl bg-surface p-4 shadow-soft">
            <div className="absolute left-[70px] top-4 bottom-4 w-px bg-border" />
            <div className="space-y-4">
              {shots.map((s) => (
                <div key={s.t + s.who} className="relative flex gap-3">
                  <div className="w-14 shrink-0 pt-1 text-right text-xs font-bold text-primary-dark">{s.t}</div>
                  <div className="relative z-10 mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-primary ring-4 ring-surface" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="rounded-full bg-cream px-2 py-0.5 font-bold text-primary-dark">{s.who}</span>
                      <MapPin className="h-3 w-3" /> {s.place}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-primary via-primary-dark to-gold p-5 text-white shadow-card">
          <Clock className="h-5 w-5" />
          <p className="mt-2 font-serif text-lg leading-tight">Livraison estimée</p>
          <p className="mt-1 text-sm opacity-90">Photos preview : 72h · Film complet : 5 semaines · Live replay : instantané.</p>
        </section>
      </main>
    </div>
  );
}
