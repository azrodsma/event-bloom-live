import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Radio, Users, Volume2, VolumeX, Maximize2, Camera, Wifi, WifiOff, Mic } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/cameras")({
  component: Cameras,
  head: () => ({
    meta: [
      { title: "Caméras du direct · MaFeliza" },
      { name: "description", content: "Basculez entre plusieurs points de vue en direct : cérémonie, cocktail, piste de danse." },
      { property: "og:title", content: "Caméras du direct · MaFeliza" },
      { property: "og:description", content: "Multi-caméras en direct." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Cam {
  id: string;
  name: string;
  operator: string;
  poster: string;
  viewers: number;
  status: "live" | "standby" | "offline";
  quality: "1080p" | "720p" | "480p";
  hasAudio: boolean;
}

const cams: Cam[] = [
  { id: "main", name: "Cérémonie · Autel", operator: "Camille (pro)", poster: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop", viewers: 68, status: "live", quality: "1080p", hasAudio: true },
  { id: "guests", name: "Vue invités", operator: "Louis", poster: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=1200&auto=format&fit=crop", viewers: 22, status: "live", quality: "720p", hasAudio: false },
  { id: "cocktail", name: "Cocktail · Jardin", operator: "Léa", poster: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&auto=format&fit=crop", viewers: 15, status: "live", quality: "720p", hasAudio: true },
  { id: "dance", name: "Piste de danse", operator: "DJ Marc", poster: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&auto=format&fit=crop", viewers: 0, status: "standby", quality: "1080p", hasAudio: true },
  { id: "drone", name: "Drone extérieur", operator: "Sky Studio", poster: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200&auto=format&fit=crop", viewers: 0, status: "offline", quality: "1080p", hasAudio: false },
];

function Cameras() {
  const { slug } = useParams({ from: "/events/$slug/cameras" });
  const [active, setActive] = useState<string>("main");
  const [muted, setMuted] = useState(false);
  const current = cams.find((c) => c.id === active) ?? cams[0];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 backdrop-blur-xl">
        <Link
          to="/events/$slug/live"
          params={{ slug }}
          className="grid h-9 w-9 place-items-center rounded-full bg-white/10"
          aria-label="Retour au live"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">Multi-caméras</p>
          <p className="font-serif text-lg">{current.name}</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-1 text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> LIVE
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
        <img src={current.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />

        <div className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">{current.quality}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
            <Users className="h-2.5 w-2.5" /> {current.viewers}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold backdrop-blur">
            <Camera className="h-2.5 w-2.5" /> {current.operator}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 flex gap-2">
          <button
            onClick={() => setMuted((m) => !m)}
            className="grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur"
            aria-label={muted ? "Activer le son" : "Couper le son"}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-black/60 backdrop-blur" aria-label="Plein écran">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="px-4 pb-6 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-wider text-white/60">Toutes les caméras · {cams.length}</p>
          <p className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold">
            <Radio className="h-3 w-3 text-destructive" /> {cams.filter((c) => c.status === "live").length} en direct
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cams.map((c) => {
            const isActive = c.id === active;
            const isLive = c.status === "live";
            return (
              <button
                key={c.id}
                onClick={() => c.status !== "offline" && setActive(c.id)}
                disabled={c.status === "offline"}
                className={`relative overflow-hidden rounded-2xl text-left transition-all ${
                  isActive ? "ring-2 ring-primary" : "ring-1 ring-white/10"
                } ${c.status === "offline" ? "opacity-40" : ""}`}
              >
                <div className="relative aspect-video bg-slate-800">
                  <img src={c.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  {isLive && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-destructive px-1.5 py-0.5 text-[9px] font-bold">
                      <span className="h-1 w-1 rounded-full bg-white animate-pulse" /> LIVE
                    </span>
                  )}
                  {c.status === "standby" && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold">
                      STANDBY
                    </span>
                  )}
                  {c.status === "offline" && (
                    <span className="absolute inset-0 grid place-items-center">
                      <WifiOff className="h-6 w-6 text-white/50" />
                    </span>
                  )}

                  <div className="absolute bottom-1.5 right-1.5 flex gap-1">
                    {c.hasAudio ? (
                      <span className="grid h-5 w-5 place-items-center rounded-full bg-black/60">
                        <Mic className="h-2.5 w-2.5" />
                      </span>
                    ) : null}
                    {isLive && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-semibold">
                        <Users className="h-2 w-2" /> {c.viewers}
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-2.5">
                  <p className="truncate text-xs font-semibold">{c.name}</p>
                  <p className="mt-0.5 truncate text-[10px] text-white/60">{c.operator}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 rounded-3xl bg-white/5 p-4 backdrop-blur">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
            <Wifi className="h-3.5 w-3.5 text-primary" /> Qualité du réseau
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="font-mono text-lg font-bold">48<span className="text-[10px] text-white/50"> Mbps</span></p>
              <p className="text-[9px] uppercase tracking-wider text-white/50">Débit</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold">24<span className="text-[10px] text-white/50"> ms</span></p>
              <p className="text-[9px] uppercase tracking-wider text-white/50">Latence</p>
            </div>
            <div>
              <p className="font-mono text-lg font-bold text-primary">HD</p>
              <p className="text-[9px] uppercase tracking-wider text-white/50">Qualité auto</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-white/50">
          Astuce : chaque invité peut proposer sa caméra depuis son téléphone.
        </p>
      </div>
    </div>
  );
}
