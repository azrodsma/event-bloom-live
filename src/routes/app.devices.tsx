import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Smartphone, Monitor, Tablet, LogOut } from "lucide-react";

export const Route = createFileRoute("/app/devices")({
  component: Devices,
  head: () => ({
    meta: [
      { title: "Appareils connectés · MaFeliza" },
      { name: "description", content: "Contrôlez et sécurisez tous les appareils liés à votre compte." },
      { property: "og:title", content: "Appareils · MaFeliza" },
      { property: "og:description", content: "La souveraineté sur vos sessions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const devices = [
  { name: "iPhone 15 Pro · Léa", icon: Smartphone, location: "Paris · maintenant", current: true, color: "from-primary to-primary-dark" },
  { name: "MacBook Air · Léa", icon: Monitor, location: "Paris · il y a 3h", current: false, color: "from-foreground to-primary-dark" },
  { name: "iPad Pro · maison", icon: Tablet, location: "Aix · hier", current: false, color: "from-gold to-primary" },
  { name: "iPhone 13 · Thomas (co-organisateur)", icon: Smartphone, location: "Lyon · il y a 12h", current: false, color: "from-primary-dark to-foreground" },
];

function Devices() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/app" className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Appareils connectés</p>
          <p className="text-xs text-muted-foreground">4 sessions actives · aucune suspecte</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/10 to-gold/20 p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary-dark">Sécurité</p>
          <p className="mt-2 font-serif text-3xl leading-tight">Vous savez qui se connecte</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Chaque session est chiffrée et localisée. Une alerte instantanée vous prévient d'une connexion inhabituelle.
          </p>
        </section>

        <section className="space-y-2">
          {devices.map((d) => (
            <article key={d.name} className={`overflow-hidden rounded-2xl bg-gradient-to-br ${d.color} p-4 text-white shadow-soft`}>
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-white/20">
                  <d.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-serif text-lg leading-tight">{d.name}</p>
                    {d.current && <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-primary-dark">Actuel</span>}
                  </div>
                  <p className="text-xs opacity-85">{d.location}</p>
                </div>
                {!d.current && (
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
                    <LogOut className="h-4 w-4" />
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>

        <button className="w-full rounded-full bg-destructive/10 py-3 text-sm font-semibold text-destructive">
          Déconnecter toutes les autres sessions
        </button>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Alertes de connexion</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous recevrez un email + push pour toute nouvelle connexion depuis un appareil inconnu ou un pays différent.
          </p>
        </section>
      </main>
    </div>
  );
}
