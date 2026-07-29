import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Bus, Hotel, Utensils, Sparkles } from "lucide-react";

export const Route = createFileRoute("/events/$slug/city-guide")({
  component: CityGuide,
  head: () => ({
    meta: [
      { title: "Guide de la ville · Memento Live" },
      { name: "description", content: "Vos invités venus de loin ? Recommandez hôtels, restaurants et balades autour de votre événement." },
      { property: "og:title", content: "Guide de la ville · Memento Live" },
      { property: "og:description", content: "Un carnet d'adresses signature pour vos proches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Place = {
  id: string;
  name: string;
  type: "hotel" | "resto" | "balade" | "transport";
  km: number;
  price: string;
  rating: number;
  photo: string;
  note: string;
};

const places: Place[] = [
  { id: "p1", name: "Hôtel Yndo", type: "hotel", km: 0.8, price: "€€€", rating: 4.8, photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800", note: "Boutique-hôtel design en plein centre." },
  { id: "p2", name: "La Grande Maison", type: "resto", km: 1.2, price: "€€€€", rating: 4.9, photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800", note: "Table étoilée · réservation dès maintenant." },
  { id: "p3", name: "Miroir d'eau", type: "balade", km: 2, price: "Gratuit", rating: 4.7, photo: "https://images.unsplash.com/photo-1571893544028-06b07af6dade?w=800", note: "Coucher de soleil incontournable." },
  { id: "p4", name: "Tram ligne C", type: "transport", km: 0.3, price: "1,80 €", rating: 4.2, photo: "https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=800", note: "Depuis la gare · 12 min." },
  { id: "p5", name: "Le Petit Commerce", type: "resto", km: 0.9, price: "€€", rating: 4.6, photo: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800", note: "Poissons frais · ambiance conviviale." },
  { id: "p6", name: "Airbnb du Port", type: "hotel", km: 1.5, price: "€€", rating: 4.5, photo: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", note: "Idéal pour groupes de 4 à 6." },
];

const typeMeta: Record<Place["type"], { icon: typeof Hotel; label: string; color: string }> = {
  hotel: { icon: Hotel, label: "Hôtel", color: "bg-primary/15 text-primary" },
  resto: { icon: Utensils, label: "Restaurant", color: "bg-gold/20 text-gold" },
  balade: { icon: MapPin, label: "Balade", color: "bg-success/15 text-success" },
  transport: { icon: Bus, label: "Transport", color: "bg-foreground/10 text-foreground" },
};

function CityGuide() {
  const { slug } = useParams({ from: "/events/$slug/city-guide" });

  return (
    <div className="module-page">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur-xl">
        <Link to="/events/$slug" params={{ slug }} className="grid h-9 w-9 place-items-center rounded-full bg-surface">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <p className="font-serif text-lg leading-tight">Guide de Bordeaux</p>
          <p className="text-xs text-muted-foreground">Sélection des mariés · 6 adresses</p>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-5 px-4 py-5">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold via-primary to-primary-dark p-6 text-white shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-80">Notre carnet</p>
          <p className="mt-2 font-serif text-2xl leading-tight">Nos coups de cœur pour votre séjour</p>
          <p className="mt-2 text-sm opacity-90">Prolongez votre week-end à Bordeaux. Voici les lieux qui nous ressemblent.</p>
        </section>

        <div className="grid grid-cols-4 gap-2">
          {(Object.entries(typeMeta) as [Place["type"], typeof typeMeta[Place["type"]]][]).map(([k, m]) => (
            <button key={k} className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-xs font-semibold ${m.color}`}>
              <m.icon className="h-4 w-4" />
              {m.label}
            </button>
          ))}
        </div>

        <section className="space-y-3">
          {places.map((p) => {
            const M = typeMeta[p.type];
            return (
              <article key={p.id} className="overflow-hidden rounded-3xl bg-surface shadow-card">
                <div className="relative aspect-[16/9]">
                  <img src={p.photo} alt="" className="h-full w-full object-cover" />
                  <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold ${M.color}`}>
                    <M.icon className="h-3 w-3" /> {M.label}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                    {p.km} km · à pied
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-lg">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-sm text-primary">{p.price}</p>
                      <p className="text-[11px] text-gold">★ {p.rating}</p>
                    </div>
                  </div>
                  <button className="mt-3 w-full rounded-full bg-primary-light px-4 py-2 text-xs font-semibold text-primary">
                    Voir sur la carte
                  </button>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-3xl bg-surface p-5 shadow-card">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Astuce IA</p>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            42 % de vos invités arrivent le vendredi soir. Envoyez-leur ce guide en amont pour éviter les 20 SMS « où on mange ? ».
          </p>
          <button className="mt-3 rounded-full bg-gradient-primary px-4 py-2 text-xs font-semibold text-white shadow-glow">
            Envoyer aux invités
          </button>
        </section>
      </main>
    </div>
  );
}
