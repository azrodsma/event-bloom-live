import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, Plane, Train, Car, Bed, Coffee, MapPin, ChevronRight, Phone, Clock, Sparkles, Umbrella } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/events/$slug/guides")({
  component: Guides,
  head: () => ({
    meta: [
      { title: "Guide d'accueil · MaFeliza" },
      { name: "description", content: "Tout ce qu'il faut savoir pour venir de loin : trains, avions, hôtels et bonnes adresses." },
      { property: "og:title", content: "Guide d'accueil · MaFeliza" },
      { property: "og:description", content: "Guide d'accueil pour invités venant de loin." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type ArrivalMode = "train" | "plane" | "car";

const trains = [
  { line: "TGV 6641", from: "Paris Gare de Lyon", arr: "13 h 42", dur: "1 h 58", price: "à partir de 39 €" },
  { line: "TGV 6667", from: "Lyon Part-Dieu", arr: "14 h 15", dur: "1 h 40", price: "à partir de 32 €" },
  { line: "Intercités 3821", from: "Marseille", arr: "13 h 20", dur: "3 h 05", price: "à partir de 45 €" },
];

const flights = [
  { line: "AF 7642", from: "Nice", arr: "12 h 55", dur: "1 h 15", price: "à partir de 78 €" },
  { line: "EZY 4211", from: "Nantes", arr: "13 h 40", dur: "1 h 20", price: "à partir de 65 €" },
];

const hotels = [
  {
    name: "Château de Villette · Suite invités",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600",
    distance: "0 km · sur place",
    price: "180 € / nuit",
    codeLabel: "MEMENTO-14JUIN · –20 %",
    perks: ["Petit-déjeuner", "Navette gratuite", "Wi-Fi"],
    booked: 12,
  },
  {
    name: "Auberge de la Rose",
    image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600",
    distance: "4,2 km · 8 min en voiture",
    price: "à partir de 95 €",
    codeLabel: "SARAH-THOMAS · –10 %",
    perks: ["Petit-déjeuner", "Parking"],
    booked: 6,
  },
  {
    name: "Camping Étoiles & Toile",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600",
    distance: "6 km · vue rivière",
    price: "à partir de 45 €",
    codeLabel: "Sans code",
    perks: ["Cabanes bois", "Feux autorisés"],
    booked: 4,
  },
];

const spots = [
  { icon: Coffee, name: "Café du Marché", why: "Petit-déj le lendemain, terrasse au soleil.", time: "à 5 min à pied" },
  { icon: MapPin, name: "Sentier des étangs", why: "Balade de 30 min, idéale au réveil.", time: "à 2 km" },
  { icon: Umbrella, name: "Plage privée du Domaine", why: "Détente le dimanche après-midi.", time: "à 800 m" },
];

const contacts = [
  { name: "Sarah (mariée)", role: "Toutes questions", phone: "06 12 34 56 78" },
  { name: "Julien (témoin)", role: "Logistique & navette", phone: "06 98 76 54 32" },
  { name: "Château (accueil)", role: "Arrivée & check-in", phone: "04 42 12 34 56" },
];

function Guides() {
  const { slug } = useParams({ from: "/events/$slug/guides" });
  const [mode, setMode] = useState<ArrivalMode>("train");
  const [wallet, setWallet] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setWallet((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  return (
    <div className="module-page">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/40 bg-background/70 px-4 py-3.5 backdrop-blur-2xl safe-top">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted" aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <p className="font-serif text-lg">Guide d'accueil</p>
        <span className="w-9" />
      </div>

      <section className="bg-gradient-to-b from-accent/40 to-transparent px-4 pb-6 pt-6">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> 68 invités · 12 régions
        </div>
        <h1 className="mt-2 font-serif text-3xl leading-tight">Bienvenue<br />en Provence</h1>
        <p className="mt-2 max-w-xs text-sm text-muted-foreground">
          Tout ce qu'il faut savoir pour venir, dormir et savourer votre week-end.
        </p>
      </section>

      <section className="px-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Comment venir ?</p>
        <div className="grid grid-cols-3 gap-1.5">
          {(
            [
              { id: "train" as const, icon: Train, label: "Train" },
              { id: "plane" as const, icon: Plane, label: "Avion" },
              { id: "car" as const, icon: Car, label: "Voiture" },
            ]
          ).map((m) => {
            const Icon = m.icon;
            const active = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`rounded-2xl border-2 py-3 text-center transition-colors ${
                  active ? "border-primary bg-primary/5 text-primary" : "border-border bg-card text-foreground"
                }`}
              >
                <Icon className="mx-auto h-5 w-5" />
                <p className="mt-1 text-xs font-semibold">{m.label}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-3 space-y-2">
          {mode === "train" &&
            trains.map((t) => (
              <div key={t.line} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <Train className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{t.line} · {t.from}</p>
                  <p className="text-[11px] text-muted-foreground">Arrivée {t.arr} · {t.dur} · {t.price}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          {mode === "plane" &&
            flights.map((f) => (
              <div key={f.line} className="flex items-center gap-3 rounded-2xl bg-card p-3 ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary">
                  <Plane className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{f.line} · {f.from}</p>
                  <p className="text-[11px] text-muted-foreground">Arrivée {f.arr} · {f.dur} · {f.price}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          {mode === "car" && (
            <div className="rounded-2xl bg-card p-4 ring-1 ring-border/60">
              <p className="text-sm font-semibold">Depuis Paris</p>
              <p className="mt-1 text-[11px] text-muted-foreground">A6 puis A7 · 7 h 30 sans pause · péages ≈ 78 €</p>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-sm font-semibold">Parking Domaine</p>
                <p className="mt-1 text-[11px] text-muted-foreground">Gratuit · 120 places · fléché depuis la D17</p>
              </div>
              <button className="mt-3 w-full rounded-full bg-foreground py-2 text-xs font-bold text-background">
                Ouvrir dans Waze
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-primary/5 p-3 text-[11px]">
          <Car className="h-4 w-4 shrink-0 text-primary" />
          <span>Navette gratuite depuis la gare · départs à 13 h 30 & 14 h 45 le 14 juin.</span>
        </div>
      </section>

      <section className="mt-8 px-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Où dormir</p>
          <span className="text-[10px] text-muted-foreground">3 partenaires</span>
        </div>
        <ul className="mt-3 space-y-3">
          {hotels.map((h) => {
            const saved = wallet.has(h.name);
            return (
              <li key={h.name} className="overflow-hidden rounded-3xl border border-border/60 bg-card">
                <div className="relative h-32 w-full overflow-hidden">
                  <img src={h.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
                    <Bed className="mr-1 inline h-3 w-3" /> {h.booked} invités
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-serif text-lg leading-tight">{h.name}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{h.distance}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {h.perks.map((p) => (
                      <span key={p} className="rounded-full bg-secondary px-2 py-0.5 text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{h.price}</p>
                      <p className="text-[10px] font-semibold text-primary">Code : {h.codeLabel}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggle(h.name)}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold ${
                          saved ? "border-primary bg-primary/10 text-primary" : "border-border bg-background"
                        }`}
                      >
                        {saved ? "Enregistré" : "Enregistrer"}
                      </button>
                      <button className="rounded-full bg-foreground px-3 py-1.5 text-[11px] font-bold text-background">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Bonnes adresses des mariés</p>
        <ul className="mt-3 space-y-2">
          {spots.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.name} className="flex items-center gap-3 rounded-2xl bg-card p-3.5 ring-1 ring-border/60">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-accent/40 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.why}</p>
                </div>
                <span className="text-[10px] text-muted-foreground">{s.time}</span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-8 px-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Phone className="h-3.5 w-3.5" /> Contacts sur place
        </p>
        <ul className="mt-3 space-y-1.5">
          {contacts.map((c) => (
            <li key={c.name} className="flex items-center justify-between rounded-2xl bg-secondary/60 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{c.name}</p>
                <p className="text-[10px] text-muted-foreground">{c.role}</p>
              </div>
              <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold text-primary-foreground">
                Appeler
              </a>
            </li>
          ))}
        </ul>
      </section>

      <div className="mx-4 mt-6 flex items-center gap-2 rounded-3xl bg-primary/5 p-4 text-[11px] text-muted-foreground">
        <Clock className="h-4 w-4 shrink-0 text-primary" />
        <p>Guide mis à jour le 12 juin par Sarah — signalez toute info manquante via la messagerie.</p>
      </div>
    </div>
  );
}
