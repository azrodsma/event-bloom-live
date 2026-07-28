import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Car, ParkingCircle, MapPin, Zap } from "lucide-react";

export const Route = createFileRoute("/events/$slug/parking")({
  component: Parking,
  head: () => ({
    meta: [
      { title: "Parking & voituriers · Memento Live" },
      { name: "description", content: "Places réservées, voituriers et bornes de recharge pour vos invités." },
      { property: "og:title", content: "Parking · Memento Live" },
      { property: "og:description", content: "Un stationnement fluide, dès l'arrivée." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const zones = [
  { name: "Cour d'honneur", cap: 12, taken: 8, type: "VIP + PMR", color: "from-gold to-primary-dark" },
  { name: "Parking sud", cap: 80, taken: 54, type: "Standard", color: "from-primary to-primary-dark" },
  { name: "Parking prairie", cap: 60, taken: 12, type: "Débordement", color: "from-primary-dark to-gold" },
  { name: "Bornes de recharge", cap: 4, taken: 3, type: "Type 2 · 22kW", color: "from-foreground to-primary" },
];

function Parking() {
  const { slug } = useParams({ from: "/events/$slug/parking" });
  const total = zones.reduce((a, z) => a + z.cap, 0);
  const used = zones.reduce((a, z) => a + z.taken, 0);
  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Parking & voituriers</p>
          <p className="text-xs text-muted-foreground">{used}/{total} places · 2 voituriers</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="rounded-3xl bg-gradient-to-br from-cream via-primary/15 to-gold/20 p-6 shadow-card">
          <ParkingCircle className="h-6 w-6 text-primary-dark" />
          <p className="mt-3 font-serif text-3xl leading-tight">Stationnement fluide</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Voituriers dès 16h, PMR balisées, 4 bornes de recharge. Chaque zone est fléchée depuis la route.
          </p>
        </section>

        <section className="grid grid-cols-2 gap-2">
          {zones.map((z) => {
            const pct = Math.round((z.taken / z.cap) * 100);
            return (
              <article key={z.name} className={`rounded-2xl bg-gradient-to-br ${z.color} p-4 text-white shadow-soft`}>
                <p className="text-[10px] font-bold uppercase opacity-80">{z.type}</p>
                <p className="mt-1 font-serif text-lg leading-tight">{z.name}</p>
                <p className="mt-2 font-serif text-3xl">{z.taken}<span className="text-sm opacity-70">/{z.cap}</span></p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/25">
                  <div className="h-full rounded-full bg-white" style={{ width: `${pct}%` }} />
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl bg-surface p-4 shadow-soft">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Car className="h-3.5 w-3.5" /> Voituriers
          </div>
          <div className="mt-3 space-y-2">
            {[
              { n: "Julien D.", h: "16:00 – 22:00", note: "Cour d'honneur" },
              { n: "Anaïs P.", h: "18:00 – 02:00", note: "Retour véhicules" },
            ].map((v) => (
              <div key={v.n} className="flex items-center justify-between rounded-2xl bg-cream p-3">
                <div>
                  <p className="text-sm font-semibold">{v.n}</p>
                  <p className="text-[11px] text-muted-foreground">{v.note}</p>
                </div>
                <p className="text-xs font-semibold text-primary-dark">{v.h}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl bg-foreground p-5 text-background shadow-card">
          <Zap className="h-5 w-5 text-primary" />
          <p className="mt-2 font-serif text-lg leading-tight">Recharge VE prioritaire</p>
          <p className="mt-1 text-sm opacity-80">3 bornes occupées · réservez un créneau via l'app pour vos invités.</p>
          <button className="mt-3 rounded-full bg-primary px-4 py-2 text-xs font-semibold">
            <MapPin className="mr-1 inline h-3.5 w-3.5" /> Voir sur la carte
          </button>
        </section>
      </main>
    </div>
  );
}
