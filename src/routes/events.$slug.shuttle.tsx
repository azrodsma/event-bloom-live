import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Bus, MapPin, Clock, Users, Check, Phone, AlertCircle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/shuttle")({
  component: Shuttle,
  head: () => ({
    meta: [
      { title: "Navettes · MaFeliza" },
      { name: "description", content: "Réservez votre place dans les navettes collectives affrétées pour l'événement." },
      { property: "og:title", content: "Navettes · MaFeliza" },
      { property: "og:description", content: "Aller-retour organisé, sans stress ni voiture." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Trip = {
  id: string;
  direction: "aller" | "retour";
  from: string;
  to: string;
  departure: string;
  arrival: string;
  seats: number;
  taken: number;
  price: string;
  vehicle: string;
  note?: string;
};

const trips: Trip[] = [
  { id: "t1", direction: "aller", from: "Gare Paris-Est", to: "Château de Chantilly", departure: "14:30", arrival: "15:45", seats: 55, taken: 42, price: "Offert", vehicle: "Autocar grand tourisme" },
  { id: "t2", direction: "aller", from: "Hôtel Ibis Chantilly", to: "Château de Chantilly", departure: "15:15", arrival: "15:35", seats: 20, taken: 12, price: "Offert", vehicle: "Minibus Mercedes" },
  { id: "t3", direction: "retour", from: "Château de Chantilly", to: "Hôtel Ibis Chantilly", departure: "01:30", arrival: "01:50", seats: 20, taken: 15, price: "Offert", vehicle: "Minibus Mercedes", note: "Départ toutes les 30 min jusqu'à 3h" },
  { id: "t4", direction: "retour", from: "Château de Chantilly", to: "Gare Paris-Est", departure: "02:00", arrival: "03:15", seats: 55, taken: 28, price: "Offert", vehicle: "Autocar grand tourisme" },
];

function Shuttle() {
  const { slug } = useParams({ from: "/events/$slug/shuttle" });
  const [booked, setBooked] = useState<Set<string>>(new Set());
  const [tab, setTab] = useState<"aller" | "retour">("aller");

  const visible = trips.filter((t) => t.direction === tab);
  const total = booked.size;

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Navettes</p>
        <span className="w-9" />
      </div>

      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Bus className="h-3.5 w-3.5 text-primary" /> Transport collectif
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Voyagez avec les autres invités</h1>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Navettes affrétées par les mariés — laissez la voiture, profitez de la soirée.
        </p>
        <div className="mt-4 flex gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
            <Check className="h-3 w-3" /> {total} trajet{total > 1 ? "s" : ""} réservé{total > 1 ? "s" : ""}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">100 % offert par les mariés</span>
        </div>
      </section>

      <div className="sticky top-14 z-10 bg-background/95 px-4 pt-4 backdrop-blur">
        <div className="flex gap-1 rounded-full bg-secondary p-1 text-sm font-semibold">
          {(["aller", "retour"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex-1 rounded-full py-2 capitalize transition ${tab === k ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              {k === "aller" ? "🚌 Aller" : "🌙 Retour"}
            </button>
          ))}
        </div>
      </div>

      <ul className="space-y-3 px-4 pt-5">
        {visible.map((t) => {
          const isBooked = booked.has(t.id);
          const percent = Math.round(((t.taken + (isBooked ? 1 : 0)) / t.seats) * 100);
          const remaining = t.seats - t.taken - (isBooked ? 1 : 0);
          return (
            <li key={t.id} className={`rounded-3xl border p-4 transition ${isBooked ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {t.departure} → {t.arrival}
                  </div>
                  <p className="mt-1 font-serif text-lg leading-tight">
                    {t.from}
                    <span className="mx-1.5 text-muted-foreground">→</span>
                    {t.to}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {t.vehicle}
                  </p>
                </div>
                <span className="rounded-full bg-accent/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {t.price}
                </span>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {t.taken + (isBooked ? 1 : 0)} / {t.seats} places
                  </span>
                  <span className={remaining < 5 ? "font-semibold text-primary" : ""}>
                    {remaining} restantes
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {t.note && (
                <p className="mt-3 flex items-center gap-1.5 rounded-2xl bg-secondary px-3 py-2 text-[11px] text-muted-foreground">
                  <AlertCircle className="h-3.5 w-3.5 text-primary" /> {t.note}
                </p>
              )}

              <button
                onClick={() => setBooked((s) => { const n = new Set(s); n.has(t.id) ? n.delete(t.id) : n.add(t.id); return n; })}
                disabled={!isBooked && remaining <= 0}
                className={`mt-4 w-full rounded-full py-2.5 text-xs font-bold transition-all ${
                  isBooked
                    ? "bg-primary/10 text-primary"
                    : "bg-foreground text-background hover:opacity-90 disabled:opacity-40"
                }`}
              >
                {isBooked ? "✓ Place réservée · Annuler" : remaining <= 0 ? "Complet" : "Réserver ma place"}
              </button>
            </li>
          );
        })}
      </ul>

      <section className="mx-4 mt-6 rounded-3xl border border-border/60 bg-card p-4">
        <p className="font-serif text-base">Coordinateur navette</p>
        <p className="mt-1 text-[11px] text-muted-foreground">Nicolas · 06 12 34 56 78 · disponible dès 13 h</p>
        <a href="tel:+33612345678" className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-xs font-bold">
          <Phone className="h-3.5 w-3.5" /> Appeler
        </a>
      </section>
    </div>
  );
}
