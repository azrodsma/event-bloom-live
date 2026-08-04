import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Palette, Type, Sparkles, Check, Sun, Moon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/appearance")({
  component: Appearance,
  head: () => ({
    meta: [
      { title: "Apparence · MaFeliza" },
      { name: "description", content: "Personnalisez l'ambiance de l'app : thème, palette, typographie, rayons et grain." },
      { property: "og:title", content: "Apparence · MaFeliza" },
      { property: "og:description", content: "L'app à votre image, jusqu'au dernier pixel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

const palettes = [
  { id: "signature", name: "Signature", colors: ["#E85D8E", "#FFF8F4", "#D9A441", "#0F0F10"] },
  { id: "sauge", name: "Sauge & lin", colors: ["#8FA97A", "#F0EBE0", "#D9A441", "#3C4A2E"] },
  { id: "azur", name: "Azur & sable", colors: ["#A9C7D6", "#FFF8F4", "#E85D8E", "#1F3B4D"] },
  { id: "onyx", name: "Onyx doré", colors: ["#D9A441", "#FFF8F4", "#B45309", "#0F0F10"] },
];

const fontPairs = [
  { id: "signature", head: "Playfair Display", body: "Inter", preview: "Sarah & Thomas" },
  { id: "serif", head: "Cormorant", body: "Karla", preview: "Sarah & Thomas" },
  { id: "modern", head: "Instrument Serif", body: "Work Sans", preview: "Sarah & Thomas" },
];

function Appearance() {
  const [theme, setTheme] = useState<"clair" | "sombre" | "auto">("clair");
  const [palette, setPalette] = useState("signature");
  const [pair, setPair] = useState("signature");
  const [radius, setRadius] = useState(24);
  const [grain, setGrain] = useState(false);
  const [reduce, setReduce] = useState(false);

  const p = palettes.find((x) => x.id === palette)!;
  const fp = fontPairs.find((x) => x.id === pair)!;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Apparence</p>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10">
          <Palette className="h-4 w-4 text-primary" />
        </span>
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Ambiance
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">L'app à votre image</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Réglez chaque nuance et prévisualisez en direct sur une carte d'événement.
        </p>
      </section>

      <section className="px-4 pt-6">
        <div
          className="overflow-hidden shadow-xl transition"
          style={{ borderRadius: `${radius}px`, background: p.colors[1] }}
        >
          <div className="h-32 w-full" style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[2]})` }} />
          <div className="space-y-2 p-4" style={{ color: p.colors[3] }}>
            <p className="text-[10px] uppercase tracking-[0.25em]" style={{ color: p.colors[0] }}>
              12 juin 2026 · Provence
            </p>
            <p className="font-serif text-2xl leading-tight" style={{ fontFamily: `'${fp.head}', serif` }}>
              {fp.preview}
            </p>
            <p className="text-[13px] leading-relaxed" style={{ fontFamily: `'${fp.body}', system-ui`, color: p.colors[3] }}>
              Un aperçu d'un événement dans l'ambiance choisie — palette, radius et typographie sont appliqués en temps réel.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: p.colors[0], color: p.colors[1] }}>
                Cérémonie
              </span>
              <span className="rounded-full px-3 py-1 text-[10px] font-bold" style={{ background: p.colors[2], color: p.colors[3] }}>
                Dîner
              </span>
            </div>
          </div>
          {grain && <div className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply" style={{
            backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence baseFrequency='0.9'/></filter><rect width='120' height='120' filter='url(%23n)' opacity='0.4'/></svg>\")"
          }} />}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Thème</h2>
        <div className="grid grid-cols-3 gap-2">
          {(["clair", "sombre", "auto"] as const).map((t) => {
            const on = theme === t;
            const Icon = t === "clair" ? Sun : t === "sombre" ? Moon : Sparkles;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-3 transition ${
                  on ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                }`}
              >
                <Icon className="h-4 w-4 text-primary" />
                <span className="text-[11px] font-semibold capitalize">{t}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Palette</h2>
        <ul className="space-y-2">
          {palettes.map((op) => {
            const on = palette === op.id;
            return (
              <li key={op.id}>
                <button
                  onClick={() => setPalette(op.id)}
                  className={`flex w-full items-center gap-3 rounded-2xl border p-2.5 text-left transition ${
                    on ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex overflow-hidden rounded-xl">
                    {op.colors.map((c) => (
                      <span key={c} className="h-10 w-6" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="flex-1 font-serif text-[14px]">{op.name}</p>
                  {on && (
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <Type className="h-3 w-3" /> Typographies
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {fontPairs.map((op) => {
            const on = pair === op.id;
            return (
              <button
                key={op.id}
                onClick={() => setPair(op.id)}
                className={`rounded-2xl border p-3 text-left transition ${
                  on ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                }`}
              >
                <p className="font-serif text-base leading-tight" style={{ fontFamily: `'${op.head}', serif` }}>
                  Aa
                </p>
                <p className="mt-1 text-[10px] font-semibold">{op.head}</p>
                <p className="text-[9px] text-muted-foreground">{op.body}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Arrondis · {radius}px</h2>
        <input
          type="range"
          min={4}
          max={40}
          step={2}
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          <span>Angulaire</span>
          <span>Doux</span>
          <span>Généreux</span>
        </div>
      </section>

      <section className="px-4 pt-6">
        <ul className="space-y-2">
          {[
            { label: "Grain photographique", desc: "Texture subtile sur les visuels.", v: grain, set: setGrain },
            { label: "Animations réduites", desc: "Respecte le paramètre système.", v: reduce, set: setReduce },
          ].map((r) => (
            <li key={r.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3">
              <div className="min-w-0 flex-1">
                <p className="font-serif text-[14px] leading-tight">{r.label}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{r.desc}</p>
              </div>
              <button
                onClick={() => r.set(!r.v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${r.v ? "bg-primary" : "bg-border"}`}
                aria-label={r.label}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${r.v ? "left-[22px]" : "left-0.5"}`} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button className="mx-4 mt-6 w-[calc(100%-2rem)] rounded-full bg-foreground py-3 text-xs font-bold text-background">
        Appliquer partout
      </button>
    </div>
  );
}
