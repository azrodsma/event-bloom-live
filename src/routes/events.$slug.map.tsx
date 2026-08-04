import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Navigation, Clock, Car, Train, Hotel, Utensils, Church, PartyPopper } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/map")({
  component: EventMap,
  head: () => ({
    meta: [
      { title: "Plan & itinéraires · MaFeliza" },
      { name: "description", content: "Retrouvez tous les lieux clés de l'événement, itinéraires, hébergements et bonnes adresses aux alentours." },
      { property: "og:title", content: "Plan & itinéraires · MaFeliza" },
      { property: "og:description", content: "La carte interactive de l'événement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

interface Place {
  id: string;
  name: string;
  address: string;
  category: "cérémonie" | "réception" | "hôtel" | "restaurant";
  time?: string;
  x: number;
  y: number;
  distance: string;
  color: string;
  icon: typeof Church;
}

const places: Place[] = [
  { id: "p1", name: "Église Saint-Émilion", address: "Place de l'Église, Saint-Émilion", category: "cérémonie", time: "14 h 30", x: 32, y: 44, distance: "0 km", color: "#E85D8E", icon: Church },
  { id: "p2", name: "Château La Rose", address: "Route des Vignes, Saint-Émilion", category: "réception", time: "17 h 00", x: 63, y: 58, distance: "4,2 km", color: "#D9A441", icon: PartyPopper },
  { id: "p3", name: "Hôtel Les Vignes", address: "12 rue du Château", category: "hôtel", x: 48, y: 30, distance: "1,8 km", color: "#7B9CBE", icon: Hotel },
  { id: "p4", name: "Le Tertre – Restaurant", address: "5 place du Tertre", category: "restaurant", x: 24, y: 68, distance: "0,6 km", color: "#8FA37E", icon: Utensils },
  { id: "p5", name: "Domaine La Grave", address: "Chemin des Vignes", category: "hôtel", x: 78, y: 40, distance: "5,1 km", color: "#7B9CBE", icon: Hotel },
];

const categories = [
  { id: "all", label: "Tous" },
  { id: "cérémonie", label: "Cérémonie" },
  { id: "réception", label: "Réception" },
  { id: "hôtel", label: "Hôtels" },
  { id: "restaurant", label: "Restaurants" },
] as const;

function EventMap() {
  const { slug } = useParams({ from: "/events/$slug/map" });
  const [cat, setCat] = useState<(typeof categories)[number]["id"]>("all");
  const [active, setActive] = useState<Place>(places[0]);

  const visible = cat === "all" ? places : places.filter((p) => p.category === cat);

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Plan & itinéraires</p>
        <span className="w-9" />
      </div>

      <div className="relative mx-4 mt-4 aspect-[4/3] overflow-hidden rounded-3xl border border-border/60 shadow-inner">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, #EAD4B0 0%, #E4D2B4 30%, #D9C79E 60%, #C4B080 100%)",
          }}
        />
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M0,60 Q30,50 50,55 T100,58" stroke="#B49A6D" strokeWidth="0.8" fill="none" />
          <path d="M10,20 Q40,30 60,25 T100,30" stroke="#B49A6D" strokeWidth="0.5" fill="none" opacity="0.7" />
          <path d="M0,80 Q40,75 70,82 T100,80" stroke="#B49A6D" strokeWidth="0.5" fill="none" opacity="0.7" />
          <path
            d="M32,44 Q45,50 63,58"
            stroke="#E85D8E"
            strokeWidth="0.7"
            strokeDasharray="1.5 1.5"
            fill="none"
          />
        </svg>

        {[
          { top: "12%", left: "18%", label: "Vignoble Nord" },
          { top: "70%", left: "72%", label: "Vignoble Sud" },
          { top: "22%", left: "80%", label: "Bois" },
        ].map((l) => (
          <span
            key={l.label}
            className="absolute select-none font-serif text-[9px] uppercase tracking-widest text-foreground/40"
            style={{ top: l.top, left: l.left }}
          >
            {l.label}
          </span>
        ))}

        {visible.map((p) => {
          const Icon = p.icon;
          const isActive = active.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className={`absolute -translate-x-1/2 -translate-y-full transition-transform ${
                isActive ? "z-10 scale-110" : "z-0 scale-100 hover:scale-105"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={p.name}
            >
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg ring-2 ring-white"
                style={{ backgroundColor: p.color }}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="absolute left-1/2 top-full h-2 w-0.5 -translate-x-1/2" style={{ backgroundColor: p.color }} />
            </button>
          );
        })}
      </div>

      <div className="scrollbar-none mt-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
              cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <section className="mx-4 mt-4 rounded-3xl border border-border/60 bg-card p-4">
        <div className="flex items-start gap-3">
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-white"
            style={{ backgroundColor: active.color }}
          >
            <active.icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-lg leading-tight">{active.name}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {active.address}
            </p>
            {active.time && (
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium">
                <Clock className="h-3 w-3" /> {active.time}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-2xl bg-background p-3">
            <Car className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold">8 min</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Voiture</p>
          </div>
          <div className="rounded-2xl bg-background p-3">
            <Train className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold">22 min</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Transports</p>
          </div>
          <div className="rounded-2xl bg-background p-3">
            <Navigation className="mx-auto h-4 w-4 text-primary" />
            <p className="mt-1 text-[11px] font-semibold">{active.distance}</p>
            <p className="text-[9px] uppercase tracking-wider text-muted-foreground">Distance</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground">
            <Navigation className="h-4 w-4" /> Itinéraire
          </button>
          <button className="flex-1 rounded-full border border-border py-2.5 text-sm font-medium">
            Copier l'adresse
          </button>
        </div>
      </section>

      <section className="mt-6 px-4">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Tous les lieux</p>
        <ul className="space-y-2">
          {visible.map((p) => (
            <li key={p.id}>
              <button
                onClick={() => setActive(p)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors ${
                  active.id === p.id ? "border-primary bg-primary/5" : "border-border/60 bg-card"
                }`}
              >
                <span
                  className="grid h-10 w-10 place-items-center rounded-full text-white"
                  style={{ backgroundColor: p.color }}
                >
                  <p.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{p.address}</p>
                </div>
                <div className="text-right text-[10px] text-muted-foreground">
                  <p>{p.distance}</p>
                  {p.time && <p className="mt-0.5 font-semibold text-primary">{p.time}</p>}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
