import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Radio, Video } from "lucide-react";

export const Route = createFileRoute("/events/$slug/multicam")({
  component: MultiCam,
  head: () => ({
    meta: [
      { title: "Régie multi-caméras · MaFeliza" },
      { name: "description", content: "6 flux vidéo simultanés, un seul director." },
      { property: "og:title", content: "Multi-cam · MaFeliza" },
      { property: "og:description", content: "Switch live entre 6 angles pour un rendu TV." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const cams = [
  { n: "CAM 1", l: "Autel · fixe large", op: "Auto (Mevo Start)", tag: "LIVE" },
  { n: "CAM 2", l: "Autel · zoom émotion", op: "Julien (vidéaste)", tag: "PGM" },
  { n: "CAM 3", l: "Régie invités · travelling", op: "Sofia (assistante)", tag: "PRV" },
  { n: "CAM 4", l: "Drone extérieur", op: "Pilote DJI Mavic", tag: "STDBY" },
  { n: "CAM 5", l: "GoPro témoin marié", op: "Auto · cheek mount", tag: "REC" },
  { n: "CAM 6", l: "Cabine photobooth", op: "Auto boucle 15s", tag: "REC" },
];

function MultiCam() {
  return (
    <div className="module-page">
      <header className="sticky top-0 z-40 border-b border-border/40 bg-background/70 backdrop-blur-2xl safe-top">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3.5">
          <Link to="/events/$slug" params={{ slug: "mariage-lea-thomas" }} className="glass grid h-10 w-10 place-items-center rounded-full ring-1 ring-border/60 transition-transform active:scale-95" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-serif text-xl leading-tight">Régie multi-caméras</h1>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">6 flux · latence 480 ms</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-light">
            <Radio className="h-4 w-4 text-primary" />
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-6">
        <section className="rounded-3xl bg-gradient-to-br from-foreground to-black p-6 text-white">
          <Video className="h-6 w-6" />
          <h2 className="mt-2 font-display text-3xl leading-tight">Le mariage vu comme un match de foot.</h2>
          <p className="mt-3 text-sm opacity-90">Notre app orchestre 6 caméras en RTMP, envoie le meilleur angle sur YouTube live et enregistre chaque flux en 4K pour le montage final.</p>
        </section>

        <div className="grid grid-cols-2 gap-3">
          {cams.map((c) => (
            <div key={c.n} className="rounded-2xl border border-border/50 bg-card p-4 aspect-video flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-cream/50 to-primary/10" />
              <div className="relative flex items-center justify-between">
                <span className="font-mono text-xs">{c.n}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${c.tag === "LIVE" || c.tag === "PGM" ? "bg-red-500 text-white" : c.tag === "REC" ? "bg-primary text-white" : "bg-cream text-muted-foreground"}`}>{c.tag}</span>
              </div>
              <div className="relative">
                <p className="text-sm font-medium">{c.l}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{c.op}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-cream p-5 text-sm">
          <p className="font-medium">Diffusion multi-plateformes</p>
          <p className="text-xs text-muted-foreground mt-1">Restream vers YouTube · Twitch · lecteur intégré MaFeliza. Aucun frais d'hébergement vidéo : nous encapsulons.</p>
        </div>
      </main>
    </div>
  );
}
