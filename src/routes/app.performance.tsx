import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Zap, Battery, Wifi, HardDrive, Moon, Bell } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/app/performance")({
  component: Performance,
  head: () => ({
    meta: [
      { title: "Performance & données · MaFeliza" },
      { name: "description", content: "Économisez batterie et données mobiles pendant vos événements." },
      { property: "og:title", content: "Performance & données · MaFeliza" },
      { property: "og:description", content: "Une app fluide, même en 4G." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Toggle = { id: string; icon: typeof Zap; label: string; desc: string };

const toggles: Toggle[] = [
  { id: "eco", icon: Battery, label: "Mode éco batterie", desc: "Désactive les animations et le préchargement vidéo" },
  { id: "data", icon: Wifi, label: "Économiseur de données", desc: "Charge les photos en basse résolution en 4G" },
  { id: "night", icon: Moon, label: "Silence nocturne", desc: "Notifications coupées entre 23h et 8h" },
  { id: "offline", icon: HardDrive, label: "Cache hors-ligne", desc: "Garde vos 3 derniers événements accessibles sans réseau" },
  { id: "push", icon: Bell, label: "Notifications groupées", desc: "Regroupe les alertes toutes les 15 min" },
];

function Performance() {
  const [on, setOn] = useState<Record<string, boolean>>({ eco: true, offline: true });
  const cache = 248;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Performance</p>
          <p className="text-xs text-muted-foreground">Batterie · données · stockage</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-gradient-to-br from-success to-primary p-4 text-white shadow-card">
            <Battery className="h-5 w-5" />
            <p className="mt-2 font-serif text-2xl leading-none">84%</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">Batterie</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark p-4 text-white shadow-card">
            <Wifi className="h-5 w-5" />
            <p className="mt-2 font-serif text-2xl leading-none">1,2 Go</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">Données · 7j</p>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-gold to-primary p-4 text-white shadow-card">
            <HardDrive className="h-5 w-5" />
            <p className="mt-2 font-serif text-2xl leading-none">{cache}</p>
            <p className="text-[10px] uppercase tracking-wider opacity-90">Mo cache</p>
          </div>
        </section>

        <section>
          <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Optimisations</p>
          <div className="space-y-2">
            {toggles.map((t) => {
              const active = !!on[t.id];
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setOn((s) => ({ ...s, [t.id]: !s[t.id] }))}
                  className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3.5 text-left shadow-soft transition hover:shadow-card"
                >
                  <div className={`grid h-11 w-11 flex-shrink-0 place-items-center rounded-2xl ${active ? "bg-primary/15 text-primary" : "bg-cream text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                  <div className={`h-6 w-11 flex-shrink-0 rounded-full p-0.5 transition ${active ? "bg-primary" : "bg-muted"}`}>
                    <div className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${active ? "translate-x-5" : ""}`} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-cream p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-dark">
            <Zap className="h-4 w-4" /> Astuce du jour
          </div>
          <p className="mt-2 font-serif text-lg leading-tight">
            Activez le mode éco 30 min avant un live pour tenir toute la cérémonie.
          </p>
          <button className="mt-3 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Vider le cache · {cache} Mo
          </button>
        </section>
      </main>
    </div>
  );
}
