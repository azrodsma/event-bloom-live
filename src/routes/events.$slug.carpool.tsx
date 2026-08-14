import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Car, MapPin, Clock, Users, Plus, MessageCircle, Fuel } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/carpool")({
  component: Carpool,
  head: () => ({
    meta: [
      { title: "Covoiturage · MaFeliza" },
      { name: "description", content: "Partagez la route avec les autres invités : proposez ou rejoignez un trajet en quelques secondes." },
      { property: "og:title", content: "Covoiturage · MaFeliza" },
      { property: "og:description", content: "Le covoiturage entre invités." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Way = "aller" | "retour";

interface Ride {
  id: string;
  driver: string;
  avatar: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number;
  taken: number;
  price: string;
  way: Way;
  passengers: string[];
  note?: string;
}

const initial: Ride[] = [
  {
    id: "r1",
    driver: "Camille Rousseau",
    avatar: "https://i.pravatar.cc/64?img=32",
    from: "Paris (Gare Montparnasse)",
    to: "Château La Rose, Saint-Émilion",
    date: "Sam. 25 juil.",
    time: "07 h 30",
    seats: 4,
    taken: 2,
    price: "Partage essence · 25 €",
    way: "aller",
    passengers: ["https://i.pravatar.cc/32?img=12", "https://i.pravatar.cc/32?img=45"],
    note: "Coffre pour un bagage cabine par personne.",
  },
  {
    id: "r2",
    driver: "Julien Mercier",
    avatar: "https://i.pravatar.cc/64?img=12",
    from: "Bordeaux (Aéroport)",
    to: "Château La Rose, Saint-Émilion",
    date: "Sam. 25 juil.",
    time: "12 h 15",
    seats: 3,
    taken: 3,
    price: "Offert 🤍",
    way: "aller",
    passengers: [
      "https://i.pravatar.cc/32?img=44",
      "https://i.pravatar.cc/32?img=14",
      "https://i.pravatar.cc/32?img=13",
    ],
  },
  {
    id: "r3",
    driver: "Nadia Ouali",
    avatar: "https://i.pravatar.cc/64?img=45",
    from: "Bordeaux (Centre)",
    to: "Église Saint-Émilion",
    date: "Sam. 25 juil.",
    time: "13 h 00",
    seats: 5,
    taken: 1,
    price: "15 € / place",
    way: "aller",
    passengers: ["https://i.pravatar.cc/32?img=47"],
    note: "Départ précis 13 h, café offert !",
  },
  {
    id: "r4",
    driver: "Paul Vasseur",
    avatar: "https://i.pravatar.cc/64?img=14",
    from: "Château La Rose",
    to: "Bordeaux (Gare Saint-Jean)",
    date: "Dim. 26 juil.",
    time: "10 h 00",
    seats: 4,
    taken: 0,
    price: "Partage essence · 10 €",
    way: "retour",
    passengers: [],
  },
];

function Carpool() {
  const { slug } = useParams({ from: "/events/$slug/carpool" });
  const [rides, setRides] = useState(initial);
  const [way, setWay] = useState<"all" | Way>("all");
  const [showForm, setShowForm] = useState(false);

  const filtered = rides.filter((r) => way === "all" || r.way === way);
  const totalSeats = rides.reduce((s, r) => s + r.seats, 0);
  const totalTaken = rides.reduce((s, r) => s + r.taken, 0);

  function join(id: string) {
    setRides((prev) =>
      prev.map((r) =>
        r.id === id && r.taken < r.seats
          ? { ...r, taken: r.taken + 1, passengers: [...r.passengers, "https://i.pravatar.cc/32?img=8"] }
          : r,
      ),
    );
  }

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Covoiturage</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-secondary/70 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Car className="h-3.5 w-3.5 text-primary" /> Partagez la route
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Rejoignez un trajet ou<br />proposez-en un</h1>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">{rides.length}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Trajets</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none text-primary">{totalTaken}/{totalSeats}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Places</p>
          </div>
          <div className="rounded-2xl bg-background/80 p-3 text-center">
            <p className="font-serif text-xl leading-none">-42 kg</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">CO₂ économisé</p>
          </div>
        </div>
      </section>

      <div className="flex gap-2 px-4 pt-4">
        {(["all", "aller", "retour"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWay(w)}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium ${
              way === w ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"
            }`}
          >
            {w === "all" ? "Tous" : w === "aller" ? "Aller" : "Retour"}
          </button>
        ))}
      </div>

      <ul className="space-y-3 px-4 pt-4">
        {filtered.map((r) => {
          const full = r.taken >= r.seats;
          const percent = Math.round((r.taken / r.seats) * 100);
          return (
            <li key={r.id} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="flex items-start gap-3 p-4">
                <img src={r.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium">{r.driver}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                        r.way === "aller" ? "bg-primary/10 text-primary" : "bg-accent/30 text-foreground"
                      }`}
                    >
                      {r.way}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    <Clock className="mr-1 inline h-3 w-3" /> {r.date} · {r.time}
                  </p>
                </div>
              </div>

              <div className="relative mx-4 pb-3">
                <div className="absolute left-2 top-2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-primary/60 to-transparent" />
                <div className="relative flex items-start gap-3 pl-6">
                  <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary text-white text-[8px]">
                    <MapPin className="h-2.5 w-2.5" />
                  </span>
                  <p className="text-xs leading-tight">{r.from}</p>
                </div>
                <div className="relative mt-3 flex items-start gap-3 pl-6">
                  <span className="absolute left-0 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-foreground text-white text-[8px]">
                    <MapPin className="h-2.5 w-2.5" />
                  </span>
                  <p className="text-xs leading-tight">{r.to}</p>
                </div>
              </div>

              {r.note && (
                <p className="mx-4 mb-3 rounded-xl bg-secondary/50 px-3 py-2 text-[11px] italic text-foreground/70">
                  « {r.note} »
                </p>
              )}

              <div className="border-t border-border/60 bg-background/40 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {r.passengers.map((p, i) => (
                        <img key={i} src={p} alt="" className="h-6 w-6 rounded-full border-2 border-background object-cover" />
                      ))}
                      {Array.from({ length: r.seats - r.taken }).map((_, i) => (
                        <span
                          key={`e${i}`}
                          className="grid h-6 w-6 place-items-center rounded-full border-2 border-dashed border-border bg-background text-muted-foreground"
                        >
                          <Users className="h-2.5 w-2.5" />
                        </span>
                      ))}
                    </div>
                    <span className="text-[11px] font-semibold">
                      {r.taken}/{r.seats}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-primary">
                    <Fuel className="h-3 w-3" /> {r.price}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full transition-all ${full ? "bg-muted-foreground" : "bg-primary"}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    disabled={full}
                    onClick={() => join(r.id)}
                    className="flex-1 rounded-full bg-foreground py-2 text-xs font-semibold text-background disabled:opacity-40"
                  >
                    {full ? "Complet" : "Réserver une place"}
                  </button>
                  <button className="grid h-9 w-9 place-items-center rounded-full border border-border" aria-label="Message">
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {showForm && (
        <div
          className="fixed inset-0 z-30 grid place-items-end bg-black/40 backdrop-blur-sm sm:place-items-center"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-md rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-border sm:hidden" />
            <h2 className="font-serif text-2xl">Proposer un trajet</h2>
            <p className="mt-1 text-xs text-muted-foreground">Renseignez les grandes lignes, on complète après.</p>
            <div className="mt-5 space-y-3">
              {[
                { label: "Départ", placeholder: "Ex. Bordeaux Saint-Jean" },
                { label: "Arrivée", placeholder: "Ex. Château La Rose" },
                { label: "Date & heure", placeholder: "Sam. 25 juil. · 12 h 00" },
                { label: "Places disponibles", placeholder: "3" },
                { label: "Participation", placeholder: "Ex. 15 € / place" },
              ].map((f) => (
                <div key={f.label}>
                  <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{f.label}</label>
                  <input
                    placeholder={f.placeholder}
                    className="mt-1 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="mt-5 w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground"
            >
              Publier le trajet
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
      >
        <Plus className="h-4 w-4" /> Proposer un trajet
      </button>
    </div>
  );
}
