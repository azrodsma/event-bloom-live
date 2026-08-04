import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Camera, Video, Radio, Plus } from "lucide-react";

export const Route = createFileRoute("/events/$slug/press-corner")({
  component: PressCorner,
  head: () => ({
    meta: [
      { title: "Coin presse · MaFeliza" },
      { name: "description", content: "Kit média prêt pour la presse et les créateurs de contenu." },
      { property: "og:title", content: "Coin presse · MaFeliza" },
      { property: "og:description", content: "Communiqué, visuels, accréditations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const accreds = [
  { name: "Sophie Marchand", media: "Vogue France", role: "Journaliste", status: "confirmée" },
  { name: "Yannick Rey", media: "Elle Décoration", role: "Photo lifestyle", status: "confirmée" },
  { name: "@lucie.creative", media: "Instagram · 148k", role: "Créatrice contenu", status: "en attente" },
  { name: "Ben Cortez", media: "Podcast Amour", role: "Interviews", status: "confirmée" },
];

function PressCorner() {
  const { slug } = useParams({ from: "/events/$slug/press-corner" });
  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Coin presse</p>
          <p className="text-xs text-muted-foreground">4 accréditations · kit prêt</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-foreground via-primary-dark to-primary p-6 text-white shadow-card">
          <Radio className="h-6 w-6" />
          <p className="mt-3 font-serif text-3xl leading-tight">Prêts pour la scène médiatique</p>
          <p className="mt-2 text-sm opacity-90">
            Kit presse validé : communiqué, biographies, visuels 300 dpi, permissions de diffusion.
          </p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">14</p>
              <p className="opacity-80">visuels HD</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">3</p>
              <p className="opacity-80">communiqués</p>
            </div>
            <div className="rounded-xl bg-white/15 p-2 text-center">
              <p className="font-serif text-xl">4</p>
              <p className="opacity-80">accréditations</p>
            </div>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accréditations</p>
          <div className="space-y-2">
            {accreds.map((a) => (
              <article key={a.name} className="flex items-center gap-3 rounded-2xl bg-surface p-3.5 shadow-soft">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-primary to-gold font-bold text-white">
                  {a.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{a.name}</p>
                  <p className="text-[11px] text-muted-foreground">{a.media} · {a.role}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                  a.status === "confirmée" ? "bg-primary/15 text-primary-dark" : "bg-gold/25 text-foreground"
                }`}>
                  {a.status}
                </span>
              </article>
            ))}
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border py-3 text-sm text-muted-foreground">
              <Plus className="h-4 w-4" /> Ajouter une accréditation
            </button>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contenus disponibles</p>
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 rounded-2xl bg-surface p-4 text-left shadow-soft">
              <Camera className="h-5 w-5 text-primary-dark" />
              <span className="text-sm font-semibold">Visuels HD · ZIP</span>
            </button>
            <button className="flex items-center gap-2 rounded-2xl bg-surface p-4 text-left shadow-soft">
              <Video className="h-5 w-5 text-primary-dark" />
              <span className="text-sm font-semibold">Vidéos b-roll</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
