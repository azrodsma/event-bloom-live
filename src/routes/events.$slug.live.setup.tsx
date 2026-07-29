import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Radio, Youtube, Twitch, Copy, Check, ExternalLink, Wifi, Video, Mic, Camera, Sparkles, ChevronRight, ShieldCheck, Clock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/live/setup")({
  component: LiveSetup,
  head: () => ({
    meta: [
      { title: "Configurer votre live · Memento Live" },
      { name: "description", content: "Assistant en 4 étapes pour connecter YouTube ou Twitch, tester votre matériel et lancer votre diffusion en direct." },
      { property: "og:title", content: "Configurer votre live · Memento Live" },
      { property: "og:description", content: "Préparez votre diffusion en direct." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Platform = "youtube" | "twitch";

const steps = [
  { label: "Plateforme" },
  { label: "Connexion" },
  { label: "Test matériel" },
  { label: "Prêt" },
];

function LiveSetup() {
  const { slug } = useParams({ from: "/events/$slug/live/setup" });
  const [step, setStep] = useState(0);
  const [platform, setPlatform] = useState<Platform>("youtube");
  const [streamUrl, setStreamUrl] = useState("");
  const [mic, setMic] = useState(72);
  const [videoOn, setVideoOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const streamKey = "mmt_live_9b6e-A72d-8843-90ec";

  function next() {
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }
  function back() {
    setStep((s) => Math.max(0, s - 1));
  }
  function copyKey() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(streamKey).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Configurer le Live</p>
        <span className="w-9" />
      </div>

      <div className="px-4 pt-4">
        <div className="flex items-center gap-1.5">
          {steps.map((s, i) => (
            <div key={s.label} className="flex flex-1 items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full ${
                  i <= step ? "bg-primary" : "bg-secondary"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider">
          <span className="text-muted-foreground">
            Étape {step + 1} / {steps.length}
          </span>
          <span className="text-primary">{steps[step].label}</span>
        </div>
      </div>

      <div className="px-4 pt-6">
        {step === 0 && (
          <section>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Radio className="h-3.5 w-3.5 text-destructive" /> Étape 1
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Où diffuser<br />votre live ?</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Memento encapsule le player de la plateforme choisie. Aucun frais d'hébergement vidéo.
            </p>

            <div className="mt-6 space-y-3">
              {[
                { id: "youtube" as const, name: "YouTube Live", desc: "Recommandé · qualité 1080p, replay automatique", icon: Youtube, color: "text-red-600", bg: "bg-red-500/10" },
                { id: "twitch" as const, name: "Twitch", desc: "Idéal pour du chat en direct très actif", icon: Twitch, color: "text-purple-600", bg: "bg-purple-500/10" },
              ].map((p) => {
                const Icon = p.icon;
                const active = platform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPlatform(p.id)}
                    className={`flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition-colors ${
                      active ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.bg}`}>
                      <Icon className={`h-6 w-6 ${p.color}`} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-serif text-lg">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.desc}</p>
                    </div>
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full border-2 ${
                        active ? "border-primary bg-primary text-primary-foreground" : "border-border"
                      }`}
                    >
                      {active && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/60 p-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Sécurité
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Vos invités n'ont pas besoin de compte {platform === "youtube" ? "YouTube" : "Twitch"} : le player est intégré dans votre événement privé Memento.
              </p>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Radio className="h-3.5 w-3.5 text-destructive" /> Étape 2
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Connecter<br />{platform === "youtube" ? "YouTube" : "Twitch"}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Deux options : lien direct depuis votre chaîne, ou clé de flux pour OBS / caméra IP.
            </p>

            <div className="mt-6 rounded-3xl border border-border bg-card p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option A · Lien direct (recommandé)</p>
              <label className="mt-3 block">
                <span className="mb-1.5 block text-xs font-medium">
                  Coller l'URL de votre {platform === "youtube" ? "live YouTube" : "stream Twitch"}
                </span>
                <input
                  value={streamUrl}
                  onChange={(e) => setStreamUrl(e.target.value)}
                  placeholder={platform === "youtube" ? "https://youtube.com/watch?v=…" : "https://twitch.tv/…"}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </label>
              <a
                href={platform === "youtube" ? "https://studio.youtube.com" : "https://dashboard.twitch.tv"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                Ouvrir {platform === "youtube" ? "YouTube Studio" : "Twitch Dashboard"} <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="mt-4 rounded-3xl border border-dashed border-border bg-secondary/40 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option B · Clé de flux (OBS / Streamyard)</p>
              <p className="mt-2 text-[11px] text-muted-foreground">Serveur RTMP</p>
              <p className="font-mono text-xs">rtmp://ingest.memento.live/live</p>
              <p className="mt-3 text-[11px] text-muted-foreground">Clé de flux</p>
              <button
                onClick={copyKey}
                className="mt-1 flex w-full items-center justify-between gap-2 rounded-2xl bg-background px-3 py-2.5"
              >
                <span className="truncate font-mono text-xs">{"•".repeat(streamKey.length - 6)}{streamKey.slice(-6)}</span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold ${copied ? "bg-primary text-primary-foreground" : "bg-secondary"}`}>
                  {copied ? <><Check className="h-3 w-3" /> Copié</> : <><Copy className="h-3 w-3" /> Copier</>}
                </span>
              </button>
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <Radio className="h-3.5 w-3.5 text-destructive" /> Étape 3
            </div>
            <h1 className="mt-2 font-serif text-3xl leading-tight">Test du matériel</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Vérifiez caméra, micro et bande passante avant de démarrer.
            </p>

            <div className="mt-6 aspect-video overflow-hidden rounded-3xl bg-foreground/95 ring-1 ring-border">
              {videoOn ? (
                <div className="relative h-full w-full bg-gradient-to-br from-slate-800 via-slate-900 to-black">
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center text-white/70">
                      <Camera className="mx-auto h-10 w-10" />
                      <p className="mt-2 text-xs">Aperçu caméra</p>
                    </div>
                  </div>
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-destructive px-2 py-0.5 text-[9px] font-bold text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> Aperçu
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-semibold text-white">1080p · 30fps</span>
                </div>
              ) : (
                <div className="grid h-full place-items-center text-white/60">
                  <div className="text-center">
                    <Video className="mx-auto h-10 w-10 opacity-50" />
                    <p className="mt-2 text-xs">Caméra désactivée</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Mic className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Micro</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">Niveau {mic}%</span>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <span
                      key={i}
                      className={`h-3 flex-1 rounded-sm ${
                        i < mic / 5 ? (i > 15 ? "bg-destructive" : i > 12 ? "bg-amber-500" : "bg-primary") : "bg-secondary"
                      }`}
                    />
                  ))}
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={mic}
                  onChange={(e) => setMic(Number(e.target.value))}
                  className="mt-3 w-full accent-primary"
                  aria-label="Niveau du micro"
                />
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Caméra</span>
                </div>
                <button
                  onClick={() => setVideoOn((v) => !v)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${videoOn ? "bg-primary" : "bg-border"}`}
                  aria-label="Toggle camera"
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${videoOn ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Connexion</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary">
                    Excellente
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-mono text-sm font-bold">48<span className="text-[10px] text-muted-foreground"> Mbps</span></p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Débit up</p>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold">24<span className="text-[10px] text-muted-foreground"> ms</span></p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Latence</p>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold">0.2%</p>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Pertes</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="text-center">
            <div className="mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-primary text-white shadow-glow">
              <Sparkles className="h-10 w-10" />
            </div>
            <h1 className="mt-6 font-serif text-3xl leading-tight">Tout est prêt !</h1>
            <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
              Vous pouvez lancer votre diffusion. Vos invités seront notifiés au démarrage.
            </p>

            <ul className="mt-6 space-y-2 text-left">
              {[
                { label: "Plateforme", value: platform === "youtube" ? "YouTube Live" : "Twitch" },
                { label: "Source", value: streamUrl ? "Lien direct" : "Clé RTMP" },
                { label: "Notification aux invités", value: "68 invités" },
                { label: "Rediffusion", value: "Sauvegarde automatique" },
              ].map((r) => (
                <li key={r.label} className="flex items-center justify-between rounded-2xl bg-card px-4 py-3 ring-1 ring-border/60">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <span className="text-sm font-semibold">{r.value}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-amber-500/10 p-4 text-left">
              <p className="flex items-center gap-1.5 text-xs font-semibold text-amber-800">
                <Clock className="h-3.5 w-3.5" /> Conseil
              </p>
              <p className="mt-1 text-[11px] text-amber-900/80">
                Démarrez la diffusion 5 minutes avant la cérémonie pour laisser vos invités le temps de se connecter.
              </p>
            </div>

            <Link
              to="/events/$slug/live"
              params={{ slug }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-destructive py-4 text-sm font-bold text-white shadow-glow"
            >
              <Radio className="h-4 w-4" /> Démarrer la diffusion
            </Link>
          </section>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-20 border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-md items-center gap-3">
          {step > 0 && step < steps.length - 1 && (
            <button
              onClick={back}
              className="flex-1 rounded-full border border-border py-3 text-sm font-semibold"
            >
              Retour
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              onClick={next}
              disabled={step === 1 && !streamUrl}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-foreground py-3 text-sm font-semibold text-background disabled:opacity-40"
            >
              Continuer <ChevronRight className="h-4 w-4" />
            </button>
          )}
          {step === steps.length - 1 && (
            <button onClick={() => setStep(0)} className="w-full rounded-full border border-border py-3 text-sm font-semibold">
              Recommencer la configuration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
